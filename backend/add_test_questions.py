from sqlalchemy import create_engine, text

engine = create_engine('postgresql://postgres:postgres@localhost:5432/academic_platform', isolation_level="AUTOCOMMIT")

questions_to_insert = [
    # Test 2
    {"test_id": 2, "topic_id": 1, "question_text": "What is the Big-O complexity of binary search?", "question_type": "MCQ", "options": '["O(1)", "O(log n)", "O(n)", "O(n^2)"]', "correct_answer": "O(log n)"},
    {"test_id": 2, "topic_id": 1, "question_text": "A stack follows LIFO principle.", "question_type": "TrueFalse", "options": '["True", "False"]', "correct_answer": "True"},
    {"test_id": 2, "topic_id": 1, "question_text": "What data structure is used for BFS?", "question_type": "ShortAnswer", "options": '[]', "correct_answer": "Queue"},
    
    # Test 3
    {"test_id": 3, "topic_id": 2, "question_text": "Which of these is a valid CSS selector?", "question_type": "MCQ", "options": '["#id", ".class", "element", "All of the above"]', "correct_answer": "All of the above"},
    {"test_id": 3, "topic_id": 2, "question_text": "React is a framework, not a library.", "question_type": "TrueFalse", "options": '["True", "False"]', "correct_answer": "False"},
    {"test_id": 3, "topic_id": 2, "question_text": "Explain the virtual DOM.", "question_type": "ShortAnswer", "options": '[]', "correct_answer": "A lightweight copy of the DOM used to optimize rendering."},
    
    # Test 4
    {"test_id": 4, "topic_id": 3, "question_text": "What does SQL stand for?", "question_type": "MCQ", "options": '["Structured Query Language", "Strong Question Language", "Structured Question Language", "None"]', "correct_answer": "Structured Query Language"},
    {"test_id": 4, "topic_id": 3, "question_text": "A primary key can contain NULL values.", "question_type": "TrueFalse", "options": '["True", "False"]', "correct_answer": "False"},
    {"test_id": 4, "topic_id": 3, "question_text": "What command is used to remove a table?", "question_type": "ShortAnswer", "options": '[]', "correct_answer": "DROP TABLE"},
    
    # Test 5
    {"test_id": 5, "topic_id": 4, "question_text": "What is the derivative of x^2?", "question_type": "MCQ", "options": '["x", "2x", "x^2", "2"]', "correct_answer": "2x"},
    {"test_id": 5, "topic_id": 4, "question_text": "The integral of velocity is position.", "question_type": "TrueFalse", "options": '["True", "False"]', "correct_answer": "True"},
    {"test_id": 5, "topic_id": 4, "question_text": "Define limit.", "question_type": "ShortAnswer", "options": '[]', "correct_answer": "The value that a function approaches as the input approaches some value."}
]

with engine.connect() as conn:
    for q in questions_to_insert:
        # Check if the test exists before inserting to avoid foreign key errors
        test_exists = conn.execute(text("SELECT id FROM tests WHERE id = :tid"), {"tid": q["test_id"]}).fetchone()
        
        # We need a valid topic_id. Let's just find the first topic_id in the DB.
        topic_exists = conn.execute(text("SELECT id FROM topics LIMIT 1")).fetchone()
        valid_topic_id = topic_exists[0] if topic_exists else None

        if test_exists and valid_topic_id:
            conn.execute(
                text("""
                    INSERT INTO questions (test_id, topic_id, question_text, question_type, options, correct_answer) 
                    VALUES (:test_id, :topic_id, :question_text, :question_type, :options, :correct_answer)
                """),
                {
                    "test_id": q["test_id"],
                    "topic_id": valid_topic_id,
                    "question_text": q["question_text"],
                    "question_type": q["question_type"],
                    "options": q["options"],
                    "correct_answer": q["correct_answer"]
                }
            )
            print(f"Inserted question into Test {q['test_id']}")
        else:
            print(f"Skipped Test {q['test_id']}, either test doesn't exist or no topics available.")
