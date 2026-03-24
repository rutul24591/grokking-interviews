# Example 1 — Dynamic meta tags end-to-end (Next.js App Router)

Shows a production-style approach to meta tags:

- `generateMetadata()` per route (title + description)
- Open Graph + Twitter Cards
- canonical URL via `alternates.canonical`
- a stable `metadataBase`

Open the HTML source of a product page to confirm the head tags are server-rendered.

