"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "coin-change",
  title: "Coin Change",
  description:
    "Coin change — the canonical unbounded-knapsack problem. Min-coins DP, count-of-ways, why greedy fails, canonical systems, and BFS/Dijkstra alternatives for huge amounts.",
  category: "other",
  subcategory: "algorithms",
  slug: "coin-change",
  wordCount: 4700,
  readingTime: 23,
  lastUpdated: "2026-04-20",
  tags: ["coin-change", "dynamic-programming", "unbounded-knapsack", "greedy"],
  relatedTopics: [
    "knapsack-01",
    "dp-fundamentals",
    "greedy-fundamentals",
    "bfs",
  ],
};

export default function CoinChangeArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p className="mb-4">
          The <span className="font-semibold">coin change</span> problem asks: given an amount A
          and a set of coin denominations {`{c₁, …, cₙ}`}, find either (a) the minimum number of
          coins that sum to A, or (b) the number of distinct ways to make A. Each denomination
          is available in unlimited supply (&ldquo;unbounded&rdquo;) unless otherwise specified.
        </p>
        <p className="mb-4">
          Coin change is the textbook example of an <span className="font-semibold">unbounded
          knapsack</span>: items with unit cost (coin count) and value (the sum), where any item
          can be taken any number of times. It is also the standard vehicle for teaching why
          greedy algorithms are treacherous — they work on the US coin system
          {` {1, 5, 10, 25}`} but fail on {` {1, 3, 4}`} for amount 6. The distinction between
          &ldquo;canonical&rdquo; and &ldquo;non-canonical&rdquo; coin systems was formalized
          only in the 2000s (Pearson&rsquo;s polynomial test).
        </p>
        <p className="mb-4">
          Real-world instances appear in ATM cash dispensers, billing systems that must split
          amounts into pre-defined denominations, postal-rate computation (the Frobenius
          problem — largest amount not expressible), and any resource-allocation problem whose
          inputs factor into discrete bucket sizes. Interviewers favor coin change because the
          DP is simple enough to write in ten minutes yet opens the door to ordering of loops,
          reconstruction, and graph-theoretic reformulations.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <p className="mb-4">
          <span className="font-semibold">Minimum-coin DP.</span> State: dp[a] = minimum number
          of coins summing to a, with dp[0] = 0 and dp[a] = ∞ for impossible amounts.
          Transition: dp[a] = 1 + min over c in coins of dp[a − c] for a ≥ c. Compute amounts in
          increasing order; answer is dp[A] (or −1 if still ∞).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Count-of-ways DP.</span> State: ways[a] = number of
          unordered multisets of coins summing to a, with ways[0] = 1. Transition: iterate
          <em> coins on the outer loop</em>, amounts on the inner — ways[a] += ways[a − c]. The
          loop order is load-bearing: with amounts outer and coins inner, you count ordered
          sequences (permutations), which is a different problem.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Why unbounded:</span> when iterating amounts in
          ascending order for a fixed coin c, dp[a] is updated using dp[a − c] which may have
          already been updated this pass — meaning coin c can be reused. This is exactly the
          difference from 0/1 knapsack, which iterates capacities in descending order to prevent
          reuse.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Reconstruction.</span> Maintain a parent array
          parent[a] = the coin c that produced the optimum. After filling dp, walk from A down
          to 0 following parent pointers; each step emits one coin. Extra memory: Θ(A).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Complexity.</span> Both variants run in Θ(A · n) time
          and Θ(A) space. This is pseudo-polynomial — linear in the magnitude of A, not in its
          bit-length — which is why the algorithm breaks down for huge amounts (A ~ 10¹²).
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/coin-change-diagram-1.svg"
          alt="DP table for coin change amount 11 with coins 1,2,5 and loop-order note for ways count"
          caption="dp[a] filling for amount 11, and the load-bearing outer-loop-over-coins pattern for the number-of-ways variant."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p className="mb-4">
          <span className="font-semibold">Min-coins, bottom-up.</span> Initialize dp[0] = 0 and
          dp[a] = ∞ for a &gt; 0. For a from 1 to A, for each coin c ≤ a, update dp[a] =
          min(dp[a], dp[a − c] + 1). Final answer: dp[A] if finite, else −1. Two nested loops,
          no recursion — cache-friendly and branch-predictable.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Min-coins, top-down memoized.</span> Recursive function
          f(a) returning min coins for a, with base case f(0) = 0 and memo table on a. Easier to
          write if you are prone to off-by-one bugs but pays a function-call constant factor and
          stack depth up to A / min(coins).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Number-of-ways, bottom-up.</span> Initialize ways[0] =
          1, ways[a] = 0 otherwise. For each coin c, for a from c to A, ways[a] += ways[a − c].
          The outer coin loop fixes the order of insertion — this is exactly why combinations
          are counted rather than permutations.
        </p>
        <p className="mb-4">
          <span className="font-semibold">BFS reformulation.</span> Model amounts 0..A as nodes
          and draw a unit-weight edge from a to a + c for each coin c. Shortest path from 0 to A
          (BFS) equals minimum coins. Equivalent runtime O(A · n) and the same answer, but
          conceptually cleaner for interview pivots (&ldquo;what if each coin had a variable
          cost?&rdquo; — switch to Dijkstra).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Dijkstra for weighted coins.</span> If each coin carries
          a non-unit cost (think: denominations with fees), the graph becomes weighted and we
          run Dijkstra over amounts. For sparse large-A instances with few coins, this beats the
          dense DP grid by using only reachable amounts.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/coin-change-diagram-2.svg"
          alt="Greedy counter-example, canonical-system note, and BFS reformulation of coin change"
          caption="Greedy {1,3,4} fails on 6. The problem is a shortest-path over amounts — BFS finds the same answer as DP, and Dijkstra handles weighted coins."
        />
        <p className="mb-4">
          <span className="font-semibold">Bounded variant.</span> When each denomination has a
          finite supply k_i, fall back to 0/1 knapsack with binary lifting — expand k_i copies
          of coin c as 1, 2, 4, …, (k_i − 2^⌊log k_i⌋) copies. This reduces the number of items
          from Σk_i to Σlog k_i while preserving reachable sums.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <p className="mb-4">
          <span className="font-semibold">DP vs greedy.</span> Greedy (&ldquo;take the largest
          coin that fits&rdquo;) runs in O(n log n) sort + O(A / min(coins)) steps but is
          optimal only for canonical systems. DP is Θ(A · n) but always correct. For production
          systems where you control denominations, verify canonicality once and use greedy;
          otherwise use DP.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Testing canonicality.</span> Pearson (2005) proved
          that a coin system {`{c₁ < c₂ < … < cₙ}`} is canonical iff greedy matches optimal
          for all amounts a ≤ c_{`{n-1}`} + c_n. This gives a polynomial-time check rather than
          trying every amount up to ∞. Practical engineering tip: just brute-force amounts 0 to
          a few thousand against DP — if they agree, ship greedy.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Min-coins vs count-of-ways loop order.</span> For
          min-coins, either outer-coins-inner-amounts or outer-amounts-inner-coins gives the
          same answer (min is associative and commutative). For count-of-ways, only
          outer-coins-inner-amounts counts combinations; swap and you count permutations. This
          subtle asymmetry is the most-asked follow-up in interviews.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Unbounded vs 0/1.</span> Unbounded iterates amounts in
          ascending order (re-using the same coin); 0/1 iterates in descending order (single
          use). The one-character difference between &ldquo;for a in c..A&rdquo; and &ldquo;for
          a in A..c&rdquo; flips the problem — and is the #1 bug when someone copies a 0/1
          knapsack template into an unbounded problem.
        </p>
        <p className="mb-4">
          <span className="font-semibold">DP vs BFS vs Dijkstra.</span> For unit-weight coins,
          BFS and DP are equivalent in time but BFS naturally supports early termination once
          amount A is reached — handy if A is reachable quickly. Dijkstra is needed when coins
          carry different per-coin costs or the graph is sparse at large A.
        </p>
        <p className="mb-4">
          <span className="font-semibold">DP vs generating functions.</span> The number of ways
          to make amount A with coins c₁ … cₙ is the coefficient of x^A in ∏(1 / (1 − x^{`{c_i}`})).
          For small coin sets and huge A, polynomial multiplication via FFT can beat DP. Rarely
          seen in interviews but occasionally in competitive programming.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <p className="mb-4">
          <span className="font-semibold">Prefer DP over greedy unless you&rsquo;ve verified
          canonicality.</span> The runtime hit is usually negligible (amounts under a few
          thousand) and the correctness guarantee is absolute. Document the denominations and
          canonicality status in a code comment so nobody adds a non-canonical coin and silently
          breaks the greedy.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Use a sentinel value that won&rsquo;t overflow.</span>
          A natural sentinel for impossible amounts is INT_MAX, but dp[a − c] + 1 overflows
          when dp[a − c] == INT_MAX. Use A + 1 as sentinel (one more than any valid answer) or
          check for ∞ before adding one.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Always return −1 for impossible answers.</span>
          Leetcode 322 expects exactly that contract. Returning 0 or the sentinel value looks
          like a correct count for small inputs and silently lies on edge cases.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Sort coins in ascending order and prune.</span>
          Impossible if A &lt; min(coins) and A &gt; 0. Also, any coin c &gt; A can be dropped
          from the set up front — small but free wins.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Prefer iterative over memoized when A is large.</span>
          Recursive memoization blows the stack at A / min(coins) depth. On a JavaScript engine
          with 10k stack frames, you&rsquo;ll hit it at A ~ 10k and coin min 1.
        </p>
        <p className="mb-4">
          <span className="font-semibold">For combinations count, always write outer-coins-
          inner-amounts.</span> Write a comment pinning the invariant. The first time someone
          tries to &ldquo;clean up&rdquo; the code by swapping the loops they will silently turn
          combinations into permutations.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Benchmark on realistic amounts.</span> Leetcode caps A
          at 10⁴. Production billing systems might hit A = cents for a $10M transaction — 10⁹.
          At that point the pseudo-polynomial bound stops being polynomial; switch to BFS with
          early termination or rethink the problem.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <p className="mb-4">
          <span className="font-semibold">Using greedy on a non-canonical system.</span> The
          classic {` {1, 3, 4}`}-coin-for-6 example trips up students every year. If you write
          a greedy, include the brute-force canonicality check as a unit test — not a comment.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Swapping loop order in count-of-ways.</span>
          Permutations vs combinations is a silent correctness bug: the code runs, returns a
          number, and that number is wrong by a large factor. Add a test like coins = {` {1, 2}`},
          amount = 3 — expected 2 ({`{1,1,1}`} and {`{1,2}`}), but swapped loops give 3.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Off-by-one on dp[0].</span> dp[0] = 0 for min-coins
          but ways[0] = 1 for count-of-ways (the empty multiset). Mixing them up inverts both
          answers.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Forgetting to check a − c ≥ 0.</span> dp[a − c] is
          only defined for a ≥ c. Skipping that guard either indexes a negative array or
          (worse) reads dp[−1] = dp[A] in a wrap-around language.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Treating coin supply as implicitly bounded.</span> If
          the problem says you have 3 quarters and 5 dimes, unbounded DP over-counts. You need
          bounded knapsack with binary lifting or an explicit coin-per-item expansion.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Ignoring 0 coins.</span> A problem statement that
          allows a 0-value coin gives infinitely many ways — assert coins &gt; 0 up front.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Assuming canonicality transfers across currencies.</span>
          US {` {1, 5, 10, 25}`} is canonical. UK historical {` {1, 3, 6, 12, 24, 30}`} is not.
          Euro {` {1, 2, 5, 10, 20, 50, 100, 200}`} is canonical. Always check the actual
          system you target.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <p className="mb-4">
          <span className="font-semibold">ATM cash dispensers.</span> Given a withdrawal amount
          and the denominations currently loaded in the cassettes, compute a dispensing plan.
          Most banks use canonical denominations so greedy is fine, but the cassette-level
          availability constraint pushes the problem toward bounded knapsack.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Billing, invoicing, and rounding.</span> Splitting a
          bill into pre-printed voucher denominations, or rounding a computed total to the
          nearest combination of available cash notes, maps directly to coin change.
          Tax-withholding software, payroll pay-slip issuance, and gift-card denomination
          choice all use variants of this DP.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Postal-rate computation.</span> Historically a
          large-scale application: compute the smallest stamp combination to cover a parcel
          rate. Related: the Frobenius number (largest amount not expressible as a non-negative
          integer combination of given coprime coins) arises in coin-exchange theory and has
          real applications in packaging and resource allocation.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Game economies.</span> RPGs that let players cash out
          accumulated gold/gems into fixed-denomination items run coin-change DP to find either
          the min number of items that equals the balance, or the largest balance that can be
          redeemed exactly (anything above is kept as change).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Dynamic menus and meal combos.</span> Fast-food chains
          that price combos to exactly match tax-inclusive target amounts use coin-change
          variants at menu-design time to verify achievable totals.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Frequency allocation.</span> In bandwidth packing,
          coin change variants allocate discrete slot sizes to exactly meet a request — a 1D
          bin packing with fixed bin sizes.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Shipping crate packing (1D).</span> 1D bin-packing
          with fixed box sizes — for a given load, find the min number of crates. Not strictly
          coin change (objective is different) but the DP structure is identical.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Numeric composition and combinatorics.</span> Number
          of ways to write n as a sum of specific parts underlies partition problems and many
          OEIS integer sequences. Coin change is the computational workhorse for such enumeration.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/coin-change-diagram-3.svg"
          alt="Coin change variants complexity table plus real-world applications and pitfalls"
          caption="The coin-change family and its dangers: variant DP states, complexities, applications, and the most common implementation pitfalls."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 322 — Coin Change.</span> Min coins to make
          amount. Expected answer: unbounded knapsack DP, O(A · n), return −1 if dp[A] still
          sentinel. The #1 interview coin-change problem.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 518 — Coin Change II.</span> Number of
          combinations summing to amount. Expected answer: ways[] DP with the outer-coins loop.
          Tests whether you understand combinations vs permutations.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 377 — Combination Sum IV.</span>
          Misnamed — actually asks for ordered permutations. Expected answer: outer-amounts,
          inner-coins. Tests the same loop-order distinction from the opposite direction.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 279 — Perfect Squares.</span> Min squares
          summing to n. Expected answer: coin change with coins being 1², 2², …, ⌊√n⌋². Tests
          recognizing the reduction to coin change.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 983 — Minimum Cost For Tickets.</span>
          Variant with bounded coins and calendar constraints. Expected answer: DP over days
          with ticket types as coins.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 2585 — Ways to Earn Points.</span> Bounded
          unbounded knapsack hybrid — each question type has a supply cap. Expected answer:
          bounded knapsack DP with inner amounts loop over c, 2c, 3c up to the cap.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Follow-ups interviewers favor:</span> when does greedy
          suffice? (canonical systems only; give the counter-example). How do you reconstruct
          one optimal coin set? (parent array). What if amounts are 10¹²? (BFS with early exit,
          or generating functions). What if coins can be used at most k times? (bounded
          knapsack with binary lifting).
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <p className="mb-4">
          CLRS chapter 15 (Dynamic Programming) introduces the pattern. Kleinberg &amp; Tardos
          cover unbounded knapsack with matching pseudo-code. Martello &amp; Toth, <em>Knapsack
          Problems</em> (1990) is the canonical reference for all variants including bounded
          and unbounded.
        </p>
        <p className="mb-4">
          Pearson, &ldquo;A polynomial-time algorithm for the change-making problem&rdquo;
          (2005) — the canonicality test. Graham, Knuth &amp; Patashnik, <em>Concrete
          Mathematics</em> chapter 7, covers generating functions for coin change.
        </p>
        <p className="mb-4">
          Competitive-programming handbooks (CP-Algorithms, Codeforces editorials for Div 2 D
          problems) repeatedly cover the Dijkstra reformulation for sparse huge-A variants and
          the binary-lifting trick for bounded knapsack. LeetCode problems 322, 518, 377, and
          279 form the standard progression for interview practice.
        </p>
      </section>
    </ArticleLayout>
  );
}
