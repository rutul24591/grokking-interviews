"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "backtracking",
  title: "Backtracking Pattern",
  description:
    "Choose, explore, un-choose — DFS with disciplined state management. Enumerate subsets, permutations, and combinations; solve N-queens and sudoku; prune aggressively.",
  category: "other",
  subcategory: "patterns",
  slug: "backtracking",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-27",
  tags: ["backtracking", "leetcode", "patterns", "dfs"],
  relatedTopics: ["recursion", "dynamic-programming", "graph"],
};

export default function BacktrackingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
      <p className="mb-4">
        Backtracking is depth-first search over a state space with the discipline of choose,
        explore, un-choose. At each level the algorithm tries every valid choice, recursively
        explores the resulting state, and on return undoes the choice so the next sibling
        branch starts from the same baseline. Combined with pruning — abandoning branches that
        cannot lead to a valid solution — backtracking turns naively exponential search spaces
        into tractable computations for problem sizes up to roughly n = 20.
      </p>
      <p className="mb-4">
        Recognition signals: enumerate all subsets / permutations / combinations; place items
        subject to constraints (N-queens, sudoku); split a string into valid parts (palindrome
        partition); generate all valid configurations of some structure (parentheses,
        expressions). Whenever the answer is &quot;a list of all X that satisfy Y&quot; or
        &quot;a single X that satisfies Y when one exists&quot;, backtracking is the canonical
        engine.
      </p>
      <p className="mb-4">
        The pattern matters because it formalises the intuitive &quot;try every option, undo
        on dead end&quot; thinking. The interview test is whether you can write the skeleton
        cleanly, identify the right pruning rules, and avoid duplicate work. At staff level,
        backtracking generalises to constraint solvers (SAT, CSP), AI search (game tree
        exploration), and combinatorial optimisation (TSP exact solvers).
      </p>
      <p className="mb-4">
        The structural insight is that backtracking is recursion with mutable state: the state
        is the current partial solution; the recursive call extends it; the undo restores the
        invariant for siblings. Without the undo, the algorithm corrupts state across
        branches; with it, each branch sees the same starting point.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
      <p className="mb-4">
        <strong>State.</strong> The current partial solution being built. For subsets, a list
        of selected elements; for N-queens, a list of column placements per row; for sudoku, a
        partially filled grid. The state evolves as the recursion descends.
      </p>
      <p className="mb-4">
        <strong>Choose.</strong> Apply a valid choice to the state — append an element, place
        a queen, write a digit. The choice mutates the shared state.
      </p>
      <p className="mb-4">
        <strong>Explore.</strong> Recurse with the updated state. The recursion handles
        everything below this point; the current frame waits.
      </p>
      <p className="mb-4">
        <strong>Un-choose.</strong> Revert the mutation. After this line, the state is
        identical to what it was before choose. Without un-choose, the next sibling iteration
        sees a corrupted state and produces wrong answers.
      </p>
      <p className="mb-4">
        <strong>Termination.</strong> Two flavours. (1) Reached a complete solution: emit it
        (snapshot the mutable buffer; do not store the buffer itself, which will be mutated
        further). (2) Dead end: return without emitting; the caller&apos;s un-choose restores
        state.
      </p>
      <p className="mb-4">
        <strong>Pruning.</strong> Skip branches that cannot lead to a valid solution.
        Constraint pruning (the placement violates a rule), bound pruning (the best
        achievable from here is worse than the known best), symmetry pruning (this branch is
        equivalent to one already explored). A good prune is the difference between 10^10
        explored states and 10^4.
      </p>
      <p className="mb-4">
        <strong>Duplicate handling.</strong> When the input has duplicate values, sorting and
        skipping same-value-at-same-depth removes duplicate solutions. The rule: at depth d,
        if nums[i] equals nums[i - 1] and i - 1 was not chosen at depth d, skip i. The
        condition prevents duplicate but allows the chain.
      </p>
      <p className="mb-4">
        <strong>Branching factor and depth.</strong> The recursion tree has branching factor b
        and depth d; the size is O(b^d). For subsets, b = 2 and d = n, giving 2^n. For
        permutations, b varies from n down to 1, giving n!. Pruning reduces b effectively.
      </p>
      <p className="mb-4">
        <strong>Mutable vs. immutable state.</strong> Mutable: shared list, push and pop.
        O(1) per step but requires careful undo. Immutable: pass a new list each recursive
        call. O(depth) per step but easier to reason about. Mutable with snapshot-on-emit is
        the standard performance choice.
      </p>
      <ArticleImage src="/diagrams/other/leetcode/patterns/backtracking-diagram-1.svg" alt="Backtracking choose-explore-unchoose" />

      <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
      <p className="mb-4">
        The subsets template (Leetcode 78): function backtrack(idx, current): emit
        current.copy() (every node is a valid solution); for i from idx to n - 1:
        current.add(nums[i]); backtrack(i + 1, current); current.removeLast(). Time O(n *
        2^n) — 2^n nodes, each emit costs O(n).
      </p>
      <p className="mb-4">
        The permutations template using a used-set (Leetcode 46): function backtrack(current):
        if current.size == n: emit current.copy(); return; for i from 0 to n - 1: if
        used[i] continue; used[i] = true; current.add(nums[i]); backtrack(current); used[i] =
        false; current.removeLast(). The used-set tracks which elements are already placed.
      </p>
      <p className="mb-4">
        The combination-sum template (Leetcode 39): function backtrack(idx, current, target):
        if target == 0: emit current.copy(); return; for i from idx to n - 1: if
        candidates[i] &gt; target continue; current.add(candidates[i]); backtrack(i, current,
        target - candidates[i]); current.removeLast(). The idx parameter prevents permutation
        duplicates; passing i (not i + 1) allows reuse.
      </p>
      <p className="mb-4">
        The N-queens template (Leetcode 51): function backtrack(row): if row == n: emit board;
        return; for col from 0 to n - 1: if col in cols or (row + col) in diag1 or (row - col)
        in diag2 continue; place queen at (row, col); add to all three sets; backtrack(row +
        1); remove from all three sets. The three sets enable O(1) constraint checking.
      </p>
      <p className="mb-4">
        The grid-search template (Leetcode 79 word search): for each cell as starting point,
        backtrack(r, c, idx): if idx == word.length: return true; if (r, c) out of bounds or
        board[r][c] != word[idx]: return false; mark visited (in-place to char # or via a
        visited array); for each of four neighbours: if backtrack returns true: return true;
        unmark; return false. The neighbour iteration is the &quot;choose&quot;; the
        in-place mark is the side effect.
      </p>
      <p className="mb-4">
        The palindrome partitioning template (Leetcode 131): function backtrack(idx,
        current): if idx == n: emit current.copy(); return; for end from idx to n - 1: if
        is_palindrome(s, idx, end): current.add(s.substring(idx, end + 1));
        backtrack(end + 1, current); current.removeLast(). The split point end determines the
        next prefix.
      </p>
      <p className="mb-4">
        The generate-parentheses template (Leetcode 22): function backtrack(open, close,
        current): if open == n and close == n: emit; return; if open &lt; n:
        current.append(&apos;(&apos;); backtrack(open + 1, close, current); current.removeLast();
        if close &lt; open: current.append(&apos;)&apos;); backtrack(open, close + 1, current);
        current.removeLast(). Constraints (open ≤ n, close ≤ open) embedded in the choice.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
      <p className="mb-4">
        <strong>Backtracking vs. iterative bitmask enumeration.</strong> For small n,
        iterating masks 0 to 2^n - 1 produces all subsets without recursion. Backtracking
        wins when pruning eliminates most branches; bitmask wins when no pruning is possible
        and the structure is simple.
      </p>
      <p className="mb-4">
        <strong>Backtracking vs. DP.</strong> DP shines when subproblems repeat. Backtracking
        shines when the answer is a list of solutions, not a single optimum. Sometimes both
        apply: top-down DP with memoisation is recursion that prunes by remembering computed
        subproblems.
      </p>
      <p className="mb-4">
        <strong>Pruning vs. brute force.</strong> Naive backtracking explores the full tree.
        Pruning collapses branches early. The asymptotic complexity may stay exponential but
        the constants drop dramatically. For sudoku, pruning is essential — without it, the
        algorithm does not terminate in human time.
      </p>
      <p className="mb-4">
        <strong>Recursive backtracking vs. iterative DFS.</strong> The two are equivalent. The
        recursive version is shorter; the iterative version handles deeper search spaces
        without stack overflow.
      </p>
      <p className="mb-4">
        <strong>Mutable vs. immutable state.</strong> Mutable saves memory and time but
        requires the un-choose discipline. Immutable is foolproof but pays O(depth) per call
        for the copy.
      </p>
      <p className="mb-4">
        <strong>Backtracking vs. branch-and-bound.</strong> Branch-and-bound is backtracking
        with a global best tracked across branches and aggressive bound pruning. For
        optimisation problems (find best, not list all), branch-and-bound wins.
      </p>
      <ArticleImage src="/diagrams/other/leetcode/patterns/backtracking-diagram-2.svg" alt="Pruning and state management" />

      <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
      <p className="mb-4">
        <strong>Always pair choose with un-choose.</strong> Even if it looks redundant in a
        specific branch, the discipline prevents bugs as the code grows.
      </p>
      <p className="mb-4">
        <strong>Snapshot the mutable buffer when emitting.</strong> Storing the live reference
        means all stored solutions point to the same array, which gets cleared by the time
        you read it.
      </p>
      <p className="mb-4">
        <strong>Sort first to handle duplicates.</strong> Skipping same-value-at-same-depth
        relies on the input being sorted.
      </p>
      <p className="mb-4">
        <strong>Place pruning early.</strong> Check the constraint at the top of the
        recursive function or before the recursive call, not after; the goal is to abandon
        the branch as soon as possible.
      </p>
      <p className="mb-4">
        <strong>Use sets for constraint tracking.</strong> Hash sets give O(1) membership;
        for fixed alphabets (sudoku digits, queen columns), a boolean array is faster.
      </p>
      <p className="mb-4">
        <strong>For grid problems, mark visited in place.</strong> Save the original
        character; overwrite with a sentinel (e.g., &apos;#&apos;); restore on un-choose.
        Avoids a separate visited matrix.
      </p>
      <p className="mb-4">
        <strong>Limit n.</strong> Backtracking is exponential in the worst case. n = 20 is the
        usual ceiling. If n is larger, look for DP, greedy, or a closed form.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
      <p className="mb-4">
        <strong>Forgetting to un-choose.</strong> The state corrupts; sibling branches see
        elements from previous branches. The most common bug.
      </p>
      <p className="mb-4">
        <strong>Storing live references in the result.</strong> All emitted solutions point
        to the same mutating list. Snapshot at emit time.
      </p>
      <p className="mb-4">
        <strong>Wrong duplicate-skip condition.</strong> Skipping when nums[i] == nums[i - 1]
        unconditionally removes valid solutions. The correct rule requires that i - 1 is not
        currently chosen at the same depth.
      </p>
      <p className="mb-4">
        <strong>Recurse with wrong index.</strong> backtrack(i + 1, ...) for combinations,
        backtrack(i, ...) only when reuse is allowed (combination sum). Mixing the two
        produces wrong answers.
      </p>
      <p className="mb-4">
        <strong>Pruning too aggressively.</strong> A bound prune that drops valid branches
        loses solutions. Verify the prune is sound before relying on it.
      </p>
      <p className="mb-4">
        <strong>Pruning too late.</strong> Checking the constraint after the recursive call
        wastes the entire subtree of work. Check before recursing.
      </p>
      <p className="mb-4">
        <strong>Stack overflow on deep states.</strong> N-queens with n = 100 or sudoku with
        deep failure-recovery can exceed default recursion limits. Iterative DFS or raised
        limits.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases (Canonical Leetcode)</h2>
      <p className="mb-4">
        <strong>78. Subsets / 90. Subsets II.</strong> The canonical enumeration. II adds
        duplicate-skip.
      </p>
      <p className="mb-4">
        <strong>46. Permutations / 47. Permutations II.</strong> Used-set or swap. II adds
        duplicate-skip.
      </p>
      <p className="mb-4">
        <strong>39. Combination Sum / 40. Combination Sum II.</strong> Reuse vs. no reuse, idx
        and i + 1 distinction.
      </p>
      <p className="mb-4">
        <strong>22. Generate Parentheses.</strong> Constraints embedded in choice (open ≤ n,
        close ≤ open).
      </p>
      <p className="mb-4">
        <strong>17. Letter Combinations of a Phone Number.</strong> Depth equals digit count;
        choices are letters mapped from each digit.
      </p>
      <p className="mb-4">
        <strong>51 / 52. N-Queens.</strong> Constraint sets for columns and two diagonals;
        pruning is essential.
      </p>
      <p className="mb-4">
        <strong>37. Sudoku Solver.</strong> Try 1..9 at each empty cell; prune by row, col,
        box.
      </p>
      <p className="mb-4">
        <strong>79. Word Search.</strong> Grid DFS with in-place visited mark.
      </p>
      <p className="mb-4">
        <strong>131. Palindrome Partitioning.</strong> Split index, palindrome check at each
        prefix.
      </p>
      <p className="mb-4">
        <strong>93. Restore IP Addresses.</strong> Place three dots; constraint each segment
        is 0–255 with no leading zeros.
      </p>
      <p className="mb-4">
        <strong>140. Word Break II.</strong> Backtracking + memoisation. Without memoisation,
        TLE on adversarial inputs.
      </p>
      <p className="mb-4">
        <strong>980. Unique Paths III.</strong> Grid DFS visiting every empty cell exactly
        once; backtrack on visited mark.
      </p>
      <ArticleImage src="/diagrams/other/leetcode/patterns/backtracking-diagram-3.svg" alt="Canonical backtracking Leetcode problems" />

      <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li><strong>What is the choose-explore-un-choose skeleton?</strong> Apply a choice,
        recurse, undo. The undo is what makes backtracking different from blind DFS.</li>
        <li><strong>Why snapshot the mutable list before emitting?</strong> Otherwise all stored
        solutions reference the same buffer, which gets mutated by subsequent recursion.</li>
        <li><strong>How do you avoid duplicate solutions when input has duplicates?</strong> Sort
        the input. At each depth, skip nums[i] if nums[i] == nums[i - 1] and i - 1 is not
        currently chosen.</li>
        <li><strong>How does pruning change the complexity?</strong> Pruning can drop the
        effective branching factor dramatically; the asymptotic exponent stays but the
        constant collapses. Sudoku without pruning is infeasible; with pruning, milliseconds.</li>
        <li><strong>When does backtracking become DP?</strong> When subproblems repeat, memoise
        the recursion. The result is top-down DP — same recursion shape, polynomial time
        instead of exponential.</li>
        <li><strong>How do you implement N-queens in O(n!) instead of O(n^n)?</strong> Track the
        used columns and diagonals in three sets. At each row, only try columns not in the
        sets. The branching factor is the number of conflict-free columns, not n.</li>
        <li><strong>How do you avoid stack overflow in deep backtracking?</strong> Convert to
        iterative DFS with an explicit stack of state snapshots, or raise the language&apos;s
        recursion limit.</li>
        <li><strong>Mutable vs. immutable state — which is correct?</strong> Both. Mutable saves
        memory; immutable is easier to debug. Most interview implementations use mutable for
        performance with snapshot-on-emit.</li>
        <li><strong>How do you generalise backtracking to optimisation?</strong> Branch-and-bound:
        track a global best; prune any branch whose best-possible result is worse.</li>
        <li><strong>What is the upper bound of backtracking?</strong> Exponential or factorial in
        n. n = 20 is roughly the ceiling. Beyond that, the state space is too large; switch
        to DP, greedy, or specialised solvers.</li>
      </ol>
<h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Knuth, <em>The Art of Computer Programming, Volume 4B: Combinatorial Algorithms,
        Part 2</em>, contains exhaustive treatment of backtracking and dancing-links.
        Cormen et al. cover backtracking under exhaustive search.</li>
        <li>Russell and Norvig, <em>Artificial Intelligence: A Modern Approach</em>, chapters on
        constraint satisfaction problems, generalise backtracking with arc consistency and
        forward checking.</li>
        <li>Leetcode tag &quot;backtracking&quot; lists every canonical problem. Grokking the
        Coding Interview&apos;s &quot;Subsets&quot; pattern. NeetCode 150 covers 78, 90, 46,
        39, 40, 79, 131, 17, 51.</li>
      </ul>
    </ArticleLayout>
  );
}
