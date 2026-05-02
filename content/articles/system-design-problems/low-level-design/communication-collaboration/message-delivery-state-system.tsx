"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
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

export default function MessageDeliveryStateSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
          We are designing the system that tracks
          and displays message delivery state —
          the small icons next to each message
          showing whether it&rsquo;s sending,
          sent (server received), delivered (recipient
          device received), or read. The system is a
          subsystem of the chat UI that handles state
          transitions, retries on failure, and
          per-recipient tracking in group chats.
        </p>
        <p>
          The hard problems are: a clean state
          machine for the four states; optimistic
          send (the message appears as
          &ldquo;sending&rdquo; immediately, then
          progresses); retry on failure with
          exponential backoff; per-recipient
          tracking in groups (delivered to some,
          read by others); accessibility for the
          state indicators.
        </p>

        <h3>User Context</h3>
        <p>
          End users glance at their messages and
          see the delivery progression. Engineering
          teams plug into the chat system; this
          subsystem provides state semantics and
          rendering.
        </p>

        <h3>Assumptions</h3>
        <p>
          Backend exposes events for delivery and
          read receipts. Optimistic message
          insertion happens at send time; the
          subsystem owns state transitions
          thereafter.
        </p>

        <h3>Non-Goals</h3>
        <p>
          The chat UI itself, message storage,
          read-receipt collection
          (IntersectionObserver patterns are in
          the chat subsystem; here we just consume
          the events).
        </p>
      </section>

      <section>
        <h2>⚙️ Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
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
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          Read-by-list (popover showing who has
          read). Edited indicator (separate from
          delivery). Message-expired state
          (server-side TTL). Disappearing messages.
          Privacy mode (read receipts disabled).
        </p>

        <h3>Out of Scope</h3>
        <p>
          The transport, the chat UI, end-to-end
          encryption status (separate concern).
        </p>
      </section>

      <section>
        <h2>📊 Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          State transitions render in &lt;50 ms.
          Bulk read events (one user reads many
          messages at once) batch to avoid
          render flooding. Retry backoff
          rate-limited.
        </p>

        <h3>Reliability</h3>
        <p>
          Retries handle transient network errors.
          State transitions are idempotent (read
          arriving twice doesn&rsquo;t corrupt
          state). Failure surfaces clearly with
          actionable retry.
        </p>

        <h3>Security</h3>
        <p>
          Read receipts can leak presence; respect
          user privacy preferences (disable
          option). Server enforces who can see
          delivery state.
        </p>

        <h3>Accessibility</h3>
        <p>
          State icons have text equivalents
          (&ldquo;sent&rdquo;, &ldquo;read by
          Alice&rdquo;) for screen readers.
          Failed state announces.
        </p>

        <h3>Maintainability</h3>
        <p>
          Small state machine. Clean event
          contract. Renderer per state.
        </p>
      </section>

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
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
        </p>
        <p>
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
        </p>
        <p>
          On <strong>delivered event</strong>:
          server pushes when the recipient&rsquo;s
          device acknowledges receipt. Update
          state to <code>delivered</code>. For
          group chats, track per-recipient: a
          message can be delivered to some
          recipients before others.
        </p>
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
        <p>
          <strong>Renderer</strong>: state icon at
          end of message bubble. Conventions
          familiar from WhatsApp / Telegram /
          iMessage: clock for sending, single
          check for sent, double check for
          delivered, colored double check for
          read. Hover or focus shows tooltip
          with details.
        </p>
        <p>
          <strong>Retry on failure</strong>: fail
          state shows a small alert icon with a
          tooltip and a Retry button. Clicking
          retries with full backoff reset.
        </p>
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
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>DeliveryStateProvider</strong>{" "}
          maintains state per message.
          <strong> StateMachine</strong> handles
          transitions.
          <strong> RetryOrchestrator</strong>{" "}
          manages backoff and retries.
          <strong> StateIcon</strong> renders the
          icon with tooltip.
          <strong> ReadByList</strong> popover for
          group details.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          Per-message state in chat&rsquo;s message
          store, mutated by this subsystem.
          Per-recipient tracking attached to each
          message. Subscribers (state icon)
          re-render only on state change for that
          message.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Events: <code>message.sent</code>,
          <code> message.delivered</code>,
          <code> message.read</code>, each
          carrying message id and (for group)
          recipient id. Send response: message
          server id, sent timestamp. Retry
          contract: client-generated id stable
          across retries for idempotency.
        </p>
      </section>

      <section>
        <h2>⚡ Performance</h2>
        <p>
          State changes batch within RAF.
          Per-recipient updates aggregate before
          re-rendering. Retry backoff
          rate-limited.
        </p>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <p>
          Subtle icons; familiar conventions.
          Tooltip on hover for details. Failed
          state visible without being alarming.
          Read-by-list popover for power users
          who want details. Privacy-respecting:
          when receipts are disabled, no
          mismatch visible.
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          Icons have text equivalents. Screen
          readers announce state on focus.
          Failed state announces. Read-by-list
          accessible as a list.
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          Server enforces who can see what state.
          Privacy preferences respected. Read
          receipts can be opt-out per
          conversation or globally.
        </p>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <p>
          Unit tests for state machine
          transitions. Retry/backoff tests with
          simulated failures. Per-recipient
          aggregation tests. Accessibility tests
          for state announcements.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <p>
          Read event arrives before delivered:
          accept; jump state forward (delivered
          implied). Server reorders events: state
          machine accepts forward transitions
          only (no regression). Retry succeeds
          after manual click during automatic
          backoff: deduplicate via client-
          generated id. Recipient never reads
          (sent but unread for days): state
          stays at delivered; user sees the
          appropriate icon. Group with thousands
          of recipients: aggregate view shows
          counts; per-recipient details
          server-paginated.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <p>
          Pattern reuses across chat,
          notifications, email-like inboxes —
          anywhere state progression matters.
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          Tooltip strings via i18n. Read-by names
          display as authored. Counts via Intl.
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Per-recipient vs aggregate state</h3>
        <p>
          Per-recipient enables detailed
          views; aggregate is simpler. For DMs,
          aggregate is sufficient. For groups,
          per-recipient with on-demand expansion
          is the right balance.
        </p>

        <h3>Auto-retry vs explicit</h3>
        <p>
          Auto-retry handles transient blips
          gracefully. Explicit only is too rigid.
          We do auto-retry up to a limit, then
          surface for manual retry.
        </p>

        <h3>Show vs hide states</h3>
        <p>
          Sender always sees state; recipient
          doesn&rsquo;t need to see (it&rsquo;s
          their own state). We render only on
          sender&rsquo;s side.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          End-to-end encryption integrity status.
          Cross-device read sync. Smart icons
          (animated when transitioning). Detailed
          delivery analytics for power users.
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. What are the
          states?</strong> Sending, sent,
          delivered, read. Plus failed for the
          error case.
        </p>

        <p>
          <strong>2. How do retries
          work?</strong> Exponential backoff (1
          s, 2 s, 4 s, capped). Client-generated
          id ensures idempotency. After max
          retries, surface for manual retry.
        </p>

        <p>
          <strong>3. How is per-recipient state
          tracked in groups?</strong> Per-(message,
          recipient) state. Aggregate for the
          summary view; expand to per-recipient
          on hover or popover.
        </p>

        <p>
          <strong>4. How are out-of-order events
          handled?</strong> State machine accepts
          forward transitions only. Read before
          delivered → accept; mark delivered too
          (implied).
        </p>

        <p>
          <strong>5. How are privacy preferences
          honored?</strong> When read receipts are
          off, the recipient doesn&rsquo;t emit
          read events; the sender sees no read
          progression. Server enforces.
        </p>

        <p>
          <strong>6. How is this
          accessible?</strong> Icons have text
          equivalents. Screen readers announce
          state. Failed state announces with
          retry option.
        </p>

        <p>
          <strong>7. What ensures retry
          idempotency?</strong> Client-generated
          message id sent with every retry.
          Server dedupes by id.
        </p>

        <p>
          <strong>8. How does this integrate with
          the chat UI?</strong> The chat&rsquo;s
          message store has a state field per
          message; this subsystem updates it
          based on backend events. The chat
          renders state via the StateIcon
          component.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          A message delivery state system is{" "}
          <strong>per-message state machine +
          per-recipient tracking + retry
          orchestration + accessible icon
          rendering</strong>. State conventions
          familiar from messaging apps; per-
          recipient details for groups; privacy
          preferences honored. The result is
          trustworthy, glanceable delivery
          state that users come to rely on.
        </p>
      </section>
    </ArticleLayout>
  );
}
