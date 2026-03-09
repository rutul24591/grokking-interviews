"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-query-optimization-techniques-extensive",
  title: "Query Optimization Techniques",
  description:
    "Comprehensive guide to SQL query optimization techniques, join strategies, and planner behavior.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "query-optimization-techniques",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "sql", "databases", "optimization", "performance"],
  relatedTopics: [
    "sql-queries-optimization",
    "database-indexes",
    "index-types",
  ],
};

export default function QueryOptimizationTechniquesExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          Query optimization techniques make SQL execution faster and more
          predictable. They combine indexing, query rewriting, statistics,
          and execution plan analysis to minimize IO and CPU.
        </p>
        <p>
          Optimization is not guesswork. It is a measurement loop: inspect
          query plans, change one variable, remeasure, and repeat.
        </p>
      </section>

      <section>
        <h2>Optimization Tooling</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/query-optimization-techniques.svg"
          alt="Query optimization techniques"
          caption="Common levers for optimization"
        />
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/query-plan.svg"
          alt="Execution plan"
          caption="Execution plans show how the database executes SQL"
        />
        <p>
          The most important tool is EXPLAIN (or EXPLAIN ANALYZE), which shows
          the plan and actual execution times. If you don’t read query plans,
          you are optimizing blind.
        </p>
      </section>

      <section>
        <h2>Indexing as the Primary Lever</h2>
        <p>
          Indexes are the primary lever for optimization. Add indexes on columns
          used in WHERE clauses, JOIN keys, and ORDER BY. Use composite indexes
          for multi-column filters.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`-- Composite index for filtering + sorting
CREATE INDEX idx_orders_user_created
ON orders(user_id, created_at DESC);`}</code>
        </pre>
      </section>

      <section>
        <h2>Join Strategies</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/join-algorithms.svg"
          alt="Join algorithms"
          caption="Nested loop, hash join, and merge join"
        />
        <p>
          Databases choose join algorithms based on dataset size and available
          indexes. Nested loop is efficient for small indexed sets. Hash join is
          efficient for large unsorted sets. Merge join is best when inputs are
          already sorted.
        </p>
        <p>
          If joins are slow, reduce input size with filters or add indexes on
          join keys.
        </p>
      </section>

      <section>
        <h2>Query Rewriting Techniques</h2>
        <p>
          Rewrite queries to reduce scans. Common tactics include:
        </p>
        <ul className="space-y-2">
          <li>Replace correlated subqueries with joins.</li>
          <li>Filter before aggregation.</li>
          <li>Use EXISTS instead of IN for large sets.</li>
          <li>Avoid SELECT * and return only required columns.</li>
        </ul>
      </section>

      <section>
        <h2>Statistics and Planner Accuracy</h2>
        <p>
          The planner relies on table statistics. If statistics are stale, the
          planner can choose poor plans. Run ANALYZE regularly, especially after
          large data changes.
        </p>
        <p>
          In production, automatic statistics updates may lag. This often
          explains why a query “suddenly became slow” after a large import.
        </p>
      </section>

      <section>
        <h2>Pagination Strategies</h2>
        <p>
          OFFSET pagination scans and skips rows, which is slow at scale. Cursor
          pagination uses indexed ordering and performs better for large datasets.
        </p>
        <p>
          For user-facing APIs, cursor pagination is the default choice for
          scalability. OFFSET is acceptable for small admin tables.
        </p>
      </section>

      <section>
        <h2>Batching and N+1 Avoidance</h2>
        <p>
          N+1 queries destroy performance by multiplying round trips. Fix them
          with JOINs, IN queries, or batching. Most ORMs provide eager loading
          to prevent N+1 by default.
        </p>
      </section>

      <section>
        <h2>Materialized Views and Precomputation</h2>
        <p>
          For expensive aggregations, materialized views or summary tables can
          shift work to background jobs. This trades freshness for query speed.
        </p>
        <p>
          Refresh frequency should match the business need. For dashboards,
          minute-level freshness is often sufficient.
        </p>
      </section>

      <section>
        <h2>Operational Monitoring</h2>
        <p>
          Enable slow query logs and track top queries by total time. Optimize
          the 1% of queries that consume the majority of resources. Remove unused
          indexes to reduce write overhead.
        </p>
      </section>

      <section>
        <h2>Operational Checklist</h2>
        <ul className="space-y-2">
          <li>Use EXPLAIN ANALYZE for all slow queries.</li>
          <li>Index join keys and filter columns.</li>
          <li>Keep statistics fresh with ANALYZE.</li>
          <li>Avoid OFFSET pagination for large datasets.</li>
          <li>Fix N+1 queries with joins or batching.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
