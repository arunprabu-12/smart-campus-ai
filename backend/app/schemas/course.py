"""Spec sections 3-4 — course/unit/topic serialization schemas."""
from pydantic import BaseModel
from typing import Optional, List


class TopicOut(BaseModel):
    id: int
    title: str
    notes: Optional[str] = None
    youtube_video_id: Optional[str] = None

    class Config:
        from_attributes = True


class UnitOut(BaseModel):
    id: int
    title: str
    order_index: int = 0
    topics: List[TopicOut] = []

    class Config:
        from_attributes = True


class CourseOut(BaseModel):
    id: int
    course_code: str
    course_name: str
    credits: Optional[int] = None
    description: Optional[str] = None
    prerequisites: Optional[str] = None
    semester_id: Optional[int] = None
    units: List[UnitOut] = []

    class Config:
        from_attributes = True
