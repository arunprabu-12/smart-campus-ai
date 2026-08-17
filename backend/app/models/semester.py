"""Spec sections 2, 13, 14 — progress tracking + locking depends on this."""
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Semester(Base):
    __tablename__ = "semesters"

    id = Column(Integer, primary_key=True, index=True)
    number = Column(Integer, nullable=False)  # 1-8
    regulation_id = Column(Integer, ForeignKey("regulations.id"))

    courses = relationship("Course", backref="semester", cascade="all, delete-orphan")
    completions = relationship("SemesterCompletion", back_populates="semester", cascade="all, delete-orphan")
