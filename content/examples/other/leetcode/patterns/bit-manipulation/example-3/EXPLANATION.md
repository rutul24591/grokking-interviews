Example 3 focuses on edge cases and correctness checks that typically break naive implementations.

Covers the practical pitfall that JS bitwise operators operate on signed 32-bit integers.

It demonstrates:
- right shift preserves sign (>>), unsigned shift (>>>) does not
- values are truncated to 32-bit for bitwise ops
- use BigInt for wider-than-32-bit bitwise work
