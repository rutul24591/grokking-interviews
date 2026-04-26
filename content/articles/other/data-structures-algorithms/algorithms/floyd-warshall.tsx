"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "floyd-warshall",
  title: "Floyd-Warshall Algorithm",
  description:
    "All-pairs shortest paths in O(V³) — the three-nested-loop dynamic program, semiring generalization to transitive closure and bottleneck paths, and where it beats running Dijkstra V times.",
  category: "other",
  subcategory: "algorithms",
  slug: "floyd-warshall",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-20",
  tags: [
    "floyd-warshall",
    "all-pairs-shortest-path",
    "graph",
    "dynamic-programming",
    "transitive-closure",
    "semiring",
  ],
  relatedTopics: [
    "dijkstra",
    "bellman-ford",
    "bfs",
    "dfs",
    "dp-fundamentals",
  ],
};

export default function FloydWarshallArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p>
          The Floyd-Warshall algorithm computes shortest paths between all
          pairs of vertices in a weighted directed graph in O(V³) time and
          O(V²) space. Unlike Dijkstra and Bellman-Ford, which solve the
          single-source variant, Floyd-Warshall solves the all-pairs problem
          in one shot using a strikingly simple three-nested-loop dynamic
          program. It tolerates negative edges, detects negative cycles
          (any vertex with negative self-distance after the loop is on a
          negative cycle), and generalizes naturally to other algebraic
          structures — transitive closure (Warshall's algorithm proper),
          bottleneck paths, regex-to-DFA conversion, and counting paths.
        </p>
        <p>
          The algorithm appeared in Robert Floyd's 1962 paper "Algorithm 97:
          Shortest Path," which built on Stephen Warshall's 1962 transitive
          closure algorithm. Warshall and Floyd worked on related problems
          independently and the modern attribution honors both. Bernard Roy
          published essentially the same idea in 1959, so some references use
          Roy-Floyd-Warshall.
        </p>
        <p>
          Floyd-Warshall is the answer to "give me the distance from any node
          to any other node, all at once." On dense graphs (E = Θ(V²)), it
          beats running Dijkstra V times because the inner loop is a single
          arithmetic operation with extraordinary cache locality, while
          Dijkstra inherits O(log V) heap overhead. On sparse graphs with
          non-negative edges, V × Dijkstra wins. On sparse graphs with
          negative edges, Johnson's algorithm (Bellman-Ford then V Dijkstras)
          beats Floyd-Warshall. The decision tree is density vs. sign of edge
          weights vs. memory budget.
        </p>
        <p>
          Beyond the canonical APSP use case, Floyd-Warshall shines as an
          algorithmic skeleton. The same three nested loops compute
          transitive closure, bottleneck paths (max-min instead of min-sum),
          probability of connectivity in unreliable networks, regex-to-DFA
          conversion (Kleene's algorithm over the regex semiring), and
          counting paths. Recognizing that "this is just Floyd-Warshall in a
          different semiring" is a staff-level instinct that turns a class of
          problems into one problem.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/floyd-warshall-diagram-1.svg"
          alt="Floyd-Warshall recurrence and properties"
          caption="The three-nested-loop dynamic program with the k-as-intermediate-vertex recurrence and the algorithm's headline properties."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <p>
          The recurrence is the algorithm. Define{" "}
          <code>d[k][i][j]</code> as the weight of the shortest path from i to
          j using only vertices in <code>{"{1, ..., k}"}</code> as intermediate
          stops. Then either the path doesn't use k at all (cost{" "}
          <code>d[k-1][i][j]</code>) or it uses k exactly once, in which case
          it splits into i → k and k → j with cost{" "}
          <code>d[k-1][i][k] + d[k-1][k][j]</code>. Take the min:{" "}
          <code>d[k][i][j] = min(d[k-1][i][j], d[k-1][i][k] + d[k-1][k][j])</code>.
          Base case <code>d[0][i][j] = w(i, j)</code> if (i, j) is an edge,
          else infinity (with d[0][i][i] = 0).
        </p>
        <p>
          The clever observation: the third dimension can be dropped. When
          computing pass k in place, the values <code>d[i][k]</code> and{" "}
          <code>d[k][j]</code> on the right are read before being written —
          and even if they are written, they don't change because{" "}
          <code>d[k][k] = 0</code> implies <code>d[k][i][k] = d[k-1][i][k]</code>.
          So three nested loops over a single V × V matrix produce the right
          answer:
        </p>
        <p>
          <code>for k: for i: for j: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])</code>.
        </p>
        <p>
          The k loop must be outermost. Swapping i or j outside k breaks the
          recurrence — you'd be computing intermediate vertices in some other
          order, and the in-place trick stops working.
        </p>
        <p>
          <em>Negative cycle detection.</em> After the loop, if any{" "}
          <code>dist[v][v] &lt; 0</code>, then v is on a negative cycle (a
          path from v back to v with negative total weight). Such cycles also
          poison every reachable downstream pair: if u can reach a vertex on
          a negative cycle that can reach w, then dist[u][w] is unbounded
          below. Production code typically reports "negative cycle detected"
          globally and refuses to return distances, since the matrix is
          partially meaningless.
        </p>
        <p>
          <em>Path reconstruction.</em> Maintain a "next" or "predecessor"
          matrix alongside dist. Each time you relax (i, j) through k, set{" "}
          <code>next[i][j] = next[i][k]</code> (or pred[i][j] = pred[k][j],
          symmetric choice). Reconstruction walks the next pointers from i to
          j in O(path length). The matrix doubles memory, which can matter on
          large graphs.
        </p>
        <p>
          <em>Semiring generalization.</em> Replace (min, +) with any closed
          semiring (⊕, ⊗): <code>dist[i][j] = dist[i][j] ⊕ (dist[i][k] ⊗ dist[k][j])</code>.
          Examples: (∨, ∧) on booleans gives transitive closure (Warshall's
          algorithm); (max, min) gives bottleneck or widest paths; (+, ×) on
          probabilities gives reliability; (regex union, concatenation) gives
          Kleene's regex-to-DFA construction. The framework is more general
          than shortest paths.
        </p>
        <p>
          <em>Cache behavior.</em> The inner loop is two reads, one min, one
          conditional write — essentially branch-free with good compiler
          optimization. The dist matrix accesses are nearly sequential
          (dist[i][k] is loop-invariant in the j loop, dist[k][j] is
          sequential in j, dist[i][j] is sequential in j). On modern hardware,
          Floyd-Warshall achieves close to memory bandwidth limits for
          medium-sized graphs and can be GPU-accelerated for very dense
          graphs.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p>
          The data structure is one V × V matrix of distances, optionally a
          parallel V × V matrix of next/predecessor pointers for
          reconstruction. Initialization: set diagonal to 0, off-diagonal to
          edge weight or infinity. Algorithm: three nested loops. Memory
          O(V²); for V = 1000 with int64, that's 8 MB — comfortable. For V =
          50,000, it's 20 GB — out of reach for a single machine.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/floyd-warshall-diagram-2.svg"
          alt="Floyd-Warshall vs alternatives and path reconstruction"
          caption="Comparison against V × Dijkstra, Bellman-Ford, and Johnson's, plus the next-matrix path-reconstruction pattern."
        />
        <p>
          For dense graphs in the V ≤ ~1000 range, the tight inner loop
          dominates. Unrolling, SIMD vectorization, and blocking can push
          throughput further. The blocked variant divides the matrix into B ×
          B tiles and processes them in cache-friendly order; this is the
          GPU-friendly variant and the basis for distributed APSP on
          continent-scale graphs.
        </p>
        <p>
          For sparse graphs, Floyd-Warshall is wasteful — O(V³) on a graph
          with O(V) edges spends most of its time finding that{" "}
          <code>dist[i][k] + dist[k][j]</code> is infinity. Switch to Johnson's
          algorithm: one Bellman-Ford from a virtual source to compute vertex
          potentials, then V Dijkstras on the reweighted graph. Total cost
          O(VE + V(V + E) log V), which is O(V² log V) on sparse graphs vs.
          Floyd-Warshall's O(V³).
        </p>
        <p>
          For dynamic graphs (edges inserted or removed online), full reruns
          are wasteful. Demetrescu and Italiano's "Fully Dynamic All Pairs
          Shortest Paths" maintains APSP under updates with amortized
          O(V²·polylog V) per update. For decremental-only graphs (edges only
          deleted), simpler algorithms exist. Production routing systems that
          need APSP rarely use dynamic algorithms; they batch updates and
          re-run Floyd-Warshall periodically.
        </p>
        <p>
          For the transitive-closure version (Warshall's algorithm), replace
          min/+ with or/and. The matrix can be stored as bits and processed
          with bitwise OR over rows; this gives a constant-factor speedup of
          64× on a 64-bit machine. For very dense reachability problems,
          bitset Floyd-Warshall is hard to beat.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <p>
          <strong>Floyd-Warshall vs V × Dijkstra.</strong> On dense graphs
          (E = Θ(V²)), V × Dijkstra costs O(V·E·log V) = O(V³ log V), losing
          to Floyd-Warshall's O(V³). On sparse graphs (E = O(V)), V × Dijkstra
          is O(V² log V), winning easily. The crossover happens around
          E = V² / log V, but constants matter; profile.
        </p>
        <p>
          <strong>Floyd-Warshall vs Johnson's.</strong> On sparse graphs with
          negative edges, Johnson's (Bellman-Ford + V Dijkstras with
          reweighting) is O(VE + V(V+E) log V). For V = 10⁴ and E = V·log V,
          that's roughly 10⁹ ops — competitive with Floyd-Warshall's 10¹².
          Johnson is the right choice for sparse APSP with negative edges.
        </p>
        <p>
          <strong>Floyd-Warshall vs Bellman-Ford from each vertex.</strong>
          O(V·V·E) = O(V²E) is strictly worse than Floyd-Warshall on dense
          graphs and worse than Johnson's on sparse graphs. Almost never the
          right answer; mainly useful as a sanity check.
        </p>
        <p>
          <strong>Floyd-Warshall vs Seidel's matrix-multiplication APSP.</strong>
          Seidel's algorithm runs in O(V^ω log V) for unweighted undirected
          graphs, where ω &lt; 2.373 is the matrix multiplication exponent. In
          theory it beats Floyd-Warshall asymptotically; in practice the
          galactic constants put it out of reach for most real systems.
        </p>
        <p>
          <strong>Floyd-Warshall vs incremental APSP.</strong> When the graph
          changes, full rerun is O(V³) per update. Demetrescu-Italiano gives
          amortized O(V²·polylog V). For static graphs queried many times,
          Floyd-Warshall once + lookup forever is unbeatable.
        </p>
        <p>
          <strong>Floyd-Warshall vs landmark labeling / hub labels.</strong>
          For static large graphs, hub labels precompute distances from each
          vertex to a small "hub set" and answer queries by intersecting
          labels. Preprocessing is heavy (hours on continent-scale road
          networks) but queries are sub-microsecond. Floyd-Warshall stores
          everything explicitly; hub labels store a compact label per vertex.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <p>
          <strong>Use it for V ≤ ~1000 dense graphs.</strong> The constants
          are unbeatable in this regime. For V = 500 and dense, Floyd-Warshall
          finishes in milliseconds; Dijkstra V times pays log overhead and
          loses.
        </p>
        <p>
          <strong>Initialize diagonal to 0, off-diagonal carefully.</strong>
          Off-diagonal entries should be edge weight or infinity-sentinel.
          Use a sentinel that won't overflow when summed with a negative
          weight: <code>LLONG_MAX / 4</code> or similar. Don't use INT_MAX
          unless you guard with{" "}
          <code>if (dist[i][k] != INF &amp;&amp; dist[k][j] != INF)</code>.
        </p>
        <p>
          <strong>Detect negative cycles before trusting distances.</strong>
          After the main loop, scan dist[v][v] for v in 0..V-1. Any negative
          value means the matrix is partially poisoned. Either fail the
          query or propagate -∞ to all pairs reachable through a cycle vertex.
        </p>
        <p>
          <strong>Maintain next-matrix only if you need paths.</strong>
          Reconstruction matrix doubles memory and adds an extra write inside
          the inner loop. If you only need distances (graph diameter, average
          path length, latency budget), skip it.
        </p>
        <p>
          <strong>For transitive closure, use bitsets.</strong> Boolean
          Floyd-Warshall (Warshall's algorithm) on a V × V matrix becomes
          O(V³ / 64) with row-wise bitwise OR. On V = 10⁴ that's a 64×
          speedup — order-of-magnitude for free.
        </p>
        <p>
          <strong>Block the matrix for cache.</strong> Process B × B tiles
          (B = 64 or 128) so the inner loop fits in L1. Cache-blocked
          Floyd-Warshall can be 3–5× faster on modern hardware than the naive
          loop. Critical for V in the 1000–5000 range.
        </p>
        <p>
          <strong>Recognize the semiring.</strong> If your problem has the
          shape "combine via addition, optimize via min" (or any associative
          (⊕, ⊗) pair satisfying distributivity), the same skeleton applies.
          Bottleneck paths, regex closure, reachability — all the same
          algorithm.
        </p>
        <p>
          <strong>Parallelize the j loop.</strong> The j loop's iterations
          are independent given fixed (k, i). Easy SIMD or thread-level
          parallelism; dist[i][k] hoists out as a register.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <p>
          <strong>Wrong loop order.</strong> The k loop must be outermost.
          A common bug — putting i or j outside — produces values that look
          plausible on small examples but are wrong. The recurrence's
          monotone-k property is what makes the in-place update correct.
        </p>
        <p>
          <strong>Integer overflow on infinity.</strong> If INF = INT_MAX and
          dist[i][k] = dist[k][j] = INF, then dist[i][k] + dist[k][j]
          overflows to a negative number that incorrectly relaxes dist[i][j].
          Use INF = INT_MAX / 2 or guard with infinity checks.
        </p>
        <p>
          <strong>Trusting dist after negative cycle.</strong> A negative
          cycle makes some pairwise distances meaningless. Don't return them
          without a check. Either return -∞ for poisoned pairs or fail the
          query.
        </p>
        <p>
          <strong>Memory blowup on large V.</strong> V = 10⁴ with int64 is
          800 MB; V = 5 × 10⁴ is 20 GB. Many candidates blindly apply
          Floyd-Warshall on graphs where it can't fit. Switch to V × Dijkstra
          or Johnson's, or compute APSP on demand.
        </p>
        <p>
          <strong>Self-loops with negative weight.</strong> A vertex with a
          negative self-loop is itself a length-1 negative cycle. The
          algorithm handles this correctly only if you initialize dist[v][v]
          = min(0, self-loop weight); otherwise the diagonal stays 0 and the
          cycle is missed.
        </p>
        <p>
          <strong>Forgetting that the graph is directed.</strong>
          Floyd-Warshall handles directed graphs naturally. For undirected,
          ensure the input symmetrizes by adding both (u, v) and (v, u) with
          equal weight; otherwise paths exist only in one direction.
        </p>
        <p>
          <strong>Mixing up next vs predecessor matrices.</strong> Both work
          for reconstruction, but the update inside the inner loop is
          different. With "next," set <code>next[i][j] = next[i][k]</code>.
          With "predecessor," set <code>pred[j] = pred[k]</code>. Mixing the
          two breaks reconstruction.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/floyd-warshall-diagram-3.svg"
          alt="Floyd-Warshall applications and when not to use it"
          caption="Production applications and the decision criteria for when Floyd-Warshall is the wrong tool."
        />
        <p>
          <strong>Transitive closure.</strong> Warshall's algorithm computes
          reachability for every pair in O(V³ / 64) with bitsets. Used in
          database query optimizers (relational closure), program analysis
          (data dependency closure), and rule-based systems (saturation of
          implication graphs).
        </p>
        <p>
          <strong>Regex-to-DFA conversion.</strong> Kleene's algorithm
          converts a finite automaton to an equivalent regular expression by
          running Floyd-Warshall over the regex semiring (union, concatenation,
          star). Each k-iteration introduces vertex k as a possible
          intermediate state. Theoretical foundation for tools like
          decompiling DFA states back into patterns.
        </p>
        <p>
          <strong>Bottleneck and widest-path.</strong> In computer networks,
          the maximum-bandwidth path uses (max, min) instead of (min, +).
          Useful for routing high-bandwidth flows where you want the best
          worst-link bandwidth. Same algorithm, swap operators.
        </p>
        <p>
          <strong>Graph metrics.</strong> Diameter (max over all pairs),
          radius (min over vertices of max distance), eccentricity (max
          distance from a vertex), Wiener index (sum of pairwise distances
          in chemistry). All require APSP; Floyd-Warshall gives you the
          matrix to aggregate over.
        </p>
        <p>
          <strong>Network reliability.</strong> Probability of connectivity
          under independent edge survival is a (max, ×) semiring (or
          (sum, ×) for expected reachability). Same skeleton, different
          algebra.
        </p>
        <p>
          <strong>Game pathfinding for small maps.</strong> For maps with a
          few hundred nodes (RPG town, strategy game province graph),
          precomputing APSP at load time and answering queries with O(1)
          lookups is faster and simpler than online Dijkstra.
        </p>
        <p>
          <strong>Compiler optimization.</strong> Floyd-Warshall computes
          dependency graphs in scheduling, reaching definitions in data-flow
          analysis (over the boolean semiring), and dominator relationships
          in some implementations.
        </p>
        <p>
          <strong>Linguistic analysis.</strong> Closure operations on
          syntactic dependency graphs use Floyd-Warshall-style closure for
          parsing, grammar induction, and similar tasks where small graphs
          are queried many times.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <p>
          <strong>Find the City With the Smallest Number of Neighbors at a
          Threshold Distance (LeetCode).</strong> Direct Floyd-Warshall: build
          the matrix, count neighbors within threshold per vertex, return
          the vertex with smallest count, breaking ties by largest id. The
          canonical "Floyd-Warshall in disguise" interview question.
        </p>
        <p>
          <strong>Course Schedule IV.</strong> Reachability across a
          prerequisite graph. Warshall's algorithm with bitsets computes
          all-pairs reachability in O(V³ / 64); each query is a matrix
          lookup.
        </p>
        <p>
          <strong>Network Connectivity / Transitive Closure.</strong>
          Classic warm-up. Often phrased as "is there any way to get from A
          to B given a list of one-way connections."
        </p>
        <p>
          <strong>Detect a negative cycle.</strong> After the main loop,
          scan diagonals. If any dist[v][v] &lt; 0, report cycle. Bonus:
          extract the cycle by recording predecessors and walking.
        </p>
        <p>
          <strong>Minimum cost to connect all cities (variant).</strong>
          Sometimes APSP-flavored variants surface, where Floyd-Warshall
          gives all pairwise costs and a downstream algorithm picks pairs.
        </p>
        <p>
          <strong>"What if the graph is dynamic?"</strong> Tests depth.
          Demetrescu-Italiano-style incremental APSP, batched recomputation,
          or hub-labeling preprocessing — all valid framings depending on
          read/write ratio.
        </p>
        <p>
          <strong>When would you choose Floyd-Warshall over Dijkstra V
          times?</strong> Density (Θ(V²) edges), small V, presence of
          negative edges. Strong answers cite the cache locality of the
          tight inner loop and the simpler implementation.
        </p>
        <p>
          <strong>Compute graph diameter.</strong> Run Floyd-Warshall, take
          max over all pairs of finite distances. For sparse graphs, V × BFS
          (unweighted) or V × Dijkstra (weighted) wins.
        </p>
        <p>
          <strong>Convert an NFA to a regex (Kleene's algorithm).</strong>
          Advanced. Floyd-Warshall over the regex semiring. Tests recognition
          that the algorithm generalizes beyond shortest paths.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <p>
          Robert Floyd's "Algorithm 97: Shortest Path" (CACM, 1962) is the
          original two-page note. Stephen Warshall's "A Theorem on Boolean
          Matrices" (JACM, 1962) is the transitive-closure progenitor. Both
          are short, classic, and worth reading. CLRS Chapter 25 covers
          Floyd-Warshall, Johnson's, and Seidel's algorithms with proofs.
        </p>
        <p>
          For the semiring viewpoint, Aho, Hopcroft, and Ullman's <em>The
          Design and Analysis of Computer Algorithms</em> (1974) introduces the
          algebraic generalization clearly. Tarjan's <em>Data Structures and
          Network Algorithms</em> covers semiring-based path algorithms in
          depth.
        </p>
        <p>
          For dynamic and incremental APSP, Demetrescu and Italiano's "Fully
          Dynamic All Pairs Shortest Paths" (FOCS 2003) is the canonical
          reference. King's "Fully Dynamic Algorithms for Maintaining
          All-Pairs Shortest Paths" predates and inspires it.
        </p>
        <p>
          For practical large-scale APSP, hub labeling (Abraham, Delling,
          Goldberg, Werneck — "A Hub-Based Labeling Algorithm") and
          contraction hierarchies (Geisberger et al.) are the production
          alternatives. NetworkX, igraph, and Boost Graph Library all
          include Floyd-Warshall implementations; reading the source is
          instructive.
        </p>
        <p>
          For GPU-accelerated APSP on dense graphs, see "All-Pairs Shortest
          Paths for Large Graphs on the GPU" (Katz and Kider, 2008) and
          subsequent work on blocked Floyd-Warshall on CUDA. For the regex
          / Kleene's algorithm angle, Hopcroft, Motwani, and Ullman's
          <em> Introduction to Automata Theory</em> remains the standard
          reference.
        </p>
      </section>
    </ArticleLayout>
  );
}
