"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-typing-indicator-system",
  title: "Design a Typing Indicator System",
  description:
    "LLD for typing indicators: debounced broadcast, timeout cleanup, multi-user aggregation, accessibility, and integration with chat/editor systems.",
  category: "low-level-design",
  subcategory: "communication-collaboration",
  slug: "typing-indicator-system",
  wordCount: 5500,
  readingTime: 29,
  lastUpdated: "2026-04-30",
  tags: ["lld", "typing-indicator", "real-time", "react"],
  relatedTopics: [
    "chat-messaging-ui",
    "live-cursor-presence-system",
    "real-time-collaborative-editor",
  ],
};

export default function TypingIndicatorSystemArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a Typing Indicator System</h1><h2>Definition &amp; Context</h2><p>Design a Typing Indicator System is an implementation-heavy low-level design problem covering debounced broadcast, renewal, stop events, TTL cleanup, multi-user aggregation, accessibility announcements, and reconnect. A principal-level answer must define ordering, ephemeral versus durable state, reconnect behavior, rollback, abuse controls, privacy, cost, and observability.</p><p>Treat typing indicators as lossy conversation-scoped TTL state, never as durable message data. The core structures are conversation id, participant map, last renewal, expiry TTL, local debounce, broadcast throttle, aggregate label, and announcement state.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/communication-collaboration/typing-indicator-system-runtime.svg" alt="Design a Typing Indicator System runtime" caption="Real-time flow from input through merge policy and UI projection." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific mechanics.</p><section>
        <h3>🎯 Problem Context &amp; Scope Definition</h3>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="important">
          We are designing a typing indicator system —
          the UI that shows &ldquo;Alice is
          typing&hellip;&rdquo; or &ldquo;Alice and Bob
          are typing&hellip;&rdquo; when other users
          are composing messages. The component is a
          tiny but expectation-setting feature in
          chat and collaborative apps. Done well it&rsquo;s
          imperceptibly fluid; done poorly it
          flickers or persists incorrectly after the
          user stopped typing.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The hard problems are: debounced broadcast
          so we don&rsquo;t spam the server on every
          keystroke; reliable cleanup so the
          indicator clears when the user stops or
          sends; aggregating multiple typers into
          natural language (&ldquo;X is typing&rdquo;,
          &ldquo;X and Y are typing&rdquo;, &ldquo;X
          and 3 others are typing&rdquo;); accessibility
          (screen readers shouldn&rsquo;t announce
          typing on every change).
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          End users see indicators when others are
          typing. Engineering teams plug in: provide
          a transport (WebSocket, awareness channel)
          and the indicator handles UX.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Transport is a real-time channel. User
          metadata available. Modern browsers.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement the underlying
          transport. We do not implement message
          delivery (separate Message Delivery State
          system).
        </HighlightBlock>
      </section>

      <section>
        <h3>⚙️ Functional Requirements</h3>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          Detect local typing (input change events).
          Broadcast typing-start; broadcast typing-
          stop on send, blur, or timeout. Receive
          remote typing events; render indicator.
          Aggregate multiple typers naturally.
          Auto-clear stale indicators (timeout if
          no update). Per-conversation scope (only
          show typers in the current conversation).
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Indicator fade in/out animation.
          Per-typer dot animation in the bubble.
          Indicate typing in editor pane (which
          paragraph being edited). Smart batching
          (don&rsquo;t announce immediately on every
          start; require a few hundred ms of typing
          first).
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          Transport, message delivery, presence
          (related but separate).
        </HighlightBlock>
      </section>

      <section>
        <h3>📊 Non-Functional Requirements</h3>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          Broadcasts at most 1/sec per typer.
          Indicator renders without jank.
          Aggregation cheap.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="crucial">
          Stale indicators clear after timeout
          (e.g. 5 s without renewal).
          Send/blur immediately clears local
          typing.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          Authenticated transport. Cross-room
          isolation server-enforced.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="important">
          Indicator announces only on state
          transitions (not on every renew). Screen
          readers don&rsquo;t need per-typer
          updates.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          Pluggable transport. Aggregation
          customizable per product.
        </HighlightBlock>
      </section>

      <section>
        <h3>🧠 Solution Approach</h3>
        
        <HighlightBlock as="p" tier="crucial">
          The system has three parts: <strong>local
          detector</strong> (broadcasts typing
          events with debounce), <strong>remote
          aggregator</strong> (collects typing events
          and renders indicator), and
          <strong> timeout cleanup</strong> (clears
          stale indicators).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The <strong>local detector</strong> listens
          to input events. On the first input, send
          a typing-start event. While typing, send
          renew events at most once per second.
          On blur, send, or pause exceeding 3
          seconds without input, send typing-stop.
          This pattern minimizes traffic while
          keeping indicators accurate.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The <strong>remote aggregator</strong>{" "}
          maintains a per-conversation set of
          currently-typing user ids with their
          last-renewed timestamps. On
          typing-start/renew, add or update the
          entry. On typing-stop, remove. Periodically
          (every second), check for stale entries
          (no renewal in &gt;5 s) and remove them.
          Render the indicator from the current
          set of typers.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Aggregation</strong>: 1 typer →
          &ldquo;[Name] is typing&hellip;&rdquo;. 2
          → &ldquo;[A] and [B] are
          typing&hellip;&rdquo;. 3+ → &ldquo;[A] and
          [N] others are typing&hellip;&rdquo;.
          The string updates as the typer set
          changes.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Stop on send</strong>: when the
          user sends a message, immediately
          broadcast typing-stop so the recipient&rsquo;s
          indicator clears before or as the
          message arrives.
        </HighlightBlock>
        <p>
          <strong>Animation</strong>: bouncing-dots
          animation for visual feedback. Fades in
          when the indicator appears, fades out
          when it clears. Subtle to avoid
          distraction.
        </p>
      </section>

      <section>
        <h3>🧱 Component Architecture</h3>
        <HighlightBlock as="p" tier="crucial"><strong>TypingProvider</strong> instantiates
          detector and aggregator.
          <strong> LocalTypingDetector</strong>{" "}
          watches input events.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important"><strong> RemoteAggregator</strong></Highlight>{" "}
          maintains typer set.
          <strong> TimeoutCleaner</strong> removes
          stale entries.
          <strong> TypingIndicator</strong> renders
          the indicator UI.</HighlightBlock>
      </section>

      <section>
        <h3>🔄 State Management</h3>
        <HighlightBlock as="p" tier="crucial">Per-conversation typer set in external
          store. Local typing state is</HighlightBlock>
