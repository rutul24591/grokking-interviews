"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "bitmask-dp",
  title: "Bitmask DP (TSP and Beyond)",
  description:
    "Bitmask DP — subset-indexed DP with 2ⁿ states. Held-Karp TSP in O(n²·2ⁿ), assignment, profile DP, and sum-over-subsets transforms.",
  category: "other",
  subcategory: "algorithms",
  slug: "bitmask-dp",
  wordCount: 4800,
  readingTime: 24,
  lastUpdated: "2026-04-20",
  tags: ["bitmask-dp", "tsp", "held-karp", "dynamic-programming", "subsets"],
  relatedTopics: [
    "dp-fundamentals",
    "knapsack-01",
    "coin-change",
    "dp-on-trees",
  ],
};

export default function BitmaskDpArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p className="mb-4">
          <span className="font-semibold">Bitmask DP</span> is a dynamic programming technique
          in which the state is indexed, in whole or in part, by a subset of a finite ground
          set {`{0, 1, …, n − 1}`} — and that subset is encoded as an n-bit integer. A DP with
          2ⁿ subset states lets us enumerate all subsets in time linear in their number, using
          bitwise operations for union, intersection, inclusion, and popcount.
        </p>
        <p className="mb-4">
          The canonical application is the <span className="font-semibold">Held-Karp
          algorithm</span> (1962) for the Traveling Salesman Problem. By indexing on (visited
          set, current city), Held-Karp solves TSP in O(n² · 2ⁿ) time — still exponential, but
          astronomically better than the O(n!) brute force. For n = 20 the brute force is
          infeasible (2.4 × 10¹⁸ permutations); Held-Karp runs in about 4 × 10⁸ ops — seconds on
          commodity hardware.
        </p>
        <p className="mb-4">
          Beyond TSP, bitmask DP is the right hammer whenever a problem has a small universe
          (typically n ≤ 20) and state depends on a subset of that universe: assignment
          problems, set partitioning, profile DP for tilings, and sum-over-subsets (SOS)
          transforms. It shows up in scheduling, compiler register allocation, circuit design,
          and any domain where the combinatorial structure fits under a 32-bit mask.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <p className="mb-4">
          <span className="font-semibold">Subset encoding.</span> A subset S ⊆ {`{0..n−1}`} is
          stored as an integer whose i-th bit is 1 iff i ∈ S. With this encoding, |S| =
          popcount(mask), union = bitwise OR, intersection = bitwise AND, symmetric difference =
          XOR, and complement (relative to the full set) = mask ^ ((1 &lt;&lt; n) − 1).
        </p>
        <p className="mb-4">
          <span className="font-semibold">State space.</span> Most bitmask DPs have 2ⁿ states
          (one per subset) or n · 2ⁿ states (one per subset × element). The practical limit is
          n = 20–22; at n = 25 the state count explodes past 32 million, and at n = 30 you need
          a billion-cell table.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Bit tricks you will reuse constantly.</span> To
          iterate the set bits of a mask: while mask, pick bit = mask &amp; −mask, process it,
          mask ^= bit. To enumerate every submask of a fixed mask: sub = mask; while sub &gt; 0:
          use sub; sub = (sub − 1) &amp; mask; handle sub = 0 separately. The submask
          enumeration visits Σ over all masks of 2^popcount(mask) = 3ⁿ total submasks — still
          exponential but a standard building block.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Held-Karp state.</span> dp[mask][i] = min cost of a
          path starting at city 0, visiting exactly the cities in mask, and ending at city i.
          Base case dp[{`{0}`}][0] = 0; transition dp[mask][i] = min over j in mask \ {`{i}`}
          of dp[mask \ {`{i}`}][j] + dist(j, i). Final answer = min over i ≠ 0 of dp[full][i] +
          dist(i, 0), adding the return edge.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Why (mask, i) together.</span> The subset alone is
          not sufficient — the cost of extending depends on where we currently are. The pair
          captures exactly the information needed for optimal substructure: given the path
          endpoint and the set of visited nodes, the remaining subproblem is independent of
          the order in which the visited nodes were traversed.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/bitmask-dp-diagram-1.svg"
          alt="Subset-as-integer encoding and a bitwise operations cheat sheet"
          caption="The fundamental trick: subsets as integers. Bitwise ops do set algebra in one CPU cycle each."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p className="mb-4">
          <span className="font-semibold">Held-Karp flow.</span> Allocate dp[2ⁿ][n] initialized
          to ∞. Set dp[1 &lt;&lt; 0][0] = 0. Iterate masks in increasing order of popcount (or
          in numeric order — a mask only depends on masks with one less bit, which are smaller
          numerically). For each mask with bit 0 set, for each end-city i in mask (i ≠ 0), for
          each predecessor j in mask (j ≠ i), update dp[mask][i] with dp[mask ^ (1&lt;&lt;i)][j]
          + dist(j, i).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Reconstruction.</span> Store a parent pointer
          parent[mask][i] = the j that minimized dp[mask][i]. After finding the argmin at the
          full mask, walk backward: at each step, subtract bit i from mask and move to parent.
          Reverses to the tour.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Assignment problem pattern.</span> dp[mask] = min
          cost of assigning the first popcount(mask) workers to the tasks in mask. Transition:
          let k = popcount(mask); for each j in mask, dp[mask] = min(dp[mask ^ (1&lt;&lt;j)] +
          cost[k − 1][j]). O(n · 2ⁿ) time and space.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Set-partition pattern.</span> dp[mask] = min (or
          count) of partitions of mask into valid groups. Transition uses submask enumeration:
          for each submask sub of mask satisfying a predicate valid(sub), combine with dp[mask
          ^ sub]. Total work Θ(3ⁿ).
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/bitmask-dp-diagram-2.svg"
          alt="Held-Karp TSP state definition and 4-city example"
          caption="Held-Karp's dp[mask][i] state, with the 4-city example of how the table is filled and the answer extracted."
        />
        <p className="mb-4">
          <span className="font-semibold">Profile DP (broken-profile).</span> For tilings of an
          m × n grid with dominoes, process cells in row-major order carrying a bitmask profile
          of which cells in the current &ldquo;frontier&rdquo; are already covered. Transitions
          choose what to do at the current cell (leave, place horizontal, place vertical) and
          compute the next profile. Complexity O(m · n · 2^m) with m on the short axis.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Sum-over-subsets (SOS) DP.</span> Given g[·], compute
          f[mask] = Σ g[sub] over all sub ⊆ mask. Naive O(3ⁿ); the layered trick processes bits
          one at a time and drops it to O(n · 2ⁿ). Think of it as an n-dimensional
          zeta-transform over the Boolean lattice. The inverse (Möbius) is symmetric and has
          the same complexity.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <p className="mb-4">
          <span className="font-semibold">Held-Karp vs brute force.</span> Brute force tries
          every permutation: n!. Held-Karp is n² · 2ⁿ. Crossover is at n ≈ 6; beyond that
          Held-Karp dominates. At n = 20, the gap is 10 orders of magnitude.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Held-Karp vs branch-and-bound / LP.</span> Modern TSP
          solvers like Concorde use branch-and-cut with LP relaxation and routinely handle
          n = 85,000 cities exactly. Held-Karp&rsquo;s strength is simplicity and predictability
          for small n; Concorde wins asymptotically but requires a full LP machinery.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Held-Karp vs Christofides.</span> Christofides is an
          approximation algorithm for metric TSP with a 1.5× guarantee, polynomial time.
          Held-Karp is exact but exponential. Use Held-Karp when you need optimum and n is
          small; Christofides (or Lin-Kernighan) when n is large and approximation is acceptable.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Bitmask vs Hungarian for assignment.</span> Hungarian
          runs O(n³) and dominates for all interesting n. Bitmask DP for assignment is only
          competitive when side constraints (skill requirements, precedence, etc.) make
          Hungarian inapplicable and n ≤ 20.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Memoized top-down vs iterative.</span> Top-down with
          a hashmap can skip unreachable states — useful when the reachable subgraph is sparse
          (TSP with large forbidden-edge sets). Iterative wins on dense problems by avoiding
          function-call overhead.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Bitmask DP vs meet-in-the-middle.</span> For some
          subset problems (subset-sum, max-weight-subset), meet-in-the-middle runs in
          O(n · 2^(n/2)) — dramatically faster than bitmask DP&rsquo;s O(2ⁿ). Bitmask DP is
          preferred when transitions are not obviously splittable or when we need all subsets&rsquo;
          values rather than a single query.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <p className="mb-4">
          <span className="font-semibold">Verify n fits before writing.</span> Compute 2ⁿ · n
          before starting; if it exceeds 10⁸ on a 1-second budget, bitmask DP will not finish.
          For n ≤ 20 with simple transitions, budget it. For n = 22 and higher, profile
          carefully.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Use primitive arrays, not hashmaps, for dense
          masks.</span> A flat int array of size 2ⁿ has zero overhead; a hashmap keyed on mask
          costs 20–100× more per access. Only use hashmaps for sparse mask spaces.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Prefer bottom-up for 2ⁿ problems.</span> Top-down
          recursion recurses up to 2ⁿ deep in the worst case and on languages with 10k-stack
          limits (JavaScript, default Python) will overflow at n = 14. Iterative has no such
          limit.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Pin element 0 to break rotational symmetry.</span>
          For TSP, fixing the tour to start at city 0 cuts work by a factor of n. Submitting
          answers should always acknowledge this convention.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Use popcount hardware intrinsics.</span> __builtin_popcount
          (C/C++), Integer.bitCount (Java), (n).bit_count() (Python 3.10+) — all compile to a
          single CPU instruction on modern hardware. A naive while-loop popcount is 10× slower.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Pre-compute neighbor masks.</span> For graph problems
          where transitions depend on neighbors, storing an adjacency mask per vertex lets you
          iterate neighbors with mask &amp; −mask. Costs O(n²) setup, saves a factor of n on
          every transition.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Guard against overflow at n = 31 or 63.</span> 1
          &lt;&lt; 31 is undefined for signed int32 in C/C++ and wraps to INT_MIN. Use 1u
          &lt;&lt; 31 or switch to 64-bit masks explicitly.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <p className="mb-4">
          <span className="font-semibold">Using n beyond practical limits.</span> Students write
          Held-Karp and feed it n = 30. The 2³⁰ · 30² = 10¹² operations will not finish this
          year. Always sanity-check the state-space size before running.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Wrong iteration order.</span> Held-Karp needs masks
          processed so that mask ^ (1 &lt;&lt; i) has been computed first. Numeric order works
          (removing a bit decreases the integer), but if you process masks in popcount order
          for some other variant, get the order right or you read uninitialized cells.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Forgetting the return edge in TSP.</span> dp[full][i]
          is the cost of a path that ends at i, not a cycle. Answer = min over i of dp[full][i]
          + dist(i, 0). Many first attempts ship dp[full][i] and silently miss a term.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Operator precedence bugs.</span> mask &amp; 1
          &lt;&lt; i parses as mask &amp; (1 &lt;&lt; i) in most languages — correct. But mask
          &amp; 1 &lt;&lt; i + 1 parses as mask &amp; (1 &lt;&lt; (i + 1)) — usually what you
          want, but always parenthesize for clarity.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Submask enumeration missing sub = 0.</span> The loop
          sub = mask; sub = (sub − 1) &amp; mask; exits before visiting sub = 0. If the empty
          subset is valid for your problem, handle it outside the loop.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Confusing subset and superset iteration.</span>
          submask iteration walks subsets of a fixed mask; superset iteration walks supersets.
          They look symmetric but are not — getting them mixed up yields wildly wrong counts.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Assuming Held-Karp extends trivially to
          constraints.</span> Adding time windows, vehicle capacity, or precedence to TSP
          usually keeps the DP structure but may require extra state dimensions (dp[mask][i][t])
          that blow up memory by another factor. Budget for that.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <p className="mb-4">
          <span className="font-semibold">Vehicle routing and small-fleet TSP.</span> Held-Karp
          is the go-to for route optimization when the number of stops is under 20 — last-mile
          delivery with 15 parcels per driver, technician dispatch with 10 on-site visits,
          surgical-ward rounding with 12 patients. Bigger problems use branch-and-bound or
          OR-Tools.
        </p>
        <p className="mb-4">
          <span className="font-semibold">PCB drilling and CNC toolpaths.</span> Drilling
          sequences for printed circuit boards — classical TSP instances with hundreds of
          holes per board. For small boards (prototypes, service work) Held-Karp produces
          verifiably optimal paths.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Compiler register allocation.</span> For very small
          basic blocks with up to 20 live variables, bitmask DP over subsets of live registers
          finds provably optimal spill schedules. Modern compilers typically use graph
          coloring heuristics, but the bitmask approach is used in research and for tiny DSP
          blocks where optimality matters.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Assignment with side constraints.</span> Crew
          scheduling (pilot-to-flight, nurse-to-shift) with a dozen agents and a dozen jobs,
          where skill matrices and preference constraints make the vanilla Hungarian algorithm
          insufficient. Bitmask DP handles the side constraints naturally.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Profile DP in tiling and combinatorics.</span>
          Counting ways to tile a chessboard with pentominoes, dominoes, or arbitrary shapes
          shows up in recreational math, coding theory (enumeration of binary codes), and in
          the physics of Ising models via the transfer-matrix method.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Set-cover in query optimization.</span> Relational
          query planners pick sets of indexes/materialized views to answer a batch of queries.
          Restricted to small query batches, bitmask DP finds optimal index selection.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Team formation and fantasy sports.</span> Choose a
          subset of 15 of n candidates to maximize total expected utility under budget and
          position constraints. With a pre-processed value table, the bitmask DP is tractable
          for n up to around 20 and is used by daily-fantasy optimizers.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Cryptography and coding theory.</span> SOS
          (sum-over-subsets) transforms appear in fast subset convolution for polynomial
          identity testing, decoding of Reed-Muller codes, and some circuit-evaluation
          algorithms.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/bitmask-dp-diagram-3.svg"
          alt="Bitmask DP patterns beyond TSP: assignment, partitioning, profile DP, SOS"
          caption="Bitmask DP is a family, not a single algorithm. TSP is the flagship, but assignment, partitioning, profile DP, and SOS share the same subset-as-integer spine."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 943 — Find the Shortest Superstring.</span>
          Concatenate strings with maximum overlap — reduces to TSP over n ≤ 12 strings where
          &ldquo;distance&rdquo; is the negated overlap. Expected answer: Held-Karp with pre-
          computed overlap table. Classic bitmask DP interview problem.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 847 — Shortest Path Visiting All Nodes.</span>
          BFS over (current node, visited mask) state. Expected answer: O(n² · 2ⁿ) BFS with
          bitmask state — the same skeleton as Held-Karp but unit-weight.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 1125 — Smallest Sufficient Team.</span>
          Partition required skills among people. Expected answer: dp[skill_mask] = min set of
          people covering those skills; transition adds one person at a time.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 691 — Stickers to Spell Word.</span> Cover a
          target word with copies of stickers. Expected answer: dp[mask] over subsets of target
          letters — bitmask DP on up to 15 distinct letters.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 1986 — Minimum Number of Work Sessions.</span>
          Bin-pack tasks into fixed-duration sessions. Expected answer: bitmask DP with
          (mask, current session residual).
        </p>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 1723 — Find Minimum Time to Finish All
          Jobs.</span> Minimax assignment of jobs to k workers. Bitmask DP with dp[i][mask] =
          min max-load distributing jobs in mask among the first i workers.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Follow-ups interviewers favor:</span> what limits n?
          (2ⁿ state count). How would you reconstruct the tour? (parent pointers). What if
          edges have time windows? (add a time dimension). What if the graph is asymmetric?
          (Held-Karp works unchanged — distances need not be symmetric). Could you parallelize?
          (yes, masks at the same popcount are independent).
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <p className="mb-4">
          Held &amp; Karp, &ldquo;A dynamic programming approach to sequencing problems&rdquo;
          (SIAM 1962) — the original paper introducing bitmask DP for TSP. Bellman also
          described an equivalent algorithm independently in 1962.
        </p>
        <p className="mb-4">
          CLRS covers Held-Karp briefly in the DP chapter; Dasgupta, Papadimitriou, and Vazirani
          give the clearest introductory treatment. CP-Algorithms hosts a definitive tutorial
          on both Held-Karp and SOS DP with pseudo-code.
        </p>
        <p className="mb-4">
          Applegate, Bixby, Chvátal, &amp; Cook, <em>The Traveling Salesman Problem: A
          Computational Study</em> (2006) — the industrial state-of-the-art (Concorde solver)
          that takes over when Held-Karp runs out of room. Fomin &amp; Kratsch, <em>Exact
          Exponential Algorithms</em> (2010) — broader survey of subset-DP techniques. Yates,
          &ldquo;The design and analysis of factorial experiments&rdquo; (1937) is the
          ancestor of SOS DP.
        </p>
      </section>
    </ArticleLayout>
  );
}
