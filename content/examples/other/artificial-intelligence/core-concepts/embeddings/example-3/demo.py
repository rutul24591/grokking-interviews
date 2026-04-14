"""
Example 3: Embedding-Based Document Clustering

Demonstrates:
- Simple k-means clustering using embeddings
- Finding optimal number of clusters
- Interpreting cluster contents
"""

import math
from typing import List, Dict, Tuple
from collections import defaultdict


def cosine_similarity(a: List[float], b: List[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    return dot / (norm_a * norm_b) if norm_a and norm_b else 0.0


def generate_embedding(text: str, dim: int = 8) -> List[float]:
    """Simulate embedding generation."""
    import hashlib
    h = hashlib.sha256(text.encode()).hexdigest()
    vec = []
    for i in range(0, dim * 4, 4):
        vec.append(int(h[i:i+4], 16) / 65535.0 - 0.5)
    norm = math.sqrt(sum(x * x for x in vec))
    return [x / norm for x in vec] if norm > 0 else vec


def kmeans_cluster(
    embeddings: List[List[float]],
    k: int,
    max_iters: int = 20,
) -> Tuple[List[List[float]], List[int]]:
    """Simple k-means clustering."""
    import random
    random.seed(42)

    # Initialize centroids randomly
    centroids = [random.choice(embeddings) for _ in range(k)]

    for _ in range(max_iters):
        # Assign points to nearest centroid
        assignments = []
        for emb in embeddings:
            sims = [cosine_similarity(emb, c) for c in centroids]
            assignments.append(sims.index(max(sims)))

        # Update centroids
        new_centroids = []
        for i in range(k):
            cluster_points = [embeddings[j] for j in range(len(embeddings)) if assignments[j] == i]
            if cluster_points:
                centroid = [sum(p[d] for p in cluster_points) / len(cluster_points) for d in range(len(cluster_points[0]))]
                # Normalize
                norm = math.sqrt(sum(x * x for x in centroid))
                if norm > 0:
                    centroid = [x / norm for x in centroid]
                new_centroids.append(centroid)
            else:
                new_centroids.append(centroids[i])

        centroids = new_centroids

    return centroids, assignments


def evaluate_clusters(
    embeddings: List[List[float]],
    assignments: List[int],
    centroids: List[List[float]],
) -> float:
    """Evaluate cluster quality (average intra-cluster similarity)."""
    cluster_sims = defaultdict(list)
    for i, emb in enumerate(embeddings):
        cluster_sims[assignments[i]].append(cosine_similarity(emb, centroids[assignments[i]]))

    avg_sim = sum(sum(sims) / len(sims) for sims in cluster_sims.values()) / len(cluster_sims)
    return round(avg_sim, 4)


def main():
    # Sample documents with clear topic groups
    documents = [
        # Technology
        "Machine learning algorithms improve with more training data",
        "Deep learning neural networks process images and text",
        "Natural language processing enables chatbots and translation",
        "Computer vision systems detect objects in photographs",
        # Finance
        "Stock market prices fluctuate based on investor sentiment",
        "Interest rates affect mortgage payments and savings",
        "Cryptocurrency Bitcoin uses blockchain technology",
        "Portfolio diversification reduces investment risk",
        # Health
        "Regular exercise improves cardiovascular health",
        "Balanced diet with vegetables supports immune system",
        "Sleep quality affects cognitive performance and mood",
        "Mental health awareness reduces stigma around therapy",
        # Sports
        "Football teams practice strategies before the season",
        "Olympic athletes train for years to compete",
        "Basketball requires teamwork and quick decision making",
        "Marathon runners build endurance through gradual training",
    ]

    print("=== Embedding-Based Document Clustering ===\n")

    # Generate embeddings
    embeddings = [generate_embedding(doc, dim=8) for doc in documents]

    # Try different k values
    print("Finding optimal number of clusters:")
    best_k, best_score = 2, 0
    for k in range(2, 7):
        centroids, assignments = kmeans_cluster(embeddings, k)
        score = evaluate_clusters(embeddings, assignments, centroids)
        print(f"  k={k}: avg intra-cluster similarity = {score:.4f}")
        if score > best_score:
            best_k, best_score = k, score

    # Final clustering
    centroids, assignments = kmeans_cluster(embeddings, best_k)
    print(f"\nOptimal k: {best_k} (score: {best_score:.4f})")

    print(f"\nClusters:")
    clusters = defaultdict(list)
    for i, cluster_id in enumerate(assignments):
        clusters[cluster_id].append(documents[i])

    for cluster_id, docs in sorted(clusters.items()):
        print(f"\n  Cluster {cluster_id + 1} ({len(docs)} documents):")
        for doc in docs:
            print(f"    - {doc}")


if __name__ == "__main__":
    main()
