"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "selection-sort",
  title: "Selection Sort",
  description:
    "Staff-level deep dive into selection sort — the minimum-swap comparison sort, tournament-selection extension, heapsort as the O(n log n) descendant, and why selection sort wins when writes are the dominant cost.",
  category: "other",
  subcategory: "algorithms",
  slug: "selection-sort",
  wordCount: 4400,
  readingTime: 18,
  lastUpdated: "2026-04-20",
  tags: [
    "selection-sort",
    "sorting",
    "comparison-sort",
    "in-place",
    "algorithms",
  ],
  relatedTopics: [
    "bubble-sort",
    "insertion-sort",
    "heap-sort",
    "quick-sort",
  ],
};

export default function SelectionSortArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* SECTION 1 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition &amp; Context</h2>
        <p>
          <strong>Selection sort</strong> repeatedly scans the unsorted suffix
          to locate the minimum element and swaps it to the boundary between
          the sorted prefix and the unsorted suffix. After k iterations, the
          first k positions contain the k smallest elements in sorted order.
          The algorithm runs in Θ(n²) time in all cases — best, average, and
          worst — and performs exactly n−1 swaps, which is the minimum
          possible for any comparison sort. It is the canonical example of
          an algorithm that trades comparison cost for write cost.
        </p>
        <p>
          The minimum-swap property is the one genuine reason to know
          selection sort well. Swap counts matter when writes are
          expensive: sorting arrays of large records (every swap moves a
          512-byte struct), writing to flash memory with limited write
          endurance, sorting on media with asymmetric read/write costs, or
          any context where memory bandwidth dominates latency. In those
          settings, selection sort&apos;s n−1 swaps can beat an O(n log n)
          sort that performs n log n writes. This narrow but real niche is
          why staff-level interviews sometimes probe &quot;what sort would
          you use if writes cost 100× more than reads?&quot; The answer,
          almost always, involves selection or a variant.
        </p>
        <p>
          Selection sort is <strong>comparison-based</strong>,
          <strong> in-place</strong> (O(1) extra space), and
          <strong> not stable</strong> by default — the long-distance swap
          from the selected minimum to the boundary can leapfrog equal
          elements. A stable variant exists (shift the selected minimum
          leftward rather than swap, matching insertion-sort structure) but
          it loses the minimum-swap property by reintroducing Θ(n²) shifts.
          This stability-vs-write-count tension is a microcosm of sort
          algorithm trade-off thinking.
        </p>
        <p>
          The generalization of selection sort — replace the linear
          minimum-scan with a heap — produces <strong>heapsort</strong>,
          the O(n log n) descendant that preserves the in-place property and
          the low write count in spirit. Heapsort can be understood as
          &quot;selection sort with a better data structure.&quot; A
          candidate who sees that connection during an interview has
          demonstrated the kind of structural thinking staff-level
          engineers bring to algorithm design.
        </p>
      </section>

      {/* SECTION 2 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          The select-and-swap invariant
        </h3>
        <p>
          For each <code>i</code> from 0 to <code>n−2</code>, find the index{" "}
          <code>m</code> of the minimum element in the range{" "}
          <code>a[i..n−1]</code>, then swap <code>a[i]</code> with{" "}
          <code>a[m]</code>. The loop invariant is: after iteration i, the
          prefix <code>a[0..i]</code> is sorted and contains the smallest
          i+1 elements of the original array. The invariant is
          monotonically strengthening — each iteration commits one more
          position to its final value — so termination is guaranteed after
          exactly n−1 outer iterations.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Comparison count — always quadratic
        </h3>
        <p>
          The inner scan always traverses the full remaining suffix, so the
          total comparison count is (n−1) + (n−2) + ... + 1 = n(n−1)/2
          regardless of input distribution. There is no &quot;best case&quot;
          for selection sort — pre-sorted, reverse-sorted, and random
          inputs all require the same number of comparisons. This is the
          tell-tale property that distinguishes selection sort from bubble
          sort and insertion sort, both of which are adaptive.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Swap count — always n−1
        </h3>
        <p>
          Exactly one swap per outer iteration, sometimes a no-op swap when
          the minimum is already at position i. Total: n−1 swaps. For any
          comparison sort, the minimum number of swaps to transform an
          arbitrary permutation to sorted is n minus the number of cycles
          in the permutation — in the worst case n−1 (single-cycle
          permutation), in the best case 0 (identity). Selection sort
          achieves n−1 regardless of input, which is optimal in the worst
          case but pessimal in the best case. Cycle sort beats selection
          sort on the best-case count at the cost of more comparisons.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Instability from long-distance swap
        </h3>
        <p>
          Consider <code>[2a, 2b, 1]</code>. The minimum is 1 at index 2;
          swapping with index 0 produces <code>[1, 2b, 2a]</code> — the
          relative order of the two 2&apos;s has flipped. This is the
          canonical stability counterexample for selection sort. The only
          way to preserve stability is to avoid the swap and instead shift
          elements, which converts the algorithm into something closer to
          insertion sort and loses the n−1 swap property.
        </p>

        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/selection-sort-diagram-1.svg"
          alt="Selection sort pass visualization showing scanning for minimum then swap to prefix boundary with sorted region growing"
          caption="Figure 1: Each pass scans the suffix for the minimum, then performs exactly one swap to the prefix boundary."
        />
      </section>

      {/* SECTION 3 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture &amp; Flow</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Standard min-selection
        </h3>
        <p>
          Input <code>[64, 25, 12, 22, 11]</code>. Iteration 0 scans
          indices 0..4, finds min = 11 at index 4, swaps with index 0 →{" "}
          <code>[11, 25, 12, 22, 64]</code>. Iteration 1 scans 1..4, min =
          12 at index 2, swaps → <code>[11, 12, 25, 22, 64]</code>.
          Iteration 2 scans 2..4, min = 22 at index 3, swaps →{" "}
          <code>[11, 12, 22, 25, 64]</code>. Iteration 3 scans 3..4, min =
          25 at index 3 — no-op swap. Sorted in 4 iterations, 10
          comparisons, 4 swaps (3 effective).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Bidirectional (double-ended) selection sort
        </h3>
        <p>
          A variant that selects both the min and max in the same pass and
          places them at both ends of the remaining unsorted range. The
          number of comparisons drops from n(n−1)/2 to roughly 3n²/8 — a
          25% reduction in the constant factor. This is essentially
          &quot;selection sort with two cursors,&quot; analogous to cocktail
          shaker&apos;s relationship to bubble sort. The minimum-swap
          property is preserved: exactly 2(n/2) = n swaps instead of n−1.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Heapsort — the O(n log n) descendant
        </h3>
        <p>
          The fundamental insight: if we maintain the unsorted region as a
          max-heap, we can extract the maximum in O(log n) instead of
          O(n). The outer loop still runs n times, but the inner
          &quot;find the extreme&quot; step is now logarithmic. This gives
          O(n log n) total time while preserving the in-place, O(1)-space,
          minimum-swap-spirit behavior. Heapsort&apos;s structure is
          literally &quot;selection sort + heap.&quot; Historically, J. W. J.
          Williams introduced heapsort (1964) as an improvement on
          Floyd&apos;s TREESORT (1962), framed explicitly as replacing the
          linear scan of selection sort with a priority-queue extract.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Tournament selection
        </h3>
        <p>
          A tournament tree (a specialized binary heap) finds the minimum
          in O(log n) and updates after extraction in O(log n) by
          replaying only the path from the winner&apos;s leaf to the root.
          Total: O(n log n), same asymptotic as heapsort but with different
          constants. Tournament selection is the standard approach for
          multi-way external merging and replacement-selection sort, where
          the input is streamed through RAM and the tournament determines
          which buffer to read from next.
        </p>

        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/selection-sort-diagram-2.svg"
          alt="Comparison diagram showing selection sort with linear scan versus heapsort with priority queue extract versus tournament selection with tree"
          caption="Figure 2: From linear-scan selection to heap-extract to tournament tree — the same outer loop, progressively better inner structure."
        />
      </section>

      {/* SECTION 4 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">
          Trade-offs &amp; Comparisons
        </h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Complexity summary
        </h3>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Time</strong>: Θ(n²) all cases. No best case.
          </li>
          <li>
            <strong>Comparisons</strong>: exactly n(n−1)/2 regardless of
            input.
          </li>
          <li>
            <strong>Swaps</strong>: exactly n−1 (the comparison-sort
            minimum in the worst case).
          </li>
          <li>
            <strong>Space</strong>: O(1) auxiliary, in-place.
          </li>
          <li>
            <strong>Stability</strong>: Unstable by default. A shift-based
            stable variant loses the swap-count advantage.
          </li>
          <li>
            <strong>Adaptive</strong>: No — running time is independent of
            input ordering.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Selection vs bubble sort
        </h3>
        <p>
          Both are Θ(n²) and in-place, but selection sort wins on swap
          count by a factor of Θ(n): bubble performs Θ(n²) swaps on random
          input, selection performs exactly n−1. On any workload where
          swaps cost more than comparisons (e.g., sorting 1 MB records),
          selection sort can beat bubble sort by orders of magnitude even
          though they have the same asymptotic complexity. Selection sort
          also avoids the adaptive complexity that makes bubble sort
          deceptively fast on nearly-sorted inputs but pathologically slow
          on reverse-sorted ones — selection sort&apos;s cost is
          predictable.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Selection vs insertion sort
        </h3>
        <p>
          Insertion sort dominates selection sort on nearly-sorted input
          (where insertion is O(n) best case vs selection&apos;s
          unconditional O(n²)), and insertion is stable. Selection wins on
          write-heavy workloads because it performs n−1 swaps vs
          insertion&apos;s average ~n²/4 shifts. As a concrete example: on
          n = 10,000 random 4-byte integers, insertion sort performs about
          25 million shifts while selection sort performs 9,999 swaps —
          but insertion sort is still faster in wall time because shifts
          are vectorized and swaps of small integers are cheap. Flip the
          data size to 1 KB records and selection sort wins.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Selection vs heapsort
        </h3>
        <p>
          Heapsort is strictly better in all time-based analyses — O(n log
          n) vs O(n²) — while preserving the O(1)-space property. If
          selection sort&apos;s appeal is the inner &quot;find the
          extreme&quot; being simple, heapsort&apos;s appeal is the same
          structure scaled up via a priority queue. The one place selection
          sort still wins is the small-n constant factor: for n ≤ 8,
          selection sort&apos;s branch-free inner loop can beat heapsort
          even though both compile to identical outer structure.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Write-cost asymmetry — when selection sort is the right call
        </h3>
        <p>
          Flash memory endures a bounded number of writes per cell (typically
          10,000 to 100,000 for consumer SLC and QLC parts). Sorting a file
          on flash with any write-heavy algorithm (merge sort, quicksort)
          accelerates wear-out proportionally to the number of element
          moves. Selection sort performs n−1 moves — essentially one move
          per element — which is the theoretical minimum for a
          comparison-sort. On a 1 TB dataset sorted in place on flash, the
          write-amplification difference between selection sort (Θ(n)
          writes) and mergesort (Θ(n log n) writes) is ~30× fewer writes.
          This is real, measurable, and occasionally a decisive factor in
          embedded or high-endurance-cost contexts.
        </p>
      </section>

      {/* SECTION 5 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Use selection sort when writes dominate.</strong> Large
            records, flash-endurance-limited storage, bandwidth-bound
            environments. The n−1 swap count is the lower bound for any
            comparison sort in the worst case.
          </li>
          <li>
            <strong>Prefer heapsort for the general case.</strong> If you
            need in-place, worst-case O(n log n), and low write count,
            heapsort is the direct descendant of selection sort and wins
            on every metric except the inner-loop constant at tiny n.
          </li>
          <li>
            <strong>Skip the swap when the minimum is already in
            place.</strong> The <code>if (m != i)</code> guard costs a
            branch but saves a no-op swap. On most modern CPUs the
            branch-predicted case is free.
          </li>
          <li>
            <strong>Use bidirectional selection for a free 25%
            improvement.</strong> Two-cursor (min + max per pass) cuts
            comparisons from n(n−1)/2 to ~3n²/8 with negligible code
            complexity increase.
          </li>
          <li>
            <strong>Track both min-index and max-index in one pass</strong>{" "}
            for the bidirectional variant — branch predictor handles the
            two comparisons well and memory bandwidth is amortized.
          </li>
          <li>
            <strong>Do not claim selection sort is stable.</strong> It is
            not, by default. If a stable variant is needed, use insertion
            sort instead — the shift-based stable selection loses the
            minimum-swap advantage anyway.
          </li>
        </ul>
      </section>

      {/* SECTION 6 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Assuming selection sort is stable
        </h3>
        <p>
          The default formulation is unstable because of the long-distance
          swap. This is a common misconception because the outer loop
          &quot;looks&quot; like it preserves order. A single counterexample{" "}
          <code>[2a, 2b, 1] → [1, 2b, 2a]</code> disproves stability.
          Candidates claiming selection sort is stable have not thought
          through a two-equal-keys case.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Skipping the no-op swap check
        </h3>
        <p>
          On a pre-sorted input, each iteration finds the minimum already
          in position and performs <code>swap(a[i], a[i])</code>. This is a
          no-op in the logical sense but may still incur three
          register-to-register moves in naïve implementations. The
          <code>if (m != i) swap(...)</code> guard is essentially free
          (branch predicts perfectly) and saves the redundant writes. For
          in-place selection sort on disk or flash, this guard is
          mandatory.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Forgetting selection sort&apos;s non-adaptiveness in benchmarks
        </h3>
        <p>
          Benchmarks on pre-sorted input make bubble sort and insertion
          sort look fast (both O(n)). Selection sort still runs Θ(n²) on
          sorted input. If you benchmark selection sort only on random
          data, you miss this property. If you benchmark only on sorted
          data, you conclude selection sort is pathologically slow. The
          right characterization is: selection sort is Θ(n²) always,
          independent of input.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Confusing selection sort with selection algorithm
        </h3>
        <p>
          &quot;Selection&quot; is an overloaded term. <em>Selection sort</em>{" "}
          sorts the full array. <em>The selection problem</em> is finding
          the k-th smallest element, solved in O(n) expected time by
          Quickselect or O(n) worst-case by the Median of Medians
          algorithm. They share the word &quot;select&quot; but are
          fundamentally different problems. Interviewers occasionally use
          this ambiguity as a trap.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Comparing swap counts across dissimilar workloads
        </h3>
        <p>
          Selection sort&apos;s minimum-swap advantage disappears when
          swaps are as cheap as comparisons — e.g., sorting 32-bit
          integers in a register-rich architecture. On modern x86, a swap
          of two 4-byte integers is three MOV instructions that may fuse
          into two micro-ops; a compare is one CMP. The ratio is tiny, so
          selection sort&apos;s advantage is invisible. The minimum-swap
          property only matters when swap &gt;&gt; compare.
        </p>
      </section>

      {/* SECTION 7 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Flash memory and write-limited storage
        </h3>
        <p>
          Sorting large datasets in place on flash where write endurance is
          a constraint. Selection sort performs n−1 writes — the minimum
          — compared to n log n for mergesort and Θ(n²) for bubble. On
          consumer flash with 10,000 write cycles per cell, reducing the
          write count by 10× effectively extends device lifetime by 10×.
          This is the dominant legitimate production use case.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Sorting pointers to large records
        </h3>
        <p>
          When the cost of a swap scales with record size (e.g., 4 KB
          documents or large structs), selection sort&apos;s n−1 swaps
          beat other sorts&apos; asymptotic advantage at reasonable n. A
          common workaround is pointer indirection — sort an array of
          pointers, not the records themselves — which makes swap cost
          O(1) again and any sort becomes viable. Selection sort
          legitimately wins only when pointer indirection is not an option
          (e.g., contiguous layout is a requirement for downstream SIMD).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Tournament trees in external sorting
        </h3>
        <p>
          The tournament-selection variant is the standard technique for
          k-way merge in external sorting. Database systems (PostgreSQL,
          Oracle) use a tournament tree to select the next record to emit
          when merging k sorted runs from disk. The core operation is
          &quot;select the minimum among k inputs in O(log k),&quot; which
          is exactly selection sort&apos;s inner loop with a heap. This is
          a direct descendant of selection sort.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Embedded hardware sorting networks
        </h3>
        <p>
          Selection-sort-like compare-and-select networks appear in custom
          hardware: FPGA sorting engines, network packet schedulers, and
          some ASIC priority queues. The regular structure — repeated
          &quot;find minimum, move to front&quot; — maps cleanly to pipelined
          hardware with bounded comparator arrays. Asymptotic complexity is
          less relevant at fixed, small n.
        </p>

        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/selection-sort-diagram-3.svg"
          alt="Selection sort real-world use cases showing flash memory write reduction tournament trees in external sort and hardware comparator networks"
          caption="Figure 3: The three legitimate production niches — flash endurance, tournament merge, and fixed-size hardware networks."
        />
      </section>

      {/* SECTION 8 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">
          Common Interview Questions
        </h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q1. What is selection sort&apos;s swap count, and why does it
              matter?
            </p>
            <p className="mt-2">
              Exactly n−1 swaps, regardless of input. This is the
              theoretical minimum for any comparison sort in the worst
              case. The property matters in write-limited environments —
              flash memory endurance, large records where swap cost scales
              with record size, and any system where memory bandwidth
              dominates latency. On 1 TB of data sorted in place, the gap
              between n−1 swaps (selection) and n log n swaps (heapsort or
              mergesort) is a factor of ~30 — and on flash with bounded
              write endurance, that translates directly to device lifetime.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q2. Is selection sort stable? Prove or disprove.
            </p>
            <p className="mt-2">
              Not stable. Counterexample: <code>[2a, 2b, 1]</code>. The
              minimum 1 is at index 2. Swapping with index 0 yields{" "}
              <code>[1, 2b, 2a]</code> — the two 2s have swapped relative
              order. The long-distance swap is what breaks stability; any
              sort that moves elements across intervening equal elements
              risks this. A stable variant exists (replace swap with
              shift) but it loses the n−1 swap-count advantage.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q3. Why is selection sort Θ(n²) even on pre-sorted input?
            </p>
            <p className="mt-2">
              The inner scan does not short-circuit. Even on a pre-sorted
              array, finding the minimum of the suffix requires examining
              every element in the suffix. The scan cost is
              (n−1)+(n−2)+...+1 = n(n−1)/2 regardless of input order. This
              makes selection sort non-adaptive — no &quot;best case&quot;
              exists. Contrast with insertion sort and optimized bubble
              sort, both of which are O(n) on pre-sorted input because they
              detect early termination.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q4. How is heapsort related to selection sort?
            </p>
            <p className="mt-2">
              Heapsort <em>is</em> selection sort with a priority queue as
              the backing structure for the &quot;find the extreme&quot;
              operation. Selection sort scans the unsorted suffix in O(n);
              heapsort extracts from a max-heap in O(log n). The outer
              structure is identical: n extract-max operations, each
              placing the extracted value at the next unused position.
              Heapsort achieves O(n log n) while preserving selection
              sort&apos;s in-place, O(1)-space, minimum-swap-spirit
              properties. Williams (1964) introduced heapsort explicitly
              as this improvement.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q5. Bidirectional selection sort — how does it improve
              comparisons?
            </p>
            <p className="mt-2">
              The bidirectional variant selects both min and max in a
              single pass and places them at the two ends of the remaining
              unsorted range. The number of outer iterations drops to n/2.
              Each inner pass still examines the suffix, but because the
              suffix shrinks from both ends, total comparisons drop from
              n(n−1)/2 to roughly 3n²/8 — a 25% improvement in the constant
              factor. Swaps remain Θ(n). The comparison-per-pass structure
              is identical; only the bookkeeping changes.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q6. If swap cost is 100× comparison cost, how does that
              change the algorithm choice?
            </p>
            <p className="mt-2">
              Selection sort becomes competitive with O(n log n) sorts for
              all n where n²·c_cmp + n·c_swap &lt; n log n · (c_cmp +
              c_swap). With c_swap = 100·c_cmp, the breakeven moves from
              roughly n = 10 (typical) to n ≈ 100 or more. For n up to
              ~1000 and 1 KB records, selection sort can beat quicksort in
              wall-clock time. Beyond that, heapsort wins because it
              preserves the low-write property at O(n log n). The
              cost-model-aware choice is exactly the kind of systems
              judgment staff-level interviews probe.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q7. When would you use selection sort over bubble sort?
            </p>
            <p className="mt-2">
              Almost always — selection sort dominates bubble sort on
              practical metrics. Selection performs n−1 swaps vs
              bubble&apos;s Θ(n²); both have identical comparison count;
              selection&apos;s branch structure is more predictable (no
              early termination → no mispredicted branches). The only
              reason to prefer bubble sort is pedagogy (the pass-based
              invariant is arguably more intuitive) or the parallel
              odd-even variant for GPU sorting networks. For any
              sequential use case, selection beats bubble.
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
            Knuth, D. E. <em>The Art of Computer Programming, Volume 3:
            Sorting and Searching</em>, 2nd edition, Section 5.2.3
            (selection sort) and 5.2.4 (tournament-based sorting).
          </li>
          <li>
            Williams, J. W. J. &quot;Algorithm 232: Heapsort.&quot;{" "}
            <em>Communications of the ACM</em> 7(6), 1964.
          </li>
          <li>
            Floyd, R. W. &quot;Algorithm 113: TREESORT.&quot;{" "}
            <em>Communications of the ACM</em> 5(8), 1962.
          </li>
          <li>
            Sedgewick, R. and Wayne, K. <em>Algorithms</em>, 4th edition,
            Chapter 2 — elementary sort comparison.
          </li>
          <li>
            Cormen, T. H. et al. <em>Introduction to Algorithms</em>, 4th
            edition, Chapter 6 (heapsort as selection-sort descendant).
          </li>
          <li>
            Munro, J. I. and Raman, V. &quot;Selection from read-only memory
            and sorting with minimum data movement.&quot;{" "}
            <em>Theoretical Computer Science</em> 165(2), 1996.
          </li>
          <li>
            Bender, M. A. et al. &quot;Cache-oblivious sorting with
            minimum moves&quot; — analytical framework for write-limited
            sorting.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
