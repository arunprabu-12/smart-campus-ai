"""Spec section 6."""
from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    unit_id = Column(Integer, ForeignKey("units.id"))
    title = Column(String, nullable=False)
    questions = Column(Text)  # JSON list of {"text": str, "type": "short"}

    submissions = relationship("AssignmentSubmission", back_populates="assignment", cascade="all, delete-orphan")


class AssignmentSubmission(Base):
    __tablename__ = "assignment_submissions"

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"))
    student_id = Column(Integer, ForeignKey("students.id"))
    answers = Column(Text)
    status = Column(String, default="Pending")  # Pending / Submitted / Evaluated
    score = Column(Integer, nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)

    assignment = relationship("Assignment", back_populates="submissions")
    student = relationship("Student", back_populates="submissions")
