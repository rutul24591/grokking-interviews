"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-other-search-analytics",
  title: "Search Analytics",
  description: "Guide to implementing search analytics covering query logging, search metrics, and insights generation.",
  category: "functional-requirements",
  subcategory: "discovery",
  slug: "search-analytics",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "discovery", "search", "analytics", "backend"],
  relatedTopics: ["search-ranking", "query-processing", "monitoring"],
};

export default function SearchAnalyticsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Search Analytics</strong> tracks and analyzes search behavior to 
          improve search quality, understand user needs, and identify content gaps.
        </p>
      </section>

      <section>
        <h2>Key Metrics</h2>
        <ul className="space-y-3">
          <li><strong>Search Volume:</strong> Searches per day/hour.</li>
          <li><strong>CTR:</strong> Click-through rate on results.</li>
          <li><strong>Zero Results:</strong> Queries with no results (content gaps).</li>
          <li><strong>Exit Rate:</strong> Users leaving after search.</li>
          <li><strong>Query Refinement:</strong> How users modify searches.</li>
        </ul>
      </section>

      <section>
        <h2>Insights</h2>
        <ul className="space-y-3">
          <li><strong>Popular Queries:</strong> Top searches, trending queries.</li>
          <li><strong>Content Gaps:</strong> Queries with no/poor results.</li>
          <li><strong>Seasonal Patterns:</strong> Query trends over time.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you log search queries?</p>
            <p className="mt-2 text-sm">A: Log query, results count, clicked results, user session. Anonymize PII, comply with privacy regulations.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you use search analytics to improve search?</p>
            <p className="mt-2 text-sm">A: Identify zero-result queries (add content/synonyms), low CTR queries (improve ranking), popular queries (optimize for them).</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
