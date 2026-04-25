"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "sudoku-solver",
  title: "Sudoku Solver",
  description:
    "Sudoku solver — backtracking with row/column/box bitmasks, MRV branching, naked/hidden singles, Dancing Links exact-cover, and Norvig-style propagation.",
  category: "other",
  subcategory: "algorithms",
  slug: "sudoku-solver",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-20",
  tags: ["sudoku", "backtracking", "constraint-satisfaction", "exact-cover"],
  relatedTopics: ["backtracking-fundamentals", "n-queens", "permutations-and-combinations"],
};

export default function SudokuSolverArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p className="mb-4">
          A <span className="font-semibold">Sudoku solver</span> fills a 9×9 grid such that
          each row, each column, and each of the nine 3×3 boxes contains the digits 1–9
          exactly once, given a partially filled puzzle. Sudoku is a constraint
          satisfaction problem and the canonical companion to N-Queens for teaching
          backtracking with rich constraint propagation.
        </p>
        <p className="mb-4">
          Sudoku as we know it dates to 1979 (Howard Garns); the global craze followed
          Wayne Gould's import to the Times of London in 2004. Computational interest
          grew alongside: Knuth's Dancing Links exact-cover formulation, Peter Norvig's
          50-line Python "constraint propagation + search" essay, and the 2014 proof by
          McGuire et al. that 17 is the minimum number of clues for a uniquely solvable
          puzzle (using ~7 billion CPU-hours).
        </p>
        <p className="mb-4">
          Interview interest is high because Sudoku exercises every backtracking concept
          — state, propagation, MRV, undo, exact-cover modeling — within a tightly bounded
          problem. Variants (Killer, Samurai, 16×16) extend the framework and probe
          generalization skill.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/sudoku-solver-diagram-1.svg"
          alt="Sudoku constraints and bitmask state"
          caption="Three constraint sets (row, column, 3×3 box) and the bitmask representation that gives O(1) candidate computation per cell."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <p className="mb-4">
          <span className="font-semibold">Three constraint sets.</span> Row, column, and
          3×3 box. A cell at (r, c) belongs to row r, column c, and box 3·(r/3) + c/3.
          The candidate digits at that cell are the digits not yet placed in any of the
          three sets it belongs to.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Bitmask state.</span> Three arrays of 9 bitmasks
          each: rowMask[r], colMask[c], boxMask[b]. Each mask is a 9-bit set of digits
          already placed. Candidates(r, c) = ~(rowMask[r] | colMask[c] | boxMask[b]) &amp;
          0x1FF. Computing candidates is constant time. Place: set the bit. Unplace: clear
          the bit. Iterate set bits via <code>x &amp; −x</code>.
        </p>
        <p className="mb-4">
          <span className="font-semibold">MRV branching.</span> Among empty cells, branch
          on the one with the fewest candidate digits. Failing fast — if a cell has 0
          candidates, the partial state is dead — yields exponentially smaller search trees
          than left-to-right ordering.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Naked singles.</span> A cell with exactly one
          candidate must take that value — no branching needed, deduce-and-place. Iterate
          this until no more singles exist before resorting to search. Most "easy" Sudokus
          are fully solved by naked singles alone.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Hidden singles.</span> Within a unit (row /
          column / box), if a digit appears as candidate in only one cell, it must go
          there. Combined with naked singles, hidden singles solve "medium" puzzles
          without any guess.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Higher-order propagators.</span> Naked pairs /
          triples, hidden pairs, pointing pairs, X-Wing, Swordfish, XY-Wing, coloring,
          forcing chains. Each rules out a subset of candidates without branching.
          Production solvers apply them in increasing complexity until quiescence, then
          guess only when necessary.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Dancing Links / Algorithm X.</span> Knuth's
          formulation views Sudoku as an exact-cover problem: 729 candidate placements
          (9 rows × 9 cols × 9 digits), 324 constraints (4 categories × 81). Dancing
          Links (DLX) implements backtracking with O(1) constraint cover/uncover via
          doubly-linked-list "splicing." Solves any Sudoku in microseconds.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Uniqueness.</span> A well-posed Sudoku has
          exactly one solution. To verify, run the solver to completion and continue
          searching for a second solution after finding the first. Generators rely on
          this verification.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/sudoku-solver-diagram-2.svg"
          alt="Constraint propagation rules"
          caption="Naked/hidden singles, pairs, pointing pairs, X-Wing — propagation collapses 9^81 to mere thousands of nodes."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p className="mb-4">
          <span className="font-semibold">Naive recursive solver.</span> Scan for first
          empty cell; for each digit 1–9, if legal, place and recurse. On success return
          true; on failure unplace and try next digit. Easy to write; solves easy puzzles
          fast, but evil-grade puzzles can take minutes.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Bitmask + MRV.</span> Maintain three bitmask
          arrays. Pick empty cell with fewest candidates. Iterate set bits of candidates,
          place, recurse, undo. With MRV alone, hardest published Sudokus solve in
          milliseconds.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Norvig's solver.</span> 50 lines of Python.
          Represents each cell as a string of remaining candidates. On each placement,
          eliminates the digit from all peers; if a peer is reduced to one candidate,
          recursively eliminate. If a unit has only one cell with a particular digit, place
          it. Search via DFS over cells with fewest remaining values. Solves all 50 Project
          Euler problem 96 puzzles in under a second.
        </p>
        <p className="mb-4">
          <span className="font-semibold">DLX.</span> Build the 729 × 324 incidence matrix
          as toroidal doubly-linked lists. Choose column with smallest count (S-heuristic);
          for each row in that column, cover the row's columns, recurse, uncover on return.
          The cover/uncover are O(degree); the data structure was designed for exactly
          this pattern and outpaces conventional implementations on hard puzzles.
        </p>
        <p className="mb-4">
          <span className="font-semibold">tdoku &amp; SIMD bitboards.</span> Modern
          performance leaders represent each unit as a 16-bit lane in AVX-512 registers
          and propagate constraints via bitwise SIMD. tdoku solves an average puzzle in
          ~0.5 µs.
        </p>
        <p className="mb-4">
          <span className="font-semibold">SAT/SMT encoding.</span> 729 boolean variables
          (one per cell-digit pair); ~10k clauses. Pass to MiniSAT/Z3. Slower per puzzle
          than DLX but trivially extends to Killer Sudoku, irregular regions, and arbitrary
          additional constraints.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <p className="mb-4">
          <span className="font-semibold">Pure DFS vs propagation + DFS.</span> Pure DFS
          without propagation can take seconds on hard puzzles. Adding naked + hidden
          singles before each branch decision typically reduces the work 100×.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Bitmask vs candidate-list.</span> Bitmask is
          faster (constant-time intersection) but caps at boards where the alphabet fits
          in a machine word. For 9×9 standard Sudoku, 9-bit masks fit in any int.
        </p>
        <p className="mb-4">
          <span className="font-semibold">DLX vs hand-rolled.</span> DLX has constant
          cover/uncover; hand-rolled bitmask has constant per-cell candidate computation.
          On 9×9 Sudoku, modern bitboard solvers outperform DLX; on larger n×n or
          arbitrary-region variants, DLX wins by being structure-agnostic.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Backtracking vs SAT.</span> SAT solvers
          generalize trivially to variants (cage sums, diagonals, irregular boxes); Sudoku-
          specific solvers are faster for the canonical problem but require new code per
          variant.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Solver vs human heuristics.</span> Human-style
          solvers apply named techniques (X-Wing, swordfish) and rate puzzle difficulty by
          which technique was needed. Algorithmic solvers ignore difficulty and brute-force
          to optimality. For hint generation, you want the human-style solver to identify
          the next simplest deduction.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <p className="mb-4">
          <span className="font-semibold">Always propagate before branching.</span> Run
          naked + hidden singles to a fixpoint, then pick MRV. The pre-search work
          collapses easy puzzles entirely.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Verify uniqueness in generators.</span> A
          generator that doesn't continue searching after first success can produce
          puzzles with multiple solutions — invalid by definition.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Use immutable copies for branch state, not
          undo.</span> Sudoku's state is small (81 cells); copying on each branch is
          cheap and removes a class of undo bugs. For performance, switch to undo only
          after profiling.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Test against known hard puzzles.</span> Arto
          Inkala's "world's hardest" 2010 puzzle, the 17-clue minimum collection, and
          Project Euler #96 are standard benchmarks. A correct solver finishes all in
          under a second.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Cache the box index.</span> Computing 3·(r/3) +
          c/3 inside hot loops costs cycles. Precompute boxOf[r][c] once.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Profile node-visit count.</span> Just like
          N-Queens, the metric for solver quality is nodes visited per puzzle, not wall
          time. A 100× reduction in nodes ≈ 100× wall-time speedup.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <p className="mb-4">
          <span className="font-semibold">Forgetting one of the three constraint
          sets.</span> Solvers that check rows and columns but forget the box accept
          invalid placements. Test against any standard puzzle — wrong solutions surface
          immediately.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Propagation that doesn't terminate.</span>{" "}
          Cascading singles can re-trigger propagation; ensure a worklist or fixpoint loop
          rather than recursive propagation that stack-overflows.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Branching on the first empty cell instead of
          MRV.</span> First-empty-cell heuristic is dramatically slower on hard puzzles.
          MRV is one extra line and 100× faster.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Mutating the board across branches.</span> If
          state isn't fully restored on undo (e.g., propagated eliminations), siblings see
          a corrupted state. Persistent copies or trail-based undo prevent this.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Returning the first solution found without
          checking uniqueness.</span> For generation, you must continue past the first
          solution; a "Sudoku" with two solutions is invalid.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Using string parsing on hot path.</span> Reading
          the puzzle as <code>"5 3 . . 7 . . . ."</code> with split each call is slow.
          Convert once to an int array.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Assuming any 17-clue puzzle is unique.</span> 17
          is the minimum that <em>can</em> uniquely determine — most 17-cell partial fills
          have many solutions or none. Generators must verify.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <p className="mb-4">
          <span className="font-semibold">Newspaper / app puzzle pipelines.</span> NYT,
          Times of London, Sudoku.com generate millions of puzzles. Each is solved (for
          uniqueness verification) and rated (by which propagator was needed). Solver speed
          directly impacts daily generation throughput.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Hint engines.</span> When a user is stuck, an
          app suggests the simplest applicable deduction. Requires a human-style solver
          that identifies which named technique applies — pure DFS doesn't help.
        </p>
        <p className="mb-4">
          <span className="font-semibold">CSP teaching benchmark.</span> Like N-Queens but
          richer: real propagators (not just one-step), variant explosion (Killer, Samurai,
          Hyper-Sudoku), and clear rating systems. Used in AI courses to motivate forward-
          checking, AC-3, and conflict-directed backjumping.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Mathematical research.</span> The 2014 minimum-
          clues proof (Gary McGuire et al.) used a custom Sudoku-aware solver running
          across thousands of cores to verify no 16-clue puzzle has a unique solution.
          Total: ~7 billion CPU-hours.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Latin-square applications.</span> A solved Sudoku
          is a Latin square with extra structure. Latin squares appear in experimental
          design (agriculture, drug trials), code construction, and combinatorial
          tournaments.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Accessibility &amp; OCR.</span> Mobile apps
          photograph a printed Sudoku, OCR the digits, run the solver, and overlay
          hints. The solver must handle OCR errors gracefully (try-and-detect-conflict
          rather than crash).
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/sudoku-solver-diagram-3.svg"
          alt="Sudoku solvers and variants"
          caption="Solver landscape (Norvig, DLX, tdoku, SAT) and variants (Killer, Samurai, 16×16, irregular regions)."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <p className="mb-4">
          <span className="font-semibold">"Solve Sudoku in place."</span> Backtracking
          with three bitmasks. Find empty cell, try each candidate, recurse, undo on
          failure. Return true on first solution.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"Validate a partially filled Sudoku."</span>{" "}
          Check that no row, column, or box has duplicate non-zero digits — three sets,
          single pass over 81 cells.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"Why use bitmasks?"</span> Constant-time set
          operations (intersection, union, contains). Iterating candidates via{" "}
          <code>x &amp; −x</code> is faster than scanning 1–9.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"What's the minimum number of clues?"</span> 17.
          Proven by exhaustive search (McGuire et al. 2014).
        </p>
        <p className="mb-4">
          <span className="font-semibold">"How do you ensure uniqueness?"</span> After
          finding one solution, continue searching for a second; if found, the puzzle is
          not uniquely solvable.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"How would you extend the solver to Killer
          Sudoku?"</span> Add cage constraints: each cage's digits sum to a target and
          must be distinct. Either add cage propagation rules, or encode as SAT/CSP and
          let a generic solver handle it.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <p className="mb-4">
          Knuth's "Dancing Links" paper (2000) — the canonical exact-cover algorithm.
          Peter Norvig's essay "Solving Every Sudoku Puzzle" (2006) — the readable
          reference for propagation + search. Gary McGuire et al., "There is no 16-clue
          Sudoku" (Experimental Mathematics, 2014). Tom Dillon's tdoku
          (t-dillon.github.io) for current speed leadership. Yato &amp; Seta (2003) on
          Sudoku NP-completeness for n × n boards. <em>The Hidden Logic of Sudoku</em> by
          Denis Berthier for human-style solving theory.
        </p>
      </section>
    </ArticleLayout>
  );
}
