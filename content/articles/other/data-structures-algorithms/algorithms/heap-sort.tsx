"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "heap-sort",
  title: "Heap Sort",
  description:
    "Heap Sort — guaranteed O(n log n) in-place sorting via binary-heap extraction. Introsort's safety net and the Linux kernel's sort of choice.",
  category: "other",
  subcategory: "algorithms",
  slug: "heap-sort",
  wordCount: 5000,
  readingTime: 25,
  lastUpdated: "2026-04-20",
  tags: ["heap-sort", "sorting", "binary-heap", "sift-down", "introsort"],
  relatedTopics: [
    "quick-sort",
    "merge-sort",
    "heaps-priority-queues",
    "selection-sort",
  ],
};

export default function HeapSortArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p className="mb-4">
          Heap Sort is an in-place comparison sort with guaranteed Θ(n log n) worst-case running
          time, O(1) extra space, and no dependence on input distribution. J. W. J. Williams invented
          the binary heap and heap sort in 1964, and R. W. Floyd refined the implementation to use
          sift-down (siftup from the bottom is O(n) rather than O(n log n) for heap construction —
          a subtle but important optimization). The algorithm operates on an implicit max-heap built
          in the array itself, repeatedly extracting the maximum to the end of the array.
        </p>
        <p className="mb-4">
          Heap Sort is conceptually a turbocharged selection sort. Selection sort scans the unsorted
          region in Θ(n) to find the max and places it at the end. Heap sort maintains a heap over
          the unsorted region so finding-and-removing the max costs O(log n) instead of O(n).
          Summed over n extractions, that is Θ(n log n) — the same asymptotic class as merge sort
          and (expected) quicksort, achieved entirely in place.
        </p>
        <p className="mb-4">
          In production, heap sort rarely runs as a primary sort because it is 2–3× slower than
          quicksort on average — its memory access pattern (parent at i, children at 2i+1 and 2i+2)
          jumps between non-adjacent cache lines, destroying prefetcher effectiveness. But its
          guaranteed worst case makes it invaluable as introsort&apos;s fallback when quicksort recursion
          depth exceeds 2⌊log₂ n⌋. It also appears standalone in contexts where predictable timing
          matters more than throughput: the Linux kernel&apos;s lib/sort.c is heap sort precisely because
          kernel code cannot tolerate quicksort&apos;s O(n²) tail on adversarial input.
        </p>
        <p className="mb-4">
          Heap sort is also the primary sorting algorithm when the priority queue is the data
          structure in use anyway — e.g., Dijkstra&apos;s algorithm outputs nodes in sorted order of
          shortest-path distance by the natural operation of the min-heap. Top-k selection via a
          size-k heap (keep the k smallest/largest) is a closely related use: it is heap sort
          truncated after k extractions and runs in O(n log k).
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/heap-sort-diagram-1.svg"
          alt="Heap sort two phases: build max-heap then repeated extract-max to the back"
          caption="Two phases: build max-heap (O(n)), then repeatedly swap root with last and sift-down."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <h3 className="text-xl font-semibold mt-6 mb-3">The binary heap as an array</h3>
        <p className="mb-4">
          A binary heap is a complete binary tree (every level full except possibly the last, which
          fills left-to-right) satisfying the heap property: every parent&apos;s key is ≥ both children
          (max-heap) or ≤ both children (min-heap). Crucially, this complete shape lets us store the
          heap as a flat array with no pointers: the root is index 0, and for any index i, the left
          child is at 2i+1, the right child at 2i+2, and the parent at ⌊(i−1)/2⌋. Heap sort uses the
          <em>same</em> array for both the heap and the sorted output, which is why it is in place.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Sift-down (heapify)</h3>
        <p className="mb-4">
          The core operation is sift-down: given a node that may violate the heap property, swap it
          with its larger child repeatedly until it is either ≥ both children or becomes a leaf.
          Sift-down on a node at height h costs O(h). Since a binary heap&apos;s height is ⌊log₂ n⌋,
          single sift-down is O(log n).
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Floyd&apos;s build-heap — why it&apos;s O(n)</h3>
        <p className="mb-4">
          Naively, building a heap by inserting n elements one at a time is Θ(n log n). Floyd&apos;s
          method starts from the last non-leaf and sift-downs backward to index 0. The trick is that
          most nodes are near the bottom — n/2 are leaves (cost 0), n/4 are at height 1 (cost 1),
          n/8 at height 2 (cost 2), and so on. Summing i · n/2^(i+1) over all heights gives Θ(n).
          This linear-time build is why heap sort&apos;s total cost is Θ(n log n) — n extract-max at
          O(log n) each dominates — and not Θ(n log n) + Θ(n log n).
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">The two phases</h3>
        <p className="mb-4">
          Phase 1: transform the array into a max-heap via Floyd&apos;s build-heap in Θ(n). Phase 2:
          repeatedly swap the root (maximum) with the last unsorted element, decrement the heap
          size, and sift-down the new root in the reduced heap. After n such iterations, the array
          is sorted ascending. Because each swap places one element in its final position and the
          sift-down restores the heap property on the rest, the algorithm is in place and needs no
          auxiliary storage.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/heap-sort-diagram-2.svg"
          alt="Array-to-tree mapping for a binary heap showing parent-child index arithmetic"
          caption="Implicit tree: root at 0, children at 2i+1 / 2i+2, parent at ⌊(i−1)/2⌋. No pointers needed."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p className="mb-4">
          A production heap sort is tight: build-heap calls sift-down from ⌊n/2⌋−1 down to 0; the
          extraction loop runs from i = n−1 down to 1, each iteration swapping arr[0] with arr[i],
          decrementing the logical heap size, and sift-downing arr[0] within [0, i). The inner
          sift-down is the hot loop — picks the larger of the two children, compares with the
          current node, and swaps if the node is smaller. Branch prediction on this inner loop
          matters: on modern CPUs, a branchless compare-and-swap variant can nearly double
          throughput.
        </p>
        <p className="mb-4">
          Cache behavior is the Achilles heel. At height h, sift-down jumps from index i to index
          2i+1 or 2i+2 — for large arrays, this crosses cache lines on nearly every step. Merge
          sort and quicksort do sequential scans, hitting every element in a cache line before
          moving on; heap sort touches one element, then jumps. Measurements show heap sort spending
          20–40% of its time waiting on L2/L3 misses on arrays above 1 MB. Techniques to mitigate:
          d-ary heaps (each node has d = 4 or 8 children, giving log_d n depth and better locality)
          reduce cache misses at the cost of more comparisons per sift-down. The d=4 quaternary
          heap is a measured sweet spot — used in some priority queue libraries.
        </p>
        <p className="mb-4">
          Introsort&apos;s integration of heap sort is an interesting engineering pattern. The quicksort
          recursion carries a depth counter initialized to 2⌊log₂ n⌋. If a call is entered with
          depth = 0, the implementation stops partitioning and calls heap sort on that subrange.
          This guarantees O(n log n) worst case without sacrificing quicksort&apos;s average-case speed
          on well-behaved input. libstdc++&apos;s std::sort has followed this pattern since 1997.
        </p>
        <p className="mb-4">
          Partial heap sort (top-k selection) truncates phase 2 after k extractions, giving O(n +
          k log n). This is the standard &quot;find the k largest&quot; pattern. A variant uses a size-k
          min-heap over the stream and evicts the min whenever a larger element arrives — O(n log
          k), better when n ≫ k. Streaming top-k servers (Spotify&apos;s recommendation ranker,
          TopCoder-style leaderboards) use this continuously.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <h3 className="text-xl font-semibold mt-6 mb-3">vs. Quick Sort</h3>
        <p className="mb-4">
          Quick sort is ~2–3× faster on average due to cache-friendly sequential access and tighter
          inner loops, but has O(n²) worst case. Heap sort is slower but has guaranteed O(n log n).
          Introsort combines them: quicksort on the happy path, heap sort when depth blows up.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">vs. Merge Sort</h3>
        <p className="mb-4">
          Both are O(n log n) worst case. Merge sort is stable and needs Θ(n) auxiliary space; heap
          sort is unstable and in-place. Merge sort is faster in practice for large arrays because
          it has sequential access; heap sort&apos;s jumpy pattern loses to prefetchers. Choose merge
          sort for stable sort needs, heap sort for O(1) space + guaranteed bound.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Stability</h3>
        <p className="mb-4">
          Heap sort is <strong>unstable</strong>. Sift-down swaps can reorder elements with equal
          keys arbitrarily. Stabilization requires augmenting keys with original indices, defeating
          the O(1) space advantage.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Adaptivity</h3>
        <p className="mb-4">
          Heap sort is <strong>not adaptive</strong>. Sorted input, reversed input, random input —
          all take the same Θ(n log n) time. Insertion sort, Tim Sort, and pdqsort all beat it on
          partially-sorted data. Heap sort&apos;s predictability is its value; adaptivity is not.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Use Floyd&apos;s build-heap</strong> (Θ(n)) not n-insertions (Θ(n log n)) — worst error is constant factor.</li>
          <li><strong>Consider d-ary heaps (d=4)</strong> when cache misses dominate; shallower tree = better locality at small comparison cost.</li>
          <li><strong>For top-k with n ≫ k, use size-k min-heap</strong>, not sort-then-slice — O(n log k) vs O(n log n).</li>
          <li><strong>Heap sort as the primary sort</strong> only when you need O(1) space and guaranteed bound and cannot use introsort — e.g., kernel or embedded code.</li>
          <li><strong>Guard against integer overflow</strong> in index arithmetic (2i+1 and 2i+2) when n approaches 2³¹.</li>
          <li><strong>Benchmark against quicksort on your data</strong> before swapping it in — the cache penalty is real and workload-dependent.</li>
          <li><strong>When using it as a priority queue</strong>, batch inserts and use build-heap rather than n individual push operations.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Sifting up instead of down for build-heap</strong>: yields O(n log n) instead of O(n). Build from the last non-leaf downward.</li>
          <li><strong>Confusing max-heap with min-heap direction</strong>: sorting ascending needs max-heap (largest to end); descending needs min-heap.</li>
          <li><strong>Off-by-one in heap-size tracking</strong> during extraction — after swap, sift-down must operate on [0, size−1), not [0, size).</li>
          <li><strong>Assuming heap sort is stable</strong> — breaks code that relied on equal-key ordering.</li>
          <li><strong>Expecting adaptivity</strong> — sorted input runs in full Θ(n log n), not Θ(n) like Tim Sort.</li>
          <li><strong>Using heap sort where cache behavior matters</strong> — large-array numerical code almost always prefers merge sort or quicksort.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <p className="mb-4">
          <strong>Introsort fallback</strong>: C++ std::sort, libc++ std::sort, MSVC std::sort all
          call heap sort when quicksort recursion depth exceeds 2⌊log₂ n⌋. The primary production
          use.
        </p>
        <p className="mb-4">
          <strong>Linux kernel sort()</strong> (lib/sort.c) is heap sort — chosen specifically for
          predictable worst-case timing in kernel paths where O(n²) would be unacceptable.
        </p>
        <p className="mb-4">
          <strong>Priority queue implementations</strong>: Python&apos;s heapq, Java&apos;s PriorityQueue,
          C++&apos;s std::priority_queue, Rust&apos;s BinaryHeap — all use binary heap internals. While they
          do not strictly run &quot;heap sort&quot;, the data structure is identical, and draining the queue
          yields a sorted sequence.
        </p>
        <p className="mb-4">
          <strong>Dijkstra&apos;s algorithm</strong> and <strong>A* pathfinding</strong> use min-heaps
          to extract the next node in order of tentative distance — effectively an online heap
          sort over the visited set.
        </p>
        <p className="mb-4">
          <strong>Top-k selection</strong>: search ranking, recommendation &quot;top 20&quot; retrieval,
          monitoring dashboards showing the top-N slowest queries. Elasticsearch uses size-k heaps
          for top-hits aggregations.
        </p>
        <p className="mb-4">
          <strong>Real-time scheduling</strong>: event loops (libuv, Tokio) use min-heaps of timers
          to find the next-to-fire in O(log n). Browser task queues, kernel high-resolution timers,
          and game engine tick schedulers follow the same pattern.
        </p>
        <p className="mb-4">
          <strong>Huffman coding</strong> builds its prefix tree by repeatedly extracting the two
          minimum-frequency nodes — pure min-heap extraction, n−1 times, in O(n log n).
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/heap-sort-diagram-3.svg"
          alt="Heap sort extraction phase trace showing root-to-end swaps and sift-down restoration"
          caption="Extraction phase: swap root→end, shrink heap, sift-down new root. n−1 iterations."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li><strong>Why is Floyd&apos;s build-heap O(n) and not O(n log n)?</strong> Cost per node proportional to height; most nodes are near the bottom where height is small. Sum is Θ(n).</li>
          <li><strong>Implement heap sort in place.</strong> Build-heap via sift-down from ⌊n/2⌋−1; loop swap root with end and sift-down within shrinking range.</li>
          <li><strong>How does heap sort differ from selection sort?</strong> Both repeatedly select the max — selection sort in O(n), heap sort in O(log n). Same structure, exponentially better.</li>
          <li><strong>Find the k largest elements in an n-element array.</strong> Size-k min-heap, scan array, replace min when larger appears. O(n log k).</li>
          <li><strong>Why is heap sort slower than quicksort despite same O(n log n)?</strong> Cache-unfriendly jumps between parent and child indices; quicksort&apos;s partition is sequential.</li>
          <li><strong>Is heap sort stable?</strong> No — sift-down swaps reorder equal keys.</li>
          <li><strong>How does introsort use heap sort?</strong> Fallback when quicksort recursion depth exceeds 2⌊log₂ n⌋; guarantees O(n log n) worst case.</li>
          <li><strong>When would you pick heap sort over merge sort?</strong> When O(1) extra space is required and stability is not. Embedded, kernel, or memory-constrained code.</li>
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>J. W. J. Williams, &quot;Algorithm 232: Heapsort&quot; (CACM 1964) — original paper.</li>
          <li>R. W. Floyd, &quot;Algorithm 245: Treesort 3&quot; (CACM 1964) — the O(n) build-heap trick.</li>
          <li>CLRS Chapter 6 (Heapsort) — textbook reference.</li>
          <li>Sedgewick &amp; Wayne, <em>Algorithms</em> 4e, Section 2.4 — heap-based priority queues.</li>
          <li>Linux kernel source: <code>lib/sort.c</code> — production heap sort with worst-case guarantee.</li>
          <li>Katajainen, &quot;The Ultimate Heapsort&quot; (1998) — bottom-up heap sort optimizations.</li>
          <li>LaMarca &amp; Ladner, &quot;The Influence of Caches on the Performance of Heapsort&quot; (1996) — the canonical cache-miss analysis.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
