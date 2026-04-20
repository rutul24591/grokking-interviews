"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "bubble-sort",
  title: "Bubble Sort",
  description:
    "Staff-level deep dive into bubble sort — adjacent-swap mechanics, early-termination optimization, cocktail-shaker variant, cache behavior, and the educational role bubble sort plays despite its O(n²) disqualification from production.",
  category: "other",
  subcategory: "algorithms",
  slug: "bubble-sort",
  wordCount: 4600,
  readingTime: 18,
  lastUpdated: "2026-04-20",
  tags: [
    "bubble-sort",
    "sorting",
    "comparison-sort",
    "stable-sort",
    "in-place",
    "algorithms",
  ],
  relatedTopics: [
    "selection-sort",
    "insertion-sort",
    "merge-sort",
    "quick-sort",
  ],
};

export default function BubbleSortArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* SECTION 1 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition &amp; Context</h2>
        <p>
          <strong>Bubble sort</strong> is the simplest adjacent-swap sorting
          algorithm: repeatedly walk the array, swapping any neighboring pair
          found out of order, until a full pass completes with no swaps. Each
          pass &quot;bubbles&quot; the largest remaining element to its final
          position at the end of the unsorted region, which is why the name
          stuck even though <em>sinking sort</em> would be equally accurate
          for the mirror-image formulation. The algorithm runs in O(n²) time
          in the average and worst case and O(n) in the best case when the
          input is already sorted and the optimized variant terminates after
          one pass.
        </p>
        <p>
          Historically, bubble sort is a cautionary tale. Donald Knuth, in{" "}
          <em>The Art of Computer Programming, Volume 3</em>, famously wrote
          that bubble sort &quot;seems to have nothing to recommend it,
          except a catchy name and the fact that it leads to some
          interesting theoretical problems.&quot; Owen Astrachan&apos;s 2003
          paper <em>Bubble Sort: An Archaeological Algorithmic Analysis</em>{" "}
          traced the persistence of bubble sort in pedagogy despite its
          practical inferiority to insertion sort at every reasonable input
          size. And yet bubble sort shows up in first-week CS courses, on
          whiteboards, and occasionally in interviews — not because you
          would ship it, but because its O(n²) worst case is the baseline
          from which every better algorithm is justified.
        </p>
        <p>
          In an interview context, asking a candidate to implement bubble
          sort is almost never about bubble sort itself. It is a probe for
          whether the candidate recognizes adjacent-swap invariants,
          understands stability, can articulate the early-termination
          optimization, and — most importantly — knows <em>when</em> to push
          back and say &quot;in production I would reach for Tim Sort or the
          language default.&quot; The failure mode is a candidate who dutifully
          writes the naïve double-loop and stops there, missing every
          opportunity to demonstrate algorithmic judgment.
        </p>
        <p>
          Bubble sort is <strong>comparison-based</strong>, <strong>in-place</strong>{" "}
          (O(1) extra space), and <strong>stable</strong> (equal elements
          retain relative order when the comparison is strict inequality).
          These three properties together explain why it survives in teaching
          materials: it makes the abstract contract of a sort — ordering,
          stability, space usage, comparison model — concrete in about ten
          lines of pseudocode.
        </p>
      </section>

      {/* SECTION 2 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          The adjacent-swap invariant
        </h3>
        <p>
          A bubble-sort pass compares positions <code>i</code> and{" "}
          <code>i+1</code> for <code>i</code> from 0 to <code>n-2</code>,
          swapping whenever <code>a[i] &gt; a[i+1]</code>. After the k-th
          complete pass, the k largest elements occupy the final k positions
          in sorted order. This is the loop invariant: the suffix of length
          k is sorted and contains the k global maxima. The algorithm
          terminates when a pass produces zero swaps, which — by the
          contrapositive of the invariant — means every adjacent pair is
          already ordered and therefore the entire array is sorted.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Stability and the strict comparison
        </h3>
        <p>
          Stability requires that the swap condition be <em>strict</em>{" "}
          greater-than, never greater-than-or-equal. If two equal elements
          ever swap, their relative order flips, and stability is lost. In
          practice this is easy to get right for numeric keys but subtle for
          composite keys where the comparator returns zero for
          &quot;equivalent&quot; records that nonetheless differ in other
          fields. The single-character bug of writing <code>&gt;=</code>{" "}
          instead of <code>&gt;</code> converts stable bubble sort into an
          unstable variant and is the archetypal stability pitfall.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Early-termination optimization
        </h3>
        <p>
          The canonical optimization tracks a <code>swapped</code> boolean
          per pass. If a full pass completes with no swaps, the array is
          sorted and the algorithm returns. This reduces the best case from
          O(n²) to O(n) — a single pass over an already-sorted array detects
          the sortedness and exits. Without the flag, naïve bubble sort runs
          n−1 passes unconditionally and is strictly worse than insertion
          sort on nearly-sorted inputs. Any interviewer worth the title
          expects this optimization without prompting.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Shrinking the inner loop
        </h3>
        <p>
          After pass k the last k elements are known to be in final position,
          so the inner loop can safely stop at <code>n − 1 − k</code>. This
          saves the redundant comparisons against the already-sorted tail
          and halves the constant factor. Combined with early termination,
          this is the standard &quot;optimized bubble sort&quot; taught in
          most textbooks.
        </p>

        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/bubble-sort-diagram-1.svg"
          alt="Bubble sort visualization showing adjacent swaps across multiple passes with largest element bubbling to the end"
          caption="Figure 1: Adjacent-swap passes — after k passes the k largest elements are in their final positions at the tail."
        />
      </section>

      {/* SECTION 3 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture &amp; Flow</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Pass-by-pass execution
        </h3>
        <p>
          Consider the array <code>[5, 1, 4, 2, 8]</code>. Pass 1 compares
          (5,1) swap → (5,4) swap → (5,2) swap → (5,8) no swap, leaving{" "}
          <code>[1, 4, 2, 5, 8]</code>. The 8 was already in place; the 5
          bubbled from index 0 to index 3. Pass 2 produces{" "}
          <code>[1, 2, 4, 5, 8]</code>. Pass 3 performs no swaps and the
          optimized algorithm terminates. Total: three passes, five
          comparisons on average, four swaps. The same input requires
          insertion sort only four shifts and terminates in a single pass
          through the data — already a visible efficiency gap on five
          elements.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Cocktail shaker (bidirectional) sort
        </h3>
        <p>
          A variant that alternates left-to-right and right-to-left passes.
          The motivation is the asymmetric cost of moving a small element
          stranded at the end: on each left-to-right pass, small elements
          move at most one position leftward (these are called{" "}
          <em>turtles</em>), while large elements at the start move all the
          way to the end in a single pass (<em>rabbits</em>). Cocktail
          shaker alternates direction so turtles move at the same rate as
          rabbits, typically halving the wall-clock time on worst-case
          inputs. The asymptotic complexity remains O(n²); only the constant
          factor improves.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Comb sort — the respectable descendant
        </h3>
        <p>
          Comb sort (Dobosiewicz, 1980) generalizes bubble sort by comparing
          elements at a gap that shrinks geometrically rather than always 1.
          The gap starts at <code>n/1.3</code> and decreases until it reaches
          1, at which point the algorithm is identical to bubble sort. Comb
          sort runs in expected O(n² / 2<sup>p</sup>) where p is the number
          of gaps, and empirically approaches O(n log n) on random inputs.
          It solves the turtle problem by letting small elements take big
          leaps early. Comb sort is rarely used in practice, but it is the
          one point in the bubble-sort family tree where the performance is
          competitive enough to warrant a footnote.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Odd-even (brick) sort — parallel descendant
        </h3>
        <p>
          Odd-even sort splits each pass into two sub-passes: first compare
          all pairs starting at even indices, then all pairs starting at odd
          indices. Within a sub-pass, every comparison is independent, so
          odd-even sort is embarrassingly parallel. On n processors it runs
          in O(n) time, making it the standard choice when you need a
          parallel sorting network for small arrays. It is one of two
          common examples (the other being bitonic sort) where a bad
          sequential algorithm becomes useful through parallelism.
        </p>

        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/bubble-sort-diagram-2.svg"
          alt="Comparison between standard bubble sort, cocktail shaker, and comb sort showing gap sequences and pass directions"
          caption="Figure 2: Bubble-sort family — cocktail shaker addresses turtle asymmetry; comb sort uses shrinking gaps to approximate O(n log n)."
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
            <strong>Time — best case</strong>: O(n) with early termination
            on a pre-sorted array.
          </li>
          <li>
            <strong>Time — average case</strong>: Θ(n²) expected{" "}
            comparisons and Θ(n²) expected swaps.
          </li>
          <li>
            <strong>Time — worst case</strong>: O(n²) on reverse-sorted
            input, exactly <code>n(n−1)/2</code> comparisons and{" "}
            <code>n(n−1)/2</code> swaps.
          </li>
          <li>
            <strong>Space</strong>: O(1) auxiliary, in-place.
          </li>
          <li>
            <strong>Stability</strong>: Stable with strict greater-than
            comparison.
          </li>
          <li>
            <strong>Adaptive</strong>: Yes with early termination — sorted
            prefix+suffix regions reduce pass count.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Bubble sort vs insertion sort
        </h3>
        <p>
          Insertion sort dominates bubble sort on essentially every
          practical metric. Both are O(n²) worst case; both are stable; both
          are O(1) space. But insertion sort performs roughly half the
          number of swaps on random inputs (each insertion is a shift, not
          a full swap), has better cache behavior (sequential memory access
          for the shift phase), and has a smaller constant factor in every
          published benchmark. The only time bubble sort has an edge is in
          specific pedagogical demonstrations where the pass structure is
          easier to visualize than insertion sort&apos;s shifting. In
          production hybrid sorts like Tim Sort or Pdqsort, insertion sort
          is the small-array base case; bubble sort is never the base case.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Bubble sort vs selection sort
        </h3>
        <p>
          Selection sort is also O(n²) but performs exactly n−1 swaps total
          — the minimum possible for a comparison sort. On workloads where
          writes are expensive (e.g., sorting pointers to large structs, or
          writing to flash memory with limited write endurance), selection
          sort beats bubble sort by orders of magnitude on swap count.
          Bubble sort performs Θ(n²) swaps on average, selection sort
          performs exactly O(n). The trade-off is that selection sort is
          not stable and not adaptive — early termination does not help
          because each outer iteration always performs one swap.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Why bubble sort is educational despite being bad
        </h3>
        <p>
          Bubble sort exposes the full vocabulary of sort analysis in its
          simplest form: pass, swap, comparison, invariant, stability,
          early termination, adaptive behavior, worst/average/best cases.
          A student who has understood why bubble sort is O(n²) has
          implicitly understood the concept of a pass-based algorithm, the
          need for monovariants, and why &quot;best case&quot; is a
          meaningful concept separate from &quot;worst case.&quot; From
          that foundation, merge sort and quick sort are approachable. If
          you skip bubble sort, you have to develop that vocabulary
          somewhere else.
        </p>
      </section>

      {/* SECTION 5 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Never ship bubble sort in production.</strong> The
            language default (Tim Sort in Python and Java, Pdqsort in Rust,
            introsort in C++) is always better. The one legitimate exception
            is embedded systems sorting tiny fixed arrays (n ≤ 8) where
            code size matters more than performance — and even there,
            insertion sort is the standard choice.
          </li>
          <li>
            <strong>Always include the early-termination flag</strong> if
            you do implement it. Without the flag, the best case is
            indistinguishable from the worst, and the algorithm loses
            adaptiveness.
          </li>
          <li>
            <strong>Shrink the inner loop bound by the pass index.</strong>{" "}
            The tail of length k after pass k is sorted; do not re-examine
            it. This is a free 2× constant improvement.
          </li>
          <li>
            <strong>Preserve stability with strict comparison.</strong> Use{" "}
            <code>&gt;</code>, not <code>&gt;=</code>. This matters when
            sorting records by one field and expecting the sort to preserve
            another field&apos;s order.
          </li>
          <li>
            <strong>For teaching, pair it with insertion sort.</strong>{" "}
            Showing both algorithms side by side makes the cost of the
            &quot;unnecessary&quot; swaps in bubble sort immediately
            visible, which justifies studying insertion sort next.
          </li>
          <li>
            <strong>For tiny parallel workloads, consider odd-even
            sort.</strong> It is the one bubble-sort variant with a
            legitimate use case in GPU or SIMD contexts where independent
            comparisons can execute in one clock.
          </li>
        </ul>
      </section>

      {/* SECTION 6 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Forgetting the early-termination flag
        </h3>
        <p>
          The most common interview mistake. Candidates implement the double
          loop, argue O(n²) average, and move on — forgetting that without
          the swap flag the algorithm is O(n²) even on sorted input. This is
          the difference between &quot;I know bubble sort&quot; and &quot;I
          understand adaptive algorithms.&quot;
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Using <code>&gt;=</code> and breaking stability
        </h3>
        <p>
          Stability is quietly destroyed by a single character. Candidates
          and junior engineers often use <code>&gt;=</code> because it
          feels more &quot;inclusive,&quot; not realizing they just unmade
          the stable-sort guarantee. When sorting by a secondary key after
          sorting by a primary key (the standard technique for
          lexicographic sort), the loss of stability silently scrambles
          results.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Claiming bubble sort is ever the best choice
        </h3>
        <p>
          It almost never is. For n ≤ 10, insertion sort is better. For
          n &gt; 50, any O(n log n) sort is better. The only context where
          bubble sort appears in modern code is as an educational reference
          implementation or as the innermost component of a comparison
          network on a GPU. If an interview candidate claims bubble sort
          &quot;makes sense&quot; for embedded or real-time systems, push
          back and ask for insertion sort&apos;s cost on the same data — it
          wins.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Off-by-one in the shrinking inner loop
        </h3>
        <p>
          The inner loop bound is <code>n − 1 − k</code>, not{" "}
          <code>n − k</code>. Writing the latter reads past the end on the
          last comparison. This is a common subtle bug that can go undetected
          with many inputs because the extra comparison is against{" "}
          <code>a[n]</code> which might happen to be sentinel-safe in some
          languages (and definitely is not in C/C++).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Ignoring swap cost on large records
        </h3>
        <p>
          Bubble sort performs Θ(n²) swaps on random inputs. If each swap
          moves a 512-byte struct, the memory bandwidth cost dominates.
          Selection sort (O(n) swaps) or pointer-indirection (swap
          references, not records) is mandatory. Failing to account for
          swap cost on large records is the &quot;why is my sort slow&quot;
          production issue that eventually leads someone to remove bubble
          sort from a legacy codebase.
        </p>
      </section>

      {/* SECTION 7 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Teaching and first exposure
        </h3>
        <p>
          The overwhelmingly dominant use case. Bubble sort is the first
          sort in Cormen, Sedgewick, and most introductory textbooks; the
          first sort in CS 101 at most universities; and the first sort in
          countless online tutorials. Its role is to introduce the concept
          of a comparison-based sort before the student is equipped to
          reason about recursion, divide-and-conquer, or logarithmic
          behavior.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Sorting networks and GPU primitives
        </h3>
        <p>
          Odd-even sort is used as a building block in bitonic sorting
          networks on GPUs when sorting fixed small batches (e.g., 32 or
          256 elements per warp). The regular structure — every pair
          compared in a predictable position on a predictable cycle — maps
          beautifully to SIMD and warp-synchronous execution. CUDA&apos;s
          Thrust library and many BVH-construction pipelines in graphics
          rely on this family of algorithms for the fixed-size innermost
          sort.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Embedded systems and ROM-constrained firmware
        </h3>
        <p>
          In extremely space-constrained environments (a few kilobytes of
          ROM for the entire firmware), the code size of the sort matters
          more than the speed. Bubble sort compiles to fewer machine
          instructions than any competitor. For fixed n ≤ 10 and data that
          needs to be sorted once per boot, the difference between 50 and
          100 comparisons is invisible; the 100 bytes of ROM saved may be
          decisive. This is the one production niche where bubble sort
          genuinely earns its keep — and even there, insertion sort is
          almost always chosen instead for equally-good size and better
          performance.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Reference sort for correctness testing
        </h3>
        <p>
          Because bubble sort is trivially correct (the invariant is
          visible by inspection), it is sometimes used as a reference
          implementation in property-based tests: fuzz-generate random
          arrays, sort with both bubble sort and the implementation under
          test, and assert equal results. The speed does not matter since
          test inputs are tiny, and the simplicity of the reference makes
          it believable as an oracle.
        </p>

        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/bubble-sort-diagram-3.svg"
          alt="Bubble sort performance curve and use-case decision flow showing pedagogy embedded systems sorting networks and testing oracles"
          caption="Figure 3: The narrow niches where bubble sort legitimately appears — teaching, fixed-size parallel networks, and reference oracles."
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
              Q1. Why does bubble sort have a best case of O(n)?
            </p>
            <p className="mt-2">
              The best case depends on the early-termination optimization. On
              a pre-sorted array, the first pass performs n−1 comparisons and
              zero swaps. The swapped flag stays false, the outer loop exits,
              and the algorithm returns in Θ(n) total work. Without the flag,
              bubble sort is Θ(n²) unconditionally — the loop structure does
              not self-detect sortedness. The n-vs-n² gap is entirely a
              consequence of the optimization.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q2. Is bubble sort stable? Can you make it unstable with a
              one-character change?
            </p>
            <p className="mt-2">
              Yes and yes. Bubble sort is stable when the swap condition is
              strictly <code>a[i] &gt; a[i+1]</code>. Changing to{" "}
              <code>&gt;=</code> causes equal elements to swap, breaking the
              relative-order guarantee. A candidate who notices this and
              explains it unprompted is demonstrating understanding of
              stability as a first-class property, not just a memorized
              attribute.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q3. When would you prefer bubble sort over insertion sort?
            </p>
            <p className="mt-2">
              Essentially never in sequential code. Insertion sort performs
              fewer swaps, has better cache behavior, and has a smaller
              constant factor on nearly every benchmark. The honest answer
              is &quot;I would not — I would reach for insertion sort for
              small arrays and Tim Sort or Pdqsort otherwise.&quot; Bubble
              sort appears legitimately only in GPU sorting networks
              (odd-even variant, parallel) or as a pedagogical reference.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q4. What is the turtle-and-rabbit problem, and how does
              cocktail shaker sort address it?
            </p>
            <p className="mt-2">
              In left-to-right bubble sort, large elements at the start
              (&quot;rabbits&quot;) travel to the end in a single pass, but
              small elements at the end (&quot;turtles&quot;) move leftward
              by at most one position per pass. This asymmetry forces Θ(n)
              passes to fully sort a worst-case input. Cocktail shaker
              alternates direction — left-to-right pass followed by
              right-to-left pass — so turtles and rabbits progress at equal
              rates. The asymptotic complexity remains O(n²) but the
              constant factor roughly halves.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q5. Derive the exact swap count for reverse-sorted input.
            </p>
            <p className="mt-2">
              On a reverse-sorted array of length n, every adjacent pair is
              out of order on every pass until it reaches the sorted
              position. The first pass performs n−1 swaps, the second n−2,
              and so on. Total swaps =
              (n−1) + (n−2) + ... + 1 = n(n−1)/2. This is the maximum
              possible swap count for any comparison sort on any input,
              making reverse-sorted the bubble-sort worst case. Comparison
              count equals swap count plus one final non-swap per pass, so
              comparisons also scale as n(n−1)/2.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q6. How does comb sort improve on bubble sort?
            </p>
            <p className="mt-2">
              Comb sort compares elements at a gap g that shrinks by a
              factor of 1.3 per pass, starting at n/1.3 and ending at 1. The
              large initial gaps eliminate turtles quickly — a small
              element near the end can jump tens of positions in a single
              comparison. Once g reaches 1, comb sort is identical to bubble
              sort but the array is already nearly-sorted, so early
              termination triggers quickly. Empirical complexity is closer
              to O(n log n) on random inputs, although the worst case
              remains O(n²). Comb sort is the one bubble-sort derivative
              whose performance is competitive with merge sort on small-to-
              medium arrays.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q7. Can bubble sort be parallelized?
            </p>
            <p className="mt-2">
              Not in its standard form — each pass has a sequential
              dependency because a swap at position i affects the comparison
              at position i+1. The odd-even variant separates each pass
              into two sub-passes: even-indexed pairs (0,1), (2,3), (4,5)
              followed by odd-indexed pairs (1,2), (3,4), (5,6). Within a
              sub-pass every comparison is independent. With n/2 processors,
              odd-even sort runs in O(n) time, and with O(log² n) processors
              it extends to bitonic sorting networks that hit O(log² n)
              depth. This is how GPU libraries sort small fixed batches.
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
            Sorting and Searching</em>, 2nd edition, Section 5.2.2.
          </li>
          <li>
            Astrachan, O. <em>Bubble Sort: An Archaeological Algorithmic
            Analysis</em>. SIGCSE 2003.
          </li>
          <li>
            Cormen, T. H., Leiserson, C. E., Rivest, R. L., and Stein, C.{" "}
            <em>Introduction to Algorithms</em>, 4th edition, Chapter 2
            (insertion sort framing and pass-based analysis baseline).
          </li>
          <li>
            Dobosiewicz, W. &quot;An efficient variation of bubble sort.&quot;
            Information Processing Letters 11 (1980): 5–6. (Comb sort.)
          </li>
          <li>
            Batcher, K. E. &quot;Sorting networks and their applications.&quot;
            AFIPS 1968 (bitonic and odd-even sorting networks).
          </li>
          <li>
            Sedgewick, R. and Wayne, K. <em>Algorithms</em>, 4th edition —
            comparative analysis of elementary sorts.
          </li>
          <li>
            NVIDIA CUB and Thrust library documentation — GPU sorting
            primitives built on odd-even and bitonic networks.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
