"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-trans-frontend-order-tracking",
  title: "Order Tracking UI",
  description: "Guide to implementing order tracking covering status timeline, delivery updates, and tracking integration.",
  category: "functional-requirements",
  subcategory: "transactions-state",
  slug: "order-tracking-ui",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "transactions", "order-tracking", "delivery", "frontend"],
  relatedTopics: ["order-management", "notifications", "shipping"],
};

export default function OrderTrackingUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Order Tracking UI</strong> provides visibility into order status 
          and delivery progress, reducing customer anxiety and support inquiries.
        </p>
      </section>

      <section>
        <h2>Status Timeline</h2>
        <ul className="space-y-3">
          <li><strong>States:</strong> Ordered → Processing → Shipped → Out for Delivery → Delivered.</li>
          <li><strong>Visual:</strong> Progress bar with state indicators.</li>
          <li><strong>Timestamps:</strong> When each state was reached.</li>
        </ul>
      </section>

      <section>
        <h2>Delivery Tracking</h2>
        <ul className="space-y-3">
          <li><strong>Tracking Number:</strong> Link to carrier tracking.</li>
          <li><strong>Map View:</strong> Real-time delivery location.</li>
          <li><strong>ETA:</strong> Estimated delivery window.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you get delivery updates?</p>
            <p className="mt-2 text-sm">A: Carrier webhooks, polling carrier APIs, shipment tracking services (AfterShip, ShipStation).</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle delivery exceptions?</p>
            <p className="mt-2 text-sm">A: Detect from carrier, notify customer, offer options (reschedule, pickup, refund), support escalation.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
