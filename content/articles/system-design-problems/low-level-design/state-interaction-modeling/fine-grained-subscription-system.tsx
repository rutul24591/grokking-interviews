"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-fine-grained-subscription",
  title: "Fine-Grained Subscription System",
  description:
    "Selective state subscriptions allowing components to subscribe to specific state parts, minimizing re-renders and improving performance.",
  category: "low-level-design",
  subcategory: "state-interaction-modeling",
  slug: "fine-grained-subscription-system",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: ["lld", "subscriptions", "state-management", "performance", "reactivity"],
  relatedTopics: ["derived-state", "global-event-bus"],
};

export default function FineGrainedSubscriptionArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          A dashboard application has a single Redux store containing user profile, a list of 5000 items, filter state, and UI preferences. The header component needs only the user's display name. In a naive Redux setup with useSelector(state =&gt; state), the header re-renders whenever any part of the store changes — including when any of the 5000 items' statuses update. With 20 concurrent item status updates per second arriving over WebSocket, the header re-renders 20 times per second even though nothing it displays changed.
        </p>
        <p>
          Fine-grained subscriptions eliminate this by coupling each component to exactly the state paths it reads. The header subscribes to state.user.displayName only. Item status updates never flow to the header's subscription, so no re-render occurs. This is the foundational performance optimization for large React+Redux applications, and it's what useSelector with a narrowing selector function provides out of the box — but the underlying mechanism is non-obvious and has significant failure modes when implemented incorrectly.
        </p>
        <p>
          The problem deepens in signal-based reactive systems like Solid.js, MobX, or Vue 3's composition API, where fine-grained subscriptions are automatic rather than explicit. The system tracks which signals or observables a component's render function accessed, and re-renders only when those specific values change. Understanding how auto-tracking works — and when it breaks — is essential for diagnosing subtle reactivity bugs.
        </p>
        <p>
          <strong>Explicit assumptions:</strong> State is structured as a tree (not a flat key-value store). Components read specific subtrees, not the entire state. Changes are identified by reference equality on state tree nodes (immutable update pattern). The subscription system has access to both pre- and post-update state to determine what changed.
        </p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Subscription:</strong> Components specify which state they depend on, either via explicit selector functions, path strings, or automatic dependency tracking.
          </li>
          <li>
            <strong>Selective notification:</strong> When state updates, only components whose subscribed state actually changed (by the configured equality function) receive a re-render notification.
          </li>
          <li>
            <strong>Cleanup:</strong> Subscriptions are automatically removed when the subscribing component unmounts, preventing callbacks to stale components.
          </li>
          <li>
            <strong>Derived state integration:</strong> Fine-grained subscriptions should compose with memoized selector functions — a selector that returns a cached value should not trigger re-renders even if the broader state changes.
          </li>
          <li>
            <strong>Multiple subscriptions per component:</strong> A single component can subscribe to multiple independent state paths; it re-renders only when any one of its subscriptions notifies a change.
          </li>
          <li>
            <strong>Equality customization:</strong> Components can specify custom equality functions (shallowEqual, deepEqual, or domain-specific) to determine whether a subscription notification should trigger a re-render.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Notification latency:</strong> Time from state update to subscriber notification must be under 1ms for up to 10,000 active subscriptions.
          </li>
          <li>
            <strong>Memory:</strong> Subscription registry must release references when components unmount. WeakRef or explicit cleanup prevents memory leaks.
          </li>
          <li>
            <strong>Correctness:</strong> Zero false negatives (never miss a notification when a subscribed value changes) and minimal false positives (minimize unnecessary re-renders when subscribed values haven't semantically changed).
          </li>
          <li>
            <strong>Debuggability:</strong> Tooling must show which subscriptions exist per component and which subscriptions triggered a given re-render.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Selector that accidentally reads the entire state (no narrowing) — entire store changes trigger re-render, defeating fine-grained subscription.</li>
          <li>Component subscribes in a conditional branch that sometimes doesn't execute — subscription is not registered in some renders, causing missed updates (rules of hooks violation).</li>
          <li>Reducer returns new references for unchanged parts of state (reference instability) — subscription incorrectly fires for values that didn't semantically change.</li>
          <li>Two components share a subscription to the same derived value — should each have an independent cache entry, or should they share a memoization instance?</li>
          <li>Concurrent React rendering — the same component may render multiple times; subscription registration must be idempotent.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          There are two primary models for fine-grained subscriptions: the explicit selector model (React-Redux's useSelector) and the automatic dependency tracking model (MobX, Solid.js, Vue 3's watchEffect). In the explicit model, the developer passes a selector function to the hook; the hook calls the selector on every store update and compares the result to the previous result using the equality function. If different, re-render is scheduled. In the automatic model, the runtime wraps the component's render/computation function in a tracking context that intercepts property accesses on reactive objects, building a dependency set. On the next render, the framework re-tracks dependencies.
        </p>
        <p>
          For Redux-based architectures, the explicit model with Reselect selectors is the standard. For signal-based architectures (Jotai, Zustand with subscribeWithSelector, Solid.js), the automatic model is the primary primitive. Both converge on the same outcome: components re-render only when their specific observed values change.
        </p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/state-interaction-modeling/fine-grained-subscription-system.svg"
          alt="Fine-grained subscription system comparing coarse vs fine-grained reactivity, observable signal pattern, automatic dependency tracking, and Zustand selective subscriptions"
          caption="Fine-grained subscription system comparing coarse vs fine-grained reactivity, observable signal pattern, automatic dependency tracking, and Zustand selective subscriptions"
        />

        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">React-Redux useSelector: Explicit Fine-Grained Subscriptions</h3>
        <p>
          React-Redux's useSelector hook provides fine-grained subscriptions in the explicit model. The hook accepts a selector function and an optional equality function. Internally, it subscribes to the Redux store. On every store update (regardless of which slice changed), useSelector runs the selector function and compares the result to the previous result using the equality function. Only if they differ does it schedule a React re-render for the component.
        </p>
        <p>
          The narrowing quality of the selector directly determines the granularity of subscription. A selector that returns the full user object (state =&gt; state.user) re-renders when any property of the user object changes. A selector that returns only the display name (state =&gt; state.user.displayName) re-renders only when displayName changes by reference. Using shallowEqual as the equality function allows returning derived objects or arrays without re-rendering when their contents are unchanged: useSelector(state =&gt; selectActiveItems(state), shallowEqual).
        </p>
        <p>
          Multiple useSelector calls within a single component create multiple independent subscriptions. Each comparison runs independently on every store update. This is correct but not free — if a component has 10 useSelector calls and a high-frequency action updates every millisecond, all 10 selectors run every millisecond. Use memoized selectors (Reselect) for expensive transformations to minimize the work done in the selector on each store update, even if no re-render results.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Zustand subscribeWithSelector: Slice-Level Subscriptions</h3>
        <p>
          Zustand's middleware subscribeWithSelector enables fine-grained external subscriptions (outside React) to specific state slices. The API: store.subscribe(selector, listener, options). The selector extracts a value; the listener fires only when the selector's output changes by the specified equality. This is useful for non-React consumers (analytics, WebSocket handlers) that need to react to specific state changes without subscribing to the full store.
        </p>
        <p>
          Within React components, Zustand's useStore hook accepts a selector with the same semantics as useSelector. Components automatically only re-render when the selected slice changes. This is one of Zustand's design advantages over context-based state — context re-renders all consumers whenever the context value changes; Zustand's subscription model is inherently fine-grained.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Automatic Dependency Tracking (MobX / Solid.js)</h3>
        <p>
          In MobX, observable objects are Proxy-wrapped. When a component's render function accesses a property on an observable (mobxUser.displayName), the access is recorded in the currently active tracking context (the component's reaction). MobX stores a reverse mapping: observable property → set of reactions that accessed it. When displayName changes, only the reactions in that set are invalidated and re-run.
        </p>
        <p>
          This auto-tracking is highly ergonomic — no explicit selectors to define, no dependency arrays to maintain. But it has subtle failure modes. Accessing an observable outside a tracking context (in a useEffect dependency array, in a setTimeout callback, in a non-reactive function) does not register the dependency. The component will not re-render when that value changes. MobX debugger tooling helps identify "this property was accessed but no reaction tracked it" warnings.
        </p>
        <p>
          Solid.js takes this further with compiled signals — a build-time transform converts function calls into tracked accesses. Granularity is at the signal level, not the object level. A component that accesses user.displayName() only re-executes the specific JSX expression that called displayName() — not the entire component render function. This is finer-grained than React's component re-render model, though at the cost of being framework-specific.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Jotai Atoms: Atomic Fine-Grained Subscriptions</h3>
        <p>
          Jotai's model makes every atom an independently subscribable unit. A component that calls useAtom(displayNameAtom) subscribes only to changes in that atom. If the atom has not changed, the component does not re-render, regardless of what other atoms change. This is fine-grained subscription at the atom granularity — which is the most precise possible in an atom-based system.
        </p>
        <p>
          Derived atoms (atoms that read other atoms) automatically propagate changes: when a source atom changes, derived atoms that read it are recalculated. Components subscribed to the derived atom re-render if the derived value changed. Components subscribed to an unrelated atom are completely unaffected. This gives a natural fine-grained subscription graph with zero explicit selector configuration.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Reference Stability as a Prerequisite</h3>
        <p>
          Fine-grained subscriptions rely on reference equality to detect whether a subscribed value changed. If reducers or state updates return new object/array references for values that didn't change, every subscriber to those values gets notified regardless of whether the content changed. This is the single most common cause of excessive re-renders in Redux applications.
        </p>
        <p>
          The fix is Immer (or any structural-sharing update mechanism). Immer's produce function only creates new references for nodes in the state tree that were actually modified. Nodes that were not touched preserve their original references. A selector extracting an unmodified subtree will return the same reference before and after the action, and useSelector's equality check (reference equality by default) correctly determines no re-render is needed.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Subscription Graph for Normalized State</h3>
        <p>
          Applications with normalized entity state (entities indexed by ID in a flat dictionary) benefit from per-entity fine-grained subscriptions. Each entity has its own subscription scope: a component rendering post #42 subscribes to state.posts.entities['42'], not to the entire posts slice. When post #37 updates, post #42's subscriber is unaffected.
        </p>
        <p>
          This requires per-entity selector factories (one memoized selector instance per entity ID) or atom-per-entity patterns in Jotai. Redux Toolkit's createEntityAdapter generates by-ID selectors but does not automatically provide per-entity subscription — each component still needs to select by entity ID using a parameterized selector. The performance gain is that the selector's result (a single entity object) changes only when that entity's fields change, minimizing re-renders.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Batching Updates to Prevent Notification Storms</h3>
        <p>
          When 50 item statuses update simultaneously (a bulk server response), 50 individual store mutations would trigger 50 rounds of subscription notifications. Each round runs all subscribers' selectors and may schedule re-renders. React 18's automatic batching already batches setState calls within the same synchronous event handler, but for external subscription-based systems (Zustand, Jotai), batching is not automatic for async updates.
        </p>
        <p>
          Explicit batching: apply all 50 mutations in a single transaction before notifying subscribers. Zustand supports this with store.setState(multipleUpdates) applied as one operation. Redux with redux-batch middleware allows dispatching an array of actions and deferring subscription notifications until all are applied. After the batch, each subscriber runs its selector once against the final state, not 50 times against each intermediate state.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Debugging and Profiling Fine-Grained Subscriptions</h3>
        <p>
          React DevTools Profiler shows which components re-rendered and why (which state change triggered the render). For Redux, the DevTools panel shows which actions were dispatched and what changed in the store. The combination identifies: "CartItem component re-rendered 50 times in one second — caused by state.items updating — selector selectCartItem is not properly scoped to this item's ID."
        </p>
        <p>
          why-did-you-render (a React library) patches React.Component and hooks to log when a component re-renders due to unchanged props or state. It surfaces false-positive subscription notifications that originate from reference instability: "re-rendered because useSelector returned a new reference (same value)." This is the most common signal that selector granularity or state reference stability needs improvement.
        </p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Explicit Selectors vs Auto-Tracking</h3>
        <p>
          Explicit selectors (useSelector, Reselect) require more upfront work — every component must define its selectors and dependency inputs — but make the dependency graph visible in code and easy to audit in review. Auto-tracking (MobX, Solid) is more ergonomic but dependencies are implicit; a code change that accesses a new reactive property unintentionally may create an unintended subscription. For large teams with strict review processes, explicit selectors are safer. For smaller teams prioritizing developer experience, auto-tracking is compelling.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Granularity vs Complexity</h3>
        <p>
          Extremely fine-grained subscriptions (one atom per entity field) minimize false re-renders but increase the number of atoms/selectors to maintain. The boilerplate of defining individual atoms for every tracked field can exceed the benefit for infrequently-updated data. Start with component-level granularity (one selector per component), profile for re-render hotspots, and increase granularity only where profiling identifies actual performance impact.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Subscription Count and Notification Fan-Out</h3>
        <p>
          With 10,000 subscriptions active (a large list rendering 10k items, each with fine-grained subscriptions), a bulk state update that touches 1000 items triggers 1000 subscription comparisons. Even if comparisons are cheap (reference equality), 10,000 checks adds up. For extremely large lists, virtualization (rendering only visible items) reduces active subscriptions by 100-1000x, which is the more impactful optimization than subscription granularity.
        </p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>
          Fine-grained subscriptions are the foundation of performant large-scale React state management. The design principle is simple: couple each component to exactly the state it reads, not to a superset. In practice this requires: narrowing selectors in useSelector, memoized selector results with Reselect, reference stability from Immer-based reducers, per-entity selector factories for normalized state, and batching for bulk updates. Auto-tracking systems (MobX, Solid.js, Jotai atoms) provide this as a first-class primitive with less boilerplate. For staff-level engineers, the key architecture decisions are: ensure reference stability at the reducer level before optimizing selectors (reference instability defeats all fine-grained subscription work); use per-entity selectors for entity lists (this alone can reduce re-renders by 10x in data-heavy dashboards); batch bulk server responses before notifying subscribers; and profile with React DevTools Profiler and why-did-you-render to identify actual re-render hotspots before optimizing prematurely.
        </p>
      </section>
    </ArticleLayout>
  );
}
