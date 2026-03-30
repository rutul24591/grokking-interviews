# Offline-first Example 1 — Architecture notes

This example implements a classic **offline-first write path**:

- **Local source of truth**: IndexedDB stores the document.
- **Outbox**: every local write enqueues a mutation (append-only).
- **Sync loop**: drains the outbox when the network is available.
- **Idempotency**: each mutation has an `idempotencyKey` so retries don’t duplicate writes.
- **Optimistic concurrency**: the client sends `baseServerVersion`; the server returns `409` when it detects divergence.

Trade-offs and interview discussion points:
- Outbox makes writes resilient but requires careful replay, dedupe, and ordering.
- Conflict handling is *the* hard part; this example only detects and surfaces conflicts.
- Server-side storage here is in-memory for simplicity; production uses durable storage and a real idempotency store.

