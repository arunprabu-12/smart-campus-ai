"""Admin CRUD + PDF upload → RAG ingestion — protected by AdminUser JWT."""
import os
import shutil
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
from app.services.hf_service import qwen_generate

from app.database import get_db
from app.models.department import Department
from app.models.regulation import Regulation
from app.models.semester import Semester
from app.models.course import Course
from app.models.unit import Unit
from app.models.topic import Topic
from app.models.test import Test, Question, TestAttempt, TestResult
from app.models.student import Student
from app.models.document import Document
from app.models.resource import Resource
from app.models.assignment import Assignment, AssignmentSubmission
from app.models.attendance import Attendance
from app.auth.admin_dependencies import get_current_admin, require_admin
from app.models.admin_user import AdminUser
from app.auth.security import hash_password

router = APIRouter(prefix="/admin", tags=["admin"])

UPLOAD_DIR = "./uploaded_docs"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ════════════════════════════════════════════════════════
# Input Schemas
# ════════════════════════════════════════════════════════

class DepartmentCreate(BaseModel):
    name: str
    code: str

class RegulationCreate(BaseModel):
    name: str
    description: Optional[str] = None

class SemesterCreate(BaseModel):
    number: int
    regulation_id: int

class CourseCreate(BaseModel):
    course_code: str
    course_name: str
    credits: int
    description: Optional[str] = None
    prerequisites: Optional[str] = None
    semester_id: int

class UnitCreate(BaseModel):
    course_id: int
    title: str
    order_index: int = 0

class TopicCreate(BaseModel):
    unit_id: int
    title: str
    notes: Optional[str] = None
    youtube_video_id: Optional[str] = None

class TestCreate(BaseModel):
    course_id: int
    title: str
    test_type: str

class QuestionCreate(BaseModel):
    test_id: int
    question_text: str
    question_type: str
    options: Optional[str] = None
    correct_answer: str
    topic_id: Optional[int] = None

class ResourceCreate(BaseModel):
    topic_id: int
    video_title: str
    channel_name: Optional[str] = None
    duration: Optional[str] = None
    video_url: str

class PasswordResetIn(BaseModel):
    new_password: str

class AssignmentCreate(BaseModel):
    title: str
    course_id: int
    questions: Optional[str] = None

class AttemptUpdate(BaseModel):
    score: float

class MarkAttendanceIn(BaseModel):
    student_id: int
    course_id: int
    date: str
    status: str
    session: str = "Morning"


# ════════════════════════════════════════════════════════
# Department
# ════════════════════════════════════════════════════════

@router.get("/departments")
def list_departments(db: Session = Depends(get_db)):
    return db.query(Department).all()

@router.post("/departments")
def create_department(payload: DepartmentCreate, db: Session = Depends(get_db)):
    dept = Department(name=payload.name, code=payload.code)
    db.add(dept); db.commit(); db.refresh(dept)
    return dept


# ════════════════════════════════════════════════════════
# Regulation
# ════════════════════════════════════════════════════════

@router.get("/regulations")
def list_regulations(db: Session = Depends(get_db)):
    return db.query(Regulation).all()

@router.post("/regulations")
def create_regulation(payload: RegulationCreate, db: Session = Depends(get_db)):
    reg = Regulation(name=payload.name, description=payload.description)
    db.add(reg); db.commit(); db.refresh(reg)
    return reg


# ════════════════════════════════════════════════════════
# Semester
# ════════════════════════════════════════════════════════

@router.get("/semesters")
def list_semesters(regulation_id: Optional[int] = None, db: Session = Depends(get_db)):
    q = db.query(Semester)
    if regulation_id:
        q = q.filter(Semester.regulation_id == regulation_id)
    return q.order_by(Semester.number).all()

@router.post("/semesters")
def create_semester(payload: SemesterCreate, db: Session = Depends(get_db)):
    sem = Semester(number=payload.number, regulation_id=payload.regulation_id)
    db.add(sem); db.commit(); db.refresh(sem)
    return sem


