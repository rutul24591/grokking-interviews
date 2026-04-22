"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { Highlight } from "@/components/articles/Highlight";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-virtualization-windowing",
  title: "Virtualization/Windowing (for Long Lists)",
  description: "Comprehensive guide to list virtualization techniques for rendering large datasets efficiently, covering windowing algorithms, library options, and performance optimization strategies.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "virtualization-windowing",
  wordCount: 6100,
  readingTime: 25,
  lastUpdated: "2026-03-30",
  tags: ["frontend", "performance", "virtualization", "windowing", "react-window", "react-virtual", "infinite-scroll", "large-lists"],
  relatedTopics: ["lazy-loading", "web-vitals", "bundle-size-optimization", "memoization-and-react-memo"],
};

export default function VirtualizationWindowingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition & Context</h2>
        <HighlightBlock as="p" tier="crucial">
          <strong>Virtualization</strong> (also called <strong>windowing</strong>) is a rendering optimization 
          technique that{" "}
          <Highlight tier="important">
            only mounts DOM elements for the items currently visible
          </Highlight>{" "}
          in the viewport, plus a 
          small buffer zone above and below. Instead of rendering 10,000 list items and creating 10,000 DOM 
          nodes, a virtualized list might only render 20-30 nodes at any given time — regardless of the total 
          dataset size.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The technique works by calculating which items are visible based on the scroll position and 
          container dimensions, then positioning only those items within a container whose total height 
          matches what the full list would occupy. As the user scrolls, items that leave the viewport are 
          unmounted and recycled for newly visible items. This recycling is why the technique is called 
          &quot;virtualization&quot; — items appear to exist in the DOM, but they&apos;re actually being 
          dynamically created and destroyed as needed.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/virtualization-concept.svg"
          alt="Diagram comparing non-virtualized list (10000 DOM nodes) vs virtualized list (20-30 DOM nodes) with viewport highlighting"
          caption="Virtualization reduces thousands of DOM nodes to just the visible items plus a small buffer"
          captionTier="important"
        />

        <p>
          The performance impact of virtualization is dramatic:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Initial Render:</strong> Rendering 10,000 DOM nodes takes 2-5 seconds, during which 
            the main thread is blocked and the page is unresponsive. Virtualization reduces this to 5-15ms.
          </li>
          <li>
            <strong>Memory Usage:</strong> Each DOM node uses ~0.5-1KB of memory. 10,000 rows with nested 
            elements can consume 50-100MB of browser memory. Virtualization keeps memory usage under 5MB.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Scroll Performance:</strong> Non-virtualized lists scroll at 15-30fps with visible 
            stuttering. Virtualized lists maintain 55-60fps smooth scrolling.
          </HighlightBlock>
          <li>
            <strong>Time to Interactive:</strong> Non-virtualized lists take 3-8 seconds to become 
            interactive. Virtualized lists are interactive in under 100ms.
          </li>
        </ul>

        <p>
          Virtualization is essential for any application that displays large datasets:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Data Tables:</strong> Admin dashboards, financial applications, analytics platforms 
            often display thousands of rows.
          </li>
          <li>
            <strong>Search Results:</strong> E-commerce sites, job boards, and content platforms can 
            return tens of thousands of results.
          </li>
          <li>
            <strong>Message Threads:</strong> Chat applications, email clients, and comment sections 
            can have thousands of messages.
          </li>
          <li>
            <strong>Logs and Monitoring:</strong> DevOps tools display continuous streams of log data 
            that can grow indefinitely.
          </li>
        </ul>

        <p>
          In system design interviews, virtualization demonstrates understanding of the DOM bottleneck, 
          rendering performance, memory management, and the trade-offs between rendering completeness 
          and runtime efficiency. It&apos;s a practical technique that shows you&apos;ve dealt with 
          real-world scale.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>
        <HighlightBlock as="p" tier="crucial">
          Core idea: keep DOM node count bounded. Virtualization is how you maintain responsiveness when the
          dataset is large, and it&apos;s often the difference between passing and failing INP under load.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Key knobs are measurement (fixed vs variable height) and overscan. Both are correctness and UX levers, not just performance.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Be able to explain why DOM size is expensive: memory, layout, paint, and event handling overhead.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/virtualization-scroll-mechanics.svg"
          alt="Diagram showing virtualization scroll mechanics with outer container, inner container, visible items, and overscan buffer"
          caption="Virtualization anatomy: outer container scrolls, inner container sets height, visible items are positioned absolutely"
          captionTier="important"
        />

        <h3>The DOM Bottleneck</h3>
        <p>
          To understand why virtualization is necessary, you need to understand the performance 
          characteristics of the DOM:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Memory Cost:</strong> Each DOM node consumes memory for the node object itself, 
            plus any associated event listeners, styles, and layout information. A simple &lt;div&gt; 
            with text content uses ~0.5KB. A list item with nested elements (avatar, text, metadata, 
            actions) can easily exceed 2KB.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Initial Render Cost:</strong> Creating DOM nodes is expensive. The browser must 
            parse HTML, create node objects, calculate styles, compute layout, and paint pixels. For 
            10,000 nodes, this takes 2-5 seconds on mid-tier devices.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Layout Cost:</strong> Any style change triggers layout recalculation. With thousands 
            of nodes, a single setState can cause the browser to recalculate layout for the entire tree, 
            blocking the main thread for hundreds of milliseconds.
          </HighlightBlock>
          <li>
            <strong>Paint Cost:</strong> During scroll, the browser must repaint visible content. With 
            thousands of elements, maintaining 60fps (16.67ms per frame) becomes impossible.
          </li>
        </ul>

        <h3>How Windowing Works</h3>
        <p>
          The core virtualization algorithm is straightforward:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>Calculate Visible Range:</strong> Given the scroll offset, container height, and 
            item size, calculate which items are visible. For fixed-height items: 
            <code>startIndex = floor(scrollTop / itemHeight)</code> and 
            <code>endIndex = ceil((scrollTop + containerHeight) / itemHeight)</code>.
          </li>
          <li>
            <strong>Add Overscan Buffer:</strong> Render extra items above and below the visible range 
            (typically 3-5 items in each direction) to prevent flicker during fast scrolling.
          </li>
          <li>
            <strong>Position Items:</strong> Absolutely position each visible item at its calculated 
            offset within a tall inner container. The inner container&apos;s height equals the total 
            height of all items combined.
          </li>
          <li>
            <strong>Recycle on Scroll:</strong> As the user scrolls, items that leave the viewport are 
            unmounted. Newly visible items are mounted. The DOM node count stays constant.
          </li>
        </ol>

        <h3>Fixed-Height vs. Variable-Height Items</h3>
        <p>
          Virtualization is simplest when all items have the same height, but real-world lists often 
          have variable heights:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Fixed-Height:</strong> All items have the same known height (e.g., 48px per row). 
            Calculation is O(1): visible indices are derived directly from scroll position. This is 
            the fastest and most reliable approach.
          </li>
          <li>
            <strong>Variable-Height (Known):</strong> Item heights vary but are known ahead of time 
            (e.g., from API response). The virtualizer maintains a position map and uses binary search 
            to find visible items. Slightly more complex but still efficient.
          </li>
          <li>
            <strong>Variable-Height (Dynamic):</strong> Item heights aren&apos;t known until rendered 
            (e.g., user-generated content with varying text length). The virtualizer must measure items 
            after render and update position estimates. This can cause scroll position jumps if not 
            handled carefully.
          </li>
        </ul>

        <h3>Overscan and Buffer Zones</h3>
        <p>
          <strong>Overscan</strong> is the number of extra items rendered above and below the visible 
          viewport. Without overscan, fast scrolling would reveal blank spaces as new items load. With 
          overscan, there&apos;s a buffer of pre-rendered items ready to display.
        </p>
        <p>
          Choosing the right overscan value is a trade-off:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Too small (0-2 items):</strong> Users may see blank spaces during fast scrolling 
            as new items haven&apos;t rendered yet.
          </li>
          <li>
            <strong>Optimal (3-5 items):</strong> Provides smooth scrolling without excessive DOM nodes. 
            Works well for most use cases.
          </li>
          <li>
            <strong>Too large (10+ items):</strong> Reduces the benefit of virtualization by rendering 
            more items than necessary.
          </li>
        </ul>

        <h3>Virtualization vs. Infinite Scroll</h3>
        <p>
          Virtualization and infinite scroll are complementary but distinct patterns:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Virtualization</strong> keeps the DOM small by only rendering visible items. The 
            full dataset is already loaded; only the rendering is deferred.
          </li>
          <li>
            <strong>Infinite Scroll</strong> loads data incrementally as the user scrolls. The dataset 
            grows over time, and without virtualization, the DOM would grow indefinitely.
          </li>
          <li>
            <strong>Combined:</strong> For datasets too large to load at once (millions of records), 
            combine virtualization with infinite scroll. Virtualization keeps the DOM small while 
            infinite scroll fetches data in pages.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture & Flow</h2>
        <HighlightBlock as="p" tier="crucial">
          Architecture: outer scroll container + inner spacer + absolutely positioned visible items + overscan.
          Senior answers include how you handle variable heights, scroll restoration, and accessibility.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Virtualization is often paired with pagination/infinite scroll. Explain why these solve different problems (data vs DOM).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Validation is required: measure INP, dropped frames, and memory before/after. Virtualization that breaks UX is not a win.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/virtualization-overscan.svg"
          alt="Diagram showing overscan buffer zones above and below viewport with items being mounted/unmounted during scroll"
          caption="Overscan buffers prevent blank spaces during fast scrolling by pre-rendering items outside the viewport"
          captionTier="important"
        />

        <h3>Virtualization Component Architecture</h3>
        <HighlightBlock as="p" tier="important">
          The main correctness knobs in real systems are{" "}
          <Highlight tier="important">item measurement</Highlight> (fixed vs variable height) and{" "}
          <Highlight tier="important">overscan</Highlight> (too low flickers; too high defeats the DOM savings).
        </HighlightBlock>
        <p>
          A virtualized list consists of several layers:
        </p>

        <h4>Outer Container</h4>
        <p>
          A scrollable element with <code>overflow: auto</code> and a fixed height. This is what the 
          user actually scrolls. The outer container&apos;s scroll events trigger recalculation of 
          visible items.
        </p>

        <h4>Inner Container</h4>
        <p>
          A tall element whose height equals the total height of all items combined. For 10,000 items 
          at 48px each, the inner container is 480,000px tall. This creates the correct scrollbar size 
          and scroll range. The inner container uses <code>position: relative</code> to establish a 
          positioning context for visible items.
        </p>

        <h4>Visible Items</h4>
        <p>
          Absolutely positioned elements placed at their calculated offsets within the inner container. 
          Only items in the visible range plus overscan are rendered. Each item uses 
          <code>position: absolute</code> with <code>top</code> set to its calculated offset.
        </p>

        <h4>Item Renderer</h4>
        <p>
          A function or component that renders individual items. The renderer receives the item index 
          and style (for positioning) as props. For optimal performance, item renderers should be 
          memoized to prevent unnecessary re-renders.
        </p>

        <h3>Scroll Event Flow</h3>
        <p>
          The scroll event flow in a virtualized list:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>User Scrolls:</strong> The browser fires a scroll event on the outer container.
          </li>
          <li>
            <strong>Calculate Visible Range:</strong> The virtualizer reads the new scrollTop value 
            and calculates which items are now visible.
          </li>
          <li>
            <strong>Update State:</strong> The virtualizer updates its internal state with the new 
            visible range. This triggers a re-render.
          </li>
          <li>
            <strong>Render Visible Items:</strong> React renders only the visible items plus overscan. 
            Items that left the viewport are unmounted; newly visible items are mounted.
          </li>
          <li>
            <strong>Position Items:</strong> Each visible item is absolutely positioned at its 
            calculated offset.
          </li>
        </ol>

        <h3>Performance Optimization Techniques</h3>
        <p>
          Several techniques optimize virtualization performance:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Passive Event Listeners:</strong> Scroll listeners should use 
            <code>{'{ passive: true }'}</code> to avoid blocking scrolling. This tells the browser 
            the handler won&apos;t call <code>preventDefault()</code>.
          </li>
          <li>
            <strong>RequestAnimationFrame:</strong> For very fast scrolling, consider batching 
            visible range updates with requestAnimationFrame to avoid rendering on every scroll event.
          </li>
          <li>
            <strong>Item Memoization:</strong> Individual list items should be memoized with 
            React.memo to prevent re-rendering when their data hasn&apos;t changed.
          </li>
          <li>
            <strong>Stable Keys:</strong> Use stable, unique keys for list items (not array indices). 
            This allows React to reuse DOM nodes when items are recycled.
          </li>
          <li>
            <strong>Avoid Inline Functions:</strong> Don&apos;t pass inline functions as props to 
            item renderers. This creates new function references on every render, breaking memoization.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs & Comparison</h2>

        <HighlightBlock as="p" tier="crucial">
          Virtualization is the &quot;big hammer&quot; for DOM scale, but it changes semantics:
          measurement, accessibility, scroll restoration, and UI testing. Senior answers explicitly call out
          when <Highlight tier="important">CSS content-visibility</Highlight> is enough vs when you need full
          windowing.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Windowing can break assumptions: screen readers may not &quot;see&quot; offscreen items, browser find-in-page
          misses unmounted rows, and QA automation becomes flaky if item indices change. You need an accessibility
          and testing plan, not just a perf plan.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Dynamic-height lists are the hardest case: you either measure rows (ResizeObserver) or approximate heights
          and correct. Both approaches can cause scroll jump if not handled carefully.
        </HighlightBlock>

        <h3>Library Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-theme">
                <th className="p-3 text-left">Library</th>
                <th className="p-3 text-left">Size</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Dynamic Height</th>
                <th className="p-3 text-left">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3 font-medium">react-window</td>
                <td className="p-3">6KB gzipped</td>
                <td className="p-3">Components</td>
                <td className="p-3">Yes (VariableSizeList)</td>
                <td className="p-3">Most use cases, lightweight</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">@tanstack/react-virtual</td>
                <td className="p-3">5KB gzipped</td>
                <td className="p-3">Headless hook</td>
                <td className="p-3">Yes</td>
                <td className="p-3">
                  <Highlight tier="important">Custom layouts, maximum flexibility</Highlight>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium">react-virtuoso</td>
                <td className="p-3">15KB gzipped</td>
                <td className="p-3">Components</td>
                <td className="p-3">Automatic</td>
                <td className="p-3">Dynamic heights, grouped lists</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">react-virtualized</td>
                <td className="p-3">23KB gzipped</td>
                <td className="p-3">Components</td>
                <td className="p-3">Yes</td>
                <td className="p-3">Legacy projects (deprecated)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Virtualization vs. CSS Containment</h3>
        <p>
          For moderately sized lists (100-500 items), CSS <code>content-visibility: auto</code> can 
          provide similar benefits without JavaScript:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-theme">
                <th className="p-3 text-left">Aspect</th>
                <th className="p-3 text-left">Virtualization</th>
                <th className="p-3 text-left">CSS Containment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3 font-medium">DOM Nodes</td>
                <td className="p-3">Only visible (20-30)</td>
                <td className="p-3">All items rendered</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Browser Support</td>
                <td className="p-3">All browsers</td>
                <td className="p-3">Chrome 85+, Edge 85+, Firefox 90+</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Implementation</td>
                <td className="p-3">JavaScript library</td>
                <td className="p-3">Single CSS property</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Best For</td>
                <td className="p-3">1000+ items</td>
                <td className="p-3">100-500 items</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>When NOT to Virtualize</h3>
        <ul className="space-y-2">
          <li>
            <strong>Small Lists (&lt;100 items):</strong> The DOM can handle a few hundred simple 
            elements without performance issues. The complexity of virtualization isn&apos;t justified.
          </li>
          <li>
            <strong>SEO-Critical Content:</strong> Virtualized items not in the DOM are invisible to 
            crawlers. If search engines need to index all items, virtualization hides content.
          </li>
          <li>
            <strong>Print Layouts:</strong> Virtualized lists only render visible items, so printing 
            produces incomplete output. You need a separate non-virtualized view for printing.
          </li>
          <li>
            <strong>Browser Find-in-Page:</strong> Ctrl+F/Cmd+F cannot locate text in unmounted items. 
            If text search across all items is critical, consider alternatives.
          </li>
          <li>
            <strong>Simple Static Lists:</strong> For static content that doesn&apos;t change, server 
            rendering with pagination may be simpler and more accessible.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <HighlightBlock as="p" tier="crucial">
          Best practices: choose the smallest adequate library, get measurement right (fixed vs variable
          height), tune overscan, and handle UX concerns like scroll restoration and accessibility.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Use stable keys, explicit heights when possible, and avoid expensive per-item effects that negate virtualization.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Add escape hatches: empty states, error states, and safe loading indicators when data arrives late.
        </HighlightBlock>

        <h3>Choose the Right Library</h3>
        <p>
          For most React applications:
        </p>
        <ul className="space-y-1">
          <li>• <strong>react-window:</strong> Best for fixed-height or known variable-height lists. 
            Lightweight, well-maintained, good documentation.</li>
          <li>• <strong>@tanstack/react-virtual:</strong> Best for custom layouts or when you need 
            maximum control. Headless approach gives you full rendering control.</li>
          <li>• <strong>react-virtuoso:</strong> Best for dynamic heights without manual measurement. 
            Higher-level API with built-in infinite scroll support.</li>
        </ul>

        <h3>Use Fixed Heights When Possible</h3>
        <p>
          Fixed-height items are significantly simpler and more performant:
        </p>
        <ul className="space-y-1">
          <li>• O(1) calculation for visible range</li>
          <li>• No measurement overhead</li>
          <li>• No scroll position jumps</li>
          <li>• More predictable behavior</li>
        </ul>
        <p>
          If items must vary in height, consider constraining them to a small set of known heights 
          (e.g., 48px for single-line, 80px for multi-line).
        </p>

        <h3>Memoize Item Renderers</h3>
        <p>
          Wrap item renderers in React.memo to prevent unnecessary re-renders:
        </p>
        <ul className="space-y-1">
          <li>• Use stable keys (not array indices)</li>
          <li>• Avoid inline functions as props</li>
          <li>• Memoize any callbacks passed to items</li>
          <li>• Use useCallback for event handlers</li>
        </ul>

        <h3>Implement Proper Accessibility</h3>
        <p>
          Virtualized lists require ARIA attributes for screen readers:
        </p>
        <ul className="space-y-1">
          <li>• Use <code>role=&quot;listbox&quot;</code> or <code>role=&quot;grid&quot;</code> on 
            the container</li>
          <li>• Set <code>aria-rowcount</code> to the total item count (not just visible)</li>
          <li>• Set <code>aria-rowindex</code> on each visible row</li>
          <li>• Ensure keyboard navigation works (arrow keys should scroll and shift focus)</li>
          <li>• Use <code>aria-live=&quot;polite&quot;</code> for infinite scroll loading status</li>
        </ul>

        <h3>Combine with Infinite Scroll Carefully</h3>
        <p>
          When combining virtualization with infinite scroll:
        </p>
        <ul className="space-y-1">
          <li>• Trigger fetch when approaching the end (e.g., when last visible item index is within 
            100 of total)</li>
          <li>• Show loading indicator as a virtualized item at the end</li>
          <li>• Handle empty states and error states as virtualized items</li>
          <li>• Consider using react-query or SWR for data fetching with built-in caching</li>
        </ul>

        <h3>Test on Real Devices</h3>
        <p>
          Virtualization performance varies significantly by device:
        </p>
        <ul className="space-y-1">
          <li>• Test on low-end mobile devices (not just high-end dev machines)</li>
          <li>• Test with realistic data sizes (10,000+ items)</li>
          <li>• Measure scroll FPS using Chrome DevTools Performance panel</li>
          <li>• Monitor memory usage during extended scrolling sessions</li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>

        <h3>Virtualizing Small Lists</h3>
        <HighlightBlock as="p" tier="important">
          Virtualization adds complexity. For lists under 100 items, the performance benefit is 
          negligible and may not justify the overhead.
        </HighlightBlock>
        <p>
          <strong>Solution:</strong> Profile first. If the list renders in under 100ms and scrolls 
          smoothly, skip virtualization.
        </p>

        <h3>Not Setting Explicit Heights</h3>
        <HighlightBlock as="p" tier="crucial">
          Virtualization requires knowing item heights to calculate positions. Without explicit 
          heights, the virtualizer can&apos;t position items correctly.
        </HighlightBlock>
        <p>
          <strong>Solution:</strong> Use FixedSizeList when possible. For variable heights, use 
          VariableSizeList and provide a function to estimate heights, or use a library that 
          auto-measures (react-virtuoso).
        </p>

        <h3>Using Array Indices as Keys</h3>
        <HighlightBlock as="p" tier="important">
          Using array indices as React keys breaks item recycling. When items are reordered or 
          filtered, React will re-render items unnecessarily.
        </HighlightBlock>
        <p>
          <strong>Solution:</strong> Use stable, unique IDs as keys (e.g., <code>user.id</code>, 
          <code>product.sku</code>).
        </p>

        <h3>Not Handling Empty States</h3>
        <p>
          Virtualized lists with zero items render nothing, which can be confusing. Users may think 
          the list is still loading.
        </p>
        <p>
          <strong>Solution:</strong> Render an empty state component when the dataset is empty. 
          Many libraries support this via a custom renderer or by conditionally rendering outside 
          the virtualizer.
        </p>

        <h3>Ignoring Scroll Restoration</h3>
        <p>
          When navigating back to a virtualized list, the scroll position resets to the top. Users 
          lose their place.
        </p>
        <p>
          <strong>Solution:</strong> Save scroll position to session storage or URL state. Restore 
          on navigation back. Some libraries (react-virtuoso) support this out of the box.
        </p>

        <h3>Not Handling Dynamic Content</h3>
        <p>
          If item content changes after initial render (e.g., expanded rows, lazy-loaded images), 
          the virtualizer may not recalculate heights correctly.
        </p>
        <p>
          <strong>Solution:</strong> For variable-height lists, call the virtualizer&apos;s 
          <code>resetAfterIndex()</code> or <code>measure()</code> method when content changes.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>
        <HighlightBlock as="p" tier="crucial">
          Use cases: large tables/search results/log streams. The story you should tell is DOM boundedness
          and keeping interactions responsive under load (INP).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Use cases should connect to &quot;why now&quot;: when lists cross ~1k items, DOM costs become dominant on mobile.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Mention trade-offs: complexity, accessibility, and testing challenges, plus how you mitigated them.
        </HighlightBlock>

        <h3>E-Commerce: Product Search Results</h3>
        <p>
          An e-commerce site&apos;s search results page displayed up to 10,000 products. Without 
          virtualization, the page took 8 seconds to render and was unresponsive during scroll.
        </p>
        <p>
          <strong>Implementation:</strong> Used react-window FixedSizeList with 80px item height. 
          Implemented infinite scroll with react-query for data fetching.
        </p>
        <p>
          <strong>Results:</strong> Initial render: 8s → 50ms. Scroll FPS: 20fps → 60fps. Mobile 
          bounce rate decreased 18%.
        </p>

        <h3>SaaS Dashboard: Data Tables</h3>
        <p>
          A B2B SaaS dashboard displayed transaction history with up to 50,000 rows. Users complained 
          about slow loading and janky scrolling.
        </p>
        <p>
          <strong>Implementation:</strong> Used @tanstack/react-virtual for custom table layout. 
          Implemented server-side pagination with client-side virtualization.
        </p>
        <p>
          <strong>Results:</strong> Memory usage: 200MB → 8MB. Time to interactive: 12s → 200ms. 
          User satisfaction scores increased 35%.
        </p>

        <h3>Chat Application: Message Threads</h3>
        <p>
          A chat application needed to display message threads with thousands of messages. Loading 
          all messages crashed mobile devices.
        </p>
        <p>
          <strong>Implementation:</strong> Combined virtualization with infinite scroll. Messages 
          loaded in pages of 50, virtualized for smooth scrolling. Implemented bidirectional 
          scrolling (older messages load at top).
        </p>
        <p>
          <strong>Results:</strong> App no longer crashes on mobile. Scroll performance smooth at 
          60fps. Memory usage stable regardless of thread length.
        </p>

        <h3>Analytics Platform: Log Viewer</h3>
        <p>
          A DevOps analytics platform needed to display continuous streams of log data. Logs could 
          grow indefinitely during a session.
        </p>
        <p>
          <strong>Implementation:</strong> Used react-virtuoso with automatic height measurement. 
          Implemented log buffering (keep last 10,000 logs in memory, discard older). Auto-scroll 
          to bottom when new logs arrive.
        </p>
        <p>
          <strong>Results:</strong> Memory usage capped at 50MB regardless of log volume. Real-time 
          log streaming at 100+ logs/second without performance degradation.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions & Answers</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview bar: explain DOM bottlenecks, the windowing algorithm, measurement/overscan trade-offs, and how you validate improvements in INP and frame rate.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Strong answers mention when not to virtualize (small lists) and alternatives (`content-visibility`).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Call out common pitfalls: missing explicit heights, unstable keys, and broken scroll restoration.
        </HighlightBlock>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What problem does virtualization solve?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <HighlightBlock as="p" tier="crucial" className="mb-3">
              Virtualization solves the DOM bottleneck when rendering large lists. The DOM is expensive: 
              each node consumes memory (~0.5-1KB), and creating thousands of nodes blocks the main thread 
              for seconds. Virtualization only renders visible items (20-30 nodes) instead of the full 
              dataset (10,000+ nodes).
            </HighlightBlock>
            <p className="mb-3">
              The performance impact is dramatic: initial render drops from 2-5 seconds to 5-15ms, memory 
              usage drops from 50-100MB to 2-5MB, and scroll performance improves from 15-30fps to 55-60fps.
            </p>
            <p>
              Virtualization is essential for data tables, search results, message threads, and log 
              viewers — any UI that displays large datasets.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: How does virtualization work under the hood?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">Virtualization works through these steps:</p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Outer Container:</strong> A scrollable element with fixed height and 
                <code>overflow: auto</code>.
              </li>
              <li>
                <strong>Inner Container:</strong> A tall element whose height equals total items × 
                item height. This creates the correct scrollbar size.
              </li>
              <li>
                <strong>Visible Range Calculation:</strong> On scroll, calculate which items are 
                visible: <code>startIndex = floor(scrollTop / itemHeight)</code>, 
                <code>endIndex = ceil((scrollTop + containerHeight) / itemHeight)</code>.
              </li>
              <li>
                <strong>Render Visible Items:</strong> Only render items in the visible range plus 
                overscan buffer (3-5 items above/below). Position them absolutely within the inner 
                container.
              </li>
              <li>
                <strong>Recycle on Scroll:</strong> As items leave the viewport, they&apos;re 
                unmounted. Newly visible items are mounted. DOM node count stays constant.
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: What are the trade-offs between react-window, @tanstack/react-virtual, and react-virtuoso?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>react-window (6KB):</strong> Provides ready-made components (FixedSizeList, 
                VariableSizeList). Best for most use cases. Lightweight, well-documented. Requires 
                manual height specification for variable items.
              </li>
              <li>
                <strong>@tanstack/react-virtual (5KB):</strong> Headless hook approach. Calculates 
                positioning but leaves rendering to you. Maximum flexibility for custom layouts. 
                Steeper learning curve.
              </li>
              <li>
                <strong>react-virtuoso (15KB):</strong> Higher-level component with automatic height 
                measurement. Built-in support for grouped lists, sticky headers, and infinite scroll. 
                Larger bundle but less setup.
              </li>
            </ul>
            <p>
              Choose react-window for simplicity, @tanstack/react-virtual for custom layouts, and 
              react-virtuoso for dynamic heights without manual measurement.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How do you handle variable-height items?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">There are three approaches:</p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Known Heights:</strong> If heights are known ahead of time (from API), use 
                VariableSizeList and provide a function that returns each item&apos;s height. The 
                virtualizer maintains a position map for O(log n) lookup.
              </li>
              <li>
                <strong>Dynamic Measurement:</strong> If heights aren&apos;t known until render, use 
                a library that auto-measures (react-virtuoso) or implement measurement yourself: 
                render items off-screen, measure with ResizeObserver, cache heights, then position 
                correctly.
              </li>
              <li>
                <strong>Constrained Heights:</strong> Design items to have a small set of known 
                heights (e.g., 48px single-line, 80px multi-line). This simplifies calculation 
                while allowing some variation.
              </li>
            </ul>
            <p>
              Fixed heights are always preferable when possible — they&apos;re simpler and more 
              performant.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: How do you combine virtualization with infinite scroll?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Virtualization and infinite scroll are complementary: virtualization keeps the DOM small, 
              infinite scroll loads data incrementally.
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Trigger Point:</strong> Fetch next page when approaching the end (e.g., when 
                last visible item index is within 100 of total loaded items).
              </li>
              <li>
                <strong>Loading State:</strong> Render a loading indicator as a virtualized item at 
                the end of the list.
              </li>
              <li>
                <strong>Data Management:</strong> Use react-query or SWR for data fetching with 
                built-in caching and deduplication.
              </li>
              <li>
                <strong>Scroll Position:</strong> When new items load at the end, maintain scroll 
                position. When items load at the top (bidirectional scroll), adjust scroll offset 
                to prevent jump.
              </li>
            </ul>
            <p>
              Together, they enable smooth browsing of datasets with millions of records.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: What accessibility considerations are important for virtualized lists?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>ARIA Roles:</strong> Use <code>role=&quot;listbox&quot;</code> or 
                <code>role=&quot;grid&quot;</code> on the container.
              </li>
              <li>
                <strong>Row Count:</strong> Set <code>aria-rowcount</code> to the total item count 
                (not just visible items) so screen readers know the full list size.
              </li>
              <li>
                <strong>Row Index:</strong> Set <code>aria-rowindex</code> on each visible row so 
                screen readers can announce position (&quot;item 523 of 10,000&quot;).
              </li>
              <li>
                <strong>Keyboard Navigation:</strong> Arrow keys should scroll the container and 
                shift focus to newly visible items. Don&apos;t rely on native browser behavior 
                since most items aren&apos;t in the DOM.
              </li>
              <li>
                <strong>Loading Announcements:</strong> Use <code>aria-live=&quot;polite&quot;</code> 
                regions to announce when new items load during infinite scroll.
              </li>
            </ul>
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
            <a href="https://tanstack.com/virtual/latest" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              TanStack Virtual Documentation
            </a> — Official docs for @tanstack/react-virtual with examples and API reference.
          </li>
          <li>
            <a href="https://react-window.vercel.app/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              react-window Examples
            </a> — Interactive examples and API reference for react-window.
          </li>
          <li>
            <a href="https://virtuoso.dev/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React Virtuoso Documentation
            </a> — Guides for dynamic heights, grouped lists, and infinite scroll.
          </li>
          <li>
            <a href="https://web.dev/virtualize-long-lists-react-window/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev: Virtualize Long Lists
            </a> — Google&apos;s guide on list virtualization for web performance.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN: content-visibility
            </a> — CSS-based alternative to JavaScript virtualization for moderate lists.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/listbox/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              WAI-ARIA Listbox Pattern
            </a> — Accessibility guidelines for listbox implementations.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
