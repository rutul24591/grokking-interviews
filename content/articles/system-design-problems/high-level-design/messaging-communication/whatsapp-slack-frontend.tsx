"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-whatsapp-slack-frontend",
  title: "Design WhatsApp Web / Slack Frontend",
  description:
    "Architecture for a real-time chat frontend like WhatsApp Web or Slack: WebSocket connection management with exponential backoff reconnection, message ordering via Lamport timestamps and sequence numbers, optimistic message sending with local IDs, read receipt and delivery status tracking, channel and DM sidebar with unread counts, message search with Elasticsearch, file upload with resumable multipart, end-to-end encryption key management, presence and typing indicators, and offline queue replay on reconnection.",
  category: "high-level-design",
  subcategory: "messaging-communication",
  slug: "whatsapp-slack-frontend",
  wordCount: 5000,
  readingTime: 30,
  lastUpdated: "2026-05-12",
  tags: ["hld", "chat", "websocket", "real-time", "message-ordering", "read-receipts", "presence", "e2e-encryption"],
  relatedTopics: ["threaded-messaging-system", "notification-inbox-system"],
};

export default function WhatsappSlackFrontendArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>Designing a chat frontend like WhatsApp Web or Slack involves solving the hardest category of real-time UI problems: messages must arrive in order despite out-of-order delivery, the UI must remain snappy while persisting messages to the server, users must see accurate delivery and read receipts, and the connection must recover transparently from network interruptions. Slack serves 20 million+ daily active users across 750,000+ organizations, with channels containing hundreds of thousands of messages. WhatsApp Web mirrors the mobile client state via a phone relay (distinct from Slack's direct server architecture). Both products share the same core challenge: building a UI that feels like a local application despite being entirely dependent on network connectivity.</p>
        <p>The key constraints: messages must appear in the sender's UI immediately (optimistic), arrive at recipients in the correct order (sequenced), be acknowledged by the server (delivered), and confirmed as seen (read). Any of these steps can fail independently — the server can accept a message but fail to fan it out to recipients, or a recipient can receive but not acknowledge. The UI must model all these states correctly without confusing the user.</p>
        <p><strong>Explicit scope:</strong> WebSocket connection management, message ordering and deduplication, optimistic send with status tracking, presence and typing indicators, and offline queue replay. Not in scope: backend message routing, push notification infrastructure, or server-side E2E encryption implementation.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Real-time messaging:</strong> Messages sent by the user appear immediately in the conversation (optimistic, before server confirmation). Messages from others arrive with sub-200ms latency on a stable connection. The WebSocket connection is maintained persistently; the client reconnects automatically with exponential backoff (1s, 2s, 4s, 8s, max 30s) on disconnection.</li>
          <li><strong>Message ordering:</strong> Messages within a channel are displayed in send order, not arrival order. Client-assigned Lamport timestamps (logical clocks, incremented on each send and adjusted on each receive if server timestamp is higher) establish a partial order. The server assigns a monotonic sequence number per channel — the client re-sorts on sequence number when it arrives. Gaps in sequence numbers trigger a backfill fetch.</li>
          <li><strong>Delivery status:</strong> Each message shows one of four states: Sending (optimistic, clock icon), Sent (server acknowledged, single check), Delivered (recipient device received, double check), Read (recipient opened conversation, filled double check). Status updates arrive as WebSocket events and update the message state in the React store.</li>
          <li><strong>Presence and typing:</strong> Online/offline/away presence for each contact is shown in the sidebar and conversation header. Typing indicators are shown when another user is actively typing (server broadcasts a typing event, suppressed if no keypress for 3s). Presence is updated via WebSocket heartbeat events.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Message store:</strong> All received messages are persisted in IndexedDB (via Dexie.js) — the last 10,000 messages per channel, pruned by a background worker. On page load, recent messages are loaded from IndexedDB instantly (no network wait), then the WebSocket connection syncs any messages missed while offline.</li>
          <li><strong>Performance:</strong> The message list virtualizes rendering (TanStack Virtual) — only visible messages are in the DOM regardless of channel history length. Smooth scrolling to unread messages on channel switch. New messages appearing at the bottom do not cause layout shift for users scrolled up (scroll-anchor CSS).</li>
          <li><strong>Offline queue:</strong> Messages composed while offline are held in an IndexedDB sync queue. On reconnection, queued messages are sent in order. If the server rejects a queued message (e.g., user was removed from channel while offline), the message is moved to a failed state with a retry/dismiss option.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The architecture has four data layers. The WebSocket Layer manages the persistent connection (one socket per client session), handles heartbeat pings (every 30s, disconnect after 2 missed pongs), and routes incoming events to the appropriate handlers. The Message Store (Zustand + IndexedDB) is the single source of truth for all message state — the WebSocket delivers raw events, a middleware normalizes them into the store, and React components read from the store reactively. The Optimistic Layer assigns client-side temporary IDs (cuid()) to outgoing messages, inserts them into the store immediately, and replaces them with server-assigned IDs when the server acknowledgement arrives. The Sync Engine handles reconnection gap-fill: on reconnect, it fetches messages since the last received sequence number for each channel the user has open, then replays the offline queue.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/messaging-communication/whatsapp-slack-frontend.svg"
          alt="WhatsApp Web / Slack frontend architecture: WebSocket lifecycle (connect on mount; heartbeat ping every 30s; missed pong × 2 → reconnect; exponential backoff 1s 2s 4s 8s max 30s; on reconnect: fetch since lastSeq per channel → gap-fill backfill), optimistic send (user sends message; assign clientId=cuid(); insert into Zustand store status=sending; POST or WS send; server ack: swap clientId→serverId, status=sent; fan-out event to recipient: status=delivered; recipient opens conversation: status=read), message ordering (Lamport clock: local_time = max(local, server_ts) + 1 on receive; server assigns monotonic seqNum per channel; client sort by seqNum; gap in seqNum → backfill GET /messages?channel=X&after=seqN), message rendering (TanStack Virtual: only visible rows in DOM; scroll-anchor: new messages don't shift scroll position for users scrolled up; channel switch: restore last scroll position from IndexedDB; unread jump button: count unread, click → scrollToIndex), presence and typing (presence events via WS: user:{id}:online/away/offline; typing: keypress → debounce 1s → TYPING_START event; no keypress 3s → TYPING_STOP; UI: 'User is typing...' with animated dots), offline queue (messages composed offline → IndexedDB syncQueue; on reconnect: flush queue in order; server 403 'not in channel' → failed state, show retry/dismiss)."
          caption="WebSocket lifecycle (30s heartbeat, exponential backoff reconnect, gap-fill on reconnect), optimistic send (cuid clientId → server swap, Sending→Sent→Delivered→Read), Lamport clock + server seqNum ordering, TanStack Virtual message list, presence WebSocket events, typing debounce 1s/3s, offline IndexedDB sync queue"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">WebSocket Connection Management</h3>
        <p>The WebSocket connection is initialized on application mount and maintained for the session lifetime. The client sends a ping frame every 30 seconds. If 2 consecutive pong responses are missing (60+ seconds of silence), the client assumes the connection is dead and begins reconnection with exponential backoff. The WebSocket URL includes an authentication token: wss://chat.example.com/ws?token=&#123;JWT&#125;. On each reconnect, the token is refreshed if the previous token is near expiry. The connection state (connecting, connected, disconnected, reconnecting) is stored in Zustand and shown in the UI header — a thin amber banner "Reconnecting..." appears during reconnection, turning green briefly on success, then disappearing.</p>
        <p>All incoming WebSocket frames are routed by event type: MESSAGE_RECEIVED, MESSAGE_STATUS_UPDATE, TYPING_START, TYPING_STOP, PRESENCE_UPDATE, CHANNEL_UPDATED. Each type has a dedicated handler that updates the Zustand store. Incoming message events include the server-assigned sequence number (seqNum) per channel. The client tracks the highest received seqNum per channel — gaps trigger a REST API backfill: GET /api/channels/&#123;channelId&#125;/messages?after=&#123;lastSeqNum&#125;.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimistic Message Sending</h3>
        <p>When the user presses Enter to send a message: (1) a client-side ID is generated (cuid() — a collision-resistant, ordered identifier); (2) the message is immediately inserted into the Zustand messages store with status: "sending" and the client ID as the key; (3) the message is dispatched to the server via WebSocket (or POST /api/messages as fallback if WebSocket is disconnected); (4) the server processes the message, assigns a monotonic sequence number and a permanent server ID, persists it, and sends back an acknowledgement event: &#123;type: "MESSAGE_ACK", clientId: "cid_xxx", serverId: "msg_yyy", seqNum: 42351, timestamp: "..."&#125;; (5) the client receives the ACK, replaces the clientId key with serverId in the store, and updates status to "sent". The user never sees a spinner — the message appears immediately and the status icon updates from clock → single check → double check → filled double check as confirmations arrive.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Message Ordering and Deduplication</h3>
        <p>Network conditions can cause messages to arrive out of order (a message sent 2nd arrives before a message sent 1st). The server's monotonic sequence number per channel is the authoritative ordering key. The client maintains messages in an ordered array sorted by seqNum, inserting new messages into the correct position using binary search (O(log N)). For messages not yet assigned a seqNum (optimistically sent messages awaiting ACK), they are appended at the tail with the local Lamport timestamp as a provisional sort key and moved to the correct position when the ACK with seqNum arrives.</p>
        <p>Deduplication prevents the same message from appearing twice (which can happen if the WebSocket delivers a message and the backfill REST call also returns it). The Zustand store uses a Map keyed by serverId — inserting a message with an existing serverId is a no-op. For optimistic messages, the client ID serves as the temporary key until the ACK arrives and the key is swapped to the serverId.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Virtualized Message List</h3>
        <p>TanStack Virtual (react-virtual) renders only the visible message rows plus a configurable overscan buffer (10 rows above and below the viewport). For a channel with 50,000 messages, only ~30 DOM nodes are ever present. The virtualizer requires knowing the height of each item — messages have variable heights (short text, long paragraph, images, file attachments). The virtualizer uses a dynamic measurement mode: it renders each item in a hidden measurement pass, caches the height, and uses the cached value for subsequent renders. New messages arriving at the bottom trigger a scroll-to-bottom only if the user is already at the bottom (within 100px of the end) — if they are scrolled up reading history, the new message arrives silently and a "1 new message" button appears at the bottom.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>WebSocket vs. SSE for receiving messages: SSE is simpler (HTTP/1.1, no upgrade handshake, automatic browser reconnect) and sufficient for unidirectional message delivery. However, chat requires bidirectional communication — sending messages also needs a low-latency path. With SSE, sends go via POST (adding one RTT per message) while receives arrive via SSE. With WebSocket, both sends and receives share the same persistent connection, reducing send latency. For chat applications where message send latency matters (real-time conversation feel), WebSocket is preferred despite higher complexity.</p>
        <p>End-to-end encryption complexity: WhatsApp uses the Signal Protocol — each message is encrypted with a per-message key derived from a ratcheting key exchange. The client holds private keys locally (localStorage, never sent to the server). The server receives only ciphertext. Implementing E2E encryption in the browser requires the Web Crypto API (SubtleCrypto) for key generation and en/decryption. The complexity is significant: key backup and restore (if the user clears localStorage), multi-device key distribution (linking a new device), and group key management (each group member receives an encrypted copy of the group key). For a staff interview, the key insight is that E2E encryption moves key management entirely to the client — the server is a dumb relay for ciphertext.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A WhatsApp Web / Slack frontend is built on four pillars: (1) WebSocket connection management (30s heartbeat, exponential backoff reconnect, gap-fill backfill on reconnect via GET /messages?after=lastSeqNum); (2) optimistic send (cuid clientId → immediate insert status=sending → ACK swap to serverId + seqNum → Sending/Sent/Delivered/Read status icons); (3) message ordering (server monotonic seqNum per channel as authoritative sort key, binary search insert, dedup by serverId Map, Lamport clock for provisional ordering of in-flight messages); and (4) virtualized rendering (TanStack Virtual ~30 DOM nodes regardless of history, dynamic height measurement, scroll-to-bottom only if already at bottom, "N new messages" button for users scrolled up). IndexedDB persists the last 10,000 messages per channel for instant load on page open. The fundamental constraint: at real-time chat latency, every architectural decision must be evaluated in terms of round trips — one extra RTT per message is imperceptible at 50ms but catastrophic at 400ms.</p>
      </section>
    </ArticleLayout>
  );
}
