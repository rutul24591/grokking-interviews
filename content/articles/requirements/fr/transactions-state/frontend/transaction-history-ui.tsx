"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-trans-frontend-transaction-history",
  title: "Transaction History UI",
  description: "Guide to implementing transaction history covering transaction list, filtering, and export.",
  category: "functional-requirements",
  subcategory: "transactions-state",
  slug: "transaction-history-ui",
  version: "extensive",
  wordCount: 5000,
  readingTime: 20,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "transactions", "history", "transactions", "frontend"],
  relatedTopics: ["payments", "reporting", "accounting"],
};

export default function TransactionHistoryUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Transaction History UI</strong> provides users visibility into 
          their financial transactions, enabling tracking, reconciliation, and 
          record-keeping.
        </p>
      </section>

      <section>
        <h2>Transaction List</h2>
        <ul className="space-y-3">
          <li><strong>Display:</strong> Date, description, amount, status.</li>
          <li><strong>Grouping:</strong> By month, by type.</li>
          <li><strong>Search:</strong> Search by description, amount, date.</li>
        </ul>
      </section>

      <section>
        <h2>Filtering &amp; Export</h2>
        <ul className="space-y-3">
          <li><strong>Filters:</strong> Date range, type, status.</li>
          <li><strong>Export:</strong> CSV, PDF for records.</li>
          <li><strong>Receipts:</strong> Download individual receipts.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle large transaction histories?</p>
            <p className="mt-2 text-sm">A: Pagination, lazy loading, search indexes, archive old transactions, provide export for full history.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle disputed transactions?</p>
            <p className="mt-2 text-sm">A: Dispute flow, upload evidence, status tracking, provisional credit, resolution communication.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
