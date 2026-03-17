"use client";

import { ArticleImage } from "@/components/articles/ArticleImage";
import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-lsm-trees-extensive",
  title: "LSM Trees",
  description:
    "Understand write-optimized storage engines: memtables, SSTables, compaction strategies, amplification trade-offs, and operational tuning to prevent compaction debt and tail latency.",
  category: "backend",
  subcategory: "advanced-topics",
  slug: "lsm-trees",
  wordCount: 2800,
  readingTime: 14,
  lastUpdated: "2026-03-14",
  tags: ["backend", "advanced", "storage", "databases"],
  relatedTopics: ["write-ahead-logging", "bloom-filters", "time-series-optimization"],
};

export default function LsmTreesConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>What an LSM Tree Is</h2>
        <p>
          A <strong>Log-Structured Merge-tree (LSM tree)</strong> is a storage engine design optimized for high write
          throughput. Instead of updating on-disk structures in place, LSM systems buffer writes in memory, write them
          sequentially to disk as immutable files, and later merge and compact those files in the background.
        </p>
        <p>
          The goal is to turn random writes into sequential writes, which is much more efficient on many storage media.
          The trade-off is that reads become more complex (you may need to check multiple files) and background
          compaction becomes a core operational concern.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/advanced-topics/lsm-trees-diagram-1.svg"
          alt="LSM tree diagram showing memtable, WAL, SSTables, and compaction levels"
          caption="LSM trees trade complexity in reads and compaction for efficient ingestion: buffer writes, flush immutable tables, and compact in the background."
        />
      </section>

      <section>
        <h2>Core Components: Memtable, WAL, SSTables</h2>
        <p>
          Most LSM designs include:
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Write-ahead log (WAL):</strong> ensures durability for in-memory writes.
          </li>
          <li>
            <strong>Memtable:</strong> an in-memory sorted structure that absorbs writes quickly.
          </li>
          <li>
            <strong>SSTables:</strong> immutable sorted files written to disk when memtables flush.
          </li>
          <li>
            <strong>Compaction:</strong> background merging of SSTables to reduce the number of files and discard obsolete versions.
          </li>
        </ul>
        <p className="mt-4">
          Reads consult the memtable and then consult on-disk tables in a defined order. Deletions are usually recorded
          as tombstones and cleared during compaction.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/advanced-topics/lsm-trees-diagram-2.svg"
          alt="LSM tree control points: compaction policy, bloom filters, read amplification, and write amplification"
          caption="LSM tuning is about amplification: compaction reduces read cost but increases write cost. Bloom filters often reduce read amplification for misses."
        />
      </section>

      <section>
        <h2>Amplification: The Trade-off Triangle</h2>
        <p>
          LSM trees are often explained through amplification trade-offs:
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Write amplification:</strong> how many bytes are written to storage for each byte of user data, due to compaction.
          </li>
          <li>
            <strong>Read amplification:</strong> how many structures must be consulted per read, especially for misses.
          </li>
          <li>
            <strong>Space amplification:</strong> how much extra storage is consumed due to multiple versions and tombstones before compaction.
          </li>
        </ul>
        <p className="mt-4">
          Compaction policy determines where you land in this triangle. More aggressive compaction reduces read
          amplification but increases write amplification and background I/O.
        </p>
      </section>

      <section>
        <h2>Compaction Strategies</h2>
        <p>
          Compaction is where LSM systems succeed or fail operationally. Two common strategies are leveled compaction and
          tiered (or size-tiered) compaction. They differ in write amplification, space usage, and read cost.
        </p>
        <p>
          Compaction must be scheduled and budgeted. If compaction falls behind, the system accumulates too many tables,
          read amplification increases, and storage usage grows. Eventually the system becomes unstable under load.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Compaction Debt</h3>
          <p className="text-sm text-muted">
            Compaction debt is the gap between how much compaction work needs to happen and how much is happening. It is a leading indicator of future incidents: read latency increases, storage grows, and background I/O competes with foreground traffic.
          </p>
        </div>
      </section>

      <section>
        <h2>Operational Signals</h2>
        <p>
          LSM systems require observability beyond simple QPS. You need to see background work and how it affects the
          read and write paths.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            Compaction backlog and compaction throughput.
          </li>
          <li>
            Number and size distribution of SSTables per level.
          </li>
          <li>
            Read amplification proxies: tables consulted per read and bloom filter effectiveness for misses.
          </li>
          <li>
            Disk saturation and tail latency correlation with background compaction.
          </li>
        </ul>
        <p className="mt-4">
          These signals help distinguish &quot;system is underprovisioned&quot; from &quot;compaction policy is mis-tuned&quot;.
        </p>
      </section>

      <section>
        <h2>Failure Modes and Mitigations</h2>
        <p>
          LSM failures are usually compaction failures. When background work cannot keep up, the system enters a state
          where reads get slower and writes generate more work, creating a feedback loop.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/advanced-topics/lsm-trees-diagram-3.svg"
          alt="LSM tree failure modes: compaction debt, write stalls, read amplification spikes, and space amplification"
          caption="LSM trees fail by compaction debt: backlog grows, read amplification rises, and write stalls appear. Budgeted compaction and observability keep the system stable."
        />
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Compaction debt and write stalls</h3>
            <p className="mt-2 text-sm text-muted">
              Background compaction cannot keep up, and the engine stalls writes to prevent unbounded table growth.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> increase compaction resources, tune compaction policy, and apply backpressure earlier with clearer signals.
              </li>
              <li>
                <strong>Signal:</strong> rising compaction backlog and increased write latency with stall events.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Read amplification spikes</h3>
            <p className="mt-2 text-sm text-muted">
              Reads consult many tables due to backlog or poor bloom filter effectiveness, harming p99 latency.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> keep compaction healthy, tune bloom filters, and cache hot data to reduce table checks.
              </li>
              <li>
                <strong>Signal:</strong> increased tables consulted per read and higher miss latency.
              </li>
            </ul>
          </div>
        </div>
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Space amplification from tombstones</h3>
            <p className="mt-2 text-sm text-muted">
              Deletions accumulate and are not compacted away, causing storage growth and longer reads.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> compaction tuning, tombstone handling policies, and retention strategies.
              </li>
              <li>
                <strong>Signal:</strong> storage grows despite stable live data size and increased tombstone ratios.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Hot keys and compaction hotspots</h3>
            <p className="mt-2 text-sm text-muted">
              A small set of keys causes churn and compaction work to concentrate, creating uneven latency.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> isolate hot partitions, adjust compaction scheduling, and consider key design changes or caching.
              </li>
              <li>
                <strong>Signal:</strong> compaction and read latency spikes correlated with specific key ranges or tenants.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Scenario: High Ingestion Time-Series Workload</h2>
        <p>
          A time-series ingestion service writes millions of points per second. LSM trees handle this well because writes
          are buffered and flushed sequentially. The risk is compaction debt: if compaction cannot keep up, read
          amplification and storage usage grow, and the system begins to stall writes.
        </p>
        <p>
          The operational solution is to budget compaction resources and to monitor backlog early. Compaction tuning and
          retention policies (downsampling, TTL) often matter more than micro-optimizing the write path.
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>
            Compaction policy is chosen intentionally and tuned for the workload’s read and write mix.
          </li>
          <li>
            Compaction backlog and write stalls are monitored as leading indicators of instability.
          </li>
          <li>
            Bloom filters and caching reduce miss cost and keep read amplification within budget.
          </li>
          <li>
            Tombstone and retention strategies prevent unbounded space amplification.
          </li>
          <li>
            The system has capacity headroom so foreground traffic and background compaction can coexist without constant saturation.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why do LSM trees have high write throughput?</p>
            <p className="mt-2 text-sm text-muted">
              A: They convert random writes into sequential writes by buffering in memory and writing immutable files. This is efficient on many storage media.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is compaction debt and why is it dangerous?</p>
            <p className="mt-2 text-sm text-muted">
              A: It is when compaction work accumulates faster than it can be processed. It leads to more tables, slower reads, higher space usage, and eventually write stalls.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do Bloom filters help LSM systems?</p>
            <p className="mt-2 text-sm text-muted">
              A: They reduce read amplification for misses by letting the engine skip SSTables that definitely do not contain a key, saving I/O and improving tail latency.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

