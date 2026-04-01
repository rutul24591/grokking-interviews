"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-frontend-feed-display",
  title: "Feed Display",
  description:
    "Comprehensive guide to feed display covering chronological vs ranked feeds, infinite scroll, virtualization, feed updates, and scroll position management.",
  category: "functional-requirements",
  subcategory: "discovery-search-feed-browsing",
  slug: "feed-display",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-25",
  tags: [
    "requirements",
    "functional",
    "discovery",
    "feed",
    "timeline",
    "frontend",
    "infinite-scroll",
  ],
  relatedTopics: [
    "feed-generation",
    "ranking",
    "infinite-scroll",
    "virtualization",
  ],
};

export default function FeedDisplayArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Feed Display</strong> is the frontend interface that presents
          content in a continuous, scrollable stream optimized for discovery and
          engagement. It is the primary interaction point for users on social
          platforms (Twitter, Facebook, Instagram), news aggregators (Reddit,
          Hacker News), and content platforms (YouTube, TikTok).
        </p>
        <p>
          Feed display involves complex frontend engineering challenges:
          rendering hundreds or thousands of items efficiently (virtualization),
          maintaining scroll position during navigation, handling real-time
          updates without disrupting user experience, implementing smooth
          infinite scrolling, and supporting multiple feed types (chronological,
          ranked, hybrid). Performance is critical—janky scrolling or slow
          render times directly impact user engagement and session duration.
        </p>
        <p>
          For staff-level engineers, feed display architecture requires
          balancing visual fidelity with performance, implementing robust state
          management for scroll position and loaded items, handling edge cases
          (empty states, loading errors, network reconnection), and ensuring
          accessibility across devices and input methods.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Feed Types</h3>
        <p>
          Different feed types serve different user needs and platform goals:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Chronological Feed:</strong> Items sorted by creation time
            (newest first). Simple, predictable, transparent. Users see
            everything from followed accounts in order. Best for: Twitter
            (Latest tab), messaging apps, activity feeds. Limitation: May
            surface low-quality or irrelevant content.
          </li>
          <li>
            <strong>Ranked Feed:</strong> Items sorted by relevance score from
            ML model. Maximizes engagement by surfacing high-quality,
            personalized content. Best for: Facebook News Feed, Instagram,
            TikTok, YouTube. Limitation: Opaque algorithm, potential filter
            bubbles, users may miss content from close connections.
          </li>
          <li>
            <strong>Hybrid Feed:</strong> Combines chronological and ranked
            approaches. Recent content from close connections shown
            chronologically, everything else ranked. Best for: Twitter (For You
            tab with recency boost), LinkedIn. Balances FOMO (fear of missing
            out) with relevance.
          </li>
        </ul>

        <h3 className="mt-6">Feed Sections/Tabs</h3>
        <p>Most platforms offer multiple feed views:</p>
        <ul className="space-y-3">
          <li>
            <strong>For You:</strong> Personalized recommendations based on
            interests, engagement history, and similarity to other users. May
            include content from accounts user doesn't follow.
          </li>
          <li>
            <strong>Following:</strong> Content only from accounts user follows.
            Can be chronological or ranked by engagement with followed accounts.
          </li>
          <li>
            <strong>Trending/Explore:</strong> Popular content platform-wide or
            in specific categories. Helps users discover new topics and viral
            content.
          </li>
        </ul>

        <h3 className="mt-6">Virtualization/Windowing</h3>
        <p>
          Virtualization renders only visible items, not the entire feed.
          Critical for performance with long feeds.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Visible Window:</strong> Render items currently in viewport
            plus small buffer (5-10 items above/below). Unmount items scrolled
            past.
          </li>
          <li>
            <strong>Placeholder Spacing:</strong> Maintain total scroll height
            using placeholders for unrendered items. Prevents scroll bar
            jumping.
          </li>
          <li>
            <strong>Recycling:</strong> Reuse DOM nodes for new items as user
            scrolls. Reduces allocation/GC pressure. Used by React Window, React
            Virtualized.
          </li>
          <li>
            <strong>Dynamic Heights:</strong> Handle items with variable
            heights. Measure rendered items, cache heights, estimate unrendered
            items.
          </li>
        </ul>

        <h3 className="mt-6">Infinite Scroll vs Pagination</h3>
        <p>
          Infinite scroll automatically loads more content as user scrolls.
          Pagination requires explicit navigation (page 1, 2, 3...).
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Infinite Scroll:</strong> Better for exploration,
            mobile-friendly, reduces interaction cost. Risks: footer
            inaccessible, hard to return to position, memory issues with long
            sessions.
          </li>
          <li>
            <strong>Pagination:</strong> Better for finding specific content,
            bookmarking, SEO. Risks: interaction friction, users don't navigate
            past page 1.
          </li>
          <li>
            <strong>Load More Button:</strong> Hybrid approach. Auto-scroll
            within page, explicit "Load More" for next page. Combines benefits
            of both.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          A production feed display system involves multiple components managing
          rendering, state, and data fetching.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery/feed-display/feed-display-architecture.svg"
          alt="Feed Display Architecture"
          caption="Figure 1: Feed Display Architecture — Virtualized list with windowing, data fetching, and scroll management"
          width={1000}
          height={500}
        />

        <h3>Component Breakdown</h3>
        <ul className="space-y-3">
          <li>
            <strong>Feed Container:</strong> Main scrollable area. Manages
            scroll event listeners, infinite scroll trigger, pull-to-refresh.
          </li>
          <li>
            <strong>Virtualized List:</strong> Core rendering component.
            Calculates visible window, renders only visible items, manages
            placeholder spacing. Libraries: React Window, React Virtualized,
            tanstack/virtual.
          </li>
          <li>
            <strong>Feed Item Component:</strong> Individual post/card
            component. Handles its own media loading, engagement actions (like,
            comment, share), and optimization (lazy loading, intersection
            observer).
          </li>
          <li>
            <strong>Data Manager:</strong> Manages feed state (loaded items,
            loading state, errors, cursor for pagination). Handles refetch,
            refresh, load more.
          </li>
          <li>
            <strong>Scroll Position Manager:</strong> Saves scroll offset before
            navigation, restores on return. Handles scroll restoration across
            page transitions.
          </li>
          <li>
            <strong>Real-time Updater:</strong> Listens for new content
            (WebSocket, SSE). Shows "X new posts" banner, handles seamless
            insertion without disrupting scroll.
          </li>
        </ul>

        <h3 className="mt-6">Data Flow: Feed Loading</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            <strong>Initial Load:</strong> Fetch first page (20-50 items) on
            mount. Show skeleton screens during load.
          </li>
          <li>
            <strong>Render Visible:</strong> Virtualized list renders first
            window (items 1-10 with buffer).
          </li>
          <li>
            <strong>Scroll Detection:</strong> Scroll event listener detects
            user approaching bottom (within 200-500px threshold).
          </li>
          <li>
            <strong>Load More Trigger:</strong> Fetch next page using cursor
            from previous response. Append to feed state.
          </li>
          <li>
            <strong>Virtualization Update:</strong> Virtualized list
            recalculates visible window, renders new items as they enter
            viewport.
          </li>
          <li>
            <strong>Memory Management:</strong> Optionally unload items scrolled
            far past (keep last 100 items in memory, cache rest).
          </li>
        </ol>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery/feed-display/scroll-position-management.svg"
          alt="Scroll Position Management"
          caption="Figure 2: Scroll Position Management — Save offset before navigation, restore on return, handle dynamic content"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Scroll Position Management</h3>
        <p>
          Maintaining scroll position across navigation is critical for good UX:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Save Before Navigation:</strong> On link click, save current
            scroll offset and feed state (loaded items, cursors) to
            sessionStorage or state management (Zustand, Redux).
          </li>
          <li>
            <strong>Restore On Return:</strong> On page mount, check for saved
            position. Restore scroll offset after initial render. Use
            requestAnimationFrame or setTimeout to ensure DOM is ready.
          </li>
          <li>
            <strong>Handle Dynamic Content:</strong> If feed content changed
            (new posts, deleted posts), adjust scroll position proportionally.
            Use stable item IDs for accurate restoration.
          </li>
          <li>
            <strong>Browser Scroll Restoration:</strong> Use{" "}
            <code className="text-sm bg-muted px-1.5 py-0.5 rounded">
              scrollRestoration: 'manual'
            </code>{" "}
            in Next.js. Browser won't interfere with manual restoration.
          </li>
        </ul>

        <h3 className="mt-6">Feed Update Strategies</h3>
        <p>Handling new content while user is viewing feed:</p>
        <ul className="space-y-3">
          <li>
            <strong>Pull-to-Refresh:</strong> User-initiated refresh. Fetch
            latest content, prepend to feed, maintain scroll position or scroll
            to top.
          </li>
          <li>
            <strong>"X New Posts" Banner:</strong> Passive notification. Listen
            for new content (polling or WebSocket), show banner at top, user
            clicks to prepend new items.
          </li>
          <li>
            <strong>Auto-refresh on Return:</strong> When user returns to feed
            tab, silently fetch new content, show banner if significant updates.
          </li>
          <li>
            <strong>Optimistic Updates:</strong> When user creates post,
            immediately prepend to feed (optimistic), then confirm with server
            response.
          </li>
        </ul>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Feed display involves balancing performance, user experience, and
          implementation complexity.
        </p>

        <h3>Virtualization Libraries Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Library</th>
                <th className="text-left p-2 font-semibold">Bundle Size</th>
                <th className="text-left p-2 font-semibold">Dynamic Heights</th>
                <th className="text-left p-2 font-semibold">
                  Horizontal Scroll
                </th>
                <th className="text-left p-2 font-semibold">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">React Window</td>
                <td className="p-2">~7KB</td>
                <td className="p-2">Yes (estimate + measure)</td>
                <td className="p-2">Yes</td>
                <td className="p-2">Most use cases, small bundle</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">React Virtualized</td>
                <td className="p-2">~20KB</td>
                <td className="p-2">Yes (CellMeasurer)</td>
                <td className="p-2">Yes</td>
                <td className="p-2">Complex layouts, legacy</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">tanstack/virtual</td>
                <td className="p-2">~5KB</td>
                <td className="p-2">Yes</td>
                <td className="p-2">Yes</td>
                <td className="p-2">Framework-agnostic, modern</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Custom Implementation</td>
                <td className="p-2">Variable</td>
                <td className="p-2">Full control</td>
                <td className="p-2">Full control</td>
                <td className="p-2">Specialized requirements</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery/feed-display/feed-update-strategies.svg"
          alt="Feed Update Strategies"
          caption="Figure 3: Feed Update Strategies — Pull-to-refresh, new posts banner, auto-refresh, and optimistic updates"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Infinite Scroll vs Pagination Decision</h3>
        <p>
          <strong>Choose Infinite Scroll When:</strong> Content is exploratory
          (social feeds, discovery), mobile-first design, engagement is primary
          goal, content is ephemeral (news, tweets).
        </p>
        <p>
          <strong>Choose Pagination When:</strong> Users need to find specific
          content (search results, comments), bookmarking is important, SEO is
          critical, content is reference material (documentation, forums).
        </p>
        <p>
          <strong>Hybrid Approach:</strong> Infinite scroll within page, "Load
          More" button between pages. Combines seamless scrolling with explicit
          loading control. Used by Twitter, Instagram.
        </p>

        <h3 className="mt-6">Memory Management Trade-offs</h3>
        <p>
          <strong>Keep All Items:</strong> Simplest implementation. No re-render
          cost when scrolling back up. Risk: Memory bloat after long sessions
          (1000+ items = 50-100MB DOM nodes).
        </p>
        <p>
          <strong>Virtualization Only:</strong> Render visible window only.
          Constant memory regardless of feed length. Risk: Re-render cost when
          scrolling back, lost scroll position if not managed.
        </p>
        <p>
          <strong>Hybrid (Recommended):</strong> Keep last 100-200 items in DOM,
          cache older items. Unload items scrolled 1000+ pixels above viewport.
          Balance between memory and re-render cost.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use Virtualization:</strong> Never render entire feed. Use
            React Window or tanstack/virtual for efficient rendering. Target
            60fps scroll performance.
          </li>
          <li>
            <strong>Implement Skeleton Screens:</strong> Show skeleton
            placeholders during initial load and while loading more. Reduces
            perceived latency.
          </li>
          <li>
            <strong>Debounce Scroll Events:</strong> Scroll event fires
            frequently. Use requestAnimationFrame or lodash.debounce to limit
            handler calls.
          </li>
          <li>
            <strong>Use Cursor-based Pagination:</strong> Never use offset-based
            pagination for feeds. Cursors prevent duplicates and maintain
            consistency as new content arrives.
          </li>
          <li>
            <strong>Save Scroll Position:</strong> Persist scroll offset before
            navigation, restore on return. Use sessionStorage or state
            management.
          </li>
          <li>
            <strong>Handle New Content Gracefully:</strong> Show "X new posts"
            banner instead of auto-prepending (disruptive). Let user control
            when to refresh.
          </li>
          <li>
            <strong>Implement Pull-to-Refresh:</strong> Standard mobile pattern.
            Use libraries like react-pull-to-refresh for native feel.
          </li>
          <li>
            <strong>Lazy Load Media:</strong> Images/videos should lazy load
            using Intersection Observer. Prevents bandwidth waste on unseen
            content.
          </li>
          <li>
            <strong>Handle Empty States:</strong> Show helpful message when feed
            is empty (no posts, no results). Provide call-to-action (follow
            accounts, create post).
          </li>
          <li>
            <strong>Accessibility:</strong> Ensure keyboard navigation works
            (Tab through posts, Enter to expand). Use semantic HTML (article
            tags for posts). Announce new content to screen readers.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No Virtualization:</strong> Rendering 100+ items causes
            janky scroll, high memory usage. Solution: Implement virtualization
            from start.
          </li>
          <li>
            <strong>Scroll Position Lost:</strong> Navigation resets scroll to
            top. Solution: Save/restore scroll position, use Next.js scroll
            restoration.
          </li>
          <li>
            <strong>Duplicate Items:</strong> Loading more appends duplicates.
            Solution: Use cursor-based pagination, deduplicate on client before
            rendering.
          </li>
          <li>
            <strong>Footer Inaccessible:</strong> Infinite scroll never reaches
            footer. Solution: Pause infinite scroll near bottom, show footer,
            provide "Load More" button.
          </li>
          <li>
            <strong>Memory Leak:</strong> Event listeners not cleaned up, items
            not unloaded. Solution: Use useEffect cleanup, implement item
            unloading strategy.
          </li>
          <li>
            <strong>Janky Scroll on Refresh:</strong> New items inserted while
            user reading, causes jump. Solution: Use "X new posts" banner,
            maintain scroll position during insert.
          </li>
          <li>
            <strong>Images Shifting Layout:</strong> Images load after render,
            causes layout shift. Solution: Reserve space with aspect ratio, use
            skeleton placeholders.
          </li>
          <li>
            <strong>No Loading Indicator:</strong> User doesn't know more
            content loading. Solution: Show spinner or skeleton at bottom while
            fetching.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Twitter Feed</h3>
        <p>
          Twitter uses virtualized feed with "X new Tweets" banner for real-time
          updates. Implements hybrid infinite scroll (pauses near bottom for
          footer). Two tabs: "For You" (ranked) and "Following" (chronological).
          Pull-to-refresh on mobile.
        </p>
        <p>
          <strong>Key Innovation:</strong> Optimistic posting—tweet appears
          immediately in feed, then confirms with server. Handles failures
          gracefully with retry.
        </p>

        <h3 className="mt-6">Instagram Feed</h3>
        <p>
          Instagram uses aggressive virtualization with dynamic item heights
          (photos, videos, carousels, stories). Implements "X new posts" banner,
          pull-to-refresh. Preloads media for next few items while scrolling.
        </p>
        <p>
          <strong>Key Innovation:</strong> Smart image preloading—predicts which
          images will enter viewport based on scroll velocity, preloads
          accordingly.
        </p>

        <h3 className="mt-6">Reddit Feed</h3>
        <p>
          Reddit uses infinite scroll with "Load More" button (hybrid approach).
          Sort options: Hot, New, Top, Rising. Maintains scroll position when
          navigating to post and back. Comment threads use nested
          virtualization.
        </p>
        <p>
          <strong>Key Innovation:</strong> Scroll position restoration even
          after deep navigation (post → comments → back to feed). Uses session
          storage for state.
        </p>

        <h3 className="mt-6">TikTok Feed</h3>
        <p>
          TikTok uses full-screen vertical scroll (snap scroll). Each video
          preloads before entering viewport. Implements seamless loop—end of
          feed wraps to beginning. Auto-play on visible, pause on hidden.
        </p>
        <p>
          <strong>Key Innovation:</strong> Predictive preloading—based on watch
          history, preloads videos user is likely to engage with, skips unlikely
          content.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement infinite scroll?
            </p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use Intersection Observer or scroll event
              listener to detect when user approaches bottom (within 200-500px
              threshold). Trigger fetch for next page using cursor from previous
              response. Append new items to feed state. Show loading indicator
              while fetching. Handle end-of-feed with "You're all caught up"
              message. Debounce scroll events to prevent multiple simultaneous
              fetches.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you optimize feed rendering performance?
            </p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement virtualization (React Window,
              tanstack/virtual) to render only visible items. Lazy load
              images/videos using Intersection Observer. Use React.memo for feed
              items to prevent unnecessary re-renders. Implement windowing with
              buffer (render 5-10 items above/below viewport). Unload items
              scrolled far past to free memory. Target 60fps scroll performance,
              profile with React DevTools.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle scroll position restoration?
            </p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Save scroll offset to sessionStorage or state
              management (Zustand, Redux) before navigation. On page mount,
              check for saved position. After initial render, use
              window.scrollTo() to restore position. Use requestAnimationFrame
              to ensure DOM is ready. Handle dynamic content by adjusting
              position proportionally if items were added/removed. Use
              scrollRestoration: 'manual' in Next.js to prevent browser
              interference.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle real-time feed updates?
            </p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Listen for new content via WebSocket or
              polling. Instead of auto-prepending (disruptive), show "X new
              posts" banner at top. When user clicks banner, fetch new items,
              prepend to feed, optionally scroll to top. For optimistic updates
              (user's own posts), immediately prepend to feed, then confirm with
              server response. Handle failures with retry logic.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle variable-height feed items?
            </p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use virtualization library with dynamic height
              support (React Window's VariableSizeList, tanstack/virtual).
              Estimate item heights initially, measure actual heights after
              render, cache measurements. Update virtualizer with actual
              heights. For images, reserve space using aspect ratio to prevent
              layout shift. Use skeleton placeholders during load.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement pull-to-refresh?
            </p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use library like react-pull-to-refresh for
              native feel. On pull trigger, fetch latest content with fresh
              cursor. Prepend new items to feed. Maintain scroll position or
              scroll to top based on UX preference. Show loading spinner during
              refresh. Handle errors gracefully with retry option. On mobile,
              use native overflow: 'auto' for smooth scroll.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
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
              href="https://tanstack.com/virtual"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              TanStack Virtual — Framework-agnostic Virtualization
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/virtualize-lists-with-webpack-carbon/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Web.dev — Virtualize Lists for Performance
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
