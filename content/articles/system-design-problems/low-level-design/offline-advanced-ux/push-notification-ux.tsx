"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-push-notification-ux",
  title: "Push Notification UX System",
  description: "Designing push notifications with engagement, frequency capping, and user preference management",
  category: "low-level-design",
  subcategory: "offline-advanced-ux",
  slug: "push-notification-ux",
  wordCount: 6500,
  readingTime: 39,
  lastUpdated: "2026-05-06",
  tags: ["lld", "push-notifications", "ux", "engagement", "service-worker"],
  relatedTopics: ["offline-first-architecture", "background-sync"],
};

export default function PushNotificationUXArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">Push notifications engage users when the app is not running: "You have a new message", "Your order shipped". Without push, users only see notifications when they open the app. With push, they're notified proactively, improving engagement and retention.</HighlightBlock>
        <HighlightBlock as="p" tier="important">However, excessive push notifications drive users away: spamming notifications causes opt-out, uninstall, and poor app ratings. A user who receives 10 notifications daily will mute notifications. A user who receives 1 relevant notification weekly will engage. The art is balance: notify when there's genuinely important information, but not excessively.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">Key challenges: user preference management (users want control over notification frequency and topics), permission flow (requesting notification permission), handling dismissed/ignored notifications (was the user not interested or just busy?), analytics on engagement (which notifications drive action), and preventing notification spam (frequency capping, coalescing related notifications).</HighlightBlock>
        <HighlightBlock as="p" tier="important"><strong>Explicit assumptions:</strong> Push API and Notification API available (modern browsers). Service Worker available for handling push events. Server infrastructure supports push message delivery (Firebase Cloud Messaging, Web Push standard). User consent (permission) obtained before sending notifications.</HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Permission request:</strong> Request notification permission from the user with clear explanation of notification types.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>User preferences:</strong> Allow users to customize frequency (instant, daily digest, weekly), categories (messages only, orders, promotions), and quiet hours (9pm-8am no notifications).</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Push reception:</strong> Receive push events from server even when app is closed (via Service Worker push event).</HighlightBlock>
          <li><strong>Notification display:</strong> Display notification with title, body, icon, and action buttons (reply, dismiss, view).</li>
          <li><strong>User interaction:</strong> Track when user clicks, dismisses, or acts on notification. Open app or perform action (e.g., navigate to order details).</li>
          <li><strong>Frequency capping:</strong> Limit notifications per user per day (e.g., max 3 per day, max 1 per hour for same topic).</li>
          <li><strong>Coalescing:</strong> Combine related notifications (e.g., 5 liked messages consolidated into "5 new interactions").</li>
          <li><strong>Analytics:</strong> Track engagement: notification sent, user clicked, user dismissed, action taken.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial"><strong>Latency:</strong> Notification delivery within 1-5 seconds of server sending (depends on push service).</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Reliability:</strong> 99%+ delivery rate for critical notifications (order shipment, security alerts).</HighlightBlock>
          <li><strong>Scalability:</strong> Support millions of subscriptions; server can dispatch millions of push messages daily.</li>
          <li><strong>Privacy:</strong> User data (subscription tokens, preferences) protected and encrypted.</li>
          <li><strong>Opt-out rate:</strong> Maintain under about 2% opt-out rate through careful notification design (indicates good targeting).</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="important">The system comprises three parts: client (web app), server (notification service), and push infrastructure (Firebase Cloud Messaging or Web Push standard).</HighlightBlock>
        <HighlightBlock as="p" tier="important">Client: registers a Service Worker push event listener. When the user grants notification permission, the client requests a push subscription from the browser (via serviceWorkerRegistration.pushManager.subscribe). This returns an endpoint (unique per device/user) that the client sends to the server. The Service Worker listens for push events; when a push arrives, it displays a notification to the user.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Server: stores push subscriptions (endpoints) for each user. When an event occurs (message received, order shipped), the server checks user preferences (is this notification type enabled? within quiet hours?), applies frequency capping (did user get 3 notifications already today?), and sends a push message to the user's endpoint via the push service.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">Engagement tracking: when the user interacts with a notification (clicks it, dismisses it), the Service Worker notifies the server (via background sync or beacon API), logging the interaction. This drives analytics and machine learning on notification timing/content optimization.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/offline-advanced-ux/push-notification-ux.svg"
          alt="Push notification delivery pipeline from browser subscription through server push to service worker, with permission UX best practices and notification preferences"
          caption="Push notification delivery pipeline from browser subscription through server push to service worker, with permission UX best practices and notification preferences"
        />

        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Permission Flow and Request Strategy</h3>
        <p>Requesting notification permission is critical; poor timing causes users to deny it permanently. Best practice: request permission only after the user has experienced value (not on page load). Example: after user sends first message, show "Get notified when you receive replies?". Offer clear explanation: "We'll send 1-2 notifications daily about new messages."</p>
        <p>Permission states: default (not requested), granted (user allowed), denied (user refused). If denied, the browser blocks further requests until the user manually changes it in browser settings. Never request multiple times; respect the user's decision.</p>
        <p>Permission UI variants: simple (yes/no dialog), detailed (explanation + checkbox for categories), or integrated (in-app settings modal). Detailed variants convert better (higher grant rate) because users understand what they're consenting to.</p>
        <p><strong>Permission Timing and Contextual Prompts:</strong> The optimal time to request permission is after the user has derived value from the app. In a messaging app, request after user sends first message (triggers the need to receive notifications). In a commerce app, request after first purchase or interaction with product. Avoid requesting on page load; deny rate is 50%+. Additionally, use contextual prompts: don't show a generic "Enable notifications?" popup. Instead, in context, ask: "Get notified when your order ships?" This frames the value clearly. Measure grant rate by timing: on-load (30% grant), after-value (60% grant), in-context (70% grant). Track deny rate per timing; if deny rate spikes, adjust timing.</p>
        <p><strong>Permission Recovery and Browser UI Integration:</strong> If the user denies permission, the browser typically shows a "Permission blocked" message in the address bar. Some users don't notice this and think notifications are broken. Implement permission recovery: detect if permission is denied, and offer a help prompt: "Notifications are disabled. Click here to enable in browser settings." Additionally, integrate with browser permission delegation: some browsers support `permissions.query()` to check permission state. Use this to adapt UI: if permission is denied, don't keep asking; instead, link to browser settings. Additionally, handle permission grants correctly: after the user grants permission, immediately subscribe and save the subscription endpoint to the server. If subscription fails (network error), queue it for retry.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">User Preferences and Settings</h3>
        <p>Store user preferences: notification types (messages, orders, promotions), frequency (instant, daily digest, never), quiet hours (start/end times), and do-not-disturb days (weekends). Make these configurable in the app settings.</p>
        <p>Server-side enforcement: when deciding to send a notification, check user preferences. If the notification type is disabled, don't send. If in quiet hours, coalesce it into a digest for morning delivery. If frequency capped (3 per day already), queue it for next day or discard (depends on importance).</p>
        <p>Client-side persistence: store preferences in localStorage for quick UI access. Server stores authoritative preferences in the database. Sync on page load; if preferences change, immediately update both client and server.</p>
        <p><strong>Preference Hierarchy and Granularity:</strong> Implement preference hierarchy: global settings (all notifications), category-level settings (messages, orders), and per-conversation or per-item settings (mute this chat, unsubscribe from this seller). More granular control improves user satisfaction. Users appreciate being able to silence notifications from specific sources while keeping others. Schema includes preferences with global settings (enabled and frequency), categories with messages and orders settings, and perItem with conversation-specific settings. This allows users to customize at the granularity they prefer without overwhelming them with choices.</p>
        <p><strong>Timezone-Aware Quiet Hours and Time-Based Scheduling:</strong> Quiet hours (e.g., 9pm-8am) should respect user's timezone, not server timezone. Store timezone in user profile (using browser Intl API). When checking if current time is in quiet hours, calculate local time for the user. Additionally, support smart scheduling: if a notification arrives during quiet hours, queue it and deliver at the first available time (8am). For digest notifications, send at a preferred time (e.g., user prefers digests at 8am). Implement this via a notification queue: when a notification is blocked by quiet hours, save it with deliver_at timestamp calculated from user preferences. A background job processes the queue at scheduled times.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Frequency Capping and Coalescing</h3>
        <p>Naive approach: every event (message received, like on post) triggers a notification. If user gets 100 messages, they get 100 notifications (spam). Better: cap frequency (max 3 notifications per day) and coalesce (combine similar notifications).</p>
        <p>Capping: track notifications sent per user per day (in Redis or database). Before sending, check the count. If the count is at or above the cap (for example 3), queue the notification for next day (add to digest) instead of sending immediately. Reset count at midnight.</p>
        <p>Coalescing: when 5 messages arrive from the same person, send 1 notification: "5 new messages from Alice" instead of 5 separate notifications. Implement at server: check if similar notification was sent in last hour; if yes, increment counter instead of sending new notification.</p>
        <HighlightBlock as="p" tier="important"><strong>Multi-Level Frequency Capping and Priority-Based Bypass:</strong> Implement tiered capping: total daily cap (max 5 notifications any type), per-category cap (max 3 messages, max 2 order updates), and per-sender cap (max 1 notification per sender per hour). When approaching a cap, queue for digest instead of dropping. Additionally, support priority bypass: critical notifications (security alerts, high-urgency messages) bypass all caps and always send immediately. Medium-priority notifications subject to daily cap. Low-priority (promotions) subject to all caps. Implement via notification priority field: `priority: 'critical' | 'high' | 'medium' | 'low'`. Critical always sends; high bypasses hourly but respects daily cap; medium respects all caps; low can be queued for digest.</HighlightBlock>
        <p><strong>Coalescing Strategies and Conflict Detection:</strong> Three coalescing strategies: (1) Counter coalescing: "5 new likes on your post" (increment counter, same notification). (2) Grouped coalescing: "Messages from Alice, Bob, Carol" (list senders, max 3, rest as "and 2 more"). (3) Digest coalescing: if coalescing would create a long list, convert to digest summary: "You have 23 new interactions today". Choose based on context: counter for high-frequency events (likes), grouped for moderately-frequent (new followers), digest for low-frequency but potentially many. Additionally, detect conflicts: if two notifications coalesce (same thread), use the same `tag` attribute in the notification. The browser will replace older notification with the newer one instead of stacking. Example: `tag: 'messages_alice'` ensures only latest message from Alice is shown in notification center.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Service Worker Push Event Handling</h3>
        <p>In the Service Worker, register a push event listener. When a push arrives, the push event contains data (notification details sent by the server). The Service Worker parses the data and calls showNotification with a title and options to display the notification.</p>
        <p>Notification options include: title, body, icon (app icon), badge (small icon for notification bar), tag (grouping key for coalescing on-device), actions (buttons like "Reply", "Dismiss"), and data (context to pass back if user interacts).</p>
        <p>Example: a push event contains fields like title, body, and a tag used for grouping. Service Worker displays the notification. If the user clicks, a click event fires and the Service Worker can open the app or navigate to the relevant page.</p>
        <p><strong>Push Event Parsing and Notification Decoration:</strong> Push events contain encrypted data from the server. Decrypt using the push subscription's key (handled automatically by browsers). Extract fields: title, body, tag, actions, image (large image for rich notification), badge (small icon). Additionally, add app-level metadata: append app name to title, use branded icon/badge, include deep link in data (with url pointing to messages). Gracefully handle missing fields: if image is missing, use a default. If body is too long (500+ chars), truncate and append "...". For actions, limit to 2 buttons (platform constraint). If the server sends 5 actions, prioritize the most important 2.</p>
        <p><strong>Notification Interaction and Handler Routing:</strong> The notification includes action buttons and click handlers. Register notificationclick and notificationclose listeners in the Service Worker. On click, check the action: if action is reply, open a reply modal. If action is open, open the app/deep link. If no action (user clicked notification body), open the app to a relevant page (e.g., messages page for message notification). Use data field to route notifications by including url information. Additionally, implement smart window focus: if the app is already open in a tab, focus that tab instead of opening a new one. Use clients.matchAll() and client.focus() to find and focus existing windows.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Engagement and Analytics</h3>
        <p>Track three events: notification sent (server logs when push is dispatched), notification interacted (user clicks), notification dismissed (user swipes away or ignores). Log all three with timestamp, notification ID, and user ID.</p>
        <p>Engagement rate: (clicks + actions) divided by sent. If a notification achieves under about 5% engagement, it is not resonating; improve content or timing. If it is above about 20%, it is excellent (users find it valuable).</p>
        <p>Use engagement data to optimize: identify high-engagement notification types and increase frequency. Identify low-engagement types and decrease or redesign. Machine learning: predict which users will engage with which topics; personalize sending to maximize engagement without annoying.</p>
        <HighlightBlock as="p" tier="crucial"><strong>Event Tracking Pipeline and Attribution:</strong> Set up event tracking: when server sends push, log `notification:sent` with fields: user_id, notification_id, type, timestamp, capping_status (was it capped or sent immediately), priority. When Service Worker detects interaction, log `notification:clicked` with action type (opened app, clicked action, dismissed). Link events via notification_id. Calculate engagement: for each notification_id, check if there's a click within 60 seconds of send (typical engagement window). Build cohort analysis: users who engaged with message notifications have 40% higher retention than those who didn't. This drives product decisions: should we increase message notification frequency? This data should inform the model for personalization.</HighlightBlock>
        <HighlightBlock as="p" tier="important"><strong>A/B Testing and Personalization Models:</strong> Run A/B tests on notification content/timing. Example: test "You have a message from Alice" vs "New message: 'Hello...'" (first 20 chars). Split users 50/50, measure engagement. High-engagement variant wins; use it for all future. Implement via feature flags: `experiment: 'notification_format_v1'` controls which variant each user sees. Additionally, build personalization models: collect features (user's timezone, preferred notification type, historical engagement rate), train a model to predict engagement, use predictions to decide: should we send this notification to this user now, or queue for digest? A simple heuristic: if predicted engagement is below 10%, don't send (or send only in digest). This maintains low opt-out rate by avoiding low-engagement notifications.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Opt-Out and Re-Engagement</h3>
        <p>Users can opt-out (disable notifications entirely) or soft-opt-out (mute push permission in browser, but don't revoke). High opt-out rate (for example above about 5%) indicates too many notifications. Low opt-out (for example under about 1%) with continued high engagement is a sign of good strategy.</p>
        <p>Re-engagement flow: if a user hasn't opened the app in 30 days, send a re-engagement notification (e.g., "We miss you! See what's new."). If user engages, note it in CRM. If they continue to ignore, stop sending re-engagement notifications (likely lost user).</p>
        <HighlightBlock as="p" tier="important"><strong>Opt-Out Monitoring and Churn Analysis:</strong> Track opt-out rate as a key metric. An increasing opt-out rate signals a problem: either too many notifications, irrelevant content, or poor timing. Investigate: correlate opt-out with notification history. Did the user receive 10 notifications in one day before opting out? They were likely overwhelmed by capping failure. Did they receive irrelevant notifications (promotions when they prefer messages)? Preference-based targeting failed. Use churn funnels: identify cohorts of heavy opt-outers and analyze their notification history. Additionally, offer in-app preference adjustment before opt-out: if user is about to disable notifications, show a modal: "You're about to disable notifications. Would you prefer to adjust frequency instead?" Many users prefer granular control over total opt-out.</HighlightBlock>
        <p><strong>Winback Campaigns and Lapsed User Recovery:</strong> Implement intelligent re-engagement: when a user hasn't engaged with the app for 14 days (lapsed), start sending re-engagement notifications (once per 3 days, max 3 total). Change tone: "We've added new features" (value proposition) instead of routine notifications. If user re-engages (opens app), immediately stop re-engagement and resume normal notification schedule. Track success: what percentage of lapsed users re-engage after re-engagement campaign? Goal: 10-15%. If lower, try different messaging. Additionally, segment users: VIP users (high lifetime value) might get more aggressive re-engagement. Inactive free users might get none (cost not justified). Segment by user value, engagement history, and predict likelihood to re-engage before sending.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Privacy and Security</h3>
        <p>Push subscriptions (endpoints) are long-lived tokens. If leaked, an attacker can send notifications to the user impersonating the app. Protect subscription endpoints: use HTTPS, store securely on server (encrypted at rest), and rotate periodically.</p>
        <p>User data in notifications: never include PII (passwords, SSNs) in notification bodies; they're not end-to-end encrypted. Use generic wording: "You have a new message" not "Alice sent: 'secret info'". Sensitive details are revealed only after user clicks and opens the app.</p>
        <HighlightBlock as="p" tier="important"><strong>Subscription Endpoint Security and VAPID Key Management:</strong> Push subscriptions contain sensitive endpoint URLs and encryption keys. Store them encrypted in the database (use a vault or KMS). Additionally, use VAPID (Voluntary Application Server Identification) keys: asymmetric key pair that authenticates your server to the push service. Keep the private key secret; if leaked, attackers can impersonate your app and send fake notifications. Rotate VAPID keys periodically (e.g., yearly). When storing subscription endpoints, encrypt them at rest. When transmitting between client and server, use HTTPS. Additionally, implement subscription validation: periodically test subscriptions (send a silent push to verify they're still valid). Remove invalid subscriptions (user unsubscribed in browser, endpoint expired). This prevents accumulation of stale subscriptions.</HighlightBlock>
        <p><strong>Data Minimization and Consent Management:</strong> Only send data necessary in the notification. Avoid including user IDs, message content, or any identifying information in the push payload. Example: instead of "Alice sent: 'Meeting at 3pm'", use "You have a new message" (user already knows it's from Alice when they open the app). Additionally, implement strict consent management: only send push to users who have explicitly granted permission. Track permission state server-side (when user enables/disables notifications). Implement unsubscribe links in email-based notifications (if you also send emails). For GDPR compliance, allow users to download their notification history and delete it. Document in privacy policy what data is collected (subscription endpoint, interaction events, timestamps).</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="crucial">Instant vs digest: instant notifications are timely but can overwhelm. Digest (hourly, daily) is less intrusive but less timely. Balance based on notification type: urgent (security alerts, high-priority messages) instant; informational (promotions, likes) digest.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Server-side vs client-side logic: capping and coalescing can be done on server (consistent, easy to adjust) or client (less load on server, faster local logic). Server-side is preferred for consistency; all users get same behavior regardless of client implementation.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Engagement optimization: aggressive personalization (send only high-predicted-engagement notifications) maximizes short-term engagement but may reduce long-term habit formation (users don't develop expectation to check app). Conservative approach (send on schedule, regardless of prediction) trains habit but may frustrate users with irrelevant notifications.</HighlightBlock>
      </section>

      <section>
        <h2>Implementation Patterns</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 1: Permission Request with Value Proposition</h3>
        <HighlightBlock as="p" tier="important">Request notification permission only after user experiences value. Show permission prompt after user's first action (send message, create post), with clear explanation of notification frequency and types. Improves grant rate from 30% (on load) to 60%+ (after value demonstrated).</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 2: Frequency Capping with Priority Levels</h3>
        <HighlightBlock as="p" tier="crucial">Implement tiered notifications: urgent (security, high-priority messages) bypass caps, high (likes, followers) subject to daily cap, low (promotions, digests) only in digest or disabled by default. Ensures critical notifications reach users while maintaining low spam.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 3: Engagement-Driven Re-sending</h3>
        <HighlightBlock as="p" tier="important">If user didn't interact with notification in 24 hours, automatically re-send it once with slightly different messaging. Increases engagement without doubling spam (re-send only for ignored, not for clicked).</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">Trade-offs include instant (timely, risky spam) versus digest (less intrusive, less timely), and server-side logic (consistent) versus client-side (performant). Real-world systems aim to</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">keep opt-out rates low through careful targeting, relevant content, and conservative frequency. For best results, request permission after value demonstration, cap at a small number of high-quality notifications daily, analyze engagement metrics, and continuously test and optimize timing, frequency, and content. Monitor opt-out trends; sustained increases indicate over-notification.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
