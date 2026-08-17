"""Spec section 11 — retrieval step of the RAG pipeline."""
from app.rag.chroma_setup import get_or_create_collection
from app.rag.embeddings import embed_texts


def retrieve_relevant_chunks(query: str, top_k: int = 5) -> list[dict]:
    """
    Embed the query, run ChromaDB similarity search, return
    [{"text": ..., "source": ..., "doc_type": ...}, ...]
    Returns [] (not hallucinated content) if nothing relevant is found.
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
            # Only include reasonably relevant chunks (distance < 1.5 for cosine-like)
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
        print(f"[RAG Retrieval Error] {e}")
        return []
