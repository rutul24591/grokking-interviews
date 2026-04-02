"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "server-sent-events",
  title: "Server-Sent Events (SSE)",
  description:
    "Comprehensive guide to Server-Sent Events for efficient unidirectional server-to-client streaming — covering the EventSource API, text/event-stream protocol, automatic reconnection, HTTP/2 multiplexing, and production deployment patterns.",
  category: "frontend",
  subcategory: "real-time-features",
  slug: "server-sent-events",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-04-01",
  tags: [
    "server-sent-events",
    "SSE",
    "EventSource",
    "real-time",
    "streaming",
    "text-event-stream",
  ],
  relatedTopics: [
    "websockets",
    "real-time-notifications",
    "live-updates-feed",
  ],
};

export default function ServerSentEventsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition &amp; Context</h2>
        <p className="mb-4">
          <strong>Server-Sent Events (SSE)</strong> are a browser-native
          technology defined in the HTML Living Standard that enables a server
          to push data to a client over a persistent HTTP connection using the{" "}
          <code>text/event-stream</code> MIME type. Unlike WebSockets, which
          provide full-duplex bidirectional communication, SSE is intentionally
          unidirectional — the server sends events to the client, and the
          client consumes them through the <code>EventSource</code> API. This
          constraint is not a limitation but a design choice that aligns
          perfectly with the most common real-time web pattern: the server has
          data updates that the client needs to receive, while the client
          communicates back to the server through standard HTTP requests.
        </p>
        <p className="mb-4">
          The elegance of SSE lies in what it provides for free. The{" "}
          <code>EventSource</code> API handles automatic reconnection with
          configurable retry intervals, last-event-ID tracking for resuming
          interrupted streams, named event types for multiplexing different
          data streams over a single connection, and native integration with the
          browser&apos;s event system. When a connection drops, the browser
          automatically reconnects and sends the <code>Last-Event-ID</code>{" "}
          header, allowing the server to replay missed events — a feature that
          WebSocket applications must implement manually. This built-in
          resilience makes SSE significantly simpler to implement correctly for
          the many use cases where server-to-client streaming is the primary
          communication pattern.
        </p>
        <p className="mb-4">
          SSE operates over standard HTTP, which gives it substantial
          operational advantages over WebSockets. SSE connections traverse
          corporate firewalls and proxies without issue (they are just
          long-lived HTTP responses), work with standard HTTP/2 load balancers
          that multiplex multiple SSE streams over a single TCP connection,
          benefit from HTTP-level compression and caching infrastructure, and
          can be authenticated using standard HTTP mechanisms (cookies, bearer
          tokens in headers). HTTP/2 is particularly transformative for SSE:
          the historical limitation of six concurrent connections per origin in
          HTTP/1.1 (which meant six SSE streams consumed all available
          connections) is eliminated by HTTP/2&apos;s stream multiplexing,
          where hundreds of SSE streams share a single TCP connection.
        </p>
        <p>
          For staff and principal engineers, the decision between SSE and
          WebSockets is a systems design question about operational complexity
          versus capability. WebSockets provide bidirectional communication but
          require custom reconnection logic, special load balancer
          configuration, and often a separate infrastructure layer. SSE provides
          unidirectional streaming with automatic reconnection, works with
          existing HTTP infrastructure, and is dramatically simpler to operate.
          In practice, the vast majority of &quot;real-time&quot; features —
          live notifications, dashboard updates, feed refreshes, progress
          indicators, AI streaming responses — only need server-to-client push.
          The client sends actions through regular HTTP endpoints. SSE serves
          these patterns with less code, fewer failure modes, and lower
          operational burden than WebSockets.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/real-time-features/server-sent-events-diagram-1.svg"
        alt="SSE connection lifecycle showing HTTP request, persistent text/event-stream response, automatic reconnection with Last-Event-ID"
        caption="Figure 1: SSE connection lifecycle with automatic reconnection"
      />

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          The EventSource API
        </h3>
        <p className="mb-4">
          The browser&apos;s <code>EventSource</code> interface creates a
          persistent connection to an HTTP server endpoint. Instantiation is
          minimal: <code>new EventSource(&apos;/api/events&apos;)</code>. The
          connection fires three primary events: <code>open</code> when the
          connection is established, <code>message</code> when the server sends
          an unnamed event, and <code>error</code> when the connection fails or
          is closed by the server. For named events, the client registers
          listeners using <code>addEventListener(&apos;eventName&apos;, handler)</code>.
          The <code>readyState</code> property exposes the connection status:
          0 (CONNECTING), 1 (OPEN), or 2 (CLOSED). The <code>close()</code>{" "}
          method terminates the connection and prevents automatic reconnection.
          The <code>withCredentials</code> option on the constructor enables
          cross-origin SSE with cookies.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          The text/event-stream Protocol
        </h3>
        <p className="mb-4">
          The server responds with <code>Content-Type: text/event-stream</code>{" "}
          and sends events as plain text lines. Each event consists of one or
          more field-value pairs separated by newlines, with events separated
          by a blank line. The four recognized fields are: <code>data</code>{" "}
          (the event payload, which can span multiple lines), <code>event</code>{" "}
          (the event type name), <code>id</code> (the event identifier used for
          reconnection), and <code>retry</code> (the reconnection delay in
          milliseconds). Lines beginning with a colon are comments, commonly
          used as keep-alive signals to prevent proxies from timing out the
          connection. The simplicity of this text-based protocol means that
          SSE endpoints can be debugged by simply curling the URL — no special
          tooling required.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Automatic Reconnection and Event ID Tracking
        </h3>
        <p className="mb-4">
          When an SSE connection drops, the <code>EventSource</code>{" "}
          automatically attempts to reconnect after the retry interval (default
          varies by browser, typically 3 seconds, overridable by the{" "}
          <code>retry</code> field). On reconnection, it sends the{" "}
          <code>Last-Event-ID</code> HTTP header containing the{" "}
          <code>id</code> of the last received event. This enables the server
          to replay events that the client missed during the disconnection
          period. For this to work, the server must maintain a buffer of recent
          events keyed by ID. The event ID should be monotonically increasing
          (timestamps or sequence numbers) to support gap detection. This
          built-in resume capability eliminates one of the most error-prone
          aspects of real-time systems — state synchronization after
          disconnection — and is a major advantage over WebSockets, which
          provide no such mechanism.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Named Events and Stream Multiplexing
        </h3>
        <p className="mb-4">
          The <code>event</code> field allows the server to send typed events
          over a single connection. A notification service might send{" "}
          <code>event: message</code>, <code>event: mention</code>, and{" "}
          <code>event: system</code> events, with the client registering
          separate handlers for each type. This multiplexing eliminates the
          need for multiple connections and simplifies client-side routing.
          Events without an <code>event</code> field trigger the generic{" "}
          <code>message</code> event handler. The data payload is typically
          JSON, parsed by the client on receipt. This combination of named
          events with JSON payloads provides a lightweight pub/sub model over
          a single HTTP connection.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          HTTP/2 and Connection Multiplexing
        </h3>
        <p className="mb-4">
          HTTP/1.1 imposes a per-origin connection limit (typically six) that
          severely constrains SSE: opening multiple SSE streams consumes
          connection slots needed for regular API requests. HTTP/2 eliminates
          this constraint by multiplexing all requests and streams over a single
          TCP connection, making it practical to maintain dozens of SSE streams
          simultaneously. HTTP/2 also provides built-in flow control and header
          compression (HPACK), reducing the overhead of SSE keep-alive
          comments. For modern deployments, serving SSE over HTTP/2 is strongly
          recommended — it transforms SSE from a connection-constrained
          technology into a scalable streaming primitive.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture &amp; Flow</h2>
        <p className="mb-4">
          Production SSE architectures typically follow a fan-out pattern where
          backend services publish events to a message broker, and SSE gateway
          servers subscribe to relevant topics and stream events to connected
          clients. This decouples event production from delivery and enables
          horizontal scaling of the SSE tier independently.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/real-time-features/server-sent-events-diagram-2.svg"
          alt="SSE fan-out architecture with event producers, message broker, SSE gateway servers, and HTTP/2 multiplexed client connections"
          caption="Figure 2: SSE fan-out architecture with message broker and gateway servers"
        />

        <p className="mb-4">
          In this architecture, application services emit events to a message
          broker (Redis Streams, Kafka, or NATS) when state changes occur. SSE
          gateway servers subscribe to topics based on the connections they
          serve — when a user connects, the gateway subscribes to that
          user&apos;s notification topic. Events flow from the broker to the
          gateway, which formats them as <code>text/event-stream</code> chunks
          and pushes them to the client. The gateway servers are stateless with
          respect to event production — they are pure delivery routers. This
          means they can be horizontally scaled, load-balanced with standard
          HTTP infrastructure, and drained gracefully during deployments. The
          broker provides event buffering for reconnection: when a client sends{" "}
          <code>Last-Event-ID</code>, the gateway queries the broker for events
          after that ID and replays them before resuming live streaming.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparisons
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">
          Trade-offs &amp; Comparisons
        </h2>
        <p className="mb-4">
          SSE and WebSockets serve overlapping but distinct use cases. The
          following comparison highlights the key trade-offs across operational,
          protocol, and capability dimensions.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-theme text-sm">
            <thead>
              <tr className="bg-panel">
                <th className="border border-theme px-4 py-2 text-left">
                  Dimension
                </th>
                <th className="border border-theme px-4 py-2 text-left">
                  SSE Advantage
                </th>
                <th className="border border-theme px-4 py-2 text-left">
                  SSE Limitation
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-theme px-4 py-2 font-medium">
                  Reconnection
                </td>
                <td className="border border-theme px-4 py-2">
                  Built-in auto-reconnect with Last-Event-ID
                </td>
                <td className="border border-theme px-4 py-2">
                  Server must maintain event buffer for replay
                </td>
              </tr>
              <tr>
                <td className="border border-theme px-4 py-2 font-medium">
                  Infrastructure
                </td>
                <td className="border border-theme px-4 py-2">
                  Standard HTTP — works with all proxies, CDNs, load balancers
                </td>
                <td className="border border-theme px-4 py-2">
                  HTTP/1.1 connection limit (6 per origin) requires HTTP/2
                </td>
              </tr>
              <tr>
                <td className="border border-theme px-4 py-2 font-medium">
                  Direction
                </td>
                <td className="border border-theme px-4 py-2">
                  Server-push with separate HTTP for client actions — simpler mental model
                </td>
                <td className="border border-theme px-4 py-2">
                  No client-to-server streaming on the same connection
                </td>
              </tr>
              <tr>
                <td className="border border-theme px-4 py-2 font-medium">
                  Data Format
                </td>
                <td className="border border-theme px-4 py-2">
                  Text-based protocol — human readable, curl-debuggable
                </td>
                <td className="border border-theme px-4 py-2">
                  No native binary support (must base64-encode)
                </td>
              </tr>
              <tr>
                <td className="border border-theme px-4 py-2 font-medium">
                  Authentication
                </td>
                <td className="border border-theme px-4 py-2">
                  Standard HTTP auth (cookies, bearer tokens in headers)
                </td>
                <td className="border border-theme px-4 py-2">
                  EventSource API does not support custom headers (use cookies or polyfill)
                </td>
              </tr>
              <tr>
                <td className="border border-theme px-4 py-2 font-medium">
                  Browser Support
                </td>
                <td className="border border-theme px-4 py-2">
                  Supported in all modern browsers
                </td>
                <td className="border border-theme px-4 py-2">
                  No native IE/old Edge support (polyfills available)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            Always include an <code>id</code> field with every event — this
            enables the automatic reconnection and replay mechanism that is
            SSE&apos;s most powerful feature. Use monotonically increasing
            values (timestamps or sequence numbers)
          </li>
          <li>
            Send comment lines (<code>: keepalive</code>) every 15-30 seconds
            to prevent intermediary proxies and load balancers from closing
            idle connections due to inactivity timeouts
          </li>
          <li>
            Serve SSE over HTTP/2 to eliminate the six-connection-per-origin
            limit that makes SSE impractical under HTTP/1.1 for applications
            with multiple streams or API requests
          </li>
          <li>
            Use named events (<code>event:</code> field) to multiplex different
            data types over a single connection rather than opening separate
            connections per data stream
          </li>
          <li>
            Implement server-side event buffering (Redis Streams, a circular
            buffer, or a database query) to support <code>Last-Event-ID</code>{" "}
            replay on reconnection — without this, the auto-reconnect feature
            only re-establishes the connection without recovering missed events
          </li>
          <li>
            Set the <code>retry</code> field to control reconnection timing —
            a short retry (1000ms) for critical real-time feeds, a longer retry
            (5000-10000ms) for less urgent updates
          </li>
          <li>
            Disable response buffering in your HTTP server and any reverse
            proxies (e.g., <code>X-Accel-Buffering: no</code> for Nginx) to
            ensure events are flushed to the client immediately rather than
            being held in output buffers
          </li>
          <li>
            Use the <code>fetch()</code> API with <code>ReadableStream</code>{" "}
            instead of <code>EventSource</code> when you need custom request
            headers (for bearer token auth) that <code>EventSource</code> does
            not support natively
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Proxy buffering swallowing events</strong> — Nginx and many
            CDNs buffer responses by default. SSE events accumulate in the
            buffer and are delivered in bulk rather than as they arrive,
            destroying the real-time behavior. Disable buffering with{" "}
            <code>proxy_buffering off</code> or{" "}
            <code>X-Accel-Buffering: no</code>
          </li>
          <li>
            <strong>HTTP/1.1 connection exhaustion</strong> — opening multiple
            SSE connections under HTTP/1.1 consumes the browser&apos;s
            per-origin connection pool, starving regular API requests. This
            manifests as mysteriously slow API calls that resolve when the SSE
            connection is closed
          </li>
          <li>
            <strong>Missing event IDs</strong> — without IDs, automatic
            reconnection re-establishes the connection but the server cannot
            determine which events the client has already received, leading to
            either duplicates or gaps in the event stream
          </li>
          <li>
            <strong>No graceful close signaling</strong> — when the server
            needs to terminate an SSE connection (user logged out, server
            shutting down), simply closing the connection triggers automatic
            reconnection. Send a named &quot;close&quot; event first so the
            client can call <code>close()</code> and prevent reconnection
          </li>
          <li>
            <strong>Memory leaks from abandoned EventSource</strong> —
            components that create <code>EventSource</code> instances must call{" "}
            <code>close()</code> on unmount. Without cleanup, the browser
            maintains the connection and fires events to detached handlers,
            accumulating memory over navigation within SPAs
          </li>
          <li>
            <strong>Assuming EventSource supports custom headers</strong> —
            the <code>EventSource</code> constructor only accepts a URL and an
            options object with <code>withCredentials</code>. It does not
            support custom headers like <code>Authorization: Bearer</code>.
            Use cookies for auth or switch to a fetch-based SSE implementation
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          ChatGPT and AI Streaming Responses
        </h3>
        <p className="mb-4">
          OpenAI&apos;s ChatGPT interface uses SSE to stream token-by-token
          responses from the language model. When a user sends a prompt, the
          server begins generating tokens and sends each token (or small group
          of tokens) as an SSE event. The client appends each token to the
          response as it arrives, creating the characteristic typewriter
          effect. This streaming approach dramatically improves perceived
          latency: the user sees the first word within 200-500ms instead of
          waiting 5-30 seconds for the complete response. The SSE
          implementation uses the <code>text/event-stream</code> format with
          JSON payloads containing the delta content, and a special{" "}
          <code>[DONE]</code> sentinel to signal the end of the stream. This
          pattern has become the de facto standard for all LLM-powered chat
          interfaces.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          GitHub: Live Build and CI Status Updates
        </h3>
        <p className="mb-4">
          GitHub uses SSE to push real-time updates for pull request status
          checks, Actions workflow runs, and deployment status. When a
          developer opens a pull request page, the browser establishes an SSE
          connection that receives updates as CI jobs transition through states
          (queued, in progress, succeeded, failed). This avoids the need for
          users to manually refresh the page to check build status. The same
          mechanism powers the real-time indicators on the repository page that
          show the status of the latest commit. GitHub&apos;s implementation
          leverages HTTP/2 multiplexing to maintain these SSE streams alongside
          regular API requests without connection pool contention.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Vercel: Real-Time Deployment Logs
        </h3>
        <p className="mb-4">
          Vercel&apos;s deployment dashboard uses SSE to stream build logs in
          real-time as a deployment progresses. Each log line is sent as an SSE
          event with a timestamp ID, allowing the dashboard to resume from the
          correct position if the browser tab loses connection. The streaming
          continues through multiple build phases — dependency installation,
          compilation, optimization, and deployment — with named events
          distinguishing between stdout, stderr, and phase transition markers.
          When the deployment completes, a final event signals success or
          failure, and the client terminates the connection. This approach
          provides the live-tailing experience of watching a terminal while
          using the most operationally simple server-push technology available.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/real-time-features/server-sent-events-diagram-3.svg"
          alt="SSE vs WebSocket decision matrix showing when to use each technology based on communication pattern and operational requirements"
          caption="Figure 3: SSE vs WebSocket decision matrix for real-time features"
        />
      </section>

      {/* ============================================================
          SECTION 8: Common Interview Questions
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Interview Questions</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does SSE handle reconnection differently from WebSockets,
              and what are the implications for application architecture?
            </p>
            <p className="mt-2 text-sm">
              SSE provides built-in automatic reconnection via the{" "}
              <code>EventSource</code> API. When a connection drops, the browser
              automatically reconnects after the retry interval and sends the{" "}
              <code>Last-Event-ID</code> header. The server uses this to replay
              missed events. WebSockets have no built-in reconnection —
              applications must implement it manually with backoff, jitter, and
              state recovery. The architectural implication is that SSE servers
              must maintain an event buffer for replay, while WebSocket servers
              need client-side reconnection logic and a separate mechanism for
              gap detection.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Why does HTTP/2 significantly improve SSE, and what problems
              does HTTP/1.1 cause?
            </p>
            <p className="mt-2 text-sm">
              HTTP/1.1 limits browsers to six concurrent connections per origin.
              Each SSE connection consumes one of these slots permanently,
              leaving fewer connections for regular API requests and other SSE
              streams. With three SSE streams, only three slots remain for all
              other HTTP activity. HTTP/2 multiplexes all streams over a single
              TCP connection, so SSE streams and API requests share the
              connection without contention. This makes it practical to maintain
              many SSE streams simultaneously while keeping full API
              throughput.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: When would you choose SSE over WebSockets for a real-time
              feature?
            </p>
            <p className="mt-2 text-sm">
              Choose SSE when the communication pattern is primarily
              server-to-client push: live notifications, dashboard updates, AI
              token streaming, deployment logs, stock tickers, and news feeds.
              SSE is simpler to implement, works with standard HTTP
              infrastructure (no special load balancer configuration), has
              built-in reconnection, and can be debugged with curl. Choose
              WebSockets only when you need true bidirectional streaming where
              both client and server send high-frequency messages on the same
              channel — chat, multiplayer gaming, collaborative editing.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle authentication for SSE when EventSource does
              not support custom headers?
            </p>
            <p className="mt-2 text-sm">
              Three approaches: (1) Use HTTP-only cookies for authentication —
              they are automatically sent with the EventSource request. Set{" "}
              <code>withCredentials: true</code> for cross-origin. (2) Pass a
              short-lived token as a URL query parameter — simple but the token
              appears in server logs. (3) Use the <code>fetch()</code> API with{" "}
              <code>ReadableStream</code> instead of <code>EventSource</code> —
              this allows custom headers but requires manual SSE parsing and
              reconnection logic. For most applications, cookie-based auth is
              the cleanest solution.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you scale an SSE service to millions of clients?
            </p>
            <p className="mt-2 text-sm">
              Use a fan-out architecture: application services publish events
              to a message broker (Redis Streams, Kafka). Stateless SSE gateway
              servers subscribe to topics based on their connected clients and
              stream events as <code>text/event-stream</code>. Gateway servers
              are horizontally scaled behind standard HTTP/2 load balancers. The
              broker provides event buffering for <code>Last-Event-ID</code>{" "}
              replay. Each gateway can serve tens of thousands of concurrent SSE
              connections. During deployments, connections naturally
              re-establish on other servers via automatic reconnection —
              no special draining needed.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References & Further Reading
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">
          References &amp; Further Reading
        </h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://html.spec.whatwg.org/multipage/server-sent-events.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              HTML Living Standard — Server-Sent Events specification (WHATWG)
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/EventSource"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN Web Docs — EventSource API reference and usage guide
            </a>
          </li>
          <li>
            <a
              href="https://ably.com/topic/server-sent-events-vs-websockets"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Server-Sent Events vs WebSockets vs Long Polling&quot; —
              Ably Realtime comparison guide
            </a>
          </li>
          <li>
            <a
              href="https://platform.openai.com/docs/guides/streaming-responses"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Streaming LLM Responses with Server-Sent Events&quot; —
              OpenAI API documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.smashingmagazine.com/2018/02/sse-websockets-data-flow-http2/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;HTTP/2 and the Future of Real-Time Web&quot; — Smashing
              Magazine deep dive
            </a>
          </li>
          <li>
            <a
              href="https://hpbn.co/server-sent-events-sse/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;High Performance Browser Networking&quot; by Ilya Grigorik —
              Chapter on SSE protocol
            </a>
          </li>
          <li>
            <a
              href="https://github.com/Yaffle/EventSource"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              eventsource polyfill — fetch-based EventSource implementation
              with custom header support
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
