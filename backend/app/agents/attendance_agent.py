"""
Attendance AI Agent — monitors attendance, sends alerts, and integrates with college system.
Automatically triggered by the Manager AI when attendance drops below threshold.
"""
import json
from datetime import date, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.attendance import Attendance
from app.models.student import Student
from app.models.student_course import StudentCourse
from app.rag.gemini import query_gemini
from app.services.hf_service import generate_attendance_advice, HF_API_KEY

MINIMUM_ATTENDANCE = 75.0  # college regulation threshold (%)


def calculate_attendance_percentage(student_id: int, course_id: int, db: Session) -> dict:
    """Calculate current attendance % for a student in a specific course."""
    total = db.query(Attendance).filter(
        Attendance.student_id == student_id,
        Attendance.course_id == course_id
    ).count()
    
    present = db.query(Attendance).filter(
        Attendance.student_id == student_id,
        Attendance.course_id == course_id,
        Attendance.status.in_(["Present", "Late", "OD"])
    ).count()
    
    if total == 0:
        return {"total": 0, "present": 0, "absent": 0, "percentage": 0.0}
    
    percentage = (present / total) * 100
    return {
        "total": total,
        "present": present,
        "absent": total - present,
        "percentage": round(percentage, 2)
    }


def get_student_attendance_report(student_id: int, db: Session) -> dict:
    """Full attendance report across all enrolled courses for a student."""
    enrolled = db.query(StudentCourse).filter(StudentCourse.student_id == student_id).all()
    report = []
    overall_risk = False
    
    for sc in enrolled:
        course = sc.course
        stats = calculate_attendance_percentage(student_id, sc.course_id, db)
        risk = stats["percentage"] < MINIMUM_ATTENDANCE and stats["total"] > 0
        if risk:
            overall_risk = True
        report.append({
            "course_id": sc.course_id,
            "course_name": course.course_name if course else "Unknown",
            "course_code": course.course_code if course else "?",
            **stats,
            "at_risk": risk,
            "required_classes_to_clear": _classes_needed(stats),
        })
    
    return {
        "student_id": student_id,
        "courses": report,
        "overall_at_risk": overall_risk,
        "minimum_threshold": MINIMUM_ATTENDANCE
    }


def _classes_needed(stats: dict) -> int:
    """Calculate extra classes needed to reach 75% threshold."""
    if stats["total"] == 0:
        return 0
    present = stats["present"]
    total = stats["total"]
    # x = classes needed; (present + x) / (total + x) >= 0.75
    # Solve: present + x >= 0.75 * total + 0.75x → 0.25x >= 0.75*total - present
    if stats["percentage"] >= MINIMUM_ATTENDANCE:
        return 0
    x = max(0, (0.75 * total - present) / 0.25)
    return int(x) + 1


def generate_attendance_alert(student: Student, low_courses: list) -> str:
    """Use Qwen3-8B (primary) or Gemini (fallback) for attendance alerts."""
    # Primary: Qwen3-8B
    if HF_API_KEY:
        return generate_attendance_advice(student.full_name, low_courses)
    # Fallback: Gemini
    course_list = ", ".join([f"{c['course_name']} ({c['percentage']:.1f}%)" for c in low_courses])
    prompt = f"""
    Student {student.full_name} has low attendance in: {course_list}.
    Minimum required is {MINIMUM_ATTENDANCE}%. Write a 3-4 sentence urgent alert.
    """
    try:
        return query_gemini(prompt, system_instruction="You are an academic advisor sending an attendance alert.")
    except Exception:
        course_list2 = ", ".join([c['course_name'] for c in low_courses])
        return (
            f"⚠️ ATTENDANCE ALERT: Your attendance in {course_list2} is critically low. "
            f"Minimum required is {MINIMUM_ATTENDANCE}%. "
            "Please attend all remaining classes to avoid being barred from exams."
        )


def handle(event: str, student: Student, db: Session, **context) -> dict:
    """
    Handle attendance-related events from the Manager AI.
    Events: check_attendance, mark_attendance, generate_report
    """
    if event == "check_attendance":
        report = get_student_attendance_report(student.id, db)
        low_courses = [c for c in report["courses"] if c["at_risk"]]
        
        result = {
            "agent": "attendance_agent",
            "report": report,
            "alert": None
        }
        
        if low_courses:
            # Mark alert_sent on records and generate message
            alert_msg = generate_attendance_alert(student, low_courses)
            result["alert"] = alert_msg
            result["low_attendance_courses"] = low_courses
        
        return result
    
    if event == "generate_report":
        return {
            "agent": "attendance_agent",
            "report": get_student_attendance_report(student.id, db)
        }
    
    return {"agent": "attendance_agent", "status": f"Unknown event: {event}"}


def auto_mark_attendance(
    student_id: int,
    course_id: int,
    attendance_date: date,
    status: str,
    session: str,
    db: Session
) -> Attendance:
    """Auto-create an attendance record (called from college app integration hook)."""
    record = Attendance(
        student_id=student_id,
        course_id=course_id,
        date=attendance_date,
        status=status,
        session=session,
        marked_by="college_app"
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record
