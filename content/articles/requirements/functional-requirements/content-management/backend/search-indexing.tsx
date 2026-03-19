"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-backend-search-indexing",
  title: "Search Indexing",
  description: "Guide to implementing search indexing covering index structure, incremental updates, and search optimization.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "search-indexing",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "content", "search", "indexing", "backend"],
  relatedTopics: ["discovery", "elasticsearch", "content-storage"],
};

export default function SearchIndexingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Search Indexing</strong> creates and maintains search indexes for 
          content, enabling fast, relevant search results. It is critical for content 
          discovery and user experience.
        </p>
      </section>

      <section>
        <h2>Index Structure</h2>
        <ul className="space-y-3">
          <li><strong>Fields:</strong> Title, body, tags, author with different weights.</li>
          <li><strong>Analyzers:</strong> Tokenization, stemming, normalization.</li>
          <li><strong>Boosts:</strong> Title matches rank higher than body matches.</li>
        </ul>
      </section>

      <section>
        <h2>Index Updates</h2>
        <ul className="space-y-3">
          <li><strong>Real-time:</strong> Index on publish/update.</li>
          <li><strong>Batch:</strong> Periodic bulk indexing for large changes.</li>
          <li><strong>Reindex:</strong> Full reindex when schema changes.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle index consistency?</p>
            <p className="mt-2 text-sm">A: Event-driven indexing (Kafka), retry on failure, periodic reconciliation, monitor lag.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize search relevance?</p>
            <p className="mt-2 text-sm">A: Field boosting, freshness boost, popularity signals, A/B test ranking algorithms, user feedback.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
