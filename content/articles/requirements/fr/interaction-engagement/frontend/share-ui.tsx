"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-int-frontend-share-ui",
  title: "Share UI",
  description: "Guide to implementing share interfaces covering share sheets, link copying, and external sharing.",
  category: "functional-requirements",
  subcategory: "interaction-engagement",
  slug: "share-ui",
  version: "extensive",
  wordCount: 5000,
  readingTime: 20,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "interaction", "sharing", "engagement", "frontend"],
  relatedTopics: ["social-sharing", "content-sharing", "virality"],
};

export default function ShareUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Share UI</strong> enables users to share content externally, driving 
          viral growth and engagement. It must support multiple sharing destinations 
          and provide clear feedback.
        </p>
      </section>

      <section>
        <h2>Share Options</h2>
        <ul className="space-y-3">
          <li><strong>Copy Link:</strong> Copy shareable URL to clipboard.</li>
          <li><strong>Social:</strong> Twitter, Facebook, LinkedIn, WhatsApp.</li>
          <li><strong>Direct:</strong> Email, SMS, messaging apps.</li>
          <li><strong>Embed:</strong> Generate embed code for websites.</li>
        </ul>
      </section>

      <section>
        <h2>Share Sheet</h2>
        <ul className="space-y-3">
          <li><strong>Native:</strong> Use native share sheet (Web Share API).</li>
          <li><strong>Custom:</strong> Custom modal with share options.</li>
          <li><strong>Tracking:</strong> Track share destination for analytics.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you track shares?</p>
            <p className="mt-2 text-sm">A: UTM parameters, share event tracking, unique share IDs, referral tracking.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle share preview?</p>
            <p className="mt-2 text-sm">A: Open Graph tags, Twitter Cards, test with sharing debugger tools, customize preview image/text.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
