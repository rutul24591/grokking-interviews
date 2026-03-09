"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-document-databases-extensive",
  title: "Document Databases",
  description:
    "Deep guide to document databases, modeling patterns, and performance trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "document-databases",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "nosql", "document"],
  relatedTopics: [
    "cap-theorem",
    "base-properties",
    "query-optimization-techniques",
  ],
};

export default function DocumentDatabasesExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Document databases</strong> store data as JSON-like documents,
          typically grouped in collections. Unlike relational databases, they
          do not require a fixed schema, making them ideal for rapidly evolving
          products and complex nested data.
        </p>
        <p>
          Each document is a self-contained record, which often eliminates the
          need for joins and enables fast, locality-friendly reads. However, the
          schema flexibility can also introduce data inconsistency if not
          carefully managed.
        </p>
        <p>
          Document databases commonly align with BASE properties, favoring
          availability and scalability over strict consistency.
        </p>
      </section>

      <section>
        <h2>Document Model</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/document-model.svg"
          alt="Document model"
          caption="Nested fields and arrays represent hierarchical data"
        />
        <p>
          Documents can contain nested objects and arrays, allowing complex
          structures to live in one place. This is useful for entities like
          user profiles, orders, and product catalogs.
        </p>
        <p>
          The model encourages denormalization: related data is embedded to
          avoid expensive joins, optimizing for read performance.
        </p>
      </section>

      <section>
        <h2>Embedding vs Referencing</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/embedding-vs-referencing.svg"
          alt="Embedding vs referencing"
          caption="Embed for fast reads, reference for flexibility"
        />
        <p>
          Document modeling is about deciding when to embed related data and
          when to reference it:
        </p>
        <ul className="space-y-2">
          <li><strong>Embed:</strong> Faster reads, single-document atomicity.</li>
          <li><strong>Reference:</strong> Less duplication, easier updates.</li>
        </ul>
        <p className="mt-4">
          Embedding is ideal for one-to-few relationships with frequent reads.
          Referencing is better for one-to-many relationships that grow large.
        </p>
      </section>

      <section>
        <h2>Indexes and Query Patterns</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/document-indexes.svg"
          alt="Document indexes"
          caption="Indexes on nested fields improve query performance"
        />
        <p>
          Document databases support indexes on fields, including nested paths.
          Indexing strategy should be driven by query patterns, just like in
          relational systems.
        </p>
        <p>
          Over-indexing increases write cost, while under-indexing causes full
          collection scans. Balance based on real workloads.
        </p>
      </section>

      <section>
        <h2>Atomicity and Transactions</h2>
        <p>
          Most document databases provide atomic operations at the document
          level. Multi-document transactions may be supported but often come
          with performance and complexity trade-offs.
        </p>
        <p>
          Designing data to keep transactions within a single document is a
          common best practice for performance and simplicity.
        </p>
      </section>

      <section>
        <h2>Example: Embedded Order History</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`{
  "_id": "user_123",
  "name": "Asha",
  "orders": [
    { "id": "ord_1", "total": 4200, "createdAt": "2026-03-01" },
    { "id": "ord_2", "total": 2600, "createdAt": "2026-03-04" }
  ]
}`}</code>
        </pre>
        <p>
          This structure makes it easy to fetch a user with recent orders in
          one query, but it duplicates data if orders are queried separately.
        </p>
      </section>

      <section>
        <h2>Scaling and Sharding</h2>
        <p>
          Document databases scale horizontally through sharding, distributing
          documents by a shard key. A good shard key distributes load evenly and
          aligns with query patterns.
        </p>
        <p>
          Poor shard keys create hotspots, causing uneven performance and
          operational complexity.
        </p>
      </section>

      <section>
        <h2>Operational Trade-offs</h2>
        <p>
          Document databases are powerful but require discipline:
        </p>
        <ul className="space-y-2">
          <li>Schema flexibility can lead to inconsistent data shapes.</li>
          <li>Denormalization requires careful update logic.</li>
          <li>Monitoring index usage is critical for performance.</li>
        </ul>
      </section>

      <section>
        <h2>Design Checklist</h2>
        <ul className="space-y-2">
          <li>Model around query patterns, not just entities.</li>
          <li>Choose embedding vs referencing deliberately.</li>
          <li>Index only fields used in queries.</li>
          <li>Pick shard keys that distribute load evenly.</li>
          <li>Document schema expectations for consistency.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
