"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-data-modeling-nosql-concise",
  title: "Data Modeling in NoSQL",
  description:
    "Concise guide to NoSQL data modeling, denormalization, and interview-ready patterns.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "data-modeling-in-nosql",
  version: "concise",
  wordCount: 1850,
  readingTime: 9,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "nosql", "modeling"],
  relatedTopics: [
    "document-databases",
    "key-value-stores",
    "column-family-stores",
  ],
};

export default function DataModelingNoSqlConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>NoSQL data modeling</strong> is query-driven. Instead of
          normalizing data into many tables, you design structures to match
          access patterns, often with denormalization and duplication.
        </p>
        <p>
          The goal is predictable performance at scale. The trade-off is more
          complex writes and potential consistency challenges.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>Query-first design:</strong> Model around access patterns.</li>
          <li><strong>Denormalization:</strong> Duplicate data to avoid joins.</li>
          <li><strong>Embedding vs referencing:</strong> Balance read speed vs flexibility.</li>
          <li><strong>Partition keys:</strong> Decide data placement and scale.</li>
          <li><strong>Hot keys:</strong> Avoid skew and hotspots.</li>
        </ul>
        <p className="mt-4">
          You trade relational integrity for fast reads and horizontal scale.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Document model optimized for reads
{
  "_id": "user_123",
  "name": "Asha",
  "recentOrders": [
    { "id": "ord_1", "total": 4200 },
    { "id": "ord_2", "total": 2600 }
  ]
}`}</code>
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
                ✓ Predictable read performance<br />
                ✓ Scales horizontally<br />
                ✓ Flexible schema evolution<br />
                ✓ Fits distributed systems
              </td>
              <td className="p-3">
                ✗ Data duplication<br />
                ✗ Complex write paths<br />
                ✗ Consistency issues across copies<br />
                ✗ Harder to enforce constraints
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Use NoSQL modeling when:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Access patterns are known and stable</li>
          <li>• Horizontal scale is required</li>
          <li>• Schema evolves frequently</li>
        </ul>
        <p><strong>Use relational modeling when:</strong></p>
        <ul className="space-y-1">
          <li>• You need strong integrity and joins</li>
          <li>• Data relationships are complex and dynamic</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain query-driven modeling and denormalization.</li>
          <li>Highlight partition keys and hot-spot risks.</li>
          <li>Discuss trade-offs between embedding and referencing.</li>
          <li>Connect to CAP/BASE consistency trade-offs.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why is NoSQL modeling query-driven?</p>
            <p className="mt-2 text-sm">
              A: Because joins are limited, you design data layouts to match
              specific access patterns.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is denormalization?</p>
            <p className="mt-2 text-sm">
              A: Duplicating data across records or tables to speed reads and
              avoid joins.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a hot partition?</p>
            <p className="mt-2 text-sm">
              A: A partition that receives disproportionate traffic due to a
              poorly chosen key, causing bottlenecks.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you decide embed vs reference?</p>
            <p className="mt-2 text-sm">
              A: Embed for read-heavy, small relationships; reference for large
              or frequently changing relationships.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
