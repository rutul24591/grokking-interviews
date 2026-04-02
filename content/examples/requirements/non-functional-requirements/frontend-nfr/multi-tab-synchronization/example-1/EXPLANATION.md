# Multi-tab synchronization: patterns that scale

Multi-tab state is tricky because each tab has independent memory and can crash at any time.

This example uses:
- **Lease-based leader election** in `localStorage` (with TTL) to ensure only one poller exists.
- **BroadcastChannel** to distribute updates to other tabs.
- **Heartbeat + takeover** so followers can become leader if the current leader disappears.

In production, consider SharedWorker (where available) or service-worker mediated sync, and treat
storage as an unreliable coordination primitive (handle split brain).

