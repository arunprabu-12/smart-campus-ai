"""
Spec sections 13-14: progress rollups + semester unlock logic.
This is the most important business logic file in the app.
"""
import json
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.student import Student
from app.models.semester import Semester
from app.models.semester_completion import SemesterCompletion
from app.models.course import Course
from app.models.unit import Unit
from app.models.topic import Topic
from app.models.student_progress import StudentProgress
from app.models.assignment import Assignment, AssignmentSubmission
from app.models.test import Test, TestAttempt, TestResult


def _get_semester_for_student(student: Student, db: Session) -> Semester | None:
    """Return the Semester row matching the student's regulation and current_semester number."""
    return (
        db.query(Semester)
        .filter(
            Semester.regulation_id == student.regulation_id,
            Semester.number == student.current_semester,
        )
        .first()
    )


def compute_semester_progress(student_id: int, semester_id: int, db: Session) -> dict:
    """
    Compute % courses/topics/assignments/tests completed for this student+semester.
    Returns a dict with individual and overall percentages.
    """
    # ── Courses completed ──────────────────────────────────────────────────────
    courses = db.query(Course).filter(Course.semester_id == semester_id).all()
    total_courses = len(courses)
    course_ids = [c.id for c in courses]

    # A course is "complete" when all its topics are completed
    completed_courses = 0
    for course in courses:
        unit_ids = [u.id for u in course.units]
        topic_ids = []
        for unit in course.units:
            topic_ids.extend([t.id for t in unit.topics])
        if not topic_ids:
            continue
        done = (
            db.query(StudentProgress)
            .filter(
                StudentProgress.student_id == student_id,
                StudentProgress.topic_id.in_(topic_ids),
                StudentProgress.completed == True,
            )
            .count()
        )
        if done == len(topic_ids):
            completed_courses += 1

    courses_pct = (completed_courses / total_courses * 100) if total_courses else 0

    # ── Topics completed ───────────────────────────────────────────────────────
    all_topic_ids: list[int] = []
    for course in courses:
        for unit in course.units:
            all_topic_ids.extend([t.id for t in unit.topics])

    total_topics = len(all_topic_ids)
    completed_topics = (
        db.query(StudentProgress)
        .filter(
            StudentProgress.student_id == student_id,
            StudentProgress.topic_id.in_(all_topic_ids),
            StudentProgress.completed == True,
        )
        .count()
    ) if all_topic_ids else 0

    topics_pct = (completed_topics / total_topics * 100) if total_topics else 0

    # ── Assignments completed ─────────────────────────────────────────────────
    total_assignments = (
        db.query(Assignment).filter(Assignment.course_id.in_(course_ids)).count()
        if course_ids else 0
    )
    completed_assignments = (
        db.query(AssignmentSubmission)
        .join(Assignment, AssignmentSubmission.assignment_id == Assignment.id)
        .filter(
            Assignment.course_id.in_(course_ids),
            AssignmentSubmission.student_id == student_id,
            AssignmentSubmission.status.in_(["Submitted", "Evaluated"]),
        )
        .count()
        if course_ids else 0
    )
    assignments_pct = (completed_assignments / total_assignments * 100) if total_assignments else 0

    # ── Tests completed (at least one attempt) ────────────────────────────────
    total_tests = (
        db.query(Test).filter(Test.course_id.in_(course_ids)).count()
        if course_ids else 0
    )
    attempted_test_ids = (
        db.query(TestAttempt.test_id)
        .filter(
            TestAttempt.student_id == student_id,
            TestAttempt.test_id.in_(
                db.query(Test.id).filter(Test.course_id.in_(course_ids)).subquery()
            ),
        )
        .distinct()
        .count()
        if course_ids else 0
    )
    tests_pct = (attempted_test_ids / total_tests * 100) if total_tests else 0

    # ── Overall ───────────────────────────────────────────────────────────────
    overall_pct = (courses_pct * 0.3 + topics_pct * 0.3 + assignments_pct * 0.2 + tests_pct * 0.2)

    return {
        "courses_completed": completed_courses,
        "total_courses": total_courses,
        "courses_completed_pct": round(courses_pct, 1),
        "topics_completed": completed_topics,
        "total_topics": total_topics,
        "topics_completed_pct": round(topics_pct, 1),
        "assignments_completed": completed_assignments,
        "total_assignments": total_assignments,
        "assignments_completed_pct": round(assignments_pct, 1),
        "tests_attempted": attempted_test_ids,
        "total_tests": total_tests,
        "tests_completed_pct": round(tests_pct, 1),
        "overall_pct": round(overall_pct, 1),
    }


def get_all_semester_statuses(student: Student, db: Session) -> list[dict]:
    """
    Return status for all semesters 1-8 (for this student's regulation):
    'completed', 'in_progress', or 'locked'.
    """
    semesters = (
        db.query(Semester)
        .filter(Semester.regulation_id == student.regulation_id)
        .order_by(Semester.number)
        .all()
    )

    statuses = []
    for sem in semesters:
        completion = (
            db.query(SemesterCompletion)
            .filter(
                SemesterCompletion.student_id == student.id,
                SemesterCompletion.semester_id == sem.id,
            )
            .first()
        )
        sgpa = completion.sgpa if completion else None
        if completion and completion.is_completed:
            status = "completed"
        elif sem.number == student.current_semester:
            status = "in_progress"
        elif sem.number < student.current_semester:
            status = "completed"  # already passed through
        else:
            status = "locked"
        statuses.append({"number": sem.number, "semester_id": sem.id, "status": status, "sgpa": sgpa})
    return statuses


def check_and_unlock_next_semester(student: Student, db: Session) -> bool:
    """
    Compare compute_semester_progress() against SemesterCompletion thresholds.
    If all thresholds are satisfied:
      - Mark SemesterCompletion.is_completed = True
      - Increment student.current_semester
    Returns True if a new semester was unlocked.
    """
    current_semester = _get_semester_for_student(student, db)
    if not current_semester:
        return False

    # Get or create a SemesterCompletion record with default thresholds
    completion = (
        db.query(SemesterCompletion)
        .filter(
            SemesterCompletion.student_id == student.id,
            SemesterCompletion.semester_id == current_semester.id,
        )
        .first()
    )
    if not completion:
        completion = SemesterCompletion(
            student_id=student.id,
            semester_id=current_semester.id,
        )
        db.add(completion)
        db.commit()
        db.refresh(completion)

    if completion.is_completed:
        return False  # already done

    progress = compute_semester_progress(student.id, current_semester.id, db)

    meets_courses = progress["courses_completed_pct"] >= completion.courses_required_pct
    meets_topics = progress["topics_completed_pct"] >= completion.topics_required_pct
    meets_assignments = progress["assignments_completed_pct"] >= completion.assignments_required_pct
    meets_tests = progress["tests_completed_pct"] >= completion.tests_required_pct

    if meets_courses and meets_topics and meets_assignments and meets_tests:
        completion.is_completed = True
        completion.completed_at = datetime.utcnow()
        student.current_semester = student.current_semester + 1
        db.commit()
        return True

    return False
