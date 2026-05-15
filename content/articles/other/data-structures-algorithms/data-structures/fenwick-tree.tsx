"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-other-dsa-data-structures-fenwick-tree",
  title: "Fenwick Tree (Binary Indexed Tree)",
  description:
    "The Fenwick tree (BIT) gives O(log n) prefix sum queries and point updates using only an n-length array — the workhorse behind inversion counting, order statistics, and mutable range sum queries.",
  category: "other",
  subcategory: "data-structures-algorithms",
  slug: "fenwick-tree",
  wordCount: 2800,
  readingTime: 11,
  lastUpdated: "2026-05-15",
  tags: [
    "fenwick-tree",
    "binary-indexed-tree",
    "prefix-sum",
    "range-queries",
    "data-structures",
  ],
  relatedTopics: ["segment-tree", "arrays", "prefix-sum"],
};

export default function FenwickTreeArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ------------------------------------------------------------------ */}
      {/* 1. Definition & Context                                             */}
      {/* ------------------------------------------------------------------ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition &amp; Context</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: a Fenwick tree (Binary Indexed Tree, BIT) is the
          go-to answer whenever an interviewer asks for mutable prefix sums,
          inversion counting, or order statistics in O(log n) time and O(n)
          space. Know lowbit, the query loop, and the update loop cold — they
          are short but non-obvious, and interviewers will ask you to derive
          them from scratch.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important" className="mb-4">
          A Fenwick tree is a flat array of n&nbsp;+&nbsp;1 integers (index 0
          is unused) that implicitly encodes a tree over a sequence of values.
          Each cell BIT[i] does not store the raw value at position i — it
          stores the sum of a contiguous subrange of the original array, where
          the length of that subrange is determined entirely by the binary
          representation of i. This encoding lets prefix sum queries and point
          updates both run in O(log n) time using nothing but integer addition
          and a single bitwise operation.
        </HighlightBlock>
        <p className="mb-4">
          Peter Fenwick introduced the structure in a 1994 paper titled
          &quot;A New Data Structure for Cumulative Frequency Tables.&quot; The
          motivation was statistical: he needed a compact, cache-friendly way to
          maintain cumulative frequency distributions in arithmetic coding, where
          frequencies change as new symbols arrive. The result turned out to be
          far more general and is now one of the most frequently asked data
          structures in competitive programming and technical interviews at
          product companies.
        </p>
        <p className="mb-4">
          Reach for a Fenwick tree when you have an array of numbers that gets
          point updates (change a single element) and you also need prefix sum
          queries (sum from index 1 to i) repeatedly. Classic triggers: counting
          inversions in an array in O(n log n), answering &quot;how many
          elements smaller than x have appeared so far&quot; in a stream,
          computing rank in an order-statistics problem, or solving LeetCode 307
          (Range Sum Query — Mutable). If the operation is not invertible (e.g.,
          range minimum), prefer a segment tree instead.
        </p>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 2. Core Concept: lowbit                                             */}
      {/* ------------------------------------------------------------------ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concept: lowbit</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: lowbit(i) = i &amp; (−i) is the single operation
          that makes the entire BIT work. Be ready to explain what it extracts
          and why negation in two&apos;s complement isolates the lowest set bit.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important" className="mb-4">
          The expression lowbit(i) extracts the value of the lowest set bit of
          i. In two&apos;s complement, −i is formed by flipping all bits and
          adding 1. The AND with i cancels every bit above the lowest set bit
          (because they differ in sign and original) and preserves exactly the
          lowest set bit position. The result is always a power of two: 1, 2, 4,
          8, 16, and so on.
        </HighlightBlock>
        <p className="mb-4">
          This value is the length of the subrange that BIT[i] is responsible
          for. Consider i&nbsp;=&nbsp;6, which is 110 in binary. lowbit(6) = 6
          &amp; (−6) = 110 &amp; 010 = 010 = 2. So BIT[6] covers 2 elements:
          positions 5 and 6. Now consider i&nbsp;=&nbsp;8, which is 1000.
          lowbit(8) = 8. BIT[8] covers 8 elements: positions 1 through 8. As i
          increases and gains trailing zeros, it takes responsibility for
          exponentially larger subranges — mirroring the hierarchical nature of
          a binary tree without storing any explicit pointers.
        </p>
        <p className="mb-4">
          A few more concrete examples make the pattern clear. lowbit(1) = 1, so
          BIT[1] covers exactly [1, 1] — just the element at index 1.
          lowbit(4) = 4, so BIT[4] covers [1, 4]. lowbit(12) = 4, so BIT[12]
          covers [9, 12]. The general formula for the range BIT[i] covers is
          (i&nbsp;−&nbsp;lowbit(i)&nbsp;+&nbsp;1) through i. The query
          traversal strips one lowbit per step, walking toward 0; the update
          traversal adds one lowbit per step, walking toward n. These two
          complementary movements are the entire BIT algorithm.
        </p>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 3. BIT Structure                                                    */}
      {/* ------------------------------------------------------------------ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">BIT Structure</h2>
        <HighlightBlock as="p" tier="important" className="mb-4">
          The BIT is stored as a 1-indexed array of n&nbsp;+&nbsp;1 elements.
          BIT[0] is always 0 and is never read or written. BIT[i] holds the sum
          of the original array values at positions (i&nbsp;−&nbsp;lowbit(i)&nbsp;+&nbsp;1)
          through i. These ranges partition the prefix [1..n] into non-overlapping
          segments of lengths that are all powers of two, covering every position
          exactly once per &quot;tree level.&quot;
        </HighlightBlock>
        <p className="mb-4">
          It helps to visualize the BIT as a binary tree embedded in the flat
          array. Each even index i is a child; its parent is i&nbsp;+&nbsp;lowbit(i).
          The root of the tree (if n is a power of two) is BIT[n], which covers
          the entire array. Internal nodes aggregate sums from their subtrees.
          Leaf nodes (odd indices) are responsible for a single element each.
          The tree never stores pointers — the parent relationship is computed
          on the fly from the index itself.
        </p>
        <p className="mb-4">
          Building the BIT from scratch takes O(n&nbsp;log&nbsp;n) time using
          the naive approach of calling update(i, a[i]) for each index i from 1
          to n. A faster O(n) construction is possible by exploiting the parent
          relationship directly. Both approaches are correct; in interviews the
          naive build is perfectly acceptable because it is shorter to describe
          and the O(n&nbsp;log&nbsp;n) build is rarely the bottleneck in a
          one-time construction. The O(n) build becomes important when n is very
          large and the BIT is rebuilt frequently.
        </p>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 4. Prefix Sum Query                                                 */}
      {/* ------------------------------------------------------------------ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Prefix Sum Query</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: the query loop must visit O(log n) cells. The
          correctness argument is that i&nbsp;−&nbsp;lowbit(i) removes the
          lowest set bit, which decreases i strictly every iteration, and
          terminates at 0 after at most log₂(n) steps.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important" className="mb-4">
          To compute the prefix sum for [1..i]: initialize ans&nbsp;=&nbsp;0.
          While i&nbsp;&gt;&nbsp;0, add BIT[i] to ans, then set
          i&nbsp;=&nbsp;i&nbsp;−&nbsp;lowbit(i). When the loop exits, ans holds
          the exact sum of all original array values at positions 1 through the
          original i. Each iteration strips the lowest set bit of i, strictly
          decreasing it, so the loop terminates in at most log₂(n) iterations.
        </HighlightBlock>
        <p className="mb-4">
          Why is this correct? Each BIT[i] covers a non-overlapping subrange
          ending at i. When we subtract lowbit(i), the new index i&prime; is the
          largest index whose subrange ends immediately before the subrange we
          just added. The union of all subranges visited exactly covers [1..i]
          without gaps or overlaps. This is the tree traversal from a node to
          the root, but expressed in index arithmetic rather than pointer
          chasing.
        </p>
        <p className="mb-4">
          Range queries are built on top of prefix queries. To compute the sum
          of [l, r], use query(r)&nbsp;−&nbsp;query(l&nbsp;−&nbsp;1). This
          works because prefix sums are cumulative: sum[l..r]&nbsp;=
          sum[1..r]&nbsp;−&nbsp;sum[1..l−1]. The two prefix queries each take
          O(log&nbsp;n), so range queries are also O(log&nbsp;n). Watch out for
          the edge case l&nbsp;=&nbsp;1: query(l&nbsp;−&nbsp;1)&nbsp;=&nbsp;query(0)
          must return 0 — the loop condition i&nbsp;&gt;&nbsp;0 ensures it
          does.
        </p>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 5. Point Update                                                     */}
      {/* ------------------------------------------------------------------ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Point Update</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: the update loop adds lowbit(i) each step, so it
          climbs from a leaf toward the root of the implicit tree, touching all
          nodes whose coverage range includes position i. The number of such
          ancestors is O(log n).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important" className="mb-4">
          To add delta to position i in the original array: while i&nbsp;&le;&nbsp;n,
          add delta to BIT[i], then set i&nbsp;=&nbsp;i&nbsp;+&nbsp;lowbit(i).
          Continue until i exceeds n. Each ancestor of the updated position in
          the implicit tree must have its stored sum incremented by delta, and
          the loop visits exactly those ancestors. Adding lowbit(i) moves to the
          parent in the implicit tree.
        </HighlightBlock>
        <p className="mb-4">
          Consider updating position 3 (binary 011). lowbit(3) = 1, so the
          first step updates BIT[3] and moves to i&nbsp;=&nbsp;4 (binary 100).
          lowbit(4) = 4, so the next step updates BIT[4] and moves to
          i&nbsp;=&nbsp;8. lowbit(8) = 8, so BIT[8] is updated and i becomes 16,
          which exceeds n&nbsp;=&nbsp;8, ending the loop. Three updates for
          n&nbsp;=&nbsp;8 — exactly log₂(8). BIT[3] covers [3,3], BIT[4] covers
          [1,4], BIT[8] covers [1,8]: every prefix sum that includes position 3
          passes through at least one of these nodes, so all future queries
          automatically reflect the change.
        </p>
        <p className="mb-4">
          Point updates are destructive in the sense that the BIT stores
          cumulative sums, not individual values. If you need to read back the
          original value at position i, you must store the original array
          separately. If you need to set BIT[i] to an absolute value (rather
          than adding a delta), compute delta as (new value − old value) using
          the stored original array, then call update(i, delta).
        </p>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 6. Architecture & Flow                                              */}
      {/* ------------------------------------------------------------------ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture &amp; Flow</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: be able to draw the four quadrants of a BIT — the
          index-to-coverage mapping, the query traversal from right-to-left
          stripping bits, the update traversal from left-to-right adding bits,
          and the variants that extend the base pattern.
        </HighlightBlock>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/fenwick-tree-architecture.svg"
          alt="Four-quadrant diagram showing BIT structure and indexing, prefix sum query traversal, point update propagation, and variants with applications"
          caption="Figure 1: BIT architecture overview. Section A shows how lowbit determines each cell's coverage range. Section B traces query(6) through two BIT cells. Section C traces update(3) up three ancestor nodes. Section D lists variants and LeetCode applications."
        />
        <p className="mb-4">
          The BIT can be thought of as a complete binary tree with its nodes
          stored in a flat array using the implicit heap-style numbering. The
          key difference from a heap is that the parent of node i is
          i&nbsp;+&nbsp;lowbit(i) (not i/2), and the children are reached by
          subtracting lowbit rather than multiplying. This asymmetry is why the
          query loop (subtract) and update loop (add) are inverses of each other.
        </p>
        <p className="mb-4">
          In memory, the entire BIT fits in a contiguous array of n&nbsp;+&nbsp;1
          integers. All accesses during a query or update visit at most
          log₂(n)&nbsp;+&nbsp;1 cells, and they tend to have increasing or
          decreasing indices — a moderately cache-friendly access pattern
          compared to pointer-chasing in a linked segment tree. For n&nbsp;=&nbsp;10⁶
          the BIT fits in 4&nbsp;MB (32-bit ints) or 8&nbsp;MB (64-bit longs),
          a significant advantage over a segment tree that requires 4n nodes.
        </p>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 7. Build in O(n)                                                   */}
      {/* ------------------------------------------------------------------ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Build in O(n)</h2>
        <HighlightBlock as="p" tier="important" className="mb-4">
          The naive build calls update(i, a[i]) for each i from 1 to n,
          performing O(log n) work per element for a total of O(n log n). This
          is perfectly fine for one-time initialization and is the method most
          interviewers expect. The O(n) build is a bonus point in senior
          interviews.
        </HighlightBlock>
        <p className="mb-4">
          The O(n) construction works by exploiting the parent relationship
          directly. Initialize BIT[i] = a[i] for all i. Then iterate i from 1
          to n: compute the parent index j&nbsp;=&nbsp;i&nbsp;+&nbsp;lowbit(i).
          If j&nbsp;&le;&nbsp;n, add BIT[i] to BIT[j]. This single bottom-up
          pass propagates each cell&apos;s value to its immediate parent, which
          then propagates to its parent in the next iteration because we process
          i in increasing order. At the end, every BIT[i] holds the correct
          cumulative sum for its range.
        </p>
        <p className="mb-4">
          The O(n) build is analogous to the bottom-up heap construction: rather
          than inserting elements one by one (O(n log n)), you build from the
          leaves up, doing constant work per node. The crucial insight is that
          each cell is updated exactly once by its left child in the array order,
          because each node has exactly one child whose lowbit points to it in
          the forward direction. The total work is O(n) additions.
        </p>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 8. Variants                                                         */}
      {/* ------------------------------------------------------------------ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Variants</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: the four canonical BIT variants — 2D BIT, order
          statistics BIT, range-update&nbsp;+&nbsp;point-query, and
          range-update&nbsp;+&nbsp;range-query — cover the vast majority of
          senior-level BIT interview questions. Know which variant to reach for
          and why.
        </HighlightBlock>

        <h3 className="mb-2 mt-6 text-xl font-semibold">2D BIT</h3>
        <p className="mb-4">
          A 2D BIT handles prefix sum queries and point updates on an
          m&nbsp;×&nbsp;n matrix. The outer BIT iterates over rows with the
          standard lowbit loop; the inner BIT iterates over columns. Each
          update touches O(log m × log n) cells; each query also takes
          O(log m × log n). A 2D range query [r1,c1]&nbsp;to&nbsp;[r2,c2] uses
          inclusion-exclusion across four 2D prefix queries, just as the 1D
          range query uses two 1D prefix queries. Space is O(m × n). This is
          the approach for LeetCode 308 Range Sum Query 2D — Mutable.
        </p>

        <h3 className="mb-2 mt-6 text-xl font-semibold">
          Order Statistics (Rank Queries)
        </h3>
        <p className="mb-4">
          To find the rank of a value in a dynamically changing multiset,
          coordinate-compress the value space to [1..M] and maintain a BIT
          where BIT stores the frequency count of each compressed value. To
          insert value x, call update(compress(x), 1). To query the rank of x
          (how many elements in the set are &le;&nbsp;x), call query(compress(x)).
          Each operation is O(log M). This technique solves LeetCode 315 (Count
          Smaller Numbers After Self) and 493 (Reverse Pairs) by processing the
          array from right to left and querying before inserting.
        </p>

        <h3 className="mb-2 mt-6 text-xl font-semibold">
          Range Update &amp; Point Query
        </h3>
        <p className="mb-4">
          Standard BIT supports point updates and prefix-sum queries. To flip
          this to range updates (add delta to all elements in [l, r]) and point
          queries (read the value at index i), store a difference array in the
          BIT. A range update [l, r, delta] becomes two point updates:
          BIT.update(l, delta) and BIT.update(r&nbsp;+&nbsp;1, −delta). A point
          query at i becomes BIT.query(i), which sums the difference array up to
          i, recovering the actual value. This is O(log n) per operation and
          uses a single BIT.
        </p>

        <h3 className="mb-2 mt-6 text-xl font-semibold">
          Range Update &amp; Range Query
        </h3>
        <p className="mb-4">
          Supporting both range updates and range queries simultaneously requires
          two BITs, commonly called B1 and B2. The derivation uses the identity
          that the prefix sum after range updates can be expressed as a linear
          combination of two difference-array prefix sums. Specifically, update
          [l, r, delta] performs four operations: update B1 and B2 at both
          endpoints with carefully chosen coefficients involving the endpoint
          indices. A prefix query at i reads both BITs and combines their
          results. This doubles the constant factor but keeps both operations at
          O(log n). It is a senior-level topic that demonstrates deep BIT
          understanding.
        </p>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 9. Trade-offs vs Segment Tree                                       */}
      {/* ------------------------------------------------------------------ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">
          Trade-offs vs. Segment Tree
        </h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: the BIT vs. segment tree decision is a classic senior
          trade-off question. BIT wins on simplicity, constant factor, and
          space. Segment tree wins on generality — non-invertible operations and
          lazy propagation for range updates.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important" className="mb-4">
          BIT advantages: the implementation is 8–12 lines vs. 40–60 lines for
          a segment tree. The constant factor is roughly 2–4× lower because each
          BIT operation visits log n cells with simple index arithmetic, while a
          segment tree visits up to 4&nbsp;log&nbsp;n nodes with branch
          conditions. BIT uses O(n) space; a segment tree needs 4n nodes. BIT
          is cache-friendlier because its cells have predictable locality in a
          flat array.
        </HighlightBlock>
        <p className="mb-4">
          BIT limitations: the operation must be invertible. Sum and XOR are
          invertible — you can undo them with subtraction or XOR again. Minimum
          and maximum are not — if BIT[i] holds the minimum of a range and you
          increase one element of that range, you cannot compute the new minimum
          without inspecting all elements. For min/max range queries you must use
          a segment tree (or sparse table if updates are not needed). BIT also
          does not natively support lazy propagation, making range updates that
          affect many elements harder to express.
        </p>
        <p className="mb-4">
          A practical heuristic: if the problem involves prefix sums, inversions,
          or rank queries, reach for a BIT first — it is faster to write
          correctly under pressure. If the problem involves range minimum,
          range maximum, arbitrary associative operations, or range updates on
          non-invertible operations, use a segment tree. In timed interviews,
          a correct BIT solution in 5 minutes beats a buggy segment tree in 20
          minutes.
        </p>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 10. Best Practices                                                  */}
      {/* ------------------------------------------------------------------ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <HighlightBlock as="p" tier="important" className="mb-4">
          Always allocate the BIT array with size n&nbsp;+&nbsp;1 and use
          1-based indexing internally. If the problem gives you 0-indexed input,
          add 1 to every index before calling update or query. Forgetting this
          causes lowbit(0) = 0, which creates an infinite loop in the update
          direction and silently returns 0 for query(0) — subtle bugs that are
          hard to catch in testing.
        </HighlightBlock>
        <p className="mb-4">
          Use 64-bit integers (long in Java/C++, BigInt in JavaScript where
          native BIT implementations are rare) whenever the sum of all elements
          can exceed 2³¹&nbsp;−&nbsp;1. Array values of up to 10⁹ with n up to
          10⁵ already saturate a 32-bit int. In JavaScript or TypeScript, prefer
          a typed array (Int32Array or BigInt64Array) over a plain Array for
          cache-efficient access, though the ergonomic cost of BigInt64Array
          operations is significant — use Number carefully and validate your
          range.
        </p>
        <p className="mb-4">
          Build in O(n) when you have the full initial array before any queries
          arrive. In streaming problems where elements arrive one at a time,
          start with an all-zero BIT and call update on each arriving element.
          Prefer to initialize the BIT to zeros rather than leaving it
          uninitialized — many language runtimes do zero-initialize arrays, but
          relying on that is a portability risk in C++.
        </p>
        <p className="mb-4">
          When implementing the 2D BIT, iterate the outer loop first (rows) and
          the inner loop second (columns), matching the way you read the BIT
          conceptually as &quot;update the row BIT, and within that, update the
          column BIT.&quot; Swapping the loops produces the same result
          mathematically but is harder to reason about.
        </p>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 11. Common Pitfalls                                                 */}
      {/* ------------------------------------------------------------------ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>
        <HighlightBlock as="p" tier="important" className="mb-4">
          The single most common BIT bug is using 0-based indexing. lowbit(0)
          = 0 &amp; 0 = 0, so the update loop never terminates and the query
          loop immediately returns 0 for any index. Always shift input indices
          by&nbsp;+1 when translating 0-indexed problem constraints to the
          1-indexed BIT.
        </HighlightBlock>
        <p className="mb-4">
          Forgetting the range query formula is the second most common mistake.
          The prefix query gives sum [1..i]. To get sum [l..r], you must compute
          query(r)&nbsp;−&nbsp;query(l&nbsp;−&nbsp;1). Many candidates write
          query(r)&nbsp;−&nbsp;query(l), which is off by one and produces the
          sum [l+1..r] instead of [l..r]. This produces wrong answers that pass
          many test cases because the error only matters when l&nbsp;&gt;&nbsp;1.
        </p>
        <p className="mb-4">
          Integer overflow is subtle in prefix sum problems. If all array values
          are positive and close to INT_MAX, summing them in a 32-bit integer
          wraps around silently. Always estimate the maximum possible prefix sum
          — if n × max_value &gt; 2³¹ − 1, use a 64-bit accumulator.
        </p>
        <p className="mb-4">
          Using a BIT for minimum or maximum range queries is a conceptual error
          that produces incorrect results. Suppose BIT[4] stores the minimum of
          [1..4]. Now update position 2 with a larger value. BIT[4] = min(BIT[4
          elements]) is still the old minimum — but the old BIT[4] value is now
          stale and there is no way to recompute the correct minimum without
          scanning all four elements. The BIT update loop has no way to know
          whether increasing BIT[4] is correct without inspecting siblings. For
          range min/max, use a segment tree.
        </p>
        <p className="mb-4">
          Over-complicating the BIT by adding unnecessary data beyond what the
          problem needs is also common. A BIT that stores both the sum and the
          count separately is often cleaner as two independent BITs. Resist the
          temptation to pack everything into one structure — the code clarity
          benefit of two simple BITs far outweighs the minor constant-factor
          gain of one complex structure.
        </p>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 12. Real-World Use Cases                                            */}
      {/* ------------------------------------------------------------------ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>
        <HighlightBlock as="p" tier="important" className="mb-4">
          Counting inversions in an array is the canonical BIT application in
          algorithms. An inversion is a pair (i,&nbsp;j) where i&nbsp;&lt;&nbsp;j
          but a[i]&nbsp;&gt;&nbsp;a[j]. The O(n log n) BIT algorithm processes
          the array from right to left: for each element a[i], query the BIT for
          how many previously seen elements (which are to the right of i) are
          smaller than a[i] — that count is the number of inversions involving
          a[i]. Then insert a[i] into the BIT. Total inversions accumulate in a
          running counter. The BIT replaces the O(n²) brute force and also
          underlies efficient merge-sort-based inversion counting.
        </HighlightBlock>
        <p className="mb-4">
          Order statistics in data streams use a BIT over a compressed value
          space. A system that receives numerical events (latencies, prices,
          scores) and must answer &quot;what percentile is this value?&quot; in
          real time can maintain a BIT where the index is the compressed event
          value and the stored count is the frequency. Inserting a new value is
          update(value, 1) and querying its rank is query(value). This pattern
          appears in database engine histograms, monitoring systems tracking
          latency percentiles, and recommendation systems ranking item scores.
        </p>
        <p className="mb-4">
          Database engines use BIT-like cumulative frequency tables in their
          query optimizers to maintain column statistics. When estimating the
          selectivity of a predicate (e.g., &quot;how many rows have
          salary&nbsp;&lt;&nbsp;80000?&quot;), the optimizer consults a compact
          frequency histogram. As rows are inserted or deleted, the histogram
          updates incrementally using exactly the BIT update pattern. Full
          histogram rebuilds are expensive; BIT-style incremental maintenance
          keeps the statistics fresh.
        </p>
        <p className="mb-4">
          Competitive programming problems routinely use BITs for range sum
          queries on mutable arrays (LeetCode 307), counting smaller numbers
          after each element (LeetCode 315), counting reverse pairs (LeetCode
          493), and 2D range sum queries with updates (LeetCode 308). Understanding
          the BIT is a prerequisite for advanced algorithmic problems involving
          offline processing with coordinate compression, persistent data
          structures, and divide-and-conquer with BIT subroutines.
        </p>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 13. Interview Questions                                             */}
      {/* ------------------------------------------------------------------ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Interview Questions</h2>

        {/* Q1 */}
        <div className="mb-8">
          <h3 className="mb-2 text-lg font-semibold">
            Q1 (Junior–Mid): What does lowbit(i) compute and why is it the key
            to the Fenwick tree?
          </h3>
          <HighlightBlock as="p" tier="important">
            lowbit(i) = i &amp; (−i) extracts the value of the lowest set bit
            of i. In two&apos;s complement, −i is the bitwise NOT plus 1. The
            AND cancels all higher bits (they differ between i and −i) and
            preserves exactly the bit where the carry stopped propagating — the
            lowest set bit. The result is a power of two equal to the length of
            the subrange BIT[i] is responsible for. Subtracting lowbit in the
            query loop strips one bit per step, visiting O(log n) ancestors
            toward 0. Adding lowbit in the update loop moves up one level per
            step toward n. The entire BIT algorithm is these two complementary
            loops, both powered by lowbit.
          </HighlightBlock>
        </div>

        {/* Q2 */}
        <div className="mb-8">
          <h3 className="mb-2 text-lg font-semibold">
            Q2 (Mid): Walk through implementing a prefix sum query and point
            update on a BIT without writing code.
          </h3>
          <HighlightBlock as="p" tier="important">
            Prefix sum query(i): start ans at 0. While i is greater than 0, add
            BIT[i] to ans and then subtract lowbit(i) from i. Return ans. Each
            iteration strips the lowest set bit, strictly decreasing i, so the
            loop terminates in at most log₂(n) steps. The ranges covered by the
            visited cells are non-overlapping and their union exactly equals
            [1..i].
          </HighlightBlock>
          <HighlightBlock as="p" tier="important">
            Point update(i, delta): while i is at most n, add delta to BIT[i]
            and then add lowbit(i) to i. Each iteration moves to the parent
            node — the next cell whose range includes position i. All ancestors
            of position i in the implicit tree are updated, so every future
            prefix query that spans position i will incorporate the delta.
            Both operations are O(log n).
          </HighlightBlock>
        </div>

        {/* Q3 */}
        <div className="mb-8">
          <h3 className="mb-2 text-lg font-semibold">
            Q3 (Mid–Senior): How do you count inversions in an array using a
            BIT? Walk through the algorithm.
          </h3>
          <HighlightBlock as="p" tier="important">
            An inversion is a pair (i,&nbsp;j) with i&nbsp;&lt;&nbsp;j but
            a[i]&nbsp;&gt;&nbsp;a[j]. The BIT approach: coordinate-compress the
            values to [1..n]. Initialize an all-zero BIT of size n&nbsp;+&nbsp;1.
            Process the array from right to left. For each element a[i], query
            the BIT for the prefix sum at compress(a[i])&nbsp;−&nbsp;1 — this
            counts how many elements to the right of i are strictly smaller than
            a[i], which is exactly the number of inversions involving position i
            as the left element. Add this count to the running total. Then call
            update(compress(a[i]),&nbsp;1) to record that a[i] has been seen.
            After processing all elements, the total is the inversion count.
            Time: O(n&nbsp;log&nbsp;n), Space: O(n). This is the algorithm
            behind LeetCode 315 (Count Smaller Numbers After Self) and 493
            (Reverse Pairs, with a modified query range).
          </HighlightBlock>
        </div>

        {/* Q4 */}
        <div className="mb-8">
          <h3 className="mb-2 text-lg font-semibold">
            Q4 (Senior): When would you choose a BIT over a segment tree? When
            would you choose the segment tree?
          </h3>
          <HighlightBlock as="p" tier="important">
            Choose BIT when: the operation is sum (or XOR or any invertible
            group operation), you need only point updates and prefix/range
            queries, implementation time is limited (BIT is 8–12 lines vs.
            40–60 for segment tree), or you need minimal memory (BIT is exactly
            n&nbsp;+&nbsp;1 cells vs. segment tree&apos;s 4n nodes). The BIT
            constant factor is 2–4× lower.
          </HighlightBlock>
          <HighlightBlock as="p" tier="important">
            Choose segment tree when: the operation is non-invertible (min, max,
            GCD, product with modular arithmetic under division), you need lazy
            propagation for range updates on non-invertible operations, or you
            need to query arbitrary non-prefix ranges efficiently with complex
            aggregate operations. Segment trees are strictly more powerful;
            BITs are a faster-to-code specialization for invertible prefix
            aggregates.
          </HighlightBlock>
        </div>

        {/* Q5 */}
        <div className="mb-8">
          <h3 className="mb-2 text-lg font-semibold">
            Q5 (Senior): Design a BIT that supports both range updates (add
            delta to [l, r]) and range queries (sum [l, r]) simultaneously.
          </h3>
          <HighlightBlock as="p" tier="important">
            This requires two BITs, call them B1 and B2. The derivation starts
            from the identity that the prefix sum after a range update [l, r,
            delta] can be written as delta × i − delta × (l − 1) for i in [l,
            r]. This decomposes into two linear terms in i, which can be tracked
            by two BITs.
          </HighlightBlock>
          <HighlightBlock as="p" tier="important">
            For a range update [l, r, delta]: update B1 at l with delta, at
            r&nbsp;+&nbsp;1 with −delta; update B2 at l with delta × (l − 1),
            at r&nbsp;+&nbsp;1 with −delta × r. For a prefix query at index i:
            return B1.query(i) × i − B2.query(i). The range query [l, r] is
            prefix(r) − prefix(l − 1). Both operations are O(log n). This is
            a dual-BIT technique that is well-known in competitive programming
            and signals strong BIT mastery to an interviewer.
          </HighlightBlock>
        </div>

        {/* Q6 */}
        <div className="mb-8">
          <h3 className="mb-2 text-lg font-semibold">
            Q6 (Staff): Extend the BIT to 2D for range sum queries on a matrix
            with point updates. Analyze the complexity.
          </h3>
          <HighlightBlock as="p" tier="important">
            A 2D BIT is an m × n matrix where BIT2D[i][j] stores the sum of a
            2D rectangular subrange. For a point update at (r, c, delta):
            iterate the outer BIT loop over rows (i = r; i &le; m; i +=
            lowbit(i)) and inside each outer step run the column BIT loop (j =
            c; j &le; n; j += lowbit(j)), adding delta to BIT2D[i][j]. Each
            update touches O(log m × log n) cells.
          </HighlightBlock>
          <HighlightBlock as="p" tier="important">
            For a 2D prefix query at (r, c): iterate outer rows (i = r; i &gt;
            0; i −= lowbit(i)) and inside each step run the column query loop
            (j = c; j &gt; 0; j −= lowbit(j)), accumulating BIT2D[i][j]. A
            2D range query for rectangle [r1,c1] to [r2,c2] uses
            inclusion-exclusion: prefixQuery(r2, c2) − prefixQuery(r1 − 1, c2)
            − prefixQuery(r2, c1 − 1) + prefixQuery(r1 − 1, c1 − 1). Time
            per operation: O(log m × log n). Space: O(m × n). For m&nbsp;=&nbsp;n
            = 10³, this is about 100 BIT cell accesses per operation — very
            fast in practice and solves LeetCode 308 efficiently.
          </HighlightBlock>
        </div>
      </section>
    </ArticleLayout>
  );
}
