"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-frontend-filters-sorting",
  title: "Filters and Sorting",
  description: "Guide to implementing search filters and sorting covering faceted search, sort options, and filter state management.",
  category: "functional-requirements",
  subcategory: "discovery",
  slug: "filters-and-sorting",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "discovery", "filters", "sorting", "frontend"],
  relatedTopics: ["search-results", "faceted-search", "search"],
};

export default function FiltersAndSortingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Filters and Sorting</strong> enable users to refine search results 
          and browse content by applying criteria and ordering preferences.
        </p>
      </section>

      <section>
        <h2>Filter Types</h2>
        <ul className="space-y-3">
          <li><strong>Checkboxes:</strong> Multi-select categories, tags.</li>
          <li><strong>Date Range:</strong> Date picker for time-based filtering.</li>
          <li><strong>Sliders:</strong> Price range, rating range.</li>
          <li><strong>Dropdowns:</strong> Single-select options.</li>
        </ul>
      </section>

      <section>
        <h2>Sort Options</h2>
        <ul className="space-y-3">
          <li><strong>Relevance:</strong> Default, based on search algorithm.</li>
          <li><strong>Date:</strong> Newest first, oldest first.</li>
          <li><strong>Popularity:</strong> Most viewed, most liked.</li>
          <li><strong>Price:</strong> Low to high, high to low.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you persist filter state?</p>
            <p className="mt-2 text-sm">A: URL query params (shareable, bookmarkable), localStorage for user preference, sync to backend for cross-device.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you update results on filter change?</p>
            <p className="mt-2 text-sm">A: Debounce filter changes, AJAX update without page reload, show loading state, maintain scroll position.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
