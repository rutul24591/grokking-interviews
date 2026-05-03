# Sliding Window — Implementation Workbench

Implements a fixed-size sliding window to compute max k-length subarray sums (representative for throughput/latency windowing).

## Files
- `EXPLANATION.md`
- `pattern.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/leetcode/patterns/sliding-window/example-1/app.js`

## What to Verify
- window updates are O(1) per step (add right, remove left)
- returns null when k exceeds array length
- works with mixed positive/negative values
