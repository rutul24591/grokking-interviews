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

export default function MessageDeliveryStateSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

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
        <h2>⚙️ Functional Requirements</h2>

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
        <h2>📊 Non-Functional Requirements</h2>

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
        <h2>🧠 Solution Approach</h2>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/communication-collaboration/message-delivery-state-system-architecture.svg"
          alt="Message delivery state system architecture showing message model, status FSM transitions, sending with idempotency, delivery receipts, status icons, read receipt display, retry logic, and offline IndexedDB queue"
          caption="Architecture Overview"
        />
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
        <h2>🧱 Component Architecture</h2>
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
        <h2>🔄 State Management</h2>
        <HighlightBlock as="p" tier="crucial">Per-message state in chat&rsquo;s message
          store, mutated by this subsystem.</HighlightBlock>
<HighlightBlock as="p" tier="important">Per-recipient tracking attached to each
          message. Subscribers</HighlightBlock>
<HighlightBlock as="p" tier="important">(state icon)
          re-render only on state change for that
          message.</HighlightBlock>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
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
        <h2>⚡ Performance</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          State changes batch <Highlight tier="important">within RAF.
          Per-recipient updates aggregate before</Highlight>
          re-rendering. Retry backoff
          rate-limited.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <HighlightBlock as="p" tier="crucial">Subtle icons; familiar conventions.
          Tooltip on hover for details. Failed
          state visible without being alarming.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Read-by-list popover for power users
          who want details. Privacy-respecting:
          when receipts are disabled, no
          mismatch visible.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Icons have text equivalents. Screen
          readers <Highlight tier="important">announce state on focus.
          Failed state</Highlight> announces. Read-by-list
          accessible as a list.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Server enforces who can see what <Highlight tier="important">state.
          Privacy preferences respected. Read
          receipts</Highlight> can be opt-out per
          conversation or globally.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Unit tests for state machine
          transitions. <Highlight tier="important">Retry/backoff tests with
          simulated failures. Per-recipient</Highlight>
          aggregation tests. Accessibility tests
          for state announcements.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
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
        <h2>🔁 Reusability</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Pattern reuses across <Highlight tier="important">chat,
          notifications, email-like inboxes —
          anywhere</Highlight> state progression matters.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Tooltip strings via <Highlight tier="important">i18n. Read-by names
          display as authored.</Highlight> Counts via Intl.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

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
        <h2>🔮 Future Improvements</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          End-to-end encryption integrity status.
          Cross-device read <Highlight tier="important">sync. Smart icons
          (animated when transitioning).</Highlight> Detailed
          delivery analytics for power users.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. What are the
          states?</strong> Sending, sent,
          delivered, read. Plus failed for the
          error case.
        </p>

        <HighlightBlock as="p" tier="crucial">
          <strong>2. How do retries
          work?</strong> Exponential backoff (1
          s, 2 s, 4 s, capped). Client-generated
          id ensures idempotency. After max
          retries, surface for manual retry.
        </HighlightBlock>

        <p>
          <strong>3. How is per-recipient state
          tracked in groups?</strong> Per-(message,
          recipient) state. Aggregate for the
          summary view; expand to per-recipient
          on hover or popover.
        </p>

        <HighlightBlock as="p" tier="important">
          <strong>4. How are out-of-order events
          handled?</strong> State machine accepts
          forward transitions only. Read before
          delivered → accept; mark delivered too
          (implied).
        </HighlightBlock>

        <p>
          <strong>5. How are privacy preferences
          honored?</strong> When read receipts are
          off, the recipient doesn&rsquo;t emit
          read events; the sender sees no read
          progression. Server enforces.
        </p>

        <HighlightBlock as="p" tier="important">
          <strong>6. How is this
          accessible?</strong> Icons have text
          equivalents. Screen readers announce
          state. Failed state announces with
          retry option.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>7. What ensures retry
          idempotency?</strong> Client-generated
          message id sent with every retry.
          Server dedupes by id.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>8. How does this integrate with
          the chat UI?</strong> The chat&rsquo;s
          message store has a state field per
          message; this subsystem updates it
          based on backend events. The chat
          renders state via the StateIcon
          component.
        </HighlightBlock>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <HighlightBlock as="p" tier="crucial">State conventions
          familiar from messaging apps; per-
          recipient details for groups; privacy</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">preferences honored. The result is
          trustworthy, glanceable delivery
          state that users come to rely on.</Highlight></HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
