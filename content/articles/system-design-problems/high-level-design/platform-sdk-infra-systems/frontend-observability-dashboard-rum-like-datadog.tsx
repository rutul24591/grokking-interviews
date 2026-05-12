"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-frontend-observability-dashboard-rum-like-datadog",
  title: "Design a Frontend Observability Dashboard (RUM Like Datadog)",
  description:
    "Architecture for a real user monitoring dashboard: metric collection, session replay, Core Web Vitals, error tracking, sampling strategy, and privacy-safe data collection.",
  category: "high-level-design",
  subcategory: "platform-sdk-infra-systems",
  slug: "frontend-observability-dashboard-rum-like-datadog",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-10",
  tags: ["hld", "rum", "observability", "web-vitals", "session-replay", "error-tracking"],
  relatedTopics: ["embeddable-analytics-sdk", "frontend-hosting-platform-dashboard-like-vercel"],
};

export default function FrontendObservabilityDashboardRumLikeDatadogArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A Real User Monitoring (RUM) dashboard provides visibility into the actual performance and error experience of real users in production, as opposed to synthetic monitoring (which tests from controlled environments). RUM captures Core Web Vitals (LCP, FID/INP, CLS), JavaScript errors, network request timings, session replays (screen recordings of user sessions), and custom performance marks set by the application. This data reveals performance issues that only affect specific user segments (slow connections, low-end devices, specific geographies) that synthetic tests never surface.</p>
        <p>The data collection scale is significant: a mid-size web application with 1 million daily users, each generating 100 RUM events per session, produces 100 million events per day. At 500 bytes per event, that is 50GB of raw event data per day for one customer. A multi-tenant RUM platform serving hundreds of customers must ingest, store, and query this data efficiently. The query patterns are specific: time-series aggregations (LCP p75 over the last 7 days), percentile calculations (p50, p75, p95, p99 for each metric), drill-down by dimension (by browser, country, page, release version), and session search (find all sessions where CLS &gt; 0.25 on the /checkout page).</p>
        <p><strong>Explicit assumptions:</strong> The RUM SDK is a lightweight JavaScript snippet (under 5KB gzipped) embedded in customer web applications. Session replay uses DOM snapshot + incremental mutation recording (not a video stream). Sampling is configurable: customers can sample 100% of sessions for small traffic sites and 1–10% for high-traffic sites. Privacy controls mask sensitive inputs (passwords, credit card fields) before recording. The dashboard is the query and visualization layer; the data pipeline (ingestion, storage, query) is owned by the same organization.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Core Web Vitals:</strong> Track LCP, INP (Interaction to Next Paint), CLS, FCP, and TTFB per page, with percentile breakdowns (p50, p75, p95, p99) and trend charts.</li>
          <li><strong>Error tracking:</strong> Capture unhandled JavaScript exceptions and network errors (4xx, 5xx responses from the XHR/fetch monitor). Group errors by type and message. Link errors to session replays.</li>
          <li><strong>Session replay:</strong> Record full user sessions as DOM snapshots + mutations (using the rrweb library or equivalent). Replay allows developers to watch exactly what the user experienced, with overlaid performance and error events.</li>
          <li><strong>Drill-down filtering:</strong> Filter all metrics by browser, OS, country, device type, release version, and custom tags. All chart views update when filters are applied.</li>
          <li><strong>Alerting:</strong> Configure alerts on metric thresholds (e.g., LCP p75 &gt; 2500ms for more than 5 minutes) that trigger notifications (email, Slack, PagerDuty).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Query latency:</strong> Dashboard chart queries (time-series aggregations) complete within 3 seconds for 30-day time ranges.</li>
          <li><strong>Data freshness:</strong> Events ingested within the last 5 minutes are visible in the dashboard (near-real-time, not batch-only).</li>
          <li><strong>SDK overhead:</strong> The RUM SDK adds less than 5ms of overhead to page load (measured as Time to Interactive delta).</li>
          <li><strong>Privacy:</strong> No PII (personally identifiable information) is collected without explicit configuration. Input fields are masked by default in session replay.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The system has three layers: the collection layer (the RUM SDK running in customer pages, batching and sending events to the ingestion endpoint), the processing layer (Kafka ingestion → Flink stream processing for real-time aggregation → ClickHouse for storage and query), and the presentation layer (the dashboard UI, querying ClickHouse via the RUM API). Session replay data follows a separate path: DOM snapshots are stored in S3 (too large for ClickHouse), with only metadata (session ID, timestamp, duration, event count) stored in ClickHouse for indexing and search.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/platform-sdk-infra-systems/frontend-observability-dashboard-rum-like-datadog-architecture.svg"
          alt="RUM dashboard architecture showing collection layer (RUM SDK: PerformanceObserver for Web Vitals, MutationObserver for DOM recording, XHR/fetch patching for network errors, event batch via sendBeacon), processing layer (Kafka ingestion → Flink stream processing (real-time p75/p95 aggregation per 1-minute bucket) → ClickHouse columnar storage), presentation layer (RUM API querying ClickHouse, dashboard UI with Recharts time-series, drill-down filters, session search), and session replay path (DOM snapshots → S3 storage, metadata → ClickHouse, replay playback from S3)."
          caption="RUM architecture: SDK collection (PerformanceObserver + DOM recording + network patching) → Kafka → Flink aggregation → ClickHouse, with S3 session replay storage"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">RUM SDK Data Collection</h3>
        <p>The RUM SDK collects data from four browser APIs. Web Vitals: the Web Vitals library (Google's reference implementation) wraps PerformanceObserver to capture LCP (Largest Contentful Paint), INP (Interaction to Next Paint, replacing FID), CLS (Cumulative Layout Shift), FCP (First Contentful Paint), and TTFB (Time to First Byte). Each metric fires as an event when the browser calculates it (LCP fires multiple times and settles on the final value when the page is hidden or the user navigates away). Network requests: the SDK patches window.XMLHttpRequest and window.fetch (by wrapping the originals) to intercept all network requests, recording URL, method, status code, start time, and duration. Error tracking: window.onerror and window.onunhandledrejection capture JavaScript exceptions, recording the error message, stack trace, and the URL/line/column. Session replay: the rrweb library captures a DOM snapshot at session start (a full serialization of the DOM tree) and incremental mutations thereafter (using MutationObserver and event listeners for user interactions).</p>
        <p>The SDK batches all collected events and sends them every 5 seconds (or immediately on page unload via sendBeacon). Events are structured JSON: &#123;type, sessionId, pageViewId, timestamp, attributes, metrics&#125;. The sessionId is a UUID persisted in sessionStorage (new session on new tab). The pageViewId is a UUID generated on each page view (SPA navigation triggers a new pageViewId). Custom attributes (release version, user tier, A/B experiment assignment) are set by the customer's application code via the SDK's setTag() API and attached to all subsequent events in the session.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Sampling Strategy</h3>
        <p>Collecting 100% of sessions for high-traffic applications generates enormous data volumes. Sampling reduces volume while preserving statistical validity. The SDK samples at session start: a random number is compared to the configured sample rate (0–100%); if the session is sampled, all events for that session are collected; if not sampled, no events are collected. The session-level sampling (rather than event-level sampling) is important for session replay: a partial session replay (some events sampled, others not) is unplayable and useless. Session-level sampling produces complete data for sampled sessions and no data for unsampled sessions.</p>
        <p>Error-triggered full sampling: even at a 1% sample rate, a session that encounters a JavaScript error is always fully sampled (regardless of the initial sampling decision). This is implemented by the SDK: if the session was initially marked as unsampled but an error occurs, the SDK retroactively promotes the session to sampled, replays any buffered events (the SDK maintains a 60-second circular buffer of unsent events), and sends them. This ensures that error sessions are always captured for debugging, while still reducing the volume from non-error sessions. The circular buffer adds approximately 2–5MB of memory usage for a 60-second buffer of typical event density.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Privacy-Safe Session Replay</h3>
        <p>Session replay captures all DOM mutations, including the content of input fields. Without privacy controls, session replay would record passwords, credit card numbers, and personal information typed into forms. The SDK applies privacy masking at capture time (not at playback time): input fields with type=password are never recorded (replaced with a fixed-length asterisk placeholder). All other input fields are masked by default (the recorded value is replaced with asterisks); customers can explicitly unmask specific inputs by adding a data-dd-privacy="allow" attribute. Elements with a data-dd-privacy="mask" attribute (or the CSS class .dd-privacy-mask) are replaced with a gray rectangle in the recording.</p>
        <p>The masking happens in the rrweb serialization layer: before a DOM node's text content is serialized to the event payload, the masking rules are applied. The original content never leaves the browser. This is the correct approach: masking on the server (receiving the full content and then masking it) risks PII being stored even briefly in transit or in Kafka topics. Client-side masking before transmission ensures PII never leaves the device.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Dashboard Query Layer</h3>
        <p>The dashboard's core query pattern is time-series aggregation with filters: "LCP p75 for the last 7 days, grouped by 1-hour buckets, filtered to Chrome on Windows in the US." ClickHouse serves this pattern efficiently with its columnar storage (filtering by browser and country scans only those columns) and the quantile() aggregate function (computing approximate percentiles efficiently). The RUM API translates dashboard filter selections into ClickHouse SQL queries; the query engine returns aggregated data (not raw events) to the dashboard.</p>
        <p>Pre-aggregated materialized views: for the most common queries (LCP p75 per page per hour for the last 30 days), ClickHouse materialized views pre-compute aggregates as data is ingested. Queries that hit the materialized view (aligned to the pre-aggregation granularity) return in under 500ms. Queries that require finer granularity or non-standard filters (which cannot use the materialized view) run against the raw event table and may take 2–3 seconds. The dashboard UI shows a loading state during longer queries; it does not block other interactions while a query runs.</p>
        <p>Session search: finding sessions matching specific conditions (CLS &gt; 0.25 on /checkout) requires querying the session metadata table in ClickHouse (which records per-session aggregates: max LCP, max CLS, error count, page views visited). Sessions matching the criteria are returned as a paginated list with session metadata (duration, error count, browser, country); clicking a session opens the session replay from S3. The session replay playback fetches the DOM snapshot and incremental mutation events from S3, reconstructs the DOM, and plays back the user's actions in the browser using rrweb's replay module.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Alerting and Anomaly Detection</h3>
        <p>Alerts are evaluated by a background job that runs every minute against the Flink-computed real-time aggregates (stored in Redis for the most recent 1-hour window). The alert evaluates: is the p75 LCP for the last 5-minute window above the configured threshold? If yes, fire the alert. Alerts have a recovery condition: the alert fires once when the threshold is exceeded and fires again when the metric returns below the threshold (the "recovery" event). Alert deduplication: if the condition is continuously exceeded, the alert does not fire repeatedly—it fires on the state transition (healthy → alerting) only, preventing notification spam during extended outages.</p>
        <p>Anomaly detection: rather than fixed thresholds (which require the customer to know what "normal" looks like), the platform offers anomaly detection based on historical baselines. For each metric, the system computes the expected value and standard deviation for each hour of the week (using the last 4 weeks of data). An anomaly is detected when the current value deviates more than 2 standard deviations from the historical expected value. This catches regressions that a fixed threshold would miss (e.g., LCP degrades from 1200ms to 1500ms—still below a 2500ms threshold, but significantly above the historical 1200ms baseline).</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/platform-sdk-infra-systems/frontend-observability-dashboard-rum-like-datadog-metrics-to-drilldown.svg"
          alt="RUM dashboard metrics to drill-down flow showing time-series chart (LCP p75 per hour, 7-day range) → click data point → drill-down by browser/country/page → session list (matching filter criteria) → click session → session replay playback (DOM snapshot + mutations from S3 rendered by rrweb replay). Materialized view fast path for standard queries vs raw table slow path for custom filters. Alert evaluation: Flink real-time aggregates in Redis → alert job every 1 minute → state transition (healthy → alerting) fires notification."
          caption="Drill-down flow: time-series chart → filter selection → session list → session replay from S3; materialized view fast path vs raw table slow path; alert state machine"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Session replay storage: DOM snapshot + mutations (rrweb approach) produces approximately 1–5MB of data per session (depending on session duration and DOM mutation frequency). For 1 million daily sessions at 1% sampling (10,000 replays per day), that is 10–50GB of session replay data per day per customer. S3 storage at $0.023/GB makes this approximately $0.23–$1.15/day—affordable and appropriate for long-term retention. The alternative (video stream recording using MediaRecorder) would be 10–50× larger (video is vastly larger than DOM mutations for typical web applications). DOM snapshot replay also allows overlaying events (errors, performance marks) directly on the DOM state at each timestamp, which is not possible with video replay.</p>
        <p>ClickHouse versus Druid for time-series analytics: ClickHouse provides SQL query support (familiar to most engineers), excellent single-node performance, and lower operational complexity than Druid. Druid provides sub-second query latency on pre-aggregated rollups, built-in tiered storage (hot/warm/cold), and native streaming ingestion from Kafka—features that matter for very high-scale RUM deployments (billions of events per day). For most RUM use cases, ClickHouse's materialized views provide sufficient pre-aggregation, and the simpler operational model outweighs Druid's performance advantages. At very large scale (top-tier SaaS serving millions of customers), Druid or Apache Pinot become appropriate choices.</p>
        <p>SDK performance impact: every API the SDK patches (fetch, XHR, MutationObserver) adds overhead to the host page. The total overhead should be under 5ms TTI delta. Key optimizations: the SDK initializes asynchronously (does not block page rendering), uses requestIdleCallback for non-critical operations (batching events for transmission), uses a Web Worker for DOM serialization (rrweb snapshot can take 10–50ms for complex DOMs; offloading to a Worker prevents main thread jank), and applies CSS containment principles (does not trigger layout recalculation on the host page). Regular performance benchmarking of the SDK itself (measuring its impact on Lighthouse scores on a standardized test page) should be part of the SDK release process.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A RUM observability dashboard collects Web Vitals (PerformanceObserver), JavaScript errors (window.onerror + unhandledrejection), network request timings (patched fetch/XHR), and session replays (rrweb DOM snapshot + mutations) via a lightweight SDK (under 5KB gzipped). Events are batched and sent every 5 seconds (sendBeacon on unload). Session-level sampling (1–100% configurable) reduces data volume; error-triggered full sampling via a 60-second circular buffer ensures error sessions are always captured. Privacy masking (passwords blocked, inputs masked by default, data-dd-privacy attribute for explicit control) happens client-side before transmission. The processing pipeline uses Kafka → Flink → ClickHouse (materialized views for p75/p95 time-series at hourly granularity for fast path; raw table for custom queries). Session replays are stored in S3 (1–5MB per session); session metadata is indexed in ClickHouse for search. Alerting evaluates Flink real-time aggregates (1-minute job) with state-transition firing (not repeated alerts). Anomaly detection uses 4-week historical baselines (2-standard-deviation threshold) to catch regressions that fixed thresholds miss. The defining SDK design constraint is the 5ms TTI budget, met by async initialization, requestIdleCallback batching, and Web Worker DOM serialization.</p>
      </section>
    </ArticleLayout>
  );
}
