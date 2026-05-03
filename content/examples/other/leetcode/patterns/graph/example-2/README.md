# Graph — Follow-Up: Weighted Graphs

Follow-up: explain when BFS is invalid (weighted edges) and why Dijkstra/Bellman–Ford are needed.

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/leetcode/patterns/graph/example-2/demo.js`

## What to Verify
- BFS is correct only when all edges have equal weight
- Dijkstra requires non-negative weights
- Bellman–Ford handles negative weights (and detects negative cycles)
