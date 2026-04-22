"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "insertion-sort",
  title: "Insertion Sort",
  description:
    "Staff-level deep dive into insertion sort — shift-and-insert mechanics, adaptiveness on nearly-sorted input, binary insertion variant, the role as small-array base case in Tim Sort and Pdqsort, and cache-friendly O(nk) behavior.",
  category: "other",
  subcategory: "algorithms",
  slug: "insertion-sort",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-04-20",
  tags: [
    "insertion-sort",
    "sorting",
    "comparison-sort",
    "stable-sort",
    "adaptive",
    "algorithms",
  ],
  relatedTopics: [
    "bubble-sort",
    "selection-sort",
    "merge-sort",
    "quick-sort",
    "shell-sort",
  ],
};

export default function InsertionSortArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* SECTION 1 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition &amp; Context</h2>
        <p>
          <strong>Insertion sort</strong> builds a sorted prefix one element
          at a time. For each new element, it shifts larger elements in the
          sorted prefix rightward to open a slot, then drops the new
          element into place. The algorithm runs in O(n²) worst case, Θ(n)
          best case on already-sorted input, and Θ(n·k) on inputs with
          inversion-count k — making it the canonical <em>adaptive</em>{" "}
          sort. It is stable, in-place (O(1) space), and has excellent
          cache behavior because shifts are sequential memory writes.
        </p>
        <p>
          Insertion sort punches far above its asymptotic weight. Every
          serious production sort in use today — Tim Sort (Python, Java
          since 7), Pdqsort (Rust default since 2017, C++ libstdc++),
          introsort (MSVC STL, older C++), Java&apos;s Arrays.sort on
          primitives — switches to insertion sort below a threshold
          typically between 16 and 64 elements. The reason is that for
          small n, insertion sort&apos;s low constant factor and branch-
          predictable inner loop beats every O(n log n) algorithm despite
          the asymptotic disadvantage. On modern CPUs, insertion sort of
          16 random integers takes fewer cycles than calling a merge-sort
          function that then operates on the same data.
        </p>
        <p>
          The second reason insertion sort earns staff-level interest is
          the inversion count. The running time is exactly Θ(n + I) where
          I is the number of inversions — pairs (i, j) with i &lt; j and
          a[i] &gt; a[j]. On nearly-sorted input (I = O(n)), insertion
          sort runs in O(n). This matches or beats any O(n log n)
          algorithm on such inputs and is the theoretical reason Tim Sort
          detects and exploits existing runs in real-world data (Java
          Arrays.sort benchmarks show ~3× speedup on partially-sorted input
          specifically because of Tim Sort&apos;s insertion-driven run
          merging).
        </p>
        <p>
          Insertion sort is <strong>comparison-based</strong>,
          <strong> in-place</strong>, <strong>stable</strong>,
          <strong> adaptive</strong>, and <strong>online</strong> — it can
          sort a stream as data arrives without seeing the full input
          first. The online property is unique among elementary sorts and
          occasionally useful (e.g., maintaining a sorted leaderboard
          where scores arrive one by one and n is small).
        </p>
      </section>

      {/* SECTION 2 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          The shift-and-insert invariant
        </h3>
        <p>
          For each i from 1 to n−1: store <code>key = a[i]</code>, then
          shift all elements in the sorted prefix greater than{" "}
          <code>key</code> one position right, and write <code>key</code>{" "}
          into the opened slot. The loop invariant: after iteration i,
          <code>a[0..i]</code> is sorted and contains exactly the
          elements originally in <code>a[0..i]</code>. The invariant is
          strictly strengthening — each iteration incorporates one more
          element into the sorted region.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Shifts, not swaps
        </h3>
        <p>
          A subtle but important implementation detail: insertion sort
          performs <em>shifts</em>, not swaps. Each inversion costs one
          shift (a single read-write pair), not one swap (three
          read-writes). This is why insertion sort performs roughly half
          the memory traffic of bubble sort on equivalent inputs despite
          identical asymptotic complexity. The canonical formulation
          stores the key aside, shifts until the insertion point is found,
          then writes the key — a strictly cheaper memory pattern than
          swap-based formulations.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Adaptiveness and inversion count
        </h3>
        <p>
          The number of shifts insertion sort performs is exactly the
          number of inversions in the input. On a sorted array the inner
          loop terminates on the first comparison (the key is already
          greater than its predecessor) — zero shifts. On a reverse-sorted
          array every new element bubbles all the way to index 0 — the
          maximum n(n−1)/2 inversions. This linear relationship with
          inversion count is why insertion sort is said to be Θ(n + I);
          every Θ(n) comes from the outer scan, every Θ(I) from the
          shifts.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Binary insertion sort
        </h3>
        <p>
          A variant that locates the insertion point with binary search
          rather than linear scan. Comparisons drop from Θ(n²) to
          Θ(n log n), but shifts remain Θ(I) because the shift cost is
          independent of how the insertion point was found. The variant is
          useful when comparisons are expensive (e.g., string comparison
          or function calls through comparator pointers) but shifts are
          cheap. It does not change the asymptotic worst case — still
          O(n²) because of the shifts — but it can halve wall-clock time
          for expensive-compare workloads. Python&apos;s Tim Sort uses
          binary insertion sort on the galloping path.
        </p>

        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/insertion-sort-diagram-1.svg"
          alt="Insertion sort key-and-shift mechanism with sorted prefix growing and shift arrows showing elements moving rightward"
          caption="Figure 1: Shift-and-insert — each iteration extracts the key, shifts larger elements right, drops the key into the opened slot."
        />
      </section>

      {/* SECTION 3 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture &amp; Flow</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Sequential execution trace
        </h3>
        <p>
          Input <code>[5, 2, 4, 6, 1, 3]</code>. Iteration 1: key=2, shift
          5 right → <code>[2, 5, 4, 6, 1, 3]</code>. Iteration 2: key=4,
          shift 5 right → <code>[2, 4, 5, 6, 1, 3]</code>. Iteration 3:
          key=6, no shifts (6 &gt; 5) → unchanged. Iteration 4: key=1,
          shift 6, 5, 4, 2 right → <code>[1, 2, 4, 5, 6, 3]</code>.
          Iteration 5: key=3, shift 6, 5, 4 right →{" "}
          <code>[1, 2, 3, 4, 5, 6]</code>. Total: 5 iterations, 10 shifts
          (= inversion count), 13 comparisons.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Hybrid sorts — insertion as small-n base case
        </h3>
        <p>
          Introsort, Tim Sort, and Pdqsort all recurse or partition until
          subarrays fall below a threshold, then switch to insertion sort.
          The thresholds are empirically tuned:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Tim Sort (Python, Java)</strong>: 32 elements —
            &quot;minrun&quot; size varies by n.
          </li>
          <li>
            <strong>Pdqsort (Rust, C++ libstdc++ post-2020)</strong>: 24
            elements.
          </li>
          <li>
            <strong>GCC introsort</strong>: 16 elements.
          </li>
          <li>
            <strong>Java Arrays.sort on primitives (Dual-Pivot
            Quicksort)</strong>: 47 elements.
          </li>
        </ul>
        <p>
          These thresholds are not arbitrary — they are derived from
          microbenchmarks on target hardware where the O(n²) cost of
          insertion sort at n = threshold equals the O(n log n) cost of the
          recursive sort plus its function-call and partition overhead.
          The exact crossover depends on record size, comparator cost, and
          cache configuration.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Cache behavior and branch prediction
        </h3>
        <p>
          Insertion sort&apos;s memory access pattern is strictly sequential
          in the shift phase — touching consecutive cache lines backward
          from the insertion point. On modern x86 with a 64-byte cache
          line and prefetcher, this pattern achieves near-peak memory
          bandwidth. The inner comparison loop branches predictably (keep
          shifting until you find a smaller element), which the CPU branch
          predictor handles well after a few iterations. These two
          microarchitectural properties — sequential access and
          predictable branches — are why insertion sort wins at small n
          despite its O(n²) asymptote.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Online variant — streaming input
        </h3>
        <p>
          Insertion sort is the only elementary sort that supports
          streaming input efficiently: each new element can be inserted
          into the sorted prefix in O(n) time without restarting the sort.
          Online merge sort is possible but requires buffering. This
          property is occasionally used in small leaderboards,
          anytime-sorted caches, and sensor-stream processing where n
          stays small and data arrives over time.
        </p>

        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/insertion-sort-diagram-2.svg"
          alt="Insertion sort as base case in Tim Sort and Pdqsort showing recursive partition until threshold then switch to insertion"
          caption="Figure 2: Every production sort uses insertion sort as its small-n base case. Thresholds are tuned to target hardware."
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
            <strong>Time — best</strong>: Θ(n) on pre-sorted input.
          </li>
          <li>
            <strong>Time — average</strong>: Θ(n²).
          </li>
          <li>
            <strong>Time — worst</strong>: Θ(n²) on reverse-sorted input.
          </li>
          <li>
            <strong>Time — inversions</strong>: Θ(n + I), where I is the
            inversion count.
          </li>
          <li>
            <strong>Comparisons</strong>: n−1 best case, n(n−1)/2 worst
            case.
          </li>
          <li>
            <strong>Shifts</strong>: 0 best case, n(n−1)/2 worst case,
            equal to inversion count in general.
          </li>
          <li>
            <strong>Space</strong>: O(1) auxiliary, in-place.
          </li>
          <li>
            <strong>Stability</strong>: Stable with strict-greater-than
            shift condition.
          </li>
          <li>
            <strong>Adaptive</strong>: Yes — runtime proportional to
            inversion count.
          </li>
          <li>
            <strong>Online</strong>: Yes — can process streaming input.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Insertion sort vs bubble sort
        </h3>
        <p>
          Same asymptotic complexity; insertion sort wins on every
          practical metric. Insertion performs shifts (one read-write
          pair) instead of swaps (three), halving memory traffic.
          Insertion&apos;s inner loop terminates early at the correct
          insertion point; bubble sort always completes the full pass.
          Both are stable, adaptive with the flag, and in-place. Every
          production library uses insertion sort; none use bubble sort.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Insertion sort vs selection sort
        </h3>
        <p>
          Selection performs exactly n−1 swaps, insertion performs up to
          n(n−1)/2 shifts. On workloads where writes are expensive
          (flash, large records), selection wins. On workloads where
          writes are cheap (normal integer arrays) and inputs are
          nearly-sorted, insertion wins dramatically because of
          adaptiveness — insertion is O(n) on sorted input, selection is
          always Θ(n²). For general-purpose use, insertion dominates.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Insertion sort vs quicksort and merge sort at small n
        </h3>
        <p>
          This is the empirical finding that every production sort relies
          on: for n below ~16–64, insertion sort beats both quicksort and
          mergesort in wall time. The reasons are function-call overhead,
          partition/merge bookkeeping constants, and insertion&apos;s
          tight inner loop that the CPU pipelines without branch
          mispredictions. Asymptotic analysis is irrelevant at these
          scales; the constant factors dominate. Tim Sort, Pdqsort, and
          introsort all exploit this fact.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Why insertion sort beats Shellsort at small n
        </h3>
        <p>
          Shellsort uses gap sequences to break up long-distance
          inversions, achieving ~O(n^1.3) on practical sequences. But the
          gap-adjustment loop adds overhead. For n &lt; 100, insertion
          sort&apos;s single-gap simplicity wins. Shellsort overtakes around
          n = 200 with a well-chosen gap sequence (Ciura 2001 or
          Sedgewick&apos;s sequences). Beyond n = 1000, O(n log n)
          algorithms beat Shellsort.
        </p>
      </section>

      {/* SECTION 5 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Use insertion sort as the small-n base case in any
            recursive sort.</strong> Threshold 16–32 is standard. This is
            not an optimization — it is a correctness-preserving performance
            requirement for production-grade sort libraries.
          </li>
          <li>
            <strong>Prefer shifts over swaps in the implementation.</strong>{" "}
            Store the key, shift in place, write the key once. This halves
            memory traffic compared to the pedagogical swap-based
            formulation.
          </li>
          <li>
            <strong>Use binary insertion when comparisons are
            expensive.</strong> Record comparators that dispatch through
            function pointers, deserialize fields, or call into a comparator
            class benefit from O(n log n) comparisons even though shifts
            remain O(n²).
          </li>
          <li>
            <strong>Exploit adaptiveness on streaming data.</strong> If
            inversion count stays small (e.g., a sensor that usually
            produces sorted-within-epsilon data), insertion sort runs in
            O(n) amortized per insertion batch.
          </li>
          <li>
            <strong>Preserve stability with strict comparison.</strong> The
            shift condition should be <code>a[j] &gt; key</code>, not{" "}
            <code>a[j] &gt;= key</code>. This is the same one-character
            stability pitfall as bubble sort.
          </li>
          <li>
            <strong>Do not use insertion sort for large random
            inputs.</strong> O(n²) dominates as soon as n &gt; 100 random
            elements. Hand off to Tim Sort, Pdqsort, or the language
            default.
          </li>
        </ul>
      </section>

      {/* SECTION 6 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Confusing shifts with swaps
        </h3>
        <p>
          A common implementation mistake is using <code>swap</code>{" "}
          inside the inner loop. This works correctly but performs 3×
          the memory writes of the canonical shift-and-insert. The
          pedagogical simplicity of swap-based insertion sort masks a
          substantial performance regression. Always implement with
          key-aside-shift-and-drop.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Breaking stability with <code>&gt;=</code>
        </h3>
        <p>
          Using <code>&gt;=</code> in the shift condition allows equal
          elements to be shifted past each other, reversing their relative
          order. The single-character fix from <code>&gt;=</code> to{" "}
          <code>&gt;</code> preserves stability. This matters for
          multi-pass sorts that rely on preserving secondary-key ordering
          from a previous pass.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Using insertion sort on large random inputs
        </h3>
        <p>
          For n &gt; 100 and random input, insertion sort&apos;s O(n²)
          cost becomes visible. Candidates writing insertion sort in a
          coding round and claiming it works for any n are ignoring the
          case analysis. The defense is &quot;I would hand off to the
          language default above a small threshold.&quot;
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Ignoring the inversion count characterization
        </h3>
        <p>
          Understanding insertion sort as Θ(n + I) is the key to
          predicting performance. If the input has low inversion count
          (partially sorted, slight perturbation of sorted), insertion
          sort is effectively linear. Candidates who memorize &quot;O(n²)
          worst case&quot; but cannot articulate the inversion-count
          model miss the adaptiveness that makes insertion sort
          industrially important.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Over-applying binary insertion sort
        </h3>
        <p>
          Binary insertion saves comparisons, not shifts. If comparisons
          are cheap (primitive integers), binary insertion is slower than
          linear insertion because the binary search introduces
          mispredictable branches and non-sequential memory accesses.
          Binary insertion wins only when comparison cost dominates shift
          cost.
        </p>
      </section>

      {/* SECTION 7 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Small-n base case in production sorts
        </h3>
        <p>
          The dominant legitimate use. Every modern sort library switches
          to insertion sort below a hardware-tuned threshold. Python&apos;s
          Tim Sort, Java&apos;s Arrays.sort (both the object sort using
          Tim Sort and the primitive sort using Dual-Pivot Quicksort with
          insertion-sort base case), Rust&apos;s Pdqsort, the C++ STL
          introsort — all of them. Without insertion sort as the small-n
          case, production sorts would be 20–30% slower on real-world
          data.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Tim Sort run-merging and galloping
        </h3>
        <p>
          Tim Sort finds naturally-occurring sorted runs in the input,
          extends short runs using binary insertion sort to reach a
          minimum run length (typically 32–64), then merges adjacent
          runs. The extension step is literally insertion sort operating
          on the tail of a short run. Peter McIlroy&apos;s 1993 paper on
          natural mergesort and Tim Peters&apos; 2002 Python
          implementation both built on the insertion-sort primitive.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Nearly-sorted real-world data
        </h3>
        <p>
          Production data tends to be nearly sorted: logs arrive almost
          in timestamp order, financial trades are close to time-ordered,
          sensor readings cluster by monotonically increasing time with
          occasional out-of-order events. For inputs where inversions are
          O(n), insertion sort runs in O(n) — better than any O(n log n)
          sort. Tim Sort&apos;s entire design philosophy is &quot;most
          real-world data is nearly sorted; exploit that.&quot;
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Online and streaming algorithms
        </h3>
        <p>
          Leaderboards, sliding-window statistics, and stream-processing
          buffers where n is small and data arrives incrementally benefit
          from insertion sort&apos;s online property. The algorithm can
          maintain the sorted state without buffering the full input, and
          the per-insertion cost is O(n) which is acceptable for small
          n. Frameworks like Apache Flink and stream processors
          internally use bounded insertion-style priority maintenance for
          top-K operators at small K.
        </p>

        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/insertion-sort-diagram-3.svg"
          alt="Insertion sort performance at small n showing it outperforms merge sort and quicksort below threshold with benchmark comparison"
          caption="Figure 3: Below ~32 elements, insertion sort beats every O(n log n) sort. This is why it is the universal base case."
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
              Q1. Why is insertion sort used as the small-n base case in
              production sorts?
            </p>
            <p className="mt-2">
              At small n (below ~16–64, hardware-dependent),
              insertion sort&apos;s low constant factor and predictable
              inner loop beat any O(n log n) algorithm. The O(n log n)
              sort&apos;s function-call overhead, partition/merge
              bookkeeping, and recursion infrastructure dominate at small
              sizes. Insertion sort&apos;s tight shift-loop with
              sequential memory access maps perfectly to modern CPU
              pipelines. Every production library (Tim Sort, Pdqsort,
              introsort, Arrays.sort) switches to insertion sort below its
              threshold.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q2. Explain insertion sort&apos;s runtime as Θ(n + I).
            </p>
            <p className="mt-2">
              The Θ(n) term accounts for the outer scan that visits each
              of n elements once. The Θ(I) term accounts for the shifts
              — exactly one shift per inversion in the input. Since
              every misordered pair contributes one shift, and every
              shift resolves one misordered pair, shift count equals
              inversion count exactly. On pre-sorted input, I = 0 and
              the algorithm is Θ(n). On reverse-sorted input, I =
              n(n−1)/2 and the algorithm is Θ(n²). This characterization
              is the mathematical reason insertion sort is adaptive.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q3. How does binary insertion sort change the complexity?
            </p>
            <p className="mt-2">
              Binary insertion uses binary search to locate the insertion
              point, dropping comparisons from Θ(n²) worst case to
              Θ(n log n). But shifts remain Θ(I) because you still have
              to move elements to make room. Asymptotic total time stays
              O(n²) because shifts dominate on adversarial input. The
              wall-clock win comes when comparisons are expensive
              (records, comparator function pointers) — binary insertion
              can halve wall time on such workloads. Python&apos;s Tim
              Sort uses binary insertion on its galloping path.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q4. Is insertion sort stable, in-place, and online?
            </p>
            <p className="mt-2">
              Yes to all three. Stable with strict-greater-than shift
              condition (equals stay in original order). In-place with
              O(1) auxiliary space (one register for the key plus the
              index). Online because each new element can be inserted as
              it arrives — no need to see the full input first. The
              combination of these three properties is rare among sort
              algorithms; merge sort is stable but not in-place,
              heapsort is in-place but not stable, quicksort is neither.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q5. What is the crossover threshold where insertion sort
              beats quicksort?
            </p>
            <p className="mt-2">
              Hardware-dependent but typically between 16 and 64
              elements. The precise threshold is tuned by microbenchmarks
              on the target CPU/cache configuration and depends on record
              size and comparator cost. GCC uses 16, Rust Pdqsort 24,
              Java Dual-Pivot Quicksort 47, and Tim Sort&apos;s minrun
              averages 32. The theoretical model: insertion sort&apos;s
              constant factor c_ins is ~5× smaller than quicksort&apos;s
              c_qs, and the crossover is where c_ins · n² = c_qs · n log n,
              giving n ≈ 2^(c_qs/c_ins) ≈ 32 on typical hardware.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q6. How would you modify insertion sort to use shifts
              instead of swaps?
            </p>
            <p className="mt-2">
              Replace the inner swap loop with: store the key, shift all
              larger elements one position right, then drop the key into
              the final open slot. Pseudocode pattern: save key = a[i];
              j = i; while (j &gt; 0 and a[j−1] &gt; key) a[j] = a[j−1],
              j = j−1; then a[j] = key. This performs one read and one
              write per shift, not three. On any modern CPU, the shift
              formulation is 2× faster than the swap formulation at
              equal inversion count.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q7. Can insertion sort run on a linked list? What changes?
            </p>
            <p className="mt-2">
              Yes. On a linked list, shifting is replaced by pointer
              rewiring. For each element being inserted, walk the sorted
              prefix from the head to find the insertion point, then
              splice the node in via a pointer update. Asymptotic
              complexity remains O(n²) in the worst case — the walk to
              find the insertion point is O(n) — but the actual insertion
              is O(1) instead of Θ(I). The linked-list variant loses the
              cache-locality advantage that makes array-based insertion
              sort fast, so it is mostly a theoretical exercise.
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
            Sorting and Searching</em>, 2nd edition, Section 5.2.1.
          </li>
          <li>
            Cormen, T. H. et al. <em>Introduction to Algorithms</em>, 4th
            edition, Chapter 2 (insertion sort as the introductory
            example).
          </li>
          <li>
            Peters, T. &quot;Timsort — listsort.txt.&quot; CPython source
            code, 2002.
          </li>
          <li>
            McIlroy, P. &quot;Optimistic sorting and information
            theoretic complexity.&quot; SODA 1993. (Natural mergesort
            foundations.)
          </li>
          <li>
            Bentley, J. L. and McIlroy, M. D. &quot;Engineering a sort
            function.&quot; <em>Software: Practice and Experience</em>
            23(11), 1993.
          </li>
          <li>
            Orson Peters. &quot;Pattern-defeating quicksort.&quot; 2017
            (Pdqsort paper, includes insertion-sort base case rationale).
          </li>
          <li>
            Ciura, M. &quot;Best Increments for the Average Case of
            Shellsort.&quot; FCT 2001 — gap-sequence analysis relevant
            to insertion sort&apos;s extended variant.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
