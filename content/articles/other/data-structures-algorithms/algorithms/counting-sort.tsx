"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "counting-sort",
  title: "Counting Sort",
  description:
    "Counting Sort — non-comparative linear-time sorting for small integer ranges. The stable workhorse inside radix sort and histogram-based sorts.",
  category: "other",
  subcategory: "algorithms",
  slug: "counting-sort",
  wordCount: 4800,
  readingTime: 24,
  lastUpdated: "2026-04-20",
  tags: ["counting-sort", "sorting", "non-comparative", "stable", "linear-time"],
  relatedTopics: ["radix-sort", "bucket-sort", "quick-sort", "merge-sort"],
};

export default function CountingSortArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p className="mb-4">
          Counting Sort is a non-comparative sorting algorithm that runs in Θ(n + k) time and space,
          where n is the number of elements and k is the size of the key range. Harold H. Seward
          introduced it in 1954 as part of his master&apos;s thesis at MIT, years before the classical
          comparison-based sorts were even named. By avoiding comparisons entirely and working
          directly with key values as array indices, it breaks the Ω(n log n) lower bound that
          governs comparison sorts — but only under the condition that keys are small integers (or
          can be mapped to small integers).
        </p>
        <p className="mb-4">
          The algorithm operates in three passes. First, scan the input and build a histogram of
          key frequencies in a count array of size k. Second, convert counts into prefix sums so
          count[v] tells you the final position of the last copy of key v. Third, scan the input
          again (in reverse for stability) and place each element into its final slot, decrementing
          the relevant count. The result is a stably sorted output in linear time.
        </p>
        <p className="mb-4">
          Counting sort&apos;s real importance is as a subroutine. Every LSD radix sort iteration is
          literally a counting sort over one digit. Bucket sort&apos;s per-bucket placement step is a
          counting sort. Many specialized GPU sorts (warp-level radix sort, CUB&apos;s block_radix_sort)
          use counting sort primitives. It also appears wherever a histogram is needed: image
          processing (histogram equalization), distributed systems (range-partitioning to balance
          shard sizes), and compression (symbol-frequency tables for Huffman).
        </p>
        <p className="mb-4">
          The stability property matters enormously. Radix sort correctness depends on the inner
          sort being stable — if LSD radix sort is not stable, relative order from earlier passes
          is destroyed by later passes and the algorithm fails. Counting sort is the canonical
          choice specifically because it is stable by construction (via reverse-order placement),
          and its linear time nested inside radix sort gives radix&apos;s total Θ(d · (n+k)) bound.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/counting-sort-diagram-1.svg"
          alt="Counting sort three-pass trace: histogram, prefix sum, reverse placement"
          caption="Three passes: count frequencies, accumulate into prefix sums, scan input in reverse to place stably."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <h3 className="text-xl font-semibold mt-6 mb-3">Keys as indices</h3>
        <p className="mb-4">
          The defining trick is using each key value as an index into the count array. For keys in
          [0, k), the count array has size k and count[v] tracks how many times key v appears. This
          sidesteps the comparison model entirely — no key is ever compared against another, only
          counted. The linear-time advantage flows from O(1) array indexing replacing O(log n)
          comparisons.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">The prefix-sum step</h3>
        <p className="mb-4">
          After counting, count[v] stores the frequency of v. Converting to a prefix sum (count[v]
          += count[v−1] for v from 1 to k−1) transforms it into a placement map: count[v] becomes
          the index one past the last position where v should go. Iterating the input in reverse
          and, for each element x, writing to output[--count[x]] places x correctly and decrements
          the count so the previous copy of x lands one slot earlier. This is the operation that
          preserves stability.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Range normalization</h3>
        <p className="mb-4">
          Real-world keys rarely start at 0. For keys in [min, max], subtract min at read time and
          add back at write time, using a count array of size (max − min + 1). When the range is
          unknown, compute it in a pre-pass. This normalization is cheap but worth automating — many
          bugs come from off-by-one in range bounds.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Sort-by-key vs sort-objects</h3>
        <p className="mb-4">
          For raw integer arrays, counting sort can skip building the output — it is enough to
          expand the histogram back (k slots of v in output, for each v). This is simpler but loses
          the general sort-objects-by-integer-key capability. For objects, you must use the full
          three-pass placement, because objects carry data beyond the sort key.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Parallel variants</h3>
        <p className="mb-4">
          The histogram step parallelizes naturally: each thread builds a local histogram over its
          chunk of input, then a reduction sums them into the global histogram. The prefix-sum step
          uses parallel scan (Blelloch scan, Hillis-Steele scan). The placement step is the hardest
          — naive parallel placement causes contention on output indices. GPU counting sort uses
          per-thread-block histograms and atomic operations, or rank-based placement with parallel
          scans. CUB&apos;s radix sort implements this pattern and achieves 10 GB/s sorting throughput
          on modern GPUs.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/counting-sort-diagram-2.svg"
          alt="Why counting sort is stable: reverse scan and decrementing count preserves relative order"
          caption="Stability via reverse-order placement: equal keys from the input end up in reverse positions, preserving relative order."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p className="mb-4">
          A production counting sort has three loops plus a normalization pass. The histogram pass
          is a tight loop over input, incrementing count[key(x) − min]. On modern CPUs this is
          memory-bound — if the count array fits in L1 cache (k ≤ 8192 integers on typical
          hardware), throughput exceeds 1 GB/s. The prefix-sum pass is a simple linear scan. The
          placement pass reads input in reverse, computes the destination via count[--], and writes
          output. This is scatter-pattern writing, which is less cache-friendly than sequential
          writes but still faster than log-n comparison-based sorts for small k.
        </p>
        <p className="mb-4">
          The key architectural constraint is the count array size. If k = 10⁷ (say, sorting 10M
          records by a 24-bit key), the count array is 40 MB — already larger than L2/L3 and causing
          TLB pressure. Cache-blocked counting sort processes the input in chunks, building partial
          histograms that fit in L2 and merging them. For truly large k, radix sort is used instead
          — it decomposes a large key into multiple small-k digit sorts.
        </p>
        <p className="mb-4">
          When used inside radix sort, counting sort is called once per digit. The inner counting
          sort is often specialized: for 8-bit digits, k = 256, so the count array is a single cache
          line. SIMD histogram counting (parallel increments via AVX2 VPMOVZX + scatter) can further
          accelerate the innermost loop. Modern implementations like ska_sort, Pdqsort&apos;s radix
          fallback for fixed-size keys, and Rust&apos;s radsort lean heavily on vectorized counting.
        </p>
        <p className="mb-4">
          Distributed counting sort is conceptually simple and a bread-and-butter MapReduce example.
          Map workers emit (key, 1) pairs; a shuffle-group step bucketizes by key range; reducers
          count and emit sorted output. Same three-pass structure scaled across machines. This is
          what Hadoop and Spark&apos;s repartitionAndSortWithinPartitions does under the hood for
          integer key ranges.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <h3 className="text-xl font-semibold mt-6 mb-3">vs. Comparison sorts</h3>
        <p className="mb-4">
          Counting sort is Θ(n + k) — beats Θ(n log n) when k = O(n) or smaller. For n = 10⁶ with
          keys in [0, 10³], counting sort is ~20× faster than introsort. But when k = n² or larger,
          counting sort degenerates to Ω(k) and becomes worse than comparison sort. The break-even
          point is roughly k ≈ n log n.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">vs. Radix Sort</h3>
        <p className="mb-4">
          Radix sort is counting sort applied d times to d-digit keys. For 32-bit integers with
          byte-sized digits, d = 4 and k = 256, giving Θ(4(n + 256)) ≈ Θ(n) — but with 4× more
          passes. Single-pass counting sort is faster if you can afford an array of size 2³² (4 GB)
          for the count; radix wins when keys are large.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">vs. Bucket Sort</h3>
        <p className="mb-4">
          Bucket sort distributes elements into k buckets by value range, then sorts each bucket
          (usually with insertion sort). Counting sort is the extreme case where every bucket holds
          exactly one key value — it is bucket sort where the per-bucket sort is trivial. Bucket
          sort handles real-valued keys; counting sort handles only integers.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Stability &amp; space</h3>
        <p className="mb-4">
          Counting sort is <strong>stable</strong> via reverse-scan placement. It requires Θ(n + k)
          extra space — not in-place. If k is large relative to n, the memory overhead dominates.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Only use when k = O(n)</strong>. For k ≫ n, fall back to comparison sort or radix.</li>
          <li><strong>Normalize to [0, k)</strong> by subtracting min; restore after. Avoids sparse count arrays.</li>
          <li><strong>Reverse-scan placement</strong> to preserve stability — critical when used inside radix sort.</li>
          <li><strong>Pre-compute min/max</strong> unless you already know the domain (e.g., age ∈ [0, 150]).</li>
          <li><strong>Use byte-sized digits (k=256)</strong> when embedding inside radix sort — count array fits in cache.</li>
          <li><strong>Consider partitioning input</strong> for cache-friendly histogram when k is large but not huge.</li>
          <li><strong>For parallel: local histograms + scan reduction</strong>, not atomic increments on shared counters (contention kills throughput).</li>
          <li><strong>Profile before micro-optimizing</strong> — often memory bandwidth, not CPU, is the bottleneck.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Forward-scan placement breaks stability</strong> — reverse scan is required. Easy to miss in ad-hoc implementations.</li>
          <li><strong>k &gt; 2³²</strong>: count array overflows addressable memory. Use radix sort.</li>
          <li><strong>Negative keys without offset</strong>: count[−3] crashes. Always normalize by subtracting min.</li>
          <li><strong>Floating-point keys</strong>: counting sort doesn&apos;t work directly. Use bucket sort or quantize first.</li>
          <li><strong>Sparse key distributions</strong>: if 10⁶ elements have keys scattered across [0, 10⁹], count array is 4 GB for 1 MB of data. Use radix or comparison sort.</li>
          <li><strong>Cache thrashing when k &gt; L2</strong>: count increments scatter across memory. Chunk the input.</li>
          <li><strong>Off-by-one in prefix sum</strong>: using count[v] as &quot;first position of v&quot; vs &quot;one-past-last of v&quot;. Pick one convention and stick to it.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <p className="mb-4">
          <strong>LSD radix sort</strong>: inside Rust&apos;s radsort, ska_sort (C++), and Java&apos;s
          DualPivotQuicksort for small ranges, counting sort is the per-digit kernel. Sorting 10M
          32-bit integers via 4-byte radix is ~4× faster than introsort.
        </p>
        <p className="mb-4">
          <strong>Image processing</strong>: histogram equalization uses the same count + prefix-sum
          pattern as counting sort. Every camera ISP and image editor implements this.
        </p>
        <p className="mb-4">
          <strong>TeraSort benchmark</strong> (Hadoop&apos;s sort benchmark): uses range-partitioned
          counting on the first few bytes of each key to distribute load across reducers, then
          local sort on each.
        </p>
        <p className="mb-4">
          <strong>Compiler optimizations</strong>: LLVM uses counting sort on small integer arrays
          (instruction indices, register IDs) where k is bounded by the ISA size.
        </p>
        <p className="mb-4">
          <strong>Bioinformatics</strong>: DNA sequence sorting — k = 4 (A, C, G, T) or k = 64
          (3-mer codons) makes counting sort ideal. Burrows-Wheeler transforms in genomic aligners
          (BWA, Bowtie) use counting sort internally.
        </p>
        <p className="mb-4">
          <strong>Packet sorting in networking</strong>: sort packets by priority class (8–64
          classes) at line rate — k is tiny, counting sort is perfect.
        </p>
        <p className="mb-4">
          <strong>GPU primitives</strong>: NVIDIA CUB and Thrust implement counting-sort-based
          radix sort as their default integer sorter, achieving 10 GB/s on H100.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/counting-sort-diagram-3.svg"
          alt="Counting sort as kernel inside LSD radix sort showing per-digit passes"
          caption="Counting sort as a radix-sort kernel: one stable O(n+k) pass per digit; 4 passes for 32-bit keys."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li><strong>Why is counting sort linear?</strong> It uses keys as indices, avoiding the comparison model — comparison lower bound Ω(n log n) doesn&apos;t apply.</li>
          <li><strong>Implement counting sort.</strong> Three passes: histogram, prefix sum, reverse-scan placement.</li>
          <li><strong>When is counting sort better than quicksort?</strong> When k = O(n) and keys are bounded integers. For k ≈ n log n or larger, comparison wins.</li>
          <li><strong>Why is reverse scan important?</strong> Stability — forward scan reverses relative order of equal keys, breaking downstream radix sort.</li>
          <li><strong>How does counting sort fit into radix sort?</strong> Radix sort calls counting sort once per digit; per-digit k is small (e.g., 256 for bytes), giving Θ(d(n+k)) total.</li>
          <li><strong>Sort n integers in [0, k] when k = O(n).</strong> Counting sort in Θ(n).</li>
          <li><strong>Handle negative or non-integer keys?</strong> Offset by min for negatives; for floats use bucket sort or quantize.</li>
          <li><strong>Parallelize counting sort.</strong> Per-thread histograms + reduction; atomic writes on output are the bottleneck.</li>
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Harold H. Seward, &quot;Information Sorting in the Application of Electronic Digital Computers to Business Operations&quot; (MIT 1954) — original.</li>
          <li>CLRS Chapter 8.2 — Counting Sort.</li>
          <li>Sedgewick &amp; Wayne, <em>Algorithms</em> 4e — radix sort chapter uses counting internally.</li>
          <li>Malte Skarupke, &quot;I Wrote a Faster Sorting Algorithm&quot; (2016) — ska_sort, radix + counting.</li>
          <li>NVIDIA CUB documentation — GPU-parallel counting sort primitives.</li>
          <li>Merrill &amp; Grimshaw, &quot;High Performance and Scalable Radix Sorting&quot; (2011) — GPU counting-sort kernel design.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
