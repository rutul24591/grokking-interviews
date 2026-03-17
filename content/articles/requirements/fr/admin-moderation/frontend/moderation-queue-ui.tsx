"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-admin-frontend-moderation-queue",
  title: "Moderation Queue UI",
  description: "Guide to implementing moderation queue covering content review, decision tracking, and queue management.",
  category: "functional-requirements",
  subcategory: "admin-moderation",
  slug: "moderation-queue-ui",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "admin", "moderation", "queue", "frontend"],
  relatedTopics: ["content-moderation", "admin-dashboard", "workflow"],
};

export default function ModerationQueueUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Moderation Queue UI</strong> enables moderators to review flagged 
          content efficiently, with tools for quick decisions and queue management.
        </p>
      </section>

      <section>
        <h2>Queue Display</h2>
        <ul className="space-y-3">
          <li><strong>Priority:</strong> High-risk content first.</li>
          <li><strong>Assignment:</strong> Auto-assign to moderators.</li>
          <li><strong>SLA:</strong> Track time in queue, alert on breach.</li>
        </ul>
      </section>

      <section>
        <h2>Review Interface</h2>
        <ul className="space-y-3">
          <li><strong>Content:</strong> Full content with context.</li>
          <li><strong>Actions:</strong> Approve, remove, escalate.</li>
          <li><strong>Shortcuts:</strong> Keyboard shortcuts for efficiency.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prioritize moderation queue?</p>
            <p className="mt-2 text-sm">A: Risk score, reporter count, content age, user impact (viral content first).</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure moderator quality?</p>
            <p className="mt-2 text-sm">A: QA sampling, calibration sessions, feedback loops, track accuracy metrics.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
