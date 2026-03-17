"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-int-backend-activity-feeds",
  title: "Activity Feeds",
  description: "Guide to implementing activity feeds covering activity generation, feed ranking, and notification digests.",
  category: "functional-requirements",
  subcategory: "interaction-engagement",
  slug: "activity-feeds",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "interaction", "activity-feed", "notifications", "backend"],
  relatedTopics: ["notifications", "feed-generation", "real-time-systems"],
};

export default function ActivityFeedsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Activity Feeds</strong> track and display user actions and interactions, 
          enabling social awareness and engagement notifications.
        </p>
      </section>

      <section>
        <h2>Activity Generation</h2>
        <ul className="space-y-3">
          <li><strong>Events:</strong> Like, comment, share, follow.</li>
          <li><strong>Storage:</strong> Activity stream (GetStream, custom on Kafka).</li>
          <li><strong>Fan-out:</strong> Push to follower feeds for real-time.</li>
        </ul>
      </section>

      <section>
        <h2>Feed Ranking</h2>
        <ul className="space-y-3">
          <li><strong>Affinity:</strong> Close connections first.</li>
          <li><strong>Recency:</strong> Time decay function.</li>
          <li><strong>Importance:</strong> Comments {'>'} likes.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you generate activity feeds?</p>
            <p className="mt-2 text-sm">A: Event-driven architecture, publish activity on interaction, fan-out to followers, store in Redis for fast access.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle digest notifications?</p>
            <p className="mt-2 text-sm">A: Aggregate activities over time window, group by type/content, send summary notification with top activities.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
