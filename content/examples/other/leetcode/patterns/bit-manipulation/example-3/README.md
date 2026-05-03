# Bit Manipulation — Edge Cases: JS 32-bit Bitwise Semantics

Covers the practical pitfall that JS bitwise operators operate on signed 32-bit integers.

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/leetcode/patterns/bit-manipulation/example-3/demo.js`

## What to Verify
- right shift preserves sign (>>), unsigned shift (>>>) does not
- values are truncated to 32-bit for bitwise ops
- use BigInt for wider-than-32-bit bitwise work
