Client persistence is more than “save to localStorage”:
- you need a strategy for **pending operations** (outbox),
- a strategy for **retries** and **deduplication** (idempotency keys),
- and a strategy for **schema migrations** over time.

This example demonstrates an outbox-like flow and a server that deduplicates requests by `(clientId, opId)`.

