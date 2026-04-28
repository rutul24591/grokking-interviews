"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "dynamic-programming-pattern",
  title: "Dynamic Programming Pattern",
  description:
    "Trade exponential recursion for polynomial time by memoising overlapping subproblems — the most asked, most feared, and most rewarding pattern in coding interviews.",
  category: "other",
  subcategory: "patterns",
  slug: "dynamic-programming",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-26",
  tags: ["dynamic-programming", "memoisation", "tabulation", "state-machine"],
  relatedTopics: ["recursion", "divide-and-conquer", "greedy"],
};

export default function DynamicProgrammingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <h2 className="text-2xl font-bold mt-8 mb-4">Definition & Context</h2>
      <p>
        Dynamic programming is the technique of solving a problem by breaking it into
        subproblems, solving each subproblem once, and storing the answers so that overlapping
        subproblems are not recomputed. The two preconditions are <em>optimal substructure</em> —
        the optimal solution is built from optimal subproblem solutions — and <em>overlapping
        subproblems</em> — the same subproblem is encountered along multiple recursion paths.
        Together they justify the speedup from exponential brute-force recursion to polynomial
        memoised computation.
      </p>
      <p>
        DP earns its reputation in interviews because the technique itself is mechanical once
        the state and recurrence are right, but defining the state and recurrence is the entire
        puzzle. The wrong state definition leads to a wrong recurrence; the wrong recurrence
        leads to wrong answers. There is no shortcut: strong DP performance requires a mental
        library of state shapes (1D prefix, 2D pair-of-strings, interval split, bitmask subset,
        tree post-order, digit position) and the recognition skill to map a new problem to one
        of them.
      </p>
      <p>
        For staff/principal interviews, the bar is higher than &quot;solve the problem&quot;.
        Interviewers expect you to choose top-down vs. bottom-up consciously, justify the state
        space size, derive the recurrence aloud with base cases, analyse time and space, reduce
        space to a constant number of rows where possible, and reconstruct the optimal solution
        path when asked. Each of those is a separate skill; this article walks through all of
        them.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Core Concepts</h2>
      <p>
        The five-step DP recipe: define the state, write the recurrence, identify base cases,
        choose the evaluation order, extract the final answer. Define the state by writing in
        plain English what <em>dp[i]</em> or <em>dp[i][j]</em> means — &quot;the minimum number
        of coins to make amount i&quot;, &quot;the length of the longest common subsequence
        between the first i characters of s and the first j characters of t&quot;. The state
        definition is the load-bearing claim; everything else follows from it.
      </p>
      <p>
        Write the recurrence by considering the last decision: what was the last coin used,
        what was the last character of the LCS, what was the last interval split. The answer to{" "}
        <em>dp[state]</em> is determined by the answer to <em>dp[smaller-state]</em> via that
        last decision. Express the recurrence as a function of subproblem answers, taking a min
        or max or sum over the legal last-decisions.
      </p>
      <p>
        Identify base cases by reading off what the state means at its trivial extremes.{" "}
        <em>dp[0]</em> for &quot;coins to make 0&quot; is 0; <em>dp[i][0]</em> for &quot;LCS
        with empty t&quot; is 0; <em>dp[i][i]</em> for &quot;palindrome substring of length
        1&quot; is true. Get the base cases from the state definition, not by guessing.
      </p>
      <p>
        Choose evaluation order. Top-down recursion with memoisation is closest to the recurrence
        and easiest to write; bottom-up tabulation is closest to a loop and easier to optimise
        for space. Top-down has function-call overhead and stack risk; bottom-up has no
        recursion but requires you to figure out the order in which to fill the table. Both
        give the same answer at the same asymptotic cost.
      </p>
      <p>
        Extract the final answer. Sometimes it is <em>dp[n]</em> directly; sometimes it is{" "}
        <em>max(dp[i])</em> over all i (longest increasing subsequence ending anywhere);
        sometimes it is the value of a specific cell in a multi-dimensional table. Reconstructing
        the path requires either a parallel parent table or a backtrace through the dp table —
        not always asked, but expected at staff level.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Architecture & Flow</h2>
      <p>
        Top-down memoised recursion looks structurally identical to plain recursion with a
        cache. Define a recursive function on the state; check the cache before recursing;
        compute the recurrence by recursing on smaller states; store and return. This style is
        natural for problems with sparse state spaces — when only some <em>dp[state]</em>{" "}
        entries are reachable from the initial call, top-down skips the unreachable ones for
        free.
      </p>
      <p>
        Bottom-up tabulation iterates over the state space in dependency order and fills a
        table. The dependency order is the topological sort of the state graph; for a 1D state
        it is usually 0, 1, 2, ..., n; for a 2D state it is row-major or column-major; for an
        interval state it is by interval length. Tabulation has no recursion overhead and
        usually has better cache behaviour, which makes it the preferred style for tight inner
        loops in production.
      </p>
      <ArticleImage
        src="/diagrams/other/leetcode/patterns/dynamic-programming-diagram-1.svg"
        alt="DP overview"

      />
      <p>
        State shapes form a finite mental library. 1D prefix DP applies when the answer for the
        whole array depends only on the answer for prefixes — house robber, climbing stairs,
        longest increasing subsequence. 2D pair-of-strings DP applies when two sequences are
        compared cell by cell — LCS, edit distance, regex match. Interval DP applies when the
        answer for a range depends on a split point inside it — matrix chain multiplication,
        burst balloons, palindromic partitions. Bitmask DP applies when the state can be
        encoded as a subset of a small set — TSP on 20 cities, assignment problems. Tree DP
        applies when the structure is a tree and dp[node] depends on dp[children]. Digit DP
        applies when counting numbers with constraints up to a bound. Recognising the shape is
        90% of the solve.
      </p>
      <ArticleImage
        src="/diagrams/other/leetcode/patterns/dynamic-programming-diagram-2.svg"
        alt="DP state shapes"

      />
      <p>
        Space optimisation: when <em>dp[i]</em> depends only on <em>dp[i − 1]</em> and{" "}
        <em>dp[i − 2]</em>, you do not need a full array — two scalar variables suffice. When{" "}
        <em>dp[i][j]</em> depends only on the previous row, a single row plus a temporary
        suffices. These reductions take O(n) memory to O(1) or O(min(m, n)) and are common
        follow-ups in interviews.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Trade-offs & Comparisons</h2>
      <p>
        DP versus greedy. Both have optimal substructure; DP also handles overlapping
        subproblems where greedy&apos;s greedy-choice property fails. DP is more general but
        more expensive — typically polynomial vs. greedy&apos;s linear or n log n. Try greedy
        first if the structure looks like it might admit a greedy choice; fall back to DP when
        greedy fails the counterexample test.
      </p>
      <p>
        DP versus divide and conquer. Both decompose into subproblems. D&amp;C subproblems are
        independent; DP subproblems overlap. The recursion tree for D&amp;C is a tree; for DP
        it is a DAG that, without memoisation, would expand into an exponential tree of
        repeated nodes. Memoisation collapses the DAG to its true size — the number of distinct
        states.
      </p>
      <p>
        Top-down vs. bottom-up. Top-down is closer to the recurrence and easier to write under
        time pressure. Bottom-up has no recursion overhead, easier space optimisation, and
        better cache behaviour. For interviews, code whichever you find clearer; for production,
        prefer bottom-up unless the state space is sparse.
      </p>
      <p>
        DP versus brute-force recursion plus pruning. When the state space is huge but only a
        small fraction is actually reached, branch-and-bound or A* may outperform exhaustive
        DP. This trade-off shows up in TSP-like problems where bitmask DP is O(n · 2^n) but
        practical solvers use bound-based pruning to stay tractable on inputs where 2^n is
        gigantic.
      </p>
      <p>
        DP versus matrix exponentiation. For linear-recurrence problems with closed-form
        recurrences (Fibonacci, climbing stairs), matrix exponentiation gives O(log n) time
        compared to DP&apos;s O(n). It is rarely asked but worth knowing as the &quot;next
        level&quot; optimisation when n is astronomically large.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Best Practices</h2>
      <p>
        State the state in plain English first. Before writing any code, write a comment:
        &quot;dp[i] is the minimum number of coins to make amount i&quot;. If you cannot write
        that comment unambiguously, the state is wrong; iterate until it is precise.
      </p>
      <p>
        Derive the recurrence by considering the last decision. What was the last coin? What
        was the last character matched? What was the last split point? The recurrence
        decomposes <em>dp[state]</em> over the legal last-decisions, taking min/max/sum.
      </p>
      <p>
        Verify base cases before running the algorithm. Trace <em>dp[0]</em>, <em>dp[1]</em>{" "}
        manually; check they match the recurrence&apos;s degenerate case. The single most
        common DP bug is a wrong or missing base case.
      </p>
      <p>
        Choose top-down or bottom-up based on the state space density. Sparse and recursive →
        top-down. Dense and tabular → bottom-up. Both are correct; the choice is about
        readability and constant factor.
      </p>
      <p>
        Optimise space only after correctness is established. Compute time and space upfront
        with the full table; only at the end of the interview consider the space reduction. The
        reduction is a follow-up question 70% of the time, and answering it after demonstrating
        correctness is much better than tangling correctness with optimisation.
      </p>
      <p>
        Mention the alternative when relevant. If you choose DP, briefly mention whether greedy
        would work and why not (or why it would on a related problem). Showing awareness of the
        boundary between greedy and DP signals depth.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Common Pitfalls</h2>
      <p>
        Wrong state definition. The most common failure mode is defining <em>dp[i]</em> as
        &quot;something involving i&quot; without nailing down what exactly. &quot;dp[i] is the
        best up to index i&quot; is ambiguous — best ending at i, best in the prefix, best
        considering only i? Write the precise English; the bug usually surfaces immediately.
      </p>
      <p>
        Missing or wrong base cases. <em>dp[0]</em> for &quot;ways to make 0&quot; is 1, not 0,
        because the empty selection is one way. <em>dp[empty][j]</em> for LCS depends on what
        empty string vs. anything looks like. Read the state definition and apply it at the
        boundary; do not guess.
      </p>
      <p>
        Off-by-one in the recurrence. When transitioning from i to i + 1, double-check whether
        the current character is at index i or i + 1 in the input. This is especially treacherous
        in 1-indexed vs. 0-indexed DPs over strings.
      </p>
      <p>
        Treating an overlapping-subproblem case as plain recursion. The classic Fibonacci
        without memoisation is exponential. Always check whether the same state is reachable by
        multiple paths before deciding plain recursion is enough.
      </p>
      <p>
        Memoising on the wrong key. The cache key must capture the full state. If <em>dp</em>{" "}
        depends on (i, k, last_action), memoising on (i) alone gives wrong answers because two
        calls with the same i but different k or last_action collide.
      </p>
      <p>
        Premature space optimisation. Reducing 2D to 1D before the 2D version is verified
        correct produces hard-to-debug bugs. Get the 2D right, then optimise.
      </p>
      <p>
        Confusing &quot;count of ways&quot; with &quot;optimal value&quot;. Counting DPs sum
        over choices; optimisation DPs take min/max. The recurrences look similar but mixing
        them up gives wrong answers. Decide upfront which kind of DP you are writing.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Real-World Use Cases</h2>
      <p>
        Dynamic programming powers a long list of production systems. Sequence alignment in
        bioinformatics is edit distance at scale. Spell checkers use Levenshtein DP for fuzzy
        matching. The Viterbi algorithm in speech recognition is DP on a hidden Markov model.
        Compiler register allocation, query planners, and the Bellman-Ford shortest path
        algorithm are all DP. In finance, option pricing on a binomial tree is DP working
        backward from expiration.
      </p>
      <p>
        On the Leetcode side, the canonical DP cluster is huge. The 1D prefix family includes{" "}
        <em>70. Climbing Stairs</em> (Fibonacci), <em>198. House Robber</em> (take-or-skip),{" "}
        <em>213. House Robber II</em> (circular variant), <em>300. Longest Increasing
        Subsequence</em> (O(n²) DP or O(n log n) patience), <em>322. Coin Change</em> (min coins
        for amount), <em>139. Word Break</em> (segmentable prefix), and <em>91. Decode
        Ways</em>.
      </p>
      <p>
        The 2D string family includes <em>1143. Longest Common Subsequence</em>, <em>72. Edit
        Distance</em>, <em>10 / 44. Regex / Wildcard Matching</em>, and <em>97. Interleaving
        String</em>. The interval family includes <em>5. Longest Palindromic Substring</em>,{" "}
        <em>647. Palindromic Substrings</em>, <em>312. Burst Balloons</em>, and <em>1547.
        Minimum Cost to Cut a Stick</em>.
      </p>
      <ArticleImage
        src="/diagrams/other/leetcode/patterns/dynamic-programming-diagram-3.svg"
        alt="Canonical DP problems"

      />
      <p>
        State-machine DP appears in the stock-trading family: <em>121, 122, 123, 188, 309,
        714</em>. Each variant adds a constraint (k transactions, cooldown, fee) handled by
        adding a dimension to the state. Once you understand the buy-sell-with-state-machine
        framing, the entire family becomes mechanical. The grid-DP family (<em>62, 63, 64</em>)
        and tree-DP family (<em>337. House Robber III</em>, <em>968. Binary Tree Cameras</em>)
        round out the canon. Working through 30–40 problems across these clusters builds the
        recognition reflex that staff interviews reward.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Common Interview Questions</h2>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li><strong>State and prove the optimal substructure of LCS.</strong> The LCS of two strings
        ending at (i, j) is either the LCS of (i − 1, j − 1) plus 1 if the characters match, or
        the better of LCS(i − 1, j) and LCS(i, j − 1) if they do not. The optimal substructure
        is that any optimal LCS extends an optimal LCS of a shorter prefix pair.</li>
        <li><strong>Top-down vs. bottom-up — when do you pick which?</strong> Top-down for sparse
        state spaces and natural recurrences; bottom-up for dense states, easier space
        optimisation, and tighter constants.</li>
        <li><strong>Reduce 2D edit distance to O(min(m, n)) space.</strong> dp[i][j] depends on
        dp[i − 1][j], dp[i][j − 1], and dp[i − 1][j − 1] — only the previous row and current
        row are needed. Roll over two rows; total space O(n).</li>
        <li><strong>Why does LIS in O(n log n) work?</strong> Patience sorting maintains piles of
        decreasing tops; each new value goes on the leftmost pile whose top is ≥ it (or starts
        a new pile). The number of piles equals the LIS length. Binary search finds the pile in
        log time.</li>
        <li><strong>Coin change minimum vs. number of ways — what is the difference in
        recurrence?</strong> Minimum: dp[a] = min over coins c of (1 + dp[a − c]). Number of
        ways: dp[a] = sum over coins c of dp[a − c], with the loop order over coins outside
        amounts to avoid permutation double-counting.</li>
        <li><strong>How does state-machine DP solve buy-sell stock with cooldown?</strong> Three
        states per day — holding, sold (in cooldown), rest. Transitions encode the legal
        actions; dp[i][state] = max profit through day i in that state.</li>
        <li><strong>Reconstruct the optimal LCS string from the dp table.</strong> Walk from
        dp[m][n] backwards: if characters match, take and move diagonally; otherwise move in
        the direction of the larger neighbour. The path reversed is the LCS.</li>
        <li><strong>What is bitmask DP and when is it tractable?</strong> Bitmask DP encodes a
        subset of a small set as the state. Tractable when n ≤ ~20 because the state space is
        2^n. TSP on small graphs and assignment problems are canonical examples.</li>
        <li><strong>Compare interval DP for matrix chain multiplication and burst balloons.</strong>{" "}
        Both pick a split point k inside [i, j] and combine left and right subintervals. Matrix
        chain combines by summing the multiplication cost; balloons combines by summing the
        burst score with the boundary multipliers. Same scaffold, different combine.</li>
      </ol>
<h2 className="text-2xl font-bold mt-8 mb-4">References & Further Reading</h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Cormen et al., <em>Introduction to Algorithms</em>, chapter 15 is the canonical DP
        reference: rod cutting, matrix chain multiplication, LCS, optimal BSTs. Read it twice;
        the second pass after solving 20 problems makes the abstractions concrete.</li>
        <li>Kleinberg and Tardos, <em>Algorithm Design</em>, chapter 6 is the most readable DP
        chapter in the literature. The treatment of weighted interval scheduling, segmented
        least squares, and sequence alignment shows DP applied to non-trivial problems with
        real-world motivation.</li>
        <li>For Leetcode practice, the &quot;dp&quot; tag has 400+ problems. NeetCode&apos;s DP
        playlist groups them into 1D, 2D, and grid families and walks through 50+ in order — a
        solid month of focused practice. Aditya Verma&apos;s YouTube DP series in Hindi/English
        is the highest-density treatment of the canonical patterns; many candidates credit it
        with their FAANG offers. Pair the videos with the problems and the textbook chapters,
        and the pattern goes from feared to fluent.</li>
      </ul>
</ArticleLayout>
  );
}
