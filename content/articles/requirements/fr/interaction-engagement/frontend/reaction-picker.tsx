"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-int-frontend-reaction-picker",
  title: "Reaction Picker",
  description: "Guide to implementing reaction pickers covering emoji reactions, quick reactions, and reaction display.",
  category: "functional-requirements",
  subcategory: "interaction-engagement",
  slug: "reaction-picker",
  version: "extensive",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "interaction", "reactions", "emoji", "frontend"],
  relatedTopics: ["like-button", "engagement", "emoji-picker"],
};

export default function ReactionPickerArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Reaction Picker</strong> extends simple likes with emotional reactions, 
          enabling nuanced expression of user sentiment toward content.
        </p>
      </section>

      <section>
        <h2>Implementation</h2>
        <ul className="space-y-3">
          <li><strong>Trigger:</strong> Long press or hover on like button.</li>
          <li><strong>Reactions:</strong> Like, love, laugh, wow, sad, angry.</li>
          <li><strong>Animation:</strong> Pop up animation, haptic feedback.</li>
          <li><strong>Selection:</strong> Slide to select, release to confirm.</li>
        </ul>
      </section>

      <section>
        <h2>Reaction Display</h2>
        <ul className="space-y-3">
          <li><strong>Summary:</strong> Show reaction counts by type.</li>
          <li><strong>Tooltip:</strong> "John and 49 others loved this".</li>
          <li><strong>Top Reactors:</strong> Show first few reactors.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle reaction changes?</p>
            <p className="mt-2 text-sm">A: Allow changing reaction, update count atomically, optimistic update with rollback.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you store reactions?</p>
            <p className="mt-2 text-sm">A: Junction table (user_id, content_id, reaction_type), index for counting, cache reaction counts.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
