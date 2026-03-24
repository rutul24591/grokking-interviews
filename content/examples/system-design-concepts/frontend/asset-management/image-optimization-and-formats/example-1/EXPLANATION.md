# Example 1 — Responsive images + modern formats (end-to-end)

This example demonstrates an end-to-end, production-style setup:

- A server endpoint generates images in multiple formats (`avif`, `webp`, `png`) and sizes.
- The page uses `<picture>` + `srcset` + `sizes` for **responsive delivery** and **format fallback**.
- The API returns cache-friendly headers, and the UI can fetch assets to inspect `Content-Type` and caching behavior.

