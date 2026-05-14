"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-viral-sharing-engagement",
  title: "Design a Viral Sharing & Engagement System",
  description:
    "Architecture for a viral sharing and engagement system: share sheet with deep link generation, Open Graph meta tag rendering for rich link previews, viral coefficient tracking and K-factor analytics, referral attribution with UTM and fingerprinting, engagement loop design (streak mechanics, social proof triggers), share count display with approximate HyperLogLog counting, viral content detection and CDN pre-warming, and A/B testing share CTAs.",
  category: "high-level-design",
  subcategory: "social-engagement",
  slug: "viral-sharing-engagement",
  wordCount: 5000,
  readingTime: 30,
  lastUpdated: "2026-05-11",
  tags: ["hld", "viral", "sharing", "deep-links", "open-graph", "referral", "engagement", "k-factor"],
  relatedTopics: ["content-moderation-reporting-ui", "notification-system-ui"],
};

export default function ViralSharingEngagementArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">Viral sharing is the mechanism by which existing users bring new users to a platform — each share is a potential acquisition event. A viral sharing system has two responsibilities: making sharing frictionless (reducing the effort required for a user to share content) and making the shared experience compelling (ensuring the recipient gets a rich, context-full preview of what they are about to open). The sharing infrastructure spans multiple surfaces: the native share sheet on mobile (iOS Share API, Android Intents), link previews on messaging apps (WhatsApp, iMessage, Slack) and social platforms (Twitter, Facebook), deep links that open the app directly to the shared content, and referral attribution that connects incoming users to the friend who shared with them.</HighlightBlock>
        <p>The engagement system refers to the mechanics that drive users to interact more deeply with the platform: social proof signals ("1,200 people are viewing this"), streak mechanics (consecutive daily login rewards), and virality coefficient tracking (measuring K-factor: if K &gt; 1, the user base grows exponentially without paid acquisition). The frontend is responsible for rendering these signals at the right moment and in the right way to drive the desired behavior without feeling manipulative. Dark patterns (fake urgency, misleading "low stock" signals) erode long-term trust; honest engagement mechanics reinforce genuine value.</p>
        <p><strong>Explicit scope:</strong> Share sheet and deep link generation, Open Graph meta tags for link previews, referral attribution pipeline, share count display, and social proof signals. Not in scope: the referral reward system (cash/credits), fraud detection on referrals, or viral coefficient analytics (K-factor).</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Share sheet:</strong> One-tap share button on posts, profiles, and content pages. Share sheet shows: copy link, share to Instagram/Twitter/WhatsApp, download image. Shared link contains a tracking parameter (ref=userId+contentId) for attribution.</li>
          <li><strong>Rich link previews:</strong> Shared URLs display rich previews in messaging apps and social platforms: title, description, and preview image (post image or generated OG image). Preview is generated server-side for each unique URL and cached. Dynamic OG images for user-generated content (profile cards, post previews with branding overlay).</li>
          <li><strong>Deep linking:</strong> Shared links open the native app directly to the shared content on iOS and Android. If the app is not installed, the link opens the web version, records the referral, and shows an app install prompt. On app install, deferred deep link routes the user to the original shared content.</li>
          <li><strong>Referral attribution:</strong> Track which user's share led to a new user registration. Attribution window: 7 days (last touch). Store referring user ID with new user's account. Both referrer and referred receive rewards on referral completion.</li>
          <li><strong>Social proof signals:</strong> "N people shared this," "M people are viewing this right now" (approximate), and "Trending in [category]" badges on high-engagement content. Share count displayed on posts; live viewer count on viral content.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>OG image generation:</strong> OG preview image rendered and cached within 2 seconds of a new URL being shared for the first time. Subsequent shares of the same URL served from cache in &lt;50ms.</li>
          <li><strong>Deep link resolution:</strong> App-install deep link (deferred deep link) resolves to the correct content within 10 seconds of app install completion.</li>
          <li><strong>Share count freshness:</strong> Share counts update within 60 seconds of new shares. Approximate counts (HyperLogLog, ±1%) are acceptable for display.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <HighlightBlock as="p" tier="important">The sharing system has two main pipelines. The Link Generation Pipeline produces shareable URLs with embedded tracking parameters, generates OG metadata for link previews, and serves dynamically generated OG images from a Puppeteer-based screenshot service with Redis-backed caching. The Attribution Pipeline tracks shares as events (share.created Kafka), records link clicks (click.recorded), and joins click events to registration events within the attribution window to assign referral credit. Real-time share counts and viewer counts are maintained as Redis HyperLogLog structures (PFADD/PFCOUNT) with a 30-second polling refresh on the client side.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/social-engagement/viral-sharing-engagement.svg"
          alt="Viral sharing and engagement system architecture showing share link generation (POST /api/share {contentId} → generate shortlink with ref param: s.app/{code}?ref={userId}_{contentId}; store in short_links table; Kafka share.created event; return {shortUrl, ogImageUrl}), OG image generation (GET /{path} → meta tags renderer: &lt;meta og:title /&gt; &lt;meta og:image /&gt; &lt;meta og:description /&gt;; og:image URL → OG Image Service: check Redis og:{contentId} cache; hit: return URL; miss: Puppeteer headless render card template → screenshot PNG → S3 upload → cache URL TTL 24h; render &lt;2s), deep link flow (iOS Universal Link / Android App Link: AASA file at /.well-known/apple-app-site-association; tap shared link → if app installed: open app to content; if not installed: app store + deferred deep link: store {contentId ref} in fingerprint DB; on app open POST /api/deep-link/resolve {deviceFingerprint} → return {contentId} navigate), referral attribution (click on shared link → record click_events: {shortCode refUserId visitorId timestamp}; visitorId cookie 7 days; on registration: JOIN click_events WHERE visitorId=newUser AND timestamp &gt; now-7d ORDER BY timestamp DESC LIMIT 1; assign referring_user_id to new account; Kafka referral.attributed event → reward service), share count display (PFADD shares:{contentId} {userId} on each share; PFCOUNT shares:{contentId} → ~0.81% error; client polls GET /api/content/{id}/stats every 60s; display: '1.2K shares'; live viewer count: PFADD viewers:{contentId} {sessionId} TTL 5min), social proof triggers (trending badge: share velocity &gt; 100/min last 5min; 'N people viewing': PFCOUNT viewers:{contentId}; update 30s SSE; intentional floor rounding: 47 → shown as '40+'; viral content detection: share velocity threshold → pre-warm CDN edge nodes for content), A/B test share CTA (experiment: button text 'Share' vs 'Spread the word' vs 'Tell a friend'; metric: share_button_click / impressions; Statsig or LaunchDarkly flag per session; result stored analytics)."
          caption="Share link with ref tracking → OG image generation (Puppeteer + Redis cache, &lt;2s), Universal Link / App Link deep link flow with deferred deep link fingerprinting, referral attribution (7-day last-touch cookie join), share counts via HyperLogLog (PFADD/PFCOUNT ±0.81%), viral detection (share velocity threshold → CDN pre-warm), and A/B tested share CTAs"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Share Sheet and Link Generation</h3>
        <HighlightBlock as="p" tier="important">When the user taps the share button, the Share API generates a short URL with an embedded tracking parameter. The shortlink format is s.example.com/{"{code}"}?ref={"{userId}"}_{"{contentId}"}; the ref parameter contains both the sharing user&apos;s ID and the content ID for attribution. The shortlink is stored in the short_links table (code, originalUrl, refUserId, contentId, createdAt, clickCount). On GET s.example.com/{"{code}"}, the server: (1) records the click in the click_events table, (2) checks for a ?ref parameter and stores it in a cookie (attribution_ref={"{ref}"}, 7-day TTL), (3) redirects to the canonical content URL. The canonical URL resolves on the web app, which reads the attribution_ref cookie and holds it for the registration flow.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">The native share sheet is triggered via the Web Share API: navigator.share({"{ title: \"Check this out\", url: shortUrl, text: caption }"}). The Web Share API presents the native OS share sheet (iOS AirDrop, WhatsApp, Messages, etc.) without the app needing to implement per-platform share logic. The fallback for unsupported browsers shows the custom share options: copy link button (writes to clipboard via navigator.clipboard.writeText), and explicit share buttons for the top 3 platforms (detected from User-Agent).</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Open Graph Meta Tags and Dynamic OG Images</h3>
        <HighlightBlock as="p" tier="crucial">When a shared link is pasted into WhatsApp, iMessage, Twitter, or Slack, the messaging app&apos;s link previewer makes an HTTP GET request to the URL and reads the Open Graph meta tags: &lt;meta property=&quot;og:title&quot; content=&quot;Alice&apos;s post&quot; /&gt;, &lt;meta property=&quot;og:description&quot; content=&quot;Just posted this photo from...&quot; /&gt;, &lt;meta property=&quot;og:image&quot; content=&quot;https://og.example.com/posts/{"{postId}"}.png&quot; /&gt;. The og:image URL points to a dynamically generated preview image that includes the post content, branding, and the poster&apos;s profile picture. The OG Image Service uses a Puppeteer (headless Chrome) process to render an HTML template for the content and take a screenshot, which is saved as a PNG to S3 and its URL cached in Redis (og:{"{contentId}"} TTL 24h). On first share of any content, the OG image is generated on demand (&lt;2 seconds). All subsequent shares of the same content URL return the cached PNG URL from Redis in &lt;5ms. OG images for high-volume content are pre-generated in a batch warm-up job run when content is published, so the first share is never a cache miss for popular content.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Deep Linking and Deferred Deep Links</h3>
        <HighlightBlock as="p" tier="important">Universal Links (iOS) and App Links (Android) allow a tap on a web URL to open the native app directly to the correct in-app screen. Configuration: the app hosts a /.well-known/apple-app-site-association file (iOS) and /.well-known/assetlinks.json file (Android) that declare the URL patterns the app handles. When a user who has the app installed taps a shared link, iOS/Android intercepts the navigation and opens the app instead, passing the URL to the app's deep link handler. The handler parses the URL (extracting contentId and ref) and navigates to the correct screen.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Deferred deep links handle the case where the app is not installed: the user clicks the link, lands on the web page, sees content with an app install prompt, installs the app, and opens it for the first time. On first open, the app calls POST /api/deep-link/resolve with a device fingerprint (a hash of device model, OS version, language, timezone, and screen dimensions). The server looks up click events that match the fingerprint within the last 24 hours (accounting for install time) and returns {"{contentId, refUserId}"} that was being viewed when the user clicked install. The app navigates to that content on first launch, creating a seamless &quot;you were shown this, now here it is in the app&quot; experience. This fingerprinting approach is privacy-respecting (no persistent tracking ID) and achieves ~85% attribution accuracy for deferred deep links.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Share Count Display with HyperLogLog</h3>
        <HighlightBlock as="p" tier="important">Share counts are maintained as Redis HyperLogLog (HLL) structures. On each share event, PFADD shares:{"{contentId}"} {"{userId}"} is called. PFCOUNT shares:{"{contentId}"} returns the estimated unique sharer count with ±0.81% error. For display: counts below 1000 show the exact PFCOUNT value; counts 1K–999K show rounded (1 decimal, e.g., &quot;2.3K shares&quot;); counts 1M+ show &quot;1.2M shares.&quot; The 0.81% error is invisible at these display granularities. HyperLogLog uses only 12 KB of memory regardless of the cardinality, a content with 10 million unique sharers uses the same 12 KB as one with 10 sharers. Compared to maintaining an exact count (which requires a SET or incrementing a counter that could overflow or require deduplication), HLL is both more memory-efficient and more accurate for distinct-user counting (a counter would double-count if the same user shares multiple times). Live viewer counts use the same HLL pattern with a 5-minute key TTL per session.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Viral Content Detection and CDN Pre-warming</h3>
        <HighlightBlock as="p" tier="important">Content going viral creates a spike in media requests that the CDN may not have cached if the content was recently published. A viral content detector monitors share velocity (shares per minute) and view velocity (views per minute) for all content in a rolling 5-minute window using a Redis sorted set. Content exceeding the velocity threshold (configurable: e.g., 100 shares/minute) is flagged as viral. A CDN pre-warm job is triggered: it makes HEAD requests to the content's media URLs from a set of CDN nodes across regions, populating those nodes' caches before the traffic spike arrives. This ensures that when a tweet with an embedded link goes viral and 100K users click within 5 minutes, the CDN hit rate stays above 99% rather than routing all requests to origin. The pre-warm job uses HTTP/2 multiplexing to make all region requests in parallel, completing in under 10 seconds.</HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">Universal Links versus custom URL schemes for deep linking: custom URL schemes (myapp://content/{"{id}"}) do not require server-side configuration but have a significant UX problem: if the app is not installed, tapping a custom URL scheme does nothing, the browser does not fall back to the web URL. Universal Links fall back to the web URL if the app is not installed. For sharing flows where the recipient may not have the app, Universal Links are strictly superior. Custom URL schemes are only appropriate for inter-app communication (e.g., a QR code that should only ever be scanned on a device with the app already installed).</HighlightBlock>
        <HighlightBlock as="p" tier="important">Attribution window length: a 7-day attribution window is standard for social referrals but may over-attribute for platforms with long install-to-register cycles. Users who click a link, consider installing for several days, and then install should not attribute credit to the referring user — the referring share is not the causal factor. A 24-hour window is more accurate for platforms where install-to-register conversion is fast. The optimal window length is determined by analyzing the distribution of time-to-register after click events: if 90% of registrations occur within 24 hours of the click, a 24-hour window captures most attributable referrals while minimizing false attribution.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important">A viral sharing and engagement system connects three pipelines. The Link Pipeline generates short tracked URLs (with ref={"{"}userId{"}"}_{"{"}contentId{"}"}), renders OG meta tags, and generates dynamic preview images via Puppeteer + S3 cache (2-second generation, sub-5ms cache hit). The Deep Link Pipeline uses Universal Links / App Links for direct in-app routing, with deferred deep link fingerprinting for post-install attribution (~85% accuracy). The Attribution Pipeline records clicks (cookie attribution_ref, 7-day TTL), joins click events to registrations at sign-up time (last-touch, 7-day window), and fires referral.attributed Kafka events for the reward service. Share counts and live viewer counts use Redis HyperLogLog (PFADD/PFCOUNT, ±0.81% error, 12 KB per counter regardless of cardinality). Viral content detection (share velocity threshold, 5-minute rolling window) triggers CDN pre-warm jobs that populate edge nodes before traffic spikes arrive. The key design insight: every share is a two-sided UX event, the sender needs to share in one tap (Web Share API, no context-switching), and the recipient needs a compelling preview (rich OG image with branding) that makes opening the link feel worth it; optimizing both sides of this exchange is what drives K &gt; 1.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
