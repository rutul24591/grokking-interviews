"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { MermaidDiagram } from "@/components/articles/MermaidDiagram";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-virtualization-windowing-extensive",
  title: "Virtualization/Windowing (for Long Lists)",
  description: "Comprehensive guide to list and grid virtualization techniques, library comparisons, custom implementations, and production patterns for rendering massive datasets in React.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "virtualization-windowing",
  version: "extensive",
  wordCount: 10500,
  readingTime: 42,
  lastUpdated: "2026-03-09",
  tags: ["frontend", "performance", "virtualization", "windowing", "react-window", "react-virtual", "infinite-scroll", "dom-optimization"],
  relatedTopics: ["lazy-loading", "web-vitals", "bundle-size-optimization"],
};

export default function VirtualizationWindowingExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Virtualization</strong> (also called <strong>windowing</strong>) is a rendering optimization
          technique that maintains only a small subset of DOM elements for a large dataset, creating and destroying
          elements dynamically as the user scrolls. Rather than rendering every item in a list, table, or grid,
          a virtualizer renders only the items currently visible in the viewport plus a configurable buffer zone,
          achieving constant DOM node count regardless of dataset size.
        </p>
        <p>
          The concept originates from native UI frameworks — Android's <code>RecyclerView</code>, iOS's
          <code>UITableView</code>, and Windows' <code>VirtualizingStackPanel</code> have used this technique
          for decades. On the web, the need became critical as single-page applications started rendering data
          tables with thousands of rows, chat histories with tens of thousands of messages, and infinite feeds
          that grow without bound.
        </p>
        <p>
          The foundational insight is simple: the user can only see a small portion of a long list at any moment.
          If the viewport shows 15 rows, there is no reason to have 10,000 DOM nodes in the document. By rendering
          only what is visible (plus a small overscan for smooth scrolling), we reduce initial render time from
          seconds to milliseconds, cut memory usage by 95%+, and maintain smooth 60fps scrolling regardless of
          dataset size.
        </p>
        <p>
          Today, virtualization is a standard pattern in production applications. Libraries like
          <code>@tanstack/react-virtual</code>, <code>react-window</code>, and <code>react-virtuoso</code> make
          it accessible, but understanding the underlying mechanics is essential for system design interviews and
          for debugging edge cases in real applications.
        </p>
      </section>

      <section>
        <h2>The DOM Bottleneck: Why Large Lists Kill Performance</h2>
        <p>
          To understand why virtualization matters, you need to understand what happens when you render thousands
          of DOM nodes. The browser's rendering pipeline has several stages, and each one suffers as node count
          increases:
        </p>

        <MermaidDiagram
          chart={`flowchart LR
    A[JavaScript<br/>Create 10K nodes] --> B[Style<br/>Calculate 10K styles]
    B --> C[Layout<br/>Position 10K elements]
    C --> D[Paint<br/>Draw 10K pixels]
    D --> E[Composite<br/>Layer management]
    style A fill:#ef4444,color:#fff
    style B fill:#f97316,color:#fff
    style C fill:#f97316,color:#fff
    style D fill:#eab308,color:#000
    style E fill:#22c55e,color:#fff`}
          caption="Browser rendering pipeline — each stage degrades with large DOM node counts. Red/orange stages are most affected."
        />

        <ul className="space-y-3">
          <li>
            <strong>JavaScript Execution:</strong> Creating 10,000 React elements triggers 10,000 component
            renders, 10,000 fiber allocations, and 10,000 DOM mutations. On a mid-range mobile device, this
            alone takes 2-5 seconds, during which the main thread is completely blocked — the page is frozen,
            click handlers don't fire, and animations stop.
          </li>
          <li>
            <strong>Style Calculation:</strong> The browser must compute the final CSS properties for every
            element. With 10,000 nodes, even simple selectors trigger millions of style resolution operations.
            Complex selectors (descendant combinators, :nth-child) make this exponentially worse.
          </li>
          <li>
            <strong>Layout (Reflow):</strong> The browser calculates the exact size and position of every
            element. This is the most expensive stage — it's O(n) at minimum and often worse when elements
            affect each other's positioning. Any subsequent DOM change that affects geometry (adding a class,
            changing text) triggers partial or full re-layout of all 10,000 nodes.
          </li>
          <li>
            <strong>Memory Pressure:</strong> Each DOM node is a C++ object in the browser engine. A simple
            <code>{'<'}div{'>'}</code> with text costs ~0.5KB. A row with 5 cells, icons, and event listeners
            can cost 2-5KB per row. At 10,000 rows, that's 20-50MB of DOM memory alone, plus the React fiber
            tree doubling it. On memory-constrained mobile devices, this triggers garbage collection pauses
            (GC jank) that cause visible stuttering.
          </li>
          <li>
            <strong>Scroll Performance:</strong> During scrolling, the browser must repaint visible content
            at 60fps (16.6ms per frame). With thousands of nodes in the render tree, the paint step alone
            can exceed this budget. The result is scroll jank — visible stuttering where the content doesn't
            keep up with the user's finger or scroll wheel.
          </li>
        </ul>

        <h3 className="mt-6 font-semibold">Quantified Impact</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-3 text-left">Metric</th>
                <th className="p-3 text-left">1,000 Nodes</th>
                <th className="p-3 text-left">10,000 Nodes</th>
                <th className="p-3 text-left">50,000 Nodes</th>
                <th className="p-3 text-left">Virtualized (30 nodes)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3">Initial Render</td>
                <td className="p-3">200-400ms</td>
                <td className="p-3">2,000-5,000ms</td>
                <td className="p-3">10,000-25,000ms</td>
                <td className="p-3">5-15ms</td>
              </tr>
              <tr>
                <td className="p-3">Memory (DOM)</td>
                <td className="p-3">5-10MB</td>
                <td className="p-3">50-100MB</td>
                <td className="p-3">250-500MB</td>
                <td className="p-3">2-5MB</td>
              </tr>
              <tr>
                <td className="p-3">Scroll FPS</td>
                <td className="p-3">50-60fps</td>
                <td className="p-3">15-30fps</td>
                <td className="p-3">5-10fps</td>
                <td className="p-3">55-60fps</td>
              </tr>
              <tr>
                <td className="p-3">Time to Interactive</td>
                <td className="p-3">300-600ms</td>
                <td className="p-3">3-8s</td>
                <td className="p-3">15-30s</td>
                <td className="p-3">{'<'}100ms</td>
              </tr>
              <tr>
                <td className="p-3">Re-render on Update</td>
                <td className="p-3">50-100ms</td>
                <td className="p-3">500-2,000ms</td>
                <td className="p-3">2,000-10,000ms</td>
                <td className="p-3">1-5ms</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The key takeaway: virtualization transforms all metrics from O(n) — scaling with dataset size — to
          O(1) — constant regardless of total items. Whether your list has 1,000 or 1,000,000 items, the
          DOM footprint and rendering cost remain the same.
        </p>
      </section>

      <section>
        <h2>How Windowing Works: Core Algorithm</h2>
        <p>
          Every virtualization library implements the same fundamental algorithm with variations in
          measurement, positioning, and optimization. Understanding the core mechanics lets you debug issues,
          build custom solutions, and make informed library choices.
        </p>

        <MermaidDiagram
          chart={`flowchart TD
    A[Scroll Event] --> B[Read scrollTop]
    B --> C[Calculate visible range]
    C --> D[startIndex = floor scrollTop / itemHeight]
    C --> E["endIndex = ceil (scrollTop + viewportHeight) / itemHeight"]
    D --> F[Apply overscan buffer]
    E --> F
    F --> G[Render items startIndex - overscan to endIndex + overscan]
    G --> H[Position items with absolute positioning]
    H --> I[Set inner container height = totalItems x itemHeight]
    I --> J[User sees seamless scrolling]
    J --> A`}
          caption="Core virtualization loop — runs on every scroll event to determine which items to render"
        />

        <h3 className="mt-6 font-semibold">The Anatomy of a Virtualized List</h3>
        <p>
          A virtualized list consists of three nested elements working together:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!-- Outer container: scrollable viewport -->
