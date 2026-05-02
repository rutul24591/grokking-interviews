# Tarjan’s SCC — Follow-Up: Condensation Graph

Explains the condensation DAG and why SCCs are a key step before topological ordering in dependency graphs.

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/algorithms/tarjans-scc/example-2/demo.js`

## What to Verify
- each SCC collapses into a single node in the condensation graph
- condensation graph is always a DAG
- useful for build systems, dependency analysis, and deadlock detection
