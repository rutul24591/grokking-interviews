"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-advanced-topics-write-ahead-logging",
  title: "Write-Ahead Logging",
  description:
    "Staff-level deep dive into write-ahead logging (WAL): durability guarantees, crash recovery, ARIES algorithm, group commit, fsync strategies, and production-scale patterns.",
  category: "backend",
  subcategory: "advanced-topics",
  slug: "write-ahead-logging",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-08",
  tags: ["backend", "wal", "durability", "crash-recovery", "aries", "fsync"],
  relatedTopics: ["lsm-trees", "data-integrity", "snapshot-isolation", "merkle-trees"],
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
          <strong>Write-Ahead Logging</strong> (WAL) is a durability mechanism used by
          databases and storage engines to ensure that committed transactions survive system
          crashes. The fundamental principle of WAL is that every change to the database is
          first written to a sequential log file (the WAL) before it is applied to the actual
          data files. This ensures that, in the event of a crash, the database can recover
          by replaying the WAL to reconstruct the state of all committed transactions that
          were not yet flushed to the data files.
        </p>
        <p>
          Consider a database that updates a row in a table. Without WAL, if the system
          crashes after the row is updated in memory but before the change is flushed to
          disk, the committed transaction is lost. With WAL, the change is first written
          to the WAL (a sequential append, which is fast), and then applied to the in-memory
          buffer. When the system crashes, the WAL contains a record of the change, and the
          database can replay the WAL during recovery to reconstruct the committed state.
        </p>
        <p>
          For staff/principal engineers, WAL requires understanding the trade-offs between
          durability and performance (fsync on every commit vs. group commit), the ARIES
          recovery algorithm (analysis, redo, undo phases), and the application of WAL in
          modern storage engines (PostgreSQL, MySQL InnoDB, RocksDB, SQLite).
        </p>
        <p>
          The business impact of WAL decisions is significant. WAL ensures durability, which
          is a fundamental requirement for ACID transactions. Incorrect WAL implementation
          (missing fsync, incomplete recovery logic) leads to data loss after crashes.
          Overly aggressive WAL fsync (fsync on every commit) reduces write throughput.
          The right balance depends on the durability requirements and performance targets
          of the application.
        </p>
        <p>
          In system design interviews, WAL demonstrates understanding of durability
          guarantees, crash recovery algorithms, the trade-offs between fsync frequency
          and durability, and the application of WAL in modern database systems.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src={`${BASE_PATH}/wal-write-path.svg`}
          alt="WAL write path showing the sequence: transaction generates change → append to WAL → fsync → apply to buffer pool → checkpoint flushes to data files"
          caption="WAL write path — every change is first appended to the WAL (sequential write), then fsync&apos;ed to disk for durability, then applied to the buffer pool; periodically, a checkpoint flushes dirty pages from the buffer pool to the data files"
        />

        <h3>The Write-Ahead Rule</h3>
        <p>
          The write-ahead rule states that before a modified data page is flushed from the
          buffer pool to the data files, the WAL record for that modification must be flushed
          to the WAL file on disk. This ensures that the WAL always contains a record of every
          modification that has been applied to the buffer pool, enabling recovery in the event
          of a crash.
        </p>
        <p>
          The WAL record contains the transaction ID, the operation type (insert, update,
          delete), the affected page and offset, the old value (for undo), and the new value
          (for redo). The WAL record is written as a sequential append to the WAL file, which
          is significantly faster than the random disk I/O required to update the data file.
        </p>

        <h3>Group Commit</h3>
        <p>
          Group commit is an optimization that reduces the number of fsync operations by
          batching multiple WAL records into a single fsync. Instead of fsync-ing the WAL
          after every transaction commit, the database collects multiple commits over a short
          time window (1-10ms) and fsyncs them all at once. This reduces the number of fsync
          operations by 10-100x, significantly improving write throughput.
        </p>
        <p>
          The trade-off is that group commit introduces a small delay between the transaction
          commit and the fsync (the time window during which commits are collected). During
          this window, the transaction is committed in memory but not yet durable on disk.
          If the system crashes during this window, the committed transaction is lost. For
          most applications, this risk is acceptable (the window is 1-10ms), but for
          applications that require strict durability (financial systems), fsync on every
          commit is required.
        </p>

        <h3>ARIES Recovery Algorithm</h3>
        <p>
          ARIES (Algorithms for Recovery and Isolation Exploiting Semantics) is the standard
          WAL recovery algorithm used by PostgreSQL, MySQL InnoDB, and SQL Server. ARIES
          operates in three phases: <strong>Analysis</strong>: scan the WAL from the last
          checkpoint to identify which transactions were active at the time of the crash.
          <strong>Redo</strong>: replay all WAL records from the last checkpoint to reconstruct
          the state of the database at the time of the crash, including both committed and
          uncommitted transactions. <strong>Undo</strong>: roll back all uncommitted
          transactions by applying the undo information stored in their WAL records.
        </p>
        <p>
          The result of ARIES recovery is a database state that reflects all committed
          transactions and no uncommitted transactions, ensuring durability and atomicity.
          ARIES uses a technique called &quot;steal/no-force&quot; buffer management: the
          buffer pool can &quot;steal&quot; dirty pages to disk (flush pages modified by
          uncommitted transactions) and does not &quot;force&quot; pages to disk on commit
          (committed transactions&apos; pages can remain in the buffer pool). This enables
          high write throughput while ensuring recoverability through the WAL.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/wal-aries-recovery.svg`}
          alt="ARIES recovery algorithm: analysis phase identifies active transactions, redo phase replays all WAL records, undo phase rolls back uncommitted transactions"
          caption="ARIES recovery — Analysis identifies active transactions at crash time, Redo replays all WAL records to reconstruct database state, Undo rolls back uncommitted transactions; the result is a database reflecting all committed transactions"
        />
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture &amp; Flow</h2>

        <h3>WAL in PostgreSQL</h3>
        <p>
          PostgreSQL uses a Write-Ahead Log (WAL) with 16 MB segments. Each WAL record
          contains the transaction ID, operation type, affected block, and old/new values.
          The WAL is written sequentially, with fsync occurring at commit time (or during
          group commit). PostgreSQL&apos;s WAL is used for crash recovery, replication
          (WAL records are streamed to replicas), and point-in-time recovery (WAL archives
          are stored for long-term recovery).
        </p>
        <p>
          PostgreSQL&apos;s checkpoint mechanism periodically flushes dirty pages from the
          buffer pool to the data files and records a checkpoint record in the WAL. The
          checkpoint records the state of the database at that point in time, enabling
          recovery to start from the last checkpoint rather than from the beginning of the
          WAL. This reduces recovery time from O(all WAL records) to O(WAL records since
          last checkpoint).
        </p>

        <h3>WAL in LSM Trees</h3>
        <p>
          LSM tree storage engines (LevelDB, RocksDB) use a WAL to ensure durability of
          memtable writes. When a write arrives, it is first appended to the WAL, then
          inserted into the memtable. The WAL ensures that if the system crashes before the
          memtable is flushed to disk as an SSTable, the writes can be recovered by replaying
          the WAL. When the memtable is flushed to disk, the WAL is deleted and a new WAL
          is created for the new memtable.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/wal-group-commit.svg`}
          alt="Group commit showing multiple transactions collected into a batch, single fsync for all, reducing fsync overhead by 10-100x"
          caption="Group commit — transactions T1-T5 commit within a 5ms window, collected into a batch, single fsync for all WAL records; reduces fsync overhead by 10-100x while maintaining durability for all batched transactions"
        />
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          WAL involves trade-offs between durability and performance. Fsync on every commit
          provides strict durability (every committed transaction is on disk) but limits
          write throughput to the disk&apos;s fsync rate (100-500 fsyncs/second for typical
          disks). Group commit improves write throughput by 10-100x but introduces a small
          risk of data loss (transactions committed within the group commit window are not
          yet on disk).
        </p>
        <p>
          The checkpoint interval involves trade-offs between recovery time and write
          amplification. Frequent checkpoints (every 5 minutes) reduce recovery time (less
          WAL to replay) but increase write amplification (dirty pages are flushed more
          frequently). Infrequent checkpoints (every 30 minutes) reduce write amplification
          but increase recovery time (more WAL to replay).
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Use group commit for most workloads to improve write throughput. Set the group
          commit window to 1-10ms, which provides 10-100x improvement in write throughput
          with a negligible risk of data loss (1-10ms window). For financial systems that
          require strict durability, use fsync on every commit (no group commit).
        </p>
        <p>
          Set the checkpoint interval based on the acceptable recovery time. If the
          acceptable recovery time is 5 minutes, set the checkpoint interval to 5 minutes.
          Monitor recovery time during testing and adjust the checkpoint interval accordingly.
          Avoid setting the checkpoint interval too frequently (every minute), as this
          increases write amplification and reduces write throughput.
        </p>
        <p>
          Monitor WAL generation rate and alert when it exceeds a threshold. High WAL
          generation rate indicates a write-heavy workload, which may require faster disk
          I/O (SSD instead of HDD) or a larger WAL buffer (to accommodate more writes
          between checkpoints). Monitor WAL segment usage and alert when the WAL directory
          is more than 80% full, indicating that checkpoints are falling behind.
        </p>
        <p>
          Archive WAL segments for point-in-time recovery. WAL archives enable recovery
          to any point in time (not just the last backup), which is critical for data
          protection. Store WAL archives in durable, off-site storage (S3, Glacier) and
          retain them for a period based on the regulatory requirements (e.g., 30 days
          for PCI DSS, 7 years for SOX).
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most common pitfall is disabling WAL fsync to improve write performance.
          Without fsync, the WAL is not durable, and committed transactions are lost in
          the event of a crash. This is sometimes done for benchmarking (to measure raw
          write throughput without fsync overhead), but must never be done in production.
          The fix is to use group commit instead of disabling fsync, which improves write
          throughput while maintaining durability.
        </p>
        <p>
          Not monitoring WAL segment usage means you won&apos;t know when checkpoints are
          falling behind. If checkpoints fall behind, WAL segments accumulate, consuming
          disk space. If the disk fills up, the database stops accepting writes. The fix
          is to monitor WAL segment usage and alert when it exceeds 80%, and to ensure
          that the checkpoint interval is set appropriately for the write workload.
        </p>
        <p>
          Not archiving WAL segments means you cannot perform point-in-time recovery.
          Without WAL archives, you can only recover to the last backup (which may be
          hours or days old), losing all data between the last backup and the crash. The
          fix is to archive WAL segments to durable, off-site storage and retain them
          based on regulatory requirements.
        </p>
        <p>
          Assuming WAL provides replication is a misunderstanding. WAL is a durability
          mechanism, not a replication mechanism. While WAL records can be streamed to
          replicas (PostgreSQL streaming replication, MySQL binary log replication), this
          is a separate feature from the WAL itself. The fix is to implement replication
          separately from the WAL, using WAL streaming as the transport mechanism.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>PostgreSQL: WAL for Crash Recovery and Replication</h3>
        <p>
          PostgreSQL uses a Write-Ahead Log (WAL) with 16 MB segments for crash recovery,
          replication, and point-in-time recovery. The WAL is written sequentially, with
          fsync occurring at commit time (or during group commit). PostgreSQL&apos;s WAL
          is streamed to replicas for replication (streaming replication), and archived
          for point-in-time recovery (WAL archiving).
        </p>

        <h3>MySQL InnoDB: Redo Log</h3>
        <p>
          MySQL InnoDB uses a redo log (WAL) with configurable size (default 48 MB,
          recommended 4 GB for production). The redo log is written sequentially, with
          fsync occurring at commit time (controlled by innodb_flush_log_at_trx_commit).
          Setting innodb_flush_log_at_trx_commit = 1 provides strict durability (fsync on
          every commit), while = 2 provides group commit-like behavior (flush to OS cache,
          fsync once per second).
        </p>

        <h3>RocksDB: WAL for Memtable Durability</h3>
        <p>
          RocksDB uses a WAL to ensure durability of memtable writes. Each write is first
          appended to the WAL, then inserted into the memtable. When the memtable is
          flushed to disk as an SSTable, the WAL is deleted and a new WAL is created.
          RocksDB&apos;s WAL supports group commit (multiple writes batched into a single
          fsync) and WAL recycling (pre-allocating WAL segments to reduce allocation
          overhead).
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is write-ahead logging and why is it needed?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Write-ahead logging (WAL) is a durability mechanism that ensures committed
              transactions survive system crashes. Every change to the database is first
              written to a sequential log file (the WAL) before it is applied to the actual
              data files. This ensures that, in the event of a crash, the database can
              recover by replaying the WAL to reconstruct the state of all committed
              transactions.
            </p>
            <p>
              Without WAL, if the system crashes after a change is applied to the buffer
              pool but before it is flushed to the data files, the committed transaction
              is lost. WAL ensures durability by recording every change in a sequential
              log that can be replayed during recovery.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What is the ARIES recovery algorithm?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              ARIES (Algorithms for Recovery and Isolation Exploiting Semantics) is the
              standard WAL recovery algorithm used by PostgreSQL, MySQL InnoDB, and SQL
              Server. ARIES operates in three phases: Analysis (scan the WAL from the
              last checkpoint to identify active transactions at crash time), Redo (replay
              all WAL records to reconstruct the database state at crash time), and Undo
              (roll back uncommitted transactions using undo information in their WAL
              records).
            </p>
            <p>
              The result is a database state that reflects all committed transactions and
              no uncommitted transactions, ensuring durability and atomicity. ARIES uses
              steal/no-force buffer management, enabling high write throughput while
              ensuring recoverability through the WAL.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: What is group commit and when should you use it?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Group commit is an optimization that reduces the number of fsync operations
              by batching multiple WAL records into a single fsync. Instead of fsync-ing
              the WAL after every transaction commit, the database collects multiple commits
              over a short time window (1-10ms) and fsyncs them all at once. This reduces
              the number of fsync operations by 10-100x.
            </p>
            <p>
              Use group commit for most workloads to improve write throughput. The trade-off
              is a small risk of data loss (transactions committed within the group commit
              window are not yet on disk). For financial systems that require strict durability,
              use fsync on every commit (no group commit).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How do checkpoints affect recovery time?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              A checkpoint flushes dirty pages from the buffer pool to the data files and
              records a checkpoint record in the WAL. Recovery starts from the last
              checkpoint, replaying only the WAL records since the checkpoint. Therefore,
              the checkpoint interval determines the amount of WAL to replay during recovery:
              a 5-minute checkpoint interval means at most 5 minutes of WAL to replay, while
              a 30-minute interval means at most 30 minutes of WAL to replay.
            </p>
            <p>
              Frequent checkpoints reduce recovery time but increase write amplification
              (dirty pages are flushed more frequently). Infrequent checkpoints reduce write
              amplification but increase recovery time. Set the checkpoint interval based on
              the acceptable recovery time.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: What is the write-ahead rule?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              The write-ahead rule states that before a modified data page is flushed from
              the buffer pool to the data files, the WAL record for that modification must
              be flushed to the WAL file on disk. This ensures that the WAL always contains
              a record of every modification that has been applied to the buffer pool,
              enabling recovery in the event of a crash.
            </p>
            <p>
              The write-ahead rule is the fundamental guarantee of WAL: the WAL is always
              ahead of the data files, so the WAL can always be used to recover the data
              files to a consistent state.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: How does WAL enable replication?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              WAL records can be streamed to replicas, which replay the WAL records to
              maintain a copy of the primary database. This is the basis of PostgreSQL
              streaming replication and MySQL binary log replication. The replica receives
              WAL records from the primary, applies them to its own database, and stays
              in sync with the primary.
            </p>
            <p>
              WAL-based replication is efficient because WAL records are written sequentially
              (fast) and contain all the information needed to reconstruct the database
              state (complete). The replica can be used for read scaling (serving read
              queries) and disaster recovery (failing over to the replica if the primary
              fails).
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
              href="https://www.cs.cmu.edu/~15445/f16/notes/09-WAL.pdf"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              CMU 15-445: Write-Ahead Logging Lecture Notes
            </a>{" "}
            — Comprehensive overview of WAL theory and implementation.
          </li>
          <li>
            <a
              href="https://www.postgresql.org/docs/current/wal.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              PostgreSQL: Write-Ahead Logging
            </a>{" "}
            — How PostgreSQL implements WAL for crash recovery and replication.
          </li>
          <li>
            <a
              href="https://dev.mysql.com/doc/refman/8.0/en/innodb-redo-log.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MySQL InnoDB: Redo Log
            </a>{" "}
            — How InnoDB implements WAL through the redo log.
          </li>
          <li>
            <a
              href="https://github.com/google/leveldb/blob/master/doc/index.md"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              LevelDB: WAL for Memtable Durability
            </a>{" "}
            — How LevelDB uses WAL for memtable durability.
          </li>
          <li>
            Martin Kleppmann,{" "}
            <em>Designing Data-Intensive Applications</em>, O&apos;Reilly, 2017. Chapter 7
            (Transactions).
          </li>
          <li>
            <a
              href="https://www.cs.umd.edu/~plager/plagar/courses/cmsc424/ARIES.pdf"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              ARIES Paper: Algorithms for Recovery and Isolation Exploiting Semantics
            </a>{" "}
            — The original ARIES recovery algorithm paper.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
