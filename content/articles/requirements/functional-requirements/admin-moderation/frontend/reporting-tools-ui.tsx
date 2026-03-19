"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-admin-frontend-reporting-tools",
  title: "Reporting Tools UI",
  description: "Guide to implementing reporting tools covering abuse reports, report management, and reporter communication.",
  category: "functional-requirements",
  subcategory: "admin-moderation",
  slug: "reporting-tools-ui",
  version: "extensive",
  wordCount: 5000,
  readingTime: 20,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "admin", "reporting", "moderation", "frontend"],
  relatedTopics: ["moderation", "abuse-prevention", "user-safety"],
};

export default function ReportingToolsUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Reporting Tools UI</strong> enables users to report problematic 
          content and admins to manage reports effectively, protecting community 
          safety.
        </p>
      </section>

      <section>
        <h2>Report Flow</h2>
        <ul className="space-y-3">
          <li><strong>Categories:</strong> Spam, harassment, hate speech, etc.</li>
          <li><strong>Details:</strong> Optional description, evidence.</li>
          <li><strong>Anonymous:</strong> Option to report anonymously.</li>
        </ul>
      </section>

      <section>
        <h2>Report Management</h2>
        <ul className="space-y-3">
          <li><strong>Triage:</strong> Categorize, prioritize reports.</li>
          <li><strong>Action:</strong> Take action on reported content.</li>
          <li><strong>Feedback:</strong> Notify reporter of outcome.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle false reports?</p>
            <p className="mt-2 text-sm">A: Track reporter accuracy, penalize serial false reporters, auto-dismiss from low-accuracy reporters.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you protect reporters?</p>
            <p className="mt-2 text-sm">A: Anonymous reporting, don't reveal reporter identity, prevent retaliation, block reported users.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
