# Example 2: Similarity Metrics Comparison

## How to Run

```bash
python demo.py
```

**Dependencies:** Standard library only (`math`, `typing`). No external packages required.

## What This Demonstrates

This example compares three fundamental **vector similarity metrics** — cosine similarity, Euclidean distance, and dot product — showing how each metric ranks the same set of documents against a query vector differently. The choice of similarity metric is a critical design decision in vector databases because it determines which documents are considered "close" to a query, directly affecting retrieval quality in RAG systems, recommendation engines, and semantic search applications.

## Code Walkthrough

### Key Functions

- **`cosine_similarity()`**: Computes the cosine of the angle between two vectors: `dot(a, b) / (norm(a) * norm(b))`. Returns a value between -1.0 (opposite directions) and 1.0 (identical directions). Key property: it is **magnitude-invariant** — vectors pointing in the same direction get a score of 1.0 regardless of their length.
- **`euclidean_distance()`**: Computes the straight-line distance between two vectors: `sqrt(sum((a_i - b_i)^2))`. Returns a non-negative value where 0.0 means identical vectors. Key property: it is **magnitude-sensitive** — vectors in the same direction but different lengths are distinguished by their distance.
- **`dot_product()`**: Computes the raw dot product: `sum(a_i * b_i)`. Returns a value that scales with both the angle and the magnitude of the vectors. Key property: it is **magnitude-amplifying** — longer vectors in the same direction produce higher scores.
- **`normalize()`**: Converts a vector to unit length by dividing each component by the vector's L2 norm. After normalization, dot product equals cosine similarity.

### Execution Flow (Step-by-Step)

1. **Define query and documents**: A query vector `[1.0, 2.0, 3.0]` is compared against four test documents:
   - `same_direction_short` — `[0.5, 1.0, 1.5]` (half the magnitude, same direction).
   - `identical` — `[1.0, 2.0, 3.0]` (exact copy).
   - `different_direction` — `[3.0, 2.0, 1.0]` (same magnitude, different direction).
   - `same_direction_long` — `[2.0, 4.0, 6.0]` (double the magnitude, same direction).
2. **Compute all metrics**: For each document, all three metrics are computed and displayed in a formatted table.
3. **Observe differences**:
   - **Cosine similarity**: Returns 1.0 for both short and long vectors in the same direction (magnitude doesn't matter). Returns ~0.71 for the different-direction vector (45-degree angle).
   - **Euclidean distance**: Returns 0.0 for the identical vector, 1.304 for the short vector, 2.605 for the long vector, and 2.828 for the different-direction vector. Distinguishes by both direction and magnitude.
   - **Dot product**: Returns 14.0 for the identical vector, 5.25 for the short vector, 56.0 for the long vector, and 10.0 for the different-direction vector. Amplifies by magnitude.
4. **Print key observations and recommendations**: Explains when to use each metric based on embedding type.

### Important Variables

- `query = [1.0, 2.0, 3.0]`: The reference vector against which all documents are scored.
- `doc_short`, `doc_long`: Demonstrate that cosine treats them identically (both 1.0) while Euclidean and dot product distinguish them.
- `doc_diff`: Demonstrates that cosine still gives a moderate score (0.71) for a different-direction vector because the angle is not 180 degrees.

## Key Takeaways

- **Cosine similarity is direction-only**: It ignores vector magnitude, making it ideal for text embeddings (OpenAI, Cohere) where the direction encodes semantic meaning and magnitude is an artifact of the embedding process.
- **Euclidean distance captures both direction and magnitude**: It is appropriate when vector length carries meaningful information, such as image feature vectors where intensity matters.
- **Dot product is magnitude-amplified**: It combines direction and magnitude multiplicatively, making it useful when vectors are pre-normalized (in which case it equals cosine similarity) or when magnitude should influence ranking (e.g., TF-IDF vectors).
- **Metric choice affects retrieval results**: The same query against the same index can return different top-k results depending on the metric. Production vector databases must support multiple metrics to accommodate different embedding types.
- **Pre-normalization makes dot product = cosine**: If all vectors are L2-normalized, dot product and cosine similarity produce identical rankings, which is why some systems (like FAISS) normalize vectors at indexing time and use dot product for faster computation.
