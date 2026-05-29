"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-time-series-visualization",
  title: "Design a Time-Series Visualization System",
  description:
    "Principal-level design of a Grafana-like time-series visualization system with multi-resolution rollups, adaptive query routing, synchronized panels, annotations, comparison mode, query editor, and production safeguards.",
  category: "high-level-design",
  subcategory: "data-heavy-systems",
  slug: "time-series-visualization",
  wordCount: 5600,
  readingTime: 32,
  lastUpdated: "2026-05-22",
  tags: ["hld", "time-series", "visualization", "prometheus", "grafana", "rollups", "multi-panel", "annotations"],
  relatedTopics: ["realtime-analytics-10k-datapoints", "alerting-anomaly-detection-dashboard"],
};

export default function TimeSeriesVisualizationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          A time-series visualization system helps users inspect metrics over time, correlate changes across panels, and diagnose incidents or business shifts. A Grafana-like product supports dashboards with many panels, shared time ranges, query editors, annotations, threshold overlays, comparison mode, and exports. The hard problem is returning visually useful data quickly across time windows ranging from minutes to years.
        </p>
        <HighlightBlock as="p" tier="crucial">
          The principal-level design hinges on multi-resolution data access. A 30-day dashboard should not scan raw 10-second samples when the panel is only 1,200 pixels wide. The query layer must choose the right rollup resolution based on time range, panel width, query semantics, and acceptable fidelity.
        </HighlightBlock>
        <p>
          This system is used by SRE teams, platform teams, product analytics teams, finance operations, IoT teams, and business intelligence groups that need trend visibility. Users rely on it during incidents and reviews, so the UI must make freshness, gaps, rollup level, and query errors explicit.
        </p>
        <p>
          Time-series dashboards differ from general BI dashboards because time is the primary coordination axis. Panels share time range, hover cursor, zoom state, annotations, and comparison offsets. A good system helps users correlate latency, traffic, errors, deployments, incidents, and resource saturation without manually aligning charts.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Multi-resolution storage keeps raw samples for short windows and rollups for longer windows. Raw data preserves fidelity for recent incident diagnosis. One-minute, five-minute, and one-hour rollups make long-range dashboards fast. Rollups should store min, max, avg, count, and sometimes percentiles because average alone can hide spikes.
        </p>
        <p>
          Adaptive query routing chooses a step and storage resolution. The query gateway estimates target points from panel width and time range, then chooses raw or rollup data that produces roughly one point every one or two pixels. This avoids over-fetching and keeps chart rendering responsive.
        </p>
        <HighlightBlock as="p" tier="important">
          The query gateway is both a performance layer and a safety layer. It normalizes PromQL, Flux, SQL, or vendor APIs, enforces concurrency limits, applies tenant context, caches results, caps time ranges, and protects data sources from dashboard fanout.
        </HighlightBlock>
        <p>
          Synchronized panels share a global time range and hover timestamp. A zoom gesture in one panel updates the dashboard time range and re-queries all panels. Hovering on one panel shows a cursor line at the same timestamp across related panels. This should be client-side and throttled so cursor movement does not cause full React re-renders.
        </p>
        <p>
          Annotations add context on top of metrics. Deployments, feature flags, incidents, maintenance windows, data-quality events, and manual notes appear as vertical lines or shaded ranges. They let users connect a metric change to a real-world event quickly.
        </p>
        <p>
          Comparison mode offsets the same query by a previous period, such as yesterday, last week, or last month. It helps users distinguish regression from seasonality. The system should clearly label comparison data and compute deltas in tooltips using metric-specific directionality where possible.
        </p>
        <p>
          Principal-level designs also model metric semantics. A counter, gauge, histogram, percentile, and event count need different rollup behavior. Averaging percentiles across intervals is often misleading. Rate conversion for counters must handle resets. Histograms may need bucket-preserving rollups. The query gateway should understand metric type and choose safe aggregation defaults instead of treating every series as a generic line.
        </p>
        <p>
          Time alignment is another core issue. Different sources can have different sampling intervals, ingestion lag, and timestamp skew. A dashboard correlating deploys, errors, latency, and CPU should show whether each panel is aligned to event time or ingestion time and whether late points have arrived. Otherwise users can infer false causality from charts that are visually aligned but semantically offset.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The architecture has four planes. The dashboard plane stores panel layouts, query definitions, thresholds, variables, and annotation sources. The query gateway plane handles resolution selection, data source routing, caching, and concurrency. The data plane includes short-retention raw stores and long-retention rollup stores. The visualization plane renders panels, synchronized cursors, annotations, and comparison overlays.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/data-heavy-systems/time-series-visualization.svg"
          alt="Time-series visualization architecture with dashboard schema, query gateway, adaptive resolution routing, data sources, chart rendering, annotations, and comparison mode."
          caption="A time-series dashboard coordinates panels through shared time state while the query gateway chooses safe, efficient resolution for each panel."
        />
        <p>
          On dashboard load, the frontend fetches the dashboard schema and global variables. It then sends panel queries through the query gateway in parallel. The gateway selects the query step from the time range and panel width, checks cache, enforces per-source concurrency limits, and routes to the correct backend. Panels render independently so one slow query does not block the whole dashboard.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/data-heavy-systems/time-series-resolution-routing.svg"
          alt="Adaptive time-series resolution routing from panel width and time range to raw, one-minute, five-minute, and one-hour rollups."
          caption="Resolution routing converts time range and panel width into a step, then selects raw or rollup data to avoid scanning unnecessary samples."
        />
        <p>
          Interactions update shared dashboard state. A time picker change, zoom gesture, or relative range refresh changes the global time range and invalidates panel query results. Hover state is separate: it updates a shared timestamp and each panel draws a cursor at that timestamp without network requests. Variable changes, such as selecting service or region, create new query parameter values and re-run affected panels.
        </p>
        <p>
          The gateway should deduplicate identical panel queries across viewers and dashboards. If a popular incident dashboard is opened by hundreds of engineers, the backend should execute one query per distinct time window and variable set, then share the cached result while respecting tenant and permission boundaries. This protects metrics stores during exactly the moments when users are most likely to stampede them.
        </p>
        <p>
          Dashboard variables should be resolved deliberately. A variable such as service, cluster, customer tier, or region can expand into many concrete series and accidentally multiply query cost. The gateway should cap variable expansion, provide search-backed variable pickers, cache variable values, and warn when a selection expands into too many series for an interactive panel.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/data-heavy-systems/time-series-panel-sync.svg"
          alt="Multi-panel synchronization showing shared time range, hover timestamp, annotations, comparison offset, and independent panel query lifecycle."
          caption="Panel synchronization keeps diagnosis fast: shared time range, cursor, annotations, and comparison overlays align metrics without coupling every panel render."
        />
        <p>
          Principal-level designs also need a dashboard publication and ownership flow. A user can create a personal exploratory dashboard with broad query freedom, but a shared incident or executive dashboard should have an owner, query budget, variable limits, data-source dependencies, and review status. Published dashboards should be checked for expensive queries, deprecated metrics, missing rollups, high-cardinality labels, and panels without useful empty-state behavior. This prevents critical dashboards from failing during the incident when everyone opens them.
        </p>
        <p>
          Long-term retention should be visible in the query plan. A dashboard may stitch recent raw data, mid-term rollups, and archived downsampled data in one time range. The gateway should return metadata that lets the UI draw boundaries or tooltips explaining where resolution changes. Without that, users may compare a recent spike-rich window against an older smoothed window and draw the wrong conclusion.
        </p>
        <p>
          Metric cardinality governance belongs in the design. A single dashboard variable that expands across customer id, pod id, endpoint, and status code can create millions of series. The query gateway should understand series cardinality, cap expensive label combinations, and show owners which dashboards are driving cardinality pressure. This is a principal-level concern because visualization products often become the visible symptom of telemetry-model mistakes.
        </p>
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2>
        <p>
          Raw data provides maximum fidelity but becomes expensive and visually wasteful over long ranges. Rollups are fast and cheap but lose detail. The system should use raw data for recent narrow windows, rollups for wide windows, and clearly show when the chart is rendering aggregated data.
        </p>
        <p>
          Canvas-based libraries such as uPlot are excellent for dense time-series panels because they avoid SVG DOM overhead. SVG-heavy libraries are easier for custom shapes and direct element interactivity but struggle with many points and many panels. A time-series system should favor a performance-focused charting layer and implement overlays separately.
        </p>
        <HighlightBlock as="p" tier="important">
          Query concurrency is a hidden scaling limit. A dashboard with 20 panels viewed by 100 people can create 2,000 queries on refresh. The query gateway needs deduplication, caching, per-source concurrency caps, and graceful queued states.
        </HighlightBlock>
        <p>
          Fixed-step queries are predictable but can over-fetch on small panels or under-fetch on large panels. Adaptive step selection improves performance and visual fidelity, but it can make query results change when a panel is resized. The UI should label step size and make exports explicit about the resolution used.
        </p>
        <p>
          Comparison mode adds diagnostic value but doubles query load for enabled panels. It should reuse cache aggressively and may need limits on dashboard-wide comparison for expensive sources. The product should let users enable comparison selectively rather than forcing it on every panel.
        </p>
        <p>
          Annotation overlays make correlation faster but can clutter charts. The design should support source filtering, severity, grouping, and collapse. Incident ranges and deployment markers should be visually distinct from threshold lines.
        </p>
        <p>
          Push-based refresh can improve live dashboards, but it can also make historical investigation unstable. Pull-based refresh is predictable and cache-friendly. A practical design uses scheduled pull refresh for most panels, live push for active incident views or narrow recent windows, and a frozen mode for post-incident analysis where charts do not mutate while the user is reviewing evidence.
        </p>
        <p>
          Alert overlays have a consistency trade-off. Showing alert firing ranges on the same chart improves diagnosis, but alert state may come from a different system with different evaluation step, label grouping, and lag. The UI should show alert rule identity, evaluation window, and label match rather than implying that the visual threshold line and alert state are computed identically.
        </p>
        <p>
          Dashboard variables trade usability for query risk. A variable picker that allows all services, all regions, or all customers is convenient but can expand into thousands of series. Restricting variables protects the backend but frustrates exploration. Mature systems use autocomplete, cardinality previews, query-cost estimates, and role-based limits so users understand the cost before refreshing the dashboard.
        </p>
        <p>
          Cross-source correlation is useful but dangerous. Combining metrics, deployment annotations, warehouse business metrics, and incident records on one timeline helps diagnosis, but each source has different lag and retention. The UI should show source freshness and timestamp semantics per panel. Otherwise a principal interviewer can challenge the design on false causality.
        </p>
        <p>
          Query caching trades freshness against source protection. Incident dashboards need current data, but hundreds of engineers refreshing the same board can overload the metrics backend. Short TTL caches, request coalescing, and stale-while-revalidate behavior protect sources while keeping users close to real time. The UI should label when a panel is serving cached data so users do not mistake protection behavior for exact freshness.
        </p>
      </section>

      <section>
        <h2>Best practices</h2>
        <p>
          Store rollups with extrema and counts, not only averages. Min-max bands, counts, and percentiles help preserve spikes, gaps, and sampling quality across long time ranges.
        </p>
        <p>
          Make query step, data freshness, and rollup level visible. Users diagnosing incidents should know whether a panel shows raw ten-second samples, one-minute rollups, or one-hour rollups.
        </p>
        <p>
          Separate hover synchronization from data fetching. Cursor movement should be client-side, throttled, and drawn through refs or canvas overlays. It should not trigger React re-render storms across all panels.
        </p>
        <p>
          Put concurrency limits and query budgets in the gateway. Do not let every browser tab query Prometheus, InfluxDB, or warehouse sources directly. The gateway should deduplicate identical requests and enforce per-tenant and per-source budgets.
        </p>
        <p>
          Treat annotations as data with permissions and source lineage. Deployment, incident, and manual annotations should be tenant-scoped, searchable, filterable, and auditable.
        </p>
        <p>
          Support graceful degradation. If one panel times out, the dashboard should still render other panels. If rollup data is unavailable, the system should explain fallback behavior rather than silently returning partial charts.
        </p>
        <p>
          Make dashboard links reproducible. Shared links should capture time range, variables, comparison mode, selected annotations, and panel focus. Relative ranges are useful for operational dashboards, but incident evidence often needs absolute timestamps so another engineer sees the same data later.
        </p>
        <p>
          Provide owner-facing query hygiene. Dashboards that repeatedly time out, query too many series, use deprecated metrics, or depend on missing rollups should be flagged before an incident. This turns the visualization system into an operationally sustainable platform rather than a collection of expensive charts.
        </p>
        <p>
          Design for incident evidence preservation. During postmortems, teams need absolute time ranges, annotation sets, alert states, and query resolution as they existed during the incident. A saved incident view should freeze those inputs and record dashboard version, variable values, and data freshness. This is different from a live dashboard link, which may shift as relative time ranges and annotations change.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          A common pitfall is querying raw data for every time range. This works for short demos and fails for 30-day or one-year dashboards. Multi-resolution rollups are foundational, not an optimization to add later.
        </p>
        <p>
          Another pitfall is hiding rollup semantics. If a user sees a smoothed average without knowing it, they may miss spikes or gaps. The chart should show aggregation level and preserve extrema where possible.
        </p>
        <p>
          Teams often trigger React state updates on every mousemove for synchronized cursors. With many panels this creates expensive re-renders. Cursor drawing should be imperatively updated or handled in canvas overlays.
        </p>
        <p>
          Dashboards can overload data sources when many users open them at once. Without cache, dedupe, and concurrency caps, one popular dashboard can become a denial-of-service event against the metrics backend.
        </p>
        <p>
          Annotation systems become noisy if every deployment, incident, and manual note is shown by default. The UI needs filtering and severity rules so context helps rather than obscures the signal.
        </p>
        <p>
          Teams also ignore dashboard lifecycle. Critical dashboards accumulate stale panels, orphaned owners, deprecated metrics, and hidden expensive queries. A principal-level platform should surface dashboard health and ownership debt instead of waiting for broken panels during an outage.
        </p>
        <p>
          Another failure is hiding gaps as flat lines. Missing samples, delayed ingestion, downsampled nulls, and true zero values have different meanings. A chart that visually connects missing points can hide telemetry outages or sensor failures. Gap rendering should be explicit and tied to source metadata.
        </p>
      </section>

      <section>
        <h2>Real-world use cases</h2>
        <p>
          SRE dashboards correlate request rate, latency, error rate, saturation, deployments, and incidents during production debugging. Shared cursors and annotations reduce time to identify a regression.
        </p>
        <p>
          Business operations dashboards track revenue, orders, inventory, conversion, refunds, and support volume. Comparison mode helps separate seasonality from actual anomalies.
        </p>
        <p>
          IoT dashboards visualize device telemetry across fleets, regions, and sensor types. Rollups and gap handling are critical because long-range views can hide intermittent device outages.
        </p>
        <p>
          Data platform dashboards monitor pipeline throughput, freshness, lag, error rates, and cost. Annotation overlays for deploys and incident windows help explain metric changes.
        </p>
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">1. How would you make 30-day time-series dashboards load quickly?</h3>
        <p>
          I would use multi-resolution storage and adaptive query routing. Raw data is used for short recent windows. Longer windows route to one-minute, five-minute, or one-hour rollups based on panel width and time range. The query gateway chooses the step, caches results, and returns only the number of points the chart can use.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">2. How do synchronized cursors work across many panels?</h3>
        <p>
          Hovering over one panel converts mouse x-position to a timestamp and writes it to shared client state. Other panels draw a cursor at that timestamp using their own x-scale. The update should be throttled and drawn through refs or canvas overlays so the dashboard does not re-render every panel on every mousemove.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">3. What does the query gateway do?</h3>
        <p>
          It normalizes query requests, selects resolution, enforces tenant context, limits concurrency, checks cache, routes to the right data source, and normalizes responses. It protects Prometheus, InfluxDB, warehouses, or long-term stores from direct dashboard fanout.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">4. How would you support annotations?</h3>
        <p>
          I would store annotations separately with tenant, type, timestamp, optional end timestamp, tags, source, and payload. The frontend fetches annotations for the dashboard range and overlays them as vertical markers or bands. Deployment and incident integrations can create annotations automatically, while manual annotations should be audited and permissioned.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">5. How does comparison mode affect the system?</h3>
        <p>
          Comparison mode duplicates panel queries with a shifted time range, such as one week earlier. It renders the comparison as a dashed or lower-opacity series and computes deltas in tooltips. It roughly doubles query load for enabled panels, so the gateway should cache comparison ranges and the UI should allow selective enablement.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">6. What would you monitor?</h3>
        <p>
          I would monitor dashboard load time, per-panel query latency, cache hit rate, gateway queue time, source concurrency, timeout rate, selected resolution, rollup fallback rate, cursor render cost, annotation query latency, comparison query load, and errors segmented by tenant, dashboard, data source, panel count, and time range.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li><a href="https://grafana.com/docs/grafana/latest/" target="_blank" rel="noreferrer">Grafana Documentation</a></li>
          <li><a href="https://prometheus.io/docs/prometheus/latest/querying/basics/" target="_blank" rel="noreferrer">Prometheus: Querying Basics</a></li>
          <li><a href="https://prometheus.io/docs/prometheus/latest/querying/api/" target="_blank" rel="noreferrer">Prometheus HTTP API</a></li>
          <li><a href="https://thanos.io/tip/components/query.md/" target="_blank" rel="noreferrer">Thanos Query and Downsampling Concepts</a></li>
          <li><a href="https://leeoniya.github.io/uPlot/" target="_blank" rel="noreferrer">uPlot: High-Performance Time-Series Charts</a></li>
          <li><a href="https://docs.influxdata.com/influxdb/" target="_blank" rel="noreferrer">InfluxDB Documentation</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
