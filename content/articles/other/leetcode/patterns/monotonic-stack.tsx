"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "monotonic-stack",
  title: "Monotonic Stack Pattern",
  description:
    "A stack maintained in monotone order, evicting violators on push — the linear-time tool for next-greater / smaller queries, histogram rectangles, and lex-smallest-after-removals problems.",
  category: "other",
  subcategory: "patterns",
  slug: "monotonic-stack",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-26",
  tags: ["monotonic-stack", "leetcode", "patterns", "nearest-greater", "histogram"],
  relatedTopics: ["stack", "monotonic-queue", "sliding-window"],
};

export default function MonotonicStackArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
      <p className="mb-4">
        A monotonic stack is a stack maintained in non-increasing or non-decreasing order along the depth axis.
        On each push, top elements that violate the order are popped before the new value is added. The
        invariant — &quot;values are sorted top to bottom in the chosen direction&quot; — is preserved by
        construction. Each element is pushed exactly once and popped at most once across the whole algorithm,
        giving amortised O(n) total work despite the inner pop loop.
      </p>
      <p className="mb-4">
        The pattern is the linear-time answer to a specific family of queries: <strong>nearest greater</strong>
        / <strong>nearest smaller</strong>, on the left or on the right, by value or by distance. Brute force
        scans backward from each index in O(n) per query — O(n²) total. The monotonic stack collapses this to
        O(n) by exploiting the observation that if A[j] is popped on behalf of A[i], then A[j] can never be the
        nearest-greater of any later index past i — i blocks the view.
      </p>
      <p className="mb-4">
        Recognition signals are textbook. &quot;Next greater element&quot;, &quot;previous smaller&quot;,
        &quot;number of days until warmer&quot;, &quot;stock span&quot;, &quot;largest rectangle in histogram&quot;,
        &quot;trapping rain water&quot;, &quot;visible people in a queue&quot; — all monotonic stack. A second
        family signals the same pattern by a different surface: &quot;remove k digits / characters to get
        lex-smallest result&quot; — pop a larger character to make room for the upcoming smaller one, with a
        budget on removals.
      </p>
      <p className="mb-4">
        For staff interviews, the lift is recognising that a problem is monotonic-stack-shaped under disguise
        (histogram, rain water, lex-smallest), choosing the direction (increasing vs. decreasing, strict vs.
        weak), and choosing what to push (index vs. value vs. (value, count) pair). The data structure is
        trivial; the engineering is the discipline.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
      <p className="mb-4">
        <strong>Order direction.</strong> A &quot;decreasing&quot; monotonic stack has values that decrease from
        bottom to top — the bottom holds the largest, the top holds the smallest. It answers &quot;next greater&quot;:
        when the incoming value exceeds the top, the top has found its next greater. An &quot;increasing&quot;
        stack mirrors this for &quot;next smaller&quot;. Choose the direction by what the question asks for.
      </p>
      <p className="mb-4">
        <strong>Strict vs. weak monotonicity.</strong> Strict (&lt; or &gt;) treats equal values as violations —
        the top is popped on equality. Weak (≤ or ≥) keeps equals. The choice depends on whether equal-value
        ties should be resolved as &quot;same span&quot; (weak) or &quot;new span starts&quot; (strict). Largest
        rectangle in histogram allows either with care; daily temperatures uses strict because a tie does not
        count as warmer.
      </p>
      <p className="mb-4">
        <strong>Push-once-pop-once amortisation.</strong> The inner while loop looks like O(n) per outer step,
        but the total pop count across all iterations is bounded by the total push count, which is n. So the
        combined work of the outer for-loop and the inner while-loop is O(n) overall — the same amortised
        argument as the two-pointer pattern.
      </p>
      <p className="mb-4">
        <strong>Push the index, not just the value.</strong> Most problems need both: the value to compare,
        the index to compute distances or boundaries. Pushing only the value loses information. The exception
        is when only the value count matters (e.g., remove-k-digits builds the result string and discards
        positions).
      </p>
      <p className="mb-4">
        <strong>What gets answered on pop.</strong> When a top is popped on behalf of incoming index i, the
        popped index has found its next-greater (or smaller) on the right at i. The popped index&apos;s
        previous-greater on the left is the new top after the pop. This dual answer — left from the
        post-pop top, right from the popping index — is what makes histogram-rectangle work in one pass.
      </p>
      <p className="mb-4">
        <strong>Sentinel flushing.</strong> After the input ends, indices left on the stack have no
        right-greater. Either fill their answers with a sentinel (−1, or +∞ depending on convention) or, for
        histogram-style problems, pretend the input ends with a 0 so the loop pops everything. The sentinel
        trick is the cleanest way to merge end-of-input handling into the main loop.
      </p>
      <p className="mb-4">
        <strong>Complexity.</strong> O(n) time, O(n) space (the stack plus the answer array). The stack peak
        is bounded by n; for monotone inputs (already sorted) it grows to n, otherwise less.
      </p>

      <ArticleImage
        src="/diagrams/other/leetcode/patterns/monotonic-stack-diagram-1.svg"
        alt="Monotonic stack definition"
        caption="Definition, invariant, and the canonical next-greater-element template — push indices, pop on violation."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
      <p className="mb-4">
        <strong>Next-greater-element template.</strong> Initialise empty stack and answer array of size n
        filled with −1. For i from 0 to n − 1: while stack non-empty and A[stack.top()] &lt; A[i], answer[stack.pop()]
        = A[i]. Push i. After the loop, indices remaining on the stack keep their −1 sentinel. Total O(n).
      </p>
      <p className="mb-4">
        <strong>Daily Temperatures variant (739).</strong> Identical structure, but answer[stack.pop()] = i −
        stack.pop() (the distance, not the value). The change is one expression — the pattern is unchanged.
      </p>
      <p className="mb-4">
        <strong>Circular array variant (503).</strong> Simulate two passes by iterating i from 0 to 2n − 1 and
        indexing A[i mod n]. Pushes only happen on the first pass; pops can happen on either pass. Each
        original index is still pushed and popped at most once, so still O(n).
      </p>
      <p className="mb-4">
        <strong>Largest Rectangle in Histogram (84).</strong> Maintain an increasing stack of indices. When
        A[i] &lt; A[stack.top()], pop top h, then area = h * (i − stack.top() − 1) where the new top after pop
        is the previous-smaller boundary. Append a sentinel 0 at the end to flush. The two boundaries are
        derived from one stack — that is the elegance.
      </p>
      <p className="mb-4">
        <strong>Maximal Rectangle (85).</strong> Build a histogram per row (column heights of consecutive 1s
        ending at this row), run 84 on each, take the max. O(mn) total.
      </p>
      <p className="mb-4">
        <strong>Trapping Rain Water (42) — stack form.</strong> Maintain a decreasing stack of indices. When
        A[i] &gt; A[stack.top()], pop the bottom (the floor of a basin), compute trapped = (min(A[i],
        A[stack.top()]) − floor) * (i − stack.top() − 1). Each pop contributes one horizontal layer of
        water to the answer.
      </p>
      <p className="mb-4">
        <strong>Lex-smallest with budget (402, 316 / 1081).</strong> Walk through the input. While the top is
        greater than the current character and we still have budget to remove (or, for 316, the top still
        appears later), pop. Push current. After the loop, return the stack as the answer (truncating any
        unused budget from the right). The pop-on-greater discipline plus the budget gives O(n) construction
        of the lexicographically smallest result.
      </p>
      <p className="mb-4">
        <strong>Sum of subarray minimums (907).</strong> For each index, find its previous-smaller and
        next-smaller; the index is the minimum of (i − prev) * (next − i) subarrays, contributing A[i] times
        that count. Two monotonic-stack passes give both boundaries in O(n).
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
      <p className="mb-4">
        <strong>Monotonic stack vs. brute-force scan.</strong> Brute force is O(n²); monotonic stack is O(n).
        For Leetcode constraints (n ≤ 10⁵), the brute force times out and the stack is the only viable
        solution. The constant factor is small — well-tuned monotonic-stack code runs in under 50 ms for n =
        10⁶.
      </p>
      <p className="mb-4">
        <strong>Monotonic stack vs. two-pointer.</strong> Trapping rain water has both: the two-pointer
        version is O(n) time and O(1) space; the stack version is O(n) time and O(n) space but generalises to
        the layer-by-layer accounting the stack provides. Default to two-pointer when O(1) space is wanted;
        use the stack when extracting per-bar contributions matters.
      </p>
      <p className="mb-4">
        <strong>Monotonic stack vs. monotonic queue.</strong> Stack answers static nearest-greater queries on
        a fixed array; queue answers sliding-window-max over a moving window. The data discipline is similar
        (evict violators on push) but the eviction condition for a queue also includes &quot;old elements
        falling out of the window&quot;, which requires a deque rather than a stack.
      </p>
      <p className="mb-4">
        <strong>Monotonic stack vs. segment tree for range min/max.</strong> Segment tree gives O(log n) per
        arbitrary range query; monotonic stack gives O(1) amortised but only for &quot;max ending at i&quot;
        or &quot;next greater from i&quot;, not arbitrary [l, r]. For one-shot left-and-right boundaries, the
        stack wins on simplicity and speed.
      </p>
      <p className="mb-4">
        <strong>Monotonic stack vs. DP for histogram.</strong> A DP that computes &quot;max width with min
        height A[i]&quot; can be done in O(n) with two passes (next smaller left, next smaller right) — both
        passes are themselves monotonic-stack subroutines. The DP framing is the same algorithm, viewed from
        the contribution side.
      </p>
      <p className="mb-4">
        <strong>Strict vs. weak — when does it matter?</strong> Largest-rectangle works correctly with either
        because equal-height bars share the same maximal rectangle. Daily-temperatures requires strict because
        equal temperature is not warmer. Sum-of-subarray-minimums needs one pass strict and one weak to avoid
        double-counting tied minima — a subtle but interview-worthy detail.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
      <p className="mb-4">
        <strong>Push the index, store the value lookup.</strong> Almost every monotonic-stack problem needs
        the index for distances or boundaries. Push i, look up A[i] when comparing. Pushing the value alone
        works for some problems but generalises poorly.
      </p>
      <p className="mb-4">
        <strong>Pre-fill the answer array.</strong> Initialise to the &quot;not found&quot; sentinel so that
        indices never popped retain a meaningful default. Don&apos;t branch in the cleanup code.
      </p>
      <p className="mb-4">
        <strong>Use a sentinel to flush.</strong> Append a value that violates the order (0 for histograms, +∞
        for next-greater) to the input or its iteration so the inner while-loop drains the stack at the end.
        Removes the post-loop flush block.
      </p>
      <p className="mb-4">
        <strong>Document the invariant in a comment.</strong> One line: &quot;stack stores indices with
        strictly decreasing A[i] from bottom to top&quot;. Without it, the strict / weak distinction gets lost
        across rewrites.
      </p>
      <p className="mb-4">
        <strong>Pick strict by default.</strong> If unsure, prefer strict order — it gives cleaner semantics
        for &quot;next strictly greater&quot;. Switch to weak only when ties should be treated as continuations.
      </p>
      <p className="mb-4">
        <strong>For lex-smallest, track availability.</strong> Remove-duplicate-letters needs a counter of
        remaining characters and an in-stack set: only pop if the top still appears later, only push if the
        char is not already in the stack. Two auxiliary structures, but the core is still monotonic-stack.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
      <p className="mb-4">
        <strong>Wrong inequality direction.</strong> Decreasing stack with A[stack.top()] &gt; A[i] means
        &quot;pop while top is bigger&quot; — that gives next-smaller, not next-greater. Get the direction by
        asking: when an incoming value triggers a pop, what does the popped element learn about itself?
      </p>
      <p className="mb-4">
        <strong>Strict vs. weak confusion.</strong> Using ≤ instead of &lt; in next-greater silently changes
        the answer for tied inputs. Always re-read the problem to confirm the equality case.
      </p>
      <p className="mb-4">
        <strong>Forgetting to flush.</strong> Indices left on the stack at end-of-input have no
        next-greater. Either pre-fill the answer with a sentinel or use a flush sentinel value to drain the
        stack — never just exit the loop and assume zeros are correct.
      </p>
      <p className="mb-4">
        <strong>Histogram boundary off-by-one.</strong> The width formula in 84 is i − stack.top() − 1, where
        stack.top() is the post-pop top (the previous-smaller). Using i − stack.pop() (pre-pop) gives the
        wrong width.
      </p>
      <p className="mb-4">
        <strong>Pushing values for distance problems.</strong> 739 (Daily Temperatures) needs i − stack.top()
        for the distance. Pushing temperatures alone forces a separate distance lookup; pushing indices is
        natural.
      </p>
      <p className="mb-4">
        <strong>Treating remove-k-digits as pure greedy.</strong> Without the budget check (only pop while
        removals remain) the algorithm over-removes. After the loop, if removals remain, trim from the right.
      </p>
      <p className="mb-4">
        <strong>Trapping-rain-water layer accounting.</strong> The stack version pops the floor first, then
        the new top defines the bounded basin. Computing area against the popped floor as the bound rather
        than as the floor is the most common mis-step.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases (Canonical Leetcode Problems)</h2>
      <p className="mb-4">
        <strong>496. Next Greater Element I.</strong> The pure template, with a wrapper that maps query
        indices through a hash map.
      </p>
      <p className="mb-4">
        <strong>503. Next Greater Element II.</strong> Circular extension — iterate twice with i mod n; only
        push on the first pass.
      </p>
      <p className="mb-4">
        <strong>739. Daily Temperatures.</strong> Distance form — answer[stack.pop()] = i − stack.top(). Same
        skeleton.
      </p>
      <p className="mb-4">
        <strong>901. Online Stock Span.</strong> Streaming version — store (price, span) pairs, aggregate spans
        on pop.
      </p>
      <p className="mb-4">
        <strong>84. Largest Rectangle in Histogram.</strong> The flagship. Increasing stack of indices, sentinel
        0 at end, area = h * (i − stack.top() − 1) on pop.
      </p>
      <p className="mb-4">
        <strong>85. Maximal Rectangle.</strong> Per-row histograms; reduce to 84. O(mn).
      </p>
      <p className="mb-4">
        <strong>42. Trapping Rain Water.</strong> Stack form: pop the floor, compute layer area against the
        bounded basin between the new top and the current index.
      </p>
      <p className="mb-4">
        <strong>402. Remove K Digits.</strong> Greedy lex-smallest: pop while top &gt; current and budget
        remains; trim trailing if budget left over.
      </p>
      <p className="mb-4">
        <strong>316 / 1081. Remove Duplicate Letters.</strong> Same skeleton with a remaining-count check
        replacing the budget — pop only if the popped char appears later in the input.
      </p>
      <p className="mb-4">
        <strong>907. Sum of Subarray Minimums.</strong> Two passes (previous-smaller, next-smaller) compose to
        give each element&apos;s contribution count. O(n).
      </p>

      <ArticleImage
        src="/diagrams/other/leetcode/patterns/monotonic-stack-diagram-2.svg"
        alt="Largest rectangle in histogram trace"
        caption="Pop-driven area accounting for largest-rectangle-in-histogram, with a step-by-step trace."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li><strong>Why is monotonic stack O(n) despite the inner loop?</strong> Each element is pushed once and
        popped at most once. Total work across the whole algorithm is bounded by 2n — amortised O(1) per
        element.</li>
        <li><strong>How do you choose increasing vs. decreasing?</strong> Ask: when an incoming element evicts the
        top, what does the top learn about itself? If the answer is &quot;I just found my next-greater&quot;,
        the stack was decreasing. For next-smaller, increasing.</li>
        <li><strong>Why does histogram use the post-pop top for the width?</strong> The post-pop top is the
        previous-smaller boundary of the popped bar; the current index is the next-smaller boundary. The bar
        spans (post-pop top, current index) exclusive — width is (i − stack.top() − 1).</li>
        <li><strong>Why does sum-of-subarray-minimums need strict on one side and weak on the other?</strong> To
        avoid double-counting tied minima — only one of the two boundary computations may include equality, or
        the same subarray gets counted for two different indices.</li>
        <li><strong>How does the circular variant avoid an O(n²) blow-up?</strong> Iterate i over [0, 2n) and use
        i mod n, but only push during i &lt; n. Each original index is still pushed once and popped once.</li>
        <li><strong>Why does remove-k-digits use a budget check?</strong> Without it the greedy over-pops on
        long-decreasing inputs. The budget bounds total removals to k.</li>
        <li><strong>Could you solve trapping rain water with two pointers instead?</strong> Yes — O(n) time, O(1)
        space, using left-max and right-max pointers. Slightly tighter than the stack version on space.</li>
        <li><strong>How do you handle ties in next-greater?</strong> Prefer strict — equal values do not count as
        greater. If the problem says &quot;next greater or equal&quot;, switch to weak (≥).</li>
        <li><strong>Why push indices instead of values?</strong> Indices give boundary distances and let you look
        up the value when needed. Values alone lose position information that most problems require.</li>
        <li><strong>How does online stock span (901) maintain O(1) amortised per call?</strong> By aggregating
        spans on pop — each popped element&apos;s span is added to the surviving entry, so each element is
        pushed and popped at most once over the whole stream.</li>
      </ol>
<h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li><strong>Leetcode problem set.</strong> 496, 503, 739, 901, 1019, 84, 85, 42, 402, 316, 907, 1944. Solve
        in this order — the syllabus runs from base template to histogram to lex-smallest.</li>
        <li><strong>Competitive Programming Handbook (Antti Laaksonen), §8.</strong> Treats monotonic stack
        alongside sliding-window-min and gives the histogram derivation cleanly.</li>
        <li><strong>USACO Guide — Monotonic Stack module.</strong> Multiple worked examples and the strict-vs-weak
        decision tree.</li>
        <li><strong>CP-Algorithms — &quot;Stack with the function getMin()&quot;.</strong> The min-stack treatment
        that motivates the monotone discipline.</li>
        <li><strong>Editorials for 84 and 42.</strong> Read both — they articulate why two seemingly different
        problems share the same monotone discipline, and why 42 also admits a two-pointer solution.</li>
        <li><strong>Grokking Coding Interview — &quot;Monotonic Stack&quot; module.</strong> Useful framing of the
        recognition signals and direction-choice logic.</li>
      </ul>
    </ArticleLayout>
  );
}
