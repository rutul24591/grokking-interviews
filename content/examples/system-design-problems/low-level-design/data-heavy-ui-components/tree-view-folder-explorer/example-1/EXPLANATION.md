# Tree View / Folder Explorer — Full Implementation (Core Model)

Example 1 implements a production-friendly tree model:

- Lazy loading nodes (async children)
- Expand/collapse state (persistable)
- Move/copy operations with validation (no cycles, permission checks hook)
- Selection model (single/multi)

Interview focus:
- Representing a large tree with stable IDs and parent pointers (avoid deep recursion).
- Avoiding N+1 loads: prefetch and request dedupe.

