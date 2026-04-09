"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-advanced-topics-skip-lists",
  title: "Skip Lists",
  description:
    "Staff-level deep dive into skip lists: probabilistic data structures, O(log n) search/insert/delete, concurrent skip lists, comparison with balanced trees, and production-scale patterns.",
  category: "backend",
  subcategory: "advanced-topics",
  slug: "skip-lists",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-08",
  tags: ["backend", "skip-lists", "data-structures", "probabilistic", "concurrent", "search"],
  relatedTopics: ["b-trees-b-trees", "lsm-trees", "database-indexes", "merkle-trees"],
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
          <strong>Skip lists</strong> are a probabilistic data structure that provides O(log n)
          search, insert, and delete operations, comparable to balanced binary search trees
          (AVL trees, red-black trees, B-trees) but significantly simpler to implement. A skip
          list consists of multiple linked lists layered on top of each other: the bottom layer
          is a standard sorted linked list containing all elements, and each higher layer is a
          &quot;express lane&quot; that skips over some elements, enabling faster search by
          skipping large portions of the list.
        </p>
        <p>
          Consider a sorted linked list with 1 million elements. A linear search requires O(n)
          comparisons (up to 1 million comparisons in the worst case). A skip list with
          O(log n) layers reduces this to approximately 20 comparisons (log2(1M) ≈ 20), because
          each layer allows the search to skip over half of the remaining elements. The skip
          list achieves this without the complex rebalancing logic required by balanced trees:
          instead of deterministic rebalancing (rotations, recoloring), skip lists use random
          coin flips to determine how many layers each element participates in, providing
          probabilistic O(log n) performance with a simple implementation.
        </p>
        <p>
          For staff/principal engineers, skip lists require understanding the probabilistic
          guarantees (expected O(log n) performance with high probability), the trade-offs
          between space overhead (each element participates in multiple layers) and search
          performance, and the application of skip lists in concurrent systems (concurrent
          skip lists provide lock-free or fine-grained locking for high-throughput concurrent
          access).
        </p>
        <p>
          The business impact of skip list decisions is significant. Skip lists are used in
          production systems (Redis sorted sets, LevelDB/RocksDB memtables, Java&apos;s
          ConcurrentHashMap) where their simplicity and concurrent access patterns provide
          advantages over balanced trees. Incorrect skip list implementation (poor random
          number generation, incorrect layer promotion probability) degrades performance from
          O(log n) to O(n), negating the performance benefit.
        </p>
        <p>
          In system design interviews, skip lists demonstrate understanding of probabilistic
          data structures, the trade-offs between simplicity and performance, and the
          application of skip lists in concurrent and distributed systems.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src={`${BASE_PATH}/skip-list-structure.svg`}
          alt="Skip list structure showing multiple layers of linked lists, bottom layer contains all elements, higher layers skip over elements for faster search"
          caption="Skip list structure — the bottom layer contains all elements in sorted order, each higher layer skips over some elements (approximately half), enabling O(log n) search by skipping large portions of the list at each layer"
        />

        <h3>Layered Structure</h3>
        <p>
          A skip list consists of L layers, where layer 0 (the bottom layer) contains all n
          elements in sorted order. Each higher layer contains a subset of the elements from
          the layer below it. The probability that an element appears in layer k is p^k, where
          p is the promotion probability (typically p = 0.5). This means approximately half
          of the elements appear in layer 1, a quarter in layer 2, an eighth in layer 3, and
          so on. The expected number of layers is log_(1/p)(n), which is approximately log2(n)
          for p = 0.5.
        </p>
        <p>
          Each element in the skip list has a &quot;tower&quot; of forward pointers: one
          pointer for each layer it participates in. The top pointer points to the next element
          in the highest layer, the next pointer points to the next element in the layer below,
          and so on down to the bottom layer. The head of the skip list has pointers to the
          first element in each layer.
        </p>

        <h3>Search Operation</h3>
        <p>
          Search starts at the head&apos;s topmost pointer and proceeds rightward along the
          current layer. If the next element is greater than the search key, the search moves
          down one layer and continues rightward. If the next element is equal to the search
          key, the search succeeds. If the next element is less than the search key, the search
          continues rightward. This process repeats until the search key is found or the search
          reaches the bottom layer and the next element is greater than the search key.
        </p>
        <p>
          The expected number of comparisons is O(log n), because each layer allows the search
          to skip over approximately half of the remaining elements. The worst-case number of
          comparisons is O(n) (if all elements happen to be in layer 0 only), but the
          probability of this is exponentially small (2^(-n)).
        </p>

        <h3>Insert and Delete Operations</h3>
        <p>
          Insert first searches for the position where the new element should be inserted.
          Then, the element&apos;s tower height is determined by randomly flipping a coin:
          each heads result adds another layer to the tower (up to a maximum of L layers).
          The element is inserted into each layer it participates in by updating the forward
          pointers of the preceding elements in each layer.
        </p>
        <p>
          Delete searches for the element and removes it from each layer it participates in
          by updating the forward pointers of the preceding elements. The element&apos;s tower
          is deallocated, and the skip list structure is maintained. Both insert and delete
          have expected O(log n) time complexity, because the search dominates the operation
          cost and the pointer updates are O(log n) (one update per layer the element
          participates in).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/skip-list-insert.svg`}
          alt="Skip list insert operation showing search for position, random tower height determination, and pointer updates across layers"
          caption="Skip list insert — search for the insertion position, determine tower height by random coin flips (p=0.5 per layer), update forward pointers in each layer the new element participates in"
        />
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture &amp; Flow</h2>

        <h3>Concurrent Skip Lists</h3>
        <p>
          Concurrent skip lists provide thread-safe access to the skip list without global
          locking. The key insight is that insert and delete operations only modify the forward
          pointers of the preceding elements in each layer, and these modifications can be
          performed atomically using compare-and-swap (CAS) operations. A concurrent skip
          list uses fine-grained locking (one lock per element) or lock-free CAS to ensure
          that concurrent insert and delete operations do not corrupt the list structure.
        </p>
        <p>
          Java&apos;s ConcurrentSkipListMap uses a lock-free CAS-based implementation that
          provides O(log n) expected time complexity for concurrent search, insert, and delete
          operations. The implementation uses a technique called &quot;marker nodes&quot; to
          logically delete elements before physically removing them, ensuring that concurrent
          searches do not encounter partially deleted elements.
        </p>

        <h3>Skip Lists in LSM Trees</h3>
        <p>
          Skip lists are commonly used as the memtable in LSM tree storage engines (LevelDB,
          RocksDB, Cassandra). The memtable buffers incoming writes in memory, and the skip
          list provides O(log n) search for reads while accepting writes in O(log n) time.
          When the memtable reaches its size threshold, it is flushed to disk as an SSTable.
        </p>
        <p>
          Skip lists are preferred over balanced trees for memtables because they support
          efficient concurrent access (multiple threads can insert and search simultaneously)
          and sequential iteration (the bottom layer of the skip list is a standard linked
          list, enabling efficient sequential iteration for SSTable flushing). Balanced trees
          require rebalancing during insert, which can block concurrent access and makes
          sequential iteration more complex.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/skip-list-vs-balanced-tree.svg`}
          alt="Skip list vs balanced tree comparison showing simpler implementation, concurrent access patterns, and space overhead trade-offs"
          caption="Skip list vs balanced tree — skip lists provide comparable O(log n) performance with simpler implementation (no rotations), better concurrent access (fine-grained locking), but higher space overhead (multiple layers per element)"
        />
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Skip lists trade deterministic performance guarantees for simplicity and concurrent
          access. Unlike balanced trees (which guarantee O(log n) worst-case performance),
          skip lists provide O(log n) expected performance with high probability. The
          probability of O(n) worst-case performance is exponentially small (2^(-n)), making
          it practically irrelevant for production systems.
        </p>
        <p>
          Compared to balanced trees, skip lists have higher space overhead (each element
          participates in approximately 2 layers on average, requiring 2 forward pointers per
          element instead of 2-3 child pointers per node in a balanced tree). However, skip
          lists provide better concurrent access patterns (fine-grained locking or lock-free
          CAS) and simpler implementation (no rotations, no recoloring, no complex rebalancing
          logic).
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Use a promotion probability of p = 0.5 for general-purpose skip lists. This
          provides the best balance between space overhead (average 2 layers per element) and
          search performance (expected log2(n) comparisons). For space-constrained
          environments, use p = 0.25 (average 1.33 layers per element, at the cost of slightly
          worse search performance). For performance-constrained environments, use p = 0.75
          (average 4 layers per element, at the cost of higher space overhead).
        </p>
        <p>
          Set a maximum layer height (typically 32 or 64) to bound the space overhead and
          prevent degenerate cases where an element&apos;s tower height grows excessively
          large. The maximum layer height should be set to log_(1/p)(n), where n is the
          expected number of elements. For n = 1 billion and p = 0.5, the maximum layer
          height is 30 (log2(1B) ≈ 30).
        </p>
        <p>
          Use a high-quality random number generator for tower height determination. The
          probabilistic guarantees of skip lists depend on the randomness of the tower height
          distribution. A poor random number generator (e.g., a linear congruential generator
          with a short period) can produce biased tower heights, degrading performance from
          O(log n) to O(n).
        </p>
        <p>
          For concurrent access, use a lock-free CAS-based implementation (like Java&apos;s
          ConcurrentSkipListMap) rather than a coarse-grained lock. Coarse-grained locking
          serializes all operations, negating the concurrent access benefit of skip lists.
          Lock-free CAS provides O(log n) expected time complexity for concurrent operations
          with high throughput.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most common pitfall is using a poor random number generator for tower height
          determination. If the random number generator produces biased results (e.g., always
          returning the same tower height), all elements will have the same tower height,
          reducing the skip list to a single linked list with O(n) search performance. The
          fix is to use a high-quality random number generator (Mersenne Twister, PCG, or
          the system&apos;s built-in cryptographic random number generator).
        </p>
        <p>
          Not setting a maximum layer height can cause degenerate cases where an
          element&apos;s tower height grows excessively large, consuming excessive memory
          and degrading search performance (the search must traverse each layer, even if the
          layer contains only one element). The fix is to set a maximum layer height of
          log_(1/p)(n) for the expected number of elements.
        </p>
        <p>
          Incorrectly updating forward pointers during insert and delete can corrupt the
          skip list structure, causing search to skip over elements or enter an infinite
          loop. The fix is to update forward pointers in bottom-up order (from layer 0 to
          the highest layer), ensuring that lower layers are consistent before updating
          higher layers.
        </p>
        <p>
          Assuming skip lists provide deterministic O(log n) worst-case performance is a
          fundamental misunderstanding. Skip lists provide O(log n) expected performance with
          high probability, but the worst case is O(n). For applications that require
          deterministic worst-case guarantees (real-time systems, safety-critical systems),
          use a balanced tree instead.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Redis: Sorted Sets</h3>
        <p>
          Redis uses skip lists to implement sorted sets (ZADD, ZRANGE, ZSCORE commands).
          Each element in the sorted set is stored as a skip list node with a score (for
          ordering) and a value (the element). The skip list provides O(log n) search,
          insert, and delete operations, enabling efficient range queries (ZRANGEBYSCORE)
          and rank operations (ZRANK). Redis&apos;s skip list implementation supports
          concurrent access through fine-grained locking, enabling high-throughput sorted
          set operations.
        </p>

        <h3>LevelDB/RocksDB: Memtable</h3>
        <p>
          LevelDB and RocksDB use skip lists as the memtable data structure. The memtable
          buffers incoming writes in memory, and the skip list provides O(log n) search for
          reads while accepting writes in O(log n) time. When the memtable reaches its size
          threshold, it is flushed to disk as an SSTable. The skip list is preferred over
          balanced trees because it supports efficient concurrent access and sequential
          iteration (for SSTable flushing).
        </p>

        <h3>Java: ConcurrentSkipListMap</h3>
        <p>
          Java&apos;s ConcurrentSkipListMap is a lock-free concurrent skip list
          implementation that provides O(log n) expected time complexity for concurrent
          search, insert, and delete operations. It is used in production systems where
          high-throughput concurrent access to sorted key-value data is required, such as
          caching systems, event processing pipelines, and real-time analytics.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is a skip list and how does it work?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              A skip list is a probabilistic data structure consisting of multiple layered
              linked lists. The bottom layer contains all elements in sorted order, and each
              higher layer skips over some elements (approximately half). Search starts at the
              top layer and moves rightward, moving down one layer when the next element is
              greater than the search key.
            </p>
            <p>
              The expected time complexity is O(log n) for search, insert, and delete,
              comparable to balanced trees but with a simpler implementation (no rotations or
              rebalancing). The worst case is O(n), but the probability is exponentially small.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: How does a skip list compare to a balanced binary search tree?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Skip lists provide O(log n) expected performance (probabilistic) vs. O(log n)
              worst-case (deterministic) for balanced trees. Skip lists are simpler to
              implement (no rotations, no recoloring) and provide better concurrent access
              patterns (fine-grained locking or lock-free CAS). Balanced trees have lower
              space overhead (2-3 pointers per node vs. 2 pointers per layer per element in
              skip lists).
            </p>
            <p>
              Skip lists are preferred in production systems where concurrent access is
              important (Redis sorted sets, LevelDB memtables, Java ConcurrentSkipListMap).
              Balanced trees are preferred where deterministic worst-case guarantees are
              required (real-time systems, databases with strict SLAs).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: Why are skip lists used as memtables in LSM trees?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Skip lists are used as memtables because they support efficient concurrent access
              (multiple threads can insert and search simultaneously) and sequential iteration
              (the bottom layer is a standard linked list, enabling efficient sequential
              iteration for SSTable flushing). Balanced trees require rebalancing during
              insert, which can block concurrent access and makes sequential iteration more
              complex.
            </p>
            <p>
              The skip list&apos;s O(log n) insert time is acceptable for memtables (which
              are flushed to disk before growing too large), and the concurrent access pattern
              enables high write throughput.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: What is the space overhead of a skip list?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              With promotion probability p = 0.5, each element participates in approximately
              2 layers on average (1 + p + p^2 + ... = 1/(1-p) = 2). Each layer requires a
              forward pointer, so the space overhead is approximately 2 forward pointers per
              element (plus the element itself). For p = 0.25, the overhead is approximately
              1.33 pointers per element. For p = 0.75, the overhead is approximately 4
              pointers per element.
            </p>
            <p>
              Compared to balanced trees (2-3 pointers per node), skip lists have slightly
              higher space overhead but provide better concurrent access patterns and simpler
              implementation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: How do concurrent skip lists work?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Concurrent skip lists use fine-grained locking (one lock per element) or
              lock-free CAS (compare-and-swap) to ensure thread-safe access without global
              locking. The key insight is that insert and delete operations only modify the
              forward pointers of the preceding elements in each layer, and these modifications
              can be performed atomically using CAS.
            </p>
            <p>
              Java&apos;s ConcurrentSkipListMap uses a lock-free CAS-based implementation with
              &quot;marker nodes&quot; to logically delete elements before physically removing
              them, ensuring that concurrent searches do not encounter partially deleted
              elements. This provides O(log n) expected time complexity for concurrent
              operations with high throughput.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: What is the worst-case performance of a skip list?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              The worst-case performance of a skip list is O(n) (all elements in layer 0 only),
              but the probability of this is exponentially small (2^(-n)). For n = 1 million,
              the probability is approximately 10^(-300,000), which is effectively zero. In
              practice, skip lists provide O(log n) expected performance with high probability.
            </p>
            <p>
              For applications that require deterministic worst-case guarantees (real-time
              systems, safety-critical systems), use a balanced tree instead. For most
              production systems, the probabilistic guarantees of skip lists are sufficient.
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
              href="https://dl.acm.org/doi/10.1145/78973.78977"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pugh (1990): Skip Lists: A Probabilistic Alternative to Balanced Trees
            </a>{" "}
            — The original skip list paper.
          </li>
          <li>
            <a
              href="https://redis.io/docs/data-types/sorted-sets/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Redis: Sorted Sets
            </a>{" "}
            — How Redis uses skip lists for sorted set operations.
          </li>
          <li>
            <a
              href="https://github.com/google/leveldb"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              LevelDB: Skip List Memtable
            </a>{" "}
            — How LevelDB uses skip lists as memtables.
          </li>
          <li>
            <a
              href="https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ConcurrentSkipListMap.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Java: ConcurrentSkipListMap
            </a>{" "}
            — Lock-free concurrent skip list implementation.
          </li>
          <li>
            Martin Kleppmann,{" "}
            <em>Designing Data-Intensive Applications</em>, O&apos;Reilly, 2017. Chapter 3
            (Storage and Retrieval).
          </li>
          <li>
            <a
              href="https://www.cl.cam.ac.uk/teaching/1213/R055/skiplists.pdf"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cambridge University: Skip Lists Lecture Notes
            </a>{" "}
            — Comprehensive overview of skip list theory and implementation.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
