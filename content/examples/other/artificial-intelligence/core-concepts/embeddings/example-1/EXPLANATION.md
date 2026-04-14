# Embedding Similarity and Search

## How to Run

```bash
python demo.py
```

No external dependencies required. Uses only Python standard library (`math`, `typing`, `hashlib`).

## What This Demonstrates

This example demonstrates the fundamental operations of vector embeddings: computing cosine similarity between embedding vectors, performing semantic search by ranking documents based on vector similarity to a query, and comparing three different similarity metrics (cosine, Euclidean distance, dot product) for measuring vector proximity.

## Code Walkthrough

### Key Functions

- **`cosine_similarity(a, b)`**: Computes the cosine of the angle between two vectors as `(a . b) / (||a|| * ||b||)`. Returns a value in [-1, 1] for normalized vectors, where 1 means identical direction.
- **`euclidean_distance(a, b)`**: Computes the straight-line distance between two vectors. Lower values indicate closer vectors.
- **`dot_product(a, b)`**: Computes the raw dot product. For L2-normalized vectors, this equals cosine similarity.
- **`normalize(v)`**: L2-normalizes a vector by dividing each component by the vector's magnitude.
- **`simulate_embedding(text, dim)`**: Generates a deterministic 8-dimensional embedding from text using SHA-256 hashing. Produces reproducible vectors for the same input text.
- **`semantic_search(query, documents, top_k)`**: Embeds the query and all documents, computes cosine similarity for each document-query pair, sorts by similarity descending, and returns the top-k results.

### Execution Flow

1. **`main()`** defines five text sentences spanning royal/leadership themes, animal activity, and furniture.
2. **Similarity Matrix**: Computes pairwise cosine similarities for the first three sentences, showing that semantically related texts ("king ruled kingdom" and "queen governed realm") have higher similarity than unrelated pairs.
3. **Semantic Search**: Searches for "royal leader of a nation" against the five documents. Results show the top 3 most semantically similar documents, with royal/leadership content ranking highest.
4. **Metric Comparison**: Compares cosine similarity, Euclidean distance, and dot product for two pairs: king-queen (semantically related) and king-table (unrelated). Shows how different metrics capture different aspects of vector proximity.

### Important Variables

- `dim = 8`: Embedding dimension for the simulated embeddings (production embeddings use 384-1536+ dimensions).
- `top_k = 3`: Number of results returned by semantic search.
- Hash-based embedding: deterministic but not semantically meaningful -- production systems use trained neural network encoders.

## Key Takeaways

- Cosine similarity is the standard metric for embedding comparison because it measures directional alignment regardless of vector magnitude, making it robust for text embeddings of varying lengths.
- Semantic search works by embedding both queries and documents in the same vector space, then retrieving documents closest to the query vector.
- For L2-normalized vectors, cosine similarity and dot product are mathematically equivalent -- many vector databases use dot product for computational efficiency.
- Euclidean distance measures absolute position difference, which is less useful for text embeddings where magnitude varies with document length.
- Production semantic search systems use trained embedding models (e.g., text-embedding-ada-002, BGE, E5) that capture genuine semantic relationships, unlike the hash-based simulation here.
