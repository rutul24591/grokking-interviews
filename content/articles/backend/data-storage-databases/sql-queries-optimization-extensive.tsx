"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-sql-queries-optimization-extensive",
  title: "SQL Queries & Optimization",
  description:
    "Comprehensive guide to SQL query optimization, execution plans, and indexing strategy.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "sql-queries-optimization",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "sql", "databases", "performance", "optimization"],
  relatedTopics: [
    "database-indexes",
    "query-optimization-techniques",
    "connection-pooling",
  ],
};

export default function SqlQueriesOptimizationExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          SQL query optimization is the discipline of making queries fast,
          predictable, and resource-efficient. It combines schema design,
          indexing, and query rewriting to minimize scans and reduce latency.
        </p>
        <p>
          Most backend performance problems come from slow queries. Optimizing
          SQL often yields larger gains than application-level caching or scaling.
        </p>
      </section>

      <section>
        <h2>Execution Plans and the Query Planner</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/query-plan.svg"
          alt="Query execution plan"
          caption="Simplified view of an execution plan"
        />
        <p>
          The database query planner chooses an execution plan based on
          statistics: row counts, index selectivity, and data distribution.
          The same SQL can have very different plans depending on indexes.
        </p>
        <p>
          Use EXPLAIN (and EXPLAIN ANALYZE) to see the plan and actual timing.
          This is the single most important tool for optimization.
        </p>
      </section>

      <section>
        <h2>Indexing Strategy</h2>
        <p>
          Indexes are the primary lever for performance. They speed reads but
          slow writes and consume memory. The key is to index based on access
          patterns, not theory.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`-- Composite index for common filter + sort
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);`}</code>
        </pre>
      </section>

      <section>
        <h2>Query Shape and Predicate Pushdown</h2>
        <p>
          Filter early to reduce scanned rows. Avoid SELECT * and only return
          columns you need. Apply WHERE conditions before JOINs where possible
          to reduce intermediate result size.
        </p>
        <p>
          The planner can reorder joins, but it needs accurate statistics to
          make good decisions. Regularly analyze tables in production.
        </p>
      </section>

      <section>
        <h2>Joins and Join Algorithms</h2>
        <p>
          Databases use nested loop, hash, or merge joins depending on data size
          and indexes. Nested loops are great for small indexed sets, while hash
          joins are better for large datasets.
        </p>
        <p>
          When joins are slow, the fix is often indexing join keys or reducing
          input size with filters.
        </p>
      </section>

      <section>
        <h2>Pagination and LIMIT/OFFSET</h2>
        <p>
          OFFSET pagination degrades with large offsets because the database
          must scan and skip rows. Cursor pagination is more efficient at scale
          because it uses indexed ordering.
        </p>
        <p>
          For APIs, prefer cursor pagination for large datasets and OFFSET for
          small lists or admin tools.
        </p>
      </section>

      <section>
        <h2>N+1 Query Pitfalls</h2>
        <p>
          N+1 queries happen when you query a list of parent rows, then query
          each child in a loop. This creates a large number of small queries
          and can crush performance.
        </p>
        <p>
          Solutions include JOINs, IN clauses, or batching. Most ORMs support
          eager loading to avoid N+1 patterns.
        </p>
      </section>

      <section>
        <h2>Caching vs Query Optimization</h2>
        <p>
          Caching hides query inefficiency but does not fix it. If a query is
          inherently slow, caching only reduces load until the cache misses.
          The best approach is to optimize queries first, then add caching.
        </p>
      </section>

      <section>
        <h2>Schema Design and Query Performance</h2>
        <p>
          Poor schema design leads to expensive joins and complex queries. Good
          normalization prevents anomalies, but too much normalization can
          slow reads. Use denormalized views or materialized tables when needed.
        </p>
      </section>

      <section>
        <h2>Operational Monitoring</h2>
        <p>
          Enable slow query logs, track query latency percentiles, and monitor
          index usage. Remove unused indexes to reduce write overhead.
        </p>
        <p>
          Use database performance dashboards to identify top queries by time
          or frequency. Optimize the 1% of queries that consume 80% of resources.
        </p>
      </section>

      <section>
        <h2>Operational Checklist</h2>
        <ul className="space-y-2">
          <li>Use EXPLAIN to analyze query plans.</li>
          <li>Add indexes based on actual query patterns.</li>
          <li>Avoid SELECT *; return only needed columns.</li>
          <li>Fix N+1 queries with joins or batching.</li>
          <li>Monitor slow query logs continuously.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
