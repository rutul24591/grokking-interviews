# Doubly Linked Lists — Move-To-Front Cache Follow-Up

Shows the canonical follow-up pattern where a doubly linked list is paired with a hash map to support O(1) recency updates.

## Files
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/doubly-linked-lists/example-2/demo.js`

## What to Verify
- recently used entries move to the head without a full traversal
- eviction naturally happens at the tail
- the list is useful when adjacency mutations dominate
