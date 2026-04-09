"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-custom-state-manager",
  title: "Design a Custom State Manager Without Redux",
  description:
    "Build a production-grade custom state manager from scratch — observable pattern, middleware support, batching, DevTools integration, and selective subscriptions.",
  category: "low-level-design",
  subcategory: "state-management-data-architecture",
  slug: "custom-state-manager-design",
  wordCount: 3400,
  readingTime: 20,
  lastUpdated: "2026-04-08",
  tags: [
    "lld",
    "state-manager",
    "custom-store",
    "observable",
    "middleware",
    "batching",
    "devtools",
    "architecture",
  ],
  relatedTopics: [
    "scalable-global-state-architecture",
    "component-subscription-management",
    "derived-computed-state-performance",
  ],
};

export default function CustomStateManagerDesignArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Problem Clarification */}
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a custom state management library from scratch — no Redux,
          no Zustand, no external dependencies. The state manager must support
          observable state changes, selective subscriptions (components subscribe
          only to the slices they need), middleware for cross-cutting concerns
          (logging, persistence, validation), action batching for performance,
          and DevTools integration for debugging. This is a common LLD interview
          question that tests understanding of reactive programming, design patterns,
          and performance optimization.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>React 19+ SPA with concurrent rendering.</li>
          <li>Target bundle size: under 3KB (gzip) — must be lighter than Zustand (~2KB) and Redux (~7KB).</li>
          <li>Must support TypeScript with full type inference for state shape and actions.</li>
          <li>Performance requirement: 1000+ state updates per second without blocking the main thread.</li>
          <li>Must work with React&apos;s concurrent features (startTransition, useDeferredValue).</li>
          <li>DevTools integration with Redux DevTools protocol for time-travel debugging.</li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Store Creation:</strong> Factory function createMyStore(initialState) returns a store instance with getState, setState, subscribe, and dispatch methods.</li>
          <li><strong>Selective Subscriptions:</strong> subscribe(selector, listener) — listener is called only when the selected slice changes (Object.is comparison).</li>
          <li><strong>Middleware Support:</strong> Middleware pipeline: middleware functions wrap setState, enabling logging, validation, persistence, and side effects.</li>
          <li><strong>Action Batching:</strong> batch(function with multiple setState calls) groups multiple updates into a single notification cycle, preventing intermediate re-renders.</li>
          <li><strong>DevTools Integration:</strong> Store connects to Redux DevTools, sends action logs, supports time-travel (dispatching past states).</li>
          <li><strong>TypeScript Inference:</strong> State shape is inferred from initialState. Selectors and setState are fully typed without manual generics.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Performance:</strong> State updates are synchronous and O(1) for single-field updates. Subscriber notification is O(k) where k is the number of matching subscribers.</li>
          <li><strong>Bundle Size:</strong> Core library under 3KB gzip. Each middleware adds 0.5-1KB.</li>
          <li><strong>Tree-Shakable:</strong> Unused features (DevTools, batching) are tree-shaken to zero bytes in production builds.</li>
          <li><strong>SSR-Safe:</strong> No browser APIs in core module. DevTools middleware is development-only and excluded from server bundles.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Subscriber throws an error during notification — must not block other subscribers or corrupt state.</li>
          <li>setState called during setState (nested updates) — must prevent infinite loops while allowing legitimate cascading updates.</li>
          <li>Middleware calls setState recursively — must detect and break circular middleware chains.</li>
          <li>Time-travel from DevTools dispatches a stale state — must notify all subscribers with the restored state.</li>
          <li>Batch is called inside another batch — must flatten into a single batch rather than nesting.</li>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h2>High-Level Approach</h2>
        <p>
          The custom state manager uses the <strong>Observer pattern</strong> with
          a selector-based subscription model. The store maintains an array of
          subscriptions, each containing a selector function and a listener callback.
          When setState is called, the new state is passed through the middleware
          pipeline (if any), then the store state is updated, and each subscription&apos;s
          selector is evaluated. If the selector result changed (Object.is), the
          listener is called with the new value. React integration is provided via
          a custom hook useMyStore(store, selector) that subscribes to the store
          and triggers re-renders when the selected slice changes.
        </p>
        <p>
          <strong>Alternative approaches:</strong>
        </p>
        <ul className="space-y-2">
          <li><strong>Proxy-based reactivity (MobX-style):</strong> Use JavaScript Proxies to track property access and automatically notify subscribers. Pros: automatic dependency tracking, no manual selectors. Cons: Proxy adds ~5KB to bundle, harder to debug (implicit subscriptions), not compatible with React&apos;s memo without extra work. Interviewers appreciate the knowledge but flag Proxy as over-engineering for this use case.</li>
          <li><strong>Pub/Sub with manual event names:</strong> Store exposes emit(event, data) and on(event, handler). Pros: simple, flexible. Cons: no automatic state change detection, subscribers must manually call store.getState() and diff, error-prone event naming, no selector-based filtering. Too low-level for a general-purpose state manager.</li>
          <li><strong>Redux-style reducer:</strong> Single dispatch(action) method, reducer computes new state. Pros: predictable state transitions, easy to test, time-travel is trivial. Cons: requires action types and reducers (boilerplate), every dispatch runs the entire reducer (even for unrelated state slices), no built-in selective subscriptions. Good for strict state management but heavier than needed.</li>
        </ul>
        <p>
          <strong>Why Observer + setState is optimal:</strong> The setState API
          is intuitive (matches React&aposs useState), selector-based subscriptions
          provide granular control without Proxy overhead, and the middleware pipeline
          enables cross-cutting concerns without coupling. The implementation is
          ~150 lines of code for the core, well under the 3KB budget. TypeScript
          inference is achieved via generics on the factory function — no manual
          type annotations needed.
        </p>
      </section>

      {/* Section 4: System Design */}
      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of seven modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Store Core (<code>lib/store-core.ts</code>)</h4>
          <p>The createStore factory function. Accepts initial state, returns store with getState, setState, subscribe, and unsubscribe. Maintains subscription list and notifies listeners on state changes. Core is 80 lines, no dependencies.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Subscription Manager (<code>lib/subscription-manager.ts</code>)</h4>
          <p>Manages the subscription registry: add(selector, listener), remove(subscriptionId), notify(newState). Each subscription has a cached selector result for Object.is comparison. Notify iterates through subscriptions, evaluates selectors, and calls changed listeners.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Middleware Pipeline (<code>lib/middleware.ts</code>)</h4>
          <p>Middleware is a function (next) =&gt; (state, payload) =&gt; newState. Middleware wraps setState via function composition. Built-in middlewares: logger (logs before/after state), validator (rejects invalid state), persister (saves to storage).</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Batch Manager (<code>lib/batch-manager.ts</code>)</h4>
          <p>Manages batched updates. When batch(fn) is called, setState calls are queued instead of notifying immediately. After fn completes, all queued state updates are merged (last-write-wins for overlapping fields), state is updated once, and subscribers are notified once.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. React Integration Hook (<code>hooks/useMyStore.ts</code>)</h4>
          <p>Custom hook: useMyStore(store, selector). Subscribes to the store with the selector, stores current value in a ref, triggers re-render via useState setter when selector result changes. Unsubscribes on unmount. Uses useSyncExternalStore for React 18+ compatibility.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. DevTools Adapter (<code>lib/devtools-adapter.ts</code>)</h4>
          <p>Connects store to Redux DevTools via window.__REDUX_DEVTOOLS_EXTENSION__. Sends init event with state, sends action events with before/after state, listens to DevTools dispatch (time-travel), and restores state on command. Development-only module.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">7. Error Boundary (<code>lib/error-boundary.ts</code>)</h4>
          <p>Wraps subscriber notifications in try/catch. If a listener throws, the error is caught, logged, and notification continues to remaining subscribers. Prevents one buggy subscriber from blocking all others. In development, errors include the subscriber function source for debugging.</p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Management Architecture</h3>
        <p>
          The store is an observable state container. State updates flow through
          the middleware pipeline (if configured), then the state is replaced, and
          subscriptions are evaluated. Each subscription&apos;s selector is called
          with the new state, compared to the cached result via Object.is, and the
          listener is called if different. React components use the useMyStore hook
          which subscribes and triggers re-renders on changes. The DevTools adapter
          intercepts setState calls to log actions and intercepts DevTools dispatch
          calls to restore historical states.
        </p>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/custom-state-manager-design-architecture.svg"
          alt="Custom state manager architecture showing store core, middleware pipeline, subscription manager, and React integration"
          caption="Custom State Manager Architecture"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>Application calls createStore(initialState), which returns a store with getState, setState, subscribe, and a unique store ID.</li>
          <li>React component calls useMyStore(store, selector). The hook subscribes to the store with the selector function.</li>
          <li>User interaction triggers a setState call: store.setState(partialState).</li>
          <li>setState passes through the middleware pipeline: logger logs the change, validator validates, persister queues a save.</li>
          <li>Store state is updated by merging the partial state into current state.</li>
          <li>Subscription manager iterates through all subscriptions, evaluates each selector against the new state.</li>
          <li>For subscriptions where selector result changed (Object.is), the listener is called. React hook listeners trigger a re-render.</li>
          <li>DevTools adapter logs the action with before/after state. If DevTools dispatches a time-travel action, state is restored and all subscribers are notified.</li>
        </ol>
      </section>

      {/* Section 5: Data Flow */}
      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          Data flow is synchronous and unidirectional: setState → middleware →
          state update → subscription evaluation → listener notifications. No async
          operations occur in the core path — middleware that needs async (e.g.,
          persistence) queues work separately and does not block the state update.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li><strong>Subscriber throws during notification:</strong> The error boundary wraps each listener call. If listener A throws, the error is caught and logged, then listener B, C, D are still notified. In development, the error includes the listener&apos;s call stack for debugging. The store state is not rolled back — the state update already happened before notifications.</li>
          <li><strong>Nested setState calls:</strong> If a subscriber calls setState during its notification handler, the store detects this via an isNotifying flag. The nested setState is queued and executed after the current notification cycle completes. This prevents infinite loops (subscriber A triggers setState, which notifies A again) while allowing legitimate cascading updates.</li>
          <li><strong>Middleware circular calls:</strong> If middleware A calls setState, which runs middleware A again, the middleware stack tracks a call depth counter. If depth exceeds 10, a circular dependency error is thrown with the middleware chain trace. This prevents infinite middleware loops.</li>
          <li><strong>Batch inside batch:</strong> The batch manager uses a counter (batchDepth). When batch() is called, counter increments. If another batch() is called inside, counter increments again. Only when counter returns to zero are the queued updates flushed. This flattens nested batches into a single notification cycle.</li>
          <li><strong>DevTools time-travel with stale state:</strong> When DevTools dispatches a historical state, the store replaces current state and notifies all subscribers with the restored state. Subscribers that depend on external data (API responses) may show stale information. The store emits a &apos;@mystore/TIME_TRAVEL&apos; action so subscribers can react (e.g., refetch data).</li>
        </ul>
      </section>

      {/* Section 6: Implementation */}
      <section>
        <h2>Implementation</h2>
        <p>
          The full production implementation is available in the <strong>Example tab</strong>.
          Below is a high-level overview of each module.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">📦 Switch to the Example Tab</h3>
          <p>
            Complete production-ready implementation includes:
            createStore factory with Observable pattern, middleware
            pipeline with 3 built-in middlewares, batch manager,
            React hook with useSyncExternalStore, DevTools adapter,
            and error boundary for subscriber isolation.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Store Core</h3>
        <p>
          createStore&lt;T&gt;(initialState: T) returns a store object with four
          methods. getState() returns the current state (readonly reference).
          setState(partial: Partial&lt;T&gt;) merges partial into current state.
          subscribe(selector, listener) registers a subscription and returns an
          unsubscribe function. The core is 80 lines — a simple state variable,
          a subscription array, and a notify loop that calls each selector and
          compares results with Object.is.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Subscription Manager</h3>
        <p>
          Manages the subscription registry. Each subscription has a unique ID,
          a selector function, a listener callback, and a cachedResult. On notify,
          the manager iterates through subscriptions, calls each selector with the
          new state, compares to cachedResult via Object.is, updates cachedResult
          if changed, and calls the listener. Unsubscribe removes the subscription
          from the registry and clears its cached result.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Middleware Pipeline</h3>
        <p>
          Middleware functions have the signature: (next) =&gt; (state, payload) =&gt;
          newState. The createStore accepts an array of middlewares. During
          initialization, middlewares are composed via function composition:
          middleware3(middleware2(middleware1(setState))). Each middleware can
          inspect state and payload before calling next, and inspect the result
          after next returns. Built-in middlewares: logger (console.log before/after),
          validator (Zod schema check), persister (queue localStorage save).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: Batch Manager</h3>
        <p>
          The batch(fn) function sets a flag, executes fn (which may call setState
          multiple times), collects all partial state updates into a queue, and
          after fn completes, merges the queue into a single update (last-write-wins
          for overlapping keys), applies the merged update, and notifies subscribers
          once. Nested batches increment a counter — only the outermost batch flushes.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: React Integration Hook</h3>
        <p>
          useMyStore(store, selector) uses React&apos;s useSyncExternalStore for
          concurrent-safe subscriptions. The hook subscribes to the store with the
          selector, stores the current value in a ref for Object.is comparison, and
          returns the selected value. On subscription notification, if the value
          changed, the hook updates its internal state, triggering a re-render.
          Unsubscribe happens on component unmount.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6: DevTools Adapter</h3>
        <p>
          Wraps window.__REDUX_DEVTOOLS_EXTENSION__.connect() with the store name
          and initial state. On createStore, it sends an init event. On each setState,
          it sends an action with the action type, before state, and after state.
          It listens to the DevTools dispatch channel — when a LIFT_ACTION action
          arrives (time-travel), it extracts the target state, calls store.setState
          with it, and the store notifies all subscribers. Development-only module.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 7: Error Boundary</h3>
        <p>
          Wraps each subscriber notification in a try/catch block. On error, it
          logs the error with the subscriber function name, the selector result,
          and the current state. In development, it captures the call stack and
          provides a link to the subscriber source location. The error is not
          re-thrown — other subscribers continue receiving notifications.
        </p>
      </section>

      {/* Section 7: Performance & Scalability */}
      <section>
        <h2>Performance &amp; Scalability</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Time and Space Complexity</h3>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Operation</th>
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Space</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">setState (single field)</td>
                <td className="p-2">O(1) — shallow merge</td>
                <td className="p-2">O(1) — new state object</td>
              </tr>
              <tr>
                <td className="p-2">Subscription notify (k subscribers)</td>
                <td className="p-2">O(k) — evaluate k selectors</td>
                <td className="p-2">O(k) — cached results</td>
              </tr>
              <tr>
                <td className="p-2">Middleware pipeline (m middlewares)</td>
                <td className="p-2">O(m) — compose m functions</td>
                <td className="p-2">O(m) — closure chain</td>
              </tr>
              <tr>
                <td className="p-2">Batch merge (n updates)</td>
                <td className="p-2">O(n) — merge n partials</td>
                <td className="p-2">O(n) — update queue</td>
              </tr>
              <tr>
                <td className="p-2">DevTools time-travel</td>
                <td className="p-2">O(1) — state replacement</td>
                <td className="p-2">O(s) — s = state snapshot size</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li><strong>Selector evaluation at scale:</strong> With 500 subscribers and a setState that changes one field, all 500 selectors are evaluated. If selectors are expensive (deep object traversal), this adds up. Mitigation: selectors should be shallow property accesses (state.user.name, not findDeep(state, &apos;name&apos;)). Cache selector results at the component level with useMemo.</li>
          <li><strong>Object.is comparison for complex objects:</strong> If a selector returns a new object/array on every call, Object.is always returns false, triggering unnecessary listener calls. Mitigation: selectors must return stable references. Return state.user directly (stable if not mutated), not a new object wrapping state.user.</li>
          <li><strong>Middleware composition depth:</strong> With 10+ middlewares, the composition chain adds overhead to every setState. Mitigation: keep middlewares lean — logger should only log in development, validator should short-circuit on valid input, persister should debounce writes. Production middleware count should be 2-3 max.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li><strong>Selector memoization at subscription time:</strong> Cache the selector result within each subscription. On notify, call the selector once, compare to cache with Object.is, update cache if changed. This ensures each selector is called exactly once per state change, regardless of subscriber count.</li>
          <li><strong>Lazy subscriber notification:</strong> If a batch update only changes fields that no subscriber cares about, skip notification entirely. Track which state fields each subscriber depends on (by analyzing selector function source or using a Proxy during selector evaluation), and only notify subscribers whose dependencies changed.</li>
          <li><strong>Structural sharing for state updates:</strong> Use a structural sharing library like Immer to create immutable updates that share unchanged references. This makes Object.is comparisons more effective — unchanged slices return the same reference, preventing unnecessary re-renders.</li>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Validation</h3>
        <p>
          The validator middleware ensures all state updates conform to a predefined
          schema (Zod). Invalid updates are rejected with a descriptive error before
          reaching the store. This prevents malformed data from corrupting the
          application state. The schema is defined at store creation time and cannot
          be bypassed without removing the middleware.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Immutability</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Preventing State Mutation</h4>
          <p>
            getState() returns a readonly reference to the current state. In
            development, the store freezes the state object with Object.freeze()
            to catch accidental mutations at runtime. In production, Object.freeze
            is skipped for performance. Engineers must treat state as immutable —
            setState always receives a partial object that is merged, never a
            direct mutation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">DevTools State Exposure</h4>
          <p>
            Redux DevTools has access to the full state tree. In production, the
            DevTools adapter is tree-shaken to zero bytes — no state is exposed
            to browser extensions. In development, sensitive state fields (tokens,
            PII) should be masked before sending to DevTools using a transform
            middleware that redacts sensitive keys.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Abuse Prevention</h3>
        <ul className="space-y-2">
          <li><strong>Nested update depth limit:</strong> The store tracks nested setState call depth. If depth exceeds 10, a circular update error is thrown. This prevents infinite loops from buggy subscribers that trigger setState in their notification handler.</li>
          <li><strong>Middleware execution timeout:</strong> In development, middleware execution is wrapped in a timeout. If a middleware takes more than 100ms, a warning is logged with the middleware name. This catches middleware that accidentally performs synchronous blocking work (e.g., large JSON.stringify on main thread).</li>
          <li><strong>Subscriber rate limiting:</strong> If a single subscriber&apos;s listener is called more than 100 times per second (due to a selector that always returns a new reference), a development warning is logged suggesting selector memoization. This prevents re-render storms from poorly-written selectors.</li>
        </ul>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li><strong>Store core:</strong> Test getState returns current state, setState merges correctly, subscribe returns unsubscribe function, unsubscribe stops notifications. Test shallow merge (nested objects are replaced, not deep-merged).</li>
          <li><strong>Subscription manager:</strong> Test selector evaluation, Object.is comparison, listener called only when selector result changes, listener not called when unrelated state changes. Test multiple subscribers with different selectors.</li>
          <li><strong>Middleware:</strong> Test middleware composition order (first middleware runs first), middleware can abort state update (return original state), middleware can transform state before saving. Test each built-in middleware in isolation.</li>
          <li><strong>Batch manager:</strong> Test multiple setState calls inside batch result in single notification, nested batches flatten correctly, batch with no setState is a no-op.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li><strong>React hook integration:</strong> Render a component using useMyStore, trigger setState, verify component re-renders with new selected value. Verify component does NOT re-render when unrelated state changes. Test unsubscribe on unmount (no memory leaks).</li>
          <li><strong>DevTools integration:</strong> Mock Redux DevTools extension, trigger setState, verify action logged with correct before/after state. Simulate DevTools dispatch with historical state, verify store restores and subscribers notified.</li>
          <li><strong>Error boundary:</strong> Register two subscribers, have the first throw during notification, verify the second still receives the notification. Verify error is logged with correct context (subscriber name, selector result, current state).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>Nested setState: subscriber calls setState in its notification handler. Verify the nested update is queued and executed after the current cycle completes, not recursively.</li>
          <li>Middleware circular call: middleware calls setState, which runs the middleware again. Verify depth limit triggers at 10 and throws with chain trace.</li>
          <li>Performance test: create 1000 subscribers, trigger 1000 setState calls per second, verify no main thread blocking (measure with Performance API). Verify subscriber notification completes in under 5ms.</li>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li><strong>Deep merge instead of shallow merge:</strong> Candidates implement setState as deep merge, which is expensive and unexpected. Interviewers expect shallow merge (like React&apos;s setState) — nested objects are replaced, not merged. Deep merge is a footgun that hides bugs (stale nested fields silently persist).</li>
          <li><strong>Not implementing selective subscriptions:</strong> Candidates create a pub/sub store where every subscriber is notified on every state change. Interviewers ask: &quot;What happens when 500 components subscribe and one field changes?&quot; The correct answer: selector-based subscriptions with Object.is comparison, notifying only components whose selected slice changed.</li>
          <li><strong>Synchronous middleware blocking:</strong> Candidates implement middleware that performs async operations (fetch, localStorage) synchronously in the setState pipeline. This blocks state updates. The correct answer: middleware can queue async work but must not block the synchronous state update. The state update happens first, async work follows.</li>
          <li><strong>Not handling subscriber errors:</strong> Candidates assume all subscribers execute without error. Interviewers ask: &quot;What if subscriber A throws?&quot; The correct answer: wrap each subscriber in try/catch, log the error, continue notifying remaining subscribers. Never let one subscriber block others.</li>
          <li><strong>Missing batch support:</strong> Candidates don&apos;t consider the case where multiple setState calls happen in one event handler (e.g., updating 5 fields). Without batching, this triggers 5 notification cycles. The correct answer: provide a batch() function that queues updates and flushes them as a single notification.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Shallow Merge vs Deep Merge</h4>
          <p>
            Shallow merge is O(1) for top-level fields but replaces nested objects entirely. If state.user has name and email fields and setState only provides a new name object, the email field is lost. Deep merge preserves nested fields but is O(n) for all nested fields and creates surprises (stale fields silently persist). The correct approach: shallow merge (predictable, fast) and engineers spread nested objects explicitly. This makes the merge intent clear and avoids hidden behavior.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Proxy-Based vs Selector-Based Reactivity</h4>
          <p>
            Proxy-based reactivity (MobX) tracks which properties each subscriber
            accesses during evaluation and automatically re-runs when those properties
            change. Pros: no manual selectors, automatic dependency tracking. Cons:
            Proxy adds ~5KB, implicit subscriptions are harder to debug, Proxy is
            not available in all JS environments (React Native, older browsers).
            Selector-based subscriptions (our approach) require explicit selectors
            but are transparent, debuggable, and have zero runtime overhead beyond
            the selector call. For a library targeting broad compatibility and
            debuggability, selector-based is the right choice.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you add undo/redo support to this state manager?</p>
            <p className="mt-2 text-sm">
              A: Add a history middleware that maintains a stack of state snapshots.
              Before each setState, push the current state onto the stack. Undo pops
              the stack and dispatches the previous state. Redo maintains a forward
              stack. Limit stack depth (max 100 entries) to prevent memory bloat.
              For large states, use Immer patches (JSON patches of changed fields)
              instead of full snapshots to reduce memory.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you make this state manager work with React Server Components?</p>
            <p className="mt-2 text-sm">
              A: Server Components cannot use hooks or subscribe to stores. The
              store runs only on the client. Server Components receive state as
              props from a client component that subscribes to the store. For
              server-rendered initial state, serialize the store state into the
              HTML response (inline JSON script tag), hydrate the client store
              from it on mount, and begin subscribing. The store itself is
              client-only — it never runs on the server.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement derived/computed state in this store?</p>
            <p className="mt-2 text-sm">
              A: Two approaches. (1) Compute in the selector: select((s) =&gt;
              s.items.filter(i =&gt; i.active).length). Simple but recomputes on
              every notification. (2) Computed fields as middleware: define
              computed values as functions of state, middleware recomputes them
              when dependencies change, and stores them in a separate computed
              object. Selectors read from state.computed. Approach (2) memoizes
              computations and only recomputes when dependencies change — better
              for expensive calculations.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you persist state across page reloads?</p>
            <p className="mt-2 text-sm">
              A: Add a persistence middleware that listens to setState and queues
              writes to localStorage. On store creation, read from localStorage
              and merge with initial state (stored values override defaults).
              Debounce writes at 300ms to avoid excessive storage I/O. Handle
              version migration: if the stored state schema differs from the
              current schema, run a migration function before merging. On
              QuotaExceededError, clear stale data and fall back to defaults.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you test components that use this store without testing implementation details?</p>
            <p className="mt-2 text-sm">
              A: Test through user interactions and rendered output. Render the
              component, interact with it (click, type), and assert the rendered
              output changes correctly. Do not mock the store — use a real store
              instance with test-specific initial state. For edge cases (store
              errors, slow updates), inject a test middleware that simulates
              failures or delays. Assert observable behavior, not internal store state.
            </p>
          </div>
        </div>
      </section>

      {/* Section 11: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://redux.js.org/understanding/thinking-in-redux/three-principles" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Redux Three Principles — Predictable State Container
            </a>
          </li>
          <li>
            <a href="https://mobx.js.org/README.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MobX — Simple, Scalable State Management
            </a>
          </li>
          <li>
            <a href="https://react.dev/reference/react/useSyncExternalStore" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React Docs — useSyncExternalStore
            </a>
          </li>
          <li>
            <a href="https://github.com/reduxjs/redux-devtools" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Redux DevTools Extension Protocol
            </a>
          </li>
          <li>
            <a href="https://immerjs.github.io/immer/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Immer — Structural Sharing for Immutable Updates
            </a>
          </li>
          <li>
            <a href="https://zod.dev/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Zod — Schema Validation for State Updates
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
