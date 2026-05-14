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

export default function PresenceLastSeenSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

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
        <h2>⚙️ Functional Requirements</h2>

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
        <h2>📊 Non-Functional Requirements</h2>

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
        <h2>🧠 Solution Approach</h2>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/communication-collaboration/presence-last-seen-system-architecture.svg"
          alt="Presence and last-seen system architecture showing presence record model, status rules, client heartbeat, server TTL with Redis, presence indicator UI, last-seen text formatting, privacy controls, and scale considerations"
          caption="Architecture Overview"
        />
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
        <h2>🧱 Component Architecture</h2>
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
        <h2>🔄 State Management</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Local presence state in a small ref-
          backed <Highlight tier="important">cache. Per-user presence in an
          external</Highlight> store. Subscribers (avatars,
          chat list items) read via selectors.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
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
        <h2>⚡ Performance</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Heartbeats are tiny. Activity throttled.
          Cross-tab <Highlight tier="important">election uses lightweight
          BroadcastChannel events. Last-seen</Highlight>
          rendering memoized with periodic
          re-render via interval.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Presence dot small but visible (green/
          yellow/gray). <Highlight tier="important">Last-seen text subtle
          beneath name. &ldquo;Online&rdquo;</Highlight> text
          when applicable. Custom status displayed
          in tooltips.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Dot has text equivalent in tooltip and
          <Highlight tier="important">aria-label. Status changes don&rsquo;t
          announce per</Highlight> change (would spam);
          announced on focus only.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Privacy preferences server-enforced.
          Authorization: <Highlight tier="important">only friends or
          conversation participants see</Highlight>
          presence. Server validates
          subscriptions.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Unit tests for heartbeat timing, idle
          detection, cross-tab election.
          <Highlight tier="important">Integration tests with mock backend:
          presence</Highlight> broadcast updates UI; tab
          close fires offline; reconnect resumes.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="important">Privacy hide:
          server serves offline regardless. Mobile
          browser backgrounding: heartbeats</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="crucial">paused; server timeout handles. Very
          long idle (user stepped away): away
          state after threshold.</HighlightBlock>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Generic; any product with users-and-
          <Highlight tier="important">friends benefits. Presence + last-seen
          is</Highlight> a tiny but ubiquitous primitive.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <HighlightBlock as="p" tier="crucial">Last-seen via{" "}
          <Highlight tier="important"><code>Intl.RelativeTimeFormat</code></Highlight>.{" "}
          <Highlight tier="important">Status labels via i18n</Highlight>.
        </HighlightBlock>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

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
        <h2>🔮 Future Improvements</h2>
        <HighlightBlock as="p" tier="crucial">Cross-device presence (online on phone
          counts even if web is offline). AI-
          predicted &ldquo;likely online&rdquo;
          status.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Custom status auto-set based
          on calendar (in a meeting). Activity
          richness (typing, viewing, editing).</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <HighlightBlock as="p" tier="important">
          <strong>1. How is online state
          determined?</strong> Heartbeat every 30 s
          while tab active. Server marks online
          on heartbeat; offline if no heartbeat
          for 90 s.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>2. How is away
          detected?</strong> Activity tracker
          watches input events. After threshold
          (5 min) without activity, mark away.
          Activity resumes online.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>3. How is cross-tab
          handled?</strong> BroadcastChannel
          elects a leader tab. Leader sends
          heartbeats. If leader dies, another
          tab takes over.
        </HighlightBlock>

        <p>
          <strong>4. How does last-seen
          work?</strong> Server records the
          time of last heartbeat. For offline
          users, others see &ldquo;Last seen X
          ago&rdquo; via
          <code> Intl.RelativeTimeFormat</code>.
        </p>

        <p>
          <strong>5. How are privacy preferences
          enforced?</strong> Server-side. When
          hidden, server serves
          &ldquo;offline&rdquo; or
          &ldquo;unknown&rdquo; to others
          regardless of actual state.
        </p>

        <p>
          <strong>6. How does this scale?</strong>{" "}
          Heartbeats are tiny. Server batches
          presence broadcasts to subscribers.
          Per-user subscriptions limit fanout.
        </p>

        <HighlightBlock as="p" tier="important">
          <strong>7. What happens on tab
          close?</strong> WebSocket disconnect
          fires; server eventually marks
          offline (heartbeat timeout).
        </HighlightBlock>

        <HighlightBlock as="p" tier="crucial">
          <strong>8. How is this
          accessible?</strong> Dot has text
          equivalent. Status announces on focus.
          Last-seen reads as text.
        </HighlightBlock>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <HighlightBlock as="p" tier="crucial"><Highlight tier="important">Cross-tab coordination</Highlight>
          minimizes load. Last-seen via Intl.
          The</HighlightBlock>
<HighlightBlock as="p" tier="important">result is glanceable, trustworthy
          presence indicators throughout the app.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
