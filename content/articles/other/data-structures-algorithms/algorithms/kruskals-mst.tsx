"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "kruskals-mst",
  title: "Kruskal's Minimum Spanning Tree",
  description:
    "Greedy edge selection with union-find — sort edges, accept those that don't form a cycle, stop at V-1. The cut and cycle properties, comparison with Prim and Borůvka, and production extensions.",
  category: "other",
  subcategory: "algorithms",
  slug: "kruskals-mst",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-20",
  tags: [
    "kruskal",
    "minimum-spanning-tree",
    "mst",
    "union-find",
    "greedy",
    "graph",
  ],
  relatedTopics: [
    "prims-mst",
    "union-find",
    "dijkstra",
    "graph",
    "greedy-fundamentals",
  ],
};

export default function KruskalsMSTArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p>
          Kruskal's algorithm finds a minimum spanning tree (MST) of a
          connected, undirected, weighted graph: a subset of V-1 edges that
          connects all V vertices with the minimum total edge weight. The
          algorithm is unreasonably simple — sort the edges by weight and
          add each in turn unless it would form a cycle with already-added
          edges, stopping at V-1. With a union-find (disjoint-set union, DSU)
          data structure to test cycles, Kruskal runs in O(E log E) time,
          dominated by the sort.
        </p>
        <p>
          Joseph Kruskal published the algorithm in 1956 in a four-page
          paper "On the Shortest Spanning Subtree of a Graph and the
          Traveling Salesman Problem." The MST problem is older — Borůvka
          (1926) gave the first known algorithm in the context of designing
          an electrical grid in Moravia — and modern textbook treatments
          usually cover three: Borůvka's, Prim's (1957, also Jarník 1930),
          and Kruskal's. All three are correct and run in roughly the same
          asymptotic time; they differ in data structures, parallelism,
          and which property of MSTs they exploit.
        </p>
        <p>
          MSTs underpin a surprising range of systems. Network design
          (telecom backbone, fiber laying, road planning) literally
          minimizes total cable length given pairwise costs. Single-linkage
          clustering is exactly building an MST and cutting at a threshold —
          the dendrogram is the MST. Image segmentation
          (Felzenszwalb-Huttenlocher) and phylogenetic-tree initialization
          use MST. Approximation algorithms for metric TSP run a 2-approx
          via MST traversal; the Christofides 1.5-approx improves the bound
          by adding a perfect matching.
        </p>
        <p>
          Kruskal is the right choice when the graph is sparse, when edges
          are easy to sort (small integer weights, already sorted by
          construction, or streaming in weight order), or when distributed
          processing is needed. For dense graphs with adjacency-matrix
          input, Prim with an array implementation runs in O(V²) and beats
          Kruskal's O(V² log V). For massively parallel or distributed
          settings, Borůvka — which contracts components in parallel waves —
          is a natural fit.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/kruskals-mst-diagram-1.svg"
          alt="Kruskal's algorithm skeleton and complexity"
          caption="The five-line algorithm — sort, then accept-or-skip via union-find — with complexity analysis backed by the cut and cycle properties."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <p>
          The correctness rests on the <em>cut property</em>: for any cut of
          the graph (a partition of vertices into two non-empty sets), the
          lightest edge crossing the cut belongs to some MST. Conversely,
          the <em>cycle property</em>: in any cycle, the heaviest edge
          belongs to no MST. Kruskal applies the cycle property in reverse:
          when you encounter an edge that would close a cycle (its endpoints
          are already in the same component), the heaviest edge in that
          cycle would be the new edge, so excluding it preserves the
          possibility of an MST.
        </p>
        <p>
          The proof is a "cut-and-paste" exchange argument. Suppose Kruskal's
          output T is not an MST. Take any MST T*. The first edge e in
          Kruskal's sorted order that's in T but not T*: adding e to T*
          creates a cycle; that cycle contains some edge e' in T* but not
          T. Since Kruskal didn't reject e (its endpoints were in different
          components), e' wasn't yet considered when Kruskal accepted e, so
          weight(e) ≤ weight(e'). Replacing e' with e in T* gives a tree
          with weight no greater than T* — still an MST — that agrees with
          T on more edges. Repeat to convert T* into T; therefore T is also
          an MST.
        </p>
        <p>
          <strong>Union-Find (DSU) is the workhorse.</strong> Each vertex
          starts in its own component. <code>find(u)</code> returns the
          representative of u's component; <code>union(u, v)</code> merges
          two components. With <em>path compression</em> (flatten parent
          pointers during find) and <em>union by rank</em> (attach the
          shorter tree under the taller), the amortized cost of find/union
          is O(α(V)) — the inverse Ackermann function, effectively constant
          (less than 5 for any V you'll ever see). Kruskal performs O(E)
          finds and V-1 unions, total O(E · α(V)) for the union-find work
          alone.
        </p>
        <p>
          The dominant cost is sorting: O(E log E) = O(E log V) since E ≤
          V². When edges have small integer weights, replace comparison
          sort with counting/radix sort to reduce sorting to O(E + W) for
          weights bounded by W. On graphs that already arrive in sorted
          order (some streaming sources, log-merged event sequences),
          Kruskal becomes essentially linear: O(E α(V)).
        </p>
        <p>
          <strong>Early termination.</strong> Stop after adding V-1 edges.
          On dense graphs this saves a substantial fraction of the iteration
          — most edges are skipped because their components were already
          merged. The pattern: maintain a counter of accepted edges, break
          when it hits V-1.
        </p>
        <p>
          <strong>MSTs are not unique with tied weights.</strong> If
          multiple edges share a weight, the tie-breaking rule determines
          which MST you get. The total weight is unique, but the tree
          structure varies. For deterministic output (tests, caching,
          incremental updates), canonicalize ties by edge id or endpoint
          pair before sorting.
        </p>
        <p>
          <strong>Maximum spanning tree.</strong> Sort edges in descending
          order; the same algorithm finds the MST of maximum weight. Useful
          in correlation graphs, where higher edge weights mean stronger
          connections.
        </p>
        <p>
          <strong>Bottleneck spanning tree.</strong> Minimum bottleneck
          spanning tree — the spanning tree that minimizes the maximum edge
          weight — is automatically computed by Kruskal: the largest edge
          in the MST is the bottleneck-minimizing answer. (More generally,
          every MST is a minimum bottleneck spanning tree, but not vice
          versa.)
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p>
          The data structures are minimal: an edge list with weights, a
          DSU array for component membership, and an output array of
          accepted edges. Build the edge list (one pass over input), sort
          it, iterate while running union-find, stop at V-1. Memory is
          O(V + E) — proportional to input.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/kruskals-mst-diagram-2.svg"
          alt="MST algorithm comparison and tie-breaking"
          caption="Kruskal vs. Prim vs. Borůvka — the three classical MST algorithms and their operational tradeoffs, plus tie-breaking effects on tree structure."
        />
        <p>
          For very large E, the sort can be the bottleneck both in CPU and
          memory. External-memory MST (Arge et al.) handles graphs that
          don't fit in RAM by external sorting and DSU on disk.
          Production cases include continent-scale road network MSTs and
          scientific co-occurrence graphs with hundreds of millions of
          edges.
        </p>
        <p>
          For distributed graphs, Kruskal needs the full edge list at one
          place to sort, which doesn't scale. Borůvka's algorithm is the
          distributed friendly alternative: each component independently
          finds its lightest outgoing edge in parallel, then those edges
          are merged, halving the component count per round. Total O(log
          V) rounds. The classic distributed implementation is GHS
          (Gallager-Humblet-Spira, 1983), which runs in O(V log V)
          messages.
        </p>
        <p>
          For online MST (edges arriving and being deleted), the
          Holm-Lichtenberg-Thorup data structure maintains the MST in
          polylogarithmic amortized time per update. Used in dynamic
          network reliability and in some online-learning graph
          algorithms.
        </p>
        <p>
          For stream processing (edges arriving in arbitrary order, fixed
          memory), the Borůvka-based streaming MST runs in O(V) memory by
          contracting components and shedding redundant edges. Sketch-based
          streaming MSTs handle edge-deletion streams in semi-streaming
          space.
        </p>
        <p>
          Single-linkage clustering = MST + cut. Build the MST, sort the
          edges, and cut the k-1 heaviest to produce k clusters. The
          dendrogram is the MST viewed as a sequence of merges.
          Felzenszwalb-Huttenlocher graph-based image segmentation runs
          Kruskal on a pixel-similarity graph and stops merging components
          when the inter-component edge weight exceeds intra-component
          variation.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <p>
          <strong>Kruskal vs Prim.</strong> Kruskal is O(E log V) and
          processes edges globally; Prim is O((V + E) log V) with binary
          heap and processes vertices via frontier expansion. On sparse
          graphs (E ≈ V), they're equivalent. On dense graphs (E ≈ V²),
          Prim with array runs in O(V²), beating Kruskal's O(V² log V).
          Prim can use Fibonacci heaps for O(E + V log V) theoretically;
          Kruskal can't benefit from fancier heaps (its cost is sort, not
          heap).
        </p>
        <p>
          <strong>Kruskal vs Borůvka.</strong> Borůvka's parallel waves
          map naturally to distributed and parallel settings; Kruskal's
          global sort doesn't. For MapReduce-style processing or huge
          graphs that don't fit on one machine, Borůvka wins. On a single
          machine with sortable edges, Kruskal is simpler.
        </p>
        <p>
          <strong>Path compression vs union by rank.</strong> Both
          optimizations are individually effective; both together give
          α(V) amortized. With only one, you get O(log V). Standard
          implementations use both.
        </p>
        <p>
          <strong>MST vs Steiner tree.</strong> MST spans <em>all</em>{" "}
          vertices; Steiner tree spans a specified subset and may include
          intermediate "Steiner" vertices. Steiner tree is NP-hard.
          Approximation: 2-approx via metric closure + MST.
        </p>
        <p>
          <strong>MST vs shortest-path tree.</strong> Easy to confuse but
          they solve different problems. SPT minimizes path length from a
          single source to every vertex; MST minimizes total tree weight.
          The same edge can be in the SPT but not the MST or vice versa.
        </p>
        <p>
          <strong>Kruskal vs sorted-edge heuristic for TSP.</strong>
          Sorted-edge TSP picks the cheapest edge that doesn't create a
          cycle of length &lt; V or a degree-3 vertex. The constraints make
          it different from Kruskal — but the algorithmic shape is
          similar, which is why MST + DFS gives the 2-approx bound for
          metric TSP.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <p>
          <strong>Use a real DSU with both optimizations.</strong> Path
          compression alone gives O(log V); union by rank alone gives
          O(log V); both together give O(α(V)). The implementation
          difference is a few lines.
        </p>
        <p>
          <strong>Stop at V-1 edges.</strong> Don't iterate the full sorted
          edge list. On graphs where V is small relative to E, this saves
          most of the loop.
        </p>
        <p>
          <strong>Canonicalize tie-breaking.</strong> Sort by (weight,
          edge_id) or (weight, min_endpoint, max_endpoint) so reruns
          produce the same MST structure. Production systems care because
          incremental MST and cached layouts depend on stable output.
        </p>
        <p>
          <strong>Use radix or counting sort for small integer
          weights.</strong> When weights fit in a small integer range
          (latency in ms, hop count, link cost), bucket sort drops the
          sort cost from O(E log E) to O(E + W).
        </p>
        <p>
          <strong>Iterate over edges in place, don't materialize a full
          sorted copy if memory is tight.</strong> For huge graphs,
          external sort with bounded RAM is preferred. For really huge
          graphs, switch to Borůvka.
        </p>
        <p>
          <strong>For streaming or online use cases, prefer Borůvka or
          dynamic MST.</strong> Kruskal's global sort doesn't compose with
          streams well.
        </p>
        <p>
          <strong>Detect disconnected graphs.</strong> If after iterating
          all edges you have fewer than V-1 in the MST, the graph isn't
          connected. The output is then a minimum spanning forest. Either
          fail loudly or document the forest semantics.
        </p>
        <p>
          <strong>Combine with cut-property reasoning for proofs.</strong>
          When asked "why is this edge in the MST?" or "why isn't it?",
          point to the cut crossing it (cut property) or the cycle
          containing it (cycle property). This is the cleanest way to
          reason about MST decisions.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <p>
          <strong>DSU without optimizations.</strong> A naive
          implementation (find walks parent chain, union sets one parent
          to the other) gives O(V) per operation worst-case, blowing the
          O(E log V) target. Always use both path compression and union
          by rank.
        </p>
        <p>
          <strong>Not handling disconnected input.</strong> Kruskal on a
          disconnected graph returns a forest, not a tree. Callers
          expecting V-1 edges may read past the array. Defensive code
          checks edge count and either errors or returns the forest.
        </p>
        <p>
          <strong>Mutating the edge list during iteration.</strong> Sorting
          in place, then iterating, is fine. Mutating during iteration
          (some online streaming implementations) needs care to avoid
          re-processing or skipping edges.
        </p>
        <p>
          <strong>Float precision in weights.</strong> Comparison sort is
          fine for floats, but tie-breaking on near-equal weights becomes
          non-deterministic. Round to fixed precision or use integer
          micro-units.
        </p>
        <p>
          <strong>Confusing MST with shortest-path tree.</strong> A
          frequent interview confusion. MST minimizes total weight; SPT
          minimizes per-source distance. They can differ. The path from s
          to t in the MST is generally not the shortest path.
        </p>
        <p>
          <strong>Forgetting that MST is undirected.</strong> Treating
          directed-graph edges as undirected (or vice versa) gives the
          wrong answer. MST is defined on undirected graphs; for directed
          graphs, you want a "minimum arborescence" (Edmonds' algorithm),
          which is much more complex.
        </p>
        <p>
          <strong>Negative edges silently ignored.</strong> MSTs work fine
          with negative edge weights — there's no analogue of Dijkstra's
          non-negativity requirement. But interview prompts sometimes hide
          that detail; don't insert spurious checks.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/kruskals-mst-diagram-3.svg"
          alt="Kruskal applications and MST variants"
          caption="Production applications of Kruskal — network design, clustering, image segmentation, TSP approximation — and the family of MST variants and extensions."
        />
        <p>
          <strong>Network design.</strong> The original motivation —
          finding minimum-cost cabling for an electrical grid (Borůvka's
          1926 problem) generalized to fiber backbones, road networks, and
          telecom infrastructure. Real-world systems add constraints
          (degree limits, redundancy, capacity), giving NP-hard variants
          for which MST provides starting solutions or LP-rounding bases.
        </p>
        <p>
          <strong>Single-linkage clustering.</strong> Build MST on the
          pairwise-distance graph; cut at threshold to form clusters. The
          dendrogram is the MST. Used in bioinformatics (gene-expression
          clustering), document retrieval, and anomaly detection. Critique:
          single-linkage is sensitive to "chaining" (long thin clusters
          form via outlier bridges) but remains a fast, intuitive
          baseline.
        </p>
        <p>
          <strong>Image segmentation.</strong> Felzenszwalb and
          Huttenlocher's 2004 graph-based segmentation builds an
          edge-weighted graph over pixel neighborhoods, sorts edges, and
          runs a Kruskal-like merge with a stopping criterion comparing
          inter-component vs intra-component variation. Fast, simple,
          competitive on natural images.
        </p>
        <p>
          <strong>Approximation algorithms for TSP.</strong> Build MST,
          run Euler-tour DFS, shortcut repeated vertices to get a
          Hamiltonian cycle of cost ≤ 2 × OPT (metric TSP). Christofides
          improves to 1.5 × OPT by adding a minimum-weight perfect
          matching on odd-degree MST vertices.
        </p>
        <p>
          <strong>VLSI / chip routing.</strong> Routing nets of
          interconnected pins on a chip uses MST or Steiner-tree
          algorithms to minimize wire length. Clock-tree synthesis (which
          minimizes skew) often starts with MST-derived layouts.
        </p>
        <p>
          <strong>Phylogenetic trees.</strong> Distance-based
          phylogenetic methods initialize from an MST or use MST-style
          contraction to merge species pairs. Modern methods (neighbor
          joining, maximum likelihood) refine but the MST initialization
          is competitive.
        </p>
        <p>
          <strong>Network reliability / k-edge-connected backbones.</strong>
          MST gives the cheapest spanning structure but is fragile (any
          edge cut disconnects the tree). Augmentation algorithms add
          edges to MST to achieve k-edge-connectivity at minimum extra
          cost — used in fault-tolerant network design.
        </p>
        <p>
          <strong>Maze generation.</strong> A "perfect maze" is a
          spanning tree of the grid graph with random edge weights. Run
          Kruskal on randomly weighted edges; the MST is a maze with no
          loops, exactly one path between any two cells.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <p>
          <strong>Min Cost to Connect All Points (LeetCode 1584).</strong>
          The canonical Kruskal problem. Build edges (Manhattan distance
          between every pair), sort, run union-find. O(N² log N). Bonus
          discussion: when N is large, a Manhattan-MST algorithm runs in
          O(N log N).
        </p>
        <p>
          <strong>Connecting Cities With Minimum Cost.</strong> Same
          shape, slightly different framing. Tests whether you can
          extract the MST formulation from prose.
        </p>
        <p>
          <strong>Optimize Water Distribution in a Village.</strong>
          Twist: each city can also build its own well (a self-edge to a
          virtual source). Add a fake source with edges to every city;
          run MST. Tests modeling skill — the trick is the virtual
          source.
        </p>
        <p>
          <strong>Find Critical and Pseudo-Critical Edges.</strong> An
          edge is critical if removing it increases MST weight;
          pseudo-critical if it's in some but not all MSTs. Run MST V+1
          times excluding/forcing each edge in turn. Advanced version
          uses Tarjan's bridge-finding on the MST.
        </p>
        <p>
          <strong>Number of Operations to Make Network
          Connected.</strong> Count connected components via union-find;
          you need (components - 1) extra edges. Doesn't strictly need
          MST, but DSU mechanics are the same.
        </p>
        <p>
          <strong>Most Stones Removed with Same Row or Column.</strong>
          DSU-union problem with rows/columns as union keys. Counts
          components. Tests recognition that union-find isn't only for
          MST.
        </p>
        <p>
          <strong>Earliest Moment When Everyone Become Friends.</strong>
          Sort logs by timestamp; union friends; return first timestamp
          when one component contains everyone. MST-flavored union-find
          processing.
        </p>
        <p>
          <strong>"Explain Kruskal vs Prim and when to use
          each."</strong> System-design / verbal interview. Strong
          answers cover sparse vs dense, parallel vs sequential, sort
          vs heap, and one specific scenario where one wins.
        </p>
        <p>
          <strong>Design a network-cabling planner.</strong> System-design
          framing. Strong answers cover MST plus capacity / redundancy
          augmentation, incremental updates as new buildings are added,
          and visualization for human planners.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <p>
          Kruskal's 1956 paper "On the Shortest Spanning Subtree of a
          Graph and the Traveling Salesman Problem" is brief and worth
          reading. CLRS Chapter 23 covers Kruskal, Prim, and the
          cut/cycle properties with proofs. Tarjan's <em>Data Structures
          and Network Algorithms</em> covers union-find with the formal
          α(n) analysis.
        </p>
        <p>
          For union-find theory, Tarjan's 1975 paper "Efficiency of a
          Good But Not Linear Set Union Algorithm" introduces the α
          analysis. Galler and Fischer's earlier 1964 paper introduces
          path compression. Sedgewick and Wayne's <em>Algorithms</em> has
          the cleanest implementation walkthrough.
        </p>
        <p>
          For distributed and parallel MST, the GHS paper (Gallager,
          Humblet, Spira: "A Distributed Algorithm for Minimum-Weight
          Spanning Trees") is the canonical reference. Awerbuch's "Optimal
          Distributed Algorithms for Minimum Weight Spanning Tree" gives
          tighter bounds. For external-memory MST, Arge, Brodal, and
          Toma's papers on I/O-efficient graph algorithms are the
          standard.
        </p>
        <p>
          For dynamic MST, Holm, Lichtenberg, and Thorup's "Poly-logarithmic
          Deterministic Fully-Dynamic Algorithms" is the canonical
          reference. For streaming MST, Ahn, Guha, McGregor's papers on
          graph sketching cover semi-streaming and dynamic streams.
        </p>
        <p>
          For applications, Felzenszwalb and Huttenlocher's "Efficient
          Graph-Based Image Segmentation" (IJCV 2004) is the segmentation
          paper. Vazirani's <em>Approximation Algorithms</em> covers MST-
          based TSP approximations. Boost Graph Library, NetworkX, and
          igraph all ship Kruskal implementations; the production source
          is instructive.
        </p>
      </section>
    </ArticleLayout>
  );
}
