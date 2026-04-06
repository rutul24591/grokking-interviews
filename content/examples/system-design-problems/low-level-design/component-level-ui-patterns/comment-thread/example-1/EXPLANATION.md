# Comment Thread System — Implementation Walkthrough

## Architecture Overview

This implementation follows a **flat store + derived tree + recursive rendering** pattern:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CommentThread (root)                         │
│  ┌───────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │  useCommentThread  │  │ useCommentActions│  │ CommentStore     │ │
│  │  (fetch, paginate, │  │ (optimistic CRUD │  │ (flat list,      │ │
│  │   WebSocket)       │  │  with rollback)  │  │  collapse state) │ │
│  └────────┬──────────┘  └────────┬─────────┘  └────────┬─────────┘ │
│           │                      │                      │           │
│           ▼                      ▼                      ▼           │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    comment-tree-utils.ts                      │  │
│  │              (flat → tree derivation, depth calc)             │  │
│  └────────────────────────────┬──────────────────────────────────┘  │
│                               │                                     │
│                    ┌──────────┴──────────┐                         │
│                    ▼                     ▼                         │
│            CommentNode           CommentNode (recursive)           │
│            (depth 0)            (depth 1, 2, 3, 4, 5)              │
└─────────────────────────────────────────────────────────────────────┘
```

### Design Decisions

1. **Flat store with parent references** — Comments are stored as a `Record<string, CommentNode>` keyed by ID. Each comment has a `parentId` and `childrenIds` array. This makes inserts, updates, and deletes O(1) — you only touch the affected record and its direct parent. The tree structure is derived on-demand via `buildTree()`.

2. **Optimistic UI with rollback** — Every mutation (post, edit, delete, like) first snapshots the current state, applies the optimistic change, fires the API call, and on failure restores the snapshot. This ensures the UI is always consistent even under network failure.

3. **Recursive component rendering** — `CommentNode` renders itself and recursively renders its children. Indentation is handled via CSS (`ml-6 border-l-2`), creating the visual thread line.

4. **Lazy loading with collapse/expand** — Child comments are not fetched until the user expands a collapsed thread. This drastically reduces initial data transfer and render cost.

## File Structure

```
example-1/
├── lib/
│   ├── comment-types.ts       # TypeScript interfaces, constants
│   ├── comment-store.ts       # Zustand store with optimistic updates
│   └── comment-tree-utils.ts  # Flat-to-tree conversion, depth calc
├── services/
│   └── comment-api.ts         # API layer (fetch wrappers)
├── hooks/
│   ├── use-comment-thread.ts  # Thread orchestration (fetch, WS, pagination)
│   └── use-comment-actions.ts # Optimistic action dispatch with rollback
├── components/
│   ├── comment-thread.tsx     # Root thread renderer
│   ├── comment-node.tsx       # Recursive comment with replies
│   ├── comment-form.tsx       # Inline reply/edit form
│   ├── comment-actions.tsx    # Like, reply, edit, delete buttons
│   └── load-more.tsx          # Pagination button
└── EXPLANATION.md             # This file
```

## Key Implementation Details

### Comment Types (lib/comment-types.ts)

Defines the core data model:

- **`CommentNode`**: The comment entity with `id`, `parentId`, `author`, `content` (sanitized HTML), `likeCount`, `hasLiked`, timestamps, `isEdited`, `isOptimistic`, `isDeleted`, `childrenIds`, and `depth`.
- **`CommentAction`**: Discriminated union covering all mutations (POST, EDIT, DELETE, LIKE, ROLLBACK) with their payloads.
- **`ThreadState`**: The flat store shape with comments record, rootIds, collapsedThreads set, pagination metadata, rollback snapshots, pending requests map, and buffered comments for WebSocket updates targeting unloaded parents.
- **`MAX_DEPTH = 5`**: Maximum nesting depth. Replies beyond this are flattened.

### Zustand Store (lib/comment-store.ts)

The store is the single source of truth. Key aspects:

- **`setComments`**: Replaces the entire comment set (used on initial fetch). Builds rootIds from comments with `parentId === null`.
- **`appendComments`**: Appends paginated comments to the existing set (used on "Load More").
- **`addChildComments`**: Adds lazy-loaded children to the store. If the parent is not loaded, children are buffered in `bufferedComments`.
- **`applyOptimisticInsert`**: Creates an optimistic comment with `id: "optimistic-{uuid}"`, inserts it into the store, and adds it to the parent's childrenIds (or rootIds if it's a root comment).
- **`confirmOptimisticInsert`**: Replaces the optimistic comment with the server-returned comment, updating all references (rootIds, parent's childrenIds).
- **`rollbackMutation`**: Restores the snapshot for a given commentId and clears the snapshot.
- **`snapshotComment`**: Saves the current state of a comment before mutation.
- **`toggleCollapse`**: Toggles a comment ID in the `collapsedThreads` Set.
- **`mergeWebSocketUpdate`**: Handles real-time updates. Supports NEW_REPLY, NEW_ROOT, COMMENT_EDITED, and COMMENT_DELETED message types. For deletions, re-roots children to the grandparent. For replies to unloaded parents, buffers the comment.

The store uses immutable updates (creating new objects) so that Zustand selectors can detect changes via referential equality.

### Tree Utilities (lib/comment-tree-utils.ts)

Pure, side-effect-free functions:

- **`buildTree`**: Converts the flat list to a nested structure. Enforces MAX_DEPTH — nodes beyond the limit are attached as `_flattenedChildren` for "see more replies" rendering.
- **`calculateDepths`**: Computes depth for each node by walking up the parent chain. Includes cycle detection.
- **`getVisibleNodeIds`**: Returns the ordered list of comment IDs that should be rendered, skipping collapsed threads and nodes beyond MAX_DEPTH.
- **`flattenSubtree`**: BFS traversal that flattens a subtree into a flat list (used for "see more replies").

### API Service (services/comment-api.ts)

Thin wrapper around `fetch` with:

- **`fetchThread(cursor, limit)`**: Paginated root comments. Returns `{ comments, nextCursor, hasMore }`.
- **`fetchChildren(parentId)`**: Lazy-loaded children for a specific parent.
- **`postComment({ parentId, content })`**: Creates a new comment.
- **`editComment({ commentId, content })`**: Updates an existing comment.
- **`deleteComment(commentId)`**: Soft-deletes a comment.
- **`likeComment(commentId)`**: Toggles like. Returns updated count and state.

All functions use a shared `request<T>` helper that normalizes errors into `{ message, status, retryable }` shape.

### useCommentThread Hook (hooks/use-comment-thread.ts)

Orchestrates data fetching and WebSocket:

1. **Initial fetch**: Calls `fetchThread(null, pageSize)` on mount. Aborts on unmount.
2. **Pagination**: `loadMore()` calls `fetchThread(cursor, pageSize)` with the current cursor and appends results.
3. **Lazy loading**: `loadChildren(parentId)` calls `fetchChildren(parentId)` and dispatches to the store.
4. **WebSocket**: Connects to `wsUrl` on mount. Parses incoming `WebSocketMessage` and dispatches to `mergeWebSocketUpdate`. Handles disconnect with exponential backoff (1s, 2s, 4s, ..., max 30s). Cleans up on unmount.

### useCommentActions Hook (hooks/use-comment-actions.ts)

Wraps the optimistic-update-with-rollback pattern:

Each action follows the same flow:
1. **Snapshot**: `snapshotComment(commentId, comment)` saves the pre-mutation state.
2. **Optimistic update**: `updateComment` applies the change immediately.
3. **API call**: The actual network request fires.
4. **On success**: Update with server-returned values.
5. **On failure**: `rollbackMutation` restores the snapshot. `onError` callback fires with retry function.

For **handlePost**, the flow is:
1. Generate `optimisticId = "optimistic-{uuid}"`.
2. `applyOptimisticInsert` adds the optimistic comment to the store.
3. API call fires.
4. On success: `confirmOptimisticInsert` replaces the optimistic entry with the server comment.
5. On failure: Remove the optimistic comment from the store.

### Comment Thread Component (components/comment-thread.tsx)

Root renderer that:
- Subscribes to `comments`, `rootIds`, `hasMore`, `isLoading` from the store.
- Uses `useMemo` to derive the tree via `buildTree` (only re-runs when comments or rootIds change).
- Renders each root comment as a `CommentNode`.
- Renders the `LoadMore` button if `hasMore` is true.
- Uses `role="feed"` and `aria-busy` for accessibility.

### Comment Node Component (components/comment-node.tsx)

Recursive component rendering a single comment:
- Displays author info (avatar, username, formatted timestamp, edited indicator).
- Renders content via `dangerouslySetInnerHTML` (content is pre-sanitized).
- Shows "Posting..." indicator for optimistic comments.
- Action buttons (like, reply, edit, delete) wired to `CommentActions`.
- Collapse/expand toggle button if children exist.
- Conditionally renders children based on collapsed state.
- Handles flattened children (beyond MAX_DEPTH) with "see more replies" link.
- Inline `CommentForm` for reply and edit modes.

### Comment Form Component (components/comment-form.tsx)

Inline form with:
- Textarea with character count (max 5000).
- Validation: non-empty, within limit.
- Ctrl/Cmd+Enter to submit, Escape to cancel.
- Error messages displayed below the textarea.
- `aria-invalid` and `aria-describedby` for accessibility.

### Comment Actions Component (components/comment-actions.tsx)

Action button row:
- Like button with count and filled/unfilled state.
- Reply button (hidden if depth >= 5).
- Edit button (owner only).
- Delete button (owner only, red color).
- All buttons have descriptive `aria-label` attributes.

### Load More Component (components/load-more.tsx)

Pagination button:
- Subscribes to `hasMore` and `isLoading` from the store.
- Shows loading spinner during fetch.
- Hidden when no more comments available.

## Usage

### 1. Wire up the thread in your page

```tsx
'use client';

