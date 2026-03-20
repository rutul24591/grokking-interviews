This example simulates an **edge cache** in-memory to make caching behavior observable:
- first request populates the cache (MISS),
- subsequent requests within TTL hit the cache (HIT),
- counters help you reason about load on origin and cache efficiency.

In production, the “edge” is typically a CDN; the same reasoning applies, but you also need to think about cache keys (`Vary`), invalidation, and staleness.

