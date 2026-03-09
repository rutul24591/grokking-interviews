"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-index-types-extensive",
  title: "Index Types",
  description:
    "Comprehensive guide to primary, unique, composite, partial, and other index types.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "index-types",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "indexes", "performance"],
  relatedTopics: [
    "database-indexes",
    "sql-queries-optimization",
    "query-optimization-techniques",
  ],
};

export default function IndexTypesExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          Index types define how data is organized for fast lookups. Different
          types serve different query patterns and can drastically affect
          performance, storage, and write overhead.
        </p>
        <p>
          Choosing the right index type is as important as choosing which
          columns to index. A mismatched index can be ignored by the optimizer
          and waste resources.
        </p>
      </section>

      <section>
        <h2>Index Type Overview</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/index-types.svg"
          alt="Index types"
          caption="Common index types used in relational databases"
        />
      </section>

      <section>
        <h2>Primary and Unique Indexes</h2>
        <p>
          Primary key indexes uniquely identify rows and are created automatically.
          Unique indexes enforce uniqueness on a column or set of columns. Both
          ensure data integrity while enabling fast lookups.
        </p>
        <p>
          Use unique indexes for business identifiers like email or username.
          If a column must never duplicate, enforce it at the database layer.
        </p>
      </section>

      <section>
        <h2>Composite Indexes</h2>
        <p>
          Composite indexes cover multiple columns. They are effective when
          queries filter on the leftmost prefix of the index definition. For
          example, an index on (user_id, created_at) supports queries filtering
          by user_id and sorting by created_at.
        </p>
        <p>
          Column order matters. Always design composite indexes around the most
          selective filters and the most common query shapes.
        </p>
      </section>

      <section>
        <h2>Covering Indexes</h2>
        <p>
          A covering index contains all columns needed by a query. This allows
          the database to satisfy the query directly from the index without
          reading the base table, which can drastically reduce IO.
        </p>
        <p>
          Covering indexes are powerful for hot queries but add storage and
          write overhead. Use them for frequently executed queries with small
          result sets.
        </p>
      </section>

      <section>
        <h2>Partial Indexes</h2>
        <p>
          Partial indexes only include rows that match a predicate. They are
          useful for sparse datasets, such as indexing only active users or
          unarchived records.
        </p>
        <p>
          This reduces index size and write overhead while keeping performance
          for the most common queries.
        </p>
      </section>

      <section>
        <h2>Expression (Functional) Indexes</h2>
        <p>
          Expression indexes store computed values, such as lower(email) for
          case-insensitive search. They are useful when queries apply functions
          in WHERE clauses that would otherwise prevent index usage.
        </p>
        <p>
          The trade-off is complexity: expression indexes must exactly match the
          query expression for the optimizer to use them.
        </p>
      </section>

      <section>
        <h2>Bitmap Indexes</h2>
        <p>
          Bitmap indexes are efficient for low-cardinality columns and analytics
          workloads. They are common in data warehouses, not OLTP systems, due to
          high update costs.
        </p>
      </section>

      <section>
        <h2>Choosing the Right Type</h2>
        <p>
          The right index type depends on query patterns. For OLTP workloads,
          B-tree and composite indexes dominate. For reporting, bitmap indexes
          and covering indexes can be more valuable.
        </p>
        <p>
          Always validate with EXPLAIN plans and real query performance metrics.
        </p>
      </section>

      <section>
        <h2>Operational Checklist</h2>
        <ul className="space-y-2">
          <li>Use unique indexes for business identifiers.</li>
          <li>Design composite indexes around leftmost prefix usage.</li>
          <li>Use partial indexes for sparse conditions.</li>
          <li>Adopt expression indexes for computed filters.</li>
          <li>Benchmark index impact with EXPLAIN ANALYZE.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
