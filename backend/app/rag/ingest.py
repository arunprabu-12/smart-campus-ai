"""
Spec sections 16-17 — PDF ingestion pipeline: extract → chunk → embed → store.
Triggered from routers/admin.py after a document upload.
Requires: pypdf (pip install pypdf)
"""
from app.rag.chroma_setup import get_or_create_collection
from app.rag.embeddings import embed_texts


def _split_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    """Simple recursive character splitter."""
    if len(text) <= chunk_size:
        return [text] if text.strip() else []

    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        if chunk.strip():
            chunks.append(chunk.strip())
        start = end - overlap
    return chunks


def ingest_pdf(file_path: str, doc_type: str, document_id: int) -> int:
    """
    1. Extract text from PDF using pypdf
    2. Chunk text (500 chars, 50 overlap)
    3. Embed chunks via sentence-transformers BGE model
    4. Upsert into ChromaDB with metadata {doc_type, document_id, source}
    Returns number of chunks ingested.
    """
    try:
        from pypdf import PdfReader
    except ImportError:
        raise ImportError("pypdf is required for PDF ingestion. Install it with: pip install pypdf")

    reader = PdfReader(file_path)
    full_text = ""
    for page in reader.pages:
        page_text = page.extract_text() or ""
        full_text += page_text + "\n"

    if not full_text.strip():
        return 0

    chunks = _split_text(full_text, chunk_size=500, overlap=50)
    if not chunks:
        return 0

    # Embed all chunks
    embeddings = embed_texts(chunks)

    # Upsert into ChromaDB
    collection = get_or_create_collection()
    ids = [f"doc_{document_id}_chunk_{i}" for i in range(len(chunks))]
    metadatas = [
        {"doc_type": doc_type, "document_id": str(document_id), "source": file_path, "chunk_index": i}
        for i in range(len(chunks))
    ]

    collection.upsert(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas,
    )

    return len(chunks)
