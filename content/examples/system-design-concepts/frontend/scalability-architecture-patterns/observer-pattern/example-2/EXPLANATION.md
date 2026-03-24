## The problem: “notify on every set”

If a store calls subscribers immediately on every `set()` and updates are frequent (dragging a slider, realtime stream),
the UI can spend more time rendering than doing useful work.

Batching trades:
- **slightly delayed delivery** (microtask)
for:
- fewer renders
- better throughput

In production, you’d combine batching with:
- selector subscriptions
- priority lanes / transitions
- coalescing / dropping policies for non-critical events

