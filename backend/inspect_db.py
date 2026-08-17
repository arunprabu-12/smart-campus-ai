from app.database import SessionLocal
from app.models.department import Department
from app.models.regulation import Regulation
from app.models.semester import Semester
from app.models.course import Course

db = SessionLocal()

print("--- Departments ---")
for d in db.query(Department).all():
    print(f"ID: {d.id}, Name: {d.name}, Code: {d.code}")

print("\n--- Regulations ---")
for r in db.query(Regulation).all():
    print(f"ID: {r.id}, Name: {r.name}")

print("\n--- Semesters ---")
for s in db.query(Semester).all():
    print(f"ID: {s.id}, Number: {s.number}, RegID: {s.regulation_id}")
    courses = db.query(Course).filter(Course.semester_id == s.id).all()
    if courses:
        print(f"   Courses: {[c.course_name for c in courses]}")

db.close()
