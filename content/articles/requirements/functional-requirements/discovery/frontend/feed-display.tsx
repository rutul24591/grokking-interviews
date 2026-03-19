"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-frontend-feed-display",
  title: "Feed Display",
  description: "Guide to implementing feed display covering chronological vs ranked feeds, infinite scroll, and feed sections.",
  category: "functional-requirements",
  subcategory: "discovery",
  slug: "feed-display",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "discovery", "feed", "timeline", "frontend"],
  relatedTopics: ["feed-generation", "ranking", "infinite-scroll"],
};

export default function FeedDisplayArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Feed Display</strong> presents content in a continuous stream, optimized 
          for discovery and engagement. It is the primary interface for content consumption 
          on social platforms and news sites.
        </p>
      </section>

      <section>
        <h2>Feed Types</h2>
        <ul className="space-y-3">
          <li><strong>Chronological:</strong> Newest first, simple and predictable.</li>
          <li><strong>Ranked:</strong> Algorithmically sorted by relevance/engagement.</li>
          <li><strong>Hybrid:</strong> Mix of both (recent from close connections, ranked otherwise).</li>
        </ul>
      </section>

      <section>
        <h2>Feed Sections</h2>
        <ul className="space-y-3">
          <li><strong>For You:</strong> Personalized recommendations.</li>
          <li><strong>Following:</strong> Content from followed accounts.</li>
          <li><strong>Trending:</strong> Popular content platform-wide.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle feed updates?</p>
            <p className="mt-2 text-sm">A: Pull-to-refresh, "X new posts" banner, auto-refresh on return to app, infinite scroll for navigation.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you maintain scroll position?</p>
            <p className="mt-2 text-sm">A: Store scroll offset, restore on navigation back, use virtualized lists for performance.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
