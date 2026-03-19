"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cross-frontend-performance-optimization",
  title: "Performance Optimization",
  description: "Guide to implementing performance optimization covering loading states, lazy loading, and perceived performance.",
  category: "functional-requirements",
  subcategory: "cross-cutting",
  slug: "performance-optimization",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "cross-cutting", "performance", "optimization", "frontend"],
  relatedTopics: ["web-vitals", "lazy-loading", "caching"],
};

export default function PerformanceOptimizationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Performance Optimization</strong> ensures fast, responsive user 
          experiences through efficient loading, rendering, and perceived performance 
          techniques.
        </p>
      </section>

      <section>
        <h2>Loading States</h2>
        <ul className="space-y-3">
          <li><strong>Skeleton Screens:</strong> Placeholder content structure.</li>
          <li><strong>Spinners:</strong> For indeterminate waits.</li>
          <li><strong>Progress:</strong> For known duration operations.</li>
        </ul>
      </section>

      <section>
        <h2>Optimization Techniques</h2>
        <ul className="space-y-3">
          <li><strong>Lazy Loading:</strong> Load content on demand.</li>
          <li><strong>Code Splitting:</strong> Split bundles by route.</li>
          <li><strong>Caching:</strong> Cache API responses, assets.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you improve perceived performance?</p>
            <p className="mt-2 text-sm">A: Skeleton screens, optimistic updates, progressive loading, prioritize above-fold content.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you measure performance?</p>
            <p className="mt-2 text-sm">A: Core Web Vitals (LCP, FID, CLS), RUM, synthetic monitoring, performance budgets.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
