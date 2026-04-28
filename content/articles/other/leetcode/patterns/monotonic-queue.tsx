"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "monotonic-queue",
  title: "Monotonic Queue Pattern",
  description:
    "A deque maintained in monotone order with eviction at both ends — the linear-time tool for sliding-window max / min and DP transitions where the optimum comes from a bounded suffix.",
  category: "other",
  subcategory: "patterns",
  slug: "monotonic-queue",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-26",
  tags: ["monotonic-queue", "leetcode", "patterns", "sliding-window", "deque"],
  relatedTopics: ["monotonic-stack", "queues", "sliding-window"],
};

export default function MonotonicQueueArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
      <p className="mb-4">
        A monotonic queue is a deque maintained in monotone order along its length — values strictly
        decreasing from front to back for window maximum, strictly increasing for window minimum. Two
        eviction rules preserve the invariant: on push at the back, evict back-elements that violate the
        order; on window slide, evict the front element if its index has fallen outside the window. Each
        element is enqueued once and dequeued once across the whole input, giving amortised O(n) total work.
      </p>
      <p className="mb-4">
        The pattern is the linear-time answer to sliding-window max and min. Brute force scans the window
        for each position in O(k), giving O(nk) total. A heap gives O(n log k). The monotonic deque gives
        strict O(n), independent of k. The trick is recognising that if A[j] &lt; A[i] and j &lt; i, then
        A[j] can never be the max of any window containing both — i dominates j. The deque keeps only
        candidate dominators.
      </p>
      <p className="mb-4">
        Recognition signals are concrete. &quot;Maximum / minimum in every sliding window of size k&quot;,
        &quot;longest subarray with max − min ≤ limit&quot;, &quot;shortest subarray with sum ≥ k&quot;,
        &quot;DP transition where dp[i] = max of dp[i − k..i − 1] plus something&quot; — all monotonic
        deque. The pattern hides inside DP problems whenever the recurrence reads &quot;take the best of
        the last k states and add A[i]&quot;.
      </p>
      <p className="mb-4">
        For staff interviews, the lift is recognising the pattern beneath surface variation — a DP-with-
        bounded-window is monotonic-queue at heart, even though the question is phrased as &quot;count
        ways&quot; or &quot;maximum score&quot;. The data discipline is identical to monotonic stack; what
        differs is the second eviction rule for elements falling out of the window at the front.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
      <p className="mb-4">
        <strong>Two eviction rules.</strong> First: when pushing index i, evict back elements whose value
        is ≤ A[i] (for max) — they can no longer be the max of any future window because i is larger and
        more recent. Second: after pushing, if the front index has fallen outside the window (front ≤ i −
        k), evict the front. The two together preserve the &quot;front is always the current max&quot;
        invariant.
      </p>
      <p className="mb-4">
        <strong>Push-once-pop-once amortisation.</strong> Each index is pushed exactly once and popped at
        most once (either from the back via the order rule, or from the front via the window rule). Total
        work across n indices is O(n). The k parameter never appears in the complexity — that is the win
        over a heap-based O(n log k) solution.
      </p>
      <p className="mb-4">
        <strong>Strict vs. weak.</strong> Strict (&lt;) evicts on equality — the most recent equal value
        wins because it has a longer remaining lifespan. Weak (≤) keeps both — useful when the question
        cares about specific occurrences. Default to strict for max / min queries; relax only when ties
        carry information.
      </p>
      <p className="mb-4">
        <strong>Push the index, not the value.</strong> The window check at the front needs the index to
        compare against i − k. Storing values alone forces a parallel index deque or makes the window
        check impossible. Push i; look up A[i] when comparing.
      </p>
      <p className="mb-4">
        <strong>Two deques for max-and-min queries.</strong> When the question needs both the window max
        and min (1438 — &quot;max − min ≤ limit&quot;), maintain two deques in opposite orders. Each value
        is independently maintained in each deque; total work is still O(n) because the amortisation
        applies per deque.
      </p>
      <p className="mb-4">
        <strong>DP integration.</strong> When dp[i] = max(dp[j] for j in [i − k, i − 1]) + A[i], the inner
        max is exactly sliding-window max over the dp array. Maintain a deque of (j, dp[j]) and look up
        dp[deque.front()] to compute dp[i] in O(1) amortised. Use this on 1696 (Jump Game VI) and any
        DP whose transition reads &quot;best of last k&quot;.
      </p>
      <p className="mb-4">
        <strong>Complexity.</strong> O(n) time and O(k) space (the deque holds at most k indices). The k
        bound is conservative; in practice the deque is smaller because of order evictions.
      </p>

      <ArticleImage
        src="/diagrams/other/leetcode/patterns/monotonic-queue-diagram-1.svg"
        alt="Monotonic queue definition and template"
        caption="Definition with two eviction rules and the canonical sliding-window-max template — push indices, evict at both ends."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
      <p className="mb-4">
        <strong>Sliding-window max template.</strong> Empty deque of indices. For i from 0 to n − 1: while
        deque non-empty and A[deque.back()] ≤ A[i], pop back. Push i. If deque.front() ≤ i − k, pop front.
        If i ≥ k − 1, append A[deque.front()] to result. The four steps order matters — push before window
        check before result emission.
      </p>
      <p className="mb-4">
        <strong>Sliding-window min template.</strong> Identical, with the order inequality reversed
        (A[deque.back()] ≥ A[i]). The structural skeleton is unchanged.
      </p>
      <p className="mb-4">
        <strong>Variable-window monotonic deque.</strong> 1438 (Longest Subarray with Absolute Diff ≤
        Limit) uses two deques. Expand R as long as max − min ≤ limit. When violated, shrink L past the
        offending front; evict any deque-front whose index has fallen out. Record best window length.
      </p>
      <p className="mb-4">
        <strong>Prefix-sum + monotonic deque for shortest-subarray-with-sum-at-least-K (862).</strong>
        Build prefix sums P. Maintain a monotonic-increasing deque of indices into P. For each i: while
        P[i] − P[deque.front()] ≥ K, record best length and pop front. While deque non-empty and
        P[deque.back()] ≥ P[i], pop back (those prefixes are dominated). Push i. The two evictions yield
        O(n).
      </p>
      <p className="mb-4">
        <strong>DP-with-deque template (1696).</strong> dp[i] = A[i] + max(dp[j] for j in [i − k, i − 1]).
        Maintain a deque of indices. Before computing dp[i], evict front if out of window. dp[i] = A[i] +
        dp[deque.front()]. After computing, evict back while dp[deque.back()] ≤ dp[i], then push i.
        Single-pass O(n).
      </p>
      <p className="mb-4">
        <strong>Bidirectional max-min for window difference.</strong> When the predicate is &quot;max −
        min ≤ limit&quot;, run two monotonic deques in lockstep. Both follow their own eviction rules; the
        sliding window&apos;s L pointer must advance past whichever front signals the violation.
      </p>
      <p className="mb-4">
        <strong>Circular variant (918, Maximum Sum Circular Subarray).</strong> Run Kadane plus a
        monotonic-deque sliding-window min over the prefix array of length 2n to handle the wrap-around.
        The deque finds the smallest prefix in a window of size n, which corresponds to the best
        wrap-around subarray.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
      <p className="mb-4">
        <strong>Monotonic deque vs. heap.</strong> Both solve sliding-window max / min. Heap is O(n log k)
        with lazy deletion; deque is O(n). For large k, deque wins by an order of magnitude. Heap is
        easier to extend to k-th order statistics and to weighted priorities; deque is strictly better
        for max / min only.
      </p>
      <p className="mb-4">
        <strong>Monotonic deque vs. multiset / TreeMap.</strong> A sorted container gives O(log k) per
        operation and supports arbitrary order queries. Deque gives O(1) amortised but only for the
        running max / min. Use the multiset when you need k-th, median, or range queries inside the
        window; use the deque for the strict max / min.
      </p>
      <p className="mb-4">
        <strong>Monotonic queue vs. monotonic stack.</strong> Stack handles &quot;nearest greater on a
        fixed array&quot;; queue handles &quot;max in a sliding window&quot;. Same eviction discipline at
        the back, plus a window-eviction at the front. The stack is a degenerate queue with no front
        eviction.
      </p>
      <p className="mb-4">
        <strong>Monotonic deque vs. sparse table.</strong> Sparse table gives O(1) range max on a static
        array after O(n log n) preprocessing, for arbitrary [l, r]. Deque only solves sliding (uniform
        size or monotone) windows but with O(n) total time and O(k) space. Use sparse table for
        arbitrary-range queries; deque for streaming.
      </p>
      <p className="mb-4">
        <strong>Monotonic deque vs. segment tree.</strong> Segment tree handles arbitrary point updates
        plus range max in O(log n). Deque handles only static arrays with sliding windows. The deque
        wins on simplicity for that narrow case; segment tree generalises.
      </p>
      <p className="mb-4">
        <strong>Why a deque, not a queue?</strong> The order-violation eviction happens at the back
        (pop_back), the window-aging eviction at the front (pop_front). A plain queue does not support
        pop_back; a deque does. Use ArrayDeque (Java), collections.deque (Python), std::deque (C++).
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
      <p className="mb-4">
        <strong>Store indices, not values.</strong> The window-aging check needs the index. Storing values
        alone forces a parallel deque of indices, doubling the bookkeeping.
      </p>
      <p className="mb-4">
        <strong>Order the four steps consistently.</strong> Pop-back-on-order, push, pop-front-on-window,
        emit-result. Reordering — e.g., emitting before window eviction — produces a stale result for the
        first valid window.
      </p>
      <p className="mb-4">
        <strong>Pick strict over weak unless ties matter.</strong> Strict (&lt;) drops dominated equals;
        weak (≤) keeps them. Strict produces a smaller deque and the same answer for max / min queries.
        Weak only matters when the question wants a specific occurrence count.
      </p>
      <p className="mb-4">
        <strong>Document the invariant.</strong> &quot;deque holds indices in [i − k + 1, i]; A-values
        strictly decreasing from front to back&quot;. With this comment, any later edit either preserves
        the invariant or breaks it visibly.
      </p>
      <p className="mb-4">
        <strong>Two deques for max-and-min.</strong> When both are needed, maintain two independent
        deques. Total work is still O(n) — each value is touched O(1) per deque amortised.
      </p>
      <p className="mb-4">
        <strong>For DP, integrate the deque into the recurrence directly.</strong> Don&apos;t compute dp,
        then run a separate sliding-max pass. Maintain the deque inline so each dp[i] is O(1) amortised.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
      <p className="mb-4">
        <strong>Forgetting the window-aging eviction.</strong> Without front-eviction, an old index
        remains in the deque indefinitely and the &quot;max&quot; eventually points outside the window.
        The check must run after every push.
      </p>
      <p className="mb-4">
        <strong>Wrong inequality direction.</strong> Decreasing deque uses A[back] ≤ A[i] for eviction
        (max queries). Reversing the inequality silently turns it into a min queue and produces wrong
        answers.
      </p>
      <p className="mb-4">
        <strong>Emitting before the window is full.</strong> The first valid window ends at index k − 1.
        Emitting before then produces partial-window results.
      </p>
      <p className="mb-4">
        <strong>Using a list with pop(0) in Python.</strong> O(n) per call. Use collections.deque, which
        is O(1) at both ends.
      </p>
      <p className="mb-4">
        <strong>Storing values without indices.</strong> Window-aging requires index comparison. Storing
        only values works for the deque content but breaks the eviction rule.
      </p>
      <p className="mb-4">
        <strong>Treating monotonic queue as a heap.</strong> The deque only knows the running max / min,
        not order statistics. Asking for the second-largest in the window is not a deque problem — use a
        sorted container or two heaps.
      </p>
      <p className="mb-4">
        <strong>Off-by-one in the front-eviction check.</strong> The condition is deque.front() ≤ i − k
        (the front has aged out). Using &lt; instead of ≤ keeps a stale front for one extra iteration.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases (Canonical Leetcode Problems)</h2>
      <p className="mb-4">
        <strong>239. Sliding Window Maximum.</strong> The flagship template — push, evict, age, emit.
      </p>
      <p className="mb-4">
        <strong>1438. Longest Subarray with Absolute Diff ≤ Limit.</strong> Two deques (max + min) plus a
        variable window. Shrink L when max − min &gt; limit, evicting deque fronts as needed.
      </p>
      <p className="mb-4">
        <strong>862. Shortest Subarray with Sum at Least K.</strong> Prefix sums plus a monotonic-
        increasing deque over P. Two evictions: pop front when (P[i] − P[front]) ≥ K (record candidate,
        advance), pop back when P[back] ≥ P[i] (dominated).
      </p>
      <p className="mb-4">
        <strong>918. Maximum Sum Circular Subarray.</strong> Run Kadane plus a monotonic-deque
        sliding-window min over a doubled prefix array.
      </p>
      <p className="mb-4">
        <strong>1696. Jump Game VI.</strong> dp[i] = score[i] + max(dp[j] for j in [i − k, i − 1]).
        Maintain a deque of (j, dp[j]) ordered decreasing. O(n).
      </p>
      <p className="mb-4">
        <strong>1499. Max Value of Equation.</strong> Rewrite as |x_i − x_j| + y_i + y_j subject to
        bound. Reformulate the inner max as a sliding-window max over (y_j − x_j) within the |x_i − x_j|
        bound — monotonic deque on the transformed values.
      </p>
      <p className="mb-4">
        <strong>1425. Constrained Subsequence Sum.</strong> dp[i] = a[i] + max(0, max(dp[j] for j in
        [i − k, i − 1])). Same shape as 1696 with a clamp.
      </p>
      <p className="mb-4">
        <strong>2398. Maximum Number of Robots Within Budget.</strong> Sliding-window max over running
        charge plus a sum check; deque for max, prefix sum for total.
      </p>
      <p className="mb-4">
        <strong>1670. Design Front Middle Back Queue.</strong> Two deques in halves with rebalancing —
        not strictly monotonic but the deque-based design is canonical.
      </p>
      <p className="mb-4">
        <strong>2090. K Radius Subarray Averages.</strong> Plain sliding window, but the deque approach
        falls out naturally for max-over-window variants of the same problem family.
      </p>

      <ArticleImage
        src="/diagrams/other/leetcode/patterns/monotonic-queue-diagram-2.svg"
        alt="Sliding window maximum trace"
        caption="Worked trace of sliding-window max with k = 3, showing 8 pushes / 8 pops total."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li><strong>Why is monotonic deque O(n) regardless of k?</strong> Each index is pushed once and
        popped at most once across the whole loop. Total work is bounded by 2n — the k parameter never
        appears.</li>
        <li><strong>What is the difference between a monotonic stack and a monotonic queue?</strong> Stack
        evicts only at the back (push side). Queue evicts at both ends — back for order violations,
        front for window aging.</li>
        <li><strong>Why a deque rather than a regular queue?</strong> Because we need pop-back to evict
        order violators on push. Plain FIFO does not support pop-back.</li>
        <li><strong>How do you handle ties — strict or weak inequality?</strong> Default to strict —
        equal-valued earlier indices are dominated by the new index because they age out first. Use
        weak only when ties carry semantic meaning.</li>
        <li><strong>Why is the front always the max of the current window?</strong> Because back-evictions
        on push remove every smaller-or-equal element in front of it, and front-eviction on aging
        removes anything outside the window. By induction, the front is the largest in-window value.</li>
        <li><strong>How does monotonic deque speed up DP?</strong> When dp[i] depends on max of dp[i − k..i
        − 1], the inner max is sliding-window max over the dp array. Replace the O(k) inner scan with a
        deque update for O(1) amortised per state.</li>
        <li><strong>For 862 (shortest subarray with sum ≥ K), why does the deque work despite negatives?</strong>
        Because we maintain a monotonic-increasing deque of prefix-sum indices: any later index with a
        smaller-or-equal prefix dominates an older one (longer subarray, smaller sum), so the older one
        is safe to discard.</li>
        <li><strong>Could you solve 239 with a heap?</strong> Yes — push (value, index), pop while heap
        top&apos;s index is out of window. O(n log n). Slower than the deque but simpler to write under
        time pressure.</li>
        <li><strong>What is the space complexity?</strong> O(k) — the deque holds at most k indices because
        any older index has been evicted by the window check.</li>
        <li><strong>How would you handle a 2D sliding-window max?</strong> Run a 1D monotonic deque per row
        producing row-max-in-window, then run another 1D monotonic deque per column on the row results.
        O(mn) total.</li>
      </ol>
<h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li><strong>Leetcode problem set.</strong> 239, 1438, 862, 918, 1696, 1499, 1425, 2398, 2090. Solve in
        this order — the syllabus runs from base template to DP integration.</li>
        <li><strong>Competitive Programming Handbook (Antti Laaksonen), §8.</strong> Sliding-window minimum
        and the deque technique, with the amortisation proof.</li>
        <li><strong>USACO Guide — Sliding Window module.</strong> Worked examples and the
        monotonic-deque-with-DP integration.</li>
        <li><strong>CP-Algorithms — &quot;Minimum stack and minimum queue&quot;.</strong> Two-stack
        construction of a monotonic queue with worst-case O(1) per op (instead of amortised) — useful
        background.</li>
        <li><strong>Editorials for 239 and 1696.</strong> Both articulate the DP-with-deque integration.</li>
        <li><strong>Grokking the Coding Interview — &quot;Sliding Window&quot; module.</strong> Monotonic
        deque framing of variable-window problems.</li>
      </ul>
    </ArticleLayout>
  );
}
