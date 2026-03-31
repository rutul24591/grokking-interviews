"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-comm-frontend-notification-center",
  title: "Notification Center",
  description:
    "Comprehensive guide to implementing notification centers covering notification aggregation, filtering, preferences, real-time updates, read/unread management, and cross-device synchronization.",
  category: "functional-requirements",
  subcategory: "communication",
  slug: "notification-center",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-30",
  tags: [
    "requirements",
    "functional",
    "communication",
    "notifications",
    "frontend",
    "real-time",
    "preferences",
  ],
  relatedTopics: ["push-notification-service", "notification-delivery", "user-preferences", "real-time-updates"],
};

export default function NotificationCenterArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Notification center aggregates and displays all user notifications in one place, enabling users to stay informed about activity relevant to them. Notifications include messages, mentions, likes, comments, system alerts, and reminders. A well-designed notification center reduces notification fatigue through smart grouping, filtering, and preferences while ensuring users never miss important updates.
        </p>
        <p>
          The challenge of notification centers is balancing awareness with overload. Users receive notifications from multiple sources—direct messages, group mentions, social interactions, system announcements. Without aggregation, users face notification fatigue and disengage. With smart aggregation, users stay informed without feeling overwhelmed. The center must support real-time updates, cross-device sync, and granular preferences.
        </p>
        <p>
          For staff and principal engineers, notification center implementation involves real-time synchronization, preference management, and scaling challenges. Notifications must appear instantly across all devices. Preferences must sync so muting on phone mutes on web. The system must handle notification storms (hundreds of notifications after being offline for days). Read/unread state must sync across devices. The architecture must scale to billions of notifications while maintaining sub-second query performance.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Notification Types</h3>
        <p>
          Direct notifications target specific user: direct messages, @mentions, replies to your comments. High priority—always deliver, bypass mute settings (unless user explicitly mutes sender). Display prominently with sender info and preview.
        </p>
        <p>
          Social notifications from network activity: likes on your content, comments on your posts, new followers. Medium priority—deliver based on preferences. Group by content ("John and 49 others liked your post").
        </p>
        <p>
          System notifications from platform: announcements, policy updates, security alerts, reminders. Variable priority—security alerts are high, announcements are low. Respect do-not-disturb except for critical security alerts.
        </p>
        <p>
          Digest notifications summarize activity: "You have 15 new notifications", "5 people viewed your profile this week". Low priority—sent periodically (daily/weekly). Reduce notification fatigue by batching.
        </p>

        <h3 className="mt-6">Notification Aggregation</h3>
        <p>
          Time-based aggregation groups notifications within time window. Notifications within 5-10 minutes group together. "John, Sarah, and 3 others liked your post" instead of 6 separate notifications. Reduces notification volume while preserving information.
        </p>
        <p>
          Content-based aggregation groups by source content. All likes on post A group together, separate from likes on post B. User can expand to see individual notifications or dismiss entire group. Preserves context—user knows which content generated notifications.
        </p>
        <p>
          Type-based aggregation groups by notification type. All likes group together, all comments separately, all mentions separately. User can filter by type—view only mentions, hide all likes. Enables focused attention on important notification types.
        </p>

        <h3 className="mt-6">Read/Unread Management</h3>
        <p>
          Unread count badge shows pending notifications. Badge on app icon, nav item, or bell icon. Count updates in real-time as notifications arrive and are read. Badge clears when all notifications read.
        </p>
        <p>
          Mark as read on view—notification marked read when user opens notification center or taps notification. Configurable—some apps mark read on scroll into view, others require explicit tap. Balance between accurate read tracking and user convenience.
        </p>
        <p>
          Mark all as read clears entire unread queue. Single action to clear backlog. Useful after returning from vacation or catching up. Confirmation optional—"Clear all 50 notifications?".
        </p>

        <h3 className="mt-6">Notification Preferences</h3>
        <p>
          Per-type preferences enable/disable notification types. User can enable mentions but disable likes. Preferences apply across channels (push, email, in-app). Granular control reduces notification fatigue.
        </p>
        <p>
          Per-sender preferences override type preferences. Mute specific users even if their notifications would normally deliver. Useful for reducing noise from overly active contacts. Muted users not notified of mute.
        </p>
        <p>
          Quiet hours suppress notifications during specified times. Notifications queue during quiet hours, deliver when quiet hours end. Exceptions for high-priority (direct messages, mentions from close contacts). Respects user's work-life balance.
        </p>

        <h3 className="mt-6">Real-time Updates</h3>
        <p>
          WebSocket connection pushes new notifications in real-time. Notification appears instantly with animation. Unread count increments. User sees activity as it happens—critical for time-sensitive notifications (messages, mentions).
        </p>
        <p>
          Polling fallback for clients without WebSocket. Poll every 30-60 seconds for new notifications. Less efficient than push but universally compatible. Combine with push for optimal experience—push when available, poll as fallback.
        </p>
        <p>
          Optimistic updates show notification immediately before server confirmation. If server rejects (rate limit, filtered), revert optimistically shown notification. Makes notification feel instant despite network latency.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Notification center architecture spans client UI, real-time sync, preference management, and backend aggregation. Client renders notification list with filtering and grouping. WebSocket delivers new notifications in real-time. Preferences stored locally and synced to server. Backend aggregates notifications, applies preferences, routes to appropriate channels.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/notification-center/notification-center-architecture.svg"
          alt="Notification Center Architecture"
          caption="Figure 1: Notification Center Architecture — Client UI, real-time sync, preferences, and backend aggregation"
          width={1000}
          height={500}
        />

        <h3>Client Component Architecture</h3>
        <p>
          Notification list component renders notifications with virtualization for large lists. Groups notifications by time (Today, Yesterday, This Week) or type. Each notification shows icon, title, message, timestamp, action buttons (reply, dismiss, mark read). Swipe actions on mobile (swipe to mark read, swipe to dismiss).
        </p>
        <p>
          Unread badge component displays count. Listens to notification store, updates when count changes. Badge on app icon (via push API), nav item, bell icon. Count animation on new notification (pulse or bounce). Badge clears when all read.
        </p>
        <p>
          Preferences UI enables granular control. Toggles for each notification type. Per-sender mute list. Quiet hours picker. Changes sync to server immediately. Local cache for offline preference changes.
        </p>

        <h3 className="mt-6">Notification Storage</h3>
        <p>
          Notification table stores notification_id, user_id, type, title, message, metadata (JSON), created_at, read_at, expires_at. Indexes on user_id (fetch user's notifications), created_at (order by time), read_at (filter unread). TTL for auto-expiration (30-90 days).
        </p>
        <p>
          Unread count cached in Redis for fast access. Key: user:ID:unread_count. Increment on new notification, decrement on mark read. Cache invalidation on mark all as read. Fallback to database query if cache miss.
        </p>
        <p>
          Aggregation metadata tracks grouped notifications. Parent notification with child count. "John and 4 others" stored as parent with [John, ...4 more IDs]. Expand on tap to show individual notifications.
        </p>

        <h3 className="mt-6">Real-time Sync</h3>
        <p>
          WebSocket subscription to user's notification channel. Server pushes new notification as JSON: (id, type, title, message, timestamp, metadata). Client inserts into list, increments unread count, plays notification sound (if enabled).
        </p>
        <p>
          Sync on reconnect handles missed notifications. Client sends last_notification_id, server returns notifications since then. Deduplicate—client may have received some via push. Merge server response with local state.
        </p>
        <p>
          Cross-device sync marks notification read on all devices when read on one. Read action publishes event, all devices subscribe, update local state. Sync latency should be &lt;1 second for seamless experience.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/notification-center/notification-aggregation.svg"
          alt="Notification Aggregation"
          caption="Figure 2: Notification Aggregation — Time-based, content-based, and type-based grouping"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Preference Management</h3>
        <p>
          Preferences stored in user_settings table: user_id, notification_type, enabled, channels (push/email/in-app), quiet_hours. Default preferences on signup. User modifications override defaults.
        </p>
        <p>
          Preference evaluation on notification creation. Check user's preferences for notification type. Check per-sender mute list. Check quiet hours. If any filter blocks, don't deliver. Log filtered notifications for analytics.
        </p>
        <p>
          Preference sync across devices. Change on one device updates server, pushes to other devices. Other devices update local cache, refresh UI. Conflict resolution: last write wins, or merge changes.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/notification-center/read-unread-sync.svg"
          alt="Read/Unread Sync"
          caption="Figure 3: Read/Unread Sync — Cross-device synchronization of read state"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Notification center design involves trade-offs between awareness, fatigue, privacy, and performance. Understanding these trade-offs enables informed decisions aligned with user experience goals.
        </p>

        <h3>Aggregation Level</h3>
        <p>
          No aggregation shows every notification individually. Pros: Maximum detail, no information loss. Cons: Notification fatigue, overwhelming for active users. Best for: Low-volume notifications, enterprise/professional tools.
        </p>
        <p>
          Fine aggregation groups within short window (5-10 minutes). Pros: Reduces volume while preserving detail. Cons: Slight delay for grouping. Best for: Most consumer apps, social platforms.
        </p>
        <p>
          Coarse aggregation groups by hour or day. Pros: Maximum volume reduction. Cons: Loses immediacy, detail requires drill-down. Best for: Digest emails, weekly summaries, low-priority notifications.
        </p>

        <h3>Read State Sync</h3>
        <p>
          Immediate sync marks read on all devices instantly. Pros: Consistent experience, no confusion. Cons: More sync traffic, complexity. Best for: Multi-device users, professional tools.
        </p>
        <p>
          Delayed sync batches read events. Pros: Less sync traffic, simpler. Cons: Temporary inconsistency across devices. Best for: Single-device dominant users, low-priority notifications.
        </p>
        <p>
          Per-device read state tracks read per device. Pros: Simplest implementation. Cons: Notification shows unread on device B even if read on device A. Best for: Device-specific notifications, kiosks.
        </p>

        <h3>Preference Granularity</h3>
        <p>
          Binary on/off for all notifications. Pros: Simplest UX, easy to understand. Cons: All or nothing—can't fine-tune. Best for: Simple apps, minimal notification types.
        </p>
        <p>
          Per-type preferences. Pros: Good balance of control and complexity. Cons: More settings to manage. Best for: Most apps with multiple notification types.
        </p>
        <p>
          Per-type, per-sender, per-channel. Pros: Maximum control. Cons: Complex settings UI, decision fatigue. Best for: Enterprise apps, power users, high-volume notification sources.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/notification-center/preference-hierarchy.svg"
          alt="Preference Hierarchy"
          caption="Figure 4: Preference Hierarchy — Global, per-type, per-sender preference evaluation"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Aggregate notifications intelligently:</strong> Group by time window (5-10 min), content, and type. Show "John and 4 others" instead of 5 separate notifications. Allow expand to see individuals.
          </li>
          <li>
            <strong>Implement real-time updates:</strong> WebSocket push for new notifications. Increment unread count instantly. Animate new notification arrival. Fallback to polling if WebSocket unavailable.
          </li>
          <li>
            <strong>Sync read state across devices:</strong> Mark read on one device marks read on all. Publish read event, all devices subscribe and update. Sync latency &lt;1 second.
          </li>
          <li>
            <strong>Provide granular preferences:</strong> Per-type toggles, per-sender mute, quiet hours. Sync preferences across devices. Default to sensible settings, let users customize.
          </li>
          <li>
            <strong>Cache unread count:</strong> Redis cache for fast badge updates. Increment/decrement on notification events. Invalidate on mark all as read. Fallback to DB query on cache miss.
          </li>
          <li>
            <strong>Support batch actions:</strong> Mark all as read, dismiss all, filter by type. Single action to clear backlog. Confirmation for large batches ("Clear all 50?").
          </li>
          <li>
            <strong>Implement notification expiration:</strong> TTL (30-90 days) auto-deletes old notifications. Prevents unbounded storage growth. Notify user before bulk deletion ("Old notifications will be cleared").
          </li>
          <li>
            <strong>Handle notification storms:</strong> After offline period, don't push 500 notifications at once. Batch delivery, show summary ("You have 500 notifications"), let user catch up gradually.
          </li>
          <li>
            <strong>Respect quiet hours:</strong> Queue notifications during quiet hours, deliver when ended. Exceptions for high-priority (direct messages, security alerts). Sync quiet hours across devices.
          </li>
          <li>
            <strong>Provide notification search:</strong> Search by keyword, sender, type, date range. Helps users find specific notifications in large history. Index notification content for fast search.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No aggregation:</strong> Every notification shown individually overwhelms users. Solution: Time-based and content-based aggregation, group by type.
          </li>
          <li>
            <strong>No read sync:</strong> Notification shows unread on tablet after reading on phone. Solution: Cross-device sync via WebSocket, publish read events.
          </li>
          <li>
            <strong>No preferences:</strong> Users can't control notification volume. Solution: Per-type toggles, per-sender mute, quiet hours.
          </li>
          <li>
            <strong>Slow unread count:</strong> Badge doesn't update in real-time. Solution: Cache count in Redis, increment/decrement on events.
          </li>
          <li>
            <strong>No expiration:</strong> Notifications accumulate forever, storage grows unbounded. Solution: TTL-based expiration (30-90 days), notify before bulk delete.
          </li>
          <li>
            <strong>Notification storm:</strong> 500 notifications after vacation overwhelms user. Solution: Batch delivery, show summary, gradual catch-up.
          </li>
          <li>
            <strong>Ignoring quiet hours:</strong> Notifications wake user at 3 AM. Solution: Respect quiet hours, queue for morning delivery, critical alerts only.
          </li>
          <li>
            <strong>No search:</strong> Can't find specific notification in history. Solution: Full-text search, filter by type/sender/date.
          </li>
          <li>
            <strong>Poor mobile UX:</strong> Tiny touch targets, no swipe actions. Solution: 44px minimum targets, swipe to mark read/dismiss, haptic feedback.
          </li>
          <li>
            <strong>No analytics:</strong> Don't know which notifications users engage with. Solution: Track open rate, dismiss rate, time to read. Optimize based on data.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Facebook Notifications</h3>
        <p>
          Facebook aggregates notifications by type (likes, comments, friends) and content. "John and 49 others liked your post" groups 50 likes. Filter tabs (All, Unread, Mentions). Real-time updates via WebSocket. Preferences per notification type with email/push toggles.
        </p>

        <h3 className="mt-6">Twitter Notifications</h3>
        <p>
          Twitter shows notifications in reverse chronological order with aggregation. "Liked by John, Sarah, and 12 others" groups likes. Verified badge highlights. Filter: All, Mentions, Verified. Real-time updates with animation. Mute words filter unwanted notifications.
        </p>

        <h3 className="mt-6">LinkedIn Notifications</h3>
        <p>
          LinkedIn organizes by category (Connections, Jobs, Learning). Professional context—job alerts, profile views, connection requests. Real-time updates. Preferences per category with email frequency options (immediate, daily, weekly).
        </p>

        <h3 className="mt-6">GitHub Notifications</h3>
        <p>
          GitHub notifications for issues, PRs, mentions, security alerts. Organized by repository. Mark as read, done, or unsubscribe per thread. Email digest options. Real-time updates for active discussions. Custom routing rules for different notification types.
        </p>

        <h3 className="mt-6">Slack Notifications</h3>
        <p>
          Slack aggregates by channel and mention type. @channel, @here, @user mentions prioritized. Digest for muted channels. Per-channel notification settings. Quiet hours with exceptions for keywords. Real-time sync across desktop, mobile, web.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you aggregate notifications?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Time-based aggregation groups notifications within 5-10 minute window. Content-based groups by source (all likes on post A). Type-based groups by notification type. Store parent notification with child count and sample IDs ("John and 4 others"). Expand on tap to show individuals.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you sync read state across devices?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> WebSocket subscription to read events. When user marks notification read on device A, publish event (notification_id, user_id, read: true). All devices subscribed receive event, update local state. Sync latency should be &lt;1 second for seamless experience.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle notification preferences?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Store preferences in user_settings table: user_id, type, enabled, channels, quiet_hours. Evaluate on notification creation—check type preference, per-sender mute, quiet hours. If any filter blocks, don't deliver. Sync preferences across devices via WebSocket.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize unread count queries?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Cache unread count in Redis: user:ID:unread_count. Increment on new notification, decrement on mark read. Invalidate on mark all as read. Fallback to database query (SELECT COUNT(*) WHERE read_at IS NULL) on cache miss. Cache TTL matches notification TTL.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle notification storms?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> After offline period, don't push 500 notifications at once. Show summary: "You have 500 new notifications". Batch delivery in groups of 50. Let user catch up gradually. Option to "Mark all as read" for quick clear. Prioritize important notifications (mentions, DMs) first.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement quiet hours?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Store quiet_hours in user preferences (start_time, end_time, timezone). On notification creation, check if current time is within quiet hours. If yes, queue notification, deliver when quiet hours end. Exceptions for high-priority (DMs, security alerts). Sync quiet hours across devices.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.apple.com/design/human-interface-guidelines/notification-center/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apple HIG — Notification Center Design
            </a>
          </li>
          <li>
            <a
              href="https://material.io/design/communication/understanding-notification.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Material Design — Understanding Notification
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/push-notifications/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              web.dev — Push Notifications Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://slack.engineering/tagged/notifications"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Slack Engineering — Notification System
            </a>
          </li>
          <li>
            <a
              href="https://www.nngroup.com/articles/notification-design/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — Notification Design
            </a>
          </li>
          <li>
            <a
              href="https://firebase.google.com/docs/cloud-messaging"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Firebase — Cloud Messaging for Notifications
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
