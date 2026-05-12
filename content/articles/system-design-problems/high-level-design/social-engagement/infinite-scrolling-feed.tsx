"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-infinite-scrolling-feed",
  title: "Design an Infinite Scrolling Feed with Ranking",
  description:
    "Architecture for an infinite scrolling feed with content ranking: cursor-based pagination with ranking score stability, virtual list windowing for DOM memory management, feed cache warm-up on login, real-time new-post injection without layout shift, pull-to-refresh with debounce, rank-based cursor design to prevent drift on re-rank, skeleton loading states, scroll position restoration on back-navigation, and content deduplication across pagination boundaries.",
  category: "high-level-design",
  subcategory: "social-engagement",
  slug: "infinite-scrolling-feed",
  wordCount: 4900,
  readingTime: 30,
  lastUpdated: "2026-05-11",
  tags: ["hld", "infinite-scroll", "feed", "ranking", "virtual-list", "cursor-pagination", "windowing"],
  relatedTopics: ["instagram-twitter-frontend", "user-profile-follower-system"],
};

export default function InfiniteScrollingFeedArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>An infinite scrolling feed is the primary content surface for social platforms, news aggregators, and content discovery apps. Unlike traditional pagination (where the user explicitly navigates to page 2, 3, etc.), infinite scroll requires seamlessly appending content as the user approaches the bottom of the list, with no visible interruption. The engineering challenges are significant: the DOM cannot hold thousands of rendered post elements without causing browser performance degradation (scrolling jank, high memory usage). A feed with 500 loaded posts has 500 DOM subtrees in memory — the browser must lay out, paint, and composite all of them on every scroll event.</p>
        <p>Content ranking introduces a specific pagination complexity. Unlike chronological feeds where the cursor is simply a timestamp, ranked feeds order posts by a score (engagement rate + recency + personalization signal). When the ranking model re-scores posts between page fetches (a common occurrence for ML-based feeds that refresh rankings every 5–10 minutes), the cursor pointing to a specific post may land in a different position on the next page, causing posts to repeat or be skipped. Designing a cursor that is stable across re-rankings is a key server-side constraint that directly affects the client.</p>
        <p><strong>Explicit scope:</strong> Feed rendering performance (virtual windowing), cursor pagination design for ranked feeds, new-content injection, scroll position restoration, and pull-to-refresh. Not in scope: the ranking algorithm itself or the feed assembly service.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Infinite scroll:</strong> Feed loads the first 20 posts. As the user scrolls to 80% of loaded content, the next 20 posts are fetched and appended. No "next page" button required, but a "Load more" fallback appears if automatic loading fails.</li>
          <li><strong>Ranked content:</strong> Posts are ordered by a relevance score (not pure chronological order). The ranking score may change between page fetches, but the user should not see duplicates or missing posts due to re-ranking between pages.</li>
          <li><strong>New content indicator:</strong> When new posts arrive while the user is scrolling, a "N new posts — tap to refresh" badge appears at the top. Tapping it injects the new posts at the top and scrolls to the top. New posts do not push content down while the user is actively scrolling (layout shift).</li>
          <li><strong>Virtual windowing:</strong> Only 20–30 posts are rendered in the DOM at any time, regardless of how far the user has scrolled. Posts that have scrolled far out of view are unmounted from the DOM but their vertical space is maintained via placeholder divs to preserve scroll position.</li>
          <li><strong>Pull-to-refresh:</strong> On mobile, pulling down at the top of the feed triggers a full feed refresh (new ranking snapshot). Debounced to 2 seconds minimum between refreshes.</li>
          <li><strong>Scroll restoration:</strong> If the user navigates to a post detail and returns, the feed scrolls back to the previously viewed post position without refetching all content.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Scroll performance:</strong> Feed scrolls at 60 fps on mid-range Android devices. No visible jank when new items are appended. DOM element count stays below 150 regardless of scroll depth.</li>
          <li><strong>Memory footprint:</strong> Total feed memory usage stays below 200 MB on mobile (images evicted from memory for far-off-screen items).</li>
          <li><strong>No duplicates:</strong> The same post must not appear twice in the feed regardless of ranking changes between page fetches.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The feed is a React component backed by React Query's useInfiniteQuery for paginated data management. The virtual windowing layer (react-virtual or a custom implementation) maintains a fixed render window of ~25 items, unmounting items that scroll far out of the window and replacing them with height-preserving placeholder divs. The Feed API uses a composite cursor that encodes both the last item's rank score and a snapshot ID (the timestamp when the current ranking snapshot was taken). The snapshot ID freezes the ranking used for pagination — all subsequent pages use the same ranking snapshot until the user explicitly refreshes, preventing duplicates from re-ranking. New content detection runs via SSE or short-poll (30-second interval), showing a badge rather than auto-injecting to prevent layout disruption.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/social-engagement/infinite-scrolling-feed.svg"
          alt="Infinite scrolling feed architecture showing cursor pagination design (initial load: GET /api/feed cursor=null → Feed Service creates ranking snapshot snapId=abc123 stores in Redis 10min TTL; returns posts[0..19] + cursor={snapId:abc123, lastScore:0.87, lastPostId:p19}; page 2: GET /api/feed cursor={…} → Feed Service uses same snapId ranking snapshot → no duplicates from re-rank; cursor encodes snapshot not position), virtual list windowing (total loaded posts: N; render window: posts[i-3..i+22] where i=first visible; posts outside window: unmounted + height placeholder div; IntersectionObserver sentinel at 80% → fetchNextPage; virtual rows: absolute positioned or transform:translateY; window slides as user scrolls; DOM count: max 25 items), new content injection (SSE /api/feed/new-posts-count polls 30s; count badge 'N new posts' at top; user taps → prepend new posts + scroll to top; no auto-inject while scrolling; layout shift guard: inject only when scrollY=0), pull to refresh (touch: touchstart touchmove touchend; delta Y &gt; 60px from top → trigger refresh; spinner animation during fetch; debounce 2s minimum; new snapshot created snapId=xyz456; feed reset), scroll restoration (on navigate-to-post: save {scrollY, loadedPostIds[]} to sessionStorage; on back-navigate: restore feed state from cache → scroll to saved position without refetch; React Query queryCache persists between navigations), deduplication guard (new page returns: filter out postIds already in seenPostIds Set; seenPostIds grows with each page; prevents edge case where snapId TTL expired mid-session), feed skeleton (first load: 3 skeleton cards animate shimmer; per-item: blurhash placeholder for media; text lines: 2 grey rounded rects; LCP: first real post within 1.5s)."
          caption="Composite cursor (snapshot ID + rank score → no duplicates on re-rank), virtual DOM windowing (max 25 items rendered, height placeholders preserve scroll), new-content badge (no auto-inject while scrolling), pull-to-refresh (debounced 2s), scroll restoration via sessionStorage, deduplication Set across page boundaries"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Rank-Stable Cursor Design</h3>
        <p>The naive approach to ranked feed pagination is to use the last item&apos;s score as the cursor: fetch next page where score &lt; lastScore. This breaks when the ranking model updates between page 1 and page 2: posts that scored above lastScore on page 1 may now score below it, causing them to appear on page 2 as well (duplicates). The rank-stable cursor encodes a snapshot ID: on the first feed request, the Feed Service computes the ranked feed and writes the ordered post IDs to a Redis sorted set (feed_snapshot:{"{userId}"}:{"{snapId}"}) with a 10-minute TTL. The cursor returned to the client is {"{ snapId: \"abc123\", offset: 20 }"}. All subsequent page requests for this session use the same snapshot: fetch post IDs from ZRANGE feed_snapshot:{"{userId}"}:{"{snapId}"} offset 20 BY RANK LIMIT 20. Because the post IDs are ordered by their rank at snapshot time and never change for this session, pages are perfectly stable. The TTL ensures stale snapshots are cleaned up. When the user pulls to refresh, a new snapshot is created with fresh rankings.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Virtual List Windowing</h3>
        <p>Virtual list windowing maintains a small render window (typically 25 items) regardless of how many items have been loaded. The implementation maintains two data structures: an items array (all loaded post data, never cleared) and a renderWindow (the range [startIndex, endIndex] of items currently in the DOM). As the user scrolls down, renderWindow advances: startIndex increases, endIndex increases. Items below startIndex are replaced with height-preserving placeholder divs (the placeholder div height equals the unmounted item's measured height, stored in a heights Map after first render). This preserves the scrollable height of the container so the scrollbar position remains accurate even for items not in the DOM. Items above endIndex (not yet loaded) use estimated heights (average post height * count). The IntersectionObserver sentinel element fires at 80% of current content to trigger fetchNextPage. A second sentinel at the top detects when the user scrolls back up far enough that items near startIndex need to re-enter the render window.</p>
        <p>Variable height handling is the trickiest aspect of virtual lists for social feeds: posts vary significantly in height (text-only vs. multi-image carousel vs. video). The virtual list measures each item's height after mount using a ResizeObserver and updates the heights Map. Height estimates for not-yet-rendered items use a rolling average of measured heights. Accumulated error (if estimated heights are consistently wrong) causes the scrollbar to jump when items are replaced with accurately-measured heights; this is mitigated by using the median measured height as the estimate (median is more robust to outliers than mean for social post heights, where viral posts with long comment threads skew the average).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">New Content Detection and Injection</h3>
        <p>The feed uses a 30-second poll to GET /api/feed/new-count?after={"{firstPostId}"}&amp;snapId={"{currentSnapId}"} to check for new posts published after the first post in the current snapshot. If count &gt; 0, a sticky badge appears at the top of the feed: &quot;5 new posts, tap to see&quot;. The badge does not auto-inject because injecting content while the user is mid-scroll would shift all existing content down, causing a layout shift that throws off the user&apos;s reading position. Auto-injection is only safe when scrollY === 0 (the user is at the top of the feed and hasn&apos;t scrolled). When the user taps the badge: (1) a new snapshot is fetched (creating a new snapId), (2) the new posts are prepended to the items array, (3) the render window is moved to [0, 25], and (4) the container scrolls to the top. The transition from the old content to the new content is smooth because the items array merge is instant and the scroll animation takes 300ms.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Scroll Restoration on Back Navigation</h3>
        <p>When the user taps a post to navigate to the detail view and then taps the back button, they expect to return to the exact scroll position in the feed, not start over from the top. Native browser scroll restoration (history.scrollRestoration = &apos;auto&apos;) works for simple pages but fails for virtual lists because the unmounted items no longer have DOM nodes for the browser to scroll to. The solution: before navigating to the post detail, serialize the current feed state to sessionStorage: {"{ snapId, loadedPostIds: [...], scrollY, firstVisibleIndex }"}. On back-navigation (detected via the popstate event or React Router&apos;s useEffect on the feed route), the feed initializes from the sessionStorage state instead of fetching from scratch. React Query&apos;s queryCache already has the loaded pages cached (they&apos;re not evicted during navigation), so hydration from cache is instant. The virtual list is initialized with firstVisibleIndex, and window.scrollTo(0, savedScrollY) is called after the render. The result: the user returns to the exact post they were reading, with the correct scroll position, in under 100ms.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Cross-Page Deduplication</h3>
        <p>Even with snapshot-based cursors, edge cases can cause duplicate post IDs across pages: the snapshot TTL expires mid-session and a new snapshot is used for a subsequent page, or the server falls back from the snapshot to a live query when the snapshot is unavailable. To guard against this, the client maintains a seenPostIds Set that grows with each page fetched. Before appending new page results to the items array, each returned post ID is checked against seenPostIds: items already in the set are filtered out. This deduplication is O(1) per post ID lookup. The seenPostIds Set is cleared on pull-to-refresh (a new session begins). This client-side deduplication is a safety net, not the primary mechanism — the snapshot cursor is the first line of defense.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Virtual windowing versus full DOM rendering: for short feeds (&lt;100 items), the complexity of virtual windowing is not justified — full DOM rendering is simpler and performs adequately. Virtual windowing becomes necessary when users scroll deeply (hundreds of items) or on lower-end mobile devices where DOM memory is constrained. The breakeven point for most social feeds is around 50–100 loaded items: below that, full DOM rendering is fine; above that, windowing is necessary for smooth scrolling and memory safety.</p>
        <p>Snapshot cursor versus keyset pagination: snapshot cursors are more complex to implement (Redis sorted set management, TTL cleanup) but guarantee no duplicates for ranked feeds. Keyset pagination (cursor = last item's score) is simpler but produces duplicates when rankings change. For chronological feeds (no ranking), keyset pagination with a timestamp cursor is perfectly stable — snapshot cursors are only necessary when ranking scores are dynamic. The choice between them should be based on whether the feed is ranked: use keyset for chronological, snapshot for ranked.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>An infinite scrolling feed with ranking requires three non-obvious design decisions. First, rank-stable cursors: the cursor encodes a snapshot ID (Redis sorted set of post IDs frozen at request time with 10-minute TTL) rather than a live score, preventing duplicates when rankings update between pages. Second, virtual DOM windowing: only 25 items are in the DOM at any time; scrolled-out items are replaced with height-preserving placeholders (measured by ResizeObserver, cached in heights Map) to maintain scroll fidelity with &lt;150 DOM nodes. Third, new-content injection without layout shift: new posts are shown as a badge ("N new posts — tap to see") and only injected when the user taps, never auto-pushed during active scrolling. Scroll restoration uses sessionStorage to cache feed state across navigation, restoring position from React Query's cache in &lt;100ms. Cross-page deduplication uses a client-side seenPostIds Set as a safety net. The core performance constraint: 60 fps scrolling on mid-range Android requires DOM node count to stay bounded — this alone justifies virtual windowing for any feed that users scroll more than 50 items deep.</p>
      </section>
    </ArticleLayout>
  );
}
