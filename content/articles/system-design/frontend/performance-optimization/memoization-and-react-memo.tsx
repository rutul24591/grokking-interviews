"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-memoization-react-memo",
  title: "Memoization and React.memo",
  description: "Comprehensive guide to memoization techniques in React including React.memo, useMemo, and useCallback for preventing unnecessary re-renders and optimizing performance.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "memoization-and-react-memo",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-30",
  tags: ["frontend", "performance", "react", "memoization", "React.memo", "useMemo", "useCallback", "optimization"],
  relatedTopics: ["virtualization-windowing", "debouncing-and-throttling", "code-splitting", "web-vitals"],
};

export default function MemoizationReactMemoArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Memoization</strong> is an optimization technique that caches the result of expensive 
          computations and returns the cached result when the same inputs occur again. In React, 
          memoization serves two primary purposes: preventing unnecessary re-renders of components 
          (<code>React.memo</code>) and avoiding expensive recalculations of derived data 
          (<code>useMemo</code>, <code>useCallback</code>).
        </p>
        <p>
          React re-renders a component whenever its parent re-renders, even if the component&apos;s 
          props haven&apos;t changed. For most components this is fine — React&apos;s reconciliation 
          is fast enough that the overhead of checking props often exceeds the cost of re-rendering. 
          However, for expensive components (large lists, complex charts, heavy computations), 
          preventing unnecessary re-renders can make the difference between smooth 60fps interactions 
          and janky, unresponsive UI.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/memoization-concept.svg"
          alt="Diagram showing memoization concept: function with same inputs returns cached result instead of recomputing"
          caption="Memoization caches results by input — same inputs return cached output instead of recomputing"
        />

        <p>
          The performance impact of proper memoization can be significant:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Reduced Re-renders:</strong> A list component with 1000 items that re-renders on 
            every parent state change can be reduced to re-rendering only when its specific props 
            change.
          </li>
          <li>
            <strong>Faster Interactions:</strong> Expensive computations (filtering, sorting, 
            transformations) that block the main thread can be cached, making interactions feel 
            instant.
          </li>
          <li>
            <strong>Stable References:</strong> Memoized callbacks prevent child components from 
            re-rendering unnecessarily due to new function references on every render.
          </li>
        </ul>

        <p>
          However, memoization is not a silver bullet. It comes with trade-offs:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Memory Cost:</strong> Cached results consume memory. Aggressive memoization can 
            increase memory pressure, especially on mobile devices.
          </li>
          <li>
            <strong>Comparison Overhead:</strong> React.memo does shallow prop comparison. For 
            components with many props, the comparison cost may exceed the re-render cost.
          </li>
          <li>
            <strong>Stale Data Risk:</strong> Incorrect dependency arrays in useMemo/useCallback can 
            cause stale closures — the memoized value uses outdated state.
          </li>
        </ul>

        <p>
          In React 19+, the React Compiler (formerly React Forget) automates memoization at build time, 
          making manual <code>React.memo</code>, <code>useMemo</code>, and <code>useCallback</code> 
          largely unnecessary. However, understanding memoization remains essential for:
        </p>
        <ul className="space-y-2">
          <li>Working with existing codebases that predate the compiler</li>
          <li>Debugging performance issues in production</li>
          <li>System design interviews where memoization concepts are frequently tested</li>
          <li>Making informed decisions about when to opt-out of automatic memoization</li>
        </ul>

        <p>
          In system design interviews, memoization demonstrates understanding of caching strategies, 
          the trade-offs between computation and memory, and the ability to identify and optimize 
          performance bottlenecks in component hierarchies.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/memoization-react-render.svg"
          alt="Diagram showing React render flow with and without React.memo — comparing prop changes and re-render decisions"
          caption="React.memo prevents re-renders when props haven't changed, skipping expensive rendering work"
        />

        <h3>React.memo — Component Memoization</h3>
        <p>
          <code>React.memo</code> is a higher-order component that memoizes a functional component. 
          It performs a shallow comparison of props and skips re-rendering if they haven&apos;t changed.
        </p>
        <p>
          How React.memo works:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>First Render:</strong> Component renders normally. React stores the props and 
            rendered output.
          </li>
          <li>
            <strong>Parent Re-renders:</strong> When the parent component re-renders, React compares 
            the new props with the stored props using shallow comparison (=== for each prop).
          </li>
          <li>
            <strong>Props Unchanged:</strong> If all props are equal, React skips re-rendering the 
            component and reuses the previous output.
          </li>
          <li>
            <strong>Props Changed:</strong> If any prop is different, React re-renders the component 
            and updates the stored props.
          </li>
        </ol>
        <p>
          Shallow comparison means React only compares prop references, not deep equality. For objects 
          and arrays, this means comparing memory addresses, not contents. A new object literal 
          <code>{'{ theme: &quot;dark&quot; }'}</code> is always different from the previous one, even 
          if the contents are identical.
        </p>

        <h3>useMemo — Value Memoization</h3>
        <p>
          <code>useMemo</code> caches the result of a computation and only recalculates when its 
          dependencies change. It&apos;s used for expensive calculations that would otherwise run on 
          every render.
        </p>
        <p>
          How useMemo works:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>First Render:</strong> The computation function runs. React stores the result and 
            the dependency values.
          </li>
          <li>
            <strong>Subsequent Renders:</strong> React compares current dependencies with stored 
            dependencies using === comparison.
          </li>
          <li>
            <strong>Dependencies Unchanged:</strong> Return the cached result without running the 
            computation.
          </li>
          <li>
            <strong>Dependencies Changed:</strong> Run the computation, store the new result, and 
            return it.
          </li>
        </ol>
        <p>
          Common use cases for useMemo:
        </p>
        <ul className="space-y-2">
          <li>Filtering or sorting large arrays (1000+ items)</li>
          <li>Complex object transformations or data normalization</li>
          <li>Creating derived data structures (maps, sets, indexes)</li>
          <li>Expensive mathematical calculations or formatting operations</li>
        </ul>

        <h3>useCallback — Function Memoization</h3>
        <p>
          <code>useCallback</code> returns a memoized version of a callback function that only changes 
          when its dependencies change. It&apos;s essentially <code>useMemo</code> for functions.
        </p>
        <p>
          How useCallback works:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>First Render:</strong> The function is created. React stores the function reference 
            and dependency values.
          </li>
          <li>
            <strong>Subsequent Renders:</strong> React compares current dependencies with stored 
            dependencies.
          </li>
          <li>
            <strong>Dependencies Unchanged:</strong> Return the cached function reference.
          </li>
          <li>
            <strong>Dependencies Changed:</strong> Create a new function, store it, and return it.
          </li>
        </ol>
        <p>
          Primary use case for useCallback:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Passing callbacks to memoized children:</strong> Without useCallback, a new 
            function reference on every render breaks React.memo comparisons.
          </li>
          <li>
            <strong>Effect dependencies:</strong> When a function is used in useEffect dependency 
            array, useCallback prevents the effect from running on every render.
          </li>
          <li>
            <strong>Event handlers for expensive components:</strong> Stabilizing function references 
            for components that do expensive work on prop changes.
          </li>
        </ul>

        <h3>Shallow vs. Deep Comparison</h3>
        <p>
          React.memo and the useMemo/useCallback dependency arrays use <strong>shallow comparison</strong> 
          (=== for each value). This has important implications:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Primitives:</strong> Numbers, strings, and booleans compare by value. 
            <code>5 === 5</code> is true.
          </li>
          <li>
            <strong>Objects/Arrays:</strong> Compare by reference, not contents. 
            <code>{'{ a: 1 } === { a: 1 }'}</code> is false — they&apos;re different objects in memory.
          </li>
          <li>
            <strong>Functions:</strong> Each render creates new function references. 
            <code>() =&gt; {} === () =&gt; {}</code> is false.
          </li>
        </ul>
        <p>
          This is why inline objects and callbacks break memoization:
        </p>
        <ul className="space-y-2">
          <li>
            <code>{'<Chart config={{ theme: "dark" }} />'}</code> — New object every render, Chart 
            always re-renders.
          </li>
          <li>
            <code>{'<Button onClick={() => save()} />'}</code> — New function every render, Button 
            always re-renders.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture & Flow</h2>

        <h3>React Render Flow with Memoization</h3>
        <p>
          Understanding when memoization helps requires understanding React&apos;s render flow:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>State Update:</strong> setState is called, marking the component as &quot;dirty&quot;.
          </li>
          <li>
            <strong>Re-render Triggered:</strong> React schedules a re-render for the dirty component 
            and all children.
          </li>
          <li>
            <strong>Render Phase:</strong> React calls each component function, producing a new virtual 
            DOM tree.
          </li>
          <li>
            <strong>Reconciliation:</strong> React compares the new virtual DOM with the previous one 
            (diffing).
          </li>
          <li>
            <strong>Commit Phase:</strong> React applies changes to the actual DOM.
          </li>
        </ol>
        <p>
          React.memo intercepts this flow at step 3. If props haven&apos;t changed, React skips the 
          render phase entirely for that component and its subtree.
        </p>

        <h3>Memoization Decision Tree</h3>
        <p>
          When deciding whether to memoize, follow this decision tree:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>Is the component slow?</strong> Profile with React DevTools. If render time is 
            &lt;1ms, skip memoization.
          </li>
          <li>
            <strong>Do props change frequently?</strong> If props change on every render anyway, 
            memoization provides no benefit.
          </li>
          <li>
            <strong>Are children memoized?</strong> Memoizing a parent without memoizing children 
            provides limited benefit.
          </li>
          <li>
            <strong>Is the computation expensive?</strong> For useMemo, only memoize computations 
            that take measurable time (filtering 1000+ items, complex transformations).
          </li>
        </ol>

        <h3>React Compiler (React 19+)</h3>
        <p>
          The React Compiler (formerly React Forget) automatically memoizes components and hooks at 
          build time. It analyzes your code and inserts memoization where beneficial, making manual 
          React.memo, useMemo, and useCallback largely unnecessary.
        </p>
        <p>
          How the React Compiler works:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Static Analysis:</strong> The compiler analyzes component code to identify values 
            that are stable across renders.
          </li>
          <li>
            <strong>Auto-Memoization:</strong> The compiler inserts memoization calls automatically 
            for stable values and expensive computations.
          </li>
          <li>
            <strong>Dependency Inference:</strong> The compiler infers dependency arrays automatically, 
            eliminating stale closure bugs.
          </li>
        </ul>
        <p>
          With the React Compiler, you write normal code without manual memoization:
        </p>
        <ul className="space-y-2">
          <li>No need for React.memo — components are auto-memoized</li>
          <li>No need for useMemo — computations are memoized automatically</li>
          <li>No need for useCallback — functions are stabilized automatically</li>
        </ul>
        <p>
          However, understanding memoization remains important for debugging, working with legacy 
          code, and making informed decisions about when to opt-out.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs & Comparison</h2>

        <h3>Memoization Techniques Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-theme">
                <th className="p-3 text-left">Technique</th>
                <th className="p-3 text-left">Use Case</th>
                <th className="p-3 text-left">Overhead</th>
                <th className="p-3 text-left">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3 font-medium">React.memo</td>
                <td className="p-3">Component re-renders</td>
                <td className="p-3">Shallow prop comparison</td>
                <td className="p-3">Expensive components with stable props</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">useMemo</td>
                <td className="p-3">Expensive computations</td>
                <td className="p-3">Dependency comparison + cache</td>
                <td className="p-3">Filtering, sorting, transformations</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">useCallback</td>
                <td className="p-3">Function references</td>
                <td className="p-3">Dependency comparison + cache</td>
                <td className="p-3">Callbacks to memoized children</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">React Compiler</td>
                <td className="p-3">Automatic memoization</td>
                <td className="p-3">Build-time analysis</td>
                <td className="p-3">New projects, React 19+</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>When NOT to Memoize</h3>
        <ul className="space-y-2">
          <li>
            <strong>Cheap Components:</strong> If a component renders in &lt;1ms, memoization overhead 
            (prop comparison) may cost more than just re-rendering.
          </li>
          <li>
            <strong>Props Always Change:</strong> If the component receives new object/array props on 
            every render (inline objects, unstable references), memo comparison always fails — paying 
            comparison cost for zero benefit.
          </li>
          <li>
            <strong>Simple Primitives:</strong> <code>useMemo(() =&gt; a + b, [a, b])</code> is slower 
            than just computing <code>a + b</code> directly. Only memoize expensive operations.
          </li>
          <li>
            <strong>Root-Level Components:</strong> Components that always re-render when state changes 
            don&apos;t benefit from memo since they&apos;re the source of the re-render.
          </li>
          <li>
            <strong>During Initial Development:</strong> Premature optimization adds complexity. Add 
            memoization after profiling identifies bottlenecks.
          </li>
        </ul>

        <h3>Performance Impact by Scenario</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-theme">
                <th className="p-3 text-left">Scenario</th>
                <th className="p-3 text-left">Without Memo</th>
                <th className="p-3 text-left">With Memo</th>
                <th className="p-3 text-left">Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3 font-medium">List with 1000 items</td>
                <td className="p-3">50-100ms per render</td>
                <td className="p-3">0ms (skipped)</td>
                <td className="p-3 text-green-600">High</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Chart component</td>
                <td className="p-3">30-50ms per render</td>
                <td className="p-3">0ms (skipped)</td>
                <td className="p-3 text-green-600">High</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Simple button</td>
                <td className="p-3">0.1ms per render</td>
                <td className="p-3">0.05ms (comparison)</td>
                <td className="p-3 text-red-600">Negative</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Filter 10000 items</td>
                <td className="p-3">5-10ms per render</td>
                <td className="p-3">0.1ms (cache lookup)</td>
                <td className="p-3 text-green-600">High</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/memoization-react-render.svg"
          alt="Decision flowchart showing when to use memoization: profile first, check if component is expensive, verify props are stable, then apply React.memo or useMemo"
          caption="Memoization decision tree: profile first, then apply memoization only to expensive components with stable props"
        />
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>

        <h3>Profile Before Optimizing</h3>
        <p>
          Never add memoization prematurely. Use React DevTools Profiler to identify actual bottlenecks:
        </p>
        <ul className="space-y-1">
          <li>• Record a session while interacting with your app</li>
          <li>• Look for components that render frequently with long render times</li>
          <li>• Check if props actually change between renders</li>
          <li>• Only memoize components that are measurably expensive</li>
        </ul>

        <h3>Use Stable Props</h3>
        <p>
          Memoization only works when props are stable. Ensure prop stability:
        </p>
        <ul className="space-y-1">
          <li>• Move constant objects outside the component</li>
          <li>• Use useMemo for derived objects</li>
          <li>• Use useCallback for event handlers</li>
          <li>• Avoid inline object literals in JSX</li>
        </ul>

        <h3>Memoize Entire Component Trees</h3>
        <p>
          Memoizing a parent without memoizing children provides limited benefit. For maximum impact:
        </p>
        <ul className="space-y-1">
          <li>• Memoize expensive leaf components first</li>
          <li>• Work up the tree, memoizing parents</li>
          <li>• Ensure all intermediate components pass stable props</li>
          <li>• Use React.memo consistently across the tree</li>
        </ul>

        <h3>Keep Dependency Arrays Correct</h3>
        <p>
          Incorrect dependency arrays cause subtle bugs:
        </p>
        <ul className="space-y-1">
          <li>• Include all values used in the computation</li>
          <li>• Use ESLint plugin exhaustive-deps to catch mistakes</li>
          <li>• Don&apos;t omit dependencies to &quot;optimize&quot; — this causes stale closures</li>
          <li>• For complex dependencies, consider using a ref or restructuring code</li>
        </ul>

        <h3>Consider the React Compiler</h3>
        <p>
          For new projects on React 19+:
        </p>
        <ul className="space-y-1">
          <li>• Enable the React Compiler in Babel/Vite config</li>
          <li>• Write normal code without manual memoization</li>
          <li>• Let the compiler handle optimization automatically</li>
          <li>• Only use manual memoization for edge cases the compiler can&apos;t handle</li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>

        <h3>Inline Objects Break Memo</h3>
        <p>
          Passing inline objects to memoized components defeats the purpose:
        </p>
        <p>
          <strong>Problem:</strong> <code>{'<Chart config={{ theme: "dark" }} />'}</code> creates a 
          new object every render. React.memo comparison always fails.
        </p>
        <p>
          <strong>Solution:</strong> Move constants outside: <code>const CONFIG = {'{'} theme: &quot;dark&quot; {'}'};</code> 
          then <code>{'<Chart config={CONFIG} />'}</code>.
        </p>

        <h3>Inline Callbacks Break Memo</h3>
        <p>
          Passing inline callbacks to memoized children causes unnecessary re-renders:
        </p>
        <p>
          <strong>Problem:</strong> <code>{'<Button onClick={() => save()} />'}</code> creates a new 
          function every render.
        </p>
        <p>
          <strong>Solution:</strong> Use useCallback: <code>const handleSave = useCallback(() =&gt; save(), []);</code>
        </p>

        <h3>Premature Memoization</h3>
        <p>
          Adding memo/useMemo everywhere &quot;just in case&quot; adds code complexity and memory 
          overhead without benefit:
        </p>
        <p>
          <strong>Solution:</strong> Profile first. Only memoize components that are measurably 
          expensive to re-render.
        </p>

        <h3>Missing Dependencies</h3>
        <p>
          Omitting dependencies from useMemo/useCallback creates stale closures — the memoized value 
          uses outdated state:
        </p>
        <p>
          <strong>Problem:</strong> <code>useMemo(() =&gt; items.filter(f), [])</code> — filter never
          updates when f changes.
        </p>
        <p>
          <strong>Solution:</strong> Include all dependencies: <code>useMemo(() =&gt; items.filter(f), [items, f])</code>
        </p>

        <h3>Memoizing Inside Conditional Logic</h3>
        <p>
          Calling useMemo/useCallback inside conditionals or loops violates Rules of Hooks:
        </p>
        <p>
          <strong>Problem:</strong> Hooks must be called in the same order every render.
        </p>
        <p>
          <strong>Solution:</strong> Move memoization outside conditionals. Memoize the computation, 
          then use the result conditionally.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Dashboard with Multiple Charts</h3>
        <p>
          A SaaS dashboard displayed 6 charts that each took 30-50ms to render. Any state change 
          (filter update, date range change) caused all charts to re-render, resulting in 200-300ms 
          of lag.
        </p>
        <p>
          <strong>Solution:</strong> Wrapped each chart component in React.memo. Used useMemo for 
          data transformations. Used useCallback for event handlers.
        </p>
        <p>
          <strong>Results:</strong> Only the affected chart re-rendered on updates. Interaction 
          latency dropped from 250ms to 16ms (one frame).
        </p>

        <h3>E-Commerce Product List</h3>
        <p>
          An e-commerce site displayed 500 products with filtering and sorting. Each filter change 
          re-rendered all 500 product cards, causing noticeable lag.
        </p>
        <p>
          <strong>Solution:</strong> Memoized individual product cards with React.memo. Used useMemo 
          for filtered/sorted product list. Stabilized callback props with useCallback.
        </p>
        <p>
          <strong>Results:</strong> Filter changes became instant. Only products that changed position 
          re-rendered.
        </p>

        <h3>Data Table with 10,000 Rows</h3>
        <p>
          A financial application displayed transaction history with up to 10,000 rows. Sorting or 
          filtering took 500ms+ and blocked the UI.
        </p>
        <p>
          <strong>Solution:</strong> Combined virtualization (react-window) with memoization. 
          Memoized row components. Used useMemo for sorted/filtered data.
        </p>
        <p>
          <strong>Results:</strong> Initial render: 2s → 50ms. Sort/filter: 500ms → instant (cached 
          results). Scroll performance: 60fps.
        </p>

        <h3>Form with Real-Time Validation</h3>
        <p>
          A complex form with 20+ fields performed real-time validation on every keystroke. Validation 
          logic was expensive (regex, API calls for uniqueness checks).
        </p>
        <p>
          <strong>Solution:</strong> Used useMemo for validation results. Cached validation by field 
          value. Only re-validated when field value changed.
        </p>
        <p>
          <strong>Results:</strong> Typing became smooth. Validation only ran when needed.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions & Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is memoization and how does React.memo work?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Memoization is an optimization technique that caches results of expensive computations 
              and returns cached results when inputs repeat. In React, React.memo memoizes components 
              by performing shallow prop comparison and skipping re-render if props haven&apos;t changed.
            </p>
            <p className="mb-3">
              React.memo works by: (1) storing props after first render, (2) on parent re-render, 
              comparing new props with stored props using ===, (3) if all props equal, skip re-render 
              and reuse previous output, (4) if any prop differs, re-render and update stored props.
            </p>
            <p>
              Shallow comparison means comparing references, not deep equality. New object literals 
              always differ even with identical contents.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What's the difference between useMemo and useCallback?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Both useMemo and useCallback memoize values based on dependencies, but they serve 
              different purposes:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>useMemo:</strong> Memoizes the result of a computation. Returns 
                <code>compute()</code> result. Used for expensive calculations like filtering, 
                sorting, or transformations.
              </li>
              <li>
                <strong>useCallback:</strong> Memoizes a function reference. Returns the function 
                itself. Used for stabilizing callbacks passed to memoized children or used in effect 
                dependencies.
              </li>
            </ul>
            <p>
              useCallback(fn, deps) is equivalent to useMemo(() =&gt; fn, deps) — it&apos;s syntactic sugar 
              for memoizing functions.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: When should you NOT use memoization?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Cheap components:</strong> If render time is &lt;1ms, memoization overhead 
                exceeds benefit.
              </li>
              <li>
                <strong>Props always change:</strong> If props change every render anyway, memo 
                comparison always fails — paying cost for zero benefit.
              </li>
              <li>
                <strong>Simple primitives:</strong> <code>useMemo(() =&gt; a + b, [a, b])</code> is 
                slower than computing directly.
              </li>
              <li>
                <strong>Root components:</strong> Components that always re-render when state changes 
                don't benefit from memo.
              </li>
              <li>
                <strong>During initial development:</strong> Add memoization after profiling 
                identifies bottlenecks, not prematurely.
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: Why do inline objects break React.memo?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Inline objects break React.memo because JavaScript compares objects by reference, not 
              by value. Each render creates a new object in memory:
            </p>
            <p className="mb-3">
              <code>{'<Chart config={{ theme: "dark" }} />'}</code> — The <code>{'{ theme: "dark" }'}</code> 
              object literal creates a new object every render. Even though contents are identical, 
              the reference differs. React.memo shallow comparison sees different references and 
              triggers re-render.
            </p>
            <p>
              Solution: Move constants outside component or use useMemo to stabilize the reference.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: What is the React Compiler and how does it affect memoization?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              The React Compiler (React 19+) automatically memoizes components and hooks at build 
              time. It analyzes code to identify stable values and inserts memoization automatically.
            </p>
            <p className="mb-3">
              Impact on manual memoization:
            </p>
            <ul className="space-y-2 mb-3">
              <li>• No need for React.memo — components auto-memoized</li>
              <li>• No need for useMemo — computations auto-memoized</li>
              <li>• No need for useCallback — functions auto-stabilized</li>
              <li>• Dependency arrays inferred automatically — no stale closures</li>
            </ul>
            <p>
              Understanding memoization remains important for debugging, legacy code, and edge cases 
              the compiler can't handle.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: How do you debug unnecessary re-renders?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>React DevTools Profiler:</strong> Record a session, identify components 
                rendering frequently with long render times.
              </li>
              <li>
                <strong>Highlight Updates:</strong> In React DevTools settings, enable &quot;Highlight 
                updates when components render&quot; to visually see re-renders.
              </li>
              <li>
                <strong>Console Logging:</strong> Add console.log in component body to see render 
                frequency (remove after debugging).
              </li>
              <li>
                <strong>why-did-you-render:</strong> Library that logs when components re-render with 
                same props, helping identify unnecessary renders.
              </li>
            </ul>
            <p>
              After identifying bottlenecks, apply targeted memoization and verify improvement.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References
          ============================================================ */}
      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://react.dev/reference/react/memo" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React Docs — React.memo
            </a> — Official documentation for React.memo.
          </li>
          <li>
            <a href="https://react.dev/reference/react/useMemo" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React Docs — useMemo
            </a> — Official documentation for useMemo.
          </li>
          <li>
            <a href="https://react.dev/reference/react/useCallback" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React Docs — useCallback
            </a> — Official documentation for useCallback.
          </li>
          <li>
            <a href="https://react.dev/learn/react-compiler" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React Compiler Documentation
            </a> — Guide to the React Compiler (React 19+).
          </li>
          <li>
            <a href="https://epicreact.dev/memoization-and-react-memo/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Epic React — Memoization
            </a> — Deep dive on memoization best practices.
          </li>
          <li>
            <a href="https://kentcdodds.com/blog/usememo-and-usecallback" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Kent C. Dodds — useMemo and useCallback
            </a> — Practical guide on when and how to use memoization hooks.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
