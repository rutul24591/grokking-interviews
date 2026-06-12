"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-message-delivery-state-system",
  title: "Design a Message Delivery State System",
  description:
    "LLD for tracking message delivery: sending, sent, delivered, read states with optimistic UI, retries, failure handling, and per-recipient tracking.",
  category: "low-level-design",
  subcategory: "communication-collaboration",
  slug: "message-delivery-state-system",
  wordCount: 5500,
  readingTime: 29,
  lastUpdated: "2026-04-30",
  tags: ["lld", "message-delivery", "real-time", "react"],
  relatedTopics: [
    "chat-messaging-ui",
    "typing-indicator-system",
    "real-time-notification-delivery-system",
  ],
};

export default function MessageDeliveryStateSystemArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a Message Delivery State System</h1><h2>Definition &amp; Context</h2><p>Design a Message Delivery State System is an implementation-heavy low-level design problem covering client ids, send queue, acknowledgements, delivered and read watermarks, retries, dedupe, and multi-device merge. A principal-level answer must define ordering, ephemeral versus durable state, reconnect behavior, rollback, abuse controls, privacy, cost, and observability.</p><p>Model sending, sent, delivered, read, and failed as monotonic transitions except explicit retry from failed. The core structures are client id, server id, queue entry, idempotency key, retry schedule, delivery watermark, read watermark, device state, and evidence.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/communication-collaboration/message-delivery-state-system-runtime.svg" alt="Design a Message Delivery State System runtime" caption="Real-time flow from input through merge policy and UI projection." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific mechanics.</p><section>
        <h3>🎯 Problem Context &amp; Scope Definition</h3>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="important">
          We are designing the system that tracks
          and displays message delivery state —
          the small icons next to each message
          showing whether it&rsquo;s sending,
          sent (server received), delivered (recipient
          device received), or read. The system is a
          subsystem of the chat UI that handles state
          transitions, retries on failure, and
          per-recipient tracking in group chats.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The hard problems are: a clean state
          machine for the four states; optimistic
          send (the message appears as
          &ldquo;sending&rdquo; immediately, then
          progresses); retry on failure with
          exponential backoff; per-recipient
          tracking in groups (delivered to some,
          read by others); accessibility for the
          state indicators.
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          End users glance at their messages and
          see the delivery progression. Engineering
          teams plug into the chat system; this
          subsystem provides state semantics and
          rendering.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Backend exposes events for delivery and
          read receipts. Optimistic message
          insertion happens at send time; the
          subsystem owns state transitions
          thereafter.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          The chat UI itself, message storage,
          read-receipt collection
          (IntersectionObserver patterns are in
          the chat subsystem; here we just consume
          the events).
        </HighlightBlock>
      </section>

      <section>
        <h3>⚙️ Functional Requirements</h3>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          Four states: sending, sent, delivered,
          read. State transitions trigger UI
          updates. Retry on send failure with
          exponential backoff. Failed state with
          manual retry. Per-recipient tracking in
          group chats (e.g. &ldquo;read by 3 of 5
          recipients&rdquo;). State indicator next
          to message (single check, double check,
          double check colored, etc. — typical
          messaging conventions).
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Read-by-list (popover showing who has
          read). Edited indicator (separate from
          delivery). Message-expired state
          (server-side TTL). Disappearing messages.
          Privacy mode (read receipts disabled).
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          The transport, the chat UI, end-to-end
          encryption status (separate concern).
        </HighlightBlock>
      </section>

      <section>
        <h3>📊 Non-Functional Requirements</h3>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          State transitions render in &lt;50 ms.
          Bulk read events (one user reads many
          messages at once) batch to avoid
          render flooding. Retry backoff
          rate-limited.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="crucial">
          Retries handle transient network errors.
          State transitions are idempotent (read
          arriving twice doesn&rsquo;t corrupt
          state). Failure surfaces clearly with
          actionable retry.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          Read receipts can leak presence; respect
          user privacy preferences (disable
          option). Server enforces who can see
          delivery state.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="important">
          State icons have text equivalents
          (&ldquo;sent&rdquo;, &ldquo;read by
          Alice&rdquo;) for screen readers.
          Failed state announces.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          Small state machine. Clean event
          contract. Renderer per state.
        </HighlightBlock>
      </section>

      <section>
        <h3>🧠 Solution Approach</h3>
        
        <HighlightBlock as="p" tier="important">
          The system is a per-message state
          machine plus a per-recipient tracker for
          groups. State transitions:
          <code> sending → sent</code> (server
          ack), <code>sent → delivered</code>
          (recipient device confirms),
          <code> delivered → read</code> (recipient
          views). Failure path:{" "}
          <code>sending → failed</code> (with
          retries). Each transition driven by
          backend events.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          On <strong>send</strong>: insert message
          with state <code>sending</code> and a
          client-generated id. Issue server
          request. On 200: state <code>sent</code>;
          server returns the canonical message id
          which we map to the client id. On
          failure: retry with exponential backoff
          (1 s, 2 s, 4 s, capped). After max
          retries: state <code>failed</code> with
          a Retry action.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          On <strong>delivered event</strong>:
          server pushes when the recipient&rsquo;s
          device acknowledges receipt. Update
          state to <code>delivered</code>. For
          group chats, track per-recipient: a
          message can be delivered to some
          recipients before others.
        </HighlightBlock>
        <p>
          On <strong>read event</strong>: server
          pushes when the recipient views.
          Update to <code>read</code>. Group:
          per-recipient.
        </p>
        <p>
          <strong>Per-recipient tracking</strong>:
          state per (message, recipient).
          Aggregate view: &ldquo;read by 3 of 5&rdquo;
          or specific names on a popover.
          Aggregate state: <code>read</code> when
          all recipients have read; else max of
          all recipients&rsquo; states.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>Renderer</strong>: state icon at
          end of message bubble. Conventions
          familiar from WhatsApp / Telegram /
          iMessage: clock for sending, single
          check for sent, double check for
          delivered, colored double check for
          read. Hover or focus shows tooltip
          with details.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Retry on failure</strong>: fail
          state shows a small alert icon with a
          tooltip and a Retry button. Clicking
          retries with full backoff reset.
        </HighlightBlock>
        <p>
          <strong>Privacy mode</strong>: when read
          receipts are off (per user preference
          or per conversation), the system stops
          emitting read events from the recipient
          and stops showing read state to the
          sender. The state transition for read
          simply doesn&rsquo;t fire.
        </p>
      </section>

      <section>
        <h3>🧱 Component Architecture</h3>
        <HighlightBlock as="p" tier="crucial">
          <strong>DeliveryStateProvider</strong> maintains state per message.{" "}
          <strong>StateMachine</strong> handles transitions.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>RetryOrchestrator</strong> manages backoff and retries.{" "}
          <Highlight tier="important"><strong>StateIcon</strong></Highlight>{" "}
          renders the icon with tooltip. <strong>ReadByList</strong> popover for
          group details.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔄 State Management</h3>
        <HighlightBlock as="p" tier="crucial">Per-message state in chat&rsquo;s message
          store, mutated by this subsystem.</HighlightBlock>
