# Offline-first Example 2 — Why retries need idempotency

Offline-first sync loops almost always include retries:
- transient 500s
- timeouts
- flaky networks

Without idempotency:
- a retry can apply the same mutation multiple times
- server state becomes inconsistent (e.g., double-charging)

This example simulates a server that memoizes results by `idempotencyKey` and shows how duplicates become safe replays.

