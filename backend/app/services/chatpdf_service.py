"""
ChatPDF API service — handles PDF upload and question answering.
Docs: https://www.chatpdf.com/docs/api/backend

Flow:
  1. Admin uploads PDF → upload_pdf() → returns source_id (stored in Document.chatpdf_source_id)
  2. Student asks question → ask() → sends query + all source_ids → returns answer + citations
"""
import httpx
from app.config import settings

CHATPDF_BASE = "https://api.chatpdf.com/v1"
FALLBACK_NO_KEY = (
    "📄 **ChatPDF API key not configured.**\n\n"
    "Add your free key to `backend/.env`:\n"
    "```\nCHATPDF_API_KEY=sec_xxxxxxxxxxxxxxxx\n```\n"
    "Get a free key at https://www.chatpdf.com (sign up → API section)."
)


def _headers() -> dict:
    return {
        "x-api-key": settings.chatpdf_api_key,
        "Content-Type": "application/json",
    }


def upload_pdf(file_path: str) -> str | None:
    """
    Upload a local PDF file to ChatPDF.
    Returns the source_id string, or None on failure.
    """
    if not settings.chatpdf_api_key:
        print("[ChatPDF] No API key — skipping upload.")
        return None

    try:
        with open(file_path, "rb") as f:
            response = httpx.post(
                f"{CHATPDF_BASE}/sources/add-file",
                headers={"x-api-key": settings.chatpdf_api_key},
                files={"file": (file_path.split("/")[-1].split("\\")[-1], f, "application/pdf")},
                timeout=60,
            )
            response.raise_for_status()
            source_id = response.json().get("sourceId")
            print(f"[ChatPDF] Uploaded PDF → source_id: {source_id}")
            return source_id
    except Exception as e:
        print(f"[ChatPDF Upload Error] {e}")
        return None


def ask(query: str, source_ids: list[str]) -> dict:
    """
    Ask a question against one or more uploaded PDFs.

    Args:
        query:      The student's question.
        source_ids: List of ChatPDF source_ids to search across.

    Returns:
        {"answer": str, "sources": list[str]}
    """
    if not settings.chatpdf_api_key:
        return {"answer": FALLBACK_NO_KEY, "sources": []}

    if not source_ids:
        return {
            "answer": (
                "No university documents have been uploaded yet. "
                "Please ask an administrator to upload the syllabus or regulation PDFs."
            ),
            "sources": [],
        }

    answers = []
    used_sources = []

    for source_id in source_ids:
        try:
            payload = {
                "sourceId": source_id,
                "messages": [{"role": "user", "content": query}],
            }
            response = httpx.post(
                f"{CHATPDF_BASE}/chats/message",
                headers=_headers(),
                json=payload,
                timeout=30,
            )
            response.raise_for_status()
            data = response.json()
            text = data.get("content", "").strip()
            if text:
                answers.append(text)
                used_sources.append(source_id)
        except Exception as e:
            print(f"[ChatPDF Ask Error] source_id={source_id}: {e}")
            continue

    if not answers:
        return {
            "answer": "I could not find relevant information in the uploaded documents.",
            "sources": [],
        }

    # If multiple PDFs answered, combine them
    combined = "\n\n---\n\n".join(answers) if len(answers) > 1 else answers[0]
    return {"answer": combined, "sources": used_sources}


def delete_pdf(source_id: str) -> bool:
    """Remove a PDF from ChatPDF (optional cleanup)."""
    if not settings.chatpdf_api_key or not source_id:
        return False
    try:
        response = httpx.post(
            f"{CHATPDF_BASE}/sources/delete",
            headers=_headers(),
            json={"sources": [source_id]},
            timeout=10,
        )
        return response.status_code == 200
    except Exception:
        return False
