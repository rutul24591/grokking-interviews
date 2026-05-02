Example 3 focuses on edge cases and correctness checks you should validate in production-style code.

Covers deletes and stale segments because these are where LSM correctness bugs usually become visible.

It demonstrates:
- deletes are represented as tombstones until compaction
- reads must prefer the newest version of a key
- old segments may still contain stale values physically
