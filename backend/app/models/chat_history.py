"""Spec section 10-11 — AI Advisor conversation log."""
from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    query = Column(Text)
    response = Column(Text)
    sources = Column(Text, nullable=True)  # JSON list of cited document titles
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="chat_history")
