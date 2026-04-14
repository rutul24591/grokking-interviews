# Embedding-Based Document Clustering

## How to Run

```bash
python demo.py
```

No external dependencies required. Uses only Python standard library (`math`, `typing`, `hashlib`, `collections`, `random`).

## What This Demonstrates

This example implements k-means clustering on document embeddings to automatically group semantically similar documents. It evaluates different cluster counts (k=2 through k=6) to find the optimal number of clusters, then interprets the resulting cluster assignments to show how documents group by topic.

## Code Walkthrough

### Key Functions

- **`cosine_similarity(a, b)`**: Standard cosine similarity between two vectors.
- **`generate_embedding(text, dim)`**: Simulates an 8-dimensional embedding from text using SHA-256 hashing, normalized to unit length.
- **`kmeans_cluster(embeddings, k, max_iters)`**: Implements the k-means algorithm:
  1. **Initialize**: Randomly selects k embeddings as initial centroids (seeded with `random.seed(42)` for reproducibility).
  2. **Assign**: Each embedding is assigned to the cluster with the highest cosine similarity to its centroid.
  3. **Update**: Centroids are recomputed as the mean of all assigned embeddings, then L2-normalized.
  4. **Iterate**: Steps 2-3 repeat for `max_iters` (20) iterations.
- **`evaluate_clusters(embeddings, assignments, centroids)`**: Computes the average intra-cluster similarity (how close each document is to its cluster's centroid). Higher values indicate tighter, more coherent clusters.

### Execution Flow

1. **`main()`** defines 16 documents across 4 clear topic groups: Technology (4 docs), Finance (4 docs), Health (4 docs), and Sports (4 docs).
2. Embeddings are generated for all documents (8 dimensions each).
3. K-means is run for k=2 through k=6, with the average intra-cluster similarity score printed for each.
4. The best k is selected as the one with the highest score.
5. Final clustering with the optimal k shows which documents are grouped together.

### Important Variables

- `k` range (2-7): Number of clusters evaluated.
- `max_iters = 20`: Maximum k-means iterations per run.
- `random.seed(42)`: Ensures reproducible centroid initialization.
- `dim = 8`: Simulated embedding dimension.

## Key Takeaways

- K-means clustering on embeddings automatically discovers topical groupings without requiring manual labels or predefined categories.
- Evaluating multiple k values helps identify the natural number of clusters in the data -- the optimal k often matches the true number of topic groups.
- Cosine similarity is the appropriate distance metric for normalized embeddings, as it measures directional alignment rather than absolute position.
- In production, document clustering is used for content organization, topic discovery, anomaly detection, and dataset analysis.
- Simple k-means has limitations: it assumes spherical clusters of equal size. Production systems may use DBSCAN, HDBSCAN, or hierarchical clustering for more complex cluster shapes.
