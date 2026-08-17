"""Spec section 12 — generates a personalized daily study plan."""
import json
from datetime import date
from sqlalchemy.orm import Session

from app.models.student import Student
from app.models.topic import Topic
from app.models.assignment import Assignment, AssignmentSubmission
from app.models.test import TestAttempt, TestResult
from app.models.study_plan import StudyPlan
from app.models.course import Course
from app.models.semester import Semester


def generate_study_plan(student: Student, db: Session) -> dict:
    """
    Builds a ranked daily study plan from:
    1. Weak topics (from recent test results — topics where accuracy < 70%)
    2. Pending assignments (not yet submitted)
    3. Career-interest boosted topics (if title matches career_interest keyword)
    """
    today = date.today()
    items = []

    # ── 1. Find weak topics from recent results ───────────────────────────────
    attempts = (
        db.query(TestAttempt)
        .filter(TestAttempt.student_id == student.id)
        .order_by(TestAttempt.started_at.desc())
        .limit(20)
        .all()
    )

    weak_topic_ids: set[int] = set()
    for attempt in attempts:
        if attempt.result and attempt.result.weak_topics:
            try:
                ids = json.loads(attempt.result.weak_topics)
                weak_topic_ids.update(ids)
            except Exception:
                pass

    career_kw = (student.career_interest or "").lower()

    for topic_id in list(weak_topic_ids)[:3]:
        topic = db.query(Topic).filter(Topic.id == topic_id).first()
        if topic:
            duration = 45 if career_kw and career_kw in topic.title.lower() else 30
            items.append({
                "task": f"Revise: {topic.title}",
                "type": "revision",
                "topic_id": topic_id,
                "duration_minutes": duration,
                "priority": "high",
            })

    # ── 2. Pending assignments ────────────────────────────────────────────────
    current_sem = (
        db.query(Semester)
        .filter(
            Semester.regulation_id == student.regulation_id,
            Semester.number == student.current_semester,
        )
        .first()
    )
    if current_sem:
        courses = db.query(Course).filter(Course.semester_id == current_sem.id).all()
        course_ids = [c.id for c in courses]

        submitted_ids = [
            s.assignment_id
            for s in db.query(AssignmentSubmission)
            .filter(
                AssignmentSubmission.student_id == student.id,
                AssignmentSubmission.status.in_(["Submitted", "Evaluated"]),
            )
            .all()
        ]

        pending = (
            db.query(Assignment)
            .filter(
                Assignment.course_id.in_(course_ids),
                Assignment.id.notin_(submitted_ids),
            )
            .limit(2)
            .all()
        )

        for assignment in pending:
            items.append({
                "task": f"Complete Assignment: {assignment.title}",
                "type": "assignment",
                "assignment_id": assignment.id,
                "duration_minutes": 25,
                "priority": "medium",
            })

    # ── 3. Default revision if plan is empty ──────────────────────────────────
    if not items:
        items.append({
            "task": "Review your current semester syllabus",
            "type": "general",
            "duration_minutes": 30,
            "priority": "low",
        })
        items.append({
            "task": "Take a practice test in your weakest subject",
            "type": "test",
            "duration_minutes": 45,
            "priority": "medium",
        })

    # ── Persist today's plan ───────────────────────────────────────────────────
    existing = (
        db.query(StudyPlan)
        .filter(StudyPlan.student_id == student.id, StudyPlan.plan_date == today)
        .first()
    )
    items_json = json.dumps(items)
    if existing:
        existing.items = items_json
    else:
        plan_row = StudyPlan(student_id=student.id, plan_date=today, items=items_json)
        db.add(plan_row)
    db.commit()

    return {"date": today.isoformat(), "items": items}
