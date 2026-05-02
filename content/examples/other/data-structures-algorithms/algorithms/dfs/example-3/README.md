# Depth-First Search (DFS) — Edge Cases and Defensive Checks

Covers cycles, self-loops, and disconnected graphs to ensure traversal code stays safe on real inputs.

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/algorithms/dfs/example-3/demo.js`

## What to Verify
- self-loops do not cause infinite traversal
- cycles are handled via visited-set guards
- disconnected graphs return partial visitation as expected
