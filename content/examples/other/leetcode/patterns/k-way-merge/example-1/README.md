# K-Way Merge — Merge K Sorted Arrays

Implements the k-way merge pattern using a min-heap to merge multiple sorted arrays efficiently.

## Files
- `EXPLANATION.md`
- `pattern.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/leetcode/patterns/k-way-merge/example-1/app.js`

## What to Verify
- heap always exposes the smallest next candidate
- runs in O(n log k) for n total elements
- handles empty sources gracefully
