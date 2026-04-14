# Example 2: Hybrid Search — Combining Vector and Keyword Search

## How to Run

```bash
python demo.py
```

**Dependencies:** Standard library only (`math`, `typing`). No external packages required.

## What This Demonstrates

This example demonstrates **hybrid search** that combines vector similarity (semantic matching) with BM25 keyword search (exact term matching), fused using Reciprocal Rank Fusion (RRF). It shows why vector search alone can miss exact matches (like error codes "AUTH-401") and why keyword search alone misses semantic matches (like "token" matching "authentication system"). The hybrid approach captures both, improving retrieval recall for RAG systems where queries contain both semantic intent and specific terminology.

## Code Walkthrough

### Key Functions

- **`simple_bm25()`**: A simplified implementation of the BM25 ranking algorithm for keyword search:
  - Takes a list of query terms and a list of documents.
  - For each document, computes a score based on term frequency (TF) and inverse document frequency (IDF) for each query term.
  - The BM25 formula: `IDF * (TF * (k1 + 1)) / (TF + k1 * (1 - b + b * doc_len / avg_len))` where `k1` controls TF saturation and `b` controls length normalization.
  - Returns documents sorted by score in descending order.
- **`reciprocal_rank_fusion()`**: Combines two ranked result lists using RRF:
  - For each document in either list, adds `1 / (k + rank + 1)` to its combined score (where `k=60` is the standard RRF constant).
  - Documents appearing in both lists get boosted from both signals.
  - Returns documents sorted by combined RRF score.
- **Simulated vector search results**: Rather than computing real vector similarities, the example uses pre-defined scores that reflect expected behavior — vector search semantically connects "token" to "authentication system" but ranks the specific "AUTH-401" error code document lower.

### Execution Flow (Step-by-Step)

1. **Define documents**: Five documents covering authentication protocols, rate limiting, error codes, CI/CD pipeline, and payment processing.
2. **Define query**: "AUTH-401 error token" — contains both a specific error code (exact match needed) and generic terms (semantic match possible).
3. **Vector search**: Simulated results show vector search ranks the "authentication system" document first (semantically related to "token") and the "AUTH-401" document second (partial match on "token").
4. **BM25 keyword search**: `simple_bm25()` computes keyword scores. The "AUTH-401" document ranks first because it contains the exact term "AUTH-401" that no other document has.
5. **RRF fusion**: `reciprocal_rank_fusion()` combines both result lists. The "AUTH-401" document gets the highest combined score because it ranks #1 in keyword search and #2 in vector search.
6. **Print analysis**: Shows that hybrid search correctly ranks the AUTH-401 document first by combining both signals, while vector search alone would have ranked it second and keyword search alone would have missed semantic connections.

### Important Variables

- `k1` and `b` (in `simple_bm25()`): BM25 hyperparameters. `k1=1.5` controls term frequency saturation (higher = less saturation), `b=0.75` controls document length normalization (higher = stronger penalty for long documents).
- `k=60` (in `reciprocal_rank_fusion()`): The RRF smoothing constant. The standard value of 60 balances the contribution of top-ranked vs. lower-ranked results.
- `query_terms`: The query split into individual terms — BM25 scores each term independently and sums the results.

## Key Takeaways

- **Vector search misses exact matches**: Embedding models capture semantic meaning but can fail on specific identifiers like error codes ("AUTH-401"), version numbers, or unique product names that have no semantic equivalent in the index.
- **Keyword search misses semantics**: BM25 finds exact term matches but cannot connect "authentication" to "token" or "OAuth" — it treats unrelated words as completely dissimilar even when they are semantically related.
- **RRF is the standard fusion method**: Reciprocal Rank Fusion is widely used (including in production search engines) because it is parameter-light (just k), works across different scoring scales, and naturally boosts documents that appear in both result lists.
- **Hybrid search improves recall**: By combining both approaches, the system catches documents that either method alone would rank lower — this is why production RAG systems (including major LLM providers) use hybrid search by default.
- **BM25 parameters matter**: The `k1` and `b` parameters control how BM25 weighs term frequency and document length. Tuning these for your specific corpus can significantly improve keyword search quality.
