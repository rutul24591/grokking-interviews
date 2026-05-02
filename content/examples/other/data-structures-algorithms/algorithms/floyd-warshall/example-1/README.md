# Floyd–Warshall — All-Pairs Shortest Paths

Implements Floyd–Warshall to compute all-pairs shortest paths on a dense graph.

## Files
- `EXPLANATION.md`
- `algorithm.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/algorithms/floyd-warshall/example-1/app.js`

## What to Verify
- DP over intermediate nodes progressively improves distances
- supports negative edges (but not negative cycles without extra checks)
- O(V^3) complexity is explicit and appropriate for small dense graphs
