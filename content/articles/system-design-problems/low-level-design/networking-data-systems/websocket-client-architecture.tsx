"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-websocket-client-architecture",
  title: "WebSocket Client Architecture",
  description:
    "Production-grade WebSocket client design covering connection lifecycle, exponential backoff reconnection, message protocol and queuing, request-response correlation, React integration, auth token handling, and SSE fallback strategy.",
  category: "low-level-design",
  subcategory: "networking-data-systems",
  slug: "websocket-client-architecture",
  wordCount: 5300,
  readingTime: 32,
  lastUpdated: "2026-05-16",
  tags: ["websocket", "real-time", "reconnection", "react", "sse", "lld"],
};

export default function WebSocketClientArchitectureArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <p>
        WebSocket is the standard protocol for persistent bidirectional communication between a browser and a server.
        Setting up the initial connection is straightforward. Building a production-grade WebSocket client — one that
        handles reconnection gracefully, queues messages during connection loss, integrates cleanly with React, manages
        authentication token refresh, and falls back to SSE when WebSocket is blocked — is where staff-level
        engineering shows.
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/networking-data-systems/websocket-client-architecture.svg"
        alt="WebSocket client architecture diagram"
        caption="Connection management, message queuing, React integration, auth, and transport fallback"
      />

      <h2>Connection Lifecycle</h2>
      <p>
        The WebSocket API exposes four ready states as numeric constants: CONNECTING (0), OPEN (1), CLOSING (2),
        and CLOSED (3). A production client must handle all state transitions explicitly, not just the happy path.
      </p>

      <h3>Singleton Connection</h3>
      <p>
        A common mistake: creating a new WebSocket connection per component. If 20 components subscribe to real-time
        updates, 20 separate connections are opened, multiplying the load on the server. The correct approach is a
        singleton WebSocket manager — one connection per application (or per logical channel), shared across all
        components via a context or global instance.
      </p>
      <p>
        The WebSocket manager is instantiated once when the application loads. Components subscribe to message types
        via a pub/sub API exposed by the manager. When a component unmounts, it unsubscribes. The connection stays
        open as long as the application is running.
      </p>

      <h3>Exponential Backoff Reconnection</h3>
      <p>
        WebSocket connections drop for many reasons: network interruption, server restart, load balancer timeout,
        mobile device sleep. The client must reconnect automatically, but not instantly in a tight loop — rapid
        reconnection storms can amplify server overload during a degraded event.
      </p>
      <p>
        Exponential backoff with jitter: start with a 1-second delay, double on each subsequent failure, cap at 30
        seconds, add a random jitter of ±20% to prevent reconnection storms when many clients reconnect simultaneously
        after a server restart.
      </p>
      <p>
        Implementation:
      </p>
      <ul>
        <li>Track the retry count. On close, schedule the next reconnect attempt.</li>
        <li>Delay = min(baseDelay × 2^retryCount, maxDelay) × (1 + jitter).</li>
        <li>Reset the retry count to 0 on a successful connection that stays open for more than 30 seconds —
        this avoids penalizing a connection that was previously stable.</li>
        <li>After a maximum retry count (e.g., 10), stop auto-reconnecting and show a "connection lost" banner
        with a manual reconnect button.</li>
      </ul>

      <h3>Heartbeat / Ping-Pong</h3>
      <p>
        TCP connections can drop silently — the OS considers the connection open but packets are no longer reaching
        the server (e.g., NAT gateway timeout, idle firewall rule). A heartbeat mechanism detects this:
      </p>
      <ol>
        <li>The client sends a ping message every 25 seconds (or uses the WebSocket protocol-level ping frame).</li>
        <li>The server responds with a pong within 5 seconds.</li>
        <li>If the pong does not arrive within 5 seconds, the client calls <code>ws.close()</code> and initiates
        reconnection.</li>
      </ol>
      <p>
        Use <code>setInterval</code> for the ping timer, clearing it on close and resetting it on reconnect.
        Store the pong timeout ID — if the pong arrives, clear the timeout. If the timeout fires before the pong,
        force-close the connection.
      </p>

      <h3>Visibility API Integration</h3>
      <p>
        When a mobile user switches to another app, the browser may reduce the page's resource budget. The WebSocket
        connection often drops. More importantly, there's no reason to send heartbeats to a backgrounded page.
        Subscribe to <code>document.addEventListener('visibilitychange', ...)</code>:
      </p>
      <ul>
        <li>On <code>hidden</code>: pause heartbeat timer. The connection may drop — accept it.</li>
        <li>On <code>visible</code>: check if the connection is still open (<code>ws.readyState === 1</code>).
        If not, reconnect immediately (skip the backoff delay for visibility restoration).</li>
      </ul>
      <p>
        Similarly, listen to <code>window.addEventListener('online', ...)</code> — when network connectivity is
        restored, attempt an immediate reconnect rather than waiting for the next scheduled backoff timeout.
      </p>

      <HighlightBlock as="p" tier="crucial">
        A WebSocket client without heartbeats and visibility handling will appear connected to the application but be
        silently disconnected. Users miss real-time updates without any indication. Always implement both.
      </HighlightBlock>

      <h2>Message Protocol Design</h2>

      <h3>Message Envelope</h3>
      <p>
        Every message should have a consistent envelope structure that the WebSocket manager uses for routing:
      </p>
      <ul>
        <li><strong>type:</strong> A string discriminator for routing to the correct handler (e.g., "chat.message",
        "presence.update", "order.status_changed").</li>
        <li><strong>id:</strong> A UUID generated by the sender. Used to correlate responses to requests and for
        deduplication.</li>
        <li><strong>payload:</strong> The message-specific data. Typed via TypeScript discriminated union on type.</li>
        <li><strong>timestamp:</strong> ISO 8601 timestamp from the sender. Not relied upon for ordering (clocks
        drift) — use sequence numbers for ordering guarantees.</li>
      </ul>
      <p>
        Define the full message type union in TypeScript. The WebSocket manager's <code>onmessage</code> handler
        deserializes the JSON and narrows the type based on the <code>type</code> field before dispatching to
        subscribers.
      </p>

      <h3>Outbound Message Queue</h3>
      <p>
        Calling <code>ws.send()</code> when the socket is in CONNECTING state throws an error. If it's CLOSED,
        the message is silently dropped. The solution: an outbound queue that holds messages when the connection
        is not open and flushes them in order when the connection reaches OPEN:
      </p>
      <ul>
        <li>On <code>send(message)</code>: if readyState is OPEN, send immediately. Otherwise, push to the queue.</li>
        <li>On connection open: flush the queue in order, sending each queued message.</li>
        <li>Queue overflow protection: cap the queue at a maximum size (e.g., 100 messages). If exceeded, drop the
        oldest messages or reject new sends with an error — unbounded queues cause memory issues during extended
        disconnections.</li>
      </ul>

      <h3>Request-Response Correlation</h3>
      <p>
        WebSocket is fundamentally a message stream — it has no native request-response semantics. For operations
        that need a response (e.g., send a chat message and know when it was acknowledged by the server), implement
        correlation via message IDs:
      </p>
      <ol>
        <li>Generate a UUID for the request message.</li>
        <li>Store a <code>Promise</code> resolve/reject pair in a <code>Map</code> keyed by the message ID.</li>
        <li>Send the message.</li>
        <li>When the server sends back a response with the same ID, look it up in the map and resolve the promise.</li>
        <li>Set a timeout (e.g., 5 seconds). If the timeout fires before the response arrives, reject the promise
        and delete the pending entry from the map.</li>
      </ol>
      <p>
        This pattern gives WebSocket a request-response API without HTTP. Components <code>await</code> the send
        and handle success/failure as they would a fetch call.
      </p>

      <h3>Message Deduplication</h3>
      <p>
        On reconnection, the server may replay recently sent messages to recover from potential message loss during
        the disconnection. The client must deduplicate these replayed messages to avoid processing them twice (e.g.,
        rendering a chat message twice, decrementing a counter twice).
      </p>
      <p>
        Track received message IDs in a fixed-size Set (e.g., last 1000 IDs). Before processing a message, check
        if its ID is already in the set — if so, discard it. The set operates as a sliding window: when it exceeds
        the max size, remove the oldest entries. This is a bounded memory structure regardless of message volume.
      </p>

      <h2>React Integration</h2>

      <h3>WebSocket Context Provider</h3>
      <p>
        The WebSocket manager is a singleton. Expose it to the React component tree via a context provider:
      </p>
      <ul>
        <li>The provider initializes the WebSocket manager on mount with the connection URL and auth token.</li>
        <li>It exposes the manager's <code>subscribe</code>, <code>send</code>, and <code>status</code> via context.</li>
        <li>On unmount (page unload), it closes the connection gracefully.</li>
      </ul>

      <h3>useWebSocket Hook</h3>
      <p>
        Components use a <code>useWebSocket</code> hook that subscribes to specific message types and returns
        relevant state:
      </p>
      <p>
        The hook subscribes to the given message type on mount and unsubscribes on unmount. The subscription
        callback calls <code>setState</code> to update the component when a matching message arrives. The hook
        also exposes a <code>send</code> function and the current connection status so the component can show
        an offline indicator.
      </p>

      <h3>Preventing Re-render Cascades</h3>
      <p>
        A common mistake: storing each incoming message in a top-level context state, causing every component that
        consumes the context to re-render on every message. This is particularly problematic in high-frequency
        scenarios (e.g., 100 messages/second in a trading dashboard).
      </p>
      <p>
        Solution: don't store messages in context. The context provides only the manager instance and connection
        status (which changes infrequently). Each component subscribes directly to its specific message type via the
        manager's pub/sub API and maintains its own local state. Only that component re-renders when a matching
        message arrives.
      </p>

      <HighlightBlock as="p" tier="important">
        WebSocket message processing that updates React state is an event-driven pattern — not a top-down data flow
        pattern. Structure subscriptions at the component level, not at the context level, to avoid unnecessary
        re-renders across the component tree.
      </HighlightBlock>

      <h2>Authentication and Security</h2>

      <h3>Token Passing</h3>
      <p>
        The WebSocket handshake is an HTTP Upgrade request. Browser WebSocket API does not support custom headers
        on the initial handshake — so the standard Authorization header cannot be set. Two approaches:
      </p>
      <ul>
        <li>
          <strong>Query parameter:</strong> Pass the token in the connection URL:
          <code>wss://api.example.com/ws?token=ACCESS_TOKEN</code>. The server validates the token during the
          handshake. Simple but the token appears in server access logs and browser history — mitigate by using
          short-lived tokens (30–60 seconds) generated specifically for WebSocket connections.
        </li>
        <li>
          <strong>First message auth:</strong> Connect without auth, then send a special <code>authenticate</code>
          message as the first message after connection. The server holds the connection in an
          "unauthenticated" state, processes only auth messages, and upgrades to authenticated after validation.
          Slightly more complex but avoids token in URL.
        </li>
      </ul>

      <h3>Token Refresh on Reconnection</h3>
      <p>
        Access tokens expire. If the WebSocket client reconnects with an expired token, the server closes the
        connection with a specific close code (e.g., 4401 — application-level "unauthorized"). The client must:
      </p>
      <ol>
        <li>Detect close code 4401 in the <code>onclose</code> handler.</li>
        <li>Call the token refresh endpoint to get a new access token.</li>
        <li>Reconnect with the new token (skip the backoff delay for auth refreshes).</li>
        <li>If token refresh fails (refresh token also expired), redirect to the login page.</li>
      </ol>

      <h3>Security Considerations</h3>
      <ul>
        <li>
          <strong>Always use wss:// in production:</strong> Plaintext <code>ws://</code> is never acceptable outside
          of localhost development. All WebSocket traffic must be TLS-encrypted.
        </li>
        <li>
          <strong>Cross-Site WebSocket Hijacking (CSWSH):</strong> An attacker's page can open a WebSocket to your
          server and it will include the user's cookies. Server must validate the <code>Origin</code> header during
          the handshake — reject connections from unexpected origins.
        </li>
        <li>
          <strong>Client-side rate limiting:</strong> Prevent a malfunctioning component from flooding the server
          by debouncing sends or rate-limiting at the manager level (max N messages per second per connection).
        </li>
      </ul>

      <h2>Fallback Strategies</h2>

      <h3>When WebSocket Is Blocked</h3>
      <p>
        Corporate firewalls, older proxies, and some network configurations block WebSocket connections or
        silently corrupt the upgrade handshake. Detection: if the WebSocket connection fails to open within 5
        seconds, assume it's blocked. Fall back to an alternative transport.
      </p>

      <h3>Server-Sent Events (SSE) Fallback</h3>
      <p>
        SSE is a standard HTTP streaming protocol that works through proxies (it's just long-lived HTTP). The server
        pushes messages to the client over a persistent HTTP connection. SSE is one-directional (server to client
        only) — for the client-to-server direction, use standard HTTP POST requests.
      </p>
      <p>
        SSE is ideal as a WebSocket fallback for applications that are predominantly read-heavy: real-time feeds,
        live dashboards, notification delivery. It does not require any protocol upgrade and is natively handled by
        the browser's <code>EventSource</code> API with built-in reconnection.
      </p>

      <h3>Long-Polling as Last Resort</h3>
      <p>
        If both WebSocket and SSE are blocked, long-polling is the final fallback. The client sends an HTTP request
        and the server holds it open until a message is available or a timeout occurs. When the response arrives,
        the client immediately sends another request. This adds one RTT per message (typically 100–300 ms of
        additional latency) and significantly higher server connection count. Use only when necessary.
      </p>

      <h3>Transport Abstraction Layer</h3>
      <p>
        Abstract the transport so application code is unaware of which protocol is in use. Define a
        <code>Transport</code> interface with <code>connect()</code>, <code>send(message)</code>,
        <code>subscribe(handler)</code>, and <code>disconnect()</code>. Implement three concrete transports:
        <code>WebSocketTransport</code>, <code>SSETransport</code>, <code>LongPollingTransport</code>. The manager
        selects the best available transport based on connectivity detection and exposes a single unified API to
        the application.
      </p>

      <h2>Interview Q&A</h2>

      <h3>Q: Why use WebSocket instead of polling for real-time updates? When would you prefer polling?</h3>
      <p>
        WebSocket advantages over polling:
      </p>
      <ul>
        <li>
          <strong>Latency:</strong> WebSocket delivers messages in under 50 ms. Polling at 5-second intervals delivers
          messages with 0–5 seconds of latency (average 2.5 s).
        </li>
        <li>
          <strong>Bandwidth:</strong> Polling sends an HTTP request (with headers, typically 500–2000 bytes) even when
          there's nothing new. WebSocket sends only actual messages.
        </li>
        <li>
          <strong>Server connections:</strong> With polling at 5s intervals and 100k users, the server handles 20k
          requests/second just for polling. WebSocket maintains 100k persistent connections with near-zero traffic
          when no messages are being sent.
        </li>
      </ul>
      <p>
        Prefer polling when: the update frequency is low (every few minutes), the message volume is very low, the
        infrastructure team has not set up WebSocket support, or the feature is simple and WebSocket's operational
        complexity isn't justified. Short-interval polling (1–5 seconds) with a HTTP/2 connection pool is acceptable
        for many use cases.
      </p>

      <h3>Q: How do you handle message ordering and delivery guarantees over WebSocket?</h3>
      <p>
        WebSocket (over TCP) guarantees in-order delivery within a connection. However, on reconnection, messages
        sent during the disconnection window are potentially lost. Achieving reliable delivery requires an application-layer
        protocol:
      </p>
      <ul>
        <li>
          <strong>Sequence numbers:</strong> The server assigns a monotonically increasing sequence number to every
          message. The client tracks the last received sequence number. On reconnect, the client sends its last
          sequence number; the server replays all messages since that point.
        </li>
        <li>
          <strong>Client-side ACK:</strong> The client acknowledges each received message. The server buffers
          unacknowledged messages and retransmits them on reconnect.
        </li>
        <li>
          <strong>At-least-once delivery:</strong> The server may replay messages on reconnect; the client deduplicates
          using message IDs. This is the standard approach for chat systems.
        </li>
      </ul>
      <p>
        For most frontend applications (chat, notifications, live cursors), at-least-once delivery with client-side
        deduplication is sufficient and simpler than exactly-once delivery.
      </p>

      <h3>Q: Design the WebSocket architecture for a live collaborative document editor.</h3>
      <p>
        The document editor has multiple users editing simultaneously. Each keystroke or cursor movement must be
        broadcast to all other users with minimal latency.
      </p>
      <p>
        Message types:
      </p>
      <ul>
        <li><code>operation</code>: An OT (Operational Transform) or CRDT operation describing a document change
        — insert character at position, delete range, format text.</li>
        <li><code>cursor</code>: User's current cursor position and selection range — broadcast to other users for
        presence awareness.</li>
        <li><code>awareness</code>: Online/idle status, user name, color — sent on join and periodically.</li>
        <li><code>ack</code>: Server acknowledgment of a received operation with the server-assigned sequence number.</li>
      </ul>
      <p>
        Client architecture:
      </p>
      <ul>
        <li>
          <strong>Operation buffer:</strong> Operations created locally are applied to the document immediately
          (optimistic) and queued for server confirmation. If the server rejects or transforms an operation,
          apply the transformation to the buffered local operations (OT) and re-apply.
        </li>
        <li>
          <strong>Cursor throttling:</strong> Cursor move events fire 60 times per second during active editing.
          Throttle cursor sends to max 10/second — the server and other clients do not need pixel-perfect
          real-time cursor positions.
        </li>
        <li>
          <strong>Reconnection state recovery:</strong> On reconnect, send the last acknowledged sequence number.
          The server replays all operations since that sequence, and the client applies them to bring the local
          state up to date.
        </li>
        <li>
          <strong>Offline editing:</strong> Allow editing while disconnected (CRDT ensures merge-ability). Buffer
          all operations. On reconnect, send the buffered operations to the server for integration.
        </li>
      </ul>

      <h3>Q: How do you test WebSocket-dependent components?</h3>
      <p>
        Three layers of testing:
      </p>
      <ul>
        <li>
          <strong>Unit tests:</strong> Mock the WebSocket manager. The <code>useWebSocket</code> hook reads from
          a context provider — in tests, provide a mock provider that exposes a <code>simulateMessage</code>
          helper. Tests call <code>simulateMessage({'{'} type: 'chat.message', payload: {'{'} text: 'hello' {'}'} {'}'})</code>
          and assert the component renders correctly.
        </li>
        <li>
          <strong>Integration tests:</strong> Use <code>ws</code> (Node.js WebSocket library) to start a real
          WebSocket server in the test process. The client connects to the test server, and the test verifies
          actual message exchange. This tests the real connection lifecycle including reconnection logic.
        </li>
        <li>
          <strong>E2E tests:</strong> Use Playwright with <code>page.on('websocket', ...)</code> to intercept
          WebSocket traffic. Playwright can simulate WebSocket responses and assert that the UI updates correctly.
          Test scenarios: initial connection, message receipt, disconnection, reconnection after server restart.
        </li>
      </ul>
    </ArticleLayout>
  );
}
