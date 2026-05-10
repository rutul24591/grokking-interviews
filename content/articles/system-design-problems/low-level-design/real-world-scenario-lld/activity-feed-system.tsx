"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-activity-feed-system",
  title: "Design Activity Feed System",
  description:
    "Production-grade activity feed with real-time updates, pagination, filtering, and aggregation.",
  category: "low-level-design",
  subcategory: "real-world-scenario-lld",
  slug: "activity-feed-system",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: ["lld", "activity-feed", "real-time", "pagination", "aggregation"],
  relatedTopics: ["notifications-badge-system", "comments-system"],
};

export default function ActivityFeedSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>An activity feed surfaces what is happening in a system: teammate Alice commented on a document, three people liked a post, a pull request was approved, a deployment completed. Without a well-designed feed, users have no ambient awareness of system activity and must manually poll resources to see updates. With a poorly designed feed, high-volume systems produce noise so dense that the feed becomes useless—every minor action generating its own row, burying significant events.</p>
        <p>The frontend challenges are distinct from the backend: the feed must render efficiently for long lists (virtual scrolling), prepend new items without disrupting the user's scroll position, aggregate similar events into summary rows ("Alice, Bob, and 3 others liked your post"), support cursor-based pagination for loading older items, and handle real-time updates via WebSocket without race conditions between the initial load and the streaming updates.</p>
        <p><strong>Explicit assumptions:</strong> Activities are generated server-side by an event pipeline and stored in a database. The frontend subscribes to real-time updates via WebSocket for the active session. The feed is user-specific (each user sees a feed relevant to them, not a global firehose). Aggregation of similar events (e.g., multiple likes) happens server-side for the initial load and client-side for real-time appends. Cursor-based pagination is used (not offset-based) to handle concurrent inserts correctly.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Initial load:</strong> Fetch the most recent N activities (typically 20-50) on page load, sorted by recency descending.</li>
          <li><strong>Real-time prepend:</strong> New activities appear at the top of the feed as they occur, without requiring a page refresh.</li>
          <li><strong>Infinite scroll:</strong> Loading older activities as the user scrolls down, fetching the next page via cursor.</li>
          <li><strong>Aggregation:</strong> Group similar events by type and target within a time window: "Alice, Bob, and 5 others liked your photo" instead of 7 separate rows.</li>
          <li><strong>Filtering:</strong> User can filter by activity type (comments only, likes only, mentions only).</li>
          <li><strong>Mark as read:</strong> Activities can be marked read individually or in bulk (mark all read).</li>
          <li><strong>Click navigation:</strong> Clicking an activity navigates to the relevant resource (the comment, the post, the PR).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Render performance:</strong> Feed of 1000+ items renders without jank; virtual scrolling limits DOM nodes to the visible viewport.</li>
          <li><strong>Real-time latency:</strong> New activities appear within 1 second of the triggering event.</li>
          <li><strong>Scroll stability:</strong> Prepending new items does not jump the user's scroll position.</li>
          <li><strong>Pagination correctness:</strong> Cursor-based pagination handles concurrent inserts without duplicates or gaps.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>The feed is a virtualized list driven by a cursor-paginated data store. On initial render, the application fetches the first page of activities from the server and stores them in a local list with their cursor. A WebSocket subscription is established for real-time updates; incoming events are prepended to the list. As the user scrolls to the bottom, the next page is fetched using the last item's cursor as the page token. The list is rendered with a virtual scroll library (react-window or react-virtual) that maintains only visible rows in the DOM.</p>
        <p>Prepending real-time items requires scroll position anchoring: if the user is at the top of the feed, new items prepend and the scroll position shifts down to remain on the same visual content. If the user has scrolled down, new items are queued in a "N new activities" banner rather than silently prepending (which would shift content out of view mid-read). The user clicks the banner to jump to the top and see the new items—a pattern familiar from Twitter and LinkedIn feeds.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/real-world-scenario-lld/activity-feed-system.svg"
          alt="Activity feed system showing event pipeline from sources through Kafka and Redis to WebSocket push, real-time prepend with new-activity banner, cursor pagination, and fan-out delivery strategy"
          caption="Activity feed system showing event pipeline from sources through Kafka and Redis to WebSocket push, real-time prepend with new-activity banner, cursor pagination, and fan-out delivery strategy"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Activity Data Model</h3>
        <p>Each activity record has: activityId (UUID), actorId (who performed the action), actorDisplayName and avatarUrl (denormalized for display without joins), verb (the action type: "liked", "commented", "mentioned", "approved", "deployed"), targetType and targetId (what the action was performed on: post, comment, PR, document), targetTitle (denormalized display text), recipientId (whose feed this appears in), isRead (boolean), createdAt (timestamp, indexed for cursor pagination), and a groupingKey (for aggregation: verb + targetType + targetId, used to cluster similar activities).</p>
        <p>The groupingKey is central to aggregation. All "liked" events on post #42 within a 30-minute window share the key "liked:post:42:YYYY-MM-DDTHH:mm". The server groups activities by this key before returning to the client: instead of returning 7 separate "liked post #42" records, it returns one record with actorIds ["alice", "bob", ...] and a count. The client renders "Alice, Bob, and 5 others liked your post." This grouping is done at query time, not at write time, so aggregation windows can be tuned without backfilling data.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cursor-Based Pagination</h3>
        <p>Offset-based pagination (LIMIT 20 OFFSET 40) is wrong for live feeds because concurrent inserts shift item positions. If 5 new activities are inserted between the first and second page fetch, the second page duplicates 5 items that the first page already returned. Cursor-based pagination solves this: the cursor encodes the exact position in the result set (typically the createdAt timestamp and activityId of the last item on the previous page), and the next page query fetches items strictly older than that cursor.</p>
        <p>The cursor is opaque to the client—it's a base64-encoded JSON object containing {"{"}createdAt: "2026-05-10T12:00:00Z", activityId: "uuid-xyz"{"}"} on the server side. The client receives it as a string and passes it back verbatim for the next page. The query condition is: WHERE (createdAt, activityId) &lt; (cursor.createdAt, cursor.activityId) ORDER BY createdAt DESC, activityId DESC LIMIT 20. The composite key (timestamp + ID) handles ties when multiple activities have the same createdAt millisecond.</p>
        <p>The client tracks whether more pages exist via a hasNextPage flag returned with each page. When the user scrolls within 200px of the bottom of the list, a new page fetch is triggered if hasNextPage is true and no fetch is already in progress. A loading indicator appears at the bottom during the fetch.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Real-Time Updates via WebSocket</h3>
        <p>The WebSocket connection is established on feed mount and kept alive for the session. The server pushes new activity events to the client as they are created. Each pushed event matches the same schema as the fetched activity records, so the client can prepend them without transformation.</p>
        <p>Race condition handling: there is a window between when the initial page fetch begins and when the WebSocket subscription is established. Activities created in this window may be missed. The solution is to establish the WebSocket subscription first, buffer any incoming events, then fetch the initial page. After the page arrives, apply any buffered events that are newer than the newest item in the initial page (compare createdAt timestamps). Events older than or equal to the newest initial item are discarded (they're already in the fetched page). This sequence ensures no events are missed and no events are duplicated.</p>
        <p>When the WebSocket connection drops (network blip, server restart), the client reconnects with a timestamp of the last received event. On reconnect, the server sends all events created since that timestamp as a "catch-up" batch. The client applies the catch-up batch to the list. If the gap is large (the client was offline for hours), the catch-up batch may be truncated; in this case the client refreshes the feed entirely rather than applying a partial update.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Scroll Position Anchoring and New Items Banner</h3>
        <p>Prepending items to the top of a scrollable list increases the total scroll height. If the user is scrolled to the top (scrollTop === 0), prepending and shifting scroll position down by the height of the new items keeps them visually on the same content—scroll anchoring. Modern browsers support this natively via the CSS overflow-anchor: auto property combined with a sentinel element at the top of the list. React's experimental useId-based key strategy for list items also helps the virtual DOM avoid re-ordering existing items during prepend.</p>
        <p>If the user is not at the top (they have scrolled down to read older items), silently prepending items would shift the content they are reading downward, which is disorienting. Instead, incoming real-time items are queued in a pendingItems buffer. A sticky banner appears at the top of the feed: "5 new activities." Clicking the banner scrolls the user to the top and flushes the pending buffer into the visible list. The banner count updates as more items arrive while the user continues reading. This pattern is standard in LinkedIn, GitHub, and Twitter-style feeds.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Virtual Scrolling for Long Feeds</h3>
        <p>A feed with thousands of items cannot have all items in the DOM simultaneously. At 60px per item, 10,000 items would create 600,000px of scroll height with 10,000 DOM nodes—rendering and scrolling would be visibly slow. Virtual scrolling renders only the items currently visible in the viewport (plus a small overscan buffer above and below). As the user scrolls, items leaving the viewport are unmounted and items entering are mounted, keeping the DOM node count constant regardless of the total item count.</p>
        <p>The challenge with variable-height items (activities with previews, aggregated items, or long text) is that virtual scrollers need to know each item's height to calculate scroll positions. The two approaches are: measure-on-render (mount each item off-screen, measure its height, then position it correctly) or estimate-then-correct (use an estimated height for layout, correct after rendering). The estimate-then-correct approach is more performant for large lists because it doesn't require all items to render before the list is interactive.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Read State Management</h3>
        <p>Unread activities are visually distinguished (background color, bold text, unread dot). Marking as read happens optimistically: clicking an activity immediately marks it read in local state and sends a background PATCH request to the server. If the server rejects (unusual—marking read is almost always accepted), the local state reverts.</p>
        <p>Mark all read sends a single request with a "mark all before this timestamp as read" semantic rather than an array of IDs. This is important for high-volume feeds where the unread count might be in the hundreds. The server accepts a cutoff timestamp and marks everything before it read for the current user in a single UPDATE query. The client updates local state to mark all visible activities as read. Activities that arrive via WebSocket after the "mark all" are unread by default.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Aggregation at query time versus write time: query-time aggregation (group activities on the fly when the feed is fetched) is flexible—aggregation windows can be changed without reprocessing stored data—but adds query complexity and latency. Write-time aggregation (store activities pre-grouped, update the group record when a new similar event arrives) is faster to read but requires write-time logic and is harder to change. Most feeds use query-time aggregation for flexibility and add database indexes on the groupingKey to keep it fast.</p>
        <p>Fan-out on write versus fan-out on read: for each activity event, "fan-out on write" pre-writes the activity record to every recipient's feed table (fast reads, expensive writes for users with many followers). "Fan-out on read" stores activities once in a central table and queries per recipient at read time (cheap writes, complex reads). Hybrid: fan-out on write for users with few followers (under 1000), fan-out on read for high-follower users (celebrities, public figures) to avoid extremely expensive write fan-outs. The frontend implementation is identical in both cases—the difference is entirely server-side.</p>
        <p>WebSocket versus Server-Sent Events for real-time delivery: SSE (server-to-client, unidirectional) is simpler to implement and works through HTTP proxies and CDNs without special configuration. WebSocket (bidirectional) is more complex but necessary if the client also needs to send messages to the server (typing indicators, presence updates). For a read-only activity feed, SSE is often sufficient and preferable. For a combined feed + messaging surface, WebSocket is required.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>An activity feed is a real-time, paginated list of user-relevant events that requires careful coordination of initial load, live updates, and infinite scroll. Cursor-based pagination (not offset) handles concurrent inserts correctly. WebSocket (or SSE) delivers real-time events with a startup race condition resolved by buffering events during the initial page fetch. Scroll anchoring preserves the user's reading position during real-time prepends; the "N new activities" banner handles the non-top case elegantly. Virtual scrolling keeps render performance constant regardless of feed length. Query-time aggregation groups similar events (multiple likes) into summary rows. Read state is managed optimistically with "mark all read" using a timestamp cutoff rather than ID arrays. The frontend patterns here apply equally to notification feeds, audit logs, and any other chronological, live-updating event stream.</p>
      </section>
    </ArticleLayout>
  );
}
