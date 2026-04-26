"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "dijkstra",
  title: "Dijkstra's Algorithm",
  description:
    "Single-source shortest paths on graphs with non-negative edge weights — the greedy relaxation skeleton, priority-queue tradeoffs, and production variants from A* to contraction hierarchies.",
  category: "other",
  subcategory: "algorithms",
  slug: "dijkstra",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-20",
  tags: [
    "dijkstra",
    "shortest-path",
    "graph",
    "priority-queue",
    "a-star",
    "routing",
  ],
  relatedTopics: [
    "bfs",
    "bellman-ford",
    "floyd-warshall",
    "heap",
    "graph",
  ],
};

export default function DijkstraArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p>
          Dijkstra's algorithm computes single-source shortest paths in a
          weighted graph whose edge weights are non-negative. Given a source
          vertex <em>s</em>, it produces, for every reachable vertex <em>v</em>,
          the minimum total edge weight of any path from <em>s</em> to{" "}
          <em>v</em> together with a parent pointer that lets you reconstruct
          one such path. It generalizes BFS (which solves the unweighted case in
          O(V + E)) by replacing the FIFO queue with a min-priority queue keyed
          by tentative distance, so that the next vertex to be finalized is
          always the closest unfinished vertex to the source.
        </p>
        <p>
          Edsger Dijkstra published the algorithm in 1959 in a three-page note
          and treated it as an obvious specialization of relaxation. The
          algorithm has since become the backbone of practical shortest-path
          systems — IP routing protocols (OSPF, IS-IS), navigation engines
          (Google Maps, OSRM, Valhalla), telecommunications planning, robotics
          motion planning, network flow, and game AI all run Dijkstra or one of
          its descendants (A*, bidirectional Dijkstra, contraction hierarchies,
          ALT). At staff/principal level the questions stop being "implement
          Dijkstra" and become "why this priority queue, why this variant, what
          breaks at scale."
        </p>
        <p>
          The defining constraint is non-negativity. Dijkstra's correctness rests
          on a monotone-frontier argument: when a vertex is popped from the
          priority queue, its tentative distance is provably optimal because no
          undiscovered path could shorten it without traversing an edge of
          strictly negative weight. Negative edges silently break that argument,
          and worse, the algorithm produces a wrong answer rather than failing
          loudly. If the graph contains negative weights, you switch to
          Bellman-Ford (which is O(VE) but tolerates negative edges and detects
          negative cycles) or to Johnson's algorithm (reweight with a
          single Bellman-Ford pass, then run Dijkstra V times).
        </p>
        <p>
          The runtime depends entirely on the priority queue. With a binary
          heap, Dijkstra runs in O((V + E) log V). With a Fibonacci heap, the
          bound improves to O(E + V log V) on paper, but Fibonacci heaps lose to
          binary heaps in practice because their constants are large. With a
          plain array scan, you get O(V² + E), which is optimal on dense graphs.
          For small-integer weights, bucket queues (Dial) and radix heaps push
          the bound to nearly linear in V + E. Choosing the queue is the first
          design decision; everything downstream follows.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/dijkstra-diagram-1.svg"
          alt="Dijkstra greedy relaxation and priority-queue complexity table"
          caption="Greedy relaxation skeleton with the non-negativity invariant and a complexity table by priority-queue choice."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <p>
          The central operation is <em>relaxation</em>. For each edge (u, v, w),
          relaxing the edge means asking: is the path through u shorter than the
          best path I currently know to v? If <code>dist[u] + w &lt; dist[v]</code>,
          update <code>dist[v]</code> and set <code>parent[v] = u</code>. Every
          shortest-path algorithm — Dijkstra, Bellman-Ford, BFS, Floyd-Warshall —
          is a different scheduling of relaxations. Dijkstra's contribution is
          the order: it relaxes the edges out of the unfinished vertex with the
          smallest tentative distance, which guarantees that each vertex is
          finalized exactly once.
        </p>
        <p>
          The proof of correctness is a one-paragraph induction. Assume that
          every vertex finalized so far has its correct shortest-path distance.
          Suppose Dijkstra now pops vertex u with tentative distance d[u]. Any
          path P from s to u must, at some point, leave the finalized set. Let
          (x, y) be the first edge on P that crosses out of the finalized set.
          Then the prefix of P up to x has length d[x] (by the inductive
          hypothesis) and the partial path through y has length at least
          d[x] + w(x,y) ≥ d[y] ≥ d[u] (because d[u] was the minimum tentative
          distance). Adding the rest of P (non-negative) only increases the
          length, so P has length ≥ d[u]. The greedy pop is therefore optimal.
          The argument fails the moment "non-negative" fails.
        </p>
        <p>
          The <em>frontier</em> is the set of vertices that have been touched by
          some relaxation but not yet finalized. Every vertex enters the
          frontier at most once with its first finite distance and may have its
          key decreased many times as shorter paths are discovered. Two
          implementations of decrease-key dominate practice. The lazy approach
          pushes a fresh entry each time a relaxation lowers <code>dist[v]</code>,
          accepting that the heap will contain stale duplicates; on pop you
          discard any entry whose stored distance exceeds the current{" "}
          <code>dist[v]</code>. The eager approach maintains a position map from
          vertex to heap index and calls decrease-key directly. Lazy is simpler
          and dominates the open-source landscape (Boost, JGraphT, NetworkX,
          most LeetCode solutions); eager wins on dense graphs and on
          memory-constrained workloads.
        </p>
        <p>
          The <em>relaxation invariant</em> on the popped distance — finality —
          is what allows two important optimizations. Early exit: if you only
          need <code>dist[t]</code> for a single target, stop the moment t is
          popped. Bidirectional search: run Dijkstra forward from s and backward
          from t simultaneously and stop when their frontiers meet, with a
          careful termination condition that compares the best meeting distance
          against the sum of the two frontier minima. Both rely on finality and
          neither would work for Bellman-Ford.
        </p>
        <p>
          The other concept worth internalizing is the <em>SPT (shortest path
          tree)</em>. Parent pointers from each relaxation form a tree rooted at
          s. The SPT is not unique when ties exist, and tie-breaking choices
          affect downstream consumers (route stability, ECMP load balancing,
          regression-test determinism). Production code generally canonicalizes
          ties — pick the smaller vertex id, or the lexicographically first edge —
          so reruns produce the same path.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p>
          The textbook architecture has three data structures: a distance array{" "}
          <code>dist[]</code>, a parent array <code>parent[]</code>, and a
          min-priority queue keyed by tentative distance. Initialize{" "}
          <code>dist[s] = 0</code>, all others to infinity, push (0, s), and
          loop: pop, skip-if-stale, relax all outgoing edges. The total work is
          V pops, E relaxations, and at most E pushes (lazy) or V decrease-keys
          (eager).
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/dijkstra-diagram-2.svg"
          alt="Dijkstra variants and lazy vs eager decrease-key"
          caption="Practical variants — A*, bidirectional, contraction hierarchies, ALT — and the lazy vs. eager decrease-key tradeoff."
        />
        <p>
          For dense graphs (E = Θ(V²)), the array-based variant is faster: scan
          the unfinalized array each round to find the min, costing O(V) per
          pop and O(V²) total — the E term doesn't get a log factor. Dense
          graphs include adjacency matrices in physics simulations, fully
          connected agent topologies, and APSP intermediate matrices.
        </p>
        <p>
          For sparse graphs (E = O(V)), the binary-heap variant is faster:
          O((V + E) log V). Sparse covers most real graphs — road networks
          (average degree ~3), social networks (power-law tails but mostly
          sparse), web link graphs, dependency graphs. The lazy heap can
          accumulate up to E entries; modern languages handle that fine, but
          watch memory on graphs with hundreds of millions of edges.
        </p>
        <p>
          For graphs with small integer weights bounded by C, Dial's bucket
          queue runs in O(V + E + V·C). Each bucket holds vertices with that
          tentative distance; you scan buckets in order. When C is small (link
          metrics in routing protocols often are), this beats heap-based
          Dijkstra by a constant factor. Radix heaps generalize to O(E + V log
          C) by using a hierarchy of buckets that double in width.
        </p>
        <p>
          A* is Dijkstra plus an admissible heuristic. The priority key becomes
          <code> f(v) = g(v) + h(v)</code>, where <code>g(v)</code> is the actual
          distance from s and <code>h(v)</code> is a lower-bound estimate of the
          remaining distance to t. If h is admissible (never overestimates) and
          consistent (h(u) ≤ w(u,v) + h(v)), A* finds optimal paths and expands
          fewer vertices than Dijkstra. On road networks, the Euclidean distance
          to t is admissible (Earth's geometry permitting); on grid worlds,
          octile or Manhattan distance is admissible.
        </p>
        <p>
          Contraction hierarchies are the production trick that makes
          continent-scale routing fast. Preprocess the graph by repeatedly
          contracting low-importance vertices (introducing shortcut edges to
          preserve distances), creating a hierarchy. Queries run a bidirectional
          modified Dijkstra that only follows upward edges, finding paths in
          milliseconds on graphs with hundreds of millions of edges. ALT
          (A*-Landmarks-Triangle) precomputes distances to a small set of
          landmark vertices and uses the triangle inequality to derive a tight
          heuristic, popular in OSRM and earlier Google Maps.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <p>
          <strong>Dijkstra vs BFS:</strong> BFS solves shortest paths in
          unweighted graphs (or graphs with uniform edge weights) in O(V + E).
          Dijkstra solves the weighted case in O((V + E) log V). On uniform
          weights they produce the same SPT, but BFS is faster by the log V
          factor and uses simpler data structures. If all weights are 0 or 1,
          0-1 BFS with a deque (push front for 0-edges, push back for 1-edges)
          runs in O(V + E) and beats Dijkstra.
        </p>
        <p>
          <strong>Dijkstra vs Bellman-Ford:</strong> Bellman-Ford runs in O(VE)
          and tolerates negative edges; it also detects negative cycles. On
          graphs with non-negative weights, Dijkstra is dramatically faster.
          Use Bellman-Ford when weights can be negative (currency arbitrage,
          economic equilibrium models, distance-vector routing protocols like
          RIP) or when you need negative-cycle detection.
        </p>
        <p>
          <strong>Dijkstra vs Floyd-Warshall:</strong> Floyd-Warshall computes
          all-pairs shortest paths in O(V³) with O(V²) space — independent of E.
          On dense graphs (E = Θ(V²)) where you need APSP, Floyd-Warshall is
          competitive with running Dijkstra V times. On sparse graphs, V
          Dijkstra runs cost O(VE log V), which beats V³ for sparse E. Johnson's
          algorithm bridges the two for sparse graphs with negative edges.
        </p>
        <p>
          <strong>Dijkstra vs A*:</strong> A* with a good heuristic visits far
          fewer vertices, but each vertex visit costs slightly more (heuristic
          evaluation). On road networks with Euclidean heuristics, A* is
          typically 5–10× faster than Dijkstra for single-pair queries. On
          metric-free graphs (social, web), no good heuristic exists and A*
          degenerates to Dijkstra.
        </p>
        <p>
          <strong>Lazy vs eager:</strong> Lazy is the production default —
          simpler code, no position map, lower constant factors on sparse
          graphs. Eager wins on dense graphs (smaller heap) and when memory
          pressure matters. Most language standard libraries (Python's heapq,
          Java's PriorityQueue) don't support decrease-key, so lazy is forced
          unless you implement your own indexed heap.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <p>
          <strong>Validate non-negativity at the boundary.</strong> If your
          graph could have negative edges (financial graphs after log-transform,
          ML cost functions, user-supplied weights), assert non-negativity at
          input or detect at first relaxation. A silent wrong answer is worse
          than a fail-fast assertion.
        </p>
        <p>
          <strong>Use 64-bit accumulators.</strong> A graph with 10⁶ edges of
          weight 10⁶ overflows 32-bit at distance 10¹². Even modest graphs with
          large weights can overflow during intermediate sums. Default to
          int64/long long for distance arrays unless memory pressure forbids.
        </p>
        <p>
          <strong>Initialize sentinels carefully.</strong> Use
          <code> Long.MAX_VALUE / 2</code> or similar so that{" "}
          <code>dist[u] + w</code> doesn't wrap. A common bug: dist[v] = INT_MAX
          and an edge weight of 1 yields a "negative" sum during relaxation.
        </p>
        <p>
          <strong>Skip-on-pop for lazy heap.</strong> The first thing inside the
          loop after popping (d, u) should be{" "}
          <code>if (d &gt; dist[u]) continue</code>. This is the canonical lazy
          deletion pattern. Skipping it works but wastes O(log V) per stale
          entry and can blow up runtime when the heap is full of duplicates.
        </p>
        <p>
          <strong>Pick the right priority queue for the graph.</strong>
          Sparse → binary heap. Dense → array. Small integer weights → bucket
          queue. Graph density and weight distribution should drive the
          decision, not whatever the standard library happens to offer.
        </p>
        <p>
          <strong>Reuse memory across queries.</strong> If you run Dijkstra
          repeatedly from different sources (real-time routing, k-shortest
          paths), allocate dist[], parent[], and the heap once and reset only
          touched entries between runs. Keep a "touched" list to make reset
          O(touched) instead of O(V).
        </p>
        <p>
          <strong>Stop early for single-target queries.</strong> If you only
          need <code>dist[t]</code>, return as soon as t is popped. Skipping the
          remaining V-1 pops and their relaxations can save 90%+ of the work on
          local queries in large graphs.
        </p>
        <p>
          <strong>Canonicalize tie-breaking.</strong> When multiple paths share
          the optimum length, choose deterministically (smaller vertex id,
          smaller edge id). Production routing systems care because clients
          cache routes and flapping looks like an outage.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <p>
          <strong>Negative edges, silent wrong answers.</strong> The most
          dangerous bug. Dijkstra returns an answer; it's just wrong. Always
          gate on non-negativity, especially in pipelines that derive weights
          from machine-learned scores or from user input.
        </p>
        <p>
          <strong>Decrease-key in a heap that doesn't support it.</strong>
          Calling <code>heap.update(v, d)</code> on a binary heap without an
          index map silently does nothing useful. Either use lazy push-and-skip,
          or build an indexed heap. Don't fake it by removing and reinserting —
          O(V) per call kills runtime.
        </p>
        <p>
          <strong>Relaxing finalized vertices.</strong> A common implementation
          bug: not marking u as finalized after pop, then relaxing edges that
          re-decrease the distance of an earlier popped vertex. The skip-on-pop
          check prevents this for lazy heaps; for eager heaps you need an
          explicit "finalized" boolean.
        </p>
        <p>
          <strong>Using BFS with weighted edges.</strong> BFS gives wrong
          answers on weighted graphs because it finalizes by hop count, not by
          distance. The bug looks like Dijkstra working — distances change in
          unexpected orders — until you compare against a reference and see the
          wrong cost.
        </p>
        <p>
          <strong>Dense graph with binary heap.</strong> A graph with V = 10⁴
          and E = 10⁸ runs Dijkstra in 10⁸ · log 10⁴ ≈ 1.3 · 10⁹ ops with binary
          heap, vs 10⁸ + (10⁴)² = 10⁸ ops with array. Wrong queue, 10× slowdown.
        </p>
        <p>
          <strong>Heap size unbounded with lazy.</strong> Pathological graphs
          can push E entries onto the lazy heap. Most of the time E ≤ V·avg_deg
          and this is fine, but for grid graphs with negative-feedback weight
          functions or for adversarial input, switch to eager with indexed heap.
        </p>
        <p>
          <strong>Floating-point distance comparisons.</strong> Equal-distance
          ties depend on float order of operations and become non-deterministic
          across runs and platforms. Either round to fixed precision or break
          ties with vertex id.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/dijkstra-diagram-3.svg"
          alt="Dijkstra in production systems and pitfalls"
          caption="Production systems running Dijkstra and the pitfalls — negative edges, float precision, dynamic graphs, integer overflow."
        />
        <p>
          <strong>IP routing protocols.</strong> OSPF and IS-IS — the link-state
          routing protocols that run inside autonomous systems on the Internet —
          maintain a graph of routers and links and run Dijkstra on every change
          to compute shortest paths. The link metrics are non-negative
          (administratively configured weights, reflecting bandwidth or cost),
          which is why Dijkstra and not Bellman-Ford. RIP, the older
          distance-vector protocol, uses Bellman-Ford-like exchanges instead.
        </p>
        <p>
          <strong>Maps and navigation.</strong> Google Maps, OSRM, Valhalla,
          GraphHopper, and Mapbox all run Dijkstra-family algorithms over road
          graphs with hundreds of millions of edges. Production systems combine
          contraction hierarchies (preprocessing) with bidirectional search and
          A* with landmark heuristics (ALT) to answer queries in milliseconds.
          Real-time traffic updates trigger partial recomputations of CH
          shortcuts.
        </p>
        <p>
          <strong>Game AI pathfinding.</strong> A* is the dominant pathfinding
          algorithm in games — every RTS, MMO, and shooter that needs NPCs to
          navigate around obstacles uses some variant. The graph is usually a
          grid (4- or 8-connected) or a navigation mesh (triangulated walkable
          surface). Hierarchical pathfinding A* (HPA*) decomposes large maps
          into clusters for sub-millisecond queries.
        </p>
        <p>
          <strong>Network capacity planning.</strong> Telecom operators run
          Dijkstra over capacity-augmented graphs (each edge has capacity and
          cost) to find minimum-cost feasible paths for new circuits. Variations
          include constrained shortest path with QoS (latency, jitter, packet
          loss bounds).
        </p>
        <p>
          <strong>Robotics motion planning.</strong> Grid-based path planners in
          mobile robots (warehouse robots, autonomous vehicles, drones) use
          Dijkstra or A* over occupancy grids. D* Lite extends Dijkstra to
          handle dynamically changing graphs (newly discovered obstacles)
          efficiently, replanning incrementally instead of from scratch.
        </p>
        <p>
          <strong>Currency arbitrage detection.</strong> Take a graph of
          currencies with edge weights -log(rate). A negative-weight cycle
          corresponds to an arbitrage opportunity. Dijkstra alone can't detect
          it (negative edges), but Bellman-Ford can. A common interview
          framing — but the answer is that Dijkstra is the wrong tool here.
        </p>
        <p>
          <strong>Compiler register allocation.</strong> Some interference-graph
          spilling heuristics use shortest-path metrics on the def-use graph to
          choose spill candidates that minimize generated load/store cost.
        </p>
        <p>
          <strong>VLSI routing.</strong> Maze routing in chip design is
          Dijkstra over a grid with via and crossing penalties. Lee's algorithm
          and its variants are essentially Dijkstra with custom cost models.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <p>
          <strong>Implement Dijkstra (LeetCode "Network Delay Time").</strong>
          The canonical warm-up. Build adjacency list, lazy binary-heap
          Dijkstra, return max distance. Watch out for unreachable nodes
          (return -1) and integer overflow.
        </p>
        <p>
          <strong>Cheapest Flights Within K Stops.</strong> Modified Dijkstra
          where state is (vertex, stops_used). The state-space doubles in size
          but the algorithm structure is the same. Some solutions use BFS with
          relaxation instead — both work; Dijkstra is faster on graphs with
          highly variable edge weights.
        </p>
        <p>
          <strong>Path with Maximum Probability.</strong> Multiplicative weights
          in (0, 1]. Dijkstra works on max-probability instead of min-distance
          by negating: take -log(p) as edge weight, run min-Dijkstra, exponentiate
          the result. Or run a max-heap directly with multiplication.
        </p>
        <p>
          <strong>Path with Minimum Effort.</strong> Edge weight is the maximum
          of two endpoint heights' difference; path "cost" is the maximum edge
          weight along the path (bottleneck path), not the sum. Dijkstra
          generalizes: replace + with max in the relaxation step. Same skeleton,
          different operator.
        </p>
        <p>
          <strong>Swim in Rising Water.</strong> Another bottleneck-path problem
          on a grid. Equivalent to "minimum spanning tree from source to target"
          and solvable with Dijkstra (max-relaxation) or with binary search +
          BFS or with union-find sorted by elevation.
        </p>
        <p>
          <strong>The Maze II.</strong> Dijkstra on an implicit grid graph where
          edges are "roll until you hit a wall." The neighbor function is
          non-trivial; the algorithm is still vanilla Dijkstra. Tests whether
          the candidate can adapt to non-standard graph representations.
        </p>
        <p>
          <strong>Reachable Nodes In Subdivided Graph.</strong> Dijkstra in
          which each edge is subdivided into k mini-edges; you count reachable
          nodes by tracking how far into each edge from each endpoint you got.
          State is (vertex, distance_remaining). Tests modeling skill.
        </p>
        <p>
          <strong>Tell me about a time you chose Dijkstra vs Bellman-Ford.</strong>
          Behavioral framing of the tradeoff. Strong answers cite the negative-edge
          discriminator, the V·E vs (V+E)log V cost, and the negative-cycle
          detection use case. Bonus: mentioning Johnson's algorithm for sparse
          APSP with negative edges.
        </p>
        <p>
          <strong>Design a navigation service.</strong> System-design framing.
          Strong answers cover graph storage (sharded by region), preprocessing
          (contraction hierarchies), query path (bidirectional CH-Dijkstra),
          real-time traffic updates (partial CH recomputation), and caching
          strategy (popular OD pairs).
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <p>
          Dijkstra's original 1959 note "A Note on Two Problems in Connexion
          with Graphs" remains a clear three-page read and demonstrates the
          economy of his style. Cormen, Leiserson, Rivest, and Stein
          (<em>Introduction to Algorithms</em>) covers Dijkstra, Bellman-Ford,
          and Johnson's algorithm with full proofs and is the standard graduate
          reference. Sedgewick and Wayne's <em>Algorithms</em> has the cleanest
          treatment of indexed-heap Dijkstra in Java.
        </p>
        <p>
          For practical large-scale shortest paths, Geisberger, Sanders,
          Schultes, and Delling's "Contraction Hierarchies: Faster and Simpler
          Hierarchical Routing in Road Networks" (2008) is the foundational
          reference. The OSRM and GraphHopper open-source projects implement
          contraction hierarchies and ALT and are excellent for studying
          production code. Microsoft Research's "Hub Labels" and Abraham et
          al.'s "Highway Hierarchies" extend the preprocessing idea further.
        </p>
        <p>
          For A* and game pathfinding, Amit Patel's "Red Blob Games"
          articles on A* and pathfinding are the best free introduction.
          Bjornsson and Halldorsson's "Improved Heuristics for Optimal
          Path-Finding on Game Maps" and the HPA* paper by Botea, Müller, and
          Schaeffer are standard references.
        </p>
        <p>
          For incremental and dynamic shortest paths, Koenig and Likhachev's
          "D* Lite" paper is the canonical reference for replanning under
          changing costs. LPA* (Lifelong Planning A*) handles the same problem
          for static targets with dynamic edge weights.
        </p>
        <p>
          The Boost Graph Library, NetworkX, JGraphT, Lemon, and igraph all
          ship production-quality Dijkstra implementations and are good study
          targets for indexed-heap and bidirectional variants. Graph databases
          (Neo4j, JanusGraph, Memgraph) expose Dijkstra as a built-in graph
          algorithm; reading their source is instructive for staff-level
          interview prep.
        </p>
      </section>
    </ArticleLayout>
  );
}
