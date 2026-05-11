"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-derived-state",
  title: "Derived State System",
  description:
    "Computing derived/computed state from base state efficiently with memoization, selective updates, and performance optimization.",
  category: "low-level-design",
  subcategory: "state-interaction-modeling",
  slug: "derived-state",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: ["lld", "derived-state", "memoization", "selectors", "performance"],
  relatedTopics: ["fine-grained-subscription-system", "async-state-handling"],
};

export default function DerivedStateArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">
          An e-commerce cart holds an array of line items: each with a productId, quantity, and unit price. The UI needs to display subtotal, discount amount (based on a coupon code), tax, and total. These are not stored — they are computed from the cart items and rate configuration. Every time any of these inputs changes, the displayed values must update instantly. The naive approach is to compute them inline in the React render function. This works until the cart has 200 items and the coupon lookup traverses a promotions catalog. Now every unrelated state change (hover state, tooltip open) triggers a full recomputation.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          Derived state is any value that can be deterministically computed from other state — it has no independent identity of its own. The design challenge is: how do we compute derived values efficiently, caching results across renders, and invalidating the cache only when the specific inputs the derivation depends on actually change? This is the selector problem, and it has nuanced failure modes at scale.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The problem compounds with depth: derived state can itself be used as input to further derivations (a selector DAG). A cart item's discounted price depends on the unit price and the applicable promotion. The subtotal depends on all items' discounted prices. The total depends on subtotal, tax rate, and shipping. Changes to a single item's quantity should invalidate only that item's discounted price and propagate up the DAG — not cause a full recomputation of every intermediate node.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Explicit assumptions:</strong> Derived computations are pure functions (no side effects, no network calls). Dependencies are statically known or can be tracked automatically. Inputs are immutable values (standard in Redux, Zustand with structural sharing). The cache is per-selector-instance (not global), so components rendering the same selector with different arguments each get their own cache entry.
        </HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Compute:</strong> Derive output values from base state using pure transformation functions.
          </li>
          <HighlightBlock as="li" tier="crucial">
            <strong>Memoize:</strong> Cache the most recent result; return cached value if inputs are identical to the last call.
          </HighlightBlock>
          <li>
            <strong>Dependency granularity:</strong> Only track the specific state slices a derivation reads, so changes to unrelated slices do not trigger recomputation.
          </li>
          <li>
            <strong>Composition:</strong> Derived selectors can reference other derived selectors as inputs, forming a computation graph.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Parameterization:</strong> Selectors can accept arguments (e.g., "posts by user ID") without defeating memoization — each argument combination caches independently.
          </HighlightBlock>
          <li>
            <strong>Structural sharing:</strong> When a selector returns a new array/object that is deeply equal to its previous result, it should return the previous reference to prevent downstream re-renders.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Performance:</strong> Cache hit path must be O(n) where n is the number of input selector outputs to compare — typically constant or small.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Memory:</strong> Per-selector cache holds exactly one entry (last input→output pair) by default. Parameterized selectors need LRU caching with a configurable size.
          </HighlightBlock>
          <li>
            <strong>Correctness:</strong> The cached value must be exactly equal to a freshly computed value for the same inputs. No stale reads.
          </li>
          <li>
            <strong>Debuggability:</strong> Recomputations should be traceable — tooling should show how often each selector recomputes and what caused the recomputation.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Selector receives structurally identical but reference-different input (e.g., a new empty array [] from a reducer — should this invalidate?). Reference equality would recompute; structural equality would not.</li>
          <li>Circular dependencies: Selector A depends on Selector B which depends on Selector A. Must be detected at construction time.</li>
          <HighlightBlock as="li" tier="important">Very large outputs (e.g., a sorted list of 100k items) — memoization cost is the deep-equality check on the output for structural sharing, which is O(n) and may exceed the computation itself.</HighlightBlock>
          <li>Selector factory called inside a component render — creates a new memoized instance each render, defeating caching entirely.</li>
          <li>Time-dependent derivations (e.g., "items expiring in the next hour") — the same input produces different outputs over time, requiring explicit invalidation by real-time clock ticks.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="important">The selector pattern separates state access from computation. An input selector extracts a specific sub-tree from the store (fast, no transformation). A result function combines the outputs of one or more input selectors into the derived value.</HighlightBlock>
