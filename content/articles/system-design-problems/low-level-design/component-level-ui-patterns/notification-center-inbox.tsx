"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-notification-center-inbox",
  title: "Design a Notification Center / Inbox",
  description:
    "Notification center with read/unread states, grouping, mark-all-read, real-time badge count, filtering, and accessibility.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "notification-center-inbox",
  wordCount: 3200,
  readingTime: 20,
  lastUpdated: "2026-04-03",
  tags: ["lld", "notifications", "inbox", "real-time", "grouping", "accessibility"],
  relatedTopics: ["toast-notification-system", "chat-messaging-ui", "stepper-progress-tracker"],
};

export default function NotificationCenterInboxArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a notification center / inbox — a centralized panel where
          users view, manage, and interact with all their notifications. Notifications
          have read/unread states, can be grouped by type or conversation, support
          mark-as-read and mark-all-read actions, display a real-time unread badge
          count, and can be filtered by type or date.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>Notifications arrive via WebSocket for real-time updates and via REST API for historical loading.</li>
          <li>Each notification has: id, type, title, body, timestamp, read status, action link, grouping key.</li>
          <li>Grouping: notifications with the same key (e.g., &quot;comment on post X&quot;) are collapsed into a single item with a count.</li>
          <li>Unread badge count is displayed in the global header.</li>
          <li>The component is used in a React 19+ SPA.</li>
        </ul>
      </section>

      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Notification List:</strong> Paginated list of notifications, newest first, with read/unread visual distinction.</li>
          <li><strong>Mark as Read:</strong> Click notification or explicit &quot;mark read&quot; action. Updates status locally and on server.</li>
          <li><strong>Mark All Read:</strong> Single action marks all notifications as read.</li>
          <li><strong>Grouping:</strong> Notifications with the same grouping key are collapsed (e.g., &quot;5 people liked your post&quot;).</li>
          <li><strong>Real-Time Badge:</strong> Unread count badge updates instantly on new notification arrival via WebSocket.</li>
          <li><strong>Filtering:</strong> Filter by type (mention, comment, system), date range, read/unread.</li>
          <li><strong>Actions:</strong> Each notification may have an action link (e.g., &quot;View comment&quot;, &quot;Approve request&quot;).</li>
          <li><strong>Deletion:</strong> Dismiss individual notifications or clear all read notifications.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Real-Time Latency:</strong> New notifications appear within 200ms of WebSocket arrival.</li>
          <li><strong>Performance:</strong> 1000+ notifications render smoothly with virtualization.</li>
          <li><strong>Accessibility:</strong> Screen reader announces new notifications, keyboard navigation between items.</li>
          <li><strong>Badge Accuracy:</strong> Badge count is always consistent with server state, even after reconnect.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>WebSocket delivers same notification twice (duplicate delivery) — deduplicate by ID.</li>
          <li>User marks notification as read on another device — sync via WebSocket or polling.</li>
          <li>Grouped notification has 50 sub-items — expand with virtualized sub-list.</li>
          <li>Notification action link navigates away — mark as read before navigation.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is a <strong>notification store</strong> (Zustand) managing a
          normalized list of notifications with read/unread state. A <strong>WebSocket
          manager</strong> handles real-time notification delivery and read status sync.
          A <strong>grouping engine</strong> collapses notifications with the same key
          into grouped items with counts. The UI renders a virtualized list with
          read/unread visual distinction and filter controls.
        </p>
        <p>
          <strong>Why store + grouping engine is optimal:</strong> The normalized store
          makes read/unread state management O(1). The grouping engine reduces visual
          clutter for high-volume notification types. WebSocket integration ensures
          real-time badge accuracy without polling.
        </p>
      </section>

      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Types &amp; Store</h4>
          <p><code>Notification</code> (id, type, title, body, timestamp, read, groupingKey, actionUrl). Store: normalized Map, unread count, pagination cursor, active filters.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Grouping Engine</h4>
          <p>Groups notifications by groupingKey. Returns grouped items with sub-item count, last timestamp, and sample text (&quot;Alice and 4 others commented&quot;).</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. WebSocket Manager</h4>
          <p>Receives new notifications, read confirmations, badge count sync. Reconnects with exponential backoff, reconciles missed notifications.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Badge Counter Manager</h4>
          <p>Tracks unread count, syncs with server on reconnect, displays in global header. Uses <code>Document.title</code> prefix for background tab alerts.</p>
        </div>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/notification-center-inbox-architecture.svg"
          alt="Notification center architecture showing WebSocket updates, grouping engine, and badge management"
          caption="Component Interaction Flow"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>Panel opens: store fetches notifications, groups them, renders virtualized list.</li>
          <li>New notification arrives via WebSocket: store adds it, grouping engine re-groups, badge increments.</li>
          <li>User clicks notification: mark as read, navigate to action URL, badge decrements.</li>
          <li>User clicks &quot;Mark all read&quot;: store marks all unread as read, sends bulk API request, badge resets to 0.</li>
        </ol>
      </section>

      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          Data flow: WebSocket receive → store add → group → render → badge update.
          Read flow: user click → optimistic mark read → store update → API send →
          badge decrement → server confirmation.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling</h3>
        <ul className="space-y-3">
          <li><strong>Duplicate notifications:</strong> Store checks for existing ID before adding. If duplicate, increments the group count instead of creating a new entry.</li>
          <li><strong>Multi-device sync:</strong> When user marks a notification as read on another device, the server broadcasts a <code>notification:read</code> event. The store updates the local read status accordingly.</li>
          <li><strong>Reconciliation on reconnect:</strong> After WebSocket reconnect, fetch unread count from server. If local count differs, sync to server&apos;s authoritative count.</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <p>
          The full production implementation is available in the <strong>Example tab</strong>.
          Below is a high-level overview of each module.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">📦 Switch to the Example Tab</h3>
          <p>
            Complete implementation includes: normalized notification store, grouping
            engine, WebSocket manager with reconnect, badge counter with document title
            prefix, virtualized notification list, filter controls, mark-all-read, and
            full ARIA compliance.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Modules Overview</h3>
        <p>
          The store uses a normalized Map for O(1) notification lookup. The grouping
          engine clusters by groupingKey with sample text generation. WebSocket manager
          handles real-time delivery and read sync. Badge manager tracks unread count
          and updates document title. The UI renders a virtualized list with filter
          controls and action links.
        </p>
      </section>

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
                <td className="p-2">addNotification</td>
                <td className="p-2">O(1) — Map set</td>
                <td className="p-2">O(n) — n notifications</td>
              </tr>
              <tr>
                <td className="p-2">markAsRead</td>
                <td className="p-2">O(1) — Map update</td>
                <td className="p-2">O(1)</td>
              </tr>
              <tr>
                <td className="p-2">Grouping engine</td>
                <td className="p-2">O(n) — single pass</td>
                <td className="p-2">O(g) — g groups</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li><strong>Regrouping on every new notification:</strong> O(n) pass. Mitigation: incremental grouping — only update the affected group, not all groups.</li>
          <li><strong>Virtualization for large lists:</strong> 1000+ notifications cause DOM bloat. Mitigation: virtualize with 20-item visible window plus 10-item overscan.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li><strong>Incremental grouping:</strong> When a new notification arrives, check if its groupingKey already has a group. If yes, increment the count and update the sample text. If no, create a new group. O(1) instead of O(n).</li>
          <li><strong>Batched read receipts:</strong> Instead of sending a read receipt per notification, batch them: send one API call for all notifications marked read in the last 500ms.</li>
        </ul>
      </section>

      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Validation &amp; Accessibility</h3>
        <p>
          Notification titles and bodies are sanitized before rendering. Action URLs
          are validated against an allowlist to prevent open redirect attacks. For
          accessibility, new notifications are announced via <code>aria-live</code>
          regions, and each notification item has <code>role=&quot;article&quot;</code>
          with <code>aria-label</code> containing the notification text and read status.
          Keyboard navigation uses ArrowUp/Down between items, Enter to open, Delete
          to dismiss.
        </p>
      </section>

      <section>
        <h2>Testing Strategy</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li><strong>Store:</strong> Test add, mark read, mark all read, delete. Test unread count accuracy.</li>
          <li><strong>Grouping engine:</strong> Test same-key grouping, sample text generation, count increment.</li>
          <li><strong>Badge manager:</strong> Test increment/decrement, document title prefix, server sync on reconnect.</li>
        </ul>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li><strong>Real-time flow:</strong> Simulate WebSocket notification, verify it appears in list, badge increments, aria-live announces.</li>
          <li><strong>Mark all read:</strong> Click mark-all-read, verify all items visually marked read, badge resets, API call sent.</li>
        </ul>
      </section>

      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes</h3>
        <ul className="space-y-3">
          <li><strong>Polling instead of WebSocket:</strong> Polling for new notifications wastes bandwidth and introduces latency. WebSocket is the standard.</li>
          <li><strong>No grouping:</strong> Showing 50 &quot;X liked your post&quot; notifications individually is overwhelming. Grouping is essential.</li>
          <li><strong>Badge drift:</strong> If the badge count is not synced with the server on reconnect, it becomes inaccurate. Server-authoritative count on reconnect is essential.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement notification preferences (per-type mute)?</p>
            <p className="mt-2 text-sm">
              A: Store user preferences as a map of notification type to enabled/disabled.
              When a notification arrives, check preferences before adding to the store.
              Muted notifications are still counted server-side (for email/digest) but
              not shown in the in-app inbox.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement a digest summary (daily/weekly email)?</p>
            <p className="mt-2 text-sm">
              A: A background job aggregates notifications per user per time window.
              Groups by type, generates summary text (&quot;You have 12 new notifications:
              5 comments, 4 likes, 3 mentions&quot;), and sends via email/push. The
              in-app inbox is unaffected — digest is a separate delivery channel.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you handle notification expiration (auto-delete after 30 days)?</p>
            <p className="mt-2 text-sm">
              A: Server-side cron job deletes notifications older than 30 days. The
              client receives a <code>notifications:expired</code> event with the IDs
              of expired notifications. The store removes them and adjusts the unread
              count accordingly.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement push notifications (browser native) alongside the in-app inbox?</p>
            <p className="mt-2 text-sm">
              A: Use the Web Push API with a Service Worker. When a notification arrives
              via WebSocket, also send a push notification if the user has granted
              permission. The Service Worker handles the push display even when the tab
              is closed. Clicking the push notification opens the browser and navigates
              to the relevant page.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — Web Notifications API
            </a>
          </li>
          <li>
            <a href="https://www.nngroup.com/articles/notifications-inbox-best-practices/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Nielsen Norman Group — Notification Inbox Best Practices
            </a>
          </li>
          <li>
            <a href="https://zustand-demo.pmnd.rs/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Zustand — State Management for Real-Time UIs
            </a>
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/feed/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              WAI-ARIA Feed Pattern — Live Region Announcements
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
