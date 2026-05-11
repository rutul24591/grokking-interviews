"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-notifications-badge-system",
  title: "Design Notifications Badge System",
  description:
    "Production-grade notification badges with real-time updates, mark-as-read, filtering, and multi-device sync.",
  category: "low-level-design",
  subcategory: "real-world-scenario-lld",
  slug: "notifications-badge-system",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: ["lld", "notifications", "badges", "real-time", "synchronization"],
  relatedTopics: ["activity-feed-system", "push-notification-ux"],
};

export default function NotificationsBadgeSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">The notification badge—that small red number on a bell icon—is one of the most engagement-critical UI elements in a web application. It answers the user's implicit question "has anything happened since I last looked?" without requiring them to navigate away from their current task. Done well, it surfaces exactly the right information: a count that is accurate across devices, updates in real-time, and clears immediately when content is read. Done poorly, it becomes a source of anxiety (a perpetually wrong count) or noise (notifying for low-priority events the user doesn't care about).</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">The technical challenges center on distributed read state: if the user reads a notification on their phone, the badge on their desktop browser should clear immediately. If a new notification arrives while the user's desktop tab is in the background, the badge should increment when they switch back. If the user marks all notifications read, the server must atomically update a potentially large set of records and confirm success before the client zeros the badge. Each of these requirements has specific implementation patterns with trade-offs between consistency, latency, and complexity.</HighlightBlock>
        <HighlightBlock as="p" tier="important"><strong>Explicit assumptions:</strong> Notifications are user-specific (not broadcast). The badge shows the unread notification count. Read state is stored server-side for cross-device sync. Real-time delivery uses WebSocket for active sessions. Push notifications for inactive sessions are out of scope for this article. The notification panel (expanded list of notifications) is distinct from the badge but driven by the same data.</HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Badge count:</strong> Show the number of unread notifications. Update in real-time when new notifications arrive or existing ones are read.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Notification panel:</strong> On badge click, show a list of recent notifications with metadata (actor, action, target, timestamp). Paginated for large counts.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Mark as read:</strong> Reading a notification (clicking it to navigate) marks it read and decrements the badge. "Mark all read" zeros the badge.</HighlightBlock>
          <li><strong>Multi-device sync:</strong> Reading on one device clears the badge on all other active devices within seconds.</li>
          <li><strong>Notification types:</strong> Support filtering by type (mentions, comments, approvals) within the panel.</li>
          <li><strong>Persistence:</strong> Notifications persist; re-opening the app shows historical notifications (not just those from the current session).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Accuracy:</strong> Badge count must match actual unread count server-side; stale counts create user distrust.</li>
          <HighlightBlock as="li" tier="crucial"><strong>Latency:</strong> New notification appears in badge within 1 second of creation. Mark-as-read reflects immediately (optimistic update).</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Cross-device propagation:</strong> Read state sync across devices within 3 seconds.</HighlightBlock>
          <li><strong>Scalability:</strong> Works correctly for users with thousands of notifications without loading all of them.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="crucial">The system maintains the unread count as a server-side integer per user (not computed by counting unread records on each request). This counter is the source of truth for the badge display. On session start, the client fetches the current count in the initial data load. A WebSocket subscription receives increments (new notifications) and decrements (read events) as delta messages. The client applies deltas to the local count state rather than refetching the full count on every change.</HighlightBlock>
        <HighlightBlock as="p" tier="important">When the user opens the notification panel, the first page of notifications is fetched from the server (most recent N, with read/unread status). Scrolling loads older pages. Clicking a notification marks it read optimistically in the client (mark UI as read, decrement local count) and sends a PATCH to the server. "Mark all read" sends a single server request with a timestamp cutoff; the server marks everything read and returns the new count (should be 0).</HighlightBlock>
        <HighlightBlock as="p" tier="important">Cross-device sync works via the same WebSocket channel. When the user reads a notification on Device A, the server publishes a read event to all of the user's active WebSocket connections. Device B receives this event and decrements its local count. This is the same mechanism as real-time delivery—a single pub/sub channel handles both new notifications and read state changes.</HighlightBlock>
      </section>

      <section>
                <h2>Diagram Walkthrough</h2>

