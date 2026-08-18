from app.database import SessionLocal
from app.models.course import Course
from app.models.semester import Semester

db = SessionLocal()

print("--- Semesters ---")
sems = db.query(Semester).all()
for s in sems:
    print(f"Semester ID: {s.id}, Number: {s.number}, Regulation: {s.regulation_id}")
    courses = db.query(Course).filter(Course.semester_id == s.id).all()
    print(f"  Courses count: {len(courses)}")
    for c in courses:
        print(f"    Code: {c.course_code}, Name: {c.course_name}")

db.close()
