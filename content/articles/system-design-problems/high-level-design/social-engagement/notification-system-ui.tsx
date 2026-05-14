"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-notification-system-ui",
  title: "Design a Notification System UI (Multi-Channel)",
  description:
    "Architecture for a multi-channel notification system UI: notification inbox with read/unread state, real-time badge count via SSE, push notification registration with Web Push API, email notification preference management, digest scheduling, deduplication and grouping (N likes from M users), notification routing by type and user preferences, delivery status tracking, and notification center with filter and search.",
  category: "high-level-design",
  subcategory: "social-engagement",
  slug: "notification-system-ui",
  wordCount: 5000,
  readingTime: 30,
  lastUpdated: "2026-05-11",
  tags: ["hld", "notifications", "push", "web-push", "email", "sse", "inbox", "multi-channel"],
  relatedTopics: ["instagram-twitter-frontend", "infinite-scrolling-feed"],
};

export default function NotificationSystemUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">A notification system serves as the primary mechanism for re-engaging users with a platform. It must balance urgency (delivering important notifications quickly) with noise reduction (not overwhelming users with irrelevant alerts that train them to ignore or disable notifications). The frontend challenge spans multiple surfaces: the in-app notification inbox (a panel listing past notifications with read/unread state), real-time badge counts (the red number on the bell icon), Web Push notifications (browser OS-level popups that work even when the tab is closed), and email digests (summaries of activity since last visit). All four surfaces must stay in sync: if a user reads a notification in the inbox, the badge count should decrement and the push notification (if delivered) should not show again.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">Grouping and deduplication are critical for social platforms. If 500 users like the same post in an hour, showing 500 separate "X liked your post" notifications is unusable. The notification system must intelligently group: "Alice, Bob, and 498 others liked your post." The grouping logic must be temporal (group events within a time window), per-actor (the same user liking 5 of your posts may produce one notification, not five), and per-object (all interactions with the same post are grouped). This grouping happens server-side but must be represented faithfully in the UI.</HighlightBlock>
        <p><strong>Explicit scope:</strong> Notification inbox UI, real-time badge updates, Web Push registration, notification preferences, and grouping display. Not in scope: the notification routing engine or the delivery infrastructure (email providers, push gateway).</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Notification inbox:</strong> Paginated list of notifications (newest first) with type (like, comment, follow, mention, system), grouped actors (Alice, Bob, and 498 others), relative timestamp, thumbnail (post image or actor avatar), and read/unread state. Mark all as read button. Click navigates to the relevant content.</li>
          <li><strong>Real-time badge:</strong> Bell icon shows unread count. Count updates in real time when new notifications arrive (SSE push). Clicking the bell opens the inbox and marks visible notifications as read. Badge disappears when unread count reaches 0.</li>
          <li><strong>Web Push:</strong> Prompt user to enable push notifications (deferred until user has been active for 30 seconds, not on first load). On approval, register service worker and send push subscription to the server. Push notifications for high-priority events (direct mentions, DMs, follows) even when the tab is closed.</li>
          <li><strong>Preferences:</strong> Per-category toggles: social (likes, comments, follows), mentions, messages, product updates. Per-channel toggles: in-app, push, email. Email digest frequency: real-time, daily, weekly, never. Changes saved immediately with optimistic UI.</li>
          <li><strong>Notification search and filter:</strong> Filter by type (unread only, by category). Full-text search over notification content (sender name, content snippet).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Badge freshness:</strong> Unread count updates within 5 seconds of a new notification being generated.</li>
          <li><strong>Push delivery latency:</strong> Web Push for high-priority notifications (mentions, DMs) delivered within 10 seconds of the event.</li>
          <li><strong>Read state consistency:</strong> Marking a notification as read in the inbox must reflect in the badge count and prevent Web Push re-delivery within 1 second.</li>
          <li><strong>Inbox load time:</strong> First 20 notifications render within 500ms on subsequent visits (cached via stale-while-revalidate).</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <HighlightBlock as="p" tier="important">The notification system has four layers. The Generation Layer produces NotificationEvent records when user actions occur (Kafka: like.created, comment.created, follow.created). The Aggregation Layer groups related events within a time window (5 minutes for social events, immediate for mentions) and writes aggregated Notification records to the notifications database. The Delivery Layer routes notifications to appropriate channels (in-app, push, email) based on user preferences and event priority; it also publishes badge update events to Redis Pub/Sub for SSE delivery. The Frontend Layer has three components: the SSE badge counter (subscribes to user-specific Redis channel for count updates), the notification inbox panel (cursor-paginated, cached with stale-while-revalidate), and the service worker (handles Web Push subscription registration and received push event rendering).</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/social-engagement/notification-system-ui.svg"
          alt="Multi-channel notification system UI architecture showing notification generation and aggregation (Kafka: like.created comment.created follow.created → aggregation worker: group by actor+object within 5min window → write notification record to DB → publish badge update Redis Pub/Sub notif:{userId}), SSE badge delivery (GET /api/notifications/stream → SSE connection per user → Redis Pub/Sub subscribe notif:{userId} → push {unreadCount} event to browser within 5s; badge renders red circle count), Web Push registration flow (defer prompt 30s after active use; requestNotificationPermission → navigator.serviceWorker.register → pushManager.subscribe {applicationServerKey:VAPID} → POST /api/push/subscribe {endpoint keys} → stored in push_subscriptions table), notification inbox panel (GET /api/notifications?cursor=null&limit=20 stale-while-revalidate 30s; grouped display: avatar stack + actor summary 'Alice Bob +498 others liked your post'; click → navigate to content + mark read; mark all read → PATCH /api/notifications/read-all → badge zeroed), notification preferences (per-category per-channel toggles; POST /api/preferences optimistic update; preference table: userId category channel enabled digest_frequency; server evaluates on delivery), Web Push delivery (Notification record → preference check → Web Push API: POST to push endpoint with VAPID auth; payload: title body icon badge url; service worker: self.addEventListener push → self.registration.showNotification; click → clients.openWindow to URL), read state sync (PATCH /api/notifications/{id}/read → DB update + PUBLISH notif:{userId} {unreadCount:N-1} → SSE push → badge decrements; prevents duplicate push for already-read notifications), notification grouping (same object same type within 5min → single notification; actors list capped at 3 named + count; 'Alice liked + 5 others' expands to full list; group updates as new actors join)."
          caption="Notification generation → Kafka → aggregation (5min grouping window), SSE badge updates (&lt;5s), Web Push registration (VAPID + service worker), inbox panel (stale-while-revalidate, grouped actor display), preference toggles (per-category, per-channel), and read-state sync (PATCH → Redis Pub/Sub → badge decrement)"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Notification Grouping and Actor Summary</h3>
        <HighlightBlock as="p" tier="important">Social notifications are aggregated server-side using a sliding window approach. When a LikeCreated event arrives for post X by user Y at time T, the aggregation worker queries: is there an open notification for the same (owner, object_type=post, object_id=X, notification_type=like) within the last 5 minutes? If yes, it adds user Y to the actors list of that notification and updates the notification body. If no, it creates a new notification. The actors list is capped at storing the 3 most recent distinct actors (for display purposes) plus a total count. The UI renders this as: [avatar1][avatar2][avatar3] "Alice, Bob, and 498 others liked your photo." Clicking "498 others" expands a scrollable list of all actor names. For follow notifications (where the object is the user themselves, not a post), each follow from a distinct user typically creates a separate notification, since users want to know each individual who followed them. The grouping policy is configurable per notification type.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">SSE for Real-Time Badge Updates</h3>
        <HighlightBlock as="p" tier="important">When the user is active in the app, a persistent SSE connection is maintained to GET /api/notifications/stream. The SSE server subscribes to the Redis Pub/Sub channel notif:{"{userId}"} for this connection. When a new notification is generated, the aggregation worker publishes to notif:{"{userId}"} with the updated unread count: PUBLISH notif:{"{userId}"} {"{ unreadCount: 7 }"}. The SSE server receives this and streams a data event to the browser: data: {"{ unreadCount: 7 }"}. The React component reading this stream updates the badge count in the Zustand store, which is reflected in the bell icon badge. The SSE connection uses the browser&apos;s native EventSource API with automatic reconnection. On reconnect, the client fetches the current unread count via GET /api/notifications/unread-count to catch any updates missed during the disconnection window.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Web Push Registration and VAPID Authentication</h3>
        <HighlightBlock as="p" tier="important">Web Push requires VAPID (Voluntary Application Server Identification) for authentication. The flow: (1) The app generates a VAPID keypair (public/private). The public key is embedded in the frontend. (2) After the user has been active for 30 seconds (to avoid prompting immediately on page load, which has a high rejection rate), the app calls Notification.requestPermission(). (3) If the user grants permission, navigator.serviceWorker.register(&apos;/sw.js&apos;) registers the service worker. (4) registration.pushManager.subscribe({"{ userVisibleOnly: true, applicationServerKey: VAPID_PUBLIC_KEY }"}) creates a push subscription object containing the push endpoint URL and encryption keys. (5) The subscription is POSTed to /api/push/subscribe and stored in the push_subscriptions table (userId, endpoint, keys). (6) When a high-priority notification is generated for this user, the Delivery Service fetches the user&apos;s push subscriptions, constructs a Web Push payload (title, body, icon, badge, data.url), signs it with the VAPID private key, and POSTs it to the push endpoint.</HighlightBlock>
        <HighlightBlock as="p" tier="important">
          {"Service worker push handler: self.addEventListener('push', event => { const data = event.data.json(); event.waitUntil(self.registration.showNotification(data.title, { body: data.body, icon: data.icon, badge: data.badge, data: { url: data.url } })); }); The notification click handler navigates to the relevant URL: self.addEventListener('notificationclick', event => { event.notification.close(); event.waitUntil(clients.openWindow(event.notification.data.url)); });"}
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Notification Inbox with Stale-While-Revalidate</h3>
        <HighlightBlock as="p" tier="important">The notification inbox is fetched with stale-while-revalidate caching: React Query&apos;s useQuery is configured with staleTime: 30_000 (30 seconds). On first open, the inbox fetches fresh data. On subsequent opens within 30 seconds, the cached data is shown immediately (no loading spinner) while a background revalidation runs. This makes the inbox feel instant on repeated opens. The inbox is cursor-paginated (same pattern as the feed): 20 notifications per page, a &quot;Load more&quot; button at the bottom. Each notification item shows: actor avatar stack, notification text, relative time (&quot;2 minutes ago&quot; using Intl.RelativeTimeFormat), and post thumbnail. Unread notifications have a blue left-border indicator. Clicking a notification: (1) navigates to the linked content URL, (2) fires PATCH /api/notifications/{"{id}"}/read in the background, (3) updates the local read state optimistically.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Notification Preferences and Digest Scheduling</h3>
        <HighlightBlock as="p" tier="important">The preferences panel shows a grid of toggles: rows are notification categories (Likes, Comments, New Followers, Mentions, Messages, Product Updates), columns are channels (In-app, Push, Email). Each toggle is an independent boolean. When a toggle is changed, the UI updates optimistically and fires PATCH /api/preferences/{"{category}"}/{"{channel}"} {"{ enabled: bool }"}. The server updates the preference record and immediately applies it to future notifications, a user turning off &quot;Email for Likes&quot; will not receive the next like email. The email digest frequency selector (real-time, daily digest at 9am, weekly digest on Monday) controls the aggregation window for email delivery. &quot;Real-time&quot; sends an email immediately for each notification batch. &quot;Daily digest&quot; waits until the scheduled time and batches all unread notifications since the last digest into a single email.</HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">SSE versus WebSocket for badge updates: SSE is strictly server-to-client, which is exactly what badge updates need — the server pushes count changes, the client never needs to send data over the same connection. SSE's simplicity (plain HTTP, automatic browser reconnection, no upgrade handshake) makes it preferable to WebSocket for this use case. The only scenario where WebSocket would be necessary is if the client needed to send acknowledgments over the same connection — but read acknowledgments are sent as REST API calls, not over the notification stream.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Web Push prompt timing: showing the permission prompt immediately on page load results in 60–80% rejection rates (users haven't experienced value yet and dismiss reflexively). Deferring the prompt until after the user has performed an action (posted content, liked something, messaged someone) increases acceptance rates to 20–40%. The 30-second active-use delay described above is a conservative threshold; a more sophisticated approach triggers the prompt after the user's second or third session, when they have demonstrated they find the platform valuable. The app must respect the one-shot nature of the prompt — once rejected, it cannot be shown again without the user manually changing browser settings.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important">A multi-channel notification UI is built around four synchronized surfaces: SSE badge (Redis Pub/Sub → SSE → badge count update within 5s), notification inbox (stale-while-revalidate cursor-paginated, grouped actor display), Web Push (VAPID-authenticated, service worker, deferred permission prompt), and email preferences (per-category per-channel toggles, digest scheduling). Notification grouping server-side (same object + type within 5-minute window → single notification with actor list) prevents inbox flooding for viral content. Read state syncs via PATCH + Redis Pub/Sub publication → SSE counter decrement, ensuring badge and inbox stay consistent across tabs. The defining design tension: aggressive notification delivery drives re-engagement but destroys trust if overdone — per-category, per-channel preference controls with sane defaults (in-app: always on; push/email: off by default for non-critical types) maximize opt-in rates while respecting user attention.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
