"""Schemas for the AI Academic Advisor chat (spec sections 10-11)."""
from pydantic import BaseModel
from typing import Optional, List


class AdvisorQuery(BaseModel):
    query: str


class AdvisorResponse(BaseModel):
    answer: str
    sources: List[str] = []
    # TODO: attach retrieved chunk metadata for citation display
