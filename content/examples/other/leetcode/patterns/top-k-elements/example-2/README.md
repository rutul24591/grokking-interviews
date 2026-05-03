# Top-K Elements — Follow-Up: Quickselect Alternative

Follow-up: discuss Quickselect as an O(n) average alternative when you only need the kth element once.

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/leetcode/patterns/top-k-elements/example-2/demo.js`

## What to Verify
- heap is better for streaming / multiple queries
- quickselect is better for one-shot selection
- quickselect should validate `k` and handle duplicates/ties predictably
