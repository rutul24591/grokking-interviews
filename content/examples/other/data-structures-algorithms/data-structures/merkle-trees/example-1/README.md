# Merkle Trees — Artifact Integrity Verifier

Builds a Merkle tree over file chunks so integrity can be validated from a single root hash.

## Files
- `merkle.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/merkle-trees/example-1/app.js`

## What to Verify
- leaf hashes represent chunk content
- internal hashes summarize child hashes recursively
- a root mismatch proves some chunk changed
