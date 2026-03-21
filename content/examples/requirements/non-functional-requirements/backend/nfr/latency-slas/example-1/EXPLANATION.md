# What this example covers

Latency SLAs (e.g., “p95 < 250ms”) force you to manage **tail latency** and dependency budgets.

This example demonstrates a practical pattern:

- define a per-request SLA (`slaMs`)
- track a **deadline** and per-step timings
- before calling an expensive dependency, check remaining budget
- if budget is too small, return a **degraded** response (skip slow path)

In production, combine this with:

- caching (to avoid slow DBs)
- load shedding during overload
- timeouts + circuit breakers
- real percentile tracking (histograms)

