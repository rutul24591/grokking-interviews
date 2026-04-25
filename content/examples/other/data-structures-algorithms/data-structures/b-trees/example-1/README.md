# B-Trees — Page-Oriented Index Workbench

Implements a small B-tree insertion flow to demonstrate page-friendly multi-key nodes and split behavior.

## Files
- `btree.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/b-trees/example-1/app.js`

## What to Verify
- nodes hold multiple ordered keys instead of just one
- splits promote a separator key upward when a node overflows
- the structure stays shallow for disk-oriented workloads
