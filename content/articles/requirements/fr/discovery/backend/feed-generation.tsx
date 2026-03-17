"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-backend-feed-generation",
  title: "Feed Generation",
  description: "Guide to implementing feed generation covering chronological feeds, ranked feeds, and fan-out patterns.",
  category: "functional-requirements",
  subcategory: "discovery",
  slug: "feed-generation",
  version: "extensive",
  wordCount: 7000,
  readingTime: 28,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "discovery", "feed", "generation", "backend"],
  relatedTopics: ["feed-display", "ranking", "real-time-systems"],
};

export default function FeedGenerationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Feed Generation</strong> creates personalized content streams for users, 
          balancing relevance, recency, and diversity. It is one of the most complex 
          discovery systems at scale.
        </p>
      </section>

      <section>
        <h2>Feed Types</h2>
        <ul className="space-y-3">
          <li><strong>Chronological:</strong> Query followed authors, order by created_at.</li>
          <li><strong>Ranked:</strong> Score candidates, sort by score.</li>
          <li><strong>Hybrid:</strong> Mix of both (recent from close, ranked otherwise).</li>
        </ul>
      </section>

      <section>
        <h2>Fan-Out Patterns</h2>
        <ul className="space-y-3">
          <li><strong>Fan-out on Write:</strong> Push to follower feeds on publish. O(1) read, O(followers) write.</li>
          <li><strong>Fan-out on Load:</strong> Pull from followed on read. O(following) read, O(1) write.</li>
          <li><strong>Hybrid:</strong> Fan-out for normal users, fan-out-on-load for celebrities.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle feed for users with millions of followers?</p>
            <p className="mt-2 text-sm">A: Hybrid approach - fan-out on load for celebrities. Don't push to all followers, pull on read instead.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you rank feed content?</p>
            <p className="mt-2 text-sm">A: Engagement prediction (likes, comments), recency decay, author affinity, content quality. Use ML model trained on historical engagement.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
