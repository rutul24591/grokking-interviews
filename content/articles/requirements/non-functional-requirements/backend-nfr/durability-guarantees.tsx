"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-durability-guarantees",
  title: "Durability Guarantees",
  description: "Comprehensive guide to data durability — write-ahead logging, replication factors, consistency levels, storage engines, and durability testing for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "durability-guarantees",
  wordCount: 5800,
  readingTime: 25,
  lastUpdated: "2026-04-11",
  tags: ["backend", "nfr", "durability", "wal", "replication", "consistency", "storage"],
  relatedTopics: ["consistency-model", "disaster-recovery-strategy", "data-retention-archival", "high-availability"],
};

export default function DurabilityGuaranteesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Durability</strong> is the guarantee that once a write operation is acknowledged as
          successful, the data will not be lost — even in the event of power failure, disk crash, or
          system crash. Durability is the &quot;D&quot; in ACID (Atomicity, Consistency, Isolation,
          Durability) and is a fundamental requirement for any system that stores critical data —
          financial transactions, user accounts, order records, and audit logs.
        </p>
        <p>
          Durability is achieved through a combination of write-ahead logging (WAL), replication, and
          persistent storage. Write-ahead logging ensures that every write is first recorded in a
          durable log before being applied to the database — if the system crashes after the log write
          but before the database update, the log can be replayed to restore the data. Replication
          ensures that data is stored on multiple nodes — if one node fails, the data is available from
          another node. Persistent storage (SSD, HDD, NVM) ensures that data survives power failures.
        </p>
        <p>
          For staff and principal engineer candidates, durability architecture demonstrates understanding
          of storage internals, the ability to design systems that provide appropriate durability
          guarantees for different data types, and the maturity to balance durability with performance
          (stronger durability guarantees add latency). Interviewers expect you to design durability
          strategies that meet business requirements (zero data loss for financial data, acceptable
          loss for analytics data), implement write-ahead logging and replication correctly, and test
          durability guarantees through failure injection.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Distinction: Durability vs Availability vs Consistency</h3>
          <p>
            <strong>Durability</strong> guarantees that written data is not lost. <strong>Availability</strong> guarantees that the system responds to requests. <strong>Consistency</strong> guarantees that all nodes see the same data.
          </p>
          <p className="mt-3">
            A system can be available but not durable (responds to reads but loses writes on crash), durable but not available (data is safe but system is offline for maintenance), or consistent but not durable (all nodes agree on data but the data is lost on crash). Durability is independent of availability and consistency — it is specifically about data persistence.
          </p>
        </div>

        <p>
          Durability guarantees vary by data type — financial transactions require zero data loss
          (synchronous replication to multiple nodes with WAL), while analytics data can tolerate
          some data loss (asynchronous replication with periodic WAL flushes). The durability strategy
          should be chosen based on the business impact of data loss, not on a one-size-fits-all
          approach.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          Understanding durability requires grasping several foundational concepts about write-ahead
          logging, replication factors, consistency levels, and storage engines.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Write-Ahead Logging (WAL)</h3>
        <p>
          Write-ahead logging is the primary mechanism for durability in database systems. Before a
          write is applied to the database, it is first written to a sequential log file (the WAL).
          The WAL is flushed to durable storage (fsync), and only after the fsync completes is the
          write acknowledged to the client. The database then applies the write to its data structures
          (B-tree, LSM-tree, hash table) asynchronously. If the system crashes after the WAL write but
          before the database update, the WAL is replayed during recovery to restore the data.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Replication Factor and Consistency Levels</h3>
        <p>
          Replication factor (RF) determines how many copies of data are stored across nodes. RF=3
          means data is stored on 3 nodes — the system can tolerate 2 node failures without data loss.
          Consistency level determines how many replicas must acknowledge a write before it is
          considered successful. Consistency level ONE means one replica must acknowledge (fastest,
          but risk of data loss if that replica fails). Consistency level QUORUM means a majority of
          replicas must acknowledge (balanced durability and performance). Consistency level ALL means
          all replicas must acknowledge (strongest durability, slowest performance).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Storage Engine Durability</h3>
        <p>
          Storage engines provide durability through different mechanisms. B-tree based engines
          (InnoDB, PostgreSQL) use WAL + checkpointing — writes are logged, then periodically flushed
          to the data files (checkpoint). LSM-tree based engines (RocksDB, Cassandra) use memtables +
          SSTables — writes go to an in-memory memtable, which is periodically flushed to disk as an
          SSTable. Both approaches provide durability through the WAL/memtable, but have different
          performance characteristics — B-trees are better for random reads, LSM-trees are better for
          write throughput.
        </p>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Durability architecture spans write-ahead logging, replication mechanisms, consistency level
          selection, storage engine configuration, and durability testing.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/durability-guarantees.svg"
          alt="Durability Guarantees Architecture"
          caption="Durability Architecture — showing WAL, replication, consistency levels, and storage engines"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Write Path with Durability</h3>
        <p>
          When a client writes data, the write is first appended to the WAL (sequential write, fast).
          The WAL is flushed to durable storage (fsync, slower — this is the durability boundary).
          After the fsync completes, the write is acknowledged to the client. The database then applies
          the write to its data structures asynchronously (B-tree update, memtable insert). If the
          system crashes between the WAL flush and the data structure update, recovery replays the WAL
          to restore the data. If the system crashes before the WAL flush, the write is lost — but the
          client was not acknowledged, so it will retry.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Replication and Durability</h3>
        <p>
          Replication provides durability against node failures — if one node fails, the data is
          available from other replicas. Synchronous replication (write is not acknowledged until all
          replicas have written) provides the strongest durability but adds latency proportional to the
          slowest replica. Asynchronous replication (write is acknowledged after the primary writes,
          replicas catch up asynchronously) provides weaker durability (data may be lost if the primary
          fails before replication) but lower latency. Most systems use a hybrid approach — synchronous
          replication within the same data center (low latency) and asynchronous replication across
          data centers (higher latency but cross-region durability).
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/durability-deep-dive.svg"
          alt="Durability Deep Dive"
          caption="Durability Deep Dive — showing write path, recovery process, and replication durability"
        />

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/wal-replication-backup.svg"
          alt="WAL, Replication, and Backup Layers"
          caption="Durability Layers — WAL for crash recovery, replication for node failures, backup for disaster recovery"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-Offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Consistency Level</th>
              <th className="p-3 text-left">Durability</th>
              <th className="p-3 text-left">Latency</th>
              <th className="p-3 text-left">Best For</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>ONE</strong></td>
              <td className="p-3">Weakest (one replica)</td>
              <td className="p-3">Lowest</td>
              <td className="p-3">Analytics, logging, non-critical data</td>
            </tr>
            <tr>
              <td className="p-3"><strong>QUORUM</strong></td>
              <td className="p-3">Strong (majority of replicas)</td>
              <td className="p-3">Moderate</td>
              <td className="p-3">User data, orders, most application data</td>
            </tr>
            <tr>
              <td className="p-3"><strong>ALL</strong></td>
              <td className="p-3">Strongest (all replicas)</td>
              <td className="p-3">Highest</td>
              <td className="p-3">Financial transactions, critical config</td>
            </tr>
            <tr>
              <td className="p-3"><strong>LOCAL_QUORUM</strong></td>
              <td className="p-3">Strong within DC</td>
              <td className="p-3">Low (same DC)</td>
              <td className="p-3">Multi-region with local durability</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Match Durability to Data Criticality</h3>
        <p>
          Not all data requires the same durability guarantee. Financial transactions require zero data
          loss — use synchronous replication with WAL fsync and QUORUM or ALL consistency level. User
          session data can tolerate some data loss — use asynchronous replication with periodic WAL
          flushes and ONE consistency level. Analytics data can be regenerated from source data — use
          asynchronous replication with no WAL fsync and ONE consistency level. Matching durability
          to data criticality optimizes performance for non-critical writes while ensuring critical
          writes are fully protected.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Use Write-Ahead Logging with Proper Fsync</h3>
        <p>
          Write-ahead logging is only durable if the WAL is flushed to durable storage (fsync) before
          the write is acknowledged. Many databases offer configurable fsync frequency — fsync on every
          write (strongest durability, highest latency), fsync every N seconds (weaker durability,
          lower latency), or no fsync (no durability, lowest latency). Use fsync on every write for
          critical data, and fsync every second for non-critical data. Never disable fsync for data
          that cannot be regenerated.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Test Durability Through Failure Injection</h3>
        <p>
          Durability guarantees must be validated through failure injection — simulate disk failures,
          node crashes, and network partitions to verify that data is not lost. Chaos engineering tools
          (Chaos Monkey, Chaos Gorilla) can inject failures automatically. Test durability by writing
          data, injecting a failure (kill the primary node, corrupt the disk), and verifying that the
          data is available from replicas or recoverable from the WAL. Test recovery by restoring from
          WAL after a crash and verifying that all acknowledged writes are present.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitor Replication Lag</h3>
        <p>
          Replication lag is the time between a write being acknowledged on the primary and being
          replicated to replicas. High replication lag increases the risk of data loss — if the primary
          fails before replication completes, the write is lost. Monitor replication lag continuously
          and alert when it exceeds acceptable thresholds (e.g., 1 second for synchronous replication,
          10 seconds for asynchronous replication). If replication lag consistently exceeds thresholds,
          investigate the root cause (network issues, overloaded replicas, slow disks) and remediate.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Assuming Durability Without Fsync</h3>
        <p>
          Many databases buffer writes in memory before flushing to disk — if the system crashes before
          the flush, buffered writes are lost. Assuming that a write is durable because it was
          acknowledged, without verifying that the acknowledgment occurs after fsync, is a common and
          dangerous pitfall. Verify the database&apos;s durability guarantees — check the configuration
          to ensure that fsync is enabled and that acknowledgments occur after fsync. Test durability
          by writing data, crashing the system, and verifying that the data is present after recovery.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Ignoring Single Points of Failure in Replication</h3>
        <p>
          Replication provides durability against node failures, but if all replicas share a single
          point of failure (same rack, same power supply, same network switch), a single failure can
          take down all replicas simultaneously. Distribute replicas across failure domains (different
          racks, availability zones, or regions) to ensure that a single failure does not take down
          all replicas. A replication factor of 3 with all replicas in the same availability zone
          provides no durability against availability zone failures.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Over-Replicating for Non-Critical Data</h3>
        <p>
          Replicating all data with RF=3 and ALL consistency level provides maximum durability but at
          significant performance cost — every write must be acknowledged by all 3 replicas, adding
          latency proportional to the slowest replica. For non-critical data (logs, analytics, cache
          data), this durability is unnecessary and wasteful. Use lower replication factors and
          consistency levels for non-critical data to optimize performance and cost.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Not Testing Recovery from WAL</h3>
        <p>
          Write-ahead logging provides durability through crash recovery — the WAL is replayed to
          restore data that was acknowledged but not yet applied to the database. If WAL recovery is
          not tested, there is no guarantee that it will work when needed — the WAL may be corrupted,
          the recovery process may have bugs, or the recovery may take longer than expected. Test WAL
          recovery regularly by simulating crashes and verifying that all acknowledged writes are
          present after recovery.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">PostgreSQL — WAL-Based Durability</h3>
        <p>
          PostgreSQL uses write-ahead logging for durability — every write is first written to the WAL,
          which is flushed to disk (fsync) before the write is acknowledged. The WAL is sequential
          (fast writes), while the database update is asynchronous (B-tree update). If PostgreSQL
          crashes, recovery replays the WAL to restore all acknowledged writes. PostgreSQL&apos;s
          synchronous_commit configuration controls the durability guarantee — on (default) means fsync
          before acknowledgment (zero data loss), off means fsync after acknowledgment (lower latency,
          potential data loss on crash).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cassandra — Tunable Durability</h3>
        <p>
          Cassandra provides tunable durability through configurable consistency levels and commit log
          settings. The commit log (Cassandra&apos;s WAL) is flushed to disk periodically — data between
          flushes may be lost on crash. Consistency level determines how many replicas must acknowledge
          a write — ONE means one replica acknowledges (fastest, risk of data loss if that replica
          fails), QUORUM means majority acknowledges (balanced), ALL means all replicas acknowledge
          (strongest durability, slowest). Cassandra&apos;s tunable durability allows applications to
          choose the appropriate durability guarantee for each data type.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">MongoDB — Journal-Based Durability</h3>
        <p>
          MongoDB uses a journal (similar to WAL) for durability — every write is first written to the
          journal, which is flushed to disk every 100ms. If MongoDB crashes, the journal is replayed
          to restore all writes since the last checkpoint. MongoDB&apos;s write concern controls the
          durability guarantee — w:1 means the primary acknowledges (fastest, risk of data loss if
          primary fails before replication), w:majority means majority of replicas acknowledge
          (balanced), w:all means all replicas acknowledge (strongest durability). MongoDB&apos;s
          journal + write concern provides configurable durability from fast (potential data loss) to
          strong (zero data loss).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Redis — AOF and RDB Durability</h3>
        <p>
          Redis provides two durability mechanisms — RDB snapshots (periodic point-in-time snapshots)
          and AOF (append-only file, similar to WAL). RDB snapshots provide weak durability — data
          between snapshots is lost on crash, but snapshots are fast and compact. AOF provides strong
          durability — every write is appended to the AOF and can be synced to disk every write
          (always, slowest), every second (everysec, balanced), or never (no, fastest). Redis users
          typically use AOF with everysec for a balance of durability and performance — at most 1
          second of data loss on crash.
        </p>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>
        <p>
          Durability mechanisms involve security risks — WAL files and replicas contain copies of all data, including sensitive data, and must be protected accordingly.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">WAL and Replica Security</h3>
          <ul className="space-y-2">
            <li>
              <strong>WAL File Protection:</strong> WAL files contain all writes, including sensitive data. If WAL files are not encrypted, they can be read by anyone with file system access. Mitigation: encrypt WAL files at rest, restrict WAL file access to database processes only, include WAL files in backup encryption.
            </li>
            <li>
              <strong>Replica Access Control:</strong> Replicas contain copies of all data and must have the same access controls as the primary. Mitigation: apply the same authentication and authorization controls to replicas as the primary, monitor replica access patterns, include replicas in security audits.
            </li>
            <li>
              <strong>Durability vs Privacy:</strong> Strong durability guarantees (synchronous replication, WAL fsync) may conflict with privacy requirements (right to erasure). Mitigation: implement cryptographic erasure for replicated data (encrypt with per-record key, delete key to erase), ensure that WAL entries for erased data are also purged or encrypted.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 9: Testing Strategies */}
      <section>
        <h2>Testing Strategies</h2>
        <p>
          Durability guarantees must be validated through systematic testing — crash recovery, replication failure, and data loss scenarios must all be tested.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Durability Testing</h3>
          <ul className="space-y-2">
            <li>
              <strong>Crash Recovery Test:</strong> Write data, crash the database (kill -9), restart, and verify that all acknowledged writes are present. Test with different crash scenarios (power failure simulation, disk full, OOM kill) to verify recovery under different conditions.
            </li>
            <li>
              <strong>Replication Failure Test:</strong> Write data with QUORUM consistency, kill one replica, and verify that writes continue to succeed (remaining replicas form quorum). Kill a second replica and verify that writes fail (quorum lost). Restore replicas and verify that they catch up with missed writes.
            </li>
            <li>
              <strong>Data Loss Simulation:</strong> Write data, simulate data loss (delete data files, corrupt disk), and verify that data is recovered from WAL or replicas. Measure recovery time and verify that no acknowledged writes are lost.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Durability Readiness Checklist</h3>
          <ul className="space-y-2">
            <li>✓ Write-ahead logging enabled with fsync before acknowledgment</li>
            <li>✓ Replication factor configured (RF=3 minimum for critical data)</li>
            <li>✓ Consistency level matched to data criticality (QUORUM for critical, ONE for non-critical)</li>
            <li>✓ Replicas distributed across failure domains (different AZs, racks)</li>
            <li>✓ Replication lag monitored with alerts when threshold exceeded</li>
            <li>✓ Crash recovery tested quarterly (write, crash, recover, verify)</li>
            <li>✓ WAL files encrypted at rest and access restricted</li>
            <li>✓ Backup strategy aligned with durability requirements</li>
            <li>✓ Cryptographic erasure implemented for GDPR-compliant deletion</li>
            <li>✓ Durability guarantees documented and communicated to application teams</li>
          </ul>
        </div>
      </section>

      {/* Section 10: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://www.postgresql.org/docs/current/wal.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              PostgreSQL — Write-Ahead Logging
            </a>
          </li>
          <li>
            <a href="https://cassandra.apache.org/doc/latest/cassandra/operating/client.html#consistency-levels" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Cassandra — Consistency Levels and Durability
            </a>
          </li>
          <li>
            <a href="https://www.mongodb.com/docs/manual/core/journaling/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MongoDB — Journaling and Durability
            </a>
          </li>
          <li>
            <a href="https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Redis — Persistence Options (RDB and AOF)
            </a>
          </li>
          <li>
            <a href="https://www.usenix.org/legacy/publications/library/proceedings/usenix03/freenix03/full_papers/thekkath/thekkath_html/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              USENIX — The Value of Write-Ahead Logging
            </a>
          </li>
          <li>
            <a href="https://dataintensive.net/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Designing Data-Intensive Applications — Chapter 7: Durability
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
