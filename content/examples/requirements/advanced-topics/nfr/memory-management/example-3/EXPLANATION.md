This example covers an advanced guardrail: **memory pressure control**.

Even with an LRU cache, sudden traffic spikes or large payloads can push the process into GC thrash or OOM.
Production systems add a “memory breaker”:
- when heap/RSS is above a threshold, **stop caching** or **reject work**
- recover when memory returns to safe levels

This demo implements a simple breaker that disables caching when heap usage exceeds a budget.

