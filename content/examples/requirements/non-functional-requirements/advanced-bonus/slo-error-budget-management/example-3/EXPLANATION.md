This example covers an advanced but extremely practical pattern:

**Use error budgets to gate risk**, e.g. deployments, experiments, or capacity reductions.

It implements a “release gate” decision that considers:

- Remaining budget percentage (e.g. freeze if < 20%).
- Burn-rate alerts (fast/slow) as immediate risk signals.
- Edge cases: new services (low traffic), objective=1.0, missing metrics.

In real systems you’d wire this into CI/CD and use authenticated reads from a metrics backend.

