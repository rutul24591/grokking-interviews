"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-frontend-content-sharing",
  title: "Content Sharing Interface",
  description: "Guide to implementing content sharing covering social sharing, link generation, embed codes, and sharing analytics.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "content-sharing-interface",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "content", "sharing", "social", "frontend"],
  relatedTopics: ["social-login", "discovery", "analytics"],
};

export default function ContentSharingInterfaceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Content Sharing Interface</strong> enables users to share content across 
          social platforms, via direct links, or through embed codes. It amplifies content 
          reach and drives organic growth.
        </p>
      </section>

      <section>
        <h2>Sharing Options</h2>
        <ul className="space-y-3">
          <li><strong>Social Buttons:</strong> Twitter, Facebook, LinkedIn, WhatsApp.</li>
          <li><strong>Copy Link:</strong> Generate shareable URL with tracking.</li>
          <li><strong>Embed Code:</strong> iframe or widget embed for external sites.</li>
          <li><strong>Direct Share:</strong> Email, SMS, messaging apps.</li>
        </ul>
      </section>

      <section>
        <h2>Link Generation</h2>
        <ul className="space-y-3">
          <li><strong>Short Links:</strong> Generate short, shareable URLs.</li>
          <li><strong>UTM Parameters:</strong> Track sharing source automatically.</li>
          <li><strong>Deep Links:</strong> Mobile app deep linking support.</li>
          <li><strong>Preview:</strong> Open Graph tags for link previews.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you track sharing analytics?</p>
            <p className="mt-2 text-sm">A: UTM parameters, share event tracking, referral tracking, unique share IDs for attribution.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize Open Graph previews?</p>
            <p className="mt-2 text-sm">A: Set og:title, og:description, og:image, og:url. Test with Facebook Debugger, Twitter Card Validator.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
