Example 2 focuses on a follow-up/variant that interviewers commonly ask next.

Explains the standard optimization: use a min-priority-queue so selecting the next node is O(log n) instead of O(n).

It demonstrates:
- complexity improves from O(V^2) to O((V+E) log V)
- priority queue must support decrease-key (or push duplicates + ignore stale entries)
- graph density influences whether the optimization matters
