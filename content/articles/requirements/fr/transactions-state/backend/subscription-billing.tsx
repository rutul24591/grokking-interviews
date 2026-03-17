"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-trans-backend-subscription-billing",
  title: "Subscription Billing",
  description: "Guide to implementing subscription billing covering recurring charges, proration, and dunning.",
  category: "functional-requirements",
  subcategory: "transactions-state",
  slug: "subscription-billing",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "transactions", "subscription", "billing", "backend"],
  relatedTopics: ["payments", "subscriptions", "dunning"],
};

export default function SubscriptionBillingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Subscription Billing</strong> manages recurring charges for 
          subscription services, handling plan changes, proration, failed payments, 
          and dunning workflows.
        </p>
      </section>

      <section>
        <h2>Billing Cycle</h2>
        <ul className="space-y-3">
          <li><strong>Schedule:</strong> Monthly, annual billing.</li>
          <li><strong>Invoice:</strong> Generate invoice before charge.</li>
          <li><strong>Charge:</strong> Process payment on billing date.</li>
          <li><strong>Receipt:</strong> Send receipt after successful charge.</li>
        </ul>
      </section>

      <section>
        <h2>Dunning Management</h2>
        <ul className="space-y-3">
          <li><strong>Retry:</strong> Retry failed payments (3-5 attempts).</li>
          <li><strong>Notify:</strong> Email customer of payment failure.</li>
          <li><strong>Suspend:</strong> Suspend service after max retries.</li>
          <li><strong>Cancel:</strong> Cancel subscription after grace period.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle proration?</p>
            <p className="mt-2 text-sm">A: Calculate unused time credit, apply to new plan, charge/credit difference, show preview before change.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you reduce involuntary churn?</p>
            <p className="mt-2 text-sm">A: Account updater for new cards, retry logic, dunning emails, grace period, multiple retry days.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
