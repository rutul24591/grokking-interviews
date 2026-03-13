"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-data-integrity-extensive",
  title: "Data Integrity",
  description: "Maintaining correctness and consistency of data across failures and concurrent changes.",
  category: "backend",
  subcategory: "reliability-fault-tolerance",
  slug: "data-integrity",
  wordCount: 600,
  readingTime: 6,
  lastUpdated: "2026-03-13",
  tags: ['backend', 'reliability', 'data'],
  relatedTopics: ['idempotency', 'at-most-once-vs-at-least-once-vs-exactly-once', 'backup-restore'],
};

export default function DataIntegrityConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Scope</h2>
        <p>Data integrity is the assurance that data remains accurate, consistent, and trustworthy throughout its lifecycle. It includes correctness of writes, protection against corruption, and consistent behavior under concurrency and failures.</p>
        <p>Integrity is not only a database concern. It spans validation, application logic, replication, and downstream consumers.</p>
      </section>

      <section>
        <h2>Integrity Mechanisms</h2>
        <p>Constraints, transactions, and checksums are the foundation. Constraints enforce invariants, transactions ensure atomic changes, and checksums detect corruption.</p>
        <p>Application-level integrity uses validation, idempotency keys, and version checks to prevent duplicate or conflicting writes.</p>
        <ArticleImage src="/diagrams/backend/reliability-fault-tolerance/data-integrity-diagram-1.svg" alt="Data Integrity diagram 1" caption="Data Integrity overview diagram 1." />
      </section>

      <section>
        <h2>Integrity Under Failure</h2>
        <p>Failures introduce partial writes and inconsistent replicas. Use write-ahead logs, transactional outbox patterns, and idempotent processing to ensure correct recovery.</p>
        <p>Replication models matter. Synchronous replication improves integrity but reduces availability; asynchronous replication may allow temporary inconsistencies that must be resolved explicitly.</p>
      </section>

      <section>
        <h2>Failure Modes</h2>
        <p>The most common integrity failure is silent corruption: data is written incorrectly but appears valid. This often happens during complex migrations or partial rollbacks.</p>
        <p>Another failure is duplicate writes, usually caused by retries without idempotency. Duplicates can lead to inconsistent state across services.</p>
        <ArticleImage src="/diagrams/backend/reliability-fault-tolerance/data-integrity-diagram-2.svg" alt="Data Integrity diagram 2" caption="Data Integrity overview diagram 2." />
      </section>

      <section>
        <h2>Operational Playbook</h2>
        <p>Define integrity checks and run them routinely. Use background verification jobs that compare derived data to sources of truth.</p>
        <p>During incidents, freeze risky writes and prioritize repair of corrupted data. Data correctness is often more critical than availability.</p>
      </section>

      <section>
        <h2>Trade-offs</h2>
        <p>Stronger integrity guarantees increase latency and reduce availability. Some systems accept bounded inconsistency to improve uptime, while others must prioritize correctness.</p>
        <p>Integrity also competes with agility. Strict constraints can slow development but protect against long-term data quality issues.</p>
        <ArticleImage src="/diagrams/backend/reliability-fault-tolerance/data-integrity-diagram-3.svg" alt="Data Integrity diagram 3" caption="Data Integrity overview diagram 3." />
      </section>

      <section>
        <h2>Testing and Validation</h2>
        <p>Test integrity by injecting duplicate requests, simulating partial failures, and verifying that invariants hold.</p>
        <p>Use property-based tests for critical invariants and regularly audit production data for anomalies.</p>
      </section>

      <section>
        <h2>Scenario: Double-Charge Risk</h2>
        <p>A payments system retries a request after a timeout. Without idempotency, the charge is applied twice. With an idempotency key and transaction semantics, duplicate requests are safely ignored.</p>
        <p>This illustrates how integrity depends on both application logic and storage guarantees.</p>
      </section>

      <section>
        <h2>Integrity in Pipelines</h2>
        <p>Data integrity in pipelines requires exactly-once or effectively-once processing semantics. Use idempotent writes, deduplication keys, and watermarking to avoid double-processing.</p>
        <p>Integrity checks should validate both raw data and derived aggregates. Errors often appear only in derived outputs.</p>
      </section>

      <section>
        <h2>Schema Evolution</h2>
        <p>Schema changes are a common source of integrity failures. Use forward- and backward-compatible changes and validate that all readers can handle both versions.</p>
        <p>A schema registry or contract testing helps catch incompatible changes before they reach production.</p>
      </section>

      <section>
        <h2>Integrity Monitoring</h2>
        <p>Integrity should be monitored with automated reconciliation jobs that compare sources and sinks. Drift between systems is often the first signal of silent corruption.</p>
        <p>Regular reconciliation also helps quantify the real cost of integrity failures and prioritize fixes.</p>
      </section>

      <section>
        <h2>Checklist</h2>
        <p>Define data invariants, enforce them with constraints and transactions, and apply idempotency for retryable operations.</p>
        <p>Run integrity audits and verify replication consistency.</p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>How do you prevent duplicate writes in distributed systems?</p>
        <p>What is the trade-off between strong consistency and availability?</p>
        <p>How do you detect silent data corruption?</p>
        <p>What is the role of application-level validation in integrity?</p>
      </section>
    </ArticleLayout>
  );
}
