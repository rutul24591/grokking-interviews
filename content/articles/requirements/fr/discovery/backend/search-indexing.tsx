"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-backend-search-indexing",
  title: "Search Indexing",
  description: "Guide to implementing search indexing covering inverted indexes, analyzers, and incremental updates.",
  category: "functional-requirements",
  subcategory: "discovery",
  slug: "search-indexing",
  version: "extensive",
  wordCount: 6500,
  readingTime: 26,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "discovery", "search", "indexing", "backend"],
  relatedTopics: ["query-processing", "elasticsearch", "search-ranking"],
};

export default function SearchIndexingBackendArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Search Indexing</strong> creates and maintains data structures that enable 
          fast, relevant search results. It transforms content into searchable format with 
          proper tokenization, normalization, and ranking signals.
        </p>
      </section>

      <section>
        <h2>Index Structure</h2>
        <ul className="space-y-3">
          <li><strong>Inverted Index:</strong> Map terms to documents containing them.</li>
          <li><strong>Field Indexes:</strong> Separate indexes for title, body, tags with different weights.</li>
          <li><strong>Stored Fields:</strong> Original fields for result display.</li>
        </ul>
      </section>

      <section>
        <h2>Analyzers</h2>
        <ul className="space-y-3">
          <li><strong>Tokenization:</strong> Split text into terms (words).</li>
          <li><strong>Normalization:</strong> Lowercase, remove punctuation.</li>
          <li><strong>Stemming:</strong> Reduce to root form (running → run).</li>
          <li><strong>Stop Words:</strong> Remove common words (the, a, is).</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle incremental indexing?</p>
            <p className="mt-2 text-sm">A: Event-driven (Kafka), index on content change, batch small updates, reconcile periodically.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle reindexing?</p>
            <p className="mt-2 text-sm">A: Blue-green indexing (new index alongside old), switch alias when ready, rollback if issues.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
