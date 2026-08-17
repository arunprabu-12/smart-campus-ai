"""
Manager AI — the orchestrator (spec: "Multi-Agent AI Academic Platform with
Agentic RAG"). Decides which specialized agent handles each query, and also
drives the automatic event-driven workflow (test completed -> weak topic ->
revision plan -> retest -> unlock next unit) without the student manually
asking for each step.
"""
from sqlalchemy.orm import Session

from app.agents import student_course_agent, learning_agent, test_agent, planner_agent, attendance_agent
from app.agents.rag_tool import retrieve, validate, FALLBACK_MESSAGE
from app.models.student import Student
from app.rag.gemini import query_gemini

INTENT_ROUTES = {
    "course": student_course_agent,
    "learning": learning_agent,
    "test": test_agent,
    "planning": planner_agent,
    "attendance": attendance_agent,
}


def classify_intent(query: str) -> str:
    """
    Classify query into syllabus / regulation / exam / progress / study-plan, etc.
    Uses Gemini few-shot classification with a local keyword fallback.
    """
    prompt = f"""
    Categorize the following student query into one of these exact string categories:
    - "course" (asking about active subjects, credits, prerequisites, syllabus overview)
    - "learning" (asking to explain a concept, teach something, provide summaries)
    - "test" (asking to take a quiz, mock exam, assessment, score checking)
    - "planning" (asking about daily schedule, study plans, calendars)
    - "attendance" (asking about attendance percentage, classes missed, attendance alert)
    - "academic_question" (regulations, campus policies, grades, general advisor questions)
    
    Query: "{query}"
    
    Output only the matching category name as a single clean word.
    """
    
    category = query_gemini(
        prompt=prompt,
        system_instruction="You are a query classifier. You output exactly one word matching a predefined category."
    ).strip().lower()
    
    # Strip non-alphanumeric chars or extra text
    for char in ['"', "'", '.', ',', ' ']:
        category = category.replace(char, '')
        
    if category in ["course", "learning", "test", "planning", "attendance", "academic_question"]:
        return category

    # Keyword fallback
    q = query.lower()
    if any(w in q for w in ["subject", "semester", "course", "credit", "prerequisite"]):
        return "course"
    if any(w in q for w in ["teach", "explain", "what is", "learn", "summarize", "how to"]):
        return "learning"
    if any(w in q for w in ["test", "quiz", "exam", "assessment", "score", "grade"]):
        return "test"
    if any(w in q for w in ["plan", "today", "schedule", "study plan", "calendar"]):
        return "planning"
    if any(w in q for w in ["attendance", "absent", "present", "missed class", "bunk"]):
        return "attendance"
        
    return "academic_question"


def handle_query(query: str, student: Student, db: Session) -> dict:
    """
    Entry point called from routers/advisor.py.
    Decides the intent, delegates to the appropriate specialized agent,
    and returns a structured dict response.
    """
    intent = classify_intent(query)

    if intent == "academic_question":
        # Fetch all ChatPDF source_ids stored in the documents table
        from app.models.document import Document
        from app.services.chatpdf_service import ask as chatpdf_ask
        source_ids = [
            d.chatpdf_source_id
            for d in db.query(Document).filter(Document.chatpdf_source_id.isnot(None)).all()
        ]
        result = chatpdf_ask(query, source_ids)
        return {
            "agent": "chatpdf_document_advisor",
            "answer": result["answer"],
            "sources": result["sources"],
        }


    if intent == "attendance":
        return attendance_agent.handle("check_attendance", student, db)

    agent_module = INTENT_ROUTES.get(intent)
    if not agent_module:
        return {"agent": "manager", "answer": "I could not route your query. Please try rephrasing.", "sources": []}
    result = agent_module.handle(query, student, db)
    return result


# ---- Automatic / event-driven workflow (spec section 6) ----

def on_event(event_name: str, student: Student, db: Session, **context) -> dict:
    """
    Called from other routers when something happens in the system
    that should trigger automatic agent-to-agent coordination.
    """
    if event_name == "unit_completed":
        # Automatically generate a test on completion of a unit
        return test_agent.auto_generate_on_unit_completion(
            student_id=student.id, unit_id=context.get("unit_id"), db=db
        )

    if event_name == "test_completed":
        # Automatically build a personalized revision plan if there are weak topics
        weak_topics = context.get("weak_topics", [])
        if weak_topics:
            return planner_agent.build_revision_plan(student, weak_topics, db)
        return {"status": "no weak topics — no revision plan needed"}

    if event_name == "revision_completed":
        # Automatically generate a revision test
        return test_agent.generate_test(
            course_id=context.get("course_id"),
            unit_id=context.get("unit_id"),
            test_type="Revision",
            db=db
        )

    if event_name == "retest_passed":
        # Retest passed -> check and unlock the next semester/course
        from app.services.progress_service import check_and_unlock_next_semester
        check_and_unlock_next_semester(student.id, db)
        return {"status": "retest_passed_processed_and_semester_checked"}

    if event_name == "attendance_low":
        # Trigger attendance check and alert
        return attendance_agent.handle("check_attendance", student, db)

    return {"status": f"No handler registered for event '{event_name}'"}
