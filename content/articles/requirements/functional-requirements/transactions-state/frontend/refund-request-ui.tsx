"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-trans-frontend-refund-ui",
  title: "Refund Request UI",
  description: "Guide to implementing refund request interfaces covering refund initiation, reason selection, and status tracking.",
  category: "functional-requirements",
  subcategory: "transactions-state",
  slug: "refund-request-ui",
  version: "extensive",
  wordCount: 5000,
  readingTime: 20,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "transactions", "refund", "customer-service", "frontend"],
  relatedTopics: ["payments", "order-management", "customer-support"],
};

export default function RefundRequestUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Refund Request UI</strong> enables users to request refunds for 
          purchases, providing a self-service alternative to support contact while 
          managing expectations and preventing abuse.
        </p>
      </section>

      <section>
        <h2>Refund Flow</h2>
        <ul className="space-y-3">
          <li><strong>Eligibility:</strong> Check refund window, item status.</li>
          <li><strong>Reason:</strong> Select reason, optional details.</li>
          <li><strong>Confirmation:</strong> Show refund amount, timeline.</li>
          <li><strong>Tracking:</strong> Status updates via email/notification.</li>
        </ul>
      </section>

      <section>
        <h2>Refund Options</h2>
        <ul className="space-y-3">
          <li><strong>Full Refund:</strong> Full amount back.</li>
          <li><strong>Partial Refund:</strong> Partial amount (restocking fee).</li>
          <li><strong>Store Credit:</strong> Credit for future purchase.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent refund abuse?</p>
            <p className="mt-2 text-sm">A: Track refund history, limit frequency, require reason, manual review for suspicious patterns.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle partial refunds?</p>
            <p className="mt-2 text-sm">A: Calculate eligible amount, deduct fees, show breakdown, process to original payment method.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
