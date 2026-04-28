"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "graph",
  title: "Graph Pattern",
  description:
    "BFS, DFS, Dijkstra, topological sort, and the engineering choices behind graph representation, traversal, and shortest-path algorithms.",
  category: "other",
  subcategory: "patterns",
  slug: "graph",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-26",
  tags: ["graph", "bfs", "dfs", "dijkstra", "leetcode", "patterns"],
  relatedTopics: ["heap", "union-find", "tree"],
};

export default function GraphArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
      <p className="mb-4">
        A graph is a set of vertices joined by edges. Edges may be directed or undirected,
        weighted or unweighted, and the overall structure may contain cycles or be acyclic. The
        graph pattern in coding interviews encompasses dozens of named algorithms — BFS, DFS,
        Dijkstra, Bellman-Ford, Floyd-Warshall, Kruskal, Prim, Tarjan, Kosaraju, Kahn — but the
        engineering practice reduces to a small decision tree: identify the shape of the graph
        and the question being asked, and the right algorithm becomes immediate.
      </p>
      <p className="mb-4">
        Recognition signals split into two layers. The first is whether the problem is
        explicitly graph-shaped: nodes-and-edges, networks, dependencies, social connections,
        word transformations. The second is whether a problem with a different surface shape
        hides a graph: a 2-D grid is a graph where each cell connects to four (or eight)
        neighbours; a word ladder is a graph where each word connects to all words one letter
        away; a tree is a graph with V − 1 edges and no cycles.
      </p>
      <p className="mb-4">
        The pattern matters at staff level because it covers a disproportionate share of the
        Leetcode hard tier and the system-design coding rounds. Routing in distributed systems
        is graph shortest path; dependency resolution in package managers is topological sort;
        connected-component analysis underpins social-graph segmentation, fraud detection, and
        circuit verification. Mastering the abstraction transfers cleanly to real systems.
      </p>
      <p className="mb-4">
        At the deepest level, the graph pattern teaches a single discipline: how to represent
        problem state as nodes and transitions as edges, then apply a generic search. Many
        problems labelled &quot;dynamic programming&quot; or &quot;backtracking&quot; are really
        graph problems on the implicit state graph, and recognising that lifts them from
        intractable to mechanical.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
      <p className="mb-4">
        <strong>Representation choices.</strong> Adjacency list (a map from node to list of
        neighbours) is the default — O(V + E) memory, O(degree) iteration. Adjacency matrix (a
        boolean V-by-V matrix) is right for dense graphs and O(1) edge-existence queries but
        wastes memory on sparse graphs. Edge list (an array of triples) is right for algorithms
        that iterate edges directly, like Kruskal&apos;s MST and Bellman-Ford. Implicit graphs
        compute neighbours on the fly — grid traversal, word-ladder transitions, bit-flip moves.
      </p>
      <p className="mb-4">
        <strong>Visited tracking.</strong> Every traversal needs to mark visited nodes to avoid
        infinite loops in cyclic graphs. Use a hash set (general nodes), a boolean array (nodes
        identified by integer), or in-place markers on the input (mutate the grid by writing
        sentinel values). Mark at push time for BFS, not pop time — otherwise the same node is
        pushed many times, and the queue can grow exponentially.
      </p>
      <p className="mb-4">
        <strong>BFS.</strong> Queue-based, level-by-level traversal. Optimal for shortest paths
        in unweighted graphs because every edge has cost 1, and the first time the queue reaches
        a node is along a minimum-edge-count path. Time O(V + E), space O(V) for the queue.
        Variants: multi-source BFS (push all sources at start), bidirectional BFS (search from
        both source and target, meet in the middle), 0-1 BFS (deque-based, edges with weight 0
        front-pushed and weight 1 back-pushed).
      </p>
      <p className="mb-4">
        <strong>DFS.</strong> Recursive or stack-based, depth-first traversal. Used for
        connectivity, cycle detection, topological sort via post-order, strongly connected
        components, and any problem where you need to recurse on subtrees and aggregate results.
        Time O(V + E), space O(V) for recursion stack. Iterative DFS is mandatory for graphs
        large enough to blow the call stack.
      </p>
      <p className="mb-4">
        <strong>Dijkstra.</strong> Greedy shortest path on graphs with non-negative weights.
        Maintains a min-heap of (distance, node), repeatedly extracting the closest unvisited
        node and relaxing its outgoing edges. Time O((V + E) log V) with a binary heap. Fails on
        negative edges because the first time a node is popped is no longer guaranteed final.
      </p>
      <p className="mb-4">
        <strong>Bellman-Ford.</strong> Single-source shortest path that handles negative weights
        (and detects negative cycles). Relaxes every edge V − 1 times. Time O(V * E). Slow but
        general.
      </p>
      <p className="mb-4">
        <strong>Floyd-Warshall.</strong> All-pairs shortest path via dynamic programming over
        intermediate nodes. Time O(V³). Right when V is small (a few hundred) and you need
        distances between every pair.
      </p>
      <p className="mb-4">
        <strong>Topological sort.</strong> Linear ordering of a DAG such that every edge points
        forward in the ordering. Two implementations: Kahn&apos;s algorithm (repeatedly emit a
        zero-in-degree node, decrement neighbours&apos; in-degrees) and DFS post-order (recurse,
        prepend on return). Cycle detection falls out: if Kahn cannot drain all nodes, a cycle
        exists.
      </p>
      <p className="mb-4">
        <strong>Union-Find.</strong> Disjoint-set data structure for connectivity queries with
        near-O(1) per operation. Right for static connectivity, MST construction (Kruskal), and
        any problem where edges arrive online and you need fast same-component checks.
      </p>
      <ArticleImage src="/diagrams/other/leetcode/patterns/graph-diagram-1.svg" alt="Graph representation and algorithm choice" />

      <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
      <p className="mb-4">
        The BFS template: initialise a queue with the source, a visited set with the source, and
        a distance counter. Pop the front; for each unvisited neighbour, mark visited and push.
        For shortest-path problems, increment a depth counter at each &quot;level&quot; (process
        the current queue size before reading new pushes). For multi-source BFS (rotting oranges,
        walls and gates), push all sources at depth 0 — the BFS naturally finds the minimum
        distance from any source to each cell.
      </p>
      <p className="mb-4">
        The DFS template: a recursive function dfs(node) that marks node as visited, processes
        the node, then recurses on each unvisited neighbour. For cycle detection, use three
        colours — white (unseen), grey (in current call stack), black (fully explored) — and
        flag a cycle when an edge reaches a grey node. For topological sort via DFS, push the
        node onto an output stack on the way back up; the reverse of pop order is the topological
        order.
      </p>
      <p className="mb-4">
        The Dijkstra template: distance map initialised to infinity, source distance 0, push
        (0, source) into a min-heap. Loop: pop (d, u); if d is greater than the recorded
        distance, skip (lazy delete); otherwise relax each neighbour v with new distance d +
        w(u, v); if shorter, update the map and push (new_d, v). Terminate when the heap is
        empty or when the target is popped.
      </p>
      <p className="mb-4">
        The Kahn topological sort template: compute in-degree for every node; push all
        zero-in-degree nodes into a queue; repeatedly pop, append to output, decrement
        in-degree of each neighbour, push neighbours that newly hit zero. If the output length
        equals V, done; otherwise, a cycle exists.
      </p>
      <p className="mb-4">
        The grid-as-graph template: define neighbours as four (or eight) offset pairs. Inline
        bounds checks in the neighbour iteration. Reuse BFS or DFS unchanged. The grid is
        almost always handled implicitly, never built into an adjacency list explicitly — the
        offset arithmetic is its own representation.
      </p>
      <p className="mb-4">
        The bidirectional BFS template (word ladder optimisation): maintain two frontier sets,
        one from source and one from target. At each step, expand the smaller frontier by one
        layer. Terminate when the frontiers intersect. Halves the search depth, so for
        branching factor b and answer depth d, total work is 2 * b^(d/2) instead of b^d — a
        massive speed-up for word-ladder-class problems.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
      <p className="mb-4">
        <strong>BFS vs. DFS for reachability.</strong> Both are O(V + E) and find a path. BFS
        finds the shortest path (in unweighted graphs), DFS does not. For pure reachability,
        DFS is simpler to write recursively. For shortest path, BFS only.
      </p>
      <p className="mb-4">
        <strong>BFS vs. Dijkstra.</strong> BFS is O(V + E) for unweighted graphs. Dijkstra is
        O((V + E) log V) for non-negative weights. Use BFS when all edges have equal weight;
        Dijkstra otherwise. The cost difference is the heap.
      </p>
      <p className="mb-4">
        <strong>Dijkstra vs. Bellman-Ford.</strong> Dijkstra is faster (O((V+E) log V) vs. O(V
        * E)) but cannot handle negative weights. Bellman-Ford is correct on negative weights and
        detects negative cycles. Default Dijkstra; switch to Bellman-Ford only when negatives
        appear.
      </p>
      <p className="mb-4">
        <strong>Floyd-Warshall vs. running Dijkstra V times.</strong> Both compute all-pairs
        shortest paths. Floyd-Warshall is O(V³); running Dijkstra V times is O(V * (V + E) log
        V), which is faster on sparse graphs and slower on dense graphs. Floyd-Warshall is also
        much simpler and often the right answer when V is small.
      </p>
      <p className="mb-4">
        <strong>Union-Find vs. BFS / DFS for connectivity.</strong> Union-Find is right for
        online problems where edges arrive sequentially and you need same-component queries
        between additions. BFS / DFS recompute components from scratch and are simpler when the
        graph is static.
      </p>
      <p className="mb-4">
        <strong>Topological sort: Kahn vs. DFS post-order.</strong> Kahn produces the
        lexicographically smallest topological order (with a min-heap as the queue) and detects
        cycles cleanly. DFS post-order is more elegant and recursive but harder to extend with
        ordering preferences. Both are O(V + E).
      </p>
      <p className="mb-4">
        <strong>Implicit vs. explicit graph.</strong> Building an adjacency list when neighbours
        are computable on the fly wastes memory. For grids, word ladders, and bit-flip puzzles,
        compute neighbours inline in the BFS loop.
      </p>
      <ArticleImage src="/diagrams/other/leetcode/patterns/graph-diagram-2.svg" alt="BFS vs. DFS comparison" />

      <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
      <p className="mb-4">
        <strong>Mark visited at push time, not pop time.</strong> The most common BFS bug. If
        you mark on pop, the same node can be pushed multiple times by different predecessors,
        and the queue grows exponentially.
      </p>
      <p className="mb-4">
        <strong>Use iterative DFS for large graphs.</strong> Recursion depth in JavaScript is
        ~10K; in Python, default 1000 (raise with sys.setrecursionlimit). For graphs that can
        exceed these, use an explicit stack.
      </p>
      <p className="mb-4">
        <strong>For grids, define directions as a constant array.</strong> int[][] dirs = {`{`}
        {`{-1, 0}, {1, 0}, {0, -1}, {0, 1}`}{`}`} (or the eight-direction equivalent). Loop over
        dirs in the BFS / DFS body.
      </p>
      <p className="mb-4">
        <strong>For Dijkstra, lazy-delete via the popped distance check.</strong> When you pop
        (d, u) and d is greater than dist[u], skip — this is a stale entry from a previous push.
        Avoids implementing decrease-key.
      </p>
      <p className="mb-4">
        <strong>For BFS shortest path, track depth explicitly.</strong> Either store (node,
        depth) in the queue or use a level-by-level loop that processes the entire current
        queue before incrementing depth.
      </p>
      <p className="mb-4">
        <strong>Confirm whether the graph is directed before coding.</strong> Many bugs come
        from treating a directed graph as undirected (or vice versa) by adding edges only one
        way (or both ways). Re-read the problem.
      </p>
      <p className="mb-4">
        <strong>For topological sort, compute in-degrees first.</strong> Two passes: build the
        graph and in-degree count, then drain. Cleaner than building during the drain.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
      <p className="mb-4">
        <strong>Marking visited on pop.</strong> Causes exponential queue growth and wrong
        complexity.
      </p>
      <p className="mb-4">
        <strong>Using BFS on weighted graphs.</strong> BFS minimises edge count, not edge
        weight. Wrong on weighted graphs unless all weights are equal.
      </p>
      <p className="mb-4">
        <strong>Using Dijkstra on negative weights.</strong> Once a node is popped, Dijkstra
        assumes its distance is final; negative edges can later reduce it. Correct algorithm:
        Bellman-Ford.
      </p>
      <p className="mb-4">
        <strong>Recursion stack overflow.</strong> Deep DFS on a chain-like graph blows the
        stack. Use iterative DFS or raise the recursion limit.
      </p>
      <p className="mb-4">
        <strong>Forgetting to handle cycles in DFS.</strong> Without a visited set, DFS on a
        cyclic graph is non-terminating. Even on trees, double edges or self-loops can create
        problems.
      </p>
      <p className="mb-4">
        <strong>Wrong direction in topological sort.</strong> Edge u → v means u must come
        before v. In Kahn, decrement v&apos;s in-degree when u is removed. Confusing the
        direction inverts the answer.
      </p>
      <p className="mb-4">
        <strong>Off-by-one in grid bounds.</strong> Forgetting to check 0 ≤ r &lt; rows and 0 ≤
        c &lt; cols crashes on out-of-bounds access. Bake the check into a helper.
      </p>
      <p className="mb-4">
        <strong>Re-pushing in BFS for the same node from different parents.</strong> Without
        visited-on-push, the same node enters the queue many times.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases (Canonical Leetcode)</h2>
      <p className="mb-4">
        <strong>200. Number of Islands.</strong> Grid traversal. DFS or BFS or Union-Find. Each
        unvisited land cell starts a new component; flood-fill marks all connected cells.
      </p>
      <p className="mb-4">
        <strong>695. Max Area of Island.</strong> Variant of 200; DFS returns the area of each
        component, take the max.
      </p>
      <p className="mb-4">
        <strong>133. Clone Graph.</strong> BFS or DFS with a hashmap from original node to
        clone. Push the source clone, expand, copy edges to cloned neighbours.
      </p>
      <p className="mb-4">
        <strong>994. Rotting Oranges.</strong> Multi-source BFS — all rotten oranges start at
        depth 0; track the maximum depth reached. Tests recognition of multi-source.
      </p>
      <p className="mb-4">
        <strong>1091. Shortest Path in Binary Matrix.</strong> Eight-direction BFS. Plain
        unweighted shortest path on the grid.
      </p>
      <p className="mb-4">
        <strong>127. Word Ladder.</strong> Implicit graph, BFS or bidirectional BFS. The
        canonical &quot;treat each transformation as an edge&quot; problem.
      </p>
      <p className="mb-4">
        <strong>743. Network Delay Time.</strong> Dijkstra single-source. Reports the maximum
        finalised distance — that is the time the last node receives the signal.
      </p>
      <p className="mb-4">
        <strong>787. Cheapest Flights Within K Stops.</strong> Modified Dijkstra (push state
        with stop count) or Bellman-Ford limited to K + 1 relaxations.
      </p>
      <p className="mb-4">
        <strong>1631. Path with Minimum Effort.</strong> Dijkstra on grid where edge cost is
        the absolute height difference and the path cost is the maximum edge along the path.
        Push (effort_so_far, r, c).
      </p>
      <p className="mb-4">
        <strong>207 / 210. Course Schedule I and II.</strong> Topological sort. I returns a
        boolean (cycle?), II returns an order. Kahn or DFS post-order.
      </p>
      <p className="mb-4">
        <strong>269. Alien Dictionary.</strong> Build the graph from word ordering, topological
        sort. Tests construction of the graph from input rules.
      </p>
      <p className="mb-4">
        <strong>684. Redundant Connection.</strong> Union-Find — the first edge that joins two
        already-connected nodes is the redundant one.
      </p>
      <ArticleImage src="/diagrams/other/leetcode/patterns/graph-diagram-3.svg" alt="Canonical graph Leetcode problems" />

      <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li><strong>BFS or DFS for shortest path?</strong> BFS for unweighted, Dijkstra for
        non-negative weighted, Bellman-Ford for negative weighted, Floyd-Warshall for all-pairs
        on small graphs.</li>
        <li><strong>Why mark visited on push, not pop?</strong> Marking on pop allows the same node
        to be pushed many times by different predecessors before its first pop, blowing up the
        queue.</li>
        <li><strong>Why does Dijkstra fail on negative edges?</strong> Once popped, a node&apos;s
        distance is treated as final. Negative edges discovered later could reduce that
        distance, but the algorithm has moved on.</li>
        <li><strong>How do you detect a cycle in a directed graph?</strong> DFS with three colours,
        or Kahn&apos;s algorithm if it cannot drain all nodes. Both are O(V + E).</li>
        <li><strong>What is the time complexity of BFS / DFS?</strong> O(V + E). Each vertex is
        visited once, each edge is traversed once (or twice for undirected adjacency lists).</li>
        <li><strong>How do you find connected components efficiently?</strong> BFS / DFS for
        offline static graphs in O(V + E). Union-Find for online edge insertions in
        near-constant per operation.</li>
        <li><strong>How do you do bidirectional BFS?</strong> Two visited sets, two frontiers. At
        each step, expand the smaller frontier. Terminate when an expansion produces a node
        already in the other visited set.</li>
        <li><strong>What does topological sort require?</strong> A directed acyclic graph. If a
        cycle exists, no topological order exists; the algorithm returns a partial order or
        flags a cycle.</li>
        <li><strong>How is grid BFS different from generic BFS?</strong> The neighbours are
        computed implicitly from offsets; no adjacency list is built. Otherwise identical.</li>
        <li><strong>How would you handle a graph that does not fit in memory?</strong> Streaming
        algorithms over edge lists (Bellman-Ford), external-memory graph storage with vertex
        and edge files, or graph-database engines. Out of scope for in-memory interview, but
        worth mentioning at staff level.</li>
      </ol>
<h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Cormen, Leiserson, Rivest, Stein, <em>Introduction to Algorithms</em>, Part VI
        (chapters 22–26): graph algorithms, BFS, DFS, topological sort, Dijkstra, Bellman-Ford,
        Floyd-Warshall, Kruskal, Prim. Sedgewick, <em>Algorithms</em>, 4th ed., chapter 4 covers
        graph processing comprehensively.</li>
        <li>Leetcode tags &quot;graph&quot;, &quot;breadth-first search&quot;, &quot;depth-first
        search&quot;, &quot;topological sort&quot;, and &quot;shortest path&quot;. Grokking the
        Coding Interview&apos;s graph patterns. NeetCode 150 covers 200, 133, 207, 210, 994,
        743, 1584, 332.</li>
        <li>For deeper reading: Kleinberg and Tardos, <em>Algorithm Design</em>, chapter 3 on
        graphs and chapter 4 on greedy algorithms (MST, Dijkstra). For implementation
        engineering, the Boost Graph Library and the Stanford CS 261 lecture notes are good
        references.</li>
      </ul>
    </ArticleLayout>
  );
}
