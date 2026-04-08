"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-reliability-data-integrity",
  title: "Data Integrity",
  description:
    "Staff-level deep dive into data integrity: constraint enforcement, transactional outbox patterns, reconciliation strategies, optimistic concurrency control, and maintaining correctness under failures.",
  category: "backend",
  subcategory: "reliability-fault-tolerance",
  slug: "data-integrity",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-08",
  tags: [
    "backend",
    "reliability",
    "data-integrity",
    "constraints",
    "reconciliation",
    "concurrency-control",
  ],
  relatedTopics: [
    "idempotency",
    "at-most-once-vs-at-least-once-vs-exactly-once",
    "backup-restore",
    "dead-letter-queues",
  ],
};

const BASE_PATH =
  "/diagrams/system-design-concepts/backend/reliability-fault-tolerance";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Data integrity</strong> is the assurance that data remains accurate, consistent,
          and trustworthy throughout its entire lifecycle. It encompasses correctness of writes,
          protection against corruption, enforcement of business invariants, and consistent behavior
          under concurrency and failures. Data integrity is not a single property but a collection
          of guarantees: that balances cannot go negative, that foreign keys always reference
          existing records, that state transitions follow valid sequences, and that derived data
          remains consistent with its source of truth.
        </p>
        <p>
          Data integrity is often confused with consistency. Consistency describes how replicas
          converge and what version a read returns. Data integrity is about whether the data itself
          obeys invariants: a bank account balance equals the sum of its transactions, a user&apos;s
          email address is unique across the system, an order cannot transition from &quot;shipped&quot;
          back to &quot;pending&quot;. A system can be strongly consistent (all replicas agree) and
          still have broken data integrity if the write logic is wrong or a constraint is missing.
          Integrity requires explicit invariants plus enforcement mechanisms and ongoing verification.
        </p>
        <p>
          For staff/principal engineers, data integrity requires balancing three competing concerns.
          <strong>Enforcement</strong> means preventing invalid data from being written in the first
          place through constraints, transactions, and validation. <strong>Detection</strong> means
          identifying when invalid data has slipped through enforcement via reconciliation jobs,
          anomaly detection, and monitoring. <strong>Repair</strong> means restoring data to a
          correct state when integrity violations are detected through corrective writes, rebuilds,
          or restores from known-good snapshots.
        </p>
        <p>
          The business impact of data integrity decisions is profound and multifaceted. A single
          integrity violation in a financial system can result in incorrect balances, double charges,
          or regulatory violations. In an e-commerce system, integrity violations can cause
          overselling (selling inventory that does not exist), incorrect pricing, or lost orders.
          The cost of detecting and repairing integrity violations after the fact is often orders
          of magnitude higher than preventing them through proper constraint enforcement and
          transactional design.
        </p>
        <p>
          In system design interviews, data integrity demonstrates understanding of database
          internals, distributed system trade-offs, and the relationship between application logic
          and storage guarantees. It shows you understand that correctness is not optional — it
          must be designed into every layer of the system, from database constraints to application
          validation to pipeline processing.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src={`${BASE_PATH}/data-integrity-layers.svg`}
          alt="Data integrity enforcement layers showing database constraints at the storage layer, application validation at the service layer, and reconciliation monitoring at the operational layer"
          caption="Data integrity enforcement spans three layers — database constraints (unique, foreign key, check) prevent invalid writes, application validation (idempotency keys, state machines) ensures correct business logic, and reconciliation monitoring detects violations that slip through"
        />

        <h3>Database Constraints</h3>
        <p>
          Database constraints are the first and most important line of defense for data integrity.
          They enforce invariants at the storage layer, ensuring that no write can violate the
          defined rules regardless of what the application code does. <strong>Unique
          constraints</strong> prevent duplicate values in specified columns, ensuring that
          invariant such as &quot;each user has a unique email address&quot; is enforced
          atomically. <strong>Foreign key constraints</strong> ensure referential integrity: a
          record cannot reference a non-existent record. <strong>Check constraints</strong> enforce
          arbitrary boolean expressions on column values, such as &quot;balance must be
          non-negative&quot; or &quot;status must be one of: pending, confirmed, shipped&quot;.
        </p>
        <p>
          Constraints are preferred over application-level validation because they are enforced
          regardless of the code path that performs the write. A direct SQL update, a migration
          script, or a bug in the application code cannot bypass a database constraint. This
          makes constraints the only truly reliable enforcement mechanism for data integrity.
          Application validation is a convenient early warning system, but constraints are the
          final authority.
        </p>

        <h3>Transactional Guarantees</h3>
        <p>
          Transactions provide atomicity: either all writes in a transaction succeed or none do.
          This prevents partial writes that would leave the database in an inconsistent state. For
          example, when transferring money between accounts, the debit from one account and the
          credit to another must happen atomically. If the credit fails after the debit succeeds,
          the money disappears. Transactions ensure this cannot happen: if either operation fails,
          the entire transaction is rolled back and both accounts remain in their original state.
        </p>
        <p>
          In distributed systems, maintaining transactional guarantees across multiple services is
          more complex. The <strong>transactional outbox pattern</strong> is the standard approach:
          when a service writes to its database, it also writes an event record to an &quot;outbox&quot;
          table in the same database, within the same transaction. A separate process reads the
          outbox table and publishes events to the message broker. This ensures that the database
          write and the event emission are either both committed or both rolled back, eliminating
          the &quot;committed but not published&quot; gap that causes data inconsistency.
        </p>

        <h3>Optimistic Concurrency Control</h3>
        <p>
          Optimistic concurrency control (OCC) prevents lost updates when multiple clients modify
          the same record concurrently. Each record includes a version field (integer or timestamp).
          When a client updates a record, it includes the version it read. The update succeeds only
          if the record&apos;s current version matches the client&apos;s version. If another client
          has modified the record in the meantime, the version has changed and the update is
          rejected. The client must re-read the record and retry.
        </p>
        <p>
          OCC is preferred over pessimistic locking in most web applications because it does not
          hold database locks during the time the client reads and processes the data. It is
          particularly effective for collaborative editing, where conflicts are rare but must be
          handled correctly when they occur. The key insight is that most concurrent updates do
          not actually conflict — they modify different fields — so OCC allows the common case to
          proceed without locks and only rejects the rare conflicting case.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/transactional-outbox-pattern.svg`}
          alt="Transactional outbox pattern showing application writing both business data and event record to database in a single transaction, with a separate outbox processor reading events and publishing to message broker"
          caption="Transactional outbox pattern — write business data and event record in the same database transaction, then a separate processor publishes events to the message broker; eliminates the committed-but-not-published gap"
        />
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture &amp; Flow</h2>

        <h3>Integrity Enforcement Architecture</h3>
        <p>
          A robust data integrity architecture enforces invariants at three layers. At the
          <strong>database layer</strong>, constraints (unique, foreign key, check) prevent invalid
          writes from reaching the database. At the <strong>application layer</strong>, validation,
          idempotency keys, state machine enforcement, and optimistic concurrency control prevent
          invalid writes from being attempted. At the <strong>operational layer</strong>,
          reconciliation jobs, anomaly detection, and integrity monitoring detect violations that
          have slipped through the first two layers.
        </p>
        <p>
          The critical design principle is that each layer serves a different purpose. Database
          constraints are the final authority — they must catch everything. Application validation
          is the user experience layer — it provides fast feedback and prevents wasted round trips.
          Operational monitoring is the safety net — it catches violations that neither constraints
          nor application validation could prevent (e.g., a bug that writes valid-looking but
          semantically incorrect data).
        </p>

        <h3>Integrity Under Failure</h3>
        <p>
          Failures introduce partial writes, inconsistent replicas, and orphaned records. The
          write-ahead log (WAL) ensures that committed transactions can be recovered after a crash:
          the WAL is written before the data pages, so if the database crashes mid-transaction, the
          WAL contains enough information to replay committed transactions and discard uncommitted
          ones during recovery.
        </p>
        <p>
          Replication models affect integrity differently. <strong>Synchronous
          replication</strong> ensures that all replicas have the same data before acknowledging a
          write, providing strong integrity at the cost of higher latency and reduced availability.
          <strong>Asynchronous replication</strong> acknowledges the write after the primary has
          committed but before replicas have received the data, providing lower latency and higher
          availability but allowing temporary inconsistencies. When replicas lag, reads from stale
          replicas may return outdated data that violates invariants (e.g., reading a user&apos;s
          profile from a replica before the email update has replicated).
        </p>

        <h3>Reconciliation Architecture</h3>
        <p>
          Reconciliation is the process of comparing data across systems or within a system to
          detect and repair integrity violations. A reconciliation job reads data from the source
          of truth and compares it to derived data or data in a downstream system. Mismatches are
          logged, alerts are raised, and corrective actions are taken.
        </p>
        <p>
          Reconciliation can be <strong>sample-based</strong> (compare a random sample of records
          for performance) or <strong>exhaustive</strong> (compare all records for completeness).
          Sample-based reconciliation is faster and cheaper but may miss violations. Exhaustive
          reconciliation is slower and more expensive but guarantees detection. The recommended
          approach is to run sample-based reconciliation continuously (every few minutes) and
          exhaustive reconciliation periodically (daily or weekly) to catch what samples miss.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/reconciliation-architecture.svg`}
          alt="Reconciliation architecture showing source of truth, derived data stores, reconciliation job comparing them, mismatch detection, alerting pipeline, and corrective repair flow"
          caption="Reconciliation architecture — continuously compare derived data against source of truth, detect mismatches, alert on anomalies, and run corrective repair jobs to restore integrity"
        />
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Data integrity decisions involve trade-offs between correctness, performance, and
          availability. Stronger integrity guarantees require more coordination, which increases
          latency and reduces availability. Weaker guarantees improve performance but risk data
          corruption that is expensive to detect and repair.
        </p>
        <p>
          The staff-level insight is that not all data requires the same level of integrity
          enforcement. Financial transactions, user identity, and inventory counts require strict
          constraints, transactions, and continuous reconciliation. Metrics, logs, and analytics
          data can tolerate occasional inconsistencies and should not incur the overhead of
          strict enforcement. Classify data by its integrity requirements and apply the appropriate
          level of enforcement to each category.
        </p>
        <p>
          Another important trade-off is enforcement versus detection. Enforcing integrity through
          constraints prevents violations but requires upfront design and can slow development.
          Detecting integrity violations through reconciliation allows faster development but risks
          operating with corrupted data until the next reconciliation run. The best approach is
          both: enforce what you can with constraints, detect what you cannot with reconciliation.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Define data invariants explicitly for every domain model. Document each invariant and the
          mechanism that enforces it (constraint, transaction, application validation). Review
          invariants during code review and schema migration review. Use database constraints as
          the primary enforcement mechanism — they are the only enforcement that cannot be bypassed
          by application bugs, direct SQL updates, or migration scripts.
        </p>
        <p>
          Implement idempotency for all retryable writes. Assign a unique idempotency key to each
          write and use the key to deduplicate retries. This prevents duplicate writes from
          violating integrity when a write is retried after a timeout or network failure.
        </p>
        <p>
          Run continuous reconciliation jobs that compare derived data to its source of truth.
          Alert on mismatches and track the mismatch rate over time. A rising mismatch rate is an
          early warning of integrity degradation. Run exhaustive reconciliation periodically (daily
          or weekly) to catch what sample-based reconciliation misses.
        </p>
        <p>
          Treat schema migrations and data backfills as production deployments. Test migrations
          against production-like data volumes, run them with canary analysis (migrate a small
          subset of data first), and have a clear rollback plan. A bad migration that corrupts data
          at scale is one of the most damaging integrity incidents.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most common pitfall is relying on application-level validation without database
          constraints. Application validation is easily bypassed by bugs, direct SQL updates, or
          migration scripts. Constraints are the only truly reliable enforcement mechanism. The fix
          is to add constraints for every critical invariant, even if application validation already
          covers it.
        </p>
        <p>
          Another common pitfall is duplicate writes caused by retries without idempotency. When a
          write times out and the client retries, the same data is written twice, causing duplicate
          records, double charges, or incorrect aggregates. The fix is to assign a unique
          idempotency key to each write and use the key to deduplicate retries at the database
          level.
        </p>
        <p>
          Silent data corruption is the most dangerous pitfall because it goes undetected.
          Corruption can be caused by buggy migrations, incorrect backfill jobs, or application
          logic errors that write valid-looking but semantically incorrect data. The fix is to
          implement continuous reconciliation that compares derived data to its source of truth and
          alerts on mismatches.
        </p>
        <p>
          Not planning for repair is a common operational pitfall. When integrity violations are
          detected, teams often resort to ad-hoc manual fixes that are hard to audit, easy to get
          wrong, and often create new inconsistencies. The fix is to design repair scripts that are
          idempotent, auditable, and validated against known-good data before execution.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Stripe: Idempotent Payment Processing</h3>
        <p>
          Stripe processes billions of payments and must ensure that no payment is charged twice.
          Each payment request includes a unique idempotency key generated by the client. Stripe
          checks the key against a deduplication store before processing. If the key has been seen
          before, Stripe returns the cached result without reprocessing the payment. This prevents
          duplicate charges even when network timeouts cause clients to retry. Combined with
          database constraints and transactional processing, Stripe ensures that every payment is
          processed exactly once with no data corruption.
        </p>

        <h3>Amazon: Transactional Outbox for Order Processing</h3>
        <p>
          Amazon&apos;s order processing pipeline uses the transactional outbox pattern to ensure
          that order creation and event emission are atomic. When an order is placed, the order
          service writes the order record and an event record to the outbox table in the same
          database transaction. A separate process reads the outbox table and publishes events to
          Kafka. This eliminates the &quot;order committed but event not published&quot; gap that
          would cause downstream services (inventory, shipping, notifications) to miss the order.
        </p>

        <h3>GitHub: Reconciliation for Repository State</h3>
        <p>
          GitHub runs continuous reconciliation jobs that compare repository metadata across its
          distributed systems. The reconciliation detects mismatches between the primary database
          and derived data stores (search indexes, analytics aggregates, permission caches). When
          a mismatch is detected, GitHub alerts the on-call team and runs a corrective repair job.
          The reconciliation system has caught and corrected thousands of subtle integrity
          violations that would have been invisible without continuous verification.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">
              Question 1: What is the difference between data integrity and consistency?
            </h3>
            <p className="text-muted mb-3">
              <strong>Answer:</strong>
            </p>
            <p className="mb-3">
              Consistency describes how replicas converge and what version a read returns. Data
              integrity is about whether the data itself obeys invariants: a bank balance equals
              the sum of its transactions, a user&apos;s email is unique, an order follows valid
              state transitions. A system can be strongly consistent (all replicas agree) and still
              have broken data integrity if the write logic is wrong or a constraint is missing.
            </p>
            <p>
              Integrity requires explicit invariants plus enforcement mechanisms (constraints,
              transactions) and ongoing verification (reconciliation, monitoring).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">
              Question 2: How do you prevent duplicate writes in a distributed system?
            </h3>
            <p className="text-muted mb-3">
              <strong>Answer:</strong>
            </p>
            <p className="mb-3">
              Use idempotency keys. Each write request is assigned a unique key (UUID or
              client-generated). The database checks whether the key has been seen before. If not,
              the write is processed and the key is recorded. If the key has been seen, the cached
              result is returned without reprocessing. This ensures that retries do not cause
              duplicate writes.
            </p>
            <p>
              Additionally, use the transactional outbox pattern to ensure that related writes
              (e.g., database write and event emission) are atomic. This prevents partial writes
              that cause inconsistency between systems.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">
              Question 3: How do you detect silent data corruption?
            </h3>
            <p className="text-muted mb-3">
              <strong>Answer:</strong>
            </p>
            <p className="mb-3">
              Silent data corruption is detected through reconciliation: continuously compare
              derived data against its source of truth. A reconciliation job reads records from
              the primary database, computes the expected derived values, and compares them to the
              actual derived values. Mismatches indicate corruption.
            </p>
            <p>
              Additionally, monitor invariant violation rates (unique constraint errors, negative
              balances, invalid state transitions) and set alerts on abnormal values. Run
              sample-based reconciliation continuously for fast detection and exhaustive
              reconciliation periodically for completeness.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">
              Question 4: What is the transactional outbox pattern and why is it important?
            </h3>
            <p className="text-muted mb-3">
              <strong>Answer:</strong>
            </p>
            <p className="mb-3">
              The transactional outbox pattern ensures atomic writes between a database and a
              message broker. When a service writes business data, it also writes an event record
              to an &quot;outbox&quot; table in the same database, within the same transaction. A
              separate process reads the outbox table and publishes events to the message broker.
            </p>
            <p>
              This eliminates the &quot;committed but not published&quot; gap where a database
              write succeeds but the event emission fails, leaving downstream systems out of sync.
              The outbox ensures that either both the write and the event record exist, or neither
              does.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">
              Question 5: When would you use optimistic concurrency control over pessimistic locking?
            </h3>
            <p className="text-muted mb-3">
              <strong>Answer:</strong>
            </p>
            <p className="mb-3">
              Use optimistic concurrency control (OCC) when concurrent conflicts are rare, which
              is the case for most web applications. OCC allows concurrent reads and writes without
              holding locks, and only rejects conflicting writes that must be retried. This provides
              better throughput and lower latency than pessimistic locking, which blocks concurrent
              writes.
            </p>
            <p>
              Use pessimistic locking when conflicts are frequent or when the cost of a retry is
              unacceptable. OCC requires each record to have a version field and the application to
              handle retry logic when the version has changed.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">
              Question 6: How do you handle a data integrity incident in production?
            </h3>
            <p className="text-muted mb-3">
              <strong>Answer:</strong>
            </p>
            <p className="mb-3">
              First, scope the incident: identify the invariant that is broken, the exact datasets
              affected, and the blast radius. Second, contain: pause writes, pause consumers, or
              disable risky features to prevent further corruption. Third, repair: run a corrective
              backfill, rebuild derived views, or restore from a known-good snapshot depending on
              the blast radius and audit requirements.
            </p>
            <p>
              Fourth, validate: use reconciliation queries, sampling, and checksums to prove the
              repair worked. Fifth, prevent: add constraints, tests, and runbooks so the same
              class of corruption is caught earlier next time. Avoid ad-hoc manual edits as the
              primary repair tool — they are hard to audit and often create new inconsistencies.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References
          ============================================================ */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://docs.aws.amazon.com/whitepapers/latest/database-connectivity-best-practices/data-integrity.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS: Data Integrity Best Practices
            </a>{" "}
            — Comprehensive guide to enforcing data integrity in distributed systems.
          </li>
          <li>
            <a
              href="https://microservices.io/patterns/data/transactional-outbox.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Microservices.io: Transactional Outbox Pattern
            </a>{" "}
            — Ensuring atomic writes between database and message broker.
          </li>
          <li>
            <a
              href="https://www.postgresql.org/docs/current/ddl-constraints.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              PostgreSQL: Constraints
            </a>{" "}
            — Database constraint types and enforcement mechanisms.
          </li>
          <li>
            <a
              href="https://martinfowler.com/articles/patterns-of-distributed-systems/idempotent-receiver.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Martin Fowler: Idempotent Receiver Pattern
            </a>{" "}
            — Handling duplicate messages safely.
          </li>
          <li>
            Martin Kleppmann,{" "}
            <em>Designing Data-Intensive Applications</em>, O&apos;Reilly, 2017. Chapter 7
            (Transactions) and Chapter 12 (Data Integrity).
          </li>
          <li>
            <a
              href="https://stripe.com/docs/api/idempotent_requests"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stripe: Idempotent Requests
            </a>{" "}
            — How Stripe implements idempotency for payment processing.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
