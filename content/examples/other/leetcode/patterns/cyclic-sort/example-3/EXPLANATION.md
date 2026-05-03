Example 3 focuses on edge cases and correctness checks that typically break naive implementations.

Covers out-of-range values and constraints: cyclic sort requires values to map into index range.

It demonstrates:
- values outside expected range break the placement invariant
- defensive guards are required in production code
- empty arrays behave safely
