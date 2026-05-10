"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-comments-system",
  title: "Design Comments System",
  description:
    "Production-grade comment threads with real-time updates, nested replies, moderation, and spam detection.",
  category: "low-level-design",
  subcategory: "real-world-scenario-lld",
  slug: "comments-system",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: ["lld", "comments", "threading", "moderation", "real-time"],
  relatedTopics: ["activity-feed-system", "notifications-badge-system"],
};

export default function CommentsSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>Comments are a fundamental engagement mechanism: they turn static content into conversations. The design space spans from simple flat lists (YouTube-style) to deeply threaded trees (Reddit-style) to inline document comments (Google Docs-style). Each topology has different data model requirements, rendering strategies, and real-time update patterns. The wrong choice for the content type creates a poor experience: flat comments on developer documentation make it hard to follow discussion threads; deeply nested comments on a news site create confusing indentation hierarchies that are hard to read.</p>
        <p>The frontend challenges are: rendering potentially large comment trees efficiently (a popular post may have thousands of comments), supporting real-time append (new comments from other users appear without refresh), enabling optimistic posting (the user's comment appears immediately while awaiting server confirmation), handling nested replies at arbitrary depth without infinite recursion, and providing moderation controls (flag, hide, delete) without disrupting the reading experience.</p>
        <p><strong>Explicit assumptions:</strong> Comments are stored as an adjacency list (each comment has a parentId). Maximum display depth is 3 levels (top-level → reply → reply-to-reply); deeper nesting shows as "view more replies" links. The first page loads the top N top-level comments sorted by recency (or popularity). Replies are lazy-loaded per thread on user interaction. Real-time new comments are delivered via WebSocket. Moderation (flagging, hiding) is a server-side operation reflected optimistically in the UI.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Post comment:</strong> Authenticated user submits a comment on a content item. Optimistic posting with server confirmation.</li>
          <li><strong>Threaded replies:</strong> Reply to any comment up to a configured max depth. Reply count shown on parent; expand to load replies.</li>
          <li><strong>Real-time updates:</strong> New comments from other users appear without page refresh. Reply counts on parent threads update in real-time.</li>
          <li><strong>Pagination:</strong> Load first N top-level comments; load more on demand. Load replies per thread on demand.</li>
          <li><strong>Editing and deletion:</strong> Author can edit a comment (with "edited" indicator) or delete (soft delete with "comment removed" placeholder to preserve thread structure).</li>
          <li><strong>Reactions:</strong> Like or react to comments. Reaction counts shown; user's own reaction highlighted.</li>
          <li><strong>Moderation:</strong> Flag a comment for review. Admins can hide or remove. Automated spam detection pre-submission.</li>
          <li><strong>Sorting:</strong> Sort by newest, oldest, or most liked (top-level comments only; replies always sorted by oldest).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Render performance:</strong> Initial comment section renders in under 500ms. Comment trees with 1000+ items use virtual scrolling or pagination to avoid DOM bloat.</li>
          <li><strong>Posting latency:</strong> Optimistic post makes the comment visible in under 100ms. Server confirmation within 2 seconds on normal network.</li>
          <li><strong>Real-time:</strong> New comments from other users appear within 2 seconds of posting.</li>
          <li><strong>Spam resistance:</strong> Pre-submission content filtering blocks obvious spam without adding server round-trips to the happy path (filter in a Web Worker).</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>The comment section loads the first page of top-level comments on mount. Each top-level comment shows its direct reply count but not its replies—replies are loaded lazily when the user clicks "View N replies." Real-time new comments arrive via WebSocket and are prepended to the list (if sorting by newest) or appended (if sorting by oldest). Optimistic posting adds the new comment immediately with a temporary ID; on server confirmation, the temporary ID is replaced with the permanent one.</p>
        <p>The data model is an adjacency list: each comment has a parentId (null for top-level). Fetching a thread loads all comments with parentId equal to the thread root, sorted by createdAt. Rendering is recursive but depth-limited (no more than 3 visual levels). Beyond 3 levels, additional replies are shown as flat replies to the closest ancestor within the depth limit.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/real-world-scenario-lld/comments-system.svg"
          alt="Comments system showing adjacency list data model, optimistic post flow with temp ID replacement, real-time new comment delivery, lazy reply loading, and pre-submission moderation pipeline"
          caption="Comments system showing adjacency list data model, optimistic post flow with temp ID replacement, real-time new comment delivery, lazy reply loading, and pre-submission moderation pipeline"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Data Model and Thread Structure</h3>
        <p>Each comment record contains: commentId (UUID), contentItemId (what the comment is on), parentId (null for top-level, parent's commentId for replies), authorId, authorDisplayName and avatarUrl (denormalized), body (the comment text), isEdited (boolean), editedAt, isDeleted (soft delete), deletedAt, reactionCounts (map of reaction type to count, denormalized for display), replyCount (denormalized count of direct children), createdAt, and depth (computed at write time: parentId === null → 0, else parent.depth + 1). The depth field prevents unbounded recursion during recursive renders and enforces the maximum depth rule at write time.</p>
        <p>Soft deletion preserves thread structure: a deleted comment renders as "[Comment removed]" with author and timestamp hidden. This prevents orphaned replies from losing their context ("why is Bob replying to nothing?"). Hard deletion would require either leaving dangling replies or cascading the delete to all descendants—neither is a good user experience. Soft delete with a tombstone is the correct approach for threaded discussions.</p>
        <p>The replyCount on each comment is a denormalized counter, updated atomically with the comment insert. When a reply is posted to comment A, the server atomically inserts the reply and increments comment A's replyCount. This allows the UI to show "14 replies" without counting descendants at render time. The counter can diverge from the true count (soft-deleted replies still count); a periodic reconciliation job corrects it.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Optimistic Comment Posting</h3>
        <p>When the user submits a comment, the UI should not make them wait for the server. The optimistic flow: (1) generate a temporary commentId (prefixed "temp-" to distinguish from permanent UUIDs); (2) insert the comment into local state with the temp ID, the user's own author information, and createdAt: new Date(); (3) render the comment immediately with a subtle "sending" indicator (spinning icon, slightly dimmed); (4) send POST /comments to the server; (5) on success, replace the temp ID with the server-assigned permanent ID in local state and remove the "sending" indicator; (6) on failure, remove the comment from local state and show an error with a "retry" option that re-submits the same content.</p>
        <p>The tricky part of temp-to-permanent ID replacement: if a WebSocket event arrives for the same comment (the server broadcasts the new comment to all subscribers including the poster), the client receives a "new comment" event with the permanent ID. The client must deduplicate: if a comment with that permanent ID was already inserted (by the temp-to-permanent swap), do not insert a duplicate. If the temp comment is still pending (server hasn't responded yet), the WebSocket event arrives first—in this case, the client should remove the temp comment and insert the permanent one. This deduplication logic typically uses the comment content hash or a client-generated nonce (included in the POST body and echoed back in the WebSocket event) to correlate temp and permanent entries.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Lazy Reply Loading</h3>
        <p>Loading all replies for all comments upfront is prohibitive for popular posts. Instead, each top-level comment renders with a collapsed reply section showing only the reply count: "14 replies." Clicking "View 14 replies" triggers a fetch for the direct children of that comment (parentId = commentId, sorted by createdAt ASC). The replies render in-place as a nested list under the parent.</p>
        <p>For comments with many replies (50+), the initial reply fetch loads the first 20 and shows a "Load 30 more replies" link. Subsequent loads use cursor pagination. Each nested level independently tracks its own pagination cursor, so loading more replies for thread B doesn't affect thread A's pagination state. The reply fetch includes grandchild reply counts but not the grandchildren themselves—each nested level is independently lazy-loaded on interaction.</p>
        <p>Reply count updates from WebSocket events must be applied to the parent comment's local state, even when the replies are not loaded. When a new reply arrives for comment A, the client updates comment A's replyCount in local state (incrementing the displayed count) and, if comment A's replies are currently loaded, prepends the new reply to the loaded list. If the replies are not loaded, only the count is updated—the reply will appear when the user loads replies.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Sorting and Ranking</h3>
        <p>Top-level comment sorting is a core UX decision. Newest-first shows the most recent discussion—good for time-sensitive content. Oldest-first shows the original conversation in chronological order—good for documentation where comments build on each other. Top-first (sorted by reaction count or vote score) surfaces the highest-quality comments—good for Q&A or knowledge-sharing contexts. The user's selected sort preference is stored in localStorage and applied on next visit to the same type of content.</p>
        <p>Real-time handling of sort order: when sorted by newest and a new comment arrives, it prepends. When sorted by oldest, it appends. When sorted by top, a new comment with zero reactions doesn't change the sort—it's inserted at the bottom. If an existing comment gains a reaction (its score increases), re-sorting the entire list on every reaction would be jarring. Instead, scores are updated in local state but the visual order is only re-sorted when the user explicitly re-sorts or refreshes the view. This "sort on load, not on update" pattern prevents comments from jumping around while the user is reading.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pre-Submission Moderation</h3>
        <p>Running spam and policy filters server-side adds latency to the post flow (the server can't respond before checking). Running filters client-side before submission catches obvious violations without server latency but can be circumvented by technical users (who can inspect and modify the filter logic). The pragmatic solution is to run lightweight client-side filters in a Web Worker (regex patterns for known spam URLs, profanity word lists) as a fast first pass, then run authoritative server-side filters after submission.</p>
        <p>The client-side filter runs in a Web Worker to avoid blocking the main thread during the typing experience. It checks the comment text as the user types (debounced at 500ms) and shows an inline warning for obvious violations: "Your comment appears to contain spam links." This gives the user a chance to correct the content before submitting. If the user submits anyway, the server filter makes the final call and can reject the post with a specific error message that the client displays.</p>
        <p>For authenticated platforms, server-side moderation also checks user-level reputation: new accounts or accounts with recent policy violations may have their comments queued for manual review rather than published immediately. These pending comments appear to their author (with a "pending review" indicator) but not to other users. If approved, they become visible; if rejected, the author is notified. This reduces spam and harassment without blocking all new users.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Editing and Deletion UX</h3>
        <p>Comment editing shows an inline edit form in place of the comment body, pre-populated with the existing text. The user edits and submits; an optimistic update replaces the displayed text immediately and adds an "edited" badge with the edit timestamp. The server confirms and the state is finalized. If the server rejects (the edit window has expired—many platforms limit editing to 15 minutes post-publish), the original text is restored and an error is shown.</p>
        <p>Soft deletion from the author's perspective shows a "Delete this comment?" confirmation dialog (not a toast—deletion is irreversible from the user's perspective). After confirmation, the comment is replaced with "[Comment removed]" in local state immediately (optimistic), and the DELETE request is sent. The tombstone preserves the thread structure for other users' replies. Hard deletion by an admin (removing the record entirely) requires cascading the tombstone to all descendants or orphaning them—most platforms choose to cascade the soft delete to children when a parent is admin-deleted, rendering the entire thread hidden rather than creating a confusing tree of replies to nothing.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Adjacency list versus nested set versus closure table for comment storage: adjacency list (parentId on each row) is simple to write and easy to understand but requires multiple queries to fetch a full thread (one per depth level, or a recursive CTE). Closure table (a separate table storing all ancestor-descendant pairs) enables fetching an entire thread in one query but doubles write complexity. Nested sets allow range queries for subtrees but are expensive to update (any insert requires renumbering). For most comment systems (max depth 3-5), the adjacency list with recursive CTEs is the correct balance of simplicity and performance.</p>
        <p>Real-time delivery to comment sections: WebSocket per-page (subscribe to all comments on the current content item) is straightforward but creates many subscriptions for popular content pages. Server-Sent Events with content-item-specific channels are simpler (unidirectional, reconnects automatically) and sufficient for read-heavy comment sections. WebSocket is preferred if the comment UI also sends real-time events (e.g., typing indicators in a collaborative document comment).</p>
        <p>Comment loading strategy: load all top-level comments versus paginate: for content with fewer than 50 top-level comments, loading all at once simplifies the implementation and allows full client-side sort/filter. Above 50, pagination is necessary to avoid large payloads and slow renders. The threshold should be configured per content type—a developer documentation page with 200 comments might prefer pagination; a product page with 12 comments might prefer loading all.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A production comments system requires: an adjacency list data model with denormalized replyCount for efficient display, optimistic posting with temp-to-permanent ID replacement on server confirmation, lazy reply loading per thread (not upfront for all threads), real-time new comments via WebSocket with deduplication of the poster's own comment, soft deletion to preserve thread structure, and pre-submission moderation running in a Web Worker for non-blocking spam checks. Depth limiting (max 3 visual levels) keeps the UI readable. Sort preference (newest/oldest/top) stored in localStorage persists the user's choice. The deduplication logic for optimistic posts and real-time WebSocket events is the highest-complexity piece of the implementation and must handle the race condition where the WebSocket event arrives before the POST response.</p>
      </section>
    </ArticleLayout>
  );
}
