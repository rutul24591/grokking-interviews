"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cross-backend-distributed-tracing",
  title: "Distributed Tracing",
  description: "Guide to implementing distributed tracing covering trace propagation, span collection, and observability.",
  category: "functional-requirements",
  subcategory: "cross-cutting",
  slug: "distributed-tracing",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "cross-cutting", "tracing", "observability", "backend"],
  relatedTopics: ["monitoring", "microservices", "debugging"],
};

export default function DistributedTracingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Distributed Tracing</strong> tracks requests across service 
          boundaries, enabling debugging and performance analysis in distributed 
          systems.
        </p>
      </section>

      <section>
        <h2>Trace Components</h2>
        <ul className="space-y-3">
          <li><strong>Trace:</strong> End-to-end request journey.</li>
          <li><strong>Span:</strong> Individual operation within trace.</li>
          <li><strong>Context:</strong> Trace ID, span ID propagated across services.</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <ul className="space-y-3">
          <li><strong>Libraries:</strong> OpenTelemetry, Jaeger, Zipkin.</li>
          <li><strong>Propagation:</strong> HTTP headers, gRPC metadata.</li>
          <li><strong>Sampling:</strong> Sample traces to reduce overhead.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle trace context propagation?</p>
            <p className="mt-2 text-sm">A: Standard headers (traceparent), automatic instrumentation, context managers, async context propagation.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you sample traces?</p>
            <p className="mt-2 text-sm">A: Head-based (at start), tail-based (after completion), adaptive sampling based on load.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
