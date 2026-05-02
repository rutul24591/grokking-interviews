# Dijkstra — Follow-Up: Priority Queue Optimization

Explains the standard optimization: use a min-priority-queue so selecting the next node is O(log n) instead of O(n).

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/algorithms/dijkstra/example-2/demo.js`

## What to Verify
- complexity improves from O(V^2) to O((V+E) log V)
- priority queue must support decrease-key (or push duplicates + ignore stale entries)
- graph density influences whether the optimization matters
