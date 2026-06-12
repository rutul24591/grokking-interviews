"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-notification-center-inbox",
  title: "Design a Notification Center / Inbox",
  description:
    "LLD for an in-app notification center: read/unread, grouping, mark-all-read, real-time badge count, infinite scroll, and accessibility.",
  category: "low-level-design",
  subcategory: "communication-collaboration",
  slug: "notification-center-inbox",
  wordCount: 6500,
  readingTime: 34,
  lastUpdated: "2026-04-30",
  tags: ["lld", "notifications", "inbox", "real-time", "react"],
  relatedTopics: [
    "real-time-notification-delivery-system",
    "chat-messaging-ui",
    "infinite-scroll-virtualized-list",
  ],
};

export default function NotificationCenterInboxArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a Notification Center Inbox</h1><h2>Definition &amp; Context</h2><p>Design a Notification Center Inbox is an implementation-heavy low-level design problem covering baseline fetch, socket merge, grouping, unread watermark, pagination, mark-read mutation, cross-tab sync, and retention. A principal-level answer must define ordering, ephemeral versus durable state, reconnect behavior, rollback, abuse controls, privacy, cost, and observability.</p><p>Normalize notifications by id and derive unread state from durable acknowledgement rather than visual rendering. The core structures are notification map, ordered ids, cursor ledger, unread watermark, group keys, socket buffer, mutation journal, tab channel, and retention policy.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/communication-collaboration/notification-center-inbox-runtime.svg" alt="Design a Notification Center Inbox runtime" caption="Real-time flow from input through merge policy and UI projection." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific mechanics.</p><section>
        <h3>🎯 Problem Context &amp; Scope Definition</h3>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="important">
          We are designing an in-app notification
          center — the dropdown or panel that
          surfaces notifications (mentions, replies,
          activity, system alerts) with a real-time
          badge count, read/unread states, grouping,
          mark-all-read, and infinite scroll for
          older notifications. The component is
          ubiquitous in modern apps; getting it
          right means notifications feel timely
          without being overwhelming.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The hard problems are: real-time badge
          count updates without UI thrash; unread
          → read state transitions with optimistic
          UI; intelligent grouping (10 likes on a
          post collapse to one notification);
          infinite scroll for history; cross-tab
          consistency (mark as read in one tab
          updates badge in others); accessibility
          for the notification list.
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          End users see a bell icon with a badge
          count; clicking opens the inbox.
          Engineering teams provide a notification
          source (server endpoint + WebSocket); the
          runtime handles UI. Product wants
          notifications to feel timely but not
          spammy.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Backend exposes a list endpoint plus a
          WebSocket for new notifications. Each
          notification has id, type, content,
          actor (who triggered), target (what was
          acted on), createdAt, readAt. Modern
          browsers; we use BroadcastChannel for
          cross-tab sync.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement the notification
          backend or delivery pipeline (separate
          Real-time Notification Delivery System).
          We do not implement push notifications
          (browser/OS-level). We do not implement
          email/SMS notification preferences.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚙️ Functional Requirements</h3>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          Bell icon with badge count showing
          unread total. Clicking opens the inbox
          panel. List of notifications, newest
          first, with read/unread visual state.
          Click a notification to mark read and
          navigate. Mark-all-read action. Infinite
          scroll for older notifications. Real-
          time updates: new notifications appear
          at top; badge count updates. Empty state.
          Loading state. Cross-tab consistency:
          marking read in one tab updates other
          tabs.
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Grouping (10 likes on a post → one
          grouped notification). Filter tabs (All,
          Unread, Mentions). Per-notification
          actions (accept/decline an invite).
          Snooze a notification. Notification
          preferences (mute types). Smart batching
          (digest mode). Search notifications.
          Read receipts back to senders for
          mention notifications.
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          Browser push notifications, email/SMS,
          notification authoring tools, A/B
          testing of notification content.
        </HighlightBlock>
      </section>

      <section>
        <h3>📊 Non-Functional Requirements</h3>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          Badge update under 100 ms of arrival.
          Inbox open under 100 ms. Mark-as-read
          under 50 ms (optimistic). Infinite
          scroll smooth.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="crucial">
          Badge count accurate even with network
          blips. Optimistic mark-read rollback on
          server failure. Cross-tab consistency
          tight.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          Notification content rendered as text;
          actors and targets validated. Server-
          enforced authorization (you only see
          your notifications).
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="important">
          Bell icon labeled with badge count.
          Inbox dropdown is a real menu/dialog.
          Notifications are list items.
          Mark-read announces.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          Notification source adapter. Renderers
          per notification type. Plugins for
          actions, filters.
        </HighlightBlock>
      </section>

      

      <section>
        <h3>🧠 Solution Approach</h3>
        <HighlightBlock as="p" tier="crucial">
          The notification center has four parts:
          <strong> notification source adapter</strong>{" "}
          (WebSocket + REST), <strong>notification
          store</strong> (ordered, deduped, grouped),
          <strong> bell badge</strong> with unread
          count, and <strong>inbox panel</strong>{" "}
          with virtualized list and mark-read
          mechanics. Cross-tab consistency via
          BroadcastChannel.
        </HighlightBlock>
        <p>
          The <strong>notification source adapter</strong>{" "}
          subscribes to a WebSocket for live
          updates and uses REST for history. New
          notifications arrive via WebSocket and
          push into the store. Older notifications
          fetch via REST on inbox open and on
          scroll.
        </p>
        <p>
          The <strong>notification store</strong>{" "}
          holds notifications in chronological
          order, deduped by id. Each entry has
          read/unread status. The store also
          maintains a grouped view: notifications
          of the same type targeting the same
          object within a time window collapse
          (e.g. &ldquo;Alice and 9 others liked
          your post&rdquo;). Grouping is computed
          from the raw list; raw notifications
          remain available for unread state and
          actions on individual items.
        </p>
        <p>
          The <strong>bell badge</strong> shows the
          unread count. The count is derived from
          the store: count of unread notifications,
          capped at a display limit (e.g. 99+).
          The bell icon highlights when new
          notifications arrive. Clicking opens
          the inbox panel.
        </p>
        <HighlightBlock as="p" tier="important">
          The <strong>inbox panel</strong> renders
          the notification list, virtualized for
          long histories. Each notification shows
          actor avatar, content (rendered per
          type), target preview, timestamp. Unread
          notifications have a visual marker (bold
          text, colored dot). Clicking a notification
          marks it read (optimistically) and
          navigates to its target.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          On <strong>mark as read</strong> (single
          notification or all): optimistic update
          to the store; the badge count updates
          immediately. Server call ships in
          background; on failure, rollback. Mark-
          all-read is one click that sets all
          unreads to read.
        </HighlightBlock>
        <p>
          On <strong>real-time arrival</strong>:
          WebSocket delivers a new notification.
          The store appends; the badge count
          updates. If the inbox is open, the new
          notification slides in at the top with a
          subtle animation. If closed, the bell
          gets a brief animation hint.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>Cross-tab consistency</strong>:
          BroadcastChannel broadcasts state changes.
          Tab A marks read; tab B receives the
          broadcast and updates its badge. New
          notifications also broadcast so all tabs
          stay in sync. Without this, users would
          see stale badge counts in background
          tabs.
        </HighlightBlock>
        <p>
          <strong>Auto-mark-on-view</strong>: when
          the inbox is open and a notification
          enters the viewport (via
          IntersectionObserver), we mark it read
          after a short delay (e.g. 500 ms). This
          matches user expectation — opening the
          inbox to see notifications counts as
          reading them. Configurable per product
          (some prefer explicit click).
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>Infinite scroll</strong>: standard
          downward infinite scroll for older
          notifications. Cursor-based; integrates
          with the Cursor-based Pagination UI
          patterns.
        </HighlightBlock>
        <p>
          <strong>Filters</strong>: tabs at the top
          of the inbox (All, Unread, Mentions).
          Filter changes update the rendered list
          (client-side filter on cached
          notifications, or server-side fetch for
          the filter).
        </p>
      </section>

      <section>
        <h3>🧱 Component Architecture</h3>
        <HighlightBlock as="p" tier="crucial"><strong> NotificationItem</strong>{" "}
          renders one notification.
          <strong> FilterTabs</strong> renders
          filter options.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important"><strong> MarkAllRead</strong></Highlight> action.
          <strong> Renderers per type</strong>{" "}
          (mention, like, comment, follow, system).</HighlightBlock>
      </section>

      <section>
        <h3>🔄 State Management</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Notification list, unread counts, filter
          state in external store. WebSocket
          <Highlight tier="important">connection state in connection store.
          BroadcastChannel</Highlight> synchronizes across
          tabs. Inbox open state local to the bell
          component.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Data Flow &amp; Contracts</h3>
        <HighlightBlock as="p" tier="important">
          <Highlight tier="crucial">Notification shape:</Highlight>{" "}
          <Highlight tier="important">
            <code>{` { id, type, actorId, targetId, content, createdAt, readAt? } `}</code>
          </Highlight>
          . Backend events: <code>notification.new</code>,{" "}
          <code>notification.read</code>, <code>notification.deleted</code>. REST:
          list with cursor pagination, mark-read endpoint.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚡ Performance</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Virtualization for long lists.
          Memoized notification items. <Highlight tier="important">Optimistic
          mark-read. Badge count updates batched</Highlight>
          per tick to avoid flooding. Cross-tab
          broadcasts debounced.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🎨 UX</h3>
        <HighlightBlock as="p" tier="crucial">Clicking navigates to context.{" "}
          <Highlight tier="important">Mark-all-read action</Highlight>{" "}
          visible. Empty</HighlightBlock>
