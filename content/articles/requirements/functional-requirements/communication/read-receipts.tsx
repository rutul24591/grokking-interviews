"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-comm-frontend-read-receipts",
  title: "Read Receipts",
  description: "Guide to implementing read receipts covering delivery status, read status, and privacy controls.",
  category: "functional-requirements",
  subcategory: "communication",
  slug: "read-receipts",
  version: "extensive",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "communication", "read-receipts", "messaging", "frontend"],
  relatedTopics: ["chat", "presence", "privacy"],
};

export default function ReadReceiptsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Read Receipts</strong> show message delivery and read status, 
          providing senders visibility into message consumption while respecting 
          recipient privacy preferences.
        </p>
      </section>

      <section>
        <h2>Status Indicators</h2>
        <ul className="space-y-3">
          <li><strong>Sent:</strong> Single checkmark.</li>
          <li><strong>Delivered:</strong> Double checkmark (gray).</li>
          <li><strong>Read:</strong> Double checkmark (blue/colored).</li>
        </ul>
      </section>

      <section>
        <h2>Privacy Controls</h2>
        <ul className="space-y-3">
          <li><strong>Toggle:</strong> Enable/disable read receipts.</li>
          <li><strong>Reciprocal:</strong> If disabled, can't see others' receipts.</li>
          <li><strong>Per-Chat:</strong> Different settings per conversation.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When do you mark message as read?</p>
            <p className="mt-2 text-sm">A: When visible in viewport for X seconds, not just opened. Batch read receipts to reduce traffic.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle read receipts in group chat?</p>
            <p className="mt-2 text-sm">A: Per-member read status, "Read by 5 of 10 members", expandable to see who read.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
