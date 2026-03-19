"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-backend-publishing-workflow",
  title: "Publishing Workflow",
  description: "Guide to implementing publishing workflows covering content states, approval chains, and scheduled publishing.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "publishing-workflow",
  version: "extensive",
  wordCount: 6500,
  readingTime: 26,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "content", "publishing", "workflow", "backend"],
  relatedTopics: ["content-scheduling", "content-moderation", "content-lifecycle"],
};

export default function PublishingWorkflowArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Publishing Workflow</strong> defines the process content goes through from 
          creation to publication, including review, approval, scheduling, and lifecycle 
          management. It ensures content quality and compliance before going live.
        </p>
      </section>

      <section>
        <h2>Content States</h2>
        <ul className="space-y-3">
          <li><strong>Draft:</strong> Work in progress, visible only to author.</li>
          <li><strong>Pending Review:</strong> Submitted for approval.</li>
          <li><strong>Approved:</strong> Ready for publication.</li>
          <li><strong>Scheduled:</strong> Queued for future publication.</li>
          <li><strong>Published:</strong> Live and visible.</li>
          <li><strong>Archived:</strong> Unpublished but retained.</li>
        </ul>
      </section>

      <section>
        <h2>Approval Chains</h2>
        <ul className="space-y-3">
          <li><strong>Single Approver:</strong> One reviewer approves.</li>
          <li><strong>Multi-level:</strong> Editor → Legal → Compliance.</li>
          <li><strong>Conditional:</strong> Based on content type, author, topic.</li>
          <li><strong>SLA:</strong> Auto-escalate if no response in 48 hours.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement state machine for content?</p>
            <p className="mt-2 text-sm">A: Define states and valid transitions. Validate before each transition. Store state history. Use state machine library or custom implementation.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle scheduled publishing?</p>
            <p className="mt-2 text-sm">A: Job scheduler checks every minute for due content. Publish, notify, update state. Handle failures with retry queue.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
