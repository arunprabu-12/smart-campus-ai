-- Realistic sample data for demonstration (spec "Important" section).
-- Password for sample student is: Student@123
-- Bcrypt hash generated at cost factor 12.

INSERT INTO departments (name, code) VALUES
  ('Artificial Intelligence and Data Science', 'AIDS'),
  ('Computer Science and Engineering', 'CSE'),
  ('Electronics and Communication Engineering', 'ECE')
  ON CONFLICT DO NOTHING;

INSERT INTO regulations (name, description) VALUES
  ('2023', 'Regulation 2023 — Anna University curriculum, effective from academic year 2023-24'),
  ('2021', 'Regulation 2021 — Anna University curriculum')
  ON CONFLICT DO NOTHING;

INSERT INTO semesters (number, regulation_id) VALUES
  (1, 1), (2, 1), (3, 1), (4, 1),
  (5, 1), (6, 1), (7, 1), (8, 1)
  ON CONFLICT DO NOTHING;

-- ── Semester 1 courses ──────────────────────────────────────────────────────
INSERT INTO courses (course_code, course_name, credits, description, semester_id) VALUES
  ('MA3151', 'Matrices and Calculus', 4, 'Fundamental mathematics for engineering', 1),
  ('PH3151', 'Engineering Physics', 4, 'Physics principles for engineers', 1),
  ('CY3151', 'Engineering Chemistry', 4, 'Chemistry for engineering applications', 1),
  ('GE3151', 'Problem Solving and Python Programming', 4, 'Introduction to programming with Python', 1)
  ON CONFLICT DO NOTHING;

-- ── Semester 5 courses (AI & DS) ────────────────────────────────────────────
INSERT INTO courses (course_code, course_name, credits, description, semester_id) VALUES
  ('CS3501', 'Machine Learning', 4, 'Core ML concepts and algorithms including regression, classification, clustering and evaluation', 5),
  ('CS3502', 'Deep Learning', 4, 'Neural networks, CNNs, RNNs and transformer architectures', 5),
  ('CS3503', 'Computer Networks', 3, 'Networking fundamentals, protocols, TCP/IP stack', 5),
  ('CS3504', 'Database Management Systems', 4, 'Relational and non-relational databases, SQL, transactions', 5),
  ('CS3505', 'Big Data Analytics', 3, 'Hadoop, Spark, and large-scale data processing', 5)
  ON CONFLICT DO NOTHING;

-- ── Units for Machine Learning (course_id = 5, semester_id = 5) ─────────────
INSERT INTO units (course_id, title, order_index) VALUES
  (5, 'Unit 1: Introduction to Machine Learning', 1),
  (5, 'Unit 2: Supervised Learning', 2),
  (5, 'Unit 3: Unsupervised Learning', 3),
  (5, 'Unit 4: Model Evaluation and Optimization', 4),
  (5, 'Unit 5: Advanced Topics', 5)
  ON CONFLICT DO NOTHING;

-- ── Topics for Machine Learning ──────────────────────────────────────────────
INSERT INTO topics (unit_id, title, notes) VALUES
  (1, 'What is Machine Learning', 'Definition, types (supervised, unsupervised, reinforcement learning), applications'),
  (1, 'Types of ML Problems', 'Classification, regression, clustering, dimensionality reduction'),
  (1, 'ML Workflow', 'Data collection → preprocessing → model training → evaluation → deployment'),
  (2, 'Linear Regression', 'Cost function, gradient descent, normal equation, regularization'),
  (2, 'Logistic Regression', 'Sigmoid function, binary and multi-class classification, decision boundary'),
  (2, 'Decision Trees', 'Information gain, Gini index, pruning, CART algorithm'),
  (2, 'Random Forests', 'Ensemble learning, bagging, feature importance'),
  (2, 'Support Vector Machines', 'Hyperplane, margin, kernel trick, SVM for classification and regression'),
  (3, 'K-Means Clustering', 'Centroid initialization, convergence, choosing K (elbow method)'),
  (3, 'Hierarchical Clustering', 'Agglomerative and divisive approaches, dendrograms'),
  (3, 'Principal Component Analysis (PCA)', 'Dimensionality reduction, eigenvectors, variance explained'),
  (4, 'Model Evaluation Metrics', 'Accuracy, precision, recall, F1-score, AUC-ROC'),
  (4, 'Cross-Validation', 'K-fold, stratified, leave-one-out cross-validation'),
  (4, 'Bias-Variance Tradeoff', 'Underfitting, overfitting, regularization techniques'),
  (5, 'Ensemble Methods', 'Boosting (AdaBoost, XGBoost), bagging, stacking'),
  (5, 'Feature Engineering', 'Feature selection, feature extraction, data preprocessing')
  ON CONFLICT DO NOTHING;

-- ── Sample test for Machine Learning ────────────────────────────────────────
INSERT INTO tests (course_id, title, test_type) VALUES
  (5, 'Unit 1 Practice Test', 'Practice'),
  (5, 'Unit 2 Unit Test', 'Unit'),
  (5, 'Mid-Semester Mock Test', 'Mock'),
  (5, 'Pre-CAT Test', 'Pre-CAT')
  ON CONFLICT DO NOTHING;

-- ── Sample questions (test_id = 1, Unit 1 Practice) ─────────────────────────
INSERT INTO questions (test_id, question_text, question_type, options, correct_answer, topic_id) VALUES
  (1, 'Which of the following is an example of supervised learning?', 'MCQ',
   '["Image classification with labeled data", "K-Means clustering", "Principal Component Analysis", "Autoencoders"]',
   'Image classification with labeled data', 1),
  (1, 'Machine Learning is a subset of Artificial Intelligence.', 'TrueFalse',
   '["True", "False"]', 'True', 1),
  (1, 'In supervised learning, the training data includes labels.', 'TrueFalse',
   '["True", "False"]', 'True', 1),
  (1, 'Which step comes FIRST in the ML workflow?', 'MCQ',
   '["Model Training", "Data Collection", "Model Evaluation", "Deployment"]',
   'Data Collection', 3),
  (1, 'Briefly explain the difference between classification and regression.', 'ShortAnswer',
   NULL, 'Classification predicts discrete class labels; regression predicts continuous numerical values.', 2)
  ON CONFLICT DO NOTHING;

-- ── Sample assignment for Machine Learning ───────────────────────────────────
INSERT INTO assignments (course_id, unit_id, title, questions) VALUES
  (5, 1, 'Assignment 1 — Introduction to ML',
   '[{"text": "What is Machine Learning? Give two real-world examples.", "type": "short"},
     {"text": "Explain the difference between supervised and unsupervised learning.", "type": "short"},
     {"text": "Draw and explain the general ML workflow.", "type": "short"}]')
  ON CONFLICT DO NOTHING;

-- ── Sample student — password: Student@123 ───────────────────────────────────
-- Bcrypt hash of "Student@123" (cost 12):
INSERT INTO students (full_name, register_number, college_email, password_hash,
                       department_id, regulation_id, admission_year, current_semester,
                       section, career_interest, cgpa)
VALUES (
  'Arjun Kumar',
  '2023AIDS001',
  'arjun.kumar@college.edu',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMO6c9HWKi3z5gGVWBJeVxI.P6',
  1, 1, 2023, 5, 'A', 'Machine Learning Engineer', 8.42
) ON CONFLICT (college_email) DO NOTHING;
