"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "greedy-fundamentals",
  title: "Greedy Algorithm Fundamentals",
  description:
    "Greedy algorithms — greedy-choice property, optimal substructure, exchange arguments, matroids, fractional knapsack, and when to reach for DP instead.",
  category: "other",
  subcategory: "algorithms",
  slug: "greedy-fundamentals",
  wordCount: 4700,
  readingTime: 23,
  lastUpdated: "2026-04-20",
  tags: ["greedy", "fundamentals", "matroid", "exchange-argument"],
  relatedTopics: ["activity-selection", "huffman-coding", "job-sequencing", "dp-fundamentals"],
};

export default function GreedyFundamentalsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p className="mb-4">
          A <span className="font-semibold">greedy algorithm</span> builds a solution one
          commitment at a time, always choosing the option that looks best at the moment and
          never reconsidering past choices. When the problem has the right structure, this
          myopic strategy yields a globally optimal solution in polynomial time — often
          n log n — without any of the bookkeeping required by dynamic programming or
          branch-and-bound.
        </p>
        <p className="mb-4">
          The catch is that greedy works only for a narrow class of problems. The theoretical
          justification comes from two properties: the <span className="font-semibold">greedy-
          choice property</span> (a globally optimal solution can be assembled from local
          optima) and <span className="font-semibold">optimal substructure</span> (the
          remaining subproblem after a greedy choice is itself solved optimally). Both must
          hold, and both must be proved — usually by an exchange argument.
        </p>
        <p className="mb-4">
          Classical greedy successes include activity selection, Huffman coding, Kruskal and
          Prim for MST, Dijkstra for shortest paths on non-negative weights, and fractional
          knapsack. Each rests on a tailored exchange argument (or a matroid structure for the
          MST family). Classical greedy failures include 0/1 knapsack, coin change on non-
          canonical systems, graph coloring, and the longest-simple-path problem — all of
          which need DP, branch-and-bound, or approximation.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <p className="mb-4">
          <span className="font-semibold">Greedy-choice property.</span> A problem has this
          property if there exists a globally optimal solution that contains the choice
          produced by the greedy rule. The classical proof is the exchange argument: take any
          optimal solution O; if it does not contain the greedy choice G, show that replacing
          one element of O with G yields a solution that is at least as good. Iterating
          transforms O into the greedy solution without loss.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Optimal substructure.</span> After committing to the
          greedy choice, the remaining input forms a smaller instance of the same problem.
          This lets induction close the argument: assume greedy is optimal on smaller inputs,
          then a correct greedy choice plus an inductively optimal remainder is globally
          optimal.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Exchange argument — template.</span> (1) Assume for
          contradiction that greedy G differs from optimal O; (2) identify the first position
          at which they differ — G chose g, O chose o; (3) construct O′ = O with o replaced by
          g; (4) show O′ is feasible and no worse than O; (5) iterate. If step 4 holds for
          your problem, greedy is optimal.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Matroids and the optimality guarantee.</span> A
          matroid is a pair (E, I) where I is a family of &ldquo;independent&rdquo; subsets
          closed under removal and satisfying the exchange axiom: if A, B ∈ I with |A| &lt;
          |B|, there exists x ∈ B \ A such that A ∪ {`{x}`} ∈ I. Rado (1957) and Edmonds
          (1971) proved the maximum-weight-independent-set problem on any matroid is solved
          optimally by the generic greedy algorithm. The graphic matroid (MST), uniform
          matroid (choose k of n), and transversal matroid (bipartite matching) all inherit
          this guarantee.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Safe moves and local vs global.</span> A choice is
          <em> safe</em> if some optimal solution extends it. Proving safeness for every
          greedy choice is equivalent to proving the greedy-choice property. For non-matroid
          problems, safeness can still hold by ad-hoc exchange arguments — Huffman coding is
          the classic example.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/greedy-fundamentals-diagram-1.svg"
          alt="Two pillars of greedy correctness and a table of classic greedy successes"
          caption="Greedy-choice property plus optimal substructure = correct greedy. The classic successes all fit one of two proof patterns: exchange argument or matroid structure."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p className="mb-4">
          <span className="font-semibold">Generic greedy skeleton.</span> (1) Define a scoring
          function on candidates; (2) sort or priority-queue by the score; (3) iterate: pick
          the best remaining candidate; if feasible, commit; (4) stop when the solution is
          complete or no candidates remain. Runtime is dominated by the sort (O(n log n)) or
          heap operations (O(n log n)).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Activity selection flow.</span> Sort activities by
          finishing time. Initialize last-finish = −∞. Walk the list; pick every activity
          whose start ≥ last-finish; update last-finish = this activity&rsquo;s finish. O(n
          log n) with sort, O(n) if already sorted. The exchange argument swaps any first
          activity in O with the earliest-finishing one — the latter leaves at least as much
          room for the tail.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Huffman flow.</span> Put all leaf frequencies in a
          min-heap. Repeatedly extract the two smallest, create a new internal node with
          their sum, re-insert. After n − 1 merges you have the optimal prefix-code tree.
          O(n log n) from 2n heap operations.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Fractional knapsack flow.</span> Compute v_i / w_i
          for each item. Sort by ratio descending. Walk the sorted list, taking each item
          whole until the next one would overflow; then take the fractional last piece. O(n
          log n). Proof: any feasible solution can be &ldquo;upgraded&rdquo; by moving mass
          from lower to higher ratio.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/greedy-fundamentals-diagram-2.svg"
          alt="Fractional knapsack greedy vs 0/1 knapsack failure"
          caption="The fractional/integer distinction is the cleanest example of when greedy wins vs fails: divisibility enables the exchange argument."
        />
        <p className="mb-4">
          <span className="font-semibold">Kruskal MST flow.</span> Sort edges by weight.
          Initialize a union-find. Walk edges; add each if its endpoints are in different
          components. Stop after n − 1 additions. O(E log E) dominated by sort.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Dijkstra flow (greedy on a graph).</span> Priority
          queue keyed by tentative distance. Extract min, relax outgoing edges. The invariant
          &ldquo;extracted vertex&rsquo;s distance is final&rdquo; holds only for non-negative
          edge weights — this is where negative weights break the greedy argument (Bellman-
          Ford replaces it).
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <p className="mb-4">
          <span className="font-semibold">Greedy vs DP.</span> Greedy commits once, DP
          considers all predecessors. DP solves a strict superset of problems — any greedy can
          be simulated with DP — but at a space/time cost. When both work, greedy is faster
          and far easier to explain.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Greedy vs branch-and-bound.</span> B&amp;B explores
          all feasible choices but prunes with bounds; greedy explores one path. Greedy is
          always polynomial; B&amp;B is worst-case exponential. B&amp;B is the right tool when
          you need optimum on a non-greedy problem at moderate scale (TSP with n ≈ 30).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Greedy vs approximation.</span> Some greedy
          algorithms are not exact but have provable approximation ratios: set-cover greedy
          achieves H(n) = Θ(log n), best possible under P ≠ NP. The greedy here isn&rsquo;t
          optimal but is the best-known polynomial-time approximation.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Offline greedy vs online greedy.</span> Offline
          greedy sees the whole input; online must decide as items arrive. Competitive ratio
          measures online greedy against the offline optimum — e.g. the ski-rental problem
          has a 2-competitive online algorithm.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Greedy vs LP relaxation.</span> For some problems
          (vertex cover, set cover), LP relaxation + rounding gives better approximation
          bounds than greedy. When integrality gap is small, LP wins; when it&rsquo;s big,
          greedy with an exchange argument is competitive.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Sort vs heap.</span> Greedy can often be implemented
          either with an upfront sort or with a priority queue. Sort is simpler and has
          better cache behavior; heap allows online insertion and is strictly required when
          scores depend on state that evolves during the run (Prim&rsquo;s uses heap for
          exactly this reason).
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <p className="mb-4">
          <span className="font-semibold">Prove before you ship.</span> Every greedy needs a
          correctness argument — exchange, matroid, or cut-property. Skipping the proof is
          the shortest path to a silent bug on a corner case you did not imagine.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Try to break it with small inputs.</span> If you
          cannot prove greedy correct, brute-force all inputs of size ≤ 8 and compare. A
          mismatch means greedy is wrong; no mismatch is not a proof but is a strong signal
          that a proof exists.
        </p>
        <p className="mb-4">
          <span className="font-semibold">State the greedy rule precisely.</span> &ldquo;Pick
          the earliest-finishing activity&rdquo; — not &ldquo;pick the shortest&rdquo; or
          &ldquo;pick the earliest-starting&rdquo;. Wrong sort keys give wrong answers in
          subtle ways.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Handle ties deliberately.</span> Tie-breaking rules
          can change correctness. If two edges have equal weight in Kruskal, any order works;
          in job-scheduling-by-deadline, wrong tie-breaking can violate the feasibility of
          the schedule.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Prefer sort when input is static.</span> If you
          know all items upfront, sort-once is cleaner than maintaining a heap. Switch to a
          heap only when items arrive online or when scores mutate.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Use stable sort when order matters.</span> For
          problems where equal-score items have a natural secondary order (arrival order,
          priority class), stable sort preserves that order for free.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Separate scoring from selection.</span> Pulling the
          scoring function into its own helper makes it easy to swap rules during
          correctness debugging.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <p className="mb-4">
          <span className="font-semibold">Assuming greedy works because it feels natural.</span>
          Students (and interns) regularly write greedy for 0/1 knapsack, coin change on
          arbitrary denominations, bin packing, or graph coloring. It passes the first few
          tests and fails in production.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Wrong sort key.</span> Activity selection sorted by
          start time (instead of finish time) is wrong. Kruskal sorted by anything other than
          weight is wrong. Always document <em>why</em> the key is correct.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Ignoring feasibility checks.</span> Greedy must
          skip a candidate that would violate a constraint. In Kruskal, adding an edge that
          closes a cycle is illegal — without the union-find check, greedy builds a graph
          that is not a tree.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Applying greedy to coin change on arbitrary coin
          sets.</span> Works on canonical systems (USD, EUR) and fails on non-canonical
          (historical UK, some fictional currencies). Not a bug in greedy — a mismatch between
          the theorem&rsquo;s hypothesis and your input.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Reusing a greedy for a close-but-different
          problem.</span> Activity selection and weighted interval scheduling look alike but
          the second is NOT solved by earliest-finish — it needs DP. Small problem-statement
          changes can nullify the exchange argument.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Confusing approximation with exact.</span> Set-cover
          greedy is an H(n)-approximation, not an exact algorithm. Shipping it as &ldquo;the
          optimum&rdquo; is a correctness bug.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Overlooking negative weights for Dijkstra.</span>
          Dijkstra&rsquo;s greedy argument requires non-negative edge weights. Many
          implementations silently run with negatives and return wrong distances; use
          Bellman-Ford or reweight via Johnson&rsquo;s.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <p className="mb-4">
          <span className="font-semibold">Compression: Huffman coding.</span> Core of DEFLATE
          (gzip, PNG), JPEG DC coefficients, and many file formats. Greedy merges the two
          lowest-frequency nodes; exchange argument proves optimality for prefix codes.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Scheduling: activity selection and job
          sequencing.</span> Classroom scheduling, TV programming blocks, operating-room
          assignment — any problem of picking a non-overlapping maximal subset. The earliest-
          finishing-time rule is ubiquitous.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Networking: MST for spanning tree protocols.</span>
          Kruskal and Prim underlie physical-network backbone planning (fiber rollout, cable
          TV), VLAN spanning-tree construction, and some clustering algorithms (single-linkage
          clustering is equivalent to MST).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Routing: Dijkstra&rsquo;s algorithm.</span> The
          shortest-path workhorse of IP networking (OSPF), GPS navigation, and game-AI
          pathfinding (A* is Dijkstra plus a heuristic). Non-negative-weight assumption is
          almost always satisfied in real topologies.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Resource allocation: fractional knapsack.</span>
          Trading strategies (buy as much as possible of the highest-Sharpe-ratio asset),
          fluid allocation (mix ingredients proportionally), and energy distribution all use
          ratio-based greedy.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Approximation: set cover.</span> Log-factor-optimal
          greedy powers sensor-placement heuristics, feature-selection for ML preprocessing,
          and content-deduplication (&ldquo;cover the most pages with the fewest shingles&rdquo;).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Online problems: paging, ski-rental, load
          balancing.</span> Competitive-ratio analysis of greedy algorithms underlies cache
          replacement (LRU is 2-competitive for paging), rent-vs-buy decisions, and online
          bin packing.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Economics: second-price auctions and matching.</span>
          Gale-Shapley stable matching is a greedy algorithm that terminates with a stable
          pairing; a variant is used by the National Resident Matching Program and NYC
          public-school admissions.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/greedy-fundamentals-diagram-3.svg"
          alt="Greedy failure modes, matroid theorem, and algorithm-selection checklist"
          caption="When greedy fails, fall back to DP, B&amp;B, or approximation. When the problem is a matroid, greedy is guaranteed optimal."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 55 — Jump Game.</span> Can you reach the
          end? Expected answer: greedy track the farthest reachable index; if at any step you
          exceed the current max reach, return false. O(n).
        </p>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 45 — Jump Game II.</span> Minimum jumps.
          Expected answer: BFS-style greedy over the reachable horizon.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 134 — Gas Station.</span> Circular tour
          greedy — skip segments where tank goes negative; unique start if one exists.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 452 — Minimum Arrows to Burst
          Balloons.</span> Interval scheduling variant — sort by end, greedy merge.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 621 — Task Scheduler.</span> Greedy with
          a priority queue (most-frequent first).
        </p>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 435 — Non-overlapping Intervals.</span>
          Classic activity selection: earliest-finish-first greedy, remove the minimum
          intervals.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 763 — Partition Labels.</span> Greedy on
          the last occurrence of each character to determine partition boundaries.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Follow-ups interviewers favor:</span> prove
          correctness with an exchange argument. Can you give a counter-example for a
          different sort key? Why does DP work but greedy doesn&rsquo;t for 0/1 knapsack?
          What is a matroid and how does it guarantee greedy optimality?
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <p className="mb-4">
          CLRS chapter 16 is the canonical introduction to greedy algorithms, covering the
          greedy-choice property, optimal substructure, activity selection, Huffman, and an
          introduction to matroids. Kleinberg &amp; Tardos give the cleanest exchange-argument
          proofs.
        </p>
        <p className="mb-4">
          Edmonds, &ldquo;Matroids and the greedy algorithm&rdquo; (Mathematical Programming
          1971) is the classical reference tying greedy and matroid structure. Oxley,
          <em> Matroid Theory</em> (2011) is the modern textbook.
        </p>
        <p className="mb-4">
          Vazirani, <em>Approximation Algorithms</em> (2001) covers greedy algorithms as
          approximation schemes — set cover, vertex cover, TSP, and more. Competitive-ratio
          analysis is developed in Borodin &amp; El-Yaniv, <em>Online Computation and
          Competitive Analysis</em> (1998).
        </p>
      </section>
    </ArticleLayout>
  );
}
