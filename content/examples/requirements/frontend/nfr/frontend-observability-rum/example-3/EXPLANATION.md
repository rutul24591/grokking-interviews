# Turning raw events into “actionable” signals

Raw RUM events are noisy. This example shows small, high-leverage transforms:

- **Percentiles** (p50/p95) to prioritize tail regressions.
- **Apdex** to produce a single “is it good enough?” number.
- **Error fingerprinting** to deduplicate stack/message noise so “top errors” is meaningful.

In production you’d also:
- join sessions with releases and user cohorts,
- apply budgets per session/page,
- and ship aggregates to a time-series store for alerting.