<HighlightBlock as="p" tier="important">Per-recipient tracking attached to each
          message. Subscribers</HighlightBlock>
<HighlightBlock as="p" tier="important">(state icon)
          re-render only on state change for that
          message.</HighlightBlock>
      </section>

      <section>
        <h3>🔁 Data Flow &amp; Contracts</h3>
        <HighlightBlock as="p" tier="crucial">Events: <code>message.sent</code>,
          <code> message.delivered</code>,
          <code> message.read</code>, each
          carrying message id and (for group)
          recipient id.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Send response: message
          server id, sent timestamp. Retry
          contract: client-generated id stable
          across retries for idempotency.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>⚡ Performance</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          State changes batch <Highlight tier="important">within RAF.
          Per-recipient updates aggregate before</Highlight>
          re-rendering. Retry backoff
          rate-limited.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🎨 UX</h3>
        <HighlightBlock as="p" tier="crucial">Subtle icons; familiar conventions.
          Tooltip on hover for details. Failed
          state visible without being alarming.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Read-by-list popover for power users
          who want details. Privacy-respecting:
          when receipts are disabled, no
          mismatch visible.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>♿ Accessibility</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Icons have text equivalents. Screen
          readers <Highlight tier="important">announce state on focus.
          Failed state</Highlight> announces. Read-by-list
          accessible as a list.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔐 Security</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Server enforces who can see what <Highlight tier="important">state.
          Privacy preferences respected. Read
          receipts</Highlight> can be opt-out per
          conversation or globally.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🧪 Testing</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Unit tests for state machine
          transitions. <Highlight tier="important">Retry/backoff tests with
          simulated failures. Per-recipient</Highlight>
          aggregation tests. Accessibility tests
          for state announcements.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🚨 Edge Cases</h3>
        <HighlightBlock as="p" tier="crucial">Recipient never reads
          (sent but unread for days): state
          stays at delivered; user sees the
          appropriate icon.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Group with thousands
          of recipients: aggregate view shows
          counts; per-recipient details
          server-paginated.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Reusability</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Pattern reuses across <Highlight tier="important">chat,
          notifications, email-like inboxes —
          anywhere</Highlight> state progression matters.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🌍 Internationalization</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Tooltip strings via <Highlight tier="important">i18n. Read-by names
          display as authored.</Highlight> Counts via Intl.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>⚖️ Trade-offs</h3>

        <h3>Per-recipient vs aggregate state</h3>
        <HighlightBlock as="p" tier="important">
          Per-recipient enables detailed
          views; aggregate is simpler. For DMs,
          aggregate is sufficient. For groups,
          per-recipient with on-demand expansion
          is the right balance.
        </HighlightBlock>

        <h3>Auto-retry vs explicit</h3>
        <HighlightBlock as="p" tier="crucial">
          Auto-retry handles transient blips
          gracefully. Explicit only is too rigid.
          We do auto-retry up to a limit, then
          surface for manual retry.
        </HighlightBlock>

        <h3>Show vs hide states</h3>
        <HighlightBlock as="p" tier="important">
          Sender always sees state; recipient
          doesn&rsquo;t need to see (it&rsquo;s
          their own state). We render only on
          sender&rsquo;s side.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔮 Future Improvements</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          End-to-end encryption integrity status.
          Cross-device read <Highlight tier="important">sync. Smart icons
          (animated when transitioning).</Highlight> Detailed
          delivery analytics for power users.
        </Highlight></HighlightBlock>
      </section></section>
