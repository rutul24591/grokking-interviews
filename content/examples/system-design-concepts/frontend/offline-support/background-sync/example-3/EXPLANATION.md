# Background Sync — Example 3

Background Sync is not just “retry later”.

In production, replay is usually **at-least-once**:
- the same mutation may be sent again after a timeout
- two tabs may try to drain the same outbox
- older queued writes may arrive out of order
- the server may evict old idempotency keys too early

This example turns those into a deterministic harness:
- **replay store** simulates server-side idempotency
- **leader lease** simulates “one tab drains, others stand down”
- **scenario runner** shows which replays are safe, blocked, or risky

The key interview point is that Background Sync reliability is a **protocol design** problem:
- clients need stable mutation IDs and ordering metadata
- servers need idempotency windows that match replay behavior
- multi-tab apps need a drain owner so work is not duplicated
