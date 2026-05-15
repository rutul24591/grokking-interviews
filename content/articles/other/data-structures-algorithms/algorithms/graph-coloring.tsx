"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-other-dsa-algorithms-graph-coloring",
  title: "Graph Coloring & Chromatic Number",
  description: "Graph coloring assigns colors to vertices so no two adjacent vertices share a color — the foundation of register allocation, exam scheduling, and frequency assignment, with greedy algorithms for practical solutions and NP-hardness for exact chromatic number.",
  category: "other",
  subcategory: "data-structures-algorithms",
  slug: "graph-coloring",
  wordCount: 2200,
  readingTime: 9,
  lastUpdated: "2026-05-16",
  tags: ["graph-coloring", "chromatic-number", "greedy", "bipartite", "register-allocation"],
  relatedTopics: ["graphs", "bfs", "dfs", "np-completeness", "bipartite-matching"],
};

export default function GraphColoringArticle() {
  return (
    <ArticleLayout metadata={metadata}>

      <section>
        <h2>Definition &amp; Context</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: graph coloring appears in compiler register allocation (variables as vertices, live-range conflicts as edges, registers as colors), scheduling problems, and as a canonical NP-complete problem. Know the greedy O(V+E) algorithm, the Δ+1 color bound, bipartite 2-coloring via BFS, and why computing the exact chromatic number is NP-hard.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          A <strong>proper k-coloring</strong> of a graph G = (V, E) assigns one of k colors to each vertex such that no two adjacent vertices (connected by an edge) share the same color. The <strong>chromatic number</strong> χ(G) is the minimum k for which a proper coloring exists. Graph coloring is a constraint satisfaction problem: the constraint is that adjacent vertices differ in color; the objective is to minimize the number of colors used.
        </HighlightBlock>
        <p>
          Computing χ(G) exactly is NP-hard for general graphs — there is no known polynomial-time algorithm. However, practical algorithms for specific graph classes and efficient approximation algorithms make graph coloring a rich and useful topic. Greedy coloring finds a valid coloring using at most Δ(G) + 1 colors in O(V + E) time, where Δ(G) is the maximum vertex degree.
        </p>
      </section>

      <section>
        <h2>Chromatic Number — Properties</h2>
        <p>
          Several structural properties of a graph determine or bound its chromatic number. An empty graph (no edges) has χ = 1 — every vertex gets the same color. A graph with at least one edge has χ ≥ 2. A graph containing a triangle (3-clique) has χ ≥ 3. More generally, a graph containing a k-clique has χ ≥ k — the clique number ω(G) is a lower bound on χ(G).
        </p>
        <p>
          <strong>Bipartite graphs:</strong> χ(G) = 2 if and only if G is bipartite (has no odd cycles). This is the most important special case — detecting bipartiteness and finding a 2-coloring can be done in O(V + E) via BFS, making it the only chromatic number value computable in polynomial time for general graphs.
        </p>
        <p>
          <strong>Planar graphs:</strong> by the Four Color Theorem (Appel and Haken, 1976 — the first major theorem proved with computer assistance), every planar graph has χ ≤ 4. The Five Color Theorem is easier to prove manually.
        </p>
        <p>
          <strong>Brook&apos;s Theorem:</strong> for any connected graph G that is neither a complete graph nor an odd cycle, χ(G) ≤ Δ(G). Complete graphs and odd cycles are the only graphs requiring Δ + 1 colors.
        </p>
        <p>
          <strong>Perfect graphs:</strong> a graph is perfect if χ(G&apos;) = ω(G&apos;) for every induced subgraph G&apos; — the chromatic number equals the clique number. Perfect graphs include bipartite graphs, chordal graphs, and interval graphs. By the Strong Perfect Graph Theorem (Chudnovsky et al., 2006), perfect graphs are exactly the graphs with no odd hole or odd antihole as an induced subgraph.
        </p>
      </section>

      <section>
        <h2>Greedy Coloring</h2>
        <HighlightBlock as="p" tier="important">
          Greedy coloring processes vertices in some order and assigns each vertex the smallest color not used by any of its already-colored neighbors. Time complexity: O(V + E). Colors used: at most Δ(G) + 1. The result is always a valid coloring but may not be optimal — the number of colors depends heavily on the vertex ordering.
        </HighlightBlock>
        <p>
          The algorithm: maintain a color assignment array and, for each vertex v in the chosen order, mark colors used by v&apos;s neighbors, then assign the smallest unmarked color to v. This takes O(degree(v)) per vertex, O(V + E) total.
        </p>
        <p>
          <strong>Why Δ + 1 colors always suffice:</strong> when coloring vertex v, at most Δ(G) neighbors are already colored. They use at most Δ(G) distinct colors. Therefore, at least one color from &#123;1, 2, ..., Δ+1&#125; is always available for v. This gives an O(V + E) algorithm using at most Δ + 1 colors for any graph.
        </p>
        <p>
          <strong>Welsh-Powell algorithm:</strong> sort vertices by degree in decreasing order, then apply greedy coloring. This heuristic typically uses fewer colors than arbitrary-order greedy because high-degree vertices (which need colors most urgently) are colored first. Complexity: O(V log V + E) due to the sort. No worst-case improvement over Δ + 1, but practically often achieves χ(G).
        </p>
        <p>
          <strong>DSatur (Degree of SATURation):</strong> at each step, choose the uncolored vertex with the highest saturation (number of distinct colors in its neighborhood). Break ties by degree. This dynamic ordering adapts to the evolving coloring and finds the exact χ(G) for many practical graph classes. Complexity: O(V² + E) with a naive implementation, O((V + E) log V) with a priority queue.
        </p>
      </section>

      <section>
        <h2>2-Coloring and Bipartite Detection</h2>
        <HighlightBlock as="p" tier="important">
          Bipartite detection and 2-coloring via BFS is the most common graph coloring problem in FAANG interviews. The algorithm: BFS from any unvisited vertex, alternating colors level by level. If a conflict is detected (same color on both endpoints of an edge), the graph is not bipartite. Runs in O(V + E).
        </HighlightBlock>
        <p>
          The BFS approach: initialize all vertices as uncolored. For each unvisited vertex u, color it with color 0 and BFS. When exploring neighbor v of a colored vertex c: if v is uncolored, color v with 1 - c and enqueue. If v is already colored with c (same color as its neighbor), return &quot;not bipartite&quot;. If BFS completes without conflict, the graph is bipartite with the assigned 2-coloring.
        </p>
        <p>
          DFS also works: DFS tree edges alternate colors; any back edge that connects two vertices of the same color indicates an odd cycle (non-bipartite). Both approaches are equally correct — BFS tends to be easier to implement and reason about for this problem.
        </p>
        <p>
          LeetCode 785 (Is Graph Bipartite?) and LeetCode 886 (Possible Bipartition) are canonical examples. LeetCode 886 models people as vertices and dislikes as edges, asking if the graph is 2-colorable (people can be split into two groups with no dislikes within a group).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/graph-coloring-architecture.svg"
          alt="Graph Coloring Architecture — chromatic number, greedy algorithms, special graph classes, and applications"
          caption="Graph coloring: chromatic number properties, greedy coloring variants (Welsh-Powell, DSatur), special cases (bipartite/planar/perfect), and applications in register allocation and scheduling"
        />
      </section>

      <section>
        <h2>NP-Hardness and Approximation</h2>
        <p>
          Determining whether χ(G) ≤ k for k ≥ 3 is NP-complete. The 3-colorability problem is one of Karp&apos;s 21 original NP-complete problems (1972), proved via reduction from 3-SAT: each boolean variable creates a gadget with three vertices, and clause satisfaction maps to a valid 3-coloring constraint.
        </p>
        <p>
          Approximation is also hard: the best known polynomial-time approximation algorithm for general graphs achieves O(n / log n) colors (Wigderson, 1983 improved by Halldórsson, 1993). It is NP-hard to approximate chromatic number within n^(1-ε) for any ε &gt; 0 (Zuckerman, 2007) — graph coloring is one of the hardest problems to approximate.
        </p>
        <p>
          For practical cases, the problem is tractable: interval graphs (χ = ω, computable in polynomial time), chordal graphs (perfect, polynomial via perfect elimination ordering), planar graphs (χ ≤ 4 always, greedy with 6 colors always works), and bounded-degree graphs (greedy gives Δ + 1 ≤ k + 1 for a fixed bound k).
        </p>
      </section>

      <section>
        <h2>Applications</h2>
        <HighlightBlock as="p" tier="important">
          <strong>Register allocation (compiler design):</strong> the most important practical application. Build the interference graph: each program variable is a vertex; two variables have an edge if their live ranges overlap (they are &quot;live&quot; at the same program point and cannot share a register). Graph coloring with k = number of physical registers finds a valid assignment. Variables that cannot be colored (spilled) are moved to memory. Greedy coloring with Chaitin&apos;s algorithm is the standard approach in production compilers (GCC, LLVM).
        </HighlightBlock>
        <p>
          <strong>Exam scheduling:</strong> courses are vertices; two courses have an edge if they share at least one student. A valid k-coloring assigns each course a time slot (color) such that no student has two exams simultaneously. Minimizing k minimizes the exam period length. This is a direct graph coloring problem; Welsh-Powell or DSatur gives practical solutions.
        </p>
        <p>
          <strong>Frequency assignment in wireless networks:</strong> transmitters are vertices; two transmitters have an edge if their signals interfere (geographic proximity). Colors are frequency channels. A valid coloring ensures no two interfering transmitters share a channel. Minimizing colors minimizes spectrum usage.
        </p>
        <p>
          <strong>Sudoku:</strong> the 9×9 Sudoku grid is a graph coloring problem. Create a vertex for each cell; add edges between all cells in the same row, column, or 3×3 box. A valid 9-coloring (digits 1-9) of this 81-vertex, 810-edge graph is a solved Sudoku puzzle. This connection motivates Sudoku solvers based on constraint propagation and backtracking — the same techniques used for graph coloring.
        </p>
        <p>
          <strong>Map coloring:</strong> regions are vertices; two regions share an edge if they have a common border. The Four Color Theorem guarantees that 4 colors suffice for any planar map. In practice, most maps require only 3 colors, and greedy coloring on the dual graph finds valid colorings efficiently.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          For practical graph coloring problems, start with DSatur — it finds the optimal coloring for many structured graphs (interval, chordal, planar) and uses close to optimal colors for random graphs. Fall back to Welsh-Powell for simplicity and speed when near-optimal is sufficient.
        </p>
        <p>
          For bipartite detection, always use BFS 2-coloring rather than trying to detect odd cycles directly — it is simpler and catches the same condition. Handle disconnected graphs by running BFS from every unvisited vertex.
        </p>
        <p>
          For register allocation, augment the interference graph with precolored nodes (variables assigned to specific registers by calling convention) and use Chaitin-Briggs coloring: simplify (remove low-degree nodes), spill candidates, select (reverse-order color assignment), start over if spills occur.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: be ready to detect bipartite graphs via BFS 2-coloring, explain the Δ+1 greedy bound, and describe register allocation as graph coloring — these cover 90% of graph coloring interview questions at all levels.
        </HighlightBlock>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Q1: What is graph coloring and what is the chromatic number? (junior)</h3>
          <p>Graph coloring assigns colors to vertices such that no two adjacent vertices share the same color. The chromatic number χ(G) is the minimum number of colors needed. χ = 1 for graphs with no edges, χ = 2 for bipartite graphs, χ = n for complete graphs Kₙ. Computing χ(G) exactly for general graphs is NP-hard. Greedy coloring runs in O(V+E) and uses at most Δ+1 colors where Δ is the maximum degree.</p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Q2: How do you determine if a graph is bipartite? What does it mean algorithmically? (junior-mid)</h3>
          <p>A graph is bipartite iff it has no odd-length cycles iff it is 2-colorable. BFS 2-coloring: start from any vertex, assign color 0. For each neighbor, assign color 1 - (parent color). If any neighbor already has the same color as its parent, the graph is not bipartite. Run BFS from each unvisited vertex to handle disconnected graphs. O(V+E) total.</p>
          <p>Applications: bipartite graphs model two-sided matching (workers and jobs), recommendation systems (users and items), and scheduling constraints. 2-colorability is the only χ value computable in polynomial time for general graphs.</p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Q3: Prove that greedy coloring always uses at most Δ(G)+1 colors. (mid)</h3>
          <p>When greedy colors vertex v, it has already colored some of v&apos;s neighbors. The number of already-colored neighbors is at most deg(v) ≤ Δ(G). These neighbors use at most Δ(G) distinct colors. The greedy algorithm assigns the smallest color not used by any neighbor. Since there are Δ(G) colors used (at most) and we have Δ(G)+1 colors available &#123;1,...,Δ+1&#125;, at least one color is always free. By induction, greedy never needs more than Δ+1 colors.</p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Q4: Explain register allocation as graph coloring. What happens when there are more variables than registers? (senior)</h3>
          <p>Build the interference graph: vertex per variable, edge between variables whose live ranges overlap. k-color the graph with k = number of physical registers. Each color corresponds to a register; each variable gets the register of its assigned color. This is a valid assignment — no two variables in the same register are live at the same time.</p>
          <p>When the graph cannot be k-colored (some vertex has degree ≥ k), the compiler spills a variable to memory: pick a low-priority variable to spill, remove it from the graph, recolor, then add a load/store before/after each use/def of the spilled variable. Repeat until all remaining variables can be k-colored. Chaitin&apos;s algorithm formalizes this as: Simplify (remove ≤k-1 degree nodes to a stack), Spill (if no simplifiable node, mark a spill candidate and remove), Rebuild (color in reverse stack order, spill those that fail).</p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Q5: Why is graph coloring NP-hard? Describe the reduction from 3-SAT to 3-coloring. (senior-staff)</h3>
          <p>3-colorability is NP-complete: it is in NP (a certificate is the coloring itself, verifiable in O(V+E)), and it is NP-hard via reduction from 3-SAT.</p>
          <p>Reduction: given a 3-SAT formula with variables x₁,...,xₙ and clauses c₁,...,cₘ, build a graph G. Create three special vertices T (true), F (false), B (base) — all mutually connected (forming K₃). For each variable xᵢ, create vertices xᵢ and ¬xᵢ connected to each other and to B — forcing xᵢ and ¬xᵢ to receive the T and F colors (in some order). For each clause (a ∨ b ∨ c), add a gadget that is 3-colorable iff at least one of a, b, c receives the T color. The full graph is 3-colorable iff the formula is satisfiable. The reduction runs in polynomial time, proving 3-coloring is NP-hard.</p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Q6: Design a course scheduling system that minimizes exam time slots using graph coloring. (staff)</h3>
          <p>Model: vertices are courses; add an edge between course A and course B if any student is enrolled in both. A valid k-coloring assigns each course a time slot such that no student has two simultaneous exams. Minimizing k minimizes the exam period duration.</p>
          <p>Algorithm: use DSatur for near-optimal coloring. Build the interference graph in O(students × courses) time. Apply DSatur: O((V+E) log V). For n=1000 courses and typical density, this runs in milliseconds.</p>
          <p>Practical enhancements: add room-capacity constraints (each color/slot has limited room capacity — weighted coloring variant), handle prerequisite constraints (some courses must precede others — colored topological ordering), and minimize student travel (pack morning vs afternoon slots — add geographic constraints as soft penalties). For the NP-hard exact solution, branch-and-bound with DSatur lower bounds works well for up to ~100 courses; for larger instances, local search (simulated annealing on the coloring) provides high-quality practical solutions.</p>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2 text-sm text-muted">
          <li>Karp, R. (1972). &quot;Reducibility Among Combinatorial Problems&quot; — Complexity of Computer Computations</li>
          <li>Chaitin, G. (1982). &quot;Register Allocation via Coloring&quot; — Computer Languages 6(1)</li>
          <li>Welsh, D. &amp; Powell, M. (1967). &quot;An Upper Bound for the Chromatic Number&quot; — Computer Journal 10(1)</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
