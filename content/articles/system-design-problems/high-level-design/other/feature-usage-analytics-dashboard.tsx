"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-feature-usage-analytics-dashboard",
  title: "Design a Feature Usage Analytics Dashboard",
  description:
    "Architecture for a product analytics / feature usage dashboard: client-side event SDK with batching and sampling, server-side event ingestion pipeline, funnel analysis, retention cohort computation, A/B experiment metric tracking, session replay event storage, feature flag usage correlation, privacy-safe anonymization, and real-time and batch analytics serving.",
  category: "high-level-design",
  subcategory: "other",
  slug: "feature-usage-analytics-dashboard",
  wordCount: 5200,
  readingTime: 32,
  lastUpdated: "2026-05-11",
  tags: ["hld", "analytics", "product-analytics", "funnel", "retention", "cohort", "event-pipeline"],
  relatedTopics: ["survey-form-analytics-system", "customer-support-dashboard"],
};

export default function FeatureUsageAnalyticsDashboardArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A feature usage analytics dashboard (think Mixpanel, Amplitude, or PostHog) answers the question: how are users actually using our product? It is distinct from infrastructure monitoring (latency, error rates) and business intelligence (revenue, conversion attribution). Product analytics focuses on user behavior: which features are adopted, where users drop off in onboarding flows, which cohorts retain, and whether a feature experiment improved the target metric. The data volume is large (billions of events per day for mature products), the queries are complex (funnel analysis, cohort retention, arbitrary event sequence matching), and the consumers are non-technical (product managers who need answers in seconds, not analysts who can run SQL queries).</p>
        <p>The fundamental challenge: event data is append-only and arrives out of order (mobile clients batch events and flush when they regain network connectivity, so a click event from 3 hours ago may arrive now). Queries over this data require joining billions of events by userId and ordering by timestamp, which is expensive in traditional row-oriented databases. Analytics systems solve this by using columnar storage (ClickHouse, BigQuery, Redshift) that physically co-locates all values of the same column, making full-table scans over specific columns (like event_type or timestamp) dramatically faster.</p>
        <p><strong>Explicit scope:</strong> Event ingestion, funnel analysis, retention cohorts, and feature flag correlation. Not in scope: session replay video (event coordinates only), revenue attribution, or ML-based anomaly detection.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Event tracking SDK:</strong> Client-side JavaScript SDK that tracks page views, custom events (track("feature_clicked", {"{"} featureId, userId {"}"})), and user identity (identify(userId, traits)). SDK batches events and flushes every 10 seconds or when 50 events accumulate. Supports auto-capture of clicks and page views without manual instrumentation.</li>
          <li><strong>Funnel analysis:</strong> Define a funnel as an ordered sequence of events (e.g., "Signed Up" → "Onboarding Step 1" → "Onboarding Step 2" → "First Feature Used"). Compute conversion rate between each step, average time between steps, and drop-off at each step. Funnels can be filtered by user property (e.g., plan=Pro) and segmented by breakdown dimension (e.g., breakdown by country).</li>
          <li><strong>Retention cohorts:</strong> Cohort analysis: among users who first performed event A in week W, what fraction returned to perform event B in week W+1, W+2, W+N? Standard retention (N-day return rate) and feature-specific retention (return to use feature X).</li>
          <li><strong>Feature flag correlation:</strong> For each feature flag (A/B experiment), show the distribution of usage metrics (event count, funnel conversion, retention) between flag-on and flag-off groups, enabling product managers to measure experiment impact without writing SQL.</li>
          <li><strong>Real-time dashboard:</strong> Live event count, active users in the last 5 minutes, and hourly event volume trend updating in near-real-time (within 60 seconds of event receipt).</li>
          <li><strong>Privacy controls:</strong> PII stripping at ingestion (email addresses, phone numbers, credit card patterns detected by regex and removed). User-level anonymization: the ability to delete all events for a specific userId (GDPR erasure) within 24 hours.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Ingestion throughput:</strong> Handle 100K events/second at peak (large SaaS product with millions of DAU). Events must not be dropped under spike load.</li>
          <li><strong>Query latency:</strong> Funnel and retention queries must complete within 10 seconds for datasets up to 1 billion events. Real-time dashboard metrics within 2 seconds.</li>
          <li><strong>Durability:</strong> Events must be durable once acknowledged at ingestion. An acknowledged event must survive a single datacenter failure.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The system has three layers. The collection layer: the client SDK sends batched events to the Event Ingestion API, which validates, strips PII, and writes to Kafka. The processing layer: a Flink streaming pipeline consumes from Kafka, enriches events (joins with user profile data to add user properties like plan, country, cohort), and writes to two stores—ClickHouse (long-term columnar store for all analytical queries) and Redis (short-term aggregations for real-time dashboard). A nightly Spark batch job computes retention cohorts and writes pre-aggregated cohort tables. The serving layer: the Analytics Query API reads from ClickHouse for funnel/retention queries and from Redis for real-time metrics, serving the dashboard frontend via REST. Queries that take longer than 10 seconds are run as async jobs and results are pushed to the dashboard when complete.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/other/feature-usage-analytics-dashboard.svg"
          alt="Feature usage analytics dashboard architecture showing event collection layer (JavaScript SDK auto-capture + manual track() identify() → batch 10s/50 events → Event Ingestion API POST /events validate schema → PII stripper regex email phone CC patterns → Kafka events topic 100K ev/s), processing layer (Flink streaming consumer → event enrichment join user profiles plan country cohort feature flags → ClickHouse events table columnar partitioned by date userId → Redis real-time aggregations DAU active-5min hourly volume TTL 5min; nightly Spark batch job cohort computation retention matrix N-day return rates → ClickHouse cohort_aggregates table), serving layer (Analytics Query API → funnel queries ClickHouse ordered event sequences conversion rates avg time-between-steps drop-off; retention cohort queries pre-aggregated cohort tables; real-time metrics Redis <2s; async long queries job queue results push SSE when complete; feature flag correlation split events by flag variant compare funnel/retention control vs treatment), dashboard UI (funnel visualization step conversion rates drop-off percentages breakdown by dimension; retention heatmap cohort weeks N-day return %; feature flag experiment results; live counter DAU active users event volume; query builder event sequence filter user property breakdown), privacy (PII stripping at ingestion GDPR erasure userId delete all events ClickHouse mutation within 24h; sampling high-volume low-value events 1-in-10 to reduce storage; data retention configurable 12-24 months)."
          caption="Event collection (SDK batching → PII stripping → Kafka), Flink enrichment → ClickHouse + Redis, funnel queries (ordered event sequences with conversion and drop-off), retention cohort computation (Spark nightly), feature flag correlation (control vs treatment), real-time dashboard (Redis), and privacy controls (PII stripping, GDPR erasure)"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Event SDK and Ingestion</h3>
        <p>The JavaScript SDK exposes three primary methods: page() (auto-called on route changes), track(eventName, properties), and identify(userId, traits). Events are queued in an in-memory buffer (max 50 events) and flushed every 10 seconds or when the buffer is full, whichever comes first. On page unload, navigator.sendBeacon flushes remaining events (non-blocking, survives tab close). Each event carries: eventName, timestamp (client-side ISO 8601), anonymousId (a UUID generated and persisted in localStorage for anonymous users), userId (set after identify() is called), sessionId (a UUID reset after 30 minutes of inactivity), properties (arbitrary key-value pairs), and context (SDK version, page URL, referrer, user agent, screen dimensions).</p>
        <p>Ingestion API: the single POST /v1/events endpoint accepts a batch of up to 1000 events. Validation: schema check (required fields present, eventName is a non-empty string, timestamp is a valid ISO 8601 date not more than 72 hours in the past—events older than 72 hours are rejected to prevent backfill abuse). PII detection: a regex scanner checks string values against patterns for email addresses (RFC 5322), US phone numbers, and credit card numbers (Luhn-valid 13–19 digit strings). Detected PII is replaced with [PII_REMOVED] before the event is written to Kafka. The Kafka write uses a hash partition key (userId or anonymousId) to ensure all events for a user land on the same partition, preserving local ordering for that user without a global sort.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">ClickHouse Schema and Partitioning</h3>
        <p>The primary ClickHouse table uses the MergeTree engine family: CREATE TABLE events (event_date Date, event_ts DateTime, project_id UUID, user_id String, anonymous_id String, session_id String, event_name LowCardinality(String), properties String, context String) ENGINE = ReplicatedMergeTree('/clickhouse/tables/events', {"'{replica}'"}) PARTITION BY toYYYYMM(event_date) ORDER BY (project_id, user_id, event_ts). Partitioning by month allows dropping old partitions for data retention without full-table deletions. Ordering by (project_id, user_id, event_ts) means all events for a given user within a project are physically co-located on disk, enabling fast user-level sequence queries (funnel analysis needs to sort each user&apos;s events by timestamp, this ordering makes that O(1) disk seek per user).</p>
        <p>LowCardinality encoding for event_name dramatically reduces storage and speeds up GROUP BY queries (event names are high-frequency strings with low cardinality—typically 50–200 distinct event names per product). Properties and context are stored as String (JSON) rather than a Map type for flexibility; ClickHouse's JSON functions (JSONExtractString, JSONExtractInt) allow querying nested properties without schema changes when new properties are added.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Funnel Query Design</h3>
        <p>Funnel analysis is the most complex query type. The challenge: given an ordered sequence of N events, find all users who performed all N events in order within a defined time window (e.g., 7 days), and count conversions at each step. Naive approach (N separate subqueries joined on userId) is O(N²) and extremely slow for large event tables. ClickHouse's windowFunnel function solves this efficiently: SELECT countIf(level &gt;= 1) AS step1, countIf(level &gt;= 2) AS step2, countIf(level &gt;= 3) AS step3 FROM (SELECT userId, windowFunnel(604800)(event_ts, event_name = 'Signed Up', event_name = 'Feature Viewed', event_name = 'Feature Used') AS level FROM events WHERE project_id = X AND event_date BETWEEN '2026-04-01' AND '2026-05-01' GROUP BY userId). The windowFunnel function processes each user's time-sorted events in a single pass and returns the deepest funnel step reached within the 7-day window. This query runs in 2–5 seconds for 1 billion events on a properly partitioned ClickHouse cluster.</p>
        <p>Funnel breakdown: adding a breakdown dimension (e.g., by country) requires adding a GROUP BY to the outer query: GROUP BY JSONExtractString(properties, 'country'). This increases query time proportionally to the number of distinct breakdown values. For high-cardinality breakdowns (&gt;100 distinct values), the dashboard limits to top-10 by event volume to avoid 10-second+ queries.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Retention Cohort Computation</h3>
        <p>Retention cohorts are computed by the nightly Spark batch job (not ClickHouse, because cohort computation requires a self-join on the events table that is expensive even in ClickHouse at billion-row scale). Spark algorithm: (1) Identify the cohort entry event for each user (the first occurrence of event A in the cohort period). (2) For each user in the cohort, find all subsequent occurrences of event B. (3) For each (user, cohort_week, return_week) tuple, mark as retained. (4) Aggregate: for each cohort_week, count users retained at each N-day interval. Results are written to ClickHouse's cohort_aggregates table: (project_id, cohort_week, n_day, users_in_cohort, users_retained). Dashboard cohort queries read from this pre-aggregated table in under 100ms.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Feature Flag Correlation</h3>
        <p>Feature flag assignments are tracked as a special event: feature_flag_called(flagKey, variant, userId, timestamp). This event is ingested through the same pipeline as all other events and stored in ClickHouse. To compute experiment impact on a funnel: the funnel query is extended with a JOIN on feature_flag_called to segment users into control/treatment groups. The resulting funnel comparison table shows conversion rates for each variant side by side. Statistical significance is computed by the serving layer (Fisher's exact test for small samples, z-test for proportions for large samples) and displayed as a confidence level on the dashboard. This approach makes feature flag correlation a query-time operation rather than requiring a separate experiment analytics system—the same event pipeline and ClickHouse table serves both product analytics and experiment measurement.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Sampling and Data Retention</h3>
        <p>High-frequency, low-analytical-value events (e.g., scroll events, mouse move events, page visibility changes) are sampled at 1-in-10 at the ingestion API before writing to Kafka. The sampling decision is deterministic (based on userId hash modulo 10) so that all sampled events for a given user are consistent—either all their scroll events are sampled or none are. This prevents biased session-level analysis. Sampled events have a sample_rate property added by the ingestion layer; query results that include sampled events divide counts by the sample rate to produce unbiased estimates. Data retention: events older than the configured retention window (12 or 24 months, per plan) are dropped by deleting the corresponding ClickHouse monthly partitions. This is O(1) regardless of partition size (partition deletion is a metadata operation).</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Client-side versus server-side event tracking: client-side tracking (SDK in the browser) is affected by ad blockers (estimated 25–40% of desktop web traffic blocks analytics scripts), bot traffic (crawlers may execute JavaScript and fire events), and inaccurate timestamps (client clock skew). Server-side tracking (application code sends events directly to the ingestion API) eliminates all three problems but requires instrumentation in every server-side endpoint and cannot capture UI-specific events (hover, scroll, focus). The industry best practice is dual tracking: server-side for conversion events (signup, purchase, feature activation) where accuracy is critical, and client-side for UI engagement events (feature viewed, button clicked) where 25% loss to ad blockers is acceptable because it is uniform across all users and does not bias relative comparisons.</p>
        <p>Streaming versus batch for funnel queries: running funnel queries in real time against raw event streams (Flink over Kafka) would give zero-latency results but requires maintaining per-user event state in streaming memory (extremely expensive at billions of events). Streaming is only practical for simple aggregations (event counts, active user counts). Complex relational queries (funnel, cohort, arbitrary sequence) require batch or columnar storage. ClickHouse's strength is making batch queries feel near-real-time—funnel queries that would take hours in PostgreSQL complete in seconds in ClickHouse. The trade-off is query latency of 2–10 seconds rather than sub-second, which is acceptable for product analytics (PMs do not need millisecond query response).</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A feature usage analytics dashboard processes event data through three layers. Collection: the JavaScript SDK batches events (10s/50 events), strips PII at the ingestion API (regex patterns for email/phone/CC), and publishes to Kafka with userId-hash partitioning for ordering guarantees. Processing: a Flink streaming pipeline enriches events with user properties and writes to ClickHouse (MergeTree partitioned by month, ordered by project+userId+timestamp for co-located user event reads) and Redis (real-time aggregations with 5-minute TTL). A nightly Spark job pre-computes retention cohort matrices. Serving: funnel queries use ClickHouse's windowFunnel function (single-pass per user, 2–5s for 1B events); retention queries read pre-aggregated cohort tables (&lt;100ms); real-time metrics read from Redis (&lt;2s). Feature flag correlation is a query-time operation (JOIN feature_flag_called events with funnel events) rather than a separate system. Sampling (1-in-10 for high-frequency events, deterministic by userId) and monthly partition drops for retention keep storage costs bounded. The defining constraint: the event ingestion path must be isolated from the query path—a slow dashboard query must never drop events. Kafka's durable buffer between ingestion and ClickHouse writes is the key decoupling mechanism.</p>
      </section>
    </ArticleLayout>
  );
}
