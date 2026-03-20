# Edge case: caching auth decisions

In the context of Authentication Infrastructure (authentication, infrastructure), this example provides a focused implementation of the concept below.

Caching improves latency, but stale allows are dangerous.

Common controls:
- cache only active decisions,
- cap TTL,
- and invalidate on revocation/incident response.

