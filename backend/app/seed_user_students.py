from app.database import SessionLocal
from app.models.department import Department
from app.models.regulation import Regulation
from app.models.student import Student
from app.models.admin_user import AdminUser
from app.auth.security import hash_password
from app.models.semester import Semester
from app.models.semester_completion import SemesterCompletion
from app.models.course import Course
from app.models.assignment import Assignment, AssignmentSubmission
from app.models.test import Test, TestAttempt, TestResult
from datetime import datetime
import random
from sqlalchemy import text

db = SessionLocal()

def sync_sequences():
    for table in ["students", "semester_completion", "assignment_submissions", "test_attempts", "test_results"]:
        try:
            db.execute(text(f"SELECT setval(pg_get_serial_sequence('{table}', 'id'), coalesce(max(id), 1), max(id) IS NOT NULL) FROM {table}"))
            db.commit()
            print(f"Synced sequence for {table}")
        except Exception as e:
            db.rollback()
            print(f"Skipping sequence sync for {table}: {e}")

sync_sequences()

# 1. Create/Update Staff Users and associate courses
staff_info = [
    {
        "name": "Kapil",
        "email": "kapil@college.edu",
        "department": "Deep Learning, Machine Learning, Natural Language Processing"
    },
    {
        "name": "Madhubala",
        "email": "madhubala@college.edu",
        "department": "Agentic AI, Computer Networks"
    },
    {
        "name": "Selvarani",
        "email": "selvarani@college.edu",
        "department": "Big Data Analytics, Manufacturing AI"
    }
]

for s in staff_info:
    user = db.query(AdminUser).filter(AdminUser.email == s["email"]).first()
    if not user:
        user = AdminUser(
            full_name=s["name"],
            email=s["email"],
            password_hash=hash_password("staff123"),
            role="staff",
            department=s["department"],
            is_active=True
        )
        db.add(user)
    else:
        user.department = s["department"]
        user.password_hash = hash_password("staff123")
db.commit()

# 2. Get Department and Regulation
aids_dept = db.query(Department).filter(Department.name == "Artificial Intelligence and Data Science").first()
reg_2023 = db.query(Regulation).filter(Regulation.name == "2023").first()

students_to_add = [
    ("231801002", "ABHINAVU PRASAD"),
    ("231801003", "aishwarya m"),
    ("231801011", "ARCHANA R M"),
    ("231801012", "ARUN PRABU M M"),
    ("231801016", "ASWIN SATHEESH"),
    ("231801022", "BHARATH RAJ N S"),
    ("231801026", "DARSHINI R"),
    ("231801027", "DEEPAK S"),
    ("231801032", "DHARSHANA S"),
    ("231801047", "HANNAH JAMES"),
    ("231801049", "HARINI S"),
    ("231801056", "HEMANANTH S"),
    ("231801061", "IRAIYANBU S T"),
    ("231801062", "JAGADEESAN T"),
    ("231801065", "JANANI V R"),
    ("231801075", "JYOSTNA J"),
    ("231801083", "KEERTHNA S"),
    ("231801086", "KRITHIKA MA"),
    ("231801087", "KUMARAN D"),
    ("231801096", "MANISHA P"),
    ("231801098", "MATHAN S"),
    ("231801109", "MOHANRAJI PICHANDI"),
    ("231801112", "MUKESH KUMAR S"),
    ("231801113", "MURALI KRISHNA M"),
    ("231801118", "NIKITHA S S"),
    ("231801119", "NITHENKUMAR S"),
    ("231801132", "RAGUL G"),
    ("231801144", "SACHIN K G"),
    ("231801149", "SANJAY N"),
    ("231801155", "SARANYA V"),
    ("231801159", "SASI SRIRAM E"),
    ("231801169", "SOORYA G"),
    ("231801189", "VISHVAM GANESH"),
    ("231801507", "SHRI RAM M")
]

