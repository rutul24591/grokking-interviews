# Focus

When you replay, you *will* see the same event again.

Consumers should be designed for idempotency:

- keep a processed-id set (or write via unique constraints)
- or track a monotonic offset per partition

