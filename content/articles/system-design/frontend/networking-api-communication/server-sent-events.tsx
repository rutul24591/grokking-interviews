"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-server-sent-events-concise",
  title: "Server-Sent Events (SSE)",
  description:
    "Deep dive into Server-Sent Events covering EventSource API, auto-reconnection, event types, Last-Event-ID, streaming over HTTP/2, and comparison with WebSockets.",
  category: "frontend",
  subcategory: "networking-api-communication",
  slug: "server-sent-events",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-14",
  tags: ["frontend", "SSE", "EventSource", "streaming", "real-time", "HTTP"],
  relatedTopics: [
    "websockets",
    "long-polling",
    "short-polling",
    "http2-and-http3",
  ],
};

export default function ServerSentEventsConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Server-Sent Events (SSE)</strong> is a W3C standard that
          enables servers to push real-time updates to clients over a single,
          long-lived HTTP connection. The client opens a standard HTTP GET
          request, and the server responds with a{" "}
          <strong>text/event-stream</strong> content type, holding the connection
          open and writing discrete events as they occur. Unlike WebSockets, SSE
          is strictly unidirectional: data flows exclusively from server to
          client.
        </p>
        <p>
          SSE was introduced as part of the HTML5 specification and is exposed to
          JavaScript through the <strong>EventSource API</strong>. The protocol
          is deliberately simple: it operates over plain HTTP, requires no
          protocol upgrade handshake, works through HTTP proxies and load
          balancers without special configuration, and includes built-in
          auto-reconnection with resume semantics via the{" "}
          <strong>Last-Event-ID</strong> header. This simplicity made it a
          natural fit for notification feeds, live scoreboards, and activity
          streams throughout the 2010s.
        </p>
        <p>
          At a staff/principal level, what matters most is understanding SSE in
          the context of modern infrastructure. On HTTP/1.1, browsers enforce a
          limit of roughly six concurrent connections per origin, so each
          EventSource instance consumes one of those precious slots. This was
          SSE's most significant scalability constraint for years. However, with{" "}
          <strong>HTTP/2 multiplexing</strong>, all streams share a single TCP
          connection, effectively eliminating the six-connection bottleneck. SSE
          over HTTP/2 provides the simplicity of a text-based push channel
          without the connection-slot penalty, which is why SSE is experiencing a
          renaissance. The most visible driver of this revival is{" "}
          <strong>LLM token streaming</strong>: both ChatGPT and Claude use SSE
          to deliver AI-generated tokens to the browser in real time. The
          alternative approach, using <code>fetch()</code> with a{" "}
          <code>ReadableStream</code> body, provides similar streaming semantics
          but lacks the auto-reconnect and Last-Event-ID resume features that
          EventSource provides out of the box.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Understanding SSE deeply requires grasping six foundational concepts
          that govern how connections are established, maintained, and recovered:
        </p>
        <ul>
          <li>
            <strong>EventSource API:</strong> The browser-native interface for
            consuming SSE streams. Constructed with a URL (and optional
            configuration object), EventSource manages the connection lifecycle
            internally. It exposes three key properties: <code>readyState</code>{" "}
            (0 = CONNECTING, 1 = OPEN, 2 = CLOSED), <code>url</code>, and{" "}
            <code>withCredentials</code>. Events are received via{" "}
            <code>onmessage</code> for unnamed events or{" "}
            <code>addEventListener</code> for named event types. Calling{" "}
            <code>close()</code> terminates the connection permanently.
          </li>
          <li>
            <strong>Event Stream Format:</strong> The server writes plain text
            conforming to a simple line-oriented protocol. Each field starts with
            a keyword followed by a colon: <code>data:</code> carries the event
            payload (multiple data lines are concatenated with newlines),{" "}
            <code>event:</code> sets a named event type,{" "}
            <code>id:</code> assigns a unique identifier to the event, and{" "}
            <code>retry:</code> instructs the client to wait a given number of
            milliseconds before reconnecting. Events are delimited by a blank
            line (double newline). Lines beginning with a colon are comments,
            often used as keep-alive heartbeats.
          </li>
          <li>
            <strong>Auto-Reconnection:</strong> When the connection drops (network
            failure, server restart, proxy timeout), EventSource automatically
            attempts to reconnect after a configurable delay. The default retry
            interval varies by browser (typically 3 seconds) but can be
            overridden by the server sending a <code>retry:</code> field. This
            happens transparently without application code needing to detect
            disconnects or implement retry logic. The <code>readyState</code>{" "}
            transitions from OPEN back to CONNECTING during reconnection.
          </li>
          <li>
            <strong>Last-Event-ID:</strong> When reconnecting, EventSource
            automatically sends a <code>Last-Event-ID</code> HTTP header
            containing the <code>id</code> of the last event it successfully
            received. This enables the server to replay any events the client
            missed during the disconnect window. For this to work, the server
            must persist a buffer of recent events and implement logic to resume
            from a given ID. This is a critical differentiator from raw
            WebSockets or fetch-based streaming, where resume semantics must be
            built entirely from scratch.
          </li>
          <li>
            <strong>Custom Event Types:</strong> By default, all events without
            an <code>event:</code> field trigger the <code>onmessage</code>{" "}
            handler. When the server includes <code>event: userJoined</code>,
            the client must register a specific listener via{" "}
            <code>addEventListener(&apos;userJoined&apos;, callback)</code>.
            These named events do not fire <code>onmessage</code>. This
            multiplexing of event types over a single connection eliminates the
            need for multiple SSE endpoints for different data streams.
          </li>
          <li>
            <strong>CORS Support:</strong> EventSource supports cross-origin
            requests. The constructor accepts a second parameter with a{" "}
            <code>withCredentials</code> boolean. When set to true, cookies and
            authorization headers are sent with the request. The server must
            respond with appropriate <code>Access-Control-Allow-Origin</code> and{" "}
            <code>Access-Control-Allow-Credentials</code> headers. This is
            essential for architectures where the SSE endpoint lives on a
            different subdomain or service from the main application.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          The SSE lifecycle follows a predictable sequence that is important to
          understand for debugging production issues and designing resilient
          architectures:
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">SSE Connection Lifecycle</h3>
          <ol className="space-y-3">
            <li>
              <strong>1. Client Opens Connection:</strong> JavaScript constructs
              a new EventSource with the endpoint URL. The browser sends an HTTP
              GET request with <code>Accept: text/event-stream</code> header.
            </li>
            <li>
              <strong>2. Server Accepts & Holds Open:</strong> The server
              responds with status 200, <code>Content-Type: text/event-stream</code>,{" "}
              <code>Cache-Control: no-cache</code>, and{" "}
              <code>Connection: keep-alive</code>. It does not close the response
              body.
            </li>
            <li>
              <strong>3. Server Pushes Events:</strong> As events occur, the
              server writes formatted event data to the response stream, flushing
              after each event. Each event is delimited by a blank line.
            </li>
            <li>
              <strong>4. Client Receives Events:</strong> The browser parses
              incoming text, dispatches <code>message</code> events (or named
              events), and updates the internal last-event-id tracker.
            </li>
            <li>
              <strong>5. Connection Drops:</strong> Network failure, server
              restart, or proxy timeout closes the TCP connection. EventSource
              fires an <code>error</code> event and transitions readyState to
              CONNECTING.
            </li>
            <li>
              <strong>6. Auto-Reconnect:</strong> After the retry interval,
              EventSource sends a new GET request with the{" "}
              <code>Last-Event-ID</code> header set to the id of the last
              received event.
            </li>
            <li>
              <strong>7. Server Resumes:</strong> The server reads
              Last-Event-ID, replays missed events from its buffer, then
              continues streaming new events.
            </li>
          </ol>
        </div>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/sse-flow.svg"
          alt="SSE Connection Lifecycle Flow Diagram"
          caption="Server-Sent Events connection lifecycle showing initial handshake, event streaming, disconnect handling, and auto-reconnection with Last-Event-ID resume"
        />

        <p>
          The event stream format is deceptively simple but has nuances that
          matter in production. Understanding the exact wire format helps when
          debugging with browser DevTools or curl, and when implementing custom
          SSE servers.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/sse-event-format.svg"
          alt="SSE Event Stream Format Breakdown"
          caption="Visual breakdown of the text/event-stream wire format showing the four field types (data, event, id, retry) with real-world examples"
        />

        <p>
          A key architectural consideration is how the server manages open
          connections. Each SSE client holds a long-lived HTTP connection, which
          means the server must maintain state (a writable response stream) for
          every connected client. In Node.js, this is natural with the
          event-loop model, but in thread-per-request frameworks (traditional
          Java, PHP), each connection consumes a thread. At scale, this drives
          the choice of server technology, the use of connection registries or
          fan-out patterns (e.g., Redis Pub/Sub to distribute events to multiple
          SSE server instances), and the need for graceful shutdown logic that
          closes streams cleanly during deployments.
        </p>
      </section>

      <section>
        <h2>Implementation Examples</h2>
        <p>
          Implementing SSE involves both a server that writes the event stream
          and a client that consumes it. The examples below demonstrate
          production-grade patterns:
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="mb-3 font-semibold">Node.js SSE Server</h3>
            <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">
              Example code moved to the Example tab.
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">React EventSource Client</h3>
            <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">
              Example code moved to the Example tab.
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">
              Fetch + ReadableStream Alternative
            </h3>
            <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">
              Example code moved to the Example tab.
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">Advantages</th>
              <th className="p-3 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>Simplicity</strong>
              </td>
              <td className="p-3">
                Plain HTTP, no protocol upgrade, works with existing
                infrastructure. EventSource API handles reconnection
                automatically.
              </td>
              <td className="p-3">
                Unidirectional only. Client cannot send data over the same
                connection; must use separate HTTP requests.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Reconnection</strong>
              </td>
              <td className="p-3">
                Built-in auto-reconnect with configurable retry. Last-Event-ID
                enables seamless resume without data loss.
              </td>
              <td className="p-3">
                Server must maintain an event buffer and implement replay logic.
                Without it, Last-Event-ID header is wasted.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Protocol</strong>
              </td>
              <td className="p-3">
                HTTP-native. Works through corporate proxies, firewalls, and
                load balancers without special configuration. Full HTTP semantics
                (cookies, headers, auth).
              </td>
              <td className="p-3">
                HTTP/1.1 imposes 6-connection-per-origin limit. Requires HTTP/2
                for connection multiplexing to avoid starving other requests.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Scalability</strong>
              </td>
              <td className="p-3">
                Lightweight per-connection overhead. Node.js can handle tens of
                thousands of concurrent SSE connections per process.
              </td>
              <td className="p-3">
                Each client holds an open connection. Scaling requires
                connection-aware load balancing, fan-out patterns, and graceful
                drain during deploys.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Data Format</strong>
              </td>
              <td className="p-3">
                Text-based. JSON payloads are trivially serialized. Human-readable
                wire format simplifies debugging with curl or DevTools.
              </td>
              <td className="p-3">
                No binary data support. Cannot send images, protobuf, or
                MessagePack directly. Must Base64-encode, which inflates payload
                size by ~33%.
              </td>
            </tr>
          </tbody>
        </table>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/sse-vs-websocket.svg"
          alt="SSE vs WebSocket Comparison Diagram"
          caption="Side-by-side comparison of Server-Sent Events (unidirectional, HTTP-native) versus WebSockets (bidirectional, ws:// protocol upgrade)"
        />

        <p>
          The decision between SSE and WebSocket should be driven by
          directionality requirements. If the server pushes data and the client
          only consumes, SSE is almost always the better choice due to its
          simpler operational profile. If true bidirectional communication is
          needed (chat, collaborative editing, multiplayer), WebSocket is
          necessary. For cases where the client occasionally sends data but
          receives far more, SSE for the downstream channel combined with
          standard HTTP requests for upstream is a pragmatic hybrid architecture.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          These practices emerge from operating SSE at scale in production
          environments:
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Always Assign Event IDs:</strong> Every event should include
            an <code>id:</code> field. Without it, the Last-Event-ID header on
            reconnect is empty, making it impossible for the server to determine
            what the client missed. Use monotonically increasing integers or
            timestamps.
          </li>
          <li>
            <strong>Implement Server-Side Event Buffering:</strong> Maintain a
            bounded buffer of recent events (ring buffer, Redis stream, or
            database-backed log). On reconnect, read the Last-Event-ID header
            and replay events from that point forward. Set a maximum buffer
            window (e.g., 5 minutes or 1000 events) and send a full state
            snapshot if the gap is too large.
          </li>
          <li>
            <strong>Send Keep-Alive Comments:</strong> Many proxies, load
            balancers, and CDNs will close idle connections after 30-60 seconds.
            Send a comment line (<code>: heartbeat</code>) every 15-30 seconds to
            prevent intermediate infrastructure from closing the connection.
          </li>
          <li>
            <strong>Deploy Behind HTTP/2:</strong> Ensure your reverse proxy
            (nginx, Cloudflare, ALB) terminates HTTP/2. This eliminates the
            6-connection-per-origin limit and allows dozens of SSE streams to
            share a single TCP connection. Verify with browser DevTools that the
            protocol column shows h2.
          </li>
          <li>
            <strong>Set Appropriate Retry Intervals:</strong> Send a{" "}
            <code>retry:</code> field early in the stream to override the browser
            default. Use exponential backoff patterns by sending progressively
            larger retry values during high-load periods. A reasonable default
            is 3000ms for normal operation.
          </li>
          <li>
            <strong>Close Connections Explicitly:</strong> Always call{" "}
            <code>eventSource.close()</code> in cleanup functions (React
            useEffect return, component unmount, page unload). Abandoned
            EventSource instances will auto-reconnect indefinitely, wasting
            server resources.
          </li>
          <li>
            <strong>Use Named Events for Multiplexing:</strong> Instead of
            sending all data through the default <code>message</code> event and
            parsing a type field in the JSON payload, use the{" "}
            <code>event:</code> field to dispatch different event types. This
            leverages the browser&apos;s native event dispatch and keeps handler
            logic clean.
          </li>
          <li>
            <strong>Monitor Connection Counts:</strong> Track the number of
            active SSE connections per server instance. Set alerts for unexpected
            spikes (leaked connections) or drops (infrastructure issues). Export
            metrics to your monitoring system (Prometheus gauge, DataDog custom
            metric).
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          These are the issues that most frequently surface in production SSE
          deployments, often discovered only after launch:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Hitting the HTTP/1.1 6-Connection Limit:</strong> Opening
            multiple EventSource instances on HTTP/1.1 consumes browser
            connection slots shared with all other requests to the same origin
            (API calls, image loads, script fetches). This can silently degrade
            application performance. If a user opens your app in multiple tabs,
            each tab opens its own EventSource, compounding the problem. The
            fix is either HTTP/2 deployment or using SharedWorker / BroadcastChannel
            to share a single EventSource across tabs.
          </li>
          <li>
            <strong>Not Implementing Last-Event-ID on the Server:</strong> The
            EventSource client sends Last-Event-ID automatically on reconnect,
            but if the server ignores it, clients silently miss events during
            disconnects. This creates data consistency issues that are extremely
            hard to diagnose because they only occur during transient network
            failures.
          </li>
          <li>
            <strong>Memory Leaks from Unclosed EventSource:</strong> In single-page
            applications, navigating away from a component without calling{" "}
            <code>close()</code> leaves the EventSource running. It will
            auto-reconnect forever, accumulating event listeners and consuming
            server connections. In React, this manifests as the classic
            &quot;Can&apos;t perform a React state update on an unmounted
            component&quot; warning.
          </li>
          <li>
            <strong>Ignoring the Text-Only Limitation:</strong> Attempting to
            send binary data (images, audio chunks, protobuf) over SSE without
            Base64 encoding causes parse failures. The event stream format is
            strictly UTF-8 text. For binary streaming needs, WebSocket with
            binary frames or fetch with ReadableStream is the correct approach.
          </li>
          <li>
            <strong>Not Handling CORS Properly:</strong> When the SSE endpoint is
            on a different origin, forgetting to set{" "}
            <code>withCredentials: true</code> in the EventSource constructor or
            omitting the server-side CORS headers causes silent connection
            failures. The error event fires but provides no diagnostic
            information, making it difficult to debug.
          </li>
          <li>
            <strong>Assuming SSE Works Through All Proxies:</strong> Some
            corporate proxies, CDN edge nodes, and older load balancers buffer
            the entire response before forwarding it to the client. This
            effectively defeats streaming: events accumulate in the proxy buffer
            and arrive in batches. The fix is to set{" "}
            <code>X-Accel-Buffering: no</code> (for nginx), disable response
            buffering in your CDN configuration, or use{" "}
            <code>Cache-Control: no-transform</code>.
          </li>
          <li>
            <strong>Confusing SSE with WebSocket Capabilities:</strong> Treating
            SSE as a bidirectional channel leads to anti-patterns like opening a
            new EventSource connection for each &quot;request&quot; to the
            server. SSE is server-to-client only. Client-to-server communication
            should use standard HTTP requests (POST, PUT) alongside the SSE
            stream.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          SSE is the right choice when the data flow is predominantly
          server-to-client and HTTP compatibility is valued:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>LLM Token Streaming (ChatGPT, Claude):</strong> AI
            assistants stream generated tokens to the browser in real time using
            SSE. Each token (or small batch of tokens) is sent as a data event.
            The connection closes when generation completes. This is the highest-profile
            modern use case and has driven widespread adoption of SSE in AI-powered
            applications.
          </li>
          <li>
            <strong>Live News & Social Media Feeds:</strong> Breaking news
            updates, live blog entries, and social media timeline updates are
            naturally unidirectional. The server publishes new items as they
            arrive. Twitter&apos;s streaming API originally used a similar
            long-lived HTTP streaming approach.
          </li>
          <li>
            <strong>Financial Data & Stock Tickers:</strong> Real-time price
            updates, order book changes, and trade notifications. SSE is
            preferred over WebSocket here when the client only reads data and
            doesn&apos;t place orders through the same channel.
          </li>
          <li>
            <strong>CI/CD Build Logs:</strong> GitHub Actions, GitLab CI, and
            similar systems stream build output to the browser as it happens.
            SSE is ideal because log output is unidirectional, text-based, and
            benefits from Last-Event-ID for resuming after page refreshes.
          </li>
          <li>
            <strong>Notification Systems:</strong> Push notifications for web
            applications: new messages, system alerts, deployment status changes.
            SSE provides a lightweight alternative to WebSocket when the only
            requirement is server-to-client push.
          </li>
          <li>
            <strong>IoT Dashboard Telemetry:</strong> Sensor readings,
            device status updates, and environmental monitoring data. The server
            aggregates readings from devices and fans them out to connected
            dashboard clients via SSE.
          </li>
        </ul>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">When NOT to Use SSE</h3>
          <p>SSE is the wrong choice for:</p>
          <ul className="mt-2 space-y-2">
            <li>
              <strong>Bidirectional communication:</strong> Chat applications,
              collaborative editing, multiplayer games where both client and
              server exchange frequent messages. Use WebSocket.
            </li>
            <li>
              <strong>Binary data streaming:</strong> Audio/video streaming,
              file transfer, or protobuf-encoded messages. Use WebSocket with
              binary frames or WebTransport.
            </li>
            <li>
              <strong>Ultra-high-frequency updates:</strong> Updates faster than
              60fps (e.g., real-time gaming state at 120Hz). The text parsing
              overhead of SSE adds latency. Use WebSocket or WebTransport.
            </li>
            <li>
              <strong>Environments without HTTP/2:</strong> If you cannot
              guarantee HTTP/2 and need multiple concurrent streams, the
              6-connection limit makes SSE impractical. Evaluate WebSocket or
              long-polling as alternatives.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://html.spec.whatwg.org/multipage/server-sent-events.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WHATWG HTML Living Standard - Server-Sent Events
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/EventSource"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN Web Docs - EventSource API
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN Web Docs - Using Server-Sent Events
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/articles/eventsource-basics"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              web.dev - Stream Updates with Server-Sent Events
            </a>
          </li>
          <li>
            <a
              href="https://developer.chrome.com/docs/devtools/network/reference/#sse"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chrome DevTools - Inspecting Server-Sent Events
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does SSE handle reconnection and what role does
              Last-Event-ID play?
            </p>
            <p className="mt-2 text-sm">
              A: When an SSE connection drops, the EventSource API automatically
              attempts to reconnect after the configured retry interval (default
              ~3s, overridable via the retry: field). On reconnect, it sends a
              Last-Event-ID HTTP header containing the id of the last
              successfully received event. The server reads this header and
              replays any events the client missed from a buffer. This provides
              at-least-once delivery semantics without any application-level
              reconnection code. The key architectural requirement is that the
              server must maintain an event buffer (in-memory ring buffer, Redis
              stream, or database log) and implement the replay logic. Without
              server-side support, the Last-Event-ID header is sent but ignored,
              and missed events are silently lost.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: When would you choose SSE over WebSocket, and vice versa?
            </p>
            <p className="mt-2 text-sm">
              A: Choose SSE when data flows predominantly server-to-client:
              notification feeds, live dashboards, LLM streaming, build logs.
              SSE advantages include automatic reconnection, Last-Event-ID
              resume, HTTP-native operation (works with proxies, CDNs, standard
              auth), and simpler server implementation. Choose WebSocket when
              bidirectional, low-latency communication is required: real-time
              chat, collaborative editing, multiplayer gaming, or binary data
              streaming. WebSocket requires a protocol upgrade handshake, custom
              reconnection logic, and often needs special proxy/load balancer
              configuration. A common hybrid pattern uses SSE for the
              server-to-client channel and standard HTTP POST requests for
              client-to-server messages, getting SSE&apos;s reliability benefits
              without WebSocket complexity.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you scale SSE to support millions of concurrent
              connections?
            </p>
            <p className="mt-2 text-sm">
              A: Scaling SSE requires addressing connection management,
              event distribution, and deployment concerns. First, use HTTP/2 to
              multiplex streams over fewer TCP connections, reducing kernel-level
              overhead. Deploy connection-holding servers on event-loop runtimes
              (Node.js, Go) rather than thread-per-request frameworks. Use a
              fan-out architecture: a message broker (Redis Pub/Sub, Kafka,
              NATS) distributes events to all SSE server instances, and each
              instance pushes to its connected clients. Implement connection
              draining for zero-downtime deploys: stop accepting new connections,
              send a close event to connected clients (triggering reconnect to a
              new instance), then shut down. Monitor connection counts per
              instance and auto-scale horizontally. For extreme scale, consider
              edge SSE: terminate connections at CDN edge nodes (Cloudflare
              Workers, Lambda@Edge) to reduce round-trip latency and distribute
              connection load geographically.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
