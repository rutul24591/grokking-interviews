"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-int-frontend-like-button",
  title: "Like Button",
  description: "Guide to implementing like buttons covering toggle behavior, optimistic updates, and reaction pickers.",
  category: "functional-requirements",
  subcategory: "interaction-engagement",
  slug: "like-button",
  version: "extensive",
  wordCount: 5000,
  readingTime: 20,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "interaction", "likes", "engagement", "frontend"],
  relatedTopics: ["reactions", "engagement-tracking", "real-time-updates"],
};

export default function LikeButtonArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Like Button</strong> is the most basic engagement action, allowing users 
          to express approval with a single click. It must provide instant feedback and 
          handle edge cases gracefully.
        </p>
      </section>

      <section>
        <h2>Implementation</h2>
        <ul className="space-y-3">
          <li><strong>Toggle:</strong> Like/unlike with visual state change.</li>
          <li><strong>Optimistic Update:</strong> Update UI immediately, sync to server.</li>
          <li><strong>Animation:</strong> Heart/fill animation on like.</li>
          <li><strong>Count:</strong> Display like count with abbreviation (1.2K).</li>
        </ul>
      </section>

      <section>
        <h2>Reaction Picker</h2>
        <ul className="space-y-3">
          <li><strong>Long Press:</strong> Show reaction options on long press.</li>
          <li><strong>Reactions:</strong> Like, love, laugh, wow, sad, angry.</li>
          <li><strong>Default:</strong> Tap = default reaction (like).</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle like failures?</p>
            <p className="mt-2 text-sm">A: Revert optimistic update on error, show toast notification, retry automatically.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent rapid toggling?</p>
            <p className="mt-2 text-sm">A: Debounce clicks, disable button during API call, queue state changes.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
