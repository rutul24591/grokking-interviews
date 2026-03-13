"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-change-data-capture-extensive",
  title: "Change Data Capture",
  description: "Capturing database changes for replication and streaming.",
  category: "backend",
  subcategory: "data-processing-analytics",
  slug: "change-data-capture",
  wordCount: 1143,
  readingTime: 6,
  lastUpdated: "2026-03-13",
  tags: ['backend', 'data', 'cdc'],
  relatedTopics: ['data-pipelines', 'apache-kafka', 'exactly-once-semantics'],
};

export default function ChangeDataCaptureConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>

      <section>
        <h2>Definition and Scope</h2>
        <p>Change data capture (CDC) captures database changes (inserts, updates, deletes) and streams them to downstream systems.</p>
        <p>CDC is essential for real-time replication, analytics pipelines, and cache invalidation.</p>
      </section>

      <section>
        <h2>Capture Methods</h2>
        <p>Common methods include log-based CDC, trigger-based CDC, and timestamp polling. Log-based CDC is preferred for efficiency and completeness.</p>
        <p>Trigger-based CDC can add overhead and complexity to transactional systems.</p>
        <ArticleImage src="/diagrams/backend/data-processing-analytics/change-data-capture-diagram-1.svg" alt="Change Data Capture diagram 1" caption="Change Data Capture overview diagram 1." />
      </section>

      <section>
        <h2>Failure Modes</h2>
        <p>CDC failures include missing events due to log truncation, duplicated events due to retries, and schema change incompatibilities.</p>
        <p>If CDC lags behind, downstream systems may have stale data.</p>
      </section>

      <section>
        <h2>Operational Playbook</h2>
        <p>Monitor lag between source and sink, track error rates, and validate schema compatibility.</p>
        <p>Plan for schema changes and ensure CDC connectors are updated promptly.</p>
        <ArticleImage src="/diagrams/backend/data-processing-analytics/change-data-capture-diagram-2.svg" alt="Change Data Capture diagram 2" caption="Change Data Capture overview diagram 2." />
      </section>

      <section>
        <h2>Trade-offs</h2>
        <p>CDC provides near-real-time updates but adds operational complexity. Polling is simpler but less timely.</p>
        <p>The choice depends on freshness requirements and database capabilities.</p>
      </section>

      <section>
        <h2>Scenario: Analytics Replication</h2>
        <p>A transactional database feeds a real-time analytics system via CDC. Changes are streamed into a warehouse within seconds, enabling up-to-date dashboards.</p>
        <p>This scenario highlights CDC as a bridge between OLTP and analytics.</p>
        <ArticleImage src="/diagrams/backend/data-processing-analytics/change-data-capture-diagram-3.svg" alt="Change Data Capture diagram 3" caption="Change Data Capture overview diagram 3." />
      </section>

      <section>
        <h2>Exactly-Once CDC</h2>
        <p>CDC systems often deliver at-least-once. Exactly-once requires deduplication at the sink or transactional pipelines.</p>
        <p>If downstream systems cannot handle duplicates, CDC should include deduplication logic.</p>
      </section>

      <section>
        <h2>Schema Evolution Handling</h2>
        <p>CDC streams inherit schema changes from the source database. Downstream systems must be prepared for add/remove/rename operations.</p>
        <p>Schema registry integration reduces risk of breaking consumers.</p>
      </section>

      <section>
        <h2>Operational Recovery</h2>
        <p>CDC pipelines must handle log retention limits. If the source log expires before the CDC consumer catches up, data is lost.</p>
        <p>Recovery plans should include snapshot re-seeding to rebuild downstream state.</p>
      </section>

      <section>
        <h2>CDC Semantics</h2>
        <p>CDC streams typically deliver at-least-once. Downstream systems must handle duplicates and out-of-order changes.</p>
        <p>Exactly-once CDC requires deduplication or transactional sinks, which add complexity.</p>
      </section>

      <section>
        <h2>Schema Evolution Handling</h2>
        <p>CDC streams reflect upstream schema changes. Downstream consumers must handle add/remove/rename events without breaking.</p>
        <p>Schema registry integration reduces the risk of incompatibility.</p>
      </section>

      <section>
        <h2>Recovery and Backfill</h2>
        <p>If CDC lags behind and source logs expire, recovery requires a full snapshot and re-seeding. This can be expensive and disruptive.</p>
        <p>Operational readiness includes monitoring log retention and CDC lag to avoid surprises.</p>
      </section>

      <section>
        <h2>Operational Risk</h2>
        <p>CDC pipelines can become a hidden dependency for many systems. Outages in CDC can cause stale caches, stale analytics, and delayed replication.</p>
        <p>CDC should be treated as critical infrastructure with strong monitoring and failover.</p>
      </section>

      <section>
        <h2>Consistency Guarantees</h2>
        <p>CDC streams often provide at-least-once delivery. Consumers must be idempotent to avoid double-application of changes.</p>
        <p>Exactly-once CDC requires additional coordination, often at the sink.</p>
      </section>

      <section>
        <h2>Schema Change Management</h2>
        <p>CDC pipelines reflect schema changes directly. Consumers must handle field additions, removals, and renames gracefully.</p>
        <p>Schema registries and compatibility rules prevent breaking changes from propagating.</p>
      </section>

      <section>
        <h2>Lag Management</h2>
        <p>CDC lag reduces freshness and can break downstream SLAs. Lag must be monitored and capacity scaled before it grows too large.</p>
        <p>If log retention is shorter than lag, the pipeline can lose data and require full re-seeding.</p>
      </section>

      <section>
        <h2>Downstream Idempotency</h2>
        <p>CDC delivers changes at least once. Downstream systems must be idempotent to avoid duplicate application.</p>
        <p>Idempotency keys or primary keys are essential for safe consumption.</p>
      </section>

      <section>
        <h2>Latency Budgets</h2>
        <p>CDC freshness should be tied to latency budgets. High lag can break SLAs for downstream analytics and caches.</p>
        <p>Lag alerts should trigger capacity scaling or backpressure controls.</p>
      </section>

      <section>
        <h2>Change Ordering</h2>
        <p>CDC can deliver changes out of order across tables. Ordering guarantees should be documented, and consumers should handle out-of-order events safely.</p>
        <p>Cross-table ordering often requires application-level reconciliation.</p>
      </section>

      <section>
        <h2>Audit Trails</h2>
        <p>CDC streams provide a natural audit trail, but only if they are retained and searchable. Retention policies should match audit requirements.</p>
        <p>Auditable CDC streams simplify compliance and forensic analysis.</p>
      </section>

      <section>
        <h2>CDC Pipeline Governance</h2>
        <p>CDC pipelines often feed many consumers. Governance ensures schema changes and retention policies are coordinated across teams.</p>
        <p>Without governance, downstream breakage becomes common.</p>
      </section>

      <section>
        <h2>Data Quality Controls</h2>
        <p>CDC streams can contain invalid or partial changes during outages. Downstream validation prevents corrupted state.</p>
        <p>Validation is especially important for analytics and caches.</p>
      </section>

      <section>
        <h2>Multi-Database Environments</h2>
        <p>In multi-database setups, CDC streams can arrive at different speeds. Reconciliation is required to maintain consistency across datasets.</p>
        <p>Cross-database consistency is a common hidden challenge.</p>
      </section>

      <section>
        <h2>Business Recovery</h2>
        <p>CDC outages can impact downstream SLAs. Business recovery plans should define which datasets get priority during recovery.</p>
        <p>Priority recovery reduces business impact during prolonged incidents.</p>
      </section>

      <section>
        <h2>Consumer Onboarding</h2>
        <p>New CDC consumers must understand ordering and delivery semantics. Onboarding should include schema and latency expectations.</p>
        <p>Clear onboarding reduces integration errors.</p>
      </section>

      <section>
        <h2>Reseeding Strategy</h2>
        <p>When CDC falls behind, reseeding with a snapshot is necessary. Reseeding should be planned and automated to reduce downtime.</p>
        <p>Manual reseeding is slow and risky.</p>
      </section>

      <section>
        <h2>Operational Metrics</h2>
        <p>CDC metrics include lag, throughput, and error rates. These metrics indicate data freshness and pipeline health.</p>
        <p>Operational metrics should drive alerting and capacity planning.</p>
      </section>

      <section>
        <h2>Consumer Resilience</h2>
        <p>CDC consumers must tolerate duplicates and out-of-order events. Idempotent processing is the safest approach.</p>
        <p>Resilience ensures downstream systems remain correct under retries and replays.</p>
      </section>

      <section>
        <h2>Operational Playbooks</h2>
        <p>CDC playbooks should include lag recovery, reseeding, and schema update procedures.</p>
        <p>Playbooks reduce downtime when CDC pipelines fail.</p>
      </section>

      <section>
        <h2>Change Data Capture Decision Guide</h2>
        <p>This section frames change data capture choices in terms of impact, operational cost, and correctness risk. The goal is to make trade-offs explicit so teams can justify why they chose a specific approach.</p>
        <p>For change data capture, the most common failure is an assumption mismatch: the system is designed for one workload but used for another. A simple decision guide reduces that risk by forcing the team to map requirements to design choices.</p>
      </section>
      <section>
        <h2>Change Data Capture Operational Notes</h2>
        <p>Operational success depends on clear ownership, observable signals, and tested recovery paths. Even a correct design for change data capture can fail if operations are not prepared for scale and failures.</p>
        <p>Teams should document the operational thresholds that indicate trouble and the remediation steps that restore stability. These practices turn change data capture from theory into reliable production behavior.</p>
      </section>

      <section>
        <h2>Checklist</h2>
        <p>Use log-based CDC where possible, monitor lag, and manage schema changes carefully.</p>
        <p>Ensure downstream systems handle duplicates and out-of-order changes.</p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>What is the difference between log-based and trigger-based CDC?</p>
        <p>How do you handle schema changes in CDC?</p>
        <p>What are the risks of CDC lag?</p>
        <p>When would polling be sufficient instead of CDC?</p>
      </section>
    </ArticleLayout>
  );
}
