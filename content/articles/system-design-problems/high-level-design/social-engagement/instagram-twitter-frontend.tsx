"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-instagram-twitter-frontend",
  title: "Design Instagram / Twitter Frontend",
  description:
    "Architecture for a social media frontend: feed rendering strategy (ISR + client hydration), media upload pipeline with presigned S3 URLs, infinite scroll with cursor-based pagination, story/reel playback with HLS adaptive streaming, real-time like/comment counts via WebSocket, optimistic UI for interactions, CDN image delivery with responsive srcsets, and client-side engagement tracking.",
  category: "high-level-design",
  subcategory: "social-engagement",
  slug: "instagram-twitter-frontend",
  wordCount: 5200,
  readingTime: 32,
  lastUpdated: "2026-05-11",
  tags: ["hld", "social-media", "instagram", "twitter", "feed", "stories", "media-upload", "websocket", "cdn"],
  relatedTopics: ["infinite-scrolling-feed", "notification-system-ui"],
};

export default function InstagramTwitterFrontendArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>Instagram and Twitter (now X) are canonical examples of content-heavy social platforms with fundamentally different rendering demands than e-commerce or SaaS products. The feed is the core surface: it is personalized per user (cannot be globally cached), refreshed frequently (new content every few minutes), and media-heavy (each post contains one or more images or videos). These three constraints force a specific rendering architecture: the page shell is statically served, but the feed itself is always fetched client-side because it is personalized and time-sensitive.</p>
        <p>The second major challenge is media at scale. When a user with 10 million followers posts a photo, that photo must be accessible from CDN nodes worldwide within seconds, rendered at multiple resolutions (thumbnail, feed, fullscreen), and loaded with appropriate quality for the user's network conditions. The upload pipeline must handle images and videos, process them asynchronously (compression, format conversion, thumbnail generation), and make processed assets available via CDN before the post is visible to followers.</p>
        <p>The third challenge is engagement state: likes, comments, bookmarks, and follows must reflect real-time counts and the current user's own interaction state (did I already like this post?). These are highly personalized and cannot be cached globally. They must be loaded with the feed content and updated live as other users interact.</p>
        <p><strong>Explicit scope:</strong> Feed rendering, media upload pipeline, story/reel playback, real-time engagement counts, and the post composer. Not in scope: the ranking algorithm, ML-based content moderation, or advertising systems.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Feed:</strong> Paginated feed of posts from followed accounts and algorithmic recommendations. Each post shows media (image/video), caption, like/comment/share counts, and the current user's interaction state (liked, bookmarked). Feed is real-time: new posts appear without full page reload (either via pull-to-refresh or live push).</li>
          <li><strong>Post creation:</strong> Upload photo or video, add caption, tag users, add location. Image upload via presigned S3 URL (direct browser-to-S3, no proxy through app server). Video upload with progress indicator. Post visible after media processing completes (async; user notified when live).</li>
          <li><strong>Stories / Reels:</strong> Full-screen vertical media format with auto-advance. Stories expire after 24 hours. Reels use HLS adaptive bitrate streaming for variable network conditions. Progress bar per story segment.</li>
          <li><strong>Real-time engagement:</strong> Like, comment, share, and bookmark. Like count updates in real time across all viewers of the same post. Optimistic UI: like animation plays immediately on tap, count increments locally, server confirms asynchronously.</li>
          <li><strong>Notifications:</strong> In-app badge for new likes, comments, follows. Push notification for direct mentions and DMs. Notification panel with read/unread state.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Feed load time:</strong> First feed content visible within 1.5 seconds on 4G. Images lazy-loaded; above-fold images preloaded.</li>
          <li><strong>Media upload throughput:</strong> 100MB video upload completes within 60 seconds on a 20 Mbps connection (no server-side proxy bottleneck).</li>
          <li><strong>Engagement update latency:</strong> Like/comment counts reflect changes within 3 seconds of another user's interaction on the same post.</li>
          <li><strong>CDN offload:</strong> &gt;95% of image and video requests served from CDN edge, not origin. Origin serves only cache misses and dynamic API responses.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The frontend is a React SPA with a static shell served from CDN. On load, the shell hydrates and immediately fetches the personalized feed from the Feed API. The Feed API returns cursor-paginated posts enriched with the current user's engagement state (liked, bookmarked) fetched from the Engagement Service. Media URLs in feed items point to CDN-hosted processed assets (multiple resolutions). The Post Composer uploads media directly to S3 via presigned URLs, then submits a post creation request with the S3 object key. A Media Processing Service (triggered by S3 event) converts, compresses, and generates thumbnails asynchronously, writing processed asset URLs back to the Post record. Real-time engagement counts are pushed via WebSocket from an Engagement Fan-out Service that consumes Kafka events from the Interaction Service.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/social-engagement/instagram-twitter-frontend.svg"
          alt="Instagram/Twitter frontend architecture showing feed rendering flow (React SPA shell from CDN; GET /api/feed cursor=null → Feed Service → Engagement Service join → Redis feed:{userId} cache; cursor pagination: next_cursor in response; infinite scroll trigger at 80% scroll depth; above-fold images preload rel=preload; lazy load below fold), media upload pipeline (POST /api/upload/presign → S3 presigned URL; browser PUT direct to S3 100MB no proxy; S3 event → Media Processing Lambda: resize to 320/640/1080px WebP + AVIF; video → HLS segments; write processed URLs to posts DB; CDN cache-control: max-age=31536000 immutable), story and reel playback (HLS.js adaptive bitrate: start 360p → probe bandwidth → switch to 720p/1080p; prefetch next story segment; progress bar per segment TTL 24h; auto-advance 5s per story; Reels: vertical video loop; preload adjacent reels buffer), real-time engagement (WebSocket /ws/engagement; Interaction Service → Kafka interactions topic → Fan-out Service → Redis pub/sub post:{postId} → WebSocket server → all clients viewing post; optimistic: like animation immediate local count+1 → POST /api/like → 200 confirm or rollback; like count badge update within 3s), CDN image delivery (srcset: 320w 640w 1080w; sizes: 100vw md:50vw; loading=lazy except first 3 posts; blurhash placeholder while loading; AVIF with WebP fallback), post composer (caption rich text: @mention autocomplete users API; hashtag detection; location picker geolocation API; video upload: tus resumable upload protocol; progress bar; post status: DRAFT → PROCESSING → LIVE)."
          caption="Feed rendering (cursor-paginated, Redis-cached, engagement-enriched), direct S3 media upload (presigned URL, no proxy), HLS adaptive Reels playback, WebSocket real-time like/comment counts (optimistic UI), CDN multi-resolution image delivery, and post composer with resumable video upload"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Feed Rendering and Cursor Pagination</h3>
        <p>The feed is never server-side rendered with user-specific content because it is fully personalized and changes every few minutes, SSR would require bypassing all CDN caches for every request. Instead, the page shell (header, navigation, composer button) is statically served from CDN. On hydration, a useEffect fires GET /api/feed?cursor=null&amp;limit=20. The Feed Service queries the user&apos;s personalized ranked feed from its internal feed cache (Redis sorted set: feed:{"{userId}"} ordered by ranking score), enriches each post with the current user&apos;s engagement state (did this user like this post, did they bookmark it) by batching lookups against the Engagement Service, and returns the enriched posts with a next_cursor (the ID of the last returned post). The cursor is opaque to the client, it encodes the position in the feed and the timestamp of the last refresh, allowing the server to resume from exactly where pagination left off without re-querying everything.</p>
        <p>Infinite scroll trigger: an IntersectionObserver watches a sentinel element 80% of the way down the feed. When the sentinel enters the viewport, a fetchNextPage() call is triggered with the current cursor. The response is appended to the feed (React Query's useInfiniteQuery manages the paginated state). To prevent layout shifts when new items load, the feed container has a fixed-height placeholder for the loading skeleton, which transitions into real content when the fetch resolves.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Media Upload Pipeline</h3>
        <p>Routing image uploads through the application server creates a bandwidth and cost bottleneck: a 10 MB photo upload consumes 10 MB of server ingress bandwidth, and a 100 MB video upload would time out most HTTP proxies. The solution is direct browser-to-S3 upload via presigned URLs. The upload flow: (1) The browser sends POST /api/upload/presign with the file metadata (type, size, checksum). The API server calls S3&apos;s presignPost() to generate a short-lived (15-minute TTL) presigned upload URL and returns it to the browser. (2) The browser uploads the file directly to S3 using the presigned URL, the app server is not in the data path. (3) S3 fires an s3:ObjectCreated event to a Lambda (or SQS-triggered worker). (4) The Media Processing worker: for images, generates 320w/640w/1080w WebP and AVIF versions. For videos, encodes HLS segments (360p, 720p, 1080p) using FFmpeg and generates a poster thumbnail. Processed assets are written to the CDN origin bucket. The processed asset URLs are written to the posts database. (5) The client polls GET /api/posts/{"{draftId}"}/status until the status is LIVE, then redirects to the post page.</p>
        <p>For large video uploads, the tus protocol (resumable upload standard) is used instead of a single PUT. tus allows uploads to be resumed after network interruptions, which is critical for mobile users uploading 100MB+ videos on cellular networks. The tus server (running on the upload service) handles chunk management and ultimately assembles the file in S3.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Stories and Reels Playback</h3>
        <p>Stories are short-lived (24-hour TTL), image-or-video full-screen overlays. The story viewer component preloads the next story's media while the current story is playing, using link rel="preload" for images and a hidden video element with preload="auto" for videos. Each story shows a progress bar segment; the segment fills over the story's duration (5 seconds for images, video duration for videos). Auto-advance fires when the segment completes or when the user taps the right side of the screen.</p>
        <p>Reels use HLS adaptive bitrate streaming via hls.js. The video starts at the lowest quality tier (360p) to minimize initial buffering, then hls.js probes the available bandwidth and switches to the appropriate tier (720p or 1080p). This is critical for users on variable mobile networks. The Reels feed prefetches the next 2 reels' HLS manifests and the first few segments of each, so swipe transitions are instant rather than showing a loading spinner. The prefetch budget is capped at 20 MB to avoid excess data consumption on metered connections (detected via navigator.connection.saveData).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Real-Time Engagement Counts</h3>
        <p>When a user opens a post detail view or a post is visible in the feed, the client subscribes to WebSocket channel post:{"{postId}"} for live engagement updates. The subscription is managed client-side: when the post component mounts, it sends a subscribe message; when it unmounts (scrolled out of view or navigated away), it sends an unsubscribe. The WebSocket server subscribes to the corresponding Redis Pub/Sub channel. When another user likes the post, the Interaction Service writes the like to the database, publishes a LikeCreated event to Kafka, a fan-out consumer reads the event and publishes to Redis channel post:{"{postId}"}, and all connected WebSocket clients receive the updated count within 2–3 seconds.</p>
        <p>Optimistic UI for likes: when the user taps the heart icon, the like animation plays immediately and the local like count increments by 1 — before the POST /api/interactions/like request returns. If the server returns an error (e.g., the user had already liked the post via another device), the UI reverts: the animation plays in reverse and the count decrements. This pattern (immediate feedback, async server confirmation) makes interactions feel instant even on high-latency mobile connections.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">CDN Image Delivery with Responsive Srcsets</h3>
        <p>Every image in the feed is served via CDN with a responsive srcset pointing to the three resolution variants generated during media processing: &lt;img srcset=&quot;cdn.example.com/posts/{"{id}"}_320w.webp 320w, cdn.example.com/posts/{"{id}"}_640w.webp 640w, cdn.example.com/posts/{"{id}"}_1080w.webp 1080w&quot; sizes=&quot;(max-width: 768px) 100vw, 50vw&quot; loading=&quot;lazy&quot; decoding=&quot;async&quot;/&gt;. The browser selects the appropriate variant based on the device&apos;s pixel density and the rendered image width. On a 1x display with a 640px-wide feed column, the browser requests the 640w variant. On a 3x display (high-DPI iPhone), the browser requests the 1080w variant even for a 360px column. AVIF is served with WebP fallback via &lt;picture&gt; element: AVIF reduces file size by 50% versus WebP for equivalent quality, but requires browser support checking. The Cache-Control header for processed media assets is max-age=31536000, immutable, the URL includes a content hash, so cache invalidation is not needed; updated images get new URLs.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Blurhash Placeholders and Perceived Performance</h3>
        <p>Each post in the feed API response includes a blurhash string — a compact (~30-byte) Base83-encoded representation of the image's color palette and rough structure. The client renders a decoded blurhash as a blurred placeholder &lt;canvas&gt; element while the actual image loads. This eliminates the jarring "blank white box then image pop" experience of lazy loading. The blurhash is generated server-side during media processing and stored in the post record — no client computation required. The placeholder transitions to the real image via a CSS opacity transition once the image load event fires, providing a smooth fade-in. The transition takes 200ms to avoid flash on fast connections while still being perceptible on slow ones.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>WebSocket versus polling for engagement counts: WebSocket delivers sub-second engagement updates and enables the real-time "10K people liked this" experience that social platforms use to drive engagement. However, maintaining persistent WebSocket connections for every open post in the feed is expensive at scale — a user scrolling through 50 posts would hold 50 channel subscriptions. The subscription management strategy (subscribe only to in-viewport posts, unsubscribe on scroll) keeps the subscription count bounded. An alternative is long-polling (30-second intervals): cheaper to operate, but engagement counts lag by up to 30 seconds, which damages the live-social-activity feeling. For the home feed (where many posts are visible simultaneously), a hybrid is appropriate: WebSocket subscriptions for the currently-viewed post detail, polling for feed-level counts.</p>
        <p>Optimistic versus conservative UI for likes: optimistic UI (instant animation, async confirm) feels fast but can show incorrect counts if the server rejects the interaction (duplicate like, rate limiting). Most social platforms accept this occasional inconsistency because the rejection rate is low (&lt;1% of interactions) and the perceived performance benefit is high. A conservative UI (wait for server confirmation before showing the animation) is safer but makes interactions feel sluggish on mobile networks. The design described above uses optimistic UI with rollback on failure — the optimal trade-off for social interaction patterns.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>An Instagram/Twitter-style frontend uses a static shell with client-side feed fetching (cursor-paginated, engagement-enriched, Redis-cached on the server) to handle fully personalized, frequently-updated content without sacrificing CDN performance for the page shell. Media uploads bypass the app server entirely via presigned S3 URLs; processing (resize, HLS encoding, AVIF conversion) runs asynchronously with status polling. Reels use HLS adaptive bitrate streaming (hls.js auto-quality), prefetching the next 2 reels to enable instant swipe transitions. Engagement counts are pushed via WebSocket (subscribe on post-in-viewport, unsubscribe on scroll-out), with optimistic UI for likes (instant animation, async confirmation, rollback on error). CDN image delivery uses responsive srcsets (320w/640w/1080w WebP/AVIF) with blurhash placeholders to eliminate blank-box loading states. The core design insight: for social platforms, perceived responsiveness of interactions (likes, comments) drives engagement more than any other latency metric — optimistic UI with rollback is always the right trade-off for social interaction patterns.</p>
      </section>
    </ArticleLayout>
  );
}
