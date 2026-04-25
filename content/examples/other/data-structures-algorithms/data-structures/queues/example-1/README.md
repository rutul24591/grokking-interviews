# Queues — Job Dispatch Queue

Implements a circular-buffer queue to model a worker dispatcher where enqueue and dequeue happen continuously under load.

## Files
- `queue.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/queues/example-1/app.js`

## What to Verify
- head and tail wrap around the buffer correctly
- FIFO ordering is preserved across many operations
- capacity checks reject overflow explicitly
