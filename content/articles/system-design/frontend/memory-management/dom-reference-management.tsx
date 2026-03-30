"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-memory-management-dom-reference-management",
  title: "DOM Reference Management",
  description: "Comprehensive guide to DOM reference management in React/Next.js SPAs: preventing detached DOM leaks, designing reference lifetimes, virtualization strategies, and teardown patterns for memory safety.",
  category: "frontend",
  subcategory: "memory-management",
  slug: "dom-reference-management",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-30",
  tags: ["frontend", "memory", "dom", "detached-dom", "performance", "react", "spa", "memory-leaks"],
  relatedTopics: ["memory-leaks-prevention", "event-listener-cleanup", "virtualization-windowing", "memory-profiling"],
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
          <strong>DOM reference management</strong> is the practice of designing how your application holds, uses, and releases references to DOM nodes. In production SPAs, it is one of the most important (and most frequently misunderstood) aspects of memory management because DOM nodes are not just lightweight objects: they often anchor large subtrees with associated style/layout state, event listeners, and framework wrappers.
        </p>
        <p>
          A common failure mode is the <strong>detached DOM leak</strong>: a DOM subtree is removed from the document, but remains alive because JavaScript still holds a reference to a node in that subtree (directly or indirectly). Over time, repeated mount/unmount cycles accumulate detached nodes and the tab degrades: GC pauses become more frequent, interactions stutter, and memory pressure rises.
        </p>
        <p>
          In React/Next.js client components, references are introduced through refs, event handlers, observers, third-party widgets, and caches that store elements. Preventing retention is less about avoiding the DOM entirely and more about <strong>defining lifetimes</strong>: references to nodes should not outlive the UI they represent unless they are explicitly bounded and safe.
        </p>
        <p>
          The business impact of DOM retention issues:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Progressive Slowdown:</strong> Each navigation adds detached nodes. After 50 page views, you might have 10,000+ detached nodes consuming memory.
          </li>
          <li>
            <strong>GC Pressure:</strong> DOM nodes are large objects with many properties. Retaining them increases GC work significantly.
          </li>
          <li>
            <strong>Tab Crashes:</strong> When DOM memory exceeds browser limits, tabs are forcibly reloaded or crashed.
          </li>
          <li>
            <strong>Mobile Impact:</strong> Mobile devices have less RAM. DOM retention causes crashes faster on mobile than desktop.
          </li>
        </ul>
        <p>
          In system design interviews, DOM reference management demonstrates understanding of browser internals, memory management, and the trade-offs between convenience (caching DOM refs) and memory safety. It shows you think about application behavior over time, not just initial render.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/memory-management/dom-reference-detached.svg"
          alt="Diagram showing detached DOM leak: component unmounts but JS reference keeps DOM node alive"
          caption="Architecture view — detached DOM leaks happen when long-lived JS references keep nodes reachable after removal from the document."
        />

        <h3>DOM Nodes Are Part of a Larger Object Graph</h3>
        <p>
          When you keep a DOM reference, you often keep a graph: the node, its descendants (if referenced), event listeners attached to it, and closures captured by those listeners. Frameworks add wrappers and bookkeeping. This is why detached DOM retention can dominate memory even when JS heap "looks fine".
        </p>
        <p>
          A single DOM node can retain:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Child Nodes:</strong> All descendants if you reference a parent node.
          </li>
          <li>
            <strong>Event Listeners:</strong> All handlers attached to the node and its children.
          </li>
          <li>
            <strong>Closure State:</strong> State captured by event handler closures.
          </li>
          <li>
            <strong>Framework Wrappers:</strong> React fiber nodes, Vue component instances, etc.
          </li>
          <li>
            <strong>Style/Layout Data:</strong> Computed styles, layout information cached by browser.
          </li>
        </ul>
        <p>
          This is why a "small" leak of 100 DOM nodes can actually retain megabytes of memory.
        </p>

        <h3>Direct vs. Indirect Retention</h3>
        <p>
          Retention can be direct (you store an element in a cache) or indirect (a long-lived callback closes over an element, or an observer holds a target list, or an event registry references a handler that references the element). In practice, many DOM leaks are indirect: the code does not "store the node", but it stores something that references the node.
        </p>
        <p>
          Common indirect retention patterns:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Event Handler Closure:</strong> Handler function captures element reference in closure.
          </li>
          <li>
            <strong>Observer Target:</strong> IntersectionObserver, ResizeObserver hold references to observed elements.
          </li>
          <li>
            <strong>Third-Party Widget:</strong> Widget library holds internal references to mounted elements.
          </li>
          <li>
            <strong>Animation Frame:</strong> requestAnimationFrame callback captures element reference.
          </li>
        </ul>

        <h3>Identity and Handles</h3>
        <p>
          Many use cases that "need DOM references" can be solved with a stable identifier and a lookup at the moment of use. The key trade-off is between repeated lookups (CPU) and long-lived cached handles (memory). Production-grade systems often prefer bounded, on-demand lookup or scoped caching at a view lifetime.
        </p>
        <p>
          Patterns for avoiding long-lived DOM references:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Query at Use Time:</strong> Instead of storing element, query with getElementById when needed.
          </li>
          <li>
            <strong>Use IDs:</strong> Store element ID (string), not element reference. Look up when needed.
          </li>
          <li>
            <strong>Event Delegation:</strong> Listen on parent, use event.target instead of direct references.
          </li>
          <li>
            <strong>WeakMap:</strong> Use WeakMap for caches so entries are collected when element is removed.
          </li>
        </ul>

        <h3>Virtualization Is Memory Management</h3>
        <p>
          Virtualized lists, windowing, and incremental rendering patterns reduce DOM cardinality and keep the DOM subtree bounded. This is not only a rendering optimization; it is a memory safety mechanism that prevents DOM node accumulation and reduces retention surfaces.
        </p>
        <p>
          Without virtualization: 10,000 list items = 10,000 DOM nodes retained in memory. With virtualization: 10,000 list items = ~20-30 DOM nodes (visible items + buffer). This is a 99%+ reduction in DOM memory footprint.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/memory-management/dom-reference-lifetime.svg"
          alt="Comparison of DOM reference lifetime patterns: component-scoped, global, and cached references"
          caption="Reference lifetimes — component-scoped refs are safe; global refs require explicit cleanup; cached refs need eviction policies."
        />

        <h3>Detached DOM Detection</h3>
        <p>
          Detached DOM nodes can be detected in Chrome DevTools:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Heap Snapshot:</strong> Filter by "Detached" to find nodes removed from document but still referenced.
          </li>
          <li>
            <strong>Elements Panel:</strong> Detached nodes won&apos;t appear in the DOM tree but may still be in memory.
          </li>
          <li>
            <strong>Memory Panel:</strong> Compare snapshots to find growing detached node count.
          </li>
        </ul>
        <p>
          If you see detached nodes in a snapshot, trace their retainers to find what&apos;s keeping them alive. Common culprits: event handlers, observers, refs not cleared, third-party widgets.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture & Flow</h2>
        <p>
          The lifecycle of a DOM node in a modern SPA involves multiple layers: framework render, DOM insertion, event binding, observers, and teardown. Leaks occur when teardown does not remove all retention edges.
        </p>

        <h3>Typical Flow</h3>
        <ol className="space-y-2">
          <li>
            <strong>Mount:</strong> Framework renders and inserts a subtree into the document.
          </li>
          <li>
            <strong>Bind:</strong> Event handlers, observers, and third-party integrations attach to the subtree.
          </li>
          <li>
            <strong>Interact:</strong> Callbacks capture state and may allocate temporary objects.
          </li>
          <li>
            <strong>Unmount:</strong> Framework removes subtree from document.
          </li>
          <li>
            <strong>Cleanup:</strong> Handlers, observers, and refs should be cleared. If not, retention occurs.
          </li>
        </ol>
        <p>
          The critical phase is cleanup (step 5). If any retention edge survives, the entire subtree remains reachable and cannot be collected.
        </p>

        <h3>Reference Lifetime Patterns</h3>
        <p>
          Different reference patterns have different risk levels:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Component-Scoped Refs (Low Risk):</strong> useRef in React, cleared on unmount. Lifetime matches component lifetime.
          </li>
          <li>
            <strong>View-Scoped Refs (Medium Risk):</strong> Stored in module-level variable for view. Must be cleared on navigation.
          </li>
          <li>
            <strong>Global Refs (High Risk):</strong> Stored in global variable. Rarely cleared, often causes leaks.
          </li>
          <li>
            <strong>Cached Refs (Variable Risk):</strong> Stored in cache with eviction policy. Safe if cache is bounded.
          </li>
        </ul>
        <p>
          Rule of thumb: the longer the intended lifetime, the more careful you must be about cleanup. Session-lifetime references require explicit justification and bounds.
        </p>

        <h3>Third-Party Widget Integration</h3>
        <p>
          Third-party widgets (chat, analytics, A/B testing) often hold DOM references internally. Prevention strategies:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Isolate:</strong> Mount widget in dedicated container. Don&apos;t let it access broader DOM.
          </li>
          <li>
            <strong>Explicit Teardown:</strong> Call widget&apos;s destroy/disable method on unmount.
          </li>
          <li>
            <strong>Verify Cleanup:</strong> Check DevTools after unmount to confirm widget released references.
          </li>
          <li>
            <strong>Lazy Load:</strong> Only load widget when needed, unload when not in use.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/memory-management/dom-reference-virtualization.svg"
          alt="Comparison of full list rendering (10000 DOM nodes) vs virtualized rendering (20-30 DOM nodes)"
          caption="Virtualization impact — reduces DOM cardinality from O(n) to O(1), dramatically reducing memory footprint."
        />

        <h3>Observer Cleanup</h3>
        <p>
          Observers (IntersectionObserver, ResizeObserver, MutationObserver) hold references to observed elements. Always disconnect observers in cleanup:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>IntersectionObserver:</strong> observer.disconnect() in useEffect cleanup.
          </li>
          <li>
            <strong>ResizeObserver:</strong> observer.disconnect() or observer.unobserve(element).
          </li>
          <li>
            <strong>MutationObserver:</strong> observer.disconnect() in cleanup.
          </li>
        </ul>
        <p>
          Forgotten observers are a common source of detached DOM retention. The observer keeps the target element alive even after it&apos;s removed from the document.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs & Comparison</h2>
        <p>
          DOM reference management is a trade-off between ergonomics, CPU efficiency, and memory safety.
        </p>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-theme">
              <th className="p-3 text-left">Pattern</th>
              <th className="p-3 text-left">Pros</th>
              <th className="p-3 text-left">Cons</th>
              <th className="p-3 text-left">Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Direct Ref (useRef)</td>
              <td className="p-3">Simple, fast access</td>
              <td className="p-3">Must clear on unmount</td>
              <td className="p-3">Component-scoped access</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Query at Use Time</td>
              <td className="p-3">No retention risk</td>
              <td className="p-3">Repeated DOM lookups</td>
              <td className="p-3">Infrequent access patterns</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">WeakMap Cache</td>
              <td className="p-3">Auto-cleanup when element GC&apos;d</td>
              <td className="p-3">Only works for object keys</td>
              <td className="p-3">Metadata storage, element caches</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Event Delegation</td>
              <td className="p-3">No per-element refs needed</td>
              <td className="p-3">More complex event routing</td>
              <td className="p-3">Large lists, dynamic content</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Virtualization</td>
              <td className="p-3">Bounded DOM cardinality</td>
              <td className="p-3">Implementation complexity</td>
              <td className="p-3">Long lists, infinite scroll</td>
            </tr>
          </tbody>
        </table>
        <p>
          The staff-level bias is to minimize long-lived DOM references and prefer patterns that automatically release references (WeakMap, scoped refs, delegation).
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Clear Refs on Unmount:</strong> Set ref.current = null in useEffect cleanup.
          </li>
          <li>
            <strong>Disconnect Observers:</strong> Call observer.disconnect() in cleanup for all observers.
          </li>
          <li>
            <strong>Use Virtualization:</strong> For lists with 100+ items, use react-window or similar.
          </li>
          <li>
            <strong>Avoid Global Element Caches:</strong> If you must cache, use WeakMap or add eviction.
          </li>
          <li>
            <strong>Prefer Delegation:</strong> Listen on parent, use event.target instead of per-element listeners.
          </li>
          <li>
            <strong>Verify Third-Party Cleanup:</strong> Check DevTools after unmounting widgets to confirm release.
          </li>
          <li>
            <strong>Use IDs Over References:</strong> Store element ID (string), look up when needed.
          </li>
          <li>
            <strong>Scope References:</strong> Keep refs scoped to component or view lifetime, not session lifetime.
          </li>
          <li>
            <strong>Check for Detached Nodes:</strong> Regularly profile with heap snapshots to catch detached DOM early.
          </li>
          <li>
            <strong>Document Retention:</strong> Document any intentional long-lived DOM references and their justification.
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
            <strong>Not Clearing Refs:</strong> useRef.current not set to null on unmount. Element retained even after component unmounts.
          </li>
          <li>
            <strong>Observer Without Disconnect:</strong> IntersectionObserver/ResizeObserver not disconnected. Observed elements retained.
          </li>
          <li>
            <strong>Closure Capture of Element:</strong> Event handler or callback captures element reference in closure. Closure outlives element.
          </li>
          <li>
            <strong>Third-Party Widget Leak:</strong> Widget not properly destroyed on unmount. Widget retains internal references.
          </li>
          <li>
            <strong>Global Element Array:</strong> Pushing elements to global array without cleanup. Array grows unbounded.
          </li>
          <li>
            <strong>Animation Frame Leak:</strong> requestAnimationFrame callback captures element. Not cancelled on unmount.
          </li>
          <li>
            <strong>Detached Event Listener:</strong> Listener attached to element, element removed, listener not removed.
          </li>
          <li>
            <strong>Image Bitmap Retention:</strong> Canvas or decoded images retain large bitmaps. Not cleared when no longer needed.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Image Gallery with Lazy Loading</h3>
        <p>
          <strong>Problem:</strong> Image gallery causes memory growth as user scrolls. Tab crashes after viewing ~100 images.
        </p>
        <p>
          <strong>Root Cause:</strong> IntersectionObserver not disconnected on unmount. Observed image elements retained even after scrolling out of view.
        </p>
        <p>
          <strong>Solution:</strong> Disconnect observer in useEffect cleanup. Unobserve images that scroll out of view. Use loading="lazy" for native lazy loading. Memory stabilized, no more crashes.
        </p>

        <h3>Dashboard with Third-Party Chart Widget</h3>
        <p>
          <strong>Problem:</strong> Dashboard with chart widget causes memory growth after multiple navigation cycles.
        </p>
        <p>
          <strong>Root Cause:</strong> Chart widget not destroyed on component unmount. Widget retains references to chart container and internal data structures.
        </p>
        <p>
          <strong>Solution:</strong> Call chart.destroy() in useEffect cleanup. Verify with heap snapshot that chart references are released. Memory growth eliminated.
        </p>

        <h3>Infinite Scroll Feed</h3>
        <p>
          <strong>Problem:</strong> Infinite scroll feed causes progressive slowdown. Becomes unusable after scrolling 500+ items.
        </p>
        <p>
          <strong>Root Cause:</strong> All scrolled items remain in DOM. No virtualization. DOM cardinality grows unbounded.
        </p>
        <p>
          <strong>Solution:</strong> Implement virtualization with react-window. Only render visible items (~20) plus small buffer. DOM cardinality stays constant regardless of scroll position.
        </p>

        <h3>Drag-and-Drop Interface</h3>
        <p>
          <strong>Problem:</strong> Drag-and-drop interface causes memory growth after multiple drag operations.
        </p>
        <p>
          <strong>Root Cause:</strong> Drag ghost elements and drop zone highlights not cleaned up properly. Event listeners for drag events not removed.
        </p>
        <p>
          <strong>Solution:</strong> Clean up drag ghost on drag end. Remove drag event listeners in cleanup. Use refs with proper nullification. Memory stabilized.
        </p>

        <h3>Video Player Component</h3>
        <p>
          <strong>Problem:</strong> Video player component causes memory growth after playing multiple videos.
        </p>
        <p>
          <strong>Root Cause:</strong> Video element not properly cleaned up. Decoded video frames retained in memory. Event listeners on video element not removed.
        </p>
        <p>
          <strong>Solution:</strong> Set video src to empty string on unmount. Remove all event listeners. Nullify video ref. Memory growth eliminated.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions & Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is a detached DOM node and why does it cause memory leaks?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              A detached DOM node is a node that has been removed from the document (via removeChild, innerHTML = &apos;&apos;, etc.) but is still referenced by JavaScript. Because it&apos;s still reachable from the root set (via the JavaScript reference), GC cannot collect it.
            </p>
            <p className="mb-3">
              Detached nodes cause memory leaks because:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Large Size:</strong> DOM nodes are large objects with many properties (styles, attributes, children, event listeners).
              </li>
              <li>
                <strong>Subtree Retention:</strong> Referencing a parent node retains all children.
              </li>
              <li>
                <strong>Listener Retention:</strong> Event listeners on the node retain their closures and captured state.
              </li>
            </ul>
            <p>
              Prevention: clear refs on unmount, disconnect observers, remove event listeners, verify third-party widgets release references.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: How do you detect detached DOM nodes in Chrome DevTools?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Heap Snapshot:</strong> Take heap snapshot in Memory panel. Filter by "Detached" to find nodes removed from document but still in memory.
              </li>
              <li>
                <strong>Compare Snapshots:</strong> Take snapshot before and after navigation. Compare to find growing detached node count.
              </li>
              <li>
                <strong>Trace Retainers:</strong> For detached nodes, view retainer chain to find what&apos;s keeping them alive.
              </li>
              <li>
                <strong>Elements Panel:</strong> Detached nodes won&apos;t appear in DOM tree but may still be in memory (verify with heap snapshot).
              </li>
            </ul>
            <p>
              Common retainer patterns: event handler closures, observer targets, refs not cleared, third-party widget internal references.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: When would you use WeakMap for DOM caching?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              WeakMap is useful for DOM caching when you want the cache entry to be automatically cleaned up when the element is no longer referenced elsewhere:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Metadata Storage:</strong> Store metadata about elements without preventing GC.
              </li>
              <li>
                <strong>Element Caches:</strong> Cache computed values or associated data for elements.
              </li>
              <li>
                <strong>Event Handler Maps:</strong> Track handlers attached to elements for cleanup.
              </li>
            </ul>
            <p>
              Key benefit: when element is removed from DOM and no other references exist, both element and WeakMap entry are collected automatically. No manual cleanup needed.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How does virtualization help with memory management?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Virtualization reduces DOM cardinality by only rendering visible items plus a small buffer:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Without Virtualization:</strong> 10,000 items = 10,000 DOM nodes retained in memory.
              </li>
              <li>
                <strong>With Virtualization:</strong> 10,000 items = ~20-30 DOM nodes (visible + buffer).
              </li>
            </ul>
            <p className="mb-3">
              This is a 99%+ reduction in DOM memory footprint. Benefits:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Lower Memory:</strong> Fewer DOM nodes = less memory retained.
              </li>
              <li>
                <strong>Faster GC:</strong> Smaller DOM = faster garbage collection.
              </li>
              <li>
                <strong>Better Performance:</strong> Less DOM = faster layout, paint, and event handling.
              </li>
            </ul>
            <p>
              Use react-window, react-virtual, or similar libraries for virtualization in React.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: How do you properly clean up observers (IntersectionObserver, ResizeObserver)?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Store Observer:</strong> Keep observer reference in useRef or instance variable.
              </li>
              <li>
                <strong>Disconnect on Cleanup:</strong> Call observer.disconnect() in useEffect cleanup or componentWillUnmount.
              </li>
              <li>
                <strong>Unobserve Specific Elements:</strong> Alternatively, call observer.unobserve(element) for specific elements.
              </li>
              <li>
                <strong>Nullify Reference:</strong> Set observer ref to null after disconnect.
              </li>
            </ul>
            <p>
              Example:
            </p>
            <pre className="bg-panel-soft p-3 rounded text-sm overflow-x-auto my-3">
              <code>{`useEffect(() => {
  const observer = new IntersectionObserver(callback);
  observer.observe(targetRef.current);
  return () => {
    observer.disconnect();
  };
}, []);`}</code>
            </pre>
            <p>
              Forgotten observers are a common source of detached DOM retention.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: What are best practices for third-party widget integration to prevent DOM leaks?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Isolate:</strong> Mount widget in dedicated container. Don&apos;t let it access broader DOM.
              </li>
              <li>
                <strong>Explicit Teardown:</strong> Always call widget&apos;s destroy/disable method on unmount.
              </li>
              <li>
                <strong>Verify Cleanup:</strong> Check DevTools heap snapshot after unmount to confirm widget released references.
              </li>
              <li>
                <strong>Lazy Load:</strong> Only load widget when needed. Unload when not in use.
              </li>
              <li>
                <strong>Document Behavior:</strong> Document widget&apos;s memory behavior and cleanup requirements for team.
              </li>
              <li>
                <strong>Monitor in Production:</strong> Add telemetry to detect widget-related memory growth.
              </li>
            </ul>
            <p>
              Third-party widgets are black boxes. Assume they leak unless proven otherwise. Isolate behind cleanup boundaries.
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
            <a href="https://developer.chrome.com/docs/devtools/memory-problems/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Chrome DevTools: Fix Memory Problems
            </a> — Official guide to memory profiling including detached DOM detection.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN: IntersectionObserver
            </a> — Documentation for IntersectionObserver API and cleanup.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN: WeakMap
            </a> — Documentation for WeakMap and use cases.
          </li>
          <li>
            <a href="https://react.dev/reference/react/useRef" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React Docs: useRef
            </a> — Documentation for useRef and proper cleanup patterns.
          </li>
          <li>
            <a href="https://tanstack.com/virtual/latest" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              TanStack Virtual
            </a> — Virtualization library for reducing DOM cardinality.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
