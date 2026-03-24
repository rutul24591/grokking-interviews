# Example 2 — Avoid double-fetch + parallelize server work (focused)

Demonstrates:

- a shared cached data-loader used by both `generateMetadata()` and the page component
- parallel fetching (`Promise.all`) to avoid request waterfalls
- SSR-friendly caching knobs (`unstable_cache` with `revalidate`) for high-traffic SEO pages

