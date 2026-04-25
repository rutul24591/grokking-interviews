# Bloom Filters — False Positive Follow-Up

Shows how false positives appear once the bitset becomes crowded, which is the core operational trade-off of Bloom filters.

## Files
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/bloom-filters/example-2/demo.js`

## What to Verify
- more inserted keys increase collision pressure
- a positive result may still be wrong
- bitset size and hash count determine practical error rates
