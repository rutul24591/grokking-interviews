# Embedding Dimensionality Reduction Analysis

## How to Run

```bash
python demo.py
```

No external dependencies required. Uses only Python standard library (`math`, `typing`, `hashlib`).

## What This Demonstrates

This example analyzes the trade-off between embedding dimensionality and retrieval quality by simulating PCA-based dimensionality reduction. It measures how reducing embeddings from 1536 dimensions to lower values (768, 384, 256, 128, 64) affects similarity preservation and storage costs, then recommends an optimal balance.

## Code Walkthrough

### Key Functions

- **`generate_random_embedding(dim, seed)`**: Generates a deterministic random embedding of the specified dimension using SHA-256 hashing. The vector is L2-normalized.
- **`cosine_similarity(a, b)`**: Standard cosine similarity computation between two vectors.
- **`reduce_dimensions_pca(embeddings, target_dim)`**: Simplified PCA that truncates vectors to their first `target_dim` components. In production, sklearn's PCA would compute the optimal projection.
- **`evaluate_dimensionality(original_dim, target_dims, n_pairs)`**: The core evaluation function. Generates pairs of embeddings, computes their original similarities, then measures similarity preservation after dimensionality reduction.

### Evaluation Metrics

1. **Mean Similarity Difference**: Average absolute difference between original and reduced pairwise similarities. Lower is better.
2. **Storage Savings**: Percentage reduction in bytes per embedding (each float32 = 4 bytes).
3. **Quality Retention**: `(1 - mean_similarity_diff) * 100` -- percentage of original similarity quality preserved after reduction.

### Execution Flow

1. **`main()`** sets the original dimension to 1536 (matching OpenAI's ada-002) and evaluates five target dimensions.
2. For each target dimension, it generates 100 embeddings (50 pairs), computes original similarities, reduces dimensions, computes reduced similarities, and measures the quality loss.
3. Results are printed in a table showing dimension, storage in bytes, savings percentage, quality retention, and similarity difference.
4. A recommendation is computed by balancing quality retention against storage savings (weighted at 0.3), selecting the dimension with the best combined score.

### Important Variables

- `original_dim = 1536`: Starting dimension (OpenAI ada-002 size).
- `original_storage = 1536 * 4 = 6144 bytes`: Original storage per embedding.
- Recommendation formula: `quality_retention - (100 - storage_savings) * 0.3` -- balances quality preservation against storage savings.

## Key Takeaways

- Reducing embedding dimensions saves storage proportionally (64 dimensions = 96% storage savings vs 1536), but at the cost of similarity quality degradation.
- The quality-storage trade-off is not linear: moderate reductions (to 384 or 256 dimensions) often retain most of the similarity information while cutting storage by 75-83%.
- PCA-based reduction preserves the most variance in the retained dimensions, making it superior to random truncation.
- For production vector databases, dimensionality reduction directly impacts memory requirements and query latency -- smaller vectors mean more vectors fit in RAM.
- The optimal reduction point depends on the use case: semantic search may tolerate more quality loss than precision-critical applications like deduplication.
