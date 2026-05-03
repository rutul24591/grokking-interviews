# Graph — BFS Shortest Path Workbench

Implements BFS on an unweighted graph to find a minimum-hop path and reconstructs it via a parent map.

## Files
- `EXPLANATION.md`
- `pattern.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/leetcode/patterns/graph/example-1/app.js`

## What to Verify
- BFS guarantees minimum hops in unweighted graphs
- parent map reconstructs a valid path
- visited set prevents infinite loops on cycles