<HighlightBlock as="p" tier="important">state
          encouraging (&ldquo;You&rsquo;re all
          caught up&rdquo;).</HighlightBlock>
      </section>

      <section>
        <h3>♿ Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">Bell icon labeled with current count
          (&ldquo;Notifications, 5 unread&rdquo;).</HighlightBlock>
<HighlightBlock as="p" tier="important">Inbox is a dialog/menu with focus trap
          (or proper menubar role).</HighlightBlock>
<HighlightBlock as="p" tier="important">Each
          notification is a focusable item; Enter
          activates. Mark-read announces. Filter
          tabs are real tabs.</HighlightBlock>
      </section>

      <section>
        <h3>🔐 Security</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Server enforces ownership. Notification
          content rendered <Highlight tier="important">as text; rich content
          opt-in via</Highlight> sanitizer. Cross-user data
          (actor info) validated server-side.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🧪 Testing</h3>
        <HighlightBlock as="p" tier="crucial">Unit tests for store (dedup, grouping,
          mark-read). Cross-tab consistency</HighlightBlock>
<HighlightBlock as="p" tier="important">tests.
          Integration with mock WebSocket: arrival
          updates badge; mark-read</HighlightBlock>
<HighlightBlock as="p" tier="important">updates count.
          Accessibility tests for live region and
          focus.</HighlightBlock>
      </section>

      <section>
        <h3>🚨 Edge Cases</h3>
        <HighlightBlock as="p" tier="crucial">Notification target deleted (the
          comment was deleted): clicking shows
          a graceful fallback. Browser without
          BroadcastChannel:</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">tabs sync via
          polling fallback. Very large
          unread count (10000+): cap display
          (99+); store has the real number.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Reusability</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Generic over notification type. Renderers
          per <Highlight tier="important">type. Source adapter pluggable.
          Pattern reuses</Highlight> for activity feeds,
          alert centers, audit logs.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🌍 Internationalization</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Notification content typically pre-
          translated server-side per <Highlight tier="important">recipient
          locale. UI strings via i18n.</Highlight>
          Timestamps via Intl.RelativeTimeFormat.
          RTL via CSS logical properties.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>⚖️ Trade-offs</h3>

        <h3>Auto-mark vs explicit click</h3>
        <HighlightBlock as="p" tier="important">
          Auto-mark on view matches user
          expectation; explicit gives more
          control. We default auto-mark with
          per-notification opt-out for actionable
          ones.
        </HighlightBlock>

        <h3>Client-side vs server-side grouping</h3>
        <HighlightBlock as="p" tier="important">
          Client-side grouping adapts to live
          state. Server-side is consistent across
          clients. We do client-side for
          adaptability; server-side has its
          merits for high-volume notification
          systems.
        </HighlightBlock>

        <h3>Optimistic mark-read vs confirmed</h3>
        <HighlightBlock as="p" tier="crucial">
          Optimistic feels instant; rollback on
          failure. Confirmed-first feels slow.
          Optimistic is the right default.
        </HighlightBlock>

        <h3>BroadcastChannel vs polling fallback</h3>
        <HighlightBlock as="p" tier="important">
          BroadcastChannel is instant and
          efficient. Polling is the fallback for
          older browsers. Most products only
          need BroadcastChannel.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔮 Future Improvements</h3>
        <HighlightBlock as="p" tier="crucial">AI-prioritized notifications (most
          important first). Smart digest mode</HighlightBlock>
