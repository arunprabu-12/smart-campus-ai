import docx
import json

doc_path = r"c:\Users\Arun\Desktop\ai-academic-platform\AI_DS_Assignment_Question_Bank_Set_2-1.docx"
doc = docx.Document(doc_path)

content = []
for para in doc.paragraphs:
    if para.text.strip():
        content.append(para.text.strip())

# Print first 30 lines to see the structure
for i, line in enumerate(content[:30]):
    print(f"{i}: {line}")
