# Floyd–Warshall — Follow-Up: Negative Cycle Check

Shows how to detect negative cycles by inspecting the diagonal after running Floyd–Warshall.

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/algorithms/floyd-warshall/example-2/demo.js`

## What to Verify
- dist[i][i] < 0 implies a negative cycle reachable from i
- results are not meaningful if negative cycles exist
- production code should surface cycle presence clearly
