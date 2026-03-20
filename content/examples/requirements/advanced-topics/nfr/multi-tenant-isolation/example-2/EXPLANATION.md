This example focuses on the “performance isolation” mechanics behind multi-tenancy:

- **Token bucket** (per-tenant RPS limits)
- **Bulkhead semaphore** (per-tenant concurrency limits)
- **Bounded queueing** (optional) vs immediate rejection

It’s runnable as a simulation that compares shared vs bulkhead behavior and prints simple fairness metrics.

