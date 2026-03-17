"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-frontend-recommendation-carousel",
  title: "Recommendation Carousel",
  description: "Guide to implementing recommendation carousels covering horizontal scroll, prefetching, and personalization.",
  category: "functional-requirements",
  subcategory: "discovery",
  slug: "recommendation-carousel",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "discovery", "recommendations", "carousel", "frontend"],
  relatedTopics: ["recommendation-systems", "feed-display", "personalization"],
};

export default function RecommendationCarouselArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Recommendation Carousel</strong> displays personalized content 
          recommendations in a horizontal scroll format, enabling discovery of 
          related or suggested content.
        </p>
      </section>

      <section>
        <h2>Carousel Features</h2>
        <ul className="space-y-3">
          <li><strong>Horizontal Scroll:</strong> Swipe on mobile, arrows on desktop.</li>
          <li><strong>Lazy Load:</strong> Load items as they come into view.</li>
          <li><strong>Prefetch:</strong> Prefetch next carousel while viewing current.</li>
          <li><strong>Reason Labels:</strong> "Because you watched X", "Trending in Y".</li>
        </ul>
      </section>

      <section>
        <h2>Personalization</h2>
        <ul className="space-y-3">
          <li><strong>Based On:</strong> Watch history, likes, follows, similar users.</li>
          <li><strong>Freshness:</strong> Mix of familiar and new content.</li>
          <li><strong>Diversity:</strong> Avoid consecutive items from same source.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize carousel performance?</p>
            <p className="mt-2 text-sm">A: Virtual scrolling, only render visible items, prefetch next, use CSS transforms for smooth scrolling.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you measure recommendation quality?</p>
            <p className="mt-2 text-sm">A: CTR, watch time, engagement rate, diversity metrics, A/B test different algorithms.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