<HighlightBlock as="p" tier="important">(batch low-priority into one
          digest). Cross-device read sync</HighlightBlock>
<HighlightBlock as="p" tier="important">via
          push. Snooze with reminders. Custom
          filters and pinning.</HighlightBlock>
      </section></section>
<section><h2>Architecture &amp; Flow</h2><p>Separate durable records, optimistic intent, transport events, ephemeral awareness, rendered projection, and telemetry. Every connection, timer, cursor, replay buffer, subscription, and retry queue needs an explicit owner and cleanup path.</p><p>Normalize notifications by id and derive unread state from durable acknowledgement rather than visual rendering.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/communication-collaboration/notification-center-inbox-recovery.svg" alt="Design a Notification Center Inbox recovery" caption="Recovery flow: classify gaps, retain stable truth, replay safely, and emit evidence." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Polling is operationally simpler; sockets are justified for urgent notification workflows.</p><p>Server watermark is authoritative for reads. Socket events merge idempotently and local actions reconcile after acknowledgement. Scale pressure comes from bursts, duplicate delivery, reconnect gaps, cross-tab actions, partial writes, and retention windows. Bound queues, dedupe events, expire ephemeral state, and degrade predictably.</p></section>
<section><h2>Best practices</h2><p>Use stable ids, event sequences, idempotency keys, monotonic watermarks, TTLs, replay cursors, bounded buffers, authorization checks, and cleanup. Test reconnect gaps, duplicates, stale events, offline recovery, privacy settings, and accessibility announcements.</p><p>Measure latency, backlog, reconnect rate, gap recovery, retries, stale drops, TTL expiry, and accessibility regressions without logging sensitive content.</p><h3>Operational implementation: normalized inbox records and unread watermark</h3><p>Keep durable notification records separate from UI tabs and unread projection. Merge pages and live events by id, apply monotonic read state, use a server watermark for mark-all-read, collapse duplicate campaigns, and retain a cursor for recovery.</p><p>Define explicit metrics for accepted events, duplicate drops, stale drops, replay gap size, reconnect duration, queue depth, TTL expiry, degraded-mode entry, authorization denial, and rollback outcome. Redact user content and sensitive identifiers from telemetry. Test duplicate delivery, out-of-order events, disconnect during mutation, hidden tabs, unmount cleanup, multiple tabs, permission removal, burst traffic, and a rollback to the previous policy version.</p></section>
<section><h2>Common Pitfalls</h2><p>Common failures include treating ephemeral state as durable, trusting arrival order, leaking timers or sockets, missing dedupe, unbounded replay, and hiding degraded connectivity.</p><p>For this topic, buffer during fetch, dedupe events, retry idempotent reads, recompute counts, recover cursors, and broadcast tab updates.</p></section>
<section><h2>Real-world use cases</h2><p>This design applies to collaborative products where transport, persistence, and UI projection fail independently. Inject product policy for authorization, retention, fallback, and observability explicitly.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Normalize notifications by id and derive unread state from durable acknowledgement rather than visual rendering.</p><h3>What breaks at scale?</h3><p>bursts, duplicate delivery, reconnect gaps, cross-tab actions, partial writes, and retention windows.</p><h3>What consistency applies?</h3><p>Server watermark is authoritative for reads. Socket events merge idempotently and local actions reconcile after acknowledgement.</p><h3>How do you recover?</h3><p>buffer during fetch, dedupe events, retry idempotent reads, recompute counts, recover cursors, and broadcast tab updates.</p><h3>Why this architecture?</h3><p>Polling is operationally simpler; sockets are justified for urgent notification workflows.</p></section>
<section><h2>References</h2><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSocket" target="_blank" rel="noreferrer">MDN WebSocket</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA APG</a></li><li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React state ownership</a></li></ul></section>
</ArticleLayout>}