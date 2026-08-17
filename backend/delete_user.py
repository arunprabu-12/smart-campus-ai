from sqlalchemy import create_engine, text

engine = create_engine('postgresql://postgres:postgres@localhost:5432/academic_platform', isolation_level="AUTOCOMMIT")
with engine.connect() as conn:
    result = conn.execute(text("SELECT id FROM students WHERE college_email = '231801013@rajalakshmi.edu.in'"))
    row = result.fetchone()
    if row:
        student_id = row[0]
        tables = [
            "study_plans", "test_attempts", "assignment_submissions", 
            "attendance", "student_progress", "chat_history", "test_answer_logs", "test_results",
            "semester_completion", "agent_logs"
        ]
        
        try:
            conn.execute(text("DELETE FROM test_results WHERE attempt_id IN (SELECT id FROM test_attempts WHERE student_id = :sid)"), {"sid": student_id})
        except Exception:
            pass

        try:
            conn.execute(text("DELETE FROM test_answer_logs WHERE attempt_id IN (SELECT id FROM test_attempts WHERE student_id = :sid)"), {"sid": student_id})
        except Exception:
            pass

        for table in tables:
            try:
                conn.execute(text(f"DELETE FROM {table} WHERE student_id = :sid"), {"sid": student_id})
            except Exception as e:
                pass
        
        conn.execute(text("DELETE FROM students WHERE id = :sid"), {"sid": student_id})
        print('Deleted successfully!')
    else:
        print('Student not found')
