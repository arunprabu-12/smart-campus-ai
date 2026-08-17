"""
AdminUser model — separate from Student.
Roles: 'admin' (full access) | 'staff' (limited: mark attendance, grade tests)
"""
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime
from app.database import Base


class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False, default="staff")  # 'admin' | 'staff'
    department = Column(String, nullable=True)   # for staff: which dept they manage
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    created_by = Column(Integer, nullable=True)  # admin_user.id who created this account
