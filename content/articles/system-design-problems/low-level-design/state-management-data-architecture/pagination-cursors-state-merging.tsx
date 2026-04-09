"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-pagination-cursors",
  title: "Pagination Cursors & State Merging",
  description:
    "Production-grade pagination state management — cursor-based pagination, offset pagination, merging pages, infinite scroll state, and cache invalidation for paginated data.",
  category: "low-level-design",
  subcategory: "state-management-data-architecture",
  slug: "pagination-cursors-state-merging",
  wordCount: 3400,
  readingTime: 20,
  lastUpdated: "2026-04-08",
  tags: ["lld", "pagination", "cursor-based", "infinite-scroll", "state-merging", "cache-management"],
  relatedTopics: ["client-cache-invalidation", "normalized-state-design"],
};

export default function PaginationCursorsStateMergingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          Applications display paginated data in multiple formats: numbered pages
          (offset pagination), infinite scroll (cursor-based), and &quot;load more&quot;
          buttons. Each format requires different state management — offset
          pagination needs page numbers and total count, cursor-based needs
          opaque cursors and hasNextPage flag, infinite scroll needs merged item
          lists. We need a unified pagination state system that supports all
          formats, merges pages correctly, handles cache invalidation, and
          provides consistent component APIs.
        </p>
        <p><strong>Assumptions:</strong> React 19+, REST/GraphQL APIs, multiple pagination patterns in the same app.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Cursor-Based Pagination:</strong> State stores cursor, hasNextPage, items list. Fetch next page using cursor. Append items to list.</li>
          <li><strong>Offset Pagination:</strong> State stores page number, pageSize, totalCount, totalPages. Jump to any page.</li>
          <li><strong>Page Merging:</strong> New page items merged into existing list. Duplicate items (overlap between pages) deduplicated by ID.</li>
          <li><strong>Cache Invalidation:</strong> Creating/deleting an item invalidates all cached pages (item positions shift). Refetch from page 1.</li>
          <li><strong>Infinite Scroll State:</strong> Continuous merged item list, loading state per page boundary, sentinel detection for auto-fetch.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Item deleted on server — appears on page 2 but already cached on page 1. Next fetch shows gap. Fix: refetch all cached pages on mutation.</li>
          <li>User jumps from page 1 to page 10 — pages 2-9 not cached. Fetch page 10 directly (cursor-based doesn&apos;t support this — must fetch sequentially).</li>
          <li>Infinite scroll: user scrolls to bottom, new page arrives with overlapping items from previous page (server inserted items). Deduplicate by ID.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          Pagination state shape depends on type. Cursor-based stores cursor, items array, hasNextPage flag, and loading state. Offset-based stores page number, page size, total count, and pages by number. Infinite scroll maintains a continuous merged item list with next cursor and loading state. Page fetching appends or replaces items based on type. Cache keyed by query + pagination params. Mutations invalidate the entire pagination cache.
        </p>
      </section>

      <section>
        <h2>System Design</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Modules</h3>
        <p>Six modules:</p>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Pagination State Machine (<code>lib/pagination-state-machine.ts</code>)</h4>
          <p>Manages pagination lifecycle: idle, loading, success, error. Transitions based on fetch results. Prevents concurrent fetches of same page.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Cursor Manager (<code>lib/cursor-manager.ts</code>)</h4>
          <p>Handles cursor-based pagination state. Tracks current cursor, merges new page items, deduplicates by ID. Supports forward-only traversal.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Offset Manager (<code>lib/offset-manager.ts</code>)</h4>
          <p>Handles offset pagination. Stores pages by page number. Supports random access (jump to page N). Calculates totalPages from totalCount.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Item Merger (<code>lib/item-merger.ts</code>)</h4>
          <p>Merges new page items into existing list. Deduplicates by ID. Handles item reordering when server inserts items before cached items.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Cache Manager (<code>lib/pagination-cache.ts</code>)</h4>
          <p>Caches paginated results by query + params. Invalidates on mutations. Supports stale-while-revalidate for cached pages.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. React Integration (<code>hooks/usePagination.ts</code>)</h4>
          <p>Hook that manages pagination state, fetches pages, merges items. Returns paginated items list, loading status, hasNextPage flag, fetchNext function, and goToPage function.</p>
        </div>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/pagination-cursors-state-merging-architecture.svg"
          alt="Pagination state management showing cursor-based, offset-based, and infinite scroll patterns"
          caption="Pagination State Management Architecture"
        />
      </section>

      <section>
        <h2>Data Flow</h2>
        <p>Fetch page → merge items into list → update cursor/page → cache result → notify subscribers. Mutation → invalidate pagination cache → refetch page 1 on next access.</p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-3">
          <li><strong>Cursor-based random access:</strong> Can&apos;t jump to page 10 — must fetch pages 1-9 sequentially. Solution: inform UX — show &quot;load more&quot; instead of page numbers for cursor APIs. Or implement server-side bookmarking (server stores cursor positions for page numbers).</li>
          <li><strong>Item insertion shifts pages:</strong> New item inserted at position 1 — all cached pages now have wrong items. Fix: on any collection mutation, invalidate all cached pages. Refetch from page 1 on next access.</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">📦 Switch to the Example Tab</h3>
          <p>Complete implementation: cursor manager, offset manager, item merger with deduplication, cache manager, and React hook.</p>
        </div>
      </section>

      <section>
        <h2>Performance</h2>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b border-theme"><th className="p-2 text-left">Operation</th><th className="p-2 text-left">Time</th></tr></thead>
            <tbody className="divide-y divide-theme">
              <tr><td className="p-2">Append page items</td><td className="p-2">O(n) — n new items</td></tr>
              <tr><td className="p-2">Deduplicate merge</td><td className="p-2">O(n + m) — n existing, m new</td></tr>
              <tr><td className="p-2">Cache lookup</td><td className="p-2">O(1) — Map by query key</td></tr>
              <tr><td className="p-2">Cache invalidation</td><td className="p-2">O(p) — p cached pages cleared</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Security & Testing</h2>
        <p>Validate pagination responses — items must have IDs, cursor must be non-empty. Malformed pages logged and skipped. Test: cursor-based sequential fetch, offset random access, item deduplication during merge, cache invalidation on mutation, infinite scroll sentinel detection.</p>
      </section>

      <section>
        <h2>Interview Insights</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes</h3>
        <ul className="space-y-3">
          <li><strong>No deduplication:</strong> Infinite scroll loads page 2, some items overlap with page 1 (server inserted). Duplicate items displayed. Fix: deduplicate by ID during merge.</li>
          <li><strong>Not invalidating on mutation:</strong> User deletes item, pagination cache still has it. Item shows in list but server returns 404 on detail. Fix: invalidate pagination cache on collection mutations.</li>
          <li><strong>Storing full pages in state:</strong> Offset pagination stores all fetched pages — memory grows unbounded. Fix: limit cached pages (LRU, max 20 pages), evict oldest.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Follow-up Questions</h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle pagination with real-time updates (new items arriving via WebSocket)?</p>
            <p className="mt-2 text-sm">
              A: New items from WebSocket are prepended to page 1 (newest first).
              This shifts all existing items down — item that was at position 20
              moves to 21, potentially crossing page boundary. Solution: accept
              the shift — update page 1 with new items, mark other cached pages
              as stale. When user scrolls to page 2, refetch it (will get shifted
              items). Show a &quot;X new items&quot; banner at top — clicking it
              refreshes page 1 and resets pagination.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li><a href="https://graphql.org/learn/pagination/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">GraphQL — Pagination (Cursors)</a></li>
          <li><a href="https://tanstack.com/query/latest/docs/react/guides/infinite-queries" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">TanStack Query — Infinite Queries</a></li>
          <li><a href="https://css-tricks.com/pagination-vs-infinite-scroll/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">CSS-Tricks — Pagination vs Infinite Scroll</a></li>
          <li><a href="https://usehooks.com/useIntersectionObserver/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Intersection Observer for Infinite Scroll</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
