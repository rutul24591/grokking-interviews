"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-youtube-search-recommendation-ui",
  title: "Design YouTube Search + Recommendation UI",
  description:
    "Architecture for a YouTube-like search and recommendation UI: search results page with video cards (thumbnail, duration badge, view count, channel avatar), recommendation sidebar on watch page, next-video autoplay with countdown, homepage feed personalization, search filter chips (upload date, duration, type, features, sort), thumbnail hover-to-preview, channel subscription signal integration into recommendations, trending/explore tab, and watch history influence on ranking.",
  category: "high-level-design",
  subcategory: "search-discovery-systems",
  slug: "youtube-search-recommendation-ui",
  wordCount: 5000,
  readingTime: 31,
  lastUpdated: "2026-05-11",
  tags: ["hld", "youtube", "search", "recommendations", "video", "personalization", "autoplay", "feed"],
  relatedTopics: ["google-like-search-frontend", "faceted-search-large-datasets"],
};

export default function YouTubeSearchRecommendationUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>YouTube's search and recommendation system is the engine that drives 70% of watch time — the majority of videos watched on YouTube are discovered through the recommendation sidebar and homepage feed, not through intentional search. The frontend of this system must seamlessly blend two discovery modes: pull (the user types a query and browses results) and push (the system proactively surfaces videos the user is likely to enjoy). The design challenge is that these two modes must feel cohesive — the recommendation sidebar on the watch page must feel like a natural continuation of what the user is watching, not a random interruption.</p>
        <p>The performance challenge is specific to video content: video thumbnails are large images that must be delivered efficiently (lazy-loaded, responsive srcset, WebP format). Thumbnail hover-to-preview (the GIF-like preview that appears when you hover a thumbnail on desktop) adds another dimension — each preview is a sequence of frames extracted from the video that must be loaded on hover without blocking the main thread. The autoplay countdown is a UX challenge: it must give the user clear control (cancel the autoplay) while the default behavior drives engagement through seamless continuous viewing.</p>
        <p><strong>Explicit scope:</strong> Search results page, video card components, watch page recommendation sidebar, homepage feed, autoplay countdown, and search filter UI. Not in scope: video transcoding pipeline, ad insertion, or live streaming infrastructure.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Search results:</strong> Query submission navigates to /results?search_query={`{q}`}. Results are a vertical list of video cards on desktop (thumbnail left, metadata right) and a grid on mobile. Each card: thumbnail (with duration badge), video title (2-line truncated), channel name + verification badge, view count + upload date (relative: "2 days ago"), and a three-dot menu for "Save to playlist", "Not interested", "Share".</li>
          <li><strong>Search filters:</strong> Horizontal filter chips below the search bar: Upload date (Any, Last hour, Today, This week, This month, This year), Type (Video, Channel, Playlist, Movie), Duration (Under 4 min, 4–20 min, Over 20 min), Features (Live, 4K, HD, Subtitles, Creative Commons), Sort by (Relevance, Upload date, View count, Rating). Active filters are shown with a filled chip; clicking removes the filter.</li>
          <li><strong>Recommendation sidebar:</strong> On the watch page, a scrollable list of 20+ recommended video cards in the right column. Cards are smaller (thumbnail + title + channel + view count). Sidebar recommendations update based on the currently playing video and the user's watch history. Infinite scroll loads more recommendations.</li>
          <li><strong>Autoplay:</strong> When the current video ends, a 5-second countdown overlay appears showing the next recommended video (title + thumbnail). The user can click the video to play immediately or dismiss the overlay to cancel autoplay. A progress ring counts down visually. Autoplay can be toggled off via a switch in the player controls.</li>
          <li><strong>Homepage feed:</strong> Personalized grid of video cards on the homepage. Categories chips at the top (All, Music, Gaming, News, Sports, Coding, etc.) filter the feed. Videos watched before show a progress bar on the thumbnail (resumable). Channel subscriptions are surfaced prominently.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Search latency:</strong> Search results render within 800ms of query submission. Autocomplete suggestions within 100ms of keystroke.</li>
          <li><strong>Thumbnail loading:</strong> Above-the-fold thumbnails load within 1 second. Below-the-fold thumbnails are lazy-loaded with IntersectionObserver. Hover-preview loads within 200ms of hover start.</li>
          <li><strong>Feed freshness:</strong> Homepage feed personalization reflects watch history from the last session within 30 seconds of a watch event (near-real-time recommendations).</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The search results and recommendation feed are both rendered client-side after an SSR shell loads (the page shell — header, search bar, sidebar navigation — is SSR; the results grid is CSR to enable fast transitions between search queries without full page reloads). The Search Service returns ranked video metadata (videoId, title, thumbnailUrl, duration, channelId, channelName, viewCount, uploadDate, description snippet). The Recommendation Service returns personalized video IDs with scores for the current context (homepage, watch page sidebar, autoplay next). Thumbnail images are served from a CDN with multiple sizes (320px, 480px, 640px) as WebP with JPEG fallback, using srcset for responsive delivery. Hover-preview images are a sprite sheet (a vertical strip of frames sampled every 10 seconds from the video) served from a dedicated URL (thumbnail.ytimg.com/vi/{`{videoId}`}/storyboard.jpg) and loaded on first hover with a JavaScript parser that slices the sprite into the hover animation.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/search-discovery-systems/youtube-search-recommendation-ui.svg"
          alt="YouTube search and recommendation UI architecture showing search flow (searchbox: debounce 80ms → GET /api/autocomplete; submit → navigate /results?search_query={q}&sp={filters}; Search Service: BM25 + personalization ranking; return video metadata array; CSR render: video cards grid/list; filter chips → append &sp= param → re-fetch), video card component (thumbnail: img srcset 320/480/640 WebP + JPEG fallback; IntersectionObserver lazy-load; duration badge: absolute positioned pill; hover-preview: mousenter delay 300ms → fetch sprite sheet → slice frames → requestAnimationFrame loop; metadata: title 2-line truncated; channel avatar + name + verify badge; view count humanized '1.2M views'; relative date '3 days ago'; three-dot menu: Save Not-interested Share Report), watch page recommendation sidebar (GET /api/recommendations?videoId={id}&context=sidebar; personalized ranking: collaborative filtering + content similarity + watch history; 20 cards initial + IntersectionObserver infinite scroll; sidebar cards: compact layout thumbnail+metadata; click → navigate /watch?v={id} → sidebar refreshes for new video), autoplay system (video end event → fetch next video metadata; show countdown overlay: {nextVideo.thumbnail} + title + 5s progress ring; requestAnimationFrame ring animation; click video → play immediately; dismiss → cancel; toggle switch → localStorage autoplay=false; next video preload: link rel=preload href={nextVideoSrc} as=video during countdown), homepage feed (GET /api/feed?context=home&page={cursor}; category chips: active filter → re-fetch; video cards 2-4 col grid responsive; watch progress: video.watchProgress bar overlay {0-100}%; subscription videos: channeled section header; IntersectionObserver load more; view event: POST /api/watch-events → recommendation model update async), search filters (sp param encoding: Upload date|Type|Duration|Features|Sort; chip toggle: append/remove sp token; URL update pushState; active filters: highlighted chip; clear all: remove sp param), thumbnail CDN (ytimg.com/vi/{id}/{quality}.jpg; sizes: mqdefault hqdefault maxresdefault; WebP: ytimg.com/vi/{id}/hq720.webp; srcset for responsive; loading=lazy for below-fold)."
          caption="CSR search results (video cards with srcset thumbnails, IntersectionObserver lazy-load, sprite-sheet hover-preview), filter chips (&amp;sp= URL param), watch page sidebar (collaborative filtering recommendations, infinite scroll), autoplay countdown overlay (progress ring, preload next video), homepage personalized feed (category chips, watch-progress overlays, subscription sections), and sp-encoded URL filter state"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Video Card Component</h3>
        <p>The video card is the fundamental unit of the search and recommendation UI. It exists in two sizes: large (search results, homepage grid — thumbnail on left or top, full metadata on right) and compact (sidebar recommendations — small thumbnail, 2-line title, channel name, view count). The thumbnail is an &lt;img&gt; element with srcset (320w, 480w, 640w) and sizes attribute to serve the appropriate resolution. Below the fold, thumbnails have loading="lazy" for native lazy loading, supplemented by an IntersectionObserver for older browsers. The duration badge is an absolutely-positioned pill (dark background, white text) overlaid on the bottom-right of the thumbnail.</p>
        <p>Hover-to-preview: on mouseenter (with a 300ms delay to prevent accidental triggers during scroll), a fetch request downloads the storyboard sprite sheet for the video (a single JPEG image containing 100+ frames sampled every 10 seconds from the video timeline). A JavaScript parser reads the sprite metadata (frame count, frame dimensions, sprite URL) and begins a requestAnimationFrame loop that cycles through frames by manipulating the CSS background-position of a div overlaid on the thumbnail. The animation runs at approximately 3 fps. On mouseleave, the animation stops and the original thumbnail is restored. The sprite sheet is cached in the browser's HTTP cache, so subsequent hovers on the same video are instant.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Search Filter System</h3>
        <p>YouTube's search filters are encoded as a protobuf-like parameter in the URL (&sp=). Each filter combination maps to a specific parameter value. The frontend maintains a filter state object &#123; uploadDate, type, duration, features, sortBy &#125; and encodes it to the &sp= parameter on each filter change. Filter chips are rendered from this state: an active chip has a filled background, an inactive chip has an outlined border. Clicking an active chip removes the filter; clicking an inactive chip applies it and may remove conflicting filters (e.g., selecting "Live" as a feature removes "Duration" filters since live videos are undefined duration). The filter chip bar scrolls horizontally on mobile to accommodate all filter options without wrapping.</p>
        <p>Filter application: when a chip is toggled, the URL is updated (window.history.pushState) and a new search request is fired with the updated &sp= value. The results list is replaced with a skeleton loader (matching the height of the previous results to prevent layout shift) while the new results load. The filter state is derived from the URL on page load, making filtered search results sharable via URL.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Recommendation Sidebar and Personalization</h3>
        <p>The watch page recommendation sidebar is the most algorithmically complex component. The Recommendation Service takes as input: the currently playing videoId, the user's watch history (last 50 videos, from the server), the user's subscription list, and contextual signals (time of day, device type). It returns a ranked list of recommended videoIds with their metadata. The ranking uses a two-stage model: (1) candidate generation (retrieve 500 candidates using collaborative filtering — "users who watched this video also watched...") and (2) ranking (score each candidate on predicted watch time, satisfaction, and diversity). The frontend receives the top 20 ranked results and renders them in the sidebar. Infinite scroll loads additional recommendations (GET /api/recommendations?videoId={`{id}`}&page=2) as the user scrolls down the sidebar.</p>
        <p>The sidebar updates when the video changes: navigating to a new watch URL updates the videoId, which triggers a new recommendation request. The sidebar renders with the new results, but to avoid jarring layout replacement, the new cards fade in (CSS opacity transition) while the previous cards fade out. If the user has watched a recommended video before, a "Watched" indicator appears on the thumbnail (a partially-filled progress bar at the bottom of the thumbnail, derived from the user's watch history stored in the client-side store).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Autoplay Countdown UX</h3>
        <p>The autoplay system must balance engagement (keeping users watching) with respect for user intent (making it easy to stop). The countdown overlay appears when the video ends (or 5 seconds before the end if the user has autoplay enabled). The overlay shows: the next video's thumbnail (large, taking most of the overlay area), the next video's title, the channel name, and a circular progress ring that completes over 5 seconds. The ring is implemented as an SVG &lt;circle&gt; element with a stroke-dashoffset animation driven by requestAnimationFrame. During the countdown, the next video's data is preloaded: a &lt;link rel="preload" as="video" href={`{nextVideoUrl}`}&gt; element is injected into the document head, and the video player is primed with the next video's manifest URL so playback can start within milliseconds when the countdown completes.</p>
        <p>The "Cancel" button (X icon) in the top-right of the overlay dismisses the countdown and prevents autoplay for the current session (stored in sessionStorage). An "Autoplay is on" toggle switch in the player controls allows the user to permanently disable autoplay (stored in localStorage and synced to their account settings if logged in). When autoplay fires, the transition between videos uses a crossfade: the video player volume briefly ramps down, the next video begins playing, and the player element transitions to the new video without a page navigation — the URL updates via history.pushState, and the sidebar refreshes with recommendations for the new video.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Homepage Feed and Category Chips</h3>
        <p>The homepage feed is a personalized grid of video cards fetched from the Recommendation Service with context=home. Category chips at the top (All, Music, Gaming, News, Sports, etc.) are a client-side filter applied to a broader set of recommendations — clicking a chip re-requests the feed with the category parameter, not a client-side filter on the already-loaded results. This ensures that the category filter is applied at the ranking level (gaming videos are not just filtered from general results, they are actively ranked by their gaming-specific engagement signals). The chip bar scrolls horizontally with scroll-snap to align chips to the left edge of the container.</p>
        <p>Watch progress overlays: the client maintains a watchProgress map ({`{videoId: percentage}`}) in Zustand, populated from the watch history API on load and updated in real time as the user watches. Each video card checks this map and renders a colored progress bar at the bottom of the thumbnail if watchProgress[videoId] is between 5% and 95%. Videos at &gt;95% are shown with a "Watched" badge instead of a progress bar. This gives the homepage a "pick up where you left off" feel without requiring the user to navigate to a separate history page.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Autoplay opt-out versus opt-in: setting autoplay as the default (opt-out) maximizes watch time but can feel coercive — users may end up watching unintended content. Regulatory pressure (especially in the EU under DSA requirements for recommendation systems) increasingly favors opt-in autoplay. The design tension: opt-in autoplay means the user must explicitly enable it, which reduces engagement metrics but increases trust. Most platforms compromise with a prominent, easy-to-find toggle that is on by default for logged-in users but off for logged-out users.</p>
        <p>Infinite scroll versus pagination for search results: YouTube uses infinite scroll for search results (more results load as you scroll), which maximizes result exploration depth. However, infinite scroll makes it impossible to navigate back to a specific position in the results — hitting the browser's Back button after clicking a result returns you to the top of the page, not your previous scroll position. YouTube partially addresses this by storing the scroll position in sessionStorage and restoring it on Back navigation. Pagination (with numbered pages) makes position explicit and shareable but feels more effortful for exploration.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A YouTube-like search and recommendation UI combines two discovery modes: pull (search with filter chips encoding filter state in URL ?sp= parameter) and push (personalized recommendation sidebar on watch page + homepage feed). Video cards use srcset thumbnails (WebP/JPEG, 320–640px), native lazy loading, and sprite-sheet hover-preview (requestAnimationFrame frame cycling from a storyboard JPEG). The watch page sidebar uses a two-stage recommendation model (collaborative filtering candidate generation + ranking by predicted watch time); sidebar updates on video navigation with crossfade transitions. Autoplay countdown uses an SVG progress ring with next-video preloading during the 5-second window; autoplay state is persisted in localStorage/account settings. The homepage feed uses category chips for server-side filtering (not client-side) and renders watch-progress overlays from a client-side watchProgress map. The core design insight: YouTube's UI must make the next video feel like the obvious and effortless choice — every component (sidebar ordering, autoplay countdown, watch-progress overlays) is engineered to reduce friction in the path from one video to the next.</p>
      </section>
    </ArticleLayout>
  );
}
