"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "lsm-trees",
  title: "LSM Trees",
  description: "Log-structured merge trees turn random writes into sequential I/O via in-memory MemTables, immutable SSTables, and background compaction — the storage backbone of RocksDB, Cassandra, and modern NoSQL.",
  category: "other",
  subcategory: "data-structures",
  slug: "lsm-trees",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-04-18",
  tags: ["lsm-trees", "rocksdb", "leveldb", "storage-engines", "data-structures"],
  relatedTopics: ["b-trees", "bloom-filters", "trees"],
};

export default function LSMTreesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition &amp; Context</h2>
        <p className="mb-4">
          A Log-Structured Merge tree (LSM tree) is a write-optimized storage structure that buffers writes in a small in-memory component, periodically flushes them to immutable on-disk files, and merges those files in the background. Unlike a B-tree, which updates pages in place, an LSM tree never modifies an existing on-disk file — it only appends new ones and rewrites them during compaction. This converts what would be random-write workloads into sequential I/O patterns that match the strengths of both spinning disks and SSDs.
        </p>
        <p className="mb-4">
          Patrick O&apos;Neil and collaborators introduced the LSM tree in 1996 as a multi-component structure for high-throughput insert workloads in transaction-processing systems. It moved from theoretical curiosity to dominant pattern via Google&apos;s Bigtable (2006), which used the design at planet scale, and Bigtable&apos;s open-source descendants — LevelDB (Google, 2011), HBase, and Cassandra. RocksDB (Facebook, 2012) forked LevelDB into the modern reference implementation, now embedded in MyRocks, CockroachDB&apos;s Pebble, TiKV, Kafka Streams state stores, and many others.
        </p>
        <p>
          The pattern fits modern hardware: SSDs handle sequential writes efficiently while penalizing random writes with garbage-collection amplification; cloud object storage (S3) is fundamentally append-only. LSM trees were designed for spinning rust but turned out to be ideal for flash and cloud-native storage stacks. They underpin most write-heavy systems built in the last decade, from time-series databases (InfluxDB, TimescaleDB), to wide-column stores (Cassandra, HBase, ScyllaDB), to log-structured filesystems (BTRFS COW, F2FS).
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>
        <p className="mb-4">
          The LSM architecture has three primary components. The <strong>MemTable</strong> is an in-memory sorted structure (typically a skip list, sometimes a B-tree or hash) that absorbs writes. A <strong>Write-Ahead Log</strong> (WAL) records every mutation before it lands in the MemTable, so a crash before MemTable flush can be recovered by replay. <strong>SSTables</strong> (Sorted String Tables) are immutable, sorted on-disk files holding (key, value) pairs along with index and Bloom-filter metadata.
        </p>
        <p className="mb-4">
          When the MemTable hits its size threshold (typically 64 MB), it&apos;s frozen, a new active MemTable takes over, and the frozen one flushes to disk as a new L0 SSTable. The WAL associated with the flushed MemTable is then truncated. This sequence — append to WAL, mutate MemTable, flush when full — converts every user-facing write into a small in-memory mutation plus a sequential disk append. No random-write disk pages, no in-place B-tree splits.
        </p>
        <p className="mb-4">
          The on-disk levels are organized so that newer writes sit at the top (L0) and older, larger merged data accumulates at lower levels. Each level is roughly 10× the size of the one above it. L0 SSTables can have overlapping key ranges (since they came from independent MemTable flushes). From L1 downward, SSTables within a level have non-overlapping ranges — an invariant maintained by compaction.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/lsm-trees-diagram-1.svg"
          alt="LSM tree architecture showing MemTable, WAL, and leveled SSTables on disk"
          caption="Figure 1: LSM tree architecture — writes hit the MemTable; full MemTables flush to L0; lower levels hold older, larger, non-overlapping SSTables."
        />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture &amp; Flow</h2>
        <p className="mb-4">
          The write path is straightforward. A PUT(k, v) appends a record to the WAL (fsync depending on durability setting), then inserts into the MemTable&apos;s skip list. Both operations are O(log n) in memory. Deletes are not in-place removals; they write a <strong>tombstone</strong> — a sentinel record that masks any earlier value during reads and gets dropped during compaction once it&apos;s known no older snapshot needs the prior value.
        </p>
        <p className="mb-4">
          The read path is more complex. To find a key, the engine checks the active MemTable, then any immutable MemTables awaiting flush, then SSTables level by level, newest first. At each SSTable, a Bloom filter check (typically ~1% false positive rate) eliminates most negative cases before any disk read. If the Bloom filter says &quot;maybe present,&quot; the index block (mapping key ranges to data-block offsets) is consulted, then the relevant data block is read. The first match wins — a tombstone short-circuits and returns &quot;not found.&quot;
        </p>
        <p className="mb-4">
          <strong>Compaction</strong> is the background process that bounds read amplification and reclaims space. The compactor selects SSTables (by policy) and rewrites them: merging overlapping key ranges, dropping tombstones older than the gc-grace window, and resolving duplicate keys (newest version wins). The result is fewer, larger, non-overlapping SSTables one level deeper. Without compaction, read amplification grows unbounded as L0 fills with hundreds of overlapping files.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/lsm-trees-diagram-2.svg"
          alt="LSM compaction lifecycle merging overlapping SSTables down levels"
          caption="Figure 2: Compaction merges sorted runs, drops tombstones, and resolves duplicates — the policy choice (leveled vs tiered) drives the write/read/space amplification trade-off."
        />
        <p>
          Two compaction strategies dominate. <strong>Leveled compaction</strong> (LevelDB, RocksDB default) keeps strict per-level invariants — when L1 exceeds its target size, pick an SSTable from L1 and merge with all overlapping L2 SSTables; result lands in L2. This minimizes read and space amplification but each level rewrites its data ~10×, giving high write amplification. <strong>Tiered (size-tiered) compaction</strong> (Cassandra default) groups similar-sized SSTables and merges them into one larger SSTable in the next tier — lower write amplification but higher read amplification (more SSTables per level to check) and transient 2× space spikes during compaction.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Trade-offs &amp; Comparisons</h2>
        <p className="mb-4">
          LSM trees optimize for writes; B+ trees optimize for reads. The numbers vary by workload, but as rough orders: LSM tree writes can be 10–100× cheaper than B+ tree writes for random insert/update workloads, while B+ tree point lookups are typically 1–3× faster than LSM lookups (more so without Bloom filters). Range scans favor neither inherently — both can be efficient when data is sorted, though B+ tree leaf-link traversal is slightly cheaper than LSM&apos;s merge-iterator over multiple SSTables.
        </p>
        <p className="mb-4">
          The <strong>RUM Conjecture</strong> (Athanassoulis et al. 2016) frames the trade-off: any storage structure must compromise on at least one of Read amplification, Update cost, or Memory amplification. The intuition is that you cannot simultaneously minimize read-access cost, update cost, and memory overhead — optimizing any two forces a cost on the third. B+ trees minimize R but pay in U; LSMs minimize U but pay in R; in-memory hash tables minimize both R and U but pay in M. Engineering choices live on this triangle.
        </p>
        <p className="mb-4">
          Compared with simple append-only logs (Kafka, write-ahead logs), LSM trees add the indexed-lookup capability — you can ask &quot;what is the current value for key K?&quot; rather than just replaying the log. The cost is the compaction machinery and the read-amplification overhead. Many systems combine both: Kafka for event streaming, an LSM-backed state store (RocksDB embedded in stream processors) for materialized views.
        </p>
        <p>
          Compared with copy-on-write B-trees (ZFS, BTRFS), LSM trees give better write throughput at the cost of more aggressive background work. COW B-trees give snapshot-friendly semantics with lower compaction overhead but worse random-write performance. Modern systems sometimes combine: WiredTiger uses an LSM mode for write-heavy workloads and a B-tree mode for read-heavy ones, switchable per-collection in MongoDB.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Match compaction strategy to workload</strong>: leveled for read-heavy and small space budgets; tiered for write-heavy ingest; time-window (TWCS) for time-series with TTL; FIFO for purely append-only ring-buffer-like data.</li>
          <li><strong>Tune Bloom filter bits per key</strong>. Default ~10 bits gives ~1% false-positive rate. Read-heavy workloads benefit from raising to 15-20 bits; pure write workloads can lower it to save memory.</li>
          <li><strong>Size MemTables and L0 to balance write stalls</strong>. L0 holds at most ~4 SSTables in RocksDB before triggering write throttling — too small a MemTable means frequent flushes saturate the L0→L1 compactor.</li>
          <li><strong>Use compression at the block level</strong>. Snappy, LZ4, or Zstd cut SSTable size by 2-5× for typical text/JSON data, reducing both disk I/O and write amplification per logical byte.</li>
          <li><strong>Pin per-SSTable metadata</strong> (Bloom filter, index block) in the block cache. Hot SSTables&apos; metadata living in cache turns most lookups into a cache hit + at most one disk read.</li>
          <li><strong>Profile compaction backlog</strong> with engine metrics (RocksDB&apos;s <code>num-files-at-level0</code>, <code>compaction-pending</code>). A growing backlog is the first sign of write-rate-vs-compaction-throughput mismatch and predicts upcoming write stalls.</li>
          <li><strong>Choose key prefixes that respect locality</strong>. Time-series keys naturally cluster by recent time; tenant-prefix keys cluster by tenant. Random hashing destroys locality and increases per-query SSTable touches.</li>
          <li><strong>Use prefix Bloom filters or full-key Bloom filters per access pattern</strong>. RocksDB lets you configure either; range scans on a known prefix benefit from a prefix Bloom even though point Bloom filters can&apos;t help.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Write stalls under sustained ingest</strong>: when L0 fills faster than compaction can drain it, the engine throttles or stops writes. Symptoms: write latency spikes, then full stalls. Causes: undersized compaction thread pool, undersized memtable, slow disk. Fix: more compaction threads, faster storage, or back off ingest with rate limiting.</li>
          <li><strong>Tombstone explosion</strong> (the &quot;Cassandra tombstone problem&quot;): heavy delete/TTL workloads accumulate tombstones that aren&apos;t collected until gc_grace_seconds passes (default 10 days in Cassandra). Reads against tombstone-heavy partitions slow drastically and may fail. Fix: shorten gc_grace where consistency allows, partition by time so TTL drops whole SSTables, or use TWCS.</li>
          <li><strong>Excessive write amplification</strong> from leveled compaction in write-heavy workloads. Symptom: SSD wear-out faster than expected. Fix: switch to tiered compaction, accept higher read amplification, or move to engines designed for low write amp (FoundationDB&apos;s Redwood, fractal trees).</li>
          <li><strong>Range scans missing the Bloom filter benefit</strong>: point-lookup Bloom filters don&apos;t help range scans. Without prefix Bloom filters configured, range scans must touch every SSTable in every level for every level boundary the range crosses.</li>
          <li><strong>fsync amplification</strong> in WAL: per-write fsync on slow disks dominates write latency. Group commit (batch many writes, fsync once) restores throughput at the cost of a small staleness window on crash.</li>
          <li><strong>Snapshot isolation surprises</strong>: SSTables held open by a long-running snapshot can&apos;t be deleted post-compaction, causing transient space amplification. Long snapshots compound: hold one for hours during heavy writes and disk usage spikes 2-3×.</li>
          <li><strong>Cold-start latency</strong>: a freshly opened LSM has empty block cache. The first thousand reads after startup may be 10× slower than steady-state. Warmup procedures (preload hot key ranges) help when SLA matters.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>
        <p className="mb-4">
          <strong>Embedded key-value stores</strong>: RocksDB is the workhorse — embedded in MyRocks (Facebook&apos;s MySQL fork that replaces InnoDB), TiKV (TiDB&apos;s storage layer), CockroachDB Pebble, Apache Kafka Streams state stores, Apache Flink&apos;s RocksDBStateBackend, ScyllaDB&apos;s commitlog, and many others. LevelDB powers Bitcoin Core&apos;s chainstate database. RocksDB&apos;s tunability is a key reason it dominates.
        </p>
        <p className="mb-4">
          <strong>Distributed databases</strong>: Apache Cassandra and ScyllaDB use LSM trees natively with size-tiered or time-window compaction. HBase uses LSM-style storage on top of HDFS. Apache Druid uses LSM-like immutable segments with background re-segmentation. CockroachDB and YugabyteDB layer SQL semantics over RocksDB-derived LSM storage.
        </p>
        <p className="mb-4">
          <strong>Time-series databases</strong>: InfluxDB&apos;s TSM engine is an LSM variant tuned for time-series patterns. TimescaleDB layers time-partitioned hypertables over PostgreSQL B-trees but borrows LSM ideas for chunk merging. Prometheus&apos;s TSDB uses immutable per-block storage with periodic compaction analogous to LSM compaction.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/lsm-trees-diagram-3.svg"
          alt="LSM tree read path showing MemTable check then Bloom-filtered SSTable descent"
          caption="Figure 3: Read path — check MemTables in newest-first order, then walk SSTable levels with per-file Bloom filters short-circuiting negative lookups before disk I/O."
        />
        <p className="mb-4">
          <strong>Cloud-native storage</strong>: object stores (S3, GCS) are fundamentally append-only, making LSM-on-object-storage a natural fit. Systems like Apache Iceberg, Delta Lake, and Apache Hudi adapt LSM-style ideas to data lakes — immutable Parquet files as &quot;SSTables,&quot; manifest files as the level metadata, periodic compaction jobs to manage file proliferation. The core insight (sequential writes + background reorganization) translates from local SSDs to S3.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Walk through what happens when a Cassandra cluster receives 100K writes/second sustained for an hour.</p>
            <p className="mt-2 text-sm">A: Each node receives a portion of writes. For each: append to commitlog (WAL), insert into the in-memory MemTable. When the MemTable fills (typically 64 MB or threshold reached), it&apos;s flushed to a new SSTable on disk and the corresponding commitlog segments are recycled. Over an hour at this rate, hundreds of SSTables accumulate. The compaction strategy (size-tiered by default) periodically picks groups of similarly-sized SSTables and merges them into larger ones in higher tiers. If writes outpace compaction, the SSTable count grows and read latency degrades — eventually triggering throttling. Operators watch <code>nodetool tpstats</code> for CompactionExecutor pending counts and <code>nodetool compactionstats</code> to see if backlog is growing.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: A team running RocksDB notices read latency degrading slowly over weeks despite stable write rate. What would you investigate?</p>
            <p className="mt-2 text-sm">A: Several candidates. (1) Bloom filter false-positive rate creeping up if data distribution shifted — check the rate via stats and consider raising bits/key. (2) L0 file count growing (overlapping files mean every L0 file gets checked per read) — check compaction backlog. (3) Block cache hit rate dropping as working set grows beyond cache — measure cache hit rate, consider larger cache. (4) SSTables fragmented across many small files (e.g., from many small writes without compaction catching up) — manual compaction may help. (5) Tombstones accumulating, especially if heavy deletes — tombstone count per SST is a key metric. (6) Disk hardware degradation (SSD wear leveling getting worse). The right diagnostic order: check engine stats first (compaction backlog, Bloom FP rate, cache hit), then OS-level (iostat, latency histograms), then hardware.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Explain leveled vs tiered compaction with concrete trade-offs.</p>
            <p className="mt-2 text-sm">A: Leveled: invariants force non-overlapping SSTables within each level (except L0); compaction picks one SSTable from level N and merges with all overlapping SSTables from level N+1. Pro: a key lives in at most one SSTable per level, so reads check only one SST per level (plus L0 files); space amplification is small (~1.1×). Con: each level rewrites its data ~10× over its lifetime — write amplification is typically 10–15× for mixed workloads, up to 30× under pure random-write stress. Tiered: each level holds N similarly-sized SSTables; when N accumulate, merge them all into one SST in the next level. Pro: each byte is rewritten ~once per level — write amplification ~3-5×. Con: a key can exist in any SST within a level, so reads must check all SSTables per level (Bloom filters mitigate); transient space amplification up to 2× during compaction. Choose by workload: read-heavy + tight space → leveled; write-heavy + write amp matters → tiered.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why do LSM trees pair so well with Bloom filters?</p>
            <p className="mt-2 text-sm">A: Read amplification is the LSM weakness — a lookup may need to check many SSTables before finding the key (or determining it&apos;s absent). Without Bloom filters, every level&apos;s relevant SSTable means a disk read just to confirm absence. Bloom filters give a constant-memory, single-CPU-instruction membership check that returns &quot;definitely not&quot; for ~99% of negative cases. Add per-SST Bloom filters and the read path skips most files entirely, often touching disk only at the level that actually contains the key. The combination converts LSM&apos;s &quot;possibly many disk reads&quot; into &quot;usually one disk read,&quot; closing most of the gap with B+ trees for point lookups while keeping LSM&apos;s write-throughput advantage.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: A system needs both fast writes and fast reads on a working set that fits in RAM. Should you use an LSM tree?</p>
            <p className="mt-2 text-sm">A: Probably not — at least not the canonical design. The LSM&apos;s value proposition is converting random writes into sequential I/O, which matters most when data exceeds RAM. If the working set fits in RAM, an in-memory hash table or B-tree gives O(1) or O(log n) lookups with no compaction overhead, no Bloom filters, no SSTable bookkeeping. Redis, Memcached, and similar are designed exactly for this case. If you need durability, layer a WAL on top (Redis RDB+AOF). LSM trees pay overhead for behaviors (compaction, multi-level merging) that aren&apos;t needed when you&apos;re not paging from disk. The exception: when you also need point-in-time snapshots, replication, or planned scale-out beyond RAM, the LSM&apos;s structural choices may be worth absorbing the in-memory overhead.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do LSM-based systems handle MVCC and snapshot isolation?</p>
            <p className="mt-2 text-sm">A: By writing every version of a key as a separate SSTable record, keyed by (user_key, sequence_number). RocksDB assigns a monotonically increasing sequence number to every write. A read at sequence N searches for the largest sequence ≤ N for the user key. Snapshots simply pin a sequence number; while a snapshot is held, compaction must preserve any version visible to that sequence number — it can&apos;t drop a tombstone or older version that some snapshot still needs. This is elegant: MVCC falls naturally out of the immutable-SSTable + sequence-number design. The trade-off: long-lived snapshots prevent compaction from reclaiming space, so disk usage can balloon. CockroachDB and TiKV layer their MVCC on top of RocksDB&apos;s sequence-number machinery.</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">References &amp; Further Reading</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>O&apos;Neil, P., Cheng, E., Gawlick, D., &amp; O&apos;Neil, E. (1996). <em>The Log-Structured Merge-Tree (LSM-Tree)</em>. Acta Informatica — the original paper.</li>
          <li>Chang, F., et al. (2006). <em>Bigtable: A Distributed Storage System for Structured Data</em>. OSDI — Google&apos;s production realization of the SSTable + memtable design at planet scale.</li>
          <li>RocksDB Wiki (Facebook): <em>RocksDB Tuning Guide</em>, <em>Compaction</em>, <em>Bloom Filter</em> — the de facto reference for production LSM tuning.</li>
          <li>Athanassoulis, M., et al. (2016). <em>Designing Access Methods: The RUM Conjecture</em>. EDBT — formalizes the read/update/memory trade-off triangle.</li>
          <li>Sears, R., &amp; Ramakrishnan, R. (2012). <em>bLSM: A General Purpose Log Structured Merge Tree</em>. SIGMOD — refinements to compaction scheduling.</li>
          <li>Dayan, N., Athanassoulis, M., &amp; Idreos, S. (2017). <em>Monkey: Optimal Navigable Key-Value Store</em>. SIGMOD — analysis of optimal Bloom-filter sizing across LSM levels.</li>
          <li>Apache Cassandra Documentation: <em>Compaction Strategies</em> — practical guide to STCS, LCS, and TWCS choices.</li>
          <li>Petrov, A. (2019). <em>Database Internals</em>. O&apos;Reilly — chapter 7 covers LSM trees in depth alongside other modern storage structures.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
