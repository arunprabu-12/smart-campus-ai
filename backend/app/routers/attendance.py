"""
Attendance router — mark attendance, get reports, college app integration.
Includes a webhook endpoint for the college app to push attendance automatically.
"""
from datetime import date as DateType
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.dependencies import get_current_student
from app.models.attendance import Attendance
from app.models.student import Student
from app.models.course import Course
from app.agents.attendance_agent import (
    calculate_attendance_percentage,
    get_student_attendance_report,
    auto_mark_attendance,
    MINIMUM_ATTENDANCE
)
import os

router = APIRouter(prefix="/attendance", tags=["attendance"])

COLLEGE_APP_SECRET = os.getenv("COLLEGE_APP_SECRET", "college_secret_key")


# ── Schemas ──────────────────────────────────────────────

class AttendanceMarkSchema(BaseModel):
    course_id: int
    date: DateType
    status: str = "Present"  # Present / Absent / Late / OD
    session: str = "FN"       # FN / AN
    remarks: Optional[str] = None


class BulkAttendanceSchema(BaseModel):
    records: List[AttendanceMarkSchema]


class CollegeAppWebhook(BaseModel):
    """Payload from college app automatic sync."""
    student_register_number: str
    course_code: str
    date: DateType
    status: str   # Present / Absent / Late / OD
    session: str  # FN / AN


# ── Endpoints ────────────────────────────────────────────

@router.get("/report")
def get_my_attendance(
    db: Session = Depends(get_db),
    current: Student = Depends(get_current_student)
):
    """Get full attendance report for the logged-in student."""
    return get_student_attendance_report(current.id, db)


@router.get("/course/{course_id}")
def get_course_attendance(
    course_id: int,
    db: Session = Depends(get_db),
    current: Student = Depends(get_current_student)
):
    """Get attendance details for a specific course."""
    stats = calculate_attendance_percentage(current.id, course_id, db)
    records = db.query(Attendance).filter(
        Attendance.student_id == current.id,
        Attendance.course_id == course_id
    ).order_by(Attendance.date.desc()).all()
    
    return {
        "course_id": course_id,
        "stats": stats,
        "records": [
            {
                "id": r.id,
                "date": r.date.isoformat(),
                "status": r.status,
                "session": r.session,
                "marked_by": r.marked_by,
                "remarks": r.remarks
            }
            for r in records
        ]
    }


@router.post("/mark")
def mark_attendance(
    payload: AttendanceMarkSchema,
    db: Session = Depends(get_db),
    current: Student = Depends(get_current_student)
):
    """
    Allow a student to self-mark attendance (for self-reporting or testing).
    In production, only admin/faculty should mark attendance.
    """
    # Check for duplicate
    existing = db.query(Attendance).filter(
        Attendance.student_id == current.id,
        Attendance.course_id == payload.course_id,
        Attendance.date == payload.date,
        Attendance.session == payload.session
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Attendance already marked for this session")

    record = Attendance(
        student_id=current.id,
        course_id=payload.course_id,
        date=payload.date,
        status=payload.status,
        session=payload.session,
        marked_by="student",
        remarks=payload.remarks
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return {"id": record.id, "status": "marked", "attendance_status": record.status}


@router.post("/college-app/sync")
def college_app_sync(
    payload: CollegeAppWebhook,
    x_college_secret: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Webhook endpoint for the college app to automatically push attendance data.
    Protected by X-College-Secret header.
    Connects this platform to the college's existing attendance management system.
    """
    if x_college_secret != COLLEGE_APP_SECRET:
        raise HTTPException(status_code=403, detail="Invalid college app secret")

    # Lookup student by register number
    student = db.query(Student).filter(
        Student.register_number == payload.student_register_number
    ).first()
    if not student:
        raise HTTPException(status_code=404, detail=f"Student {payload.student_register_number} not found")

    # Lookup course by code
    course = db.query(Course).filter(Course.course_code == payload.course_code).first()
    if not course:
        raise HTTPException(status_code=404, detail=f"Course {payload.course_code} not found")

    # Check for duplicate
    existing = db.query(Attendance).filter(
        Attendance.student_id == student.id,
        Attendance.course_id == course.id,
        Attendance.date == payload.date,
        Attendance.session == payload.session
    ).first()
    if existing:
        return {"status": "already_exists", "attendance_id": existing.id}

    record = auto_mark_attendance(
        student_id=student.id,
        course_id=course.id,
        attendance_date=payload.date,
        status=payload.status,
        session=payload.session,
        db=db
    )
    
    # Trigger AI agent check if attendance is concerning
    from app.agents.attendance_agent import calculate_attendance_percentage, MINIMUM_ATTENDANCE
    stats = calculate_attendance_percentage(student.id, course.id, db)
    if stats["percentage"] < MINIMUM_ATTENDANCE and stats["total"] >= 5:
        # Trigger automatic AI alert via manager
        from app.agents import attendance_agent
        attendance_agent.handle("check_attendance", student, db)

    return {
        "status": "synced",
        "attendance_id": record.id,
        "student": student.full_name,
        "course": course.course_name,
        "attendance_status": record.status,
        "current_percentage": stats["percentage"]
    }


@router.get("/admin/course/{course_id}")
def admin_get_course_attendance(
    course_id: int,
    db: Session = Depends(get_db),
    current: Student = Depends(get_current_student)
):
    """Admin view: all student attendance for a course."""
    if not current.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    records = db.query(Attendance).filter(
        Attendance.course_id == course_id
    ).order_by(Attendance.date.desc()).all()
    
    return [
        {
            "id": r.id,
            "student_id": r.student_id,
            "date": r.date.isoformat(),
            "status": r.status,
            "session": r.session,
        }
        for r in records
    ]


@router.post("/admin/mark-bulk")
def admin_mark_bulk(
    payload: BulkAttendanceSchema,
    student_id: int,
    db: Session = Depends(get_db),
    current: Student = Depends(get_current_student)
):
    """Admin: bulk mark attendance for a student."""
    if not current.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    created = []
    for rec in payload.records:
        existing = db.query(Attendance).filter(
            Attendance.student_id == student_id,
            Attendance.course_id == rec.course_id,
            Attendance.date == rec.date,
            Attendance.session == rec.session
        ).first()
        if not existing:
            r = Attendance(
                student_id=student_id,
                course_id=rec.course_id,
                date=rec.date,
                status=rec.status,
                session=rec.session,
                marked_by=f"admin:{current.register_number}",
                remarks=rec.remarks
            )
            db.add(r)
            created.append({"date": rec.date.isoformat(), "course_id": rec.course_id})
    
    db.commit()
    return {"marked": len(created), "records": created}
