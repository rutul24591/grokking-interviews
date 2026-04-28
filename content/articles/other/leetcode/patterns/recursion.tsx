"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "recursion",
  title: "Recursion Pattern",
  description:
    "Base cases, reduction, and combination — the discipline of solving a problem by reducing it to a smaller instance, with stack-depth and tail-call awareness.",
  category: "other",
  subcategory: "patterns",
  slug: "recursion",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-26",
  tags: ["recursion", "leetcode", "patterns", "divide-and-conquer"],
  relatedTopics: ["divide-and-conquer", "backtracking", "dynamic-programming"],
};

export default function RecursionArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
      <p className="mb-4">
        Recursion is the technique of solving a problem by reducing it to a smaller instance of
        the same problem and assembling the answer from the solution to that smaller instance.
        Mathematically, it is induction made executable. Operationally, it is a function that
        calls itself, with each invocation handling one slice of work and delegating the rest
        to a recursive call. Every recursive function carries three obligations: a base case
        that terminates, a reduction step that strictly approaches the base case, and a
        combination step that turns subproblem answers into the answer for the current call.
      </p>
      <p className="mb-4">
        Recognition signals: tree or graph traversal, divide-and-conquer (sort, search,
        balanced operations), backtracking with pruned exploration, inductive computation
        (factorial, Fibonacci, Hanoi), parsing of recursive grammars, and dynamic programming
        in its top-down memoised form. Whenever the problem reduces structurally to a smaller
        version of itself, recursion is the natural shape.
      </p>
      <p className="mb-4">
        The pattern is foundational rather than algorithmic — most other patterns in this
        guide (backtracking, divide-and-conquer, DP, tree traversal) are specialisations of
        recursion. Mastering recursion is therefore a prerequisite for the rest of the toolkit.
        The interview discipline is to reach for recursion when the structure invites it,
        write the base cases first, and verify the reduction strictly decreases.
      </p>
      <p className="mb-4">
        At staff level, recursion appears in compilers (recursive descent parsers), AI search
        (minimax, alpha-beta), distributed-systems coordination (recursive aggregation across
        a tree of nodes), and concurrency (fork-join task models). The intuition that
        recursion is structural induction, with the call stack as the inductive bookkeeping,
        carries directly into these systems.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
      <p className="mb-4">
        <strong>Base case.</strong> The condition that returns without recursing. Without it,
        recursion is infinite. Common base cases: empty list, leaf node, n = 0, single element.
        Write base cases first; they are easier to reason about than the recursive step.
      </p>
      <p className="mb-4">
        <strong>Reduction.</strong> Each recursive call must strictly move toward the base
        case. For a list, drop one element; for a number, halve or decrement; for a tree,
        descend to a child. If the reduction can stay the same or grow, recursion does not
        terminate.
      </p>
      <p className="mb-4">
        <strong>Combination.</strong> Once the recursive call returns, the function combines
        that answer with the current frame&apos;s information. For tree depth: 1 + max(left,
        right). For sorting: merge(sort(left), sort(right)). The combination is where the
        algorithmic work happens; the recursion just provides the structure.
      </p>
      <p className="mb-4">
        <strong>Call stack.</strong> Each recursive call pushes a frame on the call stack
        holding its local variables and return address. Stack depth equals recursion depth;
        memory is O(depth). For balanced binary tree of size n, depth is O(log n) — fine. For
        a linked list of size n, depth is O(n) — risks overflow.
      </p>
      <p className="mb-4">
        <strong>Tail recursion.</strong> A recursive call is in tail position if its return
        value is the immediate return of the caller, with no further work after the call.
        Compilers can transform tail recursion into a loop, eliminating stack growth. Java and
        Python do not perform this optimisation; Scheme and some C++ compilers do.
      </p>
      <p className="mb-4">
        <strong>Direct vs. indirect recursion.</strong> Direct: a function calls itself.
        Indirect: function A calls B, which calls A. Indirect recursion is harder to follow;
        usually a sign that one of the two functions should be inlined into the other.
      </p>
      <p className="mb-4">
        <strong>Single vs. multiple recursion.</strong> Single: each call makes at most one
        recursive call (linear chain, tail recursion). Multiple: each call makes several
        recursive calls (tree recursion, divide-and-conquer). Multiple recursion explores a
        branching state space; complexity is governed by the master theorem.
      </p>
      <p className="mb-4">
        <strong>Memoisation.</strong> Cache the result of each recursive call keyed on its
        arguments. If the same arguments recur, return the cached value. Converts exponential
        recursion (Fibonacci&apos;s O(2^n)) into linear (O(n)) by avoiding repeated work. The
        result is top-down dynamic programming.
      </p>
      <p className="mb-4">
        <strong>Recursion vs. mutation.</strong> Pure recursion takes immutable arguments and
        returns values. Recursion with mutation passes a shared accumulator (a list, a set, a
        counter) and modifies it in place — often used in backtracking. Pick the style based on
        the problem; do not mix without intent.
      </p>
      <ArticleImage src="/diagrams/other/leetcode/patterns/recursion-diagram-1.svg" alt="Recursion anatomy" />

      <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
      <p className="mb-4">
        The general recursive template: function f(state): if base_case(state) return
        base_value; else compute the reduced state(s); recurse on each; combine the results;
        return. Code reads like the problem statement when written in this shape.
      </p>
      <p className="mb-4">
        For a tree problem (Leetcode 104 max depth): if root is null, return 0; otherwise
        return 1 + max(f(root.left), f(root.right)). The base case is the empty tree; the
        reduction descends to children; the combination takes the max plus one. Three lines,
        directly mirroring the inductive definition of tree depth.
      </p>
      <p className="mb-4">
        For divide-and-conquer (Leetcode 50 Pow(x, n)): if n is 0 return 1; let half = pow(x,
        n / 2); if n is even return half * half; else return half * half * x. Each call halves
        n, giving O(log n).
      </p>
      <p className="mb-4">
        For linked list reversal (Leetcode 206): if head is null or head.next is null, return
        head; let new_head = reverse(head.next); head.next.next = head; head.next = null;
        return new_head. The base case stops at the last node; the reduction proceeds along
        the list; the combination splices head onto the reversed tail.
      </p>
      <p className="mb-4">
        For backtracking (Leetcode 78 subsets): function backtrack(idx, current): emit
        current.copy(); for i from idx to n - 1: current.add(nums[i]); backtrack(i + 1,
        current); current.removeLast(). The base case is the implicit emit at every call; the
        reduction is the +1 to idx; the combination is the side effect of emitting before each
        branch.
      </p>
      <p className="mb-4">
        For top-down DP with memoisation (Leetcode 322 coin change): function f(amount): if
        amount == 0 return 0; if amount &lt; 0 return INF; if amount in memo return
        memo[amount]; else compute min over coins of 1 + f(amount - coin); cache and return.
        Without memoisation, the runtime is exponential; with memoisation, it is O(amount *
        coin-count).
      </p>
      <p className="mb-4">
        For mutual recursion (parsing): expr() calls term() which calls factor() which calls
        expr() inside parentheses. Each function consumes a non-terminal of the grammar.
        Returns when its production is fully matched.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
      <p className="mb-4">
        <strong>Recursion vs. iteration.</strong> Recursion is clearer for inductive problems
        but uses O(depth) stack memory. Iteration is constant-stack but requires manual state
        management. For tree and divide-and-conquer problems, recursion wins clarity. For
        linear traversals and tight loops, iteration wins performance.
      </p>
      <p className="mb-4">
        <strong>Recursion vs. iterative DFS with explicit stack.</strong> The two are
        equivalent in expressive power. The explicit stack lets you control memory more
        carefully, avoid stack overflow on deep graphs, and pause / resume traversal. The
        recursive version is shorter and matches the inductive definition.
      </p>
      <p className="mb-4">
        <strong>Pure recursion vs. memoised recursion (top-down DP).</strong> Pure recursion
        recomputes overlapping subproblems exponentially. Memoisation stores results to avoid
        recomputation, dropping the time bound to polynomial. The space cost is the cache.
      </p>
      <p className="mb-4">
        <strong>Top-down vs. bottom-up DP.</strong> Top-down is recursion + memoisation;
        bottom-up is iteration + tabulation. Top-down is closer to the recursive definition
        and skips unreachable subproblems; bottom-up is faster (no call overhead) and uses
        less memory in some cases. Both compute the same answer.
      </p>
      <p className="mb-4">
        <strong>Recursion vs. continuation-passing style.</strong> CPS replaces returns with
        explicit callbacks; useful for stackful coroutines but rare in interview code.
        Mention only if the interviewer asks about non-blocking traversal.
      </p>
      <p className="mb-4">
        <strong>Direct vs. trampolined recursion.</strong> Trampolining converts a recursive
        function to one that returns a thunk, which a driver loop invokes in a loop —
        avoiding stack growth. Used in functional languages without TCO. Rare in
        interview-style Java / Python.
      </p>
      <ArticleImage src="/diagrams/other/leetcode/patterns/recursion-diagram-2.svg" alt="Recursion vs. iteration" />

      <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
      <p className="mb-4">
        <strong>Write the base case first.</strong> It is the simplest, easiest to reason
        about, and forces you to articulate when recursion stops.
      </p>
      <p className="mb-4">
        <strong>Verify reduction strictly decreases.</strong> Each recursive call must move
        the argument closer to the base. Off-by-one errors here cause infinite recursion.
      </p>
      <p className="mb-4">
        <strong>Trust the recursion.</strong> Assume the recursive call returns the correct
        answer for the smaller subproblem. Do not unfold mentally — that defeats the
        abstraction. This is the &quot;leap of faith&quot; that distinguishes seniors from
        juniors.
      </p>
      <p className="mb-4">
        <strong>Memoise when subproblems overlap.</strong> If you see f(n - 1) and f(n - 2)
        both calling f(n - 3), cache. Without memoisation, exponential blowup is silent.
      </p>
      <p className="mb-4">
        <strong>Convert to iterative when stack depth is unsafe.</strong> Lists or graphs of
        size 100k+ in Python require iterative DFS or sys.setrecursionlimit.
      </p>
      <p className="mb-4">
        <strong>Prefer pure recursion to mutated accumulators when possible.</strong> Pure
        recursion is easier to test and reason about. Use accumulators only when collecting a
        full enumeration (backtracking).
      </p>
      <p className="mb-4">
        <strong>For tree problems, decide pre-order, in-order, or post-order before coding.</strong>
        Each visit-order variant changes when work is done relative to the recursive call.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
      <p className="mb-4">
        <strong>Missing or wrong base case.</strong> Infinite recursion blowing the stack.
        Identify all base cases before writing the recursive step.
      </p>
      <p className="mb-4">
        <strong>Reduction does not strictly decrease.</strong> Recursing with the same or
        larger argument loops forever.
      </p>
      <p className="mb-4">
        <strong>Stack overflow on deep recursion.</strong> n = 100,000 in Python with default
        recursion limit crashes. Either iterate or raise the limit consciously.
      </p>
      <p className="mb-4">
        <strong>Recomputing overlapping subproblems.</strong> Plain Fibonacci is O(2^n); with
        memoisation it is O(n). The pure-recursion version is the educational starting point,
        not the production answer.
      </p>
      <p className="mb-4">
        <strong>Mutating shared state without backtracking.</strong> If you push to a shared
        list and forget to pop after recursion returns, sibling branches see the wrong state.
      </p>
      <p className="mb-4">
        <strong>Forgetting to return.</strong> Calling f(...) without returning the result
        passes garbage up the call chain. Especially common when refactoring an iterative
        function into recursion.
      </p>
      <p className="mb-4">
        <strong>Recursion that ignores the base case&apos;s structural meaning.</strong> Empty
        tree returning 0 vs. -1 vs. INF — pick the value that makes the combination step
        clean.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases (Canonical Leetcode)</h2>
      <p className="mb-4">
        <strong>509. Fibonacci Number.</strong> The textbook recursion. Pure version is O(2^n);
        memoised is O(n); iterative is O(n) with O(1) space.
      </p>
      <p className="mb-4">
        <strong>70. Climbing Stairs.</strong> Same recurrence as Fibonacci. Memoise.
      </p>
      <p className="mb-4">
        <strong>50. Pow(x, n).</strong> Divide-and-conquer recursion. O(log n).
      </p>
      <p className="mb-4">
        <strong>206. Reverse Linked List.</strong> Recurse to the tail, splice on the way
        back. Or iterate.
      </p>
      <p className="mb-4">
        <strong>24. Swap Nodes in Pairs.</strong> Recurse on pairs; reorder the head two
        nodes; attach the result of recursion to the new tail.
      </p>
      <p className="mb-4">
        <strong>104. Maximum Depth of Binary Tree.</strong> Post-order DFS. 1 + max(left,
        right).
      </p>
      <p className="mb-4">
        <strong>226. Invert Binary Tree.</strong> Recurse on each child, then swap the
        children. The famous &quot;Homebrew interview&quot; problem.
      </p>
      <p className="mb-4">
        <strong>110. Balanced Binary Tree.</strong> Recursive height with a balance check
        propagated up.
      </p>
      <p className="mb-4">
        <strong>124. Binary Tree Maximum Path Sum.</strong> Recursion returns the best
        downward path; a shared variable tracks the global best path through this node.
      </p>
      <p className="mb-4">
        <strong>95. Unique Binary Search Trees II.</strong> For each root choice, recursively
        enumerate left and right subtree shapes, combine into trees.
      </p>
      <p className="mb-4">
        <strong>322. Coin Change.</strong> Top-down memoised recursion. Without memoisation,
        exponential.
      </p>
      <p className="mb-4">
        <strong>779. K-th Symbol in Grammar.</strong> Recursive parity computation. f(n, k)
        depends on f(n - 1, k / 2) with a parity flip when k is odd.
      </p>
      <ArticleImage src="/diagrams/other/leetcode/patterns/recursion-diagram-3.svg" alt="Canonical recursion Leetcode problems" />

      <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li><strong>What are the three obligations of a recursive function?</strong> Base case,
        reduction, combination. Without all three, recursion is incorrect.</li>
        <li><strong>Why does pure Fibonacci take O(2^n)?</strong> Each call splits into two; the
        recursion tree has 2^n leaves; subproblems overlap but are not cached.</li>
        <li><strong>How does memoisation drop it to O(n)?</strong> Each subproblem is computed
        once and cached; subsequent requests return immediately. n distinct subproblems, each
        O(1) work given the cached children.</li>
        <li><strong>What is the call stack memory cost?</strong> O(depth). For balanced trees,
        O(log n); for skewed lists, O(n).</li>
        <li><strong>What is tail-call optimisation?</strong> Compiler transformation that replaces
        a recursive call in tail position with a jump, reusing the caller&apos;s stack frame.
        Java and Python do not implement it; Scheme and some C++ compilers do.</li>
        <li><strong>How do you convert recursion to iteration?</strong> Use an explicit stack of
        the values that the recursion would have stored. The control structure becomes a
        while loop that pops, processes, and pushes children.</li>
        <li><strong>What is the difference between top-down and bottom-up DP?</strong> Top-down is
        recursive with memoisation, computes only reachable subproblems. Bottom-up is
        iterative, computes all subproblems in dependency order, no recursion overhead.</li>
        <li><strong>Why trust the recursion?</strong> Reasoning about each call as &quot;this
        returns the correct answer for the smaller subproblem&quot; is the key to writing
        correct recursive code without unfolding it mentally.</li>
        <li><strong>How do you avoid stack overflow on deep recursion?</strong> Increase the
        recursion limit (Python sys.setrecursionlimit), increase JVM stack size (-Xss), or
        convert to iterative DFS with an explicit stack.</li>
        <li><strong>When should you not use recursion?</strong> When the problem has no
        natural inductive structure, when stack depth would exceed the runtime limit, or when
        the iterative version is significantly clearer and faster.</li>
      </ol>
<h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Hofstadter, <em>Gödel, Escher, Bach</em>, for an essay-style introduction to recursive
        thinking. Abelson and Sussman, <em>Structure and Interpretation of Computer Programs</em>,
        chapters 1.2 and 1.3 for the foundational treatment of recursion in computation.</li>
        <li>Cormen et al., <em>Introduction to Algorithms</em>, chapter 4 (Divide and Conquer)
        covers the master theorem for analysing recursive complexities. Sedgewick,
        <em>Algorithms</em>, 4th ed., section 1.1 introduces recursion alongside iteration.</li>
        <li>Leetcode tag &quot;recursion&quot; lists every problem that explicitly tests the
        pattern. NeetCode 150 covers 70, 50, 206, 104, 226, 124, 322. Project Euler problems
        in number theory are excellent recursion practice.</li>
      </ul>
    </ArticleLayout>
  );
}
