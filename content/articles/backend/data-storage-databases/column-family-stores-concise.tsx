"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-column-family-stores-concise",
  title: "Column-Family Stores",
  description:
    "Concise guide to column-family databases, data modeling, and interview-ready trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "column-family-stores",
  version: "concise",
  wordCount: 1850,
  readingTime: 9,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "nosql", "column-family"],
  relatedTopics: [
    "cap-theorem",
    "base-properties",
    "query-optimization-techniques",
  ],
};

export default function ColumnFamilyStoresConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Column-family stores</strong> (wide-column databases) organize
          data by column families rather than rows. They are optimized for
          high write throughput, large-scale storage, and predictable access
          patterns, making them popular for time-series, logs, and IoT data.
        </p>
        <p>
          Examples include Cassandra, HBase, and Bigtable. They align with
          BASE properties and favor availability and scalability.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>Wide rows:</strong> Rows can have millions of columns.</li>
          <li><strong>Column families:</strong> Group columns by access pattern.</li>
          <li><strong>Partition key:</strong> Determines data placement.</li>
          <li><strong>Clustering key:</strong> Sorts data within a partition.</li>
          <li><strong>Tunable consistency:</strong> Adjust read/write quorums.</li>
          <li><strong>Denormalization:</strong> Model data by query patterns.</li>
        </ul>
        <p className="mt-4">
          Design is query-first: you shape tables around your access patterns
          to avoid joins and scans.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Cassandra-style table for time-series
CREATE TABLE metrics_by_device (
  device_id TEXT,
  ts TIMESTAMP,
  metric_name TEXT,
  value DOUBLE,
  PRIMARY KEY (device_id, ts)
) WITH CLUSTERING ORDER BY (ts DESC);`}</code>
        </pre>
      </section>

      <section>
        <h2>Pros & Cons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Pros</th>
              <th className="p-3 text-left">Cons</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                ✓ High write throughput<br />
                ✓ Horizontal scalability<br />
                ✓ Efficient for time-series data<br />
                ✓ Tunable consistency
              </td>
              <td className="p-3">
                ✗ Query-driven schema design<br />
                ✗ Limited joins and aggregations<br />
                ✗ Hot partitions possible<br />
                ✗ More complex data modeling
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Use column-family stores when:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Write throughput is very high</li>
          <li>• Access patterns are predictable</li>
          <li>• You need large-scale horizontal distribution</li>
        </ul>
        <p><strong>Use SQL or document stores when:</strong></p>
        <ul className="space-y-1">
          <li>• You need flexible joins or ad-hoc queries</li>
          <li>• Relationships are complex and changing</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain partition keys vs clustering keys.</li>
          <li>Emphasize query-driven data modeling.</li>
          <li>Discuss tunable consistency and quorum reads.</li>
          <li>Highlight write-optimized workloads like metrics or logs.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why are column-family stores good for time-series?</p>
            <p className="mt-2 text-sm">
              A: They handle high write rates and can cluster data by time
              within partitions for efficient range scans.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a wide row?</p>
            <p className="mt-2 text-sm">
              A: A row with a large number of columns, often used to group
              related data under a single partition key.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is tunable consistency?</p>
            <p className="mt-2 text-sm">
              A: The ability to choose read/write quorums to trade consistency
              for availability and latency.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why is schema design query-driven?</p>
            <p className="mt-2 text-sm">
              A: Because joins are limited, you model tables to match access
              patterns directly.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
