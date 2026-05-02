Example 3 focuses on edge cases and correctness checks you should validate in production-style code.

Covers repeated unions and invalid references so the structure behaves predictably in operational code paths.

It demonstrates:
- repeated union on the same component is a no-op
- unknown nodes should be rejected by application guards
- connectivity semantics stay stable across redundant operations
