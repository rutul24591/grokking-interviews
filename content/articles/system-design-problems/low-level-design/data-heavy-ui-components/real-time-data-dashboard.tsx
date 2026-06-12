"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { Highlight } from "@/components/articles/Highlight";
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

export default function RealTimeDataDashboardArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a Real-time Data Dashboard</h1><h2>Definition &amp; Context</h2><p>Design a Real-time Data Dashboard is an implementation-heavy low-level design problem covering snapshot bootstrap, stream merge, aggregation windows, render throttling, freshness indicators, reconnect, gap recovery, and widget isolation. A principal-level answer must define state ownership, consistency, lifecycle cleanup, scale limits, rollback, privacy, cost, and observability.</p><p>Separate authoritative data time from browser arrival time and render cadence. A dashboard may ingest quickly while projecting at a bounded frame rate. The core structures are baseline snapshot, event sequence, stream buffer, aggregation windows, widget subscriptions, render scheduler, freshness watermark, reconnect token, and gap detector.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/data-heavy-ui-components/real-time-data-dashboard-runtime.svg" alt="Design a Real-time Data Dashboard runtime" caption="Topic-specific data flow from input or payload through guarded projection." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific implementation mechanics.</p><section>
        <h3>🎯 Problem Context &amp; Scope Definition</h3>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="crucial">
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
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          Operators, traders, and analysts watch dashboards
          for hours. They expect smooth visual updates,
          immediate signaling when the connection is
          stale, and accurate timestamps on data points.
          Engineering teams consume the dashboard runtime
          by registering chart and table components that
          subscribe to streams; the runtime handles
          connection lifecycle and update throttling.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement the WebSocket server.
          We do not implement specific chart rendering
          (consumers use Chart.js, ECharts, or similar).
          We do not implement the dashboard layout
          (delegated to Dashboard Builder). We do not
          implement persistent historical data storage
          (consumed via separate REST endpoints).
        </HighlightBlock>
      </section>

      <section>
        <h3>Functional Requirements</h3>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          Pause/resume controls per widget for users who
          want to study a frozen state. Replay mode that
          plays historical data at adjustable speed.
          Throttle controls per widget (high-frequency
          streams can update every Nth tick rather than
          every tick). Multi-region failover (connect to
          the nearest healthy region). Server-sent events
          fallback when WebSocket isn&rsquo;t available.
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          Backend infrastructure, time-series storage,
          full alerting/notification systems, layout
          editing.
        </HighlightBlock>
      </section>

      <section>
        <h3>Non-Functional Requirements</h3>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          60 fps rendering even with 100+ updates per
          second across the dashboard. Memory bounded for
          long sessions: each widget maintains its own
          ring buffer of recent data points. WebSocket
          parsing happens off the critical render path.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          Reconnection always recovers cleanly. Stale-
          data state is unambiguous to users.
          Backpressure prevents update bursts from
          blocking the UI.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          WebSocket connections authenticate via session
          tokens passed during the handshake. Server
          enforces per-stream authorization. Client
          renders update content as text or via
          consumer-controlled renderers; no eval of
          server messages.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">
          Connection status announces via live region.
          Stale-data warnings are accessible. Charts
          should have text-equivalent summaries (a
          consumer concern, but the runtime exposes the
          data needed).
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          A clean stream subscription API. Widgets
          subscribe via hooks; the runtime handles
          connection mechanics. New stream types are
          configuration changes.
        </HighlightBlock>
      </section>

      <section>
        <h3>🧠 Solution Approach</h3>
        
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
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
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
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Stale-data detection</strong>: each
          stream has an expected update cadence (could be
          configured per stream or inferred). If no
          updates arrive within a multiple of that
          cadence (e.g. 3x), the connection manager marks
          the stream stale and surfaces a warning. This
          differs from disconnection — the connection is
          alive but the server isn&rsquo;t sending. Users
          should see this distinction explicitly.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Page Visibility</strong>: when the tab
          becomes hidden, the manager either disconnects
          (for high-cost connections) or sends a pause
          message to the server (for sticky connections).
          The buffer continues to receive any remaining
          messages but doesn&rsquo;t flush to renderers
          until the tab becomes visible again. On
          visibility change, we may need to reconnect or
          fetch a gap fill, depending on policy.
        </HighlightBlock>
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
        <h3>🧱 Component Architecture</h3>
        <HighlightBlock as="p" tier="crucial">ConnectionLifecycle handles reconnect, backoff, gap recovery. StaleDetector</HighlightBlock>
