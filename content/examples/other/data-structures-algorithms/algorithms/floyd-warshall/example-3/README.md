# Floyd–Warshall — Edge Cases

Covers missing edges (Infinity) and small graphs so consumers treat unreachable pairs explicitly.

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/algorithms/floyd-warshall/example-3/demo.js`

## What to Verify
- missing edges remain Infinity
- dist[i][i] is zero when no negative cycles exist
- empty edge sets behave safely
