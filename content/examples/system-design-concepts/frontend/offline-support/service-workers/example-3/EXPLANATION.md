# Service Workers Example 3 — Why leader activation matters

In multi-tab apps, calling `skipWaiting()` aggressively can produce:
- tab A running assets for version N
- tab B suddenly controlled by version N+1
- inconsistent behavior, broken caches, and confusing UX

This example uses a simple **localStorage-based lease**:
- one tab is the “leader” for a short TTL
- only the leader activates the waiting SW
- all tabs reload on `controllerchange`

In production, you may prefer:
- BroadcastChannel + tab coordination
- server-driven “safe activation” windows
- waiting until the user reaches an idle/safe point (no forms, no streaming playback)

