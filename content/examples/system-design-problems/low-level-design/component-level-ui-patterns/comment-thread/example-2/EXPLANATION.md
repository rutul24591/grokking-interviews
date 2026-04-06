# Comment Thread — Example 2: Edge Cases & Advanced Scenarios

## Overview

These examples cover two critical challenges in comment thread implementations: optimistic UI with failure rollback, and managing deeply nested comment trees.

---

## 1. Optimistic Rollback (`optimistic-rollback.ts`)

### The Problem

When a user posts a comment, we want it to appear **immediately** (optimistic UI). But if the server request fails:
1. The comment is visible in the UI but not persisted
2. The user's content is lost if we simply remove it
3. The user has to re-type and re-submit

### The Solution

A state machine for each comment's lifecycle:

```
pending → published (server confirmed)
pending → failed (server error, content preserved)
failed → retrying → published (retry succeeded)
failed → failed (retry also failed, max retries reached)
failed → discarded (user chose to discard)
```

**Key design decisions:**

**Optimistic IDs:** Before the server returns a real ID, we use a generated optimistic ID (`opt_<timestamp>_<random>`). On success, we swap it for the server ID.

**Content preservation:** Failed comments retain their content. The user can edit the content before retrying if needed.

**Exponential backoff:** Retries use `2^attempt * baseMs` delay, capped at 30 seconds. This prevents hammering a struggling server.

**Duplicate detection:** A content+author hash prevents posting the same comment twice. If the server responds late (after a retry), we detect the duplicate and discard the late response.

**In-flight tracking:** A `Set<optimisticId>` tracks pending requests. If the user navigates away, we cancel the request and ignore the response.

### Interview Talking Points

- **What if the server succeeds after the user discarded?** The duplicate hash prevents the late response from re-adding the comment. The server-side duplicate is harmless (same content from same author).
- **Max retries:** Default is 3. After that, the comment stays in "failed" state permanently. The user can manually retry if they want.
- **Why not auto-retry immediately?** Network errors are often transient but need time to resolve. Backoff gives the server time to recover.

---

## 2. Deep Nesting Collapse (`deep-nesting-collapse.ts`)

### The Problem

Comment threads can go arbitrarily deep, causing:
- **Staircase effect:** Each indent level eats horizontal space. At depth 10, comments are unreadable on normal screens.
- **DOM explosion:** 10,000 comments = 10,000 DOM nodes, which kills performance.
- **Lost context:** Users can't follow a thread that's 20 levels deep.

### The Solution: Three-Tier Strategy

**1. Max Visual Depth (5):** Comments deeper than level 5 render at the same indent as level 5. This prevents the staircase effect while still showing the thread continues.

**2. Reply Collapsing:** Beyond depth 3, only show the first 5 replies. The rest are hidden behind "Show X more replies." Clicking expands inline.

**3. Virtualization:** When total visible comments exceed 100, use virtualization (react-virtuoso) to only render what's in the viewport.

### Tree Flattening Algorithm

The nested tree is flattened into a linear array with display metadata:

```typescript
interface FlatComment {
  comment: CommentNode;
  visualDepth: number;        // Capped at maxIndentDepth
  isCollapsed: boolean;       // Replies hidden?
  hasHiddenReplies: boolean;  // "Show more" button needed?
  hiddenReplyCount: number;   // How many replies are hidden
}
```

The flattening function recursively walks the tree, applying collapse rules at each level.

### Interview Talking Points

- **Mobile adaptation:** On screens < 640px, reduce maxIndentDepth to 2 and collapseBeyondDepth to 1. Deep threads are unusable on mobile without aggressive collapsing.
- **Server-side pagination:** For 10,000+ comment threads, the server should paginate replies (20 at a time). The client renders what it has and shows "Load more replies."
- **Time complexity:** Tree flattening is O(N) where N = total comments. Collapse state changes trigger a full re-flatten, but this is cheap (100 comments = ~1ms).
- **Why not CSS `max-width`?** CSS alone can't handle the "Show more replies" pattern or virtualization. We need to control which comments are rendered at the data level.
