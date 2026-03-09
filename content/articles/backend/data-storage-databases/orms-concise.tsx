"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-orms-concise",
  title: "ORMs",
  description:
    "Concise guide to ORMs, trade-offs, and interview-ready concepts like N+1 and eager loading.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "orms",
  version: "concise",
  wordCount: 1900,
  readingTime: 9,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "orm", "sql"],
  relatedTopics: [
    "sql-queries-optimization",
    "database-indexes",
    "query-optimization-techniques",
  ],
};

export default function OrmsConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>ORMs (Object-Relational Mappers)</strong> map database tables
          to application objects so developers can work in their language
          instead of raw SQL. ORMs speed development, enforce schemas, and
          provide safer query construction, but they can hide SQL behavior and
          cause performance issues if used carelessly.
        </p>
        <p>
          The most common ORM problem is the <strong>N+1 query</strong> pattern,
          where fetching related data triggers many extra queries.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>Mapping:</strong> Classes map to tables and rows.</li>
          <li><strong>Lazy vs eager loading:</strong> When related data is fetched.</li>
          <li><strong>N+1 queries:</strong> One query for N rows plus N queries for relations.</li>
          <li><strong>Query builder:</strong> Composable, safe query construction.</li>
          <li><strong>Transactions:</strong> ORM-managed unit of work.</li>
          <li><strong>Migration tooling:</strong> Schema changes tracked in code.</li>
        </ul>
        <p className="mt-4">
          ORMs are great for productivity but require understanding of the
          SQL they generate, especially at scale.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Example: Prisma-style ORM usage
const users = await db.user.findMany({
  where: { status: "active" },
  include: { orders: true },
});`}</code>
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
                ✓ Faster development<br />
                ✓ Safer queries (parameterized)<br />
                ✓ Schema migrations in code<br />
                ✓ Consistent data access patterns
              </td>
              <td className="p-3">
                ✗ Hidden SQL and performance traps<br />
                ✗ N+1 query issues<br />
                ✗ Harder to use advanced SQL features<br />
                ✗ Debugging generated queries can be tricky
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Use ORMs when:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Productivity and schema safety are priorities</li>
          <li>• Data access patterns are relatively standard</li>
          <li>• Teams want migrations and models in one place</li>
        </ul>
        <p><strong>Be cautious when:</strong></p>
        <ul className="space-y-1">
          <li>• Queries are complex and highly optimized</li>
          <li>• You need database-specific features heavily</li>
          <li>• Performance is extremely sensitive</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain the N+1 problem and how eager loading solves it.</li>
          <li>Highlight that ORMs still require SQL understanding.</li>
          <li>Discuss migration tooling and schema versioning.</li>
          <li>Note trade-offs between productivity and performance.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the N+1 query problem?</p>
            <p className="mt-2 text-sm">
              A: Fetching a list of rows triggers one query, but fetching each
              row’s related data triggers N additional queries.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you fix N+1 queries?</p>
            <p className="mt-2 text-sm">
              A: Use eager loading, joins, or batched queries to fetch related
              data in fewer queries.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When would you avoid an ORM?</p>
            <p className="mt-2 text-sm">
              A: For performance-critical systems with complex SQL that needs
              fine tuning or database-specific features.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do ORMs help with security?</p>
            <p className="mt-2 text-sm">
              A: They generate parameterized queries by default, reducing SQL
              injection risk.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
