# Example 1: HNSW Index Implementation (Simplified)

## How to Run

```bash
python demo.py
```

**Dependencies:** Standard library only (`math`, `random`, `typing`). No external packages required.

## What This Demonstrates

This example implements a **simplified Hierarchical Navigable Small World (HNSW) index**, which is the most widely used approximate nearest neighbor algorithm in production vector databases (Milvus, Qdrant, Weaviate, Pinecone). It demonstrates how HNSW builds a multi-layer graph where higher layers enable long-range "highway" navigation and lower layers provide fine-grained local search, achieving sub-linear search complexity compared to brute-force exact search.

## Code Walkthrough

### Key Classes and Data Structures

- **`HNSWNode`**: Represents a node in the HNSW graph. Each node stores:
  - `vector` — the high-dimensional vector being indexed.
  - `id` — unique integer identifier.
  - `level` — the number of graph layers this node participates in (higher-level nodes appear in more layers, acting as "highway hubs").
  - `connections` — a list of lists, where `connections[layer]` contains the neighbor node IDs at that layer.
- **`SimplifiedHNSW`**: The main index implementation with key parameters:
  - `M` — maximum connections per node per layer (controls graph density).
  - `ef_construction` — the beam search width during index construction (higher = better quality but slower indexing).
  - `max_level` — the maximum number of graph layers.
  - Key methods:
    - `_random_level()` — assigns a random level to new nodes using exponential decay (30% chance of going up one level), ensuring few nodes at high layers and many at low layers.
    - `_search_layer()` — performs greedy beam search on a single graph layer, maintaining a candidate list and a result list of the best `ef` neighbors found.
    - `insert()` — inserts a vector by assigning it a level, searching from the top layer down, and connecting it to nearest neighbors at each layer.
    - `search()` — searches by descending from the top layer (using greedy search with `ef=1`) to find the entry point at layer 0, then performing a wider beam search (`ef` parameter) at layer 0.
    - `exact_search()` — brute-force search over all vectors, used as the ground truth for measuring HNSW recall.

### Execution Flow (Step-by-Step)

1. **Generate data**: 1000 random 32-dimensional vectors are created using a Gaussian distribution with seed 42 for reproducibility.
2. **Build index**: A `SimplifiedHNSW` is created with M=16, ef_construction=100. Each vector is inserted, which:
   - Assigns a random level (most nodes at level 0, few at higher levels).
   - Searches from the current entry point down through layers.
   - At each layer the node participates in, connects it to the M nearest neighbors found.
   - Updates the entry point if the new node's level exceeds the current entry point's level.
3. **Measure recall**: 50 random query vectors are generated. For each query:
   - `exact_search()` finds the true top-5 nearest neighbors (brute force).
   - `search()` finds the approximate top-5 using HNSW graph traversal.
   - Recall is computed as the fraction of exact results that appear in HNSW results.
4. **Print results**: Shows index configuration and average Recall@5 across all queries. A recall of 0.95+ indicates production-quality index accuracy.

### Important Variables

- `M=16`: Maximum connections per layer. Higher M means denser graphs with better recall but more memory and slower search.
- `ef_construction=100`: The beam width during index construction. Higher values produce higher-quality graphs (better recall) at the cost of slower indexing.
- `ef=50`: The beam width during search. Higher ef means more thorough search (better recall) but slower queries. This can be tuned at query time independently of construction parameters.
- `_random_level()` probability (0.3): Controls the exponential decay of node levels. With 30% chance of going up one level, approximately 30% of nodes appear at level 1, 9% at level 2, 2.7% at level 3, etc.

## Key Takeaways

- **Multi-layer graph enables sub-linear search**: HNSW's layered structure lets search quickly descend from sparse highway layers to dense local layers, finding nearest neighbors in O(log N) time instead of O(N) brute-force.
- **Trade-off triangle (speed vs. recall vs. memory)**: M controls memory and graph quality, ef_construction controls index build quality, and ef controls search thoroughness. Production systems tune all three based on their SLA requirements.
- **Entry point descent**: Search always starts from the highest layer's entry point and greedily descends — the top layer acts as a global index, middle layers as regional indexes, and layer 0 as the local neighborhood index.
- **Recall measurement**: Comparing HNSW results against exact search is the standard way to measure index quality. Production vector databases typically target 0.95+ recall at acceptable latency.
- **HNSW is approximate, not exact**: The algorithm sacrifices perfect recall for massive speed gains. For 1000 vectors the speedup is modest, but for millions of vectors HNSW is orders of magnitude faster than brute force while maintaining 95%+ recall.
