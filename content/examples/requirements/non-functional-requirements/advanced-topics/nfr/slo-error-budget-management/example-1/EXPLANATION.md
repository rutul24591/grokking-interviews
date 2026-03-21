This is a runnable “SLO Lab” demo that shows **SLO / error budget management** end-to-end:

- Define an SLO (objective + “good event” criteria using latency threshold + 5xx errors).
- Collect request outcomes as the SLI stream (via a simulated target endpoint).
- Compute rolling-window error budget consumption and **burn rates**.
- Trigger **multi-window, multi-burn-rate alerts** (fast + slow) and use them to gate risk.

Production-shaped ideas included (but kept lightweight and copy/pasteable):

1) **Good events vs total events**: “good” is explicit and measurable, not hand-wavy.
2) **Rolling windows**: budgets and burn rates are computed over multiple windows (5m/1h, 30m/6h).
3) **Budget is a policy tool**: the report includes a simple “release freeze” signal.
4) **Deterministic simulation**: request IDs deterministically map to error/latency outcomes (canary-like).

Run the UI to see budgets change live, and run the agent to generate controlled incidents and produce a report artifact.

