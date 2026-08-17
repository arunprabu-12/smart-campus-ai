"""Student account + profile fields (spec section 1)."""
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    register_number = Column(String, unique=True, nullable=False, index=True)
    college_email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)

    department_id = Column(Integer, ForeignKey("departments.id"))
    regulation_id = Column(Integer, ForeignKey("regulations.id"))

    admission_year = Column(Integer)
    current_semester = Column(Integer, default=1)
    section = Column(String)
    career_interest = Column(String)
    cgpa = Column(Float, default=0.0)
    is_admin = Column(Boolean, default=False)  # secret admin flag

    created_at = Column(DateTime, default=datetime.utcnow)

    department = relationship("Department", back_populates="students")
    regulation = relationship("Regulation", back_populates="students")
    progress = relationship("StudentProgress", back_populates="student", cascade="all, delete-orphan")
    enrolled_courses = relationship("StudentCourse", back_populates="student", cascade="all, delete-orphan")
    test_attempts = relationship("TestAttempt", back_populates="student", cascade="all, delete-orphan")
    submissions = relationship("AssignmentSubmission", back_populates="student", cascade="all, delete-orphan")
    study_plans = relationship("StudyPlan", back_populates="student", cascade="all, delete-orphan")
    chat_history = relationship("ChatHistory", back_populates="student", cascade="all, delete-orphan")
    semester_completions = relationship("SemesterCompletion", back_populates="student", cascade="all, delete-orphan")
    attendance_records = relationship("Attendance", back_populates="student", cascade="all, delete-orphan")

