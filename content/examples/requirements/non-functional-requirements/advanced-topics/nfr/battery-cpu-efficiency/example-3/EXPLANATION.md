This example demonstrates an advanced CPU efficiency practice: setting and enforcing a **long-task budget**.

You collect Long Task durations (RUM), then gate releases if:
- long-task count grows beyond a threshold
- p95 long-task duration regresses

This is analogous to SLOs, but for client-side performance/efficiency.

