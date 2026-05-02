Example 3 focuses on edge cases and correctness checks you should validate in production-style code.

Calls out the edge-case limitation that plain Bloom filters do not support safe deletion without a counting variant.

It demonstrates:
- resetting the filter clears every prior membership hint
- safe deletion requires counters, not just bits
- operational lifecycle must account for rebuild or rotation
