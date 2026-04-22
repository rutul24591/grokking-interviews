"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "jump-search",
  title: "Jump Search",
  description:
    "Jump Search — O(√n) block-skipping search on sorted arrays. A middle ground between linear and binary when random access is expensive.",
  category: "other",
  subcategory: "algorithms",
  slug: "jump-search",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-20",
  tags: ["jump-search", "search", "sqrt-decomposition", "block-search"],
  relatedTopics: ["binary-search", "linear-search", "exponential-search", "interpolation-search"],
};

export default function JumpSearchArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p className="mb-4">
          Jump Search operates on a sorted array by skipping ahead in fixed-size blocks of length m,
          then performing a linear scan within the block that straddles the target. With m = √n, the
          total work is Θ(√n) — n/m block jumps plus m final comparisons. It sits between linear
          search (Θ(n)) and binary search (Θ(log n)), and is historically interesting as the
          algorithm of choice when random access is cheap within a block but expensive across
          blocks, or when branch mispredictions make binary search&rsquo;s irregular access pattern
          costly.
        </p>
        <p className="mb-4">
          In modern software, Jump Search is rarely the optimal choice on cache-resident arrays —
          binary search wins asymptotically, linear + SIMD wins for small n. Its enduring relevance
          is as the intuition behind <span className="font-semibold">sqrt-decomposition</span>, a
          fundamental technique for range-query data structures (Mo&rsquo;s algorithm, block-
          decomposed range-update-range-sum). Anywhere you see &ldquo;precompute every √n-th
          boundary&rdquo;, jump search is the underlying motif.
        </p>
        <p className="mb-4">
          Jump Search also appears implicitly in systems code. Reading compressed or columnar data
          (Parquet row groups, LSM-tree block indexes, sorted log segments) often follows a jump
          pattern: scan block headers to find the right block, then linear-scan within. The cost
          model — one expensive seek per block, cheap sequential read within — matches jump search
          precisely, which is why √n block sizing shows up in storage layouts too.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <p className="mb-4">
          The algorithm keeps a pointer at index 0 and advances it by m each step while
          a[pointer] &lt; target. When a[pointer] ≥ target (or pointer exceeds n), the target lies in
          the block [pointer − m, pointer). A linear scan within that block either finds the target
          or returns not-found. The invariant holds because the array is sorted: if the block
          endpoint is below the target, the target cannot be in the block.
        </p>
        <p className="mb-4">
          The optimal block size is m = √n. The total work is n/m jump steps plus at most m − 1
          linear steps: f(m) = n/m + m. Taking df/dm = 0 gives m = √n, yielding Θ(√n). Deviating to
          m = n^(1/3) gives Θ(n^(2/3)); m = log n gives Θ(n/log n). The quadratic bowl around √n is
          wide, so small deviations (block size chosen to fit cache lines, page boundaries, or
          compression blocks) are nearly free.
        </p>
        <p className="mb-4">
          Jump search requires three properties: sorted data, random access (to jump by m), and
          cheap forward scanning (for the final linear phase). It degrades to linear search on
          linked lists (no random access) and underperforms binary search when random access is
          uniformly cheap (cache-resident arrays). The sweet spot is data where forward traversal
          is dramatically cheaper than random seeks — disk pages, compressed streams, tape storage.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/jump-search-diagram-1.svg"
          alt="Jump search trace showing block skipping then linear scan"
          caption="Jump search over sorted array with block size √16 = 4. Three jumps locate the block; final linear scan finds the target."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p className="mb-4">
          Two-phase control flow: <span className="font-semibold">jump phase</span> advances by m
          until overshoot or end-of-array, then <span className="font-semibold">scan phase</span>
          walks the block linearly. The scan phase must bound its upper index by min(prev + m, n) to
          avoid reading past the array. A single comparison at the start rejects targets below
          a[0]; a single comparison after the jump phase rejects targets above a[n − 1].
        </p>
        <p className="mb-4">
          A common variant uses exponentially growing jumps (1, 2, 4, 8, ...) until overshoot, then
          binary-searches the bracketing range — this is actually Exponential Search, covered
          separately. The fixed-step formulation of jump search is preferred when the jump cost is
          approximately constant (block reads), while exponential jumps dominate when the position
          distribution is heavily skewed toward small indices (unbounded streams, infinite arrays).
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/jump-search-diagram-2.svg"
          alt="Jump search flow diagram comparing jump phase and scan phase"
          caption="Two-phase control flow. Jump phase: O(√n) block boundary checks. Scan phase: O(√n) linear comparisons. Combined: Θ(√n)."
        />
        <p className="mb-4">
          Implementation edge cases: (1) when n is not a perfect square, use ⌊√n⌋; the extra
          comparisons from suboptimal block size are negligible. (2) When the jump overshoots past
          n, cap the scan at n, not at prev + m. (3) For duplicates, jump search naturally finds
          some occurrence — to find the first, degrade the scan phase to lower_bound behavior.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <p className="mb-4">
          <span className="font-semibold">vs Linear Search:</span> Θ(√n) vs Θ(n). Jump wins on
          large sorted inputs. Linear wins on small n, unsorted data, or when SIMD vectorization
          applies. Jump search cannot be vectorized effectively because the jump-then-scan pattern
          is too irregular.
        </p>
        <p className="mb-4">
          <span className="font-semibold">vs Binary Search:</span> Θ(√n) is asymptotically worse
          than Θ(log n) — for n = 10⁶, √n = 1000 vs log n = 20. Binary search wins on any uniform-
          access-cost array. Jump search&rsquo;s advantage is purely in access-cost asymmetry:
          when a seek costs 100× a sequential read, jump&rsquo;s √n seeks + √n reads can beat
          binary&rsquo;s log n seeks if the sequential reads are cheap enough.
        </p>
        <p className="mb-4">
          <span className="font-semibold">vs Interpolation Search:</span> Interpolation achieves
          O(log log n) on uniformly distributed data but degrades to O(n) worst case on skewed
          distributions. Jump search has the stable O(√n) guarantee regardless of distribution.
          Production code typically prefers the stable bound.
        </p>
        <p className="mb-4">
          <span className="font-semibold">vs Sqrt-decomposition structures:</span> The block
          structure jump search implies can be extended to support range queries in O(√n) per
          query. Mo&rsquo;s algorithm uses this to answer offline range queries in O((n + q)√n).
          Jump search is thus the read-only special case of a much larger family.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <p className="mb-4">
          Choose block size to align with the underlying access model, not just √n. For disk reads,
          use the block size exposed by the filesystem (typically 4 KB, 64 KB, or 1 MB). For
          compressed data, use the compression block size. For cache-sensitive code, align to cache
          lines (64 B). A slightly suboptimal block size that aligns with hardware boundaries
          typically outperforms a mathematically optimal size that straddles them.
        </p>
        <p className="mb-4">
          Always verify that jump search actually beats binary search for your workload before
          adopting it. On a modern laptop with data in RAM, binary search wins for essentially all
          array sizes — jump search is a specialized tool for asymmetric access-cost scenarios,
          not a general-purpose improvement over binary search.
        </p>
        <p className="mb-4">
          Prefer exponential search for unbounded or streaming data where the array size is
          unknown. Use jump search only when n is known and the block-seek-cost model applies.
          For in-memory sorted arrays, use binary search. For disk-resident sorted data, use a
          proper B-tree or LSM index — jump search is a last-resort fallback when no index exists.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <p className="mb-4">
          <span className="font-semibold">Out-of-bounds on jump:</span> advancing by m past n
          reads garbage memory. Bound the jump with min(pointer + m, n), and after the jump phase
          check both pointer ≥ n and a[min(pointer, n − 1)] ≥ target before scanning.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Wrong block endpoint in scan:</span> the scan phase
          walks [prev, pointer), not [prev, pointer]. Off-by-one errors here either miss the
          target or read past the array boundary.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Using jump search on cache-resident data:</span> a
          common premature-optimization trap. Binary search is faster; jump search costs you the
          same amount of code plus worse asymptotics. Measure before adopting.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Confusing jump search with exponential search:</span>
          exponential doubles the jump each step and then binary-searches; jump search uses a
          fixed stride. They&rsquo;re distinct algorithms with different use cases.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <p className="mb-4">
          <span className="font-semibold">Compressed log scanning:</span> tools like grep over
          gzip-compressed log archives use a jump-style access pattern — scan block boundaries to
          find the containing block, then decompress and linear-scan within.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Parquet and ORC row-group indexes:</span> columnar file
          formats store per-row-group min/max stats so queries can jump over row groups whose range
          excludes the predicate, then scan within the matching group — jump search applied at
          storage layer granularity.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Sqrt-decomposition range queries:</span> Mo&rsquo;s
          algorithm and block decomposition for competitive programming rely on the same √n
          partitioning logic as jump search for O(√n) per-query cost.
        </p>
        <p className="mb-4">
          <span className="font-semibold">B-tree navigation fallback:</span> some embedded
          databases use jump search within a B-tree leaf page when cache-line boundaries make
          binary search&rsquo;s branch mispredictions dominate. Linear or jump within the 64-byte
          block, binary across pages.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/jump-search-diagram-3.svg"
          alt="Comparison of search algorithms by access cost model"
          caption="Where jump search fits: asymmetric access costs where seeks are expensive and sequential reads are cheap."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <p className="mb-4">
          <span className="font-semibold">Why is √n optimal?</span> Total work f(m) = n/m + m.
          df/dm = −n/m² + 1 = 0 → m = √n. Second derivative positive → minimum. Expect to derive
          this at a whiteboard.
        </p>
        <p className="mb-4">
          <span className="font-semibold">When would you use jump search over binary search?</span>
          When random access is expensive but sequential access within a block is cheap: disk
          reads, compressed blocks, tape storage. On cache-resident arrays, binary always wins.
        </p>
        <p className="mb-4">
          <span className="font-semibold">How does jump search handle duplicates?</span>
          Naturally finds some occurrence. To find the first, the scan phase becomes a lower_bound
          within the block. To find the last, use upper_bound within the block and step back.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Implement jump search for an unknown-size sorted
          stream.</span> You can&rsquo;t — use exponential search, which handles unbounded input.
          Jump search needs n to compute m = √n.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Knuth, <em>The Art of Computer Programming, Vol 3: Sorting and Searching</em>, §6.2.1 — sequential search analysis including jump variants.</li>
          <li>Ben Shneiderman, &ldquo;Jump Searching: A Fast Sequential Search Technique&rdquo; (1978) — original formal analysis.</li>
          <li>CP-Algorithms, &ldquo;Sqrt Decomposition&rdquo; — https://cp-algorithms.com/data_structures/sqrt_decomposition.html</li>
          <li>Mo&rsquo;s Algorithm tutorial — Codeforces community resources on offline range queries.</li>
          <li>Parquet file format specification — row group indexes and statistics.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
