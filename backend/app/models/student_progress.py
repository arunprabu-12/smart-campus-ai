"""Spec section 13 — per-topic/assignment/test completion tracking."""
from sqlalchemy import Column, Integer, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class StudentProgress(Base):
    __tablename__ = "student_progress"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    topic_id = Column(Integer, ForeignKey("topics.id"))
    completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)

    student = relationship("Student", back_populates="progress")
    topic = relationship("Topic", back_populates="student_progress")
