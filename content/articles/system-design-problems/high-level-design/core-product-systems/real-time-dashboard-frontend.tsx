"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-real-time-dashboard-frontend",
  title: "Design a Real-Time Dashboard Frontend",
  description:
    "Architecture for a high-frequency real-time dashboard: WebSocket data delivery, chart rendering strategy, time-series windowing, memory management, and graceful degradation.",
  category: "high-level-design",
  subcategory: "core-product-systems",
  slug: "real-time-dashboard-frontend",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-10",
  tags: ["hld", "real-time", "dashboard", "websocket", "charts", "time-series"],
  relatedTopics: ["polling-vs-websocket-system", "low-latency-trading-ui"],
};

export default function RealTimeDashboardFrontendArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A real-time dashboard displays continuously updating metrics—server CPU utilization, active user counts, revenue per minute, sensor readings—in a format that allows operators to detect anomalies and trends at a glance. The defining characteristic is that data freshness is a core product requirement: a dashboard showing 5-minute-old data for a production incident monitoring system is nearly useless. The frontend must receive, process, and render high-frequency metric updates without degrading frame rate, exhausting browser memory, or blocking the main thread.</p>
        <p>The key tension is between data freshness and rendering cost. Updating a chart 60 times per second for a metric that changes 60 times per second is physically possible but computationally expensive and visually unreadable. Updating the chart 1 time per second for a metric that changes 1000 times per second means the chart shows a downsampled view that may miss spikes. The design must choose an appropriate update frequency per metric type and render strategy per chart type.</p>
        <p><strong>Explicit assumptions:</strong> The dashboard displays O(20–50) independent metrics simultaneously. Metric data is streamed via WebSocket from a time-series metrics backend (InfluxDB, TimescaleDB, or a Kafka consumer). Each metric updates at 1–60 Hz depending on the metric type (CPU: 1Hz, request latency: 5Hz, trade executions: 60Hz). Charts are rendered using a canvas-based charting library (not SVG, which cannot handle high-frequency updates at scale). The dashboard supports configurable time windows (last 5 minutes, last hour, last 24 hours).</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Real-time metric streams:</strong> Receive metric updates via WebSocket and display in charts with &lt;1 second visible latency from the metric event to screen update.</li>
          <li><strong>Time-series charts:</strong> Line charts, area charts, and bar charts with a configurable time window (5m, 15m, 1h, 6h, 24h). Historical data fills the chart on load; real-time updates append to the right as time passes.</li>
          <li><strong>Stat cards:</strong> Current value of key metrics (e.g., "2,847 active users") with trend indicator (up/down/neutral compared to previous period).</li>
          <li><strong>Anomaly highlighting:</strong> When a metric exceeds a configured threshold, the chart highlights the anomalous region in red and an alert indicator appears on the stat card.</li>
          <li><strong>Dashboard layout:</strong> Configurable grid layout of widgets (charts, stat cards, tables). Users can rearrange and resize widgets; layout persists to server.</li>
          <li><strong>Historical data on load:</strong> When the dashboard first opens, charts should be pre-populated with historical data for the selected time window before real-time updates begin arriving.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Frame rate:</strong> Maintain 60fps during normal dashboard use. Chart updates must not block the main thread longer than 4ms (one frame at 60fps).</li>
          <li><strong>Memory:</strong> Long dashboard sessions (8+ hours) must not leak memory. Time-series data older than the display window must be evicted.</li>
          <li><strong>Reconnection:</strong> WebSocket disconnection must be detected within 5 seconds. Reconnection must be automatic with no user action required.</li>
          <li><strong>Graceful degradation:</strong> If the WebSocket is unavailable, fall back to HTTP polling at 10-second intervals with a visible "Degraded: Polling mode" indicator.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The dashboard architecture has three primary layers. The data layer manages WebSocket connections, message routing, and per-metric time-series buffers. The rendering layer manages chart updates, frame scheduling, and canvas rendering. The layout layer manages widget placement, responsive sizing, and layout persistence. These layers communicate through a shared metric store: the data layer writes to it on WebSocket message receipt, and the rendering layer reads from it on each animation frame.</p>
        <p>The WebSocket connection is managed by a singleton connection manager that handles reconnection, deduplication of subscriptions (if two charts on the dashboard both request the same metric, only one server subscription is created), and message routing (dispatching incoming metric events to the appropriate chart's buffer). The connection manager runs in the main thread but can delegate message parsing to a Web Worker for high-frequency streams where JSON.parse() would be expensive.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/real-time-dashboard-frontend-architecture.svg"
          alt="Real-time dashboard architecture showing WebSocket connection manager, per-metric time-series ring buffer, Web Worker message parsing, requestAnimationFrame render scheduler, canvas chart renderer, and HTTP polling fallback. Historical data bootstrap on connect, anomaly threshold evaluation, and stat card update pipeline shown."
          caption="Dashboard architecture: WebSocket connection manager → per-metric ring buffers → rAF render scheduler → canvas chart renderer, with polling fallback"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Time-Series Ring Buffer</h3>
        <p>Each metric maintains a fixed-size ring buffer (circular buffer) that holds exactly as many data points as the current display window contains. For a 5-minute window at 1Hz resolution, the buffer holds 300 points. For a 1-hour window at 1Hz, the buffer holds 3600 points. When a new data point arrives, it is written to the buffer's write pointer, which then advances. When the buffer is full, the oldest point is automatically overwritten. This data structure has constant memory usage regardless of session duration—the buffer never grows beyond its initial allocation. No garbage collection pressure, no memory leak.</p>
        <p>When the user changes the time window (from 5 minutes to 1 hour), the current buffer is discarded and a new HTTP request fetches the historical data for the new window. The buffer is resized for the new window's point count. Real-time updates then resume appending to the new buffer. The transition from old to new window is handled as a loading state (chart shows a skeleton while historical data loads) to avoid showing an incomplete chart during the fetch.</p>
        <p>For metrics with update frequencies higher than the display resolution, the data layer performs client-side downsampling before writing to the ring buffer. A metric updating at 60Hz displayed on a 5-minute chart at 1-second resolution (300 points) downsamples each 1-second window to a single representative value: typically the average for smooth metrics (CPU), or the maximum for spike-sensitive metrics (error rate, latency). The downsampling function is configurable per metric type and is applied in the Web Worker to avoid blocking the main thread.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">requestAnimationFrame Render Scheduling</h3>
        <p>Charts are not re-rendered on every incoming WebSocket message. At 60Hz message frequency, re-rendering 50 charts per message would consume the entire CPU budget. Instead, the rendering layer uses a requestAnimationFrame (rAF) loop that runs at the display refresh rate (60fps or 120fps). Each rAF frame, the render scheduler checks which charts have received new data since the last frame (using a dirty flag per chart), and re-renders only those charts. Charts with no new data are skipped entirely. At 1Hz update frequency, most charts are skipped in 59 of every 60 frames—at 60Hz, all charts are re-rendered every frame, which is the maximum sustainable rate.</p>
        <p>Chart rendering runs on the HTML canvas (not SVG). Canvas drawing is a batch of draw calls to the 2D rendering context: clear canvas, draw grid lines, draw the data path (a polyline connecting all points in the ring buffer), fill the area under the line (for area charts), draw threshold markers, and render axis labels. A single canvas redraw for a 300-point time series takes approximately 0.5–2ms on a modern device. With 50 charts, 50 redraws per frame = 25–100ms, which exceeds the 16ms frame budget. The mitigation is to not re-render all 50 charts in a single frame: the scheduler prioritizes charts in the viewport, renders them first, and defers off-screen chart updates to subsequent frames.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">WebSocket Subscription Protocol</h3>
        <p>The WebSocket protocol uses a subscription model: the client sends a subscribe message for each metric it wants to receive, and the server sends metric updates only for subscribed metrics. This is more efficient than the server broadcasting all metrics to all clients (which would require each client to filter). The subscribe message includes the metricId, the desired resolution (1s, 5s, 1m), and the desired aggregation function (avg, max, sum). The server applies the downsampling and aggregation before transmission, reducing message frequency and payload size.</p>
        <p>On reconnection, the client re-sends all active subscriptions. The server may respond with a brief history replay (the last N seconds of data) to fill the gap created by the disconnection, or the client may request this explicitly. Gap filling is important: without it, the chart shows a visible discontinuity at the reconnection point (a gap in the line where data is missing). The gap fill request specifies the timestamp of the last received data point; the server returns all data from that timestamp forward, and the client merges it into the ring buffer.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Historical Data Bootstrap</h3>
        <p>When the dashboard loads, the WebSocket connection is established and subscriptions sent. Simultaneously, an HTTP request fetches the historical data for each chart's time window. The historical data fills the ring buffers, and the charts render with the historical view. As real-time updates arrive from the WebSocket, they append to the end of the historical data. The join point (where historical data ends and real-time begins) should be smooth: if there is a gap between the last historical data point and the first WebSocket event, the chart shows a straight-line interpolation (for continuous metrics) or a gap marker (for event-based metrics).</p>
        <p>The bootstrap can be parallelized: all historical data requests fire simultaneously (not sequentially). However, 50 simultaneous HTTP requests will be limited by browser connection limits (6 per origin for HTTP/1.1). The solution is either HTTP/2 (multiplexed over a single connection, eliminating the connection limit concern) or a batch historical data endpoint: a single request that accepts an array of metricIds and time window, returning all historical data in one response. The batch endpoint is simpler for HTTP/1.1 clients and reduces request overhead significantly.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Memory Management</h3>
        <p>A real-time dashboard session lasting 8 hours must not show memory growth. The ring buffer approach handles metric data memory (constant size), but the chart library's internal data structures, event listeners, and animation handles must also be managed. Each chart component registers a requestAnimationFrame loop and event listeners on mount; these must be cancelled on unmount (when the widget is removed or the dashboard is closed). React's useEffect cleanup is the standard mechanism for this in React-based dashboards.</p>
        <p>Canvas elements that are not in the viewport should be minimized in rendering cost. The IntersectionObserver API allows the dashboard to detect when a chart widget scrolls out of view and pause its rAF loop. When the chart is not visible, there is no point rendering it 60 times per second. The ring buffer continues to receive and store incoming data; the chart simply does not render until it becomes visible again. This optimization can reduce CPU usage by 50–80% on dashboards with more charts than can fit on one screen.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Anomaly Detection and Alerting</h3>
        <p>Threshold-based anomaly detection is performed client-side: each metric has a configurable threshold (e.g., CPU &gt; 80% = warning, &gt; 95% = critical). After each data point is written to the ring buffer, the threshold is evaluated. If the threshold is exceeded, the chart renders the anomalous region in a highlight color (yellow for warning, red for critical) and the stat card shows an alert indicator. A dashboard-level alert panel aggregates all active threshold violations for visibility across many metrics simultaneously.</p>
        <p>More sophisticated anomaly detection (statistical outlier detection, trend analysis) is performed server-side. The metric stream from the server includes an anomaly_score field alongside the metric value, computed by the backend using algorithms like Seasonal Hybrid ESD (used by Twitter) or Robust PCA. The client renders anomaly scores as an overlay on the chart without performing the computation itself. This keeps the client lightweight and allows the server to apply ML-based anomaly detection that the browser's CPU budget could not sustain.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/real-time-dashboard-frontend-performance.svg"
          alt="Dashboard performance optimization showing ring buffer constant memory usage, rAF dirty-flag rendering skipping unchanged charts, IntersectionObserver-based pause for off-screen charts, Web Worker JSON parsing for high-frequency streams, canvas 2D rendering pipeline versus SVG cost, and HTTP/2 multiplexed historical bootstrap"
          caption="Dashboard performance: ring buffers, dirty-flag rAF scheduling, IntersectionObserver pausing, Web Worker parsing, and canvas rendering efficiency"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Canvas versus SVG for charts: SVG charts represent each data point as a DOM element; at 300 points, that's 300+ DOM nodes per chart. At 50 charts, that's 15,000+ DOM nodes, each participating in style recalculation, layout, and paint. Chart updates require modifying DOM attributes, which triggers layout and repaint. Canvas charts issue draw calls directly to the GPU without DOM overhead; updating a 300-point canvas chart requires clearing and redrawing a small portion of pixels. For dashboards with high update frequency and many simultaneous charts, canvas is the correct choice despite the added complexity of manual rendering logic. SVG is acceptable for dashboards with few charts, infrequent updates, or where interactivity (hover tooltips, click handlers on individual data points) is more important than rendering performance.</p>
        <p>WebSocket versus polling: WebSocket provides true push-based updates with &lt;50ms latency from metric event to client receipt. HTTP polling at 10-second intervals provides acceptable freshness for slowly changing metrics (daily revenue) but is inadequate for high-frequency operational metrics (request latency, error rate). The architecture should use WebSocket as the primary delivery mechanism with polling as a fallback, not as a design choice to avoid WebSocket complexity. The added complexity of WebSocket (connection management, reconnection, subscription protocol) is justified by the latency improvement for real-time operational use cases.</p>
        <p>Client-side downsampling versus server-side: performing downsampling on the server reduces the data transmitted over the WebSocket and reduces client-side processing, but requires the server to know the client's display resolution and time window. If the user resizes a chart or changes the time window, the server must be notified to change its downsampling parameters. Client-side downsampling is more flexible (the client can change resolution without a server round-trip) but requires the server to send raw data at full frequency, which increases bandwidth. The optimal solution is server-side downsampling with client-side smoothing: the server downsamples to the display resolution, the client receives one data point per display pixel, and minimal client-side processing is needed.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A real-time dashboard frontend is built around three key technical decisions: ring buffers for constant-memory time-series data storage, requestAnimationFrame with dirty-flag scheduling for high-performance chart updates without blocking the main thread, and canvas rendering for charts that update at high frequency. The WebSocket connection manager handles reconnection, subscription deduplication, and gap-fill replay on reconnect. Historical data is bootstrapped via a batch HTTP endpoint on dashboard load. Off-screen charts are paused via IntersectionObserver to reduce CPU usage. Client-side threshold evaluation drives anomaly highlighting; server-side anomaly scores handle sophisticated detection. The graceful degradation path (WebSocket → polling) ensures the dashboard remains functional during network issues, with a visible indicator of degraded mode. The defining constraint is that all rendering must fit within the 16ms frame budget at 60fps, which drives every technical decision from buffer design to canvas choice to rAF scheduling strategy.</p>
      </section>
    </ArticleLayout>
  );
}
