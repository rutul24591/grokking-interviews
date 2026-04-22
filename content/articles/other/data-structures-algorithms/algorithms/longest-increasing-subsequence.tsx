"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "longest-increasing-subsequence",
  title: "Longest Increasing Subsequence (LIS)",
  description:
    "LIS — from O(n²) DP to O(n log n) patience-sort. Patience piles, tail arrays, binary search, and the Erdős-Szekeres connection.",
  category: "other",
  subcategory: "algorithms",
  slug: "longest-increasing-subsequence",
  wordCount: 4700,
  readingTime: 23,
  lastUpdated: "2026-04-20",
  tags: ["lis", "dynamic-programming", "patience-sort", "binary-search"],
  relatedTopics: ["longest-common-subsequence", "dp-fundamentals", "binary-search", "segment-tree"],
};

export default function LisArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p className="mb-4">
          The Longest Increasing Subsequence (LIS) of an array is the longest subsequence whose
          elements appear in strictly (or non-strictly) increasing order. For [10, 9, 2, 5, 3, 7,
          101, 18], one LIS is [2, 3, 7, 101] of length 4. The problem admits a straightforward
          O(n²) DP and a more elegant O(n log n) algorithm based on patience sort.
        </p>
        <p className="mb-4">
          LIS is deeply connected to the <span className="font-semibold">Erdős-Szekeres
          theorem</span> (any sequence of n² + 1 distinct reals contains a monotone subsequence
          of length n + 1), to the <span className="font-semibold">RSK correspondence</span>
          (bijection between permutations and pairs of Young tableaux), and to patience sort.
          These connections make LIS a popular pedagogical entry point into combinatorial
          algorithmics.
        </p>
        <p className="mb-4">
          Practical applications include box-stacking (sort by one dimension, LIS by another),
          bioinformatic chain alignment, stock-trading strategy validation (detecting increasing
          subsequences of closing prices), and any problem that reduces to &ldquo;longest chain
          under a partial order&rdquo;. The Dilworth theorem connection — LIS length equals
          minimum antichain cover — makes LIS a primitive for many scheduling algorithms.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <p className="mb-4">
          <span className="font-semibold">O(n²) DP:</span> dp[i] = length of the longest
          increasing subsequence ending at index i. Transition: dp[i] = 1 + max(dp[j]) over all j
          &lt; i with a[j] &lt; a[i], or 1 if no such j. Answer: max(dp). Simple but quadratic.
        </p>
        <p className="mb-4">
          <span className="font-semibold">O(n log n) via patience sort:</span> maintain tails[k]
          = smallest possible tail value of any increasing subsequence of length k+1 seen so far.
          For each incoming a[i], binary-search for the position where it replaces an element
          (lower_bound(a[i])). If beyond end, append. Length of final tails = LIS length. The
          tails array is always sorted, enabling binary search.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Why patience sort works:</span> imagine dealing cards
          into piles, placing each new card on the leftmost pile whose top exceeds it, or starting
          a new pile. The number of piles equals the LIS length. Each pile is a strictly
          decreasing sequence; the set of pile tops is sorted. Binary-searching for the correct
          pile is exactly the tails-array operation.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Recovering the LIS:</span> when replacing tails[k] with
          a[i], also record the predecessor — the element before a[i] in its subsequence. After
          processing, walk back from the last updated element. Requires O(n) parent pointers on
          top of the tails array.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/longest-increasing-subsequence-diagram-1.svg"
          alt="Patience sort trace for LIS"
          caption="Patience sort on [10,9,2,5,3,7,101,18]: each card goes on leftmost pile whose top ≥ card. Pile count = LIS length = 4."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p className="mb-4">
          The O(n log n) algorithm&rsquo;s inner loop: for each a[i], use lower_bound to find the
          first tails[k] ≥ a[i] (for strictly increasing LIS) or upper_bound for non-strictly
          increasing (allows duplicates). If found, set tails[k] = a[i]; else append. The
          invariant &ldquo;tails is sorted&rdquo; holds because we only ever replace an element
          with a smaller one at the same position, or append a larger one.
        </p>
        <p className="mb-4">
          Note that tails is <span className="font-semibold">not the actual LIS</span> — it
          merely tracks length. tails[k] is the smallest tail of any length-(k+1) increasing
          subsequence, which may not form an increasing sequence itself. Confusing these produces
          correct LIS length with nonsensical recovered subsequences.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/longest-increasing-subsequence-diagram-2.svg"
          alt="LIS O(n²) vs O(n log n) comparison"
          caption="O(n²) DP is simpler but slower. O(n log n) patience sort replaces the inner max-search with binary search on tails."
        />
        <p className="mb-4">
          <span className="font-semibold">Variants</span>: Longest <em>non-decreasing</em>
          subsequence — use upper_bound instead of lower_bound. Longest <em>decreasing</em> —
          negate values or reverse comparator. Longest common increasing subsequence (LCIS) —
          combines LCS and LIS logic in O(nm). Count of LIS — count distinct subsequences of
          maximal length with an extra counter.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <p className="mb-4">
          <span className="font-semibold">O(n²) vs O(n log n):</span> O(n²) is easier to write
          and debug; for n &lt; 1000 the constant factor often wins. O(n log n) is mandatory for
          n &gt; 10⁵. Write the O(n²) version in interviews as a stepping stone before the
          O(n log n) version — builds understanding and tests correctness.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LIS vs LCS:</span> LIS on an array a is LCS(a,
          sorted(a)) — sorting the second argument reduces LIS to LCS in O(n² log n). Not
          practical, but conceptually illuminating: LIS is a constrained LCS.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LIS vs Segment Tree DP:</span> for LIS with weights
          (maximize sum of increasing subsequence, not count), a segment tree keyed by value
          gives O(n log V) where V is the value range. Generalizes to &ldquo;maximum chain sum&rdquo;
          variants.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Dilworth&rsquo;s theorem connection:</span> LIS length
          equals the minimum number of non-increasing subsequences needed to cover the array.
          Patience sort constructively demonstrates this equivalence: piles are non-increasing
          subsequences; their count equals LIS length. Used in minimum-antichain-cover problems.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <p className="mb-4">
          Default to O(n log n) for any production or competitive use. The O(n²) version is
          acceptable for teaching or when the input is guaranteed small. The difference is
          dramatic: for n = 10⁵, O(n²) runs in ~10 s while O(n log n) finishes in ~10 ms.
        </p>
        <p className="mb-4">
          Get the bound type right: strictly increasing uses lower_bound; non-strictly
          increasing (allow equal) uses upper_bound. Test with duplicate values to catch the
          bug — both versions work on strictly distinct inputs.
        </p>
        <p className="mb-4">
          For subsequence recovery, remember that the tails array is not the LIS itself. Maintain
          parent pointers per element to reconstruct the sequence after the main loop.
        </p>
        <p className="mb-4">
          If you need &ldquo;number of distinct LIS&rdquo;, combine O(n²) DP with counting: cnt[i]
          = sum of cnt[j] over j with dp[j] = dp[i] − 1 and a[j] &lt; a[i]. O(n²) — there is no
          standard O(n log n) variant for counting.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <p className="mb-4">
          <span className="font-semibold">Assuming tails is the LIS:</span> common bug — after
          processing, the tails array looks increasing and has the correct length, so new
          implementers assume it&rsquo;s the answer. It is not; the actual LIS requires parent
          tracking.
        </p>
        <p className="mb-4">
          <span className="font-semibold">lower_bound vs upper_bound confusion:</span> strict vs
          non-strict LIS differ by one character in the code. Passes some tests, fails when
          duplicates matter. Always clarify the problem&rsquo;s strictness requirement.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Reusing patience-sort intuition for general LCS:</span>
          patience sort works because one of the two sequences (sorted(a)) has known structure.
          For general LCS between two arbitrary sequences, patience sort doesn&rsquo;t apply —
          you need the O(mn) DP.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Not breaking ties when counting LIS:</span> counting
          logic needs dp[j] = dp[i] − 1 AND a[j] &lt; a[i]. Forgetting either condition
          overcounts or undercounts.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <p className="mb-4">
          <span className="font-semibold">Box stacking / Russian doll nesting:</span> sort boxes
          by first dimension, LIS on the second dimension gives the maximum nesting. Leetcode
          354 (Russian Doll Envelopes) is the canonical example.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Bioinformatics chain alignment:</span> after fast
          k-mer seeding, LIS on seed positions gives the optimal chain of consistent matches.
          Used in minimap2 for long-read alignment.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Patience sort itself:</span> though rarely used as a
          sorting algorithm, its card-game origins give LIS a physical intuition. Mallows (1960s)
          analyzed it formally.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Young tableau / RSK correspondence:</span> LIS length
          = length of first row of the Young tableau produced by RSK. Core combinatorial object
          in representation theory of symmetric groups.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Interview screener:</span> LIS is among the 20 most
          common algorithm interview problems at FAANG, specifically because its O(n²) →
          O(n log n) step tests comfort with binary search and non-obvious DP reformulations.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/longest-increasing-subsequence-diagram-3.svg"
          alt="LIS applications showing box stacking, chain alignment, and Young tableau"
          caption="LIS applications: box stacking reduces to LIS on second dimension; chain alignment uses LIS on seed positions; Young tableau row lengths count LIS-like monotone subsequences."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <p className="mb-4">
          <span className="font-semibold">Implement LIS in O(n log n).</span> Patience sort with
          tails array and binary search. Expect to explain why binary search works (tails is
          always sorted) and what each tails[k] represents (smallest length-(k+1) tail).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Return the actual LIS sequence.</span> Add parent
          pointers during patience sort; traceback from the last element placed into the
          highest-indexed pile.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Count LIS.</span> O(n²) DP with a count array; for each
          i, cnt[i] sums cnt[j] over j with dp[j] = dp[i] − 1 and a[j] &lt; a[i]. Answer sums
          cnt[i] over i with dp[i] = LIS length.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Russian doll envelopes.</span> Sort by width ascending,
          height descending (to avoid same-width matches), then LIS on height. The descending
          secondary order handles ties elegantly.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Aldous &amp; Diaconis, &ldquo;Longest increasing subsequences: from patience sorting to the Baik-Deift-Johansson theorem&rdquo; (1999).</li>
          <li>Fredman, &ldquo;On computing the length of longest increasing subsequences&rdquo; (1975).</li>
          <li>Erdős &amp; Szekeres, &ldquo;A combinatorial problem in geometry&rdquo; (1935) — the pigeonhole origin.</li>
          <li>Knuth, TAOCP Vol 3 §5.1.4 — young tableaux and patience sort.</li>
          <li>CP-Algorithms, &ldquo;LIS&rdquo; — https://cp-algorithms.com/sequences/longest_increasing_subsequence.html</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
