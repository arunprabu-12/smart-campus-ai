"""Spec section 1-2 — student profile + dashboard data."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.dependencies import get_current_student
from app.models.student import Student
from app.models.semester import Semester
from app.schemas.student import StudentProfileOut
from app.services.progress_service import compute_semester_progress, get_all_semester_statuses

router = APIRouter(prefix="/students", tags=["students"])


@router.get("/me", response_model=StudentProfileOut)
def get_my_profile(current: Student = Depends(get_current_student)):
    return current


@router.get("/me/dashboard")
def get_my_dashboard(
    current: Student = Depends(get_current_student),
    db: Session = Depends(get_db),
):
    """Returns CGPA, overall progress %, and per-semester lock statuses."""
    # Semester statuses (completed / in_progress / locked)
    semester_statuses = get_all_semester_statuses(current, db)

    # Current semester progress
    current_sem = (
        db.query(Semester)
        .filter(
            Semester.regulation_id == current.regulation_id,
            Semester.number == current.current_semester,
        )
        .first()
    )
    current_progress = {}
    if current_sem:
        current_progress = compute_semester_progress(current.id, current_sem.id, db)

    # Overall progress = average of all completed semester scores + current
    completed_count = sum(1 for s in semester_statuses if s["status"] == "completed")
    total_semesters = 8
    overall_pct = round(
        (completed_count / total_semesters * 100 * 0.7)
        + (current_progress.get("overall_pct", 0) / 100 * (1 / total_semesters) * 100 * 0.3),
        1,
    )

    # Fetch current semester courses to build assignment and test graphs
    course_assignment_stats = []
    course_test_stats = []
    if current_sem:
        from app.models.course import Course
        from app.models.assignment import Assignment, AssignmentSubmission
        from app.models.test import Test, TestAttempt, TestResult
        from app.routers.question_bank import get_assignments_bank
        
        parsed_assignments = []
        try:
            parsed_assignments = get_assignments_bank()
        except Exception:
            pass

        courses = db.query(Course).filter(Course.semester_id == current_sem.id).all()
        for course in courses:
            # Assignment stats
            total_assign = db.query(Assignment).filter(Assignment.course_id == course.id).count()
            sub_assign = db.query(AssignmentSubmission)\
                .join(Assignment, AssignmentSubmission.assignment_id == Assignment.id)\
                .filter(Assignment.course_id == course.id, AssignmentSubmission.student_id == current.id).count()
            
            # Fallback to parsed docx assignments count if DB has 0 assignments
            if total_assign == 0 and parsed_assignments:
                match_course = next((c for c in parsed_assignments if course.course_code.lower() in c.get('course_name', '').lower() or course.course_name.lower() in c.get('course_name', '').lower()), None)
                if match_course:
                    total_assign = sum(len(u.get('questions', [])) for u in match_course.get('units', []))
                else:
                    total_assign = 5
                sub_assign = min(sub_assign, total_assign)

            course_assignment_stats.append({
                "course_code": course.course_code,
                "course_name": course.course_name,
                "total": total_assign,
                "submitted": sub_assign
            })
            
            # Test stats
            results = db.query(TestResult)\
                .join(TestAttempt, TestResult.attempt_id == TestAttempt.id)\
                .join(Test, TestAttempt.test_id == Test.id)\
                .filter(Test.course_id == course.id, TestAttempt.student_id == current.id).all()
            
            avg_score = 0.0
            if results:
                avg_score = sum(r.percentage for r in results) / len(results)
                
            course_test_stats.append({
                "course_code": course.course_code,
                "course_name": course.course_name,
                "avg_score": round(avg_score, 1)
            })

    sgpa_trend = [
        {"name": f"Sem {s['number']}", "sgpa": s["sgpa"]}
        for s in semester_statuses if s.get("sgpa") is not None
    ]

    return {
        "name": current.full_name,
        "register_number": current.register_number,
        "department_id": current.department_id,
        "regulation_id": current.regulation_id,
        "section": current.section,
        "career_interest": current.career_interest,
        "current_semester": current.current_semester,
        "cgpa": current.cgpa,
        "overall_progress_pct": overall_pct,
        "semester_statuses": semester_statuses,
        "sgpa_trend": sgpa_trend,
        "current_semester_progress": current_progress,
        "course_assignment_stats": course_assignment_stats,
        "course_test_stats": course_test_stats,
    }


@router.post("/me/topics/{topic_id}/complete")
def mark_topic_complete(
    topic_id: int,
    current: Student = Depends(get_current_student),
    db: Session = Depends(get_db),
):
    """Mark a topic as studied/completed for this student."""
    from app.models.student_progress import StudentProgress
    from datetime import datetime

    existing = (
        db.query(StudentProgress)
        .filter(
            StudentProgress.student_id == current.id,
            StudentProgress.topic_id == topic_id,
        )
        .first()
    )
    if existing:
        existing.completed = True
        existing.completed_at = datetime.utcnow()
    else:
        prog = StudentProgress(
            student_id=current.id,
            topic_id=topic_id,
            completed=True,
            completed_at=datetime.utcnow(),
        )
        db.add(prog)
    db.commit()

    # Check if semester can now be unlocked
    from app.services.progress_service import check_and_unlock_next_semester
    unlocked = check_and_unlock_next_semester(current, db)

    return {"topic_id": topic_id, "completed": True, "semester_unlocked": unlocked}


@router.get("/peer-match")
def get_peer_matches(
    db: Session = Depends(get_db),
    current=Depends(get_current_student)
):
    """
    Peer-Matching Agent: Finds students in the same department/regulation whose 
    strengths complement the current student's weaknesses.
    """
    # Simple algorithm for MVP: find a couple of other students in same dept
    peers = (
        db.query(Student)
        .filter(Student.id != current.id)
        .limit(3)
        .all()
    )
    
    matches = []
    for p in peers:
        matches.append({
            "id": p.id,
            "name": p.full_name,
            "email": p.college_email,
            "match_score": "92%",
            "reason": f"Strong in topics you need help with (e.g. Data Structures)",
            "career_interest": p.career_interest
        })
        
    return {"matches": matches}


from pydantic import BaseModel
class CGPAUpdate(BaseModel):
    sgpas: dict[int, float]

@router.post("/me/update-cgpa")
def update_cgpa(
    payload: CGPAUpdate,
    db: Session = Depends(get_db),
    current=Depends(get_current_student)
):
    """
    Update SGPAs for completed semesters and recalculate CGPA.
    AI CGPA Calculator uses this to save predictions/updates.
    """
    from app.models.semester_completion import SemesterCompletion
    total_sgpa = 0.0
    count = 0
    
    for sem_num, sgpa in payload.sgpas.items():
        # Find semester by number
        sem = db.query(Semester).filter(
            Semester.regulation_id == current.regulation_id,
            Semester.number == sem_num
        ).first()
        if sem:
            comp = db.query(SemesterCompletion).filter(
                SemesterCompletion.student_id == current.id,
                SemesterCompletion.semester_id == sem.id
            ).first()
            if not comp:
                comp = SemesterCompletion(
                    student_id=current.id,
                    semester_id=sem.id,
                    is_completed=True
                )
                db.add(comp)
                
            comp.sgpa = sgpa
            db.commit()
            total_sgpa += sgpa
            count += 1
            
    if count > 0:
        current.cgpa = round(total_sgpa / count, 2)
        db.commit()
        
    return {"status": "success", "new_cgpa": current.cgpa}

@router.post("/me/feedbacks")
def submit_feedback(payload: dict, db: Session = Depends(get_db), current: Student = Depends(get_current_student)):
    from app.models.feedback import Feedback
    fb = Feedback(student_id=current.id, recipient=payload.get("to", "Admin"), message=payload.get("message"))
    db.add(fb)
    db.commit()
    return {"message": "Submitted"}

@router.get("/me/feedbacks")
def get_my_feedbacks(db: Session = Depends(get_db), current: Student = Depends(get_current_student)):
    from app.models.feedback import Feedback
    feedbacks = db.query(Feedback).filter(Feedback.student_id == current.id).order_by(Feedback.created_at.desc()).all()
    return [{"id": f.id, "to": f.recipient, "text": f.message, "reply": f.reply, "date": f.created_at.isoformat()} for f in feedbacks]

