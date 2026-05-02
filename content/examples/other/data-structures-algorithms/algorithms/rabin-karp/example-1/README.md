# Rabin–Karp — Rabin–Karp Workbench

Implements Rabin–Karp using a rolling hash and verifies matches to avoid false positives.

## Files
- `EXPLANATION.md`
- `algorithm.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/algorithms/rabin-karp/example-1/app.js`

## What to Verify
- rolling hash updates in O(1) per step
- hash matches are verified by substring compare
- demonstrates expected-case fast scanning
