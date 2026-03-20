# What this example covers

Replayability is the ability to:

- reprocess events for new consumers
- recover from bugs (re-run with fixed code)
- rebuild derived state (indexes, materialized views)

This example implements:

- append-only **offset-based** event log
- consumer **checkpoint commits**
- consumer **reset** to reprocess from an earlier offset

In production you’d use Kafka/Pulsar/Kinesis, plus:

- idempotent consumers
- dead-letter queues
- retention and compaction policies

