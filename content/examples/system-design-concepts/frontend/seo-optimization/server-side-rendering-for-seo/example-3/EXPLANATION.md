# Example 3 — Hybrid strategy: SSG + ISR + SSR + noindex (advanced)

Demonstrates:

- SSG/ISR for public, indexable blog pages (fast + crawlable)
- SSR for personalized pages (cookies) that should not be indexed (`robots: noindex`)
- on-demand revalidation hook to keep content fresh without full rebuild

