"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "binary-search-pattern",
  title: "Binary Search Pattern",
  description:
    "Logarithmic search by halving a monotone search space — the canonical pattern for sorted-array lookup, lower_bound / upper_bound, and parametric search where you binary-search the answer.",
  category: "other",
  subcategory: "patterns",
  slug: "binary-search",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-25",
  tags: ["binary-search", "leetcode", "patterns", "parametric-search"],
  relatedTopics: ["two-pointer", "divide-and-conquer", "sliding-window"],
};

export default function BinarySearchPatternArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
      <p className="mb-4">
        The binary search pattern halves a search space at each step using a monotone decision rule. It runs in
        O(log n) time and O(1) space and applies anywhere monotonicity holds: sorted arrays, but also feasibility
        functions where &quot;if x works, then x + 1 works,&quot; rotated sorted arrays, infinite streams, and even
        2D matrices with row/column ordering. As an interview pattern, it&apos;s asked at every level — from FizzBuzz
        warm-ups (Leetcode 704) to staff-tier parametric-search problems (410, 668, 1631).
      </p>
      <p className="mb-4">
        Three template families cover almost every interview variant. <strong>Exact match</strong>: classic
        [lo, hi] search returning the index of a target value. <strong>Lower bound / upper bound</strong>: find the
        first index where a predicate flips from false to true (or vice versa) — the most useful template, because
        most interview problems reduce to it. <strong>Parametric search</strong>: binary-search the answer itself,
        with a feasibility check at each midpoint — the staff-level differentiator.
      </p>
      <p className="mb-4">
        Recognition signals: a sorted (or sortable) input, a question of the form &quot;first / last index where X
        holds&quot;, &quot;does the value v exist&quot;, or &quot;minimum / maximum value such that property P holds.&quot;
        The last family — &quot;min/max such that P&quot; — is the parametric-search trigger. Whenever you can phrase
        the problem as &quot;is x feasible?&quot; with monotone feasibility, binary-search the answer.
      </p>
      <p className="mb-4">
        For staff interviews, the bar is template fluency (no off-by-one errors, no overflow on midpoint), the
        ability to spot parametric search and articulate monotonicity, and comfort with degenerate cases (empty
        array, target outside range, all duplicates). Most interview-level binary-search bugs are template confusion
        — using inclusive bounds where you need exclusive, or recording the answer at the wrong step.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
      <p className="mb-4">
        <strong>The half-open lower-bound template.</strong> Initialise lo = 0, hi = n (exclusive on the right). Loop
        while lo &lt; hi. Compute mid = lo + (hi - lo) / 2 (avoids overflow). If predicate(mid) is true, set hi = mid
        (mid might be the answer, don&apos;t exclude it). Else lo = mid + 1 (mid is excluded). At termination, lo ==
        hi, and that value is the first index where the predicate is true (or n if no such index exists). This single
        template handles search-insert, first-occurrence, last-occurrence (with a sign flip), and almost every
        boundary problem.
      </p>
      <p className="mb-4">
        <strong>Why the half-open form is preferred.</strong> Inclusive bounds [lo, hi] need a separate termination
        condition (lo &gt; hi) and a final check whether lo or hi holds the answer. Half-open [lo, hi) is uniform:
        the loop ends at lo == hi, that value is the answer (or the size if no answer). Off-by-one bugs vanish.
      </p>
      <p className="mb-4">
        <strong>Mid computation and overflow.</strong> &quot;mid = (lo + hi) / 2&quot; overflows when lo + hi exceeds
        the integer max — a real concern in C++ / Java with billion-element ranges or parametric searches over Long
        ranges. Use mid = lo + (hi - lo) / 2 universally; it&apos;s the same answer and never overflows.
      </p>
      <p className="mb-4">
        <strong>Monotonicity.</strong> Binary search requires that the predicate change at most once over the search
        range. Sorted-array lookups satisfy this trivially: A[i] ≥ target is false for i &lt; k and true for i ≥ k.
        Parametric search requires you to prove monotonicity of the feasibility function. &quot;Can we ship in D days
        with capacity c?&quot; is monotone in c (more capacity ⟹ same or fewer days). &quot;Can Koko eat all bananas
        in h hours at rate r?&quot; is monotone in r. Always state the monotonicity argument before invoking binary
        search.
      </p>
      <p className="mb-4">
        <strong>Search range bounds.</strong> For array indexing, [0, n). For parametric search, [lo, hi] where lo is
        the minimum sensible answer (e.g., 1 for &quot;eat rate&quot;) and hi is a safe upper bound (e.g., max pile
        size, or sum of all weights). Tighter bounds give marginally faster runs but matter less than getting the
        predicate right.
      </p>
      <p className="mb-4">
        <strong>Complexity.</strong> O(log(hi − lo)) iterations of the binary-search loop. For sorted-array lookup,
        the per-iteration work is O(1), giving O(log n). For parametric search, the per-iteration feasibility check is
        usually O(n) or O(n log n), giving O(n log V) or O(n log n log V) where V is the answer-range size.
      </p>
      <ArticleImage
        src="/diagrams/other/leetcode/patterns/binary-search-diagram-1.svg"
        alt="Binary search templates: exact match, lower/upper bound, parametric"
        caption="One template (half-open lower-bound) handles ~90% of interview problems. Memorise it."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
      <p className="mb-4">
        The lower-bound template is the workhorse. Given a predicate p(i) that is monotone (false then true across
        the range), the template returns the smallest i where p is true, or n if p is never true. Cast every binary
        search question into this form. &quot;Find target in sorted array&quot; → first i where A[i] ≥ target; check
        equality at the end. &quot;Search insert position&quot; → first i where A[i] ≥ target; return that index.
        &quot;First bad version&quot; → first i where isBadVersion(i) is true.
      </p>
      <p className="mb-4">
        For upper-bound (last index where p is true), invert: lower-bound of &quot;not p&quot; gives the first
        false, and that minus 1 is the last true. Or rewrite the predicate as p&apos;(i) = !p(i) and apply
        lower-bound.
      </p>
      <p className="mb-4">
        <strong>Rotated sorted array.</strong> The trick is that for any midpoint, at least one half [lo, mid] or
        [mid, hi - 1] is sorted. Compare A[mid] to A[lo] (or A[hi - 1]) to decide which half is sorted, then check
        whether the target is in that half&apos;s range. Recurse on the appropriate side. The same idea handles
        Leetcode 33 (search), 81 (with duplicates — slightly harder bound), and 153 (find minimum / pivot).
      </p>
      <p className="mb-4">
        <strong>Find peak element.</strong> Compare A[mid] and A[mid + 1]. If A[mid] &lt; A[mid + 1], a peak must
        exist to the right (or at mid + 1) by the boundary-condition argument; advance lo = mid + 1. Else hi = mid.
        Loop until lo == hi. The proof relies on A[-1] = A[n] = -∞.
      </p>
      <p className="mb-4">
        <strong>Parametric search skeleton.</strong> Define feasible(x) — can we satisfy the constraint with answer
        x? Verify it&apos;s monotone. Pick lo = minimum plausible x, hi = maximum plausible x. Lower-bound the
        predicate over [lo, hi]. The result is the minimum x for which feasible(x) is true. For maximum-x problems,
        flip the predicate sign or invert the range.
      </p>
      <p className="mb-4">
        Examples: <strong>Koko Eating Bananas</strong> — feasible(r) checks whether sum(ceil(pile/r)) ≤ h.
        <strong> Capacity to Ship</strong> — greedy day-count given capacity. <strong>Split Array Largest
        Sum</strong> — greedy partition count given target max. <strong>Smallest Divisor</strong> — sum of ceiled
        divisions ≤ threshold.
      </p>
      <p className="mb-4">
        <strong>Median of two sorted arrays (Leetcode 4).</strong> Binary-search the partition position in the
        smaller array. The partition splits both arrays into a left half and right half; check the four boundary
        elements; adjust the partition based on which side is too large. O(log min(m, n)). The hardest binary-search
        problem you&apos;ll see in interviews — but reducible to lower-bound on a partition predicate.
      </p>
      <ArticleImage
        src="/diagrams/other/leetcode/patterns/binary-search-diagram-2.svg"
        alt="Parametric search: binary-searching the answer with a feasibility predicate"
        caption="Reduction: monotone feasibility(x) ⟹ binary-search x. Total O(n log V) for an O(n) feasibility check."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
      <p className="mb-4">
        Binary search vs. <strong>linear search</strong>: binary requires monotonicity; linear doesn&apos;t. For n &lt;
        ~64, linear search often beats binary on cache-friendly hardware due to lower constant factors. For larger
        arrays, binary search is strictly better.
      </p>
      <p className="mb-4">
        Binary search vs. <strong>two-pointer</strong>: two-pointer answers relational pair questions on sorted input
        in O(n); binary search answers point-lookup or boundary questions in O(log n). For sorted Two Sum,
        two-pointer is O(n); fix-one-and-binary-search-complement is O(n log n). Two-pointer wins. For
        first-occurrence, binary search wins.
      </p>
      <p className="mb-4">
        Binary search vs. <strong>hash table</strong>: hash gives O(1) expected lookup but O(n) space and no
        order-aware queries (predecessor, successor, range). Binary search gives O(log n) lookup, O(1) space, and
        cheap order queries. Pick by what queries you need.
      </p>
      <p className="mb-4">
        Binary search vs. <strong>tree (BST, treap, skip list)</strong>: trees support insert / delete in O(log n);
        sorted-array binary search is read-only (insert is O(n)). For dynamic sets with frequent updates, use a tree.
        For static sets with frequent queries, use a sorted array with binary search.
      </p>
      <p className="mb-4">
        Binary search vs. <strong>ternary search</strong>: ternary search finds extrema of unimodal functions, not
        boundaries. Different problem class. For monotone problems, binary search is strictly better (fewer
        evaluations per step).
      </p>
      <p className="mb-4">
        Parametric binary search vs. <strong>direct DP / greedy</strong>: parametric is the &quot;outer&quot; loop;
        feasibility is often a greedy or DP &quot;inner&quot; computation. The pattern is hierarchical — recognise
        the outer parametric structure first, then implement the inner check.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
      <p className="mb-4">
        Standardise on the half-open lower-bound template. Use it for everything; you avoid template-confusion bugs.
        For exact match, run lower-bound and check equality at lo. For upper-bound, lower-bound on the negated
        predicate or use lower-bound of (target + 1).
      </p>
      <p className="mb-4">
        Always use mid = lo + (hi - lo) / 2. Never &quot;(lo + hi) / 2&quot; in production code, even when overflow
        seems impossible — Joshua Bloch&apos;s &quot;Nearly All Binary Searches and Mergesorts Are Broken&quot; is
        required reading.
      </p>
      <p className="mb-4">
        State the monotonicity argument out loud before writing code. &quot;Predicate p(i) is false for i &lt; k and
        true for i ≥ k for some unknown k&quot; — this one sentence is the entire correctness proof of the binary
        search.
      </p>
      <p className="mb-4">
        For parametric search, prove feasible(x) is monotone in x before coding. Common monotonicity sources: more
        capacity reduces required time / count; longer time allows more choices; smaller divisor produces larger
        sums. If feasibility isn&apos;t monotone, you cannot binary-search.
      </p>
      <p className="mb-4">
        Pick lo and hi from the actual range of feasible answers, not from the input range. For Koko, lo = 1, hi =
        max(piles). Setting hi = sum(piles) works but is wasteful.
      </p>
      <p className="mb-4">
        Test with the empty array, single element, target outside range, target equal to first element, target equal
        to last element. The boundary cases are the off-by-one minefield.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
      <p className="mb-4">
        <strong>Mixing inclusive and exclusive bounds.</strong> Choose [lo, hi] inclusive everywhere or [lo, hi)
        half-open everywhere — never mix. Mid update, predicate, and termination all depend on the convention.
      </p>
      <p className="mb-4">
        <strong>Overflow on midpoint.</strong> &quot;(lo + hi) / 2&quot; overflows when both are near INT_MAX. Use lo
        + (hi - lo) / 2.
      </p>
      <p className="mb-4">
        <strong>Infinite loop on non-progress.</strong> If neither hi = mid nor lo = mid + 1 happens, the loop runs
        forever. With [lo, hi) and mid = lo + (hi - lo) / 2, mid is always in [lo, hi), so each branch makes strict
        progress. Inclusive bounds with mid = (lo + hi) / 2 can stall when lo == mid == hi - 1 — use (lo + hi + 1) / 2
        for the &quot;upper&quot; variant or rephrase as half-open.
      </p>
      <p className="mb-4">
        <strong>Wrong predicate direction.</strong> The lower-bound template assumes p flips false → true. If your
        natural predicate flips true → false, negate it.
      </p>
      <p className="mb-4">
        <strong>Forgetting to verify the result.</strong> For exact-match search, lower-bound returns the insertion
        point even if the target is absent. Always check A[lo] == target before returning lo. For Search Insert
        Position the insertion point itself is the answer; for Find Target it isn&apos;t.
      </p>
      <p className="mb-4">
        <strong>Not proving feasibility monotonicity in parametric search.</strong> If feasibility isn&apos;t
        monotone, binary search is unsafe. Articulate the monotonicity argument every time.
      </p>
      <p className="mb-4">
        <strong>Floating-point binary search without convergence criterion.</strong> For real-valued binary search
        (square root, geometric problems), loop until hi - lo &lt; epsilon, not until lo == hi (which may never
        hold).
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
      <p className="mb-4">
        Binary search is the backbone of <strong>database B-tree indexes</strong> (each node is a binary search over
        keys), <strong>sorted-set data structures</strong> (std::lower_bound, Java TreeMap), <strong>git
        bisect</strong> (binary-search the commit that broke the build — parametric on a monotone &quot;is
        broken&quot; predicate), <strong>memory allocators</strong> (best-fit by size), and <strong>numerical
        methods</strong> (root finding via bisection). Whenever a sorted index exists or a feasibility predicate is
        monotone, binary search is the default.
      </p>
      <p className="mb-4">
        Below are the canonical Leetcode problems that map to this pattern.
      </p>
      <p className="mb-4">
        <strong>704. Binary Search.</strong> The base template. Memorise it.
      </p>
      <p className="mb-4">
        <strong>35. Search Insert Position.</strong> Pure lower-bound.
      </p>
      <p className="mb-4">
        <strong>34. Find First and Last Position of Element in Sorted Array.</strong> Two passes — lower_bound and
        upper_bound. Tests dual-template fluency.
      </p>
      <p className="mb-4">
        <strong>33. Search in Rotated Sorted Array / 81 (with duplicates).</strong> &quot;One half is always
        sorted&quot; trick. The most common rotated-array variant.
      </p>
      <p className="mb-4">
        <strong>153. Find Minimum in Rotated Sorted Array.</strong> Binary-search the pivot. Compare A[mid] with
        A[hi].
      </p>
      <p className="mb-4">
        <strong>162. Find Peak Element.</strong> Slope-based binary search; A[-1] = A[n] = −∞ ensures a peak exists.
      </p>
      <p className="mb-4">
        <strong>4. Median of Two Sorted Arrays.</strong> The hard partition trick. Binary-search the partition
        position in the smaller array.
      </p>
      <p className="mb-4">
        <strong>875. Koko Eating Bananas.</strong> Parametric — min eat rate r such that all bananas finish in h
        hours.
      </p>
      <p className="mb-4">
        <strong>1011. Capacity to Ship Packages within D Days.</strong> Parametric on capacity.
      </p>
      <p className="mb-4">
        <strong>410. Split Array Largest Sum.</strong> Parametric on the maximum subarray sum after partitioning.
        Greedy feasibility: count partitions needed if max sum is x.
      </p>
      <p className="mb-4">
        <strong>1631. Path with Minimum Effort.</strong> Parametric on max-effort threshold; feasibility is BFS or
        union-find. Composite pattern.
      </p>
      <p className="mb-4">
        <strong>668. Kth Smallest in a Multiplication Table.</strong> Parametric on the value v; feasibility counts
        cells ≤ v.
      </p>
      <ArticleImage
        src="/diagrams/other/leetcode/patterns/binary-search-diagram-3.svg"
        alt="Canonical binary-search Leetcode problems"
        caption="Sorted-array variants (704, 35, 34, 33, 153, 162, 4) and parametric (875, 1011, 410, 1631, 668)."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li><strong>Walk through the half-open lower-bound template.</strong> lo = 0, hi = n. While lo &lt; hi: mid = lo +
        (hi - lo) / 2; if predicate(mid) hi = mid else lo = mid + 1. Return lo. Lo is the smallest index where
        predicate is true, or n if no such index.</li>
        <li><strong>Why mid = lo + (hi − lo) / 2?</strong> To avoid integer overflow. (lo + hi) / 2 overflows when lo +
        hi exceeds INT_MAX. Both formulas give the same value otherwise.</li>
        <li><strong>Search in Rotated Sorted Array — explain the algorithm.</strong> At any midpoint, at least one half
        [lo..mid] or [mid..hi] is sorted (because rotation creates exactly one discontinuity). Determine which by
        comparing A[mid] with A[lo]. Check whether target is in the sorted half&apos;s range; recurse on that half if
        so, else on the other.</li>
        <li><strong>Find Peak Element correctness.</strong> Treat A[-1] = A[n] = -∞. If A[mid] &lt; A[mid + 1], the right
        side starts ascending; the value at A[n] = -∞ is less than anything, so by intermediate-value-on-integers a
        peak must exist in (mid, n − 1]. Symmetric otherwise.</li>
        <li><strong>Walk through Koko Eating Bananas.</strong> Define feasible(r) = sum(ceil(p / r) for p in piles) ≤ h.
        Monotone in r (larger r ⟹ fewer hours). Binary-search lower-bound of feasible over [1, max(piles)]. Returns
        the minimum eat rate.</li>
        <li><strong>Median of Two Sorted Arrays in O(log min(m, n)).</strong> Binary-search the partition position i in
        the smaller array; j is determined by total-half - i. Check four boundary elements: A[i-1] ≤ B[j] and B[j-1]
        ≤ A[i]. If A[i-1] &gt; B[j], decrease i; else increase. The median is computed from the four boundary values.</li>
        <li><strong>How do you handle duplicates in rotated sorted array search?</strong> Leetcode 81. When A[lo] ==
        A[mid] == A[hi], the &quot;which half is sorted&quot; check is ambiguous. Advance lo and retreat hi by 1 each
        and continue. Worst case becomes O(n) but average remains O(log n).</li>
        <li><strong>Binary-search a 2D matrix that&apos;s row-and-column sorted.</strong> Two approaches: treat as a
        flattened 1D sorted array (works only when each row&apos;s last ≤ next row&apos;s first — Leetcode 74); or
        start at top-right and step left/down based on comparison (Leetcode 240, O(m + n), no binary search). Pick by
        constraints.</li>
        <li><strong>Floating-point binary search — when do you stop?</strong> When hi − lo &lt; epsilon, where epsilon is
        the required precision (e.g., 1e-7 for 7 decimal digits). Don&apos;t loop on equality — float arithmetic
        usually never makes hi == lo.</li>
        <li><strong>How does git bisect map to binary search?</strong> The predicate is &quot;is this commit broken?&quot;.
        Monotone if the bug was introduced once and never fixed. Bisect performs a lower-bound over the commit
        sequence with a per-iteration human-feedback feasibility check. O(log n) commits to test.</li>
      </ol>
<h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Joshua Bloch&apos;s 2006 article &quot;Nearly All Binary Searches and Mergesorts Are Broken&quot; is required
        reading on the overflow bug. Programming Pearls (Jon Bentley) chapter 4 is the classic walkthrough on
        getting binary search right. CLRS chapter 12 covers the formal analysis.</li>
        <li>For Leetcode practice: 704, 35, 34, 33, 153, 162, 4, 875, 1011, 410, 1631, 668 in roughly that order. The
        Grokking course groups these as &quot;modified binary search&quot;; NeetCode&apos;s Blind 75 includes 33,
        153, 4. Work through the Leetcode &quot;binary-search&quot; tag for a deeper drill.</li>
        <li>For parametric search, Megiddo&apos;s 1983 paper &quot;Applying parallel computation algorithms in the design
        of serial algorithms&quot; introduces the formal theory. The technique is older as folk knowledge — Knuth
        attributes it to operations research from the 1950s.</li>
        <li>For interview prep, the litmus test is recognising parametric search within 30 seconds — the &quot;min/max
        such that...&quot; phrasing is the dead giveaway. Drill 875, 1011, 410 until that recognition is automatic.</li>
      </ul>
    </ArticleLayout>
  );
}
