"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-database-indexes-extensive",
  title: "Database Indexes",
  description:
    "Comprehensive guide to database indexes, internal structures, and performance trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "database-indexes",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "indexes", "performance"],
  relatedTopics: [
    "sql-queries-optimization",
    "index-types",
    "query-optimization-techniques",
  ],
};

export default function DatabaseIndexesExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Indexes</strong> are data structures that speed up query
          execution by providing efficient access paths. They reduce full table
          scans but add storage and write overhead.
        </p>
        <p>
          In most production systems, the slowest queries are solved with better
          indexing. The challenge is choosing the right indexes without
          over‑indexing and hurting write throughput.
        </p>
      </section>

      <section>
        <h2>Index Structures</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/index-btree.svg"
          alt="B-tree index"
          caption="B-tree indexes provide fast range and equality lookups"
        />
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/query-plan.svg"
          alt="Query plan"
          caption="Query planners choose index scans over full scans when possible"
        />
        <p>
          B-tree is the default index for most relational databases. It supports
          equality, range queries, and ordering. Hash indexes are faster for pure
          equality but less flexible.
        </p>
      </section>

      <section>
        <h2>Index Usage in Query Plans</h2>
        <p>
          The optimizer chooses indexes based on selectivity and statistics. A
          low-cardinality column may not benefit from an index because scanning
          the index costs more than scanning the table.
        </p>
        <p>
          Use EXPLAIN ANALYZE to confirm index usage. If a query is still slow,
          revisit column order in composite indexes or adjust the query shape.
        </p>
      </section>

      <section>
        <h2>Composite and Covering Indexes</h2>
        <p>
          Composite indexes include multiple columns and are effective when
          queries filter by a prefix of those columns. Covering indexes include
          all columns needed by a query so the engine can avoid reading the base
          table entirely.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`-- Composite + covering
CREATE INDEX idx_orders_user_created
ON orders(user_id, created_at DESC)
INCLUDE (status, total);`}</code>
        </pre>
      </section>

      <section>
        <h2>Write Overhead and Maintenance</h2>
        <p>
          Every write must update indexes. On high‑write tables, too many
          indexes can reduce throughput and increase lock contention. Indexes
          also need maintenance (vacuum, reindex) in some systems.
        </p>
        <p>
          A practical guideline: only index columns that are frequently queried
          or used for joins, and remove unused indexes after analysis.
        </p>
      </section>

      <section>
        <h2>Index Selectivity and Cardinality</h2>
        <p>
          High-cardinality columns (e.g., user_id, email) are good candidates for
          indexing. Low-cardinality columns (e.g., status flags) often do not
          benefit from indexes unless combined in composite indexes.
        </p>
      </section>

      <section>
        <h2>Index Types by Workload</h2>
        <p>
          Different workloads benefit from different index types. For OLTP
          systems, B-tree and composite indexes are common. For analytics,
          bitmap indexes can be effective on low-cardinality columns.
        </p>
      </section>

      <section>
        <h2>Indexing for Joins</h2>
        <p>
          Foreign keys should usually be indexed. Join queries often rely on
          indexed keys for efficient execution. Without indexes, joins can
          degrade into nested loops with full table scans.
        </p>
      </section>

      <section>
        <h2>Operational Monitoring</h2>
        <p>
          Monitor index usage and query performance. Most databases expose
          statistics that show index hit ratios and unused indexes. Removing
          unused indexes can improve write throughput.
        </p>
      </section>

      <section>
        <h2>Operational Checklist</h2>
        <ul className="space-y-2">
          <li>Index join keys and common filters.</li>
          <li>Use composite indexes for multi-column queries.</li>
          <li>Verify usage with EXPLAIN ANALYZE.</li>
          <li>Remove unused indexes to reduce write cost.</li>
          <li>Monitor index bloat and maintenance needs.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
