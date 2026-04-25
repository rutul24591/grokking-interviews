# Count-Min Sketch — Collision Bias Checks

Makes the overestimation property explicit so edge cases do not get mistaken for exact counting semantics.

## Files
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/count-min-sketch/example-3/demo.js`

## What to Verify
- estimates never undershoot true counts in this sketch
- collisions inflate some keys
- exact answers still need a different data structure
