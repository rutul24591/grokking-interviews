"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-trans-backend-inventory-management",
  title: "Inventory Management",
  description: "Guide to implementing inventory management covering stock tracking, reservations, and oversell prevention.",
  category: "functional-requirements",
  subcategory: "transactions-state",
  slug: "inventory-management",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "transactions", "inventory", "backend", "ecommerce"],
  relatedTopics: ["order-management", "warehouse", "fulfillment"],
};

export default function InventoryManagementArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Inventory Management</strong> tracks product availability, 
          reserves stock for orders, and prevents overselling while optimizing 
          stock levels across warehouses.
        </p>
      </section>

      <section>
        <h2>Stock Tracking</h2>
        <ul className="space-y-3">
          <li><strong>Available:</strong> Stock available for sale.</li>
          <li><strong>Reserved:</strong> Stock held for pending orders.</li>
          <li><strong>In Transit:</strong> Stock being replenished.</li>
        </ul>
      </section>

      <section>
        <h2>Reservation Flow</h2>
        <ul className="space-y-3">
          <li><strong>Reserve:</strong> Hold stock on cart/checkout (15 min).</li>
          <li><strong>Confirm:</strong> Convert to sold on payment.</li>
          <li><strong>Release:</strong> Return to available on timeout/cancel.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent overselling?</p>
            <p className="mt-2 text-sm">A: Atomic decrement, reserve before payment, queue for backorder, real-time inventory sync.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle flash sales?</p>
            <p className="mt-2 text-sm">A: Pre-allocate inventory, queue orders, rate limit, virtual waiting room, cache inventory counts.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
