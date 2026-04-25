# Count-Min Sketch — Heavy Hitter Follow-Up

Uses sketch estimates to rank likely heavy hitters, which is the natural follow-up after the basic counting workflow.

## Files
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/count-min-sketch/example-2/demo.js`

## What to Verify
- frequent keys stand out despite approximation noise
- ordering can still be useful even when exact counts are unavailable
- sketches are especially practical for bounded-memory telemetry
