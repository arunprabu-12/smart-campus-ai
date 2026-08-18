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
    print("==> Extracting semestersData from frontend coursesData.js...")
    
    # Run node to extract semestersData
    node_cmd = [
        "node", "--input-type=module", "-e",
        "import('./frontend/src/data/coursesData.js').then(m => console.log(JSON.stringify(m.semestersData)))"
    ]
    
    # Run from root workspace directory
    cwd = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    result = subprocess.run(node_cmd, capture_output=True, text=True, cwd=cwd)
    
    if result.returncode != 0:
        print("Error executing node to parse coursesData.js:", result.stderr)
        return
        
    try:
        semesters_data = json.loads(result.stdout)
        print("Successfully parsed semestersData JSON!")
    except Exception as e:
        print("Failed to parse Node stdout as JSON:", e)
        print(result.stdout[:500])
        return

    db = SessionLocal()
    try:
        # Get regulation 2023
        reg = db.query(Regulation).filter(Regulation.name == "2023").first()
        if not reg:
            print("Regulation 2023 not found in DB! Seeding it...")
            reg = Regulation(name="2023", description="Regulation 2023 — Anna University curriculum")
            db.add(reg)
            db.commit()
            db.refresh(reg)
            
        print(f"Using Regulation: {reg.name} (ID: {reg.id})")
        
        # Keep track of counts
        courses_count = 0
        units_count = 0
        topics_count = 0

        # Loop through semesters
        for sem_num_str, courses_list in semesters_data.items():
            sem_num = int(sem_num_str)
            print(f"\nProcessing Semester {sem_num}...")
            
            # Find or create Semester
            sem = db.query(Semester).filter(Semester.number == sem_num, Semester.regulation_id == reg.id).first()
            if not sem:
                sem = Semester(number=sem_num, regulation_id=reg.id)
                db.add(sem)
                db.commit()
                db.refresh(sem)
                
            for c_data in courses_list:
                code = c_data["course_code"]
                name = c_data["course_name"]
                credits = c_data.get("credits", 3)
                desc = c_data.get("description", "")
                
                # Find or create Course
                course = db.query(Course).filter(Course.course_code == code).first()
                if not course:
                    course = Course(
                        course_code=code,
                        course_name=name,
                        credits=credits,
                        description=desc,
                        semester_id=sem.id
                    )
                    db.add(course)
                    db.commit()
                    db.refresh(course)
                    courses_count += 1
                else:
                    # Update existing details
                    course.course_name = name
                    course.credits = credits
                    course.description = desc
                    course.semester_id = sem.id
                    db.commit()
                
                # Add Units & Topics
                for u_data in c_data.get("units", []):
                    unit_number = int(u_data.get("unit_number") or u_data.get("unit_index") or 1)
                    u_title = u_data.get("title", f"Unit {unit_number}")
                    learning_objectives = u_data.get("learning_objectives", "")
                    
                    # Find or create Unit
                    unit = db.query(Unit).filter(Unit.course_id == course.id, Unit.order_index == unit_number).first()
                    if not unit:
                        unit = Unit(
                            course_id=course.id,
                            title=u_title,
                            order_index=unit_number
                        )
                        db.add(unit)
                        db.commit()
                        db.refresh(unit)
                        units_count += 1
                    else:
                        unit.title = u_title
                        db.commit()
                        
                    # Find or create Topics
                    topics_list = u_data.get("topics", [])
                    subtopics_list = u_data.get("subtopics", [])
                    
                    for idx, t_title in enumerate(topics_list):
                        sub = subtopics_list[idx] if idx < len(subtopics_list) else ""
                        notes_content = f"Learning Objectives: {learning_objectives}\nSubtopics: {sub}"
                        
                        # Find or create Topic
                        topic = db.query(Topic).filter(Topic.unit_id == unit.id, Topic.title == t_title).first()
                        if not topic:
                            topic = Topic(
                                unit_id=unit.id,
                                title=t_title,
                                notes=notes_content
                            )
                            db.add(topic)
                            db.commit()
                            db.refresh(topic)
                            topics_count += 1
                        else:
                            topic.notes = notes_content
                            db.commit()
                            
        print(f"\n[CURRICULUM SYNC COMPLETED]")
        print(f"Added {courses_count} new courses.")
        print(f"Added {units_count} new units.")
        print(f"Added {topics_count} new topics.")
        
        # Reset serial sequences in PostgreSQL since we added database items
        print("Resetting primary key sequences...")
        db.execute(text("SELECT setval(pg_get_serial_sequence('courses', 'id'), coalesce(max(id),0) + 1, false) FROM courses;"))
        db.execute(text("SELECT setval(pg_get_serial_sequence('units', 'id'), coalesce(max(id),0) + 1, false) FROM units;"))
        db.execute(text("SELECT setval(pg_get_serial_sequence('topics', 'id'), coalesce(max(id),0) + 1, false) FROM topics;"))
        db.commit()
        print("Sequence reset complete.")
        
    except Exception as err:
        db.rollback()
        print("Error during database seeding:", err)
    finally:
        db.close()

if __name__ == "__main__":
    main()
