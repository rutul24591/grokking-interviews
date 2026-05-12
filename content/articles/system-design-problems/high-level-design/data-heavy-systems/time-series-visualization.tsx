"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-time-series-visualization",
  title: "Design a Time-Series Visualization System",
  description:
    "Architecture for a time-series visualization system: multi-resolution storage (raw + pre-aggregated rollups), adaptive query routing to the appropriate resolution, synchronized multi-panel layouts with shared time cursor, annotation overlays for deployments and incidents, comparison mode (current vs prior period), query language (PromQL/InfluxQL) editor with auto-complete, alert threshold lines on charts, and export to PNG/CSV.",
  category: "high-level-design",
  subcategory: "data-heavy-systems",
  slug: "time-series-visualization",
  wordCount: 5000,
  readingTime: 30,
  lastUpdated: "2026-05-11",
  tags: ["hld", "time-series", "visualization", "prometheus", "grafana", "rollups", "multi-panel", "annotations"],
  relatedTopics: ["realtime-analytics-10k-datapoints", "alerting-anomaly-detection-dashboard"],
};

export default function TimeSeriesVisualizationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A time-series visualization system like Grafana serves a very specific engineering workflow: correlating metrics across multiple services to diagnose performance degradations. The core workflow is: (1) notice an alert or user complaint, (2) open a dashboard showing request latency, error rate, and throughput for the affected service, (3) zoom in on the anomalous time window, (4) compare the current period against the same period last week to distinguish regression from normal pattern, and (5) overlay deployment events to correlate a metric change with a specific code deployment. Every feature of the system should make this workflow faster.</p>
        <p>The multi-resolution challenge is specific to time-series: a query for the last 30 days of data at 10-second resolution would return 259,200 data points — far more than any chart can display (a 1,200px-wide chart would have 216 points per pixel, making individual point detail invisible). Querying raw 10-second data for a 30-day window is also slow (the database must scan millions of rows). The solution is multi-resolution storage: raw 10-second data for the last 48 hours, 1-minute rollups for the last 90 days, 1-hour rollups for the last 2 years. The query layer automatically selects the appropriate resolution based on the requested time range and the chart's pixel width — this is adaptive query routing.</p>
        <p><strong>Explicit scope:</strong> Multi-panel dashboard layout, query editor, resolution routing, annotations, comparison mode, and chart export. Not in scope: time-series data ingestion, Prometheus scraping configuration, or alerting rule management.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Dashboard panels:</strong> A dashboard is a grid of panels. Each panel contains one chart (line, bar, heatmap, stat/single-value, gauge, table). Panels share a time range picker (top-right: Last 6h, Last 24h, Last 7d, custom absolute range). Panels can be arranged in a 24-column responsive grid, resizable and draggable by dashboard editors.</li>
          <li><strong>Query editor:</strong> Each panel has one or more queries. Queries are written in the data source's query language (PromQL for Prometheus, InfluxQL/Flux for InfluxDB, SQL for PostgreSQL). A query builder mode (dropdown-based) is available for users unfamiliar with the query language. Auto-complete suggestions for metric names, labels, and functions (populated from the data source's metric catalog API).</li>
          <li><strong>Time synchronization:</strong> All panels on a dashboard share the same time range. When the time range changes (via the time picker or by zooming on one panel), all panels re-query and update simultaneously. A shared time cursor: hovering on one panel shows a vertical cursor line synced across all panels at the same timestamp.</li>
          <li><strong>Annotations:</strong> Vertical markers on all panels for events: deployments (git commit SHA, service name, timestamp — fetched from the CI/CD system), incidents (PagerDuty alert open/close), and manual annotations (added by engineers). Annotations are stored in a separate database and overlaid on charts client-side after the chart data renders.</li>
          <li><strong>Comparison mode:</strong> "Compare to previous period" toggle overlays a second time series (offset by 1 week or 1 day) as a dashed line on each panel. The Y-axis is shared between current and comparison, allowing direct visual comparison. Percentage difference is computed and shown in the tooltip ("+12% vs last week").</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Dashboard load time:</strong> All panels show data within 3 seconds of opening (parallel panel queries). Rollup resolution queries return within 500ms from the time-series database.</li>
          <li><strong>Query concurrency:</strong> A dashboard with 20 panels opening simultaneously generates 20 parallel queries. The Query Gateway limits concurrent queries per data source to prevent overloading Prometheus or InfluxDB (configurable concurrency cap per data source).</li>
          <li><strong>Zoom responsiveness:</strong> Zooming into a narrower time window triggers a re-query at a finer resolution. The chart should show the new data within 1 second of the zoom gesture completing.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The system consists of a Dashboard Service (stores dashboard JSON schemas — panel layouts, query configs, annotation configs), a Query Gateway (routes queries to the appropriate data source, selects resolution, enforces concurrency limits, caches results), and the time-series databases themselves (Prometheus for short-term raw metrics, Thanos or Cortex for long-term multi-resolution storage). The frontend is a React SPA that loads the dashboard schema from the Dashboard Service, constructs queries for each panel, sends them through the Query Gateway, and renders the results using a chart library (a custom Canvas renderer for performance, or a library like uPlot which is optimized for time-series data). All panels share a global time range state (Zustand) that triggers coordinated re-queries when the time range changes.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/data-heavy-systems/time-series-visualization.svg"
          alt="Time-series visualization architecture showing dashboard schema (Dashboard Service: GET /api/dashboards/{id} → JSON schema {panels:[{id,query,chartType,thresholds}], timeRange, annotations}; 24-column grid layout; panel types: line bar heatmap stat gauge table), query routing (time range → select resolution: last 48h=10s raw; last 90d=1min rollup; last 2y=1h rollup; adaptive: target_points=pixelWidth/2 → step=timeRange/target_points → round to nearest rollup; Query Gateway: concurrency limiter per datasource max 10 concurrent; route: Prometheus=PromQL API; InfluxDB=Flux API; cache: SHA256(query+step+timeRange) TTL=step×2), PromQL execution (prometheus: instant vector OR range vector; evaluate at step intervals; response: {metric labels, values:[t,v]...}; Thanos: multi-tenant, long-term, downsampled blocks: 5min/1h rollups; rate(http_requests_total[5m]) OR avg_over_time(latency[1m])), chart rendering (uPlot: high-performance canvas; shared x-axis domain (time range); per-panel y-axis scale; multi-series: one line per metric label set {color, legend label}; hover: vertical cursor sync via global mousemove event → broadcast to all panels; threshold lines: horizontal dashed lines at alert values; zoom: mouse drag selection → update global timeRange → re-query all panels), annotations (GET /api/annotations?from&to → deployments from CI/CD + incidents from PagerDuty + manual; render as vertical lines overlaid on all panels; click → tooltip: {type:deploy, sha:abc123, service:auth, author}; color: deploy=green incident=red manual=blue), comparison mode (toggle: offset queries by -7d; render dashed line same color lower opacity; shared y-axis; tooltip: current={v} prior={v} delta={+12%}; difference chart mode: show delta as filled area around zero baseline)."
          caption="Dashboard schema load (JSON panel layout), adaptive resolution routing (48h raw / 90d 1min rollup / 2y 1h rollup, SHA256 cached Query Gateway), PromQL/InfluxQL execution with concurrency limiter, uPlot canvas rendering (shared time cursor sync, zoom→re-query all panels), annotation overlays (deploy/incident/manual vertical markers), comparison mode (offset −7d dashed line, +/−% delta tooltip), and alert threshold lines"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Adaptive Resolution Query Routing</h3>
        <p>The Query Gateway determines the appropriate data resolution for each query based on two inputs: the requested time range and the panel's pixel width. The target point count is set to pixelWidth / 2 (half the pixel width, since each point needs at least 2 pixels to be visually distinguishable). The required step (the time interval between returned data points) is: step = timeRange / targetPoints. For a 1,200px panel querying the last 24 hours: targetPoints = 600, step = 86,400s / 600 = 144s ≈ 2.5 minutes. The Query Gateway rounds this to the nearest available rollup resolution: since 2.5 minutes is between 1-minute and 5-minute rollups, it selects the 1-minute rollup.</p>
        <p>The routing rules: if the computed step is &lt;30 seconds, query raw data (no rollup); if the step is between 30 seconds and 5 minutes, use the 1-minute rollup; if between 5 minutes and 1 hour, use the 5-minute rollup; if over 1 hour, use the 1-hour rollup. The rollups store pre-computed min, max, and avg values per bucket. The chart can display all three (avg as the main line, min-max as a shaded band) or just the avg. This adaptive routing ensures that queries always return the appropriate resolution without over-fetching data or hitting raw high-cardinality data for wide time windows.</p>
        <p>Query caching: the Query Gateway caches query results in Redis keyed by SHA256(query + step + from + to + datasource). The TTL is set to 2 × step — a 2-minute step query is cached for 4 minutes. Since the time range picker rounds to "last 6h" or specific absolute timestamps, the same query is often repeated by multiple dashboard viewers, making cache hits frequent. Cache invalidation is time-based (TTL), so stale data is bounded by the cache TTL.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Synchronized Multi-Panel Time Cursor</h3>
        <p>The shared time cursor is implemented via a global Zustand store with a hoverTimestamp field. When the user moves the mouse over any panel's chart, the chart component updates hoverTimestamp with the current mouse x-position translated to a timestamp (using the inverse of the x-axis scale: timestamp = xScale.invert(mouseX)). All other panels subscribe to hoverTimestamp and render their cursor line at the corresponding x-position. This is purely client-side — no network requests — so cursor movement is instantaneous across all panels regardless of how many panels are on the dashboard.</p>
        <p>Performance concern: updating hoverTimestamp on every mousemove event (60 times per second) would cause all panels to re-render at 60fps, which for 20 panels could be expensive. The optimization: hoverTimestamp updates are throttled to 30fps using requestAnimationFrame (only update if an animation frame has not already been scheduled). Additionally, each panel uses a ref instead of state for the cursor line position — the cursor line is drawn directly on the canvas (or moved via a CSS transform on a DOM element) without triggering a React re-render. Only the tooltip (which shows formatted values for the hovered timestamp) re-renders, and it uses a debounce of 16ms.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Annotation System</h3>
        <p>Annotations are event markers overlaid on all panels at specific timestamps. They are fetched from the Annotation Service (GET /api/annotations?from=start&amp;to=end) in parallel with the panel data queries, and rendered client-side as vertical SVG lines above the chart canvas. Annotation sources: the CI/CD system provides deployment events (timestamp, commit SHA, service name, deployer); PagerDuty provides incident open/close events; engineers can add manual annotations via a right-click on any chart position. Each annotation type has a distinct color (deployments: green, incidents: red, manual: blue) and renders as a dashed vertical line spanning the full height of the panel. Clicking the annotation line shows a tooltip card with the event details.</p>
        <p>Annotations are stored in a PostgreSQL table (annotation: id, type, timestamp, end_timestamp (for range annotations), text, tags, orgId). Range annotations (incidents with a duration) are rendered as a colored rectangle spanning the incident duration — a semi-transparent red band for the incident duration makes it immediately visible when a metric degraded during an incident window. The annotation query is tenant-scoped by orgId and time-range-filtered with an index on timestamp.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Comparison Mode and Period-over-Period</h3>
        <p>Comparison mode overlays the same metrics from a previous period (configurable: same time yesterday, same time last week, same time last month) on top of the current data. Implementation: when comparison mode is enabled, each panel's query is duplicated with the time range shifted backward by the comparison offset (e.g., from - 7 days, to - 7 days). The resulting data series is rendered as a dashed line with lower opacity (0.4) using the same color as the current series. The Y-axis scale is shared between the current and comparison series (the axis domain is the min/max across both series).</p>
        <p>The tooltip in comparison mode shows three values for the hovered timestamp: the current value, the comparison period value, and the percentage difference (formatted as "+12%" in green for improvement or "-8%" in red for degradation, based on whether the metric should be "higher is better" or "lower is better" — configurable per panel). The comparison data is fetched and cached separately from the current data, using the same Query Gateway with the shifted time parameters. The comparison cache hit rate is high because the comparison period is a fixed offset into historical data that doesn't change.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>uPlot versus D3.js for time-series rendering: D3.js is the most powerful data visualization library for the web but uses SVG by default, which degrades beyond 1,000 data points due to DOM overhead. uPlot is a Canvas-based time-series library specifically designed for Grafana-style dashboards — it renders 10,000+ points at 60fps, has built-in time axis formatting (UTC, local timezone, configurable tick density), and supports synchronized multi-series rendering. uPlot is 50KB minified versus D3's 500KB, making it preferable for performance-critical dashboards. The trade-off: uPlot has a much smaller API surface than D3 and cannot render the arbitrary chart types (treemaps, force layouts, geographic maps) that D3 supports. For a specialized time-series dashboard, uPlot's constraints are acceptable; for a general BI dashboard with diverse chart types, D3 or a higher-level library (Recharts, Nivo) is more appropriate.</p>
        <p>Instant queries versus range queries in Prometheus: Prometheus supports two query modes. Range queries (matrix result) return a sequence of {`{value, timestamp}`} pairs for the full time range — appropriate for line charts. Instant queries (vector result) return a single value per metric at a specific timestamp — appropriate for stat panels and gauges. Dashboard panels must use the correct query type for their visualization type; the query editor should enforce this (disable range functions like rate() in instant query mode for stat panels). Mixed query modes on a single dashboard add API complexity — the Query Gateway must fan out to both the /query (instant) and /query_range (range) Prometheus endpoints and normalize the response format.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A time-series visualization system like Grafana is built around adaptive resolution query routing (step = timeRange / (pixelWidth / 2) → route to raw / 1min / 5min / 1h rollup), a Query Gateway with per-datasource concurrency limiting and SHA256-keyed Redis caching (TTL = 2 × step), and uPlot canvas rendering with shared Zustand hoverTimestamp for cross-panel cursor synchronization (requestAnimationFrame throttled, ref-based cursor updates to avoid React re-renders). Annotations are fetched in parallel with panel queries (deployment events from CI/CD, incident ranges from PagerDuty, manual annotations) and overlaid as vertical SVG lines or colored bands. Comparison mode duplicates queries with time-shifted offsets (−7d), rendering dashed lower-opacity series with tooltip percentage delta. The dashboard grid uses a 24-column responsive layout; zoom gestures update the global time range state (Zustand), triggering coordinated re-queries across all panels. The defining insight: multi-resolution storage (rollups) is the foundation that makes 30-day dashboards load in &lt;500ms — without rollups, every wide time range query would scan millions of raw data points.</p>
      </section>
    </ArticleLayout>
  );
}
