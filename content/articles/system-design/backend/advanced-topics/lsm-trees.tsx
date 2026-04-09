"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-advanced-topics-lsm-trees",
  title: "LSM Trees",
  description:
    "Staff-level deep dive into Log-Structured Merge Trees: memtable, SSTable, compaction strategies, write amplification, read amplification, and production-scale storage engine patterns.",
  category: "backend",
  subcategory: "advanced-topics",
  slug: "lsm-trees",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-08",
  tags: ["backend", "lsm-tree", "storage-engine", "compaction", "write-amplification", "sstables"],
  relatedTopics: ["b-trees-b-trees", "write-ahead-logging", "database-indexes", "time-series-optimization"],
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
          <strong>LSM trees</strong> (Log-Structured Merge trees) are a storage engine architecture
          optimized for high write throughput by batching random writes into sequential writes.
          Unlike B-trees, which update data in place (random I/O), LSM trees buffer writes in
          memory (the memtable) and periodically flush them to disk as immutable sorted files
          (SSTables). When multiple SSTables accumulate, a background process called compaction
          merges them into larger files, discarding obsolete entries and tombstones (delete
          markers).
        </p>
        <p>
          Consider a time-series database that ingests 1 million writes per second from IoT
          sensors. With a B-tree, each write would require a random disk I/O (seek + write),
          limiting throughput to approximately 10,000 writes per second on a typical disk.
          With an LSM tree, writes are buffered in the memtable (in-memory, O(1) per write)
          and flushed to disk as sequential writes (100x faster than random writes). This
          enables the database to ingest 1 million writes per second using only sequential
          disk I/O, which is the fastest type of disk I/O available on spinning disks and
          still significantly faster than random writes on SSDs.
        </p>
        <p>
          For staff/principal engineers, LSM trees require understanding the trade-offs
          between write amplification (compaction rewrites the same data multiple times),
          read amplification (reads may need to check multiple SSTables), and space
          amplification (obsolete entries are retained until compaction). The choice of
          compaction strategy (size-tiered, leveled, tiered-leveled) determines the balance
          between these amplification factors and must be chosen based on the workload
          characteristics (write-heavy, read-heavy, or mixed).
        </p>
        <p>
          The business impact of LSM tree decisions is significant. LSM trees enable
          write-heavy workloads (time-series, logging, event sourcing) that are not feasible
          with B-tree-based storage engines. However, they introduce read latency variability
          (reads may need to check multiple SSTables) and space overhead (obsolete entries
          are retained until compaction), which must be managed through careful compaction
          configuration and monitoring.
        </p>
        <p>
          In system design interviews, LSM trees demonstrate understanding of storage engine
          internals, I/O optimization strategies, the trade-offs between write and read
          performance, and the relationship between compaction strategy and workload
          characteristics.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src={`${BASE_PATH}/lsm-tree-architecture.svg`}
          alt="LSM tree architecture showing memtable, immutable memtables, SSTable levels, and compaction flow from memory to disk"
          caption="LSM tree architecture — writes buffer in the memtable (memory), flush to immutable memtables when full, then flush to SSTable Level 0 on disk; compaction merges SSTables from Level N to Level N+1, discarding obsolete entries and tombstones"
        />

        <h3>The Memtable</h3>
        <p>
          The memtable is an in-memory data structure (typically a skip list or balanced tree)
          that buffers incoming writes. Writes are appended to the memtable in O(1) time (for
          a skip list) or O(log N) time (for a balanced tree), which is significantly faster
          than the random disk I/O required by B-tree updates. When the memtable reaches a
          configured size threshold (typically 64-256 MB), it is converted to an immutable
          memtable (read-only), and a new mutable memtable is created to accept new writes.
        </p>
        <p>
          The immutable memtable is flushed to disk as an SSTable (Sorted String Table), which
          is an immutable file containing key-value pairs sorted by key. The flush is a
          sequential write (write the entire SSTable in one contiguous disk operation), which
          is 10-100x faster than the random writes required by B-tree updates. After the
          flush completes, the immutable memtable is deleted from memory, freeing space for
          the next flush.
        </p>

        <h3>SSTables and Bloom Filters</h3>
        <p>
          SSTables are immutable files on disk containing sorted key-value pairs. Each SSTable
          includes a bloom filter that allows the storage engine to quickly determine whether
          a key is present in the SSTable without reading the file. If the bloom filter returns
          negative, the key is definitely not in the SSTable, and the read can skip the file
          entirely. If the bloom filter returns positive, the key may be in the SSTable, and
          the read must search the file using binary search (since the keys are sorted).
        </p>
        <p>
          Bloom filters reduce read amplification by eliminating unnecessary SSTable reads.
          Without bloom filters, a read that misses in the memtable must check every SSTable
          (potentially dozens of files). With bloom filters, most SSTables are eliminated
          immediately, and the read typically checks only 2-3 SSTables. The bloom filter&apos;s
          false positive rate is typically set to 1%, meaning 1% of negative lookups will
          incorrectly check the SSTable, but 99% of negative lookups are eliminated without
          disk I/O.
        </p>

        <h3>Compaction Strategies</h3>
        <p>
          Compaction merges multiple SSTables into larger files, discarding obsolete entries
          (overwritten or deleted keys) and tombstones (delete markers). The choice of
          compaction strategy determines the balance between write amplification, read
          amplification, and space amplification. <strong>Size-tiered compaction</strong>
          merges SSTables of similar size, minimizing write amplification (each entry is
          rewritten O(log N) times) but maximizing read amplification (reads may need to
          check many SSTables). <strong>Leveled compaction</strong> organizes SSTables into
          levels, where each level has a target size and SSTables in Level N are merged into
          Level N+1. This minimizes read amplification (reads check at most one SSTable per
          level) but maximizes write amplification (each entry is rewritten O(N) times, where
          N is the number of levels).
        </p>
        <p>
          <strong>Tiered-leveled compaction</strong> (used by RocksDB) is a hybrid approach
          that uses size-tiered compaction within each level and leveled compaction between
          levels. This provides a balance between write and read amplification, making it
          suitable for mixed workloads that have both high write throughput and low read
          latency requirements.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/lsm-tree-compaction-strategies.svg`}
          alt="Compaction strategies comparison: size-tiered (merge similar sizes, low write amplification), leveled (merge across levels, low read amplification), and tiered-leveled (hybrid)"
          caption="Compaction strategies — size-tiered merges SSTables of similar size (low write amplification, high read amplification), leveled merges across levels (high write amplification, low read amplification), tiered-leveled hybrid balances both for mixed workloads"
        />
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture &amp; Flow</h2>

        <h3>Write Path</h3>
        <p>
          The LSM tree write path is optimized for sequential I/O. When a write arrives, it is
          first written to the write-ahead log (WAL) for durability, then inserted into the
          memtable. The WAL ensures that the write is durable even if the system crashes before
          the memtable is flushed to disk. When the memtable reaches its size threshold, it is
          frozen (becomes immutable), a new memtable is created, and the immutable memtable is
          flushed to disk as an SSTable in Level 0.
        </p>
        <p>
          The flush is a sequential write: the entire SSTable is written as one contiguous
          operation, which is the fastest type of disk I/O. After the flush, a background
          compaction process merges SSTables from Level 0 into Level 1, from Level 1 into
          Level 2, and so on. Each compaction run reads SSTables from Level N, merges their
          entries (discarding obsolete entries and tombstones), and writes the merged result
          to Level N+1.
        </p>

        <h3>Read Path</h3>
        <p>
          The LSM tree read path checks multiple sources in order: the mutable memtable, any
          immutable memtables, and SSTables from Level 0 to Level N. The read returns the most
          recent value for the key (the value from the source with the highest sequence number).
          If the key is not found in any source, the read returns not found.
        </p>
        <p>
          To optimize the read path, LSM trees use bloom filters for each SSTable, allowing
          the read to skip SSTables that definitely do not contain the key. Additionally, each
          SSTable includes a sparse index (every Kth key and its file offset) that allows the
          read to binary-search the index and then read only the relevant block from the
          SSTable, rather than scanning the entire file.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/lsm-tree-read-write-path.svg`}
          alt="LSM tree read and write paths: write goes WAL → memtable → immutable memtable → SSTable L0 → compact to L1→L2; read checks memtable → immutable → L0 SSTables → L1 SSTables → LN, using bloom filters to skip"
          caption="Read and write paths — write: WAL → memtable → flush to L0 SSTable → compact to L1/L2; read: memtable → immutable → L0 → L1 → LN, with bloom filters eliminating unnecessary SSTable reads at each level"
        />
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          LSM trees trade read performance for write performance. Compared to B-trees, LSM
          trees provide 10-100x higher write throughput (sequential vs random I/O) but 2-5x
          higher read latency (checking multiple SSTables vs single B-tree lookup). The
          trade-off is favorable for write-heavy workloads (time-series, logging, event
          sourcing) where write throughput is the primary concern, but unfavorable for
          read-heavy workloads (OLAP, analytics) where read latency is the primary concern.
        </p>
        <p>
          LSM trees also introduce write amplification: compaction rewrites the same data
          multiple times as it moves from Level 0 to Level N. With leveled compaction, write
          amplification is approximately 10-50x (each entry is rewritten 10-50 times before
          being evicted from the database). This increases disk wear on SSDs and consumes
          additional I/O bandwidth that could be used for client reads and writes. The
          trade-off is managed through compaction throttling (limiting the compaction I/O
          bandwidth to leave headroom for client operations) and choosing a compaction
          strategy that minimizes write amplification for the workload.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Choose the compaction strategy based on the workload. For write-heavy workloads
          (time-series, logging), use size-tiered compaction to minimize write amplification.
          For read-heavy workloads (OLTP, key-value lookups), use leveled compaction to
          minimize read amplification. For mixed workloads, use tiered-leveled compaction
          (RocksDB&apos;s default) to balance both.
        </p>
        <p>
          Size the memtable appropriately for the workload. A larger memtable (256 MB) reduces
          the flush frequency and improves write throughput, but increases recovery time after
          a crash (the WAL must be replayed to rebuild the memtable). A smaller memtable (64 MB)
          reduces recovery time but increases the flush frequency, which can cause compaction
          to fall behind. The recommended memtable size is 128 MB for most workloads, with
          tuning based on observed flush and compaction rates.
        </p>
        <p>
          Monitor compaction health continuously. Track the compaction pending bytes (data
          waiting to be compacted), the compaction flush rate, and the read amplification
          (number of SSTables checked per read). Alert when the compaction pending bytes
          exceed a threshold (e.g., 50% of total disk space), indicating that compaction is
          falling behind and space amplification is increasing.
        </p>
        <p>
          Implement bloom filters for every SSTable with a false positive rate of 1%. This
          eliminates 99% of unnecessary SSTable reads, reducing read amplification from
          O(N) to O(1) for negative lookups. The memory overhead of bloom filters is
          approximately 10 bits per key, which is negligible compared to the data stored
          in the SSTables.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most common pitfall is choosing leveled compaction for a write-heavy workload.
          Leveled compaction minimizes read amplification but maximizes write amplification
          (10-50x), which can overwhelm the disk I/O bandwidth and cause compaction to fall
          behind. The fix is to use size-tiered or tiered-leveled compaction for write-heavy
          workloads, which reduces write amplification to O(log N) while accepting higher
          read amplification.
        </p>
        <p>
          Not monitoring compaction health means you won&apos;t know when compaction is falling
          behind until the system runs out of disk space or read latency spikes. The fix is to
          instrument compaction with metrics (pending bytes, flush rate, read amplification)
          and set alerts on abnormal values (pending bytes &gt; 50% of disk space, read
          amplification &gt; 10 SSTables per read).
        </p>
        <p>
          Using a memtable that is too large causes long recovery times after a crash. The
          WAL must be replayed to rebuild the memtable, and a large memtable means a large
          WAL. For a 256 MB memtable, the WAL may be several gigabytes, and replaying it can
          take minutes. The fix is to size the memtable based on the acceptable recovery time
          (e.g., 128 MB for 30-second recovery, 64 MB for 15-second recovery).
        </p>
        <p>
          Not implementing bloom filters causes unnecessary SSTable reads for negative
          lookups. Without bloom filters, a read that misses in the memtable must check
          every SSTable, which can be dozens of files. With bloom filters, 99% of these
          checks are eliminated immediately. The fix is to enable bloom filters for every
          SSTable with a 1% false positive rate.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>RocksDB: LSM Tree for High-Throughput Storage</h3>
        <p>
          RocksDB (forked from Google&apos;s LevelDB) is the most widely used LSM tree
          implementation, powering Cassandra, MongoDB, TiDB, CockroachDB, and many other
          databases. RocksDB implements tiered-leveled compaction, bloom filters, and
          configurable memtable size. It is used by Meta (Facebook) for its social graph
          database, where it ingests billions of writes per day with sub-millisecond latency
          and serves millions of reads per second.
        </p>

        <h3>InfluxDB: Time-Series Data with LSM Trees</h3>
        <p>
          InfluxDB uses an LSM tree variant (TSM tree) for time-series data storage. Time-series
          data is inherently write-heavy (continuous ingestion from sensors, applications, and
          infrastructure), making LSM trees the ideal storage engine. InfluxDB&apos;s TSM tree
          uses size-tiered compaction to minimize write amplification, enabling ingestion of
          millions of data points per second with minimal I/O overhead.
        </p>

        <h3>Apache Cassandra: Wide-Column LSM Storage</h3>
        <p>
          Cassandra uses an LSM tree storage engine (based on Google&apos;s Bigtable design)
          for wide-column data. Each Cassandra node maintains a memtable and flushes SSTables
          to disk using size-tiered compaction (configurable to leveled). Cassandra&apos;s
          LSM tree design enables linear write scalability: adding more nodes increases the
          total write throughput linearly, because each node handles its own writes
          independently.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is an LSM tree and when should you use it?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              An LSM tree is a storage engine architecture optimized for high write throughput
              by batching random writes into sequential writes. Writes buffer in a memtable
              (memory), flush to immutable SSTables (disk), and compact in the background.
              LSM trees provide 10-100x higher write throughput than B-trees but 2-5x higher
              read latency.
            </p>
            <p>
              Use LSM trees for write-heavy workloads (time-series, logging, event sourcing,
              wide-column stores). Use B-trees for read-heavy workloads (OLTP, analytics)
              where read latency is the primary concern.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What are the three amplification factors in LSM trees?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Write amplification: compaction rewrites the same data multiple times as it moves
              from Level 0 to Level N. With leveled compaction, write amplification is 10-50x.
              Read amplification: reads may need to check multiple SSTables (memtable +
              immutable memtables + SSTables from each level). Bloom filters reduce this to
              2-3 SSTables per read. Space amplification: obsolete entries are retained until
              compaction, consuming additional disk space.
            </p>
            <p>
              Compaction strategy determines the balance: size-tiered minimizes write
              amplification but maximizes read and space amplification; leveled minimizes
              read amplification but maximizes write amplification.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How do bloom filters reduce read amplification in LSM trees?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Each SSTable has a bloom filter that allows the storage engine to quickly
              determine whether a key is present in the SSTable. If the bloom filter returns
              negative, the key is definitely not in the SSTable, and the read skips the
              file. If positive, the key may be present, and the read must check the file.
            </p>
            <p>
              With a 1% false positive rate, bloom filters eliminate 99% of unnecessary
              SSTable reads, reducing read amplification from O(N) to O(1) for negative
              lookups. The memory overhead is approximately 10 bits per key, which is
              negligible compared to the data stored in SSTables.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How do you choose between size-tiered and leveled compaction?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Size-tiered compaction merges SSTables of similar size, minimizing write
              amplification (O(log N) rewrites per entry) but maximizing read amplification
              (reads may check many SSTables). Use it for write-heavy workloads (time-series,
              logging) where write throughput is the primary concern.
            </p>
            <p>
              Leveled compaction merges SSTables across levels, minimizing read amplification
              (reads check at most one SSTable per level) but maximizing write amplification
              (10-50x rewrites). Use it for read-heavy workloads (OLTP, key-value lookups)
              where read latency is the primary concern. For mixed workloads, use tiered-leveled
              compaction (RocksDB default) to balance both.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: What happens when compaction falls behind?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              When compaction falls behind, SSTables accumulate, increasing read amplification
              (reads check more SSTables) and space amplification (obsolete entries consume
              disk space). If compaction falls far enough behind, the system may run out of
              disk space, causing writes to fail.
            </p>
            <p>
              Detect this by monitoring compaction pending bytes (data waiting to be compacted)
              and alert when it exceeds a threshold (e.g., 50% of disk space). Mitigate by
              increasing compaction threads, throttling client writes to leave headroom for
              compaction I/O, or temporarily switching to a compaction strategy with lower
              write amplification.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: How does an LSM tree handle deletes?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Deletes are handled through tombstones: a special marker written to the memtable
              indicating that the key has been deleted. The tombstone is flushed to an SSTable
              like any other write. When a read encounters a tombstone, it returns not found.
              The tombstone is retained until compaction merges the SSTable containing the
              tombstone with the SSTable containing the original value, at which point both
              the value and the tombstone are discarded.
            </p>
            <p>
              Tombstones contribute to space amplification until compaction removes them.
              For workloads with many deletes, compaction must run frequently enough to
              reclaim space from tombstones, otherwise disk usage grows unbounded.
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
              href="https://www.cs.umb.edu/~poneil/LSM.pdf"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              O&apos;Neil et al. (1996): The Log-Structured Merge-Tree
            </a>{" "}
            — The original LSM tree paper.
          </li>
          <li>
            <a
              href="https://rocksdb.org/docs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              RocksDB Documentation
            </a>{" "}
            — Production-grade LSM tree implementation with tiered-leveled compaction.
          </li>
          <li>
            <a
              href="https://cassandra.apache.org/doc/latest/cassandra/developing/architecture/lsm.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cassandra: LSM Tree Architecture
            </a>{" "}
            — How Cassandra uses LSM trees for wide-column storage.
          </li>
          <li>
            <a
              href="https://www.influxdata.com/blog/how-time-series-database-works/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              InfluxDB: TSM Tree Storage Engine
            </a>{" "}
            — How InfluxDB uses an LSM tree variant for time-series data.
          </li>
          <li>
            Martin Kleppmann,{" "}
            <em>Designing Data-Intensive Applications</em>, O&apos;Reilly, 2017. Chapter 3
            (Storage and Retrieval).
          </li>
          <li>
            <a
              href="https://smalldatum.blogspot.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mark Callaghan&apos;s Blog: LSM Tree Performance
            </a>{" "}
            — Deep analysis of LSM tree compaction strategies and amplification factors.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
