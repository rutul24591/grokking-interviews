Example 1 is a production-style implementation demo for this Leetcode pattern.

Implements union-find with path compression and union by rank for connectivity queries.

It demonstrates:
- union merges components only when roots differ
- find compresses paths to flatten trees
- connected queries become near O(1) amortized
