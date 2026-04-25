# Bit Manipulation — Permission Flag Console

Represents feature and permission flags as bit masks so multiple booleans fit in one compact integer.

## Files
- `flags.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/bit-manipulation/example-1/app.js`

## What to Verify
- each flag occupies a stable bit position
- bitwise OR enables permissions and bitwise AND checks them
- compact packing is useful for hot paths and wire efficiency
