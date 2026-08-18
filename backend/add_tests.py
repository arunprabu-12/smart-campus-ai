import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "app")))
from database import SessionLocal
from models.course import Course
from models.test import Test
import json
from datetime import datetime, timedelta

db = SessionLocal()
courses = db.query(Course).all()

target_courses = []
for c in courses:
    name = c.course_name.lower()
    if "machine learning" in name or "deep learning" in name or "natural language processing" in name or "ml" in name or "dl" in name or "nlp" in name:
        target_courses.append(c)

# Add 5 tests each
for c in target_courses:
    existing = db.query(Test).filter(Test.course_id == c.id).count()
    if existing < 5:
        for i in range(existing + 1, 6):
            t = Test(
                course_id=c.id,
                title=f"{c.course_name} Test {i}",
                questions=json.dumps([
                    {"text": f"What is concept {i}.1?", "options": ["A", "B", "C", "D"], "answer": "A"},
                    {"text": f"Explain mechanism {i}.2?", "options": ["X", "Y", "Z", "W"], "answer": "Y"}
                ]),
                max_score=100,
                duration_minutes=60,
                start_time=datetime.utcnow() - timedelta(days=1),
                end_time=datetime.utcnow() + timedelta(days=7)
            )
            db.add(t)

db.commit()
print("Added tests successfully.")
