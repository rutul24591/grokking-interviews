# Sudoku Solver — Follow-Up: Heuristics

Explains MRV/constraint propagation heuristics that reduce branching factor in production-grade solvers.

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/algorithms/sudoku-solver/example-2/demo.js`

## What to Verify
- most-constrained-cell-first reduces branching
- forward-checking prunes earlier
- heuristics dominate performance on hard instances
