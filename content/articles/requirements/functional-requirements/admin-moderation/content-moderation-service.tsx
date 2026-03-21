"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-admin-backend-content-moderation-service",
  title: "Content Moderation Service",
  description: "Guide to implementing content moderation services covering auto-moderation, human review, and policy enforcement.",
  category: "functional-requirements",
  subcategory: "admin-moderation",
  slug: "content-moderation-service",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "admin", "moderation", "content-safety", "backend"],
  relatedTopics: ["abuse-detection", "ml-moderation", "policy-enforcement"],
};

export default function ContentModerationServiceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Content Moderation Service</strong> enforces content policies 
          through automated detection and human review, protecting users from 
          harmful content.
        </p>
      </section>

      <section>
        <h2>Moderation Pipeline</h2>
        <ul className="space-y-3">
          <li><strong>Pre-Moderation:</strong> Review before publishing.</li>
          <li><strong>Post-Moderation:</strong> Review after publishing.</li>
          <li><strong>Reactive:</strong> Review when reported.</li>
        </ul>
      </section>

      <section>
        <h2>ML Moderation</h2>
        <ul className="space-y-3">
          <li><strong>Models:</strong> Hate speech, nudity, violence, spam.</li>
          <li><strong>Thresholds:</strong> Auto-action based on confidence.</li>
          <li><strong>Human Review:</strong> Edge cases to moderators.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle moderation at scale?</p>
            <p className="mt-2 text-sm">A: Auto-moderation for 90%+, human review for edge cases, queue prioritization, moderator tools.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle cross-cultural content?</p>
            <p className="mt-2 text-sm">A: Region-specific policies, local moderators, cultural context training, appeal process.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
