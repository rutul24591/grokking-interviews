# Prim’s MST — Follow-Up: Dense vs Sparse Trade-offs

Explains when Prim’s (frontier-based) is preferable versus Kruskal’s (edge-sorting) depending on graph density.

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/algorithms/prims-mst/example-2/demo.js`

## What to Verify
- dense graphs often favor Prim with adjacency structures
- sparse graphs often favor Kruskal with sorted edges + union-find
- implementation choice affects constant factors more than asymptotics in small graphs
