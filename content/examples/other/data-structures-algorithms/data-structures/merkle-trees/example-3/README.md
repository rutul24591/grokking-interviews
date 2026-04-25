# Merkle Trees — Odd-Leaf and Update Checks

Covers odd leaf counts and partial updates because those operational details are easy to skip but matter in practice.

## Files
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/merkle-trees/example-3/demo.js`

## What to Verify
- odd levels duplicate the last hash or use an equivalent policy
- changing one leaf only invalidates hashes on its path
- root stability depends on deterministic leaf ordering
