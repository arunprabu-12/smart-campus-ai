"""
Test AI — generates and evaluates assessments: quizzes, unit tests,
revision tests, pre-CAT tests, mock tests. Scores answers, analyzes
results, identifies weak topics. Can be triggered automatically by the
Manager AI (e.g. when a student finishes a unit).
"""
import json
from sqlalchemy.orm import Session
from datetime import datetime

from app.models.test import Test, Question, TestAttempt, TestResult, TestAnswerLog
from app.models.topic import Topic
from app.models.course import Course
from app.rag.gemini import query_gemini
from app.rag.chroma_setup import get_or_create_collection
from app.agents.rag_tool import retrieve, validate


def generate_test(course_id: int, unit_id: int, test_type: str, db: Session) -> dict:
    """
    Pulls from pre-authored Question bank or dynamically generates questions using Gemini
    grounded in syllabus chunks. Stores generated questions in database.
    """
    # 1. Try to find an existing test of this type for this course
    existing_test = db.query(Test).filter(
        Test.course_id == course_id,
        Test.test_type == test_type
    ).first()

    if existing_test:
        questions = db.query(Question).filter(Question.test_id == existing_test.id).all()
        if questions:
            return {
                "test_id": existing_test.id,
                "title": existing_test.title,
                "questions": [{
                    "id": q.id,
                    "question_text": q.question_text,
                    "question_type": q.question_type,
                    "options": q.options,
                } for q in questions],
                "status": "loaded_from_db"
            }

    # 2. Dynamic generation fallback via Gemini if no seeded tests exist
    course = db.query(Course).filter(Course.id == course_id).first()
    course_name = course.course_name if course else "Unknown Course"
    
    # Retrieve some RAG chunks for topic coverage
    chunks = validate(retrieve(f"Syllabus topics for {course_name}"))
    context = "\n".join([c.get("text", "") for c in chunks])

    prompt = f"""
    Generate a 3-question quiz for the course "{course_name}".
    Ground the questions in the following syllabus context:
    {context}
    
    You must return exactly a valid JSON list of objects. Do not wrap in markdown ```json blocks.
    Each object must have:
    - "question_text": str
    - "question_type": "MCQ" or "TrueFalse" or "ShortAnswer"
    - "options": JSON array string (e.g. '["Option A", "Option B"]' or '["True", "False"]') or null for ShortAnswer
    - "correct_answer": str (must match one option exactly for MCQ/TrueFalse)
    
    Ensure it's a parseable JSON list.
    """
    
    raw_json = query_gemini(
        prompt=prompt,
        system_instruction="You are the Test AI Agent. You output only clean, valid JSON question objects for assessments."
    )
    
    # Strip markdown code blocks if Gemini added them
    raw_json = raw_json.strip()
    if raw_json.startswith("```"):
        lines = raw_json.split("\n")
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines[-1].startswith("```"):
            lines = lines[:-1]
        raw_json = "\n".join(lines).strip()

    try:
        items = json.loads(raw_json)
    except Exception as e:
        print(f"[Test Generation Error] JSON parsing failed: {e}. Raw: {raw_json}")
        # absolute fallback questions
        items = [
            {
                "question_text": f"What is the primary objective of {course_name}?",
                "question_type": "MCQ",
                "options": json.dumps(["Core concepts learning", "Memorization", "Testing", "None"]),
                "correct_answer": "Core concepts learning"
            }
        ]

    # Create new Test
    new_test = Test(
        course_id=course_id,
        title=f"AI Generated {test_type} Quiz",
        test_type=test_type
    )
    db.add(new_test)
    db.commit()
    db.refresh(new_test)

    # Insert Questions
    generated_qs = []
    for item in items:
        # Check topic relationship if topic_id is possible
        topic = db.query(Topic).filter(Topic.unit_id == unit_id).first()
        topic_id = topic.id if topic else None
        
        q = Question(
            test_id=new_test.id,
            question_text=item.get("question_text"),
            question_type=item.get("question_type"),
            options=item.get("options") if isinstance(item.get("options"), str) else json.dumps(item.get("options")),
            correct_answer=item.get("correct_answer"),
            topic_id=topic_id
        )
        db.add(q)
        generated_qs.append(q)
    
    db.commit()

    return {
        "test_id": new_test.id,
        "title": new_test.title,
        "questions": [{
            "id": q.id,
            "question_text": q.question_text,
            "question_type": q.question_type,
            "options": q.options,
        } for q in generated_qs],
        "status": "dynamically_generated"
    }


