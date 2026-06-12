"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-chat-messaging-ui",
  title: "Design a Chat / Messaging UI",
  description:
    "LLD for a chat UI: message grouping, read receipts, typing indicators, infinite scroll upward, media previews, optimistic send, and accessibility.",
  category: "low-level-design",
  subcategory: "communication-collaboration",
  slug: "chat-messaging-ui",
  wordCount: 7000,
  readingTime: 37,
  lastUpdated: "2026-04-30",
  tags: ["lld", "chat", "messaging", "websocket", "infinite-scroll", "react"],
  relatedTopics: [
    "infinite-scroll-virtualized-list",
    "typing-indicator-system",
    "message-delivery-state-system",
    "presence-last-seen-system",
  ],
};

export default function ChatMessagingUIArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a Chat Messaging UI</h1><h2>Definition &amp; Context</h2><p>Design a Chat Messaging UI is an implementation-heavy low-level design problem covering message pagination, optimistic sending, socket merge, scroll anchors, receipts, typing, attachments, and reconnect gaps. A principal-level answer must define ordering, ephemeral versus durable state, reconnect behavior, rollback, abuse controls, privacy, cost, and observability.</p><p>Keep a normalized message map, ordered ids, live edge, viewed window, and optimistic-id reconciliation separate. The core structures are message map, ordered ids, cursor ledger, live edge, optimistic ids, receipt watermark, typing TTLs, anchor record, and socket buffer.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/communication-collaboration/chat-messaging-ui-runtime.svg" alt="Design a Chat Messaging UI runtime" caption="Real-time flow from input through merge policy and UI projection." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific mechanics.</p><section>
        <h3>Problem Clarification</h3>
        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="important">
          We are designing a chat / messaging UI — the familiar two-pane (or
          single-pane on mobile) interface where users see a list of
          conversations, open a thread, and exchange messages in real time. The
          component is the backbone of any product with messaging: customer
          support tools, team chat, social DMs, in-app conversations. The UI
          must handle message grouping (consecutive messages from the same
          sender condense), read receipts, typing indicators, infinite scroll
          upward (older messages), media previews, optimistic send (the message
          appears instantly even if the server hasn&rsquo;t confirmed),
          delivery/read state visualization, and smooth real-time updates as new
          messages arrive.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The hard problems are: scroll-position preservation as old messages
          prepend (scroll up, more arrive — the user&rsquo;s view
          shouldn&rsquo;t shift); auto-scroll on new messages only when at the
          bottom; message grouping that adapts as messages stream in; optimistic
          send with rollback on failure; integration with WebSocket for live
          updates; accessibility for the dynamic chat content; and image/file
          attachment integration.
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          End users chat with each other, with support agents, with bots. They
          expect messaging fluency: instant send, fast delivery, clear read
          state. Internal users (engineering teams) integrate via a hook-based
          API: provide a thread source, a send function, and the runtime handles
          UI mechanics.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Backend exposes a WebSocket for real-time messages and presence, plus
          REST for history fetch (cursor-paginated upward for older messages).
          Each message has an id, sender, content, timestamp, status
          (sending/sent/delivered/read), attachments. Modern browsers; we use
          the WebSocket API, IntersectionObserver for read receipts,
          ResizeObserver for variable message heights.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement the messaging backend (MQTT, XMPP, custom
          protocols are consumed via adapters). We do not implement end-to-end
          encryption (separate subsystem). We do not implement video/audio calls
          (separate). Threading inside a message (replies) is delegated to the
          Threaded Conversation subsystem.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚙️ Functional Requirements</h3>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          Conversation list (sidebar) with last message preview, unread badge,
          timestamp. Message thread for the active conversation. Messages from
          the user render right- aligned with a colored bubble; from others
          left-aligned with a neutral bubble. Avatar next to messages from
          others (collapsed for grouped consecutive messages from the same
          sender). Message grouping: consecutive messages from the same sender
          within a time window condense (avatar shown once, smaller gaps).
          Timestamps shown selectively (on hover; on grouped boundaries). Send
          input at the bottom with Enter to send, Shift-Enter for newline.
          Optimistic send with status indicators (sending, sent, delivered,
          read). Infinite scroll upward for older messages. Auto-scroll to
          bottom on new message only when user is near bottom. Typing indicators
          at the bottom of the thread. Read receipts. Image and file attachments
          inline. Empty state. Loading state.
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Reactions (emoji on messages). Reply- to-message (quoted reply). Edit
          and delete messages. Pinned messages. Search within conversation.
          Mentions (@someone). Inline link previews (oEmbed). Voice messages.
          Read-by-list for group chats. Snooze / do-not-disturb. Translation.
          Drafts per conversation.
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          End-to-end encryption, voice/video calls, server-side message storage
          architecture, cross-device push notifications.
        </HighlightBlock>
      </section>

      <section>
        <h3>📊 Non-Functional Requirements</h3>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          New messages render instantly (optimistic). Scroll smooth at 60 fps
          even with long threads. Older message fetch transparent (no flicker).
          Typing indicator renders without jank. Many conversations in the
          sidebar virtualized.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="crucial">
          Optimistic sends rollback on failure with retry. Delivery state
          accurate. Reconnection on disconnect resumes state. Concurrent sends
          from multiple tabs deduplicate.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          Messages render as text; HTML/markdown opt-in via sanitizer. URLs
          validated before showing previews. Cross-user authorization enforced
          server-side.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="important">
          Conversation list as a navigable list. Messages announce as they
          arrive (polite live region, throttled). Send input is a real textarea.
          Read receipts and typing indicators have text equivalents.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          Backend adapter for WebSocket + REST. Renderers per message type
          (text, image, file, voice). Plugins for reactions, reply-to, mentions.
        </HighlightBlock>
      </section>

      

      <section>
        <h3>🧠 Solution Approach</h3>
        <HighlightBlock as="p" tier="important">
          The chat is built around a{" "}
          <strong>per- conversation message store</strong> (ordered list,
          deduped by id), a <strong>WebSocket adapter</strong> for real-time
          messages, a<strong> virtualized scroller</strong> with upward
          infinite-scroll, an
          <strong> optimistic send pipeline</strong>, and a{" "}
          <strong>read-receipt tracker</strong>.
        </HighlightBlock>
        <p>
          The <strong>message store</strong> per conversation holds messages in
          chronological order, deduped by id. New messages from WebSocket
          append. Older messages from REST prepend on upward scroll. Optimistic
          messages have a temporary id; on server confirmation, the temporary id
          maps to the server id and merges. The store fires events on change so
          subscribers (the message list) re-render only the affected portion.
        </p>
        <HighlightBlock as="p" tier="crucial">
          The <strong>virtualized scroller</strong> is similar to the Infinite
          Scroll Virtualized List but with upward orientation: scroll position 0
          is the newest message; scrolling up reveals older. We virtualize
          variable-height messages with a measured-height cache. On older
          message prepend, we adjust scrollTop by the prepended height in the
          same frame to keep the user&rsquo;s view stable. Without this,
          prepending would push the visible content down.
        </HighlightBlock>
        <p>
          On <strong>new message arrival</strong> (via WebSocket): if the user
          is at or near the bottom of the thread, we auto-scroll to the new
          message. If they&rsquo;ve scrolled up to read older context, we
          surface a &ldquo;X new messages&rdquo; banner; clicking it scrolls
          down. Auto-scroll while reading is hostile UX; we respect user intent.
        </p>
        <HighlightBlock as="p" tier="important">
          On <strong>send</strong>: the user types and presses Enter. The
          message immediately appears in the list with a temporary id and status
          <code> sending</code>. We dispatch to the backend; on success, status
          becomes
          <code> sent</code>; on failure, status becomes <code>failed</code>{" "}
          with a Retry action. The message persists with temporary id until the
          server-confirmed message arrives via WebSocket; we then merge by
          replacing the temporary entry with the server entry. This optimistic
          flow makes send feel instant.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Message grouping</strong>: as messages render, we look at
          adjacent messages from the same sender within a time window (e.g. 2
          minutes). Grouped messages collapse the avatar (shown only on the
          first) and reduce vertical gap. Time labels show on group boundaries.
          Grouping is a render-time decision based on the sequence; as new
          messages arrive, grouping updates automatically.
        </HighlightBlock>
        <p>
          <strong>Read receipts</strong>: when a message&rsquo;s element
          intersects the viewport (via IntersectionObserver), we send a read
          event to the server. Batched per second to avoid flooding. The
          sender&rsquo;s side receives the read event and updates the
          message&rsquo;s status to <code>read</code>; the status indicator on
          the sender&rsquo;s message updates.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>Typing indicator</strong>: the local user types; a debounced
          event sends &ldquo;X is typing&rdquo; to the server, which broadcasts
          to other conversation participants. The remote UI shows the typing
          indicator at the bottom of the thread. The indicator disappears after
          a timeout if no new typing event arrives. Detail in the Typing
          Indicator subsystem.
        </HighlightBlock>
        <p>
          <strong>Attachments</strong>: drag-drop or paste an image or file. The
          File Upload System handles transport; meanwhile, an attachment
          placeholder appears in the message with upload progress. On
          completion, the message ships with the attachment URL.
        </p>
        <p>
          <strong>Reconnection</strong>: WebSocket disconnects; we surface a
          subtle status. Reconnect with backoff. On reconnect, fetch any missed
          messages via REST (since-timestamp endpoint) and merge.
        </p>
      </section>

      <section>
        <h3>🧱 Component Architecture</h3>
        <HighlightBlock as="p" tier="crucial"><strong> MessageBubble</strong> renders one message with grouping
          context.
          <strong> SendInput</strong> is the composer.{" "}
          <strong>TypingIndicator</strong></HighlightBlock>
