# What this example covers

Traffic management is about controlling demand so the system stays stable:

- admission control (limit concurrency)
- load shedding (reject low priority when overloaded)
- graceful degradation (serve reduced response under stress)

This example implements:

- a semaphore with `maxConcurrent`
- low priority requests are rejected immediately when at capacity
- high priority requests may wait (bounded by queueing in the semaphore)

In production, combine with:

- per-endpoint limits
- circuit breakers and timeouts
- global traffic shifting / rate limiting

