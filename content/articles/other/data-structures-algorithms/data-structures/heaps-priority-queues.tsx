"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "heaps-priority-queues",
  title: "Heaps & Priority Queues",
  description:
    "Staff-level deep dive into binary heaps and priority queues — implicit array layout, sift-up/sift-down mechanics, heap construction in linear time, d-ary variants, Fibonacci heaps, and real-world scheduler applications.",
  category: "other",
  subcategory: "data-structures",
  slug: "heaps-priority-queues",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-04-17",
  tags: [
    "heaps",
    "priority-queue",
    "binary-heap",
    "scheduler",
    "data-structures",
  ],
  relatedTopics: [
    "trees",
    "queues",
    "arrays",
    "graphs",
  ],
};

export default function HeapsPriorityQueuesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* SECTION 1 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition &amp; Context</h2>
        <p>
          A <strong>heap</strong> is a complete binary tree whose nodes
          obey a heap-order property: each parent is no greater than its
          children (min-heap) or no less than them (max-heap). A{" "}
          <strong>priority queue</strong> is the abstract data type that
          retrieves the minimum (or maximum) element on demand, typically
          backed by a heap. The combination gives O(log n) insert and
          remove-min with O(1) peek — the canonical interface for
          scheduling, shortest-path algorithms, and event simulation.
        </p>
        <p>
          The critical implementation insight is that a complete binary
          tree can be stored implicitly in an array, without any pointers.
          Node at index <em>i</em> has parent at{" "}
          <code>(i − 1) / 2</code>, left child at <code>2i + 1</code>, and
          right child at <code>2i + 2</code>. This implicit layout makes
          the structure cache-friendly, saves memory, and simplifies
          serialization. Every production binary heap — Java&apos;s{" "}
          <code>PriorityQueue</code>, Python&apos;s <code>heapq</code>,
          C++&apos;s <code>std::priority_queue</code>, Rust&apos;s{" "}
          <code>BinaryHeap</code> — uses this array backing.
        </p>
        <p>
          Heaps are narrower than ordered trees: they answer one question
          (what is the min/max?) rather than supporting general search.
          That narrowing is deliberate — it&apos;s the reason they can
          provide O(1) peek and O(log n) push/pop when a balanced BST
          would need O(log n) for every operation. Staff-level design
          choices about heaps therefore hinge on whether the workload
          truly only needs priority ordering, or whether richer ordered
          access is required.
        </p>
        <p>
          Heaps are also the algorithmic core of several foundational
          algorithms: heapsort (O(n log n) in-place sorting), Dijkstra&apos;s
          shortest path (with a min-heap providing next-closest vertex
          extraction), Prim&apos;s minimum spanning tree, Huffman coding,
          and k-way merge (merging k sorted streams into one using a
          k-slot heap). Understanding heaps is therefore foundational
          beyond the data structure itself — they appear in the pipeline
          of every non-trivial algorithmic system.
        </p>
      </section>

      {/* SECTION 2 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Heap-order property and completeness
        </h3>
        <p>
          A <strong>min-heap</strong> satisfies{" "}
          <code>parent ≤ children</code> at every node. The root is the
          global minimum. <strong>Complete</strong> means every level
          except possibly the last is completely filled, and the last
          level is filled from left to right. Completeness is what allows
          the implicit array representation — and it also bounds height
          at ⌊log₂ n⌋, which is how heap operations stay O(log n).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Sift-up (insert)</h3>
        <p>
          Append the new element at the end of the array (maintaining
          completeness), then &quot;sift up&quot;: compare with the
          parent, swap if out of heap order, recurse. Runs in O(log n)
          worst case because the element can travel at most the tree&apos;s
          height. The typical case is much faster — newly-inserted
          elements often land near the bottom and don&apos;t need to
          bubble far.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Sift-down (extract)
        </h3>
        <p>
          Save the root (the answer), move the last element to the root
          position, shrink the array, then &quot;sift down&quot;: compare
          with the smaller child, swap if the child is smaller, recurse.
          O(log n) worst case. This is the operation that powers
          Dijkstra&apos;s extraction of the next-smallest vertex and the
          process scheduler&apos;s retrieval of the next deadline-earliest
          task.
        </p>

        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/heaps-priority-queues-diagram-1.svg"
          alt="Binary heap array layout showing parent child index arithmetic and the implicit complete tree shape"
          caption="Figure 1: Binary heap array layout — implicit tree using index arithmetic; node i has children 2i+1 and 2i+2."
        />
      </section>

      {/* SECTION 3 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture &amp; Flow</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Linear-time heapify
        </h3>
        <p>
          Building a heap from an unsorted array looks like it should
          cost O(n log n) — n inserts at O(log n) each. But Floyd&apos;s
          heapify algorithm runs in O(n): walk the array from the last
          non-leaf (<code>n/2 − 1</code>) backward to the root, sifting
          each node down. The proof exploits the fact that most nodes are
          near the bottom of the tree, where sift-down has short paths;
          the work sum telescopes to O(n) rather than O(n log n). This
          is why heapsort&apos;s build phase is linear and only the n
          extract-mins contribute the log factor.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          d-ary heaps
        </h3>
        <p>
          A d-ary heap has d children per node instead of 2. Height becomes
          log_d n, so sift-up is O(log_d n) — faster for insert-heavy
          workloads. Sift-down becomes O(d · log_d n) because each level
          requires comparing d children; this is worse for extract-heavy
          workloads. Practical optimum for Dijkstra&apos;s with decrease-key
          is d around 4 or 8, depending on edge-to-vertex ratio. Boost C++
          ships an n-ary heap for exactly this tuning reason.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Fibonacci heaps and theoretical bounds
        </h3>
        <p>
          Fibonacci heaps support insert and decrease-key in amortized
          O(1), extract-min in O(log n). That asymptotic profile
          theoretically improves Dijkstra&apos;s shortest-path from
          O((V + E) log V) to O(E + V log V). In practice, the constants
          are so large that Fibonacci heaps are rarely worth the
          implementation complexity. Production shortest-path code uses
          binary or d-ary heaps, and the constants win in every real
          benchmark. Fibonacci heaps live mostly in textbooks and
          theoretical complexity discussions.
        </p>

        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/heaps-priority-queues-diagram-2.svg"
          alt="Sift-up and sift-down heap operations showing element movement through tree levels to restore heap order"
          caption="Figure 2: Sift-up and sift-down — the two heap primitives that restore heap order after insert and extract."
        />
      </section>

      {/* SECTION 4 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">
          Trade-offs &amp; Comparisons
        </h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Operation complexity (binary heap)
        </h3>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Peek (min/max)</strong>: O(1) — always at index 0.
          </li>
          <li>
            <strong>Insert</strong>: O(log n) worst case; O(1) expected
            over uniformly random inputs (most inserts sift up only a few
            levels before meeting a larger ancestor). &quot;Amortized&quot; is
            sometimes used loosely here but strictly applies to the
            backing-array resize, not to sift-up itself.
          </li>
          <li>
            <strong>Extract-min/max</strong>: O(log n).
          </li>
          <li>
            <strong>Decrease-key</strong>: O(log n) if the index is known;
            O(n) to find arbitrary key in a binary heap (no index).
          </li>
          <li>
            <strong>Build from array</strong>: O(n) with Floyd&apos;s
            heapify.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Heap vs sorted array
        </h3>
        <p>
          A sorted array gives O(1) min extraction but O(n) insert. A
          heap gives O(log n) for both. For repeated insertions
          interspersed with extractions — the typical priority queue
          workload — the heap dominates. A sorted array wins only when
          the data is static after initial load.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Heap vs balanced BST
        </h3>
        <p>
          A balanced BST offers ordered iteration, range queries, and
          arbitrary key lookup in O(log n). A heap only offers priority
          access — min or max. For pure priority workloads the heap wins
          on constant factors (implicit layout, no rotations, better
          cache behavior). For mixed workloads with range queries or
          membership tests, the BST wins on flexibility.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Indexed priority queue
        </h3>
        <p>
          Many algorithms need to decrease an element&apos;s key — e.g.,
          Dijkstra when finding a shorter path to a vertex already in the
          queue. Pure heap lookup is O(n) without an index. An{" "}
          <strong>indexed priority queue</strong> pairs the heap with a
          hash map from key to heap index, updated on every swap, giving
          O(log n) decrease-key. Every production Dijkstra implementation
          uses this pattern.
        </p>
      </section>

      {/* SECTION 5 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Use the standard library.</strong> Python{" "}
            <code>heapq</code>, Java <code>PriorityQueue</code>, C++
            <code> std::priority_queue</code>, Rust <code>BinaryHeap</code>
            — all battle-tested implementations.
          </li>
          <li>
            <strong>Pre-size with known capacity.</strong> A hint avoids
            mid-insert reallocations during the O(n log n) load phase.
          </li>
          <li>
            <strong>Prefer Floyd&apos;s heapify for bulk build.</strong>{" "}
            O(n) instead of O(n log n). Every implementation exposes this
            through an array-constructor overload.
          </li>
          <li>
            <strong>Combine with a hash map for decrease-key.</strong>{" "}
            Store heap index alongside each value; update both on swap.
            Essential for Dijkstra-style algorithms.
          </li>
          <li>
            <strong>Consider d-ary for deep heaps.</strong> When n is
            large and insert-heavy, d = 4 or 8 reduces height by 2–3×
            and typically improves throughput.
          </li>
          <li>
            <strong>Use max-heap via negation for min-heap libraries.</strong>
            {" "}When the stdlib offers only min-heap (Python{" "}
            <code>heapq</code>), store <code>−value</code> to simulate
            max-heap behavior.
          </li>
          <li>
            <strong>Break ties deterministically.</strong> When priorities
            collide, secondary sort by insertion order to prevent surprising
            behavior in tests and log analysis.
          </li>
        </ul>
      </section>

      {/* SECTION 6 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Mutable priority in a heap.</strong> Mutating a queued
            element&apos;s priority after insert breaks the heap order
            silently. Either remove, mutate, and re-insert, or use
            decrease-key via an indexed priority queue.
          </li>
          <li>
            <strong>Iterating a heap expecting sorted order.</strong> Heap
            iteration walks the array in index order, not priority order.
            Only repeated <code>extract</code> calls produce sorted
            output — which destroys the heap.
          </li>
          <li>
            <strong>Assuming O(1) delete-arbitrary.</strong> Removing an
            element by value is O(n) in a binary heap. Use an indexed
            priority queue for O(log n) removal.
          </li>
          <li>
            <strong>Comparator not total.</strong> A comparator that
            returns zero for items that should be distinct (e.g., hashing
            collision) produces non-deterministic ordering. The{" "}
            <code>PriorityQueue</code> contract requires strict total
            order.
          </li>
          <li>
            <strong>Capacity leaks in long-running heaps.</strong> A heap
            that only ever inserts grows without bound. Pair with an
            extract loop, a max-size policy, or explicit periodic
            trimming.
          </li>
          <li>
            <strong>Incorrect Dijkstra decrease-key.</strong> Naive
            implementations re-insert the vertex each time its distance
            decreases, leaving stale entries in the heap. Either use an
            indexed heap or filter stale entries on extraction with a
            visited set.
          </li>
          <li>
            <strong>Using a heap for k-smallest on streaming data.</strong>
            {" "}A fixed-size max-heap of size k works — on each new
            element, push, then pop if size &gt; k. Using a min-heap of
            all n items and popping k times is O(n + k log n); the
            bounded max-heap is O(n log k), much better when k &lt;&lt; n.
          </li>
        </ul>
      </section>

      {/* SECTION 7 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Task schedulers
        </h3>
        <p>
          Every earliest-deadline-first and rate-monotonic scheduler uses
          a priority queue keyed by deadline or rate. Real-time operating
          systems (RTEMS, VxWorks, QNX) maintain ready queues as heaps so
          that the next task to run is always extractable in O(log n).
          Non-real-time systems (setTimeout implementations in Node.js
          and browsers) similarly store pending timers in a heap keyed
          by expiration.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Dijkstra&apos;s shortest path and A*
        </h3>
        <p>
          Both algorithms repeatedly extract the lowest-cost unvisited
          vertex, making a priority queue the obvious choice. With an
          indexed binary heap, Dijkstra runs in O((V + E) log V). Google
          Maps, Waze, in-game pathfinding, and network routing protocols
          (OSPF, IS-IS) all use heap-based Dijkstra variants.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          K-way merge
        </h3>
        <p>
          Merging k sorted streams (log file merge, sorted-output databases
          like BigQuery, k-way sort spill merge) uses a k-sized heap.
          Each iteration extracts the smallest front-of-stream, emits it,
          and pushes the next element from that stream. Total time
          O(n log k) for n total elements — optimal.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Bounded top-k on streams
        </h3>
        <p>
          Analytics dashboards, log aggregators, and recommendation
          systems often need the top-k elements by some score on a live
          stream. A size-k max-heap (or min-heap, depending on direction)
          gives O(log k) per update — constant space for unbounded
          streams. Used in Elasticsearch aggregations, Twitter&apos;s
          trending algorithm, and real-time RTB bidding.
        </p>

        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/heaps-priority-queues-diagram-3.svg"
          alt="K-way merge using a min-heap extracting the smallest front element from each sorted stream"
          caption="Figure 3: K-way merge with a size-k min-heap — extract the smallest front element, emit, push the stream&apos;s next element."
        />
      </section>

      {/* SECTION 8 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you find the k largest elements in an array of n?
            </p>
            <p className="mt-2 text-sm">
              A: Maintain a size-k min-heap. Iterate the array: push each
              element; if heap size exceeds k, pop the minimum. At the
              end, the heap contains the k largest elements. O(n log k)
              time, O(k) space. Superior to sorting (O(n log n), O(1)) or
              using a max-heap of all elements (O(n + k log n)) when k is
              much smaller than n — which is the typical case.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Explain why Floyd&apos;s heapify is O(n) and not O(n log n).
            </p>
            <p className="mt-2 text-sm">
              A: Sift-down from each non-leaf node, processing bottom-up.
              The cost of sifting is bounded by the node&apos;s height in
              the tree, not the tree&apos;s height. Most nodes are near
              the bottom with tiny heights. Summing across all nodes:{" "}
              <code>n/2 · 1 + n/4 · 2 + n/8 · 3 + ...</code> telescopes
              to 2n, giving O(n). The naive n-insertions approach costs
              O(n log n) because each insert traverses up to full height
              regardless of where the node ends up.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Find the median of a stream of integers.
            </p>
            <p className="mt-2 text-sm">
              A: Maintain two heaps: a max-heap for the lower half, a
              min-heap for the upper half. On each new number, add to
              the appropriate heap then rebalance so they differ in size
              by at most 1. The median is either the max-heap root, the
              min-heap root, or their average (if sizes are equal).
              O(log n) per update, O(1) per query. This is a canonical
              application of using two heaps to maintain a median invariant.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Merge k sorted lists into one sorted list.
            </p>
            <p className="mt-2 text-sm">
              A: Use a min-heap of size k, initially containing the head
              of each list. Repeatedly extract the min and append it to
              the output; push the next element from that list. O(n log k)
              total time where n is total elements. Alternative: recursive
              pairwise merge, which is also O(n log k) but has worse
              cache behavior. The heap approach is how Spark&apos;s
              sort-merge spills, Lucene&apos;s segment merge, and
              BigQuery&apos;s intermediate-stage merge all operate.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: When would you use a Fibonacci heap?
            </p>
            <p className="mt-2 text-sm">
              A: Almost never in practice. In theory, their amortized
              O(1) insert and decrease-key improve Dijkstra&apos;s
              complexity. In practice, the constants are so large — every
              operation involves intricate tree linking and marking
              bookkeeping — that binary heaps or d-ary heaps dominate on
              every real benchmark. Fibonacci heaps appear in academic
              proofs and occasionally in very specific algorithmic
              research, but production shortest-path code uses simpler
              heaps.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Implement decrease-key without an indexed heap.
            </p>
            <p className="mt-2 text-sm">
              A: Lazy deletion. Instead of finding and updating the
              element in O(n), re-insert with the new key and mark the
              old entry as stale (via a version number or a set of
              invalidated entries). On extraction, skip stale entries.
              The heap may temporarily hold O(n) stale entries; the
              amortized cost stays O(log n) per operation under standard
              assumptions. This is the approach used in many Dijkstra
              implementations because it avoids the hash-map index
              bookkeeping.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 9 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">
          References &amp; Further Reading
        </h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            Knuth, D.E. — <em>The Art of Computer Programming, Volume 3:
            Sorting and Searching</em>, Section 5.2.3 on heapsort and heaps.
          </li>
          <li>
            Cormen, Leiserson, Rivest, Stein — <em>Introduction to
            Algorithms</em>, 4th Edition, Chapter 6 (Heapsort), Chapter 19
            (Fibonacci Heaps), and Chapter 22 for Dijkstra with heap.
          </li>
          <li>
            Williams, J.W.J. — <em>Algorithm 232: Heapsort</em>,
            Communications of the ACM, 1964: the original introduction of
            binary heaps.
          </li>
          <li>
            Floyd, R.W. — <em>Algorithm 245: Treesort 3</em>, Communications
            of the ACM, 1964: the linear-time heapify algorithm.
          </li>
          <li>
            Fredman, M., Tarjan, R. — <em>Fibonacci heaps and their uses in
            improved network optimization algorithms</em>, JACM 1987: the
            Fibonacci heap paper.
          </li>
          <li>
            Boost Heap library documentation: reference for d-ary heaps,
            pairing heaps, binomial heaps, and Fibonacci heaps in a
            production context.
          </li>
          <li>
            Python <code>heapq</code> module source: clean, well-commented
            reference for array-backed binary min-heap with Floyd&apos;s
            heapify.
          </li>
          <li>
            Sedgewick, R., Wayne, K. — <em>Algorithms</em>, 4th Edition,
            Chapter 2.4 on priority queues with indexed and multi-way
            heap variants.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
