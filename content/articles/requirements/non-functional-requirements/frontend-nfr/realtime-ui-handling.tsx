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
