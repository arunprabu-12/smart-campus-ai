"""Spec section 1 — registration/login using college email + JWT."""
import os
from fastapi import APIRouter, Depends, HTTPException, Header
from typing import Optional
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.student import Student
from app.schemas.student import StudentRegister, StudentLogin, Token
from app.auth.security import hash_password, verify_password, create_access_token

ADMIN_SECRET_KEY = os.getenv("ADMIN_SECRET_KEY", "change_admin_secret")

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=Token)
def register(payload: StudentRegister, db: Session = Depends(get_db)):
    # TODO: validate college_email domain matches institution
    existing = db.query(Student).filter(Student.college_email == payload.college_email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    existing_reg = db.query(Student).filter(Student.register_number == payload.register_number).first()
    if existing_reg:
        raise HTTPException(status_code=400, detail="Register number already registered")

    student = Student(
        full_name=payload.full_name,
        register_number=payload.register_number,
        college_email=payload.college_email,
        password_hash=hash_password(payload.password),
        department_id=payload.department_id,
        regulation_id=payload.regulation_id,
        admission_year=payload.admission_year,
        current_semester=payload.current_semester,
        section=payload.section,
        career_interest=payload.career_interest,
    )
    db.add(student)
    db.commit()
    db.refresh(student)

    token = create_access_token(subject=student.college_email)
    return Token(access_token=token)


@router.post("/login", response_model=Token)
def login(payload: StudentLogin, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.college_email == payload.college_email).first()
    if not student or not verify_password(payload.password, student.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(subject=student.college_email)
    return Token(access_token=token)


@router.post("/admin-login", response_model=Token)
def admin_login(
    payload: StudentLogin,
    x_admin_secret: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Secret admin login — requires X-Admin-Secret header matching ADMIN_SECRET_KEY.
    Not linked anywhere in the UI; only accessible by direct API call or
    navigating to /admin manually with the correct credentials.
    """
    if x_admin_secret != ADMIN_SECRET_KEY:
        raise HTTPException(status_code=403, detail="Invalid admin secret")
    
    student = db.query(Student).filter(Student.college_email == payload.college_email).first()
    if not student or not verify_password(payload.password, student.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Promote to admin for this session
    if not student.is_admin:
        student.is_admin = True
        db.commit()
    
    token = create_access_token(subject=student.college_email, extra_claims={"role": "admin"})
    return Token(access_token=token)
