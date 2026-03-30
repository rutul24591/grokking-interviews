"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-memory-management-event-listener-cleanup",
  title: "Event Listener Cleanup",
  description: "Comprehensive guide to event listener cleanup in React/Next.js SPAs: ownership patterns, delegation strategies, teardown guardrails, and preventing memory retention across navigation.",
  category: "frontend",
  subcategory: "memory-management",
  slug: "event-listener-cleanup",
  wordCount: 6100,
  readingTime: 25,
  lastUpdated: "2026-03-30",
  tags: ["frontend", "memory", "event-listeners", "cleanup", "react", "performance", "spa", "memory-leaks"],
  relatedTopics: ["memory-leaks-prevention", "timer-cleanup", "dom-reference-management", "garbage-collection-understanding"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Event listener cleanup</strong> is the practice of ensuring that DOM and application event subscriptions are reliably removed when they are no longer needed. In long-lived SPAs, missing cleanup is one of the most common sources of memory retention because listeners often hold references to callbacks, and callbacks often hold references to closures and state.
        </p>
        <p>
          In a traditional multi-page app, navigation naturally tears down the page and releases listeners. In a React/Next.js SPA, views mount and unmount without a full reload. That makes cleanup a correctness and reliability concern: leaks from listeners accumulate across route transitions, and performance degradation can appear only after many interactions.
        </p>
        <p>
          Listener hygiene is also a performance issue even without leaks: large numbers of listeners increase dispatch overhead, can trigger more work per event (especially for high-frequency events like scroll and pointer move), and can retain references to DOM nodes that would otherwise be eligible for collection.
        </p>
        <p>
          The business impact of listener leaks is often hidden until it&apos;s too late:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Progressive Degradation:</strong> Each navigation adds listeners. After 50 page views, you might have 500+ orphaned listeners firing on every scroll event.
          </li>
          <li>
            <strong>Memory Retention:</strong> Listeners keep callbacks alive, callbacks keep closures alive, closures keep entire component trees alive. A single forgotten listener can retain megabytes of state.
          </li>
          <li>
            <strong>CPU Overhead:</strong> Even if memory is bounded, excessive listeners increase event dispatch cost. Scroll handlers that should take 1ms might take 10ms with 100 orphaned listeners.
          </li>
          <li>
            <strong>Hard to Debug:</strong> Listener leaks are often intermittent. They manifest after long sessions, making them hard to reproduce in development.
          </li>
        </ul>
        <p>
          In system design interviews, event listener cleanup demonstrates understanding of event systems, closure semantics, lifecycle management, and the trade-offs between convenience and memory safety. It shows you think about application behavior over time, not just initial render.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/memory-management/event-listener-cleanup-retention.svg"
          alt="Architecture diagram showing how listener registries retain callbacks and closures across SPA navigation"
          caption="Architecture view — listener registries keep callbacks alive; callbacks keep closure state alive; missing teardown turns view-lifetime state into session-lifetime retention."
        />

        <h3>Why Listeners Retain Memory</h3>
        <p>
          Event systems maintain internal registries that map targets to listeners. If a listener remains registered, the runtime treats it as reachable: the registry references the callback, and the callback references its closure (captured state, sometimes including large data structures or DOM handles). This is how "just one listener" can retain a surprisingly large object graph.
        </p>
        <p>
          The retention chain looks like this:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Event Target (window, document, element):</strong> Lives for the session or until explicitly removed.
          </li>
          <li>
            <strong>Listener Registry:</strong> Internal browser/JS registry mapping targets to handler lists.
          </li>
          <li>
            <strong>Callback Function:</strong> The handler function you passed to addEventListener.
          </li>
          <li>
            <strong>Closure Scope:</strong> Variables captured when the callback was created — this can include component state, props, DOM references, or other large objects.
          </li>
        </ul>
        <p>
          Breaking any link in this chain allows GC to collect the downstream objects. The most practical break point is the listener registry — remove the listener, and everything it references becomes eligible for collection (assuming no other references exist).
        </p>

        <h3>Ownership and Lifetime</h3>
        <p>
          Every listener must have an owner that defines when it is attached and when it is removed. In SPAs, useful lifetime boundaries include:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Component Lifetime:</strong> Listener exists while component is mounted. Attach in useEffect, detach in cleanup.
          </li>
          <li>
            <strong>Route Lifetime:</strong> Listener exists while route is active. Attach on route enter, detach on route leave.
          </li>
          <li>
            <strong>Feature Activation Lifetime:</strong> Listener exists while feature is enabled (e.g., real-time mode, drag-and-drop mode).
          </li>
          <li>
            <strong>Session Lifetime:</strong> Listener exists for the whole tab session. High risk — requires explicit justification and bounds.
          </li>
        </ul>
        <p>
          Listeners that implicitly become "session lifetime" are high risk unless they are intentionally global and tightly bounded in behavior. The most common leak pattern is a component-scoped listener that accidentally becomes session-scoped due to missing cleanup.
        </p>

        <h3>Delegation vs. Per-Node Listeners</h3>
        <p>
          <strong>Event delegation</strong> reduces listener count by attaching a small number of listeners at a common ancestor and routing events based on event targets. Delegation can reduce memory and simplify teardown, but it can increase logic complexity and create subtle ordering issues. For large lists and dynamic UIs, delegation is often the more scalable default.
        </p>
        <p>
          Comparison:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Per-Node:</strong> 1000 list items = 1000 listeners. Each listener must be cleaned up individually. High retention surface.
          </li>
          <li>
            <strong>Delegation:</strong> 1000 list items = 1 listener on parent. Single cleanup point. Lower retention surface.
          </li>
        </ul>
        <p>
          Delegation is particularly valuable for dynamic content where items are frequently added/removed. Instead of managing listener lifecycle for each item, you manage one listener for the container.
        </p>

        <h3>High-Frequency Events</h3>
        <p>
          Events like scroll, resize, pointer move, and intersection callbacks are frequent and can amplify both CPU and memory churn. Listener strategy here should prioritize:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Minimizing Allocations:</strong> Avoid creating objects inside high-frequency handlers. Reuse objects or use primitive values.
          </li>
          <li>
            <strong>Avoiding Large Captures:</strong> Don&apos;t capture large state in closures for high-frequency handlers. Use refs or look up state at handling time.
          </li>
          <li>
            <strong>Throttling/Debouncing:</strong> Use throttling to reduce handler invocation frequency for scroll/resize events.
          </li>
          <li>
            <strong>Passive Listeners:</strong> Use {`{ passive: true }`} for scroll/touch listeners to allow browser optimization.
          </li>
          <li>
            <strong>Reliable Teardown:</strong> High-frequency listeners have higher impact if leaked. Ensure cleanup is bulletproof.
          </li>
        </ul>

        <h3>The addEventListener/removeEventListener Contract</h3>
        <p>
          Understanding the exact contract is crucial for reliable cleanup:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Same Function Reference:</strong> You must pass the exact same function reference to removeEventListener that you passed to addEventListener. Anonymous functions cannot be removed.
          </li>
          <li>
            <strong>Same Options:</strong> If you used {`{ capture: true }`} or {`{ passive: true }`}, you must use the same options for removal.
          </li>
          <li>
            <strong>Same Target:</strong> You must call removeEventListener on the same target element that you called addEventListener on.
          </li>
        </ul>
        <p>
          This is why storing handler references is essential for cleanup. Common patterns include storing in useRef, using useCallback for stable references, or using a handler registry utility.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture & Flow</h2>
        <p>
          A scalable listener architecture has three goals: (1) predictable ownership, (2) minimal listener cardinality, and (3) reliable teardown.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/memory-management/event-listener-cleanup-patterns.svg"
          alt="Performance trade-offs diagram comparing delegation, per-node listeners, and global listeners"
          caption="Performance trade-offs — delegation reduces listener count and retention edges, while per-node listeners can be simpler but scale poorly in dynamic UIs."
        />

        <h3>Attach: Narrowest Scope Principle</h3>
        <p>
          Attach listeners at the narrowest scope that achieves the behavioral requirement. For view-specific behaviors, attach when the view becomes active. For global behaviors (for example, app-wide keyboard shortcuts), centralize attachment in a top-level boundary with explicit enable/disable semantics so it is still testable.
        </p>
        <p>
          In React, this typically means:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Component-scoped:</strong> useEffect with cleanup return.
          </li>
          <li>
            <strong>Route-scoped:</strong> Attach in route loader or component, detach in route cleanup.
          </li>
          <li>
            <strong>Feature-scoped:</strong> Attach when feature flag enables, detach when feature disables.
          </li>
        </ul>
        <p>
          Avoid attaching in module scope or in global initialization code unless the listener is truly session-lifetime and bounded.
        </p>

        <h3>Handle: Minimize Closure Capture</h3>
        <p>
          Keep handler closures small and avoid capturing large mutable graphs. If handlers need access to large state, prefer a stable indirection (lookup at handling time) rather than capturing the entire object graph in a long-lived closure.
        </p>
        <p>
          Patterns for minimizing capture:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Use refs:</strong> Store mutable state in refs and access via ref.current in handlers.
          </li>
          <li>
            <strong>Lookup at handling time:</strong> Instead of capturing state, look it up from a store when the event fires.
          </li>
          <li>
            <strong>Stable callbacks:</strong> Use useCallback to create stable handler references that don&apos;t change on every render.
          </li>
          <li>
            <strong>Event data only:</strong> Only use event.target and event data in handlers, avoid external state when possible.
          </li>
        </ul>

        <h3>Detach: Reliable Teardown</h3>
        <p>
          Teardown should run on unmount and on route transitions. The reliability risk is not "forgetting once", but forgetting in an edge case: aborted navigation, conditional rendering, feature flags, or third-party widget reinitialization.
        </p>
        <p>
          Teardown checklist:
        </p>
        <ul className="space-y-2">
          <li>
            Remove all listeners added in the corresponding attach phase.
          </li>
          <li>
            Clear any stored handler references.
          </li>
          <li>
            Cancel any pending async operations triggered by events.
          </li>
          <li>
            Reset any state that was modified by event handlers.
          </li>
        </ul>
        <p>
          In React, useEffect cleanup is the primary teardown point. But also consider cleanup on:
        </p>
        <ul className="space-y-2">
          <li>
            Route changes (useNavigate, useLocation changes).
          </li>
          <li>
            Feature toggles (feature disabled).
          </li>
          <li>
            User session changes (sign out, tenant switch).
          </li>
          <li>
            Error boundaries (cleanup on error).
          </li>
        </ul>

        <h3>Tracking Listener State</h3>
        <p>
          For complex applications, tracking which listeners are active can help with debugging and validation:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Development Mode:</strong> Log listener attach/detach in development to verify cleanup.
          </li>
          <li>
            <strong>Registry Utility:</strong> Use a shared utility that tracks all registered listeners for a component.
          </li>
          <li>
            <strong>Teardown Validation:</strong> In development, verify that all listeners are removed on unmount.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/memory-management/event-listener-cleanup-impact.svg"
          alt="Memory impact comparison: with vs without listener cleanup over navigation cycles"
          caption="Memory impact — without cleanup, listener count and retained memory grow linearly with navigation. With cleanup, both remain stable."
        />

        <p>
          At scale, teams should treat listener additions as a review item: new listeners imply new retention edges. The more dynamic the DOM, the more valuable a consistent pattern becomes (for example: a shared utility that binds and tracks listeners for a component scope).
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs & Comparison</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-theme">
              <th className="p-3 text-left">Strategy</th>
              <th className="p-3 text-left">Pros</th>
              <th className="p-3 text-left">Cons</th>
              <th className="p-3 text-left">Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Per-Node Listeners</td>
              <td className="p-3">Simple mental model; localized behavior; no event routing logic</td>
              <td className="p-3">Scales poorly with large lists; higher retention surface; teardown easy to miss</td>
              <td className="p-3">Small static lists, simple interactions</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Event Delegation</td>
              <td className="p-3">Fewer listeners; easier teardown; works well with dynamic DOM; lower memory footprint</td>
              <td className="p-3">More routing logic; can complicate ordering and stop-propagation semantics</td>
              <td className="p-3">Large lists, dynamic content, tables, grids</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Global Listener</td>
              <td className="p-3">Centralized; avoids duplication; single point of control</td>
              <td className="p-3">Often becomes a retention root; harder to reason about ownership; risk of feature coupling</td>
              <td className="p-3">App-wide shortcuts, truly global behaviors</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Custom Hook (useEventListener)</td>
              <td className="p-3">Encapsulates attach/detach logic; consistent pattern; reusable</td>
              <td className="p-3">Adds abstraction layer; must ensure hook handles all edge cases</td>
              <td className="p-3">Standardizing listener patterns across teams</td>
            </tr>
          </tbody>
        </table>
        <p>
          The staff-level bias is to minimize listener cardinality and centralize teardown, while avoiding "global" patterns unless they are explicitly bounded and reviewed.
        </p>

        <h3>When to Use Each Strategy</h3>
        <ul className="space-y-2">
          <li>
            <strong>Per-Node:</strong> Use for small, static sets of elements (e.g., 5-10 buttons). Avoid for lists that can grow beyond 50 items.
          </li>
          <li>
            <strong>Delegation:</strong> Default choice for lists, tables, grids, or any dynamic content. Attach to container, route based on event.target.
          </li>
          <li>
            <strong>Global:</strong> Use sparingly for truly app-wide behaviors (keyboard shortcuts, online/offline detection). Document the global listener and its purpose.
          </li>
          <li>
            <strong>Custom Hook:</strong> Use to standardize patterns across teams. Encapsulates best practices for attach/detach.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Define Ownership:</strong> Every listener belongs to a scope (component/view/feature/session) with explicit attach/detach points. Document the owner and lifetime.
          </li>
          <li>
            <strong>Prefer Delegation for Large/Dynamic DOM:</strong> Reduce listener count and retention edges. One listener on a container is better than 100 listeners on children.
          </li>
          <li>
            <strong>Avoid Capturing Large State:</strong> Keep handler closures small; use indirection rather than closure-capturing big graphs. Use refs for mutable state.
          </li>
          <li>
            <strong>Review High-Frequency Listeners:</strong> Scroll/resize/pointer events should have explicit performance budgets and teardown checks. Use passive listeners where appropriate.
          </li>
          <li>
            <strong>Guardrail Third-Party Listeners:</strong> Ensure widgets can be disabled/unmounted cleanly. Isolate third-party SDKs behind abstraction layers.
          </li>
          <li>
            <strong>Validate with Repeated Navigation:</strong> Confirm listeners do not accumulate across mounts. Use automated soak tests for validation.
          </li>
          <li>
            <strong>Use Stable Handler References:</strong> Store handlers in refs or use useCallback to ensure the same reference is used for attach and detach.
          </li>
          <li>
            <strong>Anonymous Handlers Are Dangerous:</strong> Never use anonymous functions with addEventListener if you need to remove them later.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Listeners Registered Outside Lifecycles:</strong> Attaching in module scope or singletons makes cleanup easy to miss. Always attach within component/route lifecycle.
          </li>
          <li>
            <strong>Anonymous Handlers Without Tracking:</strong> If you cannot reference the original handler, detaching becomes error-prone. Always store handler references.
          </li>
          <li>
            <strong>Retaining DOM References in Closures:</strong> Event handlers accidentally keep detached nodes alive. Clear DOM refs in cleanup and avoid capturing them in long-lived closures.
          </li>
          <li>
            <strong>Multiple Listeners for the Same Concern:</strong> Duplication across components increases cardinality and teardown complexity. Centralize shared listener logic.
          </li>
          <li>
            <strong>Ignoring Passive/Scroll Budgets:</strong> High-frequency events can cause jank even without leaks. Use {`{ passive: true }`} for scroll/touch listeners.
          </li>
          <li>
            <strong>Forgetting Capture/Passive Options:</strong> If you add with {`{ capture: true }`}, you must remove with the same options. Mismatched options prevent removal.
          </li>
          <li>
            <strong>Third-Party Widget Listeners:</strong> Widgets often add listeners that outlive the widget. Ensure widgets support explicit teardown.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Keyboard Shortcuts</h3>
        <p>
          <strong>Problem:</strong> App-wide keyboard shortcuts need to work across routes but should not accumulate listeners.
        </p>
        <p>
          <strong>Solution:</strong> Single global keydown listener with route-aware handler. Handler checks current route and active element before executing shortcuts. Listener attached once at app root, never removed.
        </p>
        <p>
          <strong>Key Insight:</strong> Global listener is acceptable when it&apos;s truly one listener with bounded behavior. The handler logic determines which shortcuts are active based on application state.
        </p>

        <h3>Large Lists and Tables</h3>
        <p>
          <strong>Problem:</strong> 1000-row table with per-row click handlers causes memory growth and slow teardown.
        </p>
        <p>
          <strong>Solution:</strong> Event delegation on table container. Single click handler routes based on event.target.closest(&apos;tr&apos;). Teardown is single removeEventListener call.
        </p>
        <p>
          <strong>Key Insight:</strong> Delegation reduces listener count from O(n) to O(1). Memory footprint is constant regardless of row count.
        </p>

        <h3>Overlays and Modals</h3>
        <p>
          <strong>Problem:</strong> Focus traps and outside-click handlers frequently leak if not detached on close.
        </p>
        <p>
          <strong>Solution:</strong> Modal component attaches listeners on mount, detaches on unmount. Use useEffect cleanup. For programmatic modals, ensure close function triggers cleanup.
        </p>
        <p>
          <strong>Key Insight:</strong> Modal listeners are view-lifetime, not session-lifetime. They must be removed when modal closes, not when component unmounts (which may happen later).
        </p>

        <h3>Third-Party Widgets</h3>
        <p>
          <strong>Problem:</strong> Widgets add listeners broadly; without isolation, they can retain views after navigation.
        </p>
        <p>
          <strong>Solution:</strong> Wrap widget in component that manages lifecycle. Attach widget on mount, destroy widget on unmount. Verify widget&apos;s destroy method removes all listeners.
        </p>
        <p>
          <strong>Key Insight:</strong> Third-party widgets are black boxes. Assume they leak unless proven otherwise. Isolate behind cleanup boundaries.
        </p>

        <h3>Drag-and-Drop Interface</h3>
        <p>
          <strong>Problem:</strong> Drag operations add temporary mousemove/mouseup listeners that may not be cleaned up if drag is interrupted.
        </p>
        <p>
          <strong>Solution:</strong> Add drag listeners on mousedown, remove on mouseup/mouseleave. Use try/finally to ensure cleanup even if drag logic throws.
        </p>
        <p>
          <strong>Key Insight:</strong> Interaction-lifetime listeners must be cleaned up when interaction ends, not when component unmounts. Track interaction state explicitly.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions & Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: How can an event listener create a memory leak in a garbage-collected runtime?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              The event system keeps a registry of listeners. If the listener remains registered, the callback is reachable via that registry. The callback then keeps its closure reachable, which can include large application state or DOM references. Missing detach turns view-lifetime objects into session-lifetime retention.
            </p>
            <p className="mb-3">
              The retention chain is: Event Target → Listener Registry → Callback → Closure → Captured State. Breaking any link allows GC to collect downstream objects. The most practical break point is removing the listener from the registry.
            </p>
            <p>
              Example: A component adds a window scroll listener in useEffect but forgets to remove it. The component unmounts, but the listener remains. The listener&apos;s closure captures component state, keeping it alive indefinitely.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: When would you prefer event delegation over per-node listeners?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Event delegation is preferred when you have large or dynamic DOM (tables, lists, infinite scroll), where per-node listeners scale poorly. Delegation reduces listener cardinality, simplifies teardown, and can reduce retention edges.
            </p>
            <p className="mb-3">
              Specific scenarios:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Large Lists:</strong> 1000+ items where per-item listeners would be expensive.
              </li>
              <li>
                <strong>Dynamic Content:</strong> Items frequently added/removed where managing individual listeners is complex.
              </li>
              <li>
                <strong>Memory-Constrained:</strong> Mobile devices where listener overhead matters.
              </li>
            </ul>
            <p>
              The trade-off is more routing logic and potential semantic complexity (e.g., handling stopPropagation correctly). But for most large-scale applications, delegation is the default choice.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: What guardrails would you add to prevent listener leaks across teams?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Establish Patterns:</strong> Define ownership and teardown patterns. Use shared utilities like useEventListener that handle cleanup automatically.
              </li>
              <li>
                <strong>Require Explicit Lifetimes:</strong> New listeners must document their lifetime (component, route, feature, session). Session-lifetime requires justification.
              </li>
              <li>
                <strong>Review Checklists:</strong> Add listener cleanup to PR review checklist. Verify attach/detach symmetry.
              </li>
              <li>
                <strong>Regression Tests:</strong> Add long-session tests that detect accumulating listeners or rising memory baselines after repeated navigation.
              </li>
              <li>
                <strong>Development Warnings:</strong> Log listener attach/detach in development. Warn if listeners accumulate across unmounts.
              </li>
            </ul>
            <p>
              The goal is to make safe patterns the default and dangerous patterns visible. Developers should leak listeners only by deliberate choice, not by accident.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: Why are high-frequency listeners riskier than click handlers?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              High-frequency listeners (scroll, resize, pointer move) are invoked many times per second, so they amplify both CPU cost and memory churn:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>CPU Amplification:</strong> A small per-event allocation or expensive handler becomes a major performance issue when called 60 times/second.
              </li>
              <li>
                <strong>Memory Churn:</strong> Frequent allocations trigger more GC work, which can cause jank.
              </li>
              <li>
                <strong>Leak Impact:</strong> If a high-frequency listener leaks, the impact is multiplied. One leaked scroll handler firing 60fps is worse than one leaked click handler firing once per minute.
              </li>
            </ul>
            <p>
              Mitigation: Use throttling/debouncing, passive listeners, and minimize work inside high-frequency handlers.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: How do you validate listener cleanup in practice?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Repeated Navigation:</strong> Navigate back and forth between routes 50+ times. Memory should stabilize, not grow linearly.
              </li>
              <li>
                <strong>Heap Snapshots:</strong> Take snapshots before and after navigation. Compare to find retained listeners or detached DOM.
              </li>
              <li>
                <strong>Retainer Analysis:</strong> For retained objects, trace retainer chains to find listener registries holding them.
              </li>
              <li>
                <strong>Development Logging:</strong> Log listener attach/detach in development. Verify counts return to baseline after unmount.
              </li>
              <li>
                <strong>Automated Soak Tests:</strong> Run automated sessions for 30+ minutes with repeated interactions. Monitor memory baseline.
              </li>
            </ul>
            <p>
              The baseline should stabilize after idle, and retainer chains should not show old views being held by listener registries.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: What is the correct way to remove an event listener added with options?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              You must use the exact same options object (or equivalent) for removal as you used for addition:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Same Function:</strong> The exact same function reference must be passed.
              </li>
              <li>
                <strong>Same Capture:</strong> If added with {`{ capture: true }`}, must remove with {`{ capture: true }`}.
              </li>
              <li>
                <strong>Same Passive:</strong> If added with {`{ passive: true }`}, must remove with {`{ passive: true }`}.
              </li>
              <li>
                <strong>Same Once:</strong> If added with {`{ once: true }`}, it auto-removes after first call.
              </li>
            </ul>
            <p>
              Common mistake: Adding with {`{ passive: true }`} but removing without options. The removal silently fails because the browser treats them as different listeners.
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
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN: addEventListener
            </a> — Official documentation for addEventListener and removeEventListener.
          </li>
          <li>
            <a href="https://developer.chrome.com/docs/devtools/memory-problems/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Chrome DevTools: Fix Memory Problems
            </a> — Guide to identifying memory leaks including listener retention.
          </li>
          <li>
            <a href="https://web.dev/optimize-long-tasks/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev: Optimize Long Tasks
            </a> — Guidance on reducing main thread blocking including event handler optimization.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scrolling_performance_with_passive_listeners" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN: Passive Listeners
            </a> — How passive listeners improve scroll performance.
          </li>
          <li>
            <a href="https://react.dev/learn/synchronizing-with-effects#cleaning-up-after-effects" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React Docs: Cleaning Up After Effects
            </a> — Guide to proper cleanup in useEffect hooks.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
