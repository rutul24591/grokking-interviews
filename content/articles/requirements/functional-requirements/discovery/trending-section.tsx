"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-frontend-trending-section",
  title: "Trending Section",
  description: "Guide to implementing trending sections covering real-time trends, trend velocity, and geographic trends.",
  category: "functional-requirements",
  subcategory: "discovery",
  slug: "trending-section",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "discovery", "trending", "real-time", "frontend"],
  relatedTopics: ["trending-computation", "feed-display", "discovery"],
};

export default function TrendingSectionArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Trending Section</strong> displays content that is currently popular 
          or rapidly gaining engagement, helping users discover what's happening now.
        </p>
      </section>

      <section>
        <h2>Trend Display</h2>
        <ul className="space-y-3">
          <li><strong>Rank:</strong> 1, 2, 3... with trend indicator (↑).</li>
          <li><strong>Velocity:</strong> Show growth rate ("↑ 50% today").</li>
          <li><strong>Category:</strong> News, Sports, Entertainment, etc.</li>
          <li><strong>Location:</strong> Local, national, global trends.</li>
        </ul>
      </section>

      <section>
        <h2>Update Frequency</h2>
        <ul className="space-y-3">
          <li><strong>Real-time:</strong> Update every 5-15 minutes.</li>
          <li><strong>Refresh:</strong> Pull-to-refresh on mobile.</li>
          <li><strong>Stale Indicator:</strong> Show last updated time.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you compute trending?</p>
            <p className="mt-2 text-sm">A: Velocity × log(volume) / time_decay. Track over sliding windows (1h, 6h, 24h). Use stream processing.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent trend manipulation?</p>
            <p className="mt-2 text-sm">A: Detect bot activity, weight by user quality, limit impact of new accounts, human review for suspicious trends.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
