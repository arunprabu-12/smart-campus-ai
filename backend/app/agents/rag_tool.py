"""
Shared RAG tool — callable by any agent, not owned by a single chatbot.
This wraps the same retrieval logic that lives in rag/retriever.py.
"""
from app.rag.chroma_setup import get_or_create_collection
from app.rag.embeddings import embed_texts

FALLBACK_MESSAGE = "I could not find this information in the available university documents."


def retrieve(query: str, top_k: int = 5) -> list[dict]:
    """
    Embed the query, run collection.query(), return
    [{"text": ..., "source": ..., "doc_type": ..., "score": ...}, ...]
    Must return [] rather than fabricated content if nothing relevant is found.
    """
    try:
        collection = get_or_create_collection()
        query_embedding = embed_texts([query])[0]
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            include=["documents", "metadatas", "distances"],
        )

        chunks = []
        documents = results.get("documents", [[]])[0]
        metadatas = results.get("metadatas", [[]])[0]
        distances = results.get("distances", [[]])[0]

        for doc, meta, dist in zip(documents, metadatas, distances):
            if dist is not None and dist > 1.5:
                continue
            chunks.append({
                "text": doc,
                "source": meta.get("source", ""),
                "doc_type": meta.get("doc_type", ""),
                "document_id": meta.get("document_id", ""),
                "relevance_score": round(1 - dist, 4) if dist is not None else 0,
            })
        return chunks
    except Exception as e:
        print(f"[RAG Tool Retrieval Error] {e}")
        return []


def validate(chunks: list[dict]) -> list[dict]:
    """Filter out low-relevance-score chunks before any agent reasons over them."""
    return [c for c in chunks if c.get("relevance_score", 0) >= 0.3]
