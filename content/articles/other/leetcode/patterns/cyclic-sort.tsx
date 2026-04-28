"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "cyclic-sort",
  title: "Cyclic Sort Pattern",
  description:
    "Place each value at its target index in O(n) time and O(1) extra space — the canonical pattern for missing/duplicate problems on bounded integer ranges.",
  category: "other",
  subcategory: "patterns",
  slug: "cyclic-sort",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-26",
  tags: ["cyclic-sort", "in-place", "arrays", "missing-number", "duplicates"],
  relatedTopics: ["two-pointer", "hash-table", "bit-manipulation"],
};

export default function CyclicSortArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <h2 className="text-2xl font-bold mt-8 mb-4">Definition & Context</h2>
      <p>
        Cyclic sort is a deceptively simple in-place rearrangement that solves an entire family of
        Leetcode problems built on the same premise: an array contains integers drawn from a
        bounded range, typically <em>1..n</em> or <em>0..n</em>, and the question asks you to find
        what is missing, what is duplicated, or which positive integer is the smallest absent one.
        Hashing solves all of these in O(n) time but uses O(n) auxiliary memory; sorting solves
        them too but pays a logarithmic factor. Cyclic sort matches hashing&apos;s linear time
        while keeping auxiliary space at O(1), and that single advantage is why it appears
        repeatedly in the &quot;array of size n with values from 1..n&quot; corner of interview
        question banks.
      </p>
      <p>
        The core observation is structural. If a value <em>v</em> belongs at index <em>v − 1</em>
        (or <em>v</em>, depending on whether the range starts at 1 or 0), then a fully sorted
        array of a permutation of 1..n is one where every cell <em>i</em> holds value{" "}
        <em>i + 1</em>. Sorting such an array therefore does not require comparison; it requires
        only routing each value to its home cell. Each routing step is a swap, and each swap
        places at least one value permanently. The total number of swaps is bounded by n, which
        gives the algorithm its O(n) running time despite the nested loop in the textbook
        formulation.
      </p>
      <p>
        Recognising when to reach for cyclic sort is the entire game. The signal is almost always
        explicit in the problem statement: &quot;an array of n integers where each integer is in
        the range [1, n]&quot;, &quot;values are in [0, n]&quot;, &quot;exactly one number is
        missing&quot;, &quot;there is one duplicate&quot;. When that constraint appears alongside a
        request for O(1) extra space (or simply when the interviewer pushes back against your
        hashset solution), cyclic sort is the answer. Without the bounded-range constraint, the
        pattern does not apply — you cannot route a value to a target index when the value might
        be larger than the array.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Core Concepts</h2>
      <p>
        The invariant cyclic sort maintains is straightforward: at the moment the outer loop
        advances past index <em>i</em>, either <em>nums[i]</em> equals its target value or the
        target value lives outside the array&apos;s legal range and was deliberately skipped. The
        inner loop does not advance the outer index until the cell is settled, which is why a
        first reading of the algorithm sometimes alarms reviewers — it looks like a nested loop
        and therefore looks like O(n²). It is not. Each iteration of the inner loop either places
        a value at its final destination or detects that the value is already home; in either
        case the count of misplaced values strictly decreases. The amortised cost across the
        entire outer loop is O(n).
      </p>
      <p>
        Correctness rests on a simple cycle argument. Imagine the permutation as a directed graph
        where index <em>i</em> points to index <em>nums[i] − 1</em>. Every node has out-degree
        one, and because the values form a permutation, every node also has in-degree one. The
        graph therefore decomposes into disjoint cycles. Cyclic sort traverses each cycle exactly
        once, performing one swap per misplaced element along the cycle. After the cycle closes,
        all of its members are at their correct indices and no further work is needed in that
        region of the array.
      </p>
      <p>
        The space argument is equally clean. The algorithm rewrites the input in place. It uses
        only a constant number of scalar variables — typically the outer index, a target index
        derived from <em>nums[i]</em>, and a swap temporary. No auxiliary data structures.
        Importantly, this is also why cyclic sort plays well with problems that forbid sign
        marking (the alternative O(1)-space trick): cyclic sort never overloads a value with
        secondary meaning, so it remains valid when the array can contain zero or when negative
        values are reserved for actual data.
      </p>
      <p>
        Complexity: time O(n), extra space O(1), output mutated in place. Stability does not
        apply because the input is treated as a multiset of small integers, not as records with
        secondary keys.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Architecture & Flow</h2>
      <p>
        The canonical template runs an outer index <em>i</em> from 0 to <em>n − 1</em>. At each
        position, compute the target index for <em>nums[i]</em>: for the 1..n variant the target
        is <em>nums[i] − 1</em>; for 0..n − 1 it is <em>nums[i]</em>. If the value at the target
        index is not already the same as <em>nums[i]</em>, swap them and re-evaluate the same
        outer index. Otherwise, advance. The duplicate check (&quot;is the target already holding
        the right value?&quot;) is what prevents infinite loops on inputs with duplicates: once a
        cell holds the correct value, swapping with it would do nothing, so the algorithm moves
        on rather than spinning.
      </p>
      <p>
        Variant one is the bounded range with a sentinel out-of-range value. In <em>Missing
        Number</em>, values are 0..n on an array of length n, so exactly one of those values is
        absent. The target-index computation is <em>nums[i]</em> directly. If <em>nums[i]</em>
        equals n, no legal target exists, so skip. After the pass, the index where{" "}
        <em>nums[i] != i</em> reveals the missing value. The same scaffold solves <em>First
        Missing Positive</em>, except values outside 1..n are also skipped — only positives in
        range are routed, and after the pass the first unmet index identifies the answer.
      </p>
      <p>
        Variant two is the &quot;find duplicates&quot; family. Here the post-pass scan looks for
        cells where <em>nums[i] != i + 1</em>; those cells contain duplicates of values that
        already filled their proper slot. The trick is that the swap loop must check value
        equality, not index equality, before swapping — otherwise duplicates collide and produce
        an infinite loop. The check &quot;if <em>nums[i] == nums[target]</em>, skip&quot; is the
        precise guard.
      </p>
      <ArticleImage
        src="/diagrams/other/leetcode/patterns/cyclic-sort-diagram-1.svg"
        alt="Cyclic sort overview"

      />
      <p>
        Variant three handles the &quot;set mismatch&quot; problem, where exactly one value is
        duplicated and exactly one is missing. Run the cyclic sort once. After the pass, the
        unique cell where <em>nums[i] != i + 1</em> tells you both: the value sitting in that
        cell is the duplicate, and <em>i + 1</em> is the missing one. A single linear scan after
        a single linear placement pass — O(n) total.
      </p>
      <ArticleImage
        src="/diagrams/other/leetcode/patterns/cyclic-sort-diagram-2.svg"
        alt="Walk-through and variants"

      />

      <h2 className="text-2xl font-bold mt-8 mb-4">Trade-offs & Comparisons</h2>
      <p>
        Cyclic sort versus hashset: equal in asymptotic time, but hashset costs O(n) auxiliary
        space and pays the constant factor of hashing. Cyclic sort is preferable whenever the
        input is mutable and the range is bounded; the hashset is preferable when the input must
        not be mutated, when values are unbounded, or when the array is being streamed and cannot
        be revisited.
      </p>
      <p>
        Cyclic sort versus sign-marking (negation trick): both achieve O(n)/O(1). Sign-marking
        flips <em>nums[abs(v) − 1]</em> negative as a presence indicator, then scans for positive
        cells. It is shorter to write but breaks if the array can legitimately contain zero (no
        negative zero in integer arithmetic) or if negatives carry meaning. Cyclic sort survives
        both cases. The negation trick is often slightly faster in practice due to fewer swaps,
        but reviewers find cyclic sort easier to reason about because the post-condition
        (&quot;array is sorted&quot;) is a global structural property, not a per-cell flag.
      </p>
      <p>
        Cyclic sort versus XOR: XOR solves <em>Missing Number</em> in one pass with no auxiliary
        space and no mutation. It is the right choice for that exact problem. It does not
        generalise: XOR cannot find a single duplicate, two missing values, or first missing
        positive. Cyclic sort scales to all of those because it produces a sorted output as a
        by-product, and any subsequent linear scan can extract whatever statistic the problem
        asks for.
      </p>
      <p>
        Cyclic sort versus full sort: full sort is O(n log n) and unnecessary when values are
        bounded and small. The only reason to prefer general sort here is when the input is
        already nearly sorted and you want a stable algorithm; cyclic sort is not stable and is
        not adaptive in the same sense. For unbounded values, of course, cyclic sort does not
        apply and full sort is the only option.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Best Practices</h2>
      <p>
        Compute the target index into a named local variable before the swap test. Reading{" "}
        <em>nums[nums[i] − 1]</em> twice in the same conditional is a common source of off-by-one
        errors and subtle aliasing bugs when the value at <em>i</em> changes mid-expression. Name
        it <em>target</em>, do the equality check against <em>nums[target]</em>, swap, and let
        the outer loop revisit <em>i</em> on the next iteration.
      </p>
      <p>
        Use a <em>while</em> loop inside the <em>for</em>, not a recursive call. The inner work
        is &quot;keep swapping until the cell is settled&quot;, and that is naturally a while
        condition. Recursion adds stack frames for no algorithmic benefit and obscures the
        invariant.
      </p>
      <p>
        Choose the equality guard carefully. For permutation problems (no duplicates), guarding
        on <em>nums[i] != i + 1</em> is correct. For duplicate-tolerant problems, guard on{" "}
        <em>nums[i] != nums[target]</em> instead — the value-level guard prevents the cycle from
        spinning when two equal values both want the same home.
      </p>
      <p>
        Decide upfront whether the range is 1..n or 0..n. The two require different target
        formulas (<em>v − 1</em> versus <em>v</em>), and mixing them up is the most common bug.
        Read the problem statement twice; if the statement says &quot;values from 0 to n&quot; on
        an array of size n, exactly one value is absent and the formula is <em>v</em>.
      </p>
      <p>
        After the placement pass, do a single second pass to extract the answer. Resist the
        temptation to detect anomalies inside the swap loop; the placement pass should remain
        focused on routing, and the analysis pass should remain focused on reading. Two clean
        passes are easier to verify than one tangled one, and the asymptotic cost is identical.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Common Pitfalls</h2>
      <p>
        Infinite loop on duplicates. If the guard is &quot;swap while <em>nums[i] != i + 1</em>
        &quot; and the input contains two copies of the same value, the loop will swap them
        forever. The fix is value-level equality on the target: stop swapping when{" "}
        <em>nums[target]</em> already equals <em>nums[i]</em>.
      </p>
      <p>
        Out-of-range targets. In <em>First Missing Positive</em>, values can be negative, zero,
        or larger than n. Routing them produces an invalid index. Guard the swap with a range
        check: only swap if <em>1 ≤ nums[i] ≤ n</em>. For values outside the range, treat the
        cell as already &quot;done&quot; and advance.
      </p>
      <p>
        Off-by-one in the target formula. The 1..n variant routes value <em>v</em> to index{" "}
        <em>v − 1</em>; the 0..n − 1 variant routes <em>v</em> to <em>v</em>. Picking the wrong
        formula passes small examples and fails on edge cells, especially the last index. When
        debugging, print the target index alongside the value before each swap.
      </p>
      <p>
        Mutating an input the caller did not expect to be mutated. Cyclic sort writes the array
        in place. If the caller later expects the original ordering, you have silently broken
        them. In production code, document this side effect; in interviews, mention it
        explicitly when describing the trade-off versus hashing.
      </p>
      <p>
        Forgetting the post-pass scan. Some candidates run cyclic sort and then immediately
        return — but the algorithm only sorts; it does not extract the missing or duplicated
        value. Always follow the placement pass with a linear scan that maps the final array
        layout back to an answer.
      </p>
      <p>
        Misreading the problem as a counting problem. If the values are not constrained to a
        small range tied to the array length, cyclic sort does not apply at all. A common trap is
        an array of size n with values up to 10^9; the bounded-range premise is gone, and the
        right tool is hashing, sorting, or a different in-place trick like quickselect.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Real-World Use Cases</h2>
      <p>
        Although cyclic sort is most famous as an interview pattern, the underlying idea — route
        each record to its home slot in O(n) when keys are dense small integers — appears in
        practical systems too. Bucket-allocation routines in memory pools use the same logic to
        place free slots into a contiguous prefix. Slot-based scheduler queues that index by
        priority level lay out tasks the same way. Any time you have a dense-key permutation, the
        cyclic-sort routing is the optimal placement strategy.
      </p>
      <p>
        On the Leetcode side, the canonical problem set is tight and well-known. <em>268. Missing
        Number</em> is the simplest application: values 0..n, one is missing, return it.{" "}
        <em>448. Find All Numbers Disappeared in an Array</em> generalises to multiple missing
        values, returned as a list. <em>287. Find the Duplicate Number</em> finds the single
        duplicate; cyclic sort solves it cleanly, though Floyd&apos;s tortoise-and-hare is the
        more famous answer.
      </p>
      <p>
        <em>442. Find All Duplicates in an Array</em> handles up to <em>n</em> duplicates where
        each value appears once or twice. <em>645. Set Mismatch</em> asks for one duplicate and
        one missing simultaneously, neatly solved by a single cyclic sort followed by a single
        anomaly scan. <em>41. First Missing Positive</em> is the hardest of the family; the
        problem is defined on arrays that may contain negatives, zeros, and values outside 1..n,
        but the cyclic-sort pattern still applies because routing simply skips out-of-range
        values, leaving them in place to be ignored during the post-pass scan.
      </p>
      <ArticleImage
        src="/diagrams/other/leetcode/patterns/cyclic-sort-diagram-3.svg"
        alt="Canonical Leetcode problems"

      />
      <p>
        Beyond the named six, expect variants in interviews that mix the pattern with a twist —
        for instance, &quot;find the smallest missing positive that is also even&quot;, or
        &quot;return both the duplicate and the count of missing values&quot;. The pattern
        adapts: do the placement pass once, then run whichever post-pass scan answers the
        specific question. The placement pass is the reusable part; the scan is bespoke.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Common Interview Questions</h2>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li><strong>Why is cyclic sort O(n) when it has a nested loop?</strong> Because each inner
        iteration places exactly one value at its final position, and there are at most n
        misplaced values. The total work across all inner iterations is bounded by n, regardless
        of how it is distributed across outer iterations. Amortised analysis, not worst-case
        per-step, gives the right bound.</li>
        <li><strong>Prove the algorithm terminates on inputs with duplicates.</strong> The guard
        compares values, not indices: the loop stops swapping as soon as the target cell already
        holds the same value. So duplicates are recognised on first encounter and do not trigger
        further swaps. The number of swaps therefore strictly decreases the count of unsettled
        cells.</li>
        <li><strong>How does cyclic sort compare to negation marking?</strong> Both achieve O(n)/O(1)
        on the missing-positive family. Negation is faster in practice but breaks when the array
        contains zero or when sign already carries meaning. Cyclic sort is more robust because it
        never repurposes value bits.</li>
        <li><strong>What if the input is read-only?</strong> Cyclic sort does not apply — it requires
        mutation. Fall back to hashing for O(n)/O(n), or sort a copy for O(n log n)/O(n). XOR
        works for the single-missing case without mutation or extra space.</li>
        <li><strong>Generalise to find k missing values.</strong> Run cyclic sort, then scan for all
        indices where <em>nums[i] != i + 1</em> and collect <em>i + 1</em> from each. This is
        exactly Leetcode 448. The placement pass does not change; only the scan does.</li>
        <li><strong>How do you handle First Missing Positive?</strong> Same pattern with two extra
        guards: skip values that are non-positive, and skip values larger than n. After the pass,
        the first index where <em>nums[i] != i + 1</em> identifies the answer. If every index is
        correct, the answer is <em>n + 1</em>.</li>
        <li><strong>What is the relation to Floyd&apos;s cycle detection?</strong> Both treat the
        array as a function. Floyd traces the implied linked list to find a cycle entry; cyclic
        sort routes each value along the cycle until every node is at home. They share the cycle
        intuition but solve different questions.</li>
        <li><strong>Could you do this without swaps, using only assignments?</strong> Yes — by
        following the cycle directly and saving the displaced value in a single temporary, you
        can complete a cycle with n + 1 reads and n writes instead of n swaps. The reduction in
        memory traffic is small but real, and a senior interviewer may probe whether you know it.</li>
        <li><strong>Edge cases to test:</strong> empty array, single element, all duplicates, the
        missing value is the largest, the missing value is the smallest, every value is the same.
        Walking through these on a whiteboard is the quickest way to expose off-by-one errors in
        the target formula.</li>
      </ol>
