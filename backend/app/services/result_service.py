"""Spec section 9 — result analysis, chart-ready aggregates."""
import json
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.test import Test, TestAttempt, TestResult, Question
from app.models.topic import Topic
from app.models.course import Course
from app.models.semester import Semester


def _label_performance(pct: float) -> str:
    if pct >= 90:
        return "Excellent"
    elif pct >= 75:
        return "Good"
    elif pct >= 60:
        return "Average"
    elif pct >= 40:
        return "Below Average"
    return "Needs Improvement"


def get_topic_wise_performance(student_id: int, db: Session) -> list[dict]:
    """
    Group TestResult / Question data by topic to compute per-topic accuracy.
    Returns a list suitable for recharts BarChart.
    """
    # Get all attempts for this student that have results
    attempts = (
        db.query(TestAttempt)
        .filter(TestAttempt.student_id == student_id)
        .all()
    )

    topic_stats: dict[int, dict] = {}

    for attempt in attempts:
        if not attempt.result:
            continue
        try:
            weak = json.loads(attempt.result.weak_topics or "[]")
            strong = json.loads(attempt.result.strong_topics or "[]")
        except Exception:
            weak, strong = [], []

        for topic_title in weak:
            if topic_title not in topic_stats:
                topic_stats[topic_title] = {"correct": 0, "total": 0}
            topic_stats[topic_title]["total"] += 1

        for topic_title in strong:
            if topic_title not in topic_stats:
                topic_stats[topic_title] = {"correct": 0, "total": 0}
            topic_stats[topic_title]["correct"] += 1
            topic_stats[topic_title]["total"] += 1

    results = []
    # Now topic_title is the actual title, no need to query Topic table
    for topic_title, stats in topic_stats.items():
        accuracy = round(stats["correct"] / stats["total"] * 100, 1) if stats["total"] else 0
        results.append({
            "topic_id": topic_title, # just use title as ID for charting
            "topic_name": topic_title,
            "accuracy_pct": accuracy,
            "attempts": stats["total"],
            "label": _label_performance(accuracy),
        })

    results.sort(key=lambda x: x["accuracy_pct"])
    return results


def get_test_wise_performance(student_id: int, db: Session) -> list[dict]:
    """Return one row per test attempt, for a line/bar chart over time."""
    attempts = (
        db.query(TestAttempt)
        .filter(TestAttempt.student_id == student_id)
        .order_by(TestAttempt.started_at)
        .all()
    )
    rows = []
    for attempt in attempts:
        if not attempt.result:
            continue
        test = db.query(Test).filter(Test.id == attempt.test_id).first()
        rows.append({
            "attempt_id": attempt.id,
            "test_title": test.title if test else f"Test {attempt.test_id}",
            "test_type": test.test_type if test else "",
            "score": attempt.result.score,
            "percentage": attempt.result.percentage,
            "label": _label_performance(attempt.result.percentage),
            "attempted_at": attempt.started_at.isoformat() if attempt.started_at else None,
        })
    return rows


def get_semester_performance(student_id: int, semester_id: int, db: Session) -> dict:
    """Aggregate across all courses in the semester."""
    courses = db.query(Course).filter(Course.semester_id == semester_id).all()
    course_ids = [c.id for c in courses]
    if not course_ids:
        return {}

    test_ids = [t.id for c in courses for t in c.tests]
    if not test_ids:
        return {"semester_id": semester_id, "avg_percentage": 0, "total_attempts": 0}

    attempts = (
        db.query(TestAttempt)
        .filter(
            TestAttempt.student_id == student_id,
            TestAttempt.test_id.in_(test_ids),
        )
        .all()
    )
    percentages = [a.result.percentage for a in attempts if a.result]
    avg = round(sum(percentages) / len(percentages), 1) if percentages else 0

    return {
        "semester_id": semester_id,
        "avg_percentage": avg,
        "total_attempts": len(attempts),
        "label": _label_performance(avg),
    }


def get_full_result_summary(student_id: int, db: Session) -> dict:
    """Master aggregate for the Results page."""
    topic_wise = get_topic_wise_performance(student_id, db)
    test_wise = get_test_wise_performance(student_id, db)

    strong_topics = [t for t in topic_wise if t["accuracy_pct"] >= 70]
    weak_topics = [t for t in topic_wise if t["accuracy_pct"] < 70]

    latest = test_wise[-1] if test_wise else {}

    return {
        "topic_wise": topic_wise,
        "test_wise": test_wise,
        "strong_topics": strong_topics,
        "weak_topics": weak_topics,
        "latest_test": latest,
        "overall_label": _label_performance(latest.get("percentage", 0)) if latest else "N/A",
    }
