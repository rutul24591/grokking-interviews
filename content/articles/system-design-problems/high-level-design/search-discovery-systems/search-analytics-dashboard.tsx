"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-search-analytics-dashboard",
  title: "Design a Search Analytics Dashboard",
  description:
    "Architecture for a search analytics dashboard: query volume trends, zero-result rate monitoring, top queries and trending queries, click-through rate by position, search session funnel (query → click → conversion), query clustering for topic analysis, no-click search rate (featured snippet saturation), failed search detection, search exit rate by query category, and real-time anomaly alerting for search quality degradation.",
  category: "high-level-design",
  subcategory: "search-discovery-systems",
  slug: "search-analytics-dashboard",
  wordCount: 5000,
  readingTime: 30,
  lastUpdated: "2026-05-11",
  tags: ["hld", "search-analytics", "query-analysis", "ctr", "zero-results", "funnel", "anomaly-detection"],
  relatedTopics: ["search-ranking-experimentation-ui", "google-like-search-frontend"],
};

export default function SearchAnalyticsDashboardArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A search analytics dashboard answers the operational question: "How well is our search working?" It surfaces metrics that help search engineers identify quality problems (high zero-result rate for specific query categories), product managers understand search behavior (what users are searching for, what they find, what makes them leave), and executives track high-level health (query volume trends, search-to-conversion funnel). Unlike a general analytics dashboard, a search analytics dashboard has domain-specific concerns: position bias (clicks on position 1 are not evidence of relevance), query-level granularity (aggregate metrics hide failures at the query level), and the zero-result problem (users who find nothing are a clear sign of catalog or indexing gaps).</p>
        <p>The data volume challenge is substantial: a large search system may process 100 million queries per day, each generating click events, session events, and user behavior signals. Computing query-level metrics over this volume in real time requires a streaming pipeline (Kafka → ClickHouse or BigQuery) and pre-aggregated materialized views for common time ranges. The anomaly detection requirement adds real-time complexity: zero-result rate spikes (caused by indexing failures, query parsing bugs, or sudden changes in user query patterns) must be detected and alerted within minutes, before they affect a significant portion of the user base.</p>
        <p><strong>Explicit scope:</strong> Query volume trends, zero-result rate, CTR by position, search session funnel, query clustering, and anomaly alerting. Not in scope: the search indexing pipeline monitoring, A/B experiment metrics (covered in the experimentation UI), or user-level search history.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Query volume trends:</strong> Time-series chart showing queries per hour/day/week, segmented by query category (product search, navigational, informational, transactional), device type, and geography. Overlay events (deployments, ranking changes, external events) on the chart for correlation. Detect anomalies (volume spikes or drops &gt;20% from baseline).</li>
          <li><strong>Zero-result analysis:</strong> Percentage of queries with zero results over time. Top zero-result queries (most frequently searched queries that return no results), grouped by category. Drill-down: which terms trigger zero results (often brand names, model numbers, or typos not in the index).</li>
          <li><strong>Click-through rate by position:</strong> CTR for each SERP position (1–10) across all queries. Position bias curve (CTR vs. position, typically a steep power law). CTR trends over time: a CTR drop at position 1 may indicate ranking degradation or SERP layout changes. Per-query-category CTR breakdown.</li>
          <li><strong>Search session funnel:</strong> Funnel visualization: Sessions with search → Sessions with at least 1 click → Sessions that reached a product/article page → Sessions that converted (purchase, signup, etc.). Drop-off at each step identifies where search is failing. Segment by query category to identify which query types have the worst conversion.</li>
          <li><strong>Query clustering and trending:</strong> Group similar queries into topic clusters (using embedding similarity or Jaccard overlap on query tokens). Show cluster size and growth trends. Surface newly trending queries (queries with rapidly increasing volume in the last hour compared to the same hour last week).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Dashboard latency:</strong> Pre-aggregated metrics (hourly/daily) load within 2 seconds. Real-time metrics (last 15 minutes) load within 5 seconds from the streaming store.</li>
          <li><strong>Alert latency:</strong> Zero-result rate anomaly alerts fire within 5 minutes of the anomaly starting. Alert channels: email, Slack, and PagerDuty for critical alerts.</li>
          <li><strong>Data freshness:</strong> Dashboard metrics are at most 5 minutes stale for real-time metrics and 1 hour stale for historical aggregates.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The search analytics pipeline has two paths. The real-time path: the SERP emits query and click events to a Kafka topic (search.events). A Flink or Kafka Streams job consumes these events and writes per-minute aggregates (query count, click count, zero-result count) to ClickHouse. The dashboard reads the real-time ClickHouse tables for metrics in the last 15 minutes. The batch path: a nightly aggregation job computes richer metrics (query clustering, session funnel, CTR by position) over the full day's data and writes to a set of pre-aggregated tables in ClickHouse. These pre-aggregated tables power the historical charts and trend analysis. The anomaly detection system is a separate streaming job that runs every minute, comparing the last-minute metrics to a rolling baseline (same minute last week ± 2 standard deviations) and fires alerts when metrics exceed thresholds.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/search-discovery-systems/search-analytics-dashboard.svg"
          alt="Search analytics dashboard architecture showing event pipeline (SERP: emit query_event {queryId query userId sessionId timestamp deviceType queryCategory zeroResult resultCount} + click_event {queryId position docId sessionId dwellTimeMs}; Kafka search.events topic; Flink job: 1-min tumbling window → aggregate {minute queryCount clickCount zeroResultCount} → ClickHouse search_metrics_realtime), query volume dashboard (time selector: 15min 1h 24h 7d 30d; ClickHouse query: SELECT time bucket(1h ts) count(*) FROM search_metrics WHERE time &gt; now-period; Recharts line chart overlaid; segment toggle: device type geography category; event overlay: deployment markers on timeline; anomaly highlight: red band when &gt;20% deviation from baseline), zero-result analysis (zero_result_rate = zeroResultCount/queryCount; top zero queries: SELECT query count(*) WHERE zeroResult=true GROUP BY query ORDER BY count DESC LIMIT 100; categorize by term type: brand name product-code typo; trend: 7-day zero-result rate line chart; drill-down: query → results returned → gap analysis), CTR by position chart (join query_events + click_events on queryId; CTR[pos] = clicks at position n / impressions at position n; bar chart positions 1-10; position bias curve; period-over-period comparison: this week vs last week; per-category CTR: product queries vs navigational), session funnel (session stitching: group events by sessionId; funnel stages: searches WITH_SEARCH / AT_LEAST_1_CLICK / REACHED_PRODUCT_PAGE / CONVERTED; bar chart with drop-off percentages; segment by query category; identify worst-converting query types), query clustering (offline job nightly: vectorize top 10K queries with embedding model; k-means clustering k=50; cluster label: most common query in cluster; cluster size + 7-day trend; emerging clusters: new queries not in previous clusters; trending: volume growth rate last 24h vs prior 24h), anomaly detection (Flink alerting job: per-minute zero_result_rate → compare to rolling_baseline_rate ± 2σ; threshold breached → POST /api/alerts {metric:zero_result_rate value:0.23 baseline:0.08 severity:critical}; PagerDuty API → on-call page; Slack webhook → #search-oncall channel; dashboard: alert history timeline with acknowledged dismissed)."
          caption="Kafka search events (query + click) → Flink 1-min aggregates → ClickHouse, query volume time-series (bucket query, anomaly highlight bands), zero-result top queries (GROUP BY + gap analysis), CTR-by-position bar chart (join query+click events), session funnel (sessionId stitching, per-category drop-off), nightly query clustering (k-means on embeddings, emerging cluster detection), and Flink anomaly alerting (rolling baseline ±2σ, PagerDuty + Slack)"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Event Schema and Pipeline</h3>
        <p>The SERP emits two primary event types. A query_event is emitted on each search: {`{ queryId (UUID), query (string), userId (if logged in), sessionId, timestamp, deviceType, queryCategory, zeroResult (boolean), resultCount, experimentBucket }`}. A click_event is emitted on each result click: {`{ queryId, position, docId, sessionId, timestamp, dwellTimeMs (measured when user leaves the page via visibilitychange event) }`}. These events are published to a Kafka topic (search.events) using the browser's Beacon API (navigator.sendBeacon('/api/events', payload)) to ensure events are sent even when the user navigates away immediately after clicking.</p>
        <p>The Flink streaming job consumes from search.events and computes 1-minute tumbling window aggregates: for each minute, the total query count, click count, zero-result count, and a map of &#123;queryId: position_clicked&#125; are written to ClickHouse. The ClickHouse schema is optimized for time-series queries: the search_metrics_realtime table is partitioned by day, sorted by (timestamp, queryCategory), and uses the ReplacingMergeTree engine for idempotent inserts. The Flink job also emits session-level events: when a session ends (30-minute inactivity timeout), a session_summary event is emitted with the session's query count, click count, and conversion flag, which is consumed by the funnel aggregation job.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">CTR by Position and Position Bias Analysis</h3>
        <p>CTR by position is computed by joining query events with click events on queryId and grouping by position: CTR[position] = COUNT(click_events WHERE position=N) / COUNT(query_events). This produces the position bias curve — typically a steep power law where position 1 receives 30–40% CTR and position 10 receives 2–3% CTR. The position bias curve is itself a useful diagnostic: a flatter-than-expected curve may indicate SERP features (featured snippets, carousels) that redirect attention away from organic results; a steeper curve may indicate that only the first result is satisfying users' needs (a sign of strong navigational queries dominating the query mix).</p>
        <p>Period-over-period CTR comparison: the dashboard overlays the current week's CTR curve with the previous week's. A significant drop in CTR at position 1 (while position 2–10 are stable) may indicate that the top-ranked result is now less relevant (a ranking regression). A drop across all positions may indicate a SERP layout change (a new rich snippet at the top pushing organic results down) or an external factor (a news event that satisfies user intent without requiring a click). The dashboard allows engineers to annotate these drops with explanations, building institutional knowledge about what causes CTR changes.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Zero-Result Analysis and Gap Detection</h3>
        <p>Zero-result queries (queries where the search returns no results) represent catalog gaps or query understanding failures. The zero-result dashboard shows: the overall zero-result rate trend (target: &lt;5%), the top 100 zero-result queries by volume (most frequently searched terms with no results), and a categorization of zero-result query types. Categorization: some zero-result queries are brand names not in the catalog (catalog gap — the item should be added), some are typos (query understanding failure — spell correction should catch these), and some are out-of-scope queries (users searching for things the platform doesn't support, e.g., searching for a restaurant on a software documentation site).</p>
        <p>Gap detection: for zero-result queries that are brand names or product model numbers, an automated gap detection job compares the query terms against the product catalog and flags categories where many high-volume queries have no matching products. These gaps are surfaced as a prioritized list ("Electronics &gt; Phones: 23 high-volume queries with zero results, estimated 50K monthly missed sessions") for catalog expansion decisions. The gap list is exported as a CSV for the merchandising team to act on.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Anomaly Detection and Alerting</h3>
        <p>The anomaly detection system is a Flink job that runs every minute. For each metric (zero-result rate, query volume, CTR at position 1), it compares the current value to a rolling baseline computed as the exponential moving average (EMA) of the same metric at the same time of day for the past 7 days. The alerting threshold is: if the current value exceeds baseline ± 2 standard deviations, an alert is triggered. The alert severity is determined by the magnitude of deviation: &gt;2σ = Warning (Slack notification), &gt;3σ = Critical (PagerDuty page). Alert deduplication: if an alert fires every minute for 10 minutes, only the first and last alerts are sent (not 10 identical Slack messages).</p>
        <p>The dashboard's alert history timeline shows all alerts from the last 30 days with their timestamps, severity, metric value vs. baseline, and status (Active / Acknowledged / Resolved). Engineers can annotate alerts with root cause (e.g., "Caused by deployment at 14:32 that changed query normalization") to build a learning database of past incidents. Alert silence windows allow engineers to suppress alerts during planned maintenance (e.g., "suppress zero-result alerts from 2am to 3am during index rebuild").</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Pre-aggregated tables versus ad-hoc queries: pre-aggregated tables (computing hourly metrics nightly and storing in summary tables) allow fast dashboard loads (&lt;2 seconds) but limit the granularity of analysis — if the pre-aggregation bucketed by hour, you cannot drill down to the minute. Ad-hoc queries against the raw event data allow arbitrary granularity but may take minutes for historical queries over billions of events. The solution: pre-aggregate at multiple granularities (minute for the last 24 hours, hour for the last 30 days, day for the last year) and route queries to the appropriate table. ClickHouse's Materialized Views make multi-granularity pre-aggregation efficient — the views are updated incrementally as new data arrives.</p>
        <p>Session stitching accuracy: session stitching (grouping events by sessionId) depends on consistent sessionId assignment. Browser-side sessionIds (stored in sessionStorage) are accurate for single-tab usage but fail for multi-tab scenarios (each tab has a separate session) and for users who clear cookies between sessions. Server-side session stitching (grouping events within a time window by userId + device fingerprint) is more robust but computationally expensive and raises privacy concerns. The dashboard should display session-level metrics with the caveat that session boundaries are approximate, particularly for anonymous users.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A search analytics dashboard is built on a two-path pipeline: real-time (SERP Beacon API → Kafka → Flink 1-min aggregates → ClickHouse) for sub-5-minute freshness, and batch (nightly aggregation → pre-computed summary tables) for historical trend analysis. Key metrics: query volume time-series (with deployment overlay markers and ±20% anomaly highlight bands), zero-result rate trend with top-100 zero-result query drill-down and catalog gap detection, CTR-by-position curve (power law shape analysis, period-over-period comparison), session funnel (sessionId stitching, per-category drop-off rates), and query clustering (nightly k-means on embeddings, emerging cluster detection). Anomaly alerting uses Flink EMA baseline comparison (±2σ Warning, ±3σ Critical) with PagerDuty and Slack integration, alert deduplication, and silence windows for planned maintenance. The core operational principle: a search system should be able to detect its own quality degradation within 5 minutes — the anomaly detection system is the early warning infrastructure that prevents small indexing failures or ranking regressions from becoming hours-long user-facing incidents.</p>
      </section>
    </ArticleLayout>
  );
}
