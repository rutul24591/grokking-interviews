"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-frontend-recommendation-carousel",
  title: "Recommendation Carousel",
  description:
    "Comprehensive guide to recommendation carousels covering horizontal scroll UX, prefetching strategies, personalization algorithms, reason labels, and performance optimization for content discovery.",
  category: "functional-requirements",
  subcategory: "discovery",
  slug: "recommendation-carousel",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-25",
  tags: [
    "requirements",
    "functional",
    "discovery",
    "recommendations",
    "carousel",
    "frontend",
    "personalization",
    "horizontal-scroll",
  ],
  relatedTopics: ["recommendation-algorithms", "feed-display", "personalization", "related-content"],
};

export default function RecommendationCarouselArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Recommendation Carousel</strong> is a horizontal scrolling UI component
          that displays personalized content recommendations, enabling users to discover
          related or suggested content without leaving the current page. Carousels are
          ubiquitous in modern platforms—Netflix's "Because You Watched" rows, YouTube's
          video recommendations, Amazon's "Customers Also Bought", Spotify's "Made For
          You" playlists. They drive 20-35% of total engagement on content platforms.
        </p>
        <p>
          The carousel format is uniquely suited for recommendations: it shows multiple
          options at once (unlike single suggestions), doesn't interrupt the main content
          (unlike popups), and encourages exploration through horizontal scrolling. The
          challenge is balancing discoverability with performance—carousels must load
          quickly, scroll smoothly, and show relevant content or users ignore them.
        </p>
        <p>
          For staff-level engineers, recommendation carousels involve component architecture
          (horizontal scroll, virtualization), data fetching (prefetching, lazy loading),
          personalization (recommendation algorithms, reason labels), performance
          optimization (CSS transforms, intersection observer), and A/B testing (carousel
          position, item count, reason labels).
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Carousel Types</h3>
        <p>
          Different carousel patterns for different use cases:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Related Content:</strong> Items related to current content. "More like
            this", "Similar products". Context-aware recommendations.
          </li>
          <li>
            <strong>Personalized:</strong> Based on user history. "Because you watched X",
            "Made for you". Requires user data.
          </li>
          <li>
            <strong>Trending:</strong> Popular content platform-wide. "Trending now",
            "Most popular". No personalization needed.
          </li>
          <li>
            <strong>Continuation:</strong> Continue watching/reading. "Pick up where you
            left off", "Next episode". Session-based.
          </li>
          <li>
            <strong>Curated:</strong> Editor picks, collections. "Staff picks", "Featured".
            Human curation.
          </li>
        </ul>

        <h3 className="mt-6">Navigation Patterns</h3>
        <p>
          How users navigate carousels:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Horizontal Scroll:</strong> Swipe on mobile, trackpad scroll on
            desktop. Most natural. Show partial next item to indicate scrollability.
          </li>
          <li>
            <strong>Arrow Buttons:</strong> Left/right arrows on desktop. Click to scroll
            one item or one viewport. Always show both or hide when at ends.
          </li>
          <li>
            <strong>Scroll Indicators:</strong> Dots or progress bar showing position.
            Useful for short carousels (5-10 items).
          </li>
          <li>
            <strong>Hybrid:</strong> Scroll + arrows. Best of both. Arrows for precise
            control, scroll for quick browsing.
          </li>
        </ul>

        <h3 className="mt-6">Reason Labels</h3>
        <p>
          Explaining why content is recommended:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>History-based:</strong> "Because you watched X", "Based on your
            history". Most common. Builds trust through transparency.
          </li>
          <li>
            <strong>Similarity-based:</strong> "Similar to X", "Like this". Content-based
            recommendations.
          </li>
          <li>
            <strong>Social:</strong> "Trending in your network", "Your friends watched".
            Social proof.
          </li>
          <li>
            <strong>Temporal:</strong> "New from X", "Just released". Freshness-based.
          </li>
          <li>
            <strong>None:</strong> No explanation. Cleaner UI but less transparent.
          </li>
        </ul>

        <h3 className="mt-6">Item Count & Sizing</h3>
        <p>
          How many items to show:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Desktop:</strong> 5-8 items visible at once. Enough for choice without
            overwhelming. Total: 10-20 items with scroll.
          </li>
          <li>
            <strong>Mobile:</strong> 2-4 items visible. Partial next item to indicate
            scroll. Total: 8-12 items.
          </li>
          <li>
            <strong>Card Size:</strong> Desktop: 200-300px wide. Mobile: 150-200px wide.
            Aspect ratio: 16:9 for videos, 3:4 for products.
          </li>
          <li>
            <strong>Gutter:</strong> 10-20px spacing between items. Enough to distinguish
            items, not too much wasted space.
          </li>
        </ul>

        <h3 className="mt-6">Loading Strategies</h3>
        <p>
          How to load carousel content:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Eager Load:</strong> Load all items upfront. Fast interaction, high
            initial load. Best for: Short carousels (&lt;10 items).
          </li>
          <li>
            <strong>Lazy Load:</strong> Load items as they enter viewport. Slow initial,
            fast scroll. Best for: Long carousels (10+ items).
          </li>
          <li>
            <strong>Prefetch:</strong> Load next carousel while viewing current. Anticipate
            user behavior. Best for: Multiple carousels on page.
          </li>
          <li>
            <strong>Hybrid:</strong> Eager load first 5 items, lazy load rest. Balanced
            approach. Most common in production.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Production recommendation carousel involves efficient rendering and data fetching.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/recommendation-carousel/carousel-architecture.svg"
          alt="Recommendation Carousel Architecture"
          caption="Figure 1: Carousel Architecture — Data fetching, rendering, prefetching, and user interaction flow"
          width={1000}
          height={500}
        />

        <h3>Component Structure</h3>
        <ul className="space-y-3">
          <li>
            <strong>Carousel Container:</strong> Main wrapper. Manages carousel state
            (loading, error, items). Handles horizontal scroll.
          </li>
          <li>
            <strong>Carousel Header:</strong> Title, reason label, "See All" link.
            Optional navigation arrows.
          </li>
          <li>
            <strong>Scroll Container:</strong> Horizontal scrollable area. CSS overflow-x:
            auto. Hide scrollbar for clean look.
          </li>
          <li>
            <strong>Carousel Item:</strong> Individual recommendation card. Thumbnail,
            title, metadata. Clickable. Memoized to prevent re-render.
          </li>
          <li>
            <strong>Navigation Arrows:</strong> Left/right buttons. Hide at ends. Debounce
            clicks to prevent rapid scrolling.
          </li>
          <li>
            <strong>Skeleton Loader:</strong> Placeholder while loading. Match card
            dimensions. Prevent layout shift.
          </li>
        </ul>

        <h3 className="mt-6">Data Fetching Flow</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            <strong>Initial Fetch:</strong> Fetch carousel data on mount or when carousel
            enters viewport. Show skeleton.
          </li>
          <li>
            <strong>Render Visible:</strong> Render first 5-8 items immediately. Hide rest
            or lazy load.
          </li>
          <li>
            <strong>Track Scroll:</strong> Use Intersection Observer to detect when items
            enter viewport.
          </li>
          <li>
            <strong>Lazy Load:</strong> Load remaining items as user scrolls. Don't block
            interaction.
          </li>
          <li>
            <strong>Prefetch Next:</strong> When user views carousel N, prefetch carousel
            N+1. Anticipate scroll.
          </li>
          <li>
            <strong>Cache Results:</strong> Cache carousel data by carousel ID. Reuse on
            back navigation.
          </li>
        </ol>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/recommendation-carousel/carousel-ux-patterns.svg"
          alt="Carousel UX Patterns"
          caption="Figure 2: Carousel UX Patterns — Horizontal scroll, arrow navigation, reason labels, and item sizing"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Performance Optimization</h3>
        <ul className="space-y-3">
          <li>
            <strong>CSS Transforms:</strong> Use transform: translateX() for scrolling.
            GPU-accelerated, smooth 60fps.
          </li>
          <li>
            <strong>Virtual Scrolling:</strong> Render only visible items + buffer. For
            long carousels (20+ items).
          </li>
          <li>
            <strong>Image Optimization:</strong> Lazy load images. Use WebP/AVIF formats.
            Responsive images (srcset).
          </li>
          <li>
            <strong>Debounce Scroll:</strong> Debounce scroll events (100ms). Prevent
            excessive handler calls.
          </li>
          <li>
            <strong>Preconnect:</strong> Preconnect to CDN for images. Reduces image load
            latency.
          </li>
          <li>
            <strong>Reduce Reflows:</strong> Batch DOM updates. Use requestAnimationFrame
            for scroll-based animations.
          </li>
        </ul>

        <h3 className="mt-6">Accessibility Considerations</h3>
        <ul className="space-y-3">
          <li>
            <strong>Keyboard Navigation:</strong> Arrow keys to scroll carousel. Tab to
            focus carousel, arrows to navigate.
          </li>
          <li>
            <strong>Screen Reader:</strong> aria-label for carousel ("Recommended for
            you"). Announce item count.
          </li>
          <li>
            <strong>Focus Management:</strong> Visible focus indicators on items. Don't
            trap focus in carousel.
          </li>
          <li>
            <strong>Reduced Motion:</strong> Respect prefers-reduced-motion. Disable
            animations for users who prefer.
          </li>
          <li>
            <strong>Touch Targets:</strong> Minimum 44px for clickable items. Accessible
            on mobile.
          </li>
        </ul>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Carousel design involves balancing usability, performance, and content density.
        </p>

        <h3>Loading Strategy Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Strategy</th>
                <th className="text-left p-2 font-semibold">Initial Load</th>
                <th className="text-left p-2 font-semibold">Scroll Performance</th>
                <th className="text-left p-2 font-semibold">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">Eager Load</td>
                <td className="p-2">Slow (all items)</td>
                <td className="p-2">Fast (all loaded)</td>
                <td className="p-2">&lt;10 items</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Lazy Load</td>
                <td className="p-2">Fast (visible only)</td>
                <td className="p-2">Medium (load on scroll)</td>
                <td className="p-2">10-20 items</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Hybrid</td>
                <td className="p-2">Medium (first 5)</td>
                <td className="p-2">Fast (rest lazy)</td>
                <td className="p-2">Most production</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/recommendation-carousel/personalization-strategies.svg"
          alt="Personalization Strategies"
          caption="Figure 3: Personalization — History-based, similarity-based, social, and temporal recommendations"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Arrow Buttons vs Scroll Only</h3>
        <p>
          <strong>Arrows Only:</strong> Clear affordance (users know it scrolls). Precise
          control. Risk: Takes space, not mobile-friendly.
        </p>
        <p>
          <strong>Scroll Only:</strong> Clean, mobile-native. Risk: Less discoverable on
          desktop (some users don't know to scroll).
        </p>
        <p>
          <strong>Hybrid (Recommended):</strong> Both arrows and scroll. Show arrows on
          desktop, hide on mobile. Show partial next item to indicate scrollability.
        </p>

        <h3 className="mt-6">Reason Labels: To Show or Not</h3>
        <p>
          <strong>Show Labels:</strong> Transparent, builds trust, helps users understand
          recommendations. Risk: Takes space, may be obvious.
        </p>
        <p>
          <strong>Hide Labels:</strong> Cleaner UI, more space for content. Risk: Users
          don't understand why content is shown.
        </p>
        <p>
          <strong>Recommendation:</strong> Show labels for personalized carousels
          ("Because you watched"), hide for trending/popular (obvious).
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Show Partial Next Item:</strong> Always show part of next item to
            indicate scrollability. Critical for discoverability.
          </li>
          <li>
            <strong>Smooth Scrolling:</strong> Use CSS scroll-behavior: smooth. Or JS
            animation for custom control.
          </li>
          <li>
            <strong>Hide Arrows at Ends:</strong> Hide left arrow at start, right arrow
            at end. Indicates boundaries.
          </li>
          <li>
            <strong>Debounce Arrow Clicks:</strong> Prevent rapid clicking causing
            jarring scroll. 200-300ms debounce.
          </li>
          <li>
            <strong>Use Skeleton Loaders:</strong> Match card dimensions. Prevent layout
            shift during load.
          </li>
          <li>
            <strong>Lazy Load Images:</strong> Don't block carousel render on images.
            Use Intersection Observer.
          </li>
          <li>
            <strong>Track Engagement:</strong> Log carousel impressions, item clicks,
            scroll depth. Measure effectiveness.
          </li>
          <li>
            <strong>A/B Test Position:</strong> Test carousel position on page. Above
            fold vs below content.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No Scroll Indication:</strong> Users don't know carousel scrolls.
            Solution: Show partial next item, add arrows.
          </li>
          <li>
            <strong>Janky Scroll:</strong> Choppy scrolling experience. Solution: Use
            CSS transforms, GPU acceleration.
          </li>
          <li>
            <strong>Layout Shift:</strong> Carousel jumps when images load. Solution:
            Reserve space, use aspect-ratio CSS.
          </li>
          <li>
            <strong>Too Many Items:</strong> 50+ items in one carousel. Solution: Limit
            to 10-20, split into multiple carousels.
          </li>
          <li>
            <strong>No Keyboard Support:</strong> Can't navigate with keyboard. Solution:
            Arrow key support, proper focus management.
          </li>
          <li>
            <strong>Slow Initial Load:</strong> Loading all items upfront. Solution:
            Hybrid loading (eager first 5, lazy rest).
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Netflix Recommendation Rows</h3>
        <p>
          Netflix uses multiple carousels ("Because You Watched", "Trending Now", "New
          Releases"). Each row is a separate carousel with 10-15 titles. Hover preview
          plays trailer. Reason labels for personalized rows.
        </p>
        <p>
          <strong>Key Innovation:</strong> Artwork personalization—different thumbnails
          for same title based on predicted appeal.
        </p>

        <h3 className="mt-6">YouTube Video Recommendations</h3>
        <p>
          YouTube shows recommendation carousels below video ("Recommended videos").
          Horizontal scroll on mobile, grid on desktop. Reason labels ("Because you
          watched X"). Autoplay preview on hover.
        </p>
        <p>
          <strong>Key Innovation:</strong> Autoplay preview—video plays muted on hover
          without click.
        </p>

        <h3 className="mt-6">Amazon Product Carousels</h3>
        <p>
          Amazon uses carousels for "Customers Also Bought", "Related to items you
          viewed". Arrow navigation, dot indicators. Prime badge, price, rating shown.
        </p>
        <p>
          <strong>Key Innovation:</strong> Quick add to cart—add without leaving carousel.
        </p>

        <h3 className="mt-6">Spotify Playlist Carousels</h3>
        <p>
          Spotify shows "Made For You", "Recently Played", "Recommended Playlists".
          Large artwork, play button overlay. Swipe navigation on mobile.
        </p>
        <p>
          <strong>Key Innovation:</strong> Contextual carousels—different carousels for
          different moods/activities.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize carousel performance?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use CSS transforms (translateX) for smooth scrolling.
              Lazy load images with Intersection Observer. Virtual scroll for long
              carousels (render only visible + buffer). Prefetch next carousel while
              viewing current. Debounce scroll/arrow events. Use skeleton loaders to
              prevent layout shift. Target 60fps scroll performance.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you measure recommendation quality?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Track CTR (clicks / impressions), engagement rate
              (watch time, reads), conversion rate (purchases, signups). Measure scroll
              depth (how far users scroll). A/B test different algorithms, reason labels,
              carousel positions. Track diversity (do users see varied content?). Monitor
              long-term retention (do recommendations keep users coming back?).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle carousel accessibility?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Keyboard navigation (arrow keys to scroll, Tab to focus
              items). ARIA labels for carousel ("Recommended for you", "5 of 20").
              Visible focus indicators. Screen reader announcements for item count.
              Touch targets minimum 44px. Respect prefers-reduced-motion. Test with
              actual screen readers (NVDA, VoiceOver).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you decide carousel item count?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Desktop: 5-8 visible, 10-20 total. Mobile: 2-4 visible,
              8-12 total. Base on content type (videos need larger cards than products).
              A/B test different counts—more isn't always better (choice paralysis).
              Consider page context (above fold: fewer items, below content: more items).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement prefetching?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> When carousel enters viewport, prefetch data for next
              carousel below. Use Intersection Observer with threshold (0.5 = 50%
              visible). Cache prefetched data. Cancel prefetch if user navigates away
              before carousel fully visible. Priority: current carousel &gt; prefetch
              next &gt; prefetch rest.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle empty carousels?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Don't show empty carousel—hide entire component. If
              carousel is critical (e.g., "Continue Watching"), show fallback content
              ("Nothing yet, browse our catalog"). Log empty carousels for analysis—may
              indicate recommendation algorithm issues. A/B test fallback strategies.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://netflixtechblog.com/netflix-recommendations-beyond-the-5-star-part-1-b8e6e1d0a0b9"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Netflix Tech Blog — Recommendations Beyond the 5-Star
            </a>
          </li>
          <li>
            <a
              href="https://www.nngroup.com/articles/carousel-design/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — Carousel Design Guidelines
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C ARIA — Accessible UI Patterns
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/performance-best-practices/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Web.dev — Performance Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://www.smashingmagazine.com/tag/recommendation-systems/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Smashing Magazine — Recommendation System Articles
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
