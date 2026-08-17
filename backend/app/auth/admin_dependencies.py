"""JWT dependency for AdminUser — separate from student auth."""
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.security import decode_access_token
from app.models.admin_user import AdminUser

admin_oauth2 = OAuth2PasswordBearer(tokenUrl="/admin-auth/login")


def get_current_admin(
    token: str = Depends(admin_oauth2),
    db: Session = Depends(get_db),
) -> AdminUser:
    payload = decode_access_token(token)
    email = payload.get("sub")
    role = payload.get("role", "")
    if not email or role not in ("admin", "staff"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not an admin/staff account")
    admin = db.query(AdminUser).filter(AdminUser.email == email, AdminUser.is_active == True).first()
    if not admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin account not found")
    return admin


def require_admin(admin: AdminUser = Depends(get_current_admin)) -> AdminUser:
    """Only full admins — not staff."""
    if admin.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin role required")
    return admin
