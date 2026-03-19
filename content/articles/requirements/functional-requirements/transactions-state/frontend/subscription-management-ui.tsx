"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-trans-frontend-subscription-management",
  title: "Subscription Management UI",
  description: "Guide to implementing subscription management covering plan selection, billing, and cancellation flows.",
  category: "functional-requirements",
  subcategory: "transactions-state",
  slug: "subscription-management-ui",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "transactions", "subscription", "billing", "frontend"],
  relatedTopics: ["payments", "billing", "subscription-service"],
};

export default function SubscriptionManagementUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Subscription Management UI</strong> enables users to manage their 
          subscriptions including plan changes, billing updates, and cancellation 
          with retention offers.
        </p>
      </section>

      <section>
        <h2>Plan Management</h2>
        <ul className="space-y-3">
          <li><strong>Plan Display:</strong> Current plan, features, price.</li>
          <li><strong>Upgrade/Downgrade:</strong> Plan comparison, prorated pricing.</li>
          <li><strong>Add-ons:</strong> Additional features, seats.</li>
        </ul>
      </section>

      <section>
        <h2>Billing Management</h2>
        <ul className="space-y-3">
          <li><strong>Payment Method:</strong> Update card, view billing history.</li>
          <li><strong>Invoices:</strong> Download PDF invoices.</li>
          <li><strong>Cancellation:</strong> Flow with retention offers, effective date.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle proration?</p>
            <p className="mt-2 text-sm">A: Calculate unused time credit, apply to new plan, charge/credit difference immediately or next billing.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you reduce churn?</p>
            <p className="mt-2 text-sm">A: Exit survey, retention offers (discount, pause), highlight value, easy reactivation, win-back campaigns.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