<HighlightBlock as="p" tier="important">renders typing state.
          <Highlight tier="important"><strong> AttachmentPicker</strong></Highlight> handles file drops/paste.
          <strong> ReadReceiptTracker</strong> observes message visibility.</HighlightBlock>
      </section>

      <section>
        <h3>🔄 State Management</h3>
        <HighlightBlock as="p" tier="crucial">Active conversation, send state, scroll position per
          conversation in</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">component state. WebSocket connection state in a
          shared connection store.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Data Flow &amp; Contracts</h3>
        <HighlightBlock as="p" tier="important">
          <Highlight tier="crucial">Message shape:</Highlight>{" "}
          <Highlight tier="important">
            <code>{` { id, conversationId, senderId, content, attachments?, createdAt, status, replyTo? } `}</code>
          </Highlight>
          . Backend events: <code>message.new</code>, <code>message.read</code>,{" "}
          <code>typing.start</code>, <code>typing.stop</code>, <code>presence.update</code>.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚡ Performance</h3>
        <HighlightBlock as="p" tier="crucial">Virtualization scopes mounted DOM. Message bubbles memoized by (id,</HighlightBlock>
<HighlightBlock as="p" tier="important">status, grouping). Optimistic sends are local-only until server
          confirms.</HighlightBlock>
