# Offline-first Example 3 — Migration pitfalls

IndexedDB migrations run inside `onupgradeneeded` and must be:
- deterministic
- bounded (avoid huge work on the main thread)
- resilient to partial writes (consider chunking + progress markers for very large datasets)

This example shows a safe pattern:
- create stores on initial version
- for later versions, iterate existing rows and backfill new fields

