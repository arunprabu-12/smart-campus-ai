from app.database import SessionLocal
from app.models.student import Student
from app.models.course import Course
from app.models.semester import Semester
from app.models.student_course import StudentCourse

db = SessionLocal()

print("--- Students ---")
students = db.query(Student).all()
for s in students:
    print(f"ID: {s.id}, Name: {s.full_name}, Email: {s.college_email}, Sem: {s.current_semester}, RegID: {s.regulation_id}")
    
    # Check enrolled courses
    scs = db.query(StudentCourse).filter(StudentCourse.student_id == s.id).all()
    print(f"  Enrolled Course IDs: {[sc.course_id for sc in scs]}")
    
    # Check courses for current semester
    sem = db.query(Semester).filter(Semester.number == s.current_semester, Semester.regulation_id == s.regulation_id).first()
    if sem:
        courses = db.query(Course).filter(Course.semester_id == sem.id).all()
        print(f"  Semester {s.current_semester} (ID {sem.id}) Courses: {[c.course_name for c in courses]}")
    else:
        print(f"  Semester {s.current_semester} not found in DB for Regulation ID {s.regulation_id}")

db.close()
