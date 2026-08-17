"""Attendance model — tracks per-student, per-course, per-date attendance."""
from sqlalchemy import Column, Integer, String, ForeignKey, Date, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)

    date = Column(Date, nullable=False)
    status = Column(String, nullable=False, default="Present")  # Present / Absent / Late / OD
    session = Column(String, nullable=True)   # FN / AN (forenoon / afternoon)
    marked_by = Column(String, nullable=True) # faculty / auto / system
    remarks = Column(String, nullable=True)

    ai_alert_sent = Column(Boolean, default=False)  # whether AI agent alerted student
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="attendance_records")
    course = relationship("Course", back_populates="attendance_records")
