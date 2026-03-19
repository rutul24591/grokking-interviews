"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cross-backend-circuit-breaker",
  title: "Circuit Breaker Pattern",
  description: "Guide to implementing circuit breakers covering failure detection, state management, and recovery.",
  category: "functional-requirements",
  subcategory: "cross-cutting",
  slug: "circuit-breaker-pattern",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "cross-cutting", "circuit-breaker", "resilience", "backend"],
  relatedTopics: ["fault-tolerance", "resilience", "microservices"],
};

export default function CircuitBreakerPatternArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Circuit Breaker</strong> prevents cascading failures by stopping
          requests to failing services, allowing them to recover while failing fast
          for callers.
        </p>
      </section>

      <section>
        <h2>States</h2>
        <ul className="space-y-3">
          <li><strong>Closed:</strong> Normal operation, requests pass through.</li>
          <li><strong>Open:</strong> Failing fast, requests rejected immediately.</li>
          <li><strong>Half-Open:</strong> Testing recovery, limited requests allowed.</li>
        </ul>
      </section>

      <section>
        <h2>Configuration</h2>
        <ul className="space-y-3">
          <li><strong>Failure Threshold:</strong> Failures before opening.</li>
          <li><strong>Timeout:</strong> Time in open state.</li>
          <li><strong>Success Threshold:</strong> Successes to close from half-open.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you choose failure thresholds?</p>
            <p className="mt-2 text-sm">A: Based on error rates, traffic volume, service criticality. Start conservative, tune based on incidents.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle circuit breaker in microservices?</p>
            <p className="mt-2 text-sm">A: Per-service circuit breakers, fallback responses, bulkhead isolation, monitoring and alerting.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
