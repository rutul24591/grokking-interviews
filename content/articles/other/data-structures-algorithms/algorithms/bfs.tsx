"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "bfs",
  title: "Breadth-First Search (BFS)",
  description:
    "BFS — layer-by-layer graph traversal, shortest paths in unweighted graphs, multi-source / 0-1 / bidirectional variants, and direction-optimizing scaling to billion-vertex graphs.",
  category: "other",
  subcategory: "algorithms",
  slug: "bfs",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-20",
  tags: ["bfs", "graph-traversal", "shortest-path", "queue"],
  relatedTopics: ["dfs", "dijkstra", "topological-sort"],
};

export default function BFSArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p className="mb-4">
          <span className="font-semibold">Breadth-first search (BFS)</span> is a graph
          traversal that visits vertices in increasing order of distance (number of edges)
          from a source. It uses a FIFO queue: enqueue the source, repeatedly dequeue a
          vertex and enqueue any unvisited neighbors. The traversal sweeps the graph in
          concentric "layers."
        </p>
        <p className="mb-4">
          BFS dates to the 1950s — Edward F. Moore used it for maze-solving in 1959, and
          Charles Lee independently for circuit-routing the same year. It runs in O(V + E)
          time and O(V) space, and it's the canonical way to find shortest paths in
          unweighted graphs.
        </p>
        <p className="mb-4">
          Interview ubiquity is enormous: BFS is the answer to "find shortest path,"
          "find connected components," "level-order traversal," "shortest sequence of
          moves," and the foundation for Dijkstra, A*, Edmonds-Karp, and many distributed
          algorithms. Staff rounds probe variants (multi-source, bidirectional, 0-1)
          and scalability (Pregel, GPU BFS).
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/bfs-diagram-1.svg"
          alt="BFS tree and algorithm"
          caption="Layer-by-layer expansion from source S; standard queue-based algorithm and key variants."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <p className="mb-4">
          <span className="font-semibold">Queue-based traversal.</span> Initialize the
          queue with the source and a visited set containing it. While the queue is
          non-empty, dequeue u, iterate u's adjacency list, and enqueue any neighbor not
          yet visited (marking it visited as you enqueue, not as you dequeue — this
          prevents enqueueing the same vertex twice).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Shortest paths in unweighted graphs.</span>{" "}
          Because BFS explores in non-decreasing distance order, the first time it visits
          a vertex is along a shortest path. Track parent pointers to reconstruct the
          path. Each vertex's distance equals its layer number.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Edge classification.</span> In undirected BFS,
          every non-tree edge connects vertices in the same or adjacent layers
          ("cross edge" or same-level cross). In directed BFS, edges may also go
          backward, but the BFS tree is acyclic. Unlike DFS, BFS doesn't classify
          back/forward edges naturally.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Multi-source BFS.</span> Initialize the queue
          with many sources at once; each receives distance 0. Useful when computing
          minimum distance to <em>any</em> source — e.g., shortest distance to nearest
          gate, rotting oranges, walls and gates problems.
        </p>
        <p className="mb-4">
          <span className="font-semibold">0-1 BFS.</span> If edge weights are only 0 or
          1, use a double-ended queue: pushFront for 0-weight edges, pushBack for
          1-weight. Achieves shortest-path in O(V + E) without Dijkstra's log factor.
          Common in puzzle-graph problems where some moves are "free."
        </p>
        <p className="mb-4">
          <span className="font-semibold">Bidirectional BFS.</span> When seeking shortest
          path between two specific vertices in a large graph, run two BFS frontiers (one
          from source, one from target) and stop when they meet. Frontier sizes are
          √-of-direct, so total work is roughly 2·b^(d/2) instead of b^d — orders of
          magnitude faster for high-branching graphs.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Bipartiteness check.</span> 2-color the BFS
          layers. If any edge connects two vertices of the same color (i.e., spanning the
          same layer), the graph has an odd cycle — not bipartite.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Connected components.</span> Outer loop over
          unvisited vertices, BFS each, count one component per BFS root. Handles
          disconnected graphs uniformly.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/bfs-diagram-2.svg"
          alt="BFS properties and comparisons"
          caption="Properties (shortest path, edge classes, bipartiteness) and comparison to DFS / Dijkstra."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p className="mb-4">
          <span className="font-semibold">Adjacency list vs matrix.</span> For sparse
          graphs (E = O(V)), adjacency list gives O(V + E) BFS in clean linear time. For
          dense graphs (E = Θ(V²)), the adjacency matrix is fine but BFS is Θ(V²) per
          source.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Visited representation.</span> Boolean array
          for static V. Bitset for compact memory on huge graphs. Hash set for graphs
          with non-integer or sparsely-numbered vertices.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Direction-optimizing BFS.</span> Beamer's 2012
          insight: when frontier is small (early/late), top-down (push) is best; when
          frontier is large (middle), bottom-up (pull — for each unvisited vertex, check
          if any neighbor is in frontier) wins. Switch dynamically based on frontier
          size. 5–10× speedup on social graphs.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Pregel / vertex-centric BFS.</span> Each
          superstep processes one BFS layer in parallel: every active vertex sends its
          distance to neighbors, then becomes inactive. Layer count = diameter. Used by
          Apache Giraph, Pregel, GraphX.
        </p>
        <p className="mb-4">
          <span className="font-semibold">GPU BFS.</span> Per-warp / per-block frontier
          processing with atomic enqueue. Limited by memory bandwidth, not compute.
          Achieves 100+ billion edges/sec on Graph500 benchmark.
        </p>
        <p className="mb-4">
          <span className="font-semibold">External-memory BFS.</span> When graph exceeds
          RAM, MM_BFS algorithms partition vertices into blocks and use sequential I/O.
          Ajwani et al. and the EMBFS series achieve near-optimal I/O complexity.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <p className="mb-4">
          <span className="font-semibold">BFS vs DFS.</span> BFS finds shortest paths;
          DFS doesn't. BFS frontier is wide (O(V) memory peak); DFS stack is depth (O(V)
          worst case). DFS is the right tool for topological sort, SCC, articulation
          points, and structure analysis. BFS for distance and layer-based questions.
        </p>
        <p className="mb-4">
          <span className="font-semibold">BFS vs Dijkstra.</span> BFS handles unweighted
          (or 0-1) edges in O(V+E); Dijkstra handles non-negative weights in O((V+E) log
          V). For unweighted graphs, BFS is the strict superior choice.
        </p>
        <p className="mb-4">
          <span className="font-semibold">BFS vs Bellman-Ford.</span> Bellman-Ford
          handles negative weights and detects negative cycles, at O(VE). BFS handles
          neither — pure unweighted shortest paths only.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Single-source vs multi-source.</span> Single-
          source: shortest path from one vertex. Multi-source: shortest distance to{" "}
          <em>nearest</em> seed, identical complexity.
        </p>
        <p className="mb-4">
          <span className="font-semibold">BFS vs A*.</span> A* uses a priority queue
          ordered by f(n) = g(n) + h(n) where h is an admissible heuristic. Reduces to
          Dijkstra (h = 0) or BFS (h = 0, unit weights). Adds heuristic guidance for
          target-directed search.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <p className="mb-4">
          <span className="font-semibold">Mark visited at enqueue, not dequeue.</span>{" "}
          Marking at dequeue allows the same vertex into the queue multiple times,
          increasing memory and breaking the O(V+E) bound.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Use deque, not list, in Python.</span>{" "}
          <code>list.pop(0)</code> is O(n); <code>collections.deque.popleft</code> is
          O(1). Same trap in any language without an O(1) front-pop list.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Track distance in a dict/array.</span> Don't
          recompute via BFS levels; store dist[v] = dist[u] + 1 when first enqueueing.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Reconstruct paths via parent pointers.</span>{" "}
          Store parent[v] = u at enqueue. Walk parent[] back from target to source for
          the shortest path.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Use bidirectional BFS for endpoint
          queries.</span> Enormous speedup on large graphs where you only care about one
          source-target pair.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Profile frontier vs visited size.</span> If
          frontier blows up, you're enqueueing duplicates — fix the visited check. If
          visited grows but frontier doesn't, you're processing correctly.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <p className="mb-4">
          <span className="font-semibold">Marking visited at dequeue.</span> Causes
          duplicate enqueues, blows up memory and time.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Using a stack instead of queue.</span> That's
          DFS, not BFS — the algorithm appears to "work" but doesn't find shortest paths.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Forgetting to handle disconnected graphs.</span>{" "}
          Single BFS misses other components. Outer loop over unvisited vertices.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Using BFS on weighted graphs.</span> Wrong
          answers — the first time you reach a vertex isn't necessarily via the shortest
          path. Use Dijkstra.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Off-by-one in distance.</span> Source distance
          0; neighbors 1. If you store at dequeue rather than enqueue, you may double-
          count.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Memory blowup on dense graphs.</span> The BFS
          frontier can hold most of V at peak. For Graph500-scale problems use bitmap
          frontiers and direction-optimizing BFS.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Stack overflow in recursive BFS.</span> BFS is
          inherently iterative. Don't try to recurse it.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <p className="mb-4">
          <span className="font-semibold">Web crawlers.</span> Googlebot, Bingbot
          enqueue URLs in BFS-ish order from seed pages, throttled by politeness rules
          and priority queues. Distance-from-seed correlates with crawl priority.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Social-graph features.</span> "People you may
          know," "friends of friends," group-recommendation rely on bounded-depth BFS.
          Facebook, LinkedIn, and Twitter all run distributed BFS on billion-edge social
          graphs daily.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Network routing.</span> Hop-count protocols
          (RIP) compute distance via BFS-like flooding. Shortest-path-first variants
          (OSPF, IS-IS) use Dijkstra with weighted links but BFS for topology discovery.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Garbage collection.</span> Tracing collectors
          (mark-sweep, generational) BFS reachable objects from roots. Concurrent
          collectors use BFS with tri-color marking to handle live mutation.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Image flood fill.</span> Photoshop's bucket
          tool, Microsoft Paint's fill, image segmentation in OpenCV — all BFS over
          pixel-adjacency graph with color-similarity edge predicates.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Game AI / shortest move sequence.</span>{" "}
          15-puzzle, Rubik's cube optimal solvers, chess opening-book pruning — BFS over
          state graph (with massive state spaces requiring bidirectional or pattern-
          database guidance).
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/bfs-diagram-3.svg"
          alt="BFS in production"
          caption="Production applications and how BFS scales to billion-vertex graphs (Pregel, direction-optimizing, GPU BFS, Graph500)."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <p className="mb-4">
          <span className="font-semibold">"Find shortest path in an unweighted
          graph."</span> Standard BFS with parent pointers. O(V + E).
        </p>
        <p className="mb-4">
          <span className="font-semibold">"Number of islands."</span> Outer loop over
          grid; on unvisited '1', BFS to mark connected component, increment count.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"Rotting oranges."</span> Multi-source BFS
          starting from all initially rotten cells; layer count = total minutes.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"Word ladder."</span> BFS over word graph,
          edges between words differing by one character. Bidirectional BFS for
          dramatic speedup.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"Is the graph bipartite?"</span> 2-color BFS;
          conflict ⇒ no.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"Why use BFS over DFS for shortest
          path?"</span> BFS visits in distance order; first time we reach v is via a
          shortest path. DFS may find a longer path first.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"Open lock — minimum turns to reach target
          combination."</span> BFS over 4-digit state graph with neighbor relations
          ±1 per wheel; multi-source if there are deadends to skip.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <p className="mb-4">
          Moore, "The shortest path through a maze" (1959). Lee, "An algorithm for path
          connections and its applications" (IRE Trans 1961). CLRS chapter 22 on
          elementary graph algorithms. Beamer's direction-optimizing BFS paper (SC
          2012). The Graph500 benchmark
          specification. Pregel paper (Malewicz et al., SIGMOD 2010) for distributed BFS.
          Sanders &amp; Schultes for shortest-path scalability surveys.
        </p>
      </section>
    </ArticleLayout>
  );
}
