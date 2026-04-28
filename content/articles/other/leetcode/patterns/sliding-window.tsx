"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "sliding-window",
  title: "Sliding Window Pattern",
  description:
    "Linear-time technique for contiguous-range problems where a window grows and shrinks across an array or string while maintaining an aggregate — the canonical pattern for substring, subarray, and rate-counting questions.",
  category: "other",
  subcategory: "patterns",
  slug: "sliding-window",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-25",
  tags: ["sliding-window", "leetcode", "patterns", "substring", "subarray"],
  relatedTopics: ["two-pointer", "monotonic-queue", "hash-table"],
};

export default function SlidingWindowArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
      <p className="mb-4">
        Sliding window is a parallel two-pointer technique specialised for problems where the answer depends on a
        contiguous range A[L..R] of an array or string and on an aggregate over that range — sum, count, distinct
        characters, max, frequency map. Both pointers walk forward; the window expands by advancing R and shrinks by
        advancing L. By updating the aggregate incrementally, the total work is amortised O(n) instead of the O(n²)
        cost of recomputing for each candidate window.
      </p>
      <p className="mb-4">
        The pattern has two shapes. <strong>Fixed-size sliding window</strong>: the window length is a given constant
        k; slide it across the input maintaining a running aggregate. <strong>Variable-size sliding window</strong>:
        the window length adapts to a predicate; expand R when the predicate is satisfied, shrink L when it&apos;s
        violated. Variable windows further split into two sub-flavours: longest-with-property (record after each
        valid expansion) and shortest-with-property (record before each shrink).
      </p>
      <p className="mb-4">
        Recognition signals are concrete and reliable. &quot;Longest / shortest contiguous substring or subarray
        with property X&quot;, &quot;sum of every window of size k&quot;, &quot;does pattern P appear as an anagram
        of a window in S&quot; — all sliding-window. The predicate must be over the window contents, not over
        endpoints alone (those are two-pointer). The aggregate must be incrementally maintainable in O(1) or O(log n)
        per pointer move (sum, count, hashmap, multiset, monotonic deque).
      </p>
      <p className="mb-4">
        For staff interviews, the key skill is choosing the right shape (fixed vs. variable, longest vs. shortest)
        and choosing the right aggregate data structure (counter, multiset, deque). Variable-window bugs around when
        to record the answer relative to shrinks are the most common interview failure mode — get this right and
        most variable-window problems collapse to a 12-line template.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
      <p className="mb-4">
        <strong>Amortised O(n) argument.</strong> R advances n times across the loop. L advances at most n times
        total (it only moves forward and never past R). So the combined pointer movement is bounded by 2n, and as
        long as the per-step aggregate update is O(1) or O(log n), the total work is O(n) or O(n log n). This is the
        whole reason sliding window beats the O(n²) brute force.
      </p>
      <p className="mb-4">
        <strong>Aggregate maintenance.</strong> The window state must support two operations: add(x) when R advances,
        remove(x) when L advances. For sum, both are O(1) integer addition. For frequency-based predicates (longest
        with at most k distinct characters), state is a hashmap from char to count, plus a running &quot;number of
        distinct chars&quot; counter — O(1) amortised per move. For window max / min, a monotonic deque gives O(1)
        amortised; a sorted multiset gives O(log n).
      </p>
      <p className="mb-4">
        <strong>Longest-with-property template.</strong> Initialise L = 0, best = 0, state empty. For each R from 0
        to n − 1: add A[R] to state; while predicate is violated, remove A[L] and increment L; record best = max(best,
        R − L + 1). The window&apos;s contents always satisfy the predicate after the inner loop. The recorded best
        is the longest such window.
      </p>
      <p className="mb-4">
        <strong>Shortest-with-property template.</strong> Initialise L = 0, best = ∞, state empty. For each R: add
        A[R]; while predicate is satisfied, record best = min(best, R − L + 1), remove A[L], increment L. The order
        of operations is reversed: we want to record before each shrink because the shrink may invalidate the
        predicate. After the loop, best is the shortest such window.
      </p>
      <p className="mb-4">
        <strong>Fixed-size window.</strong> Slide a window of length k. Add A[R]; if R − L + 1 &gt; k, remove A[L]
        and increment L. After each step where the window is full, record the result. The aggregate is maintained
        with the same add/remove pair as variable windows, just with a length-controlled shrink instead of
        predicate-controlled.
      </p>
      <p className="mb-4">
        <strong>Predicate vs. aggregate.</strong> The predicate is what defines a valid window; the aggregate is what
        you compute over a valid window. Sometimes they coincide (sum &lt; target uses the sum as both predicate and
        aggregate), sometimes they differ (longest-with-at-most-k-distinct: predicate is &quot;|distinct| ≤ k&quot;,
        aggregate is window length).
      </p>
      <ArticleImage
        src="/diagrams/other/leetcode/patterns/sliding-window-diagram-1.svg"
        alt="Sliding-window pattern: fixed and variable forms"
        caption="Fixed-size: window length k, slide one step. Variable-size: expand R, shrink L by predicate."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
      <p className="mb-4">
        Most sliding-window problems can be expressed using two templates. The longest-with-property template is the
        common case for substring and subarray maximisation. The shortest-with-property template is for
        minimisation. Memorise both and pick by problem shape.
      </p>
      <p className="mb-4">
        <strong>Aggregate choice by predicate.</strong> &quot;Sum &lt; target&quot; → integer running sum.
        &quot;At most k distinct characters&quot; → hashmap of char counts plus a running distinct count. &quot;No
        repeating characters&quot; → set of characters in window, or hashmap from char to last-seen index for the
        jump-ahead variant. &quot;Window contains all characters of pattern P&quot; → two hashmaps (P&apos;s
        target counts vs. window&apos;s current counts) plus a &quot;matches&quot; counter that tracks how many
        characters in P have hit their target count in the window.
      </p>
      <p className="mb-4">
        For Minimum Window Substring (Leetcode 76), the aggregate is the &quot;matches&quot; counter — number of
        distinct characters in P whose count in the window meets or exceeds the target. The window is valid when
        matches == |distinct(P)|. The shortest-with-property template applies. This is the most-asked variable-window
        problem and a standard staff-level filter.
      </p>
      <p className="mb-4">
        For Longest Substring Without Repeating Characters (Leetcode 3), two implementations are common. The
        textbook one uses a set: add s[R]; while s[R] is already in the set, remove s[L] and advance L. The
        jump-ahead variant uses a hashmap of last-seen indices: when s[R] was last seen at index j ≥ L, jump L to
        j + 1 directly. Same O(n), better constants.
      </p>
      <p className="mb-4">
        For Sliding Window Maximum (Leetcode 239), the aggregate is a monotonic deque (decreasing from front to
        back). Push R; pop from the back while back &lt; A[R]; pop from the front when its index &lt; L. The front
        of the deque is the window max. O(n) amortised, O(k) space. (See the separate Monotonic Queue article.)
      </p>
      <p className="mb-4">
        For Permutation in String (Leetcode 567) and Find All Anagrams (Leetcode 438), the aggregate is two equal-size
        hashmaps. Maintain a &quot;matches&quot; counter to compare them in O(1) per move. Each move that crosses the
        zero boundary in a count adjusts matches up or down by 1. Window is valid when matches == |distinct(P)|.
      </p>
      <ArticleImage
        src="/diagrams/other/leetcode/patterns/sliding-window-diagram-2.svg"
        alt="Sliding-window templates: longest and shortest with property"
        caption="Longest-with-P: shrink only on violation, record after. Shortest-with-Q: shrink while valid, record before. Order matters."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
      <p className="mb-4">
        Sliding window vs. <strong>two-pointer</strong>: same skeleton, different predicate scope. Two-pointer
        predicates depend on A[L] and A[R] only; sliding-window predicates depend on the window contents A[L..R].
        Two Sum II is two-pointer; Minimum Window Substring is sliding-window. The aggregate is the differentiator.
      </p>
      <p className="mb-4">
        Sliding window vs. <strong>prefix sum</strong>: prefix sums solve range-sum queries in O(1) after O(n)
        preprocessing — useful when ranges are arbitrary or non-contiguous in time. Sliding window is for problems
        where ranges are processed in monotone order. Prefix sum + hashmap (Subarray Sum Equals K, Leetcode 560) is
        the natural extension when the predicate is &quot;exactly equal&quot; rather than &quot;at most&quot; or
        &quot;at least.&quot;
      </p>
      <p className="mb-4">
        Sliding window vs. <strong>brute force</strong>: brute force is O(n²) — for each L, scan R until predicate
        breaks. Sliding window is O(n) by reusing work across L moves. The brute force is sometimes acceptable for n
        ≤ 1000 and is always a good warm-up to articulate the optimisation.
      </p>
      <p className="mb-4">
        Sliding window vs. <strong>dynamic programming</strong>: some sliding-window problems have DP formulations
        (e.g., longest substring with conditions can sometimes be expressed as DP[R] = best ending at R). For
        contiguous-range problems with monotone aggregates, sliding window is dramatically simpler. Reach for DP
        when the predicate isn&apos;t monotone or the answer requires non-contiguous selection.
      </p>
      <p className="mb-4">
        Sliding window vs. <strong>monotonic queue/deque</strong>: monotonic queue is the data structure inside
        sliding-window-max problems. They&apos;re not alternatives — they compose. Treat monotonic queue as the
        aggregate maintenance technique for window max/min.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
      <p className="mb-4">
        Pick the right template for the problem. Longest-with-property: shrink while invalid, record after the inner
        loop. Shortest-with-property: shrink while valid, record before the shrink. Mixing them up gives off-by-one
        bugs that pass small tests and fail large ones.
      </p>
      <p className="mb-4">
        Choose the simplest aggregate that the predicate needs. A set is enough for distinctness; a hashmap of
        counts is needed when duplicates matter; a multiset is needed when order statistics (median, max, min)
        matter; a monotonic deque is needed for window-max/min with O(1) amortised access.
      </p>
      <p className="mb-4">
        For predicates over character counts, maintain a &quot;matches&quot; counter alongside the count map. The
        counter changes by ±1 only when a count crosses zero or the target value — that&apos;s the O(1) per-move
        trick that keeps total complexity O(n).
      </p>
      <p className="mb-4">
        Initialise L = 0 outside the for-R loop. The classic bug is to reset L to 0 inside the loop, which turns the
        algorithm into a brute-force quadratic. The whole point of sliding window is that L is monotone non-decreasing.
      </p>
      <p className="mb-4">
        For fixed-size windows, decide whether to record after every R or only once the window is full (R ≥ k − 1).
        Off-by-one here is the #1 fixed-window bug.
      </p>
      <p className="mb-4">
        For Minimum Window Substring and similar covers-pattern problems, the &quot;matches&quot; counter is updated
        only when a count transitions across the target value — not on every increment or decrement. This is
        critical: tracking matches naively is O(window size) per move.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
      <p className="mb-4">
        <strong>Recording the answer at the wrong step in a variable window.</strong> Longest: record after the inner
        shrink loop. Shortest: record before each shrink. Get this wrong and the algorithm reports stale or
        invalid windows.
      </p>
      <p className="mb-4">
        <strong>Forgetting to advance L on shrink.</strong> The inner loop must both update the aggregate (remove A[L])
        and advance L. Missing the L += 1 produces an infinite loop.
      </p>
      <p className="mb-4">
        <strong>Using a set instead of a count map for hashmap-based windows.</strong> Sets handle distinctness, not
        multiplicity. &quot;Longest substring with at most k distinct characters&quot; needs counts to know when the
        last copy of a char leaves the window.
      </p>
      <p className="mb-4">
        <strong>Recomputing the aggregate inside the loop.</strong> Calling sum(A[L..R]) at each step is O(n²). The
        whole point of sliding window is incremental maintenance. Same for distinct count, max, etc.
      </p>
      <p className="mb-4">
        <strong>Off-by-one in window length.</strong> Window length is R − L + 1, not R − L. This bug causes wrong
        answers on size-1 windows and on length-comparison record steps.
      </p>
      <p className="mb-4">
        <strong>Not handling the &quot;no valid window&quot; case for shortest problems.</strong> Initialise best =
        ∞; if best remains ∞ at the end, return 0 or whatever the problem specifies.
      </p>
      <p className="mb-4">
        <strong>Treating &quot;exactly k distinct&quot; as if it were a single sliding-window predicate.</strong>
        It&apos;s not — &quot;exactly k&quot; isn&apos;t monotone. Use the trick &quot;exactly k = at most k − at most
        (k − 1)&quot; (Leetcode 992).
      </p>
      <p className="mb-4">
        <strong>Forgetting to skip stale deque entries in monotonic-queue variants.</strong> When L advances past the
        index at the front of the deque, pop the front. Otherwise the &quot;max&quot; lookup returns a value outside
        the current window.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
      <p className="mb-4">
        Sliding window is the dominant technique in <strong>rate limiting</strong> (count requests in the last
        N seconds), <strong>streaming analytics</strong> (rolling averages, p99 latencies over a 5-minute window),
        <strong> network packet inspection</strong> (signatures inside payload windows), and <strong>video / audio
        processing</strong> (fixed-window FFT, voice activity detection). The same expand-and-shrink discipline
        applies; the aggregate is whatever metric the application cares about.
      </p>
      <p className="mb-4">
        Below are the canonical Leetcode problems that map to this pattern. Each tests a different aggregate.
      </p>
      <p className="mb-4">
        <strong>3. Longest Substring Without Repeating Characters.</strong> Classic variable-longest. Aggregate: set
        of characters in window, or hashmap of last-seen index for the jump-ahead form.
      </p>
      <p className="mb-4">
        <strong>76. Minimum Window Substring.</strong> The hard one. Variable-shortest. Aggregate: hashmap of target
        counts (from pattern P) plus a hashmap of window counts plus a &quot;matches&quot; counter. The matches
        counter increments when a window count first hits its target and decrements when it drops below.
      </p>
      <p className="mb-4">
        <strong>209. Minimum Size Subarray Sum.</strong> Variable-shortest with sum aggregate. Sum &gt;= target
        defines validity; record min length on each shrink.
      </p>
      <p className="mb-4">
        <strong>340. Longest Substring with At Most K Distinct Characters.</strong> Variable-longest with
        count-of-distinct aggregate. The pattern problem for at-most-k variants.
      </p>
      <p className="mb-4">
        <strong>424. Longest Repeating Character Replacement.</strong> Variable-longest. Predicate: window length −
        max-frequency-in-window ≤ k. Aggregate: hashmap of counts plus running max-frequency. Subtle: when shrinking,
        max-frequency is allowed to be stale (it&apos;s an upper bound) — the algorithm is still correct because the
        answer is monotone in window length.
      </p>
      <p className="mb-4">
        <strong>438. Find All Anagrams in a String / 567. Permutation in String.</strong> Fixed-size window of length
        |P|. Aggregate: count map plus matches counter. Return all start indices where matches == |distinct(P)|.
      </p>
      <p className="mb-4">
        <strong>239. Sliding Window Maximum.</strong> Fixed-size window with monotonic deque aggregate. Front of
        deque is max; pop stale indices from front, pop dominated values from back. O(n) amortised.
      </p>
      <p className="mb-4">
        <strong>904. Fruit Into Baskets.</strong> Variable-longest with at-most-2-distinct constraint — same template
        as 340 with k = 2.
      </p>
      <p className="mb-4">
        <strong>992. Subarrays with K Different Integers.</strong> Hard variant. Use the &quot;exactly k = at most k
        − at most (k − 1)&quot; trick to convert to two at-most-k counts.
      </p>
      <p className="mb-4">
        <strong>1456. Maximum Vowels in Substring of Given Length.</strong> Fixed-size window with vowel-count
        aggregate. Easy template-fitter.
      </p>
      <ArticleImage
        src="/diagrams/other/leetcode/patterns/sliding-window-diagram-3.svg"
        alt="Canonical sliding-window Leetcode problems by flavour"
        caption="Fixed: 567, 438, 643, 1456, 239. Variable longest: 3, 340, 424, 904. Variable shortest: 76, 209."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li><strong>Walk through Minimum Window Substring.</strong> Build a target count map from P. Maintain a window
        count map and a matches counter (number of chars in P whose window count meets target). Expand R, updating
        window count; if the new count of A[R] hits target, increment matches. While matches == |distinct(P)|, the
        window covers P — record min length, then shrink: if the count of A[L] is at target, decrement matches; then
        decrement count and L. Continue. O(|S| + |P|) time.</li>
        <li><strong>Why is the amortised cost O(n)?</strong> R moves n times. L moves at most n times (monotone forward,
        bounded by n). Each pointer move does O(1) aggregate work. Total ≤ 2n × O(1) = O(n).</li>
        <li><strong>How do you handle &quot;exactly k distinct&quot;?</strong> Compute &quot;at most k&quot; minus
        &quot;at most (k − 1)&quot;. Direct &quot;exactly k&quot; isn&apos;t monotone — shrinking might violate it,
        but it might still be valid later, so the standard expand-shrink discipline doesn&apos;t work.</li>
        <li><strong>What aggregate does Sliding Window Maximum use?</strong> Monotonic decreasing deque storing indices.
        Push back: pop while A[back] ≤ A[R], then push R. Pop front when front index &lt; L. Front index has the max.</li>
        <li><strong>How does the &quot;jump-ahead&quot; variant of Longest Substring Without Repeating Characters
        work?</strong> Maintain a hashmap from char to last-seen index. When you encounter A[R], check if its
        last-seen index ≥ L; if so, jump L to last_seen + 1. Update last_seen to R. Always update best. O(n), O(min(n,
        |alphabet|)).</li>
        <li><strong>Why doesn&apos;t shrinking break Longest Repeating Character Replacement when max-frequency goes
        stale?</strong> Because the answer is monotone: once we found a window of length L that satisfies the
        constraint, we never accept a smaller best. Shrinking with a stale max-frequency only fails to expand the
        window earlier — it doesn&apos;t produce a wrong answer.</li>
        <li><strong>Compare sliding window with prefix sum + hashmap for &quot;subarray sum equals k&quot;.</strong>
        Sliding window only works for sums with a monotone direction (all-positive arrays). For general integer
        arrays with negatives, the running sum isn&apos;t monotone, so shrinking isn&apos;t safe — use prefix sum +
        hashmap instead. Leetcode 209 is sliding window; Leetcode 560 is prefix sum + hashmap.</li>
        <li><strong>What&apos;s the &quot;matches counter&quot; trick and why is it needed?</strong> Comparing two
        hashmaps for equality is O(|alphabet|) per move. The matches counter tracks how many keys are at-target;
        increment when a key transitions to target and decrement when it leaves target. The hashmap comparison
        becomes O(1).</li>
        <li><strong>Sliding window with negative numbers — what breaks?</strong> Predicate monotonicity. Adding a
        negative number can decrease the sum, so &quot;sum &lt; target&quot; isn&apos;t monotone in R — expanding R
        doesn&apos;t move the predicate in one direction. Use prefix sum + hashmap or DP instead.</li>
        <li><strong>Design a rate limiter with sliding window.</strong> Maintain a deque of timestamps; on each request,
        pop from the front while front &lt; now − window; if size &lt; limit, accept and push; else reject. O(1)
        amortised. For very high QPS, use bucketed counts instead of per-request timestamps.</li>
      </ol>
<h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Leetcode&apos;s &quot;Sliding Window&quot; tag has 100+ problems graded easy to hard. Work through 643, 3, 76,
        209, 340, 424, 438, 567, 239, 904, 992 in roughly that order. Grokking Coding Patterns groups sliding window
        as one of its top three patterns; the course&apos;s decision tree (fixed vs. variable, longest vs. shortest)
        is exactly the framing this article uses.</li>
        <li>For the formal amortised analysis, see CLRS chapter 17 — the same potential-function argument that bounds
        dynamic-array doubling bounds the total pointer movement here.</li>
        <li>For real-world applications, the rate-limiter chapter of &quot;System Design Interview&quot; (Alex Xu) walks
        through fixed window, sliding window log, and sliding window counter implementations and their trade-offs.
        The streaming analytics chapter of &quot;Designing Data-Intensive Applications&quot; covers windowed
        aggregations in Kafka Streams and Flink, where sliding window is a first-class API.</li>
        <li>For interview prep, the litmus test is being able to state the correct template (longest vs. shortest) and
        identify the aggregate (counts, set, deque, matches counter) within 30 seconds of reading the problem. Drill
        the canonical 10 problems above until that recognition is automatic.</li>
      </ul>
    </ArticleLayout>
  );
}
