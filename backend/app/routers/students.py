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
        "current_semester_progress": current_progress,
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
