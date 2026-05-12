"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-threaded-messaging-system",
  title: "Design a Threaded Messaging System",
  description:
    "Architecture for a threaded messaging system like Slack threads or Discourse: parent message with reply thread, nested reply rendering with indent levels, unread reply counts per thread, thread participant tracking, cross-thread quoting and deep-linking, infinite scroll within thread reply list, real-time reply arrival via WebSocket, thread subscription and notification management, and thread search with context highlighting.",
  category: "high-level-design",
  subcategory: "messaging-communication",
  slug: "threaded-messaging-system",
  wordCount: 5000,
  readingTime: 30,
  lastUpdated: "2026-05-12",
  tags: ["hld", "threading", "replies", "slack-threads", "nested-messages", "unread-counts", "deep-linking"],
  relatedTopics: ["whatsapp-slack-frontend", "notification-inbox-system"],
};

export default function ThreadedMessagingSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A threaded messaging system allows users to reply to a specific message, creating a hierarchical conversation tree. Slack's threads, GitHub's pull request comment threads, and Discourse forum topics all implement this pattern. The core challenge is UI: how do you render a conversation tree that can be dozens of levels deep, has real-time updates arriving at any node, and must provide clear visual hierarchy without becoming incomprehensible? Slack's solution — a "parent message + reply count" in the main channel, with a side panel or inline expansion for replies — is the dominant pattern because it keeps the main channel uncluttered while still showing thread activity.</p>
        <p>The data model complexity: a message has a parentId (null if it is a root message, set to the parent message ID if it is a reply). The thread is all messages with the same root ancestor. Displaying unread counts per thread requires the client to know the last-read position per thread, not just per channel. Cross-device sync of the last-read position is a non-trivial distributed systems problem (which device's read position is authoritative when the user has multiple devices?)</p>
        <p><strong>Explicit scope:</strong> Thread data model, thread rendering (collapsed/expanded), unread thread counts, real-time reply arrival, and thread subscription. Not in scope: moderation tools, thread archiving, or search-across-all-threads implementation.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Thread structure:</strong> A root message in the channel timeline shows a reply count badge ("3 replies") and a timestamp of the most recent reply. Clicking the badge opens the thread panel (right sidebar in Slack's style). The thread panel shows all replies in chronological order with infinite scroll for long threads. Each reply can itself be replied to (nested threads up to configurable depth — Slack limits to 1 level of nesting; Discourse allows unlimited nesting).</li>
          <li><strong>Unread tracking:</strong> Each thread has an independent last-read cursor per user. Opening a thread marks all visible replies as read (setting the lastReadReplyId for that thread). Threads with unread replies are highlighted in the channel timeline with a bold reply count. The left sidebar shows a "Threads" section with all threads the user has participated in or subscribed to, ordered by most recent unread.</li>
          <li><strong>Real-time updates:</strong> New replies arrive via WebSocket and are appended to the thread panel if it is open, or increment the reply count badge if the panel is closed. A new reply to a thread the user is subscribed to triggers a notification. Typing indicators appear in the thread panel when another participant is typing a reply.</li>
          <li><strong>Thread subscription:</strong> Users are auto-subscribed to a thread when they post a reply. Manual subscribe/unsubscribe is available. Subscription drives notification delivery — subscribed thread replies trigger a push notification and appear in the notification inbox.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Performance:</strong> The thread panel opens within 300ms of click (first 20 replies loaded from cache or fetched in one request). Thread reply list virtualizes rendering for threads with &gt;100 replies. New replies appended without layout shift.</li>
          <li><strong>Consistency:</strong> Unread counts must be consistent across devices within 10 seconds. The last-read cursor is synced to the server on thread panel open/close and periodically (every 30s). On a second device, the thread's unread state updates when the server pushes a cursor_updated event via WebSocket.</li>
          <li><strong>Deep linking:</strong> Each thread reply has a unique URL (e.g., /channels/general?thread=msg-123&amp;reply=msg-456). Opening this URL scrolls the channel timeline to the parent message, opens the thread panel, and scrolls the thread panel to the specific reply, highlighting it briefly (CSS animation).</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The architecture separates channel timeline state from thread state. The Channel Timeline Store (Zustand) holds root messages and their thread metadata (reply count, last reply timestamp, last reply author, unread flag). When a new reply arrives via WebSocket for a channel message, only the thread metadata in the timeline is updated — the full reply is stored in a separate Thread Store keyed by threadId. The Thread Panel is a lazy-loaded component that reads from the Thread Store for the active threadId. This separation means that 1,000 threads in a channel do not all load their replies — replies are loaded only when the thread panel is opened for that thread.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/messaging-communication/threaded-messaging-system.svg"
          alt="Threaded messaging system: data model (message: &#123;id, channelId, parentId, rootId, body, authorId, createdAt&#125;; rootId=null for root messages; rootId=parentMessage.id for replies; thread: &#123;rootMessageId, replyCount, lastReplyAt, lastReplyAuthor, participants[]&#125;), thread panel (click reply badge → open panel; fetch GET /threads/{rootId}/replies?limit=20; virtual scroll for 100+ replies; typing indicator: TYPING in thread context; new reply via WS: append to list; panel close → update lastReadReplyId cursor), unread tracking (per-user per-thread cursor: {threadId, lastReadReplyId, updatedAt}; channel timeline: root message bold if unread replies exist; Threads sidebar: list threads with unread sorted by lastReplyAt; cursor sync: server on panel open/close + every 30s; cross-device: WS cursor_updated event), thread subscription (auto-subscribe on reply; manual toggle; subscribed → WS event → push notification; unsubscribe → no more notifications; subscription list in Threads sidebar), deep linking (URL: /channels/{ch}?thread={rootId}&reply={replyId}; on load: scroll timeline to root message; open thread panel; scroll panel to reply; CSS highlight animation 2s)."
          caption="Thread data model (parentId + rootId per message), lazy thread panel (fetch 20 replies on open, virtual scroll), per-user per-thread last-read cursor (sync server + cross-device WS event), auto-subscribe on reply, push notification for subscribed threads, deep-link URL → scroll+highlight specific reply"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Thread Data Model and API</h3>
        <p>Each message in the database has three key fields: parentId (the direct parent, null for root messages), rootId (the root of the thread, null for root messages — denormalized from the parentId chain for O(1) thread lookup), and threadId (same as rootId, used as the key for thread-level queries). The Thread object is a materialized aggregate: &#123;rootMessageId, channelId, replyCount, lastReplyAt, lastReplyAuthor, participantIds, isResolved&#125;. This aggregate is maintained by the server via triggers or event handlers — every new reply increments the Thread's replyCount and updates lastReplyAt atomically. The client receives Thread objects in channel sync responses and does not need to count replies client-side.</p>
        <p>Thread replies API: GET /api/threads/&#123;rootId&#125;/replies?cursor=&#123;lastId&#125;&amp;limit=20. Keyset pagination by reply ID (monotonic creation order). The response includes replies with their content and metadata, and a nextCursor for pagination. When the thread panel is opened for the first time, the first 20 replies are fetched. Subsequent scroll triggers fetch the next page. All fetched replies are stored in the Thread Store keyed by threadId — closing and re-opening the panel re-uses cached replies and fetches only newer replies (since lastId).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unread Count Management</h3>
        <p>Unread counts are stored server-side as a per-user per-thread cursor: the ID of the last reply the user has "seen" (the reply visible in the thread panel at the time the panel was last closed). When the user opens a thread panel, all currently visible replies are marked as read by sending a PATCH /api/threads/&#123;rootId&#125;/cursor &#123;lastReadReplyId: "reply-xyz"&#125;. The server updates the cursor and broadcasts a cursor_updated WebSocket event to all the user's connected clients (for cross-device sync).</p>
        <p>The channel timeline shows a thread as "unread" when any reply exists with a createdAt newer than the user's cursor for that thread. This comparison is done client-side: the Zustand store holds &#123;threadId: lastReadReplyId&#125; for all threads the user has opened. When a new reply WebSocket event arrives, the store checks: is this reply's ID newer than the lastReadReplyId for this thread? If yes, mark the root message's thread badge as unread. This avoids a server request per new reply just to determine unread status.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Nested Thread Rendering</h3>
        <p>For systems that support multiple nesting levels (Discourse, GitHub PR reviews), the rendering challenge is indentation and collapse. A reply at depth 1 is indented 24px. A reply at depth 2 is indented 48px. Maximum depth is enforced (configurable, e.g., 5 levels). Deeply nested threads use a "collapse thread" mechanism: a single-click on the parent reply collapses all its descendants, showing a summary "X hidden replies" that re-expands on click. This is implemented with a collapsed Set in React state — a message's children are not rendered if the message ID is in the collapsed Set.</p>
        <p>For Slack-style 1-level threading (no nested replies), the UI is simpler: the thread panel shows a flat list of replies, all at the same indentation. Quoting (referencing another message within a reply) provides cross-thread context without deep nesting. The quote renders as a styled blockquote with a link back to the original message.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Thread Search and Deep Linking</h3>
        <p>Searching within a thread (the thread panel has a search icon) queries GET /api/threads/&#123;rootId&#125;/replies/search?q=&#123;query&#125; and returns matching replies with highlighted snippets. Results are shown in a mini-result list above the reply composer; clicking a result scrolls the virtual list to that reply. Cross-thread search (finding any thread that contains a phrase) queries the main search cluster and returns thread results with the matching reply highlighted in context.</p>
        <p>Deep linking to a specific reply: the URL encodes both the threadId (for opening the thread panel) and the replyId (for scrolling to the specific reply). On page load, the router parses these parameters, fetches the channel timeline up to the root message, opens the thread panel for that thread, fetches replies until the target replyId is loaded (may require multiple pagination requests), and then calls scrollToItem on the virtualizer. The target reply is highlighted with a CSS keyframe animation (background flashes amber → transparent over 2 seconds) to draw the user's attention.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Side panel vs. inline thread expansion: Slack uses a right-side panel that pushes the channel timeline left (reducing its width). Discourse and GitHub use inline expansion — the thread expands in-place within the timeline, pushing subsequent messages down. The side panel keeps the channel timeline full-width but requires switching between the timeline and the thread panel. Inline expansion preserves context (the original message stays visible alongside its replies) but adds visual noise to the channel. The side panel pattern is better for channels with high message volume (replies don't fragment the timeline); inline expansion is better for low-volume, long-form discussion (forums, code review).</p>
        <p>Real-time reply count updates vs. polling: receiving a WebSocket event for every new reply in every channel the user is in is the most accurate approach — unread counts are always current. But it requires the server to maintain a WebSocket subscription per channel per user, which at 1M users × 100 channels = 100M subscriptions. Many systems use a hybrid: WebSocket events for channels the user has open, and polling (every 30s) for channels in the background. The unread count may lag by 30 seconds for background channels, which is acceptable for most use cases.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A threaded messaging system is built on: (1) thread data model (parentId + rootId per message, materialized Thread aggregate with replyCount + lastReplyAt maintained server-side, O(1) thread lookup by rootId); (2) lazy thread panel (open → fetch 20 replies with keyset pagination, virtual scroll for 100+ replies, append new replies from WS without layout shift, close → update lastReadReplyId cursor); (3) unread count tracking (per-user per-thread cursor, client-side unread check comparing cursor vs. new reply ID, server PATCH on panel close, cross-device WS cursor_updated event); (4) auto-subscribe on reply (subscription drives push notification + Threads sidebar); and (5) deep linking (URL with threadId + replyId → sequential fetch + scrollToItem + CSS highlight animation). The defining tension: threading adds information hierarchy but also UI complexity — the design must prevent threads from making the conversation harder to follow rather than easier.</p>
      </section>
    </ArticleLayout>
  );
}
