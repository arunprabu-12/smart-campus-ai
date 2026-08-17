"""Spec section 14 — configurable semester unlock rules + status."""
from sqlalchemy import Column, Integer, ForeignKey, Boolean, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class SemesterCompletion(Base):
    __tablename__ = "semester_completion"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    semester_id = Column(Integer, ForeignKey("semesters.id"))
    courses_required_pct = Column(Float, default=100.0)
    topics_required_pct = Column(Float, default=100.0)
    assignments_required_pct = Column(Float, default=80.0)
    tests_required_pct = Column(Float, default=80.0)
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)
    sgpa = Column(Float, nullable=True)

    student = relationship("Student", back_populates="semester_completions")
    semester = relationship("Semester", back_populates="completions")