<HighlightBlock as="p" tier="important">Read receipt events batched. WebSocket updates batched in
          <code> requestAnimationFrame</code> ticks to prevent re-render
          flooding.</HighlightBlock>
      </section>

      <section>
        <h3>🎨 UX</h3>
        <HighlightBlock as="p" tier="crucial">Optimistic messages show subtle
          &ldquo;sending&rdquo; state. Failed messages show retry. Typing</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">indicator subtly animated. Read receipts as subtle eye icons or text.
          Attachment previews inline.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>♿ Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">Send input is a
          textarea with proper labeling. Read receipts have text</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">alternatives.
          Typing indicators announce on first state change but not continuously.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔐 Security</h3>
        <HighlightBlock as="p" tier="crucial">Messages render as text; markdown opt-in via sanitizer. URLs validated</HighlightBlock>
<HighlightBlock as="p" tier="important">before showing previews. Cross-user authorization server-enforced.</HighlightBlock>
<HighlightBlock as="p" tier="important">End-to- end encryption out of scope but accommodatable via consumer
          hooks.</HighlightBlock>
      </section>

      <section>
        <h3>🧪 Testing</h3>
        <HighlightBlock as="p" tier="crucial">Unit tests for message store (dedup, prepend/append, optimistic
          merge). Integration</HighlightBlock>
<HighlightBlock as="p" tier="important">tests with mock backend: send + confirm; receive
          new; scroll up triggering</HighlightBlock>
<HighlightBlock as="p" tier="important">older fetch; reconnection. Visual tests for
          grouping behavior. Accessibility tests.</HighlightBlock>
      </section>

      <section>
        <h3>🚨 Edge Cases</h3>
        <HighlightBlock as="p" tier="crucial">Very long message: bubble
          grows; virtualization handles. Message edited server-side: update via
          WebSocket. Conversation deleted while</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">user is in it: surface banner
          and navigate away. Typing indicator from someone who leaves the
          conversation: clear after timeout.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Reusability</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Backend adapter for any messaging protocol. Renderers per message type
          plug <Highlight tier="important">in. The pattern (store + scroller</Highlight> + optimistic send) reuses for
          support chat, team chat, DMs, comments.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🌍 Internationalization</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          UI strings via i18n. Timestamps <Highlight tier="important">via
          </Highlight><code> Intl.RelativeTimeFormat</code>. RTL flips message bubble</Highlight>
          alignment via CSS logical properties.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚖️ Trade-offs</h3>

        <h3>Optimistic send vs confirmed-first</h3>
        <HighlightBlock as="p" tier="crucial">
          Optimistic feels instant; rollback on failure. Confirmed-first feels
          slow. Optimistic is essential for messaging UX.
        </HighlightBlock>

        <h3>Auto-scroll on new vs banner</h3>
        <HighlightBlock as="p" tier="important">
          Auto-scroll while reading is hostile. Banner respects intent. We
          always banner unless user is at bottom.
        </HighlightBlock>

        <h3>WebSocket only vs WebSocket + REST</h3>
        <HighlightBlock as="p" tier="important">
          WebSocket for real-time; REST for history. The combination handles
          both fast updates and lazy backfill.
        </HighlightBlock>

        <h3>Render grouping vs server-grouped</h3>
        <HighlightBlock as="p" tier="important">
          Render-time grouping adapts as messages stream. Server-grouped is
          fixed and doesn&rsquo;t handle real-time additions cleanly.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔮 Future Improvements</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          End-to-end encryption. Voice messages. Real-time <Highlight tier="important">translation.
          AI-suggested replies. Video calls. Cross-device</Highlight> read sync via service
          worker push.
        </Highlight></HighlightBlock>
      </section></section>
