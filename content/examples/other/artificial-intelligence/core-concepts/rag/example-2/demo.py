"""
Example 2: Hybrid Search — Combining Vector and Keyword Search

Demonstrates:
- Vector similarity search (semantic matching)
- BM25 keyword search (exact term matching)
- Reciprocal Rank Fusion for combining results
- How hybrid search catches what vector search misses
"""

import math
from typing import List, Dict, Tuple


def simple_bm25(query_terms: List[str], documents: List[str], k1: float = 1.5, b: float = 0.75) -> List[Tuple[float, int]]:
    """Simplified BM25 keyword scoring."""
    scores = []
    avg_len = sum(len(d.split()) for d in documents) / max(len(documents), 1)

    for i, doc in enumerate(documents):
        doc_len = len(doc.split())
        doc_lower = doc.lower()
        score = 0.0
        for term in query_terms:
            term_lower = term.lower()
            # Term frequency
            tf = doc_lower.count(term_lower)
            # IDF (simplified)
            doc_count_with_term = sum(1 for d in documents if term_lower in d.lower())
            idf = math.log((len(documents) - doc_count_with_term + 0.5) / (doc_count_with_term + 0.5) + 1)
            # BM25 formula
            score += idf * (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * doc_len / avg_len))
        scores.append((score, i))
    return sorted(scores, reverse=True)


def reciprocal_rank_fusion(vector_results: List[Tuple[float, int]], keyword_results: List[Tuple[float, int]], k: int = 60) -> List[Tuple[float, int]]:
    """Combine results using Reciprocal Rank Fusion."""
    combined_scores: Dict[int, float] = {}

    for rank, (score, doc_id) in enumerate(vector_results):
        combined_scores[doc_id] = combined_scores.get(doc_id, 0) + 1 / (k + rank + 1)

    for rank, (score, doc_id) in enumerate(keyword_results):
        combined_scores[doc_id] = combined_scores.get(doc_id, 0) + 1 / (k + rank + 1)

    return sorted(combined_scores.items(), key=lambda x: x[1], reverse=True)


def main():
    documents = [
        "The authentication system supports OAuth 2.0 and SAML 2.0 protocols.",
        "Rate limiting is configured at 1000 requests per minute for the API gateway.",
        "Error code AUTH-401 indicates an expired or invalid access token.",
        "The CI/CD pipeline runs integration tests before deploying to staging.",
        "Payment processing uses Stripe API with webhook callbacks for confirmation.",
    ]

    # Query with specific term
    query = "AUTH-401 error token"
    query_terms = query.split()

    # Vector search (simulated)
    print("=== Hybrid Search Example ===")
    print(f"Query: '{query}'\n")

    # Simulated vector search results (semantic similarity)
    # Vector search finds "authentication system" as semantically related
    # but misses the specific error code "AUTH-401"
    vector_results = [
        (0.85, 0),  # "authentication system" (semantically related to "token")
        (0.72, 2),  # "access token" (partial match)
        (0.65, 1),  # "rate limiting" (weak semantic match)
        (0.58, 4),  # "payment processing" (weak match)
        (0.45, 3),  # "CI/CD pipeline" (no match)
    ]

    # Keyword search (BM25)
    keyword_results = simple_bm25(query_terms, documents)

    print("Vector Search Results (semantic):")
    for rank, (score, idx) in enumerate(vector_results[:3]):
        print(f"  {rank+1}. (score={score:.3f}) {documents[idx][:70]}...")

    print("\nKeyword Search Results (BM25):")
    for rank, (score, idx) in enumerate(keyword_results[:3]):
        print(f"  {rank+1}. (score={score:.3f}) {documents[idx][:70]}...")

    # Hybrid fusion
    fused = reciprocal_rank_fusion(vector_results, keyword_results)

    print("\nHybrid Search Results (RRF fusion):")
    for rank, (doc_id, score) in enumerate(fused[:3]):
        print(f"  {rank+1}. (RRF score={score:.4f}) {documents[doc_id][:70]}...")

    # Analysis
    print(f"\n=== Analysis ===")
    print("Vector search ranks AUTH-401 doc at #2 (semantic match on 'token')")
    print("Keyword search ranks AUTH-401 doc at #1 (exact match on 'AUTH-401')")
    print("Hybrid search ranks AUTH-401 doc at #1 (combined signal)")
    print("\nKey insight: Hybrid search catches both semantic AND exact matches")


if __name__ == "__main__":
    main()
