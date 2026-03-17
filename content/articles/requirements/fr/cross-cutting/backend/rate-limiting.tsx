"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cross-backend-rate-limiting",
  title: "Rate Limiting",
  description: "Guide to implementing rate limiting covering algorithms, distributed rate limiting, and abuse prevention.",
  category: "functional-requirements",
  subcategory: "cross-cutting",
  slug: "rate-limiting",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "cross-cutting", "rate-limiting", "api", "backend"],
  relatedTopics: ["api-design", "abuse-prevention", "scalability"],
};

export default function RateLimitingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Rate Limiting</strong> controls request frequency to protect 
          services from abuse, ensure fair usage, and maintain system stability.
        </p>
      </section>

      <section>
        <h2>Algorithms</h2>
        <ul className="space-y-3">
          <li><strong>Token Bucket:</strong> Tokens replenish over time.</li>
          <li><strong>Leaky Bucket:</strong> Fixed processing rate.</li>
          <li><strong>Sliding Window:</strong> Rolling time window.</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <ul className="space-y-3">
          <li><strong>Redis:</strong> Atomic operations for distributed counting.</li>
          <li><strong>Headers:</strong> Return limit headers (X-RateLimit-*).</li>
          <li><strong>Tiers:</strong> Different limits per user tier.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle distributed rate limiting?</p>
            <p className="mt-2 text-sm">A: Centralized Redis, CRDTs for eventual consistency, approximate counting for scale.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent rate limit bypass?</p>
            <p className="mt-2 text-sm">A: Multiple identifiers (IP, user, device), detect proxy usage, behavioral analysis.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
