# Service Workers Example 1 — What to discuss in interviews

This example highlights three production patterns:

1) **Lifecycle awareness**
- Install: precache app shell (`/`, `/offline`)
- Activate: delete old versioned caches, `clients.claim()` for faster control

2) **Strategy per request type**
- Navigation: network-first with offline fallback
- API: network-first with cache fallback (trade-off: may show stale data)
- Static assets: stale-while-revalidate to balance speed and freshness

3) **Message passing**
- `postMessage` enables controlled actions (cache stats, clear caches, skip waiting).

Common pitfalls:
- caching user-specific HTML across users
- forgetting cache versioning / invalidation
- skipWaiting without multi-tab safety (Example 3 explores coordination)

