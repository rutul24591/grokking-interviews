# What this example covers

Throughput capacity is often improved via:

- concurrency (workers)
- batching (amortize overhead)
- queueing (decouple producers/consumers)

This example demonstrates **micro-batching**:

- items are buffered
- a batch flush triggers when size hits `maxBatchSize` or `flushIntervalMs`
- stats expose processed item counts and batch counts

Trade-off: batching increases throughput but can increase per-item latency.

