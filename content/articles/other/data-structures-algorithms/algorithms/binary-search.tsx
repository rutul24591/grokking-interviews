"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "binary-search",
  title: "Binary Search",
  description:
    "Binary Search — O(log n) divide-and-conquer search over sorted data. The lower_bound / upper_bound / parametric-search template behind databases, compilers, and rate limiters.",
  category: "other",
  subcategory: "algorithms",
  slug: "binary-search",
  wordCount: 5400,
  readingTime: 27,
  lastUpdated: "2026-04-20",
  tags: [
    "binary-search",
    "search",
    "lower-bound",
    "upper-bound",
    "parametric-search",
  ],
  relatedTopics: [
    "linear-search",
    "exponential-search",
    "interpolation-search",
    "ternary-search",
  ],
};

export default function BinarySearchArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p className="mb-4">
          Binary Search locates an element (or insertion point) in a sorted sequence in Θ(log n)
          time by repeatedly halving the search range. Each step compares the midpoint to the
          target, discarding half the remaining range. The earliest documented occurrence is in
          John Mauchly&apos;s 1946 lectures at the Moore School — the same event that launched the
          field of algorithm design. It predates the modern programming language by a decade and
          remains one of the most important primitives in computer science.
        </p>
        <p className="mb-4">
          Three variants dominate in practice. <strong>Standard binary search</strong> returns the
          index of any matching element or not-found. <strong>lower_bound</strong> returns the
          first position where target could be inserted without violating order — i.e., the
          leftmost index ≥ target. <strong>upper_bound</strong> returns the first index strictly
          greater than target. Together, lower_bound and upper_bound bracket the range of all
          occurrences of a target, enabling count queries and range-insert operations. Every
          standard library implements this trio: C++&apos;s &lt;algorithm&gt;, Python&apos;s bisect, Java&apos;s
          Collections.binarySearch, Rust&apos;s slice::binary_search, Go&apos;s sort.SearchInts.
        </p>
        <p className="mb-4">
          Beyond array lookup, binary search is the spine of <strong>parametric search</strong> —
          the technique of reducing an optimization problem &quot;find the smallest x satisfying
          predicate P&quot; to a binary search over x-values where P switches from false to true. Rate
          limiters (find the smallest token-refill rate that keeps queue bounded), scheduling
          (find the minimum makespan), geometric queries (find the radius that captures k points),
          and LP rounding all reduce to parametric binary search. In interview settings, this is
          what separates the candidate who &quot;knows binary search&quot; from one who uses it as a
          problem-solving tool.
        </p>
        <p className="mb-4">
          Binary search also underlies <strong>binary-search trees (B-trees, B+ trees)</strong>,
          the I/O-optimal index structure of every relational and NoSQL database. Each node of a
          B+ tree contains a sorted array of keys that is itself binary-searched on lookup. When
          PostgreSQL or MySQL reports &quot;index scan&quot;, each node access is an in-memory binary
          search. The same pattern drives compiler symbol tables, kernel radix trees,
          content-addressable object stores (Git&apos;s pack index), and the FROW counters in
          cache-coherent hardware.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/binary-search-diagram-1.svg"
          alt="Binary search iteratively halving a sorted array to locate a target"
          caption="Each step halves the range: n, n/2, n/4, …, 1 — log₂n iterations. Strictly requires sorted input."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <h3 className="text-xl font-semibold mt-6 mb-3">Invariants and the off-by-one trap</h3>
        <p className="mb-4">
          Binary search&apos;s correctness depends on a loop invariant: the answer, if it exists, is
          always within [lo, hi). The three common bug sources are the loop condition (<code>lo &lt;
          hi</code> vs <code>lo &lt;= hi</code>), the midpoint formula (<code>(lo + hi) / 2</code> vs
          <code> lo + (hi − lo) / 2</code> — the first overflows for large arrays), and the update
          step (<code>hi = mid</code> vs <code>hi = mid − 1</code>). A widely cited 2006 Google
          Research blog post noted that the JDK&apos;s Arrays.binarySearch had the integer-overflow
          bug <em>for 9 years</em>, affecting Sun, IBM, and everyone else. The rule: use
          <code> mid = lo + (hi − lo) / 2</code>, not <code>(lo + hi) / 2</code>.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">lower_bound / upper_bound</h3>
        <p className="mb-4">
          The most useful variant is &quot;find first index where predicate P is true&quot;, given that P
          is monotonic: false for indices &lt; k, true for ≥ k. This is lower_bound generalized.
          Using half-open interval [lo, hi) and updating <code>hi = mid</code> when P(mid) is true,
          <code>lo = mid + 1</code> otherwise, yields a correct implementation in 4 lines. Once
          you grasp this pattern, you can implement any binary-search variant (find first, find
          last, count occurrences, insertion point) by choosing the right P. This is the pattern
          behind C++&apos;s std::lower_bound and Rust&apos;s partition_point.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Parametric / answer search</h3>
        <p className="mb-4">
          When the question is &quot;find the smallest/largest x such that property P(x) holds&quot;, and
          P is monotonic in x, binary search on x works. Example: &quot;minimum capacity to ship all
          packages within d days&quot;. Define P(cap) = &quot;can ship all packages in ≤ d days with
          capacity cap&quot;. P is monotonic (larger cap can only help). Binary search cap over
          [max(weights), sum(weights)]. Each P evaluation is an O(n) greedy simulation. Total:
          O(n log range). The same structure applies to scheduling, rate limiting, resource
          allocation, network bandwidth shaping — any problem with a monotonic feasibility check.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Binary search on real numbers</h3>
        <p className="mb-4">
          For continuous P(x) over reals, run binary search for a fixed number of iterations
          (100 iterations ≈ 10⁻³⁰ precision) rather than looping until <code>lo == hi</code>.
          Floating-point equality is unreliable; bounded iterations give predictable precision.
          This is used in computational geometry (find the radius achieving a coverage target),
          financial analysis (yield-to-maturity solve), and animation (easing function inversion).
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Interpolation as an optimization</h3>
        <p className="mb-4">
          Standard binary search picks mid at the geometric midpoint. For uniformly-distributed
          data, interpolation search picks mid at a predicted position based on target value,
          achieving expected O(log log n) time — but worst case degrades to O(n). Binary is the
          safer default; interpolation is the specialized variant for known distributions.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/binary-search-diagram-2.svg"
          alt="Three binary search templates: find exact, lower_bound, upper_bound with loop invariants"
          caption="Three templates: find-exact, lower_bound, upper_bound. Invariant: answer ∈ [lo, hi)."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p className="mb-4">
          A production binary search looks simple but is highly engineered. The classical form has
          log₂n iterations, each with one comparison and two mispredictable branches. On
          pipelined CPUs, these branches are unpredictable (50/50 on random targets) and cost
          15–20 cycles each — log₂n × 20 cycles dominates runtime. <strong>Branchless binary
          search</strong> (Bentley, Kunisch) replaces the branch with a conditional move
          (CMOV/SEL), making iteration time constant. For n = 10⁶ in L3 cache, branchless is ~3×
          faster than branching.
        </p>
        <p className="mb-4">
          Another optimization is <strong>Eytzinger layout</strong>: instead of storing the sorted
          array, store it in breadth-first order of an implicit binary search tree. Binary search
          becomes i → 2i+1 or 2i+2, giving cache-line-friendly access patterns: the first few
          levels fit in L1, accelerating the start of each search. Cache-aligned Eytzinger beats
          standard sorted-array binary search by 2–3× on large arrays.
        </p>
        <p className="mb-4">
          <strong>B+ tree / database indices</strong> generalize this. Each node is a sorted array
          of ~100 keys with child pointers. Lookup does a binary search within the node, then
          follows the chosen child. For 10M rows, a B+ tree has 4 levels of ~100 keys each —
          about 28 comparisons vs 23 for flat binary search, but the tree traversal has better
          cache behavior because each node fits in one disk page. B-tree indexes (PostgreSQL,
          InnoDB) are binary search applied hierarchically.
        </p>
        <p className="mb-4">
          For networked / distributed systems, binary search appears as <strong>range
          partitioning</strong>: given a distributed sorted dataset, the coordinator binary
          searches partition boundaries to route a query to the right shard. This is a 1-level
          binary search over shard metadata, then a local search within the shard. Spark, Kafka,
          and DynamoDB all use this pattern.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <h3 className="text-xl font-semibold mt-6 mb-3">vs. Linear Search</h3>
        <p className="mb-4">
          O(log n) vs O(n). Binary requires sorted input; linear does not. For small n (&lt; 64)
          linear is faster because of branch prediction and prefetching. Binary wins decisively
          for n &gt; 1000.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">vs. Hash Lookup</h3>
        <p className="mb-4">
          Hash is O(1) expected; binary is O(log n). Hash needs preprocessing + hash function
          (15–20 cycles). For n &lt; 32, binary can match hash; for n &gt; 1000, hash dominates. Binary
          preserves order — enables range queries (&quot;all values in [a,b]&quot;), predecessor /
          successor, order statistics. Hash does not. Choose hash for point lookups, binary for
          range and order.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">vs. Balanced BST</h3>
        <p className="mb-4">
          Both O(log n). Arrays with binary search have better cache behavior due to contiguity;
          BSTs support dynamic insertion/deletion in O(log n). Sorted-array binary search is the
          right choice for static or bulk-updated data; BST for mutable data with interleaved
          ops.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">vs. Interpolation Search</h3>
        <p className="mb-4">
          Interpolation is O(log log n) expected on uniform distributions but O(n) worst case.
          Binary is O(log n) always. Use interpolation when data is known to be uniform
          (timestamps, auto-incrementing IDs); binary otherwise.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Use <code>mid = lo + (hi − lo) / 2</code></strong> — not <code>(lo + hi) / 2</code>. Avoids integer overflow.</li>
          <li><strong>Half-open interval [lo, hi)</strong> with <code>hi = mid</code> / <code>lo = mid + 1</code> is the cleanest template — memorize it.</li>
          <li><strong>Define the predicate explicitly</strong> for lower_bound-style problems. &quot;First index where P is true&quot; generalizes all variants.</li>
          <li><strong>Use std::lower_bound / bisect_left / Collections.binarySearch</strong> rather than hand-rolling — standard libs are tested and correct.</li>
          <li><strong>For reals, run fixed iterations</strong> (60–100) rather than converging to equality.</li>
          <li><strong>Eytzinger layout</strong> for large static datasets — 2–3× faster than sorted-array binary search.</li>
          <li><strong>Parametric search pattern</strong>: when minimizing/maximizing a value subject to a monotonic check, binary-search the answer.</li>
          <li><strong>Combine with exponential search</strong> for unbounded or streaming data where array length is unknown.</li>
          <li><strong>Branchless CMOV</strong> when writing performance-critical C/C++ on uniformly random queries.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Integer overflow in midpoint</strong>: <code>(lo + hi) / 2</code> overflows for lo + hi &gt; 2³¹. Use <code>lo + (hi − lo) / 2</code>.</li>
          <li><strong>Infinite loop from incorrect update</strong>: e.g., <code>lo = mid</code> instead of <code>lo = mid + 1</code> with condition <code>lo &lt; hi</code>.</li>
          <li><strong>Off-by-one returning wrong index</strong>: exact-match template vs lower_bound template differ by one step; conflating them gives wrong answers on edge cases.</li>
          <li><strong>Searching unsorted input</strong>: binary search silently produces garbage. Always verify sort invariant upstream.</li>
          <li><strong>Floating-point termination loops</strong>: <code>while (lo &lt; hi)</code> can loop forever on reals; use fixed iterations.</li>
          <li><strong>Stable-sort dependence</strong>: if array has duplicates and you want the first, lower_bound; if last, upper_bound minus one. Getting these swapped is common.</li>
          <li><strong>Parametric search with non-monotonic predicate</strong>: binary search requires monotonicity. Verify before applying.</li>
          <li><strong>Assuming O(log n) is always fast</strong>: on small n, log n constants hurt; linear wins.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <p className="mb-4">
          <strong>Database B-tree indices</strong>: PostgreSQL btree, InnoDB B+ tree, SQLite
          B-tree. Every indexed query does a logarithmic-depth binary search. The default index
          type in every relational DB.
        </p>
        <p className="mb-4">
          <strong>Rate limiters &amp; scheduling</strong>: parametric binary search finds the
          minimum rate/capacity satisfying SLO. Google Borg, Kubernetes scheduler, AWS
          auto-scaling all use this pattern.
        </p>
        <p className="mb-4">
          <strong>Git packfile index</strong>: sorted array of object hashes; binary search for
          object lookup. Every <code>git show</code> does log₂(objects) comparisons.
        </p>
        <p className="mb-4">
          <strong>Kafka log retrieval</strong>: messages indexed by offset; binary search the
          index file to locate a byte offset for a given message offset.
        </p>
        <p className="mb-4">
          <strong>Compiler symbol tables</strong>: sorted arrays of symbols with binary search
          lookup. Clang&apos;s scope lookup uses this pattern for small scopes.
        </p>
        <p className="mb-4">
          <strong>Binary heaps &amp; priority queues</strong>: heap property is maintained via
          sift-down, which uses implicit binary search of child positions.
        </p>
        <p className="mb-4">
          <strong>Animation easing inversion</strong>: given target y, find t such that y = bezier(t).
          Binary search t ∈ [0,1]. Flash, After Effects, CSS transitions.
        </p>
        <p className="mb-4">
          <strong>Financial yield-to-maturity</strong>: solve for the yield that makes present
          value equal current price via binary search. Every bond pricing tool implements it.
        </p>
        <p className="mb-4">
          <strong>Networking route lookup</strong>: longest-prefix-match via trie + binary
          search-on-prefix-length (LC-trie, SAIL). Linux kernel&apos;s fib_trie.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/binary-search-diagram-3.svg"
          alt="Parametric binary search finding minimum shipping capacity to satisfy deadline"
          caption="Parametric search: binary-search the answer over a monotonic feasibility predicate. Standard pattern for optimization."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li><strong>Implement binary search (exact match).</strong> Half-open interval, mid = lo + (hi−lo)/2, lo &lt; hi loop.</li>
          <li><strong>Implement lower_bound / upper_bound.</strong> First index ≥ target / first index &gt; target.</li>
          <li><strong>Count occurrences of target.</strong> upper_bound − lower_bound.</li>
          <li><strong>Find first and last positions of target.</strong> Two binary searches.</li>
          <li><strong>Search in rotated sorted array.</strong> Binary search with an extra check on which half is sorted.</li>
          <li><strong>Find peak in unimodal array.</strong> Binary search based on neighbor comparison.</li>
          <li><strong>Square root by binary search.</strong> Search x in [0, n] for x² ≤ n.</li>
          <li><strong>Parametric: minimum capacity to ship within d days.</strong> Binary search cap; check feasibility in O(n).</li>
          <li><strong>Median of two sorted arrays.</strong> Binary search partition index — classic O(log(min(m,n))) algorithm.</li>
          <li><strong>Why does <code>(lo + hi) / 2</code> have a bug?</strong> Integer overflow; use <code>lo + (hi − lo) / 2</code>.</li>
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>CLRS Chapter 12 (BSTs, tree-based binary search) and problem sets on parametric search.</li>
          <li>Joshua Bloch, &quot;Extra, Extra — Read All About It: Nearly All Binary Searches and Mergesorts are Broken&quot; (2006) — the integer-overflow bug.</li>
          <li>Knuth TAOCP Vol. 3, §6.2.1 — exhaustive treatment including Eytzinger and cache analysis.</li>
          <li>Bentley, <em>Programming Pearls</em> Chapter 9 — classic introduction.</li>
          <li>Paul-Virak Khuong &amp; Pat Morin, &quot;Array Layouts for Comparison-Based Searching&quot; (2017) — Eytzinger analysis.</li>
          <li>Cormen, &quot;Binary Search on Reals&quot; notes — fixed-iteration convergence technique.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
