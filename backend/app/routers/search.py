from fastapi import APIRouter
from pydantic import BaseModel
import logging

router = APIRouter(prefix="/search", tags=["search"])

class SearchRequest(BaseModel):
    query: str

try:
    from sentence_transformers import SentenceTransformer
    import torch
    import numpy as np
    
    # Load model once
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    # Mock documents to search through
    mock_docs = [
        {"title": "Physics 101 Syllabus", "content": "Gravity is the fundamental force of attraction between all masses in the universe; it dictates the motion of planets and the fall of an apple."},
        {"title": "Chemistry Handbook", "content": "An atom is the smallest unit of ordinary matter that forms a chemical element. Every solid, liquid, gas, and plasma is composed of neutral or ionized atoms."},
        {"title": "Computer Science Study Plan", "content": "Dynamic programming is a method for solving a complex problem by breaking it down into a collection of simpler subproblems, solving each of those subproblems just once."},
        {"title": "Biology Lecture Notes", "content": "Mitochondria are membrane-bound cell organelles that generate most of the chemical energy needed to power the cell's biochemical reactions."},
        {"title": "Math Course PDF", "content": "Calculus is the mathematical study of continuous change, in the same way that geometry is the study of shape, and algebra is the study of generalizations of arithmetic operations."}
    ]
    
    # Pre-embed the mock documents
    doc_texts = [d["content"] for d in mock_docs]
    doc_embeddings = model.encode(doc_texts, convert_to_tensor=True)
    
except Exception as e:
    logging.error(f"Failed to load sentence_transformers: {e}")
    model = None

@router.post("/")
def smart_search(req: SearchRequest):
    if not model:
        return {"error": "Sentence Transformer model is not loaded."}
        
    query_emb = model.encode(req.query, convert_to_tensor=True)
    
    # Compute cosine similarities
    from sentence_transformers.util import cos_sim
    cosine_scores = cos_sim(query_emb, doc_embeddings)[0]
    
    # Get top 3 matches
    import torch
    top_results = torch.topk(cosine_scores, k=min(3, len(mock_docs)))
    
    results = []
    for score, idx in zip(top_results[0], top_results[1]):
        if score > 0.1:  # Simple threshold
            doc = mock_docs[idx]
            results.append({
                "title": doc["title"],
                "content": doc["content"],
                "similarity": round(score.item() * 100, 1)
            })
            
    return {"results": results, "query": req.query}
