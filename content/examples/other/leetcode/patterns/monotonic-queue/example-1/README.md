# Monotonic Queue — Max Sliding Window Workbench

Implements the monotonic queue pattern (deque of indices) for O(n) sliding window maximum.

## Files
- `EXPLANATION.md`
- `pattern.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/leetcode/patterns/monotonic-queue/example-1/app.js`

## What to Verify
- deque maintains decreasing values
- front is always the max for current window
- expired indices are evicted as window advances
