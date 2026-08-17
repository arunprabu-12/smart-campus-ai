"""Schemas for assignments (spec section 6). TODO: define question/answer JSON shape."""
from pydantic import BaseModel
from typing import Optional


class AssignmentOut(BaseModel):
    id: int
    title: str
    questions: Optional[str] = None

    class Config:
        from_attributes = True


class SubmissionCreate(BaseModel):
    assignment_id: int
    answers: str
