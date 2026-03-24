# Example 1 — Filename hashing + immutable caching (end-to-end)

This example is a small production-style setup for **long-lived caching** of static assets:

- A build step generates **content-hashed filenames** and a **manifest**.
- The app renders assets using logical names (e.g. `logo.svg`) that resolve to hashed URLs (e.g. `logo.7a3d1c2f.svg`).
- The server sends **immutable** caching headers for hashed assets.

This is the canonical “CDN-friendly” approach: assets can be cached for a year, and updates are picked up automatically because the URL changes when content changes.

