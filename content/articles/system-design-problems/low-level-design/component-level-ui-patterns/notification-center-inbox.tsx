"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-notification-center-inbox",
  title: "Design a Notification Center / Inbox",
  description:
    "Notification center with notification store, toast queue, inbox view with real-time delivery, badge count management, grouping, and expiry TTL.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "notification-center-inbox",
  wordCount: 5200,
  readingTime: 31,
  lastUpdated: "2026-05-16",
  tags: ["lld", "notifications", "inbox", "toast", "real-time", "WebSocket", "grouping", "badge"],
  relatedTopics: ["toast-notification-system", "chat-messaging-ui", "stepper-progress-tracker"],
};

export default function NotificationCenterInboxArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <p>
        A notification center is deceptively complex. On the surface, it is a list of
        messages with read/unread states. Under the hood, it must handle real-time
        delivery via WebSocket or Server-Sent Events, an in-memory store that reconciles
        server-fetched history with live-pushed events, a toast queue that controls
        how many transient notifications appear simultaneously, grouping and deduplication
        logic, a badge count that stays accurate across multiple browser tabs, and an
        expiry mechanism that removes stale notifications. Building this correctly
        reveals important tradeoffs in state management, real-time architecture, and
        cross-tab synchronization.
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/notification-center-inbox-architecture.svg"
        alt="Notification center architecture diagram"
        caption="Notification center architecture: notification store, toast queue, inbox view, badge count and expiry"
      />

      <h2>Clarifying the Requirements</h2>
      <p>
        Before designing, establish the scope:
      </p>
      <p>
        <strong>Transient toasts vs persistent inbox?</strong> Some products have only
        transient toast notifications (appear briefly, disappear automatically). Others
        have a persistent inbox (a notification history the user can review later). Many
        have both: a toast appears immediately, and the notification is also added to
        the inbox for later reference. These two concerns have different state models
        (the toast queue is ephemeral; the inbox is persisted).
      </p>
      <p>
        <strong>Real-time delivery?</strong> Does the notification center receive live
        events via WebSocket or SSE? Or does it poll the server for new notifications?
        Real-time delivery is the production standard for products with time-sensitive
        events (new chat message, payment received, task assigned).
      </p>
      <p>
        <strong>Multi-tab behavior?</strong> If the user has the app open in two tabs,
        a notification pushed to Tab 1 should also appear in Tab 2, and marking it as
        read in Tab 1 should update the badge in Tab 2. This requires cross-tab
        synchronization.
      </p>
      <p>
        <strong>Grouping?</strong> Multiple notifications of the same type (5 new
        comments on the same post) may be collapsed into a single grouped notification
        ("5 new comments on 'Your post'"). Grouping logic — when to group, how to
        display group counts, how reading one expands the group — is a significant
        feature requirement.
      </p>

      <h2>The Notification Data Model</h2>
      <p>
        Each notification has: a unique ID, a type (enum: mention, comment, reaction,
        assignment, system), a timestamp, a read status (boolean), an actor (user who
        triggered the notification), a target (the resource the notification is about),
        a message (human-readable text), an action URL (where clicking takes the user),
        and optional expiry (ISO 8601 timestamp after which the notification should
        be removed from the inbox).
      </p>
      <p>
        The notification type is used for grouping, filtering, and icon selection. An
        extensible type system using string literals (not a closed enum) allows new
        notification types to be added without a client code change — the client shows
        a generic icon and message for unknown types.
      </p>
      <p>
        Grouping metadata: a notification can be part of a group (groupId field). The
        group is a computed aggregation: find all notifications with the same groupId
        and type, sort by timestamp, collapse into a single entry in the inbox list
        showing the most recent actor and a count. The individual notifications within
        the group are accessible by expanding the group entry.
      </p>

      <h2>The Notification Store</h2>
      <p>
        The notification store is the central state for the inbox. It holds the full
        list of notifications fetched from the server plus any live-pushed events that
        arrived after the initial fetch. The store is implemented in Zustand (or an
        equivalent state manager with selector support for component performance).
      </p>
      <p>
        On mount, the store fetches the user's notification history from a paginated
        API (most recent N notifications, with a cursor for loading older ones). On
        each page fetch, the results are merged with any already-stored notifications.
        Deduplication by notification ID prevents duplicates when a live push event
        arrives for a notification that was also returned in the initial fetch.
      </p>
      <p>
        The store exposes selectors: all notifications (sorted by timestamp descending),
        unread notifications, notifications by type, and the unread count. Components
        subscribe to specific selectors to avoid re-rendering when unrelated parts of
        the store change.
      </p>
      <HighlightBlock as="p" tier="crucial">
        The unread count must be computed from the store's notification list, not
        maintained as a separate counter. Separate counters inevitably diverge from
        reality when notifications are marked read, deleted, or arrive out of order.
        The unread count is simply the number of notifications in the store where
        read is false. This is O(n) but notifications are bounded (max 200 in the
        store) and count is only recomputed when the store changes.
      </HighlightBlock>

      <h2>Real-Time Delivery</h2>
      <p>
        Live notifications arrive via WebSocket or Server-Sent Events. The notification
        service (backend) pushes a notification event whenever a notification is created
        for the user. The client's WebSocket handler receives the event, deserializes
        the notification payload, and dispatches an addNotification action to the store.
      </p>
      <p>
        The addNotification action: check if a notification with the same ID already
        exists in the store. If yes, skip (deduplication). If no, prepend to the
        notification list. Then trigger the toast queue to display a transient toast
        for this notification. The toast trigger is conditional: only show a toast if
        the inbox panel is currently closed (showing a toast while the panel is open
        and the user can already see the new notification is redundant).
      </p>
      <p>
        Reconnection handling: if the WebSocket connection drops, the client reconnects
        with exponential backoff. On reconnection, there is a gap between the last
        received notification and the reconnect time. The client tracks the timestamp
        of the most recently received notification and, on reconnection, fetches
        notifications newer than that timestamp from the API to fill the gap. This
        ensures no notifications are missed during disconnection.
      </p>

      <h2>The Toast Queue</h2>
      <p>
        The toast queue is a separate, ephemeral state layer (not persisted, not
        server-backed). It controls how many toasts are visible simultaneously and
        manages their auto-dismiss timers.
      </p>
      <p>
        The queue has a maximum simultaneous display limit (typically 3–5 toasts).
        When a new notification triggers a toast, it is added to the queue. If the
        queue is at capacity, the new toast replaces the oldest one (FIFO). Each
        toast has a display duration (default 5 seconds for most types, longer for
        error/system notifications). A timer auto-dismisses each toast after its
        duration.
      </p>
      <p>
        Toast dismissal on hover: when the user hovers over a toast, pause its auto-
        dismiss timer (the user is reading it). Resume the timer when the mouse leaves.
        This is implemented by storing the remaining time when hover starts and
        scheduling a new timer for the remaining duration when hover ends. Use
        clearTimeout and setTimeout (or a ref-based timer) for this.
      </p>
      <p>
        Toast stacking: toasts stack vertically with a CSS transition that slides
        each toast up when the bottommost one is dismissed. The stack uses absolute
        positioning with the bottom value increasing for each toast in the stack. When
        a toast is dismissed, CSS transition animates the remaining toasts shifting
        down (or up, depending on the stacking direction). Using CSS transform:
        translateY for the position (rather than bottom) enables GPU-composited animation
        without layout recalculation.
      </p>

      <h2>Badge Count and Cross-Tab Synchronization</h2>
      <p>
        The badge count (the red number on the bell icon) shows unread notifications.
        In a single tab, this is just a derived value from the store's unread count.
        Across tabs, updates must propagate so that marking a notification read in
        Tab 1 clears or decrements the badge in Tab 2.
      </p>
      <p>
        The BroadcastChannel API enables cross-tab communication within the same origin.
        When the notification store changes (a notification is marked read, a new
        notification arrives), publish the change to a named BroadcastChannel. All
        other tabs subscribed to the same channel receive the event and update their
        local store accordingly.
      </p>
      <p>
        The events to broadcast: NOTIFICATION_READ (with the notification ID, so other
        tabs can mark the same notification read in their store), NOTIFICATIONS_ALL_READ
        (so all tabs clear their unread badges), and NOTIFICATION_RECEIVED (so a live
        push to one tab also triggers a toast in other tabs). The BroadcastChannel
        handler in each tab applies the incoming event to its local store without
        re-broadcasting (to prevent infinite loops).
      </p>

      <h2>Inbox UI and Virtual Scrolling</h2>
      <p>
        The inbox panel renders the notification list. For most products, the list
        is bounded (200 notifications maximum) and does not require virtualization.
        If the product supports many years of notification history with thousands of
        entries, virtualization with a library like react-virtual is appropriate.
      </p>
      <p>
        The inbox has three views: all notifications, unread only, and by type
        (tabs across the top). The filter is applied as a derived selector in the
        store — no separate data fetch for each filter. The active filter is stored
        in component state (not URL, since the inbox is typically a dropdown panel,
        not a page).
      </p>
      <p>
        Mark as read: clicking a notification item marks it read and navigates to its
        action URL. Mark-all-read: sends a PATCH request to the server (batch update)
        and optimistically updates all notifications in the store to read: true.
        The server confirms; on error, roll back the optimistic update and show an
        error toast.
      </p>
      <HighlightBlock as="p" tier="important">
        Mark-as-read via viewport observation (notifications are considered read
        when they scroll into view) is a tempting pattern but requires careful
        implementation. Use an IntersectionObserver on each unread notification item.
        When an item becomes 100% visible, trigger a read event. But only if the inbox
        panel is focused/active — auto-marking-read on mount (before the user sees the
        panel) would incorrectly mark all notifications as read. Gate the observer
        on panel open state.
      </HighlightBlock>

      <h2>Notification Expiry</h2>
      <p>
        Notifications with an expiry timestamp should be removed from the inbox after
        their expiry time. This is implemented with a cleanup routine that runs
        periodically (every minute, using setInterval) and removes any notifications
        whose expiry has passed. The server also excludes expired notifications from
        API responses, so expired items do not reappear after a page reload.
      </p>
      <p>
        For time-sensitive notifications (e.g., "Flash sale ends in 2 hours"), the
        expiry timestamp drives both the deletion and a visible countdown in the
        notification item. Use a relative time formatter (Intl.RelativeTimeFormat) that
        shows "2 hours" or "3 minutes" based on the distance between now and expiry.
        Update this display periodically (every 60 seconds for items expiring in hours,
        every 10 seconds for items expiring in minutes) using a timer or React's
        useSyncExternalStore with a time source.
      </p>

      <h2>Accessibility</h2>
      <p>
        The bell icon button opens the inbox panel. It has aria-label="Notifications"
        and aria-expanded="true/false" based on panel visibility. The badge count is
        announced via aria-label="Notifications, 5 unread" on the button.
      </p>
      <p>
        The inbox panel is a dialog (role="dialog") or a listbox (role="listbox")
        depending on whether it is modal. As a non-modal dropdown panel, it should
        not have role="dialog" — it does not trap focus. It should have role="region"
        with aria-label="Notification inbox."
      </p>
      <p>
        Each notification item is a button or anchor element. Focus management: when
        the inbox panel opens, move focus to the first notification or to a "Mark all
        as read" button at the top. When the panel closes, return focus to the bell
        icon button. The Escape key closes the panel and returns focus.
      </p>
      <p>
        Toast notifications need a live region. A visually hidden div with
        aria-live="polite" and aria-atomic="true" announces each new toast to screen
        readers. Update its text with the notification's message when a new toast
        appears. Screen readers announce the message without the user needing to
        navigate to the toast.
      </p>

      <h2>Interview Q&A</h2>

      <h3>Q: How does the notification store handle the initial fetch plus real-time events race condition?</h3>
      <p>
        The race: the client connects to the WebSocket before the initial REST fetch
        completes. A notification pushed via WebSocket during the fetch may also appear
        in the fetch response, creating a duplicate. The fix: the WebSocket handler
        buffers incoming events until the initial fetch completes (store them in a
        pending array). Once the fetch completes and the store is initialized, replay
        the buffered events against the store, deduplicating by ID. Alternatively,
        if the WebSocket connection always starts after the initial fetch, the race
        does not occur — but this adds latency to the real-time connection. The buffer
        approach is more resilient and is the production pattern used by Intercom and
        similar products.
      </p>

      <h3>Q: How do you limit notification spam when a user receives 100 notifications in 30 seconds?</h3>
      <p>
        Rate-limit toasts at the client layer: the toast queue has a maximum display
        rate (e.g., max 3 toasts per 5 seconds). When the rate is exceeded, buffer
        additional toasts and release them after the rate window passes. If more than
        10 toasts are queued, collapse them into a single "You have 12 new notifications"
        toast rather than showing all individually. The inbox still receives all
        notifications in the store. This toast throttling prevents the UI from becoming
        a wall of pop-ups during a high-activity period.
      </p>

      <h3>Q: How would you implement notification grouping at the store level?</h3>
      <p>
        Grouping is a derived transformation of the raw notification list. A selector
        function takes the raw notification array and returns a grouped list: find all
        consecutive notifications (by timestamp) with the same groupKey (type + targetId).
        Collapse them into a GroupedNotification object that includes the count, the
        most recent notification's content, the list of actor avatars, and a ref to
        the constituent notification IDs. In the inbox view, grouped items render
        with an expand button; expanding replaces the group item with the individual
        items in the list. The grouping selector is pure and memoized (with useMemo
        or Zustand's selector memoization) so it only recomputes when the raw list
        changes.
      </p>

      <h3>Q: How do you persist the notification store across page reloads?</h3>
      <p>
        Persisting notifications to localStorage (or sessionStorage) allows the inbox
        to appear instantly on reload without waiting for the API fetch. On store
        initialization, read from localStorage first; then fetch from the API and merge
        (newer API data takes precedence). On every store update, serialize the
        notification list to localStorage. Limit the persisted list to the most recent
        50 notifications (since localStorage has a 5–10 MB quota, and each notification
        is small but still accumulates). Use a debounced write to localStorage
        (100–200ms) to avoid writing on every individual notification event during
        a burst. On logout, clear the persisted notifications to prevent data leakage
        to the next user on the same device.
      </p>

      <h3>Q: How does the badge count stay accurate when the user has multiple tabs open?</h3>
      <p>
        Each tab subscribes to a BroadcastChannel named "notifications." When any tab
        marks a notification as read, it broadcasts a NOTIFICATION_READ event with
        the notification ID. All other tabs receive this event and update their local
        store — marking the same notification as read — which automatically decrements
        their derived unread count (and badge). When a new notification arrives via
        WebSocket in one tab, it broadcasts NOTIFICATION_RECEIVED so all tabs add it
        to their stores and increment their badges. The BroadcastChannel is the
        authoritative synchronization mechanism for cross-tab badge consistency.
        localStorage-based solutions (watching for storage events) also work but are
        more complex and have edge cases around event ordering.
      </p>
    </ArticleLayout>
  );
}
