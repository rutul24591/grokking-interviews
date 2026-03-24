## Why caching belongs in the facade

Aggregated endpoints are often:
- expensive (fan-out)
- latency-sensitive (dashboards)

Centralizing caching in the facade:
- reduces repeated upstream load
- makes UI simpler (no per-call caching logic)

Trade-offs:
- stale data
- cache invalidation complexity
- per-user caches need careful keying and privacy boundaries