# ════════════════════════════════════════════════════════
# Courses
# ════════════════════════════════════════════════════════

@router.get("/courses")
def list_courses(semester_id: Optional[int] = None, db: Session = Depends(get_db)):
    q = db.query(Course)
    if semester_id:
        q = q.filter(Course.semester_id == semester_id)
    return q.all()

@router.post("/courses")
def create_course(payload: CourseCreate, db: Session = Depends(get_db)):
    course = Course(**payload.model_dump())
    db.add(course); db.commit(); db.refresh(course)
    return course

@router.put("/courses/{course_id}")
def update_course(course_id: int, payload: CourseCreate, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    for key, value in payload.model_dump().items():
        setattr(course, key, value)
    db.commit()
    return course

@router.delete("/courses/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(course); db.commit()
    return {"deleted": course_id}


# ════════════════════════════════════════════════════════
# Units & Topics
# ════════════════════════════════════════════════════════

@router.post("/units")
def create_unit(payload: UnitCreate, db: Session = Depends(get_db)):
    unit = Unit(**payload.model_dump())
    db.add(unit); db.commit(); db.refresh(unit)
    return unit

@router.delete("/units/{unit_id}")
def delete_unit(unit_id: int, db: Session = Depends(get_db)):
    unit = db.query(Unit).filter(Unit.id == unit_id).first()
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    db.delete(unit); db.commit()
    return {"deleted": unit_id}

@router.post("/topics")
def create_topic(payload: TopicCreate, db: Session = Depends(get_db)):
    topic = Topic(**payload.model_dump())
    db.add(topic); db.commit(); db.refresh(topic)
    return topic

@router.put("/topics/{topic_id}")
def update_topic(topic_id: int, payload: TopicCreate, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    for key, value in payload.model_dump().items():
        setattr(topic, key, value)
    db.commit()
    return topic

@router.delete("/topics/{topic_id}")
def delete_topic(topic_id: int, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    db.delete(topic); db.commit()
    return {"deleted": topic_id}


# ════════════════════════════════════════════════════════
# Tests & Questions
# ════════════════════════════════════════════════════════

@router.post("/tests")
def create_test(payload: TestCreate, db: Session = Depends(get_db)):
    test = Test(**payload.model_dump())
    db.add(test); db.commit(); db.refresh(test)
    return test

@router.post("/questions")
def create_question(payload: QuestionCreate, db: Session = Depends(get_db)):
    question = Question(**payload.model_dump())
    db.add(question); db.commit(); db.refresh(question)
    return question

@router.delete("/questions/{question_id}")
def delete_question(question_id: int, db: Session = Depends(get_db)):
    q = db.query(Question).filter(Question.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    db.delete(q); db.commit()
    return {"deleted": question_id}


# ════════════════════════════════════════════════════════
# Resources
# ════════════════════════════════════════════════════════

@router.post("/resources")
def create_resource(payload: ResourceCreate, db: Session = Depends(get_db)):
    resource = Resource(**payload.model_dump())
    db.add(resource); db.commit(); db.refresh(resource)
    return resource


# ════════════════════════════════════════════════════════
# Students — with dept/semester/search filters
# ════════════════════════════════════════════════════════

@router.get("/students")
def list_students(
    skip: int = 0,
    limit: int = 200,
    department_id: Optional[int] = Query(None),
    semester: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    q = db.query(Student)
    if admin.role == "staff" and admin.department:
        dept = db.query(Department).filter(Department.name == admin.department).first()
        if dept:
            q = q.filter(Student.department_id == dept.id)
        else:
            return []
    elif department_id:
        q = q.filter(Student.department_id == department_id)

    if semester:
        q = q.filter(Student.current_semester == semester)
    if search:
        like = f"%{search}%"
        q = q.filter(
            Student.full_name.ilike(like) |
            Student.register_number.ilike(like) |
            Student.college_email.ilike(like)
        )

    students = q.offset(skip).limit(limit).all()
    depts = {d.id: d.name for d in db.query(Department).all()}
    return [
        {
            "id": s.id,
            "full_name": s.full_name,
            "register_number": s.register_number,
            "college_email": s.college_email,
            "department_id": s.department_id,
            "department_name": depts.get(s.department_id, "—"),
            "current_semester": s.current_semester,
            "section": getattr(s, "section", ""),
            "cgpa": s.cgpa,
            "admission_year": getattr(s, "admission_year", None),
        }
        for s in students
    ]


# ════════════════════════════════════════════════════════
# Password Reset (admin resets student / staff password)
# ════════════════════════════════════════════════════════

@router.put("/students/{student_id}/reset-password")
def reset_student_password(
    student_id: int,
    payload: PasswordResetIn,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    student.password_hash = hash_password(payload.new_password)
    db.commit()
    return {"message": f"Password reset for {student.full_name}"}


@router.put("/staff/{staff_id}/reset-password")
def reset_staff_password(
    staff_id: int,
    payload: PasswordResetIn,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    staff = db.query(AdminUser).filter(AdminUser.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    staff.password_hash = hash_password(payload.new_password)
    db.commit()
    return {"message": f"Password reset for {staff.full_name}"}


# ════════════════════════════════════════════════════════
# Document upload → ChatPDF ingestion
# ════════════════════════════════════════════════════════

@router.post("/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    doc_type: str = "syllabus",
    db: Session = Depends(get_db),
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")
    safe_name = f"{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, safe_name)
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    doc = Document(title=file.filename, doc_type=doc_type, file_path=file_path, processed=False)
    db.add(doc); db.commit(); db.refresh(doc)
    from app.services.chatpdf_service import upload_pdf
    source_id = upload_pdf(file_path)
    if source_id:
        doc.chatpdf_source_id = source_id
        doc.processed = True
        db.commit()
        return {"document_id": doc.id, "filename": file.filename, "doc_type": doc_type, "chatpdf_source_id": source_id, "status": "uploaded_to_chatpdf"}
    return {"document_id": doc.id, "filename": file.filename, "doc_type": doc_type, "chatpdf_source_id": None, "status": "saved_locally"}

@router.delete("/documents/{document_id}")
def delete_document(document_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if doc.chatpdf_source_id:
        from app.services.chatpdf_service import delete_pdf
        delete_pdf(doc.chatpdf_source_id)
    db.delete(doc); db.commit()
    return {"deleted": document_id}

@router.get("/documents")
def list_documents(db: Session = Depends(get_db)):
    docs = db.query(Document).order_by(Document.uploaded_at.desc()).all()
    return [{"id": d.id, "title": d.title, "doc_type": d.doc_type, "processed": d.processed, "chatpdf_source_id": d.chatpdf_source_id, "uploaded_at": d.uploaded_at.isoformat()} for d in docs]


# ════════════════════════════════════════════════════════
# Tests overview (with course filter)
# ════════════════════════════════════════════════════════

@router.get("/tests-overview")
def tests_overview(
    course_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    q = db.query(Test)
    if course_id:
        q = q.filter(Test.course_id == course_id)
    tests = q.all()
    courses = {c.id: c.course_name for c in db.query(Course).all()}
    result = []
    for t in tests:
        attempts = db.query(TestAttempt).filter(TestAttempt.test_id == t.id).count()
        results = db.query(TestResult).join(TestAttempt, TestResult.attempt_id == TestAttempt.id).filter(TestAttempt.test_id == t.id).all()
        avg = round(sum(r.percentage for r in results) / len(results), 1) if results else 0
        result.append({"id": t.id, "title": t.title, "test_type": t.test_type, "course_id": t.course_id, "course_name": courses.get(t.course_id, "—"), "total_attempts": attempts, "avg_score": avg})
    return result

@router.get("/test-attempts")
def all_test_attempts(skip: int = 0, limit: int = 50, db: Session = Depends(get_db), admin: AdminUser = Depends(get_current_admin)):
    q = db.query(TestAttempt)
    if admin.role == "staff" and admin.department:
        dept = db.query(Department).filter(Department.name == admin.department).first()
        if dept:
            q = q.join(Student).filter(Student.department_id == dept.id)
        else:
            return []
    attempts = q.offset(skip).limit(limit).all()
    out = []
    for a in attempts:
        student = db.query(Student).filter(Student.id == a.student_id).first()
        test = db.query(Test).filter(Test.id == a.test_id).first()
        result = db.query(TestResult).filter(TestResult.attempt_id == a.id).first()
        out.append({"attempt_id": a.id, "student": student.full_name if student else "?", "register_number": student.register_number if student else "?", "test_title": test.title if test else "?", "test_type": test.test_type if test else "?", "started_at": a.started_at.isoformat() if a.started_at else None, "submitted_at": a.submitted_at.isoformat() if a.submitted_at else None, "score": result.score if result else None, "percentage": result.percentage if result else None})
    return out


# ════════════════════════════════════════════════════════
# Assignments overview (with course filter)
# ════════════════════════════════════════════════════════

@router.get("/assignments-overview")
def assignments_overview(
    course_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    q = db.query(Assignment)
    if course_id:
        q = q.filter(Assignment.course_id == course_id)
    assignments = q.all()
    courses = {c.id: c.course_name for c in db.query(Course).all()}
    return [{"id": a.id, "title": a.title, "course_id": a.course_id, "course_name": courses.get(a.course_id, "—"), "questions": a.questions, "total_submissions": db.query(AssignmentSubmission).filter(AssignmentSubmission.assignment_id == a.id).count()} for a in assignments]

@router.get("/submissions")
def all_submissions(assignment_id: Optional[int] = None, skip: int = 0, limit: int = 50, db: Session = Depends(get_db), admin: AdminUser = Depends(get_current_admin)):
    q = db.query(AssignmentSubmission)
    if admin.role == "staff" and admin.department:
        dept = db.query(Department).filter(Department.name == admin.department).first()
        if dept:
            q = q.join(Student).filter(Student.department_id == dept.id)
        else:
            return []
    if assignment_id:
        q = q.filter(AssignmentSubmission.assignment_id == assignment_id)
    subs = q.offset(skip).limit(limit).all()
    out = []
    for s in subs:
        student = db.query(Student).filter(Student.id == s.student_id).first()
        asgn = db.query(Assignment).filter(Assignment.id == s.assignment_id).first()
        out.append({"id": s.id, "student": student.full_name if student else "?", "register_number": student.register_number if student else "?", "assignment_title": asgn.title if asgn else "?", "submitted_at": s.submitted_at.isoformat() if s.submitted_at else None, "answers": s.answers, "score": s.score, "status": s.status})
    return out

@router.put("/submissions/{sub_id}/grade")
def grade_submission(sub_id: int, grade: str, feedback: Optional[str] = None, db: Session = Depends(get_db), admin: AdminUser = Depends(get_current_admin)):
    sub = db.query(AssignmentSubmission).filter(AssignmentSubmission.id == sub_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")
    sub.score = int(grade) if grade.isdigit() else None
    sub.status = "Evaluated"
    db.commit()
    return {"id": sub_id, "score": sub.score, "status": "Evaluated"}


# ════════════════════════════════════════════════════════
# Attendance overview
# ════════════════════════════════════════════════════════

@router.get("/attendance-overview")
def attendance_overview(db: Session = Depends(get_db), admin: AdminUser = Depends(get_current_admin)):
    q = db.query(Student)
    if admin.role == "staff" and admin.department:
        dept = db.query(Department).filter(Department.name == admin.department).first()
        if dept:
            q = q.filter(Student.department_id == dept.id)
        else:
            return []
    students = q.limit(200).all()
    depts = {d.id: d.name for d in db.query(Department).all()}
    result = []
    for s in students:
        total = db.query(Attendance).filter(Attendance.student_id == s.id).count()
        present = db.query(Attendance).filter(Attendance.student_id == s.id, Attendance.status.in_(["Present", "OD"])).count()
        pct = round((present / total * 100), 1) if total else 0
        result.append({"student_id": s.id, "full_name": s.full_name, "register_number": s.register_number, "department_name": depts.get(s.department_id, "—"), "current_semester": s.current_semester, "total": total, "present": present, "absent": total - present, "percentage": pct, "at_risk": pct < 75 and total > 0})
    return result


# ════════════════════════════════════════════════════════
# Staff-specific helpers
# ════════════════════════════════════════════════════════

@router.post("/tests/ai-generate")
def generate_test_ai(course_id: int, topic: str, db: Session = Depends(get_db), admin: AdminUser = Depends(get_current_admin)):
    new_test = Test(title=f"AI Test: {topic[:20]}", test_type="Practice", course_id=course_id)
    db.add(new_test); db.commit()
    return {"message": "AI Test created"}

@router.post("/assignments")
def create_assignment(data: AssignmentCreate, db: Session = Depends(get_db), admin: AdminUser = Depends(get_current_admin)):
    new_asgn = Assignment(title=data.title, course_id=data.course_id, questions=data.questions)
    db.add(new_asgn); db.commit()
    return {"message": "Assignment created"}

@router.post("/assignments/ai-generate")
def generate_assignment_ai(course_id: int, topic: str, db: Session = Depends(get_db), admin: AdminUser = Depends(get_current_admin)):
    import json
    prompt = f"Create 2 short questions about: {topic}. Return ONLY a JSON list like [{{\"text\": \"Question 1\", \"type\": \"short\"}}]."
    try:
        content = qwen_generate(prompt, max_tokens=300).strip().strip("```json").strip("```")
        json.loads(content)
        questions_str = content
    except:
        questions_str = json.dumps([{"text": f"Explain the core concepts of {topic}.", "type": "short"}])
    new_asgn = Assignment(title=f"AI Assignment: {topic[:20]}", course_id=course_id, questions=questions_str)
    db.add(new_asgn); db.commit()
    return {"message": "AI Assignment created"}

@router.put("/test-attempts/{attempt_id}/score")
def update_test_attempt(attempt_id: int, data: AttemptUpdate, db: Session = Depends(get_db), admin: AdminUser = Depends(get_current_admin)):
    res = db.query(TestResult).filter(TestResult.attempt_id == attempt_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Result not found")
    res.score = data.score; res.percentage = data.score; db.commit()
    return {"message": "Attempt updated"}

@router.post("/submissions/{sub_id}/ai-evaluate")
def ai_evaluate_submission(sub_id: int, db: Session = Depends(get_db), admin: AdminUser = Depends(get_current_admin)):
    sub = db.query(AssignmentSubmission).filter(AssignmentSubmission.id == sub_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")
    prompt = f"Evaluate this student answer and give a score out of 100 with a brief reason. Student Answer: {sub.answers}"
    try:
        evaluation = qwen_generate(prompt, max_tokens=150)
    except Exception as e:
        evaluation = f"AI Evaluation Failed: {str(e)}"
    return {"submission_id": sub_id, "ai_evaluation": evaluation}

@router.post("/attendance-mark")
def mark_attendance(data: MarkAttendanceIn, db: Session = Depends(get_db), admin: AdminUser = Depends(get_current_admin)):
    try:
        record_date = datetime.strptime(data.date, "%Y-%m-%d").date()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid date format, use YYYY-MM-DD")
    record = Attendance(student_id=data.student_id, course_id=data.course_id, date=record_date, session=data.session, status=data.status)
    db.add(record); db.commit()
    return {"message": "Attendance marked successfully"}
