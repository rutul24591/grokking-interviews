"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "n-queens",
  title: "N-Queens",
  description:
    "N-Queens — the canonical backtracking benchmark. Place n queens on n×n board with no two attacking via row-by-row DFS, bitmask state, and symmetry pruning.",
  category: "other",
  subcategory: "algorithms",
  slug: "n-queens",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-20",
  tags: ["n-queens", "backtracking", "constraint-satisfaction", "bitmask"],
  relatedTopics: ["backtracking-fundamentals", "sudoku-solver", "permutations-and-combinations"],
};

export default function NQueensArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p className="mb-4">
          The <span className="font-semibold">N-Queens problem</span> asks how to place n
          non-attacking queens on an n×n chessboard. Two queens attack if they share a row,
          column, or diagonal. Variants ask for any one solution (a placement problem),
          for the count of all solutions, or for completion of a partially filled board
          (which is NP-complete).
        </p>
        <p className="mb-4">
          Originally posed by Max Bezzel in 1848 as the eight-queens puzzle, the problem
          became a touchstone for both combinatorial mathematics and computer science.
          Gauss studied solution counts in 1850. The first computer program for it was
          Lehmer's in 1960. Today it's the canonical benchmark for backtracking,
          constraint-satisfaction solvers, and parallel search.
        </p>
        <p className="mb-4">
          Why N-Queens dominates interview repertoire and CS curricula: it has a clean
          state representation, a small set of constraints (column + two diagonals), and
          dramatic search-tree pruning. It illustrates every backtracking concept — state,
          constraint propagation, undo, symmetry breaking, bitmask optimization, and
          parallelization — without distracting domain detail.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/n-queens-diagram-1.svg"
          alt="N-queens 8x8 solution and constraints"
          caption="An 8-queens solution with the three sets of constraints (columns, / and \\ diagonals) and solution counts up to n=27."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <p className="mb-4">
          <span className="font-semibold">Row-by-row decomposition.</span> Since each row
          must contain exactly one queen (any solution has n queens in n rows), assign
          rows in order, choosing the column for each row. This collapses the state-space
          tree from C(n², n) cells × choices into n branches per level, a tree of depth n
          — a massive improvement before any pruning.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Three conflict sets.</span> A queen at (r, c)
          attacks: column c, the / diagonal where r − c is constant, and the \ diagonal
          where r + c is constant. Maintain three boolean (or bit) sets indexed by c, r −
          c (offset to non-negative), and r + c. Constant-time check whether (r, c) is
          legal.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Bitmask representation.</span> For n ≤ 32, use
          three integers — cols, diag1 (/), diag2 (\) — with bits indicating occupied
          columns/diagonals. The legal columns at the current row are{" "}
          <code>~(cols | diag1 | diag2) &amp; ((1 &lt;&lt; n) − 1)</code>. Pick set bits
          one at a time using the <code>x &amp; −x</code> idiom. Recurse with{" "}
          <code>cols | bit</code>, <code>(diag1 | bit) &lt;&lt; 1</code>,{" "}
          <code>(diag2 | bit) &gt;&gt; 1</code> — encoding the propagation of diagonal
          attacks one row down.
        </p>
        <p className="mb-4">
          <span className="font-semibold">No explicit undo with bitmask.</span> Because
          the masks are passed by value, each recursive call sees its own snapshot. The
          undo is implicit in the call/return mechanism. With mutable state, add explicit
          undo of the three sets after each recursion.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Symmetry breaking.</span> The 8 symmetries of
          the square (4 rotations × 2 reflections) partition solutions into equivalence
          classes of size 8 (or 4 for self-symmetric solutions). Solve only canonical
          representatives — typically restrict the row-0 queen to the first ⌈n/2⌉ columns
          — and multiply by 8 (correcting for symmetric ones). Cuts work by ~8× without
          changing total time complexity.
        </p>
        <p className="mb-4">
          <span className="font-semibold">No closed-form count.</span> The number of
          n-queens solutions has no known closed form. Asymptotic estimates exist (Simkin,
          2021: roughly (0.143·n)^n) but exact counts are computed by exhaustive search.
          n=27 was completed in 2016; n=28 remains unsolved.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Constructive solutions.</span> If you only need{" "}
          <em>one</em> solution, no search is required: explicit O(n) constructions exist
          for every n ≥ 4. Place queens at columns 2, 4, 6, ..., n, 1, 3, 5, ..., n−1 with
          adjustments for n mod 6. So "find a placement" is polynomial; "count all
          placements" is what makes this a backtracking benchmark.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/n-queens-diagram-2.svg"
          alt="Bitmask N-queens algorithm"
          caption="The bitmask version: three integers shifted between rows; one queen placed via x & −x bit-extraction."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p className="mb-4">
          <span className="font-semibold">Naive boolean-array implementation.</span> Three
          arrays: cols[n], diag1[2n−1], diag2[2n−1]. At row r, iterate c from 0 to n−1;
          if all three are free at (r, c), set them true, recurse to row r+1, and reset on
          return. Easy to write, easy to debug; runs to n=14 in seconds.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Bitmask implementation.</span> Three integers,
          shifts on each call. ~10× faster because no array indexing, no branch
          mispredictions, and the inner loop is a tight bit-manipulation idiom that fits
          in registers. n=15 in 100ms, n=18 in seconds, n=20 in minutes.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Symmetry-class enumeration.</span> Solve only
          half the row-0 columns. For odd n, the central column requires special handling
          (a row-0 queen there cannot be reflected). Multiply non-self-symmetric counts by
          8 and self-symmetric by 4. Roughly 8× speedup.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Parallel/distributed.</span> Each row-0 column
          choice yields an independent subtree. Shard them across cores or machines. The
          subtrees are imbalanced (some columns admit far more completions), so use
          work-stealing rather than equal partitioning. n=27 (Preußer &amp; Engelhardt,
          TU Dresden) used FPGA acceleration plus distributed search across a cluster.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Iterative deepening / pruning by branch
          estimation.</span> Knuth's "Estimating the efficiency of backtrack programs"
          shows how to sample random root-to-leaf paths to estimate total tree size
          before running the full search — useful for capacity planning on the n=28
          attempt.
        </p>
        <p className="mb-4">
          <span className="font-semibold">SAT/CSP encoding.</span> Encode N-Queens as
          boolean variables x[r][c] with constraints; pass to MiniSAT. Modern CDCL solvers
          do not beat the dedicated bitmask code for N-Queens specifically (the encoding
          overhead is too large), but they generalize trivially to harder placement
          problems.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <p className="mb-4">
          <span className="font-semibold">Find one vs find all.</span> One solution: O(n)
          via constructive formula, no search needed. All solutions: backtracking, time
          empirically ~n^O(n).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Bitmask vs boolean array.</span> Bitmask is ~10×
          faster in tight loops and limits n to 32–64 (machine word). Boolean array works
          for arbitrary n but is slower per node visited.
        </p>
        <p className="mb-4">
          <span className="font-semibold">N-Queens vs general CSP.</span> N-Queens is a
          well-structured CSP with regular conflict patterns. General CSPs (Sudoku, graph
          coloring, scheduling) need richer constraint propagation; N-Queens' three
          constant-time conflict checks suffice.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Backtracking vs local search.</span> For
          N-Queens placement (find any solution), local search like min-conflicts heuristic
          finds solutions for n=10⁶ in milliseconds — far beyond backtracking's reach.
          Backtracking is required only for exhaustive enumeration.
        </p>
        <p className="mb-4">
          <span className="font-semibold">N-Queens completion vs N-Queens placement.</span>{" "}
          Placement (with empty board) is polynomial via construction. Completion (given
          some queens already placed) is NP-complete (Gent, Jefferson, Nightingale, 2017).
          The distinction matters: "easy" by construction, "hard" by search.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <p className="mb-4">
          <span className="font-semibold">Use bitmask for n ≤ 32.</span> Three ints, fast
          shifts, bit-iteration via <code>x &amp; −x</code>. The reference implementation
          for high-performance N-Queens.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Halve the search via symmetry.</span> Only try
          row-0 queen in columns 0 to ⌈n/2⌉ − 1; multiply non-symmetric by 8. Trivial to
          implement, near-double speedup.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Profile node-visit count, not wall time.</span>{" "}
          Comparing implementations on wall time confounds compiler optimization with
          algorithmic effectiveness. Count nodes visited in the search tree to measure
          pruning quality.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Shard at row 0, not row k.</span> For
          parallelism, split work by row-0 column. This gives n independent subtrees with
          minimal contention. Splitting deeper requires synchronization.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Test against OEIS A000170.</span> The exact
          solution counts are listed in OEIS (A000170 for total, A002562 for unique up to
          symmetry). Off-by-one in symmetry handling shows up immediately.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Avoid Python for large n.</span> Python's
          interpreter overhead per recursion dominates. Use C++, Rust, or write the inner
          loop in C extension via cython/cffi for n &gt; 14.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <p className="mb-4">
          <span className="font-semibold">Off-by-one in diagonal indexing.</span> The /
          diagonal index r − c can be negative; offset by n − 1 to make it non-negative.
          The \ diagonal r + c ranges from 0 to 2n − 2. Wrong sizing of these arrays
          causes silent corruption.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Forgetting to undo state.</span> In array-based
          implementations, marking a column / diagonal occupied without unmarking on
          return causes false conflicts and missed solutions.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Wrong shift direction in bitmask.</span> diag1
          shifts left, diag2 shifts right. Swapping them produces wrong answers that look
          plausible at small n but disagree from n=5 onward.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Counting symmetric solutions twice.</span> A
          self-symmetric solution under 180° rotation maps to itself; multiplying by 8 over-
          counts it. Self-symmetric solutions exist only for specific n (none for n=4, two
          for n=6, etc.); handle them carefully.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Iterating columns 0 to n−1 instead of using
          available bitmask.</span> The bitmask version needs only the bits set in the
          available mask. Iterating all columns negates the speedup.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Stack overflow at n &gt; 30.</span> Python and
          Java default recursion limits trip; raise the limit or convert to iterative
          stack.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Writing solutions to disk inside the inner
          loop.</span> n=15 has 2 279 184 solutions; printing each kills throughput. If
          you only need the count, increment a counter; emit boards only when needed.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <p className="mb-4">
          <span className="font-semibold">Constraint-solver benchmark.</span> Every CSP
          solver (OR-Tools, Choco, Gecode), every SAT solver, and every parallel search
          framework uses N-Queens as a baseline. It tests pruning effectiveness, branching
          heuristics, and parallelization — at one canonical input.
        </p>
        <p className="mb-4">
          <span className="font-semibold">High-performance computing demo.</span> Beowulf
          cluster tutorials, MPI workshops, GPU programming courses use N-Queens to
          demonstrate work-stealing, branch divergence, and Amdahl's law. The TU Dresden
          n=27 result on a custom FPGA pipeline (2016) is a notable HPC milestone.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Compiler-test problem.</span> N-Queens stresses
          register allocation (with deep recursion), branch prediction (irregular pruning),
          and SIMD opportunities (parallel bit operations). Used by GCC, LLVM, and JVM
          performance tracking.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Sensor placement / coverage.</span> N-Queens-
          style "place k attackers covering all cells" is the queen-domination problem,
          relevant to security camera placement and wireless-sensor coverage in 2D
          environments. Algorithms generalize the conflict-set bookkeeping.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Educational gateway to backtracking.</span>{" "}
          Almost every algorithms textbook (CLRS, Skiena, Sedgewick) introduces
          backtracking via N-Queens. It's the simplest problem where pruning has dramatic
          effect.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Frequency assignment / channel allocation.</span>{" "}
          Assigning radio frequencies to transmitters such that nearby transmitters get
          non-conflicting bands is structurally similar (graph coloring with distance
          constraints). The same row-by-row + conflict-set approach generalizes.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/n-queens-diagram-3.svg"
          alt="N-queens benchmarks and variants"
          caption="N-Queens as benchmark, distributed-computing example, and the variant landscape (rooks, toroidal, completion, dominating set)."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <p className="mb-4">
          <span className="font-semibold">"Solve N-Queens — return all distinct
          solutions."</span> Row-by-row backtracking with three sets, append a copy of the
          column array on each successful placement at row n.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"Count solutions only — N-Queens II."</span> Same
          algorithm, just increment a counter on success. With bitmasks and symmetry
          breaking, n=14 finishes in seconds.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"Why is one queen per row a valid
          assumption?"</span> Because every solution has exactly n queens on n rows; by
          pigeonhole each row has exactly one. This eliminates row from the conflict
          checks.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"What's the complexity?"</span> Worst-case is
          O(n!) (n choices in row 0, n−1 effective choices in row 1, etc., though pruning
          drastically reduces this). The exact count grows roughly as (0.143·n)^n
          (Simkin 2021).
        </p>
        <p className="mb-4">
          <span className="font-semibold">"How would you parallelize?"</span> Shard at
          row 0: each first-row column is an independent subtree. Use a work-stealing
          thread pool or distribute over MPI. Imbalanced subtrees → work-stealing wins
          over static partitioning.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"Design the bitmask transitions."</span> Place
          queen at column c (bit position c). Recurse with cols | bit, (diag1 | bit) &lt;&lt;
          1, (diag2 | bit) &gt;&gt; 1. The shifts encode that diagonal attacks move one
          column in their direction per row.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <p className="mb-4">
          Bezzel's original 1848 puzzle. Gauss's 1850 letter. Lehmer (1960) for the first
          computer solution. Knuth's <em>TAOCP</em> Pre-Fascicle 5B (Dancing Links) treats
          exact-cover formulations. Jeff Somers' bitmask code (2002) — the canonical
          high-performance serial version. Preußer &amp; Engelhardt's n=27 paper (2016)
          for the FPGA-distributed approach. Simkin's 2021 asymptotic enumeration result.
          Russell &amp; Norvig, AIMA chapter on Constraint Satisfaction. OEIS A000170 for
          exact counts.
        </p>
      </section>
    </ArticleLayout>
  );
}
