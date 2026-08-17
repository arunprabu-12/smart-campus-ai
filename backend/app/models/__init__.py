# Import all models here so Base.metadata sees them for migrations
from app.models.student import Student
from app.models.department import Department
from app.models.regulation import Regulation
from app.models.semester import Semester
from app.models.course import Course
from app.models.unit import Unit
from app.models.topic import Topic
from app.models.student_course import StudentCourse
from app.models.student_progress import StudentProgress
from app.models.assignment import Assignment, AssignmentSubmission
from app.models.test import Test, Question, TestAttempt, TestResult, TestAnswerLog
from app.models.resource import Resource
from app.models.study_plan import StudyPlan
from app.models.chat_history import ChatHistory
from app.models.document import Document
from app.models.semester_completion import SemesterCompletion
from app.models.agent_log import AgentLog
from app.models.attendance import Attendance
from app.models.admin_user import AdminUser
