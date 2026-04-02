# Offline writes: the hard part

Caching reads is easy; writes need a real design:
- an **outbox** queue,
- idempotency keys,
- conflict resolution (last-write-wins, merge, or user prompts),
- and UI that communicates sync state.

This example shows the core invariant: retries must be safe via idempotency.

