"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-admin-other-legal-requests",
  title: "Legal Request Management",
  description: "Guide to handling legal requests covering subpoenas, DMCA takedowns, and law enforcement requests.",
  category: "functional-requirements",
  subcategory: "admin-moderation",
  slug: "legal-request-management",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "admin", "legal", "compliance", "process"],
  relatedTopics: ["compliance", "content-moderation", "data-requests"],
};

export default function LegalRequestManagementArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Legal Request Management</strong> handles legal requests including 
          subpoenas, DMCA takedowns, and law enforcement requests while protecting 
          user rights and complying with legal obligations.
        </p>
      </section>

      <section>
        <h2>Request Types</h2>
        <ul className="space-y-3">
          <li><strong>Subpoenas:</strong> Court-ordered data requests.</li>
          <li><strong>DMCA:</strong> Copyright takedown notices.</li>
          <li><strong>Law Enforcement:</strong> Emergency data requests.</li>
          <li><strong>Government:</strong> Government data requests.</li>
        </ul>
      </section>

      <section>
        <h2>Processing Workflow</h2>
        <ul className="space-y-3">
          <li><strong>Validation:</strong> Verify request legitimacy.</li>
          <li><strong>Review:</strong> Legal team review.</li>
          <li><strong>Response:</strong> Comply or challenge.</li>
          <li><strong>Notify:</strong> Notify user if permitted.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle emergency requests?</p>
            <p className="mt-2 text-sm">A: Expedited process, verify credentials, minimal data, document everything, follow-up validation.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle DMCA counter-notices?</p>
            <p className="mt-2 text-sm">A: Forward to claimant, 10-14 day waiting period, restore if no lawsuit, track repeat infringers.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