<HighlightBlock as="p" tier="important">watches for quiet streams. useStream(name) is the hook consumers use to subscribe;</HighlightBlock>
<HighlightBlock as="p" tier="important">it returns the current stream state and registers the consumer with the manager.</HighlightBlock>
      </section>

      <section>
        <h3>🔄 State Management</h3>
        <HighlightBlock as="p" tier="crucial">Connection status and stream subscriptions live
          in an external store. Stream data lives per-</HighlightBlock>
<HighlightBlock as="p" tier="important">stream in ring buffers (most recent N points)
          managed by individual widgets or the</HighlightBlock>
<HighlightBlock as="p" tier="important">normalization layer for entity streams.
          Connection status drives the UI indicator.</HighlightBlock>
      </section>

      <section>
        <h3>🔁 Data Flow &amp; Contracts</h3>
        <HighlightBlock as="p" tier="crucial">
          The contract must be resumable: every update is tagged with a stream id and a monotonic
          cursor/watermark so the client can reconnect and recover gaps safely.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Server messages include update events (stream identifier, payload, timestamp/cursor) plus
          control events like acknowledgements and errors, so the UI can show stale vs broken states.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          On reconnect, the client provides per-stream watermarks; the server replays missed updates
          or sends a snapshot, avoiding partial-state drift across widgets.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚡ Rendering &amp; Performance</h3>
        <HighlightBlock as="p" tier="crucial">Per-widget throttling controls how often a widget receives flushes —</HighlightBlock>
<HighlightBlock as="p" tier="important">high-cost charts can flush less often than their data arrives. Memory is bounded</HighlightBlock>
<HighlightBlock as="p" tier="important">by per-stream ring buffers; old data points evict when the buffer is full.</HighlightBlock>
      </section>

      <section>
        <h3>🎨 UX</h3>
        <HighlightBlock as="p" tier="crucial">Pause/resume per widget lets users freeze a state for inspection. Smooth chart</HighlightBlock>
<HighlightBlock as="p" tier="important">animations on update use the chart library&rsquo;s animation features but capped at frame rate.</HighlightBlock>
<HighlightBlock as="p" tier="important">Tab-hidden state shows a subtle indicator on return so users know the dashboard paused.</HighlightBlock>
      </section>

      <section>
        <h3>♿ Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">Connection status announces on change via live
          region. Stale-data warnings are accessible.</HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Charts need text-equivalent summaries (consumer responsibility, but the runtime exposes the
          underlying data), and pause/resume controls must be fully keyboard-accessible.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Don&rsquo;t spam assistive tech: rate-limit announcements (for example, only on state transitions),
          and ensure focus order is stable even as widgets update in real time.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔐 Security</h3>
        <HighlightBlock as="p" tier="crucial">WebSocket connections authenticate via session
          tokens during handshake. Server enforces
          per-stream</HighlightBlock>
<HighlightBlock as="p" tier="important">authorization; the client never
          subscribes successfully to streams it
          doesn&rsquo;t have</HighlightBlock>
<HighlightBlock as="p" tier="important">permission for. Update
          content renders as text or via consumer
          renderers; never as raw HTML.</HighlightBlock>
      </section>

      <section>
        <h3>🧪 Testing</h3>
        <HighlightBlock as="p" tier="important">
          Unit tests cover the update buffer (RAF-aligned flush correctness), subscription manager
          (ref-count semantics), reconnection backoff, and stale detection.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          E2E tests with a mock stream validate UI-level guarantees: stale banners, reconnect spinners,
          per-widget pause/resume, and that updates resume without duplicate or missing points.
        </HighlightBlock>
