"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-chat-messaging-ui",
  title: "Design a Chat / Messaging UI",
  description:
    "Production-grade chat UI with message grouping, read receipts, typing indicators, infinite scroll upward, media previews, and accessibility.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "chat-messaging-ui",
  wordCount: 3200,
  readingTime: 20,
  lastUpdated: "2026-04-03",
  tags: ["lld", "chat", "messaging", "real-time", "infinite-scroll", "media-preview", "accessibility"],
  relatedTopics: ["kanban-board", "notification-center-inbox", "rich-text-editor"],
};

export default function ChatMessagingUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a chat/messaging UI — a real-time messaging interface where
          users exchange messages in a conversation. Messages appear in chronological
          order, with the newest at the bottom. The system must support message grouping
          by sender and time, read receipts (sent/delivered/read), typing indicators,
          infinite scroll upward for message history, media previews (images, files),
          and full keyboard accessibility.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>Messages are delivered via WebSocket for real-time updates.</li>
          <li>Message history is paginated — older messages load on scroll-up.</li>
          <li>Messages can contain text, images, files, and emoji reactions.</li>
          <li>Read receipts track per-message read status for each participant.</li>
          <li>Typing indicators show which participants are currently composing.</li>
          <li>The component is used in a React 19+ SPA.</li>
        </ul>
      </section>

      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Message Display:</strong> Messages render in chronological order, newest at bottom. Messages from the same sender within a time threshold are grouped visually.</li>
          <li><strong>Message Sending:</strong> User types in input, presses Enter to send. Message appears instantly (optimistic), then confirms via server.</li>
          <li><strong>Read Receipts:</strong> Each message shows sent/delivered/read status with timestamp. Read receipts update when the recipient views the message.</li>
          <li><strong>Typing Indicators:</strong> Show &quot;User is typing...&quot; when a participant is composing a message. Disappears after 3 seconds of inactivity.</li>
          <li><strong>Infinite Scroll Upward:</strong> Scrolling to the top loads older messages. Scroll position is maintained after loading.</li>
          <li><strong>Media Previews:</strong> Images render inline with click-to-expand lightbox. Files show download link with size.</li>
          <li><strong>Emoji Reactions:</strong> Add/remove emoji reactions on messages, with count display.</li>
          <li><strong>Message Editing/Deleting:</strong> Edit own messages within a time window. Delete with confirmation.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Performance:</strong> Smooth 60fps scrolling with 1000+ messages. Virtualize off-screen messages.</li>
          <li><strong>Real-Time Latency:</strong> Messages appear within 200ms of send. Typing indicators within 100ms.</li>
          <li><strong>Accessibility:</strong> Screen reader announces new messages, keyboard navigation between messages.</li>
          <li><strong>Offline Support:</strong> Messages queue locally when offline, send on reconnect.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>User scrolls up to read history while new messages arrive — auto-scroll only if user was at bottom.</li>
          <li>WebSocket reconnects after disconnect — reconcile missed messages, fill gaps.</li>
          <li>Two users send messages simultaneously — ordering by server timestamp, not client clock.</li>
          <li>Large image upload — show progress, allow cancel, retry on failure.</li>
          <li>Message sent but server rejects it (rate limit, content policy) — rollback optimistic message, show error.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is a <strong>message store</strong> (Zustand) with an ordered
          array of messages. A <strong>WebSocket manager</strong> handles real-time
          message delivery, typing indicator broadcasts, and read receipt updates.
          The message list uses <strong>infinite scroll upward</strong> with scroll
          position preservation — when older messages load, the scroll offset is
          adjusted so the user&apos;s view doesn&apos;t jump. Messages are rendered
          with <strong>virtualization</strong> for large conversations.
        </p>
        <p>
          <strong>Alternative approaches:</strong>
        </p>
        <ul className="space-y-2">
          <li><strong>Pagination with &quot;Load More&quot; button:</strong> Simpler but worse UX. Infinite scroll is preferred for chat.</li>
          <li><strong>Full DOM rendering:</strong> Works for small conversations (&lt;200 messages) but causes jank for large ones. Virtualization is mandatory at scale.</li>
        </ul>
        <p>
          <strong>Why normalized store + virtualized scroll is optimal:</strong> The
          normalized store makes optimistic updates and reconciliation trivial.
          Virtualization ensures smooth scrolling regardless of message count. The
          auto-scroll behavior (only scroll to bottom if user was at bottom) is the
          standard chat UX pattern used by Slack, WhatsApp, and iMessage.
        </p>
      </section>

      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of eight modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Types &amp; Interfaces (<code>chat-types.ts</code>)</h4>
          <p>Defines <code>Message</code> (id, senderId, content, timestamp, status, reactions, media), <code>ChatState</code> (messages array, typing users, cursor for pagination), and <code>MessageStatus</code> (sending, sent, delivered, read, failed).</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Message Store (<code>message-store.ts</code>)</h4>
          <p>Zustand store: ordered message array, optimistic message tracking, typing indicator state, pagination cursor. Actions: addMessage (optimistic + confirm), prependMessages (for load-more), updateReadReceipt, setTypingUser.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. WebSocket Manager (<code>chat-websocket.ts</code>)</h4>
          <p>Manages WebSocket connection: sends messages, receives incoming messages, typing indicators, read receipts. Handles reconnect with exponential backoff. Buffers outgoing messages during offline.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Scroll Manager (<code>scroll-manager.ts</code>)</h4>
          <p>Tracks scroll position: &quot;is at bottom&quot; flag, scroll offset before load-more, offset restoration after prepend. Auto-scrolls to bottom on new message only if user was at bottom.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Typing Indicator Manager (<code>typing-manager.ts</code>)</h4>
          <p>Debounced typing broadcast: sends &quot;typing&quot; event on first keystroke, &quot;stopped typing&quot; after 3 seconds of inactivity. Tracks typing users with auto-expiry (5-second timeout).</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. Message Grouping Engine (<code>message-grouper.ts</code>)</h4>
          <p>Groups consecutive messages from the same sender within a 5-minute time window. Returns grouped message objects with isFirstInGroup and isLastInGroup flags for rendering avatars and bubbles correctly.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">7. Media Preview (<code>media-preview.tsx</code>)</h4>
          <p>Lightbox for image messages with zoom, pan, and close. File messages show icon, filename, size, and download link. Image upload progress indicator with cancel button.</p>
        </div>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/chat-messaging-ui-architecture.svg"
          alt="Chat messaging UI architecture showing optimistic updates, WebSocket connection, and message rendering"
          caption="Component Interaction Flow"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>User types message, presses Enter.</li>
          <li>Store creates optimistic message with &quot;sending&quot; status, prepends to local state.</li>
          <li>WebSocket manager sends message to server.</li>
          <li>Server acknowledges, returns message with server timestamp and ID.</li>
          <li>Store confirms optimistic message (replaces temp ID with server ID, updates status to &quot;sent&quot;).</li>
          <li>Recipient receives message via WebSocket, store appends to their message list.</li>
          <li>If recipient is at bottom of chat, auto-scroll to new message.</li>
          <li>When recipient views the message, read receipt sent back to server, propagated to sender.</li>
        </ol>
      </section>

      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          The data flow is bidirectional: send (optimistic → server → confirm) and
          receive (WebSocket → store → render → scroll). Typing indicators follow a
          debounce-send-expire pattern. Read receipts are triggered by intersection
          observation (message enters viewport).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li><strong>Auto-scroll only when at bottom:</strong> The scroll manager tracks a <code>isAtBottom</code> flag (true when scroll position is within 50px of bottom). On new message, auto-scroll only if flag is true. If user scrolled up to read history, no auto-scroll — a &quot;New messages&quot; badge appears instead.</li>
          <li><strong>Scroll position preservation:</strong> Before loading older messages, record <code>scrollHeight</code> and <code>scrollTop</code>. After prepending, set <code>scrollTop = newScrollHeight - oldScrollHeight + oldScrollTop</code>.</li>
          <li><strong>Message reconciliation:</strong> On WebSocket reconnect, fetch missed messages since the last known message ID. Insert them in chronological order, deduplicating by ID.</li>
          <li><strong>Typing indicator expiry:</strong> If a typing event is received but no subsequent stop-typing event arrives (due to disconnect), the typing indicator auto-expires after 5 seconds.</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <p>
          The full production implementation is available in the <strong>Example tab</strong>.
          Below is a high-level overview of each module.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">📦 Switch to the Example Tab</h3>
          <p>
            Complete production-ready implementation includes: normalized message store
            with optimistic updates, WebSocket manager with reconnect logic, scroll manager
            with position preservation, typing indicator with debounce/expiry, message
            grouping engine, media lightbox, emoji reactions, and full ARIA compliance.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Modules Overview</h3>
        <p>
          The message store uses an ordered array with optimistic message tracking
          (temporary IDs replaced on server confirmation). The WebSocket manager handles
          send/receive with exponential backoff reconnect. The scroll manager tracks
          bottom position and restores offset after prepend. The typing manager debounces
          broadcasts and auto-expires stale indicators. The grouper clusters messages
          by sender and time window. Media preview renders images with lightbox and files
          with download links.
        </p>
      </section>

      <section>
        <h2>Performance &amp; Scalability</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Time and Space Complexity</h3>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Operation</th>
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Space</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">addMessage (optimistic)</td>
                <td className="p-2">O(1) — array push</td>
                <td className="p-2">O(n) — n messages</td>
              </tr>
              <tr>
                <td className="p-2">prependMessages (load more)</td>
                <td className="p-2">O(m) — m new messages prepended</td>
                <td className="p-2">O(n + m)</td>
              </tr>
              <tr>
                <td className="p-2">Message grouping</td>
                <td className="p-2">O(n) — single pass</td>
                <td className="p-2">O(n) — grouped array</td>
              </tr>
              <tr>
                <td className="p-2">Scroll offset restoration</td>
                <td className="p-2">O(1)</td>
                <td className="p-2">O(1)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li><strong>Large message history in DOM:</strong> 1000+ messages cause slow rendering and memory usage. Mitigation: virtualize messages — only render visible items plus overscan buffer.</li>
          <li><strong>Frequent re-renders on typing indicators:</strong> Typing state changes every few seconds. Mitigation: isolate typing indicator in a separate component that does not re-render the message list.</li>
          <li><strong>Image decoding jank:</strong> Large images block the main thread during decode. Mitigation: use <code>decode()</code> API on Image objects before inserting into DOM.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li><strong>Virtualized message list:</strong> Render only visible messages (20-30) plus 10-item overscan buffer. Each message has a fixed or measured height. Total scroll height computed from message count × average height.</li>
          <li><strong>Message memoization:</strong> Each message component is wrapped in <code>React.memo</code> with a custom comparator comparing only the fields that affect rendering (content, status, reactions).</li>
          <li><strong>Batched read receipts:</strong> Instead of sending a read receipt for each message, batch them: send one receipt for all messages viewed in the last 500ms.</li>
        </ul>
      </section>

      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Validation</h3>
        <p>
          Message content is sanitized before rendering. Links are validated against
          allowlist. File uploads are scanned for malware and type-checked. Maximum
          message length enforced (e.g., 10,000 characters).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Screen Reader Support</h4>
          <ul className="space-y-2">
            <li>New messages are announced via <code>aria-live=&quot;polite&quot;</code> region: &quot;John: Hey, are you free?&quot;.</li>
            <li>Message count announced on chat open: &quot;42 messages in this conversation&quot;.</li>
            <li>Typing indicator announced: &quot;Jane is typing&quot;.</li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Keyboard Navigation</h4>
          <ul className="space-y-2">
            <li>ArrowUp/Down moves focus between messages.</li>
            <li>Enter on a message opens the detail view (reactions, edit history).</li>
            <li>Escape closes detail view and returns focus to message list.</li>
            <li>Input field is always focusable via Tab.</li>
          </ul>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Abuse Prevention</h3>
        <ul className="space-y-2">
          <li><strong>Rate limiting:</strong> Server-side limit of 10 messages per second per user to prevent spam.</li>
          <li><strong>Content moderation:</strong> Messages scanned for prohibited content (links, profanity) before broadcast.</li>
        </ul>
      </section>

      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li><strong>Message store:</strong> Test optimistic add, confirm, reject/rollback. Test prependMessages maintains order. Test read receipt updates.</li>
          <li><strong>Message grouper:</strong> Test same-sender within 5 minutes groups together, different sender breaks group, time gap over 5 minutes breaks group.</li>
          <li><strong>Scroll manager:</strong> Test isAtBottom detection, scroll offset preservation after prepend, auto-scroll trigger.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li><strong>Send flow:</strong> Type message, press Enter, verify optimistic render, verify WebSocket send, verify server confirmation replaces temp ID.</li>
          <li><strong>Receive flow:</strong> Simulate WebSocket message, verify append to store, verify auto-scroll when at bottom, verify no auto-scroll when scrolled up.</li>
          <li><strong>Typing indicator:</strong> Simulate keystrokes, verify typing event sent after debounce, verify expiry after 5 seconds of silence.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility Tests</h3>
        <ul className="space-y-2">
          <li>Run axe-core on message list — no violations.</li>
          <li>Test with VoiceOver — new messages announced, typing indicator announced, message count spoken on open.</li>
          <li>Verify keyboard navigation: Arrow keys move focus between messages, input is reachable via Tab.</li>
        </ul>
      </section>

      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li><strong>No optimistic rendering:</strong> Waiting for server confirmation before showing the message creates perceived latency. Staff candidates should propose optimistic rendering with rollback.</li>
          <li><strong>Scroll jumps on load-more:</strong> Prepending messages without adjusting scrollTop causes the view to jump to the top. Candidates must discuss scroll offset preservation.</li>
          <li><strong>Auto-scrolling when user is reading history:</strong> Force-scrolling to bottom on every new message disrupts the user&apos;s reading flow. The &quot;is at bottom&quot; check is critical.</li>
          <li><strong>Rendering all messages in DOM:</strong> For conversations with 1000+ messages, full DOM rendering causes severe jank. Virtualization is mandatory.</li>
          <li><strong>No typing indicator expiry:</strong> If a user closes the tab while typing, the typing indicator persists forever. Auto-expiry (5 seconds) is essential.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Virtualization vs Full DOM</h4>
          <p>
            Virtualization reduces DOM nodes but adds complexity (height measurement,
            scroll position math). For small chats (&lt;200 messages), full DOM is
            simpler and performant. For large chats, virtualization is mandatory. The
            hybrid approach: render all messages up to 200, then switch to virtualization.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">WebSocket vs SSE for Message Delivery</h4>
          <p>
            WebSocket provides bidirectional communication — send and receive on the same
            connection. SSE is receive-only, requiring a separate HTTP POST for sending.
            For chat, WebSocket is preferred because it reduces connection overhead and
            enables presence (typing, online status) on the same channel.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement message search within a conversation?</p>
            <p className="mt-2 text-sm">
              A: Two approaches. (1) Client-side: index all messages in a local search
              structure (MiniSearch, Fuse.js). Fast but memory-intensive for large
              conversations. (2) Server-side: send search query to backend, return
              matching messages with context (surrounding messages). Better for large
              datasets. Hybrid: client-side for recent 500 messages, server-side for
              older.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you handle message threading (replies to specific messages)?</p>
            <p className="mt-2 text-sm">
              A: Add a <code>replyToId</code> field to the Message type. Render a
              collapsed preview of the parent message above the reply. Clicking expands
              the thread view (side panel or modal). Threaded messages are still part of
              the main timeline but visually linked. This is how Slack handles threads.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement end-to-end encryption?</p>
            <p className="mt-2 text-sm">
              A: Use the Signal Protocol (Double Ratchet Algorithm). Each participant has
              a key pair. Messages are encrypted client-side before sending. The server
              only sees ciphertext. Key exchange happens via a pre-key bundle. This
              prevents the server from reading messages. The trade-off: no server-side
              search, no web access from new devices without key sync.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle message ordering when client clocks are out of sync?</p>
            <p className="mt-2 text-sm">
              A: Use server-generated timestamps (lamport clocks or snowflake IDs) as the
              authoritative order. Client timestamps are only for display. On message
              receipt, the server assigns a monotonically increasing sequence number.
              Clients order messages by sequence number, not client time.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement message drafts (unsent text preserved across sessions)?</p>
            <p className="mt-2 text-sm">
              A: Store the current input value in localStorage keyed by conversation ID.
              On chat open, restore the draft. Clear the draft on send. Debounce writes
              at 200ms to avoid excessive localStorage writes. Handle the edge case of
              the same conversation open in two tabs — use the <code>storage</code> event
              to sync drafts across tabs.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you measure chat engagement metrics?</p>
            <p className="mt-2 text-sm">
              A: Track: (1) messages sent per day, (2) response time (time between
              message and reply), (3) active participants, (4) message read rate,
              (5) typing-to-send ratio (indicates hesitation). Use this data to identify
              inactive conversations, bottlenecks in communication, and user engagement
              patterns.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://signal.org/docs/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Signal Protocol — End-to-End Encryption Specification
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — WebSockets API
            </a>
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/regions/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              WAI-ARIA Live Regions — Announcing Dynamic Content
            </a>
          </li>
          <li>
            <a href="https://slack.com/intl/en-us/blog/engineering/building-slack-chat" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Slack Engineering — Building Slack&apos;s Chat Infrastructure
            </a>
          </li>
          <li>
            <a href="https://web.dev/articles/virtualize-lists" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Web.dev — Virtualizing Lists for Performance
            </a>
          </li>
          <li>
            <a href="https://zustand-demo.pmnd.rs/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Zustand — State Management for Real-Time UIs
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
