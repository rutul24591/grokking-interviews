"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-websockets-complete",
  title: "WebSockets",
  description:
    "Comprehensive guide to WebSockets: handshake protocol, full-duplex communication, heartbeat and ping-pong, reconnection, scaling across multiple servers, comparison with SSE and HTTP long-polling, and production patterns.",
  category: "backend",
  subcategory: "network-communication",
  slug: "websockets",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-04",
  tags: ["backend", "websockets", "real-time", "full-duplex", "scaling", "pub-sub"],
  relatedTopics: [
    "server-sent-events",
    "long-polling",
    "pub-sub-systems",
    "load-balancers",
  ],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/network-communication";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>WebSockets</h1>
        <p className="lead">
          WebSockets provide a persistent, full-duplex communication channel between a client
          (typically a web browser) and a server over a single TCP connection. Unlike HTTP, which
          is request-response based (the client sends a request, the server responds, and the
          connection closes), a WebSocket connection remains open after establishment, allowing
          either party to send messages at any time. This enables real-time, bidirectional
          communication with minimal overhead, making WebSockets the foundation of real-time web
          applications.
        </p>

        <p>
          Consider a collaborative document editing application (like Google Docs). Multiple users
          edit the same document simultaneously, and each user&apos;s changes must be reflected
          in the other users&apos; views within milliseconds. Without WebSockets, the application
          would need to poll the server every few seconds to check for changes, generating
          unnecessary requests when no changes occur and introducing latency between a change
          being made and it being visible to other users. With WebSockets, each client maintains
          a persistent connection to the server. When a user makes a change, the server
          immediately pushes the change to all other connected clients through their WebSocket
          connections. The latency is the network round-trip time (typically 10-100ms), and there
          is no polling overhead when no changes are occurring.
        </p>

        <p>
          WebSockets operate over a single TCP connection that is upgraded from HTTP using the
          WebSocket handshake protocol. The client sends an HTTP request with an
          <code className="inline-code">Upgrade: websocket</code> header, and the server responds
          with a <code className="inline-code">101 Switching Protocols</code> response, upgrading
          the connection to the WebSocket protocol. Once upgraded, the connection supports
          full-duplex binary message framing, allowing either party to send text or binary
          messages at any time.
        </p>

        <p>
          This article provides a comprehensive examination of WebSockets: the handshake protocol,
          message framing, heartbeat and keep-alive mechanisms, reconnection strategies, scaling
          WebSockets across multiple servers (sticky sessions, pub-sub backbones, connection
          routing), comparison with alternative real-time technologies (SSE, HTTP long-polling),
          and production implementation patterns. We will also cover common pitfalls and
          real-world implementations.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/websocket-connection.svg`}
          caption="Figure 1: WebSocket Handshake Protocol showing the upgrade process. Client sends HTTP GET with Upgrade: websocket, Connection: Upgrade, Sec-WebSocket-Key: base64-encoded-random. Server validates the key, responds with 101 Switching Protocols, Connection: Upgrade, Upgrade: websocket, Sec-WebSocket-Accept: hashed-key. After the 101 response, the HTTP connection is upgraded to WebSocket, and full-duplex binary message framing begins. The handshake uses HTTP for compatibility with existing HTTP infrastructure (proxies, firewalls, load balancers)."
          alt="WebSocket handshake protocol"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: WebSocket Protocol Mechanics</h2>

        <h3>Full-Duplex Communication</h3>
        <p>
          Full-duplex means that both the client and server can send messages simultaneously over
          the same connection. This contrasts with HTTP&apos;s half-duplex model, where the client
          sends a request and waits for the server&apos;s response before sending another request.
          In a WebSocket connection, the server can push messages to the client at any time
          without the client requesting them, and the client can send messages to the server
          without waiting for a response to a previous message.
        </p>

        <p>
          Full-duplex communication is essential for real-time applications where both parties
          need to send messages independently: collaborative editing (multiple users editing
          simultaneously), live chat (bidirectional messaging), real-time gaming (player actions
          and game state updates in both directions), and financial trading (price updates from
          server, trade orders from client).
        </p>

        <h3>Message Framing</h3>
        <p>
          WebSocket messages are framed as binary frames on the underlying TCP connection. Each
          frame has a header that indicates the frame type (text, binary, close, ping, pong),
          whether it is the final frame in a message (supporting message fragmentation), and the
          payload length. Text frames carry UTF-8 encoded text, binary frames carry arbitrary
          binary data, close frames signal connection termination, and ping/pong frames implement
          the heartbeat mechanism.
        </p>

        <p>
          Message framing allows WebSocket messages to be multiplexed over a single TCP connection
          without the overhead of HTTP headers for each message. A WebSocket frame header is
          typically 2-14 bytes (depending on payload length), compared to HTTP headers that are
          hundreds of bytes. This makes WebSockets significantly more efficient than HTTP polling
          for high-frequency, small-message communication.
        </p>

        <h3>Heartbeat and Keep-Alive</h3>
        <p>
          WebSocket connections are long-lived, and long-lived TCP connections are vulnerable to
          silent disconnection: network intermediaries (load balancers, proxies, firewalls) may
          close idle connections without notifying either endpoint. To detect and recover from
          silent disconnections, WebSockets implement a heartbeat mechanism using ping and pong
          frames. The server periodically sends a ping frame to the client, and the client
          responds with a pong frame. If the server does not receive a pong within a configured
          timeout, it considers the connection dead and closes it.
        </p>

        <p>
          The heartbeat interval is a trade-off between detection speed and overhead. A short
          interval (10 seconds) detects disconnections quickly but generates more network traffic.
          A long interval (60 seconds) reduces overhead but allows disconnected connections to
          persist for longer before detection. Production systems typically use a 30-second
          heartbeat interval with a 10-second pong timeout, providing a balance between detection
          speed and overhead.
        </p>

        <h3>Reconnection</h3>
        <p>
          WebSocket connections can be terminated for many reasons: network failures, server
          restarts, load balancer reconfiguration, heartbeat timeouts, and intentional close.
          When a connection is terminated, the client should attempt to reconnect. The reconnection
          strategy should use exponential backoff with jitter to prevent thundering herd scenarios
          when many clients reconnect simultaneously after a server restart.
        </p>

        <p>
          The client should also implement message recovery: messages that were in flight when the
          connection terminated should be retransmitted after reconnection. This is typically
          achieved using message IDs: the client assigns a unique ID to each message and tracks
          which messages have been acknowledged by the server. After reconnection, the client
          retransmits unacknowledged messages.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/websocket-diagram.svg`}
          caption="Figure 2: WebSocket Heartbeat and Reconnection Flow showing the lifecycle. Normal Operation: Server sends ping every 30 seconds, client responds with pong. If pong received within 10 seconds, connection is healthy. Disconnection Detection: Server sends ping, no pong received within 10 seconds → connection considered dead. Server closes connection. Client detects close event. Reconnection: Client waits with exponential backoff + jitter (1s, 2s, 4s + random), attempts reconnection. On successful reconnection, client retransmits unacknowledged messages using message IDs. This ensures no message loss during disconnection."
          alt="WebSocket heartbeat and reconnection flow"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Scaling WebSockets</h2>

        <h3>Single-Server WebSocket Architecture</h3>
        <p>
          In a single-server architecture, all WebSocket connections terminate on a single server
          process. The server maintains an in-memory map of connected clients and can push
          messages to any connected client directly. This is simple to implement and works well
          for small-scale applications (hundreds to low thousands of connections). However, it
          does not scale beyond a single server: if the server crashes, all connections are lost,
          and a single server has a finite connection limit based on available file descriptors
          and memory.
        </p>

        <h3>Multi-Server Architecture with Sticky Sessions</h3>
        <p>
          In a multi-server architecture, WebSocket connections are distributed across multiple
          server instances behind a load balancer. The load balancer uses sticky sessions (also
          known as session affinity) to ensure that all messages from a client are routed to the
          same server instance that holds the client&apos;s WebSocket connection. Without sticky
          sessions, a client&apos;s HTTP upgrade request might go to server A, but a subsequent
          message might be routed to server B, which does not have the client&apos;s connection.
        </p>

        <p>
          Sticky sessions introduce a challenge: if a client needs to send a message to another
          client that is connected to a different server, the message must be routed across
          servers. This requires a pub-sub backbone (Redis Pub/Sub, Kafka, or a message queue)
          that all servers subscribe to. When server A needs to send a message to a client
          connected to server B, it publishes the message to the pub-sub backbone, and server B
          receives it and delivers it to the client through their WebSocket connection.
        </p>

        <h3>Connection Routing with a Gateway</h3>
        <p>
          An alternative to sticky sessions is a WebSocket gateway that maintains a connection
          registry mapping each client ID to the server instance that holds their WebSocket
          connection. The gateway receives all messages from clients and routes them to the
          appropriate server based on the connection registry. This approach eliminates the need
          for sticky sessions at the load balancer level but requires the gateway to maintain
          an up-to-date connection registry, which introduces its own complexity (registry
          consistency, gateway scalability).
        </p>

        <h3>Scaling to Millions of Connections</h3>
        <p>
          Scaling WebSockets to millions of concurrent connections requires careful resource
          management. Each WebSocket connection consumes a file descriptor, memory for the
          connection state, and CPU for message processing. A single server can typically handle
          10,000-100,000 WebSocket connections depending on the message frequency and payload
          size. To scale to millions of connections, hundreds of server instances are needed,
          each handling tens of thousands of connections.
        </p>

        <p>
          At this scale, the pub-sub backbone becomes the bottleneck: every message sent to a
          client on a different server must pass through the pub-sub system, and the throughput
          of the pub-sub system limits the cross-server message delivery rate. Organizations
          that scale WebSockets to millions of connections (Slack, Discord, Twitch) use a
          hierarchical pub-sub topology: regional pub-sub clusters serve connections in their
          region, and a central coordinator routes cross-region messages. This reduces the load
          on any single pub-sub cluster and minimizes cross-region latency for messages between
          clients in the same region.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/websocket-frame-header.svg`}
          caption="Figure 3: WebSocket Scaling Architecture showing multi-server setup with sticky sessions and pub-sub backbone. Clients connect through a load balancer with sticky sessions to one of three WebSocket server instances. Each server maintains in-memory connections for its assigned clients. When Server 1 needs to send a message to a client connected to Server 3, it publishes to a Redis Pub/Sub channel. Server 3 receives the message from Pub/Sub and delivers it to the client via their WebSocket connection. This architecture scales horizontally by adding more server instances and Pub/Sub subscribers."
          alt="WebSocket scaling architecture"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>

        <p>
          WebSockets are one of three primary technologies for real-time server-to-client
          communication, alongside Server-Sent Events (SSE) and HTTP long-polling. The choice
          depends on the communication pattern (unidirectional vs bidirectional), scalability
          requirements, and infrastructure constraints.
        </p>

        <h3>WebSockets vs Server-Sent Events</h3>
        <p>
          WebSockets provide full-duplex (bidirectional) communication, while SSE provides
          unidirectional (server-to-client) streaming. If the application only needs the server
          to push data to the client (live news feeds, stock price updates, notification
          streams), SSE is simpler to implement: it uses standard HTTP, works through proxies
          and firewalls without special configuration, and has built-in reconnection and event
          ID support in the browser. If the application needs bidirectional communication (chat,
          collaborative editing, gaming), WebSockets are required.
        </p>

        <h3>WebSockets vs HTTP Long-Polling</h3>
        <p>
          HTTP long-polling simulates server push by having the client send an HTTP request that
          the server holds open until new data is available. When data is available, the server
          responds, and the client immediately sends another request. Long-polling works through
          any HTTP infrastructure (no special proxy or firewall configuration needed) but has
          higher latency (the request must travel from client to server and back for each message)
          and higher overhead (HTTP headers for each response). WebSockets have lower latency
          and lower overhead (minimal frame headers) but require infrastructure that supports
          WebSocket upgrade (some proxies and firewalls block WebSocket connections).
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for WebSocket Implementation</h2>

        <p>
          <strong>Implement heartbeat and reconnection from day one.</strong> WebSocket
          connections are vulnerable to silent disconnection, and without a heartbeat mechanism,
          the server may hold resources for dead connections indefinitely. Implement ping/pong
          heartbeats with a configurable interval (30 seconds) and timeout (10 seconds). On the
          client side, implement automatic reconnection with exponential backoff and jitter to
          prevent thundering herd scenarios.
        </p>

        <p>
          <strong>Use message IDs for at-least-once delivery.</strong> WebSocket does not provide
          built-in message acknowledgment or delivery guarantees. If messages must not be lost
          during disconnections, implement application-level message IDs: the server assigns a
          unique ID to each message, and the client acknowledges received messages. After
          reconnection, the client requests any messages it missed since its last acknowledged
          message ID. This provides at-least-once delivery semantics on top of WebSocket.
        </p>

        <p>
          <strong>Design the pub-sub backbone for cross-server message delivery.</strong> In a
          multi-server WebSocket architecture, the pub-sub backbone (Redis Pub/Sub, Kafka) is
          the critical component for cross-server message delivery. Choose a pub-sub system with
          sufficient throughput for your message volume, implement topic-based routing (each
          user or room has its own topic), and monitor the pub-sub system&apos;s throughput and
          latency. The pub-sub system is often the bottleneck in scaled WebSocket architectures.
        </p>

        <p>
          <strong>Implement connection limits per client.</strong> A single client should not be
          able to open unlimited WebSocket connections, as this can exhaust server resources.
          Implement a per-user connection limit (typically 3-5 connections per user, to support
          multiple tabs and devices) and reject additional connections with a clear error message.
          Track connections by user ID (authenticated) or by IP address (unauthenticated) to
          enforce the limit.
        </p>

        <p>
          <strong>Graceful shutdown and connection draining.</strong> When a WebSocket server
          instance needs to be restarted or decommissioned, existing connections should be
          gracefully closed rather than abruptly terminated. The server should send a close frame
          to all connected clients with a reason code indicating that the server is shutting down.
          Clients receiving this close frame should reconnect to a different server instance
          immediately (without backoff), minimizing the disconnection window.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>Load balancer dropping WebSocket connections.</strong> Many load balancers are
          configured with idle connection timeouts (typically 60 seconds) that close connections
          that appear idle. WebSocket connections are long-lived and may appear idle during
          periods of low message frequency, causing the load balancer to close them. Fix:
          Configure the load balancer&apos;s idle timeout to be longer than the WebSocket
          heartbeat interval (e.g., 120 seconds if the heartbeat is every 30 seconds).
          Alternatively, configure the load balancer to recognize WebSocket connections
          (via the Upgrade header) and disable the idle timeout for WebSocket connections.
        </p>

        <p>
          <strong>Memory leaks from unbounded message queues.</strong> When a WebSocket client
          is slow to process messages (e.g., a mobile client on a slow network), the server
          queues messages for delivery. If the client is too slow or permanently disconnected
          without the server detecting it, the message queue grows unbounded, consuming memory
          and eventually causing an out-of-memory crash. Fix: Implement a maximum queue size
          per connection. When the queue reaches the maximum, drop the oldest messages (or the
          newest, depending on the application&apos;s requirements) and notify the client that
          messages were dropped. Additionally, implement heartbeat-based disconnection detection
          to clean up queues for dead connections.
        </p>

        <p>
          <strong>Not handling server restarts gracefully.</strong> When a WebSocket server
          restarts, all connections are lost simultaneously. If thousands of clients attempt
          to reconnect at the same time, the new server instance may be overwhelmed by the
          reconnection storm. Fix: Implement staggered reconnection on the client side: each
          client waits a random duration (with exponential backoff) before attempting to
          reconnect. The server should also implement connection rate limiting during startup:
          accept connections at a controlled rate rather than accepting all reconnection
          requests simultaneously.
        </p>

        <p>
          <strong>Broadcasting to all clients without filtering.</strong> When a message needs
          to be sent to a subset of connected clients (e.g., users in a specific chat room),
          naive implementations iterate over all connections and send the message to each one,
          filtering by room membership. This is O(n) for each message, where n is the total
          number of connections, and becomes a performance bottleneck at scale. Fix: Maintain
          room-to-connection mappings (a map from room ID to the set of connection IDs in that
          room). When broadcasting to a room, iterate only over the connections in that room,
          reducing the complexity from O(n) to O(m), where m is the number of connections in
          the room (typically much smaller than n).
        </p>

        <p>
          <strong>Ignoring backpressure from slow clients.</strong> When a server sends messages
          faster than a client can process them, the TCP send buffer fills up, and the server&apos;s
          write operations block. This can cause the server to consume excessive memory buffering
          messages for slow clients and can block the server&apos;s event loop, affecting all
          other connections. Fix: Monitor the size of each client&apos;s send buffer. When the
          buffer exceeds a threshold, pause sending to that client (apply backpressure). If the
          buffer continues to grow and exceeds a maximum threshold, close the connection and
          require the client to reconnect and catch up from a message store.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Slack: Real-Time Messaging with WebSockets</h3>
        <p>
          Slack uses WebSockets as the primary transport for real-time messaging across its
          platform. Each Slack client (web, desktop, mobile) maintains a persistent WebSocket
          connection to Slack&apos;s real-time messaging infrastructure. When a user sends a
          message, it is published to a message queue, and the message is delivered to all
          connected clients for the relevant channel through their WebSocket connections.
        </p>

        <p>
          Slack&apos;s WebSocket infrastructure handles millions of concurrent connections
          across multiple data centers. Connections are distributed across WebSocket gateway
          servers using a connection registry stored in a distributed key-value store. Cross-server
          message delivery uses an internal pub-sub system, and each gateway server maintains
          room-to-connection mappings for efficient channel-based message routing. Slack
          implements message acknowledgment with message IDs (ts timestamps) to ensure that
          clients receive all messages even after reconnection.
        </p>

        <h3>Discord: Scaling WebSockets to Millions of Concurrent Users</h3>
        <p>
          Discord uses WebSockets for real-time messaging, presence updates, and voice/video
          signaling. Discord&apos;s WebSocket architecture is designed for massive scale: each
          WebSocket gateway server handles up to 150,000 concurrent connections, and the system
          scales horizontally by adding gateway servers as the user base grows.
        </p>

        <p>
          Discord implements a sharding model where each user is assigned to a specific gateway
          shard based on their user ID. This ensures that a user&apos;s connections are always
          routed to the same shard, simplifying connection management. Cross-shard communication
          (e.g., messages between users on different shards) uses an internal message bus.
          Discord also implements connection draining during gateway deployments: the gateway
          server sends a reconnect close frame to all clients with the URL of a new gateway
          server, allowing clients to reconnect without backoff.
        </p>

        <h3>Twitch: Real-Time Chat and Event Streaming</h3>
        <p>
          Twitch uses WebSockets for its real-time chat system, handling millions of concurrent
          chatters during popular live streams. Each stream channel has its own WebSocket topic,
          and clients subscribe to the topics of the channels they are watching. When a user
          sends a chat message, it is published to the channel&apos;s topic and delivered to all
          connected clients through their WebSocket connections.
        </p>

        <p>
          Twitch&apos;s WebSocket infrastructure implements aggressive rate limiting per user
          (messages per minute) to prevent chat spam, message filtering for moderation
          (automod and human moderation), and connection limits per user (to prevent a single
          user from consuming excessive server resources). During high-traffic events (popular
          streamer goes live, tournament broadcasts), Twitch dynamically scales the number of
          WebSocket servers handling the affected channels to absorb the traffic spike.
        </p>
      </section>

      {/* Section 8: Interview Questions */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">Q1: How does the WebSocket handshake work, and why does it use HTTP?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> The WebSocket handshake starts as an HTTP request. The
              client sends an HTTP GET request with an <code className="inline-code">Upgrade:
              websocket</code> header, a <code className="inline-code">Connection: Upgrade</code>
              header, and a <code className="inline-code">Sec-WebSocket-Key</code> header
              containing a random base64-encoded value. The server validates the request,
              computes a response key by concatenating the client key with a magic GUID, hashing
              it with SHA-1, and encoding the result in base64. The server responds with a
              <code className="inline-code">101 Switching Protocols</code> status, an
              <code className="inline-code">Upgrade: websocket</code> header, and a
              <code className="inline-code">Sec-WebSocket-Accept</code> header with the computed
              key.
            </p>
            <p className="mt-2 text-sm">
              The handshake uses HTTP for compatibility with existing HTTP infrastructure:
              proxies, firewalls, and load balancers already understand HTTP and can forward
              the handshake request. After the 101 response, the connection is upgraded to the
              WebSocket protocol, and HTTP is no longer used.
            </p>
          </div>

          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">Q2: How do you scale WebSockets across multiple servers?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> Scaling WebSockets across multiple servers requires three
              components. First, a load balancer with sticky sessions (session affinity) ensures
              that each client&apos;s WebSocket connection is consistently routed to the same
              server instance. Second, a pub-sub backbone (Redis Pub/Sub, Kafka) enables
              cross-server message delivery: when server A needs to send a message to a client
              connected to server B, it publishes the message to the pub-sub backbone, and server
              B delivers it. Third, a connection registry maps each client ID to the server
              instance holding their connection, so the system knows which server to route
              messages through.
            </p>
            <p className="mt-2 text-sm">
              At massive scale (millions of connections), a hierarchical pub-sub topology is
              used: regional pub-sub clusters serve connections in their region, and a central
              coordinator routes cross-region messages. This reduces the load on any single
              pub-sub cluster and minimizes cross-region latency.
            </p>
          </div>

          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">Q3: How do you handle silent disconnections in WebSocket?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> Silent disconnections occur when a network intermediary
              (load balancer, proxy, firewall) closes a WebSocket connection without notifying
              either endpoint. To detect silent disconnections, implement a heartbeat mechanism:
              the server sends a ping frame every 30 seconds, and the client must respond with
              a pong frame within 10 seconds. If the server does not receive a pong, it considers
              the connection dead and closes it.
            </p>
            <p className="mt-2 text-sm">
              On the client side, implement automatic reconnection with exponential backoff
              and jitter. When the client detects a disconnection (close event or missed pong),
              it waits for a random duration (starting at 1 second, doubling with each failed
              attempt, up to a maximum of 60 seconds) before attempting to reconnect. After
              reconnection, the client retransmits any unacknowledged messages using message
              IDs to ensure at-least-once delivery.
            </p>
          </div>

          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">Q4: When would you choose WebSockets over Server-Sent Events (SSE), and vice versa?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> Choose WebSockets when you need bidirectional (full-duplex)
              communication: the client needs to send messages to the server independently of the
              server sending messages to the client. Examples include chat applications,
              collaborative editing, real-time gaming, and financial trading platforms.
            </p>
            <p className="mt-2 text-sm">
              Choose SSE when you need unidirectional (server-to-client) communication only:
              the server pushes data to the client, but the client does not need to send messages
              to the server (beyond the initial HTTP connection). Examples include live news
              feeds, stock price updates, notification streams, and progress indicators. SSE
              is simpler to implement (standard HTTP, built-in browser reconnection, event ID
              support) and works through any HTTP proxy or firewall without special configuration.
            </p>
          </div>

          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">Q5: A WebSocket server is running out of memory. What could be causing it, and how do you fix it?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> Memory exhaustion in a WebSocket server can be caused by
              several factors. First, unbounded message queues for slow clients: if a client is
              slow to process messages, the server queues messages for delivery, and the queue
              grows unbounded. Fix: Implement a maximum queue size per connection and drop the
              oldest messages when the limit is reached.
            </p>
            <p className="mt-2 text-sm">
              Second, dead connections not being cleaned up: if the heartbeat mechanism is not
              working correctly, the server may hold resources for connections that are no longer
              active. Fix: Ensure that ping/pong heartbeats are implemented and that connections
              without a pong response are closed and cleaned up. Third, memory leaks in the
              application code: event listeners not being removed, message buffers not being
              freed, or connection state not being cleaned up on disconnect. Fix: Profile the
              server&apos;s memory usage, identify the growing memory allocation, and fix the
              leak.
            </p>
          </div>

          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">Q6: How do you ensure message delivery ordering in a WebSocket system with multiple servers?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> Message ordering across multiple servers is challenging
              because messages for the same client may be routed through different servers and
              experience different network latencies. To maintain ordering, use one of two
              strategies.
            </p>
            <p className="mt-2 text-sm">
              First, ensure that all messages for the same client (or same conversation) are
              routed through the same server. This is achieved by using the client ID (or
              conversation ID) as the routing key for the pub-sub system, ensuring that all
              messages for the same key are delivered to the same subscriber in order. Second,
              implement sequence numbers: each message is assigned a monotonically increasing
              sequence number by a central coordinator, and the client reorders messages based
              on their sequence numbers before processing them. This allows messages to arrive
              out of order at the client but be processed in order.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
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
              href="https://slack.engineering/tag/websockets"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Slack Engineering Blog — WebSocket Architecture
            </a>
          </li>
          <li>
            <a
              href="https://discord.com/blog/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord Blog — Scaling WebSockets to Millions of Users
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN Web Docs — WebSocket API
            </a>
          </li>
          <li>
            <a
              href="https://tools.ietf.org/html/rfc6455"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              IETF — WebSocket Protocol Specification
            </a>
          </li>
          <li>
            <a
              href="https://blog.twitch.tech/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitch Engineering Blog — Real-Time Chat at Scale
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
