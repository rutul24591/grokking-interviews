"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-pagination-component",
  title: "Design a Pagination Component",
  description:
    "Complete LLD solution for a production-grade pagination component with ellipsis logic, client/server-side pagination, URL state sync, keyboard navigation, accessibility, and mobile responsiveness.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "pagination-component",
  wordCount: 3200,
  readingTime: 21,
  lastUpdated: "2026-04-03",
  tags: [
    "lld",
    "pagination",
    "navigation",
    "state-management",
    "accessibility",
    "url-sync",
    "server-client",
  ],
  relatedTopics: [
    "data-table",
    "infinite-scroll-virtualized-list",
    "search-autocomplete",
    "wizard-multi-step-form",
  ],
};

export default function PaginationComponentArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Problem Clarification */}
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a reusable pagination component for a large-scale web
          application that displays tabular or list data. The component must render
          page numbers with intelligent ellipsis for large page ranges (e.g.,{" "}
          <code>1 ... 5 6 7 ... 20</code>), provide navigation controls (previous,
          next, first, last page buttons), allow users to select page size (10, 25,
          50, 100 items per page), display the current result range (e.g.,{" "}
          <code>Showing 1-25 of 500</code>), and synchronize the current page and
          page size to URL query parameters for shareable, bookmarkable links.
        </p>
        <p>
          The component must support two pagination modes: <strong>client-side</strong>{" "}
          pagination, where the full dataset is loaded once and sliced locally in memory,
          and <strong>server-side</strong> pagination, where each page change triggers
          an API request with <code>page</code> and <code>pageSize</code> parameters.
          The component must be mobile responsive, keyboard navigable, fully accessible
          to screen readers, and handle edge cases such as empty results, single-page
          datasets, and users navigating beyond the last page.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            The application is a React 19+ SPA with Next.js 16 for routing and
            server-side rendering.
          </li>
          <li>
            The total item count is known upfront (returned by API for server-side,
            computed from data length for client-side).
          </li>
          <li>
            Page numbers are 1-indexed (first page is page 1, not page 0).
          </li>
          <li>
            The default page size is 25 items per page.
          </li>
          <li>
            URL state should use query parameters: <code>?page=3&amp;pageSize=25</code>.
          </li>
          <li>
            The component must work with both static data (client-side) and dynamic
            data fetched from an API (server-side).
          </li>
          <li>
            The application may run in both light and dark mode.
          </li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Page Number Rendering:</strong> Display clickable page number buttons.
            For large page counts, show ellipsis to indicate gaps (e.g.,{" "}
            <code>1 ... 4 5 6 ... 20</code>). The window of visible pages around the
            current page should be configurable (default: 2 pages on each side).
          </li>
          <li>
            <strong>Navigation Controls:</strong> Previous and next page buttons, plus
            optional first and last page buttons. Buttons must be disabled when at the
            first or last page respectively.
          </li>
          <li>
            <strong>Page Size Selector:</strong> Dropdown or button group allowing users
            to select 10, 25, 50, or 100 items per page. Changing page size should reset
            the current page to 1.
          </li>
          <li>
            <strong>Range Display:</strong> Show text indicating the current visible
            range, e.g., <code>Showing 26-50 of 500</code>. Updates dynamically on page
            or page size change.
          </li>
          <li>
            <strong>Client-Side Pagination:</strong> When dataset is fully loaded, slice
            the array based on current page and page size. No API calls on page change.
          </li>
          <li>
            <strong>Server-Side Pagination:</strong> On page or page size change, trigger
            an API fetch with <code>page</code> and <code>pageSize</code> query parameters.
            Display loading state during fetch.
          </li>
          <li>
            <strong>URL State Synchronization:</strong> Current page and page size must
            be reflected in URL query parameters. Changing pagination updates the URL via
            <code>pushState</code> or <code>replaceState</code>. Navigating via browser
            back/forward buttons updates the pagination state.
          </li>
          <li>
            <strong>Mobile Responsiveness:</strong> On small screens, hide page number
            buttons and show only previous/next controls with the range display.
          </li>
          <li>
            <strong>Keyboard Navigation:</strong> Arrow keys (Left/Right) navigate to
            previous/next page. Enter or Space on a page number button navigates to that
            page. Focus must be visible and follow a logical tab order.
          </li>
          <li>
            <strong>Accessibility:</strong> Each page button has an{" "}
            <code>aria-label</code> (e.g., <code>Go to page 5</code>). The active page
            button has <code>aria-current=&quot;page&quot;</code>. The entire pagination
            container uses <code>role=&quot;navigation&quot;</code> with an{" "}
            <code>aria-label</code>.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Performance:</strong> Page number computation must be O(p) where p is
            the number of visible page buttons, not O(totalPages). Rendering must not
            cause layout thrashing.
          </li>
          <li>
            <strong>Scalability:</strong> The ellipsis algorithm must correctly handle
            datasets with 10,000+ pages without rendering performance degradation.
          </li>
          <li>
            <strong>Reliability:</strong> If the user navigates beyond the last page
            (e.g., via URL manipulation), the component must auto-correct to the last
            valid page.
          </li>
          <li>
            <strong>Type Safety:</strong> Full TypeScript support for pagination state,
            configuration, and page range computation.
          </li>
          <li>
            <strong>SSR Compatibility:</strong> The component must render a valid initial
            state during server-side rendering based on URL query parameters.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            Empty dataset (total items = 0): Component should not render, or render a
            &quot;No results&quot; message.
          </li>
          <li>
            Single page (total items &lt;= pageSize): No pagination controls needed.
            Optionally still show range display.
          </li>
          <li>
            Beyond-last-page recovery: URL has <code>?page=50</code> but only 20 pages
            exist. Component must auto-correct to page 20 and update the URL.
          </li>
          <li>
            Invalid page in URL (e.g., <code>?page=abc</code> or <code>?page=-3</code>):
            Default to page 1.
          </li>
          <li>
            Page size change when on page 10 with 25 items/page (viewing items 226-250)
            and switching to 100 items/page: must reset to page 1 to avoid showing an
            empty page.
          </li>
          <li>
            Rapid page changes (user clicks page 1, then 2, then 3 quickly): Server-side
            mode should debounce or cancel in-flight requests to avoid race conditions.
          </li>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is to separate <strong>pagination state management</strong>,{" "}
          <strong>page range computation</strong>, and <strong>UI rendering</strong>{" "}
          into distinct modules. A Zustand store holds the current page, page size, and
          total item count, and handles URL synchronization via{" "}
          <code>history.pushState</code> / <code>history.replaceState</code>. A
          dedicated page range calculator computes which page numbers to display and
          where to place ellipsis markers. Two custom hooks wrap the store: one for
          client-side pagination (array slicing) and one for server-side pagination
          (API fetching).
        </p>
        <p>
          <strong>Alternative approaches considered:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Local state with useReducer:</strong> Viable for a single component
            but fails when multiple components need to read or modify pagination state
            (e.g., a data table and a separate pagination bar). Zustand provides shared
            state without prop drilling.
          </li>
          <li>
            <strong>URL as single source of truth:</strong> Storing page and pageSize
            only in URL params avoids a separate store. However, every page change causes
            a re-render from route updates, and reading current values requires parsing
            the URL on every access. A Zustand store with URL sync provides fast reads
            and deferred writes.
          </li>
          <li>
            <strong>React Router useSearchParams:</strong> Tightly couples to React
            Router. The application uses Next.js routing, so a routing-agnostic approach
            (direct history API + Zustand) is more portable.
          </li>
        </ul>
        <p>
          <strong>Why Zustand + URL sync + hooks is optimal:</strong> Zustand provides
          reactive state that multiple components can subscribe to independently. The URL
          sync layer ensures bookmarkability and browser back/forward navigation work
          correctly. Client-side and server-side hooks encapsulate their respective data
          fetching strategies while sharing the same underlying pagination state. This
          separation of concerns makes each module independently testable.
        </p>
      </section>

      {/* Section 4: System Design (LLD) */}
      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of six modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Type Definitions (<code>pagination-types.ts</code>)</h4>
          <p>
            Defines the core interfaces used across all modules. The{" "}
            <code>PaginationState</code> interface captures the current page, page size,
            and total item count. The <code>PaginationConfig</code> interface holds
            display options such as visible page range, page size options, and whether
            to show first/last buttons. The <code>PageRange</code> interface represents
            the computed output of the ellipsis algorithm: an array of page objects
            (with type <code>page</code> or <code>ellipsis</code>) and the start/end
            item indices for the range display. See the Example tab for the complete
            type definitions.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Page Range Calculator (<code>page-range-calculator.ts</code>)</h4>
          <p>
            Pure function that takes <code>currentPage</code>, <code>totalPages</code>,
            and <code>siblingCount</code> and returns the computed page range with
            ellipsis placement. The algorithm determines a sliding window of visible
            pages centered on the current page, always includes the first and last page,
            and inserts ellipsis markers where gaps exist. This is the most algorithmically
            interesting part of the system. See the Example tab for the implementation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Pagination Store (<code>pagination-store.ts</code>)</h4>
          <p>
            Zustand store that manages <code>PaginationState</code> and exposes actions
            for navigating pages, changing page size, and setting the total item count.
            On every state change, the store optionally syncs to URL query parameters.
            Handles boundary validation (clamping page to valid range) and URL parsing
            on initialization. See the Example tab for the complete store implementation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Custom Hooks</h4>
          <p>
            Three hooks encapsulate different concerns:
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <code>usePagination</code> — Main hook combining store access, page range
              computation, and navigation actions (goToPage, nextPage, prevPage, goToFirst,
              goToLast, changePageSize).
            </li>
            <li>
              <code>useUrlPaginationState</code> — Reads initial page/pageSize from URL
              query params on mount, syncs store changes back to URL via{" "}
              <code>pushState</code> / <code>replaceState</code>, and listens to{" "}
              <code>popstate</code> for browser back/forward navigation.
            </li>
            <li>
              <code>useClientPagination</code> — Takes a full data array and returns the
              sliced subset for the current page, along with computed total items.
            </li>
            <li>
              <code>useServerPagination</code> — Triggers an API fetch on page/pageSize
              change, manages loading and error states, and handles request cancellation
              for rapid page changes via <code>AbortController</code>.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. UI Components</h4>
          <p>
            Four components compose the visual layer:
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <code>Pagination</code> — Main container assembling page buttons, navigation
              controls, page size selector, and range display. Uses <code>usePagination</code>{" "}
              hook for state and actions.
            </li>
            <li>
              <code>PageButton</code> — Individual page number or ellipsis button. Handles
              active state styling, disabled state, and keyboard events.
            </li>
            <li>
              <code>PageSizeSelector</code> — Dropdown for selecting items per page.
              Triggers store action and page reset.
            </li>
            <li>
              <code>PaginationRange</code> — Displays the <code>Showing X-Y of Z</code>{" "}
              text, computed from current page, page size, and total items.
            </li>
          </ul>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Management</h3>
        <p>
          The Zustand store is the single source of truth for pagination state. Its shape
          is minimal:
        </p>
        <ul className="mt-2 space-y-1 text-sm font-mono">
          <li>
            <code>currentPage: number</code> — 1-indexed current page
          </li>
          <li>
            <code>pageSize: number</code> — items per page (10, 25, 50, 100)
          </li>
          <li>
            <code>totalItems: number</code> — total item count from API or data length
          </li>
          <li>
            <code>syncToUrl: boolean</code> — whether to sync changes to URL
          </li>
        </ul>
        <p className="mt-3">
          Actions include <code>goToPage(page)</code>, <code>nextPage()</code>,{" "}
          <code>prevPage()</code>, <code>goToFirst()</code>, <code>goToLast()</code>,{" "}
          <code>changePageSize(size)</code>, <code>setTotalItems(count)</code>, and{" "}
          <code>initFromUrl()</code>. Each navigation action clamps the page to the valid
          range before updating state.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Ellipsis Algorithm</h3>
        <p>
          The page range calculator is the most critical algorithm. Given{" "}
          <code>currentPage = 12</code>, <code>totalPages = 30</code>, and{" "}
          <code>siblingCount = 2</code>, the output should be{" "}
          <code>[1, ellipsis, 10, 11, 12, 13, 14, ellipsis, 30]</code>. The algorithm
          works as follows:
        </p>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            Compute the left sibling boundary: <code>leftBound = max(currentPage - siblingCount, 1)</code>.
          </li>
          <li>
            Compute the right sibling boundary: <code>rightBound = min(currentPage + siblingCount, totalPages)</code>.
          </li>
          <li>
            If <code>leftBound &gt; 2</code>, insert ellipsis after page 1. If{" "}
            <code>leftBound === 2</code>, show page 2 without ellipsis.
          </li>
          <li>
            If <code>rightBound &lt; totalPages - 1</code>, insert ellipsis before the
            last page. If <code>rightBound === totalPages - 1</code>, show the second-to-last
            page without ellipsis.
          </li>
          <li>
            Always include page 1 and the last page.
          </li>
        </ol>
        <p>
          The output is an array of <code>PageItem</code> objects, each with a{" "}
          <code>type</code> field (<code>page</code> or <code>ellipsis</code>) and a{" "}
          <code>value</code> field (the page number, or null for ellipsis).
        </p>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/pagination-component-architecture.svg"
          alt="Pagination component architecture showing state management, page range computation, and UI rendering flow"
          caption="Component Interaction Flow"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            App initializes. <code>useUrlPaginationState</code> reads{" "}
            <code>?page=3&amp;pageSize=25</code> from URL, calls store{" "}
            <code>initFromUrl()</code>.
          </li>
          <li>
            Store sets <code>currentPage = 3</code>, <code>pageSize = 25</code>. If
            server-side mode, <code>useServerPagination</code> triggers API fetch.
          </li>
          <li>
            <code>Pagination</code> component renders, calls <code>usePagination</code>{" "}
            which subscribes to store and computes page range via calculator.
          </li>
          <li>
            User clicks page 5 button. <code>goToPage(5)</code> action fires.
          </li>
          <li>
            Store updates <code>currentPage = 5</code>, syncs to URL via{" "}
            <code>pushState</code>.
          </li>
          <li>
            If server-side: <code>useServerPagination</code> detects page change, fires
            API request with <code>page=5&amp;pageSize=25</code>.
          </li>
          <li>
            If client-side: <code>useClientPagination</code> slices data array for items
            101-125.
          </li>
          <li>
            <code>Pagination</code> re-renders with updated page range (now centered on
            page 5).
          </li>
        </ol>
      </section>

      {/* Section 5: Data Flow / Execution Flow */}
      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          The execution flow follows a unidirectional data flow pattern. URL query
          parameters seed the initial state, the Zustand store holds the current state,
          the page range calculator computes the display structure, and the UI components
          render based on computed values. User interactions flow back into store actions,
          which update state, sync to URL, and trigger either client-side slicing or
          server-side fetching.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Server-Side Request Lifecycle</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            User clicks page 8. <code>goToPage(8)</code> updates store.
          </li>
          <li>
            <code>useServerPagination</code> effect fires with new page value.
          </li>
          <li>
            Previous <code>AbortController</code> is aborted (if a request was in-flight).
          </li>
          <li>
            New <code>AbortController</code> is created. API fetch begins with{" "}
            <code>signal</code> attached.
          </li>
          <li>
            Loading state is set to <code>true</code>. Data table shows skeleton/spinner.
          </li>
          <li>
            Response arrives. Loading set to <code>false</code>, data updated, total items
            set from response metadata.
          </li>
          <li>
            If response indicates that page 8 exceeds total pages (e.g., items were deleted),
            store auto-corrects to last valid page and re-triggers fetch.
          </li>
        </ol>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li>
            <strong>Beyond-last-page recovery:</strong> When the store receives{" "}
            <code>page=50</code> but <code>totalPages = 20</code>, the <code>goToPage</code>{" "}
            action clamps to <code>min(50, 20) = 20</code>. The URL is then updated to{" "}
            <code>?page=20</code> via <code>replaceState</code> (not <code>pushState</code>{" "}
            to avoid adding a spurious history entry).
          </li>
          <li>
            <strong>Invalid URL params:</strong> During <code>initFromUrl</code>,{" "}
            <code>parseInt</code> of non-numeric values returns <code>NaN</code>, which
            is detected and defaulted to page 1 and pageSize 25.
          </li>
          <li>
            <strong>Rapid page changes:</strong> The <code>AbortController</code> pattern
            ensures that if the user clicks pages 3, 4, 5 in quick succession, only the
            request for page 5 resolves. Earlier requests are aborted and their responses
            discarded.
          </li>
          <li>
            <strong>SSR hydration:</strong> During server-side rendering, the initial
            state is computed from the URL&apos;s query parameters (available in Next.js
            via the searchParams prop). The client hydrates with the same state, avoiding
            hydration mismatches.
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
          <h3 className="mb-3 text-lg font-semibold">Switch to the Example Tab</h3>
          <p>
            The complete, production-ready implementation consists of 13 files: TypeScript
            interfaces, page range calculator, Zustand store with URL sync, three custom
            hooks (main pagination, URL state, client-side, server-side), four UI components
            (main pagination, page button, page size selector, range display), and a full
            EXPLANATION.md walkthrough. Click the <strong>Example</strong> toggle at the
            top of the article to view all source files.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Type Definitions (pagination-types.ts)</h3>
        <p>
          Defines <code>PaginationState</code> with currentPage, pageSize, totalItems, and
          syncToUrl flag. <code>PaginationConfig</code> holds siblingCount, pageSizeOptions
          array, showFirstLast boolean, and showRangeText boolean. <code>PageRange</code>{" "}
          contains the computed items array (union of PageItem and EllipsisItem), plus
          startItem, endItem, and totalItems for the range display. The{" "}
          <code>PageItem</code> discriminated union has type <code>page</code> with a
          numeric value, or type <code>ellipsis</code> with a null value.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Page Range Calculator (page-range-calculator.ts)</h3>
        <p>
          Pure function with no side effects. Takes currentPage, totalPages, and
          siblingCount. Returns a <code>PageRange</code> object. The algorithm always
          includes page 1 and the last page, computes a sliding window around the current
          page, and inserts ellipsis markers where gaps exceed 1 page. Edge cases handled:
          totalPages &lt;= 7 (no ellipsis needed), currentPage at boundaries, and
          totalPages = 0 or 1.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Zustand Store (pagination-store.ts)</h3>
        <p>
          Manages pagination state with boundary validation on every navigation action.
          The <code>goToPage</code> action clamps to <code>[1, totalPages]</code>. The{" "}
          <code>changePageSize</code> action resets currentPage to 1 (since the page
          boundaries shift). URL sync is optional and controlled by the <code>syncToUrl</code>{" "}
          flag. The <code>initFromUrl</code> action parses query parameters, validates
          them, and sets state.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: Hooks</h3>
        <p>
          <code>usePagination</code> is the primary hook, combining store access with page
          range computation. It returns currentPage, pageSize, totalPages, pageRange,
          navigation actions, and a computed <code>hasNext</code> / <code>hasPrev</code>{" "}
          flag. <code>useUrlPaginationState</code> handles the bidirectional URL sync:
          reading on mount, writing on change, and listening to <code>popstate</code>.{" "}
          <code>useClientPagination</code> accepts a data array and returns the sliced
          subset plus pagination metadata. <code>useServerPagination</code> accepts a
          fetch function and manages the request lifecycle with AbortController.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: Pagination Component (pagination.tsx)</h3>
        <p>
          Assembles the full pagination UI. Uses <code>usePagination</code> for state and
          actions. Renders a flex container with the range display on the left, page
          buttons in the center, and page size selector on the right. On small screens
          (detected via a responsive CSS class or media query), hides the page number
          buttons and shows only prev/next with the range text. Uses{" "}
          <code>role=&quot;navigation&quot;</code> and <code>aria-label</code> on the
          container.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6: Page Button (page-button.tsx)</h3>
        <p>
          Renders either a clickable page number, an ellipsis (non-interactive), or a
          navigation arrow button. Uses <code>aria-current=&quot;page&quot;</code> on the
          active page button. Disabled state applies <code>aria-disabled=&quot;true&quot;</code>{" "}
          and visual dimming. Keyboard events handle Enter and Space for activation. The
          button uses Tailwind classes for active/inactive/hover/disabled states.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 7: Page Size Selector (page-size-selector.tsx)</h3>
        <p>
          Renders a native <code>&lt;select&gt;</code> element with options for each page
          size (10, 25, 50, 100). On change, calls the store&apos;s <code>changePageSize</code>{" "}
          action. The select element is styled with Tailwind and includes an{" "}
          <code>aria-label</code> for accessibility.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 8: Pagination Range (pagination-range.tsx)</h3>
        <p>
          Simple component computing the <code>Showing X-Y of Z</code> text. Calculates{" "}
          <code>startItem = (currentPage - 1) * pageSize + 1</code> and{" "}
          <code>endItem = min(currentPage * pageSize, totalItems)</code>. Returns null if
          totalItems is 0. Renders as a <code>&lt;span&gt;</code> with appropriate
          screen-reader-only text for accessibility.
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
                <td className="p-2">Page range computation</td>
                <td className="p-2">O(p) — p = visible page buttons</td>
                <td className="p-2">O(p) — output array</td>
              </tr>
              <tr>
                <td className="p-2">goToPage</td>
                <td className="p-2">O(1) — clamp + set</td>
                <td className="p-2">O(1)</td>
              </tr>
              <tr>
                <td className="p-2">changePageSize</td>
                <td className="p-2">O(1) — reset page + set size</td>
                <td className="p-2">O(1)</td>
              </tr>
              <tr>
                <td className="p-2">Client-side slice</td>
                <td className="p-2">O(k) — k = pageSize</td>
                <td className="p-2">O(k) — sliced array</td>
              </tr>
              <tr>
                <td className="p-2">Server-side fetch</td>
                <td className="p-2">O(network) — depends on latency</td>
                <td className="p-2">O(k) — response data</td>
              </tr>
              <tr>
                <td className="p-2">URL sync</td>
                <td className="p-2">O(1) — pushState/replaceState</td>
                <td className="p-2">O(1)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Where <code>p</code> is the number of visible page buttons (typically 7-9)
          and <code>k</code> is the page size (10-100). The page range computation is
          independent of total page count — whether there are 20 or 20,000 pages, the
          output array size remains constant.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li>
            <strong>Client-side with large datasets:</strong> Loading 100,000 items into
            memory for client-side pagination is impractical. The array slice itself is
            fast, but the initial data load and memory footprint are the bottlenecks.
            Mitigation: switch to server-side pagination when total items exceed a
            threshold (e.g., 5,000).
          </li>
          <li>
            <strong>Server-side rapid page changes:</strong> Without request cancellation,
            navigating pages quickly causes a thundering herd of API requests, with
            responses arriving out of order. Mitigation: <code>AbortController</code>{" "}
            cancels in-flight requests on page change.
          </li>
          <li>
            <strong>URL sync frequency:</strong> Every page change triggers{" "}
            <code>pushState</code>, which is cheap but can accumulate history entries
            during rapid navigation. Mitigation: use <code>replaceState</code> for rapid
            sequential changes, or debounce URL updates.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li>
            <strong>Memoized page range:</strong> The page range calculator output is
            memoized via <code>useMemo</code> with dependencies on currentPage, totalPages,
            and siblingCount. This prevents recomputation on unrelated state changes.
          </li>
          <li>
            <strong>Selector-based subscriptions:</strong> Components subscribe only to
            the specific store fields they need (e.g., PageButton subscribes only to
            currentPage for active state detection), minimizing re-render scope.
          </li>
          <li>
            <strong>AbortController for fetch:</strong> Each server-side pagination request
            is tied to an AbortController. On page change, the previous controller is
            aborted, preventing stale responses from overwriting current data.
          </li>
          <li>
            <strong>Virtual scrolling for page size 100:</strong> When pageSize is 100,
            rendering 100 rows can cause jank. Pair pagination with virtual scrolling
            (windowing) for large page sizes.
          </li>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">URL Parameter Validation</h3>
        <p>
          URL query parameters are user-controllable and must be treated as untrusted
          input. The <code>initFromUrl</code> action must validate and sanitize all
          parameters: parse as integers, clamp to valid ranges, and default to safe
          values on failure. A malicious URL like <code>?page=-1&amp;pageSize=999999</code>{" "}
          must not cause errors or excessive data loads.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Server-Side Pagination Limits</h3>
        <p>
          The server must enforce maximum page size limits regardless of client requests.
          If a client requests <code>pageSize=10000</code>, the server should cap it to
          the configured maximum (e.g., 100) and return the capped value in the response
          metadata. This prevents denial-of-service via oversized response payloads.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Keyboard Navigation</h4>
          <ul className="space-y-2">
            <li>
              Page buttons are native <code>&lt;button&gt;</code> elements, automatically
              keyboard-focusable and activatable with Enter and Space.
            </li>
            <li>
              Left/Right arrow keys on the focused page button navigate to previous/next
              page. This is implemented via <code>onKeyDown</code> handler on the
              pagination container.
            </li>
            <li>
              Tab order flows logically: range display, first page, previous page, page
              numbers, next page, last page, page size selector.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Screen Reader Support</h4>
          <ul className="space-y-2">
            <li>
              The pagination container has <code>role=&quot;navigation&quot;</code> and{" "}
              <code>aria-label=&quot;Pagination&quot;</code>.
            </li>
            <li>
              Each page button has <code>aria-label=&quot;Go to page 5&quot;</code>.
            </li>
            <li>
              The active page button has <code>aria-current=&quot;page&quot;</code>, which
              screen readers announce as &quot;current page.&quot;
            </li>
            <li>
              Ellipsis items have <code>aria-hidden=&quot;true&quot;</code> and are not
              focusable.
            </li>
            <li>
              Disabled buttons have <code>aria-disabled=&quot;true&quot;</code>.
            </li>
            <li>
              The range display includes a screen-reader-only span with the full text
              (e.g., <code>&quot;Showing items 26 to 50 of 500&quot;</code>).
            </li>
          </ul>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Abuse Prevention</h3>
        <ul className="space-y-2">
          <li>
            <strong>Rate limiting on API:</strong> Server-side pagination endpoints should
            implement rate limiting per user/session to prevent rapid automated scraping
            via programmatic page navigation.
          </li>
          <li>
            <strong>Cursor-based pagination alternative:</strong> For datasets where
            sequential page enumeration is a security concern (e.g., user IDs that can be
            enumerated), consider cursor-based pagination instead of offset-based. Cursors
            are opaque tokens that do not reveal dataset size or allow enumeration.
          </li>
        </ul>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Page range calculator:</strong> Test all scenarios: totalPages &lt;= 7
            (no ellipsis), currentPage near start, currentPage near end, currentPage in
            middle, totalPages = 1, totalPages = 0. Verify the exact output array matches
            expected page numbers and ellipsis positions.
          </li>
          <li>
            <strong>Store actions:</strong> Test goToPage clamps to valid range,
            changePageSize resets to page 1, nextPage at last page is a no-op, prevPage
            at first page is a no-op, initFromUrl parses valid params and defaults invalid
            ones.
          </li>
          <li>
            <strong>Client-side slice:</strong> Given a 100-item array with pageSize 25,
            verify page 1 returns items 0-24, page 2 returns items 25-49, page 4 returns
            items 75-99.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Full pagination lifecycle:</strong> Render Pagination component, click
            page 3, verify URL updates to <code>?page=3</code>, verify page buttons
            re-render with page 3 active, verify range display updates.
          </li>
          <li>
            <strong>URL sync:</strong> Programmatically set URL to <code>?page=5&amp;pageSize=50</code>,
            reload page, verify component initializes to page 5 with pageSize 50.
          </li>
          <li>
            <strong>Browser back/forward:</strong> Navigate to page 3, then page 5, press
            browser back, verify component returns to page 3 and fetches correct data.
          </li>
          <li>
            <strong>Server-side with AbortController:</strong> Rapidly click pages 2, 3,
            4, 5. Verify only the page 5 request resolves and updates data. Earlier
            requests are aborted.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>
            Empty dataset: component renders nothing or &quot;No results&quot; message.
          </li>
          <li>
            Single page: no page number buttons render, only range display is visible.
          </li>
          <li>
            Beyond-last-page: URL has <code>?page=999</code>, component corrects to last
            page and updates URL via replaceState.
          </li>
          <li>
            Accessibility: run axe-core automated checks, verify aria-current, aria-label,
            role, aria-disabled, and keyboard navigation.
          </li>
          <li>
            Mobile viewport: resize to 375px width, verify page numbers are hidden and
            only prev/next controls are visible.
          </li>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li>
            <strong>Missing ellipsis logic:</strong> Candidates render all page numbers
            in a loop. For 100 pages, this creates an unusable UI. Interviewers expect
            the sliding window + ellipsis algorithm.
          </li>
          <li>
            <strong>0-indexed vs 1-indexed confusion:</strong> Using 0-based page numbers
            internally while the UI displays 1-based numbers leads to off-by-one errors in
            range calculations. Stick to 1-indexed throughout and convert only at the API
            boundary if the API expects 0-based offsets.
          </li>
          <li>
            <strong>Not resetting page on page size change:</strong> When pageSize changes
            from 25 to 100, staying on page 10 means viewing items 901-1000, which may
            not exist. The page must reset to 1.
          </li>
          <li>
            <strong>Ignoring URL state:</strong> Storing page only in component state means
            refreshing the page loses the user&apos;s position, and links cannot be shared.
            Interviewers expect URL synchronization.
          </li>
          <li>
            <strong>No request cancellation:</strong> In server-side mode, rapid page
            changes cause out-of-order responses. Without AbortController, page 3&apos;s
            response might overwrite page 5&apos;s data.
          </li>
          <li>
            <strong>Poor accessibility:</strong> Page buttons without aria-labels, no
            aria-current on the active page, and no keyboard navigation are common
            oversights that indicate inexperience with production UI components.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Client-Side vs Server-Side Pagination</h4>
          <p>
            Client-side pagination is simpler — no API calls, instant navigation, works
            offline. But it requires loading the entire dataset into memory upfront, which
            is impractical for large datasets (10,000+ items). Server-side pagination
            scales to any dataset size but introduces network latency, loading states, and
            request management complexity. The right approach is to support both modes and
            choose based on dataset size: client-side for small, static datasets;
            server-side for large or dynamic ones.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Offset-Based vs Cursor-Based Pagination</h4>
          <p>
            Offset-based pagination (<code>page + pageSize</code> or{" "}
            <code>offset + limit</code>) is intuitive and supports direct page jumping.
            However, it is inefficient for large offsets (the database must scan and skip
            rows) and vulnerable to data drift (items inserted/deleted between requests
            cause duplicates or gaps). Cursor-based pagination uses an opaque token
            pointing to the last item of the previous page. It is efficient (uses indexed
            seek), immune to drift, but does not support jumping to arbitrary pages. For
            most UI tables, offset-based is fine. For infinite scroll or large datasets,
            cursor-based is preferred.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mt-6 mb-3 font-semibold">pushState vs replaceState for URL Sync</h4>
          <p>
            <code>pushState</code> adds a history entry for every page change, meaning
            the browser back button steps through every page the user visited.{" "}
            <code>replaceState</code> updates the URL without adding history. For
            pagination, <code>replaceState</code> is usually preferred — users expect
            back to return to the previous view, not the previous page within the same
            table. However, if pagination represents a significant navigation (e.g.,
            browsing search results where each page is a distinct state),{" "}
            <code>pushState</code> may be appropriate.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle pagination with real-time data updates (e.g., items
              being added/deleted while the user is on page 3)?
            </p>
            <p className="mt-2 text-sm">
              A: Real-time updates create a consistency problem. If an item on page 1 is
              deleted, items shift up, and the user&apos;s page 3 now shows different
              data. Solutions include: (1) snapshot the dataset on initial load and diff
              against it, (2) use cursor-based pagination which is naturally resilient to
              insertions/deletions, or (3) periodically refresh the total count and
              auto-correct the current page if it exceeds the new total. The UX should
              inform the user: &quot;Results have been updated&quot; with an option to
              refresh.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement pagination for a multi-column sortable table?
            </p>
            <p className="mt-2 text-sm">
              A: Add <code>sortBy</code> and <code>sortOrder</code> to the pagination
              state and URL params. When the sort column changes, reset currentPage to 1
              (since the data order changes entirely). The server-side API must accept
              sort parameters and apply them before offset/limit. The client-side
              implementation must sort the full dataset before slicing. The store should
              expose a <code>changeSort(field, order)</code> action that resets the page.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you support infinite scroll as an alternative to page-number
              pagination?
            </p>
            <p className="mt-2 text-sm">
              A: Infinite scroll is a form of cursor-based pagination. Instead of page
              numbers, the component tracks a <code>cursor</code> (the ID or timestamp of
              the last loaded item). When the user scrolls near the bottom, the next batch
              is fetched using the cursor. The pagination component can offer a toggle
              between &quot;Page numbers&quot; and &quot;Infinite scroll&quot; modes. Both
              modes share the same store but use different fetching strategies. The URL
              state would track the cursor instead of page number in infinite scroll mode.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle pagination with filters applied?
            </p>
            <p className="mt-2 text-sm">
              A: Filters change the effective dataset, so they must reset currentPage to 1
              and recalculate totalItems. Filter state should also be reflected in URL
              params (e.g., <code>?page=1&amp;status=active&amp;pageSize=25</code>). When
              filters change, the store resets the page, and the server-side hook triggers
              a new API request with both filter and pagination parameters. The total
              count in the response reflects the filtered dataset size.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does your design handle concurrent React (React 18+)?
            </p>
            <p className="mt-2 text-sm">
              A: The Zustand store is synchronous and external to React&apos;s rendering
              cycle. The pagination component uses <code>useSyncExternalStore</code>{" "}
              (which Zustand uses internally) for consistent subscription behavior with
              concurrent rendering. Page range computation is wrapped in{" "}
              <code>useMemo</code>. API fetches in server-side mode are wrapped in{" "}
              <code>startTransition</code> so that loading state updates do not block
              urgent updates like user input.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle pagination when the dataset is distributed across
              multiple backend services (federated data)?
            </p>
            <p className="mt-2 text-sm">
              A: Federated pagination requires a coordination layer. Each service returns
              its own paginated results with its own total count. An API gateway or BFF
              (Backend for Frontend) aggregates responses, merges and sorts them, then
              presents a unified paginated view to the frontend. The trade-off is increased
              latency (must wait for the slowest service) and potential inconsistency
              (services may have different data freshness). An alternative is to precompute
              a unified index (e.g., in Elasticsearch) that the frontend queries directly.
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
              href="https://www.smashingmagazine.com/2023/02/pagination-ux-patterns/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Smashing Magazine — Pagination UX Patterns and Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://www.nngroup.com/articles/pagination-ux/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — Pagination: Usability Guidelines for Web
            </a>
          </li>
          <li>
            <a
              href="https://zustand.docs.pmnd.rs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Zustand — State Management Library Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/pagination/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WAI-ARIA Pagination Pattern — Accessibility Guidelines
            </a>
          </li>
          <li>
            <a
              href="https://usehooks.com/usePagination/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              useHooks — Custom React Hooks for Pagination
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/History_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — History API (pushState / replaceState) Documentation
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — AbortController for Request Cancellation
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
