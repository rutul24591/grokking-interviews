"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-backend-query-processing",
  title: "Query Processing",
  description: "Guide to implementing query processing covering parsing, expansion, spelling correction, and intent detection.",
  category: "functional-requirements",
  subcategory: "discovery",
  slug: "query-processing",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "discovery", "search", "query", "backend"],
  relatedTopics: ["search-indexing", "search-ranking", "autocomplete"],
};

export default function QueryProcessingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Query Processing</strong> transforms user search input into optimized 
          queries that retrieve relevant results. It handles parsing, expansion, correction, 
          and intent understanding.
        </p>
      </section>

      <section>
        <h2>Query Pipeline</h2>
        <ul className="space-y-3">
          <li><strong>Parse:</strong> Tokenize, normalize, remove stop words.</li>
          <li><strong>Expand:</strong> Add synonyms, related terms.</li>
          <li><strong>Correct:</strong> Fix spelling errors (edit distance).</li>
          <li><strong>Classify:</strong> Detect intent (navigational, informational, transactional).</li>
        </ul>
      </section>

      <section>
        <h2>Advanced Features</h2>
        <ul className="space-y-3">
          <li><strong>Phrase Search:</strong> Quoted terms must appear together.</li>
          <li><strong>Boolean Operators:</strong> AND, OR, NOT support.</li>
          <li><strong>Fuzzy Match:</strong> Tolerate typos and variations.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle spelling correction?</p>
            <p className="mt-2 text-sm">A: Edit distance (Levenshtein), phonetic matching (Soundex), query logs for common corrections, ML models.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle ambiguous queries?</p>
            <p className="mt-2 text-sm">A: Show results for multiple interpretations, ask clarifying question, use user context to disambiguate.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
