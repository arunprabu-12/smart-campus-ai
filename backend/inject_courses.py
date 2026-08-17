from app.database import SessionLocal
from app.models.course import Course
from app.models.semester import Semester
from sqlalchemy import text

db = SessionLocal()

# Fix the PostgreSQL sequence for the courses table since we bulk-inserted IDs earlier
db.execute(text("SELECT setval(pg_get_serial_sequence('courses', 'id'), coalesce(max(id),0) + 1, false) FROM courses;"))
db.commit()

sem7 = db.query(Semester).filter(Semester.number == 7, Semester.regulation_id == 1).first()
if not sem7:
    print("Semester 7 not found!")
else:
    courses_to_add = [
        {"code": "AI701", "name": "Agentic AI", "credits": 3},
        {"code": "AI702", "name": "Manufacturing", "credits": 3},
        {"code": "AI703", "name": "Cloud Computing", "credits": 3}
    ]
    
    for c in courses_to_add:
        # Check if already exists in this semester by name loosely
        existing = db.query(Course).filter(Course.course_name.ilike(f"%{c['name']}%"), Course.semester_id == sem7.id).first()
        if not existing:
            # Check if course_code is already used globally
            existing_code = db.query(Course).filter(Course.course_code == c["code"]).first()
            if not existing_code:
                new_course = Course(
                    course_code=c["code"],
                    course_name=c["name"],
                    credits=c["credits"],
                    semester_id=sem7.id,
                    description=f"Course on {c['name']}"
                )
                db.add(new_course)
                print(f"Added {c['name']}")
            else:
                print(f"Course code {c['code']} already in use, skipping {c['name']}")
        else:
            print(f"{c['name']} already exists as {existing.course_name}")

    db.commit()

db.close()
