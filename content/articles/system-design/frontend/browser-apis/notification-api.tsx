"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-notification-api",
  title: "Notification API",
  description:
    "Comprehensive guide to Notification API covering permission handling, notification display, engagement strategies, privacy considerations, and production-scale implementation patterns.",
  category: "frontend",
  subcategory: "browser-apis",
  slug: "notification-api",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-02",
  tags: [
    "frontend",
    "browser API",
    "notifications",
    "push",
    "engagement",
    "permission",
  ],
  relatedTopics: [
    "service-workers",
    "geolocation-api",
    "app-like-experience-pwa",
  ],
};

export default function NotificationAPIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Notification API</strong> enables web applications to display system-level notifications to users, even when the browser is not active. Combined with Service Workers and Push API, it enables push notifications for web apps — bringing users back to the app with timely messages, alerts, and updates. This API is essential for re-engaging users (bringing users back to app with notifications), delivering time-sensitive information (messages, alerts, reminders), and providing app-like experience in Progressive Web Apps (PWAs).
        </p>
        <p>
          For staff-level engineers, Notification API involves critical considerations around permission handling, timing strategies, user experience, and privacy. Notifications are powerful but intrusive — misuse leads to users disabling notifications or uninstalling the PWA entirely. Best practice is to request permission contextually (explain value before asking), respect user choice (never repeatedly request after denial), provide notification settings (let users choose what notifications they want), and avoid notification fatigue (use sparingly, provide value, respect user preferences).
        </p>
        <p>
          The Notification API has two main types: local notifications (triggered by the app directly, displayed while app is open) and push notifications (triggered by server via Service Worker, displayed even when app is closed). Local notifications are useful for reminding users about in-app events (e.g., &quot;Your download is ready&quot;, &quot;Your session will expire in 5 minutes&quot;). Push notifications are useful for re-engaging users when app is closed (e.g., new messages, breaking news, delivery updates).
        </p>
        <p>
          The business case for Notification API is user engagement and retention. Notifications bring users back to the app (re-engagement — users return to app when they see a notification), deliver time-sensitive information (messages, alerts, reminders — users get important information even when app is closed), and provide app-like experience (PWAs can notify users like native apps, closing the gap between web and native). However, notification fatigue is real — users disable notifications if abused (too many notifications, irrelevant notifications, notifications at wrong time). Use sparingly, provide value, respect user preferences.
        </p>
        <p>
          Notifications display differently on different platforms (desktop vs. mobile, different browsers, different operating systems). Desktop notifications appear in system notification center (macOS Notification Center, Windows Action Center, Linux notification daemon). Mobile notifications appear in system notification shade (Android notification shade, iOS Notification Center). Provide platform-specific icons, badges, and actions for best experience.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Permission:</strong> Call Notification.requestPermission() to request permission. Returns promise with &apos;granted&apos; (user granted permission), &apos;denied&apos; (user denied permission), or &apos;default&apos; (user dismissed prompt, not yet decided). Must request on user action (not page load — browsers may block permission requests that are not triggered by user action). Handle all cases gracefully: granted (enable notifications), denied (show how to enable in settings, offer alternative), default (user dismissed, ask later).
          </li>
          <li>
            <strong>Local Notifications:</strong> Displayed by app directly (new Notification(&apos;Title&apos;, options)). Options include body (message text), icon (app icon displayed with notification), badge (small icon displayed in status bar), tag (groups notifications with same tag, replaces previous notification with same tag), requireInteraction (notification stays until user dismisses, does not auto-dismiss), actions (array of action buttons displayed with notification). Local notifications are useful for in-app events (e.g., &quot;Your download is ready&quot;, &quot;Your session will expire in 5 minutes&quot;).
          </li>
          <li>
            <strong>Push Notifications:</strong> From server via Service Worker. Server sends push message via push service (Firebase Cloud Messaging, Apple Push Notification Service). Service Worker receives push event (even when app is closed), displays notification with self.registration.showNotification(title, options). Push notifications are useful for re-engaging users when app is closed (e.g., new messages, breaking news, delivery updates).
          </li>
          <li>
            <strong>Notification Actions:</strong> Actions are buttons displayed with notification (e.g., &quot;Reply&quot;, &quot;Mark as Read&quot;, &quot;Dismiss&quot;). When user clicks action, Service Worker receives notificationclick event with action identifier. Handle action appropriately (e.g., open reply UI, mark message as read, dismiss notification). Actions provide quick interaction with notification without opening app.
          </li>
          <li>
            <strong>Notification Events:</strong> onclick (user clicks notification — open app/page, navigate to relevant deep link), onclose (user dismisses notification — track dismissal for analytics), onerror (error occurred — log error, handle gracefully), onshow (notification displayed — track display for analytics). Handle click to open app/page with relevant deep link based on notification content.
          </li>
          <li>
            <strong>Notification Permissions:</strong> Users can manage notification permissions in browser/OS settings (browser settings, OS notification settings). Provide in-app settings to manage notification preferences (let users choose what notifications they want, e.g., messages, alerts, promotions). Respect user choice (do not send notifications that user has disabled in settings).
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/notification-permission-flow.svg"
          alt="Notification Permission Flow showing permission request, grant/deny handling, and notification display"
          caption="Notification permission flow — request on user action with explanation, handle grant/deny, display notifications only if granted"
          width={900}
          height={550}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Notification architecture consists of permission handling (request, handle grant/deny), notification creation (local or push), and notification handling (click, close, error). The architecture must handle permission states (granted, denied, default), notification display (local while app is open, push while app is closed), and user interaction (click to open app/page, action buttons for quick interaction).
        </p>
        <p>
          Local notifications are created by the app directly (new Notification(&apos;Title&apos;, options)). Push notifications are created by the server via Service Worker (server sends push message, Service Worker receives push event, displays notification). Local notifications are displayed while app is open (user is actively using app). Push notifications are displayed even when app is closed (user is notified even when not using app).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/notification-permission-flow.svg"
          alt="Notification Architecture showing local notifications, push notifications, and permission handling"
          caption="Notification architecture — local notifications (app displays while open), push notifications (server displays via Service Worker even when closed), permission handling (grant/deny)"
          width={900}
          height={500}
        />

        <h3>Permission Patterns</h3>
        <p>
          <strong>Request on User Action:</strong> Request permission when user clicks a notification-related feature (e.g., &quot;Enable Notifications&quot; button, &quot;Get notified about messages&quot; toggle). Advantages: user understands why notifications are needed (higher grant rate), user is more likely to grant permission (because they requested it). Limitations: cannot show notifications until user grants permission. Best for: most applications (explain value before asking).
        </p>
        <p>
          <strong>Explain Value Before Request:</strong> Show a message explaining why notifications are useful before requesting permission (e.g., &quot;Get notified about new messages, alerts, and updates&quot;). Advantages: user understands value (higher grant rate), user is more likely to grant permission. Limitations: adds extra step before permission request. Best for: most applications (increases grant rate by explaining value).
        </p>
        <p>
          <strong>Handle Denial Gracefully:</strong> When user denies permission, show how to enable in settings (e.g., &quot;Go to browser settings and enable notifications for this site&quot;). Offer alternative (e.g., email notifications, in-app notifications). Never repeatedly request after denial (browser does not show permission prompt again after denial). Best for: all applications (respect user choice, provide alternative).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/notification-use-cases.svg"
          alt="Notification Use Cases showing messages, alerts, reminders, and re-engagement"
          caption="Notification use cases — messages (new messages, replies), alerts (breaking news, delivery updates), reminders (session expiry, scheduled events), re-engagement (bring users back to app)"
          width={900}
          height={500}
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Notification API involves trade-offs between engagement, intrusiveness, permission rates, and platform differences. Understanding these trade-offs is essential for making informed decisions about when to use notifications and how to use them effectively.
        </p>

        <h3>Local vs. Push Notifications</h3>
        <p>
          <strong>Local Notifications:</strong> Displayed by app directly (new Notification). Advantages: simple (no server, no Service Worker required), works while app is open (user is actively using app), full control over timing and content. Limitations: only works while app is open (user must be actively using app), no re-engagement when app is closed. Best for: in-app events (download ready, session expiring, form submitted).
        </p>
        <p>
          <strong>Push Notifications:</strong> From server via Service Worker. Advantages: works when app is closed (user is notified even when not using app), re-engages users (brings users back to app), server controls timing and content (can send notifications based on server events). Limitations: complex (requires server, Service Worker, push service), requires user permission (permission rate affects reach). Best for: re-engagement (new messages, breaking news, delivery updates).
        </p>

        <h3>Notification Frequency Trade-offs</h3>
        <p>
          <strong>High Frequency:</strong> Many notifications (e.g., every new message, every alert, every update). Advantages: users get all information (no missed notifications). Limitations: notification fatigue (users disable notifications if abused), annoyance (users find frequent notifications intrusive). Best for: critical notifications (security alerts, delivery updates) where users expect every notification.
        </p>
        <p>
          <strong>Low Frequency:</strong> Few notifications (e.g., daily digest, weekly summary, critical alerts only). Advantages: no notification fatigue (users are not overwhelmed), higher engagement (users pay attention to notifications because they are rare). Limitations: users may miss information (not all notifications are sent). Best for: non-critical notifications (promotions, updates) where users do not expect every notification.
        </p>
        <p>
          <strong>Grouped Notifications:</strong> Group related notifications (e.g., group messages from same conversation, group alerts from same category). Advantages: fewer notifications (users see one notification instead of many), easier to digest (users see grouped content instead of individual notifications). Limitations: users may miss individual notifications (grouped notifications may hide important details). Best for: related notifications (messages from same conversation, alerts from same category).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/notification-use-cases.svg"
          alt="Notification Trade-offs showing local vs push, high vs low frequency, grouped vs individual"
          caption="Notification trade-offs — local (simple, app-only) vs push (complex, works when closed), high frequency (all info) vs low frequency (no fatigue), grouped (fewer notifications) vs individual (all details)"
          width={900}
          height={500}
        />
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Request Permission Contextually:</strong> Request permission when user clicks a notification-related feature (not on page load). Explain value before requesting (e.g., &quot;Get notified about new messages, alerts, and updates&quot;). This increases the grant rate (users understand why notifications are needed, are more likely to grant permission). Never request permission on page load (users deny without context, browser does not show prompt again after denial).
          </li>
          <li>
            <strong>Provide Notification Settings:</strong> Provide in-app settings to manage notification preferences (let users choose what notifications they want, e.g., messages, alerts, promotions). Respect user choice (do not send notifications that user has disabled in settings). This pattern ensures that users get notifications they want (not notifications they do not want), reducing notification fatigue and increasing engagement.
          </li>
          <li>
            <strong>Group Related Notifications:</strong> Group notifications with same tag, such as grouping messages from the same conversation or alerts from the same category. Use the tag option to group notifications so that when a new notification is displayed with the same tag, it replaces the previous notification. This pattern reduces notification fatigue while still providing all information.
          </li>
          <li>
            <strong>Respect Quiet Hours:</strong> Do not send notifications during quiet hours (e.g., 10 PM to 8 AM, user&apos;s local time). Use user&apos;s timezone to determine quiet hours. Queue notifications during quiet hours, send when quiet hours end. This pattern ensures that users are not disturbed during sleep or quiet time (users may disable notifications if disturbed during quiet hours).
          </li>
          <li>
            <strong>Provide Value:</strong> Only notify for important, time-sensitive information (messages, alerts, reminders). Do not notify for non-essential information (promotions, updates, marketing). This pattern ensures that users pay attention to notifications (notifications are important, users do not ignore them). Notification fatigue is real — users disable notifications if abused.
          </li>
          <li>
            <strong>Handle Click and Actions:</strong> When user clicks notification, open app/page with relevant deep link (e.g., open conversation for message notification, open order for delivery notification). When user clicks action button, handle action appropriately (e.g., reply to message, mark as read, dismiss). This pattern ensures that notifications are actionable (users can take action from notification, not just view it).
          </li>
        </ul>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Requesting on Page Load:</strong> Requesting permission on page load causes users to deny without context (lower grant rate). After denial, browser does not show permission prompt again (user must manually enable notifications in settings). Always request permission on user action with explanation (e.g., &quot;Get notified about new messages, alerts, and updates&quot;). This increases the grant rate and provides a better user experience.
          </li>
          <li>
            <strong>Spamming Notifications:</strong> Sending too many notifications causes notification fatigue (users disable notifications, uninstall PWA). Use sparingly, provide value, respect user preferences. Group related notifications (use tag option), respect quiet hours (do not send during sleep time), provide notification settings (let users choose what notifications they want). This pattern ensures that users are not overwhelmed by notifications.
          </li>
          <li>
            <strong>No Notification Settings:</strong> Not providing notification settings causes frustration (users cannot choose what notifications they want, receive notifications they do not want). Provide in-app settings to manage notification preferences (let users choose what notifications they want). Respect user choice (do not send notifications that user has disabled in settings). This pattern ensures that users get notifications they want, not notifications they do not want.
          </li>
          <li>
            <strong>Ignoring Permission Denial:</strong> Not handling permission denial gracefully causes frustration (user denies permission, app does not explain how to enable, does not offer alternative). Show how to enable in settings (e.g., &quot;Go to browser settings and enable notifications for this site&quot;). Offer alternative (e.g., email notifications, in-app notifications). Never repeatedly request after denial (browser does not show permission prompt again after denial).
          </li>
          <li>
            <strong>No Deep Link:</strong> Not providing deep link when user clicks notification causes poor user experience (user clicks notification, app opens to home page instead of relevant content). Open app/page with relevant deep link (e.g., open conversation for message notification, open order for delivery notification). This pattern ensures that users get to relevant content when they click notification.
          </li>
          <li>
            <strong>Not Handling Platform Differences:</strong> Not handling platform differences (desktop vs. mobile, different browsers, different operating systems) causes poor user experience (notifications display differently on different platforms, actions may not work on some platforms). Test on all target platforms (desktop, mobile, different browsers, different operating systems). Provide platform-specific icons, badges, and actions for best experience.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Messaging Apps</h3>
        <p>
          Messaging apps (Slack, WhatsApp Web, Discord) use push notifications for new messages. User receives message (server sends push message to Service Worker). Service Worker displays notification (new message from conversation, with message preview, icon, actions). User clicks notification, app opens to conversation (deep link to conversation). User clicks action (e.g., &quot;Reply&quot;), app opens reply UI. This pattern enables real-time messaging (users get messages even when app is closed, can reply from notification).
        </p>

        <h3>News Apps</h3>
        <p>
          News apps (Washington Post, New York Times, CNN) use push notifications for breaking news. Editor publishes breaking news (server sends push message to all subscribed users). Service Worker displays notification (breaking news headline, icon, actions). User clicks notification, app opens to article (deep link to article). This pattern enables timely news delivery (users get breaking news even when app is closed, can read article from notification). Respect quiet hours (do not send breaking news during sleep time, unless critical).
        </p>

        <h3>Delivery Apps</h3>
        <p>
          Delivery apps (Uber Eats, DoorDash, Amazon) use push notifications for delivery updates. Driver picks up order (server sends push message: &quot;Your order has been picked up&quot;). Driver arrives (server sends push message: &quot;Your order has arrived&quot;). Service Worker displays notification (delivery update, icon, actions). User clicks notification, app opens to order tracking (deep link to order). This pattern enables real-time delivery tracking (users get delivery updates even when app is closed, can track order from notification).
        </p>

        <h3>Productivity Apps</h3>
        <p>
          Productivity apps (Google Calendar, Todoist, Trello) use push notifications for reminders and updates. Calendar reminder (server sends push message: &quot;Meeting in 15 minutes&quot;). Task update (server sends push message: &quot;Task assigned to you&quot;). Service Worker displays notification (reminder, update, icon, actions). User clicks notification, app opens to relevant content (deep link to calendar event, task, board). This pattern enables timely reminders (users get reminders even when app is closed, can take action from notification).
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you request notification permission?
            </p>
            <p className="mt-2 text-sm">
              A: Call Notification.requestPermission() on user action, not on page load. Returns a promise with granted, denied, or default. Handle each case: granted means enable notifications and store permission in state. Denied means show how to enable in settings and offer alternative such as email or in-app notifications. Default means user dismissed the prompt, so ask later when user interacts with notification-related features. Never repeatedly request after denial since the browser does not show the permission prompt again.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do push notifications work with Service Workers?
            </p>
            <p className="mt-2 text-sm">
              A: User subscribes to push notifications through the pushManager subscribe method, which requires user permission and returns a subscription object with endpoint and keys. Send the subscription to the server for storage. The server sends push messages via a push service such as Firebase Cloud Messaging or Apple Push Notification Service. The Service Worker receives the push event even when the app is closed, and displays a notification with title, body, icon, badge, and actions. When the user clicks the notification, the Service Worker receives a notificationclick event and opens the app or page with the relevant deep link. This pattern enables re-engagement.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle notification clicks?
            </p>
            <p className="mt-2 text-sm">
              A: Listen to notification click event. For local notifications, set the onclick handler on the notification object to focus the window and navigate to relevant content. For push notifications, in the Service Worker listen to the notificationclick event, close the notification, and open the app or page with the relevant deep link. Open the app or page with relevant deep link based on notification content, such as opening a conversation for a message notification or opening an order for a delivery notification. Close the notification after click to dismiss it. This pattern ensures that notifications are actionable.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you avoid notification fatigue?
            </p>
            <p className="mt-2 text-sm">
              A: Best practices: (1) Request permission contextually — explain value before asking (e.g., &quot;Get notified about new messages, alerts, and updates&quot;). (2) Provide notification settings — let users choose what notifications they want (messages, alerts, promotions, etc.). (3) Group related notifications — use tag option to group notifications with same tag (e.g., group messages from same conversation, group alerts from same category). (4) Respect quiet hours — do not send notifications during sleep time (10 PM to 8 AM, user&apos;s local time). (5) Provide value — only notify for important, time-sensitive information (messages, alerts, reminders), not non-essential information (promotions, updates, marketing). Notification fatigue is real — users disable notifications if abused (too many notifications, irrelevant notifications, notifications at wrong time).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle browser support for Notification API?
            </p>
            <p className="mt-2 text-sm">
              A: Notification API is supported in all modern browsers including Chrome, Firefox, Edge, and Safari. Check for support by testing whether Notification exists in the window object. If not supported, use fallback approaches such as email notifications or in-app notifications. Push notifications require Service Worker and Push API support, which is not available in all browsers since Safari has limited push support. For push notifications, check for both serviceWorker in navigator and PushManager in window. This pattern ensures that notifications work on all browsers.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you track notification engagement?
            </p>
            <p className="mt-2 text-sm">
              A: Track notification display (onshow event — notification displayed, send analytics event). Track notification click (onclick event — user clicks notification, send analytics event). Track notification dismissal (onclose event — user dismisses notification, send analytics event). Track notification action (notificationclick event with action identifier — user clicks action, send analytics event with action). Calculate engagement metrics (click-through rate: clicks / displays, dismissal rate: dismissals / displays, action rate: actions / displays). Use engagement metrics to optimize notification strategy (send more notifications with high engagement, fewer notifications with low engagement, group related notifications, respect quiet hours). This pattern enables data-driven notification strategy (optimize notifications based on user engagement).
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN — Notifications API
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/push-notifications/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Web.dev — Push Notifications Guide
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Push_API"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN — Push API
            </a>
          </li>
          <li>
            <a
              href="https://caniuse.com/notifications"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Can I Use — Notifications Browser Support
            </a>
          </li>
          <li>
            <a
              href="https://developer.chrome.com/docs/devtools/progressive-web-apps/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Chrome — Progressive Web Apps (Notifications)
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );

}
