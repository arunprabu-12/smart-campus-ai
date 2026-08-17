"""Spec section 9 — result analysis + charts."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.dependencies import get_current_student
from app.services.result_service import (
    get_full_result_summary,
    get_topic_wise_performance,
    get_test_wise_performance,
    get_semester_performance,
)

router = APIRouter(prefix="/results", tags=["results"])


@router.get("/student/summary")
def get_result_summary(
    db: Session = Depends(get_db),
    current=Depends(get_current_student),
):
    """Master summary for the Results page — chart-ready aggregates."""
    return get_full_result_summary(current.id, db)


@router.get("/student/topic-wise")
def topic_wise(db: Session = Depends(get_db), current=Depends(get_current_student)):
    return get_topic_wise_performance(current.id, db)


@router.get("/student/test-wise")
def test_wise(db: Session = Depends(get_db), current=Depends(get_current_student)):
    return get_test_wise_performance(current.id, db)


@router.get("/student/semester/{semester_id}")
def semester_result(
    semester_id: int,
    db: Session = Depends(get_db),
    current=Depends(get_current_student),
):
    return get_semester_performance(current.id, semester_id, db)
