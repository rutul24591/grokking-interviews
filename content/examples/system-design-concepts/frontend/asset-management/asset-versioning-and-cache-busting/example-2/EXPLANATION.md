# Example 2 — Query params vs filename hashing

This example focuses on a common decision point:

- **Query-string cache busting**: `/logo.svg?v=2026.03.24`
- **Filename hashing**: `/logo.7a3d1c2f.svg`

Both can “work”, but they have different operational properties:

- Hashed filenames make it safe to use `Cache-Control: immutable` and very long TTLs.
- Query params are easier to retrofit but often force shorter TTLs and are more error-prone when multiple caches are involved.

