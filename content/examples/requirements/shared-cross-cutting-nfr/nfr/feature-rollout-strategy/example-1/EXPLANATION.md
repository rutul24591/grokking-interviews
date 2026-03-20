This is a runnable “Feature Rollout Control Plane” demo:

- A flag config with percentage rollout and a kill switch.
- Deterministic bucketing so users are sticky across sessions.
- Metrics collection (exposures + errors) to compute error rate.
- A Node agent that ramps rollout and triggers kill switch if guardrails fail.

