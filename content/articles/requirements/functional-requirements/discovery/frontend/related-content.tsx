"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-frontend-related-content",
  title: "Related Content",
  description: "Guide to implementing related content recommendations covering similarity algorithms, placement, and personalization.",
  category: "functional-requirements",
  subcategory: "discovery",
  slug: "related-content",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "discovery", "related", "recommendations", "frontend"],
  relatedTopics: ["recommendation-carousel", "discovery", "engagement"],
};

export default function RelatedContentArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Related Content</strong> displays content similar to what the user 
          is currently viewing, increasing engagement and session duration through 
          relevant discovery.
        </p>
      </section>

      <section>
        <h2>Similarity Signals</h2>
        <ul className="space-y-3">
          <li><strong>Tags/Categories:</strong> Same tags or categories.</li>
          <li><strong>Author:</strong> Same author or creator.</li>
          <li><strong>Co-engagement:</strong> Users who viewed X also viewed Y.</li>
          <li><strong>Content Similarity:</strong> Text similarity, embedding distance.</li>
        </ul>
      </section>

      <section>
        <h2>Placement</h2>
        <ul className="space-y-3">
          <li><strong>Sidebar:</strong> Desktop sidebar, always visible.</li>
          <li><strong>Below Content:</strong> After article ends.</li>
          <li><strong>In-feed:</strong> Interspersed in feed every N items.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you compute related content?</p>
            <p className="mt-2 text-sm">A: Pre-compute offline (batch job), cache results, update on content change. Use collaborative filtering + content similarity.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How many related items to show?</p>
            <p className="mt-2 text-sm">A: 5-10 items. Enough for choice, not overwhelming. Test different counts for optimal engagement.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
