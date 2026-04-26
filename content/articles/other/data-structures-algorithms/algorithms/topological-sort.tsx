"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "topological-sort",
  title: "Topological Sort",
  description:
    "Linear ordering of a DAG that respects dependencies — Kahn's BFS algorithm, DFS post-order, cycle detection, and the DAG-DP patterns built on top.",
  category: "other",
  subcategory: "algorithms",
  slug: "topological-sort",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-20",
  tags: [
    "topological-sort",
    "dag",
    "kahn",
    "dfs",
    "cycle-detection",
    "scheduling",
  ],
  relatedTopics: [
    "bfs",
    "dfs",
    "tarjans-scc",
    "dp-fundamentals",
    "graph",
  ],
};

export default function TopologicalSortArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p>
          A topological sort of a directed graph is a linear ordering of its
          vertices such that for every directed edge (u, v), u appears before
          v in the ordering. A topological order exists if and only if the
          graph is a directed acyclic graph (DAG); the absence of a topological
          order is itself the proof that a cycle exists. Topological sort runs
          in O(V + E) — the same complexity as a single BFS or DFS — and is
          the foundational algorithm for scheduling, build systems, dependency
          resolution, compiler analysis, and any problem whose state space
          forms a DAG.
        </p>
        <p>
          Two algorithms compute it. <em>Kahn's algorithm</em> (1962) maintains
          an indegree count per vertex, repeatedly emits a zero-indegree
          vertex, and decrements the indegrees of its neighbors — a BFS over
          the "free" vertices. <em>DFS post-order</em> performs depth-first
          search and emits each vertex when it finishes (post-order); the
          reverse of this list is a topological order. Both run in O(V + E)
          and detect cycles as a byproduct, but they have different operational
          characters. Kahn is iterative, parallelizable, and produces "wave"
          schedules. DFS post-order is recursive, composes with SCC and
          articulation-point machinery, and is the natural choice when you're
          already running DFS for other reasons.
        </p>
        <p>
          Topological sort is rarely the deliverable on its own. It's the
          ordering inside which other things happen. Build systems run
          targets in topological order. Scheduling systems dispatch tasks in
          topological waves. Compilers schedule instructions in topological
          order so dependencies are satisfied when each instruction executes.
          Dynamic programming on DAGs iterates in topological order to ensure
          that subproblems are solved before they're needed. The shortest
          path on a DAG runs in O(V + E) using topological order plus
          relaxation — beating Dijkstra.
        </p>
        <p>
          The order is generally not unique. A graph with two unrelated
          chains has many valid linearizations; total ordering is imposed by
          the algorithm's tie-breaking rule. For determinism (stable build
          IDs, reproducible scheduler behavior), production systems
          canonicalize: Kahn with a min-heap of indegree-0 vertices yields
          the lexicographically smallest order. DFS-based topological sort's
          order depends on adjacency-list iteration; for stability, sort
          adjacency lists.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/topological-sort-diagram-1.svg"
          alt="Kahn vs DFS topological sort algorithms"
          caption="Kahn's BFS-based algorithm and DFS post-order — two O(V+E) algorithms with cycle detection as a byproduct."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <p>
          <strong>Kahn's algorithm.</strong> Compute indegree[v] for every v
          (one pass over edges). Initialize a queue with all vertices of
          indegree 0 — the "ready" set. Repeatedly: pop u from the queue,
          emit u to the output, decrement indegree[v] for each (u, v) edge,
          and push v if its indegree just hit zero. When the queue empties,
          if the output contains all V vertices, you have a topological
          order. If not, the remaining vertices form a cycle (their
          indegrees never reached zero because cycle members keep blocking
          each other).
        </p>
        <p>
          <strong>DFS post-order.</strong> Run DFS from every unvisited
          vertex, with three-color marking to detect cycles. When DFS from u
          finishes (after recursing into all of u's descendants), prepend u
          to the output (or append and reverse at the end). The result is a
          topological order. The intuition: u finishes last among everything
          reachable from u, so emitting in reverse-finish order puts u
          before everything it reaches.
        </p>
        <p>
          <strong>Why it works (Kahn).</strong> Inductive: every emitted
          vertex has indegree 0 at the time of emission, meaning all its
          predecessors were emitted earlier. Hence the output respects all
          dependencies. The cycle-detection corollary is also inductive: if
          the graph has a cycle C, no vertex of C ever has indegree 0
          (someone in C always points at it), so C is never emitted.
        </p>
        <p>
          <strong>Why it works (DFS).</strong> Suppose edge (u, v) exists and
          we run DFS. Either v is unvisited when we explore the edge — DFS
          recurses into v, so v finishes first — or v is already finished.
          Either way, v finishes before u. So in reverse-finish-time order,
          u appears before v.
        </p>
        <p>
          <strong>Cycle detection.</strong> Kahn detects via "output size &lt;
          V at end." DFS detects via "encountered a gray vertex" — an edge to
          a vertex currently on the recursion stack is a back edge, which
          implies a cycle. Both detection mechanisms are O(V + E) — free
          alongside the sort.
        </p>
        <p>
          <strong>Lexicographically smallest topological order.</strong>
          Replace Kahn's FIFO queue with a min-heap. Each step pops the
          smallest indegree-0 vertex. Total cost O((V + E) log V). Useful
          for canonical orderings in build systems where ID stability
          matters.
        </p>
        <p>
          <strong>Parallel topological sort.</strong> All vertices in the
          current ready set can be processed concurrently — they have no
          dependencies on each other. Process the wave in parallel, then
          atomically decrement indegrees and form the next wave. This is the
          execution model for parallel build systems (Bazel, Buck, Pants)
          and for DAG-based schedulers (Airflow, Dagster).
        </p>
        <p>
          <strong>DAG-DP pattern.</strong> Once you have a topological order,
          dynamic programming over the DAG becomes "iterate in topo order,
          relaxing each vertex from its predecessors." Longest path, shortest
          path, path counting, and reachability all reduce to this template
          and run in O(V + E). On a DAG, you don't need Dijkstra or
          Bellman-Ford — topological sort + linear relaxation suffices.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p>
          Production topological-sort implementations carry a few extra
          features beyond the textbook skeleton. First, they track levels or
          waves so that downstream parallel execution knows which vertices
          can run together. Second, they often emit in a stable order
          (sorting adjacency lists or using min-heap Kahn) so that build IDs
          and scheduler decisions are reproducible. Third, they integrate
          cycle reporting: not just "cycle exists" but "here is the cycle"
          — useful for "circular dependency: A → B → C → A" error messages.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/topological-sort-diagram-2.svg"
          alt="Kahn vs DFS trade-offs"
          caption="Kahn vs DFS — when each is preferred. Kahn for parallel scheduling and lexicographic order; DFS for compiler pipelines that need post-order anyway."
        />
        <p>
          For build systems, the DAG is constructed by parsing build files
          (BUILD.bazel, Makefile, package.json). Each target declares its
          dependencies; the build tool inverts to an adjacency list and
          runs Kahn. Targets with indegree 0 are ready; as they finish,
          downstream indegrees decrement. The wave structure naturally maps
          to thread-pool execution: run all ready targets in parallel.
        </p>
        <p>
          For schedulers, the DAG is the workflow definition (Airflow DAG
          file, Dagster job). Each task has dependencies; topological order
          determines run sequence. Real-world wrinkles: tasks can fail and
          retry, downstream tasks may need to be cancelled or rescheduled,
          and the scheduler must persist progress to survive restarts. The
          topo-sort core is unchanged; the orchestration around it is where
          the complexity lives.
        </p>
        <p>
          For compilers, topological order on the call graph or
          IR-pass-dependency graph determines the order of compilation and
          analysis. Function-level inlining, alias analysis, and dead-code
          elimination often want bottom-up traversal (topo order from
          leaves), while inter-procedural optimizations want top-down. The
          same DAG drives both directions, depending on what you reverse.
        </p>
        <p>
          For spreadsheets, every cell that depends on others forms an
          edge; recalculation runs in topological order so that{" "}
          <code>=A1+B1</code> recomputes after both A1 and B1 are fresh.
          Cycles are the dreaded "circular reference" error; detection runs
          alongside topo sort.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <p>
          <strong>Kahn vs DFS.</strong> Kahn is iterative (no recursion-depth
          limits), parallelizable (the indegree-0 frontier is naturally a
          parallel wave), and easy to make deterministic with a min-heap.
          DFS post-order composes naturally with SCC, articulation points,
          and edge classification, and is preferred when you're already
          running DFS for those purposes. For pure topo-sort, Kahn is
          usually the better default; for "I'm doing DFS anyway and want
          topo order as a side-effect," DFS post-order wins.
        </p>
        <p>
          <strong>Topological sort vs cycle detection alone.</strong> If you
          only need "is this a DAG?", three-color DFS is the simplest: O(V +
          E), no output. Topological sort gives the order plus the cycle
          check; pure cycle detection is leaner if you don't need the order.
        </p>
        <p>
          <strong>Topo-sort + relaxation vs Dijkstra on a DAG.</strong> On a
          DAG, topo-sort plus a linear-pass relaxation gives shortest paths
          in O(V + E) — beating Dijkstra's O((V + E) log V). The penalty for
          using Dijkstra on a DAG is the heap overhead, plus Dijkstra
          requires non-negative edges while DAG-relaxation tolerates negative
          edges (no cycles → no negative-cycle issue). On any DAG, prefer
          topo + relaxation.
        </p>
        <p>
          <strong>Parallel Kahn vs sequential.</strong> On a DAG with
          long-and-narrow shape, parallel Kahn doesn't help much — each
          wave has few vertices. On wide DAGs (typical in build systems
          with hundreds of independent test targets), parallel Kahn can
          deliver near-linear speedup limited by the critical path. Build
          tools like Bazel report critical-path duration as the absolute
          lower bound on build time.
        </p>
        <p>
          <strong>Tarjan's SCC then condense.</strong> If the input might
          have cycles but you want a topological order over SCCs (treating
          each cycle as a single super-vertex), run Tarjan's SCC, condense
          to the SCC-DAG, then topologically sort the condensation. Common
          pattern in static analyzers and compiler optimization passes.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <p>
          <strong>Choose Kahn for scheduling, DFS for analysis.</strong>
          Kahn produces wave-friendly schedules and is iterative;
          DFS-post-order integrates with SCC pipelines and gives you
          finish-time stamps for free.
        </p>
        <p>
          <strong>Always handle cycles explicitly.</strong> Don't assume
          input is a DAG. Production code should detect, report, and
          either fail loudly or skip the cyclic component. "Circular
          dependency: A → B → C → A" is a far better error message than
          "build hung."
        </p>
        <p>
          <strong>Sort adjacency lists for determinism.</strong> The
          topological order is generally not unique; different runs may
          produce different orders depending on iteration. For
          reproducibility (build IDs, scheduler decisions, regression
          tests), sort adjacency lists or use min-heap Kahn.
        </p>
        <p>
          <strong>Track wave levels for parallel scheduling.</strong>
          Augment Kahn to record level[v] = max level of v's predecessors +
          1. Vertices at the same level are independent and can run
          concurrently. The maximum level is the critical-path length.
        </p>
        <p>
          <strong>Use 64-bit indegree counters for huge graphs.</strong>
          Most graphs have small indegrees, but in extreme cases you can
          hit overflow on int32. Defensive sizing is cheap.
        </p>
        <p>
          <strong>Iterative DFS for deep DAGs.</strong> A DAG with a
          long-chain shape (10⁵+ vertices in a chain) can blow the
          recursion stack. Either set a larger stack (<code>ulimit</code>{" "}
          on Unix) or use an explicit-stack iterative DFS.
        </p>
        <p>
          <strong>Combine SCC + topo for maybe-cyclic graphs.</strong> If
          input might be cyclic but you want some ordering, condense
          cycles into super-vertices via Tarjan/Kosaraju, then topo-sort
          the condensation. This pattern is common in compiler
          inter-procedural passes.
        </p>
        <p>
          <strong>Stream large DAGs.</strong> If the DAG is too large for
          memory but edges arrive in some natural order (logs, event
          streams), you can run Kahn incrementally, emitting completed
          vertices and shedding state as you go. Useful for large CI
          pipelines, distributed schedulers, and event-driven systems.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <p>
          <strong>Forgetting cycle handling.</strong> The most common bug:
          run topo sort, output the result, ignore the fact that only
          part of the graph was emitted. Always check{" "}
          <code>output.length == V</code> at the end of Kahn or "no gray
          edge" at the end of DFS.
        </p>
        <p>
          <strong>Wrong direction for build dependencies.</strong> A
          target's dependencies must build before the target itself. The
          edge direction in your graph must match — ambiguity here causes
          builds to run in reverse order. Convention: edge from dependency
          to dependent (or vice versa); pick one and stick to it.
        </p>
        <p>
          <strong>Mutating the graph during iteration.</strong> Both
          algorithms read indegree or color arrays during iteration. Don't
          modify the graph mid-sort; if you need dynamic DAGs, restart the
          sort or use an incremental algorithm.
        </p>
        <p>
          <strong>DFS recursion-depth on long chains.</strong> A chain of
          100,000 vertices crashes the default Python or JVM stack. Use
          iterative DFS or Kahn.
        </p>
        <p>
          <strong>Order assumed to be unique.</strong> Different runs of
          the same algorithm on the same DAG can produce different orders
          if adjacency lists are unsorted. Tests that pin the exact order
          will flake; assert "valid topo order" instead, or canonicalize
          input.
        </p>
        <p>
          <strong>Counting incoming vs outgoing edges incorrectly.</strong>
          Kahn needs <em>indegree</em>: number of incoming edges. A common
          bug: counting outgoing edges and getting an order that's reverse
          of what's wanted. Symmetric variants exist (Kahn on the reverse
          graph) but they should be intentional.
        </p>
        <p>
          <strong>Forgetting to handle disconnected components.</strong> If
          the graph has multiple weakly-connected components, both
          algorithms still work, but DFS must iterate over all vertices as
          starting points (not just one source). A "for each unvisited v:
          dfs(v)" outer loop is required.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/topological-sort-diagram-3.svg"
          alt="Topological sort applications and DAG-DP patterns"
          caption="Production systems running topological sort and the family of DAG-DP algorithms (longest path, path counting, critical path) it enables."
        />
        <p>
          <strong>Build systems.</strong> Bazel, Make, Gradle, Buck, Pants,
          Ninja — every modern build tool runs topological sort on its
          target DAG. Bazel's wave-based parallel execution explicitly
          mirrors Kahn's algorithm. Build cycles are caught and reported as
          dependency errors.
        </p>
        <p>
          <strong>Package managers.</strong> npm, pip, apt, dnf, brew, cargo —
          install and upgrade in topological order so that dependencies are
          satisfied before dependents start. Conflict detection (two
          packages requiring incompatible versions of a third) often
          surfaces as cycle-like failures in the resolution graph.
        </p>
        <p>
          <strong>Workflow schedulers.</strong> Airflow, Dagster, Prefect,
          Argo Workflows, Step Functions — DAGs of tasks executed in
          topological waves. Failures, retries, and partial reruns are
          modeled as state transitions on top of the topo order.
        </p>
        <p>
          <strong>CI/CD.</strong> GitHub Actions job dependencies, GitLab
          CI stages, Jenkins pipelines — all execute jobs in topological
          order. Strict stage models simplify to a chain; flexible "needs"
          models give a full DAG.
        </p>
        <p>
          <strong>Compilers.</strong> Pass-manager ordering, function
          inlining order, register allocation order, link order. LLVM's
          pass manager organizes optimization passes as a DAG with explicit
          dependencies; running them in topological order ensures each
          pass sees the right invariants.
        </p>
        <p>
          <strong>Spreadsheet engines.</strong> Excel, Google Sheets, and
          financial modeling tools recompute cells in topological order
          over the cell-dependency DAG. Cycle detection produces "circular
          reference" errors. Lazy evaluation + memoization on the topo
          order is the textbook implementation.
        </p>
        <p>
          <strong>Module loaders.</strong> CommonJS, ES Modules, Java's
          classloader, .NET assemblies — all need to load dependencies
          before dependents. Cycles either cause loader errors or are
          handled by lazy resolution (ES modules' "live bindings").
        </p>
        <p>
          <strong>Database migrations.</strong> Schema-aware migration
          tools (Liquibase, Flyway with explicit dependencies) order
          migrations so that table A is created before any migration that
          references A.
        </p>
        <p>
          <strong>Critical-path scheduling.</strong> PERT/CPM project
          management, manufacturing line balancing, software-release
          planning — longest-path on a DAG via topo + relaxation gives the
          minimum total time. Tasks not on the critical path have slack.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <p>
          <strong>Course Schedule (LeetCode 207).</strong> "Given prerequisites,
          can all courses be finished?" Pure cycle detection on the
          dependency graph. Either Kahn (output size &lt; V → cycle) or
          three-color DFS.
        </p>
        <p>
          <strong>Course Schedule II (LeetCode 210).</strong> Same setup,
          return the order. Pure topological sort. Both Kahn and DFS work;
          interviewers like seeing both.
        </p>
        <p>
          <strong>Alien Dictionary (LeetCode 269).</strong> Given a
          dictionary in alien-alphabetical order, derive the alphabet.
          Build a character DAG from adjacent-word comparisons, topo-sort.
          Edge cases: invalid input where prefix appears after a longer
          word, character with no constraints, cycle in inferred
          relationships.
        </p>
        <p>
          <strong>Parallel Courses.</strong> Given prerequisites and a
          semester-parallelism constraint, find the minimum number of
          semesters. Wave-counting Kahn — the level matrix gives the
          answer.
        </p>
        <p>
          <strong>Find All Possible Recipes from Given Supplies.</strong>
          Topological sort over the recipe-ingredient DAG. Tests modeling
          ability — extracting the DAG from problem text.
        </p>
        <p>
          <strong>Find Eventual Safe States.</strong> A node is "safe" if
          all paths from it eventually reach a terminal node. Reverse the
          graph and topologically sort, propagating safety. Or DFS with
          three-color marking to detect cycles.
        </p>
        <p>
          <strong>Minimum Height Trees.</strong> Trim leaves repeatedly —
          essentially Kahn on undirected graphs treating leaves (degree
          1) as the "ready" set. The last 1 or 2 vertices form the
          centers.
        </p>
        <p>
          <strong>Longest path on a DAG.</strong> Topo sort + linear
          relaxation. O(V + E). Often arises as critical-path or
          longest-increasing-path-on-grid problems.
        </p>
        <p>
          <strong>Detect a circular dependency in a build graph
          (system-design framing).</strong> Strong answers cover Kahn's
          algorithm, cycle reporting (parent walking to extract the
          cycle), and the user-facing error message format. Bonus: SCC
          condensation for "all cycles at once."
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <p>
          A. B. Kahn's "Topological Sorting of Large Networks" (1962, CACM)
          is the original BFS-based algorithm and is short and readable.
          Tarjan's 1972 paper "Depth-First Search and Linear Graph
          Algorithms" introduces DFS-based topological sort alongside SCC
          and articulation-point algorithms. CLRS Chapter 22 covers both,
          with proofs.
        </p>
        <p>
          For build-system topological sort, the Bazel documentation on
          execution phases and the Buck source code are excellent practical
          references. "Build Systems à la Carte" (Mokhov, Mitchell, Peyton
          Jones, ICFP 2018) decomposes build systems by their topo-sort
          strategy — instructive comparative reading.
        </p>
        <p>
          For workflow schedulers, the Airflow scheduler source and
          Dagster's "asset graph" implementation are both publicly
          available and demonstrate production topological sort with
          retries, backfills, and partial state. Argo Workflows'
          controller is similar in Go.
        </p>
        <p>
          For compiler-pass topological sort, LLVM's PassManager source
          (especially the legacy pass manager's dependency calculation) and
          GCC's pass manager are both worth reading. They illustrate the
          mix of "topo over passes" and "topo over IR units" that real
          compilers do.
        </p>
        <p>
          For DAG dynamic programming, Sedgewick and Wayne's <em>Algorithms</em>{" "}
          covers shortest paths and longest paths on DAGs cleanly. CLRS
          Chapter 24 has the longest-path-on-DAG analysis. For critical
          path scheduling, Hillier and Lieberman's <em>Introduction to
          Operations Research</em> provides the PERT/CPM background.
        </p>
      </section>
    </ArticleLayout>
  );
}
