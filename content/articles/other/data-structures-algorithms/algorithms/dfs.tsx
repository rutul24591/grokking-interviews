"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "dfs",
  title: "Depth-First Search (DFS)",
  description:
    "DFS — recursive and iterative graph traversal, edge classification, three-color cycle detection, and applications in topological sort, SCC, articulation points, and backtracking.",
  category: "other",
  subcategory: "algorithms",
  slug: "dfs",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-20",
  tags: ["dfs", "graph-traversal", "cycle-detection", "topological-sort"],
  relatedTopics: ["bfs", "topological-sort", "tarjans-scc"],
};

export default function DFSArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p className="mb-4">
          <span className="font-semibold">Depth-first search (DFS)</span> is a graph
          traversal that explores as deeply as possible before backtracking. From a
          source vertex it descends to a child, recurses into its descendants, and only
          when no unvisited neighbor remains does it return and try the next sibling.
          Implemented with recursion (implicit stack) or an explicit stack.
        </p>
        <p className="mb-4">
          DFS predates BFS in formal study (Trémaux's 1882 maze-solving rules) and was
          formalized for general graphs by Tarjan in the early 1970s. It runs in O(V +
          E) time and O(depth) space, and it's the algorithmic spine of cycle detection,
          topological sort, strongly connected components, articulation points / bridges,
          and Eulerian path algorithms.
        </p>
        <p className="mb-4">
          Interview ubiquity is unmatched: DFS is the answer to almost every "structural"
          graph question. Staff/principal rounds focus on edge classification, three-
          color marking for cycle detection, and DFS-based linear-time SCC algorithms
          (Tarjan, Kosaraju).
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/dfs-diagram-1.svg"
          alt="DFS recursive and iterative algorithms with edge classification"
          caption="Recursive and iterative DFS skeletons; the four edge classes (tree, back, forward, cross) and how pre/post timestamps distinguish them."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <p className="mb-4">
          <span className="font-semibold">Recursive DFS.</span> Mark u visited, iterate
          u's neighbors, recurse into each unvisited one. Implicit call stack tracks the
          current path. Cleanest for problems requiring pre/post hooks (timestamps,
          backtracking).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Iterative DFS.</span> Explicit stack. Push
          source. Loop: pop u, for each unvisited neighbor v, mark and push. Use
          iterative when recursion depth would overflow (Python default 1000, JVM stack
          ~10k frames).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Pre and post timestamps.</span> Maintain a
          global clock; record pre[u] when DFS enters u, post[u] when it returns. The
          interval [pre[u], post[u]] is u's "lifetime" on the stack; it strictly
          contains the lifetimes of u's descendants (parenthesis property).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Edge classification.</span> In a directed
          graph, every edge (u, v) is one of four types based on color/timestamp of v
          when explored from u: <em>tree</em> (v unvisited), <em>back</em> (v on stack —
          ancestor), <em>forward</em> (v finished but a descendant), <em>cross</em> (v
          finished, in another subtree). Undirected DFS produces only tree and back
          edges.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Cycle detection — three colors.</span> White =
          unvisited; gray = on current DFS stack; black = finished. A directed cycle
          exists iff DFS encounters a gray neighbor (back edge). Undirected: ignore the
          edge to parent; any other visited neighbor is a cycle.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Topological sort.</span> On a DAG, reverse
          post-order is a topological order. Push u onto a stack on post; popping yields
          dependents-before-dependencies. Linear time O(V + E).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Connected components / SCC.</span> Outer loop:
          for each unvisited vertex, DFS to label its component. For SCC in directed
          graphs, Tarjan's single-DFS (low-link values) or Kosaraju's double-DFS (on
          original then transpose).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Articulation points &amp; bridges.</span>{" "}
          Compute low[u] = min(pre[u], pre[v] over back edges, low[w] over tree-children
          w). u is articulation iff it's root with ≥ 2 tree children, or any tree child
          w has low[w] ≥ pre[u]. Edge (u, w) is bridge iff low[w] &gt; pre[u].
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/dfs-diagram-2.svg"
          alt="DFS applications and three-color cycle detection"
          caption="DFS-derived algorithms (topological sort, SCC, articulation points) and the canonical three-color cycle-detection pattern."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p className="mb-4">
          <span className="font-semibold">Adjacency list iteration.</span> Each vertex's
          neighbors visited once across all of DFS. Total edge work O(E); total vertex
          work O(V); combined O(V + E).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Recursion vs iteration trade-off.</span>{" "}
          Recursion is cleaner but limited by language stack. For 10⁶+ vertex graphs in
          Python, convert to iterative or raise the limit. JVM's stack is configurable
          (-Xss) but each frame costs memory.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Iterative DFS with post-action.</span>{" "}
          Re-pushing the vertex after children (with a "done" flag) preserves the post-
          order semantics needed for topological sort and SCC. Or push (u, iter) tuples
          and resume the iterator.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Recursion-aware optimizations.</span> Tail-call
          elimination doesn't apply (DFS isn't tail recursive due to the loop). LIFO
          ordering is preserved by stack semantics; for FIFO, use BFS.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Parallel DFS.</span> Notoriously hard — the
          tree shape isn't known in advance, and edge classification depends on
          discovery order. Pseudo-DFS with work-stealing is approximate; rigorous
          parallel DFS is an open research area.
        </p>
        <p className="mb-4">
          <span className="font-semibold">External-memory DFS.</span> Worst-case bad
          (every vertex potentially in a different page); algorithms like Buchsbaum et
          al.'s subgraph-cycle approach trade exactness for I/O efficiency.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <p className="mb-4">
          <span className="font-semibold">DFS vs BFS.</span> DFS for structure (cycles,
          SCC, top-sort, articulation), BFS for distance (shortest path, levels). Both
          O(V + E). Memory: DFS = O(depth), BFS = O(V) frontier.
        </p>
        <p className="mb-4">
          <span className="font-semibold">DFS vs Dijkstra.</span> DFS is unweighted /
          structural; Dijkstra weighted shortest paths. Different problems.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Recursive vs iterative DFS.</span> Recursive
          easier to write, prone to stack overflow on deep graphs. Iterative robust but
          requires explicit state.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Tarjan SCC vs Kosaraju SCC.</span> Tarjan: one
          DFS pass, low-link bookkeeping, slightly faster. Kosaraju: two DFS passes (on
          G and Gᵀ), simpler to implement and prove correct.
        </p>
        <p className="mb-4">
          <span className="font-semibold">DFS for shortest path?</span> No — DFS doesn't
          guarantee shortest first. Use BFS or Dijkstra.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <p className="mb-4">
          <span className="font-semibold">Mark visited on entry.</span> Same as BFS —
          marking late causes redundant recursion.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Use iterative DFS for deep graphs.</span> If V
          ≥ 10⁵ and the graph could be a long chain, recursion will overflow.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Track pre/post times when needed.</span> Even
          if the immediate problem doesn't require them, knowing where you'd add them
          clarifies thinking.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Use three-color marking for directed cycle
          detection.</span> Two-color visited misses forward/cross edges as false
          positives.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Re-seed from each unvisited vertex.</span>{" "}
          Otherwise DFS misses disconnected components.
        </p>
        <p className="mb-4">
          <span className="font-semibold">In iterative DFS, push neighbors in reverse to
          mimic recursive order.</span> Helps when expected output depends on neighbor
          iteration sequence.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <p className="mb-4">
          <span className="font-semibold">Stack overflow on long chain.</span> 10⁶
          vertices in a path graph break recursion in Python and many JVM defaults.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Two-color visited for directed cycle.</span>{" "}
          False positives from forward edges. Use white/gray/black.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Treating undirected back-to-parent as a
          cycle.</span> Every undirected DFS revisits the parent on its outbound edge;
          guard against this.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Forgetting to handle disconnected
          graphs.</span> One DFS misses components.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Wrong topological order.</span> Post-order is
          NOT topological; <em>reverse</em> post-order is.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Mutating adjacency lists during DFS.</span>{" "}
          Iterators may invalidate. Snapshot or use index-based iteration.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Mixing visited and "on stack" states.</span>{" "}
          For SCC and cycle detection these are different bits — keep them separate.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <p className="mb-4">
          <span className="font-semibold">Build systems.</span> Bazel, Buck, Gradle, Make
          topologically sort their dependency DAGs via DFS post-order and detect circular
          dependencies via gray-color back edges.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Module loaders / linkers.</span> Node.js,
          webpack, ES module loaders run DFS over the import graph. Circular imports are
          flagged via cycle detection during load.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Compilers.</span> Control-flow graph dominator
          trees (Lengauer–Tarjan), Tarjan's SCC for natural-loop detection, and
          articulation/bridge analysis for unreachable-code identification — all DFS.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Filesystem &amp; package walkers.</span>{" "}
          <code>find</code>, <code>du</code>, <code>ripgrep</code>, <code>npm install</code>{" "}
          recurse into directories with DFS — natural fit for hierarchical data.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Static analyzers.</span> Data-flow analysis
          tools (CodeQL, Coverity) compute SCCs of the call graph to identify recursion
          clusters; DFS underlies fixed-point iteration order.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Game-tree search.</span> Minimax, alpha-beta
          pruning, MCTS rollouts all use DFS over the game-state graph with custom
          backtracking and memoization.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/dfs-diagram-3.svg"
          alt="DFS in production"
          caption="Production applications of DFS and the DFS-vs-BFS picking guide."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <p className="mb-4">
          <span className="font-semibold">"Detect cycle in directed graph."</span> Three-
          color DFS; back edge ⇒ cycle.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"Topological order of a DAG."</span> DFS, push
          on post, return reversed stack.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"Number of connected components."</span> Outer
          loop, count DFS calls from unvisited vertices.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"Course schedule — can you finish all?"</span>{" "}
          Cycle detection on directed graph of prereqs.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"All paths from source to target."</span> DFS
          with backtracking, accumulating path.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"Articulation points."</span> Tarjan's low-
          link DFS; report u when low[child] ≥ pre[u].
        </p>
        <p className="mb-4">
          <span className="font-semibold">"Why DFS over BFS for SCC?"</span> SCC
          algorithms exploit the fact that strongly connected vertices share a DFS
          subtree under the right post-order; BFS doesn't expose this structure.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <p className="mb-4">
          Tarjan, "Depth-first search and linear graph algorithms" (SIAM J. Comput.,
          1972). CLRS chapters 22–23. Hopcroft &amp; Tarjan's articulation/bridge work.
          Sedgewick, <em>Algorithms in C++</em>, graph chapters. Kosaraju's unpublished
          but well-known SCC variant. For build-system DFS, the Bazel and Buck
          documentation. For compiler use, Cooper &amp; Torczon, <em>Engineering a
          Compiler</em>.
        </p>
      </section>
    </ArticleLayout>
  );
}
