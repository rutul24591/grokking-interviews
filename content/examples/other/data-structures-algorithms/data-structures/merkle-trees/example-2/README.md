# Merkle Trees — Inclusion Proof Follow-Up

Explains the follow-up use case of inclusion proofs, where a client verifies one leaf without downloading every chunk.

## Files
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/merkle-trees/example-2/demo.js`

## What to Verify
- a proof carries sibling hashes along the path to the root
- verification recomputes upward from the target leaf
- proof size grows logarithmically with leaf count