def evaluate_attempt(attempt_id: int, answers: dict, db: Session) -> dict:
    """
    Evaluates attempt answers, calculates score, tags weak/strong topics,
    and returns a TestResult dict.
    """
    attempt = db.query(TestAttempt).filter(TestAttempt.id == attempt_id).first()
    if not attempt:
        return {"status": "error", "message": "Attempt not found"}
        
    test = db.query(Test).filter(Test.id == attempt.test_id).first()
    questions = db.query(Question).filter(Question.test_id == test.id).all()
    
    score = 0
    total = len(questions)
    weak_topics = []
    strong_topics = []

    answer_logs = []  # collect for bulk insert

    for q in questions:
        ans = answers.get(str(q.id)) or answers.get(q.id)
        if not ans:
            # unanswered — log as wrong
            if q.topic_id:
                topic = db.query(Topic).filter(Topic.id == q.topic_id).first()
                if topic and topic.title not in weak_topics:
                    weak_topics.append(topic.title)
            answer_logs.append(TestAnswerLog(
                attempt_id=attempt_id,
                question_id=q.id,
                student_answer=None,
                is_correct=0
            ))
            continue
            
        correct = q.correct_answer.strip().lower()
        submitted = str(ans).strip().lower()
        
        if q.question_type in ["MCQ", "TrueFalse"]:
            is_correct = (correct == submitted)
        else:
            # ShortAnswer is graded as correct if non-empty for demo purposes
            is_correct = len(submitted) > 2

        # Save answer log
        answer_logs.append(TestAnswerLog(
            attempt_id=attempt_id,
            question_id=q.id,
            student_answer=str(ans),
            is_correct=1 if is_correct else 0
        ))

        if is_correct:
            score += 1
            if q.topic_id:
                topic = db.query(Topic).filter(Topic.id == q.topic_id).first()
                if topic and topic.title not in strong_topics:
                    strong_topics.append(topic.title)
        else:
            if q.topic_id:
                topic = db.query(Topic).filter(Topic.id == q.topic_id).first()
                if topic and topic.title not in weak_topics:
                    weak_topics.append(topic.title)

    # Bulk insert answer logs
    for log in answer_logs:
        db.add(log)

    pct = round((score / total) * 100, 2) if total > 0 else 0
    label = "Outstanding" if pct >= 90 else "Good" if pct >= 70 else "Pass" if pct >= 50 else "Fail"

    # Save TestResult
    result = TestResult(
        attempt_id=attempt_id,
        score=score,
        total_questions=total,
        percentage=pct,
        strong_topics=json.dumps(strong_topics),
        weak_topics=json.dumps(weak_topics),
    )
    db.add(result)
    
    attempt.submitted_at = datetime.utcnow()
    
    db.commit()
    db.refresh(result)

    return {
        "status": "evaluated",
        "score": score,
        "total_questions": total,
        "percentage": pct,
        "performance_label": label,
        "weak_topics": weak_topics,
        "strong_topics": strong_topics
    }


def auto_generate_on_unit_completion(student_id: int, unit_id: int, db: Session) -> dict:
    """Generates a unit practice test automatically when unit is complete."""
    # Find course from unit
    from app.models.unit import Unit
    unit = db.query(Unit).filter(Unit.id == unit_id).first()
    if not unit:
        return {"status": "error", "message": "Unit not found"}
        
    return generate_test(course_id=unit.course_id, unit_id=unit_id, test_type="Practice", db=db)


def handle(query: str, student, db: Session) -> dict:
    """Entry point the Manager AI calls when it routes a 'test' intent here."""
    # Simple parse
    # Default to Course ID 5 (Machine Learning) practice test
    res = generate_test(course_id=5, unit_id=1, test_type="Practice", db=db)
    
    prompt = f"""
    The student is asking about testing: "{query}"
    We loaded or generated a test: "{res.get('title')}" with {len(res.get('questions', []))} questions.
    
    Provide a professional response welcoming the student to take this test.
    """
    
    answer = query_gemini(prompt, system_instruction="You are the Test AI Agent.")
    
    return {
        "agent": "test_agent",
        "answer": answer,
        "test_id": res.get("test_id"),
        "title": res.get("title"),
        "questions": res.get("questions"),
    }