<HighlightBlock as="p" tier="important">The memoization layer compares the input selector outputs using reference equality. If none changed, the cached result is returned. Only if at least one changed is the result function invoked and the new output cached.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          This is the Reselect model, which has been the de facto standard for Redux selector memoization since 2016. Redux Toolkit ships Reselect's createSelector and adds createEntityAdapter which generates pre-built selectors for normalized entity collections. For Jotai and other atomic state systems, atoms are inherently composable, making derived atoms the natural primitive instead of imperative selectors.
        </HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/state-interaction-modeling/derived-state.svg"
          alt="Derived state system showing source state vs computed derived state, memoization strategies with useMemo and reselect, dependency graph, and common mistakes"
          caption="Derived state system showing source state vs computed derived state, memoization strategies with useMemo and reselect, dependency graph, and common mistakes"
        />

        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Selector Functions and the Input/Result Split</h3>
        <p>
          The canonical Reselect selector is constructed with an array of input selectors and a result function. Each input selector receives the entire state and extracts a specific sub-tree. Input selectors should be trivially fast — they are called on every invocation, memoized or not, to compare against the previous call. The result function is only called when at least one input selector output changed by reference.
        </p>
        <p>
          This structure provides automatic dependency tracking: the input selectors define precisely what the derivation depends on. If you add a new dependency, you add a new input selector — you cannot accidentally depend on state you didn't declare. This is intentional compared to Proxy-based auto-tracking (used in MobX, Valtio) which infers dependencies at runtime. Explicit declaration is safer in TypeScript projects and easier to reason about in code review.
        </p>
        <HighlightBlock as="p" tier="crucial">
          Composition is recursive: a selector's result function can call another memoized selector. The inner selector's cache layer is hit first; if it returns the same reference as before, the outer selector's input hasn't changed and the outer cache is also preserved. This chain propagation is what makes deep selector DAGs efficient — a change to a leaf input only propagates up the DAG to selectors that directly or transitively depend on that leaf.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Equality Semantics: Reference vs Structural</h3>
        <p>
          The default comparison in Reselect is strict reference equality (===). This is intentional and relies on immutable state updates: when a Redux reducer returns a new state object only for the changed slice, unaffected slices share the same reference as before. Input selectors extracting unaffected slices return the same reference, and the selector reuses the cached result even though a technically "new" state object was passed.
        </p>
        <p>
          This breaks down when reducers accidentally create new references for unchanged data — for example, mapping over an array to add a property to one item, but returning a new array with all elements having new object references even for unchanged items. Immer (used in Redux Toolkit) prevents this by using structural sharing — unchanged nodes in the state tree keep their original references.
        </p>
        <p>
          Structural equality comparison (deep equal) for selector inputs is almost always the wrong solution: it trades one performance problem (unnecessary recomputation) for a different one (expensive deep comparison on every call). The correct approach is to fix the upstream reducer to preserve references for unchanged data, not to use deep equality in selectors.
        </p>
        <p>
          For selector outputs, structural sharing of results (using shallowEqual to check if the new output is equivalent to the previous) can prevent downstream React re-renders even when the selector had to recompute. React-Redux's useSelector accepts a custom equality function for this purpose: passing shallowEqual causes the component to skip re-rendering if the new selector output is shallowly equal to the previous.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Parameterized Selectors and Per-Instance Memoization</h3>
        <HighlightBlock as="p" tier="important">
          A common pattern is selecting a specific entity by ID: selectPostById(state, postId). If the selector is a single shared instance with one cache entry, any call with a different postId invalidates the cache for all components using the selector — defeating memoization entirely.
        </HighlightBlock>
        <p>
          The solution is selector factories: a function that creates a new memoized selector instance. Each component that needs a per-ID selector creates its own instance, typically in useMemo or in the component's class property. The factory pattern ensures each component gets an independent cache entry keyed to the ID it uses.
        </p>
        <HighlightBlock as="p" tier="important">
          Reselect 5 and Redux Toolkit's createSelector with memoize option support configurable cache sizes. The weakMapMemoize option uses a WeakMap keyed on the argument reference, providing unlimited-size caching for object-argument selectors without explicit instance creation. For primitive arguments (string IDs), a bounded LRU cache of configurable size (default 1 in classic Reselect) is the right primitive.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Derived Atoms in Jotai and Recoil</h3>
        <p>
          Atomic state libraries (Jotai, Recoil) invert the dependency model. Instead of selectors that explicitly declare input selectors, derived atoms read from other atoms using the get function inside the atom definition. The library's runtime tracks which atoms were read during derivation and subscribes to them automatically — this is auto-tracking.
        </p>
        <p>
          In Jotai, a derived atom is an atom whose read function can read other atoms via a get parameter. Conceptually, you define an atom whose value is computed from itemsAtom by selecting only the active items. The derived atom automatically recomputes when its dependencies change and not otherwise. Because atoms are independently subscribable, components using the derived atom only re-render when the derived value changes, rather than re-rendering on every upstream update that does not affect the derived output.
        </p>
        <p>
          Async derived atoms are also first-class: a derived atom can be async, suspending its subscribers while the computation resolves. This makes derived atoms suitable for derived state that requires async enrichment (e.g., fetching additional data for the selected entities).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">useMemo and useCallback for Local Derived State</h3>
        <p>
          For component-local derived state that doesn't need to be shared across the tree, React's useMemo hook is the appropriate tool. useMemo accepts a factory function and a dependency array; it recomputes only when one of the dependencies changes by reference. It follows the same reference-equality semantics as Reselect selectors.
        </p>
        <HighlightBlock as="p" tier="important">
          useMemo is often overused. React's documentation explicitly states it is a performance optimization, not a semantic guarantee — React may discard cached values in low-memory situations. For truly critical memoization (preventing expensive recomputation, not just render optimization), Reselect or a custom memoization utility outside the React lifecycle is more reliable.
        </HighlightBlock>
        <p>
          A common mistake is putting object literals or array literals in a useMemo dependency array — these are always new references on each render, which means the useMemo always recomputes. The inputs to useMemo should be primitive values or stable references (state values from the store, refs, or other memoized values).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Normalized State and Entity Adapters</h3>
        <p>
          Deeply nested state structures make derived state expensive: selecting all posts for a user requires traversing a nested object tree. Normalization (storing entities in a flat lookup dictionary keyed by ID) makes these derivations cheaper and enables more granular cache invalidation.
        </p>
        <p>
          Redux Toolkit's createEntityAdapter generates standard CRUD selectors (selectAll, selectById, selectIds) over normalized entity slices. These selectors are pre-memoized and composable. The adapter pattern is the right foundation for any large entity collection — do not store arrays of objects when you have frequent by-ID lookups or per-entity updates.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Time-Dependent and Impure Derived State</h3>
        <p>
          Some derivations depend on external non-state inputs: the current time ("messages sent in the last hour"), screen dimensions, or locale. These cannot be memoized against state alone because they change even when state is unchanged. The correct pattern is to include the time-tick or external input as a state slice that is updated on a controlled interval, making it a proper state dependency for the selector.
        </p>
        <p>
          A clock atom updated every minute by a setInterval effect makes time-dependent selectors correct: they recompute every minute (when the clock atom changes), not on every render. This is preferable to Date.now() calls inside result functions, which would recompute whenever the selector's other inputs change regardless of whether the time-dependent logic needs updating.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Monitoring and Performance Profiling</h3>
        <p>
          Add instrumentation to selectors in development mode: count recomputations, measure result function duration, and record cache hit rate. A selector with a 20% cache hit rate on a hot code path is a warning sign — investigate whether input selectors are returning new references unnecessarily.
        </p>
        <HighlightBlock as="p" tier="important">
          Redux DevTools provides a selector recomputations counter that shows how many times each selector's result function was called. Reselect exposes recomputations() and resetRecomputations() on each selector for this purpose. In production, emit a sampling of selector recomputation counts to your metrics system to detect regressions after state schema changes.
        </HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Explicit vs Automatic Dependency Tracking</h3>
        <HighlightBlock as="p" tier="important">
          Reselect's explicit input selectors are verbose but predictable — the dependency graph is visible in code and easy to audit. Auto-tracking (MobX, Jotai) is more ergonomic but introduces risk of unintentional dependencies (reading a property you didn't intend to depend on triggers unnecessary recomputation). For large teams or complex domains, explicit is safer. For rapid prototyping or simpler apps, auto-tracking reduces boilerplate significantly.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Single vs Multi-Entry Cache</h3>
        <HighlightBlock as="p" tier="crucial">
          Classic Reselect's 1-entry cache is sufficient when a selector is used by at most one component at a time with a consistent argument. Multi-entry caching (LRU or WeakMap) is needed for lists of entities where many components simultaneously use the same selector factory with different IDs. The cost is higher memory usage and more complex cache management. Start with 1-entry, profile before increasing.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Complexity of Derived Atom Graphs</h3>
        <HighlightBlock as="p" tier="important">
          Very deep derivation graphs (8+ levels) become hard to debug: a state change in a leaf node triggers a cascade of recomputations up the graph, and tracing which derived atoms were affected requires understanding the full graph topology. Periodic audits of the atom/selector dependency graph help identify unexpectedly long chains that could be simplified by materializing intermediate results as proper state.
        </HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">Atomic libraries like Jotai offer auto-tracking as an ergonomic alternative to explicit input selectors. For staff-level engineers, the critical insights are: normalize</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">entity state to enable granular cache invalidation; fix reference instability at the reducer level rather than using deep equality in selectors; profile selector recomputation rates in production; and treat time-dependent derived state by including external inputs as first-class state atoms rather than reading external state inside result functions.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
