# Sampling and privacy guardrails

This example focuses on two practical controls that keep RUM feasible at scale:

- **Deterministic sampling:** sample by session/user hash so cohorts are stable and dashboards don’t “randomly” change.
- **Privacy scrubbing:** remove query strings/hashes from URLs and avoid recording raw emails/tokens.

It also enforces a **payload budget** (max bytes) to prevent telemetry from becoming a hidden cost.

