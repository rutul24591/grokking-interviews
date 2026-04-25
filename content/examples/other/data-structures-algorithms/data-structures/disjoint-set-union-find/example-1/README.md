# Disjoint Set Union Find — Network Connectivity Console

Implements union-find with path compression and union by rank to track connectivity between network zones.

## Files
- `union-find.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/disjoint-set-union-find/example-1/app.js`

## What to Verify
- find compresses paths to flatten future lookups
- union joins components only when roots differ
- connectivity queries become very cheap after compression
