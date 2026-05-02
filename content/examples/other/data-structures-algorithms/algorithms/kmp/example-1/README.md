# Knuth–Morris–Pratt (KMP) — KMP Search Workbench

Implements KMP substring search using the LPS (prefix function) table and scans a log string.

## Files
- `EXPLANATION.md`
- `algorithm.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/algorithms/kmp/example-1/app.js`

## What to Verify
- LPS computation is correct for repeated prefixes
- search runs in O(n+m) time
- finds the first match index (or -1 on miss)
