"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "union-find",
  title: "Union-Find Pattern",
  description:
    "Disjoint-set union for online connectivity, MST construction, cycle detection, and equivalence-class problems — near-O(1) per operation with path compression and union by rank.",
  category: "other",
  subcategory: "patterns",
  slug: "union-find",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-26",
  tags: ["union-find", "disjoint-set", "leetcode", "patterns"],
  relatedTopics: ["graph", "tree", "greedy"],
};

export default function UnionFindArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
      <p className="mb-4">
        Union-Find (also called Disjoint Set Union, or DSU) is a data structure for maintaining
        a partition of a set into disjoint subsets and supporting two operations: <em>find</em>,
        which returns a canonical representative of the subset containing a given element, and
        <em>union</em>, which merges the subsets containing two elements. Built on the simplest
        of structures — a parent-pointer array — Union-Find achieves near-constant amortised
        time per operation when path compression and union by rank are applied together.
      </p>
      <p className="mb-4">
        Recognition signals are concrete. &quot;Are these two elements in the same group?&quot;,
        &quot;merge these accounts&quot;, &quot;edges arrive online; how many components remain?&quot;,
        &quot;build the minimum spanning tree&quot;, &quot;detect a cycle in this undirected
        graph&quot;. Whenever the question is about equivalence classes that grow over time
        with merges, Union-Find is the right tool.
      </p>
      <p className="mb-4">
        The structural insight is that the data structure carries no information about
        individual edges, only about which elements are equivalent. This makes it weaker than a
        full graph (you cannot enumerate the neighbours of a node), but stronger for the
        connectivity question: BFS / DFS on a graph with E edges and Q queries costs O(Q * (V +
        E)); Union-Find handles the same workload in O((E + Q) α(V)), which is essentially
        linear.
      </p>
      <p className="mb-4">
        At staff level, Union-Find appears anywhere systems need to merge equivalence classes
        as they discover new identifications: identity resolution (the same person logging in
        from many devices), database join optimisation (which tables can be joined via
        equality predicates), distributed systems consensus (which replicas have agreed). The
        in-memory algorithm is the prototype; the systems version layers durability and
        concurrency on top.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
      <p className="mb-4">
        <strong>Parent-pointer forest.</strong> Each subset is represented as a tree where every
        node points to its parent and the root points to itself. The root&apos;s identity is the
        canonical name of the subset. Initially every element is its own subset (a tree of size
        one), so parent[i] = i for all i.
      </p>
      <p className="mb-4">
        <strong>find with path compression.</strong> Walking from a node up to the root takes
        time proportional to the depth of the tree. Path compression makes every node along the
        walk point directly to the root, flattening the tree for future queries. The recursive
        one-liner — parent[x] = find(parent[x]); return parent[x] — is the canonical
        implementation. Iterative versions split into two passes: walk to the root, then walk
        again to overwrite each parent.
      </p>
      <p className="mb-4">
        <strong>union by rank (or size).</strong> Without this, repeated unions can produce a
        chain-shaped tree of depth O(n), and find degenerates to O(n). Union by rank attaches
        the shorter tree under the taller; rank is an upper bound on tree height. Union by size
        attaches the smaller tree under the larger; both work, both achieve the same asymptotic
        bound.
      </p>
      <p className="mb-4">
        <strong>Inverse Ackermann complexity.</strong> Combining path compression and union by
        rank yields O(α(n)) amortised per operation, where α is the inverse Ackermann function.
        For any practical n (less than 2^65536), α(n) is at most 4. Effectively constant.
      </p>
      <p className="mb-4">
        <strong>Component count.</strong> A common variant tracks the number of disjoint
        components. Initialise count = n; on each successful union (when find(x) ≠ find(y)),
        decrement count. The current count is the number of distinct subsets.
      </p>
      <p className="mb-4">
        <strong>Union returns boolean.</strong> A clean convention: union returns true if the
        merge actually happened (different roots) and false if x and y were already in the same
        subset. The boolean is the cycle-detection primitive — for an undirected graph, the
        first edge whose union returns false closes a cycle.
      </p>
      <p className="mb-4">
        <strong>Element-to-index mapping.</strong> Union-Find usually operates on integer
        indices. For string keys (account merging, equation variables), maintain a separate
        Map&lt;String, Integer&gt; from key to index, allocating new indices on first
        encounter. The internal arrays remain integer-indexed for performance.
      </p>
      <p className="mb-4">
        <strong>Variants.</strong> Weighted Union-Find tracks an additional &quot;weight from
        node to root&quot; — used in problems with relative quantities (Leetcode 399 Evaluate
        Division, 1061 Lexicographically Smallest String After Equivalences). Persistent
        Union-Find supports rollback for offline algorithms — used in MST sensitivity analysis
        and dynamic connectivity.
      </p>
      <ArticleImage src="/diagrams/other/leetcode/patterns/union-find-diagram-1.svg" alt="Union-Find operations and use cases" />

      <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
      <p className="mb-4">
        The standard implementation: parent and rank arrays initialised so parent[i] = i and
        rank[i] = 0. find is recursive with path compression. union calls find on both
        arguments, returns false if they share a root, otherwise attaches the smaller-rank tree
        under the larger-rank tree, breaking ties by incrementing the rank of the absorbed
        root.
      </p>
      <p className="mb-4">
        For Kruskal&apos;s MST (Leetcode 1584, 1135): sort all edges by weight ascending. Walk
        the sorted list; for each edge (u, v, w), call union(u, v); if it returns true, add w
        to the running MST cost. Stop early when the number of components reaches one. Time
        O(E log E) dominated by the sort.
      </p>
      <p className="mb-4">
        For cycle detection in an undirected graph (Leetcode 261 Graph Valid Tree, 684
        Redundant Connection): for each edge, call union; the first union that returns false
        identifies an edge that closes a cycle. For 261, the graph is valid only if every union
        returns true and the final component count is 1.
      </p>
      <p className="mb-4">
        For online connectivity (Leetcode 305 Number of Islands II): allocate parent and rank
        arrays of size m * n. Initially count = 0. For each addLand operation, increment count,
        mark the cell as land, and union with each neighbouring land cell — every successful
        union (returning true) decrements count. Append the current count to the result.
      </p>
      <p className="mb-4">
        For equivalence classes from string keys (Leetcode 721 Accounts Merge): assign each
        email a unique index. For each account, union the first email with all subsequent
        emails (so the entire account becomes one component). Then, for each email, find the
        root and group emails by root. Merge the corresponding account names.
      </p>
      <p className="mb-4">
        For equality equations with inequality checks (Leetcode 990): split inputs into two
        passes. First pass: for each equality &quot;a == b&quot;, union(a, b). Second pass: for
        each inequality &quot;a != b&quot;, return false if find(a) == find(b). Otherwise,
        return true. Two passes ensure all equivalences are established before checking
        contradictions.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
      <p className="mb-4">
        <strong>Union-Find vs. BFS / DFS for connectivity.</strong> BFS / DFS is right for
        static graphs with offline queries (compute components once, answer queries). Union-Find
        is right for online edge insertions where queries interleave with insertions, or when
        only the connectivity relation is needed. Union-Find cannot delete edges efficiently —
        for that, more complex link-cut trees are required.
      </p>
      <p className="mb-4">
        <strong>Union-Find vs. adjacency list with hash-set component IDs.</strong> A naive
        connectivity tracker assigns each node a component ID and re-labels on merge. Merging
        two components of sizes a and b requires re-labelling all elements in the smaller — O(min
        (a, b)) per union, total O(n log n) by the &quot;small-to-large&quot; charging argument.
        Union-Find achieves the same bound but with simpler code and inverse Ackermann constants.
      </p>
      <p className="mb-4">
        <strong>Path compression alone vs. union by rank alone.</strong> Path compression alone
        gives O(log n) amortised per find. Union by rank alone gives O(log n) per find without
        compression. Combined, they give O(α(n)) — the famous Tarjan-van-Leeuwen result. Always
        use both.
      </p>
      <p className="mb-4">
        <strong>Iterative vs. recursive find.</strong> Recursive is simpler and uses path
        compression for free. Iterative avoids stack overflow on very deep trees and is
        marginally faster due to lack of function-call overhead. In Java, prefer iterative;
        Python&apos;s recursion limit forces iterative on large inputs.
      </p>
      <p className="mb-4">
        <strong>Union-Find vs. Tarjan&apos;s offline LCA.</strong> Tarjan&apos;s algorithm
        computes lowest common ancestor for many pairs offline in O((n + Q) α(n)) using
        Union-Find as a substrate. The pattern uses Union-Find to mark visited subtrees and
        identify the LCA via the canonical representative.
      </p>
      <p className="mb-4">
        <strong>Union-Find for matrix problems.</strong> For grids, the 2-D coordinate (r, c)
        is mapped to the linear index r * cols + c. The arrays then contain (r * cols + c)
        slots. This is purely a flattening — Union-Find sees integers, not coordinates.
      </p>
      <ArticleImage src="/diagrams/other/leetcode/patterns/union-find-diagram-2.svg" alt="Union-Find implementation template" />

      <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
      <p className="mb-4">
        <strong>Always combine path compression and union by rank.</strong> Half the
        optimisation provides log n; both together provide α(n). The cost is two extra arrays.
      </p>
      <p className="mb-4">
        <strong>Implement union to return a boolean.</strong> True for &quot;actually merged&quot;,
        false for &quot;already in the same set&quot;. The boolean is the cycle-detection signal
        and the component-count update trigger.
      </p>
      <p className="mb-4">
        <strong>Track component count if the question asks.</strong> Initialise count = n.
        Decrement count on each true return from union.
      </p>
      <p className="mb-4">
        <strong>Map string keys to integers once.</strong> Build a Map&lt;String, Integer&gt;
        as you read input. Never key the parent array on strings.
      </p>
      <p className="mb-4">
        <strong>For grid problems, flatten coordinates to indices.</strong> r * cols + c.
        Inverse: i / cols and i % cols. Choose one convention and stick with it.
      </p>
      <p className="mb-4">
        <strong>Sort edges before Kruskal.</strong> Ascending weight. Without sorting, the
        algorithm is wrong, not just slow.
      </p>
      <p className="mb-4">
        <strong>For online problems, do not rebuild from scratch.</strong> The whole point of
        Union-Find is incremental. If you find yourself rebuilding the structure on every
        query, you are misusing it.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
      <p className="mb-4">
        <strong>Forgetting path compression.</strong> Without it, find can be O(n) on
        adversarial inputs. The full Union-Find guarantee requires both optimisations.
      </p>
      <p className="mb-4">
        <strong>Forgetting union by rank.</strong> Same problem from the other direction.
        Without rank, repeated unions can produce a chain.
      </p>
      <p className="mb-4">
        <strong>Recursion stack overflow.</strong> Recursive find on a long uncompressed path
        can exceed the recursion limit. Either compress aggressively from the start, or write
        iterative find.
      </p>
      <p className="mb-4">
        <strong>Returning the wrong root.</strong> After a union, parent[x] may not be the
        current root. Always go through find to get the canonical representative; never read
        parent directly.
      </p>
      <p className="mb-4">
        <strong>Off-by-one in coordinate flattening.</strong> r * cols + c, not r * rows + c.
        Confusing rows and cols silently scrambles the indices.
      </p>
      <p className="mb-4">
        <strong>Component count drift.</strong> If you decrement count on every union call
        instead of every true union, you double-count merges of already-connected components.
        Always gate on the boolean return.
      </p>
      <p className="mb-4">
        <strong>For directed graphs, plain Union-Find is wrong.</strong> Union-Find treats
        edges symmetrically. For directed cycle detection (685), combine with parent-tracking
        and case analysis.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases (Canonical Leetcode)</h2>
      <p className="mb-4">
        <strong>547. Number of Provinces.</strong> Given an adjacency matrix of friendships,
        count the number of connected components. Union pairs that are friends; count distinct
        roots.
      </p>
      <p className="mb-4">
        <strong>200. Number of Islands.</strong> Union-Find as an alternative to BFS / DFS.
        Each land cell is its own component; union with each adjacent land cell. Count
        components.
      </p>
      <p className="mb-4">
        <strong>305. Number of Islands II.</strong> The streaming version. After each addLand,
        report the current number of islands. BFS / DFS would have to recompute on every
        query, which is too slow. Union-Find makes it incremental.
      </p>
      <p className="mb-4">
        <strong>323. Number of Connected Components in an Undirected Graph.</strong> Direct
        application. Union edges; count distinct roots.
      </p>
      <p className="mb-4">
        <strong>261. Graph Valid Tree.</strong> A tree is connected and acyclic. Union all
        edges; if any union returns false, a cycle exists; if the final component count
        differs from 1, the graph is disconnected.
      </p>
      <p className="mb-4">
        <strong>684. Redundant Connection.</strong> Walk edges in input order; the first edge
        whose union returns false is the redundant one.
      </p>
      <p className="mb-4">
        <strong>1584. Min Cost to Connect All Points.</strong> Kruskal&apos;s MST with
        Manhattan distance edges. Sort edges, union, accumulate cost.
      </p>
      <p className="mb-4">
        <strong>721. Accounts Merge.</strong> Map each email to an integer index; union all
        emails within one account; group by root; sort and emit.
      </p>
      <p className="mb-4">
        <strong>990. Satisfiability of Equality Equations.</strong> Two passes — equalities
        first, inequalities second. Contradiction if any inequality has connected operands.
      </p>
      <p className="mb-4">
        <strong>1971. Find if Path Exists in Graph.</strong> Union all edges; query is find(u)
        == find(v).
      </p>
      <p className="mb-4">
        <strong>399. Evaluate Division.</strong> Weighted Union-Find — each parent edge carries
        a multiplicative weight, and find returns both the root and the cumulative weight from
        node to root. Tests the weighted variant.
      </p>
      <ArticleImage src="/diagrams/other/leetcode/patterns/union-find-diagram-3.svg" alt="Canonical Union-Find Leetcode problems" />

      <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li><strong>Why is Union-Find amortised α(n)?</strong> Path compression flattens trees
        each find; union by rank keeps trees shallow. Together they bound the amortised cost
        per operation by α(n), the inverse Ackermann function — for any realistic n, at most
        4. The proof is Tarjan&apos;s, technical, but the result is widely cited.</li>
        <li><strong>Why does the union return a boolean?</strong> True signals the merge happened
        (decrement component count). False signals the elements were already connected — the
        edge closed a cycle.</li>
        <li><strong>How does Union-Find handle string keys?</strong> Map strings to integer
        indices in a separate hashmap. The arrays remain integer-indexed.</li>
        <li><strong>Why is Union-Find better than DFS for online connectivity?</strong> DFS would
        recompute components on every edge insertion, costing O(V + E) per query.
        Union-Find is incremental — α(1) per insertion and per query.</li>
        <li><strong>Can Union-Find delete edges?</strong> No, not directly. Edge deletion requires
        link-cut trees or offline rebuild. For pure online insertion, Union-Find is the right
        tool.</li>
        <li><strong>How does Kruskal use Union-Find?</strong> Sort edges; iterate in order; for
        each edge, if its endpoints are in different components, add it to the MST and union
        them. Stop when all nodes are in one component.</li>
        <li><strong>How would you implement weighted Union-Find?</strong> Track weight[i] = weight
        from i to parent[i]. find returns (root, accumulated_weight). union sets the weight on
        the new edge based on the constraint x = w * y, accounting for the existing weights.</li>
        <li><strong>What is the difference between union by rank and union by size?</strong> Rank
        is an upper bound on tree height; size is the count of nodes. Both achieve the same
        asymptotic guarantee. Size is slightly easier to reason about; rank is the classical
        choice.</li>
        <li><strong>Why is path compression important even with union by rank?</strong> Union by
        rank alone gives O(log n) per find in the worst case. Path compression flattens
        previously walked paths, dropping the per-operation amortised bound to α(n).</li>
        <li><strong>How do you scale Union-Find to distributed systems?</strong> Partition the
        element space across shards; each shard runs local Union-Find; unions across shards
        require coordination (gossip protocol or a coordinator). For most distributed-systems
        contexts, the abstraction is good enough; the implementation is layered above
        consistency primitives.</li>
      </ol>
<h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Tarjan, &quot;Efficiency of a Good but Not Linear Set Union Algorithm&quot;, JACM 1975 —
        the original analysis. Cormen et al., chapter 21 (&quot;Data Structures for Disjoint
        Sets&quot;). Sedgewick, <em>Algorithms</em>, 4th ed., section 1.5 covers Union-Find as
        the introductory data structure.</li>
        <li>Leetcode tag &quot;Union Find&quot; lists every canonical problem. Grokking the Coding
        Interview groups MST and connectivity problems. NeetCode 150 covers 200, 684, 1584, 721,
        323.</li>
        <li>For systems context: union-find underpins relation algebra in databases (transitive
        closure of equality predicates), partition refinement in compiler analysis (alias
        analysis, type inference), and identity resolution in data engineering. The algorithm
        is small but the application surface is enormous.</li>
      </ul>
    </ArticleLayout>
  );
}
