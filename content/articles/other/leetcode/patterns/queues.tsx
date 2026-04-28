"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "queues",
  title: "Queues Pattern",
  description:
    "FIFO scheduling for breadth-first search, level-order traversal, topological sort, and the design problems that pair a queue with a hash map or a fixed-size buffer to hit O(1) per operation.",
  category: "other",
  subcategory: "patterns",
  slug: "queues",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-26",
  tags: ["queue", "leetcode", "patterns", "bfs", "fifo"],
  relatedTopics: ["stack", "monotonic-queue", "graph"],
};

export default function QueuesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
      <p className="mb-4">
        A queue is a first-in, first-out container that exposes O(1) enqueue (push at back), dequeue (pop from
        front), and front peek. As an interview pattern, the queue is the substrate for breadth-first search,
        level-order tree traversal, topological sort, and a family of design problems that compose a queue with
        a hash map or a fixed-size buffer. The signal phrase is &quot;shortest path on an unweighted graph&quot;
        or &quot;level by level&quot;.
      </p>
      <p className="mb-4">
        Three variants matter beyond the base. The <strong>deque</strong> (double-ended queue) supports push
        and pop at both ends in O(1) and is the substrate for sliding windows, palindrome checks, and the
        monotonic-queue pattern. The <strong>priority queue</strong> (heap) replaces insertion-order with
        priority order and powers Dijkstra, top-k, and median-finding. The <strong>circular buffer</strong>
        is a fixed-size ring used in design problems and OS-level streaming. Each shares the FIFO core but
        with different ordering semantics.
      </p>
      <p className="mb-4">
        Recognition signals are precise. &quot;Shortest path&quot; or &quot;minimum number of steps&quot; on
        an unweighted graph or grid — BFS with a queue. &quot;Level order&quot;, &quot;by depth&quot;,
        &quot;every other level&quot;, &quot;right view&quot;, &quot;maximum level depth&quot; on a tree —
        queued level-order traversal. &quot;Order tasks with prerequisites&quot; — Kahn topological sort,
        which is BFS over zero-indegree nodes. &quot;Recent N events&quot; or &quot;ping count in last X
        ms&quot; — sliding-window queue with eviction by age.
      </p>
      <p className="mb-4">
        For staff interviews, the lift is composing a queue with auxiliary structures (visited set, distance
        map, indegree counter, hash map) and choosing the right variant — plain queue vs. deque vs. heap —
        based on the ordering required. The queue is rarely tricky on its own; the trick is the algorithmic
        framing built on top.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
      <p className="mb-4">
        <strong>FIFO invariant.</strong> The element at the front is the oldest still in the queue. In BFS,
        this means the next node to expand is the one closest to the source — every BFS pop is at distance
        d before any node at distance d + 1 is popped. The proof is by induction on enqueue order.
      </p>
      <p className="mb-4">
        <strong>BFS gives shortest paths on unweighted graphs.</strong> When all edges have weight 1, BFS
        explores nodes in order of distance from the source. The first time a node is reached, that
        distance is optimal. Dijkstra reduces to BFS on unweighted graphs because the priority-queue order
        coincides with insertion order.
      </p>
      <p className="mb-4">
        <strong>Visited set is mandatory.</strong> Without it, BFS revisits nodes through different paths
        and the queue grows unboundedly. Mark on enqueue (not on dequeue) to prevent the same node from
        being enqueued twice through two different predecessors at the same distance — a subtle but common
        cause of duplicated work.
      </p>
      <p className="mb-4">
        <strong>Level snapshotting for level-order traversal.</strong> When the question asks for one
        result per level (right view, average per level, alternating zigzag), snapshot the queue size at
        the top of each iteration: that count is the level&apos;s population. Process exactly that many
        nodes before moving to the next level. Without the snapshot, levels merge.
      </p>
      <p className="mb-4">
        <strong>Multi-source BFS.</strong> If multiple sources should fan out simultaneously, enqueue all
        of them at the start with distance 0. Subsequent expansion proceeds normally and computes the
        distance from the nearest source. 994 (Rotting Oranges) and 286 (Walls and Gates) are the canonical
        instances.
      </p>
      <p className="mb-4">
        <strong>Kahn topological sort.</strong> Compute indegree for every node. Enqueue all zero-indegree
        nodes. Pop one, append to result, decrement indegree of its successors; enqueue any that hit zero.
        If the result has fewer than n nodes at the end, a cycle exists. Same skeleton as BFS — different
        admission rule.
      </p>
      <p className="mb-4">
        <strong>Complexity.</strong> BFS is O(V + E). Each node is enqueued and dequeued at most once;
        each edge is examined once. Space is O(V) for the queue plus the visited set. Level-order tree
        traversal is O(n) time and O(w) space where w is the maximum width.
      </p>

      <ArticleImage
        src="/diagrams/other/leetcode/patterns/queues-diagram-1.svg"
        alt="Queue pattern overview"
        caption="When a queue fits and the canonical BFS template — FIFO ordering yields shortest path on unweighted graphs."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
      <p className="mb-4">
        <strong>BFS template.</strong> Initialise queue with start node and visited set containing it.
        While queue non-empty: pop front, process. For each unvisited neighbour, mark visited and push.
        For shortest distance, store (node, distance) in the queue or maintain a distance map keyed by
        node.
      </p>
      <p className="mb-4">
        <strong>Level-order template.</strong> Same skeleton, but at each iteration record level_size =
        queue.size() and process exactly level_size nodes before starting the next iteration. The inner
        loop builds the level&apos;s output; the outer loop advances levels.
      </p>
      <p className="mb-4">
        <strong>Multi-source BFS template.</strong> Pre-load the queue with every source at distance 0
        before the loop. The expansion phase is unchanged. The first time a node is popped, its distance
        is the minimum over all sources.
      </p>
      <p className="mb-4">
        <strong>Kahn topological-sort template.</strong> Build indegree array and adjacency. Enqueue
        zero-indegree. Pop, append to result, walk successors decrementing indegree, enqueue new
        zero-indegree. Result length must equal n; otherwise a cycle exists.
      </p>
      <p className="mb-4">
        <strong>0-1 BFS using a deque.</strong> When edges have weight 0 or 1, replace the queue with a
        deque. Push to the front for weight-0 edges, to the back for weight-1 edges. The result is
        shortest paths in O(V + E) without a heap. Useful in grid problems where some moves are
        &quot;free&quot;.
      </p>
      <p className="mb-4">
        <strong>Sliding-window queue (933).</strong> Push timestamps; on every query, evict from the
        front until the front is within the window. Each timestamp is enqueued once and dequeued once,
        so total work over the stream is O(n).
      </p>
      <p className="mb-4">
        <strong>Circular buffer / circular queue (622).</strong> Fixed-size array with head, tail, and
        size counters. Push at tail mod capacity, pop at head mod capacity. Constant memory, O(1) ops,
        no allocation per insertion — useful in latency-sensitive systems.
      </p>
      <p className="mb-4">
        <strong>Bidirectional BFS.</strong> For shortest-path on a large graph (e.g., 127 Word Ladder),
        run BFS simultaneously from source and target, alternating which frontier to expand (always the
        smaller). Stop when frontiers meet. Cuts time by a factor of √V on grid-like graphs.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
      <p className="mb-4">
        <strong>Queue vs. stack.</strong> Both manage frontier nodes. Queue (BFS) explores level by
        level; stack (DFS) explores depth-first. BFS gives shortest paths and processes by distance;
        DFS gives ordering, cycle detection, and lower memory on deep narrow graphs. Choose by what the
        problem rewards.
      </p>
      <p className="mb-4">
        <strong>Queue vs. priority queue.</strong> Priority queue orders by user-defined key, not
        insertion. Use when edges have non-uniform weight (Dijkstra), when results are wanted in
        priority order (top-k), or when the next item to process depends on a value, not position.
        Priority queue is O(log n) per op vs. O(1) for plain queue — use only when needed.
      </p>
      <p className="mb-4">
        <strong>Queue vs. deque.</strong> Plain queue suffices for BFS. Deque is needed for sliding
        window (push back, pop front) plus eviction from the back (monotonic queue), 0-1 BFS, and
        palindrome checks. In modern languages (Python deque, Java ArrayDeque, C++ deque), there is
        no overhead penalty — use deque by default.
      </p>
      <p className="mb-4">
        <strong>BFS vs. DFS for shortest path.</strong> BFS is correct on unweighted graphs and trees;
        DFS is not (it follows whatever path it descended into). Dijkstra (BFS with a heap) handles
        non-negative weights; Bellman-Ford handles negative weights but is slower. Use BFS by default
        for shortest path on unweighted graphs.
      </p>
      <p className="mb-4">
        <strong>Kahn vs. DFS topological sort.</strong> Kahn produces a topological order incrementally
        and detects cycles by under-count. DFS-based topo-sort uses post-order and gives the same
        order reversed; cycle detection requires a recursion-stack or three-colour scheme. Default to
        Kahn — it&apos;s simpler and the queue makes processing order natural.
      </p>
      <p className="mb-4">
        <strong>Plain queue vs. circular buffer.</strong> Plain queue (linked list or deque) is
        unbounded and grows. Circular buffer is O(1) memory after construction but rejects pushes when
        full. Use circular for streaming systems (logs, audio frames); use plain for unbounded
        algorithmic state.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
      <p className="mb-4">
        <strong>Mark visited on enqueue.</strong> Marking on dequeue allows the same node to be
        enqueued multiple times before any of them is processed, inflating queue size and triggering
        duplicate work. Marking on enqueue is the only correct discipline.
      </p>
      <p className="mb-4">
        <strong>Use ArrayDeque / collections.deque, not LinkedList / list.</strong> In Java,
        java.util.LinkedList is O(1) per op but with allocation overhead per node. ArrayDeque has
        better cache behaviour and is the recommended queue. In Python, collections.deque is O(1) at
        both ends; plain list pop(0) is O(n).
      </p>
      <p className="mb-4">
        <strong>Snapshot level size before the inner loop.</strong> Capture queue.size() once at the
        top of each level, then iterate that many times. Re-checking size inside the loop merges
        levels because children of the current level are enqueued as you go.
      </p>
      <p className="mb-4">
        <strong>Pre-seed multi-source.</strong> Push every source before the BFS loop starts. Don&apos;t
        run sequential single-source BFS and merge — that&apos;s O(s * (V + E)) instead of O(V + E).
      </p>
      <p className="mb-4">
        <strong>Carry the distance with the node.</strong> Either store (node, distance) tuples or
        maintain a distance map. Don&apos;t recompute distance by walking back — that defeats the
        BFS guarantee.
      </p>
      <p className="mb-4">
        <strong>For Kahn, build indegree once.</strong> One pass over edges fills the indegree array.
        Decrement on neighbour visits during BFS. Recomputing inside the loop turns O(V + E) into
        O(V * E).
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
      <p className="mb-4">
        <strong>Marking visited on dequeue.</strong> Same node enqueued multiple times before any
        pop; processing duplicates wastes time and may produce wrong distances. Mark on enqueue.
      </p>
      <p className="mb-4">
        <strong>Using list.pop(0) in Python.</strong> O(n) per call. Use collections.deque, which
        is O(1) at both ends.
      </p>
      <p className="mb-4">
        <strong>Forgetting to snapshot level size.</strong> Iterating &quot;while not empty&quot;
        without per-level boundaries merges levels and breaks right-view, zigzag, and per-level
        averages.
      </p>
      <p className="mb-4">
        <strong>Confusing BFS with DFS for grid problems.</strong> &quot;Number of islands&quot; can
        use either — but if the question asks for shortest distance through the grid, DFS gives wrong
        answers. Read the spec carefully.
      </p>
      <p className="mb-4">
        <strong>Not handling disconnected graphs.</strong> Single-source BFS only reaches the source&apos;s
        component. For &quot;all components&quot; problems (number of islands, count provinces), wrap
        BFS in an outer loop over unvisited starts.
      </p>
      <p className="mb-4">
        <strong>Kahn cycle-detection oversight.</strong> If the result has fewer than n nodes after
        the loop, a cycle exists somewhere. Forgetting this check returns a partial topo sort
        silently.
      </p>
      <p className="mb-4">
        <strong>Using a queue when ordering is non-FIFO.</strong> If the next-best item depends on
        priority (cost, depth, weight), use a heap. Plain queue + sort-on-dequeue is O(n log n) per
        op — defeats the point.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases (Canonical Leetcode Problems)</h2>
      <p className="mb-4">
        <strong>102. Binary Tree Level Order Traversal.</strong> Base level-order template with size
        snapshotting per level.
      </p>
      <p className="mb-4">
        <strong>199. Binary Tree Right Side View.</strong> Level-order, take the last node per level.
      </p>
      <p className="mb-4">
        <strong>994. Rotting Oranges.</strong> Multi-source BFS — preload all rotten oranges at
        distance 0, expand simultaneously. The answer is the maximum distance reached, or −1 if any
        fresh orange remains.
      </p>
      <p className="mb-4">
        <strong>286. Walls and Gates.</strong> Multi-source BFS from gates outward, filling the
        distance grid in place.
      </p>
      <p className="mb-4">
        <strong>127. Word Ladder.</strong> BFS over a word-graph where neighbours differ by one
        letter. Bidirectional BFS gives the practical speedup.
      </p>
      <p className="mb-4">
        <strong>1091. Shortest Path in Binary Matrix.</strong> 8-direction BFS on a 0/1 grid; classic
        unweighted shortest path.
      </p>
      <p className="mb-4">
        <strong>207 / 210. Course Schedule.</strong> Kahn topological sort. 207 returns a boolean
        (is-DAG); 210 returns the order itself.
      </p>
      <p className="mb-4">
        <strong>269. Alien Dictionary.</strong> Derive edges from adjacent word pairs, then Kahn.
        Edge cases (prefix conflict, isolated characters) are the interview tests.
      </p>
      <p className="mb-4">
        <strong>622. Design Circular Queue.</strong> Fixed-size ring buffer with head, tail, and
        size counters.
      </p>
      <p className="mb-4">
        <strong>933. Number of Recent Calls.</strong> Sliding-window queue keyed by timestamp;
        evict expired entries on every query.
      </p>

      <ArticleImage
        src="/diagrams/other/leetcode/patterns/queues-diagram-2.svg"
        alt="Queue variants and level-order traversal"
        caption="The four queue variants and the level-order traversal template that snapshots queue size per iteration."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li><strong>Why does BFS give shortest paths?</strong> Because nodes are processed in order of
        distance. Once a node is popped, all earlier-popped nodes were at distance ≤ d − 1 and any
        later-popped node is at distance ≥ d.</li>
        <li><strong>Why mark visited on enqueue, not dequeue?</strong> To prevent the same node from
        being enqueued multiple times before any of them is processed — that inflates queue size
        and risks duplicate processing.</li>
        <li><strong>How do you detect cycles with Kahn?</strong> If after BFS the result count is less
        than n, the un-emitted nodes form (or are downstream of) a cycle.</li>
        <li><strong>How does multi-source BFS find the nearest source for every cell?</strong> Pre-loading
        all sources at distance 0 means the first time a cell is popped, its distance equals the
        minimum over all sources, by the same shortest-path argument.</li>
        <li><strong>When would you use 0-1 BFS instead of Dijkstra?</strong> When edge weights are only
        0 or 1. Push 0-edges to the front of the deque, 1-edges to the back — same shortest-path
        invariant, no heap, O(V + E).</li>
        <li><strong>How does bidirectional BFS speed things up?</strong> Two simultaneous BFSes meet
        in the middle. On a graph with branching factor b and shortest path d, a single BFS is
        O(b^d); two BFSes meeting at d/2 is O(b^(d/2)). Square-root speedup.</li>
        <li><strong>What is the space complexity of BFS on a tree?</strong> O(w) where w is the max
        width. For balanced trees, w = O(n / 2) at the deepest level — half the tree. DFS uses
        O(h) which is much smaller for balanced trees.</li>
        <li><strong>How does a circular buffer differ from a deque?</strong> Fixed capacity; rejects
        pushes when full; constant memory. Useful for streaming (recent N events) and for ring-
        based designs.</li>
        <li><strong>Why prefer Kahn over DFS topological sort?</strong> Kahn is simpler, works
        incrementally, and detects cycles by count rather than three-colour bookkeeping. DFS
        gives the same order reversed if you prefer.</li>
        <li><strong>How would you implement a thread-safe queue?</strong> Bounded blocking queue with
        a mutex and two condition variables (notFull, notEmpty), or lock-free MPMC ring buffer
        with atomic head / tail counters. The interview answer depends on system-design depth
        being requested.</li>
      </ol>
<h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li><strong>Leetcode problem set.</strong> 102, 199, 994, 286, 127, 1091, 207, 210, 269, 622,
        641, 933, 225 — the queue syllabus, ordered from BFS basics to design.</li>
        <li><strong>CLRS, §22.2 (BFS) and §22.4 (Topological sort).</strong> Foundational treatment with
        correctness proofs.</li>
        <li><strong>Java ArrayDeque source.</strong> Worth reading for the resizable circular-array
        layout, which is the practical implementation behind both stack and queue ADTs.</li>
        <li><strong>Python collections.deque docs.</strong> O(1) at both ends with maxlen support — the
        right tool for sliding-window queues.</li>
        <li><strong>Cracking the Coding Interview, Chapter 4.</strong> Level-order traversal, BFS on
        graphs, and the bidirectional-BFS variant.</li>
        <li><strong>Grokking the Coding Interview — &quot;Tree BFS&quot; and &quot;Topological Sort&quot;
        modules.</strong> Practical templates and recognition signals.</li>
      </ul>
    </ArticleLayout>
  );
}
