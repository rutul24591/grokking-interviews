"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "disjoint-set-union-find",
  title: "Disjoint Set (Union-Find)",
  description: "A forest of parent pointers that tracks dynamic equivalence classes — Kruskal's MST, connected components, percolation, and incremental clustering all collapse to two operations: union and find.",
  category: "other",
  subcategory: "data-structures",
  slug: "disjoint-set-union-find",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-04-18",
  tags: ["union-find", "disjoint-set", "kruskal", "connected-components", "data-structures"],
  relatedTopics: ["graphs", "trees"],
};

export default function DisjointSetArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition & Context</h2>
        <p className="mb-4">
          A disjoint-set (also called union-find) maintains a partition of n elements into disjoint subsets and supports two operations: <strong>find(x)</strong> returns a canonical representative of the set containing x, and <strong>union(x, y)</strong> merges the sets containing x and y. Two elements are in the same set if and only if they have the same representative.
        </p>
        <p className="mb-4">
          Bernard Galler and Michael Fischer introduced the structure in 1964, but it took Robert Tarjan&apos;s 1975 analysis to prove the now-canonical complexity bound: with the two optimizations <em>union by rank</em> and <em>path compression</em>, the amortized cost of any sequence of m operations on n elements is O(m · α(n)), where α is the inverse Ackermann function. For all practically representable n (up to roughly 2^65536), α(n) ≤ 4 — so the structure is effectively constant time per operation, but provably not actually constant time.
        </p>
        <p>
          The structure shows up wherever a system must track dynamic equivalence: Kruskal&apos;s MST algorithm (does adding this edge create a cycle?), connected components in a streaming graph, image segmentation (which pixels form the same region?), Tarjan&apos;s offline LCA, type unification in compilers, percolation simulation in physics, and incremental clustering. Most engineers go years without writing one explicitly, then suddenly need it for a graph problem and discover the entire algorithm is fifteen lines of code.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>
        <p className="mb-4">
          The standard representation is a <strong>forest of upward-pointing trees</strong>. Each set is one tree; each element holds a single pointer to its parent; the root of each tree points to itself and identifies the set. Internally, this is just an integer array <code>parent[i]</code> where <code>parent[i] == i</code> marks roots. There is no traversal of children, no balanced-tree machinery, and no per-node payload beyond the parent pointer (and a small rank field).
        </p>
        <p className="mb-4">
          <strong>find(x)</strong> walks parent pointers from x until it reaches a self-loop (the root). The cost is the depth of x in its tree. <strong>union(x, y)</strong> calls find on both, and if the two roots differ, makes one root the parent of the other. Naive implementations can produce a chain of n elements with depth n, making find O(n) — which is why the two optimizations are not optional in production code.
        </p>
        <p className="mb-4">
          <strong>Union by rank</strong> (or by size — equivalent within a constant factor) attaches the shorter tree under the taller root. Each root maintains a rank that upper-bounds its tree height; when unioning two trees of equal rank, the result has rank one greater. This alone bounds find to O(log n).
        </p>
        <p>
          <strong>Path compression</strong> rewrites every node touched during a find call to point directly at the root. After a single find on a long chain, all elements on that chain become depth-1 children of the root. The next find on any of them is one hop. Combined with union by rank, the amortized cost of every operation drops to O(α(n)), the famous inverse-Ackermann bound.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/disjoint-set-union-find-diagram-1.svg"
          alt="Disjoint set forest of three trees with parent pointers leading to roots, alongside the parent array storing the same data as integer indices"
          caption="Figure 1: Each set is a tree of upward parent pointers. The root identifies the set. Internally, a single parent[] array stores everything — roots have parent[i] = i."
        />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture & Flow</h2>
        <p className="mb-4">
          The data structure consists of two integer arrays of size n: <code>parent[]</code> stores each element&apos;s parent (with <code>parent[i] = i</code> for roots), and <code>rank[]</code> stores an upper bound on each root&apos;s tree height. Initialization makes every element its own singleton set: <code>parent[i] = i</code>, <code>rank[i] = 0</code> for all i.
        </p>
        <p className="mb-4">
          <strong>find(x):</strong> follow parent pointers from x to the root, then write the root back into <code>parent[]</code> for every node on the path. The recursive form is two lines; the iterative form is a small loop with a second pass for compression. A common simplification is <em>path halving</em>: during the walk, set <code>parent[x] = parent[parent[x]]</code>, halving the path length without a second pass. Path halving is slightly less aggressive than full compression but achieves the same asymptotic bound and uses fewer instructions.
        </p>
        <p className="mb-4">
          <strong>union(x, y):</strong> compute <code>rx = find(x)</code> and <code>ry = find(y)</code>. If they&apos;re equal, the two were already in the same set — return false (this is exactly the &quot;would adding this edge create a cycle?&quot; check that Kruskal&apos;s needs). Otherwise, attach the lower-rank root under the higher-rank root. If ranks are equal, pick either, and increment the new root&apos;s rank by 1.
        </p>
        <p className="mb-4">
          The amortized analysis is one of the deepest results in data-structure theory. Tarjan&apos;s 1975 proof shows that any sequence of m operations on n elements takes O(m · α(n)) time when both optimizations are used. The lower bound matches: no pointer-machine implementation can do better. With only one of the two optimizations, the bound degrades to O(m log n) or worse.
        </p>
        <p>
          The structure does <strong>not</strong> support efficient set splitting or element removal. Once two elements are unified, no operation un-unifies them. This is a fundamental limitation: variants like &quot;link-cut trees&quot; or &quot;Euler-tour trees&quot; support both operations but at much higher constant cost. If you need to undo unions, either snapshot the parent array before each union (O(n) per snapshot) or use a more elaborate structure.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/disjoint-set-union-find-diagram-2.svg"
          alt="Union by rank attaching a rank-1 tree under a rank-2 tree resulting in no height growth and the smaller subtree absorbed"
          caption="Figure 2: Union by rank attaches the shorter tree under the taller root. Tree height grows only when ranks are equal — bounding height to O(log n) without compression, and O(α(n)) with it."
        />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Trade-offs & Comparisons</h2>
        <p className="mb-4">
          <strong>Union-find vs adjacency list + BFS.</strong> A static connected-components query on a graph runs in O(V + E) with BFS or DFS. Union-find shines in <em>incremental</em> settings: edges arrive one at a time, and you must answer connectivity queries between arrivals. Each edge becomes a union; each query becomes a find. The total cost is O((V + E) · α(V)) — essentially linear, but supporting arbitrary interleaving of updates and queries.
        </p>
        <p className="mb-4">
          <strong>Union-find vs hash-set-of-sets.</strong> A naive &quot;merge two sets&quot; operation by copying elements is O(min(|A|, |B|)) per merge. A union-find handles the same workload in O(α(n)) per operation. For incremental clustering on millions of items, this is the difference between hours and milliseconds.
        </p>
        <p className="mb-4">
          <strong>Path compression vs path halving vs path splitting.</strong> All three achieve O(α(n)) amortized. Path compression (two-pass) does the most work per find but produces the flattest tree. Path halving (single pass, set parent to grandparent) is faster per call. Path splitting is similar to halving but slightly different. In practice, path halving with union by rank is the standard production choice — it&apos;s simple, branch-free, and competitive with full compression.
        </p>
        <p className="mb-4">
          <strong>Union by rank vs union by size.</strong> Both bound tree height to O(log n) without compression. Union by size tracks the number of elements in each set and attaches the smaller under the larger; union by rank tracks an upper-bound on height. Union by size has the bonus of returning <code>|set(x)|</code> in O(1) — useful for percolation and clustering. Use whichever fits your query needs; the asymptotic guarantee is identical.
        </p>
        <p>
          <strong>Persistent / undoable union-find.</strong> The standard structure is destructive — past states are lost. For applications needing snapshotting (transaction rollback, time-traveling debuggers, search algorithms with backtracking), use a stack-based undo log: every parent or rank write pushes the old value, and undo restores it. This sacrifices path compression (or restricts it) but enables trivial rollback.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Always use both optimizations.</strong> Path compression alone gives O(log n); union by rank alone gives O(log n); both together give O(α(n)). Skipping either is a measurable performance regression.</li>
          <li><strong>Use integer ids, not arbitrary keys.</strong> Map your domain entities (URLs, UUIDs, pixel coordinates) to dense integers 0..n−1 on construction. The whole structure is two integer arrays — pointer-chasing through hash maps wrecks cache behavior.</li>
          <li><strong>Pre-allocate arrays.</strong> If you know n in advance, allocate <code>parent</code> and <code>rank</code> once. Dynamic growth (push to a TypedArray) is cheap but allocates GC pressure on tight loops.</li>
          <li><strong>Use Int32Array in JavaScript.</strong> A regular array of numbers in V8 boxes each value; an Int32Array stores raw 32-bit integers contiguously, dramatically reducing memory and improving cache hits.</li>
          <li><strong>Iterative find.</strong> Recursive find on a deep chain risks stack overflow on million-element graphs. Iterative form with a second pass for compression (or path halving in a single pass) is bulletproof.</li>
          <li><strong>Detect &quot;already unified&quot; early.</strong> In Kruskal&apos;s, check whether find(u) == find(v) before attempting to union — skipping redundant unions saves rank churn.</li>
          <li><strong>Track set count for completion.</strong> Maintain a separate counter of distinct sets, decremented on each successful union. Many algorithms (percolation, &quot;is the graph connected yet?&quot;) need this O(1) query.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Forgetting path compression.</strong> Without it, adversarial input produces O(n)-deep chains and find becomes linear. The asymptotic claim &quot;O(α(n))&quot; is wrong without both optimizations.</li>
          <li><strong>Union without finding first.</strong> Setting <code>parent[x] = y</code> directly when x or y is not a root corrupts the structure. Always union <em>roots</em>: <code>parent[find(x)] = find(y)</code>.</li>
          <li><strong>Off-by-one in rank updates.</strong> Increment the rank only when the two roots have <em>equal</em> rank — and only on the new root. Common bug: incrementing on every union, which makes union by rank no longer a valid height bound.</li>
          <li><strong>Recursive find on deep chains.</strong> A million-element chain blows the JavaScript call stack at ~10k frames. Use iterative find.</li>
          <li><strong>Mixing 0-indexed and 1-indexed elements.</strong> Initialize all n+1 slots if elements are 1-indexed, or keep careful translation. Off-by-one here corrupts the entire structure silently.</li>
          <li><strong>Trying to support split/delete.</strong> The structure does not support efficient un-union. If you need this, use link-cut trees (much more complex) or recompute from scratch.</li>
          <li><strong>Comparing parent[x] to x for equality of sets.</strong> Use find(x) == find(y), not direct parent comparison. Two elements in the same set can have different immediate parents — only the root is shared — so an immediate-parent comparison misses most same-set pairs.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>
        <p className="mb-4">
          <strong>Kruskal&apos;s minimum spanning tree.</strong> The textbook application. Sort all edges by weight; iterate in order; for each edge (u, v), call find(u) and find(v) — if they differ, the edge connects two components, so include it in the MST and union the sets. The total work is O(E log E) for the sort plus O(E · α(V)) for the union-find — essentially the sort dominates. Used in network design, hierarchical clustering, image segmentation.
        </p>
        <p className="mb-4">
          <strong>Connected components in dynamic graphs.</strong> Streaming systems that ingest edges and answer connectivity queries between arrivals — fraud detection (are these accounts in the same ring?), social network analysis (is the friend graph one component?), incremental graph databases. Each new edge is a union; each query is two finds. Constant-amortized per operation.
        </p>
        <p className="mb-4">
          <strong>Image segmentation and percolation.</strong> Pixel-level union-find merges adjacent same-color pixels into regions. Used in OpenCV&apos;s connected-components labeling, in geological percolation models (when does fluid reach the bottom?), and in physical simulations of ferromagnetism. The 2D grid maps directly to integer ids; union-find makes a million-pixel image practical.
        </p>
        <p className="mb-4">
          <strong>Type unification in compilers.</strong> ML-family type inference (Hindley-Milner) unifies type variables: when constraint solving determines that two type variables must be the same, they&apos;re unioned. Find returns the canonical type. The OCaml and Haskell type checkers have used union-find for unification since the 1980s.
        </p>
        <p>
          <strong>Tarjan&apos;s offline LCA and equivalence-class problems.</strong> Computing lowest common ancestors for a batch of queries on a static tree, or processing a stream of equivalence assertions in a theorem prover. Union-find is the engine behind these algorithms — the entire data flow is unions interleaved with finds.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/disjoint-set-union-find-diagram-3.svg"
          alt="Long parent chain before find call and the same chain flattened with all nodes pointing to the root after path compression"
          caption="Figure 3: Path compression rewrites every node on the find path to point directly at the root. The next find on any compressed node is a single hop."
        />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why is the amortized complexity O(α(n)) instead of O(log n) or O(1)?</p>
            <p className="mt-2 text-sm">A: With both union by rank and path compression, Tarjan&apos;s 1975 analysis proves the tight bound O(m · α(n)) for any sequence of m operations. The function α(n) is the inverse Ackermann — it grows so slowly that α(n) ≤ 4 for any n you can write down. It&apos;s not literally O(1) because there&apos;s a provable lower bound (Fredman-Saks 1989) showing no pointer-machine implementation can do better, but in practice it&apos;s indistinguishable from constant.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s the difference between union by rank and union by size?</p>
            <p className="mt-2 text-sm">A: Both bound tree height to O(log n) and have identical asymptotic behavior. Union by rank tracks an upper bound on each root&apos;s height; union by size tracks element count. Size has the bonus of returning |set(x)| in O(1), which is useful for percolation and clustering algorithms. Rank has slightly tighter bounds in pathological cases. Pick whichever fits your query needs.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you use union-find in Kruskal&apos;s algorithm?</p>
            <p className="mt-2 text-sm">A: Sort edges by weight ascending. Iterate edges in order; for each edge (u, v), call find(u) and find(v). If the roots differ, the edge connects two previously-separate components, so add it to the MST and union the sets. If the roots are equal, adding the edge would create a cycle — skip it. The MST is complete after V−1 edges have been added.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Can union-find efficiently support splitting a set?</p>
            <p className="mt-2 text-sm">A: No — that&apos;s a fundamental limitation. The destructive nature of union (parent pointers are overwritten) and path compression (history is destroyed) make undoing unions expensive. If you need split, use link-cut trees (Sleator-Tarjan) or Euler-tour trees, both of which support O(log n) link/cut at higher constant cost. Or for offline scenarios, snapshot the parent array.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What happens if you skip path compression?</p>
            <p className="mt-2 text-sm">A: With only union by rank, find is O(log n) worst case (because tree height is bounded by rank). Without union by rank but with path compression, the amortized bound is still O(log n). Only with both do you get O(α(n)). Skipping compression also degrades cache behavior because the tree never flattens — repeated finds traverse the same long chain.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you detect a cycle while building a graph incrementally?</p>
            <p className="mt-2 text-sm">A: For each new edge (u, v), check if find(u) == find(v). If yes, the edge would create a cycle — reject (or report). If no, union the sets and accept the edge. This is exactly Kruskal&apos;s cycle test, and it works for any incremental graph workload — schema validation, dependency resolution, transaction conflict detection.</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">References & Further Reading</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Tarjan — &quot;Efficiency of a Good But Not Linear Set Union Algorithm&quot; (JACM 1975), the canonical analysis</li>
          <li>Galler, Fischer — &quot;An Improved Equivalence Algorithm&quot; (CACM 1964), the original paper</li>
          <li>Cormen, Leiserson, Rivest, Stein — <em>Introduction to Algorithms</em>, Chapter 21 (Data Structures for Disjoint Sets)</li>
          <li>Sedgewick, Wayne — <em>Algorithms, 4th Edition</em>, Section 1.5 (Case Study: Union-Find)</li>
          <li>Fredman, Saks — &quot;The Cell Probe Complexity of Dynamic Data Structures&quot; (STOC 1989), the matching lower bound</li>
          <li>Tarjan, van Leeuwen — &quot;Worst-case Analysis of Set Union Algorithms&quot; (JACM 1984)</li>
          <li>Sleator, Tarjan — &quot;A Data Structure for Dynamic Trees&quot; (STOC 1981), link-cut trees for the splittable variant</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
