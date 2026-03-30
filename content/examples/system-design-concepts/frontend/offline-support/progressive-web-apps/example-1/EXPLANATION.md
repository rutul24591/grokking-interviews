# PWA Example 1 — Production notes

This example shows the three pillars of a minimal PWA:

1) **Web App Manifest** (install metadata)
- Controls name, icons, start URL, display mode (standalone vs browser).
- A real production PWA typically has multiple icon sizes, maskable icons, and sometimes shortcuts/share targets.

2) **Install prompt UX**
- Browsers decide *when* to surface install; apps can only react to `beforeinstallprompt`.
- Always treat install as an enhancement; the app must remain fully usable without it.

3) **Service worker as an offline entry-point**
- This example uses a simple **offline navigation fallback** (`/offline`) to avoid a broken blank screen.
- In production, avoid blindly caching `"/"` if your HTML is user-specific. Prefer an app shell that is safe to cache for all users, or scope caching behind auth boundaries.

Operational trade-offs:
- **Staleness vs availability**: aggressive caching improves offline availability but can serve outdated content.
- **Update strategy**: you need a deliberate strategy (skip waiting vs controlled rollout). Example 3 focuses on this.
- **Observability**: include logs/metrics for cache hit rates, update adoption, and failure modes where possible.

