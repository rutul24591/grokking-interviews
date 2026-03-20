This is a runnable “Canary Lab” demo that models a production canary rollout end-to-end:

- **Deterministic, sticky routing**: each request is assigned to baseline vs canary based on `x-user-id` hashing.
- **Blast radius control**: the canary percentage is a single knob (`canaryPct`) you can ramp over time.
- **Per-variant SLIs**: the server records outcomes per variant (error rate + latency percentiles).
- **Guardrails and automation**: a Node “rollout agent” ramps canary traffic and automatically halts/rolls back if guardrails are breached.

Key production takeaways:

1) Canary success isn’t “it didn’t crash” — you must define **measurable guardrails** (error rate and latency deltas).
2) Deterministic bucketing gives you **sticky sessions** without state, which reduces variance in comparisons.
3) Rollouts need an explicit **decision policy** (promote/hold/rollback), not ad-hoc judgment.
4) Real systems also include authn/z, audit logs, and integration with a metrics backend — omitted here for simplicity.

