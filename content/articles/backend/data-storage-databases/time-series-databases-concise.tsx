"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-time-series-databases-concise",
  title: "Time-Series Databases",
  description:
    "Concise guide to time-series databases, retention policies, and interview-ready trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "time-series-databases",
  version: "concise",
  wordCount: 1850,
  readingTime: 9,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "timeseries", "nosql"],
  relatedTopics: [
    "column-family-stores",
    "query-optimization-techniques",
    "database-partitioning",
  ],
};

export default function TimeSeriesDatabasesConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Time-series databases (TSDBs)</strong> are optimized for data
          indexed by time. They excel at high write ingestion, efficient range
          queries, and retention policies for metrics, logs, and IoT telemetry.
        </p>
        <p>
          Examples include InfluxDB, TimescaleDB, and OpenTSDB. TSDBs trade
          general-purpose queries for specialized performance on time-based data.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>Time index:</strong> Time is the primary access path.</li>
          <li><strong>Retention policies:</strong> Automatically drop old data.</li>
          <li><strong>Downsampling:</strong> Aggregate old data to reduce size.</li>
          <li><strong>Tags vs fields:</strong> Tags are indexed, fields are values.</li>
          <li><strong>Compression:</strong> Columnar or time-based compression.</li>
          <li><strong>Write batching:</strong> Improves throughput.</li>
        </ul>
        <p className="mt-4">
          The main design goal is fast ingestion and efficient time-window
          queries, not complex joins.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Influx-style query
SELECT mean(cpu) FROM metrics
WHERE host = 'api-1' AND time > now() - 1h
GROUP BY time(1m);`}</code>
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
                ✓ High write ingestion<br />
                ✓ Efficient time-range queries<br />
                ✓ Built-in retention and downsampling<br />
                ✓ Compression reduces storage
              </td>
              <td className="p-3">
                ✗ Limited joins and ad-hoc queries<br />
                ✗ High-cardinality tags can hurt performance<br />
                ✗ Not ideal for transactional data
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Use TSDBs when:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Data is time-stamped and append-only</li>
          <li>• You need fast time-window analytics</li>
          <li>• Retention policies are required</li>
        </ul>
        <p><strong>Use other databases when:</strong></p>
        <ul className="space-y-1">
          <li>• You need complex joins or transactional workflows</li>
          <li>• Data is not primarily time-based</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain retention and downsampling as storage controls.</li>
          <li>Discuss high-cardinality tags as a common pitfall.</li>
          <li>Highlight ingestion throughput vs query flexibility.</li>
          <li>Connect TSDBs to metrics and observability workloads.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why are TSDBs optimized for append-only writes?</p>
            <p className="mt-2 text-sm">
              A: Appends allow sequential writes and compression by time, which
              improves ingestion speed and storage efficiency.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is downsampling?</p>
            <p className="mt-2 text-sm">
              A: Aggregating older data into coarser intervals to reduce storage
              while keeping trends.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is high-cardinality and why does it matter?</p>
            <p className="mt-2 text-sm">
              A: Too many unique tag values explode index size and hurt query
              performance.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why not use a relational DB for metrics?</p>
            <p className="mt-2 text-sm">
              A: TSDBs handle high ingestion rates and time-window queries more
              efficiently with built-in retention and compression.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
