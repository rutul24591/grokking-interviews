Example 1 is a production-style implementation demo for this data structure.

Uses two stacks to back an editor-style undo and redo workflow, which is the production pattern most engineers recognize immediately.

It demonstrates:
- push and pop obey strict LIFO ordering
- redo history clears when a fresh mutation arrives
- state reconstruction is deterministic from stack history
