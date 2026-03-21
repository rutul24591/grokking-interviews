"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cross-frontend-retry-mechanisms",
  title: "Retry Mechanisms",
  description: "Guide to implementing retry mechanisms covering exponential backoff, idempotency, and failure handling.",
  category: "functional-requirements",
  subcategory: "cross-cutting",
  slug: "retry-mechanisms",
  version: "extensive",
  wordCount: 5000,
  readingTime: 20,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "cross-cutting", "retry", "reliability", "frontend"],
  relatedTopics: ["idempotency", "error-handling", "reliability"],
};

export default function RetryMechanismsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Retry Mechanisms</strong> automatically retry failed operations to 
          handle transient failures, improving reliability without user intervention.
        </p>
      </section>

      <section>
        <h2>Retry Strategies</h2>
        <ul className="space-y-3">
          <li><strong>Exponential Backoff:</strong> 1s, 2s, 4s, 8s delays.</li>
          <li><strong>Jitter:</strong> Add randomness to prevent thundering herd.</li>
          <li><strong>Max Retries:</strong> Limit retry attempts (3-5).</li>
        </ul>
      </section>

      <section>
        <h2>When to Retry</h2>
        <ul className="space-y-3">
          <li><strong>Retry:</strong> Network errors, 503, timeouts.</li>
          <li><strong>Don't Retry:</strong> 400, 401, 403, 404.</li>
          <li><strong>Idempotent:</strong> Only retry idempotent operations.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent retry storms?</p>
            <p className="mt-2 text-sm">A: Jitter, backoff, retry budgets, circuit breakers, rate limiting.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle non-idempotent operations?</p>
            <p className="mt-2 text-sm">A: Idempotency keys, check status before retry, use idempotent APIs, manual review for failures.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
