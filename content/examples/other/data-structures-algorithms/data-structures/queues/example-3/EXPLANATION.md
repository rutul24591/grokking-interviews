Example 3 focuses on edge cases and correctness checks you should validate in production-style code.

Exercises wraparound, overflow, and underflow behavior because queue pointer bugs usually appear only after many cycles.

It demonstrates:
- tail wraps to index zero after hitting capacity
- overflow is explicit instead of overwriting live entries
- underflow is explicit instead of reading stale slots
