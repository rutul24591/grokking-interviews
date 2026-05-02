# Tarjan’s SCC — Edge Cases

Covers self-loops, isolated nodes, and disconnected graphs.

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/algorithms/tarjans-scc/example-3/demo.js`

## What to Verify
- isolated nodes form SCCs of size 1
- self-loops still produce SCC size 1 but represent a cycle
- disconnected components are handled by outer iteration
