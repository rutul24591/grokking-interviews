Example 3 focuses on edge cases and correctness checks you should validate in production-style code.

Highlights the gap between code units and user-visible characters so edge cases are not ignored in multilingual systems.

It demonstrates:
- string length can differ from grapheme count
- Array.from helps inspect code points more safely
- naive slicing can split visible characters unexpectedly
