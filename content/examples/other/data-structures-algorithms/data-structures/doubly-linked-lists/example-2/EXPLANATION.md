Example 2 focuses on a follow-up scenario that’s commonly asked after the main implementation.

Shows the canonical follow-up pattern where a doubly linked list is paired with a hash map to support O(1) recency updates.

It demonstrates:
- recently used entries move to the head without a full traversal
- eviction naturally happens at the tail
- the list is useful when adjacency mutations dominate
