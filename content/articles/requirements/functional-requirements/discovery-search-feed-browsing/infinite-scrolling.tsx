"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-frontend-infinite-scroll",
  title: "Infinite Scrolling",
  description:
    "Comprehensive guide to infinite scrolling covering trigger mechanisms, cursor-based pagination, virtualization, memory management, and UX best practices.",
  category: "functional-requirements",
  subcategory: "discovery",
  slug: "infinite-scrolling",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-25",
  tags: [
    "requirements",
    "functional",
    "discovery",
    "infinite-scroll",
    "pagination",
    "frontend",
    "virtualization",
  ],
  relatedTopics: ["feed-display", "search-results", "performance", "virtualization"],
};

export default function InfiniteScrollingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Infinite Scrolling</strong> is a web design pattern that automatically
          loads additional content as the user scrolls down the page, creating a seamless,
          uninterrupted browsing experience. Unlike traditional pagination (page 1, 2, 3...),
          infinite scroll eliminates explicit navigation, allowing users to continuously
          discover content without clicking "next page."
        </p>
        <p>
          Infinite scroll became popular with the rise of social media (Facebook, Twitter,
          Instagram) and content discovery platforms (Pinterest, TikTok). It excels for
          exploratory browsing where users don't have a specific target—they're consuming
          content for entertainment or discovery. However, it presents challenges: footer
          accessibility, scroll position restoration, memory management for long sessions,
          and SEO implications.
        </p>
        <p>
          For staff-level engineers, infinite scroll implementation involves balancing
          user experience with technical constraints: when to trigger loading (threshold
          distance), how to prevent duplicate content, managing memory as content
          accumulates, maintaining scroll position across navigation, and providing
          appropriate stopping points.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Trigger Mechanisms</h3>
        <p>
          Detecting when to load more content is the core challenge of infinite scroll:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Scroll Event Listener:</strong> Listen to window scroll events, calculate
            distance from bottom. Simple but fires frequently—requires debouncing/throttling.
          </li>
          <li>
            <strong>Intersection Observer:</strong> Modern API for detecting when element
            enters viewport. Place sentinel element at bottom, observe when visible. More
            efficient than scroll events.
          </li>
          <li>
            <strong>Threshold Distance:</strong> Trigger when user is N pixels from bottom
            (200-500px typical). Provides buffer for network latency—content loads before
            user reaches end.
          </li>
        </ul>

        <h3 className="mt-6">Cursor-based vs Offset Pagination</h3>
        <p>
          How you request the next page of data matters for consistency:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Offset-based (page=1, page=2):</strong> Simple but problematic. If
            content changes between requests (new posts added, deleted), you get duplicates
            or gaps. Page 2 might show items that were on page 1.
          </li>
          <li>
            <strong>Cursor-based (cursor=abc123):</strong> Server returns opaque cursor
            representing position in dataset. Next request uses cursor, not page number.
            Immune to data changes—always continues from exact position.
          </li>
          <li>
            <strong>Key-based (after=item_id):</strong> Use last item's ID as cursor.
            Simpler than opaque cursor, same benefits. Requires sequential, stable IDs.
          </li>
        </ul>

        <h3 className="mt-6">Virtualization/Windowing</h3>
        <p>
          Without virtualization, infinite scroll accumulates DOM nodes indefinitely,
          causing memory bloat and janky scroll:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Full Rendering:</strong> Render all loaded items. Simple but unsustainable—
            1000 items = 50-100MB DOM, noticeable lag.
          </li>
          <li>
            <strong>Virtualized Rendering:</strong> Render only visible items plus small
            buffer. Unmount items scrolled far past. Constant memory regardless of total
            items. Libraries: React Window, tanstack/virtual.
          </li>
          <li>
            <strong>Hybrid Approach:</strong> Keep last 100-200 items rendered, cache older
            items. Balance between memory and re-render cost when scrolling back up.
          </li>
        </ul>

        <h3 className="mt-6">Loading States</h3>
        <p>
          Visual feedback during content loading:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Spinner:</strong> Traditional loading indicator at bottom. Clear but
            takes vertical space.
          </li>
          <li>
            <strong>Skeleton Screens:</strong> Placeholder cards matching content layout.
            Reduces perceived latency, prevents layout shift.
          </li>
          <li>
            <strong>Progressive Loading:</strong> Load images lazily as they approach
            viewport. Prevents bandwidth waste on unseen content.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          A robust infinite scroll implementation involves multiple components managing
          detection, data fetching, and rendering.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/infinite-scrolling/trigger-mechanisms.svg"
          alt="Infinite Scroll Trigger Mechanisms"
          caption="Figure 1: Trigger Mechanisms — Scroll event listener vs Intersection Observer with threshold detection"
          width={1000}
          height={500}
        />

        <h3>Component Breakdown</h3>
        <ul className="space-y-3">
          <li>
            <strong>Scroll Container:</strong> The scrollable element (window or div).
            Attaches scroll event listener or hosts sentinel element for Intersection Observer.
          </li>
          <li>
            <strong>Trigger Detector:</strong> Calculates distance from bottom, determines
            when to load more. Implements debounce/throttle to prevent excessive calls.
          </li>
          <li>
            <strong>Data Fetcher:</strong> Manages API calls for next page. Handles loading
            state, errors, deduplication. Uses cursor from previous response.
          </li>
          <li>
            <strong>Content Manager:</strong> Maintains list of loaded items. Appends new
            items, prevents duplicates, tracks cursors.
          </li>
          <li>
            <strong>Virtualized List:</strong> Renders visible window of items. Manages
            placeholder spacing for unrendered items.
          </li>
          <li>
            <strong>Loading Indicator:</strong> Shows spinner or skeleton at bottom while
            fetching. Hidden when no more content.
          </li>
        </ul>

        <h3 className="mt-6">Data Flow: Loading More Content</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            <strong>User Scrolls:</strong> Scroll event fires or sentinel enters viewport.
          </li>
          <li>
            <strong>Threshold Check:</strong> Calculate distance from bottom. If within
            threshold (200-500px), trigger load.
          </li>
          <li>
            <strong>Debounce Check:</strong> Ensure no pending request. Cancel if previous
            request still loading.
          </li>
          <li>
            <strong>Fetch Next Page:</strong> API call with cursor from last loaded item.
            Show loading indicator.
          </li>
          <li>
            <strong>Receive Response:</strong> Get new items + next cursor + hasMore flag.
          </li>
          <li>
            <strong>Deduplicate:</strong> Filter out items already in list (by ID).
          </li>
          <li>
            <strong>Append to List:</strong> Add new items to content manager state.
          </li>
          <li>
            <strong>Update Cursor:</strong> Store next cursor for subsequent requests.
          </li>
          <li>
            <strong>Check End:</strong> If hasMore is false, show "end of content" message,
            disable infinite scroll.
          </li>
        </ol>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/infinite-scrolling/cursor-pagination-flow.svg"
          alt="Cursor-based Pagination Flow"
          caption="Figure 2: Cursor-based Pagination — Opaque cursor ensures consistent position regardless of data changes"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Memory Management Strategy</h3>
        <p>
          As users scroll through hundreds or thousands of items, memory management becomes
          critical:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Strategy</th>
                <th className="text-left p-2 font-semibold">Memory Usage</th>
                <th className="text-left p-2 font-semibold">Re-render Cost</th>
                <th className="text-left p-2 font-semibold">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">Keep All Items</td>
                <td className="p-2">High (grows indefinitely)</td>
                <td className="p-2">Low (no re-render)</td>
                <td className="p-2">Short sessions (&lt;100 items)</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Virtualization Only</td>
                <td className="p-2">Constant (visible window)</td>
                <td className="p-2">High (re-render on scroll back)</td>
                <td className="p-2">Long feeds, memory-constrained</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Hybrid (Recommended)</td>
                <td className="p-2">Medium (last 200 items)</td>
                <td className="p-2">Medium</td>
                <td className="p-2">Production systems</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6">Handling Edge Cases</h3>
        <ul className="space-y-3">
          <li>
            <strong>End of Content:</strong> When hasMore is false, show "You're all caught
            up" message. Disable trigger to prevent unnecessary API calls.
          </li>
          <li>
            <strong>Loading Error:</strong> Show error message with retry button. Don't
            automatically retry (infinite loop risk).
          </li>
          <li>
            <strong>Footer Accessibility:</strong> Pause infinite scroll near bottom, show
            footer, provide "Load More" button to continue.
          </li>
          <li>
            <strong>Network Reconnection:</strong> If connection lost during fetch, show
            retry option. Preserve loaded content.
          </li>
          <li>
            <strong>Concurrent Requests:</strong> Prevent multiple simultaneous fetches.
            Use loading flag, abort pending requests on new trigger.
          </li>
        </ul>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Infinite scroll involves balancing user experience, performance, and technical
          constraints.
        </p>

        <h3>Infinite Scroll vs Pagination</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Criterion</th>
                <th className="text-left p-2 font-semibold">Infinite Scroll</th>
                <th className="text-left p-2 font-semibold">Pagination</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">Use Case</td>
                <td className="p-2">Exploration, discovery</td>
                <td className="p-2">Finding specific content</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Mobile Experience</td>
                <td className="p-2">Excellent (natural scroll)</td>
                <td className="p-2">Poor (small tap targets)</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Bookmarking</td>
                <td className="p-2">Difficult (no page numbers)</td>
                <td className="p-2">Easy (page 3 URL)</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">SEO</td>
                <td className="p-2">Challenging (crawl depth)</td>
                <td className="p-2">Excellent (explicit URLs)</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Footer Access</td>
                <td className="p-2">Requires special handling</td>
                <td className="p-2">Always accessible</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Performance</td>
                <td className="p-2">Memory concerns (long sessions)</td>
                <td className="p-2">Constant (fixed page size)</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Engagement</td>
                <td className="p-2">Higher (frictionless)</td>
                <td className="p-2">Lower (click friction)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/infinite-scrolling/memory-management-strategies.svg"
          alt="Memory Management Strategies"
          caption="Figure 3: Memory Management — Keep all vs virtualization vs hybrid approach for long infinite scroll sessions"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Trigger Threshold Trade-offs</h3>
        <p>
          <strong>Small Threshold (100-200px):</strong> Loads content just before user
          reaches end. Minimal wasted bandwidth if user stops scrolling. Risk: Visible
          loading state if network is slow.
        </p>
        <p>
          <strong>Medium Threshold (300-500px):</strong> Balanced approach. Most production
          systems use this range. Content loads with buffer, rarely visible loading state.
        </p>
        <p>
          <strong>Large Threshold (600-1000px):</strong> Aggressive preloading. Content
          always available. Risk: Wasted bandwidth if user stops scrolling before reaching
          loaded content.
        </p>

        <h3 className="mt-6">Hybrid Approach: Infinite Scroll + Load More</h3>
        <p>
          Combine infinite scroll with explicit "Load More" button:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Within Page:</strong> Infinite scroll loads items 1-100 automatically.
          </li>
          <li>
            <strong>Between Pages:</strong> After 100 items, show "Load More" button.
            User explicitly requests next batch.
          </li>
          <li>
            <strong>Benefits:</strong> Seamless initial experience, user control for deep
            browsing, footer accessible, reduces accidental endless scrolling.
          </li>
          <li>
            <strong>Used By:</strong> Twitter, Instagram, Pinterest (with variations).
          </li>
        </ul>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use Intersection Observer:</strong> More efficient than scroll events.
            Place sentinel element at bottom, observe when visible. Fallback to scroll
            listener for older browsers.
          </li>
          <li>
            <strong>Implement Debouncing:</strong> Prevent multiple simultaneous triggers.
            Use 100-200ms debounce on scroll events. Cancel pending requests on new trigger.
          </li>
          <li>
            <strong>Use Cursor-based Pagination:</strong> Never use offset-based pagination
            for infinite scroll. Cursors prevent duplicates when data changes.
          </li>
          <li>
            <strong>Show Loading State:</strong> Display spinner or skeleton at bottom while
            fetching. Hidden when no more content.
          </li>
          <li>
            <strong>Handle End of Content:</strong> Show "You're all caught up" message.
            Disable trigger to prevent unnecessary API calls.
          </li>
          <li>
            <strong>Implement Virtualization:</strong> For long feeds, use React Window or
            tanstack/virtual. Render only visible items plus buffer.
          </li>
          <li>
            <strong>Make Footer Accessible:</strong> Pause infinite scroll near bottom.
            Show footer with links. Provide "Load More" button to continue.
          </li>
          <li>
            <strong>Preserve Scroll Position:</strong> Save scroll offset before navigation,
            restore on return. Critical for back button support.
          </li>
          <li>
            <strong>Handle Errors Gracefully:</strong> Show error message with retry button.
            Don't auto-retry (infinite loop risk).
          </li>
          <li>
            <strong>Provide Alternative Navigation:</strong> Include page numbers or "jump
            to top" button for long sessions. Helps users orient themselves.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No Debouncing:</strong> Trigger fires multiple times, loads duplicate
            pages. Solution: Implement debounce + loading flag to prevent concurrent requests.
          </li>
          <li>
            <strong>Using Offset Pagination:</strong> Data changes cause duplicates or gaps.
            Solution: Use cursor-based or key-based pagination.
          </li>
          <li>
            <strong>Memory Leak:</strong> Accumulating DOM nodes without virtualization.
            Solution: Implement virtualization or unload old items.
          </li>
          <li>
            <strong>Footer Inaccessible:</strong> Infinite scroll never reaches footer.
            Solution: Pause scroll near bottom, show footer, provide "Load More" button.
          </li>
          <li>
            <strong>Scroll Position Lost:</strong> Navigation resets to top. Solution:
            Save/restore scroll position using sessionStorage or state management.
          </li>
          <li>
            <strong>No End Indicator:</strong> User doesn't know if more content exists.
            Solution: Show "end of content" message when hasMore is false.
          </li>
          <li>
            <strong>Layout Shift on Load:</strong> Content jumps when new items load.
            Solution: Reserve space with skeleton screens, maintain stable heights.
          </li>
          <li>
            <strong>Ignoring Network Errors:</strong> Silent failures, user doesn't know
            why content stopped loading. Solution: Show error message with retry option.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Twitter Feed</h3>
        <p>
          Twitter uses infinite scroll with "Load More" button hybrid approach. After
          initial auto-load, shows button for explicit loading. Implements cursor-based
          pagination, virtualization for performance. Footer accessible via pause.
        </p>
        <p>
          <strong>Key Innovation:</strong> Scroll position restoration even after deep
          navigation. Uses session storage to save feed state and scroll offset.
        </p>

        <h3 className="mt-6">Instagram Feed</h3>
        <p>
          Instagram uses pure infinite scroll with aggressive virtualization. Preloads
          next few images while scrolling. Shows skeleton placeholders during load.
          Implements pull-to-refresh for manual refresh.
        </p>
        <p>
          <strong>Key Innovation:</strong> Smart preloading based on scroll velocity.
          Predicts when user will reach bottom, adjusts preload timing accordingly.
        </p>

        <h3 className="mt-6">Pinterest Feed</h3>
        <p>
          Pinterest pioneered masonry layout infinite scroll. Handles variable-height
          items with complex virtualization. Shows "Pinned it" confirmation without
          disrupting scroll. Implements "Load More" button after certain scroll depth.
        </p>
        <p>
          <strong>Key Innovation:</strong> Column-based masonry layout with virtualization.
          Maintains visual consistency while efficiently rendering only visible items.
        </p>

        <h3 className="mt-6">Reddit Comments</h3>
        <p>
          Reddit uses "Load More Comments" button (explicit pagination) for nested
          comments. Infinite scroll for main feed. Hybrid approach balances UX with
          performance for deeply nested content.
        </p>
        <p>
          <strong>Key Innovation:</strong> Nested virtualization for comment threads.
          Collapsed comments don't render children, expanding loads on-demand.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement infinite scroll?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use Intersection Observer API to detect when sentinel
              element at bottom enters viewport. On trigger, fetch next page using cursor
              from previous response. Append new items to list, update cursor. Show loading
              spinner while fetching. Handle end-of-content with "no more items" message.
              Implement debounce to prevent multiple simultaneous requests. Use cursor-based
              pagination to avoid duplicates.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle memory with infinite scroll?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement virtualization using React Window or tanstack/virtual.
              Render only visible window (items in viewport + small buffer). Unmount items
              scrolled far past. For hybrid approach, keep last 100-200 items rendered,
              cache older items. Use placeholder spacing to maintain scroll height. Target
              constant memory usage regardless of total items loaded.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Infinite scroll vs pagination—when to use which?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Infinite scroll for: exploratory browsing (social feeds,
              discovery), mobile-first design, engagement-focused products. Pagination for:
              search results, finding specific content, bookmarking needs, SEO-critical
              pages. Hybrid approach (infinite + "Load More" button) combines benefits of
              both. Consider user intent: are they browsing or searching?
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent duplicate content?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use cursor-based pagination (not offset). Server returns
              opaque cursor representing position. Next request uses cursor, immune to data
              changes. Additionally, deduplicate on client: maintain Set of loaded item IDs,
              filter new items before appending. Track cursors for each page to enable
              accurate restoration.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you make footer accessible with infinite scroll?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Pause infinite scroll trigger when user approaches bottom
              (last 1000px). Show footer with links. If user wants more content, provide
              "Load More" button below footer. Alternative: Use hybrid approach—infinite
              scroll for first 100 items, then explicit "Load More" buttons. Twitter and
              Instagram use variations of this pattern.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle scroll position restoration?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Save scroll offset to sessionStorage before navigation
              (on link click). On page mount, check for saved position. After initial
              render, use window.scrollTo() to restore. Use requestAnimationFrame to ensure
              DOM is ready. For dynamic content, adjust position proportionally if items
              were added/removed. Use scrollRestoration: 'manual' in Next.js.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — Intersection Observer API
            </a>
          </li>
          <li>
            <a
              href="https://react-window.vercel.app/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              React Window — Virtualized List Component
            </a>
          </li>
          <li>
            <a
              href="https://www.smashingmagazine.com/2016/03/pagination-infinite-scrolling-load-more-buttons/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Smashing Magazine — Pagination vs Infinite Scroll
            </a>
          </li>
          <li>
            <a
              href="https://twitter.com/TwitterEng/status/1354180133956878340"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter Engineering — Building Twitter's Feed
            </a>
          </li>
          <li>
            <a
              href="https://instagram-engineering.com/instagram-technology"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram Engineering — Feed Technology
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
