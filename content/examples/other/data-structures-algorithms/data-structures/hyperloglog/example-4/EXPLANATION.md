Example 3 focuses on edge cases and correctness checks you should validate in production-style code.

Compares two sketches with different register counts to show how precision trades off against memory.

It demonstrates:
- more registers generally reduce variance on large sets
- memory usage grows with register count
- the estimator remains approximate regardless of precision
