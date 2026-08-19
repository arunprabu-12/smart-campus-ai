import os
from sqlalchemy.orm import Session
from app.models.department import Department
from app.models.regulation import Regulation
from app.models.semester import Semester
from app.models.course import Course
from app.models.unit import Unit
from app.models.topic import Topic
from app.models.test import Test, Question, TestAttempt, TestResult
from app.models.assignment import Assignment, AssignmentSubmission
from app.models.student import Student
from app.models.semester_completion import SemesterCompletion
from app.models.admin_user import AdminUser
from app.auth.security import hash_password

def seed_course_details(db: Session, course):
    # Seed 5 units
    units = {}
    for i in range(1, 6):
        u = db.query(Unit).filter(Unit.course_id == course.id, Unit.order_index == i).first()
        if not u:
            u = Unit(course_id=course.id, title=f"Unit {i}: Advanced {course.course_name} Concepts", order_index=i)
            db.add(u)
            db.commit()
            db.refresh(u)
        units[i] = u

    # Seed topics
    topics_data = [
        (1, f"Introduction to {course.course_name}", f"Fundamental background, history, and basic terminology of {course.course_name}"),
        (2, f"Core Architecture of {course.course_name}", f"Detailed study of the core methods and algorithms behind {course.course_name}"),
        (3, f"Design Patterns for {course.course_name}", f"Engineering practices and design principles in real-world {course.course_name}"),
        (4, f"Evaluation and Benchmarks", f"Standard testing datasets and scoring metrics for {course.course_name}"),
        (5, f"Industrial Case Studies", f"Reviewing enterprise deployments and future trends of {course.course_name}")
    ]

    topics = {}
    for unit_order, title, notes in topics_data:
        u = units.get(unit_order)
        if u:
            t = db.query(Topic).filter(Topic.unit_id == u.id, Topic.title == title).first()
            if not t:
                t = Topic(unit_id=u.id, title=title, notes=notes)
                db.add(t)
                db.commit()
                db.refresh(t)
            topics[title] = t

    # Seed tests
    tests_data = [
        ("Unit 1 Practice Test", "Practice"),
        ("Unit 2 Unit Test", "Unit"),
        ("Mid-Semester Mock Test", "Mock")
    ]
    tests = {}
    for title, test_type in tests_data:
        t = db.query(Test).filter(Test.course_id == course.id, Test.title == title).first()
        if not t:
            t = Test(course_id=course.id, title=title, test_type=test_type)
            db.add(t)
            db.commit()
            db.refresh(t)
        tests[title] = t

    # Seed questions for Unit 1 Practice Test
    practice_test = tests.get("Unit 1 Practice Test")
    intro_topic = topics.get(f"Introduction to {course.course_name}")
    if practice_test and intro_topic:
        questions_data = [
            (f"What is the primary goal of {course.course_name}?", "MCQ",
             '["Optimizing performance and efficiency", "Increasing overhead", "Hardcoding static logic", "None of the above"]',
             "Optimizing performance and efficiency", intro_topic.id),
            (f"Standard architectures for {course.course_name} are widely adopted in the industry.", "TrueFalse",
             '["True", "False"]', "True", intro_topic.id),
        ]
        for q_text, q_type, options, correct, topic_id in questions_data:
            q = db.query(Question).filter(Question.test_id == practice_test.id, Question.question_text == q_text).first()
            if not q:
                q = Question(test_id=practice_test.id, question_text=q_text, question_type=q_type, options=options, correct_answer=correct, topic_id=topic_id)
                db.add(q)
        db.commit()

    # Seed Assignment under Unit 1
    u1 = units.get(1)
    if u1:
        assign = db.query(Assignment).filter(Assignment.course_id == course.id, Assignment.title == f"Assignment 1 — {course.course_name} Basics").first()
        if not assign:
            assign = Assignment(
                course_id=course.id,
                unit_id=u1.id,
                title=f"Assignment 1 — {course.course_name} Basics",
                questions=f'[{{\"text\": \"Describe the primary components of {course.course_name}.\", \"type\": \"short\"}}, {{\"text\": \"List three challenges in deploying {course.course_name}.\", \"type\": \"short\"}}]'
            )
            db.add(assign)
            db.commit()


