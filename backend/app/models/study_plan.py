"""Spec section 12."""
from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class StudyPlan(Base):
    __tablename__ = "study_plans"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    plan_date = Column(Date)
    items = Column(Text)  # JSON list — [{"task": str, "duration_minutes": int, "type": str}]
    generated_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="study_plans")
