"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-other-dsa-algorithms-bipartite-matching",
  title: "Bipartite Matching — Augmenting Paths &amp; Hopcroft-Karp",
  description:
    "Bipartite matching finds the largest set of vertex-disjoint edges between two vertex sets — the foundation for job assignment, scheduling, and network flow problems.",
  category: "other",
  subcategory: "data-structures-algorithms",
  slug: "bipartite-matching",
  wordCount: 2600,
  readingTime: 10,
  lastUpdated: "2026-05-15",
  tags: [
    "bipartite-matching",
    "hopcroft-karp",
    "graphs",
    "maximum-flow",
    "assignment",
  ],
  relatedTopics: ["graphs", "maximum-flow", "bfs", "dfs"],
};

export default function BipartiteMatchingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1 */}
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: a bipartite graph is 2-colorable (no odd cycles), and
          a matching is a set of edges with no shared endpoints. The two central
          questions are: what is the maximum matching size, and can we achieve a
          perfect matching? Know both the algorithmic answer (Hopcroft-Karp) and
          the structural answer (Hall&apos;s theorem, König&apos;s theorem).
        </HighlightBlock>
        <p>
          A bipartite graph G = (L &#8746; R, E) partitions its vertices into two
          disjoint sets L (left) and R (right) such that every edge connects a
          vertex in L to a vertex in R — no edge has both endpoints in the same
          set. Equivalently, a graph is bipartite if and only if it contains no
          odd-length cycle, which also means it can be 2-colored: assign every
          vertex one of two colors so that no two adjacent vertices share the
          same color. Common examples include workers and jobs, students and
          courses, or servers and clients, where an edge signals that the pair is
          compatible.
        </p>
        <p>
          A matching M in a graph is a subset of edges such that no two edges in
          M share an endpoint — every vertex appears in at most one edge of M. A
          vertex is called matched if it appears in some edge of M, and free (or
          unmatched) otherwise. A maximum matching is a matching of the largest
          possible cardinality; it is not necessarily unique. A perfect matching
          is one where every vertex is matched, which requires |L| = |R| and the
          existence of a balanced assignment. Maximum matching is strictly
          weaker: it asks only for the largest achievable M, even if some
          vertices remain free.
        </p>
        <p>
          Bipartite matching is one of the most widely applicable combinatorial
          optimization primitives. Job scheduling, medical residency assignment,
          ride-sharing dispatch, network routing, and compiler register
          allocation all reduce to it in natural ways. The structure of bipartite
          graphs makes them strictly easier to handle than general graphs: the
          same matching problems on general graphs require Edmond&apos;s blossom
          algorithm, which is significantly more complex.
        </p>
      </section>

      {/* Section 2 */}
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Augmenting Paths</h2>
        <p>
          The central theorem driving all matching algorithms is Berge&apos;s theorem
          (1957): a matching M is maximum if and only if there is no augmenting
          path with respect to M. An augmenting path is a simple path that
          starts at a free vertex, alternates between unmatched and matched edges,
          and ends at a free vertex (different from the start). Because the path
          starts and ends at free vertices and has odd length, it contains one
          more unmatched edge than matched edge. Flipping the status of every
          edge along the path — matched becomes unmatched, unmatched becomes
          matched — yields a valid matching of size |M| + 1. No two augmented
          edges share an endpoint because the path is simple.
        </p>
        <HighlightBlock as="p" tier="important">
          Berge&apos;s theorem is the algorithmic foundation: find augmenting paths
          and flip them until none remain. The matching is then maximum. Every
          correct matching algorithm is essentially an efficient implementation
          of this strategy.
        </HighlightBlock>
        <p>
          The proof of Berge&apos;s theorem is elegant and worth internalizing. In one
          direction, if an augmenting path exists, M is clearly not maximum
          because we can increase its size. In the other direction, suppose M is
          not maximum and M* is a larger matching. Consider the symmetric
          difference M &#8710; M*: every vertex has degree at most 2 (at most one
          edge from M and one from M*), so M &#8710; M* decomposes into paths and
          even cycles. Because |M*| &gt; |M|, at least one path component must
          have more edges from M* than from M, which means it starts and ends
          with M*-edges — making it an augmenting path for M. This constructive
          argument also implies that augmenting paths are always available until
          the matching is maximum.
        </p>
        <p>
          The algorithmic consequence is direct: to compute maximum matching,
          maintain a current matching M (initially empty), and repeatedly search
          for an augmenting path. If found, augment M along the path. If no
          augmenting path exists, M is maximum by Berge&apos;s theorem. The
          algorithms differ only in how efficiently they search for augmenting
          paths.
        </p>
      </section>

      {/* Section 3 */}
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">
          3. Hungarian Algorithm (Augmenting Path Method)
        </h2>
        <p>
          The classic augmenting path algorithm, sometimes called the Hungarian
          method in the context of bipartite matching (though the name more
          precisely refers to the weighted assignment variant), works by
          considering each unmatched left vertex in turn. For each such vertex
          u, it runs a depth-first search or breadth-first search through the
          bipartite graph, following unmatched edges from left vertices and
          matched edges from right vertices. The DFS explores a tree of
          alternating paths rooted at u. If the search reaches an unmatched
          right vertex v, an augmenting path from u to v has been found: the
          algorithm flips the matching status of every edge on the path,
          increasing |M| by one.
        </p>
        <p>
          The visited array tracks which right vertices have already been
          explored during the DFS for the current left vertex u. This prevents
          revisiting and guarantees the DFS terminates. Critically, the visited
          array must be reset between augmentations for different source vertices
          — a common implementation bug is to reuse it across iterations, which
          can prevent valid augmenting paths from being found.
        </p>
        <HighlightBlock as="p" tier="important">
          Complexity: each augmentation takes O(E) in the worst case (the DFS
          may traverse all edges), and at most O(V) augmentations are performed
          (one per left vertex, and the matching size is at most min(|L|, |R|)).
          Total: O(V &times; E). For a graph with 1 000 left vertices and 10 000
          edges this is 10 million operations — fast in practice for small
          graphs.
        </HighlightBlock>
        <p>
          Despite the straightforward implementation, the augmenting path method
          has a key weakness: it processes one augmenting path at a time. Each
          phase handles a single free left vertex and augments by exactly one.
          This means that on graphs where the maximum matching is large, the
          algorithm may take O(|M*|) phases — up to O(V) — each costing O(E),
          giving the O(VE) bound. For small graphs or sparse matchings this is
          fine, but for dense bipartite graphs with a large maximum matching, it
          becomes the bottleneck.
        </p>
        <p>
          The algorithm is also correct for any bipartite graph with no special
          structure required. It handles disconnected graphs, graphs where
          |L| &#8800; |R|, and graphs where no perfect matching exists, all
          transparently: when it exhausts all free left vertices, the resulting
          matching is maximum by Berge&apos;s theorem.
        </p>
      </section>

      {/* Section 4 */}
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Hopcroft-Karp Algorithm</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: Hopcroft-Karp achieves O(&#8730;V &times; E) by batching all
          shortest augmenting paths in a single BFS + DFS phase, rather than
          finding one at a time. The key theorem is that the length of the
          shortest augmenting path increases by at least 2 after each phase,
          bounding the number of phases to O(&#8730;V).
        </HighlightBlock>
        <p>
          Hopcroft-Karp (1973) is the standard algorithm for maximum bipartite
          matching in practice. It improves on the basic augmenting path method
          by processing multiple augmenting paths per phase through two steps
          repeated until no augmenting path exists.
        </p>
        <p>
          Phase 1 — BFS layered graph construction: the algorithm runs a
          simultaneous BFS starting from all free left vertices at once. It
          alternates between following unmatched edges (left to right) and
          matched edges (right to left), building a layered directed graph. The
          BFS stops as soon as it reaches the first layer that contains at least
          one free right vertex. Let L denote the length of this shortest
          augmenting path found. The BFS takes O(E) time.
        </p>
        <p>
          Phase 2 — DFS augmentation: the algorithm runs DFS from each free left
          vertex, but restricts traversal strictly to the layered graph built in
          Phase 1. This DFS finds a maximal set of vertex-disjoint augmenting
          paths, all of the same shortest length L. Each found path is augmented
          immediately by flipping matching status along the path. The DFS also
          takes O(E) time. Together, one phase costs O(E).
        </p>
        <p>
          The key theorem bounding the number of phases: let M be the matching
          after k phases and M* the maximum matching. The remaining augmenting
          paths needed have length at least L + 2k (each phase increases
          shortest augmenting path length by at least 2). It can be shown that
          the number of remaining augmenting paths needed is at most
          |M*| / (k + 1). Setting this equal to 1 gives k = O(&#8730;|M*|) = O(&#8730;V)
          phases. With each phase costing O(E), total complexity is
          O(&#8730;V &times; E). For bipartite graphs with V = 10 000 and E = 1 000 000,
          Hopcroft-Karp performs roughly 100 phases versus up to 10 000 for
          basic augmenting paths — a 100x reduction in phases.
        </p>
        <p>
          In practice, Hopcroft-Karp is 5 to 10 times faster than the basic
          augmenting path method on realistic graphs, and the improvement grows
          with graph density. The implementation complexity is moderate: a BFS
          with a layered graph structure and a DFS that prunes exhausted nodes.
          It is the standard choice whenever bipartite matching is needed on
          non-trivial graphs.
        </p>
      </section>

      {/* Section 5 */}
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">
          5. Architecture &amp; Flow Diagram
        </h2>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/bipartite-matching-architecture.svg"
          alt="Bipartite Matching — Augmenting Paths and Hopcroft-Karp architecture diagram"
          caption="Bipartite matching: graph structure, augmenting path method, Hopcroft-Karp, and key applications and theorems."
        />
      </section>

      {/* Section 6 */}
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">
          6. Maximum Flow Formulation
        </h2>
        <p>
          Bipartite matching reduces naturally to maximum flow. Construct a flow
          network as follows: add a super-source s with an edge of capacity 1 to
          every left vertex in L; add a super-sink t with an edge of capacity 1
          from every right vertex in R; give each original bipartite edge
          capacity 1. The maximum s-t flow in this network equals the maximum
          bipartite matching size. Each unit of flow corresponds to one matched
          edge: the flow travels from s through a left vertex, across a bipartite
          edge, through a right vertex, and into t, and the unit-capacity
          constraints guarantee no vertex is matched more than once.
        </p>
        <HighlightBlock as="p" tier="important">
          Using Dinic&apos;s algorithm on the unit-capacity flow network gives
          O(E&#8730;V) time — the same asymptotic bound as Hopcroft-Karp, which is
          not a coincidence: Hopcroft-Karp is essentially Dinic&apos;s algorithm
          specialized to the bipartite unit-capacity structure.
        </HighlightBlock>
        <p>
          The flow formulation generalizes in several important directions. For
          weighted bipartite matching (find a matching that maximizes or
          minimizes the sum of edge weights), use min-cost max-flow: each
          bipartite edge gets a cost, and successive shortest augmenting paths in
          the cost metric yield the optimal weighted matching. This handles the
          job assignment problem with non-uniform costs. For capacitated
          bipartite matching (a left vertex can be matched to multiple right
          vertices up to a capacity), simply give the corresponding s-to-left
          edge the appropriate capacity. The flow formulation thus serves as a
          unifying framework for the entire family of bipartite matching variants.
        </p>
        <p>
          For non-bipartite graphs, a direct reduction to max flow does not
          preserve correctness because general matchings can involve odd cycles.
          Edmond&apos;s blossom algorithm handles the general case in O(V&#178; E) or
          O(V E log V) with advanced implementations, but in interviews the
          bipartite case is almost exclusively what is tested, and the flow
          formulation is the cleaner exposition.
        </p>
      </section>

      {/* Section 7 */}
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. König&apos;s Theorem</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: König&apos;s theorem states that in any bipartite graph,
          the size of the maximum matching equals the size of the minimum vertex
          cover. This is a direct consequence of LP duality (or max-flow min-cut)
          and connects two seemingly different optimization problems.
        </HighlightBlock>
        <p>
          A vertex cover of a graph is a set of vertices S such that every edge
          has at least one endpoint in S. A minimum vertex cover is one of
          smallest cardinality. In general graphs, minimum vertex cover is
          NP-hard to compute. König&apos;s theorem (1931) establishes that for
          bipartite graphs, minimum vertex cover equals maximum matching — a
          remarkable structural identity that makes the problem solvable in
          polynomial time via matching algorithms.
        </p>
        <p>
          Proof sketch via max-flow min-cut: the LP relaxation of maximum
          matching is known to have an integral optimal solution for bipartite
          graphs (the constraint matrix is totally unimodular). The LP dual is
          exactly the minimum vertex cover LP. By strong LP duality, the optimal
          values coincide, and integrality gives König&apos;s theorem. Alternatively,
          the max-flow min-cut theorem applied to the flow network formulation of
          bipartite matching directly yields the result.
        </p>
        <p>
          How to construct a minimum vertex cover from a maximum matching: run
          Hopcroft-Karp or the augmenting path method to obtain the maximum
          matching M. Then perform an alternating BFS/DFS from all free left
          vertices, following unmatched edges from left to right and matched
          edges from right to left. Let Z denote the set of all vertices
          reachable by this traversal. The minimum vertex cover is
          (L \ Z&#8745;L) &#8746; (R &#8745; Z), that is, the unvisited left vertices together
          with the visited right vertices. This set covers all edges and has
          cardinality equal to |M|.
        </p>
        <p>
          Related: the maximum independent set of a bipartite graph — a largest
          set of vertices with no two adjacent — satisfies |maximum independent
          set| = |V| &minus; |maximum matching|. This is because the complement of a
          minimum vertex cover is a maximum independent set, and König&apos;s theorem
          gives the size of the cover. These identities allow three combinatorial
          optimization problems to be solved simultaneously once the maximum
          matching is known.
        </p>
      </section>

      {/* Section 8 */}
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Hall&apos;s Marriage Theorem</h2>
        <p>
          Hall&apos;s theorem (1935) gives a necessary and sufficient condition for a
          bipartite graph to have a perfect matching that saturates every vertex
          in L. The condition is: for every subset S of L, the neighborhood
          N(S) — the set of vertices in R adjacent to at least one vertex in S —
          must satisfy |N(S)| &#8805; |S|. Intuitively, every group of left vertices
          must collectively have enough distinct right neighbors to match them
          all.
        </p>
        <HighlightBlock as="p" tier="important">
          Hall&apos;s theorem is most useful in interviews for proving impossibility:
          if you can find any subset S &#8838; L with |N(S)| &lt; |S|, then no
          perfect matching of L exists. Such a subset is called a Hall violator.
          Finding a Hall violator can be done via the min-cut structure of the
          flow network after running max flow.
        </HighlightBlock>
        <p>
          The proof of Hall&apos;s theorem is a beautiful double induction argument.
          The necessity direction is trivial: any matching must map each element
          of S to a distinct element of N(S), so |N(S)| &#8805; |S| is required.
          The sufficiency direction proceeds by induction on |L|. In the base
          case |L| = 1, the single vertex has at least one neighbor, so it can
          be matched. In the inductive step, two cases arise: either Hall&apos;s
          condition holds with strict inequality for all proper subsets of L, in
          which case a greedy argument works; or some proper subset S has
          |N(S)| = |S| exactly, in which case we match S optimally by the
          inductive hypothesis, remove both S and N(S), and verify that Hall&apos;s
          condition still holds for the remaining graph.
        </p>
        <p>
          A deficiency version of Hall&apos;s theorem also exists: the maximum
          matching size equals |L| minus the maximum deficiency, where the
          deficiency of a subset S is max(0, |S| &minus; |N(S)|). This generalizes
          the theorem to give the exact matching size when a perfect matching of
          L does not exist, and it is occasionally useful in competitive
          programming and theoretical analysis.
        </p>
      </section>

      {/* Section 9 */}
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. Trade-offs</h2>
        <p>
          Augmenting path (Hungarian) versus Hopcroft-Karp: for graphs with
          fewer than a few hundred vertices or very sparse matchings, the basic
          augmenting path method is simpler to implement and fast enough in
          practice. Hopcroft-Karp wins decisively on large, dense bipartite
          graphs — its O(&#8730;V &times; E) bound versus O(V &times; E) can represent a 10 to
          100x speedup on graphs with thousands of vertices. For competitive
          programming and production systems, Hopcroft-Karp is the default
          choice.
        </p>
        <p>
          For weighted bipartite matching where each edge has a cost or profit
          and the goal is a minimum-cost or maximum-weight perfect matching, the
          algorithms above do not directly apply. The classical solution is the
          Hungarian algorithm for weighted assignment in O(n&#179;) time, or
          min-cost max-flow in O(V E log V) time. The Jonker-Volgenant algorithm
          (a practical refinement of the Hungarian method) is commonly used in
          computer vision and data association tasks.
        </p>
        <p>
          For online or dynamic matching — where vertices and edges arrive
          incrementally over time — neither static algorithm is directly
          applicable. Greedy online algorithms achieve a competitive ratio of
          1/2 in adversarial arrival order. Rank-based and RANKING algorithms
          achieve a 1 &minus; 1/e &#8776; 0.63 competitive ratio for random arrival
          orders (Karp, Vazirani, Vazirani 1990), which is optimal for online
          bipartite matching.
        </p>
        <p>
          For very large graphs that do not fit in memory, streaming and
          approximate matching algorithms are used. A ½-approximate streaming
          matching can be maintained with O(n) space by greedily augmenting
          whenever an edge connects two free vertices. Higher approximation
          ratios require more complex passes over the data.
        </p>
      </section>

      {/* Section 10 */}
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">10. Best Practices</h2>
        <HighlightBlock as="p" tier="important">
          In production systems that need bipartite matching, use Hopcroft-Karp
          as the default. Implement with adjacency lists rather than adjacency
          matrices to keep memory proportional to E rather than V&#178;. Maintain
          both match_left[u] and match_right[v] arrays for O(1) augmentation
          and path reconstruction. Reset the visited (or distance) array
          carefully between BFS and DFS phases.
        </HighlightBlock>
        <p>
          Model the problem explicitly as a bipartite graph before coding. Write
          down the two vertex sets and what an edge means. Confirm that edges
          only cross between the two sets — a common early mistake is to add
          edges within the same set, which produces incorrect results without
          an obvious error. Label left vertices 0 to |L|&minus;1 and right vertices
          0 to |R|&minus;1 in separate index spaces to avoid accidental collisions in
          the match arrays.
        </p>
        <p>
          For the augmenting path DFS, implement it as a recursive function that
          returns true if an augmenting path was found from a given right vertex
          and false otherwise. The recursive structure mirrors the alternating
          path structure directly, and the match array is updated in-place as
          the recursion unwinds. This pattern is compact, easy to verify
          correct, and performs well in practice.
        </p>
        <p>
          When adapting bipartite matching to a flow formulation, prefer a
          well-tested max-flow implementation (Dinic&apos;s algorithm) over rolling
          your own. The flow formulation is more flexible — it handles
          capacitated and weighted variants naturally — and Dinic&apos;s is fast and
          widely available. For pure maximum cardinality bipartite matching with
          no weights or capacities, the direct Hopcroft-Karp implementation is
          usually simpler and faster.
        </p>
      </section>

      {/* Section 11 */}
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">11. Common Pitfalls</h2>
        <p>
          Treating a bipartite matching problem as a general graph matching
          problem is the most common unnecessary complexity mistake. Once you
          identify the two vertex sets and confirm no intra-set edges exist, you
          can use the simpler and faster bipartite algorithms. Edmond&apos;s blossom
          algorithm is only needed when odd cycles are present (non-bipartite
          graphs).
        </p>
        <p>
          Not resetting the visited array between augmentations in the basic
          augmenting path method leads to silent under-matching: the algorithm
          terminates early believing no augmenting path exists when in reality
          the visited set blocked the search. Reset the visited or dist array at
          the start of each top-level call (once per free left vertex in the
          basic method, or once per BFS phase in Hopcroft-Karp).
        </p>
        <p>
          Confusing minimum vertex cover with minimum edge cover is a frequent
          conceptual error. A vertex cover has vertices; an edge cover has edges.
          König&apos;s theorem relates maximum matching to minimum vertex cover, not
          edge cover. The minimum edge cover (smallest set of edges that touches
          every vertex) equals |V| &minus; |maximum matching|, a different identity.
        </p>
        <p>
          Assuming a perfect matching always exists is another pitfall when the
          problem setup guarantees balanced sets (|L| = |R|) but does not
          guarantee Hall&apos;s condition. Always verify whether a perfect matching
          is required (and handle the case where it does not exist) or whether
          maximum matching (best effort) is sufficient.
        </p>
        <p>
          For weighted matching, applying unweighted algorithms and hoping for
          the best produces incorrect results. Hopcroft-Karp maximizes the
          cardinality of the matching, not the total weight. If edge weights
          matter, you need Hungarian O(n&#179;) or min-cost flow; these require
          fundamentally different implementations.
        </p>
      </section>

      {/* Section 12 */}
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">12. Real-World Use Cases</h2>
        <p>
          Medical residency matching uses the National Resident Matching Program
          (NRMP), which implements a variant of the Gale-Shapley stable matching
          algorithm on top of a bipartite graph of medical students and hospital
          programs. The matching must be stable (no student-hospital pair both
          prefer each other to their current assignment) and is solved annually
          for approximately 40 000 participants. Bipartite matching also underlies
          school choice programs in Boston, New York, and other cities.
        </p>
        <p>
          Job scheduling in warehouse and logistics systems assigns workers
          (or robots) to tasks by modeling available workers as left vertices,
          available tasks as right vertices, and edges as feasibility — a worker
          can perform a task given current location, skill, and availability.
          Maximum matching maximizes utilization; min-cost matching optimizes
          assignment cost (e.g., travel distance or time).
        </p>
        <p>
          Ride-sharing platforms such as Uber and Lyft perform bipartite matching
          at scale: drivers on the left, riders on the right, edges weighted by
          estimated pickup time or earnings. The dynamic version matches
          constantly as new rides and drivers appear and disappear, using online
          matching algorithms with approximation guarantees.
        </p>
        <p>
          Compiler register allocation maps virtual registers (left) to physical
          registers (right) under interference constraints. When variables are
          live simultaneously they cannot share a register, modeled as missing
          edges. Maximum matching finds the largest allocation that fits in
          hardware registers; the remainder must be spilled to memory.
        </p>
        <p>
          Network routing and traffic engineering use bipartite matching to
          assign data flows (left) to network paths (right) under capacity
          constraints, maximizing throughput or minimizing congestion. The flow
          formulation of bipartite matching makes this connection direct: max
          matching in the bipartite graph corresponds to a max-flow routing plan.
        </p>
      </section>

      {/* Section 13 */}
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">13. Interview Questions</h2>

        <h3 className="text-lg font-semibold mt-6 mb-2">
          Q1 (Junior-Mid): What is an augmenting path, and why does flipping its edges increase the matching size by exactly one?
        </h3>
        <HighlightBlock as="p" tier="important">
          An augmenting path is a path in the graph that starts at a free left
          vertex, alternates between unmatched and matched edges, and ends at a
          free right vertex. Because the path starts and ends with unmatched
          edges and has odd length, it contains exactly one more unmatched edge
          than matched edge. Flipping the status of all edges on the path
          converts those unmatched edges to matched and vice versa. The result is
          still a valid matching (no two matched edges share an endpoint, because
          the path is simple and the flip only changes edges on the path). The
          matching size increases by one because we gained one more matched edge
          net. By Berge&apos;s theorem, a matching is maximum if and only if no
          augmenting path exists.
        </HighlightBlock>

        <h3 className="text-lg font-semibold mt-6 mb-2">
          Q2 (Mid): Walk through the augmenting path algorithm on a bipartite graph with L = &#123;a, b&#125; and R = &#123;x, y&#125; and edges a-x, a-y, b-x.
        </h3>
        <HighlightBlock as="p" tier="important">
          Start with empty matching M = &#123;&#125;. Process left vertex a: DFS finds
          unmatched right vertex x immediately. Augment: M = &#123;a-x&#125;. Process
          left vertex b: DFS finds x, but x is matched to a. Follow matched edge
          to a. From a, try y (unmatched right vertex). Augmenting path found:
          b-x-a-y. Flip: x is no longer matched to a; a is matched to y; b is
          matched to x. M = &#123;b-x, a-y&#125;. No more free left vertices. Maximum
          matching size = 2 (perfect matching of L). Both b and a are matched;
          x and y are matched. Observe that without backtracking through the
          matched edge a-x and re-routing a to y, we would have been stuck with
          only one match.
        </HighlightBlock>

        <h3 className="text-lg font-semibold mt-6 mb-2">
          Q3 (Mid-Senior): Why does Hopcroft-Karp run in O(&#8730;V &times; E)? What is the key theorem?
        </h3>
        <HighlightBlock as="p" tier="important">
          The key theorem is that after each Hopcroft-Karp phase, the length of
          the shortest augmenting path increases by at least 2. This is because
          the phase finds all vertex-disjoint shortest augmenting paths and
          augments them all simultaneously; any remaining augmenting path must
          route around the now-matched vertices, lengthening it by at least 2.
          Since augmenting paths have odd length (at least 1, 3, 5, ...),
          their length can increase at most O(&#8730;V) times before exceeding 2&#8730;V,
          at which point at most &#8730;V augmenting paths remain, each handled in
          at most &#8730;V augmentations. Each phase costs O(E) for the BFS plus O(E)
          for the DFS. O(&#8730;V) phases times O(E) per phase gives O(&#8730;V &times; E).
        </HighlightBlock>

        <h3 className="text-lg font-semibold mt-6 mb-2">
          Q4 (Senior): State König&apos;s theorem and explain how to find the minimum vertex cover from a maximum matching.
        </h3>
        <HighlightBlock as="p" tier="important">
          König&apos;s theorem: in any bipartite graph, the size of the maximum
          matching equals the size of the minimum vertex cover. To construct the
          cover from a maximum matching M: (1) find all free left vertices — those
          not in M; (2) run an alternating BFS/DFS from those free left vertices,
          following unmatched edges from left to right and matched edges from
          right to left; (3) let Z = all vertices reachable by this traversal;
          (4) the minimum vertex cover is C = (L &minus; (Z &#8745; L)) &#8746; (R &#8745; Z) —
          unvisited left vertices plus visited right vertices. C covers every
          edge (any uncovered edge would yield an augmenting path, contradicting
          maximality of M) and |C| = |M|.
        </HighlightBlock>

        <h3 className="text-lg font-semibold mt-6 mb-2">
          Q5 (Senior): You have N workers and M jobs; each worker can do a subset of jobs; the cost of assigning worker i to job j is c(i,j). Find the minimum-cost perfect matching.
        </h3>
        <HighlightBlock as="p" tier="important">
          This is the assignment problem. Model as a complete bipartite graph
          (N = M required for perfect matching) or a flow network with
          super-source and super-sink. Use min-cost max-flow: assign cost c(i,j)
          to each edge from worker i to job j (with unit capacity), add
          zero-cost unit-capacity edges from super-source to each worker and
          from each job to super-sink. Run successive shortest augmenting paths
          in the cost metric (Bellman-Ford or SPFA for negative-cost edges;
          Johnson&apos;s reweighting to use Dijkstra). Total cost of the flow equals
          the minimum assignment cost. Alternatively, the Hungarian algorithm
          runs directly on the cost matrix in O(n&#179;) and is simpler to implement
          when n is not too large (up to a few thousand). If costs are
          non-negative and dense, the O(n&#179;) Hungarian is practical. For sparse
          or large graphs, successive shortest paths with Dijkstra and potentials
          is faster.
        </HighlightBlock>

        <h3 className="text-lg font-semibold mt-6 mb-2">
          Q6 (Staff): Design a real-time ride-sharing matching system. How do you model and solve the matching efficiently given dynamic arrivals?
        </h3>
        <HighlightBlock as="p" tier="important">
          Model drivers (left) and ride requests (right) as vertices, with
          edges weighted by ETA (estimated time of arrival) or earnings. The
          matching must be updated continuously as new riders arrive (seconds
          timescale) and drivers complete trips. Static Hopcroft-Karp is too slow
          for sub-second re-matching of millions of entities. In practice: (1)
          Batch requests over a short window (e.g., 500ms); (2) within each
          batch, prune the graph to nearby driver-rider pairs using geospatial
          indexing (S2 cells, k-d trees) to reduce E dramatically; (3) solve
          the resulting sparse weighted bipartite matching using min-cost flow
          or the Hungarian algorithm on the reduced graph; (4) publish matched
          pairs and update driver availability atomically. For global scale,
          partition by geographic region and solve independently per region with
          occasional cross-region rebalancing. Online matching algorithms
          (RANKING-style) are used when batching is not possible: they
          achieve 1 &minus; 1/e approximation in expectation without lookahead. The
          system must also handle driver cancellations and surge pricing as
          dynamic edge-weight updates, triggering re-matching for affected
          pairs only rather than rerunning the full algorithm.
        </HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
