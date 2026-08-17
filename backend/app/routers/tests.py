"""Spec sections 7-9 — test taking + result generation."""
import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.auth.dependencies import get_current_student
from app.models.test import Test, Question, TestAttempt, TestResult, TestAnswerLog
from app.schemas.test import TestOut, TestResultOut, AnswerSubmission
from app.agents.manager import on_event
from app.agents.test_agent import evaluate_attempt

router = APIRouter(prefix="/tests", tags=["tests"])


@router.get("/course/{course_id}", response_model=list[TestOut])
def list_tests(course_id: int, db: Session = Depends(get_db), current=Depends(get_current_student)):
    return db.query(Test).filter(Test.course_id == course_id).all()


@router.post("/{test_id}/start")
def start_test(test_id: int, db: Session = Depends(get_db), current=Depends(get_current_student)):
    # Compute attempt_number = previous attempts + 1
    prev_attempts = db.query(TestAttempt).filter(
        TestAttempt.student_id == current.id,
        TestAttempt.test_id == test_id
    ).count()
    
    attempt = TestAttempt(
        test_id=test_id,
        student_id=current.id,
        attempt_number=prev_attempts + 1,
        started_at=datetime.utcnow()
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    return {"attempt_id": attempt.id}


@router.post("/attempt/{attempt_id}/submit", response_model=TestResultOut)
def submit_test(attempt_id: int, payload: AnswerSubmission, db: Session = Depends(get_db),
                current=Depends(get_current_student)):
    # 1. Evaluate using the test agent
    res = evaluate_attempt(attempt_id, payload.answers, db)
    if res.get("status") == "error":
        raise HTTPException(status_code=404, detail=res.get("message"))
        
    score = res.get("score", 0)
    total = res.get("total_questions", 0)
    
    # 2. Trigger automatic manager workflow event for test completion
    on_event(
        event_name="test_completed",
        student=current,
        db=db,
        weak_topics=res.get("weak_topics", [])
    )
    
    return TestResultOut(
        attempt_id=attempt_id,
        score=score,
        total_questions=total,
        correct_answers=score,
        wrong_answers=total - score,
        percentage=res.get("percentage", 0.0),
        strong_topics=res.get("strong_topics", []),
        weak_topics=res.get("weak_topics", []),
        performance_label=res.get("performance_label", "")
    )


@router.get("/report/{attempt_id}")
def get_test_report(
    attempt_id: int,
    db: Session = Depends(get_db),
    current=Depends(get_current_student)
):
    """Full test report with per-question answer breakdown — saved to DB."""
    attempt = db.query(TestAttempt).filter(
        TestAttempt.id == attempt_id,
        TestAttempt.student_id == current.id
    ).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")

    test = db.query(Test).filter(Test.id == attempt.test_id).first()
    result = db.query(TestResult).filter(TestResult.attempt_id == attempt_id).first()
    answer_logs = db.query(TestAnswerLog).filter(TestAnswerLog.attempt_id == attempt_id).all()

    # Build per-question detail
    question_details = []
    for log in answer_logs:
        q = db.query(Question).filter(Question.id == log.question_id).first()
        if q:
            question_details.append({
                "question_id": q.id,
                "question_text": q.question_text,
                "question_type": q.question_type,
                "options": q.parsed_options(),
                "correct_answer": q.correct_answer,
                "student_answer": log.student_answer,
                "is_correct": bool(log.is_correct),
            })

    import json as _json
    return {
        "attempt_id": attempt_id,
        "test_title": test.title if test else "Unknown",
        "test_type": test.test_type if test else "?",
        "started_at": attempt.started_at.isoformat() if attempt.started_at else None,
        "submitted_at": attempt.submitted_at.isoformat() if attempt.submitted_at else None,
        "result": {
            "score": result.score if result else 0,
            "total_questions": result.total_questions if result else 0,
            "correct_answers": result.correct_answers if result else 0,
            "wrong_answers": result.wrong_answers if result else 0,
            "percentage": result.percentage if result else 0.0,
            "strong_topics": _json.loads(result.strong_topics or "[]") if result else [],
            "weak_topics": _json.loads(result.weak_topics or "[]") if result else [],
        } if result else None,
        "questions": question_details,
    }


@router.get("/my-attempts")
def my_test_attempts(
    db: Session = Depends(get_db),
    current=Depends(get_current_student)
):
    """List all test attempts for the current student."""
    attempts = db.query(TestAttempt).filter(
        TestAttempt.student_id == current.id
    ).order_by(TestAttempt.started_at.desc()).all()

    result = []
    for a in attempts:
        test = db.query(Test).filter(Test.id == a.test_id).first()
        r = db.query(TestResult).filter(TestResult.attempt_id == a.id).first()
        result.append({
            "attempt_id": a.id,
            "test_id": a.test_id,
            "test_title": test.title if test else "?",
            "test_type": test.test_type if test else "?",
            "started_at": a.started_at.isoformat() if a.started_at else None,
            "submitted_at": a.submitted_at.isoformat() if a.submitted_at else None,
            "score": r.score if r else None,
            "percentage": r.percentage if r else None,
        })
    return result

