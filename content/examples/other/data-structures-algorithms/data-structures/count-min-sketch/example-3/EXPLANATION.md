Example 3 focuses on edge cases and correctness checks you should validate in production-style code.

Makes the overestimation property explicit so edge cases do not get mistaken for exact counting semantics.

It demonstrates:
- estimates never undershoot true counts in this sketch
- collisions inflate some keys
- exact answers still need a different data structure
