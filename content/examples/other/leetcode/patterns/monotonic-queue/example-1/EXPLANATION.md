Example 1 is a production-style implementation demo for this Leetcode pattern.

Implements the monotonic queue pattern (deque of indices) for O(n) sliding window maximum.

It demonstrates:
- deque maintains decreasing values
- front is always the max for current window
- expired indices are evicted as window advances
