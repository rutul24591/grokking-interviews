This is a runnable “Efficiency Lab” demo focused on **battery + CPU efficiency** for web apps.

It demonstrates two production-facing levers:

1) **Network efficiency** (battery + radio time):
   - Conditional requests with **ETag** / `If-None-Match` to avoid downloading unchanged payloads.
   - Adaptive polling cadence (don’t poll aggressively when the tab is hidden).

2) **CPU efficiency** (battery + responsiveness):
   - Measuring **Long Tasks** on the main thread and sending aggregated telemetry.
   - Avoiding expensive synchronous work in the hot render path (optimized mode).

The UI lets you switch between “naive” and “optimized” approaches and observe:
- request sizes and 304 hit rate
- long task counts

