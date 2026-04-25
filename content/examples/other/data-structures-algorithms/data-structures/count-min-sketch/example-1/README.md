# Count-Min Sketch — Trending Event Counter

Implements a count-min sketch to approximate event frequencies in a memory-bounded streaming workload.

## Files
- `count-min-sketch.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/count-min-sketch/example-1/app.js`

## What to Verify
- each update increments one counter per row
- the minimum row estimate bounds the answer from above
- the sketch is suited to heavy hitters, not exact counts
