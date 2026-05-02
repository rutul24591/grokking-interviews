Example 3 focuses on edge cases and correctness checks you should validate.

Covers cycles, self-loops, and disconnected graphs to ensure traversal code stays safe on real inputs.

It demonstrates:
- self-loops do not cause infinite traversal
- cycles are handled via visited-set guards
- disconnected graphs return partial visitation as expected
