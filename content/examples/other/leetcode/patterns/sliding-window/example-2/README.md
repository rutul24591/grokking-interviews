# Sliding Window — Follow-Up: Variable-Size Window

Implements the common follow-up: smallest subarray length with sum >= target (variable-size window).

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/leetcode/patterns/sliding-window/example-2/demo.js`

## What to Verify
- left pointer shrinks only when the constraint is satisfied
- returns 0 when no window meets the target
- monotonic left advancement keeps O(n) time
