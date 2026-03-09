"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-database-indexes-concise",
  title: "Database Indexes",
  description:
    "Quick overview of database indexes, how they work, and when to use them.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "database-indexes",
  version: "concise",
  wordCount: 1750,
  readingTime: 8,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "indexes", "performance"],
  relatedTopics: [
    "sql-queries-optimization",
    "index-types",
    "query-optimization-techniques",
  ],
};

export default function DatabaseIndexesConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Database indexes</strong> are data structures that speed up
          lookups by avoiding full table scans. They improve read performance
          at the cost of additional storage and slower writes.
        </p>
        <p>
          Indexes are the most common fix for slow queries. The key is to index
          based on access patterns and verify usage with query plans.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>B-Tree:</strong> Default for range and equality queries.</li>
          <li><strong>Selectivity:</strong> High-cardinality columns index well.</li>
          <li><strong>Write Cost:</strong> Inserts/updates must update indexes.</li>
          <li><strong>Covering:</strong> Index includes all fields for a query.</li>
          <li><strong>Composite:</strong> Multi-column indexes for common filters.</li>
        </ul>
        <p className="mt-4">
          Indexes are not free. Every index adds write overhead, so fewer well‑chosen
          indexes are better than many unused ones.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`-- Index for frequent lookups
CREATE INDEX idx_orders_user_id ON orders(user_id);

SELECT * FROM orders WHERE user_id = 42 ORDER BY created_at DESC;`}</code>
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
                ✓ Faster reads<br />
                ✓ Efficient sorting and filtering<br />
                ✓ Enables scalable queries
              </td>
              <td className="p-3">
                ✗ Slower writes<br />
                ✗ Extra storage<br />
                ✗ Too many indexes hurt performance
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Best for:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Frequent lookups by column</li>
          <li>• Sorting or range queries</li>
          <li>• Join keys</li>
        </ul>

        <p><strong>Avoid when:</strong></p>
        <ul className="space-y-1">
          <li>• High‑write hot tables with low read value</li>
          <li>• Low‑cardinality columns (e.g., boolean flags)</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain how indexes trade write cost for faster reads.</li>
          <li>Discuss composite indexes and column order.</li>
          <li>Use EXPLAIN to show index usage.</li>
          <li>Call out covering indexes for hot queries.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why can an index slow writes?</p>
            <p className="mt-2 text-sm">
              A: Every insert/update must also update index structures, adding overhead.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a covering index?</p>
            <p className="mt-2 text-sm">
              A: An index that contains all columns needed by a query, avoiding table reads.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you check if an index is used?</p>
            <p className="mt-2 text-sm">
              A: Use EXPLAIN/EXPLAIN ANALYZE to inspect the query plan.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
