import random
from sqlalchemy import create_engine, text

engine = create_engine('postgresql://postgres:postgres@localhost:5432/academic_platform', isolation_level="AUTOCOMMIT")

with engine.connect() as conn:
    students = conn.execute(text("SELECT id FROM students")).fetchall()
    count = 0
    for student in students:
        student_id = student[0]
        # Generate random CGPA between 6.5 and 9.8, rounded to 2 decimal places
        random_cgpa = round(random.uniform(6.5, 9.8), 2)
        conn.execute(text("UPDATE students SET cgpa = :cgpa WHERE id = :sid"), {"cgpa": random_cgpa, "sid": student_id})
        count += 1

    print(f"Updated {count} students with random CGPAs.")
