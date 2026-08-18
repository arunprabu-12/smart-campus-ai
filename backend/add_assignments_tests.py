import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "app")))
from database import SessionLocal
from models.course import Course
from models.assignment import Assignment
import json

db = SessionLocal()

courses = db.query(Course).all()

# Find courses related to ML, DL, NLP
# If not exist, I will create them
target_names = ["Machine Learning", "Deep Learning", "Natural Language Processing"]
target_courses = []

for c in courses:
    name = c.course_name.lower()
    if "machine learning" in name or "deep learning" in name or "natural language processing" in name or "ml" in name or "dl" in name or "nlp" in name:
        target_courses.append(c)

print(f"Found courses: {[c.course_name for c in target_courses]}")

# Add 5 assignments each
for c in target_courses:
    # check existing assignments
    existing = db.query(Assignment).filter(Assignment.course_id == c.id).count()
    if existing < 5:
        for i in range(existing + 1, 6):
            a = Assignment(
                course_id=c.id,
                title=f"{c.course_name} Assignment {i}",
                questions=json.dumps([f"Explain concept {i}.1 in {c.course_name}.", f"Solve problem {i}.2 related to {c.course_name}."]),
                max_score=100,
                due_date=None
            )
            db.add(a)
            
db.commit()
print("Added assignments successfully.")
