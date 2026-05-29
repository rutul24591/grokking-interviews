"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";

const metadata = {
  id: "article-hld-bulk-data-import-system",
  title: "Design a Bulk Data Import System (CSV/Excel Uploads)",
  description:
    "Principal-level design of a production bulk import pipeline with presigned uploads, async validation, streaming ingestion, idempotency, checkpoints, error reports, and tenant-safe progress tracking.",
  category: "high-level-design",
  subcategory: "data-import-export-systems",
  slug: "bulk-data-import-system",
  wordCount: 5600,
  readingTime: 32,
  lastUpdated: "2026-05-22",
  readTime: "32 min read",
  difficulty: "Advanced",
  tags: ["ETL", "S3", "Async Jobs", "Idempotency", "Bulk Import"],
};

export default function BulkDataImportSystem() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          A bulk data import system lets users upload large CSV, Excel, JSONL, or similar files and ingest rows into product databases safely. It is used for customer onboarding, catalog migration, CRM contact upload, marketplace inventory sync, financial reconciliation, and admin backfills. The system must handle large files, bad rows, retries, partial success, duplicate detection, tenant isolation, and clear user feedback.
        </p>
        <HighlightBlock as="p" tier="crucial">
          The principal-level design constraint is that upload, parsing, validation, transformation, and database writes must be decoupled. A synchronous request that accepts a file and writes rows inline will fail under timeout, memory, retry, and error-reporting pressure.
        </HighlightBlock>
        <p>
          A strong import system treats every import as a durable job. The job has metadata, upload state, validation state, processing checkpoints, progress events, error summaries, audit records, and recovery semantics. Users should be able to leave the page, return later, download an error report, retry fixed rows, or cancel a job that is still queued.
        </p>
        <p>
          Interviewers usually probe idempotency, partial failure, validation strategy, database write amplification, progress accuracy, and security. The design must explain how a worker can restart without duplicating rows and how a tenant cannot import data into another tenant&apos;s scope.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Presigned object-storage upload keeps API servers out of the file data path. The API creates an import job and returns an upload URL. The browser uploads directly to object storage. After upload completion, the client asks the import service to start processing. This avoids API memory pressure and supports large files more reliably.
        </p>
        <p>
          The worker processes the file as a stream. It reads rows in chunks, parses format-specific records, normalizes headers, validates each row, transforms values, and writes valid rows in batches. It should not load the full file into memory. Excel imports may need more careful handling because some parsers are not truly streaming for all workbook features.
        </p>
        <HighlightBlock as="p" tier="important">
          Idempotency is the difference between a reliable import and a dangerous one. Each row needs a stable natural key or deterministic import key, and each batch commit must be checkpointed. Retrying the job should resume from a known committed boundary and should not create duplicate business records.
        </HighlightBlock>
        <p>
          Validation should have two layers. File-level validation checks format, encoding, headers, required columns, size, and tenant ownership. Row-level validation checks types, required fields, enums, ranges, foreign-key existence, deduplication, and business rules. Validation errors should be collected into an error report with row number, column, value summary, rule, and message.
        </p>
        <p>
          Conflict policy must be explicit. Some imports insert only new rows. Some skip duplicates. Some update existing rows. Some merge fields selectively. The import job should record the selected conflict policy because it changes idempotency, audit, and rollback semantics.
        </p>
        <p>
          Progress is approximate but should be useful. For CSV, bytes read can estimate percent. For known row counts, processed rows are better. For Excel, progress can be less precise. The UI should distinguish parsing, validating, writing, finalizing, and error-report generation stages.
        </p>
        <p>
          A principal-level design treats import as a data-contract and trust-boundary problem, not simply a file-upload feature. Every row crossing the import boundary can violate schema constraints, business rules, permission rules, uniqueness constraints, downstream invariants, or compliance policy. The system should separate syntactic validation, semantic validation, authorization validation, and commit-time conflict detection because each layer has different cost and failure behavior.
        </p>
        <p>
          Import UX must reflect those phases. Users need an early preview of detected columns and sample rows, a dry-run result before irreversible writes, a progress model that explains whether the job is parsing, validating, waiting for quota, committing, or rolling back, and an error report that can be corrected and re-uploaded. Without those distinctions, users see a spinner for a long-running operation and cannot tell whether the system is slow, broken, or intentionally blocked.
        </p>
        <p>
          Schema evolution is a principal-level concern. Import templates should be versioned separately from product database schemas because customers may keep old CSV templates for months. The system should define how old templates map to new fields, which defaults are safe, which columns are deprecated, and which migrations require users to download a new template. Otherwise a routine product schema change can silently corrupt future imports or reject files that were valid last quarter.
        </p>
        <p>
          Sensitive data handling must be part of the core model. Uploaded files may contain personal data, payroll fields, financial identifiers, credentials accidentally pasted into notes, or customer-specific secrets. The import job should classify the target entity and file contents where possible, apply encryption and retention policy, restrict raw file access, and make data-deletion obligations explicit. Bulk import is often the easiest way for sensitive data to enter the system at scale.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The architecture has five planes. The upload plane creates jobs and stores files in object storage. The queue plane dispatches work to import workers. The processing plane parses, validates, transforms, and writes rows. The progress plane emits status updates to the UI. The governance plane enforces tenant scope, permissions, quotas, audit, and data-retention policies.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/data-import-export-systems/bulk-data-import-system.svg"
          alt="Bulk data import system architecture with presigned upload, job service, queue, workers, validation, database writes, progress, and error report."
          caption="Bulk import is an asynchronous job pipeline: upload directly to object storage, enqueue processing, stream rows through validation and batch writes, then publish progress and error reports."
        />
        <p>
          The user creates an import with file metadata, target entity, tenant, schema version, and conflict policy. The API validates permission and quota, creates a job in awaiting-upload state, and returns a scoped upload URL. When the upload completes, the client starts the job. A queue message points workers to the job and object-storage key.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/data-import-export-systems/bulk-import-validation-flow.svg"
          alt="Bulk import validation flow with file checks, header mapping, row validation, staging table, batch commit, error report, and partial success."
          caption="Validation separates file-level rejection from row-level errors so a mostly valid million-row file can still import safely with a useful error report."
        />
        <p>
          Workers stream the file and commit in batches. Each batch writes valid rows to staging or directly to target tables depending on safety requirements. Staging gives better validation, deduplication, and rollback control. Direct batch upsert is faster but requires stronger idempotency and careful transaction boundaries.
        </p>
        <p>
          Progress events are written to durable job state and optionally pushed through Server-Sent Events or WebSocket. The UI should survive reconnect by reading job status from the API. When processing ends, the system marks the job completed, partially completed, failed, cancelled, or failed validation. If errors exist, it writes an error report to object storage and exposes a short-lived download link.
        </p>
        <p>
          The architecture should make partial failure explicit. Some imports are all-or-nothing, such as accounting journal entries where every row must balance. Others are best-effort, such as a marketing contact upload where invalid rows can be rejected while valid rows commit. The job definition should carry this policy from the beginning because it changes staging schema, commit strategy, rollback requirements, user messaging, and audit semantics.
        </p>
        <p>
          Header mapping deserves its own flow in mature products. The first pass should detect encoding, delimiter, header row, duplicate columns, empty columns, and likely target fields. The UI can then ask the user to confirm mappings before full processing. For recurring imports, saved mappings should be versioned by template and tenant because a new product schema or renamed customer column can otherwise turn a previously safe mapping into a silent data corruption path.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/data-import-export-systems/bulk-import-retry-idempotency.svg"
          alt="Bulk import retry and idempotency flow with checkpoints, stable row keys, batch commits, restart, dedupe, and dead-letter state."
          caption="Retry safety depends on stable row identity and durable checkpoints; worker restarts should resume without duplicating committed rows."
        />
        <p>
          A mature implementation separates dry-run, staged commit, and finalization. Dry-run validates headers, sample rows, permissions, and estimated impact without mutating target tables. Staged commit writes normalized rows to tenant-scoped staging tables and computes conflicts, warnings, and expected downstream effects. Finalization applies the selected policy to target tables, records import provenance, emits compact downstream events, and transitions the job to a terminal state. This structure makes large imports reviewable before they become irreversible.
        </p>
        <p>
          Error reports should support a retry-fixed-rows workflow rather than forcing users to start over blindly. The report can include the original row number, normalized column name, failed rule, sanitized value, and a stable row identifier. When the user uploads a corrected file, the system can link it to the previous job, skip already successful rows when appropriate, and preserve lineage across attempts. That is much more useful than a generic failed rows CSV disconnected from the original import.
        </p>
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2>
        <p>
          Direct upload through the API is simpler for small files but puts file bytes, timeouts, and memory pressure on API servers. Presigned object-storage upload is more complex but scales better, supports retries, and decouples file transfer from processing.
        </p>
        <p>
          Staging tables add storage and cleanup work but make validation, deduplication, preview, rollback, and audit much safer. Direct writes are faster for trusted internal imports but are risky for user-provided files with unknown quality.
        </p>
        <HighlightBlock as="p" tier="important">
          Partial success is a product decision. Failing the whole file is simpler and transactional, but frustrating when only a few rows are bad. Partial success improves user productivity but requires clear reporting, retry-fixed-rows workflows, and careful consistency semantics.
        </HighlightBlock>
        <p>
          Row-by-row writes provide precise error isolation but create high database write amplification. Batch writes are efficient but make per-row error attribution harder. A common compromise validates rows individually, writes valid rows in batches, and stores per-row errors separately.
        </p>
        <p>
          Synchronous preview gives users immediate feedback about headers and sample rows, but full validation can take minutes. The design should provide quick preflight checks before upload or before processing, then run full validation asynchronously.
        </p>
        <p>
          Allowing users to map arbitrary columns is flexible but error-prone. Strong templates and schema versions reduce mistakes. Enterprise systems often support both: guided templates for common imports and advanced mapping for power users.
        </p>
        <p>
          There is also a consistency trade-off around uniqueness checks. Checking every row against the live primary database before commit gives better user feedback but can be expensive and stale under concurrent writes. Enforcing uniqueness only at commit time is correct but may fail late. The pragmatic approach is to pre-check likely conflicts during validation for helpful feedback, then rely on database constraints or compare-and-swap writes during commit for final correctness.
        </p>
        <p>
          Staging adds storage cost and a second copy of sensitive data, but it enables dry runs, deterministic commit, row-level error reports, and reconciliation. For enterprise-grade imports, staging is usually worth the cost, with strict retention and encryption controls so rejected or expired imports do not become long-lived shadow datasets.
        </p>
        <p>
          Rollback is not always possible and should not be promised casually. If an import updates existing customer records, triggers emails, creates downstream search index updates, or starts fulfillment workflows, a "delete imported rows" rollback may be incomplete or harmful. Safer designs record import provenance on every created or updated row, provide compensating actions where possible, and require preview or dry-run confirmation for high-impact update modes.
        </p>
        <p>
          Upsert policy is another important trade-off. Full replacement is easy to reason about for small scoped datasets, but it can remove data that another workflow created after the file was exported. Merge-by-field preserves more user edits but creates complex conflict semantics. Insert-only is safest but can frustrate migration users. A principal-ready answer should tie the policy to domain invariants rather than presenting one generic import behavior for every entity.
        </p>
        <p>
          Validation timing creates a user-experience and correctness trade-off. Early validation gives fast feedback but can be stale by commit time if related records or uniqueness constraints change. Commit-time validation is authoritative but may surprise users after a long wait. Strong systems do both: preflight for user guidance and commit-time enforcement for correctness, with clear messaging when late conflicts appear.
        </p>
      </section>

      <section>
        <h2>Best practices</h2>
        <p>
          Create the job before upload and persist every state transition. This lets the system recover abandoned uploads, enforce quotas, and give users a stable job page.
        </p>
        <p>
          Stream files and batch writes. Avoid loading full files into memory, avoid one transaction for a million rows, and avoid one database round trip per row.
        </p>
        <p>
          Build for replay and support. Support engineers should be able to view job metadata, schema mapping, validation summary, commit policy, actor, tenant, and artifact retention status without seeing raw sensitive file contents by default. When raw-file access is necessary, it should be time-bounded, audited, and permissioned. This preserves debuggability without turning imports into uncontrolled data exposure.
        </p>
        <p>
          Use deterministic row identity. Prefer tenant-scoped natural keys. If none exist, derive a stable import key from job, row position, and source identity so retries can be deduplicated.
        </p>
        <p>
          Keep validation errors user-actionable. Error reports should identify row, column, failed rule, sanitized value, and remediation guidance. Avoid dumping raw stack traces or sensitive field values.
        </p>
        <p>
          Separate progress from UI connection state. Persist progress in the job record and use push events only as an optimization. Polling should still work after a browser refresh.
        </p>
        <p>
          Audit imports. Record actor, tenant, source file metadata, schema version, conflict policy, row counts, target entity, error report location, and completion status.
        </p>
        <p>
          Protect downstream systems with write shaping. A million valid rows can still overload search indexing, webhooks, analytics events, or cache invalidation. Import workers should use batch sizes, tenant-level throughput limits, and event compaction so one import does not create a thundering herd of downstream side effects. This is often the difference between an import feature that works in isolation and one that behaves safely inside a real product ecosystem.
        </p>
        <p>
          Preserve row-level lineage. Target records created or changed by an import should carry import job id, source row identity, actor, conflict policy, and timestamp where the domain allows it. This lets support answer why a record exists, lets administrators filter by import batch, and enables partial remediation when a customer imported the wrong file. Without lineage, every cleanup becomes a custom database investigation.
        </p>
        <p>
          Make import templates product-owned. Templates should include required fields, optional fields, allowed values, examples, locale expectations, date formats, and schema version. They should be generated from the same validation rules used by the worker, not maintained as static files by a separate team. This keeps the user-facing contract aligned with the actual ingestion behavior.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          A common pitfall is parsing the entire file in the API request. This causes timeouts, memory pressure, and poor retry behavior. Large imports should be asynchronous.
        </p>
        <p>
          Another pitfall is retrying failed workers without idempotency. A crash after committing half a batch can duplicate rows unless checkpoints and stable row keys exist.
        </p>
        <p>
          Teams often underinvest in error reports. If users cannot understand why rows failed, they open support tickets or repeatedly upload broken files.
        </p>
        <p>
          Import paths can bypass normal validation and permission checks. The import worker must enforce the same business rules and tenant scope as normal write APIs, plus any import-specific restrictions.
        </p>
        <p>
          Quotas are often added too late. Without per-tenant limits on file size, row count, concurrent jobs, and write rate, one customer can overload the system.
        </p>
        <p>
          Another pitfall is assuming locale and encoding are minor details. CSV files may contain BOM markers, mixed encodings, localized decimal separators, date formats, quoted newlines, or spreadsheet-generated formulas. If the system silently guesses wrong, it can import plausible but incorrect values. The preview and validation phases should make parsing assumptions visible before commit.
        </p>
        <p>
          Teams also forget that imports can create downstream side effects. A contact import might trigger segmentation, emails, deduplication jobs, audit events, or billing changes. If those effects are not shaped and tied to the import job, a single customer upload can look like organic product activity and overwhelm unrelated systems.
        </p>
      </section>

      <section>
        <h2>Real-world use cases</h2>
        <p>
          CRM and marketing tools import contacts, accounts, opportunities, campaign members, and suppression lists. These flows need deduplication, conflict policies, and row-level error reports.
        </p>
        <p>
          Marketplaces import catalogs, pricing, inventory, and fulfillment metadata. These imports often require upsert semantics and strict tenant ownership.
        </p>
        <p>
          Fintech and accounting systems import transactions, statements, reconciliation files, and vendor data. These require auditability, masking, and conservative partial-success policies.
        </p>
        <p>
          Enterprise admin systems import users, permissions, locations, devices, and organizational hierarchies. Schema templates and preflight validation reduce costly mistakes.
        </p>
        <p>
          B2B SaaS onboarding teams use bulk import to migrate customers from competitors. These migrations often need dry-run validation, saved mappings, support-assisted review, and staged go-live because the imported data becomes the initial source of truth for a large tenant. The architecture should support that operational workflow instead of assuming every upload is self-serve and low risk.
        </p>
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">1. How would you handle a million-row CSV upload?</h3>
        <p>
          I would create a durable import job, upload the file directly to object storage using a scoped upload URL, enqueue processing, and stream the file in a worker. The worker validates rows, writes valid data in batches, records checkpoints, publishes progress, and produces an error report for failed rows.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">2. How do you make imports retry-safe?</h3>
        <p>
          Use stable row identity, idempotent upserts or staging commits, and durable checkpoints after successful batch commits. On restart, the worker reads the last committed boundary and resumes from there. Duplicate rows are detected by tenant-scoped natural keys or deterministic import keys.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">3. Would you fail the whole file or allow partial success?</h3>
        <p>
          It depends on business semantics. For independent records like contacts or products, partial success with a detailed error report is usually better. For transactional or hierarchical data where consistency matters, fail-fast or staged all-or-nothing commit may be safer. The policy should be explicit per import type.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">4. How do you show progress accurately?</h3>
        <p>
          Persist stage, rows processed, bytes read, errors, and estimated total in the job state. Push events can update the UI in real time, but the API must also return current status after refresh. Progress should be stage-aware because parsing, validation, writing, and error-report generation have different durations.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">5. How do you protect the system from abusive imports?</h3>
        <p>
          Enforce file size, row count, schema, tenant, permission, concurrent job, and write-rate quotas before processing. Workers should use bounded memory and batch sizes. Jobs that repeatedly fail or exceed limits should move to a failed or dead-letter state with a clear reason.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">6. What would you monitor?</h3>
        <p>
          Monitor upload completion rate, queue age, processing duration, rows per second, validation failure rate, database write latency, checkpoint lag, worker restarts, retry count, error-report generation failures, and tenant-level quota usage.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li><a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html" target="_blank" rel="noreferrer">AWS S3: Uploading Objects with Presigned URLs</a></li>
          <li><a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html" target="_blank" rel="noreferrer">AWS S3: Multipart Upload Overview</a></li>
          <li><a href="https://www.postgresql.org/docs/current/sql-insert.html" target="_blank" rel="noreferrer">PostgreSQL: Insert and Conflict Handling</a></li>
          <li><a href="https://docs.celeryq.dev/en/stable/userguide/tasks.html" target="_blank" rel="noreferrer">Celery: Task Reliability Concepts</a></li>
          <li><a href="https://docs.nestjs.com/techniques/queues" target="_blank" rel="noreferrer">NestJS: Queues</a></li>
          <li><a href="https://owasp.org/www-project-top-ten/" target="_blank" rel="noreferrer">OWASP Top 10: Access Control and Injection Risks</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
