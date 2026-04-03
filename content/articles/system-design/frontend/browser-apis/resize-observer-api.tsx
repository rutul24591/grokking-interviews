"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-resize-observer-api",
  title: "Resize Observer API",
  description:
    "Comprehensive guide to Resize Observer API covering element resize detection, performance considerations, container-based responsive design, and production-scale implementation patterns.",
  category: "frontend",
  subcategory: "browser-apis",
  slug: "resize-observer-api",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-02",
  tags: [
    "frontend",
    "browser API",
    "resize observer",
    "responsive",
    "performance",
    "layout",
  ],
  relatedTopics: [
    "intersection-observer-api",
    "mutation-observer-api",
    "responsive-design",
  ],
};

export default function ResizeObserverAPIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Resize Observer API</strong> provides a programmatic way to observe changes to an element&apos;s size. Instead of listening to window resize events (which fire for any viewport change) or polling element dimensions (repeatedly calling getBoundingClientRect), Resize Observer notifies you when specific elements change size. This API is essential for responsive components that adapt to container size, canvas/SVG elements that need to match container dimensions, and layout calculations that depend on element size.
        </p>
        <p>
          For staff-level engineers, Resize Observer represents a shift from window-based resize handling to element-based observation. Before this API, responsive components listened to window resize events, calculated their own dimensions with getBoundingClientRect, and throttled to avoid performance issues. Resize Observer provides direct notification when an element&apos;s size changes, without manual dimension calculation or throttling. This is fundamentally more efficient and accurate than window resize events, which fire for any viewport change (even if the element&apos;s size does not change).
        </p>
        <p>
          Resize Observer involves several technical considerations. Box type defines what size to observe: content-box (content area only, default), border-box (including padding and border), device-pixel-content-box (physical pixels, for high-DPI canvas rendering). Performance is excellent when used correctly — observing too many elements or triggering more layout in callback can cause layout thrashing. Resize entries provide size information (contentRect, borderBoxSize, contentBoxSize) without requiring manual dimension calculation. Disconnect must be called to stop observing and prevent memory leaks.
        </p>
        <p>
          The business case for Resize Observer is efficient responsive behavior. Container queries (CSS) handle many cases (style changes based on container size), but JavaScript is needed for complex responsive logic (change component behavior, not just styles). Resize Observer enables container-based responsive design without window resize event overhead. For component libraries, data visualization, video players, and any component that needs to adapt to container size — Resize Observer is essential for modern responsive design.
        </p>
        <p>
          Resize Observer is particularly important for component libraries and design systems. Components need to adapt to container size (not just viewport size) — a component in a sidebar needs different behavior than the same component in main content. CSS container queries handle style changes, but JavaScript is needed for behavior changes (e.g., switch from grid to list view, change number of columns, simplify controls). Resize Observer provides the JavaScript-side of container-based responsive design.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Observer:</strong> The ResizeObserver instance that watches for size changes. Created with callback function that receives array of ResizeObserverEntry objects describing the size changes. A single observer can efficiently watch multiple target elements, with the browser batching observations and invoking the callback only when size changes actually occur. The callback receives an array of ResizeObserverEntry objects, each describing the size change of one target element.
          </li>
          <li>
            <strong>Target:</strong> The element(s) being observed for size changes. Call observer.observe(element) to start watching an element. Call observer.unobserve(element) to stop watching a specific element. Call observer.disconnect() to stop watching all elements and clean up the observer. Multiple targets can be observed with a single observer, which is more efficient than creating multiple observers.
          </li>
          <li>
            <strong>ResizeObserverEntry:</strong> The object passed to the callback describing a size change. Properties include: target (the observed element), contentRect (DOMRect with size — x, y, width, height, top, right, bottom, left), borderBoxSize (array of sizes — includes padding and border), contentBoxSize (array of sizes — content area only). Use these properties to determine the element&apos;s new size and respond accordingly.
          </li>
          <li>
            <strong>Box Types:</strong> content-box (default) — observe content area size (excludes padding and border). border-box — observe including padding and border (total rendered size). device-pixel-content-box — observe in physical pixels (for high-DPI canvas rendering, size varies by device pixel ratio). Choose box type based on use case: content-box for most cases, border-box when total size matters, device-pixel-content-box for canvas rendering.
          </li>
          <li>
            <strong>Asynchronous Delivery:</strong> Resize notifications are delivered asynchronously (after layout, before paint). This prevents blocking layout (callback is invoked after layout is complete, so size calculations are accurate). Browser batches multiple resizes and invokes callback once, avoiding redundant callback invocations. Callback is not invoked immediately when element resizes, but rather after layout is complete and before paint.
          </li>
          <li>
            <strong>Disconnect:</strong> Call observer.disconnect() to stop observing all elements and clean up the observer. This is essential for cleanup: the observer holds references to observed elements, preventing garbage collection if not disconnected. Always call disconnect when the component unmounts or when observation is no longer needed. In React, call disconnect in the useEffect cleanup function. In other frameworks, call disconnect in the appropriate lifecycle hook.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/resize-observer-flow.svg"
          alt="Resize Observer Flow showing observer watching element and receiving resize entries when size changes"
          caption="Resize Observer flow — observer watches target element, callback receives ResizeObserverEntry with contentRect and box sizes"
          width={900}
          height={550}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Resize Observer architecture consists of observer creation (with callback), target registration (observe elements), and resize handling (process ResizeObserverEntry array). The architecture must handle batching (multiple resizes delivered together in a single callback invocation), avoid layout thrashing (do not trigger more layout in callback — use provided size information instead of reading layout properties), and cleanup (disconnect when done to prevent memory leaks and stale callbacks).
        </p>
        <p>
          The observer runs asynchronously after layout and before paint, which means it is invoked after element size is calculated and before the browser paints the frame. This ensures that size calculations are accurate (layout is complete before callback is invoked) and that callback can update styles before paint (callback can update styles, browser paints updated styles in same frame). This is fundamentally more efficient than window resize events, which fire at arbitrary times (not necessarily after layout is complete).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/responsive-component-patterns.svg"
          alt="Responsive Component Patterns showing container-based responsive design with Resize Observer"
          caption="Responsive component patterns — container queries for CSS, Resize Observer for JavaScript logic; both enable container-based responsive design"
          width={900}
          height={500}
        />

        <h3>Common Use Cases</h3>
        <p>
          <strong>Responsive Canvas/SVG:</strong> Observe container, resize canvas/SVG to match container size. Update resolution for high-DPI displays (multiply canvas size by devicePixelRatio for sharp rendering). More efficient than window resize — only resizes when container changes, not viewport. Use device-pixel-content-box for accurate physical pixel size. This pattern is essential for data visualization (charts, graphs, maps) that need to match container size and render sharply on high-DPI displays.
        </p>
        <p>
          <strong>Container-Based Responsive Logic:</strong> Change component behavior based on container size (not viewport). Example: show simplified view in narrow sidebar, full view in main content. CSS container queries handle style changes (font size, padding, colors), Resize Observer handles JavaScript logic (switch from grid to list view, change number of columns, simplify controls). This pattern is essential for component libraries and design systems where components need to adapt to container size.
        </p>
        <p>
          <strong>Layout Calculations:</strong> Calculate positions, sizes based on element dimensions. Example: position tooltip relative to target (calculate tooltip position based on target size and position), calculate scroll progress (calculate scroll progress based on container size and scroll position). Resize Observer ensures calculations stay accurate when elements resize (recalculate when element size changes). This pattern is essential for tooltips, popovers, dropdowns, and any component that needs to calculate position based on element size.
        </p>
        <p>
          <strong>Virtual Scrolling:</strong> Observe scroll container size, recalculate visible items. When container resizes, different number of items are visible (e.g., wider container shows more columns). Resize Observer triggers recalculation efficiently (only recalculates when container size changes, not on every scroll). This pattern is essential for virtual scrolling libraries (react-window, react-virtualized) that need to recalculate visible items when container resizes.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/resize-observer-use-cases.svg"
          alt="Resize Observer Use Cases showing canvas resize, container-based logic, and layout calculations"
          caption="Resize Observer use cases — responsive canvas/SVG, container-based responsive logic, layout calculations, virtual scrolling"
          width={900}
          height={500}
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Resize Observer involves trade-offs between convenience, performance, browser support, and layout thrashing. Understanding these trade-offs is essential for making informed decisions about when to use Resize Observer and when to use alternative approaches.
        </p>

        <h3>Resize Observer vs. Window Resize Events</h3>
        <p>
          <strong>Window Resize Events:</strong> Listen to window resize event, calculate element dimensions with getBoundingClientRect. Advantages: works everywhere (all browsers support window resize events), simple (no special API required). Limitations: fires for any viewport change (even if element does not change size), requires throttling (window resize events fire at refresh rate, can cause performance issues), manual dimension calculation (must call getBoundingClientRect for each element, forces layout recalculation). Best for: legacy browser support, simple responsive logic (when element size always changes with viewport).
        </p>
        <p>
          <strong>Resize Observer:</strong> Direct notification when element resizes. Advantages: only fires when element changes size (not any viewport change), no throttling needed (browser batches efficiently), provides size directly (no manual getBoundingClientRect needed — size is provided in ResizeObserverEntry). Limitations: newer API (Internet Explorer not supported, requires polyfill for older browsers), can cause layout thrashing if misused (reading layout properties in callback forces more layout). Best for: modern browsers, element-specific resize handling, container-based responsive design.
        </p>
        <p>
          <strong>Hybrid Approach:</strong> Use Resize Observer where available, fall back to window resize events for older browsers. Detect API support using feature detection (&apos;ResizeObserver&apos; in window). If supported, use Resize Observer. If not supported, fall back to window resize events with throttling. This provides the best of both worlds: modern performance in modern browsers, compatibility in older browsers.
        </p>

        <h3>Box Type Trade-offs</h3>
        <p>
          <strong>Content-Box (default):</strong> Observe content area size (excludes padding and border). Advantages: matches CSS content dimensions (what you typically care about for layout), stable (does not change when padding/border change). Limitations: does not include padding/border (if total size matters, content-box is not sufficient). Best for: most use cases (component layout, canvas size, responsive logic).
        </p>
        <p>
          <strong>Border-Box:</strong> Observe including padding and border (total rendered size). Advantages: matches element&apos;s total rendered size (what you typically care about for positioning). Limitations: changes when border/padding change (if padding/border change, callback is invoked even if content size does not change). Best for: when total size matters (positioning tooltips, popovers, dropdowns).
        </p>
        <p>
          <strong>Device-Pixel-Content-Box:</strong> Observe in physical pixels (size varies by device pixel ratio). Advantages: accurate for high-DPI canvas rendering (canvas needs physical pixel size for sharp rendering). Limitations: varies by device pixel ratio (callback is invoked when device pixel ratio changes, e.g., when moving window between monitors with different DPI). Best for: canvas, WebGL rendering (needs physical pixel size for sharp rendering).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/responsive-component-patterns.svg"
          alt="Resize Observer Trade-offs showing window resize vs Resize Observer, box types, CSS container queries vs JS"
          caption="Resize Observer trade-offs — window resize (fires for viewport) vs Resize Observer (fires for element), content-box vs border-box vs device-pixel, CSS container queries vs JS Resize Observer"
          width={900}
          height={500}
        />
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Avoid Layout Thrashing:</strong> Do not read layout properties (offsetWidth, getBoundingClientRect, etc.) in callback — this forces synchronous layout recalculation (layout thrashing). Use provided size information (contentRect, borderBoxSize, contentBoxSize) instead. These properties are provided by the browser and do not force layout recalculation. This pattern ensures that callback is efficient (does not cause additional layout recalculation).
          </li>
          <li>
            <strong>Do Not Resize Observed Element:</strong> Resizing observed element in callback causes infinite loop (callback resizes element, which triggers more resize, which invokes callback again). Resize different element (e.g., resize child element, not observed container). Or use flag to prevent recursive resize (let isResizing = false; if (not isResizing) isResizing = true, resize, isResizing = false). This pattern prevents infinite loops and ensures that callback is invoked only once per resize.
          </li>
          <li>
            <strong>Use Appropriate Box Type:</strong> Default (content-box) works for most cases. Use border-box when total size matters (positioning tooltips, popovers, dropdowns). Use device-pixel-content-box for canvas rendering (needs physical pixel size for sharp rendering). Choosing appropriate box type ensures that callback is invoked only when relevant size changes (not when irrelevant size changes).
          </li>
          <li>
            <strong>Disconnect on Cleanup:</strong> Call disconnect() when component unmounts or observation is no longer needed. This prevents memory leaks (observer holds references to observed elements, preventing garbage collection) and stale callbacks (callback will be invoked for elements that are no longer in the DOM). In React, call disconnect in the useEffect cleanup function. In other frameworks, call disconnect in the appropriate lifecycle hook.
          </li>
          <li>
            <strong>Batch Processing:</strong> Callback receives array of entries — process all together, not individually. For example, collect all new sizes, then apply all changes at once. This is more efficient than handling each resize separately (e.g., do not update layout for each entry, update layout once with all entries). Batching reduces overhead and ensures that changes are applied consistently.
          </li>
          <li>
            <strong>Combine with Container Queries:</strong> CSS container queries handle style changes based on container size (font size, padding, colors). Resize Observer handles JavaScript logic based on container size (switch from grid to list view, change number of columns, simplify controls). Use both for complete container-based responsive design. This pattern provides the best of both worlds: CSS handles styles, JavaScript handles logic.
          </li>
        </ul>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Infinite Loop:</strong> Resizing observed element in callback triggers callback again (callback resizes element, which triggers more resize, which invokes callback again). Causes infinite loop (browser may crash or become unresponsive). Solution: resize different element (e.g., resize child element, not observed container), or use flag to prevent recursive resize (let isResizing = false; if (not isResizing) isResizing = true, resize, isResizing = false). Best: observe container, resize child element (different elements).
          </li>
          <li>
            <strong>Layout Thrashing:</strong> Reading layout properties (offsetWidth, getBoundingClientRect, etc.) in callback forces synchronous layout recalculation (layout thrashing). This causes performance issues (layout is recalculated multiple times per frame, causing jank). Use provided size information (contentRect, borderBoxSize, contentBoxSize) instead. These properties are provided by the browser and do not force layout recalculation.
          </li>
          <li>
            <strong>Not Disconnecting:</strong> Forgetting to disconnect causes memory leaks (observer holds references to observed elements, preventing garbage collection) and stale callbacks (callback will be invoked for elements that are no longer in the DOM). Always disconnect when observation is no longer needed. In React, call disconnect in the useEffect cleanup function. In other frameworks, call disconnect in the appropriate lifecycle hook.
          </li>
          <li>
            <strong>Wrong Box Type:</strong> Using default (content-box) when border-box size is needed. Canvas rendered at wrong size (canvas needs physical pixel size for sharp rendering, use device-pixel-content-box). Tooltip positioned incorrectly (tooltip needs total size for positioning, use border-box). Choose box type based on use case (content-box for most cases, border-box for positioning, device-pixel-content-box for canvas).
          </li>
          <li>
            <strong>Observing Too Many Elements:</strong> Observing hundreds of elements can cause performance issues (callback is invoked for each element that resizes, processing many entries can be slow). Observe parent container instead (observe container, calculate child sizes from container size), or use single observer for related elements (single observer for all elements, batch processing). This pattern reduces overhead and ensures that callback is efficient.
          </li>
          <li>
            <strong>No Fallback:</strong> Resize Observer is not supported in Internet Explorer. If you need to support Internet Explorer, provide fallback (window resize event with throttling, calculate element dimensions with getBoundingClientRect). Use feature detection (&apos;ResizeObserver&apos; in window) to detect support and conditionally use Resize Observer or fallback. For most projects, use Resize Observer with fallback for Internet Explorer.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Responsive Canvas Charts</h3>
        <p>
          Charting libraries (Chart.js, D3, ECharts) use Resize Observer to resize canvas when container changes. Observe container with Resize Observer, when container resizes, resize canvas to match container size. For high-DPI displays, multiply canvas size by devicePixelRatio (canvas.width = containerWidth * devicePixelRatio, canvas.height = containerHeight * devicePixelRatio, canvas.style.width = containerWidth + &apos;px&apos;, canvas.style.height = containerHeight + &apos;px&apos;). Redraw chart with new size (update chart dimensions, redraw). More efficient than window resize — only redraws when chart container changes, not entire viewport. This pattern ensures that charts match container size and render sharply on high-DPI displays.
        </p>

        <h3>Container-Based Component Behavior</h3>
        <p>
          Component libraries (Material UI, Ant Design, custom design systems) change behavior based on container size. Observe container with Resize Observer, when container resizes, change component behavior (e.g., switch from grid to list view when container is narrow, change number of columns when container is wide, simplify controls when container is narrow). CSS container queries handle style changes (font size, padding, colors), Resize Observer handles JavaScript logic (behavior changes). This pattern enables container-based responsive design (components adapt to container size, not just viewport size).
        </p>

        <h3>Virtual Scroll Containers</h3>
        <p>
          Virtual scrolling libraries (react-window, react-virtualized, AG Grid) observe scroll container size. When container resizes, recalculate how many items are visible (e.g., wider container shows more columns, taller container shows more rows). Update rendered items accordingly (add/remove items based on new visible count). Efficient — only recalculates when container size changes, not on every scroll. This pattern ensures that virtual scrolling stays accurate when container resizes (users see correct number of items, no blank spaces or overlapping items).
        </p>

        <h3>Responsive Video Players</h3>
        <p>
          Video players (YouTube, Vimeo, custom video players) observe container, adjust aspect ratio, controls layout. Observe container with Resize Observer, when container resizes, adjust video size to match container (maintain aspect ratio), adjust controls layout (e.g., switch from horizontal controls to vertical controls when container is narrow, hide controls when container is very narrow). Resize Observer ensures that video player adapts to container, not just viewport. This pattern ensures that video players match container size and provide good user experience on all container sizes.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does Resize Observer work and why is it better than window resize events?
            </p>
            <p className="mt-2 text-sm">
              A: Resize Observer asynchronously observes element size changes and notifies via callback. Better than window resize because: element-specific (only fires when observed element changes size, not any viewport change), no throttling needed (browser batches efficiently, callback is invoked once after layout is complete), provides size directly (no manual getBoundingClientRect needed — size is provided in ResizeObserverEntry). Window resize fires for every viewport change (even if element does not change size), requires throttling (window resize fires at refresh rate), manual dimension calculation (must call getBoundingClientRect for each element, forces layout recalculation). Resize Observer avoids all of these problems.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you avoid infinite loops with Resize Observer?
            </p>
            <p className="mt-2 text-sm">
              A: Infinite loop occurs when callback resizes observed element, triggering callback again (callback resizes element, which triggers more resize, which invokes callback again). Solutions: (1) Resize different element — do not resize what you observe (e.g., resize child element, not observed container). (2) Use flag — let isResizing = false; if (not isResizing) isResizing = true, resize, isResizing = false. (3) Debounce resize in callback (delay resize until after period of no resizes). Best: observe container, resize child element (different elements, no infinite loop). This pattern prevents infinite loops and ensures that callback is invoked only once per resize.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What box type should you use for Resize Observer?
            </p>
            <p className="mt-2 text-sm">
              A: Depends on use case: (1) content-box (default) — for most cases, matches CSS content dimensions (what you typically care about for layout). (2) border-box — when total rendered size matters (including padding and border, what you typically care about for positioning). (3) device-pixel-content-box — for canvas/WebGL rendering, provides physical pixel size for high-DPI displays (canvas needs physical pixel size for sharp rendering). Example: canvas rendering needs device-pixel-content-box to set correct resolution (canvas.width = containerWidth * devicePixelRatio, canvas.height = containerHeight * devicePixelRatio).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle browser support for Resize Observer?
            </p>
            <p className="mt-2 text-sm">
              A: Resize Observer is supported in all modern browsers (Chrome 64+, Firefox 69+, Safari 13.1+, Edge 79+). Not supported in Internet Explorer. Use feature detection (&apos;ResizeObserver&apos; in window) to detect support. If supported, use Resize Observer. If not supported, provide fallback (window resize event with throttling, calculate element dimensions with getBoundingClientRect). Use polyfill (resize-observer-polyfill) if you need Resize Observer functionality in Internet Explorer, but be aware that polyfill uses window resize events internally, so it does not provide the same performance benefits as native Resize Observer. For most projects, use Resize Observer with fallback for Internet Explorer.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you use Resize Observer for responsive canvas?
            </p>
            <p className="mt-2 text-sm">
              A: Observe canvas container with Resize Observer. When container resizes, resize canvas to match container size by setting canvas style width and height. For high-DPI displays, multiply canvas size by devicePixelRatio for sharp rendering. Redraw canvas with new size. Use device-pixel-content-box for accurate physical pixel size by specifying the box option when observing the container. This pattern ensures that canvas matches container size and renders sharply on high-DPI displays.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: When should you NOT use Resize Observer?
            </p>
            <p className="mt-2 text-sm">
              A: Avoid Resize Observer when: (1) Simple style changes — use CSS container queries instead (CSS handles style changes based on container size, no JavaScript needed). (2) Internet Explorer support required without polyfill (Resize Observer is not supported in Internet Explorer). (3) Observing hundreds of elements — can cause performance issues (callback is invoked for each element that resizes, processing many entries can be slow; observe parent container instead). (4) You need resize before layout — Resize Observer fires after layout is complete (if you need resize before layout, use window resize events with throttling). For simple responsive styles, CSS container queries are more efficient than JavaScript-based Resize Observer.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN — Resize Observer API
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/resize-observer/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Web.dev — Resize Observer Guide
            </a>
          </li>
          <li>
            <a
              href="https://css-tricks.com/resize-observer/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              CSS-Tricks — Resize Observer Guide
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/TR/resize-observer/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              W3C — Resize Observer Specification
            </a>
          </li>
          <li>
            <a
              href="https://caniuse.com/resizeobserver"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Can I Use — Resize Observer Browser Support
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );

}
