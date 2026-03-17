"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-trans-frontend-checkout-flow",
  title: "Checkout Flow",
  description: "Guide to implementing checkout flows covering multi-step checkout, payment forms, and order confirmation.",
  category: "functional-requirements",
  subcategory: "transactions-state",
  slug: "checkout-flow",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "transactions", "checkout", "payments", "frontend"],
  relatedTopics: ["payment-ui", "order-management", "transactions"],
};

export default function CheckoutFlowArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Checkout Flow</strong> guides users through the purchase process, 
          collecting shipping, payment, and confirmation while minimizing abandonment 
          and maximizing conversion.
        </p>
      </section>

      <section>
        <h2>Checkout Steps</h2>
        <ul className="space-y-3">
          <li><strong>Shipping:</strong> Address entry, shipping method selection.</li>
          <li><strong>Payment:</strong> Card entry, payment method selection.</li>
          <li><strong>Review:</strong> Order summary, final confirmation.</li>
          <li><strong>Confirmation:</strong> Order number, receipt, next steps.</li>
        </ul>
      </section>

      <section>
        <h2>Optimization</h2>
        <ul className="space-y-3">
          <li><strong>Progress Indicator:</strong> Show step progress.</li>
          <li><strong>Auto-fill:</strong> Address autocomplete, saved cards.</li>
          <li><strong>Guest Checkout:</strong> Optional account creation.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you reduce checkout abandonment?</p>
            <p className="mt-2 text-sm">A: Minimize steps, show progress, guest checkout, auto-fill, multiple payment options, clear pricing.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle checkout errors?</p>
            <p className="mt-2 text-sm">A: Inline validation, clear error messages, preserve entered data, offer support contact, retry logic.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
