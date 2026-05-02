# Merkle Trees — Diff Discovery Follow-Up

Shows how Merkle trees help narrow down which chunk changed by comparing subtree hashes top-down.

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/merkle-trees/example-4/demo.js`

## What to Verify
- a mismatch at the root implies some leaf differs
- comparing children hashes narrows the divergent subtree
- the process is logarithmic in leaf count when trees are balanced
