"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-frontend-infinite-scroll",
  title: "Infinite Scrolling",
  description: "Guide to implementing infinite scroll covering pagination, loading states, and scroll position management.",
  category: "functional-requirements",
  subcategory: "discovery",
  slug: "infinite-scrolling",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "discovery", "infinite-scroll", "pagination", "frontend"],
  relatedTopics: ["feed-display", "search-results", "performance"],
};

export default function InfiniteScrollingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Infinite Scrolling</strong> automatically loads more content as 
          users scroll, providing seamless browsing without pagination interruption.
        </p>
      </section>

      <section>
        <h2>Implementation</h2>
        <ul className="space-y-3">
          <li><strong>Trigger:</strong> Load when 200px from bottom.</li>
          <li><strong>Loading:</strong> Show spinner or skeleton screens.</li>
          <li><strong>Cursor:</strong> Use cursor-based pagination (not offset).</li>
          <li><strong>Deduplication:</strong> Ensure no duplicate items across pages.</li>
        </ul>
      </section>

      <section>
        <h2>UX Considerations</h2>
        <ul className="space-y-3">
          <li><strong>Scroll Position:</strong> Maintain position on navigation back.</li>
          <li><strong>End of Content:</strong> Show "You're all caught up" message.</li>
          <li><strong>Footer:</strong> Ensure footer is accessible (pause infinite load).</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Infinite scroll vs pagination?</p>
            <p className="mt-2 text-sm">A: Infinite: better for exploration, mobile. Pagination: better for finding position, bookmarking, SEO. Choose based on use case.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle memory with infinite scroll?</p>
            <p className="mt-2 text-sm">A: Virtualize list (render only visible items), unload old items, limit max rendered items, use windowing libraries.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
