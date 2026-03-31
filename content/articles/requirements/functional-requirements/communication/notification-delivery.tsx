"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-comm-backend-notification-delivery",
  title: "Notification Delivery",
  description:
    "Comprehensive guide to implementing notification delivery covering multi-channel routing, user preferences, quiet hours, rate limiting, delivery optimization, and cross-platform notification strategies.",
  category: "functional-requirements",
  subcategory: "communication",
  slug: "notification-delivery",
  version: "extensive",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-30",
  tags: [
    "requirements",
    "functional",
    "communication",
    "notifications",
    "delivery",
    "backend",
    "routing",
    "preferences",
  ],
  relatedTopics: ["notification-center", "push-notification-service", "user-preferences", "rate-limiting"],
};

export default function NotificationDeliveryArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Notification delivery routes notifications through appropriate channels (push, email, SMS, in-app) based on user preferences and notification priority. The delivery system ensures notifications reach users through their preferred channels while respecting quiet hours, rate limits, and platform constraints. Effective notification delivery balances immediacy with user experience—delivering important notifications promptly without overwhelming users with alerts.
        </p>
        <p>
          The complexity of notification delivery stems from multiple factors: users have different preferences per notification type, channels have different costs and reliability, platforms impose rate limits, and timing affects engagement. A mention notification should arrive instantly via push, while a marketing email can wait for business hours. High-priority security alerts should bypass quiet hours, while social notifications should respect them. The delivery system must evaluate all these factors for each notification.
        </p>
        <p>
          For staff and principal engineers, notification delivery involves distributed systems challenges. The system must handle millions of notifications per day with low latency. Delivery must be reliable—important notifications should not be lost. Rate limiting prevents notification spam while ensuring urgent notifications get through. Cross-device sync ensures consistent notification state. Monitoring tracks delivery success rates, latency, and user engagement to optimize delivery strategies.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Delivery Channels</h3>
        <p>
          Push notifications deliver to mobile and desktop devices via platform services (APNs for iOS, FCM for Android, Web Push for browsers). Pros: Instant delivery, high visibility, works when app is closed. Cons: Rate limited by platforms, battery impact, requires user opt-in. Best for: Time-sensitive notifications (messages, mentions, security alerts).
        </p>
        <p>
          Email notifications deliver to user's email inbox. Pros: No rate limits, persistent record, works across devices. Cons: Delayed delivery, lower open rates, can go to spam. Best for: Digests, non-urgent updates, marketing, password resets.
        </p>
        <p>
          SMS notifications deliver to user's phone number. Pros: Highest open rate, works without internet, immediate. Cons: Cost per message, character limits, intrusive. Best for: Critical alerts (2FA, security, account issues).
        </p>
        <p>
          In-app notifications display within the application. Pros: No platform restrictions, rich formatting, deep linking. Cons: Only visible when app is open, easy to miss. Best for: Non-urgent updates, contextual hints, feature announcements.
        </p>

        <h3 className="mt-6">Preference Evaluation</h3>
        <p>
          Hierarchical preferences: global toggle overrides all, type preferences override channel defaults, per-sender mute overrides type preferences. Evaluation order: check global (if off, block all), check type (if off for type, block), check sender (if muted, block), check channel (deliver via enabled channels).
        </p>
        <p>
          Default preferences vary by notification type. Security notifications default to all channels (cannot be disabled). Social notifications default to push + in-app. Marketing defaults to email only (opt-in for push). Users can modify any default except critical security.
        </p>
        <p>
          Preference sync across devices. Change on one device updates server, pushes to other devices via WebSocket. Other devices update local cache, refresh UI. Conflict resolution: last write wins, or merge non-conflicting changes.
        </p>

        <h3 className="mt-6">Quiet Hours</h3>
        <p>
          Quiet hours suppress non-urgent notifications during specified time range (typically 10 PM to 8 AM local time). User configures start/end time in their timezone. Notifications during quiet hours queue for delivery after quiet hours end.
        </p>
        <p>
          Urgent notifications bypass quiet hours. Security alerts, direct messages from VIP contacts, mentions in urgent conversations. Urgency determined by notification type and sender relationship. User can configure VIP list for quiet hours bypass.
        </p>
        <p>
          Timezone handling uses user's device timezone, not server time. Daylight saving time automatically handled. Travel detection—when user's device timezone changes, quiet hours adjust to new local time.
        </p>

        <h3 className="mt-6">Rate Limiting</h3>
        <p>
          Per-user rate limits prevent notification spam. Typical limits: 10 push notifications per hour, 50 emails per day, 5 SMS per day. Limits reset on rolling window (last hour, last 24 hours).
        </p>
        <p>
          Per-type rate limits prevent specific notification types from dominating. Social notifications limited to 5 per hour, marketing to 1 per day. Critical notifications (security, 2FA) exempt from rate limits.
        </p>
        <p>
          Rate limit handling: queue excess notifications, deliver when limit resets. For time-sensitive notifications, upgrade channel (push → SMS) if push rate limited. Log rate-limited notifications for analytics.
        </p>

        <h3 className="mt-6">Delivery Optimization</h3>
        <p>
          Channel selection based on notification type, user preferences, delivery history. If push frequently unopened, try email. If email goes to spam, reduce email frequency. Machine learning optimizes channel per user.
        </p>
        <p>
          Timing optimization sends notifications when user most likely to engage. Historical data shows user opens push at 9 AM and 6 PM. Schedule non-urgent notifications for those times. A/B test send times to optimize.
        </p>
        <p>
          Batching combines multiple notifications into single delivery. Instead of 5 push notifications in 10 minutes, send 1 digest. Reduces notification fatigue, improves engagement per notification.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Notification delivery architecture spans notification generation, preference evaluation, channel routing, and delivery tracking. Notifications enter system from various sources (social, system, marketing). Preference service evaluates user settings. Router selects channels. Delivery services send via appropriate channels. Tracking service monitors delivery success.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/notification-delivery/delivery-architecture.svg"
          alt="Notification Delivery Architecture"
          caption="Figure 1: Notification Delivery Architecture — Notification sources, preference evaluation, channel routing, and delivery tracking"
          width={1000}
          height={500}
        />

        <h3>Preference Service</h3>
        <p>
          Preference service evaluates user settings for each notification. Input: user_id, notification_type, sender_id. Output: allowed channels, quiet hours status, rate limit status. Cache preferences in Redis for fast access—key: user:ID:preferences.
        </p>
        <p>
          Hierarchical evaluation: check global toggle (if off, block all), check type preference (if off for type, block), check sender mute (if muted, block), check quiet hours (if active, queue), check rate limits (if exceeded, queue). Return allowed channels.
        </p>
        <p>
          Preference updates invalidate cache. User changes preference → update database → invalidate Redis cache → push update to other devices via WebSocket. Next notification fetches fresh preferences.
        </p>

        <h3 className="mt-6">Channel Router</h3>
        <p>
          Channel router selects delivery channels based on preferences and optimization. Input: notification, allowed channels, user history. Output: selected channels, send time. Router considers channel cost, reliability, user engagement history.
        </p>
        <p>
          Channel fallback: if primary channel fails (push undelivered), try secondary (email). Track channel success rates per user. If push consistently fails, prefer email. If email unopened, reduce email frequency.
        </p>
        <p>
          Timing decision: urgent notifications send immediately. Non-urgent notifications schedule for optimal time (user's typical engagement time). Quiet hours queue notifications for delivery after quiet hours end.
        </p>

        <h3 className="mt-6">Delivery Services</h3>
        <p>
          Push delivery service integrates with APNs (iOS), FCM (Android), Web Push (browsers). Maintains device token registry. Sends push notification with payload (title, body, deep_link). Tracks delivery status from platform responses.
        </p>
        <p>
          Email delivery service uses SMTP or email API (SendGrid, SES). Templates for each notification type. Personalization (user name, context). Track opens, clicks, bounces. Handle unsubscribes, spam complaints.
        </p>
        <p>
          SMS delivery service integrates with SMS gateway (Twilio, Vonage). Character limit enforcement (160 chars per SMS). Concatenate long messages. Track delivery status, opt-outs.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/notification-delivery/preference-evaluation-flow.svg"
          alt="Preference Evaluation Flow"
          caption="Figure 2: Preference Evaluation Flow — Hierarchical preference checking from global to channel level"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Delivery Tracking</h3>
        <p>
          Delivery tracking logs each delivery attempt. Fields: notification_id, user_id, channel, status (sent/delivered/failed/bounced), timestamp, error_message. Index on user_id and timestamp for user delivery history.
        </p>
        <p>
          Engagement tracking logs user actions on notifications. Push: tapped/dismissed. Email: opened/clicked/ignored. SMS: replied/ignored. Engagement data feeds optimization—adjust channel selection, timing based on engagement.
        </p>
        <p>
          Delivery analytics: success rate by channel, by notification type, by user segment. Identify delivery issues (high bounce rate for certain email domains). Alert on delivery failures exceeding threshold.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/notification-delivery/quiet-hours-handling.svg"
          alt="Quiet Hours Handling"
          caption="Figure 3: Quiet Hours Handling — Notification queuing during quiet hours, delivery after quiet hours end"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Notification delivery involves trade-offs between immediacy, user experience, cost, and reliability. Understanding these trade-offs enables informed decisions aligned with product goals and user expectations.
        </p>

        <h3>Push vs Email vs SMS</h3>
        <p>
          Push notifications: instant, high visibility, free. Cons: platform rate limits, requires app install, battery impact. Best for: time-sensitive, frequent notifications.
        </p>
        <p>
          Email: no rate limits, persistent, universal. Cons: delayed, lower engagement, spam risk. Best for: digests, non-urgent, detailed content.
        </p>
        <p>
          SMS: highest open rate, immediate, works offline. Cons: cost per message, character limits, intrusive. Best for: critical alerts, 2FA, account security.
        </p>

        <h3>Immediate vs Batched Delivery</h3>
        <p>
          Immediate delivery: each notification sent as generated. Pros: real-time, urgent notifications arrive instantly. Cons: notification fatigue, high volume. Best for: urgent notifications, active users.
        </p>
        <p>
          Batched delivery: accumulate notifications, send periodic digest. Pros: reduced fatigue, better engagement per notification. Cons: delayed delivery, may miss time-sensitive context. Best for: non-urgent notifications, high-volume users.
        </p>
        <p>
          Hybrid approach: urgent notifications immediate, non-urgent batched. Batch window: 1 hour for active users, 4 hours for casual users. User configurable batch frequency.
        </p>

        <h3>Strict vs Lenient Rate Limiting</h3>
        <p>
          Strict rate limiting: hard limits, notifications queued until limit resets. Pros: prevents spam, protects user experience. Cons: delayed delivery, may miss time-sensitive context. Best for: consumer apps, notification-heavy platforms.
        </p>
        <p>
          Lenient rate limiting: soft limits, allow overflow for important notifications. Pros: important notifications not delayed. Cons: risk of notification fatigue. Best for: enterprise apps, critical business notifications.
        </p>
        <p>
          Adaptive rate limiting: limits adjust based on user engagement. High engagement → higher limits. Low engagement → lower limits. User feedback (mute, unsubscribe) lowers limits.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/notification-delivery/channel-selection-strategies.svg"
          alt="Channel Selection Strategies"
          caption="Figure 4: Channel Selection Strategies — Multi-channel routing with fallback and optimization"
          width={1000}
          height={450}
        />

        <h3>Global vs Per-Type Preferences</h3>
        <p>
          Global preferences: single toggle for all notifications. Pros: simple, easy to understand. Cons: no granularity, user must choose all or nothing. Best for: simple apps, few notification types.
        </p>
        <p>
          Per-type preferences: separate toggle for each notification type. Pros: granular control, user can customize. Cons: complex UI, decision fatigue. Best for: complex apps, many notification types.
        </p>
        <p>
          Hybrid: global toggle + per-type overrides. Default: all types enabled. User can disable specific types. Global off overrides all types. Best for: most production apps.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Respect user preferences:</strong> Always check preferences before delivery. Never bypass user settings except for critical security. Make preferences easy to find and modify.
          </li>
          <li>
            <strong>Implement quiet hours:</strong> Default quiet hours (10 PM - 8 AM local time). Allow user customization. Queue non-urgent notifications during quiet hours.
          </li>
          <li>
            <strong>Rate limit notifications:</strong> Per-user limits (10 push/hour, 50 email/day). Per-type limits for notification categories. Queue excess, deliver when limit resets.
          </li>
          <li>
            <strong>Track delivery success:</strong> Log each delivery attempt with status. Track bounces, failures, opt-outs. Alert on high failure rates.
          </li>
          <li>
            <strong>Optimize channel selection:</strong> Use engagement history to select best channel. Fallback to secondary channel on failure. A/B test channel strategies.
          </li>
          <li>
            <strong>Batch non-urgent notifications:</strong> Combine multiple notifications into digest. Configurable batch window (1-4 hours). Reduce notification fatigue.
          </li>
          <li>
            <strong>Handle timezone correctly:</strong> Use user's device timezone, not server time. Adjust for daylight saving. Handle travel (timezone changes).
          </li>
          <li>
            <strong>Provide preference sync:</strong> Sync preferences across devices via WebSocket. Change on one device updates all. Resolve conflicts with last-write-wins.
          </li>
          <li>
            <strong>Monitor delivery metrics:</strong> Track delivery rate, open rate, click rate by channel. Identify delivery issues. Optimize based on engagement data.
          </li>
          <li>
            <strong>Handle opt-outs gracefully:</strong> Honor unsubscribe immediately. Remove from mailing list. Confirm opt-out to user. Provide re-subscribe option.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Ignoring preferences:</strong> Sending notifications user disabled. Solution: Always check preferences before delivery. Log preference violations for debugging.
          </li>
          <li>
            <strong>No quiet hours:</strong> Notifications at 3 AM annoy users. Solution: Implement quiet hours with timezone handling. Queue non-urgent notifications.
          </li>
          <li>
            <strong>No rate limiting:</strong> Notification spam overwhelms users. Solution: Per-user and per-type rate limits. Queue excess notifications.
          </li>
          <li>
            <strong>Wrong timezone:</strong> Using server time instead of user's local time. Solution: Store user timezone, use device timezone, handle DST.
          </li>
          <li>
            <strong>No delivery tracking:</strong> Can't identify delivery issues. Solution: Log all delivery attempts, track success/failure, alert on anomalies.
          </li>
          <li>
            <strong>Ignoring engagement:</strong> Same channel for all users regardless of engagement. Solution: Track engagement, optimize channel per user.
          </li>
          <li>
            <strong>No fallback:</strong> Single channel, no backup on failure. Solution: Multi-channel with fallback. If push fails, try email.
          </li>
          <li>
            <strong>Hard to unsubscribe:</strong> Users can't easily opt out. Solution: Clear unsubscribe link, honor immediately, confirm opt-out.
          </li>
          <li>
            <strong>No preference sync:</strong> Preferences differ across devices. Solution: Sync via WebSocket, last-write-wins conflict resolution.
          </li>
          <li>
            <strong>Batching urgent notifications:</strong> Security alerts delayed in digest. Solution: Classify urgency, send urgent immediately, batch non-urgent.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Facebook Notification Delivery</h3>
        <p>
          Facebook delivers notifications via push, email, and in-app. User preferences per notification type (likes, comments, tags, events). Quiet hours respected for non-urgent notifications. Batch digests for high-volume users (50+ notifications/day). ML optimizes send time per user.
        </p>

        <h3 className="mt-6">Slack Notification Routing</h3>
        <p>
          Slack routes notifications based on channel settings and user preferences. @channel and @here notifications bypass quiet hours for urgent team alerts. Direct messages always deliver via push. Digest email for offline period. Per-channel mute overrides global settings.
        </p>

        <h3 className="mt-6">Uber Critical Alerts</h3>
        <p>
          Uber uses SMS for critical ride notifications (driver arrived, trip issues). Push for routine updates (driver assigned, ETA). Email for receipts and summaries. Security notifications (login from new device) bypass all preferences.
        </p>

        <h3 className="mt-6">LinkedIn Professional Notifications</h3>
        <p>
          LinkedIn delivers job alerts, connection requests, and engagement notifications. Professional context affects delivery—job alerts during business hours, social notifications anytime. Weekly digest email for profile views, post engagement. Premium users get more frequent notifications.
        </p>

        <h3 className="mt-6">GitHub Activity Notifications</h3>
        <p>
          GitHub delivers notifications for mentions, PR reviews, issue comments. Watch settings per repository (all activity, participating, ignore). Email digest for inactive period. Push for @mentions only. Custom routing rules for enterprise teams.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle notification preferences?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Store preferences in user_settings table: user_id, notification_type, enabled, channels, quiet_hours. Evaluate on notification creation—check global toggle, type preference, sender mute, quiet hours, rate limits. If any filter blocks, don't deliver. Cache preferences in Redis for fast access. Sync across devices via WebSocket.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement quiet hours?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Store user's quiet hours (start_time, end_time) and timezone. On notification creation, check if current time in user's timezone falls within quiet hours. If yes and notification not urgent, queue for delivery after quiet hours end. Use cron job or delayed queue to deliver queued notifications. Handle timezone changes (travel) by using device timezone.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you rate limit notifications?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use Redis for rate limit tracking. Key: user:ID:notifications:hour. INCR on each notification, EXPIRE after 1 hour. Check count before delivery. If over limit, queue notification for later. Per-type limits use separate keys (user:ID:notifications:social:hour). Critical notifications bypass rate limits.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize channel selection?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Track engagement per channel (push open rate, email open rate, SMS response rate). Store in user profile. On notification creation, score each allowed channel by historical engagement. Select highest scoring channel. Fallback to secondary channel on delivery failure. A/B test channel strategies to improve engagement.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle notification batching?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Queue non-urgent notifications in user's batch queue. Batch window configurable (1-4 hours). On batch trigger (timer or queue size threshold), combine notifications into digest. Single push/email with summary ("You have 15 new notifications"). Include top 3-5 notifications, link to view all. Clear batch queue after delivery.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you track notification delivery?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Log each delivery attempt: notification_id, user_id, channel, status (sent/delivered/failed/bounced), timestamp, error. Track engagement: push (tapped/dismissed), email (opened/clicked), SMS (replied). Store in analytics database. Query for delivery success rate, engagement rate by channel/type. Alert on delivery failures exceeding threshold.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.apple.com/documentation/usernotifications"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apple Developer — User Notifications (APNs)
            </a>
          </li>
          <li>
            <a
              href="https://firebase.google.com/docs/cloud-messaging"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Firebase — Cloud Messaging Documentation
            </a>
          </li>
          <li>
            <a
              href="https://sendgrid.com/docs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              SendGrid — Email Delivery Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.twilio.com/docs/sms"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twilio — SMS API Documentation
            </a>
          </li>
          <li>
            <a
              href="https://slack.engineering/tagged/notifications"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Slack Engineering — Notification Systems
            </a>
          </li>
          <li>
            <a
              href="https://www.nngroup.com/articles/notification-design/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — Notification Design Best Practices
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
