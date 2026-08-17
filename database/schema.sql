-- Spec section 17: full table list with foreign keys.
-- This mirrors backend/app/models/*.py — kept here for reference / direct psql use.
-- TODO: this is redundant with SQLAlchemy's create_all(); once schema stabilizes,
-- generate real Alembic migrations instead of hand-maintaining this file.

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL,
    code VARCHAR UNIQUE
);

CREATE TABLE regulations (
    id SERIAL PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL,
    description VARCHAR
);

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR NOT NULL,
    register_number VARCHAR UNIQUE NOT NULL,
    college_email VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL,
    department_id INTEGER REFERENCES departments(id),
    regulation_id INTEGER REFERENCES regulations(id),
    admission_year INTEGER,
    current_semester INTEGER DEFAULT 1,
    section VARCHAR,
    career_interest VARCHAR,
    cgpa FLOAT DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE semesters (
    id SERIAL PRIMARY KEY,
    number INTEGER NOT NULL,
    regulation_id INTEGER REFERENCES regulations(id)
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    course_code VARCHAR UNIQUE NOT NULL,
    course_name VARCHAR NOT NULL,
    credits INTEGER,
    description TEXT,
    prerequisites TEXT,
    semester_id INTEGER REFERENCES semesters(id)
);

CREATE TABLE units (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id),
    title VARCHAR NOT NULL,
    order_index INTEGER DEFAULT 0
);

CREATE TABLE topics (
    id SERIAL PRIMARY KEY,
    unit_id INTEGER REFERENCES units(id),
    title VARCHAR NOT NULL,
    notes TEXT,
    youtube_video_id VARCHAR
);

CREATE TABLE student_courses (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    course_id INTEGER REFERENCES courses(id),
    progress_percent FLOAT DEFAULT 0.0
);

CREATE TABLE student_progress (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    topic_id INTEGER REFERENCES topics(id),
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP
);

CREATE TABLE assignments (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id),
    unit_id INTEGER REFERENCES units(id),
    title VARCHAR NOT NULL,
    questions TEXT
);

CREATE TABLE assignment_submissions (
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER REFERENCES assignments(id),
    student_id INTEGER REFERENCES students(id),
    answers TEXT,
    status VARCHAR DEFAULT 'Pending',
    score INTEGER,
    submitted_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tests (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id),
    title VARCHAR NOT NULL,
    test_type VARCHAR
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    test_id INTEGER REFERENCES tests(id),
    question_text TEXT NOT NULL,
    question_type VARCHAR,
    options TEXT,
    correct_answer TEXT,
    topic_id INTEGER REFERENCES topics(id)
);

CREATE TABLE test_attempts (
    id SERIAL PRIMARY KEY,
    test_id INTEGER REFERENCES tests(id),
    student_id INTEGER REFERENCES students(id),
    attempt_number INTEGER DEFAULT 1,
    started_at TIMESTAMP DEFAULT NOW(),
    submitted_at TIMESTAMP,
    time_taken_seconds INTEGER
);

CREATE TABLE test_results (
    id SERIAL PRIMARY KEY,
    attempt_id INTEGER REFERENCES test_attempts(id),
    score FLOAT,
    total_questions INTEGER,
    correct_answers INTEGER,
    wrong_answers INTEGER,
    percentage FLOAT
);

CREATE TABLE resources (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER REFERENCES topics(id),
    video_title VARCHAR,
    channel_name VARCHAR,
    duration VARCHAR,
    video_url VARCHAR
);

CREATE TABLE study_plans (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    plan_date DATE,
    items TEXT,
    generated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE chat_history (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    query TEXT,
    response TEXT,
    sources TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    doc_type VARCHAR,
    file_path VARCHAR,
    processed BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE semester_completion (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    semester_id INTEGER REFERENCES semesters(id),
    courses_required_pct FLOAT DEFAULT 100.0,
    topics_required_pct FLOAT DEFAULT 100.0,
    assignments_required_pct FLOAT DEFAULT 80.0,
    tests_required_pct FLOAT DEFAULT 80.0,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP
);

-- Added for multi-agent architecture: logs which agent handled each advisor query.
CREATE TABLE agent_logs (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    query TEXT,
    intent VARCHAR,
    agent_name VARCHAR,
    answer TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
