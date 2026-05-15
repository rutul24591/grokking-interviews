"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-other-dsa-algorithms-maximum-flow",
  title: "Maximum Flow — Ford-Fulkerson, Edmonds-Karp &amp; Dinic's",
  description:
    "Maximum flow algorithms find the greatest feasible flow through a capacity-constrained network from source to sink — the foundation of network reliability, bipartite matching, and assignment problems.",
  category: "other",
  subcategory: "data-structures-algorithms",
  slug: "maximum-flow",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-05-15",
  tags: [
    "maximum-flow",
    "ford-fulkerson",
    "edmonds-karp",
    "dinics",
    "min-cut",
    "graphs",
  ],
  relatedTopics: ["graphs", "bfs", "dfs", "bipartite-matching"],
};

export default function MaximumFlowArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">
          1. Definition &amp; Context
        </h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: maximum flow is one of the most powerful modeling
          tools in algorithmic problem-solving. Recognizing that a real-world
          problem reduces to max flow — and knowing which algorithm to reach for
          — separates mid-level from senior and staff candidates.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          A <em>flow network</em> is a directed graph G = (V, E) in which every
          edge (u, v) carries a non-negative <em>capacity</em> c(u, v)
          representing the maximum rate at which something can travel along that
          edge. Two distinguished vertices exist: a <em>source</em> s that
          produces flow and a <em>sink</em> t that consumes it. A valid flow
          assigns a value f(u, v) to each edge satisfying two conditions.
          First, the <em>capacity constraint</em>: 0 &#8804; f(u, v) &#8804;
          c(u, v). Second, <em>flow conservation</em>: for every vertex that is
          neither s nor t, the total flow entering equals the total flow leaving.
          The <em>value</em> of a flow is the net flow out of the source, which
          by conservation also equals the net flow into the sink.
        </HighlightBlock>
        <p>
          The <em>maximum flow problem</em> asks: given the network, what is the
          largest flow value achievable? The question appears abstract until you
          realize it models an enormous range of practical situations — moving
          goods through a logistics network, routing packets through an
          internet, matching workers to jobs, identifying the smallest set of
          edges whose removal disconnects a network, and segmenting images in
          computer vision. Each of these problems reduces to finding the maximum
          flow (or the dual minimum cut) in a carefully constructed graph.
        </p>
        <p>
          At staff and principal level, interviewers expect you to model the
          problem as a flow network from scratch, choose the correct algorithm
          for the graph structure, reason about complexity and termination, and
          connect max flow to the dual min-cut structure. The three canonical
          algorithms — Ford-Fulkerson, Edmonds-Karp, and Dinic's — each embody
          a distinct insight, and the differences between them reveal deep
          structure in the problem.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: the residual graph is the central data structure for
          all augmenting-path algorithms. Candidates who can reason about it
          fluently — including why backward edges are necessary — demonstrate
          genuine understanding rather than rote memorization.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The <em>residual graph</em> G&#8339; = (V, E&#8339;) is derived from
          the original network after some flow has been assigned. For each edge
          (u, v) in the original graph, the residual graph contains a{" "}
          <em>forward edge</em> (u, v) with residual capacity r(u, v) = c(u, v)
          &minus; f(u, v) — the remaining room to push more flow. It also
          contains a <em>backward edge</em> (v, u) with residual capacity
          r(v, u) = f(u, v) — the amount of existing flow that can be
          cancelled. The backward edges are not just a bookkeeping trick; they
          represent genuine freedom to reroute flow and are essential for
          correctness. Without them, a greedy algorithm could make a locally
          sensible choice that globally prevents the optimum.
        </HighlightBlock>
        <p>
          An <em>augmenting path</em> is any directed path from s to t in the
          residual graph in which every edge has strictly positive residual
          capacity. The <em>bottleneck capacity</em> of such a path is the
          minimum residual capacity among all its edges — the maximum additional
          flow we can push along the path. The <em>augmentation step</em>
          pushes that bottleneck amount along the path: for each forward edge
          (u, v) on the path, increase f(u, v) by the bottleneck; for each
          backward edge (v, u) on the path, decrease f(v, u) by the bottleneck.
          After augmentation, the residual graph is updated accordingly.
        </p>
        <p>
          The fundamental theorem underlying all augmenting-path algorithms is
          that a flow is maximum if and only if there is no augmenting path in
          the residual graph. This equivalence is the core of the Max-Flow
          Min-Cut theorem, explored in section 7. Every algorithm in this family
          — Ford-Fulkerson, Edmonds-Karp, Dinic's, push-relabel — can be seen
          as a different strategy for choosing which augmenting path to take and
          how many to take at once, with the algorithms differing in worst-case
          complexity and practical performance.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">
          3. Ford-Fulkerson Algorithm
        </h2>
        <HighlightBlock as="p" tier="important">
          Ford-Fulkerson (1956) is the founding algorithm of the maximum flow
          family. Its simplicity is its virtue and its limitation. Start with
          zero flow on every edge. Repeatedly find any augmenting path from s to
          t in the residual graph using DFS, compute the bottleneck capacity,
          and augment. Stop when no augmenting path exists.
        </HighlightBlock>
        <p>
          The complexity of Ford-Fulkerson is O(E &#215; |f*|) where |f*| is
          the value of the maximum flow. For each augmentation, DFS costs O(E)
          and the flow value increases by at least 1 (assuming integer
          capacities), giving at most |f*| iterations. This bound is deceptive:
          on networks where |f*| is enormous — think of a network with edges of
          capacity 10&#8313; — Ford-Fulkerson can perform billions of
          augmentations even on a graph with four vertices.
        </p>
        <p>
          With integer capacities, Ford-Fulkerson always terminates and
          produces the correct answer. The danger arises with irrational
          capacities. Zwick demonstrated a counterexample in which DFS
          consistently chooses augmenting paths that increase the flow by a
          geometrically decreasing amount, and the algorithm converges to a
          suboptimal flow value rather than the maximum. In practice this means
          you should never run Ford-Fulkerson with floating-point capacities
          derived from measurements or machine-learned scores — the termination
          guarantee evaporates.
        </p>
        <p>
          Despite its limitations, Ford-Fulkerson builds the right intuition.
          It is the algorithm to reach for in a whiteboard interview when the
          problem is small and capacities are small integers. Recognizing when
          Ford-Fulkerson suffices — and when you need something stronger — is
          itself a valuable skill.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Edmonds-Karp</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: Edmonds-Karp is the canonical "safe" implementation
          of Ford-Fulkerson. Being able to state why it is polynomial —
          specifically the non-decreasing shortest-path length argument — is a
          standard mid-level question.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Edmonds-Karp (1972) is Ford-Fulkerson with a single change: always
          choose the <em>shortest</em> augmenting path measured in number of
          edges, found with BFS. This one modification turns an algorithm with
          exponential worst-case behavior into a polynomial-time algorithm with
          complexity O(VE&#178;).
        </HighlightBlock>
        <p>
          The key insight is a monotonicity lemma: the length of the shortest
          augmenting path (in hops) is non-decreasing over the course of the
          algorithm. This is because augmenting along a shortest path can only
          eliminate edges from the residual graph or add backward edges that
          lengthen future paths — it can never create a shorter s-to-t path
          than already existed. Since the shortest path length can increase at
          most O(V) times (it is bounded by V &minus; 1), and each "phase" in
          which the shortest path length is a fixed value d contributes at most
          O(E) augmentations (because each augmentation saturates at least one
          edge, which can only be restored via a backward edge at a longer
          path length), the total number of augmentations is at most O(VE).
          Each augmentation runs BFS in O(E), giving O(VE&#178;) overall.
        </p>
        <p>
          O(VE&#178;) is polynomial in the graph size and independent of the
          capacity values. This makes Edmonds-Karp safe with irrational or
          large capacities, unlike Ford-Fulkerson. It is the baseline
          production-quality algorithm when you need maximum flow but the graph
          is not large enough to justify implementing Dinic's. For graphs with
          V up to a few thousand and E up to tens of thousands, Edmonds-Karp
          runs easily in time.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Dinic's Algorithm</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: Dinic's is the go-to algorithm for any serious
          maximum flow application. Its O(V&#178;E) bound and O(E&#8730;V) on
          unit-capacity graphs make it the right answer for competitive
          programming, bipartite matching, and production systems alike.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Dinic's algorithm (1970, published by Yefim Dinitz) achieves better
          complexity than Edmonds-Karp by augmenting multiple paths in a single
          phase rather than one at a time. Each phase has two parts. First, run
          BFS from s on the residual graph to build a <em>level graph</em>:
          assign each vertex a level equal to its BFS distance from s, and keep
          only edges (u, v) where level(v) = level(u) + 1. The level graph
          includes only edges that are on some shortest augmenting path. Second,
          find a <em>blocking flow</em> in the level graph using DFS with
          dead-end pruning: when DFS reaches a dead end (no outgoing edges in
          the level graph), it trims that vertex and backtracks. A blocking flow
          saturates at least one edge on every path from s to t through the
          level graph, not just one path at a time.
        </HighlightBlock>
        <p>
          The complexity argument follows from two observations. First, each BFS
          phase increases the shortest augmenting path length by at least 1 —
          because augmenting along the blocking flow eliminates all shortest
          paths of the current length. Since the shortest path length is at most
          V &minus; 1, there are at most O(V) phases. Second, within each phase,
          the blocking flow computation visits each edge at most twice (once
          forward in DFS, once as a dead end), costing O(VE) per phase in the
          naive analysis. The total is O(V&#178;E).
        </p>
        <p>
          For <em>unit-capacity graphs</em> — where every edge has capacity 1
          — Dinic's runs in O(E&#8730;V). The reason is that in unit graphs, the
          blocking flow consists of edge-disjoint paths and the number of phases
          is bounded by O(&#8730;V) by an argument similar to Hopcroft-Karp. This
          gives Dinic's its particularly attractive complexity for bipartite
          matching, where the natural flow graph has unit capacities.
        </p>
        <p>
          In practice, Dinic's algorithm is 10 to 100 times faster than
          Edmonds-Karp on the same inputs because the blocking flow phase does
          far more useful work per BFS traversal. On competitive programming
          judges and in production systems, Dinic's is the standard choice. The
          implementation is more involved than Edmonds-Karp — you need to manage
          the level graph and implement DFS with dead-end pruning via a "current
          edge" pointer — but the payoff in performance is decisive.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">
          6. Architecture &amp; Flow
        </h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: the diagram below shows the four interconnected
          concepts — flow network structure, the two foundational algorithms,
          Dinic's level-graph strategy, and the Min-Cut duality — and how they
          compose into the complete theoretical picture.
        </HighlightBlock>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/maximum-flow-architecture.svg"
          alt="Maximum Flow architecture: flow networks, Ford-Fulkerson, Edmonds-Karp, Dinic's, and Min-Cut"
          caption="Four-quadrant view of maximum flow: flow network fundamentals, Ford-Fulkerson and Edmonds-Karp, Dinic's level-graph algorithm, and Min-Cut duality with applications."
        />
        <p>
          The diagram maps the conceptual dependencies. Section A (flow network
          and residual graph) is the foundation on which everything else rests.
          Sections B and C are successive algorithmic improvements that use the
          same residual-graph primitive but different path-selection strategies.
          Section D (Min-Cut) is the dual theory that gives maximum flow its
          breadth of application, since many real-world problems are naturally
          stated as cut problems whose solutions follow from the Max-Flow
          Min-Cut theorem.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">
          7. Max-Flow Min-Cut Theorem
        </h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: the Max-Flow Min-Cut theorem is one of the most
          elegant results in combinatorial optimization. Senior candidates are
          expected to state it, sketch the proof, and explain how to recover the
          min cut from the residual graph after computing max flow.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          A <em>cut</em> in a flow network is a partition of V into two sets S
          and T = V &#8726; S such that s &#8712; S and t &#8712; T. The
          <em> capacity</em> of a cut (S, T) is the sum of capacities of edges
          from S to T (edges in the reverse direction, from T to S, do not
          count). The <em>Min-Cut theorem</em> states: the maximum flow value
          equals the minimum cut capacity. This is the Max-Flow Min-Cut theorem,
          proved by Ford and Fulkerson (1956) and independently by Elias, Feinstein,
          and Shannon the same year.
        </HighlightBlock>
        <p>
          The proof is a three-way equivalence. The following are equivalent for
          a flow f: (1) f is a maximum flow; (2) there is no augmenting path in
          the residual graph G&#8339;; (3) there exists a cut (S, T) whose
          capacity equals |f|. The direction from (1) to (2) is clear — if an
          augmenting path existed, we could increase the flow. The direction from
          (2) to (3) constructs the min cut: let S be the set of vertices
          reachable from s in G&#8339; when no augmenting path exists. Then t is
          not in S (otherwise an augmenting path would exist). Every edge from S
          to T in the original graph must be saturated (zero residual forward
          capacity), and every edge from T to S must carry zero flow (zero
          residual backward capacity). The cut capacity therefore equals exactly
          |f|. The direction from (3) to (1) follows from the observation that
          any cut capacity is an upper bound on any flow value.
        </p>
        <p>
          To <em>find</em> the minimum cut after computing maximum flow, run BFS
          on the residual graph from s. The set S of vertices reachable from s is
          one side of the min cut. The set T = V &#8726; S is the other side.
          The edges of the original graph crossing from S to T — that is, edges
          (u, v) where u &#8712; S and v &#8712; T — form the minimum cut.
          These are exactly the edges fully saturated by the maximum flow. In
          many applications, the min cut is the object of interest and the max
          flow is merely the means of computing it.
        </p>
        <p>
          Applications of min cut span a wide range. In network reliability
          analysis, the min cut identifies the smallest set of links whose
          failure disconnects the source from the sink. In project selection
          problems, a min cut determines which projects to execute given revenue
          and dependency constraints. In image segmentation, the graph-cut
          formulation models pixel-label assignment as a min cut, enabling
          globally optimal segmentation in polynomial time.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">
          8. Bipartite Matching via Max Flow
        </h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: modeling bipartite matching as a max flow problem is
          a required skill for senior and staff interviews. The reduction is
          clean, the complexity of Dinic's on unit graphs is O(E&#8730;V), and
          understanding why demystifies Hopcroft-Karp.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Given a bipartite graph with left vertices L and right vertices R and
          edges representing feasible pairings, construct a flow network as
          follows. Add a source s connected to each vertex in L with an edge of
          capacity 1. For each edge (u, v) in the bipartite graph with u &#8712; L
          and v &#8712; R, add an edge of capacity 1. Add an edge from each
          vertex in R to the sink t with capacity 1. Run maximum flow on this
          network. The value of the maximum flow equals the size of the maximum
          matching, and the flow on each bipartite edge indicates whether that
          edge is in the matching.
        </HighlightBlock>
        <p>
          The unit capacities mean that each left vertex can be matched to at
          most one right vertex (edge from s has capacity 1) and each right
          vertex can be matched to at most one left vertex (edge to t has
          capacity 1). Every integer-valued flow corresponds directly to a valid
          matching. Since the integrality theorem guarantees that when all
          capacities are integers there exists an optimal integer-valued flow,
          and since our capacities are all 1, the correspondence is exact.
        </p>
        <p>
          When run with Dinic's algorithm, bipartite matching completes in
          O(E&#8730;V). The argument: augmenting paths in this flow network have
          length at most 2&#8730;V + 1 before the first &#8730;V BFS phases complete.
          After &#8730;V phases, every remaining augmenting path has length greater
          than 2&#8730;V, and there can be at most &#8730;V such paths (since each
          augmenting path contributes 1 to the matching, and the maximum matching
          size is at most min(|L|, |R|) &#8804; V). The remaining phases handle
          O(&#8730;V) augmentations at O(E) each. Total: O(&#8730;V &#215; E +
          &#8730;V &#215; E) = O(E&#8730;V). This recovers the Hopcroft-Karp
          complexity via the general Dinic's framework.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. Trade-offs</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: knowing which algorithm to choose — and being able to
          justify the choice in terms of graph structure and capacity type — is
          the hallmark of an engineer who genuinely understands the material
          rather than just knowing the names.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Ford-Fulkerson</strong> is appropriate only when capacities
          are small non-negative integers and the graph is small. Its O(E
          &#215; |f*|) complexity is exponential in the capacity values in the
          worst case, and it can fail to terminate with irrational capacities.
          Its sole advantage is simplicity: the conceptual model is exactly one
          DFS per augmentation, which makes it ideal for teaching and for
          back-of-envelope analysis.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Edmonds-Karp</strong> is the safe general-purpose choice when
          you need a polynomial guarantee and the graph is moderate-sized (V up
          to a few thousand, E up to tens of thousands). O(VE&#178;) is
          polynomial in graph size and independent of capacity values, making it
          correct for floating-point and large-integer capacities. Use it as a
          correctness baseline or when implementing Dinic's is not worth the
          complexity.
        </HighlightBlock>
        <p>
          <strong>Dinic's</strong> is the practical choice for all serious
          maximum flow applications. Its O(V&#178;E) general bound and O(E&#8730;V)
          on unit-capacity graphs make it the right answer for competitive
          programming and production systems alike. The extra implementation
          complexity — building a level graph, implementing DFS with current-edge
          pointers for dead-end pruning — is a one-time cost that pays for
          itself immediately on non-trivial inputs. For bipartite matching, image
          segmentation, and network flow problems with hundreds of thousands of
          vertices, Dinic's is the only practical algorithm.
        </p>
        <p>
          <strong>Push-relabel</strong> deserves an honorable mention. The
          Goldberg-Tarjan push-relabel algorithm (1988) achieves O(V&#178;&#8730;E)
          on general graphs, which beats Dinic's for dense graphs (E = &#920;(V&#178;)).
          It works by maintaining a "preflow" — a flow that may violate
          conservation at intermediate vertices — and iteratively pushing excess
          flow toward the sink using vertex heights. In practice, push-relabel
          with gap heuristic is competitive with Dinic's and often faster on
          dense networks such as image segmentation grids.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">10. Best Practices</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: the implementation details that separate correct-but-slow
          from correct-and-fast code in a production or contest setting.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Always use Dinic's in practice.</strong> For any flow problem
          that isn't a trivial toy, start with Dinic's. The O(V&#178;E) bound
          means it degrades gracefully on large inputs, and the O(E&#8730;V)
          bound for unit graphs means it is optimal for matching problems. The
          implementation overhead is real but bounded: once you have a clean
          Dinic's template, you can apply it across problem families with minor
          modifications.
        </HighlightBlock>
        <p>
          <strong>Represent edges as paired adjacency-list entries.</strong> The
          canonical implementation stores the forward edge at index 2k and its
          reverse edge at index 2k + 1 in a flat edge array. The reverse of edge
          i is accessed as edge[i &#94; 1] (XOR with 1), which works for both
          original edges (even index) and their reverses (odd index). This avoids
          hash-map lookups and makes residual graph management O(1) per edge.
        </p>
        <p>
          <strong>Initialize reverse edges with zero capacity.</strong> When
          adding an edge (u, v, cap), add a reverse edge (v, u, 0) immediately.
          This ensures the residual graph always has both directions from the
          start. A common mistake is to forget the reverse edge and then wonder
          why the algorithm under-counts the max flow.
        </p>
        <p>
          <strong>Use a current-edge pointer in Dinic's DFS.</strong> The
          critical optimization that makes Dinic's practical is the current-edge
          array: for each vertex, maintain a pointer to the next edge in its
          adjacency list that hasn't yet been determined useless. When DFS
          encounters a dead end at vertex u, advance u's current-edge pointer
          past the failed edge rather than revisiting it. This dead-end pruning
          ensures that the total DFS work per blocking flow phase is O(VE) and
          not O(VE&#178;).
        </p>
        <p>
          <strong>Use 64-bit integers for capacities.</strong> Flows in large
          networks can accumulate into values far exceeding 32-bit range. Even
          moderate graphs with edge capacities of 10&#8310; can produce total
          flows of 10&#8313; or more. Default to 64-bit integers for all capacity
          and flow values unless you have proven the values are small.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">11. Common Pitfalls</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: these are the bugs that cause wrong answers in
          competitive programming and incorrect results in production — knowing
          them in advance saves significant debugging time.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Forgetting backward edges in the residual graph.</strong> The
          most common implementation bug. If you add only forward edges to the
          adjacency list, the algorithm cannot cancel previously routed flow and
          will produce a suboptimal answer. The fix is to always add the reverse
          edge (with zero initial capacity) when adding each original edge. This
          is non-negotiable.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Using Ford-Fulkerson with floating-point capacities.</strong>{" "}
          With irrational or floating-point capacities, Ford-Fulkerson (DFS for
          augmenting paths) can loop indefinitely, converging to a suboptimal
          value. Always use Edmonds-Karp or Dinic's when capacities are
          real-valued, even if they happen to look like integers in your test
          cases.
        </HighlightBlock>
        <p>
          <strong>Integer overflow in large capacity networks.</strong> Summing
          edge capacities of 10&#8313; across a path of 100 edges overflows a 32-bit
          integer. The resulting wrong bottleneck value silently corrupts the
          flow computation. Use 64-bit accumulators and check for overflow in
          stress tests.
        </p>
        <p>
          <strong>Confusing min cut with minimum spanning tree.</strong> A
          minimum cut partitions vertices into two sets and minimizes the total
          capacity of edges crossing the partition. A minimum spanning tree is a
          subgraph that connects all vertices with minimum total edge weight.
          They optimize different objectives on different objects. Min cut is a
          vertex partition; MST is a spanning subgraph. The algorithms, data
          structures, and applications are entirely distinct.
        </p>
        <p>
          <strong>Not resetting the level graph between Dinic's phases.</strong>{" "}
          In Dinic's, the level graph and current-edge pointers must be rebuilt
          from scratch at the start of each BFS phase. Reusing stale level
          assignments from a previous phase causes the DFS to traverse edges
          that are no longer in the residual graph or that no longer lead toward
          the sink, producing incorrect blocking flows.
        </p>
        <p>
          <strong>Off-by-one in BFS distance assignment.</strong> If s is
          assigned level 0 and t is not reached (level remains &minus;1 or
          infinity), the algorithm should terminate. A common bug is to
          incorrectly terminate early (terminating when level[t] equals some
          threshold rather than checking reachability) or to continue past the
          point where t is no longer reachable.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">
          12. Real-World Use Cases
        </h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: demonstrating that you can connect abstract flow
          theory to concrete engineering problems is what elevates a technical
          answer into a system-design answer.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Network routing and bandwidth allocation.</strong> ISPs and
          cloud providers model their backbone networks as flow networks. Maximum
          flow determines the maximum throughput between any two points. Min-cut
          identifies the bottleneck links whose upgrade would most improve
          capacity. Traffic engineering in MPLS networks uses min-cost max-flow
          to route traffic along paths that maximize throughput while minimizing
          delay or cost.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Bipartite matching for assignment problems.</strong> Medical
          school matching (NRMP), job-to-worker assignment in gig platforms,
          course-to-classroom scheduling, and ad-slot-to-advertiser allocation
          all reduce to bipartite matching and thus to max flow. Dinic's
          algorithm's O(E&#8730;V) complexity on unit-capacity graphs makes it
          practical even at the scale of hundreds of thousands of participants.
        </HighlightBlock>
        <p>
          <strong>Image segmentation via graph cuts.</strong> The Boykov-Kolmogorov
          graph-cut algorithm segments images by constructing a flow network in
          which pixels are vertices, neighboring pixels are connected by edges
          (capacity weighted by color similarity), and each pixel is connected
          to both a source (foreground) and a sink (background). The minimum
          cut partitions pixels into foreground and background. This approach
          produces globally optimal segmentations under the Markov random field
          energy model and was the dominant segmentation method before deep
          learning.
        </p>
        <p>
          <strong>Project selection under dependencies.</strong> Given a set of
          projects with revenues (positive or negative) and dependency
          constraints (project A requires project B), the project selection
          problem asks which subset of projects maximizes total profit. It models
          as a min-cut problem: source-connected projects have positive revenue;
          sink-connected projects have cost; dependency edges are infinite
          capacity. The min cut determines which projects to reject. Maximum flow
          computes the optimal selection.
        </p>
        <p>
          <strong>Network reliability analysis.</strong> In infrastructure
          planning, the min cut of a network identifies the smallest set of
          links whose simultaneous failure disconnects the source (a data center)
          from the sink (users). Operators use this to identify single points of
          failure and to verify that redundancy investments actually improve the
          min-cut capacity. Vertex connectivity (maximum flow through a node-split
          graph) identifies critical routers rather than critical links.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">
          13. Interview Questions
        </h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: these questions span junior-mid through staff levels.
          Strong answers go beyond recitation to explain the why, connect to
          adjacent concepts, and reason about edge cases and production
          implications.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>
            Q1 (junior-mid): What is the residual graph and why is it necessary
            for augmenting flow?
          </strong>{" "}
          The residual graph captures both unused capacity (forward edges) and
          the ability to cancel previously committed flow (backward edges). It
          is necessary because a greedy algorithm that only follows forward
          edges can make locally optimal choices that prevent the global optimum.
          For example, routing flow through a shared intermediate vertex can
          block a higher-capacity path. The backward edges in the residual graph
          allow the algorithm to "undo" this routing decision by redirecting flow
          along a path that includes a backward edge over the already-committed
          flow. Without backward edges, augmenting-path algorithms are not
          correct in general.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>
            Q2 (mid): Explain why Edmonds-Karp is guaranteed to terminate while
            Ford-Fulkerson is not.
          </strong>{" "}
          Ford-Fulkerson with DFS augmentation has no control over which path it
          chooses. With irrational capacities, it can repeatedly find paths
          whose bottleneck values form a divergent series summing to less than
          the true maximum flow — causing it to run forever and converge to the
          wrong answer. Edmonds-Karp always uses BFS to find the shortest path
          (fewest edges). The key lemma is that shortest augmenting path lengths
          are non-decreasing over the course of the algorithm. Since path lengths
          are bounded by V &minus; 1 and each length value can persist for at
          most O(E) augmentations before the shortest path length must increase,
          the total number of augmentations is at most O(VE) — finite regardless
          of capacity values.
        </HighlightBlock>
        <p>
          <strong>
            Q3 (mid-senior): How does Dinic's algorithm achieve better
            complexity than Edmonds-Karp?
          </strong>{" "}
          Both algorithms use BFS phases to reason about shortest augmenting
          path lengths, but they differ in how much work they do per phase.
          Edmonds-Karp augments exactly one path per BFS, then rebuilds its
          understanding of shortest paths with another BFS. Dinic's builds an
          entire level graph from BFS and then finds a blocking flow — a set of
          augmenting paths that collectively saturates all shortest paths in one
          DFS traversal. This amortizes the BFS cost over many augmentations per
          phase. The total number of phases is at most O(V), and each phase costs
          O(VE) for the blocking flow, giving O(V&#178;E) versus O(VE&#178;) for
          Edmonds-Karp. On unit graphs, the blocking flow consists of
          vertex-disjoint paths and the number of phases drops to O(&#8730;V),
          giving O(E&#8730;V).
        </p>
        <p>
          <strong>
            Q4 (senior): State and prove the Max-Flow Min-Cut theorem at a high
            level.
          </strong>{" "}
          The theorem states that the value of the maximum flow from s to t
          equals the capacity of the minimum cut separating s from t. Proof: any
          flow f satisfies |f| &#8804; cap(S, T) for every cut (S, T), because
          every unit of flow must cross the cut and the cut capacity bounds the
          total. This gives the weak duality: max flow &#8804; min cut. For
          strong duality, consider the residual graph when the flow is maximum.
          By definition (no augmenting path exists), t is not reachable from s
          in the residual graph. Let S be the set of vertices reachable from s;
          then T = V &#8726; S contains t. Every edge from S to T in the
          original graph is saturated (otherwise it would have positive residual
          and the endpoint in T would be reachable from s). Every edge from T to
          S carries zero flow (otherwise its backward residual edge would make
          the T-endpoint reachable). Therefore the cut capacity equals exactly
          |f|, establishing max flow = min cut.
        </p>
        <p>
          <strong>
            Q5 (senior): How do you model bipartite matching as a max flow
            problem, and what is the complexity with Dinic's?
          </strong>{" "}
          Build a flow network with source s, left vertices L, right vertices R,
          and sink t. Add edges s &#8594; u (capacity 1) for each u &#8712; L,
          edges u &#8594; v (capacity 1) for each bipartite edge (u, v), and
          edges v &#8594; t (capacity 1) for each v &#8712; R. Unit capacities
          ensure each vertex matches to at most one partner. The maximum flow
          equals the maximum matching size, and the integer-flow guarantee
          ensures the flow corresponds to a valid matching. With Dinic's, the
          complexity is O(E&#8730;V) because the network has unit capacities:
          the blocking flow in each phase covers vertex-disjoint augmenting
          paths, the path length increases after O(&#8730;V) phases, and the
          remaining O(&#8730;V) unmatched vertices are resolved in O(&#8730;V)
          more phases at O(E) each.
        </p>
        <p>
          <strong>
            Q6 (staff): You have a job-assignment problem with workers, jobs,
            and constraints. Model it as a min-cost max-flow problem.
          </strong>{" "}
          Extend the bipartite matching model with costs. Each edge (u, v) from
          worker u to job v carries capacity 1 and a cost representing the
          inefficiency or expense of that assignment. The goal is to find the
          maximum matching that also minimizes total assignment cost — that is,
          find the maximum flow whose total cost (sum of cost times flow on each
          edge) is minimized. This is the minimum-cost maximum-flow problem,
          solved by successive shortest-path algorithms (using Bellman-Ford or
          Johnson-reweighted Dijkstra to find minimum-cost augmenting paths) or
          by the network simplex method. The complexity is O(VE log V) with
          Johnson-reweighted Dijkstra for successive shortest paths. In a staff
          interview, you would also discuss how to model additional constraints:
          workers with skills (only some edges exist), jobs with multiple
          slots (capacity greater than 1 on the job-to-sink edge), budget limits
          (a global capacity constraint on total flow), and multi-round
          reassignment (dynamic flow over time steps).
        </p>
      </section>
    </ArticleLayout>
  );
}
