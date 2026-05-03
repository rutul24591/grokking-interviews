Example 1 is a production-style implementation demo for this Leetcode pattern.

Implements a fixed-size sliding window to compute max k-length subarray sums (representative for throughput/latency windowing).

It demonstrates:
- window updates are O(1) per step (add right, remove left)
- returns null when k exceeds array length
- works with mixed positive/negative values
