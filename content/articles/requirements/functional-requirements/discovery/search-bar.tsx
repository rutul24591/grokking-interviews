"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-frontend-search-bar",
  title: "Search Bar",
  description: "Guide to implementing search bars covering autocomplete, recent searches, and search suggestions.",
  category: "functional-requirements",
  subcategory: "discovery",
  slug: "search-bar",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "discovery", "search", "frontend"],
  relatedTopics: ["search-results", "autocomplete", "discovery"],
};

export default function SearchBarArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Search Bar</strong> is the primary entry point for users to find content 
          through active search. It must provide fast, relevant suggestions and handle 
          various input patterns gracefully.
        </p>
      </section>

      <section>
        <h2>Core Features</h2>
        <ul className="space-y-3">
          <li><strong>Autocomplete:</strong> Show suggestions as user types (debounced 200-300ms).</li>
          <li><strong>Recent Searches:</strong> Show user's recent searches (localStorage).</li>
          <li><strong>Trending:</strong> Show popular searches platform-wide.</li>
          <li><strong>Voice Search:</strong> Speech-to-text input option.</li>
        </ul>
      </section>

      <section>
        <h2>UX Best Practices</h2>
        <ul className="space-y-3">
          <li><strong>Keyboard Navigation:</strong> Arrow keys to navigate suggestions, Enter to select.</li>
          <li><strong>Clear Button:</strong> X button to clear search quickly.</li>
          <li><strong>Mobile:</strong> Full-width on mobile, large touch targets.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize autocomplete performance?</p>
            <p className="mt-2 text-sm">A: Debounce input, cache suggestions, prefix trie for client-side, limit results (5-10).</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle search personalization?</p>
            <p className="mt-2 text-sm">A: Boost results based on user history, location, preferences. Balance personalization with diversity.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
