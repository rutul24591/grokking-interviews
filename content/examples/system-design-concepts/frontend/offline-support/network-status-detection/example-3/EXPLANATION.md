# Network Status Detection — Example 3

This example covers a common real-world edge case:

- The browser reports “online”
- DNS/TLS/proxy/dependency failures still cause request errors

Mitigations shown:
- **client-side circuit breaker** to fail fast during outages
- **request queueing** to preserve user intent and retry later

In production you’d typically:
- bound queue size and TTL (avoid infinite growth)
- store queued mutations in IndexedDB (not localStorage) for larger payloads
- add idempotency keys for replay safety

