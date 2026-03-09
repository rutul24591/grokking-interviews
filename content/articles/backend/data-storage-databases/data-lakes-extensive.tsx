"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-data-lakes-extensive",
  title: "Data Lakes",
  description:
    "Deep guide to data lakes, governance, storage formats, and analytics trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "data-lakes",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "data-lake", "analytics", "storage"],
  relatedTopics: [
    "data-warehouses",
    "object-storage",
    "data-serialization",
  ],
};

export default function DataLakesExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Data lakes</strong> are large repositories of raw data stored
          in its original form. They rely on schema-on-read: data is structured
          at query time rather than ingestion time.
        </p>
        <p>
          Data lakes are built on object storage and are cost-effective for
          massive datasets. They are widely used for analytics, machine
          learning, and historical data analysis.
        </p>
        <p>
          The core challenge is governance: without metadata and quality
          controls, a lake can become a “data swamp.”
        </p>
      </section>

      <section>
        <h2>Architecture Overview</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/data-lake-architecture.svg"
          alt="Data lake architecture"
          caption="Raw data lands in object storage and is queried by analytics engines"
        />
        <p>
          Data lakes typically include ingestion pipelines, storage, metadata
          catalogs, and compute engines (Spark, Presto, Athena).
        </p>
      </section>

      <section>
        <h2>Schema-on-Read</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/schema-on-read.svg"
          alt="Schema on read"
          caption="Schemas are applied at query time, not ingestion"
        />
        <p>
          Schema-on-read allows flexibility: you can ingest any data and define
          schemas later. This makes data lakes ideal for evolving datasets.
        </p>
        <p>
          The downside is slower query planning and higher reliance on metadata.
        </p>
      </section>

      <section>
        <h2>Storage Formats</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/columnar-formats.svg"
          alt="Columnar formats"
          caption="Parquet and ORC improve analytics performance"
        />
        <p>
          Columnar formats like Parquet and ORC compress data efficiently and
          speed up analytical queries by reading only needed columns.
        </p>
        <p>
          Choosing the right format can make a major difference in query
          performance and storage costs.
        </p>
      </section>

      <section>
        <h2>Governance and Catalogs</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/data-catalog.svg"
          alt="Data catalog"
          caption="Catalogs track schema, lineage, and access rules"
        />
        <p>
          Governance tools provide schema tracking, lineage, and access control.
          Without them, data becomes difficult to find, trust, and manage.
        </p>
        <p>
          A strong catalog is essential for discoverability and compliance.
        </p>
      </section>

      <section>
        <h2>Example: Data Lake Layout</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`s3://data-lake/
  raw/events/2026/03/09/events.json
  processed/events/2026/03/09/events.parquet`}</code>
        </pre>
        <p>
          Raw and processed zones separate ingestion from curated data for
          analytics.
        </p>
      </section>

      <section>
        <h2>Operational Trade-offs</h2>
        <p>
          Data lakes are powerful but require:
        </p>
        <ul className="space-y-2">
          <li>Data quality checks and validation.</li>
          <li>Metadata management to avoid swamps.</li>
          <li>Cost monitoring for storage and compute.</li>
        </ul>
      </section>

      <section>
        <h2>Design Checklist</h2>
        <ul className="space-y-2">
          <li>Separate raw, processed, and curated zones.</li>
          <li>Use columnar formats for analytics.</li>
          <li>Maintain a data catalog with lineage.</li>
          <li>Apply retention and lifecycle policies.</li>
          <li>Monitor costs of storage and compute.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
