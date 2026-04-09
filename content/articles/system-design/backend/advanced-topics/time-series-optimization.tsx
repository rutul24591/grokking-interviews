"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-advanced-topics-time-series-optimization",
  title: "Time-Series Optimization",
  description:
    "Staff-level deep dive into time-series database optimization: data compression, downsampling, retention policies, partitioning strategies, and production-scale patterns for high-throughput time-series workloads.",
  category: "backend",
  subcategory: "advanced-topics",
  slug: "time-series-optimization",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-08",
  tags: ["backend", "time-series", "compression", "downsampling", "retention", "partitioning"],
  relatedTopics: ["lsm-trees", "database-indexes", "tail-latency", "hot-partitions"],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/advanced-topics";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Time-series optimization</strong> refers to the set of techniques used to
          efficiently store, query, and manage time-stamped data that arrives continuously at
          high throughput. Time-series data is characterized by append-only writes (data is
          always written with the current timestamp), time-range queries (queries that filter
          by time range), and downsampling (aggregating high-resolution data into lower-resolution
          summaries for long-term storage). These characteristics require specialized storage
          engines, indexing strategies, and retention policies that differ significantly from
          general-purpose databases.
        </p>
        <p>
          Consider a monitoring system that collects 1 million metrics per second from 10,000
          servers, each reporting CPU, memory, disk, and network metrics every second. Over the
          course of a day, this generates 86.4 billion data points. Storing this data in a
          general-purpose database (e.g., PostgreSQL) would consume hundreds of gigabytes per
          day and would not support efficient time-range queries at this scale. A time-series
          database (e.g., InfluxDB, Prometheus, TimescaleDB) optimizes for this workload by
          using append-only storage (LSM trees), time-based partitioning, data compression
          (delta encoding, Gorilla compression), and downsampling (aggregating 1-second data
          into 1-minute, 1-hour, and 1-day summaries).
        </p>
        <p>
          For staff/principal engineers, time-series optimization requires understanding the
          trade-offs between data resolution and storage cost (higher resolution = more storage),
          the choice of compression algorithms (delta encoding, Gorilla compression, run-length
          encoding), and the design of retention policies (how long to keep raw data vs.
          downsampled data).
        </p>
        <p>
          The business impact of time-series optimization decisions is significant. Efficient
          time-series storage reduces infrastructure costs (less disk space, fewer I/O operations)
          and enables faster query performance (less data to scan). Inefficient time-series
          storage leads to high storage costs, slow queries, and data loss (when retention
          policies are too aggressive due to storage constraints).
        </p>
        <p>
          In system design interviews, time-series optimization demonstrates understanding of
          append-only storage patterns, data compression techniques, downsampling strategies,
          and the design of monitoring and observability systems at scale.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src={`${BASE_PATH}/time-series-storage-architecture.svg`}
          alt="Time-series storage architecture showing append-only writes, time-based partitions, compression, and downsampling pipeline"
          caption="Time-series storage architecture — data arrives as high-resolution append-only writes, stored in time-based partitions with compression (delta encoding, Gorilla), downsampled into lower-resolution summaries for long-term retention"
        />

        <h3>Append-Only Storage</h3>
        <p>
          Time-series data is inherently append-only: new data points are always written with
          the current timestamp, and existing data points are rarely updated or deleted. This
          enables the use of append-optimized storage engines (LSM trees, write-ahead logs)
          that provide high write throughput by batching random writes into sequential writes.
          Unlike general-purpose databases that must support random reads and writes, time-series
          databases can optimize for sequential writes and time-range reads.
        </p>
        <p>
          Append-only storage also simplifies data compression: consecutive data points for
          the same metric are stored contiguously on disk, enabling delta encoding (storing the
          difference between consecutive values) and run-length encoding (storing repeated
          values as a count-value pair). These compression techniques reduce storage costs by
          10-100x compared to uncompressed storage.
        </p>

        <h3>Time-Based Partitioning</h3>
        <p>
          Time-series data is partitioned by time to enable efficient time-range queries. Each
          partition contains data for a specific time window (e.g., 1 day, 1 week, 1 month).
          When a query filters by time range, only the relevant partitions are scanned, reducing
          the amount of data read from disk. Partitions are created automatically as new data
          arrives, and old partitions are dropped or archived according to the retention policy.
        </p>
        <p>
          The partition size is a critical design choice: small partitions (1 hour) enable
          efficient time-range queries for recent data but create many small files (overhead
          for file system metadata). Large partitions (1 month) reduce file system overhead
          but require scanning more data for short time-range queries. The optimal partition
          size depends on the query patterns: if most queries span 1 hour of data, use 1-hour
          partitions; if most queries span 1 day of data, use 1-day partitions.
        </p>

        <h3>Downsampling and Retention</h3>
        <p>
          Downsampling aggregates high-resolution data into lower-resolution summaries for
          long-term storage. For example, 1-second data points are aggregated into 1-minute
          averages, 1-minute data into 1-hour averages, and 1-hour data into 1-day averages.
          This reduces storage costs while preserving the ability to query historical data at
          an appropriate resolution.
        </p>
        <p>
          Retention policies define how long data is kept at each resolution. Raw data (1-second
          resolution) may be kept for 7 days, 1-minute aggregates for 30 days, 1-hour aggregates
          for 1 year, and 1-day aggregates indefinitely. The retention policy balances storage
          costs against query requirements: keeping high-resolution data for a long time is
          expensive but enables detailed historical analysis; keeping only low-resolution data
          is cheap but limits the granularity of historical queries.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/time-series-downsampling.svg`}
          alt="Downsampling pipeline: raw 1-second data → 1-minute aggregates (avg, min, max, count) → 1-hour aggregates → 1-day aggregates, with retention policy for each level"
          caption="Downsampling pipeline — raw 1-second data is aggregated into 1-minute summaries (avg, min, max, count), which are further aggregated into 1-hour and 1-day summaries; each level has its own retention policy balancing storage cost against query granularity"
        />
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture &amp; Flow</h2>

        <h3>Data Compression for Time-Series</h3>
        <p>
          Time-series data is highly compressible because consecutive data points for the same
          metric are often similar (e.g., CPU usage changes gradually). Compression techniques
          include <strong>delta encoding</strong> (storing the difference between consecutive
          values instead of the full value), <strong>Gorilla compression</strong> (Facebook&apos;s
          algorithm that stores XOR differences between consecutive floating-point values,
          achieving 10-20x compression), and <strong>run-length encoding</strong> (storing
          repeated values as a count-value pair).
        </p>
        <p>
          Gorilla compression is particularly effective for time-series data because it exploits
          the temporal locality of metric values: consecutive values are often identical or
          differ by a small amount. The algorithm stores the first value in full, and subsequent
          values as XOR differences from the previous value. If the XOR difference is zero
          (identical values), it stores a single bit. If the XOR difference is small, it stores
          the significant bits. This achieves 10-20x compression for typical time-series data.
        </p>

        <h3>Query Optimization</h3>
        <p>
          Time-series queries are optimized through time-based partition pruning (scanning only
          the partitions that overlap with the query&apos;s time range), metric-based indexing
          (indexing metric names and tag values for fast filtering), and downsampling (querying
          downsampled data for long time ranges to reduce the amount of data scanned).
        </p>
        <p>
          For example, a query for &quot;average CPU usage over the last 30 days&quot; would
          scan 30 daily partitions of downsampled 1-hour data (720 data points) instead of
          scanning 30 daily partitions of raw 1-second data (2.59 billion data points). This
          reduces the query latency from minutes to seconds.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/time-series-compression.svg`}
          alt="Time-series compression techniques: delta encoding, Gorilla XOR compression, run-length encoding, showing compression ratios and when each technique is most effective"
          caption="Time-series compression — delta encoding stores differences between consecutive values, Gorilla XOR compression achieves 10-20x compression for floating-point metrics, run-length encoding compresses repeated values; combined compression reduces storage by 10-100x"
        />
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Time-series optimization involves trade-offs between data resolution, storage cost,
          and query performance. Higher resolution (1-second data) provides more detailed
          insights but consumes more storage and slows down long-range queries. Lower
          resolution (1-minute or 1-hour data) reduces storage costs and speeds up long-range
          queries but loses fine-grained detail.
        </p>
        <p>
          The downsampling strategy determines what information is preserved: averaging
          preserves the mean but loses outliers; min/max preserves extremes but loses
          distribution; percentiles (P50, P95, P99) preserve distribution but require more
          storage. The choice depends on the query requirements: if users need to identify
          outliers, store min/max; if users need to understand distribution, store percentiles.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Use time-based partitioning with partition sizes aligned to query patterns. If most
          queries span 1 hour of data, use 1-hour partitions. If most queries span 1 day of
          data, use 1-day partitions. Avoid partitions that are too small (many small files,
          file system overhead) or too large (scan more data than needed for short queries).
        </p>
        <p>
          Implement a multi-tier retention policy: raw data for 7 days, 1-minute aggregates
          for 30 days, 1-hour aggregates for 1 year, 1-day aggregates indefinitely. This
          balances storage costs against query requirements: recent data is available at full
          resolution, historical data is available at lower resolution.
        </p>
        <p>
          Use Gorilla compression for floating-point metrics (CPU, memory, latency) and
          delta encoding for integer metrics (request count, error count). Gorilla compression
          achieves 10-20x compression for floating-point data, while delta encoding achieves
          5-10x compression for integer data. Run-length encoding is effective for metrics
          with many repeated values (e.g., status codes).
        </p>
        <p>
          Pre-aggregate data during ingestion to avoid expensive post-ingestion downsampling.
          When raw data is written, simultaneously update the 1-minute, 1-hour, and 1-day
          aggregate tables. This eliminates the need for a separate downsampling job and
          ensures that downsampled data is always up to date.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most common pitfall is storing raw data at full resolution for too long, consuming
          excessive storage and degrading query performance. The fix is to implement a
          multi-tier retention policy that downsamples data after a short retention period
          (7 days for raw data) and keeps only downsampled data for long-term storage.
        </p>
        <p>
          Not partitioning by time causes full-table scans for time-range queries. Without
          time-based partitioning, every query must scan all data, regardless of the time
          range. The fix is to partition data by time (e.g., 1-day partitions) and prune
          partitions that do not overlap with the query&apos;s time range.
        </p>
        <p>
          Using a general-purpose database (e.g., PostgreSQL) for high-throughput time-series
          data leads to poor write performance and high storage costs. General-purpose databases
          are optimized for random reads and writes, not append-only time-series workloads.
          The fix is to use a time-series database (InfluxDB, Prometheus, TimescaleDB) or
          implement append-optimized storage with time-based partitioning and compression.
        </p>
        <p>
          Downsampling without preserving min/max or percentiles loses critical information
          about outliers. Averaging alone hides spikes and anomalies. The fix is to store
          multiple aggregate functions during downsampling: avg, min, max, count, and
          percentiles (P50, P95, P99) for metrics where outliers are important.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Prometheus: Monitoring at Scale</h3>
        <p>
          Prometheus uses a custom time-series storage engine with 2-hour blocks, delta
          encoding, and Gorilla compression. Data is stored in 2-hour blocks on disk, with
          each block containing all samples for that time window. Blocks are compacted into
          larger blocks (4 hours, 8 hours, etc.) and eventually deleted according to the
          retention policy. Prometheus achieves 1-2 bytes per sample with Gorilla compression,
          enabling it to store millions of time series on a single node.
        </p>

        <h3>InfluxDB: Time-Series Database</h3>
        <p>
          InfluxDB uses a time-structured merge tree (TSM tree) for storage, which is an LSM
          tree variant optimized for time-series data. TSM trees use Gorilla compression for
          floating-point values and delta encoding for timestamps, achieving 10-20x compression.
          InfluxDB supports continuous queries for automatic downsampling and retention policies
          for automatic data expiration.
        </p>

        <h3>TimescaleDB: PostgreSQL Extension</h3>
        <p>
          TimescaleDB extends PostgreSQL with time-series optimizations: automatic time-based
          partitioning (called &quot;hypertables&quot;), columnar compression, and continuous
          aggregates (automatic downsampling). TimescaleDB provides the SQL interface of
          PostgreSQL with the performance of a time-series database, enabling users to leverage
          existing PostgreSQL tooling while achieving time-series performance.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What makes time-series data different from general-purpose data?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Time-series data is characterized by append-only writes (data is always written
              with the current timestamp), time-range queries (queries that filter by time
              range), and downsampling (aggregating high-resolution data into lower-resolution
              summaries). These characteristics enable append-optimized storage engines (LSM
              trees) that provide high write throughput by batching random writes into
              sequential writes.
            </p>
            <p>
              Unlike general-purpose data, time-series data is rarely updated or deleted, is
              queried primarily by time range, and benefits from aggressive compression
              (consecutive values are often similar). These properties enable storage engines
              that are 10-100x more efficient than general-purpose databases for time-series
              workloads.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What is Gorilla compression and why is it effective for time-series data?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Gorilla compression is Facebook&apos;s algorithm for compressing floating-point
              time-series data. It stores the first value in full, and subsequent values as
              XOR differences from the previous value. If the XOR difference is zero (identical
              values), it stores a single bit. If the XOR difference is small, it stores only
              the significant bits.
            </p>
            <p>
              Gorilla compression is effective for time-series data because consecutive metric
              values are often identical or differ by a small amount (e.g., CPU usage changes
              gradually). This achieves 10-20x compression for typical time-series data,
              reducing storage costs from 8 bytes per sample to 1-2 bytes per sample.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How do you design a retention policy for time-series data?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Use a multi-tier retention policy: raw data for 7 days, 1-minute aggregates for
              30 days, 1-hour aggregates for 1 year, 1-day aggregates indefinitely. This
              balances storage costs against query requirements: recent data is available at
              full resolution for detailed analysis, historical data is available at lower
              resolution for trend analysis.
            </p>
            <p>
              The retention policy should be based on the query patterns: if users rarely query
              data older than 30 days at full resolution, there is no need to keep raw data for
              longer. Downsampled data should preserve avg, min, max, count, and percentiles
              to support different types of analysis.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How does time-based partitioning improve query performance?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Time-based partitioning divides data into partitions based on time windows (e.g.,
              1-day partitions). When a query filters by time range, only the partitions that
              overlap with the query&apos;s time range are scanned. For a query spanning 1 hour
              of data, only 1/24 of a day&apos;s partition is scanned (or the full partition
              if partitioned by day), instead of scanning the entire dataset.
            </p>
            <p>
              Partition pruning reduces the amount of data read from disk, which is the primary
              bottleneck for time-series queries. For a dataset with 1 year of data (365 daily
              partitions), a 1-hour query scans 1/8760 of the data, reducing query latency
              from minutes to seconds.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: What is downsampling and when should you use it?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Downsampling aggregates high-resolution data into lower-resolution summaries for
              long-term storage. For example, 1-second data points are aggregated into 1-minute
              averages, min, max, and count. This reduces storage costs while preserving the
              ability to query historical data at an appropriate resolution.
            </p>
            <p>
              Use downsampling for data that is older than the typical query window. If users
              rarely query data older than 7 days at full resolution, downsample data older
              than 7 days into 1-minute aggregates. For data older than 30 days, further
              downsample into 1-hour aggregates. This reduces storage costs by 10-100x while
              preserving query capability.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: How would you optimize a time-series database that is running out of storage?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              First, implement or tighten the retention policy: reduce the retention period
              for raw data (e.g., from 30 days to 7 days) and ensure that downsampled data
              is being generated. Second, enable compression (Gorilla for floating-point,
              delta encoding for integers) if not already enabled. Third, archive old data
              to cold storage (S3, Glacier) instead of deleting it, enabling occasional
              access to historical data at lower cost.
            </p>
            <p>
              Long-term: implement multi-tier storage (hot storage for recent data, warm
              storage for downsampled data, cold storage for archived data). This balances
              storage costs against query requirements while ensuring that data is accessible
              at the appropriate resolution.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References
          ============================================================ */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.vldb.org/pvldb/vol8/p1816-teller.pdf"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook Gorilla Paper: A Fast, Scalable, In-Memory Time Series Database
            </a>{" "}
            — The original Gorilla compression paper.
          </li>
          <li>
            <a
              href="https://prometheus.io/docs/prometheus/latest/storage/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Prometheus: Storage Architecture
            </a>{" "}
            — How Prometheus stores and compresses time-series data.
          </li>
          <li>
            <a
              href="https://docs.influxdata.com/influxdb/v2/reference/internals/storage-engine/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              InfluxDB: TSM Storage Engine
            </a>{" "}
            — How InfluxDB uses TSM trees for time-series storage.
          </li>
          <li>
            <a
              href="https://docs.timescale.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              TimescaleDB: Hypertables and Compression
            </a>{" "}
            — How TimescaleDB extends PostgreSQL with time-series optimizations.
          </li>
          <li>
            Martin Kleppmann,{" "}
            <em>Designing Data-Intensive Applications</em>, O&apos;Reilly, 2017. Chapter 3
            (Storage and Retrieval).
          </li>
          <li>
            <a
              href="https://www.usenix.org/conference/hotos15/workshop-program/presentation/teller"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              HotOS 2015: Time-Series Databases
            </a>{" "}
            — Overview of time-series database design principles.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
