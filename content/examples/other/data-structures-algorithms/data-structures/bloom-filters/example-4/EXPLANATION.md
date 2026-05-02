Example 3 focuses on edge cases and correctness checks you should validate in production-style code.

Implements a counting Bloom filter variant to support deletions safely, which is the key follow-up after plain Bloom limitations.

It demonstrates:
- counters increment and decrement instead of toggling a single bit
- deleting one key does not clear shared membership evidence for others
- counters must be bounded and protected from underflow
