"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-realtime-analytics-10k-datapoints",
  title: "Design Real-Time Analytics with 10k+ Data Points",
  description:
    "Principal-level design of real-time analytics dashboards handling high-volume metrics with streaming gateways, downsampling, canvas rendering, backpressure, aggregation, rewind, and production operability.",
  category: "high-level-design",
  subcategory: "data-heavy-systems",
  slug: "realtime-analytics-10k-datapoints",
  wordCount: 5600,
  readingTime: 32,
  lastUpdated: "2026-05-22",
  tags: ["hld", "real-time", "analytics", "websocket", "canvas", "downsampling", "lttb", "timeseries"],
  relatedTopics: ["time-series-visualization", "log-monitoring-ui"],
};

export default function RealtimeAnalytics10kDatapointsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          A real-time analytics dashboard with 10,000 or more data points per second shows fast-moving metrics such as infrastructure telemetry, financial ticks, IoT sensor streams, product events, ad delivery counters, or operational KPIs. The system must ingest and visualize continuous updates while preserving interaction responsiveness, visual correctness, and network efficiency.
        </p>
        <HighlightBlock as="p" tier="crucial">
          The principal-level insight is that real-time analytics is a rate-matching problem. Producers may generate far more data than the network, browser, chart, and human eye can consume. The architecture must downsample, aggregate, batch, and backpressure data before it reaches the rendering loop.
        </HighlightBlock>
        <p>
          A browser display refreshes at roughly 60 frames per second, leaving about 16.7 milliseconds for each frame. Rendering thousands of DOM or SVG elements per frame will miss that budget. The frontend should render dense live charts with Canvas or WebGL, keep data in typed arrays or bounded buffers, and update at animation-frame cadence instead of at raw ingestion cadence.
        </p>
        <p>
          The backend must also be viewport-aware. Sending every raw point to every open dashboard wastes bandwidth and CPU. A chart that is 1,200 pixels wide cannot visually represent 100,000 unique points in the same time window. The streaming layer should send only the number of points needed to preserve the shape and operational meaning of the chart at the current zoom level.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          The real-time path receives new metric points, writes them to durable time-series storage, and fans them out to active dashboard subscriptions. The historical path serves paused views, rewind, initial chart loads, and zoomed time ranges. Both paths should use the same downsampling and aggregation semantics so users do not see different shapes for live and historical data.
        </p>
        <p>
          Server-side downsampling reduces point volume before network delivery. Largest-Triangle-Three-Buckets is a common visual downsampling algorithm because it preserves shape better than taking every Nth point. For operational charts, min-max-avg bucket aggregation is often equally important because it preserves spikes that average-only downsampling can hide.
        </p>
        <HighlightBlock as="p" tier="important">
          Downsampling policy should be driven by viewport width, time range, metric type, and alert semantics. A CPU utilization chart can tolerate visual downsampling. A financial tick chart may require exact extrema. A safety-critical sensor chart may need min-max bands and explicit gap markers rather than a smoothed line.
        </HighlightBlock>
        <p>
          The streaming gateway manages subscriptions. Each dashboard tab subscribes to metric ids, time window, pixel width, aggregation resolution, and visibility state. The gateway batches updates, applies per-client downsampling, enforces rate limits, and detects slow consumers. This prevents one browser tab from forcing the whole ingestion pipeline to slow down.
        </p>
        <p>
          The rendering pipeline should avoid React state updates per point. React can own chart configuration, layout, legends, and controls. The hot data path should append to typed arrays or circular buffers and render through requestAnimationFrame. Tooltips, crosshairs, legends, and selection windows can be layered over Canvas rather than represented as thousands of DOM nodes.
        </p>
        <p>
          Backpressure is a correctness feature, not only a performance feature. If the browser falls behind, the system must choose whether to drop intermediate visual frames, reduce sample rate, show gap markers, pause live mode, or switch to coarser aggregation. Pretending the chart is live while silently delaying minutes of buffered points is misleading.
        </p>
        <p>
          Principal-level designs also separate signal fidelity from decision fidelity. Users rarely need every raw point to decide whether a dashboard is healthy, but they do need confidence that spikes, gaps, and threshold crossings are preserved. This means the system should track which aggregation preserved extrema, which points were sampled, which intervals have missing producers, and whether the visible shape is safe for alert triage or only suitable for trend monitoring.
        </p>
        <p>
          Multi-tenant fairness is another core concept. One tenant opening a dashboard with hundreds of live panels should not consume the entire streaming gateway or time-series backend. Subscription budgets, per-tenant connection limits, per-panel point budgets, and degradation policies keep the platform fair. A mature UI can show when a panel is being coarsened because the tenant or browser exceeded its live-rendering budget.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The architecture has four planes. The ingestion plane receives metrics from producers and writes durable time-series data. The streaming plane tracks active subscriptions and sends viewport-appropriate updates. The query plane serves historical and rewind requests. The rendering plane draws charts with bounded memory and frame budgets.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/data-heavy-systems/realtime-analytics-10k-datapoints.svg"
          alt="Real-time analytics architecture with ingestion, time-series database, streaming gateway, LTTB downsampling, WebSocket delivery, Canvas rendering, aggregation, pause, rewind, and backpressure."
          caption="Real-time analytics needs a dual path: durable historical storage plus live streaming that downsampled and batched per client viewport."
        />
        <p>
          Producers send raw points to ingestion, often through an event bus or metrics collector. The ingestion service validates metric identity, tenant, timestamp skew, and value type, then writes to a time-series store. In parallel, recent points are published to the streaming gateway. The gateway keeps rolling windows per metric or consumes recent points from a stream partition, then materializes per-client updates from that rolling window.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/data-heavy-systems/realtime-analytics-streaming-flow.svg"
          alt="Streaming flow showing metric producers, ingestion, durable time-series storage, streaming gateway, subscription state, viewport-aware downsampling, WebSocket batches, and browser buffers."
          caption="The streaming gateway is the rate-matching boundary between raw producer volume and what each browser viewport can actually render."
        />
        <p>
          On chart load, the client requests historical data for the selected window. The query service returns a downsampled baseline so the chart is populated immediately. The client then opens a live subscription for incremental updates after the baseline end timestamp. This prevents holes between initial load and live streaming, and it gives the client a clean recovery path after reconnect.
        </p>
        <p>
          Rendering uses a Canvas or WebGL layer sized to the physical display pixels. Data points are stored in circular buffers keyed by metric series. Each animation frame maps timestamps to x positions and values to y positions, draws visible series, draws min-max bands where applicable, and overlays cursor or selection state. React re-renders only when chart configuration changes, not for every incoming point.
        </p>
        <p>
          Reconnection must be designed as a first-class flow. On reconnect, the client should send the last baseline timestamp and last live sequence it processed. The gateway can respond with a compact catch-up window from the durable store or mark a visible gap if the missing window is too large. This is better than replaying an unbounded stream and better than silently joining at the latest point, because users can see whether the chart is continuous.
        </p>
        <p>
          Panel orchestration matters when a dashboard contains many live charts. A global dashboard coordinator should know which panels are visible, paused, hidden behind tabs, or offscreen. Hidden panels can reduce update frequency or stop live subscriptions entirely, while visible incident panels keep priority. This prevents a single dashboard tab from paying full live-stream cost for charts the user cannot currently see.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/data-heavy-systems/realtime-analytics-rendering-flow.svg"
          alt="Rendering flow showing WebSocket batch, circular typed arrays, requestAnimationFrame, Canvas or WebGL renderer, overlay layer, and frame budget."
          caption="The frontend hot path bypasses React state per point: stream batches update bounded buffers, then Canvas or WebGL renders at frame cadence."
        />
        <p>
          The architecture should distinguish source event rate from visual update rate. A backend stream may ingest thousands of events per second, but the browser should usually repaint at a bounded frame cadence with aggregated or decimated data. The stream layer can buffer, window, and coalesce updates so users see current trends without forcing React or the chart renderer to process every raw event.
        </p>
        <p>
          Multi-view dashboards need shared stream fanout. If ten panels subscribe to the same underlying event source with different filters, the backend should avoid creating ten independent upstream subscriptions per browser. A subscription coordinator can share source streams, apply panel-specific aggregations, and enforce tenant and dashboard-level budgets. This matters when many operators open the same live dashboard during an incident.
        </p>
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2>
        <p>
          WebSocket is a good fit when the client must send subscription updates such as zoom, pause, resume, hidden-tab state, selected metrics, and viewport width. Server-Sent Events are simpler for one-way server push and automatic reconnect, but they are weaker when the server needs frequent client-driven subscription changes. Polling is operationally simple, but it wastes latency and bandwidth for high-frequency live charts.
        </p>
        <p>
          Canvas is much faster than SVG for dense charts because Canvas draws a bitmap and avoids per-point DOM nodes. The trade-off is that tooltips, hit testing, accessibility summaries, and annotations must be implemented separately. SVG remains appropriate for small charts where semantic elements and simple interactivity matter more than raw rendering throughput. WebGL is the next step for very dense visible points or many series, but it increases implementation complexity and debugging cost.
        </p>
        <HighlightBlock as="p" tier="important">
          Downsampling improves usability and cost, but it can hide rare spikes if chosen poorly. Average-only aggregation is dangerous for operational analytics. Min-max bands, extrema preservation, gap markers, and zoom-to-raw-data behavior are necessary when users make incident or business decisions from the chart.
        </HighlightBlock>
        <p>
          Live freshness and visual stability compete. Updating every incoming point maximizes freshness but causes jitter and high CPU. Batching updates to animation frames creates smoother rendering but adds tens of milliseconds of delay. For dashboards, this delay is usually acceptable. For trading or safety control surfaces, the design may need stricter freshness indicators and lower-latency paths.
        </p>
        <p>
          Per-client downsampling is precise but expensive at large connection counts because each viewport may have different width, zoom, and metric selection. Shared pre-aggregated buckets are cheaper but less tailored. A practical system combines both: precompute common resolutions and apply final per-client shaping only where necessary.
        </p>
        <p>
          Dropping frames is usually better than building an unbounded queue. If a client falls behind, it should skip intermediate visual updates and catch up to the latest state, while showing a clear indication if data was omitted or aggregated more coarsely. Delayed replay of old live data makes the dashboard look current when it is not.
        </p>
        <p>
          JSON transport is simple and debuggable, but it creates parsing overhead and garbage collection pressure for dense streams. Binary frames or compact columnar batches reduce bandwidth and allocations, but they increase implementation complexity and make debugging harder. For moderate dashboards, compressed JSON batches can be acceptable; for thousands of points per second across many series, binary batches backed by typed arrays become worth the complexity.
        </p>
        <p>
          Shared dashboards create a fanout trade-off. If every viewer receives separately downsampled streams, fidelity is precise but gateway cost rises. If viewers share a common server-side stream, cost drops but the stream may not match each panel width or zoom exactly. A practical design shares common resolutions and applies a small final client or gateway adjustment per viewport.
        </p>
        <p>
          Choose semantic degradation modes. Dropping every other point may be acceptable for a sparkline but not for financial ticks, safety telemetry, or alert investigation. For high-value streams, the system may prefer slower updates with explicit lag over silent point loss. For exploratory dashboards, approximate aggregation and bounded buffers may be better. Principal-level answers tie degradation to the domain, not just browser performance.
        </p>
        <p>
          Backpressure should be visible. If the client is behind, the UI should show stream lag, skipped windows, reconnect state, and whether displayed values are exact or approximate. Hiding lag makes real-time dashboards dangerous because users believe they are seeing the present while the browser is showing stale buffered data.
        </p>
      </section>

      <section>
        <h2>Best practices</h2>
        <p>
          Separate raw ingestion fidelity from visual delivery fidelity. Store raw or appropriately aggregated data durably according to retention policy, then derive viewport-specific visual streams for dashboards. Users should be able to zoom or rewind to higher fidelity when needed.
        </p>
        <p>
          Make subscriptions explicit. The client should tell the gateway metric ids, time range, pixel width, aggregation preference, visibility state, and acceptable update rate. This lets the server avoid sending unnecessary points and lets it degrade intelligently under load.
        </p>
        <p>
          Use bounded memory on both server and client. Streaming gateways should maintain rolling windows rather than unbounded buffers. Browser clients should use typed arrays or circular buffers with fixed capacity based on time window and resolution. Avoid allocating new arrays per frame.
        </p>
        <p>
          Treat gaps as first-class data. Distinguish producer gaps, database nulls, client backpressure gaps, reconnect gaps, and aggregation gaps. The chart should render these differently so users can tell whether the system had no data, dropped visual frames, or intentionally coarsened the view.
        </p>
        <p>
          Keep chart accessibility and explainability in the design. Dense Canvas charts need textual summaries, keyboard-accessible time range controls, table views for selected windows, exported data for investigation, and clear labels for aggregation level and freshness.
        </p>
        <p>
          Instrument the full path. Measure ingestion lag, gateway fanout lag, WebSocket buffered amount, messages per second, points per second before and after downsampling, dropped-frame count, render duration, long tasks, memory growth, reconnect rate, and historical query latency.
        </p>
        <p>
          Expose freshness and aggregation in the product, not only in logs. Each chart should be able to show source lag, gateway lag, last update time, aggregation step, and whether the panel is live, paused, replaying, or degraded. Those labels prevent operators from treating stale or coarsened data as current truth during an incident.
        </p>
        <p>
          Test under burst conditions, not just steady-state load. Incident traffic, market open, product launches, and fleet reconnects can all create sudden producer and viewer spikes. Load tests should include reconnection storms, hidden-tab behavior, metric cardinality spikes, and many viewers opening the same dashboard simultaneously.
        </p>
        <p>
          Keep live and historical semantics aligned. A user who pauses, rewinds, or shares a link should see the same aggregation rules and gap markers as another user who later queries that window from storage. If the live path and historical path use different downsampling rules without labeling, investigations become hard to reproduce.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most common pitfall is rendering dense metrics with DOM or SVG elements because it works in demos. Once point count, chart count, or update rate grows, layout and paint overwhelm the frame budget. Dense live charts need Canvas or WebGL.
        </p>
        <p>
          Another pitfall is sending raw point volume to every client. Network traffic, JSON parsing, garbage collection, and rendering cost all scale badly. Downsampling and aggregation belong on the server side before delivery.
        </p>
        <p>
          Average-only aggregation can hide incidents. A one-second spike may disappear if averaged over a minute. Operational dashboards should preserve extrema, show min-max bands, and allow zooming into raw data for diagnosis.
        </p>
        <p>
          Unbounded client queues create fake real-time views. If the browser is minutes behind processing buffered messages, users may make decisions on stale data. The system should skip ahead, show backpressure state, or pause live mode rather than replaying stale updates silently.
        </p>
        <p>
          Reconnect handling is often underdesigned. After a connection drop, the client should request historical catch-up from the last acknowledged timestamp, then resume live subscription. Relying only on WebSocket reconnect can leave holes or duplicate points.
        </p>
        <p>
          Another pitfall is doing expensive aggregation on the main thread. Parsing, merging, decimating, and computing tooltip series for thousands of points can block input and make the dashboard unusable. Web workers or backend aggregation should handle heavy computation, leaving the UI thread for interaction and painting.
        </p>
      </section>

      <section>
        <h2>Real-world use cases</h2>
        <p>
          Infrastructure monitoring dashboards show CPU, memory, request rate, latency, error rate, saturation, and queue depth for thousands of services. Operators need live views during incidents and rewind for post-incident analysis.
        </p>
        <p>
          IoT and industrial systems show high-frequency sensor readings from devices, factories, fleets, or energy infrastructure. These systems need gap semantics because missing sensor data can be as important as abnormal values.
        </p>
        <p>
          Financial and marketplace analytics use real-time charts for prices, order flow, bids, impressions, conversions, and revenue. They need extrema preservation and clear freshness indicators because users may react quickly to anomalies.
        </p>
        <p>
          Product analytics dashboards display live signups, funnel events, experiment metrics, and traffic by segment. These dashboards often accept coarser aggregation but require stable trends and rapid filtering by dimension.
        </p>
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">1. How would you handle 10,000 points per second in a browser chart?</h3>
        <p>
          I would not send or render all raw points. The server would downsample or aggregate based on viewport width, time range, and metric semantics. The client would receive batched updates at animation-frame cadence, store them in bounded typed arrays, and render with Canvas or WebGL. React would manage controls and configuration, not per-point state.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">2. Why is server-side downsampling necessary?</h3>
        <p>
          A chart has limited visual resolution. Sending more points than pixels wastes network, parsing, memory, and rendering budget. Server-side downsampling lets the gateway preserve the visual shape or min-max envelope before delivery. It also protects the system when many dashboards are open at once.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">3. How would you handle backpressure?</h3>
        <p>
          I would monitor WebSocket buffered amount, client acknowledgements, render duration, and tab visibility. If the client falls behind, the gateway can reduce update frequency, switch to coarser aggregation, drop intermediate visual frames, or send a gap marker. The key is to keep the chart current and honest rather than replaying stale live data silently.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">4. How do you support pause and rewind?</h3>
        <p>
          Live mode consumes a streaming subscription. Pause mode stops applying live updates and lets the user select a historical window. The client fetches downsampled historical data from the query service for that window. Resume requests catch-up from the last live timestamp or snaps to the current tail, depending on product semantics. This requires durable time-series storage in addition to live fanout.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">5. How do you avoid hiding important spikes?</h3>
        <p>
          I would avoid average-only downsampling for operational metrics. Use extrema-preserving methods, min-max bands, or LTTB depending on chart purpose. Preserve raw data in storage and allow zooming to higher fidelity. Label aggregation level clearly so users know whether they are seeing raw points, one-second buckets, or coarser summaries.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">6. What production metrics would you monitor?</h3>
        <p>
          I would monitor ingestion lag, streaming gateway lag, points in versus points out, downsampling ratio, messages per second, WebSocket reconnects, backpressure events, client render duration, dropped frames, memory usage, long tasks, historical query latency, and freshness by tenant, dashboard, metric cardinality, browser, and device class.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API" target="_blank" rel="noreferrer">MDN: WebSocket API</a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" target="_blank" rel="noreferrer">MDN: Canvas API</a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas" target="_blank" rel="noreferrer">MDN: OffscreenCanvas</a>
          </li>
          <li>
            <a href="https://www.prometheus.io/docs/practices/histograms/" target="_blank" rel="noreferrer">Prometheus Documentation: Histograms and Summaries</a>
          </li>
          <li>
            <a href="https://docs.influxdata.com/influxdb/" target="_blank" rel="noreferrer">InfluxDB Documentation</a>
          </li>
          <li>
            <a href="https://www.timescale.com/blog/how-to-shape-sample-data-with-time-weighted-averages/" target="_blank" rel="noreferrer">Timescale: Time-Series Aggregation Concepts</a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
