# Cursor-based Pagination UI — Full Implementation

Example 1 models the UI state for cursor pagination:

- Forward paging with `after` cursor
- Back navigation via cursor stack
- Refresh semantics (invalidating old cursors when query changes)
- Snapshot tokens to keep paging consistent

Interview focus:
- Why cursor pagination is not great for “jump to page 50”.
- How to provide user-friendly navigation anyway (bookmark points, search-within-results).

