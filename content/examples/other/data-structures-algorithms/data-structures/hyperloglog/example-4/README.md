# HyperLogLog — Register Precision Follow-Up

Compares two sketches with different register counts to show how precision trades off against memory.

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/hyperloglog/example-4/demo.js`

## What to Verify
- more registers generally reduce variance on large sets
- memory usage grows with register count
- the estimator remains approximate regardless of precision
