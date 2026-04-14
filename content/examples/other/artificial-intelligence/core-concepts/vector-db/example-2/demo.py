"""
Example 2: Similarity Metrics Comparison

Demonstrates:
- Cosine similarity vs Euclidean distance vs Dot Product
- How metric choice affects search results
- When to use each metric
"""

import math
from typing import List


def cosine_similarity(a: List[float], b: List[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    return dot / (norm_a * norm_b) if norm_a and norm_b else 0.0


def euclidean_distance(a: List[float], b: List[float]) -> float:
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))


def dot_product(a: List[float], b: List[float]) -> float:
    return sum(x * y for x, y in zip(a, b))


def normalize(v: List[float]) -> List[float]:
    norm = math.sqrt(sum(x * x for x in v))
    return [x / norm for x in v] if norm else v


def main():
    # Example vectors
    query = [1.0, 2.0, 3.0]
    doc_short = [0.5, 1.0, 1.5]  # Same direction, shorter magnitude
    doc_same = [1.0, 2.0, 3.0]    # Identical
    doc_diff = [3.0, 2.0, 1.0]    # Different direction
    doc_long = [2.0, 4.0, 6.0]    # Same direction, longer magnitude

    docs = [
        ("same_direction_short", doc_short),
        ("identical", doc_same),
        ("different_direction", doc_diff),
        ("same_direction_long", doc_long),
    ]

    print("=== Similarity Metrics Comparison ===")
    print(f"Query: {query}\n")

    print(f"{'Document':<25} {'Cosine':>8} {'Euclidean':>10} {'Dot Product':>12}")
    print("-" * 60)

    for name, doc in docs:
        cos = cosine_similarity(query, doc)
        euc = euclidean_distance(query, doc)
        dot = dot_product(query, doc)
        print(f"{name:<25} {cos:>8.4f} {euc:>10.4f} {dot:>12.4f}")

    print("\n=== Key Observations ===")
    print("1. Cosine similarity is identical for short and long vectors in the")
    print("   same direction (both = 1.0) — it only measures angle, not magnitude.")
    print("2. Euclidean distance correctly distinguishes short vs long vectors")
    print("   in the same direction (1.304 vs 2.605).")
    print("3. Dot product distinguishes by magnitude (14.0 vs 56.0 for same direction).")
    print("\n=== When to Use Each ===")
    print("Cosine: Text embeddings (OpenAI, Cohere) — direction matters, not length")
    print("Euclidean: When magnitude carries meaning (e.g., image features)")
    print("Dot Product: When vectors are pre-normalized (equals cosine)")


if __name__ == "__main__":
    main()
