# Arrays — Sliding Window Analytics

Uses array indexing for a moving latency window and shows why arrays are strong when reads are dense and positional access matters.

## Files
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/arrays/example-2/demo.js`

## What to Verify
- window evicts oldest values in insertion order
- running average uses deterministic index arithmetic
- dense reads remain simple compared with pointer-heavy structures
