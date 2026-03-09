"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-sql-queries-optimization-concise",
  title: "SQL Queries & Optimization",
  description:
    "Quick overview of SQL query optimization for backend interviews and rapid learning.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "sql-queries-optimization",
  version: "concise",
  wordCount: 1750,
  readingTime: 8,
  lastUpdated: "2026-03-09",
  tags: ["backend", "sql", "databases", "performance"],
  relatedTopics: [
    "database-indexes",
    "query-optimization-techniques",
    "connection-pooling",
  ],
};

export default function SqlQueriesOptimizationConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          SQL query optimization is about making queries fast and predictable.
          It relies on good indexes, efficient query patterns, and understanding
          how the database chooses execution plans.
        </p>
        <p>
          Most slow queries come from missing indexes, excessive joins, or
          unbounded scans. Optimizing SQL is often the highest‑ROI performance
          improvement for backend systems.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>Indexes:</strong> Speed reads, cost writes and storage.</li>
          <li><strong>Execution Plans:</strong> DB chooses join order and scans.</li>
          <li><strong>Query Shape:</strong> Filter early, limit rows, avoid SELECT *.</li>
          <li><strong>Joins:</strong> Use proper join types and indexed keys.</li>
          <li><strong>Statistics:</strong> Query planner relies on table stats.</li>
        </ul>
        <p className="mt-4">
          A good rule: the planner can only optimize what it can index. Design
          queries around indexed columns and predictable access patterns.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`-- Add index for frequent lookup
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Use WHERE + LIMIT
SELECT * FROM orders WHERE user_id = 42 ORDER BY created_at DESC LIMIT 20;`}</code>
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
                ✓ Faster queries and lower latency<br />
                ✓ Reduced database load<br />
                ✓ Predictable performance
              </td>
              <td className="p-3">
                ✗ Indexes slow writes<br />
                ✗ Over-optimization adds complexity<br />
                ✗ Requires ongoing monitoring
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Best for:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• High-traffic API endpoints</li>
          <li>• Reporting queries with large datasets</li>
          <li>• Latency-sensitive workloads</li>
        </ul>

        <p><strong>Consider alternatives for:</strong></p>
        <ul className="space-y-1">
          <li>• Complex analytics (use OLAP/warehouse)</li>
          <li>• Full‑text search (use search engine)</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain how indexes trade write cost for read speed.</li>
          <li>Discuss how EXPLAIN shows query plans.</li>
          <li>Highlight filtering and limiting early.</li>
          <li>Call out N+1 query pitfalls.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you find slow queries?</p>
            <p className="mt-2 text-sm">
              A: Use query logs and EXPLAIN plans to identify full scans or bad joins.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why can an index hurt performance?</p>
            <p className="mt-2 text-sm">
              A: Indexes slow writes and consume memory; too many can hurt overall throughput.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is an N+1 query problem?</p>
            <p className="mt-2 text-sm">
              A: Fetching related data in a loop instead of a join, causing many extra queries.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
