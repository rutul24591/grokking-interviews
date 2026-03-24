# Example 3 — Advanced: multiple schemas + XSS-safe embedding

Edge cases:

- multiple schema blocks per page (Breadcrumb + Article + FAQ)
- embedding must be safe (avoid injecting HTML into JSON-LD)

This example demonstrates safe serialization and deduping.

