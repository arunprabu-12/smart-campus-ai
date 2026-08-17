"""
Student Course AI — manages what the student needs to study.
Works with: semester, department, regulation, courses, syllabus, completed
topics, course progress, prerequisites.
"""
from sqlalchemy.orm import Session

from app.models.course import Course
from app.models.student import Student
from app.rag.gemini import query_gemini


def get_current_semester_courses(student: Student, db: Session) -> list[dict]:
    """Retrieves all courses for the student's current semester."""
    courses = db.query(Course).filter(Course.semester_id == student.current_semester).all()
    return [{
        "id": c.id,
        "course_code": c.course_code,
        "course_name": c.course_name,
        "credits": c.credits,
        "description": c.description or "",
        "prerequisites": c.prerequisites or "None",
    } for c in courses]


def handle(query: str, student: Student, db: Session) -> dict:
    """Entry point the Manager AI calls when it routes a 'course' intent here."""
    courses = get_current_semester_courses(student, db)
    
    # Generate system context
    courses_summary = "\n".join([
        f"- {c['course_code']}: {c['course_name']} ({c['credits']} Credits) - Prerequisites: {c['prerequisites']}"
        for c in courses
    ])
    
    prompt = f"""
    The student is asking: "{query}"
    
    Here are the courses active in their current semester (Semester {student.current_semester}):
    {courses_summary}
    
    Provide a professional, clear response answering the student's question. Limit response to 3-4 bullet points if listing courses.
    """
    
    answer = query_gemini(
        prompt=prompt,
        system_instruction="You are the Student Course AI Agent. You help students understand their courses, credits, prerequisites, and syllabus."
    )
    
    return {
        "agent": "student_course_agent",
        "answer": answer,
        "data": courses,
    }
