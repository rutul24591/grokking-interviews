This example is a focused, reusable **LRU cache** implementation with:
- a hard memory cap in bytes
- TTL eviction
- recency updates on reads

In production you usually add:
- admission control (avoid caching one-hit wonders)
- per-tenant quotas
- instrumentation (hit rate, evictions, size)

