# Tarjan’s SCC — SCC Workbench

Implements Tarjan’s algorithm to find strongly connected components in a directed graph.

## Files
- `EXPLANATION.md`
- `algorithm.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/algorithms/tarjans-scc/example-1/app.js`

## What to Verify
- lowlink values capture back-edges
- stack membership tracks the current DFS component
- SCCs are emitted when a root is discovered
