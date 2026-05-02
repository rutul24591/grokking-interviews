# Topological Sort — Follow-Up: Multiple Valid Orders

Highlights that topological ordering may not be unique; deterministic output needs tie-breaking policy.

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/algorithms/topological-sort/example-2/demo.js`

## What to Verify
- multiple nodes can have indegree 0 at once
- tie-breaking (lexicographic) yields deterministic order
- different valid orders still satisfy dependency constraints
