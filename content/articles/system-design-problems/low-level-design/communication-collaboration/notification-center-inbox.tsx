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

export default function NotificationCenterInboxArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

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
        <h2>⚙️ Functional Requirements</h2>

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
        <h2>📊 Non-Functional Requirements</h2>

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

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/notification-center-inbox-architecture.svg"
        alt="Notification Center / Inbox Architecture"
        caption="WebSocket + REST adapter → Notification store (ordered, grouped) → Bell badge (unread count) + Inbox panel (virtualized list) → Per-notification renderer with optimistic mark-read. BroadcastChannel for cross-tab consistency."
      />

      <section>
        <h2>🧠 Solution Approach</h2>
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
        <h2>🧱 Component Architecture</h2>
        <HighlightBlock as="p" tier="crucial"><strong> NotificationItem</strong>{" "}
          renders one notification.
          <strong> FilterTabs</strong> renders
          filter options.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important"><strong> MarkAllRead</strong></Highlight> action.
          <strong> Renderers per type</strong>{" "}
          (mention, like, comment, follow, system).</HighlightBlock>
      </section>

      <section>
        <h2>🔄 State Management</h2>
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
        <h2>🔁 Data Flow &amp; Contracts</h2>
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
        <h2>⚡ Performance</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Virtualization for long lists.
          Memoized notification items. <Highlight tier="important">Optimistic
          mark-read. Badge count updates batched</Highlight>
          per tick to avoid flooding. Cross-tab
          broadcasts debounced.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <HighlightBlock as="p" tier="crucial">Clicking navigates to context.{" "}
          <Highlight tier="important">Mark-all-read action</Highlight>{" "}
          visible. Empty</HighlightBlock>
<HighlightBlock as="p" tier="important">state
          encouraging (&ldquo;You&rsquo;re all
          caught up&rdquo;).</HighlightBlock>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
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
        <h2>🔐 Security</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Server enforces ownership. Notification
          content rendered <Highlight tier="important">as text; rich content
          opt-in via</Highlight> sanitizer. Cross-user data
          (actor info) validated server-side.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🧪 Testing</h2>
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
        <h2>🚨 Edge Cases</h2>
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
        <h2>🔁 Reusability</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Generic over notification type. Renderers
          per <Highlight tier="important">type. Source adapter pluggable.
          Pattern reuses</Highlight> for activity feeds,
          alert centers, audit logs.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Notification content typically pre-
          translated server-side per <Highlight tier="important">recipient
          locale. UI strings via i18n.</Highlight>
          Timestamps via Intl.RelativeTimeFormat.
          RTL via CSS logical properties.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

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
        <h2>🔮 Future Improvements</h2>
        <HighlightBlock as="p" tier="crucial">AI-prioritized notifications (most
          important first). Smart digest mode</HighlightBlock>
<HighlightBlock as="p" tier="important">(batch low-priority into one
          digest). Cross-device read sync</HighlightBlock>
<HighlightBlock as="p" tier="important">via
          push. Snooze with reminders. Custom
          filters and pinning.</HighlightBlock>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <HighlightBlock as="p" tier="important">
          <strong>1. How is the badge count
          accurate in real time?</strong>{" "}
          WebSocket delivers new notifications;
          store updates; badge derives from
          unread count. BroadcastChannel
          synchronizes across tabs.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>2. How does mark-as-read
          work?</strong> Optimistic store update;
          badge updates immediately; server
          confirms in background. Failure rolls
          back.
        </HighlightBlock>

        <p>
          <strong>3. How is grouping
          implemented?</strong> Client-side: same-
          type notifications targeting the same
          object within a time window collapse.
          The grouped view derives from the raw
          list.
        </p>

        <HighlightBlock as="p" tier="important">
          <strong>4. How is cross-tab consistency
          maintained?</strong> BroadcastChannel
          broadcasts state changes (new, read,
          deleted). Tabs update their stores in
          response.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>5. How does infinite scroll
          work?</strong> Cursor-based pagination
          on REST. Trigger fetches near the
          bottom of the inbox. Integrates with
          Cursor-based Pagination UI patterns.
        </HighlightBlock>

        <p>
          <strong>6. How do you handle very high
          unread counts?</strong> Display cap (99+)
          on badge. Real number in the store.
          Mark-all-read is a single action that
          sets all to read in one server call.
        </p>

        <p>
          <strong>7. How is auto-mark-on-view
          implemented?</strong>{" "}
          IntersectionObserver on each
          notification when the inbox is open;
          after a short delay, mark read.
          Configurable per product.
        </p>

        <HighlightBlock as="p" tier="crucial">
          <strong>8. How is this accessible?</strong>{" "}
          Bell icon labeled with count. Inbox
          is a dialog/menu with focus
          management. Notifications are
          focusable items. Mark-read announces.
          Filters are real tabs.
        </HighlightBlock>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <HighlightBlock as="p" tier="important">Auto-mark-on-view
          handles the common case; explicit
          mark-read covers the</HighlightBlock>
<HighlightBlock as="p" tier="crucial">actionable ones.
          The result is timely, accurate,
          <Highlight tier="important">accessible</Highlight>{" "}
          notifications.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
