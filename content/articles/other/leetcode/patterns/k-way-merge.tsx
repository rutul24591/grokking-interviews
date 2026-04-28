"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "k-way-merge",
  title: "K-way Merge Pattern",
  description:
    "Merge k sorted streams with a min-heap of frontiers — O(N log k) time, O(k) space — and the trick for matrix and virtual-list queries.",
  category: "other",
  subcategory: "patterns",
  slug: "k-way-merge",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-26",
  tags: ["k-way-merge", "heap", "leetcode", "patterns"],
  relatedTopics: ["heap", "top-k-elements", "linked-list"],
};

export default function KWayMergeArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
      <p className="mb-4">
        K-way merge is the problem of producing a single sorted output, or answering an
        order-statistic query, from k sorted input streams. Each stream is internally sorted, but
        the streams have no order relative to each other; the goal is to interleave them
        correctly. The pattern generalises the two-way merge step at the heart of merge sort —
        when k = 2 the heap collapses to a simple pointer pair, but for k larger than 2 the heap
        is the right data structure.
      </p>
      <p className="mb-4">
        The recognition signal is the phrase &quot;k sorted&quot; — k sorted lists, k sorted
        arrays, k sorted matrix rows, k generators of sorted values. Even when the streams are
        virtual (each row of a multiplication table, each pair (i, j) in a sum-grid), the heap
        treats them uniformly: push the head of every stream, pop the smallest, push the
        successor from the same stream.
      </p>
      <p className="mb-4">
        The complexity is O(N log k) time and O(k) heap space, where N is the total number of
        elements across all streams. The log k factor is what distinguishes this pattern from
        repeated pairwise merges, which would cost O(N k). The space win matters when N is huge
        and k is small — typical of external-sort and distributed-merge contexts where each
        stream is a sorted run on disk and only k frontier values can fit in memory.
      </p>
      <p className="mb-4">
        At staff level, the pattern doubles as a system-design building block. External sort —
        the algorithm any database or analytics engine uses to sort data larger than RAM — sorts
        chunks that fit in memory, writes them as runs, then merges runs k at a time. Each merge
        is exactly the k-way merge pattern. Distributed top-k aggregation merges per-shard
        sorted partial results; that, too, is k-way merge.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
      <p className="mb-4">
        <strong>Frontier.</strong> The heap holds at most one element per stream — the next
        unconsumed value. We call this the frontier. The heap top is the global minimum across
        all frontiers. After popping, we replace the popped frontier with its successor from the
        same stream (or shrink the heap if the stream is exhausted).
      </p>
      <p className="mb-4">
        <strong>Back-pointer.</strong> Each heap entry must remember which stream it came from.
        For linked lists, the entry can be the node itself (its next field is the back-pointer).
        For arrays or matrices, push (value, stream-id, index) tuples. Without a back-pointer you
        cannot advance the right stream after a pop.
      </p>
      <p className="mb-4">
        <strong>Tuple ordering for ties.</strong> If two frontiers tie on value, the heap must
        still produce a total order to compare entries. Including the stream-id in the tuple
        makes Python tuple comparison total. In Java, write a Comparator that falls back to
        stream-id; never leave the comparator partial.
      </p>
      <p className="mb-4">
        <strong>Initial fill.</strong> Push all non-empty stream heads in O(k) total work using
        heapify, not k pushes. For very small k this is irrelevant; for large k (thousands of
        streams in external sort), heapify saves a log factor.
      </p>
      <p className="mb-4">
        <strong>Variant: query rather than emit.</strong> Some problems do not need the full
        merged sequence. Smallest range covering elements from k lists (632) reads off the
        current heap state at every step — the answer depends on the spread between the top
        (minimum frontier) and a tracked maximum. K-th smallest in a sorted matrix (378) pops
        the heap k times and returns the k-th popped value, never materialising the full
        matrix.
      </p>
      <p className="mb-4">
        <strong>Virtual streams.</strong> The pattern generalises beyond literal lists. For
        problems like 373 (k smallest pairs from two sorted arrays), each row of the implicit
        pair-grid is a sorted stream. For 264 (ugly numbers), the streams are 2*ugly[i],
        3*ugly[j], 5*ugly[k] — virtual generators rather than concrete arrays. The heap does not
        care; it only needs a value, a stream-id, and a way to produce the next value.
      </p>
      <p className="mb-4">
        <strong>Deduplication.</strong> Some virtual-stream problems generate the same value
        from multiple streams (264 produces 6 from both 2*3 and 3*2). Either dedupe at emit
        time (pop equal duplicates) or at push time with a visited set.
      </p>
      <ArticleImage src="/diagrams/other/leetcode/patterns/k-way-merge-diagram-1.svg" alt="K-way merge pattern overview" />

      <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
      <p className="mb-4">
        The plain merge template (Leetcode 23) is the canonical reference. Initialise an empty
        min-heap. For each non-empty input list, push (head.val, list-id, head). Repeat: pop the
        smallest, append the popped node to the output, and if the popped node has a next node,
        push (next.val, list-id, next). Terminate when the heap is empty. The output is a single
        sorted list of all N elements in O(N log k) time.
      </p>
      <p className="mb-4">
        For 88 (merge two sorted arrays in place), the heap is overkill — k = 2. Use two
        pointers from the back of each array, writing the larger into the destination. This is
        the textbook two-way merge with the in-place trick of writing from the right.
      </p>
      <p className="mb-4">
        For 378 (k-th smallest in sorted matrix), treat each row as a sorted stream. Push the
        first element of every row. Pop k times, expanding right-neighbours within the same
        row. The k-th popped value is the answer. Time O(k log min(k, n)) — only the first
        column ever sits in the heap.
      </p>
      <p className="mb-4">
        For 373 (k smallest pairs from two sorted arrays), think of pair (i, j) as a node in a
        2-D grid where each row i is a sorted stream of (nums1[i] + nums2[0], nums1[i] +
        nums2[1], ...). Push (nums1[i] + nums2[0], i, 0) for the first few i (or all i if k is
        large). Pop the smallest; expand to (i, j+1). The visited set prevents pushing the same
        (i, j) twice if you also try to expand down from (i+1, j) — usually you only expand
        right within rows.
      </p>
      <p className="mb-4">
        For 632 (smallest range covering all k lists), the heap holds the frontier from every
        list and a separate max tracker holds the current maximum across the heap. The loop:
        record range [heap.top.value, current_max]; pop the minimum; push the successor from the
        same list (terminate if that list is exhausted); update current_max if the new value is
        larger. The answer is the smallest range observed.
      </p>
      <p className="mb-4">
        For 786 (k-th smallest prime fraction), the streams are the rows i of the fraction
        matrix where each row produces arr[i]/arr[j] for j greater than i. Push (arr[i]/arr[n-1],
        i, n-1) for each i, then pop k times, decrementing j each pop. Alternatively, binary
        search on value works and avoids floating-point comparisons.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
      <p className="mb-4">
        <strong>K-way merge vs. pairwise merge.</strong> Pairwise: merge list 1 and list 2 into
        a list of size 2N/k; merge that with list 3, etc. Total work is O(N k) because each
        element is copied k times. K-way merge with a heap is O(N log k). For k = 100, the heap
        is 15× faster on the same input.
      </p>
      <p className="mb-4">
        <strong>K-way merge vs. divide-and-conquer pairwise merge.</strong> A balanced
        pairwise-merge tree (merge in pairs, then merge pairs of pairs, log k levels) achieves
        O(N log k), the same asymptotic as the heap. The heap is simpler and uses O(k) space;
        the divide-and-conquer needs O(N) recursion stack and is harder to implement on streams.
        In external sort, the heap-based merge is the standard choice.
      </p>
      <p className="mb-4">
        <strong>Heap vs. tournament tree.</strong> A tournament tree (loser tree) is a fixed-size
        binary tree where each leaf is a stream and internal nodes hold the loser of the
        competition between subtrees. It performs k-way merge with the same O(log k) per
        emission but with smaller constants — used in industrial-strength external sorts. For
        interviews, the heap is the expected answer.
      </p>
      <p className="mb-4">
        <strong>Heap vs. binary search on value.</strong> Some k-th-smallest problems (378, 668,
        719) admit a binary-search-on-value alternative: guess a value v, count entries less or
        equal to v across all streams, adjust. Complexity is often O((n + k) log range) — better
        when k is large and range is small. Discuss both in interviews; the binary-search
        version is more elegant but harder to debug under pressure.
      </p>
      <p className="mb-4">
        <strong>Heap vs. priority queue with decrease-key.</strong> If priorities can change for
        items already in the heap (rare in pure k-way merge, common in Dijkstra), an
        index-aware priority queue with decrease-key is preferred. Pure k-way merge does not
        need decrease-key — the heap-popped item is gone forever and the next item from the
        same stream is fresh.
      </p>
      <p className="mb-4">
        <strong>Heap vs. external sort.</strong> External sort is the I/O-aware version of
        k-way merge. The same algorithm, but k is chosen to fit available memory, and the
        merges happen in passes over disk-resident runs. The interview version assumes
        in-memory streams; the system-design version layers buffers, parallel reads, and
        write-amplification analysis on top.
      </p>
      <ArticleImage src="/diagrams/other/leetcode/patterns/k-way-merge-diagram-2.svg" alt="K-way merge templates" />

      <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
      <p className="mb-4">
        <strong>Heapify, do not push k times.</strong> When the initial heap fill is k items,
        use heapify for O(k). It is a habit; even when k is small, do not regress to k pushes.
      </p>
      <p className="mb-4">
        <strong>Push the back-pointer with every entry.</strong> Forgetting it means you cannot
        advance the right stream and you produce a wrong answer. Always include the stream-id
        and index.
      </p>
      <p className="mb-4">
        <strong>Make the comparator total.</strong> Tuple ordering with stream-id as the
        secondary key avoids ambiguous comparisons when values tie. Java&apos;s default
        Comparator on a class without ties is a runtime exception waiting to happen.
      </p>
      <p className="mb-4">
        <strong>Skip empty streams at initialisation.</strong> If any input list is empty,
        do not push a null head. Filtering at fill time keeps the heap clean.
      </p>
      <p className="mb-4">
        <strong>Choose between value and pointer entries thoughtfully.</strong> Pushing nodes
        keeps memory low but ties the heap to the input structure. Pushing values requires a
        separate index map. For LinkedList problems, push the node directly; for primitive
        arrays, push tuples.
      </p>
      <p className="mb-4">
        <strong>For matrix problems, push only the first column.</strong> Pushing every cell
        defeats the purpose. The heap should hold one frontier per row, never more.
      </p>
      <p className="mb-4">
        <strong>For pair-grid problems, dedupe.</strong> When a (i, j) cell can be reached from
        both (i-1, j) and (i, j-1), use a visited set on (i, j) and push only on first visit.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
      <p className="mb-4">
        <strong>Forgetting the back-pointer.</strong> Without it, you advance an arbitrary
        stream after each pop, breaking the merge invariant.
      </p>
      <p className="mb-4">
        <strong>Pushing the entire matrix.</strong> Pushing every cell of an n-by-n matrix into
        the heap gives O(n² log n²) — strictly worse than sorting the flattened array. Push
        only the first column.
      </p>
      <p className="mb-4">
        <strong>Wrong comparator on tuples.</strong> Comparing on value alone fails on ties.
        Java throws if the comparator is partial; Python silently compares the next field. If
        the next field is a non-comparable object (a ListNode without __lt__), this raises an
        exception. Always include a stream-id between value and object.
      </p>
      <p className="mb-4">
        <strong>Not handling empty streams.</strong> Pushing a null head crashes immediately.
        Filter at fill time.
      </p>
      <p className="mb-4">
        <strong>Off-by-one in k-th smallest matrix.</strong> Popping k-1 times and returning
        the next pop is the same as popping k times and returning the last popped — pick one
        and stick with it.
      </p>
      <p className="mb-4">
        <strong>Floating-point in fraction problems.</strong> 786 with floating-point keys can
        produce equal values for different fractions on some inputs. Use cross-multiplication
        (a*d vs. b*c) for the comparator.
      </p>
      <p className="mb-4">
        <strong>Forgetting to update the max in 632.</strong> The smallest-range invariant
        requires tracking both the minimum (heap top) and the maximum (separate variable). If
        you only track the minimum, the answer is wrong.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases (Canonical Leetcode)</h2>
      <p className="mb-4">
        <strong>23. Merge k Sorted Lists.</strong> The textbook problem. Heap of head pointers,
        pop and advance. O(N log k).
      </p>
      <p className="mb-4">
        <strong>21. Merge Two Sorted Lists.</strong> The k = 2 base case. Two pointers, no
        heap. The interviewer often uses this as a warm-up before asking 23.
      </p>
      <p className="mb-4">
        <strong>88. Merge Sorted Array.</strong> In-place merge of two sorted arrays where one
        has trailing slack. Two pointers from the back; no heap. Tests in-place writing.
      </p>
      <p className="mb-4">
        <strong>378. Kth Smallest in a Sorted Matrix.</strong> Rows are streams. Heap k times
        or binary search on value. Discuss both.
      </p>
      <p className="mb-4">
        <strong>373. K Smallest Pairs.</strong> Pair-grid as virtual streams. Heap with
        neighbour expansion and visited set.
      </p>
      <p className="mb-4">
        <strong>632. Smallest Range Covering Elements from K Lists.</strong> Frontier heap
        plus max tracker. Tests whether you can read the heap state, not just pop.
      </p>
      <p className="mb-4">
        <strong>264. Ugly Number II.</strong> Three virtual streams (2x, 3x, 5x). Heap with
        deduplication, or three-pointer technique that avoids the heap entirely.
      </p>
      <p className="mb-4">
        <strong>313. Super Ugly Number.</strong> Generalised k primes. Heap or k-pointer.
      </p>
      <p className="mb-4">
        <strong>786. K-th Smallest Prime Fraction.</strong> Fraction matrix. Heap or
        binary-search-on-value. Cross-multiply for exact comparisons.
      </p>
      <p className="mb-4">
        <strong>668. Kth Smallest in Multiplication Table.</strong> Virtual sorted matrix.
        Binary search on value beats the heap here because the matrix is too large to fit
        frontiers economically.
      </p>
      <p className="mb-4">
        <strong>719. Find K-th Smallest Pair Distance.</strong> Pair-distance generator. Sort,
        binary search on distance, count using a sliding-window pointer. Heap solution exists
        but binary search wins.
      </p>
      <ArticleImage src="/diagrams/other/leetcode/patterns/k-way-merge-diagram-3.svg" alt="Canonical k-way merge Leetcode problems" />

      <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li><strong>Why O(N log k) and not O(N log N)?</strong> The heap holds at most k frontiers,
        so each push and pop is O(log k). Each of N elements is pushed and popped exactly once.</li>
        <li><strong>Why not pairwise merge?</strong> Pairwise is O(N k) because each element is
        copied through the merge tree at every level. The heap saves a factor of k / log k.</li>
        <li><strong>How does this scale to external sort?</strong> Each input stream becomes a
        sorted run on disk; the heap merges k of them at a time, writing the output as a
        bigger run. Multiple passes if k is too small to merge all runs in one pass.</li>
        <li><strong>Why is the heap size bounded by k?</strong> The invariant is one frontier per
        stream, and there are k streams. Once a stream is exhausted, the heap shrinks; it never
        grows.</li>
        <li><strong>How do you handle ties without breaking the comparator?</strong> Include the
        stream-id in the tuple between the value and any non-comparable object. The
        comparator becomes total.</li>
        <li><strong>How would you parallelise k-way merge?</strong> Pairwise merges in parallel —
        merge in pairs, then pairs of pairs. Each level is fully parallel. The heap-based
        single-thread version is O(N log k); the parallel version achieves O(N log k / p)
        speed-up with p workers up to log k workers.</li>
        <li><strong>When does binary search on value beat the heap?</strong> When the value range
        is small or sparsely populated, and the count function is fast. 668 is the canonical
        case; 378 is a coin-flip.</li>
        <li><strong>How do you avoid floating-point for fractions?</strong> Cross-multiply: compare
        a/b and c/d as a*d vs. b*c, exact on integers.</li>
        <li><strong>What is the role of heapify at initialisation?</strong> O(k) instead of O(k
        log k). Saves a log factor when k is large; immaterial when k is small. It is good
        habit.</li>
        <li><strong>How is k-way merge related to merge sort?</strong> Merge sort is a recursive
        two-way merge. K-way merge is its iterative, breadth-first generalisation, used when
        recursion depth would be prohibitive (external sort) or when the streams arrive
        already sorted (database query plans).</li>
      </ol>
<h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Knuth, <em>The Art of Computer Programming, Volume 3: Sorting and Searching</em>,
        section 5.4 on external sorting and k-way merge. Cormen et al., chapter 6 on heaps and
        priority queues. Sedgewick, <em>Algorithms</em>, 4th ed., section 2.4.</li>
        <li>Leetcode tag &quot;heap&quot; and Grokking the Coding Interview&apos;s &quot;K-way
        Merge&quot; pattern. NeetCode 150 covers 23, 378, 373.</li>
        <li>For systems context: the Hadoop / Spark sort phase, and the LSM-tree compaction step in
        RocksDB and Cassandra, both use k-way merge as the inner loop. Read the LevelDB merge
        iterator source for a production-grade tournament tree implementation.</li>
      </ul>
    </ArticleLayout>
  );
}
