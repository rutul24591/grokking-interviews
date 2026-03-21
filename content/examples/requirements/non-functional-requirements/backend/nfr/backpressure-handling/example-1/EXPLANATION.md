# Backpressure handling as a backend NFR

Backpressure prevents overload from cascading into:
- unbounded queues,
- high tail latency,
- and process OOMs.

This example implements a bounded in-memory queue and returns `429 + Retry-After` when saturated.

