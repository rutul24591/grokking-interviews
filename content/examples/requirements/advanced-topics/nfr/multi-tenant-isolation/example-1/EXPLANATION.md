This is a runnable “Tenant Lab” demo for **multi-tenant isolation**:

- **Security boundary**: every request is tenant-scoped via `x-tenant-id`.
- **Performance isolation**: switch between a *shared pool* (noisy neighbor) vs *bulkheads* (per-tenant concurrency).
- **Resource isolation**: per-tenant **RPS rate limit** (token bucket) and a simple **daily unit budget**.
- **Observability**: per-tenant metrics (error rate, p50/p95 latency, limit-reject reasons).
- **Automation**: a Node “traffic agent” reproduces noisy-neighbor scenarios and writes a JSON report artifact.

What this models in real systems:

1) You rarely get perfect isolation “for free” — shared pools maximize utilization but can violate fairness.
2) Bulkheads trade utilization for predictability: enterprise tenants stay stable even when a free tenant spikes.
3) A strong multi-tenant design combines multiple guardrails: authz scoping + quotas + rate limits + concurrency isolation.

