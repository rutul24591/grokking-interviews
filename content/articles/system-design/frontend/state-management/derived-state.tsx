"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-derived-state-concise",
  title: "Derived State",
  description: "Comprehensive guide to derived state patterns including computed values, memoized selectors, useMemo, Reselect, and avoiding redundant state in frontend applications.",
  category: "frontend",
  subcategory: "state-management",
  slug: "derived-state",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-13",
  tags: ["frontend", "state management", "derived state", "selectors", "memoization", "computed values"],
  relatedTopics: ["local-component-state", "global-state-management", "state-normalization"],
};

export default function DerivedStateConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Derived state</strong> is any value that can be computed deterministically from existing state rather
          than being stored independently. The foundational principle is simple: <em>don{"'"}t store what you can compute</em>.
          If a value is a pure function of other state, it should be calculated on demand or memoized, never duplicated
          in a separate store or useState call.
        </p>
        <p>
          Redundant state is one of the most prolific sources of bugs in frontend applications. When the same information
          lives in two places, they inevitably drift out of sync. A filtered list stored alongside the original list and
          the active filter is a classic example: updating the filter without recomputing the filtered list leaves stale
          data in the UI. The fix is not "remember to update both"—it is to eliminate the duplicate entirely and derive
          the filtered list every time it is needed.
        </p>
        <p>
          The concept has deep roots. Spreadsheet formulas (1979, VisiCalc) were early derived state: cell C1 containing
          <code>=A1+B1</code> recomputes automatically when either input changes. MobX (2015) brought this idea to React
          with <code>computed</code> properties that track dependencies automatically. Reselect (2015) introduced
          memoized selectors to Redux, solving the problem of expensive derivations in an immutable-state world. React
          itself adopted the pattern with <code>useMemo</code> in Hooks (2019), and Recoil (2020) extended it to
          asynchronous derived state via selectors.
        </p>
        <p>
          At staff/principal level, understanding derived state is not optional. It directly impacts rendering performance,
          state architecture decisions, and the long-term maintainability of any non-trivial application. Choosing where
          and how to derive values—during render, in a memoized selector, or via automatic dependency tracking—is a
          design decision with significant downstream consequences.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>Derived state rests on several interconnected ideas that determine how values are computed, cached, and propagated:</p>
        <ul>
          <li>
            <strong>Computing During Render:</strong> The simplest form of derived state is a local variable computed
            inside the render function. If the parent state changes and the component re-renders, the derived value is
            automatically fresh. This approach is zero-cost when the computation is trivial (a boolean flag, a string
            concatenation, a simple filter on a small array). No hooks, no selectors—just a <code>const</code> in the
            function body.
          </li>
          <li>
            <strong>useMemo (React):</strong> When the computation is expensive (sorting thousands of items, complex
            transformations), <code>useMemo</code> caches the result and only recomputes when its dependency array changes.
            The key contract: useMemo is a <em>performance optimization</em>, not a semantic guarantee. React may discard
            cached values under memory pressure. Write code that works without useMemo, then add it to avoid redundant
            work. Incorrect dependency arrays are the number one source of stale derived state bugs.
          </li>
          <li>
            <strong>Reselect (createSelector):</strong> In Redux and similar stores, Reselect provides composable
            memoized selectors. A selector consists of <em>input selectors</em> (functions that extract slices of state)
            and an <em>output selector</em> (a function that computes the derived value from those slices). Memoization
            is based on referential equality of inputs: if no input selector returns a new reference, the cached output
            is returned immediately. Selectors compose naturally—one selector{"'"}s output becomes another{"'"}s input,
            forming a dependency graph.
          </li>
          <li>
            <strong>Zustand Selectors with Shallow Equality:</strong> Zustand encourages deriving state via inline
            selectors passed to <code>useStore</code>. By default, Zustand uses strict equality (===) to determine if
            a re-render is needed. For selectors that return new objects or arrays, using the <code>shallow</code>
            equality function from Zustand prevents unnecessary re-renders when the derived object{"'"}s contents
            haven{"'"}t changed, even if the reference is new.
          </li>
          <li>
            <strong>MobX Computed:</strong> MobX{"'"}s <code>computed</code> values use automatic dependency tracking.
            When a computed getter runs, MobX records which observables it accesses. If none of those observables change,
            the cached value is returned. This is the most ergonomic approach—no manual dependency arrays, no input
            selectors—but requires MobX{"'"}s observable system and its proxy-based reactivity model.
          </li>
          <li>
            <strong>Recoil Selectors (Async Derived State):</strong> Recoil extends derived state to asynchronous
            computations. A selector{"'"}s <code>get</code> function can await other atoms or selectors, and Recoil
            handles Suspense integration, caching, and dependency tracking. This is powerful for values that depend on
            server data—a user{"'"}s permissions derived from an API response, for example.
          </li>
          <li>
            <strong>The "Derive, Don{"'"}t Duplicate" Principle:</strong> Store the minimal canonical state. Everything
            else should be a function of that state. A shopping cart stores items with quantities and prices. The total
            is derived. The item count is derived. The "has items" boolean is derived. If you find yourself writing
            <code>setTotal(newTotal)</code> alongside <code>setItems(newItems)</code>, you have redundant state.
          </li>
          <li>
            <strong>Referential Stability:</strong> Derived values that return objects or arrays create new references
            on every computation. This breaks React{"'"}s shallow comparison for props and can cascade unnecessary
            re-renders through the component tree. Memoization (useMemo, Reselect, MobX computed) solves this by
            returning the same reference when inputs haven{"'"}t changed. Referential stability is not just a performance
            concern—it affects correctness when derived values are used as useEffect dependencies.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          Derived state forms a directed acyclic graph (DAG) where base state nodes sit at the roots and derived
          values flow downstream. Understanding this graph is critical for predicting when recomputation occurs and
          ensuring that changes propagate correctly without redundant work.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Dependency Graph Structure</h3>
          <p>
            Consider a product listing page with items, a filter string, and a sort order. The dependency graph has
            three base state nodes: <code>items[]</code>, <code>filter</code>, and <code>sortOrder</code>. From these,
            three derived values are computed in sequence:
          </p>
          <ol className="mt-3 space-y-2">
            <li><strong>1. filteredItems</strong> — depends on <code>items[]</code> and <code>filter</code></li>
            <li><strong>2. sortedFilteredItems</strong> — depends on <code>filteredItems</code> and <code>sortOrder</code></li>
            <li><strong>3. itemCount</strong> — depends on <code>sortedFilteredItems</code></li>
          </ol>
          <p className="mt-3">
            When the user changes the filter, <code>filteredItems</code> recomputes, which causes <code>sortedFilteredItems</code>
            to recompute, which causes <code>itemCount</code> to update. But changing an unrelated piece of state (say,
            the user{"'"}s theme preference) triggers no recomputation at all. The DAG ensures minimal work.
          </p>
        </div>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/state-management/derived-state-graph.svg"
          alt="Derived State Dependency Graph"
          caption="Dependency graph showing base state nodes flowing into derived values. Changing 'filter' recomputes downstream nodes but leaves unrelated state untouched."
        />

        <p>
          Selector composition mirrors this graph. In Reselect, you would define <code>selectFilteredItems</code> using
          <code>selectItems</code> and <code>selectFilter</code> as input selectors, then <code>selectSortedFilteredItems</code>
          using <code>selectFilteredItems</code> and <code>selectSortOrder</code>. Each selector acts as a memoization
          boundary in the graph. If any input selector returns the same reference as the previous call, the output
          selector is skipped entirely.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/state-management/selector-memoization.svg"
          alt="Selector Memoization Flow"
          caption="Memoized selector flow: input selectors are checked for referential equality. If unchanged, the cached result is returned immediately (green path). If changed, the output selector recomputes (orange path)."
        />

        <p>
          The memoization check is cheap—just reference comparisons on the input selector results. The expensive
          work (filtering, sorting, transforming) only runs when genuinely needed. This is why Reselect selectors
          scale well: even in stores with hundreds of state slices, a selector only recomputes when <em>its specific
          inputs</em> change, not when any state changes.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">When Recomputation Happens</h3>
          <ul className="space-y-2">
            <li><strong>useMemo:</strong> Recomputes when any value in the dependency array changes (by Object.is comparison).</li>
            <li><strong>Reselect:</strong> Recomputes when any input selector returns a different reference (by === comparison).</li>
            <li><strong>MobX computed:</strong> Recomputes when any accessed observable is mutated.</li>
            <li><strong>Recoil selector:</strong> Recomputes when any upstream atom or selector value changes.</li>
            <li><strong>Zustand selector:</strong> The selector runs on every store update; the component only re-renders if the selector{"'"}s return value differs (by the configured equality function).</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">useMemo</th>
              <th className="p-3 text-left">Reselect</th>
              <th className="p-3 text-left">MobX computed</th>
              <th className="p-3 text-left">Recoil selector</th>
              <th className="p-3 text-left">Manual</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Automatic Tracking</strong></td>
              <td className="p-3">No — manual deps array</td>
              <td className="p-3">No — explicit input selectors</td>
              <td className="p-3">Yes — proxy-based</td>
              <td className="p-3">Yes — atom graph</td>
              <td className="p-3">No</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Caching</strong></td>
              <td className="p-3">Single value, per component</td>
              <td className="p-3">Single value, shared across components</td>
              <td className="p-3">Single value, shared</td>
              <td className="p-3">Multi-value (parameterized)</td>
              <td className="p-3">None</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Composability</strong></td>
              <td className="p-3">Low — component-scoped</td>
              <td className="p-3">High — selectors compose</td>
              <td className="p-3">High — computed chains</td>
              <td className="p-3">High — selector graphs</td>
              <td className="p-3">Manual</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Async Support</strong></td>
              <td className="p-3">No</td>
              <td className="p-3">No (needs middleware)</td>
              <td className="p-3">Via reactions/flows</td>
              <td className="p-3">Yes — native</td>
              <td className="p-3">Manual</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Performance</strong></td>
              <td className="p-3">Good — skips recompute</td>
              <td className="p-3">Excellent — ref equality</td>
              <td className="p-3">Excellent — fine-grained</td>
              <td className="p-3">Good — graph-based</td>
              <td className="p-3">Poor — always recomputes</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>Follow these guidelines to implement derived state effectively:</p>
        <ol className="space-y-3">
          <li>
            <strong>Start Without Memoization:</strong> Compute derived values as plain variables in the render function.
            Only add useMemo or selectors when profiling reveals a performance problem. Premature memoization adds
            complexity without measurable benefit for cheap computations.
          </li>
          <li>
            <strong>Store Minimal Canonical State:</strong> Ask "can I compute this from existing state?" before adding
            any new state variable. A <code>fullName</code> derived from <code>firstName</code> and <code>lastName</code>
            should never be stored separately. An <code>isValid</code> flag derived from form fields should never be
            in useState.
          </li>
          <li>
            <strong>Use Reselect for Shared Derivations:</strong> When multiple components need the same derived value
            from a global store, use Reselect or equivalent memoized selectors. This ensures the computation runs once
            and the result is shared, rather than each component independently filtering/sorting the same data.
          </li>
          <li>
            <strong>Keep Selectors Pure:</strong> Selectors must be pure functions with no side effects. They should
            not dispatch actions, mutate state, or trigger API calls. A selector receives state and returns a value—
            nothing more.
          </li>
          <li>
            <strong>Compose Small Selectors:</strong> Build complex derivations by composing simple selectors. A
            <code>selectVisibleTodos</code> should use <code>selectTodos</code> and <code>selectFilter</code> as
            inputs, not reach directly into the raw state shape. This makes selectors resilient to state structure
            changes.
          </li>
          <li>
            <strong>Validate Dependency Arrays:</strong> Use the <code>react-hooks/exhaustive-deps</code> ESLint rule
            religiously. Missing dependencies cause stale closures. Extra dependencies cause unnecessary recomputations.
            Both are bugs.
          </li>
          <li>
            <strong>Use Shallow Equality for Object Returns:</strong> When a selector returns an object or array
            (especially in Zustand), use shallow equality comparison to prevent re-renders when the shape is the same
            but the reference is new.
          </li>
          <li>
            <strong>Profile Before Optimizing:</strong> Use React DevTools Profiler, the "why did this render" feature,
            and Chrome Performance tab to identify actual bottlenecks. Memoize the hot paths, not every derivation.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>These mistakes frequently appear in production codebases and interviews:</p>
        <ul className="space-y-3">
          <li>
            <strong>Storing Derived State in useState:</strong> The most common antipattern. Storing a filtered list
            in useState alongside the source list and filter creates two sources of truth. When state A changes, you
            must remember to update state B in a useEffect—introducing an extra render cycle, potential infinite loops,
            and guaranteed sync bugs. Derive it instead.
          </li>
          <li>
            <strong>Incorrect useMemo Dependencies:</strong> Omitting a dependency causes the memoized value to be
            stale. Including an unstable reference (an object or array created during render) causes useMemo to
            recompute every render, defeating the purpose entirely. Both scenarios are common and insidious.
          </li>
          <li>
            <strong>Selectors Returning New References:</strong> A selector like <code>state ={'&gt;'} ({'{'}
            items: state.items.filter(predicate) {'}'})</code> returns a new object on every call, even if the filtered
            array is identical. This triggers re-renders in every subscribed component. Use Reselect or shallow equality
            to prevent this.
          </li>
          <li>
            <strong>Over-Memoizing:</strong> Wrapping every computation in useMemo, even trivial ones like
            <code>firstName + {'"'} {'"'} + lastName</code>. The overhead of memoization (storing previous values,
            comparing dependencies) can exceed the cost of the computation itself. Memoize when the computation is
            O(n) or worse, not O(1).
          </li>
          <li>
            <strong>Synchronizing State with useEffect:</strong> Using <code>useEffect</code> to "sync" derived state
            is an antipattern documented by the React team. It causes double renders (one for the source change, one
            for the effect updating derived state), can create infinite loops, and is always replaceable by computing
            during render.
          </li>
          <li>
            <strong>Breaking Memoization with Inline Functions:</strong> Passing inline callbacks or objects as
            selector inputs or useMemo dependencies breaks memoization because a new reference is created each render.
            Extract these to stable references via useCallback or module-level constants.
          </li>
          <li>
            <strong>Ignoring Selector Composition:</strong> Writing a single monolithic selector that derives everything
            from raw state means the entire derivation re-runs when any input changes. Breaking it into composed
            selectors creates memoization boundaries that isolate recomputation to only the affected parts of the graph.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>Derived state is pervasive in production applications:</p>
        <ul className="space-y-3">
          <li>
            <strong>Filtered & Sorted Lists:</strong> E-commerce product grids, search results, and data tables.
            The canonical state is the full list plus filter/sort parameters. The displayed list is always derived.
            Libraries like TanStack Table make this explicit—columns, sorting, filtering, and pagination are all
            derived from the source data and configuration state.
          </li>
          <li>
            <strong>Computed Totals & Aggregates:</strong> Shopping cart totals (subtotal, tax, shipping, discount,
            grand total) are all derived from cart items. Dashboard KPIs (average response time, 95th percentile,
            error rate) are derived from metrics data. Never store a total alongside its components.
          </li>
          <li>
            <strong>Form Validity:</strong> Whether a form is valid, which fields have errors, and the error messages
            themselves are all derived from the current field values and validation rules. Libraries like React Hook
            Form and Zod compute validation state on every change rather than storing it separately.
          </li>
          <li>
            <strong>Permission & Access Control:</strong> A user{"'"}s effective permissions derived from their role,
            team membership, feature flags, and subscription tier. The <code>canEdit</code>, <code>canDelete</code>,
            and <code>canInvite</code> booleans are derived, not stored. This ensures permissions are always consistent
            with the underlying data.
          </li>
          <li>
            <strong>UI State Derivations:</strong> Whether a modal should be open (derived from URL parameters or
            selection state), whether a button should be disabled (derived from form validity and loading state),
            whether to show empty state vs. content (derived from data array length).
          </li>
        </ul>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">When NOT to Derive</h3>
          <p>Not every value should be derived. Store state independently when:</p>
          <ul className="mt-2 space-y-2">
            <li>
              • The value requires user intent (selection state, toggle state, input text)—these are
              <em> source</em> state, not derived.
            </li>
            <li>
              • The computation involves an async operation (API call)—use async selectors (Recoil) or
              separate fetching logic, not synchronous derivation.
            </li>
            <li>
              • The value needs to survive across unrelated state changes (undo/redo history snapshots
              must be stored, not derived from current state).
            </li>
            <li>
              • The "source" data is not available in the same state tree (data from different API
              endpoints or browser APIs like geolocation).
            </li>
          </ul>
        </div>
      </section>

      {/* Section 9: Common Interview Questions */}
      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is derived state, and why should you avoid storing it in useState?</p>
            <p className="mt-2 text-sm">
              A: Derived state is any value that can be computed from other existing state. Storing it in useState
              creates a second source of truth that must be kept in sync with the original state. This synchronization
              is typically done via useEffect, which introduces an extra render cycle (the component renders with stale
              derived state, then re-renders after the effect updates it). Worse, it creates a maintenance burden: every
              place that updates the source state must also update the derived state, or the two will diverge. The
              correct approach is to compute the value during render (as a const) or memoize it with useMemo if the
              computation is expensive. This guarantees the derived value is always consistent with its source.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does Reselect's memoization work, and when does a selector recompute?</p>
            <p className="mt-2 text-sm">
              A: Reselect's createSelector takes one or more input selectors and an output selector. On each call,
              it runs the input selectors and compares their return values to the previously cached values using strict
              referential equality (===). If all input selectors return the same references as the previous invocation,
              the output selector is skipped and the cached result is returned. If any input selector returns a different
              reference, the output selector runs with the new input values and its result is cached. This means Reselect
              recomputes only when the specific slice of state it depends on actually changes—not when any state changes.
              The key implication is that input selectors should return stable references; a selector that creates a new
              array or object on every call will defeat memoization.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you decide between computing during render, useMemo, and Reselect?</p>
            <p className="mt-2 text-sm">
              A: The decision follows a progression based on cost and scope. For cheap computations (boolean checks,
              string concatenation, filtering small arrays under ~100 items), compute as a plain variable during
              render—no memoization needed. For expensive computations (sorting thousands of items, complex
              transformations) within a single component, use useMemo with a correct dependency array. For derived
              values needed by multiple components from a global store (Redux, Zustand), use Reselect or equivalent
              memoized selectors—this ensures the computation runs once and the result is shared, and it provides
              referential stability that prevents downstream re-renders. MobX computed is preferred when using MobX
              because it handles dependency tracking automatically. The anti-pattern to avoid in all cases is storing
              the derived value in separate state and syncing it manually.
            </p>
          </div>
        </div>
      </section>

      {/* Section 10: References & Further Reading */}
      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://react.dev/learn/choosing-the-state-structure#avoid-redundant-state" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React Docs - Choosing the State Structure: Avoid Redundant State
            </a>
          </li>
          <li>
            <a href="https://react.dev/learn/you-might-not-need-an-effect#updating-state-based-on-props-or-state" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React Docs - You Might Not Need an Effect (Derived State Section)
            </a>
          </li>
          <li>
            <a href="https://github.com/reduxjs/reselect" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Reselect - Selector Library for Redux
            </a>
          </li>
          <li>
            <a href="https://mobx.js.org/computeds.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MobX Documentation - Computed Values
            </a>
          </li>
          <li>
            <a href="https://docs.pmnd.rs/zustand/guides/auto-generating-selectors" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Zustand - Auto Generating Selectors Guide
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
