"""
New table (multi-agent architecture) — logs which agent handled each query,
so you can demonstrate delegation/orchestration during evaluation instead of
just showing chat output.
"""
from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime
from datetime import datetime
from app.database import Base


class AgentLog(Base):
    __tablename__ = "agent_logs"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    query = Column(Text)
    intent = Column(String)          # course / learning / test / planning / academic_question
    agent_name = Column(String)      # which agent actually handled it
    answer = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    # TODO: write a row here from agents/manager.py::handle_query() once ChatHistory
    # persistence is implemented — same call site, just log both.
