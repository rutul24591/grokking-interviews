"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-component-design-component-lifecycle-optimization",
  title: "Component Lifecycle Optimization",
  description: "Staff-level guide to component lifecycle optimization: mounting, updating, unmounting phases, memoization strategies, effect cleanup, and performance patterns for React applications.",
  category: "frontend",
  subcategory: "component-design",
  slug: "component-lifecycle-optimization",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-31",
  tags: ["frontend", "component-design", "lifecycle", "performance", "memoization", "react-hooks", "optimization"],
  relatedTopics: ["react-hooks", "performance-optimization", "smart-vs-dumb-components", "react-rendering"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Component Lifecycle Optimization</strong> is the practice of understanding and optimizing each phase of a component's lifecycle: mounting (creation), updating (re-rendering), and unmounting (destruction). Each phase has opportunities for optimization: avoiding unnecessary renders during mounting, minimizing work during updates, and cleaning up resources during unmounting. Proper lifecycle optimization ensures applications remain performant as they scale.
        </p>
        <p>
          Component lifecycle addresses a fundamental challenge: how do we ensure components only do work when necessary? Without optimization, components re-render when props haven't changed, effects run when dependencies are stable, and resources leak when components unmount. These issues compound across large applications, causing noticeable performance degradation.
        </p>
        <p>
          For staff/principal engineers, lifecycle optimization is essential for building performant applications. It requires understanding React's rendering model, knowing when to apply optimization patterns, and measuring the impact of optimizations. The goal is not to optimize everything, but to optimize where it matters.
        </p>
        <p>
          The lifecycle has three phases. <strong>Mounting</strong> is when the component is created and inserted into the DOM. <strong>Updating</strong> is when the component re-renders due to prop or state changes. <strong>Unmounting</strong> is when the component is removed from the DOM. Each phase has specific optimization opportunities.
        </p>
        <p>
          The business impact of lifecycle optimization is significant. Optimized applications have faster initial load, smoother interactions, and better battery life on mobile. Users perceive the application as faster and more responsive. Performance directly impacts user retention and conversion rates.
        </p>
        <p>
          In system design interviews, lifecycle optimization demonstrates understanding of React's rendering model, performance patterns, and the trade-offs of different optimization strategies. It shows you can build applications that scale without performance degradation.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/component-design/lifecycle-phases.svg"
          alt="Component lifecycle phases showing Mount (initial render, lazy load, useEffect), Update (triggers, memoization, useEffect), and Unmount (cleanup, cancel timers, remove listeners)"
          caption="Lifecycle phases — mount: create and insert, update: re-render on changes, unmount: remove and cleanup. Each phase has optimization opportunities"
        />

        <h3>Mounting Phase</h3>
        <p>
          The mounting phase is when a component is created and inserted into the DOM. This happens on initial render. Optimization opportunities include lazy loading components to reduce initial bundle size, deferring non-critical work until after the initial paint, and avoiding unnecessary computations during mount.
        </p>
        <p>
          React.lazy and Suspense enable code splitting at the component level. Components are loaded on demand when they're rendered. This reduces initial bundle size and speeds up initial load. Use lazy loading for components that aren't needed immediately.
        </p>
        <p>
          Effects with empty dependency arrays run after mount. Use this for initialization that doesn't block rendering. Defer expensive computations until after the initial paint using setTimeout or requestAnimationFrame.
        </p>

        <h3>Updating Phase</h3>
        <p>
          The updating phase is when a component re-renders due to prop or state changes. This is where most optimization happens. Optimization opportunities include preventing unnecessary renders with memoization, minimizing effect executions with proper dependencies, and batching state updates to reduce render count.
        </p>
        <p>
          React.memo prevents re-renders when props haven't changed. It shallow compares props and skips rendering if they're equal. Use React.memo for components that render frequently with stable props. Don't overuse it; the comparison has a cost.
        </p>
        <p>
          useMemo and useCallback memoize values and functions. They prevent expensive computations and function recreations. Use them when the computation is expensive or when stable references are needed for dependency arrays. Don't memoize everything; measure first.
        </p>

        <h3>Unmounting Phase</h3>
        <p>
          The unmounting phase is when a component is removed from the DOM. Optimization opportunities include cleaning up resources to prevent memory leaks, canceling pending requests to avoid state updates on unmounted components, and removing event listeners to prevent memory leaks.
        </p>
        <p>
          Effect cleanup functions run on unmount. Use them to clean up subscriptions, cancel timers, and remove event listeners. This prevents memory leaks and errors from updating unmounted components. Always clean up resources in effects.
        </p>
        <p>
          AbortController enables canceling pending fetch requests. Create an AbortController in the effect, pass the signal to fetch, and abort in the cleanup. This prevents state updates from completing after the component unmounts.
        </p>

        <h3>Render Optimization Patterns</h3>
        <p>
          Several patterns optimize rendering. <strong>Component memoization</strong> with React.memo prevents unnecessary re-renders. <strong>Value memoization</strong> with useMemo prevents expensive recalculations. <strong>Function memoization</strong> with useCallback prevents function recreations. <strong>State batching</strong> combines multiple state updates into a single render.
        </p>
        <p>
          These patterns have costs. Memoization uses memory to store cached values. Comparison has CPU cost. Don't optimize prematurely. Measure to identify bottlenecks, then apply targeted optimizations.
        </p>
        <p>
          React 18 introduced automatic batching. Multiple state updates in event handlers, timeouts, and effects are batched into a single render. This reduces render count without code changes. Use the new flushSync when you need synchronous updates.
        </p>

        <h3>Effect Optimization</h3>
        <p>
          Effects run after renders. Optimizing effects reduces work after renders. <strong>Dependency arrays</strong> control when effects run. Include all dependencies to avoid stale closures. Exclude stable values to avoid unnecessary runs. <strong>Cleanup functions</strong> run before the effect runs again and on unmount. Use them to prevent memory leaks.
        </p>
        <p>
          Effects should be idempotent. Running an effect multiple times should produce the same result. This enables React to run effects more aggressively in the future. Don't rely on effects running exactly once.
        </p>
        <p>
          Split effects by concern. Multiple small effects are easier to optimize than one large effect. Each effect can have its own dependencies and cleanup. This prevents unrelated code from running when only some dependencies change.
        </p>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          Implementing lifecycle optimization requires understanding React's rendering model and applying patterns strategically.
        </p>

        <h3>Rendering Model</h3>
        <p>
          React renders components when state or props change. Rendering creates a new virtual DOM tree. React compares the new tree to the old tree (diffing). It applies minimal changes to the real DOM (reconciliation). This process is fast but not free.
        </p>
        <p>
          Optimization reduces the cost of rendering. Memoization skips rendering entirely when props haven't changed. Smaller components have smaller trees to diff. Stable references prevent child components from re-rendering unnecessarily.
        </p>
        <p>
          React 18 introduced concurrent rendering. React can interrupt rendering to handle high-priority updates. This improves responsiveness. Use startTransition for non-urgent updates. Use useDeferredValue for deferring re-renders.
        </p>

        <h3>Memoization Strategy</h3>
        <p>
          Memoization trades memory for computation. Cached values use memory but prevent recalculation. Apply memoization strategically. Memoize expensive computations with useMemo. Memoize functions passed to child components with useCallback. Memoize components that render frequently with React.memo.
        </p>
        <p>
          Don't memoize everything. Memoization has overhead. The comparison cost might exceed the computation cost. Measure to identify what needs memoization. Profile before and after to verify improvement.
        </p>
        <p>
          Memoization requires stable dependencies. If dependencies change every render, memoization is useless. Ensure dependencies are stable. Use useMemo for dependency values if needed.
        </p>

        <h3>Effect Strategy</h3>
        <p>
          Effects should be minimal and focused. Each effect should do one thing. This makes dependencies clear and cleanup simple. Split effects by concern. One effect for subscriptions, one for timers, one for DOM manipulation.
        </p>
        <p>
          Dependencies should be complete. Include all values used in the effect. Incomplete dependencies cause stale closures. Use the exhaustive-deps ESLint rule to catch missing dependencies.
        </p>
        <p>
          Cleanup is mandatory for resources. Subscriptions, timers, and event listeners must be cleaned up. Return a cleanup function from effects. The cleanup runs before the effect runs again and on unmount.
        </p>

        <h3>Performance Measurement</h3>
        <p>
          Measure before optimizing. React DevTools Profiler shows render times and frequencies. Identify components that render frequently or slowly. Focus optimization efforts there.
        </p>
        <p>
          Use performance marks to measure specific operations. performance.mark before and after. performance.measure to calculate duration. This identifies bottlenecks in your code.
        </p>
        <p>
          Monitor in production. Real User Monitoring (RUM) tools capture actual user performance. Identify performance regressions quickly. Set performance budgets and alert when exceeded.
        </p>
      </section>

      <section>
        <h2>Trade-offs & Comparison</h2>
        <p>
          Lifecycle optimization involves trade-offs between performance, complexity, and memory.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/component-design/memoization-strategies.svg"
          alt="Memoization strategies comparison: React.memo for components, useMemo for values, useCallback for functions with when to use each"
          caption="Memoization strategies — React.memo prevents re-renders, useMemo memoizes computations, useCallback memoizes function refs. Don't memoize everything, measure first"
        />

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-theme">
              <th className="p-3 text-left">Pattern</th>
              <th className="p-3 text-left">Performance</th>
              <th className="p-3 text-left">Complexity</th>
              <th className="p-3 text-left">Memory</th>
              <th className="p-3 text-left">Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">React.memo</td>
              <td className="p-3">High (skips renders)</td>
              <td className="p-3">Low</td>
              <td className="p-3">Low</td>
              <td className="p-3">Frequently rendered components</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">useMemo</td>
              <td className="p-3">High (skips computation)</td>
              <td className="p-3">Medium</td>
              <td className="p-3">Medium</td>
              <td className="p-3">Expensive computations</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">useCallback</td>
              <td className="p-3">Medium (stable refs)</td>
              <td className="p-3">Medium</td>
              <td className="p-3">Low</td>
              <td className="p-3">Functions in dependency arrays</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Code Splitting</td>
              <td className="p-3">High (smaller bundles)</td>
              <td className="p-3">Medium</td>
              <td className="p-3">Low</td>
              <td className="p-3">Initial load optimization</td>
            </tr>
          </tbody>
        </table>
        <p>
          The staff-level insight is that optimization should be data-driven. Measure to identify bottlenecks. Apply targeted optimizations. Verify improvement with measurements. Don't optimize based on intuition alone.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Profile before optimizing. Use React DevTools Profiler to identify slow components. Focus optimization efforts where they matter. Don't optimize components that render infrequently or quickly.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/component-design/effect-cleanup-patterns.svg"
          alt="Effect cleanup patterns showing timer cleanup with clearInterval, event listener cleanup, fetch abort with AbortController, and subscription cleanup"
          caption="Effect cleanup — always cleanup timers, event listeners, subscriptions, and pending requests. Return cleanup function from useEffect to prevent memory leaks"
        />

        <p>
          Use React.memo for components that render frequently with stable props. Don't use it for components that render once or have changing props. The comparison cost exceeds the benefit.
        </p>
        <p>
          Memoize expensive computations with useMemo. Define expensive as noticeable to users or called frequently. Don't memoize simple computations. The memoization overhead exceeds the computation cost.
        </p>
        <p>
          Always clean up effects. Return cleanup functions from effects. Cancel timers, remove event listeners, and abort fetch requests. This prevents memory leaks and errors.
        </p>
        <p>
          Split effects by concern. Multiple small effects are easier to optimize than one large effect. Each effect has clear dependencies and cleanup. This prevents unrelated code from running unnecessarily.
        </p>
        <p>
          Use React 18 features for concurrent rendering. Use startTransition for non-urgent updates. Use useDeferredValue for deferring re-renders. These features improve responsiveness without manual optimization.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Over-memoizing creates complexity without benefit. Memoizing everything adds overhead and makes code harder to understand. Memoize selectively based on measurements.
        </p>
        <p>
          Incomplete effect dependencies cause stale closures. Effects capture old values when dependencies are missing. Use the exhaustive-deps ESLint rule. Include all values used in the effect.
        </p>
        <p>
          Not cleaning up effects causes memory leaks. Subscriptions, timers, and event listeners accumulate. Always return cleanup functions from effects.
        </p>
        <p>
          Updating state on unmounted components causes errors. Effects that complete after unmount try to update state. Use AbortController for fetch. Check if component is mounted before updating.
        </p>
        <p>
          Optimizing without measuring wastes effort. You might optimize the wrong thing. Profile first. Identify actual bottlenecks. Verify improvements with measurements.
        </p>
        <p>
          Creating objects or arrays in JSX causes unnecessary child re-renders. Even with React.memo, children re-render when props are new objects. Memoize objects and arrays with useMemo.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce: Product List Performance</h3>
        <p>
          An e-commerce site had a product list with 100+ items. Scrolling was laggy. The solution was React.memo for product items, useMemo for filtered/sorted products, and virtualization for rendering only visible items.
        </p>
        <p>
          Results included 60 FPS scrolling, reduced memory usage from virtualization, and faster initial render from code splitting. The optimized list handled thousands of products smoothly.
        </p>

        <h3>Dashboard: Real-Time Data Updates</h3>
        <p>
          A dashboard received real-time data updates every second. The entire dashboard re-rendered on each update. The solution was splitting components by data source, memoizing components that didn't change, and batching updates.
        </p>
        <p>
          Results included smooth updates without lag, reduced CPU usage from targeted re-renders, and better battery life on mobile. Only components with changed data re-rendered.
        </p>

        <h3>Form: Complex Validation</h3>
        <p>
          A form had complex validation that ran on every keystroke. Validation was slow and blocked typing. The solution was debouncing validation, memoizing validation results, and running validation in a web worker.
        </p>
        <p>
          Results included instant typing response, validation running in background, and no UI blocking. The form felt responsive even with complex validation rules.
        </p>

        <h3>Mobile: Memory Leak Prevention</h3>
        <p>
          A mobile app had memory issues after navigating between screens. The solution was proper effect cleanup for all subscriptions, aborting pending fetches on unmount, and removing event listeners.
        </p>
        <p>
          Results included stable memory usage over time, no crashes from memory pressure, and better app store ratings. Proper cleanup prevented accumulation of resources.
        </p>
      </section>

      <section>
        <h2>Interview Questions & Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What are the phases of the component lifecycle?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Mounting is when the component is created and inserted into the DOM. Updating is when the component re-renders due to prop or state changes. Unmounting is when the component is removed from the DOM.
            </p>
            <p>
              Each phase has optimization opportunities. Mounting: lazy loading, deferring work. Updating: memoization, batching. Unmounting: cleanup, canceling requests.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: When should you use React.memo, useMemo, and useCallback?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              React.memo is for components that render frequently with stable props. It prevents re-renders when props haven't changed. useMemo is for expensive computations. It prevents recalculation when dependencies are stable. useCallback is for functions passed to child components or used in dependency arrays. It prevents function recreation.
            </p>
            <p>
              Don't use these everywhere. They have overhead. Measure to identify what needs memoization.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How do you prevent memory leaks in React components?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Clean up effects by returning cleanup functions. Cancel timers with clearTimeout. Remove event listeners. Unsubscribe from subscriptions. Abort pending fetch requests with AbortController. Check if component is mounted before updating state.
            </p>
            <p>
              Memory leaks accumulate over time. They're especially problematic in SPAs where users navigate without refreshing. Proper cleanup prevents accumulation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: What are common effect dependency mistakes?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Incomplete dependencies cause stale closures. Effects capture old values when dependencies are missing. Include all values used in the effect. Unstable dependencies cause unnecessary runs. Objects and arrays created in render are new every time. Memoize them with useMemo.
            </p>
            <p>
              Use the exhaustive-deps ESLint rule. It catches missing dependencies. Don't disable it without understanding the consequences.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: How do you optimize component rendering performance?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Profile first with React DevTools Profiler. Identify slow or frequently rendered components. Apply React.memo to components with stable props. Use useMemo for expensive computations. Use useCallback for stable function references. Split large components into smaller ones. Use code splitting for lazy loading.
            </p>
            <p>
              Measure before and after to verify improvement. Don't optimize without measuring.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: What are React 18's performance features?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Automatic batching combines multiple state updates into one render. This happens in event handlers, timeouts, and effects. startTransition marks updates as non-urgent. React can interrupt them for urgent updates. useDeferredValue defers re-rendering parts of the UI. Concurrent rendering allows interrupting renders for high-priority updates.
            </p>
            <p>
              These features improve responsiveness without manual optimization. Use them for better out-of-the-box performance.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://react.dev/learn/render-and-commit" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React: Render and Commit
            </a> — Official React documentation on rendering.
          </li>
          <li>
            <a href="https://react.dev/reference/react/memo" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React: memo
            </a> — React.memo documentation.
          </li>
          <li>
            <a href="https://react.dev/reference/react/useMemo" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React: useMemo
            </a> — useMemo documentation.
          </li>
          <li>
            <a href="https://react.dev/reference/react/useCallback" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React: useCallback
            </a> — useCallback documentation.
          </li>
          <li>
            <a href="https://react.dev/reference/react/useEffect" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React: useEffect
            </a> — useEffect documentation with cleanup.
          </li>
          <li>
            <a href="https://react.dev/reference/react/useTransition" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React: useTransition
            </a> — React 18 concurrent features.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
