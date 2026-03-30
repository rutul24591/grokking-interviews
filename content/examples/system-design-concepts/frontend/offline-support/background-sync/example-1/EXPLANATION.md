# Background Sync — Example 1

This example implements a classic **outbox**:
- Writes go to IndexedDB first (durable, crash-safe).
- A replay job drains the outbox when online.

Why Background Sync matters:
- It enables the browser to run replay even after the user navigates away (when supported).

Why you still need a fallback:
- Background Sync isn’t universally supported and may not fire predictably in dev environments.
- A manual drain path ensures correctness everywhere.

Replay safety:
- Replays are **at-least-once** → use **idempotency keys** on the server.

