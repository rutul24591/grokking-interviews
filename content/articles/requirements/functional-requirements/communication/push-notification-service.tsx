"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-comm-backend-push-notifications",
  title: "Push Notification Service",
  description:
    "Comprehensive guide to implementing push notification services covering APNs integration, FCM integration, token management, delivery optimization, rate limiting, and cross-platform notification strategies.",
  category: "functional-requirements",
  subcategory: "communication",
  slug: "push-notification-service",
  version: "extensive",
  wordCount: 6300,
  readingTime: 25,
  lastUpdated: "2026-03-30",
  tags: [
    "requirements",
    "functional",
    "communication",
    "push",
    "notifications",
    "backend",
    "mobile",
    "apns",
    "fcm",
  ],
  relatedTopics: ["notification-delivery", "notification-center", "mobile-optimization", "rate-limiting"],
};

export default function PushNotificationServiceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Push notification service delivers notifications to user devices via platform-specific providers: APNs (Apple Push Notification service) for iOS, FCM (Firebase Cloud Messaging) for Android, and Web Push for browsers. Push notifications enable re-engagement with users even when the app is closed, driving retention and timely user actions. The service must handle platform differences, token management, delivery optimization, and rate limiting while respecting user preferences.
        </p>
        <p>
          The complexity of push notifications stems from platform fragmentation. iOS uses APNs with HTTP/2 protocol, strict rate limits (~2-3 notifications/hour for non-urgent), and requires device tokens. Android uses FCM with more flexible limits, topic subscriptions, and registration tokens. Web Push uses VAPID keys with browser-specific implementations. Each platform has different payload formats, delivery guarantees, and feedback mechanisms. The service must abstract these differences while optimizing for each platform's strengths.
        </p>
        <p>
          For staff and principal engineers, push notification service implementation involves distributed systems challenges. Token management must handle token refresh, invalidation, and multi-device users. Delivery optimization balances immediacy with rate limits. Feedback handling processes delivery failures, bounces, and opt-outs. Analytics tracks open rates, click-through rates, and engagement. The architecture must scale to millions of notifications per day with high delivery success rates.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Platform Providers</h3>
        <p>
          APNs (Apple Push Notification service) delivers notifications to iOS, macOS, watchOS, and tvOS devices. Uses HTTP/2 protocol with JWT authentication (provider token). Payload limit: 4KB. Rate limits: ~2-3 notifications/hour for non-urgent, higher for urgent. Delivery: best-effort, no delivery confirmation. Feedback: token invalidation via separate API.
        </p>
        <p>
          FCM (Firebase Cloud Messaging) delivers to Android, web, and other platforms. Uses HTTP v1 API with OAuth 2.0 authentication. Payload limit: 4KB. Rate limits: more flexible than APNs, ~100 notifications/minute per project. Delivery: best-effort with optional delivery receipts. Feedback: token registration/deregistration events.
        </p>
        <p>
          Web Push delivers to browsers (Chrome, Firefox, Safari, Edge). Uses VAPID (Voluntary Application Server Identification) for authentication. Payload limit: 4KB. Rate limits: browser-dependent, generally permissive. Delivery: requires browser to be running. Feedback: push subscription expiration events.
        </p>

        <h3 className="mt-6">Token Management</h3>
        <p>
          Device tokens uniquely identify devices for push delivery. iOS: APNs device token (64 hex characters), refreshes periodically and on app reinstall. Android: FCM registration token, refreshes on app reinstall or token refresh request. Web: push subscription endpoint + VAPID keys.
        </p>
        <p>
          Token storage maps user_id to device tokens. Users have multiple devices (phone, tablet, desktop). Store: user_id, device_token, platform, device_info, created_at, last_used. Index on user_id (fetch user's devices) and device_token (lookup on feedback).
        </p>
        <p>
          Token refresh handling: iOS tokens refresh periodically without app action. App receives new token, sends to server. Server updates token mapping, keeps old token valid during transition. FCM tokens refresh on request or app reinstall. Handle token updates atomically to prevent lost notifications.
        </p>

        <h3 className="mt-6">Notification Payload</h3>
        <p>
          Push payload structure varies by platform. Common fields: title (notification title), body (notification message), data (custom key-value pairs), badge (iOS app badge count), sound (notification sound), category (iOS notification category for actions). Platform-specific fields: iOS (alert, content-available), Android (priority, ttl, collapse_key).
        </p>
        <p>
          Silent push (content-available: true on iOS) wakes app without displaying notification. App processes data in background. Use for: data sync, badge update, background fetch. Rate limited: iOS allows ~2-3 silent pushes per hour. Abuse results in throttling.
        </p>
        <p>
          Rich notifications include attachments (images, videos, audio). iOS: notification service extension downloads attachment, displays with notification. Android: largeIcon, bigPicture styles. Web: image, badge, vibrate options. Attachment size limits: iOS ~50MB, Android varies.
        </p>

        <h3 className="mt-6">Delivery Optimization</h3>
        <p>
          Priority delivery for urgent notifications. iOS: apns-priority header (10 for urgent, 5 for normal). Android: priority field (high for urgent, normal for regular). Urgent notifications bypass Do Not Disturb and quiet hours. Use sparingly—abuse leads to user disabling notifications.
        </p>
        <p>
          Collapsed delivery combines multiple notifications. iOS: apns-collapse-id header. Android: collapse_key. Multiple notifications with same collapse key show as single notification, updated with latest content. Use for: live scores, stock prices, ongoing updates.
        </p>
        <p>
          Time-to-live (TTL) sets notification expiration. If device offline, notification delivered when device reconnects within TTL. After TTL expires, notification discarded. iOS: exp claim in JWT. Android: ttl field. Web: TTL in push subscription. Typical TTL: 1 hour for time-sensitive, 24 hours for regular.
        </p>

        <h3 className="mt-6">Rate Limiting and Throttling</h3>
        <p>
          Platform rate limits: APNs ~2-3 notifications/hour for non-urgent, higher for urgent. FCM more flexible (~100/minute). Web Push varies by browser. Exceeding limits results in throttling or rejection. Track per-user, per-device send rates.
        </p>
        <p>
          Throttling strategies: queue excess notifications, deliver when limit resets. For urgent notifications, upgrade channel (push → SMS). Batch non-urgent notifications into digest. Implement backoff on 429 Too Many Requests responses.
        </p>
        <p>
          User-level rate limiting prevents notification fatigue. Limit: 10 push notifications per day per user. Exempt: critical security alerts, user-triggered notifications (message received). Track user engagement—if user consistently dismisses without opening, reduce frequency.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Push notification service architecture spans token management, payload construction, platform delivery, and feedback handling. Token service manages device tokens. Payload service constructs platform-specific payloads. Delivery service sends to APNs/FCM/Web Push. Feedback service processes delivery failures and token invalidations.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/push-notification-service/push-architecture.svg"
          alt="Push Notification Architecture"
          caption="Figure 1: Push Notification Architecture — Token management, payload construction, platform delivery, and feedback handling"
          width={1000}
          height={500}
        />

        <h3>Token Service</h3>
        <p>
          Token registration endpoint accepts device_token, platform, device_info from client. Validates token format (64 hex chars for iOS, variable for FCM). Stores in token table with user_id (from auth context). Returns success. Client calls on app install, token refresh.
        </p>
        <p>
          Token lookup retrieves user's devices for notification delivery. Query: SELECT * FROM tokens WHERE user_id = ?. Returns all devices. Filter by platform if needed (iOS-only notification). Handle users with 10+ devices (tablet, phone, desktop, watch).
        </p>
        <p>
          Token invalidation removes invalid tokens. Feedback from APNs (device token invalid) or FCM (registration token expired). Query: DELETE FROM tokens WHERE device_token = ?. Log invalidation for analytics. Notify user's other devices to update token if needed.
        </p>

        <h3 className="mt-6">Payload Service</h3>
        <p>
          Payload construction creates platform-specific payloads from common notification. Input: title, body, data, priority, collapse_id. Output: APNs payload (aps object + custom data), FCM payload (notification + data objects), Web Push payload (title, body, options).
        </p>
        <p>
          iOS payload: (aps: (alert: (title, body), badge, sound, category), custom_data). Android payload: (notification: (title, body), data: (...)). Web payload: (title, body, icon, badge, data).
        </p>
        <p>
          Localization support: include localization key instead of text. iOS: &quot;loc-key&quot;, &quot;loc-args&quot;. Android: similar. Client resolves key to localized text based on device language. Single notification serves multiple languages.
        </p>

        <h3 className="mt-6">Delivery Service</h3>
        <p>
          APNs delivery uses HTTP/2 with JWT authentication. Provider token (JWT) signed with private key, includes team_id, key_id, exp (expiration). Request: POST to api.push.apple.com/3/device/device_token with apns-topic (bundle ID), apns-priority, apns-collapse-id headers. Response: 200 success, 400/410 invalid token, 429 rate limited.
        </p>
        <p>
          FCM delivery uses HTTP v1 API with OAuth 2.0. Access token from service account credentials. Request: POST to fcm.googleapis.com/v1/projects/project_id/messages:send with message object. Response: message_id on success, error on failure. Retry on 5xx errors with exponential backoff.
        </p>
        <p>
          Web Push delivery uses VAPID authentication. VAPID keys (public/private pair) generated once. Public key sent to client during subscription. Private key signs JWT for push request. Request: POST to push endpoint (browser-specific) with Authorization: WebPush &lt;jwt&gt;, Encryption headers. Response: 201/202 success, 410/404 subscription expired.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/push-notification-service/token-lifecycle.svg"
          alt="Token Lifecycle"
          caption="Figure 2: Token Lifecycle — Registration, refresh, invalidation, and cleanup"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Feedback Service</h3>
        <p>
          APNs feedback: check feedback API periodically (daily). Returns device tokens that are invalid. Query: GET to api.push.apple.com/3/feedback. Response: array of device_token, timestamp. Action: delete tokens from database, stop sending to those devices.
        </p>
        <p>
          FCM feedback: response includes error codes. INVALID_ARGUMENT: bad payload format. UNREGISTERED: token invalid, remove from database. QUOTA_EXCEEDED: rate limited, backoff. SERVER_ERROR: retry with exponential backoff. Parse error responses, take appropriate action.
        </p>
        <p>
          Web Push feedback: 410 Gone or 404 Not Found means subscription expired. Remove subscription from database. 400 Bad Request: invalid payload, fix and retry. 413 Payload Too Large: reduce payload size. 429 Too Many Requests: backoff and retry later.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/push-notification-service/delivery-optimization.svg"
          alt="Delivery Optimization"
          caption="Figure 3: Delivery Optimization — Priority, collapse, TTL, and rate limiting"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Push notification design involves trade-offs between delivery reliability, user experience, platform constraints, and operational complexity. Understanding these trade-offs enables informed decisions aligned with engagement goals and platform requirements.
        </p>

        <h3>APNs vs FCM vs Web Push</h3>
        <p>
          APNs (iOS): most restrictive, strict rate limits, no delivery confirmation. Pros: reliable delivery to iOS devices, silent push capability. Cons: rate limits, token management complexity, no delivery receipt. Best for: iOS apps with moderate notification volume.
        </p>
        <p>
          FCM (Android): flexible, higher rate limits, optional delivery receipts. Pros: reliable delivery, topic subscriptions, analytics. Cons: Google dependency, battery impact concerns. Best for: Android apps with high notification volume.
        </p>
        <p>
          Web Push: browser-dependent, requires browser running. Pros: no app install needed, works on desktop. Cons: browser must be running, limited mobile support (iOS Safari不支持). Best for: web apps, desktop notifications.
        </p>

        <h3>Immediate vs Batched Delivery</h3>
        <p>
          Immediate delivery: send notification as generated. Pros: real-time, urgent notifications arrive instantly. Cons: notification fatigue, rate limit exhaustion. Best for: urgent notifications (messages, security alerts).
        </p>
        <p>
          Batched delivery: accumulate notifications, send periodic digest. Pros: reduced fatigue, better engagement per notification. Cons: delayed delivery, may miss time-sensitive context. Best for: non-urgent notifications (social updates, marketing).
        </p>
        <p>
          Hybrid approach: urgent notifications immediate, non-urgent batched. Batch window: 1 hour for active users, 4 hours for casual. User configurable. Best for: most production apps balancing urgency with fatigue.
        </p>

        <h3>Rich vs Simple Notifications</h3>
        <p>
          Rich notifications with attachments (images, videos). Pros: higher engagement, better context. Cons: larger payload, slower delivery, attachment download required. Best for: media-rich apps (social, news), important notifications.
        </p>
        <p>
          Simple text-only notifications. Pros: small payload, fast delivery, works on slow networks. Cons: lower engagement, less context. Best for: frequent notifications, time-sensitive alerts.
        </p>
        <p>
          Adaptive approach: rich for important notifications, simple for routine. Determine importance by notification type, user engagement history. Best for: apps with mixed notification types.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/push-notification-service/platform-comparison.svg"
          alt="Platform Comparison"
          caption="Figure 4: Platform Comparison — APNs, FCM, and Web Push capabilities and limitations"
          width={1000}
          height={450}
        />

        <h3>Token Storage: Database vs Cache</h3>
        <p>
          Database storage (PostgreSQL, MySQL). Pros: durable, queryable, transactional. Cons: slower lookups, connection overhead. Best for: primary storage, token management.
        </p>
        <p>
          Cache storage (Redis). Pros: fast lookups, low latency. Cons: volatile (memory-based), expiration management. Best for: hot cache, frequently accessed tokens.
        </p>
        <p>
          Hybrid: database for durability, Redis for fast access. Write to both, read from cache with database fallback. Cache TTL matches token lifetime. Best for: production systems with high notification volume.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Handle token refresh properly:</strong> iOS tokens refresh periodically. App receives new token, sends to server. Server updates mapping, keeps old token valid during transition. Atomic updates prevent lost notifications.
          </li>
          <li>
            <strong>Respect platform rate limits:</strong> APNs ~2-3/hour for non-urgent. Track per-device send rates. Queue excess, deliver when limit resets. Urgent notifications exempt but use sparingly.
          </li>
          <li>
            <strong>Implement feedback handling:</strong> Process APNs feedback daily. Remove invalid tokens immediately. Handle FCM error responses (UNREGISTERED, INVALID_ARGUMENT). Web Push 410/404 means subscription expired.
          </li>
          <li>
            <strong>Use collapse IDs:</strong> For updatable notifications (live scores, stock prices), set collapse_id. Multiple notifications with same ID show as single, updated notification. Reduces notification clutter.
          </li>
          <li>
            <strong>Set appropriate TTL:</strong> Time-sensitive notifications: 1 hour TTL. Regular notifications: 24 hours TTL. Marketing: 1 hour TTL (don't deliver stale promotions). Expired notifications discarded, saving device resources.
          </li>
          <li>
            <strong>Localize notifications:</strong> Use localization keys instead of text. Single notification serves multiple languages. Client resolves based on device language. Reduces server complexity.
          </li>
          <li>
            <strong>Track engagement metrics:</strong> Open rate, click-through rate, dismiss rate by notification type. Identify low-engagement types, reduce frequency. A/B test notification copy, timing.
          </li>
          <li>
            <strong>Implement retry logic:</strong> Retry on 5xx errors with exponential backoff (1s, 2s, 4s, 8s, max 30s). Don't retry on 4xx errors (client errors). Log retry attempts for debugging.
          </li>
          <li>
            <strong>Secure push credentials:</strong> Store APNs private key, FCM service account, VAPID private key securely (secrets manager, not in code). Rotate credentials periodically. Monitor for unauthorized use.
          </li>
          <li>
            <strong>Test on real devices:</strong> Simulators don't fully replicate push behavior. Test on physical iOS and Android devices. Test background/foreground states. Test notification actions, deep links.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Not handling token refresh:</strong> iOS tokens change, old tokens stop working. Solution: Update token on refresh, keep old token valid during transition.
          </li>
          <li>
            <strong>Ignoring rate limits:</strong> Exceeding APNs limits results in throttling. Solution: Track send rates, queue excess, respect platform limits.
          </li>
          <li>
            <strong>No feedback handling:</strong> Sending to invalid tokens wastes quota. Solution: Process feedback daily, remove invalid tokens immediately.
          </li>
          <li>
            <strong>Wrong payload format:</strong> Platform-specific payload requirements. Solution: Validate payloads before sending, use platform SDKs.
          </li>
          <li>
            <strong>No retry logic:</strong> Transient failures cause lost notifications. Solution: Retry on 5xx with exponential backoff, don't retry on 4xx.
          </li>
          <li>
            <strong>Notification fatigue:</strong> Too many notifications, users disable. Solution: Rate limit per user, batch non-urgent, track engagement.
          </li>
          <li>
            <strong>Insecure credentials:</strong> Push credentials in code, exposed in repos. Solution: Use secrets manager, rotate credentials, monitor usage.
          </li>
          <li>
            <strong>No analytics:</strong> Can't optimize without data. Solution: Track delivery, open, click rates. Identify issues, optimize.
          </li>
          <li>
            <strong>Testing only on simulators:</strong> Simulators don't replicate real push behavior. Solution: Test on physical devices, all states (background, foreground, killed).
          </li>
          <li>
            <strong>Ignoring silent push limits:</strong> iOS limits silent pushes (~2-3/hour). Abuse results in throttling. Solution: Use silent push sparingly, for critical background updates only.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>WhatsApp Push Notifications</h3>
        <p>
          WhatsApp uses push for new message notifications. Silent push wakes app for background message sync. Rich notifications show sender name, message preview. Group messages collapsed by group. Call notifications use high priority. Delivery optimized for low bandwidth regions.
        </p>

        <h3 className="mt-6">Uber Ride Updates</h3>
        <p>
          Uber sends push for driver assigned, driver arrived, trip completed. Location-based triggers (driver nearby). High priority for time-sensitive updates. Collapsed notifications for driver location updates. Deep link to trip screen. SMS fallback for critical updates.
        </p>

        <h3 className="mt-6">Instagram Social Notifications</h3>
        <p>
          Instagram delivers likes, comments, follows, mentions via push. Rich notifications with profile pictures. Batched digests for high-volume users (&quot;John and 49 others liked your post&quot;). Story notifications with preview. Direct message notifications with message preview.
        </p>

        <h3 className="mt-6">Slack Team Notifications</h3>
        <p>
          Slack delivers @mentions, thread replies, channel messages. Per-channel notification settings. Quiet hours respected except for @here/@channel. Rich notifications with sender avatar, channel name. Deep link to message. Multi-device sync (mark read on one, clears on all).
        </p>

        <h3 className="mt-6">News App Breaking News</h3>
        <p>
          News apps send breaking news alerts with high priority. Standard news in daily digest. Rich notifications with article image. Category-based subscriptions (sports, politics, tech). A/B test notification copy for engagement. Analytics track open rates by category, time of day.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle iOS token refresh?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> iOS refreshes tokens periodically and on app reinstall. App receives new token via didRegisterForRemoteNotificationsWithDeviceToken delegate method. App sends new token to server. Server updates token mapping atomically—keep old token valid during transition (up to 24 hours). This prevents lost notifications during token transition. Log token changes for debugging.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle APNs rate limits?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> APNs limits ~2-3 non-urgent notifications per hour per device. Track send count per device in Redis: INCR device:token:sends:hour, EXPIRE after 1 hour. Check before sending. If over limit, queue notification for next hour. Urgent notifications (apns-priority: 10) have higher limits but use sparingly. Monitor 429 responses, backoff on rate limit.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you process APNs feedback?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Call APNs feedback API daily: GET to api.push.apple.com/3/feedback. Returns device tokens that are invalid (app uninstalled, device reset). For each token: delete from database, log invalidation, stop sending. Also check response codes on send—410 Gone means token invalid, remove immediately. Regular feedback processing prevents sending to invalid tokens.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement collapsed notifications?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Set collapse_id (iOS: apns-collapse-id header, Android: collapse_key). Multiple notifications with same collapse_id show as single notification, updated with latest content. Use for: live scores, stock prices, ongoing updates. When new notification arrives with same collapse_id, platform replaces old notification. Prevents notification spam for frequently updating content.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle multi-device users?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Store all device tokens per user. On notification, query all tokens for user_id. Send to all devices. Track which devices received, which failed. Handle device-specific preferences (user may disable push on tablet). Sync read state across devices—mark read on one, clear badge on all. Deduplicate notifications if user has multiple apps (phone + watch).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize push engagement?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Track open rate, click-through rate, dismiss rate per notification type. Identify low-engagement types, reduce frequency or improve copy. A/B test notification title, body, send time. Personalize based on user behavior (send when user typically active). Segment users by engagement level—high engagement gets more notifications. Respect user preferences, make opt-out easy.
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
              Apple Developer — User Notifications Documentation
            </a>
          </li>
          <li>
            <a
              href="https://developer.apple.com/documentation/usernotifications/sending-notification-requests-to-apns"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apple Developer — Sending Notification Requests to APNs
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
              href="https://developer.mozilla.org/en-US/docs/Web/API/Push_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — Push API Documentation
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/push-notifications-overview/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              web.dev — Push Notifications Overview
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
