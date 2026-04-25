# Hash Tables — Missing Keys and Update Checks

Checks the operational edges around absent keys and updates because the table must behave predictably even when reads miss.

## Files
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/hash-tables/example-3/demo.js`

## What to Verify
- missing keys resolve to null explicitly
- idempotent updates keep only one logical record per key
- bucket scans remain bounded to the chosen bucket
