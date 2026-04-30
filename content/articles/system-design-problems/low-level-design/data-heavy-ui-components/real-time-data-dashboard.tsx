"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-real-time-data-dashboard",
  title: "Design a Real-time Data Dashboard",
  description:
    "LLD for a real-time dashboard: WebSocket streaming, smooth chart updates, throttled rendering, reconnection, backpressure, and stale-data detection.",
  category: "low-level-design",
  subcategory: "data-heavy-ui-components",
  slug: "real-time-data-dashboard",
  wordCount: 6900,
  readingTime: 36,
  lastUpdated: "2026-04-29",
  tags: [
    "lld",
    "real-time",
    "dashboard",
    "websocket",
    "streaming",
    "react",
  ],
  relatedTopics: [
    "dashboard-builder",
    "client-side-data-normalization",
    "data-table",
  ],
};

export default function RealTimeDataDashboardArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
          We are designing a real-time data dashboard — a
          UI that streams metrics, charts, and table updates
          live from the backend, typically via WebSocket,
          and renders them smoothly without dropped frames
          or jarring redraws. The dashboard powers
          operations consoles (monitoring infrastructure
          health), trading floors (price ticks),
          observability tools (logs, traces, metrics in
          flight), and any product where users need to see
          state as it changes. The hard work is keeping the
          UI responsive while the data fire-hose pours in
          — backpressure, throttled rendering, reconnection
          logic, and clear stale-data signaling are all
          first-class concerns.
        </p>
        <p>
          The hard problems are: maintaining 60 fps
          rendering when updates arrive at 100+ per second;
          handling WebSocket disconnects with reconnection
          backoff and gap recovery; detecting stale data
          (the connection is alive but the server has
          stopped sending) and surfacing it; throttling
          rendering so a burst of updates doesn&rsquo;t
          stall the main thread; integrating with charting
          libraries that have their own update lifecycles;
          and pausing updates when the tab is hidden so we
          don&rsquo;t waste CPU.
        </p>

        <h3>User Context</h3>
        <p>
          Operators, traders, and analysts watch dashboards
          for hours. They expect smooth visual updates,
          immediate signaling when the connection is
          stale, and accurate timestamps on data points.
          Engineering teams consume the dashboard runtime
          by registering chart and table components that
          subscribe to streams; the runtime handles
          connection lifecycle and update throttling.
        </p>

        <h3>Assumptions</h3>
        <p>
          The backend exposes a WebSocket endpoint with
          structured messages (typically JSON or
          MessagePack). Subscriptions are named (e.g.
          &ldquo;cpu_usage&rdquo;,
          &ldquo;order_book.BTC&rdquo;); the client
          subscribes and receives updates for that stream.
          Updates are typically incremental
          (new data points, partial entity updates).
          Modern browsers; we use the WebSocket API,
          requestAnimationFrame for render scheduling, and
          Page Visibility API for tab-hidden detection.
        </p>

        <h3>Non-Goals</h3>
        <p>
          We do not implement the WebSocket server.
          We do not implement specific chart rendering
          (consumers use Chart.js, ECharts, or similar).
          We do not implement the dashboard layout
          (delegated to Dashboard Builder). We do not
          implement persistent historical data storage
          (consumed via separate REST endpoints).
        </p>
      </section>

      <section>
        <h2>⚙️ Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
          Single shared WebSocket connection that
          multiplexes subscriptions across all dashboard
          widgets. Subscribe and unsubscribe from streams
          declaratively. Buffer incoming updates between
          render frames; flush on
          <code> requestAnimationFrame</code>. Pause when
          the tab is hidden (Page Visibility API); resume
          on visible. Reconnection with exponential backoff
          on disconnect. Gap recovery: on reconnect, fetch
          missed data via REST and merge into streams.
          Stale-data detection: if no updates arrive
          within an expected interval, surface a warning.
          Connection status indicator (connected,
          reconnecting, disconnected, stale) visible in
          the UI.
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          Pause/resume controls per widget for users who
          want to study a frozen state. Replay mode that
          plays historical data at adjustable speed.
          Throttle controls per widget (high-frequency
          streams can update every Nth tick rather than
          every tick). Multi-region failover (connect to
          the nearest healthy region). Server-sent events
          fallback when WebSocket isn&rsquo;t available.
        </p>

        <h3>Out of Scope</h3>
        <p>
          Backend infrastructure, time-series storage,
          full alerting/notification systems, layout
          editing.
        </p>
      </section>

      <section>
        <h2>📊 Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          60 fps rendering even with 100+ updates per
          second across the dashboard. Memory bounded for
          long sessions: each widget maintains its own
          ring buffer of recent data points. WebSocket
          parsing happens off the critical render path.
        </p>

        <h3>Reliability</h3>
        <p>
          Reconnection always recovers cleanly. Stale-
          data state is unambiguous to users.
          Backpressure prevents update bursts from
          blocking the UI.
        </p>

        <h3>Security</h3>
        <p>
          WebSocket connections authenticate via session
          tokens passed during the handshake. Server
          enforces per-stream authorization. Client
          renders update content as text or via
          consumer-controlled renderers; no eval of
          server messages.
        </p>

        <h3>Accessibility</h3>
        <p>
          Connection status announces via live region.
          Stale-data warnings are accessible. Charts
          should have text-equivalent summaries (a
          consumer concern, but the runtime exposes the
          data needed).
        </p>

        <h3>Maintainability</h3>
        <p>
          A clean stream subscription API. Widgets
          subscribe via hooks; the runtime handles
          connection mechanics. New stream types are
          configuration changes.
        </p>
      </section>

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The dashboard is built around a <strong>shared
          WebSocket connection</strong> with multiplexed
          subscriptions, a <strong>frame-aligned update
          buffer</strong> that batches incoming messages
          for rendering, a <strong>connection lifecycle
          manager</strong> handling reconnect with
          backoff and gap recovery, and a
          <strong> stale-data detector</strong>.
        </p>
        <p>
          The <strong>shared connection</strong> is opened
          once per dashboard. All widgets subscribe to
          named streams via the connection; the server
          knows which streams the client wants and pushes
          their updates. This avoids the alternative of
          one WebSocket per widget, which doesn&rsquo;t
          scale and makes connection lifecycle hard to
          reason about. Subscriptions are reference-
          counted: when the last subscriber for a stream
          unmounts, we tell the server to stop pushing
          that stream.
        </p>
        <p>
          The <strong>update buffer</strong> sits between
          the WebSocket and the rendering layer. Incoming
          messages are decoded and pushed into a
          per-stream queue. On every
          <code> requestAnimationFrame</code> tick, we
          flush all queued updates to subscribers in a
          single batch. This is what keeps rendering
          smooth: if 50 updates arrive in 16 ms, they all
          flush in one frame, not 50 separate renders.
          Subscribers receive the batched updates and
          choose how to apply them (chart libraries
          typically have their own batched-update APIs;
          tables apply via the normalization layer; metric
          tiles update their displayed value).
        </p>
        <p>
          <strong>Reconnection</strong>: WebSocket
          disconnects trigger a reconnection attempt with
          exponential backoff (1s, 2s, 4s, …, capped at
          30s). The connection manager tracks an attempt
          count and resets on successful reconnect. While
          disconnected, the dashboard shows
          &ldquo;Reconnecting…&rdquo; in the connection
          status indicator. On reconnect, the manager
          asks the server for the timestamp of the last
          received update per stream (or the client
          tracks it locally) and fetches missed data via
          REST to fill the gap; subsequent live updates
          continue from the correct point.
        </p>
        <p>
          <strong>Stale-data detection</strong>: each
          stream has an expected update cadence (could be
          configured per stream or inferred). If no
          updates arrive within a multiple of that
          cadence (e.g. 3x), the connection manager marks
          the stream stale and surfaces a warning. This
          differs from disconnection — the connection is
          alive but the server isn&rsquo;t sending. Users
          should see this distinction explicitly.
        </p>
        <p>
          <strong>Page Visibility</strong>: when the tab
          becomes hidden, the manager either disconnects
          (for high-cost connections) or sends a pause
          message to the server (for sticky connections).
          The buffer continues to receive any remaining
          messages but doesn&rsquo;t flush to renderers
          until the tab becomes visible again. On
          visibility change, we may need to reconnect or
          fetch a gap fill, depending on policy.
        </p>
        <p>
          <strong>Throttling per widget</strong>: a
          high-frequency stream (e.g. trading prices at
          1000 updates/sec) might be more than the user
          can perceive. Per-widget throttling lets a
          widget say &ldquo;only flush updates to me at
          most 10 times per second&rdquo;, which the
          buffer respects. The widget still receives the
          most recent data, just not every intermediate.
          For dense charts that need every point, throttling
          is off; for tiles showing a single value, it&rsquo;s
          aggressive.
        </p>
      </section>

      <section>
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>WebSocketProvider</strong> manages the
          shared connection lifecycle.
          <strong> SubscriptionManager</strong> tracks
          per-stream subscribers and ref counts.
          <strong> UpdateBuffer</strong> batches incoming
          messages and flushes on RAF.
          <strong> ConnectionLifecycle</strong> handles
          reconnect, backoff, gap recovery.
          <strong> StaleDetector</strong> watches for
          quiet streams.
          <strong> useStream(name)</strong> is the hook
          consumers use to subscribe; it returns the
          current stream state and registers the
          consumer with the manager.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          Connection status and stream subscriptions live
          in an external store. Stream data lives per-
          stream in ring buffers (most recent N points)
          managed by individual widgets or the
          normalization layer for entity streams.
          Connection status drives the UI indicator.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Subscription:{" "}
          <code>{` useStream(name, options) → { data, status, lastUpdate } `}</code>.
          Server messages:{" "}
          <code>{` { type: "update", stream, payload, timestamp } `}</code>{" "}
          or
          <code>{` { type: "ack" | "error" | "pause" } `}</code>.
          Reconnect protocol: client sends last-known
          timestamps per stream; server replays missed
          updates via REST or pushes a snapshot.
        </p>
      </section>

      <section>
        <h2>⚡ Rendering &amp; Performance</h2>
        <p>
          The RAF-aligned flush is the central performance
          decision. Without it, individual updates would
          trigger React renders per message, easily
          exceeding the 16 ms frame budget under load.
          With it, all updates in a frame flush as one
          batch and React reconciles once. Per-widget
          throttling controls how often a widget receives
          flushes — high-cost charts can flush less often
          than their data arrives. Memory is bounded by
          per-stream ring buffers; old data points evict
          when the buffer is full.
        </p>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <p>
          Connection status pill is always visible —
          color-coded (green connected, yellow
          reconnecting, red disconnected, gray stale).
          Stale-data warning appears as a subtle banner
          with the affected stream and last-update time.
          Pause/resume per widget lets users freeze a
          state for inspection. Smooth chart animations
          on update use the chart library&rsquo;s
          animation features but capped at frame rate.
          Tab-hidden state shows a subtle indicator on
          return so users know the dashboard paused.
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          Connection status announces on change via live
          region. Stale-data warnings are accessible.
          Charts have text-equivalent summary tables
          (consumer responsibility but the runtime exposes
          the underlying data). Pause/resume controls are
          keyboard-accessible.
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          WebSocket connections authenticate via session
          tokens during handshake. Server enforces
          per-stream authorization; the client never
          subscribes successfully to streams it
          doesn&rsquo;t have permission for. Update
          content renders as text or via consumer
          renderers; never as raw HTML.
        </p>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <p>
          Unit tests for the update buffer (RAF-aligned
          flush correctness), subscription manager
          (ref-count semantics), reconnection backoff,
          stale detection. Integration tests with mock
          WebSocket: simulate disconnect, verify
          reconnect; simulate quiet stream, verify stale
          warning. Performance tests with simulated
          1000-updates-per-second load on a dashboard
          with 20 widgets, asserting 60 fps.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <p>
          Server pushes faster than client can render:
          per-widget throttling drops intermediate
          updates; the most recent always renders.
          Reconnect succeeds but server has rotated
          (lost session): full re-subscribe flow runs;
          gap fills via REST. Network partition that
          looks healthy from the client side (zombie
          connection): stale detection kicks in after
          the expected-cadence window. Tab backgrounded
          for hours: on resume, we may need to refetch
          a large gap; we surface progress and let the
          user opt to skip and start fresh. Multiple
          widgets subscribing to the same stream:
          ref-counted; the connection sends one stream
          and the buffer fans out. Server sends an
          unsubscribe error: we drop the subscription
          and surface the error to affected widgets.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <p>
          The WebSocket provider is reusable across
          dashboards. The update buffer pattern applies
          to any high-throughput stream. The subscription
          manager is generic over stream type.
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          Status labels, warnings, timestamps via i18n.
          Update payload content i18n is the consumer&rsquo;s
          concern.
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Shared connection vs per-widget connections</h3>
        <p>
          Shared connection scales (one socket per
          dashboard); per-widget connections multiply
          server load and complicate lifecycle. Shared
          is the right default; per-widget is rarely
          justified.
        </p>

        <h3>RAF-aligned flush vs immediate updates</h3>
        <p>
          RAF flush keeps rendering smooth under load;
          immediate updates trigger React renders per
          message and cascade into jank. RAF flush is
          essential for high-throughput dashboards.
        </p>

        <h3>WebSocket vs Server-Sent Events</h3>
        <p>
          WebSocket is bidirectional and has lower
          per-message overhead at high rates. SSE is
          simpler and works through more proxies but is
          one-way. For dashboards with bidirectional
          control (subscribe/unsubscribe, pause), WebSocket
          fits better. SSE is the fallback when WebSocket
          isn&rsquo;t available.
        </p>

        <h3>Disconnect on hidden tab vs sticky connection</h3>
        <p>
          Disconnecting saves server resources but adds
          reconnect latency on resume. Sticky connections
          stay open but waste resources for backgrounded
          tabs. Choose based on cost; we default to
          disconnect for high-fanout streams and sticky
          for low-traffic.
        </p>

        <h3>Stale detection by cadence vs heartbeat</h3>
        <p>
          Cadence-based (no updates within expected
          interval) detects server-side issues; heartbeat
          (server sends periodic pings) requires server
          cooperation but is more reliable. We use both
          when available — heartbeat for connection
          health, cadence for per-stream activity.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          Backend-side update aggregation (server
          combines high-frequency updates into batched
          messages, reducing wire traffic). WebTransport
          for lower-latency streams. Replay mode with
          adjustable speed. Multi-region failover.
          Smart prefetching of historical context when
          a widget mounts.
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. Why a shared WebSocket connection?</strong>{" "}
          Scales linearly with dashboards instead of
          widgets. Simpler lifecycle. Less server
          resource usage. The subscription manager
          multiplexes streams over the single connection.
        </p>

        <p>
          <strong>2. How do you keep rendering smooth at
          100+ updates per second?</strong> RAF-aligned
          flush: incoming messages buffer per-stream;
          on every frame, we flush the batch to
          subscribers. React reconciles once per frame,
          not per message.
        </p>

        <p>
          <strong>3. How does reconnection work?</strong>{" "}
          Exponential backoff (1s, 2s, 4s, capped at
          30s). On reconnect, fetch missed data via REST
          using last-known timestamps per stream; merge
          into streams; resume live updates.
        </p>

        <p>
          <strong>4. How do you detect stale data?</strong>{" "}
          Each stream has an expected cadence. If no
          update arrives within a multiple of that
          cadence (3x), mark stale and warn. Differs
          from disconnect — connection is alive,
          server isn&rsquo;t sending.
        </p>

        <p>
          <strong>5. What happens when the tab is
          hidden?</strong> Page Visibility API triggers
          pause: either disconnect or send a server-
          side pause. Buffer holds any remaining
          messages but doesn&rsquo;t flush to renderers.
          On resume, reconnect if needed and fill the
          gap.
        </p>

        <p>
          <strong>6. How is per-widget throttling
          implemented?</strong> Widgets declare a max
          update frequency. The buffer respects that
          per widget — high-frequency streams flush at
          the widget&rsquo;s capped rate, not the
          stream&rsquo;s actual rate. Most recent data
          always wins.
        </p>

        <p>
          <strong>7. How is the dashboard
          accessible?</strong> Status changes via live
          region. Charts have text-equivalent
          summaries. Pause/resume controls are keyboard
          accessible. Stale warnings announce.
        </p>

        <p>
          <strong>8. How does this integrate with charting
          libraries?</strong> The runtime delivers
          batched updates to widgets. The widget calls
          the chart library&rsquo;s batched-update API
          (most chart libraries have one). The runtime
          doesn&rsquo;t know about chart specifics; it
          just delivers data.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          A real-time dashboard is{" "}
          <strong>shared WebSocket + RAF-aligned update
          buffer + connection lifecycle manager</strong>.
          The shared connection scales; the buffer keeps
          rendering smooth under load; the lifecycle
          manager handles reconnection, gap recovery,
          and stale detection. Per-widget throttling
          controls cost; Page Visibility API pauses on
          hidden tabs. The result is a dashboard that
          stays at 60 fps under 100+ updates per second
          while clearly signaling connection state to
          users.
        </p>
      </section>
    </ArticleLayout>
  );
}
