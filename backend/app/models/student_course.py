"""Join table: which courses a student is enrolled in."""
from sqlalchemy import Column, Integer, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.database import Base


class StudentCourse(Base):
    __tablename__ = "student_courses"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    progress_percent = Column(Float, default=0.0)

    student = relationship("Student", back_populates="enrolled_courses")
    course = relationship("Course", back_populates="enrolled_students")
