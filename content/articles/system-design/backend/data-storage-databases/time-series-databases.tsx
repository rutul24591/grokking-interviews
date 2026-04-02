"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-time-series-databases-complete",
  title: "Time Series Databases",
  description:
    "Comprehensive guide to time series databases: data model, architecture, downsampling, retention policies, and when to use specialized time series stores over general-purpose databases.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "time-series-databases",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-01",
  tags: ["backend", "data-storage", "nosql", "time-series", "metrics"],
  relatedTopics: [
    "column-family-stores",
    "database-partitioning",
    "data-modeling-in-nosql",
    "monitoring-observability",
  ],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/data-storage-databases";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>Time Series Databases</h1>
        <p className="lead">
          Time series databases (TSDB) are purpose-built for time-stamped data: metrics, events,
          sensor readings, and any data where time is the primary access pattern. Unlike general-purpose
          databases, TSDBs optimize for high-write throughput (millions of points per second),
          time-range queries (last hour, last week), and automatic data management (downsampling,
          retention policies). For monitoring, IoT, and financial data, time series databases
          outperform relational and column-family stores by orders of magnitude.
        </p>

        <p>
          Consider infrastructure monitoring. Every server reports CPU, memory, disk, and network
          metrics every 10 seconds. A 100-server cluster generates 2.6 million data points per day.
          In a relational database, this volume causes index bloat, slow writes, and expensive
          queries. In a time series database, writes are sequential appends (fast), queries are
          time-range scans (efficient), and old data is automatically downsampled and expired.
        </p>

        <p>
          Time series databases (InfluxDB, TimescaleDB, Prometheus, OpenTSDB) power monitoring
          systems (Grafana, Datadog), IoT platforms (AWS IoT, Azure IoT), and financial systems
          (trading platforms, market data). These workloads share characteristics: time-ordered
          data, high write throughput, time-range queries, and automatic data lifecycle management.
        </p>

        <p>
          This article provides a comprehensive examination of time series databases: the data
          model (measurements, tags, fields, timestamps), architecture optimizations (compression,
          partitioning, aggregation pushdown), downsampling and retention strategies, and real-world
          use cases. We'll explore when time series databases excel (metrics, IoT, events) and when
          they struggle (non-time-series data, complex queries, transactions). We'll also compare
          TSDBs with column-family stores, which share some characteristics but differ in
          specialization.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/time-series-data-model.svg`}
          caption="Figure 1: Time Series Data Model showing structure: Measurement (cpu_usage), Tags (indexed metadata: host=server1, region=us-east), Fields (values: value=75.5), and Timestamp (nanosecond precision). Tags are indexed for filtering, fields are actual metric values (not indexed), timestamps provide sort order for range queries. Downsampling & Retention: Raw data at 1-second intervals (7 days retention) → aggregated to 1-minute averages (30 days retention) → aggregated to 1-hour averages (1 year retention). Continuous queries automatically downsample data in background. Key characteristics: time-ordered, immutable, high-write throughput, downsampling, retention policies."
          alt="Time series database data model"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: Measurements, Tags, &amp; Fields</h2>

        <h3>The Time Series Data Model</h3>
        <p>
          Time series databases use a specialized data model optimized for metrics. A
          <strong>measurement</strong> is the metric name (cpu_usage, memory_used, request_latency).
          <strong>Tags</strong> are indexed metadata for filtering (host=server1, region=us-east,
          environment=production). <strong>Fields</strong> are the actual metric values
          (value=75.5, count=1)—not indexed, just stored. <strong>Timestamps</strong> are
          nanosecond-precision integers providing sort order.
        </p>

        <p>
          This model enables efficient queries: "CPU usage for host=server1 last hour" filters by
          tag (indexed, fast), scans the time range (efficient), and returns field values. Tags
          are indexed because you filter by them; fields are not indexed because you rarely filter
          by value ("find all readings where CPU &gt; 90%" is expensive and uncommon).
        </p>

        <p>
          <strong>Series</strong> are unique combinations of measurement + tags. cpu_usage with
          host=server1 is one series; cpu_usage with host=server2 is another series. Each series
          is stored contiguously on disk, enabling efficient time-range scans within a series.
          High cardinality (many unique tag combinations) creates many series, which can impact
          performance—more on this later.
        </p>

        <h3>Downsampling and Retention</h3>
        <p>
          Time series data accumulates quickly. Storing every data point forever is expensive and
          often unnecessary. <strong>Downsampling</strong> reduces data resolution over time:
          raw 1-second data is aggregated into 1-minute averages, then 1-hour averages, then daily
          summaries. <strong>Retention policies</strong> automatically delete old data: raw data
          kept for 7 days, 1-minute aggregates for 30 days, 1-hour aggregates for 1 year.
        </p>

        <p>
          <strong>Continuous queries</strong> automate downsampling. A continuous query runs in
          the background, aggregating raw data into lower-resolution buckets and storing results
          in a separate retention policy. Example: "Every 1 minute, compute AVG/MAX/MIN of
          cpu_usage and store in cpu_usage_1m." This happens automatically, ensuring downsampled
          data is always available.
        </p>

        <p>
          Downsampling trades precision for storage efficiency. Raw data has full precision but
          costs more. Aggregated data loses detail (you can't recover individual points from an
          average) but costs less. The right balance depends on use case: alerting needs recent
          raw data; trend analysis works with aggregated data.
        </p>

        <h3>Compression</h3>
        <p>
          Time series data compresses exceptionally well. Consecutive values often change slowly
          (CPU goes from 75% to 76%, not 75% to 100%). <strong>Delta encoding</strong> stores
          differences between values (75, +1, +2, -3) instead of absolute values, reducing storage.
          <strong>Gorilla compression</strong> (used by Prometheus) XORs consecutive floating-point
          values—similar values XOR to few bits, which compress well.
        </p>

        <p>
          Timestamps compress well too. Instead of storing full timestamps, store deltas between
          consecutive timestamps (every 10 seconds = delta of 10,000,000,000 nanoseconds).
          Run-length encoding compresses repeated deltas. Combined, these techniques achieve
          10x-100x compression ratios for time series data.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/time-series-architecture.svg`}
          caption="Figure 2: Time Series Database Architecture showing write and query paths. Write path (high throughput): Metrics Ingest → WAL (durability) → Buffer (in-memory batching) → Batch Write (time-ordered flush) → Acknowledge. Query optimization: Time-range queries (data stored in time order, efficient range scans, predicate pushdown), Aggregation pushdown (AVG/SUM/MAX computed at storage, reduce data transfer, continuous queries pre-compute), Indexing (time is primary index, tags indexed for metadata, fields not indexed). Storage engine optimizations: Time partitioning (partition by time range), Compression (delta encoding, Gorilla), Columnar storage (store fields separately), Cache hot data (recent data in memory)."
          alt="Time series database architecture"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation: Write &amp; Query Optimization</h2>

        <h3>Write-Optimized Design</h3>
        <p>
          Time series databases are fundamentally write-optimized. Writes are
          <strong>append-only</strong>: new data points are appended to the end of a time-ordered
          log. There are no in-place updates—time series data is immutable (a CPU reading at 10:00
          doesn't change). This design converts random writes (slow) into sequential writes (fast).
        </p>

        <p>
          Writes flow through: <strong>WAL (Write-Ahead Log)</strong> for durability (crash
          recovery), <strong>in-memory buffer</strong> for batching (group writes together), then
          <strong>flush to storage</strong> in time order. Batching is critical—writing 1000 points
          in one I/O is far more efficient than 1000 individual writes. Acknowledgments happen
          after WAL (durability) or after flush (persistence), depending on consistency requirements.
        </p>

        <p>
          <strong>Time-based partitioning</strong> organizes data by time range (one partition per
          hour, day, or week). Recent partitions are "hot" (frequently queried, cached in memory);
          old partitions are "cold" (rarely queried, stored on cheaper storage). This enables
          <strong>partition pruning</strong>: queries for "last hour" only scan the recent partition,
          not all data.
        </p>

        <h3>Query Optimization</h3>
        <p>
          Time series queries are predominantly time-range scans: "CPU usage last hour," "memory
          trends last week." TSDBs optimize for this pattern. Data is stored in time order, so
          time-range queries are sequential scans (fast). <strong>Predicate pushdown</strong>
          filters data at storage time (don't read points that don't match tag filters), reducing
          I/O.
        </p>

        <p>
          <strong>Aggregation pushdown</strong> is even more important. Instead of reading all
          points and computing AVG in the application, the database computes AVG at storage time
          and returns only the result. This reduces data transfer (1 value vs 10,000 values) and
          latency (one computation vs transfer + computation). Common aggregations: AVG, SUM,
          MAX, MIN, COUNT, PERCENTILE.
        </p>

        <p>
          <strong>Interpolation</strong> fills gaps in data. Sensors sometimes miss readings;
          interpolation estimates missing values (linear interpolation, last-value-carried-forward).
          This is essential for downsampling (aggregating irregular data into regular buckets) and
          visualization (smooth graphs without gaps).
        </p>

        <h3>High Cardinality Challenges</h3>
        <p>
          <strong>Cardinality</strong> is the number of unique series (measurement + tag combinations).
          High cardinality (millions of unique series) causes performance issues. Each series
          requires metadata (index entries, pointers), and too many series overwhelm the index.
          Queries scanning many series are slow.
        </p>

        <p>
          Common causes of high cardinality: <strong>Unique IDs as tags</strong> (user_id,
          session_id, request_id)—each unique value creates a new series.
          <strong>High-cardinality tags</strong> (IP addresses, URLs, usernames)—many unique
          values. <strong>Unbounded tag values</strong> (free-form text)—cardinality grows
          without limit.
        </p>

        <p>
          Mitigation strategies: <strong>Avoid unique IDs as tags</strong>—use fields instead
          (fields aren't indexed). <strong>Limit tag values</strong>—use enumerated values
          (environment=production/staging/dev, not arbitrary strings). <strong>Aggregate at
          ingestion</strong>—pre-aggregate high-cardinality data before writing.
          <strong>Monitor cardinality</strong>—alert when series count exceeds thresholds.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/time-series-use-cases.svg`}
          caption="Figure 3: Time Series Databases Use Cases & Trade-offs. Ideal use cases: Monitoring & Observability (infrastructure metrics, APM, business metrics), IoT Sensor Data (temperature, humidity, GPS, vehicle telemetry), Financial Data (stock prices, trading data, exchange rates), Event Tracking (clickstream, user behavior, system events). Anti-patterns to avoid: Non-Time-Series Data (user profiles, product catalogs, relational data), Complex Queries (multi-table joins, ad-hoc filtering, graph traversals), Transactional Workloads (ACID transactions, multi-row atomicity), Mutable Data (frequently updated records—TSDBs are append-only). Comparison: Time Series DB (time-ordered, high-write) vs Column-Family (wide rows, sparse data) vs Relational DB (ACID, complex queries) vs Document DB (flexible schema, nested). Decision checklist: time-ordered data, high write throughput, time-range queries, downsampling needed."
          alt="Time series database use cases and trade-offs"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison: TSDB vs Column-Family Stores</h2>

        <p>
          Time series databases and column-family stores (Cassandra, HBase) share characteristics:
          write-optimized, time-ordered data, horizontal scaling. But TSDBs are specialized for
          time series workloads, while column-family stores are more general-purpose. Understanding
          the differences helps you choose the right tool.
        </p>

        <h3>Time Series Database Strengths</h3>
        <p>
          <strong>Built-in time functions</strong> are the primary advantage. TSDBs provide
          native support for time-based aggregations (AVG over 5-minute windows), downsampling
          (aggregate 1-second data to 1-minute), interpolation (fill gaps), and time-based
          retention (delete data older than 30 days). Column-family stores require implementing
          these in application code.
        </p>

        <p>
          <strong>Compression</strong> is superior in TSDBs. Specialized algorithms (delta
          encoding, Gorilla compression) achieve 10x-100x compression ratios for time series
          data. Column-family stores use general-purpose compression (Snappy, LZ4) with lower
          ratios. For high-volume metrics, TSDB storage costs are significantly lower.
        </p>

        <p>
          <strong>Query language</strong> is optimized for time series. InfluxQL, PromQL, and
          Flux provide time-centric syntax: <code className="inline-code">SELECT AVG(cpu) FROM metrics WHERE time &gt; now() - 1h GROUP BY time(5m)</code>.
          Column-family stores require manual range scans and application-side aggregation.
        </p>

        <p>
          <strong>Ecosystem integration</strong> is mature. TSDBs integrate with monitoring
          tools (Grafana, Datadog), alerting systems (Alertmanager, PagerDuty), and visualization
          dashboards. Column-family stores require building these integrations.
        </p>

        <h3>Column-Family Store Strengths</h3>
        <p>
          <strong>Flexible data model</strong> is the primary advantage. Column-family stores
          handle varying schemas (different rows have different columns) and non-time-series
          data. TSDBs assume time series structure (measurement, tags, fields, timestamp). For
          messaging inboxes, event logs with varying structures, or sparse data without time
          ordering, column-family stores are more appropriate.
        </p>

        <p>
          <strong>General-purpose queries</strong> are better supported. Column-family stores
          can query by row key range, filter by column values (with secondary indexes), and
          handle non-time-based access patterns. TSDBs are optimized for time-range queries and
          struggle with non-time-based filtering.
        </p>

        <p>
          <strong>Horizontal scaling</strong> is more mature. Column-family stores (Cassandra,
          HBase) have proven track records at massive scale (petabytes, thousands of nodes).
          TSDBs scale well but are newer and have less operational experience at extreme scale.
        </p>

        <h3>When to Use Time Series Databases</h3>
        <p>
          Use TSDBs for: <strong>Monitoring metrics</strong> (infrastructure, APM, business
          metrics), <strong>IoT sensor data</strong> (temperature, GPS, telemetry),
          <strong>Financial data</strong> (stock prices, trading data), <strong>Event tracking</strong>
          (clickstream, user behavior).
        </p>

        <p>
          Use column-family stores for: <strong>Messaging inboxes</strong> (one row per user,
          columns as messages), <strong>Event logs</strong> (varying structures, non-time-based
          queries), <strong>Sparse data</strong> (many optional columns), <strong>Non-time-series
          workloads</strong> (user profiles, product catalogs).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/time-series-vs-column-family.svg`}
          caption="Figure 4: Time Series vs Column-Family Stores comparison. Time Series Data Model: Measurement + Tags + Fields + Timestamp, optimizations include time-based partitioning and delta compression, queries are time-range aggregations and downsampling. Column-Family Data Model: Row Key + Column Families + Columns, optimizations include sequential writes (SSTables) and bloom filters, queries are row key range scans and column family filtering. Use Time Series DB when: data is naturally time-ordered, need time-based aggregations, require downsampling/retention, high cardinality tags for filtering, built-in time functions needed. Use Column-Family when: wide rows with many columns, sparse data (varying columns), non-time-based access patterns, messaging/inbox patterns, more flexible query patterns. Overlap: Both handle high-write, time-ordered data well. Time Series DB is specialized for metrics with built-in aggregations; Column-Family is more general-purpose with flexible schema."
          alt="Time series vs column-family comparison"
        />
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for Time Series Databases</h2>

        <p>
          <strong>Design tag schemas carefully.</strong> Tags determine query patterns and
          cardinality. Use low-cardinality tags (host, region, environment) for filtering.
          Avoid high-cardinality tags (user_id, request_id)—use fields instead. Document tag
          conventions and enforce them in instrumentation code.
        </p>

        <p>
          <strong>Set appropriate retention policies.</strong> Define retention based on use
          case: raw data for alerting (7-30 days), downsampled data for trends (1-2 years),
          long-term aggregates for compliance (5+ years). Automate retention—don't let data
          accumulate indefinitely.
        </p>

        <p>
          <strong>Configure downsampling strategically.</strong> Downsample based on query
          patterns: if you query "last hour" at 1-minute resolution, downsample to 1-minute
          averages. If you query "last year" at daily resolution, downsample to daily averages.
          Match resolution to query needs—don't store unnecessary precision.
        </p>

        <p>
          <strong>Monitor cardinality.</strong> Track series count (unique measurement + tag
          combinations). Alert when cardinality exceeds thresholds (varies by TSDB: InfluxDB
          ~100K series, Prometheus ~10M series). High cardinality causes performance degradation.
        </p>

        <p>
          <strong>Use batching at ingestion.</strong> Send metrics in batches (100-1000 points
          per write) instead of individual writes. This reduces network overhead and improves
          write throughput. Most TSDB clients support automatic batching.
        </p>

        <p>
          <strong>Pre-compute expensive aggregations.</strong> If you frequently query complex
          aggregations (percentiles, histograms), pre-compute them in continuous queries.
          Computing percentiles at query time is expensive; storing pre-computed percentiles
          is fast.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>High cardinality from unique IDs.</strong> Using user_id, session_id, or
          request_id as tags creates one series per unique value. Solution: Use these as fields
          (not indexed), or aggregate before writing (count per minute, not individual events).
        </p>

        <p>
          <strong>No retention policies.</strong> Data accumulates indefinitely, filling disk
          and degrading performance. Solution: Set retention policies from day one. Define
          retention based on compliance requirements and query needs. Automate expiration.
        </p>

        <p>
          <strong>Querying raw data for long ranges.</strong> Querying "last year" at 1-second
          resolution returns billions of points—slow and useless. Solution: Query downsampled
          data for long ranges (1-hour averages for last year), raw data only for short ranges
          (1-second data for last hour).
        </p>

        <p>
          <strong>Ignoring compression settings.</strong> Default compression may not be optimal
          for your data. Solution: Experiment with compression algorithms (Gorilla for floats,
          delta for integers). Monitor compression ratios. Adjust based on data characteristics.
        </p>

        <p>
          <strong>Not planning for scale.</strong> TSDBs scale differently than relational
          databases. Solution: Plan shard/replica strategy upfront. Use time-based partitioning.
          Monitor write throughput and query latency. Scale horizontally before hitting limits.
        </p>

        <p>
          <strong>No backup strategy.</strong> TSDBs need backups like any other database.
          Solution: Use built-in backup tools (influxd backup, prometheus snapshot), test
          restore procedures, maintain point-in-time recovery capabilities.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Infrastructure Monitoring (Netflix, Grafana Cloud)</h3>
        <p>
          Netflix uses Prometheus and Atlas (their TSDB) for infrastructure monitoring. Every
          server reports CPU, memory, disk, network, and application metrics every 10 seconds.
          Queries like "CPU usage for service X last hour" power Grafana dashboards. Alerts
          trigger on threshold breaches (CPU &gt; 90% for 5 minutes). Downsampling enables
          long-term trend analysis (capacity planning).
        </p>

        <p>
          This pattern scales to millions of metrics per second. Writes are high-throughput
          (sequential appends), queries are time-range scans (efficient), and retention policies
          manage storage costs (raw data 7 days, downsampled 1 year).
        </p>

        <h3>IoT Sensor Networks (Industrial Monitoring, Smart Cities)</h3>
        <p>
          Industrial IoT systems use InfluxDB or TimescaleDB for sensor data. Temperature,
          pressure, vibration, and power sensors report every second. Queries like "temperature
          trends for machine X last week" enable predictive maintenance. Anomalies trigger
          alerts (vibration exceeds threshold → potential failure).
        </p>

        <p>
          This pattern handles high cardinality (thousands of sensors) and high write throughput
          (millions of points per day). Tag schemas (machine_id, sensor_type, location) enable
          filtering. Retention policies manage storage (raw data 30 days, hourly aggregates 2
          years).
        </p>

        <h3>Financial Trading (Stock Exchanges, Hedge Funds)</h3>
        <p>
          Trading platforms use Kdb+ or QuestDB for market data. Stock prices, order book
          updates, and trade executions are time series data. Queries like "price movements for
          stock X last minute" power trading algorithms. Low-latency writes and reads are
          critical (microseconds matter).
        </p>

        <p>
          This pattern requires extreme write throughput (millions of updates per second) and
          low-latency queries (sub-millisecond). Columnar storage and in-memory caching enable
          fast access. Compression reduces storage costs (tick data accumulates quickly).
        </p>

        <h3>Application Performance Monitoring (Datadog, New Relic)</h3>
        <p>
          APM services use TSDBs for latency, error rates, and throughput metrics. Every request
          generates latency data; aggregations (p50, p95, p99) are computed continuously.
          Queries like "p99 latency for endpoint X last hour" identify performance regressions.
          Alerts trigger on SLO breaches (p99 &gt; 500ms).
        </p>

        <p>
          This pattern handles high cardinality (many endpoints, many services) and requires
          real-time aggregations (percentiles). Continuous queries pre-compute aggregations.
          Downsampling enables long-term SLO tracking (30-day rolling windows).
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q1: When would you choose a time series database over a column-family or relational
              database? Give a concrete example.
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Choose time series databases for time-ordered data with
              high write throughput and time-range queries. Example: Infrastructure monitoring
              where servers report CPU, memory, and disk metrics every 10 seconds. In a relational
              database, every metric inserts a row—index bloat, slow writes, expensive time-range
              queries. In a column-family store, you can model this (row = server, columns =
              timestamps), but you lose built-in time functions (downsampling, retention,
              aggregations). In a time series database, writes are sequential appends (fast),
              queries are time-range scans (efficient), and downsampling/retention are automatic.
              Choose relational for: transactions, complex queries. Choose column-family for:
              messaging, sparse data. Choose time series for: metrics, IoT, events.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What if you need to query by non-time fields (e.g.,
              "all servers with CPU &gt; 90%")? Answer: Time series databases support tag-based
              filtering. Use tags for filterable metadata (host, region). Avoid using fields for
              filtering (fields aren't indexed). For complex ad-hoc queries, consider a separate
              analytics system (Elasticsearch, ClickHouse).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q2: Explain downsampling and retention policies. Why are they important?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Downsampling reduces data resolution over time: raw
              1-second data is aggregated into 1-minute averages, then 1-hour averages, then
              daily summaries. Retention policies automatically delete old data: raw data kept
              for 7 days, 1-minute aggregates for 30 days, 1-hour aggregates for 1 year. They're
              important because: (1) Storage costs—raw data accumulates quickly, downsampling
              reduces storage 10x-100x. (2) Query performance—querying aggregated data is faster
              than raw data. (3) Compliance—some regulations require data retention for specific
              periods. (4) Use case alignment—alerting needs raw data, trend analysis works with
              aggregates.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you implement downsampling? Answer: Use
              continuous queries (automated background aggregations). Example: "Every 1 minute,
              compute AVG/MAX/MIN of cpu_usage and store in cpu_usage_1m retention policy."
              Query raw data for recent ranges, aggregated data for long ranges.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q3: What is high cardinality in time series databases? Why is it a problem and how
              do you mitigate it?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Cardinality is the number of unique series (measurement +
              tag combinations). High cardinality (millions of unique series) causes performance
              issues: index overhead (each series requires metadata), slow queries (scanning many
              series), memory pressure (series metadata in memory). Common causes: unique IDs as
              tags (user_id, session_id), high-cardinality tags (IP addresses, URLs), unbounded
              tag values (free-form text). Mitigation: (1) Avoid unique IDs as tags—use fields
              instead (not indexed). (2) Limit tag values—use enumerated values (environment=
              production/staging/dev). (3) Aggregate at ingestion—pre-aggregate high-cardinality
              data. (4) Monitor cardinality—alert when series count exceeds thresholds.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What's a real-world example of high cardinality causing
              issues? Answer: A company tagged metrics with user_id for per-user tracking. With
              millions of users, series count exploded, causing query failures and memory issues.
              Fix: Changed user_id from tag to field (not indexed), aggregated to per-minute
              counts before writing.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q4: Design a monitoring system for a microservices architecture. How do you model
              the data and handle scale?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Use a time series database (Prometheus, InfluxDB). Data
              model: Measurement = metric name (cpu_usage, request_latency, error_count). Tags =
              service_name, environment, region, instance_id (low-cardinality metadata). Fields =
              metric values (value, count). Timestamps = nanosecond precision. For scale: (1)
              Batch metrics at ingestion (100-1000 points per write). (2) Use federation or
              sharding for horizontal scale (multiple TSDB instances). (3) Downsample aggressively
              (1-second raw → 1-minute aggregates → 1-hour aggregates). (4) Set retention policies
              (raw 7 days, aggregates 1 year). (5) Monitor cardinality (alert on series count).
              (6) Pre-compute expensive aggregations (percentiles) in continuous queries.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you handle alerting? Answer: Use alerting rules
              (Prometheus Alertmanager, InfluxDB alerts). Define thresholds (CPU &gt; 90% for 5
              minutes). Alerts evaluate continuously, trigger notifications (PagerDuty, Slack).
              Use recording rules for pre-computed aggregations (reduce alert evaluation cost).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q5: Compare time series databases with column-family stores. When would you use
              each for time-ordered data?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Both handle write-heavy, time-ordered data well. Time
              series databases are specialized: built-in time functions (aggregations, downsampling,
              retention), superior compression (delta encoding, Gorilla), query languages optimized
              for time (InfluxQL, PromQL), ecosystem integrations (Grafana, alerting). Column-family
              stores are general-purpose: flexible schema (varying columns per row), non-time-based
              queries, proven horizontal scaling (Cassandra at petabyte scale). Use TSDB for:
              metrics, IoT, financial data (time is primary access pattern). Use column-family
              for: messaging inboxes, event logs with varying structures, sparse data without
              time ordering.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> Can you use both together? Answer: Yes—hybrid approach.
              Use TSDB for metrics and alerting (real-time monitoring). Use column-family for
              event logs and detailed traces (long-term storage, flexible queries). Stream data
              to both systems at ingestion.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q6: Your time series database is experiencing slow queries. How do you diagnose
              and fix this?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Diagnose: (1) Check query patterns—are queries scanning
              too much data (long time ranges, no tag filters)? (2) Check cardinality—is series
              count too high? (3) Check retention—is too much raw data being queried? (4) Check
              compression—is compression enabled and effective? (5) Check resources—is disk I/O
              or memory saturated? Fix: (1) Optimize queries—add tag filters, reduce time range,
              query downsampled data for long ranges. (2) Reduce cardinality—remove high-cardinality
              tags, aggregate before writing. (3) Configure downsampling—query aggregates for
              long ranges. (4) Tune compression—experiment with algorithms. (5) Scale horizontally—
              add read replicas or shards. (6) Cache hot data—recent data in memory.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you prevent this in the future? Answer: Monitor
              query latency and cardinality. Set up alerts for slow queries and high series count.
              Enforce tag schema conventions. Plan retention and downsampling from day one.
              Document query best practices (use tag filters, query appropriate resolution).
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            InfluxDB Documentation, "Data Model," "Downsampling," "Retention Policies,"
            https://docs.influxdata.com/
          </li>
          <li>
            Prometheus Documentation, "Data Model," "Querying,"
            https://prometheus.io/docs/
          </li>
          <li>
            TimescaleDB Documentation, "Hypertables," "Continuous Aggregates,"
            https://docs.timescale.com/
          </li>
          <li>
            Martin Kleppmann, <em>Designing Data-Intensive Applications</em>, O'Reilly, 2017.
            Chapter 3.
          </li>
          <li>
            Alex Petrov, <em>Database Internals</em>, O'Reilly, 2019. Chapter 13.
          </li>
          <li>
            Google, "Monarch: Google's Planet-Scale Index-Free Time Series Database,"
            USENIX ATC 2020.
          </li>
          <li>
            Netflix Tech Blog, "Atlas: Netflix's Time Series Database,"
            https://netflixtechblog.com/
          </li>
          <li>
            QuestDB Documentation, "Architecture,"
            https://questdb.io/docs/
          </li>
          <li>
            Kdb+ Documentation, "Time Series Features,"
            https://code.kx.com/
          </li>
          <li>
            Daniel Lemire, "Gorilla: Faster Time Series Compression," Various blog posts.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
