"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-durability-guarantees-extensive",
  title: "Durability Guarantees",
  description: "Comprehensive guide to data durability guarantees, covering WAL, replication, backup strategies, RPO, fsync, and data persistence patterns for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "durability-guarantees",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-16",
  tags: ["backend", "nfr", "durability", "wal", "replication", "backup", "data-persistence"],
  relatedTopics: ["high-availability", "consistency-model", "disaster-recovery", "database-selection"],
};

export default function DurabilityGuaranteesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Durability</strong> is the guarantee that once a write is acknowledged, the data will persist
          even in the event of system failures (power loss, crashes, disk failures). It is the &quot;D&quot; in
          ACID properties.
        </p>
        <p>
          Durability is measured by <strong>RPO (Recovery Point Objective)</strong> — the maximum acceptable
          data loss measured in time. An RPO of 0 means no data loss is acceptable.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Durability vs Availability</h3>
          <p>
            Stronger durability guarantees often reduce availability and increase latency. Writing to multiple
            replicas before acknowledging ensures durability but adds latency. Understanding this trade-off is
            critical for system design.
          </p>
        </div>

        <p>
          <strong>Why durability matters:</strong>
        </p>
        <ul>
          <li>
            <strong>Financial data:</strong> Lost transactions mean direct financial loss.
          </li>
          <li>
            <strong>User trust:</strong> Data loss erodes user confidence permanently.
          </li>
          <li>
            <strong>Compliance:</strong> Regulations (GDPR, SOX) require data retention guarantees.
          </li>
          <li>
            <strong>Business continuity:</strong> Data loss can halt business operations.
          </li>
        </ul>
      </section>

      <section>
        <h2>Durability Mechanisms</h2>
        <ArticleImage
          src="/diagrams/backend-nfr/durability-guarantees.svg"
          alt="Durability Guarantees"
          caption="Durability Guarantees — showing write path through WAL, replication strategies, and durability levels from memory-only to geo-replicated"
        />
        <p>
          Multiple mechanisms provide durability at different levels:
        </p>
      </section>

      <section>
        <h2>Durability Deep Dive</h2>
        <ArticleImage
          src="/diagrams/backend-nfr/durability-deep-dive.svg"
          alt="Durability Deep Dive"
          caption="Durability Deep Dive — showing Write-Ahead Logging flow, replication for durability, backup strategies"
        />
        <p>
          Advanced durability concepts:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Write-Ahead Logging (WAL)</h3>
        <p>
          <strong>WAL</strong> ensures durability by writing changes to a sequential log before applying them
          to the main data structure. If the system crashes, the log can be replayed to recover.
        </p>
        <p>
          <strong>How it works:</strong>
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Write is received.</li>
          <li>Change is appended to WAL (sequential write, fast).</li>
          <li>WAL is flushed to durable storage (fsync).</li>
          <li>Write is acknowledged to client.</li>
          <li>Change is applied to main data structure (can be delayed).</li>
        </ol>
        <p>
          <strong>Examples:</strong> PostgreSQL, MySQL InnoDB, Oracle, Kafka.
        </p>
        <p>
          <strong>Trade-offs:</strong>
        </p>
        <ul>
          <li>✓ Fast sequential writes.</li>
          <li>✓ Crash recovery from log.</li>
          <li>✗ Fsync overhead (can be batched).</li>
          <li>✗ Log growth requires management (checkpointing, archiving).</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Replication</h3>
        <p>
          <strong>Replication</strong> provides durability by storing copies of data on multiple nodes.
          Even if one node fails, data survives on others.
        </p>
        <p>
          <strong>Synchronous replication:</strong> Write is acknowledged only after all replicas confirm.
          Provides strongest durability (RPO = 0) but highest latency.
        </p>
        <p>
          <strong>Asynchronous replication:</strong> Write is acknowledged immediately, replicated later.
          Lower latency but risk of data loss if primary fails before replication (RPO &gt; 0).
        </p>
        <p>
          <strong>Quorum writes:</strong> Write to W of N replicas before acknowledging. Balances durability
          and latency.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">fsync and Durability</h3>
        <p>
          <strong>fsync</strong> forces the operating system to flush buffered data to durable storage.
          Without fsync, data may be lost on power failure even after write returns.
        </p>
        <p>
          <strong>fsync strategies:</strong>
        </p>
        <ul>
          <li>
            <strong>fsync per write:</strong> Maximum durability, highest latency (100+ fsyncs/second difficult).
          </li>
          <li>
            <strong>Batched fsync:</strong> fsync every N writes or T milliseconds. Reduces overhead, small
            window of potential loss.
          </li>
          <li>
            <strong>Group commit:</strong> Multiple transactions commit together, single fsync. Common in
            databases.
          </li>
        </ul>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Durability Levels</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Level</th>
                <th className="p-2 text-left">Mechanism</th>
                <th className="p-2 text-left">RPO</th>
                <th className="p-2 text-left">Latency Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Memory only</td>
                <td className="p-2">RAM</td>
                <td className="p-2">All data on crash</td>
                <td className="p-2">Lowest</td>
              </tr>
              <tr>
                <td className="p-2">Local disk</td>
                <td className="p-2">WAL + fsync</td>
                <td className="p-2">~0 (single node)</td>
                <td className="p-2">Medium</td>
              </tr>
              <tr>
                <td className="p-2">Sync replication</td>
                <td className="p-2">2+ nodes, sync</td>
                <td className="p-2">0</td>
                <td className="p-2">High</td>
              </tr>
              <tr>
                <td className="p-2">Geo-replication</td>
                <td className="p-2">Multiple regions</td>
                <td className="p-2">0</td>
                <td className="p-2">Very high</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Backup Strategies</h2>
        <p>
          Backups provide durability against catastrophic failures (datacenter loss, corruption, accidental
          deletion).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Backup Types</h3>
        <p>
          <strong>Full backup:</strong> Complete copy of all data. Slow to create, fast to restore.
        </p>
        <p>
          <strong>Incremental backup:</strong> Only changes since last backup. Fast to create, slower to
          restore (need full + all incrementals).
        </p>
        <p>
          <strong>Differential backup:</strong> Changes since last full backup. Medium speed for both.
        </p>
        <p>
          <strong>Continuous backup:</strong> WAL archiving provides point-in-time recovery.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Backup Testing</h3>
        <p>
          Backups are useless without regular restore testing:
        </p>
        <ul>
          <li>Test restore procedures quarterly.</li>
          <li>Measure restore time (affects RTO).</li>
          <li>Verify data integrity after restore.</li>
          <li>Document and automate restore procedures.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">3-2-1 Backup Rule</h3>
        <p>
          For critical data:
        </p>
        <ul>
          <li><strong>3</strong> copies of data (primary + 2 backups).</li>
          <li><strong>2</strong> different storage media.</li>
          <li><strong>1</strong> copy offsite (different geographic location).</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              1. Design a payment system that cannot lose any transactions (RPO = 0). What durability mechanisms do you implement?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Write-Ahead Logging:</strong> All transactions written to WAL before acknowledgment. Use fsync to ensure durability.</li>
                <li><strong>Synchronous replication:</strong> Replicate to 2+ replicas synchronously. RPO = 0 (zero data loss).</li>
                <li><strong>Two-phase commit:</strong> For distributed transactions, use 2PC to ensure atomicity across services.</li>
                <li><strong>Idempotency:</strong> Use idempotency keys to prevent duplicate charges on retry.</li>
                <li><strong>Audit trail:</strong> Log all transaction state changes for reconciliation and debugging.</li>
                <li><strong>Backup strategy:</strong> Continuous WAL archiving + daily full backups. Point-in-time recovery capability.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              2. Explain Write-Ahead Logging. Why is it faster than writing directly to the data file?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>WAL principle:</strong> Write changes to sequential log first, then apply to data files asynchronously.</li>
                <li><strong>Why faster:</strong> (1) Sequential writes are 100× faster than random writes. (2) Single fsync for multiple transactions (group commit). (3) Data file writes can be delayed/batched.</li>
                <li><strong>Crash recovery:</strong> On restart, replay WAL from last checkpoint. Redo committed transactions, undo uncommitted.</li>
                <li><strong>Example:</strong> PostgreSQL WAL, MySQL InnoDB redo log, Oracle redo log all use this pattern.</li>
                <li><strong>Trade-off:</strong> WAL adds write overhead (must write twice) but provides durability with better performance than direct random writes.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              3. Your database is configured with synchronous replication to 2 replicas. What happens if one replica fails? What if both fail?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>One replica fails:</strong> Primary continues with remaining replica. System remains available with RPO = 0. Alert on replica failure.</li>
                <li><strong>Both replicas fail:</strong> Primary cannot commit writes (waiting for acknowledgment). System becomes read-only. Alert immediately.</li>
                <li><strong>Automatic failover:</strong> If primary fails, one replica promoted to primary. Requires consensus (Raft/Paxos) to prevent split-brain.</li>
                <li><strong>Configuration:</strong> Use synchronous_commit = remote_apply (PostgreSQL) or semi-sync (MySQL) for balance of durability and availability.</li>
                <li><strong>Best practice:</strong> Minimum 3 nodes for synchronous replication (can tolerate 1 failure). Use async for distant replicas.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              4. Design a backup strategy for a 10 TB database that needs RPO of 1 hour and RTO of 4 hours.
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>RPO = 1 hour:</strong> Continuous WAL archiving (every 5-10 minutes). Can recover to any point within last hour.</li>
                <li><strong>RTO = 4 hours:</strong> Full backup restore + WAL replay must complete within 4 hours.</li>
                <li><strong>Full backups:</strong> Weekly full backup to S3 (compressed, ~2 TB). Takes 4-6 hours. Stored for 4 weeks.</li>
                <li><strong>Incremental backups:</strong> Daily incremental backup (~200 GB). Faster, less storage.</li>
                <li><strong>Recovery process:</strong> (1) Restore latest full backup (2-3 hours). (2) Apply incremental backups (30 min). (3) Replay WAL to target time (30 min).</li>
                <li><strong>Testing:</strong> Monthly restore tests to verify backup integrity and measure actual recovery time.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              5. What is fsync and why does it impact write performance? When can you safely skip fsync?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>fsync:</strong> Forces OS to flush buffered data to disk. Without fsync, data in OS cache can be lost on power failure.</li>
                <li><strong>Performance impact:</strong> fsync is expensive (milliseconds vs microseconds for buffered write). Limits write throughput.</li>
                <li><strong>When to skip:</strong> (1) Temporary/cached data (can regenerate). (2) Bulk data loading (can re-run if crash). (3) Development/testing environments.</li>
                <li><strong>Never skip:</strong> (1) Financial transactions. (2) User data that can&apos;t be regenerated. (3) Production databases with durability requirements.</li>
                <li><strong>Optimization:</strong> Use group commit (batch multiple transactions, single fsync). Reduces fsync overhead per transaction.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              6. Compare durability guarantees of Redis (in-memory), PostgreSQL (WAL), and S3 (object storage).
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Redis (in-memory):</strong> Data in RAM, lost on restart. Durability options: (1) RDB snapshots (periodic, can lose minutes of data). (2) AOF log (append-only, better durability). (3) Redis Cluster with replication.</li>
                <li><strong>PostgreSQL (WAL):</strong> Strong durability with WAL + fsync. Synchronous replication for RPO = 0. Point-in-time recovery with WAL archiving.</li>
                <li><strong>S3 (object storage):</strong> 11 nines durability (99.999999999%). Data replicated across multiple AZs. Eventually consistent for writes. Excellent for backups, not for transactional data.</li>
                <li><strong>Use cases:</strong> Redis for caching/sessions (durability optional). PostgreSQL for transactional data (strong durability). S3 for backups/archives (high durability, eventual consistency).</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Durability Checklist</h2>
        <ul className="space-y-2">
          <li>✓ Defined RPO for each data type</li>
          <li>✓ WAL enabled and properly configured</li>
          <li>✓ Synchronous replication for critical data</li>
          <li>✓ Regular backup schedule implemented</li>
          <li>✓ Offsite backup copies maintained</li>
          <li>✓ Restore procedures tested quarterly</li>
          <li>✓ Backup integrity verification automated</li>
          <li>✓ fsync strategy documented</li>
          <li>✓ Monitoring for replication lag</li>
          <li>✓ Disaster recovery runbooks updated</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
