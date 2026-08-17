"""Spec section 12 — personalized study plan."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.dependencies import get_current_student
from app.services.study_plan_service import generate_study_plan
from app.services.precat_service import get_precat_dashboard

router = APIRouter(prefix="/study-plan", tags=["study-plan"])


@router.get("/today")
def get_today_plan(
    db: Session = Depends(get_db),
    current=Depends(get_current_student),
):
    return generate_study_plan(student=current, db=db)


@router.get("/precat/{course_id}")
def precat_dashboard(
    course_id: int,
    db: Session = Depends(get_db),
    current=Depends(get_current_student),
):
    return get_precat_dashboard(student=current, course_id=course_id, db=db)
