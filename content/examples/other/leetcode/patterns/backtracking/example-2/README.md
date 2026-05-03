# Backtracking — Follow-Up: Pruning Heuristics

Follow-up: explain how heuristics (MRV, ordering) reduce branching factor in production-grade backtracking.

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/leetcode/patterns/backtracking/example-2/demo.js`

## What to Verify
- choose most constrained variable first (MRV)
- forward-checking prunes early
- timeouts/limits are required for worst-case instances
