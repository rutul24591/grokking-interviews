"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-trans-frontend-payment-ui",
  title: "Payment UI",
  description: "Guide to implementing payment interfaces covering card input, payment methods, and payment processing states.",
  category: "functional-requirements",
  subcategory: "transactions-state",
  slug: "payment-ui",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "transactions", "payment", "checkout", "frontend"],
  relatedTopics: ["checkout-flow", "payment-processing", "security"],
};

export default function PaymentUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Payment UI</strong> enables secure payment collection with 
          PCI-compliant input, multiple payment methods, and clear processing 
          feedback.
        </p>
      </section>

      <section>
        <h2>Payment Input</h2>
        <ul className="space-y-3">
          <li><strong>Card Form:</strong> Number, expiry, CVV, name.</li>
          <li><strong>Validation:</strong> Luhn algorithm, real-time validation.</li>
          <li><strong>PCI Compliance:</strong> Hosted fields or payment SDK.</li>
        </ul>
      </section>

      <section>
        <h2>Payment Methods</h2>
        <ul className="space-y-3">
          <li><strong>Cards:</strong> Credit, debit cards.</li>
          <li><strong>Digital Wallets:</strong> Apple Pay, Google Pay.</li>
          <li><strong>Alternative:</strong> PayPal, bank transfer, BNPL.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure PCI compliance?</p>
            <p className="mt-2 text-sm">A: Use hosted fields (Stripe Elements), never touch card data, SAQ-A compliance, regular audits.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle payment failures?</p>
            <p className="mt-2 text-sm">A: Clear error messages, suggest alternatives, retry logic, save cart, email recovery.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
