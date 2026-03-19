"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-backend-content-validation",
  title: "Content Validation",
  description: "Guide to implementing content validation covering input validation, policy enforcement, and quality checks.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "content-validation",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "content", "validation", "quality", "backend"],
  relatedTopics: ["crud-apis", "content-moderation", "spam-detection"],
};

export default function ContentValidationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Content Validation</strong> ensures content meets quality standards, 
          complies with policies, and is free from spam or malicious content before 
          publication.
        </p>
      </section>

      <section>
        <h2>Validation Layers</h2>
        <ul className="space-y-3">
          <li><strong>Format:</strong> Length limits, required fields, character encoding.</li>
          <li><strong>Policy:</strong> Prohibited content, spam detection, plagiarism.</li>
          <li><strong>Quality:</strong> Readability, completeness, duplicate detection.</li>
          <li><strong>Security:</strong> XSS prevention, link validation, malware scan.</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <ul className="space-y-3">
          <li><strong>Client-side:</strong> Immediate feedback, reduces server load.</li>
          <li><strong>Server-side:</strong> Authoritative validation, never trust client.</li>
          <li><strong>Async:</strong> Heavy checks (plagiarism) run asynchronously.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you validate content length?</p>
            <p className="mt-2 text-sm">A: Client-side character count, server-side byte length check, consider Unicode, truncate gracefully.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you detect duplicate content?</p>
            <p className="mt-2 text-sm">A: Hash comparison, fuzzy matching (shingling), external plagiarism APIs, threshold-based flagging.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
