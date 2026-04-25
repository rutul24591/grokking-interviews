# Heaps & Priority Queues — Top-K Stream Follow-Up

Uses a bounded heap for top-k ranking, which is the usual follow-up when interviewers pivot from scheduling to streaming analytics.

## Files
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/heaps-priority-queues/example-2/demo.js`

## What to Verify
- the heap retains only the k largest values seen so far
- bounded memory is maintained regardless of stream length
- the root tracks the current threshold for admission
