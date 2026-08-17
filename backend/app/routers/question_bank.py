from fastapi import APIRouter
import docx
import re
import os

router = APIRouter(prefix="/question-bank", tags=["Question Bank"])

def parse_docx(file_path):
    if not os.path.exists(file_path):
        return []
    doc = docx.Document(file_path)
    data = []
    current_course = None
    current_unit = None
    current_question = None
    
    for para in doc.paragraphs:
        text = para.text.strip()
        if not text:
            continue
            
        if text.upper().startswith("AI & DATA SCIENCE") or "4 MCQs +" in text or text.upper().startswith("SET 2") or text.lower().startswith("fresh questions"):
            continue
            
        if re.match(r"^Unit \d+", text, re.IGNORECASE):
            current_unit = {"unit_name": text, "questions": []}
            if current_course:
                current_course["units"].append(current_unit)
            continue
            
        if re.match(r"^Q\d+\.", text):
            q_text = text.split(".", 1)[1].strip()
            current_question = {"text": q_text, "options": [], "answer": None, "type": "MCQ"}
            if current_unit:
                current_unit["questions"].append(current_question)
            continue
            
        if re.match(r"^[A-D]\.", text, re.IGNORECASE) and current_question:
            current_question["options"].append(text)
            continue
            
        if text.lower().startswith("answer:"):
            if current_question:
                ans = text.split(":", 1)[1].strip()
                current_question["answer"] = ans
                if not current_question["options"]:
                    current_question["type"] = "Descriptive"
            continue
            
        if not current_unit or (not re.match(r"^[A-D]\.", text) and not text.startswith("Q") and not text.lower().startswith("answer:")):
            if len(text) < 50 and not current_question:
                current_course = {"course_name": text, "units": []}
                data.append(current_course)
                current_unit = None
                
    return data

@router.get("/assignments")
def get_assignments_bank():
    doc_path = r"c:\Users\Arun\Desktop\ai-academic-platform\AI_DS_Unit_Wise_Assignment_Question_Bank.docx"
    return parse_docx(doc_path)

@router.get("/tests")
def get_tests_bank():
    doc_path = r"c:\Users\Arun\Desktop\ai-academic-platform\AI_DS_Assignment_Question_Bank_Set_2-1.docx"
    return parse_docx(doc_path)
