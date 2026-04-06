"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-infinite-scroll-virtualized-list",
  title: "Design an Infinite Scroll / Virtualized List",
  description:
    "Complete LLD solution for a production-grade infinite scroll with virtualized list, covering visible window calculation, overscan buffers, variable height items, IntersectionObserver-based page loading, scroll restoration, accessibility, and trade-off analysis vs pagination.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "infinite-scroll-virtualized-list",
  wordCount: 3200,
  readingTime: 20,
  lastUpdated: "2026-04-03",
  tags: [
    "lld",
    "infinite-scroll",
    "virtualization",
    "performance",
    "intersection-observer",
    "accessibility",
    "scroll-restoration",
  ],
  relatedTopics: [
    "data-table",
    "search-autocomplete",
    "loading-skeleton",
    "pagination-patterns",
  ],
};

export default function InfiniteScrollVirtualizedListArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Problem Clarification */}
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a reusable infinite scroll / virtualized list component for a
          large-scale React application. The component must efficiently render thousands
          (or millions) of items by only rendering the subset currently visible in the
          viewport plus a small overscan buffer. It must support variable-height items
          whose heights are unknown until rendered, automatically load additional pages as
          the user scrolls near the bottom, restore scroll position on navigation, and
          remain fully accessible to keyboard and screen-reader users. The component
          should handle real-time data feeds where items can be inserted or removed while
          the user is mid-scroll, and it must do all of this without visible jank or
          layout thrashing.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            The application is a React 19+ SPA with concurrent rendering support.
          </li>
          <li>
            The data source is paginated (REST or WebSocket) with configurable page sizes
            (default: 20-50 items per page).
          </li>
          <li>
            Items may have fixed or variable heights. Variable-height items require
            measurement after mount and a height cache for subsequent renders.
          </li>
          <li>
            The list may contain anywhere from a few hundred to millions of items.
          </li>
          <li>
            The user may navigate away and return; scroll position should be restored
            via history state.
          </li>
          <li>
            The application may run in both light and dark mode.
          </li>
          <li>
            Real-time feeds may push new items to the top of the list (e.g., social media
            feeds), shifting existing items downward.
          </li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Virtualization:</strong> Only render DOM nodes for items currently
            visible in the viewport plus an overscan buffer (items above and below the
            visible window).
          </li>
          <li>
            <strong>Variable Height Support:</strong> Measure item heights after mount,
            maintain a height cache, and recalculate total scroll height when content
            changes or items resize.
          </li>
          <li>
            <strong>Infinite Scroll:</strong> Use IntersectionObserver on a sentinel
            element at the bottom of the rendered window to detect when the user is near
            the end and trigger loading of the next page.
          </li>
          <li>
            <strong>Scroll Restoration:</strong> Save scroll offset and the ID of the
            first visible item to history state. On return, restore position so the user
            sees the same content.
          </li>
          <li>
            <strong>Loading States:</strong> Render skeleton rows with shimmer animation
            while fetching the next page. Show a loading spinner or &quot;Loading more...&quot;
            indicator at the bottom.
          </li>
          <li>
            <strong>Error Handling:</strong> Display an error message with a retry button
            when a page fetch fails. Allow the user to retry without losing their scroll
            position.
          </li>
          <li>
            <strong>Dynamic Content:</strong> Handle items added or removed during scroll
            (real-time feeds). Adjust the virtualization window and offset mapping
            accordingly.
          </li>
          <li>
            <strong>Smooth Scrolling:</strong> Support momentum scroll behavior on touch
            devices. Prevent jank during data fetch by pre-loading pages before the user
            reaches the sentinel.
          </li>
          <li>
            <strong>Accessibility:</strong> Announce &quot;Loaded X more items&quot; to
            screen readers via aria-live regions. Support keyboard navigation through the
            list (arrow keys, Page Up/Down, Home/End).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Performance:</strong> Scrolling must remain at 60fps. The virtualizer
            recalculates the visible window on every scroll event using
            <code>requestAnimationFrame</code> to batch updates and avoid layout thrashing.
          </li>
          <li>
            <strong>Scalability:</strong> The component should handle 1,000,000+ items
            without increased memory usage. Only the visible window (e.g., 20 items) plus
            overscan (e.g., 5 above + 5 below) exist in the DOM at any time.
          </li>
          <li>
            <strong>Reliability:</strong> Scroll position is persisted across route
            changes via history state. If the user navigates away and returns, the list
            restores to the same visual position.
          </li>
          <li>
            <strong>Accessibility:</strong> The list must be navigable via keyboard,
            announce new content loads to screen readers, and maintain proper ARIA roles
            (list, listitem).
          </li>
          <li>
            <strong>Type Safety:</strong> Full TypeScript support for generic item types,
            scroll state, data sources, and configuration.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            User scrolls to the very bottom faster than the next page can load — the
            sentinel should trigger loading early enough (overscan in data space) to
            prevent the user from seeing an empty gap.
          </li>
          <li>
            Variable-height items cause the total scroll height to shift after measurement
            — the virtualizer must adjust spacer heights without causing a visible jump.
          </li>
          <li>
            New items inserted at the top of the list (real-time feed) — existing items
            shift downward. The virtualizer must adjust the scroll offset to keep the
            user&apos;s current visual position stable.
          </li>
          <li>
            User navigates away during a fetch in progress — the fetch should be
            cancellable (AbortController) to avoid state updates on unmounted components.
          </li>
          <li>
            Extremely large items (e.g., a 2000px-tall card) — the virtualizer must
            handle items taller than the viewport without breaking the offset calculation.
          </li>
          <li>
            Server-side rendering — the virtualizer cannot calculate viewport dimensions
            during SSR. It must defer all calculations to the client after mount.
          </li>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is to separate <strong>virtualization logic</strong> from{" "}
          <strong>data-fetching logic</strong>. The virtualizer computes which items
          should be rendered based on the current scroll offset, viewport height, and
          item heights (from cache or measured values). It renders only those items with
          absolute positioning, plus spacer elements above and below to simulate the full
          list height. The infinite-scroll engine watches a sentinel element via
          IntersectionObserver and triggers page loads when the sentinel enters the
          viewport.
        </p>
        <p>
          <strong>Alternative approaches considered:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Render all items:</strong> Simplest approach but impractical for
            large datasets. 100,000 DOM nodes cause massive memory usage, slow layout
            recalculations, and input latency. Virtualization reduces this to ~20-30
            DOM nodes regardless of total item count.
          </li>
          <li>
            <strong>Pagination with &quot;Load More&quot; button:</strong> Better than
            rendering everything but requires explicit user action. Loses the seamless
            browsing experience of infinite scroll. However, it provides clear
            boundaries (page numbers) and easier scroll restoration.
          </li>
          <li>
            <strong>Windowing libraries (react-window, react-virtualized):</strong>
            Production-ready solutions with excellent performance. The trade-off is
            bundle size and less control over edge-case behavior (e.g., real-time feed
            inserts). Building a custom virtualizer is justified when the application
            has unique requirements (WebSocket-driven inserts, custom height caching).
          </li>
        </ul>
        <p>
          <strong>Why custom virtualization + IntersectionObserver is optimal:</strong>{" "}
          IntersectionObserver is non-blocking, runs off the main thread, and fires only
          when the sentinel crosses the viewport threshold. This is far more efficient
          than calculating scroll position on every frame. Combined with a custom
          virtualizer that maintains a height cache, we get precise rendering with
          minimal main-thread work. This pattern is used by production libraries like
          TanStack Virtual and react-window.
        </p>
      </section>

      {/* Section 4: System Design (LLD) */}
      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of six modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Type Definitions (<code>virtualization-types.ts</code>)</h4>
          <p>
            Defines the core interfaces: <code>VirtualItem</code> (wraps a data item with
            its computed offset, size, and index), <code>ScrollState</code> (current scroll
            offset, viewport height, total content height), <code>DataSource&lt;T&gt;</code>
            (generic interface for fetching paginated data), and{" "}
            <code>InfiniteScrollConfig</code> (page size, overscan count, threshold for
            sentinel triggering, loading skeleton height). These types are parameterized
            so the virtualizer works with any data shape.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Virtualization Engine (<code>virtualization-engine.ts</code>)</h4>
          <p>
            Pure functions that compute the visible window. Given the scroll offset,
            viewport height, total item count, and height cache, the engine returns the
            start index, end index, and per-item offset/size. It handles both fixed and
            variable height modes. In variable mode, unmeasured items use an estimated
            height (configurable, default: 100px). The engine also calculates the total
            content height (sum of all item heights) which the container uses to set the
            outer spacer size.
          </p>
          <p className="mt-3">
            <strong>Key functions:</strong>
          </p>
          <ul className="mt-2 space-y-1 text-sm font-mono">
            <li>
              <code>computeVisibleWindow(scrollOffset, viewportHeight, itemCount, heightCache, estimatedSize, overscan)</code>
            </li>
            <li>
              <code>getItemOffset(index, heightCache, estimatedSize)</code>
            </li>
            <li>
              <code>computeTotalHeight(itemCount, heightCache, estimatedSize)</code>
            </li>
            <li>
              <code>updateHeightCache(cache, index, measuredSize)</code>
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Infinite Scroll Engine (<code>infinite-scroll-engine.ts</code>)</h4>
          <p>
            Manages IntersectionObserver on a sentinel element. Tracks the current page,
            loading state, error state, and whether more data is available. When the
            sentinel becomes visible, it calls the data source&apos;s <code>fetchPage</code>
            method and updates state. Handles retry logic with exponential backoff.
            Exposes <code>loadMore()</code>, <code>retry()</code>, and <code>reset()</code>
            actions.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Data Source (<code>data-source.ts</code>)</h4>
          <p>
            Abstract interface <code>DataSource&lt;T&gt;</code> with{" "}
            <code>fetchPage(page, pageSize)</code> returning{" "}
            <code>{`Promise<{ items: T[]; hasMore: boolean }>`}</code>. Concrete
            implementations include <code>RestApiDataSource</code> (HTTP fetch with
            AbortController for cancellation) and <code>WebSocketDataSource</code> (for
            real-time feeds that push items via WebSocket, merging them into the existing
            data array).
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. React Hooks</h4>
          <p>
            <code>useVirtualizer</code> integrates scroll tracking, height measurement
            via ResizeObserver on each rendered item, and visible window computation.
            It subscribes to the scroll container&apos;s scroll event (throttled via
            <code>requestAnimationFrame</code>) and returns the array of virtual items
            to render. <code>useInfiniteScroll</code> wraps the infinite scroll engine,
            exposing loading state, error state, loadMore trigger, and retry handler.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. React Components</h4>
          <p>
            <code>VirtualizedList</code> — root container with the scroll listener, outer
            spacer (total height), and inner container for positioned items.
            <code>VirtualizedItem</code> — individual item rendered with absolute
            positioning, measures its own height via ResizeObserver, reports back to the
            height cache. <code>Sentinel</code> — empty div observed by IntersectionObserver
            to trigger page loads. <code>ScrollRestoration</code> — reads history state
            on mount, scrolls to the saved position after items are rendered.
            <code>FeedSkeleton</code> — animated placeholder rows shown during initial
            load or while fetching the next page.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Management</h3>
        <p>
          The virtualizer maintains local state: scroll offset, viewport height, height
          cache (Map of index to measured height), and the current data array. The
          infinite-scroll engine maintains: current page number, loading flag, error
          flag, hasMore flag, and the accumulated items array. These two engines
          communicate through the <code>useInfiniteScroll</code> hook which feeds loaded
          items into <code>useVirtualizer</code>. No external store (Zustand/Redux) is
          needed because the state is component-local — the list is a self-contained
          widget. However, for applications that need to share list state across routes,
          a Zustand store can be layered on top for persistence.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            <code>VirtualizedList</code> mounts. <code>useVirtualizer</code> initializes
            with empty data, estimated item heights, and viewport dimensions.
          </li>
          <li>
            <code>useInfiniteScroll</code> calls <code>dataSource.fetchPage(1)</code>.
            FeedSkeleton renders skeleton rows.
          </li>
          <li>
            Page 1 resolves. Items are added to the data array. Virtualizer recomputes
            the visible window and renders VirtualizedItems for the visible range.
          </li>
          <li>
            Each VirtualizedItem mounts, measures its height via ResizeObserver, and
            reports to the height cache. The virtualizer recalculates offsets and total
            height.
          </li>
          <li>
            User scrolls. The scroll handler (rAF-throttled) updates scroll offset.
            Virtualizer computes a new visible window and updates which items are rendered.
          </li>
          <li>
            User scrolls near the bottom. The sentinel enters the viewport.
            IntersectionObserver fires.
          </li>
          <li>
            <code>useInfiniteScroll</code> calls <code>fetchPage(2)</code>. Loading
            state activates, skeleton rows render at the bottom.
          </li>
          <li>
            Page 2 resolves. Items are appended to the data array. The sentinel moves
            further down. The cycle repeats.
          </li>
          <li>
            User navigates away. <code>beforeunload</code> or route-change handler saves
            scroll offset and first visible item ID to history.state.
          </li>
          <li>
            User returns. <code>ScrollRestoration</code> reads history.state, waits for
            items to load, then calls <code>{`scrollTo({ top: savedOffset })`}</code>.
          </li>
        </ol>
      </section>

      {/* Section 5: Data Flow / Execution Flow */}
      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          The execution flow follows a unidirectional pattern. Scroll events drive the
          virtualizer&apos;s visible window computation, which determines which items
          render. IntersectionObserver events drive the infinite-scroll engine&apos;s
          page-fetching logic. Both flows converge on the data array, which is the single
          source of truth for what the list displays.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Scroll Event Path</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            User scrolls the container. Native scroll event fires.
          </li>
          <li>
            Scroll handler reads <code>container.scrollTop</code>. If a rAF callback is
            already scheduled, skip (throttling).
          </li>
          <li>
            rAF fires. <code>computeVisibleWindow</code> runs with the new scroll offset.
          </li>
          <li>
            The virtualizer returns a new array of VirtualItems. React reconciles the
            diff — only changed items re-render.
          </li>
          <li>
            Spacer heights update to reflect total content height. Because spacers use
            <code>height</code> style (not transform), this may trigger layout. Mitigation:
            batch spacer updates with item updates in a single render cycle.
          </li>
        </ol>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Page Load Path</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            Sentinel enters viewport (IntersectionObserver fires with{" "}
            <code>isIntersecting: true</code>).
          </li>
          <li>
            <code>useInfiniteScroll</code> checks <code>isLoading</code> and{" "}
            <code>hasMore</code> guards. If loading or no more data, skip.
          </li>
          <li>
            <code>fetchPage(nextPage)</code> called on the data source.
          </li>
          <li>
            On success: items appended to data array, page incremented, hasMore updated
            from response.
          </li>
          <li>
            On failure: error flag set, retry count incremented. Error UI renders with
            retry button.
          </li>
          <li>
            Virtualizer recomputes visible window with the expanded data array. New items
            at the bottom enter the visible window as the user scrolls further.
          </li>
        </ol>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li>
            <strong>Fast scroll past sentinel:</strong> The sentinel may never become
            visible if the user scrolls rapidly to the bottom. Mitigation: also check
            on scroll events — if <code>scrollTop + clientHeight &gt;= scrollHeight - threshold</code>,
            trigger a load. This is a dual-trigger strategy (IntersectionObserver +
            scroll position check).
          </li>
          <li>
            <strong>Variable height recalculation:</strong> When an item&apos;s content
            changes (e.g., expanded accordion), ResizeObserver fires with the new size.
            The height cache updates, and all subsequent item offsets shift. The
            virtualizer triggers a re-render with the new offsets. The scroll position
            is preserved, so the user sees the content shift naturally.
          </li>
          <li>
            <strong>Real-time insert at top:</strong> A WebSocket push adds items at
            index 0. All existing items shift down. The virtualizer adjusts by adding
            the height of inserted items to the scroll offset, keeping the user&apos;s
            current visual content in view. An aria-live announcement (&quot;X new items
            added&quot;) notifies screen reader users.
          </li>
          <li>
            <strong>SSR safety:</strong> All virtualization logic runs inside
            <code>useEffect</code> or behind a <code>typeof window !== 'undefined'</code>
            guard. During SSR, the component renders a static skeleton or the first page
            of items without virtualization.
          </li>
        </ul>
      </section>

      {/* Section 6: Implementation */}
      <section>
        <h2>Implementation</h2>
        <p>
          The full production implementation is available in the <strong>Example tab</strong>.
          Below is a high-level overview of each module and its key design decisions.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">📦 Switch to the Example Tab</h3>
          <p>
            The complete, production-ready implementation consists of 12 files: type
            definitions, virtualization engine, infinite scroll engine, data source
            abstractions, two custom hooks (useVirtualizer, useInfiniteScroll), four
            React components (VirtualizedList, VirtualizedItem, Sentinel, ScrollRestoration,
            FeedSkeleton), and a full EXPLANATION.md walkthrough. Click the{" "}
            <strong>Example</strong> toggle at the top of the article to view all source
            files.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Type Definitions (virtualization-types.ts)</h3>
        <p>
          Defines <code>VirtualItem&lt;T&gt;</code> which wraps the raw data item with
          its <code>index</code>, <code>offset</code> (pixel distance from the top),
          <code>size</code> (measured or estimated height), and <code>key</code> (stable
          identifier). <code>ScrollState</code> tracks <code>scrollTop</code>,{" "}
          <code>viewportHeight</code>, and <code>totalHeight</code>. <code>DataSource&lt;T&gt;</code>
          is a generic interface with <code>fetchPage(page, pageSize, signal)</code>.
          <code>InfiniteScrollConfig</code> holds <code>pageSize</code>, <code>overscan</code>,
          <code>estimatedItemSize</code>, and <code>sentinelThreshold</code>.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Virtualization Engine (virtualization-engine.ts)</h3>
        <p>
          Pure functions with no side effects. <code>computeVisibleWindow</code> uses
          binary search to find the start index given the scroll offset and height cache
          (for variable-height items, a linear scan from the last known position is
          amortized O(1) because scroll events are incremental). The end index is found
          by accumulating heights until the viewport is filled, then adding the overscan
          count. <code>getItemOffset</code> returns the cumulative height of all items
          before the given index. The height cache is a simple <code>Map&lt;number, number&gt;</code>{" "}
          that grows as items are measured.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Infinite Scroll Engine (infinite-scroll-engine.ts)</h3>
        <p>
          Encapsulates IntersectionObserver lifecycle. Creates the observer with a
          configurable <code>rootMargin</code> (e.g., <code>&apos;200px 0px 0px 0px&apos;</code>{" "}
          to trigger 200px before the sentinel enters the viewport). Manages page counter,
          loading flag, error state, and retry count. On fetch failure, implements
          exponential backoff (1s, 2s, 4s, max 30s) for automatic retries, and exposes a
          manual <code>retry()</code> method for user-initiated retry. The <code>reset()</code>
          method clears all state for re-fetching (e.g., when filters change).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: Data Source (data-source.ts)</h3>
        <p>
          <code>RestApiDataSource</code> takes a URL builder function
          <code>(page, pageSize) =&gt; string</code> and a response parser. It uses the
          Fetch API with an AbortController so in-flight requests can be cancelled when
          the component unmounts or when filters change. <code>WebSocketDataSource</code>
          connects to a WebSocket endpoint, listens for <code>ITEM_ADDED</code>,{" "}
          <code>ITEM_REMOVED</code>, and <code>ITEM_UPDATED</code> messages, and merges
          them into the local data array. It emits events that <code>useVirtualizer</code>{" "}
          subscribes to for real-time updates.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: useVirtualizer Hook (hooks/use-virtualizer.ts)</h3>
        <p>
          The main integration hook. Accepts the data array, viewport ref, and config.
          Sets up a scroll listener on the container (rAF-throttled). Maintains the
          height cache as a ref (persisted across renders to avoid recalculation). Returns{" "}
          <code>virtualItems</code> (the subset to render), <code>totalHeight</code> (for
          the outer spacer), and <code>updateItemSize</code> (callback for ResizeObserver
          to report measured heights). Uses <code>useMemo</code> to avoid recomputing the
          visible window unless scroll offset or data changes.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6: useInfiniteScroll Hook (hooks/use-infinite-scroll.ts)</h3>
        <p>
          Wraps the infinite scroll engine. Returns <code>items</code> (accumulated data),
          <code>isLoading</code>, <code>error</code>, <code>hasMore</code>,{" "}
          <code>loadMore</code> (triggered by sentinel), and <code>retry</code> (for
          error recovery). Internally manages the page counter and calls the data
          source&apos;s <code>fetchPage</code>. Cleans up the IntersectionObserver on
          unmount.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 7: VirtualizedList Component (components/virtualized-list.tsx)</h3>
        <p>
          Root container. Renders a scrollable div with <code>overflow: auto</code> and a
          ref for the viewport. Inside, an outer spacer div sets the total content height.
          An inner container renders the virtual items with absolute positioning. The
          sentinel element sits at the bottom. FeedSkeleton renders when loading the first
          page. ScrollRestoration runs on mount to restore position from history state.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 8: VirtualizedItem Component (components/virtualized-item.tsx)</h3>
        <p>
          Renders a single item with <code>position: absolute</code>, <code>top</code> set
          to the item&apos;s computed offset, <code>left: 0</code>, <code>right: 0</code>,
          and <code>height</code> set to the measured or estimated size. Wraps the content
          in a ResizeObserver to detect height changes and report them back to the
          virtualizer via <code>updateItemSize</code>. Uses <code>React.memo</code> to
          prevent re-renders when unrelated items scroll into view.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 9: Sentinel Component (components/sentinel.tsx)</h3>
        <p>
          A 1px-tall empty div at the bottom of the rendered content. Observed by
          IntersectionObserver. When it becomes visible (or within rootMargin), it triggers
          the <code>onVisible</code> callback which calls <code>loadMore()</code>. Uses
          <code>IntersectionObserver</code> with <code>threshold: 0</code> to fire as soon
          as any part of the sentinel enters the viewport.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 10: ScrollRestoration Component (components/scroll-restoration.tsx)</h3>
        <p>
          Reads <code>history.state</code> for saved scroll offset and first visible item
          ID. Waits for the data array to populate (at least the saved index exists), then
          calls <code>{`container.scrollTo({ top: savedOffset, behavior: 'auto' })`}</code>.
          Uses <code>behavior: 'auto'</code> to avoid a visible scroll animation on
          restoration. Cleans up the saved state after successful restoration to prevent
          re-applying on subsequent renders.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 11: FeedSkeleton Component (components/feed-skeleton.tsx)</h3>
        <p>
          Renders 5-10 placeholder rows with a shimmer animation (CSS gradient moving
          left-to-right). Each row has a fixed height matching the estimated item size.
          Shown during the initial page load and at the bottom while fetching the next
          page. Uses <code>aria-busy=&quot;true&quot;</code> and{" "}
          <code>aria-label=&quot;Loading more items&quot;</code> for accessibility.
        </p>
      </section>

      {/* Section 7: Performance & Scalability */}
      <section>
        <h2>Performance &amp; Scalability</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Time and Space Complexity</h3>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Operation</th>
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Space</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">computeVisibleWindow</td>
                <td className="p-2">O(log n) binary search or O(k) incremental scan</td>
                <td className="p-2">O(n) height cache for n measured items</td>
              </tr>
              <tr>
                <td className="p-2">getItemOffset</td>
                <td className="p-2">O(k) from cache start position</td>
                <td className="p-2">O(1)</td>
              </tr>
              <tr>
                <td className="p-2">computeTotalHeight</td>
                <td className="p-2">O(n) sum all cached heights</td>
                <td className="p-2">O(1)</td>
              </tr>
              <tr>
                <td className="p-2">updateHeightCache</td>
                <td className="p-2">O(1) Map set</td>
                <td className="p-2">O(1) per measurement</td>
              </tr>
              <tr>
                <td className="p-2">Scroll handler (rAF)</td>
                <td className="p-2">O(k) where k = visible + overscan items</td>
                <td className="p-2">O(k) DOM nodes rendered</td>
              </tr>
              <tr>
                <td className="p-2">IntersectionObserver callback</td>
                <td className="p-2">O(1) — triggers fetchPage</td>
                <td className="p-2">O(1) — observer instance</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Where <code>n</code> is total items in the data array and <code>k</code> is the
          number of visible + overscan items (typically 20-30). For 1,000,000 items, the
          visible window computation is sub-millisecond, and only ~30 DOM nodes exist
          regardless of total count.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li>
            <strong>Height cache invalidation:</strong> When items are inserted or removed
            mid-list, all subsequent indices shift. The height cache (keyed by index)
            becomes stale. Mitigation: key the cache by item ID instead of index, and
            recompute offsets by iterating in index order. This adds O(n) work on
            mutation but is amortized since mutations are infrequent compared to scroll
            events.
          </li>
          <li>
            <strong>Spacer height updates:</strong> Changing the outer spacer&apos;s height
            triggers a layout recalculation. If this happens on every scroll frame, it
            causes jank. Mitigation: batch spacer updates with item rendering in a single
            state update. Use <code>useLayoutEffect</code> for synchronous DOM reads
            before the browser paints.
          </li>
          <li>
            <strong>ResizeObserver on every item:</strong> Each VirtualizedItem creates a
            ResizeObserver. For 30 visible items, that&apos;s 30 observers. Mitigation:
            use a single ResizeObserver on the container and delegate measurements via
            event bubbling, or pool observers (create 5, reuse across items).
          </li>
          <li>
            <strong>Memory leak from stale closures:</strong> The scroll handler captures
            the height cache ref. If the ref changes (e.g., cache reset), the handler
            may use stale data. Mitigation: store the cache in a <code>useRef</code> and
            always read <code>cacheRef.current</code> inside the handler.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li>
            <strong>Binary search for start index:</strong> For variable-height items,
            instead of linear scan, build a prefix-sum array of heights and use binary
            search to find the item at a given offset. This reduces start index computation
            from O(n) to O(log n). The prefix-sum array is rebuilt only when the height
            cache changes, not on every scroll.
          </li>
          <li>
            <strong>Stable keys:</strong> Each VirtualizedItem uses the item&apos;s unique
            ID as the React <code>key</code> prop (not array index). This prevents React
            from unmounting and remounting items when the visible window shifts — it
            reuses DOM nodes and only updates their position and content.
          </li>
          <li>
            <strong>rAF throttling:</strong> The scroll event fires at the display
            refresh rate (typically 60Hz or 120Hz). Wrapping the visible window
            computation in <code>requestAnimationFrame</code> ensures it runs once per
            paint cycle, not once per event.
          </li>
          <li>
            <strong>Pre-fetch pages:</strong> Set the IntersectionObserver <code>rootMargin</code>{" "}
            to trigger 200-500px before the sentinel enters the viewport. This gives the
            network request time to resolve before the user actually reaches the bottom,
            creating a seamless experience.
          </li>
          <li>
            <strong>React.memo on VirtualizedItem:</strong> Wrap the item component in
            <code>React.memo</code> with a custom comparator that compares the item data,
            offset, and size. This prevents re-renders when the parent re-renders due to
            unrelated scroll position changes.
          </li>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Validation</h3>
        <p>
          List items may contain user-generated content (e.g., social media posts,
          comments). If rendered via <code>dangerouslySetInnerHTML</code>, they are XSS
          vectors. Always sanitize HTML content before rendering. Prefer rendering strings
          as text content (React&apos;s default escaping) and only allow rich content from
          trusted sources through a sanitization library like DOMPurify.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Data Source Security</h3>
        <p>
          The <code>RestApiDataSource</code> makes HTTP requests to fetch paginated data.
          Ensure the API enforces authentication and authorization checks on every page
          request. An attacker should not be able to enumerate all items by iterating
          through page numbers. Implement server-side rate limiting on the paginated
          endpoint to prevent scraping.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Screen Reader Support</h4>
          <ul className="space-y-2">
            <li>
              The list container has <code>role=&quot;list&quot;</code> and each item has
              <code>role=&quot;listitem&quot;</code>.
            </li>
            <li>
              When new items load, an aria-live region announces{" "}
              <code>{`"Loaded {count} more items"`}</code> with{" "}
              <code>aria-live=&quot;polite&quot;</code> to avoid interrupting ongoing
              screen reader speech.
            </li>
            <li>
              The loading skeleton has <code>aria-busy=&quot;true&quot;</code> and an
              <code>aria-label</code> describing what is loading.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Keyboard Navigation</h4>
          <ul className="space-y-2">
            <li>
              The list container is focusable with <code>{`tabIndex={0}`}</code>.
            </li>
            <li>
              Arrow Up/Down moves focus to the previous/next item. Page Up/Down jumps by
              10 items. Home/End jump to the first/last item.
            </li>
            <li>
              Each VirtualizedItem is focusable with <code>{`tabIndex={-1}`}</code> (managed
              by the container&apos;s focus state — roving tabindex pattern).
            </li>
          </ul>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Abuse Prevention</h3>
        <ul className="space-y-2">
          <li>
            <strong>Rate limiting on data source:</strong> The data source should not
            allow unbounded page fetching. Cap the maximum pages per session (e.g., 100
            pages) to prevent scraping.
          </li>
          <li>
            <strong>Request cancellation:</strong> When the component unmounts or filters
            change, in-flight requests are cancelled via AbortController. This prevents
            memory leaks and stale state updates.
          </li>
        </ul>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Virtualization engine:</strong> Test <code>computeVisibleWindow</code>
            with fixed heights (trivial), variable heights with a partially-filled cache,
            and edge cases (scroll at top, scroll at bottom, viewport larger than content).
            Verify start/end indices and offsets are correct.
          </li>
          <li>
            <strong>Height cache:</strong> Test that <code>updateHeightCache</code>{" "}
            correctly stores and retrieves measurements. Test that cache invalidation on
            item insertion shifts subsequent entries.
          </li>
          <li>
            <strong>Infinite scroll engine:</strong> Test that IntersectionObserver
            triggers <code>loadMore</code>, that loading state prevents concurrent fetches,
            that errors set the error flag, and that retry resets the error and re-fetches.
          </li>
          <li>
            <strong>Data source:</strong> Mock fetch and verify the correct URL is called
            with the right page/pageSize params. Test AbortController cancellation.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Full list rendering:</strong> Render VirtualizedList with 1000 items,
            assert only ~20-30 DOM nodes exist (not 1000). Scroll to the bottom, assert
            new items load via IntersectionObserver mock.
          </li>
          <li>
            <strong>Variable height measurement:</strong> Render items with varying
            content heights. Assert ResizeObserver fires, height cache updates, and
            subsequent scroll calculations use measured heights.
          </li>
          <li>
            <strong>Scroll restoration:</strong> Scroll to a position, simulate route
            change (save to history.state), re-render the list, assert scroll position
            is restored.
          </li>
          <li>
            <strong>Error and retry:</strong> Mock fetch to reject on page 2. Assert error
            UI renders with retry button. Click retry, mock fetch to resolve, assert items
            load and error clears.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>
            SSR rendering: verify the list renders a skeleton or first-page items during
            SSR and hydrates correctly on the client.
          </li>
          <li>
            Rapid scroll: simulate 100 scroll events in 1 second, verify only 1 rAF
            callback executes per frame, no memory leaks, height cache remains consistent.
          </li>
          <li>
            Real-time insert: add 5 items at index 0 while user is scrolled to the middle,
            verify scroll offset adjusts by the inserted height and the user&apos;s current
            visual content remains stable.
          </li>
          <li>
            Accessibility: run axe-core automated checks, verify aria-live announcements
            on page load, keyboard navigation through items, roving tabindex behavior.
          </li>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li>
            <strong>Rendering all items:</strong> The most common mistake. Candidates
            often say &quot;I&apos;d map over the array and render each item&quot; without
            considering performance at scale. Interviewers expect virtualization for lists
            exceeding ~100 items.
          </li>
          <li>
            <strong>Using scroll event without throttling:</strong> Attaching a heavy
            computation directly to the scroll event causes jank. The correct approach is
            to use <code>requestAnimationFrame</code> throttling or IntersectionObserver
            for trigger points.
          </li>
          <li>
            <strong>Ignoring variable heights:</strong> Many candidates assume fixed item
            heights, which is rarely true in production (user-generated content, expandable
            cards, images with varying aspect ratios). Interviewers look for candidates
            who discuss height estimation, measurement, and cache invalidation.
          </li>
          <li>
            <strong>Not handling scroll restoration:</strong> For SPAs, losing scroll
            position on navigation is a major UX issue. Candidates should discuss saving
            position to history state or a store and restoring it on return.
          </li>
          <li>
            <strong>Forgetting accessibility:</strong> Virtualized lists are inherently
            challenging for screen readers (only a subset of items exist in the DOM).
            Candidates should discuss aria-live regions for load announcements and
            keyboard navigation patterns.
          </li>
          <li>
            <strong>Using array index as React key:</strong> When items shift due to
            insertion or removal, index-based keys cause React to re-render items with
            wrong content. Always use stable, unique IDs.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Infinite Scroll vs Pagination vs &quot;Load More&quot; Button</h4>
          <p>
            <strong>Infinite scroll</strong> provides a seamless, exploratory browsing
            experience ideal for content feeds (social media, news, product catalogs). The
            trade-off is that users lose their sense of position (no page numbers), the
            footer is unreachable, and scroll restoration is complex. It also makes it
            hard to share a specific position in the list (no URL-based pagination).
          </p>
          <p className="mt-3">
            <strong>Pagination</strong> provides clear boundaries (page numbers), easy
            bookmarking, and server-side control over data delivery. The trade-off is
            friction — users must click to see more content, which reduces engagement for
            exploratory browsing. Pagination is better for transactional interfaces
            (search results, admin tables) where users seek specific items.
          </p>
          <p className="mt-3">
            <strong>&quot;Load More&quot; button</strong> sits in the middle ground. It
            gives users control over when to fetch more data while maintaining a continuous
            flow. It&apos;s simpler to implement than infinite scroll (no IntersectionObserver,
            no sentinel) and avoids the footer-unreachable problem. The trade-off is
            slightly higher interaction cost (a click per page vs automatic loading).
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Fixed Height vs Variable Height Virtualization</h4>
          <p>
            Fixed-height virtualization is significantly simpler — the visible window is
            a straightforward calculation: <code>startIndex = floor(scrollTop / itemHeight)</code>,
            <code>endIndex = ceil((scrollTop + viewportHeight) / itemHeight)</code>.
            Variable-height virtualization requires a height cache, measurement after
            mount, and offset recalculation when items resize. The trade-off is complexity
            vs accuracy. For homogeneous content (e.g., contact lists, settings rows),
            fixed height is sufficient. For heterogeneous content (e.g., social feeds,
            comment threads), variable height is necessary.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Custom Virtualizer vs Library (react-window, TanStack Virtual)</h4>
          <p>
            Building a custom virtualizer gives full control over edge cases (real-time
            inserts, custom height caching, WebSocket integration). The trade-off is
            engineering effort and maintenance burden. Production libraries like react-window
            handle browser quirks, accessibility, and edge cases that a custom implementation
            may miss. For most applications, using a library is the right choice. Custom
            virtualization is justified when the application has unique requirements that
            existing libraries don&apos;t address well, or when bundle size is a critical
            constraint and the use case is simple enough to implement in ~200 lines.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle a list where items can be deleted by other users in
              real time?
            </p>
            <p className="mt-2 text-sm">
              A: When an item is removed, the virtualizer must remove it from the data
              array, invalidate the height cache for that item, and shift all subsequent
              item offsets. If the deleted item was currently visible, the user sees a
              content shift. To minimize disorientation, we can replace the deleted item
              with a placeholder (same height, &quot;This item was deleted&quot; message)
              that fades out after a few seconds. The height cache for subsequent items
              remains valid because their indices shift but their content doesn&apos;t
              change.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement &quot;jump to item&quot; (e.g., user searches for
              an item and wants to scroll to it)?
            </p>
            <p className="mt-2 text-sm">
              A: Find the item&apos;s index in the data array. If the item is within the
              loaded pages, use <code>getItemOffset(index)</code> to get its pixel offset
              and call <code>{`container.scrollTo({ top: offset })`}</code>. If the item is
              not yet loaded, we need to know its approximate position. If the server
              provides the total count and the item&apos;s rank (e.g., &quot;result #4500
              of 10000&quot;), we can estimate the offset using average item height.
              Alternatively, preload pages up to the target item&apos;s page, then scroll.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement grouped/categorized items (e.g., contacts grouped
              by letter)?
            </p>
            <p className="mt-2 text-sm">
              A: Treat group headers as special items in the data array with a different
              type flag. They have their own height (usually fixed, e.g., 32px) and render
              as sticky section headers. The virtualizer handles them identically to regular
              items — the only difference is the component rendered for the type. For
              sticky headers, use CSS <code>position: sticky</code> on the group header
              element so it sticks to the top of the viewport while its group&apos;s items
              scroll underneath.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does your design handle touch devices and momentum scrolling?
            </p>
            <p className="mt-2 text-sm">
              A: On touch devices, <code>overflow: auto</code> containers use native
              momentum scrolling (iOS: <code>-webkit-overflow-scrolling: touch</code>,
              though this is default on modern browsers). The scroll event fires
              continuously during the momentum animation. Our rAF-throttled handler
              processes these efficiently. One challenge: during momentum scroll, the user
              may fling past pages that haven&apos;t loaded yet. The dual-trigger strategy
              (IntersectionObserver + scroll position check) ensures pages load even if
              the sentinel is scrolled past. We can also pre-load more aggressively on
              touch devices by increasing the overscan count.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you add horizontal virtualization (e.g., a calendar grid)?
            </p>
            <p className="mt-2 text-sm">
              A: The same virtualization principles apply in two dimensions. The visible
              window computation includes both horizontal and vertical ranges. Each item
              is positioned with both <code>top</code> and <code>left</code> absolute
              values. The height cache extends to a width cache (measuring column widths).
              react-window provides <code>FixedSizeGrid</code> for this exact use case.
              The complexity increases because the scroll offset is two-dimensional, and
              the overscan buffer applies in both directions.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What if the list needs to support drag-and-drop reordering?
            </p>
            <p className="mt-2 text-sm">
              A: Drag-and-drop with virtualization is challenging because the dragged item
              may be one that&apos;s not currently in the DOM (outside the visible window).
              Solution: when a drag starts, create a &quot;ghost&quot; clone of the item
              that follows the cursor. As the user drags, compute the drop target index
              based on the cursor&apos;s Y position and item offsets. On drop, reorder
              the data array, invalidate the height cache (indices shift), and re-render.
              Libraries like @dnd-kit/core handle this with virtualization-aware adapters.
            </p>
          </div>
        </div>
      </section>

      {/* Section 11: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://tanstack.com/virtual/latest"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              TanStack Virtual — Headless Virtualization Library
            </a>
          </li>
          <li>
            <a
              href="https://react-window.vercel.app/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              react-window — Lightweight React Windowing Library
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — IntersectionObserver API Documentation
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — ResizeObserver API Documentation
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/articles/virtualize-lists"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Web.dev — Virtualize Lists for Performance
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/listbox/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WAI-ARIA Listbox Pattern — Accessibility Guidelines
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
