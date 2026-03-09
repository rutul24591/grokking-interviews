"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-query-optimization-techniques-concise",
  title: "Query Optimization Techniques",
  description:
    "Quick overview of practical SQL query optimization techniques for backend interviews.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "query-optimization-techniques",
  version: "concise",
  wordCount: 1750,
  readingTime: 8,
  lastUpdated: "2026-03-09",
  tags: ["backend", "sql", "databases", "optimization"],
  relatedTopics: [
    "sql-queries-optimization",
    "database-indexes",
    "index-types",
  ],
};

export default function QueryOptimizationTechniquesConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          Query optimization techniques reduce latency and database load by
          improving how SQL is executed. The biggest wins come from better
          indexing, selective filters, and efficient joins.
        </p>
        <p>
          Optimization is a loop: measure, adjust, and validate with EXPLAIN.
          Guessing without data often makes queries worse.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>Indexing:</strong> Add indexes for common filters and joins.</li>
          <li><strong>Filter Early:</strong> Reduce rows before joins/aggregations.</li>
          <li><strong>Limit & Paginate:</strong> Avoid unbounded result sets.</li>
          <li><strong>Query Shape:</strong> Prefer explicit columns, avoid SELECT *.</li>
          <li><strong>Statistics:</strong> Planner relies on up-to-date stats.</li>
        </ul>
        <p className="mt-4">
          Most slow queries are missing an index or scanning too many rows.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`-- Add index and limit rows
CREATE INDEX idx_orders_user_id ON orders(user_id);
SELECT id, status FROM orders
WHERE user_id = 42
ORDER BY created_at DESC
LIMIT 20;`}</code>
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
                ✓ Faster response times<br />
                ✓ Lower database load<br />
                ✓ More predictable performance
              </td>
              <td className="p-3">
                ✗ Requires monitoring and tuning<br />
                ✗ Indexes add write overhead<br />
                ✗ Over-optimization adds complexity
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Best for:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Slow or high-traffic endpoints</li>
          <li>• Queries on large datasets</li>
          <li>• Latency-sensitive APIs</li>
        </ul>

        <p><strong>Consider alternatives for:</strong></p>
        <ul className="space-y-1">
          <li>• Analytical workloads (use OLAP/warehouse)</li>
          <li>• Full-text search (use search engine)</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain how EXPLAIN shows query plans.</li>
          <li>Discuss index selectivity and why it matters.</li>
          <li>Call out N+1 query issues and fixes.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize a slow query?</p>
            <p className="mt-2 text-sm">
              A: Use EXPLAIN, add indexes, reduce scanned rows, and simplify joins.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why might a query ignore an index?</p>
            <p className="mt-2 text-sm">
              A: Low selectivity, outdated statistics, or query shape doesn’t match index.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a covering index?</p>
            <p className="mt-2 text-sm">
              A: An index that contains all columns needed by a query, avoiding table reads.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
