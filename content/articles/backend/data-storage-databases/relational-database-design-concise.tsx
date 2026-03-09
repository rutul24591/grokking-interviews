"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-relational-database-design-concise",
  title: "Relational Database Design",
  description:
    "Quick overview of relational database design principles for backend interviews and rapid learning.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "relational-database-design",
  version: "concise",
  wordCount: 1750,
  readingTime: 8,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "sql", "design"],
  relatedTopics: [
    "database-indexes",
    "sql-queries-optimization",
    "transaction-isolation-levels",
  ],
};

export default function RelationalDatabaseDesignConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Relational database design</strong> is the practice of modeling
          data as tables with clear relationships, keys, and constraints. The
          goal is to preserve data integrity, reduce duplication, and make
          queries predictable and efficient.
        </p>
        <p>
          Good design starts with stable entities (users, orders, products) and
          defines how they relate (one-to-many, many-to-many). It balances
          normalization for integrity with selective denormalization for
          performance.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>Primary Keys:</strong> Unique identifiers for each row.</li>
          <li><strong>Foreign Keys:</strong> Enforce relationships across tables.</li>
          <li><strong>Normalization:</strong> 1NF → 3NF → BCNF to reduce redundancy.</li>
          <li><strong>Denormalization:</strong> Intentional duplication for read speed.</li>
          <li><strong>Constraints:</strong> NOT NULL, UNIQUE, CHECK, FK for integrity.</li>
          <li><strong>Indexes:</strong> Speed reads; cost extra writes.</li>
        </ul>
        <p className="mt-4">
          A good rule: normalize for correctness first, then denormalize
          selectively for performance once access patterns are clear.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`-- Users and Orders (1:N)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  status TEXT NOT NULL
);`}</code>
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
                ✓ Strong data integrity<br />
                ✓ Clear relationships<br />
                ✓ Mature tooling and SQL<br />
                ✓ Consistent transactional behavior
              </td>
              <td className="p-3">
                ✗ Joins can be expensive at scale<br />
                ✗ Schema changes require planning<br />
                ✗ Over-normalization can slow reads
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Best for:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Systems with strong consistency requirements</li>
          <li>• Financial or transactional workflows</li>
          <li>• Complex queries and reporting</li>
        </ul>

        <p><strong>Consider alternatives for:</strong></p>
        <ul className="space-y-1">
          <li>• Massive scale with flexible schema needs</li>
          <li>• Event-heavy or document-centric data</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain normalization and why it prevents anomalies.</li>
          <li>Discuss when to denormalize for performance.</li>
          <li>Highlight the role of foreign keys and constraints.</li>
          <li>Explain how indexes trade write cost for faster reads.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is normalization and why use it?</p>
            <p className="mt-2 text-sm">
              A: It reduces duplication and prevents update anomalies, keeping data consistent.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When would you denormalize?</p>
            <p className="mt-2 text-sm">
              A: When read performance is critical and you can tolerate duplication.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What’s the role of foreign keys?</p>
            <p className="mt-2 text-sm">
              A: They enforce relationships and prevent orphaned records.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
