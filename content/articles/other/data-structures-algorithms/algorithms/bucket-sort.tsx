"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "bucket-sort",
  title: "Bucket Sort",
  description:
    "Bucket Sort — distribute into k buckets, sort each, concatenate. Linear expected time on uniformly distributed data; the sort behind histogram equalization and range partitioning.",
  category: "other",
  subcategory: "algorithms",
  slug: "bucket-sort",
  wordCount: 4700,
  readingTime: 24,
  lastUpdated: "2026-04-20",
  tags: [
    "bucket-sort",
    "sorting",
    "distribution-sort",
    "non-comparative",
    "range-partition",
  ],
  relatedTopics: [
    "counting-sort",
    "radix-sort",
    "insertion-sort",
    "quick-sort",
  ],
};

export default function BucketSortArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p className="mb-4">
          Bucket Sort distributes n elements into k buckets based on some mapping from key to bucket
          index, sorts each bucket individually (usually with insertion sort), and concatenates the
          buckets to produce the sorted output. On uniformly distributed inputs it achieves expected
          Θ(n) time with Θ(n + k) space. It generalizes counting sort: where counting sort puts
          each distinct key in its own bucket, bucket sort puts a <em>range</em> of keys in each
          bucket, letting it handle real-valued keys, strings, and arbitrary totally-ordered types
          that can be mapped to integer indices.
        </p>
        <p className="mb-4">
          The expected linear-time result depends critically on the distribution of inputs. For n
          values drawn uniformly from [0, 1) and placed into n buckets of width 1/n, each bucket
          contains O(1) elements in expectation, and the sum of per-bucket insertion-sort costs is
          O(n). For skewed distributions — say, all values clustered in the bottom 1% — one bucket
          receives all n elements and bucket sort degrades to Θ(n²). This &quot;uniform or
          normalized&quot; assumption is what distinguishes bucket sort from radix or counting; it
          works best when you know something about the input distribution.
        </p>
        <p className="mb-4">
          In production, bucket sort appears in niche but important roles. Range-partitioning for
          distributed sort (Hadoop TeraSort, Spark repartition) is bucket sort at scale: each shard
          is a bucket, local sort handles the within-bucket step. External sort with multiple
          input runs uses bucket-like pre-partitioning to balance merge passes. GPU rank-based
          sorts, histogram-based image quantization, and k-way split in top-k heavy-hitters
          algorithms all lean on the same distribute-then-sort-each pattern.
        </p>
        <p className="mb-4">
          Bucket sort also gives a clean mental model for understanding more complex sorts. Radix
          sort is bucket sort with fixed digit buckets. Counting sort is bucket sort with
          per-value buckets. Sample sort (a parallel-sorting algorithm) is bucket sort with
          adaptively chosen bucket boundaries determined by a random sample of the input. When
          anyone on an interview asks &quot;how would you sort with a non-comparison approach?&quot;,
          bucket sort is the right first answer, and radix/counting are its specialized forms.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/bucket-sort-diagram-1.svg"
          alt="Bucket sort distribute-sort-concatenate three phases on uniformly distributed floats"
          caption="Three phases: distribute into k buckets, sort each bucket, concatenate in order."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <h3 className="text-xl font-semibold mt-6 mb-3">The bucket function</h3>
        <p className="mb-4">
          The mapping f: key → bucket_index determines correctness and performance. For values in
          [min, max] with k buckets, the standard mapping is ⌊(key − min) · k / (max − min + ε)⌋.
          For hash-map-style keys, f can be a hash function, but then buckets no longer hold ranges
          and final concatenation requires sorting bucket indices too (giving radix sort back). The
          invariant that matters: <em>every key in bucket i is ≤ every key in bucket i+1</em>. Any
          mapping preserving this lets concatenation produce a sorted output.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Choice of inner sort</h3>
        <p className="mb-4">
          Insertion sort is the textbook inner sort because its Θ(n+I) cost is minimal on the
          small, near-uniform buckets bucket sort produces. When buckets can grow larger (skewed
          inputs), quicksort or merge sort on buckets is safer. In radix sort&apos;s MSD variant, the
          recursive call is the &quot;inner sort&quot;. The choice depends on expected bucket size: ≤ 16
          elements → insertion; 16–128 → introsort; &gt; 128 → recurse with bucket sort again.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Expected-case analysis</h3>
        <p className="mb-4">
          Let X_i be the number of elements in bucket i. Insertion sort on bucket i is
          O(X_i · (X_i + 1)/2). By linearity of expectation and the uniform-distribution assumption
          with k = Θ(n), E[X_i²] = O(1), so the total expected work is Σ E[O(X_i²)] = O(n). The
          concentration of this expectation (how likely large deviations are) depends on bucket
          count; Chernoff bounds show P(max X_i &gt; c log n) → 0 for k = Θ(n) and c large enough.
          In practice, linear expected time is achieved within factor 2 across n = 10⁴–10⁹.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Non-uniform inputs: equal-frequency bucketing</h3>
        <p className="mb-4">
          If the distribution is known but not uniform, choose bucket boundaries so each bucket
          receives ≈ n/k elements. Quantile-based partitioning — pick boundaries at empirical
          quantiles from a random sample of √n elements — gives balanced buckets even for
          non-uniform distributions. This is exactly what parallel sample sort does, and what
          Spark&apos;s RangePartitioner does for repartition-by-range.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/bucket-sort-diagram-2.svg"
          alt="Uniform vs skewed input distribution showing bucket load imbalance"
          caption="Uniform input → balanced buckets → O(n). Skewed input → one heavy bucket → O(n²). Fix: quantile-based boundaries."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p className="mb-4">
          A production bucket sort has three architectural decisions: bucket count k, bucket
          boundaries, and inner sort choice. The standard formula is k = Θ(n) with uniform
          boundaries for uniform inputs; k = n/log n with quantile boundaries for unknown
          distributions; k = (number of worker threads) for parallel sorts. Each bucket is
          typically a dynamic array; memory for all buckets combined is Θ(n) amortized.
        </p>
        <p className="mb-4">
          The distribute phase is sequential but trivially parallelizable: each thread distributes
          its chunk of input into thread-local buckets, then buckets are merged. The merge step is
          the synchronization point — naive merging concatenates thread-local buckets with matching
          indices. Good implementations use a two-level scheme: per-thread local buckets at the
          first level, global buckets at the second, merged via parallel scan to compute offsets.
          This is the core of Intel TBB&apos;s parallel_sort bucket phase and GPU sample sort.
        </p>
        <p className="mb-4">
          Sample sort is the canonical parallel variant. It picks p·s random samples (where p =
          thread count, s = oversampling factor, typically 16–64), sorts the sample, picks every
          s-th element as bucket boundary. This partitions the input into p buckets of nearly-equal
          size. Each thread sorts one bucket with a serial sort, and the result is concatenated.
          MPI-based TPCH sorts and GPU sample sort achieve near-linear speedup via this pattern.
        </p>
        <p className="mb-4">
          External memory bucket sort is used when data exceeds RAM. First pass: stream input,
          distribute into k buckets written to disk (k chosen so each bucket fits in memory).
          Second pass: load each bucket, sort in memory, write sorted. Third (optional) pass:
          concatenate. Because distribution is sequential write (not random) and each bucket read
          is sequential, this is I/O-optimal Θ(n/B) given block size B. Hadoop&apos;s TeraSort,
          BigData&apos;s external sort, and PostgreSQL&apos;s tapesort all use this structure.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <h3 className="text-xl font-semibold mt-6 mb-3">vs. Counting Sort</h3>
        <p className="mb-4">
          Counting sort is bucket sort with one bucket per distinct key. Counting sort requires
          integer keys with small range. Bucket sort works on any totally-ordered type with a
          suitable mapping — real numbers, strings, complex records. Counting is faster for integer
          inputs with bounded range; bucket handles broader types.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">vs. Radix Sort</h3>
        <p className="mb-4">
          Radix is MSD bucket sort with fixed digit buckets plus recursion. Bucket sort with one
          pass is comparable to radix with one level, but radix naturally handles fixed-width keys
          and has predictable performance. Bucket sort is more flexible but more sensitive to
          distribution.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">vs. Quicksort / Introsort</h3>
        <p className="mb-4">
          Quicksort is O(n log n) expected, O(n²) worst case. Bucket sort is O(n) expected on
          uniform inputs, O(n²) worst case. Quicksort&apos;s worst case is adversarial pivot;
          bucket&apos;s is adversarial input distribution. In practice, quicksort is preferred when
          distribution is unknown; bucket wins only when distribution is guaranteed uniform or
          can be made so via quantile sampling.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Stability</h3>
        <p className="mb-4">
          Bucket sort is <strong>stable</strong> if the inner sort is stable — insertion sort is.
          With insertion sort inner, bucket sort preserves equal-key ordering, making it suitable
          for multi-key sort scenarios.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Use only when input distribution is known or learnable</strong>. Unknown distribution → use introsort instead.</li>
          <li><strong>Set k = Θ(n) for uniform, k = √n with quantile boundaries otherwise</strong>. Too few buckets = O(n²); too many = wasted space.</li>
          <li><strong>Sample quantiles from input for non-uniform</strong>. Random sample of √n, sort, pick percentiles as boundaries.</li>
          <li><strong>Insertion sort for small buckets (≤ 32)</strong>, introsort for larger, recursive bucket sort for massive.</li>
          <li><strong>Pre-allocate bucket arrays</strong> — resizing during distribute kills throughput. Use expected-size estimates.</li>
          <li><strong>For parallel: sample sort pattern</strong>. Per-thread local buckets, merge via parallel scan.</li>
          <li><strong>For external sort: match k to memory/bucket-size</strong>. Each bucket must fit in RAM for the sort phase.</li>
          <li><strong>Verify concatenation order matches bucket order</strong> — a classic bug source.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Skewed input → O(n²)</strong>: all elements in one bucket, insertion-sort cost is quadratic. Defense: quantile-based boundaries.</li>
          <li><strong>Overlapping bucket ranges</strong>: rounding errors in the mapping function can put the same key in two buckets. Use inclusive-exclusive boundaries consistently.</li>
          <li><strong>Too few buckets</strong>: k = 10 for n = 10⁶ means 10⁵ elements per bucket, insertion sort is Θ(10¹⁰). Always k ≥ √n, ideally k = Θ(n).</li>
          <li><strong>Too many buckets</strong>: k = n² means Θ(n²) space for Θ(n) data. Cache misses dominate distribution step.</li>
          <li><strong>Inner sort choice mismatch</strong>: using merge sort on 5-element buckets adds O(n log n) recursive overhead. Insertion is correct.</li>
          <li><strong>Hash-based bucket mapping</strong>: if you hash into buckets, concatenation won&apos;t yield sorted output. Buckets must preserve order.</li>
          <li><strong>Floating-point equality</strong>: mapping boundary key to bucket requires careful floor/ceil handling; off-by-one loses the last element.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <p className="mb-4">
          <strong>Hadoop TeraSort</strong>: distribute records across reducers using range
          partitioning — bucket sort at distributed scale. Sample sort picks partition boundaries;
          each reducer sorts its bucket locally.
        </p>
        <p className="mb-4">
          <strong>Spark RangePartitioner</strong>: for repartitionAndSortWithinPartitions,
          RangePartitioner samples the RDD to build bucket boundaries, distributes records, and
          sorts each partition. Pure bucket sort structure.
        </p>
        <p className="mb-4">
          <strong>External sort in databases</strong>: PostgreSQL&apos;s tuplesort.c for large result
          sets distributes tuples into per-tape runs, sorts each in memory, merges via polyphase
          merge. Same concept as bucket sort extended with a merge phase.
        </p>
        <p className="mb-4">
          <strong>Image histogram equalization</strong>: pixel intensities are bucketed by
          intensity, counts are accumulated, the CDF is inverted to produce equalized pixel
          values. Every camera ISP implements this.
        </p>
        <p className="mb-4">
          <strong>Parallel sample sort</strong>: MPI-based numerical sorts (LAPACK sort routines),
          Intel TBB parallel_sort for large arrays, Standard Template Adaptive Parallel Library
          (STAPL). Sample sort beats parallel merge sort for large n because it distributes work
          more evenly.
        </p>
        <p className="mb-4">
          <strong>Network packet scheduling</strong>: priority-bucket queues (token bucket
          scheduler, WFQ variants) distribute packets into priority buckets, dequeue in order.
          Conceptually bucket sort as a queuing discipline.
        </p>
        <p className="mb-4">
          <strong>Approximate top-k via bucket sort</strong>: for queries like &quot;top 10 selling
          items&quot; with skewed distributions, bucket elements by log-frequency, then take top k from
          the highest buckets. Used in heavy-hitters algorithms (Count-Sketch + bucket sort).
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/bucket-sort-diagram-3.svg"
          alt="Parallel sample sort architecture with per-thread sampling and range partitioning"
          caption="Parallel sample sort: random sample → boundary picks → range partition → per-thread local sort → concatenate."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li><strong>Implement bucket sort for floats in [0,1).</strong> n buckets, distribute by ⌊key·n⌋, insertion sort each, concatenate.</li>
          <li><strong>Why is expected time Θ(n) but worst case Θ(n²)?</strong> Uniform distribution gives O(1) per bucket; adversarial clusters all elements in one bucket.</li>
          <li><strong>Bucket sort vs counting sort: when to use each?</strong> Counting for small integer range; bucket for real-valued or large-range keys.</li>
          <li><strong>Bucket sort vs radix sort: are they related?</strong> Radix is MSD bucket sort with fixed digit boundaries plus recursion.</li>
          <li><strong>Handle skewed inputs.</strong> Quantile-based bucket boundaries sampled from input.</li>
          <li><strong>Is bucket sort stable?</strong> Yes if inner sort is stable (insertion is).</li>
          <li><strong>Parallelize bucket sort.</strong> Sample sort: boundaries from random sample, distribute in parallel, sort each bucket on its own thread.</li>
          <li><strong>Find top-k with bucket sort.</strong> Distribute by score into log-scaled buckets, extract top-k from highest buckets. Approximate but O(n).</li>
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>CLRS Chapter 8.4 — Bucket Sort.</li>
          <li>Sedgewick &amp; Wayne, <em>Algorithms</em> 4e — bucket/distribution sort discussion.</li>
          <li>Blelloch, Leiserson, et al., &quot;A Comparison of Sorting Algorithms for the Connection Machine&quot; (1991) — sample sort.</li>
          <li>Frazer &amp; McKellar, &quot;Samplesort: A Sampling Approach to Minimal Storage Tree Sorting&quot; (1970) — the original sample sort.</li>
          <li>Spark RangePartitioner source — reservoir-sampled bucket boundaries.</li>
          <li>Hadoop TeraSort paper (Yahoo, 2008) — distributed bucket sort at petabyte scale.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
