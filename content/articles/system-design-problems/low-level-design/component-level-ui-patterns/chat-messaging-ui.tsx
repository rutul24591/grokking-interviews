"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-chat-messaging-ui",
  title: "Design a Chat / Messaging UI",
  description:
    "Chat UI with message virtualization, scroll anchor preservation, optimistic sending, typing indicators, read receipts, media previews, and accessibility.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "chat-messaging-ui",
  wordCount: 5300,
  readingTime: 32,
  lastUpdated: "2026-05-16",
  tags: ["lld", "chat", "messaging", "WebSocket", "scroll-anchor", "optimistic-UI", "virtualization"],
  relatedTopics: ["kanban-board", "notification-center-inbox", "rich-text-editor"],
};

export default function ChatMessagingUIArticle() { return <ArticleLayout metadata={metadata}>
<section><h1>Design a Chat / Messaging UI</h1><h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame Design a Chat / Messaging UI around semantic DOM, accessibility, controlled state, focus ownership, lifecycle cleanup, and reusable API governance. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock><p>Design a Chat / Messaging UI is an implementation-heavy low-level design problem covering message normalization, bidirectional pagination, WebSocket event merge, optimistic send, read receipts, typing TTLs, and scroll-anchor preservation. A principal-level answer must define state ownership, local structures, lifecycle cleanup, browser semantics, server reconciliation, observability, privacy, and rollback.</p><p>Keep a normalized message map and ordered ids, separate the viewed window from the live edge, and reconcile optimistic client ids with server ids without duplicating visible messages. The important structures are message map, ordered ids, cursor window, live-edge marker, optimistic-id map, receipt watermark, typing TTL map, attachment dimensions, and scroll anchor.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/component-level-ui-patterns/chat-messaging-ui-runtime.svg" alt="Design a Chat / Messaging UI runtime" caption="Runtime flow from intent through guarded state, semantic projection, and recovery." /></section>
<section><h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: one committed semantic state must drive ARIA attributes, keyboard behavior, callbacks, visual state, and cleanup effects.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For Design a Chat / Messaging UI, the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock><p>The retained deep dive below captures the component-specific mechanics that an implementation discussion must defend.</p><p>
        Chat interfaces are a canonical "tricky" LLD problem because the requirements
        actively conflict with standard web patterns. Lists normally scroll downward
        from top to bottom; chat lists scroll upward to load history. Infinite scroll
        typically prepends items at the top, but this shifts the viewport and appears
        to "jump" — the scroll anchor must be preserved. New messages appear at the
        bottom, requiring automatic scroll-to-bottom only when the user is already
        near the bottom (not when they are reading history). These competing requirements
        demand a careful state and scroll management architecture. Add real-time
        delivery, optimistic message sending, typing indicators, and read receipts,
        and the complexity becomes significant.
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/chat-messaging-ui-architecture.svg"
        alt="Chat messaging UI architecture diagram"
        caption="Chat UI architecture: message store, scroll anchor, real-time delivery, typing indicators and read receipts"
      />

      <h3>Clarifying the Requirements</h3>
      <p>
        The scope of a chat UI ranges from a simple comments section to a full Slack
        equivalent. Key questions:
      </p>
      <p>
        <strong>How long is the message history?</strong> A support chat with 50 messages
        can render all of them. A Slack channel with 10 years of history needs
        virtualization — only a window of ~50 messages around the user's scroll position
        should be in the DOM.
      </p>
      <p>
        <strong>What media types are supported?</strong> Text-only is straightforward.
        Adding image previews, video thumbnails, file attachments, link unfurl cards,
        and emoji reactions each adds a layer of rendering complexity. Image messages
        with unknown dimensions before load create CLS (Cumulative Layout Shift) that
        disrupts the scroll position.
      </p>
      <p>
        <strong>Threading?</strong> Flat message list (all messages in one scroll region)
        versus threaded messages (replies are nested within a thread, opened in a side
        panel like Slack's thread view). Threading changes the data model from a flat
        array to a tree.
      </p>
      <p>
        <strong>Real-time delivery mechanism?</strong> WebSocket (full-duplex), SSE
        (server push only), or polling. WebSocket is the standard for production chat.
      </p>

      <h3>The Message Store</h3>
      <p>
        Messages are stored as a sorted list (by timestamp) in a normalized structure.
        The primary data structure is a Map keyed by message ID (for O(1) lookup and
        update) plus a sorted array of IDs (for ordered rendering). This dual structure
        supports both: "find message by ID" (for read receipt updates, reactions) and
        "render messages in order" (for the message list).
      </p>
      <p>
        Message status is part of the message object: sending (optimistically displayed,
        not yet confirmed by server), sent (server confirmed), delivered (received by
        the recipient's device), and read (recipient has seen it). These states drive
        the read receipt indicator displayed next to each message.
      </p>
      <p>
        The message list has a cursor for bidirectional pagination: an oldest-message
        cursor (for loading older history when scrolling up) and a newest-message cursor
        (for loading newer history when jumping to an older position and then wanting to
        scroll to the present). Messages are fetched in pages of 50. On initial load,
        fetch the most recent 50 messages. When the user scrolls near the top, fetch
        the next older 50.
      </p>
      <HighlightBlock as="p" tier="crucial">
        The message store must never have gaps. If the user was viewing message 500
        and a new message 700 arrives via WebSocket while messages 501–699 are not
        loaded, the store has a discontinuity. The solution: track the "live edge"
        (the most recent message received in real-time) and the "viewed cursor" (the
        oldest message loaded). If a gap exists between them (the user scrolled up past
        the loaded region), show a "jump to latest" button rather than inserting the
        new message into the list. When the user clicks it, fetch messages from the
        viewed cursor to the live edge to fill the gap.
      </HighlightBlock>

      <h3>Scroll Anchor Preservation</h3>
      <p>
        The hardest technical problem in chat UI is preventing viewport jumps when new
        content is prepended (loading older messages). When 50 messages are prepended
        to the top of the list, the DOM's content height increases, and the scroll
        position (measured from the top) increases by the height of the added content,
        causing the viewport to appear to jump upward to the same pixel position in the
        now-taller document.
      </p>
      <p>
        The CSS scroll-anchor property was designed exactly for this: it designates an
        element as the scroll anchor. When content is inserted above the anchor, the
        browser adjusts the scroll position to keep the anchor element at the same
        viewport position. Set overflow-anchor: auto (the default) on the scroll
        container to enable it, and add overflow-anchor: none on elements that should
        not be anchored (the "Load more" spinner at the top). Modern Chrome, Firefox,
        and Safari all support scroll anchoring.
      </p>
      <p>
        For browsers without scroll anchoring support (or scenarios where it does not
        work reliably — for example, when the list is virtualized), implement manually:
        before the DOM mutation, record the anchor element's position using
        element.getBoundingClientRect(). After the mutation (and layout), compute the
        anchor's new position, and adjust scrollTop by the delta. This is the
        "scroll position preservation" pattern used by Discord's message list.
      </p>

      <h3>Automatic Scroll-to-Bottom</h3>
      <p>
        When a new message arrives, the chat should auto-scroll to show it — but only
        if the user is already near the bottom (reading the latest messages). If the
        user has scrolled up to read history, auto-scrolling would disrupt their
        reading position.
      </p>
      <p>
        The "near bottom" threshold is typically the last 200–300 pixels of the scroll
        container. Compute it as: scrollTop + clientHeight is greater than scrollHeight
        minus 200 (the scroll container is near its bottom). Track this with a boolean
        ref updated on every scroll event (use passive scroll listeners for performance).
        When a new message arrives, check the ref; if true, scroll to bottom after
        the message renders.
      </p>
      <p>
        The scroll-to-bottom operation: use scrollTo with behavior: 'smooth' for a
        gentle scroll that feels natural. For the initial load (the user first opens
        the chat), use behavior: 'instant' to jump directly to the bottom without
        animation. After a message is sent by the current user, always scroll to bottom
        regardless of the user's current scroll position — the user expects to see
        their sent message.
      </p>

      <h3>Message Virtualization</h3>
      <p>
        For channels with long history, rendering all messages in the DOM is
        prohibitively slow. Virtual scrolling renders only the messages in the viewport
        plus an overscan buffer above and below (typically 10–15 messages each direction).
      </p>
      <p>
        The challenge for chat virtualization: message heights are variable and unknown
        before rendering (a message with a link unfurl card or an image is taller than
        a short text message). Two approaches: measure each message's height after first
        render and cache it (using ResizeObserver on each message element), or use a
        fixed estimated height for initial positioning and adjust the scroll position
        after measurement.
      </p>
      <p>
        Libraries like react-virtual and virtua handle variable-height virtual lists.
        They maintain an item size cache, use the cached values for positioning, and
        update positions as items are measured. The complexity of integrating virtual
        scrolling with scroll anchor preservation (when prepending messages) and
        auto-scroll-to-bottom (when appending messages) makes this one of the harder
        frontend engineering problems. Libraries like Virtuoso are specifically designed
        for chat-like lists and handle these edge cases.
      </p>

      <h3>Optimistic Message Sending</h3>
      <p>
        When the user sends a message, show it immediately in the UI without waiting
        for server confirmation. This optimistic update reduces perceived latency from
        the round-trip time (typically 50–200ms) to near zero.
      </p>
      <p>
        The optimistic message has a temporary ID (e.g., a UUID generated on the client)
        and a status of "sending." When the server confirms the message, it returns
        the server-assigned ID and a server timestamp. Replace the temporary ID with
        the server ID and update the status to "sent."
      </p>
      <p>
        Failed sends: if the WebSocket send fails or the server returns an error,
        update the message status to "failed" and show a "retry" option. On retry,
        re-send the same message with the same temporary ID and reset to "sending"
        status.
      </p>
      <p>
        Message ordering: the optimistic message uses a client-generated timestamp.
        When the server returns the message with its server timestamp, the timestamp
        may differ (clock skew). If other messages arrived between the send and the
        confirm, the confirmed message's position in the sorted list may shift. Handle
        this gracefully: update the message's timestamp and re-sort the list. A visible
        jump in position is acceptable — it is a rare edge case, and the list sorts
        by server timestamps for consistency.
      </p>

      <h3>Typing Indicators</h3>
      <p>
        The typing indicator ("Alice is typing...") shows when another user is composing
        a message. The indicator disappears after the user stops typing or sends the
        message.
      </p>
      <p>
        Protocol: when the local user starts typing (first keystroke after an idle
        period), send a typing_start event via WebSocket. Send a typing_stop event
        when the user stops typing (detected by a debounce timer — if 3 seconds elapse
        without a keystroke, the user is considered stopped) or when the message is sent.
        Do not send a typing_start on every keystroke — only on the transition from
        idle to typing.
      </p>
      <p>
        The server broadcasts typing events to all other clients in the channel.
        The recipient's UI shows the typing indicator as long as the typing_start is
        active. Implement a timeout on the recipient's side: if no typing_stop event
        arrives within 5 seconds after a typing_start, automatically hide the indicator
        (in case the sender's connection dropped without sending a stop event).
      </p>
      <HighlightBlock as="p" tier="important">
        The typing indicator is rendered below the message list, not inside it. If it
        were inside the list, appearing and disappearing would shift the content and
        disrupt scroll position. Position it absolutely at the bottom of the chat
        container, overlapping the message list's last few pixels. The indicator's
        appearance and disappearance should not cause layout shifts in the message list.
      </HighlightBlock>

      <h3>Read Receipts</h3>
      <p>
        Read receipts show when a message has been seen by the recipient. In a two-person
        chat, this is a simple boolean — the message is "read" when the recipient has
        viewed it. In a group chat, it is a count of readers or a list of reader avatars
        (Slack-style seen indicators).
      </p>
      <p>
        The "viewed" event is triggered when a message scrolls into the viewport. Use
        an IntersectionObserver on each unread message element. When it becomes visible,
        send a message_seen event to the server with the message IDs that entered the
        viewport. Batch these: accumulate message IDs over 200ms, then send a single
        batch event rather than one event per message. The server updates the read
        receipt status and broadcasts updates to the sender.
      </p>
      <p>
        Display: the sender sees a small avatar or checkmark icon on their message
        when it is read. In a virtualized list, read receipt badges are managed per
        message item and updated when the real-time update arrives.
      </p>

      <h3>Message Grouping</h3>
      <p>
        Messages from the same sender sent within 2–5 minutes of each other are
        visually grouped (only the first shows the sender's avatar and name; subsequent
        messages in the group show no avatar, creating a compact visual block). This
        is a derived computation on the message list.
      </p>
      <p>
        For each message, compute whether it is the first in its group: it is the first
        if the previous message is from a different sender, or if the time gap between
        this message and the previous message exceeds the grouping threshold (5 minutes).
        This is O(n) over the message list and runs whenever the list changes. The
        result is a isGroupStart flag per message that drives conditional rendering
        of the avatar and sender name.
      </p>

      <h3>Accessibility</h3>
      <p>
        The message list should have role="log" with aria-live="polite" and
        aria-label="Message history." The aria-live region announces new incoming
        messages to screen reader users without requiring them to navigate to the
        message list.
      </p>
      <p>
        Each message item has an accessible structure: the sender's name and timestamp
        are visible text (not just visual design), and the message content is readable
        by screen readers. Emoji-only messages (which screen readers cannot meaningfully
        verbalize as pictograms) should have an aria-label on the message element with
        a descriptive name: aria-label="Alice reacted with thumbs up."
      </p>
      <p>
        The compose box should announce its placeholder text and character count (for
        messages with limits) via aria-label and aria-description. Typing indicator
        changes should be announced via a separate aria-live="polite" element so
        screen reader users know when someone is typing.
      </p></section>
<section><h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: controlled/uncontrolled ownership, keyboard model, focus return, timers, portals, layout measurement, and escape hatches.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock><p>Use five boundaries: an input adapter, a typed state controller, a projection layer, an integration adapter, and an observability adapter. Normalize events before they enter state. Keep previews separate from commits. Release timers, observers, listeners, abort controllers, workers, and pointer capture idempotently on cancel and unmount.</p><p>Keep a normalized message map and ordered ids, separate the viewed window from the live edge, and reconcile optimistic client ids with server ids without duplicating visible messages. For durable changes, validate the latest intent and record enough evidence to rollback deterministically.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/component-level-ui-patterns/chat-messaging-ui-scale-recovery.svg" alt="Design a Chat / Messaging UI scale and recovery" caption="Scale defense: bound pressure, validate policy, reconcile failures, and emit reasoned evidence." /></section>
<section><h2>Trade offs &amp; Comparison</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Trade-off lens: optimize for correctness and recoverability first, then latency, cost, developer velocity, and UX polish.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare centralized vs distributed ownership, server-authoritative vs client-speculative state, and strong consistency vs eventual consistency where the product allows it.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">A staff/principal answer should state what gets worse when the simpler design is chosen, and what operational burden appears when the more robust design is chosen.</HighlightBlock><p>Polling is operationally simple; WebSocket delivery is justified for low-latency bidirectional events, but cursor-based recovery remains mandatory after reconnect.</p><p>The server sequence is authoritative for durable ordering. Optimistic local sends are provisional, receipts are monotonic watermarks, and ephemeral typing indicators expire locally. The dominant scale risks are long histories, out-of-order events, reconnect gaps, media layout shifts, unread storms, and users reading history while new messages arrive. Control them with bounded work, stable ids, cancellation, generation guards, measured caching, and explicit degraded behavior.</p><p>Optimistic UI is appropriate only when rollback is deterministic and understandable. Authorization, destructive effects, and conflict-sensitive truth stay server-authoritative.</p></section>
<section><h2>Best practices</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Best practice: make the invariant testable through explicit states, typed events, idempotent operations, scoped permissions, and observable transitions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Instrument the system around user-visible outcomes: interaction latency, focus failures, accessibility violations, render cost, cleanup count, and blocked transition count.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Keep escape hatches governed. Temporary bypasses, manual overrides, and emergency controls should have owner, reason, expiry, and audit evidence.</HighlightBlock><p>Use typed state unions, stable identities, idempotency keys, versioned writes, SSR-safe browser feature detection, abortable async work, bounded caches, and semantic HTML. Test keyboard-only use, screen-reader output, slow networks, stale completion, retries, unmount during work, and large datasets.</p><p>Measure blocked transitions, stale drops, rollback rates, latency percentiles, cache pressure, retry exhaustion, and accessibility regressions. Keep telemetry small and free of sensitive content.</p></section>
<h3>Cost envelope and observability</h3><p>Bound retained message pages, attachment previews, socket replay buffers, receipt fan-out, typing updates, and background retries. Instrument reconnect gaps, dedupe hits, optimistic-send rollback, anchor restoration, queue depth, and memory pressure without logging private message bodies.</p><h3>Principal defense: consistency, abuse, and lifecycle rollback</h3><p>For a reusable component, consistency means one committed semantic snapshot drives DOM attributes, focus behavior, and callbacks. Pointer movement, hover previews, timers, measurements, and async settlements are transient projections. Guard every delayed effect with ownership identity so stale work cannot reopen, overwrite, or announce a component after blur, disposal, navigation, or replacement. Rollback restores the last committed semantic state and performs idempotent cleanup.</p><p>Bound work even for small widgets: cap queued notices, cached failures, measured items, portal layers, suggestion rows, and animation updates. Validate externally supplied labels, URLs, markup, dimensions, and item ids before rendering or measuring. Avoid leaking private labels or raw payloads through telemetry. Track rejected transitions, timer drift, focus-return failures, layout shifts, cleanup counts, and degraded fallbacks.</p><h3>Trade-off and privacy boundary</h3><p>The component trade-off is richer behavior versus lifecycle complexity. Add measurement, portals, caching, animation, or background work only when the interaction benefit exceeds cleanup and stale-result risk. Privacy controls matter even for small widgets: do not expose private labels, URLs, document fragments, or user activity through analytics, announcements, cached previews, or cross-scope reuse.</p><section><h2>Common Pitfalls</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Most dangerous failure modes: inaccessible clickable divs, stale callbacks, leaked timers, layout shifts, focus traps, and prop APIs that cannot evolve.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Do not present a happy-path component graph as the full design. Interviewers will push on retries, stale data, permission changes, overload, deletion, and incident recovery.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Avoid vague words like scalable, secure, and reliable unless you attach them to concrete limits, policies, SLOs, and failure handling behavior.</HighlightBlock><p>Common failures include mixing preview and committed state, trusting arrival order, leaking resources after unmount, accepting stale completion, assuming visible data is the complete dataset, and implementing custom controls without accessible semantics.</p><p>For this topic, buffer socket events during initial fetch, dedupe by id and sequence, detect history gaps, preserve the visible anchor during prepend, and expose retry for failed optimistic sends. Security and privacy require the design to authorize conversations server-side, sanitize rich content and unfurls, scan attachments, redact message bodies from telemetry, and rate-limit typing and send events.</p></section>
<section><h2>Real-world use cases</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Real-world relevance: the same design shows up when teams need a reusable, observable, and governable product capability rather than a one-off screen.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Tie the article back to adoption: how multiple teams integrate, how the system rolls out gradually, how migrations happen, and how operators know the feature is healthy.</HighlightBlock><p>This design appears in production surfaces where repeated interaction, large datasets, asynchronous completion, and partial failure are normal. Reuse the runtime shell, but inject product policy explicitly: authorization, latency budget, persistence boundary, fallback, and telemetry.</p></section>
<section><h2>Common interview question with detailed answer</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Strong answer structure: define the invariant, draw the state/data flow, identify the bottleneck, handle failure, name trade-offs, and close with metrics and tests.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">If pressed for staff/principal depth, discuss ownership boundaries, operational runbooks, migration plan, abuse prevention, and how the design fails safely.</HighlightBlock><h3>How do you model state?</h3><p>Keep a normalized message map and ordered ids, separate the viewed window from the live edge, and reconcile optimistic client ids with server ids without duplicating visible messages. I would name preview, commit, derived projection, async generation, and rollback evidence separately.</p><h3>What breaks at scale?</h3><p>long histories, out-of-order events, reconnect gaps, media layout shifts, unread storms, and users reading history while new messages arrive. I would bound each expensive operation and cancel work that no longer affects the visible committed result.</p><h3>What consistency model applies?</h3><p>The server sequence is authoritative for durable ordering. Optimistic local sends are provisional, receipts are monotonic watermarks, and ephemeral typing indicators expire locally.</p><h3>How do you recover from failure?</h3><p>I would buffer socket events during initial fetch, dedupe by id and sequence, detect history gaps, preserve the visible anchor during prepend, and expose retry for failed optimistic sends.</p><h3>How do you defend the architecture?</h3><p>Polling is operationally simple; WebSocket delivery is justified for low-latency bidirectional events, but cursor-based recovery remains mandatory after reconnect. The added complexity is acceptable only when the required behavior and operational evidence justify it.</p></section>
<section><h2>References</h2><ul><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA Authoring Practices Guide</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API" target="_blank" rel="noreferrer">MDN Intersection Observer API</a></li><li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React state ownership</a></li></ul></section>
</ArticleLayout>; }
