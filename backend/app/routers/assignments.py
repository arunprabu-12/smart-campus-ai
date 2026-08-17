"""Spec section 6."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.dependencies import get_current_student
from app.models.assignment import Assignment, AssignmentSubmission
from app.schemas.assignment import AssignmentOut, SubmissionCreate

router = APIRouter(prefix="/assignments", tags=["assignments"])


@router.get("/course/{course_id}", response_model=list[AssignmentOut])
def list_assignments(course_id: int, db: Session = Depends(get_db), current=Depends(get_current_student)):
    return db.query(Assignment).filter(Assignment.course_id == course_id).all()


@router.post("/submit")
def submit_assignment(payload: SubmissionCreate, db: Session = Depends(get_db),
                       current=Depends(get_current_student)):
    # TODO: evaluation logic (auto-grade or queue for manual review) — currently just stores as Submitted
    submission = AssignmentSubmission(
        assignment_id=payload.assignment_id,
        student_id=current.id,
        answers=payload.answers,
        status="Submitted",
    )
    db.add(submission)
    db.commit()
    return {"status": "Submitted", "submission_id": submission.id}