<div style="height: 600px; overflow: auto;">

  <!-- Inner container: tall spacer that creates correct scrollbar -->
  <div style="height: 480000px; position: relative;">
    <!-- height = totalItems (10,000) × itemHeight (48px) -->

    <!-- Only visible items + overscan are rendered -->
    <div style="position: absolute; top: 4800px; height: 48px;">Row 100</div>
    <div style="position: absolute; top: 4848px; height: 48px;">Row 101</div>
    <div style="position: absolute; top: 4896px; height: 48px;">Row 102</div>
    <!-- ... ~20 more rows ... -->
    <div style="position: absolute; top: 5760px; height: 48px;">Row 120</div>

  </div>
</div>

<!-- Items outside the visible window simply don't exist in the DOM -->
<!-- Row 0-94: not rendered (above viewport + overscan) -->
<!-- Row 95-125: rendered (visible + overscan buffer) -->
<!-- Row 126-9999: not rendered (below viewport + overscan) -->`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Fixed Height: Simple Case</h3>
        <p>
          When all items have the same height, the math is trivial. This is the fastest path because no
          measurement is needed — positions are calculated with simple multiplication.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`function calculateFixedRange(scrollTop, viewportHeight, itemHeight, itemCount) {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(viewportHeight / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount, itemCount - 1);

  // Position for any item is simply: index * itemHeight
  const getOffset = (index) => index * itemHeight;

  // Total height for scrollbar is: itemCount * itemHeight
  const totalHeight = itemCount * itemHeight;

  return { startIndex, endIndex, getOffset, totalHeight };
}

