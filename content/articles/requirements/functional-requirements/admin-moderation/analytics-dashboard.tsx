"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-admin-frontend-analytics-dashboard",
  title: "Analytics Dashboard",
  description:
    "Comprehensive guide to implementing analytics dashboards covering user analytics, content metrics, business KPIs, data visualization, real-time updates, custom reporting, and executive dashboards for data-driven decision making.",
  category: "functional-requirements",
  subcategory: "admin-moderation",
  slug: "analytics-dashboard",
  version: "extensive",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-31",
  tags: [
    "requirements",
    "functional",
    "admin",
    "analytics",
    "dashboard",
    "frontend",
    "metrics",
    "data-visualization",
  ],
  relatedTopics: ["admin-dashboard", "reporting-tools-ui", "monitoring-tools", "business-intelligence"],
};

export default function AnalyticsDashboardArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Analytics dashboard provides data-driven insights into user behavior, content performance, business metrics, and operational health for informed decision-making. The dashboard is the primary tool for product managers, executives, and analysts to understand platform performance, identify trends, and make data-driven decisions. For staff and principal engineers, analytics dashboard implementation involves data aggregation (metrics from multiple sources), real-time updates (WebSocket for live metrics), data visualization (charts, graphs, tables), and role-based views (different metrics for different roles).
        </p>
        <p>
          The complexity of analytics dashboards extends beyond simple chart display. Data aggregation must handle large datasets (millions of events per day), real-time updates (WebSocket for live metrics), and historical trends (time-series data). Data visualization must be clear (easy to understand), accurate (correct data), and actionable (insights for decisions). Role-based views ensure users see relevant metrics (executives see business KPIs, product managers see user metrics, engineers see operational metrics). The dashboard must support custom reporting (custom date ranges, custom metrics, custom filters) and export (CSV, PDF, scheduled reports).
        </p>
        <p>
          For staff and principal engineers, analytics dashboard architecture involves data pipeline (event collection, aggregation, storage), real-time infrastructure (WebSocket, streaming aggregation), visualization library (charting library selection), and caching strategy (cache common queries, pre-compute metrics). The system must support multiple data sources (user service, content service, payment service), multiple metric types (counts, rates, trends), and multiple time ranges (real-time, hourly, daily, weekly, monthly). Performance is critical—dashboards must load quickly (&lt; 2 seconds) even with large datasets.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>User Analytics</h3>
        <p>
          User acquisition metrics track how users find the platform. Signups by source (organic, paid, referral, social). Conversion funnel (visit → signup → activation). Cost per acquisition (CPA by channel). Retention by acquisition source (which sources retain best). Cohort analysis (retention by signup cohort).
        </p>
        <p>
          User engagement metrics track how users interact with the platform. DAU/MAU (daily active users / monthly active users, engagement ratio). Session duration (average time per session). Pages per session (average pages viewed). Actions per session (average actions taken). Retention rate (D1, D7, D30 retention). Churn rate (users lost / total users).
        </p>
        <p>
          User demographics show user composition. Geography (users by country, region, city). Device (mobile, desktop, tablet). Browser (Chrome, Safari, Firefox). OS (iOS, Android, Windows, Mac). Language (primary language). Age/gender (if collected).
        </p>

        <h3 className="mt-6">Content Metrics</h3>
        <p>
          Content creation metrics track content production. Content created (posts, comments, uploads per day/week/month). Creation trend (growth/decline over time). Creator distribution (how many users create content). Top creators (most prolific creators). Content by type (text, image, video, link).
        </p>
        <p>
          Content consumption metrics track content consumption. Views (total views, unique viewers). Engagement (likes, comments, shares per post). Viral coefficient (shares per view). Watch time (for video content). Read time (for text content). Completion rate (how much of content consumed).
        </p>
        <p>
          Content quality metrics track content health. Report rate (reports per 1000 posts). Removal rate (removed content / total). Quality score (composite metric). Top performing content (most engaged). Low quality content (high report, low engagement).
        </p>

        <h3 className="mt-6">Business KPIs</h3>
        <p>
          Revenue metrics track business performance. Total revenue (daily, weekly, monthly). Revenue by source (subscriptions, ads, transactions). ARPU (average revenue per user). ARPPU (average revenue per paying user). LTV (lifetime value). LTV:CAC ratio (lifetime value / customer acquisition cost).
        </p>
        <p>
          Growth metrics track platform growth. User growth (new users, growth rate). Revenue growth (revenue growth rate). Engagement growth (engagement growth rate). Viral growth (viral coefficient, viral loop). Conversion rates (visit to signup, signup to activation, activation to paying).
        </p>
        <p>
          Operational metrics track platform health. Uptime (platform availability). Error rate (errors per 1000 requests). Latency (p50, p95, p99 response times). Support tickets (volume, resolution time). Moderation queue (queue size, resolution time).
        </p>

        <h3 className="mt-6">Data Visualization</h3>
        <p>
          Chart types display different data. Line charts (trends over time). Bar charts (comparisons). Pie charts (proportions). Area charts (cumulative totals). Scatter plots (correlations). Heat maps (density). Funnel charts (conversion funnels). Cohort charts (retention cohorts).
        </p>
        <p>
          Dashboard layouts organize metrics. Summary view (key metrics at a glance). Detailed view (drill-down into metrics). Comparison view (compare periods, segments). Trend view (trends over time). Custom views (user-defined dashboards).
        </p>
        <p>
          Interactive features enable exploration. Date range picker (custom date ranges). Filters (filter by segment, source, type). Drill-down (click to see details). Export (CSV, PDF export). Scheduled reports (email reports on schedule).
        </p>

        <h3 className="mt-6">Real-time Updates</h3>
        <p>
          Real-time metrics update live. WebSocket connection (push updates). Update frequency (every second, every 10 seconds). Metrics (current users, current revenue, current events). Alerts (threshold breaches, anomalies).
        </p>
        <p>
          Streaming aggregation computes real-time metrics. Stream processing (process events as they arrive). Aggregation (count, sum, average in real-time). Windowing (tumbling windows, sliding windows). State management (maintain aggregation state).
        </p>
        <p>
          Caching strategy optimizes performance. Cache common queries (cache dashboard metrics). Pre-compute metrics (pre-compute hourly/daily metrics). Cache invalidation (invalidate on new data). TTL-based caching (time-based expiration).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Analytics dashboard architecture spans data pipeline, aggregation, visualization, and real-time updates. Data pipeline collects events from multiple sources (user service, content service, payment service). Aggregation layer computes metrics (counts, rates, trends). Visualization layer displays metrics (charts, graphs, tables). Real-time layer pushes live updates (WebSocket).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/admin-moderation/analytics-dashboard/analytics-architecture.svg"
          alt="Analytics Dashboard Architecture"
          caption="Figure 1: Analytics Dashboard Architecture — Data pipeline, aggregation, visualization, and real-time updates"
          width={1000}
          height={500}
        />

        <h3>Data Pipeline</h3>
        <p>
          Event collection gathers data from sources. User events (signups, logins, profile updates). Content events (posts, comments, likes, shares). Payment events (subscriptions, transactions, refunds). Operational events (errors, performance, moderation). Collection methods (event tracking, server-side logging, third-party integrations).
        </p>
        <p>
          Event streaming processes events in real-time. Stream processing (Kafka, Kinesis, Pub/Sub). Real-time aggregation (count, sum, average). Windowing (tumbling windows, sliding windows). State management (maintain aggregation state).
        </p>
        <p>
          Data storage stores aggregated data. Time-series database (InfluxDB, TimescaleDB) for time-series metrics. Data warehouse (BigQuery, Redshift, Snowflake) for historical analysis. Cache (Redis) for common queries. Data lake (raw event storage).
        </p>

        <h3 className="mt-6">Aggregation Layer</h3>
        <p>
          Real-time aggregation computes live metrics. Stream processing (process events as they arrive). Aggregation functions (count, sum, average, distinct count). Windowing (1-minute windows, 5-minute windows, hourly). State management (maintain running totals).
        </p>
        <p>
          Batch aggregation computes historical metrics. Scheduled jobs (hourly, daily, weekly aggregation). Aggregation queries (aggregate raw data). Storage (store aggregated results). Incremental aggregation (update existing aggregates).
        </p>
        <p>
          Pre-computation optimizes query performance. Pre-compute common metrics (DAU, MAU, retention). Pre-compute trends (growth rates, trends). Cache pre-computed results. Invalidate on new data.
        </p>

        <h3 className="mt-6">Visualization Layer</h3>
        <p>
          Chart library renders visualizations. Library selection (Chart.js, D3.js, Recharts, Plotly). Chart types (line, bar, pie, area, scatter, heat map, funnel, cohort). Interactivity (zoom, pan, hover details). Responsiveness (mobile-friendly charts).
        </p>
        <p>
          Dashboard layout organizes charts. Grid layout (grid of charts). Summary view (key metrics at top). Detailed view (drill-down charts). Customizable layouts (user-defined dashboards). Templates (pre-defined dashboards).
        </p>
        <p>
          Interactive features enable exploration. Date range picker (custom date ranges). Filters (filter by segment, source, type). Drill-down (click to see details). Export (CSV, PDF export). Scheduled reports (email reports on schedule).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/admin-moderation/analytics-dashboard/data-pipeline.svg"
          alt="Data Pipeline and Aggregation"
          caption="Figure 2: Data Pipeline and Aggregation — Event collection, streaming, batch aggregation, and storage"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Real-time Updates</h3>
        <p>
          WebSocket infrastructure pushes real-time updates. WebSocket server (maintain connections). Connection management (handle connections, disconnections). Message routing (route updates to connected clients). Scaling (scale WebSocket servers).
        </p>
        <p>
          Update frequency balances freshness with performance. High frequency (every second for critical metrics). Medium frequency (every 10 seconds for important metrics). Low frequency (every minute for less critical). Configurable per metric.
        </p>
        <p>
          Caching strategy optimizes performance. Cache dashboard metrics (cache common queries). Pre-compute metrics (pre-compute hourly/daily). Cache invalidation (invalidate on new data). TTL-based caching (time-based expiration).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/admin-moderation/analytics-dashboard/dashboard-layouts.svg"
          alt="Dashboard Layouts and Visualizations"
          caption="Figure 3: Dashboard Layouts and Visualizations — Summary view, detailed view, and chart types"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Analytics dashboard design involves trade-offs between real-time freshness and performance, flexibility and simplicity, and detail and overview. Understanding these trade-offs enables informed decisions aligned with business needs and technical constraints.
        </p>

        <h3>Real-time vs. Batch Processing</h3>
        <p>
          Real-time processing (stream processing). Pros: Fresh metrics (live updates), actionable (immediate insights). Cons: Complex (streaming infrastructure), expensive (real-time processing). Best for: Critical metrics (current users, current revenue), operational dashboards.
        </p>
        <p>
          Batch processing (scheduled aggregation). Pros: Simple (scheduled jobs), cheap (batch processing). Cons: Stale metrics (hourly/daily updates), not actionable immediately. Best for: Historical metrics (trends, cohorts), business dashboards.
        </p>
        <p>
          Hybrid: real-time for critical, batch for historical. Pros: Best of both (fresh for critical, cheap for historical). Cons: Complexity (two processing pipelines). Best for: Most production systems—balance freshness with cost.
        </p>

        <h3>Customization: Fixed vs. Customizable Dashboards</h3>
        <p>
          Fixed dashboards (pre-defined layouts). Pros: Consistent (everyone sees same), optimized (pre-computed). Cons: Inflexible (can&apos;t customize), one-size-fits-all. Best for: Standard reporting, executive dashboards.
        </p>
        <p>
          Customizable dashboards (user-defined layouts). Pros: Flexible (users customize), relevant (see what matters). Cons: Complex (layout management), inconsistent. Best for: Power users, analysts.
        </p>
        <p>
          Hybrid: templates + customization. Pros: Best of both (templates for standard, custom for power users). Cons: Complexity (two modes). Best for: Most production systems—templates for most, customization for power users.
        </p>

        <h3>Data Freshness: Real-time vs. Near-real-time</h3>
        <p>
          Real-time (sub-second updates). Pros: Freshest data, immediate insights. Cons: Expensive (real-time infrastructure), complex. Best for: Critical operational metrics (current users, errors).
        </p>
        <p>
          Near-real-time (1-5 minute updates). Pros: Fresh enough for most, cheaper than real-time. Cons: Not truly real-time, slight delay. Best for: Most business metrics (signups, revenue, engagement).
        </p>
        <p>
          Batch (hourly/daily updates). Pros: Cheapest, simplest. Cons: Stale data, not actionable immediately. Best for: Historical trends, cohort analysis, executive reports.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/admin-moderation/analytics-dashboard/processing-comparison.svg"
          alt="Processing Comparison"
          caption="Figure 4: Processing Comparison — Real-time vs. batch, fixed vs. customizable dashboards"
          width={1000}
          height={450}
        />

        <h3>Chart Library: Heavyweight vs. Lightweight</h3>
        <p>
          Heavyweight libraries (D3.js, Plotly). Pros: Powerful (many chart types), flexible (custom visualizations). Cons: Large bundle, complex API, steep learning curve. Best for: Complex visualizations, data-heavy dashboards.
        </p>
        <p>
          Lightweight libraries (Chart.js, Recharts). Pros: Small bundle, simple API, easy to use. Cons: Limited chart types, less flexible. Best for: Standard dashboards, common chart types.
        </p>
        <p>
          Hybrid: lightweight for standard, heavyweight for complex. Pros: Best of both (simple for standard, powerful for complex). Cons: Complexity (two libraries). Best for: Most production systems—lightweight for most, heavyweight for special cases.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Define key metrics:</strong> Identify key metrics for each role (executives, product, engineering). Focus on actionable metrics. Avoid vanity metrics.
          </li>
          <li>
            <strong>Implement real-time updates:</strong> WebSocket for critical metrics. Configurable update frequency. Fallback to polling if WebSocket unavailable.
          </li>
          <li>
            <strong>Design role-based views:</strong> Executive view (business KPIs). Product view (user metrics, engagement). Engineering view (operational metrics, performance).
          </li>
          <li>
            <strong>Enable customization:</strong> Custom date ranges. Custom filters. Custom dashboards. Save custom views.
          </li>
          <li>
            <strong>Optimize performance:</strong> Pre-compute metrics. Cache common queries. Lazy load charts. Virtual scrolling for large datasets.
          </li>
          <li>
            <strong>Provide export:</strong> CSV export. PDF export. Scheduled reports (email on schedule). API access (programmatic access).
          </li>
          <li>
            <strong>Ensure data accuracy:</strong> Data validation (validate incoming data). Reconciliation (reconcile with source systems). Audit trails (track data changes).
          </li>
          <li>
            <strong>Implement drill-down:</strong> Click to see details. Drill-down hierarchy (summary → detail → raw data). Breadcrumbs (navigation trail).
          </li>
          <li>
            <strong>Support mobile:</strong> Responsive charts. Mobile-friendly layouts. Touch-friendly interactions.
          </li>
          <li>
            <strong>Document metrics:</strong> Metric definitions (what each metric means). Calculation methods (how metrics are calculated). Data sources (where data comes from).
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Too many metrics:</strong> Overwhelming dashboards. Solution: Focus on key metrics. Role-based views. Progressive disclosure.
          </li>
          <li>
            <strong>Poor performance:</strong> Slow dashboards. Solution: Pre-compute metrics, cache queries, lazy load charts.
          </li>
          <li>
            <strong>No real-time updates:</strong> Stale data. Solution: WebSocket for critical metrics, configurable frequency.
          </li>
          <li>
            <strong>Poor data accuracy:</strong> Wrong metrics. Solution: Data validation, reconciliation, audit trails.
          </li>
          <li>
            <strong>No customization:</strong> Can&apos;t customize views. Solution: Custom date ranges, filters, dashboards.
          </li>
          <li>
            <strong>Poor mobile support:</strong> Not mobile-friendly. Solution: Responsive design, mobile layouts.
          </li>
          <li>
            <strong>No documentation:</strong> Don&apos;t know what metrics mean. Solution: Document metrics, calculations, sources.
          </li>
          <li>
            <strong>No export:</strong> Can&apos;t export data. Solution: CSV, PDF export, scheduled reports.
          </li>
          <li>
            <strong>Poor chart selection:</strong> Wrong chart types. Solution: Match chart type to data (line for trends, bar for comparisons).
          </li>
          <li>
            <strong>No drill-down:</strong> Can&apos;t see details. Solution: Implement drill-down, breadcrumbs.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Facebook Analytics</h3>
        <p>
          Facebook analytics for page owners. User metrics (page likes, reach, engagement). Post metrics (post reach, engagement, clicks). Audience metrics (demographics, location, device). Real-time updates (live viewers, live engagement). Export (CSV, PDF). Scheduled reports.
        </p>

        <h3 className="mt-6">Google Analytics</h3>
        <p>
          Google Analytics for website owners. User metrics (users, sessions, bounce rate). Acquisition (source, medium, campaign). Behavior (pages, time on site, events). Conversion (goals, e-commerce). Real-time (current users, current pages). Custom dashboards. Custom reports.
        </p>

        <h3 className="mt-6">Mixpanel</h3>
        <p>
          Mixpanel for product analytics. User metrics (DAU, MAU, retention). Funnel analysis (conversion funnels). Cohort analysis (retention cohorts). Event tracking (custom events). Real-time updates. Custom dashboards. Export.
        </p>

        <h3 className="mt-6">Tableau</h3>
        <p>
          Tableau for business intelligence. Data visualization (charts, graphs, maps). Dashboards (custom dashboards). Data sources (multiple data sources). Real-time data (live connections). Export (PDF, image). Scheduled reports.
        </p>

        <h3 className="mt-6">Looker</h3>
        <p>
          Looker for data exploration. Data modeling (LookML). Exploration (explore data). Dashboards (custom dashboards). Real-time updates. Scheduled reports. API access.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you design analytics dashboards for different roles, and what metrics matter most for each?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Design role-based views with progressive disclosure (summary → detail). Executives need business KPIs (revenue, growth, retention, LTV:CAC ratio)—focus on trends and anomalies, not raw data. Product managers need user metrics (DAU/MAU, engagement, conversion funnels, feature adoption). Engineering needs operational metrics (error rates, latency percentiles, throughput, system health). The key trade-off is between customization and standardization—provide template dashboards for common roles but allow power users to customize. At scale, pre-compute role-specific aggregations to reduce query load. Critical: ensure metric definitions are consistent across roles to avoid confusion.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle real-time updates in analytics dashboards, and when is real-time actually necessary?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use WebSocket for truly critical metrics requiring sub-second updates (active users during product launches, revenue during sales events, system health during incidents). Use polling for business metrics where slight delay is acceptable (DAU, conversion rates, engagement metrics)—typically 10-60 second intervals. The key insight: most metrics don&apos;t need real-time updates. Real-time adds significant complexity (connection management, state synchronization) and cost (continuous computation). Implement configurable update frequency per metric, fallback to polling if WebSocket fails, and update throttling to prevent UI thrashing. Pre-aggregate metrics and cache results to reduce backend load.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize dashboard performance when dealing with millions of data points and high query volumes?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement multi-layer optimization strategy. At the data layer: pre-compute aggregations (hourly, daily, weekly) and store in materialized views or dedicated analytics database (ClickHouse, Druid). Cache common queries in Redis with appropriate TTL based on data freshness requirements. At the query layer: aggregate at query time—never fetch raw data for dashboards, use indexes on time-series data. At the presentation layer: lazy load charts (load visible charts first), implement virtual scrolling for large datasets, limit data points rendered (downsample for large time ranges). The key trade-off is between data freshness and performance—aggressive caching improves performance but may show stale data. Consider incremental updates for real-time dashboards.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure data accuracy in analytics dashboards, and how do you handle data discrepancies?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement data quality at every layer. At ingestion: validate incoming data (schema validation, range checks, anomaly detection). During processing: reconcile with source systems (compare dashboard metrics with raw data counts), implement data quality monitoring with alerts on anomalies (sudden drops, spikes, missing data). Maintain audit trails tracking data changes and processing steps. Document metric definitions clearly—this is critical as different teams often calculate the same metric differently. When discrepancies occur (and they will), have a clear escalation process: identify source of truth, investigate root cause (data pipeline issue? definition mismatch?), communicate transparently with users. Consider implementing data quality scores visible to users so they know confidence level.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement drill-down functionality that scales well and provides meaningful insights?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Design hierarchical data structure (summary → aggregated detail → raw data). Implement click handlers for drill-down with breadcrumbs showing navigation trail. Use state management to track current drill-down level and enable easy navigation back. Critical for scale: pre-fetch next level data on hover or implement smart caching—users shouldn&apos;t wait for drill-down queries. Limit drill-down depth (3-4 levels maximum) to prevent overwhelming users and excessive queries. The key consideration is understanding user intent—most users want to identify anomalies in summaries, then drill to understand root cause. Provide context at each level (how does this segment compare to overall?). For very large datasets, consider sampling at detail levels rather than showing everything.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you choose appropriate chart types for different data and use cases, and what are common visualization mistakes?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Match chart type to data relationship and user task. Line charts for trends over time (revenue, users). Bar charts for comparisons (feature adoption by segment). Area charts for cumulative totals or part-to-whole over time. Scatter plots for correlations (ad spend vs. conversions). Heat maps for density (user activity by hour/day). Funnel charts for conversion analysis. Cohort charts for retention analysis. Common mistakes: using pie charts for complex comparisons (humans are bad at comparing angles), 3D charts (distort data), too many colors (cognitive overload), missing context (no benchmarks or targets), and chart junk (unnecessary decorations). The key principle: choose the simplest chart that accurately represents the data relationship. Always consider color-blind accessibility.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.nngroup.com/articles/dashboard-design/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — Dashboard Design
            </a>
          </li>
          <li>
            <a
              href="https://www.tableau.com/learn/articles/data-visualization"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tableau — Data Visualization Guide
            </a>
          </li>
          <li>
            <a
              href="https://mixpanel.com/blog/analytics-dashboard/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mixpanel — Analytics Dashboard Guide
            </a>
          </li>
          <li>
            <a
              href="https://looker.com/blog/dashboard-design-best-practices"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Looker — Dashboard Design Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://www.chartjs.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chart.js — Charting Library
            </a>
          </li>
          <li>
            <a
              href="https://d3js.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              D3.js — Data-Driven Documents
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
