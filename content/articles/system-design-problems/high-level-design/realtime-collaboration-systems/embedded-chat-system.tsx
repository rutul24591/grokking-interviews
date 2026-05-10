"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-embedded-chat-system",
  title: "Design an Embedded Chat System",
  description:
    "Architecture for an in-product chat system: message delivery, read receipts, threading, search, moderation, and scalable WebSocket fan-out.",
  category: "high-level-design",
  subcategory: "realtime-collaboration-systems",
  slug: "embedded-chat-system",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-10",
  tags: ["hld", "chat", "messaging", "WebSocket", "fan-out", "read-receipts"],
  relatedTopics: ["presence-system", "comments-system"],
};

export default function EmbeddedChatSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>An embedded chat system is distinct from a standalone messaging app (Slack, WhatsApp) in that it is tightly integrated with the host application's context: a chat panel in a project management tool, a customer support widget in an e-commerce site, an in-game chat in a gaming platform. The context integration creates requirements that standalone chat apps do not have: messages may reference host application entities (a task, a product, a player), participants are limited to users with access to the host context (team members, support agents, teammates), and the chat UI must fit within the host application's layout constraints (a sidebar, a floating widget, an overlay panel).</p>
        <p>The core messaging challenge is reliable delivery: every message must be delivered to every participant, even if they are offline at the time of sending. Unlike real-time event streaming (where missed events are acceptable), chat messages are durable—a message sent must eventually be seen by the recipient, even if they are offline for days. This reliability requirement differentiates chat from presence systems (where missed events are acceptable) and requires a persistent message store, not just a real-time pub/sub system.</p>
        <p><strong>Explicit assumptions:</strong> The embedded chat supports channels (group conversations) and direct messages. Channels can have up to 500 members. Messages are text with optional rich content (images, file attachments, emoji reactions, link previews). Messages are permanently stored (subject to configurable retention policies). Real-time delivery uses WebSocket; offline delivery uses push notifications. Read receipts are tracked at the message level (per-user read state). Search covers the full message history within a channel.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Message sending and delivery:</strong> Messages are delivered to all channel members within 1 second when members are online. Offline members receive messages on next login (via push notification trigger and message fetch on app open).</li>
          <li><strong>Message threading:</strong> Reply to specific messages, creating a thread. Thread messages are shown collapsed in the main channel view and expanded in a thread panel.</li>
          <li><strong>Read receipts:</strong> Show which members have read each message (seen by count, or specific user avatars for small groups). Mark all as read when a channel is opened.</li>
          <li><strong>Reactions:</strong> Emoji reactions to messages. Multiple users can react with the same emoji; counts are shown. Reactions update in real-time.</li>
          <li><strong>Message search:</strong> Full-text search within a channel or across all channels. Search includes message content and linked document titles.</li>
          <li><strong>Moderation:</strong> Message deletion (by sender or admin), message editing (by sender, with edit history). Pinned messages. Content moderation for public/external channels.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Message delivery guarantee:</strong> At-least-once delivery. No message is ever lost. Duplicate delivery is possible (deduplicated client-side by messageId).</li>
          <li><strong>Ordering:</strong> Messages within a channel are delivered in sent order. The order is determined by the server at time of receipt, not by client clock.</li>
          <li><strong>Scale:</strong> 50,000 concurrent WebSocket connections, 10,000 messages per second across all channels.</li>
          <li><strong>History load time:</strong> Loading the last 50 messages of any channel within 200ms (served from cache for active channels).</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The chat system has four components: the Message Service (handles message creation, persistence, and fan-out), the WebSocket Gateway (maintains persistent WebSocket connections to online clients, routes incoming messages to the Message Service, and delivers outgoing messages to connected clients), the Message Store (PostgreSQL for durable message storage, Redis for active channel caches), and the Push Notification Service (delivers mobile push notifications to offline users). The WebSocket Gateway and Message Service are logically separate: the Gateway is stateful (maintains connections) while the Message Service is stateless (processes message events from a queue).</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/realtime-collaboration-systems/embedded-chat-system-architecture.svg"
          alt="Embedded chat system architecture showing client → WebSocket Gateway (stateful, connection registry in Redis) → Kafka message queue → Message Service (persist to PostgreSQL, fan-out to channel members) → WebSocket Gateway delivery (pub/sub via Redis). Push notification path for offline users. Message Store (PostgreSQL + Redis channel cache). Read receipt tracking. Search index."
          caption="Chat architecture: WebSocket Gateway, Kafka message queue, Message Service fan-out, Redis pub/sub delivery, and push notifications for offline users"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Message Persistence and Ordering</h3>
        <p>Every message is persisted to PostgreSQL before being delivered to any recipient. The message record: messageId (UUID), channelId, senderId, content (text), attachments (JSON array of attachment metadata), parentMessageId (null for top-level, or the ID of the parent message for threads), createdAt (server timestamp—the source of truth for message order), clientNonce (a UUID generated by the client, used for deduplication), and editedAt. The server-assigned createdAt (using PostgreSQL's NOW() at the time of INSERT) determines message order; client timestamps are not used for ordering.</p>
        <p>The clientNonce is the primary deduplication mechanism. If the client sends a message and the network fails before receiving the server's acknowledgment, the client retries with the same nonce. The server checks for an existing message with the same (channelId, senderId, clientNonce) tuple and returns the existing message rather than creating a duplicate. Nonces have a 24-hour validity window (sufficient for network retries) after which they expire and the same nonce could theoretically be reused (acceptable since the content would be identical).</p>
        <p>Message ordering within a channel: PostgreSQL's createdAt timestamp provides per-millisecond ordering, but multiple messages can arrive within the same millisecond. A secondary sort key (the auto-incrementing messageId sequence within a channel, using a PostgreSQL sequence per channel or a global sequence with sharding) provides a strict total order. Clients display messages in this canonical order, which may differ slightly from the order in which the client observed them (network reordering is possible), but produces a consistent view across all clients.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">WebSocket Fan-Out at Scale</h3>
        <p>When a message is sent to a channel with 500 members, 500 WebSocket connections must receive the message. The fan-out challenge: WebSocket connections are distributed across multiple Gateway servers (each server maintains a subset of all connections). The message must reach every Gateway server that has at least one member of the channel connected. The solution is Redis pub/sub: each channel has a Redis pub/sub topic. The Message Service publishes the message to the channel's Redis topic; every Gateway server subscribed to that topic delivers the message to its connected clients who are members of the channel.</p>
        <p>This architecture scales horizontally: adding more Gateway servers increases total connection capacity. The Redis pub/sub layer decouples the Message Service from the Gateways. The Message Service is stateless (no knowledge of which client is on which Gateway); the Gateway is stateful (knows which connections it manages and which channels each connection is subscribed to). Each Gateway subscribes to the Redis topics for all channels that have at least one connected client. When the last client in a channel disconnects from a Gateway, that Gateway unsubscribes from the channel's topic (to avoid receiving unnecessary messages).</p>
        <p>Large channel fan-out: for channels with 500 members and high message volume, the Redis pub/sub approach may become a bottleneck (Redis single-threaded pub/sub can become a bottleneck at very high message rates for very large channels). For channels above a configurable size threshold (e.g., 100 members), the fan-out transitions to a Kafka-based approach: the Message Service publishes to a Kafka topic partitioned by channelId. A set of fan-out workers consume the Kafka topic and push messages to the appropriate Redis channel keys, which the Gateways poll or subscribe to. This decouples the message publication rate from the fan-out delivery rate.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Read Receipts</h3>
        <p>Read receipts track the most recent message each user has read in a channel. The data model: (userId, channelId, lastReadMessageId). When a user opens a channel, the client sends a read_channel event with the channelId and the latest visible messageId. The server updates the lastReadMessageId for this (userId, channelId). The unread count for a user in a channel is computed as: COUNT(*) WHERE messageId &gt; lastReadMessageId AND channelId = this channel AND senderId != userId. This count is expensive to compute on every request; it is cached in Redis (keyed by userId+channelId) and updated when new messages arrive or when the user reads the channel.</p>
        <p>Broadcasting read receipts to other channel members (for "Alice has read this message" indicators) is high-frequency and low-priority. Rather than delivering a separate WebSocket event for every read action, read receipts are batched and delivered as part of the channel's periodic state update (a snapshot of all members' lastReadMessageIds, sent every 5–10 seconds). For small group chats (&lt;10 members), per-message read receipt events may be delivered individually for a more responsive "seen" indicator, matching the behavior of iMessage and WhatsApp. For large channels (100+ members), individual read receipt events would flood the WebSocket with noise; the batched approach is appropriate.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Message History and Pagination</h3>
        <p>The initial channel view loads the last 50 messages (cursor-based pagination, using the most recent message's createdAt and messageId as the cursor). Older messages load on scroll (infinite scroll upward) using the oldest visible message as the cursor: SELECT * FROM messages WHERE channelId = :id AND (createdAt, messageId) &lt; (cursor.createdAt, cursor.messageId) ORDER BY createdAt DESC, messageId DESC LIMIT 50. Active channels have their recent messages cached in Redis (a sorted set of messageIds per channelId, with the message JSON as the value), serving the initial load from cache without a database query. The cache TTL is 24 hours; channels inactive for 24 hours are loaded from the database on next access.</p>
        <p>Jump-to-message (for search results or notification links that deep-link to a specific message): the client fetches 25 messages before and 25 messages after the target messageId, using the target's (createdAt, messageId) as the cursor in both directions. The resulting 50 messages are displayed with the target message centered and highlighted. The user can then scroll up or down to load more context.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Typing Indicators and Presence</h3>
        <p>Typing indicators ("Alice is typing...") are ephemeral presence events—they do not need to be persisted and do not need reliable delivery. The client sends a typing_start event via WebSocket when the user begins typing and a typing_stop event when they stop (or 3 seconds after the last keystroke, whichever comes first). The Message Service broadcasts these events to all other online members of the channel via Redis pub/sub. The "typing" state on the client expires after 3 seconds if no new typing_start is received (handling the case where typing_stop is lost due to network issues). Multiple concurrent typists are shown: "Alice and Bob are typing..."</p>
        <p>Typing indicators are throttled to prevent flooding: the client sends typing_start only once per continuous typing session (not on every keystroke) and sends it again only after a 3-second pause followed by resuming typing. This ensures the server receives at most one typing_start per 3 seconds per user per channel, regardless of typing speed.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/realtime-collaboration-systems/embedded-chat-system-reliability.svg"
          alt="Chat message delivery reliability showing at-least-once delivery guarantee (client nonce deduplication, server acknowledgment, retry on timeout), read receipt tracking (lastReadMessageId per userId+channelId, Redis unread count cache), offline delivery path (push notification trigger → app open → fetch missed messages from cursor), and message ordering (server-assigned timestamp + channel sequence number)."
          caption="Chat reliability: at-least-once delivery with nonce deduplication, read receipt caching, offline push + fetch on reconnect, and server-ordered messages"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>At-least-once versus exactly-once delivery: exactly-once delivery requires distributed transaction semantics (the message is persisted and the WebSocket event is delivered in a single atomic operation) which is architecturally expensive. At-least-once delivery (the message is persisted, then delivered; in failure scenarios it may be delivered multiple times) is simpler and sufficient when the client deduplicates by messageId. The client maintains a set of recently received messageIds; duplicate delivery (the same messageId received twice) is silently ignored. This is the approach used by WhatsApp and Slack.</p>
        <p>Message search implementation: full-text search over millions of messages requires a dedicated search index. Elasticsearch (or the managed equivalent, Algolia) indexes message content, sender, and timestamp. New messages are indexed asynchronously (a Kafka consumer writes to the search index with a 1–5 second delay). Search results include highlighted matching text snippets and link to the message in context. For very high-volume channels (thousands of messages per day), the search index becomes a significant storage and indexing cost; retention policies (deleting messages and their index entries older than 90 days, or gating search beyond 90 days behind a paid tier) are the common cost control mechanism.</p>
        <p>Message encryption: messages in transit are encrypted via TLS. Messages at rest (in PostgreSQL) may be stored in plaintext (for operator access and search indexing) or encrypted (for privacy). End-to-end encryption (where the server cannot read message content) requires client-side encryption before sending, which means the server cannot perform content moderation, search indexing, or link preview generation. For enterprise chat systems where operator moderation is required, end-to-end encryption is incompatible. For consumer messaging apps where user privacy is paramount (Signal, WhatsApp), E2EE is the correct choice despite these limitations.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>An embedded chat system is built on three foundations: durable message persistence (PostgreSQL with server-assigned ordering, client nonce deduplication for at-least-once delivery), real-time WebSocket fan-out (Redis pub/sub routing messages from the Message Service to all connected Gateway servers with members in the channel), and offline delivery (push notifications trigger app open, which fetches missed messages from the cursor position). Read receipts track per-user lastReadMessageId with Redis-cached unread counts. Message history uses cursor-based pagination with Redis caching for active channels. Typing indicators use ephemeral WebSocket events with 3-second client-side expiry. Large channel fan-out (&gt;100 members) transitions from Redis pub/sub to Kafka-based fan-out workers to avoid Redis single-threaded pub/sub bottleneck. Search indexes message content in Elasticsearch with a 1–5 second asynchronous delay. The defining reliability guarantee is at-least-once delivery with client-side deduplication by messageId—simpler and more scalable than exactly-once, with equivalent user-facing correctness.</p>
      </section>
    </ArticleLayout>
  );
}