<h2 className="text-2xl font-bold mt-8 mb-4">References & Further Reading</h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Grokking the Coding Interview&apos;s &quot;Cyclic Sort&quot; chapter is the canonical
        introduction; its problem progression maps onto the Leetcode list above almost verbatim.
        Educative.io&apos;s pattern course covers the same material with worked examples.
        NeetCode&apos;s problem walkthroughs for 41 and 287 contrast cyclic sort with the
        alternative tricks (negation, Floyd) and are worth watching after you have solved each
        problem at least once.</li>
        <li>For the underlying algorithmic theory, Knuth&apos;s <em>The Art of Computer Programming</em>
        Volume 3 discusses cycle structure of permutations in depth, and the &quot;in-place
        permutation&quot; section in Chapter 1 of Sedgewick&apos;s <em>Algorithms</em> derives the
        cycle-counting argument used in the amortised analysis. Both are heavier than interview
        prep requires but illuminate why the algorithm works.</li>
        <li>On the Leetcode side, the canonical problem list to grind is: 268, 448, 287, 442, 645,
        41. Solving all six is enough to internalise the pattern; the seventh and beyond are
        mostly variations on guards and post-pass scans. After that, time spent on the pattern
        yields diminishing returns — move on to <em>Top K Elements</em> or <em>K-way Merge</em>,
        which appear far more often in real coding rounds.</li>
      </ul>
</ArticleLayout>
  );
}
