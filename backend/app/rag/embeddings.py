"""
Spec section 11 — BGE / Sentence-Transformers embedding wrapper.
Provides in-memory hash-based mock embeddings if sentence-transformers
cannot be imported or fails.
"""
try:
    from sentence_transformers import SentenceTransformer
except ImportError:
    SentenceTransformer = None

_model = None
MODEL_NAME = "BAAI/bge-small-en-v1.5"


def get_embedding_model():
    global _model
    if _model is None and SentenceTransformer is not None:
        try:
            _model = SentenceTransformer(MODEL_NAME)
        except Exception as e:
            print(f"[Embedding Model Warning] Could not load model: {e}")
    return _model


def embed_texts(texts: list[str]) -> list[list[float]]:
    model = get_embedding_model()
    if model is not None:
        try:
            return model.encode(texts, normalize_embeddings=True).tolist()
        except Exception as e:
            print(f"[Embedding Error] Encoding failed: {e}. Falling back to mock embeddings.")
            
    # Mock embedding fallback: generate a deterministic vector of length 384 based on hash
    results = []
    for text in texts:
        h = hash(text)
        vector = []
        for i in range(384):
            # Deterministic pseudo-random numbers
            val = ((h * (i + 1)) % 1000) / 1000.0
            vector.append(val)
        results.append(vector)
    return results
