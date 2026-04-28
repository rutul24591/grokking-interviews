"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "heap",
  title: "Heap Pattern",
  description:
    "Priority-queue workhorse for top-k, k-way merge, Dijkstra, two-heaps median, and event scheduling — O(log n) push/pop with O(1) peek.",
  category: "other",
  subcategory: "patterns",
  slug: "heap",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-26",
  tags: ["heap", "priority-queue", "leetcode", "patterns", "top-k"],
  relatedTopics: ["top-k-elements", "k-way-merge", "graph"],
};

export default function HeapArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
      <p className="mb-4">
        A heap is a complete binary tree stored in an array that satisfies the heap property: every
        parent is no greater than (min-heap) or no less than (max-heap) its children. There is no
        order between siblings, and no order between subtrees beyond the root invariant — the only
        guarantee is that the top of the heap is the minimum (or maximum) of the entire collection.
        That single guarantee is enough to power an enormous family of interview problems.
      </p>
      <p className="mb-4">
        Operations are O(log n) for push and pop, O(1) for peek, and O(n) for building a heap from
        an unsorted array via Floyd&apos;s sift-down algorithm. The array layout is implicit: the
        children of index i are at 2i+1 and 2i+2, the parent of index i is at (i-1)/2 — no pointers,
        cache-friendly traversal, no rebalancing trees.
      </p>
      <p className="mb-4">
        Recognition signals: &quot;k largest&quot;, &quot;k smallest&quot;, &quot;k closest&quot;,
        &quot;merge k sorted&quot;, &quot;running median&quot;, &quot;next event by time&quot;,
        &quot;shortest path with non-negative weights&quot;, &quot;most frequent k items&quot;.
        Whenever the algorithm repeatedly needs the next-best element by some priority, the heap is
        the right substrate. If the priority is fixed (sort once, walk linearly), use sorting; if
        you need next-best <em>repeatedly under insertion</em>, use a heap.
      </p>
      <p className="mb-4">
        Heap is also the canonical answer when streaming: data arrives one element at a time, you
        cannot afford to re-sort the entire window, and you only need a small summary (top-k,
        median). Bounded heaps give O(n log k) where sorting would give O(n log n) — a real win
        when k is much smaller than n, which is the typical interview shape.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
      <p className="mb-4">
        <strong>Sift-up and sift-down.</strong> After push, the new element sits at the last leaf
        and walks up while it violates the heap property with its parent. After pop, the last leaf
        moves to the root and walks down, swapping with the smaller (min-heap) child until the
        invariant holds. Each path is at most log n long, hence the O(log n) bound.
      </p>
      <p className="mb-4">
        <strong>Heapify.</strong> Building a heap from an array of size n by pushing each element
        is O(n log n). Floyd&apos;s heapify — sift-down from index n/2-1 down to 0 — is O(n) by a
        tighter sum, because most nodes are near the leaves and travel a short distance. When a
        problem hands you the full array up front, always heapify; never push n times.
      </p>
      <p className="mb-4">
        <strong>Bounded heap (top-k).</strong> The classic optimisation. To find the k largest in a
        stream, maintain a <em>min-heap</em> of size k. For each incoming x, if heap size is less
        than k push x; else if x is greater than the heap top, pop the top and push x. The heap
        always holds the k largest seen so far, with the smallest of those k at the top — the
        sentinel that filters out everything smaller. The dual works for k smallest with a max-heap.
      </p>
      <p className="mb-4">
        <strong>Two heaps.</strong> Maintain a max-heap of the lower half and a min-heap of the
        upper half of a stream, keeping the size invariant |low| equal to |high| or one larger.
        The median is then either the top of the larger heap (odd count) or the average of the two
        tops (even count). Each addNum is O(log n) and findMedian is O(1). The technique
        generalises: any &quot;split a stream at a position&quot; problem maps to two heaps.
      </p>
      <p className="mb-4">
        <strong>K-way merge.</strong> Given k sorted lists, push the first element of each into a
        min-heap with a back-pointer. Pop the smallest, append it to the output, push the next
        element from the same list. The heap always holds at most k items — one frontier per list —
        and the total work is O(N log k) for N total elements. This is strictly better than
        repeated pairwise merges and far better than collecting all and sorting.
      </p>
      <p className="mb-4">
        <strong>Dijkstra and Prim.</strong> Both fit the &quot;next-best frontier&quot; mould.
        Dijkstra extracts the unvisited node with smallest tentative distance and relaxes its
        edges; Prim extracts the lightest edge crossing the cut. The heap is the frontier, and
        decrease-key is approximated by pushing duplicates with stale distances and skipping any
        popped entry whose distance is worse than the recorded best — &quot;lazy deletion&quot;.
      </p>
      <p className="mb-4">
        <strong>Lazy deletion.</strong> The heap API does not support removing an arbitrary element
        cheaply. The workaround: leave invalid entries in place and discard them when they reach
        the top. For every pop, check whether the entry is still valid (matches a visited set, a
        version counter, or the current best). Used in Dijkstra, sliding-window median, task
        schedulers — anywhere entries can become stale before they would naturally surface.
      </p>
      <ArticleImage src="/diagrams/other/leetcode/patterns/heap-diagram-1.svg" alt="Heap definition, operations, and use cases" />

      <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
      <p className="mb-4">
        The canonical top-k template is the most reused heap pattern in interviews. Initialise an
        empty heap. For each element in the stream, push it; if the heap exceeds size k, pop the
        worst. At the end, the heap contains the k best elements in arbitrary order — drain it if
        you need them sorted. Time O(n log k), space O(k). The only subtle choice is the polarity:
        for &quot;k largest&quot; the heap is a min-heap (the floor we keep raising); for &quot;k
        smallest&quot; it is a max-heap (the ceiling we keep lowering).
      </p>
      <p className="mb-4">
        The two-heaps median template splits the stream by value. Push to the low max-heap if the
        new value is at most the low max; otherwise push to the high min-heap. After each push,
        rebalance by transferring the top from whichever heap is now too large. The invariant —
        |low| equals |high| or |high| plus one — uniquely determines where to read the median.
        Generalisation: replace the size invariant with any size split, and you can answer
        k-th-percentile streaming queries.
      </p>
      <p className="mb-4">
        The k-way merge template generalises to any &quot;merge sorted streams&quot; shape:
        Leetcode 23 (linked lists), 378 (sorted matrix rows or columns as streams), 632 (smallest
        range covering all k lists). For 632, push the first element of each list and track the
        max as you go; the answer is whatever range has the smallest max-min while the heap still
        contains one element from every list.
      </p>
      <p className="mb-4">
        The Dijkstra template treats the graph as a streaming source of frontier candidates. Push
        the start with distance zero. Repeatedly pop the smallest; if already visited (its current
        best is smaller than the popped distance), skip; otherwise mark visited and push each
        neighbour with the new tentative distance. Time O((V+E) log V) with a binary heap, or O(E
        + V log V) with a Fibonacci heap (the latter is theoretical — no one writes Fibonacci
        heaps in interviews, and the binary heap version is what interviewers expect).
      </p>
      <p className="mb-4">
        The scheduler template (Leetcode 621 Task Scheduler, 1834 Single-threaded CPU) uses a
        max-heap (or min-heap) keyed on priority and a cooldown queue or time pointer. At each
        step, pop the highest-priority task that is currently runnable; advance time; push back
        any tasks that became runnable. The combination of a heap (priority) and a queue
        (waiting room) is a recurring pair — neither alone is enough.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
      <p className="mb-4">
        <strong>Heap vs. sorting.</strong> Sorting is O(n log n) and gives random access to all
        order statistics; heap is O(n log k) for top-k and supports streaming. Use sorting when k
        is comparable to n or when you need the entire ordering. Use a heap when k is small or the
        stream is unbounded.
      </p>
      <p className="mb-4">
        <strong>Heap vs. quickselect.</strong> Quickselect finds the k-th order statistic in O(n)
        average (O(n²) worst case) and partitions the array around it. Use quickselect when the
        whole array is in memory and you need only the value, not a streaming guarantee. Use a
        heap when data arrives over time, when you need <em>all</em> top-k items rather than just
        the k-th, or when worst-case complexity matters (heap is O(n log k) deterministic).
      </p>
      <p className="mb-4">
        <strong>Heap vs. balanced BST.</strong> A BST gives O(log n) insert, delete, find-min,
        find-max, and k-th order statistic. A heap gives O(log n) insert and find-extremum but
        no efficient arbitrary lookup. Use a BST (TreeSet, std::set) when you need deletion of
        arbitrary elements or order statistics other than the top — sliding-window median is the
        textbook case where a multiset version often beats two heaps with lazy deletion in
        practice.
      </p>
      <p className="mb-4">
        <strong>Heap vs. bucket sort.</strong> For top-k frequent elements with bounded value
        range (frequencies between 1 and n), bucket sort runs in O(n) by indexing buckets by
        frequency. Heap runs in O(n log k). When the universe of priorities is small and bounded,
        bucket sort wins; otherwise heap is the default.
      </p>
      <p className="mb-4">
        <strong>Heap vs. segment tree.</strong> A segment tree supports range queries and point
        updates in O(log n). Use it when you need range minimum or sum, not just the global
        extremum. Heap is far simpler when the question is &quot;next minimum overall&quot;.
      </p>
      <p className="mb-4">
        <strong>Heap vs. monotonic deque.</strong> For sliding-window maximum (Leetcode 239), a
        monotonic deque gives O(n) total time, beating the heap&apos;s O(n log k) with lazy
        deletion. Heap is more flexible (any priority, not just a window of fixed size); deque is
        faster for the specific contiguous-window case.
      </p>
      <ArticleImage src="/diagrams/other/leetcode/patterns/heap-diagram-2.svg" alt="Top-k and two-heaps templates" />

      <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
      <p className="mb-4">
        <strong>Choose polarity by what you discard.</strong> The heap top is the element you pop
        first — it should be the worst of the &quot;keepers&quot;. For k largest, discard small,
        so a min-heap whose top is the smallest of the current k. For k smallest, max-heap. State
        the invariant aloud before coding.
      </p>
      <p className="mb-4">
        <strong>Use language built-ins.</strong> Python&apos;s heapq is a min-heap with negation
        for max; Java&apos;s PriorityQueue takes a Comparator; C++&apos;s priority_queue is a
        max-heap by default. Know the defaults of your language so you do not invert by accident.
      </p>
      <p className="mb-4">
        <strong>Carry tie-breakers explicitly.</strong> When priorities can tie, define a stable
        comparator. Leetcode 692 (top-k frequent words) requires lexicographic order on ties — a
        custom comparator that flips one field is the cleanest fix. Tuples work in Python and C++;
        custom Comparators in Java.
      </p>
      <p className="mb-4">
        <strong>Heapify when you have the whole array.</strong> O(n) heapify is strictly better
        than n pushes. Languages expose it as heapq.heapify (Python), make_heap (C++), or the
        PriorityQueue collection constructor (Java).
      </p>
      <p className="mb-4">
        <strong>Use lazy deletion for stale entries.</strong> Do not try to remove from the middle
        of a heap. Mark, version, or visited-set the entry, leave it in place, and discard at pop
        time. This is the standard pattern for Dijkstra and sliding-window heap problems.
      </p>
      <p className="mb-4">
        <strong>Bound the heap when possible.</strong> If only k matter, never let the heap grow
        past k. Pop on push when size exceeds k. This keeps each operation at O(log k) instead of
        O(log n) and bounds memory.
      </p>
      <p className="mb-4">
        <strong>Tie back-pointers to source.</strong> In k-way merge, push tuples of (value,
        list-index, item-index) so when you pop you know which list to advance. Forgetting the
        back-pointer is the most common k-way-merge bug.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
      <p className="mb-4">
        <strong>Wrong heap polarity.</strong> &quot;K largest&quot; with a max-heap sounds right
        but is exactly wrong: the max-heap top is the largest, which you would never want to
        discard. Polarity errors are the single most common heap bug. Anchor on &quot;the top is
        the next thing I am willing to throw away&quot;.
      </p>
      <p className="mb-4">
        <strong>Not bounding the heap.</strong> Pushing every element of an n-stream into an
        unbounded heap is O(n log n) in space and time — at that point you might as well sort. The
        win of top-k is bounding to k.
      </p>
      <p className="mb-4">
        <strong>Comparator on mutable state.</strong> If the priority of a heap element depends on
        a mutable field, mutating after push silently breaks the invariant. Either snapshot the
        priority into the entry at push time or treat updates as a new push plus lazy delete.
      </p>
      <p className="mb-4">
        <strong>Forgetting two-heap rebalancing.</strong> After every push, the size invariant
        must be restored. A common bug is rebalancing only when the larger heap exceeds the
        smaller by two; the cleaner rule is to always end with low equal to high or low equal to
        high plus one, regardless of which side received the new value.
      </p>
      <p className="mb-4">
        <strong>Stale Dijkstra entries.</strong> When a shorter path is found before the longer
        one is popped, the longer one remains in the heap. Without the visited check at pop time,
        you would relax edges from already-finalised nodes and corrupt the result. Always discard
        a popped entry whose distance is greater than the currently recorded best.
      </p>
      <p className="mb-4">
        <strong>Heap as sorted structure.</strong> The heap order is not the sorted order. Iterating
        a heap in array order gives an arbitrary sequence; only repeated pops give sorted order.
        Beginners often try to read heap[1], heap[2] and assume those are the second and third
        smallest — they are not.
      </p>
      <p className="mb-4">
        <strong>Negative-weight Dijkstra.</strong> Dijkstra requires non-negative edge weights. With
        negatives, the popped node may not be finalised, and the algorithm produces wrong results.
        Switch to Bellman-Ford or SPFA for negative weights.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases (Canonical Leetcode)</h2>
      <p className="mb-4">
        <strong>215. Kth Largest Element in an Array.</strong> Either quickselect (O(n) average) or
        a min-heap of size k (O(n log k)). Classic warm-up; the interviewer often follows up with
        &quot;in a stream&quot;, where heap is the only viable answer.
      </p>
      <p className="mb-4">
        <strong>347. Top K Frequent Elements.</strong> Counter, then min-heap of size k by
        frequency, or bucket sort if you want O(n). The bucket-sort follow-up is a frequent
        interview escalation.
      </p>
      <p className="mb-4">
        <strong>692. Top K Frequent Words.</strong> Same as 347 but with a tie-breaker on lex
        order; tests whether you write the comparator correctly under inverted polarity.
      </p>
      <p className="mb-4">
        <strong>23. Merge k Sorted Lists.</strong> The textbook k-way merge: heap of head pointers,
        pop the smallest, push the next from that list. O(N log k).
      </p>
      <p className="mb-4">
        <strong>378. Kth Smallest in a Sorted Matrix.</strong> Two solutions — heap of k elements
        from the rows or binary search on value. Heap is more intuitive; binary search on value
        gives O(n log(max-min)) and tests broader range of techniques.
      </p>
      <p className="mb-4">
        <strong>373. Find K Pairs with Smallest Sums.</strong> Heap with deduplication via a
        visited set on (i, j) coordinates, generating neighbours (i+1, j) and (i, j+1) on the fly.
      </p>
      <p className="mb-4">
        <strong>295. Find Median from Data Stream.</strong> The two-heaps poster child. Insertion
        in O(log n), median in O(1).
      </p>
      <p className="mb-4">
        <strong>480. Sliding Window Median.</strong> Two heaps with lazy deletion, or a sorted
        multiset. Tests whether you can maintain a position invariant under both insertion and
        removal.
      </p>
      <p className="mb-4">
        <strong>502. IPO.</strong> Two heaps — a min-heap by required capital (the &quot;not yet
        affordable&quot; queue) and a max-heap by profit (the &quot;available&quot; pool). Each
        round, move newly affordable projects into the profit heap and pop the most profitable.
      </p>
      <p className="mb-4">
        <strong>1631. Path with Minimum Effort.</strong> Dijkstra over the grid where edge cost is
        the absolute height difference. The frontier is a min-heap by current path effort.
      </p>
      <p className="mb-4">
        <strong>743. Network Delay Time.</strong> Plain Dijkstra single-source shortest path. The
        baseline graph problem.
      </p>
      <p className="mb-4">
        <strong>621. Task Scheduler.</strong> Max-heap of remaining counts plus a cooldown queue.
        Pop the most-remaining task, decrement, push it to the cooldown queue with the unlock
        time; promote back to the heap when its cooldown expires.
      </p>
      <ArticleImage src="/diagrams/other/leetcode/patterns/heap-diagram-3.svg" alt="Canonical heap Leetcode problems" />

      <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li><strong>Why is heapify O(n) and not O(n log n)?</strong> Most nodes are near the leaves and
        sift down a short distance. Summing the work across all levels gives a geometric series
        bounded by 2n — strictly linear despite the per-node logarithmic worst case.</li>
        <li><strong>Why min-heap for k largest?</strong> The heap top is the eviction candidate. To
        keep the largest k, you want to evict the smallest of the kept ones — that is the min-heap
        top.</li>
        <li><strong>Why does Dijkstra fail with negative edges?</strong> Once a node is popped, the
        algorithm assumes its distance is final. Negative edges can later improve it, but the
        algorithm has already moved on. Bellman-Ford handles negatives by allowing repeated
        relaxation.</li>
        <li><strong>How would you implement decrease-key?</strong> Either an indexed heap that stores
        positions in an external map (true O(log n) decrease-key) or lazy deletion — push the new
        priority and discard the stale entry at pop time. Most interviews accept the lazy approach.</li>
        <li><strong>When would you choose quickselect over a heap?</strong> When the entire array is
        in memory, you only need the k-th order statistic (not all top-k), and average-case O(n)
        matters more than worst-case O(n log k). Quickselect partitions in place and avoids the
        log factor on average.</li>
        <li><strong>Why do two heaps work for the median?</strong> The median splits the data into a
        lower half and upper half. The max of the lower half and the min of the upper half are
        exactly the candidates for the median. Heaps give those tops in O(1) and maintain the
        split in O(log n) per insertion.</li>
        <li><strong>How do you handle ties in priority?</strong> Add a secondary key to the comparator —
        insertion order for stability, lex order for word problems, FIFO for fairness. Without an
        explicit tie-breaker, behaviour is unspecified and tests can fail nondeterministically.</li>
        <li><strong>Heap vs. balanced BST for sliding-window median?</strong> A multiset gives O(log n)
        per insertion, deletion, and middle-iterator lookup. Two heaps with lazy deletion can
        match the asymptotic bound but the multiset is cleaner. The interviewer&apos;s preferred
        answer often depends on the language ergonomics.</li>
        <li><strong>What is the space complexity of k-way merge?</strong> O(k) for the heap,
        regardless of the total size N. That is the structural advantage over collecting all
        elements before sorting.</li>
        <li><strong>Can a heap be used for a priority queue with deadlines?</strong> Yes — that is the
        scheduling pattern. Min-heap by deadline, peek to know what runs next, pop when its
        deadline arrives. The combination with a cooldown queue handles tasks that become eligible
        only after some time.</li>
      </ol>
<h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Cormen, Leiserson, Rivest, Stein, <em>Introduction to Algorithms</em>, chapter 6
        (Heapsort) and chapter 24 (Dijkstra). Sedgewick and Wayne, <em>Algorithms</em>, 4th ed.,
        chapter 2.4 (Priority Queues). Skiena, <em>The Algorithm Design Manual</em>, section 3.5.</li>
        <li>Leetcode pattern lists: &quot;Top K Elements&quot;, &quot;Two Heaps&quot;, &quot;K-way
        Merge&quot;, &quot;Modified Dijkstra&quot;. Grokking the Coding Interview groups all five
        under heap-flavoured patterns. NeetCode 150 includes 215, 347, 295, 23, 1046, 621, 703,
        973 in the heap track.</li>
        <li>Floyd&apos;s linear-time heapify is described in Floyd 1964, &quot;Algorithm 245:
        Treesort&quot;, CACM. The IndexMinPQ implementation in Sedgewick gives a true O(log n)
        decrease-key for Dijkstra without lazy deletion.</li>
      </ul>
    </ArticleLayout>
  );
}
