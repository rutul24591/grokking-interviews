"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-social-media-stories-reels",
  title: "Design a Social Media Stories/Reels Feature",
  description:
    "Architecture for stories and short-form video: upload pipeline, CDN delivery, viewer state tracking, pre-fetching, expiration, and engagement analytics.",
  category: "high-level-design",
  subcategory: "core-product-systems",
  slug: "social-media-stories-reels-feature",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-10",
  tags: ["hld", "stories", "reels", "short-video", "CDN", "pre-fetching", "HLS"],
  relatedTopics: ["frontend-for-a-social-media-news-feed", "music-audio-streaming-frontend"],
};

export default function SocialMediaStoriesReelsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>Stories (24-hour ephemeral content) and Reels (short-form video, typically 15–90 seconds, non-expiring) share a common UX paradigm: sequential, full-screen viewing with swipe navigation. The user experience expectation—that swiping to the next story or reel triggers instant playback—drives the core technical requirement: content must be pre-fetched and buffered before the user navigates to it. A reel that requires two seconds to start playing after a swipe is an experience failure; the entire format is designed for instant, continuous consumption.</p>
        <p>The distinction between Stories and Reels has technical implications: stories expire after 24 hours (requiring expiration logic, cleanup pipelines, and viewer tracking that gates access before expiry), while Reels are permanent content in a ranked feed (requiring ranking, recommendation, and engagement analytics at news feed scale). Both formats require the same media pipeline (upload, transcoding, CDN distribution) and the same playback pipeline (HLS streaming, pre-fetching, pause-on-background), but differ in their discovery and lifecycle management systems.</p>
        <p><strong>Explicit assumptions:</strong> Maximum story/reel duration: 60 seconds for stories, 90 seconds for reels. Input formats: any mobile video format (H.264 MP4, HEVC). Output: HLS segments in multiple quality levels (480p, 720p, 1080p). Stories expire 24 hours after creation. Reels are ranked and surfaced in a dedicated tab. Viewer tracking records who has viewed each story (visible to the creator). The frontend handles both the stories carousel (horizontal swipe within a user's story collection) and the reels feed (vertical swipe between different creators' reels).</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Creation:</strong> Record video in-app or upload from camera roll. Apply filters, add text overlays, music tracks, and stickers. Preview before posting.</li>
          <li><strong>Stories carousel:</strong> Horizontal strip at the top of the feed showing followed users' story avatars. Tapping opens the full-screen story viewer, cycling through all of a user's stories before auto-advancing to the next followed user's stories.</li>
          <li><strong>Reels feed:</strong> Vertical-swipe feed of algorithmically ranked short videos. Autoplay when visible, pause when scrolled away.</li>
          <li><strong>Viewer tracking (stories):</strong> Track who viewed each story. Creator can see the viewer list. Viewers are not notified that the creator can see them. Viewer data expires with the story.</li>
          <li><strong>Story expiration:</strong> Stories expire 24 hours after creation. The story is removed from all carousels and the creator's story archive is updated.</li>
          <li><strong>Engagement:</strong> Reactions (emoji reactions to stories), replies (DM to creator), shares, saves. Like and comment on reels.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Playback start time:</strong> First frame of a story/reel visible within 300ms of the user opening the viewer. (Pre-fetching makes this possible.)</li>
          <li><strong>Swipe-to-next latency:</strong> The next story/reel begins playing within 200ms of the swipe gesture completing.</li>
          <li><strong>Upload processing time:</strong> User's story is available to followers within 30 seconds of creation.</li>
          <li><strong>Scale:</strong> Instagram-class: 500 million stories viewed per day, 1 billion reels plays per day.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The architecture has three layers. The creation pipeline: mobile app captures video → uploads raw video to an S3 upload bucket → triggers a transcoding pipeline (MediaConvert or FFmpeg workers) → produces HLS outputs at multiple quality levels → distributes via CDN → updates the story/reel record as available. The delivery layer: a Story API returns the ordered list of stories for a user's feed with CDN URLs for each story's HLS manifest; the client pre-fetches the HLS manifests and first segments of upcoming stories before the user reaches them. The interaction layer: viewer tracking (write-intensive during viral events), reaction and comment processing, and engagement analytics aggregation.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/social-media-stories-reels-feature-architecture.svg"
          alt="Stories/Reels architecture showing creation pipeline (upload → transcoding → HLS output → CDN), story carousel with pre-fetching (HLS manifest + first 3 segments of next 2 stories always buffered), vertical reels feed with IntersectionObserver-based autoplay, viewer tracking write path (Redis incr + async DB persist), story expiration pipeline (24-hour TTL cleanup), and reels ranking service."
          caption="Stories/Reels architecture: upload pipeline, HLS CDN delivery, carousel pre-fetching, viewer tracking, and reels ranking feed"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Upload and Transcoding Pipeline</h3>
        <p>Raw video from the mobile app is uploaded directly to an S3 upload bucket using pre-signed URLs (same pattern as the large file upload system, though story videos are short enough—under 60 seconds—that multipart upload is rarely needed; a simple PUT to a pre-signed URL suffices). The upload triggers an S3 event notification that queues a transcoding job. The transcoding pipeline produces: HLS segments at 480p, 720p, and 1080p (each quality level producing 2-second segments), a thumbnail image (first frame or a keyframe at 1 second), and a preview GIF (a 5-frame GIF for use in thumbnails that auto-animate in the carousel). Transcoding time target: under 20 seconds for a 60-second input video.</p>
        <p>The story record in the database transitions through states: uploading → processing → available. The mobile app polls the Story API for the story's status after upload; when available, it shows the story in the user's own profile and broadcasts to followers (via their story feed cache update). The polling interval is 2 seconds for the first 30 seconds, then backs off to 5 seconds. Alternatively, a WebSocket push notification can deliver the "story available" event to the creator's app, eliminating polling.</p>
        <p>Content moderation runs concurrently with transcoding: the video is analyzed by a computer vision model (detecting NSFW content, hate symbols, violence) and flagged for human review if the model's confidence score exceeds a threshold. Videos that are auto-removed (high-confidence violations) are marked as removed before becoming available; the creator is notified. Videos pending review are made available after transcoding (to minimize creator wait time) but are proactively moderated within 2–4 hours of posting if flagged.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pre-fetching Strategy for Instant Playback</h3>
        <p>The story/reel viewer pre-fetches content for upcoming items before the user swipes to them. The pre-fetching heuristic: always have the HLS manifest and the first 3 segments (6 seconds of video at 480p) of the next 2 stories/reels buffered. When the user is viewing story N, story N+1 and N+2 are being fetched in the background. When the user swipes to N+1, playback begins immediately from the pre-buffered data; the player simultaneously fetches segments N+1[4..] (the remaining segments of the current story) and begins pre-buffering N+3.</p>
        <p>Pre-fetching uses the browser's fetch() API with cache: 'force-cache' for segments that are likely to be needed (next 2 items) and cache: 'no-store' for items further ahead (pre-fetching items 5+ ahead wastes bandwidth if the user swipes back or exits). The browser's HTTP cache holds pre-fetched segments; when the player requests them, they are served from cache with negligible latency. Service Workers can be used for more aggressive pre-fetching control, but the browser's HTTP cache is sufficient for this pre-fetch depth.</p>
        <p>Quality selection for pre-fetching: pre-fetch at the lower quality level (480p) to minimize bandwidth consumption, then upgrade to higher quality when the item is actually playing. The 480p segments serve as the instant-start content; the 720p or 1080p segments replace them as the player buffers further ahead. This matches the observed behavior of Instagram Reels: first frame appears quickly at lower quality, then visibly sharpens within the first second of playback.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Story Viewer State and Expiration</h3>
        <p>Story viewer state tracks which users have viewed each story. The data model: a view event has (storyId, viewerId, viewedAt). For popular stories (millions of views), writing a view event per view requires a write-optimized path. The viewer tracking write path: view events are written to a Redis sorted set (keyed by storyId, member = viewerId, score = viewedAt timestamp) for fast read access (creator queries viewer list sorted by time) and simultaneously batched and written to a database for durability. The Redis sorted set enables the creator to query recent viewers (ZREVRANGEBYSCORE with a LIMIT) without scanning the entire viewer list.</p>
        <p>Story expiration is implemented as a two-phase cleanup. Phase 1 (at the 24-hour mark): a scheduled job marks the story as expired in the database and removes it from all follower story feed caches. Phase 2 (7 days later): a cleanup job deletes the story's CDN-cached HLS segments and thumbnails, and deletes the viewer tracking data. The two-phase approach allows a grace period for creator archive access (the creator can see their own expired stories in their profile archive for 7 days before permanent deletion), while immediately preventing the story from appearing in followers' feeds. CDN cache invalidation at expiration uses Cloudfront invalidation paths or a CDN-level TTL (story segment URLs include a short TTL that causes CDN caches to expire after 25 hours, slightly after the story expires).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Reels Ranking and Feed</h3>
        <p>The Reels feed is algorithmically ranked: each user sees a personalized sequence of short videos based on their engagement history (which reels they watched fully, liked, shared, or commented on), the content's engagement rate (likes, watch-through rate across all viewers), and the recency of the content. The ranking model runs server-side and produces a ranked list of reelIds for each user. The Reels API returns pages of ranked reelIds with their CDN URLs; the client pre-fetches content as described above.</p>
        <p>Watch-through rate is a particularly important engagement signal: a reel watched to completion (or multiple times) indicates higher quality than one skipped after 1 second. The client reports watch events: (reelId, userId, watchDurationMs, percentageWatched). This telemetry drives the ranking model. Watch events are sent via sendBeacon() when the user swipes away from a reel, ensuring the event is delivered even if the user closes the app immediately after swipe. Partial watches (under 50% of duration) count less in the engagement signal than full watches.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">HLS Playback and Video Player Architecture</h3>
        <p>HLS (HTTP Live Streaming) is the universal streaming format for mobile video. The HLS manifest (a .m3u8 file) lists the available quality level manifests; each quality-level manifest lists the individual segment URLs (.ts files, typically 2–6 seconds each). The browser's native video element supports HLS on Safari (iOS and macOS) natively. Chrome and other browsers require hls.js, a JavaScript library that implements the HLS client using MSE. The video player component abstracts this: on Safari, it sets video.src to the HLS manifest URL; on Chrome, it initializes hls.js and attaches it to the video element.</p>
        <p>Autoplay behavior in the stories carousel: the current story autoplays; tapping pauses; holding pauses (for the "hold to pause" gesture). In the reels feed, the reel autoplays when it enters the viewport (IntersectionObserver threshold: 0.5) and pauses when it exits. Only one video plays at a time: entering a new reel's viewport calls pause() on the previous reel's video element before calling play() on the new one. Muted autoplay is allowed by all browsers; unmuted autoplay requires user interaction (the user tapping an unmute button on the current reel). The muted state is persisted in localStorage so a user who unmuted once does not need to unmute on every reel.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/social-media-stories-reels-feature-prefetch.svg"
          alt="Stories pre-fetch strategy showing viewer position at story N, active pre-fetch of N+1 (HLS manifest + first 3 segments at 480p), background pre-fetch of N+2 (manifest only), quality upgrade path (480p instant → 720p buffered), viewer tracking Redis write path, and story expiration two-phase cleanup (24h mark → expiry + cache invalidation, 7d → segment deletion)"
          caption="Stories pre-fetch: always buffer next 2 stories, quality upgrade during playback, Redis viewer tracking, and two-phase expiration cleanup"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>HLS segment duration: shorter segments (2 seconds) reduce time-to-first-frame (only 2 seconds of data needed to start) but increase the number of HTTP requests (a 60-second story requires 30 segment requests for one quality level). Longer segments (6 seconds) reduce request count but increase the time before the first frame can appear. The industry standard for short-form video is 2–4 second segments, which balances startup latency against request overhead. For very short content (10-second stories), a single segment is appropriate—the entire story is one HTTP request.</p>
        <p>Story expiration consistency: when a story expires at exactly the 24-hour mark, followers in different time zones may see the story disappear at different times depending on their local story feed cache TTL. The story feed cache (Redis) has a short TTL (60 seconds); after expiration, the story is not returned in the feed API response. From the user's perspective, the story disappears "sometime around 24 hours"—the exact second of expiration is not visible to followers. Only the creator can see an exact expiration timer in their own story UI. This eventual consistency in the expiration experience is acceptable; the cost of precise real-time expiration (invalidating millions of cached feed entries simultaneously) outweighs the benefit.</p>
        <p>Pre-fetching bandwidth cost: always pre-fetching the next 2 stories consumes bandwidth even for stories the user never views (if they exit the viewer before swiping twice). For users on limited mobile data, this pre-fetching can be wasteful. A "data saver" mode disables pre-fetching (loading each story on demand) at the cost of swipe latency. This mode is implemented by respecting the navigator.connection.saveData API (which browsers expose if the user has enabled "Data Saver" in their device settings) to automatically disable pre-fetching on metered connections.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A stories/reels feature is built on three technical foundations: a fast upload and transcoding pipeline (direct S3 upload → MediaConvert → HLS output in under 30 seconds), aggressive pre-fetching for instant swipe navigation (always pre-buffer HLS manifest + first 6 seconds at 480p for the next 2 items), and efficient engagement telemetry (watch-through rate via sendBeacon, viewer tracking via Redis sorted sets). Stories use a two-phase expiration (immediate feed removal at 24 hours, segment deletion at 31 days). Reels use an algorithmic ranking model fed by watch-through rate signals. HLS delivery abstracts over native Safari support and hls.js for Chrome. Autoplay is controlled by IntersectionObserver in the reels feed and by the carousel position in the stories viewer. The defining performance requirement is that swiping to the next story must trigger playback within 200ms—pre-fetching is the only technical approach that can meet this latency target on a mobile network.</p>
      </section>
    </ArticleLayout>
  );
}
