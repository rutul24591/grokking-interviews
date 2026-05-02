# Prim’s MST — Edge Cases (Disconnected Graphs)

Shows the forest behavior when the graph is disconnected so production code can detect partial coverage.

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/algorithms/prims-mst/example-3/demo.js`

## What to Verify
- disconnected nodes cannot be reached from the chosen start
- output covers only the reachable component
- production code should detect visited coverage
