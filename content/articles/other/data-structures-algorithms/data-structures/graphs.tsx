"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "graphs",
  title: "Graphs",
  description: "Vertices, edges, and the algorithms that exploit them — adjacency representations, traversal, shortest paths, and the engineering trade-offs behind real-world graph systems.",
  category: "other",
  subcategory: "data-structures",
  slug: "graphs",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-04-18",
  tags: ["graphs", "bfs", "dfs", "dijkstra", "adjacency-list", "data-structures"],
  relatedTopics: ["trees", "hash-tables", "queues", "stacks"],
};

export default function GraphsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition & Context</h2>
        <p className="mb-4">
          A graph G = (V, E) is a set of vertices V and a set of edges E ⊆ V × V connecting them. It is the most general relational structure in computing — every other linked structure (tree, linked list, DAG, state machine) is a constrained graph. Edges may be directed or undirected, weighted or unweighted, and the same pair of vertices may permit multiple edges (multigraph) or self-loops.
        </p>
        <p className="mb-4">
          Graph theory predates computing by two centuries — Euler&apos;s 1736 solution to the Königsberg bridges problem is generally cited as its founding result. But the structure became central to systems engineering when problems started to scale: PageRank reduces to an eigenvector computation on a 100-billion-edge web graph; Facebook&apos;s social graph drives feed ranking; Git is a DAG of commits; Kubernetes scheduling reasons about a constraint graph; React&apos;s reconciler walks a fiber tree (a DAG with parent pointers).
        </p>
        <p>
          What makes graphs hard isn&apos;t the abstract definition — it&apos;s that the choice of <em>representation</em> dominates everything. A 1-billion-vertex graph stored as an adjacency matrix needs an exabyte; the same graph as an adjacency list fits in a few hundred GB. A staff engineer&apos;s job is rarely to invent a new graph algorithm — it&apos;s to pick the right representation, prove the operation is O(V + E) instead of O(V²), and recognize when a problem reduces to BFS or topological sort.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>
        <p className="mb-4">
          Three independent dimensions classify graphs. <strong>Direction:</strong> undirected edges are symmetric (Facebook friendship); directed edges are not (Twitter follow, build dependency). <strong>Weight:</strong> unweighted edges only encode connectivity; weighted edges carry cost, distance, capacity, or probability. <strong>Acyclicity:</strong> a graph with no cycles permits topological ordering and dynamic programming over vertices; a graph with cycles requires explicit visited tracking.
        </p>
        <p className="mb-4">
          Vertex <em>degree</em> is the number of incident edges. In directed graphs, in-degree and out-degree are tracked separately. The <em>density</em> |E|/|V|² distinguishes sparse graphs (most real-world graphs — social, web, road) from dense ones (cliques, complete bipartite). Sparse graphs admit O(V + E) algorithms; dense graphs collapse that to O(V²), which often makes matrix representations competitive.
        </p>
        <p className="mb-4">
          A <em>path</em> is a sequence of vertices connected by edges. A <em>cycle</em> is a path that returns to its start. <em>Connectivity</em> in undirected graphs partitions vertices into connected components; in directed graphs, the corresponding notion is strongly connected components (every vertex reachable from every other within the SCC). A <em>tree</em> is a connected acyclic undirected graph; a <em>forest</em> is a disjoint union of trees; a <em>DAG</em> is a directed acyclic graph.
        </p>
        <p>
          The most important invariant for traversal is <strong>visited tracking</strong>. Without it, any cycle in the graph causes infinite recursion. The visited set is typically a hash set or bit array indexed by vertex id; choosing between them depends on whether vertices are dense integer ids (bit array, O(1) per check, cache-friendly) or arbitrary keys (hash set, O(1) amortized but with overhead).
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/graphs-diagram-1.svg"
          alt="Three graph variants — undirected, directed, weighted — drawn on the same triangle of three vertices, with edge semantics annotated"
          caption="Figure 1: Edge semantics determine which algorithms apply. The same three vertices form three fundamentally different graphs depending on direction and weight."
        />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture & Flow</h2>
        <p className="mb-4">
          The two canonical representations are <strong>adjacency list</strong> and <strong>adjacency matrix</strong>. Adjacency list stores, for each vertex, the collection of its neighbors — typically a per-vertex array (or hash set, if edge-existence checks dominate). Total space is O(V + E). Iterating the neighbors of v is O(deg(v)); checking whether edge (u, v) exists is O(deg(u)) unless neighbors are stored in a hash set.
        </p>
        <p className="mb-4">
          Adjacency matrix is a V × V boolean (or numeric, if weighted) matrix where M[u][v] indicates whether the edge exists. Edge-existence is O(1); iterating neighbors is O(V) — always, even if the vertex has only one neighbor. Space is O(V²), which is fine for V ≈ 1000 but ruinous beyond. For dense graphs or matrix-algebra algorithms (PageRank, Floyd-Warshall, transitive closure), the matrix wins on both space and runtime.
        </p>
        <p className="mb-4">
          A third option, <strong>compressed sparse row (CSR)</strong>, packs the adjacency list into two flat arrays: a column-index array containing all neighbors concatenated, and a row-pointer array indicating where each vertex&apos;s neighbors begin. CSR is the format used by NetworkX, igraph, and most high-performance graph libraries because the contiguous layout maximizes cache hits during traversal. The trade-off: CSR is read-optimized; mutating the graph requires rebuilding both arrays.
        </p>
        <p className="mb-4">
          <strong>Edge list</strong> is the simplest representation: a flat array of (u, v, w) triples. It&apos;s a poor structure for traversal but ideal for algorithms that process all edges in a global order — Kruskal&apos;s MST sorts the edge list by weight, then iterates linearly with a union-find.
        </p>
        <p>
          The choice of representation interacts with algorithm complexity in subtle ways. BFS and DFS run in O(V + E) on adjacency lists but degrade to O(V²) on matrices because neighbor iteration is O(V) per vertex regardless of degree. Conversely, Floyd-Warshall&apos;s all-pairs shortest path is O(V³) and assumes O(1) edge lookups — the matrix is the natural fit.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/graphs-diagram-2.svg"
          alt="The same five-vertex graph rendered as adjacency list and as adjacency matrix side by side, showing the storage trade-offs"
          caption="Figure 2: Adjacency list (O(V+E), neighbor iteration in O(deg)) vs adjacency matrix (O(V²), O(1) edge lookup). For sparse graphs the list wins by orders of magnitude."
        />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Trade-offs & Comparisons</h2>
        <p className="mb-4">
          The two foundational traversals — <strong>BFS</strong> and <strong>DFS</strong> — both run in O(V + E), but explore in fundamentally different orders. BFS uses a queue and visits vertices in order of distance from the source, which is exactly why it solves single-source shortest path on unweighted graphs. DFS uses a stack (or recursion) and dives as deep as possible before backtracking, which is what enables topological sort, cycle detection, and SCC algorithms.
        </p>
        <p className="mb-4">
          For weighted shortest path, the algorithm depends on edge sign. <strong>Dijkstra</strong> handles non-negative weights in O((V + E) log V) using a binary heap, or O(E + V log V) with a Fibonacci heap. <strong>Bellman-Ford</strong> handles negative weights (and detects negative cycles) in O(V·E). <strong>A*</strong> adds a heuristic to Dijkstra for goal-directed search — used in maps, games, and planning. <strong>Floyd-Warshall</strong> computes all-pairs shortest paths in O(V³) — viable for V ≤ ~500.
        </p>
        <p className="mb-4">
          For <strong>minimum spanning tree</strong>, Kruskal&apos;s algorithm sorts edges and uses union-find in O(E log E); Prim&apos;s grows a tree from a seed using a heap in O((V + E) log V). Both produce the same total weight on a connected graph. <strong>Topological sort</strong> on a DAG is O(V + E) via DFS post-order or Kahn&apos;s algorithm (repeatedly remove zero-in-degree vertices).
        </p>
        <p className="mb-4">
          <strong>Trees vs graphs:</strong> a tree is a graph with V − 1 edges and no cycles, which means many algorithms simplify dramatically — no visited tracking needed (parent pointer suffices), traversal complexity drops constants, and dynamic programming over the tree structure is straightforward. If a problem can be modeled as a tree instead of a general graph, do so.
        </p>
        <p>
          <strong>Property graphs vs RDF:</strong> two database paradigms. Property graphs (Neo4j, JanusGraph) attach key-value properties to vertices and edges; RDF stores triples (subject, predicate, object). Property graphs are more ergonomic for application code; RDF is the W3C standard for the semantic web and supports formal reasoning (SPARQL, OWL inference).
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Default to adjacency list.</strong> Unless your graph is dense or you need O(1) edge lookups for a matrix algorithm, the adjacency list is correct. Most real-world graphs are sparse.</li>
          <li><strong>Use integer vertex ids.</strong> Map domain identifiers (UUIDs, URLs) to dense integer ids on graph construction. This lets you use bit arrays for visited tracking and typed arrays for adjacency, dramatically improving cache behavior.</li>
          <li><strong>Pick the right traversal.</strong> BFS for shortest hops, DFS for cycle detection / topo sort / SCC, Dijkstra for non-negative weights, Bellman-Ford only if negatives are possible. Don&apos;t reach for Dijkstra when BFS suffices.</li>
          <li><strong>Use iterative DFS for deep graphs.</strong> Recursive DFS overflows the call stack on graphs deeper than a few thousand vertices. Use an explicit stack with simulated frame state for production code.</li>
          <li><strong>Detect cycles early.</strong> If your graph should be a DAG (build dependencies, schema migrations), validate acyclicity at ingestion via topological sort. Cycles caught at the source are easier to debug than cycles caught at runtime.</li>
          <li><strong>Bidirectional search for long shortest paths.</strong> When source and target are far apart in a large graph, run BFS from both ends simultaneously. The frontiers meet in O(b^(d/2)) instead of O(b^d), where b is branching factor.</li>
          <li><strong>Cache the graph in the right shape for the workload.</strong> Read-heavy systems should precompute and store the CSR layout. Write-heavy systems may need a dynamic adjacency-list-of-hash-sets to support edge deletion in O(1).</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Forgetting visited tracking.</strong> The most common bug in graph code. Without a visited set, any cycle creates infinite recursion. Even DAGs need it if vertices are reachable via multiple paths.</li>
          <li><strong>Using DFS for shortest path.</strong> DFS does not produce shortest paths in unweighted graphs — it returns the first path it happens to find. Use BFS.</li>
          <li><strong>Dijkstra with negative weights.</strong> Dijkstra&apos;s correctness proof relies on non-negative weights — once a vertex is popped from the heap, its distance is final. Negative edges can invalidate already-finalized distances. Use Bellman-Ford instead, or transform weights if possible.</li>
          <li><strong>Storing edges as (u, v) tuples without indexing.</strong> If you need to query &quot;neighbors of v&quot;, an unindexed edge list forces O(E) scans per query. Build an adjacency list once.</li>
          <li><strong>Recursion depth on deep DFS.</strong> JavaScript&apos;s default stack is ~10k frames; deep dependency graphs (compiler IR, large file trees) exceed this. Convert to iterative DFS.</li>
          <li><strong>Adjacency matrix for sparse graphs.</strong> A 100k-vertex sparse graph as a matrix is 10GB; as a list it&apos;s typically a few MB. The matrix kills you on both memory and traversal time.</li>
          <li><strong>Mutating the graph during traversal.</strong> Adding or removing edges mid-BFS/DFS often corrupts the visited invariant. Snapshot or queue the mutation for after traversal.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>
        <p className="mb-4">
          <strong>Social networks.</strong> Facebook, LinkedIn, and Twitter store the social graph as a partitioned adjacency list across thousands of machines. Friend-of-friend queries are 2-hop BFS; PageRank-style relevance scoring runs as iterative matrix-vector multiplication on the edge graph. Facebook&apos;s TAO is essentially a distributed graph cache layered on top of MySQL.
        </p>
        <p className="mb-4">
          <strong>Maps and routing.</strong> Google Maps, Waze, and OpenStreetMap model the road network as a weighted directed graph (one-way streets, turn restrictions). Routing uses contraction hierarchies — a precomputed shortcut graph that lets bidirectional Dijkstra find continental-scale routes in milliseconds. The classical Dijkstra would take seconds on a graph with 100M nodes.
        </p>
        <p className="mb-4">
          <strong>Build systems and package managers.</strong> npm, Bazel, Make, Webpack, and Gradle all model the build as a DAG of files/modules. Topological sort produces the build order; cycle detection rejects circular dependencies; incremental builds prune the DAG to the affected subgraph. Webpack&apos;s module graph is the canonical example in the JavaScript ecosystem.
        </p>
        <p className="mb-4">
          <strong>React and virtual DOM.</strong> The React fiber tree is a graph (with parent pointers and sibling pointers). Reconciliation is a tree-diff that walks both trees in lockstep. Concurrent mode adds work-in-progress trees, making the in-flight reconciler a small DAG.
        </p>
        <p>
          <strong>Knowledge graphs and recommendations.</strong> Google&apos;s Knowledge Graph, Amazon&apos;s product graph, and Netflix&apos;s recommendation graph are massive labeled property graphs. Random-walk algorithms (Personalized PageRank, node2vec) generate embeddings used downstream by ranking models. The graph itself is often stored in custom systems rather than a graph database, because the access pattern is so specialized.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/graphs-diagram-3.svg"
          alt="BFS and DFS traversal of the same six-vertex graph showing different visit orders driven by FIFO versus LIFO frontier discipline"
          caption="Figure 3: BFS uses a queue and explores level-by-level; DFS uses a stack and dives deep. Same graph, same start node, different visit orders."
        />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When would you choose an adjacency matrix over an adjacency list?</p>
            <p className="mt-2 text-sm">A: When the graph is dense (E ≈ V²), when you need O(1) edge-existence lookups in the hot path, or when you&apos;re running matrix-algebra algorithms like PageRank or Floyd-Warshall. For typical sparse graphs (social, web, road), the matrix is wasteful — both in space (O(V²)) and traversal time (neighbor iteration is O(V) instead of O(deg(v))).</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why doesn&apos;t Dijkstra work with negative edge weights?</p>
            <p className="mt-2 text-sm">A: Dijkstra greedily finalizes the closest unvisited vertex, assuming its distance can never improve. Negative edges break that assumption — a longer path through a negative edge could become shorter than the supposedly final distance. Use Bellman-Ford (O(V·E)) when negative weights are possible; it also detects negative cycles.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you detect a cycle in a directed graph?</p>
            <p className="mt-2 text-sm">A: DFS with three states per vertex: unvisited, in-progress (on the recursion stack), and done. A back-edge to an in-progress vertex indicates a cycle. The two-color (visited / unvisited) scheme that works for undirected graphs is insufficient — directed graphs can revisit a done vertex via a different path without that being a cycle.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s the difference between BFS and Dijkstra?</p>
            <p className="mt-2 text-sm">A: BFS is Dijkstra restricted to unit weights — the FIFO queue happens to dequeue vertices in distance order because every edge advances distance by exactly 1. Dijkstra generalizes this with a priority queue keyed by accumulated distance. If your edges are all unit weight, BFS is faster (O(V+E) vs O((V+E) log V)) and simpler.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you find the shortest path in a maze?</p>
            <p className="mt-2 text-sm">A: Model the maze as an unweighted graph (cells = vertices, valid moves = edges) and run BFS from the start. The first time you reach the exit, the path length is optimal. For very large mazes, A* with Manhattan distance as heuristic can be 10–100× faster by guiding the search toward the goal.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle a graph that doesn&apos;t fit in memory?</p>
            <p className="mt-2 text-sm">A: Several options depending on workload. Partition the graph across machines (Pregel/Giraph model: vertex-centric computation with message passing). Use a graph database with disk-resident indexes (Neo4j, JanusGraph). For one-shot analytics, stream-process with semi-external algorithms — keep vertex data in RAM, edges on disk, and use sequential scans. Compressed representations (CSR with delta encoding) can also push the in-memory limit by 5–10×.</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">References & Further Reading</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Cormen, Leiserson, Rivest, Stein — <em>Introduction to Algorithms</em> (CLRS), Part VI: Graph Algorithms</li>
          <li>Sedgewick, Wayne — <em>Algorithms, 4th Edition</em>, Chapters 4.1–4.5 (Graphs)</li>
          <li>Tarjan — &quot;Depth-first search and linear graph algorithms&quot; (1972), the foundational SCC paper</li>
          <li>Dijkstra — &quot;A note on two problems in connexion with graphs&quot; (1959), the original shortest-path paper</li>
          <li>Page, Brin, Motwani, Winograd — &quot;The PageRank Citation Ranking&quot; (1999)</li>
          <li>Malewicz et al. — &quot;Pregel: A System for Large-Scale Graph Processing&quot; (Google, 2010)</li>
          <li>Bronson et al. — &quot;TAO: Facebook&apos;s Distributed Data Store for the Social Graph&quot; (USENIX ATC 2013)</li>
          <li>Geisberger, Sanders, Schultes, Delling — &quot;Contraction Hierarchies&quot; (2008), the algorithm behind modern map routing</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
