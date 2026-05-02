Example 1 is a production-style implementation demo for this data structure.

Implements a Bloom filter to precheck probable membership before hitting a slower backing store.

It demonstrates:
- adds set multiple hash-derived bit positions
- definite negatives are reliable
- positives are only probabilistic and require confirmation elsewhere
