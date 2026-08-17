"""Spec section 3 — course metadata."""
from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    course_code = Column(String, unique=True, nullable=False)
    course_name = Column(String, nullable=False)
    credits = Column(Integer)
    description = Column(Text)
    prerequisites = Column(Text)  # comma-separated course codes or free text
    semester_id = Column(Integer, ForeignKey("semesters.id"))

    units = relationship("Unit", back_populates="course", order_by="Unit.order_index", cascade="all, delete-orphan")
    enrolled_students = relationship("StudentCourse", back_populates="course", cascade="all, delete-orphan")
    assignments = relationship("Assignment", backref="course", cascade="all, delete-orphan")
    tests = relationship("Test", backref="course", cascade="all, delete-orphan")
    attendance_records = relationship("Attendance", back_populates="course", cascade="all, delete-orphan")

