# Example 3 — Conditional requests (ETag / 304) for “mutable” URLs

Hashed filenames are ideal for long-lived caching, but many systems still have **mutable URLs**:

- user-generated content served from `/media/{id}`
- “latest” assets served from stable URLs
- legacy paths you can’t safely rename

This example shows an advanced pattern:

- The server returns an `ETag`.
- The client re-requests with `If-None-Match`.
- The server replies `304 Not Modified` when appropriate, saving bandwidth.

