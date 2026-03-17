"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cross-frontend-error-handling",
  title: "Error Handling & Recovery",
  description: "Guide to implementing error handling covering error states, recovery options, and user-friendly messages.",
  category: "functional-requirements",
  subcategory: "cross-cutting",
  slug: "error-handling-recovery",
  version: "extensive",
  wordCount: 5000,
  readingTime: 20,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "cross-cutting", "error-handling", "ux", "frontend"],
  relatedTopics: ["error-boundaries", "retry-logic", "ux"],
};

export default function ErrorHandlingRecoveryArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Error Handling &amp; Recovery</strong> provides graceful degradation 
          and clear recovery paths when things go wrong, maintaining user trust and 
          reducing frustration.
        </p>
      </section>

      <section>
        <h2>Error States</h2>
        <ul className="space-y-3">
          <li><strong>Network:</strong> Offline, slow connection.</li>
          <li><strong>Server:</strong> 500 errors, maintenance.</li>
          <li><strong>Client:</strong> Validation errors, permission denied.</li>
        </ul>
      </section>

      <section>
        <h2>Error Messages</h2>
        <ul className="space-y-3">
          <li><strong>Clear:</strong> What went wrong in plain language.</li>
          <li><strong>Actionable:</strong> What user can do to fix.</li>
          <li><strong>Helpful:</strong> Support contact, status page link.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle partial failures?</p>
            <p className="mt-2 text-sm">A: Degrade gracefully, show what works, retry failed parts, don't block entire experience.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you design error recovery?</p>
            <p className="mt-2 text-sm">A: Retry button, alternative actions, save state, clear next steps, support escalation.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
