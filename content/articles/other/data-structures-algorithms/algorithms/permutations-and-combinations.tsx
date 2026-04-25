"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "permutations-and-combinations",
  title: "Permutations & Combinations",
  description:
    "Permutations, combinations, and subsets via backtracking — three skeletons (subsets, permute, combine), bitmask iteration, lexicographic next_permutation, Heap's Algorithm, and duplicate handling.",
  category: "other",
  subcategory: "algorithms",
  slug: "permutations-and-combinations",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-20",
  tags: ["permutations", "combinations", "subsets", "backtracking"],
  relatedTopics: ["backtracking-fundamentals", "n-queens", "sudoku-solver", "word-search"],
};

export default function PermutationsAndCombinationsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p className="mb-4">
          <span className="font-semibold">Permutations and combinations</span> are the
          two core combinatorial enumeration primitives. A permutation is an ordering of
          items; a combination is an unordered selection. Subsets generalize combinations
          to all sizes. Each maps to a backtracking skeleton — three patterns that, once
          memorized, cover ~30% of LeetCode hards and a large share of real combinatorial
          enumeration code.
        </p>
        <p className="mb-4">
          The counts are the canonical numbers of combinatorics: P(n, k) = n!/(n−k)! for
          k-permutations, C(n, k) = n!/(k!(n−k)!) for k-combinations, 2ⁿ for all subsets.
          Permutation counts grow factorially — n=15 is already 1.3 trillion — making
          enumeration feasible only for small n unless heavy pruning applies.
        </p>
        <p className="mb-4">
          Interview frequency is enormous because these skeletons compose with every
          domain: subsets for power-set, permutations for ordered arrangements,
          combinations for unordered selections, with extensions for duplicates,
          replacement, and constraint pruning. Mastering the three skeletons converts a
          large class of interview questions to template fills.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/permutations-and-combinations-diagram-1.svg"
          alt="Three backtracking skeletons"
          caption="Subsets, permutations, and combinations — three distinct backtracking skeletons with key implementation differences."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <p className="mb-4">
          <span className="font-semibold">Subsets via include/exclude.</span> At each
          index i, two branches: include a[i] or exclude. At i = n, emit the path. 2ⁿ
          leaves, total work O(n · 2ⁿ).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Subsets via bitmask iteration.</span> Iterate
          mask from 0 to 2ⁿ − 1; for each mask, the subset is {"{ a[i] : bit i set }"}.
          Trivially parallelizable, no recursion, but requires n ≤ 64.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Permutations via swap-and-recurse.</span> Walk
          index <code>start</code> from 0 to n. For each i ≥ start, swap a[start] and
          a[i] (placing a[i] at the front), recurse on start + 1, then swap back.
          Generates n! orderings; each is the prefix-continuation of a previous swap.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Permutations via "used" array.</span>{" "}
          Alternative: maintain a boolean used[n]; recurse picking each unused element.
          More memory but easier to add constraints. Equivalent in count and complexity.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Lexicographic next_permutation.</span> Given a
          current permutation, compute the next one in lex order: find the largest i with
          a[i] &lt; a[i+1]; find the largest j &gt; i with a[j] &gt; a[i]; swap a[i] and
          a[j]; reverse the suffix after i. Amortized O(1) per call. C++ STL's{" "}
          <code>std::next_permutation</code> implements exactly this.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Heap's Algorithm.</span> Generates all n!
          permutations via a single swap per output (adjacent or non-adjacent depending
          on parity). Useful when permutation generation cost itself dominates.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Combinations via index-only recursion.</span>{" "}
          Walk index from start to n. Push a[i], recurse on i + 1, pop. The "i + 1" (not
          start + 1) prevents reusing the same element. Stop when path length reaches k.
          Prune: if remaining elements (n − i) &lt; needed (k − path.size), break.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Duplicates.</span> When the input has repeated
          elements, naive enumeration emits duplicate outputs. Sort first; within a loop,
          skip a[i] equal to a[i−1] when a[i−1] was the previous "skipped" candidate. Two
          subtle variants — for subsets and combinations, skip the second branch; for
          permutations with duplicates, skip when the previous occurrence is unused at
          this level.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Combinations with replacement.</span> Same as
          combinations but recurse on i (not i + 1) — same element can be chosen again.
          Output count is C(n + k − 1, k), the multiset coefficient.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/permutations-and-combinations-diagram-2.svg"
          alt="Counting identities and counts"
          caption="Closed-form counts and what's tractable to enumerate at various n."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p className="mb-4">
          <span className="font-semibold">Recursive vs iterative.</span> Recursion mirrors
          the conceptual structure cleanly. Iterative generators (next_permutation,
          bitmask subsets) save stack frames and integrate with C++/Java iterators that
          consume permutations one at a time without materializing all of them.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Lazy generation.</span> For large n, you rarely
          want all outputs in memory. Use generators (Python <code>yield</code>, Java
          Iterator, C++ ranges) to produce one output at a time. Critical for streams or
          interactive use.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Memory layout.</span> A single mutable path
          shared across all recursive calls is most cache-friendly; copy on emission.
          Functional/persistent variants pay 2–10× memory for cleaner semantics.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Pruning.</span> Combinations prune when
          remaining elements can't fill k slots. Permutations with constraints (e.g.,
          "a must come before b") can skip entire subtrees. Subsets with sum/size
          constraints prune when target unreachable.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Rank ↔ permutation conversion.</span> Each
          permutation has a unique lex-rank in [0, n!). The Lehmer / factorial-base
          encoding maps rank to permutation in O(n²) (or O(n log n) with a Fenwick tree).
          Useful for parallel enumeration: hand each worker a contiguous rank range.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Random sampling.</span> For uniform random
          permutation, Fisher–Yates shuffle in O(n). For uniform random k-subset,
          reservoir sampling in O(n) over a stream, or O(k) Floyd's algorithm when n is
          known.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <p className="mb-4">
          <span className="font-semibold">Recursive vs bitmask iteration.</span> For
          subsets up to n=20, bitmask wins on speed and simplicity. Beyond n=20, neither
          approach generates output you can practically consume.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Swap-based vs used-array permutation.</span>{" "}
          Swap-based is more memory-efficient (in-place) but mutates input ordering.
          Used-array is cleaner for adding per-element constraints but allocates a boolean
          array.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Heap's Algorithm vs std::next_permutation.</span>{" "}
          Heap is faster (one swap per output) but doesn't produce lex order. STL is
          slower per call but lex-ordered, which is often what you want.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Generation vs sampling.</span> Generating all is
          O(output-size); sampling one uniformly is O(n). If you don't need exhaustive
          enumeration, sample.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Generation vs counting.</span> Counting is
          O(n) (multiplication of factors); generating is exponential in count. If only the
          count is needed, never enumerate.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <p className="mb-4">
          <span className="font-semibold">Sort input first when handling duplicates.</span>{" "}
          The "skip equal previous" trick requires equal elements be adjacent.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Use generators / iterators when output is
          large.</span> Don't materialize a list of 10⁶ permutations; yield them.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Prefer std::next_permutation for lex
          ordering.</span> Battle-tested, O(1) amortized, idiomatic C++.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Choose the right skeleton.</span> Subsets:
          include/exclude. Permutations: swap-or-used. Combinations: index-only with
          start. Mixing them creates subtle bugs.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Compute count first as a sanity check.</span> If
          you produce 23 subsets where 2³ = 8 expected, your enumeration is broken.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Bound n ≤ 20–30 for permutations.</span> n! at
          15 is 1.3 trillion. Enumerate only with heavy pruning beyond n=12.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <p className="mb-4">
          <span className="font-semibold">Recursing on start + 1 instead of i + 1 in
          combinations.</span> Reuses the same element across choices. Use{" "}
          <code>combine(i + 1, ...)</code>.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Forgetting to copy path on emit.</span> Storing
          a reference to the mutable path makes all emitted "results" identical to the
          final state. Copy on push.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Wrong duplicate skipping.</span> For permutations
          with duplicates, skipping when used[i−1] is true (rather than false) gives the
          opposite of correct.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Confusing combinations with replacement vs
          without.</span> The recursive call's argument (i vs i+1) decides; double-check.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Brute-forcing when DP suffices.</span>{" "}
          Subset-sum, partition-equal-sum, knapsack don't need enumeration — DP solves
          them in polynomial time.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Off-by-one in path size check.</span>{" "}
          Combinations of size k stop at <code>path.size == k</code>, not k − 1 or k + 1.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Generating duplicates and deduping later.</span>{" "}
          Sets eat memory and CPU. Skip duplicates inside the recursion.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <p className="mb-4">
          <span className="font-semibold">A/B test cohort design.</span> When n
          experimental conditions need balanced assignment to k cohorts, enumerate
          k-permutations or partitions to find balanced ones. Small n (≤ 8 or so) makes
          brute enumeration feasible; larger uses MILP or randomization.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Feature selection in ML.</span> Forward/backward
          selection considers C(n, k) feature subsets at each step. Pure enumeration is
          feasible only for small n; usually combined with greedy or genetic search.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Combinatorial test design.</span> Pairwise
          (2-way) coverage requires picking a small number of tests covering all parameter
          pairs. Hand-rolled enumeration plus pruning is common; tools like Microsoft PICT
          automate this.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Permutation tests in statistics.</span>{" "}
          Hypothesis testing by repeatedly relabeling samples and recomputing the test
          statistic. For large n, sample random permutations rather than enumerating.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Fisher–Yates shuffle.</span> Used in randomized
          algorithms (random pivot quickselect, randomized testing), shuffling cards in
          gameplay, and randomizing experiment ordering.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Cryptographic enumeration.</span> CTF challenges
          and password-cracking pipelines enumerate permutations of character classes.
          Beyond n = 10 the enumeration is impossible; rule-based pruning is mandatory.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/permutations-and-combinations-diagram-3.svg"
          alt="Use cases and generation tricks"
          caption="Production use of enumeration plus the standard generation tricks (lex order, Heap, Gray code, factorial-base ranking)."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <p className="mb-4">
          <span className="font-semibold">"Generate all subsets of [1,2,3]."</span>{" "}
          Include/exclude recursion or bitmask iteration. 8 subsets.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"Subsets II — input may have duplicates."</span>{" "}
          Sort first; in the include branch loop, skip a[i] equal to previous when
          previous wasn't taken at this depth.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"Permutations of [1,2,3]."</span> Swap-based
          recursion or used-array. 6 outputs.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"Permutations II — duplicates."</span> Sort;
          for each candidate at this position, skip if equal to previous and previous is
          unused.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"Next permutation in lex order."</span> Find
          decreasing suffix start, swap with next-larger, reverse suffix. O(n).
        </p>
        <p className="mb-4">
          <span className="font-semibold">"Combinations C(n, k)."</span> Index-only
          recursion with pruning when remaining elements &lt; needed.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"Letter combinations of a phone number."</span>{" "}
          Cartesian product over per-digit letter sets — equivalent to permutations of
          mixed-radix base.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <p className="mb-4">
          Knuth's <em>TAOCP Vol 4A</em> Section 7.2 (Generating All Tuples and
          Permutations) is the definitive reference. Sedgewick's "Permutation Generation
          Methods" survey (1977). C++ STL <code>std::next_permutation</code>{" "}
          implementation. Wilf's <em>Generatingfunctionology</em> for the counting side.
          OEIS A000142 (factorials), A000110 (Bell numbers), A000108 (Catalan). For
          random sampling: Fisher–Yates, Floyd's algorithm, reservoir sampling — covered
          in any randomized algorithms text.
        </p>
      </section>
    </ArticleLayout>
  );
}
