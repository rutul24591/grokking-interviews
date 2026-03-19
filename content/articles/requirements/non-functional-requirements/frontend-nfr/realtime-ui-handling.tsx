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
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-15",
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
        <h2>Definition & Context</h2>
        <p>
          <strong>Real-Time UI Handling</strong> encompasses patterns for
          displaying live, updating data without user refresh. This includes
          chat messages, notifications, collaborative editing, live feeds, stock
          prices, sports scores, and presence indicators (who&apos;s online).
        </p>
        <p>
          For staff engineers, real-time UI involves trade-offs between
          freshness, performance, battery life, and complexity. Push-based
          (WebSockets, SSE) is efficient for frequent updates. Poll-based is
          simpler but wasteful. The right choice depends on update frequency,
          latency requirements, and infrastructure constraints.
        </p>
        <p>
          <strong>Real-time use cases:</strong>
        </p>
        <ul>
          <li>
            <strong>Chat/Messaging:</strong> Instant message delivery, typing
            indicators
          </li>
          <li>
            <strong>Notifications:</strong> Push notifications, in-app alerts
          </li>
          <li>
            <strong>Collaborative editing:</strong> Google Docs, Figma, Miro
          </li>
          <li>
            <strong>Live feeds:</strong> Social media feeds, news tickers
          </li>
          <li>
            <strong>Presence:</strong> Online status, &quot;user is typing&quot;
          </li>
          <li>
            <strong>Live data:</strong> Stock prices, sports scores, auctions
          </li>
          <li>
            <strong>IoT dashboards:</strong> Sensor data, monitoring
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-Time Communication Protocols</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">WebSockets</h3>
        <ul className="space-y-2">
          <li>
            <strong>Protocol:</strong> Full-duplex, bidirectional communication
          </li>
          <li>
            <strong>Connection:</strong> Persistent TCP connection
          </li>
          <li>
            <strong>Latency:</strong> Very low (no request overhead)
          </li>
          <li>
            <strong>Efficiency:</strong> Efficient for frequent updates
          </li>
          <li>
            <strong>Browser support:</strong> 98%+
          </li>
          <li>
            <strong>Use when:</strong> Bidirectional, frequent updates, low
            latency needed
          </li>
          <li>
            <strong>Libraries:</strong> Socket.IO, ws, SignalR
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Server-Sent Events (SSE)
        </h3>
        <ul className="space-y-2">
          <li>
            <strong>Protocol:</strong> Server-to-client only (unidirectional)
          </li>
          <li>
            <strong>Connection:</strong> HTTP-based, persistent
          </li>
          <li>
            <strong>Latency:</strong> Low
          </li>
          <li>
            <strong>Efficiency:</strong> Efficient for server-push scenarios
          </li>
          <li>
            <strong>Browser support:</strong> 95%+ (not IE, limited mobile)
          </li>
          <li>
            <strong>Use when:</strong> Server pushes updates, client
            doesn&apos;t need to send
          </li>
          <li>
            <strong>Native API:</strong> EventSource
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Long Polling</h3>
        <ul className="space-y-2">
          <li>
            <strong>Protocol:</strong> HTTP request held open until data
            available
          </li>
          <li>
            <strong>Connection:</strong> Request/response, but long-lived
          </li>
          <li>
            <strong>Latency:</strong> Medium (request overhead)
          </li>
          <li>
            <strong>Efficiency:</strong> Better than short polling, worse than
            WebSockets
          </li>
          <li>
            <strong>Browser support:</strong> Universal
          </li>
          <li>
            <strong>Use when:</strong> Fallback for WebSockets, moderate update
            frequency
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Short Polling</h3>
        <ul className="space-y-2">
          <li>
            <strong>Protocol:</strong> Periodic HTTP requests
          </li>
          <li>
            <strong>Connection:</strong> Standard request/response
          </li>
          <li>
            <strong>Latency:</strong> High (up to poll interval)
          </li>
          <li>
            <strong>Efficiency:</strong> Wasteful (many empty responses)
          </li>
          <li>
            <strong>Browser support:</strong> Universal
          </li>
          <li>
            <strong>Use when:</strong> Simple implementation, infrequent updates
            acceptable
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/realtime-protocols-comparison.svg"
          alt="Real-Time Protocols Comparison"
          caption="Real-time communication protocols — WebSockets, SSE, long polling, and short polling with latency and efficiency comparison"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Protocol Selection Matrix
        </h3>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Use Case</th>
              <th className="p-3 text-left">Recommended Protocol</th>
              <th className="p-3 text-left">Rationale</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">Chat/Messaging</td>
              <td className="p-3">WebSockets</td>
              <td className="p-3">Bidirectional, low latency</td>
            </tr>
            <tr>
              <td className="p-3">Live notifications</td>
              <td className="p-3">SSE or WebSockets</td>
              <td className="p-3">Server-push, efficient</td>
            </tr>
            <tr>
              <td className="p-3">Live scores/prices</td>
              <td className="p-3">SSE</td>
              <td className="p-3">Server-push only, simple</td>
            </tr>
            <tr>
              <td className="p-3">Collaborative editing</td>
              <td className="p-3">WebSockets</td>
              <td className="p-3">Bidirectional, very low latency</td>
            </tr>
            <tr>
              <td className="p-3">Status checks</td>
              <td className="p-3">Short polling</td>
              <td className="p-3">Simple, infrequent updates</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>WebSocket Implementation</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Connection Management
        </h3>
        <ul className="space-y-2">
          <li>Connect on app load or when needed</li>
          <li>Handle connection lifecycle (open, close, error)</li>
          <li>Implement reconnection with exponential backoff</li>
          <li>Queue messages while disconnected</li>
          <li>Flush queue on reconnection</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Message Protocol</h3>
        <ul className="space-y-2">
          <li>Define message types (CHAT, NOTIFICATION, PRESENCE)</li>
          <li>Include metadata (timestamp, sender, type)</li>
          <li>Use JSON for payload</li>
          <li>Include sequence numbers for ordering</li>
          <li>Acknowledge important messages</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          State Management Integration
        </h3>
        <ul className="space-y-2">
          <li>Dispatch WebSocket messages to store (Redux, Zustand)</li>
          <li>Update UI reactively on state changes</li>
          <li>Handle optimistic updates</li>
          <li>Sync WebSocket state with server state (React Query)</li>
          <li>Clean up subscriptions on unmount</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Scaling Considerations
        </h3>
        <ul className="space-y-2">
          <li>WebSocket connections are stateful (sticky sessions needed)</li>
          <li>Use Redis Pub/Sub for multi-server setups</li>
          <li>Consider managed services (Pusher, Ably, Supabase Realtime)</li>
          <li>Monitor connection count and message throughput</li>
          <li>Implement connection limits per user</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/websocket-architecture.svg"
          alt="WebSocket Architecture"
          caption="WebSocket architecture — connection management, message flow, reconnection, and state management integration"
        />
      </section>

      <section>
        <h2>UI Patterns for Real-Time Updates</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Live Feeds</h3>
        <ul className="space-y-2">
          <li>Prepend new items to feed (chat, notifications)</li>
          <li>Show &quot;new messages&quot; indicator if scrolled away</li>
          <li>Auto-scroll to bottom for chat (with opt-out)</li>
          <li>Batch rapid updates (prevent flickering)</li>
          <li>Virtualize long lists for performance</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Presence Indicators</h3>
        <ul className="space-y-2">
          <li>Show online/offline status</li>
          <li>&quot;User is typing...&quot; indicators</li>
          <li>&quot;User was here X minutes ago&quot;</li>
          <li>Debounce typing indicators (prevent flicker)</li>
          <li>Respect privacy settings (invisible mode)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Optimistic Updates</h3>
        <ul className="space-y-2">
          <li>Update UI immediately on user action</li>
          <li>Send to server in background</li>
          <li>Rollback on error</li>
          <li>Show pending state (spinner, grayed out)</li>
          <li>Use React Query mutations for automatic handling</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Conflict Indicators</h3>
        <ul className="space-y-2">
          <li>Show when data is being edited by others</li>
          <li>Highlight conflicting changes</li>
          <li>Provide merge UI when needed</li>
          <li>Show &quot;someone else updated this&quot; notification</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Connection Status</h3>
        <ul className="space-y-2">
          <li>Show connection status indicator</li>
          <li>&quot;Reconnecting...&quot; during reconnection</li>
          <li>&quot;You&apos;re offline&quot; when disconnected</li>
          <li>Queue actions while offline</li>
          <li>Sync when reconnected</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/realtime-ui-patterns.svg"
          alt="Real-Time UI Patterns"
          caption="Real-time UI patterns — live feeds, presence indicators, optimistic updates, and connection status"
        />
      </section>

      <section>
        <h2>Performance Considerations</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Message Throttling</h3>
        <ul className="space-y-2">
          <li>Limit message rate from server</li>
          <li>Batch rapid updates (e.g., stock prices)</li>
          <li>Use requestAnimationFrame for UI updates</li>
          <li>Throttle typing indicators (100-200ms)</li>
          <li>Debounce non-critical updates</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Data Efficiency</h3>
        <ul className="space-y-2">
          <li>Send deltas, not full state</li>
          <li>Compress large messages</li>
          <li>
            Use binary protocols (MessagePack, Protocol Buffers) for high-volume
          </li>
          <li>Unsubscribe from unused channels</li>
          <li>Implement pagination for historical data</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Battery Impact</h3>
        <ul className="space-y-2">
          <li>WebSockets keep radio active (battery drain)</li>
          <li>Use push notifications for infrequent updates</li>
          <li>Disconnect when app is backgrounded</li>
          <li>Reconnect on foreground</li>
          <li>Consider SSE (more battery-friendly than polling)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Memory Management</h3>
        <ul className="space-y-2">
          <li>Limit message history in memory</li>
          <li>Prune old messages</li>
          <li>Clean up event listeners on unmount</li>
          <li>Close WebSocket connections properly</li>
          <li>Monitor memory usage in long sessions</li>
        </ul>
      </section>

      <section>
        <h2>Error Handling and Resilience</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Reconnection Strategy
        </h3>
        <ul className="space-y-2">
          <li>Exponential backoff (1s, 2s, 4s, 8s, max 30s)</li>
          <li>Add jitter to prevent thundering herd</li>
          <li>Reset backoff on successful connection</li>
          <li>Give up after N attempts, show error to user</li>
          <li>Provide manual reconnect button</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Message Reliability</h3>
        <ul className="space-y-2">
          <li>Acknowledge important messages</li>
          <li>Retry unacknowledged messages</li>
          <li>Use sequence numbers for ordering</li>
          <li>Handle out-of-order delivery</li>
          <li>Detect and handle duplicates</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Graceful Degradation
        </h3>
        <ul className="space-y-2">
          <li>Fallback to polling if WebSockets fail</li>
          <li>Queue actions while offline</li>
          <li>Show stale data with &quot;may be outdated&quot; indicator</li>
          <li>Allow manual refresh</li>
          <li>Sync when reconnected</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: When would you use WebSockets vs SSE vs polling?
            </p>
            <p className="mt-2 text-sm">
              A: WebSockets for bidirectional, frequent updates (chat,
              collaborative editing). SSE for server-push only (notifications,
              live feeds) — simpler than WebSockets. Long polling as WebSocket
              fallback. Short polling for infrequent updates where simplicity
              matters more than efficiency. Consider battery impact,
              infrastructure complexity, and browser support.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle WebSocket reconnection?
            </p>
            <p className="mt-2 text-sm">
              A: Exponential backoff (1s, 2s, 4s, 8s, max 30s) with jitter.
              Queue messages while disconnected. Flush queue on reconnection.
              Reset backoff on success. After N failed attempts, show error and
              provide manual reconnect. Handle connection state in UI
              (connected, reconnecting, offline).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you optimize real-time UI performance?
            </p>
            <p className="mt-2 text-sm">
              A: Throttle rapid updates (typing indicators, stock prices). Batch
              messages. Use requestAnimationFrame for UI updates. Virtualize
              long lists. Send deltas not full state. Limit message history in
              memory. Disconnect when app backgrounded. Use binary protocols for
              high-volume data.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle message ordering and duplicates?
            </p>
            <p className="mt-2 text-sm">
              A: Include sequence numbers or timestamps in messages. Buffer and
              reorder on client. Acknowledge messages server-side. Detect
              duplicates by sequence number. Use idempotent operations where
              possible. For critical ordering, use single-threaded processing or
              consensus protocols.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are the challenges of scaling WebSockets?
            </p>
            <p className="mt-2 text-sm">
              A: WebSockets are stateful — need sticky sessions or shared state.
              Use Redis Pub/Sub for multi-server message broadcasting. Monitor
              connection count (each connection uses resources). Implement
              connection limits. Consider managed services (Pusher, Ably) for
              scale. Handle server restarts gracefully (reconnection storm
              prevention).
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
              Socket.IO — WebSocket Library
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
        </ul>
      </section>
    </ArticleLayout>
  );
}
