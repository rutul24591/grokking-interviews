"""
Example 2: Embedding Dimensionality Reduction Analysis

Demonstrates:
- Impact of dimensionality on embedding quality
- PCA for reducing embedding dimensions
- Trade-off between storage cost and retrieval quality
"""

import math
from typing import List, Tuple


def generate_random_embedding(dim: int, seed: int) -> List[float]:
    """Generate a deterministic random embedding."""
    import hashlib
    h = hashlib.sha256(str(seed).encode()).hexdigest()
    vec = []
    for i in range(0, min(dim * 4, len(h) - 3), 4):
        val = int(h[i:i+4], 16) / 65535.0 - 0.5
        vec.append(val)
    # Pad if needed
    while len(vec) < dim:
        vec.append(0.0)
    # Normalize
    norm = math.sqrt(sum(x * x for x in vec))
    if norm > 0:
        vec = [x / norm for x in vec]
    return vec


def cosine_similarity(a: List[float], b: List[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    return dot / (norm_a * norm_b) if norm_a and norm_b else 0.0


def reduce_dimensions_pca(embeddings: List[List[float]], target_dim: int) -> List[List[float]]:
    """Simplified PCA: keep first target_dim components."""
    # In production: use sklearn.decomposition.PCA
    return [vec[:target_dim] for vec in embeddings]


def evaluate_dimensionality(
    original_dim: int,
    target_dims: List[int],
    n_pairs: int = 50,
) -> List[Dict]:
    """Evaluate quality loss at different dimensionalities."""
    # Generate embeddings
    embeddings = [generate_random_embedding(original_dim, i) for i in range(n_pairs * 2)]

    # Compute original similarities
    original_sims = []
    for i in range(0, len(embeddings), 2):
        sim = cosine_similarity(embeddings[i], embeddings[i + 1])
        original_sims.append(sim)

    results = []
    for target_dim in target_dims:
        reduced = reduce_dimensions_pca(embeddings, target_dim)
        reduced_sims = []
        for i in range(0, len(reduced), 2):
            sim = cosine_similarity(reduced[i], reduced[i + 1])
            reduced_sims.append(sim)

        # Measure correlation with original
        mean_diff = sum(abs(o - r) for o, r in zip(original_sims, reduced_sims)) / len(original_sims)

        # Storage comparison
        original_storage = original_dim * 4  # float32 = 4 bytes
        reduced_storage = target_dim * 4
        storage_savings = (1 - reduced_storage / original_storage) * 100

        results.append({
            "dimension": target_dim,
            "mean_similarity_diff": round(mean_diff, 4),
            "storage_bytes": reduced_storage,
            "storage_savings_pct": round(storage_savings, 1),
            "quality_retention_pct": round((1 - mean_diff) * 100, 1),
        })

    return results


def main():
    print("=== Embedding Dimensionality Reduction ===\n")

    original_dim = 1536
    target_dims = [768, 384, 256, 128, 64]

    results = evaluate_dimensionality(original_dim, target_dims)

    print(f"Original dimension: {original_dim}")
    print(f"Original storage: {original_dim * 4} bytes per embedding\n")

    print(f"{'Dim':>6} | {'Storage':>8} | {'Savings':>8} | {'Quality':>8} | {'Sim Diff':>9}")
    print("-" * 55)

    for r in results:
        print(f"{r['dimension']:>6} | {r['storage_bytes']:>6}B  | {r['storage_savings_pct']:>6.1f}% | {r['quality_retention_pct']:>6.1f}% | {r['mean_similarity_diff']:>9.4f}")

    print(f"\nRecommendation:")
    best = max(results, key=lambda x: x["quality_retention_pct"] - (100 - x["storage_savings_pct"]) * 0.3)
    print(f"  Best balance: {best['dimension']} dimensions ({best['quality_retention_pct']}% quality, {best['storage_savings_pct']}% savings)")


if __name__ == "__main__":
    main()
