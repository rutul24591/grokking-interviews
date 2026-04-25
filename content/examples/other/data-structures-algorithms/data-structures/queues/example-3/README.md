# Queues — Wraparound and Empty-State Checks

Exercises wraparound, overflow, and underflow behavior because queue pointer bugs usually appear only after many cycles.

## Files
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/queues/example-3/demo.js`

## What to Verify
- tail wraps to index zero after hitting capacity
- overflow is explicit instead of overwriting live entries
- underflow is explicit instead of reading stale slots
