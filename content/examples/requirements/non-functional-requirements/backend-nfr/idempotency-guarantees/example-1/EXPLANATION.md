# What this example covers

Idempotency guarantees are about safely handling:

- client retries (timeouts, mobile networks)
- load balancer retries (at-most-once is not guaranteed)
- user double-submits

This example implements a production-shaped pattern for **idempotent POSTs**:

- clients send an `Idempotency-Key` (or explicit `idempotencyKey` field)
- the server stores the first result keyed by `(customerId, key)`
- retries return the same response payload with `replayed: true`
- concurrent duplicates are **coalesced** (in-flight promise sharing) so you don’t double-charge

In production, the store must be durable (Redis/DB) and the key must have a TTL.

