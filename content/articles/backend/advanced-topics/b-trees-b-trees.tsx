"use client";

import { ArticleImage } from "@/components/articles/ArticleImage";
import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-b-trees-b-trees-extensive",
  title: "B-trees & B+ Trees",
  description:
    "Understand the index structures behind many databases: page-oriented balanced trees, range-scan behavior, write costs from splits, and operational tuning for predictable performance.",
  category: "backend",
  subcategory: "advanced-topics",
  slug: "b-trees-b-trees",
  wordCount: 2800,
  readingTime: 14,
  lastUpdated: "2026-03-14",
  tags: ["backend", "advanced", "data-structures", "databases"],
  relatedTopics: ["lsm-trees", "database-indexing", "query-optimization-techniques"],
};

export default function BTreesAndBPlusTreesConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>What B-trees and B+ Trees Are</h2>
        <p>
          <strong>B-trees</strong> and <strong>B+ trees</strong> are balanced tree data structures designed for
          storage systems where data lives on pages (disk or SSD blocks). They minimize random I/O by maximizing
          fanout: each node contains many keys, so the tree stays shallow even for large datasets.
        </p>
        <p>
          These structures are widely used in database indexes because they support point lookups and range scans with
          predictable performance. The details matter: B+ trees store all records in leaves and link leaves for efficient
          range iteration, while B-trees can store records in internal nodes as well.
        </p>
        <ArticleImage
          src="/diagrams/backend/advanced-topics/b-trees-b-trees-diagram-1.svg"
          alt="B-tree and B+ tree overview diagram showing page-based nodes and shallow height"
          caption="B-tree family structures keep height small by storing many keys per node. This makes them efficient for page-based storage and range queries."
        />
      </section>

      <section>
        <h2>Why Page Orientation Changes the Design</h2>
        <p>
          In memory, a binary tree might be fine. On disk, every pointer chase can become a page read. B-tree nodes are
          sized to align with page sizes, so each level is one page read in the worst case. With high fanout, the tree
          height remains low and search takes only a few page reads even for very large indexes.
        </p>
        <p>
          This is also why caching is powerful. If upper levels of the tree fit in memory, many lookups require only one
          leaf page read. Database buffer pools take advantage of this by keeping frequently used index pages hot.
        </p>
      </section>

      <section>
        <h2>B-tree vs B+ Tree: Practical Differences</h2>
        <p>
          Both are balanced, but B+ trees are often preferred for databases because range scans are more efficient and
          leaf nodes can be linked like a sorted list.
        </p>
        <ArticleImage
          src="/diagrams/backend/advanced-topics/b-trees-b-trees-diagram-2.svg"
          alt="B-tree vs B+ tree diagram showing data in internal nodes vs leaves and linked leaf chain"
          caption="B+ trees keep data in leaves and link leaves for fast range scans. This matches common database access patterns like ordered iteration and prefix searches."
        />
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Operational Implications</h3>
          <ul className="space-y-2">
            <li>
              <strong>Range scans:</strong> B+ leaf links make them cheaper and more cache-friendly.
            </li>
            <li>
              <strong>Point reads:</strong> both are good, but performance depends heavily on caching and page locality.
            </li>
            <li>
              <strong>Storage layout:</strong> B+ trees often pair well with clustered layouts that co-locate leaf pages with table storage patterns.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Writes: Splits, Merges, and Fragmentation</h2>
        <p>
          Writes to B-tree indexes cause structural changes. When a node fills, an insert triggers a <strong>split</strong>,
          which can propagate upward. Splits are not constant time in a page-oriented system: they allocate new pages,
          update parent pointers, and can increase write amplification.
        </p>
        <p>
          Deletes can cause nodes to underfill, leading to merges or rebalancing. Many systems avoid aggressive merging
          because it can create churn and fragmentation. Instead, they tolerate some space overhead and rely on periodic
          maintenance or rebuild operations.
        </p>
        <p>
          Write patterns strongly affect behavior. Monotonic inserts (increasing keys) tend to focus writes on the right
          edge of the tree, creating hotspots. Random inserts spread load but can create more fragmentation.
        </p>
      </section>

      <section>
        <h2>Concurrency: Latches and Locking Behavior</h2>
        <p>
          Indexes are shared data structures. Concurrent reads and writes require careful coordination. Databases use
          latches or locks to protect page structure while allowing high read concurrency. Poor concurrency strategies
          can make index pages a hotspot and can dominate tail latency.
        </p>
        <p>
          This is why database tuning often focuses on contention around index hot spots and on avoiding patterns like
          globally increasing keys that concentrate writes in one leaf.
        </p>
      </section>

      <section>
        <h2>Operational Tuning: Fill Factor and Maintenance</h2>
        <p>
          Many databases provide knobs like fill factor to reduce split frequency by leaving space in pages for future
          inserts. The cost is space overhead. The right setting depends on update patterns: append-only workloads can
          use dense pages; update-heavy workloads benefit from reserved free space.
        </p>
        <p>
          Storage details shape behavior. Page size influences fanout and cache residency. Key compression (prefix
          compression in internal nodes) can reduce page pressure for long keys. Clustered layouts can make range scans
          cheaper by co-locating table rows with index order, while non-clustered layouts may require extra lookups that
          amplify I/O under cold caches. Some engines add prefetching to reduce random-read stalls during long range scans.
        </p>
        <p>
          Over time, indexes can bloat due to churn. Periodic maintenance such as reindexing, vacuuming, or compaction
          becomes necessary to restore locality and reduce I/O.
        </p>
      </section>

      <section>
        <h2>Failure Modes and Mitigations</h2>
        <p>
          B-tree issues typically show up as latency spikes under writes, growing storage usage from bloat, or
          contention around hot pages. These are operational problems, not theoretical ones.
        </p>
        <ArticleImage
          src="/diagrams/backend/advanced-topics/b-trees-b-trees-diagram-3.svg"
          alt="B-tree failure modes: page splits, hot pages, fragmentation, and bloat"
          caption="B-tree family structures are predictable when maintained. Splits, fragmentation, and hot pages are the common performance pain points under real workloads."
        />
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Split-driven latency spikes</h3>
            <p className="mt-2 text-sm text-muted">
              Heavy insert or update workloads cause frequent splits and amplify I/O, increasing p99 latency.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> tune fill factor, avoid monotonic hotspots when possible, and ensure buffer pools are sized for index working sets.
              </li>
              <li>
                <strong>Signal:</strong> latency spikes correlated with insert rate and page split counters.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Index bloat and fragmentation</h3>
            <p className="mt-2 text-sm text-muted">
              Churn leaves free space and scattered pages, increasing cache misses and I/O for both reads and writes.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> periodic maintenance, reindexing strategies, and monitoring for bloat growth.
              </li>
              <li>
                <strong>Signal:</strong> index size grows faster than table size and read amplification increases over time.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Scenario: Range Queries on a Large Table</h2>
        <p>
          A service supports queries like &quot;all orders between two timestamps&quot;. A B+ tree index on the timestamp
          field enables efficient range scans: locate the starting leaf, then iterate through linked leaves. This avoids
          scanning the full table.
        </p>
        <p>
          Under heavy writes, splits can increase tail latency. Operational tuning focuses on keeping hot pages cached,
          choosing appropriate fill factor, and monitoring for bloat that slowly degrades range scan performance.
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>
            Node and page sizing aligns with storage behavior, and upper tree levels stay hot in memory for predictable lookups.
          </li>
          <li>
            Write patterns are understood: monotonic inserts, random inserts, and update churn have different hotspot and fragmentation behavior.
          </li>
          <li>
            Maintenance and tuning exist for fill factor, bloat control, and periodic rebuild or compaction.
          </li>
          <li>
            Concurrency and contention signals are monitored for hot pages and latch pressure.
          </li>
          <li>
            Index choice is validated against query patterns: range scans, point lookups, and ordering requirements.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why do databases use B+ trees so often?</p>
            <p className="mt-2 text-sm text-muted">
              A: They are page-efficient, keep height low, and support fast range scans via linked leaves, which matches many query patterns in storage systems.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What makes B-tree writes expensive?</p>
            <p className="mt-2 text-sm text-muted">
              A: Page splits and rebalancing cause extra I/O and metadata updates. Under write-heavy workloads, split frequency and contention can dominate tail latency.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When might you prefer an LSM tree instead?</p>
            <p className="mt-2 text-sm text-muted">
              A: For write-heavy workloads where you want high ingestion throughput. LSM trees trade read and compaction complexity for write efficiency.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
