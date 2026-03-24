# Example 3 — Accept-based content negotiation + `Vary: Accept`

Advanced systems sometimes serve a single stable URL, choosing the best format based on the `Accept` header:

- `image/avif` when supported
- otherwise `image/webp`
- otherwise fallback `image/png`

If you do this behind a CDN, you must set:

- `Vary: Accept`

so caches don’t serve a WebP/AVIF to a client that can’t decode it.

