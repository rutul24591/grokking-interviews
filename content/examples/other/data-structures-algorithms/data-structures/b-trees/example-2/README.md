# B-Trees — Node Split Trace Follow-Up

Focuses on node overflow and promotion because that is the critical follow-up discussion for B-tree design.

## Files
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/b-trees/example-2/demo.js`

## What to Verify
- splits happen only when node capacity is exceeded
- the promoted key partitions left and right child ranges
- higher fan-out reduces tree height compared with binary trees
