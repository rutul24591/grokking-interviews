"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-int-backend-interaction-apis",
  title: "Interaction APIs",
  description: "Guide to implementing interaction APIs covering like, comment, share endpoints with idempotency and rate limiting.",
  category: "functional-requirements",
  subcategory: "interaction-engagement",
  slug: "interaction-apis",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "interaction", "api", "backend", "engagement"],
  relatedTopics: ["engagement-tracking", "rate-limiting", "idempotency"],
};

export default function InteractionAPIsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Interaction APIs</strong> provide backend endpoints for user engagement 
          actions (likes, comments, shares) with proper validation, authorization, and 
          scalability.
        </p>
      </section>

      <section>
        <h2>API Design</h2>
        <ul className="space-y-3">
          <li><strong>Like:</strong> POST /content/:id/like, DELETE to unlike.</li>
          <li><strong>Comment:</strong> POST /content/:id/comments, nested replies.</li>
          <li><strong>Share:</strong> POST /content/:id/share with destination.</li>
          <li><strong>Idempotency:</strong> Support idempotency keys for retries.</li>
        </ul>
      </section>

      <section>
        <h2>Rate Limiting</h2>
        <ul className="space-y-3">
          <li><strong>Per User:</strong> 100 likes/min, 20 comments/min.</li>
          <li><strong>Per IP:</strong> Global rate limits.</li>
          <li><strong>Response:</strong> 429 with Retry-After header.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle concurrent likes?</p>
            <p className="mt-2 text-sm">A: Idempotent API, unique constraint (user_id, content_id), upsert operation, optimistic locking.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you scale interaction APIs?</p>
            <p className="mt-2 text-sm">A: Async processing via queue, cache counts, eventual consistency for counts, shard by content_id.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
