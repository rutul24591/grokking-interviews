"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "tarjans-scc",
  title: "Tarjan's Strongly Connected Components",
  description:
    "Linear-time SCC decomposition via a single DFS with index and low-link timestamps — the algorithm, the condensation DAG, 2-SAT solving, and where it beats Kosaraju.",
  category: "other",
  subcategory: "algorithms",
  slug: "tarjans-scc",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-20",
  tags: [
    "tarjan",
    "scc",
    "strongly-connected-components",
    "graph",
    "dfs",
    "2-sat",
  ],
  relatedTopics: [
    "dfs",
    "topological-sort",
    "bfs",
    "graph",
  ],
};

export default function TarjansSCCArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p>
          A <em>strongly connected component</em> (SCC) of a directed graph
          is a maximal set of vertices such that every pair (u, v) has a
          directed path from u to v and from v to u. Every directed graph
          decomposes uniquely into SCCs; the quotient graph that contracts
          each SCC into a single super-vertex is a directed acyclic graph
          called the <em>condensation</em>. SCC decomposition is fundamental
          for any graph problem on directed graphs with cycles, because
          condensing to a DAG turns cyclic-graph problems into DAG problems
          you can topologically sort.
        </p>
        <p>
          Tarjan's 1972 paper "Depth-First Search and Linear Graph
          Algorithms" introduced an O(V + E) algorithm that finds all SCCs
          in a single DFS using two integer arrays — index (DFS pre-order
          time) and lowlink (the smallest index reachable from a vertex via
          DFS tree edges plus at most one back/cross edge) — and an
          auxiliary stack. The same paper introduced low-link timestamps as
          a tool, which also yields linear-time articulation points and
          bridges. The algorithm is one of the most elegant in the
          algorithm canon: a one-pass DFS that emits SCCs in reverse
          topological order with no graph reversal needed.
        </p>
        <p>
          The two main alternatives are <em>Kosaraju's algorithm</em>{" "}
          (1978, sometimes attributed to Sharir's independent 1981
          publication) — two DFS passes, one on the graph and one on the
          transpose — and <em>Gabow's path-based algorithm</em> (2000),
          which uses two stacks instead of low-link values. All three run
          in O(V + E); they differ in constants, code complexity, and
          access patterns. Tarjan is the production default in most
          libraries (LLVM, Boost Graph Library, NetworkX) because it
          requires no graph reversal and has the smallest constant
          factor in practice.
        </p>
        <p>
          SCC decomposition is the linear-time foundation underneath
          several seemingly unrelated problems: 2-SAT (satisfiability of
          boolean formulas with two literals per clause) reduces directly
          to SCC of an implication graph; mutually-recursive function
          analysis in compilers contracts the call graph; deadlock
          detection finds SCCs in resource-allocation graphs; circular
          dependency reporting in module loaders relies on SCC. Recognizing
          that "this problem becomes a DAG after SCC condensation" is a
          staff-level reflex.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/tarjans-scc-diagram-1.svg"
          alt="Tarjan's SCC algorithm with index and lowlink"
          caption="Tarjan's algorithm — one DFS pass, pre-order index timestamps, low-link values, and an auxiliary stack to emit SCCs."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <p>
          The algorithm performs DFS over the graph, assigning each vertex
          a pre-order index (a clock incremented at each entry) and
          maintaining a lowlink value that approximates "the smallest
          index reachable from u via tree edges and at most one back/cross
          edge to a vertex still on the DFS stack." When DFS finishes a
          vertex u, if lowlink[u] equals index[u], u is the root of an SCC
          — pop the auxiliary stack down to and including u; the popped
          vertices form one SCC.
        </p>
        <p>
          The auxiliary stack contains all vertices that have been entered
          by DFS and not yet assigned to an SCC. A separate boolean array
          on_stack[v] tracks membership in the auxiliary stack
          (distinguishing "currently in DFS recursion" from "DFS finished
          and popped to an SCC"). When DFS encounters an edge (u, v):
        </p>
        <p>
          • If v is unvisited, recurse on v, then update{" "}
          <code>lowlink[u] = min(lowlink[u], lowlink[v])</code> after
          return — propagating the smallest reachable index from the
          subtree.
        </p>
        <p>
          • If v is already visited and on the auxiliary stack, update{" "}
          <code>lowlink[u] = min(lowlink[u], index[v])</code> — a back or
          cross edge into the current SCC's stack region.
        </p>
        <p>
          • If v is visited and not on the stack, ignore it — v is in an
          already-emitted SCC, and the edge crosses into a different SCC
          (which is a separate node in the condensation DAG).
        </p>
        <p>
          The "ignore if not on stack" case is essential: it ensures that
          edges between already-emitted SCCs don't pull current vertices
          into a wrong SCC. The on_stack check is what makes Tarjan's
          algorithm work in a single pass.
        </p>
        <p>
          <strong>Why low-link gives the SCC root.</strong> If lowlink[u] =
          index[u], then nothing in u's subtree has a back/cross edge to
          an ancestor of u in the DFS tree (still on the stack). So u is
          the topmost vertex of an SCC: u and everything below u in the
          subtree (still on the stack) form an SCC. Pop them all.
        </p>
        <p>
          <strong>Output order.</strong> Tarjan emits SCCs in reverse
          topological order of the condensation. This is convenient
          because the condensation can be built incrementally as SCCs
          are emitted: assign each SCC an id in emission order, then
          inter-SCC edges go from higher-id to lower-id source.
        </p>
        <p>
          <strong>Iterative vs recursive.</strong> Recursive Tarjan is
          elegant but blows the stack on long chains (10⁵+ vertices in a
          single chain). Iterative Tarjan with an explicit stack is more
          code but handles arbitrarily deep graphs. Production code
          almost always uses the iterative version.
        </p>
        <p>
          <strong>Multiple disconnected components.</strong> Wrap the DFS
          call in an outer loop "for v in V: if not visited, dfs(v)"
          to ensure all vertices are reached. The output is a partition
          of V into SCCs.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p>
          The data structures are the adjacency list, an index array, a
          lowlink array, an on_stack boolean array, an auxiliary stack of
          vertex ids, an SCC-id array (assigning each vertex to its SCC),
          and a clock counter. Memory is O(V + E) for the graph plus O(V)
          for the per-vertex state.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/tarjans-scc-diagram-2.svg"
          alt="Tarjan vs Kosaraju vs Gabow comparison"
          caption="Comparison of the three linear-time SCC algorithms and how the condensation DAG enables downstream graph problems."
        />
        <p>
          For 2-SAT — the canonical Tarjan's-SCC application — build an
          implication graph: each clause (a ∨ b) becomes two implications,
          (¬a → b) and (¬b → a). Run Tarjan's SCC on this graph (2N
          vertices for N variables, 2E edges). The formula is satisfiable
          iff no variable x and its negation ¬x land in the same SCC.
          Recovery: in reverse topological order of the condensation,
          assign x = true if SCC(x) is emitted after SCC(¬x). Total: O(V
          + E) — linear-time 2-SAT.
        </p>
        <p>
          For compiler call-graph analysis, SCCs identify mutually
          recursive function groups. Inlining and inter-procedural
          analysis usually iterate over the condensation in reverse
          topological order so that callees are analyzed before their
          callers. Functions in the same SCC need joint fixed-point
          analysis; functions in different SCCs can be analyzed
          independently.
        </p>
        <p>
          For deadlock detection in operating systems and database
          transaction managers, the resource-allocation graph (or
          waits-for graph) is checked for SCCs of size &gt; 1. An SCC of
          size 2 or more represents a cycle of processes each waiting
          for a resource held by another in the cycle — deadlock. SCC
          algorithms run as part of periodic deadlock-detection sweeps
          or as on-demand analysis when transactions block.
        </p>
        <p>
          For module loaders (Python, Node.js, Java), circular imports
          form SCCs in the import graph. Some loaders (Python) tolerate
          cycles via lazy attribute resolution; others (early Java)
          reject them outright. Reporting the cycle to the user requires
          the SCC + a cycle inside it.
        </p>
        <p>
          For static analyzers and dataflow tools, SCC is a preprocessing
          step: collapse cycles to super-vertices, run analysis on the
          DAG, then within each SCC iterate to a fixed point. This pattern
          appears in pointer analysis, escape analysis, and abstract
          interpretation.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <p>
          <strong>Tarjan vs Kosaraju.</strong> Tarjan: one DFS, two
          arrays, no graph reversal. Kosaraju: two DFS passes, the
          second on the transpose graph. Both are O(V + E). Tarjan has
          smaller constants and avoids the cost of building the transpose
          (which can be expensive on huge graphs); Kosaraju is simpler
          to understand and to derive from first principles. Production
          libraries prefer Tarjan.
        </p>
        <p>
          <strong>Tarjan vs Gabow's path-based.</strong> Both single-pass.
          Gabow uses two stacks instead of low-link values; some find it
          conceptually clearer because the "an SCC root is the bottom
          of a path" intuition is direct. Performance is essentially
          identical. Tarjan has historical inertia and remains the
          textbook default.
        </p>
        <p>
          <strong>SCC vs cycle detection.</strong> Cycle detection in a
          directed graph is one bit (cycle exists or not) and runs in
          O(V + E) with three-color DFS. SCC gives much more: the
          partition into maximal cycle-equivalent classes. If you only
          need a cycle/no-cycle answer, three-color DFS is leaner.
        </p>
        <p>
          <strong>SCC vs union-find for connectivity.</strong> Union-find
          with path compression handles undirected connectivity in
          O(α(V)) per operation. For directed graph strong connectivity,
          union-find doesn't suffice — you need DFS-based algorithms.
          The asymmetry of directed graphs is the reason.
        </p>
        <p>
          <strong>Recursive vs iterative.</strong> Recursive Tarjan is
          elegant but blows the stack on long chains. Production code
          uses iterative Tarjan with an explicit stack. The conversion
          isn't trivial — the post-order step (where you update
          lowlink[u] from lowlink[v] after recursion returns) requires
          re-entering the loop at the right neighbor. Carefully written
          implementations exist in LLVM, Boost, and NetworkX.
        </p>
        <p>
          <strong>Tarjan + condensation vs running on cyclic graph
          directly.</strong> Many problems (longest path, reachability,
          DP) are easier on DAGs. Condensing to a DAG via SCC, running
          the DAG algorithm, then expanding back to the original is a
          common pattern. Costs O(V + E) preprocessing, often saves much
          more downstream.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <p>
          <strong>Use iterative implementation in production.</strong>
          Recursive Tarjan blows the stack on graphs with long chains.
          Worth the implementation complexity to avoid stack overflows
          on real input.
        </p>
        <p>
          <strong>Track on_stack with a separate boolean array.</strong>
          Don't conflate "visited" with "on stack." A vertex can be
          visited (has an index) and not on stack (already in an emitted
          SCC). The lowlink update rule depends on this distinction.
        </p>
        <p>
          <strong>Use the SCC-emission order for the condensation.</strong>
          Tarjan emits in reverse topological order of the condensation,
          so SCC ids assigned in emission order give a topological
          ordering for free. No second pass needed.
        </p>
        <p>
          <strong>Build condensation lazily.</strong> Many use cases need
          the condensation DAG. Build it during SCC traversal: for each
          edge (u, v), if scc[u] != scc[v], add (scc[u], scc[v]) to the
          condensation. Deduplicate edges (a hash set per source) if you
          need a simple condensation.
        </p>
        <p>
          <strong>For 2-SAT, use the canonical reduction.</strong> Each
          variable x has two graph nodes, x and ¬x. Each clause (a ∨ b)
          adds edges (¬a → b) and (¬b → a). Run Tarjan; check x and ¬x
          are in different SCCs; assign x = true iff scc-id(x) &gt;
          scc-id(¬x) (in Tarjan's reverse-topo emission order).
        </p>
        <p>
          <strong>Combine with topological sort downstream.</strong> The
          condensation DAG is the natural input to topological sort,
          longest-path-on-DAG, DP-on-DAG, and other linear-time DAG
          algorithms. The full pattern: SCC → condense → topo sort →
          DAG algorithm → map back to original vertices.
        </p>
        <p>
          <strong>Profile on big graphs.</strong> Tarjan is fast in
          theory but on huge graphs (10⁸+ edges), cache behavior of
          adjacency-list traversal matters. Consider compressed sparse
          row (CSR) layout for the graph; some implementations gain
          2–5× from CSR alone.
        </p>
        <p>
          <strong>Document SCC semantics in API.</strong> Output is a
          partition into SCCs with reverse-topological emission order.
          Callers should know whether they're getting "all SCCs" or
          "non-trivial SCCs only" (size &gt; 1). Some applications care
          (deadlock detection wants only SCCs of size &gt; 1).
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <p>
          <strong>Stack overflow on recursive implementation.</strong>
          The default recursion limit in Python is 1000; in Java and JVM
          languages, the default thread stack is 512 KB. Either raises
          the limit (sys.setrecursionlimit, -Xss) or use iterative.
          Production code defaults to iterative.
        </p>
        <p>
          <strong>Conflating visited and on_stack.</strong> A vertex that
          has been visited and assigned to an SCC is still "visited" but
          should not contribute to current lowlink updates. Use two
          separate flags.
        </p>
        <p>
          <strong>Forgetting to update lowlink on cross edges.</strong>
          When DFS finds an already-visited vertex on the stack, you
          must update <code>lowlink[u] = min(lowlink[u], index[v])</code>.
          Skipping this case puts vertices in too-small SCCs.
        </p>
        <p>
          <strong>Wrong update on cross edges to non-stack vertices.</strong>
          A vertex in an already-emitted SCC must not influence the
          current vertex's lowlink. The on_stack check guards against
          this. Without it, current SCCs incorrectly merge with prior
          ones.
        </p>
        <p>
          <strong>Ignoring disconnected components.</strong> Run Tarjan
          from every unvisited vertex, not just from a single start.
          Otherwise, SCCs in unreached components are missed.
        </p>
        <p>
          <strong>Misreading "SCC" as just "cycles."</strong> A single
          vertex with no self-loop is its own SCC of size 1. SCCs of
          size 1 are the norm in DAGs. "SCC of size &gt; 1" is the
          property associated with cycles.
        </p>
        <p>
          <strong>For 2-SAT: edge direction matters.</strong> Clause (a
          ∨ b) gives implications (¬a → b) and (¬b → a). Reversing the
          direction or omitting the symmetric edge produces wrong
          assignments. The standard reduction is symmetric on purpose;
          break the symmetry and the algorithm fails silently.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/tarjans-scc-diagram-3.svg"
          alt="Tarjan SCC applications and 2-SAT detail"
          caption="Production applications — 2-SAT, compiler analysis, deadlock detection, module loading — and the 2-SAT reduction in detail."
        />
        <p>
          <strong>2-SAT solving.</strong> The killer application. Boolean
          satisfiability with at most 2 literals per clause is NP-hard
          in general but linear-time when restricted to 2-CNF. The
          reduction to SCC of the implication graph runs in O(V + E),
          making 2-SAT one of the fastest non-trivial logical problems.
          Used in scheduling, layout problems, constraint satisfaction
          subroutines, and SAT-solver preprocessing.
        </p>
        <p>
          <strong>Compiler call-graph analysis.</strong> SCCs of the
          call graph are mutually recursive function groups. Compilers
          (LLVM, GCC) iterate inter-procedural analyses over the
          condensation in reverse topological order: callees before
          callers, with fixed-point iteration within each SCC.
        </p>
        <p>
          <strong>Module / package loading.</strong> Circular imports in
          Python, JavaScript, Java, and similar languages form SCCs in
          the import graph. Loaders detect, report, and sometimes resolve
          (lazy bindings) these cycles. Without SCC analysis, error
          messages would be vague.
        </p>
        <p>
          <strong>Deadlock detection.</strong> Operating systems and
          database transaction managers maintain a waits-for graph; SCCs
          of size &gt; 1 are deadlocks. Periodic SCC sweeps or on-demand
          checks identify and resolve them (kill victim, abort
          transaction).
        </p>
        <p>
          <strong>Web graph / citation networks.</strong> Studies of the
          web graph (Broder et al., 2000) used SCC to identify the
          "central core" of the web — a giant SCC containing roughly a
          third of pages. Citation networks have SCCs reflecting
          mutually-referencing research clusters.
        </p>
        <p>
          <strong>Static analysis / abstract interpretation.</strong>
          Pointer analysis, escape analysis, and similar dataflow
          algorithms iterate to a fixed point on the call graph or
          control-flow graph. SCC condensation lets the analyzer iterate
          per-SCC and propagate between SCCs in topological order —
          dramatically faster than naive whole-graph fixed-point.
        </p>
        <p>
          <strong>Spreadsheet circular-reference detection.</strong>
          Modern spreadsheets detect circular cell references via SCC
          on the dependency graph. Circular SCCs raise the dreaded
          "circular reference" error; non-circular dependencies recompute
          in topological order.
        </p>
        <p>
          <strong>Hardware design / clock-domain analysis.</strong>
          Digital circuit design tools use SCC to identify combinational
          loops (zero-delay cycles) — usually bugs that violate clock
          discipline. Modern HDL synthesis tools (Vivado, Synopsys
          Design Compiler) flag these automatically.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <p>
          <strong>Find all strongly connected components.</strong> Direct
          implementation question. Tarjan or Kosaraju, both O(V + E).
          Strong answers explain the lowlink intuition or the
          two-DFS-on-transpose intuition clearly.
        </p>
        <p>
          <strong>Detect cycles in a directed graph.</strong> Three-color
          DFS gives a yes/no in O(V + E). Tarjan's SCC gives more (the
          actual SCCs) but is overkill if you only need detection.
        </p>
        <p>
          <strong>2-SAT: assign truth values to satisfy a 2-CNF
          formula.</strong> Build the implication graph; run Tarjan; check
          x and ¬x are in different SCCs; assign by scc-id ordering.
          Linear-time SAT — surprises interviewers used to thinking SAT
          is hard.
        </p>
        <p>
          <strong>Critical Connections in a Network (LeetCode 1192).</strong>
          Find bridges (edges whose removal disconnects the graph) using
          Tarjan's bridge algorithm — same low-link machinery, different
          predicate.
        </p>
        <p>
          <strong>Number of SCCs / condensation.</strong> Implementation
          question. Run SCC, build condensation by deduplicating
          inter-SCC edges. Sometimes phrased as "given a directed graph,
          contract cycles to form a DAG."
        </p>
        <p>
          <strong>Mother vertex / find a vertex from which all others
          are reachable.</strong> If a mother vertex exists, it's in the
          first emitted SCC (Tarjan's reverse-topo order means the first
          SCC is the "topmost" in the condensation). Verify by BFS from
          one of its members.
        </p>
        <p>
          <strong>Detect deadlock in a transaction system.</strong>
          System-design framing. Strong answers cover building the
          waits-for graph, running SCC periodically or on lock-acquisition,
          choosing victim transactions to break the cycle, and avoiding
          O(V + E) sweeps every millisecond.
        </p>
        <p>
          <strong>What's the difference between SCC and connected
          components?</strong> Connected components apply to undirected
          graphs and use union-find. SCCs apply to directed graphs and
          require DFS-based linear-time algorithms. The asymmetry of
          directed reachability is the reason.
        </p>
        <p>
          <strong>How would you detect circular imports in a build
          system?</strong> Tarjan's SCC on the import graph. Report each
          non-trivial SCC as a circular-import error with a cycle
          witness extracted by walking edges within the SCC.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <p>
          Tarjan's 1972 paper "Depth-First Search and Linear Graph
          Algorithms" introduced the SCC algorithm along with linear-time
          articulation points and bridges — three landmark results in one
          paper. Kosaraju's 1978 manuscript and Sharir's independent
          1981 publication describe the two-DFS algorithm. Gabow's
          "Path-Based Depth-First Search for Strong and Biconnected
          Components" (2000) is the modern alternative.
        </p>
        <p>
          CLRS Chapter 22 covers Kosaraju in detail; Sedgewick and Wayne's{" "}
          <em>Algorithms</em> covers Tarjan with clean Java code. For a
          rigorous treatment with proofs and the full low-link theory,
          Tarjan's <em>Data Structures and Network Algorithms</em> is the
          definitive reference.
        </p>
        <p>
          For 2-SAT, Aspvall, Plass, and Tarjan's "A Linear-Time Algorithm
          for Testing the Truth of Certain Quantified Boolean Formulas"
          (1979) is the canonical reference. Modern competitive
          programming textbooks (Halim's <em>Competitive Programming</em>,
          Laaksonen's <em>Competitive Programmer's Handbook</em>) cover
          the reduction with worked examples.
        </p>
        <p>
          For applications in compilers, the LLVM <code>llvm/Analysis/CallGraphSCCPass</code>{" "}
          source and the GCC pass manager illustrate iterative SCC over
          call graphs in production. For deadlock detection, OS textbooks
          (Tanenbaum, Silberschatz) cover the resource-allocation graph
          and SCC-based detection. For static analysis, Møller and
          Schwartzbach's <em>Static Program Analysis</em> covers SCC-based
          fixed-point iteration in detail.
        </p>
        <p>
          Open-source implementations: Boost Graph Library
          (<code>boost::strong_components</code>), NetworkX
          (<code>nx.strongly_connected_components</code>), JGraphT
          (<code>TarjanStronglyConnectedComponentsAlgorithm</code>), and
          Lemon all ship Tarjan. Reading a production implementation
          (especially the iterative version) is excellent prep for
          interviews.
        </p>
      </section>
    </ArticleLayout>
  );
}
