"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-column-family-stores-extensive",
  title: "Column-Family Stores",
  description:
    "Deep guide to wide-column databases, data modeling patterns, and scalability trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "column-family-stores",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "nosql", "column-family"],
  relatedTopics: [
    "cap-theorem",
    "base-properties",
    "query-optimization-techniques",
  ],
};

export default function ColumnFamilyStoresExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Column-family stores</strong> (wide-column databases) group
          data by column families, allowing very wide rows with many columns
          and efficient access to subsets of columns. They are designed for
          high write throughput and massive horizontal scalability.
        </p>
        <p>
          They are often used for time-series data, event logs, telemetry, and
          analytics workloads where access patterns are well understood.
        </p>
        <p>
          Systems like Cassandra and Bigtable align with BASE properties and
          provide tunable consistency, letting teams choose performance vs
          correctness trade-offs.
        </p>
      </section>

      <section>
        <h2>Data Model: Partitions and Clustering</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/column-family-model.svg"
          alt="Column-family model"
          caption="Partition keys group rows; clustering keys sort data"
        />
        <p>
          Data is partitioned by a <strong>partition key</strong>, which decides
          where data lives. Within a partition, rows are ordered by a
          <strong>clustering key</strong>, enabling efficient range scans.
        </p>
        <p>
          This model supports very wide rows that store related data together,
          reducing the need for joins.
        </p>
      </section>

      <section>
        <h2>Query-Driven Modeling</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/query-driven-modeling.svg"
          alt="Query-driven modeling"
          caption="Tables are shaped around access patterns"
        />
        <p>
          Unlike relational databases, column-family stores require modeling
          around queries. You denormalize and design tables for each access
          pattern, often duplicating data.
        </p>
        <p>
          This yields predictable performance but increases storage and write
          complexity.
        </p>
      </section>

      <section>
        <h2>Consistency and Quorums</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/column-family-quorums.svg"
          alt="Column-family quorums"
          caption="Read/write quorums control consistency levels"
        />
        <p>
          Many column-family stores use quorum reads and writes. By adjusting
          read (R) and write (W) thresholds, you can trade consistency for
          availability and latency.
        </p>
        <p>
          Stronger consistency requires higher quorum values, which increases
          coordination cost.
        </p>
      </section>

      <section>
        <h2>Example: Time-Series Table</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`CREATE TABLE metrics_by_device (
  device_id TEXT,
  ts TIMESTAMP,
  metric_name TEXT,
  value DOUBLE,
  PRIMARY KEY (device_id, ts)
) WITH CLUSTERING ORDER BY (ts DESC);`}</code>
        </pre>
        <p>
          This design allows efficient retrieval of recent metrics for a device.
          Queries that do not include device_id would be inefficient.
        </p>
      </section>

      <section>
        <h2>Operational Trade-offs</h2>
        <p>
          Column-family stores scale well but require careful modeling:
        </p>
        <ul className="space-y-2">
          <li>Partition keys must avoid hotspots.</li>
          <li>Denormalization increases write complexity.</li>
          <li>Large partitions can degrade performance.</li>
          <li>Schema evolution requires planning.</li>
        </ul>
      </section>

      <section>
        <h2>Design Checklist</h2>
        <ul className="space-y-2">
          <li>Design tables around specific query patterns.</li>
          <li>Choose partition keys that spread load evenly.</li>
          <li>Use clustering keys for ordered range reads.</li>
          <li>Monitor partition sizes and hot spots.</li>
          <li>Use quorum settings appropriate for SLAs.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
