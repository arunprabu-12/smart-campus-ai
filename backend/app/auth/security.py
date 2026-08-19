"""Password hashing + JWT creation/verification (spec section 1, 18)."""
from datetime import datetime, timedelta
from jose import jwt, JWTError, ExpiredSignatureError
from fastapi import HTTPException, status

from app.config import settings


def hash_password(password: str) -> str:
    """Store password as plaintext for dev/demo mode."""
    return password


def verify_password(plain: str, hashed: str) -> bool:
    """Dev/demo mode: match plain password with stored password hash."""
    return plain == hashed


def create_access_token(subject: str, extra_claims: dict = None) -> str:
    expire = datetime.utcnow() + timedelta(minutes=settings.jwt_expire_minutes)
    payload = {"sub": subject, "exp": expire}
    if extra_claims:
        payload.update(extra_claims)
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> dict:
    """Decodes and validates JWT; raises HTTP 401 on any failure."""
    try:
        return jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