def seed_db(db: Session):
    try:
        # 1. Seed Departments
        dept_names = [
            ("Artificial Intelligence and Data Science", "AIDS"),
            ("Computer Science and Engineering", "CSE"),
            ("Electronics and Communication Engineering", "ECE"),
            ("Information Technology", "IT"),
            ("Electrical and Electronics Engineering", "EEE"),
            ("Mechanical Engineering", "MECH"),
            ("Civil Engineering", "CIVIL")
        ]
        
        departments = {}
        for name, code in dept_names:
            dept = db.query(Department).filter(Department.name == name).first()
            if not dept:
                dept = Department(name=name, code=code)
                db.add(dept)
                db.commit()
                db.refresh(dept)
            departments[code] = dept
            
        # 2. Seed Regulations
        reg_names = [
            ("2023", "Regulation 2023 — Anna University curriculum, effective from academic year 2023-24"),
            ("2021", "Regulation 2021 — Anna University curriculum"),
            ("2017", "Regulation 2017 — Anna University curriculum"),
            ("2013", "Regulation 2013 — Anna University curriculum")
        ]
        
        regulations = {}
        for name, desc in reg_names:
            reg = db.query(Regulation).filter(Regulation.name == name).first()
            if not reg:
                reg = Regulation(name=name, description=desc)
                db.add(reg)
                db.commit()
                db.refresh(reg)
            regulations[name] = reg

        # 3. Seed Semesters (1 to 8) for Regulation 2023
        reg_2023 = regulations.get("2023")
        semesters = {}
        if reg_2023:
            for num in range(1, 9):
                sem = db.query(Semester).filter(Semester.number == num, Semester.regulation_id == reg_2023.id).first()
                if not sem:
                    sem = Semester(number=num, regulation_id=reg_2023.id)
                    db.add(sem)
                    db.commit()
                    db.refresh(sem)
                semesters[num] = sem

        # 4. Seed Courses
        sem_1 = semesters.get(1)
        sem_5 = semesters.get(5)
        sem_7 = semesters.get(7)
        
        courses_data = []
        if sem_1:
            courses_data.extend([
                ("MA3151", "Matrices and Calculus", 4, "Fundamental mathematics for engineering", sem_1.id),
                ("PH3151", "Engineering Physics", 4, "Physics principles for engineers", sem_1.id),
                ("CY3151", "Engineering Chemistry", 4, "Chemistry for engineering applications", sem_1.id),
                ("GE3151", "Problem Solving and Python Programming", 4, "Introduction to programming with Python", sem_1.id)
            ])
        if sem_5:
            courses_data.extend([
                ("CS3501", "Machine Learning", 4, "Core ML concepts and algorithms including regression, classification, clustering and evaluation", sem_5.id),
                ("CS3502", "Deep Learning", 4, "Neural networks, CNNs, RNNs and transformer architectures", sem_5.id),
                ("CS3503", "Computer Networks", 3, "Networking fundamentals, protocols, TCP/IP stack", sem_5.id),
                ("CS3504", "Database Management Systems", 4, "Relational and non-relational databases, SQL, transactions", sem_5.id),
                ("CS3505", "Big Data Analytics", 3, "Hadoop, Spark, and large-scale data processing", sem_5.id)
            ])
        if sem_7:
            courses_data.extend([
                ("CS3701", "Responsible AI", 4, "Ethics, fairness, transparency, and governance in AI systems", sem_7.id),
                ("CS3702", "Agentic AI", 4, "Autonomous agents, planning, tool usage, and LLM-based agent frameworks", sem_7.id),
                ("CS3703", "Manufacturing AI", 4, "AI applications in manufacturing, predictive maintenance, quality control, and industrial robotics", sem_7.id)
            ])
            
        courses = {}
        for code, name, credits, desc, sem_id in courses_data:
            c = db.query(Course).filter(Course.course_code == code).first()
            if not c:
                c = Course(course_code=code, course_name=name, credits=credits, description=desc, semester_id=sem_id)
                db.add(c)
                db.commit()
                db.refresh(c)
            courses[code] = c
            
            # Auto-populate 5 units, topics, tests, assignments for CS3701, CS3702, CS3703 and Semester 5 courses
            if code in ["CS3701", "CS3702", "CS3703", "CS3502", "CS3503", "CS3504", "CS3505"]:
                seed_course_details(db, c)

        # 5. Seed Units & Topics for Machine Learning (CS3501)
        ml_course = courses.get("CS3501")
        if ml_course:
            units_data = [
                ("Unit 1: Introduction to Machine Learning", 1),
                ("Unit 2: Supervised Learning", 2),
                ("Unit 3: Unsupervised Learning", 3),
                ("Unit 4: Model Evaluation and Optimization", 4),
                ("Unit 5: Advanced Topics", 5)
            ]
            
            units = {}
            for title, order in units_data:
                u = db.query(Unit).filter(Unit.course_id == ml_course.id, Unit.order_index == order).first()
                if not u:
                    u = Unit(course_id=ml_course.id, title=title, order_index=order)
                    db.add(u)
                    db.commit()
                    db.refresh(u)
                units[order] = u

            # Topics
            topics_data = [
                (1, "What is Machine Learning", "Definition, types (supervised, unsupervised, reinforcement learning), applications"),
                (1, "Types of ML Problems", "Classification, regression, clustering, dimensionality reduction"),
                (1, "ML Workflow", "Data collection → preprocessing → model training → evaluation → deployment"),
                (2, "Linear Regression", "Cost function, gradient descent, normal equation, regularization"),
                (2, "Logistic Regression", "Sigmoid function, binary and multi-class classification, decision boundary"),
                (2, "Decision Trees", "Information gain, Gini index, pruning, CART algorithm"),
                (2, "Random Forests", "Ensemble learning, bagging, feature importance"),
                (2, "Support Vector Machines", "Hyperplane, margin, kernel trick, SVM for classification and regression"),
                (3, "K-Means Clustering", "Centroid initialization, convergence, choosing K (elbow method)"),
                (3, "Hierarchical Clustering", "Agglomerative and divisive approaches, dendrograms"),
                (3, "Principal Component Analysis (PCA)", "Dimensionality reduction, eigenvectors, variance explained"),
                (4, "Model Evaluation Metrics", "Accuracy, precision, recall, F1-score, AUC-ROC"),
                (4, "Cross-Validation", "K-fold, stratified, leave-one-out cross-validation"),
                (4, "Bias-Variance Tradeoff", "Underfitting, overfitting, regularization techniques"),
                (5, "Ensemble Methods", "Boosting (AdaBoost, XGBoost), bagging, stacking"),
                (5, "Feature Engineering", "Feature selection, feature extraction, data preprocessing")
            ]
            
            topics = {}
            for unit_order, title, notes in topics_data:
                u = units.get(unit_order)
                if u:
                    t = db.query(Topic).filter(Topic.unit_id == u.id, Topic.title == title).first()
                    if not t:
                        t = Topic(unit_id=u.id, title=title, notes=notes)
                        db.add(t)
                        db.commit()
                        db.refresh(t)
                    topics[title] = t

            # 6. Seed Tests & Questions
            tests_data = [
                ("Unit 1 Practice Test", "Practice"),
                ("Unit 2 Unit Test", "Unit"),
                ("Mid-Semester Mock Test", "Mock"),
                ("Pre-CAT Test", "Pre-CAT")
            ]
            
            tests = {}
            for title, test_type in tests_data:
                t = db.query(Test).filter(Test.course_id == ml_course.id, Test.title == title).first()
                if not t:
                    t = Test(course_id=ml_course.id, title=title, test_type=test_type)
                    db.add(t)
                    db.commit()
                    db.refresh(t)
                tests[title] = t

            # Questions for "Unit 1 Practice Test"
            practice_test = tests.get("Unit 1 Practice Test")
            t_what_is_ml = topics.get("What is Machine Learning")
            t_types_of_ml = topics.get("Types of ML Problems")
            t_ml_workflow = topics.get("ML Workflow")
            
            if practice_test:
                questions_data = [
                    ("Which of the following is an example of supervised learning?", "MCQ",
                     '["Image classification with labeled data", "K-Means clustering", "Principal Component Analysis", "Autoencoders"]',
                     "Image classification with labeled data", t_what_is_ml.id if t_what_is_ml else None),
                    ("Machine Learning is a subset of Artificial Intelligence.", "TrueFalse",
                     '["True", "False"]', "True", t_what_is_ml.id if t_what_is_ml else None),
                    ("In supervised learning, the training data includes labels.", "TrueFalse",
                     '["True", "False"]', "True", t_what_is_ml.id if t_what_is_ml else None),
                    ("Which step comes FIRST in the ML workflow?", "MCQ",
                     '["Model Training", "Data Collection", "Model Evaluation", "Deployment"]',
                     "Data Collection", t_ml_workflow.id if t_ml_workflow else None),
                    ("Briefly explain the difference between classification and regression.", "ShortAnswer",
                     None, "Classification predicts discrete class labels; regression predicts continuous numerical values.", t_types_of_ml.id if t_types_of_ml else None)
                ]
                
                for q_text, q_type, options, correct, topic_id in questions_data:
                    q = db.query(Question).filter(Question.test_id == practice_test.id, Question.question_text == q_text).first()
                    if not q:
                        q = Question(test_id=practice_test.id, question_text=q_text, question_type=q_type, options=options, correct_answer=correct, topic_id=topic_id)
                        db.add(q)
                db.commit()

            # 7. Seed Assignments
            u1 = units.get(1)
            if u1:
                assign = db.query(Assignment).filter(Assignment.course_id == ml_course.id, Assignment.title == "Assignment 1 — Introduction to ML").first()
                if not assign:
                    assign = Assignment(
                        course_id=ml_course.id,
                        unit_id=u1.id,
                        title="Assignment 1 — Introduction to ML",
                        questions='[{"text": "What is Machine Learning? Give two real-world examples.", "type": "short"}, {"text": "Explain the difference between supervised and unsupervised learning.", "type": "short"}, {"text": "Draw and explain the general ML workflow.", "type": "short"}]'
                    )
                    db.add(assign)
                    db.commit()

        # 8. Seed Student (Arjun Kumar)
        aids_dept = departments.get("AIDS")
        reg_2023_obj = regulations.get("2023")
        if aids_dept and reg_2023_obj:
            stud = db.query(Student).filter(Student.college_email == "arjun.kumar@college.edu").first()
            if not stud:
                stud = Student(
                    full_name="Arjun Kumar",
                    register_number="2023AIDS001",
                    college_email="arjun.kumar@college.edu",
                    password_hash=hash_password("Student@123"),
                    department_id=aids_dept.id,
                    regulation_id=reg_2023_obj.id,
                    admission_year=2023,
                    current_semester=7,
                    section="A",
                    career_interest="Machine Learning Engineer",
                    cgpa=8.42
                )
                db.add(stud)
                db.commit()
            else:
                stud.current_semester = 7
                db.commit()
                
            # Also seed a student with Rajalakshmi email for quick user login
            rec_stud = db.query(Student).filter(Student.college_email == "student@rajalakshmi.edu.in").first()
            if not rec_stud:
                rec_stud = Student(
                    full_name="Rajesh Kumar",
                    register_number="231801014",
                    college_email="student@rajalakshmi.edu.in",
                    password_hash=hash_password("Student@123"),
                    department_id=aids_dept.id,
                    regulation_id=reg_2023_obj.id,
                    admission_year=2023,
                    current_semester=7,
                    section="B",
                    career_interest="Data Science",
                    cgpa=8.95
                )
                db.add(rec_stud)
                db.commit()
            else:
                rec_stud.current_semester = 7
                db.commit()

            # Additional students to match local DB (some Semester 7, some Semester 5)
            other_students = [
                ("Arunachalam", "231801013", "231801013@rajalakshmi.edu.in", "123456789", 7, "A"),
                ("deepak", "231801027", "231801027@rajalakshmi.edu.in", "123456789", 5, "A"),
                ("Joseph Vijay", "231801042", "231801042@rajalakshmi.edu.in", "123456789", 7, "B"),
                ("Harihar", "231801048", "231801048@rajalakshmi.edu.in", "123456789", 5, "B"),
                ("Jaga", "231801062", "231801062@rajalakshmi.edu.in", "123456789", 5, "A"),
                
                # New students requested by user
                ("ABHINAVU PRASAD", "231801002", "231801002@rajalakshmi.edu.in", "123456789", 5, "A"),
                ("aishwarya m", "231801003", "231801003@rajalakshmi.edu.in", "123456789", 5, "B"),
                ("ARCHANA R M", "231801011", "231801011@rajalakshmi.edu.in", "123456789", 5, "A"),
                ("ARUN PRABU M M", "231801012", "231801012@rajalakshmi.edu.in", "123456789", 5, "B"),
                ("ASWIN SATHEESH", "231801016", "231801016@rajalakshmi.edu.in", "123456789", 5, "A"),
                ("BHARATH RAJ N S", "231801022", "231801022@rajalakshmi.edu.in", "123456789", 5, "B"),
                ("DARSHINI R", "231801026", "231801026@rajalakshmi.edu.in", "123456789", 5, "A"),
                ("DEEPAK S", "231801027", "231801027@rajalakshmi.edu.in", "123456789", 5, "B"),
                ("DHARSHANA S", "231801032", "231801032@rajalakshmi.edu.in", "123456789", 5, "A"),
                ("HANNAH JAMES", "231801047", "231801047@rajalakshmi.edu.in", "123456789", 5, "B"),
                ("HARINI S", "231801049", "231801049@rajalakshmi.edu.in", "123456789", 5, "A"),
                ("HEMANANTH S", "231801056", "231801056@rajalakshmi.edu.in", "123456789", 5, "B"),
                ("IRAIYANBU S T", "231801061", "231801061@rajalakshmi.edu.in", "123456789", 5, "A"),
                ("JAGADEESAN T", "231801062", "231801062@rajalakshmi.edu.in", "123456789", 5, "B"),
                ("JANANI V R", "231801065", "231801065@rajalakshmi.edu.in", "123456789", 5, "A"),
                ("JYOSTNA J", "231801075", "231801075@rajalakshmi.edu.in", "123456789", 5, "B"),
                ("KEERTHNA S", "231801083", "231801083@rajalakshmi.edu.in", "123456789", 5, "A"),
                ("KRITHIKA MA", "231801086", "231801086@rajalakshmi.edu.in", "123456789", 5, "B"),
                ("KUMARAN D", "231801087", "231801087@rajalakshmi.edu.in", "123456789", 5, "A"),
                ("MANISHA P", "231801096", "231801096@rajalakshmi.edu.in", "123456789", 5, "B"),
                ("MATHAN S", "231801098", "231801098@rajalakshmi.edu.in", "123456789", 5, "A"),
                ("MOHANRAJI PICHANDI", "231801109", "231801109@rajalakshmi.edu.in", "123456789", 5, "B"),
                ("MUKESH KUMAR S", "231801112", "231801112@rajalakshmi.edu.in", "123456789", 5, "A"),
                ("MURALI KRISHNA M", "231801113", "231801113@rajalakshmi.edu.in", "123456789", 5, "B"),
                ("NIKITHA S S", "231801118", "231801118@rajalakshmi.edu.in", "123456789", 5, "A"),
                ("NITHENKUMAR S", "231801119", "231801119@rajalakshmi.edu.in", "123456789", 5, "B"),
                ("RAGUL G", "231801132", "231801132@rajalakshmi.edu.in", "123456789", 5, "A"),
                ("SACHIN K G", "231801144", "231801144@rajalakshmi.edu.in", "123456789", 5, "B"),
                ("SANJAY N", "231801149", "231801149@rajalakshmi.edu.in", "123456789", 5, "A"),
                ("SARANYA V", "231801155", "231801155@rajalakshmi.edu.in", "123456789", 5, "B"),
                ("SASI SRIRAM E", "231801159", "231801159@rajalakshmi.edu.in", "123456789", 5, "A"),
                ("SOORYA G", "231801169", "231801169@rajalakshmi.edu.in", "123456789", 5, "B"),
                ("VISHVAM GANESH", "231801189", "231801189@rajalakshmi.edu.in", "123456789", 5, "A"),
                ("SHRI RAM M", "231801507", "231801507@rajalakshmi.edu.in", "123456789", 5, "B")
            ]

            for name, reg_num, email, pwd, sem, sec in other_students:
                s_obj = db.query(Student).filter(Student.register_number == reg_num).first()
                if not s_obj:
                    new_s = Student(
                        full_name=name,
                        register_number=reg_num,
                        college_email=email,
                        password_hash=hash_password(pwd),
                        department_id=aids_dept.id,
                        regulation_id=reg_2023_obj.id,
                        admission_year=2023,
                        current_semester=sem,
                        section=sec,
                        career_interest="Software Engineering",
                        cgpa=8.0
                    )
                    db.add(new_s)
                else:
                    s_obj.current_semester = sem
                    s_obj.full_name = name
                    s_obj.college_email = email
                    s_obj.password_hash = hash_password(pwd)
            db.commit()

            # Seed Semester Completion up to (current_semester - 1) to show GPA trends
            import random
            emails = ["student@rajalakshmi.edu.in", "arjun.kumar@college.edu"] + [item[2] for item in other_students]
            for email in emails:
                stud_obj = db.query(Student).filter(Student.college_email == email).first()
                if stud_obj:
                    for s_num in range(1, stud_obj.current_semester):
                        sem_obj = db.query(Semester).filter(Semester.number == s_num, Semester.regulation_id == reg_2023_obj.id).first()
                        if sem_obj:
                            comp = db.query(SemesterCompletion).filter(
                                SemesterCompletion.student_id == stud_obj.id,
                                SemesterCompletion.semester_id == sem_obj.id
                            ).first()
                            if not comp:
                                comp = SemesterCompletion(
                                    student_id=stud_obj.id,
                                    semester_id=sem_obj.id,
                                    is_completed=True,
                                    sgpa=round(random.uniform(7.8, 9.4), 2),
                                    courses_required_pct=100.0,
                                    topics_required_pct=100.0,
                                    assignments_required_pct=100.0,
                                    tests_required_pct=100.0
                                )
                                db.add(comp)
            db.commit()

            # Seed assignments & tests attempts/results for student courses based on current semester
            from datetime import datetime
            
            for email in emails:
                stud_obj = db.query(Student).filter(Student.college_email == email).first()
                if stud_obj:
                    # Get courses for the student's actual current semester
                    student_sem = db.query(Semester).filter(
                        Semester.regulation_id == reg_2023_obj.id,
                        Semester.number == stud_obj.current_semester
                    ).first()
                    if student_sem:
                        courses_list = db.query(Course).filter(Course.semester_id == student_sem.id).all()
                        for course in courses_list:
                            # Find assignments
                            assigns = db.query(Assignment).filter(Assignment.course_id == course.id).all()
                            for i, assign in enumerate(assigns):
                                # Seed submission for the first assignment
                                if i == 0:
                                    sub = db.query(AssignmentSubmission).filter(
                                        AssignmentSubmission.assignment_id == assign.id,
                                        AssignmentSubmission.student_id == stud_obj.id
                                    ).first()
                                    if not sub:
                                        sub = AssignmentSubmission(
                                            assignment_id=assign.id,
                                            student_id=stud_obj.id,
                                            answers='{"1": "Decentralized autonomous framework.", "2": "Data scarcity."}',
                                            status="Evaluated",
                                            score=85,
                                            submitted_at=datetime.utcnow()
                                        )
                                        db.add(sub)
                                        
                            # Find tests
                            tests_list = db.query(Test).filter(Test.course_id == course.id).all()
                            for test in tests_list:
                                att = db.query(TestAttempt).filter(
                                    TestAttempt.test_id == test.id,
                                    TestAttempt.student_id == stud_obj.id
                                ).first()
                                if not att:
                                    att = TestAttempt(
                                        test_id=test.id,
                                        student_id=stud_obj.id,
                                        attempt_number=1,
                                        started_at=datetime.utcnow(),
                                        submitted_at=datetime.utcnow(),
                                        time_taken_seconds=300
                                    )
                                    db.add(att)
                                    db.commit()
                                    db.refresh(att)
                                    
                                    # score based on course code
                                    pct = 80.0
                                    if "CS3702" in course.course_code or "CS3502" in course.course_code:
                                        pct = 90.0
                                    elif "CS3703" in course.course_code or "CS3503" in course.course_code:
                                        pct = 70.0
                                        
                                    res = TestResult(
                                        attempt_id=att.id,
                                        score=float(pct/10),
                                        total_questions=10,
                                        correct_answers=int(pct/10),
                                        wrong_answers=10 - int(pct/10),
                                        percentage=pct
                                    )
                                    db.add(res)
            db.commit()

        # 9. Seed Admin / Staff User
        admin_user = db.query(AdminUser).filter(AdminUser.email == "admin@college.edu").first()
        if not admin_user:
            admin_user = AdminUser(
                full_name="System Administrator",
                email="admin@college.edu",
                password_hash=hash_password("Admin@123"),
                role="admin",
                department="Artificial Intelligence and Data Science",
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            
        staff_user = db.query(AdminUser).filter(AdminUser.email == "staff@college.edu").first()
        if not staff_user:
            staff_user = AdminUser(
                full_name="Dr. Lakshmi Devi",
                email="staff@college.edu",
                password_hash=hash_password("Staff@123"),
                role="staff",
                department="Artificial Intelligence and Data Science",
                is_active=True
            )
            db.add(staff_user)
            db.commit()

        # Seed Kapil, Madhubala, Selvarani
        staff_members_data = [
            ("Kapil", "kapil@college.edu", "Deep Learning, Machine Learning, Natural Language Processing"),
            ("Madhubala", "madhubala@college.edu", "Agentic AI, Computer Networks"),
            ("Selvarani", "selvarani@college.edu", "Big Data Analytics, Manufacturing AI")
        ]
        for s_name, s_email, s_dept in staff_members_data:
            s_user = db.query(AdminUser).filter(AdminUser.email == s_email).first()
            if not s_user:
                s_user = AdminUser(
                    full_name=s_name,
                    email=s_email,
                    password_hash=hash_password("staff123"),
                    role="staff",
                    department=s_dept,
                    is_active=True
                )
                db.add(s_user)
            else:
                s_user.department = s_dept
                s_user.password_hash = hash_password("staff123")
        db.commit()

        print("[DATABASE SEED] Seed operation completed successfully.")
    except Exception as e:
        print(f"[DATABASE SEED ERROR] Failed to seed database: {e}")