<section><h2>Architecture &amp; Flow</h2><p>Separate durable records, optimistic intent, transport events, ephemeral awareness, rendered projection, and telemetry. Every connection, timer, cursor, replay buffer, subscription, and retry queue needs an explicit owner and cleanup path.</p><p>Model sending, sent, delivered, read, and failed as monotonic transitions except explicit retry from failed.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/communication-collaboration/message-delivery-state-system-recovery.svg" alt="Design a Message Delivery State System recovery" caption="Recovery flow: classify gaps, retain stable truth, replay safely, and emit evidence." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Per-message receipts are precise but costly; watermarks are justified for scalable ordered conversations.</p><p>Server ids and per-conversation watermarks are authoritative. Client states project optimistically and reconcile idempotently. Scale pressure comes from offline sends, duplicates, delayed ack, multi-device reads, reconnect replay, and burst delivery. Bound queues, dedupe events, expire ephemeral state, and degrade predictably.</p></section>
<section><h2>Best practices</h2><p>Use stable ids, event sequences, idempotency keys, monotonic watermarks, TTLs, replay cursors, bounded buffers, authorization checks, and cleanup. Test reconnect gaps, duplicates, stale events, offline recovery, privacy settings, and accessibility announcements.</p><p>Measure latency, backlog, reconnect rate, gap recovery, retries, stale drops, TTL expiry, and accessibility regressions without logging sensitive content.</p><h3>Operational implementation: monotonic message delivery transitions</h3><p>Model localPending, sent, delivered, read, and failed as monotonic transitions. Reconcile client and server ids, dedupe acknowledgements, retain retry intent, and prevent a late delivered event from moving an already-read message backward.</p><p>Define explicit metrics for accepted events, duplicate drops, stale drops, replay gap size, reconnect duration, queue depth, TTL expiry, degraded-mode entry, authorization denial, and rollback outcome. Redact user content and sensitive identifiers from telemetry. Test duplicate delivery, out-of-order events, disconnect during mutation, hidden tabs, unmount cleanup, multiple tabs, permission removal, burst traffic, and a rollback to the previous policy version.</p></section>
<section><h2>Common Pitfalls</h2><p>Common failures include treating ephemeral state as durable, trusting arrival order, leaking timers or sockets, missing dedupe, unbounded replay, and hiding degraded connectivity.</p><p>For this topic, dedupe by idempotency key, retry with jitter, merge monotonic watermarks, preserve failed items, and explain retry.</p></section>
<section><h2>Real-world use cases</h2><p>This design applies to collaborative products where transport, persistence, and UI projection fail independently. Inject product policy for authorization, retention, fallback, and observability explicitly.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Model sending, sent, delivered, read, and failed as monotonic transitions except explicit retry from failed.</p><h3>What breaks at scale?</h3><p>offline sends, duplicates, delayed ack, multi-device reads, reconnect replay, and burst delivery.</p><h3>What consistency applies?</h3><p>Server ids and per-conversation watermarks are authoritative. Client states project optimistically and reconcile idempotently.</p><h3>How do you recover?</h3><p>dedupe by idempotency key, retry with jitter, merge monotonic watermarks, preserve failed items, and explain retry.</p><h3>Why this architecture?</h3><p>Per-message receipts are precise but costly; watermarks are justified for scalable ordered conversations.</p></section>
<section><h2>References</h2><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSocket" target="_blank" rel="noreferrer">MDN WebSocket</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA APG</a></li><li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React state ownership</a></li></ul></section>
</ArticleLayout>}