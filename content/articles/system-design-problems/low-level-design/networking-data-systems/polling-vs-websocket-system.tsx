"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-polling-vs-websocket-system",
  title: "Design a Polling vs WebSocket System",
  description:
    "Architecture for choosing between polling and WebSockets based on latency, throughput, and resource constraints. Hybrid approaches for real-time updates.",
  category: "low-level-design",
  subcategory: "networking-data-systems",
  slug: "polling-vs-websocket-system",
  wordCount: 6900,
  readingTime: 41,
  lastUpdated: "2026-05-06",
  tags: [
    "lld",
    "polling",
    "websockets",
    "real-time",
    "latency",
    "resource-management",
  ],
  relatedTopics: [
    "data-fetching-hook",
    "backend-network-communication",
    "rate-limited-autocomplete",
  ],
};

export default function PollingVsWebSocketSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">
          App needs real-time updates. User opens chat (messages arrive instantly), stock ticker (prices update every second), email notifications (updates every minute). Three options: (1) Polling—frontend repeatedly asks server "any new messages?" every 1-30 seconds. Simpler, works over HTTP. Con: latency (up to 30s delay), wasted requests if no new data, high bandwidth. (2) WebSockets—persistent bidirectional connection. Server pushes updates instantly. Low latency, efficient. Con: complex (manage connections, fallbacks), more infrastructure required. (3) Server-Sent Events (SSE)—server pushes to client, simpler than WebSockets but one-way only.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Which to use? Chat needs sub-second latency → WebSocket. Email notifications can tolerate 1-minute delay → polling acceptable. Stock ticker needs 1-5 second updates → WebSocket better, but polling possible with careful tuning. Decision matrix: latency requirement, throughput, infrastructure support, complexity tolerance.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Hybrid approach: WebSockets for critical real-time, polling fallback when WebSocket fails (network, browser doesn't support). Graceful degradation: if server doesn't support WebSockets, fall back to polling automatically.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Explicit assumptions:</strong> Multiple features with different latency needs. Infrastructure can support both HTTP and WebSockets. Fallback handling needed. Network may be unreliable. Browser support for WebSockets assumed, but fallback needed for older browsers.
        </HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Polling Mode:</strong> Repeatedly fetch data via HTTP GET at
            configurable intervals.
          </HighlightBlock>
          <li>
            <strong>WebSocket Mode:</strong> Establish persistent connection, receive
            server-pushed updates.
          </li>
          <li>
            <strong>Adaptive Selection:</strong> Choose mode based on feature
            requirements, network conditions.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Fallback Mechanism:</strong> If WebSocket fails, fall back to
            polling.
          </HighlightBlock>
          <li>
            <strong>Reconnection:</strong> Auto-reconnect on connection loss with
            exponential backoff.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial">
            <strong>Latency:</strong> Polling adds N seconds delay (poll interval).
            WebSockets add ~100ms (network RTT).
          </HighlightBlock>
          <li>
            <strong>Throughput:</strong> WebSockets efficient for many updates.
            Polling wastes bandwidth on empty responses.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Resource Usage:</strong> WebSockets consume connection resources
            (file descriptors, memory). Polling stateless.
          </HighlightBlock>
          <li>
            <strong>Scalability:</strong> WebSockets harder to scale (state on server).
            Polling scales horizontally.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>WebSocket connects but network becomes unstable → reconnect loop.</li>
          <li>Poll interval too aggressive → overwhelming backend. Too lazy → stale data.</li>
          <HighlightBlock as="li" tier="important">Connection drops during update → re-fetch to ensure consistency.</HighlightBlock>
          <li>Server restarts while WebSocket connected → reconnect and resume.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">Polling makes HTTP requests at fixed intervals (e.g., every 5 seconds). WebSockets</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">establish a persistent connection and listen for server-pushed updates. Implement fallback: if WebSocket fails, switch to polling. Detect network changes and reconnect intelligently.</HighlightBlock>
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Polling Implementation</h3>
        <p>
          Polling fetches data at fixed intervals via HTTP GET.
        </p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial">
            <strong>Poll Interval:</strong> Configurable (e.g., 5s, 30s). Shorter
            interval = lower latency but higher load.
          </HighlightBlock>
          <li>
            <strong>Exponential Backoff:</strong> If no new data in N consecutive
            polls, increase interval. Once data arrives, reset interval.
          </li>
          <li>
            <strong>Request Deduplication:</strong> If poll request outstanding,
            don&apos;t send another. Wait for response.
          </li>
          <li>
            <strong>Conditional Requests:</strong> Use ETags or If-Modified-Since to
            avoid downloading unchanged data.
          </li>
          <li>
            <strong>Cancellation:</strong> Stop polling when component unmounts.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">WebSocket Implementation</h3>
        <p>
          WebSockets establish a persistent bidirectional connection.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Connection Lifecycle:</strong> Open, send/receive, close.
          </li>
          <li>
            <strong>Message Format:</strong> JSON payloads with type, data, timestamp.
          </li>
          <li>
            <strong>Heartbeat:</strong> Send periodic heartbeat (ping) to detect dead
            connections.
          </li>
          <li>
            <strong>Reconnection:</strong> Auto-reconnect with exponential backoff on
            disconnect.
          </li>
          <li>
            <strong>Message Ordering:</strong> Guarantee FIFO delivery (WebSocket
            protocol guarantees this).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Transport Selection Logic</h3>
        <p>
          Choose transport based on requirements.
        </p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Real-time Required (latency &lt; 1s):</strong> Use WebSocket, fall
            back to polling if unavailable.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Near Real-time (latency 1-30s):</strong> Use polling with 5-10s
            interval.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Low Frequency Updates (latency &gt; 30s):</strong> Use polling with
            30s+ interval or manual refresh.
          </HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Fallback Mechanism</h3>
        <p>
          If WebSocket fails to establish or drops, fall back to polling.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Connection Attempt:</strong> Try WebSocket first. Set timeout (5s).
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Failure Detection:</strong> If timeout or error, mark WebSocket
            unavailable.
          </HighlightBlock>
          <li>
            <strong>Fallback to Polling:</strong> Start polling with default interval.
          </li>
          <li>
            <strong>Retry WebSocket:</strong> Periodically retry WebSocket connection
            (e.g., every 30s).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Reconnection Strategy</h3>
        <p>
          Handle connection loss gracefully with exponential backoff.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Exponential Backoff:</strong> Retry delays: 1s, 2s, 4s, 8s, 16s,
            32s (capped).
          </li>
          <li>
            <strong>Jitter:</strong> Add random jitter (±50%) to avoid thundering herd
            if many clients reconnect simultaneously.
          </li>
          <li>
            <strong>Max Backoff:</strong> Cap at 5 minutes. Don&apos;t retry forever.
          </li>
          <li>
            <strong>Network Detection:</strong> Listen for online/offline events.
            Reconnect aggressively when network comes online.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Data Freshness</h3>
        <p>
          Ensure data consistency across polling and WebSocket modes.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Timestamps:</strong> Include timestamp in payloads. Detect and
            discard old updates.
          </li>
          <li>
            <strong>Version Numbers:</strong> Version data. Discard outdated versions.
          </li>
          <li>
            <strong>Reconciliation:</strong> When switching modes (WebSocket → polling),
            fetch latest to ensure consistency.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Resource Management</h3>
        <p>
          Monitor resource usage and optimize.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Connection Pooling:</strong> Share single WebSocket for multiple
            subscriptions (multiplex).
          </li>
          <li>
            <strong>Memory:</strong> WebSocket holds connection state. Limit active
            connections.
          </li>
          <li>
            <strong>Bandwidth:</strong> Polling wastes bandwidth on empty responses.
            Use conditional requests or delta encoding.
          </li>
        </ul>
      </section>

      <section>
        <h2>Implementation Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Browser Support</h3>
        <HighlightBlock as="p" tier="important">
          WebSocket is well-supported in modern browsers. Fallback via polling for
          legacy browsers.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Proxy Compatibility</h3>
        <HighlightBlock as="p" tier="important">
          Some proxies/firewalls block WebSocket. Detect WebSocket unavailability
          (timeout, connection refused) and fall back to polling.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing</h3>
        <HighlightBlock as="p" tier="crucial">
          Mock both transports. Test fallback by simulating WebSocket failure. Test
          reconnection via network condition simulation.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Monitoring</h3>
        <HighlightBlock as="p" tier="important">
          Track which transport is active, reconnection attempts, and data freshness
          lag.
        </HighlightBlock>
      </section>

      <section>
        <h2>Advanced Production Patterns</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Infrastructure Considerations</h3>
        <p>
          WebSockets require connection pooling, memory per connection, careful
          resource limits. Load balancer must support sticky sessions (route same
          client to same server). At 1M concurrent users, WebSocket infrastructure
          costs significant. Polling stateless, scales horizontally easier, cheaper
          at massive scale.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Hybrid Adaptive Strategy</h3>
        <HighlightBlock as="p" tier="important">
          Detect network capability: fast connection with low packet loss → WebSocket.
          Slow/unstable → polling. Detect backend capability: server supports
          WebSocket → use it; proxy blocks → fallback. Implement seamless fallback
          with identical API so client code doesn't change.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Message Ordering & Delivery Guarantees</h3>
        <p>
          WebSocket guarantees FIFO delivery. Polling doesn't (requests may return
          out of order). Use sequence numbers. Handle duplicates and out-of-order
          messages. At scale, message ordering becomes complex.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Backpressure & Flow Control</h3>
        <HighlightBlock as="p" tier="important">
          If client sends more messages than server processes, queue grows.
          Implement backpressure: pause sending when queue large. WebSocket backpressure
          via socket.pause(). Polling inherently backpressured (client-initiated).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Monitoring & Observability</h3>
        <HighlightBlock as="p" tier="important">
          Track connection state (connected, reconnecting, disconnected). Monitor
          reconnection frequency (indicates network issues). Track message latency.
          For polling: track request frequency, response times. Alert on high
          reconnection or stale data age exceeding SLA.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing Real-Time Systems</h3>
        <p>
          Simulate network conditions: latency, packet loss, disconnection. Test
          reconnection logic. Verify message ordering under concurrent messages.
          Chaos engineering: kill connection mid-message, verify recovery. Test both
          modes (polling and WebSocket) to ensure feature parity.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Multi-Region & CDN Considerations</h3>
        <HighlightBlock as="p" tier="crucial">
          WebSocket regional servers must coordinate (shared state via Redis).
          Geo-routing: route to nearest server. Polling geo-routing simpler (stateless).
          Cross-region data sync adds latency—real-time apps feel slow across regions.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Real-World Pitfalls</h3>
        <HighlightBlock as="p" tier="important">
          Common: WebSocket works in dev/office but fails in production (corporate
          proxy blocks). Fallback essential. Another: message queuing unbounded,
          app runs out of memory. Another: reconnection loop overwhelms server
          (thundering herd). Implement exponential backoff + jitter.
        </HighlightBlock>
      </section>

      <section>
        <h2>Architecture Patterns & Selection Matrix</h2>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/networking-data-systems/polling-vs-websocket-comparison.svg"
          alt="Polling vs WebSocket architecture comparison and decision matrix"
        />

        <HighlightBlock as="p" tier="crucial">Polling architecture is simple: client repeatedly requests data at intervals. Server stateless. Works over standard HTTP.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">WebSocket maintains persistent connection—server pushes updates instantly. Requires connection management and stateful servers.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Latency vs Scalability</h3>
        <HighlightBlock as="p" tier="crucial">
          WebSockets provide low latency but limit scalability (stateful connections).
          Polling scales horizontally but has higher latency.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Complexity vs Simplicity</h3>
        <HighlightBlock as="p" tier="important">
          WebSocket adds complexity (connection management, heartbeat, reconnection).
          Polling is simpler but wastes resources.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Use Cases</h3>
        <HighlightBlock as="p" tier="important">
          Chat, live scores, multiplayer games → WebSocket. Email, notifications →
          polling.
        </HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">Monitoring reconnection rates and message latency is essential. At scale, infrastructure costs heavily favor polling</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">(stateless), while user experience favors WebSocket (low latency). Most production systems implement both, intelligently detecting capabilities and switching seamlessly. Understanding these patterns is crucial for building reliable real-time applications.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
