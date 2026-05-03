# Top-K Elements — Bounded-Heap Top-K Workbench

Implements the top-k elements pattern using a bounded min-heap for streaming-friendly ranking.

## Files
- `EXPLANATION.md`
- `pattern.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/leetcode/patterns/top-k-elements/example-1/app.js`

## What to Verify
- heap holds at most k items
- final items represent top-k (order not guaranteed without sorting)
- memory is bounded regardless of input size
