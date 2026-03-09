"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-data-lakes-concise",
  title: "Data Lakes",
  description:
    "Concise guide to data lakes, storage formats, and interview-ready trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "data-lakes",
  version: "concise",
  wordCount: 1800,
  readingTime: 9,
  lastUpdated: "2026-03-09",
  tags: ["backend", "data-lake", "analytics", "storage"],
  relatedTopics: [
    "data-warehouses",
    "object-storage",
    "data-serialization",
  ],
};

export default function DataLakesConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Data lakes</strong> store large volumes of raw data in its
          original format, typically on object storage. They support schema-on-read
          and are optimized for flexibility and cost-effective storage.
        </p>
        <p>
          Data lakes are used for analytics, machine learning, and large-scale
          data processing, but require strong governance to avoid “data swamps.”
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>Schema-on-read:</strong> Apply schema when querying.</li>
          <li><strong>Raw ingestion:</strong> Store data in original format.</li>
          <li><strong>Object storage:</strong> S3-style storage backend.</li>
          <li><strong>Columnar formats:</strong> Parquet, ORC for analytics.</li>
          <li><strong>Governance:</strong> Catalogs, lineage, access control.</li>
        </ul>
        <p className="mt-4">
          Data lakes prioritize flexibility over strict structure.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Raw event stored in a lake
s3://data-lake/events/2026/03/09/events.json`}</code>
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
                ✓ Low-cost storage at scale<br />
                ✓ Flexible schema-on-read<br />
                ✓ Supports diverse data types<br />
                ✓ Great for ML and analytics
              </td>
              <td className="p-3">
                ✗ Requires strong governance<br />
                ✗ Query performance can be slower<br />
                ✗ Risk of data swamps<br />
                ✗ Complexity in data quality
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Use data lakes when:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• You need low-cost storage of raw data</li>
          <li>• Data formats and schema evolve often</li>
          <li>• Analytics and ML are primary use cases</li>
        </ul>
        <p><strong>Use data warehouses when:</strong></p>
        <ul className="space-y-1">
          <li>• You need structured, fast SQL analytics</li>
          <li>• Governance and data quality are strict</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain schema-on-read vs schema-on-write.</li>
          <li>Highlight governance to avoid data swamps.</li>
          <li>Discuss columnar formats for analytics.</li>
          <li>Compare data lakes and warehouses clearly.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a data lake?</p>
            <p className="mt-2 text-sm">
              A: A large repository of raw data stored in its original form,
              typically on object storage.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is schema-on-read?</p>
            <p className="mt-2 text-sm">
              A: The schema is applied when querying rather than when ingesting.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why do data lakes become swamps?</p>
            <p className="mt-2 text-sm">
              A: Without governance, metadata, and quality checks, data becomes
              disorganized and hard to use.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When do you prefer a warehouse?</p>
            <p className="mt-2 text-sm">
              A: When you need structured, curated datasets with high-performance
              SQL analytics.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
