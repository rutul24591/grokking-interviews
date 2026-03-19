"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-advanced-memory-management-extensive",
  title: "Memory Management",
  description: "Comprehensive guide to frontend memory management, covering memory leaks, heap analysis, garbage collection, detection strategies, and prevention patterns for staff/principal engineer interviews.",
  category: "advanced-topics",
  subcategory: "nfr",
  slug: "memory-management",
  version: "extensive",
  wordCount: 11500,
  readingTime: 46,
  lastUpdated: "2026-03-19",
  tags: ["advanced", "nfr", "memory-management", "performance", "frontend", "garbage-collection", "heap-analysis"],
  relatedTopics: ["performance-optimization", "battery-cpu-efficiency", "frontend-observability"],
};

export default function MemoryManagementArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Memory Management</strong> in frontend development refers to the allocation, usage, and
          deallocation of memory resources by JavaScript applications. While JavaScript has automatic garbage
          collection, memory leaks still occur when references are unintentionally held, preventing the garbage
          collector from reclaiming memory.
        </p>
        <p>
          Memory leaks are insidious because they accumulate over time. A single leak of a few kilobytes may
          seem insignificant, but over a user session lasting hours, with repeated component mounts/unmounts,
          the accumulation can reach hundreds of megabytes — causing sluggish performance, UI freezes, and
          eventually browser tab crashes.
        </p>
        <p>
          In modern Single Page Applications (SPAs), memory management is critical because:
        </p>
        <ul>
          <li>
            <strong>Long-lived sessions:</strong> Users keep tabs open for hours or days. Unlike traditional
            multi-page apps where navigation triggers full page reloads (clearing memory), SPAs accumulate
            state over time.
          </li>
          <li>
            <strong>Component lifecycles:</strong> React, Vue, and Angular components mount and unmount
            dynamically. Improper cleanup leaves dangling references.
          </li>
          <li>
            <strong>Event-driven architecture:</strong> Event listeners, subscriptions, and callbacks create
            reference chains that are easy to forget.
          </li>
          <li>
            <strong>Large data sets:</strong> Caching API responses, storing large objects in state, or
            rendering virtualized lists all consume memory that must be managed.
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Memory Leaks Are Reference Leaks</h3>
          <p>
            JavaScript memory leaks are not about allocating memory without freeing it — the garbage collector
            handles that. Leaks occur when you <strong>unintentionally maintain references</strong> to objects
            that should be garbage collected. The object is still reachable, so the GC cannot reclaim it.
          </p>
          <p className="mt-3">
            <strong>Memory management is about breaking reference chains</strong> when components unmount,
            requests complete, or data becomes stale.
          </p>
        </div>

        <p>
          This article covers the JavaScript memory model, common leak patterns, detection strategies using
          Chrome DevTools, and prevention patterns for production applications.
        </p>
      </section>

      <section>
        <h2>JavaScript Memory Model</h2>
        <p>
          Understanding how JavaScript manages memory is essential for identifying and preventing leaks.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Memory Lifecycle</h3>
        <p>
          JavaScript memory follows a four-stage lifecycle:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            <strong>Allocation:</strong> Memory is allocated when variables are created, objects are
            instantiated, or functions are defined. JavaScript automatically allocates memory during
            variable declaration.
          </li>
          <li>
            <strong>Usage:</strong> The application reads and writes to the allocated memory during
            execution.
          </li>
          <li>
            <strong>Reachability Analysis:</strong> The garbage collector determines which objects are
            still reachable from root references (global scope, call stack).
          </li>
          <li>
            <strong>Deallocation:</strong> Unreachable objects are garbage collected and memory is reclaimed.
          </li>
        </ol>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/memory-lifecycle.svg"
          alt="JavaScript Memory Lifecycle"
          caption="JavaScript Memory Lifecycle — showing the four stages: Allocation → Usage → Reachability Analysis → Deallocation, with garbage collection cycle"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Memory Roots</h3>
        <p>
          The garbage collector starts from <strong>roots</strong> and traverses references to find reachable
          objects. Anything not reachable is garbage. Roots include:
        </p>
        <ul>
          <li>
            <strong>Global Object:</strong> <code>window</code> in browsers, <code>global</code> in Node.js.
          </li>
          <li>
            <strong>Call Stack:</strong> Local variables in currently executing functions.
          </li>
          <li>
            <strong>DOM References:</strong> Elements stored in variables that are still reachable.
          </li>
          <li>
            <strong>Closures:</strong> Variables captured in closure scope remain reachable as long as the
            closure exists.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Garbage Collection Algorithms</h3>
        <p>
          Modern JavaScript engines use sophisticated garbage collection strategies:
        </p>

        <h4 className="mt-6 mb-3 text-lg font-semibold">Mark-and-Sweep</h4>
        <p>
          The classic GC algorithm. The collector:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Marks all objects reachable from roots.</li>
          <li>Sweeps through memory, reclaiming unmarked objects.</li>
          <li>Repeats periodically or when memory pressure is high.</li>
        </ol>
        <p>
          <strong>Trade-off:</strong> Simple but causes pauses during marking and sweeping phases.
        </p>

        <h4 className="mt-6 mb-3 text-lg font-semibold">Generational GC</h4>
        <p>
          Objects are divided into generations based on age:
        </p>
        <ul>
          <li>
            <strong>Young Generation (New Space):</strong> Recently allocated objects. Collected frequently
            with minor GC cycles (fast).
          </li>
          <li>
            <strong>Old Generation (Old Space):</strong> Objects that survived multiple GC cycles. Collected
            less frequently with major GC cycles (slower).
          </li>
          <li>
            <strong>Large Object Space:</strong> Objects larger than a threshold (e.g., large arrays).
            Allocated separately and collected independently.
          </li>
        </ul>
        <p>
          <strong>Insight:</strong> Most objects die young. Short-lived component state, temporary variables,
          and request responses are allocated and quickly become garbage. The generational approach optimizes
          for this pattern.
        </p>

        <h4 className="mt-6 mb-3 text-lg font-semibold">Incremental GC</h4>
        <p>
          Instead of collecting all at once (causing long pauses), incremental GC spreads collection work
          across multiple small cycles. This reduces visible jank but adds overhead.
        </p>
        <p>
          V8 (Chrome&apos;s engine) uses a combination of these strategies with additional optimizations like
          <strong>concurrent marking</strong> (marking on a background thread) and <strong>parallel
          sweeping</strong> (using multiple threads for deallocation).
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/generational-gc.svg"
          alt="Generational Garbage Collection"
          caption="Generational GC — showing Young Generation (frequent minor GC), Old Generation (infrequent major GC), and object promotion between generations"
        />
      </section>

      <section>
        <h2>Common Memory Leak Patterns</h2>
        <p>
          Memory leaks follow predictable patterns. Recognizing these patterns is the first step toward
          prevention.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">1. Forgotten Event Listeners</h3>
        <p>
          Adding event listeners without removing them on cleanup is the most common leak source.
        </p>
        <div className="my-4 rounded-lg border border-warning/30 bg-warning/10 p-4">
          <p className="font-semibold text-warning">Problem:</p>
          <p className="mt-2 text-sm">
            Event listeners create strong references to their callback functions and closure variables.
            If the listener is not removed when a component unmounts, the callback and its captured
            variables remain in memory indefinitely.
          </p>
        </div>
        <p>
          <strong>Example scenario:</strong> A component adds a <code>window.resize</code> listener in
          <code>useEffect</code> but does not return a cleanup function. Every time the component mounts,
          a new listener is added. The old listeners persist, each holding references to component state
          and props.
        </p>
        <p>
          <strong>Solution:</strong> Always remove listeners in cleanup:
        </p>
        <ul>
          <li>React: Return cleanup function from <code>useEffect</code>.</li>
          <li>Vue: Remove in <code>onUnmounted</code> hook.</li>
          <li>Angular: Unsubscribe in <code>ngOnDestroy</code>.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">2. Detached DOM Trees</h3>
        <p>
          A <strong>detached DOM tree</strong> occurs when DOM nodes are removed from the document but
          JavaScript still holds references to them.
        </p>
        <p>
          <strong>How it happens:</strong>
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            Component stores a reference to a DOM element (e.g., via <code>useRef</code> or direct query).
          </li>
          <li>Component unmounts, removing the element from the DOM.</li>
          <li>
            The reference variable still points to the detached element. The entire subtree rooted at that
            element cannot be garbage collected.
          </li>
        </ol>
        <p>
          <strong>Detection:</strong> Chrome DevTools Heap Snapshot shows &quot;Detached HTMLDivElement&quot;
          objects. These are DOM nodes with no parent but still referenced by JavaScript.
        </p>
        <p>
          <strong>Prevention:</strong> Nullify DOM references in cleanup. Use React refs properly — they
          automatically clean up when the component unmounts.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">3. Closures Holding Large Objects</h3>
        <p>
          Closures capture variables from their enclosing scope. If a closure outlives its intended lifetime,
          it brings along all captured variables.
        </p>
        <p>
          <strong>Example scenario:</strong> An async function captures a large data object. The function
          is passed to a timeout or promise that resolves after the component unmounts. The closure keeps
          the large object alive even though it&apos;s no longer needed.
        </p>
        <p>
          <strong>Mitigation:</strong>
        </p>
        <ul>
          <li>Avoid capturing large objects in closures that may outlive their context.</li>
          <li>Use weak references (<code>WeakMap</code>, <code>WeakSet</code>) when appropriate.</li>
          <li>Cancel pending async operations on unmount using <code>AbortController</code>.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">4. Unbounded Caches</h3>
        <p>
          Caching API responses or computed values improves performance, but unbounded caches grow indefinitely.
        </p>
        <p>
          <strong>Problem:</strong> A global cache object stores every API response keyed by URL. Over time,
          the cache accumulates megabytes of data. Old entries are never evicted.
        </p>
        <p>
          <strong>Solutions:</strong>
        </p>
        <ul>
          <li>
            <strong>LRU Cache:</strong> Least Recently Used eviction. Remove oldest entries when cache
            reaches size limit.
          </li>
          <li>
            <strong>TTL (Time-To-Live):</strong> Expire entries after a time threshold.
          </li>
          <li>
            <strong>Size-based eviction:</strong> Track total cache size, evict when threshold is reached.
          </li>
          <li>
            <strong>WeakMap:</strong> Use <code>WeakMap</code> for caches where entries should be garbage
            collected when keys are no longer referenced elsewhere.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">5. Subscription Leaks</h3>
        <p>
          Subscriptions to observables, event emitters, or WebSocket streams create persistent references.
        </p>
        <p>
          <strong>Common sources:</strong>
        </p>
        <ul>
          <li>RxJS observables without <code>unsubscribe()</code>.</li>
          <li>Redux store subscriptions not cleaned up.</li>
          <li>WebSocket message handlers not removed on disconnect.</li>
          <li>Custom event emitters with missing <code>removeListener</code>.</li>
        </ul>
        <p>
          <strong>Pattern:</strong> Always pair <code>subscribe()</code> with <code>unsubscribe()</code> in
          cleanup. Use React hooks like <code>useSubscription</code> or libraries that handle lifecycle
          automatically.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">6. Timer Leaks</h3>
        <p>
          <code>setTimeout</code> and <code>setInterval</code> callbacks hold references to their closure
          scope. If not cleared, they prevent garbage collection.
        </p>
        <p>
          <strong>Problem:</strong> A <code>setInterval</code> runs every second, updating component state.
          The component unmounts, but the interval continues running, holding references to stale state and
          props.
        </p>
        <p>
          <strong>Solution:</strong> Always clear timers in cleanup:
        </p>
        <ul>
          <li><code>clearTimeout(timerId)</code></li>
          <li><code>clearInterval(intervalId)</code></li>
          <li>Cancel animation frames with <code>cancelAnimationFrame(requestId)</code></li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/memory-leak-patterns.svg"
          alt="Common Memory Leak Patterns"
          caption="Memory Leak Patterns — showing event listener leaks, detached DOM trees, closure leaks, unbounded caches, and subscription leaks with reference chains"
        />
      </section>

      <section>
        <h2>Detecting Memory Leaks</h2>
        <p>
          Detection is a systematic process using browser DevTools and monitoring in production.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Chrome DevTools Heap Snapshot</h3>
        <p>
          The Heap Snapshot tool shows memory allocation at a point in time.
        </p>
        <p>
          <strong>Workflow:</strong>
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            <strong>Baseline Snapshot:</strong> Take a heap snapshot before the suspected leak scenario.
          </li>
          <li>
            <strong>Exercise the Scenario:</strong> Perform the action that may cause leaks (e.g., mount/unmount
            a component 10 times).
          </li>
          <li>
            <strong>Force GC:</strong> Click the garbage can icon to trigger garbage collection. This ensures
            unreachable objects are collected before the next snapshot.
          </li>
          <li>
            <strong>Second Snapshot:</strong> Take another heap snapshot.
          </li>
          <li>
            <strong>Compare Snapshots:</strong> Use the &quot;Comparison&quot; view to see objects that
            increased in count or size.
          </li>
        </ol>
        <p>
          <strong>What to look for:</strong>
        </p>
        <ul>
          <li>
            <strong>Increasing counts:</strong> Component instances, event listeners, or closures that should
            have been garbage collected.
          </li>
          <li>
            <strong>Detached DOM trees:</strong> Filter by &quot;Detached&quot; to find orphaned DOM nodes.
          </li>
          <li>
            <strong>Large retained size:</strong> Objects with high &quot;Retained Size&quot; are keeping
            other objects alive.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Allocation Timeline</h3>
        <p>
          The Allocation Timeline shows memory allocations over time, helping identify when and where memory
          is being allocated.
        </p>
        <p>
          <strong>Usage:</strong>
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Start recording allocations.</li>
          <li>Perform the suspected leak scenario repeatedly.</li>
          <li>Stop recording and analyze the timeline.</li>
          <li>Look for allocation patterns that grow monotonically (never decrease).</li>
        </ol>
        <p>
          <strong>Insight:</strong> Normal memory usage shows a &quot;sawtooth&quot; pattern — allocations
          increase, then drop when GC runs. A leak shows steady growth without drops.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Performance Monitor</h3>
        <p>
          Chrome&apos;s Performance Monitor (Cmd+Option+P) shows real-time metrics including JS heap size.
        </p>
        <p>
          <strong>What to watch:</strong>
        </p>
        <ul>
          <li>
            <strong>JS Heap Size:</strong> Should fluctuate but not grow unbounded. Steady growth indicates
            leaks.
          </li>
          <li>
            <strong>DOM Nodes:</strong> Should remain stable after initial load. Increasing count suggests
            detached trees or unremoved elements.
          </li>
          <li>
            <strong>Event Listeners:</strong> Should remain constant. Increasing count indicates listener leaks.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Production Monitoring</h3>
        <p>
          Detecting leaks in production requires instrumentation:
        </p>
        <ul>
          <li>
            <strong>PerformanceObserver:</strong> Monitor <code>memory</code> entries (Chrome-only) for heap
            size trends.
          </li>
          <li>
            <strong>Custom metrics:</strong> Track component mount/unmount counts, active subscriptions,
            cache sizes.
          </li>
          <li>
            <strong>Error reporting:</strong> Capture &quot;out of memory&quot; crashes with context about
            user actions.
          </li>
          <li>
            <strong>Session replay:</strong> Tools like LogRocket can help reproduce leak scenarios.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/heap-snapshot-analysis.svg"
          alt="Heap Snapshot Analysis Workflow"
          caption="Heap Snapshot Analysis — showing the workflow: Baseline → Exercise Scenario → Force GC → Compare → Identify Leaks with retention paths"
        />
      </section>

      <section>
        <h2>Prevention Patterns</h2>
        <p>
          Prevention is more effective than detection. Build memory-safe patterns into your development
          workflow.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">1. Component Lifecycle Discipline</h3>
        <p>
          Every component should follow a strict cleanup protocol:
        </p>
        <ul>
          <li>
            <strong>React:</strong> Return cleanup functions from all <code>useEffect</code> hooks that
            create subscriptions, listeners, or timers.
          </li>
          <li>
            <strong>Vue:</strong> Use <code>onUnmounted</code> to clean up reactive effects, watchers, and
            subscriptions.
          </li>
          <li>
            <strong>Angular:</strong> Implement <code>OnDestroy</code> and unsubscribe from all observables.
          </li>
        </ul>
        <p>
          <strong>Pattern:</strong> For every setup operation, document the corresponding cleanup:
        </p>
        <div className="my-4 rounded-lg bg-panel-soft p-4">
          <ul className="space-y-2 text-sm">
            <li>• <code>addEventListener</code> → <code>removeEventListener</code></li>
            <li>• <code>subscribe</code> → <code>unsubscribe</code></li>
            <li>• <code>setInterval</code> → <code>clearInterval</code></li>
            <li>• <code>setTimeout</code> → <code>clearTimeout</code></li>
            <li>• <code>requestAnimationFrame</code> → <code>cancelAnimationFrame</code></li>
            <li>• DOM ref → nullify in cleanup</li>
          </ul>
        </div>

        <h3 className="mt-8 mb-4 text-xl font-semibold">2. AbortController for Async Operations</h3>
        <p>
          Use <code>AbortController</code> to cancel pending fetch requests and other async operations when
          components unmount.
        </p>
        <p>
          <strong>Benefits:</strong>
        </p>
        <ul>
          <li>Prevents state updates on unmounted components.</li>
          <li>Releases resources held by pending requests.</li>
          <li>Avoids memory leaks from closure-captured variables.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">3. Bounded Caching</h3>
        <p>
          Implement cache eviction policies:
        </p>
        <ul>
          <li>
            <strong>LRU Cache:</strong> Remove least recently used entries when size limit is reached.
          </li>
          <li>
            <strong>TTL Cache:</strong> Expire entries after a time threshold.
          </li>
          <li>
            <strong>Size-based:</strong> Track total cache size in bytes, evict when threshold exceeded.
          </li>
        </ul>
        <p>
          <strong>Libraries:</strong> Use established cache libraries like <code>lru-cache</code> or React
          Query&apos;s built-in caching with <code>cacheTime</code> and <code>staleTime</code> options.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">4. Weak References</h3>
        <p>
          <code>WeakMap</code> and <code>WeakSet</code> hold weak references to keys, allowing garbage
          collection when keys are no longer referenced elsewhere.
        </p>
        <p>
          <strong>Use cases:</strong>
        </p>
        <ul>
          <li>
            <strong>Metadata storage:</strong> Store metadata about DOM elements without preventing GC.
          </li>
          <li>
            <strong>Instance tracking:</strong> Track object instances for debugging without affecting
            lifecycle.
          </li>
          <li>
            <strong>Private data:</strong> Emulate private fields (before native private fields existed).
          </li>
        </ul>
        <p>
          <strong>Limitation:</strong> Weak references cannot be enumerated. You cannot iterate over
          <code>WeakMap</code> keys.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">5. Virtualization for Large Lists</h3>
        <p>
          Rendering thousands of DOM nodes consumes significant memory. Virtualization (windowing) renders
          only visible items.
        </p>
        <p>
          <strong>Libraries:</strong> <code>react-window</code>, <code>react-virtualized</code>,
          <code>@tanstack/virtual</code>.
        </p>
        <p>
          <strong>Memory impact:</strong> Instead of rendering 10,000 rows (each with multiple DOM nodes),
          render only 20-30 visible rows. This reduces DOM node count by 99%+.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">6. Image and Resource Management</h3>
        <p>
          Images are major memory consumers. A 1920×1080 image at 4 bytes per pixel (RGBA) is ~8 MB
          uncompressed.
        </p>
        <p>
          <strong>Best practices:</strong>
        </p>
        <ul>
          <li>
            <strong>Lazy loading:</strong> Load images only when they enter the viewport.
          </li>
          <li>
            <strong>Responsive images:</strong> Serve appropriately sized images for the device.
          </li>
          <li>
            <strong>Unload offscreen images:</strong> Set <code>src=&quot;&quot;</code> for images that
            scroll out of view in long lists.
          </li>
          <li>
            <strong>Use modern formats:</strong> WebP and AVIF provide better compression than JPEG/PNG.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/memory-prevention-patterns.svg"
          alt="Memory Prevention Patterns"
          caption="Memory Prevention Patterns — showing component lifecycle cleanup, bounded caching with LRU eviction, WeakMap usage, and virtualization reducing DOM nodes"
        />
      </section>

      <section>
        <h2>Memory Budgets and Performance Goals</h2>
        <p>
          Set explicit memory budgets as part of your performance requirements.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Target Metrics</h3>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Metric</th>
                <th className="p-2 text-left">Target</th>
                <th className="p-2 text-left">Critical</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Initial JS Heap</td>
                <td className="p-2">{'<'}50 MB</td>
                <td className="p-2">{'>'}100 MB</td>
              </tr>
              <tr>
                <td className="p-2">Steady-State Heap</td>
                <td className="p-2">{'<'}150 MB</td>
                <td className="p-2">{'>'}300 MB</td>
              </tr>
              <tr>
                <td className="p-2">DOM Nodes</td>
                <td className="p-2">{'<'}1,500</td>
                <td className="p-2">{'>'}5,000</td>
              </tr>
              <tr>
                <td className="p-2">Event Listeners</td>
                <td className="p-2">{'<'}500</td>
                <td className="p-2">{'>'}1,000</td>
              </tr>
              <tr>
                <td className="p-2">Heap Growth Rate</td>
                <td className="p-2">Stable</td>
                <td className="p-2">Monotonic increase</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>Note:</strong> These are general guidelines. Mobile devices have stricter constraints
          (often 50-100 MB total heap limit).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Mobile Considerations</h3>
        <p>
          Mobile browsers have significantly lower memory limits:
        </p>
        <ul>
          <li>
            <strong>iOS Safari:</strong> ~200-500 MB total per tab (varies by device).
          </li>
          <li>
            <strong>Chrome Mobile:</strong> ~100-200 MB per tab.
          </li>
          <li>
            <strong>Low-end Android:</strong> As low as 50 MB.
          </li>
        </ul>
        <p>
          <strong>Impact:</strong> A memory leak that causes a 200 MB increase over an hour may be
          imperceptible on desktop but will crash mobile tabs. Always test on low-end devices.
        </p>
      </section>

      <section>
        <h2>Real-World Case Studies</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Case Study 1: Social Media Feed</h3>
        <p>
          <strong>Problem:</strong> A social media app&apos;s feed component caused tab crashes after
          scrolling through ~500 posts.
        </p>
        <p>
          <strong>Investigation:</strong> Heap snapshots revealed:
        </p>
        <ul>
          <li>Detached DOM trees: Each scrolled-off post&apos;s DOM was retained.</li>
          <li>Image cache: All loaded images remained in memory.</li>
          <li>Event listeners: Intersection observers were not cleaned up.</li>
        </ul>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul>
          <li>Implemented virtualization (react-window) to render only visible posts.</li>
          <li>Added image unloading for offscreen posts.</li>
          <li>Properly disconnected IntersectionObserver on unmount.</li>
        </ul>
        <p>
          <strong>Result:</strong> Memory usage dropped from 800 MB to 80 MB after scrolling 1,000 posts.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Case Study 2: Dashboard Application</h3>
        <p>
          <strong>Problem:</strong> Analytics dashboard became sluggish after 2-3 hours of use.
        </p>
        <p>
          <strong>Investigation:</strong> Allocation timeline showed:
        </p>
        <ul>
          <li>Chart instances accumulating: Old charts were not destroyed before creating new ones.</li>
          <li>WebSocket handlers: Each reconnection added new message handlers without removing old ones.</li>
          <li>Timer leak: <code>setInterval</code> for auto-refresh was never cleared.</li>
        </ul>
        <p>
          <strong>Solution:</strong>
        </p>
        <ul>
          <li>Called chart library&apos;s <code>destroy()</code> method before unmount.</li>
          <li>Refactored WebSocket subscription to use a single handler with cleanup.</li>
          <li>Added cleanup function to clear interval on unmount.</li>
        </ul>
        <p>
          <strong>Result:</strong> Memory remained stable at ~120 MB over 8-hour sessions.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/memory-case-studies.svg"
          alt="Memory Leak Case Studies"
          caption="Case Studies — showing before/after memory profiles for social media feed and dashboard application with identified leak sources and fixes"
        />
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does JavaScript garbage collection work?</p>
            <p className="mt-2 text-sm">
              A: JavaScript uses automatic garbage collection with mark-and-sweep algorithm. Modern engines
              use generational GC — objects start in Young Generation (frequent minor GC), survivors move to
              Old Generation (infrequent major GC). The collector marks reachable objects from roots, then
              sweeps unmarked objects. V8 also uses incremental and concurrent GC to reduce pause times.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What are common causes of memory leaks in React applications?</p>
            <p className="mt-2 text-sm">
              A: Common causes include: (1) Event listeners not removed in useEffect cleanup, (2) Subscriptions
              not unsubscribed on unmount, (3) Timers (setInterval/setTimeout) not cleared, (4) Closures
              capturing large objects in async callbacks, (5) Unbounded caches storing API responses, (6)
              Detached DOM trees from refs not nullified, (7) Third-party libraries not properly destroyed.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you detect a memory leak in production?</p>
            <p className="mt-2 text-sm">
              A: In development, use Chrome DevTools Heap Snapshot comparison and Allocation Timeline. In
              production, instrument with PerformanceObserver for memory metrics, track custom metrics
              (component counts, cache sizes), monitor JS heap growth trends, and capture OOM crashes with
              session context. Set up alerts for monotonic heap growth over time.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the difference between WeakMap and Map?</p>
            <p className="mt-2 text-sm">
              A: Map holds strong references to keys, preventing garbage collection. WeakMap holds weak
              references — if a key is no longer referenced elsewhere, it can be garbage collected along
              with its value. WeakMap cannot be iterated (no keys() method) and has no size property. Use
              WeakMap for metadata storage, instance tracking, or caching where entries should auto-cleanup.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent memory leaks in single-page applications?</p>
            <p className="mt-2 text-sm">
              A: Follow lifecycle discipline: cleanup in useEffect return, onUnmounted, or ngOnDestroy. Use
              AbortController for async operations. Implement bounded caches with LRU/TTL eviction. Virtualize
              long lists. Unload offscreen images. Nullify DOM refs. Avoid global state for transient data.
              Use WeakMap/WeakSet for object metadata. Test with DevTools and on low-memory devices.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why do mobile devices have stricter memory constraints?</p>
            <p className="mt-2 text-sm">
              A: Mobile devices have limited RAM (2-8 GB vs 8-64 GB desktop), shared with OS and other apps.
              Mobile browsers are allocated a fraction of total RAM (often 100-200 MB per tab). Thermal
              constraints limit sustained CPU usage for GC. Network constraints make large allocations more
              costly. Design for mobile-first memory budgets (~50 MB initial, ~150 MB steady-state).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.chrome.com/docs/devtools/memory-problems/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Chrome DevTools - Memory Problems Reference
            </a>
          </li>
          <li>
            <a href="https://javascript.info/garbage-collection" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              JavaScript.info - Garbage Collection
            </a>
          </li>
          <li>
            <a href="https://web.dev/memory/ " className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev - Memory Optimization
            </a>
          </li>
          <li>
            <a href="https://v8.dev/blog/trash-talk" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              V8 Blog - Trash Talk: Garbage Collection in V8
            </a>
          </li>
          <li>
            <a href="https://react.dev/learn/synchronizing-with-effects#cleaning-up-after-effects" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React Documentation - Cleaning Up After Effects
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
