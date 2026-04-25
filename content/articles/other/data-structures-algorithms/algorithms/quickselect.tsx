"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "quickselect",
  title: "Quickselect",
  description:
    "Quickselect — linear-time k-th smallest via partition-and-recurse, randomized pivoting, median-of-medians worst-case, and production top-k patterns.",
  category: "other",
  subcategory: "algorithms",
  slug: "quickselect",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-20",
  tags: ["quickselect", "selection", "divide-and-conquer", "median-of-medians"],
  relatedTopics: ["divide-and-conquer", "quick-sort", "heap-sort"],
};

export default function QuickselectArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p className="mb-4">
          <span className="font-semibold">Quickselect</span> finds the k-th smallest element
          of an unsorted array in expected O(n) time. Hoare published it in 1961 alongside
          quicksort. The insight: to find a rank rather than sort everything, partition once
          around a pivot and recurse into only the side that contains the k-th element —
          discarding the other side without work.
        </p>
        <p className="mb-4">
          Quickselect is the canonical selection algorithm. It's what{" "}
          <code className="px-1">std::nth_element</code>,
          <code className="px-1">np.partition</code>, and Rust's{" "}
          <code className="px-1">select_nth_unstable</code> compile down to. When combined
          with Blum–Floyd–Pratt–Rivest–Tarjan's median-of-medians pivot (1973), it achieves
          worst-case O(n) — proving the k-th smallest can always be found in linear time
          regardless of input.
        </p>
        <p className="mb-4">
          Interview traction is high because quickselect sits at the intersection of
          partitioning, divide-and-conquer, and randomized analysis. Staff rounds often ask
          "find the k-th largest" and probe whether the candidate proposes O(n log n) sort,
          O(n log k) heap, or O(n) quickselect — and whether they can justify when each is
          right.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/quickselect-diagram-1.svg"
          alt="Quickselect partition and one-sided recursion"
          caption="Partition around pivot, then recurse only into the side containing rank k."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <p className="mb-4">
          <span className="font-semibold">Partition</span> rearranges elements around a pivot
          so that all elements less than the pivot lie to its left and all greater lie to its
          right. After partition, the pivot is in its final sorted position; its rank is
          known. Lomuto partition is simpler (single scan, one swap per element); Hoare
          partition is faster (two-pointer, fewer swaps) but trickier to implement
          correctly.
        </p>
        <p className="mb-4">
          <span className="font-semibold">One-sided recursion</span> is the key difference
          from quicksort. If the pivot's final rank equals k, return it. If k is smaller,
          recurse into the left partition. Otherwise recurse into the right with adjusted k.
          Only one recursive call, not two — so total work telescopes.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Recurrence &amp; analysis.</span> With a pivot that
          splits the input in half on average, T(n) = T(n/2) + n = 2n = Θ(n). A bad pivot
          (smallest or largest) gives T(n) = T(n−1) + n = Θ(n²). Random pivoting makes the
          worst case exponentially unlikely; expected runtime is Θ(n) with tight
          concentration around the mean.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Pivot selection strategies.</span> First/last
          element: vulnerable to sorted input. Random: good in expectation, no adversarial
          input. Median-of-three: pick the median of first, middle, last — reduces variance,
          defeats common pathological inputs. Median-of-medians: worst-case O(n), but large
          constants.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Median-of-medians (BFPRT).</span> Partition the
          array into groups of 5. Sort each, take the medians. Recursively quickselect the
          median of those medians. Use it as pivot. This guarantees the pivot is within the
          middle 60% of ranks, so each recursion discards ≥ 30% of the array, giving T(n) =
          T(n/5) + T(7n/10) + n = Θ(n).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Introselect</span> combines both worlds: start with
          randomized quickselect; if recursion depth exceeds 2·log n (signaling bad luck),
          switch to median-of-medians. This is what C++ <code>std::nth_element</code>{" "}
          actually does.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Floyd–Rivest (1975)</span> achieves expected
          n + k + o(n) comparisons — the tightest known constant — by sampling ~√n elements,
          picking lower and upper bounds from the sample, and three-way partitioning. Rarely
          implemented outside libraries because its constants are only marginally better than
          introselect's.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/quickselect-diagram-2.svg"
          alt="Median of medians BFPRT"
          caption="BFPRT groups-of-5 pivot construction and variant comparison."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p className="mb-4">
          <span className="font-semibold">Canonical in-place implementation</span> maintains
          two indices into a subarray [lo, hi] and a target rank k. Pick a pivot (random
          index in [lo, hi]), swap it to the end, walk left-to-right maintaining "less than
          pivot" segment, and finally swap the pivot into its rank position. Compare that
          rank to k and recurse into the appropriate side, adjusting lo/hi rather than
          allocating subarrays.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Three-way partition (Dutch national flag)</span>{" "}
          groups &lt;pivot, =pivot, &gt;pivot. On input with many duplicates, standard
          quickselect can degenerate because all duplicates cluster on one side; three-way
          handles this in one pass. Bentley–McIlroy's "Engineering a Sort Function" (1993)
          popularized the technique.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Iterative vs recursive</span>. Because only one
          branch recurses, quickselect trivially converts to a loop that updates lo/hi in
          place. This avoids stack-frame overhead and stack-overflow risk for 10⁸-element
          arrays.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Cache behavior</span>. In-place partition is
          sequentially cache-friendly: one forward scan touches each element once per level.
          Expected total touches ≈ 2n (one for leaf level n, half for next, etc.) — roughly 2
          passes over the array, hence quickselect often beats asymptotic analysis in
          wall-clock time.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Parallelism</span>. Quickselect has limited
          parallelism because recursion is one-sided. Parallel selection (Cole 1988, Reif
          1985) uses randomized sampling to pick pivots that split the work across
          processors.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Stability &amp; determinism</span>. Quickselect is
          not stable (equal keys can reorder); this is irrelevant for numeric top-k but
          matters if you want the "first" element of a tie. For deterministic runs across
          machines, use a fixed RNG seed or median-of-medians.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <p className="mb-4">
          <span className="font-semibold">Quickselect vs sort-then-index.</span> Sort costs
          Θ(n log n); quickselect averages Θ(n). For a single k-th query on large n, select
          wins clearly. For many queries across the same array, sort once and then answer in
          O(1).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Quickselect vs min-heap of size k.</span> Build a
          min-heap of the first k elements; for each remaining, if greater than root, replace
          and sift. Result: top-k in Θ(n log k) time and Θ(k) space. Heap wins when data is
          streaming (can't re-scan), when you must preserve original order, or when k is
          small enough that log k ≪ log n.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Quickselect vs counting approaches.</span> When
          values are small integers, counting sort / bucket-based selection runs in O(n + V).
          For IP addresses, bounded scores, or small enums, a counting approach beats
          quickselect by an order of magnitude.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Quickselect vs online quantile sketches.</span> For
          streaming approximate quantiles, t-digest (Dunning), q-digest, and HDR Histogram
          trade exactness for O(1) memory. Use these when n is too large to hold; use
          quickselect when exactness matters and n fits in RAM.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Randomized vs deterministic.</span> Random pivot
          gives Θ(n) expected with tiny variance. Median-of-medians gives Θ(n) worst-case
          but with constants 5–10× higher. Production libraries use introselect for the best
          of both.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <p className="mb-4">
          <span className="font-semibold">Randomize the pivot or shuffle the input.</span>{" "}
          Otherwise sorted input causes Θ(n²) worst-case. A single <code>std::shuffle</code>{" "}
          at the top of the algorithm suffices and moves the average case to the worst case
          with high probability.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Use three-way partitioning for duplicate-heavy
          data.</span> Logs of status codes, rounded latencies, or categorical data will
          produce many equal keys; Dutch-flag avoids pathological Θ(n²) on those inputs.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Iterate, don't recurse.</span> One-sided recursion
          → while loop. This avoids stack growth and makes the code cache-faster.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Switch to insertion sort at small sizes.</span> For
          subarrays of size ≤ 16, an insertion sort and index is faster than another
          partition.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Use introselect when worst-case matters.</span> If
          an adversary controls the input (user-supplied data, cryptographic contexts),
          fallback to median-of-medians after depth 2·log n.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Prefer library implementations.</span> C++
          <code>nth_element</code> (introselect, O(n) worst-case, battle-tested) beats
          hand-rolled quickselect in almost every real scenario.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <p className="mb-4">
          <span className="font-semibold">Off-by-one on rank.</span> k can be 0-indexed or
          1-indexed. Comparing pivot's rank to k in the wrong indexing returns the element
          adjacent to the true answer — a bug that passes most unit tests but fails at
          boundaries.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Forgetting to adjust k on right recursion.</span>{" "}
          When recursing into the right partition, you must subtract (pivotRank + 1 − lo) to
          convert the global rank into a local one. Missing this gives wildly wrong answers.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Non-random pivot on sorted input.</span> First or
          last element pivot on a sorted array → Θ(n²), easy to trigger in interviews and
          real production (replaying pre-sorted telemetry).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Duplicates cause pathological behavior.</span>{" "}
          Lomuto partition with many equal keys clusters them into one side → Θ(n²). Use
          three-way partitioning.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Claiming O(n) worst-case with random pivot.</span>{" "}
          Random pivot gives E[T]=Θ(n) — the worst case is still Θ(n²). Only
          median-of-medians guarantees O(n) worst-case.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Using quickselect on streams.</span> Quickselect
          needs random-access storage; it can't select the k-th item as elements arrive.
          Streaming top-k requires a heap or sketch.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Assuming the output array is sorted.</span>{" "}
          Quickselect places the k-th element at index k but doesn't sort the rest. If you
          need the top-k in sorted order, sort the first k slots after the call.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <p className="mb-4">
          <span className="font-semibold">Percentile / SLA monitoring.</span> Computing p50,
          p95, p99 of 10M latency samples per minute: <code>np.partition</code> runs in ~40ms
          vs sort's ~150ms. Datadog, New Relic, and internal observability services use
          quickselect variants under the hood.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Top-k queries when data fits in memory.</span>{" "}
          Leaderboards, search results ranking, and recommendation re-ranking often pipeline
          quickselect → sort-top-k. DuckDB's ORDER BY LIMIT uses quickselect for exact
          answers on data that fits; Postgres uses heap-based top-k because it doesn't
          materialize the array.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Median cut color quantization.</span> Reducing a
          24-bit image to a 256-color palette by recursively median-cutting the RGB cloud.
          Used in GIF encoders, PNG palette reduction, and Instagram's early filter pipeline.
        </p>
        <p className="mb-4">
          <span className="font-semibold">k-nearest neighbors in low-dimensional space.</span>{" "}
          Compute distances to all points, quickselect the k smallest. For small k, this
          beats O(n log n) sort; for streaming queries, kd-trees or HNSW index beats both.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Machine learning: feature importance.</span>{" "}
          Selecting the top-k most important features by gradient magnitude during model
          pruning — <code>torch.topk</code>'s GPU implementation uses a radix-select variant
          of quickselect on blocks.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Database statistics.</span> Computing histogram
          boundaries for query planners. PostgreSQL's ANALYZE samples rows and uses
          quickselect variants to pick bucket edges for column statistics.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/quickselect-diagram-3.svg"
          alt="Quickselect versus heap top-k comparison"
          caption="Quickselect vs heap-based top-k: criteria, production use, and when to pick each."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <p className="mb-4">
          <span className="font-semibold">"Find the k-th largest element."</span> Quickselect
          with comparator reversed, or quickselect for the (n−k)-th smallest. Average Θ(n),
          space O(1) iterative.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"Why is quickselect O(n) average, not O(n log
          n)?"</span> Quicksort's recurrence T(n)=2T(n/2)+n has log n levels → n log n. But
          quickselect recurses into only one side: T(n)=T(n/2)+n telescopes to 2n.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"Prove median-of-medians guarantees linear
          time."</span> Pivot beats ≥ 3 elements in ≥ ⌈n/10⌉ groups = 3n/10 elements, and is
          beaten by the same count. Largest side ≤ 7n/10. Recurrence T(n) ≤ T(n/5) + T(7n/10)
          + O(n). Sum of split ratios 1/5 + 7/10 = 9/10 &lt; 1, so total work is geometric in
          n — Θ(n).
        </p>
        <p className="mb-4">
          <span className="font-semibold">"Find the median of two sorted arrays."</span> Not
          quickselect — binary search on the smaller array in O(log min(m, n)).
        </p>
        <p className="mb-4">
          <span className="font-semibold">"Return top-k from a stream."</span> Not
          quickselect — min-heap of size k. Quickselect requires the full array.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"What if the pivot is always the smallest?"</span>{" "}
          Degenerates to T(n) = T(n−1) + n = Θ(n²). Mitigated by random pivot or
          median-of-medians.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <p className="mb-4">
          Hoare's original paper "Algorithm 65: find" (CACM 1961). Blum, Floyd, Pratt,
          Rivest, Tarjan, "Time bounds for selection" (1973) — the median-of-medians paper.
          Floyd &amp; Rivest, "Expected time bounds for selection" (1975). Bentley &amp;
          McIlroy, "Engineering a Sort Function" (Software: Practice &amp; Experience 1993)
          for three-way partitioning. CLRS chapter on Selection. C++ libstdc++'s{" "}
          <code>std::nth_element</code> and Rust's <code>slice::select_nth_unstable</code>{" "}
          for production-quality introselect implementations.
        </p>
      </section>
    </ArticleLayout>
  );
}
