Example 2 focuses on a common follow-up variant that changes constraints or output requirements.

Follow-up: invert the comparator to compute sliding window minimum (same pattern, reversed monotonicity).

It demonstrates:
- deque maintains increasing values for min
- same eviction rules apply
- duplicates are handled deterministically (>= vs >)
