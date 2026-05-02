# Count-Min Sketch — Sliding Window Follow-Up

Demonstrates a simple sliding-window approach by rotating multiple sketches, matching common 'last N minutes' telemetry questions.

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/count-min-sketch/example-4/demo.js`

## What to Verify
- older windows are expired by dropping their sketch
- queries aggregate across active window sketches
- memory usage is bounded by the number of retained windows
