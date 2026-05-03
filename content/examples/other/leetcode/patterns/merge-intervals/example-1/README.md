# Merge Intervals — Implementation Workbench

Implements interval merging by sorting start times and coalescing overlaps — the canonical merge-intervals pattern.

## Files
- `EXPLANATION.md`
- `pattern.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/leetcode/patterns/merge-intervals/example-1/app.js`

## What to Verify
- input is sorted before merging
- overlaps are merged by extending the current end
- non-overlapping intervals remain separate
