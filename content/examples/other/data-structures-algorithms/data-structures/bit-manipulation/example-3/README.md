# Bit Manipulation — Shift and Sign Edge Cases

Covers signed shifts and mask width assumptions so the examples do not silently teach unsafe bit-level habits.

## Files
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/bit-manipulation/example-3/demo.js`

## What to Verify
- left shifts grow values by powers of two until width limits matter
- signed right shift preserves the sign bit
- unsigned coercion is sometimes required for wire-format work