<ArticleImage
          src="/diagrams/system-design-problems/low-level-design/real-world-scenario-lld/notifications-badge-system.svg"
          alt="Notifications badge system showing delivery pipeline from server event through notification service and WebSocket to badge increment, read state flow with optimistic decrement, and multi-device BroadcastChannel sync"
          caption="Notifications badge system showing delivery pipeline from server event through notification service and WebSocket to badge increment, read state flow with optimistic decrement, and multi-device BroadcastChannel sync"
        />

        <HighlightBlock as="p" tier="crucial">
          Interview signal: the diagram captures the end-to-end flow for <strong>Design Notifications Badge System</strong>. You should be able to explain the happy path and the failure paths (retries, cancellation, backpressure), not just the API surface.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Look for the &ldquo;control points&rdquo; where correctness is enforced: idempotency keys, monotonic request/version tokens, single-flight coordination, and durable persistence boundaries.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          In interviews, call out observability and operability: what you log/measure (p95 latency, error rates, retries/queue depth) and how you keep degraded modes user-safe (read-only, queued, or cached fallbacks).
        </HighlightBlock>
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Unread Count as a Counter, Not a Query</h3>
        <HighlightBlock as="p" tier="important">Computing the unread count by querying SELECT COUNT(*) WHERE userId = ? AND isRead = false on every badge render would be expensive at scale and add database latency to page loads. Instead, maintain a dedicated counter in a fast store (Redis or a single database column on the user record). When a new notification is created for a user, atomically increment their counter (Redis INCR). When a notification is marked read, atomically decrement (Redis DECR, clamped to minimum 0). When "mark all read" runs, set the counter to 0.</HighlightBlock>
        <HighlightBlock as="p" tier="important">The counter can drift from the actual count (if notifications are deleted, or if a system error occurs during update). Periodic reconciliation (once per day, or on user login) re-computes the true count from the notifications table and corrects the counter if it differs. This reconciliation is a background job, not in the critical request path. The counter is the display source of truth; the notifications table is the historical source of truth.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Real-Time Delta Protocol</h3>
        <p>Rather than pushing full notification payloads for every badge update, the WebSocket protocol uses delta messages. A new notification event contains the full notification payload plus a badgeDelta: +1 field. A read event contains the notificationId(s) and a badgeDelta: -N. The client applies the delta to its local count state. This means the badge can update without the notification panel being open—the count increments from 3 to 4 without loading the new notification's full data.</p>
        <p>When the notification panel is open (the user clicked the bell), incoming new notification events also prepend the notification to the visible list. This requires the panel to subscribe to the same WebSocket events and apply them to the notification list state. If the panel is closed, incoming events are queued; when the panel opens, queued events are applied to the initial page of notifications (checking for duplicates by notificationId before prepending).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Optimistic Mark-as-Read</h3>
        <HighlightBlock as="p" tier="important">When the user clicks a notification, the UI should immediately reflect the read state (notification loses its unread styling, badge decrements) without waiting for the server acknowledgment. The optimistic update is: (1) decrement local badge count; (2) set the notification's isRead: true in local state; (3) fire an async PATCH /notifications/:id/read to the server; (4) on server success, do nothing (already updated); (5) on server error, revert—increment badge count and set isRead: false. Reverts are rare but must be handled to maintain badge accuracy.</HighlightBlock>
        <p>For "mark all read," the optimistic update is: (1) set local badge count to 0; (2) mark all loaded notifications as isRead: true in local state; (3) fire PATCH /notifications/read-all with a cutoff timestamp; (4) on error, revert by re-fetching the true count from the server and restoring the previous read states. The revert on "mark all" is complex enough that the application should show a brief loading indicator during the server call rather than optimistically zeroing and risking a confusing revert for the user.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Multi-Device Synchronization via BroadcastChannel</h3>
        <p>When the user has the application open in multiple tabs of the same browser, read state changes should propagate between tabs without a server round-trip. The BroadcastChannel API enables message passing between same-origin browser contexts (tabs, iframes, service workers). When Tab A marks a notification read, it broadcasts a read event on the notification channel. Tab B receives it and applies the same delta to its local state.</p>
        <p>BroadcastChannel is a supplement to, not a replacement for, server-side sync. Cross-device sync (phone and desktop) still requires the WebSocket channel. Same-browser multi-tab sync via BroadcastChannel is a UX improvement—without it, the user might switch tabs and see a stale badge count until the next WebSocket event arrives. With BroadcastChannel, the sync is instantaneous for same-browser cases.</p>
        <HighlightBlock as="p" tier="important">The message format for BroadcastChannel should match the WebSocket delta format for consistency: {"{"}type: "notification_read", notificationIds: ["uuid-1"], badgeDelta: -1{"}"}. The receiving tab applies the same handler as for WebSocket events. This allows the notification state management code to be written once and handle both transport channels.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Notification Panel Pagination</h3>
        <HighlightBlock as="p" tier="crucial">The notification panel displays the most recent notifications first. On open, the first page (20 items) is fetched. Scrolling to the bottom of the panel triggers the next page using cursor-based pagination (same as the activity feed). The panel tracks cursor state separately from the badge count state.</HighlightBlock>
        <p>When the user opens the panel and has 47 unread notifications, only the first 20 are displayed. As they scroll and load more pages, notifications are marked read progressively. The badge count decrements as notifications are marked read (either by clicking or by "mark all"). The panel's read state and the badge count are kept in sync via the same local state management.</p>
        <p>For users who have accumulated thousands of unread notifications (common for accounts that were inactive for long periods), the initial count fetch and "mark all read" must be efficient. The count fetch returns a number (not a list). "Mark all read" executes a single UPDATE with a timestamp cutoff. The panel then shows all notifications as read without individually updating each one in the local list—the list state is updated by setting a "markAllReadBefore" timestamp and rendering notifications before that timestamp as read.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Browser Tab Title and Favicon Badging</h3>
        <p>Beyond the in-app badge, the browser tab title can reflect the unread count: "(3) Dashboard" versus "Dashboard". This is updated whenever the local badge count changes. The format should match the application's convention and be cleared when the count reaches zero.</p>
        <p>The Web App Badging API (navigator.setAppBadge(count)) allows setting a badge on the application's icon in the OS taskbar (for PWAs installed on the device). This extends the notification badge beyond the browser tab to the OS level, similar to native app badge counts. Calling navigator.clearAppBadge() when the count reaches zero removes the badge. Browser support is limited to Chromium-based browsers for the Badging API, so it should be used as progressive enhancement with feature detection.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="crucial">Counter-based versus query-based badge count: the counter approach (Redis INCR/DECR) provides O(1) badge reads but introduces a consistency gap—the counter can diverge from the true count. The query approach (COUNT(*) on every load) is always accurate but adds database load and latency. For applications where badge accuracy is critical (a wrong count erodes user trust quickly), use the counter with periodic reconciliation. For low-traffic applications, the query approach is simpler and avoids the reconciliation complexity.</HighlightBlock>
        <HighlightBlock as="p" tier="important">WebSocket versus polling for real-time delivery: WebSocket provides true real-time updates (under 1 second) but requires persistent connections that consume server resources. Polling (every 30 seconds) is simpler and more compatible with serverless or CDN-cached architectures but introduces up to 30-second delays in badge updates. For notification badges, real-time is a UX expectation in most applications; polling delays are noticeable and frustrating. WebSocket is the correct choice for notification systems.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Notification retention and storage: how long should notifications be retained? Indefinitely (full history) is expensive for high-volume users. A rolling 90-day window is typical. Archiving old notifications (move to cold storage, exclude from default pagination) keeps the active table small while preserving history for users who need it. The badge count should only reflect notifications within the retention window—it makes no sense to show unread counts for notifications too old to be actionable.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">The badge count is display state driven by the server counter; the notification list is separate data fetched on panel open with cursor pagination. The</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">defining challenge is maintaining count accuracy across distributed read events: the counter approach with periodic reconciliation balances performance and accuracy. Multi-device sync requires server-side pub/sub (the server notifies all of a user's active connections when read events occur on any one of them).</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
