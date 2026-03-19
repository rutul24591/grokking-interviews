"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-admin-backend-abuse-detection",
  title: "Abuse Detection Service",
  description: "Guide to implementing abuse detection covering pattern detection, automated enforcement, and appeals.",
  category: "functional-requirements",
  subcategory: "admin-moderation",
  slug: "abuse-detection-service",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "admin", "abuse-detection", "security", "backend"],
  relatedTopics: ["moderation", "fraud-detection", "machine-learning"],
};

export default function AbuseDetectionServiceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Abuse Detection Service</strong> identifies and responds to 
          abusive behavior patterns including harassment, spam, and coordinated 
          manipulation.
        </p>
      </section>

      <section>
        <h2>Detection Patterns</h2>
        <ul className="space-y-3">
          <li><strong>Harassment:</strong> Repeated unwanted contact.</li>
          <li><strong>Spam:</strong> Bulk unsolicited messages.</li>
          <li><strong>Brigading:</strong> Coordinated mass reporting/attacks.</li>
          <li><strong>Bot Networks:</strong> Coordinated inauthentic behavior.</li>
        </ul>
      </section>

      <section>
        <h2>Automated Response</h2>
        <ul className="space-y-3">
          <li><strong>Rate Limit:</strong> Limit abusive accounts.</li>
          <li><strong>Shadow Ban:</strong> Limit content visibility.</li>
          <li><strong>Suspend:</strong> Temporary suspension.</li>
          <li><strong>Appeal:</strong> Appeal process for false positives.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you detect coordinated abuse?</p>
            <p className="mt-2 text-sm">A: Graph analysis, temporal clustering, account linkage, behavior similarity.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you balance automation vs manual review?</p>
            <p className="mt-2 text-sm">A: Auto for clear cases (high confidence), manual for edge cases, human review for appeals.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
