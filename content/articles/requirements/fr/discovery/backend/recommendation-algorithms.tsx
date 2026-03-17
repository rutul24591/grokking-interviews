"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-backend-recommendation-algorithms",
  title: "Recommendation Algorithms",
  description: "Guide to implementing recommendation algorithms covering collaborative filtering, content-based, and hybrid approaches.",
  category: "functional-requirements",
  subcategory: "discovery",
  slug: "recommendation-algorithms",
  version: "extensive",
  wordCount: 7000,
  readingTime: 28,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "discovery", "recommendations", "ml", "backend"],
  relatedTopics: ["ml-ranking", "collaborative-filtering", "personalization"],
};

export default function RecommendationAlgorithmsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Recommendation Algorithms</strong> predict content users will find 
          relevant, driving engagement and discovery. They are core to modern content 
          platforms.
        </p>
      </section>

      <section>
        <h2>Algorithm Types</h2>
        <ul className="space-y-3">
          <li><strong>Collaborative Filtering:</strong> Users like you liked X. Matrix factorization (SVD, ALS).</li>
          <li><strong>Content-Based:</strong> Similar to what you liked. Content embeddings, TF-IDF.</li>
          <li><strong>Hybrid:</strong> Combine both approaches. Wide &amp; Deep, DeepFM.</li>
          <li><strong>Session-Based:</strong> RNN/Transformer for sequential patterns.</li>
        </ul>
      </section>

      <section>
        <h2>Cold Start</h2>
        <ul className="space-y-3">
          <li><strong>New Users:</strong> Popularity-based, ask for interests, demographic-based.</li>
          <li><strong>New Content:</strong> Boost visibility, content-based until engagement data.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you scale collaborative filtering?</p>
            <p className="mt-2 text-sm">A: Distributed matrix factorization (Spark ALS), approximate nearest neighbors, candidate generation + ranking pipeline.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you evaluate recommendations?</p>
            <p className="mt-2 text-sm">A: Offline (precision, recall, NDCG), online (CTR, engagement, A/B tests), diversity metrics, serendipity.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
