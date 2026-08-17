"""Spec section 8 — Pre-CAT preparation dashboard."""
import json
from sqlalchemy.orm import Session

from app.models.student import Student
from app.models.topic import Topic
from app.models.test import TestAttempt, TestResult, Test
from app.models.student_progress import StudentProgress
from app.models.course import Course
from app.models.unit import Unit


def get_precat_dashboard(student: Student, course_id: int, db: Session) -> dict:
    """
    Aggregate TestResult rows per topic to classify strong/weak,
    compute syllabus coverage, and build a revision plan.
    """
    # ── Fetch course structure ────────────────────────────────────────────────
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        return {}

    all_topics: list[Topic] = []
    for unit in course.units:
        all_topics.extend(unit.topics)

    total_topics = len(all_topics)
    all_topic_ids = [t.id for t in all_topics]

    # ── Syllabus coverage ─────────────────────────────────────────────────────
    completed_count = (
        db.query(StudentProgress)
        .filter(
            StudentProgress.student_id == student.id,
            StudentProgress.topic_id.in_(all_topic_ids),
            StudentProgress.completed == True,
        )
        .count()
    ) if all_topic_ids else 0

    syllabus_coverage_pct = round(completed_count / total_topics * 100, 1) if total_topics else 0

    # ── Classify topics using test results ───────────────────────────────────
    strong_topics: list[str] = []
    weak_topics: list[str] = []
    topic_accuracy: dict[int, float] = {}

    course_test_ids = [t.id for t in course.tests]
    if course_test_ids:
        attempts = (
            db.query(TestAttempt)
            .filter(
                TestAttempt.student_id == student.id,
                TestAttempt.test_id.in_(course_test_ids),
            )
            .all()
        )
        for attempt in attempts:
            if not attempt.result:
                continue
            try:
                weak_ids = json.loads(attempt.result.weak_topics or "[]")
                strong_ids = json.loads(attempt.result.strong_topics or "[]")
            except Exception:
                weak_ids, strong_ids = [], []

            for tid in weak_ids:
                topic_accuracy.setdefault(tid, {"correct": 0, "total": 0})
                topic_accuracy[tid]["total"] += 1
            for tid in strong_ids:
                topic_accuracy.setdefault(tid, {"correct": 0, "total": 0})
                topic_accuracy[tid]["correct"] += 1
                topic_accuracy[tid]["total"] += 1

    for tid, stats in topic_accuracy.items():
        topic = db.query(Topic).filter(Topic.id == tid).first()
        if not topic:
            continue
        acc = stats["correct"] / stats["total"] * 100 if stats["total"] else 0
        if acc >= 70:
            strong_topics.append(topic.title)
        else:
            weak_topics.append(topic.title)

    # ── Revision progress (weak topics where student has revisited) ──────────
    revisited = 0
    for t in all_topics:
        if t.title in strong_topics:
            revisited += 1
    revision_pct = round(revisited / total_topics * 100, 1) if total_topics else 0

    # ── Recommended revision steps ───────────────────────────────────────────
    recommended = []
    for wt in weak_topics[:5]:
        recommended.append(f"Revise: {wt}")
        recommended.append(f"Watch recommended video for: {wt}")
        recommended.append(f"Complete practice questions on: {wt}")

    return {
        "course_id": course_id,
        "course_name": course.course_name,
        "syllabus_coverage_pct": syllabus_coverage_pct,
        "revision_progress_pct": revision_pct,
        "strong_topics": strong_topics,
        "weak_topics": weak_topics,
        "recommended_revision": recommended[:9],  # top 9 steps
    }
