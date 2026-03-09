"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-stored-procedures-functions-concise",
  title: "Stored Procedures & Functions",
  description:
    "Concise guide to stored procedures and functions, use cases, and trade-offs for interviews.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "stored-procedures-functions",
  version: "concise",
  wordCount: 1850,
  readingTime: 9,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "sql", "stored-procedures"],
  relatedTopics: [
    "sql-queries-optimization",
    "transaction-isolation-levels",
    "concurrency-control",
  ],
};

export default function StoredProceduresFunctionsConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Stored procedures and functions</strong> are database-side
          programs that run close to the data. Procedures encapsulate logic with
          side effects (writes, transactions), while functions typically return
          values and are used in queries.
        </p>
        <p>
          They can improve performance by reducing network round trips and by
          allowing the database to optimize execution. However, they can also
          increase coupling between application and database.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>Procedures:</strong> Imperative logic with side effects.</li>
          <li><strong>Functions:</strong> Return values, can be used in SELECT.</li>
          <li><strong>Encapsulation:</strong> Business rules live in the DB.</li>
          <li><strong>Performance:</strong> Fewer round trips, set-based processing.</li>
          <li><strong>Security:</strong> Grant execute permissions, hide tables.</li>
          <li><strong>Versioning:</strong> Harder to manage than app code.</li>
        </ul>
        <p className="mt-4">
          Stored logic is powerful, but you must balance performance gains with
          operational complexity and deployment friction.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`-- Postgres function
CREATE OR REPLACE FUNCTION total_spent(user_id BIGINT)
RETURNS NUMERIC AS $$
  SELECT COALESCE(SUM(total_cents), 0) / 100.0
  FROM orders
  WHERE orders.user_id = $1;
$$ LANGUAGE SQL;`}</code>
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
                ✓ Faster for complex data logic<br />
                ✓ Centralized business rules<br />
                ✓ Security via EXECUTE privileges<br />
                ✓ Less application code
              </td>
              <td className="p-3">
                ✗ Harder to test and version<br />
                ✗ Vendor lock-in with DB-specific languages<br />
                ✗ Harder to scale horizontally<br />
                ✗ Debugging can be painful
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Use stored logic when:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Data-heavy operations benefit from set-based processing</li>
          <li>• You want to enforce invariants inside the DB</li>
          <li>• You need to reduce chatty network calls</li>
        </ul>
        <p><strong>Be cautious when:</strong></p>
        <ul className="space-y-1">
          <li>• You need portability across databases</li>
          <li>• Your team lacks DB-language expertise</li>
          <li>• You expect frequent logic changes</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain when stored logic is faster than app-side loops.</li>
          <li>Discuss how EXECUTE permissions improve security.</li>
          <li>Highlight the trade-off of DB coupling and deployment friction.</li>
          <li>Differentiate functions vs procedures and where each fits.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why use stored procedures instead of app code?</p>
            <p className="mt-2 text-sm">
              A: They reduce round trips and allow set-based logic near the data,
              often improving performance for complex operations.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What are the downsides of stored procedures?</p>
            <p className="mt-2 text-sm">
              A: Harder versioning, testing, and portability; they also increase
              coupling to a specific database.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do functions differ from procedures?</p>
            <p className="mt-2 text-sm">
              A: Functions return values and can be used in queries; procedures
              are for side effects like updates and transactions.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do stored procedures improve security?</p>
            <p className="mt-2 text-sm">
              A: You can grant EXECUTE without exposing underlying tables, limiting
              direct access while allowing controlled operations.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
