"""Schemas for tests/results (spec sections 7, 9)."""
from pydantic import BaseModel
from typing import Optional, List, Dict


class QuestionOut(BaseModel):
    id: int
    question_text: str
    question_type: str
    options: Optional[str] = None  # JSON string for MCQ options; parse client-side

    class Config:
        from_attributes = True


class TestOut(BaseModel):
    id: int
    title: str
    test_type: str
    questions: List[QuestionOut] = []

    class Config:
        from_attributes = True


class AnswerSubmission(BaseModel):
    """Client sends { answers: { "q_id": "answer_text", ... }, time_taken_seconds: int }"""
    answers: Dict[str, str]
    time_taken_seconds: Optional[int] = None


class TestResultOut(BaseModel):
    attempt_id: int
    score: float
    total_questions: int
    correct_answers: int
    wrong_answers: int
    percentage: float
    strong_topics: List[str] = []
    weak_topics: List[str] = []
    performance_label: str = ""
