# Queues — Edge Cases

Covers empty queue behavior and memory compaction guardrails.

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/leetcode/patterns/queues/example-3/demo.js`

## What to Verify
- dequeue on empty returns null
- head index compaction avoids unbounded array growth
- works under long-running workloads
