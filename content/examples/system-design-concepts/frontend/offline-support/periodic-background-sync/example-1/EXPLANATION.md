# Periodic Background Sync — Example 1

This example demonstrates the right posture for periodic sync:

- Try to register it because it can reduce foreground refresh cost.
- Expect it to be unavailable or throttled.
- Keep a deterministic fallback path (`visibilitychange` in this demo).

In production, teams usually combine:
- periodic sync for low-priority refreshes
- refresh-on-open / refresh-on-visible for correctness
- conditional requests (`ETag`, `If-None-Match`) to keep refresh cheap

