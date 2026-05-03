Example 1 is a production-style implementation demo for this Leetcode pattern.

Implements the top-k elements pattern using a bounded min-heap for streaming-friendly ranking.

It demonstrates:
- heap holds at most k items
- final items represent top-k (order not guaranteed without sorting)
- memory is bounded regardless of input size
