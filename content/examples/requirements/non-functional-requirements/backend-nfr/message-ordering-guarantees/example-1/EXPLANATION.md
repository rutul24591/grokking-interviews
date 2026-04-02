# What this example covers

Ordering guarantees typically exist **per key** (partition key / stream id), not globally.

This example simulates a consumer that needs **strict per-stream order**:

- events carry `seq` numbers
- consumer processes only when `seq === nextExpected`
- out-of-order events are buffered
- duplicates are ignored (idempotent by seq)

In production, you achieve this with:

- partitioning by key (Kafka partitions, SQS FIFO message group id)
- sequence numbers/watermarks
- idempotent consumers

