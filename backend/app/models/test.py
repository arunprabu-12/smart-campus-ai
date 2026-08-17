"""Spec sections 7-9 — tests, questions, attempts, results."""
import json
from sqlalchemy import Column, Integer, String, ForeignKey, Text, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Test(Base):
    __tablename__ = "tests"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    title = Column(String, nullable=False)
    test_type = Column(String)  # Unit/Practice/Pre-CAT/Mock/Revision/Final

    questions = relationship("Question", back_populates="test", cascade="all, delete-orphan")
    attempts = relationship("TestAttempt", back_populates="test", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("tests.id"))
    question_text = Column(Text, nullable=False)
    question_type = Column(String)  # MCQ / TrueFalse / ShortAnswer
    options = Column(Text, nullable=True)   # JSON array for MCQ e.g. ["A","B","C","D"]
    correct_answer = Column(Text)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=True)

    test = relationship("Test", back_populates="questions")

    def parsed_options(self):
        """Return options as a Python list, or [] if not set."""
        if self.options:
            try:
                return json.loads(self.options)
            except Exception:
                return []
        return []


class TestAttempt(Base):
    __tablename__ = "test_attempts"

    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("tests.id"))
    student_id = Column(Integer, ForeignKey("students.id"))
    attempt_number = Column(Integer, default=1)
    started_at = Column(DateTime, default=datetime.utcnow)
    submitted_at = Column(DateTime, nullable=True)
    time_taken_seconds = Column(Integer, nullable=True)

    test = relationship("Test", back_populates="attempts")
    student = relationship("Student", back_populates="test_attempts")
    result = relationship("TestResult", back_populates="attempt", uselist=False, cascade="all, delete-orphan")


class TestResult(Base):
    __tablename__ = "test_results"

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("test_attempts.id"))
    score = Column(Float)
    total_questions = Column(Integer)
    correct_answers = Column(Integer)
    wrong_answers = Column(Integer)
    percentage = Column(Float)
    strong_topics = Column(Text, nullable=True)   # JSON list of topic IDs
    weak_topics = Column(Text, nullable=True)     # JSON list of topic IDs

    attempt = relationship("TestAttempt", back_populates="result")


class TestAnswerLog(Base):
    """Stores each student answer per question per attempt — enables detailed test reports."""
    __tablename__ = "test_answer_logs"

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("test_attempts.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    student_answer = Column(Text, nullable=True)
    is_correct = Column(Integer, default=0)  # 0=wrong, 1=correct
    time_spent_seconds = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    attempt = relationship("TestAttempt", backref="answer_logs")
    question = relationship("Question")
