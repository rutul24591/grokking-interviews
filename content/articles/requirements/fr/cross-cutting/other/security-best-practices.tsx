"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cross-other-security-best-practices",
  title: "Security Best Practices",
  description: "Guide to security best practices covering OWASP Top 10, secure development, and security testing.",
  category: "functional-requirements",
  subcategory: "cross-cutting",
  slug: "security-best-practices",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "cross-cutting", "security", "owasp", "best-practices"],
  relatedTopics: ["authentication", "authorization", "encryption"],
};

export default function SecurityBestPracticesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Security Best Practices</strong> provide foundational security 
          controls across all system components, protecting against common 
          vulnerabilities and attacks.
        </p>
      </section>

      <section>
        <h2>OWASP Top 10</h2>
        <ul className="space-y-3">
          <li><strong>Injection:</strong> SQL, NoSQL, command injection prevention.</li>
          <li><strong>Broken Auth:</strong> MFA, session management.</li>
          <li><strong>Sensitive Data:</strong> Encryption at rest and transit.</li>
          <li><strong>XXE:</strong> XML external entity prevention.</li>
          <li><strong>Broken Access Control:</strong> RBAC, authorization checks.</li>
        </ul>
      </section>

      <section>
        <h2>Secure Development</h2>
        <ul className="space-y-3">
          <li><strong>Training:</strong> Security awareness for developers.</li>
          <li><strong>Code Review:</strong> Security-focused code review.</li>
          <li><strong>SAST/DAST:</strong> Automated security testing.</li>
          <li><strong>Dependencies:</strong> Vulnerability scanning.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent SQL injection?</p>
            <p className="mt-2 text-sm">A: Parameterized queries, ORM, input validation, least privilege database accounts.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement defense in depth?</p>
            <p className="mt-2 text-sm">A: Multiple security layers, network segmentation, WAF, input validation, output encoding, monitoring.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