<HighlightBlock as="p" tier="important">component-
          local (whether we&rsquo;re currently
          broadcasting</HighlightBlock>
<HighlightBlock as="p" tier="important">typing). Subscribers (UI)
          read aggregated set via selectors.</HighlightBlock>
      </section>

      <section>
        <h3>🔁 Data Flow &amp; Contracts</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Events: <code>typing.start</code>,
          </Highlight><code> typing.renew</code>,
          <code> typing.stop</code>. <Highlight tier="important">Each carries
          conversationId, userId. Receiver
          aggregates</Highlight> per conversation.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚡ Performance</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Throttle broadcast to 1/sec.
          Aggregation is <Highlight tier="important">O(typers) per render.
          Timeout cleanup runs</Highlight> once per second.
          Indicator rendering memoized.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🎨 UX</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Indicator at the bottom of the chat
          thread <Highlight tier="important">(above the input). Subtle
          animation. Aggregated</Highlight> text reads
          naturally. Disappears smoothly when
          typing stops.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>♿ Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">Announce on state transition only:
          when first appearing (&ldquo;Alice is
          typing&rdquo;), and when</HighlightBlock>
<HighlightBlock as="p" tier="important">going from
          typing to silent (&ldquo;Alice stopped
          typing&rdquo;) — actually we don&rsquo;t</HighlightBlock>
<HighlightBlock as="p" tier="important">announce stops typically; just appearance.
          Don&rsquo;t announce on every renewal.
          Live region polite.</HighlightBlock>
      </section>

      <section>
        <h3>🔐 Security</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Transport authenticated; server
          enforces conversation <Highlight tier="important">membership.
          Typing events carry only ids</Highlight> and
          timestamps; no leak risk.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🧪 Testing</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Unit tests for debounce timing.
          Integration with mock <Highlight tier="important">transport:
          start, renew, stop, timeout. Multi-</Highlight>
          typer aggregation strings. Send
          immediately stops local typing.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🚨 Edge Cases</h3>
        <HighlightBlock as="p" tier="crucial">Many
          typers (a busy group chat): aggregation
          handles via &ldquo;X and N others&rdquo;.
          Typer in a different conversation: not</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">shown (per-conversation scope).
          Network drop mid-typing: broadcast
          fails silently; remote indicator
          times out; on reconnect, fresh state.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Reusability</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Generic over transport. Aggregation
          <Highlight tier="important">string customizable. Pattern reuses
          across chat,</Highlight> editor (paragraph-level
          typing), comments.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🌍 Internationalization</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Aggregation strings via i18n with
          plurals <Highlight tier="important">(ICU MessageFormat handles
          &ldquo;is typing&rdquo; vs</Highlight> &ldquo;are
          typing&rdquo;). Names display as
          authored.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>⚖️ Trade-offs</h3>

        <h3>Renew vs single send</h3>
        <HighlightBlock as="p" tier="crucial">
          Renew (periodic re-broadcast)
          recovers from lost stop events. Single
          send is simpler but breaks if the
          stop is lost. Renew with timeout is
          the right approach.
        </HighlightBlock>

        <h3>Immediate vs delayed start</h3>
        <HighlightBlock as="p" tier="important">
          Immediate start may flicker for a
          two-keystroke typo. Slight delay (e.g.
          300 ms of typing before broadcasting
          start) reduces noise. We default to
          slight delay.
        </HighlightBlock>

        <h3>Per-conversation vs global</h3>
        <HighlightBlock as="p" tier="important">
          Per-conversation is correct (typing in
          conversation A shouldn&rsquo;t show in
          B). Global is simpler but wrong for
          multi-conversation apps.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔮 Future Improvements</h3>
        <HighlightBlock as="p" tier="crucial">Smart typing detection (don&rsquo;t
          broadcast for clearing the input or
          deletion). Cursor-attached typing in
          editors.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Smart hide when the typer
          hasn&rsquo;t added text in seconds.
          Pause indicators during longer
          composition.</Highlight></HighlightBlock>
      </section></section>
