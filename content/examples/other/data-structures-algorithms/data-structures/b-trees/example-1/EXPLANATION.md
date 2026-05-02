Example 1 is a production-style implementation demo for this data structure.

Implements a small B-tree insertion flow to demonstrate page-friendly multi-key nodes and split behavior.

It demonstrates:
- nodes hold multiple ordered keys instead of just one
- splits promote a separator key upward when a node overflows
- the structure stays shallow for disk-oriented workloads
