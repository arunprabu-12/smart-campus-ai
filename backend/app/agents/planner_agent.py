"""
Planner AI — creates the student's personalized academic plan from:
profile + course progress + topic progress + assignment results +
test results + weak topics + upcoming CAT + career goal.
"""
from sqlalchemy.orm import Session
from app.models.student import Student
from app.services.study_plan_service import generate_study_plan
from app.rag.gemini import query_gemini


def build_today_plan(student: Student, db: Session) -> dict:
    """
    Pulls weak topics and pending assignments, generates the plan,
    and asks Gemini to write a personalized tip/quote for the student.
    """
    res = generate_study_plan(student, db)
    
    # Generate personal advisory message from Gemini
    tasks_summary = "\n".join([f"- {item['task']} ({item['duration_minutes']} min, {item['priority']} priority)" for item in res["items"]])
    
    prompt = f"""
    Here is today's study plan for student {student.full_name} (Career Goal: {student.career_interest or "Not specified"}):
    {tasks_summary}
    
    Provide a 2-3 sentence encouraging guide or tip on how they should execute this plan today.
    """
    
    motivation = query_gemini(
        prompt=prompt,
        system_instruction="You are the Planner AI Agent. You motivate and guide students to execute their study plans effectively."
    )
    
    return {
        "date": res["date"],
        "items": res["items"],
        "guidance": motivation
    }


def build_revision_plan(student: Student, weak_topics: list[str], db: Session) -> dict:
    """Called by Manager AI's automatic workflow after a weak topic is identified from a test result."""
    steps = []
    for topic_name in weak_topics:
        steps.extend([
            f"Review theoretical materials for: {topic_name}",
            f"Watch standard tutorial videos on: {topic_name}",
            f"Run mock questions in: {topic_name} to verify understanding"
        ])
    return {
        "status": "revision_plan_created",
        "weak_topics": weak_topics,
        "steps": steps
    }


def handle(query: str, student: Student, db: Session) -> dict:
    """Entry point the Manager AI calls when it routes a 'planning' intent here."""
    plan = build_today_plan(student, db)
    return {
        "agent": "planner_agent",
        "answer": f"Here is your study plan:\n\n{plan.get('guidance', '')}",
        "date": plan["date"],
        "items": plan["items"],
    }
