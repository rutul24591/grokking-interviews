# Service Workers Example 2 — Reason about strategies without a browser

This simulator helps you explain (and compare) strategies in interviews:

- **cache-first**: fast after warm cache, but can go stale
- **network-first**: fresher data, but worse offline behavior
- **stale-while-revalidate**: fast + eventually fresh, but may show briefly stale data

In production, the “right” choice depends on:
- request type (navigation vs API vs static asset)
- SLOs (latency vs correctness)
- offline tolerance (read-only vs write paths)

