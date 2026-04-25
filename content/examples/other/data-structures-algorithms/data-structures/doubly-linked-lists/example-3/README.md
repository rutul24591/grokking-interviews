# Doubly Linked Lists — Empty and Single-Node Checks

Validates the pointer transitions that usually break first: removing the only node, removing the head, and removing the tail.

## Files
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/doubly-linked-lists/example-3/demo.js`

## What to Verify
- single-node delete clears both head and tail
- head removal preserves backward links
- tail removal preserves forward links
