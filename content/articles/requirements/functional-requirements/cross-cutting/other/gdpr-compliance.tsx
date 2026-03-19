"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cross-other-gdpr-compliance",
  title: "GDPR Compliance",
  description: "Guide to GDPR compliance covering data subject rights, consent management, and data protection.",
  category: "functional-requirements",
  subcategory: "cross-cutting",
  slug: "gdpr-compliance",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "cross-cutting", "gdpr", "compliance", "privacy"],
  relatedTopics: ["privacy", "data-governance", "consent"],
};

export default function GDPRComplianceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>GDPR Compliance</strong> ensures compliance with EU General Data 
          Protection Regulation, protecting EU residents' data privacy rights.
        </p>
      </section>

      <section>
        <h2>Data Subject Rights</h2>
        <ul className="space-y-3">
          <li><strong>Access:</strong> Right to access personal data.</li>
          <li><strong>Rectification:</strong> Right to correct inaccurate data.</li>
          <li><strong>Erasure:</strong> Right to be forgotten.</li>
          <li><strong>Portability:</strong> Right to data portability.</li>
          <li><strong>Object:</strong> Right to object to processing.</li>
        </ul>
      </section>

      <section>
        <h2>Compliance Requirements</h2>
        <ul className="space-y-3">
          <li><strong>Consent:</strong> Explicit, informed consent.</li>
          <li><strong>DPO:</strong> Data Protection Officer.</li>
          <li><strong>Breach Notification:</strong> 72-hour breach notification.</li>
          <li><strong>DPIA:</strong> Data Protection Impact Assessment.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle data subject requests?</p>
            <p className="mt-2 text-sm">A: Verify identity, 30-day SLA, export/delete from all systems, document completion.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure ongoing compliance?</p>
            <p className="mt-2 text-sm">A: Regular audits, DPO oversight, staff training, privacy by design, documentation.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
