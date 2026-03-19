"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-advanced-data-lineage-auditability-extensive",
  title: "Data Lineage & Auditability",
  description: "Comprehensive guide to data lineage tracking, audit trails, data governance, and compliance for staff/principal engineer interviews.",
  category: "advanced-topics",
  subcategory: "nfr",
  slug: "data-lineage-auditability",
  version: "extensive",
  wordCount: 10000,
  readingTime: 40,
  lastUpdated: "2026-03-19",
  tags: ["advanced", "nfr", "data-lineage", "auditability", "governance", "compliance", "data-engineering"],
  relatedTopics: ["compliance-auditing", "centralized-logging", "data-governance"],
};

export default function DataLineageAuditabilityArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Data Lineage</strong> tracks the flow of data through systems — where data originates,
          how it transforms, where it moves, and where it ends up. <strong>Auditability</strong> is the
          ability to reconstruct who accessed or modified data, when, and why.
        </p>
        <p>
          Together, these capabilities enable organizations to answer critical questions: Where did this
          number come from? What systems are affected if this data is wrong? Who accessed sensitive data
          last week? Can we prove compliance with GDPR/ HIPAA/ SOX?
        </p>
        <p>
          <strong>Key use cases:</strong>
        </p>
        <ul>
          <li>
            <strong>Root Cause Analysis:</strong> Trace data quality issues to source systems.
          </li>
          <li>
            <strong>Impact Analysis:</strong> Understand downstream impact of schema changes.
          </li>
          <li>
            <strong>Compliance:</strong> Prove data handling meets regulatory requirements.
          </li>
          <li>
            <strong>Data Governance:</strong> Enforce data policies, access controls, retention rules.
          </li>
          <li>
            <strong>Trust:</strong> Build confidence in data-driven decisions.
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Lineage Is a Graph Problem</h3>
          <p>
            Data lineage is fundamentally a graph: nodes are datasets/tables/columns, edges are transformations
            and data flows. Understanding this structure enables powerful queries: &quot;What feeds this
            dashboard?&quot; (upstream traversal), &quot;What breaks if I change this column?&quot; (downstream
            traversal).
          </p>
          <p className="mt-3">
            <strong>Audit trails are append-only logs:</strong> Every access, modification, and schema change
            is recorded immutably. This enables reconstruction of historical state and forensic analysis.
          </p>
        </div>

        <p>
          This article covers data lineage models, capture techniques, audit trail design, compliance
          requirements, and organizational practices for data governance.
        </p>
      </section>

      <section>
        <h2>Data Lineage Models</h2>
        <p>
          Different granularity levels for lineage tracking.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Table-Level Lineage</h3>
        <p>
          Track which tables feed which other tables:
        </p>
        <ul>
          <li>
            <strong>Capture:</strong> Parse SQL queries, ETL job configurations.
          </li>
          <li>
            <strong>Granularity:</strong> Source table → Target table.
          </li>
          <li>
            <strong>Use case:</strong> High-level impact analysis, system documentation.
          </li>
          <li>
            <strong>Limitation:</strong> Doesn&apos;t show column-level dependencies.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Column-Level Lineage</h3>
        <p>
          Track which columns feed which other columns:
        </p>
        <ul>
          <li>
            <strong>Capture:</strong> Parse SQL SELECT/INSERT statements, analyze transformations.
          </li>
          <li>
            <strong>Granularity:</strong> Source table.column → Target table.column.
          </li>
          <li>
            <strong>Use case:</strong> Precise impact analysis, GDPR data subject requests.
          </li>
          <li>
            <strong>Limitation:</strong> More complex to capture and store.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Field-Level Lineage</h3>
        <p>
          Track individual data elements through transformations:
        </p>
        <ul>
          <li>
            <strong>Capture:</strong> Instrument data processing code, capture row-level transformations.
          </li>
          <li>
            <strong>Granularity:</strong> Individual record/field tracking.
          </li>
          <li>
            <strong>Use case:</strong> Debugging data quality issues, forensic analysis.
          </li>
          <li>
            <strong>Limitation:</strong> High overhead, typically sampled not comprehensive.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/data-lineage-models.svg"
          alt="Data Lineage Models"
          caption="Data Lineage Models — comparing table-level, column-level, and field-level lineage with examples"
        />
      </section>

      <section>
        <h2>Lineage Capture Techniques</h2>
        <p>
          Methods for automatically capturing lineage information.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">SQL Parsing</h3>
        <p>
          Parse SQL queries to extract source and target tables:
        </p>
        <ul>
          <li>
            <strong>How:</strong> Use SQL parser (ANTLR, sqlparse) to extract FROM, JOIN, INSERT INTO clauses.
          </li>
          <li>
            <strong>Pros:</strong> Automatic, works with existing queries, no code changes.
          </li>
          <li>
            <strong>Cons:</strong> Doesn&apos;t capture business logic, may miss dynamic SQL.
          </li>
          <li>
            <strong>Tools:</strong> Apache Atlas, DataHub, custom parsers.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Query Log Analysis</h3>
        <p>
          Analyze database query logs:
        </p>
        <ul>
          <li>
            <strong>How:</strong> Parse general query log (MySQL), audit log (PostgreSQL), or query history
            (BigQuery, Snowflake).
          </li>
          <li>
            <strong>Pros:</strong> Captures all queries, including ad-hoc analysis.
          </li>
          <li>
            <strong>Cons:</strong> Log volume is high, may miss application-level transformations.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">ETL/ELT Tool Integration</h3>
        <p>
          Extract lineage from data pipeline tools:
        </p>
        <ul>
          <li>
            <strong>How:</strong> Integrate with Airflow, dbt, Fivetran, Stitch to extract DAG definitions
            and transformations.
          </li>
          <li>
            <strong>Pros:</strong> Captures transformation logic, scheduling, dependencies.
          </li>
          <li>
            <strong>Cons:</strong> Requires integration per tool, may not capture custom code.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Application Instrumentation</h3>
        <p>
          Instrument application code to report lineage:
        </p>
        <ul>
          <li>
            <strong>How:</strong> SDKs/libraries that capture data access patterns, custom instrumentation.
          </li>
          <li>
            <strong>Pros:</strong> Captures application-level logic, custom transformations.
          </li>
          <li>
            <strong>Cons:</strong> Requires code changes, developer adoption.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Hybrid Approach</h3>
        <p>
          Combine multiple techniques for comprehensive coverage:
        </p>
        <ul>
          <li>
            <strong>SQL parsing:</strong> For batch ETL jobs.
          </li>
          <li>
            <strong>Query logs:</strong> For ad-hoc analysis.
          </li>
          <li>
            <strong>ETL integration:</strong> For pipeline orchestration.
          </li>
          <li>
            <strong>Instrumentation:</strong> For custom application logic.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/lineage-capture-architecture.svg"
          alt="Lineage Capture Architecture"
          caption="Lineage Capture — showing SQL parsing, query logs, ETL integration, and application instrumentation"
        />
      </section>

      <section>
        <h2>Audit Trail Design</h2>
        <p>
          Designing comprehensive audit trails for data access and modifications.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">What to Audit</h3>
        <p>
          Key events to capture:
        </p>
        <ul>
          <li>
            <strong>Data Access:</strong> Who queried what data, when, from where.
          </li>
          <li>
            <strong>Data Modification:</strong> INSERT, UPDATE, DELETE operations with before/after values.
          </li>
          <li>
            <strong>Schema Changes:</strong> ALTER TABLE, CREATE, DROP operations.
          </li>
          <li>
            <strong>Access Control Changes:</strong> GRANT, REVOKE, role assignments.
          </li>
          <li>
            <strong>Authentication:</strong> Login attempts, privilege escalations.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Audit Record Structure</h3>
        <p>
          Standard audit record fields:
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <ul className="space-y-2 text-sm">
            <li><strong>timestamp:</strong> When the event occurred (UTC, high precision).</li>
            <li><strong>user_id:</strong> Who performed the action.</li>
            <li><strong>action:</strong> What operation (SELECT, INSERT, UPDATE, DELETE).</li>
            <li><strong>resource:</strong> What data was accessed (table, column, row ID).</li>
            <li><strong>source:</strong> Where from (IP address, application, hostname).</li>
            <li><strong>result:</strong> Outcome (success, failure, rows affected).</li>
            <li><strong>before/after:</strong> For modifications, old and new values.</li>
            <li><strong>correlation_id:</strong> Link to broader transaction/request.</li>
          </ul>
        </div>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Storage Considerations</h3>
        <p>
          Where and how to store audit trails:
        </p>
        <ul>
          <li>
            <strong>Separate Database:</strong> Store audits separately from operational data. Prevents
            tampering.
          </li>
          <li>
            <strong>Append-Only:</strong> Audit tables should be insert-only, never updated or deleted.
          </li>
          <li>
            <strong>Retention:</strong> Define retention period based on compliance (7 years for financial,
            6 years for HIPAA).
          </li>
          <li>
            <strong>Indexing:</strong> Index by timestamp, user_id, resource for efficient querying.
          </li>
          <li>
            <strong>Encryption:</strong> Encrypt audit data at rest and in transit.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Tamper Prevention</h3>
        <p>
          Ensure audit trails cannot be modified:
        </p>
        <ul>
          <li>
            <strong>Write-Once Storage:</strong> WORM (Write Once Read Many) storage, S3 Object Lock.
          </li>
          <li>
            <strong>Hash Chains:</strong> Each record includes hash of previous record. Tampering breaks chain.
          </li>
          <li>
            <strong>Separate Permissions:</strong> Audit write permissions separate from admin permissions.
          </li>
          <li>
            <strong>External Logging:</strong> Stream audits to external system (SIEM, CloudTrail).
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/audit-trail-design.svg"
          alt="Audit Trail Design"
          caption="Audit Trail Design — showing record structure, storage architecture, and tamper prevention mechanisms"
        />
      </section>

      <section>
        <h2>Compliance Requirements</h2>
        <p>
          Regulatory requirements driving lineage and audit needs.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">GDPR (EU)</h3>
        <p>
          General Data Protection Regulation requirements:
        </p>
        <ul>
          <li>
            <strong>Right to Access:</strong> Provide individuals copy of their data. Requires knowing where
            data is stored.
          </li>
          <li>
            <strong>Right to Erasure:</strong> Delete individual&apos;s data. Requires knowing all locations.
          </li>
          <li>
            <strong>Data Portability:</strong> Export data in machine-readable format.
          </li>
          <li>
            <strong>Processing Records:</strong> Document data processing activities.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">HIPAA (Healthcare)</h3>
        <p>
          Health Insurance Portability and Accountability Act:
        </p>
        <ul>
          <li>
            <strong>Audit Controls:</strong> Record and examine access to PHI (Protected Health Information).
          </li>
          <li>
            <strong>Access Reports:</strong> Provide individuals record of disclosures.
          </li>
          <li>
            <strong>Retention:</strong> Maintain audit records for 6 years.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">SOX (Financial)</h3>
        <p>
          Sarbanes-Oxley Act requirements:
        </p>
        <ul>
          <li>
            <strong>Financial Data Integrity:</strong> Prove accuracy of financial reporting.
          </li>
          <li>
            <strong>Access Controls:</strong> Restrict and audit access to financial systems.
          </li>
          <li>
            <strong>Change Management:</strong> Audit trail of changes to financial systems.
          </li>
          <li>
            <strong>Retention:</strong> Maintain records for 7 years.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CCPA/CPRA (California)</h3>
        <p>
          California Consumer Privacy Act:
        </p>
        <ul>
          <li>
            <strong>Right to Know:</strong> Disclose data collection, use, sharing practices.
          </li>
          <li>
            <strong>Right to Delete:</strong> Delete consumer data upon request.
          </li>
          <li>
            <strong>Right to Opt-Out:</strong> Stop selling/sharing personal information.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/compliance-requirements.svg"
          alt="Compliance Requirements"
          caption="Compliance Requirements — showing GDPR, HIPAA, SOX, and CCPA requirements for lineage and auditing"
        />
      </section>

      <section>
        <h2>Organizational Practices</h2>
        <p>
          Building effective data governance programs.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Data Catalog</h3>
        <p>
          Maintain centralized metadata repository:
        </p>
        <ul>
          <li>
            <strong>Contents:</strong> Table/column descriptions, ownership, lineage, usage statistics.
          </li>
          <li>
            <strong>Tools:</strong> DataHub, Amundsen, Apache Atlas, Alation.
          </li>
          <li>
            <strong>Benefits:</strong> Discoverability, documentation, governance.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Data Stewardship</h3>
        <p>
          Assign ownership for data domains:
        </p>
        <ul>
          <li>
            <strong>Data Owners:</strong> Business leaders accountable for data quality.
          </li>
          <li>
            <strong>Data Stewards:</strong> Operational responsibility for data quality, definitions.
          </li>
          <li>
            <strong>Data Custodians:</strong> Technical responsibility for data storage, security.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Policy Enforcement</h3>
        <p>
          Automate data governance policies:
        </p>
        <ul>
          <li>
            <strong>Access Control:</strong> Enforce least-privilege access based on data classification.
          </li>
          <li>
            <strong>Masking:</strong> Automatically mask PII in non-production environments.
          </li>
          <li>
            <strong>Retention:</strong> Automatically delete data after retention period.
          </li>
          <li>
            <strong>Classification:</strong> Auto-detect and label sensitive data (PII, PCI, PHI).
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Lineage Visualization</h3>
        <p>
          Make lineage accessible to non-technical users:
        </p>
        <ul>
          <li>
            <strong>Interactive Graphs:</strong> Click to explore upstream/downstream dependencies.
          </li>
          <li>
            <strong>Search:</strong> Find datasets by name, description, tag.
          </li>
          <li>
            <strong>Impact Analysis:</strong> &quot;What breaks if I change this?&quot; queries.
          </li>
          <li>
            <strong>Documentation:</strong> Link lineage to business glossary, runbooks.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is data lineage and why is it important?</p>
            <p className="mt-2 text-sm">
              A: Data lineage tracks data flow from source to destination — where data originates, how it
              transforms, where it moves. Important for: root cause analysis (trace data quality issues),
              impact analysis (what breaks if I change this?), compliance (GDPR data subject requests), and
              building trust in data.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you capture data lineage?</p>
            <p className="mt-2 text-sm">
              A: Multiple techniques: (1) SQL parsing — extract source/target from queries, (2) Query log
              analysis — parse database audit logs, (3) ETL integration — extract from Airflow, dbt, etc.,
              (4) Application instrumentation — SDK to capture data access. Best approach is hybrid combining
              multiple techniques.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What should an audit trail capture?</p>
            <p className="mt-2 text-sm">
              A: Timestamp, user_id, action (SELECT/INSERT/UPDATE/DELETE), resource (table/column/row),
              source (IP/application), result (success/failure), before/after values for modifications,
              correlation_id. Store append-only in separate database with tamper prevention (WORM storage,
              hash chains).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What are GDPR requirements for data lineage?</p>
            <p className="mt-2 text-sm">
              A: GDPR requires: Right to Access (provide copy of personal data — need to know where it is),
              Right to Erasure (delete personal data — need to know all locations), Data Portability (export
              in machine-readable format), Records of Processing (document data processing activities).
              Lineage enables all of these.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent audit trail tampering?</p>
            <p className="mt-2 text-sm">
              A: Multiple layers: (1) Write-once storage (WORM, S3 Object Lock), (2) Hash chains (each record
              includes hash of previous), (3) Separate permissions (audit write separate from admin), (4)
              External logging (stream to SIEM, CloudTrail), (5) Regular audit of audit logs.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the difference between table-level and column-level lineage?</p>
            <p className="mt-2 text-sm">
              A: Table-level tracks which tables feed which tables (coarse granularity, easier to capture).
              Column-level tracks which columns feed which columns (fine granularity, enables precise impact
              analysis and GDPR compliance). Column-level requires SQL parsing with column extraction;
              table-level can use simpler query log analysis.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://datahubproject.io/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              DataHub — Modern Data Catalog
            </a>
          </li>
          <li>
            <a href="https://atlas.apache.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Apache Atlas — Metadata Management
            </a>
          </li>
          <li>
            <a href="https://gdpr.eu/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              GDPR.eu — GDPR Compliance Guide
            </a>
          </li>
          <li>
            <a href="https://www.hhs.gov/hipaa/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              HHS — HIPAA Overview
            </a>
          </li>
          <li>
            <a href="https://www.investopedia.com/terms/s/sarbanesoxleyact.asp" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Investopedia — Sarbanes-Oxley Act
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
