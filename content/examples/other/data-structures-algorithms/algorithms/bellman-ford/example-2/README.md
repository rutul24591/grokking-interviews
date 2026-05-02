# Bellman–Ford — Follow-Up: Negative Cycle Detection

Adds a negative-cycle example because this is the key differentiator of Bellman–Ford in interviews and production.

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/algorithms/bellman-ford/example-2/demo.js`

## What to Verify
- a final relaxation pass detects a reachable negative cycle
- distances are not meaningful when a negative cycle exists
- production code should surface a structured error
