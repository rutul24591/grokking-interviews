# HyperLogLog — Unique Visitor Estimator

Implements a compact HyperLogLog-style estimator to approximate unique visitor counts with fixed memory.

## Files
- `hyperloglog.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/hyperloglog/example-1/app.js`

## What to Verify
- items are split into registers by a prefix of their hash
- register values track leading-zero runs
- estimates trade exactness for bounded memory at scale
