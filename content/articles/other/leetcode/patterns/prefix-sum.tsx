"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "prefix-sum",
  title: "Prefix Sum Pattern",
  description:
    "Linear preprocessing that turns range-sum queries into O(1) lookups, and — combined with a hash map — collapses an entire family of subarray-sum-equals-k problems from O(n²) to O(n).",
  category: "other",
  subcategory: "patterns",
  slug: "prefix-sum",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-26",
  tags: ["prefix-sum", "leetcode", "patterns", "range-query", "subarray"],
  relatedTopics: ["sliding-window", "hash-table", "two-pointer"],
};

export default function PrefixSumArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
      <p className="mb-4">
        Prefix sum is a one-pass preprocessing transform on an array A that exposes any contiguous range-sum as a
        difference of two scalar values. Define P[0] = 0 and P[i] = A[0] + A[1] + ... + A[i − 1]. The array P has
        length n + 1 and obeys the identity sum(A[l..r]) = P[r + 1] − P[l]. Building P is a single forward pass in
        O(n) time and O(n) space; thereafter, any range-sum query is one subtraction.
      </p>
      <p className="mb-4">
        The pattern matters because a surprising number of interview problems reduce to range-sum queries — sometimes
        explicitly (&quot;sum of A[l..r]&quot;), more often after reformulation. &quot;Count subarrays summing to k&quot;
        becomes &quot;count pairs (l, r) with P[r] − P[l] = k&quot; which becomes &quot;count pairs of equal-difference
        prefix values&quot; — a hash-map problem. &quot;Equal number of 0s and 1s&quot; becomes &quot;subarray of
        mapped values summing to 0&quot;. &quot;Divisible by k&quot; becomes &quot;equal remainders mod k&quot;. The
        recognition skill is mapping the surface problem to a prefix-sum equivalent.
      </p>
      <p className="mb-4">
        Recognition signals are concrete. Many range-sum queries on a static array — build P once. Subarray
        constraint involving a sum, count, or running aggregate, especially with negatives — prefix + hash. Range
        updates that you can defer until all updates are queued — difference array, the inverse pattern. 2D range
        queries on an immutable matrix — 2D prefix with the four-corner inclusion-exclusion formula. If the array is
        mutable and queries are interleaved, prefix sum no longer suffices and you escalate to a Fenwick tree or
        segment tree.
      </p>
      <p className="mb-4">
        For staff interviews, prefix sum is the bridge from naive O(n²) subarray scans to clean O(n) solutions, and
        the warm-up to harder structures (Fenwick, segment, sparse table). The interview wins come from spotting the
        reformulation quickly — &quot;subarray with sum k&quot; should immediately surface &quot;prefix + hash&quot;
        without a stall.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
      <p className="mb-4">
        <strong>The (n + 1)-length convention.</strong> Always allocate P with length n + 1 and set P[0] = 0. This
        eliminates the boundary case for subarrays that start at index 0 and makes the formula uniform: sum(A[l..r])
        = P[r + 1] − P[l]. Skipping P[0] = 0 forces an &quot;if l == 0&quot; branch in every query and is a frequent
        off-by-one source. The convention also matches how subarray-sum-equals-k initialises the hash map with
        {`{0: 1}`} — the empty prefix is a real prefix value and must be counted.
      </p>
      <p className="mb-4">
        <strong>Subarray = difference of prefixes.</strong> The single most useful fact: any contiguous-range
        aggregate over a group operation (sum, XOR, additive count) equals the difference of two prefix values. For
        sum, difference is subtraction. For XOR, difference is XOR (since XOR is its own inverse). For count of a
        token, difference is subtraction over per-prefix counts. The pattern generalises to any invertible monoid
        operation; it does not generalise to non-invertible aggregates like max or min — those need different
        structures (sparse tables for static, segment trees for mutable).
      </p>
      <p className="mb-4">
        <strong>Prefix + hash for subarray-sum-equals-k.</strong> Given target k, count subarrays with sum k. Walk a
        single index i from 0 to n building P incrementally. Before incrementing the map, look up map[P[i] − k] —
        every previous prefix with that value gives a subarray ending at i with sum k. After the lookup, increment
        map[P[i]]. Initialise with {`{0: 1}`} so prefixes equal to k themselves count. This template handles
        negatives naturally (where sliding window fails) because monotonicity of the sum is not required.
      </p>
      <p className="mb-4">
        <strong>2D prefix sum.</strong> For an m×n matrix, define P[i][j] = sum of submatrix [0..i − 1, 0..j − 1].
        Build with P[i][j] = P[i − 1][j] + P[i][j − 1] − P[i − 1][j − 1] + A[i − 1][j − 1] in O(mn). Query
        sum([r1..r2, c1..c2]) = P[r2 + 1][c2 + 1] − P[r1][c2 + 1] − P[r2 + 1][c1] + P[r1][c1] in O(1). The
        inclusion-exclusion mirrors the 1D case but with two boundaries to subtract and one corner to add back.
      </p>
      <p className="mb-4">
        <strong>Difference array (the inverse).</strong> If you have many range updates of the form &quot;add v to
        A[l..r]&quot; and queries are deferred until the end, build a difference array D where D[l] += v and D[r +
        1] −= v for each update. After all updates, prefix-sum D once to get the final A. This turns a naive O(qn)
        algorithm into O(q + n). It only works when queries are batched after updates — interleaved updates and
        queries need a Fenwick tree.
      </p>
      <p className="mb-4">
        <strong>Complexity.</strong> Build O(n) time and O(n) space. Query O(1). For prefix + hash variants, total is
        O(n) time, O(n) space (the hash map). 2D analogues are O(mn) build, O(1) query. Compare to brute force: a
        nested O(n²) scan over (l, r) pairs becomes a single O(n) sweep — for n = 10⁵, that is the difference between
        timing out and finishing in milliseconds.
      </p>

      <ArticleImage
        src="/diagrams/other/leetcode/patterns/prefix-sum-diagram-1.svg"
        alt="Prefix sum range-query identity"
        caption="Definition and worked example: P[r + 1] − P[l] gives sum(A[l..r]) in O(1)."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
      <p className="mb-4">
        <strong>Static range-sum template.</strong> Allocate P of size n + 1 with P[0] = 0. Loop i from 0 to n − 1
        setting P[i + 1] = P[i] + A[i]. To answer query (l, r), return P[r + 1] − P[l]. The whole template is four
        lines and answers any number of range-sum queries in O(1) each. This is the answer to Leetcode 303 (Range
        Sum Query — Immutable) and the foundation for all variants.
      </p>
      <p className="mb-4">
        <strong>Subarray-sum-equals-k template.</strong> Initialise count = 0, sum = 0, map = {`{0: 1}`}. For each
        x in A: sum += x; count += map.get(sum − k, 0); map[sum] = map.get(sum, 0) + 1. Return count. The map maps
        prefix-value to number-of-indices-with-that-prefix. The lookup happens before the increment so we don&apos;t
        count zero-length subarrays. The {`{0: 1}`} seed handles prefixes equal to k.
      </p>
      <p className="mb-4">
        <strong>Variant: subarray sum divisible by k.</strong> Replace the key with sum mod k (handle negative sum
        with ((sum mod k) + k) mod k). Two prefixes with the same remainder bracket a subarray whose sum is a
        multiple of k. Same hash-map skeleton, same O(n).
      </p>
      <p className="mb-4">
        <strong>Variant: longest subarray with property.</strong> Switch from counting to longest. Map prefix-value
        to first-index-seen (not count). For each i, if (sum − target) is in the map, candidate length is i −
        map[sum − target]; record the max. Only insert sum into the map if it is not already present (we want the
        earliest index for the longest window). Leetcode 525 (Contiguous Array) and 1124 (Longest Well-Performing
        Interval) follow this template.
      </p>
      <p className="mb-4">
        <strong>2D prefix template.</strong> Build the (m + 1) × (n + 1) prefix matrix with the inclusion-exclusion
        recurrence. Queries use four lookups and one combination. Used in 304 (Range Sum Query 2D), 1314 (Matrix
        Block Sum), and as a subroutine in 363 (Max Sum of Rectangle No Larger Than K, where the 2D prefix reduces
        to a 1D prefix-plus-binary-search per column pair).
      </p>
      <p className="mb-4">
        <strong>Difference-array template.</strong> Allocate D of size n + 1 zero-filled. For each update (l, r, v):
        D[l] += v; D[r + 1] −= v. After all updates, prefix-sum D in place to get the final array. Used in 1109
        (Corporate Flight Bookings) and 1854 (Maximum Population Year). Two-dimensional variants (range updates on
        a matrix) extend the same idea with the four-corner pattern.
      </p>
      <p className="mb-4">
        <strong>Tree path prefix.</strong> 437 (Path Sum III) generalises prefix sum to root-to-node paths in a
        tree. DFS down the tree maintaining a hash map of root-to-current prefix sums. At each node, look up
        map[currentSum − target] before recursing, increment map[currentSum] before children, decrement after
        children to keep the map scoped to the current path. Same algebra, traversal-aware bookkeeping.
      </p>

      <ArticleImage
        src="/diagrams/other/leetcode/patterns/prefix-sum-diagram-2.svg"
        alt="Prefix sum with hash map for subarray sum equals k"
        caption="Reformulation of subarray-sum-k as a hash-map count over prefix values, with common variants."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
      <p className="mb-4">
        <strong>Prefix sum vs. sliding window.</strong> Sliding window requires monotonicity: extending the window
        must not flip a satisfied predicate, and shrinking must not flip a violated one. With non-negative values
        and a sum threshold, monotonicity holds — sliding window is O(n) with O(1) extra space. With negatives,
        adding an element can decrease the sum, breaking monotonicity. Prefix + hash works regardless of sign at the
        cost of O(n) extra space. Default to sliding window when the array is non-negative; reach for prefix +
        hash the moment negatives appear or the predicate is &quot;exact equality&quot; rather than &quot;at most&quot;.
      </p>
      <p className="mb-4">
        <strong>Prefix sum vs. Fenwick / segment tree.</strong> Prefix sum is for static arrays — build once, query
        many times. If updates are interleaved with queries, every update invalidates O(n) prefix entries and the
        amortisation collapses. Fenwick (Binary Indexed Tree) gives O(log n) update and O(log n) query with similar
        code complexity. Segment tree generalises to non-invertible aggregates (max, min, gcd) at O(log n) per op.
        Use prefix sum for offline / immutable, Fenwick for sum with updates, segment tree for max-with-updates or
        custom monoids.
      </p>
      <p className="mb-4">
        <strong>Prefix sum vs. brute-force nested loop.</strong> The nested loop computes sum(A[l..r]) for every
        pair in O(n²). Prefix sum collapses the inner work to O(1). For n = 10⁴ the brute force runs in ~10⁸ ops
        (1 second in C++, timeout in Python). Prefix sum runs in 10⁴ ops (microseconds). On Leetcode the constraint
        n ≤ 10⁵ is the universal signal that O(n²) will TLE and you need the linear reformulation.
      </p>
      <p className="mb-4">
        <strong>Prefix sum vs. cumulative max / min.</strong> The pattern of &quot;maintain a running aggregate as
        you sweep&quot; generalises beyond sum. Cumulative max from the left and from the right is the basis of
        problems like 42 (Trapping Rain Water) and 238 (Product of Array Except Self). The technique is the same —
        precompute side-aggregates in O(n), query in O(1) — but it is not invertible, so you cannot do range
        queries, only at-index queries.
      </p>
      <p className="mb-4">
        <strong>1D prefix + binary search vs. 2D prefix.</strong> For &quot;max sum rectangle ≤ k&quot;, the 2D
        prefix gives all rectangle sums but enumerating them is O(m²n²). The standard trick is fix two row
        boundaries (O(m²)), collapse columns into a 1D array, then run subarray-sum-≤-k via prefix + sorted set in
        O(n log n). The 2D structure is a stepping stone; the work is in the 1D reduction.
      </p>
      <p className="mb-4">
        <strong>Prefix sum vs. dynamic programming.</strong> For some problems both work — e.g., longest subarray
        with sum k can be cast as DP over (index, sum) but the state explodes. Prefix + hash is the same recurrence
        compressed into O(n) memory. When the DP state has the form &quot;some property of all subarrays ending
        here&quot; and the property is invertible, prefix sum is almost always the better tool.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
      <p className="mb-4">
        <strong>Use the (n + 1)-length convention.</strong> Always allocate P with length n + 1 and seed P[0] = 0.
        It removes one off-by-one class entirely. The same logic seeds the hash map with {`{0: 1}`} in
        subarray-count problems — the empty prefix is a real prefix.
      </p>
      <p className="mb-4">
        <strong>Look up before you increment the map.</strong> In subarray-sum-equals-k, the order is: compute
        current prefix, look up (prefix − k) in the map, then update map[prefix]. Reversing the order double-counts
        zero-length subarrays and produces wrong answers when k = 0. The order is part of the template; commit it
        to muscle memory.
      </p>
      <p className="mb-4">
        <strong>Track first-index for &quot;longest&quot;, count for &quot;count&quot;.</strong> Two map shapes serve
        two question shapes. For counting subarrays, store prefix → number of occurrences and sum the counts. For
        longest subarray, store prefix → first index seen (and only insert if absent). Mixing the two is the most
        common bug — the longest variant inserts unconditionally and reports wrong lengths.
      </p>
      <p className="mb-4">
        <strong>Normalise modular keys.</strong> For divisibility variants, always normalise sum mod k to
        non-negative: ((sum mod k) + k) mod k. Languages that allow negative mod results (Python is fine, C++ /
        Java need normalisation) silently produce wrong answers otherwise. Test with a negative-heavy input.
      </p>
      <p className="mb-4">
        <strong>Reuse prefix structures across queries.</strong> Build P once if many queries arrive. Don&apos;t
        rebuild inside a per-query loop — that&apos;s the trap that turns O(n + q) into O(nq). For 304 (2D Range
        Sum), the prefix matrix is built once in the constructor and queried in O(1) per call.
      </p>
      <p className="mb-4">
        <strong>Reach for difference array when range updates are batched.</strong> If the problem queues range
        updates and asks for the final state once, the difference array is O(q + n) instead of O(qn). Recognise
        the signal: &quot;apply k operations of the form (l, r, v) and return the final array&quot; — that is
        always difference + prefix.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
      <p className="mb-4">
        <strong>Off-by-one in range queries.</strong> sum(A[l..r]) = P[r + 1] − P[l]. The +1 on the right is
        non-negotiable. Writing P[r] − P[l] excludes A[r] and produces the wrong sum. The (n + 1)-length convention
        forces the +1 to land naturally because P is sized n + 1 and indexed up to n.
      </p>
      <p className="mb-4">
        <strong>Forgetting the {`{0: 1}`} seed.</strong> Without the seed, subarray-sum-equals-k misses every
        subarray that starts at index 0 and sums to k — the prefix value k looks up an absent key and contributes
        nothing. Always seed.
      </p>
      <p className="mb-4">
        <strong>Misordering map operations.</strong> Lookup before increment is mandatory. Reverse the order and
        a subarray of length 0 (which has sum 0) gets counted whenever k = 0, inflating the answer.
      </p>
      <p className="mb-4">
        <strong>Using sliding window with negatives.</strong> Sliding window assumes adding an element grows the
        sum and removing shrinks it. With negatives, both directions can move either way and the L pointer
        doesn&apos;t advance monotonically. Result: missed subarrays. Move to prefix + hash.
      </p>
      <p className="mb-4">
        <strong>Integer overflow.</strong> Prefix sums grow monotonically and can overflow 32-bit. For Leetcode
        constraints (values up to 10⁴ and length up to 10⁵), intermediate sums reach 10⁹ — fine for 32-bit signed —
        but combined with negative-allowed problems where values reach 10⁵ the sum can reach 10¹⁰. Use long /
        int64 by default in C++ and Java; Python is immune.
      </p>
      <p className="mb-4">
        <strong>2D inclusion-exclusion sign errors.</strong> sum(rect) = P[r2 + 1][c2 + 1] − P[r1][c2 + 1] −
        P[r2 + 1][c1] + P[r1][c1]. Two minuses and one plus on the corner. Forgetting the +P[r1][c1] is the most
        common sign mistake; the corner gets subtracted twice and the result is too small.
      </p>
      <p className="mb-4">
        <strong>Mutable arrays.</strong> Prefix sum is O(n) to update in place — every update past index i
        invalidates n − i prefix entries. If updates are interleaved with queries, prefix sum is the wrong tool;
        switch to Fenwick.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases (Canonical Leetcode Problems)</h2>
      <p className="mb-4">
        <strong>303. Range Sum Query — Immutable.</strong> The base case: build P in the constructor, answer each
        sumRange in O(1). Use this template as the muscle-memory baseline.
      </p>
      <p className="mb-4">
        <strong>304. Range Sum Query 2D — Immutable.</strong> The 2D analogue with the four-corner formula.
        Constructor is O(mn), each query O(1). Sets up the technique used in 1314 and 363.
      </p>
      <p className="mb-4">
        <strong>560. Subarray Sum Equals K.</strong> The canonical prefix + hash problem. Map prefix → count, look
        up (prefix − k), accumulate. O(n). Negatives allowed — sliding window does not work here.
      </p>
      <p className="mb-4">
        <strong>974. Subarray Sums Divisible by K.</strong> Same skeleton with the key being prefix mod k.
        Normalise negative mod to non-negative. O(n).
      </p>
      <p className="mb-4">
        <strong>525. Contiguous Array.</strong> Map 0 → −1 and 1 → +1; longest subarray with sum 0. Map prefix →
        first-index. The map shape (first-index, not count) is the longest-subarray variant.
      </p>
      <p className="mb-4">
        <strong>437. Path Sum III.</strong> Prefix sum on a tree path. DFS maintaining a map of root-to-node prefix
        sums; decrement the map on the way back up to keep it scoped to the current path. Generalises prefix sum
        beyond linear sequences.
      </p>
      <p className="mb-4">
        <strong>238. Product of Array Except Self.</strong> Two-pass cumulative product (left, then right merged in
        place). Same template, multiplicative aggregate, O(1) extra space if the output array is reused.
      </p>
      <p className="mb-4">
        <strong>1109. Corporate Flight Bookings.</strong> Difference array — the inverse pattern. Each booking is
        a range-add; after all updates, prefix-sum once to materialise the final per-flight totals. O(q + n).
      </p>
      <p className="mb-4">
        <strong>1248. Count Number of Nice Subarrays.</strong> Map odd → 1, even → 0; count subarrays with sum k.
        Reuses the 560 skeleton on a transformed array. Sliding window also works because the transformed values
        are non-negative.
      </p>
      <p className="mb-4">
        <strong>363. Max Sum of Rectangle No Larger Than K.</strong> Pin two row boundaries, collapse columns into
        a 1D array, then for each column-prefix find the smallest prefix value ≥ (current − k) using a sorted set.
        Stacks 2D prefix + 1D prefix + sorted-set search. The interview-grade combination problem.
      </p>

      <ArticleImage
        src="/diagrams/other/leetcode/patterns/prefix-sum-diagram-3.svg"
        alt="Canonical prefix-sum Leetcode problems"
        caption="Static range-query problems and prefix + hash variants — the two halves of the prefix-sum syllabus."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li><strong>Why does prefix + hash beat sliding window for 560 (Subarray Sum Equals K)?</strong> Sliding window
        needs monotone behaviour of the running sum; with negatives, adding an element can decrease the sum, so the
        L pointer would have to back up — destroying the amortised O(n). Prefix + hash is sign-agnostic.</li>
        <li><strong>Why initialise the map with {`{0: 1}`}?</strong> The empty prefix has value 0 and is a valid left
        boundary for any subarray that starts at index 0. Without seeding, subarrays starting at 0 with sum k are
        missed.</li>
        <li><strong>Why is the lookup before the increment?</strong> To exclude the zero-length subarray (the prefix
        looking at itself). Reverse the order and any k = 0 query inflates by n.</li>
        <li><strong>What is the complexity of building a 2D prefix sum, and what is the query complexity?</strong>
        Build is O(mn). Query is O(1) using the four-corner formula: P[r2 + 1][c2 + 1] − P[r1][c2 + 1] − P[r2 +
        1][c1] + P[r1][c1].</li>
        <li><strong>If the array is mutable, how do you adapt?</strong> Prefix sum becomes O(n) per update. Switch to
        a Fenwick tree (Binary Indexed Tree) for O(log n) point-update and O(log n) prefix-query. The query
        identity stays the same; only the storage changes.</li>
        <li><strong>How does the difference array relate to prefix sum?</strong> Difference array is the discrete
        derivative; prefix sum is the discrete integral. Range-update on A is point-update on D; point-query on A
        is prefix-query on D. Use D when updates are batched and one final read-out is needed.</li>
        <li><strong>Subarray product equals k — does prefix work?</strong> Multiplicative analogue: yes for non-zero
        values (use prefix product and division), no when zeros appear (division blows up). Logarithm trick maps
        product to sum but introduces floating-point error. Practical advice: split on zeros and apply the additive
        version.</li>
        <li><strong>How would you solve range XOR queries?</strong> XOR is invertible (its own inverse), so the prefix
        identity holds: xor(A[l..r]) = P[r + 1] xor P[l]. Same template, replace + with xor.</li>
        <li><strong>Range max — does prefix sum apply?</strong> No, max is not invertible. Use a sparse table for
        immutable arrays (O(n log n) build, O(1) query) or a segment tree for mutable arrays (O(log n) per op).</li>
        <li><strong>For 437 (Path Sum III), why decrement the map after recursing?</strong> The map must reflect only
        prefixes along the current root-to-node path. After recursing into a subtree, the prefix at the current
        node is no longer on the path of any sibling subtree — decrement to scope the map correctly.</li>
      </ol>
