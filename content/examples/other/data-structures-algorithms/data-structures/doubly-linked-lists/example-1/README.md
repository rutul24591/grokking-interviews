# Doubly Linked Lists — Tab Manager with Back and Forward Traversal

Implements a doubly linked list for a tab manager where efficient removal and bidirectional traversal both matter.

## Files
- `list.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/doubly-linked-lists/example-1/app.js`

## What to Verify
- nodes keep both prev and next links in sync
- middle-node removal does not require a full scan from the head
- reverse traversal reads the structure backward without rebuilding state
