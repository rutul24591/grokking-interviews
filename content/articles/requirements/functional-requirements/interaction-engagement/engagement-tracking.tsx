"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-int-backend-engagement-tracking",
  title: "Engagement Tracking",
  description: "Guide to implementing engagement tracking covering event collection, metrics computation, and fraud detection.",
  category: "functional-requirements",
  subcategory: "interaction-engagement",
  slug: "engagement-tracking",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "interaction", "tracking", "analytics", "backend"],
  relatedTopics: ["engagement-storage", "analytics", "fraud-detection"],
};

export default function EngagementTrackingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Engagement Tracking</strong> collects and analyzes user interaction 
          data to measure content performance, detect fraud, and optimize recommendations.
        </p>
      </section>

      <section>
        <h2>Event Collection</h2>
        <ul className="space-y-3">
          <li><strong>Events:</strong> View, like, comment, share, save, click.</li>
          <li><strong>Schema:</strong> event_type, user_id, content_id, timestamp, metadata.</li>
          <li><strong>Transport:</strong> Kafka, Kinesis for streaming.</li>
        </ul>
      </section>

      <section>
        <h2>Metrics Computation</h2>
        <ul className="space-y-3">
          <li><strong>Engagement Score:</strong> Weighted sum of interactions.</li>
          <li><strong>Aggregations:</strong> Hourly, daily, per-content metrics.</li>
          <li><strong>Storage:</strong> Time-series DB for trends.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you track engagement at scale?</p>
            <p className="mt-2 text-sm">A: Async event collection, batch processing, sample high-volume events, aggregate periodically.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you detect engagement fraud?</p>
            <p className="mt-2 text-sm">A: Pattern detection (rapid-fire, bot patterns), velocity checks, network analysis, ML models trained on known fraud.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
