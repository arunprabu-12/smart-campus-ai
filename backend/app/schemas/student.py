"""Pydantic schemas for student registration/profile (spec section 1)."""
from pydantic import BaseModel, EmailStr
from typing import Optional


class StudentRegister(BaseModel):
    full_name: str
    register_number: str
    college_email: EmailStr
    password: str
    department_id: int
    regulation_id: int
    admission_year: int
    current_semester: int = 1
    section: Optional[str] = None
    career_interest: Optional[str] = None


class StudentLogin(BaseModel):
    college_email: EmailStr
    password: str


class StudentProfileOut(BaseModel):
    id: int
    full_name: str
    register_number: str
    college_email: EmailStr
    department_id: int
    regulation_id: int
    current_semester: int
    section: Optional[str] = None
    career_interest: Optional[str] = None
    cgpa: float
    admission_year: Optional[int] = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
