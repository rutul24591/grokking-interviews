This is a runnable “Chaos Lab” demo that implements the full chaos-testing workflow:

- Define a steady-state hypothesis (SLO-style thresholds).
- Inject realistic failures with a bounded blast radius.
- Generate load, observe measurable outcomes, and stop on guardrails.
- Produce an experiment report you can attach to an incident / postmortem.

What you’re learning (mapped to real production practice):

1) **Control plane vs data plane**: the Next.js UI/API is the control plane; the `/api/target` endpoint is a deliberately simplified “service” (data plane) where faults are injected.
2) **Blast radius**: only a percentage of requests are impacted, chosen deterministically per request ID (a common canary-style technique).
3) **Steady state**: the server tracks a rolling window of request outcomes and latency percentiles.
4) **Guardrails**: the agent can automatically stop experiments when error rate / p95 latency exceed thresholds.

This is intentionally production-shaped (typed configs, deterministic blast radius, observable metrics), while remaining lightweight and copy/pasteable.