# 3. Add Students
for reg, name in students_to_add:
    email = f"{reg}@rajalakshmi.edu.in"
    s_obj = db.query(Student).filter(Student.register_number == reg).first()
    if not s_obj:
        s_obj = Student(
            full_name=name,
            register_number=reg,
            college_email=email,
            password_hash=hash_password("123456789"),
            department_id=aids_dept.id if aids_dept else 1,
            regulation_id=reg_2023.id if reg_2023 else 1,
            admission_year=2023,
            current_semester=5,
            section="A" if int(reg[-1]) % 2 == 0 else "B",
            career_interest="Artificial Intelligence",
            cgpa=8.2
        )
        db.add(s_obj)
        db.flush()
    else:
        s_obj.current_semester = 5
        s_obj.full_name = name
        s_obj.college_email = email
        s_obj.password_hash = hash_password("123456789")

db.commit()
sync_sequences()

# 4. Seed Semester Completion for semesters 1-4 for the new students
for reg, name in students_to_add:
    stud_obj = db.query(Student).filter(Student.register_number == reg).first()
    if stud_obj and reg_2023:
        for s_num in range(1, 5):
            sem_obj = db.query(Semester).filter(Semester.number == s_num, Semester.regulation_id == reg_2023.id).first()
            if sem_obj:
                comp = db.query(SemesterCompletion).filter(
                    SemesterCompletion.student_id == stud_obj.id,
                    SemesterCompletion.semester_id == sem_obj.id
                ).first()
                if not comp:
                    comp = SemesterCompletion(
                        student_id=stud_obj.id,
                        semester_id=sem_obj.id,
                        is_completed=True,
                        sgpa=round(random.uniform(7.8, 9.4), 2),
                        courses_required_pct=100.0,
                        topics_required_pct=100.0,
                        assignments_required_pct=100.0,
                        tests_required_pct=100.0
                    )
                    db.add(comp)
db.commit()
sync_sequences()

# 5. Seed assignments & tests attempts/results for student courses
for reg, name in students_to_add:
    stud_obj = db.query(Student).filter(Student.register_number == reg).first()
    if stud_obj and reg_2023:
        student_sem = db.query(Semester).filter(
            Semester.regulation_id == reg_2023.id,
            Semester.number == 5
        ).first()
        if student_sem:
            courses_list = db.query(Course).filter(Course.semester_id == student_sem.id).all()
            for course in courses_list:
                # Find assignments
                assigns = db.query(Assignment).filter(Assignment.course_id == course.id).all()
                for i, assign in enumerate(assigns):
                    if i == 0:
                        sub = db.query(AssignmentSubmission).filter(
                            AssignmentSubmission.assignment_id == assign.id,
                            AssignmentSubmission.student_id == stud_obj.id
                        ).first()
                        if not sub:
                            sub = AssignmentSubmission(
                                assignment_id=assign.id,
                                student_id=stud_obj.id,
                                answers='{"1": "Standard definition of terms.", "2": "Use cases in engineering."}',
                                status="Evaluated",
                                score=82,
                                submitted_at=datetime.utcnow()
                            )
                            db.add(sub)
                
                # Find tests
                tests_list = db.query(Test).filter(Test.course_id == course.id).all()
                for test in tests_list:
                    att = db.query(TestAttempt).filter(
                        TestAttempt.test_id == test.id,
                        TestAttempt.student_id == stud_obj.id
                    ).first()
                    if not att:
                        att = TestAttempt(
                            test_id=test.id,
                            student_id=stud_obj.id,
                            attempt_number=1,
                            started_at=datetime.utcnow(),
                            submitted_at=datetime.utcnow(),
                            time_taken_seconds=300
                        )
                        db.add(att)
                        db.commit()
                        db.refresh(att)
                        
                        res = TestResult(
                            attempt_id=att.id,
                            score=8.0,
                            total_questions=10,
                            correct_answers=8,
                            wrong_answers=2,
                            percentage=80.0
                        )
                        db.add(res)
db.commit()
print("Success!")
