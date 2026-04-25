# Singly Linked Lists — Head and Tail Edge Cases

Covers the fragile transitions around empty lists, single-node lists, and tail deletion where pointer bugs usually appear first.

## Files
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/singly-linked-lists/example-3/demo.js`

## What to Verify
- removing the head updates the list root correctly
- removing the last node resets both head and tail
- missing-item deletes are harmless and explicit
