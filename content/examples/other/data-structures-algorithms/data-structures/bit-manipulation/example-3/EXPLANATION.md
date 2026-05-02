Example 3 focuses on edge cases and correctness checks you should validate in production-style code.

Covers signed shifts and mask width assumptions so the examples do not silently teach unsafe bit-level habits.

It demonstrates:
- left shifts grow values by powers of two until width limits matter
- signed right shift preserves the sign bit
- unsigned coercion is sometimes required for wire-format work
