"""
Example 1: Embedding Similarity and Search

Demonstrates:
- Computing cosine similarity between embeddings
- Semantic search using vector similarity
- Comparing similarity metrics (cosine, euclidean, dot product)
"""

import math
from typing import List, Tuple, Dict


def cosine_similarity(a: List[float], b: List[float]) -> float:
    """Compute cosine similarity between two vectors."""
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


def euclidean_distance(a: List[float], b: List[float]) -> float:
    """Compute Euclidean distance between two vectors."""
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))


def dot_product(a: List[float], b: List[float]) -> float:
    """Compute dot product between two vectors."""
    return sum(x * y for x, y in zip(a, b))


def normalize(v: List[float]) -> List[float]:
    """L2-normalize a vector."""
    norm = math.sqrt(sum(x * x for x in v))
    if norm == 0:
        return v
    return [x / norm for x in v]


def simulate_embedding(text: str, dim: int = 8) -> List[float]:
    """Simulate embedding generation (deterministic hash-based)."""
    import hashlib
    h = hashlib.sha256(text.encode()).hexdigest()
    # Generate deterministic vector from hash
    vec = []
    for i in range(0, dim * 4, 4):
        val = int(h[i:i+4], 16) / 65535.0 - 0.5  # Range: -0.5 to 0.5
        vec.append(val)
    return normalize(vec)


def semantic_search(query: str, documents: List[str], top_k: int = 3) -> List[Tuple[str, float]]:
    """Search for semantically similar documents."""
    query_vec = simulate_embedding(query)
    scored = []
    for doc in documents:
        doc_vec = simulate_embedding(doc)
        score = cosine_similarity(query_vec, doc_vec)
        scored.append((doc, round(score, 4)))
    scored.sort(key=lambda x: x[1], reverse=True)
    return scored[:top_k]


def main():
    print("=== Embedding Similarity & Search ===\n")

    # Similarity comparison
    texts = [
        "The king ruled the kingdom wisely",
        "The queen governed the realm with grace",
        "The dog played in the park",
        "The wooden table was made of oak",
        "The prince inherited the throne",
    ]

    print("Cosine Similarity Matrix:")
    print(f"{'':>40}", end="")
    for t in texts[:3]:
        print(f"{t[:15]:>18}", end="")
    print()

    for i, t1 in enumerate(texts[:3]):
        print(f"{t1[:40]:>40}", end="")
        for j, t2 in enumerate(texts[:3]):
            v1 = simulate_embedding(t1)
            v2 = simulate_embedding(t2)
            sim = cosine_similarity(v1, v2)
            print(f"{sim:>18.4f}", end="")
        print()

    # Semantic search
    print(f"\n=== Semantic Search ===")
    query = "royal leader of a nation"
    results = semantic_search(query, texts, top_k=3)

    print(f"Query: '{query}'")
    print(f"Top {len(results)} results:")
    for i, (doc, score) in enumerate(results, 1):
        print(f"  {i}. (score: {score:.4f}) {doc}")

    # Metric comparison
    print(f"\n=== Similarity Metrics ===")
    v1 = simulate_embedding("king")
    v2 = simulate_embedding("queen")
    v3 = simulate_embedding("table")

    print(f"king ↔ queen:")
    print(f"  Cosine: {cosine_similarity(v1, v2):.4f}")
    print(f"  Euclidean: {euclidean_distance(v1, v2):.4f}")
    print(f"  Dot product: {dot_product(v1, v2):.4f}")

    print(f"king ↔ table:")
    print(f"  Cosine: {cosine_similarity(v1, v3):.4f}")
    print(f"  Euclidean: {euclidean_distance(v1, v3):.4f}")
    print(f"  Dot product: {dot_product(v1, v3):.4f}")


if __name__ == "__main__":
    main()
