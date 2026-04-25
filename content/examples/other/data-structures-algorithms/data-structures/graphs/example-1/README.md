# Graphs — Service Route Planner

Uses an adjacency-list graph to model service dependencies and shortest unweighted paths across a small platform topology.

## Files
- `graph.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/graphs/example-1/app.js`

## What to Verify
- nodes can have multiple outgoing and incoming connections
- BFS finds the minimum-hop route in an unweighted graph
- the model supports cycles without breaking traversal
