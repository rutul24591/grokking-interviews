# B-Trees — Duplicate and Missing-Key Checks

Validates edge conditions around repeated inserts and shallow trees so correctness is not assumed only for balanced happy paths.

## Files
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/b-trees/example-3/demo.js`

## What to Verify
- duplicate keys remain visible to application policy decisions
- small trees may stay leaf-only with no split
- search expectations must define duplicate handling explicitly
