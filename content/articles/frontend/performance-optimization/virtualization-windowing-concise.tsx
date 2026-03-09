"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-virtualization-windowing-concise",
  title: "Virtualization/Windowing (for Long Lists)",
  description: "Quick overview of list virtualization techniques for rendering large datasets efficiently in React applications.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "virtualization-windowing",
  version: "concise",
  wordCount: 2800,
  readingTime: 12,
  lastUpdated: "2026-03-09",
  tags: ["frontend", "performance", "virtualization", "windowing", "react-window", "react-virtual", "infinite-scroll"],
  relatedTopics: ["lazy-loading", "web-vitals", "bundle-size-optimization"],
};

export default function VirtualizationWindowingConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Virtualization</strong> (also called <strong>windowing</strong>) is a rendering technique that only
          mounts DOM elements for the items currently visible in the viewport, plus a small buffer zone above and
          below. Instead of rendering 10,000 list items and creating 10,000 DOM nodes, a virtualized list might
          only render 20-30 nodes at any given time — regardless of the total dataset size.
        </p>
        <p>
          The technique works by calculating which items are visible based on the scroll position and container
          dimensions, then positioning only those items within a container whose total height matches what the
          full list would occupy. As the user scrolls, items that leave the viewport are unmounted and recycled
          for newly visible items.
        </p>
      </section>

      <section>
        <h2>The DOM Bottleneck</h2>
        <p>
          Every DOM node consumes memory and contributes to layout, paint, and composite costs. Rendering
          thousands of nodes creates compounding performance problems:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Memory:</strong> Each DOM node uses ~0.5-1KB of memory. 10,000 rows with nested elements
            can consume 50-100MB of browser memory.
          </li>
          <li>
            <strong>Initial Render:</strong> Creating 10,000 DOM nodes takes 2-5 seconds, during which the
            main thread is blocked and the page is unresponsive.
          </li>
          <li>
            <strong>Layout Thrashing:</strong> Any style change triggers layout recalculation across all nodes.
            The browser must measure and position every element.
          </li>
          <li>
            <strong>Scroll Jank:</strong> The browser struggles to maintain 60fps when painting thousands of
            elements during scroll, causing visible stuttering.
          </li>
        </ul>

        <h3 className="mt-4 font-semibold">Performance Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-3 text-left">Metric</th>
                <th className="p-3 text-left">10K DOM Nodes</th>
                <th className="p-3 text-left">Virtualized (20 nodes)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3">Initial Render</td>
                <td className="p-3">2,000-5,000ms</td>
                <td className="p-3">5-15ms</td>
              </tr>
              <tr>
                <td className="p-3">Memory Usage</td>
                <td className="p-3">50-100MB</td>
                <td className="p-3">2-5MB</td>
              </tr>
              <tr>
                <td className="p-3">Scroll FPS</td>
                <td className="p-3">15-30fps</td>
                <td className="p-3">55-60fps</td>
              </tr>
              <tr>
                <td className="p-3">DOM Nodes</td>
                <td className="p-3">10,000+</td>
                <td className="p-3">20-40</td>
              </tr>
              <tr>
                <td className="p-3">Time to Interactive</td>
                <td className="p-3">3-8 seconds</td>
                <td className="p-3">{'<'}100ms</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>How Windowing Works</h2>
        <p>
          The core algorithm is straightforward: given the scroll offset, container height, and item sizes,
          calculate which items are visible and render only those. A virtualized list consists of:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Outer Container:</strong> A scrollable element with <code>overflow: auto</code> and a fixed
            height. This is what the user actually scrolls.
          </li>
          <li>
            <strong>Inner Container:</strong> A tall element whose height equals the total height of all items
            combined. This creates the correct scrollbar size and scroll range.
          </li>
          <li>
            <strong>Visible Items:</strong> Absolutely positioned elements placed at their calculated offsets
            within the inner container. Only items in the visible range plus a buffer zone are rendered.
          </li>
          <li>
            <strong>Overscan:</strong> Extra items rendered above and below the visible area to prevent flicker
            during fast scrolling. Typically 3-5 items in each direction.
          </li>
        </ul>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Pseudocode: core windowing calculation
