Example 1 is a production-style implementation demo for this Leetcode pattern.

Implements a heap-based top-k pattern (kth largest) using a bounded min-heap.

It demonstrates:
- heap holds only k elements (bounded memory)
- peek tracks the current kth-largest threshold
- works for streaming inputs (process incrementally)