<section><h2>Architecture &amp; Flow</h2><p>Separate durable records, optimistic intent, transport events, ephemeral awareness, rendered projection, and telemetry. Every connection, timer, cursor, replay buffer, subscription, and retry queue needs an explicit owner and cleanup path.</p><p>Keep a normalized message map, ordered ids, live edge, viewed window, and optimistic-id reconciliation separate.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/communication-collaboration/chat-messaging-ui-recovery.svg" alt="Design a Chat Messaging UI recovery" caption="Recovery flow: classify gaps, retain stable truth, replay safely, and emit evidence." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Polling is simpler; sockets are justified for low-latency messaging but still require cursor recovery.</p><p>Server sequence is durable ordering truth. Optimistic sends are provisional; receipts are monotonic and typing is ephemeral. Scale pressure comes from history gaps, out-of-order events, media shifts, reconnect replay, burst traffic, and users reading older messages. Bound queues, dedupe events, expire ephemeral state, and degrade predictably.</p></section>
<section><h2>Best practices</h2><p>Use stable ids, event sequences, idempotency keys, monotonic watermarks, TTLs, replay cursors, bounded buffers, authorization checks, and cleanup. Test reconnect gaps, duplicates, stale events, offline recovery, privacy settings, and accessibility announcements.</p><p>Measure latency, backlog, reconnect rate, gap recovery, retries, stale drops, TTL expiry, and accessibility regressions without logging sensitive content.</p><h3>Operational implementation: message sequence and optimistic reconciliation</h3><p>Store server ids separately from client idempotency keys. Merge socket events by conversation sequence, reconcile optimistic rows after acknowledgement, detect replay gaps, preserve scroll anchors when prepending history, and retain failed drafts for explicit retry.</p><p>Define explicit metrics for accepted events, duplicate drops, stale drops, replay gap size, reconnect duration, queue depth, TTL expiry, degraded-mode entry, authorization denial, and rollback outcome. Redact user content and sensitive identifiers from telemetry. Test duplicate delivery, out-of-order events, disconnect during mutation, hidden tabs, unmount cleanup, multiple tabs, permission removal, burst traffic, and a rollback to the previous policy version.</p></section>
<section><h2>Common Pitfalls</h2><p>Common failures include treating ephemeral state as durable, trusting arrival order, leaking timers or sockets, missing dedupe, unbounded replay, and hiding degraded connectivity.</p><p>For this topic, buffer initial socket events, dedupe ids, detect gaps, preserve prepend anchors, retry failed sends, and retain typed drafts.</p></section>
<section><h2>Real-world use cases</h2><p>This design applies to collaborative products where transport, persistence, and UI projection fail independently. Inject product policy for authorization, retention, fallback, and observability explicitly.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Keep a normalized message map, ordered ids, live edge, viewed window, and optimistic-id reconciliation separate.</p><h3>What breaks at scale?</h3><p>history gaps, out-of-order events, media shifts, reconnect replay, burst traffic, and users reading older messages.</p><h3>What consistency applies?</h3><p>Server sequence is durable ordering truth. Optimistic sends are provisional; receipts are monotonic and typing is ephemeral.</p><h3>How do you recover?</h3><p>buffer initial socket events, dedupe ids, detect gaps, preserve prepend anchors, retry failed sends, and retain typed drafts.</p><h3>Why this architecture?</h3><p>Polling is simpler; sockets are justified for low-latency messaging but still require cursor recovery.</p></section>
<section><h2>References</h2><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSocket" target="_blank" rel="noreferrer">MDN WebSocket</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA APG</a></li><li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React state ownership</a></li></ul></section>
</ArticleLayout>}