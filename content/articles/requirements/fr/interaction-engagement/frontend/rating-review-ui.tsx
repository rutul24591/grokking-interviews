"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-int-frontend-rating-review-ui",
  title: "Rating/Review UI",
  description: "Guide to implementing rating and review interfaces covering star ratings, review forms, and review display.",
  category: "functional-requirements",
  subcategory: "interaction-engagement",
  slug: "rating-review-ui",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "interaction", "ratings", "reviews", "frontend"],
  relatedTopics: ["engagement", "content-quality", "moderation"],
};

export default function RatingReviewUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Rating/Review UI</strong> enables users to rate and review products, 
          content, or services, providing social proof and quality signals for other users.
        </p>
      </section>

      <section>
        <h2>Rating Input</h2>
        <ul className="space-y-3">
          <li><strong>Star Rating:</strong> 1-5 stars, half-star support.</li>
          <li><strong>Interactive:</strong> Hover preview, click to select.</li>
          <li><strong>Categories:</strong> Multiple rating categories if needed.</li>
        </ul>
      </section>

      <section>
        <h2>Review Form</h2>
        <ul className="space-y-3">
          <li><strong>Title:</strong> Optional review title.</li>
          <li><strong>Body:</strong> Review text with character limit.</li>
          <li><strong>Photos:</strong> Optional photo attachments.</li>
          <li><strong>Verification:</strong> "Verified purchase" badge.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you calculate average rating?</p>
            <p className="mt-2 text-sm">A: Weighted average, exclude flagged reviews, time decay for recent ratings, Bayesian average for small samples.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent review manipulation?</p>
            <p className="mt-2 text-sm">A: Verify purchase/usage, rate limit reviews, detect patterns, flag suspicious reviews for moderation.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
