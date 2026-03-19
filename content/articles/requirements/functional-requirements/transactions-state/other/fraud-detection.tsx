"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-trans-other-fraud-detection",
  title: "Transaction Fraud Detection",
  description: "Guide to detecting transaction fraud covering risk scoring, velocity checks, and machine learning.",
  category: "functional-requirements",
  subcategory: "transactions-state",
  slug: "transaction-fraud-detection",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "transactions", "fraud", "security", "backend"],
  relatedTopics: ["payments", "security", "machine-learning"],
};

export default function TransactionFraudDetectionArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Transaction Fraud Detection</strong> identifies and prevents 
          fraudulent transactions through risk scoring, pattern detection, and 
          machine learning models.
        </p>
      </section>

      <section>
        <h2>Fraud Signals</h2>
        <ul className="space-y-3">
          <li><strong>Velocity:</strong> Multiple transactions in short time.</li>
          <li><strong>Location:</strong> Mismatch between billing/shipping.</li>
          <li><strong>Amount:</strong> Unusual amount for user/product.</li>
          <li><strong>Device:</strong> New device, suspicious fingerprint.</li>
        </ul>
      </section>

      <section>
        <h2>Risk Scoring</h2>
        <ul className="space-y-3">
          <li><strong>Score:</strong> 0-100 risk score per transaction.</li>
          <li><strong>Thresholds:</strong> Auto-approve ({'<'}30), review (30-70), decline ({'>'}70).</li>
          <li><strong>ML Models:</strong> Trained on historical fraud data.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you balance fraud prevention vs conversion?</p>
            <p className="mt-2 text-sm">A: Risk-based approach, step-up auth for medium risk, manual review, monitor false positive rate.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle chargebacks?</p>
            <p className="mt-2 text-sm">A: Track chargeback rate, dispute with evidence, prevent repeat offenders, improve fraud detection.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
