# What this example covers

Cost optimization is a backend NFR because it affects:

- infra spend (compute/storage/egress)
- operational decisions (multi-region, caching, rollouts)
- product decisions (feature gating, usage limits)

This example implements:

- a small **cost model** with a clear breakdown (compute vs storage vs CDN egress),
- **budget guardrails** (a budget threshold that triggers “hold rollout” style feedback),
- and a **recommendation function** that points to the biggest levers (cache hit rate, payload size, reserved discount).

In production you’d replace this with:

- real billing data (CUR/BigQuery, cloud billing exports),
- cost allocation tags (team/service/feature),
- and automated policies (e.g. block deploys when budget is exhausted).

