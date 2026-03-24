# Example 1 — Open Graph + Twitter Cards with OG image generation (end-to-end)

This example demonstrates:

- `generateMetadata()` setting Open Graph + Twitter tags
- a Node runtime route handler generating a **PNG** OG image via `sharp`
- cache headers on OG images (short TTL by default)

Use View Source on a post page to verify meta tags are present in the initial HTML.

