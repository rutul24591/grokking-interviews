"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-comment-thread",
  title: "Design a Comment Thread System",
  description:
    "Complete LLD solution for a production-grade comment thread system with nested replies, lazy-loading, optimistic UI, rich text, real-time WebSocket updates, and accessibility.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "comment-thread",
  wordCount: 3200,
  readingTime: 22,
  lastUpdated: "2026-04-03",
  tags: [
    "lld",
    "comment",
    "thread",
    "nested-replies",
    "optimistic-ui",
    "lazy-loading",
    "websocket",
    "accessibility",
    "state-management",
  ],
  relatedTopics: [
    "rich-text-editor",
    "infinite-scroll",
    "real-time-collaboration",
    "state-management",
  ],
};

export default function CommentThreadArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Problem Clarification */}
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a reusable comment thread component for a large-scale
          web application. The system must support deeply nested replies with visual
          threading (indent levels, connecting lines), lazy-loading of child comments
          on expand, optimistic UI for posting new comments and actions (like, edit,
          delete), rich text formatting within comment bodies, author metadata display
          (avatar, username, timestamp, edited indicator), pagination at the root level,
          real-time updates via WebSocket for incoming replies, and full keyboard
          accessibility with screen reader announcements for dynamic content changes.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            The application is a React 19+ SPA with support for concurrent features.
          </li>
          <li>
            Maximum nesting depth is 5 levels. Beyond that, replies are flattened
            and displayed via a &quot;see more replies&quot; link.
          </li>
          <li>
            Comments can contain basic rich text: bold, italic, links, and inline code.
          </li>
          <li>
            The backend provides REST endpoints for CRUD operations on comments and
            a WebSocket endpoint for real-time notifications.
          </li>
          <li>
            Root-level comments are paginated (cursor-based). Child comments load
            on-demand when a user expands a collapsed thread.
          </li>
          <li>
            Users can perform actions (like, reply, edit, delete) on their own comments
            or like other users&apos; comments.
          </li>
          <li>
            The system must handle concurrent edits gracefully (two users editing the
            same comment simultaneously).
          </li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Comment Tree Rendering:</strong> Render comments in a hierarchical
            tree structure with visual indentation and connecting lines to indicate
            parent-child relationships.
          </li>
          <li>
            <strong>Nested Reply Depth Limit:</strong> Maximum nesting depth of 5.
            Replies beyond depth 5 are flattened and accessible via a
            &quot;see more replies&quot; link.
          </li>
          <li>
            <strong>Lazy Loading Children:</strong> Child comments are not fetched
            initially. When a user clicks &quot;expand replies&quot;, the children are
            fetched on-demand and rendered inline.
          </li>
          <li>
            <strong>Optimistic UI for Posting:</strong> When a user posts a comment, it
            appears instantly in the thread. If the API call fails, the comment reverts
            with an error indicator and retry option.
          </li>
          <li>
            <strong>Optimistic Actions:</strong> Like, edit, and delete operations update
            the UI immediately. On API failure, the UI rolls back to the previous state
            and displays an error toast.
          </li>
          <li>
            <strong>Rich Text in Comments:</strong> Support basic formatting — bold,
            italic, hyperlinks, and inline code. Rendered as sanitized HTML.
          </li>
          <li>
            <strong>Author Information:</strong> Each comment displays the author&apos;s
            avatar, username, relative timestamp (e.g., &quot;2 hours ago&quot;), and
            an &quot;edited&quot; indicator if the comment was modified.
          </li>
          <li>
            <strong>Comment Actions:</strong> Each comment has action buttons: reply,
            edit (owner only), delete (owner only), and like/upvote.
          </li>
          <li>
            <strong>Root-Level Pagination:</strong> Top-level comments load in pages
            via cursor-based pagination with a &quot;Load More&quot; button.
          </li>
          <li>
            <strong>Real-Time Updates:</strong> A WebSocket connection delivers new
            replies and new root comments in real time. Updates are merged optimistically
            into the existing tree.
          </li>
          <li>
            <strong>Collapse/Expand Thread:</strong> Users can collapse a comment thread
            to hide its children. Collapsed state is per-user and persisted in local state.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Performance:</strong> Initial render of 50 root comments with metadata
            should complete within 200ms. Lazy loading ensures children do not impact
            initial paint.
          </li>
          <li>
            <strong>Scalability:</strong> The system should handle threads with 10,000+
            total comments without memory leaks or render degradation.
          </li>
          <li>
            <strong>Reliability:</strong> Optimistic updates must always have a rollback
            path. No data loss on API failure.
          </li>
          <li>
            <strong>Accessibility:</strong> Full keyboard navigation between comments
            (arrow keys), <code>aria-live</code> regions announce new comments to screen
            readers, focus management after post/edit/delete actions.
          </li>
          <li>
            <strong>Type Safety:</strong> Full TypeScript support for the comment tree
            structure, action types, and state shape.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            A user posts a comment and immediately navigates away — the optimistic comment
            is cleaned up and the in-flight request is aborted.
          </li>
          <li>
            Two users reply to the same comment simultaneously via WebSocket — the system
            must merge both without duplication.
          </li>
          <li>
            A deleted parent comment still has visible children — children are re-rooted
            to the grandparent or shown as orphaned replies.
          </li>
          <li>
            WebSocket delivers a reply for a comment that hasn&apos;t been loaded yet
            (lazy not yet triggered) — the update is buffered until the user expands.
          </li>
          <li>
            User attempts to edit a comment while the original edit request is still
            in-flight — the second edit is queued or rejected.
          </li>
          <li>
            Rich text content contains malicious HTML (XSS attempt) — the sanitizer
            must strip all dangerous tags and attributes.
          </li>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is to separate the <strong>comment tree state management</strong>
          from the <strong>comment rendering</strong> using a global store (Zustand) and
          a recursive component rendering strategy. The store manages the flat comment
          list, builds the tree structure on-demand, handles optimistic updates with
          rollback snapshots, and exposes actions for CRUD operations and real-time
          merge. The rendering layer subscribes to the store, renders the tree recursively
          with lazy-loading support, and manages collapse/expand state per node.
        </p>
        <p>
          <strong>Alternative approaches considered:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Context API + useReducer:</strong> Viable but requires wrapping the
            component tree in a Provider. Every comment node would consume the context,
            causing re-renders on any tree mutation. Zustand&apos;s selector-based
            subscriptions allow individual comment nodes to re-render only when their
            own data changes.
          </li>
          <li>
            <strong>Redux Toolkit:</strong> Overkill for this use case. Requires
            boilerplate (slices, thunks, extraReducers) and introduces global state that
            is unnecessary for a single-page component. Redux&apos;s immutable update
            patterns are also more verbose for tree manipulations.
          </li>
          <li>
            <strong>Server-side rendering with hydration:</strong> Initial comments
            could be SSR-rendered, but optimistic UI and real-time WebSocket updates
            are inherently client-side. A hybrid approach (SSR for initial page load,
            client hydration for interactivity) is possible but adds complexity.
          </li>
        </ul>
        <p>
          <strong>Why Zustand + Recursive Components + Flat-to-Tree is optimal:</strong>{" "}
          Zustand provides a lightweight, selector-based global store. Storing comments
          as a flat list (keyed by ID) with parent references avoids the complexity of
          deeply nested immutable tree mutations. The tree is derived on-demand via a
          utility function that groups comments by parentId. This approach makes optimistic
          inserts, updates, and deletes O(1) operations on the flat list, with tree
          reconstruction being a derived computation only triggered when the UI re-renders.
          Recursive components naturally map to the tree structure.
        </p>
      </section>

      {/* Section 4: System Design (LLD) */}
      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of seven modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Comment Types &amp; Interfaces (<code>comment-types.ts</code>)</h4>
          <p>
            Defines the <code>CommentNode</code> interface with fields for id, parentId,
            author, content (rich text string), likeCount, createdAt, updatedAt, isEdited,
            isOptimistic, isDeleted, and childrenIds. The <code>CommentAction</code> union
            type covers all possible mutations: POST, EDIT, DELETE, LIKE, and ROLLBACK.
            The <code>ThreadState</code> interface describes the flat store shape: a
            record of comments keyed by ID, a set of root IDs, a cursor for pagination,
            and a map of pending (in-flight) request IDs.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Comment Store (<code>comment-store.ts</code>)</h4>
          <p>
            Zustand store managing the flat comment list. Exposes actions for adding
            (with optimistic flag and rollback snapshot), editing, deleting, liking, and
            rolling back. Handles real-time WebSocket message merging. Maintains a
            <code>pendingRequests</code> Map to prevent duplicate in-flight operations.
          </p>
          <p className="mt-3">
            <strong>State shape:</strong>
          </p>
          <ul className="mt-2 space-y-1 text-sm font-mono">
            <li>
              <code>comments: Record&lt;string, CommentNode&gt;</code> — flat lookup
            </li>
            <li>
              <code>rootIds: string[]</code> — ordered root comment IDs
            </li>
            <li>
              <code>collapsedThreads: Set&lt;string&gt;</code> — collapsed parent IDs
            </li>
            <li>
              <code>paginationCursor: string | null</code> — next page cursor
            </li>
            <li>
              <code>hasMore: boolean</code> — more root comments available
            </li>
            <li>
              <code>rollbackSnapshots: Record&lt;string, CommentNode&gt;</code> — pre-mutation state
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Comment Tree Utilities (<code>comment-tree-utils.ts</code>)</h4>
          <p>
            Pure utility functions for flat-to-tree conversion, depth calculation per
            node, building the indented rendering order, and computing which nodes are
            visible given collapsed states. No side effects — fully testable.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Comment API Service (<code>comment-api.ts</code>)</h4>
          <p>
            Thin API layer wrapping fetch calls. Exports typed functions:
            <code>fetchThread</code> (paginated root comments), <code>postComment</code>,
            <code>editComment</code>, <code>deleteComment</code>, <code>likeComment</code>,
            and <code>fetchChildren</code> (lazy-loaded). Returns parsed JSON with error
            handling.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. useCommentThread Hook (<code>use-comment-thread.ts</code>)</h4>
          <p>
            Custom React hook that orchestrates data fetching, pagination, lazy loading,
            and WebSocket connection. Manages the loading state, error state, and
            integrates with the Zustand store for real-time merge. Handles WebSocket
            lifecycle (connect, message handler, reconnect on disconnect, cleanup on
            unmount).
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. useCommentActions Hook (<code>use-comment-actions.ts</code>)</h4>
          <p>
            Custom hook wrapping optimistic action dispatch with automatic rollback on
            API failure. Each action (like, edit, delete, post) captures the current
            state as a rollback snapshot, applies the optimistic update, calls the API,
            and on failure, restores the snapshot and triggers an error notification.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">7. Component Layer</h4>
          <p>
            <code>CommentThread</code> — root renderer, subscribes to store rootIds,
            renders pagination button. <code>CommentNode</code> — recursive component
            rendering a single comment with its actions, rich text content, author info,
            and child replies. Handles collapse/expand toggle and lazy-loading trigger.
            <code>CommentForm</code> — inline form for posting new comments and replies
            with basic validation. <code>CommentActions</code> — action button row
            (like, reply, edit, delete). <code>LoadMore</code> — pagination button for
            root-level comments. See the Example tab for complete implementations.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Management</h3>
        <p>
          The Zustand store uses a flat-list-with-parent-refs approach rather than a
          nested tree. Each comment stores its <code>parentId</code> (null for root
          comments) and a <code>childrenIds</code> array. This makes inserts, updates,
          and deletes O(1) — you only touch the affected comment and its direct parent.
          The tree structure is derived: a utility function walks the flat list and
          builds the rendering order, respecting depth limits and collapsed states.
        </p>
        <p>
          Optimistic updates are the most complex part. Before any mutation, the store
          snapshots the affected comment(s) into <code>rollbackSnapshots</code>. The
          optimistic change is applied immediately. If the API succeeds, the snapshot is
          discarded. If it fails, the snapshot is restored and the optimistic flag is
          cleared. This ensures the UI is always consistent, even under network failure.
        </p>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/comment-thread-architecture.svg"
          alt="Comment Thread Architecture"
          caption="Architecture of the comment thread system showing flat-to-tree conversion, optimistic updates, and WebSocket merge"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            User loads the page. <code>useCommentThread</code> fetches the first page
            of root comments via <code>fetchThread</code>.
          </li>
          <li>
            Store populates <code>comments</code> and <code>rootIds</code>. Components
            render.
          </li>
          <li>
            User clicks &quot;expand replies&quot; on a comment.
            <code>fetchChildren</code> loads child comments. Store adds them to the
            flat list. Tree is re-derived.
          </li>
          <li>
            User types a reply and submits. <code>useCommentActions</code> snapshots
            the current state, creates an optimistic comment with
            <code>isOptimistic: true</code>, and inserts it into the store.
          </li>
          <li>
            <code>postComment</code> API call fires in the background. UI shows the
            optimistic comment immediately.
          </li>
          <li>
            On success: the API returns the server-assigned ID. The optimistic comment
            is replaced with the real one. Snapshot is cleared.
          </li>
          <li>
            On failure: the rollback snapshot restores the previous state. The optimistic
            comment is removed. An error toast notifies the user with a retry option.
          </li>
          <li>
            WebSocket delivers a <code>NEW_REPLY</code> event. The store merges the
            incoming comment into the flat list. If the parent is loaded, the comment
            renders immediately. If not, it is buffered.
          </li>
        </ol>
      </section>

      {/* Section 5: Data Flow / Execution Flow */}
      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          The execution flow follows a unidirectional data flow pattern. All state
          mutations flow through the Zustand store, and all rendering flows from store
          subscriptions and derived tree computations. This ensures predictable behavior
          and makes the system testable in isolation.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li>
            <strong>Navigate away during post:</strong> The <code>useCommentThread</code>{" "}
            hook uses <code>AbortController</code> to cancel in-flight fetch requests on
            unmount. Optimistic comments with <code>isOptimistic: true</code> are cleaned
            up from the store on unmount.
          </li>
          <li>
            <strong>WebSocket reply for unloaded parent:</strong> The store checks if the
            parentId exists in <code>comments</code>. If not, the incoming comment is
            stored in a <code>bufferedComments</code> map. When the user eventually
            expands that parent, buffered comments are flushed into the tree.
          </li>
          <li>
            <strong>Concurrent edits:</strong> Each mutation carries an
            <code>updatedAt</code> timestamp. The store uses last-write-wins semantics
            based on the server&apos;s returned timestamp. If the user&apos;s local edit
            is superseded, the UI updates with the server version and shows a subtle
            &quot;updated&quot; indicator.
          </li>
          <li>
            <strong>Deleted parent with visible children:</strong> When a parent is
            deleted, its children&apos;s <code>parentId</code> is reassigned to the
            grandparent (if exists) or to null (becoming a root comment). This prevents
            orphaned comments from disappearing.
          </li>
        </ul>
      </section>

      {/* Section 6: Implementation */}
      <section>
        <h2>Implementation</h2>
        <p>
          The full production implementation is available in the <strong>Example tab</strong>.
          Below is a high-level overview of each module and its key design decisions.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">Switch to the Example Tab</h3>
          <p>
            The complete, production-ready implementation consists of 12 files:
            type definitions, Zustand store with optimistic updates and rollback,
            tree utilities, API service layer, two custom hooks (thread orchestration
            and action dispatch), five React components (thread, node, form, actions,
            pagination), and a full EXPLANATION.md walkthrough. Click the{" "}
            <strong>Example</strong> toggle at the top of the article to view all source
            files.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Comment Types (comment-types.ts)</h3>
        <p>
          Defines <code>CommentNode</code> with <code>id</code>, <code>parentId</code>,
          <code>author</code> (AvatarInfo sub-type), <code>content</code> (sanitized
          HTML string), <code>likeCount</code>, <code>createdAt</code>,{" "}
          <code>updatedAt</code>, <code>isEdited</code>, <code>isOptimistic</code>,
          <code>isDeleted</code>, <code>childrenIds</code>, and <code>depth</code>.
          The <code>CommentAction</code> discriminated union covers all mutations with
          their payloads. <code>ThreadState</code> describes the flat store shape with
          pagination metadata.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Zustand Store (comment-store.ts)</h3>
        <p>
          The store manages the flat comment list, rollback snapshots, collapse state,
          and pagination metadata. Key design decisions include: storing comments as a
          flat <code>Record&lt;string, CommentNode&gt;</code> for O(1) access, maintaining
          a separate <code>rollbackSnapshots</code> map for atomic rollback, and using
          <code>Set</code> for collapsed thread IDs for efficient lookup. The store
          exposes <code>applyOptimisticInsert</code>, <code>confirmOptimisticInsert</code>,
          <code>rollbackMutation</code>, <code>toggleCollapse</code>, and{" "}
          <code>mergeWebSocketUpdate</code>.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Tree Utilities (comment-tree-utils.ts)</h3>
        <p>
          Pure functions: <code>buildTree</code> converts the flat list to a nested
          structure respecting depth limits (max 5, then flattens).{" "}
          <code>calculateDepths</code> computes the depth of each node from root.
          <code>getVisibleNodes</code> returns the rendering order given collapsed
          states. <code>flattenSubtree</code> handles the &quot;see more replies&quot;{" "}
          conversion for deeply nested comments. All functions are side-effect-free
          and unit-testable.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: API Service (comment-api.ts)</h3>
        <p>
          Thin wrapper around <code>fetch</code> with typed request/response objects.
          Functions: <code>fetchThread</code> (paginated, cursor-based),{" "}
          <code>fetchChildren</code> (lazy-loaded by parentId), <code>postComment</code>,
          <code>editComment</code>, <code>deleteComment</code>, <code>likeComment</code>.
          Each returns a typed promise. Errors are normalized into a consistent
          <code>ApiError</code> shape with message, status code, and retry flag.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: useCommentThread Hook</h3>
        <p>
          Orchestrates the initial fetch, pagination (loadMore function), lazy loading
          (loadChildren function), and WebSocket connection. Manages local state for
          <code>isLoading</code>, <code>error</code>, and <code>isConnected</code>.
          The WebSocket handler parses incoming messages and dispatches them to the
          store&apos;s <code>mergeWebSocketUpdate</code> action. Handles reconnection
          with exponential backoff (1s, 2s, 4s, max 30s).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6: useCommentActions Hook</h3>
        <p>
          Wraps the optimistic-update-with-rollback pattern. Each action function
          (handleLike, handleEdit, handleDelete, handlePost) follows the same flow:
          snapshot current state, apply optimistic update, fire API call, on success
          confirm, on failure rollback. The hook exposes these functions for use in
          components. Error handling triggers a toast notification with retry capability.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 7: Component Layer</h3>
        <p>
          <code>CommentThread</code> subscribes to rootIds and renders the top-level
          comment list with the LoadMore button. <code>CommentNode</code> is recursive
          — it renders the comment body, author info, action buttons, and conditionally
          renders children based on collapsed state and lazy-loading status. The indent
          is computed from the node&apos;s depth, and a CSS border-left creates the
          visual thread line. <code>CommentForm</code> is an inline textarea with
          validation (min 1 char, max 5000 chars), a submit button, and a cancel button.
          <code>CommentActions</code> renders the action row with like count, reply,
          edit (conditional on ownership), and delete (conditional on ownership).{" "}
          <code>LoadMore</code> is a simple button that triggers pagination.
        </p>
      </section>

      {/* Section 7: Performance & Scalability */}
      <section>
        <h2>Performance &amp; Scalability</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Time and Space Complexity</h3>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Operation</th>
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Space</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">addComment (flat store)</td>
                <td className="p-2">O(1) — record insert</td>
                <td className="p-2">O(n) — stores n comments</td>
              </tr>
              <tr>
                <td className="p-2">buildTree (derive)</td>
                <td className="p-2">O(n) — single pass</td>
                <td className="p-2">O(n) — output array</td>
              </tr>
              <tr>
                <td className="p-2">editComment</td>
                <td className="p-2">O(1) — record update</td>
                <td className="p-2">O(1) — snapshot stored</td>
              </tr>
              <tr>
                <td className="p-2">deleteComment</td>
                <td className="p-2">O(k) — re-root k children</td>
                <td className="p-2">O(1) — removes one entry</td>
              </tr>
              <tr>
                <td className="p-2">likeComment</td>
                <td className="p-2">O(1) — increment counter</td>
                <td className="p-2">O(1)</td>
              </tr>
              <tr>
                <td className="p-2">getVisibleNodes</td>
                <td className="p-2">O(n) — walk + filter</td>
                <td className="p-2">O(v) — visible nodes</td>
              </tr>
              <tr>
                <td className="p-2">WebSocket merge</td>
                <td className="p-2">O(1) — record insert</td>
                <td className="p-2">O(1) per message</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Where <code>n</code> is total loaded comments and <code>k</code> is the number
          of children of a deleted comment (typically small, &lt; 20). Tree derivation
          runs on every render but is optimized via memoization — the store only triggers
          re-derivation when the comment set changes.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li>
            <strong>Tree derivation on every mutation:</strong> Running{" "}
            <code>buildTree</code> on the entire flat list for every single comment
            insert is O(n). For threads with 10,000+ comments, this becomes costly.
            Mitigation: memoize the tree derivation using{" "}
            <code>useMemo</code> in the root component, keyed on the comment record
            reference. Only re-derive when the store signals a structural change.
          </li>
          <li>
            <strong>Recursive re-renders:</strong> A mutation to a root comment could
            cascade re-renders through all descendant CommentNodes. Mitigation: use
            Zustand selectors so each CommentNode subscribes only to its own comment by
            ID. The parent only re-renders if its childrenIds array changes.
          </li>
          <li>
            <strong>Rich text sanitization:</strong> Running DOMPurify on every comment
            render is expensive for large comment sets. Mitigation: sanitize once on
            the server response, store the sanitized HTML, and render via{" "}
            <code>dangerouslySetInnerHTML</code> on the client.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li>
            <strong>Lazy loading:</strong> Children are not fetched until the user
            expands. This drastically reduces initial data transfer and render cost.
            A thread with 500 total comments might only load 50 root comments initially.
          </li>
          <li>
            <strong>Virtual scrolling for root comments:</strong> For extremely long
            threads, replace the flat render with a virtualized list (e.g.,
            @tanstack/react-virtual). Only visible comments are rendered in the DOM.
          </li>
          <li>
            <strong>Stable IDs:</strong> Use server-generated UUIDs. Optimistic comments
            use client-generated UUIDs with a <code>optimistic-</code> prefix to avoid
            collisions. On confirmation, the optimistic entry is replaced with the
            server entry.
          </li>
          <li>
            <strong>Debounced like actions:</strong> Rapid likes are debounced (300ms)
            to avoid firing multiple API requests. The UI reflects the latest like state
            immediately.
          </li>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">XSS Prevention (CRITICAL)</h3>
        <p>
          Comment content is rich text rendered via <code>dangerouslySetInnerHTML</code>.
          This is the primary XSS vector. All user-generated content must pass through
          a sanitization layer (e.g., DOMPurify) before rendering. The sanitizer should
          be configured to allow only a whitelist of tags: <code>&lt;strong&gt;</code>,
          <code>&lt;em&gt;</code>, <code>&lt;a&gt;</code> (with <code>rel=&quot;noopener
          noreferrer&quot;</code>), and <code>&lt;code&gt;</code>. All other tags,
          attributes, and inline styles are stripped. Server-side sanitization is the
          first line of defense; client-side sanitization is a defense-in-depth measure.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Authorization</h3>
        <p>
          Edit and delete actions must verify ownership on the server. The client hides
          these buttons for non-owners, but the API must independently validate that the
          requesting user is the comment author or has admin privileges. The store should
          track the current user&apos;s ID and compare it against the comment&apos;s
          author ID before exposing edit/delete UI.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Rate Limiting</h3>
        <p>
          The API should rate-limit comment creation, edits, and likes per user to
          prevent abuse (e.g., spam bots, like manipulation). A reasonable limit is
          30 comments per minute, 10 edits per minute, 60 likes per minute. The client
          should handle 429 responses gracefully with a backoff retry.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Keyboard Navigation</h4>
          <ul className="space-y-2">
            <li>
              Arrow keys navigate between comments (Up/Down). Each comment node is
              focusable via <code>tabindex=&quot;0&quot;</code>.
            </li>
            <li>
              Enter key on a focused comment opens the reply form. Escape key closes
              the reply form.
            </li>
            <li>
              The &quot;Load More&quot; button is a native <code>&lt;button&gt;</code>,{" "}
              automatically keyboard-accessible.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Screen Reader Support</h4>
          <ul className="space-y-2">
            <li>
              The comment thread region has <code>aria-live=&quot;polite&quot;</code> so
              new comments are announced to screen readers without interrupting ongoing
              speech.
            </li>
            <li>
              Each comment has <code>role=&quot;article&quot;</code> with{" "}
              <code>aria-label</code> containing the author name and timestamp.
            </li>
            <li>
              Optimistic comments have an <code>aria-busy=&quot;true&quot;</code>{" "}
              attribute, indicating to screen readers that the content is being
              confirmed by the server.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">ARIA Roles and Semantics</h4>
          <p>
            The thread container uses <code>role=&quot;feed&quot;</code> with{" "}
            <code>aria-busy</code> during initial load. Individual comments use{" "}
            <code>role=&quot;article&quot;</code>. The reply form uses{" "}
            <code>role=&quot;form&quot;</code> with <code>aria-label=&quot;Reply form&quot;</code>.
            Action buttons have descriptive <code>aria-label</code> attributes
            (e.g., &quot;Like comment by John&quot;, &quot;Delete your comment&quot;).
            See the Example tab for the exact markup.
          </p>
        </div>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Store actions:</strong> Test applyOptimisticInsert creates a comment
            with isOptimistic: true and stores the rollback snapshot. Test
            confirmOptimisticInsert replaces the optimistic entry with the server
            response. Test rollbackMutation restores the snapshot and removes the
            optimistic change.
          </li>
          <li>
            <strong>Tree utilities:</strong> Test buildTree correctly nests children
            under parents. Test depth calculation produces correct depth values. Test
            getVisibleNodes respects collapsed states and depth limits. Test that
            comments beyond depth 5 are flattened.
          </li>
          <li>
            <strong>API service:</strong> Mock fetch, verify correct URL, method, headers,
            and body for each endpoint. Test error normalization (4xx, 5xx, network
            errors).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Optimistic post flow:</strong> Render CommentThread, fill form,
            submit. Assert optimistic comment appears immediately. Mock API success,
            assert comment is confirmed with server ID. Mock API failure, assert comment
            reverts and error toast appears.
          </li>
          <li>
            <strong>Lazy loading:</strong> Render a comment with collapsed children.
            Click &quot;expand replies&quot;. Assert fetchChildren is called with
            correct parentId. Assert children render after fetch resolves.
          </li>
          <li>
            <strong>WebSocket merge:</strong> Connect mock WebSocket, send a NEW_REPLY
            message. Assert the comment appears in the correct position in the tree.
            Test that a reply for an unloaded parent is buffered.
          </li>
          <li>
            <strong>Pagination:</strong> Click &quot;Load More&quot;. Assert fetchThread
            is called with the correct cursor. Assert new comments append to rootIds.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>
            Navigate away during post: verify AbortController cancels the request and
            optimistic comment is cleaned up.
          </li>
          <li>
            Rapid like clicks: verify debouncing prevents multiple API calls, UI reflects
            the latest state.
          </li>
          <li>
            XSS attempt in comment content: verify sanitizer strips script tags and
            dangerous attributes, only allowed tags remain.
          </li>
          <li>
            Accessibility: run axe-core automated checks on rendered thread, verify
            aria-live regions, role attributes, keyboard navigation between comments.
          </li>
          <li>
            WebSocket disconnect and reconnect: verify messages are not lost during
            reconnect window, buffered messages are processed after reconnect.
          </li>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li>
            <strong>Storing comments as a deeply nested tree:</strong> Candidates often
            model the state as a nested tree object. This makes immutable updates
            extremely complex — updating a leaf node requires rebuilding the entire path
            from root to leaf. Interviewers expect candidates to recognize the
            flat-list-with-parent-refs pattern (or normalized state) as the correct
            approach for O(1) mutations.
          </li>
          <li>
            <strong>Not handling optimistic update rollback:</strong> Candidates implement
            optimistic UI but forget the rollback path. When the API fails, the optimistic
            comment remains on screen indefinitely. Always capture a snapshot before the
            mutation and restore it on failure.
          </li>
          <li>
            <strong>Fetching all comments on initial load:</strong> For threads with
            thousands of comments, fetching everything upfront is a performance disaster.
            Interviewers look for candidates who discuss lazy loading, pagination, and
            virtualization as essential strategies.
          </li>
          <li>
            <strong>Ignoring accessibility:</strong> Rendering a comment thread without
            aria-live regions means screen reader users are unaware of new replies.
            Without keyboard navigation, users who cannot use a mouse are locked out.
            This is a critical oversight.
          </li>
          <li>
            <strong>No depth limit on nesting:</strong> Allowing unlimited nesting means
            a malicious user could create 10,000 levels of nesting, crashing the
            recursive renderer. Always enforce a max depth and flatten beyond it.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Flat List vs Nested Tree in State</h4>
          <p>
            A nested tree mirrors the visual structure but makes mutations O(d) where d
            is the depth of the affected node. Every mutation requires walking the tree
            and creating new objects along the path (immutability). A flat list with
            parent references makes every mutation O(1) — you update a single record.
            The trade-off is that the tree must be derived on each render, which is O(n).
            For comment threads (n typically &lt; 1000 loaded at a time), derivation is
            fast enough with memoization. For very large threads (n &gt; 10,000), a
            hybrid approach works: store the tree but use Immer for immutable updates,
            which provides O(d) mutations with minimal boilerplate.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Optimistic UI vs Server-Confirmed UI</h4>
          <p>
            Server-confirmed UI is simpler — wait for the API response, then update the
            UI. The latency cost is noticeable (200-800ms round trip), making the app
            feel sluggish. Optimistic UI updates immediately, providing instant feedback.
            The trade-off is complexity: you need rollback logic, error handling, and
            a way to reconcile server responses with optimistic state. For user-facing
            actions like posting comments, optimistic UI is the right choice because the
            failure rate is low and the UX improvement is significant. For destructive
            actions (delete), some teams prefer a confirmation dialog before the action,
            reducing the rollback probability.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Cursor-Based vs Offset Pagination</h4>
          <p>
            Offset pagination (page=1, page=2) is simple to implement but has a critical
            flaw: if items are inserted or deleted between page requests, items can be
            skipped or duplicated. Cursor-based pagination (cursor=lastItemId) uses the
            last item&apos;s ID or timestamp as the starting point for the next page,
            ensuring consistent results even when the data changes. For a comment thread
            where new replies arrive in real time, cursor-based pagination is essential.
            The trade-off is that you cannot jump to an arbitrary page number — users
            must scroll sequentially.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">WebSocket vs Server-Sent Events vs Polling</h4>
          <p>
            Polling (fetching every N seconds) is the simplest approach but wastes
            bandwidth and introduces latency (up to N seconds). Server-Sent Events (SSE)
            provide a unidirectional server-to-client stream, suitable for receiving
            new comments but not for bidirectional communication. WebSocket provides
            full-duplex communication, enabling both real-time comment delivery and
            future features like typing indicators and live collaboration. WebSocket is
            the best choice for a comment thread because the bidirectional capability
            future-proofs the system, and the overhead is negligible compared to the
            value of real-time updates.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle comment sorting (newest first, oldest first, most liked)?
            </p>
            <p className="mt-2 text-sm">
              A: Store the sort preference in the UI state (not in the comment data).
              The API should support a <code>sort</code> query parameter that returns
              root comments in the requested order. For child comments, chronological
              order is typically preferred (conversation flow). The store&apos;s{" "}
              <code>rootIds</code> array reflects the sorted order from the API. When
              the user changes sort, re-fetch root comments with the new sort parameter.
              Optimistic inserts should place the new comment at the correct position
              based on the current sort (e.g., newest first = prepend to rootIds).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement comment mentions (@username) with notifications?
            </p>
            <p className="mt-2 text-sm">
              A: Parse the comment content for <code>@username</code> patterns before
              submission. Send the mentioned usernames in a <code>mentions</code> array
              to the API. The server resolves usernames to user IDs and sends
              notifications. On the client, render mentions as <code>{"<a>"}</code> tags
              linking to user profiles. The editor should provide an autocomplete dropdown
              when the user types <code>@</code>, querying the API for matching usernames
              (debounced, 200ms).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle image uploads within comments?
            </p>
            <p className="mt-2 text-sm">
              A: Add a file input to the CommentForm. On file selection, upload the image
              to a storage service (S3, Cloudinary) via a pre-signed URL from the API.
              The API returns the image URL, which the form inserts into the comment
              content as a <code>{"<img>"}</code> tag. The upload should show a progress
              indicator. If the upload fails, the form shows an error and the user can
              retry. Images should be compressed client-side before upload (canvas-based
              resize) to reduce bandwidth.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement comment pinning (pinned comments at top)?
            </p>
            <p className="mt-2 text-sm">
              A: Add an <code>isPinned</code> field to CommentNode. The API returns
              pinned comments first in the rootIds array. The store maintains pinned
              comments in a separate <code>pinnedIds</code> set and renders them before
              regular comments. Only admins/moderators can pin comments (server-side
              check). The UI shows a pin icon next to pinned comments.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle comment moderation (reported comments, auto-mod)?
            </p>
            <p className="mt-2 text-sm">
              A: Add a <code>moderationStatus</code> field to CommentNode:{" "}
              <code>visible | flagged | hidden | removed</code>. Flagged comments show
              a blurred overlay with a &quot;This comment was reported&quot; message.
              Hidden/removed comments are not rendered. The API returns the moderation
              status with each comment. Auto-mod can use a keyword filter or ML model
              to flag comments on the server before they are visible. Users can report
              comments via a flag button, which triggers a server-side review.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you design this for a multi-tenant platform (e.g., Slack-style
              workspaces)?
            </p>
            <p className="mt-2 text-sm">
              A: Add a <code>workspaceId</code> to all API requests and store it in the
              hook&apos;s initialization. The WebSocket connection includes the workspace
              ID in the auth token. Comments are scoped to workspace + threadId. The
              store is reset when the user switches workspaces. Cache comments per
              workspace using a key like <code>{"comments-${workspaceId}-${threadId}"}</code>{" "}
              in a Map for fast switching without re-fetching.
            </p>
          </div>
        </div>
      </section>

      {/* Section 11: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://zustand.docs.pmnd.rs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Zustand — State Management Library Documentation
            </a>
          </li>
          <li>
            <a
              href="https://github.com/cure53/DOMPurify"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              DOMPurify — HTML Sanitization Library
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/feed/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WAI-ARIA Feed Pattern — Accessibility Guidelines for Comment Threads
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/articles/websockets"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Web.dev — WebSocket API and Real-Time Communication Patterns
            </a>
          </li>
          <li>
            <a
              href="https://tanstack.com/virtual/latest"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              TanStack Virtual — Virtualization for Long Lists
            </a>
          </li>
          <li>
            <a
              href="https://www.reddit.com/r/reactjs/comments/nested-comments-design/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Reddit Discussion — Nested Comment Thread Architecture Patterns
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
