"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-data-warehouses-concise",
  title: "Data Warehouses",
  description:
    "Concise guide to data warehouses, OLAP workloads, and interview-ready trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "data-warehouses",
  version: "concise",
  wordCount: 1800,
  readingTime: 9,
  lastUpdated: "2026-03-09",
  tags: ["backend", "data-warehouse", "analytics", "olap"],
  relatedTopics: [
    "data-lakes",
    "query-optimization-techniques",
    "sql-queries-optimization",
  ],
};

export default function DataWarehousesConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Data warehouses</strong> store curated, structured data for
          analytics and reporting. They use schema-on-write and are optimized
          for OLAP queries like aggregations, joins, and dashboards.
        </p>
        <p>
          Examples include Snowflake, BigQuery, and Redshift. Warehouses trade
          flexibility for high-performance SQL analytics.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>Schema-on-write:</strong> Data modeled before ingestion.</li>
          <li><strong>OLAP workloads:</strong> Aggregations and analytics.</li>
          <li><strong>Star/snowflake schemas:</strong> Fact + dimension tables.</li>
          <li><strong>Columnar storage:</strong> Fast analytics reads.</li>
          <li><strong>ETL/ELT:</strong> Pipelines for data ingestion.</li>
        </ul>
        <p className="mt-4">
          Warehouses emphasize performance and governance over flexibility.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`SELECT region, SUM(revenue) AS total
FROM sales_fact
JOIN region_dim USING (region_id)
GROUP BY region;`}</code>
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
                ✓ Fast SQL analytics<br />
                ✓ Strong governance and consistency<br />
                ✓ Optimized for aggregations<br />
                ✓ Columnar compression
              </td>
              <td className="p-3">
                ✗ Less flexible schema changes<br />
                ✗ Higher storage/compute costs<br />
                ✗ Longer ingestion pipelines
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Use data warehouses when:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• You need reliable SQL analytics</li>
          <li>• Data governance is strict</li>
          <li>• Queries are complex and aggregate-heavy</li>
        </ul>
        <p><strong>Use data lakes when:</strong></p>
        <ul className="space-y-1">
          <li>• You need flexible ingestion of raw data</li>
          <li>• Schema evolves frequently</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain OLAP vs OLTP clearly.</li>
          <li>Discuss star schema and fact/dimension tables.</li>
          <li>Highlight schema-on-write governance benefits.</li>
          <li>Compare warehouses with data lakes.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the difference between OLTP and OLAP?</p>
            <p className="mt-2 text-sm">
              A: OLTP handles transactional writes; OLAP handles analytical
              queries and aggregations.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why do warehouses use columnar storage?</p>
            <p className="mt-2 text-sm">
              A: Columnar storage speeds analytics by scanning only needed
              columns and compressing efficiently.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a star schema?</p>
            <p className="mt-2 text-sm">
              A: A central fact table linked to dimension tables for analytics.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why are warehouses less flexible?</p>
            <p className="mt-2 text-sm">
              A: Data must fit predefined schemas; schema changes require
              migrations and ETL updates.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
