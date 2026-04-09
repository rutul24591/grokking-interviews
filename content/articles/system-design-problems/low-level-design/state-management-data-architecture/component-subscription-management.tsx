"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-component-subscription-management",
  title: "Manage Component Subscriptions to Prevent Re-renders",
  description:
    "Production-grade subscription management — selective subscriptions, equality functions, subscription batching, and preventing unnecessary re-renders in large-scale apps.",
  category: "low-level-design",
  subcategory: "state-management-data-architecture",
  slug: "component-subscription-management",
  wordCount: 3400,
  readingTime: 20,
  lastUpdated: "2026-04-08",
  tags: ["lld", "subscriptions", "re-render-optimization", "selectors", "zustand", "react-performance"],
  relatedTopics: ["derived-computed-state-performance", "scalable-global-state-architecture"],
};

export default function ComponentSubscriptionManagementArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          In a large React app with 500+ components subscribing to global state,
          a single state change can trigger cascading re-renders across unrelated
          components. The root cause: components subscribe to broad state slices
          (entire store) instead of specific fields, and selectors return new
          references on every call, failing equality checks. We need a subscription
          management system that ensures components subscribe only to the exact
          data they need, use efficient equality comparisons, and batch
          subscription notifications to prevent redundant re-renders.
        </p>
        <p><strong>Assumptions:</strong> React 19+, Zustand store, 500+ components, frequent state updates.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Selective Subscriptions:</strong> Components subscribe to specific state slices via selectors — not the entire store.</li>
          <li><strong>Equality Functions:</strong> Configurable equality checks (Object.is, shallow, deep) per subscription based on data type.</li>
          <li><strong>Subscription Batching:</strong> Multiple state changes in one event loop cycle trigger one notification cycle, not N cycles.</li>
          <li><strong>Subscription Cleanup:</strong> Unsubscribe on component unmount — no memory leaks from orphaned subscriptions.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Notification Cost:</strong> Subscription notification is O(k) where k is matching subscribers, not O(n) where n is all components.</li>
          <li><strong>Selector Cost:</strong> Each selector runs once per state change — no redundant selector evaluations.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Selector returns new object every time (e.g., wrapping state.user in a new object) — Object.is always fails, component re-renders unnecessarily.</li>
          <li>Component subscribes to parent&apos;s state slice — child component changes trigger parent&apos;s subscription unnecessarily.</li>
          <li>Rapid state changes (100 in 1 second) — each triggers notification cycle, causing jank.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          Each component subscribes via a selector function that extracts its
          needed data slice. The store compares the selector result to the
          previous result using a configurable equality function. If equal, skip
          notification. If different, notify the component. Notifications are
          batched via microtask queue — multiple state changes in one cycle coalesce into one notification. Selectors return stable references (state.user directly, not a new object) to maximize equality hit rate.
        </p>
      </section>

      <section>
        <h2>System Design</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Modules</h3>
        <p>Six modules:</p>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Subscription Registry (<code>lib/subscription-registry.ts</code>)</h4>
          <p>Manages all active subscriptions: add(selector, equalityFn, listener), remove(subscriptionId). Iterates only active subscriptions on notify.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Equality Function Library (<code>lib/equality-fns.ts</code>)</h4>
          <p>Pre-built equality functions: referenceEqual (Object.is), shallowEqual (top-level keys), deepEqual (recursive). Engineers choose per subscription.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Notification Batcher (<code>lib/notification-batcher.ts</code>)</h4>
          <p>Queues subscription notifications via Promise.resolve().then(). Coalesces duplicate notifications for the same subscription in one batch.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Selector Validator (<code>lib/selector-validator.ts</code>)</h4>
          <p>Development tool that detects selectors returning new references on every call. Logs warning with selector source location.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Subscription Debugger (<code>lib/subscription-debugger.ts</code>)</h4>
          <p>DevTools panel showing active subscriptions, their selectors, last notification time, and re-render count. Identifies hot subscriptions.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. React Integration Hook (<code>hooks/useSubscription.ts</code>)</h4>
          <p>useSyncExternalStore-based hook. Subscribes with selector + equalityFn, triggers re-render on notification, unsubscribes on unmount.</p>
        </div>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/component-subscription-management-architecture.svg"
          alt="Subscription management flow showing selective subscriptions, equality checks, and batched notifications"
          caption="Component Subscription Management Flow"
        />
      </section>

      <section>
        <h2>Data Flow</h2>
        <ol className="space-y-2 list-decimal list-inside">
          <li>State changes via store.setState().</li>
          <li>Store iterates through subscription registry. For each subscription: run selector with new state, compare to cached result via equalityFn.</li>
          <li>If equal: skip notification. If different: queue notification for subscriber.</li>
          <li>After all subscriptions evaluated, batcher flushes queued notifications via microtask.</li>
          <li>Notified components schedule re-renders. React batches re-renders in same event loop cycle.</li>
        </ol>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-3">
          <li><strong>Selector returns new reference:</strong> Selector validator detects selectors returning new objects/arrays every call. Logs warning: &quot;Selector returns unstable reference — consider returning state slice directly.&quot;</li>
          <li><strong>Notification storm:</strong> 100 state changes in 1 second, each triggering 500 subscription checks = 50,000 checks/second. Batcher coalesces notifications — same subscriber notified once per batch cycle (max 60 batches/sec aligned with frame rate).</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">📦 Switch to the Example Tab</h3>
          <p>Complete implementation: subscription registry, equality function library, notification batcher, React hook, selector validator, and subscription debugger.</p>
        </div>
      </section>

      <section>
        <h2>Performance</h2>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b border-theme"><th className="p-2 text-left">Operation</th><th className="p-2 text-left">Time</th><th className="p-2 text-left">Space</th></tr></thead>
            <tbody className="divide-y divide-theme">
              <tr><td className="p-2">Subscription check (k subs)</td><td className="p-2">O(k) — k selector calls + equality checks</td><td className="p-2">O(k) — cached results</td></tr>
              <tr><td className="p-2">Batched notification</td><td className="p-2">O(m) — m changed subscriptions</td><td className="p-2">O(m) — notification queue</td></tr>
              <tr><td className="p-2">Selector validation</td><td className="p-2">O(1) per call — reference check</td><td className="p-2">O(1)</td></tr>
            </tbody>
          </table>
        </div>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimizations</h3>
        <ul className="space-y-2">
          <li><strong>Stable selector references:</strong> Define selectors outside components (module scope) to prevent recreation on every render. Selectors are pure functions — no closure over component props.</li>
          <li><strong>Equality function selection:</strong> Use Object.is for primitives (fastest), shallowEqual for flat objects, deepEqual only for nested data with infrequent changes. Default to Object.is — it catches 95% of cases.</li>
        </ul>
      </section>

      <section>
        <h2>Security & Testing</h2>
        <p>Selectors are pure functions — no side effects, no external state access. Test: subscription notification fires only when selector result changes, batching coalesces duplicate notifications, unmount cleans up subscription, selector validator catches unstable references.</p>
      </section>

      <section>
        <h2>Interview Insights</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes</h3>
        <ul className="space-y-3">
          <li><strong>Subscribing to entire store:</strong> Components subscribe to whole store and extract needed fields in render. Every state change re-renders every component. Fix: subscribe to specific slices via selectors.</li>
          <li><strong>Inline selectors in components:</strong> Creating selectors inline that return new objects every render always triggers re-render. Fix: define selector outside component or use shallow equality.</li>
          <li><strong>No batching:</strong> Each state change triggers immediate notification. Multiple changes in one event handler cause multiple re-renders. Fix: batch notifications via microtask queue.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Follow-up Questions</h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you debug which component is re-rendering unnecessarily?</p>
            <p className="mt-2 text-sm">
              A: Use React DevTools Profiler to identify re-rendering components and
              their &quot;Why did this render?&quot; reason. If it&apos;s a state subscription,
              check the selector — is it returning a new reference? Use the
              subscription debugger to see which subscriptions are notifying most
              frequently. Add logging to the equality function to track when
              comparisons fail and why.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li><a href="https://react.dev/reference/react/useSyncExternalStore" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">React Docs — useSyncExternalStore</a></li>
          <li><a href="https://zustand.docs.pmnd.rs/guides/prevent-rerenders-with-selectors" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Zustand — Prevent Rerenders with Selectors</a></li>
          <li><a href="https://react.dev/learn/render-and-commit" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">React Docs — Render and Commit</a></li>
          <li><a href="https://beta.reactjs.org/learn/keeping-components-pure" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">React Docs — Keeping Components Pure</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
