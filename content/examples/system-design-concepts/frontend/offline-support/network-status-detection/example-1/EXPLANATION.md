# Network Status Detection — Example 1

This example demonstrates a production-grade mental model:

- **Browser signals are hints**: `navigator.onLine` can be “true” while requests fail (DNS, captive portal, proxy auth, TLS MITM, etc).
- **Heartbeat verifies reality**: a cheap HEAD request to a known-good endpoint confirms reachability.
- **Degraded is first-class**: treat slow/failed heartbeats as “degraded”, not just “online/offline”.

In real apps, you typically:
- allow reads in degraded mode
- queue writes (outbox) while degraded/offline
- use exponential backoff for heartbeat to avoid battery/network burn
- emit metrics: heartbeat latency, failure rate, state transitions