import { CommentThread } from '@/components/comment-thread';
import { useCommentThread } from '@/hooks/use-comment-thread';
import { useCommentActions } from '@/hooks/use-comment-actions';

export default function ThreadPage({ threadId }: { threadId: string }) {
  const { isLoading, error, loadMore, loadChildren } = useCommentThread({
    threadId,
    wsUrl: `wss://api.example.com/comments/${threadId}/ws`,
  });

  const { handleLike, handleEdit, handleDelete, handlePost } = useCommentActions({
    currentUserId: 'user-123',
    onError: (message, retryable, retry) => {
      // Show toast notification
      console.error(message, retryable, retry);
    },
  });

  if (error) return <div>Error: {error}</div>;

  return <CommentThread />;
}
```

### 2. Wire actions into CommentNode

In the actual implementation, `CommentNode` receives action callbacks from the parent via props or context. The example shows simplified handlers — in production, wire `handleLike`, `handleEdit`, etc. through the component tree.

## Edge Cases Handled

| Scenario | Handling |
|----------|----------|
| Navigate away during post | AbortController cancels in-flight request; optimistic comments cleaned on unmount |
| WebSocket reply for unloaded parent | Comment buffered in `bufferedComments`; flushed when parent is loaded |
| Concurrent edits | Last-write-wins via server timestamp; UI updates with server version |
| Deleted parent with visible children | Children re-rooted to grandparent or become root comments |
| Rapid like clicks | Each like is a separate API call; debouncing can be added at the API layer |
| XSS in comment content | Content sanitized server-side; client renders via dangerouslySetInnerHTML with pre-sanitized HTML |
| Reply beyond max depth | Flattened and shown via "see more replies" link |

## Performance Characteristics

- **addComment (flat store)**: O(1) — record insert
- **buildTree (derive)**: O(n) — single pass, memoized via useMemo
- **editComment**: O(1) — record update
- **deleteComment**: O(k) — re-root k children (k typically < 20)
- **likeComment**: O(1) — increment counter
- **getVisibleNodes**: O(n) — walk + filter collapsed
- **WebSocket merge**: O(1) — record insert

## Testing Strategy

1. **Unit tests**: Test store actions (applyOptimisticInsert, confirmOptimisticInsert, rollbackMutation) with mocked state. Test tree utilities with known inputs/outputs.
2. **Integration tests**: Render CommentThread, mock fetch, assert optimistic comment appears, then is confirmed or rolled back. Test WebSocket message handling.
3. **Accessibility tests**: Run axe-core on rendered thread, verify aria-live regions, role attributes, keyboard navigation.
4. **Edge case tests**: Navigate away during post, rapid like clicks, XSS content, WebSocket disconnect/reconnect.
