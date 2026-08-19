"""
Admin authentication & staff management.
Completely separate from student auth (/auth/*).
Routes: /admin-auth/login, /admin-auth/staff (CRUD)
"""
import os
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.admin_user import AdminUser
from app.auth.security import hash_password, verify_password, create_access_token
from app.auth.admin_dependencies import get_current_admin, require_admin

ADMIN_BOOTSTRAP_SECRET = os.getenv("ADMIN_SECRET_KEY", "super_secret_admin_key_2026")

router = APIRouter(prefix="/admin-auth", tags=["admin-auth"])

def get_staff_department(db: Session, admin: AdminUser):
    from app.models.department import Department
    dept = db.query(Department).filter(Department.name == admin.department).first()
    if dept:
        return dept
    dept = db.query(Department).filter(Department.name.ilike("%Artificial%")).first()
    if not dept:
        dept = db.query(Department).first()
    return dept


# ── Schemas ──────────────────────────────────────────────────────────

class AdminLoginIn(BaseModel):
    email: str
    password: str

class AdminToken(BaseModel):
    access_token: str
    role: str
    name: str

class StaffCreate(BaseModel):
    full_name: str
    email: str
    password: str
    role: str = "staff"          # 'admin' | 'staff'
    department: Optional[str] = None

class StaffUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    department: Optional[str] = None
    is_active: Optional[bool] = None


# ── Endpoints ─────────────────────────────────────────────────────────

@router.post("/login", response_model=AdminToken)
def admin_login(payload: AdminLoginIn, db: Session = Depends(get_db)):
    """Separate admin/staff login — issues JWT with role claim."""
    admin = db.query(AdminUser).filter(
        AdminUser.email == payload.email,
        AdminUser.is_active == True
    ).first()
    if not admin or not verify_password(payload.password, admin.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(
        subject=admin.email,
        extra_claims={"role": admin.role, "admin_id": admin.id}
    )
    return AdminToken(access_token=token, role=admin.role, name=admin.full_name)


@router.post("/bootstrap")
def bootstrap_admin(
    payload: StaffCreate,
    secret: str,
    db: Session = Depends(get_db)
):
    """
    One-time endpoint to create the first admin account.
    Requires ?secret=ADMIN_SECRET_KEY query param.
    """
    if secret != ADMIN_BOOTSTRAP_SECRET:
        raise HTTPException(status_code=403, detail="Invalid bootstrap secret")
    existing = db.query(AdminUser).filter(AdminUser.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    admin = AdminUser(
        full_name=payload.full_name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role="admin",
        department=payload.department,
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return {"id": admin.id, "email": admin.email, "role": admin.role, "message": "Admin created"}


@router.get("/me")
def get_my_profile(admin: AdminUser = Depends(get_current_admin)):
    """Return current admin/staff profile."""
    return {
        "id": admin.id, "full_name": admin.full_name,
        "email": admin.email, "role": admin.role,
        "department": admin.department, "is_active": admin.is_active,
    }


# ── Staff management (admin-only) ────────────────────────────────────

@router.get("/staff")
def list_staff(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    staff = db.query(AdminUser).order_by(AdminUser.created_at.desc()).all()
    return [
        {
            "id": s.id, "full_name": s.full_name, "email": s.email,
            "role": s.role, "department": s.department,
            "is_active": s.is_active,
            "created_at": s.created_at.isoformat(),
        }
        for s in staff
    ]


@router.post("/staff")
def create_staff(
    payload: StaffCreate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_admin)
):
    if db.query(AdminUser).filter(AdminUser.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    staff = AdminUser(
        full_name=payload.full_name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=payload.role,
        department=payload.department,
        created_by=admin.id,
    )
    db.add(staff)
    db.commit()
    db.refresh(staff)
    return {"id": staff.id, "email": staff.email, "role": staff.role}


@router.post("/save-staff-assignments")
def save_staff_assignments(
    payload: dict,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_admin)
):
    """
    Mock endpoint to successfully accept AI generated staff workload assignments.
    Future: Save to a StaffAssignment table.
    """
    return {"message": f"Successfully assigned workloads for {len(payload.get('assignments', []))} staff."}


@router.put("/staff/{staff_id}")
def update_staff(
    staff_id: int,
    payload: StaffUpdate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_admin)
):
    staff = db.query(AdminUser).filter(AdminUser.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    for field, val in payload.model_dump(exclude_none=True).items():
        setattr(staff, field, val)
    db.commit()
    return {"id": staff.id, "role": staff.role, "is_active": staff.is_active}


@router.delete("/staff/{staff_id}")
def delete_staff(
    staff_id: int,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_admin)
):
    staff = db.query(AdminUser).filter(AdminUser.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    db.delete(staff)
    db.commit()
    return {"deleted": staff_id}


# ── Dashboard stats (admin + staff) ──────────────────────────────────

@router.get("/dashboard-stats")
def dashboard_stats(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    """One endpoint returning all key counts for admin dashboard."""
    from app.models.student import Student
    from app.models.course import Course
    from app.models.test import Test, TestAttempt, TestResult
    from app.models.assignment import Assignment, AssignmentSubmission
    from app.models.attendance import Attendance
    from app.models.document import Document

    from app.models.department import Department

    # Base queries
    q_students = db.query(Student)
    q_attempts = db.query(TestAttempt)
    q_results = db.query(TestResult)
    q_submissions = db.query(AssignmentSubmission)
    q_attendance = db.query(Attendance)

    if admin.role == "staff" and admin.department:
        dept = get_staff_department(db, admin)
        if dept:
            q_students = q_students.filter(Student.department_id == dept.id)
            q_attempts = q_attempts.join(Student).filter(Student.department_id == dept.id)
            q_results = q_results.join(TestAttempt).join(Student).filter(Student.department_id == dept.id)
            q_submissions = q_submissions.join(Student).filter(Student.department_id == dept.id)
            q_attendance = q_attendance.join(Student).filter(Student.department_id == dept.id)
        else:
            # Fallback if department doesn't match
            q_students = q_students.filter(Student.id == 0)
            q_attempts = q_attempts.filter(TestAttempt.id == 0)
            q_results = q_results.filter(TestResult.id == 0)
            q_submissions = q_submissions.filter(AssignmentSubmission.id == 0)
            q_attendance = q_attendance.filter(Attendance.id == 0)

    total_students = q_students.count()
    total_courses = db.query(Course).count()
    total_tests = db.query(Test).count()
    total_attempts = q_attempts.count()
    total_assignments = db.query(Assignment).count()
    total_submissions = q_submissions.count()
    total_staff = db.query(AdminUser).count()
    total_docs = db.query(Document).count()

    # Attendance stats
    total_att = q_attendance.count()
    present_att = q_attendance.filter(Attendance.status.in_(["Present", "OD"])).count()
    att_pct = round((present_att / total_att * 100), 1) if total_att else 0

    # Average test score
    results = q_results.all()
    avg_score = round(sum(r.percentage for r in results) / len(results), 1) if results else 0

    return {
        "students": total_students,
        "courses": total_courses,
        "tests": total_tests,
        "test_attempts": total_attempts,
        "avg_test_score": avg_score,
        "assignments": total_assignments,
        "submissions": total_submissions,
        "staff": total_staff,
        "documents": total_docs,
        "attendance_total": total_att,
        "attendance_present_pct": att_pct,
    }
