"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "real-time-notifications",
  title: "Real-time Notifications",
  description:
    "Comprehensive guide to real-time notification systems — covering push delivery mechanisms, notification channels (in-app, push, email), priority and batching strategies, read state management, and frontend rendering patterns for notification feeds.",
  category: "frontend",
  subcategory: "real-time-features",
  slug: "real-time-notifications",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-04-01",
  tags: [
    "notifications",
    "push-notifications",
    "real-time",
    "in-app-notifications",
    "service-worker",
    "toast",
  ],
  relatedTopics: [
    "server-sent-events",
    "websockets",
    "presence-systems",
  ],
};

export default function RealTimeNotificationsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition &amp; Context</h2>
        <p className="mb-4">
          <strong>Real-time notifications</strong> are system-generated messages
          delivered to users with minimal latency to inform them about events
          that require their attention — new messages, mentions, status changes,
          system alerts, or actions taken by other users. In the frontend
          context, real-time notifications encompass the complete pipeline from
          event generation through delivery channel selection, client-side
          receipt, rendering, interaction handling, and read-state
          synchronization. They are the primary mechanism through which
          applications create urgency, re-engage users, and surface actionable
          information without requiring users to actively check for updates.
        </p>
        <p className="mb-4">
          The notification landscape spans multiple delivery channels, each
          with different reach, urgency, and intrusiveness characteristics.{" "}
          <strong>In-app notifications</strong> appear within the application UI
          — badge counts, toast messages, notification drawers — and require the
          user to have the application open.{" "}
          <strong>Web push notifications</strong> use the Push API and Service
          Workers to deliver messages to the user&apos;s device even when the
          browser tab is closed, appearing as native OS notifications.{" "}
          <strong>Email notifications</strong> serve as a durable, asynchronous
          fallback for users who are not actively using the application. A
          well-designed notification system orchestrates across these channels
          based on the notification&apos;s priority, the user&apos;s current
          engagement state (are they active in the app right now?), and their
          notification preferences.
        </p>
        <p className="mb-4">
          From a systems design perspective, real-time notifications are
          challenging because they sit at the intersection of several complex
          domains: real-time delivery (getting the notification to the client
          within seconds), personalization (determining which notifications are
          relevant to each user), deduplication and batching (preventing
          notification fatigue from rapid-fire events), read-state management
          (tracking which notifications have been seen across devices), and
          preference management (respecting user choices about what to receive
          and how). Each of these domains introduces its own scaling
          challenges — a social platform generating millions of events per
          second must efficiently determine which of its hundreds of millions
          of users should receive each notification, through which channel,
          and with what content.
        </p>
        <p>
          For staff and principal engineers, notification system design reveals
          deep architectural thinking. The event-driven nature of notifications
          aligns naturally with event sourcing and CQRS patterns. The
          multi-channel delivery requirement introduces a channel orchestration
          layer with fallback logic. The user preference system is a product
          surface that directly impacts engagement metrics and must be
          designed with both user respect and business goals in mind.
          Notification abuse (sending too many, too often, or too irrelevantly)
          is one of the fastest ways to drive users to disable notifications
          entirely or uninstall an application, making notification governance
          a first-class architectural concern.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/real-time-features/real-time-notifications-diagram-1.svg"
        alt="Notification system architecture showing event generation, routing, channel selection, and multi-channel delivery to in-app, push, and email"
        caption="Figure 1: End-to-end notification system architecture"
      />

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          In-App Notification Delivery
        </h3>
        <p className="mb-4">
          In-app notifications are delivered via WebSocket or SSE connections
          to the active browser session. When the server generates a
          notification, it publishes the event to a message broker, which
          routes it to the WebSocket/SSE gateway server holding the
          recipient&apos;s connection. The client receives the notification
          payload (type, title, body, action URL, sender information, timestamp)
          and updates the notification state. Common UI patterns include: a
          badge count on the bell icon (incrementing unread count without
          showing full content), a toast notification (a temporary overlay
          with the notification preview and dismiss/action buttons), and a
          notification drawer or feed (a scrollable list of all recent
          notifications with read/unread state). The choice of pattern depends
          on the notification&apos;s urgency — toasts for high-priority items
          that need immediate attention, badge-only for low-priority items.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Web Push Notifications
        </h3>
        <p className="mb-4">
          The Web Push API (RFC 8030) enables servers to send notifications
          to users even when they do not have the application open. The flow
          involves three components: the application server, a push service
          (operated by the browser vendor — Firebase Cloud Messaging for
          Chrome, Mozilla Push Service for Firefox, APNs for Safari), and the
          Service Worker on the client. During setup, the client requests
          permission, subscribes to the push service (receiving an endpoint
          URL and encryption keys), and sends the subscription to the
          application server. To send a notification, the server encrypts the
          payload using the subscription&apos;s public key (VAPID
          authentication) and POSTs it to the push service endpoint. The push
          service delivers it to the client&apos;s Service Worker, which
          displays it using the Notification API. Web push notifications
          bypass the browser tab entirely — they appear as native OS
          notifications and can re-engage users who have navigated away.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Priority, Batching, and Deduplication
        </h3>
        <p className="mb-4">
          Notification fatigue is the primary enemy of engagement. When a
          user receives 50 notifications in an hour, they stop reading any
          of them. Effective notification systems implement several
          countermeasures: <strong>priority classification</strong> (urgent,
          high, medium, low) determines the delivery channel and timing —
          urgent notifications send an immediate push, low-priority ones
          appear only in the notification feed. <strong>Batching</strong>{" "}
          groups related notifications — instead of five separate
          &quot;liked your post&quot; notifications, a single &quot;Alice and
          4 others liked your post&quot; notification is sent.{" "}
          <strong>Deduplication</strong> prevents repeat notifications for the
          same event — editing a comment should not re-trigger a notification
          that was already sent for the initial comment.{" "}
          <strong>Rate limiting</strong> caps the total notifications per user
          per time window, dropping or batching low-priority items when the
          budget is exhausted. These mechanisms work together to ensure that
          each notification the user sees is genuinely valuable.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Read State and Cross-Device Synchronization
        </h3>
        <p className="mb-4">
          Notification read state must be consistent across all of a
          user&apos;s devices. When a user reads a notification on their
          phone, the badge count on their laptop should update immediately.
          This requires a centralized read-state store (typically a database
          or Redis) that records which notifications have been seen, read,
          or interacted with. The client reports read events (marking
          individual notifications or &quot;mark all as read&quot;), and
          the server broadcasts the state change to other active sessions.
          The unread count is derived from the read-state store, not
          maintained as a separate counter — this prevents count drift caused
          by race conditions between notification delivery and read events.
          For efficiency, the read-state can be implemented as a
          high-water mark (all notifications before timestamp X are read)
          combined with individual read records for notifications after the
          mark.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Notification Preferences
        </h3>
        <p className="mb-4">
          User preferences control which notifications they receive and through
          which channels. A typical preference model has two dimensions:
          notification type (mentions, replies, likes, system alerts) and
          channel (in-app, push, email). Users can configure each combination
          independently — for example, receiving mention notifications via push
          but like notifications only in-app. Preferences also include quiet
          hours (no push notifications between 10pm and 8am), frequency caps
          (maximum one email digest per day), and global toggles (pause all
          notifications). The preference system must be evaluated in the
          notification pipeline before delivery — the channel orchestrator
          checks user preferences and suppresses or reroutes notifications
          accordingly. Defaults should be carefully designed to balance
          engagement with user respect.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture &amp; Flow</h2>
        <p className="mb-4">
          A production notification system is an event-driven pipeline with
          distinct stages: event ingestion, notification generation, channel
          routing, delivery, and read-state tracking. Each stage is
          independently scalable and failure-isolated.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/real-time-features/real-time-notifications-diagram-2.svg"
          alt="Notification pipeline showing event ingestion, template rendering, preference filtering, channel routing, and delivery with read-state sync"
          caption="Figure 2: Notification processing pipeline from event to delivery"
        />

        <p className="mb-4">
          Events enter the pipeline from application services (user actions,
          system events, scheduled triggers) via a message queue. The
          notification generator determines which users should be notified,
          generates notification content from templates (with localization),
          and applies batching and deduplication rules. The channel router
          evaluates each notification against user preferences and engagement
          state: if the user is currently active in-app, deliver via
          WebSocket; if the user is inactive but has push enabled, send a
          web push; if neither, queue for email digest. The delivery layer
          handles the mechanics of each channel — WebSocket fanout, push
          service API calls, email queue management. Read-state events flow
          back from clients to the centralized store, and state changes are
          broadcast to all active sessions via WebSocket.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparisons
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">
          Trade-offs &amp; Comparisons
        </h2>
        <p className="mb-4">
          Each notification delivery channel has distinct characteristics that
          make it suitable for different scenarios. The following comparison
          helps architects choose the right channel mix.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-theme text-sm">
            <thead>
              <tr className="bg-panel">
                <th className="border border-theme px-4 py-2 text-left">
                  Channel
                </th>
                <th className="border border-theme px-4 py-2 text-left">
                  Latency
                </th>
                <th className="border border-theme px-4 py-2 text-left">
                  Reach
                </th>
                <th className="border border-theme px-4 py-2 text-left">
                  Best For
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-theme px-4 py-2 font-medium">
                  In-app (WebSocket/SSE)
                </td>
                <td className="border border-theme px-4 py-2">
                  Sub-second
                </td>
                <td className="border border-theme px-4 py-2">
                  Only active users with app open
                </td>
                <td className="border border-theme px-4 py-2">
                  Chat messages, live updates, typing indicators
                </td>
              </tr>
              <tr>
                <td className="border border-theme px-4 py-2 font-medium">
                  Web Push
                </td>
                <td className="border border-theme px-4 py-2">
                  1-5 seconds
                </td>
                <td className="border border-theme px-4 py-2">
                  Users with permission granted, even with tab closed
                </td>
                <td className="border border-theme px-4 py-2">
                  Mentions, DMs, urgent alerts, re-engagement
                </td>
              </tr>
              <tr>
                <td className="border border-theme px-4 py-2 font-medium">
                  Email
                </td>
                <td className="border border-theme px-4 py-2">
                  Minutes to hours (batched)
                </td>
                <td className="border border-theme px-4 py-2">
                  All users with email address
                </td>
                <td className="border border-theme px-4 py-2">
                  Digests, receipts, inactive user re-engagement
                </td>
              </tr>
              <tr>
                <td className="border border-theme px-4 py-2 font-medium">
                  Toast (ephemeral UI)
                </td>
                <td className="border border-theme px-4 py-2">
                  Instant (client-side)
                </td>
                <td className="border border-theme px-4 py-2">
                  Currently focused tab only
                </td>
                <td className="border border-theme px-4 py-2">
                  Success/error feedback, transient alerts
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            Implement channel orchestration that adapts to user engagement
            state — if the user is active in-app, suppress push notifications
            and deliver in-app only; if inactive for more than 5 minutes,
            escalate to push; if inactive for hours, batch into email digest
          </li>
          <li>
            Batch related notifications aggressively — &quot;Alice, Bob, and 3
            others liked your post&quot; is one notification, not five.
            Implement a batching window (30 seconds to 2 minutes) where related
            events are grouped before delivery
          </li>
          <li>
            Use a high-water mark plus individual reads for efficient read-state
            management — &quot;mark all as read&quot; sets the high-water mark
            to the current timestamp, and only notifications after the mark
            need individual read tracking
          </li>
          <li>
            Design notification payloads to be self-contained: include enough
            context (sender name, content preview, action URL) that the user
            can understand and act on the notification without opening the
            full application
          </li>
          <li>
            Implement notification deduplication using idempotency keys — if
            the same event generates a notification multiple times (due to
            retries or race conditions), only the first delivery succeeds
          </li>
          <li>
            Request push notification permission contextually, not on first
            visit — ask when the user performs an action that would benefit
            from notifications (e.g., subscribing to a thread). Show a
            pre-permission prompt explaining the value before triggering the
            browser&apos;s permission dialog
          </li>
          <li>
            Implement quiet hours and rate limits as server-side controls, not
            client-side filters — this prevents notification delivery
            overhead and respects the user&apos;s intent regardless of which
            device they are using
          </li>
          <li>
            Use optimistic unread count updates on the client: immediately
            decrement the count when the user opens a notification, without
            waiting for server confirmation. Reconcile periodically with the
            server to correct any drift
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Notification overload</strong> — sending too many
            notifications trains users to ignore all of them. A single
            high-signal notification is worth more than ten low-signal ones.
            Audit notification volume per user and implement budgets
          </li>
          <li>
            <strong>Requesting push permission immediately</strong> — asking
            for notification permission on the first page load, before the user
            has any context, results in high denial rates and burns the
            permission permanently
          </li>
          <li>
            <strong>Unread count drift</strong> — maintaining the unread count
            as a separate counter that increments on notification creation and
            decrements on read leads to drift from race conditions. Derive the
            count from the notification list with read state applied
          </li>
          <li>
            <strong>Duplicate notifications across channels</strong> — sending
            both a push notification and an in-app notification for the same
            event when the user has the app open. The channel orchestrator
            must suppress duplicate delivery based on engagement state
          </li>
          <li>
            <strong>No batching for burst events</strong> — a viral post
            generating 500 likes in a minute should produce one batched
            notification, not 500 individual ones. Without batching, the
            notification feed becomes unusable
          </li>
          <li>
            <strong>Stale notification actions</strong> — a notification with
            an &quot;Accept Invitation&quot; action that points to an
            invitation that has already been accepted or expired. Validate
            the action target on click and show appropriate feedback if the
            action is no longer available
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Facebook: Notification Infrastructure at Billions Scale
        </h3>
        <p className="mb-4">
          Facebook&apos;s notification system processes billions of events per
          day across its family of apps. Their architecture uses a centralized
          notification service that receives events from hundreds of
          microservices, applies a sophisticated relevance model (ML-based
          scoring that predicts whether the user will engage with the
          notification), and routes through a channel orchestrator. Their
          batching system groups social interactions (likes, comments, shares)
          using configurable windows that adapt to event velocity — popular
          posts batch at larger windows to avoid notification storms.
          Facebook pioneered the &quot;notification importance score&quot;
          concept: each notification receives a predicted engagement score, and
          only notifications above the user&apos;s personalized threshold are
          promoted to push. This ML-driven approach dramatically reduced
          notification fatigue while maintaining engagement, and has become the
          industry standard for high-volume notification systems.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Linear: Developer-Focused Notification Design
        </h3>
        <p className="mb-4">
          Linear&apos;s issue tracker demonstrates a minimalist approach to
          notifications optimized for developer workflow. Their notification
          system focuses on signal over volume: users only receive
          notifications for issues they are assigned to, mentioned in, or
          subscribed to — never for general workspace activity. Their in-app
          notification inbox treats each notification as an actionable item
          with keyboard shortcuts for triage (archive, snooze, mark as read).
          Linear&apos;s real-time delivery uses a WebSocket connection that
          pushes notification events as they occur, updating the inbox badge
          count and optionally showing a toast for high-priority items. Their
          email channel sends a single daily digest of unread notifications
          rather than individual emails, respecting developers&apos;
          preference for focused work periods.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          GitHub: Activity-Centric Notification Streams
        </h3>
        <p className="mb-4">
          GitHub&apos;s notification system manages the intersection of code
          review, issue tracking, CI/CD status, and security alerts across
          millions of repositories. Their system allows fine-grained
          subscription control: users can watch, unwatch, or set custom
          notification levels per repository, and can subscribe to individual
          issues or PRs. GitHub&apos;s notification inbox groups related
          notifications by thread (an issue or PR), showing the latest
          activity and allowing bulk actions. Their filtering system uses
          labels, notification reason (assigned, mentioned, review requested,
          subscribed), and repository to enable users to triage efficiently.
          GitHub&apos;s delivery prioritizes in-app and email (with rich
          markdown rendering), using web push as an optional enhancement.
          Their API also supports custom notification routing through webhooks,
          enabling integrations with Slack, Discord, and custom tooling.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/real-time-features/real-time-notifications-diagram-3.svg"
          alt="Notification channel orchestration showing engagement state detection and intelligent routing between in-app, push, and email channels"
          caption="Figure 3: Intelligent notification channel orchestration"
        />
      </section>

      {/* ============================================================
          SECTION 8: Common Interview Questions
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Interview Questions</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you design a real-time notification system for a
              social media platform with 100 million users?
            </p>
            <p className="mt-2 text-sm">
              Event-driven pipeline: application events flow to a message queue
              (Kafka). A notification generator consumes events, determines
              recipients using fan-out logic (e.g., all followers of the poster),
              and applies batching/deduplication. A channel router checks user
              preferences and engagement state to select delivery channels.
              In-app delivery via WebSocket through gateway servers backed by
              Redis Pub/Sub. Push delivery via Firebase Cloud Messaging/APNs.
              Email delivery via an email service with digest batching.
              Read-state stored in a dedicated datastore with cross-device sync
              via WebSocket events.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you prevent notification fatigue while maintaining
              user engagement?
            </p>
            <p className="mt-2 text-sm">
              Multiple strategies: batch related notifications (group likes,
              comments on the same post), implement per-user rate limits (max
              N push notifications per hour), use relevance scoring (ML model
              predicting engagement probability), respect quiet hours, and
              provide granular preference controls. Monitor opt-out rates and
              notification-to-action ratios as key metrics. If a notification
              type has a low action rate, either improve its relevance or reduce
              its frequency. Design notifications to be valuable — every
              notification should answer &quot;why should I care right now?&quot;
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does the Web Push API work, and what are its limitations?
            </p>
            <p className="mt-2 text-sm">
              The client registers a Service Worker, subscribes to the push
              service (receiving an endpoint URL and encryption keys), and sends
              the subscription to the server. The server encrypts payloads with
              the subscription&apos;s public key and POSTs to the push service
              endpoint with VAPID authentication. The push service delivers to
              the Service Worker, which shows the notification. Limitations:
              requires user permission (and browsers limit re-prompting),
              payload size limit (~4KB), no guaranteed delivery order, varying
              latency across push services, and Safari requires separate Apple
              Push implementation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement cross-device read-state synchronization?
            </p>
            <p className="mt-2 text-sm">
              Store read state centrally (database or Redis) with a high-water
              mark (timestamp below which all notifications are read) plus
              individual read records for recent notifications. When a user
              reads a notification on device A, update the central store and
              broadcast the read event via WebSocket to all other active
              sessions. Derive the unread count from the read-state store on
              each session, not from a separate counter. For &quot;mark all as
              read,&quot; update the high-water mark and broadcast. Reconcile
              counts periodically to handle any drift from missed events.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How should a notification system handle a viral event that
              generates millions of notifications simultaneously?
            </p>
            <p className="mt-2 text-sm">
              Implement multi-level batching with adaptive windows. When event
              velocity exceeds a threshold for a specific target (e.g., a
              post), increase the batching window dynamically. Use a
              &quot;celebrity problem&quot; pattern: defer fan-out for users
              with massive follower counts and generate notifications lazily
              when subscribers next check their feeds rather than pushing
              eagerly. Apply per-recipient rate limits to cap total notification
              volume. Queue notifications in a back-pressure-aware message
              broker (Kafka with consumer group scaling) to absorb bursts
              without dropping events.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References & Further Reading
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">
          References &amp; Further Reading
        </h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://datatracker.ietf.org/doc/html/rfc8030"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Web Push Protocol (RFC 8030) — IETF specification for push
              message delivery
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Push_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN Web Docs — Push API and Notifications API reference
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/engineering/blog/2018/03/scaling-notifications-at-linkedin"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Scaling Notifications at LinkedIn&quot; — LinkedIn
              Engineering Blog
            </a>
          </li>
          <li>
            <a
              href="https://www.facebook.com/engineering/articles/building-facebooks-notification-system/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Building Facebook&apos;s Notification System&quot; —
              Facebook Engineering Blog
            </a>
          </li>
          <li>
            <a
              href="https://www.nngroup.com/articles/notification-fatigue/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Notification Fatigue: How to Avoid It&quot; — Nielsen Norman
              Group UX research
            </a>
          </li>
          <li>
            <a
              href="https://github.com/donnemartin/system-design-primer"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Designing Notification Systems&quot; — System Design Primer
              case study
            </a>
          </li>
          <li>
            <a
              href="https://github.com/web-push-libs/web-push"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              web-push library documentation — Node.js library for VAPID-based
              web push
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
