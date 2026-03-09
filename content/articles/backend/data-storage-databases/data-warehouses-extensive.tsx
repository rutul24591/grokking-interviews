"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-data-warehouses-extensive",
  title: "Data Warehouses",
  description:
    "Deep guide to data warehouses, OLAP modeling, and analytics performance trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "data-warehouses",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "data-warehouse", "analytics", "olap"],
  relatedTopics: [
    "data-lakes",
    "query-optimization-techniques",
    "sql-queries-optimization",
  ],
};

export default function DataWarehousesExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Data warehouses</strong> store curated, structured data for
          analytics and reporting. They use schema-on-write and are optimized
          for OLAP workloads with complex aggregations and joins.
        </p>
        <p>
          Warehouses are designed for business intelligence, dashboards, and
          long-running analytical queries, not high-frequency transactional
          writes.
        </p>
        <p>
          Typical platforms include Snowflake, BigQuery, Redshift, and
          ClickHouse.
        </p>
      </section>

      <section>
        <h2>OLAP Modeling</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/star-schema.svg"
          alt="Star schema"
          caption="Fact tables link to dimension tables for analytics"
        />
        <p>
          Warehouses often use star or snowflake schemas. Fact tables capture
          events (sales, clicks), while dimension tables store descriptive
          attributes (customers, products, regions).
        </p>
      </section>

      <section>
        <h2>Columnar Storage</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/warehouse-columnar.svg"
          alt="Columnar storage"
          caption="Columnar layout speeds aggregations and compression"
        />
        <p>
          Columnar storage reads only the columns required for a query and
          compresses similar values efficiently. This makes aggregations fast
          and storage cost-effective.
        </p>
      </section>

      <section>
        <h2>ETL and ELT Pipelines</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/etl-pipeline.svg"
          alt="ETL pipeline"
          caption="ETL/ELT pipelines load and transform warehouse data"
        />
        <p>
          Warehouses rely on ETL (extract-transform-load) or ELT pipelines to
          ingest data from operational systems. These pipelines ensure data
          quality, consistency, and schema alignment.
        </p>
      </section>

      <section>
        <h2>Example: Aggregation Query</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`SELECT region, SUM(revenue) AS total_revenue
FROM sales_fact
JOIN region_dim USING (region_id)
GROUP BY region;`}</code>
        </pre>
      </section>

      <section>
        <h2>Operational Trade-offs</h2>
        <p>
          Warehouses provide fast analytics but require:
        </p>
        <ul className="space-y-2">
          <li>Careful schema design and governance.</li>
          <li>Ongoing ETL maintenance.</li>
          <li>Compute cost management for large queries.</li>
        </ul>
      </section>

      <section>
        <h2>Design Checklist</h2>
        <ul className="space-y-2">
          <li>Model data with fact and dimension tables.</li>
          <li>Use columnar formats for analytics.</li>
          <li>Automate ETL/ELT pipelines with monitoring.</li>
          <li>Optimize for common dashboard queries.</li>
          <li>Control access with strict governance.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
