# What this example covers

Fault tolerance is about continuing to provide *some* level of service in the presence of failures.

This example demonstrates a common resilience toolkit:

- **timeouts** (avoid hanging forever)
- **retries** (with a small cap)
- **circuit breaker** (stop hammering a failing dependency)
- **fallback** responses (degraded mode)

In production, tune these with SLOs and dependency budgets:

- retries increase tail latency and amplify load during incidents
- circuit breakers prevent cascading failures
- fallbacks protect core user flows