<h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li><strong>Leetcode problem set.</strong> 303, 304, 1314, 1480, 724, 238, 560, 974, 525, 437, 1109, 1854, 1248,
        930, 523, 363, 1546 — work them in this order; each one nudges the template in a single dimension.</li>
        <li><strong>Grokking the Coding Interview.</strong> The prefix-sum module covers 560 and its variants; the
        difference-array module covers 1109. Useful for the &quot;recognition signal&quot; framing.</li>
        <li><strong>Competitive Programming Handbook (Antti Laaksonen).</strong> Chapter on static array techniques —
        prefix sums, 2D prefix, difference arrays — with crisp formulations and several variations not in
        Leetcode-style sources.</li>
        <li><strong>CP-Algorithms — &quot;Prefix sums and difference arrays&quot;.</strong> Reference-quality treatment
        with proofs and the connection to Fenwick trees as the dynamic generalisation.</li>
        <li><strong>Elements of Programming Interviews.</strong> The arrays chapter has the 2D prefix and the
        sliding-window-with-prefix hybrids that appear in 363.</li>
        <li><strong>NeetCode 150 / Blind 75.</strong> Both lists feature 560, 238, and 304 prominently — practising
        these to fluency covers ~80% of the prefix-sum interview surface.</li>
      </ul>
    </ArticleLayout>
  );
}
