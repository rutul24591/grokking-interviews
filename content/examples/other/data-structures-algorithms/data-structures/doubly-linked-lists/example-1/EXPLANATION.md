Example 1 is a production-style implementation demo for this data structure.

Implements a doubly linked list for a tab manager where efficient removal and bidirectional traversal both matter.

It demonstrates:
- nodes keep both prev and next links in sync
- middle-node removal does not require a full scan from the head
- reverse traversal reads the structure backward without rebuilding state
