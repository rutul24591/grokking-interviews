"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "dp-on-trees",
  title: "Dynamic Programming on Trees",
  description:
    "DP on trees — subtree DP in a single DFS, rerooting for all-root answers in linear time, and pattern variants for MIS, diameter, and tree knapsack.",
  category: "other",
  subcategory: "algorithms",
  slug: "dp-on-trees",
  wordCount: 4700,
  readingTime: 23,
  lastUpdated: "2026-04-20",
  tags: ["tree-dp", "dynamic-programming", "rerooting", "dfs"],
  relatedTopics: [
    "dp-fundamentals",
    "bitmask-dp",
    "knapsack-01",
    "dfs",
  ],
};

export default function DpOnTreesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p className="mb-4">
          <span className="font-semibold">DP on trees</span> is dynamic programming whose state
          is indexed by a node (or a (node, auxiliary) pair), whose transitions aggregate
          values from children into parents, and whose computation order is a post-order DFS.
          The dependency DAG of the DP is the tree itself — children before parents — so there
          is no scheduling complexity: a single DFS fills the table.
        </p>
        <p className="mb-4">
          Tree DP sits between array DP (one-dimensional) and DAG DP (arbitrary topology). The
          tree structure buys us two guarantees: linear-sized state (usually Θ(n) cells) and a
          natural traversal order. That combination makes tree DP the default tool for any
          problem where the input is a tree and the answer is an aggregate — independent set,
          vertex cover, diameter, sum of distances, counting matchings.
        </p>
        <p className="mb-4">
          The &ldquo;rerooting&rdquo; technique extends subtree DP to compute, for every node
          simultaneously, the answer as if that node were the root — all in linear time. It
          turns a naive Θ(n²) &ldquo;run subtree DP from each root&rdquo; into Θ(n) with two
          DFS passes. Rerooting is one of the most-asked competitive-programming tricks and
          shows up in LeetCode Hard problems regularly.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <p className="mb-4">
          <span className="font-semibold">Subtree DP skeleton.</span> Root the tree at an
          arbitrary node (usually 0). Perform DFS. When returning from node u, combine values
          reported by u&rsquo;s children to produce dp[u]. The combine step is problem-specific
          — sum, min/max, convolution. Leaves are the base case.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Maximum Independent Set on a tree.</span> Two-state
          per node: dp[u][0] = best MIS in subtree(u) with u <em>not</em> chosen, dp[u][1] =
          best MIS with u chosen. Recurrences: dp[u][0] = Σ over children c of max(dp[c][0],
          dp[c][1]); dp[u][1] = w[u] + Σ over children c of dp[c][0]. Answer: max(dp[root][0],
          dp[root][1]). Linear time, constant state per node.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Tree diameter.</span> At each node u, the longest
          path passing through u is the sum of u&rsquo;s two deepest child-depths (plus 2 for
          the edges to those children). Track the global maximum across all u. Also computable
          by two BFS/DFS passes (farthest from any node → farthest from that = diameter).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Rerooting.</span> First DFS computes subtree[u] — the
          answer restricted to the subtree rooted at u with the original root. Second DFS pushes
          an outside[u] value down from the root, representing the answer contribution from
          the rest of the tree. Combine subtree[u] with outside[u] to obtain the &ldquo;u is
          root&rdquo; answer. Total: 2n transitions, Θ(n).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Tree knapsack.</span> dp[u][b] = best value in
          subtree(u) using budget b. Merging a child&rsquo;s dp into the parent is a knapsack
          convolution. Careful sibling-order analysis gives Θ(n · W) total time (the sum of
          merge costs telescopes to n · W), not Θ(n · W²) as a naive bound suggests.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/dp-on-trees-diagram-1.svg"
          alt="Max independent set DP on a 7-node tree with two-state recurrence"
          caption="Two-state subtree DP for max independent set: each node tracks the best answer for both take/skip decisions."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p className="mb-4">
          <span className="font-semibold">Canonical implementation.</span> Read the tree into an
          adjacency list. Pick root = 0. Call dfs(0, parent = −1). Inside dfs, recurse into each
          neighbor != parent, combine their returned values, then emit dp[u]. For N up to ~10⁵
          this is fine; for larger N or on languages with small stack limits, convert to
          iterative DFS using an explicit stack to avoid overflow.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Rerooting, step by step.</span> Pass 1: standard DFS
          computes subtree[u] for every u. Pass 2: a second DFS that starts at the root with
          outside[root] = identity, and when descending to a child v computes outside[v] from
          outside[u] and the siblings of v. The exact formula depends on the problem — for sum-
          of-distances, outside contributes &ldquo;n − size(v)&rdquo; steps across the edge
          (u, v).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Multiple children, non-associative combine.</span> If
          the merge is not freely associative/commutative (e.g. you need to exclude one
          child&rsquo;s contribution), compute prefix and suffix combines of the child vector.
          Then to reconstruct &ldquo;all children except v&rdquo; in constant time, combine
          prefix[v − 1] and suffix[v + 1]. Common trick for rerooting.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/dp-on-trees-diagram-2.svg"
          alt="Rerooting: pass 1 computes subtree values, pass 2 propagates outside values"
          caption="Rerooting: two DFS passes give an answer for every possible root in Θ(n) total work."
        />
        <p className="mb-4">
          <span className="font-semibold">Heavy-light decomposition.</span> When queries touch
          paths between arbitrary nodes (not whole subtrees), pre-order them along heavy chains
          and run segment-tree queries over the linearized order. Path-query tree DP becomes
          O(log² n) per query rather than Θ(n) per query.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Small-to-large merging.</span> When each node holds a
          set (not a scalar), merging child sets into a parent naively costs O(n²). Merging
          always into the larger container caps total work at O(n log n), because every element
          moves O(log n) times.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Auxiliary (virtual) trees.</span> Given a query subset
          S, the virtual tree of S contains only S and their pairwise LCAs. Building it in
          O(|S| log n) lets you run tree DP restricted to S — essential when S is small but the
          underlying tree is huge and queries are batched.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <p className="mb-4">
          <span className="font-semibold">Subtree DP vs naive recompute.</span> A naive
          &ldquo;for each node, scan the whole subtree&rdquo; is Θ(n²). Subtree DP is Θ(n).
          For n = 10⁵, that is a 10⁵× speedup — the difference between feasible and timeout.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Rerooting vs Θ(n²) brute.</span> &ldquo;Run subtree
          DP rooted at each node&rdquo; is Θ(n²). Rerooting gives Θ(n) for a linear multi-root
          output, but it costs implementation complexity — two DFS passes and careful handling
          of the outside[u] recurrence.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Recursive vs iterative DFS.</span> Recursive is
          shorter to write. Iterative with explicit stack is slower (by a small constant) but
          immune to stack-overflow on paths of length 10⁵. Pick by language: in Python or
          JavaScript at n ≥ 10⁴, iterative is mandatory. In C++ with increased stack size,
          recursive is fine.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Tree DP vs general DAG DP.</span> On a DAG, you need
          a topological sort and the state space can be much larger (many parents per node).
          Trees give you &ldquo;exactly one parent&rdquo; which collapses merges into a simple
          per-child sum/max.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Tree DP vs HLD + segment tree.</span> If the problem
          is &ldquo;compute one answer at the root&rdquo;, plain tree DP in Θ(n) is optimal.
          For batched path queries with updates, HLD plus segment tree handles log² n per
          query — the right structure whenever the workload is online and intermixes updates.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Tree knapsack vs sqrt-decomposition tree DP.</span>
          The telescoping argument gives O(nW) for the tree-knapsack merge; naïvely it looks
          like O(n · W²) and some implementations actually hit that bound by bounding the
          inner loop poorly. The trick is to bound the merge by min(size(u), size(v)) rather
          than W.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <p className="mb-4">
          <span className="font-semibold">Always pass the parent in DFS.</span> Tree DFS
          frequently visits each neighbor including the parent and recurses, creating an
          infinite loop. Pass parent as a DFS argument; skip it when iterating neighbors. No
          visited array needed on trees.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Lift the stack limit when recursive.</span> In
          Python, sys.setrecursionlimit(2 * 10⁵) for n up to 10⁵. In C++, compile with
          larger stack or use iterative DFS. In JavaScript, no reliable way to lift; use
          iterative.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Define dp[u] in terms of subtree(u) only.</span>
          Including &ldquo;outside&rdquo; information in dp[u] is the classic rerooting mistake
          — you conflate two DPs and end up double-counting. Keep subtree[u] and outside[u]
          strictly separated until the final combine.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Precompute sizes when needed.</span> Many rerooting
          recurrences involve size(v) and n − size(v). Compute size in pass 1 and cache it.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Use adjacency lists with integer indices.</span>
          Object-keyed adjacencies (strings, hashmaps) cost 5–10× in Python and JavaScript.
          Always encode vertices as 0-indexed integers.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Cache prefix/suffix of child values for rerooting.</span>
          When the merge operator needs to exclude one child, storing the full child-vector
          plus prefix/suffix combines gives O(1) &ldquo;merge without child v&rdquo; queries.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Sanity-check with the 1-node and 2-node cases.</span>
          Tree DPs almost always have subtle base-case bugs. A path of length 1 and a
          3-node path usually exposes them.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <p className="mb-4">
          <span className="font-semibold">Revisiting the parent.</span> If you iterate
          neighbors without skipping the parent, you recurse back up and loop forever. This
          shows up the first time you implement tree DFS without reading the pattern carefully.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Stack overflow on deep trees.</span> A path-shaped
          tree with 10⁵ nodes has recursion depth 10⁵. Python&rsquo;s default limit (1000) and
          JavaScript&rsquo;s engine-dependent limit (~10k) both die. Iterative DFS or
          sys.setrecursionlimit are mandatory.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Assuming the input tree is rooted.</span> Interview
          tree problems often give an edge list, not a parent array. You have to root it
          yourself — and the choice of root usually does not matter for subtree-invariant
          answers like diameter, but does matter for rerooting problems.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Merging children in the wrong order for knapsack.</span>
          For tree knapsack, the merge-by-min-subtree-size argument gives Θ(nW). If you merge
          in the wrong order (child by child without bounding by current-size), you may
          accidentally do Θ(n²W) work and time out on n = 2000.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Double-counting during rerooting.</span> When moving
          the root from u to v, you must subtract v&rsquo;s contribution from u&rsquo;s side
          and add u&rsquo;s contribution to v&rsquo;s side. Forgetting either side inflates or
          deflates the answer.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Using a visited array on a tree.</span> Not
          incorrect, but wastes memory and slows the code. Trees have no cycles; parent-skip is
          sufficient.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Ignoring the disconnected-input edge case.</span> A
          forest (multiple trees) breaks single-root assumptions. Loop over nodes and DFS from
          any unvisited one.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <p className="mb-4">
          <span className="font-semibold">Network infrastructure planning.</span> Trees model
          hierarchical networks (access → aggregation → core). Max-independent-set computes
          the minimum set of routers whose failure disconnects the tree; vertex cover computes
          the minimum monitoring deployment. Both are Θ(n) on trees but NP-hard on general
          graphs.
        </p>
        <p className="mb-4">
          <span className="font-semibold">File system and configuration propagation.</span>
          Linux cgroups, Kubernetes namespaces, and GitHub org/team hierarchies are trees.
          Summing quota, counting active workloads, or propagating policy default values
          reduces to subtree DP running as a single DFS at admin time.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Phylogenetic tree analysis.</span> The Fitch
          algorithm for parsimonious ancestral-state reconstruction and the Felsenstein
          pruning algorithm for maximum-likelihood phylogenetics are both tree DPs — classic
          examples in computational biology.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Compiler register allocation on straight-line
          code.</span> Expression trees (parse trees of single expressions) admit an
          Aho-Sethi-Ullman tree-DP algorithm for minimum-register evaluation — the canonical
          application from compiler textbooks.
        </p>
        <p className="mb-4">
          <span className="font-semibold">DOM/component layout in UI frameworks.</span>
          Constraint propagation for flexbox, grid, and platform-native layout engines uses
          bottom-up passes to compute natural size followed by top-down passes for final
          placement — classic tree DP plus rerooting pattern.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Game AI on decision trees.</span> Alpha-beta pruning
          and minimax on game trees are tree DPs (post-order) with extra pruning; for perfect-
          information finite games with small branching factor, this is how the core engine
          evaluates positions.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Database query plan optimization.</span> A join tree
          with cost information — left-deep or bushy — is evaluated via tree DP to pick the
          cheapest join order. Selinger&rsquo;s System R optimizer (1979) is essentially a
          tree DP with pruning.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Centroid decomposition + tree DP.</span> Divide-and-
          conquer on trees via centroid decomposition lets you answer &ldquo;number of paths of
          length k&rdquo; and other path-aggregate queries in O(n log² n). Used in competitive
          programming and in some bioinformatics tools for phylogenetic distance queries.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/dp-on-trees-diagram-3.svg"
          alt="Tree DP pattern taxonomy with complexities and real-world applications"
          caption="Tree DP is a family of patterns: subtree aggregates, MIS, diameter, knapsack, rerooting, HLD. Each pattern maps cleanly to a real-world workload."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 337 — House Robber III.</span> Max
          independent set on a binary tree. Expected answer: two-state subtree DP, Θ(n).
        </p>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 543 — Diameter of Binary Tree.</span>
          Longest edge path. Expected answer: post-order DFS tracking depth, updating a global
          best with the sum of the two deepest child depths.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 124 — Maximum Path Sum.</span> Like
          diameter but with weighted nodes (which can be negative). Tests careful handling of
          &ldquo;take or drop&rdquo; decisions during the merge.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 834 — Sum of Distances in Tree.</span> The
          canonical rerooting problem. Expected answer: two DFS passes — first to compute
          subtree size and subtree-distance-sum, second to propagate.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 2538 — Difference Between Maximum and
          Minimum Price Sum.</span> Another rerooting problem — the answer at any node is
          essentially that node&rsquo;s best root-to-leaf path, minus its own value.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 968 — Binary Tree Cameras.</span> Minimum
          vertex cover variant — three-state subtree DP (has camera / covered / needs
          covering). Tests careful state enumeration.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 1372 — Longest ZigZag Path.</span> Subtree
          DP with direction-aware state.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 2246 — Longest Path with Different
          Adjacent Characters.</span> Combines tree diameter with an equality constraint;
          DP extension.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Follow-ups interviewers favor:</span> how do you
          avoid stack overflow? (iterative DFS or increased limit). How do you answer for all
          roots without running the DP n times? (rerooting). What if each query asks about a
          different subtree? (Euler tour + segment tree). What if edges have weights? (same
          DP, just multiply/add weights during combine).
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <p className="mb-4">
          CLRS and Kleinberg-Tardos cover the basics of tree DP in their DP chapters.
          CP-Algorithms has thorough tutorials on subtree DP, rerooting, centroid decomposition,
          and heavy-light decomposition.
        </p>
        <p className="mb-4">
          Aho, Sethi, &amp; Ullman, <em>Compilers: Principles, Techniques, and Tools</em>
          (&ldquo;Dragon Book&rdquo;) — the register-allocation-on-expression-trees application.
          Felsenstein, <em>Inferring Phylogenies</em> (2004) — the biology-side applications
          (Fitch, Felsenstein algorithms).
        </p>
        <p className="mb-4">
          Competitive-programming archives: Codeforces EDU &ldquo;ITMO Academy: Pilot
          Course&rdquo; section on tree DP, USACO training pages, and Errichto&rsquo;s
          tutorials are excellent for rerooting and centroid decomposition in practice. For
          interview prep, working through the LeetCode problems listed above in order gives
          the full pattern library.
        </p>
      </section>
    </ArticleLayout>
  );
}
