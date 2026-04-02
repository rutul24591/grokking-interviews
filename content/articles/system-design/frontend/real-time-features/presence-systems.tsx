"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "presence-systems",
  title: "Presence Systems",
  description:
    "Comprehensive guide to real-time presence systems — covering online/offline detection, typing indicators, active user tracking, heartbeat protocols, distributed presence propagation, and frontend state management patterns for presence data.",
  category: "frontend",
  subcategory: "real-time-features",
  slug: "presence-systems",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-04-01",
  tags: [
    "presence",
    "online-status",
    "typing-indicators",
    "heartbeat",
    "real-time",
    "distributed-systems",
  ],
  relatedTopics: [
    "websockets",
    "server-sent-events",
    "real-time-notifications",
  ],
};

export default function PresenceSystemsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition &amp; Context</h2>
        <p className="mb-4">
          <strong>Presence systems</strong> track and broadcast the real-time
          status of users within an application — whether they are online,
          offline, idle, away, in a meeting, or actively engaged in a specific
          activity like typing a message or viewing a document. Presence is
          the invisible layer that transforms static applications into living,
          social experiences. When you see the green dot next to a
          colleague&apos;s name in Slack, the &quot;3 people viewing&quot;
          indicator in Google Docs, or the &quot;typing...&quot; bubble in
          iMessage, you are consuming presence data. These seemingly simple
          indicators have a profound impact on user behavior: they influence
          when people choose to send messages (preferring to reach someone who
          is online), create a sense of shared space in remote collaboration,
          and reduce the uncertainty of asynchronous communication.
        </p>
        <p className="mb-4">
          From a systems design perspective, presence is deceptively complex.
          The fundamental challenge is that presence is inherently distributed
          and ephemeral: a user might have multiple devices (phone, laptop,
          tablet) each with different connectivity states, and the transition
          from &quot;online&quot; to &quot;offline&quot; is ambiguous — a
          closed laptop could mean the user stepped away for 30 seconds or left
          for the day. Presence systems must make these determinations using
          imperfect signals (heartbeats, connection state, activity events)
          while minimizing both false positives (showing someone as online when
          they are not) and false negatives (showing someone as offline when
          they are actively using the app on another device).
        </p>
        <p className="mb-4">
          The scale challenge compounds the technical difficulty. A messaging
          application with 10 million online users generates presence updates
          at enormous volume: each heartbeat from each user produces an event
          that must be processed, and each status change must be propagated to
          potentially thousands of subscribers (friends, channel members, team
          members). Naive implementations where every user broadcasts their
          status to all subscribers create an O(N²) fanout problem that
          overwhelms even large server fleets. Production presence systems
          solve this through hierarchical aggregation, interest-based
          subscription, lazy evaluation (only computing presence for users
          whose status is being viewed), and tiered propagation that prioritizes
          updates for actively visible contacts.
        </p>
        <p>
          For staff and principal engineers, designing a presence system is a
          classic distributed systems problem that touches on consistency
          models (eventual consistency is acceptable for presence),
          availability trade-offs (presence should be available even during
          partial outages), conflict resolution (merging presence from multiple
          devices), and graceful degradation (the application must function
          even when the presence subsystem is down). The XMPP protocol
          established many foundational presence patterns that modern systems
          still follow, including the concept of presence stanzas, subscription
          authorization, and directed vs. broadcast presence.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/real-time-features/presence-systems-diagram-1.svg"
        alt="Presence system architecture showing heartbeat collection, status computation, and fan-out to subscribers"
        caption="Figure 1: Presence system architecture from heartbeat to subscriber delivery"
      />

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Heartbeat Protocol and Timeout Detection
        </h3>
        <p className="mb-4">
          The heartbeat protocol is the foundation of presence detection. Each
          connected client periodically sends a lightweight signal (a
          &quot;heartbeat&quot; or &quot;ping&quot;) to the presence server,
          typically every 15-30 seconds. The server maintains a timestamp of
          the last heartbeat for each user and considers a user offline if no
          heartbeat arrives within a timeout window (typically 2-3x the
          heartbeat interval). The timeout window creates an inherent trade-off:
          shorter timeouts detect disconnections faster but generate more false
          &quot;offline&quot; transitions during momentary network glitches,
          while longer timeouts are more stable but delay offline detection.
          Production systems typically use a 30-second heartbeat with a
          90-second timeout, meaning a user appears offline 60-90 seconds
          after actually disconnecting.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Multi-Device Presence Merging
        </h3>
        <p className="mb-4">
          Modern users are simultaneously connected from multiple devices — a
          laptop browser tab, a mobile app, and possibly a desktop client.
          The presence system must merge these signals into a single coherent
          status. The common approach is &quot;most active wins&quot;: the
          user&apos;s status is the most active status across all their
          sessions. If the mobile app shows &quot;active&quot; and the desktop
          shows &quot;idle,&quot; the merged status is &quot;active.&quot; This
          requires tracking per-session presence and computing the aggregate
          on each session update. The transition to &quot;offline&quot; only
          occurs when <em>all</em> sessions have timed out — logging out on
          one device does not make the user appear offline if they are still
          active on another. Custom statuses (Do Not Disturb, In a Meeting)
          are typically set explicitly by the user and take priority over
          computed statuses.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Typing Indicators and Activity Signals
        </h3>
        <p className="mb-4">
          Typing indicators are a specialized form of presence that broadcast
          a user&apos;s in-progress activity. When a user begins typing in a
          chat input, the client sends a &quot;typing started&quot; event to
          the server, which broadcasts it to other participants. The indicator
          automatically expires after a short timeout (typically 3-5 seconds
          of inactivity) or when the message is sent. To avoid excessive
          network traffic, clients throttle typing events — sending at most
          one event per 2-3 seconds regardless of keystroke frequency. The
          expiration timer on the receiving end is critical: without it, a
          typing indicator for a user who closed the tab without sending would
          persist indefinitely. More sophisticated activity signals include
          &quot;user is viewing this document,&quot; &quot;user is on this
          page,&quot; and &quot;user is editing this field&quot; — each
          following the same pattern of throttled emission, server broadcast,
          and client-side expiration.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Subscription and Fan-out Models
        </h3>
        <p className="mb-4">
          In a roster-based model (Slack, Discord), each user subscribes to
          the presence of users in their channels, teams, or contact list.
          When a user&apos;s status changes, the server fans out the update
          to all subscribers. For a popular user with 10,000 subscribers,
          a single status change generates 10,000 delivery events.
          Production systems optimize this with tiered fan-out: immediate
          delivery to users who are actively viewing a channel containing the
          user, batched delivery to users who have the channel open but not
          focused, and lazy evaluation for users who are not currently viewing
          any context that includes the user. Channel-level presence
          aggregation further reduces fan-out: instead of subscribing to
          individual user presence, clients subscribe to a channel and receive
          a count or list of online members, updated periodically rather than
          on every individual status change.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Frontend State Management for Presence
        </h3>
        <p className="mb-4">
          On the client side, presence data must be managed as a high-frequency,
          eventually consistent data source. The client maintains a local
          presence map (user ID → status) that is updated via WebSocket or SSE
          events. This map is the source of truth for all UI components that
          display presence indicators. Key considerations include: batching UI
          updates (updating 50 presence indicators simultaneously should not
          trigger 50 re-renders), implementing client-side timeouts for stale
          presence data (if no update arrives for a user within 2x the expected
          heartbeat interval, the client downgrades their status to
          &quot;unknown&quot;), and providing optimistic updates (immediately
          showing the user as online upon reconnection rather than waiting for
          server confirmation). The presence store should be separate from
          other application state to enable independent update frequencies and
          prevent presence churn from triggering re-renders of unrelated UI.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture &amp; Flow</h2>
        <p className="mb-4">
          Production presence architectures are designed around the
          observation that most presence data is neither viewed nor immediately
          needed. The system optimizes for the common case — efficiently
          computing and delivering presence only for users who are actively
          being observed.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/real-time-features/presence-systems-diagram-2.svg"
          alt="Distributed presence architecture showing heartbeat ingestion, per-user status computation, multi-device merging, and tiered subscriber fan-out"
          caption="Figure 2: Distributed presence architecture with tiered fan-out"
        />

        <p className="mb-4">
          The architecture separates three concerns: heartbeat ingestion
          (receiving and timestamping heartbeats from millions of connections),
          status computation (merging multi-device sessions and determining
          the aggregate status), and subscriber notification (fanning out
          status changes to interested clients). Heartbeats are ingested by
          stateless gateway servers and written to a fast key-value store
          (Redis, with per-user keys and TTL matching the offline timeout).
          Status computation runs as a separate service that evaluates
          transitions when heartbeats arrive or TTLs expire. Subscriber
          notification uses a pub/sub system where each user has a presence
          channel, and clients subscribe to the channels of users they need
          to observe. The tiered fan-out layer ensures that only actively
          viewed presence indicators generate real-time push events — others
          are resolved on-demand when the UI element becomes visible.
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
          Presence system design involves fundamental trade-offs between
          accuracy, latency, bandwidth, and server cost. The following
          comparison evaluates different approaches to presence detection and
          propagation.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-theme text-sm">
            <thead>
              <tr className="bg-panel">
                <th className="border border-theme px-4 py-2 text-left">
                  Approach
                </th>
                <th className="border border-theme px-4 py-2 text-left">
                  Advantages
                </th>
                <th className="border border-theme px-4 py-2 text-left">
                  Disadvantages
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-theme px-4 py-2 font-medium">
                  Connection-based (online while connected)
                </td>
                <td className="border border-theme px-4 py-2">
                  Instant offline detection when connection drops; no heartbeat overhead
                </td>
                <td className="border border-theme px-4 py-2">
                  Cannot distinguish active from idle; disconnects during network blips cause flicker
                </td>
              </tr>
              <tr>
                <td className="border border-theme px-4 py-2 font-medium">
                  Heartbeat-based (periodic pings)
                </td>
                <td className="border border-theme px-4 py-2">
                  Configurable timeout; supports idle detection; works across transport types
                </td>
                <td className="border border-theme px-4 py-2">
                  Delayed offline detection (timeout window); constant network traffic
                </td>
              </tr>
              <tr>
                <td className="border border-theme px-4 py-2 font-medium">
                  Activity-based (events trigger status updates)
                </td>
                <td className="border border-theme px-4 py-2">
                  Accurate active/idle distinction; no unnecessary heartbeat traffic during inactivity
                </td>
                <td className="border border-theme px-4 py-2">
                  Complex to implement; depends on defining what counts as activity
                </td>
              </tr>
              <tr>
                <td className="border border-theme px-4 py-2 font-medium">
                  Hybrid (connection + heartbeat + activity)
                </td>
                <td className="border border-theme px-4 py-2">
                  Best accuracy — immediate disconnect detection with idle differentiation
                </td>
                <td className="border border-theme px-4 py-2">
                  Most complex to implement; multiple signal sources to merge and reconcile
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
            Implement a hybrid presence model that combines connection state
            (for fast disconnect detection), heartbeats (for zombie connection
            detection), and user activity events (for idle vs. active
            differentiation)
          </li>
          <li>
            Use &quot;last seen&quot; timestamps instead of binary
            online/offline for users who are not currently active — showing
            &quot;last seen 5 minutes ago&quot; is more informative and less
            privacy-invasive than a hard offline status
          </li>
          <li>
            Throttle typing indicators to one event per 2-3 seconds and
            implement a client-side expiration timer (4-5 seconds) — this
            prevents event storms during fast typing and ensures the indicator
            disappears if the sender closes the tab without sending
          </li>
          <li>
            Use Redis with TTL-based keys for heartbeat storage — set the key
            on each heartbeat with a TTL equal to the offline timeout. When
            the TTL expires, Redis keyspace notifications can trigger the
            offline transition event
          </li>
          <li>
            Implement lazy presence resolution: only subscribe to detailed
            presence updates for users currently visible in the viewport.
            Use intersection observer to manage subscriptions as the user
            scrolls through a member list
          </li>
          <li>
            Separate the presence store from the main application store on
            the frontend — presence data updates frequently and should not
            trigger re-renders of non-presence-related components
          </li>
          <li>
            Add a brief grace period (5-10 seconds) before showing a user as
            offline after disconnect — this prevents status flicker during
            brief network interruptions or page navigations within the SPA
          </li>
          <li>
            Respect user privacy preferences: allow users to appear offline,
            disable &quot;last seen&quot; visibility, and control who can see
            their typing indicators
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
            <strong>Status flicker</strong> — showing rapid online/offline
            transitions during network instability. Users find this distracting
            and lose trust in the indicator. Add a debounce or grace period
            before transitioning to offline
          </li>
          <li>
            <strong>Phantom online users</strong> — users shown as online long
            after they have left because heartbeat timeouts are too long or
            zombie connections are not detected. Tune the heartbeat interval
            and implement connection-level health checks
          </li>
          <li>
            <strong>Typing indicator stuck on</strong> — a typing indicator
            that never disappears because the sender closed the tab or lost
            connectivity before the &quot;stopped typing&quot; event was sent.
            Always implement a client-side expiration timer on the receiver
          </li>
          <li>
            <strong>O(N²) fan-out</strong> — broadcasting every presence
            change to every subscriber creates quadratic messaging volume.
            Use tiered fan-out with immediate delivery only to actively
            viewing clients, and batched or on-demand delivery for others
          </li>
          <li>
            <strong>Ignoring multi-device</strong> — treating each session
            independently means a user can appear both online (phone) and
            offline (just closed laptop) simultaneously. Always merge across
            sessions to compute a single aggregate status
          </li>
          <li>
            <strong>Coupling presence to business logic</strong> — making
            application features depend on presence accuracy (e.g., routing
            messages differently based on online status) creates brittle
            behavior. Presence is inherently eventually consistent — design
            business logic to tolerate stale presence data
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Slack: Workspace-Wide Presence at Scale
        </h3>
        <p className="mb-4">
          Slack&apos;s presence system manages real-time status for millions of
          concurrent users across thousands of workspaces. Each user&apos;s
          presence is determined by a combination of WebSocket connection
          state, application-level heartbeats, and OS-level activity signals
          (mouse movement, keyboard input). Slack implements a 30-minute idle
          timeout: after 30 minutes without activity, the green dot turns to
          a hollow circle indicating &quot;away.&quot; Their multi-device
          merging uses the &quot;most active wins&quot; policy, with mobile
          push notifications as a presence signal (receiving a push
          notification and opening the app transitions from away to active).
          Slack&apos;s custom status system (with emoji and text) operates as
          a separate presence layer that is explicitly set and does not
          auto-expire unless the user sets a duration. Their presence
          fan-out is optimized to only push real-time updates to workspace
          members who have the sidebar visible.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Google Docs: Document Collaboration Presence
        </h3>
        <p className="mb-4">
          Google Docs implements context-specific presence that goes beyond
          simple online/offline indicators. Each collaborator&apos;s cursor
          position, selection range, and currently viewed page section are
          broadcast as presence data. The colored cursors and name labels that
          appear as others edit are presence indicators tied to specific
          document locations. Google&apos;s implementation handles the
          unique challenge of document presence: a user might have the same
          document open in multiple tabs (each showing a different cursor
          position), requiring per-tab rather than per-user presence tracking
          within the document context. Their &quot;N viewers&quot; indicator
          in the toolbar uses a separate, less granular presence system that
          counts unique users with the document open, updated every few
          seconds rather than in real-time, to reduce server load.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          WhatsApp: Privacy-Centric Presence
        </h3>
        <p className="mb-4">
          WhatsApp&apos;s presence system demonstrates how privacy
          requirements shape technical design. Users can control who sees
          their &quot;last seen&quot; and online status: everyone, contacts
          only, or nobody. The &quot;typing...&quot; indicator only appears to
          users who are in the same chat and have mutual visibility settings.
          WhatsApp&apos;s presence is computed on-device rather than on a
          central server: the app determines its own activity state and
          selectively broadcasts it based on the recipient&apos;s privacy
          relationship. This decentralized approach reduces server load and
          inherently enforces privacy policies — the server never has a
          complete picture of any user&apos;s presence, only the updates they
          have chosen to share with specific contacts.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/real-time-features/presence-systems-diagram-3.svg"
          alt="Multi-device presence merging showing sessions from phone, laptop, and tablet being aggregated into a single user status"
          caption="Figure 3: Multi-device presence merging strategy"
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
              Q: How would you design a presence system for a messaging
              application with 10 million concurrent users?
            </p>
            <p className="mt-2 text-sm">
              Use a distributed architecture: heartbeat ingestion through
              stateless gateway servers writing to Redis with TTL keys
              (per-user-session, TTL = offline timeout). Status computation as a
              separate service triggered by heartbeat writes and TTL expirations.
              Fan-out through a pub/sub system (Redis Pub/Sub or Kafka) where
              each user has a presence channel. Optimize with tiered delivery:
              real-time push only for actively viewed contexts, batched delivery
              for background contexts, lazy evaluation for off-screen users.
              Use channel-level aggregation (member count) instead of individual
              presence where possible.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle the transition from online to offline without
              status flicker?
            </p>
            <p className="mt-2 text-sm">
              Implement a grace period (5-10 seconds) before transitioning to
              offline. When a connection drops, start a timer rather than
              immediately showing offline. If the connection re-establishes
              within the grace period, cancel the timer and the user never
              appeared offline. For heartbeat-based detection, use a timeout
              window of 2-3x the heartbeat interval. Additionally, add
              client-side debouncing: buffer rapid online/offline transitions
              and only apply the latest state after a settling period.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does a typing indicator work, and what are the common
              failure modes?
            </p>
            <p className="mt-2 text-sm">
              The sender emits a &quot;typing started&quot; event (throttled to
              one per 2-3 seconds) on keypress in the input field. The receiver
              shows the indicator and starts a local expiration timer (4-5
              seconds). Each new typing event resets the timer. When the sender
              sends the message, an explicit &quot;typing stopped&quot; event
              clears the indicator. Failure modes: stuck indicator (sender
              disconnected without sending — solved by the expiration timer),
              event storms (fast typing without throttling), and race conditions
              (typing event arrives after the message itself — solved by
              clearing the indicator on message receipt).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle presence when a user has multiple active
              sessions across devices?
            </p>
            <p className="mt-2 text-sm">
              Track presence per-session (device + connection), not per-user.
              Compute the aggregate user status using a &quot;most active
              wins&quot; policy: active on any device = online, idle on all =
              idle, disconnected from all = offline. Store per-session data with
              TTL in Redis (key: <code>presence:user123:session456</code>). A
              separate aggregation query checks all sessions for a user when any
              session updates. Custom statuses (DND, In a Meeting) are set
              explicitly and override computed statuses. The offline transition
              only fires when the last session times out.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What consistency model is appropriate for presence data, and
              why?
            </p>
            <p className="mt-2 text-sm">
              Eventual consistency is the right model. Presence is inherently
              approximate — a user shown as &quot;online&quot; might have just
              closed their laptop, and a user shown as &quot;offline&quot; might
              be reconnecting. Strong consistency would require distributed
              locking across all presence subscribers for every heartbeat,
              which is prohibitively expensive. Instead, accept that presence
              data may be stale by a few seconds and design the UX accordingly:
              use &quot;last seen 2 minutes ago&quot; rather than a binary
              online/offline indicator, and never make critical business
              decisions based on presence accuracy.
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
              href="https://datatracker.ietf.org/doc/html/rfc6121"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              XMPP RFC 6121 — Instant Messaging and Presence Protocol
              (foundational presence standard)
            </a>
          </li>
          <li>
            <a
              href="https://discord.com/blog/how-discord-handles-billions-of-real-time-events"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Designing Real-Time Presence at Scale&quot; — Discord
              Engineering Blog
            </a>
          </li>
          <li>
            <a
              href="https://slack.engineering/how-slack-manages-presence-at-scale/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;How Slack Manages Presence at Scale&quot; — Slack
              Engineering Blog
            </a>
          </li>
          <li>
            <a
              href="https://redis.io/docs/latest/develop/data-types/strings/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Building Real-Time Presence with Redis&quot; — Redis
              documentation and patterns
            </a>
          </li>
          <li>
            <a
              href="https://dataintensive.net/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Designing Data-Intensive Applications&quot; by Martin
              Kleppmann — Chapter on distributed consistency models
            </a>
          </li>
          <li>
            <a
              href="https://www.ably.com/docs/realtime/presence"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ably Realtime — Presence API documentation and architecture
              reference
            </a>
          </li>
          <li>
            <a
              href="https://hexdocs.pm/phoenix/Phoenix.Presence.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Phoenix Presence — Elixir/Phoenix CRDT-based presence
              implementation
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
