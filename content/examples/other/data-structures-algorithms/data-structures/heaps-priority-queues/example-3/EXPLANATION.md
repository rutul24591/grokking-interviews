Example 3 focuses on edge cases and correctness checks you should validate in production-style code.

Covers duplicate priorities and empty-heap extraction so behavior is explicit under real operational conditions.

It demonstrates:
- equal priorities remain valid even if internal ordering differs
- extracting from an empty heap throws clearly
- the comparator fully defines ordering semantics
