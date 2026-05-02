Example 3 focuses on edge cases and correctness checks you should validate in production-style code.

Calls out the small-range weakness where approximate estimators are least comfortable and exact sets may be cheaper.

It demonstrates:
- very small cardinalities can be over- or under-estimated
- exact sets are often preferable before scale justifies approximation
- register precision is a configurable trade-off
