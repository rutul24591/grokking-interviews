"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-comm-backend-messaging-service",
  title: "Messaging Service",
  description:
    "Comprehensive guide to implementing messaging services covering message routing, delivery guarantees, ordering, offline handling, scaling strategies, and distributed system patterns for high-volume real-time communication.",
  category: "functional-requirements",
  subcategory: "communication",
  slug: "messaging-service",
  version: "extensive",
  wordCount: 6300,
  readingTime: 25,
  lastUpdated: "2026-03-30",
  tags: [
    "requirements",
    "functional",
    "communication",
    "messaging",
    "backend",
    "real-time",
    "distributed-systems",
    "websocket",
  ],
  relatedTopics: ["websocket-server", "offline-message-queue", "presence-indicators", "read-receipts"],
};

export default function MessagingServiceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Messaging service handles message routing, delivery, and persistence for real-time communication, ensuring reliable message delivery even in challenging network conditions. The service sits between client applications and storage infrastructure, managing the complex orchestration of getting messages from sender to recipient(s) with appropriate delivery guarantees, ordering, and durability. At scale, messaging services must handle millions of messages per second while maintaining low latency and high availability.
        </p>
        <p>
          The core challenge of messaging services is balancing competing requirements: low latency for real-time feel, durability to prevent message loss, ordering to maintain conversation coherence, and scalability to handle traffic spikes. Different messaging scenarios have different requirements—chat messages need low latency, financial transactions need strong consistency, notifications need delivery guarantees. The architecture must accommodate these varying needs while maintaining operational simplicity.
        </p>
        <p>
          For staff and principal engineers, messaging service implementation involves distributed systems challenges. Messages must route correctly across potentially millions of concurrent connections. Delivery must handle offline recipients with queueing and retry logic. Ordering must account for clock skew, network delays, and concurrent sends from multiple devices. The service must scale horizontally, handling connection storms when users reconnect after outages. Monitoring must detect delivery failures, latency spikes, and queue backlogs before users notice.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Delivery Guarantees</h3>
        <p>
          At-most-once delivery sends message once with no retry. Message may be lost if network fails. Pros: Lowest latency, no duplicates. Cons: Message loss acceptable only for low-value data (typing indicators, presence updates). Implementation: Fire and forget, no acknowledgment required.
        </p>
        <p>
          At-least-once delivery retries until acknowledgment received. Message guaranteed to arrive but may duplicate. Pros: No message loss. Cons: Duplicates require deduplication logic. Implementation: Retry with exponential backoff, idempotency keys for deduplication. Most common for chat messages.
        </p>
        <p>
          Exactly-once delivery guarantees single delivery with no loss or duplicates. Pros: Ideal semantics. Cons: High complexity, performance cost, often impractical at scale. Implementation: Distributed transactions, consensus protocols. Rarely used except for financial transactions.
        </p>

        <h3 className="mt-6">Message Ordering</h3>
        <p>
          FIFO ordering preserves send order within a conversation. Messages arrive in same order sent. Implementation: Single-threaded processing per conversation, sequence numbers. Challenge: Concurrent sends from multiple devices, clock skew between servers. Solution: Server-assigned sequence numbers, not client timestamps.
        </p>
        <p>
          Causal ordering preserves cause-effect relationships. Reply arrives after original message even if sent concurrently. Implementation: Vector clocks or dependency tracking. Challenge: Complex at scale, requires tracking dependencies across messages. Used in collaborative editing, rarely in chat.
        </p>
        <p>
          Total ordering all clients see same order globally. Implementation: Centralized sequencer or consensus protocol. Challenge: Scalability bottleneck at sequencer. Used in chatrooms where consistent view matters more than latency.
        </p>

        <h3 className="mt-6">Message Routing</h3>
        <p>
          Direct routing sends message to specific recipient. Lookup recipient's connection, forward message. Implementation: Connection registry maps user ID to WebSocket connection. Challenge: User may have multiple devices (phone, tablet, desktop). Solution: Broadcast to all active connections.
        </p>
        <p>
          Group routing sends message to conversation members. Lookup all members, fan-out to each. Implementation: Conversation membership stored in database, cached in Redis. Challenge: Large groups (1000+ members) create fan-out explosion. Solution: Batch delivery, rate limiting, lazy delivery for inactive members.
        </p>
        <p>
          Broadcast routing sends message to all connected users. Implementation: Publish-subscribe pattern, message queue fans out to all subscribers. Challenge: Scale to millions of users. Solution: Hierarchical fan-out, regional sharding, CDN for static broadcasts.
        </p>

        <h3 className="mt-6">Offline Handling</h3>
        <p>
          Store-and-forward queues messages for offline recipients. Message persists until recipient connects or expires. Implementation: Message stored in database with delivery status, polled on reconnect. Challenge: Queue growth for users offline long-term. Solution: TTL-based expiration, archive old messages.
        </p>
        <p>
          Push notification wake-up sends push when recipient offline. Push payload contains message preview or silent wake-up signal. Implementation: Integrate with APNs (iOS) and FCM (Android). Challenge: Push may not deliver immediately. Solution: Combine with store-and-forward for reliability.
        </p>
        <p>
          Sync on reconnect delivers queued messages when recipient reconnects. Implementation: Client sends last received message ID, server returns messages since then. Challenge: Large backlog overwhelms client. Solution: Paginated sync, priority messages first (mentions, direct messages).
        </p>

        <h3 className="mt-6">Scaling Strategies</h3>
        <p>
          Connection sharding distributes WebSocket connections across servers. User's connection pinned to specific server based on user ID hash. Implementation: Consistent hashing, connection registry. Challenge: Rebalancing when servers added/removed. Solution: Virtual nodes, gradual migration.
        </p>
        <p>
          Message queue decoupling buffers messages between send and delivery. Kafka, RabbitMQ, or cloud queues absorb traffic spikes. Implementation: Publish to topic, consumers process at own pace. Challenge: Added latency from queue hop. Solution: In-memory queues for low-latency paths.
        </p>
        <p>
          Regional deployment places messaging servers close to users. Users connect to nearest region, messages route across regions if needed. Implementation: DNS-based routing, cross-region message replication. Challenge: Cross-region latency for conversations spanning regions. Solution: Pin conversation to home region, replicate for disaster recovery.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Messaging service architecture spans connection management, message routing, persistence, and delivery. Clients connect via WebSocket to gateway servers. Gateway authenticates, routes messages to appropriate handlers, manages connection lifecycle. Message handlers process business logic (validation, rate limiting, enrichment). Persistence layer stores messages durably. Delivery layer pushes to recipients via their active connections or queues for offline delivery.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/messaging-service/messaging-architecture.svg"
          alt="Messaging Service Architecture"
          caption="Figure 1: Messaging Service Architecture — Gateway, routing, persistence, and delivery layers"
          width={1000}
          height={500}
        />

        <h3>Gateway Layer</h3>
        <p>
          Gateway servers accept WebSocket connections from clients. Each gateway handles thousands of concurrent connections (typical limit: 10,000-50,000 per server). Gateway authenticates connection using JWT token or session cookie. Authentication includes user ID, device info, and capabilities (push enabled, encryption support).
        </p>
        <p>
          Connection registry tracks which user is connected to which gateway. Implementation uses Redis with user ID as key, gateway address as value. Supports multiple devices per user—store set of gateway connections. Registry enables message routing—lookup recipient's gateway, forward message.
        </p>
        <p>
          Gateway manages connection lifecycle. Heartbeat (ping/pong) every 30 seconds detects stale connections. Timeout after 90 seconds without heartbeat triggers disconnect. Graceful reconnect allows brief network blips without full reconnection. Gateway tracks connection state (connecting, connected, disconnecting, disconnected) for accurate presence.
        </p>

        <h3 className="mt-6">Message Processing Pipeline</h3>
        <p>
          Ingestion receives message from sender's gateway. Validates authentication, rate limits, message size (typically 4KB-64KB limit). Extracts metadata: sender ID, conversation ID, message type (text, image, file), timestamp. Assigns unique message ID (UUID) for idempotency.
        </p>
        <p>
          Processing applies business logic. Content moderation scans for spam, abuse, policy violations. Enrichment adds metadata (link previews, mention parsing). Rate limiting checks sender's message rate—typical limit 5-10 messages/second. Quota enforcement checks user's daily message limit if applicable.
        </p>
        <p>
          Persistence stores message durably before delivery. Write to database (Cassandra, DynamoDB, or sharded MySQL) with conversation ID, sender ID, message content, timestamp, sequence number. Sequence number assigned per conversation for ordering. Write-ahead log ensures durability before acknowledgment.
        </p>

        <h3 className="mt-6">Delivery Layer</h3>
        <p>
          Online delivery pushes message to recipient's active connections. Lookup recipient's gateway from connection registry. Forward message via internal RPC. Gateway pushes to WebSocket connection. Recipient sends delivery acknowledgment. Sender's gateway receives ack, updates message status to "delivered".
        </p>
        <p>
          Offline delivery queues message for later. Store in delivery queue with recipient ID, message ID, TTL (typically 30-90 days). When recipient reconnects, sync layer delivers queued messages. Push notification wakes recipient's device for urgent messages (direct messages, mentions).
        </p>
        <p>
          Group delivery fans out to all conversation members. For large groups (100+ members), batch delivery prevents overwhelming sender's connection. Rate limit group messages to prevent spam. Lazy delivery for inactive members—deliver when they next open the conversation rather than pushing immediately.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/messaging-service/message-routing-flow.svg"
          alt="Message Routing Flow"
          caption="Figure 2: Message Routing Flow — Sender to gateway, routing, persistence, recipient delivery"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Ordering and Consistency</h3>
        <p>
          Sequence number assignment happens at persistence time. Each conversation has a counter, incremented atomically per message. Implementation uses Redis INCR or database sequence. Sequence number stored with message, used for ordering and gap detection. Client uses sequence numbers to detect missed messages.
        </p>
        <p>
          Gap detection identifies missing messages. Client tracks highest received sequence number. On reconnect, client sends last sequence number. Server returns messages since then. If gap detected (missing sequence numbers), server re-sends missing messages from archive.
        </p>
        <p>
          Conflict resolution handles concurrent sends from same user on multiple devices. Both messages valid, both delivered. Order determined by server receive time, not client timestamp. Client merges messages, displays in server-ordered sequence. User sees consistent conversation regardless of which device they use.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/messaging-service/offline-delivery-flow.svg"
          alt="Offline Delivery Flow"
          caption="Figure 3: Offline Delivery Flow — Store-and-forward, push wake-up, sync on reconnect"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Messaging service design involves fundamental trade-offs between latency, durability, ordering, and scalability. Understanding these trade-offs enables informed decisions aligned with product requirements and user expectations.
        </p>

        <h3>Latency vs Durability</h3>
        <p>
          Write-ahead logging ensures durability before acknowledgment. Message persisted to WAL, then acknowledged, then asynchronously flushed to main storage. Pros: No message loss on crash. Cons: Added latency from WAL write (typically 5-20ms). Best for: Production messaging where message loss unacceptable.
        </p>
        <p>
          Async persistence acknowledges before persisting. Message queued in memory, acknowledged immediately, persisted asynchronously. Pros: Lowest latency (&lt;5ms). Cons: Message loss on crash (last few seconds). Best for: Low-value messages (typing indicators, presence), prototypes.
        </p>
        <p>
          Hybrid approach uses in-memory queue with replication. Message replicated to 2-3 servers before ack. Pros: Fast (memory speed), survives single server failure. Cons: Complex, still small window of potential loss. Best for: High-scale chat where both speed and reliability matter.
        </p>

        <h3>Ordering vs Scalability</h3>
        <p>
          Strict FIFO per conversation requires single-threaded processing. All messages for conversation processed in order. Pros: Simple, correct ordering. Cons: Conversation throughput limited to single server capacity. Best for: Small conversations, low-traffic apps.
        </p>
        <p>
          Partitioned ordering assigns conversation to specific partition. Messages within partition ordered, no ordering across partitions. Pros: Scales with partition count. Cons: Large conversations still bottlenecked. Best for: Most chat apps where conversations independent.
        </p>
        <p>
          Eventual ordering allows temporary reordering. Messages may arrive out of order, client reorders using sequence numbers. Pros: Maximum scalability, parallel processing. Cons: Client complexity, brief reordering visible. Best for: Very high-scale systems where perfect ordering less critical than throughput.
        </p>

        <h3>Push vs Poll for Offline</h3>
        <p>
          Push notification wake-up sends push for each message. Pros: Instant delivery, user engaged quickly. Cons: Battery drain, push rate limits, cost per push. Best for: Direct messages, urgent notifications, active users.
        </p>
        <p>
          Polling checks for messages periodically. Client polls every 30-60 seconds when backgrounded. Pros: No push dependency, predictable battery usage. Cons: Delivery delay up to poll interval, wasted polls when no messages. Best for: Apps without push, battery-conscious designs.
        </p>
        <p>
          Hybrid approach uses push for urgent, poll for bulk. Direct messages trigger push, group messages delivered on poll or app open. Pros: Balances immediacy with battery. Cons: Complexity in classifying urgency. Best for: Most production messaging apps.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/messaging-service/scaling-strategies.svg"
          alt="Scaling Strategies"
          caption="Figure 4: Scaling Strategies — Connection sharding, message queue decoupling, regional deployment"
          width={1000}
          height={450}
        />

        <h3>Centralized vs Distributed Routing</h3>
        <p>
          Centralized router uses single service for all routing decisions. Pros: Simple, consistent routing logic, easy debugging. Cons: Single bottleneck, single point of failure. Best for: Small to medium scale (&lt;1M concurrent users).
        </p>
        <p>
          Distributed routing embeds routing logic in gateways. Gateway looks up recipient, forwards directly. Pros: No central bottleneck, lower latency. Cons: Routing logic duplicated, harder to update. Best for: Large scale, low-latency requirements.
        </p>
        <p>
          Hybrid approach uses centralized routing for complex decisions, direct for simple. New conversations routed centrally, established conversations cached at gateway. Pros: Balances flexibility with performance. Cons: Cache invalidation complexity. Best for: Most production systems.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use at-least-once delivery with idempotency:</strong> Retry until acknowledged, use message IDs for deduplication. Accept duplicates are better than lost messages. Implement idempotency at database level with unique constraints.
          </li>
          <li>
            <strong>Assign server sequence numbers:</strong> Never trust client timestamps for ordering. Use atomic increment per conversation. Store sequence with message for ordering and gap detection.
          </li>
          <li>
            <strong>Implement connection heartbeats:</strong> Ping every 30 seconds, timeout after 90 seconds. Detect stale connections before they cause issues. Handle NAT timeout gracefully with reconnect logic.
          </li>
          <li>
            <strong>Queue offline messages with TTL:</strong> Store messages for offline users with expiration (30-90 days). Archive or delete expired messages. Notify users of old unread messages on reconnect.
          </li>
          <li>
            <strong>Rate limit at multiple levels:</strong> Per-user rate limits (messages/second), per-conversation limits (messages/minute), global limits (messages/second per server). Protect against spam and abuse.
          </li>
          <li>
            <strong>Monitor delivery latency:</strong> Track time from send to delivery. Alert on p99 latency spikes. Monitor queue depth for offline messages. Track delivery failure rates by error type.
          </li>
          <li>
            <strong>Implement graceful degradation:</strong> When overloaded, shed non-critical load (typing indicators, presence updates) before critical (messages). Queue rather than fail. Return clear error messages.
          </li>
          <li>
            <strong>Support multiple devices per user:</strong> Broadcast messages to all active connections. Track device capabilities (push enabled, encryption support). Handle device-specific delivery failures independently.
          </li>
          <li>
            <strong>Use backpressure for flow control:</strong> When recipient slow, buffer at sender rather than overwhelm. Signal backpressure through connection. Pause sending when buffer full.
          </li>
          <li>
            <strong>Plan for connection storms:</strong> After outage, millions may reconnect simultaneously. Rate limit reconnections. Stagger sync operations. Use exponential backoff on client side.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Using client timestamps for ordering:</strong> Clock skew causes messages to appear out of order. Solution: Server-assigned sequence numbers, use client timestamp for display only.
          </li>
          <li>
            <strong>No message deduplication:</strong> Network retries create duplicate messages. Solution: Unique message IDs, idempotent processing, database unique constraints.
          </li>
          <li>
            <strong>Ignoring connection lifecycle:</strong> Not detecting stale connections, not cleaning up on disconnect. Solution: Heartbeat with timeout, cleanup on disconnect, presence update.
          </li>
          <li>
            <strong>No offline handling:</strong> Messages lost when recipient offline. Solution: Store-and-forward queue, push notification wake-up, sync on reconnect.
          </li>
          <li>
            <strong>Single point of failure:</strong> Centralized router or database becomes bottleneck. Solution: Sharding, replication, distributed architecture.
          </li>
          <li>
            <strong>No rate limiting:</strong> Users or bots can spam messages. Solution: Multi-level rate limiting (user, conversation, server), clear error messaging.
          </li>
          <li>
            <strong>Ignoring backpressure:</strong> Overwhelming slow recipients or downstream services. Solution: Buffer with limits, signal backpressure, pause sending when full.
          </li>
          <li>
            <strong>No monitoring:</strong> Delivery failures undetected until users complain. Solution: Monitor delivery latency, failure rates, queue depth. Alert on anomalies.
          </li>
          <li>
            <strong>Poor reconnection handling:</strong> Connection storms after outage crash servers. Solution: Rate limit reconnections, stagger sync, exponential backoff on client.
          </li>
          <li>
            <strong>Not handling multiple devices:</strong> Messages only delivered to one device. Solution: Broadcast to all active connections, track device capabilities.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>WhatsApp Messaging Infrastructure</h3>
        <p>
          WhatsApp uses Erlang-based messaging servers handling millions of connections per server. Messages use at-least-once delivery with end-to-end encryption. Offline messages stored for 30 days. Sequence numbers ensure ordering across devices. WhatsApp optimized for low bandwidth, works on 2G networks.
        </p>

        <h3 className="mt-6">Slack Message Delivery</h3>
        <p>
          Slack uses a combination of WebSocket for real-time and HTTP fallback. Messages routed through channels with fan-out to members. Large channels (10,000+ members) use lazy delivery—messages delivered on demand rather than pushed. Slack implements message threading with separate sequence spaces per thread.
        </p>

        <h3 className="mt-6">Telegram Cloud Messaging</h3>
        <p>
          Telegram stores all messages in cloud, accessible from any device. Messages synced across devices with conflict resolution. Supports massive groups (200,000 members) with hierarchical fan-out. Telegram uses custom MTProto protocol optimized for mobile networks.
        </p>

        <h3 className="mt-6">Discord Real-time Infrastructure</h3>
        <p>
          Discord handles millions of concurrent WebSocket connections. Messages routed through Elixir-based servers with Redis for connection registry. Discord uses eventual consistency for message delivery—messages may arrive slightly out of order under load, client reorders. Voice and video use separate WebRTC infrastructure.
        </p>

        <h3 className="mt-6">Facebook Messenger Scaling</h3>
        <p>
          Messenger uses sharded MySQL for message storage with custom sharding by conversation ID. Messages replicated across data centers for disaster recovery. Offline messages delivered via MQTT protocol (lighter than HTTP). Messenger integrates with Facebook's TAO graph store for social context.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure message ordering?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use server-assigned sequence numbers per conversation. Atomic increment (Redis INCR or database sequence) ensures unique, ordered numbers. Store sequence with message. Client uses sequence to order messages and detect gaps. For concurrent sends from multiple devices, server receive time determines order, not client timestamp. Handle reordering at client layer for best UX.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle offline messages?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Store-and-forward queue messages for offline recipients. Store in database with delivery status and TTL (30-90 days). When recipient reconnects, sync layer delivers queued messages. For urgent messages (direct messages, mentions), send push notification to wake device. Implement pagination for large backlogs—deliver recent messages first, older messages on demand.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you scale messaging to millions of users?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Connection sharding distributes WebSocket connections across gateway servers using consistent hashing. Message queue (Kafka) decouples send and delivery, absorbing traffic spikes. Regional deployment places servers close to users. Database sharding by conversation ID distributes storage. Cache connection registry in Redis. Monitor and auto-scale based on connection count and message throughput.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent message loss?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Write-ahead logging before acknowledgment ensures durability. At-least-once delivery with retries until acknowledged. Idempotency keys prevent duplicates on retry. Replicate messages across multiple servers before ack. Monitor delivery failures and alert. Implement dead-letter queue for messages that fail repeatedly. Regular reconciliation between sent and delivered counts.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle connection storms?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Rate limit reconnections per server. Use exponential backoff on client side (1s, 2s, 4s, 8s, max 30s). Stagger sync operations—don't sync all queued messages at once. Use circuit breaker to shed load when overloaded. Queue reconnection requests, process at sustainable rate. Pre-warm connection pool before expected storms (e.g., after scheduled maintenance).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement group messaging at scale?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> For small groups (&lt;100 members), fan-out to all members immediately. For large groups, use lazy delivery—store message, deliver when members open conversation. Batch delivery to prevent overwhelming sender's connection. Rate limit group messages to prevent spam. Use hierarchical fan-out for very large groups (10,000+ members)—deliver to active members first, inactive on demand.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://blog.whatsapp.com/10000000"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp Engineering — Handling 100 Billion Messages Daily
            </a>
          </li>
          <li>
            <a
              href="https://slack.engineering/tagged/messaging"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Slack Engineering — Messaging Infrastructure
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
              href="https://kafka.apache.org/documentation/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apache Kafka — Distributed Streaming Platform
            </a>
          </li>
          <li>
            <a
              href="https://aws.amazon.com/blogs/mobile/building-a-scalable-real-time-messaging-service/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS — Building a Scalable Real-Time Messaging Service
            </a>
          </li>
          <li>
            <a
              href="https://www.rabbitmq.com/documentation.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              RabbitMQ — Messaging Broker Documentation
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
