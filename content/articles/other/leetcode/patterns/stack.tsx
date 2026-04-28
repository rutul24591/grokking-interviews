"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "stack",
  title: "Stack Pattern",
  description:
    "LIFO bookkeeping for nested structure — bracket matching, expression evaluation, iterative DFS, and the family of design problems where the next answer depends on the most recent unfinished thing.",
  category: "other",
  subcategory: "patterns",
  slug: "stack",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-26",
  tags: ["stack", "leetcode", "patterns", "lifo", "expression"],
  relatedTopics: ["monotonic-stack", "queues", "recursion"],
};

export default function StackArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
      <p className="mb-4">
        A stack is a last-in, first-out container that exposes three O(1) operations: push, pop, and peek. As an
        interview pattern, the stack is the load-bearing structure for problems where the next decision depends on
        the most recent unfinished thing — nested brackets, function calls, parsed expressions, recursion made
        iterative, undo histories, and the &quot;nearest enclosing X&quot; family. The shape that signals a stack is
        the recursive shape of the input: parentheses, calls, or a tree walked depth-first.
      </p>
      <p className="mb-4">
        The pattern divides into three rough categories. <strong>Matched-pair / bracket validation</strong>: push
        on opener, verify match and pop on closer. <strong>Expression evaluation</strong>: a values stack and an
        operators stack process tokens by precedence. <strong>Iterative DFS / backtracking</strong>: the stack
        replaces the implicit recursion frame so we can avoid stack-overflow on deep inputs and gain explicit
        control over traversal order. A fourth category — <strong>monotonic stack</strong> — earns its own pattern
        because the maintenance discipline differs.
      </p>
      <p className="mb-4">
        Recognition signals are concrete. &quot;Balanced&quot;, &quot;nested&quot;, &quot;matched&quot;,
        &quot;valid parentheses&quot;, &quot;decode&quot;, &quot;simplify path&quot;, &quot;evaluate
        expression&quot; — these phrases nearly always map to a stack. &quot;Convert recursion to iteration&quot; or
        &quot;avoid stack overflow on deep trees&quot; — explicit stack. &quot;Implement X using Y&quot; design
        problems often sit on top of a stack as the storage substrate (min-stack, queue-from-stacks, BST
        iterator).
      </p>
      <p className="mb-4">
        For staff interviews, the lift is composing the stack with auxiliary state — pairing each push with a
        running min for the min-stack, with an index for longest-valid-parentheses, with a (multiplier, prefix)
        tuple for decode-string. The base data structure is trivial; the design choice is what to push, when to
        pop, and what auxiliary invariant the stack maintains.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
      <p className="mb-4">
        <strong>LIFO invariant.</strong> The element at the top is the most recently pushed and the next one to be
        popped. In bracket matching, the top is the most recent opener that has not yet been closed; in iterative
        DFS, the top is the next node whose subtree to explore. The invariant is what makes nested-structure
        problems collapse to one-pass solutions.
      </p>
      <p className="mb-4">
        <strong>Push-on-open, pop-on-close.</strong> The base discipline for matched-pair problems. The
        well-formedness check has three places to fail: (1) a closer with an empty stack (no opener available),
        (2) a closer that does not match the top opener, and (3) a non-empty stack at the end of input (unclosed
        opener). Forgetting any of the three produces a wrong answer.
      </p>
      <p className="mb-4">
        <strong>Push the index, not the character.</strong> When the question asks &quot;longest&quot; or
        &quot;range&quot;, push indices instead of characters. The top of the stack tells you both the most recent
        unmatched position and, by subtraction, the length of the current valid stretch. 32 (Longest Valid
        Parentheses) is the canonical instance — the stack stores indices and a sentinel −1 makes the length
        formula uniform.
      </p>
      <p className="mb-4">
        <strong>Pair pushes with auxiliary metadata.</strong> Min-stack pushes (value, running-min). Decode-string
        pushes (count, prefix). Basic-calculator pushes (current-result, current-sign). The metadata is what makes
        O(1) queries possible — without it, recovering the running min would require scanning the stack on every
        getMin call.
      </p>
      <p className="mb-4">
        <strong>Two-stack constructions.</strong> Two stacks together can implement a queue (in-stack receives,
        out-stack delivers; refill out-stack from in-stack on demand for amortised O(1) per op). Two stacks also
        implement an expression evaluator (values + operators with precedence comparisons). The pattern is &quot;a
        stack for normal flow plus a stack for deferred work&quot;.
      </p>
      <p className="mb-4">
        <strong>Iterative DFS as explicit stack.</strong> Recursion uses the call stack implicitly. Replacing it
        with an explicit stack of frames (node + child-iterator-state) gives the same traversal but no recursion
        depth limit, programmatic control over visit order, and the ability to pause / serialise mid-traversal.
        BST iterator (173) and binary tree post-order traversal are the canonical instances.
      </p>
      <p className="mb-4">
        <strong>Complexity.</strong> Each element is pushed once and popped once, so total work is O(n) for n
        items. Space is O(d) where d is the maximum depth — the stack size at its peak. For balanced brackets
        d ≤ n; for binary tree DFS d is the tree height (O(log n) balanced, O(n) worst case).
      </p>

      <ArticleImage
        src="/diagrams/other/leetcode/patterns/stack-diagram-1.svg"
        alt="Stack pattern overview"
        caption="When a stack fits, the bracket-matching template, and the failure modes to check."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
      <p className="mb-4">
        <strong>Bracket-matching template.</strong> Maintain stack of openers. For each character: if opener,
        push. If closer, the stack must be non-empty AND the top must be the matching opener; pop. After scan,
        stack must be empty. Three failure points — empty-on-closer, mismatch-on-closer, non-empty-at-end —
        each must produce false. 20 (Valid Parentheses) is this verbatim.
      </p>
      <p className="mb-4">
        <strong>Longest-valid-parentheses template.</strong> Push −1 sentinel. For each i: if &apos;(&apos;, push
        i. If &apos;)&apos;, pop. If stack empty after pop, push i (new sentinel for the next valid stretch).
        Else update best with i − stack.top(). The sentinel is what makes the length formula &quot;current i
        minus last invalid index&quot; work uniformly.
      </p>
      <p className="mb-4">
        <strong>Min-stack design.</strong> Two parallel stacks: values and running-mins. On push(x): push x to
        values; push min(x, mins.top() if non-empty else x) to mins. On pop: pop both. getMin: peek mins.
        Alternative: one stack of pairs. The invariant is mins.top() is always the min of the current values
        stack — preserved by induction.
      </p>
      <p className="mb-4">
        <strong>Queue from two stacks (232).</strong> In-stack receives push. Pop / peek take from out-stack; if
        out-stack is empty, drain in-stack into out-stack first (reverses order, so FIFO). Each element is moved
        across stacks at most once, giving amortised O(1) per operation despite occasional O(n) refills.
      </p>
      <p className="mb-4">
        <strong>Decode-string (394).</strong> Two stacks (or one stack of tuples) — counts and prefixes. On
        digit, accumulate the multiplier. On &apos;[&apos;, push (multiplier, current string), reset both. On
        &apos;]&apos;, pop (k, prefix), set current = prefix + current * k. On letter, append to current. The
        stack stores the deferred outer context so we can build the inner first.
      </p>
      <p className="mb-4">
        <strong>Basic Calculator (224 / 227 / 772).</strong> Values stack plus a sign tracker for + and −, with
        parentheses pushing the current (sign, result) pair. For * and /, evaluate eagerly against the top of the
        values stack. The structure handles all four operators and parentheses without an explicit operators
        stack, by exploiting the precedence asymmetry.
      </p>
      <p className="mb-4">
        <strong>BST iterator (173).</strong> Stack contains the chain of left-children from the current frontier
        node. next() pops, records the value, then pushes the right child&apos;s left chain. Average O(1) per
        next, O(h) space — beats materialising the full traversal.
      </p>
      <p className="mb-4">
        <strong>Iterative DFS for general graphs.</strong> Push start. While stack non-empty, pop, skip if
        visited, mark visited, process, push neighbours. To match recursive pre-order on trees, push children in
        reverse desired order. Post-order needs a marker bit (visited flag pushed as a second stack entry) or two
        stacks.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
      <p className="mb-4">
        <strong>Stack vs. recursion.</strong> Both express the same control flow on tree-shaped data. Recursion
        is shorter and clearer; explicit stack avoids stack-overflow on deep inputs (Java&apos;s default 512 KB
        thread stack overflows around 10⁴ frames; Python&apos;s sys.setrecursionlimit defaults to 1000). Use
        recursion when the depth is bounded by the problem; switch to a stack for deep linked-lists, deeply
        nested expressions, or when the problem says &quot;handle inputs up to 10⁵&quot;.
      </p>
      <p className="mb-4">
        <strong>Stack vs. queue.</strong> Stack is LIFO, queue is FIFO. DFS uses a stack and explores deep before
        wide; BFS uses a queue and explores by distance. The data-structure choice <em>is</em> the algorithmic
        choice — switching them is switching strategies.
      </p>
      <p className="mb-4">
        <strong>Stack vs. monotonic stack.</strong> A vanilla stack stores everything pushed; a monotonic stack
        evicts violators of an order invariant on push. The latter solves &quot;nearest greater / smaller&quot;
        and is its own pattern. If the problem reads &quot;nearest greater element&quot;, &quot;next warmer
        day&quot;, or &quot;largest rectangle in histogram&quot;, the answer is monotonic, not vanilla.
      </p>
      <p className="mb-4">
        <strong>Stack vs. counter for nesting depth.</strong> If only the depth matters (not which opener), a
        single integer counter suffices: increment on opener, decrement on closer. The stack is overkill. 1614
        (Maximum Nesting Depth) is the counter form. When multiple bracket types or per-frame state matter, the
        stack is necessary.
      </p>
      <p className="mb-4">
        <strong>Stack vs. dynamic programming for longest-valid-parentheses.</strong> Both work in O(n) time. DP
        keeps a length array and combines local matches; the stack tracks indices and uses subtraction for
        lengths. The stack version is more direct and slightly faster in practice; the DP version generalises
        better to constrained variants.
      </p>
      <p className="mb-4">
        <strong>Stack vs. tree map for ranged history.</strong> If the question needs &quot;most recent X&quot;
        the stack wins. If it needs &quot;most recent X within a time window&quot; or floor / ceiling lookups,
        switch to a tree map or sorted container.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
      <p className="mb-4">
        <strong>Document what is on the stack.</strong> One line of comment: &quot;stack stores indices of
        unmatched openers&quot; or &quot;stack of (multiplier, prefix) for outer contexts&quot;. Without this the
        invariant gets muddled and edge cases break.
      </p>
      <p className="mb-4">
        <strong>Use sentinels to remove edge cases.</strong> A −1 at the bottom of the longest-valid-parentheses
        stack makes the length formula uniform. A 0 at the bottom of an integer-stack avoids empty checks. Pick a
        sentinel value that cannot appear in the legitimate domain.
      </p>
      <p className="mb-4">
        <strong>Pop, then peek.</strong> Don&apos;t peek and conditionally pop; the conditional logic creates two
        code paths that must agree. Pop first, then if you need to put it back, push it again — or use a
        peek-check separately, not interleaved.
      </p>
      <p className="mb-4">
        <strong>Validate after the loop.</strong> Bracket problems must check stack-empty at the end. Pure
        push-on-open / pop-on-close without the post-loop check accepts unmatched opens. Make the post-loop check
        the last line of the algorithm.
      </p>
      <p className="mb-4">
        <strong>Prefer std::deque or ArrayDeque to std::stack / java.util.Stack.</strong> The legacy stack
        wrappers in Java and C++ have synchronisation overhead (Java) or vector semantics (C++). Deques are
        faster, and most languages now treat the stack ADT as a deque-with-restricted-API.
      </p>
      <p className="mb-4">
        <strong>Check depth bounds.</strong> The stack&apos;s peak size determines space. For deeply nested input
        an O(n) stack is fine; for adversarial inputs that explode auxiliary state (e.g., decode string with
        many nested levels) the stack can outgrow expectations — note the bound when explaining complexity.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
      <p className="mb-4">
        <strong>Forgetting the post-loop empty check.</strong> &quot;((&quot; passes opener-pop checks but leaves
        unmatched openers on the stack. Final stack must be empty.
      </p>
      <p className="mb-4">
        <strong>Popping an empty stack.</strong> A closer with no opener should fail fast. Test for empty before
        peeking; in Java, peek() on an empty Deque throws.
      </p>
      <p className="mb-4">
        <strong>Comparing characters incorrectly for bracket pairs.</strong> The matching map is small but easy
        to get backwards. Use a tiny map openerOf[closer] = opener and check stack.top() == openerOf[c]. Hardcoded
        if-chains are bug-prone.
      </p>
      <p className="mb-4">
        <strong>Forgetting auxiliary state on the stack.</strong> Min-stack pushes only values and recomputes min
        on every getMin → O(n) per call. Push the running min alongside.
      </p>
      <p className="mb-4">
        <strong>Off-by-one on index stacks.</strong> Without the −1 sentinel, longest-valid-parentheses needs a
        special case for the leftmost valid stretch. The sentinel removes the special case but only if it is
        pushed before the loop begins — pushing it inside the loop reintroduces the bug.
      </p>
      <p className="mb-4">
        <strong>Stack overflow from recursion.</strong> Recursive DFS on a 10⁵-node skewed tree blows the JVM /
        Python stack. Convert to an explicit stack when depth bounds approach the language limit.
      </p>
      <p className="mb-4">
        <strong>Using a list as a stack with pop(0).</strong> In Python, list.pop(0) is O(n). Always pop from the
        end (stack.pop()) and push with append — these are O(1) amortised.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases (Canonical Leetcode Problems)</h2>
      <p className="mb-4">
        <strong>20. Valid Parentheses.</strong> The base template. Push openers, pop and match on closers, check
        empty at end.
      </p>
      <p className="mb-4">
        <strong>32. Longest Valid Parentheses.</strong> Index stack with −1 sentinel. Each match yields a length
        candidate i − stack.top(). The sentinel makes the boundary case disappear.
      </p>
      <p className="mb-4">
        <strong>921 / 1249. Minimum Add / Remove to Make Parentheses Valid.</strong> Single counter (or stack)
        tracks unmatched openers and excess closers. Sum at the end is the answer.
      </p>
      <p className="mb-4">
        <strong>394. Decode String.</strong> Stack of (multiplier, prefix). On &apos;[&apos; push and reset; on
        &apos;]&apos; pop and assemble. Demonstrates pairing pushes with non-trivial metadata.
      </p>
      <p className="mb-4">
        <strong>71. Simplify Path.</strong> Split on &apos;/&apos;; for each token: skip empty / dot, pop on
        &quot;..&quot;, otherwise push. Final stack joined gives the canonical path. Filesystems use the same
        algorithm internally.
      </p>
      <p className="mb-4">
        <strong>155. Min Stack.</strong> Pair every push with the running min so getMin is O(1). The two-parallel-stacks
        and pair-on-stack variants both work.
      </p>
      <p className="mb-4">
        <strong>232. Implement Queue using Stacks.</strong> In-stack and out-stack with lazy transfer. Each
        element migrates at most once, amortised O(1).
      </p>
      <p className="mb-4">
        <strong>150. Evaluate Reverse Polish Notation.</strong> Pure stack evaluator: push operands, pop two and
        apply on operator, push result. Postfix is the form for which a single stack suffices — no operator
        precedence needed.
      </p>
      <p className="mb-4">
        <strong>224 / 227 / 772. Basic Calculator I/II/III.</strong> Values stack with sign / precedence handling.
        I has +, −, parentheses; II adds *, /; III combines both. The unary-minus and precedence cases are the
        interview tests.
      </p>
      <p className="mb-4">
        <strong>173. Binary Search Tree Iterator.</strong> Stack of left-chain nodes; next() pops and pushes the
        right-child&apos;s left chain. Constant amortised, O(h) space — the design illustrates lazy DFS.
      </p>

      <ArticleImage
        src="/diagrams/other/leetcode/patterns/stack-diagram-2.svg"
        alt="Stack variants and pairings"
        caption="Two-stack patterns and the iterative-DFS template, showing how stacks combine with auxiliary state."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li><strong>Why does a stack solve bracket matching in one pass?</strong> Because the matching relation is
        nested: the most recent unmatched opener is the only legal target for the next closer. A LIFO container
        gives O(1) access to that target.</li>
        <li><strong>Why amortised O(1) for queue-from-two-stacks?</strong> Each element is moved across stacks at
        most once. Over n operations the total work is O(n), so the per-op average is O(1).</li>
        <li><strong>How do you implement min-stack with O(1) getMin?</strong> Pair every push with the running min —
        either as a parallel stack or as a tuple. The min at the top is always valid.</li>
        <li><strong>Why does longest-valid-parentheses need a sentinel?</strong> The length formula i − stack.top()
        needs a meaningful &quot;last invalid index&quot; even before any invalid character is seen. The −1
        sentinel acts as a virtual invalid position to the left of index 0.</li>
        <li><strong>How do you convert recursive DFS to iterative?</strong> Replace each recursion frame with an
        explicit stack entry containing the local state needed to resume. Pre-order traversal on a tree maps
        directly; post-order needs a visited flag or a two-stack technique.</li>
        <li><strong>What is the space complexity of iterative DFS?</strong> O(d) where d is the maximum frontier
        depth — equal to the recursion depth of the equivalent recursive version.</li>
        <li><strong>When is a stack the wrong choice?</strong> When the answer depends on the oldest unfinished
        thing (FIFO — use a queue), on order-by-priority (heap), or on order-by-value (tree). Also when the
        problem needs random-access — stack only exposes the top.</li>
        <li><strong>How does decode-string handle nested brackets?</strong> Each &apos;[&apos; pushes the outer
        (multiplier, prefix); the inner is built fresh. On &apos;]&apos;, pop the outer and combine. Nesting
        depth is unbounded and naturally supported.</li>
        <li><strong>Why use a stack for postfix evaluation but two structures for infix?</strong> Postfix encodes
        precedence in token order, so a single values stack suffices. Infix needs explicit precedence handling —
        either a separate operator stack or recursive-descent.</li>
        <li><strong>How does BST iterator stay O(h) space?</strong> Only the current left-chain is on the stack —
        the rest of the tree lives implicitly via right-child pointers, pushed lazily on next().</li>
      </ol>
<h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li><strong>Leetcode problem set.</strong> 20, 32, 921, 1249, 394, 71, 155, 232, 225, 150, 224, 227, 772, 173,
        1614 — the stack syllabus. Solve in the order listed; each adds one new pairing or invariant.</li>
        <li><strong>CLRS, §10.1.</strong> Foundational treatment of stacks and queues as bounded arrays plus
        amortised analysis of queue-from-stacks.</li>
        <li><strong>SICP, Chapter 5 (Computing with Register Machines).</strong> Stacks as the substrate for
        evaluation — illuminates why postfix needs only a values stack and how infix-to-postfix conversion uses
        an operator stack.</li>
        <li><strong>Crafting Interpreters (Robert Nystrom).</strong> The bytecode VM chapter — practical stack-based
        evaluator at production quality.</li>
        <li><strong>Cracking the Coding Interview, Chapter 3 (Stacks and Queues).</strong> The interview canon for
        this pattern; problems 3.2 (Min Stack) and 3.4 (Queue via Stacks) are the canonical warm-ups.</li>
        <li><strong>Grokking the Coding Interview — &quot;Modified Binary Search&quot; and &quot;Two Heaps&quot; modules
        for the design-cousin problems</strong> that pair stacks with other structures.</li>
      </ul>
    </ArticleLayout>
  );
}
