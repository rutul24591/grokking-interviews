"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-comm-frontend-chat-ui",
  title: "Chat Interface",
  description:
    "Comprehensive guide to implementing chat interfaces covering message display, real-time updates, typing indicators, message status, virtualization, offline support, and scaling strategies for high-volume messaging systems.",
  category: "functional-requirements",
  subcategory: "communication",
  slug: "chat-interface",
  version: "extensive",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-30",
  tags: [
    "requirements",
    "functional",
    "communication",
    "chat",
    "messaging",
    "frontend",
    "real-time",
    "websocket",
  ],
  relatedTopics: ["messaging-service", "websocket-server", "presence-indicators", "read-receipts"],
};

export default function ChatInterfaceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Chat interface enables real-time text communication between users, requiring responsive UI, message status indicators, typing awareness, and seamless real-time updates. Modern chat interfaces have evolved beyond simple text exchange to support rich media (images, videos, files), reactions, replies, threading, and integrations with other services. The chat interface is often the most frequently used feature in messaging applications, making performance and user experience critical for user retention.
        </p>
        <p>
          The technical complexity of chat interfaces is often underestimated. A production-ready chat must handle messages arriving in real-time while maintaining correct ordering across time zones and network delays. It must support conversations with thousands of messages through virtualization and pagination. It must work seamlessly across network conditions—showing optimistic updates when online, queuing messages when offline, and synchronizing when connectivity resumes. The interface must feel instant despite network latency, which requires careful state management and optimistic UI patterns.
        </p>
        <p>
          For staff and principal engineers, chat interface implementation involves navigating significant technical challenges. The architecture must integrate with WebSocket connections for real-time delivery while handling reconnection gracefully. Message ordering must account for clock skew, network delays, and concurrent sends. The UI must virtualize long conversations to maintain performance. Accessibility requires keyboard navigation, screen reader support, and proper focus management. The system must handle edge cases like duplicate messages, failed sends, and conflicting updates from multiple devices.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Message Display and Grouping</h3>
        <p>
          Message bubbles display sent messages aligned right (typically in a distinct color like blue or green) and received messages aligned left (typically gray or white). This visual distinction helps users quickly identify who sent each message. Message grouping combines consecutive messages from the same sender within a time threshold (typically 5-10 minutes) into a single visual group, reducing visual clutter and improving readability.
        </p>
        <p>
          Timestamps display using relative time for recent messages ("2m ago", "1h ago") and absolute time for older messages ("Mar 25, 2:30 PM"). Delivery status indicators show message state: sending (spinner), sent (single check), delivered (double check), read (double check with color change or "Read" label). These indicators provide senders awareness of message consumption without requiring explicit confirmation.
        </p>
        <p>
          Rich content rendering handles links with preview cards (Open Graph metadata), images with inline display and tap-to-expand, videos with thumbnail and play overlay, and files with icon and download action. Each content type requires different handling—images need aspect ratio preservation, videos need player integration, files need secure download handling.
        </p>

        <h3 className="mt-6">Message Input and Composition</h3>
        <p>
          Text input uses auto-expanding textarea that grows with content up to a maximum height (typically 4-6 lines), then scrolls internally. Character limits (if any) display remaining count with visual warning as limit approaches. Multi-line input supports Enter to send (with Shift+Enter for newline) or dedicated send button. Mobile keyboards require careful handling to avoid covering the input field.
        </p>
        <p>
          Attachment options include image/video picker (camera roll or camera), file picker (documents, PDFs), emoji picker (often with search and favorites), voice message recording (push-to-hold or tap-to-start), and location sharing. Each attachment type triggers different upload flows with progress indicators and preview before sending.
        </p>
        <p>
          Draft persistence saves unsent message text to local storage, restoring it if the user navigates away and returns. This prevents frustrating message loss from accidental navigation. Draft sync across devices requires server-side draft storage with conflict resolution when the same conversation has drafts on multiple devices.
        </p>

        <h3 className="mt-6">Real-time Updates</h3>
        <p>
          Incoming messages arrive via WebSocket connection and insert into the message list at the correct position based on server timestamp. If the user is scrolled up viewing history, new messages trigger a "X new messages" banner rather than auto-scrolling, preventing disorientation. Tapping the banner scrolls to the latest messages.
        </p>
        <p>
          Typing indicators show when the other party is composing a message. Implementation sends typing events on keystroke with debounce (send once per 1-2 seconds of typing) and timeout (stop indicating after 5-10 seconds of inactivity). Typing indicators display as "typing..." animation or three bouncing dots. Privacy controls allow users to disable typing indicators, which means they also won't see others' typing status.
        </p>
        <p>
          Presence indicators show online/offline status and last seen timestamp. Online status uses WebSocket connection state—connected means online, disconnected means offline (with grace period for brief network blips). Last seen updates when the user disconnects, stored server-side for other users to query. Privacy controls allow hiding online status, which typically also hides others' status (reciprocal privacy).
        </p>

        <h3 className="mt-6">Message Ordering and Idempotency</h3>
        <p>
          Message ordering uses server-assigned sequence numbers or timestamps. Sequence numbers provide total ordering—each message in a conversation gets an incrementing number. Timestamps require handling clock skew—messages ordered by server receive time, not client send time. Hybrid approaches use client timestamp for display but server sequence for ordering.
        </p>
        <p>
          Idempotency prevents duplicate messages from network retries. Client generates unique message ID (UUID) before sending. Server uses ID to deduplicate—if same ID received twice, second is ignored. Client optimistically shows message with temporary ID, then updates with server-assigned ID when confirmed.
        </p>
        <p>
          Optimistic updates show the message immediately in the UI before server confirmation. The message displays with "sending" status. On success, status changes to "sent". On failure, status shows error with retry option. This pattern makes chat feel instant despite network latency.
        </p>

        <h3 className="mt-6">Virtualization and Pagination</h3>
        <p>
          Virtualization renders only visible messages plus a small buffer, dramatically reducing DOM nodes for long conversations. Libraries like react-window or @tanstack/virtual handle virtual scrolling. Key challenge is maintaining scroll position when new messages arrive or older messages load.
        </p>
        <p>
          Pagination loads messages in chunks (50-100 at a time). Cursor-based pagination uses message ID or timestamp—load messages before the oldest visible message. Infinite scroll triggers when user scrolls near the top, showing loading indicator while fetching. Maintain scroll position after load by measuring and restoring the scroll offset.
        </p>
        <p>
          Initial load strategy affects perceived performance. Load recent messages (50-100) immediately, then lazy-load older messages on scroll. For conversations with thousands of messages, consider server-side search rather than loading full history.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Chat interface architecture spans client state management, WebSocket integration, message storage, and real-time synchronization. The client component manages message list state, input state, connection state, and UI state (typing indicator, scroll position). WebSocket connection handles bidirectional real-time communication. Local storage caches messages for offline access and quick re-load.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/chat-ui/chat-interface-architecture.svg"
          alt="Chat Interface Architecture"
          caption="Figure 1: Chat Interface Architecture — Client components, WebSocket connection, message storage, and real-time synchronization"
          width={1000}
          height={500}
        />

        <h3>Client Component Architecture</h3>
        <p>
          Message list component renders messages with virtualization for performance. It maintains scroll position, handles new message insertion, and triggers pagination on scroll. Component subscribes to WebSocket message events and updates state accordingly. Focus management ensures keyboard users can navigate messages and input efficiently.
        </p>
        <p>
          Input component manages text state, attachment state, and send action. It handles keyboard events (Enter to send), paste events (for image paste), and composition events (for IME input). Input validation checks for empty messages, oversized attachments, and rate limits before sending.
        </p>
        <p>
          Connection manager handles WebSocket lifecycle—connect on mount, reconnect on disconnect with exponential backoff, queue outgoing messages while disconnected, and sync when reconnected. Connection state (connecting, connected, disconnected, reconnecting) displays to user with appropriate messaging.
        </p>

        <h3 className="mt-6">WebSocket Integration</h3>
        <p>
          WebSocket connection establishes on app load or chat open. Authentication uses JWT token passed in connection handshake. Connection maintains heartbeat (ping/pong every 30 seconds) to detect stale connections and keep connection alive through NAT firewalls.
        </p>
        <p>
          Message protocol defines message types: "message" (new message), "typing" (typing indicator), "read" (read receipt), "delivery" (delivery receipt), "presence" (online/offline). Each message type has specific payload structure. Client routes incoming messages to appropriate handlers.
        </p>
        <p>
          Reconnection handling detects disconnect, waits with exponential backoff (1s, 2s, 4s, 8s, max 30s), then reconnects. On reconnect, client requests missed messages using last received message ID or timestamp. Pending outgoing messages queue and send on reconnect.
        </p>

        <h3 className="mt-6">Message Storage</h3>
        <p>
          Local storage caches messages for offline access and quick re-load. IndexedDB stores full message history with indexes on conversation ID and timestamp. Cache eviction removes old messages (beyond 30-90 days) to manage storage, keeping recent conversations available offline.
        </p>
        <p>
          Sync strategy on app load: check local cache for messages, display immediately, then sync with server for any messages received while offline. Conflict resolution uses server as source of truth—server messages overwrite local if conflict detected.
        </p>
        <p>
          Encryption at rest protects sensitive messages in local storage. For end-to-end encrypted chats, messages stored encrypted with keys only available to conversation participants. Unencrypted metadata (sender, timestamp) may be stored for indexing.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/chat-ui/message-lifecycle.svg"
          alt="Message Lifecycle"
          caption="Figure 2: Message Lifecycle — Compose, send, deliver, read states with optimistic updates and status transitions"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Message Lifecycle</h3>
        <p>
          Message creation starts with user typing in input. On send, client generates unique message ID, creates message object with optimistic status, inserts into UI, and sends via WebSocket. Message displays with "sending" indicator.
        </p>
        <p>
          Server receives message, validates (authentication, rate limit, content policy), assigns sequence number, persists to database, broadcasts to recipients via their WebSocket connections. Server sends acknowledgment to sender with message ID and sequence number.
        </p>
        <p>
          Client receives acknowledgment, updates message status from "sending" to "sent". Recipient client receives message, inserts into UI, sends delivery receipt. Sender receives delivery receipt, updates status to "delivered". Recipient reads message (scrolls into view), sends read receipt. Sender receives read receipt, updates status to "read".
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/chat-ui/real-time-message-flow.svg"
          alt="Real-time Message Flow"
          caption="Figure 3: Real-time Message Flow — WebSocket communication, optimistic updates, and receipt handling"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Chat interface design involves numerous trade-offs affecting user experience, performance, complexity, and privacy. Understanding these trade-offs enables informed decisions aligned with product goals and user needs.
        </p>

        <h3>Optimistic vs Pessimistic Updates</h3>
        <p>
          Optimistic updates show messages immediately before server confirmation. Pros: Instant feel, better UX, works well with retry on failure. Cons: Requires rollback handling, can show duplicates if retry succeeds after user retries manually. Best for: Consumer chat apps where speed matters.
        </p>
        <p>
          Pessimistic updates wait for server confirmation before showing message. Pros: No rollback needed, guaranteed consistency. Cons: Noticeable delay on slow networks, feels sluggish. Best for: Enterprise or regulated environments where message guarantee is critical.
        </p>
        <p>
          Hybrid approach uses optimistic for display, pessimistic for critical actions (payments, sensitive info). Show message optimistically but mark as "pending" until confirmed. This balances speed with accuracy.
        </p>

        <h3>Virtualization Strategies</h3>
        <p>
          Full virtualization renders only visible messages. Pros: Best performance for long conversations, constant memory usage. Cons: Complex scroll position management, harder to implement search highlighting. Best for: Conversations with 1000+ messages.
        </p>
        <p>
          Partial virtualization renders recent messages (500-1000) normally, virtualizes older messages. Pros: Simpler implementation, good enough for most cases. Cons: Still has performance limits. Best for: Typical consumer chat with moderate history.
        </p>
        <p>
          No virtualization renders all messages. Pros: Simplest implementation, easy search and scroll. Cons: Performance degrades with message count, memory issues on mobile. Best for: Small conversations (&lt;500 messages) or admin tools.
        </p>

        <h3>Typing Indicator Privacy</h3>
        <p>
          Always show typing indicators. Pros: Better conversation flow, reduces interrupting messages. Cons: Privacy concern—recipients know you're typing even if you change your mind. Best for: Close-communication apps (WhatsApp, iMessage).
        </p>
        <p>
          User-controlled typing indicators. Pros: Privacy-respecting, user choice. Cons: Asymmetric experience—if you hide typing, you don't see others'. Best for: Privacy-focused apps (Signal, Telegram).
        </p>
        <p>
          No typing indicators. Pros: Maximum privacy, simpler implementation. Cons: Loses conversational awareness, more interrupted messages. Best for: Asynchronous messaging or professional contexts.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/chat-ui/chat-privacy-controls.svg"
          alt="Chat Privacy Controls"
          caption="Figure 4: Chat Privacy Controls — Typing indicators, read receipts, online status, and message deletion options"
          width={1000}
          height={450}
        />

        <h3>Message Deletion</h3>
        <p>
          Delete for everyone removes message from all participants' devices. Pros: True deletion, privacy protection. Cons: Requires sync across devices, can't recover if deleted by mistake, audit trail concerns. Best for: Privacy-focused apps, sensitive conversations.
        </p>
        <p>
          Delete for me removes message only from your view. Pros: Simple implementation, no sync needed, other participants retain context. Cons: Doesn't protect privacy if you sent something sensitive. Best for: Personal cleanup, most consumer apps.
        </p>
        <p>
          Time-limited deletion (disappearing messages). Pros: Automatic privacy, reduces data retention. Cons: Can't reference old messages, screenshot workaround. Best for: Sensitive conversations, compliance requirements.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use optimistic updates:</strong> Show messages immediately with "sending" status. Revert on failure with clear error and retry option. Users expect instant feedback.
          </li>
          <li>
            <strong>Implement virtualization:</strong> For conversations exceeding 100 messages, use virtual scrolling. Libraries like react-window handle this well. Maintain scroll position on new messages and pagination.
          </li>
          <li>
            <strong>Handle reconnection gracefully:</strong> Queue outgoing messages while offline. Auto-reconnect with exponential backoff. Sync missed messages on reconnect. Show connection state to user.
          </li>
          <li>
            <strong>Support keyboard navigation:</strong> Tab through messages, Enter to reply, Escape to close modals. Arrow keys for message selection. Accessible to power users and users with disabilities.
          </li>
          <li>
            <strong>Implement proper focus management:</strong> Focus input on chat open, maintain focus after send, restore focus after modal close. Critical for keyboard users and screen readers.
          </li>
          <li>
            <strong>Use relative timestamps:</strong> "2m ago" for recent, "Mar 25, 2:30 PM" for older. Update timestamps dynamically (every minute for recent messages).
          </li>
          <li>
            <strong>Group consecutive messages:</strong> Combine messages from same sender within 5-10 minute window. Shows avatar and timestamp only for first message in group. Reduces visual clutter.
          </li>
          <li>
            <strong>Implement rate limiting:</strong> Prevent spam by limiting messages per second (typically 5-10/sec). Show clear error when limit hit. Server-side enforcement required.
          </li>
          <li>
            <strong>Cache messages locally:</strong> Use IndexedDB for offline access and quick re-load. Sync on reconnect. Manage storage with eviction policy for old messages.
          </li>
          <li>
            <strong>Support rich content safely:</strong> Sanitize all user-generated content. Use CSP headers. Render link previews server-side to avoid SSRF attacks. Validate file types and scan for malware.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No message deduplication:</strong> Network retries create duplicate messages. Solution: Use client-generated unique IDs, server-side deduplication with idempotency.
          </li>
          <li>
            <strong>Poor scroll position management:</strong> Scroll jumps when new messages arrive or old messages load. Solution: Measure and restore scroll offset, use "new messages" banner when scrolled up.
          </li>
          <li>
            <strong>No offline support:</strong> Messages fail silently when offline. Solution: Queue outgoing messages, show pending status, sync on reconnect.
          </li>
          <li>
            <strong>Ignoring accessibility:</strong> Chat unusable for keyboard-only or screen reader users. Solution: Proper ARIA labels, keyboard navigation, focus management, screen reader announcements for new messages.
          </li>
          <li>
            <strong>Message ordering issues:</strong> Messages appear out of order due to clock skew or network delays. Solution: Use server-assigned sequence numbers, not client timestamps, for ordering.
          </li>
          <li>
            <strong>No rate limiting:</strong> Users or bots can spam messages. Solution: Client and server-side rate limiting with clear error messaging.
          </li>
          <li>
            <strong>Memory leaks from event listeners:</strong> WebSocket and DOM event listeners not cleaned up on unmount. Solution: Proper cleanup in useEffect return functions, use AbortController for fetch requests.
          </li>
          <li>
            <strong>Insecure message handling:</strong> XSS from unsanitized message content. Solution: Sanitize all user content, use Content Security Policy, escape HTML entities.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>WhatsApp Chat Interface</h3>
        <p>
          WhatsApp uses optimistic updates with double-check delivery system (single gray check for sent, double gray for delivered, double green for read). Messages group by sender and time. Virtualization handles conversations with thousands of messages. End-to-end encryption with local message storage encrypted at rest. Disappearing messages auto-delete after 7 days.
        </p>

        <h3 className="mt-6">Slack Threaded Conversations</h3>
        <p>
          Slack introduces threading to reduce channel noise. Reply to specific message creates threaded sidebar. Main channel shows thread preview with reply count. Threading preserves context while keeping channels readable. Slack uses virtualization extensively—channels with 10,000+ messages remain performant. Rich integrations with embeds, code snippets, and file previews.
        </p>

        <h3 className="mt-6">Discord Message Features</h3>
        <p>
          Discord supports message editing (with edit history), reactions (emoji responses), replies (threaded or inline), and rich embeds. Markdown formatting (bold, italic, code blocks, spoilers). Message grouping by time with avatar shown only for first message. Server-side message search with filters. Voice and video chat integration alongside text.
        </p>

        <h3 className="mt-6">iMessage Integration</h3>
        <p>
          iMessage integrates deeply with iOS—SMS fallback when recipient not on iMessage, rich link previews, Apple Pay integration, app extensions. Typing indicators with three-dot animation. Read receipts toggle per conversation. Message effects (slam, loud, invisible ink). End-to-end encrypted with iCloud sync across Apple devices.
        </p>

        <h3 className="mt-6">Telegram Feature Set</h3>
        <p>
          Telegram offers cloud-based chat (accessible from any device), channels (broadcast to unlimited audiences), bots (automated interactions), and extensive customization (themes, chat folders). Self-destructing messages, scheduled messages, message translation. Large file support up to 2GB. Secret chats with end-to-end encryption separate from cloud chats.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle message ordering?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use server-assigned sequence numbers for total ordering—each message in a conversation gets an incrementing number. Client timestamps for display only, server timestamps for ordering. Handle clock skew by trusting server receive time. For concurrent sends, sequence numbers ensure consistent ordering across all clients. Store sequence number with message, use for pagination and gap detection.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize chat performance?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Virtualization renders only visible messages (plus small buffer). Use react-window or @tanstack/virtual. Paginate with cursor-based loading (50-100 messages at a time). Cache messages in IndexedDB for quick re-load. Lazy-load media (images, videos) with intersection observer. Debounce scroll event handlers. Use Web Workers for heavy computations like message search or encryption.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement typing indicators?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Send typing event on first keystroke, then debounce (send again only after 1-2 seconds of continued typing). Stop sending after 5-10 seconds of inactivity. Server broadcasts typing status to other participants. Display "typing..." animation for 1-2 seconds, then hide if no new typing events (prevents stale indicators). Respect privacy settings—users can disable sending or viewing typing indicators.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle offline messages?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Queue outgoing messages in IndexedDB with "pending" status. Show in UI with spinner or clock icon. Listen for online event or WebSocket reconnect. On reconnect, send pending messages in order. Handle conflicts if message was sent from another device while offline (server is source of truth). Show error with retry option if send fails after multiple attempts.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure accessibility in chat?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use semantic HTML (list for messages, form for input). ARIA labels for message status ("sent", "delivered", "read"). Keyboard navigation (Tab through messages, Enter to reply, Escape to close). Focus management (focus input on open, maintain after send). Screen reader announcements for new messages (aria-live region). Sufficient color contrast. Alt text for images. Support for reduced motion preferences.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle WebSocket reconnection?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Detect disconnect via WebSocket onclose or heartbeat timeout. Implement exponential backoff (1s, 2s, 4s, 8s, max 30s) for reconnection attempts. Queue outgoing messages while disconnected. On reconnect, request missed messages using last received sequence number or timestamp. Handle duplicate messages from race conditions. Show connection status to user (reconnecting banner). Use connection state to disable send button while disconnected.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — WebSocket API Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/TR/wai-aria-practices/#chat"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — ARIA Authoring Practices for Chat
            </a>
          </li>
          <li>
            <a
              href="https://slack.engineering/building-slacks-new-message-composition-experience/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Slack Engineering — Building the New Message Composition Experience
            </a>
          </li>
          <li>
            <a
              href="https://discord.com/blog/how-discord-scales-websockets"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord Engineering — How Discord Scales WebSockets
            </a>
          </li>
          <li>
            <a
              href="https://blog.bearer.com/implementing-real-time-chat-websockets/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Bearer — Implementing Real-Time Chat with WebSockets
            </a>
          </li>
          <li>
            <a
              href="https://www.smashingmagazine.com/2021/09/building-accessible-chat-interface/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Smashing Magazine — Building an Accessible Chat Interface
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
