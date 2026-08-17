import os
import sys

from app.database import SessionLocal
from app.models.department import Department
from app.models.regulation import Regulation

def seed_db():
    db = SessionLocal()
    try:
        # Departments
        dept_names = [
            "Computer Science and Engineering",
            "Information Technology",
            "Artificial Intelligence and Data Science",
            "Electronics and Communication Engineering",
            "Electrical and Electronics Engineering",
            "Mechanical Engineering",
            "Civil Engineering"
        ]
        
        for name in dept_names:
            if not db.query(Department).filter(Department.name == name).first():
                dept = Department(name=name, code=name[:3].upper())
                db.add(dept)
        
        # Regulations
        reg_names = ["Regulation 2021", "Regulation 2017", "Regulation 2013"]
        for name in reg_names:
            if not db.query(Regulation).filter(Regulation.name == name).first():
                reg = Regulation(name=name)
                db.add(reg)
                
        db.commit()
        print("Successfully seeded 7 departments and regulations.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
