"""FastAPI dependency to extract & validate the current student from JWT."""
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.security import decode_access_token
from app.models.student import Student

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_student(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Student:
    """
    Decodes JWT, looks up the student by email, raises 401 if not found.
    decode_access_token() already raises 401 for expired/invalid tokens.
    """
    payload = decode_access_token(token)
    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    student = db.query(Student).filter(Student.college_email == email).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Student account not found")
    return student
