# Topological Sort — Dependency Ordering Workbench

Implements Kahn’s algorithm for topological sorting of a DAG and prints a valid build/deploy order.

## Files
- `EXPLANATION.md`
- `algorithm.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/algorithms/topological-sort/example-1/app.js`

## What to Verify
- nodes with indegree 0 are processed first
- each edge reduces indegree of its neighbor
- order contains all nodes when the graph is acyclic
