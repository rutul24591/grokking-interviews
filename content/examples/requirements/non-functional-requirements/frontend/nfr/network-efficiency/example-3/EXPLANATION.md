# Retries: when “helpful” becomes harmful

In the context of Network Efficiency (network, efficiency), this example provides a focused implementation of the concept below.

Retries improve resilience, but they can also amplify partial outages. A staff-level design typically includes:

- explicit **max attempts** (budget),
- exponential **backoff** with **jitter**,
- and observability (how many retries per request, per endpoint).

For frontends, also consider user-perceived latency budgets: sometimes failing fast and showing a recovery UI is better UX.

