import os
from sqlalchemy.orm import Session
from app.models.department import Department
from app.models.regulation import Regulation
from app.models.semester import Semester
from app.models.course import Course
from app.models.unit import Unit
from app.models.topic import Topic
from app.models.test import Test, Question
from app.models.assignment import Assignment
from app.models.student import Student
from app.models.admin_user import AdminUser
from app.auth.security import hash_password

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
            
        courses = {}
        for code, name, credits, desc, sem_id in courses_data:
            c = db.query(Course).filter(Course.course_code == code).first()
            if not c:
                c = Course(course_code=code, course_name=name, credits=credits, description=desc, semester_id=sem_id)
                db.add(c)
                db.commit()
                db.refresh(c)
            courses[code] = c

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
                    current_semester=5,
                    section="A",
                    career_interest="Machine Learning Engineer",
                    cgpa=8.42
                )
                db.add(stud)
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
                    current_semester=5,
                    section="B",
                    career_interest="Data Science",
                    cgpa=8.95
                )
                db.add(rec_stud)
                db.commit()

            # Additional students to match local DB
            other_students = [
                ("Arunachalam", "231801013", "231801013@rajalakshmi.edu.in", "123456789", 5, "A"),
                ("deepak", "231801027", "231801027@rajalakshmi.edu.in", "123456789", 5, "A"),
                ("Joseph Vijay", "231801042", "231801042@rajalakshmi.edu.in", "123456789", 5, "B"),
                ("Harihar", "231801048", "231801048@rajalakshmi.edu.in", "123456789", 5, "B"),
                ("Jaga", "231801062", "231801062@rajalakshmi.edu.in", "123456789", 5, "A")
            ]

            for name, reg_num, email, pwd, sem, sec in other_students:
                s_obj = db.query(Student).filter(Student.college_email == email).first()
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

        print("[DATABASE SEED] Seed operation completed successfully.")
    except Exception as e:
        print(f"[DATABASE SEED ERROR] Failed to seed database: {e}")
