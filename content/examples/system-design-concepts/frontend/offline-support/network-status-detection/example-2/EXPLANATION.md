# Network Status Detection — Example 2

This example is intentionally browser-free so you can reason about edge cases:

- “online” browser events followed by failing heartbeats
- slow heartbeats that should be classified as **degraded**
- transitions back to **online** only after a successful heartbeat

This is a good interview technique: show that you treat connectivity as a **state machine**, not a boolean.

