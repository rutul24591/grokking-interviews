# HyperLogLog — Small-Cardinality Checks

Calls out the small-range weakness where approximate estimators are least comfortable and exact sets may be cheaper.

## Files
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/hyperloglog/example-3/demo.js`

## What to Verify
- very small cardinalities can be over- or under-estimated
- exact sets are often preferable before scale justifies approximation
- register precision is a configurable trade-off
