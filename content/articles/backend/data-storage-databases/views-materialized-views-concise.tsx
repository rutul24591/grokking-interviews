"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-views-materialized-views-concise",
  title: "Views & Materialized Views",
  description:
    "Concise guide to views and materialized views, including trade-offs and interview tips.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "views-materialized-views",
  version: "concise",
  wordCount: 1900,
  readingTime: 9,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "sql", "views"],
  relatedTopics: [
    "sql-queries-optimization",
    "query-optimization-techniques",
    "read-replicas",
  ],
};

export default function ViewsMaterializedViewsConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Views</strong> are saved SQL queries that behave like virtual
          tables. They simplify complex queries and provide a stable interface
          for consumers. <strong>Materialized views</strong> store the query
          result physically, trading freshness for faster reads.
        </p>
        <p>
          Views are always up to date but can be slow for heavy queries.
          Materialized views are fast but must be refreshed to avoid stale data.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>Virtual vs Stored:</strong> Views compute on read, materialized store results.</li>
          <li><strong>Refresh:</strong> Materialized views need refresh schedules.</li>
          <li><strong>Security:</strong> Views expose only required columns.</li>
          <li><strong>Performance:</strong> Materialized views speed heavy aggregations.</li>
          <li><strong>Consistency:</strong> Staleness trade-off vs real-time.</li>
        </ul>
        <p className="mt-4">
          Use views to simplify or secure data access, and materialized views
          to precompute expensive analytics queries.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`-- View
CREATE VIEW active_users AS
SELECT id, email FROM users WHERE status = 'active';

-- Materialized view
CREATE MATERIALIZED VIEW monthly_sales AS
SELECT date_trunc('month', created_at) AS month,
       SUM(total_cents) AS revenue
FROM orders
GROUP BY 1;`}</code>
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
                ✓ Simplifies complex SQL<br />
                ✓ Restricts access to sensitive data<br />
                ✓ Materialized views speed reads<br />
                ✓ Stable interfaces for reporting
              </td>
              <td className="p-3">
                ✗ Views can still be slow<br />
                ✗ Materialized views can be stale<br />
                ✗ Refresh jobs add complexity<br />
                ✗ Storage overhead for materialized results
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Use views when:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• You need a simplified or secure data interface</li>
          <li>• Consumers should not access raw tables</li>
        </ul>
        <p><strong>Use materialized views when:</strong></p>
        <ul className="space-y-1">
          <li>• Queries are expensive and repeat often</li>
          <li>• Slightly stale data is acceptable</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain virtual vs stored results clearly.</li>
          <li>Discuss refresh strategies and staleness trade-offs.</li>
          <li>Highlight security and abstraction benefits of views.</li>
          <li>Explain when to use a materialized view for analytics.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the difference between a view and a materialized view?</p>
            <p className="mt-2 text-sm">
              A: A view is computed at query time. A materialized view stores
              results and must be refreshed to stay current.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When would you use a materialized view?</p>
            <p className="mt-2 text-sm">
              A: For expensive aggregations or reports that run often, where
              slight staleness is acceptable.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you refresh materialized views?</p>
            <p className="mt-2 text-sm">
              A: On a schedule, on demand, or with incremental refresh where
              supported by the database.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Can views improve security?</p>
            <p className="mt-2 text-sm">
              A: Yes. Views can expose only specific columns or rows and hide
              sensitive fields in base tables.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
