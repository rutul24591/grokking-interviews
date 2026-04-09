"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-derived-computed-state",
  title: "Optimize Derived & Computed State Performance",
  description:
    "Production-grade derived state optimization — selector memoization, computed pipelines, expensive calculation caching, and preventing unnecessary recomputation.",
  category: "low-level-design",
  subcategory: "state-management-data-architecture",
  slug: "derived-computed-state-performance",
  wordCount: 3400,
  readingTime: 20,
  lastUpdated: "2026-04-08",
  tags: [
    "lld",
    "derived-state",
    "computed",
    "memoization",
    "selectors",
    "performance",
    "reselect",
  ],
  relatedTopics: [
    "normalized-state-design",
    "component-subscription-management",
    "client-cache-invalidation",
  ],
};

export default function DerivedComputedStatePerformanceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a derived state system for a React application where
          computed values (filtered lists, aggregated stats, transformed data) are
          derived from raw state. Naive computation on every render wastes CPU
          (filtering 10,000 items when only one changed). We need memoized
          selectors that only recompute when their input data changes, a computed
          state pipeline for multi-stage transformations, and caching for expensive
          calculations.
        </p>
        <p><strong>Assumptions:</strong> React 19+, Zustand store, 100+ derived values across the app.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Memoized Selectors:</strong> Derived values cached until input state changes (Object.is comparison).</li>
          <li><strong>Multi-Stage Computed Pipeline:</strong> Computed A → Computed B → Computed C, where each stage only recomputes when its input changes.</li>
          <li><strong>Parameterized Selectors:</strong> Selectors accept parameters (filterByStatus(&apos;active&apos;)) and memoize per parameter set.</li>
          <li><strong>Expensive Calculation Cache:</strong> Computations taking &gt;16ms cached with LRU eviction.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Recomputation Cost:</strong> Selector recomputes only when inputs change. Unrelated state changes are O(1) cache hits.</li>
          <li><strong>Memory Overhead:</strong> Cached computed values use ≤5% of total store memory.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Selector input changes but output is the same (filtering removed items that were already removed) — should not notify subscribers.</li>
          <li>Parameterized selector with 100 different parameter values — cache must not grow unbounded.</li>
          <li>Circular computed dependencies (A depends on B, B depends on A) — detect and break cycles.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          Derived state uses memoized selectors (reselect pattern). Each selector
          defines input selectors (which state slices it depends on) and a result
          function (how to compute the derived value). The memoization layer
          caches input results and output. On access, inputs are evaluated — if
          all inputs return the same references as last time, cached output is
          returned without recomputation. If any input changed, result function
          runs, new output cached. For parameterized selectors, a factory function
          creates a memoized selector instance per parameter set, with LRU cache
          limiting.
        </p>
      </section>

      <section>
        <h2>System Design</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Modules</h3>
        <p>Six modules:</p>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Memoized Selector Factory (<code>lib/create-selector.ts</code>)</h4>
          <p>createSelector(inputSelectors[], resultFn) returns a memoized selector. Caches inputs and output. Recomputes only when any input changed (Object.is).</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Computed Pipeline (<code>lib/computed-pipeline.ts</code>)</h4>
          <p>Chains computed values: computedA → computedB → computedC. Each stage independently memoized. DAG of computed values, topological execution order.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Parameterized Selector (<code>lib/parameterized-selector.ts</code>)</h4>
          <p>Factory that creates memoized selector instances per parameter. LRU cache (max 50 parameter values per selector). Evicts least-used parameters.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Expensive Calculation Cache (<code>lib/expensive-calc-cache.ts</code>)</h4>
          <p>Caches results of expensive calculations (&gt;16ms) keyed by input hash. LRU eviction (max 100 entries). TTL-based expiration (5 min).</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Dependency Tracker (<code>lib/computed-dependencies.ts</code>)</h4>
          <p>Tracks which computed values depend on which state slices and other computed values. On state change, only recomputes affected computed values.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. Cycle Detector (<code>lib/cycle-detector.ts</code>)</h4>
          <p>Validates computed dependency graph is a DAG. Detects circular dependencies at definition time and throws with the cycle trace.</p>
        </div>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/derived-computed-state-performance-architecture.svg"
          alt="Derived state pipeline showing memoized selectors, computed pipeline stages, and cache layers"
          caption="Derived State Memoization Pipeline"
        />
      </section>

      <section>
        <h2>Data Flow</h2>
        <ol className="space-y-2 list-decimal list-inside">
          <li>Component accesses derived value via selector(state).</li>
          <li>Memoization layer evaluates input selectors — if all return same references, return cached output (O(1)).</li>
          <li>If any input changed, run result function, cache new output, return it.</li>
          <li>Output compared to previous cached output via Object.is — if same, do not notify subscribers.</li>
        </ol>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-3">
          <li><strong>Input changes but output same:</strong> Filtering a list where the changed item doesn&apos;t match the filter — output list unchanged. Selector detects output equality via shallow comparison (for arrays/objects) and does not notify subscribers.</li>
          <li><strong>Parameter cache overflow:</strong> Parameterized selector reaches 50 cached parameter values. LRU evictor removes the least-recently-used parameter&apos;s cached result. Next access with that parameter recomputes.</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">📦 Switch to the Example Tab</h3>
          <p>
            Complete implementation: createSelector with input memoization,
            computed pipeline with DAG execution, parameterized selectors
            with LRU cache, expensive calculation cache, and React integration.
          </p>
        </div>
      </section>

      <section>
        <h2>Performance</h2>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b border-theme"><th className="p-2 text-left">Operation</th><th className="p-2 text-left">Time</th><th className="p-2 text-left">Space</th></tr></thead>
            <tbody className="divide-y divide-theme">
              <tr><td className="p-2">Cache hit (inputs unchanged)</td><td className="p-2">O(1)</td><td className="p-2">O(1)</td></tr>
              <tr><td className="p-2">Cache miss (recompute)</td><td className="p-2">O(n) — computation cost</td><td className="p-2">O(output size)</td></tr>
              <tr><td className="p-2">Pipeline with k stages</td><td className="p-2">O(changed stages only)</td><td className="p-2">O(k × output)</td></tr>
            </tbody>
          </table>
        </div>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks & Optimizations</h3>
        <ul className="space-y-2">
          <li><strong>Result function creates new object every time:</strong> Even with same inputs, resultFn returns new reference → Object.is fails → subscribers notified unnecessarily. Fix: memoize result function output, return same reference when computation yields equivalent result.</li>
          <li><strong>Deep equality for output comparison:</strong> Comparing large arrays/objects with deep equality is expensive. Fix: use structural sharing (Immer) or shallow comparison for most cases, deep equality only for critical computed values.</li>
        </ul>
      </section>

      <section>
        <h2>Security & Testing</h2>
        <p>Computed values derived from validated state only — no raw API data in computed outputs. Test: memoization prevents recomputation on unrelated changes, parameterized selector LRU eviction, pipeline stage isolation (stage B recomputes when A changes, not when C changes), cycle detection at definition time.</p>
      </section>

      <section>
        <h2>Interview Insights</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes</h3>
        <ul className="space-y-3">
          <li><strong>No memoization:</strong> Computing derived values on every render. Interviewers expect reselect-style memoization.</li>
          <li><strong>Selector returns new object/array:</strong> Creating a new object with filtered items creates a new reference every time, which always triggers re-render. Fix: return the filtered array directly and memoize the selector.</li>
          <li><strong>Over-memoization:</strong> Memoizing trivial computations (state.user.name) adds overhead without benefit. Memoize only expensive computations (filtering, aggregating, transforming large datasets).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Follow-up Questions</h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle derived state that depends on async data?</p>
            <p className="mt-2 text-sm">
              A: The selector returns a status object with data, loading flag, and error. When async data is loading, data is null/previous value, isLoading is true. When data arrives, selector recomputes with the new data. The memoization handles the transition — previous cached result returned during loading, new result returned when data arrives.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement time-windowed computed values (e.g., average over last 5 minutes)?</p>
            <p className="mt-2 text-sm">
              A: Store timestamped data points in the raw state. The computed
              selector filters data points within the time window, then computes
              the average. Memoization caches the result — recomputes only when
              new data points arrive or time window slides. For smooth time-based
              updates, use setInterval to invalidate the selector periodically
              (every 30 seconds), triggering recomputation with the current time
              window.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li><a href="https://reselect.js.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Reselect — Memoized Selectors</a></li>
          <li><a href="https://redux.js.org/usage/deriving-data-selectors" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Redux — Deriving Data with Selectors</a></li>
          <li><a href="https://tanstack.com/query/latest/docs/react/guides/dependent-queries" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">TanStack Query — Dependent Queries</a></li>
          <li><a href="https://immerjs.github.io/immer/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Immer — Structural Sharing</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
