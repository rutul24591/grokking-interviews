"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "prims-mst",
  title: "Prim's Minimum Spanning Tree",
  description:
    "Frontier-based MST construction with a min-heap — grow the tree by always pulling the cheapest crossing edge. Cut-property correctness, dense-graph wins, and how it relates to Dijkstra.",
  category: "other",
  subcategory: "algorithms",
  slug: "prims-mst",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-20",
  tags: [
    "prim",
    "minimum-spanning-tree",
    "mst",
    "priority-queue",
    "greedy",
    "graph",
  ],
  relatedTopics: [
    "kruskals-mst",
    "dijkstra",
    "heap",
    "graph",
    "greedy-fundamentals",
  ],
};

export default function PrimsMSTArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p>
          Prim's algorithm finds a minimum spanning tree (MST) of a connected,
          undirected, weighted graph by growing a single tree outward from an
          arbitrary starting vertex. At each step it adds the lightest edge
          that connects the partial tree to a vertex not yet in the tree.
          With a binary-heap priority queue, the algorithm runs in O((V + E)
          log V); with an array-scan implementation, it runs in O(V²) and
          wins on dense graphs; with a Fibonacci heap, the asymptotic bound
          drops to O(E + V log V) at the cost of large constants.
        </p>
        <p>
          The algorithm has a tangled attribution. Vojtěch Jarník described
          it in 1930 in Czech, and it's sometimes called Jarník's algorithm
          in Eastern European literature. Robert Prim independently
          rediscovered it in 1957, and Edsger Dijkstra published it again
          in 1959 — three independent inventions of the same simple idea.
          Modern textbooks credit Prim, occasionally Jarník-Prim or
          Prim-Jarník-Dijkstra.
        </p>
        <p>
          Prim is the natural counterpart to Kruskal in the MST family. Both
          are greedy, both run in roughly O(E log V), and both produce an
          optimal spanning tree. The difference is operational: Kruskal sorts
          edges globally and merges components via union-find, naturally
          producing a forest until the final union; Prim grows one tree from
          a root, naturally producing a connected sub-tree at every step. On
          dense graphs with adjacency-matrix representations, Prim's
          O(V²) variant beats Kruskal's O(V² log V). On sparse graphs they
          tie; in distributed and parallel settings, Borůvka beats both.
        </p>
        <p>
          Prim's algorithm is structurally identical to Dijkstra's. Both
          maintain a min-priority queue keyed by the cost to reach the next
          vertex; the only difference is the relaxation rule. Dijkstra
          relaxes <code>key[v] = min(key[v], dist[u] + w(u, v))</code>{" "}
          — accumulating path length from the source. Prim relaxes{" "}
          <code>key[v] = min(key[v], w(u, v))</code> — just the edge weight
          to v from any in-tree vertex. The same implementation skeleton
          works for both with a one-line change.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/prims-mst-diagram-1.svg"
          alt="Prim's heap-based algorithm and complexity"
          caption="The heap-based skeleton — relax neighbors with edge weight (not dist + weight) — and the family of priority-queue tradeoffs."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <p>
          The algorithm maintains three pieces of state: a boolean{" "}
          <code>in_mst[v]</code>, a key value <code>key[v]</code> (the
          minimum weight of any edge from an in-tree vertex to v), and a
          parent pointer <code>parent[v]</code> recording which in-tree
          vertex the lightest crossing edge comes from. Initialize{" "}
          <code>key[start] = 0</code>, all others to infinity. Repeatedly
          pull the vertex with smallest key from the priority queue, add it
          to the MST, and relax its outgoing edges: for each neighbor v not
          yet in MST, if w(u, v) &lt; key[v], update key[v] and parent[v].
        </p>
        <p>
          The correctness comes from the cut property. At every step the
          MST-so-far T forms a cut: the partition (T, V \ T). The lightest
          edge crossing this cut is in some MST (cut property), so adding
          it preserves the MST invariant. The vertex that pops out of the
          priority queue is exactly the endpoint of that lightest crossing
          edge, by construction. So Prim's algorithm always extends the
          partial MST with an edge that's in some MST; after V-1 steps,
          the result is a complete MST.
        </p>
        <p>
          The proof is by induction on the number of vertices in the
          partial tree. Base case: a single-vertex tree is trivially in
          some MST. Inductive step: assume T (a partial tree) is contained
          in some MST T*. Prim adds the lightest edge e crossing the cut
          (T, V \ T). If e is in T*, done. If not, T* + e forms a cycle;
          some other edge e' on that cycle also crosses the cut. Since e
          is the lightest crossing, weight(e) ≤ weight(e'); swapping e for
          e' gives a spanning tree no heavier than T*, hence still an MST,
          and now containing T + {"{"}e{"}"}.
        </p>
        <p>
          <strong>Lazy vs eager priority queue.</strong> Lazy: push
          (key[v], v) every time you relax v; on pop, skip if v is already
          in MST. Heap can grow to O(E). Eager: maintain a position map
          and call decrease-key. Heap stays at V entries. Lazy is simpler
          and dominant; eager is faster on dense graphs and on memory-
          constrained workloads. Same tradeoff as Dijkstra.
        </p>
        <p>
          <strong>Array variant for dense graphs.</strong> If E = Θ(V²),
          forget the heap. Maintain a key array; in each of V iterations,
          linear-scan to find the unvisited vertex with smallest key,
          mark it in_mst, then update keys of neighbors. Total O(V²) for
          the scans plus O(E) = O(V²) for the relaxations. On graphs with
          dense matrix representation this beats heap-based Prim.
        </p>
        <p>
          <strong>Maximum spanning tree.</strong> Same algorithm, max-heap
          and reverse the relaxation. Useful in correlation graphs and
          influence networks where higher edge weight = stronger link.
        </p>
        <p>
          <strong>MST is generally not unique.</strong> When edge weights
          tie, the tree structure depends on tie-breaking. The total
          weight is unique. Canonicalize ties (vertex id, edge id) for
          deterministic output across runs.
        </p>
        <p>
          <strong>Disconnected graphs.</strong> Prim grows one tree from
          one start vertex; if the graph isn't connected, the output
          spans only one component. To get a minimum spanning forest,
          either run Prim from each unvisited vertex or use Kruskal,
          which naturally handles forests.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p>
          The data structures are an adjacency list (or matrix for the
          dense variant), a key array, an in_mst boolean array, a parent
          array, and a priority queue. Memory is O(V + E) for adjacency
          plus O(V) for the per-vertex state. Initialize, push the start
          vertex, loop until V vertices are in the MST or the heap is
          empty.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/prims-mst-diagram-2.svg"
          alt="Prim vs Kruskal side-by-side and cut property"
          caption="Side-by-side comparison with Kruskal and the cut-property proof of correctness — Prim is the cut-property algorithm; Kruskal is the cycle-property dual."
        />
        <p>
          For dense graphs, the array-scan variant has noticeably better
          cache behavior than heap-based Prim. The inner loop is a single
          read-update-compare on contiguous memory, friendly to SIMD and
          to compilers. On a graph with V = 1000 and E = 10⁵, array Prim
          finishes in microseconds; heap Prim pays log overhead on every
          relaxation.
        </p>
        <p>
          For implicit graphs — where edges are computed on demand rather
          than stored — Prim is the natural choice. Examples: geometric
          MST on a point set (compute edge weight from coordinates as
          needed), k-nearest-neighbor graph MST (only consider neighbors
          in the k-NN structure), MST on a function-defined cost surface.
          Kruskal would have to materialize all edges to sort them; Prim
          only needs neighbor enumeration from the current frontier.
        </p>
        <p>
          For broadcast trees in mesh networks, Prim grows from a
          designated root, mirroring the conceptual "root broadcasts to
          all other nodes via cheapest links." The MST gives the minimum
          total link cost; the root's children are the first hop. If the
          root is fixed (server, gateway), Prim is the obvious algorithm.
        </p>
        <p>
          For visualization (educational tools, dynamic-graph UIs), Prim's
          frontier expansion is intuitive to animate: a tree grows
          outward, frontier edges blink, the lightest blinking edge is
          accepted. Kruskal's "global pick" is harder to visualize
          because its decisions are non-local.
        </p>
        <p>
          For Euclidean MST on point sets, the trick is to compute the
          Delaunay triangulation first (O(N log N) on points in 2D),
          which contains the EMST as a sub-graph. Run Prim on the O(N)
          edges of the triangulation. Total O(N log N) for the EMST,
          much better than running Prim on all O(N²) pairwise distances.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <p>
          <strong>Prim vs Kruskal (sparse).</strong> Both O(E log V); a
          wash. Pick by problem shape: Prim if you have an adjacency-list
          and a designated start vertex, Kruskal if you have an edge list
          and want global processing. Both work fine for sparse graphs.
        </p>
        <p>
          <strong>Prim vs Kruskal (dense).</strong> Array-scan Prim is
          O(V²); Kruskal needs to sort O(V²) edges in O(V² log V). Prim
          wins for E ≈ V². The crossover happens around E ≈ V² / log V.
        </p>
        <p>
          <strong>Prim vs Kruskal (online edge stream).</strong> Kruskal
          processes edges in weight order; if the stream is sorted (or
          easily sortable), Kruskal is natural. Prim needs a frontier and
          adjacency lookup, awkward in pure-stream settings.
        </p>
        <p>
          <strong>Prim vs Kruskal (distributed).</strong> Neither is
          great. Kruskal's global sort is hard to distribute; Prim's
          single-tree growth doesn't parallelize. Borůvka, which contracts
          components in parallel waves, is the standard distributed-MST
          algorithm.
        </p>
        <p>
          <strong>Prim vs Dijkstra.</strong> Same algorithmic skeleton;
          different relaxation rule. Prim relaxes with edge weight (MST);
          Dijkstra relaxes with cumulative path weight (SPT). They solve
          different problems but share the implementation: a one-line
          change converts one into the other.
        </p>
        <p>
          <strong>Lazy vs eager heap.</strong> Same tradeoff as Dijkstra.
          Lazy is simpler; eager bounds the heap size at V. For very
          dense graphs, eager wins; for sparse, lazy is fine.
        </p>
        <p>
          <strong>Fibonacci heap.</strong> Theoretically optimal at O(E +
          V log V). Practically slow due to large constants and complex
          pointer manipulation. Almost never used in production; binary
          heap or array dominates.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <p>
          <strong>Pick the variant by graph density.</strong> Sparse → heap
          Prim. Dense (E ≈ V²) → array Prim. Implicit graphs → heap Prim
          with on-demand neighbor computation. Don't reflexively use heap
          on dense graphs — the log factor adds up.
        </p>
        <p>
          <strong>Lazy heap by default.</strong> Push on relaxation; skip
          on pop if already in MST. Use eager heap only if profiler
          evidence shows heap memory is a problem.
        </p>
        <p>
          <strong>Choose the start vertex deliberately.</strong> The
          algorithm's correctness doesn't depend on the start, but if the
          tree models broadcast or single-source dissemination, the
          start should be the actual source. For pure MST construction
          (any spanning tree works), pick vertex 0 by convention.
        </p>
        <p>
          <strong>Compute key updates only for non-MST neighbors.</strong>
          Skipping in-MST neighbors avoids wasted work. The check{" "}
          <code>if (!in_mst[v])</code> before relaxation is essentially
          free and saves heap pushes.
        </p>
        <p>
          <strong>Detect disconnected graphs.</strong> If after V
          iterations the MST contains fewer than V vertices, the graph
          isn't connected. Either fail loudly or restart from an
          unvisited vertex to build a minimum spanning forest.
        </p>
        <p>
          <strong>For Euclidean MST, use the Delaunay triangulation
          shortcut.</strong> The EMST is a sub-graph of the Delaunay
          triangulation, which has O(N) edges and is computable in O(N
          log N). Total O(N log N) for EMST, vastly better than O(N²).
        </p>
        <p>
          <strong>Canonicalize tie-breaking.</strong> When multiple
          edges share the minimum key, the algorithm's choice depends on
          heap-pop order or scan order. For determinism (regression
          tests, cached layouts), break ties by vertex id.
        </p>
        <p>
          <strong>Use 64-bit accumulators for total weight.</strong> A
          graph with 10⁶ edges of weight 10⁶ overflows 32-bit; default
          to int64 for the running total even if individual weights are
          small.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <p>
          <strong>Wrong relaxation rule.</strong> The most common bug:
          using <code>key[u] + w</code> instead of <code>w</code> in the
          relaxation, which turns Prim into Dijkstra. The total weight
          looks plausible but the tree is wrong (it's the SPT, not the
          MST). Always test on a small graph where MST and SPT differ.
        </p>
        <p>
          <strong>Forgetting in_mst check on pop.</strong> Without it,
          stale heap entries get processed twice, double-counting their
          weight in the total and corrupting parent pointers. Lazy heap
          requires the skip-on-pop pattern.
        </p>
        <p>
          <strong>Heap-based Prim on dense graphs.</strong> O((V+E) log V)
          on a dense graph is O(V² log V); array-based is O(V²). On V =
          5000 dense, the difference is a 13× slowdown for picking the
          wrong variant.
        </p>
        <p>
          <strong>Adjacency matrix with infinity sentinels and overflow.</strong>
          When summing weights, an INT_MAX sentinel can overflow. Use
          large but-not-max sentinels or guard before reading.
        </p>
        <p>
          <strong>Not handling disconnected graphs.</strong> Prim from
          one start vertex returns a spanning tree of one component
          only. If the input might be disconnected, document the
          forest semantics or fall back to Kruskal.
        </p>
        <p>
          <strong>Re-initializing keys per source for repeated Prim.</strong>
          If you run Prim from many starting vertices (rare but seen
          in some clustering pipelines), reset keys carefully — leftover
          state from the previous run can corrupt the current MST.
        </p>
        <p>
          <strong>Confusing MST with SPT in interview answers.</strong>
          A common verbal trap: candidates explain Prim and accidentally
          describe Dijkstra. The discriminator question — "what's
          different from Dijkstra?" — exists exactly to catch this.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/prims-mst-diagram-3.svg"
          alt="Prim production wins and applications"
          caption="When Prim wins over Kruskal — dense graphs, implicit graphs, root-anchored trees — and the production systems that lean on it."
        />
        <p>
          <strong>Broadcast tree construction.</strong> In mesh and
          ad-hoc networks, broadcasting a message from a designated
          source to all nodes at minimum total link cost is exactly
          Prim's algorithm with the source as the root. Sensor networks,
          IoT clusters, and overlay networks for content distribution all
          use Prim or Prim-derived schemes.
        </p>
        <p>
          <strong>Computer graphics and mesh processing.</strong>
          Mesh simplification, point-cloud connectivity, and depth-image
          surfacing use MSTs to find natural neighbor structure. Prim is
          preferred over Kruskal because the graphs are dense in
          neighborhood and implicit (computed from geometric proximity).
        </p>
        <p>
          <strong>Image quilting / texture synthesis.</strong> Efraim
          and Freeman's image-quilting algorithm uses minimum-error
          boundary cut between texture patches, computed via shortest
          path on the error grid; the related "graph cut" texture
          synthesis uses MST-like algorithms on grid graphs to find
          best-blending seams.
        </p>
        <p>
          <strong>TSP approximation.</strong> The 2-approx algorithm for
          metric TSP runs Prim, then DFS-Euler-tours the MST, then
          shortcuts repeated vertices. Christofides's 1.5-approx adds a
          minimum-weight perfect matching on odd-degree MST vertices.
          Both rely on building a high-quality MST quickly.
        </p>
        <p>
          <strong>Geometric MST.</strong> Computing the Euclidean MST of
          a 2D point set in O(N log N) via Delaunay triangulation + Prim
          is standard in computational geometry libraries (CGAL, Boost
          Polygon). Used in clustering, anomaly detection, and graph
          drawing.
        </p>
        <p>
          <strong>Cluster validity metrics.</strong> The "MST-based
          cluster cohesion" metric tests how compact clusters are by
          comparing intra-cluster MST edges to inter-cluster ones;
          builds heavily on Prim-style frontier expansion within each
          candidate cluster.
        </p>
        <p>
          <strong>Hierarchical clustering.</strong> Single-linkage
          clustering is equivalent to building MST and cutting edges in
          decreasing weight order. Prim is the natural growth-based way
          to construct it; the dendrogram falls out as a side-effect of
          the merge sequence.
        </p>
        <p>
          <strong>Network reliability and backbone design.</strong>
          Many telecom design tools start from MST (cheapest possible
          backbone) and then augment with redundancy edges. Prim's
          single-tree output gives a clean baseline; augmentation
          algorithms add edges to achieve k-edge-connectivity.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <p>
          <strong>Min Cost to Connect All Points (LeetCode 1584).</strong>
          A perfect Prim problem: dense graph (every pair has an edge),
          implicit weights (Manhattan distance), single starting vertex.
          Heap-based Prim: O(N² log N). Array-based Prim: O(N²) — wins.
        </p>
        <p>
          <strong>Connecting Cities with Minimum Cost.</strong> Standard
          MST framing; either Prim or Kruskal works. Interviewer often
          asks "which would you pick and why?" — chance to discuss
          density tradeoffs.
        </p>
        <p>
          <strong>Optimize Water Distribution.</strong> Add a virtual
          source connected to all cities (well costs); run MST. Both Prim
          and Kruskal apply; Prim with the virtual source as root is
          natural.
        </p>
        <p>
          <strong>What's the difference between Prim and
          Dijkstra?</strong> The discriminator question. Prim relaxes
          with edge weight; Dijkstra with cumulative path weight. Same
          skeleton, different rule. Strong answers also note that Prim's
          tree is a spanning tree; Dijkstra's is a shortest-path tree
          rooted at source.
        </p>
        <p>
          <strong>When would you choose Prim over Kruskal?</strong> Dense
          graph with adjacency matrix; implicit graph (compute weights
          on demand); single-source root constraint (broadcast); already
          have heap-based pipeline.
        </p>
        <p>
          <strong>Find Critical and Pseudo-Critical Edges.</strong> Edge
          is critical if removing it increases MST weight; pseudo-critical
          if it appears in some but not all MSTs. Generally solved with
          Kruskal + union-find; can be adapted for Prim.
        </p>
        <p>
          <strong>Implement Prim with a heap.</strong> Direct
          implementation question. Test on a small graph; verify total
          weight matches reference. Watch for the in_mst skip-on-pop
          pattern.
        </p>
        <p>
          <strong>Maximum spanning tree.</strong> Same algorithm with a
          max-heap. Tests whether candidate sees the duality.
        </p>
        <p>
          <strong>Build a broadcast tree from a fixed root.</strong>
          System-design phrasing. Strong answers cover the MST formulation
          (Prim from root), failure handling (link drop = MST recompute),
          and incremental updates.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <p>
          Prim's original paper "Shortest Connection Networks and Some
          Generalizations" (Bell Labs, 1957) is short and accessible.
          Jarník's 1930 paper (in Czech) is the earliest known publication
          of the algorithm. Dijkstra's 1959 "A Note on Two Problems in
          Connexion with Graphs" includes both the SPT and MST algorithms;
          the MST one is essentially Prim's.
        </p>
        <p>
          CLRS Chapter 23 covers Prim and Kruskal in detail with
          cut/cycle property proofs. Sedgewick and Wayne's <em>Algorithms</em>{" "}
          has a clean Java implementation of indexed-heap Prim. Tarjan's{" "}
          <em>Data Structures and Network Algorithms</em> covers MSTs in
          the broader matroid-theoretic context.
        </p>
        <p>
          For practical implementations, Boost Graph Library, NetworkX,
          igraph, and Lemon all ship Prim. Reading their source is
          instructive for indexed-heap and bidirectional variants.
        </p>
        <p>
          For Euclidean MST and Delaunay-based shortcuts, Preparata and
          Shamos's <em>Computational Geometry: An Introduction</em> is
          the standard reference. Cheriton and Tarjan's "Finding Minimum
          Spanning Trees" gives an O(E log* V) algorithm using
          F-heaps.
        </p>
        <p>
          For applications, Felzenszwalb-Huttenlocher's image
          segmentation paper, Ester et al.'s DBSCAN (related to MST
          clustering), and Christofides's TSP approximation paper are
          all foundational. For the broadcast / mesh-network context,
          textbooks on algorithmic networking (e.g., Peleg's <em>
          Distributed Computing</em>) cover MST-based dissemination.
        </p>
      </section>
    </ArticleLayout>
  );
}
