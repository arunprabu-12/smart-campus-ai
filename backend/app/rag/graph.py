"""
DEPRECATED — superseded by app/agents/manager.py (Multi-Agent architecture).
Kept only for reference; routers/advisor.py no longer imports this file.
Safe to delete once you've confirmed the new agents/ folder is working.

Spec section 11 — LangGraph workflow for the AI Academic Advisor.

Pipeline (per spec):
  Query -> Intent Analysis -> Student Profile Analysis -> Agent Planner ->
  Retrieve Documents -> Validate -> Reasoning -> Recommendation -> Final Answer + Source

TODO: replace the linear stub below with an actual langgraph.graph.StateGraph
wiring each step as a node, matching the diagram above.
"""
from app.rag.retriever import retrieve_relevant_chunks

FALLBACK_MESSAGE = "I could not find this information in the available university documents."


def analyze_intent(query: str) -> dict:
    # TODO: classify query into syllabus / regulation / exam / progress / study-plan, etc.
    return {"intent": "unknown"}


def analyze_student_profile(student) -> dict:
    # TODO: pull department, regulation, current_semester, weak topics
    return {"department": getattr(student, "department_id", None)}


def validate_retrieved_chunks(chunks: list[dict]) -> list[dict]:
    # TODO: filter out low-relevance-score chunks
    return chunks


def reason_and_recommend(query: str, chunks: list[dict], profile: dict) -> str:
    # TODO: call Gemini here with retrieved context + profile, per spec section 10
    if not chunks:
        return FALLBACK_MESSAGE
    return "TODO: Gemini-generated answer grounded in retrieved chunks"


def run_advisor_graph(query: str, student) -> dict:
    """Entry point called from routers/advisor.py."""
    intent = analyze_intent(query)
    profile = analyze_student_profile(student)
    chunks = retrieve_relevant_chunks(query)
    validated = validate_retrieved_chunks(chunks)
    answer = reason_and_recommend(query, validated, profile)

    return {
        "answer": answer,
        "sources": [c.get("source") for c in validated],
    }
