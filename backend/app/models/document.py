"""Spec section 16-17 — admin-uploaded PDFs that feed the AI Advisor via ChatPDF."""
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime
from app.database import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    doc_type = Column(String)           # regulation / syllabus / calendar / handbook etc.
    file_path = Column(String)
    chatpdf_source_id = Column(String, nullable=True)  # returned by ChatPDF after upload
    processed = Column(Boolean, default=False)          # True once uploaded to ChatPDF
    uploaded_at = Column(DateTime, default=datetime.utcnow)
