"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "b-trees",
  title: "B-Trees & B+ Trees",
  description: "The disk-friendly self-balancing tree behind nearly every relational database index — high-fanout nodes match page sizes, keep height tiny, and turn billion-row lookups into 4 page reads.",
  category: "other",
  subcategory: "data-structures",
  slug: "b-trees",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-04-18",
  tags: ["b-trees", "b-plus-trees", "indexes", "databases", "data-structures"],
  relatedTopics: ["trees", "lsm-trees", "hash-tables"],
};

export default function BTreesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition &amp; Context</h2>
        <p className="mb-4">
          A B-tree is a self-balancing search tree designed for storage systems where reading a node is far more expensive than comparing keys within one. Unlike a binary search tree, each B-tree node holds many keys (often hundreds) and has correspondingly many children. The high fanout keeps the tree shallow — typically 3 to 5 levels for billions of records — so locating any key requires only a handful of page reads from disk or SSD.
        </p>
        <p className="mb-4">
          Rudolf Bayer and Edward McCreight invented the B-tree in 1972 at Boeing Scientific Research Labs to manage indexes on rotating magnetic drums. The defining insight: align the node size with the underlying storage page size (then a few KB, today typically 4 KB or 16 KB) so each node read is exactly one I/O. The structure has remained the dominant database index format for fifty years; PostgreSQL, MySQL InnoDB, SQL Server, Oracle, SQLite, and MongoDB&apos;s WiredTiger all use B-trees (specifically the B+ tree variant) for primary indexes.
        </p>
        <p>
          The B+ tree, developed shortly after, modifies the structure so that data records live only in leaf nodes; internal nodes contain only routing keys, and leaves are connected by a doubly-linked list. This raises fanout (no payloads in internals) and makes range scans trivially cheap — the dominant access pattern for SQL <code>BETWEEN</code> queries, ORDER BY + LIMIT, and pagination.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>
        <p className="mb-4">
          A B-tree of order m satisfies four invariants. Every node holds between ⌈m/2⌉ and m children (the root is allowed 2 to m). Keys within each node are sorted, with child[i]&apos;s keys all less than key[i] and child[i+1]&apos;s keys all greater. All leaves sit at the same depth — the tree is height-balanced. The half-full lower bound guarantees worst-case O(log_m n) operations even after arbitrary deletions.
        </p>
        <p className="mb-4">
          The fanout-vs-depth math is the whole point. With m = 200 (typical for a 4 KB page holding 200-ish key/pointer pairs), one billion records fit in ⌈log₂₀₀ 10⁹⌉ = 4 levels. Add the buffer pool — modern databases pin the root and upper levels in memory — and a typical lookup hits disk only at the leaf: one I/O for billions of rows. This is why B-trees stayed dominant when memory grew faster than disk: caching the upper tree converts most lookups to a single seek.
        </p>
        <p className="mb-4">
          Search starts at the root and walks down: within each node, binary search finds the right child pointer (or the matching key, in classical B-trees). This costs O(log m) comparisons per node times O(log_m n) levels — about O(log n) total comparisons, the same as a binary search tree, but with vastly fewer node reads. Because comparisons within a cached node are nearly free relative to a page read, the depth metric is what matters in practice.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/b-trees-diagram-1.svg"
          alt="B-tree with high-fanout nodes and shallow depth matched to disk page size"
          caption="Figure 1: A wide-fanout B-tree — each node holds many keys, so even with billions of records the tree stays only a few levels deep."
        />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture &amp; Flow</h2>
        <p className="mb-4">
          Insertion preserves the invariants by splitting full nodes. Walk down to the appropriate leaf, insert the key in sorted position. If the leaf now holds more than m − 1 keys, split it at the median: the median key promotes to the parent (with a pointer to the new right leaf), and the leaf becomes two half-full leaves. If promotion overflows the parent, recurse upward. Tree height grows only when the root itself splits, producing a new root with one separator key.
        </p>
        <p className="mb-4">
          Deletion mirrors this. Remove the key from its node; if a leaf falls below ⌈m/2⌉ − 1 keys, borrow a key from a sibling (rotate through the parent) or merge with a sibling (pulling a separator key down from the parent). Underflow may propagate upward, potentially shrinking the tree height. Many production systems lazily defer rebalancing — they tolerate underfull pages until a maintenance pass reclaims space.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/b-trees-diagram-2.svg"
          alt="B-tree node split during insertion promoting the median key upward to the parent"
          caption="Figure 2: Insert that overflows a leaf — split at the median, promote the median key into the parent, recurse if the parent overflows."
        />
        <p className="mb-4">
          The B+ tree variant changes one thing: data records live only in leaves. Internal nodes hold separator keys for routing but no payloads. Every leaf is connected to its left and right neighbor via sibling pointers, forming a doubly-linked list at the leaf level. Range scans descend once to the start key, then walk the leaf chain — no further descents into the upper tree, no key duplication across levels for the scan path.
        </p>
        <p>
          Concurrency is the hardest production aspect. The classical approach is <em>latch coupling</em>: hold a latch on the parent while acquiring the child latch, then release the parent. For modifying operations, hold latches on the path until the operation is &quot;safe&quot; (the leaf won&apos;t propagate a split or merge upward). PostgreSQL uses a Lehman-Yao variant with right-link pointers that lets readers proceed without locking the entire path. Modern in-memory engines like Microsoft&apos;s Bw-tree go further with lock-free delta records for cache-coherent concurrency.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Trade-offs &amp; Comparisons</h2>
        <p className="mb-4">
          B-trees update <em>in place</em> — modifying a key dirties the page containing it, which is then written back to storage. This makes them read-optimized: a point lookup is one walk down the tree, hitting log_m n pages. The trade-off is write amplification: a small change touches a whole page, and split operations rewrite multiple pages. On flash storage where erase blocks are large, this matters; on spinning disks it&apos;s less material.
        </p>
        <p className="mb-4">
          LSM trees take the opposite approach: append all writes to an in-memory MemTable, periodically flush to immutable on-disk SSTables, merge them via background compaction. Writes are sequential and cheap; reads must check multiple levels and rely on Bloom filters to avoid spurious I/O. RocksDB, LevelDB, Cassandra, and ScyllaDB all use LSM trees. Choose B+ trees for read-heavy workloads with random-access patterns; choose LSM for write-heavy ingest workloads where reads are mostly sequential or filtered.
        </p>
        <p className="mb-4">
          Compared with hash indexes, B+ trees support range queries (hashes don&apos;t), give predictable O(log n) lookup time, and integrate naturally with sorted iteration. Hash indexes win for pure point-lookup workloads with no ordering needs (Redis hash sets, hash join build tables). PostgreSQL supports both; hash indexes are rare in practice because B-tree lookups are nearly as fast and far more flexible.
        </p>
        <p>
          Compared with skip lists (used in Redis sorted sets, LevelDB MemTables), B+ trees pack more keys per cache line, perform better on disk, and give deterministic worst-case bounds. Skip lists win on simplicity of concurrent implementation and on in-memory workloads where pointer chasing is acceptable.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Choose primary keys that fit in pages well</strong>: short integers or sequential UUIDs (UUIDv7) keep fanout high. Random UUIDs (UUIDv4) cause leaf splits everywhere on insert; switch to time-ordered UUIDs to keep inserts at the &quot;right edge&quot; of the tree.</li>
          <li><strong>Use covering indexes</strong> for hot read paths. A query that can be satisfied entirely from index leaves (no row-table fetch) avoids an extra I/O hop. PostgreSQL <code>INCLUDE</code> clause and InnoDB&apos;s clustered-key trick make this explicit.</li>
          <li><strong>Tune fillfactor</strong> when you know the workload. PostgreSQL&apos;s default 90% leaves room for HOT updates without page splits; bulk-load systems can use 100% for density. InnoDB&apos;s page merge threshold (50% by default) controls when to merge underfull leaves.</li>
          <li><strong>Measure index bloat periodically</strong>. Long-running transactions and update-heavy workloads cause B-tree bloat; PostgreSQL <code>pg_stat_user_indexes</code> and <code>pgstattuple</code> show fragmentation. <code>REINDEX CONCURRENTLY</code> rebuilds without downtime.</li>
          <li><strong>Prefer composite indexes over multiple single-column ones</strong> when queries filter on the same column combinations. (a, b) covers (a) but (b) alone needs its own index.</li>
          <li><strong>Match index type to workload</strong>: B-tree for ordered/range/equality, hash (where supported) for pure equality with no ordering, GiST/GIN for full-text and geospatial, BRIN for naturally ordered append-only data on huge tables.</li>
          <li><strong>Use prefix compression and deduplication</strong> when supported. PostgreSQL 13&apos;s deduplication and InnoDB compressed pages materially raise effective fanout.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Random-UUID primary keys</strong> cause inserts to land all over the tree, producing constant page splits and write amplification. Switch to UUIDv7 or sequential surrogate keys; if random IDs are required, accept the cost or front them with a clustered surrogate.</li>
          <li><strong>Wide rows with many columns indexed</strong> bloat leaf pages and reduce fanout. Either drop unused indexes (writes maintain every index, even unused ones) or reorganize wide tables into narrower ones.</li>
          <li><strong>Updates that grow a row</strong> beyond its original page space trigger page splits even on indexed columns. PostgreSQL HOT updates avoid this if no indexed column changes; design schemas so hot-updated columns aren&apos;t indexed.</li>
          <li><strong>Index-only scans broken by visibility map</strong>: PostgreSQL&apos;s index-only scan needs the visibility map up to date. Bulk loads without VACUUM leave the visibility map stale, forcing heap fetches even on covering indexes.</li>
          <li><strong>Long-running transactions</strong> hold dead tuples in B-tree leaves visible to old snapshots, preventing reclamation. Unbounded growth follows. Set <code>idle_in_transaction_session_timeout</code>; monitor <code>pg_stat_activity</code> for long sessions.</li>
          <li><strong>Excessive secondary indexes</strong>: each one costs storage, write amplification, and competes for buffer pool. The classic mistake is &quot;index every column just in case.&quot; Drop indexes with zero hits in <code>pg_stat_user_indexes</code>.</li>
          <li><strong>Page tearing without doublewrite</strong>: a 16 KB page write crashing mid-flush can leave the page partially written. InnoDB&apos;s doublewrite buffer and PostgreSQL&apos;s full_page_writes guarantee crash safety; turning these off for performance is dangerous without WAL replay support.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>
        <p className="mb-4">
          <strong>Relational database indexes</strong> are the canonical use. PostgreSQL, MySQL InnoDB, SQL Server, Oracle, and SQLite all default to B+ trees for primary and secondary indexes. InnoDB clusters the table itself by primary key — the clustered index <em>is</em> the table — which makes PK lookups one I/O cheaper but secondary lookups require an extra hop unless they cover the query.
        </p>
        <p className="mb-4">
          <strong>Filesystem metadata</strong>: ext4, XFS, NTFS, and APFS use B-trees (or B+ trees) for directory structures and inode lookups. ZFS uses a copy-on-write B-tree variant for both metadata and data, sacrificing in-place updates for snapshot capability and crash safety.
        </p>
        <p className="mb-4">
          <strong>Document and key-value stores</strong>: MongoDB&apos;s WiredTiger storage engine uses B+ trees with row-store and column-store variants. Couchbase and FoundationDB use B-trees for sorted indexes alongside other structures. SQLite — the most-deployed database in the world, embedded in every smartphone — is a single-file B-tree.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/b-trees-diagram-3.svg"
          alt="B+ tree showing leaf-level linked list enabling efficient range scans"
          caption="Figure 3: B+ tree variant — internal nodes are pure routing, leaves are linked, range scans walk the leaf chain after a single descent."
        />
        <p className="mb-4">
          <strong>Modern variants in production</strong>: Microsoft&apos;s SQL Server Hekaton in-memory engine uses the Bw-tree, a lock-free B-tree built on delta-record chains and atomic CAS. CockroachDB and TiDB layer SQL over LSM-tree storage (RocksDB and Pebble) but use B-tree-style range partitioning at the cluster level. Apple&apos;s FoundationDB uses Redwood, a copy-on-write B+ tree designed for SSD characteristics. The B-tree pattern keeps adapting to new hardware: NVMe-aware variants reduce write amplification, while persistent-memory variants exploit byte-addressable storage.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why does almost every database use B+ trees instead of binary search trees or red-black trees?</p>
            <p className="mt-2 text-sm">A: Because the cost model is different. In a BST or red-black tree, each comparison is a pointer chase that may miss cache. With billions of records and depth ~30, that&apos;s 30 cache misses or worse — 30 disk reads if data spills to disk. A B+ tree of order 200 has depth 4 for the same data; each node is a single page read containing 200 keys to binary-search through (in cache). The trade is &quot;compare more keys per node, walk fewer levels&quot; — a perfect match for storage hierarchies where reading the next page is many orders of magnitude slower than comparing keys already in cache.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: A team is migrating from auto-incrementing integer PKs to UUIDv4. Predict what happens.</p>
            <p className="mt-2 text-sm">A: Bad things. With auto-incrementing keys, every insert appends to the rightmost leaf — that page stays hot in cache, and splits happen predictably at the &quot;edge&quot; of the tree. With random UUIDs, each insert lands somewhere different in the leaf level. The relevant page must be loaded into cache (often a cache miss), modified, possibly split, and written back. Insert throughput drops sharply, write amplification rises, and the buffer pool churns through the entire leaf level instead of caching the hot edge. Index size also grows because UUIDs are 16 bytes vs 4-8 for integers, lowering fanout. Fix: use UUIDv7 (time-ordered) or keep integer surrogate PKs with UUID as a secondary unique index.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Walk through how InnoDB handles a row update where one indexed column changes.</p>
            <p className="mt-2 text-sm">A: The clustered index (primary-key B+ tree) stores the row itself. Changing a non-indexed column may use a HOT-style in-place update if the row still fits the page — no index changes needed. Changing an indexed column means: (1) the secondary index entry pointing to the old value must be removed, (2) a new entry added with the new value pointing to the same PK, (3) if the row size changed, possibly a page split in the clustered index. All of this happens within a transaction, with WAL records written to the redo log for crash recovery. Each affected page goes through the doublewrite buffer to survive partial-page writes. Multiple secondary indexes multiply the cost — every index on the changed column needs its own update.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Explain when an LSM tree beats a B+ tree, and vice versa.</p>
            <p className="mt-2 text-sm">A: LSM wins for write-heavy workloads with sequential or filtered reads — time-series, event ingestion, write-once-read-rarely data. Writes go to an in-memory MemTable, then flush to immutable SSTables, then compact in the background. Sequential I/O patterns suit SSDs, write amplification is amortized. B+ trees win for read-heavy or mixed workloads with random-access patterns and frequent updates — OLTP databases, document stores with hot data. Lookups are one walk down with predictable latency; updates are in-place. The crossover depends on read/write ratio, point-vs-range query mix, and storage characteristics. Many systems hedge: RocksDB has a B-tree-like memtable on top; CockroachDB layers SQL with B-tree semantics over RocksDB&apos;s LSM.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a covering index and when does it help?</p>
            <p className="mt-2 text-sm">A: A covering index includes (in its leaf entries) every column the query needs, so the database can answer the query without ever fetching the underlying row. In a B+ tree, this means one descent to the leaf and the answer is right there; without coverage, the leaf gives you a row pointer (heap TID in PostgreSQL, PK in InnoDB secondary indexes) and you pay another lookup. PostgreSQL&apos;s INCLUDE clause adds non-key columns to the leaf; InnoDB always carries the PK as the secondary-index payload, so secondary indexes that select only the PK plus indexed columns are implicitly covering. Use it for hot read paths where the extra storage cost is justified by the saved I/O. Don&apos;t over-include; wide leaves hurt fanout and write performance.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do modern engines handle B+ tree concurrency?</p>
            <p className="mt-2 text-sm">A: Latch coupling is the classical approach: take a latch on the parent, then on the child, then release the parent (&quot;crab walking&quot;). For modifications, hold latches on the path until the operation is &quot;safe&quot; — meaning the leaf won&apos;t cause a split or merge propagating up. Lehman-Yao&apos;s B-link tree (used by PostgreSQL) adds a right-link pointer at each level so readers can detect concurrent splits and follow the link without re-traversing — this lets readers and writers coexist with much lower contention. Microsoft&apos;s Bw-tree goes further with lock-free delta records: modifications append a delta to a chain rather than mutating the page in place, with periodic consolidation. Each design trades implementation complexity for concurrency throughput; for typical OLTP workloads, B-link with optimistic latching is the modern sweet spot.</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">References &amp; Further Reading</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Bayer, R., &amp; McCreight, E. (1972). <em>Organization and Maintenance of Large Ordered Indices</em>. Acta Informatica — the original B-tree paper.</li>
          <li>Comer, D. (1979). <em>The Ubiquitous B-Tree</em>. ACM Computing Surveys — survey of B-tree variants and applications, still widely cited.</li>
          <li>Lehman, P. L., &amp; Yao, S. B. (1981). <em>Efficient Locking for Concurrent Operations on B-Trees</em>. ACM TODS — introduces B-link trees, used by PostgreSQL.</li>
          <li>Graefe, G. (2011). <em>Modern B-Tree Techniques</em>. Foundations and Trends in Databases — comprehensive survey covering compression, concurrency, and recovery.</li>
          <li>Levandoski, J., et al. (2013). <em>The Bw-Tree: A B-tree for New Hardware Platforms</em>. ICDE — Microsoft&apos;s lock-free B-tree variant for in-memory engines.</li>
          <li>PostgreSQL Documentation: <em>Indexes — B-Tree Implementation</em> — internals of PostgreSQL&apos;s nbtree access method including deduplication and concurrent operations.</li>
          <li>MySQL Reference Manual: <em>InnoDB Storage Engine — Clustered and Secondary Indexes</em> — InnoDB&apos;s clustered B+ tree design.</li>
          <li>Petrov, A. (2019). <em>Database Internals</em>. O&apos;Reilly — chapters 2–4 give a clear modern treatment of B-tree variants alongside LSM trees.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
