"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cross-backend-data-governance",
  title: "Data Governance",
  description: "Guide to implementing data governance covering data classification, access controls, and retention policies.",
  category: "functional-requirements",
  subcategory: "cross-cutting",
  slug: "data-governance",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "cross-cutting", "data-governance", "compliance", "backend"],
  relatedTopics: ["privacy", "security", "compliance"],
};

export default function DataGovernanceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Data Governance</strong> establishes policies and processes for 
          managing data assets including classification, access, retention, and 
          quality.
        </p>
      </section>

      <section>
        <h2>Data Classification</h2>
        <ul className="space-y-3">
          <li><strong>Public:</strong> Can be shared publicly.</li>
          <li><strong>Internal:</strong> For internal use only.</li>
          <li><strong>Confidential:</strong> Sensitive business data.</li>
          <li><strong>PII:</strong> Personal identifiable information.</li>
        </ul>
      </section>

      <section>
        <h2>Access Controls</h2>
        <ul className="space-y-3">
          <li><strong>RBAC:</strong> Role-based access.</li>
          <li><strong>ABAC:</strong> Attribute-based access.</li>
          <li><strong>Audit:</strong> Log all data access.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement data retention?</p>
            <p className="mt-2 text-sm">A: Retention policies per data type, automated deletion, legal holds, archive cold data.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure data quality?</p>
            <p className="mt-2 text-sm">A: Validation at ingestion, data quality metrics, monitoring, data stewardship.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