<HighlightBlock as="p" tier="crucial">Integration tests with mock
          WebSocket: simulate disconnect, verify
          reconnect; simulate quiet stream, verify stale
          warning. Performance tests with simulated
          1000-updates-per-second load on a dashboard
          with 20 widgets, asserting 60 fps.</HighlightBlock>
      </section>

      <section>
        <h3>🚨 Edge Cases</h3>
        <HighlightBlock as="p" tier="crucial">Tab backgrounded for hours: on resume, we may need to refetch a large gap; we surface progress and let the user opt to</HighlightBlock>
<HighlightBlock as="p" tier="important">skip and start fresh. Multiple widgets subscribing to the same stream: ref-counted; the connection sends one stream and</HighlightBlock>
<HighlightBlock as="p" tier="important">the buffer fans out. Server sends an unsubscribe error: we drop the subscription and surface the error to affected widgets.</HighlightBlock>
      </section>

      <section>
        <h3>🔁 Reusability</h3>
        <HighlightBlock as="p" tier="crucial">
          The shared connection + update-buffer pattern is reusable: it&rsquo;s a generic primitive for any
          high-throughput stream UI, not just dashboards.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Keep the subscription manager generic over stream type and payload codec so different products
          can reuse it (metrics, logs, collaboration cursors).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Expose the smallest stable API: <code>subscribe(name)</code>, <code>unsubscribe(name)</code>, and
          a consistent status model (connected/stale/error) so consumers don&rsquo;t fork logic.
        </HighlightBlock>
      </section>

      <section>
        <h3>🌍 Internationalization</h3>
        <HighlightBlock as="p" tier="crucial">
          Status labels, warnings, and error messages come from i18n; timestamps must respect locale
          and time zone while remaining comparable (show both absolute and relative when useful).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Avoid formatting in the transport: send canonical timestamps/cursors and format in the view layer
          to prevent server/client locale mismatches.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Update payload content i18n is the consumer&rsquo;s concern, but the runtime should preserve metadata
          (units, precision, currency) so formatting is correct in all locales.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚖️ Trade-offs</h3>

        <h3>Shared connection vs per-widget connections</h3>
        <HighlightBlock as="p" tier="important">
          Shared connection scales (one socket per
          dashboard); per-widget connections multiply
          server load and complicate lifecycle. Shared
          is the right default; per-widget is rarely
          justified.
        </HighlightBlock>

        <h3>RAF-aligned flush vs immediate updates</h3>
        <HighlightBlock as="p" tier="important">
          RAF flush keeps rendering smooth under load;
          immediate updates trigger React renders per
          message and cascade into jank. RAF flush is
          essential for high-throughput dashboards.
        </HighlightBlock>

        <h3>WebSocket vs Server-Sent Events</h3>
        <HighlightBlock as="p" tier="important">
          WebSocket is bidirectional and has lower
          per-message overhead at high rates. SSE is
          simpler and works through more proxies but is
          one-way. For dashboards with bidirectional
          control (subscribe/unsubscribe, pause), WebSocket
          fits better. SSE is the fallback when WebSocket
          isn&rsquo;t available.
        </HighlightBlock>

        <h3>Disconnect on hidden tab vs sticky connection</h3>
        <HighlightBlock as="p" tier="crucial">
          Disconnecting saves server resources but adds
          reconnect latency on resume. Sticky connections
          stay open but waste resources for backgrounded
          tabs. Choose based on cost; we default to
          disconnect for high-fanout streams and sticky
          for low-traffic.
        </HighlightBlock>

        <h3>Stale detection by cadence vs heartbeat</h3>
        <HighlightBlock as="p" tier="important">
          Cadence-based (no updates within expected
          interval) detects server-side issues; heartbeat
          (server sends periodic pings) requires server
          cooperation but is more reliable. We use both
          when available — heartbeat for connection
          health, cadence for per-stream activity.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔮 Future Improvements</h3>
        <HighlightBlock as="p" tier="crucial">Backend-side update aggregation (server
          combines high-frequency updates into batched
          messages, reducing wire traffic). WebTransport
          for lower-latency streams.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Replay mode with
          adjustable speed. Multi-region failover.
          Smart prefetching of historical context when
          a widget mounts.</Highlight></HighlightBlock>
      </section></section>
