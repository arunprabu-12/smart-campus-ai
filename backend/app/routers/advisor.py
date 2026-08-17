"""
Spec sections 10-11 — AI Academic Advisor, now backed by the Manager AI
orchestrator (multi-agent architecture) instead of a single RAG chatbot.
Logs queries and responses to ChatHistory and AgentLog models.
"""
import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.dependencies import get_current_student
from app.schemas.advisor import AdvisorQuery, AdvisorResponse
from app.agents.manager import handle_query, classify_intent
from app.models.chat_history import ChatHistory
from app.models.agent_log import AgentLog

router = APIRouter(prefix="/advisor", tags=["advisor"])


@router.post("/ask", response_model=AdvisorResponse)
def ask_advisor(payload: AdvisorQuery, db: Session = Depends(get_db), current=Depends(get_current_student)):
    result = handle_query(query=payload.query, student=current, db=db)
    
    agent_name = result.get("agent", "unknown")
    answer = result.get("answer", "")
    sources = result.get("sources", [])
    
    # Log to ChatHistory
    chat = ChatHistory(
        student_id=current.id,
        query=payload.query,
        response=answer,
        sources=json.dumps(sources),
    )
    db.add(chat)
    
    # Log to AgentLog
    intent = classify_intent(payload.query)
    log_entry = AgentLog(
        student_id=current.id,
        query=payload.query,
        intent=intent,
        agent_name=agent_name,
        answer=answer
    )
    db.add(log_entry)
    
    db.commit()
    return {"answer": answer, "sources": sources}


@router.get("/generate-quiz/{course_id}")
def generate_quiz(course_id: int, db: Session = Depends(get_db), current=Depends(get_current_student)):
    """
    Dynamic Quiz Generator Agent: Autonomously creates a quiz for the student.
    """
    import random
    
    # Mocking HuggingFace Quiz Generation
    topics = ["Data Structures", "Algorithms", "Database Systems", "Machine Learning", "Operating Systems"]
    topic = random.choice(topics)
    
    quiz = {
        "title": f"Generated Quiz: {topic}",
        "questions": [
            {
                "question": f"What is the primary purpose of {topic}?",
                "options": ["To confuse students", "To solve problems efficiently", "To write more code", "None of the above"],
                "answer": "To solve problems efficiently"
            },
            {
                "question": f"Which of the following is a key concept in {topic}?",
                "options": ["Photosynthesis", "Gravity", "Iteration and Recursion", "Quantum Entanglement"],
                "answer": "Iteration and Recursion"
            }
        ]
    }
    return quiz
