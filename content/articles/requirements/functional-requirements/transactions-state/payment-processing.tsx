"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-trans-backend-payment-processing",
  title: "Payment Processing",
  description: "Guide to implementing payment processing covering gateway integration, authorization, capture, and refunds.",
  category: "functional-requirements",
  subcategory: "transactions-state",
  slug: "payment-processing",
  version: "extensive",
  wordCount: 6500,
  readingTime: 26,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "transactions", "payments", "processing", "backend"],
  relatedTopics: ["payment-gateway", "transactions", "refunds"],
};

export default function PaymentProcessingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Payment Processing</strong> handles the complete payment lifecycle 
          from authorization through settlement, integrating with payment gateways 
          and handling failures gracefully.
        </p>
      </section>

      <section>
        <h2>Payment Flow</h2>
        <ul className="space-y-3">
          <li><strong>Authorization:</strong> Verify funds, hold amount.</li>
          <li><strong>Capture:</strong> Transfer funds (on shipment).</li>
          <li><strong>Settlement:</strong> Funds deposited to merchant account.</li>
          <li><strong>Refund:</strong> Reverse transaction if needed.</li>
        </ul>
      </section>

      <section>
        <h2>Gateway Integration</h2>
        <ul className="space-y-3">
          <li><strong>Providers:</strong> Stripe, Adyen, Braintree, PayPal.</li>
          <li><strong>Webhooks:</strong> Async payment events.</li>
          <li><strong>Retry:</strong> Retry failed payments with backoff.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle payment failures?</p>
            <p className="mt-2 text-sm">A: Retry logic, notify customer, save cart, suggest alternative payment, dunning for subscriptions.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent fraud?</p>
            <p className="mt-2 text-sm">A: AVS, CVV check, 3D Secure, fraud scoring, velocity checks, manual review for high-risk.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
