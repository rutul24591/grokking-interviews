"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-real-time-notification-delivery-system",
  title: "Design a Real-time Notification Delivery System",
  description:
    "LLD for delivering notifications across surfaces (in-app, toast, badge, push) with consistency, deduplication, ordering, and accessibility.",
  category: "low-level-design",
  subcategory: "communication-collaboration",
  slug: "real-time-notification-delivery-system",
  wordCount: 5500,
  readingTime: 29,
  lastUpdated: "2026-04-30",
  tags: ["lld", "notifications", "real-time", "consistency", "react"],
  relatedTopics: [
    "notification-center-inbox",
    "toast-notification-system",
    "real-time-data-dashboard",
  ],
};

export default function RealTimeNotificationDeliverySystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="important">
          We are designing the client-side delivery
          system that takes notification events from
          the backend and routes them to the right
          surfaces — toast (transient banner), badge
          (count update), notification center
          (persistent list), inline insertion (e.g.
          a new mention appearing in a feed). The
          system must keep all surfaces consistent
          with each other (a notification you saw as
          a toast shouldn&rsquo;t still appear in
          the badge count) and handle deduplication,
          ordering, and cross-tab consistency.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The hard problems are: routing one event to
          multiple surfaces correctly; cross-surface
          consistency (read on one, reflected on
          others); deduplication when the same event
          arrives multiple times; ordering when
          events arrive out of order; cross-tab
          coordination so a notification opened in
          one tab updates the badge in others;
          accessibility for the various surfaces.
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          End users see notifications across
          multiple surfaces. They expect coherent
          state — actions on one surface
          immediately reflect on others. Engineering
          teams plug in: provide a notification
          source (WebSocket); the runtime routes,
          dedups, and renders.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Backend exposes a WebSocket for delivery.
          Each notification has stable id, type,
          and metadata indicating preferred
          surfaces. Modern browsers; we use
          BroadcastChannel for cross-tab.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          The notification backend, the
          notification authoring tools, OS-level
          push notifications (separate subsystem
          that integrates with this layer).
        </HighlightBlock>
      </section>

      <section>
        <h2>⚙️ Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          WebSocket subscription to user
          notifications. Routing: each event goes
          to the right surfaces (toast for some;
          inbox always; badge always; inline if
          relevant context is open).
          Deduplication by event id.
          Cross-surface consistency: marking read
          in inbox clears badge and dismisses
          related toast. Cross-tab consistency
          via BroadcastChannel. Ordering: events
          apply in arrival order; out-of-order
          events that affect the same target
          handled idempotently.
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Per-type routing rules (some types
          show as toast, others only in inbox).
          Per-user preferences (mute types).
          Quiet hours / do-not-disturb. Smart
          batching (digest mode for noisy types).
          Sound effects per type. Browser push
          integration.
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          Backend, authoring tools, OS push.
        </HighlightBlock>
      </section>

      <section>
        <h2>📊 Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          Event delivery to UI within 100 ms of
          receipt. Routing decisions cheap.
          Cross-tab broadcast within 50 ms.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          Dedup by id; out-of-order events
          handled idempotently. Reconnection
          fetches missed events via REST. State
          consistent across surfaces.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          Authenticated WebSocket. Server-enforced
          ownership. Notification content
          sanitized at render boundaries.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">
          Each surface has its own a11y rules
          (toast announces, badge labeled, etc.).
          Cross-surface consistency means screen
          readers don&rsquo;t hear duplicate
          announcements when a single event hits
          multiple surfaces.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          Routing rules declarative. Surface
          adapters pluggable (toast renderer,
          badge renderer, inbox).
        </HighlightBlock>
      </section>

      <section>
        <h2>🧠 Solution Approach</h2>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/communication-collaboration/real-time-notification-delivery-system-architecture.svg"
          alt="Real-time notification delivery system architecture showing notification event model, routing rules, server fan-out with queue consumer, delivery channels, WebSocket client delivery, push fallback via Service Worker, read tracking, and badge count"
          caption="Architecture Overview"
        />
        <HighlightBlock as="p" tier="crucial">
          The system is a <strong>delivery hub</strong>{" "}
          that receives WebSocket events,
          deduplicates, applies routing rules,
          dispatches to surface adapters
          (toast, badge, inbox, inline), and
          coordinates cross-tab consistency via
          BroadcastChannel.
        </HighlightBlock>
        <p>
          On <strong>event arrival</strong>: dedupe
          by id (Set of recent ids). Apply
          routing rules: this type shows toast?
          appears in inbox? updates badge? affects
          inline UI? Dispatch to relevant
          adapters.
        </p>
        <HighlightBlock as="p" tier="important">
          The <strong>toast adapter</strong> calls
          the Toast Notification System to show a
          transient banner. The <strong>badge
          adapter</strong> increments unread count
          in the notification store. The
          <strong> inbox adapter</strong> appends
          to the inbox list. The <strong>inline
          adapter</strong> dispatches to feature-
          specific listeners (e.g. the chat UI
          listens for new-message events to
          update its thread).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          On <strong>read action</strong> (user
          clicks a toast or marks read in inbox):
          dispatch a read event to the hub. The
          hub updates the inbox state, decrements
          the badge, dismisses any related toast.
          Broadcasts the read event via
          BroadcastChannel for cross-tab.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Cross-tab consistency</strong>:
          BroadcastChannel propagates state changes
          (new notification, read, dismissed).
          Receiving tabs update their state
          accordingly without re-fetching from the
          server.
        </HighlightBlock>
        <p>
          <strong>Reconnection</strong>: on WebSocket
          reconnect, fetch missed events via REST
          (since-last-seen). Dedup against the
          existing state. Apply routing.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>Ordering and idempotency</strong>:
          events carry timestamps. Reads use
          last-write-wins by timestamp. Marking
          read for an already-read notification is
          a no-op. Out-of-order arrival of
          {`{ created, read }`} events for the
          same id ends up in the read state
          regardless of arrival order.
        </HighlightBlock>
        <p>
          <strong>Per-user preferences</strong>:
          stored server-side; client receives the
          ruleset on session init. Routing
          consults preferences (muted types skip
          toast and badge but still appear in
          inbox if persistent). Quiet hours skip
          toast/sound but inbox accumulates.
        </p>
        <p>
          <strong>Per-type routing</strong>: each
          notification type declares which
          surfaces apply (toast, inbox, badge,
          inline). The hub honors. Common
          patterns: chat messages use toast +
          badge + inline; system alerts use
          toast + inbox; activity (likes, follows)
          use inbox + badge only.
        </p>
      </section>

      <section>
        <h2>🧱 Component Architecture</h2>
        <HighlightBlock as="p" tier="crucial"><strong> DeduplicationCache</strong>{" "}
          tracks recent ids.
          <strong> SurfaceAdapters</strong> for
          toast, badge, inbox,</HighlightBlock>
