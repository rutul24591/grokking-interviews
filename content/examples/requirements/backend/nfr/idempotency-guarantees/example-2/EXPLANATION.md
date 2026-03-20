# Focus

Production idempotency stores often track:

- `in_progress`: the first request started but didn’t finish
- `completed`: result is stored and replayable

This helps avoid double-execution during concurrency and allows safe retries.

