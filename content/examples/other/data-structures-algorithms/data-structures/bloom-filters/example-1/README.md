# Bloom Filters — Cache Admission Precheck

Implements a Bloom filter to precheck probable membership before hitting a slower backing store.

## Files
- `bloom-filter.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/bloom-filters/example-1/app.js`

## What to Verify
- adds set multiple hash-derived bit positions
- definite negatives are reliable
- positives are only probabilistic and require confirmation elsewhere
