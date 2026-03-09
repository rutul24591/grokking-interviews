"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-document-databases-concise",
  title: "Document Databases",
  description:
    "Concise guide to document databases, document modeling, and interview-ready trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "document-databases",
  version: "concise",
  wordCount: 1850,
  readingTime: 9,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "nosql", "document"],
  relatedTopics: [
    "cap-theorem",
    "base-properties",
    "query-optimization-techniques",
  ],
};

export default function DocumentDatabasesConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Document databases</strong> store data as flexible JSON-like
          documents instead of rows and tables. Each document can have nested
          fields and varying structure, making document databases ideal for
          rapidly evolving schemas and hierarchical data.
        </p>
        <p>
          Common examples include MongoDB and CouchDB. They often trade strong
          relational guarantees for schema flexibility and horizontal scale.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>Document model:</strong> Nested JSON-like structures.</li>
          <li><strong>Schema flexibility:</strong> Fields can vary by document.</li>
          <li><strong>Embedding vs referencing:</strong> Denormalize or link.</li>
          <li><strong>Indexes:</strong> Secondary indexes for query performance.</li>
          <li><strong>Atomicity:</strong> Usually per-document, not multi-document.</li>
          <li><strong>Sharding:</strong> Distribute documents by key for scale.</li>
        </ul>
        <p className="mt-4">
          The most important design decision is how to model relationships:
          embed related data for fast reads or reference for flexibility.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Example document
{
  "_id": "user_123",
  "name": "Asha",
  "orders": [
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
                ✓ Flexible schema for evolving products<br />
                ✓ Natural fit for nested data<br />
                ✓ Fewer joins, faster reads<br />
                ✓ Scales horizontally well
              </td>
              <td className="p-3">
                ✗ Weak relational guarantees<br />
                ✗ Complex joins are limited<br />
                ✗ Data duplication via embedding<br />
                ✗ Transactions may be limited
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Use document databases when:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Data is hierarchical or nested</li>
          <li>• Schema changes frequently</li>
          <li>• You need horizontal scale with flexible models</li>
        </ul>
        <p><strong>Use SQL when:</strong></p>
        <ul className="space-y-1">
          <li>• You need complex joins and strict constraints</li>
          <li>• Transactions across multiple entities are critical</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain embedding vs referencing trade-offs.</li>
          <li>Highlight per-document atomicity and transaction limits.</li>
          <li>Mention indexing strategies for document fields.</li>
          <li>Connect document stores to CAP/BASE trade-offs.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When should you embed vs reference?</p>
            <p className="mt-2 text-sm">
              A: Embed for read-heavy, tightly coupled data. Reference for
              large or frequently changing relationships.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Do document databases support joins?</p>
            <p className="mt-2 text-sm">
              A: Limited support via aggregation pipelines, but joins are not
              as powerful or efficient as SQL joins.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is per-document atomicity?</p>
            <p className="mt-2 text-sm">
              A: Updates within a single document are atomic, but cross-document
              transactions may be limited or more expensive.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why are document databases good for agile teams?</p>
            <p className="mt-2 text-sm">
              A: They allow schema evolution without migrations, which speeds
              iteration.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
