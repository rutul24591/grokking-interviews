"""
Example 1: RAG Pipeline — Document Chunking, Embedding, and Retrieval

Demonstrates:
- Document chunking with overlap
- Embedding simulation (cosine similarity)
- Top-k retrieval from vector store
- Prompt construction with retrieved context
"""

import math
from typing import List, Dict, Tuple


def chunk_document(text: str, chunk_size: int = 200, overlap: int = 40) -> List[str]:
    """Split text into chunks with overlap."""
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        end = min(start + chunk_size, len(words))
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        start = end - overlap
        if start >= len(words):
            break
    return chunks


def cosine_similarity(a: List[float], b: List[float]) -> float:
    """Compute cosine similarity between two vectors."""
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    return dot / (norm_a * norm_b) if norm_a and norm_b else 0.0


def simple_embed(text: str, dim: int = 8) -> List[float]:
    """Simple hash-based embedding simulation."""
    import hashlib
    h = hashlib.sha256(text.encode()).hexdigest()
    return [int(h[i:i+4], 16) / 65535.0 for i in range(0, dim * 4, 4)]


class VectorStore:
    def __init__(self):
        self.documents: List[Dict] = []

    def add(self, text: str, metadata: Dict = None):
        embedding = simple_embed(text)
        self.documents.append({
            "text": text,
            "embedding": embedding,
            "metadata": metadata or {},
        })

    def search(self, query: str, top_k: int = 3) -> List[Tuple[float, Dict]]:
        query_emb = simple_embed(query)
        scored = []
        for doc in self.documents:
            sim = cosine_similarity(query_emb, doc["embedding"])
            scored.append((sim, doc))
        scored.sort(reverse=True, key=lambda x: x[0])
        return scored[:top_k]


def build_rag_pipeline(documents: List[str], chunk_size: int = 100, overlap: int = 20) -> VectorStore:
    """Build a RAG index from documents."""
    store = VectorStore()
    for i, doc in enumerate(documents):
        chunks = chunk_document(doc, chunk_size, overlap)
        for j, chunk in enumerate(chunks):
            store.add(chunk, {"doc_id": i, "chunk_id": j, "source": f"doc_{i}"})
    return store


def rag_query(store: VectorStore, query: str, top_k: int = 3) -> str:
    """Query the RAG system and construct the prompt."""
    results = store.search(query, top_k)

    # Build prompt with retrieved context
    context_parts = []
    for score, doc in results:
        context_parts.append(f"[Source: {doc['metadata'].get('source', 'unknown')}, "
                           f"Relevance: {score:.3f}]\n{doc['text']}")

    prompt = (
        "Answer the user's question based ONLY on the following context. "
        "If the context doesn't contain enough information, say so.\n\n"
        "Context:\n" + "\n\n---\n\n".join(context_parts) +
        f"\n\nQuestion: {query}\n\nAnswer:"
    )
    return prompt


def main():
    # Sample documents
    documents = [
        "The company's Q3 revenue was $4.2 billion, a 15% increase year-over-year. "
        "Operating margin expanded to 28% from 24% last year. The cloud services division "
        "grew 35% and now represents 40% of total revenue. Customer acquisition cost decreased "
        "by 10% while lifetime value increased by 20%.",

        "The new authentication system uses OAuth 2.0 with PKCE for public clients. "
        "Access tokens expire after 1 hour and refresh tokens after 30 days. "
        "Multi-factor authentication is required for admin accounts. "
        "Rate limiting is set to 1000 requests per minute per user.",

        "The deployment pipeline runs automated tests, builds Docker images, "
        "pushes to the container registry, and deploys to Kubernetes. "
        "Blue-green deployment ensures zero downtime. Rollback takes approximately "
        "2 minutes if issues are detected during the canary phase.",
    ]

    # Build index
    store = build_rag_pipeline(documents, chunk_size=50, overlap=10)
    print(f"Indexed {len(store.documents)} chunks from {len(documents)} documents\n")

    # Query
    query = "What was the Q3 revenue growth?"
    print(f"Query: {query}")
    prompt = rag_query(store, query)
    print(f"\nConstructed Prompt:\n{prompt[:500]}...")

    # Show retrieval scores
    results = store.search(query, top_k=3)
    print(f"\nRetrieval Scores:")
    for score, doc in results:
        print(f"  {score:.3f} - {doc['text'][:60]}...")


if __name__ == "__main__":
    main()
