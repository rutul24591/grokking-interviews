"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-other-dsa-algorithms-np-completeness",
  title: "NP-Completeness & Computational Complexity",
  description: "NP-completeness theory explains why certain problems are computationally hard — P/NP/NP-hard/NP-complete classes, polynomial reductions, Cook-Levin theorem, classic NP-complete problems, and practical coping strategies including approximation algorithms, FPT, and heuristics.",
  category: "other",
  subcategory: "data-structures-algorithms",
  slug: "np-completeness",
  wordCount: 2300,
  readingTime: 10,
  lastUpdated: "2026-05-16",
  tags: ["np-completeness", "complexity", "reductions", "approximation", "sat", "tsp"],
};

export default function NpCompletenessArticle() {
  return (
    <ArticleLayout metadata={metadata}><HighlightBlock as="p" tier="crucial" className="mb-4">Interview focus: NP-Completeness &amp; Computational Complexity should be explained through a correctness invariant first, then through the implementation technique.</HighlightBlock><HighlightBlock as="p" tier="crucial" className="mb-4">Interview focus: In interviews, the decisive point is why this approach is valid under the stated constraints, not just what API or algorithm is used.</HighlightBlock><HighlightBlock as="p" tier="crucial" className="mb-4">Interview focus: The production-quality answer separates source of truth, derived state, failure behavior, and measurable cost.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Interview focus: Compare the simple baseline with the optimized or production-ready approach so the trade-off is explicit.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Interview focus: Name the data structure, state machine, pipeline stage, or control plane that owns each decision.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Interview focus: Include the cost model: preprocessing cost, per-operation cost, storage cost, latency impact, and failure recovery cost.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Interview focus: Call out common mistakes because they are often what interviewers use to distinguish memorized answers from reasoned answers.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Interview focus: Tie the concept back to real systems: scale, concurrency, partial failure, security boundaries, and migration pressure.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Interview focus: Explain the test strategy: normal path, boundary path, adversarial input, regression case, and observability assertion.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Interview focus: If multiple approaches work, choose based on constraints rather than preference: static vs dynamic, online vs offline, exact vs approximate, safe vs fast.</HighlightBlock>
      <p>
        NP-completeness theory explains why certain problems seem fundamentally hard — no efficient algorithm has
        been found despite decades of effort by the world's best researchers. Understanding this theory lets
        engineers identify when to stop searching for a polynomial-time exact algorithm and instead invest in
        approximation algorithms, heuristics, or exponential-time exact methods for small inputs.
      </p>

      <ArticleImage
        src="/diagrams/other/data-structures-algorithms/algorithms/np-completeness-architecture.svg"
        alt="NP-completeness and computational complexity diagram"
        caption="Complexity classes, polynomial reductions, classic NP-complete problems, and coping strategies"
      />

      <h2>Complexity Classes</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Interview lens: frame NP-Completeness &amp; Computational Complexity around problem constraints, correctness proof, complexity class, data-structure choice, and degradation strategy. This is what turns the article from concept notes into interview-ready reasoning.</HighlightBlock>
      <p>
        <strong>P</strong> (Polynomial time) is the class of decision problems solvable by a deterministic Turing
        machine in O(n^k) time for some constant k. Examples: sorting, shortest path (Dijkstra/Bellman-Ford),
        maximum matching in bipartite graphs, linear programming.
      </p>
      <p>
        <strong>NP</strong> (Non-deterministic Polynomial) is the class of decision problems where a YES answer
        has a polynomial-length certificate verifiable in polynomial time. Common misconception: NP does not mean
        "non-polynomial" — the name refers to non-deterministic Turing machines that can guess solutions. Example:
        SAT is in NP because given a satisfying assignment, you can verify it in O(n) time by evaluating the formula.
        Note: P ⊆ NP since any polynomial-time solvable problem has a trivially verifiable certificate (just solve it).
      </p>
      <p>
        <strong>NP-hard</strong>: A problem X is NP-hard if every problem in NP reduces to X in polynomial time —
        X is at least as hard as the hardest problems in NP. NP-hard problems need not be in NP; they can be
        undecidable (e.g., the Halting Problem is NP-hard).
      </p>
      <p>
        <strong>NP-complete</strong>: A problem is NP-complete if it is in NP AND NP-hard. NP-complete problems
        are the hardest problems in NP. If any NP-complete problem were solvable in polynomial time, then P = NP
        and every problem in NP would be solvable in polynomial time.
      </p>

      <HighlightBlock as="p" tier="crucial">
        P = NP? is the most important open problem in computer science. A proof that P ≠ NP would confirm
        that no polynomial-time algorithm exists for NP-complete problems. Most researchers believe P ≠ NP,
        but neither direction has been proved.
      </HighlightBlock>

      <h2>Polynomial Reductions</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core invariant to defend: the chosen algorithm must match the input constraints and expose why it is correct, not only why it passes sample cases.</HighlightBlock>
      <p>
        A polynomial reduction from problem A to problem B (written A ≤ₚ B) is a polynomial-time computable
        function f such that: x ∈ A if and only if f(x) ∈ B. Intuitively, B is "at least as hard" as A —
        if you can solve B, you can solve A by first applying f.
      </p>
      <p>
        Key properties of reductions:
      </p>
      <p>
        If A ≤ₚ B and B ∈ P, then A ∈ P (easy problems reduce forward to easy problems).
      </p>
      <p>
        If A ≤ₚ B and A is NP-hard, then B is NP-hard (hardness propagates forward through reductions).
      </p>
      <p>
        Reductions are transitive: A ≤ₚ B and B ≤ₚ C implies A ≤ₚ C.
      </p>
      <p>
        The landmark Cook-Levin theorem (1971/1972) proved that SAT is NP-complete: SAT is in NP (verify an
        assignment in O(n) time) and every NP problem reduces to SAT (encode the computation of a non-deterministic
        TM as a boolean formula). This was the first NP-completeness proof.
      </p>
      <p>
        The classic reduction chain: SAT → 3-SAT → Independent Set → Clique → Vertex Cover → Hamiltonian Cycle
        → Travelling Salesman Problem. Each arrow is a polynomial reduction, showing that TSP is at least as hard
        as SAT, which is at least as hard as every problem in NP.
      </p>

      <h2>Classic NP-Complete Problems</h2><HighlightBlock as="p" tier="important" className="mb-4">Decision quality comes from naming the constraint, the chosen technique, the proof boundary, and the cost model before discussing implementation details.</HighlightBlock>
      <p>
        <strong>SAT</strong>: Given a boolean formula, does there exist an assignment of variables that satisfies it?
        3-SAT restricts each clause to exactly 3 literals; 2-SAT (each clause has 2 literals) is solvable in
        linear time via strongly connected components.
      </p>
      <p>
        <strong>Independent Set</strong>: Given graph G and integer k, does G have an independent set of size ≥ k
        (a set of vertices with no edges between them)? Reduction from 3-SAT: for each clause, create a triangle
        (3-clique) of vertices; add edges between conflicting literals across clauses. A 3-SAT formula with m
        clauses is satisfiable iff G has an independent set of size m.
      </p>
      <p>
        <strong>Vertex Cover</strong>: Given graph G and integer k, does G have a vertex cover of size ≤ k
        (a set of vertices touching all edges)? Note: S is an independent set iff V\S is a vertex cover —
        these two problems are equivalent, so reductions between them are trivial.
      </p>
      <p>
        <strong>Clique</strong>: Does G have a complete subgraph (clique) of size ≥ k? S is a clique in G iff
        S is an independent set in the complement graph G̅. Clique is NP-complete for k ≥ 3.
      </p>
      <p>
        <strong>Hamiltonian Cycle</strong>: Does G have a cycle visiting every vertex exactly once?
        NP-complete even for planar graphs. Reduction from 3-SAT uses gadgets for variables and clauses
        connected by directed edges encoding which literals are set true.
      </p>
      <p>
        <strong>TSP (decision)</strong>: Given cities with distances and integer B, does there exist a tour
        visiting all cities with total distance ≤ B? TSP is NP-complete via reduction from Hamiltonian Cycle.
      </p>
      <p>
        <strong>Subset Sum</strong>: Given integers S = &#123;a₁,...,aₙ&#125; and target T, does any subset sum to T?
        Special case of Knapsack; solvable in pseudo-polynomial time O(nT) via dynamic programming —
        strongly NP-hard (no poly-time algorithm even when T is bounded polynomially, assuming P≠NP).
      </p>

      <h2>How to Prove NP-Hardness</h2><HighlightBlock as="p" tier="important" className="mb-4">Failure modes to call out: choosing a familiar algorithm without proving fit, ignoring worst-case complexity, missing edge cases, and failing to switch to approximation or heuristics when exact solutions are infeasible.</HighlightBlock>
      <p>
        To prove problem X is NP-hard, find a known NP-hard problem Y and construct a polynomial-time reduction
        Y ≤ₚ X. The reduction must satisfy: a YES instance of Y maps to a YES instance of X, and a NO instance
        of Y maps to a NO instance of X.
      </p>
      <p>
        Methodology: choose Y as the simplest known NP-hard problem that structurally resembles X. Common choices:
      </p>
      <p>
        3-SAT for problems involving logical constraints or binary decisions (e.g., boolean circuit problems).
        Independent Set or Clique for problems about selecting subsets with compatibility constraints.
        3-Dimensional Matching for problems about covering or assignment with multiple dimensions.
        Hamiltonian Cycle for routing, sequencing, or ordering problems.
        Partition or Subset Sum for numerical optimization problems.
      </p>
      <p>
        Example: prove that Graph 3-Coloring is NP-hard. Reduce from 3-SAT. For each variable xᵢ, create a
        "variable gadget": three vertices (xᵢ, ¬xᵢ, base) forming a triangle. The three colors represent
        TRUE, FALSE, and BASE. For each clause (a ∨ b ∨ c), create an "OR gadget" with 5 additional vertices
        and edges ensuring the clause vertex gets color TRUE only if at least one literal is TRUE. The resulting
        graph is 3-colorable iff the 3-SAT formula is satisfiable.
      </p>

      <HighlightBlock as="p" tier="important">
        Cook's theorem and Karp's 21 NP-complete problems (1972) established the landscape. Garey and Johnson's
        "Computers and Intractability" (1979) remains the definitive reference with hundreds of NP-complete problems.
        When you encounter a new optimization problem, check this catalog before attempting to find a polynomial algorithm.
      </HighlightBlock>

      <h2>Coping Strategies for NP-Hard Problems</h2>
      <p>
        NP-hardness is not a dead end — it redirects effort toward practical algorithms with provable guarantees.
      </p>
      <p>
        <strong>Exact algorithms for small inputs:</strong> Branch-and-bound explores the solution space with
        pruning. Dynamic programming over subsets achieves O(2^n × poly(n)) — Held-Karp for TSP runs in
        O(n² × 2^n), feasible for n ≤ 20 cities. Branch-and-cut (LP relaxation + cutting planes) solves
        TSP instances with thousands of cities in practice (used by Concorde solver).
      </p>
      <p>
        <strong>Approximation algorithms:</strong> Run in polynomial time and guarantee a solution within a
        factor c of optimal. Vertex Cover: the 2-approximation via maximal matching is tight (assuming UGC,
        no (2-ε)-approximation exists). TSP with triangle inequality: Christofides algorithm achieves 1.5-approximation
        using minimum spanning tree + minimum weight perfect matching on odd-degree vertices. MAX-SAT:
        a simple greedy achieves 1/2-approximation; a 3/4-approximation uses randomized rounding.
      </p>
      <p>
        <strong>PTAS/FPTAS:</strong> A Polynomial-Time Approximation Scheme (PTAS) gives a (1+ε)-approximation
        in polynomial time for any fixed ε &gt; 0 (runtime may be exponential in 1/ε). A Fully Polynomial-Time
        Approximation Scheme (FPTAS) runs in poly(n, 1/ε). Knapsack has an FPTAS via rounding item values
        to O(n/ε) distinct values and applying exact DP. PTAS exists for planar graph problems (PTAS for
        Independent Set on planar graphs via Baker's technique).
      </p>
      <p>
        <strong>Fixed-Parameter Tractable (FPT):</strong> When problem instances have a natural parameter k
        (e.g., solution size, treewidth), FPT algorithms run in f(k) × poly(n) where f can be exponential.
        Vertex Cover: solve in O(2^k × n) using bounded search tree — check each edge, branch on which
        endpoint to include, decrement k. For small k (e.g., sparse graphs), this is efficient.
        Parameterized complexity theory classifies problems by (problem, parameter) pairs.
      </p>
      <p>
        <strong>Heuristics and metaheuristics:</strong> No worst-case guarantee, but excel on practical inputs.
        Simulated annealing for TSP: start with a random tour, iteratively swap edges, accept worse solutions
        with probability e^&#123;-ΔE/T&#125; (temperature T decreases over time). Genetic algorithms maintain a
        population of solutions, applying crossover and mutation. Local search and Lin-Kernighan heuristics
        solve TSP to within 0.5% of optimal on benchmark instances.
      </p>

      <h2>Special Cases and Boundary of Hardness</h2>
      <p>
        Many NP-hard problems have polynomial special cases that reveal the structure of hardness:
      </p>
      <p>
        <strong>TSP on trees</strong> is solvable in O(n) — the unique Hamiltonian path is the DFS traversal.
        TSP on metric spaces with special structure (e.g., Euclidean, l₁ norm) admits better approximations.
      </p>
      <p>
        <strong>Independent Set</strong> is NP-hard for general graphs but solvable in O(V+E) for bipartite
        graphs (König's theorem: |max independent set| = n - |max matching|) and in O(n^&#123;O(tw)&#125;) for
        graphs of treewidth tw.
      </p>
      <p>
        <strong>Graph Coloring</strong> is NP-hard for k ≥ 3 but trivial for k = 1 (all edges forbidden means
        only one vertex) and O(V+E) for k = 2 (bipartite testing via BFS).
      </p>
      <p>
        <strong>Integer Programming</strong> is NP-hard in general but solvable in polynomial time when the
        constraint matrix is totally unimodular (e.g., network flow problems, assignment problems).
      </p>

      <h2>Interview Questions</h2>

      <h3>Q1: What does it mean for a problem to be NP-complete, and why does it matter in practice?</h3>
      <p>
        NP-complete means the problem is in NP (YES answers have polynomial-length certificates verifiable in poly time)
        and NP-hard (every NP problem reduces to it in polynomial time). In practice, NP-completeness means:
        (1) No polynomial-time algorithm is known, and finding one would imply P=NP — an open problem for 50+ years.
        (2) For large inputs, exact solutions are infeasible; invest in approximation algorithms, heuristics,
        or FPT algorithms parameterized by problem structure. (3) For small inputs (&lt;25 elements), exponential
        exact algorithms may be practical. Recognition of NP-completeness prevents wasted effort seeking
        exact poly-time solutions and redirects to practical approaches.
      </p>

      <h3>Q2: How do you prove a new problem X is NP-hard?</h3>
      <p>
        Step 1: Find a known NP-hard problem Y (choose one structurally similar to X).
        Step 2: Construct a polynomial-time reduction f: Y ≤ₚ X — a function mapping Y-instances to X-instances
        such that y ∈ Y-YES iff f(y) ∈ X-YES.
        Step 3: Prove correctness: (a) Forward direction — if y is a YES-instance, show f(y) is a YES-instance.
        (b) Backward direction — if f(y) is a YES-instance, extract a certificate for y.
        Step 4: Verify f runs in polynomial time. The reduction proves X is at least as hard as Y, so X is NP-hard.
        To additionally show X ∈ NP (making X NP-complete), exhibit a polynomial verifier for YES-certificates.
      </p>

      <h3>Q3: Explain the 2-approximation for Vertex Cover.</h3>
      <p>
        Algorithm: find a maximal matching M (greedily add edges until no uncovered edge remains). Include both
        endpoints of every edge in M into the cover C. Correctness: every edge is covered because for any edge
        not in M, at least one endpoint is in C (otherwise M was not maximal). Size bound: |C| = 2|M|.
        Any vertex cover must include at least one endpoint of each matching edge (matching edges are disjoint),
        so |OPT| ≥ |M|. Therefore |C| = 2|M| ≤ 2|OPT|. This 2-approximation is tight: Assuming the Unique
        Games Conjecture, no (2-ε)-approximation exists for any ε &gt; 0.
      </p>

      <h3>Q4: What is the Christofides algorithm and when does it apply?</h3>
      <p>
        Christofides (1976) gives a 1.5-approximation for TSP when distances satisfy the triangle inequality
        (d(u,w) ≤ d(u,v) + d(v,w)). Algorithm: (1) Compute minimum spanning tree T (O(E log V)). (2) Find
        the set S of odd-degree vertices in T — |S| is even by the handshake lemma. (3) Find a minimum weight
        perfect matching M on S (O(|S|³ using Blossom algorithm). (4) Form Eulerian multigraph T ∪ M — all
        vertices now have even degree. (5) Find an Euler circuit in T ∪ M. (6) Shortcut repeated vertices to
        get a Hamiltonian cycle. Analysis: cost(T) ≤ OPT (dropping one TSP edge from optimal gives a spanning tree).
        cost(M) ≤ OPT/2 (optimal TSP splits into two perfect matchings on S; take the cheaper). Total ≤ 1.5 OPT.
        Note: requires triangle inequality — without it, TSP has no constant-factor approximation unless P=NP.
      </p>

      <h3>Q5: Design a system to solve a scheduling problem where NP-hardness is encountered. What algorithm do you use and why?</h3>
      <p>
        Problem: schedule n jobs with deadlines and profits on m machines to maximize total profit (weighted
        job scheduling across multiple machines is NP-hard for m ≥ 2).
      </p>
      <p>
        Analysis: identify structure. If m=1, the problem is polynomial (sort by deadline, DP in O(n log n)).
        For m ≥ 2 with arbitrary precedence constraints, it is NP-hard. Practical approach:
      </p>
      <p>
        (1) Exact (small n ≤ 20): branch-and-bound with LP relaxation upper bound. Prune branches where
        LP relaxation ≤ current best integer solution.
      </p>
      <p>
        (2) FPT (small m): DP over machine states. With m machines and T time slots, DP state is
        (machine loads) in O(T^m × n) — feasible for m=2 or 3.
      </p>
      <p>
        (3) Approximation (large n): PTAS for makespan minimization — for any ε, assign the ⌈1/ε⌉ largest
        jobs optimally via exhaustive search, then list-schedule remaining jobs. Achieves (1+ε)-approximation
        for makespan, runs in O(n^&#123;1/ε&#125;).
      </p>
      <p>
        (4) Heuristic (production): Least Processing Time (LPT) rule achieves 4/3-approximation for makespan.
        For profit maximization, use greedy by profit/deadline ratio + local search (swap pairs of jobs between
        machines). Benchmark against LP relaxation to measure optimality gap.
      </p>

      <h3>Q6: Why is 2-SAT polynomial while 3-SAT is NP-complete?</h3>
      <p>
        2-SAT (each clause has exactly 2 literals) reduces to SCC (strongly connected components) in a
        directed implication graph. For each clause (a ∨ b), add edges (¬a → b) and (¬b → a) — if ¬a is
        true, then b must be. The formula is unsatisfiable iff some variable x and ¬x are in the same SCC
        (implying x → ¬x and ¬x → x, a contradiction). SCC runs in O(V+E) = O(n+m), so 2-SAT ∈ P.
        3-SAT is NP-complete because the implication graph approach breaks down with 3 literals — the implications
        become disjunctions of two variables, not direct implications. Formally: 3-SAT is NP-hard by reduction
        from SAT (split each k-literal clause into (k-2) 3-literal clauses by introducing fresh variables).
        The expressiveness gap between 2 and 3 literals is precisely the boundary between P and NP-complete
        for SAT variants.
      </p>
    </ArticleLayout>
  );
}
