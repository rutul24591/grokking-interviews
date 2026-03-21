This is a runnable “Performance Budget Gate” demo for **end-to-end performance budgets**:

- A server endpoint ingests synthetic “RUM-like” samples (latency, long tasks, bytes).
- A report endpoint computes p50/p95 and evaluates against budgets.
- The UI can generate “good” and “bad” samples to see the gate flip.
- A Node agent posts samples and fails if budgets are violated.

Production mapping:
- Define explicit budgets (p95 latency, long tasks, payload size).
- Collect telemetry (RUM, synthetic checks) and gate releases on regressions.
- Keep budgets per-route and per-platform (mobile/desktop) in real systems.

