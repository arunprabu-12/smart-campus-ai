"""
Learning AI — handles the learning process: explain topics, find syllabus
sections, recommend videos/material, generate summaries using Qwen3-8B
as primary AI model with Gemini as fallback.
"""
from sqlalchemy.orm import Session

from app.agents.rag_tool import retrieve, validate, FALLBACK_MESSAGE
from app.services.youtube_service import search_videos
from app.models.topic import Topic
from app.models.resource import Resource
from app.models.student_progress import StudentProgress
from app.rag.gemini import query_gemini
from app.services.hf_service import qwen_generate, generate_study_content, HF_API_KEY


def explain_topic(query: str, db: Session) -> dict:
    """e.g. 'Explain PCA' or 'Teach me backpropagation.'"""
    # 1. Look up topic in DB
    topic = db.query(Topic).filter(Topic.title.ilike(f"%{query}%")).first()
    
    db_notes = ""
    manual_videos = []
    if topic:
        db_notes = topic.notes or ""
        # Get manual/admin-added videos for this topic
        resources = db.query(Resource).filter(Resource.topic_id == topic.id).all()
        for r in resources:
            manual_videos.append({
                "video_title": r.video_title,
                "channel_name": r.channel_name,
                "duration": r.duration,
                "video_url": r.video_url,
            })
        
        # If the topic has a youtube_video_id, convert it to a video object
        if topic.youtube_video_id and not any(v.get("video_url", "").endswith(topic.youtube_video_id) for v in manual_videos):
            manual_videos.append({
                "video_title": f"Lecture on {topic.title}",
                "channel_name": "Course Reference",
                "duration": "",
                "video_url": f"https://www.youtube.com/watch?v={topic.youtube_video_id}",
            })

    # 2. Retrieve chunks from RAG
    chunks = validate(retrieve(query))
    
    # 3. Consolidate context for Qwen3-8B / Gemini
    rag_context = "\n".join([c.get("text", "") for c in chunks])
    combined_context = f"Database Notes:\n{db_notes}\n\nRAG Chunks:\n{rag_context}"
    
    system_instr = (
        "You are the Learning AI Agent (powered by Qwen3-8B). "
        "Explain academic and engineering topics clearly, concisely, and with educational precision. "
        "Always structure: Introduction → Key Concepts → Examples → Summary."
    )
    
    prompt = f"""
Explain the following topic: "{query}"

Grounding context from the course syllabus:
{combined_context}

Provide a clear, detailed academic explanation suitable for an engineering student.
Highlight key concepts, formulas, and practical applications.
"""
    
    # Primary: Qwen3-8B via HuggingFace Inference API
    if HF_API_KEY:
        explanation = qwen_generate(
            prompt=prompt,
            system_instruction=system_instr,
            max_tokens=800,
            thinking=False,
        )
        # Fallback if Qwen returned an error string
        if explanation.startswith("["):
            explanation = query_gemini(prompt=prompt, system_instruction=system_instr)
    else:
        # Fallback: Gemini when HF not configured
        explanation = query_gemini(prompt=prompt, system_instruction=system_instr)

    # 4. Resolve recommended videos (prefer manual database entries, fall back to API)
    videos = manual_videos
    if not videos:
        # Fall back to live YouTube search if key is present
        videos = search_videos(query, max_results=1)

    return {
        "explanation": explanation,
        "sources": [c.get("source") for c in chunks],
        "recommended_video": videos[0] if videos else None,
        "all_videos": videos,
    }


def mark_topic_completed(student_id: int, topic_id: int, db: Session) -> dict:
    """Upserts a topic completion record for the student."""
    progress = db.query(StudentProgress).filter(
        StudentProgress.student_id == student_id,
        StudentProgress.topic_id == topic_id
    ).first()
    
    if not progress:
        progress = StudentProgress(
            student_id=student_id,
            topic_id=topic_id,
            completed=True
        )
        db.add(progress)
        db.commit()
        db.refresh(progress)
    
    return {"status": "success", "topic_id": topic_id, "completed": True}


def handle(query: str, student, db: Session) -> dict:
    """Entry point the Manager AI calls when it routes a 'learning' intent here."""
    result = explain_topic(query, db)
    return {"agent": "learning_agent", **result}
