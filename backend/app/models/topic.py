"""Spec section 4-5 — topic-level study/video/notes/practice tracking."""
from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base


class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"))
    title = Column(String, nullable=False)
    notes = Column(Text)
    youtube_video_id = Column(String)  # populated via YouTube API / admin panel

    unit = relationship("Unit", back_populates="topics")
    resources = relationship("Resource", back_populates="topic", cascade="all, delete-orphan")
    student_progress = relationship("StudentProgress", back_populates="topic", cascade="all, delete-orphan")
