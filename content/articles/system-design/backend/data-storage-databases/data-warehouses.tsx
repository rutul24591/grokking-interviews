"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-data-warehouses-complete",
  title: "Data Warehouses",
  description:
    "Comprehensive guide to data warehouses: dimensional modeling (star schema), ETL/ELT pipelines, and when to use data warehouses vs data lakes for BI and analytics.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "data-warehouses",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-01",
  tags: ["backend", "data-storage", "data-warehouses", "analytics", "bi"],
  relatedTopics: [
    "data-lakes",
    "query-optimization-techniques",
    "search-engines",
    "column-family-stores",
  ],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/data-storage-databases";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>Data Warehouses</h1>
        <p className="lead">
          Data warehouses are centralized repositories for integrated, historical data optimized
          for analysis and reporting. Unlike data lakes (schema-on-read, raw data), data warehouses
          use schema-on-write—data is cleaned, transformed, and structured before loading. This
          ensures high data quality and consistent metrics, making warehouses ideal for business
          intelligence (BI), executive dashboards, and regulatory reporting. Modern cloud
          warehouses (Snowflake, BigQuery, Redshift) separate storage from compute, enabling
          elastic scaling and cost optimization.
        </p>

        <p>
          Consider a retail company with sales data scattered across systems: e-commerce platform,
          POS systems, inventory management, and CRM. A data warehouse integrates all sources into
          a unified schema. Sales facts link to dimension tables (product, customer, time, store).
          Executives query consistent metrics (revenue, margin, YoY growth) via BI tools. Data
          quality is enforced during ETL—bad data is rejected, not stored.
        </p>

        <p>
          Data warehouse services (Snowflake, Google BigQuery, Amazon Redshift, Azure Synapse)
          power business analytics: executive dashboards (KPIs, trends), historical analysis
          (multi-year comparisons), regulatory reporting (SOX, GDPR), and self-service BI
          (analysts query without SQL expertise). These workloads share characteristics:
          structured data, consistent schemas, read-optimized queries, and business-user
          accessibility.
        </p>

        <p>
          This article provides a comprehensive examination of data warehouses: the architecture
          (ETL/ELT pipelines, dimensional modeling, star schema), modern cloud warehouses
          (storage/compute separation, elastic scaling), and real-world use cases. We'll explore
          when data warehouses excel (BI, reporting, consistent metrics) and when they struggle
          (raw data, ML workloads, schema flexibility). We'll also compare data warehouses with
          data lakes and introduce the lakehouse pattern (combining warehouse reliability with
          lake flexibility).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/data-warehouses-architecture.svg`}
          caption="Figure 1: Data Warehouse Architecture showing ETL/ELT pipeline: data extracted from OLTP DBs, Apps/APIs, External sources, Files → transformed (clean, validate, join) → loaded into data warehouse. Dimensional modeling (star schema): Fact table (central, with measurements/metrics, foreign keys to dimensions, e.g., sales, clicks) connected to Dimension tables (Dim Time, Dim Product, Dim Customer - context: who, what, when). Query & consumption: SQL Queries (ad-hoc analysis), BI Tools (Tableau, Power BI), Dashboards (reports, KPIs), Data Marts (department-specific). Key characteristics: schema-on-write, dimensional modeling, optimized for reads, historical analysis, business intelligence."
          alt="Data warehouse architecture"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: Dimensional Modeling &amp; ETL</h2>

        <h3>Dimensional Modeling (Star Schema)</h3>
        <p>
          Dimensional modeling organizes data into <strong>fact tables</strong> and
          <strong>dimension tables</strong>. <strong>Fact tables</strong> contain measurements
          (sales amount, quantity, clicks) and foreign keys to dimensions. Facts are typically
          numeric, additive, and high-volume (millions/billions of rows). <strong>Dimension
          tables</strong> contain descriptive attributes (product name, customer segment, store
          location). Dimensions provide context for facts—who, what, when, where.
        </p>

        <p>
          <strong>Star schema</strong> is the simplest dimensional model: one fact table
          surrounded by dimension tables (like a star). Each dimension connects directly to
          the fact table. Star schemas are easy to understand, fast for queries (single join
          per dimension), and BI-tool friendly. <strong>Snowflake schema</strong> normalizes
          dimensions (e.g., Product → Category → Department), reducing redundancy but adding
          join complexity. Star schema is preferred for most BI workloads.
        </p>

        <p>
          Example: Sales fact table with columns (date_id, product_id, customer_id, store_id,
          quantity, revenue). Dimension tables: Date (date_id, year, quarter, month, day),
          Product (product_id, name, category, brand), Customer (customer_id, name, segment,
          region), Store (store_id, name, city, state). Query: "Sales by category in Q1 2024"
          joins Sales fact with Date and Product dimensions.
        </p>

        <h3>ETL vs ELT</h3>
        <p>
          <strong>ETL</strong> (Extract, Transform, Load) transforms data before loading into
          warehouse. Extract from sources, transform (clean, validate, join) in ETL engine,
          load curated data into warehouse. Benefits: warehouse stores only clean data,
          transformation logic centralized. Trade-offs: ETL bottleneck, raw data not preserved.
        </p>

        <p>
          <strong>ELT</strong> (Extract, Load, Transform) loads raw data into warehouse,
          transforms inside warehouse. Extract from sources, load raw data, transform using
          warehouse compute (SQL). Benefits: warehouse compute scales, raw data preserved,
          transformation logic in SQL (analyst-friendly). Trade-offs: warehouse stores raw
          data (cost), transformation logic distributed.
        </p>

        <p>
          Modern cloud warehouses favor ELT: storage is cheap, compute scales elastically,
          and SQL is familiar. ETL is still used for complex transformations (data quality,
          deduplication) before loading.
        </p>

        <h3>Incremental Loading</h3>
        <p>
          Full reloads (truncate and reload all data) are simple but inefficient for large
          datasets. <strong>Incremental loading</strong> loads only changed data. Techniques:
          <strong>Change Data Capture (CDC)</strong> captures database changes (inserts,
          updates, deletes) via logs or triggers. <strong>Timestamp-based</strong> loads
          records modified since last load. <strong>Delta-based</strong> compares source
          and target to identify changes.
        </p>

        <p>
          Incremental loading reduces ETL time, warehouse load, and source system impact.
          But it's more complex (handle deletes, late-arriving data, schema changes).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/data-warehouses-comparison.svg`}
          caption="Figure 2: Data Warehouse vs Data Lake vs Lakehouse comparison. Schema: Warehouse (schema-on-write, rigid/enforced), Lake (schema-on-read, flexible), Lakehouse (schema-on-write, enforced/evolved). Data Quality: Warehouse (high, curated), Lake (variable, raw), Lakehouse (high, ACID). Performance: Warehouse (optimized, fast), Lake (variable, needs optimization), Lakehouse (optimized, fast). Cost: Warehouse (high, optimized), Lake (low, object storage), Lakehouse (low, object storage). Architecture Evolution: Traditional (warehouse only, high cost, rigid) → Modern (lake + warehouse, complex, ETL between) → Lakehouse (unified platform, simple, cost-effective, ACID + Scale, BI + ML unified). Key takeaway: Lakehouse combines warehouse reliability (ACID, schema) with lake flexibility (scale, cost) on unified platform. Examples: Snowflake, BigQuery, Databricks, Redshift Spectrum."
          alt="Data warehouse vs data lake comparison"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation: Modern Cloud Warehouses</h2>

        <h3>Storage/Compute Separation</h3>
        <p>
          Traditional warehouses (on-premise Teradata, Oracle) couple storage and compute—scale
          both together (expensive). Modern cloud warehouses (Snowflake, BigQuery, Redshift)
          <strong>separate storage from compute</strong>. Storage is object storage (S3, GCS)
         —cheap, durable, elastic. Compute is virtual warehouses (clusters) that process
          queries—scale independently, pay per query.
        </p>

        <p>
          Benefits: <strong>Cost optimization</strong> (storage cheap, compute on-demand),
          <strong>Elastic scaling</strong> (spin up compute for peak queries, down for idle),
          <strong>Concurrency</strong> (multiple compute clusters query same data without
          contention), <strong>Zero management</strong> (no hardware, auto-scaling).
        </p>

        <h3>Data Sharing</h3>
        <p>
          Cloud warehouses enable <strong>secure data sharing</strong> without copying. Share
          tables/views with other accounts (internal teams, external partners). Consumers query
          shared data as if it's their own—no ETL, no duplication. Use cases: share sales
          data with suppliers, share marketing data with agencies, share consolidated data
          with subsidiaries.
        </p>

        <p>
          Data sharing uses metadata pointers—data stays in provider's storage, consumers
          access via metadata. Providers control access (revoke anytime), consumers pay
          only for their compute (storage not duplicated).
        </p>

        <h3>Time Travel</h3>
        <p>
          <strong>Time travel</strong> enables querying historical data versions. Warehouses
          retain historical versions (7-90 days depending on service). Query as-of a timestamp:
          <code className="inline-code">SELECT * FROM sales AT (TIMESTAMP =&gt; '2024-01-01')</code>.
          Use cases: audit (what data looked like at time of report), recovery (restore
          accidentally deleted data), comparison (compare current vs historical).
        </p>

        <p>
          Time travel stores change history (deltas) separately. Querying historical versions
          reconstructs state at that time. Storage cost is minimal (only deltas stored).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/data-warehouses-use-cases.svg`}
          caption="Figure 3: Data Warehouse Use Cases & Best Practices. Primary use cases: Business Intelligence (executive dashboards, KPI tracking, performance reporting, trend analysis, self-service BI), Historical Analysis (multi-year trends, year-over-year comparison, seasonal patterns, long-term retention, audit/compliance), Consolidated Reporting (multi-source consolidation, single source of truth, consistent metrics, regulatory reporting, financial reporting). Best Practices: Star Schema (dimensional modeling), Incremental ETL (change data capture), Data Quality (validation, monitoring), Governance (access, lineage). Anti-patterns: storing raw/unstructured data (use data lake), frequent schema changes (use data lake), ML workloads (use data lake), cost-sensitive archival (use data lake/object storage). Best for: BI, reporting, historical analysis, consistent metrics, business users, regulatory compliance."
          alt="Data warehouse use cases and best practices"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison: Warehouse vs Lake vs Lakehouse</h2>

        <p>
          Data warehouses, data lakes, and lakehouses serve different purposes. Understanding
          the trade-offs helps you choose the right architecture—or combine them.
        </p>

        <h3>Data Warehouse Strengths</h3>
        <p>
          <strong>Data quality</strong> is the primary advantage. ETL enforces schema, validates
          data, and rejects bad records. Business users trust warehouse data—consistent metrics,
          no surprises. This is essential for executive dashboards and regulatory reporting.
        </p>

        <p>
          <strong>Query performance</strong> is optimized for BI. Columnar storage, indexes,
          materialized views, and query optimization enable sub-second queries on billions
          of rows. BI tools (Tableau, Power BI) integrate seamlessly.
        </p>

        <p>
          <strong>Business user accessibility</strong> is high. SQL is familiar to analysts.
          Self-service BI enables business users to create reports without data engineering
          support. Data catalogs document available datasets.
        </p>

        <p>
          <strong>Governance</strong> is built-in. Access control (RBAC), audit logging,
          data lineage, and compliance features (GDPR, SOX) are standard. Essential for
          regulated industries (finance, healthcare).
        </p>

        <h3>Data Warehouse Limitations</h3>
        <p>
          <strong>Cost</strong> is higher than data lakes. Warehouse storage costs ~$1/GB/month;
          object storage costs ~$0.023/GB/month. For petabyte-scale data, warehouses are
          expensive.
        </p>

        <p>
          <strong>Schema rigidity</strong> limits flexibility. Schema changes require ETL
          updates and downtime. Not suitable for exploratory analytics (schema unknown) or
          rapidly evolving data.
        </p>

        <p>
          <strong>Raw data not preserved</strong>. ETL transforms data before loading—original
          is lost. If business logic changes, reprocessing requires source systems (may not
          have historical data).
        </p>

        <p>
          <strong>ML workloads limited</strong>. Warehouses optimize for SQL queries, not
          ML training. Exporting data to ML platforms adds complexity. Some warehouses
          (BigQuery ML, Snowflake ML) offer in-warehouse ML, but capabilities are limited.
        </p>

        <h3>When to Use Data Warehouses</h3>
        <p>
          Use data warehouses for: <strong>BI and reporting</strong> (dashboards, KPIs),
          <strong>Historical analysis</strong> (multi-year trends, YoY comparisons),
          <strong>Regulatory reporting</strong> (SOX, GDPR, financial), <strong>Consistent
          metrics</strong> (single source of truth), <strong>Business users</strong>
          (self-service BI).
        </p>

        <p>
          Use data lakes for: <strong>Raw data storage</strong> (preserve original),
          <strong>ML workloads</strong> (training data, feature engineering),
          <strong>Exploratory analytics</strong> (schema unknown), <strong>Cost-sensitive
          scale</strong> (petabyte-scale).
        </p>

        <p>
          Use lakehouse for: <strong>Unified platform</strong> (BI + ML on same data),
          <strong>Cost optimization</strong> (object storage with warehouse capabilities),
          <strong>Flexibility + reliability</strong> (schema evolution with ACID guarantees).
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for Data Warehouses</h2>

        <p>
          <strong>Use dimensional modeling.</strong> Star schemas are BI-tool friendly and
          query-efficient. Avoid normalized schemas (3NF) for warehouses—they require too
          many joins for BI queries.
        </p>

        <p>
          <strong>Implement incremental ETL.</strong> Full reloads don't scale. Use CDC or
          timestamp-based incremental loading. Handle deletes, late-arriving data, and
          schema changes gracefully.
        </p>

        <p>
          <strong>Enforce data quality.</strong> Define quality rules (completeness, accuracy,
          consistency), validate during ETL, reject bad data, alert on quality degradation.
          Quality scores build user trust.
        </p>

        <p>
          <strong>Optimize for queries.</strong> Use columnar storage, partition by commonly
          filtered columns (date), cluster by join keys, create materialized views for
          frequent queries. Monitor query performance and optimize slow queries.
        </p>

        <p>
          <strong>Implement governance.</strong> Define access control (RBAC), audit logging,
          data lineage (trace data flow), and retention policies. Document datasets in data
          catalog.
        </p>

        <p>
          <strong>Separate workloads.</strong> Use separate warehouses (or virtual warehouses)
          for ETL, BI, and ad-hoc queries. This prevents ETL from impacting BI performance.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>Boiling the ocean.</strong> Trying to load all data at once leads to
          multi-year projects that never deliver. Solution: Start with specific use cases
          (executive dashboards), load data needed for those use cases, expand iteratively.
        </p>

        <p>
          <strong>Ignoring data quality.</strong> Bad data in = bad decisions out. Solution:
          Implement data quality checks during ETL, reject bad data, monitor quality metrics,
          assign data owners responsible for quality.
        </p>

        <p>
          <strong>Over-normalization.</strong> Normalized schemas (3NF) are efficient for
          writes but terrible for BI queries (too many joins). Solution: Use dimensional
          modeling (star schema) optimized for reads.
        </p>

        <p>
          <strong>No governance.</strong> Without access control and documentation, data
          is insecure and undiscoverable. Solution: Implement RBAC, audit logging, data
          catalog, and lineage tracking from day one.
        </p>

        <p>
          <strong>Under-provisioned compute.</strong> Slow queries frustrate users. Solution:
          Monitor query performance, scale compute for peak loads, use workload management
          (prioritize critical queries).
        </p>

        <p>
          <strong>Storing raw data in warehouse.</strong> Warehouses are expensive for raw
          data. Solution: Store raw data in data lake (object storage), load curated data
          into warehouse. Use lakehouse pattern for unified access.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Executive Dashboards</h3>
        <p>
          Executives need real-time visibility into business performance. Data warehouses
          consolidate data from all sources (sales, marketing, finance, operations) into
          unified metrics. Dashboards display KPIs (revenue, margin, customer acquisition
          cost), trends (YoY growth), and alerts (metrics below threshold).
        </p>

        <p>
          This pattern works because executives need consistent metrics (single source of
          truth), fast queries (sub-second dashboards), and trust in data (quality enforced).
        </p>

        <h3>Financial Reporting</h3>
        <p>
          Public companies require accurate financial reporting (SOX compliance). Data
          warehouses consolidate financial data from ERP, billing, and accounting systems.
          Reports are auditable (data lineage), consistent (defined metrics), and timely
          (automated ETL).
        </p>

        <p>
          This pattern works because financial reporting requires accuracy (data quality),
          auditability (lineage tracking), and compliance (access control, retention).
        </p>

        <h3>Customer Analytics</h3>
        <p>
          Marketing teams analyze customer behavior (acquisition, retention, lifetime value).
          Data warehouses integrate data from web analytics, CRM, email, and transactions.
          Segments (high-value customers, churn risk) enable targeted campaigns.
        </p>

        <p>
          This pattern works because customer analytics needs multi-source integration
          (unified customer view), historical analysis (trends over time), and self-service
          (marketers create reports without SQL).
        </p>

        <h3>Regulatory Compliance</h3>
        <p>
          Regulated industries (finance, healthcare) require compliance reporting (GDPR,
          HIPAA, Basel III). Data warehouses store required data with retention policies,
          access control, and audit trails. Reports are generated automatically, ensuring
          timely submission.
        </p>

        <p>
          This pattern works because compliance requires data retention (long-term storage),
          access control (who accessed what), audit trails (change history), and consistent
          reporting (defined metrics).
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q1: When would you choose a data warehouse over a data lake? Give a concrete
              example.
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Choose data warehouses for BI, reporting, and consistent
              metrics. Example: Executive dashboards for a retail company. Executives need
              trusted metrics (revenue, margin, YoY growth), fast queries (sub-second
              dashboards), and self-service access (no SQL expertise). Data lake would require
              schema design at query time (slow), data quality varies (untrusted), and SQL
              expertise needed. Data warehouse enforces schema (consistent), validates data
              (trusted), and integrates with BI tools (self-service). Choose warehouse for:
              BI, reporting, compliance, business users. Choose lake for: ML, exploration,
              raw data, cost scale.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What about cost? Answer: Warehouses are more
              expensive than lakes. For large-scale raw data, use lake for storage, warehouse
              for curated data. Or use lakehouse pattern for unified platform.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q2: Explain star schema. Why is it preferred for data warehouses?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Star schema organizes data into fact tables
              (measurements) and dimension tables (context). Fact table in center, dimensions
              surround it (like a star). Example: Sales fact (quantity, revenue) linked to
              Date, Product, Customer, Store dimensions. Preferred because: (1) Simple—easy
              to understand, (2) Fast—single join per dimension, (3) BI-friendly—tools
              optimize for star schemas, (4) Query-efficient—fewer joins than normalized
              schemas. Trade-off: some data redundancy (dimension values repeated), but
              storage is cheap compared to query performance gains.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What's the difference between star and snowflake
              schema? Answer: Snowflake normalizes dimensions (Product → Category → Department),
              reducing redundancy but adding joins. Star keeps dimensions flat (Product includes
              category, department). Star is preferred for BI (fewer joins = faster queries).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q3: What is the difference between ETL and ELT? When would you use each?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> ETL (Extract, Transform, Load) transforms data before
              loading. Extract from sources, transform in ETL engine, load curated data.
              Benefits: warehouse stores only clean data, transformation logic centralized.
              Use for: complex transformations (data quality, deduplication), compliance
              (PII masking before load). ELT (Extract, Load, Transform) loads raw data,
              transforms in warehouse. Extract, load raw, transform using warehouse SQL.
              Benefits: warehouse compute scales, raw data preserved, SQL is familiar. Use
              for: modern cloud warehouses (elastic compute), analyst-friendly (SQL
              transformations), raw data preservation.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> Which is more common today? Answer: ELT is more
              common with cloud warehouses (Snowflake, BigQuery). Storage is cheap, compute
              scales elastically, and SQL is familiar. ETL still used for complex data quality
              and compliance transformations.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q4: How do you handle slowly changing dimensions (SCD)?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Slowly Changing Dimensions track historical changes
              to dimension attributes. Types: Type 1 (overwrite—no history, e.g., fix
              typos), Type 2 (add new row—full history, e.g., customer address changes),
              Type 3 (add new column—limited history, e.g., previous_address column).
              Type 2 is most common: add start_date, end_date, is_current columns. Query
              filters is_current = true for current state, or date range for historical
              state. Trade-off: dimension tables grow larger, but history is preserved.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you implement Type 2 SCD? Answer: On dimension
              change: (1) Update existing row (set end_date = today, is_current = false),
              (2) Insert new row (start_date = today, end_date = NULL, is_current = true).
              ETL logic handles this automatically.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q5: Your data warehouse queries are slow. How do you diagnose and optimize?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Diagnose: (1) Check query execution plan—full table
              scans? Missing indexes? (2) Check partition pruning—is data being filtered
              by partition? (3) Check join order—large tables joined first? (4) Check
              resource contention—are multiple queries competing? (5) Check data skew—uneven
              distribution? Optimize: (1) Add/fix partitions (partition by date), (2) Create
              materialized views for frequent queries, (3) Cluster by join keys, (4) Scale
              compute (more warehouses), (5) Optimize queries (avoid SELECT *, use
              appropriate aggregations), (6) Use result caching (repeat queries).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What is partition pruning? Answer: Partitioning
              divides table by column (e.g., date). Query with date filter skips irrelevant
              partitions (pruning), reducing scan size. Example: partition by month, query
              for January scans only January partition (1/12 of data).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q6: What is a data mart? How does it differ from a data warehouse?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Data mart is a subset of data warehouse focused on
              specific department/use case (sales mart, finance mart). Warehouse is
              enterprise-wide (all data, all departments). Differences: Scope (mart =
              department, warehouse = enterprise), Data (mart = subset, warehouse =
              comprehensive), Users (mart = department users, warehouse = all users),
              Build time (mart = weeks, warehouse = months/years). Marts can be built
              from warehouse (top-down) or independently (bottom-up, then integrated).
              Modern approach: single warehouse with row/column-level security instead
              of separate marts.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> When would you use data marts? Answer: When
              departments need autonomy (custom schemas, fast iteration), or for performance
              (isolate department queries). But separate marts create silos—prefer single
              warehouse with access control.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            Ralph Kimball, "The Data Warehouse Toolkit," Wiley, 2013.
          </li>
          <li>
            Bill Inmon, "Building the Data Warehouse," Wiley, 2005.
          </li>
          <li>
            Snowflake Documentation, "Architecture,"
            https://docs.snowflake.com/
          </li>
          <li>
            Google BigQuery Documentation, "Introduction,"
            https://cloud.google.com/bigquery/docs/introduction
          </li>
          <li>
            Amazon Redshift Documentation, "Architecture,"
            https://docs.aws.amazon.com/redshift/
          </li>
          <li>
            Azure Synapse Documentation, "Overview,"
            https://docs.microsoft.com/en-us/azure/synapse-analytics/
          </li>
          <li>
            Martin Kleppmann, <em>Designing Data-Intensive Applications</em>, O'Reilly, 2017.
            Chapter 3.
          </li>
          <li>
            Databricks, "Lakehouse Architecture,"
            https://www.databricks.com/glossary/data-lakehouse
          </li>
          <li>
            AWS, "Data Warehouse vs Data Lake,"
            https://aws.amazon.com/big-data/datalakes-and-analytics/data-warehouse-vs-data-lake/
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
