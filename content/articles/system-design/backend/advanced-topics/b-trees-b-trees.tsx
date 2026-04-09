"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-advanced-topics-b-trees-b-trees",
  title: "B-trees & B+ Trees",
  description: "Understand the index structures behind many databases: page-oriented balanced trees, range-scan behavior, node splitting, write amplification, read performance, and database index structures for production-scale systems.",
  category: "backend",
  subcategory: "advanced-topics",
  slug: "b-trees-b-trees",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-08",
  tags: ["backend", "advanced", "data-structures", "databases", "b-trees", "b-plus-trees", "indexing"],
  relatedTopics: ["lsm-trees", "database-indexing", "query-optimization-techniques"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>B-trees</strong> and <strong>B+ trees</strong> are balanced, page-oriented tree data structures designed for storage systems where data lives on fixed-size blocks—disk pages or SSD blocks. They minimize random I/O by maximizing fanout: each node stores many keys, so the tree remains shallow even for datasets with hundreds of millions of entries. Where a binary search tree would have height proportional to log₂(n), a B-tree with fanout 100 has height proportional to log₁₀₀(n)—meaning a billion keys fit in three levels.
        </p>
        <p>
          These structures are the foundation of database indexes in MySQL (InnoDB), PostgreSQL, SQLite, and virtually every relational database engine. They support both point lookups and range scans with predictable, bounded performance. The distinction between B-trees and B+ trees matters: B-trees can store records in both internal nodes and leaves, while B+ trees store all actual data exclusively in leaf nodes and link leaves together as a sorted chain.
        </p>
        <p>
          The design decision to use page-oriented nodes rather than individual node records is driven by the physics of storage. A disk seek costs milliseconds; a sequential page read costs microseconds. By sizing each node to match a page (typically 4 KB to 16 KB), a B-tree ensures each tree level requires at most one page read. With upper levels cached in a buffer pool, many lookups require only a single leaf page access.
        </p>
        <p>
          For staff/principal engineers, understanding B-trees is essential because index behavior directly impacts system performance, storage costs, and operational reliability. Write patterns cause page splits that amplify I/O. Monotonic key patterns create write hotspots on the rightmost leaf. Read performance depends on cache hit ratios and page locality. Index bloat from churn increases storage costs and degrades query latency over time.
        </p>
        <p>
          In system design interviews, B-trees demonstrate deep understanding of storage engines, index selection, and the trade-offs between read-optimized and write-optimized structures. You should be able to explain why databases default to B+ trees, when LSM trees are preferable, and how operational tuning like fill factor affects production behavior.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/advanced-topics/btree-node-structure.svg"
          alt="B-tree node structure showing page-oriented node layout with key slots, child pointers, and internal node organization"
          caption="B-tree node structure — each node is a page-sized unit containing multiple keys and child pointers, maximizing fanout to minimize tree height"
        />

        <h3>Page-Oriented Storage and Node Structure</h3>
        <p>
          The fundamental insight behind B-trees is that storage systems read and write in pages, not individual records. A B-tree node is designed to occupy exactly one page (or a small multiple). Each internal node contains up to M-1 keys and M child pointers, where M is the fanout determined by page size divided by the size of a key-pointer pair. For a 16 KB page with 8-byte keys and 8-byte pointers, M is approximately 500, meaning a three-level tree can hold 125 billion entries.
        </p>
        <p>
          Leaf nodes contain key-value pairs or key-record-id pairs, depending on whether the index is clustered or secondary. In a clustered index, the leaf pages contain the actual table data, ordered by the primary key. In a secondary index, leaf pages contain the indexed key and a pointer (typically the primary key) to the actual row. This distinction has major performance implications: secondary index lookups require two index traversals—the secondary index lookup followed by a primary key lookup (a "bookmark lookup" in SQL Server terminology).
        </p>
        <p>
          B+ trees improve on this by storing all data in leaves and linking leaves as a doubly-linked list. Internal nodes contain only keys and child pointers, serving purely as a routing structure. This design gives B+ trees two advantages: internal nodes can hold more routing keys since they carry no data payloads, and range scans follow leaf links without re-traversing the tree.
        </p>

        <h3>Node Splitting and Structural Maintenance</h3>
        <p>
          When inserting into a full node, the B-tree performs a <strong>node split</strong>. The node's keys are divided between the original node and a newly allocated node, and a separator key is promoted to the parent. If the parent is also full, the split propagates upward, potentially all the way to the root. A root split increases tree height by one and is the only operation that changes tree height.
        </p>
        <p>
          Node splitting is the primary source of write amplification in B-trees. A single logical insert can trigger multiple page allocations, parent pointer updates, and potentially a root rewrite. Under heavy write workloads, split frequency directly impacts tail latency because splits involve exclusive locks on multiple nodes. The write pattern matters enormously: monotonic inserts (ascending keys) always split the rightmost leaf, creating a write hotspot. Random inserts spread splits across the tree but increase fragmentation.
        </p>
        <p>
          Deletion works symmetrically. When a node falls below the minimum fill threshold (typically half-full), it may <strong>merge</strong> with a sibling or <strong>redistribute</strong> keys between siblings. Many production databases avoid aggressive merging because it creates churn. Instead, they tolerate underfull nodes and rely on periodic maintenance (VACUUM in PostgreSQL, OPTIMIZE TABLE in MySQL) to restore page density.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/advanced-topics/btree-operations.svg"
          alt="B-tree operations showing insert with node split propagation and delete with merge/redistribution between sibling nodes"
          caption="B-tree operations — insert triggers node splits that propagate upward to the root; delete triggers merges or redistributions to maintain balance"
        />

        <h3>Read Performance and Cache Behavior</h3>
        <p>
          B-tree read performance is dominated by cache behavior. The upper levels of the tree (root and first few levels) are accessed on every lookup, so they must remain hot in the buffer pool. For a three-level tree with 500-way fanout, the root and level-one nodes might occupy only a few megabytes—easily cached even on modest systems. The leaf level, however, can span gigabytes or terabytes.
        </p>
        <p>
          Point lookups in a well-cached B-tree require one disk read (the leaf page), yielding predictable sub-millisecond latency when the leaf is not cached. Range scans benefit from B+ tree leaf links: after locating the start key with one tree traversal, iteration proceeds sequentially through linked leaves. Sequential page reads are much faster than random reads because they benefit from prefetching and SSD parallelism.
        </p>
        <p>
          The clustered versus secondary index distinction critically affects read cost. A clustered index lookup returns the full row from the leaf page. A secondary index lookup returns a primary key, requiring a second B-tree traversal to fetch the actual row—a cost called a "key lookup" or "bookmark lookup." For queries selecting only indexed columns, a covering index (where the secondary index includes all needed columns) eliminates the second traversal entirely.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture &amp; Flow</h2>

        <h3>Database Index Architecture</h3>
        <p>
          In a relational database, tables typically have one clustered index (the primary key by default in InnoDB) and zero or more secondary indexes. The clustered index determines the physical order of the table data on disk. Every secondary index leaf entry contains the indexed key plus the clustered key, enabling row lookups. This design means that secondary index size is proportional to table size times the number of secondary indexes.
        </p>
        <p>
          PostgreSQL uses a different approach: it employs a heap-based table storage model where the primary key index is a secondary structure pointing to heap rows. This decouples physical row order from any single index, allowing multiple indexes to serve equally. The trade-off is that PostgreSQL cannot guarantee physical locality for primary key range scans, and index-only scans require a visibility map to avoid heap lookups.
        </p>
        <p>
          The query optimizer uses B-tree statistics—cardinality, value distribution, and page depth—to choose between index scan, full table scan, or index-only scan. Accurate statistics are critical: stale statistics cause the optimizer to choose suboptimal plans, leading to performance regressions after data distribution changes.
        </p>

        <h3>Concurrency and Latching</h3>
        <p>
          Concurrent access to B-trees requires careful coordination. Reading can proceed in parallel, but structural modifications (splits, merges) require exclusive access to affected nodes. Most databases use <strong>latch crabbing</strong> (also called lock coupling): as the traversal descends, it acquires latches on child nodes before releasing parent latches, ensuring a path of protection from root to leaf.
        </p>
        <p>
          Hot page contention is a well-known B-tree performance problem. When many concurrent inserts target the same leaf (e.g., auto-increment primary keys), that leaf becomes a serialization bottleneck. SQL Server detects this pattern and reports PAGELATCH waits. Mitigations include using a non-sequential key (UUID), hash partitioning the index, or accepting the hotspot and tuning buffer pool size to reduce latch hold times.
        </p>

        <h3>Write Path and Durability</h3>
        <p>
          B-tree writes follow a write-ahead log (WAL) pattern for durability. Before modifying a page in the index, the database writes a log record describing the change to the WAL. This ensures that if the system crashes after the page modification but before the page is flushed to disk, the change can be recovered from the WAL during crash recovery.
        </p>
        <p>
          The interaction between WAL and page splits has performance implications. A split generates multiple log records: one for each modified page plus one for the new page allocation. Under write-heavy workloads, WAL volume can become the bottleneck, especially on systems with synchronous replication that waits for the WAL to be transmitted to a replica before acknowledging the write.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/backend/advanced-topics/btree-vs-bplus-tree.svg"
          alt="Comparison of B-tree and B+ tree showing data placement differences — B-tree stores data in internal nodes and leaves while B+ tree stores data only in leaves with linked leaf chain"
          caption="B-tree vs B+ tree — B-tree stores records in both internal nodes and leaves; B+ tree stores all data in leaves with linked leaf chain enabling efficient range scans"
        />
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          The choice between B+ trees and alternative index structures involves fundamental trade-offs between read performance, write performance, and operational complexity. B+ trees excel at read-heavy and mixed workloads with moderate write rates. They provide predictable read latency (bounded by tree height), efficient range scans via linked leaves, and mature operational tooling. The cost is write amplification from page splits, hot page contention under sequential inserts, and index bloat from churn.
        </p>
        <p>
          LSM trees represent the primary alternative for write-heavy workloads. LSM trees convert random writes into sequential appends by buffering writes in an in-memory structure (memtable) and periodically flushing to immutable on-disk files (SSTables). This eliminates page splits entirely and achieves much higher write throughput than B+ trees. The trade-off is read amplification: a point lookup may need to check the memtable plus multiple SSTable levels, requiring Bloom filters to avoid unnecessary disk reads. LSM trees also require periodic compaction, which consumes I/O and can cause latency spikes.
        </p>
        <p>
          Hash indexes offer O(1) point lookups but cannot support range queries, prefix searches, or ordered iteration. They are suitable for key-value stores with pure point-lookup workloads (like memcached) but inadequate for general-purpose database workloads. Fractal trees (used in TokuDB) attempt to combine B-tree read performance with LSM-like write buffering by keeping message buffers at internal nodes, batching updates as they flow down the tree. The complexity and operational maturity of B+ trees, however, has kept them as the default choice for most relational databases.
        </p>
        <p>
          For production systems, the practical guidance is: use B+ trees (the default for MySQL, PostgreSQL, SQLite) for general-purpose workloads with mixed read/write patterns. Use LSM trees (RocksDB, Cassandra, ScyllaDB) for write-heavy workloads where ingestion throughput is the primary concern. Use hash indexes only for pure point-lookup workloads where range queries are never needed.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Design your primary key to avoid write hotspots. Sequential auto-increment keys concentrate inserts on the rightmost leaf, creating contention. Consider using UUIDs (with proper ordering via UUIDv7), hash-based partitioning, or composite keys that distribute writes across multiple leaf pages. For high-throughput systems, evaluate whether your key distribution naturally spreads writes or concentrates them on specific pages.
        </p>
        <p>
          Size your buffer pool to keep the upper tree levels and working set of leaf pages in memory. For InnoDB, the buffer pool should be large enough to hold the entire index for read-heavy workloads, or at minimum the root and intermediate levels plus frequently accessed leaf pages. Monitor buffer pool hit ratio and page read rate to detect cache pressure before it impacts user-facing latency.
        </p>
        <p>
          Use covering indexes to eliminate bookmark lookups. When a query selects only columns that are present in a secondary index, the database can satisfy the query from the index alone without visiting the table data. This is particularly valuable for queries that select a small number of columns from a wide table, where the secondary index is much smaller than the full row.
        </p>
        <p>
          Monitor index bloat and schedule periodic maintenance. In PostgreSQL, run VACUUM regularly to reclaim space from dead tuples and update statistics. In MySQL, use OPTIMIZE TABLE to rebuild tables and indexes when bloat exceeds 20-30%. Track index size growth relative to row count growth: if index size grows faster than row count, bloat is accumulating and maintenance is needed.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most insidious B-tree pitfall is <strong>monotonic key-induced write hotspots</strong>. Auto-increment primary keys, timestamp-based keys, and sequential UUIDs all concentrate writes on the rightmost leaf page. Under high write concurrency, this single page becomes a serialization bottleneck, dramatically increasing p99 latency. Many teams discover this problem only under production load, after months of smooth operation at lower scale. The fix requires schema redesign and potentially data migration, which is disruptive.
        </p>
        <p>
          <strong>Index bloat from churn</strong> silently degrades performance over time. When rows are frequently updated or deleted, pages accumulate free space that is not immediately reclaimed. Over weeks or months, indexes grow significantly larger than necessary, increasing cache misses and I/O. The degradation is gradual enough that teams often fail to notice until query latency drifts upward and correlation with index bloat becomes clear only through careful monitoring.
        </p>
        <p>
          <strong>Selecting the wrong clustered index</strong> is a structural mistake that is expensive to correct. The clustered index determines physical data order, and changing it requires a full table rebuild. If your most common queries are range scans on a timestamp but your clustered index is on an auto-increment ID, every range scan requires a full index scan plus bookmark lookups. Evaluate your dominant query patterns before choosing the clustered key.
        </p>
        <p>
          <strong>Ignoring secondary index costs</strong> leads to storage and write amplification. Each secondary index adds write overhead (every insert must update all relevant indexes) and consumes storage proportional to table size times the number of indexes. Tables with many secondary indexes experience significantly slower write throughput. The discipline is to create only indexes that serve specific query patterns and to periodically audit index usage statistics, dropping unused indexes.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce: Order Range Queries with B+ Tree Indexes</h3>
        <p>
          An e-commerce platform needed to support queries like "all orders between two timestamps" for reporting and customer support. The solution was a B+ tree index on the order timestamp column. The B+ tree's linked leaf structure enables efficient range scans: locate the starting leaf with a single tree traversal, then iterate through linked leaves sequentially. Under 500K daily orders, the index maintained sub-millisecond point lookups and sub-second range scans across millions of rows.
        </p>

        <h3>Multi-Tenant SaaS: Avoiding Write Hotspots</h3>
        <p>
          A multi-tenant SaaS platform used auto-increment IDs as primary keys and experienced p99 latency spikes under load. Investigation revealed monotonic inserts concentrating writes on the rightmost leaf. The fix was switching to UUIDv7 keys, which are time-sortable (preserving range query efficiency) but distribute writes across multiple leaf pages. Write throughput increased 3x and p99 latency stabilized.
        </p>

        <h3>Analytics Platform: Index Bloat Management</h3>
        <p>
          An analytics platform with high update/delete churn on event records experienced gradual query latency degradation over six months. Index size had grown 3x relative to row count due to page fragmentation from updates. Implementing a weekly VACUUM schedule and tuning fill factor from 100 to 85% (leaving room for future updates) restored index density and reduced query latency by 60%.
        </p>

        <h3>Content Management: Covering Index Optimization</h3>
        <p>
          A CMS platform had a slow "list articles by author" query that required bookmark lookups for each result. Creating a covering index on (author_id, created_at, title, status) allowed the database to satisfy the query entirely from the secondary index, eliminating heap lookups. Query latency dropped from 50ms to 5ms, and the query no longer contributed to heap page cache pressure.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: Why do databases prefer B+ trees over B-trees?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              B+ trees store all data exclusively in leaf nodes, while internal nodes serve purely as routing structures. This provides two key advantages. First, internal nodes can hold more routing keys because they carry no data payloads, increasing fanout and reducing tree height. Second, leaf nodes are linked together as a doubly-linked chain, enabling efficient range scans by sequential iteration through leaves without re-traversing the tree.
            </p>
            <p>
              B-trees store records in both internal nodes and leaves, which wastes internal node capacity on data and makes range scans less efficient because the traversal must visit internal nodes that may contain qualifying records. For database workloads dominated by range queries and ordered iteration, B+ trees are the superior choice.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What causes write amplification in B-trees?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Write amplification in B-trees is primarily caused by node splits. When a node fills during an insert, the node must be split into two nodes, a separator key promoted to the parent, and parent pointers updated. A single logical insert can trigger multiple page writes if splits propagate up the tree. Root splits are especially expensive because they increase tree height and require rewriting the root page.
            </p>
            <p>
              Additionally, the write-ahead log amplifies writes further: each page modification generates a log record, and a single split generates multiple log records for each affected page. Under monotonic insert patterns, splits concentrate on the rightmost leaf, creating write hotspots that amplify contention and tail latency.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: When would you choose an LSM tree over a B+ tree?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Choose LSM trees when write throughput is the primary concern and the workload is write-heavy. LSM trees convert random writes into sequential appends by buffering writes in memory (memtable) and flushing to immutable on-disk files (SSTables). This eliminates page splits entirely and achieves significantly higher write throughput than B+ trees. Systems like Cassandra, RocksDB, and ScyllaDB use LSM trees for this reason.
            </p>
            <p>
              The trade-off is read amplification: LSM lookups may need to check multiple SSTable levels, requiring Bloom filters to avoid unnecessary reads. LSM trees also require periodic compaction, which consumes I/O bandwidth and can cause latency spikes. For mixed or read-heavy workloads, B+ trees remain the better choice due to predictable read latency and efficient range scans.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How do sequential primary keys cause write hotspots?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Sequential primary keys (auto-increment integers, timestamp-based keys) always insert at the rightmost position in the B+ tree. Every insert targets the same leaf page until that page fills and splits. This means all concurrent writes contend for a single leaf page's latch, serializing what should be parallel operations. The result is dramatically increased p99 latency and reduced write throughput under concurrency.
            </p>
            <p>
              Mitigations include using UUIDv7 (time-sortable but distributed across multiple pages), hash-partitioned keys, or composite keys that incorporate a shard identifier. The key insight is that write distribution across leaf pages is more important than key simplicity for high-throughput systems.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: What is a covering index and why does it matter?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              A covering index is a secondary index that contains all columns needed to satisfy a query, eliminating the need for a bookmark lookup (key lookup) to the clustered index. When a query selects only columns present in the secondary index, the database can return results entirely from the index pages.
            </p>
            <p>
              This matters because secondary index lookups normally require two B-tree traversals: one to find the key in the secondary index, and another to fetch the full row from the clustered index using the primary key stored in the secondary index leaf. A covering index eliminates the second traversal, reducing I/O by half for that query and reducing pressure on the clustered index buffer pool.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: How does index bloat affect performance?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Index bloat occurs when pages accumulate free space from updates and deletes but are not compacted. Bloated indexes consume more disk space and, more critically, more buffer pool memory for the same number of logical entries. This reduces the cache hit ratio because fewer useful pages fit in memory, increasing disk reads for both point lookups and range scans.
            </p>
            <p>
              The degradation is gradual and often goes unnoticed. Index size grows faster than row count, and query latency drifts upward over weeks or months. The fix is periodic maintenance: VACUUM in PostgreSQL reclaims dead tuples, and OPTIMIZE TABLE in MySQL rebuilds indexes. Tuning fill factor below 100% leaves room for updates, reducing future bloat accumulation.
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
            <a href="https://en.wikipedia.org/wiki/B%2B_tree" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Wikipedia: B+ tree
            </a> — Comprehensive overview of B+ tree structure, operations, and properties.
          </li>
          <li>
            <a href="https://dev.mysql.com/doc/refman/8.0/en/innodb-index-types.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MySQL: InnoDB Index Types
            </a> — Detailed documentation of InnoDB's B+ tree index implementation.
          </li>
          <li>
            <a href="https://www.postgresql.org/docs/current/indexes.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              PostgreSQL: Indexes
            </a> — PostgreSQL index types, B-tree implementation, and operational guidance.
          </li>
          <li>
            <a href="https://en.wikipedia.org/wiki/Log-structured_merge-tree" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Wikipedia: LSM Tree
            </a> — Log-structured merge-tree structure and comparison to B-trees.
          </li>
          <li>
            <a href="https://use-the-index-luke.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Use The Index, Luke
            </a> — Practical guide to database indexing, query optimization, and B-tree behavior.
          </li>
          <li>
            <a href="https://www.bailard.com/btree/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              B-Tree Animations
            </a> — Interactive visualization of B-tree insert, delete, and split operations.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
