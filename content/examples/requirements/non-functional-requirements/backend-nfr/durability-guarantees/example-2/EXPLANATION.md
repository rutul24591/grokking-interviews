# Focus

Durability isn’t enough if clients retry:

- network timeouts cause retries
- retries can create duplicates unless writes are idempotent

This example demonstrates deduplication by `idempotencyKey`.

