# Client-side Data Normalization — Full Implementation

Example 1 implements an entity-normalized client store:

- Entities by type + id
- Relationship handling (store ids, not nested objects)
- Merge strategies for partial updates
- Selector-friendly reads to avoid re-renders

Interview focus:
- Why normalization helps (dedupe, consistent updates, caching).
- How to handle pagination lists + entity updates without copying huge trees.

