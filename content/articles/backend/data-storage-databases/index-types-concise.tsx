"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-index-types-concise",
  title: "Index Types",
  description:
    "Quick overview of primary, unique, composite, partial, and other index types.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "index-types",
  version: "concise",
  wordCount: 1750,
  readingTime: 8,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "indexes", "performance"],
  relatedTopics: [
    "database-indexes",
    "sql-queries-optimization",
    "query-optimization-techniques",
  ],
};

export default function IndexTypesConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Index types</strong> define how data is organized for fast
          lookups. Different types serve different query patterns, from unique
          lookups to composite filtering and sparse datasets.
        </p>
        <p>
          Choosing the right index type is as important as choosing the columns.
          The wrong index can be ignored by the planner or add unnecessary write cost.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>Primary Key:</strong> Unique identifier, auto‑indexed.</li>
          <li><strong>Unique:</strong> Enforces uniqueness on a column.</li>
          <li><strong>Composite:</strong> Index across multiple columns.</li>
          <li><strong>Partial:</strong> Index only rows matching a predicate.</li>
          <li><strong>Expression:</strong> Index on computed values.</li>
          <li><strong>Covering:</strong> Includes all query columns to avoid table reads.</li>
        </ul>
        <p className="mt-4">
          A good rule: use composite for multi-column filters, partial for sparse
          data, and covering when a hot query can avoid table access.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`-- Partial index for active users
CREATE INDEX idx_users_active ON users(id)
WHERE status = 'active';`}</code>
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
                ✓ Tailored performance<br />
                ✓ Enforces constraints (unique)<br />
                ✓ Smaller indexes with partial
              </td>
              <td className="p-3">
                ✗ Extra write overhead<br />
                ✗ More complexity to maintain<br />
                ✗ Wrong type can be ignored
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Best for:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Multi-column filters (composite)</li>
          <li>• Sparse datasets (partial)</li>
          <li>• Case-insensitive search (expression)</li>
        </ul>

        <p><strong>Consider alternatives for:</strong></p>
        <ul className="space-y-1">
          <li>• Very high-write tables with low read value</li>
          <li>• Queries that change frequently (index churn)</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain composite index order (leftmost prefix).</li>
          <li>Call out partial indexes for sparse conditions.</li>
          <li>Discuss expression indexes for case-insensitive lookup.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When do you use a partial index?</p>
            <p className="mt-2 text-sm">
              A: When only a subset of rows are queried frequently, like active users.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the leftmost prefix rule?</p>
            <p className="mt-2 text-sm">
              A: A composite index is only used when query filters start from its first column.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why use expression indexes?</p>
            <p className="mt-2 text-sm">
              A: To index computed values like lower(email) for case-insensitive search.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