<section><h2>Architecture &amp; Flow</h2><p>Separate canonical data, user intent, transient projection, remote effects, and bounded telemetry. Every cursor, subscription, cache entry, request, timer, observer, and worker requires an explicit owner and cleanup path. Stable ids are mandatory because indexes and DOM nodes are disposable views.</p><p>Separate authoritative data time from browser arrival time and render cadence. A dashboard may ingest quickly while projecting at a bounded frame rate. Commit durable changes only after applying the current policy and preserve enough evidence to reconcile failure.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/data-heavy-ui-components/real-time-data-dashboard-recovery.svg" alt="Design a Real-time Data Dashboard recovery" caption="Recovery flow: validate versions, contain scale pressure, preserve stable truth, and explain the result." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Polling is simpler and predictable; streaming is justified when freshness matters enough to accept ordering, buffering, and reconnect complexity.</p><p>The event sequence and snapshot watermark are authoritative. UI rendering is a throttled projection; reconnect recovery replays from a known sequence or refreshes the snapshot. Scale pressure comes from high event rates, bursty streams, reconnect gaps, out-of-order events, expensive charts, hidden tabs, and stale widgets. Bound work, reject stale effects, cap memory, and degrade predictably.</p><p>Use optimistic projection only where rollback is deterministic and visible. Keep authorization and conflict-sensitive truth server-side.</p></section>
<section><h2>Best practices</h2><p>Use stable ids, typed events, explicit versions, cursor validation, generation guards, bounded caches, semantic HTML, and idempotent cleanup. Test keyboard use, accessibility output, stale responses, reconnects, retries, scroll restoration, and large datasets.</p><p>Measure interaction latency, render cost, cache pressure, stale drops, conflicts, retries, and accessibility regressions. Avoid sensitive telemetry.</p></section>
<h3>Principal defense: consistency, abuse, and bounded projection</h3><p>Separate authoritative records from query state, cursors, optimistic journals, viewport windows, and derived aggregates. Within a pagination or edit session, responses settle only when their query key, cursor lineage, tenant scope, and version still match. A rejected optimistic mutation restores the committed record and reapplies only valid local intent. Snapshot consistency is usually sufficient for browsing; conditional writes are required for edits.</p><p>Defend scale by bounding normalized caches, rendered windows, aggregation frequency, export size, and subscription fan-out. Defend abuse by validating filter complexity, column count, sort fan-out, cell payloads, and stream frequency before expensive work begins. Emit query-key attribution, cache hit rate, dropped frames, stale-response rejection, conflict count, rollback result, and memory pressure without logging sensitive row content.</p><section><h2>Common Pitfalls</h2><p>Common failures include confusing visible data with complete data, trusting arrival order, leaking subscriptions, accepting stale completion, using indexes as identity, and hiding rollback.</p><p>For this topic, buffer bursts, detect sequence gaps, resubscribe from watermark, refresh when replay is unavailable, pause hidden work, and isolate failed widgets. Validate untrusted inputs, authorize durable actions server-side, and minimize sensitive retention.</p></section>
<section><h2>Real-world use cases</h2><p>This runtime applies to operational interfaces where users manipulate large, changing datasets under partial failure. Reuse the controller shape while injecting query, authorization, persistence, and fallback policy explicitly.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Separate authoritative data time from browser arrival time and render cadence. A dashboard may ingest quickly while projecting at a bounded frame rate.</p><h3>What breaks at scale?</h3><p>high event rates, bursty streams, reconnect gaps, out-of-order events, expensive charts, hidden tabs, and stale widgets. I would bound expensive work and reject obsolete effects.</p><h3>What consistency model applies?</h3><p>The event sequence and snapshot watermark are authoritative. UI rendering is a throttled projection; reconnect recovery replays from a known sequence or refreshes the snapshot.</p><h3>How do you recover?</h3><p>I would buffer bursts, detect sequence gaps, resubscribe from watermark, refresh when replay is unavailable, pause hidden work, and isolate failed widgets.</p><h3>Why this architecture?</h3><p>Polling is simpler and predictable; streaming is justified when freshness matters enough to accept ordering, buffering, and reconnect complexity.</p></section>
<section><h2>References</h2><ul><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA Authoring Practices Guide</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver" target="_blank" rel="noreferrer">MDN ResizeObserver</a></li><li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React state ownership</a></li></ul></section>
</ArticleLayout>}
