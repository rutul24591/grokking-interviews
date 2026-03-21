"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-trans-backend-order-management",
  title: "Order Management Service",
  description: "Guide to implementing order management covering order lifecycle, state machine, and fulfillment integration.",
  category: "functional-requirements",
  subcategory: "transactions-state",
  slug: "order-management-service",
  version: "extensive",
  wordCount: 6500,
  readingTime: 26,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "transactions", "orders", "management", "backend"],
  relatedTopics: ["state-machine", "fulfillment", "inventory"],
};

export default function OrderManagementServiceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Order Management Service</strong> orchestrates the order lifecycle 
          from creation through fulfillment, managing state transitions and integrating 
          with inventory, payment, and shipping systems.
        </p>
      </section>

      <section>
        <h2>Order States</h2>
        <ul className="space-y-3">
          <li><strong>Pending:</strong> Order created, payment pending.</li>
          <li><strong>Confirmed:</strong> Payment received, processing.</li>
          <li><strong>Shipped:</strong> Package shipped, tracking available.</li>
          <li><strong>Delivered:</strong> Package delivered.</li>
          <li><strong>Cancelled/Returned:</strong> Order cancelled or returned.</li>
        </ul>
      </section>

      <section>
        <h2>State Machine</h2>
        <ul className="space-y-3">
          <li><strong>Transitions:</strong> Define valid state transitions.</li>
          <li><strong>Validation:</strong> Validate before each transition.</li>
          <li><strong>Side Effects:</strong> Trigger actions on transition.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle order modifications?</p>
            <p className="mt-2 text-sm">A: Allow before shipment, validate state, recalculate totals, notify customer, audit changes.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle split shipments?</p>
            <p className="mt-2 text-sm">A: Create sub-orders per warehouse, track independently, partial shipments, consolidated tracking.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
