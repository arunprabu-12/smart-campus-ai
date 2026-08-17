"""
Spec section 11 — ChromaDB vector store setup with in-memory fallback
for environments where chromadb cannot be compiled (e.g. Python 3.14+).
"""
try:
    import chromadb
except ImportError:
    chromadb = None

from app.config import settings

_client = None


class MockCollection:
    """Fallback in-memory vector collection if ChromaDB is not installed."""
    def __init__(self):
        self.data = []

    def get_or_create_collection(self, name):
        return self

    def add(self, ids, documents, metadatas=None):
        for id_, doc, meta in zip(ids, documents, metadatas or [{}] * len(ids)):
            # Remove duplicates
            self.data = [d for d in self.data if d["id"] != id_]
            self.data.append({"id": id_, "document": doc, "metadata": meta})

    def query(self, query_embeddings, n_results=5, include=None):
        # Return all in-memory items (mocking relevance for simplicity)
        docs = [d["document"] for d in self.data[:n_results]]
        metas = [d["metadata"] for d in self.data[:n_results]]
        dists = [0.1 * i for i in range(len(docs))]
        return {
            "documents": [docs],
            "metadatas": [metas],
            "distances": [dists]
        }


class MockClient:
    """Fallback client."""
    def __init__(self):
        self.collection = MockCollection()

    def get_or_create_collection(self, name):
        return self.collection


def get_chroma_client():
    global _client
    if _client is None:
        if chromadb is not None:
            try:
                _client = chromadb.PersistentClient(path=settings.chroma_persist_dir)
            except Exception as e:
                print(f"[ChromaDB Client Warning] Could not instantiate client: {e}. Falling back to in-memory.")
                _client = MockClient()
        else:
            print("[ChromaDB Client Warning] ChromaDB not installed. Using in-memory fallback.")
            _client = MockClient()
    return _client


def get_or_create_collection(name: str = "university_documents"):
    client = get_chroma_client()
    return client.get_or_create_collection(name=name)
