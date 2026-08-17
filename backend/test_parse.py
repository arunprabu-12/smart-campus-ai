import docx
import re
import json

def parse_docx(file_path):
    doc = docx.Document(file_path)
    data = []
    current_course = None
    current_unit = None
    current_question = None
    
    for para in doc.paragraphs:
        text = para.text.strip()
        if not text:
            continue
            
        # Ignore headers
        if text.upper().startswith("AI & DATA SCIENCE") or "4 MCQs +" in text:
            continue
            
        # Unit detection
        if re.match(r"^Unit \d+", text, re.IGNORECASE):
            current_unit = {"unit_name": text, "questions": []}
            if current_course:
                current_course["units"].append(current_unit)
            continue
            
        # Question detection
        if re.match(r"^Q\d+\.", text):
            q_text = text.split(".", 1)[1].strip()
            current_question = {"text": q_text, "options": [], "answer": None, "type": "MCQ"}
            if current_unit:
                current_unit["questions"].append(current_question)
            continue
            
        # Options detection
        if re.match(r"^[A-D]\.", text, re.IGNORECASE) and current_question:
            current_question["options"].append(text)
            continue
            
        # Answer detection
        if text.lower().startswith("answer:"):
            if current_question:
                ans = text.split(":", 1)[1].strip()
                current_question["answer"] = ans
                if not current_question["options"]:
                    current_question["type"] = "Descriptive"
            continue
            
        # If no unit has been set, but we have text that's not Q/A/Unit, it's likely a course title
        if not current_unit or (not re.match(r"^[A-D]\.", text) and not text.startswith("Q") and not text.lower().startswith("answer:")):
            # Start of a new course maybe? Or description text.
            # Let's assume if it's short, it's a course name.
            if len(text) < 50 and not current_question:
                current_course = {"course_name": text, "units": []}
                data.append(current_course)
                current_unit = None
                
    return data

if __name__ == "__main__":
    doc_path = r"c:\Users\Arun\Desktop\ai-academic-platform\AI_DS_Unit_Wise_Assignment_Question_Bank.docx"
    res = parse_docx(doc_path)
    print(json.dumps(res, indent=2))
