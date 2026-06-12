"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-presence-last-seen-system",
  title: "Design a Presence + Last Seen System",
  description:
    "LLD for presence (online/away/offline) plus last-seen timestamps: heartbeat, debounced updates, privacy preferences, and accessible display.",
  category: "low-level-design",
  subcategory: "communication-collaboration",
  slug: "presence-last-seen-system",
  wordCount: 5500,
  readingTime: 29,
  lastUpdated: "2026-04-30",
  tags: ["lld", "presence", "last-seen", "heartbeat", "react"],
  relatedTopics: [
    "live-cursor-presence-system",
    "chat-messaging-ui",
    "real-time-notification-delivery-system",
  ],
};

export default function PresenceLastSeenSystemArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a Presence and Last-Seen System</h1><h2>Definition &amp; Context</h2><p>Design a Presence and Last-Seen System is an implementation-heavy low-level design problem covering heartbeat renewal, TTL expiry, device aggregation, privacy policy, last-seen persistence, visibility changes, and reconnect. A principal-level answer must define ordering, ephemeral versus durable state, reconnect behavior, rollback, abuse controls, privacy, cost, and observability.</p><p>Separate ephemeral online presence from durable last-seen metadata and user privacy preferences. The core structures are participant map, device sessions, heartbeat interval, TTL expiry, last-seen timestamp, privacy mode, visibility state, and reconnect token.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/communication-collaboration/presence-last-seen-system-runtime.svg" alt="Design a Presence and Last-Seen System runtime" caption="Real-time flow from input through merge policy and UI projection." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific mechanics.</p><section>
        <h3>🎯 Problem Context &amp; Scope Definition</h3>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="important">
          We are designing a presence + last-seen
          system — the layer that tracks whether a
          user is online, away, or offline, plus the
          last time they were active. The component
          drives the green dot next to avatars,
          &ldquo;last seen 5 minutes ago&rdquo;
          labels, and online presence badges in
          chat lists. It&rsquo;s a small but
          ubiquitous UX feature; getting it right
          requires a clean heartbeat protocol,
          debounced server updates, and respect for
          user privacy.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The hard problems are: heartbeat that
          balances accuracy with bandwidth; idle
          detection (away after inactivity);
          last-seen timestamp accuracy; cross-tab
          coordination (one tab&rsquo;s heartbeat
          counts for the user); privacy preferences
          (some users hide presence); and
          accessibility for the presence
          indicator.
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          End users glance at presence indicators
          to decide whether to message someone.
          Engineering teams plug in: provide a
          backend with presence endpoints; the
          runtime handles heartbeat and display.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Backend exposes a presence WebSocket and
          an HTTP endpoint for last-seen lookups.
          Modern browsers; Page Visibility API for
          tab focus, BroadcastChannel for cross-
          tab.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement live cursors
          (separate). We do not implement
          end-to-end-encrypted presence (rare).
        </HighlightBlock>
      </section>

      <section>
        <h3>⚙️ Functional Requirements</h3>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          Send heartbeat to server periodically
          while active (every 30 s typically).
          Server marks user online; if no heartbeat
          for 90 s, mark offline. Track last
          activity (user input); after threshold
          (e.g. 5 min), mark away. On tab hidden,
          pause heartbeat (or send less
          frequently). Cross-tab: one tab&rsquo;s
          heartbeat counts. Server broadcasts
          presence changes to subscribers.
          Display presence dot per user (green
          online, yellow away, gray offline).
          Display last-seen text for offline
          users (&ldquo;Last seen 5m ago&rdquo;).
          Privacy preferences: users can hide
          presence.
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Custom statuses (&ldquo;In a
          meeting&rdquo;). Mobile push presence
          (offline on web but online on mobile).
          Activity badges (idle, busy). Per-
          friend presence visibility. Predictive
          presence (likely to be online based on
          history).
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          Backend presence storage architecture,
          push integration, video presence.
        </HighlightBlock>
      </section>

      <section>
        <h3>📊 Non-Functional Requirements</h3>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="crucial">
          Heartbeat is a tiny request. Presence
          updates batch in the UI to avoid
          re-render flooding. Last-seen lookup
          cached.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          Cross-tab coordination prevents double-
          counted heartbeats. Disconnect cleanly
          marks offline. Last-seen timestamps
          accurate within a minute.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          Privacy preferences honored server-side
          (others see &ldquo;offline&rdquo; if
          user is hidden). Presence data scope
          per friend list / authorized viewers.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="important">
          Presence dot has text equivalent
          (&ldquo;Alice is online&rdquo;).
          Status changes don&rsquo;t spam
          announcements; throttled.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          Heartbeat interval, idle threshold
          configurable. Privacy preferences in a
          small clean module.
        </HighlightBlock>
      </section>

      <section>
        <h3>🧠 Solution Approach</h3>
        
        <HighlightBlock as="p" tier="important">
          The system has four parts: <strong>local
          heartbeat sender</strong> (periodic
          broadcasts to server), <strong>activity
          tracker</strong> (detects idle for
          away state), <strong>cross-tab
          coordinator</strong> (one tab leads
          heartbeat per user), and <strong>presence
          subscriber</strong> (receives others&rsquo;
          presence and renders).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The <strong>heartbeat sender</strong>{" "}
          fires every 30 s while the tab is
          active (visible and recently
          interacted). Server marks user online
          on first heartbeat; missing heartbeat
          for 90 s marks offline.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The <strong>activity tracker</strong>{" "}
          listens to mousemove, keypress, and
          touch events (debounced to 1/sec).
          Last-activity timestamp updates. If no
          activity for 5 minutes, mark away.
          Activity resumes online.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Cross-tab coordination</strong>:
          when a user has multiple tabs open,
          we don&rsquo;t want each tab firing its
          own heartbeat. BroadcastChannel
          coordinates: one tab elects itself the
          leader (via timestamp-based election or
          a similar mechanism); leader sends
          heartbeats; if leader closes, another
          tab takes over. Last-seen aggregates
          across all tabs.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          <strong>Tab hidden</strong>: pause
          heartbeats (or reduce frequency). The
          server&rsquo;s 90 s timeout handles the
          away state. On tab visible again,
          resume immediately.
        </HighlightBlock>
        <p>
          <strong>Disconnect</strong>: WebSocket
          disconnect is a reliable signal that
          the user is offline (or about to be).
          Server marks offline. On reconnect,
          heartbeat resumes; server marks online.
        </p>
        <p>
          <strong>Server-side broadcast</strong>:
          when a user&rsquo;s presence changes,
          server broadcasts to subscribers
          (typically the user&rsquo;s friends or
          conversation participants). Clients
          update presence display.
        </p>
        <p>
          <strong>Last-seen rendering</strong>:
          for offline users, show &ldquo;Last
          seen X ago&rdquo; using
          <code> Intl.RelativeTimeFormat</code>.
          Refresh display as time passes (every
          minute).
        </p>
        <p>
          <strong>Privacy preferences</strong>:
          when a user hides presence, server
          serves &ldquo;offline&rdquo; or
          &ldquo;unknown&rdquo; to others
          regardless of actual state. Server-
          enforced.
        </p>
      </section>

      <section>
        <h3>🧱 Component Architecture</h3>
        <HighlightBlock as="p" tier="important">
          <Highlight tier="crucial"><strong>HeartbeatSender</strong></Highlight>,
          <strong> ActivityTracker</strong>,
          <strong> CrossTabCoordinator</strong>,
          <strong> PresenceSubscriber</strong>,
          <Highlight tier="important"><strong> PresenceDot</strong></Highlight>,
          <strong> LastSeenLabel</strong>.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔄 State Management</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Local presence state in a small ref-
          backed <Highlight tier="important">cache. Per-user presence in an
          external</Highlight> store. Subscribers (avatars,
          chat list items) read via selectors.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Data Flow &amp; Contracts</h3>
        <HighlightBlock as="p" tier="important">
          <Highlight tier="crucial">Heartbeat:</Highlight>{" "}
          <code>{`POST /presence/heartbeat`}</code> (small body). Presence event:{" "}
          <Highlight tier="important">
            <code>{` { userId, status, lastSeen } `}</code>
          </Highlight>
          . Subscription: WebSocket subscribes to presence for a set of user ids.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚡ Performance</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Heartbeats are tiny. Activity throttled.
          Cross-tab <Highlight tier="important">election uses lightweight
          BroadcastChannel events. Last-seen</Highlight>
          rendering memoized with periodic
          re-render via interval.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🎨 UX</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Presence dot small but visible (green/
          yellow/gray). <Highlight tier="important">Last-seen text subtle
          beneath name. &ldquo;Online&rdquo;</Highlight> text
          when applicable. Custom status displayed
          in tooltips.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>♿ Accessibility</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Dot has text equivalent in tooltip and
          <Highlight tier="important">aria-label. Status changes don&rsquo;t
          announce per</Highlight> change (would spam);
          announced on focus only.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔐 Security</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Privacy preferences server-enforced.
          Authorization: <Highlight tier="important">only friends or
          conversation participants see</Highlight>
          presence. Server validates
          subscriptions.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🧪 Testing</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Unit tests for heartbeat timing, idle
          detection, cross-tab election.
          <Highlight tier="important">Integration tests with mock backend:
          presence</Highlight> broadcast updates UI; tab
          close fires offline; reconnect resumes.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🚨 Edge Cases</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="important">Privacy hide:
          server serves offline regardless. Mobile
          browser backgrounding: heartbeats</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="crucial">paused; server timeout handles. Very
          long idle (user stepped away): away
          state after threshold.</HighlightBlock>
      </section>

      <section>
        <h3>🔁 Reusability</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Generic; any product with users-and-
          <Highlight tier="important">friends benefits. Presence + last-seen
          is</Highlight> a tiny but ubiquitous primitive.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🌍 Internationalization</h3>
        <HighlightBlock as="p" tier="crucial">Last-seen via{" "}
          <Highlight tier="important"><code>Intl.RelativeTimeFormat</code></Highlight>.{" "}
          <Highlight tier="important">Status labels via i18n</Highlight>.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚖️ Trade-offs</h3>

        <h3>Heartbeat interval</h3>
        <HighlightBlock as="p" tier="important">
          30 s is a balance between accuracy and
          bandwidth. 10 s is more accurate but
          3x bandwidth. 60 s is cheaper but less
          responsive. 30 s is the sweet spot.
        </HighlightBlock>

        <h3>Cross-tab leader vs all heartbeat</h3>
        <HighlightBlock as="p" tier="important">
          Leader pattern minimizes server load.
          All-heartbeat is simpler but
          inefficient. Leader is the right
          architecture for any product with
          significant multi-tab usage.
        </HighlightBlock>

        <h3>Pause on hidden vs continue</h3>
        <HighlightBlock as="p" tier="crucial">
          Pause saves bandwidth and battery on
          mobile. Continue keeps presence
          accurate when the user has many tabs
          but isn&rsquo;t actively using one.
          Pause-with-server-timeout is the
          right balance.
        </HighlightBlock>

        <h3>Privacy default</h3>
        <HighlightBlock as="p" tier="important">
          Some products default to visible
          (social features); others to hidden
          (privacy-first products). Configurable
          per product.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔮 Future Improvements</h3>
        <HighlightBlock as="p" tier="crucial">Cross-device presence (online on phone
          counts even if web is offline). AI-
          predicted &ldquo;likely online&rdquo;
          status.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Custom status auto-set based
          on calendar (in a meeting). Activity
          richness (typing, viewing, editing).</Highlight></HighlightBlock>
      </section></section>