function getVisibleRange(scrollTop, containerHeight, itemHeight, totalItems) {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight)
  );

  // Add overscan buffer
  const overscan = 5;
  return {
    start: Math.max(0, startIndex - overscan),
    end: Math.min(totalItems - 1, endIndex + overscan),
  };
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Library Options</h2>

        <h3 className="mt-4 font-semibold">react-window</h3>
        <p>
          Lightweight (6KB gzipped) successor to react-virtualized. Provides four core components:
          <code>FixedSizeList</code>, <code>VariableSizeList</code>, <code>FixedSizeGrid</code>, and
          <code>VariableSizeGrid</code>.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { FixedSizeList } from 'react-window';

function UserList({ users }) {
  const Row = ({ index, style }) => (
    <div style={style} className="flex items-center px-4 border-b">
      <img src={users[index].avatar} className="w-8 h-8 rounded-full mr-3" />
      <span>{users[index].name}</span>
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      width="100%"
      itemCount={users.length}
      itemSize={48}
    >
      {Row}
    </FixedSizeList>
  );
}

// Variable size rows — you must provide a function that returns each item's height
import { VariableSizeList } from 'react-window';

function MessageList({ messages }) {
  const getItemSize = (index) => messages[index].isExpanded ? 120 : 48;

  const Row = ({ index, style }) => (
    <div style={style} className="p-3 border-b">
      <p className="font-medium">{messages[index].sender}</p>
      <p>{messages[index].text}</p>
    </div>
  );

  return (
    <VariableSizeList
      height={600}
      width="100%"
      itemCount={messages.length}
      itemSize={getItemSize}
    >
      {Row}
    </VariableSizeList>
  );
}`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">@tanstack/react-virtual</h3>
        <p>
          A headless virtualization hook — it calculates positioning but leaves rendering entirely to you. This
          gives maximum flexibility for custom layouts and styling.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

function VirtualList({ items }) {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 5,
  });

  return (
    <div ref={parentRef} style={{ height: 600, overflow: 'auto' }}>
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
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: virtualRow.size,
              transform: \`translateY(\${virtualRow.start}px)\`,
            }}
          >
            {items[virtualRow.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">react-virtuoso</h3>
        <p>
          Higher-level component with automatic height measurement, grouped lists, sticky headers, and
          built-in infinite scrolling support. Larger bundle (~15KB gzipped) but requires less manual setup.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { Virtuoso, GroupedVirtuoso } from 'react-virtuoso';

// Simple list — handles dynamic heights automatically
function AutoHeightList({ items }) {
  return (
    <Virtuoso
      style={{ height: 600 }}
      totalCount={items.length}
      itemContent={(index) => (
        <div className="p-4 border-b">
          <h3>{items[index].title}</h3>
          <p>{items[index].description}</p>
        </div>
      )}
    />
  );
}

// Grouped list with sticky headers
function GroupedContactList({ groups, contacts }) {
  return (
    <GroupedVirtuoso
      style={{ height: 600 }}
      groupCounts={groups.map((g) => g.count)}
      groupContent={(index) => (
        <div className="bg-gray-100 p-2 font-bold sticky top-0">
          {groups[index].label}
        </div>
      )}
      itemContent={(index) => (
        <div className="p-3 border-b">{contacts[index].name}</div>
      )}
    />
  );
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Infinite Scroll with Virtualization</h2>
        <p>
          Virtualization and infinite scroll are complementary patterns. Virtualization keeps the DOM small,
          while infinite scroll loads data incrementally. Together they enable smooth browsing of datasets
          with millions of records.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { useVirtualizer } from '@tanstack/react-virtual';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRef, useEffect } from 'react';

function InfiniteVirtualList() {
  const parentRef = useRef(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['items'],
      queryFn: ({ pageParam = 0 }) => fetchItems(pageParam),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const allItems = data?.pages.flatMap((p) => p.items) ?? [];

  const virtualizer = useVirtualizer({
    count: hasNextPage ? allItems.length + 1 : allItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 5,
  });

  // Fetch next page when approaching the end
  useEffect(() => {
    const lastItem = virtualizer.getVirtualItems().at(-1);
    if (!lastItem) return;
    if (lastItem.index >= allItems.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [virtualizer.getVirtualItems(), hasNextPage, isFetchingNextPage]);

  return (
    <div ref={parentRef} style={{ height: 600, overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((vRow) => (
          <div
            key={vRow.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: \`translateY(\${vRow.start}px)\`,
            }}
          >
            {vRow.index < allItems.length
              ? allItems[vRow.index].name
              : 'Loading...'}
          </div>
        ))}
      </div>
    </div>
  );
}`}</code>
        </pre>
      </section>

      <section>
        <h2>When NOT to Virtualize</h2>
        <p>
          Virtualization adds complexity. There are cases where it is unnecessary or even counterproductive:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Small lists ({'<'}100 items):</strong> The DOM can handle a few hundred simple elements
            without any performance issues. The overhead of virtualization isn't justified.
          </li>
          <li>
            <strong>SEO-critical content:</strong> Virtualized items not in the DOM are invisible to crawlers.
            If search engines need to index all items, virtualization hides content.
          </li>
          <li>
            <strong>CSS <code>content-visibility: auto</code>:</strong> Modern browsers support native rendering
            optimization via CSS containment. For moderately sized lists (100-500 items), this can provide
            sufficient performance without JavaScript-based virtualization.
          </li>
          <li>
            <strong>Print layouts:</strong> Virtualized lists only render visible items, so printing
            produces incomplete output. You need a separate non-virtualized view for printing.
          </li>
          <li>
            <strong>Cmd+F search:</strong> Browser find-in-page cannot locate text in unmounted items.
            If text search across all items is critical, consider alternatives.
          </li>
        </ul>
      </section>

      <section>
        <h2>Accessibility Considerations</h2>
        <ul className="space-y-2">
          <li>
            Use proper ARIA roles: <code>role="listbox"</code> or <code>role="grid"</code> on the container
            with <code>aria-rowcount</code> set to the total item count.
          </li>
          <li>
            Set <code>aria-rowindex</code> on each visible row so screen readers know the item's position
            within the full list.
          </li>
          <li>
            Ensure keyboard navigation works: arrow keys should scroll the container and shift focus to
            newly visible items rather than jumping to the end of the DOM.
          </li>
          <li>
            Announce dynamic loading status with <code>aria-live="polite"</code> regions when fetching
            additional pages in infinite scroll scenarios.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Talking Points</h2>
        <ul className="space-y-2">
          <li>
            Virtualization solves the DOM bottleneck by only rendering visible items, reducing thousands of
            DOM nodes to a few dozen regardless of dataset size.
          </li>
          <li>
            The core algorithm calculates visible indices from scroll position and container height, then
            absolutely positions those items within a tall inner container.
          </li>
          <li>
            <code>@tanstack/react-virtual</code> is headless and flexible; <code>react-window</code> is
            lightweight with ready-made components; <code>react-virtuoso</code> handles dynamic heights
            and grouped lists out of the box.
          </li>
          <li>
            Combine virtualization with infinite scroll for datasets too large to load at once — virtualization
            keeps the DOM small while infinite queries fetch data incrementally.
          </li>
          <li>
            Don't virtualize small lists ({'<'}100 items) — the complexity isn't worth it, and CSS
            <code>content-visibility</code> may suffice for moderate lists.
          </li>
          <li>
            Accessibility requires ARIA attributes (<code>aria-rowcount</code>, <code>aria-rowindex</code>)
            and keyboard navigation support since screen readers can't see unmounted items.
          </li>
        </ul>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://tanstack.com/virtual/latest" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              TanStack Virtual Documentation
            </a> — Official docs for @tanstack/react-virtual
          </li>
          <li>
            <a href="https://react-window.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              react-window Examples
            </a> — Interactive examples and API reference
          </li>
          <li>
            <a href="https://virtuoso.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              React Virtuoso Documentation
            </a> — Guides for dynamic heights, grouped lists, and infinite scroll
          </li>
          <li>
            <a href="https://web.dev/virtualize-long-lists-react-window/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              web.dev: Virtualize Long Lists
            </a> — Google's guide on list virtualization for web performance
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              MDN: content-visibility
            </a> — CSS-based alternative to JavaScript virtualization
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
