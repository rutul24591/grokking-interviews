"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-advanced-topics-snapshot-isolation",
  title: "Snapshot Isolation",
  description:
    "Staff-level deep dive into snapshot isolation: MVCC, read consistency, write skew anomaly, comparison with serializability, and production-scale transaction isolation patterns.",
  category: "backend",
  subcategory: "advanced-topics",
  slug: "snapshot-isolation",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-08",
  tags: ["backend", "snapshot-isolation", "mvcc", "transactions", "consistency", "database"],
  relatedTopics: ["transaction-isolation-levels", "consistency-models", "write-ahead-logging", "data-integrity"],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/advanced-topics";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Snapshot isolation</strong> (SI) is a transaction isolation level that
          guarantees each transaction reads from a consistent snapshot of the database taken at
          the transaction&apos;s start time. Every transaction sees a consistent view of the
          database as it existed at a specific point in time, regardless of concurrent writes
          by other transactions. Writes performed by a transaction are not visible to other
          transactions until the transaction commits. If two concurrent transactions attempt to
          write to the same data item, one transaction is aborted (first-committer-wins rule).
        </p>
        <p>
          Consider two concurrent transactions: Transaction A reads the account balance ($100),
          and Transaction B also reads the same balance ($100). Transaction A deposits $50
          (balance becomes $150), and Transaction B withdraws $30 (balance becomes $70). Under
          snapshot isolation, both transactions read from the same snapshot ($100), so Transaction
          A&apos;s write (balance = $150) and Transaction B&apos;s write (balance = $70) conflict.
          The first transaction to commit succeeds, and the second transaction is aborted because
          it wrote to a data item that was modified by a concurrent transaction after its snapshot
          was taken.
        </p>
        <p>
          For staff/principal engineers, snapshot isolation requires understanding the trade-offs
          between snapshot isolation and serializability (SI allows the write skew anomaly, while
          serializability does not), the implementation of multi-version concurrency control (MVCC)
          to provide consistent snapshots, and the application of snapshot isolation in distributed
          databases (Spanner, CockroachDB, PostgreSQL&apos;s serializable snapshot isolation).
        </p>
        <p>
          The business impact of snapshot isolation decisions is significant. Snapshot isolation
          provides strong read consistency (no dirty reads, no non-repeatable reads, no phantom
          reads) while allowing higher concurrency than serializability (no read-write conflicts).
          However, it allows the write skew anomaly, which can lead to incorrect results in
          certain applications (e.g., ensuring that at least one doctor is on call).
        </p>
        <p>
          In system design interviews, snapshot isolation demonstrates understanding of
          transaction isolation levels, MVCC implementation, the trade-offs between consistency
          and concurrency, and the application of snapshot isolation in distributed databases.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src={`${BASE_PATH}/snapshot-isolation-mvcc.svg`}
          alt="MVCC implementation of snapshot isolation showing multiple versions of data items with transaction timestamps, read transactions see consistent snapshot, write transactions create new versions"
          caption="MVCC implementation of snapshot isolation — each data item has multiple versions with transaction timestamps, read transactions see the version visible at their snapshot timestamp, write transactions create new versions that become visible only after commit"
        />

        <h3>Multi-Version Concurrency Control</h3>
        <p>
          Snapshot isolation is implemented using multi-version concurrency control (MVCC),
          which maintains multiple versions of each data item. When a transaction reads a data
          item, it reads the version that was committed before the transaction&apos;s snapshot
          timestamp. When a transaction writes to a data item, it creates a new version with its
          own transaction timestamp. The new version is not visible to other transactions until
          the writing transaction commits.
        </p>
        <p>
          MVCC provides consistent snapshots without blocking reads: read transactions do not
          acquire locks on data items, because they read from a consistent snapshot (the version
          visible at their snapshot timestamp). Write transactions create new versions, which do
          not interfere with concurrent reads (reads see the old version, writes create a new
          version). This enables high concurrency: reads and writes can proceed concurrently
          without blocking each other.
        </p>

        <h3>First-Committer-Wins Rule</h3>
        <p>
          When two concurrent transactions attempt to write to the same data item, snapshot
          isolation enforces the first-committer-wins rule: the first transaction to commit
          succeeds, and the second transaction is aborted. This rule prevents lost updates
          (where two transactions overwrite each other&apos;s writes) by ensuring that only one
          transaction&apos;s write to a data item is committed.
        </p>
        <p>
          The first-committer-wins rule is implemented by checking, at commit time, whether any
          data item written by the transaction has been modified by a concurrent transaction that
          committed after the current transaction&apos;s snapshot timestamp. If so, the current
          transaction is aborted and must be retried. This check is efficient because the database
          maintains a write set for each transaction and checks it against the committed write
          sets of concurrent transactions.
        </p>

        <h3>Write Skew Anomaly</h3>
        <p>
          Snapshot isolation allows the write skew anomaly, which occurs when two concurrent
          transactions read overlapping data and make disjoint writes that together violate a
          constraint. For example, consider a constraint that at least one doctor must be on
          call. Transaction A reads that Doctor X and Doctor Y are both on call, and takes
          Doctor X off call. Transaction B reads the same snapshot (both doctors on call), and
          takes Doctor Y off call. Both transactions commit successfully (they wrote to different
          data items), but the constraint (at least one doctor on call) is violated.
        </p>
        <p>
          Write skew is not possible under serializable isolation, because serializable isolation
          requires that the concurrent execution of transactions produces the same result as some
          serial execution. Under serializable isolation, one of the transactions would have seen
          the other transaction&apos;s write and would not have committed. To prevent write skew
          under snapshot isolation, applications must implement explicit constraint checks (e.g.,
          a trigger that ensures at least one doctor is on call) or use serializable snapshot
          isolation (SSI), which extends snapshot isolation with conflict detection for write
          skew.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/snapshot-isolation-write-skew.svg`}
          alt="Write skew anomaly showing two concurrent transactions reading overlapping data, making disjoint writes, and together violating a constraint that neither transaction alone would violate"
          caption="Write skew anomaly — Transaction A reads both doctors on call, takes Doctor X off call; Transaction B reads the same snapshot, takes Doctor Y off call; both commit successfully but the constraint (at least one doctor on call) is violated"
        />
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture &amp; Flow</h2>

        <h3>Snapshot Isolation in PostgreSQL</h3>
        <p>
          PostgreSQL implements snapshot isolation as its default isolation level (called
          &quot;read committed&quot; for statement-level snapshots, and &quot;repeatable read&quot;
          for transaction-level snapshots). Each transaction is assigned a transaction ID (xid)
          at its start time. The transaction&apos;s snapshot includes the set of committed
          transaction IDs at the snapshot time. When the transaction reads a data item, it reads
          the version with the highest xid that is less than or equal to the snapshot&apos;s
          committed xids.
        </p>
        <p>
          When a transaction writes to a data item, PostgreSQL creates a new version of the row
          with the transaction&apos;s xid. The new version is not visible to other transactions
          until the transaction commits. If two concurrent transactions write to the same row,
          the first transaction to commit succeeds, and the second transaction detects the
          conflict at commit time (the row has been modified by a concurrent transaction with
          a higher xid) and is aborted.
        </p>

        <h3>Serializable Snapshot Isolation</h3>
        <p>
          Serializable snapshot isolation (SSI) extends snapshot isolation with conflict detection
          for write skew. SSI tracks read-write dependencies between transactions: if transaction
          A reads a data item that transaction B writes, and transaction B reads a data item that
          transaction A writes, a write skew anomaly is detected, and one of the transactions is
          aborted. SSI provides the same consistency guarantees as serializable isolation while
          maintaining the high concurrency of snapshot isolation (no read-write blocking).
        </p>
        <p>
          SSI is implemented in PostgreSQL as the &quot;serializable&quot; isolation level, and
          in CockroachDB as its default isolation level. SSI has a small performance overhead
          compared to snapshot isolation (tracking read-write dependencies), but provides full
          serializability without the blocking behavior of traditional serializable isolation.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/snapshot-isolation-timeline.svg`}
          alt="Timeline showing snapshot isolation: transactions read from consistent snapshot at start time, writes become visible only after commit, first-committer-wins rule resolves write conflicts"
          caption="Snapshot isolation timeline — Transaction T1 reads from snapshot at t=0, T2 reads from same snapshot at t=1, T1 commits at t=2 (writes visible), T2 commits at t=3 but conflicts with T1&apos;s write and is aborted"
        />
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Snapshot isolation trades full serializability for higher concurrency. Compared to
          serializable isolation, snapshot isolation does not block reads on writes (reads see
          a consistent snapshot instead of waiting for the writing transaction to commit),
          enabling higher read throughput. However, snapshot isolation allows the write skew
          anomaly, which can lead to incorrect results in certain applications.
        </p>
        <p>
          Compared to read committed isolation (the default in many databases), snapshot
          isolation provides stronger read consistency (no non-repeatable reads, no phantom
          reads) because all reads within a transaction see the same snapshot. Read committed
          isolation allows non-repeatable reads (a row read twice within a transaction may
          return different values if another transaction modifies it between the reads) and
          phantom reads (a query run twice within a transaction may return different numbers
          of rows if another transaction inserts or deletes rows between the reads).
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Use snapshot isolation as the default isolation level for most applications. It
          provides strong read consistency (no dirty reads, no non-repeatable reads, no phantom
          reads) while allowing high concurrency (no read-write blocking). Use serializable
          isolation (or serializable snapshot isolation) for applications that require full
          serializability (e.g., financial systems where write skew could lead to incorrect
          results).
        </p>
        <p>
          Implement retry logic for aborted transactions. Under snapshot isolation, concurrent
          write conflicts cause one of the transactions to be aborted. The aborted transaction
          must be retried from the beginning. Implement exponential backoff for retries to
          prevent retry storms (many transactions retrying simultaneously, causing more
          conflicts).
        </p>
        <p>
          Monitor transaction abort rates and alert when they exceed a threshold. High abort
          rates indicate that many transactions are conflicting, which reduces throughput and
          increases latency. The fix is to reduce the transaction size (commit more frequently),
          reduce the contention (partition data to reduce overlapping writes), or use a higher
          isolation level (serializable snapshot isolation) that detects and prevents write
          skew.
        </p>
        <p>
          Be aware of the write skew anomaly and design constraints to prevent it. If your
          application has constraints that span multiple data items (e.g., at least one doctor
          on call, account balance must be non-negative across multiple accounts), implement
          explicit constraint checks (triggers, stored procedures) or use serializable snapshot
          isolation to detect and prevent write skew.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most common pitfall is assuming that snapshot isolation prevents all concurrency
          anomalies. Snapshot isolation prevents dirty reads, non-repeatable reads, and phantom
          reads, but it allows the write skew anomaly. Applications that rely on snapshot
          isolation to prevent all anomalies may produce incorrect results when write skew
          occurs. The fix is to use serializable snapshot isolation (SSI) for applications
          that require full serializability, or implement explicit constraint checks to
          prevent write skew.
        </p>
        <p>
          Not implementing retry logic for aborted transactions causes application failures
          when concurrent write conflicts occur. Under snapshot isolation, write conflicts
          are resolved by aborting one of the transactions, which must be retried. If the
          application does not handle the abort and retry, the transaction fails silently
          and the application loses data. The fix is to implement retry logic with exponential
          backoff for all transactions that may conflict.
        </p>
        <p>
          Long-running transactions cause snapshot retention overhead. The database must
          retain all versions of data items that are visible to any active transaction&apos;s
          snapshot. Long-running transactions prevent the database from garbage-collecting
          old versions, consuming excessive disk space and degrading read performance (reads
          must scan through multiple versions to find the visible version). The fix is to
          keep transactions short (commit frequently) and avoid long-running read-only
          transactions (use a separate read replica for long-running analytical queries).
        </p>
        <p>
          Not monitoring transaction abort rates means you won&apos;t know when concurrent
          write conflicts are reducing throughput. High abort rates indicate that many
          transactions are conflicting, which reduces throughput and increases latency.
          The fix is to instrument transactions with metrics (abort rate, retry count,
          commit latency) and set alerts on abnormal values (abort rate &gt; 10%, retry
          count &gt; 3 per transaction).
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Google Spanner: Serializable Snapshot Isolation</h3>
        <p>
          Google Spanner implements serializable snapshot isolation (SSI) as its default
          isolation level, providing full serializability without the blocking behavior of
          traditional serializable isolation. Spanner uses TrueTime (atomic clocks + GPS
          receivers) to assign globally consistent transaction timestamps, enabling snapshot
          isolation across data centers. Spanner&apos;s SSI implementation detects write skew
          by tracking read-write dependencies between transactions and aborting one of the
          conflicting transactions.
        </p>

        <h3>PostgreSQL: Repeatable Read and Serializable</h3>
        <p>
          PostgreSQL implements snapshot isolation as its &quot;repeatable read&quot; isolation
          level and serializable snapshot isolation as its &quot;serializable&quot; isolation
          level. The repeatable read level provides snapshot isolation (no dirty reads, no
          non-repeatable reads, no phantom reads), while the serializable level adds write
          skew detection to provide full serializability. PostgreSQL&apos;s MVCC implementation
          maintains multiple versions of each row, enabling consistent snapshots without
          blocking reads.
        </p>

        <h3>CockroachDB: Default Serializable Isolation</h3>
        <p>
          CockroachDB uses serializable snapshot isolation as its default isolation level,
          providing full serializability for all transactions. CockroachDB implements SSI using
          a distributed MVCC engine that maintains multiple versions of each row across all
          nodes in the cluster. The SSI implementation tracks read-write dependencies between
          transactions and aborts one of the conflicting transactions when write skew is
          detected.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is snapshot isolation and how does it work?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Snapshot isolation (SI) guarantees that each transaction reads from a consistent
              snapshot of the database taken at the transaction&apos;s start time. Every
              transaction sees a consistent view of the database as it existed at a specific
              point in time, regardless of concurrent writes. Writes are not visible to other
              transactions until the transaction commits.
            </p>
            <p>
              SI is implemented using MVCC (multi-version concurrency control), which maintains
              multiple versions of each data item. When two concurrent transactions write to the
              same data item, the first-committer-wins rule applies: the first to commit succeeds,
              the second is aborted.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What is the write skew anomaly?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Write skew occurs when two concurrent transactions read overlapping data and make
              disjoint writes that together violate a constraint. For example, a constraint
              requires at least one doctor on call. Transaction A takes Doctor X off call,
              Transaction B takes Doctor Y off call. Both read the same snapshot (both on call),
              both write to different data items, both commit, but the constraint is violated.
            </p>
            <p>
              Write skew is not possible under serializable isolation, but is allowed under
              snapshot isolation. To prevent write skew, use serializable snapshot isolation
              (SSI) or implement explicit constraint checks (triggers, stored procedures).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How does MVCC implement snapshot isolation?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              MVCC maintains multiple versions of each data item, each tagged with the
              transaction ID that created it. When a transaction reads, it reads the version
              visible at its snapshot timestamp (the version created by the most recent
              committed transaction before the snapshot). When a transaction writes, it creates
              a new version with its own transaction ID. The new version is not visible to
              other transactions until the writing transaction commits.
            </p>
            <p>
              MVCC provides consistent snapshots without blocking reads: reads see the version
              visible at their snapshot timestamp, and writes create new versions that do not
              interfere with concurrent reads. This enables high concurrency.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: What is the difference between snapshot isolation and serializable isolation?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Snapshot isolation provides strong read consistency (no dirty reads, no
              non-repeatable reads, no phantom reads) but allows the write skew anomaly.
              Serializable isolation provides full serializability (the concurrent execution
              produces the same result as some serial execution), preventing all anomalies
              including write skew.
            </p>
            <p>
              Serializable isolation has lower concurrency than snapshot isolation because it
              blocks reads on writes (or detects read-write conflicts and aborts transactions).
              Serializable snapshot isolation (SSI) provides full serializability with the
              high concurrency of snapshot isolation by tracking read-write dependencies and
              aborting transactions that cause write skew.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: How do you handle transaction aborts under snapshot isolation?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Transaction aborts under snapshot isolation are caused by concurrent write
              conflicts (first-committer-wins rule). The aborted transaction must be retried
              from the beginning. Implement retry logic with exponential backoff: on abort,
              wait for a random delay (e.g., 100ms * 2^retry_count) and retry. Set a maximum
              retry count (e.g., 5) to prevent infinite retry loops.
            </p>
            <p>
              Monitor abort rates and alert when they exceed a threshold. High abort rates
              indicate many concurrent write conflicts, which reduce throughput and increase
              latency. Mitigate by reducing transaction size, partitioning data to reduce
              overlapping writes, or using a higher isolation level.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: What are the performance implications of long-running transactions under snapshot isolation?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Long-running transactions cause snapshot retention overhead. The database must
              retain all versions of data items that are visible to any active transaction&apos;s
              snapshot. This consumes excessive disk space (old versions are not garbage-collected)
              and degrades read performance (reads must scan through multiple versions to find
              the visible version).
            </p>
            <p>
              Mitigate by keeping transactions short (commit frequently) and avoiding long-running
              read-only transactions. For long-running analytical queries, use a separate read
              replica that is not subject to snapshot retention overhead. Monitor the number of
              active snapshots and alert when it exceeds a threshold.
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
              href="https://dl.acm.org/doi/10.1145/203561.203566"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Berenson et al. (1995): A Critique of ANSI SQL Isolation Levels
            </a>{" "}
            — The paper that defines snapshot isolation and its anomalies.
          </li>
          <li>
            <a
              href="https://www.postgresql.org/docs/current/transaction-iso.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              PostgreSQL: Transaction Isolation
            </a>{" "}
            — How PostgreSQL implements snapshot isolation and SSI.
          </li>
          <li>
            <a
              href="https://cloud.google.com/spanner/docs/true-time-external-consistency"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Spanner: Serializable Snapshot Isolation
            </a>{" "}
            — How Spanner implements SSI using TrueTime.
          </li>
          <li>
            <a
              href="https://www.cockroachlabs.com/docs/stable/serialization-levels"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              CockroachDB: Serializable Isolation
            </a>{" "}
            — How CockroachDB uses SSI as its default isolation level.
          </li>
          <li>
            Martin Kleppmann,{" "}
            <em>Designing Data-Intensive Applications</em>, O&apos;Reilly, 2017. Chapter 7
            (Transactions).
          </li>
          <li>
            <a
              href="https://research.microsoft.com/en-us/um/people/adriaan/papers/si.pdf"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cahill et al. (2008): Serializable Isolation for Snapshot Databases
            </a>{" "}
            — The SSI paper describing how to add write skew detection to snapshot isolation.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
