"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-backend-content-moderation",
  title: "Content Moderation",
  description: "Guide to implementing content moderation covering auto-moderation, human review, and policy enforcement.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "content-moderation",
  version: "extensive",
  wordCount: 7000,
  readingTime: 28,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "content", "moderation", "safety", "backend"],
  relatedTopics: ["publishing-workflow", "abuse-detection", "admin-moderation"],
};

export default function ContentModerationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Content Moderation</strong> ensures content complies with platform policies 
          through automated detection and human review. It protects users from harmful content 
          while balancing free expression and scale.
        </p>
      </section>

      <section>
        <h2>Moderation Approaches</h2>
        <ul className="space-y-3">
          <li><strong>Pre-moderation:</strong> Review before publishing. Safe but slow.</li>
          <li><strong>Post-moderation:</strong> Review after publishing. Fast but risk.</li>
          <li><strong>Reactive:</strong> Review when reported. Scalable but reactive.</li>
          <li><strong>Auto-moderation:</strong> ML-based detection. Fast, scalable, imperfect.</li>
        </ul>
      </section>

      <section>
        <h2>Auto-Moderation</h2>
        <ul className="space-y-3">
          <li><strong>ML Models:</strong> Hate speech, nudity, violence, spam detection.</li>
          <li><strong>Keyword Filters:</strong> Blocklist for prohibited terms.</li>
          <li><strong>Image Analysis:</strong> Computer vision for prohibited images.</li>
          <li><strong>Confidence Thresholds:</strong> Auto-approve/reject based on score.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle moderation at scale?</p>
            <p className="mt-2 text-sm">A: Auto-moderation for 90%+ (ML + rules), human review for edge cases, queue prioritization, moderator tools for efficiency.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle false positives?</p>
            <p className="mt-2 text-sm">A: Appeal process, human review queue, model retraining on false positives, threshold tuning.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
