"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "two-pointer",
  title: "Two-Pointer Pattern",
  description:
    "Linear-time technique that uses two indices walking through one or two sequences to replace nested loops — the foundational Leetcode pattern for sorted-array pair problems and in-place rewrites.",
  category: "other",
  subcategory: "patterns",
  slug: "two-pointer",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-25",
  tags: ["two-pointer", "leetcode", "patterns", "arrays", "strings"],
  relatedTopics: ["sliding-window", "fast-slow-pointers", "binary-search"],
};

export default function TwoPointerArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
      <p className="mb-4">
        The two-pointer pattern uses two indices that walk through a sequence (or two sequences) to solve a problem in
        linear time and constant extra space, replacing what would otherwise be a nested-loop O(n²) brute force. It is
        the single most common pattern at the &quot;easy-to-medium&quot; bar of Leetcode arrays and strings, and a
        prerequisite for understanding sliding-window, fast/slow pointers, and many partitioning routines.
      </p>
      <p className="mb-4">
        The pattern shows up in two main forms. <strong>Convergent two-pointer</strong> places one pointer at each end
        of a sorted or symmetric input and walks them toward each other, using a comparison against a target to decide
        which side advances. <strong>Parallel two-pointer</strong> places both pointers at the start and walks them in
        the same direction at different speeds — typically a &quot;slow&quot; write head and a &quot;fast&quot; read
        head — to compact, partition, or rewrite the array in place. A third sub-flavour, <em>fast-and-slow</em>
        pointers on linked lists (Floyd&apos;s tortoise and hare), is common enough that it gets its own article.
      </p>
      <p className="mb-4">
        Recognition signals are concrete. Sorted array plus a pair / triple condition (&quot;find two numbers that sum
        to k&quot;, &quot;count triples below threshold&quot;) is convergent. In-place compaction, partition, or
        dedup (&quot;remove all zeroes&quot;, &quot;move duplicates to the end&quot;) is parallel. Palindrome or
        mirror-check on a string is convergent. The pattern works because each pointer move strictly shrinks the
        remaining search space or commits one element to its final position — the loop runs at most n times total
        across both pointers.
      </p>
      <p className="mb-4">
        For a staff-level interview, two-pointer questions test whether you can <em>justify</em> why moving a particular
        pointer is safe (the monotonicity argument) and whether you can extend the pattern to k-Sum, three-way
        partitions, and merge-style overlays. The mechanical solution is rarely the bar; the bar is articulating the
        invariant the pointers maintain and why no candidate is missed.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
      <p className="mb-4">
        <strong>Convergent invariant.</strong> Given a sorted array A and target T, place L = 0, R = n - 1, and consider
        the candidate pair (A[L], A[R]). If A[L] + A[R] &lt; T, no pair (L, k) with k &lt; R can sum to T because A[k]
        ≤ A[R], so we can safely advance L without missing a solution. Symmetrically, if A[L] + A[R] &gt; T, no pair
        (k, R) with k &gt; L can sum to T, so we retreat R. Each iteration eliminates at least one element from
        consideration, so the loop runs at most n times.
      </p>
      <p className="mb-4">
        That argument generalises. Any monotone predicate p(L, R) — where increasing L makes p more likely true and
        decreasing R makes p more likely false (or vice versa) — admits a two-pointer sweep. &quot;Container with most
        water&quot; replaces sum with min(A[L], A[R]) × (R - L); the same logic applies because the only way to
        possibly increase the area is to move the shorter wall inward. &quot;Trapping rain water&quot; uses the
        invariant that water at index i is bounded by min(maxLeft, maxRight), and advancing whichever side has the
        smaller running max preserves this.
      </p>
      <p className="mb-4">
        <strong>Parallel invariant.</strong> Slow pointer s is the next write index; fast pointer f is the read head.
        At every iteration A[0..s-1] holds the validated prefix and A[f..n-1] is unprocessed. The work performed at
        each step is O(1) and f moves monotonically forward, giving total O(n). The slow pointer advances only when a
        new value is committed.
      </p>
      <p className="mb-4">
        For sorted-array dedup (Leetcode 26), the invariant is &quot;A[0..s] holds distinct values seen so far in
        sorted order&quot;. We advance f, and when A[f] differs from A[s] we increment s and copy A[s] = A[f]. The
        final answer is the prefix length s + 1.
      </p>
      <p className="mb-4">
        For Dutch national flag (Leetcode 75), three pointers maintain four regions: A[0..low-1] = 0s, A[low..mid-1] =
        1s, A[mid..high] = unprocessed, A[high+1..n-1] = 2s. Each step inspects A[mid] and either swaps with low (and
        advances both), advances mid alone, or swaps with high (advancing only high backward, because the swapped-in
        value is unprocessed). The loop terminates when mid &gt; high, having touched each element at most twice.
      </p>
      <p className="mb-4">
        <strong>Complexity.</strong> Both flavours are O(n) time and O(1) extra space. The brute-force baseline is
        usually O(n²), so the upgrade is one quadratic factor — exactly the impact of swapping a nested loop for a
        single sweep with smarter bookkeeping.
      </p>
      <ArticleImage
        src="/diagrams/other/leetcode/patterns/two-pointer-diagram-1.svg"
        alt="Two-pointer pattern: convergent and parallel variants"
        caption="Convergent (sorted-array sum, palindrome) vs parallel (slow/fast for in-place rewrite). Both run in O(n) time, O(1) space."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
      <p className="mb-4">
        The convergent template walks two pointers L and R from opposite ends of the array. While L &lt; R, evaluate a
        comparison between A[L] and A[R] (or some derived quantity), and decide which side to advance. On a match,
        record the result and either advance both pointers (when duplicates must be skipped) or terminate (when only
        one solution is needed). The duplicate-skipping step is what makes 3Sum and 4Sum return distinct triples
        without a hash set.
      </p>
      <p className="mb-4">
        For k-Sum problems with k ≥ 3, the standard reduction is &quot;sort the array, fix the outer indices with
        nested loops, and two-pointer the innermost pair&quot;. 3Sum becomes O(n²) — outer loop fixes A[i], inner two
        pointers sweep A[i+1..n-1] for the complement -A[i]. 4Sum nests two outer loops and remains O(n³). The fixed
        indices must skip duplicates (if (i &gt; 0 and A[i] == A[i-1]) continue) to avoid duplicate result tuples; the
        inner two-pointer must skip duplicates after recording a match for the same reason.
      </p>
      <p className="mb-4">
        The parallel template walks slow and fast from index 0. Fast scans every element; slow advances only when fast
        finds a value worth keeping. The exact predicate depends on the problem: &quot;not equal to previous
        kept&quot; for dedup, &quot;not equal to target&quot; for remove-element, &quot;non-zero&quot; for
        move-zeroes. After the sweep, the answer is either the prefix length (slow + 1) or the array itself, with
        garbage in the tail.
      </p>
      <p className="mb-4">
        A useful variant is &quot;write from the back&quot; — Leetcode 88 (merge sorted array) places the result in
        A1 in place by walking three pointers (i = m-1, j = n-1, k = m+n-1) and writing the larger of A1[i] and A2[j]
        to A1[k], advancing whichever side wrote. This avoids the in-place clobber that walking forward would cause.
      </p>
      <p className="mb-4">
        The convergent and parallel forms can mix. &quot;Sort Colors&quot; uses three pointers in a hybrid: low and
        mid walk from the front (parallel), high walks from the back (convergent). The stopping condition is mid
        &gt; high, and the loop is O(n) because each swap advances at least one of {`{low, mid, high}`} by one step
        in its monotone direction.
      </p>
      <ArticleImage
        src="/diagrams/other/leetcode/patterns/two-pointer-diagram-2.svg"
        alt="Two-pointer template and recognition signals"
        caption="Convergent template (sorted-array sum). Recognition cues for choosing two-pointer over hash set or sliding-window."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
      <p className="mb-4">
        Two-pointer vs. <strong>hash set</strong> on Two Sum: hash set is O(n) time and O(n) space, works on unsorted
        input, returns indices. Two-pointer (after sorting) is O(n log n) time but O(1) extra space and returns
        values, not indices. Pick based on whether the input is sorted, whether you need indices, and whether
        space-vs-time matters. Leetcode 1 (Two Sum) wants indices on unsorted input, so the hash set wins; Leetcode
        167 (Two Sum II — Input Array Is Sorted) is the canonical two-pointer problem.
      </p>
      <p className="mb-4">
        Two-pointer vs. <strong>sliding window</strong>: sliding window is just &quot;parallel two-pointer where the
        window contents matter&quot;. The decision is whether the predicate involves a window (count of distinct
        characters, sum, max) or a pointwise condition. If the predicate depends on the entire range A[L..R], it&apos;s
        sliding window. If it depends only on A[L] and A[R], it&apos;s convergent two-pointer.
      </p>
      <p className="mb-4">
        Two-pointer vs. <strong>binary search</strong>: both exploit sortedness, but two-pointer answers
        relational-pair questions in one pass; binary search answers point-lookup or boundary questions. For Two Sum
        on a sorted array, two-pointer is O(n); fixing one index and binary-searching the complement is O(n log n).
        Two-pointer wins. For &quot;find the smallest index where A[i] ≥ k&quot;, binary search wins.
      </p>
      <p className="mb-4">
        Two-pointer vs. <strong>sort + linear scan</strong>: many partition problems can be solved with a single sort
        plus a linear scan, but in-place two-pointer (Dutch flag, Lomuto/Hoare partition) does the partition in O(n)
        without allocating extra storage. Quicksort&apos;s partition step is the canonical example.
      </p>
      <p className="mb-4">
        Two-pointer vs. <strong>brute force</strong>: the O(n²) baseline is almost always trivially correct and
        sometimes the right call for small n or unsorted inputs. The upgrade to two-pointer requires sortedness or a
        monotone predicate; without that, two-pointer is unsafe.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
      <p className="mb-4">
        State the invariant out loud before writing code. &quot;A[L] + A[R] &lt; target ⟹ no valid pair uses A[R]
        with any L&apos; ≥ L&quot; — that one sentence is the entire correctness argument. Interviewers want to hear
        it; write it down or recite it before touching the keyboard.
      </p>
      <p className="mb-4">
        Sort first, then dedup. For 3Sum and 4Sum, sorting is the precondition that makes two-pointer safe. The
        dedup step (skip identical neighbours after a match) is what makes the result set canonical without a hash
        set. Forgetting dedup is the #1 reason 3Sum submissions fail.
      </p>
      <p className="mb-4">
        Pick the right loop bound. <code>while L &lt; R</code> avoids the case L = R (a single element pair, which is
        usually undefined for sum problems). <code>while L &lt;= R</code> is rare for two-pointer and almost always
        wrong — that&apos;s a binary-search idiom.
      </p>
      <p className="mb-4">
        Move both pointers on a match when you need distinct results. Move only one when you&apos;re counting
        (every pair (L, k) with k in some range counts).
      </p>
      <p className="mb-4">
        For parallel two-pointer, decide whether to overwrite or swap. Overwrite (slow = fast) is slightly faster but
        loses original values; swap (a[slow], a[fast] = a[fast], a[slow]) preserves them and is required when the
        problem asks you to keep the original elements somewhere.
      </p>
      <p className="mb-4">
        Watch out for integer overflow on sum problems with large inputs. In languages without arbitrary-precision
        ints (C++, Java, Rust), use long for the sum or check the difference instead: <code>A[L] - (target - A[R])</code>.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
      <p className="mb-4">
        <strong>Applying two-pointer to unsorted input.</strong> Without monotonicity, the &quot;advance L if sum &lt;
        target&quot; rule is unjustified — moving L could discard the solution. Either sort first or use a different
        pattern (hash set).
      </p>
      <p className="mb-4">
        <strong>Forgetting dedup in k-Sum.</strong> 3Sum on [-1,-1,-1,2,2] without dedup returns [[-1,-1,2]] three
        times. The grader accepts unordered output but rejects duplicate triples. Skip identical neighbours after each
        match.
      </p>
      <p className="mb-4">
        <strong>Off-by-one on the loop bound.</strong> &quot;While L &lt;= R&quot; for sum problems can read A[L] +
        A[L] when L == R, which usually isn&apos;t a valid pair. The bound must be L &lt; R for distinct-pair
        problems.
      </p>
      <p className="mb-4">
        <strong>Wrong direction on convergent moves.</strong> If sum &lt; target, you advance L (looking for a larger
        value); if sum &gt; target, you retreat R. Swapping these is a common bug, and it produces an infinite loop
        when sum equals target and you advance the wrong side.
      </p>
      <p className="mb-4">
        <strong>Clobbering during in-place merge.</strong> Walking forward in &quot;merge sorted array&quot; overwrites
        unread A1 entries before they are merged. Walk backward.
      </p>
      <p className="mb-4">
        <strong>Treating the area in &quot;container with most water&quot; as a convex function.</strong> It isn&apos;t.
        The greedy &quot;move shorter wall&quot; rule is correct, but only because moving the taller wall cannot
        possibly increase the area (the height stays bounded by the shorter wall, and the width strictly decreases).
      </p>
      <p className="mb-4">
        <strong>Mid-way termination on Dutch flag.</strong> The condition is mid &gt; high, not mid ≥ n. Misreading
        the bound leaves the last unprocessed element in place.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
      <p className="mb-4">
        Beyond Leetcode, the two-pointer pattern is the foundation of several production algorithms.
        <strong> Quicksort&apos;s partition step</strong> is parallel two-pointer (Lomuto) or convergent (Hoare).
        <strong> Mergesort&apos;s merge phase</strong> is two-pointer over two sorted runs. <strong>String diff
        algorithms</strong> like Myers diff use a two-pointer common-prefix / common-suffix sweep before doing the
        expensive middle-snake search. <strong>Streaming dedup</strong> in log pipelines often uses a slow/fast
        pointer over a windowed buffer.
      </p>
      <p className="mb-4">
        Below are the canonical Leetcode problems that map to this pattern. Each tests a slightly different invariant.
      </p>
      <p className="mb-4">
        <strong>1 / 167. Two Sum / Two Sum II.</strong> Problem 1 is unsorted (hash-set canonical); 167 is sorted and
        is the textbook convergent two-pointer.
      </p>
      <p className="mb-4">
        <strong>15. 3Sum / 16. 3Sum Closest.</strong> Sort, fix one index, two-pointer the rest. Practice the dedup
        step. 3Sum Closest tracks the running best instead of equality.
      </p>
      <p className="mb-4">
        <strong>18. 4Sum.</strong> Two nested fixed indices plus inner two-pointer, with two layers of dedup. O(n³).
      </p>
      <p className="mb-4">
        <strong>11. Container With Most Water.</strong> Move the shorter wall inward. The greedy is correct because
        the area is bounded by the shorter wall and width strictly decreases.
      </p>
      <p className="mb-4">
        <strong>42. Trapping Rain Water.</strong> Two-pointer with running maxLeft / maxRight; advance whichever side
        has the smaller running max. The water at the advanced index is bounded by that running max.
      </p>
      <p className="mb-4">
        <strong>26 / 27 / 80. Remove Duplicates / Remove Element / Remove Duplicates II.</strong> Parallel slow/fast
        with different keep predicates. Problem 80 keeps up to two of each value — extend the predicate, not the
        skeleton.
      </p>
      <p className="mb-4">
        <strong>75. Sort Colors.</strong> Three-pointer Dutch flag. The classic partition-with-three-buckets
        problem.
      </p>
      <p className="mb-4">
        <strong>88. Merge Sorted Array.</strong> Backwards two-pointer to avoid clobber.
      </p>
      <p className="mb-4">
        <strong>125. Valid Palindrome / 680. Valid Palindrome II.</strong> Convergent on a string. 680 adds the &quot;at
        most one mismatch&quot; twist — when L and R disagree, recurse with one of them advanced.
      </p>
      <p className="mb-4">
        <strong>283. Move Zeroes.</strong> Parallel slow/fast; slow tracks the next non-zero write position. After the
        sweep, fill the tail with zeros (or swap as you go to avoid the second pass).
      </p>
      <ArticleImage
        src="/diagrams/other/leetcode/patterns/two-pointer-diagram-3.svg"
        alt="Canonical two-pointer Leetcode problems by flavour"
        caption="Convergent: 1, 11, 15, 42, 75, 125. Parallel: 26, 27, 80, 88, 283. Each tests a different invariant."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li><strong>Why is moving the shorter wall in Container With Most Water correct?</strong> Because the area is
        bounded by min(left, right) × width. Moving the taller wall keeps that bound the same (still capped by the
        shorter wall) but reduces the width — strict decrease. Moving the shorter wall might find a taller one and
        increase the area despite the width decrease. Therefore the only direction that can possibly improve the
        result is to move the shorter wall.</li>
        <li><strong>Walk through 3Sum and explain dedup.</strong> Sort. For each i in 0..n-3, two-pointer the suffix
        looking for -A[i]. If i &gt; 0 and A[i] == A[i-1], skip — same outer index produces the same triples. After a
        match, advance L and R past their duplicates: while (L &lt; R and A[L] == A[L+1]) L++. This keeps the result
        list canonical without needing a hash set.</li>
        <li><strong>How would you solve 3Sum without sorting?</strong> Use a hash set per outer index — O(n²) time, O(n)
        space, and dedup via a result set keyed on sorted triples. Sorting is cleaner but if the input must be
        preserved, hashing wins.</li>
        <li><strong>Generalize k-Sum.</strong> Sort once, then recurse: kSum(arr, target, k) reduces to (k-1)Sum on the
        suffix with target adjusted, base case k = 2 is two-pointer. Time O(n^(k-1)).</li>
        <li><strong>Why is Trapping Rain Water two-pointer correct?</strong> Maintain leftMax = max(A[0..L]) and rightMax =
        max(A[R..n-1]). The water at index L is bounded by min(leftMax, rightMax). If leftMax ≤ rightMax, then
        leftMax is the binding constraint at L, regardless of what&apos;s past R — so we can compute water at L and
        advance L. Symmetric on the other side.</li>
        <li><strong>Implement Dutch national flag in one pass.</strong> Three pointers low, mid, high. While mid ≤ high:
        if A[mid] = 0, swap with low, advance low and mid; if A[mid] = 1, advance mid; if A[mid] = 2, swap with high,
        retreat high (mid stays — the swapped-in value is unprocessed).</li>
        <li><strong>Two-pointer or sliding window for &quot;longest substring with at most k distinct&quot;?</strong>
        Sliding window — the predicate depends on the window contents (a count of distinct characters), not just on
        the endpoints. Two-pointer is for endpoint-based predicates.</li>
        <li><strong>What&apos;s the relationship between two-pointer and quicksort partition?</strong> Hoare&apos;s
        partition is convergent two-pointer; Lomuto&apos;s is parallel slow/fast. Both achieve O(n) partition with
        O(1) extra space. Hoare is faster on adversarial inputs; Lomuto is simpler and easier to prove correct.</li>
        <li><strong>How does &quot;Valid Palindrome II&quot; (one-mismatch tolerance) work?</strong> Convergent two-pointer
        until a mismatch. On mismatch, return isPalindrome(s[L+1..R]) || isPalindrome(s[L..R-1]). Two cheap O(n)
        checks; total O(n).</li>
        <li><strong>Why doesn&apos;t two-pointer work on unsorted Two Sum?</strong> Without monotonicity, advancing L
        because sum &lt; target might discard a smaller element that would have paired with a larger A[R&apos;] later.
        The argument that &quot;all pairs (L, k &lt; R) sum to less than target&quot; relies on A being sorted.</li>
      </ol>
