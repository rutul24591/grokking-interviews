"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "greedy-pattern",
  title: "Greedy Pattern",
  description:
    "Make the locally optimal choice at every step, never reconsider, and rely on the greedy-choice property to deliver a globally optimal answer in linear or near-linear time.",
  category: "other",
  subcategory: "patterns",
  slug: "greedy",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-26",
  tags: ["greedy", "scheduling", "intervals", "exchange-argument"],
  relatedTopics: ["dynamic-programming", "merge-intervals", "heap"],
};

export default function GreedyArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <h2 className="text-2xl font-bold mt-8 mb-4">Definition & Context</h2>
      <p>
        Greedy is the problem-solving pattern where you make a locally optimal choice at every
        step, never reconsider it, and arrive at a globally optimal answer by induction. It is
        the cheapest pattern when it works — typically a single sort followed by a linear pass,
        giving <em>O(n log n)</em> total — and one of the riskiest when applied without proof,
        because a plausible-looking greedy can pass a dozen test cases and then fail
        spectacularly on the thirteenth. The art of greedy is not in writing the algorithm
        (that part is short) but in proving that the local choice is safe.
      </p>
      <p>
        Greedy works on problems with two structural properties: the greedy-choice property —
        the local best choice is part of some globally optimal solution — and optimal
        substructure — once a choice is made, the remaining subproblem has the same shape and
        admits the same greedy approach. Both must hold. If only optimal substructure holds, the
        problem is dynamic programming territory; greedy will give the wrong answer. If neither
        holds, the problem may need backtracking, branch-and-bound, or approximation.
      </p>
      <p>
        The textbook greedy successes are well-known: interval scheduling by earliest finish
        time, Huffman coding by least-frequent-pair merge, Dijkstra&apos;s shortest paths by
        nearest-unsettled vertex, Kruskal&apos;s and Prim&apos;s minimum spanning trees,
        fractional knapsack by value-per-weight ratio. The textbook greedy failures are equally
        important: 0/1 knapsack (greedy by ratio is wrong; DP is needed), longest path in a DAG,
        coin change with arbitrary denominations (greedy works for canonical currency systems
        but not in general). Knowing both lists by heart is half the recognition battle.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Core Concepts</h2>
      <p>
        The greedy-choice property is the load-bearing claim. It says that there exists at least
        one globally optimal solution that contains the greedy choice. Note the existential
        framing: greedy does not need to be the unique optimum, only a member of the optimal
        set. The proof of this property is almost always by exchange argument: assume some
        optimal solution does not contain the greedy choice, swap one of its elements for the
        greedy choice, and show the value of the solution does not decrease. The swap converts
        any optimum into one that contains the greedy choice, demonstrating the property.
      </p>
      <p>
        Optimal substructure says that after committing to the greedy choice, the residual
        problem has the same form and the same greedy approach applies. For interval scheduling,
        once you take the earliest-finishing interval, the remaining problem is &quot;schedule
        the intervals that start after this one&apos;s end, using the same rule&quot;. The
        recursion does not need memoisation because the greedy choice removes a chunk of input
        permanently — there is no overlap of subproblems.
      </p>
      <p>
        Most greedy algorithms run in <em>O(n log n)</em> because of an initial sort followed by
        a linear pass. The sort key is problem-specific and is itself the cleverness: sort
        intervals by end time for scheduling, by start time for merging, by value-per-weight for
        fractional knapsack, by deadline for job scheduling. Picking the right key is what makes
        the greedy correct; picking the wrong key produces a plausible algorithm with the wrong
        answer on adversarial inputs.
      </p>
      <p>
        Some greedy algorithms run in <em>O(n)</em> because no sort is needed — the input
        already imposes the right order. Maximum subarray (Kadane), best-time-to-buy-and-sell
        with unlimited transactions, and gas-station-circuit are linear-time greedies that
        decide their next move based on a running tally of state, not a global sort.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Architecture & Flow</h2>
      <p>
        The skeleton is short. Sort the input by the chosen key. Initialise an accumulator —
        whether it is a count, a sum, a list of selected items, or a state machine. Iterate
        through the sorted input; at each step, decide whether the current element fits the
        accumulator&apos;s constraints. If yes, take it and update the accumulator; if no, skip.
        At the end, the accumulator holds the answer. There is no backtracking and no second
        pass.
      </p>
      <p>
        Variant one is the sort-then-iterate skeleton just described, used by interval problems,
        scheduling, and the heap-based meeting-room problem. Variant two is the running-tally
        skeleton, used by Kadane and gas station, where state is updated based on the local
        comparison rather than the global sort.
      </p>
      <ArticleImage
        src="/diagrams/other/leetcode/patterns/greedy-diagram-1.svg"
        alt="Greedy template overview"

      />
      <p>
        Variant three is the priority-queue greedy, where the &quot;next best choice&quot; is
        not statically determined by sort but dynamically by a heap. Dijkstra&apos;s algorithm
        is the archetype: at each step, settle the unsettled vertex closest to the source. The
        heap supports the &quot;next best&quot; query in <em>O(log n)</em>, and the algorithm
        runs in <em>O((V + E) log V)</em>.
      </p>
      <ArticleImage
        src="/diagrams/other/leetcode/patterns/greedy-diagram-2.svg"
        alt="Greedy proof techniques"

      />

      <h2 className="text-2xl font-bold mt-8 mb-4">Trade-offs & Comparisons</h2>
      <p>
        Greedy versus dynamic programming. Both have optimal substructure; only greedy has the
        greedy-choice property. When greedy works, it is faster — usually by a polynomial factor
        — but DP is the safer fallback when the greedy-choice property cannot be proven.
        Practical advice: try to construct a counterexample to your candidate greedy. If you
        cannot find one, attempt the proof. If the proof is hard, switch to DP.
      </p>
      <p>
        Greedy versus brute force. Brute force enumerates all possibilities and picks the best
        one; greedy commits at every step. Brute force is correct everywhere but exponential;
        greedy is fast everywhere but correct only when the structure permits. The middle
        ground is dynamic programming, which has greedy&apos;s polynomial cost but brute
        force&apos;s exhaustiveness within a memoised state space.
      </p>
      <p>
        Greedy versus randomised algorithms. Some problems where greedy fails admit randomised
        approximation algorithms with provable expected ratios — set cover, vertex cover,
        scheduling. Knowing the gap matters for staff-level interview discussions: the
        interviewer may ask why greedy fails on a problem and what the next-best algorithm is.
      </p>
      <p>
        Within greedy, sort-based versus heap-based variants differ in cost. Sort-based is one
        upfront <em>O(n log n)</em> followed by linear iteration; heap-based pays{" "}
        <em>O(log n)</em> per choice but accommodates streaming inputs where the full set is not
        known upfront. Use sort-based when the input is known and finite; use heap-based when
        choices are made online or when the &quot;best next&quot; depends on dynamic state.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Best Practices</h2>
      <p>
        State the candidate greedy strategy in one sentence before coding. &quot;At each step,
        take the interval with the earliest end time among those that start after the previous
        interval&apos;s end.&quot; If you cannot fit your strategy into one sentence, the
        strategy is probably not actually greedy.
      </p>
      <p>
        Sketch a counterexample-search before coding. List two or three small adversarial
        inputs and trace your candidate greedy on them. If you can construct a case where the
        greedy fails, switch patterns. If the greedy survives small adversarial cases, attempt
        the formal proof.
      </p>
      <p>
        Identify the sort key explicitly and justify it. The sort key is the algorithmic
        insight; if you cannot say <em>why</em> sorting by end time (rather than start time, or
        duration) makes the greedy work, you do not yet understand the problem.
      </p>
      <p>
        For interval problems, default to sorting by end time. It is the right key for activity
        selection, balloon bursting, and several scheduling variants. Sort by start time when
        the problem is about merging or unioning ranges, not selecting non-overlapping ones.
      </p>
      <p>
        For running-tally greedies (Kadane, gas station), keep the accumulator&apos;s
        invariants explicit. The maximum-so-far in Kadane is &quot;the largest sum of any
        subarray ending at the current index&quot;. State that aloud; it makes the update rule
        obvious.
      </p>
      <p>
        Mention complexity at the start of the discussion. <em>O(n log n)</em> from the sort,
        <em>O(n)</em> from the iteration, <em>O(1)</em> auxiliary space. The complexity is part
        of why you chose greedy; saying it upfront frames the rest of the conversation.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Common Pitfalls</h2>
      <p>
        Plausible-but-wrong greedy. The most dangerous failure mode is a greedy that looks
        right, passes a few examples, and fails on a slightly larger input. The classic example
        is &quot;coin change with denominations 1, 3, 4 to make 6&quot;: greedy takes 4, then 1,
        1 (three coins); optimal is 3, 3 (two coins). Always counterexample-test before
        committing.
      </p>
      <p>
        Wrong sort key. Sorting interval scheduling by start time gives a wrong answer; sorting
        by duration gives a wrong answer. Only sorting by end time is correct. Each greedy
        problem has a specific correct key; mixing it up with a similar-looking key produces a
        confidently wrong solution.
      </p>
      <p>
        Forgetting tie-breaking rules. When two elements compare equal under the primary sort
        key, the tie-breaking key sometimes matters. In <em>Queue Reconstruction by Height</em>{" "}
        (Leetcode 406), sorting by height descending is correct but the tie-breaker must be by
        k ascending, not k descending; the wrong tie-breaker produces an invalid queue.
      </p>
      <p>
        Confusing greedy with DP. If your candidate greedy has overlapping subproblems — if at
        any point you find yourself wanting to memoise a sub-result — the problem is not
        greedy. Stop and switch to DP.
      </p>
      <p>
        Local-optimum trap on jump-style problems. <em>Jump Game II</em> can be misread as
        &quot;always jump as far as possible from the current index&quot;. The correct greedy is
        &quot;within the current jump&apos;s reach, find the position that extends the next
        reach the most&quot; — subtly different and often confused.
      </p>
      <p>
        Overpaying with a heap when a sort would do. Some candidates reach for a heap when a
        single sort plus linear pass would solve the problem. The heap costs more constant
        factor and obscures the algorithm. Use the heap only when the choice ordering depends on
        dynamic state.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Real-World Use Cases</h2>
      <p>
        Greedy underlies a long list of production algorithms. Job schedulers run earliest-deadline-first
        and shortest-job-first variants. Network routing protocols use Dijkstra at the
        edge-by-edge level. Compression algorithms — Huffman, LZW — are greedy at heart.
        Approximation algorithms for NP-hard problems (set cover, vertex cover, makespan) use
        greedy as a baseline because their bounded-ratio guarantees are strong enough for
        practical use.
      </p>
      <p>
        On the Leetcode side, greedy clusters into two families. Interval/scheduling family:{" "}
        <em>435. Non-overlapping Intervals</em>, <em>452. Min Arrows to Burst Balloons</em>,{" "}
        <em>56. Merge Intervals</em>, <em>253. Meeting Rooms II</em>, <em>621. Task
        Scheduler</em>, <em>763. Partition Labels</em>. The unifying theme is sort by an
        interval boundary, then iterate. Once you internalise this template, the family becomes
        mechanical.
      </p>
      <p>
        Jump-and-reach family: <em>55. Jump Game</em>, <em>45. Jump Game II</em>, <em>134. Gas
        Station</em>, <em>122. Best Time to Buy and Sell Stock II</em>, <em>376. Wiggle
        Subsequence</em>, <em>406. Queue Reconstruction by Height</em>. These are running-tally
        greedies where the next move depends on local state without sorting (or with a single
        sort applied for a different reason). They tend to be linear-time and require careful
        invariant statements.
      </p>
      <ArticleImage
        src="/diagrams/other/leetcode/patterns/greedy-diagram-3.svg"
        alt="Canonical greedy problems"

      />
      <p>
        Beyond Leetcode, greedy is foundational in competitive programming and in real systems.
        Load balancers commonly use a least-loaded-first greedy to assign requests; cache
        eviction policies like LRU and LFU are greedy at the time-of-eviction step (always evict
        the locally least-useful item). Knowing the pattern helps not only in interviews but in
        designing these production systems with confidence in their correctness.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Common Interview Questions</h2>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li><strong>Prove the earliest-finish-first greedy for interval scheduling.</strong> By
        exchange argument: take any optimal schedule that does not include the earliest-finishing
        interval, swap its first interval for the earliest-finishing one; the swap is feasible
        because the new interval finishes no later, and the schedule&apos;s size is preserved.</li>
        <li><strong>When does greedy fail and why?</strong> When the greedy-choice property fails —
        when the locally best choice forecloses better global solutions. 0/1 knapsack is the
        canonical example: choosing by ratio leaves capacity that cannot be filled optimally.</li>
        <li><strong>How do you decide between greedy and DP?</strong> Try greedy with a
        counterexample-search; if it survives small adversarial cases, attempt the proof. If the
        proof works, ship greedy. If you find a counterexample, the problem has overlapping
        subproblems and DP is the right tool.</li>
        <li><strong>Implement Jump Game II in O(n).</strong> Track the current reach, the farthest
        reach achievable from any index inside the current reach, and the jump count. When the
        loop index passes the current reach, increment jumps and extend reach to farthest.</li>
        <li><strong>Why does sorting by end time work for non-overlapping intervals?</strong>{" "}
        Because the earliest-finishing interval leaves the most room for future intervals. Any
        other choice leaves at least as little room and selects at most as many intervals.</li>
        <li><strong>Walk through Huffman coding.</strong> Repeatedly merge the two least-frequent
        nodes into a parent whose frequency is their sum. The greedy choice — least frequent
        pair — yields an optimal prefix code by exchange argument on the tree shape.</li>
        <li><strong>How does Dijkstra avoid revisiting settled vertices?</strong> Once a vertex is
        settled (popped from the heap), the greedy invariant guarantees its distance is final.
        Re-popping is impossible because all subsequent pops have distance at least as large.</li>
        <li><strong>What is the gas-station problem and the trick to solving it in one pass?</strong>{" "}
        If a tour is feasible at all, it starts at the first station after a deficit reset.
        Track running tank; when it goes negative, the answer cannot start in any station up to
        and including the current one — restart the candidate at the next.</li>
      </ol>
<h2 className="text-2xl font-bold mt-8 mb-4">References & Further Reading</h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Cormen et al., <em>Introduction to Algorithms</em>, chapter 16 covers greedy
        comprehensively: interval scheduling, Huffman, fractional knapsack, matroid theory.
        Chapter 23 (MST) and chapter 24 (shortest paths) are greedy applications. Read 16 first;
        the matroid framework explains why greedy works on a wide class of problems and why it
        fails on 0/1 knapsack.</li>
        <li>Kleinberg and Tardos, <em>Algorithm Design</em>, chapter 4 is the most readable
        treatment of greedy proofs. Their exchange-argument exposition for interval scheduling
        and stable matching is the canonical pedagogical reference.</li>
        <li>For Leetcode practice, the &quot;greedy&quot; tag has 200+ problems; the dozen named
        above span the patterns. NeetCode&apos;s greedy playlist walks through 55, 45, 134, 122,
        376, 763, 435, 452, 621, and 1899 in order — a solid two-week study plan. Combine that
        with reading the proofs in Kleinberg and Tardos for the staff/principal-tier depth that
        FAANG interviewers probe for.</li>
      </ul>
</ArticleLayout>
  );
}
