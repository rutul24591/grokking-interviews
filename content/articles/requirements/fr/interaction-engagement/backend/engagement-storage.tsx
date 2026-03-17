"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-int-backend-engagement-storage",
  title: "Engagement Storage",
  description: "Guide to implementing engagement storage covering interaction tables, counter caching, and aggregation.",
  category: "functional-requirements",
  subcategory: "interaction-engagement",
  slug: "engagement-storage",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "interaction", "storage", "database", "backend"],
  relatedTopics: ["interaction-apis", "caching", "engagement-tracking"],
};

export default function EngagementStorageArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Engagement Storage</strong> persists user interactions (likes, comments, 
          shares) efficiently while enabling fast count retrieval and aggregation for 
          analytics.
        </p>
      </section>

      <section>
        <h2>Schema Design</h2>
        <ul className="space-y-3">
          <li><strong>Interactions Table:</strong> user_id, content_id, type, created_at.</li>
          <li><strong>Indexes:</strong> (content_id, type) for counts, (user_id) for user history.</li>
          <li><strong>Partitioning:</strong> By date or content_id for scale.</li>
        </ul>
      </section>

      <section>
        <h2>Counter Caching</h2>
        <ul className="space-y-3">
          <li><strong>Redis:</strong> INCR/DECR for atomic count updates.</li>
          <li><strong>Periodic Flush:</strong> Sync to database every 5 min.</li>
          <li><strong>Eventual Consistency:</strong> Accept slight count delays.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you count likes at scale?</p>
            <p className="mt-2 text-sm">A: Cache in Redis, async flush to DB, eventual consistency acceptable, shard counters for viral content.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you store billions of interactions?</p>
            <p className="mt-2 text-sm">A: NoSQL (Cassandra, DynamoDB), partition by content_id, TTL for old interactions, aggregate tables for analytics.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
