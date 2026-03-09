"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-orms-extensive",
  title: "ORMs",
  description:
    "Deep guide to ORMs, performance pitfalls, and design patterns for scalable data access.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "orms",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "orm", "sql"],
  relatedTopics: [
    "sql-queries-optimization",
    "database-indexes",
    "query-optimization-techniques",
  ],
};

export default function OrmsExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>ORMs (Object-Relational Mappers)</strong> map relational data
          into application objects, letting developers interact with the
          database through a language-native API instead of raw SQL. ORMs
          accelerate development, provide schema mapping, and help ensure
          safety through parameterized queries.
        </p>
        <p>
          The main risk is abstraction leakage. ORMs can hide inefficient SQL,
          resulting in slow queries and excessive database load. High-scale
          systems often mix ORM use with hand-tuned SQL for critical paths.
        </p>
        <p>
          The key is to understand how the ORM translates requests into SQL
          and to instrument the generated queries.
        </p>
      </section>

      <section>
        <h2>ORM Architecture</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/orm-architecture.svg"
          alt="ORM architecture"
          caption="ORMs map objects to tables and generate SQL"
        />
        <p>
          ORMs typically include:
        </p>
        <ul className="space-y-2">
          <li><strong>Entity mapping:</strong> Classes map to tables.</li>
          <li><strong>Unit of work:</strong> Tracks changes and persists them.</li>
          <li><strong>Query builder:</strong> Composable, safe SQL generation.</li>
          <li><strong>Migration system:</strong> Schema changes in code.</li>
        </ul>
      </section>

      <section>
        <h2>N+1 Problem and Loading Strategies</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/n-plus-one.svg"
          alt="N+1 query pattern"
          caption="Fetching related records can multiply queries"
        />
        <p>
          The N+1 problem occurs when the ORM loads a list of entities, then
          runs an additional query per entity to fetch relations. This creates
          N+1 queries instead of 1 or 2.
        </p>
        <p>
          Solutions include:
        </p>
        <ul className="space-y-2">
          <li><strong>Eager loading:</strong> Fetch relations in one query.</li>
          <li><strong>Batch loading:</strong> Load related data in batches.</li>
          <li><strong>Explicit joins:</strong> Write optimized queries where needed.</li>
        </ul>
      </section>

      <section>
        <h2>Lazy vs Eager Loading</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/lazy-eager.svg"
          alt="Lazy vs eager loading"
          caption="Lazy loading trades round trips for convenience"
        />
        <p>
          Lazy loading loads related data only when accessed, which is convenient
          but can cause hidden database traffic. Eager loading fetches related
          data upfront, which is more predictable but can over-fetch.
        </p>
        <p>
          The best approach is context-dependent: use eager loading for
          predictable access patterns and lazy loading for rarely used relations.
        </p>
      </section>

      <section>
        <h2>Performance Pitfalls</h2>
        <p>
          ORMs can generate inefficient SQL. Common issues include:
        </p>
        <ul className="space-y-2">
          <li>Missing indexes on query fields.</li>
          <li>Over-fetching columns and rows.</li>
          <li>N+1 query explosions.</li>
          <li>Unintended full table scans.</li>
        </ul>
        <p className="mt-4">
          The fix is observability: log queries, inspect query plans, and
          optimize hot paths with explicit SQL or tailored ORM queries.
        </p>
      </section>

      <section>
        <h2>Example: ORM Query with Eager Loading</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`const users = await db.user.findMany({
  where: { status: "active" },
  include: { orders: true, profile: true },
});`}</code>
        </pre>
        <p>
          This avoids N+1 by pulling related data in a single query. Always
          confirm the generated SQL is efficient.
        </p>
      </section>

      <section>
        <h2>Transactions and Units of Work</h2>
        <p>
          ORMs often provide a unit of work that tracks changes and commits
          them in a single transaction. This is useful for atomic updates across
          multiple tables.
        </p>
        <p>
          However, long-running transactions can hold locks and reduce
          concurrency. Keep ORM transactions short and scoped.
        </p>
      </section>

      <section>
        <h2>When to Use Raw SQL</h2>
        <p>
          High-scale systems often mix ORM and SQL. Use ORM for simple CRUD and
          rapid development, but switch to raw SQL for:
        </p>
        <ul className="space-y-2">
          <li>Complex joins and aggregations.</li>
          <li>Database-specific features (CTEs, window functions).</li>
          <li>Performance-critical endpoints.</li>
        </ul>
      </section>

      <section>
        <h2>Operational Checklist</h2>
        <ul className="space-y-2">
          <li>Enable query logging in non-prod environments.</li>
          <li>Monitor slow queries and inspect ORM-generated SQL.</li>
          <li>Use eager loading to avoid N+1 patterns.</li>
          <li>Define clear boundaries for ORM vs raw SQL.</li>
          <li>Keep migrations in sync with ORM models.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
