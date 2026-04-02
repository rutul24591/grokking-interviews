# What this example covers

Durability guarantees answer:

> If I acknowledge a write, will it survive crashes and restarts?

This example implements a tiny write-ahead log (WAL) with two modes:

- `mode=memory`: acknowledge after updating memory only (fast, not durable)
- `mode=durable`: acknowledge after appending to a WAL file and fsyncing (slower, durable)

It then simulates a “crash” by clearing in-memory state and demonstrates replay from WAL.

In production you’d rely on a battle-tested storage engine (Postgres, RocksDB, Kafka, etc.) and define durability at the API level (ack after commit quorum vs single node).

