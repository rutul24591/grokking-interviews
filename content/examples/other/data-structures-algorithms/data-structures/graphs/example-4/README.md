# Graphs — Weighted Shortest Path (Dijkstra)

Adds a weighted-graph follow-up using Dijkstra’s algorithm, which is the natural escalation after BFS shortest paths.

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/graphs/example-4/demo.js`

## What to Verify
- edge weights change path selection versus minimum-hop routing
- the algorithm relies on extracting the next minimum-distance node
- negative weights are invalid for vanilla Dijkstra and should be rejected by design
