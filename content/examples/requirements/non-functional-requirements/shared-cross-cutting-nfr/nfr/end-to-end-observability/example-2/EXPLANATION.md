This example isolates a common observability decision: **head-based sampling**.

In real systems you often:
- sample high-volume traffic (e.g., 1–5%)
- always keep errors / slow traces
- ensure sampling is **consistent** per trace (all spans in a trace share the decision)

This demo shows a deterministic sampler using a hash of `traceId`.

