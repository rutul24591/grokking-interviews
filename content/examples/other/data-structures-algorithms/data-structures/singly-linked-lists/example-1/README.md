# Singly Linked Lists — Event Stream Pipeline

Implements a singly linked list to model an append-heavy event stream where traversal is sequential and inserts at the tail dominate.

## Files
- `list.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/singly-linked-lists/example-1/app.js`

## What to Verify
- tail append stays O(1) with an explicit tail pointer
- removing by id rewires only predecessor.next
- traversal is naturally sequential from head to tail
