"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-realtime-ui-handling",
  title: "Real-Time UI Handling",
  description:
    "Comprehensive guide to building real-time UIs: WebSockets, Server-Sent Events, polling strategies, live updates, presence indicators, and optimistic UI patterns.",
  category: "frontend",
  subcategory: "nfr",
  slug: "realtime-ui-handling",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-11",
  tags: [
    "frontend",
    "nfr",
    "realtime",
    "websockets",
    "sse",
    "live-updates",
    "presence",
  ],
  relatedTopics: ["network-efficiency", "offline-support", "multi-tab-sync"],
};

export default function RealTimeUIHandlingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Real-Time UI Handling</strong> encompasses the patterns,
          protocols, and architectures for displaying live, updating data in web
          applications without requiring user refresh. This includes chat and
          messaging (instant message delivery, typing indicators), notifications
          (push notifications, in-app alerts), collaborative editing (Google
          Docs, Figma, Miro), live feeds (social media feeds, news tickers),
          presence indicators (online status, &quot;user is typing&quot;), live
          data (stock prices, sports scores, auctions), and IoT dashboards
          (sensor data, monitoring). For staff engineers, real-time UI involves
          trade-offs between data freshness, performance, battery life, and
          infrastructure complexity — selecting the right protocol, managing
          connection lifecycle, handling reconnection gracefully, and optimizing
          UI updates to prevent jank.
        </p>
        <p>
          The protocol selection decision is foundational. Push-based protocols
          (WebSockets, Server-Sent Events) maintain a persistent connection from
          server to client, enabling the server to push updates immediately when
          they occur — efficient for frequent updates with low latency.
          Poll-based protocols (long polling, short polling) have the client
          periodically request updates — simpler to implement but wasteful for
          infrequent updates and higher latency. The right choice depends on
          update frequency (how often does data change), latency requirements
          (how quickly must updates appear), and infrastructure constraints
          (WebSocket support, server capacity, CDN compatibility).
        </p>
        <p>
          Real-time UI architecture extends beyond the transport protocol to
          encompass connection management (establishing, maintaining, and
          reconnecting), message protocol (defining message types, metadata,
          sequencing), state management integration (dispatching real-time
          updates to the application store), UI update patterns (live feeds,
          presence indicators, optimistic updates), and performance optimization
          (message throttling, batching, virtualization for long lists). Each
          layer must handle errors gracefully — connections drop, messages are
          lost, and the UI must remain functional during disruption.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          WebSockets provide full-duplex, bidirectional communication over a
          single persistent TCP connection. After an HTTP handshake upgrades the
          connection to WebSocket protocol, both client and server can send
          messages independently with very low latency (no request overhead per
          message). Browser support is 98%+. WebSockets are ideal for
          applications requiring bidirectional communication with frequent
          updates — chat, collaborative editing, multiplayer games, live
          trading platforms. Libraries like Socket.IO add automatic
          reconnection, message acknowledgment, and fallback to long polling
          when WebSockets are unavailable.
        </p>
        <p>
          Server-Sent Events (SSE) provide server-to-client communication over
          a persistent HTTP connection. The client opens a connection and the
          server pushes events as they occur. SSE is unidirectional — the client
          cannot send data on the same connection (it uses regular HTTP requests
          for client-to-server communication). Browser support is 95%+ (not
          Internet Explorer, and limited on older mobile browsers). SSE is ideal
          for applications where the server pushes updates but the client does
          not need to send frequent messages — live notifications, stock price
          feeds, news tickers, build status monitors. SSE has built-in
          reconnection and event ID support that WebSockets lack.
        </p>
        <p>
          Polling strategies provide a simpler alternative when persistent
          connections are not feasible. Short polling sends periodic HTTP
          requests at fixed intervals (every 5-30 seconds) to check for updates
          — simple to implement but wasteful (many empty responses) and high
          latency (up to the poll interval). Long polling holds an HTTP request
          open until data is available or a timeout occurs — more efficient than
          short polling but still incurs request overhead for each update.
          Polling is appropriate for infrequent updates where simplicity matters
          more than efficiency, or as a fallback when WebSocket/SSE connections
          fail.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/realtime-protocols-comparison.svg"
          alt="Real-Time Protocols Comparison"
          caption="Real-time communication protocols — WebSockets (bidirectional, low latency), SSE (server-push only), long polling (held-open requests), and short polling (periodic requests) with latency and efficiency comparison"
        />
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The WebSocket connection management architecture handles the full
          connection lifecycle. On application load or when real-time features
          are needed, the client establishes a WebSocket connection to the
          server. The connection is monitored for open, close, and error events.
          When the connection closes (intentionally or due to network issues),
          a reconnection strategy with exponential backoff initiates — retry at
          1 second, 2 seconds, 4 seconds, 8 seconds, up to a maximum of 30
          seconds, with jitter (randomness) to prevent thundering herd when
          many clients reconnect simultaneously. While disconnected, outgoing
          messages are queued locally and flushed when the connection is
          reestablished. After N failed reconnection attempts, the connection is
          marked as failed and the user is notified with a manual reconnect
          option.
        </p>
        <p>
          The message protocol defines the structure of WebSocket
          communication. Each message includes a type identifier (CHAT,
          NOTIFICATION, PRESENCE, TYPING), metadata (timestamp, sender ID,
          sequence number), and a JSON payload with the message content. The
          sequence number enables message ordering when messages arrive
          out of order due to network conditions. Important messages (chat
          messages, notifications) are acknowledged by the receiver — the server
          sends an acknowledgment when the message is received and stored, and
          the client resends unacknowledged messages after a timeout. Duplicate
          messages are detected by sequence number and discarded.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/websocket-architecture.svg"
          alt="WebSocket Architecture"
          caption="WebSocket architecture — connection establishment, message flow with type and sequencing, reconnection with exponential backoff, message queueing during disconnection, and state management integration"
        />

        <p>
          Real-time UI patterns handle how updates are displayed to users. Live
          feeds prepend new items (chat messages, notifications) with an
          auto-scroll-to-bottom behavior (with opt-out for users reading older
          messages). Presence indicators show online/offline status, typing
          indicators (debounced at 100-200ms to prevent flicker), and &quot;last
          seen&quot; timestamps. Optimistic updates show user actions immediately
          (sending a message shows it in the chat before server confirmation)
          with a pending state indicator (spinner or grayed-out appearance) and
          rollback on error. Connection status indicators show &quot;Connected,&quot;
          &quot;Reconnecting...,&quot; or &quot;You&apos;re offline&quot; to
          keep users informed of the real-time connection state.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/realtime-ui-patterns.svg"
          alt="Real-Time UI Patterns"
          caption="Real-time UI patterns — live feed with auto-scroll, presence indicators (online/typing/last seen), optimistic updates with pending state, and connection status display"
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Protocol selection involves balancing latency, bidirectionality, and
          infrastructure complexity. WebSockets provide the lowest latency and
          bidirectional communication but require dedicated server infrastructure
          (WebSocket servers, sticky sessions for load balancing, Redis Pub/Sub
          for multi-server setups) and consume more server resources per
          connection (each connection is a persistent TCP socket). SSE provides
          server-push with lower infrastructure complexity (works over standard
          HTTP, no sticky sessions needed) but is unidirectional — client
          messages require separate HTTP requests. Short polling is simplest to
          implement (just periodic HTTP requests) but is wasteful and high
          latency. The decision matrix: bidirectional + frequent = WebSockets;
          server-push only = SSE; infrequent updates = short polling; WebSocket
          unavailable = long polling fallback.
        </p>
        <p>
          Connection management trade-offs affect battery life and server
          capacity. Persistent WebSocket connections keep the device&apos;s
          network radio active, draining battery on mobile devices. For
          applications with infrequent updates (notifications that arrive a few
          times per hour), the battery cost of a persistent connection may
          exceed the benefit of instant delivery — push notifications (which
          wake the device only when a message arrives) are more battery-efficient.
          For high-frequency updates (chat, collaborative editing), the
          persistent connection cost is justified because updates are continuous
          anyway. Disconnecting the WebSocket when the app is backgrounded and
          reconnecting on foreground is a compromise that saves battery but
          introduces a reconnection delay when the user returns.
        </p>
        <p>
          Real-time update frequency versus UI performance is a critical
          trade-off. Rapid updates (stock prices changing every 100ms, typing
          indicators firing on every keystroke) can cause UI jank if every
          update triggers a re-render. Throttling updates (batch rapid changes
          into a single UI update at 16ms intervals using
          requestAnimationFrame) maintains smooth 60fps rendering. For data
          that changes extremely rapidly (stock prices, sensor data), send
          deltas (only changed values) rather than full state, and use binary
          protocols (MessagePack, Protocol Buffers) instead of JSON for
          high-volume scenarios. Virtualize long lists of real-time items to
          maintain scroll performance regardless of message volume.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implement robust reconnection with exponential backoff and jitter.
          When the WebSocket closes, wait 1 second before reconnecting, then 2
          seconds, 4 seconds, 8 seconds, up to a maximum of 30 seconds. Add
          jitter (random 0-500ms) to each delay to prevent thundering herd when
          many clients reconnect simultaneously (common after a server restart
          or network outage). Reset the backoff counter on successful
          connection. After 5-10 failed attempts, stop automatic reconnection
          and show the user a manual reconnect button. Queue outgoing messages
          during disconnection and flush them when the connection is
          reestablished.
        </p>
        <p>
          Integrate real-time updates with the application&apos;s state
          management system. When a WebSocket message arrives, dispatch it to
          the global store (Redux, Zustand) through an action that updates the
          relevant state slice. Components that subscribe to that state slice
          re-render reactively. Clean up the WebSocket subscription on component
          unmount to prevent memory leaks. For server state management, use
          React Query&apos;s invalidateQueries to trigger refetch when a
          real-time update indicates that cached data is stale — this combines
          the immediacy of real-time push with the reliability of server-state
          caching and deduplication.
        </p>
        <p>
          Throttle rapid updates to maintain UI performance. For typing
          indicators, debounce at 100-200ms — send one &quot;typing&quot; event
          per 200ms of continuous typing, not on every keystroke. For stock
          prices or sensor data, batch updates and render at most once per
          animation frame (using requestAnimationFrame) to maintain 60fps. For
          chat messages arriving in rapid bursts (group chat with multiple
          participants), batch messages arriving within 500ms into a single UI
          update to prevent flickering. Use virtualization for long message
          lists to maintain scroll performance regardless of message count.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Failing to handle WebSocket reconnection gracefully is the most common
          real-time UI bug. When the connection drops (network change, server
          restart, idle timeout), the application silently stops receiving
          updates without notifying the user. Messages sent during disconnection
          are lost. The fix is to monitor the connection state, display a
          &quot;Reconnecting...&quot; indicator, queue outgoing messages, and
          automatically reconnect with exponential backoff. After exhausting
          retries, show an error with a manual reconnect option. Test
          reconnection by simulating network disconnect in DevTools.
        </p>
        <p>
          Not handling message ordering and duplicates causes data inconsistency.
          When messages arrive out of order (due to network routing differences),
          displaying them in arrival order rather than sequence order produces
          confusing conversations (a reply appearing before the original message).
          Buffer incoming messages and reorder by sequence number before
          rendering. Detect duplicates by checking sequence numbers against
          already-received messages and discard duplicates. Use idempotent
          operations where possible so that processing the same message twice
          produces the same result.
        </p>
        <p>
          Scaling WebSockets without proper architecture causes connection storms
          and server overload. Each WebSocket connection consumes server memory
          and a file descriptor. When a server restarts, all its connections drop
          and attempt to reconnect simultaneously — a &quot;thundering herd&quot;
          that can overwhelm the server. Mitigate with jitter in reconnection
          delays, connection limits per server, and horizontal scaling with Redis
          Pub/Sub for cross-server message broadcasting. Consider managed
          services (Pusher, Ably, Supabase Realtime) for production scale, as
          they handle connection management, scaling, and monitoring
          automatically.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          Chat and messaging applications are the most common real-time UI use
          case. Slack, Discord, and WhatsApp Web use WebSockets for instant
          message delivery, typing indicators, presence updates, and read
          receipts. Messages are queued during disconnection and synced on
          reconnection. Typing indicators are debounced to prevent excessive
          events. Message ordering is guaranteed by server-assigned sequence
          numbers. Offline messages are delivered when the user reconnects. The
          connection is maintained while the app is active and disconnected when
          backgrounded to save battery, with push notifications for new messages
          while disconnected.
        </p>
        <p>
          Collaborative editing (Google Docs, Figma, Notion) requires the most
          sophisticated real-time architecture. Every edit (character insertion,
          deletion, cursor movement) is captured as an operation, sent to the
          server via WebSocket, transformed against concurrent operations from
          other users, and broadcast to all connected clients. The Operational
          Transformation or CRDT algorithm ensures that all clients converge to
          the same document state regardless of operation order. Presence
          information (cursor positions, selection ranges, user avatars) is
          broadcast at a lower frequency (debounced) to reduce network load. The
          result is sub-second collaborative editing that feels like working on
          a shared local document.
        </p>
        <p>
          Financial trading platforms use real-time UI for live market data.
          Stock prices, order book depth, and trade execution updates arrive
          via WebSockets at high frequency (multiple updates per second per
          instrument). The UI throttles updates to 60fps using
          requestAnimationFrame, sends deltas rather than full state, and uses
          binary protocols (MessagePack) for bandwidth efficiency. Price changes
          are color-coded (green for up, red for down) with flash animations to
          draw attention. The connection is maintained continuously during
          trading hours with automatic reconnection on disruption, and
          historical data is backfilled on reconnect to fill any gaps.
        </p>
      </section>

      <section>
        <h2>Advanced Real-Time Architecture</h2>
        <p>
          WebSocket scaling architecture at production scale requires careful attention to connection management, message distribution, and horizontal scaling. Each WebSocket connection consumes server resources — approximately 4-8KB of memory per connection for the socket buffer, plus application-level state (user session, subscription data, message queues). A server with 16GB of RAM can theoretically hold 2-4 million connections, but in practice the limit is much lower due to file descriptor constraints, CPU overhead for message processing, and network bandwidth for message delivery. Sticky sessions are required when running multiple WebSocket servers behind a load balancer — each client&apos;s connection must be routed to the same server for the duration of the session, because WebSocket connections are stateful and the server maintains per-connection state. The load balancer uses the connection&apos;s source IP or a session cookie to route to the correct backend server. For message broadcasting across multiple servers (when user A on server 1 sends a message to user B on server 2), Redis Pub/Sub provides the cross-server message distribution layer — server 1 publishes the message to a Redis channel, and all servers subscribed to that channel receive the message and deliver it to their connected clients. The Redis Pub/Sub approach works well for moderate scale (tens of thousands of connections) but becomes a bottleneck at higher scale because every message is published to every subscriber regardless of whether they have interested clients. For larger scale, a sharded pub/sub architecture partitions users across multiple Redis instances based on user ID or geographic region, so each server only subscribes to the Redis instances that serve its connected users. Managed services like Pusher, Ably, and Supabase Realtime abstract away this complexity by handling connection management, scaling, and monitoring automatically — they are the recommended choice for production applications where real-time infrastructure is not the core competency.
        </p>
        <p>
          Message ordering and deduplication are critical for maintaining data consistency in real-time systems where network conditions can cause messages to arrive out of order or be duplicated. Message ordering is ensured by assigning a monotonically increasing sequence number to each message at the server — the server maintains a per-channel or per-conversation sequence counter that increments with each message, and includes the sequence number in the message payload. The client buffers incoming messages and reorders them by sequence number before rendering, handling the case where message 105 arrives before message 104 due to network routing differences. For globally distributed systems where servers in different regions may assign sequence numbers independently, hybrid logical clocks combine a wall-clock timestamp with a logical counter to produce globally unique, roughly ordered identifiers. Deduplication detects and discards duplicate messages that arise from retransmissions (when the server does not receive an acknowledgment within the timeout and resends the message) or from the client reconnecting and receiving messages it has already processed. The client maintains a set of recently processed sequence numbers (typically the last 1000-5000 entries, using a bounded data structure like a ring buffer to limit memory usage) and checks each incoming message against this set before processing. If the sequence number is already in the set, the message is discarded as a duplicate. For idempotent operations (setting a value, not incrementing a counter), processing the same message twice produces the same result, so deduplication is a performance optimization rather than a correctness requirement. For non-idempotent operations (incrementing a counter, appending to a list), deduplication is essential to prevent data corruption.
        </p>
        <p>
          Offline message queue architecture ensures that user actions performed while disconnected are eventually synchronized when connectivity returns. When the WebSocket connection is lost (network interruption, server restart, browser backgrounding), outgoing messages (chat messages, form submissions, state updates) are queued in a local persistent store (IndexedDB for durability across page reloads, or in-memory for transient data). Each queued message includes the action type, payload, a unique client-generated message ID, and a timestamp. When the connection is reestablished, the client sends a sync request to the server, including the last sequence number it received, and the server responds with any messages the client missed during disconnection. After the client has caught up on incoming messages, it flushes the outgoing queue, sending each queued message to the server in timestamp order. The server processes each message and responds with an acknowledgment containing the server-assigned sequence number. If a message in the queue is no longer valid (the user deleted the draft, the session expired, the target resource was removed), the server responds with an error and the client removes the message from the queue without retrying. The offline queue must handle conflict resolution — if the user modified the same data on two devices while one was offline, the server applies the offline changes with the appropriate conflict resolution strategy (last-write-wins, field-level merge, or CRDT-based merge) and notifies the client of any changes that were overwritten.
        </p>
        <p>
          Presence system architecture tracks and broadcasts user online/offline status, typing indicators, and activity state across connected clients. The fundamental design uses heartbeat messages — each connected client sends a periodic heartbeat (every 15-30 seconds) to the server indicating that it is still active. The server maintains a presence table mapping user IDs to their last heartbeat timestamp and connection status. When a client&apos;s heartbeat stops (the connection is closed without a clean disconnect, or the heartbeat timeout expires — typically 45-60 seconds without a heartbeat), the server marks the user as offline and broadcasts the status change to all other clients subscribed to that user&apos;s presence. For typing indicators, the client sends a typing event when the user begins typing in an input field, and the server broadcasts it to other users viewing the same conversation. Typing events are debounced at 100-200ms to prevent excessive event volume — one typing event per 200ms of continuous typing, not on every keystroke. The typing indicator expires automatically after a timeout (typically 5-10 seconds without a new typing event) so that if the client crashes or disconnects while typing, the indicator disappears on other users&apos; screens. The presence system must handle scale efficiently — broadcasting every user&apos;s presence change to all other users is O(n-squared) and does not scale. The solution is to scope presence to relevant subsets — in a chat application, presence is only broadcast within the same conversation or channel, not globally. In a social network, presence is broadcast only to the user&apos;s friends or followers, not to all users on the platform.
        </p>
        <p>
          Rate limiting for real-time events prevents abuse and ensures fair resource usage across users. Without rate limiting, a single user could flood the WebSocket server with messages (intentionally through a bot, or unintentionally through a bug), consuming server resources and degrading the experience for other users. Rate limiting is implemented at multiple levels: per-connection rate limiting restricts the number of messages a single WebSocket connection can send per second (typically 10-50 messages per second for chat, lower for presence events); per-user rate limiting aggregates across all of a user&apos;s connections (if the user has multiple tabs or devices); and per-channel rate limiting restricts the total message volume in a specific channel or conversation to prevent any single conversation from consuming disproportionate server resources. Rate limiting is typically implemented using a token bucket algorithm — each connection starts with a full bucket of tokens (e.g., 50 tokens), each message consumes one token, and tokens are replenished at a fixed rate (e.g., 10 tokens per second). When the bucket is empty, messages are rejected until tokens are replenished. The server responds with a rate limit error (HTTP 429 equivalent for WebSocket), and the client implements exponential backoff before retrying. For production systems, rate limiting data is shared across servers using Redis so that a user connecting to server 1 and server 2 shares the same rate limit bucket. Rate limit violations are logged for abuse detection — users who consistently hit rate limits may be automated bots or malicious actors requiring intervention.
        </p>
        <p>
          Mobile battery optimization for persistent WebSocket connections addresses the significant impact that always-on network connections have on mobile device battery life. The device&apos;s cellular or WiFi radio consumes power whenever it is active, and keeping a WebSocket connection alive requires periodic network activity (heartbeats, TCP keep-alive packets) that prevents the radio from entering low-power sleep states. On mobile devices, the radio remains active for 10-30 seconds after the last network activity (the radio tail timer), meaning that a heartbeat sent every 15 seconds keeps the radio active continuously, draining the battery at 2-3x the idle rate. The optimization strategy is to align heartbeat intervals with the radio tail timer — if the tail timer is 20 seconds, send heartbeats every 25 seconds so that the radio is already active for the heartbeat and the tail timer expires before the next heartbeat. A more aggressive approach disconnects the WebSocket entirely when the app is backgrounded and reconnects when the app returns to the foreground, using push notifications (APNs on iOS, FCM on Android) to deliver real-time updates while the WebSocket is disconnected. Push notifications wake the device only when a message arrives, rather than keeping the radio active continuously, reducing battery consumption by 60-80% for applications with infrequent updates. The trade-off is a reconnection delay when the user returns to the app (the WebSocket must be reestablished and the client must catch up on missed messages) and the reliance on push notification infrastructure (which has its own reliability challenges, particularly on Android where FCM delivery is not guaranteed in all regions).
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: When would you use WebSockets versus SSE versus polling?
            </p>
            <p className="mt-2 text-sm">
              A: WebSockets for bidirectional, frequent updates — chat,
              collaborative editing, live trading. SSE for server-push only —
              notifications, live feeds, build status — simpler than WebSockets,
              works over standard HTTP. Long polling as a WebSocket fallback
              when WebSocket connections are blocked by firewalls. Short polling
              for infrequent updates (every 30+ seconds) where simplicity
              matters more than efficiency. Always consider battery impact
              (persistent connections drain mobile batteries), infrastructure
              complexity (WebSockets need dedicated servers), and browser
              support.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle WebSocket reconnection?
            </p>
            <p className="mt-2 text-sm">
              A: Exponential backoff with jitter — retry at 1s, 2s, 4s, 8s, max
              30s, with 0-500ms random jitter to prevent thundering herd. Queue
              outgoing messages while disconnected and flush on reconnection.
              Reset backoff on successful connection. After 5-10 failed
              attempts, stop automatic reconnection and show a manual reconnect
              button. Display connection state in the UI (connected,
              reconnecting, offline). Test reconnection by simulating network
              disconnect in DevTools.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you optimize real-time UI performance?
            </p>
            <p className="mt-2 text-sm">
              A: Throttle rapid updates — use requestAnimationFrame for UI
              updates (max 60fps). Batch messages arriving in rapid bursts.
              Debounce typing indicators at 100-200ms. Virtualize long lists
              to maintain scroll performance. Send deltas (only changed values)
              instead of full state for high-frequency data. Use binary
              protocols (MessagePack) for high-volume scenarios. Disconnect
              WebSocket when the app is backgrounded to save battery. Limit
              message history in memory — prune old messages and paginate
              historical data.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle message ordering and duplicates?
            </p>
            <p className="mt-2 text-sm">
              A: Include sequence numbers or timestamps in every message. Buffer
              incoming messages and reorder by sequence number before rendering
              to handle out-of-order delivery. Detect duplicates by checking
              sequence numbers against already-received messages and discard
              them. Acknowledge important messages server-side and retry
              unacknowledged messages after a timeout. Use idempotent operations
              where possible so processing the same message twice produces the
              same result.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are the challenges of scaling WebSockets?
            </p>
            <p className="mt-2 text-sm">
              A: WebSockets are stateful — each connection consumes server
              memory and a file descriptor. You need sticky sessions or shared
              state across servers. Use Redis Pub/Sub for multi-server message
              broadcasting. Monitor connection count and set per-server limits
              to prevent overload. Handle server restarts — all connections drop
              simultaneously, causing a reconnection thundering herd. Mitigate
              with jitter in reconnection delays. Consider managed services
              (Pusher, Ably, Supabase Realtime) for production scale — they
              handle connection management, scaling, and monitoring
              automatically.
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
              MDN — WebSockets API
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — Server-Sent Events
            </a>
          </li>
          <li>
            <a
              href="https://socket.io/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Socket.IO — WebSocket Library with Fallbacks
            </a>
          </li>
          <li>
            <a
              href="https://pusher.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pusher — Managed Real-Time Infrastructure
            </a>
          </li>
          <li>
            <a
              href="https://ably.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ably — Real-Time Infrastructure Platform
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
