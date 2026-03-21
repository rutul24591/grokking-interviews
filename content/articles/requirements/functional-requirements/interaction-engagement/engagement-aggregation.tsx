"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-int-backend-engagement-aggregation",
  title: "Engagement Aggregation",
  description: "Guide to implementing engagement aggregation covering real-time counters, batch aggregation, and trending computation.",
  category: "functional-requirements",
  subcategory: "interaction-engagement",
  slug: "engagement-aggregation",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "interaction", "aggregation", "counters", "backend"],
  relatedTopics: ["engagement-tracking", "trending", "real-time-systems"],
};

export default function EngagementAggregationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Engagement Aggregation</strong> combines individual interactions into 
          meaningful metrics (total likes, engagement rate) for display and analysis.
        </p>
      </section>

      <section>
        <h2>Aggregation Patterns</h2>
        <ul className="space-y-3">
          <li><strong>Real-time:</strong> Redis counters for immediate updates.</li>
          <li><strong>Batch:</strong> Periodic aggregation (hourly, daily).</li>
          <li><strong>Hybrid:</strong> Real-time for display, batch for analytics.</li>
        </ul>
      </section>

      <section>
        <h2>Metrics</h2>
        <ul className="space-y-3">
          <li><strong>Totals:</strong> Total likes, comments, shares.</li>
          <li><strong>Rates:</strong> Engagement rate (engagements/views).</li>
          <li><strong>Trends:</strong> Engagement over time.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you aggregate engagement for viral content?</p>
            <p className="mt-2 text-sm">A: Shard counters, distributed aggregation, approximate counts (HyperLogLog) for extreme scale.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle aggregation failures?</p>
            <p className="mt-2 text-sm">A: Idempotent aggregation jobs, reprocess from event log, monitor lag, alert on failures.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
