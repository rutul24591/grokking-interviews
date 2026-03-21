This example covers advanced rollout decision-making:

- Point estimates (error rate, p95) are noisy at small canary sizes.
- You need **confidence-aware decisions** to avoid false rollbacks (noise) and false promotions (risk).

The demo implements:

1) **Wilson score interval** for error-rate difference (small-sample friendly).
2) A simple **bootstrap** confidence estimate for p95 latency regression.
3) A policy decision: `promote` / `hold` / `rollback`.

In production you’d incorporate multiple metrics, adjust for peeking/sequence effects, and use a proper metrics backend.

