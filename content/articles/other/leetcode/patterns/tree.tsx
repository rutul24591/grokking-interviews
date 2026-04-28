"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "tree",
  title: "Tree Pattern",
  description:
    "Recursive decomposition over binary trees and BSTs — the four traversal orders, the top-down vs. bottom-up split, and the canonical problems (LCA, diameter, max path sum, validate BST) that test the discipline.",
  category: "other",
  subcategory: "patterns",
  slug: "tree",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-26",
  tags: ["tree", "binary-tree", "bst", "leetcode", "patterns", "recursion"],
  relatedTopics: ["recursion", "queues", "graph"],
};

export default function TreeArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
      <p className="mb-4">
        The tree pattern groups problems whose central data structure is a rooted tree — usually a
        binary tree, often a binary search tree (BST), occasionally a general n-ary tree. The tree&apos;s
        recursive shape means every problem decomposes naturally into &quot;solve for left, solve for
        right, combine&quot;. The four traversal orders — pre-order, in-order, post-order, level-order —
        are the alphabet from which every tree algorithm is composed.
      </p>
      <p className="mb-4">
        Two algorithmic strategies cover most of the syllabus. <strong>Top-down</strong> carries state
        into the recursion (current path, depth, range bound) and computes results as it descends. The
        action happens <em>before</em> the recursive calls. <strong>Bottom-up</strong> aggregates
        results from children and combines them with the current node. The action happens <em>after</em>
        the recursive calls. Many problems can be solved either way; choosing the right direction is
        often the difference between an O(n) solution and an O(n²) one.
      </p>
      <p className="mb-4">
        Recognition signals are explicit. The input is a TreeNode root — it is a tree problem. The
        question asks about height, depth, balance, sum, or path — DFS recursion. The question asks
        about levels, view, or distance from root — BFS with a queue. The tree is a BST and the
        question involves order, k-th, or range — exploit the in-order = sorted property. The
        question gives a serialised form (parentheses, preorder + inorder) — construction from
        traversal.
      </p>
      <p className="mb-4">
        For staff interviews, the lift is choosing top-down vs. bottom-up correctly, knowing when to
        use BFS vs. DFS, knowing when to exploit the BST ordering, and handling the edge cases
        (null root, single node, skewed tree where recursion overflows). Most tree problems are O(n)
        or O(h); the interview content is correctness and choice of decomposition.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
      <p className="mb-4">
        <strong>Pre-order traversal.</strong> Process root, then recurse left, then recurse right.
        Used when the answer can be computed before knowing the children — clone, serialise, prefix
        expression evaluation, path tracking from root. The root is visited first.
      </p>
      <p className="mb-4">
        <strong>In-order traversal.</strong> Recurse left, process root, recurse right. On a BST,
        produces values in sorted order. Used for k-th smallest, validating BST property, and any
        problem that benefits from the sorted view.
      </p>
      <p className="mb-4">
        <strong>Post-order traversal.</strong> Recurse left, recurse right, process root. Used when
        the answer at a node depends on the answers from its children — height, balance, diameter,
        bottom-up tree DP. Most aggregation problems are post-order.
      </p>
      <p className="mb-4">
        <strong>Level-order (BFS).</strong> Queue-based traversal that visits nodes by depth. Used
        for level-related queries (right view, average per level, zigzag), shortest distance, and
        any problem where breadth matters more than depth.
      </p>
      <p className="mb-4">
        <strong>Top-down vs. bottom-up.</strong> Top-down passes accumulator state down: depth so
        far, current path, lower / upper bound for BST validation. Bottom-up returns aggregates
        upward: height, sum, gain. The shape of the answer dictates the direction. Diameter (543) is
        bottom-up because the answer combines child heights; path-sum from root to leaf (112) is
        top-down because the partial sum is built as we descend.
      </p>
      <p className="mb-4">
        <strong>BST ordering invariant.</strong> Every node&apos;s left subtree has values strictly less,
        right subtree strictly greater. Validating this requires bounds-passing recursion (lower and
        upper bounds passed down) — checking only against the immediate parent is the classic bug.
        In-order traversal of a valid BST yields a strictly increasing sequence — that is the
        alternative validation.
      </p>
      <p className="mb-4">
        <strong>Lowest Common Ancestor (LCA).</strong> For a general binary tree, recurse left and
        right; if both return non-null, the current node is the LCA; else return whichever side is
        non-null. For a BST, exploit the ordering: if both targets are less than the current node,
        recurse left; both greater, recurse right; otherwise the current node is the LCA. BST gives
        O(h); general tree gives O(n).
      </p>
      <p className="mb-4">
        <strong>Complexity.</strong> Most tree problems are O(n) time (each node visited a constant
        number of times) and O(h) space (recursion depth). For balanced trees h = O(log n); for
        skewed trees h = O(n). Level-order uses O(w) space where w is the maximum width.
      </p>

      <ArticleImage
        src="/diagrams/other/leetcode/patterns/tree-diagram-1.svg"
        alt="Tree traversal orders and decomposition"
        caption="The four traversal orders, the top-down vs. bottom-up split, and the bottom-up combine template."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
      <p className="mb-4">
        <strong>Bottom-up template.</strong> def helper(node): if node is null return base; l =
        helper(left); r = helper(right); combine l, r, node.val into the aggregate; return aggregate.
        Maximum depth (104), balanced (110), diameter (543), and path sum (124) all instantiate this
        skeleton.
      </p>
      <p className="mb-4">
        <strong>Top-down template.</strong> def helper(node, state): if node is null return; update
        state with node.val; if leaf, record candidate answer; helper(left, state&apos;); helper(right,
        state&apos;). Path-sum-to-leaf (112), root-to-leaf paths (257), sum-of-numbers (129), and tree
        DP with carried context all instantiate this skeleton.
      </p>
      <p className="mb-4">
        <strong>Validate BST template (98).</strong> Bounds-passing: validate(node, low, high) returns
        true iff node.val ∈ (low, high) AND validate(left, low, node.val) AND validate(right,
        node.val, high). Pass ±∞ as the initial bounds. The classic wrong answer checks only against
        node.left.val and node.right.val, missing transitive violations.
      </p>
      <p className="mb-4">
        <strong>Diameter template (543).</strong> def height(node): if null return 0; lh =
        height(left); rh = height(right); best = max(best, lh + rh); return 1 + max(lh, rh). The
        function returns the height (single-direction extent) but updates the best diameter
        (bidirectional extent through the current node) as a side effect. Same pattern for max path
        sum (124) — return the gain from one side, update best with both sides.
      </p>
      <p className="mb-4">
        <strong>LCA template (236).</strong> def lca(node, p, q): if node is null or node is p or
        node is q: return node; left = lca(left, p, q); right = lca(right, p, q); if both non-null,
        return node; else return left or right. The function returns either p, q, or the LCA itself,
        depending on which side(s) found a target.
      </p>
      <p className="mb-4">
        <strong>Construct from traversals (105 / 106).</strong> Pre-order gives the root first; find
        the root&apos;s index in in-order, split into left and right sub-arrays, recurse. O(n) with a
        hash map of value → in-order-index. The construction recursion mirrors the destruction
        recursion of any traversal.
      </p>
      <p className="mb-4">
        <strong>Serialize / Deserialize (297).</strong> Pre-order with explicit null markers (&quot;#&quot;).
        Serialize: pre-order DFS appending node values or &quot;#&quot;. Deserialize: parse tokens, build
        recursively — first token is the root, then recurse for left and right.
      </p>
      <p className="mb-4">
        <strong>Level-order template (102).</strong> Queue with size snapshot per level. Outer loop:
        while queue non-empty, level_size = queue.size(); inner loop: pop level_size nodes, process,
        push children. Same pattern handles right view (199), zigzag (103), and per-level aggregates.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
      <p className="mb-4">
        <strong>Top-down vs. bottom-up.</strong> Top-down can solve some problems in O(n) where naive
        bottom-up would be O(n²) — e.g., path sum from root to leaf is top-down O(n); naively
        recomputing path sums from each node is O(n²). Conversely, diameter requires bottom-up — the
        answer at a node uses heights of both subtrees. Choose by what the answer depends on.
      </p>
      <p className="mb-4">
        <strong>DFS vs. BFS.</strong> DFS uses O(h) stack space, gives natural pre / in / post
        ordering, and matches recursive problem decomposition. BFS uses O(w) queue space and gives
        level-by-level access. Use DFS for aggregate / path / structural questions; BFS for level /
        view / distance questions.
      </p>
      <p className="mb-4">
        <strong>Recursion vs. explicit stack.</strong> Recursion is shorter; explicit stack avoids
        overflow on deep / skewed trees. For Leetcode constraints up to 10⁴ nodes, recursion is
        usually safe; for skewed trees that approach n = 10⁵, switch to iteration.
      </p>
      <p className="mb-4">
        <strong>BST vs. general binary tree.</strong> BST ordering allows O(h) search, insert,
        delete, k-th, range. General tree requires O(n) for most queries unless additional indexing
        is built. When the input is a BST, exploit the ordering — solving 235 (LCA in BST) with the
        236 (LCA in general tree) algorithm is correct but wastes the O(h) opportunity.
      </p>
      <p className="mb-4">
        <strong>BST vs. balanced BST (AVL / Red-Black) vs. skip list.</strong> Plain BST is O(h),
        which is O(n) on adversarial inputs. Self-balancing variants give O(log n) worst case at
        the cost of rotation logic. Skip lists are probabilistic O(log n) and easier to implement
        concurrently. Standard library: Java TreeMap (red-black), C++ std::map (red-black),
        Python sortedcontainers (skip list-like).
      </p>
      <p className="mb-4">
        <strong>Recursive construction vs. iterative.</strong> Constructing a tree from pre + in
        traversals is naturally recursive; iterative construction is possible but obscure. Use
        recursion for construction; iteration for traversal of large trees.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
      <p className="mb-4">
        <strong>Choose the traversal order to match the answer.</strong> If the answer at a node
        needs results from children, post-order. If state must be carried down, top-down DFS. If
        levels matter, BFS. The choice is half the algorithm.
      </p>
      <p className="mb-4">
        <strong>Handle null roots first.</strong> Nearly every tree function starts with &quot;if node
        is null return base&quot;. Forgetting it is the most common runtime error.
      </p>
      <p className="mb-4">
        <strong>Pass state explicitly.</strong> For top-down patterns, pass accumulators as function
        arguments rather than mutating shared state. Avoids subtle bugs when recursion backs out.
      </p>
      <p className="mb-4">
        <strong>For BST, validate with bounds, not parent values.</strong> Bounds-passing recursion
        catches transitive violations (a left grandchild larger than the root). Comparing only to
        immediate parent is the classic 98 mistake.
      </p>
      <p className="mb-4">
        <strong>Use a hash map for repeated index lookups.</strong> When constructing from preorder
        + inorder, build a value-to-inorder-index map up front so root-finding is O(1) per
        recursive call instead of O(n).
      </p>
      <p className="mb-4">
        <strong>Iterative for very deep trees.</strong> Skewed trees of 10⁵ nodes overflow recursion.
        Convert to iteration with an explicit stack — Morris traversal achieves O(1) extra space at
        the cost of temporarily mutating right pointers.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
      <p className="mb-4">
        <strong>Validating BST against immediate parent.</strong> Pass bounds, not just parent values.
        The transitive ordering must hold for all ancestors.
      </p>
      <p className="mb-4">
        <strong>Mixing return value with side effect for diameter.</strong> The recursive function
        returns single-direction height; the diameter (bidirectional through the current node) is
        updated as a side effect. Confusing the two — returning diameter and updating height — gives
        wrong answers.
      </p>
      <p className="mb-4">
        <strong>Stack overflow on skewed trees.</strong> 10⁵ nodes in a left-skewed tree overflow
        Java&apos;s default stack. Iterative is required at scale.
      </p>
      <p className="mb-4">
        <strong>Forgetting to snapshot queue size in level-order.</strong> Iterating &quot;while
        queue non-empty&quot; without per-level boundaries merges levels and breaks zigzag, right
        view, and per-level averages.
      </p>
      <p className="mb-4">
        <strong>Treating LCA in general tree like LCA in BST.</strong> The BST algorithm assumes
        ordering and gives O(h); applying it to a general tree gives wrong answers.
      </p>
      <p className="mb-4">
        <strong>Recursing into null children in top-down.</strong> Without an early return, you walk
        past the leaf and produce wrong sub-tree results.
      </p>
      <p className="mb-4">
        <strong>Not handling negative values in path sum.</strong> 124 (Max Path Sum) requires the
        gain from a side to be max(0, side_gain) — negative branches should be skipped, not added.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases (Canonical Leetcode Problems)</h2>
      <p className="mb-4">
        <strong>104. Maximum Depth of Binary Tree.</strong> Bottom-up: return 1 + max(left, right)
        with base 0 for null.
      </p>
      <p className="mb-4">
        <strong>110. Balanced Binary Tree.</strong> Bottom-up: return height or sentinel −1 on
        imbalance. Propagating −1 short-circuits subsequent subtrees.
      </p>
      <p className="mb-4">
        <strong>543. Diameter of Binary Tree.</strong> Bottom-up height + side-effect best.
      </p>
      <p className="mb-4">
        <strong>124. Binary Tree Maximum Path Sum.</strong> Bottom-up gain (max(0, side_gain)) +
        side-effect best (left + node + right).
      </p>
      <p className="mb-4">
        <strong>236. Lowest Common Ancestor.</strong> Recursive; current node is LCA if both
        subtrees report a hit.
      </p>
      <p className="mb-4">
        <strong>235. LCA in BST.</strong> Exploit ordering: walk down until target values straddle
        the current node.
      </p>
      <p className="mb-4">
        <strong>98. Validate BST.</strong> Bounds-passing recursion. Initial (−∞, +∞).
      </p>
      <p className="mb-4">
        <strong>102. Level Order Traversal.</strong> Queue with per-level size snapshot.
      </p>
      <p className="mb-4">
        <strong>297. Serialize and Deserialize Binary Tree.</strong> Pre-order with null markers; the
        canonical example of preserving structure across a flat string.
      </p>
      <p className="mb-4">
        <strong>105 / 106. Construct Binary Tree from Traversals.</strong> Hash map of in-order
        indices + recursive split.
      </p>
      <p className="mb-4">
        <strong>173. BST Iterator.</strong> Stack-based controlled DFS; next() pops, then pushes the
        right child&apos;s left chain.
      </p>

      <ArticleImage
        src="/diagrams/other/leetcode/patterns/tree-diagram-2.svg"
        alt="BST properties and LCA"
        caption="BST ordering, balanced operation costs, and the divergent LCA strategies for general trees vs. BSTs."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li><strong>How do you choose between pre, in, and post-order?</strong> By what the answer
        depends on. Pre when the root&apos;s contribution is computable before children; in when the
        BST sorted property is useful; post when children must finish first.</li>
        <li><strong>Why does in-order on a BST give sorted output?</strong> Because at every node, the
        left subtree (smaller values) is fully visited before the node, and the right subtree
        (larger) afterwards. By induction the whole sequence is sorted.</li>
        <li><strong>Why is bounds-passing required for BST validation?</strong> The BST property is
        transitive: a node&apos;s left subtree must have values less than the node and less than every
        ancestor that places it on a left branch. Parent-only checks miss transitive violations.</li>
        <li><strong>How does diameter avoid recomputing heights?</strong> By computing heights bottom-up
        in one pass, recording the best (left + right) at each node as a side effect. Each node is
        visited once.</li>
        <li><strong>What is the complexity of LCA in a general binary tree?</strong> O(n) — every node
        may be visited once. For BST, O(h) using the ordering.</li>
        <li><strong>How do you handle a null root?</strong> Early return with the base value (0 for
        depth, true for balanced, null for LCA, etc.).</li>
        <li><strong>How does Morris traversal achieve O(1) extra space?</strong> By temporarily linking
        the rightmost node of each left subtree to the current node, walking down, then undoing the
        link on the way back up.</li>
        <li><strong>How do you serialize a tree uniquely?</strong> Pre-order with explicit null markers.
        Without nulls, the structure is ambiguous.</li>
        <li><strong>How would you compute the k-th smallest in a BST efficiently?</strong> In-order
        traversal with a counter; stop when the counter reaches k. O(h + k) — better than full
        in-order if k is small.</li>
        <li><strong>When does iterative beat recursive on tree problems?</strong> On skewed inputs near
        the recursion-depth limit, and when constant-factor performance matters in latency-bounded
        contexts.</li>
      </ol>
<h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li><strong>Leetcode problem set.</strong> 104, 110, 543, 124, 236, 235, 226, 102, 297, 105, 106,
        98, 230, 173, 199, 103. The tree syllabus, ordered from base recursion to construction.</li>
        <li><strong>CLRS, Chapter 12 (Binary Search Trees).</strong> Foundational treatment of BST
        operations and the rotation primitives that underpin AVL / Red-Black.</li>
        <li><strong>SICP, §2.3 (Symbolic Data).</strong> The recursive decomposition view of trees, with
        worked traversals and structural induction.</li>
        <li><strong>Cracking the Coding Interview, Chapter 4.</strong> Trees and graphs — the canon of
        LCA, path sum, balanced check, and traversal order problems.</li>
        <li><strong>Elements of Programming Interviews, Chapter 9.</strong> Binary trees chapter with
        Morris traversal, threaded trees, and the construction-from-traversals derivation.</li>
        <li><strong>Grokking the Coding Interview — &quot;Tree DFS&quot; and &quot;Tree BFS&quot;
        modules.</strong> Practical templates and recognition framing.</li>
      </ul>
    </ArticleLayout>
  );
}
