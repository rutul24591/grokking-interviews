# Bloom Filters — Counting Bloom Filter (Deletion)

Implements a counting Bloom filter variant to support deletions safely, which is the key follow-up after plain Bloom limitations.

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/bloom-filters/example-4/demo.js`

## What to Verify
- counters increment and decrement instead of toggling a single bit
- deleting one key does not clear shared membership evidence for others
- counters must be bounded and protected from underflow
