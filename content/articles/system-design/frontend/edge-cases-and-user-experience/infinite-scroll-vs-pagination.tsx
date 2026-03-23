"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-infinite-scroll-vs-pagination-extensive",
  title: "Infinite Scroll vs Pagination",
  description:
    "Staff-level deep dive into list navigation patterns, cursor vs offset pagination, virtualization strategies, scroll position preservation, SEO implications, and systematic approaches to choosing between infinite scroll and pagination.",
  category: "frontend",
  subcategory: "edge-cases-and-user-experience",
  slug: "infinite-scroll-vs-pagination",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-03-23",
  tags: [
    "frontend",
    "pagination",
    "infinite scroll",
    "virtualization",
    "UX patterns",
    "performance",
  ],
  relatedTopics: [
    "loading-states",
    "virtualization-windowing",
    "performance-optimization",
    "accessibility",
  ],
};

export default function InfiniteScrollVsPaginationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Infinite scroll and pagination</strong> are the two dominant patterns for navigating large datasets in web applications, each making fundamentally different assumptions about how users consume content. Pagination divides content into discrete numbered pages with explicit navigation controls, establishing clear spatial boundaries and giving users a sense of position within the dataset. Infinite scroll loads additional content automatically as the user reaches the end of the visible list, creating a seamless, uninterrupted browsing experience that prioritizes discovery and casual exploration. The choice between them is not merely cosmetic — it affects performance, accessibility, SEO, state management, backend API design, and the core user experience model.
        </p>
        <p>
          The user experience implications of this choice run deep. Pagination supports goal-oriented behavior — users who need to find a specific item, return to a previously viewed position, or share a link to a specific set of results. The URL typically includes a page parameter, making any page directly addressable, bookmarkable, and shareable. The fixed page size provides a natural rhythm and a sense of progress through the dataset. Infinite scroll supports exploratory behavior — users browsing a social feed, scanning product catalogs, or consuming media without a specific target. The continuous flow reduces interaction friction (no click, wait, page refresh cycle) and leverages the user&apos;s existing scroll behavior, creating lower cognitive overhead for content discovery.
        </p>
        <p>
          At the staff and principal engineer level, this decision involves evaluating trade-offs across multiple dimensions simultaneously. Performance considerations include memory management (infinite scroll can accumulate thousands of DOM nodes), virtualization requirements (rendering only visible items), and backend pagination strategy (offset versus cursor-based). Accessibility considerations include keyboard navigation support, screen reader compatibility with dynamically loaded content, and focus management across page transitions. SEO considerations include whether search engines can discover and index all content, whether individual items need addressable URLs, and how server-side rendering interacts with the chosen pattern. The architectural decision must also account for cross-platform consistency — the same API should support both web and mobile clients, which may use different navigation patterns for the same content.
        </p>
        <p>
          Hybrid approaches have emerged that combine elements of both patterns. The &ldquo;Load More&rdquo; button pattern gives users manual control over loading additional content without requiring full page navigation, offering a middle ground between the continuity of infinite scroll and the control of pagination. Virtual pagination with scroll-triggered loading provides the visual continuity of infinite scroll with URL-addressable position tracking. Cursor-based pagination on the backend supports both patterns through the same API. Understanding when to apply each pattern — and when to hybridize — is the mark of senior architectural judgment.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Offset Pagination:</strong> The traditional pagination approach where the API accepts a page number and page size (or offset and limit), returning items starting from the calculated position. Simple to implement and understand, but problematic for large datasets because calculating offsets requires the database to count and skip rows, degrading performance at high page numbers. Also vulnerable to shifting data — if items are added or removed between page requests, items can be duplicated or skipped.
          </li>
          <li>
            <strong>Cursor-Based Pagination:</strong> An alternative where the API returns a cursor (typically an encoded identifier of the last item) with each response, and the next request uses this cursor to fetch the next batch. More performant than offset pagination for large datasets because the database seeks directly to the cursor position rather than counting rows. Also stable under data mutations — items are not duplicated or skipped when the dataset changes between requests. The trade-off is that cursor pagination does not support random page access (jumping directly to page 50).
          </li>
          <li>
            <strong>Virtualization (Windowing):</strong> A rendering optimization that only creates DOM nodes for items currently visible in the viewport, plus a small buffer above and below. As the user scrolls, items leaving the viewport are unmounted and recycled for items entering the viewport. Essential for infinite scroll implementations that accumulate thousands of items, preventing memory exhaustion and rendering performance degradation. Libraries like react-window and react-virtuoso implement this pattern.
          </li>
          <li>
            <strong>Intersection Observer:</strong> A browser API that efficiently detects when an element enters or exits the viewport, used to trigger infinite scroll loading when a sentinel element near the bottom of the list becomes visible. More performant than scroll event listeners because it operates off the main thread and does not require manual debouncing. The sentinel element is placed a configurable distance above the actual bottom to prefetch the next batch before the user reaches the end, creating a seamless loading experience.
          </li>
          <li>
            <strong>Scroll Position Restoration:</strong> The challenge of returning users to their previous scroll position after navigating away and returning. Pagination handles this naturally through URL parameters — returning to page 3 reloads page 3. Infinite scroll makes this significantly harder because the user&apos;s position may have been scroll item 847, which requires reloading and rendering all 847 items (or virtualizing them) to restore the exact scroll position. Solutions include storing scroll position in session state, using history API state, or implementing reverse loading from the restored position.
          </li>
          <li>
            <strong>Content Reachability:</strong> The degree to which footer content, navigation elements, or links positioned below the content list are accessible to users. Infinite scroll can make footer content effectively unreachable because new content continuously pushes the footer further down. Pagination naturally exposes footers between pages. This consideration often surprises teams that add infinite scroll without evaluating what exists below their content list.
          </li>
          <li>
            <strong>Load More Pattern:</strong> A hybrid approach that initially shows a fixed page of results with a &ldquo;Load More&rdquo; or &ldquo;Show More&rdquo; button at the bottom. Clicking the button appends the next batch of results without a full page transition. This pattern preserves user control (no automatic loading), works well with URL-based state management, and avoids the footer reachability problem of infinite scroll. It is increasingly used as a pragmatic middle ground.
          </li>
          <li>
            <strong>Bidirectional Scrolling:</strong> A variant of infinite scroll that loads content in both directions from a starting position — loading older content as the user scrolls down and newer content as they scroll up. Essential for chat applications and activity feeds where the user starts at the most recent item and may want to browse in either direction. Bidirectional scrolling adds significant complexity to the loading logic, scroll position management, and virtualization strategy.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The first diagram illustrates the decision framework for choosing between infinite scroll, pagination, and hybrid approaches based on content type, user intent, and technical constraints. The decision tree evaluates several factors: Is the content feed-like (social posts, news) or catalog-like (products, search results)? Does the user need to return to specific positions? Must the content be SEO-indexed? Are there footer elements that must remain reachable? Does the dataset exceed what memory can handle without virtualization? Each path through the decision tree leads to a recommended pattern with its required supporting infrastructure.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/edge-cases-and-user-experience/infinite-scroll-vs-pagination-diagram-1.svg"
          alt="Decision framework for choosing between infinite scroll, pagination, and hybrid approaches based on content type and constraints"
          width={900}
          height={500}
        />
        <p>
          The second diagram shows the data flow architecture for infinite scroll with virtualization. The Intersection Observer monitors a sentinel element positioned near the bottom of the visible list. When the sentinel enters the viewport, it triggers a fetch for the next page using a cursor from the previous response. The fetched items are appended to the data store. The virtualization layer calculates which items fall within the viewport based on scroll position and item heights, rendering only those items plus a buffer. As the user scrolls, the virtualizer recycles DOM nodes — removing elements that leave the buffer zone and creating elements for those entering it. Scroll position is tracked in a separate state store for restoration purposes. This architecture enables smooth scrolling through tens of thousands of items while maintaining constant memory usage proportional to the visible item count rather than the total item count.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/edge-cases-and-user-experience/infinite-scroll-vs-pagination-diagram-2.svg"
          alt="Infinite scroll data flow with Intersection Observer, cursor pagination, virtualization layer, and scroll position tracking"
          width={900}
          height={500}
        />
        <p>
          The third diagram compares the network request patterns and user experience timelines of pagination, infinite scroll, and the Load More pattern. With pagination, each page transition involves a full request-response cycle with a loading state between pages — the user sees content, clicks next, sees loading, sees content. With infinite scroll, prefetching begins before the user reaches the end, creating overlap between browsing and loading — the user scrolls continuously with occasional brief loading indicators as new batches append. With Load More, the user sees content, explicitly requests more, sees a localized loading indicator at the bottom, and sees appended content. The diagram shows how each pattern distributes loading latency differently, affecting perceived performance and user flow.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/edge-cases-and-user-experience/infinite-scroll-vs-pagination-diagram-3.svg"
          alt="Network request patterns and UX timelines comparing pagination, infinite scroll, and Load More approaches"
          width={900}
          height={500}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="px-4 py-2 text-left">Aspect</th>
              <th className="px-4 py-2 text-left">Advantages</th>
              <th className="px-4 py-2 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-theme">
              <td className="px-4 py-2 font-medium">Infinite Scroll</td>
              <td className="px-4 py-2">Seamless browsing experience, lower interaction friction, higher content engagement for exploratory tasks, leverages natural scroll behavior, excellent for social feeds and media galleries</td>
              <td className="px-4 py-2">Memory accumulation without virtualization, inaccessible footers, poor screen reader experience, difficult scroll position restoration, no URL addressability for positions, can feel overwhelming with no clear end</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="px-4 py-2 font-medium">Traditional Pagination</td>
              <td className="px-4 py-2">URL-addressable pages, excellent SEO, predictable memory usage, accessible to screen readers, footer content always reachable, clear sense of dataset size and position</td>
              <td className="px-4 py-2">Full page transition interrupts flow, higher interaction cost per page, users may not click beyond page one, slower perceived performance due to page transitions</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="px-4 py-2 font-medium">Load More Button</td>
              <td className="px-4 py-2">User controls loading pace, footer remains reachable, simpler than infinite scroll to implement, can be combined with URL state, reduces accidental data consumption on mobile</td>
              <td className="px-4 py-2">Still accumulates DOM nodes without virtualization, requires explicit user action for each batch, button can feel repetitive over many loads, not as smooth as infinite scroll</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="px-4 py-2 font-medium">Cursor Pagination (Backend)</td>
              <td className="px-4 py-2">Consistent performance regardless of dataset size, stable under concurrent mutations, efficient database queries using index seeks, works well with real-time data</td>
              <td className="px-4 py-2">Cannot jump to arbitrary pages, total count may be expensive to compute, cursor values can be opaque and harder to debug, backward pagination requires additional cursor management</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="px-4 py-2 font-medium">Offset Pagination (Backend)</td>
              <td className="px-4 py-2">Simple to implement, supports random page access, total count easily available, intuitive page number mapping, widely supported by ORMs and databases</td>
              <td className="px-4 py-2">Performance degrades at high offsets, data shifting causes duplicates or gaps, expensive COUNT queries for total pages, inconsistent results under concurrent writes</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <li>
            <strong>Choose the pattern based on user intent, not aesthetic preference.</strong> Infinite scroll suits exploratory browsing (social feeds, image galleries, news streams) where users do not have a specific target and benefit from low-friction discovery. Pagination suits task-oriented navigation (search results, admin tables, documentation) where users need to find specific items, compare across pages, or return to known positions. Evaluate your primary use case and user research rather than defaulting to whatever feels more modern.
          </li>
          <li>
            <strong>Implement virtualization for infinite scroll beyond a few hundred items.</strong> Without virtualization, infinite scroll creates a proportional relationship between scroll depth and DOM node count, eventually causing memory pressure, layout thrashing, and unresponsive scrolling. Virtualization breaks this relationship by maintaining a constant number of DOM nodes regardless of dataset size. The implementation complexity is significant — you need accurate height estimation, scroll position tracking, and recycling logic — but libraries like react-virtuoso and tanstack-virtual handle the heavy lifting.
          </li>
          <li>
            <strong>Use cursor-based pagination on the backend for infinite scroll.</strong> Cursor pagination provides stable, performant traversal through datasets of any size, while offset pagination degrades at high offsets and produces inconsistent results when data changes between requests. The cursor (typically the last item&apos;s sort key or encoded ID) allows the database to seek directly to the next batch without counting preceding rows.
          </li>
          <li>
            <strong>Preserve scroll position across navigation.</strong> When users navigate to a detail page and return to the list, they expect to resume where they left off. For pagination, include page and scroll offset in the URL. For infinite scroll, store the item index and scroll position in the session state or history API state, and restore it when the user returns. This is especially critical for e-commerce and search flows where users frequently navigate between list and detail views.
          </li>
          <li>
            <strong>Provide a progress indicator for infinite scroll.</strong> Users in infinite scroll have no sense of how much content exists or how far they have scrolled. Show an approximate item count or position indicator (e.g., &ldquo;Showing 50 of approximately 2,400 results&rdquo;) to prevent the feeling of scrolling through an endless void. This context helps users decide whether to continue scrolling, refine their search, or switch to a different navigation strategy.
          </li>
          <li>
            <strong>Ensure footer and auxiliary content remain reachable.</strong> If your page has footer navigation, legal links, or other important content below the list, infinite scroll will push that content perpetually out of reach. Either move essential footer content to a fixed sidebar or header, implement a finite scroll with a clear end point, or use the Load More pattern that preserves footer accessibility between loads.
          </li>
          <li>
            <strong>Support keyboard and screen reader navigation for both patterns.</strong> Pagination links must be keyboard-focusable with clear current-page indication via <code>aria-current=&quot;page&quot;</code>. Infinite scroll must announce when new content loads using ARIA live regions, manage focus so keyboard users can navigate newly loaded items, and provide a mechanism to pause automatic loading so screen reader users are not overwhelmed by continuously changing content.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Using scroll event listeners instead of Intersection Observer.</strong> Scroll event listeners fire on every scroll frame and require manual debouncing, creating performance overhead that is entirely unnecessary. The Intersection Observer API was specifically designed for detecting element visibility and operates asynchronously off the main thread. Using scroll listeners for infinite scroll loading triggers is a legacy pattern that should be avoided in all modern implementations.
          </li>
          <li>
            <strong>Loading duplicate items when data changes between fetches.</strong> With offset pagination, if a new item is inserted at the beginning of the dataset between two page fetches, the second fetch will include the last item from the first fetch again because all offsets have shifted by one. Users see duplicate items in their list, which feels broken. Cursor-based pagination avoids this entirely — the cursor points to a specific item, and the next batch starts after that item regardless of insertions elsewhere.
          </li>
          <li>
            <strong>Infinite scroll without any end condition.</strong> Every infinite scroll implementation must have a termination condition — when the API indicates there are no more results, the scroll must stop loading and show an &ldquo;end of results&rdquo; message. Without this, the loading sentinel fires repeatedly at the bottom, making unnecessary API calls and potentially showing error states when empty responses return. Additionally, showing a clear end message gives users closure and may prompt them to refine their search.
          </li>
          <li>
            <strong>Ignoring mobile data consumption with aggressive prefetching.</strong> Infinite scroll that aggressively prefetches pages can consume significant mobile data without the user&apos;s conscious decision. Unlike pagination where each page load is a deliberate action, infinite scroll loads data automatically as the user scrolls. On mobile connections, consider the Load More pattern or infinite scroll with more conservative prefetch distances so that users on metered connections are not surprised by data consumption.
          </li>
          <li>
            <strong>Not handling the back button and history correctly.</strong> When a user scrolls deep into an infinite list, clicks an item, and presses the back button, they expect to return to their scroll position. Without explicit scroll position management through the History API or session storage, the browser will return to the top of the page with only the first batch loaded, forcing the user to re-scroll through potentially hundreds of items. This is one of the most common usability complaints with infinite scroll implementations.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          <strong>Twitter/X</strong> uses infinite scroll for the home timeline feed, where users browse an unbounded stream of tweets without a specific target in mind. The implementation uses cursor-based pagination with the Twitter API returning a cursor token for the next batch. Virtualization keeps memory usage constant as users scroll through hundreds of tweets. When users navigate to a tweet detail and return, the timeline restores their scroll position from cached state. However, Twitter also uses pagination for search results where users need to compare across result sets and may want to share a link to specific results.
        </p>
        <p>
          <strong>Google Search</strong> famously uses traditional pagination with numbered pages, despite having the engineering capability to implement infinite scroll. This is a deliberate UX decision — search is task-oriented, users need to compare results across pages, specific result positions are meaningful (page one versus page three), and URLs with page parameters are essential for sharing and bookmarking. Google experimented with infinite scroll in mobile results but reverted to pagination, finding that numbered pages better served the core search use case of finding specific information efficiently.
        </p>
        <p>
          <strong>Instagram</strong> uses infinite scroll for its main feed and explore page, optimized for the discovery-oriented browsing behavior of visual content. Their implementation includes aggressive image prefetching, virtualization for long sessions, and a feed position restoration system that uses local cache to reconstruct the user&apos;s position after app switches. Instagram&apos;s infinite scroll is particularly noteworthy for its handling of mixed media — images, videos, carousels, and ads all have different heights, requiring dynamic height measurement and variable-height virtualization.
        </p>
        <p>
          <strong>Amazon</strong> uses traditional pagination for product search results, recognizing that shopping is goal-oriented — users need to compare products, return to specific result pages, share links to search results, and understand their position in the product catalog. The pagination includes total result count, sort options that persist across pages, and stable URLs with page parameters. Amazon does use infinite scroll selectively for product reviews, where users browse exploratory content within a single product context and are less likely to need position-specific URLs.
        </p>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://www.nngroup.com/articles/infinite-scrolling-tips/" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              Nielsen Norman Group — Infinite Scrolling: When to Use It and When to Avoid It
            </a>
          </li>
          <li>
            <a href="https://web.dev/articles/virtualize-long-lists-react-window" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              web.dev — Virtualize Large Lists with react-window
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              MDN — Intersection Observer API
            </a>
          </li>
          <li>
            <a href="https://relay.dev/docs/guides/graphql-server-specification/#connections" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              Relay Documentation — Cursor-Based Connection Specification
            </a>
          </li>
          <li>
            <a href="https://www.smashingmagazine.com/2016/03/pagination-infinite-scrolling-load-more-buttons/" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              Smashing Magazine — Pagination, Infinite Scroll, or Load More Buttons
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>

        <div className="rounded-lg border border-theme bg-panel-soft p-4 mb-4">
          <p className="font-medium">
            Q: How would you decide between infinite scroll and pagination for a
            new feature?
          </p>
          <p className="mt-2">
            A: I would evaluate four primary factors. First, user intent — is the behavior exploratory (browsing a feed, scanning images) or goal-oriented (searching for a specific item, comparing options)? Exploratory behavior benefits from infinite scroll&apos;s low friction; goal-oriented behavior benefits from pagination&apos;s position awareness and URL addressability. Second, content type — homogeneous, consumable content like social posts works well with infinite scroll; heterogeneous, reference-like content like documentation or search results works better with pagination. Third, technical requirements — does the content need SEO indexing (pagination), are there footer elements that must be reachable (pagination or Load More), will the dataset grow unbounded (infinite scroll needs virtualization)? Fourth, platform consistency — if mobile uses infinite scroll, web should ideally use the same pattern to maintain consistent analytics and API contracts. For most cases that fall between the extremes, I would start with the Load More pattern as a pragmatic default and evolve to either direction based on user feedback and analytics.
          </p>
        </div>

        <div className="rounded-lg border border-theme bg-panel-soft p-4 mb-4">
          <p className="font-medium">
            Q: How do you handle scroll position restoration with infinite
            scroll when a user navigates back?
          </p>
          <p className="mt-2">
            A: Scroll position restoration requires preserving three things: the loaded data, the scroll offset, and the scroll container height. When the user navigates away, I store the current scroll position and a reference to the visible item (using its cursor or ID, not its index, to handle data mutations) in the browser&apos;s History API state via <code>history.replaceState</code>. I also keep the loaded data in a client-side cache (React Query cache, Zustand store, or similar). When the user navigates back, I restore the cached data to reconstruct the list, use the stored item reference to calculate the target scroll position, and restore the scroll offset. If the cached data has been evicted, I reload from the API starting from the stored cursor, loading enough pages to reach the user&apos;s position. Virtualization actually simplifies this — since only visible items are rendered, I can reconstruct the virtual scroll position without rendering all preceding items. The key subtlety is timing — scroll restoration must happen after the component has rendered and the scroll container has its correct height, which may require a requestAnimationFrame or layout effect callback.
          </p>
        </div>

        <div className="rounded-lg border border-theme bg-panel-soft p-4 mb-4">
          <p className="font-medium">
            Q: Why might cursor-based pagination be preferred over offset
            pagination, and what are the trade-offs?
          </p>
          <p className="mt-2">
            A: Cursor-based pagination is preferred for three key reasons. Performance — the database can seek directly to the cursor position using an index, avoiding the expensive row counting that offset pagination requires at high offsets. Stability — when items are inserted or deleted between requests, cursor pagination always starts after the last seen item, preventing duplicates and gaps that offset pagination is vulnerable to. Scalability — cursor performance is constant regardless of dataset size, while offset performance degrades linearly. The trade-offs are that cursor pagination does not support random access (jumping to page 50), making it unsuitable for traditional numbered pagination UIs; computing total counts may require a separate query; cursors can be opaque and harder to debug than simple page numbers; and backward pagination requires maintaining a separate cursor or reversing the sort order. For infinite scroll and Load More patterns, cursor pagination is almost always the right choice. For traditional numbered pagination with page links, offset pagination may be more practical despite its scalability limitations.
          </p>
        </div>

        <div className="rounded-lg border border-theme bg-panel-soft p-4 mb-4">
          <p className="font-medium">
            Q: How do you make infinite scroll accessible to keyboard and screen
            reader users?
          </p>
          <p className="mt-2">
            A: Accessibility for infinite scroll requires several deliberate interventions. First, announce new content loading using an ARIA live region — when new items are fetched, announce something like &ldquo;25 more items loaded, 75 items total&rdquo; so screen reader users know the page has changed. Second, maintain logical focus order — when new items append, the focus should remain on the current item, not jump to the new content. Third, provide a mechanism to pause automatic loading — screen reader users may be overwhelmed by content that loads while they are still processing existing items. A &ldquo;Load More&rdquo; button or a pause toggle gives them control. Fourth, provide keyboard-accessible skip links that allow keyboard users to jump past the list to footer content or navigation that infinite scroll would otherwise make unreachable. Fifth, include position context such as &ldquo;Viewing items 51-75 of approximately 500&rdquo; that screen readers can access on demand. Finally, ensure that the loading indicator and end-of-results message are both accessible to screen readers, not just visually displayed.
          </p>
        </div>

        <div className="rounded-lg border border-theme bg-panel-soft p-4">
          <p className="font-medium">
            Q: How would you implement virtualization for a list with variable
            height items?
          </p>
          <p className="mt-2">
            A: Variable-height virtualization is more complex than fixed-height because you cannot calculate scroll position from a simple index multiplication. I would use a measured approach: initially estimate item heights using a reasonable default, render items as they enter the viewport, measure their actual heights after rendering using ResizeObserver, and cache the measured heights for subsequent renders. The virtualizer maintains a running total of heights to calculate the total scroll area and determine which items are visible at any scroll position. When the user scrolls, the virtualizer uses binary search through the cumulative height array to find the first visible item, then renders items from there until the viewport is filled plus a buffer. For items that have not been measured yet (scrolling forward into unseen territory), estimates are used until actual measurements replace them. Libraries like react-virtuoso handle this complexity, but the important architectural consideration is that the height cache must persist across re-renders and survive component unmounting if scroll restoration is needed. The estimation strategy significantly affects scroll bar accuracy — poor estimates cause the scroll bar to jump as measured heights replace estimates.
          </p>
        </div>
      </section>
    </ArticleLayout>
  );
}
