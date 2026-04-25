# Bloom Filters — Deletion and Reset Checks

Calls out the edge-case limitation that plain Bloom filters do not support safe deletion without a counting variant.

## Files
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/bloom-filters/example-3/demo.js`

## What to Verify
- resetting the filter clears every prior membership hint
- safe deletion requires counters, not just bits
- operational lifecycle must account for rebuild or rotation
