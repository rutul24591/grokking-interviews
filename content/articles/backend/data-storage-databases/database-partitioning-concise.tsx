"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-database-partitioning-concise",
  title: "Database Partitioning",
  description:
    "Concise guide to database partitioning strategies, trade-offs, and interview-ready talking points.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "database-partitioning",
  version: "concise",
  wordCount: 1900,
  readingTime: 9,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "partitioning", "scaling"],
  relatedTopics: [
    "read-replicas",
    "database-indexes",
    "query-optimization-techniques",
  ],
};

export default function DatabasePartitioningConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Database partitioning</strong> splits a large table into smaller,
          more manageable parts (partitions) while keeping a single logical table
          interface. The goal is to improve performance, reduce maintenance cost,
          and scale write throughput by spreading data across partitions.
        </p>
        <p>
          Partitioning is different from <strong>replication</strong>. Replication
          copies the same data to multiple nodes for reads and availability.
          Partitioning divides data so each partition holds only a subset.
        </p>
        <p>
          Most systems start with vertical and horizontal partitioning inside a
          single database instance, then move to sharding across nodes when the
          dataset or traffic grows beyond a single machine.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li>
            <strong>Horizontal partitioning (sharding):</strong> Split rows by a
            key such as user_id or tenant_id.
          </li>
          <li>
            <strong>Vertical partitioning:</strong> Split columns into separate
            tables to isolate hot or large fields.
          </li>
          <li>
            <strong>Range partitioning:</strong> Rows grouped by ranges (dates,
            numeric ids).
          </li>
          <li>
            <strong>Hash partitioning:</strong> Rows distributed by hashing a key
            to balance load.
          </li>
          <li>
            <strong>List partitioning:</strong> Rows mapped to explicit buckets
            (regions, tenant tiers).
          </li>
          <li>
            <strong>Partition key:</strong> The attribute that decides placement
            and query routing.
          </li>
          <li>
            <strong>Rebalancing:</strong> Moving data when partitions grow uneven.
          </li>
        </ul>
        <p className="mt-4">
          The partition key is the most important decision. A poor key creates
          hotspots and uneven data distribution. A good key spreads load evenly
          and aligns with dominant query patterns.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`-- Postgres range partitioning by created_at
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  created_at DATE NOT NULL,
  total_cents INT NOT NULL
) PARTITION BY RANGE (created_at);

CREATE TABLE orders_2026_q1 PARTITION OF orders
  FOR VALUES FROM ('2026-01-01') TO ('2026-04-01');

CREATE TABLE orders_2026_q2 PARTITION OF orders
  FOR VALUES FROM ('2026-04-01') TO ('2026-07-01');`}</code>
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
                ✓ Faster queries via partition pruning<br />
                ✓ Easier archival and maintenance<br />
                ✓ Scales writes with sharding<br />
                ✓ Limits blast radius of large tables
              </td>
              <td className="p-3">
                ✗ Complex routing and rebalancing<br />
                ✗ Cross-partition joins are expensive<br />
                ✗ Hot partitions cause uneven load<br />
                ✗ Operational complexity grows quickly
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Use partitioning when:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Tables are large and queries hit a natural partition key</li>
          <li>• Maintenance tasks (vacuum, archival) are too slow</li>
          <li>• Write throughput exceeds a single node</li>
        </ul>
        <p><strong>Consider alternatives when:</strong></p>
        <ul className="space-y-1">
          <li>• Data volumes are small and stable</li>
          <li>• Cross-table joins are the primary workload</li>
          <li>• Operational overhead outweighs performance gains</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>
            Explain the difference between partitioning and replication.
          </li>
          <li>
            Talk about partition key selection and how it prevents hotspots.
          </li>
          <li>
            Mention partition pruning and why it speeds up queries.
          </li>
          <li>
            Note that cross-partition joins and transactions are costly.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the difference between sharding and partitioning?</p>
            <p className="mt-2 text-sm">
              A: Partitioning splits a table into partitions that can still live
              on one database instance. Sharding is horizontal partitioning
              across multiple nodes.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you choose a good partition key?</p>
            <p className="mt-2 text-sm">
              A: Pick a key that aligns with common queries and distributes data
              evenly to avoid hotspots.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What problems appear with cross-partition queries?</p>
            <p className="mt-2 text-sm">
              A: They require fan-out to multiple partitions, which increases
              latency and resource usage.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is partition pruning?</p>
            <p className="mt-2 text-sm">
              A: The database skips partitions that cannot contain matching rows,
              reducing I/O and query time.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
