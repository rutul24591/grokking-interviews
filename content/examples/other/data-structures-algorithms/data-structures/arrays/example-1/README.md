# Arrays — Catalog Workbench

Builds a small product catalog workbench on top of a custom dynamic array implementation and exercises append, insert, delete, update, and resize behavior.

## Files
- `dynamic-array.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/arrays/example-1/app.js`

## What to Verify
- capacity doubles only when the array is full
- middle inserts shift existing values without losing order
- removals compact the array and keep contiguous storage
