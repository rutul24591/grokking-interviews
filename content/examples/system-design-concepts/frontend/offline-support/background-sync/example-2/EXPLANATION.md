# Background Sync — Example 2

Outbox replays should not hammer the network.

This example demonstrates:
- exponential backoff with jitter
- bounded retries

In production you’d also add:
- per-item vs per-batch budgets
- dead-letter handling
- visibility into replay error rate and latency