<HighlightBlock as="p" tier="important">inline.
          <Highlight tier="important"><strong> BroadcastBridge</strong></Highlight>{" "}
          handles cross-tab.
          <strong> PreferenceStore</strong> holds
          user rules.</HighlightBlock>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <HighlightBlock as="p" tier="crucial">Hub state: dedup cache, recent events.
          Surface states: toast queue,</HighlightBlock>
<HighlightBlock as="p" tier="important">badge
          count, inbox list — each in their own
          store. Hub mutates</HighlightBlock>
<HighlightBlock as="p" tier="important">them via dispatch.
          BroadcastChannel synchronizes across
          tabs.</HighlightBlock>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <HighlightBlock as="p" tier="important">
          <Highlight tier="crucial">Event shape:</Highlight>{" "}
          <Highlight tier="important">
            <code>{` { id, type, target, content, surfaces?, createdAt } `}</code>
          </Highlight>
          . Routing rule: per-type surface list. Surface adapter contract:{" "}
          <code>{` { onEvent(event), onRead(id), onDismiss(id) } `}</code>.
        </HighlightBlock>
      </section>

      <section>
        <h2>⚡ Performance</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Dedup cache O(1) lookup. Routing rules
          static <Highlight tier="important">after init. Cross-tab broadcast
          fire-and-forget. Surface</Highlight> adapters batch
          per-frame to avoid render flooding.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <HighlightBlock as="p" tier="crucial"><Highlight tier="important">No
          duplicate announcements: if a chat
          message shows as a toast and inline</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">simultaneously, the toast is the
          announcer; inline appears silently.</HighlightBlock>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <HighlightBlock as="p" tier="crucial">Each surface follows its own a11y
          rules. Hub coordinates so screen</HighlightBlock>
