"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-query-patterns-extensive",
  title: "Query Patterns",
  description:
    "Deep guide to query patterns, modeling for access paths, and performance trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "query-patterns",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "modeling", "performance"],
  relatedTopics: [
    "data-modeling-in-nosql",
    "query-optimization-techniques",
    "database-indexes",
  ],
};

export default function QueryPatternsExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Query patterns</strong> describe how your system reads data:
          point lookups, range scans, aggregations, and fan-out queries. These
          patterns determine the optimal schema, indexes, and partitioning
          strategies.
        </p>
        <p>
          Designing schemas without considering query patterns leads to slow
          queries and unpredictable performance. In NoSQL systems, queries
          often define the schema itself.
        </p>
      </section>

      <section>
        <h2>Access Patterns</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/query-patterns-overview.svg"
          alt="Query patterns overview"
          caption="Different patterns require different access paths"
        />
        <ul className="space-y-2">
          <li><strong>Point lookups:</strong> Fetch by primary key.</li>
          <li><strong>Range scans:</strong> Time or ID ranges.</li>
          <li><strong>Top-N queries:</strong> Sort + limit on indexed fields.</li>
          <li><strong>Aggregations:</strong> Count, sum, percentiles.</li>
          <li><strong>Fan-out:</strong> Queries spanning multiple shards.</li>
        </ul>
      </section>

      <section>
        <h2>Schema Design by Query</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/query-driven-schema.svg"
          alt="Query-driven schema"
          caption="Schemas are optimized for dominant queries"
        />
        <p>
          The schema should be designed to make the most common queries fast.
          This may mean denormalization, composite indexes, or precomputed
          aggregates.
        </p>
        <p>
          Less frequent queries can be slower or handled asynchronously.
        </p>
      </section>

      <section>
        <h2>Indexes and Materialized Views</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/query-accelerators.svg"
          alt="Query accelerators"
          caption="Indexes and views accelerate heavy queries"
        />
        <p>
          Indexes accelerate point and range lookups. Materialized views or
          summary tables accelerate heavy aggregations and reporting.
        </p>
        <p>
          Each optimization adds write overhead, so prioritize based on
          real query frequency.
        </p>
      </section>

      <section>
        <h2>Example: Recent Activity Feed</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`SELECT * FROM activities
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT 50;`}</code>
        </pre>
        <p>
          This pattern benefits from an index on (user_id, created_at DESC).
          Without the index, the query will scan or sort large ranges.
        </p>
      </section>

      <section>
        <h2>Fan-out Query Risks</h2>
        <p>
          Fan-out queries run across multiple shards and aggregate results.
          They increase latency and resource usage and can become bottlenecks.
        </p>
        <p>
          Mitigation strategies include precomputing aggregates, caching, and
          redesigning query patterns to target single shards.
        </p>
      </section>

      <section>
        <h2>Operational Trade-offs</h2>
        <p>
          Query-driven modeling introduces trade-offs:
        </p>
        <ul className="space-y-2">
          <li>Denormalization increases write complexity.</li>
          <li>Indexes increase write cost.</li>
          <li>Schema changes are needed when query patterns evolve.</li>
        </ul>
      </section>

      <section>
        <h2>Design Checklist</h2>
        <ul className="space-y-2">
          <li>List top queries and design schema around them.</li>
          <li>Add indexes only for frequently used filters and sorts.</li>
          <li>Use materialized views for heavy aggregations.</li>
          <li>Monitor query latency and adjust designs.</li>
          <li>Plan for query evolution as product changes.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
