# Bellman–Ford — Shortest Path with Negative Weights

Implements Bellman–Ford and demonstrates shortest paths even with negative weights (when no negative cycle exists).

## Files
- `EXPLANATION.md`
- `algorithm.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/algorithms/bellman-ford/example-1/app.js`

## What to Verify
- relaxation runs V-1 times over all edges
- supports negative weights
- detects negative cycles by checking for additional relaxation
