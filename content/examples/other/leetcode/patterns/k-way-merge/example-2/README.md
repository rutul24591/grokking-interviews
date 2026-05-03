# K-Way Merge — Follow-Up: Kth Smallest in Sorted Matrix

Follow-up: use k-way merge idea to get kth smallest from row-sorted sources by pushing next candidates.

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/leetcode/patterns/k-way-merge/example-2/demo.js`

## What to Verify
- stops after k pops (doesn’t merge everything)
- heap size is bounded by number of rows
- works when each row is individually sorted
