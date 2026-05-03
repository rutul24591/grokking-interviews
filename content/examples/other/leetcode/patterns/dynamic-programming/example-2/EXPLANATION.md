Example 2 focuses on a common follow-up variant that changes constraints or output requirements.

Follow-up: compare top-down memoization and bottom-up tabulation trade-offs (recursion depth vs table size).

It demonstrates:
- memoization can be simpler but risks deep recursion
- tabulation is iterative and avoids stack growth
- space optimizations depend on dependency shape (e.g., rolling arrays when only previous row matters)
