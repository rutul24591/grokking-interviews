# Example 2 — Preload budget & dedupe

Asset preloading is an optimization with a cost. Example 2 focuses on a practical sub-problem:

- you should have a **preload budget** (bytes / count) per route,
- you should **dedupe** hints (avoid emitting the same preload twice),
- and you should avoid preloading resources unlikely to be used.