<h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Leetcode&apos;s tag list <em>two-pointers</em> is the canonical practice set; work through 1, 167, 15, 18,
        11, 42, 26, 27, 80, 75, 88, 125, 283, 344, 345 in that order. The Grokking Coding Patterns course groups
        two-pointer with sliding window and fast/slow pointers as the &quot;linear traversal&quot; family — the
        framing helps build pattern-recognition intuition.</li>
        <li>For the formal monotonicity argument that justifies the convergent move, see CLRS chapter 7 on quicksort
        partition (Hoare) — the same proof structure applies. Sedgewick &amp; Wayne&apos;s Algorithms covers Dutch
        national flag as a partition primitive. Knuth volume 3 has the historical merge-sort merge phase, the
        original parallel two-pointer.</li>
        <li>For interview prep, NeetCode&apos;s Blind 75 includes 1, 11, 15, 42, 125 — five of the most-asked two-pointer
        problems. Cracking the Coding Interview chapter on arrays and strings has a number of two-pointer warm-ups.
        Elements of Programming Interviews chapter 6 (arrays) is the most rigorous treatment, with explicit invariant
        statements for each variant.</li>
        <li>For practice, implement each canonical problem from scratch, then re-implement with the alternative pattern
        (hash set, sliding window, brute force) and compare. The goal is to internalise <em>which signal triggers
        which choice</em> — that&apos;s what gets you through the recognition step in the first 30 seconds of an
        interview.</li>
      </ul>
    </ArticleLayout>
  );
}