<section><h2>Architecture &amp; Flow</h2><p>Separate durable records, optimistic intent, transport events, ephemeral awareness, rendered projection, and telemetry. Every connection, timer, cursor, replay buffer, subscription, and retry queue needs an explicit owner and cleanup path.</p><p>Separate ephemeral online presence from durable last-seen metadata and user privacy preferences.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/communication-collaboration/presence-last-seen-system-recovery.svg" alt="Design a Presence and Last-Seen System recovery" caption="Recovery flow: classify gaps, retain stable truth, replay safely, and emit evidence." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Perfect online accuracy is expensive and misleading; bounded-staleness presence is justified for useful social context.</p><p>Online state is eventually consistent TTL state. Last-seen is a durable server projection filtered by privacy policy. Scale pressure comes from many devices, lost heartbeats, hidden tabs, clock skew, reconnect storms, and privacy restrictions. Bound queues, dedupe events, expire ephemeral state, and degrade predictably.</p></section>
<section><h2>Best practices</h2><p>Use stable ids, event sequences, idempotency keys, monotonic watermarks, TTLs, replay cursors, bounded buffers, authorization checks, and cleanup. Test reconnect gaps, duplicates, stale events, offline recovery, privacy settings, and accessibility announcements.</p><p>Measure latency, backlog, reconnect rate, gap recovery, retries, stale drops, TTL expiry, and accessibility regressions without logging sensitive content.</p><h3>Operational implementation: privacy-aware presence TTL and last-seen projection</h3><p>Treat online presence as TTL state and last-seen as a privacy-controlled projection. Newer heartbeats supersede older ones, invisible mode suppresses fan-out, and the UI rounds last-seen timestamps according to policy rather than exposing exact activity.</p><p>Define explicit metrics for accepted events, duplicate drops, stale drops, replay gap size, reconnect duration, queue depth, TTL expiry, degraded-mode entry, authorization denial, and rollback outcome. Redact user content and sensitive identifiers from telemetry. Test duplicate delivery, out-of-order events, disconnect during mutation, hidden tabs, unmount cleanup, multiple tabs, permission removal, burst traffic, and a rollback to the previous policy version.</p></section>
<section><h2>Common Pitfalls</h2><p>Common failures include treating ephemeral state as durable, trusting arrival order, leaking timers or sockets, missing dedupe, unbounded replay, and hiding degraded connectivity.</p><p>For this topic, expire stale sessions, aggregate devices, pause responsibly in hidden tabs, refresh on reconnect, and redact restricted timestamps.</p></section>
<section><h2>Real-world use cases</h2><p>This design applies to collaborative products where transport, persistence, and UI projection fail independently. Inject product policy for authorization, retention, fallback, and observability explicitly.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Separate ephemeral online presence from durable last-seen metadata and user privacy preferences.</p><h3>What breaks at scale?</h3><p>many devices, lost heartbeats, hidden tabs, clock skew, reconnect storms, and privacy restrictions.</p><h3>What consistency applies?</h3><p>Online state is eventually consistent TTL state. Last-seen is a durable server projection filtered by privacy policy.</p><h3>How do you recover?</h3><p>expire stale sessions, aggregate devices, pause responsibly in hidden tabs, refresh on reconnect, and redact restricted timestamps.</p><h3>Why this architecture?</h3><p>Perfect online accuracy is expensive and misleading; bounded-staleness presence is justified for useful social context.</p></section>
<section><h2>References</h2><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSocket" target="_blank" rel="noreferrer">MDN WebSocket</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA APG</a></li><li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React state ownership</a></li></ul></section>
</ArticleLayout>}