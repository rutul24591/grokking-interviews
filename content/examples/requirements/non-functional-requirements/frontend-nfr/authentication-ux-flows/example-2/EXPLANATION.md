If your login flow supports `returnTo`, validate it carefully. A naive redirect can become an **open redirect** used for phishing.

This demo enforces a simple, production-friendly policy:
- allow only **relative paths** (same-site),
- reject absolute and scheme-relative URLs.

