# Arrays — Boundary and Resize Checks

Exercises empty-array, bounds, and resize edge cases so failures are explicit instead of silently corrupting contiguous storage.

## Files
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/arrays/example-3/demo.js`

## What to Verify
- out-of-bounds writes throw instead of mutating the wrong slot
- capacity growth preserves prior elements
- removing from an empty structure is rejected clearly
