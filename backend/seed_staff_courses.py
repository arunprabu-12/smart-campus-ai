import sys
import os
import json
import hashlib
import uuid

sys.path.append(os.path.abspath(os.path.dirname(__file__)))
from app.database import SessionLocal
from app.models.course import Course
from app.models.admin_user import AdminUser
from app.models.unit import Unit
from app.models.topic import Topic
from app.models.assignment import Assignment
from app.models.test import Test, Question

db = SessionLocal()

# 1. Create Staff Members
staff_data = [
    {"name": "Kapil", "email": "kapil@college.edu", "designation": "Professor"},
    {"name": "Jayasree", "email": "jayasree@college.edu", "designation": "Professor"},
    {"name": "Madhubala", "email": "madhubala@college.edu", "designation": "Assistant Professor"},
    {"name": "Selvarani", "email": "selvarani@college.edu", "designation": "HOD"},
    {"name": "Divya", "email": "divya@college.edu", "designation": "Lab Assistant"}
]

staff_courses = {
    "Kapil": ["Deep Learning", "Machine Learning", "Natural Language Processing"],
    "Jayasree": ["Mathematics", "Generative AI"],
    "Madhubala": ["Agentic AI"],
    "Selvarani": ["Manufacturing", "Big Data"],
    "Divya": ["Cloud Computing"]
}

print("==> Seeding Staff...")
password_hash = hashlib.sha256("staff123".encode()).hexdigest()

for staff in staff_data:
    existing = db.query(AdminUser).filter(AdminUser.email == staff["email"]).first()
    if not existing:
        u = AdminUser(
            full_name=staff["name"],
            email=staff["email"],
            password_hash=password_hash,
            role="staff",
            department=", ".join(staff_courses.get(staff["name"], []))
        )
        db.add(u)
        print(f"Created staff: {staff['name']}")
    else:
        existing.department = ", ".join(staff_courses.get(staff["name"], []))

db.commit()

# 2. Ensure Courses Exist and Generate Units, Notes, Assignments, Tests
print("==> Seeding Courses, Units, Notes, Assignments, Tests...")
all_courses = set()
for courses in staff_courses.values():
    all_courses.update(courses)

for idx, c_name in enumerate(all_courses):
    course = db.query(Course).filter(Course.course_name == c_name).first()
    if not course:
        course = Course(
            course_code=f"CS_{uuid.uuid4().hex[:6].upper()}",
            course_name=c_name,
            credits=3,
            description=f"Advanced course on {c_name}",
            semester_id=1 # Just dummy semester 1
        )
        db.add(course)
        db.flush()
        print(f"Created course: {c_name}")
    
    # Check units
    existing_units = db.query(Unit).filter(Unit.course_id == course.id).count()
    if existing_units < 5:
        # Create 5 units
        for u_idx in range(existing_units + 1, 6):
            unit = Unit(
                course_id=course.id,
                title=f"Unit {u_idx}: Foundations of {c_name}",
                order_index=u_idx
            )
            db.add(unit)
            db.flush()
            
            # Create a Topic (Notes) for the unit
            topic = Topic(
                unit_id=unit.id,
                title=f"Notes on {unit.title}",
                notes=f"These are the detailed notes and study materials for {unit.title} in the {c_name} course. This covers all the fundamental aspects and practical implementations."
            )
            db.add(topic)
            
            # Create an Assignment for the unit
            assignment = Assignment(
                course_id=course.id,
                unit_id=unit.id,
                title=f"{c_name} - Assignment {u_idx}",
                questions=json.dumps([
                    {"text": f"Define the core principles of {c_name} in Unit {u_idx}.", "type": "short"},
                    {"text": f"Provide a practical example of {c_name} application.", "type": "short"}
                ])
            )
            db.add(assignment)
            
            # Create a Test for the unit
            test = Test(
                course_id=course.id,
                title=f"{c_name} - Unit {u_idx} Test",
                test_type="Unit"
            )
            db.add(test)
            db.flush()
            
            # Add Questions to the Test
            for q_idx in range(1, 4):
                question = Question(
                    test_id=test.id,
                    question_text=f"Question {q_idx} for {c_name} Unit {u_idx}?",
                    question_type="MCQ",
                    options=json.dumps(["Option A", "Option B", "Option C", "Option D"]),
                    correct_answer="Option A"
                )
                db.add(question)
                
            print(f"  -> Added Unit {u_idx}, Notes, Assignment, and Test for {c_name}")

db.commit()
print("==> Seeding Completed Successfully!")
