Example 1 is a production-style implementation demo for this data structure.

Implements union-find with path compression and union by rank to track connectivity between network zones.

It demonstrates:
- find compresses paths to flatten future lookups
- union joins components only when roots differ
- connectivity queries become very cheap after compression
