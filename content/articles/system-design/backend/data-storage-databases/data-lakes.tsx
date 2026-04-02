"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-data-lakes-complete",
  title: "Data Lakes",
  description:
    "Comprehensive guide to data lakes: architecture, medallion architecture (bronze/silver/gold), governance, and when to use data lakes vs data warehouses for analytics and ML.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "data-lakes",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-01",
  tags: ["backend", "data-storage", "data-lakes", "analytics", "big-data"],
  relatedTopics: [
    "data-warehouses",
    "object-storage",
    "search-engines",
    "query-optimization-techniques",
  ],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/data-storage-databases";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>Data Lakes</h1>
        <p className="lead">
          Data lakes are centralized repositories that store all structured and unstructured data
          at any scale. Unlike data warehouses (schema-on-write, curated data), data lakes use
          schema-on-read—data is stored as-is (raw) and schema is applied when reading. This
          flexibility enables storing diverse data types (databases, logs, IoT, files) without
          upfront transformation. Data lakes power analytics, machine learning, and data
          exploration at massive scale with cost-effective object storage.
        </p>

        <p>
          Consider a company with data scattered across systems: transactional databases (MySQL),
          application logs, IoT sensor data, and CSV files from partners. A data warehouse requires
          schema design and ETL before loading—slow and inflexible. A data lake ingests all data
          as-is into object storage (S3, ADLS). Data scientists explore raw data, engineers build
          pipelines to clean and transform, analysts query curated datasets. One platform serves
          all data needs.
        </p>

        <p>
          Data lake services (Amazon S3 + Athena, Azure Data Lake Storage, Google Cloud Storage +
          BigQuery) power modern analytics: machine learning (training data storage), business
          intelligence (curated datasets), data exploration (raw data access), and historical
          analysis (long-term retention). These workloads share characteristics: diverse data
          types, massive scale, schema flexibility, and cost-effective storage.
        </p>

        <p>
          This article provides a comprehensive examination of data lakes: the architecture
          (ingestion, storage layers, processing), medallion architecture (bronze/silver/gold
          layers), governance frameworks (prevent data swamps), and real-world use cases. We'll
          explore when data lakes excel (analytics, ML, data integration) and when they struggle
          (without governance, they become "data swamps"). We'll also compare data lakes with
          data warehouses and introduce the lakehouse pattern (combining lake flexibility with
          warehouse reliability).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/data-lakes-architecture.svg`}
          caption="Figure 1: Data Lake Architecture showing data ingestion from multiple sources (Databases, Logs, IoT/Events, Files) via batch (scheduled ETL) or streaming (real-time) into data lake storage. Storage layers follow medallion architecture: Bronze (raw, immutable, full history) → Silver (validated, cleaned, enriched) → Gold (aggregated, business-level, ready for analytics). Data processing and consumption: Spark/ETL (transform), SQL Engines (Athena, Presto), ML/AI (training, inference), BI Tools (Tableau, Power BI). Key characteristics: schema-on-read, store all data, scalable storage, diverse data types, analytics-ready."
          alt="Data lake architecture"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: Schema-on-Read &amp; Medallion Architecture</h2>

        <h3>Schema-on-Read vs Schema-on-Write</h3>
        <p>
          <strong>Schema-on-write</strong> (data warehouses) requires defining schema before
          loading data. Data is validated, transformed, and cleaned during ETL. Benefits: high
          data quality, consistent schema, optimized for queries. Trade-offs: slow ingestion,
          inflexible (schema changes require ETL updates), data loss (non-conforming data
          rejected).
        </p>

        <p>
          <strong>Schema-on-read</strong> (data lakes) stores data as-is, applies schema when
          reading. Benefits: fast ingestion (no transformation), flexible (store any data),
          no data loss (raw data preserved). Trade-offs: data quality varies, consumers must
          understand data, query performance depends on data organization.
        </p>

        <p>
          Schema-on-read enables storing data before knowing how it will be used. Data
          scientists can explore raw data, discover patterns, and define schema based on
          findings. This is essential for ML and exploratory analytics.
        </p>

        <h3>Medallion Architecture (Bronze/Silver/Gold)</h3>
        <p>
          Medallion architecture organizes data lakes into quality layers, progressively
          refining data from raw to curated. This prevents "data swamps" by providing
          structure without sacrificing flexibility.
        </p>

        <p>
          <strong>Bronze (Raw)</strong> layer stores raw, immutable data exactly as ingested.
          Full history is preserved (no deletions). Schema is inferred or minimal. Use cases:
          audit trails, reprocessing, debugging. Data quality: unknown (raw source data).
        </p>

        <p>
          <strong>Silver (Cleaned)</strong> layer stores validated, cleaned, enriched data.
          Duplicates removed, data types enforced, basic transformations applied. Silver
          represents "single source of truth" for entities (customers, products). Data
          quality: validated and consistent.
        </p>

        <p>
          <strong>Gold (Curated)</strong> layer stores aggregated, business-level data ready
          for analytics. Data is modeled for specific use cases (star schemas, feature tables).
          Gold datasets are optimized for BI tools and ML training. Data quality: high
          (business-ready).
        </p>

        <h3>Data Processing</h3>
        <p>
          Data lakes use various processing engines: <strong>Spark</strong> for large-scale
          ETL (batch and streaming), <strong>SQL engines</strong> (Athena, Presto) for
          interactive queries, <strong>ML frameworks</strong> (TensorFlow, PyTorch) for
          model training, and <strong>BI tools</strong> (Tableau, Power BI) for visualization.
          The same data serves multiple purposes—raw data for exploration, curated data for
          BI, feature tables for ML.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/data-lakes-comparison.svg`}
          caption="Figure 2: Data Lake vs Data Warehouse vs Data Swamp comparison. Schema: Lake (schema-on-read, flexible), Warehouse (schema-on-write, rigid), Swamp (no schema). Data Quality: Lake (raw to curated, medallion architecture), Warehouse (high quality, cleaned/validated), Swamp (poor/unknown). Primary Users: Lake (data scientists, data engineers), Warehouse (business analysts, executives), Swamp (no one - avoid!). Cost: Lake (low, object storage), Warehouse (high, optimized), Swamp (wasted, unused). Modern Pattern: Lakehouse combines lake flexibility with warehouse reliability—ACID transactions, schema enforcement, BI + ML + ETL on single platform. Examples: Delta Lake, Apache Iceberg, Apache Hudi enable lakehouse architecture. Key takeaway: Data lakes need governance to avoid becoming swamps."
          alt="Data lake vs data warehouse comparison"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation: Governance &amp; Best Practices</h2>

        <h3>Data Governance Framework</h3>
        <p>
          Without governance, data lakes become "data swamps"—unusable data graveyards.
          Governance frameworks ensure data is discoverable, secure, and trustworthy.
        </p>

        <p>
          <strong>Data catalog</strong> provides metadata management: what data exists, where
          it is, who owns it, how to access it. Catalogs enable data discovery (search datasets),
          lineage (trace data flow), and documentation (business context). Examples: AWS
          Glue Data Catalog, Azure Purview, Amundsen, DataHub.
        </p>

        <p>
          <strong>Access control</strong> ensures only authorized users access data. Use
          role-based access control (RBAC): data engineers (full access), data scientists
          (read bronze/silver), analysts (read gold only). Encrypt data at rest and in
          transit. Audit access for compliance.
        </p>

        <p>
          <strong>Data quality</strong> monitoring validates data as it flows through layers.
          Define quality rules (completeness, accuracy, consistency), monitor rule violations,
          alert on quality degradation. Quality scores help consumers trust data.
        </p>

        <p>
          <strong>Lifecycle management</strong> defines retention policies: how long to keep
          data in each layer, when to archive or delete. Bronze may be kept indefinitely
          (raw history), silver/gold may have shorter retention. Automate lifecycle to
          control costs.
        </p>

        <h3>Lakehouse Pattern</h3>
        <p>
          <strong>Lakehouse</strong> combines data lake flexibility with data warehouse
          reliability. Built on open table formats (Delta Lake, Apache Iceberg, Apache Hudi),
          lakehouses provide: <strong>ACID transactions</strong> (concurrent reads/writes
          without corruption), <strong>Schema enforcement</strong> (prevent bad data),
          <strong>Time travel</strong> (query historical versions), <strong>Unified
          platform</strong> (BI + ML + ETL on same data).
        </p>

        <p>
          Lakehouse eliminates the need for separate lake and warehouse. Raw data is stored
          in object storage (lake), with ACID metadata layer (warehouse capabilities). This
          reduces complexity (one platform), cost (object storage), and data movement (no
          ETL between lake and warehouse).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/data-lakes-use-cases.svg`}
          caption="Figure 3: Data Lake Use Cases & Governance. Primary use cases: Analytics & BI (historical analysis, trend analysis, ad-hoc queries, self-service analytics, dashboard data sources), Machine Learning (training data storage, feature engineering, model experimentation, large-scale datasets, raw data exploration), Data Integration (centralized repository, multi-source ingestion, data consolidation, single source of truth, data sharing). Data Governance Framework (prevent data swamp): Data Catalog (metadata management), Access Control (RBAC, encryption), Data Quality (validation, monitoring), Lifecycle (retention, archival). Anti-patterns (data swamp): no governance, no metadata, no access control, no data quality, dump everything without structure. Best for: analytics, ML, data integration, historical analysis, centralized data repository with proper governance."
          alt="Data lake use cases and governance"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison: Data Lake vs Data Warehouse</h2>

        <p>
          Data lakes and data warehouses serve different purposes. Understanding the trade-offs
          helps you choose the right architecture—or combine both in a lakehouse pattern.
        </p>

        <h3>Data Lake Strengths</h3>
        <p>
          <strong>Flexibility</strong> is the primary advantage. Store any data type (structured,
          semi-structured, unstructured) without upfront schema. This enables storing data
          before knowing how it will be used—essential for ML and exploration.
        </p>

        <p>
          <strong>Cost</strong> is far lower than data warehouses. Object storage costs
          ~$0.023/GB/month; warehouse storage costs ~$1/GB/month. For petabyte-scale data,
          lakes are orders of magnitude cheaper.
        </p>

        <p>
          <strong>Scale</strong> is essentially unlimited. Object storage scales to exabytes
          without performance degradation. Warehouses scale too, but at much higher cost.
        </p>

        <p>
          <strong>Raw data preservation</strong> enables reprocessing. If business logic
          changes, reprocess raw bronze data. Warehouses typically store only transformed
          data—original is lost.
        </p>

        <h3>Data Lake Limitations</h3>
        <p>
          <strong>Data quality</strong> varies without governance. Raw data may be incomplete,
          inconsistent, or incorrect. Consumers must understand data quality before using.
          Warehouses enforce quality during ETL.
        </p>

        <p>
          <strong>Query performance</strong> is lower than warehouses. Warehouses optimize
          data (columnar storage, indexes, materialized views) for fast queries. Lakes
          require optimization (partitioning, file formats like Parquet) to match warehouse
          performance.
        </p>

        <p>
          <strong>BI tool support</strong> is limited without curation. BI tools expect
          structured, consistent schemas. Raw lake data requires transformation before BI
          consumption. Gold layer or lakehouse addresses this.
        </p>

        <p>
          <strong>Governance complexity</strong> is higher. Lakes require catalogs, access
          control, quality monitoring, and lifecycle management. Without these, lakes become
          swamps. Warehouses have built-in governance (schema, permissions).
        </p>

        <h3>When to Use Data Lakes</h3>
        <p>
          Use data lakes for: <strong>Analytics</strong> (historical analysis, ad-hoc queries),
          <strong>Machine learning</strong> (training data, feature engineering),
          <strong>Data integration</strong> (centralized repository, multi-source ingestion),
          <strong>Data exploration</strong> (raw data access, discovery), <strong>Long-term
          retention</strong> (archival, compliance).
        </p>

        <p>
          Use data warehouses for: <strong>BI and reporting</strong> (curated datasets,
          consistent schemas), <strong>Operational analytics</strong> (low-latency queries),
          <strong>Business users</strong> (self-service without SQL expertise).
        </p>

        <p>
          Use lakehouse for: <strong>Unified platform</strong> (BI + ML + ETL on same data),
          <strong>Cost optimization</strong> (object storage with warehouse capabilities),
          <strong>Simplified architecture</strong> (no lake-to-warehouse ETL).
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for Data Lakes</h2>

        <p>
          <strong>Implement medallion architecture.</strong> Organize data into bronze/silver/gold
          layers. This provides structure without sacrificing flexibility. Document what each
          layer contains and quality expectations.
        </p>

        <p>
          <strong>Use open table formats.</strong> Delta Lake, Iceberg, or Hudi provide ACID
          transactions, schema evolution, and time travel. These features are essential for
          production data lakes.
        </p>

        <p>
          <strong>Optimize file formats.</strong> Use columnar formats (Parquet, ORC) for
          analytics. They provide compression (lower storage costs) and predicate pushdown
          (faster queries). Avoid row-based formats (JSON, CSV) for large datasets.
        </p>

        <p>
          <strong>Partition data wisely.</strong> Partition by commonly filtered columns
          (date, region). This reduces scan size and improves query performance. Avoid
          over-partitioning (too many small files).
        </p>

        <p>
          <strong>Implement data catalog.</strong> Enable data discovery and documentation.
          Catalogs answer: what data exists, where is it, who owns it, how to access it.
          Without a catalog, data is undiscoverable.
        </p>

        <p>
          <strong>Monitor data quality.</strong> Define quality rules, monitor violations,
          alert on degradation. Quality scores build consumer trust. Poor quality data
          leads to incorrect decisions.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>Data swamp.</strong> Dumping data without governance creates unusable
          swamps. Solution: Implement medallion architecture, data catalog, access control,
          and quality monitoring from day one.
        </p>

        <p>
          <strong>No ownership.</strong> Data without owners becomes stale and unreliable.
          Solution: Assign data owners per dataset. Owners are responsible for quality,
          documentation, and access.
        </p>

        <p>
          <strong>Poor file organization.</strong> Many small files cause performance issues
          (listing overhead, query inefficiency). Solution: Compact small files, use
          appropriate file sizes (128MB-1GB for Parquet), partition wisely.
        </p>

        <p>
          <strong>Ignoring security.</strong> Sensitive data exposed without access control.
          Solution: Implement RBAC, encrypt data at rest and in transit, audit access,
          mask sensitive data.
        </p>

        <p>
          <strong>No lifecycle management.</strong> Data accumulates indefinitely, increasing
          costs. Solution: Define retention policies per layer, automate archival and
          deletion, monitor storage growth.
        </p>

        <p>
          <strong>Building without use cases.</strong> Building a lake without clear use
          cases leads to unused data. Solution: Start with specific use cases (ML, BI),
          ingest data needed for those use cases, expand iteratively.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Machine Learning Platform</h3>
        <p>
          ML platforms use data lakes for training data storage. Raw data (bronze) is ingested
          from multiple sources. Feature engineering transforms raw data into features (silver).
          Feature tables (gold) are used for model training. The same lake serves exploration
          (raw data), feature engineering (silver), and training (gold).
        </p>

        <p>
          This pattern works because ML needs diverse data (multiple sources), large scale
          (terabytes of training data), and flexibility (schema evolves as features are
          discovered).
        </p>

        <h3>Enterprise Analytics</h3>
        <p>
          Enterprises consolidate data from multiple systems (ERP, CRM, web analytics) into
          data lakes. Bronze stores raw extracts. Silver integrates and cleans data (unified
          customer view). Gold provides business-level datasets (sales by region, customer
          segments). BI tools query gold datasets for dashboards.
        </p>

        <p>
          This pattern works because enterprises need centralized data (multiple sources),
          historical analysis (long-term retention), and self-service analytics (gold
          datasets for business users).
        </p>

        <h3>IoT Data Platform</h3>
        <p>
          IoT platforms ingest sensor data into data lakes. Bronze stores raw telemetry
          (millions of events per second). Silver aggregates by device/time (reduce volume).
          Gold provides business metrics (equipment health, predictive maintenance). ML
          models predict failures from historical patterns.
        </p>

        <p>
          This pattern works because IoT generates massive volume (high ingestion rates),
          diverse data (multiple sensor types), and needs long-term retention (trend
          analysis, model training).
        </p>

        <h3>Data Sharing Platform</h3>
        <p>
          Organizations share data with partners via data lakes. Bronze stores incoming
          partner data. Silver validates and standardizes (consistent schema). Gold provides
          curated datasets for specific use cases. Access control ensures partners only
          see authorized data.
        </p>

        <p>
          This pattern works because data sharing needs flexible ingestion (partner data
          varies), governance (access control, quality), and scalability (multiple partners,
          large datasets).
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q1: When would you choose a data lake over a data warehouse? Give a concrete
              example.
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Choose data lakes for diverse data types, massive scale,
              and schema flexibility. Example: ML platform needing training data from multiple
              sources (databases, logs, IoT, files). Data warehouse requires schema design and
              ETL before loading—slow and inflexible for exploration. Data lake ingests all
              data as-is, data scientists explore raw data, engineers build features, models
              train on curated datasets. Choose lake for: ML, exploration, diverse data,
              cost-effective scale. Choose warehouse for: BI, reporting, consistent schemas,
              business users.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What about query performance? Answer: Lakes have
              lower query performance than warehouses. Optimize with columnar formats
              (Parquet), partitioning, and caching. For BI workloads, use gold layer or
              lakehouse pattern for warehouse-like performance.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q2: Explain medallion architecture. What are bronze, silver, and gold layers?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Medallion architecture organizes data lakes into
              quality layers. Bronze (raw): immutable raw data as-ingested, full history,
              unknown quality. Silver (cleaned): validated, cleaned, enriched data, single
              source of truth for entities. Gold (curated): aggregated, business-level data
              ready for analytics and ML. Data flows bronze → silver → gold, progressively
              refined. Benefits: structure without rigidity, clear quality expectations,
              enables reprocessing (start from bronze).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you prevent data from stagnating in bronze?
              Answer: Define SLAs for data progression (bronze → silver within 24 hours),
              monitor layer sizes (alert if bronze grows without silver/gold growth),
              automate pipelines where possible.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q3: What is a data swamp? How do you prevent it?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Data swamp is a data lake without governance—unusable,
              untrusted, undiscoverable data. Causes: no catalog (can't find data), no access
              control (security risks), no quality monitoring (can't trust data), no lifecycle
              (costs explode). Prevention: (1) Data catalog for discovery and documentation.
              (2) Access control (RBAC, encryption). (3) Data quality monitoring (rules,
              alerts). (4) Lifecycle management (retention, archival). (5) Medallion
              architecture (clear quality layers). (6) Data ownership (assigned owners per
              dataset).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you recover from a data swamp? Answer:
              Start fresh with governance framework. Catalog existing data, assign owners,
              define quality rules, implement access control. May need to re-ingest critical
              data with proper governance. Prevention is easier than recovery.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q4: What is lakehouse architecture? How does it differ from traditional lake
              or warehouse?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Lakehouse combines data lake flexibility with data
              warehouse reliability. Built on open table formats (Delta Lake, Iceberg, Hudi).
              Provides: ACID transactions (concurrent reads/writes), schema enforcement
              (prevent bad data), time travel (query historical versions), unified platform
              (BI + ML + ETL on same data). Differs from lake: adds ACID, schema, governance.
              Differs from warehouse: uses object storage (lower cost), supports diverse
              data types, enables ML directly. Benefits: simplified architecture (no
              lake-to-warehouse ETL), cost optimization (object storage), unified data
              (single source of truth).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What are open table formats? Answer: Delta Lake
              (Databricks), Apache Iceberg (Netflix/Apple), Apache Hudi (Uber). They add
              ACID metadata layer on top of object storage, enabling warehouse capabilities
              on lake storage.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q5: How do you optimize data lake query performance?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Optimization techniques: (1) File formats—use
              columnar formats (Parquet, ORC) for compression and predicate pushdown.
              (2) Partitioning—partition by commonly filtered columns (date, region) to
              reduce scan size. (3) File sizing—compact small files (128MB-1GB optimal),
              avoid many tiny files. (4) Caching—cache hot datasets in memory (Alluxio,
              Spark cache). (5) Statistics—collect statistics for query optimization
              (min/max values, row counts). (6) Indexing—use data skipping indexes
              (Delta Lake Z-order). (7) Query engines—choose appropriate engine (Presto
              for interactive, Spark for batch).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What is predicate pushdown? Answer: Filtering
              data at storage level before loading into memory. Parquet stores min/max
              per column per row group. Query engine skips row groups that don't match
              filters, reducing I/O.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q6: Your data lake costs are growing unexpectedly. How do you diagnose and
              reduce costs?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Diagnose: (1) Check storage growth—which layers
              (bronze/silver/gold) are growing? (2) Check file sizes—many small files
              (inefficient)? (3) Check access patterns—which data is accessed (hot) vs
              unused (cold)? (4) Check retention—is old data being deleted per policy?
              Reduce costs: (1) Implement lifecycle policies (archive cold data to cheaper
              tiers, delete expired data). (2) Compact small files (reduce storage overhead).
              (3) Use compression (Parquet with Snappy/Zstd). (4) Delete unused data (identify
              via access logs). (5) Use appropriate storage tiers (hot/cold/archive).
              (6) Monitor and alert on storage growth.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What are storage tiers? Answer: Object storage
              offers tiers: Standard (hot, frequently accessed, highest cost), Infrequent
              Access (cool, accessed monthly, lower cost), Archive (cold, accessed yearly,
              lowest cost, hours to retrieve). Move data to cooler tiers as it ages.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            Bill Inmon, "Building the Data Lake," O'Reilly, 2016.
          </li>
          <li>
            Databricks, "Lakehouse Architecture,"
            https://www.databricks.com/glossary/data-lakehouse
          </li>
          <li>
            AWS, "What is a Data Lake?"
            https://aws.amazon.com/big-data/datalakes-and-analytics/what-is-a-data-lake/
          </li>
          <li>
            Azure, "Introduction to Azure Data Lake Storage,"
            https://docs.microsoft.com/en-us/azure/storage/blobs/data-lake-storage-introduction
          </li>
          <li>
            Delta Lake Documentation, "What is Delta Lake,"
            https://delta.io/
          </li>
          <li>
            Apache Iceberg Documentation, "Iceberg Specification,"
            https://iceberg.apache.org/
          </li>
          <li>
            Apache Hudi Documentation, "Introduction,"
            https://hudi.apache.org/
          </li>
          <li>
            Martin Kleppmann, <em>Designing Data-Intensive Applications</em>, O'Reilly, 2017.
            Chapter 3.
          </li>
          <li>
            Ralph Kimball, "The Data Warehouse Toolkit," Wiley, 2013.
          </li>
          <li>
            Google Cloud, "Data Lake vs Data Warehouse,"
            https://cloud.google.com/blog/products/data-analytics/data-lake-vs-data-warehouse
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
