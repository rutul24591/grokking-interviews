Example 3 focuses on edge cases and correctness checks you should validate in production-style code.

Covers stack underflow and a min-stack extension so correctness checks are not limited to the happy path.

It demonstrates:
- underflow throws instead of returning corrupted state
- minimum tracking stays in sync across pops
- duplicate minima do not disappear early
