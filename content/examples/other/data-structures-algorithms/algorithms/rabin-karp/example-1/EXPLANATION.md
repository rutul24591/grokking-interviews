Example 1 is a production-style implementation demo for this algorithm.

Implements Rabin–Karp using a rolling hash and verifies matches to avoid false positives.

It demonstrates:
- rolling hash updates in O(1) per step
- hash matches are verified by substring compare
- demonstrates expected-case fast scanning
