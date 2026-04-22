"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "knapsack-01",
  title: "0/1 Knapsack",
  description:
    "0/1 Knapsack — the archetypal DP. O(nW) pseudo-polynomial, NP-hard in input size. Unbounded, subset-sum, and meet-in-the-middle variants.",
  category: "other",
  subcategory: "algorithms",
  slug: "knapsack-01",
  wordCount: 5000,
  readingTime: 25,
  lastUpdated: "2026-04-20",
  tags: ["knapsack", "dynamic-programming", "subset-sum", "np-hard"],
  relatedTopics: ["dp-fundamentals", "coin-change", "bitmask-dp", "greedy-fundamentals"],
};

export default function KnapsackArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p className="mb-4">
          The 0/1 Knapsack problem: given n items with weights w₁..wₙ and values v₁..vₙ, and a
          knapsack of capacity W, select a subset of items to maximize total value subject to
          total weight ≤ W. Each item may be included at most once — hence &ldquo;0/1&rdquo; (take
          or skip). It is one of the foundational problems of combinatorial optimization and the
          archetypal dynamic programming problem.
        </p>
        <p className="mb-4">
          Knapsack is <span className="font-semibold">NP-hard</span> in the size of its input (a
          reduction from subset sum establishes this), but admits a
          <span className="font-semibold"> pseudo-polynomial</span> O(nW) DP. The distinction
          matters: O(nW) is efficient when W is bounded polynomially in n, but blows up when W is
          given as a binary-encoded integer (then W can be exponentially large in the bit length).
          This is a key interview talking point — knapsack is a go-to example of the
          pseudo-polynomial vs strongly-polynomial distinction.
        </p>
        <p className="mb-4">
          Beyond toy examples, knapsack models many real problems: capital budgeting (investment
          portfolio with capital constraint), cargo loading, cryptographic subset-sum puzzles
          (Merkle-Hellman), and cloud resource allocation (pack tasks onto a VM with limited
          memory). Variants — unbounded knapsack, multi-dimensional, multi-objective — cover a
          substantial fraction of operations-research problems in practice.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <p className="mb-4">
          <span className="font-semibold">State:</span> dp[i][w] = maximum value using any subset
          of the first i items with total weight ≤ w. Answer is dp[n][W]. There are (n+1)(W+1)
          states, each computed in O(1).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Transition:</span> dp[i][w] = max(dp[i−1][w], dp[i−1][w
          − wᵢ] + vᵢ). The first term skips item i; the second takes it (requires w ≥ wᵢ). The
          recurrence encodes the take-or-skip decision explicitly. Base cases: dp[0][*] = 0 (no
          items → zero value) and dp[*][0] = 0 (no capacity → zero value).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Space optimization</span>: since dp[i][*] depends only
          on dp[i−1][*], roll to a 1D array. Iterate w from W down to wᵢ so that when computing
          dp[w], dp[w − wᵢ] still holds the previous row&rsquo;s value. Iterating low-to-high
          would read already-updated cells, effectively making items reusable — that&rsquo;s
          unbounded knapsack, a different problem.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Recovering the chosen items:</span> the value-only DP
          returns the optimum but not which items. To recover: walk backward from dp[n][W]; if
          dp[i][w] == dp[i−1][w], item i was skipped; else it was taken (w -= wᵢ). Requires
          keeping the full 2D table — the 1D space-optimized version loses this information.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/knapsack-01-diagram-1.svg"
          alt="0/1 knapsack DP table computation trace"
          caption="4 items, capacity 7. Each cell dp[i][w] = max(skip, take). Answer dp[4][7] = 9; traceback identifies items {1, 3}."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p className="mb-4">
          The DP table fills row by row (item by item), left to right (capacity 0 → W). For each
          item i, the row computes the best value achievable if items 1..i were available. The
          final cell dp[n][W] is the answer. Space-optimized version keeps one row of length W+1,
          overwriting in place — right-to-left for 0/1 (preserve previous values when needed
          again).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Unbounded knapsack</span> is the same problem with
          unlimited copies of each item. The recurrence is dp[w] = max over items i of dp[w − wᵢ]
          + vᵢ. The 1D iteration order reverses: iterate w from wᵢ up to W, so each item
          can be taken repeatedly. This is the same code with one loop direction flipped — a
          subtle difference that&rsquo;s a favorite interview trap.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Subset-sum</span> is the decision-version special case:
          &ldquo;does any subset sum to exactly S?&rdquo; DP: dp[i][s] = can the first i items
          sum to exactly s? O(nS) time and space. Same space rollover trick applies. Partition
          problem (split into two equal halves) reduces to subset-sum with target sum/2.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/knapsack-01-diagram-2.svg"
          alt="0/1 vs unbounded knapsack iteration order"
          caption="0/1: iterate capacity high-to-low (preserve previous row). Unbounded: low-to-high (reuse current row). One line, two algorithms."
        />
        <p className="mb-4">
          <span className="font-semibold">Meet-in-the-middle</span> for large n with small
          W-bit-length: split items into two halves of size n/2, enumerate all 2^(n/2) subset
          sums for each half, sort one list, and for each sum in the other do a binary search.
          Runtime O(2^(n/2) · n), space O(2^(n/2)). Handles n up to ~40 where O(nW) DP fails
          because W is astronomically large.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <p className="mb-4">
          <span className="font-semibold">DP vs Greedy:</span> greedy by value-to-weight ratio
          works optimally for
          <em> fractional</em> knapsack (items can be split), not 0/1. Counter-example: items
          (w=1, v=5), (w=3, v=12), (w=3, v=12), capacity 4. Greedy takes (1,5) then can&rsquo;t
          fit a 3 → total 5. Optimal: take one (3,12) → 12. DP finds this; greedy
          doesn&rsquo;t. Fractional greedy is O(n log n); 0/1 DP is O(nW).
        </p>
        <p className="mb-4">
          <span className="font-semibold">DP vs Branch &amp; Bound:</span> B&amp;B with
          value-density bound can outperform DP on small n or sparse weights. Production solvers
          (Gurobi, CPLEX) use hybrid approaches: LP relaxation for bounds, B&amp;B for search,
          DP for small subproblems. For exams and interviews, DP is the reference.
        </p>
        <p className="mb-4">
          <span className="font-semibold">DP vs FPTAS:</span> Fully Polynomial-Time Approximation
          Scheme. Scale values by ε, solve DP in O(n²/ε) time, get (1−ε) approximation. Allows
          trading accuracy for speed — 1% error, 10000× speedup. Ibarra-Kim algorithm (1975)
          establishes knapsack admits an FPTAS, distinguishing it from &ldquo;strongly&rdquo;
          NP-hard problems.
        </p>
        <p className="mb-4">
          <span className="font-semibold">DP vs ILP:</span> integer linear programming expresses
          knapsack naturally: maximize Σvᵢxᵢ subject to Σwᵢxᵢ ≤ W, xᵢ ∈ {0, 1}. Modern ILP
          solvers are highly optimized and handle multi-constraint knapsacks that plain DP
          can&rsquo;t. For 10+ constraints or 10⁶+ items, ILP beats DP.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <p className="mb-4">
          Check the capacity W before choosing DP. If W is bounded by ~10⁶ and n by ~10⁴, the
          O(nW) DP is fine. If W is given as a 64-bit integer, DP is hopeless — switch to
          meet-in-the-middle, FPTAS, or branch-and-bound.
        </p>
        <p className="mb-4">
          Always write the 2D DP first. It&rsquo;s easier to reason about and test. Only roll to
          1D after verifying correctness; the direction (high-to-low vs low-to-high) is a
          frequent source of subtle bugs that pass small tests but fail at scale.
        </p>
        <p className="mb-4">
          When the problem says &ldquo;items,&rdquo; check reuse semantics carefully. &ldquo;Each
          item at most once&rdquo; → 0/1. &ldquo;Unlimited supply&rdquo; → unbounded. &ldquo;Up
          to k copies of each&rdquo; → bounded knapsack, solvable by expanding to k copies of each
          item and running 0/1, or via binary grouping for efficiency.
        </p>
        <p className="mb-4">
          For item-recovery, either keep the full 2D table or store a decision bit per cell.
          Trying to recover from a 1D table requires re-running the DP, which may double total
          runtime.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <p className="mb-4">
          <span className="font-semibold">Wrong iteration direction in 1D roll:</span>
          low-to-high turns 0/1 into unbounded. Symptom: values exceed what&rsquo;s achievable,
          off by 2× or more. Always iterate high-to-low for 0/1.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Integer overflow on large values:</span> summing values
          across n items with max value 10⁹ overflows int32 at n=3. Use int64. Real-world cargo
          optimization has tripped on this.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Treating fractional greedy result as 0/1 optimum:</span>
          the fractional LP relaxation gives an upper bound, not the 0/1 answer. Using it
          directly produces wrong results.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Memoizing with tuples in Python:</span> @lru_cache on
          (i, w) is 10× slower than a 2D list for knapsack-sized inputs. For n=1000, W=10⁶, this
          difference is minutes vs seconds.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Confusing item count with state dimension:</span>
          knapsack state is (items_considered, capacity_remaining). Adding weight or value to the
          state is a common novice error that blows complexity to exponential.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <p className="mb-4">
          <span className="font-semibold">Cloud bin packing:</span> placing containers onto VMs
          with memory/CPU constraints is a multi-dimensional knapsack variant. Kubernetes&rsquo;
          default scheduler uses heuristic variants; research papers have applied DP to smaller
          clusters with optimal results.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Capital budgeting:</span> project portfolio selection
          under a fixed budget maximizing NPV. Classical OR application; pseudo-polynomial DP
          works when budget granularity is coarse.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Cryptographic knapsacks:</span> Merkle-Hellman
          knapsack-based public-key crypto (1978) relies on the hardness of 0/1 knapsack. It was
          broken (Shamir, 1982) using lattice reduction — the superincreasing structure allowed
          easy solution. Still studied as a pedagogical example of why &ldquo;NP-hard in general
          input&rdquo; doesn&rsquo;t guarantee cryptographic security.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Cargo loading and stowage:</span> airlines and shipping
          companies solve multi-dimensional knapsacks nightly to pack planes and containers.
          Real problems have 10–50 constraints (weight, volume, hazardous-material separation),
          solved by ILP with knapsack-DP-based cuts.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Resource allocation in CDN caching:</span> pick which
          objects to cache given storage limits to maximize expected hit rate (value = expected
          future requests × object size ratio). Knapsack with statistical value estimates.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/knapsack-01-diagram-3.svg"
          alt="Knapsack variants and complexity summary"
          caption="0/1, unbounded, bounded, subset-sum, partition, and multi-dim knapsack. All DP-solvable; complexity differs by state dimensionality."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <p className="mb-4">
          <span className="font-semibold">Implement 0/1 knapsack.</span> Start with 2D DP, then
          roll to 1D explaining the direction choice. Mention Θ(nW) time/space, pseudo-polynomial.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Why is knapsack NP-hard but has a polynomial DP?</span>
          Pseudo-polynomial: O(nW) depends on W&rsquo;s magnitude, not its bit length. With W =
          2⁶⁴, the DP has 2⁶⁴ states. In the input size (log W bits), this is exponential. Any
          strongly NP-hard problem has no pseudo-polynomial algorithm unless P = NP.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Unbounded knapsack.</span> Same recurrence, iterate
          low-to-high in 1D. Each item reusable. O(nW).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Subset sum.</span> Special case of knapsack with value
          = weight and target W. Asks for existence, not max value. Also O(nS).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Partition into two equal-sum subsets.</span> Reduces to
          subset-sum with target = totalSum / 2. Only feasible if totalSum is even.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Meet-in-the-middle for n=40.</span> Split into halves,
          enumerate 2²⁰ subset sums each, binary-search pairings. O(n · 2^(n/2)).
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Martello &amp; Toth, <em>Knapsack Problems: Algorithms and Computer Implementations</em> (1990) — exhaustive treatment.</li>
          <li>Kellerer, Pferschy &amp; Pisinger, <em>Knapsack Problems</em> (2004) — modern variants and FPTAS.</li>
          <li>Ibarra &amp; Kim, &ldquo;Fast approximation algorithms for the knapsack and sum of subset problems&rdquo; (1975) — original FPTAS.</li>
          <li>Shamir, &ldquo;A polynomial-time algorithm for breaking the basic Merkle-Hellman cryptosystem&rdquo; (1982).</li>
          <li>CLRS, §16.2 — fractional knapsack (greedy) as the contrast to 0/1.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
