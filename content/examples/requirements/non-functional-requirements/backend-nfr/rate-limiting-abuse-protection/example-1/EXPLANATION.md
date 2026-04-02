# What this example covers

Rate limiting is a core backend NFR for:

- protecting dependencies and cost
- preventing abuse (credential stuffing, scraping)
- preserving good-user latency under load

This example implements:

- **token bucket** per `(apiKey, ip)` identity
- `429` responses with `Retry-After`
- a simple “penalty box” (temporary block) after repeated violations

In production, use a distributed store (Redis) and consider multi-dimensional limits (per user, per IP, per endpoint).

