"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "ternary-search",
  title: "Ternary Search",
  description:
    "Ternary Search — divide the range into thirds to find the extremum of a unimodal function. O(log n) with larger constants than binary search.",
  category: "other",
  subcategory: "algorithms",
  slug: "ternary-search",
  wordCount: 4300,
  readingTime: 21,
  lastUpdated: "2026-04-20",
  tags: ["ternary-search", "unimodal", "optimization", "golden-section"],
  relatedTopics: ["binary-search", "golden-section-search", "gradient-descent", "convex-optimization"],
};

export default function TernarySearchArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p className="mb-4">
          Ternary Search finds the extremum (maximum or minimum) of a unimodal function over an
          ordered domain by evaluating at two points that trisect the current range and eliminating
          the third of the range that cannot contain the extremum. For continuous domains, each
          iteration shrinks the range by 1/3 (keeping 2/3), giving O(log₃/₂ n) = O(log n)
          convergence. For discrete domains, termination is when the range narrows to 1–3 elements
          and a direct comparison finishes the work.
        </p>
        <p className="mb-4">
          Ternary search is often introduced as a variant of binary search, but this is misleading.
          Binary search finds a <em>value</em> in a sorted sequence. Ternary search finds the
          <em> extremum of a unimodal function</em> — a different problem. When the problem
          reduces to &ldquo;find x where a monotone predicate flips&rdquo;, use binary search.
          When it reduces to &ldquo;find x minimizing/maximizing f(x) where f rises then falls&rdquo;,
          use ternary search.
        </p>
        <p className="mb-4">
          In practice, ternary search appears in competitive programming (optimizing convex/concave
          cost functions), numerical optimization (when gradients are unavailable), and specific
          problems like finding the peak of a mountain array or the optimum point in a parabolic
          trajectory. For serious numerical work, golden-section search — a close relative —
          evaluates only one new point per iteration and is usually preferred.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <p className="mb-4">
          A function f is <span className="font-semibold">unimodal</span> on [lo, hi] if there
          exists a point x* such that f is strictly increasing on [lo, x*] and strictly decreasing
          on [x*, hi] (for a maximum; flip for minimum). Ternary search exploits unimodality: pick
          m1 = lo + (hi − lo)/3 and m2 = hi − (hi − lo)/3. If f(m1) &lt; f(m2), the maximum cannot
          lie in [lo, m1] (it would contradict unimodality), so lo = m1 + 1. Otherwise the maximum
          cannot lie in [m2, hi], so hi = m2 − 1.
        </p>
        <p className="mb-4">
          Each iteration eliminates one-third of the range, keeping two-thirds. After k iterations
          the remaining range is (2/3)^k · (hi − lo). Termination at range size 1 requires
          log₃/₂(n) ≈ 1.71 · log₂ n iterations. Each iteration costs 2 function evaluations, so
          total cost is ≈ 3.42 · log₂ n evaluations — about 3.4× more than binary search&rsquo;s
          log₂ n comparisons. Binary search is strictly cheaper per iteration but solves a
          different problem.
        </p>
        <p className="mb-4">
          Critical constraint: ternary search <span className="font-semibold">requires strict
          unimodality</span>. On plateaus (f(x1) == f(x2) on a flat region), the elimination logic
          fails — neither side can be safely discarded. Real-world functions with flat regions need
          either a perturbation, a tie-breaking rule, or a different algorithm (e.g., scanning the
          plateau explicitly).
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/ternary-search-diagram-1.svg"
          alt="Ternary search trace on a unimodal parabola"
          caption="Unimodal parabola peak finding: two probes m1, m2 eliminate one third per iteration. After 3 iterations, range collapses to the peak."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p className="mb-4">
          Discrete version: while hi − lo &gt; 2, compute m1 = lo + (hi − lo)/3 and m2 = hi − (hi −
          lo)/3. Compare f(m1) and f(m2). Narrow lo or hi accordingly. When range ≤ 2, evaluate all
          remaining elements directly and return the best. The explicit base case avoids
          off-by-one bugs at the termination boundary.
        </p>
        <p className="mb-4">
          Continuous version: iterate until hi − lo &lt; ε (absolute tolerance) or (hi − lo) /
          (|lo| + |hi|) &lt; ε (relative tolerance). Typical ε is 1e-9 for doubles; fewer
          iterations (~60) suffice since double precision is ~15 digits. Use relative tolerance
          when the range can span orders of magnitude.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/ternary-search-diagram-2.svg"
          alt="Ternary search vs golden-section search efficiency"
          caption="Golden-section search reuses one probe per iteration; ternary does not. Same convergence rate, but golden-section evaluates f once per step instead of twice."
        />
        <p className="mb-4">
          <span className="font-semibold">Golden-section search</span> is a refinement that uses
          the golden ratio φ = (√5 − 1)/2 ≈ 0.618 to place probes asymmetrically, allowing one
          probe from the previous iteration to be reused. It makes one function evaluation per
          iteration vs ternary&rsquo;s two, making it ~2× faster for the same convergence rate.
          Numerical optimization libraries (scipy.optimize.minimize_scalar method=&lsquo;golden&rsquo;)
          implement it by default.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <p className="mb-4">
          <span className="font-semibold">vs Binary Search:</span> different problems. Binary
          requires a monotone predicate (sorted order, feasibility boundary). Ternary requires a
          unimodal function. When the derivative f&prime;(x) is available and monotone, binary-
          search f&prime;(x) = 0 instead — solves the same optimization in half the evaluations.
        </p>
        <p className="mb-4">
          <span className="font-semibold">vs Golden-Section Search:</span> golden-section is
          strictly better than ternary for continuous domains: same convergence, one probe per
          iteration. Ternary persists in teaching materials because of its cleaner
          &ldquo;trisect&rdquo; intuition, but real numerical code uses golden-section.
        </p>
        <p className="mb-4">
          <span className="font-semibold">vs Gradient Descent:</span> if f is differentiable,
          gradient descent converges faster (quadratically for Newton&rsquo;s method, linearly for
          steepest descent). Ternary search is gradient-free — useful when f is not differentiable
          or derivatives are expensive.
        </p>
        <p className="mb-4">
          <span className="font-semibold">vs Brent&rsquo;s Method:</span> scipy&rsquo;s default,
          combining parabolic interpolation with golden-section fallback. Superlinear convergence
          on smooth functions, golden-section&rsquo;s robust linear convergence elsewhere.
          Ternary search is the educational primitive; Brent&rsquo;s is what production code
          actually calls.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <p className="mb-4">
          Before adopting ternary search, verify unimodality. Plot f over the expected domain,
          check for plateaus, kinks, or multiple local extrema. A function that looks unimodal at
          macro scale but has small ripples will lead ternary astray. Multimodal functions need
          global optimization methods (simulated annealing, basin-hopping, multi-start).
        </p>
        <p className="mb-4">
          For continuous domains, prefer golden-section search or Brent&rsquo;s method. They are
          faster per iteration and more robust to floating-point imprecision. Use ternary search
          only for teaching, for discrete integer domains, or when algorithmic clarity outweighs
          optimization.
        </p>
        <p className="mb-4">
          Set tolerance conservatively. For double-precision floats, hi − lo &lt; 1e-9 is typical,
          but cap iterations at 100 to avoid infinite loops from floating-point drift. For integer
          domains, terminate when hi − lo ≤ 2 and evaluate the remaining points directly.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <p className="mb-4">
          <span className="font-semibold">Applying to non-unimodal functions:</span> the algorithm
          silently returns a local extremum — possibly far from the global one. Verify unimodality
          analytically or by dense sampling before trusting the result.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Off-by-one on integer domains:</span> lo = m1 + 1 vs lo
          = m1 matters when extremum sits exactly on m1. Safer pattern: narrow to hi − lo ≤ 2, then
          brute-force the remaining 2–3 elements.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Floating-point termination:</span> hi − lo &lt; ε may
          never be reached due to rounding; always cap iterations. Golden-section is more
          numerically stable than ternary.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Plateau regions:</span> if f(m1) == f(m2) on a flat
          region, neither arm can be eliminated safely. Break the tie with a secondary criterion,
          perturb the domain, or scan the plateau explicitly.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <p className="mb-4">
          <span className="font-semibold">Competitive programming optimization:</span> problems of
          the form &ldquo;minimize cost(x) where cost is convex&rdquo; — parametrized geometry,
          production scheduling with convex penalties, cost-vs-quality trade-off curves.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Peak finding in mountain arrays:</span> given an array
          that rises then falls, find the peak index. Leetcode 162 (Find Peak Element) and 852
          (Peak Index in a Mountain Array) are canonical. Ternary works; binary on the derivative
          sign is faster.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Machine learning hyperparameter tuning:</span>
          one-dimensional hyperparameter scans (learning rate over a fixed range) sometimes use
          golden-section or ternary when grid search is too coarse. Bayesian optimization has
          largely replaced this in practice.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Physics simulation:</span> finding ballistic trajectory
          apex, convex lens focal point optimization, and similar smooth-unimodal problems. For
          production numerical work, scipy&rsquo;s Brent&rsquo;s method is the standard; ternary
          is the pedagogical baseline.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/ternary-search-diagram-3.svg"
          alt="Decision tree for choosing between binary, ternary, and golden-section search"
          caption="Decision tree: monotone predicate → binary. Unimodal function → golden-section (or ternary). Multimodal → global optimization."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <p className="mb-4">
          <span className="font-semibold">Find peak in mountain array.</span> Classic ternary (or
          binary on derivative) question. Binary is cleaner: compare a[mid] vs a[mid+1]; if
          ascending, lo = mid + 1; else hi = mid.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Why not binary search for optimization?</span> Binary
          requires a monotone predicate — a single &ldquo;yes/no&rdquo; boundary. Unimodal
          functions have an extremum, not a boundary, so binary doesn&rsquo;t apply directly.
          However, if the derivative is available and monotone, binary-searching f&prime; = 0 is
          equivalent and faster.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Complexity?</span> O(log n) with base 3/2 ≈ 1.71 · log₂
          n iterations, each with 2 evaluations → ~3.42 · log₂ n function evaluations. Golden-
          section achieves ~1.44 · log₂ n evaluations (half of ternary).
        </p>
        <p className="mb-4">
          <span className="font-semibold">What breaks if the function isn&rsquo;t unimodal?</span>
          The elimination rule is no longer safe; discarding a third may discard the global
          extremum. Algorithm returns some local extremum with no guarantee of correctness.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Kiefer, &ldquo;Sequential minimax search for a maximum&rdquo; (1953) — original golden-section analysis.</li>
          <li>Press et al., <em>Numerical Recipes</em>, ch. 10 — gold-section, Brent&rsquo;s method, parabolic interpolation.</li>
          <li>SciPy documentation — <code>scipy.optimize.minimize_scalar</code> methods: golden, brent, bounded.</li>
          <li>CP-Algorithms, &ldquo;Ternary Search&rdquo; — https://cp-algorithms.com/num_methods/ternary_search.html</li>
          <li>Boyd &amp; Vandenberghe, <em>Convex Optimization</em>, §9 — one-dimensional search methods.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
