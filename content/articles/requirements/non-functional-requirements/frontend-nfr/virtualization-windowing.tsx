"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-virtualization-windowing",
  title: "Virtualization / Windowing",
  description:
    "Comprehensive guide to list virtualization and windowing techniques for rendering large datasets efficiently. Covers react-window, react-virtual, custom implementations, accessibility, and performance benchmarks.",
  category: "frontend",
  subcategory: "nfr",
  slug: "virtualization-windowing",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-11",
  tags: [
    "frontend",
    "nfr",
    "performance",
    "virtualization",
    "windowing",
    "large-lists",
    "react",
    "accessibility",
  ],
  relatedTopics: ["page-load-performance", "memoization", "infinite-scroll"],
};

export default function VirtualizationWindowingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Virtualization</strong> (also called windowing) is a
          performance optimization technique that renders only the visible
          portion of a large list or grid, recycling DOM nodes as users scroll.
          Instead of rendering thousands of items simultaneously, virtualization
          renders only what fits in the viewport plus a small buffer — typically
          10-20 items regardless of whether the list contains 100 or 100,000
          items. The performance impact is dramatic: a list with 10,000 items
          might take 5-10 seconds to render initially and cause continuous jank
          during scrolling, but with virtualization, initial render takes
          20-30ms and scrolling maintains 60fps.
        </p>
        <p>
          Virtualization is essential for data tables (admin dashboards,
          analytics views), chat messages (Slack, Discord, WhatsApp web), search
          results (infinite scroll result lists), file explorers (folder
          contents with many files), and dropdown selects (large option lists).
          For staff and principal engineers, understanding virtualization is
          crucial because it is often the difference between a usable and
          unusable application when dealing with large datasets. The technique
          applies to both vertical lists and 2D grids, and modern libraries make
          implementation straightforward.
        </p>
        <p>
          The fundamental principle is that DOM operations are the bottleneck,
          not JavaScript computation. Each DOM node consumes memory, increased
          parse time, and slowed layout/paint operations. By reducing the number
          of DOM nodes from thousands to dozens, virtualization eliminates the
          primary performance bottleneck for list-heavy applications. The
          trade-off is increased complexity in scroll position management, item
          measurement (for variable-size items), and accessibility (screen
          readers need to know the full list size, not just the rendered items).
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          The virtualization algorithm calculates which items are visible in the
          viewport and renders only those items, positioned absolutely to appear
          in their correct locations. The viewport is the visible area of the
          scrollable container. The overscan is the number of extra items
          rendered beyond the viewport as a buffer to prevent white space during
          fast scrolling. The item size is the height (for vertical lists) or
          width (for horizontal lists) of each item. The scroll offset is the
          current scroll position used to calculate the visible range. The
          spacer is an invisible element that maintains the total scrollable
          height so the scrollbar reflects the full list size, not just the
          rendered items.
        </p>
        <p>
          Fixed-size virtualization is the simplest approach — all items have
          the same height, making the visible range calculation trivial (scroll
          offset divided by item size). This provides the best performance
          because no measurement is needed, but it is inflexible and cannot
          handle dynamic content. Dynamic-size virtualization handles items of
          varying heights by measuring each item as it renders (using
          ResizeObserver), caching measurements in a map (item index to size),
          and calculating cumulative offsets for positioning. This is more
          complex and has slight performance overhead for measurements, but it
          handles any content type. Grid virtualization extends the concept to
          two dimensions, calculating visible rows and columns — useful for
          data tables, spreadsheets, and image galleries.
        </p>
        <p>
          Popular virtualization libraries provide ready-made solutions.
          react-window (approximately 13KB, maintained by Brian Vaughn of the
          React team) provides FixedSizeList, VariableSizeList, FixedSizeGrid,
          and VariableSizeGrid components — the best balance of features and
          bundle size for most use cases. tanstack-virtual (formerly
          react-virtual) provides a headless, hook-based API that is
          framework-agnostic — more flexible but requires more setup. Building
          a custom virtualization implementation is straightforward for simple
          cases — listen to scroll events (throttled with
          requestAnimationFrame), calculate the visible range based on scroll
          offset, render only visible items with absolute positioning using
          transform: translateY for GPU-accelerated positioning.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/virtualization-how-it-works.svg"
          alt="How Virtualization Works"
          caption="Virtualization renders only visible items plus overscan buffer, recycling DOM nodes as users scroll — reducing rendered items from thousands to dozens while maintaining correct scrollbar behavior"
        />
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The virtualization architecture consists of three layers. The
          measurement layer determines item sizes — for fixed-size lists, this
          is a constant value; for dynamic-size lists, items are measured as
          they render using ResizeObserver and the measurements are cached for
          future calculations. The calculation layer determines which items are
          visible based on the current scroll offset, viewport size, and item
          sizes — it computes the start index (first visible item), end index
          (last visible item), and total scrollable height (sum of all item
          sizes). The rendering layer renders only the items in the visible
          range, positioned absolutely using transform: translateY to place each
          item at its correct offset, with a spacer element maintaining the
          total scrollable height for correct scrollbar behavior.
        </p>
        <p>
          The scroll event flow is critical for performance. Scroll events fire
          at 60Hz (every 16ms) during scrolling, and processing every event can
          cause jank. The solution is to throttle scroll handling with
          requestAnimationFrame, ensuring the virtualization calculation runs at
          most once per animation frame. Within the calculation, the visible
          range is computed from the scroll offset and viewport dimensions, the
          overscan is added (typically 2-5 items above and below the viewport),
          and only items in this range are rendered. Items outside the range are
          unmounted (for React) or hidden (for non-React implementations),
          freeing their DOM nodes for garbage collection or reuse.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/virtualization-types.svg"
          alt="Virtualization Types"
          caption="Comparison of fixed-size virtualization (constant item height, simplest), dynamic-size virtualization (measured items, flexible), and grid virtualization (2D visible range for tables and spreadsheets)"
        />

        <p>
          Advanced patterns extend virtualization for common use cases. Infinite
          scrolling with virtualization combines the two techniques — items are
          loaded in pages (20-50 items per page) as the user scrolls near the
          end, and the virtualized list renders only the visible portion of the
          accumulated items. Search and filtering with virtualization works
          seamlessly — filter the data array and pass the filtered result to the
          virtualized list, which automatically adjusts to the new item count.
          Auto-scrolling to specific items calculates the cumulative offset of
          all preceding items and uses scrollTo to position the viewport,
          ensuring the target item is visible.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Fixed-size versus dynamic-size virtualization involves a trade-off
          between performance and flexibility. Fixed-size virtualization is
          faster because the visible range calculation is a simple division
          (scroll offset divided by item height) — no measurement, no caching,
          no measurement updates. Dynamic-size virtualization requires measuring
          each item as it renders, caching the measurement, calculating
          cumulative offsets, and handling measurement changes (if content
          changes after initial render). The performance difference is
          noticeable for very large lists (10,000+ items) but negligible for
          moderate lists (under 1,000 items). Use fixed-size whenever possible
          — design the list items with consistent heights — and use dynamic-size
          only when content genuinely varies in height.
        </p>
        <p>
          Overscan amount involves a trade-off between scroll smoothness and
          memory usage. More overscan items means less chance of seeing white
          space during fast scrolling (the buffer items are already rendered),
          but more overscan means more DOM nodes in memory and longer render
          times. The recommended overscan is 2-5 items for typical lists —
          enough to handle normal scrolling speed without excessive memory
          overhead. For lists with very fast scrolling (trackpad gesture
          scrolling), increase overscan to 5-10 items. For memory-constrained
          environments (mobile devices with limited RAM), reduce overscan to
          1-2 items.
        </p>
        <p>
          Virtualization versus pagination is an architectural choice for
          handling large datasets. Virtualization renders all items but only
          displays the visible ones — the user can scroll through the entire
          dataset seamlessly. Pagination loads and renders one page at a time —
          the user navigates between pages. Virtualization provides a better
          user experience for browsing (continuous scroll, no page navigation)
          but consumes more memory (the measurement cache for all items).
          Pagination is simpler to implement, uses less memory, and works with
          server-side pagination (only fetching the current page). The choice
          depends on user needs — virtualization for browsing and exploration,
          pagination for targeted navigation (jumping to a specific page).
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/virtualization-performance.svg"
          alt="Virtualization Performance"
          caption="Performance comparison showing render time, memory usage, and scroll FPS for virtualized versus non-virtualized lists — virtualization maintains consistent performance regardless of total list size"
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Use fixed-size items whenever possible — it is the single most
          impactful optimization for virtualization performance. Design list
          items with consistent heights using CSS min-height and max-height,
          truncate text content to fit within the fixed height, and use
          expandable items (click to reveal more content) rather than variable
          height items. If variable heights are unavoidable, provide estimated
          item sizes to the virtualization library so it can calculate the
          initial scrollable height accurately, then update measurements as
          items render.
        </p>
        <p>
          Memoize item components to prevent unnecessary re-renders. Each item
          component should be wrapped in React.memo (or use memoization in the
          virtualization library) so that it only re-renders when its specific
          data changes, not when the scroll position changes. This is critical
          because scroll events trigger re-renders of the visible items on every
          animation frame — if the item components are not memoized, the
          virtualization benefit is partially negated by unnecessary re-renders.
        </p>
        <p>
          Set explicit container height for the virtualized list — the
          virtualization library needs to know the viewport dimensions to
          calculate the visible range. Use CSS height or maxHeight on the
          container element. For responsive layouts, update the container height
          on resize events (using ResizeObserver) so the virtualization
          recalculates the visible range when the viewport changes. Provide
          stable React keys for each item — the key should be a unique
          identifier (item ID, not array index) so React can efficiently reuse
          DOM nodes when items are recycled during scrolling.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Not setting the container height is the most common virtualization
          mistake. Without a defined height, the virtualization library cannot
          calculate the viewport size and therefore cannot determine which items
          are visible. The result is either all items rendered (defeating the
          purpose of virtualization) or no items rendered (empty list). The fix
          is to set an explicit height or maxHeight on the virtualized list
          container using CSS, or pass the height as a prop to the
          virtualization component.
        </p>
        <p>
          Dynamic-size virtualization without proper measurement causes items
          to be positioned incorrectly, resulting in overlapping content or gaps
          between items. The fix is to use the virtualization library&apos;s
          variable-size API (VariableSizeList in react-window) which measures
          each item as it renders and updates the cumulative offset. Provide an
          estimated item size function so the library can calculate an initial
          scrollable height before items are measured — this prevents the
          scrollbar from jumping as items are measured.
        </p>
        <p>
          Ignoring accessibility in virtualized lists breaks screen reader
          experience. Screen readers announce list metadata (total items,
          position in list) that virtualization obscures because only a subset
          of items are in the DOM. The fix is to use ARIA attributes:
          role=&quot;list&quot; on the container, role=&quot;listitem&quot; on
          each item, aria-setsize on each item (total number of items in the
          full list, not just rendered), and aria-posinset on each item
          (position in the full list, 1-indexed). This ensures screen readers
          announce &quot;List, 1000 items&quot; and &quot;Item 50 of 1000&quot;
          even though only 20 items are in the DOM.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          Chat applications are the canonical virtualization use case. Slack,
          Discord, and WhatsApp Web render message lists with virtualization
          because conversation histories can contain tens of thousands of
          messages. Messages are loaded in pages (50-100 messages per page) as
          the user scrolls up, and the virtualized list renders only the visible
          messages. Message heights vary (text messages are short, image
          messages are tall, code blocks vary by length), so dynamic-size
          virtualization with ResizeObserver measurement is used. The scroll
          position is preserved when new messages arrive — the user continues
          reading from their current position without being jumped to the bottom
          (unless they are already at the bottom, in which case auto-scroll
          applies).
        </p>
        <p>
          Data tables and spreadsheets use grid virtualization for both row and
          column virtualization. Google Sheets and Excel Online render only the
          visible cells, recycling cell DOM nodes as the user scrolls
          horizontally and vertically. Column virtualization is often less
          aggressive than row virtualization because tables typically have fewer
          columns than rows — a table with 50 columns and 10,000 rows has 500,000
          cells but only 50 columns are visible at once. Sticky headers and
          frozen columns require special handling in the virtualization
          calculation — these elements are rendered outside the virtualized area
          and positioned fixed relative to the scroll container.
        </p>
        <p>
          E-commerce product listing pages with infinite scroll use
          virtualization to maintain performance as users browse through
          hundreds of products. Products are loaded in pages of 20-50 items as
          the user scrolls near the bottom, and the virtualized list renders
          only the visible product cards. Product card heights are typically
          fixed (image + title + price + rating in a consistent layout), so
          fixed-size virtualization is used for optimal performance. The
          virtualized approach maintains 60fps scrolling even with 5,000+
          products loaded, compared to janky scrolling at 500+ products without
          virtualization.
        </p>
      </section>

      <section>
        <h2>Advanced Virtualization Techniques</h2>
        <p>
          Dynamic-size measurement strategies form one of the most complex aspects of production virtualization implementations. When items have genuinely variable heights — text messages of different lengths, cards with optional sections, or content that expands on user interaction — the virtualization engine cannot use simple division to calculate which items are visible. Instead, it must maintain a measurement cache that maps each item index to its rendered height, and calculate cumulative offsets by summing all preceding item heights. The measurement process uses ResizeObserver to detect when items are rendered and measure their actual dimensions, then updates the cache entry for that index. The critical challenge is that measurements are only available after items are rendered, which means the initial scrollable height calculation must rely on estimates. A poor estimate causes the scrollbar to jump as items are measured — if the estimate is too small, the scrollbar starts too large and shrinks as real measurements come in; if the estimate is too large, the scrollbar starts too small and grows. The recommended approach is to provide an estimated item size function that returns the expected average height, which the library uses for the initial calculation and gradually refines as real measurements populate the cache. For applications with highly variable content, a more sophisticated approach categorizes items into size buckets (small, medium, large) and estimates based on the item type rather than using a single global average.
        </p>
        <p>
          Scroll position preservation during data changes is a subtle but critical requirement for production virtualization. When new data arrives — new chat messages, refreshed search results, or paginated items appended — the virtualization engine must decide whether to maintain the current scroll position, adjust it to account for inserted items, or reset it entirely. For chat applications, if the user is at the bottom of the conversation, new messages should auto-scroll into view; but if the user is reading older messages (scrolled up), the scroll position should be preserved so the user&apos;s reading context is not lost. The implementation tracks whether the user was at the bottom before the data change (within a threshold of 50 pixels from the scroll maximum), and only auto-scrolls if that condition was true. For prepend operations (inserting items at the beginning, such as loading older chat messages), the scroll offset must be adjusted by the total height of the newly inserted items to maintain the user&apos;s visual position — if the user was viewing message 100 and 20 older messages are prepended, the scroll position shifts down by the combined height of those 20 messages so the user continues viewing the same content. This adjustment requires the measurement cache to be updated before the scroll position is recalculated, otherwise the adjustment is based on stale measurements and the visual jump is noticeable.
        </p>
        <p>
          Accessibility implementation for virtualized lists goes beyond aria-setsize and aria-posinset to encompass a complete keyboard navigation strategy. Screen readers rely on these ARIA attributes to announce the correct list metadata — aria-setsize tells the screen reader the total number of items in the full list (not just the rendered subset), and aria-posinset tells it the position of each item within the full list. Without these attributes, a screen reader would announce &quot;List, 20 items&quot; when the actual list contains 10,000 items, fundamentally misrepresenting the content to the user. Keyboard navigation requires handling Arrow Up and Arrow Down to move focus between items, Home and End to jump to the first and last items, and Page Up and Page Down to scroll by viewport height. The implementation must programmatically scroll to bring the focused item into view, updating the virtualization engine&apos;s visible range accordingly. For virtualized grids, arrow keys navigate in two dimensions, and the implementation must calculate which cell should receive focus based on the current position and key direction. The complexity increases when combining keyboard navigation with dynamic-size items, because the scroll position calculation depends on accurate measurements that may not yet be available for items that have never been rendered. The solution is to use estimated sizes for keyboard navigation when real measurements are unavailable, accepting a small positioning error in exchange for responsive navigation.
        </p>
        <p>
          Virtualization for grids versus lists introduces two-dimensional complexity that significantly changes the implementation approach. A virtualized list calculates a single visible range (start index to end index) along one axis, but a virtualized grid must calculate visible ranges along both the horizontal and vertical axes simultaneously. The visible cell count is the product of visible rows and visible columns — a grid showing 10 rows and 5 columns has 50 visible cells, compared to 10 visible items in a list. This multiplication effect means that grid virtualization has higher baseline rendering cost and benefits more aggressively from overscan tuning. Column virtualization adds another dimension of complexity because horizontal scrolling is less common than vertical scrolling, and users expect columns to be stable and immediately available. The pragmatic approach for data tables is to virtualize rows aggressively but keep all columns rendered (or use column virtualization only when the column count exceeds a threshold, typically 20-30 columns). Sticky headers and frozen columns in grid virtualization require rendering these elements outside the virtualized area and positioning them with CSS sticky or fixed positioning, then coordinating their scroll behavior with the virtualized scroll container. Spreadsheet applications like Google Sheets implement this with extreme precision — the column headers remain visible during vertical scroll, the first N columns remain visible during horizontal scroll, and the virtualized cell grid adjusts its rendering window based on both scroll offsets simultaneously.
        </p>
        <p>
          Memory management for large datasets in virtualization extends beyond reducing DOM nodes to encompass the measurement cache, item data, and event listener lifecycle. The measurement cache for a list with 100,000 items, if storing a simple number per entry, consumes approximately 800KB of memory — manageable but not negligible. For virtualized grids with 100,000 rows and 50 columns, the measurement cache can grow to 40MB or more if storing measurements for every cell. The solution is to implement measurement cache eviction — remove measurements for items that have scrolled far outside the viewport (beyond the overscan buffer) and recalculate them if the user scrolls back. For fixed-size virtualization, no measurement cache is needed. For dynamic-size virtualization, implement a least-recently-used eviction policy that retains measurements for recently visible items and discards measurements for items that have not been in the viewport for an extended period. The item data array (the source data being virtualized) should be stored in a way that does not prevent garbage collection of removed items — if items are deleted from the data source, the corresponding measurement cache entries should also be removed. Event listeners on the scroll container and ResizeObserver instances on individual items must be cleaned up when the virtualized component unmounts, preventing memory leaks in single-page applications where components are frequently mounted and unmounted during navigation.
        </p>
        <p>
          Custom virtualization implementation details reveal the algorithmic core that libraries abstract away. The fundamental algorithm runs on every scroll event: calculate the scroll offset, divide by item size (for fixed-size) or look up cumulative offsets (for dynamic-size) to find the start index, add the visible item count to find the end index, add overscan on both sides, and render items from start-minus-overscan to end-plus-overscan. The scroll event must be throttled with requestAnimationFrame to avoid processing more than one scroll event per animation frame — without throttling, scroll events fire at the browser&apos;s native rate (typically 60Hz but can be higher on high-refresh-rate displays), and the virtualization calculation, while efficient, can still cause jank if it runs more frequently than the display can update. The positioning of rendered items uses CSS transforms (translateY for vertical lists, translate3D for GPU acceleration) rather than top/left properties, because transforms are handled by the GPU compositor thread and do not trigger layout recalculation. The spacer element — an invisible div that maintains the total scrollable height — is positioned at the end of the rendered items with its height set to the total height of all items minus the rendered items, ensuring the scrollbar reflects the full list size. For dynamic-size virtualization, the spacer height is the sum of all item measurements (or estimates for unmeasured items), and it is recalculated whenever new measurements become available, which can cause the scrollbar to resize as more items are measured. This scrollbar resizing is the primary visual artifact of dynamic-size virtualization and is why providing accurate initial estimates is so important.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does virtualization work and why is it needed?
            </p>
            <p className="mt-2 text-sm">
              A: Virtualization renders only the items visible in the viewport
              plus a small buffer (overscan), recycling DOM nodes as users
              scroll. Without virtualization, rendering 10,000 list items
              creates 10,000 DOM nodes, consuming 50-200MB of memory and
              causing janky scrolling. With virtualization, only 10-20 items
              are in the DOM regardless of total list size, maintaining 60fps
              scrolling. The DOM is the bottleneck — each node consumes memory
              and slows layout/paint operations. Virtualization decouples render
              time from data size.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is the difference between fixed-size and dynamic-size
              virtualization?
            </p>
            <p className="mt-2 text-sm">
              A: Fixed-size assumes all items have the same height — visible
              range is a simple division (scroll offset / item height). It is
              the fastest approach but inflexible. Dynamic-size measures each
              item as it renders (using ResizeObserver), caches measurements,
              and calculates cumulative offsets. It handles any content but has
              measurement overhead. Use fixed-size whenever possible (design
              items with consistent heights) and dynamic-size only when content
              genuinely varies in height.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you make virtualized lists accessible?
            </p>
            <p className="mt-2 text-sm">
              A: Use ARIA attributes to tell screen readers about the full list
              size. Set role=&quot;list&quot; on the container,
              role=&quot;listitem&quot; on each item, aria-setsize to the total
              number of items (not just rendered), and aria-posinset to each
              item&apos;s position in the full list (1-indexed). This ensures
              screen readers announce &quot;List, 1000 items&quot; and
              &quot;Item 50 of 1000&quot; even though only 20 items are in the
              DOM. Support keyboard navigation (Arrow Up/Down, Home, End, Page
              Up/Down) for list navigation.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are common virtualization pitfalls?
            </p>
            <p className="mt-2 text-sm">
              A: Not setting container height (library cannot calculate visible
              range). Forgetting stable item keys (React cannot recycle DOM
              nodes efficiently). Too much overscan (wastes memory — use 2-5
              items). Dynamic sizes without measurement (items overlap or have
              gaps — use VariableSizeList). Ignoring accessibility (screen
              readers see only rendered items — use aria-setsize and
              aria-posinset). Scroll position loss on data change (preserve or
              intentionally reset scroll position).
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: When would you use virtualization versus pagination?
            </p>
            <p className="mt-2 text-sm">
              A: Virtualization for browsing and exploration — continuous scroll
              through all items, seamless experience, better for discovery.
              Pagination for targeted navigation — jumping to a specific page,
              simpler implementation, works with server-side pagination (only
              fetch current page). Virtualization uses more memory (measurement
              cache for all items) but provides better UX. Pagination uses less
              memory and is simpler but interrupts the browsing flow. Choose
              based on user needs — virtualization for feeds and chat,
              pagination for admin tables and search results.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://github.com/bvaughn/react-window"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              react-window — Lightweight Virtualization Library
            </a>
          </li>
          <li>
            <a
              href="https://tanstack.com/virtual"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              TanStack Virtual — Headless Virtualization
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — ResizeObserver API
            </a>
          </li>
          <li>
            <a
              href="https://css-tricks.com/the-difference-between-virtualization-and-infinite-scroll/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              CSS-Tricks — Virtualization vs Infinite Scroll
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WAI-ARIA APG — Accessible Listbox Pattern
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
