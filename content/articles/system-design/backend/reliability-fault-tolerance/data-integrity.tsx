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
        <p>
          Integrity is often confused with consistency. Consistency describes how replicas converge and what version a read returns. Integrity is about whether the data itself obeys invariants: balances do not go negative, references point to existing entities, and state transitions follow a valid sequence. A system can be strongly consistent and still have broken data if the write logic is wrong. Integrity requires explicit invariants plus enforcement and verification.
        </p>
      </section>

      <section>
        <h2>Integrity Mechanisms</h2>
        <p>Constraints, transactions, and checksums are the foundation. Constraints enforce invariants, transactions ensure atomic changes, and checksums detect corruption.</p>
        <p>Application-level integrity uses validation, idempotency keys, and version checks to prevent duplicate or conflicting writes.</p>
        <p>
          Storage-layer mechanisms include unique constraints, foreign keys, check constraints, and transactional semantics. Application-layer mechanisms include idempotency keys for retryable writes, optimistic concurrency control with version fields, and state-machine validation. In pipelines, integrity means preserving business correctness under retries and replays: deduplicate, watermark, and make derived writes idempotent so that reprocessing does not create double effects.
        </p>
        <ArticleImage src="/diagrams/system-design-concepts/backend/reliability-fault-tolerance/data-integrity-diagram-1.svg" alt="Data Integrity diagram 1" caption="Data Integrity overview diagram 1." />
      </section>

      <section>
        <h2>Integrity Under Failure</h2>
        <p>Failures introduce partial writes and inconsistent replicas. Use write-ahead logs, transactional outbox patterns, and idempotent processing to ensure correct recovery.</p>
        <p>Replication models matter. Synchronous replication improves integrity but reduces availability; asynchronous replication may allow temporary inconsistencies that must be resolved explicitly.</p>
        <p>
          Distributed failures also create &quot;gaps&quot; between systems. A write can commit in the database but fail before emitting an event, leaving downstream read models stale. Patterns like the transactional outbox couple state changes and event emission so that recovery is deterministic: either the state change and the outbox record exist together, or neither does. When replicas lag, align read policies with correctness needs: read-your-writes via primary reads, monotonic reads via session pinning, or quorum reads where supported.
        </p>
      </section>

      <section>
        <h2>Failure Modes</h2>
        <p>The most common integrity failure is silent corruption: data is written incorrectly but appears valid. This often happens during complex migrations or partial rollbacks.</p>
        <p>Another failure is duplicate writes, usually caused by retries without idempotency. Duplicates can lead to inconsistent state across services.</p>
        <p>
          Integrity incidents frequently come from change rather than hardware: schema migrations, backfills, and dual-write cutovers. A backfill job that runs with the wrong join can overwrite correct values at scale. A rollback that restores old code but not old schema can write invalid defaults. Dual-write migrations can diverge if one sink is temporarily down. Treat large data changes as production deployments with canaries, validation queries, and a clear rollback plan.
        </p>
        <ArticleImage src="/diagrams/system-design-concepts/backend/reliability-fault-tolerance/data-integrity-diagram-2.svg" alt="Data Integrity diagram 2" caption="Data Integrity overview diagram 2." />
      </section>

      <section>
        <h2>Operational Playbook</h2>
        <p>Define integrity checks and run them routinely. Use background verification jobs that compare derived data to sources of truth.</p>
        <p>During incidents, freeze risky writes and prioritize repair of corrupted data. Data correctness is often more critical than availability.</p>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4">
          <h3 className="font-semibold">A Practical Integrity Response Loop</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><strong>Scope:</strong> identify the invariant that is broken and the exact datasets affected.</li>
            <li><strong>Contain:</strong> stop the bleeding by pausing writes, pausing consumers, or disabling risky features.</li>
            <li><strong>Repair:</strong> run a corrective backfill, rebuild derived views, or restore to a known-good snapshot depending on blast radius.</li>
            <li><strong>Validate:</strong> use reconciliation queries, sampling, and checksums to prove the repair worked.</li>
            <li><strong>Prevent:</strong> add constraints, tests, and runbooks so the same class of corruption is caught earlier next time.</li>
          </ul>
        </div>
        <p className="mt-4">
          Avoid ad-hoc manual edits as the primary repair tool. Manual changes are hard to audit, easy to get wrong, and often create new inconsistencies. Prefer scripted repairs with clear inputs, outputs, and validation steps.
        </p>
      </section>

      <section>
        <h2>Trade-offs</h2>
        <p>Stronger integrity guarantees increase latency and reduce availability. Some systems accept bounded inconsistency to improve uptime, while others must prioritize correctness.</p>
        <p>Integrity also competes with agility. Strict constraints can slow development but protect against long-term data quality issues.</p>
        <ArticleImage src="/diagrams/system-design-concepts/backend/reliability-fault-tolerance/data-integrity-diagram-3.svg" alt="Data Integrity diagram 3" caption="Data Integrity overview diagram 3." />
      </section>

      <section>
        <h2>Testing and Validation</h2>
        <p>Test integrity by injecting duplicate requests, simulating partial failures, and verifying that invariants hold.</p>
        <p>Use property-based tests for critical invariants and regularly audit production data for anomalies.</p>
        <p>
          Validation should be invariant-first. For each important invariant, create adversarial scenarios: duplicate requests, out-of-order events, partial failures after database commits, and downstream consumer retries. In integration environments, replay production-like change logs into a test system to verify that backfills and reconciliation jobs do not introduce corruption under realistic scale and skew.
        </p>
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
        <p>
          Monitoring should separate &quot;data is wrong&quot; from &quot;data is delayed&quot;. Lag metrics alone do not prove correctness. Add explicit mismatch metrics: sampled comparisons between source-of-truth rows and derived views, invariant violation counters, and alerting when anomalies exceed known baselines. The goal is to catch integrity regressions within minutes or hours, not after support tickets accumulate.
        </p>
      </section>

      <section>
        <h2>Repair and Reconciliation Strategies</h2>
        <p>
          There are three common repair modes. First, a <strong>corrective write</strong> adjusts data in place (for example, recomputing a balance or fixing a foreign key). Second, a <strong>rebuild</strong> recomputes derived data from a source of truth (for example, rebuilding a search index or materialized view). Third, a <strong>restore</strong> rolls back to a known-good snapshot and replays changes. The right choice depends on blast radius, audit requirements, and how confident you are in the correction logic.
        </p>
        <p>
          Repairs should be designed to be safe under retries. Use idempotent repair jobs, store repair versions, and capture audit logs that show what changed and why. A repair that cannot be explained and validated is an integrity risk of its own.
        </p>
      </section>

      <section>
        <h2>Operational Signals to Watch</h2>
        <ul className="space-y-2">
          <li><strong>Invariant violation rate:</strong> unique constraint errors, negative balances, invalid state transitions.</li>
          <li><strong>Mismatch rate:</strong> sampled comparisons between source of truth and derived views.</li>
          <li><strong>Duplicate detection:</strong> idempotency-key collisions and &quot;already processed&quot; counts.</li>
          <li><strong>Reconciliation health:</strong> job backlog, time-to-run, and number of failed checks.</li>
          <li><strong>Replication lag:</strong> used as context, not proof, to explain when a mismatch is staleness vs corruption.</li>
        </ul>
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
