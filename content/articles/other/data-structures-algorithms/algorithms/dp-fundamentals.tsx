"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "dp-fundamentals",
  title: "Dynamic Programming Fundamentals",
  description:
    "DP Fundamentals — optimal substructure, overlapping subproblems, memoization vs tabulation, state design, and the principled path from recursion to O(n²) wins.",
  category: "other",
  subcategory: "algorithms",
  slug: "dp-fundamentals",
  wordCount: 5200,
  readingTime: 26,
  lastUpdated: "2026-04-20",
  tags: ["dynamic-programming", "memoization", "tabulation", "optimization"],
  relatedTopics: ["knapsack-01", "longest-common-subsequence", "edit-distance", "coin-change"],
};

export default function DpFundamentalsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p className="mb-4">
          Dynamic Programming (DP) is a technique for solving problems by combining solutions to
          overlapping subproblems, storing each subproblem&rsquo;s result so it is computed only
          once. Richard Bellman coined the term in 1953 while working on multi-stage decision
          processes at RAND — the word &ldquo;programming&rdquo; meant planning, not computer
          programming, and &ldquo;dynamic&rdquo; was chosen partly to make the funding harder for
          critics to cut. Despite the obscure name, DP is one of the most unifying techniques in
          algorithms, converting many exponential recursions into polynomial-time algorithms.
        </p>
        <p className="mb-4">
          DP applies when two conditions hold: <span className="font-semibold">optimal
          substructure</span> (the optimal solution to a problem contains optimal solutions to its
          subproblems) and <span className="font-semibold">overlapping subproblems</span> (the
          same subproblems are solved many times by naive recursion). Without optimal
          substructure, subproblem solutions cannot be combined. Without overlap, memoization
          offers no speedup — pure divide-and-conquer suffices.
        </p>
        <p className="mb-4">
          At staff level, the real skill is not memorizing classical DPs (knapsack, LCS, edit
          distance) but recognizing the pattern in novel problems and designing state concisely.
          A badly chosen state turns a tractable problem into an exponential blowup; a cleverly
          chosen state reduces the answer from O(2ⁿ) to O(n²) or better. Most interview DP
          failures are failures of state design, not algorithmic complexity.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <p className="mb-4">
          <span className="font-semibold">Optimal substructure</span> means: if you know the
          optimal solution to subproblems of size &lt; n, you can combine them to solve size n.
          Shortest paths have it (Bellman&rsquo;s principle: a shortest path s→t through v
          decomposes into shortest s→v + shortest v→t). Longest simple path in a graph does
          <em> not</em> — two shortest simple subpaths can share vertices and combine into a
          walk, not a path.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Overlapping subproblems</span> means: the recursion
          tree contains the same subproblem in many branches. Fibonacci is the canonical
          illustration: fib(5) calls fib(4) and fib(3); fib(4) also calls fib(3); each fib(k) is
          recomputed exponentially many times. Memoization caches each fib(k) once, cutting the
          work from O(φⁿ) to O(n).
        </p>
        <p className="mb-4">
          <span className="font-semibold">State</span> is the vector of parameters that uniquely
          identifies a subproblem. For fib it&rsquo;s (n). For knapsack it&rsquo;s (i, remaining
          capacity). For LCS it&rsquo;s (i, j) — prefix lengths of the two strings. State design
          is the hardest part of DP: the state must capture enough information to compute the
          answer without redundancy. Too little state → wrong answer. Too much → exponential
          blowup.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Transition</span> is the recurrence that computes a
          state&rsquo;s value from smaller states. For 0/1 knapsack: dp[i][w] = max(dp[i-1][w],
          dp[i-1][w - wᵢ] + vᵢ). Transitions encode the decision at each step (take item i or
          skip), and the DP&rsquo;s correctness rests on the decision being locally optimal given
          subproblem solutions.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/dp-fundamentals-diagram-1.svg"
          alt="Fibonacci recursion tree showing overlapping subproblems eliminated by memoization"
          caption="Naive fib(5) computes fib(3) twice, fib(2) three times. Memoization reduces 15 calls to 6 — each fib(k) computed once."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p className="mb-4">
          Two implementation styles solve the same DP. <span className="font-semibold">Top-
          down</span> (memoized recursion) writes the natural recurrence and caches results in a
          hash map or array indexed by state. Pros: follows the problem statement, computes only
          needed states, handles sparse state spaces naturally. Cons: function-call overhead,
          stack depth limits, harder to analyze cache behavior.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Bottom-up</span> (tabulation) iterates states in
          topological order and fills an array. Pros: faster constant factors, no stack overhead,
          easy to analyze and optimize memory (roll-over 2D → 1D when only previous row matters).
          Cons: must identify the right iteration order; computes all reachable states even if
          the target doesn&rsquo;t need them; harder to code for irregular state spaces.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Space optimization</span>: when a DP transition only
          depends on the previous row (or a constant number of previous rows), you can reduce 2D
          tables to 1D. Knapsack: dp[w] = max(dp[w], dp[w - wᵢ] + vᵢ), iterating w from high to
          low to preserve dp[w - wᵢ]&rsquo;s previous value. Edit distance: keep two rows, swap
          each iteration.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/dp-fundamentals-diagram-2.svg"
          alt="Top-down memoization vs bottom-up tabulation for same DP"
          caption="Same recurrence, two implementations. Top-down: lazy, natural. Bottom-up: eager, cache-friendly, space-optimizable. Both O(n²) time; bottom-up wins constants."
        />
        <p className="mb-4">
          The <span className="font-semibold">DP framework</span> for a new problem: (1) identify
          state — what parameters fully describe a subproblem? (2) write the recurrence — how does
          state x decompose into smaller states? (3) identify base cases — what are the smallest
          subproblems? (4) choose evaluation order — top-down or bottom-up? (5) optimize space if
          applicable. Running this checklist on every DP problem beats ad-hoc coding.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <p className="mb-4">
          <span className="font-semibold">DP vs Greedy:</span> greedy makes the locally-best
          choice at each step; DP considers all choices and remembers the best. Greedy works only
          when local choices lead to global optima (matroid structure). When greedy fails, DP is
          typically the first fallback.
        </p>
        <p className="mb-4">
          <span className="font-semibold">DP vs Divide &amp; Conquer:</span> both decompose
          problems, but D&amp;C splits into disjoint subproblems (merge sort, FFT), while DP
          solves overlapping ones. If subproblems don&rsquo;t overlap, memoization wastes memory
          without saving time.
        </p>
        <p className="mb-4">
          <span className="font-semibold">DP vs Brute Force:</span> brute force explores all
          solutions in O(2ⁿ) or worse. DP prunes by reusing overlapping subproblem solutions. The
          speedup is exponential when overlap is high (n² vs 2ⁿ) but zero when subproblems are
          unique (D&amp;C territory).
        </p>
        <p className="mb-4">
          <span className="font-semibold">DP vs Graph Algorithms:</span> many DPs can be reframed
          as shortest-path problems on a DAG of states. Conversely, shortest-path algorithms
          (Bellman-Ford especially) are DPs on graph structure. The boundary is fuzzy — DP on
          DAGs and graph DP are the same thing from different angles.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <p className="mb-4">
          Start by writing the recursive solution with clear parameters. Add memoization as a
          thin wrapper — this isolates correctness (recursive logic) from performance (caching).
          Only convert to tabulation after verifying the recurrence, and only if profiling shows
          memoization overhead matters.
        </p>
        <p className="mb-4">
          Pick state parameters that are <span className="font-semibold">minimal and
          comparable</span>. Minimal avoids exponential blowup; comparable means you can index
          into a fixed array. If state includes a set, use a bitmask (up to ~20 elements). If
          state is a continuous value, discretize to a grid or use memoization with a dict.
        </p>
        <p className="mb-4">
          Analyze complexity as <span className="font-semibold">number of states × work per
          transition</span>. Knapsack: O(n × W) states × O(1) per state = O(nW). LCS: O(mn)
          states × O(1) = O(mn). This formula catches bugs — if your claimed complexity
          doesn&rsquo;t match states × work, you&rsquo;ve miscounted one of them.
        </p>
        <p className="mb-4">
          Space-optimize last, not first. A 2D table costs memory but is easier to debug. Once the
          logic is correct, roll to 1D if the transition allows. Premature space optimization
          hides bugs — a miscalculation in which previous cells are needed will silently corrupt
          results.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <p className="mb-4">
          <span className="font-semibold">Missing state parameter:</span> if the answer depends
          on something you didn&rsquo;t include in state (e.g., forgetting &ldquo;number of
          transactions remaining&rdquo; in stock problems), the recurrence is wrong. Symptom:
          correct on small examples, wrong at scale.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Wrong iteration order:</span> bottom-up requires
          topological order over the state DAG. 0/1 knapsack iterates capacity from high to low
          when rolling to 1D; unbounded knapsack iterates low to high. Reversing the order turns
          0/1 into unbounded silently.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Hash-map memoization on tight loops:</span> Python
          @lru_cache or dict-based memoization is 10–100× slower than array indexing. For
          performance-critical DPs, allocate a fixed-size table.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Confusing subsequence with subarray/substring:</span>
          LCS is a subsequence problem (non-contiguous); longest common substring is contiguous.
          They have different recurrences. Confusing them is a common interview pitfall.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Assuming DP applies:</span> not every recursive
          problem is a DP. If subproblems don&rsquo;t overlap, memoization adds overhead without
          savings. If optimal substructure fails, DP produces wrong answers.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <p className="mb-4">
          <span className="font-semibold">Bioinformatics alignment:</span> BLAST, Smith-Waterman,
          Needleman-Wunsch — sequence alignment algorithms are edit-distance DPs. Every modern
          genome aligner has DP at its core, often hardware-accelerated (CUDA, FPGA).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Operations research:</span> inventory management,
          resource allocation, project scheduling. Bellman&rsquo;s original application was
          multi-stage decision processes — still how manufacturers plan production over time.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Speech &amp; NLP:</span> Viterbi algorithm (HMM
          decoding), CKY parsing (probabilistic context-free grammars), beam search with DP
          scoring. Pre-deep-learning speech recognition was essentially giant DP tables over
          phoneme lattices.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Reinforcement learning:</span> Bellman equations for
          value iteration and policy iteration are DPs over state-action spaces. Modern RL
          (Q-learning, actor-critic) is stochastic approximation of these same DPs.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Compilers:</span> register allocation, instruction
          scheduling, and optimal code generation use DP on expression trees (Aho-Johnson
          algorithm, 1976). Modern compilers (LLVM, GCC) still rely on DP-based pass designs.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/dp-fundamentals-diagram-3.svg"
          alt="DP framework checklist for new problems"
          caption="The 5-step DP framework: state, transition, base cases, evaluation order, space optimization. Run it before coding."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <p className="mb-4">
          <span className="font-semibold">What makes a problem DP?</span> Optimal substructure +
          overlapping subproblems. Expect to articulate both and give examples where one holds
          without the other.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Memoization vs Tabulation — when to choose which?</span>
          Memoization for prototyping, sparse state spaces, or when the recurrence is easier to
          express recursively. Tabulation for performance-critical code, dense state spaces, and
          space-rolling optimizations.
        </p>
        <p className="mb-4">
          <span className="font-semibold">How do you decide state?</span> Walk through the
          recursion: what arguments does the recursive call take? Those are candidate states.
          Prune parameters that are derivable from others. Add parameters if the answer depends
          on information not captured.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Prove optimal substructure.</span> Show that combining
          optimal subproblem solutions yields an optimal whole. The proof is typically by
          contradiction: if a better whole existed, a better subproblem solution must exist —
          contradicting subproblem optimality.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Richard Bellman, <em>Dynamic Programming</em> (1957) — the original treatise.</li>
          <li>CLRS, ch. 15 — rigorous treatment with matrix chain, LCS, and optimal BST.</li>
          <li>Kleinberg &amp; Tardos, <em>Algorithm Design</em>, ch. 6 — excellent pedagogical DP chapter.</li>
          <li>Erickson, <em>Algorithms</em> (2019) — free online, ch. 2–3 on recursion and DP.</li>
          <li>CP-Algorithms, &ldquo;Dynamic Programming&rdquo; — https://cp-algorithms.com/dynamic_programming/</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
