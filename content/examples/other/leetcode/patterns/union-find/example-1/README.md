# Union-Find — Connectivity Workbench

Implements union-find with path compression and union by rank for connectivity queries.

## Files
- `EXPLANATION.md`
- `pattern.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/leetcode/patterns/union-find/example-1/app.js`

## What to Verify
- union merges components only when roots differ
- find compresses paths to flatten trees
- connected queries become near O(1) amortized
