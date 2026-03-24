"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-local-component-state-concise",
  title: "Local Component State",
  description:
    "Deep dive into local component state management covering useState, useReducer, component-level state patterns, lifting state, and when local state is sufficient.",
  category: "frontend",
  subcategory: "state-management",
  slug: "local-component-state",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-13",
  tags: [
    "frontend",
    "state management",
    "useState",
    "useReducer",
    "React",
    "component state",
  ],
  relatedTopics: [
    "global-state-management",
    "derived-state",
    "form-state-management",
  ],
};

export default function LocalComponentStateConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Local component state</strong> is data that is owned,
          managed, and scoped entirely within a single component (or a small
          subtree of the component hierarchy). It represents the simplest and
          most performant form of state management in React: state that lives
          exactly where it is needed and nowhere else.
        </p>
        <p>
          The concept has evolved significantly over React&rsquo;s lifetime.
          In class components, state was declared via{" "}
          <code>this.state</code> and mutated through{" "}
          <code>this.setState()</code>, which performed shallow merges and
          triggered asynchronous re-renders. The introduction of hooks in
          React 16.8 fundamentally changed the mental model: state became a
          value returned from a function call (<code>useState</code>) rather
          than an instance property, enabling state in function components and
          promoting the composition of stateful logic through custom hooks.
        </p>
        <p>
          The guiding principle behind local state is{" "}
          <strong>colocation</strong> &mdash; keeping state as close as
          possible to the code that uses it. This principle, championed by
          Kent C. Dodds and the React core team, argues that most application
          state does not need to be global. Studies of production codebases
          reveal that roughly 80% of state is UI-local (toggles, form inputs,
          animation flags, pagination cursors) and benefits from remaining at
          the component level rather than being promoted to a global store.
        </p>
        <p>
          When state is colocated, components become self-contained units
          that are easier to reason about, test in isolation, and refactor
          independently. Moving state up the tree should be a deliberate
          decision made only when multiple distant components genuinely need
          the same data, not a default architectural choice.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>

        <h3>useState Semantics</h3>
        <p>
          <code>useState</code> returns a tuple of the current value and a
          setter function. The setter can receive either a direct value or a{" "}
          <strong>functional updater</strong>{" "}
          (<code>prev =&gt; next</code>) that guarantees access to the most
          recent state, critical inside closures or when multiple updates are
          queued. React uses <code>Object.is</code> to compare old and new
          state; if they are referentially equal, the re-render is bailed
          out. This makes primitive state cheap but requires immutable update
          patterns for objects and arrays.
        </p>
        <p>
          <strong>Lazy initialization</strong> allows expensive computations
          to run only on the first render by passing a function to{" "}
          <code>useState</code> (e.g.,{" "}
          <code>useState(() =&gt; computeExpensiveDefault())</code>). This
          is frequently overlooked but matters in performance-sensitive
          scenarios such as parsing large JSON from localStorage on mount.
        </p>

        <h3>useReducer for Complex State Machines</h3>
        <p>
          When local state involves multiple sub-values that change together
          or transitions that depend on the current state,{" "}
          <code>useReducer</code> provides a more structured approach. The
          reducer pattern enforces that every state change flows through a
          pure function <code>(state, action) =&gt; newState</code>, making
          transitions predictable and testable without rendering the
          component. It is particularly valuable for form wizards, drag-and-drop
          interactions, and any UI with a finite set of states (idle, loading,
          success, error).
        </p>
        <p>
          A key architectural insight: <code>useReducer</code> also accepts
          a lazy initializer as its third argument, and the dispatch function
          is <strong>stable across re-renders</strong> (referentially
          identical), which means passing dispatch as a prop or context value
          never causes unnecessary child re-renders &mdash; a benefit that{" "}
          <code>useState</code> setters share but inline callback handlers
          do not.
        </p>

        <h3>State Identity and Referential Equality</h3>
        <p>
          React&rsquo;s reconciler decides whether to re-render based on
          referential equality checks. For objects and arrays, creating a new
          reference triggers a re-render even if the deep contents are
          unchanged. This is why immutable updates (spread operator,{" "}
          <code>Array.prototype.map</code>,{" "}
          <code>structuredClone</code>) are essential. Conversely, mutating
          an existing reference and calling the setter with the same object
          will <em>not</em> trigger a re-render &mdash; a frequent source of
          bugs.
        </p>

        <h3>Controlled vs. Uncontrolled Components</h3>
        <p>
          A <strong>controlled component</strong> stores its value in React
          state and receives updates through an <code>onChange</code>{" "}
          handler. The component is fully driven by React and the state is
          the single source of truth. An{" "}
          <strong>uncontrolled component</strong> lets the DOM manage its own
          state, with React accessing the value imperatively via{" "}
          <code>useRef</code>. Controlled components provide more
          flexibility (validation, formatting, conditional disabling) at the
          cost of more re-renders per keystroke.
        </p>

        <h3>Lifting State Up vs. Pushing State Down</h3>
        <p>
          <strong>Lifting state up</strong> means moving state from a child
          to its nearest common ancestor when two or more siblings need
          access. This establishes a single source of truth at a higher level
          in the tree. The inverse pattern &mdash;{" "}
          <strong>pushing state down</strong> &mdash; moves state closer to
          the leaf components when only a narrow subtree cares about it,
          reducing unnecessary re-renders in unrelated branches.
        </p>

        <h3>Single Source of Truth at the Component Level</h3>
        <p>
          Each piece of state should have exactly one owner. Duplicating
          state across components (e.g., copying a prop into local state
          without a synchronization mechanism) is one of the most common
          sources of UI bugs. If a value can be derived from props or other
          state, it should be computed during render rather than stored
          separately &mdash; the principle of{" "}
          <strong>derived state</strong>.
        </p>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Understanding how local state changes propagate through React&rsquo;s
          internals is essential for diagnosing performance problems and
          predicting rendering behavior at scale.
        </p>

        <h3>React&rsquo;s Reconciliation with State Changes</h3>
        <p>
          When <code>setState</code> (or <code>dispatch</code>) is called,
          React does not immediately re-render. Instead, it enqueues the
          update on the component&rsquo;s fiber node and schedules a render
          pass. During the render phase, React walks the fiber tree
          top-down, calling each component function to produce a new virtual
          DOM (the &ldquo;work-in-progress&rdquo; tree). It then diffs this
          tree against the previous tree (reconciliation) and computes the
          minimal set of DOM mutations. Only during the commit phase are
          actual DOM writes performed synchronously.
        </p>

        <h3>Batching Behavior</h3>
        <p>
          In React 17 and earlier, batching only occurred inside React event
          handlers. Multiple <code>setState</code> calls in a{" "}
          <code>setTimeout</code>, <code>Promise.then</code>, or native DOM
          event handler each triggered their own re-render. React 18
          introduced <strong>automatic batching</strong> via{" "}
          <code>createRoot</code>: all state updates are batched regardless
          of their origin &mdash; event handlers, promises, timeouts, and
          native events all receive a single re-render per microtask. This
          significantly reduces wasted renders in real-world applications
          where async operations frequently trigger multiple state updates.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/state-management/local-state-lifecycle.svg"
          alt="Local State Update Lifecycle showing setState batching, reconciliation, and commit phases"
          caption="Local state update lifecycle: from setState calls through React 18 automatic batching to DOM commit"
        />

        <h3>Closures and Stale State</h3>
        <p>
          Every render creates a closure over the state values at that
          point in time. If a callback (e.g., a <code>setTimeout</code>{" "}
          or event listener registered in <code>useEffect</code>) captures
          a state value, it will see the value from the render in which it
          was created, not the latest value. This is the{" "}
          <strong>stale closure</strong> problem. Solutions include
          functional updaters (<code>setState(prev =&gt; prev + 1)</code>),
          refs to track the latest value (<code>useRef</code>), or
          restructuring effects so dependencies are correctly declared.
        </p>

        <h3>Lifting State &mdash; Architectural Pattern</h3>
        <p>
          The following diagram illustrates the before and after of lifting
          state from sibling components to a common parent. This is the most
          fundamental state sharing pattern in React and should be the first
          technique considered before reaching for context or external
          stores.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/state-management/lifting-state-up.svg"
          alt="Lifting state up pattern showing before (duplicated state, out of sync) and after (single source of truth in parent)"
          caption="Lifting state up: eliminating duplicated state by moving ownership to the nearest common ancestor"
        />
      </section>

      {/* Section 5: Trade-offs & Comparisons */}
      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <p>
          Choosing between local state mechanisms depends on complexity,
          performance requirements, and debugging needs. The following
          comparison covers the primary options for component-level state.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-3 text-left text-sm font-semibold">
                  Aspect
                </th>
                <th className="p-3 text-left text-sm font-semibold">
                  useState
                </th>
                <th className="p-3 text-left text-sm font-semibold">
                  useReducer
                </th>
                <th className="p-3 text-left text-sm font-semibold">
                  useRef
                </th>
                <th className="p-3 text-left text-sm font-semibold">
                  External Store
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-theme">
                <td className="p-3 text-sm font-medium">Complexity</td>
                <td className="p-3 text-sm">
                  Minimal &mdash; single value, single setter
                </td>
                <td className="p-3 text-sm">
                  Moderate &mdash; reducer function + action types
                </td>
                <td className="p-3 text-sm">
                  Minimal &mdash; mutable .current property
                </td>
                <td className="p-3 text-sm">
                  High &mdash; setup, selectors, subscriptions
                </td>
              </tr>
              <tr className="border-b border-theme">
                <td className="p-3 text-sm font-medium">Re-renders</td>
                <td className="p-3 text-sm">
                  Triggers re-render on every update
                </td>
                <td className="p-3 text-sm">
                  Triggers re-render on every dispatch
                </td>
                <td className="p-3 text-sm">
                  Never triggers re-render
                </td>
                <td className="p-3 text-sm">
                  Selective &mdash; via selector functions
                </td>
              </tr>
              <tr className="border-b border-theme">
                <td className="p-3 text-sm font-medium">Debugging</td>
                <td className="p-3 text-sm">
                  React DevTools shows current value
                </td>
                <td className="p-3 text-sm">
                  Actions provide traceable state transitions
                </td>
                <td className="p-3 text-sm">
                  Not visible in DevTools; harder to trace
                </td>
                <td className="p-3 text-sm">
                  Dedicated DevTools (Redux, Zustand)
                </td>
              </tr>
              <tr className="border-b border-theme">
                <td className="p-3 text-sm font-medium">Testing</td>
                <td className="p-3 text-sm">
                  Test via component renders
                </td>
                <td className="p-3 text-sm">
                  Reducer is a pure function &mdash; unit testable in
                  isolation
                </td>
                <td className="p-3 text-sm">
                  Requires imperative assertions
                </td>
                <td className="p-3 text-sm">
                  Store logic testable outside React
                </td>
              </tr>
              <tr className="border-b border-theme">
                <td className="p-3 text-sm font-medium">Best Use Case</td>
                <td className="p-3 text-sm">
                  Toggles, form inputs, simple counters
                </td>
                <td className="p-3 text-sm">
                  Multi-field forms, state machines, complex transitions
                </td>
                <td className="p-3 text-sm">
                  DOM refs, timers, previous-value tracking, values that
                  should not trigger renders
                </td>
                <td className="p-3 text-sm">
                  Cross-component shared state, server cache, global UI
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          A useful heuristic: start with <code>useState</code>. If you find
          yourself writing multiple related <code>useState</code> calls that
          always change together, consolidate into <code>useReducer</code>.
          If state does not affect rendering (e.g., a timer ID or a scroll
          position you only read imperatively), use <code>useRef</code>. Only
          promote to an external store when genuinely different subtrees of
          the component hierarchy need the same data.
        </p>
      </section>

      {/* Section 6: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <li>
            <strong>
              Keep state as local as possible (colocation principle).
            </strong>{" "}
            Start with state in the component that uses it. Only lift when
            siblings provably need the same data. Premature lifting leads to
            prop drilling and unnecessary re-renders in intermediate
            components.
          </li>
          <li>
            <strong>
              Use functional updaters for state that depends on previous
              values.
            </strong>{" "}
            <code>setState(prev =&gt; prev + 1)</code> avoids stale closure
            bugs in async callbacks, effects, and event handlers that fire
            rapidly (e.g., keystrokes, scroll events).
          </li>
          <li>
            <strong>
              Prefer a single <code>useReducer</code> over multiple
              correlated <code>useState</code> calls.
            </strong>{" "}
            If three or more pieces of state always change in response to the
            same event, a reducer consolidates the logic and prevents
            inconsistent intermediate states.
          </li>
          <li>
            <strong>Never mutate state directly.</strong> Always create new
            references for objects and arrays. Use spread syntax, array
            methods that return new arrays (<code>map</code>,{" "}
            <code>filter</code>, <code>concat</code>), or utility libraries
            like Immer for deeply nested updates.
          </li>
          <li>
            <strong>
              Derive values during render instead of storing them.
            </strong>{" "}
            If a value can be computed from existing state or props (e.g.,
            filtered list, full name from first + last), compute it inline.
            Storing derived data creates synchronization obligations and
            duplication risks.
          </li>
          <li>
            <strong>
              Use lazy initialization for expensive defaults.
            </strong>{" "}
            Pass a function to <code>useState</code> or the third argument
            of <code>useReducer</code> when the initial value requires
            parsing, computation, or I/O (e.g., reading from localStorage).
          </li>
          <li>
            <strong>
              Scope state to the smallest possible subtree to limit re-render
              blast radius.
            </strong>{" "}
            Extracting a stateful piece of UI into its own component means
            state updates only re-render that component and its children,
            not the entire parent tree.
          </li>
          <li>
            <strong>
              Use <code>useRef</code> for values that should not cause
              re-renders.
            </strong>{" "}
            Timer IDs, previous values for comparison, imperative handles,
            and DOM references belong in refs, not state. Storing them in
            state wastes render cycles.
          </li>
        </ol>
      </section>

      {/* Section 7: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Stale closures in effects and callbacks.</strong>{" "}
            Forgetting to include state variables in dependency arrays or
            relying on closure-captured values in <code>setTimeout</code>{" "}
            and <code>setInterval</code> leads to components operating on
            outdated data. Use functional updaters or refs for the latest
            value.
          </li>
          <li>
            <strong>Copying props into state without synchronization.</strong>{" "}
            Initializing state from a prop (
            <code>useState(props.value)</code>) creates a snapshot that
            diverges when the parent re-renders with a new prop. Either
            treat the prop as the source of truth (controlled pattern) or
            add a key to reset the component when the prop changes.
          </li>
          <li>
            <strong>
              Object/array state mutations that skip re-renders.
            </strong>{" "}
            Pushing to an array via <code>arr.push(item)</code> and calling{" "}
            <code>setArr(arr)</code> passes the same reference, so React
            bails out. Always spread into a new array:{" "}
            <code>setArr([...arr, item])</code>.
          </li>
          <li>
            <strong>
              Over-lifting state, causing prop drilling and wasted renders.
            </strong>{" "}
            Placing a frequently changing value (e.g., mouse position, input
            text) in a high-level parent forces every intermediate component
            to re-render. Isolate fast-changing state in the lowest possible
            component or use composition patterns like children-as-props.
          </li>
          <li>
            <strong>
              Using state for values that do not affect UI.
            </strong>{" "}
            Timer IDs, WebSocket references, animation frame handles, and
            accumulated non-displayed data should live in{" "}
            <code>useRef</code>, not <code>useState</code>. Every state
            update triggers reconciliation work even if the render output
            does not change.
          </li>
          <li>
            <strong>
              Expecting <code>setState</code> to be synchronous.
            </strong>{" "}
            State updates are enqueued and processed in the next render.
            Reading state immediately after calling the setter returns the
            old value. Use <code>useEffect</code> to respond to state
            changes or restructure logic to depend on the new value directly.
          </li>
          <li>
            <strong>
              Creating new object/function references every render without
              memoization.
            </strong>{" "}
            Passing an inline object or arrow function as a prop to a
            memoized child defeats <code>React.memo</code>. Use{" "}
            <code>useMemo</code> and <code>useCallback</code> when the child
            is wrapped with <code>memo</code> and the prop is in a hot path.
          </li>
        </ul>
      </section>

      {/* Section 8: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Form Inputs and Validation</h3>
        <p>
          Each input&rsquo;s value and validation state (dirty, touched,
          error message) lives locally. The form component owns the
          aggregate submission state. This two-tier pattern avoids lifting
          every keystroke to a global store while still supporting
          cross-field validation at the form level.
        </p>

        <h3>Toggles, Modals, and Disclosure Widgets</h3>
        <p>
          An <code>isOpen</code> boolean controlling a modal, dropdown, or
          accordion panel is the canonical example of local state. These
          values are ephemeral, UI-only, and meaningless to other parts of
          the application. A single <code>useState(false)</code> is ideal.
        </p>

        <h3>Pagination and Scroll Position</h3>
        <p>
          Page cursors, offset values, and current-page indexes within a
          data list component benefit from local state because they are
          tightly coupled to one specific rendering context. If the user
          navigates away and returns, resetting is usually acceptable.
        </p>

        <h3>Animation and Transition Flags</h3>
        <p>
          Animation states (entering, entered, exiting, exited) and
          transition progress values are inherently local. They are frame-rate
          sensitive, change rapidly, and would pollute a global store with
          noise.
        </p>

        <div className="mt-6 rounded-lg bg-panel-soft p-5 border border-theme">
          <h4 className="text-base font-semibold mb-2">
            When NOT to Use Local State
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <strong>Server cache / async data:</strong> Data fetched from
              APIs is better managed by server-state libraries (React Query,
              SWR, Apollo) that handle caching, deduplication, background
              refetching, and stale-while-revalidate semantics.
            </li>
            <li>
              <strong>Deeply shared UI state:</strong> When a theme toggle,
              locale selector, or authenticated user object is consumed by
              dozens of components across multiple routes, Context or a
              lightweight global store (Zustand, Jotai) avoids prop drilling
              through the entire tree.
            </li>
            <li>
              <strong>URL-driven state:</strong> Filters, sort order, and
              search queries that should be shareable via URL belong in the
              URL search params, not component state. Libraries like
              nuqs or Next.js <code>useSearchParams</code> synchronize URL
              and UI.
            </li>
            <li>
              <strong>Cross-tab or persistent state:</strong> Values that
              must survive page reloads (e.g., shopping cart) or synchronize
              across browser tabs require localStorage/sessionStorage or an
              external store with persistence middleware.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 9: Common Interview Questions */}
      <section>
        <h2>Common Interview Questions</h2>

        <div className="mt-4 space-y-6">
          <div className="rounded-lg bg-panel-soft p-5 border border-theme">
            <h3 className="text-base font-semibold">
              Q: When would you choose useReducer over useState, and what are
              the implications for testing?
            </h3>
            <p className="mt-2 text-sm">
              <strong>A:</strong> I reach for <code>useReducer</code> when
              local state involves multiple sub-values that transition
              together (e.g., a form with fields, validation errors, and
              submission status) or when the next state depends on the
              previous state in non-trivial ways. The reducer is a pure
              function, so I can write unit tests that assert{" "}
              <code>reducer(prevState, action) === expectedState</code>{" "}
              without mounting a component at all. This separation of state
              logic from rendering logic is particularly valuable in large
              teams because reviewers can verify state transitions
              independently. With <code>useState</code>, testing requires
              rendering the component and simulating events, which is slower
              and more coupled to the UI structure.
            </p>
          </div>

          <div className="rounded-lg bg-panel-soft p-5 border border-theme">
            <h3 className="text-base font-semibold">
              Q: Explain the stale closure problem and how you would debug
              it in production.
            </h3>
            <p className="mt-2 text-sm">
              <strong>A:</strong> A stale closure occurs when a callback
              created in a previous render captures an outdated state value.
              For example, a <code>setInterval</code> callback inside{" "}
              <code>useEffect</code> with an empty dependency array always
              sees the initial state. In production, symptoms include
              counters that never increment past 1, event handlers reporting
              wrong data, or race conditions in async flows. To debug, I
              check the dependency arrays in effects and verify that
              functional updaters are used for state-dependent logic. The fix
              is usually one of: (1) use{" "}
              <code>setState(prev =&gt; prev + 1)</code> instead of{" "}
              <code>setState(count + 1)</code>, (2) store the mutable latest
              value in a ref and read <code>ref.current</code> inside the
              callback, or (3) restructure the effect to include the
              dependency and handle cleanup correctly.
            </p>
          </div>

          <div className="rounded-lg bg-panel-soft p-5 border border-theme">
            <h3 className="text-base font-semibold">
              Q: How does React 18&rsquo;s automatic batching differ from
              React 17, and what edge cases should you watch for?
            </h3>
            <p className="mt-2 text-sm">
              <strong>A:</strong> In React 17, batching only applied inside
              React synthetic event handlers. State updates inside{" "}
              <code>setTimeout</code>, <code>Promise.then</code>, native
              event listeners, or <code>fetch</code> callbacks each caused
              a separate re-render. React 18&rsquo;s{" "}
              <code>createRoot</code> enables automatic batching for{" "}
              <em>all</em> updates regardless of origin &mdash; event
              handlers, promises, timeouts, and native events are all
              grouped into a single render pass. The edge case to watch is
              when you <em>need</em> an immediate re-render between updates
              (rare but possible in measuring layout). In that case,{" "}
              <code>flushSync</code> from <code>react-dom</code> forces a
              synchronous flush of the enclosed updates. However,{" "}
              <code>flushSync</code> should be used sparingly because it
              bypasses the scheduler and can degrade performance if overused.
            </p>
          </div>
        </div>
      </section>

      {/* Section 10: References & Further Reading */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              className="text-accent hover:underline"
              href="https://react.dev/learn/managing-state"
              target="_blank"
              rel="noopener noreferrer"
            >
              React Documentation &mdash; Managing State
            </a>{" "}
            &mdash; Official guide covering when to use local vs. shared state,
            principles of state structure, and lifting state up.
          </li>
          <li>
            <a
              className="text-accent hover:underline"
              href="https://react.dev/reference/react/useReducer"
              target="_blank"
              rel="noopener noreferrer"
            >
              React API Reference &mdash; useReducer
            </a>{" "}
            &mdash; Complete API documentation with examples of lazy
            initialization and TypeScript usage.
          </li>
          <li>
            <a
              className="text-accent hover:underline"
              href="https://kentcdodds.com/blog/state-colocation-will-make-your-react-app-faster"
              target="_blank"
              rel="noopener noreferrer"
            >
              Kent C. Dodds &mdash; State Colocation Will Make Your React
              App Faster
            </a>{" "}
            &mdash; Detailed argument for colocation as a performance and
            maintainability strategy.
          </li>
          <li>
            <a
              className="text-accent hover:underline"
              href="https://overreacted.io/a-complete-guide-to-useeffect/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dan Abramov &mdash; A Complete Guide to useEffect
            </a>{" "}
            &mdash; Deep exploration of closures, stale state, and how
            effects interact with local state.
          </li>
          <li>
            <a
              className="text-accent hover:underline"
              href="https://github.com/reactwg/react-18/discussions/21"
              target="_blank"
              rel="noopener noreferrer"
            >
              React 18 Working Group &mdash; Automatic Batching
            </a>{" "}
            &mdash; RFC and discussion on the automatic batching behavior
            introduced in React 18.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
