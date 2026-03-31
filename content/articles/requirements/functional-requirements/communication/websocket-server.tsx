"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-comm-backend-websocket-server",
  title: "WebSocket Server",
  description:
    "Comprehensive guide to implementing WebSocket servers covering connection management, scaling strategies, heartbeat mechanisms, reconnection handling, and distributed system patterns for high-volume real-time communication.",
  category: "functional-requirements",
  subcategory: "communication",
  slug: "websocket-server",
  version: "extensive",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-30",
  tags: [
    "requirements",
    "functional",
    "communication",
    "websocket",
    "backend",
    "real-time",
    "scaling",
    "connection-management",
  ],
  relatedTopics: ["messaging-service", "presence-indicators", "chat-interface", "offline-message-queue"],
};

export default function WebSocketServerArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          WebSocket server maintains persistent bidirectional connections for real-time communication, enabling instant message delivery, presence updates, and live synchronization between clients and servers. Unlike HTTP request-response, WebSocket provides full-duplex communication over a single TCP connection, dramatically reducing latency and overhead for real-time features. The WebSocket server is the backbone of chat applications, collaborative tools, live dashboards, and any system requiring sub-second updates.
        </p>
        <p>
          The operational complexity of WebSocket servers is often underestimated. Each connection consumes server resources (memory, file descriptors) for its entire lifetime—minutes for casual users, hours for active users, potentially days for mobile apps with background connections. A server handling 50,000 concurrent connections must manage 50,000 open TCP connections, each requiring heartbeat monitoring, message buffering, and graceful disconnect handling. Connection storms—when thousands of users reconnect simultaneously after an outage—can overwhelm servers designed for steady-state load.
        </p>
        <p>
          For staff and principal engineers, WebSocket server implementation involves distributed systems challenges. Connections must distribute across servers using consistent hashing for efficient routing. Heartbeat mechanisms detect stale connections without false positives from temporary network blips. Reconnection logic must handle network transitions (WiFi to cellular), app backgrounding, and server restarts gracefully. The architecture must scale horizontally, handling connection growth without degrading latency for existing connections. Monitoring must detect connection leaks, memory pressure, and heartbeat failures before users notice.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>WebSocket Protocol</h3>
        <p>
          WebSocket handshake upgrades HTTP connection to WebSocket protocol. Client sends HTTP request with Upgrade: websocket header, Sec-WebSocket-Key. Server responds with 101 Switching Protocols, Sec-WebSocket-Accept (key hash). Connection upgrades to binary protocol with framing for messages. Handshake includes origin validation for security, subprotocol negotiation for application-specific protocols.
        </p>
        <p>
          Message framing wraps data in frames with opcode (text, binary, ping, pong, close). Text frames carry UTF-8 encoded messages. Binary frames carry arbitrary binary data (images, files). Control frames (ping, pong, close) manage connection lifecycle. Frames support masking (client-to-server) to prevent cache poisoning, fragmentation for large messages.
        </p>
        <p>
          Connection lifecycle: connecting (handshake in progress), open (ready for messages), closing (close frame sent/received), closed (connection terminated). Proper lifecycle management ensures resources release on disconnect, prevents zombie connections, enables clean reconnection.
        </p>

        <h3 className="mt-6">Connection Management</h3>
        <p>
          Connection registry tracks active connections. Maps user ID to WebSocket connection object. Supports multiple devices per user—store set of connections keyed by device ID. Registry enables targeted message delivery—lookup recipient's connection, send message. Implementation uses concurrent hash map or Redis for distributed registry.
        </p>
        <p>
          Connection limits prevent resource exhaustion. Per-server limit (typical: 10,000-100,000 connections) based on available memory and file descriptors. Per-user limit (typical: 3-10 devices) prevents abuse. When limit reached, reject new connections or evict oldest idle connection. Monitor connection count, alert at 80% capacity.
        </p>
        <p>
          Graceful shutdown drains connections before server restart. Stop accepting new connections. Send close frame to existing connections with timeout (30 seconds). Wait for acknowledgments, force close after timeout. Drain ensures in-flight messages deliver, prevents data loss during deployments.
        </p>

        <h3 className="mt-6">Heartbeat Mechanism</h3>
        <p>
          Ping/pong heartbeat detects stale connections. Server sends ping frame every 30 seconds. Client responds with pong. No pong within timeout (90 seconds) triggers disconnect. Heartbeat prevents NAT timeout (typical: 5-30 minutes), detects network failures, keeps connection alive through firewalls.
        </p>
        <p>
          Application-level heartbeat supplements protocol heartbeat. Send application message (empty or status) every 30-60 seconds. Confirms end-to-end connectivity, not just TCP connection. Detects cases where TCP connection appears open but application layer frozen. More reliable than ping/pong alone.
        </p>
        <p>
          Adaptive heartbeat adjusts frequency based on connection state. Active connections (sending messages) need less frequent heartbeat—message traffic proves liveness. Idle connections need more frequent heartbeat. Mobile connections need more frequent heartbeat due to network transitions. Implement adaptive logic based on message rate and connection type.
        </p>

        <h3 className="mt-6">Reconnection Handling</h3>
        <p>
          Exponential backoff prevents connection storms. Client reconnects with delay: 1s, 2s, 4s, 8s, 16s, max 30s. Random jitter (±20%) prevents thundering herd—clients don't all reconnect simultaneously. Backoff balances quick recovery with server protection.
        </p>
        <p>
          Session resumption preserves state across reconnects. Client sends session ID or last message ID on reconnect. Server restores session state, delivers missed messages. Resumption avoids full re-sync, reduces reconnect latency. Session stored with TTL (typically 5-30 minutes).
        </p>
        <p>
          Connection migration handles server restarts. Client detects disconnect, reconnects to any available server. Server retrieves session from shared storage (Redis). Migration transparent to user—messages continue flowing. Requires shared session storage across servers.
        </p>

        <h3 className="mt-6">Scaling Strategies</h3>
        <p>
          Horizontal scaling adds servers to handle more connections. Load balancer distributes incoming connections across servers. Consistent hashing pins user to specific server—same user reconnects to same server. Enables session affinity, reduces shared state. Consistent hashing minimizes remapping when servers added/removed.
        </p>
        <p>
          Connection sharding partitions connections by user ID hash. User ID hash modulo server count determines server. Enables deterministic routing—any server can route message to user's server. Challenge: rebalancing when servers change. Solution: virtual nodes, gradual migration.
        </p>
        <p>
          Regional deployment places WebSocket servers close to users. Users connect to nearest region for lowest latency. Cross-region messaging routes through regional hubs. Challenge: conversations spanning regions have higher latency. Solution: pin conversation to home region, replicate for disaster recovery.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          WebSocket server architecture spans connection handling, message routing, session management, and scaling infrastructure. Clients connect through load balancer to WebSocket servers. Server authenticates connection, registers in connection registry, starts heartbeat. Messages route through server to recipient's connection. Session state stored in shared storage for failover. Monitoring tracks connection health, server load, message throughput.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/websocket-server/websocket-architecture.svg"
          alt="WebSocket Server Architecture"
          caption="Figure 1: WebSocket Server Architecture — Connection handling, load balancing, session management, and scaling"
          width={1000}
          height={500}
        />

        <h3>Connection Handler</h3>
        <p>
          Connection handler accepts WebSocket handshakes. Validates origin header for security—reject cross-origin requests unless explicitly allowed. Validates authentication token (JWT or session cookie). Extract user ID, device info, capabilities from token. Reject invalid tokens with 401 Unauthorized.
        </p>
        <p>
          Connection object wraps raw WebSocket. Tracks metadata: user ID, device ID, connect time, last activity, message count. Implements send queue for backpressure—buffer messages when client slow. Implements timeout tracking—disconnect on heartbeat timeout. Connection object abstracts protocol details from application logic.
        </p>
        <p>
          Event handlers process WebSocket events. On message: parse, validate, route to message handler. On ping: respond with pong automatically (protocol level). On close: cleanup resources, update presence, notify message routing. On error: log error, cleanup, attempt graceful disconnect.
        </p>

        <h3 className="mt-6">Load Balancing</h3>
        <p>
          Layer 4 load balancing distributes TCP connections. Load balancer (nginx, HAProxy, AWS NLB) forwards TCP packets without inspecting WebSocket protocol. Pros: Low latency, protocol agnostic. Cons: No application awareness, can't route based on user ID. Best for: Simple deployments, protocol-level load balancing.
        </p>
        <p>
          Layer 7 load balancing inspects WebSocket handshake. Load balancer (nginx, Envoy) reads HTTP upgrade request, routes based on headers or path. Pros: Application-aware routing, can implement sticky sessions. Cons: Higher latency, protocol complexity. Best for: Multi-tenant deployments, path-based routing.
        </p>
        <p>
          Client-side load balancing connects directly to server. Client maintains list of servers, selects based on latency or hash. Pros: No load balancer bottleneck, direct connection. Cons: Client complexity, server discovery required. Best for: Large-scale deployments, P2P architectures.
        </p>

        <h3 className="mt-6">Session Management</h3>
        <p>
          Session storage preserves state across reconnects. Store in Redis with user ID as key. Session includes: user info, device capabilities, last message ID, subscription state. TTL (5-30 minutes) cleans up abandoned sessions. Session enables seamless reconnection without full re-sync.
        </p>
        <p>
          State synchronization on reconnect. Client sends session ID or last message ID. Server retrieves session, delivers missed messages, restores subscriptions. Sync avoids duplicate messages, ensures continuity. Implement idempotent sync—safe to retry if reconnect fails mid-sync.
        </p>
        <p>
          Distributed session sharing enables failover. All servers access shared Redis cluster. When server fails, connections reconnect to different server, session retrieved from Redis. Requires fast Redis access—session retrieval on critical path for reconnect latency.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/websocket-server/connection-lifecycle.svg"
          alt="Connection Lifecycle"
          caption="Figure 2: Connection Lifecycle — Handshake, active, heartbeat, and graceful disconnect"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Heartbeat Implementation</h3>
        <p>
          Server-side heartbeat timer sends ping every 30 seconds. Implementation uses setInterval or scheduled task. Track last pong time per connection. If no pong within 90 seconds, trigger disconnect. Timer cleanup on disconnect prevents memory leaks.
        </p>
        <p>
          Client-side heartbeat responds to ping automatically. Most WebSocket libraries handle ping/pong at protocol level. Application-level heartbeat sends custom message periodically. Confirms application layer responsive, not just TCP connection.
        </p>
        <p>
          Heartbeat monitoring tracks success rate. Alert on high ping timeout rate—indicates network issues or server overload. Monitor distribution of pong latency—spikes indicate server pressure. Track heartbeat-induced disconnects—tune timeout if too aggressive.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/websocket-server/scaling-connections.svg"
          alt="Scaling WebSocket Connections"
          caption="Figure 3: Scaling WebSocket Connections — Horizontal scaling, connection sharding, and regional deployment"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          WebSocket server design involves trade-offs between connection density, latency, reliability, and operational complexity. Understanding these trade-offs enables informed decisions aligned with reliability requirements and operational capabilities.
        </p>

        <h3>Heartbeat Frequency</h3>
        <p>
          Frequent heartbeat (every 10-15 seconds) detects failures quickly. Pros: Fast failure detection, quick reconnect. Cons: Higher bandwidth, battery drain on mobile, more false positives from temporary blips. Best for: Financial trading, real-time gaming where every second matters.
        </p>
        <p>
          Moderate heartbeat (every 30-60 seconds) balances detection with overhead. Pros: Reasonable detection time, acceptable overhead. Cons: 1-2 minute detection delay. Best for: Most chat applications, collaborative tools.
        </p>
        <p>
          Infrequent heartbeat (every 2-5 minutes) minimizes overhead. Pros: Lowest bandwidth and battery impact. Cons: Slow failure detection (5+ minutes), NAT timeout risk. Best for: Background sync, low-priority notifications.
        </p>

        <h3>Connection Persistence</h3>
        <p>
          Long-lived connections maintain connection for hours/days. Pros: Lowest latency (no reconnect), best UX. Cons: High resource usage, connection limits, mobile battery drain. Best for: Desktop apps, always-on devices, active trading.
        </p>
        <p>
          Session-based connections reconnect on app background. Pros: Lower resource usage, mobile-friendly. Cons: Reconnect latency, missed messages during disconnect. Best for: Mobile apps, battery-conscious designs.
        </p>
        <p>
          Hybrid approach uses long-lived for active, session-based for background. App foreground: maintain connection. App background: disconnect, rely on push notifications. Best for: Most mobile messaging apps.
        </p>

        <h3>Scaling Approaches</h3>
        <p>
          Sticky sessions pin user to specific server. Load balancer uses cookie or IP hash. Pros: Session affinity, reduced shared state. Cons: Uneven load if users distribute unevenly, server failure affects all pinned users. Best for: Moderate scale, simple deployments.
        </p>
        <p>
          Consistent hashing distributes users across servers deterministically. User ID hash determines server. Pros: Even distribution, minimal remapping on server changes. Cons: Requires client or gateway awareness of hash function. Best for: Large scale, dynamic server count.
        </p>
        <p>
          Random distribution assigns connections randomly. Load balancer picks random healthy server. Pros: Simple, even load distribution. Cons: No session affinity, requires shared session storage. Best for: Stateless connections, shared session architecture.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/websocket-server/reconnection-strategies.svg"
          alt="Reconnection Strategies"
          caption="Figure 4: Reconnection Strategies — Exponential backoff, session resumption, and connection migration"
          width={1000}
          height={450}
        />

        <h3>Message Delivery Guarantees</h3>
        <p>
          Fire-and-forget sends without acknowledgment. Pros: Lowest latency, simplest. Cons: No delivery guarantee, message loss on disconnect. Best for: Presence updates, typing indicators (loss acceptable).
        </p>
        <p>
          Acknowledged delivery waits for client ack. Pros: Delivery confirmation, retry on failure. Cons: Higher latency, ack overhead. Best for: Chat messages, important notifications.
        </p>
        <p>
          Persistent queue stores until delivered. Pros: Guaranteed delivery, survives server restarts. Cons: Highest latency, queue management complexity. Best for: Critical messages, offline-capable apps.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Implement heartbeat with timeout:</strong> Ping every 30 seconds, timeout after 90 seconds. Detect stale connections before they accumulate. Clean up resources on timeout. Monitor heartbeat success rate.
          </li>
          <li>
            <strong>Use exponential backoff for reconnection:</strong> 1s, 2s, 4s, 8s, 16s, max 30s. Add jitter (±20%) to prevent thundering herd. Client-side implementation protects server from connection storms.
          </li>
          <li>
            <strong>Implement graceful shutdown:</strong> Stop accepting new connections. Send close frame with timeout. Wait for acks, force close after timeout. Drain ensures in-flight messages deliver during deployments.
          </li>
          <li>
            <strong>Set connection limits:</strong> Per-server limit (10K-100K based on capacity). Per-user limit (3-10 devices). Monitor at 80% capacity, alert before exhaustion. Evict oldest idle connections when limit reached.
          </li>
          <li>
            <strong>Store session state externally:</strong> Redis for shared session storage. Enables failover and connection migration. Session TTL (5-30 minutes) cleans abandoned sessions. Include user info, last message ID, subscriptions.
          </li>
          <li>
            <strong>Implement backpressure:</strong> Buffer messages when client slow. Limit buffer size (100-1000 messages). Pause sending when buffer full. Resume when buffer drains. Prevents memory exhaustion from slow clients.
          </li>
          <li>
            <strong>Monitor connection metrics:</strong> Connection count, connect/disconnect rate, heartbeat success rate, message throughput, buffer sizes. Alert on anomalies. Dashboard for real-time visibility.
          </li>
          <li>
            <strong>Validate origin header:</strong> Reject cross-origin WebSocket requests unless explicitly allowed. Prevents CSRF attacks via WebSocket. Whitelist trusted origins.
          </li>
          <li>
            <strong>Compress messages:</strong> Enable permessage-deflate extension for text messages. Reduces bandwidth for verbose messages (JSON). Benchmark compression overhead vs savings.
          </li>
          <li>
            <strong>Handle mobile transitions:</strong> Detect network changes (WiFi to cellular). Reconnect on network change. Implement aggressive reconnect for mobile clients. Use push notifications as backup.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No heartbeat implementation:</strong> Connections appear open but are dead (NAT timeout). Solution: Implement ping/pong with timeout, application-level heartbeat.
          </li>
          <li>
            <strong>Resource leaks on disconnect:</strong> Event listeners, timers, buffers not cleaned up. Solution: Proper cleanup in close handler, use weak references, monitor memory growth.
          </li>
          <li>
            <strong>No connection limits:</strong> Server accepts unlimited connections until crash. Solution: Set per-server and per-user limits, monitor capacity, implement eviction.
          </li>
          <li>
            <strong>Ignoring backpressure:</strong> Sending faster than client can receive. Solution: Implement send queue with limits, pause on full, monitor queue depth.
          </li>
          <li>
            <strong>No graceful shutdown:</strong> Force kill drops all connections. Solution: Implement drain on shutdown, wait for acks, timeout force close.
          </li>
          <li>
            <strong>Origin validation missing:</strong> Cross-origin attacks possible. Solution: Validate origin header, whitelist trusted origins.
          </li>
          <li>
            <strong>No session persistence:</strong> Reconnect requires full re-sync. Solution: Store session in Redis, resume on reconnect.
          </li>
          <li>
            <strong>Connection storms after outage:</strong> All clients reconnect simultaneously, overwhelm servers. Solution: Client-side exponential backoff with jitter, server-side rate limiting.
          </li>
          <li>
            <strong>Mobile battery drain:</strong> Constant connection drains battery. Solution: Hybrid approach—disconnect on background, use push notifications.
          </li>
          <li>
            <strong>No monitoring:</strong> Connection issues undetected until users complain. Solution: Monitor connection count, heartbeat success, reconnect rate. Alert on anomalies.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Slack Real-time Infrastructure</h3>
        <p>
          Slack uses WebSocket for real-time message delivery and presence. Connection multiplexing handles multiple workspaces per client. Heartbeat every 30 seconds with 60-second timeout. Slack implements message acknowledgments with retry. Connection state synchronized across devices for seamless multi-device experience.
        </p>

        <h3 className="mt-6">Discord Gateway</h3>
        <p>
          Discord's WebSocket gateway handles millions of concurrent connections. Implements connection sharding by user ID. Heartbeat with interval negotiated per connection. Discord uses resume capability—reconnects resume session without full re-sync. Gateway scales horizontally with consistent hashing for user routing.
        </p>

        <h3 className="mt-6">Facebook Chat</h3>
        <p>
          Facebook uses WebSocket (with HTTP long-polling fallback) for Messenger. Connection pinned to user's home region. Cross-region messaging routes through regional hubs. Facebook implements aggressive reconnection for mobile—reconnect on network change. Session stored in TAo (Facebook's graph store) for failover.
        </p>

        <h3 className="mt-6">Pusher/Ably Real-time Services</h3>
        <p>
          Pusher and Ably provide WebSocket infrastructure as a service. Multi-region deployment with automatic failover. Connection state replicated across regions. Implement automatic reconnection with session resumption. Provide SDKs with built-in backoff and reconnection logic.
        </p>

        <h3 className="mt-6">Trading Platforms</h3>
        <p>
          Financial trading platforms use WebSocket for real-time price updates. Ultra-low latency requirements (sub-millisecond). Dedicated connections for high-frequency traders. Heartbeat frequency higher (5-10 seconds) for fast failure detection. Redundant connections to multiple servers for reliability.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you scale WebSocket servers?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Horizontal scaling with load balancer distributing connections. Consistent hashing pins user to specific server for session affinity. Connection registry in Redis for distributed lookup. Implement graceful shutdown for zero-downtime deployments. Monitor connection count per server, auto-scale at 80% capacity. Use sticky sessions or consistent hashing to minimize session replication.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle WebSocket reconnection?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Client implements exponential backoff (1s, 2s, 4s, 8s, max 30s) with jitter (±20%). On reconnect, client sends session ID or last message ID. Server retrieves session from Redis, delivers missed messages, restores subscriptions. Session TTL (5-30 minutes) cleans abandoned sessions. Implement idempotent sync—safe to retry if reconnect fails mid-sync.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you detect stale connections?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Heartbeat with ping/pong every 30 seconds. Track last pong time per connection. Timeout after 90 seconds without pong—trigger disconnect. Application-level heartbeat supplements protocol heartbeat for end-to-end detection. Monitor heartbeat success rate, alert on high timeout rate. Adaptive heartbeat adjusts frequency based on connection activity.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent connection storms?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Client-side exponential backoff with jitter prevents simultaneous reconnects. Server-side rate limiting on new connections. Queue reconnection requests, process at sustainable rate. Pre-warm connection pool before expected storms (after maintenance). Implement circuit breaker—shed load when overloaded. Gradual reconnection—reconnect subset of users per second.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle mobile network transitions?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Detect network change events (WiFi to cellular). Trigger immediate reconnect on network change. Use aggressive reconnect for mobile—shorter backoff intervals. Implement connection migration—session survives server change. Use push notifications as backup when WebSocket unavailable. Hybrid approach—disconnect on app background, reconnect on foreground.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement backpressure?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Send queue buffers messages when client slow. Limit queue size (100-1000 messages). Track queue depth per connection. Pause sending when queue full. Resume when queue drains below threshold. Monitor queue depth—alert on sustained high queues. Force disconnect clients that can't keep up (prevent memory exhaustion).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://datatracker.ietf.org/doc/html/rfc6455"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              RFC 6455 — The WebSocket Protocol
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
              href="https://slack.engineering/tagged/websockets"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Slack Engineering — WebSocket Infrastructure
            </a>
          </li>
          <li>
            <a
              href="https://github.com/faye/faye-websocket-node"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Faye WebSocket — WebSocket Server Implementation
            </a>
          </li>
          <li>
            <a
              href="https://ably.com/blog/websocket-api"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ably — Building a Real-time WebSocket API
            </a>
          </li>
          <li>
            <a
              href="https://nginx.org/en/docs/http/websocket.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              nginx — WebSocket Proxy Configuration
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
