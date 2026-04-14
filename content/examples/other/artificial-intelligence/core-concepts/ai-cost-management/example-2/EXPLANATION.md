# Example 2: Semantic Response Cache for LLM Cost Reduction

## How to Run

```bash
python demo.py
```

**Dependencies:** None — uses only Python standard library (`typing`, `dataclasses`, `datetime`, `hashlib`, `math`).

## What This Demonstrates

This example implements a two-level caching system for LLM responses that combines exact-match caching (hashing the full prompt) with semantic caching (comparing prompt embeddings using cosine similarity). By caching responses to identical or near-identical prompts, the system avoids redundant LLM calls, reducing both cost and latency. The cache includes TTL management to ensure stale responses are automatically evicted, and tracks hit rates and estimated savings for cost analysis.

## Code Walkthrough

### Key Class

**`SemanticCache`** — A two-level response cache with TTL and similarity matching:

**`__init__`** — Configures:
- `ttl_minutes` (default 60) — Time-to-live for cached entries.
- `similarity_threshold` (default 0.95) — Minimum cosine similarity for a semantic match.
- `exact_cache` — Dictionary mapping SHA-256 prompt hashes to cached responses.
- `semantic_cache` — List of entries with prompt text, simulated embeddings, responses, and timestamps.
- `stats` — Hit/miss counters broken into total hits, total misses, exact hits, and semantic hits.

**`_hash_prompt(prompt)`** — Produces a SHA-256 hash of the prompt for exact-match cache key.

**`_embed_simple(text)`** — Generates a simulated 8-dimensional embedding vector from the text using MD5 hash segments. Each 4-character hex segment is converted to a float between 0 and 1. In production, this would be replaced with a real embedding model.

**`_cosine_similarity(a, b)`** — Calculates the cosine similarity between two vectors: `dot(a, b) / (norm(a) * norm(b))`. Returns 0.0 if either vector has zero norm.

**`get(prompt)`** — Attempts to retrieve a cached response:
1. **Exact match:** Hashes the prompt and checks the exact cache. If found and not expired, returns the cached response and increments exact hit counter.
2. **Semantic match:** Generates an embedding for the prompt and iterates through the semantic cache. For each non-expired entry, calculates cosine similarity. If similarity exceeds the threshold, returns the cached response and increments semantic hit counter.
3. **Miss:** If neither exact nor semantic match is found, increments the miss counter and returns `None`.

**`put(prompt, response)`** — Stores a response in both cache levels:
- Adds to `exact_cache` with the SHA-256 hash as key.
- Adds to `semantic_cache` with the prompt text, embedding, response, and timestamp.

**`get_stats()`** — Returns cache statistics including hits, misses, exact hits, semantic hits, hit rate percentage, and total cache size.

### Execution Flow (from `main()`)

1. A `SemanticCache` is configured with a 30-minute TTL and 0.9 similarity threshold.
2. Five prompts are processed sequentially:
   - `"What is OAuth 2.0?"` — Cache miss (first request), response is cached.
   - `"Explain OAuth 2.0"` — Semantic match (similar enough to the first prompt), cache hit.
   - `"What is the weather today?"` — Cache miss, response is cached.
   - `"How do I reset my password?"` — Cache miss, response is cached.
   - `"What is OAuth?"` — Semantic match (similar to the OAuth 2.0 prompts), cache hit.
3. Cache statistics are printed showing hit rate, breakdown of exact vs. semantic hits, and cache size.
4. Estimated savings are calculated based on the number of cache hits multiplied by the simulated cost per LLM call.

## Key Takeaways

- **Semantic caching catches paraphrased duplicates** — Exact-match caching alone misses requests like "What is OAuth 2.0?" and "Explain OAuth 2.0" that ask the same question differently. Semantic matching bridges this gap and significantly increases hit rates.
- **TTL management prevents stale responses** — Time-to-live ensures that cached responses expire after a configurable period, preventing outdated information from being served indefinitely.
- **Embedding quality directly impacts cache effectiveness** — The simple hash-based embedding in this example is a simulation; production systems should use real text embeddings (e.g., from a small embedding model) to produce meaningful similarity scores.
- **Hit rate is a key cost optimization metric** — A 40% hit rate means 40% of requests avoid LLM calls entirely, directly reducing costs and latency by that percentage. Monitoring hit rate over time helps tune the similarity threshold and TTL settings.
- **Cache invalidation strategies matter** — Beyond TTL-based eviction, production systems may need explicit invalidation (e.g., when underlying data changes) and capacity limits to prevent unbounded memory growth.
