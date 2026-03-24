## Why it matters

When you put mutable state at module scope, you get:
- one shared instance per process

In SSR, that can leak data across users if you accidentally cache per-user state globally.

Mitigation:
- make modules pure (no mutable module state)
- create per-request objects explicitly
- use request-scoped context (Example 3)

