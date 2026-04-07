"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

const BASE_PATH = "/diagrams/system-design-concepts/backend/network-communication";

export const metadata: ArticleMetadata = {
  id: "article-backend-sse",
  title: "Server-Sent Events (SSE)",
  description:
    "Deep dive into Server-Sent Events covering the EventSource API, unidirectional streaming, automatic reconnection with Last-Event-ID, proxy traversal, scaling strategies, and production trade-offs versus WebSockets and long-polling.",
  category: "backend",
  subcategory: "network-communication",
  slug: "server-sent-events",
  wordCount: 5400,
  readingTime: 22,
  lastUpdated: "2026-04-07",
  tags: [
    "backend",
    "network",
    "sse",
    "streaming",
    "real-time",
    "eventsource",
  ],
  relatedTopics: [
    "websockets",
    "long-polling",
    "event-streaming",
    "http-keep-alive",
  ],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Server-Sent Events (SSE) is a W3C-recommended standard that enables a
          server to push a unidirectional stream of text-based events to a
          browser or HTTP client over a single, long-lived HTTP connection.
          Unlike HTTP request-response, where the client must poll for updates,
          SSE keeps the HTTP connection open and allows the server to send data
          at any time. The client-side API is the EventSource object, a native
          browser API that handles connection management, automatic reconnection
          with exponential backoff, and event dispatching. SSE was standardized
          as part of HTML5 and is supported by all modern browsers, making it
          the simplest real-time communication mechanism available on the web
          platform without requiring any external libraries or protocols.
        </p>
        <p>
          The defining characteristic of SSE is its asymmetry: data flows only
          from server to client. If the client needs to communicate with the
          server, it must use a separate HTTP request. This constraint is not a
          limitation but a design decision that simplifies the protocol
          significantly. Because the server is the only sender on the SSE
          connection, there is no need for frame negotiation, congestion control,
          or collision detection. The server sends text lines formatted as
          &quot;field: value\n\n&quot; pairs, and the client parses them into
          events. This simplicity is precisely why SSE is often the right choice
          for use cases that need server-to-client streaming but not bidirectional
          communication: live notification feeds, real-time dashboards, stock
          tickers, build progress streams, and AI-generated token streaming in
          large language model interfaces.
        </p>
        <p>
          SSE operates over standard HTTP/1.1 or HTTP/2, which means it works
          through any HTTP-compatible proxy, load balancer, or CDN that respects
          the streaming semantics. The connection is initiated with a regular
          HTTP GET request, and the server responds with a Content-Type of
          text/event-stream and a Transfer-Encoding of chunked. The server then
          writes event blocks to the response stream, separated by double
          newlines. The client&apos;s EventSource implementation buffers incoming
          data and dispatches events to registered listeners. This HTTP-native
          design is both SSE&apos;s greatest advantage and its most significant
          operational challenge: every intermediary in the request path must
          correctly handle a response that never terminates, and many do not.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          The SSE wire format is deliberately minimal. Each event is composed of
          one or more fields terminated by a blank line (double newline). The
          recognized fields are &quot;data&quot;, which carries the event payload
          as a UTF-8 string; &quot;event&quot;, which specifies the event type
          name (defaulting to &quot;message&quot; if omitted); &quot;id&quot;,
          which assigns a unique identifier to the event for reconnection
          purposes; and &quot;retry&quot;, which instructs the client how many
          milliseconds to wait before attempting to reconnect after a
          disconnection. Multiple data fields within a single event are
          concatenated with newline characters, allowing multi-line payloads. The
          simplicity of this format means that SSE events are human-readable and
          can be inspected in a browser&apos;s developer tools or streamed through
          a terminal with curl.
        </p>
        <p>
          The reconnection mechanism is one of SSE&apos;s most valuable features
          and the one that most production implementations get wrong. When an SSE
          connection drops — whether due to a network interruption, server
          restart, or intermediary timeout — the browser automatically attempts
          to reconnect. The reconnection delay starts at a default of three
          seconds and can be overridden by the server sending a retry field. The
          critical detail is that on reconnection, the browser sends an
          Last-Event-ID HTTP header containing the ID of the last event it
          successfully received. The server uses this header to resume the event
          stream from the point of interruption, ensuring that no events are lost
          during transient failures. This mechanism provides at-least-once
          delivery semantics: the server may resend events that the client
          already received (if the acknowledgment was lost), but it will not skip
          events. The server must therefore design its event emission to be safe
          under duplicate delivery, or the client must deduplicate using the
          event IDs.
        </p>
        <p>
          Heartbeat messages (often called &quot;keep-alive&quot; or
          &quot;ping&quot; events) are essential for maintaining SSE connections
          through intermediaries. Many proxies, load balancers, and CDNs
          interpret an idle HTTP connection as dead and terminate it after a
          configurable idle timeout (commonly 30-60 seconds for NGINX, 300
          seconds for AWS Application Load Balancer). To prevent this, the server
          should send periodic heartbeat messages — typically a comment line
          starting with a colon character, which the SSE client ignores but which
          resets the idle timer on every intermediary along the path. The
          heartbeat interval should be shorter than the shortest idle timeout in
          the path, which requires knowing or discovering the topology between
          the server and the client.
        </p>
        <p>
          Event ID management is the responsibility of the server and is
          fundamental to correct reconnection behavior. The event ID should be a
          monotonically increasing sequence number, a timestamp-based identifier,
          or a cursor into an event log (such as a Kafka offset or a database
          transaction ID). The server must persist or retain events for at least
          as long as the maximum expected reconnection delay, so that when a
          client reconnects with a Last-Event-ID, the server can replay all
          events that occurred after that ID. This retention requirement is the
          primary scaling constraint for SSE at production scale: if you have one
          million connected clients, each with a potentially different
          Last-Event-ID, the server must be able to serve events from an
          arbitrarily deep backlog to any individual client.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          An SSE architecture consists of three primary components: the event
          producer (the system generating events, which may be an application
          service, a message broker consumer, or a database change-data-capture
          pipeline), the event distributor (the HTTP server that manages SSE
          connections and routes events to connected clients), and the event
          consumer (the browser EventSource or an HTTP client implementing the
          SSE protocol). The event producer generates events and publishes them
          to an internal distribution mechanism. The event distributor subscribes
          to this mechanism and forwards events to the appropriate connected
          clients based on subscription criteria. The event consumer receives
          events and dispatches them to application-level handlers.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/server-sent-events.svg`}
          alt="SSE architecture showing event producer, distributor with open connections, and browser EventSource consumers"
          caption="SSE architecture — events flow from producers through a distributor that maintains long-lived HTTP connections to each connected client"
        />

        <p>
          The event distributor is the operational bottleneck in any SSE system.
          Each connected client consumes one HTTP connection on the server, which
          means the server must maintain a connection table mapping client
          identifiers to their response streams. The size of this table is
          bounded by the server&apos;s file descriptor limit and the operating
          system&apos;s connection handling capacity. A single Node.js process
          can typically maintain 10,000-50,000 concurrent SSE connections, while
          a Go-based server using goroutines can handle 100,000+ connections per
          instance depending on memory constraints. Scaling beyond a single
          instance requires a distributed event distribution mechanism: when an
          event is produced, it must be delivered to all connected clients across
          all instances, not just those connected to the instance that received
          the event.
        </p>

        <p>
          The standard solution for distributed SSE is to use a pub/sub
          backbone, typically Redis Pub/Sub or Apache Kafka, to distribute events
          across server instances. Each server instance subscribes to the
          relevant channels or topics in the pub/sub system. When an event is
          produced, it is published to the pub/sub backbone, which delivers it to
          all subscribed instances. Each instance then filters the events and
          forwards only the relevant ones to its locally connected clients. This
          architecture decouples the event production rate from the connection
          management concern and enables horizontal scaling: adding more server
          instances increases the total number of concurrent SSE connections
          linearly. However, it introduces a new failure mode: if an instance
          falls behind on consuming from the pub/sub system (due to GC pauses,
          CPU saturation, or network issues), its connected clients will
          experience delayed events.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/http-persistent-connection.svg`}
          alt="SSE reconnection sequence showing connection drop, browser auto-reconnect with Last-Event-ID header, and server replay of missed events"
          caption="SSE reconnection — the browser automatically reconnects with the Last-Event-ID header, allowing the server to replay missed events and maintain at-least-once delivery"
        />

        <p>
          Comparing SSE with WebSockets reveals fundamentally different design
          philosophies. WebSockets establish a persistent, bidirectional,
          frame-based communication channel over a single TCP connection, using
          an HTTP upgrade handshake to transition from HTTP to the WebSocket
          protocol (ws:// or wss://). SSE uses standard HTTP and never upgrades
          the protocol. WebSockets require a dedicated WebSocket-aware server
          and cannot traverse HTTP-only proxies without special configuration.
          SSE works through any HTTP proxy and can be served by standard web
          servers like NGINX with minimal configuration. WebSockets support
          binary frames and bidirectional communication, making them suitable
          for gaming, collaborative editing, and real-time trading. SSE is
          text-only and unidirectional, making it ideal for notification feeds,
          live dashboards, and content streaming. WebSockets do not have a
          built-in reconnection mechanism; the client library must implement
          reconnection, heartbeat, and message acknowledgment. SSE provides all
          of these natively through the EventSource API. The choice between them
          should be driven by the communication pattern: use SSE when the data
          flow is predominantly server-to-client, and use WebSockets when
          frequent bidirectional communication is required.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/technology-push.svg`}
          alt="Side-by-side comparison of SSE and WebSockets showing protocol layers, capabilities, and use case fit"
          caption="SSE vs WebSockets — SSE uses standard HTTP with built-in reconnection while WebSockets upgrade to a custom binary protocol with bidirectional framing"
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          The decision to use SSE, WebSockets, or long-polling is determined by
          the communication pattern, the infrastructure constraints, and the
          operational capacity of the team. Each technology occupies a distinct
          position in the design space, and understanding their boundaries
          prevents misapplication.
        </p>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">Server-Sent Events (SSE)</th>
              <th className="p-3 text-left">WebSockets</th>
              <th className="p-3 text-left">Long-Polling</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>Directionality</strong>
              </td>
              <td className="p-3">
                Unidirectional (server to client). Client sends standard HTTP
                requests separately.
              </td>
              <td className="p-3">
                Bidirectional. Full duplex communication over a single
                connection.
              </td>
              <td className="p-3">
                Unidirectional per request. Client polls; server responds when
                data is available.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Protocol</strong>
              </td>
              <td className="p-3">
                Standard HTTP/1.1 or HTTP/2. Works through any HTTP proxy, CDN,
                or load balancer.
              </td>
              <td className="p-3">
                WebSocket protocol (ws/wss) via HTTP upgrade. Requires
                WebSocket-aware intermediaries.
              </td>
              <td className="p-3">
                Standard HTTP. Universally compatible with all infrastructure.
                No special configuration needed.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Reconnection</strong>
              </td>
              <td className="p-3">
                Built-in automatic reconnection with exponential backoff and
                Last-Event-ID for resumption.
              </td>
              <td className="p-3">
                No built-in reconnection. Client library must implement
                reconnect logic, heartbeat, and deduplication.
              </td>
              <td className="p-3">
                Inherent in the polling model. Each poll is independent; failed
                polls are simply retried.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Overhead</strong>
              </td>
              <td className="p-3">
                Low overhead: one persistent HTTP connection. Text-based
                framing. No binary overhead.
              </td>
              <td className="p-3">
                Minimal framing overhead (2-14 bytes per frame). Binary frames
                are more efficient than text.
              </td>
              <td className="p-3">
                High overhead: repeated HTTP request headers for each poll.
                Connection setup/teardown cost per poll cycle.
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Scaling</strong>
              </td>
              <td className="p-3">
                Connection-bound. Each client holds one server connection.
                Requires pub/sub for multi-instance.
              </td>
              <td className="p-3">
                Connection-bound. Same scaling constraints as SSE. Requires
                session affinity or pub/sub.
              </td>
              <td className="p-3">
                Stateless. Each poll is an independent HTTP request. Easiest to
                scale horizontally.
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          The production reality is that SSE is the right default choice for
          most server-to-client streaming needs. Its built-in reconnection,
          native browser support, and HTTP compatibility make it operationally
          simpler than WebSockets for the majority of use cases. WebSockets
          become necessary when bidirectional communication is frequent (not
          occasional), when binary data must be transmitted efficiently, or when
          sub-millisecond latency is required. Long-polling should be used only
          as a fallback for environments where persistent connections are
          impossible (such as restrictive corporate firewalls) or when event
          frequency is so low that maintaining a persistent connection is
          wasteful.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Always implement explicit event ID tracking on the server side. The
          event ID should be a monotonically increasing identifier that the
          server can use to determine which events a reconnecting client has
          missed. Store events in a durable log (such as a database table, a
          Redis stream, or a Kafka topic) with a retention period that covers the
          maximum expected reconnection window. When a client reconnects with a
          Last-Event-ID header, replay all events that occurred after that ID
          before resuming the live stream. The replay must happen before new
          events are sent to ensure ordering is preserved.
        </p>
        <p>
          Send heartbeat messages at intervals shorter than the shortest proxy
          timeout in your deployment path. A 15-second heartbeat interval is a
          reasonable default that works through most proxy configurations. The
          heartbeat should be an SSE comment line (starting with a colon) rather
          than a typed event, so that it does not trigger application-level event
          handlers on the client. Monitor the number of open SSE connections per
          server instance and set a connection admission limit. When the limit is
          reached, reject new connections with a 503 status code and instruct
          the client to retry after a delay. Without admission control, a traffic
          surge can exhaust file descriptors and crash the server, dropping all
          existing connections simultaneously.
        </p>
        <p>
          Use HTTP/2 for SSE connections when possible. HTTP/2 multiplexing means
          that multiple SSE streams from the same origin can share a single TCP
          connection, reducing connection overhead and avoiding the browser&apos;s
          per-origin connection limit (which is six concurrent connections for
          HTTP/1.1). This is particularly important when a single page opens SSE
          connections to multiple endpoints. However, ensure that your load
          balancer and any intermediate proxies support HTTP/2 streaming
          responses, as some older implementations buffer the entire response
          before forwarding it, which defeats the purpose of SSE.
        </p>
        <p>
          Implement per-client backpressure by monitoring the write buffer size
          for each SSE connection. If a client is slow to consume events (due to
          a slow network, a busy main thread in the browser, or intentional
          throttling), the server&apos;s write buffer for that client will grow.
          If unchecked, this can exhaust server memory. The server should either
          drop events for slow clients (acceptable for real-time data where
          staleness is tolerable) or disconnect the client and let it reconnect
          with a fresh state. Never allow unbounded buffer growth on SSE
          connections.
        </p>
        <p>
          Design event payloads to be self-contained and idempotent. Because SSE
          provides at-least-once delivery, a client may receive the same event
          twice during a reconnection. Each event should carry a unique
          identifier that the client can use to deduplicate. The event payload
          should contain all the information the client needs to process the
          event, without requiring a follow-up request. This is especially
          important during reconnection, when the client may be processing a
          backlog of events and should not need to make additional requests to
          understand each one.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most common pitfall is failing to account for intermediary behavior.
          NGINX, by default, buffers responses from upstream servers, which means
          it will not forward SSE events to the client until the buffer is full
          or the connection closes. This can be fixed by setting
          proxy_buffering off in the NGINX configuration, but this configuration
          is often overlooked during deployment. Similarly, AWS Application Load
          Balancer has a default idle timeout of 60 seconds, which will terminate
          SSE connections that do not send data within that window. Cloudflare
          has a 100-second timeout for HTTP responses on free and pro plans.
          Each of these intermediaries requires specific configuration to
          support SSE, and the configurations are platform-specific, making it
          easy to miss one during a migration.
        </p>
        <p>
          Another frequent error is neglecting the event ID and reconnection
          logic entirely. Many initial SSE implementations omit event IDs and
          simply stream events without tracking what each client has received.
          This works in development and small-scale testing, but in production,
          when connections drop (and they will drop — network interruptions,
          server deployments, and client-side tab suspension all cause
          disconnections), clients lose events silently. The result is
          inconsistent state on the client side, which manifests as missing
          notifications, stale dashboard data, or incomplete audit logs. The fix
          is to implement event IDs and a server-side event log from day one,
          not as an afterthought.
        </p>
        <p>
          Connection exhaustion is a scaling pitfall that catches teams by
          surprise. Each SSE connection consumes a file descriptor, a small
          amount of memory for the connection state, and a goroutine or async
          task for the event loop. At low connection counts, this is negligible.
          At tens of thousands of connections, it becomes significant. At hundreds
          of thousands, it becomes the primary scaling constraint. Teams that do
          not monitor connection counts per instance and set admission limits
          will experience cascading failures when a traffic surge exhausts file
          descriptors, causing the server to reject new connections and, in some
          cases, crash entirely.
        </p>
        <p>
          Using SSE for high-frequency, bidirectional communication is a
          architectural mismatch. SSE is designed for server-to-client streaming
          at moderate frequencies (up to a few events per second). If your use
          case requires the client to send frequent updates to the server (such
          as cursor positions in a collaborative editor, or rapid user input in
          a game), SSE will force you to make separate HTTP requests for each
          client-to-server message, which introduces latency and connection
          overhead. In these cases, WebSockets are the correct tool, and using
          SSE will result in a suboptimal user experience and unnecessary
          infrastructure complexity.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          GitHub uses SSE for its real-time notification system, pushing
          notifications about pull request reviews, issue comments, and workflow
          runs to the web interface. The unidirectional nature of notifications
          (the server has information to push to the client, but the client does
          not need to send data back on the same channel) makes SSE an ideal
          fit. GitHub also uses SSE for its live update feature on repository
          pages, showing real-time changes to branch activity and deployment
          status.
        </p>
        <p>
          Stripe uses SSE for its webhook event delivery system, pushing payment
          events, subscription updates, and fraud alerts to merchant dashboards
          in real time. The event ID mechanism is critical here: payment events
          must not be lost, and the Last-Event-ID reconnection ensures that if a
          merchant&apos;s connection drops during a high-volume period (such as
          Black Friday), they will receive all missed events upon reconnection.
          Stripe also uses SSE for its CLI tool, allowing developers to tail
          webhook events in their terminal during development.
        </p>
        <p>
          Large language model interfaces, such as those used by ChatGPT and
          similar services, use SSE (or SSE-compatible streaming) to deliver
          token-by-token generation results to the client. As the model generates
          each token, it is sent as an SSE event, allowing the client to display
          the response incrementally rather than waiting for the entire response
          to complete. This use case highlights SSE&apos;s strength: a
          unidirectional stream of text events with natural backpressure (the
          model generates tokens at a fixed rate, so the server does not
          overwhelm the client).
        </p>
        <p>
          Financial trading platforms use SSE for real-time market data
          distribution to web-based trading dashboards. Stock prices, order book
          updates, and trade confirmations are streamed to connected clients via
          SSE. The at-least-once delivery guarantee is essential in this context:
          missing a price update could lead to incorrect trading decisions.
          Financial services typically combine SSE for the public data feed with
          WebSockets or gRPC for order submission, where bidirectional
          communication is required.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">
              Q: How does SSE reconnection work, and what role does the
              Last-Event-ID header play?
            </p>
            <p className="mt-2 text-sm">
              A: When an SSE connection drops, the browser automatically attempts
              to reconnect after a delay (default 3 seconds, configurable via the
              retry field). On reconnection, the browser includes an Last-Event-ID
              HTTP header containing the ID of the last event it successfully
              received. The server uses this ID to determine which events the
              client missed and replays them before resuming the live stream. This
              mechanism provides at-least-once delivery: events may be duplicated
              if the acknowledgment was lost, but they will not be skipped. The
              server must maintain an event log with sufficient retention to cover
              the maximum expected reconnection delay.
            </p>
          </div>

          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">
              Q: Why do SSE connections fail through proxies, and how do you
              prevent it?
            </p>
            <p className="mt-2 text-sm">
              A: Proxies and load balancers interpret idle HTTP connections as
              dead and terminate them after a configurable idle timeout. NGINX
              defaults to buffering upstream responses (fixable with proxy_buffering
              off). AWS ALB has a 60-second idle timeout. Cloudflare has a
              100-second response timeout. The prevention strategy is twofold:
              first, send heartbeat messages (SSE comment lines starting with
              &apos;:&apos;) at an interval shorter than the shortest proxy timeout
              in your path — typically 15 seconds. Second, ensure your proxy
              configuration is correct: disable response buffering, increase idle
              timeouts for SSE endpoints, and verify that chunked transfer
              encoding is not being converted to a buffered response.
            </p>
          </div>

          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">
              Q: How do you scale SSE across multiple server instances?
            </p>
            <p className="mt-2 text-sm">
              A: Each server instance maintains its own set of SSE connections to
              clients, but events must reach all clients regardless of which
              instance they are connected to. The solution is to use a pub/sub
              backbone (Redis Pub/Sub, Kafka, or NATS) as the event distribution
              layer. When an event is produced, it is published to the pub/sub
              system, which delivers it to all subscribed server instances. Each
              instance filters the events and forwards only the relevant ones to
              its locally connected clients. For multi-instance scaling, you also
              need session affinity or a consistent routing strategy if clients
              need to reconnect to the same instance for stateful replay. The
              pub/sub approach decouples event production from connection
              management, enabling horizontal scaling.
            </p>
          </div>

          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">
              Q: When should you choose SSE over WebSockets for a real-time
              feature?
            </p>
            <p className="mt-2 text-sm">
              A: Choose SSE when the communication pattern is predominantly or
              exclusively server-to-client, when you need built-in reconnection
              with event replay, when you want to leverage existing HTTP
              infrastructure (proxies, load balancers, CDNs) without special
              configuration, and when text-based events are sufficient. Choose
              WebSockets when you need frequent bidirectional communication (not
              occasional client-to-server requests), when binary data transmission
              is required, when sub-millisecond latency is critical, or when the
              application is a game or collaborative editor where both sides send
              data at high frequency. For a notification feed, a live dashboard,
              or AI token streaming, SSE is the better choice. For a multiplayer
              game, a collaborative document editor, or a real-time trading
              terminal with rapid order entry, WebSockets are necessary.
            </p>
          </div>

          <div className="rounded-lg bg-panel-soft p-6">
            <p className="font-semibold">
              Q: How do you handle backpressure in an SSE system where a client
              is consuming events slower than they are produced?
            </p>
            <p className="mt-2 text-sm">
              A: The server must monitor the write buffer size for each SSE
              connection and take action when it exceeds a threshold. Two
              strategies are common: (1) Drop events for slow clients — this is
              acceptable for real-time data where the latest value supersedes
              previous values (such as a stock price or a CPU metric). The server
              discards buffered events and sends only the most recent one. (2)
              Disconnect the client — the server closes the SSE connection, and
              the client automatically reconnects with a Last-Event-ID, receiving
              a fresh stream of events. The choice depends on whether event loss
              is acceptable for the use case. For notification systems where every
              event matters, the server should never drop events; instead, it
              should disconnect slow clients and let them reconnect, potentially
              with a reduced event subscription (such as subscribing to a
              summary stream rather than the full event stream).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://html.spec.whatwg.org/multipage/server-sent-events.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              HTML Living Standard — Server-Sent Events Specification (WHATWG)
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN Web Docs — Server-Sent Events and the EventSource API
            </a>
          </li>
          <li>
            <a
              href="https://www.nginx.com/blog/nginx-and-server-sent-events-sse/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              NGINX Blog — Configuring NGINX for Server-Sent Events
            </a>
          </li>
          <li>
            <a
              href="https://stripe.com/blog/server-sent-events"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stripe Engineering — Using Server-Sent Events at Scale
            </a>
          </li>
          <li>
            <a
              href="https://github.com/dunglas/mercure"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mercure — Real-Time Event Broadcasting over SSE
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
