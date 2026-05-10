"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-frontend-social-media-news-feed",
  title: "Design the Frontend for a Social Media News Feed",
  description:
    "End-to-end frontend architecture for a high-scale news feed: ranking, pagination, real-time updates, optimistic interactions, and performance at billions of impressions.",
  category: "high-level-design",
  subcategory: "core-product-systems",
  slug: "frontend-for-a-social-media-news-feed",
  wordCount: 5800,
  readingTime: 35,
  lastUpdated: "2026-05-10",
  tags: ["hld", "news-feed", "social-media", "pagination", "real-time", "performance"],
  relatedTopics: ["personalized-homepage-feed-system", "activity-feed-system"],
};

export default function SocialMediaNewsFeedArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A social media news feed is deceptively complex. The surface area—a scrollable list of posts—conceals a system that must solve ranking, real-time delivery, infinite pagination, optimistic interactions, media loading, and personalization simultaneously, all while maintaining 60 fps scroll performance across low-end Android devices. The feed is the product's primary engagement surface; every millisecond of latency and every layout shift directly translates to engagement loss.</p>
        <p>The frontend is not a passive renderer of server data—it is an active participant in feed quality. It manages a local cache that must stay coherent as new posts arrive via WebSocket, as the user likes and comments (optimistic updates), and as the user scrolls past the bottom of the current page (pagination). It must gracefully handle the feed going stale (the user returns after 30 minutes and the feed has changed), handle poor network conditions, and degrade gracefully when the ranking service is slow.</p>
        <p><strong>Explicit assumptions:</strong> Scale is Facebook/Twitter-class (hundreds of millions of daily active users). The feed is algorithmically ranked (not strictly chronological), with a re-ranking service that runs server-side. The frontend fetches paginated feed pages (cursor-based, 20 posts per page). New posts can arrive in real-time via WebSocket for followed users. Media (images, videos) is separately CDN-hosted. The frontend must support web (React SPA), iOS, and Android—this article focuses on the web frontend architecture with notes on cross-platform considerations.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Feed rendering:</strong> Display an algorithmically ranked list of posts (text, images, videos, links) with infinite scroll pagination.</li>
          <li><strong>Real-time updates:</strong> New posts from followed users arrive via WebSocket and are presented as a "N new posts" banner (not auto-injected, to avoid layout disruption).</li>
          <li><strong>Interactions:</strong> Like, comment, share, save, and follow. All interactions must be optimistic (instant UI update) with server confirmation and revert on failure.</li>
          <li><strong>Feed refresh:</strong> Pull-to-refresh on mobile, a "Refresh" button on desktop, and automatic stale feed detection (if the user has been idle for 10+ minutes, show a banner).</li>
          <li><strong>Stories/Reels carousel:</strong> A horizontally scrollable strip at the top of the feed showing stories from followed users.</li>
          <li><strong>Ad insertion:</strong> Sponsored posts are inserted at server-defined positions in the feed response. The frontend must render ads in the correct position and fire impression events.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Time to first post:</strong> The first feed post should be visible within 1.5 seconds on a median mobile device on 4G.</li>
          <li><strong>Scroll performance:</strong> 60 fps during scroll on mid-range Android devices. No layout shifts during image load.</li>
          <li><strong>Memory efficiency:</strong> Long feed sessions (100+ posts loaded) must not degrade performance. DOM virtualization required beyond the initial viewport.</li>
          <li><strong>Offline resilience:</strong> If the network drops during scroll, the user continues to browse already-loaded posts. The retry mechanism handles pagination failures silently.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The feed frontend is structured around three concerns: data fetching and cache management, rendering and virtualization, and real-time synchronization. Each concern is independent; changes to the ranking algorithm or the WebSocket protocol do not require rewriting the virtualization layer.</p>
        <p>The data layer uses a normalized cache (React Query or Apollo Client) where each post is stored by its postId, and the feed is a list of postIds with associated cursor metadata. Normalization means that when a WebSocket event updates a post's like count, the single entry in the cache is updated and all UI components rendering that post re-render automatically, without the feed needing to know anything about the update. The rendering layer uses a virtual list (react-virtual or a custom implementation) that only renders DOM nodes for posts within and near the viewport, discarding nodes for posts scrolled far out of view. Real-time synchronization is handled by a WebSocket connection manager that maintains the connection, handles reconnection with exponential backoff, and routes incoming events (new posts, interaction updates) to the appropriate cache entries.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/frontend-for-a-social-media-news-feed-architecture.svg"
          alt="News feed frontend architecture showing normalized post cache, virtual list renderer, WebSocket event router, cursor-based pagination, CDN media loading, and optimistic interaction layer"
          caption="News feed architecture: normalized cache at center, virtual list for scroll performance, WebSocket for real-time updates, cursor pagination for infinite scroll"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cursor-Based Pagination and Feed State</h3>
        <p>The feed API returns a page of posts plus a nextCursor token. The cursor is an opaque server-generated value encoding the ranking state at the time of the request (not a simple timestamp or offset, because the ranking may change between requests). On infinite scroll trigger (user within 500px of the end), the frontend requests the next page using the stored cursor. The response merges into the existing post list; duplicate posts (from ranking changes between page fetches) are deduplicated by postId client-side.</p>
        <p>The feed state model stores: an ordered array of postIds representing the current feed view, a map from postId to post data (the normalized store), the current nextCursor, whether a page fetch is in flight, and whether more pages are available (server signals exhaustion with nextCursor: null). This separation of the ordered list from the data store is critical: when a WebSocket event updates a post's data, only the post store entry changes—the ordered list is unaffected, and the virtual list's scroll position does not shift.</p>
        <p>Feed freshness is tracked by recording the timestamp of the last fetch. A background timer checks this every 60 seconds. If the feed is more than 10 minutes old and the user has been idle (no scroll or interaction), a "Your feed may be out of date. Refresh?" banner appears at the top. Tapping it clears the current feed and fetches a fresh first page, resetting the cursor. This avoids the jarring experience of auto-refreshing a feed mid-scroll.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Virtual List and Scroll Performance</h3>
        <p>A naive implementation renders all loaded posts as DOM nodes. At 100 posts with images, this creates thousands of DOM nodes, hundreds of media elements, and significant memory pressure. Virtual list rendering (windowing) maintains only the DOM nodes for posts within a buffer around the viewport—typically the viewport plus 1–2 screen heights above and below. Posts scrolled out of the buffer zone are unmounted from the DOM; their data remains in the normalized store.</p>
        <p>The challenge with social feeds is variable post height: text-only posts are short, posts with images or embedded videos are tall, and height is not known until content is rendered. The virtual list must handle dynamic heights. The approach: measure each post's height after it renders and cache it; on subsequent renders of the same postId, use the cached height for layout calculations. For the initial render of unseen posts, use an estimated height (the average observed height, typically ~250px) and correct after measurement. Height correction causes a brief layout shift—mitigated by keeping the viewport anchor point on the post at the top of the visible area rather than at an absolute scroll position, so the visible content stays still while content above adjusts.</p>
        <p>Images must have explicit width and height attributes (or aspect-ratio CSS) set before load. Without this, the browser does not know how much space to reserve, causing layout shifts as images load (CLS—Cumulative Layout Shift). For user-generated images with unknown dimensions, the server stores image dimensions in the post metadata; the frontend uses the stored aspect ratio to set a correct placeholder before the image loads.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Optimistic Interactions</h3>
        <p>Likes, comments, and shares must feel instant. The user taps Like; the heart turns red immediately, the like count increments, and the mutation request fires in the background. If the server returns success, the optimistic state is confirmed. If the server returns an error, the optimistic state is reverted (heart back to unfilled, count decremented) and a toast notification appears: "Couldn't process your like. Try again." The user never waits for a network round trip to see their action reflected.</p>
        <p>Optimistic updates require the UI to differentiate confirmed state from speculative state. The normalized post store includes a pendingInteractions field per post: a set of interaction types currently in flight. The UI renders the post as if the interactions have succeeded while they are pending. When the server confirms, the post's canonical interaction state (likes, likesCount) is updated and the pending flag is cleared. When the server rejects, the pending flag is cleared and the canonical state is not updated. This two-state model prevents the common bug where a user rapidly double-taps Like: the second tap would see the already-incremented speculative count, result in a confusing double increment, or, in simpler implementations, the first mutation's success callback overwrites the second mutation's optimistic state.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Real-Time Updates via WebSocket</h3>
        <p>A WebSocket connection to the feed delivery service receives three event types: new-post (a new post from a followed user), interaction-update (like count, comment count changes on visible posts), and deletion (a post has been removed). The connection is established when the feed page mounts and maintained with ping/pong keepalives. On connection drop, the client reconnects with exponential backoff (1s, 2s, 4s, 8s, max 30s).</p>
        <p>New posts received via WebSocket are not auto-injected into the feed scroll position, because injecting content at the top would push the user's current scroll position down, breaking context. Instead, the client increments a counter and shows a banner: "3 new posts." Tapping the banner scrolls the user to the top, triggers a fresh feed fetch, and replaces the current feed with the new content. This is the Twitter/X and Instagram approach—it respects the user's reading context while surfacing that fresh content exists.</p>
        <p>Interaction updates (like counts changing on visible posts) are applied immediately to the normalized cache. Because many users may like the same viral post simultaneously, the server sends delta updates (likesCount delta: +47 in the last second) rather than absolute counts, to avoid count discrepancies from stale snapshots. The frontend applies the delta to the current local count.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Media Loading and Lazy Loading</h3>
        <p>Every image in the feed uses native lazy loading (loading="lazy") or an IntersectionObserver-based custom implementation for browsers that need finer control. Images more than two screen heights below the viewport are not requested. As the user scrolls toward an image, it begins loading when it is one screen height away, so it is typically ready by the time it enters the viewport. This dramatically reduces initial page data transfer (a user who only reads the first 3 posts should not download images for posts 50–100).</p>
        <p>Video in the feed uses a more aggressive strategy: autoplay is disabled for off-screen videos. When a video enters the viewport and the user has not opted out of autoplay, it begins playing muted. The IntersectionObserver fires when the video is &gt;50% visible. When the video exits the viewport, it pauses. Only one video plays at a time; entering a new video's viewport pauses any currently playing video. This matches the behavior of TikTok and Instagram Reels in the main feed. For the full-screen Reels view, a dedicated pre-loading strategy is used: the next reel begins buffering while the current one is playing, so the swipe transition is instant.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Impression Tracking and Analytics</h3>
        <p>Advertising standards require that an impression is counted only when the ad has been at least 50% visible for at least one continuous second. The frontend uses an IntersectionObserver with threshold: 0.5 per ad unit. When the threshold is crossed, a timer starts; if the ad remains 50%+ visible for 1000ms, an impression event fires. If the user scrolls past quickly, the timer is cancelled and no impression is recorded. This logic runs for all ad posts in the feed; organic post view events follow a similar pattern (50% visible for 300ms counts as a feed item view for engagement analytics).</p>
        <p>Impression events are batched and sent via navigator.sendBeacon() on a 5-second flush interval and on page unload. Beacon delivery is fire-and-forget but guaranteed to be sent even when the page is closing. The event payload includes postId, adId (for sponsored posts), userId, sessionId, viewport position, and timestamp. This telemetry drives the feed ranking model, the ad billing system, and the engagement metrics dashboards.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/frontend-for-a-social-media-news-feed-workflow.svg"
          alt="News feed data flow showing initial load sequence, cursor pagination trigger on scroll, WebSocket new-post event handling with banner notification, optimistic like interaction with server confirmation and revert path, and impression tracking event batching"
          caption="Feed data flow: initial load → cursor pagination → real-time WebSocket updates → optimistic interactions → impression analytics pipeline"
        />
      </section>

      <section>
        <h2>Scaling Considerations</h2>
        <p>At hundreds of millions of daily active users, the feed API is the highest-traffic endpoint in the system. Each user loads a fresh feed on app open (mobile app) or tab focus (web), and then paginates as they scroll. The frontend's contribution to scaling is minimizing unnecessary API calls: the stale feed detection (10-minute threshold) prevents re-fetching when the user briefly switches tabs; the cursor-based pagination avoids offset queries that degrade at high page numbers; and the normalized cache prevents re-fetching post data that was already received as part of a previous page.</p>
        <p>The feed API should support conditional requests (ETag / If-None-Match). If the user's feed cursor and ranking state have not changed since the last fetch, the server returns 304 Not Modified and the client uses its cached data. This is particularly effective for users who refresh the feed frequently but whose social graph is small (not many new posts to show).</p>
        <p>CDN caching for the feed API is limited because feeds are personalized—each user's feed is unique. However, the individual post data (text, metadata, interaction counts) can be cached at the CDN edge if the post endpoint is separate from the feed ordering endpoint. The feed ordering endpoint (which postIds to show, in which order) must be personalized and cannot be CDN-cached, but the post content endpoint (given these postIds, return their content) can use CDN caching with a short TTL, since many users may see the same viral post in their feeds simultaneously.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Chronological versus algorithmic feed: a chronological feed is trivial to implement (sort by createdAt) and trivially paginated. An algorithmic feed requires a ranking model, is expensive to compute, and has complex pagination semantics (the cursor must encode ranking state, not just position). The trade-off is engagement: algorithmic feeds consistently show higher session duration and content engagement because the ranking model surfaces content the user is likely to find interesting, while chronological feeds are fairer to all creators but show lower overall engagement. Most production social platforms have moved to algorithmic feeds for their primary surface.</p>
        <p>Virtual list versus full DOM rendering: virtual lists dramatically improve performance for long sessions but add complexity: every component rendered in the list must be pure (same props → same output, no side effects that depend on DOM persistence), because list items are mounted and unmounted as the user scrolls. Stateful components (video players with playback position, expanded comment sections) must store their state externally (in the normalized cache or a separate React context) rather than in component-local useState, or their state is lost when the component unmounts during virtualization. This is a significant architectural constraint that must be established early.</p>
        <p>WebSocket versus polling: WebSocket provides true real-time delivery but requires maintaining a persistent TCP connection per client. At hundreds of millions of concurrent users, this represents an enormous number of long-lived connections. The Server-Sent Events (SSE) alternative is one-directional (server to client), which is sufficient for feed updates but requires the client to send interactions via separate HTTP requests. Long polling is the most server-friendly option but adds latency (typically 1–30 second delay depending on polling interval). Most large social platforms use a hybrid: WebSocket for very active users (those currently interacting) and SSE or push notifications for background updates.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A social media news feed frontend is built around four pillars: a normalized post cache with cursor-based pagination (enabling infinite scroll without offset query degradation), a virtual list renderer with dynamic height measurement (enabling 60fps scroll on low-end devices with hundreds of loaded posts), a WebSocket real-time layer with new-post banners rather than auto-injection (respecting user reading context), and optimistic interactions with confirmed-versus-speculative state modeling (instant UI with graceful failure handling). Impression tracking uses IntersectionObserver with minimum-visibility timers for ad compliance. The scaling strategy separates the personalized feed ordering endpoint (no CDN cache) from the post content endpoint (CDN-cacheable with short TTL). The defining performance constraint is that the first post must be visible within 1.5 seconds, which drives server-side rendering of the initial feed page and lazy loading of everything below the fold.</p>
      </section>
    </ArticleLayout>
  );
}
