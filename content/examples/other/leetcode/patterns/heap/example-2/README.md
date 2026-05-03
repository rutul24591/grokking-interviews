# Heap — Follow-Up: Merge K Sorted Lists/Arrays

Follow-up: use a heap to merge k sorted sources efficiently (k-way merge pattern).

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/leetcode/patterns/heap/example-2/demo.js`

## What to Verify
- heap stores the next candidate from each source
- each pop/push advances one source
- runs in O(n log k) where n is total elements