<section><h2>Architecture &amp; Flow</h2><p>Separate durable records, optimistic intent, transport events, ephemeral awareness, rendered projection, and telemetry. Every connection, timer, cursor, replay buffer, subscription, and retry queue needs an explicit owner and cleanup path.</p><p>Treat typing indicators as lossy conversation-scoped TTL state, never as durable message data.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/communication-collaboration/typing-indicator-system-recovery.svg" alt="Design a Typing Indicator System recovery" caption="Recovery flow: classify gaps, retain stable truth, replay safely, and emit evidence." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Reliable event history is unnecessary; TTL latest-value state is justified for responsive low-cost indicators.</p><p>Latest renewal wins and expires locally. No durable consistency is required beyond bounded staleness. Scale pressure comes from many typers, lost stop events, reconnect, hidden tabs, network flood, and screen-reader noise. Bound queues, dedupe events, expire ephemeral state, and degrade predictably.</p></section>
<section><h2>Best practices</h2><p>Use stable ids, event sequences, idempotency keys, monotonic watermarks, TTLs, replay cursors, bounded buffers, authorization checks, and cleanup. Test reconnect gaps, duplicates, stale events, offline recovery, privacy settings, and accessibility announcements.</p><p>Measure latency, backlog, reconnect rate, gap recovery, retries, stale drops, TTL expiry, and accessibility regressions without logging sensitive content.</p><h3>Operational implementation: conversation-scoped typing TTL and renewal</h3><p>Emit start after a short debounce, renew at a bounded interval, stop on send or blur, and expire missing stop events locally. Aggregate labels from current TTL entries and announce only meaningful transitions to assistive technology.</p><p>Define explicit metrics for accepted events, duplicate drops, stale drops, replay gap size, reconnect duration, queue depth, TTL expiry, degraded-mode entry, authorization denial, and rollback outcome. Redact user content and sensitive identifiers from telemetry. Test duplicate delivery, out-of-order events, disconnect during mutation, hidden tabs, unmount cleanup, multiple tabs, permission removal, burst traffic, and a rollback to the previous policy version.</p></section>
<section><h2>Common Pitfalls</h2><p>Common failures include treating ephemeral state as durable, trusting arrival order, leaking timers or sockets, missing dedupe, unbounded replay, and hiding degraded connectivity.</p><p>For this topic, renew periodically, stop on send and blur, expire missing stops, throttle broadcasts, and announce only transitions.</p></section>
<section><h2>Real-world use cases</h2><p>This design applies to collaborative products where transport, persistence, and UI projection fail independently. Inject product policy for authorization, retention, fallback, and observability explicitly.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Treat typing indicators as lossy conversation-scoped TTL state, never as durable message data.</p><h3>What breaks at scale?</h3><p>many typers, lost stop events, reconnect, hidden tabs, network flood, and screen-reader noise.</p><h3>What consistency applies?</h3><p>Latest renewal wins and expires locally. No durable consistency is required beyond bounded staleness.</p><h3>How do you recover?</h3><p>renew periodically, stop on send and blur, expire missing stops, throttle broadcasts, and announce only transitions.</p><h3>Why this architecture?</h3><p>Reliable event history is unnecessary; TTL latest-value state is justified for responsive low-cost indicators.</p></section>
<section><h2>References</h2><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSocket" target="_blank" rel="noreferrer">MDN WebSocket</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA APG</a></li><li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React state ownership</a></li></ul></section>
</ArticleLayout>}