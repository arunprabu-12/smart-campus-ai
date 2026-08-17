"""Spec sections 3-4 — course/unit/topic listing."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.dependencies import get_current_student
from app.models.course import Course
from app.models.semester import Semester
from app.models.student_progress import StudentProgress
from app.schemas.course import CourseOut
from app.services.youtube_service import search_videos

router = APIRouter(prefix="/courses", tags=["courses"])


def _is_semester_accessible(student, semester_id: int, db: Session) -> bool:
    """Returns True if the student is allowed to view this semester."""
    semester = db.query(Semester).filter(Semester.id == semester_id).first()
    if not semester:
        return False
    # Can access current semester and all prior ones; future semesters are locked
    return semester.number <= student.current_semester


@router.get("/semester/{semester_id}", response_model=list[CourseOut])
def list_courses_for_semester(
    semester_id: int,
    db: Session = Depends(get_db),
    current=Depends(get_current_student),
):
    """Enforce semester lock — 403 if trying to access a future semester."""
    if not _is_semester_accessible(current, semester_id, db):
        raise HTTPException(
            status_code=403,
            detail="This semester is locked. Complete your current semester first.",
        )
    return db.query(Course).filter(Course.semester_id == semester_id).all()


@router.get("/{course_id}", response_model=CourseOut)
def get_course(
    course_id: int,
    db: Session = Depends(get_db),
    current=Depends(get_current_student),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    # Enforce semester lock
    if not _is_semester_accessible(current, course.semester_id, db):
        raise HTTPException(status_code=403, detail="This course's semester is locked.")

    return course


@router.get("/{course_id}/progress")
def get_course_progress(
    course_id: int,
    db: Session = Depends(get_db),
    current=Depends(get_current_student),
):
    """Compute progress % for this student in the given course."""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    topic_ids = [t.id for unit in course.units for t in unit.topics]
    if not topic_ids:
        return {"course_id": course_id, "progress_pct": 0, "completed": 0, "total": 0}

    completed = (
        db.query(StudentProgress)
        .filter(
            StudentProgress.student_id == current.id,
            StudentProgress.topic_id.in_(topic_ids),
            StudentProgress.completed == True,
        )
        .count()
    )
    pct = round(completed / len(topic_ids) * 100, 1)
    return {"course_id": course_id, "progress_pct": pct, "completed": completed, "total": len(topic_ids)}


@router.get("/{course_id}/videos")
def get_course_videos(
    course_id: int,
    topic: str = "",
    db: Session = Depends(get_db),
    current=Depends(get_current_student),
):
    """Search YouTube for relevant videos for this course (and optionally topic)."""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    query = f"{course.course_name} {topic}".strip()
    return {"query": query, "videos": search_videos(query)}
