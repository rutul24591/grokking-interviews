# Boyer–Moore — Boyer–Moore Workbench

Implements the bad-character heuristic to skip ahead during substring search.

## Files
- `EXPLANATION.md`
- `algorithm.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/algorithms/boyer-moore/example-1/app.js`

## What to Verify
- bad-character table drives skip distances
- search finds match index (or -1)
- skips reduce comparisons on typical text
