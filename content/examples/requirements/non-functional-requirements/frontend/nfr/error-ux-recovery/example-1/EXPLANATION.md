Error UX should make failure survivable:
- pick retryable vs non-retryable errors,
- use bounded retries with exponential backoff and jitter,
- keep users informed without spamming,
- and ensure idempotency on writes.

This example uses a deterministic flaky endpoint that fails twice and succeeds thereafter.