<HighlightBlock as="p" tier="important">readers don&rsquo;t hear duplicate
          announcements. Toasts use polite</HighlightBlock>
<HighlightBlock as="p" tier="important">live
          region; inbox doesn&rsquo;t auto-
          announce; badge is labeled.</HighlightBlock>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Authenticated WebSocket. Server-
          <Highlight tier="important">enforced. Content sanitized at
          surface boundaries.</Highlight> Per-user
          preferences server-stored.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Unit tests for routing rules and
          dedup. Integration tests <Highlight tier="important">with mock
          WebSocket: event arrives, hits</Highlight>
          correct surfaces; read action
          consistent across surfaces;
          cross-tab convergence.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <HighlightBlock as="p" tier="crucial">User
          opens inbox in tab A while tab B
          shows a toast: toast dismisses on
          inbox read via BroadcastChannel.
          Quiet hours active: skip toast</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">but
          inbox accumulates; badge updates.
          User preferences change mid-session:
          subsequent events use new rules;
          existing state unchanged.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Pattern reuses <Highlight tier="important">across products with
          multiple notification surfaces.</Highlight> Surface
          adapters plug-and-play.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Notification content typically <Highlight tier="important">pre-
          translated server-side per recipient
          locale.</Highlight> UI strings via i18n.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Hub vs per-surface direct</h3>
        <HighlightBlock as="p" tier="crucial">
          Hub centralizes routing and
          consistency. Per-surface direct is
          simpler but produces drift between
          surfaces. Hub is essential for any
          product with more than one surface.
        </HighlightBlock>

        <h3>Client routing vs server routing</h3>
        <HighlightBlock as="p" tier="important">
          Client routing lets us apply per-
          session preferences and inline-context
          awareness. Server routing is
          authoritative but inflexible. We do
          client routing on top of server-
          provided preferred-surfaces metadata.
        </HighlightBlock>

        <h3>BroadcastChannel vs polling</h3>
        <HighlightBlock as="p" tier="important">
          BroadcastChannel is instant.
          Polling is the fallback. For modern
          browsers, BroadcastChannel.
        </HighlightBlock>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          OS-level push integration.
          AI-prioritized surfacing (only <Highlight tier="important">show
          critical as toast; demote noise).</Highlight>
          Smart digesting. Cross-device
          consistency. Voice-assistant
          delivery.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <HighlightBlock as="p" tier="important">
          <strong>1. Why a delivery hub?</strong>{" "}
          One WebSocket subscription; routing
          to surfaces; cross-surface consistency.
          Without the hub, each surface would
          subscribe independently, drift, and
          duplicate.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>2. How is dedup handled?</strong>{" "}
          Cache of recent event ids. Repeat
          arrivals are no-ops. Cache evicted
          after a TTL.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>3. How is cross-surface
          consistency maintained?</strong> Read
          actions go to the hub, which updates
          all relevant surfaces (badge,
          inbox, toast). BroadcastChannel
          propagates to other tabs.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>4. How are out-of-order events
          handled?</strong> Idempotently via
          state semantics. Read event for an
          unknown id can preempt the create
          event; when create arrives, it&rsquo;s
          inserted as already-read.
        </HighlightBlock>

        <p>
          <strong>5. How are user preferences
          enforced?</strong> Routing consults
          preferences before dispatching.
          Muted types skip transient surfaces
          but appear in inbox.
        </p>

        <p>
          <strong>6. How does reconnection
          work?</strong> WebSocket reconnects;
          REST fetches missed events; dedup
          against existing state.
        </p>

        <p>
          <strong>7. How is per-type routing
          configured?</strong> Each notification
          type declares preferred surfaces in
          metadata; routing rules consume.
          Server-side per-product.
        </p>

        <HighlightBlock as="p" tier="crucial">
          <strong>8. How is this
          accessible?</strong> Surface-specific
          a11y; hub prevents duplicate
          announcements when one event hits
          multiple surfaces.
        </HighlightBlock>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="important">The hub keeps
          surfaces consistent; routing routes
          events to the right places; cross-
          surface read actions propagate
          immediately;</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="crucial">out-of-order events
          handled idempotently. The result is
          notifications that feel coherent
          across every surface they appear on.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
