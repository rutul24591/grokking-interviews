# Focus

In the context of Event Replayability (event, replayability), this example provides a focused implementation of the concept below.

Pure replay from the beginning gets expensive as the log grows.

Two common optimizations:

- periodic **snapshots** of derived state
- **compaction** (keep only the latest value per key)

This example illustrates a simple key-value compaction.

