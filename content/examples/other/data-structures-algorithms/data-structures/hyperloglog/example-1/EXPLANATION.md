Example 1 is a production-style implementation demo for this data structure.

Implements a compact HyperLogLog-style estimator to approximate unique visitor counts with fixed memory.

It demonstrates:
- items are split into registers by a prefix of their hash
- register values track leading-zero runs
- estimates trade exactness for bounded memory at scale
