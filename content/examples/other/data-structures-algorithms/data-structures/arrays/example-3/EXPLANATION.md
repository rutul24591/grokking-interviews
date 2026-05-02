Example 3 focuses on edge cases and correctness checks you should validate in production-style code.

Exercises empty-array, bounds, and resize edge cases so failures are explicit instead of silently corrupting contiguous storage.

It demonstrates:
- out-of-bounds writes throw instead of mutating the wrong slot
- capacity growth preserves prior elements
- removing from an empty structure is rejected clearly
