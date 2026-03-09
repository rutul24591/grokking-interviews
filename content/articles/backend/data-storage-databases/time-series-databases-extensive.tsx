"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-time-series-databases-extensive",
  title: "Time-Series Databases",
  description:
    "Deep guide to time-series databases, data modeling, retention, and performance trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "time-series-databases",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "timeseries", "nosql"],
  relatedTopics: [
    "column-family-stores",
    "query-optimization-techniques",
    "database-partitioning",
  ],
};

export default function TimeSeriesDatabasesExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Time-series databases (TSDBs)</strong> are specialized systems
          optimized for time-stamped data. They handle high ingestion rates,
          efficient time-range queries, and automatic retention policies.
        </p>
        <p>
          Common workloads include metrics, logs, IoT telemetry, financial
          tick data, and application monitoring. TSDBs trade query flexibility
          for strong performance on time-window analytics.
        </p>
        <p>
          Many TSDBs use columnar storage and compression to reduce disk usage
          and accelerate aggregation queries.
        </p>
      </section>

      <section>
        <h2>Time-Based Data Model</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/tsdb-model.svg"
          alt="Time-series data model"
          caption="Measurements are indexed by time and tags"
        />
        <p>
          TSDBs often separate <strong>tags</strong> (indexed dimensions like
          host or region) from <strong>fields</strong> (actual metric values).
          This allows efficient filtering and grouping by tags.
        </p>
        <p>
          The primary access pattern is time-range queries, so the storage
          engine optimizes for sequential writes and time-sorted reads.
        </p>
      </section>

      <section>
        <h2>Retention and Downsampling</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/retention-downsampling.svg"
          alt="Retention and downsampling"
          caption="Older data is aggregated and expired automatically"
        />
        <p>
          Retention policies automatically delete old data to control storage
          costs. Downsampling aggregates older data into coarser intervals,
          preserving trends while reducing volume.
        </p>
        <p>
          This is essential for metrics workloads, where raw data grows quickly
          and only recent high-resolution data is needed.
        </p>
      </section>

      <section>
        <h2>Query Patterns</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/tsdb-query-patterns.svg"
          alt="Time-series query patterns"
          caption="Windowed aggregation is the dominant query pattern"
        />
        <p>
          Common queries include time-window aggregates (mean, p95, max), rate
          calculations, and group-by tag analysis. TSDBs are optimized for these
          patterns.
        </p>
        <p>
          Ad-hoc joins are usually limited. The focus is on fast aggregations
          across time ranges.
        </p>
      </section>

      <section>
        <h2>Example: Metrics Table</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Timescale-style hypertable
CREATE TABLE metrics (
  ts TIMESTAMPTZ NOT NULL,
  host TEXT,
  cpu DOUBLE PRECISION,
  mem DOUBLE PRECISION
);
SELECT create_hypertable('metrics', 'ts');`}</code>
        </pre>
        <p>
          Hypertables partition data by time and improve query performance on
          time ranges.
        </p>
      </section>

      <section>
        <h2>High-Cardinality Challenges</h2>
        <p>
          High-cardinality tags (many unique values) can explode index sizes
          and degrade query performance. Examples include user_id or request_id.
        </p>
        <p>
          Mitigations include limiting tag cardinality, using rollups, and
          separating high-cardinality dimensions into separate stores.
        </p>
      </section>

      <section>
        <h2>Operational Trade-offs</h2>
        <p>
          TSDBs provide strong performance for time-based data, but require:
        </p>
        <ul className="space-y-2">
          <li>Careful tag selection to avoid cardinality blowups.</li>
          <li>Retention policies tuned to storage budgets.</li>
          <li>Downsampling strategies aligned to analytics needs.</li>
        </ul>
      </section>

      <section>
        <h2>Design Checklist</h2>
        <ul className="space-y-2">
          <li>Model metrics with low-cardinality tags.</li>
          <li>Set retention policies early.</li>
          <li>Use downsampling for long-term trends.</li>
          <li>Optimize for time-window queries.</li>
          <li>Monitor ingestion rates and storage growth.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
