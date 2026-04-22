"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "quick-sort",
  title: "Quick Sort",
  description:
    "Quick Sort — partition-based in-place sorting with expected O(n log n), the workhorse behind introsort, Pdqsort, and most production sort() implementations.",
  category: "other",
  subcategory: "algorithms",
  slug: "quick-sort",
  wordCount: 5100,
  readingTime: 26,
  lastUpdated: "2026-04-20",
  tags: [
    "quick-sort",
    "sorting",
    "partition",
    "introsort",
    "pdqsort",
    "divide-and-conquer",
  ],
  relatedTopics: [
    "merge-sort",
    "heap-sort",
    "insertion-sort",
    "quickselect",
  ],
};

export default function QuickSortArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p className="mb-4">
          Quick Sort is a divide-and-conquer comparison sort that partitions an array around a chosen
          pivot so that every element less than the pivot lands on its left and every element greater
          lands on its right, then recurses into the two subarrays. C. A. R. Hoare invented it in 1959
          while working on Russian-to-English translation at Moscow State University and published it
          in 1961. Unlike merge sort, the partitioning happens <em>in place</em>, and unlike selection
          or insertion sort, each comparison contributes to placing many elements in the correct
          region simultaneously.
        </p>
        <p className="mb-4">
          The expected running time on random input is Θ(n log n) with small hidden constants — roughly
          2–3× faster than merge sort in practice because of cache friendliness, no auxiliary array,
          and tight inner loops. The worst case, however, is Θ(n²) when a poor pivot choice (e.g.,
          always picking the minimum or maximum) produces one subarray of size n−1 and one of size 0
          at every level. This worst case is not merely theoretical: naive &quot;pick the first element&quot;
          pivoting on already-sorted input degrades to quadratic, which is why production sorts go to
          considerable lengths to avoid it.
        </p>
        <p className="mb-4">
          Quick Sort sits at the core of modern hybrid sorts. Introsort (C++ <code>std::sort</code>)
          runs quicksort until recursion depth exceeds 2⌊log₂ n⌋, then falls back to heapsort to
          guarantee n log n worst case. Pdqsort (Rust <code>slice::sort_unstable</code>, Go&apos;s sort
          since 1.19) extends introsort with pattern-defeating pivot selection and branchless
          partitioning. Java&apos;s <code>Arrays.sort()</code> for primitives uses dual-pivot quicksort.
          Every time a production system asks for an unstable sort, it is almost certainly running
          quicksort underneath.
        </p>
        <p className="mb-4">
          Beyond sorting, the partition subroutine is a first-class algorithmic primitive. Quickselect
          uses one partition per level to find the k-th smallest element in expected O(n). Dutch
          National Flag partitioning (three-way) is the foundation of efficient handling of duplicate
          keys and forms the basis of 3-way radix quicksort for strings. The partition operation also
          appears in nth_element, median-of-medians, and k-means initialization via quickselect.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/quick-sort-diagram-1.svg"
          alt="Quick sort partition around a pivot with recursive descent into left and right subarrays"
          caption="Partition around pivot: less-than region, pivot, greater-than region, then recurse."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <h3 className="text-xl font-semibold mt-6 mb-3">Partitioning schemes</h3>
        <p className="mb-4">
          Two classical schemes dominate. <strong>Lomuto partition</strong> maintains a single index i
          tracking the boundary of the &quot;less than pivot&quot; region; it scans from left to right with
          pointer j, swapping arr[i] and arr[j] whenever arr[j] &lt; pivot, then swapping the pivot
          into position i at the end. It is simple to code but performs more swaps than necessary and
          degrades to O(n²) on arrays with many duplicates.
        </p>
        <p className="mb-4">
          <strong>Hoare partition</strong> uses two pointers converging from opposite ends. The left
          pointer advances while arr[left] &lt; pivot, the right pointer retreats while arr[right] &gt;
          pivot, and when both stop, the elements are swapped. It performs about 3× fewer swaps than
          Lomuto on average and handles duplicates more gracefully, but its correctness proof is
          subtler — the pivot is not placed at its final position by partition; only the invariant
          &quot;everything ≤ pivot is left of the split, everything ≥ pivot is right&quot; holds.
        </p>
        <p className="mb-4">
          <strong>Three-way (Dutch National Flag) partition</strong> splits the array into three
          regions: less than pivot, equal to pivot, and greater than pivot. Elements equal to the
          pivot are excluded from further recursion. This is a massive win on arrays with many
          duplicates — if every element equals the pivot, one partition sorts the whole array in O(n).
          Sedgewick&apos;s analysis shows three-way is optimal on inputs with few distinct keys (entropy-
          optimal sorting).
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Pivot selection</h3>
        <p className="mb-4">
          The pivot choice dictates whether quicksort is fast or catastrophic. Naive choices (first,
          last, middle element) are O(n²) on easily-constructed inputs. Median-of-three — the median
          of arr[low], arr[mid], arr[high] — is the classical production choice; it guarantees neither
          child is smaller than 1/4 the size on average and defeats sorted/reverse-sorted/organ-pipe
          inputs. Median-of-five, ninther (median of three medians of three), and random pivoting are
          variants. The median-of-medians algorithm provides a Θ(n) true-median pivot that guarantees
          Θ(n log n) worst case but with large constants, so it is not used in practice for sort.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Recursion vs. iteration &amp; tail-call optimization</h3>
        <p className="mb-4">
          Naive recursive quicksort can blow the stack on adversarial input. The standard fix is to
          recurse only into the smaller partition and iterate on the larger via a loop, bounding stack
          depth to O(log n) even in the worst case. This tail-call trick is in every production
          implementation.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Small-array cutoff</h3>
        <p className="mb-4">
          Below some threshold (typically 12–32 elements), quicksort recursion overhead exceeds
          insertion sort&apos;s cost. Production sorts switch to insertion sort for small ranges — either
          as the recursion base case or as a single pass at the end once the array is &quot;almost sorted&quot;
          (since insertion sort is Θ(n+I) in inversions, and a partially quicksorted array has O(n)
          inversions).
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/quick-sort-diagram-2.svg"
          alt="Comparison of Lomuto, Hoare, and three-way Dutch National Flag partition schemes"
          caption="Lomuto, Hoare, and three-way partitioning compared — pointer movement, swaps, duplicate handling."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p className="mb-4">
          A production-grade quicksort is a state machine. Entry picks a pivot via median-of-three or
          ninther, runs a three-way partition, and dispatches. Each recursive call first checks
          whether the range size is below the insertion-sort threshold; if so, it defers to a single
          insertion sort pass covering the whole array at the end. Recursion depth is tracked: if it
          exceeds 2⌊log₂ n⌋, the call switches to heapsort — this is the introsort pattern.
        </p>
        <p className="mb-4">
          Pdqsort adds pattern detection. Before partitioning, it compares elements to check if the
          range is already sorted or reverse-sorted; if so, it returns immediately or reverses once.
          After partition, if the partition is badly unbalanced (smaller side &lt; 1/8 of the range), it
          applies a block-based shuffle of the pivot candidate region to defeat adversarial inputs.
          This gives best-case O(n) on sorted input and worst-case O(n log n) without introsort&apos;s
          heapsort fallback being triggered in most cases.
        </p>
        <p className="mb-4">
          Dual-pivot quicksort (Yaroslavskiy 2009, Java&apos;s default) picks two pivots p1 ≤ p2 and
          partitions into three regions: less than p1, between p1 and p2, greater than p2. The middle
          region is typically ~1/3 of the array, giving a slightly shallower recursion tree and ~5%
          fewer comparisons. Java benchmarks it against classical quicksort and finds ~20% speedup on
          primitive arrays due to reduced cache misses.
        </p>
        <p className="mb-4">
          Parallel quicksort partitions the top-level array, then recurses into the two subarrays on
          separate threads. With task-based work stealing (Intel TBB, Java fork-join, Rust rayon),
          this achieves near-linear speedup on random input because subarray sizes are approximately
          equal. However, the first partition itself is sequential and O(n), so speedup is bounded by
          Amdahl&apos;s law. Block-parallel partition schemes (Tsigas-Zhang) parallelize the partition
          step too but are rarely used outside HPC.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <h3 className="text-xl font-semibold mt-6 mb-3">vs. Merge Sort</h3>
        <p className="mb-4">
          Quicksort is typically 2–3× faster than merge sort on random in-memory arrays due to cache
          friendliness and in-place operation, but it is unstable and has O(n²) worst case. Merge
          sort is stable, predictable, and natural for external sorting (linked lists, disk-resident
          data). For sorting objects by key with stability required (most business data), Tim Sort /
          merge wins. For sorting primitives where order of equal keys is irrelevant, quicksort wins.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">vs. Heap Sort</h3>
        <p className="mb-4">
          Heap sort has guaranteed O(n log n) worst case and O(1) extra space but is ~2–3× slower than
          quicksort on average because heap access patterns are cache-unfriendly (parent-child jumps
          of 2×). Introsort uses heapsort only as a safety net when recursion depth blows up.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Space</h3>
        <p className="mb-4">
          In-place partition uses O(1) extra space per level, but recursion stack is O(log n) average,
          O(n) worst case. Smaller-partition-first recursion bounds stack to O(log n) guaranteed.
          Merge sort needs Θ(n) auxiliary buffer.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Stability</h3>
        <p className="mb-4">
          Quicksort is <strong>unstable</strong> — partition swaps move elements across equal-key
          boundaries. Making it stable requires auxiliary space, eliminating its main advantage. If
          stability matters, use merge sort or Tim Sort; the standard advice &quot;use std::stable_sort in
          C++ when you need stability&quot; reflects this.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Never use first/last/middle element as pivot</strong> — always median-of-three minimum, ninther for large ranges.</li>
          <li><strong>Always three-way partition</strong> if duplicates are possible — entropy-optimal on low-cardinality inputs.</li>
          <li><strong>Cap recursion depth at 2⌊log₂ n⌋ and fall back to heapsort</strong> (introsort pattern) to guarantee worst-case O(n log n).</li>
          <li><strong>Recurse into smaller partition, iterate on larger</strong> to bound stack to O(log n).</li>
          <li><strong>Switch to insertion sort below 16–32 elements</strong> — either per-range or as a final pass over the &quot;roughly sorted&quot; array.</li>
          <li><strong>Randomize pivot or randomize input up front</strong> if you cannot trust input distribution; eliminates adversarial O(n²).</li>
          <li><strong>Use branchless partition inner loops</strong> (CMOV, predication) on modern CPUs — Pdqsort technique, 2× throughput.</li>
          <li><strong>Prefer std::sort / sort_unstable / Arrays.sort</strong> over hand-rolled quicksort unless you have measured reason otherwise.</li>
          <li><strong>For parallel sort, fork only above a minimum granularity</strong> (e.g., 10k elements) to amortize task-creation overhead.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Stack overflow on sorted input with naive pivot</strong>: first-element pivot + already-sorted input = n levels of recursion. Defense: median-of-three + smaller-side recursion.</li>
          <li><strong>O(n²) on duplicates</strong>: two-way partition with many equal keys puts all duplicates on one side. Defense: three-way partition.</li>
          <li><strong>Off-by-one in Hoare partition</strong>: classic bug — recursing into [lo, p] vs [lo, p−1] depends on whether pivot is placed. Lomuto returns pivot position; Hoare does not.</li>
          <li><strong>Assuming stability</strong>: code depending on relative order of equal keys breaks silently when someone calls Arrays.sort on a primitive array.</li>
          <li><strong>Adversarial inputs in security-sensitive code</strong>: attacker-controlled data + predictable pivot = DoS. Randomize pivot selection for any public-facing sort.</li>
          <li><strong>Not using small-array cutoff</strong>: recursion overhead for 3-element ranges is 5–10× insertion sort cost.</li>
          <li><strong>Parallelizing too aggressively</strong>: forking for 100-element ranges spends more on task overhead than the sort itself.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <p className="mb-4">
          <strong>C++ std::sort</strong> is introsort — quicksort with median-of-three pivot, 16-element
          insertion-sort cutoff, and heapsort fallback when depth &gt; 2⌊log₂ n⌋. libstdc++ and libc++
          both implement it; MSVC uses a variant.
        </p>
        <p className="mb-4">
          <strong>Rust slice::sort_unstable and Go sort (since 1.19)</strong> use Pdqsort — introsort
          plus pattern-defeating pivot selection. Sorting [1..n] takes O(n) because the sorted-pattern
          detection returns immediately. Go dropped its previous heapsort/insertion-sort hybrid in
          1.19 for Pdqsort and saw 10–60% speedups on common workloads.
        </p>
        <p className="mb-4">
          <strong>Java Arrays.sort() for primitives</strong> uses Yaroslavskiy dual-pivot quicksort
          with insertion-sort cutoff at 47 elements and a special case for runs. For object arrays,
          Java uses Tim Sort to preserve stability and comparator semantics.
        </p>
        <p className="mb-4">
          <strong>PostgreSQL query executor</strong> uses quicksort for in-memory sort nodes up to
          work_mem; above that, external merge sort takes over. Same pattern in Oracle, SQL Server,
          MySQL — quicksort in RAM, merge on disk.
        </p>
        <p className="mb-4">
          <strong>Linux kernel sort() (lib/sort.c)</strong> is actually heapsort, not quicksort, because
          predictable memory use matters more than raw speed in kernel context. A telling reminder
          that quicksort&apos;s variance is sometimes unacceptable.
        </p>
        <p className="mb-4">
          <strong>Apache Spark</strong> uses Tim Sort for stable sort and a radix-sort-tuned external
          quicksort for unsafe row sorts. <strong>NumPy</strong> np.sort() defaults to introsort.
          <strong> V8 (JavaScript)</strong> switched Array.prototype.sort from quicksort to Tim Sort
          in 2018 to gain stability.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/quick-sort-diagram-3.svg"
          alt="Pdqsort decision flow with pattern detection, pivot selection, and introsort fallback"
          caption="Pdqsort: pattern detection, median-of-three pivot, three-way partition, bad-partition shuffle, depth-triggered heapsort fallback."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li><strong>Implement Lomuto and Hoare partition; which is faster and why?</strong> Hoare: ~3× fewer swaps, handles duplicates better, but pivot is not placed at final index.</li>
          <li><strong>Why can quicksort hit O(n²), and how does production code prevent it?</strong> Poor pivot on already-sorted input. Defenses: median-of-three, randomization, introsort depth limit.</li>
          <li><strong>What is the Dutch National Flag problem?</strong> Three-way partition — Dijkstra&apos;s formulation, optimal for sorting with k distinct keys.</li>
          <li><strong>Quicksort vs. merge sort: when to use which?</strong> Quicksort for in-memory primitives where stability is irrelevant; merge sort for stability, predictable worst case, or external data.</li>
          <li><strong>Is quicksort stable? Why not?</strong> No — partition swaps move elements across equal-key boundaries. Making it stable requires O(n) auxiliary space.</li>
          <li><strong>Explain introsort.</strong> Quicksort + depth limit + heapsort fallback + insertion-sort small-range cutoff. Guarantees O(n log n) worst case.</li>
          <li><strong>Implement quickselect for k-th smallest.</strong> Partition, recurse into the side containing index k. Expected O(n).</li>
          <li><strong>Dual-pivot quicksort: how does it differ and why is it Java&apos;s default?</strong> Two pivots, three regions, shallower recursion, ~5% fewer comparisons, better cache behavior on primitives.</li>
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>C. A. R. Hoare, &quot;Quicksort&quot;, Computer Journal 1962 — original paper.</li>
          <li>Sedgewick, <em>Quicksort</em> (PhD thesis, 1975) — median-of-three, three-way, small-cutoff analyses.</li>
          <li>Musser, &quot;Introspective Sorting and Selection Algorithms&quot; (1997) — introsort.</li>
          <li>Yaroslavskiy, &quot;Dual-Pivot Quicksort&quot; (2009) — Java&apos;s algorithm.</li>
          <li>Orson Peters, <em>Pdqsort</em> (2021) — pattern-defeating quicksort, Rust/Go default.</li>
          <li>Bentley &amp; McIlroy, &quot;Engineering a Sort Function&quot; (1993) — 7th-edition Unix qsort design.</li>
          <li>CLRS Chapter 7 &amp; Sedgewick &amp; Wayne <em>Algorithms</em> Chapter 2.3.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
