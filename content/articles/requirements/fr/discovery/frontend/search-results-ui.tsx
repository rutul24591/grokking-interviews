"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-frontend-search-results",
  title: "Search Results UI",
  description: "Guide to implementing search results covering result display, pagination, and result highlighting.",
  category: "functional-requirements",
  subcategory: "discovery",
  slug: "search-results-ui",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "discovery", "search", "results", "frontend"],
  relatedTopics: ["search-bar", "filters", "ranking"],
};

export default function SearchResultsUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Search Results UI</strong> displays search results in an organized, 
          scannable format with relevant metadata, highlighting, and navigation options.
        </p>
      </section>

      <section>
        <h2>Result Display</h2>
        <ul className="space-y-3">
          <li><strong>Result Cards:</strong> Title, snippet, metadata (date, author).</li>
          <li><strong>Highlighting:</strong> Highlight matched terms in results.</li>
          <li><strong>Result Count:</strong> Show total results and search time.</li>
          <li><strong>Types:</strong> Tabs for different result types (all, posts, users).</li>
        </ul>
      </section>

      <section>
        <h2>Pagination</h2>
        <ul className="space-y-3">
          <li><strong>Page Numbers:</strong> Traditional pagination (1, 2, 3...).</li>
          <li><strong>Infinite Scroll:</strong> Load more on scroll.</li>
          <li><strong>Load More:</strong> Button to load next page.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Pagination vs infinite scroll?</p>
            <p className="mt-2 text-sm">A: Pagination: better for finding position, bookmarking. Infinite: better for exploration, mobile. Depends on use case.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle empty search results?</p>
            <p className="mt-2 text-sm">A: Show helpful message, suggest alternatives, show trending/popular content, allow broadening search.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
