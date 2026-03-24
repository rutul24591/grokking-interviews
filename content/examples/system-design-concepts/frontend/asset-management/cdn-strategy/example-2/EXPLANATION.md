# Example 2 — Cache keys & normalization

CDNs cache by a **cache key** (usually URL + a subset of request headers). Small mistakes cause:

- low hit rates (too many variants)
- cache poisoning risk (wrong variants)
- “works locally, fails behind CDN” bugs

This example provides a small cache-key normalization utility and a UI to explore how query params and headers impact the cache key.

