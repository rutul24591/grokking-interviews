"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-backend-search-ranking",
  title: "Search Ranking",
  description: "Guide to implementing search ranking covering relevance scoring, learning-to-rank, and ranking features.",
  category: "functional-requirements",
  subcategory: "discovery",
  slug: "search-ranking",
  version: "extensive",
  wordCount: 6500,
  readingTime: 26,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "discovery", "search", "ranking", "backend"],
  relatedTopics: ["query-processing", "recommendation-algorithms", "ml-ranking"],
};

export default function SearchRankingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Search Ranking</strong> orders search results by relevance, combining 
          text matching, user signals, and business rules to surface the most useful 
          results first.
        </p>
      </section>

      <section>
        <h2>Ranking Signals</h2>
        <ul className="space-y-3">
          <li><strong>Text Relevance:</strong> BM25, TF-IDF scores.</li>
          <li><strong>Freshness:</strong> Boost recent content.</li>
          <li><strong>Popularity:</strong> Views, likes, shares.</li>
          <li><strong>Personalization:</strong> User affinity, history.</li>
          <li><strong>Quality:</strong> Content quality score, author reputation.</li>
        </ul>
      </section>

      <section>
        <h2>Ranking Models</h2>
        <ul className="space-y-3">
          <li><strong>Linear Combination:</strong> Weighted sum of signals.</li>
          <li><strong>Learning-to-Rank:</strong> LambdaMART, XGBoost.</li>
          <li><strong>Neural Ranking:</strong> BERT, transformer-based models.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize ranking?</p>
            <p className="mt-2 text-sm">A: A/B test ranking changes, use NDCG/MRR metrics, analyze click-through data, user feedback loops.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle ranking at scale?</p>
            <p className="mt-2 text-sm">A: Two-stage ranking (cheap pre-filter, expensive re-rank), cache top queries, approximate nearest neighbors.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
