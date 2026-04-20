"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "skip-lists",
  title: "Skip Lists",
  description: "A probabilistic alternative to balanced trees: stacked linked lists with express lanes deliver O(log n) search, insert, and delete without rotations — the structure behind Redis sorted sets and Java's ConcurrentSkipListMap.",
  category: "other",
  subcategory: "data-structures",
  slug: "skip-lists",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-04-18",
  tags: ["skip-list", "probabilistic", "ordered", "concurrent", "data-structures"],
  relatedTopics: ["trees", "singly-linked-lists", "hash-tables"],
};

export default function SkipListsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition & Context</h2>
        <p className="mb-4">
          A skip list is a probabilistic data structure that supports ordered search, insert, and delete in O(log n) expected time. It consists of a stack of sorted linked lists: the bottom level contains every element; each higher level contains a randomly-selected subset, halving in size on average. The higher levels act as &quot;express lanes&quot; that let search skip past large portions of the list quickly.
        </p>
        <p className="mb-4">
          William Pugh introduced skip lists in 1990 with a paper titled &quot;Skip Lists: A Probabilistic Alternative to Balanced Trees&quot;. The pitch was simple — balanced BSTs (AVL, red-black) deliver guaranteed O(log n) but require complex rotation logic that&apos;s notoriously hard to get right, especially under concurrency. Skip lists deliver the same expected complexity using nothing but linked lists and a coin flip, and the local-only pointer mutations make concurrent implementations dramatically easier.
        </p>
        <p>
          Today skip lists power Redis sorted sets (the structure behind ZADD/ZRANGE), Java&apos;s ConcurrentSkipListMap, MemSQL&apos;s in-memory indexes, LevelDB&apos;s MemTable, and HBase&apos;s in-memory store. Every time you call ZRANGEBYSCORE on a Redis sorted set with millions of entries and get an instant response, that&apos;s a skip list traversal.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>
        <p className="mb-4">
          The skip list&apos;s structure is best understood as a stack of singly-linked lists. Level 0 is the full sorted list of all n elements. Level 1 contains roughly n/2 elements; level 2 roughly n/4; and so on, until the top level holds just a constant number of elements. Each node stores its value plus an array of forward pointers — one per level it participates in. A head sentinel holds pointers across all levels.
        </p>
        <p className="mb-4">
          The trick is how levels are assigned. When inserting a new node, the algorithm flips a fair coin until it gets tails: heads → promote one more level, tails → stop. The number of heads determines the node&apos;s height. This produces a geometric distribution: P(height ≥ k) = 1/2^k. Expected total nodes across all levels: 2n. Expected maximum level: log₂(n).
        </p>
        <p className="mb-4">
          The deep insight is that this random structure is &quot;balanced enough&quot; in expectation, without any rebalancing logic. Each level has half the nodes of the level below — exactly the structure of a balanced BST&apos;s level distribution — but the balance is statistical rather than enforced. The probability of an extremely unbalanced skip list decays exponentially with n; for n = 10⁶, the probability of a worst-case search vanishes for all practical purposes.
        </p>
        <p>
          <strong>Search</strong> walks a staircase from top-left to bottom-right. At each level, walk forward until the next node would overshoot the target; then descend one level. The walk continues at level 0 until the target is found or determined absent. Expected work: ~2 hops per level × log₂(n) levels = O(log n). The pattern is identical to a binary search&apos;s halving, executed via pointer chasing.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/skip-lists-diagram-1.svg"
          alt="Multi level skip list with four levels showing how higher levels skip more nodes and the bottom level is the complete sorted list"
          caption="Figure 1: Each level has roughly half the nodes of the level below. Higher levels are express lanes; level 0 is the complete sorted list."
        />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture & Flow</h2>
        <p className="mb-4">
          <strong>Search(key):</strong> start at the head&apos;s topmost level. Repeatedly check the next node at the current level: if its key is &lt; target, advance; if ≥ target, drop one level. When you reach level 0, the next pointer either points at the target (found) or past it (not found). Total expected work O(log n).
        </p>
        <p className="mb-4">
          <strong>Insert(key, value):</strong> first run the search, recording at each level the rightmost node whose next overshoots the target — these are the &quot;update points&quot; where the new node will splice in. Then flip coins to determine the new node&apos;s level. Allocate the node, and for each level from 0 up to its level, update the forward pointers exactly as you would in a singly-linked list insert. If the new level exceeds the current maximum, extend the head pointers and update.
        </p>
        <p className="mb-4">
          <strong>Delete(key):</strong> identical setup to insert — find the update points at each level. If the next node at level 0 matches the target, splice it out at every level it occupies by rewriting the forward pointers of the update points. Decrement the maximum level if the top level is now empty.
        </p>
        <p className="mb-4">
          <strong>Range query.</strong> One of the skip list&apos;s killer features. To enumerate all keys in [a, b]: search for a (landing at the first key ≥ a in level 0), then walk forward at level 0 until exceeding b. This is O(log n + k) where k is the result size. Because level 0 is a sorted linked list, range scans are sequential and cache-friendly. Redis ZRANGEBYSCORE uses exactly this pattern.
        </p>
        <p>
          <strong>Concurrent skip list.</strong> The structural simplicity makes lock-free implementations practical. Java&apos;s ConcurrentSkipListMap uses CAS on each level&apos;s forward pointer; the algorithm by Fraser and Harris (2007) achieves linearizability without any locks. Compare this to a concurrent red-black tree, which requires complex lock-free rotation protocols and rarely achieves the same throughput.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/skip-lists-diagram-2.svg"
          alt="Coin flipping sequence determining a node spans levels zero through three with table of geometric distribution probabilities"
          caption="Figure 2: Each new node flips coins until tails — geometric distribution gives expected log n max level and 2n total nodes, exactly the structure of a balanced BST."
        />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Trade-offs & Comparisons</h2>
        <p className="mb-4">
          <strong>Skip list vs balanced BST (AVL, red-black).</strong> Both achieve O(log n) for search, insert, delete. BSTs guarantee O(log n) worst case; skip lists are O(log n) expected with exponentially-vanishing tails. The decisive practical differences are simplicity (skip list code is half the size) and concurrency (skip lists are dramatically easier to make lock-free). For new in-memory ordered structures, skip list is often the better choice; BSTs remain dominant in disk-resident contexts (B-trees) where the deterministic structure aids I/O planning.
        </p>
        <p className="mb-4">
          <strong>Skip list vs B-tree.</strong> B-trees pack many keys per node for disk I/O efficiency (one node = one disk block); skip lists are pointer-chasing structures optimized for in-memory use. For RAM-resident ordered indexes, skip list wins on simplicity. For disk-resident, B-tree wins overwhelmingly.
        </p>
        <p className="mb-4">
          <strong>Skip list vs hash table.</strong> Hash tables are O(1) expected for unordered operations but support no ordering — no range queries, no in-order traversal, no min/max. Skip lists support all of these in O(log n). Use a hash table when you only need point queries; use a skip list when ordering matters.
        </p>
        <p className="mb-4">
          <strong>Skip list vs sorted array.</strong> Sorted array offers O(log n) search via binary search but O(n) insert/delete. Skip list pays slightly more for search (constant factors, not asymptotic) but supports O(log n) modifications. For mostly-static data, sorted array; for dynamic data, skip list.
        </p>
        <p>
          <strong>Memory cost.</strong> Skip lists use roughly 2n nodes total (the geometric series sum). Each node carries an array of forward pointers — average 2 per node, but worst-case log n for the tallest. In Redis specifically, the per-element overhead is about 20–40 bytes; for very high-cardinality sorted sets this dominates memory.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Cap the maximum level.</strong> Allocating an unbounded level array per node is wasteful. Cap at log₂(expected n) + a small safety margin (Redis uses 32 for sorted sets up to ~2³² elements). Beyond that, the express lanes don&apos;t help.</li>
          <li><strong>Use a deterministic seed in tests.</strong> Coin flips make every run different. Use a seeded PRNG in unit tests so failures reproduce.</li>
          <li><strong>Pick the right p.</strong> The classic p = 1/2 is optimal for time. p = 1/4 (Pugh&apos;s suggestion) trades slightly slower search for fewer total pointers — better cache behavior, sometimes faster overall.</li>
          <li><strong>Co-locate value with key.</strong> If the value is small, store it inline in the node. Cache locality dominates over indirection in modern hardware.</li>
          <li><strong>Use SkipList for ordered concurrent access.</strong> Java&apos;s ConcurrentSkipListMap is the right choice when many threads insert/delete an ordered map. Don&apos;t reach for ConcurrentHashMap if you need ordering.</li>
          <li><strong>Prefer skip lists for MemTable / write buffer.</strong> Their concurrent insert behavior is simpler and faster than concurrent B-trees; this is exactly why LevelDB, RocksDB, and HBase use skip lists for their in-memory write buffers.</li>
          <li><strong>Avoid for memory-tight workloads.</strong> The 20–40 bytes/element overhead dominates for tiny values. A sorted array or compact B-tree may use 5–10× less memory.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Forgetting to update head pointers when promoting.</strong> If a new node&apos;s level exceeds the current max, you must extend the head&apos;s forward array. Easy to miss; produces silent search failures.</li>
          <li><strong>Off-by-one in level indexing.</strong> Levels are typically 0-indexed, but some implementations 1-index. Mixing conventions corrupts the structure silently.</li>
          <li><strong>Insufficient randomness.</strong> A predictable PRNG seeded from time produces correlated heights across nodes; an adversarial input can degrade search to O(n). Use a non-trivial seed (cryptographic in adversarial settings).</li>
          <li><strong>Holding pointers across mutations.</strong> Pointer-chasing snapshots may dangle after concurrent inserts/deletes. Use the API correctly — no peeking.</li>
          <li><strong>Concurrent modification without proper synchronization.</strong> Naive skip list code is not thread-safe. Either use a battle-tested concurrent variant or lock the entire structure.</li>
          <li><strong>Treating expected complexity as worst-case.</strong> O(log n) is expected; worst case is O(n). For latency-sensitive applications, document the SLO with the tail probability included.</li>
          <li><strong>Comparing with strict equality on insert.</strong> Should the structure allow duplicate keys? Decide upfront. Redis sorted sets store (member, score) where members are unique but scores may duplicate.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>
        <p className="mb-4">
          <strong>Redis sorted sets.</strong> The ZADD/ZRANGE/ZRANGEBYSCORE/ZRANK family of commands is backed by a skip list paired with a hash table. The skip list provides O(log n) insertion and ordered range queries; the hash table provides O(1) member-to-score lookup. Used everywhere from leaderboards (top-K queries) to time-series indexing (range over timestamp scores) to deduplicated sorted feeds. The single most important data structure in Redis after the basic dict.
        </p>
        <p className="mb-4">
          <strong>LevelDB and RocksDB MemTable.</strong> The in-memory write buffer in both LSM-tree storage engines is a concurrent skip list (LevelDB) or a configurable choice including skip list (RocksDB). When the buffer fills, it&apos;s flushed to disk as a sorted SSTable. The skip list&apos;s concurrent insert behavior matches the high-write workloads these engines are designed for.
        </p>
        <p className="mb-4">
          <strong>Java&apos;s ConcurrentSkipListMap and Set.</strong> The standard concurrent ordered map in the JDK. Used in distributed coordination (Zookeeper-style watches), event scheduling (TimerWheel alternatives), and any application needing ordered concurrent access. The lock-free design scales to dozens of cores without lock contention.
        </p>
        <p className="mb-4">
          <strong>HBase MemStore.</strong> Apache HBase&apos;s in-memory write buffer per region is a skip list, mirroring LevelDB&apos;s design. The flush-to-StoreFile path produces sorted on-disk files exactly as LSM trees require.
        </p>
        <p>
          <strong>MemSQL (SingleStore) in-memory rowstore indexes.</strong> The skip list serves as the primary index structure for in-memory tables, supporting concurrent insert/update and range scans. Lock-free skip lists were a deliberate choice over concurrent B-trees for the same simplicity-and-throughput reasons.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/skip-lists-diagram-3.svg"
          alt="Skip list search for value 22 traced as a staircase descending through levels with red dashed arrows showing the visited path"
          caption="Figure 3: Search descends in a staircase pattern — walk right until overshoot, drop down. For 1M keys, expected ~20 hops total."
        />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why use a skip list instead of a balanced BST?</p>
            <p className="mt-2 text-sm">A: Same O(log n) expected complexity, dramatically simpler code (no rotations, no rebalancing), and far easier to make concurrent (lock-free implementations are practical because all updates are local pointer mutations). Trade-off: O(log n) is expected, not worst-case — but the tail probability vanishes exponentially with n. For most in-memory ordered workloads, skip list is the better engineering choice.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does the random level selection work?</p>
            <p className="mt-2 text-sm">A: When inserting a new node, flip a fair coin until you get tails. The number of heads determines the node&apos;s height: P(height ≥ k) = 1/2^k. This produces a geometric distribution where each level has roughly half the nodes of the level below — exactly the structure of a balanced BST&apos;s level distribution, but achieved statistically rather than via rebalancing.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s the memory overhead of a skip list?</p>
            <p className="mt-2 text-sm">A: Expected ~2n nodes total across all levels (geometric series sum). Each node carries an array of forward pointers averaging 2 per node. In practice this means 20–40 bytes per element overhead in JavaScript or Java — significant for high-cardinality structures. Compare to a sorted array (~8 bytes/element) or a compact B-tree.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does Redis use skip lists?</p>
            <p className="mt-2 text-sm">A: Sorted sets (ZSET) are implemented as a skip list paired with a dict (hash map). The skip list maintains members sorted by score, supporting O(log n) ZADD and ordered range queries (ZRANGEBYSCORE). The dict provides O(1) member-to-score lookup for ZSCORE. The pair is a deliberate engineering choice: skip list for ordering, hash for point lookups.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement a concurrent skip list?</p>
            <p className="mt-2 text-sm">A: Use atomic compare-and-swap on each level&apos;s forward pointers. Insertions update pointers level-by-level from bottom up; deletions mark nodes as logically deleted before physically unlinking. The Fraser-Harris algorithm (2007) achieves linearizability without locks. Java&apos;s ConcurrentSkipListMap is a production reference implementation. The simplicity vs concurrent BSTs is precisely why skip lists dominate concurrent ordered storage.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Can an adversarial input degrade a skip list to O(n)?</p>
            <p className="mt-2 text-sm">A: Only if the adversary can predict your random source. With a properly-seeded cryptographic PRNG, an adversary cannot construct inputs that systematically produce tall or short nodes. With a weak PRNG (e.g., seeded from time), correlated heights are theoretically exploitable. In practice, this matters only for adversarial workloads — most applications use Math.random() or equivalents and never see the tail.</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">References & Further Reading</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Pugh — &quot;Skip Lists: A Probabilistic Alternative to Balanced Trees&quot; (CACM 1990), the original paper</li>
          <li>Pugh — &quot;Concurrent Maintenance of Skip Lists&quot; (1990), the early concurrent variant</li>
          <li>Fraser, Harris — &quot;Concurrent Programming Without Locks&quot; (TOCS 2007), the lock-free skip list algorithm</li>
          <li>Sedgewick, Wayne — <em>Algorithms, 4th Edition</em>, related coverage in symbol table chapters</li>
          <li>Redis source code — <code>src/t_zset.c</code>, <code>src/server.h</code> (production skip list implementation)</li>
          <li>Java <code>ConcurrentSkipListMap</code> source (OpenJDK), the canonical concurrent reference</li>
          <li>Herlihy, Shavit — <em>The Art of Multiprocessor Programming</em>, Chapter 14 (Skip Lists and Balanced Search)</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
