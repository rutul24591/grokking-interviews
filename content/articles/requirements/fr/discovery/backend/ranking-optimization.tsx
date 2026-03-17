"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-backend-ranking-optimization",
  title: "Ranking Optimization",
  description: "Guide to implementing ranking optimization covering A/B testing, feature engineering, and model training.",
  category: "functional-requirements",
  subcategory: "discovery",
  slug: "ranking-optimization",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "discovery", "ranking", "optimization", "ml", "backend"],
  relatedTopics: ["search-ranking", "recommendation-algorithms", "ab-testing"],
};

export default function RankingOptimizationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Ranking Optimization</strong> continuously improves result ordering 
          through experimentation, feature engineering, and model refinement to maximize 
          user satisfaction and engagement.
        </p>
      </section>

      <section>
        <h2>Feature Engineering</h2>
        <ul className="space-y-3">
          <li><strong>Content Features:</strong> Length, quality score, media count.</li>
          <li><strong>User Features:</strong> Engagement history, preferences, location.</li>
          <li><strong>Context Features:</strong> Time of day, device, session info.</li>
          <li><strong>Interaction Features:</strong> Past CTR, dwell time, conversion.</li>
        </ul>
      </section>

      <section>
        <h2>Model Training</h2>
        <ul className="space-y-3">
          <li><strong>Training Data:</strong> Historical impressions and clicks.</li>
          <li><strong>Labels:</strong> Click (binary), engagement score (continuous).</li>
          <li><strong>Validation:</strong> Time-based split, avoid leakage.</li>
          <li><strong>Online Learning:</strong> Update model with recent data.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you A/B test ranking changes?</p>
            <p className="mt-2 text-sm">A: Randomize users to control/treatment, run for statistical significance, measure primary metrics (CTR, engagement), guardrail metrics (latency).</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle feature importance?</p>
            <p className="mt-2 text-sm">A: Permutation importance, SHAP values, ablation studies. Monitor feature drift over time.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
