# Example 1 — Stable ID + human slug + redirect (end-to-end)

Demonstrates:

- primary key is stable (`id`), slug is for humans/SEO
- URL is `/posts/{id}/{slug}`
- if a slug changes, the server redirects to the canonical URL (301)

