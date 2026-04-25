# Queues — Priority Lane Follow-Up

Shows a multi-queue follow-up where urgent work bypasses standard work without abandoning FIFO guarantees inside each lane.

## Files
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/queues/example-2/demo.js`

## What to Verify
- urgent tasks drain before standard tasks
- each lane still preserves insertion order
- the pattern scales into explicit scheduler policies
