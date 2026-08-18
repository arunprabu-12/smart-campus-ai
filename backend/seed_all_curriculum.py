import subprocess
import json
import sys
import os

sys.path.append(os.path.abspath(os.path.dirname(__file__)))
from app.database import SessionLocal
from app.models.regulation import Regulation
from app.models.semester import Semester
from app.models.course import Course
from app.models.unit import Unit
from app.models.topic import Topic
from sqlalchemy import text

def main():
    print("==> Extracting semestersData from frontend...")
    
    node_cmd = [
        "node", "--input-type=module", "-e",
        "import('./frontend/src/data/coursesData.js').then(m => console.log(JSON.stringify(m.semestersData)))"
    ]
    
    cwd = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    result = subprocess.run(node_cmd, capture_output=True, text=True, cwd=cwd)
    
    if result.returncode != 0:
        print("Error executing node to parse coursesData.js:", result.stderr)
        return
        
    try:
        semesters_data = json.loads(result.stdout)
    except Exception as e:
        print("Failed to parse Node stdout as JSON:", e)
        return

    db = SessionLocal()
    try:
        # Get regulation 2023
        reg = db.query(Regulation).filter(Regulation.name == "2023").first()
        if not reg:
            reg = Regulation(name="2023", description="Regulation 2023 — Anna University curriculum")
            db.add(reg)
            db.commit()
            db.refresh(reg)
            
        print(f"Using Regulation: {reg.name} (ID: {reg.id})")

        # 1. Pre-fetch all semesters for regulation
        semesters = {s.number: s for s in db.query(Semester).filter(Semester.regulation_id == reg.id).all()}
        
        # 2. Pre-fetch all courses to avoid SELECT inside loop
        existing_courses = {c.course_code: c for c in db.query(Course).all()}
        
        # 3. Create missing Semesters first
        for sem_num_str in semesters_data.keys():
            sem_num = int(sem_num_str)
            if sem_num not in semesters:
                sem = Semester(number=sem_num, regulation_id=reg.id)
                db.add(sem)
                db.commit()
                db.refresh(sem)
                semesters[sem_num] = sem

        # 4. Insert or Update Courses in bulk/memory
        courses_to_add = []
        for sem_num_str, courses_list in semesters_data.items():
            sem_num = int(sem_num_str)
            sem = semesters[sem_num]
            
            for c_data in courses_list:
                code = c_data["course_code"]
                name = c_data["course_name"]
                credits = c_data.get("credits", 3)
                desc = c_data.get("description", "")
                
                if code in existing_courses:
                    course = existing_courses[code]
                    course.course_name = name
                    course.credits = credits
                    course.description = desc
                    course.semester_id = sem.id
                else:
                    course = Course(
                        course_code=code,
                        course_name=name,
                        credits=credits,
                        description=desc,
                        semester_id=sem.id
                    )
                    db.add(course)
                    courses_to_add.append(course)

        if courses_to_add:
            db.commit()
            # Refresh newly added courses to get their generated database IDs
            for c in courses_to_add:
                db.refresh(c)
                existing_courses[c.course_code] = c
        else:
            db.commit()

        # 5. Pre-fetch all Units to memory
        existing_units = {}
        for u in db.query(Unit).all():
            existing_units[f"{u.course_id}-{u.order_index}"] = u

        # 6. Insert/Update Units in memory
        units_to_add = []
        for sem_num_str, courses_list in semesters_data.items():
            for c_data in courses_list:
                code = c_data["course_code"]
                course = existing_courses[code]
                
                for u_data in c_data.get("units", []):
                    unit_number = int(u_data.get("unit_number") or u_data.get("unit_index") or 1)
                    u_title = u_data.get("title", f"Unit {unit_number}")
                    
                    key = f"{course.id}-{unit_number}"
                    if key in existing_units:
                        unit = existing_units[key]
                        unit.title = u_title
                    else:
                        unit = Unit(
                            course_id=course.id,
                            title=u_title,
                            order_index=unit_number
                        )
                        db.add(unit)
                        units_to_add.append((key, unit))

        if units_to_add:
            db.commit()
            for key, u in units_to_add:
                db.refresh(u)
                existing_units[key] = u
        else:
            db.commit()

        # 7. Pre-fetch all Topics to memory
        existing_topics = {}
        for t in db.query(Topic).all():
            existing_topics[f"{t.unit_id}-{t.title.lower().strip()}"] = t

        # 8. Insert/Update Topics in bulk
        topics_count = 0
        for sem_num_str, courses_list in semesters_data.items():
            for c_data in courses_list:
                code = c_data["course_code"]
                course = existing_courses[code]
                
                for u_data in c_data.get("units", []):
                    unit_number = int(u_data.get("unit_number") or u_data.get("unit_index") or 1)
                    unit = existing_units[f"{course.id}-{unit_number}"]
                    
                    topics_list = u_data.get("topics", [])
                    subtopics_list = u_data.get("subtopics", [])
                    learning_objectives = u_data.get("learning_objectives", "")
                    
                    for idx, t_title in enumerate(topics_list):
                        sub = subtopics_list[idx] if idx < len(subtopics_list) else ""
                        notes_content = f"Learning Objectives: {learning_objectives}\nSubtopics: {sub}"
                        
                        key = f"{unit.id}-{t_title.lower().strip()}"
                        if key in existing_topics:
                            topic = existing_topics[key]
                            topic.notes = notes_content
                        else:
                            topic = Topic(
                                unit_id=unit.id,
                                title=t_title,
                                notes=notes_content
                            )
                            db.add(topic)
                            topics_count += 1
                            
        db.commit()
        print(f"\n[CURRICULUM SYNC COMPLETED]")
        print(f"Successfully processed all courses, units, and topics in bulk!")
        
        # Reset primary key sequences
        db.execute(text("SELECT setval(pg_get_serial_sequence('courses', 'id'), coalesce(max(id),0) + 1, false) FROM courses;"))
        db.execute(text("SELECT setval(pg_get_serial_sequence('units', 'id'), coalesce(max(id),0) + 1, false) FROM units;"))
        db.execute(text("SELECT setval(pg_get_serial_sequence('topics', 'id'), coalesce(max(id),0) + 1, false) FROM topics;"))
        db.commit()
        
    except Exception as err:
        db.rollback()
        print("Error during database seeding:", err)
    finally:
        db.close()

if __name__ == "__main__":
    main()
