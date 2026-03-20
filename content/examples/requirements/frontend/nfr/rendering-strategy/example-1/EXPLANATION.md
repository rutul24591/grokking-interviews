# Rendering strategy as an NFR

Rendering strategy is not a stylistic choice; it drives:
- cacheability,
- performance (TTFB vs hydration),
- correctness (personalization),
- and operational cost (server load).

This example demonstrates:
- SSR: fresh + personalized, typically not cacheable at CDN.
- CSR: thin HTML, more JS and async complexity.
- Static/ISR-like: shared content with caching and periodic revalidation.

