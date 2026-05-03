Example 2 focuses on a common follow-up variant that changes constraints or output requirements.

Implements the common follow-up: smallest subarray length with sum >= target (variable-size window).

It demonstrates:
- left pointer shrinks only when the constraint is satisfied
- returns 0 when no window meets the target
- monotonic left advancement keeps O(n) time
