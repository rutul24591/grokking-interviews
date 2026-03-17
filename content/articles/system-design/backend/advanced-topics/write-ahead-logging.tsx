"use client";

import { ArticleImage } from "@/components/articles/ArticleImage";
import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-write-ahead-logging-extensive",
  title: "Write-Ahead Logging",
  description:
    "Make writes durable without sacrificing throughput: WAL fundamentals, checkpoints, group commit, recovery behavior, and operational signals that prevent long crash recovery and disk incidents.",
  category: "backend",
  subcategory: "advanced-topics",
  slug: "write-ahead-logging",
  wordCount: 2800,
  readingTime: 14,
  lastUpdated: "2026-03-14",
  tags: ["backend", "advanced", "databases", "durability"],
  relatedTopics: ["snapshot-isolation", "transaction-isolation-levels", "lsm-trees"],
};

export default function WriteAheadLoggingConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>What Write-Ahead Logging Is</h2>
        <p>
          <strong>Write-Ahead Logging (WAL)</strong> is a durability technique where changes are recorded in an
          append-only log before they are applied to the main data files. If the system crashes, it can replay the log
          to recover committed updates and restore consistent state.
        </p>
        <p>
          WAL exists because in-place data updates are hard to make crash-safe at scale. The log provides a sequential,
          durable history that can be flushed efficiently, while data pages can be written back later and in different
          orders.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/advanced-topics/write-ahead-logging-diagram-1.svg"
          alt="Write-ahead logging diagram showing log append before data page updates"
          caption="WAL turns random writes into durable sequential appends. Data pages can be updated later, and crashes are recovered by replaying the log."
        />
      </section>

      <section>
        <h2>Durability Mechanics: Commit and Flush</h2>
        <p>
          The central question is: when do you consider a transaction committed? Under WAL, a transaction is typically
          considered durable when its log records are flushed to stable storage. Data pages may not yet be written.
        </p>
        <p>
          This creates a tunable trade-off between latency and throughput. Flushing for every transaction yields strong
          durability but higher latency. Group commit batches flushes across multiple transactions, improving throughput
          while still providing durability guarantees.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/advanced-topics/write-ahead-logging-diagram-2.svg"
          alt="WAL control points: group commit, fsync frequency, checkpoints, and recovery time"
          caption="WAL performance is controlled by flush policy and checkpoints. Group commit improves throughput; checkpoints bound recovery time and log growth."
        />
      </section>

      <section>
        <h2>Checkpoints: Bounding Recovery Time and Log Growth</h2>
        <p>
          WAL can grow indefinitely if the system never writes dirty pages back to data files. <strong>Checkpoints</strong>
          address this by periodically ensuring that a set of data pages has been persisted. After a checkpoint, older
          portions of the log may no longer be needed for recovery.
        </p>
        <p>
          Checkpoints are an operational trade-off. Frequent checkpoints reduce recovery time and limit log size, but
          they increase write I/O and can create latency spikes if not smoothed. Infrequent checkpoints reduce write
          pressure but can lead to long recovery after a crash and higher storage usage.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Two Failure Goals</h3>
          <ul className="space-y-2">
            <li>
              <strong>Bound crash recovery time:</strong> keep log replay work within an operationally acceptable window.
            </li>
            <li>
              <strong>Prevent log runaway:</strong> avoid disk full events driven by log accumulation.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>WAL in Different Engine Designs</h2>
        <p>
          WAL is used in both B-tree and LSM-based databases, but its role can differ. In LSM engines, the WAL often
          protects the in-memory memtable so that data can be recovered before flush. In page-oriented engines, WAL
          records modifications to pages so recovery can redo or undo changes as needed.
        </p>
        <p>
          Regardless of engine, WAL is an operational dependency. If log storage is slow or unstable, write performance
          collapses. If log retention is misconfigured, recovery and replication can break.
        </p>
      </section>

      <section>
        <h2>Replication and WAL Shipping</h2>
        <p>
          Many databases replicate by shipping WAL records to replicas. This makes WAL a shared artifact for durability
          and replication. It also introduces lag semantics: replicas apply WAL records asynchronously, and the system
          must decide how far behind replicas are allowed to be for serving reads and for failover readiness.
        </p>
        <p>
          Operationally, WAL shipping requires retention settings that keep logs available until replicas have consumed
          them, and monitoring that alerts when lag approaches dangerous thresholds.
        </p>
      </section>

      <section>
        <h2>Failure Modes and Mitigations</h2>
        <p>
          WAL failures are typically storage and operational failures: disk becomes full, flush latency spikes, or log
          replay takes too long after a crash. The mitigations are about capacity, checkpoint policy, and observability.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/advanced-topics/write-ahead-logging-diagram-3.svg"
          alt="WAL failure modes: disk full, long recovery, flush stalls, and replication lag"
          caption="WAL risk is operational: flush stalls impact write latency, log growth can fill disks, and infrequent checkpoints can make recovery unacceptably long."
        />
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Disk full from log growth</h3>
            <p className="mt-2 text-sm text-muted">
              WAL segments accumulate due to misconfigured retention or stalled checkpoints and fill disk.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> set retention appropriately, monitor log growth rate, and ensure checkpoints keep pace.
              </li>
              <li>
                <strong>Signal:</strong> WAL usage grows steadily and does not drop after checkpoints; replica lag prevents retention cleanup.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Flush stalls and tail latency</h3>
            <p className="mt-2 text-sm text-muted">
              Storage latency spikes cause WAL fsync to stall, pushing transaction latency into the tail.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> provision fast durable storage, use group commit, and smooth checkpoint I/O.
              </li>
              <li>
                <strong>Signal:</strong> p99 commit latency correlates with storage fsync latency and checkpoint activity.
              </li>
            </ul>
          </div>
        </div>
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Long crash recovery</h3>
            <p className="mt-2 text-sm text-muted">
              After a crash, replaying large WAL history takes too long and delays service restoration.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> checkpoint regularly, keep WAL bounded, and validate recovery time in drills.
              </li>
              <li>
                <strong>Signal:</strong> recovery time grows over time and correlates with checkpoint intervals and WAL volume.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Replica lag and retention pressure</h3>
            <p className="mt-2 text-sm text-muted">
              Slow replicas prevent WAL cleanup, increasing disk usage and putting the primary at risk.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> monitor lag, provision replica resources, and define policies for lagging replicas (throttle, resync, or drop).
              </li>
              <li>
                <strong>Signal:</strong> retention grows due to lagging replicas and failover readiness degrades.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Scenario: Crash During Peak Write Load</h2>
        <p>
          A database crashes during peak writes. On restart, it must replay WAL to restore committed transactions. If
          checkpoints are infrequent, replay time can be long and user-visible recovery slow. If flush policy is too
          aggressive, peak write latency may be high even without crashes.
        </p>
        <p>
          A mature operational posture balances these: use group commit for throughput, keep checkpoints frequent enough
          to bound recovery, and validate recovery time regularly rather than assuming it will be fast.
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>
            Commit semantics are defined in terms of WAL persistence, and flush policy balances latency and throughput.
          </li>
          <li>
            Checkpoints are configured to bound recovery time and WAL growth without causing pathological write spikes.
          </li>
          <li>
            WAL storage is provisioned for durable low-latency writes, with monitoring on fsync latency.
          </li>
          <li>
            WAL retention is aligned with replication needs, and replica lag is monitored to prevent retention-driven disk incidents.
          </li>
          <li>
            Recovery time is measured in drills and treated as an operational SLO.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why does WAL improve performance compared to in-place writes?</p>
            <p className="mt-2 text-sm text-muted">
              A: WAL writes are sequential and efficient. Data pages can be written back later and in batches, while durability is ensured by flushing the log.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the purpose of checkpoints?</p>
            <p className="mt-2 text-sm text-muted">
              A: To bound recovery time and log growth by ensuring a consistent set of data pages is persisted so that older WAL segments are no longer needed for recovery.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a common operational failure mode with WAL?</p>
            <p className="mt-2 text-sm text-muted">
              A: Disk full due to retained WAL segments, often caused by lagging replicas or misconfigured retention. Monitoring WAL growth and replica lag is essential.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

