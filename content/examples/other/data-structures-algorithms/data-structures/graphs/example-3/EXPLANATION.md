Example 3 focuses on edge cases and correctness checks you should validate in production-style code.

Covers disconnected components and cycle detection so graph handling is not limited to a single connected happy path.

It demonstrates:
- missing paths return null cleanly
- a back-edge is recognized as a cycle in directed traversal
- multiple components need explicit outer iteration
