# Topological Sort — Edge Cases (Cycle Detection)

Shows the critical edge case: cycles mean no topological order exists and must be reported.

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/algorithms/topological-sort/example-3/demo.js`

## What to Verify
- cycles prevent processing all nodes
- null output indicates cycle presence
- production code should surface the cycle (or the remaining nodes) for debugging
