# Disjoint Set Union Find — Repeated Union and Invalid Input Checks

Covers repeated unions and invalid references so the structure behaves predictably in operational code paths.

## Files
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/disjoint-set-union-find/example-3/demo.js`

## What to Verify
- repeated union on the same component is a no-op
- unknown nodes should be rejected by application guards
- connectivity semantics stay stable across redundant operations
