"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-backend-trending-computation",
  title: "Trending Computation",
  description: "Guide to implementing trending computation covering velocity calculation, time windows, and geographic trends.",
  category: "functional-requirements",
  subcategory: "discovery",
  slug: "trending-computation",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "discovery", "trending", "real-time", "backend"],
  relatedTopics: ["feed-generation", "stream-processing", "analytics"],
};

export default function TrendingComputationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Trending Computation</strong> identifies content gaining rapid 
          engagement, enabling real-time discovery of what's popular now.
        </p>
      </section>

      <section>
        <h2>Trending Score</h2>
        <ul className="space-y-3">
          <li><strong>Formula:</strong> velocity × log(volume) / (time_decay + 1)</li>
          <li><strong>Velocity:</strong> Rate of engagement increase (engagements/hour).</li>
          <li><strong>Volume:</strong> Absolute engagement count.</li>
          <li><strong>Time Decay:</strong> Older content gets lower score.</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <ul className="space-y-3">
          <li><strong>Stream Processing:</strong> Flink, Spark Streaming for real-time.</li>
          <li><strong>Time Windows:</strong> Sliding windows (1h, 6h, 24h).</li>
          <li><strong>Storage:</strong> Time-series DB (InfluxDB) or Redis sorted sets.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you compute trends in real-time?</p>
            <p className="mt-2 text-sm">A: Stream processing pipeline, sliding window aggregations, update scores every 5 minutes, cache top-K per category.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent trend manipulation?</p>
            <p className="mt-2 text-sm">A: Weight by user quality, detect bot patterns, limit impact of coordinated activity, human review for suspicious trends.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
