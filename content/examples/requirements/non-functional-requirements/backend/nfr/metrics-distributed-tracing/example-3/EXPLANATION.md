# Focus

Tracing all requests is expensive. Sampling strategies include:

- head-based sampling (decide at start)
- tail-based sampling (decide after seeing latency/error)

This example shows deterministic head sampling based on `traceId` so all spans in a trace agree.

