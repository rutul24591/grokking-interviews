# Monotonic Queue — Follow-Up: Min Sliding Window

Follow-up: invert the comparator to compute sliding window minimum (same pattern, reversed monotonicity).

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/leetcode/patterns/monotonic-queue/example-2/demo.js`

## What to Verify
- deque maintains increasing values for min
- same eviction rules apply
- duplicates are handled deterministically (>= vs >)
