"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "radix-sort",
  title: "Radix Sort",
  description:
    "Radix Sort — LSD and MSD variants, digit-by-digit linear-time sorting. The fastest known sort for fixed-width integer keys on both CPU and GPU.",
  category: "other",
  subcategory: "algorithms",
  slug: "radix-sort",
  wordCount: 5200,
  readingTime: 26,
  lastUpdated: "2026-04-20",
  tags: ["radix-sort", "sorting", "lsd", "msd", "non-comparative"],
  relatedTopics: ["counting-sort", "bucket-sort", "quick-sort", "strings"],
};

export default function RadixSortArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p className="mb-4">
          Radix Sort is a non-comparative sorting algorithm that processes keys one digit at a time,
          achieving Θ(d · (n + b)) time where n is the number of elements, d is the number of digits
          per key, and b is the base (radix) — typically 2, 10, or 256. It predates the electronic
          computer: punch-card sorting machines in the 1890s US Census used radix sort mechanically,
          feeding cards through one column at a time. Herman Hollerith&apos;s tabulator was, in essence,
          a physical radix sort, and the algorithm&apos;s name comes from that era.
        </p>
        <p className="mb-4">
          Two variants dominate. <strong>LSD radix sort</strong> (Least Significant Digit) processes
          digits from right to left, stably sorting by each digit in turn; it is the textbook form
          and works beautifully when keys have uniform width (32-bit integers, 8-byte IP addresses,
          fixed-length strings). <strong>MSD radix sort</strong> (Most Significant Digit) processes
          left to right, recursively partitioning by each digit and descending into each bucket; it
          handles variable-length keys (strings, names) and can early-exit once a bucket has a single
          element.
        </p>
        <p className="mb-4">
          For integer sorting on modern hardware, radix sort is often the fastest known algorithm.
          On CPUs, ska_sort and Rust&apos;s radsort beat introsort by 3–5× on 10⁶–10⁷ element arrays.
          On GPUs, NVIDIA CUB&apos;s radix sort hits 10 GB/s on H100, sorting billions of keys per
          second — it is the default inside Thrust, PyTorch&apos;s sort, and Dask-CUDA. Radix also
          appears inside Google&apos;s Flash Sort for fixed-layout data, and inside the TeraSort
          benchmark implementations that hold records on Hadoop and Spark.
        </p>
        <p className="mb-4">
          Beyond integer sorting, radix is the core of <strong>suffix array construction</strong>
          (DC3, SA-IS algorithms — fundamental in compression and bioinformatics), of <strong>IP
          routing lookup</strong> (trie structures are conceptually MSD radix tries), and of
          <strong> string-sorting primitives</strong> (3-way radix quicksort by Bentley &amp;
          Sedgewick, the fastest known string sort). Wherever keys are fixed-width or decomposable
          into small digits, radix sort is worth considering.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/radix-sort-diagram-1.svg"
          alt="LSD radix sort digit-by-digit processing from least to most significant digit"
          caption="LSD radix sort: stable sort by ones digit, then tens, then hundreds — each pass preserves earlier order."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <h3 className="text-xl font-semibold mt-6 mb-3">LSD: stability-driven correctness</h3>
        <p className="mb-4">
          LSD radix sort&apos;s correctness hinges entirely on the inner sort being stable. After
          sorting by the ones digit, elements are ordered by that digit. When we then sort by the
          tens digit, a stable sort preserves the ones-digit ordering among elements with the same
          tens digit. After d passes, the array is fully sorted because higher digits dominate —
          but only if lower-digit order was never disturbed. If the inner sort is unstable,
          correctness collapses. Counting sort is the canonical choice precisely because it is
          stable, and its Θ(n + b) per pass gives radix&apos;s total Θ(d(n + b)).
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">MSD: prefix partitioning + recursion</h3>
        <p className="mb-4">
          MSD sorts by the most significant digit first, producing b buckets, each of which is then
          recursively radix-sorted on the next digit. It is natural for variable-length keys: once
          a bucket has only one element, recursion stops. MSD is essentially a trie built top-down,
          and the string sort called 3-way radix quicksort is a hybrid MSD radix + quicksort that
          handles tie runs efficiently. MSD with b = 256 and in-place partition is the fastest
          known general-purpose string sort.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Choice of radix (base)</h3>
        <p className="mb-4">
          The radix b controls the d vs (n + b) tradeoff. Larger b means fewer digits (smaller d)
          but larger count arrays and more cache pressure. Common choices: <strong>b = 256</strong>
          (byte-sized) gives d = 4 for 32-bit keys and a 1 KB count array that fits in L1;
          <strong> b = 2¹⁶ = 65536</strong> gives d = 2 for 32-bit but a 256 KB count array that
          exceeds L1; <strong>b = 2</strong> (binary) gives 32 passes but trivially small count
          arrays. ska_sort uses b = 256; Nvidia CUB tunes b = 16 for their GPU architecture because
          warp-level scans favor small b.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Signed integers and floats</h3>
        <p className="mb-4">
          Signed integers require flipping the sign bit before sorting — two&apos;s-complement negative
          numbers sort backwards if treated as unsigned. IEEE-754 floats need a more elaborate
          bitwise manipulation: flip the sign bit for non-negatives, flip all bits for negatives.
          This treats floats as sortable bit patterns. Rust&apos;s radsort includes a
          <code>RadixKey</code> trait with this encoding; pdqsort fallback for floats uses it when
          strict bit patterns are acceptable.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">American-Flag sort (in-place MSD)</h3>
        <p className="mb-4">
          The classical MSD radix sort allocates output arrays at each level (Θ(d·n) total
          auxiliary). McIlroy, Bostic &amp; McIlroy&apos;s American-Flag sort performs MSD partitioning
          in-place using cyclic rotations. It trades some speed for Θ(1) auxiliary space. Used in
          memory-constrained contexts: embedded, kernel, hyperscale sort-in-shuffle stages where
          allocation is a concern.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/radix-sort-diagram-2.svg"
          alt="LSD vs MSD radix sort comparison with bucket structure and recursion pattern"
          caption="LSD vs MSD: LSD is bottom-up with full passes; MSD is top-down recursive with early termination."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p className="mb-4">
          Modern radix sort implementations are highly engineered. ska_sort uses a byte-wise MSD
          radix for the outer levels (cache-friendly big buckets) and switches to American-Flag
          in-place when recursion is deep. It also skips radix passes when a range is already
          small (&lt; 128), falling back to insertion or pdqsort. For floating-point, it preprocesses
          bits to encode IEEE-754 as a sortable byte sequence.
        </p>
        <p className="mb-4">
          GPU radix sort is a different engineering game. Thrust/CUB&apos;s radix sort uses
          <strong> block-level</strong> decomposition: each thread block computes a local histogram
          over its tile, computes a local prefix scan, and participates in a global scan to compute
          per-bucket offsets. The scatter step uses coalesced memory writes per bucket, which
          dramatically improves memory throughput. This achieves 10+ GB/s — memory-bandwidth-limited
          rather than compute-limited.
        </p>
        <p className="mb-4">
          Distributed radix sort is the backbone of TeraSort (Hadoop) and Spark&apos;s sort shuffle.
          The top few bits of each key route records to the correct reducer via range partitioning;
          within each reducer, a local radix sort finishes the job. The 1 TB sort record in 2008
          was set using an MSD radix scheme across ~1000 machines with ~1 TB of data; each machine
          used byte-wise radix with ~80 MB/s per-core throughput.
        </p>
        <p className="mb-4">
          For strings, 3-way radix quicksort is a hybrid: pick the byte at position d in the median
          key, partition into &lt;, =, &gt; regions, recurse into all three, incrementing d for the = region.
          It achieves near-optimal O(n · distinguishing-prefix-length) time and is the sort inside
          Java&apos;s Strings.sort when stability is not required and inside C++ libraries like boost.string.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <h3 className="text-xl font-semibold mt-6 mb-3">vs. Comparison sorts</h3>
        <p className="mb-4">
          Radix is Θ(d · n) for fixed d, beating Θ(n log n). For 32-bit integers on 10⁶ elements,
          radix is 3–5× faster than introsort in practice. But d scales with key width: for 128-bit
          keys, d = 16 at byte-radix, and radix&apos;s advantage narrows. For variable-length strings,
          d is the key length and radix can lose to 3-way quicksort.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">vs. Counting sort</h3>
        <p className="mb-4">
          Counting sort is single-pass O(n + k); radix is d passes of O(n + b) with b ≪ k. When k
          is small enough to allocate a full count array (e.g., k = 256), counting sort is faster.
          When k = 2³², the count array is 16 GB — radix is the only option.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Stability</h3>
        <p className="mb-4">
          LSD radix is <strong>stable</strong> (inherits from inner counting sort). MSD radix can
          be stable if the inner sort is; American-Flag&apos;s in-place version is <strong>not</strong>
          stable.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Space</h3>
        <p className="mb-4">
          Standard radix needs Θ(n + b) auxiliary. American-Flag MSD is Θ(b). Comparison sorts like
          heapsort are Θ(1). For bulk sorting on limited-memory devices, this matters.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Use LSD radix for fixed-width keys</strong> (integers, IP addresses, timestamps). MSD for variable-width (strings, suffixes).</li>
          <li><strong>Choose b = 256 (byte-radix)</strong> unless you have a specific reason otherwise — cache fit + minimal d.</li>
          <li><strong>Preprocess signed ints and floats</strong> to sortable bit patterns before sorting. Flip sign bits, handle NaNs.</li>
          <li><strong>Switch to insertion/pdqsort at small n</strong> (&lt; 64 typically) — radix overhead dominates below that.</li>
          <li><strong>Use ska_sort or CUB, not hand-rolled</strong> — engineering headroom is narrow; tuned implementations win.</li>
          <li><strong>For distributed sort, range-partition on top bits, radix locally</strong>. Standard TeraSort pattern.</li>
          <li><strong>For strings, use 3-way radix quicksort</strong> (Bentley-Sedgewick) — handles equality runs efficiently.</li>
          <li><strong>Benchmark on your data</strong>. Radix&apos;s advantage is workload-dependent; narrow or clustered key ranges change the calculus.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Unstable inner sort breaks LSD correctness</strong> — higher-digit pass destroys lower-digit ordering.</li>
          <li><strong>Signed ints without sign-bit flip</strong> sort negatives as large unsigned values, placing them at the end.</li>
          <li><strong>Floats without IEEE bit-pattern encoding</strong> produce nonsensical ordering (−0, NaNs, denormals).</li>
          <li><strong>Large b (e.g., 2¹⁶)</strong>: count array exceeds L1, degrading throughput. Stick to 256 unless measured.</li>
          <li><strong>Short keys with padding</strong>: sorting 4-byte prefixes of strings can miss ordering differences in the tail.</li>
          <li><strong>Memory allocation per pass</strong>: allocate auxiliary array once, ping-pong between src/dst to avoid GC/malloc overhead.</li>
          <li><strong>Radix on small n</strong>: for n &lt; 100, radix&apos;s constant factor loses to insertion sort. Always guard with a cutoff.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <p className="mb-4">
          <strong>NVIDIA CUB &amp; Thrust</strong>: radix sort is the default GPU integer sort,
          hitting 10 GB/s on H100. Used by PyTorch torch.sort for integer tensors, RAPIDS cuDF for
          DataFrame sorting, and NVIDIA&apos;s RAPIDS recommendation engines.
        </p>
        <p className="mb-4">
          <strong>Hadoop TeraSort &amp; Spark sort-shuffle</strong>: MSD radix for range partitioning
          across reducers, LSD inside each reducer. Held the 1 TB sort record from 2008–2014.
        </p>
        <p className="mb-4">
          <strong>Google Flash Sort</strong>: internally used in ranking pipelines where record
          layouts are fixed. Byte-wise radix for indexed fields.
        </p>
        <p className="mb-4">
          <strong>Bioinformatics: suffix array construction</strong> (SA-IS, DC3, BWT-based genomic
          aligners like BWA, Bowtie). Radix sort powers the building block that makes BWT
          indexing fast enough for whole-genome alignment.
        </p>
        <p className="mb-4">
          <strong>IP routing lookup</strong>: routing tables stored as byte-indexed radix tries
          (Patricia tries, multibit tries). Linux&apos;s fib_trie is an MSD radix structure.
        </p>
        <p className="mb-4">
          <strong>Rust&apos;s radsort and C++ ska_sort</strong> ship as drop-in replacements for
          standard sort on fixed-width data, with typical 3–5× speedup.
        </p>
        <p className="mb-4">
          <strong>Compression algorithms</strong>: Burrows-Wheeler transform (bzip2) builds and
          sorts cyclic rotations using radix-based suffix sort. LZ77/LZ78 variants use radix-based
          hash prefix sort.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/radix-sort-diagram-3.svg"
          alt="GPU radix sort block-level histogram, scan, and coalesced scatter pipeline"
          caption="GPU radix sort (CUB): per-block histograms, global scan, coalesced scatter. Bandwidth-limited at 10 GB/s."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li><strong>LSD vs MSD: when to use each?</strong> LSD for fixed-width; MSD for variable-width (strings) or when early termination is possible.</li>
          <li><strong>Why must the inner sort be stable?</strong> LSD correctness requires preserving lower-digit order when sorting higher digits.</li>
          <li><strong>What&apos;s the time complexity and when does radix beat quicksort?</strong> Θ(d(n+b)); beats O(n log n) when d is constant or d · log b &lt; log n.</li>
          <li><strong>How do you sort signed integers / floats with radix?</strong> Flip sign bit for ints; IEEE-754 bit-fixup for floats.</li>
          <li><strong>Choose the radix base b. Why 256?</strong> Byte-wise: d=4 for 32-bit keys, count array 1 KB fits in L1.</li>
          <li><strong>Implement LSD radix sort.</strong> d passes of stable counting sort over one digit each.</li>
          <li><strong>What is 3-way radix quicksort?</strong> MSD radix combined with quicksort partition on the current byte. Fastest string sort.</li>
          <li><strong>How does GPU radix sort differ?</strong> Block-level histograms, warp scans, coalesced scatter — bandwidth-bound.</li>
          <li><strong>Radix sort space complexity?</strong> Θ(n+b) typical; Θ(b) for in-place American-Flag.</li>
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Herman Hollerith&apos;s 1890 census tabulator — the first mechanical radix sort.</li>
          <li>CLRS Chapter 8.3 — Radix Sort (LSD form).</li>
          <li>Sedgewick &amp; Wayne, <em>Algorithms</em> 4e, Chapter 5 — radix-based string sorts.</li>
          <li>McIlroy, Bostic &amp; McIlroy, &quot;Engineering Radix Sort&quot; (1993) — American-Flag sort.</li>
          <li>Bentley &amp; Sedgewick, &quot;Fast Algorithms for Sorting and Searching Strings&quot; (1997) — 3-way radix quicksort.</li>
          <li>Merrill &amp; Grimshaw, &quot;High Performance and Scalable Radix Sorting&quot; (2011) — GPU radix sort design.</li>
          <li>Malte Skarupke, &quot;I Wrote a Faster Sorting Algorithm&quot; (2016) — ska_sort C++.</li>
          <li>Nong, Zhang &amp; Chan, &quot;Linear Suffix Array Construction by Almost Pure Induced-Sorting&quot; (SA-IS, 2009).</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