// Example: viewport=600px, itemHeight=48px, scrolled to 2400px
// startIndex = 2400/48 = 50
// visibleCount = ceil(600/48) = 13
// endIndex = 50 + 13 = 63
// Renders items 50-63 (14 items) + overscan`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Variable Height: The Hard Problem</h3>
        <p>
          When items have different heights, we can no longer use simple multiplication. We need to maintain
          a running sum of heights to calculate positions, and we may not know item heights until they render.
          This creates a chicken-and-egg problem: we need heights to decide what to render, but items must
          render to be measured.
        </p>
        <p>
          Libraries solve this with two approaches:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Known heights:</strong> You provide a function that returns each item's height upfront
            (used by <code>react-window</code>'s <code>VariableSizeList</code>). This requires knowing heights
            before rendering, which works for cases like "expanded rows are 120px, collapsed are 48px."
          </li>
          <li>
            <strong>Measured heights:</strong> The library renders items with an estimated height, measures the
            actual DOM height after mount using <code>ResizeObserver</code>, then corrects positions. This is
            used by <code>@tanstack/react-virtual</code> and <code>react-virtuoso</code> for truly dynamic
            content like chat messages or variable-length text.
          </li>
        </ul>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Variable height calculation with prefix sum
function calculateVariableRange(scrollTop, viewportHeight, heights) {
  // Build prefix sum array: offsets[i] = sum of heights[0..i-1]
  const offsets = [0];
  for (let i = 0; i < heights.length; i++) {
    offsets.push(offsets[i] + heights[i]);
  }
  const totalHeight = offsets[offsets.length - 1];

  // Binary search for start index
  let startIndex = binarySearch(offsets, scrollTop);
  let endIndex = binarySearch(offsets, scrollTop + viewportHeight);

  return {
    startIndex,
    endIndex: Math.min(endIndex, heights.length - 1),
    getOffset: (index) => offsets[index],
    totalHeight,
  };
}

function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return Math.max(0, lo - 1);
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Building a Simple Virtualizer from Scratch</h2>
        <p>
          Understanding the internals makes you a better debugger and interviewer. Here is a minimal but
          functional virtualizer hook that demonstrates the core pattern used by libraries like
          <code>@tanstack/react-virtual</code>:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { useState, useRef, useCallback, useEffect, useMemo } from 'react';

function useVirtualizer({ count, estimateSize, overscan = 5, getScrollElement }) {
  const [scrollTop, setScrollTop] = useState(0);
  const measuredSizes = useRef(new Map());

  // Calculate item sizes — use measured if available, otherwise estimate
  const getSizeForIndex = useCallback(
    (index) => measuredSizes.current.get(index) ?? estimateSize(index),
    [estimateSize]
  );

  // Build layout information
  const measurements = useMemo(() => {
    const items = [];
    let offset = 0;
    for (let i = 0; i < count; i++) {
      const size = getSizeForIndex(i);
      items.push({ index: i, start: offset, end: offset + size, size });
      offset += size;
    }
    return { items, totalSize: offset };
  }, [count, getSizeForIndex, scrollTop]); // scrollTop triggers recalc after measurement

  // Determine visible range
  const getVirtualItems = useCallback(() => {
    const element = getScrollElement();
    if (!element) return [];
    const viewportHeight = element.clientHeight;

    let startIndex = 0;
    let endIndex = count - 1;

    // Find first visible item (binary search would be faster for large lists)
    for (let i = 0; i < measurements.items.length; i++) {
      if (measurements.items[i].end > scrollTop) {
        startIndex = i;
        break;
      }
    }

    // Find last visible item
    for (let i = startIndex; i < measurements.items.length; i++) {
      if (measurements.items[i].start >= scrollTop + viewportHeight) {
        endIndex = i;
        break;
      }
    }

    // Apply overscan
    startIndex = Math.max(0, startIndex - overscan);
    endIndex = Math.min(count - 1, endIndex + overscan);

    return measurements.items.slice(startIndex, endIndex + 1);
  }, [scrollTop, measurements, count, overscan, getScrollElement]);

  // Scroll listener
  useEffect(() => {
    const element = getScrollElement();
    if (!element) return;

    const onScroll = () => setScrollTop(element.scrollTop);
    element.addEventListener('scroll', onScroll, { passive: true });
    return () => element.removeEventListener('scroll', onScroll);
  }, [getScrollElement]);

  // Measurement callback for dynamic sizing
  const measureElement = useCallback((element) => {
    if (!element) return;
    const index = Number(element.dataset.index);
    const height = element.getBoundingClientRect().height;
    if (measuredSizes.current.get(index) !== height) {
      measuredSizes.current.set(index, height);
      setScrollTop((s) => s); // Force re-render
    }
  }, []);

  return {
    getVirtualItems,
    getTotalSize: () => measurements.totalSize,
    measureElement,
  };
}

// Usage
function MyVirtualList({ items }) {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    estimateSize: () => 48,
    overscan: 5,
    getScrollElement: () => parentRef.current,
  });

  return (
    <div ref={parentRef} style={{ height: 600, overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((vItem) => (
          <div
            key={vItem.index}
            data-index={vItem.index}
            ref={virtualizer.measureElement}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: \`translateY(\${vItem.start}px)\`,
            }}
          >
            {items[vItem.index].content}
          </div>
        ))}
      </div>
    </div>
  );
}`}</code>
        </pre>
        <p>
          This minimal implementation covers the core concepts: scroll tracking, visible range calculation,
          overscan, absolute positioning, and dynamic measurement. Production libraries add optimizations
          like scroll momentum detection, smooth scroll support, RTL handling, and ResizeObserver-based
          measurement instead of getBoundingClientRect.
        </p>
      </section>

      <section>
        <h2>Library Comparison: react-window vs @tanstack/react-virtual vs react-virtuoso</h2>
        <p>
          Each library makes different trade-offs. Understanding these helps you pick the right tool:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-3 text-left">Feature</th>
                <th className="p-3 text-left">react-window</th>
                <th className="p-3 text-left">@tanstack/react-virtual</th>
                <th className="p-3 text-left">react-virtuoso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3 font-medium">Bundle Size</td>
                <td className="p-3">6KB gzipped</td>
                <td className="p-3">5KB gzipped</td>
                <td className="p-3">15KB gzipped</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Approach</td>
                <td className="p-3">Component-based</td>
                <td className="p-3">Headless hook</td>
                <td className="p-3">Component-based</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Dynamic Heights</td>
                <td className="p-3">Manual (VariableSizeList)</td>
                <td className="p-3">Auto-measured via ResizeObserver</td>
                <td className="p-3">Automatic</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Grid Support</td>
                <td className="p-3">FixedSizeGrid, VariableSizeGrid</td>
                <td className="p-3">Via useVirtualizer with 2D config</td>
                <td className="p-3">Limited (via custom components)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Grouped Lists</td>
                <td className="p-3">Not built-in</td>
                <td className="p-3">Manual implementation</td>
                <td className="p-3">GroupedVirtuoso component</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Infinite Scroll</td>
                <td className="p-3">Via react-window-infinite-loader</td>
                <td className="p-3">Manual with onScroll</td>
                <td className="p-3">Built-in endReached callback</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">SSR Support</td>
                <td className="p-3">Limited</td>
                <td className="p-3">Yes (initialOffset)</td>
                <td className="p-3">Yes (initialTopMostItemIndex)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Sticky Headers</td>
                <td className="p-3">Not built-in</td>
                <td className="p-3">Manual implementation</td>
                <td className="p-3">Built-in</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Scroll to Index</td>
                <td className="p-3">scrollToItem(index)</td>
                <td className="p-3">scrollToIndex(index)</td>
                <td className="p-3">scrollToIndex(index)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Best For</td>
                <td className="p-3">Simple fixed-height lists, minimal bundle</td>
                <td className="p-3">Custom UI, full control, framework-agnostic logic</td>
                <td className="p-3">Feature-rich lists, chat UIs, minimal config</td>
              </tr>
            </tbody>
          </table>
        </div>

        <MermaidDiagram
          chart={`quadrantChart
    title Library Selection Guide
    x-axis "Ease of Use" --> "Customizability"
    y-axis "Lightweight" --> "Feature Rich"
    quadrant-1 "Custom + Rich"
    quadrant-2 "Easy + Rich"
    quadrant-3 "Easy + Light"
    quadrant-4 "Custom + Light"
    "react-window": [0.3, 0.25]
    "@tanstack/react-virtual": [0.75, 0.45]
    "react-virtuoso": [0.25, 0.8]`}
          caption="Library positioning: choose based on your needs for customizability vs. out-of-the-box features"
        />
      </section>

      <section>
        <h2>react-window: Lightweight and Battle-Tested</h2>
        <p>
          Created by Brian Vaughn (former React core team member), <code>react-window</code> is the spiritual
          successor to <code>react-virtualized</code> with a dramatically smaller bundle. It provides four
          components covering the main use cases:
        </p>

        <h3 className="mt-6 font-semibold">FixedSizeList</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { FixedSizeList } from 'react-window';
import { memo } from 'react';

// Memoize row component to prevent unnecessary re-renders
const Row = memo(({ index, style, data }) => {
  const user = data[index];
  return (
    <div style={style} className="flex items-center px-4 border-b hover:bg-gray-50">
      <img src={user.avatar} alt="" className="w-8 h-8 rounded-full mr-3" />
      <div>
        <div className="font-medium">{user.name}</div>
        <div className="text-sm text-gray-500">{user.email}</div>
      </div>
    </div>
  );
});

function UserList({ users }) {
  return (
    <FixedSizeList
      height={600}
      width="100%"
      itemCount={users.length}
      itemSize={56}
      itemData={users}
      overscanCount={5}
    >
      {Row}
    </FixedSizeList>
  );
}`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">VariableSizeList</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { VariableSizeList } from 'react-window';
import { useRef } from 'react';

function MessageList({ messages }) {
  const listRef = useRef(null);

  // Must know or estimate heights upfront
  const getItemSize = (index) => {
    const msg = messages[index];
    // Estimate based on content length
    const lineCount = Math.ceil(msg.text.length / 60);
    return 40 + lineCount * 20; // base height + line height
  };

  const Row = ({ index, style }) => (
    <div style={style} className="p-3 border-b">
      <div className="font-medium text-sm text-gray-600">{messages[index].sender}</div>
      <div>{messages[index].text}</div>
    </div>
  );

  // If data changes, reset cached measurements
  const handleDataChange = () => {
    listRef.current?.resetAfterIndex(0);
  };

  return (
    <VariableSizeList
      ref={listRef}
      height={600}
      width="100%"
      itemCount={messages.length}
      itemSize={getItemSize}
      overscanCount={3}
    >
      {Row}
    </VariableSizeList>
  );
}`}</code>
        </pre>
      </section>

      <section>
        <h2>@tanstack/react-virtual: Headless and Flexible</h2>
        <p>
          TanStack Virtual provides a headless <code>useVirtualizer</code> hook that handles all the math
          but renders nothing — you have complete control over the DOM. This makes it ideal for custom UIs,
          unconventional layouts, and integration with design systems.
        </p>

        <h3 className="mt-6 font-semibold">Basic List with Dynamic Measurement</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

function DynamicList({ items }) {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // Initial estimate; refined after measurement
    overscan: 5,
    // Enable dynamic measurement
    measureElement: (el) => el?.getBoundingClientRect().height ?? 50,
  });

  return (
    <div
      ref={parentRef}
      className="h-[600px] overflow-auto border rounded-lg"
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            data-index={virtualRow.index}
            ref={virtualizer.measureElement}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: \`translateY(\${virtualRow.start}px)\`,
            }}
          >
            <div className="p-4 border-b">
              <h3 className="font-medium">{items[virtualRow.index].title}</h3>
              <p className="text-sm text-gray-600">
                {items[virtualRow.index].description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Horizontal Virtualizer</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

function HorizontalCarousel({ images }) {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: images.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 300,
    horizontal: true,
    overscan: 3,
  });

  return (
    <div ref={parentRef} className="w-full overflow-x-auto">
      <div
        style={{
          width: virtualizer.getTotalSize(),
          height: 200,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualCol) => (
          <div
            key={virtualCol.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: virtualCol.size,
              transform: \`translateX(\${virtualCol.start}px)\`,
            }}
          >
            <img
              src={images[virtualCol.index].src}
              alt={images[virtualCol.index].alt}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}`}</code>
        </pre>
      </section>

      <section>
        <h2>react-virtuoso: Feature-Rich Out of the Box</h2>
        <p>
          <code>react-virtuoso</code> takes the opposite approach from TanStack Virtual — it provides
          fully featured components with automatic height detection, grouped lists, sticky headers, and
          infinite scrolling built in. Ideal when you want minimal configuration and don't need
          unusual layouts.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { Virtuoso, GroupedVirtuoso, TableVirtuoso } from 'react-virtuoso';

// Auto-measured dynamic heights — no estimateSize or itemSize needed
function ChatMessages({ messages }) {
  return (
    <Virtuoso
      style={{ height: '100%' }}
      totalCount={messages.length}
      initialTopMostItemIndex={messages.length - 1} // Start at bottom
      followOutput="smooth" // Auto-scroll when new messages arrive
      itemContent={(index) => (
        <div className="p-3 border-b">
          <div className="font-medium text-sm">{messages[index].sender}</div>
          <div className="mt-1">{messages[index].text}</div>
          {messages[index].image && (
            <img src={messages[index].image} className="mt-2 rounded max-w-xs" />
          )}
        </div>
      )}
    />
  );
}

// Grouped list with sticky section headers
function ContactDirectory({ sections }) {
  const groupCounts = sections.map((s) => s.contacts.length);
  const allContacts = sections.flatMap((s) => s.contacts);

  return (
    <GroupedVirtuoso
      style={{ height: 600 }}
      groupCounts={groupCounts}
      groupContent={(index) => (
        <div className="bg-gray-100 px-4 py-2 font-bold text-sm uppercase tracking-wide sticky top-0 z-10">
          {sections[index].letter}
        </div>
      )}
      itemContent={(index) => (
        <div className="px-4 py-3 border-b flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3">
            {allContacts[index].name[0]}
          </div>
          <div>
            <div className="font-medium">{allContacts[index].name}</div>
            <div className="text-sm text-gray-500">{allContacts[index].phone}</div>
          </div>
        </div>
      )}
    />
  );
}

// Built-in infinite scroll
function InfiniteList({ loadMore, hasMore }) {
  return (
    <Virtuoso
      style={{ height: 600 }}
      endReached={() => {
        if (hasMore) loadMore();
      }}
      components={{
        Footer: () =>
          hasMore ? (
            <div className="p-4 text-center text-gray-500">Loading more...</div>
          ) : null,
      }}
    />
  );
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Virtualized Grids and Tables</h2>
        <p>
          Grids and tables add a second dimension to virtualization — both rows and columns must be windowed.
          This is essential for spreadsheet-like UIs, data tables with many columns, or image grids.
        </p>

        <MermaidDiagram
          chart={`flowchart TD
    subgraph Viewport
        A[Visible cells<br/>row 5-15, col 2-8]
    end
    subgraph "Full Grid (100 rows x 50 cols = 5,000 cells)"
        B[Rows 0-4: not rendered]
        A
        C[Rows 16-99: not rendered]
        D[Cols 0-1: not rendered]
        E[Cols 9-49: not rendered]
    end
    style A fill:#22c55e,color:#fff
    style B fill:#94a3b8,color:#fff
    style C fill:#94a3b8,color:#fff
    style D fill:#94a3b8,color:#fff
    style E fill:#94a3b8,color:#fff`}
          caption="Grid virtualization: only cells in the visible viewport (green) are rendered — rows and columns outside are omitted"
        />

        <h3 className="mt-6 font-semibold">Virtualized Grid with react-window</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { FixedSizeGrid } from 'react-window';

function DataGrid({ data, columns }) {
  const Cell = ({ columnIndex, rowIndex, style }) => (
    <div
      style={style}
      className={\`p-2 border-b border-r text-sm \${
        rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
      }\`}
    >
      {data[rowIndex][columns[columnIndex].key]}
    </div>
  );

  return (
    <FixedSizeGrid
      height={600}
      width={1000}
      rowCount={data.length}
      columnCount={columns.length}
      rowHeight={40}
      columnWidth={150}
    >
      {Cell}
    </FixedSizeGrid>
  );
}`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Virtualized Table with react-virtuoso</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { TableVirtuoso } from 'react-virtuoso';

function VirtualTable({ data }) {
  return (
    <TableVirtuoso
      style={{ height: 600 }}
      data={data}
      fixedHeaderContent={() => (
        <tr className="bg-gray-100">
          <th className="p-3 text-left font-medium">Name</th>
          <th className="p-3 text-left font-medium">Email</th>
          <th className="p-3 text-left font-medium">Role</th>
          <th className="p-3 text-left font-medium">Status</th>
        </tr>
      )}
      itemContent={(index, user) => (
        <>
          <td className="p-3 border-b">{user.name}</td>
          <td className="p-3 border-b">{user.email}</td>
          <td className="p-3 border-b">{user.role}</td>
          <td className="p-3 border-b">
            <span className={\`px-2 py-1 rounded text-xs \${
              user.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }\`}>
              {user.active ? 'Active' : 'Inactive'}
            </span>
          </td>
        </>
      )}
    />
  );
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Scroll Position Restoration</h2>
        <p>
          A common UX requirement is restoring scroll position when users navigate away and return to a
          virtualized list. This is tricky because the list doesn't have all items mounted — you need to
          tell the virtualizer where to scroll, not just set <code>scrollTop</code>.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useEffect } from 'react';

// Store scroll position globally or in a context
const scrollPositions = new Map();

function RestorableList({ listId, items }) {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
  });

  // Save scroll position on unmount
  useEffect(() => {
    return () => {
      const element = parentRef.current;
      if (element) {
        scrollPositions.set(listId, {
          scrollTop: element.scrollTop,
          // Also save the first visible item index for variable-height lists
          firstVisibleIndex: virtualizer.getVirtualItems()[0]?.index ?? 0,
        });
      }
    };
  }, [listId]);

  // Restore scroll position on mount
  useEffect(() => {
    const saved = scrollPositions.get(listId);
    if (saved) {
      // For fixed-height lists, scrollTop is reliable
      parentRef.current?.scrollTo({ top: saved.scrollTop });

      // For variable-height lists, scroll to the saved index instead
      // virtualizer.scrollToIndex(saved.firstVisibleIndex, { align: 'start' });
    }
  }, [listId]);

  return (
    <div ref={parentRef} style={{ height: 600, overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((vItem) => (
          <div
            key={vItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: \`translateY(\${vItem.start}px)\`,
            }}
          >
            {items[vItem.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}`}</code>
        </pre>
        <p>
          For applications using React Router or Next.js, you can integrate scroll restoration with the
          router's built-in mechanisms. The key insight is to save the first visible item index (not just
          scrollTop) because variable-height items may shift positions if content changes between navigations.
        </p>
      </section>

      <section>
        <h2>Infinite Scroll with Virtualization</h2>
        <p>
          Virtualization and infinite scroll are complementary patterns that together enable browsing of
          datasets with millions of records. Virtualization keeps the DOM small, while infinite scroll loads
          data incrementally from the server.
        </p>

        <MermaidDiagram
          chart={`sequenceDiagram
    participant U as User
    participant V as Virtualizer
    participant D as DOM
    participant Q as React Query
    participant S as Server

    U->>V: Scrolls down
    V->>D: Render items 50-70 (unmount 30-49)
    V->>V: Detect approaching end of loaded data
    V->>Q: Trigger fetchNextPage()
    Q->>S: GET /api/items?cursor=abc
    S-->>Q: Return next 50 items
    Q-->>V: Data updated (100 → 150 items)
    V->>D: Continue rendering items 65-85
    Note over D: DOM always has ~20-25 nodes`}
          caption="Infinite scroll + virtualization flow: data loads incrementally while DOM stays constant"
        />

        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { useVirtualizer } from '@tanstack/react-virtual';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRef, useCallback, useEffect } from 'react';

function InfiniteVirtualList({ apiEndpoint }) {
  const parentRef = useRef(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['items', apiEndpoint],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(\`\${apiEndpoint}?cursor=\${pageParam}&limit=50\`);
      return res.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const allItems = data?.pages.flatMap((page) => page.items) ?? [];
  const totalCount = hasNextPage ? allItems.length + 1 : allItems.length;

  const virtualizer = useVirtualizer({
    count: totalCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 10,
  });

  // Trigger fetch when the last virtual item is a loading placeholder
  useEffect(() => {
    const virtualItems = virtualizer.getVirtualItems();
    const lastItem = virtualItems[virtualItems.length - 1];

    if (!lastItem) return;

    if (
      lastItem.index >= allItems.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    virtualizer.getVirtualItems(),
    hasNextPage,
    isFetchingNextPage,
    allItems.length,
    fetchNextPage,
  ]);

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto border rounded-lg">
      <div
        style={{
          height: virtualizer.getTotalSize(),
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const isLoadingRow = virtualRow.index >= allItems.length;
          const item = allItems[virtualRow.index];

          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: \`translateY(\${virtualRow.start}px)\`,
              }}
            >
              {isLoadingRow ? (
                <div className="p-4 text-center text-gray-400">
                  Loading more...
                </div>
              ) : (
                <div className="p-4 border-b">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-gray-500">{item.subtitle}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Accessibility Considerations</h2>
        <p>
          Virtualization creates unique accessibility challenges because screen readers and keyboard navigation
          depend on DOM presence. Items that aren't rendered don't exist for assistive technology. Here's how
          to address this properly:
        </p>

        <h3 className="mt-6 font-semibold">ARIA Attributes</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`function AccessibleVirtualList({ items }) {
  const parentRef = useRef(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
  });

  return (
    <div
      ref={parentRef}
      role="listbox"
      aria-label="User list"
      aria-rowcount={items.length} // Total count, not just rendered
      tabIndex={0}
      style={{ height: 600, overflow: 'auto' }}
    >
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((vItem) => (
          <div
            key={vItem.key}
            role="option"
            aria-rowindex={vItem.index + 1} // 1-based index
            aria-setsize={items.length}
            aria-posinset={vItem.index + 1}
            aria-selected={vItem.index === selectedIndex}
            tabIndex={vItem.index === focusedIndex ? 0 : -1}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: \`translateY(\${vItem.start}px)\`,
            }}
          >
            {items[vItem.index].name}
          </div>
        ))}
      </div>
      {/* Live region for announcing position */}
      <div aria-live="polite" className="sr-only">
        {isFetching && 'Loading more items'}
      </div>
    </div>
  );
}`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Keyboard Navigation</h3>
        <ul className="space-y-2">
          <li>
            <strong>Arrow keys:</strong> Move focus between items. When focus moves to an item outside the
            visible range, scroll the container to bring it into view using <code>scrollToIndex</code>.
          </li>
          <li>
            <strong>Home/End:</strong> Jump to first/last item. The virtualizer must scroll and render the
            target item before focusing it.
          </li>
          <li>
            <strong>Page Up/Page Down:</strong> Scroll by one viewport height. Calculate the target index
            based on current position plus viewport item count.
          </li>
          <li>
            <strong>Type-ahead:</strong> For lists with text labels, implement type-ahead search that can
            search the full dataset (not just rendered items) and scroll to the match.
          </li>
        </ul>
      </section>

      <section>
        <h2>When NOT to Virtualize</h2>
        <p>
          Virtualization is not a universal optimization. It adds complexity, introduces constraints, and in
          some cases hurts more than it helps:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-3 text-left">Scenario</th>
                <th className="p-3 text-left">Why Not Virtualize</th>
                <th className="p-3 text-left">Alternative</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3">{'<'}100 simple items</td>
                <td className="p-3">DOM handles this fine; virtualization adds unnecessary complexity</td>
                <td className="p-3">Plain rendering</td>
              </tr>
              <tr>
                <td className="p-3">100-500 items</td>
                <td className="p-3">May work without virtualization; depends on item complexity</td>
                <td className="p-3">CSS <code>content-visibility: auto</code></td>
              </tr>
              <tr>
                <td className="p-3">SEO-critical content</td>
                <td className="p-3">Hidden items are invisible to search crawlers</td>
                <td className="p-3">Server-render all items, paginate</td>
              </tr>
              <tr>
                <td className="p-3">Print-friendly pages</td>
                <td className="p-3">Only visible items print</td>
                <td className="p-3">Separate print view or paginated layout</td>
              </tr>
              <tr>
                <td className="p-3">Cmd+F search</td>
                <td className="p-3">Browser find-in-page only searches DOM text</td>
                <td className="p-3">Custom search UI or paginate</td>
              </tr>
              <tr>
                <td className="p-3">Heavy item animations</td>
                <td className="p-3">Items mount/unmount frequently during scroll, breaking enter/exit animations</td>
                <td className="p-3">Paginate or limit dataset</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 font-semibold">CSS content-visibility: The Native Alternative</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`/* CSS-only virtualization for moderate lists (100-500 items) */
.list-item {
  content-visibility: auto;
  contain-intrinsic-size: auto 60px; /* Estimated height when hidden */
}

/*
  How it works:
  - content-visibility: auto tells the browser to skip rendering for
    off-screen elements
  - contain-intrinsic-size provides a placeholder size so the scrollbar
    remains accurate
  - The browser handles everything — no JavaScript needed

  Limitations:
  - Less control than JS virtualization
  - Browser support: Chrome 85+, Edge 85+, Firefox 125+, Safari 18+
  - Less aggressive — still creates all DOM nodes, just skips rendering
  - Not suitable for 10K+ items (DOM nodes still exist in memory)
*/`}</code>
        </pre>
      </section>

      <section>
        <h2>Performance Optimization Patterns</h2>
        <p>
          Beyond basic virtualization, several patterns can further improve performance:
        </p>

        <h3 className="mt-6 font-semibold">1. Memoize Row Components</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { memo } from 'react';

// Without memo: every scroll event re-renders ALL visible rows
// With memo: only rows whose props changed re-render
const Row = memo(function Row({ data, index, style }) {
  return (
    <div style={style}>
      {data[index].name}
    </div>
  );
});

// For react-window: use itemData to pass stable references
<FixedSizeList itemData={users} itemCount={users.length} itemSize={48}>
  {Row}
</FixedSizeList>`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">2. Debounce Expensive Operations During Scroll</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useState, useCallback } from 'react';

function OptimizedList({ items }) {
  const parentRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    // Listen for scroll state changes
    onChange: () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 150);
    },
  });

  return (
    <div ref={parentRef} style={{ height: 600, overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((vItem) => (
          <div
            key={vItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: \`translateY(\${vItem.start}px)\`,
            }}
          >
            {/* Show lightweight placeholder during fast scrolling */}
            {isScrolling ? (
              <div className="h-20 bg-gray-100 animate-pulse rounded" />
            ) : (
              <ExpensiveRowComponent item={items[vItem.index]} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">3. Use transform Instead of top for Positioning</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// BAD: changing 'top' triggers layout recalculation
<div style={{ position: 'absolute', top: virtualRow.start }}>

// GOOD: transform uses the compositor thread, skipping layout and paint
<div style={{
  position: 'absolute',
  top: 0,
  transform: \`translateY(\${virtualRow.start}px)\`
}}>

// WHY: CSS transforms are handled by the GPU compositor thread,
// not the main thread. This means positioning updates during scroll
// don't block JavaScript execution or trigger expensive layout passes.`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">4. Stable Keys to Prevent Unnecessary Remounts</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// BAD: using index as key causes remounts when items shift
{virtualizer.getVirtualItems().map((vItem) => (
  <div key={vItem.index}>...</div>
))}

// GOOD: use vItem.key (which maps to stable item identity)
{virtualizer.getVirtualItems().map((vItem) => (
  <div key={vItem.key}>...</div>
))}

// ALSO GOOD: use item's unique ID for maximum stability
{virtualizer.getVirtualItems().map((vItem) => (
  <div key={items[vItem.index].id}>...</div>
))}`}</code>
        </pre>
      </section>

      <section>
        <h2>Common Pitfalls and Debugging</h2>
        <ul className="space-y-3">
          <li>
            <strong>Scroll flicker with variable heights:</strong> If estimated sizes differ significantly
            from measured sizes, the total height changes as items mount, causing the scrollbar to jump.
            Solution: provide accurate <code>estimateSize</code> values or use <code>react-virtuoso</code>
            which handles this gracefully.
          </li>
          <li>
            <strong>Missing <code>overflow: auto</code> on scroll container:</strong> The virtualizer needs
            a scrollable parent. Without <code>overflow: auto</code> or <code>overflow: scroll</code>, no
            scroll events fire and the virtualizer never updates.
          </li>
          <li>
            <strong>Stale closures in row components:</strong> Row components that capture state via closures
            may show stale data after re-renders. Use <code>itemData</code> props or refs to ensure fresh data.
          </li>
          <li>
            <strong>Incorrect container height:</strong> If the scroll container has no explicit height
            (relying on flex or auto), the virtualizer cannot calculate visible items. Always set a concrete
            height or use <code>height: 100%</code> with a height-constrained parent.
          </li>
          <li>
            <strong>ResizeObserver loop errors:</strong> Dynamic measurement can trigger "ResizeObserver loop
            completed with undelivered notifications" warnings. This is usually benign but can be suppressed
            with <code>window.addEventListener('error', ...)</code> if needed.
          </li>
          <li>
            <strong>Forgetting to reset measurements:</strong> In <code>react-window</code>'s
            <code>VariableSizeList</code>, if item sizes change (e.g., expanding an accordion row), you must
            call <code>listRef.current.resetAfterIndex(changedIndex)</code> to clear cached measurements.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Talking Points</h2>
        <ul className="space-y-2">
          <li>
            Virtualization solves the DOM bottleneck by maintaining a constant number of DOM nodes (~20-40)
            regardless of dataset size, transforming O(n) rendering costs to O(1).
          </li>
          <li>
            The core algorithm: calculate visible indices from scrollTop and viewport height, absolutely
            position those items in a tall inner container, and add overscan items for smooth scrolling.
          </li>
          <li>
            Fixed-height virtualization uses simple multiplication (offset = index * height). Variable-height
            requires prefix sums, binary search, and often dynamic measurement via ResizeObserver.
          </li>
          <li>
            <code>@tanstack/react-virtual</code> is headless (hook-only) for maximum flexibility;
            <code>react-window</code> is lightweight with ready-made components; <code>react-virtuoso</code>
            handles dynamic heights, grouped lists, and infinite scroll out of the box.
          </li>
          <li>
            Combine with infinite scroll for unbounded datasets: virtualization keeps the DOM small while
            cursor-based pagination loads data incrementally. Use <code>@tanstack/react-query</code>'s
            <code>useInfiniteQuery</code> for the data layer.
          </li>
          <li>
            Use <code>transform: translateY()</code> instead of <code>top</code> for positioning — transforms
            use the GPU compositor thread and avoid triggering layout.
          </li>
          <li>
            Don't virtualize small lists ({'<'}100 items) or SEO-critical content. For moderate lists
            (100-500 items), CSS <code>content-visibility: auto</code> may suffice without JavaScript.
          </li>
          <li>
            Accessibility requires <code>aria-rowcount</code>, <code>aria-rowindex</code>, and keyboard
            navigation that scrolls to focused items, since screen readers cannot see unmounted elements.
          </li>
        </ul>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://tanstack.com/virtual/latest" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              TanStack Virtual Documentation
            </a> — Official docs, examples, and API reference for @tanstack/react-virtual
          </li>
          <li>
            <a href="https://react-window.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              react-window Examples
            </a> — Interactive examples for FixedSizeList, VariableSizeList, and grid components
          </li>
          <li>
            <a href="https://virtuoso.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              React Virtuoso Documentation
            </a> — Guides for dynamic heights, grouped lists, table virtualization, and chat UIs
          </li>
          <li>
            <a href="https://web.dev/virtualize-long-lists-react-window/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              web.dev: Virtualize Long Lists with react-window
            </a> — Google's guide on implementing list virtualization for web performance
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              MDN: content-visibility
            </a> — CSS-based rendering optimization as an alternative to JavaScript virtualization
          </li>
          <li>
            <a href="https://nolanlawson.com/2022/12/26/the-cost-of-convenience/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              Nolan Lawson: The Cost of Convenience
            </a> — Analysis of DOM size impact on web application performance
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/listbox/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              WAI-ARIA Listbox Pattern
            </a> — Accessibility patterns for virtualized list components
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
